"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  rowId: string | null;
};

export default function SubmissionImageModal({ open, onClose, rowId }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !rowId) {
      setImageUrl(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/cards/${rowId}/image`)
      .then((res) => res.json())
      .then((data) => {
        if (data.imageUrl) setImageUrl(data.imageUrl);
        else setError("No image found for this card.");
      })
      .catch(() => setError("We could not load this card image. Please try again."))
      .finally(() => setLoading(false));
  }, [open, rowId]);

  return (
    <Modal open={open} onClose={onClose} title="Card Image">
      <div className="flex items-center justify-center min-h-[200px]">
        {loading && <p className="text-muted">Loading card image…</p>}
        {error && <p className="text-error">{error}</p>}
        {imageUrl && !loading && !error && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Business card"
            className="max-w-full max-h-[70vh] rounded-lg"
          />
        )}
      </div>
    </Modal>
  );
}
