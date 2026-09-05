"use client";

import { useEffect, useRef } from "react";

import type { ThemeId } from "@/types/domain";
import { RealisticPC } from "./RealisticPC";

export type MachinePhase = "idle" | "building" | "entering";

const SCREEN_LINES = [
  ["identity.profile", "LOADED"],
  ["experience.timeline", "MOUNTED"],
  ["work.case-studies", "INDEXED"],
  ["recruiter.path", "ONLINE"],
  ["freelance.services", "ONLINE"],
  ["accessibility.guard", "PASS"],
  ["portfolio.interface", "READY"],
] as const;

function CrtScreenContent({ active }: { active: boolean }) {
  if (!active) {
    return (
      <div className="crt-standby" aria-hidden="true">
        <p>M0AZ_OS … STANDBY</p>
        <span>AWAITING POWER</span>
      </div>
    );
  }
  return (
    <div className="crt-boot" aria-hidden="true">
      {SCREEN_LINES.map(([service, status]) => (
        <p key={service}>
          <span>{service}</span>
          <i />
          <b>[ {status} ]</b>
        </p>
      ))}
      <div className="crt-progress">
        <i />
      </div>
      <p className="crt-welcome">Session compiled. Mounting interface…</p>
    </div>
  );
}

function DustCanvas({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    const media = window.matchMedia("(min-width: 681px) and (prefers-reduced-motion: no-preference)");
    const tint = window.getComputedStyle(canvas).getPropertyValue("--green").trim();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      s: 0.0004 + Math.random() * 0.0012,
      o: 0.08 + Math.random() * 0.22,
    }));
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y -= d.s;
        if (d.y < -0.02) d.y = 1.02;
        ctx.globalAlpha = d.o;
        ctx.fillStyle = tint;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      window.cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
      if (media.matches) raf = window.requestAnimationFrame(tick);
    };
    media.addEventListener("change", sync);
    sync();
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", sync);
    };
  }, [enabled]);
  if (!enabled) return null;
  return <canvas ref={ref} className="dust" aria-hidden="true" />;
}

export function MachineScene({
  phase,
  theme,
  onPower,
  powerRef,
}: {
  phase: MachinePhase;
  theme: ThemeId;
  onPower: () => void;
  powerRef?: React.Ref<HTMLButtonElement>;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined" || phase !== "idle") return;
    const scene = sceneRef.current;
    if (!scene) return;
    const media = window.matchMedia("(min-width: 681px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const move = (event: PointerEvent) => {
      const box = scene.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    };
    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      scene.style.setProperty("--px", String(x));
      scene.style.setProperty("--py", String(y));
      raf = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      scene.removeEventListener("pointermove", move);
      window.cancelAnimationFrame(raf);
      scene.style.removeProperty("--px");
      scene.style.removeProperty("--py");
    };
    const sync = () => {
      stop();
      if (media.matches) { scene.addEventListener("pointermove", move); raf = window.requestAnimationFrame(tick); }
    };
    sync();
    media.addEventListener("change", sync);
    return () => { stop(); media.removeEventListener("change", sync); };
  }, [phase]);
  const sceneClass =
    phase === "building" ? "machine-scene building" : phase === "entering" ? "machine-scene entering" : "machine-scene";
  return (
    <div ref={sceneRef} className={sceneClass} data-theme={theme}>
      <DustCanvas key={theme} enabled={phase !== "entering"} />
      <div className="machine-stage">
        <div className="machine-head">
          <p className="eyebrow">M0AZ_OS / FIRST CONTACT — build.2026</p>
          <h2>Initialize the site.</h2>
          <p className="machine-sub">
            This portfolio reveals itself like a live system. Click <strong>POWER</strong> or type{" "}
            <strong>START</strong> below.
          </p>
          <div className="machine-editorial">
            <span className="machine-edition">PERSONAL WORKSTATION — 001</span>
            <p>Built to be explored.<br />Engineered to do real work.</p>
            <div className="machine-chapters"><span>01 / EXPERIENCE</span><span>02 / SELECTED WORK</span><span>03 / LET’S BUILD</span></div>
          </div>
          <p className="machine-inspect">Drag the workstation to look around. Power on when you’re ready.</p>
        </div>
        <RealisticPC phase={phase} theme={theme} onPower={onPower} />
        <div className="computer" aria-hidden="false">
          <div className="monitor">
            <div className="screen">
              <CrtScreenContent active={phase !== "idle"} />
              <div className="crt-glare" aria-hidden="true" />
              <div className="crt-scan" aria-hidden="true" />
            </div>
            <div className="monitor-row">
              <span className="led" aria-hidden="true">
                <i />
                PWR
              </span>
              {phase === "building" ? <span className="led activity-led" aria-hidden="true"><i />BUSY</span> : null}
              <button ref={powerRef} type="button" className="power-btn" disabled={phase !== "idle"} onClick={onPower} aria-label="Power on M0AZ_OS">
                <span aria-hidden="true">⏻</span> POWER
              </button>
              <span className="brand-tag" aria-hidden="true">
                M0AZ-TRON 2000
              </span>
            </div>
          </div>
          <div className="keyboard-base" aria-hidden="true">
            <div className="key-row">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className={i === 5 ? "wide" : ""} />
              ))}
            </div>
            <div className="key-row">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={i === 9 ? "wide" : ""} />
              ))}
            </div>
          </div>
        </div>
        <div className="sticky-notes" aria-hidden="true">
          <span className="note n1">hire me? → WORK</span>
          <span className="note n2">try: help / ssh velora</span>
        </div>
      </div>
    </div>
  );
}
