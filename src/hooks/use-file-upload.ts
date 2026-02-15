"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

/** Allowed MIME types for upload */
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

/** Maximum file size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface UploadState {
  isUploading: boolean;
  error: string | null;
  progress: "idle" | "generating-url" | "uploading" | "saving" | "complete";
}

interface UseFileUploadOptions {
  /** Override max file size in bytes (default: 10 MB) */
  maxSize?: number;
  /** Override allowed MIME types */
  allowedTypes?: Set<string>;
  /** Callback on successful upload */
  onSuccess?: (storageId: string) => void;
  /** Callback on upload error */
  onError?: (error: string) => void;
}

interface UseFileUploadReturn {
  /** Upload a single file */
  upload: (file: File) => Promise<string | null>;
  /** Upload multiple files */
  uploadMultiple: (files: File[]) => Promise<(string | null)[]>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Granular upload progress state */
  progress: UploadState["progress"];
  /** Reset the error and progress state */
  reset: () => void;
}

/**
 * Hook for uploading files to Convex storage.
 *
 * Uses the 3-step upload URL flow:
 * 1. Generate a short-lived upload URL via mutation
 * 2. POST the file to the URL, receiving a storage ID
 * 3. Save the storage ID + metadata to the `files` table
 *
 * Includes client-side validation for file size and MIME type.
 */
export function useFileUpload(
  options: UseFileUploadOptions = {},
): UseFileUploadReturn {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_TYPES,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    error: null,
    progress: "idle",
  });

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file) {
        return "No file provided";
      }

      if (file.size > maxSize) {
        const maxMB = Math.round(maxSize / (1024 * 1024));
        return `File size exceeds ${maxMB} MB limit`;
      }

      if (allowedTypes.size > 0 && !allowedTypes.has(file.type)) {
        return `File type "${file.type || "unknown"}" is not allowed`;
      }

      if (!file.name || file.name.length > 255) {
        return "Invalid file name";
      }

      return null;
    },
    [maxSize, allowedTypes],
  );

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      // Validate
      const validationError = validateFile(file);
      if (validationError) {
        setState({
          isUploading: false,
          error: validationError,
          progress: "idle",
        });
        onError?.(validationError);
        return null;
      }

      setState({ isUploading: true, error: null, progress: "generating-url" });

      try {
        // Step 1: Get a short-lived upload URL
        const uploadUrl = await generateUploadUrl();

        setState((prev) => ({ ...prev, progress: "uploading" }));

        // Step 2: POST the file to the upload URL
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Upload failed with status ${result.status}`);
        }

        const { storageId } = (await result.json()) as {
          storageId: Id<"_storage">;
        };

        setState((prev) => ({ ...prev, progress: "saving" }));

        // Step 3: Save the storage ID + metadata to the database
        await saveFile({
          storageId,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
        });

        setState({ isUploading: false, error: null, progress: "complete" });
        onSuccess?.(storageId);

        return storageId;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed unexpectedly";
        setState({ isUploading: false, error: message, progress: "idle" });
        onError?.(message);
        return null;
      }
    },
    [generateUploadUrl, saveFile, validateFile, onSuccess, onError],
  );

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<(string | null)[]> => {
      // Upload sequentially to avoid overwhelming the server
      const results: (string | null)[] = [];
      for (const file of files) {
        const storageId = await upload(file);
        results.push(storageId);
      }
      return results;
    },
    [upload],
  );

  const reset = useCallback((): void => {
    setState({ isUploading: false, error: null, progress: "idle" });
  }, []);

  return {
    upload,
    uploadMultiple,
    isUploading: state.isUploading,
    error: state.error,
    progress: state.progress,
    reset,
  };
}
