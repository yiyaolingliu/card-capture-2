import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Card Capture 2: The Second One",
  description: "Upload business cards, review AI-generated information, and save verified contact details.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        <header className="border-b border-border bg-cream/60">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <h1 className="text-xl font-bold text-dark">Card Capture 2: The Second One</h1>
            <p className="text-sm text-muted">Upload a business card and review extracted information</p>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
