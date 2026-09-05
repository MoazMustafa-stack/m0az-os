"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { MachineScene } from "@/components/boot/MachineScene";
import { playBootSound, playClick } from "@/lib/boot-sound";
import { useSystem } from "./SystemProvider";

export function BootScreen() {
  const { state, dispatch } = useSystem();
  const [input, setInput] = useState("");
  const [building, setBuilding] = useState(false);
  const [entering, setEntering] = useState(false);
  const [message, setMessage] = useState("Awaiting visitor command. Click START or type START.");
  const inputRef = useRef<HTMLInputElement>(null);
  const powerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !state.bootVisible) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotion.current = media.matches; };
    updateMotion();
    media.addEventListener("change", updateMotion);
    const timer = window.setTimeout(() => powerRef.current?.focus({ preventScroll: true }), 40);
    return () => { window.clearTimeout(timer); media.removeEventListener("change", updateMotion); };
  }, [state.bootVisible]);

  useEffect(() => {
    if (typeof window === "undefined" || !building || entering) return;
    const timer = window.setTimeout(() => setEntering(true), reducedMotion.current ? 250 : 2350);
    return () => window.clearTimeout(timer);
  }, [building, entering]);

  useEffect(() => {
    if (typeof window === "undefined" || !entering) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "SET_BOOT", visible: false, complete: true });
      dispatch({ type: "SET_REVEAL", active: true });
    }, reducedMotion.current ? 60 : 450);
    return () => window.clearTimeout(timer);
  }, [dispatch, entering]);

  const startBoot = (source: "button" | "typed") => {
    if (building) return;
    playClick(state.soundEnabled);
    playBootSound(state.soundEnabled);
    setBuilding(true);
    setMessage(source === "button" ? "Power engaged. Building your portfolio session…" : "Building your portfolio session…");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!["start", "init", "enter"].includes(command)) {
      setMessage(`Command “${input.trim() || "<empty>"}” not recognized. Type START.`);
      setInput("");
      inputRef.current?.focus();
      return;
    }
    startBoot("typed");
  };

  if (!state.bootVisible) return null;
  return <section className={building ? "boot-screen machine-boot building" : "boot-screen machine-boot"} aria-label="Initialize M0AZ_OS portfolio">
    <MachineScene phase={entering ? "entering" : building ? "building" : "idle"} theme={state.theme} onPower={() => startBoot("button")} powerRef={powerRef} />
    <div className="boot-command-row">
      <form className="boot-command" onSubmit={submit}>
        <label htmlFor="boot-command-input">visitor@portfolio:~$</label>
        <input id="boot-command-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} disabled={building} autoComplete="off" spellCheck={false} aria-describedby="boot-command-help" />
        <span className="block-cursor" aria-hidden="true" />
      </form>
      <p id="boot-command-help" className="boot-message" aria-live="polite">{message}</p>
    </div>
    <p className="boot-access-note">Click START or type START / INIT / ENTER</p>
  </section>;
}
