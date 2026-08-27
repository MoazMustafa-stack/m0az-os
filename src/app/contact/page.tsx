import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Contact", description: "Public, publication-safe channels for contacting Moaz." };
export default function ContactPage() { return <SystemShell initialSection="contact" />; }
