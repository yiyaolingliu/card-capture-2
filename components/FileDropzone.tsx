"use client";

import { useCallback, useRef, useState, DragEvent, ChangeEvent } from "react";
import { ACCEPTED_EXTENSIONS, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "@/lib/constants";

type FileDropzoneProps = {
  onFileSelected: (file: File) => void;
  error?: string;
};

export default function FileDropzone({ onFileSelected, error }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return;
      if (file.size > MAX_IMAGE_SIZE_BYTES) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragging ? "border-dark bg-cream" : "border-border bg-cream/50"
      } ${error ? "border-error" : ""}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      aria-label="Upload business card image"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={onChange}
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-col items-center gap-2">
        <svg className="h-10 w-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
        </svg>
        <p className="text-sm text-dark font-medium">Drag & drop a card image here, or click to browse</p>
        <p className="text-xs text-muted">JPG, PNG, or WEBP · Max {MAX_IMAGE_SIZE_MB} MB</p>
      </div>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
