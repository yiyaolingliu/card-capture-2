"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { SubmittedCardSummary } from "@/types/card";

type Props = {
  open: boolean;
  onClose: () => void;
  card: SubmittedCardSummary | null;
  onDeleted: (rowId: string) => void;
};

export default function DeleteConfirmModal({ open, onClose, card, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!card) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${card.rowId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      onDeleted(card.rowId);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not delete this submission. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const label = card?.name || card?.companyName || "this submission";

  return (
    <Modal open={open} onClose={onClose} title="Delete Submission">
      <div className="space-y-4">
        <p className="text-dark">
          Are you sure you want to delete <strong>{label}</strong>? This action cannot be undone.
        </p>
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>Cancel</Button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg px-6 py-3 font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-error bg-error text-white hover:bg-error/80 border border-error disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
