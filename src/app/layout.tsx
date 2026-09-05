import type { Metadata } from "next";

import { education, siteIdentity, technologyCategories } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";
import "@/components/boot/machine.css";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: "M0AZ_OS — Moaz Mustafa, software engineer", template: "%s · M0AZ_OS" },
  description: siteIdentity.headline,
  applicationName: "M0AZ_OS",
  authors: [{ name: siteIdentity.name, url: siteIdentity.linkedin }],
  creator: siteIdentity.name,
  keywords: [siteIdentity.name, "software engineer", "full-stack engineer", "product engineering", "developer tools", "systems engineering"],
  openGraph: { type: "website", title: "M0AZ_OS — Moaz Mustafa, software engineer", description: siteIdentity.headline, siteName: "M0AZ_OS" },
  twitter: { card: "summary_large_image", title: "M0AZ_OS — Moaz Mustafa, software engineer", description: siteIdentity.headline },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteIdentity.name,
    email: `mailto:${siteIdentity.email}`,
    url: SITE_URL.toString(),
    sameAs: [siteIdentity.linkedin, siteIdentity.github],
    jobTitle: "Software Engineer",
    description: siteIdentity.headline,
    alumniOf: education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.institution })),
    knowsAbout: technologyCategories.flatMap((category) => category.items.map((item) => item.name)),
  };

  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} /></body></html>;
}
