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

export const chatHistoryConfig = {
  enabled: readBooleanEnv("AI_CHAT_HISTORY_ENABLED", true),
  maxMessageLength: readPositiveIntEnv("AI_CHAT_HISTORY_MAX_MESSAGE_LENGTH", 8_000),
  maxMessagesPerThread: readPositiveIntEnv(
    "AI_CHAT_HISTORY_MAX_MESSAGES_PER_THREAD",
    120,
  ),
  maxThreadsPerUser: readPositiveIntEnv("AI_CHAT_HISTORY_MAX_THREADS", 50),
  threadTitleMaxLength: readPositiveIntEnv(
    "AI_CHAT_HISTORY_THREAD_TITLE_MAX_LENGTH",
    80,
  ),
  queryLimit: readPositiveIntEnv("AI_CHAT_HISTORY_QUERY_LIMIT", 200),
} as const;
