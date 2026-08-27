"use client";

import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";

import { achievements } from "@/content/site";
import { completeInput, executeTerminalCommand } from "@/lib/terminal/commands";
import { formatPath } from "@/lib/terminal/filesystem";
import type { AchievementId, TerminalEntry } from "@/types/domain";
import { STORAGE_KEY, useSystem } from "./SystemProvider";

let nextEntryId = 20;
const entries = (lines: string[], kind: TerminalEntry["kind"]): TerminalEntry[] =>
  lines.map((text) => ({ id: nextEntryId++, kind, text }));

export function Terminal() {
  const { state, dispatch, navigate } = useSystem();
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focus = () => {
      dispatch({ type: "TOGGLE_TERMINAL", expanded: true });
      window.setTimeout(() => inputRef.current?.focus(), 20);
    };
    window.addEventListener("m0az:focus-terminal", focus);
    return () => window.removeEventListener("m0az:focus-terminal", focus);
  }, [dispatch]);

  useEffect(() => {
    if (state.terminalExpanded) transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight });
  }, [state.terminalEntries, state.terminalExpanded]);

  const unlock = (achievement: AchievementId, secret?: string) => {
    if (state.achievements.includes(achievement)) return;
    dispatch({ type: "UNLOCK", achievement, secret });
    const definition = achievements.find((item) => item.id === achievement);
    if (definition) dispatch({ type: "APPEND_ENTRIES", entries: entries([`[achievement] ${definition.name} unlocked`], "system") });
  };

  const run = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    document.documentElement.classList.remove("low-power");
    const history = [...state.commandHistory.filter((item) => item !== command), command].slice(-50);
    dispatch({ type: "SET_HISTORY", history });
    dispatch({ type: "INCREMENT_COMMAND" });
    dispatch({ type: "TOGGLE_TERMINAL", expanded: true });
    dispatch({ type: "APPEND_ENTRIES", entries: entries([command], "command") });

    const result = executeTerminalCommand(command, {
      cwd: state.terminalDirectory,
      host: state.host,
      history,
      mode: state.sessionMode,
      startedAt: state.startedAt,
      theme: state.theme,
      soundEnabled: state.soundEnabled,
      activeProjectSlug: state.activeProjectSlug,
      achievements: state.achievements,
    });

    if (result.effect?.clear) dispatch({ type: "CLEAR_TERMINAL" });
    else if (result.lines.length) dispatch({ type: "APPEND_ENTRIES", entries: entries(result.lines, result.error ? "error" : "output") });

    const effect = result.effect;
    if (effect?.navigate) navigate(effect.navigate.section, effect.navigate.projectSlug);
    if (effect?.directory) dispatch({ type: "SET_DIRECTORY", directory: effect.directory, host: effect.host });
    else if (effect?.host) dispatch({ type: "SET_DIRECTORY", directory: state.terminalDirectory, host: effect.host });
    if (effect?.theme) dispatch({ type: "SET_THEME", theme: effect.theme });
    if (effect?.sound !== undefined) dispatch({ type: "TOGGLE_SOUND", enabled: effect.sound });
    if (effect?.root !== undefined) dispatch({ type: "SET_ROOT", enabled: effect.root });
    if (effect?.resetLocal) {
      window.localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "RESET_LOCAL" });
    }
    if (effect?.reboot) dispatch({ type: "SET_BOOT", visible: true, complete: false });
    if (effect?.shutdown) document.documentElement.classList.add("low-power");
    if (effect?.panic) {
      document.documentElement.classList.add("system-panic");
      window.setTimeout(() => document.documentElement.classList.remove("system-panic"), 1600);
    }
    if (effect?.openUrl) window.open(effect.openUrl, "_blank", "noopener,noreferrer");
    if (effect?.unlock) unlock(effect.unlock, effect.secret);
    if (state.commandCount === 0) unlock("first-command");
    if (state.commandCount + 1 === 10) unlock("sysadmin");
    setAnnouncement(result.lines.at(-1) ?? "command complete");
    setInput("");
    setHistoryIndex(-1);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    run(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, state.commandHistory.length - 1);
      setHistoryIndex(next);
      setInput(state.commandHistory[state.commandHistory.length - 1 - next] ?? input);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(next < 0 ? "" : state.commandHistory[state.commandHistory.length - 1 - next] ?? "");
    } else if (event.key === "Tab") {
      event.preventDefault();
      const completion = completeInput(input, state.terminalDirectory);
      setInput(completion.value);
      if (completion.matches.length > 1) dispatch({ type: "APPEND_ENTRIES", entries: entries([completion.matches.join("  ")], "system") });
    } else if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      dispatch({ type: "CLEAR_TERMINAL" });
    } else if (event.key.toLowerCase() === "c" && event.ctrlKey) {
      event.preventDefault();
      dispatch({ type: "APPEND_ENTRIES", entries: entries(["^C"], "system") });
      setInput("");
    }
  };

  const prompt = `${state.sessionMode === "root" ? "root" : "moaz"}@${state.host}:${formatPath(state.terminalDirectory)}$`;

  return (
    <section className={state.terminalExpanded ? "terminal-dock expanded" : "terminal-dock"} aria-label="Interactive portfolio terminal">
      <button className="terminal-bar" type="button" onClick={() => dispatch({ type: "TOGGLE_TERMINAL" })} aria-expanded={state.terminalExpanded}>
        <span><i className="terminal-light" /> TERMINAL / portfolio-sh</span>
        <span>{state.terminalExpanded ? "MINIMIZE" : "EXPAND"} <b aria-hidden="true">{state.terminalExpanded ? "⌄" : "⌃"}</b></span>
      </button>
      {state.terminalExpanded ? (
        <div className="terminal-transcript" ref={transcriptRef} role="log" aria-label="Terminal transcript">
          {state.terminalEntries.map((entry) => (
            <div className={`terminal-entry ${entry.kind}`} key={entry.id}>
              {entry.kind === "command" ? <><span className="entry-prompt">{prompt}</span> {entry.text}</> : entry.text || <br />}
            </div>
          ))}
        </div>
      ) : null}
      <form className="terminal-input-row" onSubmit={submit}>
        <label className="sr-only" htmlFor="terminal-input">M0AZ_OS terminal command</label>
        <span className="terminal-prompt" aria-hidden="true">{prompt}</span>
        <input id="terminal-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} autoComplete="off" spellCheck={false} enterKeyHint="send" aria-describedby="terminal-help" />
        <span className="block-cursor" aria-hidden="true" />
        <span id="terminal-help" className="sr-only">Type help for commands. Use Up and Down for history, Tab for completion.</span>
      </form>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
