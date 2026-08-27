"use client";

import { useEffect } from "react";
import { useSystem } from "./SystemProvider";

const bootLines = [
  ["CPU0", "OK"],
  ["MEMORY", "OK"],
  ["NETWORK", "ONLINE"],
  ["FILESYSTEM", "MOUNTED"],
  ["portfolio.service", "OK"],
  ["projects.service", "OK"],
  ["terminal.service", "OK"],
  ["sleep.service", "FAIL"],
] as const;

export function BootScreen() {
  const { state, dispatch } = useSystem();

  useEffect(() => {
    if (!state.bootVisible) return;
    const finish = () => dispatch({ type: "SET_BOOT", visible: false, complete: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const finishTimer = window.setTimeout(finish, 2700);
    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [dispatch, state.bootVisible]);

  if (!state.bootVisible) return null;
  return (
    <section className="boot-screen" aria-label="M0AZ_OS boot sequence">
      <div className="boot-console">
        <header><b>M0AZ BIOS</b><span>v1.0.26</span></header>
        <p className="boot-memory">Initializing publication-safe portfolio kernel...</p>
        <div className="boot-lines">
          {bootLines.map(([service, status]) => (
            <p key={service}><span>{service}</span><i /><b className={status === "FAIL" ? "fail" : ""}>[ {status} ]</b></p>
          ))}
        </div>
        <div className="boot-progress"><i /></div>
        <p className="boot-welcome">Welcome to M0AZ_OS</p>
      </div>
      <button type="button" onClick={() => dispatch({ type: "SET_BOOT", visible: false, complete: true })}>SKIP BOOT [ESC]</button>
    </section>
  );
}
