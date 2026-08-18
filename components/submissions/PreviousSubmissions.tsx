"use client";

import { useState, useCallback, useEffect } from "react";
import SubmissionSearch from "./SubmissionSearch";
import SubmissionsTable from "./SubmissionsTable";
import SubmissionImageModal from "./SubmissionImageModal";
import SubmissionEditModal from "./SubmissionEditModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import type { SubmittedCardSummary, CardColumnKey, CardListResponse } from "@/types/card";

const PAGE_SIZES = [10, 25, 50] as const;

export default function PreviousSubmissions() {
  const [rows, setRows] = useState<SubmittedCardSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState<CardColumnKey>("all");

  const [imageModalRowId, setImageModalRowId] = useState<string | null>(null);
  const [editCard, setEditCard] = useState<SubmittedCardSummary | null>(null);
  const [deleteCard, setDeleteCard] = useState<SubmittedCardSummary | null>(null);

  const fetchRows = useCallback(async (q: string, col: CardColumnKey, off: number, lim: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q, column: col, limit: String(lim), offset: String(off),
      });
      const res = await fetch(`/api/cards?${params}`);
      const data: CardListResponse = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error ?? "Failed to load");
      setRows(data.rows);
      setTotal(data.total);
      setOffset(off);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows(searchQuery, searchColumn, 0, pageSize);
  }, [searchQuery, searchColumn, pageSize, fetchRows]);

  const handleSearch = useCallback((query: string, column: CardColumnKey) => {
    setSearchQuery(query);
    setSearchColumn(column);
    setOffset(0);
  }, []);

  const handlePrev = () => {
    const newOffset = Math.max(0, offset - pageSize);
    fetchRows(searchQuery, searchColumn, newOffset, pageSize);
  };

  const handleNext = () => {
    const newOffset = offset + pageSize;
    if (newOffset < total) fetchRows(searchQuery, searchColumn, newOffset, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setOffset(0);
  };

  const handleSaved = (updated: SubmittedCardSummary) => {
    setRows((prev) => prev.map((r) => (r.rowId === updated.rowId ? updated : r)));
  };

  const handleDeleted = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId));
    setTotal((prev) => prev - 1);
  };

  const currentPage = Math.floor(offset / pageSize) + 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <SubmissionSearch onSearch={handleSearch} />

      {loading && rows.length === 0 && (
        <p className="text-center text-muted py-8">Loading previous submissions…</p>
      )}
      {error && (
        <p className="text-center text-error py-4">{error}</p>
      )}
      {!loading && !error && rows.length === 0 && (
        <p className="text-center text-muted py-8">
          {searchQuery ? "No submissions match your search." : "No submitted cards found yet."}
        </p>
      )}
      {rows.length > 0 && (
        <>
          <SubmissionsTable
            rows={rows}
            onViewImage={(rowId) => setImageModalRowId(rowId)}
            onEdit={(card) => setEditCard(card)}
            onDelete={(card) => setDeleteCard(card)}
          />

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Row size selector */}
            <div className="flex items-center gap-2 text-sm text-dark">
              <span className="text-muted">Rows per page:</span>
              {PAGE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    pageSize === size
                      ? "bg-dark text-cream font-medium"
                      : "bg-beige text-dark hover:bg-border"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">
                {offset + 1}–{Math.min(offset + pageSize, total)} of {total}
              </span>
              <button
                onClick={handlePrev}
                disabled={offset === 0 || loading}
                className="p-1.5 rounded-lg border border-border bg-cream hover:bg-beige text-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="text-sm text-dark font-medium">{currentPage} / {totalPages}</span>
              <button
                onClick={handleNext}
                disabled={offset + pageSize >= total || loading}
                className="p-1.5 rounded-lg border border-border bg-cream hover:bg-beige text-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </>
      )}

      <SubmissionImageModal
        open={imageModalRowId !== null}
        onClose={() => setImageModalRowId(null)}
        rowId={imageModalRowId}
      />
      <SubmissionEditModal
        open={editCard !== null}
        onClose={() => setEditCard(null)}
        card={editCard}
        onSaved={handleSaved}
      />
      <DeleteConfirmModal
        open={deleteCard !== null}
        onClose={() => setDeleteCard(null)}
        card={deleteCard}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
