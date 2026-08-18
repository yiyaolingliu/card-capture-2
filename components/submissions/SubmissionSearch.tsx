"use client";

import { useState, useEffect, useRef } from "react";
import type { CardColumnKey } from "@/types/card";

const COLUMN_OPTIONS: { value: CardColumnKey; label: string }[] = [
  { value: "all", label: "All columns" },
  { value: "name", label: "Name" },
  { value: "companyName", label: "Company Name" },
  { value: "email", label: "Email" },
  { value: "phoneNumber", label: "Phone Number" },
  { value: "companyRegion", label: "Company Region" },
  { value: "companyCountry", label: "Company Country" },
  { value: "milestoneMoments", label: "Milestone Moments" },
  { value: "remark", label: "Remark" },
];

type Props = {
  onSearch: (query: string, column: CardColumnKey) => void;
};

export default function SubmissionSearch({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [column, setColumn] = useState<CardColumnKey>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query, column);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, column, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="Search submissions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 rounded-lg border border-border bg-cream px-3 py-2 text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark"
      />
      <select
        value={column}
        onChange={(e) => setColumn(e.target.value as CardColumnKey)}
        className="rounded-lg border border-border bg-cream px-3 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-dark"
      >
        {COLUMN_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
