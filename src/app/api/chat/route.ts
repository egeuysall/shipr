import { auth, clerkClient } from "@clerk/nextjs/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import type { UIMessage } from "ai";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { chatConfig, getChatPlanLimitsForPlan } from "@/lib/ai/chat-config";
import {
  resolveChatToolNames,
  resolveChatTools,
} from "@/lib/ai/tools/registry";
import {
  hasOrgPermission,
  ORG_BILLING_PLANS,
  ORG_PERMISSIONS,
  resolveOrganizationBillingPlanFromHas,
} from "@/lib/auth/rbac";
import { hasTrustedOrigin } from "@/lib/security/request";

export const maxDuration = 30;
const enabledToolNames = resolveChatToolNames(chatConfig.enabledTools);
const tools = resolveChatTools(enabledToolNames);
const CHAT_USAGE_METADATA_KEY = "chatMessagesSentByOrg";
const CHAT_LIMIT_METADATA_KEY = "chatMessageLimitByOrg";
const CHAT_LAST_MESSAGE_AT_KEY = "chatLastMessageAtByOrg";
const CHAT_FIRST_MESSAGE_AT_KEY = "chatFirstMessageAtByOrg";

const limiters = new Map<string, ReturnType<typeof rateLimit>>();

function getPlanLimiter(params: {
  intervalMs: number;
  maxRequests: number;
}): ReturnType<typeof rateLimit> {
  const key = `${params.intervalMs}:${params.maxRequests}`;
  const existing = limiters.get(key);
  if (existing) {
    return existing;
  }

  const created = rateLimit({
    interval: params.intervalMs,
    limit: params.maxRequests,
  });
  limiters.set(key, created);
  return created;
}

function isValidBody(body: unknown): body is { messages: UIMessage[] } {
  if (typeof body !== "object" || body === null) return false;
  const payload = body as Record<string, unknown>;
  return Array.isArray(payload.messages);
}

function getPerOrgMetadataMap(
  privateMetadata: unknown,
  key: string,
): Record<string, unknown> {
  if (typeof privateMetadata !== "object" || privateMetadata === null) return {};
  const metadata = privateMetadata as Record<string, unknown>;
  const value = metadata[key];
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function getUserMessageCount(params: {
  privateMetadata: unknown;
  orgId: string;
}): number {
  const map = getPerOrgMetadataMap(params.privateMetadata, CHAT_USAGE_METADATA_KEY);
  const value = map[params.orgId];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function claimLifetimeChatMessage(
  userId: string,
  orgId: string,
  limit: number,
): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const usedCount = getUserMessageCount({
    privateMetadata: user.privateMetadata,
    orgId,
  });

  if (usedCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  const nowIso = new Date().toISOString();
  const privateMetadata = (user.privateMetadata ?? {}) as Record<
    string,
    unknown
  >;
  const usageByOrg = getPerOrgMetadataMap(privateMetadata, CHAT_USAGE_METADATA_KEY);
  const limitByOrg = getPerOrgMetadataMap(privateMetadata, CHAT_LIMIT_METADATA_KEY);
  const firstMessageByOrg = getPerOrgMetadataMap(
    privateMetadata,
    CHAT_FIRST_MESSAGE_AT_KEY,
  );
  const lastMessageByOrg = getPerOrgMetadataMap(
    privateMetadata,
    CHAT_LAST_MESSAGE_AT_KEY,
  );

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...privateMetadata,
      [CHAT_USAGE_METADATA_KEY]: {
        ...usageByOrg,
        [orgId]: usedCount + 1,
      },
      [CHAT_LIMIT_METADATA_KEY]: {
        ...limitByOrg,
        [orgId]: limit,
      },
      [CHAT_FIRST_MESSAGE_AT_KEY]: {
        ...firstMessageByOrg,
        [orgId]: firstMessageByOrg[orgId] ?? nowIso,
      },
      [CHAT_LAST_MESSAGE_AT_KEY]: {
        ...lastMessageByOrg,
        [orgId]: nowIso,
      },
    },
  });

  return {
    allowed: true,
    remaining: Math.max(0, limit - (usedCount + 1)),
  };
}

