import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Skills and capabilities", description: "Languages, frameworks, developer tools, delivery capabilities, and project evidence." };
export default function SkillsPage() { return <SystemShell initialSection="skills" />; }
