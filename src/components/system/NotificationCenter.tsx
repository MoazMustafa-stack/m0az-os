"use client";

import { useEffect } from "react";
import { useSystem } from "./SystemProvider";

export function NotificationCenter() {
  const { state, dispatch } = useSystem();
  const notification = state.notification;
  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION", id: notification.id }), 3200);
    return () => window.clearTimeout(timer);
  }, [dispatch, notification]);
  if (!notification) return null;
  return (
    <aside className={`system-notification ${notification.kind}`} aria-live="polite">
      <span>[{notification.kind}]</span><p>{notification.text}</p>
      <button type="button" onClick={() => dispatch({ type: "CLEAR_NOTIFICATION", id: notification.id })} aria-label="Dismiss notification">×</button>
    </aside>
  );
}
