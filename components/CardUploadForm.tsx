"use client";

import { useState, useCallback, FormEvent } from "react";
import FileDropzone from "./FileDropzone";
import ImagePreview from "./ImagePreview";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import StatusMessage from "./StatusMessage";
import { validateUploadForm } from "@/lib/validation";
import type { GenerateCardResponse } from "@/types/card";

type CardUploadFormProps = {
  onGenerated: (data: GenerateCardResponse, imagePreviewUrl: string, milestoneMoments: string, remark: string) => void;
};

export default function CardUploadForm({ onGenerated }: CardUploadFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [milestoneMoments, setMilestoneMoments] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelected = useCallback((file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }, []);

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateUploadForm(imageFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile!);
      formData.append("milestoneMoments", milestoneMoments.trim());
      formData.append("remark", remark.trim());

      const res = await fetch("/api/cards/generate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "We could not generate the card information. Please try again.");
        return;
      }

      onGenerated(data as GenerateCardResponse, previewUrl!, milestoneMoments.trim(), remark.trim());
    } catch {
      setError("We could not generate the card information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = !!imageFile;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {previewUrl ? (
        <ImagePreview src={previewUrl} onRemove={handleRemoveImage} />
      ) : (
        <FileDropzone onFileSelected={handleFileSelected} />
      )}

      <Textarea
        label="Milestone Moments"
        placeholder="E.g. Met at Tech Conference 2026, discussed partnership opportunities"
        helperText="Describe when, where, or why you received this card (optional)."
        value={milestoneMoments}
        onChange={(e) => setMilestoneMoments(e.target.value)}
      />

      <Textarea
        label="Remark"
        placeholder="Any additional notes (optional)"
        helperText="Optional notes about this contact."
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
      />

      {error && <StatusMessage type="error" message={error} />}
      {loading && <StatusMessage type="loading" message="Generating card information…" />}

      <Button type="submit" disabled={!isValid || loading} className="w-full">
        {loading ? "Generating…" : "Generate Card Information"}
      </Button>
    </form>
  );
}
