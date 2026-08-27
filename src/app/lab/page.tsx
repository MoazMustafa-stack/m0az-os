import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Lab", description: "Engineering experiments, prototypes, and honest failure archives." };
export default function LabPage() { return <SystemShell initialSection="lab" />; }
