import posthog from "posthog-js";

// Only initialize PostHog if the environment variables are set
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // We handle pageviews manually
    capture_pageleave: true,
    debug: process.env.NODE_ENV === "development",
    loaded: () => {
      if (process.env.NODE_ENV === "development") {
        console.log("PostHog loaded successfully");
      }
    },
  });
} else if (typeof window !== "undefined") {
  console.warn(
    "PostHog not initialized: Missing NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST",
  );
}
