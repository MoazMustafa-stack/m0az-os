"use client";

import { useEffect, useRef } from "react";

// Install the player in an effect; invoke it synchronously from a boot gesture only.
export function useBootSound(enabled: boolean) {
  const play = useRef<() => void>(() => {});
  useEffect(() => {
    if (typeof window === "undefined" || !enabled) return;
    const contexts = new Set<AudioContext>();
    const close = (ctx: AudioContext) => {
      if (!contexts.delete(ctx)) return;
      try {
        void ctx.close().catch(() => {});
      } catch {
        // Unsupported or already-closed audio must never interrupt boot.
      }
    };
    const tone = (hum: boolean) => {
      let ctx: AudioContext | undefined;
      try {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        ctx = new Ctx();
        const context = ctx;
        contexts.add(context);
        const osc = context.createOscillator();
        const gain = context.createGain();
        const duration = hum ? 1.2 : 0.08;
        osc.type = hum ? "sawtooth" : "square";
        osc.frequency.setValueAtTime(hum ? 55 : 880, context.currentTime);
        if (hum) osc.frequency.linearRampToValueAtTime(110, context.currentTime + duration);
        gain.gain.setValueAtTime(hum ? 0.04 : 0.02, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.onended = () => close(context);
        osc.start();
        osc.stop(context.currentTime + duration);
        if (context.state === "suspended") void context.resume().catch(() => close(context));
      } catch {
        if (ctx) close(ctx);
      }
    };
    play.current = () => { tone(false); tone(true); };
    return () => {
      play.current = () => {};
      for (const ctx of contexts) close(ctx);
    };
  }, [enabled]);
  return play;
}
