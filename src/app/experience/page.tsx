import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Experience", description: "Engineering practice, responsibilities, and working principles." };
export default function ExperiencePage() { return <SystemShell initialSection="experience" />; }
