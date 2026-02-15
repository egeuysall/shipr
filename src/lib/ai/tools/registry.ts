import "server-only";

import { tool } from "ai";
import { z } from "zod";

const allChatTools = {
  getCurrentDateTime: tool({
    description:
      "Get the current date and time details in UTC and the server locale.",
    inputSchema: z.object({}),
    execute: async () => {
      const now = new Date();
      return {
        iso: now.toISOString(),
        utc: now.toUTCString(),
        unixMs: now.getTime(),
        locale: now.toLocaleString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown",
      };
    },
  }),
  calculate: tool({
    description:
      "Run a basic arithmetic operation with two numbers. Use this for exact math.",
    inputSchema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
      operator: z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("Math operator to apply"),
    }),
    execute: async ({ a, b, operator }) => {
      if (operator === "divide" && b === 0) {
        return {
          error: "Division by zero is not allowed.",
          a,
          b,
          operator,
        };
      }

      const result =
        operator === "add"
          ? a + b
          : operator === "subtract"
            ? a - b
            : operator === "multiply"
              ? a * b
              : a / b;

      return {
        a,
        b,
        operator,
        result,
      };
    },
  }),
} as const;

export type ChatToolName = keyof typeof allChatTools;

export const CHAT_TOOL_NAMES = Object.keys(allChatTools) as ChatToolName[];

export function resolveChatToolNames(
  enabledTools: readonly string[],
): ChatToolName[] {
  return enabledTools.filter((toolName): toolName is ChatToolName =>
    CHAT_TOOL_NAMES.includes(toolName as ChatToolName),
  );
}

export function resolveChatTools(enabledTools: readonly string[]) {
  const tools = Object.fromEntries(
    resolveChatToolNames(enabledTools).map((toolName) => [
      toolName,
      allChatTools[toolName],
    ]),
  );

  return tools;
}
