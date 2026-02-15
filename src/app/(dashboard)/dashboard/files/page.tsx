"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { FileUpload } from "@/components/dashboard/file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  Image01Icon,
  Delete02Icon,
  Download01Icon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { useState, useCallback } from "react";
import { toast } from "sonner";

/** Map common MIME types to human-readable labels */
function getFileTypeLabel(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/gif": "GIF",
    "image/webp": "WebP",
    "image/svg+xml": "SVG",
    "application/pdf": "PDF",
    "text/plain": "Text",
    "text/csv": "CSV",
    "application/json": "JSON",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };
  return map[mimeType] ?? mimeType.split("/").pop()?.toUpperCase() ?? "FILE";
}

/** Format bytes into a human-readable string */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Check if a MIME type is an image */
function isImageType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/** Format a timestamp into a readable date */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Loading skeleton for file list items */
function FileItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

export default function FilesPage() {
  const files = useQuery(api.files.getUserFiles);
  const deleteFile = useMutation(api.files.deleteFile);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = useCallback(
    async (fileId: Id<"files">) => {
      setDeletingIds((prev) => new Set(prev).add(fileId));
      try {
        await deleteFile({ fileId });
        toast.success("File deleted");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not delete file";
        toast.error(message);
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(fileId);
          return next;
        });
      }
    },
    [deleteFile],
  );

  const handleDownload = useCallback((url: string, fileName: string) => {
    // Use Convex storage URL as-is (signed URLs can't be modified)
    // The download attribute tells the browser to save with the correct filename
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const isLoading = files === undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-64" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Files</h1>
            <p className="text-muted-foreground">
              Upload, manage, and organize your files.
            </p>
          </>
        )}
      </div>

      {/* Upload section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HugeiconsIcon
              icon={FileAttachmentIcon}
              strokeWidth={2}
              className="h-4 w-4"
            />
            Upload Files
          </CardTitle>
          <CardDescription>
            Drag and drop or browse to upload files. Max 10 MB per file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      {/* Files list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Your Files</CardTitle>
              <CardDescription>
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : files.length === 0 ? (
                  "No files uploaded yet"
                ) : (
                  `${files.length} file${files.length === 1 ? "" : "s"}`
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <FileItemSkeleton />
              <FileItemSkeleton />
              <FileItemSkeleton />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <HugeiconsIcon
                icon={File01Icon}
                strokeWidth={1.5}
                className="h-12 w-12 text-muted-foreground/50"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                No files yet. Upload your first file above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => {
                const isDeleting = deletingIds.has(file._id);
                const isImage = isImageType(file.mimeType);

                return (
                  <div
                    key={file._id}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-opacity ${
                      isDeleting ? "opacity-50" : ""
                    }`}
                  >
                    {/* Thumbnail or icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                      <HugeiconsIcon
                        icon={isImage ? Image01Icon : File01Icon}
                        strokeWidth={2}
                        className="h-5 w-5 text-muted-foreground"
                      />
                    </div>

                    {/* File info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {file.fileName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getFileTypeLabel(file.mimeType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(file._creationTime)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      {file.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownload(file.url!, file.fileName)
                          }
                          title="Download"
                        >
                          <HugeiconsIcon
                            icon={Download01Icon}
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file._id as Id<"files">)}
                        disabled={isDeleting}
                        title="Delete"
                        className="hover:text-destructive"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
