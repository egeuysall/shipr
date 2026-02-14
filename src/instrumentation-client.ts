// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Lower sample rate in production to reduce costs and noise
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Do NOT send PII by default: opt-in only when explicitly needed
  sendDefaultPii: false,

  // Only enable debug logging in development
  debug: false,

  // Filter out noisy or irrelevant errors
  ignoreErrors: [
    // Browser extensions and third-party scripts
    "ResizeObserver loop",
    "ResizeObserver loop completed with undelivered notifications",
    // Network errors that are expected
    "Failed to fetch",
    "Load failed",
    "NetworkError",
    // User-initiated navigation
    "AbortError",
  ],

  beforeSend(event) {
    // Strip sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.category === "xhr" || breadcrumb.category === "fetch") {
          // Remove authorization headers from network breadcrumbs
          if (breadcrumb.data?.headers) {
            delete breadcrumb.data.headers;
          }
        }
        return breadcrumb;
      });
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
