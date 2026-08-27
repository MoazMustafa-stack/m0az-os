import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://m0az-os.dev"),
  title: {
    default: "M0AZ_OS — Moaz, software engineer",
    template: "%s · M0AZ_OS",
  },
  description:
    "A browser-native portfolio operating system by Moaz: product engineering, resilient systems, research, and an actually interactive terminal.",
  applicationName: "M0AZ_OS",
  authors: [{ name: "Moaz" }],
  creator: "Moaz",
  keywords: ["Moaz", "software engineer", "systems engineering", "product engineering", "Next.js portfolio"],
  openGraph: {
    type: "website",
    title: "M0AZ_OS — Moaz, software engineer",
    description: "A portfolio that behaves like a small operating system—clickable, indexable, and actually command-driven.",
    siteName: "M0AZ_OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "M0AZ_OS — Moaz, software engineer",
    description: "A browser-native portfolio operating system.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>{children}</body>
    </html>
  );
}
