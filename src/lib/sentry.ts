import * as Sentry from "@sentry/nextjs";

/**
 * Capture an exception with optional additional context.
 * Use this instead of direct Sentry imports to centralize error tracking.
 */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message (non-exception) event with an optional severity level.
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
) {
  Sentry.captureMessage(message, level);
}

/**
 * Add a breadcrumb for tracking user actions leading up to an error.
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: "info",
  });
}

/**
 * Set Sentry user context for associating errors with an authenticated user.
 * Call with null to clear the user context on sign-out.
 */
export function setSentryUser(
  user: { id: string; email?: string; username?: string } | null,
) {
  Sentry.setUser(user);
}
