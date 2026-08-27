import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = ["", "about", "projects", "experience", "research", "skills", "lab", "resume", "contact"];
  const now = new Date("2026-08-28");
  return [
    ...sections.map((path) => ({
      url: new URL(path, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: path === "" ? ("monthly" as const) : ("yearly" as const),
      priority: path === "" ? 1 : path === "projects" ? 0.9 : 0.7,
    })),
    ...projects.map((project) => ({
      url: new URL(`projects/${project.slug}`, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
