"use client";

type ImagePreviewProps = {
  src: string;
  onRemove?: () => void;
};

export default function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative rounded-xl border border-border bg-cream overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Uploaded business card" className="w-full h-auto object-contain max-h-80" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 rounded-full bg-dark/70 text-cream p-1 hover:bg-dark transition-colors"
          aria-label="Remove image"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
