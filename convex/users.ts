import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

// Onboarding steps
export type OnboardingStep = "welcome" | "profile" | "preferences" | "complete";

async function requireAuthenticatedClerkId(
  ctx: QueryCtx | MutationCtx,
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: authentication required");
  }

  return identity.subject;
}

// Get the currently authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

// Create or update user (called from client-side useSyncUser hook)
// Requires authentication and derives clerkId from the authenticated identity.
export const createOrUpdateUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuthenticatedClerkId(ctx);

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        plan: args.plan,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      plan: args.plan,
    });
  },
});

// Delete current user
export const deleteCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const clerkId = await requireAuthenticatedClerkId(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// Get onboarding status for the current user
export const getOnboardingStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return {
      completed: user?.onboardingCompleted ?? false,
      currentStep: (user?.onboardingStep ?? "welcome") as OnboardingStep,
    };
  },
});

// Update onboarding step
export const updateOnboardingStep = mutation({
  args: {
    step: v.union(
      v.literal("welcome"),
      v.literal("profile"),
      v.literal("preferences"),
      v.literal("complete"),
    ),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuthenticatedClerkId(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingStep: args.step,
    });
  },
});

// Complete onboarding
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const clerkId = await requireAuthenticatedClerkId(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
      onboardingStep: "complete",
    });
  },
});

// Reset onboarding (useful for testing or re-onboarding)
export const resetOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const clerkId = await requireAuthenticatedClerkId(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: false,
      onboardingStep: "welcome",
    });
  },
});
