"use client";

import { useState, FormEvent } from "react";
import ImagePreview from "./ImagePreview";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import StatusMessage from "./StatusMessage";
import { GENERATED_FIELD_LABELS, TEXTAREA_FIELDS } from "@/lib/constants";
import type { GeneratedCardFields } from "@/types/card";

type ReviewFormProps = {
  rowId: string;
  imagePreviewUrl: string;
  milestoneMoments: string;
  remark: string;
  generatedFields: GeneratedCardFields;
  onSubmitSuccess: () => void;
  onBack: () => void;
};

const FIELD_KEYS = Object.keys(GENERATED_FIELD_LABELS) as (keyof GeneratedCardFields)[];

export default function ReviewForm({
  rowId,
  imagePreviewUrl,
  milestoneMoments,
  remark,
  generatedFields,
  onSubmitSuccess,
  onBack,
}: ReviewFormProps) {
  const [fields, setFields] = useState<GeneratedCardFields>({ ...generatedFields });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (key: keyof GeneratedCardFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/cards/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId, milestoneMoments, remark, fields }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "We could not save your reviewed information. Please try again.");
        return;
      }

      onSubmitSuccess();
    } catch {
      setError("We could not save your reviewed information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Uploaded Card</h2>
          <ImagePreview src={imagePreviewUrl} />
          <div className="space-y-2 rounded-xl bg-cream p-4 border border-border">
            <div>
              <p className="text-xs font-medium text-muted">Milestone Moments</p>
              <p className="text-sm">{milestoneMoments}</p>
            </div>
            {remark && (
              <div>
                <p className="text-xs font-medium text-muted">Remark</p>
                <p className="text-sm">{remark}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Review Card Information</h2>
          <p className="text-sm text-muted">Edit any incorrect fields before submitting.</p>
          <div className="space-y-3">
            {FIELD_KEYS.map((key) =>
              TEXTAREA_FIELDS.has(key) ? (
                <Textarea
                  key={key}
                  label={GENERATED_FIELD_LABELS[key]}
                  value={fields[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              ) : (
                <Input
                  key={key}
                  label={GENERATED_FIELD_LABELS[key]}
                  value={fields[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              )
            )}
          </div>
        </div>
      </div>

      {error && <StatusMessage type="error" message={error} />}
      {loading && <StatusMessage type="loading" message="Saving reviewed information…" />}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="secondary" onClick={onBack} disabled={loading}>
          Back to Upload
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving…" : "Submit Final Record"}
        </Button>
      </div>
    </form>
  );
}
