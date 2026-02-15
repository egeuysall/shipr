import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.optional(v.string()), // "free" | "pro": synced from Clerk Billing via useSyncUser
    onboardingCompleted: v.optional(v.boolean()), // Whether user completed onboarding
    onboardingStep: v.optional(v.string()), // Current onboarding step: "welcome" | "profile" | "preferences" | "complete"
    // NOTE: Do not add a manual createdAt field.
    // Convex automatically provides _creationTime on every document.
  }).index("by_clerk_id", ["clerkId"]),

  files: defineTable({
    storageId: v.id("_storage"),
    userId: v.id("users"), // Reference to the owning user document
    fileName: v.string(), // Original filename (sanitized)
    mimeType: v.string(), // MIME type (e.g. "image/png", "application/pdf")
    size: v.number(), // File size in bytes
    // NOTE: Do not add a manual createdAt field.
    // Convex automatically provides _creationTime on every document.
  })
    .index("by_user_id", ["userId"])
    .index("by_storage_id", ["storageId"]),
});
