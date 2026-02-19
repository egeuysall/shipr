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
    orgId: v.string(), // Clerk organization ID (tenant boundary)
    storageId: v.id("_storage"),
    createdByUserId: v.id("users"), // User that uploaded the file
    fileName: v.string(), // Original filename (sanitized)
    mimeType: v.string(), // MIME type (e.g. "image/png", "application/pdf")
    size: v.number(), // File size in bytes
    // NOTE: Do not add a manual createdAt field.
    // Convex automatically provides _creationTime on every document.
  })
    .index("by_org_id", ["orgId"])
    .index("by_org_id_created_by_user_id", ["orgId", "createdByUserId"])
    .index("by_storage_id", ["storageId"]),

  chatThreads: defineTable({
    orgId: v.string(), // Clerk organization ID (tenant boundary)
    createdByUserId: v.id("users"),
    title: v.string(),
    lastMessageAt: v.number(),
  })
    .index("by_org_id", ["orgId"])
    .index("by_org_id_last_message", ["orgId", "lastMessageAt"]),

  chatMessages: defineTable({
    orgId: v.string(), // Clerk organization ID (tenant boundary)
    threadId: v.id("chatThreads"),
    createdByUserId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  })
    .index("by_org_id", ["orgId"])
    .index("by_thread_id", ["threadId"]),
});
