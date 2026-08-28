import type { Metadata } from "next";
import { SystemShell } from "@/components/system/SystemShell";

export const metadata: Metadata = { title: "Contact", description: "Recruiting contact, freelance product and web services, consulting, and public professional channels." };
export default function ContactPage() { return <SystemShell initialSection="contact" />; }
