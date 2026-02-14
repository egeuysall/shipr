"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import posthog from "posthog-js";

export function PostHogIdentify() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { has } = useAuth();
  const identifiedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user && !identifiedRef.current) {
      // Identify user in PostHog
      const plan = has?.({ plan: "pro" }) ? "pro" : "free";
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username,
        created_at: user.createdAt,
        plan,
      });
      identifiedRef.current = true;
    } else if (!isSignedIn && identifiedRef.current) {
      // Reset PostHog on logout
      posthog.reset();
      identifiedRef.current = false;
    }
  }, [isLoaded, isSignedIn, user, has]);

  return null;
}
