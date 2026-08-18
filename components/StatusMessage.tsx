"use client";

type StatusMessageProps = {
  type: "loading" | "error" | "success";
  message: string;
};

export default function StatusMessage({ type, message }: StatusMessageProps) {
  const styles = {
    loading: "bg-cream text-dark border-border",
    error: "bg-red-50 text-error border-error",
    success: "bg-green-50 text-success border-green-600",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm flex items-center gap-2 ${styles[type]}`} role={type === "error" ? "alert" : "status"}>
      {type === "loading" && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {message}
    </div>
  );
}
