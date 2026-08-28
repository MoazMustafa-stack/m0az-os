"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { navigation, projects, secondaryNavigation } from "@/content/site";
import { useSystem } from "./SystemProvider";

export function CommandPalette() {
  const { state, dispatch, navigate } = useSystem();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const actions = useMemo(() => [
    ...[...navigation, ...secondaryNavigation].map((item) => ({ id: `nav-${item.id}`, label: `Open ${item.label}`, detail: item.path, run: () => navigate(item.id) })),
    ...projects.map((project) => ({ id: `project-${project.slug}`, label: `SSH ${project.name}`, detail: project.category, run: () => { navigate("project", project.slug); dispatch({ type: "SET_DIRECTORY", directory: `/home/moaz/projects/${project.slug}`, host: project.slug }); } })),
    { id: "terminal", label: "Launch terminal", detail: "portfolio-sh", run: () => { dispatch({ type: "TOGGLE_PALETTE", open: false }); window.dispatchEvent(new Event("m0az:focus-terminal")); } },
    { id: "theme", label: `Switch to ${state.theme === "light" ? "dark" : "light"} mode`, detail: state.theme, run: () => dispatch({ type: "SET_THEME", theme: state.theme === "light" ? "phosphor" : "light" }) },
  ], [dispatch, navigate, state.theme]);
  const filtered = actions.filter((action) => `${action.label} ${action.detail}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (state.paletteOpen) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      window.setTimeout(() => inputRef.current?.focus(), 20);
      const keepFocusInside = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      };
      document.addEventListener("keydown", keepFocusInside);
      return () => {
        document.removeEventListener("keydown", keepFocusInside);
        previousFocusRef.current?.focus();
      };
    }
  }, [state.paletteOpen]);

  if (!state.paletteOpen) return null;
  return (
    <div className="palette-backdrop" role="presentation" onMouseDown={() => dispatch({ type: "TOGGLE_PALETTE", open: false })}>
      <section ref={dialogRef} className="command-palette" role="dialog" aria-modal="true" aria-labelledby="palette-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><span id="palette-title">SYSTEM COMMAND</span><button type="button" onClick={() => dispatch({ type: "TOGGLE_PALETTE", open: false })} aria-label="Close command palette">ESC</button></header>
        <label><span aria-hidden="true">›</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search modules, projects, actions..." /></label>
        <div className="palette-results">
          {filtered.map((action) => <button type="button" key={action.id} onClick={action.run}><span>{action.label}</span><small>{action.detail}</small></button>)}
          {filtered.length === 0 ? <p>No matching system action.</p> : null}
        </div>
        <footer><span>↑↓ navigate</span><span>ENTER select</span><span>ESC close</span></footer>
      </section>
    </div>
  );
}
