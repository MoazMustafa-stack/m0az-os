"use client";

import type { SectionId } from "@/types/domain";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { SystemProvider, useSystem } from "./SystemProvider";
import { Workspace } from "./Workspace";

function TerminalPlaceholder() {
  const { state, dispatch } = useSystem();
  return (
    <section className={state.terminalExpanded ? "terminal-dock expanded" : "terminal-dock"} aria-label="Interactive terminal">
      <button
        className="terminal-bar"
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_TERMINAL" })}
        aria-expanded={state.terminalExpanded}
      >
        <span><i className="terminal-light" /> TERMINAL / portfolio-sh</span>
        <span>{state.terminalExpanded ? "MINIMIZE" : "EXPAND"} <b aria-hidden="true">⌃</b></span>
      </button>
      <div className="terminal-placeholder">
        <span className="terminal-prompt">moaz@{state.host}:~$</span>
        <span> type <strong>help</strong> to explore</span><i className="block-cursor" aria-hidden="true" />
      </div>
    </section>
  );
}

function Shell() {
  const { state } = useSystem();
  return (
    <div className="os-viewport" data-theme={state.theme}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <StatusBar />
      <div className="system-frame">
        <Sidebar />
        <Workspace />
      </div>
      <TerminalPlaceholder />
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
