"use client";

import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  error?: string;
};

export default function Input({ label, helperText, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-dark">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border border-border bg-cream px-3 py-2 text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