function hasAtLeastOneUserMessage(messages: UIMessage[]): boolean {
  return messages.some((message) => message.role === "user");
}

export async function POST(req: Request): Promise<Response> {
  if (!hasTrustedOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const { userId, orgId, orgRole, has } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!orgId) {
    return NextResponse.json(
      { error: "Active organization required." },
      { status: 403 },
    );
  }
  if (
    !hasOrgPermission({
      orgRole,
      has,
      permission: ORG_PERMISSIONS.CHAT_CREATE,
    })
  ) {
    return NextResponse.json(
      { error: "Forbidden: missing chat permission." },
      { status: 403 },
    );
  }

  const organizationPlan = resolveOrganizationBillingPlanFromHas({
    orgId,
    has,
  });
  const chatPlanLimits = getChatPlanLimitsForPlan(organizationPlan);
  const limiter = getPlanLimiter({
    intervalMs: chatPlanLimits.rateLimit.intervalMs,
    maxRequests: chatPlanLimits.rateLimit.maxRequests,
  });

  const forwardedFor = req.headers.get("x-forwarded-for") ?? "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const { success, remaining, reset } = limiter.check(`${userId}:${orgId}:${ip}`);
  const rateLimitHeaders = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(reset),
    "X-AI-Model": chatConfig.model,
    "X-AI-Tools": enabledToolNames.join(",") || "none",
    "X-AI-Organization-Plan": organizationPlan,
    "X-AI-User-Message-Limit": chatConfig.lifetimeMessageLimit.enabled
      ? String(chatPlanLimits.lifetimeMessageLimit.maxMessages)
      : "disabled",
  };

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Missing AI_GATEWAY_API_KEY. Add it to your environment to enable chat.",
      },
      { status: 500, headers: rateLimitHeaders },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: rateLimitHeaders },
    );
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: "Invalid payload. Expected { messages: UIMessage[] }." },
      { status: 400, headers: rateLimitHeaders },
    );
  }

  if (!hasAtLeastOneUserMessage(body.messages)) {
    return NextResponse.json(
      { error: "At least one user message is required." },
      { status: 400, headers: rateLimitHeaders },
    );
  }

  let remainingMessagesHeader = "unlimited";
  if (chatConfig.lifetimeMessageLimit.enabled) {
    const messageAllowance = await claimLifetimeChatMessage(
      userId,
      orgId,
      chatPlanLimits.lifetimeMessageLimit.maxMessages,
    );
    if (!messageAllowance.allowed) {
      const lifetimeLimit = chatPlanLimits.lifetimeMessageLimit.maxMessages;
      const lifetimeLabel = `${lifetimeLimit} lifetime message${lifetimeLimit === 1 ? "" : "s"}`;
      const planLabel =
        organizationPlan === ORG_BILLING_PLANS.ORGANIZATIONS
          ? "organizations"
          : "free";
      return NextResponse.json(
        {
          code: "MESSAGE_LIMIT_REACHED",
          error: `Message limit reached. The ${planLabel} plan allows only ${lifetimeLabel} per account.`,
        },
        {
          status: 403,
          headers: {
            ...rateLimitHeaders,
            "X-AI-User-Messages-Remaining": "0",
          },
        },
      );
    }

    remainingMessagesHeader = String(messageAllowance.remaining);
  }

  const result = streamText({
    model: chatConfig.model,
    system: chatConfig.systemPrompt,
    stopWhen: stepCountIs(chatConfig.maxSteps),
    tools,
    messages: await convertToModelMessages(body.messages),
  });

  const response = result.toUIMessageStreamResponse();
  for (const [key, value] of Object.entries(rateLimitHeaders)) {
    response.headers.set(key, value);
  }
  response.headers.set("X-AI-User-Messages-Remaining", remainingMessagesHeader);

  return response;
}
