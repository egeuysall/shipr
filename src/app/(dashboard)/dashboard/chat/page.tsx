"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { UserAvatar } from "@clerk/nextjs";
import type { UIMessage } from "ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Loading03Icon,
  RoboticIcon,
} from "@hugeicons/core-free-icons";

const SUGGESTED_PROMPTS = [
  "Give me a launch checklist for a SaaS MVP this week.",
  "Help me define Free vs Pro plan boundaries for B2B SaaS.",
  "Draft onboarding copy for a new user dashboard.",
  "What analytics events should this app track first?",
];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeHref(href: string): string {
  const normalized = href.trim().toLowerCase();
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:") ||
    normalized.startsWith("/") ||
    normalized.startsWith("#")
  ) {
    return href;
  }
  return "#";
}

function renderMarkdownToHtml(markdown: string): string {
  const renderer = new marked.Renderer();

  renderer.html = () => "";

  renderer.link = function ({ href, title, tokens }) {
    const safeHref = sanitizeHref(href);
    const text = this.parser.parseInline(tokens);
    const safeTitle = title ? escapeHtml(title) : "";
    const titleAttr = safeTitle ? ` title="${safeTitle}"` : "";
    const isExternal =
      safeHref.startsWith("http://") || safeHref.startsWith("https://");
    const relAttr = isExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";
    return `<a href="${escapeHtml(safeHref)}"${titleAttr}${relAttr}>${text}</a>`;
  };

  renderer.image = ({ href, text }) => {
    const safeHref = sanitizeHref(href);
    const safeText = escapeHtml(text || "image");
    return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  };

  return marked.parse(markdown, {
    async: false,
    gfm: true,
    breaks: true,
    renderer,
  }) as string;
}

function getReadableChatErrorMessage(error: Error): string {
  const rawMessage = error.message?.trim();
  if (!rawMessage) {
    return "Chat request failed. Check your AI Gateway key and server config.";
  }

  const firstBrace = rawMessage.indexOf("{");
  const lastBrace = rawMessage.lastIndexOf("}");
  const maybeJson =
    firstBrace >= 0 && lastBrace > firstBrace
      ? rawMessage.slice(firstBrace, lastBrace + 1)
      : rawMessage;

  if (maybeJson.startsWith("{")) {
    try {
      const parsed = JSON.parse(maybeJson) as { error?: unknown };
      if (typeof parsed.error === "string" && parsed.error.trim().length > 0) {
        return parsed.error;
      }
    } catch {
      return rawMessage;
    }
  }

  return rawMessage;
}

function renderMessagePart(
  message: UIMessage,
  part: UIMessage["parts"][number],
  index: number,
): React.ReactNode {
  if (part.type === "text") {
    if (message.role === "user") {
      return (
        <p
          key={`${message.id}-${index}`}
          className="whitespace-pre-wrap break-words text-sm"
        >
          {part.text}
        </p>
      );
    }

    return (
      <div
        key={`${message.id}-${index}`}
        className={cn(
          "text-sm leading-6",
          "[&_h1]:mt-3 [&_h1]:text-lg [&_h1]:font-semibold",
          "[&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold",
          "[&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold",
          "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
          "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
          "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_li]:my-1",
          "[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]",
          "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:bg-muted/40 [&_pre]:p-3",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
          "[&_a]:underline [&_a]:underline-offset-4",
          "[overflow-wrap:anywhere]",
        )}
        dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(part.text) }}
      />
    );
  }

  // Internal AI SDK step markers are useful for orchestration but not for end users.
  if (part.type === "step-start") {
    return null;
  }

  if (part.type.startsWith("tool-")) {
    return (
      <pre
        key={`${message.id}-${index}`}
        className="overflow-x-auto rounded-md border bg-background p-2 text-xs"
      >
        {JSON.stringify(part, null, 2)}
      </pre>
    );
  }

  return null;
}

function MessageBubble({
  message,
}: {
  message: UIMessage;
}): React.ReactElement {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser ? (
        <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted/50">
          <HugeiconsIcon
            icon={RoboticIcon}
            strokeWidth={2}
            className="h-4 w-4"
          />
        </div>
      ) : null}

      <div className="max-w-[90%] space-y-2 break-words rounded-lg border border-border bg-background px-4 py-3 shadow-sm">
        {message.parts.map((part, index) =>
          renderMessagePart(message, part, index),
        )}
      </div>

      {isUser ? (
        <div className="mt-1 flex shrink-0 items-center justify-center rounded-full">
          <UserAvatar
            appearance={{
              elements: {
                userAvatarBox: "h-7 w-7",
              },
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function ChatPage(): React.ReactElement {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    onError: (error) => {
      toast.error(getReadableChatErrorMessage(error));
    },
  });
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const isSending = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const element = messageContainerRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submitMessage = (text: string): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        <p className="text-muted-foreground">
          Built for builders: ask product, growth, or implementation questions.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="h-[clamp(30rem,74dvh,50rem)] overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-muted/40 via-background to-muted/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">AI Assistant</CardTitle>
                <CardDescription>
                  Connected to chat, optimized for SaaS workflows.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex h-full min-h-0 flex-col gap-0 p-0">
            <div
              ref={messageContainerRef}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-gradient-to-b from-background to-muted/20 p-4"
            >
              {!hasMessages ? (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed bg-background/70 p-6 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border bg-muted/50">
                    <HugeiconsIcon
                      icon={RoboticIcon}
                      strokeWidth={2}
                      className="h-5 w-5"
                    />
                  </div>
                  <p className="text-sm font-medium">Start a conversation</p>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Ask about pricing strategy, onboarding UX, release
                    checklists, or technical architecture.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
            </div>

            <div className="shrink-0 border-t bg-background p-4">
              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitMessage(input);
                }}
              >
                <Input
                  value={input}
                  onChange={(event) => setInput(event.currentTarget.value)}
                  placeholder="Ask for a SaaS plan, architecture, or implementation detail..."
                  className="h-10"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSending || input.trim().length === 0}
                >
                  {isSending ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        strokeWidth={2}
                        className="h-4 w-4 animate-spin"
                      />
                      Sending
                    </>
                  ) : (
                    <>
                      Send
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        className="h-4 w-4"
                      />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => submitMessage(prompt)}
                    disabled={isSending}
                    className="max-w-full"
                  >
                    <span className="truncate">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
