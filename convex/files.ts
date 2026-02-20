import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  ALLOWED_FILE_MIME_TYPES,
  getFileImageUploadRateLimitForPlan,
  getFileStorageLimitsForPlan,
  isImageMimeType,
} from "../src/lib/files/config";
import { ORG_PERMISSIONS } from "../src/lib/auth/rbac";
import {
  requireCurrentUser,
  resolveOrganizationBillingPlanForUser,
  requireOrgPermission,
  type OrganizationAuthContext,
} from "./lib/auth";

const ALLOWED_MIME_TYPES = new Set<string>(ALLOWED_FILE_MIME_TYPES);
type FilesCtx = QueryCtx | MutationCtx;

async function requireOrganizationFile(
  ctx: FilesCtx,
  auth: OrganizationAuthContext,
  fileId: Id<"files">,
) {
  const file = await ctx.db.get(fileId);

  if (!file) {
    throw new Error("File not found");
  }

  if (file.orgId !== auth.orgId) {
    throw new Error("Forbidden: file belongs to another organization");
  }

  return file;
}

async function enforceImageUploadRateLimit(
  ctx: MutationCtx,
  orgId: string,
  userId: Id<"users">,
  maxUploadsPerWindow: number,
  windowMs: number,
) {
  // Allow builders to disable by setting a non-positive limit/window in config.
  if (maxUploadsPerWindow <= 0 || windowMs <= 0) {
    return;
  }

  const windowStart = Date.now() - windowMs;
  const userFilesInOrg = await ctx.db
    .query("files")
    .withIndex("by_org_id_created_by_user_id", (q) =>
      q.eq("orgId", orgId).eq("createdByUserId", userId),
    )
    .collect();

  const recentImageUploads = userFilesInOrg.filter(
    (file) =>
      isImageMimeType(file.mimeType) && file._creationTime >= windowStart,
  );

  if (recentImageUploads.length < maxUploadsPerWindow) {
    return;
  }

  const oldestRecentUpload = recentImageUploads.reduce(
    (oldest, file) => Math.min(oldest, file._creationTime),
    recentImageUploads[0]!._creationTime,
  );
  const retryAfterMs = Math.max(0, windowMs - (Date.now() - oldestRecentUpload));
  const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  const windowSeconds = Math.max(1, Math.round(windowMs / 1000));

  throw new Error(
    `Image upload rate limit reached: maximum ${maxUploadsPerWindow} image uploads per ${windowSeconds} seconds. Try again in ${retryAfterSeconds} seconds.`,
  );
}

