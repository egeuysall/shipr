# AI

## Overview

Shipr includes a production-ready chat module powered by Vercel AI SDK and the AI Gateway.

- UI route: `/dashboard/chat`
- API route: `POST /api/chat`
- Server config: `src/lib/ai/chat-config.ts`
- Tool registry: `src/lib/ai/tools/registry.ts`

## Request Flow

1. User sends a message from `src/app/(dashboard)/dashboard/chat/page.tsx`
2. `useChat` sends to `POST /api/chat`
3. The route enforces:
   - Clerk auth
   - per-user/IP rate limiting
   - optional lifetime message cap
4. `streamText` streams model output and optional tool calls
5. UI renders streamed parts, including Markdown-safe assistant text

## Environment Variables

| Variable                                 | Purpose                               | Default                        |
| ---------------------------------------- | ------------------------------------- | ------------------------------ |
| `AI_GATEWAY_API_KEY`                     | Enables Vercel AI Gateway calls       | Required                       |
| `AI_CHAT_MODEL`                          | Model ID for chat generation          | `openai/gpt-4.1-mini`          |
| `AI_CHAT_SYSTEM_PROMPT`                  | Base assistant behavior               | Shipr SaaS builder prompt      |
| `AI_CHAT_TOOLS`                          | Comma-separated enabled tool names    | `getCurrentDateTime,calculate` |
| `AI_CHAT_MAX_STEPS`                      | Max model steps/tool iterations       | `5`                            |
| `AI_CHAT_RATE_LIMIT_MAX_REQUESTS`        | Requests allowed per window           | `20`                           |
| `AI_CHAT_RATE_LIMIT_WINDOW_MS`           | Rate-limit window size                | `60000`                        |
| `AI_CHAT_ENFORCE_LIFETIME_MESSAGE_LIMIT` | Enable one-time lifetime cap behavior | `true`                         |
| `AI_CHAT_LIFETIME_MESSAGE_LIMIT`         | Lifetime message cap when enabled     | `1`                            |

## Error UX

The chat UI uses Sonner to surface API errors as toasts rather than exposing raw JSON payload strings in the message panel.

- Toaster component: `src/components/ui/sonner.tsx`
- Global mount: `src/app/layout.tsx`
- Error handling hook: `useChat({ onError })` in `src/app/(dashboard)/dashboard/chat/page.tsx`

## Extending For Builders

### Add a new tool

1. Define the tool in `src/lib/ai/tools/registry.ts`
2. Add its key to `AI_CHAT_TOOLS` in env
3. Keep `/api/chat` unchanged so the integration remains modular

### Change model behavior

1. Update `AI_CHAT_MODEL` and `AI_CHAT_SYSTEM_PROMPT`
2. Optionally adjust `AI_CHAT_MAX_STEPS`
3. Keep the same UI and route contracts to avoid client churn

### Disable boilerplate anti-abuse cap

Set:

```env
AI_CHAT_ENFORCE_LIFETIME_MESSAGE_LIMIT=false
```

No code change is required.

## Security Notes

- Chat is protected by Clerk auth (`401` when unauthenticated).
- Rate limiting is applied before model generation.
- Tool execution is allowlist-based through the registry.
- Lifetime message cap is server-side and enforced in the API route.
