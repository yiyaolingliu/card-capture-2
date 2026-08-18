"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import type { SubmittedCardSummary, UpdateSubmittedCardRequest } from "@/types/card";

const FIELDS: { key: keyof UpdateSubmittedCardRequest; label: string; textarea?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "companyName", label: "Company Name" },
  { key: "companyRegion", label: "Company Region" },
  { key: "companyAddress", label: "Company Address", textarea: true },
  { key: "companyWebsite", label: "Company Website" },
  { key: "companyCountry", label: "Company Country" },
  { key: "summaryFromWeb", label: "Summary from Web", textarea: true },
  { key: "milestoneMoments", label: "Milestone Moments", textarea: true },
  { key: "remark", label: "Remark", textarea: true },
];

type Props = {
  open: boolean;
  onClose: () => void;
  card: SubmittedCardSummary | null;
  onSaved: (updated: SubmittedCardSummary) => void;
};

export default function SubmissionEditModal({ open, onClose, card, onSaved }: Props) {
  const [values, setValues] = useState<UpdateSubmittedCardRequest>({
    name: "", title: "", phoneNumber: "", email: "",
    companyRegion: "", companyName: "", companyAddress: "",
    companyWebsite: "", companyCountry: "", summaryFromWeb: "",
    milestoneMoments: "", remark: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Image state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (card) {
      setValues({
        name: card.name, title: card.title, phoneNumber: card.phoneNumber,
        email: card.email, companyRegion: card.companyRegion,
        companyName: card.companyName, companyAddress: card.companyAddress,
        companyWebsite: card.companyWebsite, companyCountry: card.companyCountry,
        summaryFromWeb: card.summaryFromWeb, milestoneMoments: card.milestoneMoments,
        remark: card.remark,
      });
      setError(null);
      setSuccess(false);
      setImageUrl(null);
      setImageError(false);

      // Load image if available
      if (card.hasImage) {
        setImageLoading(true);
        fetch(`/api/cards/${card.rowId}/image`)
          .then((res) => res.json())
          .then((data) => {
            if (data.imageUrl) setImageUrl(data.imageUrl);
            else setImageError(true);
          })
          .catch(() => setImageError(true))
          .finally(() => setImageLoading(false));
      }
    }
  }, [card]);

  const handleChange = (key: keyof UpdateSubmittedCardRequest, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    if (!card) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/cards/${card.rowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onSaved(data as SubmittedCardSummary);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not save the updated information. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Submission">
      <div className="space-y-4">
        {/* Card image reference */}
        {card?.hasImage && (
          <div className="rounded-xl border border-border bg-beige p-3">
            <p className="text-xs font-medium text-muted mb-2">Card Image (reference)</p>
            {imageLoading && <p className="text-sm text-muted text-center py-4">Loading card image…</p>}
            {imageError && <p className="text-sm text-error text-center py-4">Could not load the card image.</p>}
            {imageUrl && !imageLoading && !imageError && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Business card"
                className="max-w-full max-h-[300px] rounded-lg mx-auto"
              />
            )}
          </div>
        )}

        {FIELDS.map(({ key, label, textarea }) =>
          textarea ? (
            <Textarea
              key={key}
              label={label}
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ) : (
            <Input
              key={key}
              label={label}
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          )
        )}
        {error && <p className="text-sm text-error">{error}</p>}
        {success && <p className="text-sm text-success">Changes saved.</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