// Generate a short-lived upload URL (Step 1 of upload flow)
// Requires authentication + active organization
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    const { auth, user } = await requireCurrentUser(ctx);
    requireOrgPermission(auth, ORG_PERMISSIONS.FILES_CREATE);
    const orgPlan = resolveOrganizationBillingPlanForUser({ auth });
    const planLimits = getFileStorageLimitsForPlan(orgPlan);

    // Check uploader's file count limit in the active organization.
    const existingFilesByUploader = await ctx.db
      .query("files")
      .withIndex("by_org_id_created_by_user_id", (q) =>
        q.eq("orgId", auth.orgId).eq("createdByUserId", user._id),
      )
      .collect();

    if (existingFilesByUploader.length >= planLimits.maxFilesPerUser) {
      throw new Error(
        `File limit reached: maximum ${planLimits.maxFilesPerUser} files per uploader in this workspace for the ${orgPlan} plan`,
      );
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata after upload (Step 3 of upload flow)
// Validates file type, size, and organization scope.
// SECURITY: Verifies actual file metadata from _storage system table
// to prevent client-side spoofing of size/MIME type.
export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const { auth, user } = await requireCurrentUser(ctx);
    requireOrgPermission(auth, ORG_PERMISSIONS.FILES_CREATE);
    const orgPlan = resolveOrganizationBillingPlanForUser({ auth });
    const planLimits = getFileStorageLimitsForPlan(orgPlan);
    const imageRateLimit = getFileImageUploadRateLimitForPlan(orgPlan);

    // SECURITY: Cross-validate against actual stored file metadata
    // This prevents client-side spoofing of file size and MIME type.
    const storedFile = await ctx.db.system.get(args.storageId);
    if (!storedFile) {
      throw new Error("Storage ID not found: file may not have been uploaded");
    }

    // Use ACTUAL size from storage, not client-provided size.
    const actualSize = storedFile.size;
    const actualMimeType = storedFile.contentType ?? args.mimeType;

    // Validate actual file size (not the client-provided one).
    if (actualSize > planLimits.maxFileSizeBytes) {
      await ctx.storage.delete(args.storageId);
      throw new Error(
        `File too large: maximum size is ${planLimits.maxFileSizeBytes / (1024 * 1024)}MB for the ${orgPlan} plan`,
      );
    }

    // Validate actual MIME type (prefer storage contentType if available).
    if (!ALLOWED_MIME_TYPES.has(actualMimeType)) {
      await ctx.storage.delete(args.storageId);
      throw new Error(
        `File type not allowed: ${actualMimeType}. Allowed types: ${Array.from(ALLOWED_MIME_TYPES).join(", ")}`,
      );
    }

    // Rate limit image uploads to reduce abuse; delete blob on reject.
    if (isImageMimeType(actualMimeType)) {
      try {
        await enforceImageUploadRateLimit(
          ctx,
          auth.orgId,
          user._id,
          imageRateLimit.maxUploadsPerWindow,
          imageRateLimit.windowMs,
        );
      } catch (error) {
        await ctx.storage.delete(args.storageId);
        throw error;
      }
    }

    // Sanitize file name: strip path separators and limit length.
    const sanitizedName = args.fileName
      .replace(/[/\\]/g, "_")
      .replace(/[<>:\"|?*]/g, "_")
      .slice(0, 255);

    // Store using ACTUAL verified metadata, not client-provided values.
    return await ctx.db.insert("files", {
      orgId: auth.orgId,
      storageId: args.storageId,
      createdByUserId: user._id,
      fileName: sanitizedName,
      mimeType: actualMimeType,
      size: actualSize,
    });
  },
});

// List files for the active organization.
export const getOrganizationFiles = query({
  args: {},
  handler: async (ctx) => {
    let auth;
    try {
      ({ auth } = await requireCurrentUser(ctx));
      requireOrgPermission(auth, ORG_PERMISSIONS.FILES_READ);
    } catch {
      return [];
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_org_id", (q) => q.eq("orgId", auth.orgId))
      .order("desc")
      .collect();

    return await Promise.all(
      files.map(async (file) => {
        const uploader = await ctx.db.get(file.createdByUserId);
        return {
          ...file,
          url: await ctx.storage.getUrl(file.storageId),
          uploader: uploader
            ? {
                name: uploader.name ?? null,
                email: uploader.email,
                imageUrl: uploader.imageUrl ?? null,
              }
            : null,
        };
      }),
    );
  },
});

// Get a single file's URL (with organization + permission checks).
export const getFileUrl = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const { auth } = await requireCurrentUser(ctx);
    requireOrgPermission(auth, ORG_PERMISSIONS.FILES_READ);

    const file = await requireOrganizationFile(ctx, auth, args.fileId);
    const url = await ctx.storage.getUrl(file.storageId);
    return { ...file, url };
  },
});

// Delete a file (admin-only by default fallback role matrix).
// Removes both the storage blob and the database record.
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const { auth } = await requireCurrentUser(ctx);
    requireOrgPermission(auth, ORG_PERMISSIONS.FILES_DELETE);

    const file = await requireOrganizationFile(ctx, auth, args.fileId);

    // Delete the blob from storage first, then the metadata.
    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(args.fileId);
  },
});
