import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Research", description: "Current research questions, prototypes, and technical investigations." };
export default function ResearchPage() { return <SystemShell initialSection="research" />; }
