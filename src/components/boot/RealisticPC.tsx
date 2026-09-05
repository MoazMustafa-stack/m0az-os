"use client";

import { useEffect, useRef } from "react";
import type { MachinePhase } from "./MachineScene";
import type { ThemeId } from "@/types/domain";
import type { PCView } from "./pc-renderer";

export function RealisticPC({ phase, theme, onPower }: { phase: MachinePhase; theme: ThemeId; onPower: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<PCView | null>(null);
  const current = useRef({ phase, theme, onPower });
  useEffect(() => {
    current.current = { phase, theme, onPower };
    viewRef.current?.update(phase, theme);
  }, [phase, theme, onPower]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = hostRef.current;
    if (!host) return;
    const scene = host.closest<HTMLElement>(".machine-scene");
    const media = window.matchMedia("(min-width: 681px) and (prefers-reduced-motion: no-preference)");
    let generation = 0;
    let timer = 0;
    const stop = () => {
      generation++;
      window.clearTimeout(timer);
      viewRef.current?.dispose();
      viewRef.current = null;
      scene?.removeAttribute("data-webgl");
    };
    const sync = async () => {
      stop();
      if (!media.matches) return;
      const request = generation;
      try {
        const { createPC } = await import("./pc-renderer");
        if (request !== generation || current.current.phase !== "idle") return;
        const view = createPC(host, () => {
          if (current.current.phase === "idle") current.current.onPower();
        }, stop);
        viewRef.current = view;
        scene?.setAttribute("data-webgl", "ready");
        view.update(current.current.phase, current.current.theme);
      } catch {
        // The accessible CSS machine remains usable if WebGL/chunk loading fails.
        stop();
      }
    };
    const schedule = () => {
      stop();
      // Let the native autofocus and first paint finish before compiling WebGL.
      timer = window.setTimeout(() => { void sync(); }, 150);
    };
    schedule();
    media.addEventListener("change", schedule);
    return () => { stop(); media.removeEventListener("change", schedule); };
  }, []);

  return <div ref={hostRef} className="realistic-pc" aria-hidden="true" />;
}
