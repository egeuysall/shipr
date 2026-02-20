"use client";

import { useAuth } from "@clerk/nextjs";
import {
  resolveOrganizationBillingPlanFromHas,
  type OrganizationBillingPlan,
  ORG_BILLING_PLANS,
} from "@/lib/auth/rbac";

/** Possible billing plans for an active organization. */
export type Plan = OrganizationBillingPlan;

/**
 * Returns the active organization's billing plan derived from Clerk session claims.
 *
 * In this multi-tenant branch, plan gating is organization-scoped.
 */
export function useUserPlan(): {
  plan: Plan;
  isLoading: boolean;
  isOrganizationsPlan: boolean;
  isFree: boolean;
  hasActiveOrganization: boolean;
} {
  const { has, isLoaded, orgId } = useAuth();

  const hasActiveOrganization = Boolean(orgId);
  const plan = isLoaded
    ? resolveOrganizationBillingPlanFromHas({
        orgId,
        has,
      })
    : ORG_BILLING_PLANS.FREE;
  const isOrganizationsPlan = plan === ORG_BILLING_PLANS.ORGANIZATIONS;

  const isFree = !isOrganizationsPlan;

  return {
    plan,
    isLoading: !isLoaded,
    isOrganizationsPlan,
    isFree,
    hasActiveOrganization,
  };
}
