"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { useSystem } from "./SystemProvider";

const bootLines = [
  ["identity.profile", "LOADED"],
  ["experience.timeline", "MOUNTED"],
  ["work.case-studies", "INDEXED"],
  ["recruiter.path", "ONLINE"],
  ["freelance.services", "ONLINE"],
  ["accessibility.guard", "PASS"],
  ["portfolio.interface", "READY"],
] as const;

export function BootScreen() {
  const { state, dispatch } = useSystem();
  const [input, setInput] = useState("");
  const [building, setBuilding] = useState(false);
  const [message, setMessage] = useState("Awaiting visitor command.");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state.bootVisible) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [state.bootVisible]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!["start", "init", "enter"].includes(command)) {
      setMessage(`Command “${input.trim() || "<empty>"}” not recognized. Type START.`);
      setInput("");
      inputRef.current?.focus();
      return;
    }
    setBuilding(true);
    setMessage("Building your portfolio session…");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      dispatch({ type: "SET_BOOT", visible: false, complete: true });
      dispatch({ type: "SET_REVEAL", active: true });
    }, reducedMotion ? 250 : 2350);
  };

  if (!state.bootVisible) return null;
  return <section className={building ? "boot-screen building" : "boot-screen"} aria-label="Initialize M0AZ_OS portfolio">
    <div className="boot-console">
      <header><b>M0AZ_OS / FIRST CONTACT</b><span>build.2026</span></header>
      <div className="boot-intro">
        <p className="eyebrow">INTERACTIVE PORTFOLIO</p>
        <h1>Initialize the site.</h1>
        <p>This portfolio reveals itself like a live system. Type <strong>START</strong> to load the recruiter and project interface.</p>
      </div>
      <form className="boot-command" onSubmit={submit}>
        <label htmlFor="boot-command-input">visitor@portfolio:~$</label>
        <input id="boot-command-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} disabled={building} autoComplete="off" spellCheck={false} aria-describedby="boot-command-help" />
        <span className="block-cursor" aria-hidden="true" />
      </form>
      <p id="boot-command-help" className="boot-message" aria-live="polite">{message}</p>
      <div className="boot-lines" aria-hidden={!building}>{bootLines.map(([service, status]) => <p key={service}><span>{service}</span><i /><b>[ {status} ]</b></p>)}</div>
      <div className="boot-progress" aria-hidden="true"><i /></div>
      <p className="boot-welcome">Session compiled. Mounting interface…</p>
    </div>
    <p className="boot-access-note">Keyboard required for initialization · accepted commands: START / INIT / ENTER</p>
  </section>;
}
