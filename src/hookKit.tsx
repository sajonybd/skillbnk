import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, pr, lin, sp } from "./premiumKit";

/** hookKit — story-hook building blocks: a person, a scene stage with slow push-in, beat captions synced to narration. */

export const Person: React.FC<{ f: number; at: number; x: number; y: number; name: string; role: string; c1?: string; c2?: string; s?: number; mood?: "ok" | "stress" | "happy" }> = ({ f, at, x, y, name, role, c1 = "#2E64F0", c2 = "#1D4ED8", s = 1, mood = "ok" }) => {
  const k = Math.min(1, sp(f, at, 30, { damping: 14 }));
  const bob = Math.sin(f / 9) * 3;
  const face = mood === "stress" ? "😣" : mood === "happy" ? "😄" : "🙂";
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: `scale(${s * (0.6 + 0.4 * k)})`, transformOrigin: "50% 100%", opacity: Math.min(1, k * 1.6), fontFamily: FONT, display: "flex", flexDirection: "column", alignItems: "center", width: 220, marginLeft: -110 }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: `linear-gradient(135deg,${c1},${c2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, boxShadow: "0 20px 50px #0008, inset 0 -6px 0 #0003" }}>{face}</div>
      <div style={{ width: 150, height: 90, marginTop: -6, borderRadius: "70px 70px 18px 18px", background: `linear-gradient(180deg,${c2},#0F172A)` }} />
      <div style={{ marginTop: 10, padding: "6px 16px", borderRadius: 999, background: "#fff", fontSize: 22, fontWeight: 900, color: "#111827", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, color: "#CBD5E1", whiteSpace: "nowrap" }}>{role}</div>
    </div>
  );
};

/** whole-hook stage: slow push-in + optional night tint */
export const Stage: React.FC<{ f: number; dur: number; night?: number; children: React.ReactNode }> = ({ f, dur, night = 0, children }) => {
  const z = 1 + 0.06 * lin(f, 0, dur);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
      {children}
      {night > 0 && <AbsoluteFill style={{ background: `rgba(2,6,23,${0.45 * night})`, pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};

/** captions that follow the narration: beats = [startFrame, text, highlightWord?] */
export const BeatCaption: React.FC<{ f: number; beats: [number, string, string?][]; end: number }> = ({ f, beats, end }) => {
  let i = -1;
  beats.forEach((b, k) => { if (f >= b[0] - 2) i = k; });
  if (i < 0) return null;
  const [at, text, hl] = beats[i];
  const next = beats[i + 1]?.[0] ?? end;
  const o = pr(f, at - 2, 8) * (1 - lin(f, next - 6, next));
  const parts = hl ? text.split(hl) : [text];
  return (
    <div style={{ position: "absolute", left: 0, top: 930, width: 1920, display: "flex", justifyContent: "center", fontFamily: FONT, opacity: o, transform: `translateY(${(1 - pr(f, at - 2, 8)) * 16}px)` }}>
      <div style={{ padding: "12px 30px", borderRadius: 16, background: "rgba(2,6,23,0.78)", border: "2px solid rgba(148,163,184,0.35)", fontSize: 38, fontWeight: 900, color: "#F8FAFC", letterSpacing: -0.5 }}>
        {parts[0]}{hl && <span style={{ color: "#FBBF24" }}>{hl}</span>}{parts[1]}
      </div>
    </div>
  );
};

/** a big stamp that slams in */
export const Stamp: React.FC<{ f: number; at: number; x: number; y: number; text: string; color?: string; rot?: number; size?: number }> = ({ f, at, x, y, text, color = "#EF4444", rot = -8, size = 64 }) => {
  if (f < at) return null;
  const k = sp(f, at, 30, { damping: 11, stiffness: 220 });
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * Math.min(1, k)})`, opacity: Math.min(1, k * 2), padding: "8px 26px", border: `6px solid ${color}`, borderRadius: 14, color, fontSize: size, fontWeight: 900, fontFamily: FONT, letterSpacing: 2, background: "rgba(2,6,23,0.55)", whiteSpace: "nowrap" }}>{text}</div>;
};

/** speech/thought bubble */
export const Bubble: React.FC<{ f: number; at: number; x: number; y: number; w?: number; children: React.ReactNode; tone?: "light" | "dark" | "warn"; tail?: "left" | "right" | "none" }> = ({ f, at, x, y, w = 360, children, tone = "light", tail = "left" }) => {
  if (f < at - 1) return null;
  const k = Math.min(1, sp(f, at, 30, { damping: 15, stiffness: 180 }));
  const bg = tone === "dark" ? "#1E293B" : tone === "warn" ? "#FEF3C7" : "#FFFFFF";
  const fg = tone === "dark" ? "#E2E8F0" : "#111827";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${0.5 + 0.5 * k})`, transformOrigin: tail === "right" ? "100% 100%" : "0% 100%", opacity: k, fontFamily: FONT }}>
      <div style={{ padding: "14px 18px", borderRadius: 18, background: bg, color: fg, fontSize: 20, fontWeight: 800, boxShadow: "0 16px 40px #0007", lineHeight: 1.35 }}>{children}</div>
      {tail !== "none" && <div style={{ position: "absolute", [tail === "left" ? "left" : "right"]: 26, bottom: -12, width: 24, height: 24, background: bg, transform: "rotate(45deg)" } as React.CSSProperties} />}
    </div>
  );
};
