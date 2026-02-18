export const LEGAL_LAST_UPDATED = "February 17, 2026";

export const LEGAL_STACK_SUMMARY =
  "Next.js 16, Clerk, Convex, PostHog, Sentry, Vercel Analytics, Vercel Speed Insights, and Resend";

export const LEGAL_PROCESSORS = [
  {
    name: "Clerk",
    purpose: "Authentication, account sessions, and billing surfaces",
  },
  {
    name: "Convex",
    purpose: "Database, backend functions, and file storage",
  },
  {
    name: "Vercel",
    purpose: "Hosting, deployment, analytics, and speed insights",
  },
  {
    name: "PostHog",
    purpose: "Product analytics and event tracking",
  },
  {
    name: "Sentry",
    purpose: "Error monitoring and diagnostics",
  },
  {
    name: "Resend",
    purpose: "Transactional email delivery",
  },
] as const;
