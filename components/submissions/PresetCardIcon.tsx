"use client";

import Image from "next/image";

export default function PresetCardIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/card-icon.svg"
      alt="Business card image available"
      width={48}
      height={36}
      className={`inline-block ${className}`}
      unoptimized
    />
  );
}
