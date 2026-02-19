"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

/**
 * Hook to check if the user has completed onboarding.
 * Redirects to /onboarding if not completed and not already there.
 */
export function useOnboarding(enabled = true) {
  const router = useRouter();
  const pathname = usePathname();
  const onboardingStatus = useQuery(
    api.users.getOnboardingStatus,
    enabled ? {} : "skip",
  );

  useEffect(() => {
    if (!enabled || !onboardingStatus) return;

    const isOnOnboardingPage = pathname === "/onboarding";
    const shouldRedirectToOnboarding =
      !onboardingStatus.completed && !isOnOnboardingPage;
    const shouldRedirectToDashboard =
      onboardingStatus.completed && isOnOnboardingPage;

    if (shouldRedirectToOnboarding) {
      router.push("/onboarding");
    } else if (shouldRedirectToDashboard) {
      router.push("/dashboard");
    }
  }, [onboardingStatus, pathname, router, enabled]);

  return {
    completed: onboardingStatus?.completed ?? false,
    currentStep: onboardingStatus?.currentStep ?? "welcome",
    isLoading: enabled && onboardingStatus === undefined,
  };
}
