import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "About", description: "Profile, engineering values, interests, and current focus." };
export default function AboutPage() { return <SystemShell initialSection="about" />; }
