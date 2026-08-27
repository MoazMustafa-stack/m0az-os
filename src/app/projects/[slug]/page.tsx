import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SystemShell } from "@/components/system/SystemShell";
import { projects } from "@/content/site";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.oneLineDescription,
    openGraph: { title: `${project.name} · M0AZ_OS`, description: project.oneLineDescription, images: [] },
    twitter: { card: "summary", title: `${project.name} · M0AZ_OS`, description: project.oneLineDescription, images: [] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!projects.some((project) => project.slug === slug)) notFound();
  return <SystemShell initialSection="project" initialProjectSlug={slug} />;
}
