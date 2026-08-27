import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Projects", description: "Selected product systems, research prototypes, and engineering case studies." };
export default function ProjectsPage() { return <SystemShell initialSection="projects" />; }
