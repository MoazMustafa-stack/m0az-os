"use client";

import { useEffect, useState } from "react";

import { siteIdentity } from "@/content/site";
import { useSystem } from "./SystemProvider";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function StatusBar() {
  const { state, dispatch } = useSystem();
  const [time, setTime] = useState("--:--");
  const isLight = state.theme === "light";

  useEffect(() => {
    const update = () => setTime(formatTime(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="status-bar" aria-label="System status">
      <button
        className="brand-lockup"
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_PALETTE", open: true })}
        aria-label="Open command palette"
      >
        <span className="brand-glyph" aria-hidden="true">M</span>
        <span>{siteIdentity.systemName}</span>
        <span className="build-label">build.2026</span>
      </button>
      <div className="status-cluster" aria-label="Fictional M0AZ_OS status values">
        <span><i className="status-dot" /> NET ONLINE</span>
        <span className="status-secondary">SESSION {state.sessionMode.toUpperCase()}</span>
        <button
          type="button"
          className="status-control"
          onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
          aria-pressed={state.soundEnabled}
        >
          SND {state.soundEnabled ? "ON" : "OFF"}
        </button>
        <button type="button" className="status-control theme-toggle" onClick={() => dispatch({ type: "SET_THEME", theme: isLight ? "phosphor" : "light" })} aria-pressed={isLight} aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}>
          {isLight ? "DARK" : "LIGHT"} MODE
        </button>
        <time>{time}</time>
      </div>
    </header>
  );
}
