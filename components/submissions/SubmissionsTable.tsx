"use client";

import PresetCardIcon from "./PresetCardIcon";
import type { SubmittedCardSummary } from "@/types/card";

type Props = {
  rows: SubmittedCardSummary[];
  onViewImage: (rowId: string) => void;
  onEdit: (card: SubmittedCardSummary) => void;
  onDelete: (card: SubmittedCardSummary) => void;
};

export default function SubmissionsTable({ rows, onViewImage, onEdit, onDelete }: Props) {
  const actionBtn = "text-xs px-2 py-1 rounded border border-border bg-cream hover:bg-beige text-dark transition-colors whitespace-nowrap";
  const deleteBtn = "text-xs px-2 py-1 rounded border border-error/40 bg-cream hover:bg-error/10 text-error transition-colors whitespace-nowrap";

  const ScrollCell = ({ children }: { children: React.ReactNode }) => (
    <td className="px-4 py-3 align-top">
      <div className="overflow-y-auto max-h-[4.5rem] text-sm scrollbar-thin">
        {children}
      </div>
    </td>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-beige text-left text-dark font-medium">
              <th className="px-4 py-3 w-[180px]">Name</th>
              <th className="px-4 py-3 w-[160px]">Title</th>
              <th className="px-4 py-3 w-[180px]">Company</th>
              <th className="px-4 py-3 w-[200px]">Email</th>
              <th className="px-4 py-3 w-[150px]">Phone</th>
              <th className="px-4 py-3 w-[160px]">Milestone</th>
              <th className="px-4 py-3 w-[160px]">Remark</th>
              <th className="px-4 py-3 w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rowId} className="border-t border-border hover:bg-beige/40 transition-colors">
                <ScrollCell>{row.name || "—"}</ScrollCell>
                <ScrollCell>{row.title || "—"}</ScrollCell>
                <ScrollCell>{row.companyName || "—"}</ScrollCell>
                <ScrollCell>{row.email || "—"}</ScrollCell>
                <ScrollCell>{row.phoneNumber || "—"}</ScrollCell>
                <ScrollCell>{row.milestoneMoments || "—"}</ScrollCell>
                <ScrollCell>{row.remark || "—"}</ScrollCell>
                <td className="px-4 py-3 align-top">
                  <div className="flex gap-1.5 flex-wrap">
                    {row.hasImage && (
                      <button onClick={() => onViewImage(row.rowId)} className={actionBtn}>View Image</button>
                    )}
                    <button onClick={() => onEdit(row)} className={actionBtn}>Edit</button>
                    <button onClick={() => onDelete(row)} className={deleteBtn}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.rowId} className="rounded-xl border border-border bg-cream p-4 space-y-2">
            <div className="flex items-center gap-3">
              <PresetCardIcon />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark truncate">{row.name || "—"}</p>
                <p className="text-xs text-muted truncate">{row.title}{row.companyName ? ` · ${row.companyName}` : ""}</p>
              </div>
            </div>
            {row.email && <p className="text-xs text-muted truncate">✉ {row.email}</p>}
            {row.phoneNumber && <p className="text-xs text-muted truncate">☎ {row.phoneNumber}</p>}
            <div className="flex gap-2 pt-1">
              {row.hasImage && (
                <button onClick={() => onViewImage(row.rowId)} className={actionBtn}>View Image</button>
              )}
              <button onClick={() => onEdit(row)} className={actionBtn}>Edit</button>
              <button onClick={() => onDelete(row)} className={deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
