"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";
import { hasOrganizationPlanPro } from "@/lib/auth/rbac";

/**
 * Syncs the authenticated Clerk user to the Convex `users` table.
 *
 * Watches Clerk session data and writes changes to Convex whenever
 * the user's email, name, avatar, or billing plan drifts from what's
 * stored. Runs once on mount and re-syncs on any dependency change.
 */
export function useSyncUser(enabled = true) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { has, orgId, userId, isLoaded: isAuthLoaded } = useAuth();
  const plan =
    isAuthLoaded &&
    hasOrganizationPlanPro({
      orgId,
      has,
    })
      ? "pro"
      : "free";

  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const existingUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (!enabled || !isUserLoaded || !isAuthLoaded || !user || !userId) {
      return;
    }

    // Only sync if user doesn't exist or data changed.
    if (
      !existingUser ||
      existingUser.email !== user.primaryEmailAddress?.emailAddress ||
      existingUser.name !== user.fullName ||
      existingUser.imageUrl !== user.imageUrl ||
      existingUser.plan !== plan
    ) {
      void createOrUpdateUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
        plan,
      }).catch((error) => {
        // Background sync should not crash the UI; auth can still be settling.
        console.warn("Failed to sync Clerk user to Convex", error);
      });
    }
  }, [
    user,
    isUserLoaded,
    isAuthLoaded,
    userId,
    plan,
    existingUser,
    createOrUpdateUser,
    enabled,
  ]);

  return { user, convexUser: existingUser, isLoaded: isUserLoaded };
}
