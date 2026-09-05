"use client";

import { useEffect, useRef } from "react";

import { navigation, projects, secondaryNavigation } from "@/content/site";
import type { SectionId } from "@/types/domain";
import { BootScreen } from "./BootScreen";
import { CommandPalette } from "./CommandPalette";
import { NotificationCenter } from "./NotificationCenter";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { SystemProvider, useSystem } from "./SystemProvider";
import { Terminal } from "./Terminal";
import { Workspace } from "./Workspace";

function Shell() {
  const { state, dispatch } = useSystem();
  const viewportRef = useRef<HTMLDivElement>(null);
  const wasBootVisible = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = viewportRef.current;
    if (!root) return;
    if (!state.bootVisible) {
      if (wasBootVisible.current) {
        const main = root.querySelector<HTMLElement>("#main-content");
        if (main) {
          const oldTabIndex = main.getAttribute("tabindex");
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
          if (oldTabIndex === null) main.removeAttribute("tabindex");
          else main.setAttribute("tabindex", oldTabIndex);
        }
      }
      wasBootVisible.current = false;
      return;
    }
    wasBootVisible.current = true;
    const covered = Array.from(root.children).filter((child): child is HTMLElement =>
      child instanceof HTMLElement && !child.classList.contains("machine-boot"));
    const previous = covered.map((child) => child.inert);
    covered.forEach((child) => { child.inert = true; });
    return () => covered.forEach((child, index) => { child.inert = previous[index]; });
  }, [state.bootVisible]);
  useEffect(() => {
    if (typeof window === "undefined" || !state.revealSequence) return;
    const timer = window.setTimeout(() => dispatch({ type: "SET_REVEAL", active: false }), 1900);
    return () => window.clearTimeout(timer);
  }, [dispatch, state.revealSequence]);
  useEffect(() => {
    if (typeof window === "undefined" || state.bootVisible) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        dispatch({ type: "TOGGLE_PALETTE" });
      } else if (event.key === "Escape" && !state.bootVisible) {
        dispatch({ type: "TOGGLE_PALETTE", open: false });
      } else if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        window.dispatchEvent(new Event("m0az:focus-terminal"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, state.bootVisible]);
  return (
    <div ref={viewportRef} className={state.revealSequence ? "os-viewport revealing booted" : state.bootComplete ? "os-viewport booted" : "os-viewport"} data-theme={state.theme}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {!state.bootVisible ? <div className="machine-afterglow" aria-hidden="true" /> : null}
      <div className="shell-topbar">
        <StatusBar />
        <dl className="session-meters" aria-label="Portfolio session readout">
          <div title="Commands retained in local history"><dt>CMDS</dt><dd>{state.commandHistory.length}</dd></div>
          <div title="Navigable portfolio pages and case studies"><dt>ROUTES</dt><dd>{navigation.length + secondaryNavigation.length + projects.length}</dd></div>
          <div><dt>THEME</dt><dd>{state.theme}</dd></div>
        </dl>
      </div>
      <div className="system-frame">
        <Sidebar />
        <Workspace />
      </div>
      <Terminal />
      <CommandPalette />
      <NotificationCenter />
      <BootScreen key={state.bootVisible ? "boot-open" : "boot-closed"} />
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
