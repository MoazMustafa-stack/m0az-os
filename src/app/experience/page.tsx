import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Experience", description: "Cordis.us software engineering experience, education, demonstrated capabilities, and résumé." };
export default function ExperiencePage() { return <SystemShell initialSection="experience" />; }
