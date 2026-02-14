"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ReloadIcon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                strokeWidth={2}
                className="h-6 w-6 text-destructive"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an error while loading this page
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Error Details:</p>
              <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1">
              <HugeiconsIcon icon={ReloadIcon} strokeWidth={2} />
              Try Again
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => (window.location.href = "/")}
            >
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
