import "server-only";
import {
  ORG_BILLING_PLANS,
  type OrganizationBillingPlan,
} from "@/lib/auth/rbac";

const DEFAULT_CHAT_MODEL = "openai/gpt-4.1-mini";
const DEFAULT_SYSTEM_PROMPT =
  "You are Shipr's AI assistant. Help builders ship production-ready SaaS faster with practical, actionable guidance.";
const DEFAULT_CHAT_TOOLS = ["getCurrentDateTime", "calculate"];
const DEFAULT_LIFETIME_MESSAGE_LIMIT = 1;

function readStringEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function readPositiveIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;

  return Math.floor(parsed);
}

function readBooleanEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (!value) return fallback;

  if (["1", "true", "yes", "on"].includes(value)) return true;
  if (["0", "false", "no", "off"].includes(value)) return false;

  return fallback;
}

function readCsvEnv(name: string, fallback: string[]): string[] {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

export const chatConfig = {
  model: readStringEnv("AI_CHAT_MODEL", DEFAULT_CHAT_MODEL),
  systemPrompt: readStringEnv("AI_CHAT_SYSTEM_PROMPT", DEFAULT_SYSTEM_PROMPT),
  maxSteps: readPositiveIntEnv("AI_CHAT_MAX_STEPS", 5),
  enabledTools: readCsvEnv("AI_CHAT_TOOLS", DEFAULT_CHAT_TOOLS),
  rateLimit: {
    intervalMs: readPositiveIntEnv("AI_CHAT_RATE_LIMIT_WINDOW_MS", 60_000),
    maxRequests: readPositiveIntEnv("AI_CHAT_RATE_LIMIT_MAX_REQUESTS", 20),
  },
  lifetimeMessageLimit: {
    enabled: readBooleanEnv("AI_CHAT_ENFORCE_LIFETIME_MESSAGE_LIMIT", true),
    maxMessages: readPositiveIntEnv(
      "AI_CHAT_LIFETIME_MESSAGE_LIMIT",
      DEFAULT_LIFETIME_MESSAGE_LIMIT,
    ),
  },
} as const;

const FREE_CHAT_PLAN_LIMITS = {
  rateLimit: {
    intervalMs: readPositiveIntEnv(
      "AI_CHAT_RATE_LIMIT_WINDOW_MS_FREE",
      chatConfig.rateLimit.intervalMs,
    ),
    maxRequests: readPositiveIntEnv(
      "AI_CHAT_RATE_LIMIT_MAX_REQUESTS_FREE",
      chatConfig.rateLimit.maxRequests,
    ),
  },
  lifetimeMessageLimit: {
    maxMessages: readPositiveIntEnv(
      "AI_CHAT_LIFETIME_MESSAGE_LIMIT_FREE",
      chatConfig.lifetimeMessageLimit.maxMessages,
    ),
  },
};

const ORGANIZATIONS_CHAT_PLAN_LIMITS = {
  rateLimit: {
    intervalMs: readPositiveIntEnv(
      "AI_CHAT_RATE_LIMIT_WINDOW_MS_ORGANIZATIONS",
      FREE_CHAT_PLAN_LIMITS.rateLimit.intervalMs,
    ),
    maxRequests: readPositiveIntEnv(
      "AI_CHAT_RATE_LIMIT_MAX_REQUESTS_ORGANIZATIONS",
      FREE_CHAT_PLAN_LIMITS.rateLimit.maxRequests,
    ),
  },
  lifetimeMessageLimit: {
    maxMessages: readPositiveIntEnv(
      "AI_CHAT_LIFETIME_MESSAGE_LIMIT_ORGANIZATIONS",
      FREE_CHAT_PLAN_LIMITS.lifetimeMessageLimit.maxMessages,
    ),
  },
};

export function getChatPlanLimitsForPlan(plan: OrganizationBillingPlan): {
  rateLimit: {
    intervalMs: number;
    maxRequests: number;
  };
  lifetimeMessageLimit: {
    maxMessages: number;
  };
} {
  return plan === ORG_BILLING_PLANS.ORGANIZATIONS
    ? ORGANIZATIONS_CHAT_PLAN_LIMITS
    : FREE_CHAT_PLAN_LIMITS;
}
