import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { chatHistoryConfig } from "../src/lib/ai/chat-history-config";
import { ORG_PERMISSIONS } from "../src/lib/auth/rbac";
import {
  requireCurrentUser,
  requireOrgPermission,
  type OrganizationAuthContext,
} from "./lib/auth";

type ChatCtx = QueryCtx | MutationCtx;
const DEFAULT_THREAD_TITLE = "New chat";

async function requireOrganizationThread(
  ctx: ChatCtx,
  auth: OrganizationAuthContext,
  threadId: Id<"chatThreads">,
) {
  const thread = await ctx.db.get(threadId);
  if (!thread) {
    throw new Error("Chat thread not found");
  }

  if (thread.orgId !== auth.orgId) {
    throw new Error("Forbidden: thread belongs to another organization");
  }

  return thread;
}

function normalizeThreadTitle(raw: string): string {
  const collapsed = raw.replace(/\s+/g, " ").trim();
  if (!collapsed) {
    return DEFAULT_THREAD_TITLE;
  }

  return collapsed.slice(0, chatHistoryConfig.threadTitleMaxLength);
}

async function enforceThreadMessageBound(
  ctx: MutationCtx,
  threadId: Id<"chatThreads">,
) {
  while (true) {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_thread_id", (q) => q.eq("threadId", threadId))
      .order("asc")
      .take(chatHistoryConfig.maxMessagesPerThread + 1);

    if (messages.length <= chatHistoryConfig.maxMessagesPerThread) {
      return;
    }

    const overflow = messages.length - chatHistoryConfig.maxMessagesPerThread;
    await Promise.all(
      messages.slice(0, overflow).map((message) => ctx.db.delete(message._id)),
    );
  }
}

async function enforceThreadCountBound(ctx: MutationCtx, orgId: string) {
  while (true) {
    const threads = await ctx.db
      .query("chatThreads")
      .withIndex("by_org_id_last_message", (q) => q.eq("orgId", orgId))
      .order("asc")
      .take(chatHistoryConfig.maxThreadsPerUser + 1);

    if (threads.length <= chatHistoryConfig.maxThreadsPerUser) {
      return;
    }

    const overflow = threads.length - chatHistoryConfig.maxThreadsPerUser;
    const threadsToDelete = threads.slice(0, overflow);
    for (const thread of threadsToDelete) {
      const threadMessages = await ctx.db
        .query("chatMessages")
        .withIndex("by_thread_id", (q) => q.eq("threadId", thread._id))
        .collect();
      await Promise.all(threadMessages.map((message) => ctx.db.delete(message._id)));
      await ctx.db.delete(thread._id);
    }
  }
}

export const listOrganizationChatThreads = query({
  args: {},
  handler: async (ctx) => {
    if (!chatHistoryConfig.enabled) {
      return [];
    }

    let auth;
    try {
      ({ auth } = await requireCurrentUser(ctx));
      requireOrgPermission(auth, ORG_PERMISSIONS.CHAT_READ);
    } catch {
      return [];
    }

    return await ctx.db
      .query("chatThreads")
      .withIndex("by_org_id_last_message", (q) => q.eq("orgId", auth.orgId))
      .order("desc")
      .take(chatHistoryConfig.queryLimit);
  },
});

export const createChatThread = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!chatHistoryConfig.enabled) {
      return null;
    }

    const { auth, user } = await requireCurrentUser(ctx);
    requireOrgPermission(auth, ORG_PERMISSIONS.CHAT_CREATE);

    const now = Date.now();
    const threadId = await ctx.db.insert("chatThreads", {
      orgId: auth.orgId,
      createdByUserId: user._id,
      title: normalizeThreadTitle(args.title ?? DEFAULT_THREAD_TITLE),
      lastMessageAt: now,
    });

    await enforceThreadCountBound(ctx, auth.orgId);
    return threadId;
  },
});

export const getThreadMessages = query({
  args: { threadId: v.id("chatThreads") },
  handler: async (ctx, args) => {
    if (!chatHistoryConfig.enabled) {
      return [];
    }

    let auth;
    try {
      ({ auth } = await requireCurrentUser(ctx));
      requireOrgPermission(auth, ORG_PERMISSIONS.CHAT_READ);
    } catch {
      return [];
    }

    await requireOrganizationThread(ctx, auth, args.threadId);

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .take(chatHistoryConfig.queryLimit);

    return messages.reverse();
  },
});

export const saveUserChatMessage = mutation({
  args: {
    threadId: v.id("chatThreads"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    if (!chatHistoryConfig.enabled) {
      return null;
    }

    const { auth, user } = await requireCurrentUser(ctx);
    requireOrgPermission(auth, ORG_PERMISSIONS.CHAT_CREATE);

    const thread = await requireOrganizationThread(ctx, auth, args.threadId);
    const content = args.content.trim();

    if (!content) {
      throw new Error("Message content is required");
    }

    if (content.length > chatHistoryConfig.maxMessageLength) {
      throw new Error(
        `Message too long: maximum ${chatHistoryConfig.maxMessageLength} characters.`,
      );
    }

    const insertedId = await ctx.db.insert("chatMessages", {
      orgId: auth.orgId,
      createdByUserId: user._id,
      threadId: args.threadId,
      role: args.role,
      content,
    });

    await ctx.db.patch(args.threadId, { lastMessageAt: Date.now() });

    if (args.role === "user" && thread.title === DEFAULT_THREAD_TITLE) {
      await ctx.db.patch(args.threadId, { title: normalizeThreadTitle(content) });
    }

    await enforceThreadMessageBound(ctx, args.threadId);

    return insertedId;
  },
});
