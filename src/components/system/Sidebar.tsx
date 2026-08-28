"use client";

import { navigation, secondaryNavigation, siteIdentity } from "@/content/site";
import { useSystem } from "./SystemProvider";

export function Sidebar() {
  const { state, navigate, dispatch } = useSystem();

  return (
    <aside className="sidebar" aria-label="Primary">
      <div>
        <p className="eyebrow">/SYS/NAV</p>
        <nav className="system-nav">
          {navigation.map((item) => {
            const isActive = state.activeSection === item.id || (item.id === "projects" && state.activeSection === "project");
            return (
            <button
              key={item.id}
              className={isActive ? "nav-item active" : "nav-item"}
              onClick={() => navigate(item.id)}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav-index">{item.shortcut}</span>
              <span>{item.label}</span>
              <span className="nav-caret" aria-hidden="true">›</span>
            </button>
          );})}
        </nav>
        <div className="explore-nav"><p className="eyebrow">EXPLORE</p><nav aria-label="Explore">{secondaryNavigation.map((item) => <button type="button" key={item.id} className={state.activeSection === item.id ? "active" : ""} onClick={() => navigate(item.id)}><span>{item.shortcut}</span>{item.label}</button>)}</nav></div>
      </div>

      <div className="sidebar-system" aria-label="Fictional system load">
        <p className="eyebrow">SYSTEM</p>
        <div className="meter-row">
          <span>CORE</span><div className="meter"><i style={{ width: "76%" }} /></div><b>76</b>
        </div>
        <div className="meter-row">
          <span>IDEA</span><div className="meter"><i style={{ width: "61%" }} /></div><b>61</b>
        </div>
        <div className="system-meta">
          <span>HOST</span><strong>{state.host}</strong>
          <span>SHELL</span><strong>portfolio-sh</strong>
          <span>USER</span><strong>{state.sessionMode === "root" ? "root" : siteIdentity.handle}</strong>
        </div>
        <button
          type="button"
          className="shortcut-hint"
          onClick={() => dispatch({ type: "TOGGLE_PALETTE", open: true })}
        >
          <kbd>⌘</kbd><kbd>K</kbd><span>COMMANDS</span>
        </button>
      </div>
    </aside>
  );
}
