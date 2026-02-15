import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { chatHistoryConfig } from "../src/lib/ai/chat-history-config";

type ChatCtx = QueryCtx | MutationCtx;
const DEFAULT_THREAD_TITLE = "New chat";

async function requireCurrentUser(ctx: ChatCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: authentication required");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function requireOwnedThread(
  ctx: ChatCtx,
  userId: Id<"users">,
  threadId: Id<"chatThreads">,
) {
  const thread = await ctx.db.get(threadId);
  if (!thread) {
    throw new Error("Chat thread not found");
  }

  if (thread.userId !== userId) {
    throw new Error("Forbidden: you do not own this chat thread");
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

async function enforceThreadCountBound(ctx: MutationCtx, userId: Id<"users">) {
  while (true) {
    const threads = await ctx.db
      .query("chatThreads")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
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

export const listUserChatThreads = query({
  args: {},
  handler: async (ctx) => {
    if (!chatHistoryConfig.enabled) {
      return [];
    }

    let user;
    try {
      user = await requireCurrentUser(ctx);
    } catch {
      return [];
    }

    return await ctx.db
      .query("chatThreads")
      .withIndex("by_user_id_last_message", (q) => q.eq("userId", user._id))
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

    const user = await requireCurrentUser(ctx);
    const now = Date.now();
    const threadId = await ctx.db.insert("chatThreads", {
      userId: user._id,
      title: normalizeThreadTitle(args.title ?? DEFAULT_THREAD_TITLE),
      lastMessageAt: now,
    });

    await enforceThreadCountBound(ctx, user._id);
    return threadId;
  },
});

export const getThreadMessages = query({
  args: { threadId: v.id("chatThreads") },
  handler: async (ctx, args) => {
    if (!chatHistoryConfig.enabled) {
      return [];
    }

    let user;
    try {
      user = await requireCurrentUser(ctx);
    } catch {
      return [];
    }

    await requireOwnedThread(ctx, user._id, args.threadId);

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

    const user = await requireCurrentUser(ctx);
    const thread = await requireOwnedThread(ctx, user._id, args.threadId);
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
      userId: user._id,
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
