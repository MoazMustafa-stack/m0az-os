import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Work", description: "Flagship engineering case studies, focused builds, research prototypes, and verified outcomes." };
export default function ProjectsPage() { return <SystemShell initialSection="projects" />; }
