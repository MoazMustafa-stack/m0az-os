import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Skills", description: "Active engineering areas and technical working sets." };
export default function SkillsPage() { return <SystemShell initialSection="skills" />; }
