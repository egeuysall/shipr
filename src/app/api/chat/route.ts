import { auth, clerkClient } from "@clerk/nextjs/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import type { UIMessage } from "ai";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { chatConfig } from "@/lib/ai/chat-config";
import {
  resolveChatToolNames,
  resolveChatTools,
} from "@/lib/ai/tools/registry";

export const maxDuration = 30;
const enabledToolNames = resolveChatToolNames(chatConfig.enabledTools);
const tools = resolveChatTools(enabledToolNames);
const CHAT_USAGE_METADATA_KEY = "chatMessagesSent";
const CHAT_LIMIT_METADATA_KEY = "chatMessageLimit";
const CHAT_LAST_MESSAGE_AT_KEY = "chatLastMessageAt";
const CHAT_FIRST_MESSAGE_AT_KEY = "chatFirstMessageAt";

const limiter = rateLimit({
  interval: chatConfig.rateLimit.intervalMs,
  limit: chatConfig.rateLimit.maxRequests,
});

function isValidBody(body: unknown): body is { messages: UIMessage[] } {
  if (typeof body !== "object" || body === null) return false;
  const payload = body as Record<string, unknown>;
  return Array.isArray(payload.messages);
}

function getUserMessageCount(privateMetadata: unknown): number {
  if (typeof privateMetadata !== "object" || privateMetadata === null) return 0;
  const metadata = privateMetadata as Record<string, unknown>;
  const value = metadata[CHAT_USAGE_METADATA_KEY];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function claimLifetimeChatMessage(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const limit = chatConfig.lifetimeMessageLimit.maxMessages;
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const usedCount = getUserMessageCount(user.privateMetadata);

  if (usedCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  const nowIso = new Date().toISOString();
  const privateMetadata = (user.privateMetadata ?? {}) as Record<
    string,
    unknown
  >;

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...privateMetadata,
      [CHAT_USAGE_METADATA_KEY]: usedCount + 1,
      [CHAT_LIMIT_METADATA_KEY]: limit,
      [CHAT_FIRST_MESSAGE_AT_KEY]:
        privateMetadata[CHAT_FIRST_MESSAGE_AT_KEY] ?? nowIso,
      [CHAT_LAST_MESSAGE_AT_KEY]: nowIso,
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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const forwardedFor = req.headers.get("x-forwarded-for") ?? "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const { success, remaining, reset } = limiter.check(`${userId}:${ip}`);
  const rateLimitHeaders = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(reset),
    "X-AI-Model": chatConfig.model,
    "X-AI-Tools": enabledToolNames.join(",") || "none",
    "X-AI-User-Message-Limit": chatConfig.lifetimeMessageLimit.enabled
      ? String(chatConfig.lifetimeMessageLimit.maxMessages)
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
    const messageAllowance = await claimLifetimeChatMessage(userId);
    if (!messageAllowance.allowed) {
      const lifetimeLimit = chatConfig.lifetimeMessageLimit.maxMessages;
      const lifetimeLabel = `${lifetimeLimit} lifetime message${lifetimeLimit === 1 ? "" : "s"}`;
      return NextResponse.json(
        {
          code: "MESSAGE_LIMIT_REACHED",
          error: `Message limit reached. This boilerplate allows only ${lifetimeLabel} per account.`,
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
