"use client";

import { useAuth } from "@clerk/nextjs";

/** Possible billing plans for a user. */
export type Plan = "free" | "pro";

/**
 * Returns the current user's billing plan derived from Clerk session claims.
 *
 * Checks `has({ plan: "pro" })` via Clerk's `useAuth` - no extra API calls needed.
 *
 * @returns Object with `plan`, `isLoading`, `isPro`, and `isFree` flags.
 *
 * @example
 * ```tsx
 * const { isPro, isLoading } = useUserPlan();
 *
 * if (isLoading) return <Skeleton />;
 * if (isPro) return <ProDashboard />;
 * return <FreeDashboard />;
 * ```
 */
export function useUserPlan(): {
  plan: Plan;
  isLoading: boolean;
  isPro: boolean;
  isFree: boolean;
} {
  const { has, isLoaded } = useAuth();

  const isPro = isLoaded ? (has?.({ plan: "pro" }) ?? false) : false;
  const isFree = !isPro;
  const plan: Plan = isPro ? "pro" : "free";

  return {
    plan,
    isLoading: !isLoaded,
    isPro,
    isFree,
  };
}
