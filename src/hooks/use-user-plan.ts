"use client";

import { useAuth } from "@clerk/nextjs";
import { hasOrganizationPlanPro } from "@/lib/auth/rbac";

/** Possible billing plans for an active organization. */
export type Plan = "free" | "pro";

/**
 * Returns the active organization's billing plan derived from Clerk session claims.
 *
 * In this multi-tenant branch, plan gating is organization-scoped.
 */
export function useUserPlan(): {
  plan: Plan;
  isLoading: boolean;
  isPro: boolean;
  isFree: boolean;
  hasActiveOrganization: boolean;
} {
  const { has, isLoaded, orgId } = useAuth();

  const hasActiveOrganization = Boolean(orgId);
  const isPro =
    isLoaded &&
    hasActiveOrganization &&
    hasOrganizationPlanPro({
      orgId,
      has,
    });

  const isFree = !isPro;
  const plan: Plan = isPro ? "pro" : "free";

  return {
    plan,
    isLoading: !isLoaded,
    isPro,
    isFree,
    hasActiveOrganization,
  };
}
