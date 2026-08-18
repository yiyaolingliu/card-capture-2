"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = "rounded-lg px-6 py-3 font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-border disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-dark text-cream hover:bg-muted border border-dark",
    secondary: "bg-cream text-dark hover:bg-beige border border-border",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
