"use client";

import { useEffect } from "react";

import type { SectionId } from "@/types/domain";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { SystemProvider, useSystem } from "./SystemProvider";
import { Terminal } from "./Terminal";
import { Workspace } from "./Workspace";

function Shell() {
  const { state, dispatch } = useSystem();
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        dispatch({ type: "TOGGLE_PALETTE" });
      } else if (event.key === "Escape") {
        dispatch({ type: "TOGGLE_PALETTE", open: false });
      } else if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        window.dispatchEvent(new Event("m0az:focus-terminal"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);
  return (
    <div className="os-viewport" data-theme={state.theme}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <StatusBar />
      <div className="system-frame">
        <Sidebar />
        <Workspace />
      </div>
      <Terminal />
      <CommandPalette />
      <div className="scanlines" aria-hidden="true" />
    </div>
  );
}

export function SystemShell({
  initialSection,
  initialProjectSlug,
}: {
  initialSection: SectionId;
  initialProjectSlug?: string | null;
}) {
  return (
    <SystemProvider initialSection={initialSection} initialProjectSlug={initialProjectSlug}>
      <Shell />
    </SystemProvider>
  );
}
