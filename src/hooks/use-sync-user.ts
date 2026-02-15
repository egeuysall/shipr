"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";

/**
 * Syncs the authenticated Clerk user to the Convex `users` table.
 *
 * Watches Clerk session data and writes changes to Convex whenever
 * the user's email, name, avatar, or billing plan drifts from what's
 * stored. Runs once on mount and re-syncs on any dependency change.
 *
 * @returns The Clerk `user` object, the matching Convex document (`convexUser`),
 *          and an `isLoaded` flag that is `false` until Clerk finishes loading.
 */
export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const { has } = useAuth();
  const plan =
    isLoaded && has ? (has({ plan: "pro" }) ? "pro" : "free") : undefined;
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const existingUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Only sync if user doesn't exist or data changed
    if (
      !existingUser ||
      existingUser.email !== user.primaryEmailAddress?.emailAddress ||
      existingUser.name !== user.fullName ||
      existingUser.imageUrl !== user.imageUrl ||
      existingUser.plan !== plan
    ) {
      createOrUpdateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
        plan,
      });
    }
  }, [user, isLoaded, plan, existingUser, createOrUpdateUser]);

  return { user, convexUser: existingUser, isLoaded };
}
