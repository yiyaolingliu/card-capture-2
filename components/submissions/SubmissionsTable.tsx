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
  const actionBtn = "text-xs px-2 py-1 rounded border border-border bg-cream hover:bg-beige text-dark transition-colors";
  const deleteBtn = "text-xs px-2 py-1 rounded border border-error/40 bg-cream hover:bg-error/10 text-error transition-colors";

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-beige text-left text-dark font-medium">
              <th className="px-3 py-3 w-14"></th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Company</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Milestone</th>
              <th className="px-3 py-3">Remark</th>
              <th className="px-3 py-3 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rowId} className="border-t border-border hover:bg-beige/40 transition-colors">
                <td className="px-3 py-2"><PresetCardIcon /></td>
                <td className="px-3 py-2 truncate max-w-[120px]" title={row.name}>{row.name}</td>
                <td className="px-3 py-2 truncate max-w-[100px]" title={row.title}>{row.title}</td>
                <td className="px-3 py-2 truncate max-w-[120px]" title={row.companyName}>{row.companyName}</td>
                <td className="px-3 py-2 truncate max-w-[140px]" title={row.email}>{row.email}</td>
                <td className="px-3 py-2 truncate max-w-[110px]" title={row.phoneNumber}>{row.phoneNumber}</td>
                <td className="px-3 py-2 truncate max-w-[100px]" title={row.milestoneMoments}>{row.milestoneMoments}</td>
                <td className="px-3 py-2 truncate max-w-[100px]" title={row.remark}>{row.remark}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1.5">
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
