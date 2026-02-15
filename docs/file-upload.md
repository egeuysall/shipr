# File Upload

## Overview

Shipr ships with a Convex-backed file upload module for authenticated dashboard users.

- UI page: `src/app/(dashboard)/dashboard/files/page.tsx`
- Upload component: `src/components/dashboard/file-upload.tsx`
- Upload hook: `src/hooks/use-file-upload.ts`
- Backend mutations/queries: `convex/files.ts`
- Shared config: `src/lib/files/config.ts`

## Upload Pipeline

The module uses Convex's 3-step upload flow:

1. Generate short-lived upload URL (`files.generateUploadUrl`)
2. Upload file blob directly to Convex storage
3. Persist verified metadata in `files` table (`files.saveFile`)

## Security Controls

### Authentication and ownership

- `requireCurrentUser` enforces signed-in access on every write/read path.
- `requireOwnedFile` enforces file ownership for `getFileUrl` and `deleteFile`.
- `getUserFiles` scopes reads by `userId` index.

### Metadata validation

`saveFile` does not trust client-provided size/type blindly:

- Reads actual file metadata from `ctx.db.system.get(storageId)`
- Uses storage-reported size and content type where available
- Rejects oversized files and disallowed MIME types
- Deletes invalid uploads from storage

### Image upload rate limiting

Image uploads are rate-limited per authenticated user in a rolling time window.

- Config lives in `src/lib/files/config.ts` under `FILE_UPLOAD_RATE_LIMITS.image`
- Enforcement happens in `convex/files.ts` during `saveFile`
- If limit is exceeded, the uploaded blob is deleted and the request is rejected
- Environment overrides:
  - `FILE_IMAGE_UPLOAD_RATE_LIMIT_MAX_UPLOADS` (default `10`)
  - `FILE_IMAGE_UPLOAD_RATE_LIMIT_WINDOW_MS` (default `60000`)
  - set either to `0` to disable image upload rate limiting

### Filename sanitization

Filenames are sanitized before persistence to remove path separators and unsafe characters.

## Configuration

Centralized in `src/lib/files/config.ts`:

- MIME allowlist and extension mapping
- `maxFileSizeBytes`
- `maxFilesPerUser`
- image upload rate limits (`maxUploadsPerWindow`, `windowMs`)
- shared format helpers (`formatFileSize`, `formatFileDate`, labels)

This config is consumed by frontend and backend, so changing limits in one place updates the full flow.

## Extension Points For Builders

### Add or remove supported file types

Update the file type catalog in `src/lib/files/config.ts`. Both UI validation and backend enforcement will align automatically.

### Change storage quotas

Update `FILE_STORAGE_LIMITS` values (max size, max files per user).

### Swap presentation layer

You can replace `FileUpload` or `FilesPage` UI without touching Convex security logic, as long as you keep mutation contracts unchanged.

## Notes

- Current list thumbnail rendering uses `<img>` for Convex signed URLs; lint warns about Next Image optimization tradeoffs.
- Downloads are triggered with browser `a[download]` using signed storage URLs.
