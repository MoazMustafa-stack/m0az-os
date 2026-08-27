import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Resume", description: "A concise, web-accessible engineering profile and selected work." };
export default function ResumePage() { return <SystemShell initialSection="resume" />; }
