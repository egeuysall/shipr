"use client";

import { useCallback, useRef, useState } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CloudUploadIcon,
  File01Icon,
  Cancel01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

const ACCEPTED_EXTENSIONS =
  ".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.txt,.csv,.json,.doc,.docx,.xls,.xlsx";

interface FileUploadProps {
  /** Called after a successful upload */
  onUploadComplete?: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, uploadMultiple, isUploading, error, progress, reset } =
    useFileUpload({
      onSuccess: () => {
        setSelectedFiles([]);
        onUploadComplete?.();
      },
    });

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length === 0) return;

      if (droppedFiles.length === 1) {
        await upload(droppedFiles[0]);
      } else {
        await uploadMultiple(droppedFiles);
      }
    },
    [upload, uploadMultiple],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = Array.from(e.target.files ?? []);
      setSelectedFiles(files);
      // Reset the input so the same file can be re-selected
      e.target.value = "";
    },
    [],
  );

  const handleUpload = useCallback(async (): Promise<void> => {
    if (selectedFiles.length === 0) return;

    if (selectedFiles.length === 1) {
      await upload(selectedFiles[0]);
    } else {
      await uploadMultiple(selectedFiles);
    }
  }, [selectedFiles, upload, uploadMultiple]);

  const removeSelectedFile = useCallback((index: number): void => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    reset();
  }, [reset]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const progressLabel: Record<typeof progress, string> = {
    idle: "",
    "generating-url": "Preparing upload…",
    uploading: "Uploading file…",
    saving: "Saving metadata…",
    complete: "Upload complete!",
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <Card
        className={`relative cursor-pointer border-2 border-dashed transition-colors ${
          isDragging
            ? "border-foreground/50 bg-muted/50"
            : "border-border hover:border-foreground/30 hover:bg-muted/30"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
          {isUploading ? (
            <HugeiconsIcon
              icon={Loading03Icon}
              strokeWidth={2}
              className="h-10 w-10 animate-spin text-muted-foreground"
            />
          ) : (
            <HugeiconsIcon
              icon={CloudUploadIcon}
              strokeWidth={2}
              className="h-10 w-10 text-muted-foreground"
            />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">
              {isUploading
                ? progressLabel[progress]
                : "Drag & drop files here, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Images, PDFs, documents, spreadsheets — up to 10 MB
            </p>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={ACCEPTED_EXTENSIONS}
        multiple
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/5">
          {error}
        </div>
      )}

      {/* Selected files preview */}
      {selectedFiles.length > 0 && !isUploading && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
            >
              <HugeiconsIcon
                icon={File01Icon}
                strokeWidth={2}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedFile(index);
                }}
                className="shrink-0 rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="h-4 w-4"
                />
              </button>
            </div>
          ))}

          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            Upload {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}
