"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { navigation } from "@/content/site";
import type {
  AchievementId,
  PersistedSession,
  SectionId,
  SessionState,
  TerminalEntry,
  ThemeId,
} from "@/types/domain";

const STORAGE_KEY = "m0az-os:session";

type SystemEvent =
  | { type: "NAVIGATE"; section: SectionId; projectSlug?: string | null }
  | { type: "SET_DIRECTORY"; directory: string; host?: string }
  | { type: "APPEND_ENTRIES"; entries: TerminalEntry[] }
  | { type: "CLEAR_TERMINAL" }
  | { type: "SET_HISTORY"; history: string[] }
  | { type: "SET_THEME"; theme: ThemeId }
  | { type: "TOGGLE_TERMINAL"; expanded?: boolean }
  | { type: "TOGGLE_PALETTE"; open?: boolean }
  | { type: "TOGGLE_SOUND"; enabled?: boolean }
  | { type: "SET_BOOT"; visible: boolean; complete?: boolean }
  | { type: "SET_STARTED"; startedAt: number }
  | { type: "UNLOCK"; achievement: AchievementId; secret?: string }
  | { type: "SET_ROOT"; enabled: boolean }
  | { type: "INCREMENT_COMMAND" }
  | { type: "HYDRATE"; persisted: PersistedSession }
  | { type: "RESET_LOCAL" };

interface SystemContextValue {
  state: SessionState;
  dispatch: Dispatch<SystemEvent>;
  navigate: (section: SectionId, projectSlug?: string | null) => void;
}

const initialEntries: TerminalEntry[] = [
  {
    id: 1,
    kind: "system",
    text: "M0AZ_OS portfolio-sh ready. Type `help` or choose a module.",
  },
];

function createInitialState(
  activeSection: SectionId,
  activeProjectSlug: string | null,
): SessionState {
  return {
    activeSection,
    activeProjectSlug,
    terminalDirectory: activeProjectSlug ? `/home/moaz/projects/${activeProjectSlug}` : "/home/moaz",
    terminalEntries: initialEntries,
    commandHistory: [],
    sessionMode: "visitor",
    host: "portfolio",
    theme: "phosphor",
    soundEnabled: false,
    terminalExpanded: false,
    paletteOpen: false,
    bootVisible: false,
    bootComplete: false,
    achievements: [],
    discoveredSecrets: [],
    commandCount: 0,
    startedAt: 0,
  };
}

export function systemReducer(state: SessionState, event: SystemEvent): SessionState {
  switch (event.type) {
    case "NAVIGATE":
      return {
        ...state,
        activeSection: event.section,
        activeProjectSlug: event.projectSlug ?? null,
        paletteOpen: false,
      };
    case "SET_DIRECTORY":
      return {
        ...state,
        terminalDirectory: event.directory,
        host: event.host ?? state.host,
      };
    case "APPEND_ENTRIES":
      return {
        ...state,
        terminalEntries: [...state.terminalEntries, ...event.entries].slice(-160),
      };
    case "CLEAR_TERMINAL":
      return { ...state, terminalEntries: [] };
    case "SET_HISTORY":
      return { ...state, commandHistory: event.history.slice(-50) };
    case "SET_THEME":
      return { ...state, theme: event.theme };
    case "TOGGLE_TERMINAL":
      return { ...state, terminalExpanded: event.expanded ?? !state.terminalExpanded };
    case "TOGGLE_PALETTE":
      return { ...state, paletteOpen: event.open ?? !state.paletteOpen };
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: event.enabled ?? !state.soundEnabled };
    case "SET_BOOT":
      return {
        ...state,
        bootVisible: event.visible,
        bootComplete: event.complete ?? state.bootComplete,
      };
    case "SET_STARTED":
      return { ...state, startedAt: event.startedAt };
    case "UNLOCK":
      return {
        ...state,
        achievements: state.achievements.includes(event.achievement)
          ? state.achievements
          : [...state.achievements, event.achievement],
        discoveredSecrets:
          event.secret && !state.discoveredSecrets.includes(event.secret)
            ? [...state.discoveredSecrets, event.secret]
            : state.discoveredSecrets,
      };
    case "SET_ROOT":
      return { ...state, sessionMode: event.enabled ? "root" : "visitor" };
    case "INCREMENT_COMMAND":
      return { ...state, commandCount: state.commandCount + 1 };
    case "HYDRATE":
      return {
        ...state,
        theme: event.persisted.theme,
        soundEnabled: event.persisted.soundEnabled,
        bootComplete: event.persisted.bootComplete,
        achievements: event.persisted.achievements,
        discoveredSecrets: event.persisted.discoveredSecrets,
        commandHistory: event.persisted.commandHistory,
      };
    case "RESET_LOCAL":
      return {
        ...createInitialState(state.activeSection, state.activeProjectSlug),
        startedAt: state.startedAt,
        bootComplete: true,
      };
    default:
      return state;
  }
}

const SystemContext = createContext<SystemContextValue | null>(null);

export function SystemProvider({
  children,
  initialSection,
  initialProjectSlug = null,
}: {
  children: ReactNode;
  initialSection: SectionId;
  initialProjectSlug?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(
    systemReducer,
    createInitialState(initialSection, initialProjectSlug),
  );

  useEffect(() => {
    dispatch({ type: "SET_STARTED", startedAt: Date.now() });
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const persisted = JSON.parse(saved) as PersistedSession;
        if (persisted.version === 1) {
          dispatch({ type: "HYDRATE", persisted });
        }
      }
    } catch {
      // A disabled or malformed localStorage must never block the portfolio.
    }
  }, []);

  useEffect(() => {
    if (state.startedAt === 0) return;
    const persisted: PersistedSession = {
      version: 1,
      theme: state.theme,
      soundEnabled: state.soundEnabled,
      bootComplete: state.bootComplete,
      achievements: state.achievements,
      discoveredSecrets: state.discoveredSecrets,
      commandHistory: state.commandHistory,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Persistence is an enhancement, never a functional dependency.
    }
  }, [
    state.achievements,
    state.bootComplete,
    state.commandHistory,
    state.discoveredSecrets,
    state.soundEnabled,
    state.startedAt,
    state.theme,
  ]);

  const navigate = useCallback(
    (section: SectionId, projectSlug?: string | null) => {
      const project = section === "project" ? (projectSlug ?? null) : null;
      dispatch({ type: "NAVIGATE", section, projectSlug: project });
      const path = project
        ? `/projects/${project}`
        : navigation.find((item) => item.id === section)?.path ?? `/${section}`;
      if (pathname !== path) router.push(path);
    },
    [pathname, router],
  );

  const value = useMemo(() => ({ state, dispatch, navigate }), [state, navigate]);

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used inside SystemProvider");
  return context;
}

export { STORAGE_KEY };
