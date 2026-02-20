import {
  ORG_BILLING_PLANS,
  type OrganizationBillingPlan,
} from "../auth/rbac";

export const FILE_TYPE_CATALOG = [
  {
    mimeType: "image/jpeg",
    label: "JPEG",
    extensions: [".jpg", ".jpeg"],
  },
  {
    mimeType: "image/png",
    label: "PNG",
    extensions: [".png"],
  },
  {
    mimeType: "image/gif",
    label: "GIF",
    extensions: [".gif"],
  },
  {
    mimeType: "image/webp",
    label: "WebP",
    extensions: [".webp"],
  },
  {
    mimeType: "image/svg+xml",
    label: "SVG",
    extensions: [".svg"],
  },
  {
    mimeType: "application/pdf",
    label: "PDF",
    extensions: [".pdf"],
  },
  {
    mimeType: "text/plain",
    label: "Text",
    extensions: [".txt"],
  },
  {
    mimeType: "text/csv",
    label: "CSV",
    extensions: [".csv"],
  },
  {
    mimeType: "application/json",
    label: "JSON",
    extensions: [".json"],
  },
  {
    mimeType: "application/msword",
    label: "DOC",
    extensions: [".doc"],
  },
  {
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    label: "DOCX",
    extensions: [".docx"],
  },
  {
    mimeType: "application/vnd.ms-excel",
    label: "XLS",
    extensions: [".xls"],
  },
  {
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    label: "XLSX",
    extensions: [".xlsx"],
  },
] as const;

function readNonNegativeIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;

  return Math.floor(parsed);
}

function readPositiveIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;

  return Math.floor(parsed);
}

export const ALLOWED_FILE_MIME_TYPES = FILE_TYPE_CATALOG.map(
  (fileType) => fileType.mimeType,
);

export const ACCEPTED_FILE_EXTENSIONS = FILE_TYPE_CATALOG.flatMap(
  (fileType) => fileType.extensions,
).join(",");

const FREE_FILE_LIMITS = {
  maxFileSizeBytes: readPositiveIntEnv(
    "FILE_MAX_FILE_SIZE_BYTES_FREE",
    10 * 1024 * 1024,
  ),
  maxFilesPerUser: readPositiveIntEnv("FILE_MAX_FILES_PER_USER_FREE", 100),
  imageMaxUploadsPerWindow: readNonNegativeIntEnv(
    "FILE_IMG_RL_MAX_UPLOADS_FREE",
    readNonNegativeIntEnv("FILE_IMAGE_UPLOAD_RATE_LIMIT_MAX_UPLOADS", 10),
  ),
};

const ORGANIZATIONS_FILE_LIMITS = {
  maxFileSizeBytes: readPositiveIntEnv(
    "FILE_MAX_FILE_SIZE_BYTES_ORGANIZATIONS",
    FREE_FILE_LIMITS.maxFileSizeBytes,
  ),
  maxFilesPerUser: readPositiveIntEnv(
    "FILE_MAX_FILES_PER_USER_ORGANIZATIONS",
    FREE_FILE_LIMITS.maxFilesPerUser,
  ),
  imageMaxUploadsPerWindow: readNonNegativeIntEnv(
    "FILE_IMG_RL_MAX_UPLOADS_ORGS",
    FREE_FILE_LIMITS.imageMaxUploadsPerWindow,
  ),
};

const FILE_UPLOAD_WINDOW_MS = readNonNegativeIntEnv(
  "FILE_IMAGE_UPLOAD_RATE_LIMIT_WINDOW_MS",
  60_000,
);

export function getFileStorageLimitsForPlan(plan: OrganizationBillingPlan): {
  maxFileSizeBytes: number;
  maxFilesPerUser: number;
} {
  const limits =
    plan === ORG_BILLING_PLANS.ORGANIZATIONS
      ? ORGANIZATIONS_FILE_LIMITS
      : FREE_FILE_LIMITS;

  return {
    maxFileSizeBytes: limits.maxFileSizeBytes,
    maxFilesPerUser: limits.maxFilesPerUser,
  };
}

export function getFileImageUploadRateLimitForPlan(
  plan: OrganizationBillingPlan,
): {
  maxUploadsPerWindow: number;
  windowMs: number;
} {
  const limits =
    plan === ORG_BILLING_PLANS.ORGANIZATIONS
      ? ORGANIZATIONS_FILE_LIMITS
      : FREE_FILE_LIMITS;

  return {
    maxUploadsPerWindow: limits.imageMaxUploadsPerWindow,
    windowMs: FILE_UPLOAD_WINDOW_MS,
  };
}

// Backwards-compatible default values used by existing UI fallbacks.
export const FILE_STORAGE_LIMITS = getFileStorageLimitsForPlan(
  ORG_BILLING_PLANS.FREE,
);

const FILE_MIME_LABELS = Object.fromEntries(
  FILE_TYPE_CATALOG.map((fileType) => [fileType.mimeType, fileType.label]),
) as Record<string, string>;

export function getFileTypeLabel(mimeType: string): string {
  return (
    FILE_MIME_LABELS[mimeType] ??
    mimeType.split("/").pop()?.toUpperCase() ??
    "FILE"
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function formatFileDate(
  timestamp: number,
  locale: string = "en-US",
): string {
  return new Date(timestamp).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
