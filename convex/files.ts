import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  ALLOWED_FILE_MIME_TYPES,
  FILE_STORAGE_LIMITS,
} from "../src/lib/files/config";

const ALLOWED_MIME_TYPES = new Set<string>(ALLOWED_FILE_MIME_TYPES);
type FilesCtx = QueryCtx | MutationCtx;

async function requireCurrentUser(ctx: FilesCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: authentication required");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function requireOwnedFile(ctx: FilesCtx, fileId: Id<"files">) {
  const user = await requireCurrentUser(ctx);
  const file = await ctx.db.get(fileId);

  if (!file) {
    throw new Error("File not found");
  }

  if (file.userId !== user._id) {
    throw new Error("Forbidden: you do not own this file");
  }

  return { user, file };
}

// Generate a short-lived upload URL (Step 1 of upload flow)
// Requires authentication: only logged-in users can upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    const user = await requireCurrentUser(ctx);

    // Check user file count limit
    const existingFiles = await ctx.db
      .query("files")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();

    if (existingFiles.length >= FILE_STORAGE_LIMITS.maxFilesPerUser) {
      throw new Error(
        `File limit reached: maximum ${FILE_STORAGE_LIMITS.maxFilesPerUser} files per user`,
      );
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata after upload (Step 3 of upload flow)
// Validates file type, size, and ownership
// SECURITY: Verifies actual file metadata from _storage system table
// to prevent client-side spoofing of size/MIME type
export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    // SECURITY: Cross-validate against actual stored file metadata
    // This prevents client-side spoofing of file size and MIME type
    const storedFile = await ctx.db.system.get(args.storageId);
    if (!storedFile) {
      throw new Error("Storage ID not found: file may not have been uploaded");
    }

    // Use ACTUAL size from storage, not client-provided size
    const actualSize = storedFile.size;
    const actualMimeType = storedFile.contentType ?? args.mimeType;

    // Validate actual file size (not the client-provided one)
    if (actualSize > FILE_STORAGE_LIMITS.maxFileSizeBytes) {
      // Clean up the uploaded file since we're rejecting it
      await ctx.storage.delete(args.storageId);
      throw new Error(
        `File too large: maximum size is ${FILE_STORAGE_LIMITS.maxFileSizeBytes / (1024 * 1024)}MB`,
      );
    }

    // Validate actual MIME type (prefer storage contentType if available)
    if (!ALLOWED_MIME_TYPES.has(actualMimeType)) {
      await ctx.storage.delete(args.storageId);
      throw new Error(
        `File type not allowed: ${actualMimeType}. Allowed types: ${Array.from(ALLOWED_MIME_TYPES).join(", ")}`,
      );
    }

    // Sanitize file name: strip path separators and limit length
    const sanitizedName = args.fileName
      .replace(/[/\\]/g, "_")
      .replace(/[<>:"|?*]/g, "_")
      .slice(0, 255);

    // Store using ACTUAL verified metadata, not client-provided values
    return await ctx.db.insert("files", {
      storageId: args.storageId,
      userId: user._id,
      fileName: sanitizedName,
      mimeType: actualMimeType,
      size: actualSize,
    });
  },
});

// List files for the currently authenticated user
export const getUserFiles = query({
  args: {},
  handler: async (ctx) => {
    let user;
    try {
      user = await requireCurrentUser(ctx);
    } catch {
      return [];
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Attach serving URLs to each file
    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      })),
    );
  },
});

// Get a single file's URL (with ownership check)
export const getFileUrl = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const { file } = await requireOwnedFile(ctx, args.fileId);

    const url = await ctx.storage.getUrl(file.storageId);
    return { ...file, url };
  },
});

// Delete a file (with ownership check)
// Removes both the storage blob and the database record
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const { file } = await requireOwnedFile(ctx, args.fileId);

    // Delete the blob from storage first, then the metadata
    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(args.fileId);
  },
});
