import React from "react";
import { FONT } from "./premiumKit";
import { BLUE, INK, GRAY, LINE, Avatar } from "./storyLand";

/** dashKit — small recreated-UI atoms shared by the serial 48 / 52 / 53 videos (card shell, stat tile, pill, row). */
export type Tone = "emerald" | "amber" | "rose" | "slate" | "indigo" | "sky";
const TONES: Record<Tone, [string, string, string]> = {
  emerald: ["#047857", "#D1FAE5", "#10B981"],
  amber: ["#B45309", "#FEF3C7", "#F59E0B"],
  rose: ["#BE123C", "#FFE4E6", "#F43F5E"],
  slate: ["#475569", "#F1F5F9", "#94A3B8"],
  indigo: ["#4338CA", "#E0E7FF", "#6366F1"],
  sky: ["#0369A1", "#E0F2FE", "#0EA5E9"],
};
export const Pill: React.FC<{ tone: Tone; children: React.ReactNode; fs?: number }> = ({ tone, children, fs = 12 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: fs, fontWeight: 800, color: TONES[tone][0], background: TONES[tone][1], whiteSpace: "nowrap", fontFamily: FONT }}>{children}</span>
);
export const toneColor = (t: Tone) => TONES[t][2];

export const Shell: React.FC<{ x: number; y: number; w: number; h: number; on?: boolean; children: React.ReactNode; o?: number; dx?: number; dy?: number; rot?: number; z?: number }> = ({ x, y, w, h, on, children, o = 1, dx = 0, dy = 0, rot = 0, z = 1 }) => (
  <div style={{ position: "absolute", left: x + dx, top: y + dy, width: w, height: h, boxSizing: "border-box", borderRadius: 16, background: "#fff", border: `${on ? 2 : 1}px solid ${on ? BLUE : "#E2E8F0"}`, boxShadow: on ? "0 0 0 5px #C7D2FE, 0 14px 40px #1D3FD622" : "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.05)", padding: 16, overflow: "hidden", opacity: o, transform: `rotate(${rot}deg)`, zIndex: z, fontFamily: FONT }}>{children}</div>
);
export const CardHead: React.FC<{ icon: string; tone?: Tone; title: string; sub: string; right?: React.ReactNode; hl?: boolean }> = ({ icon, tone = "indigo", title, sub, right, hl }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid ${LINE}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: TONES[tone][1], color: TONES[tone][0], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: INK, boxShadow: hl ? "inset 0 -8px 0 #C7D2FE" : "none" }}>{title} <span style={{ fontSize: 12, color: "#9CA3AF" }}>ⓘ</span></div>
        <div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>{sub}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{right}</div>
  </div>
);
export const ViewAll: React.FC<{ press?: boolean }> = ({ press }) => (
  <span style={{ fontSize: 13, fontWeight: 800, color: BLUE, padding: "5px 10px", borderRadius: 8, background: press ? "#E0E7FF" : "transparent" }}>View all ↗</span>
);
export const Stat: React.FC<{ label: string; value: React.ReactNode; tone: Tone; on?: boolean; w?: number }> = ({ label, value, tone, on, w }) => (
  <div style={{ width: w, flex: w ? undefined : 1, boxSizing: "border-box", borderRadius: 12, border: `${on ? 2 : 1}px solid ${on ? toneColor(tone) : "#E5E7EB"}`, background: on ? TONES[tone][1] : "#F8FAFC", padding: "10px 12px", boxShadow: on ? `0 0 0 4px ${toneColor(tone)}33` : "none", transform: `scale(${on ? 1.03 : 1})` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#64748B" }}><span style={{ width: 8, height: 8, borderRadius: 4, background: toneColor(tone) }} />{label}</div>
    <div style={{ marginTop: 4, fontSize: 26, fontWeight: 900, color: INK, letterSpacing: -0.5 }}>{value}</div>
  </div>
);
export const THead: React.FC<{ cols: [string, number][] }> = ({ cols }) => (
  <div style={{ display: "flex", height: 30, alignItems: "center", background: "#F8FAFC", borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#64748B" }}>
    {cols.map(([c, w]) => <div key={c} style={{ width: w, padding: "0 12px", textTransform: "uppercase" }}>{c}</div>)}
  </div>
);
export const PersonCell: React.FC<{ name: string; sub: string; tone?: string }> = ({ name, sub }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
    <Avatar t={name.split(" ").map((s) => s[0]).join("").slice(0, 2)} s={32} c1="#10B981" c2="#06B6D4" />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: INK, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
    </div>
  </div>
);
export const Sw: React.FC<{ on: boolean; hl?: boolean }> = ({ on, hl }) => (
  <span style={{ display: "inline-block", width: 44, height: 24, borderRadius: 12, background: on ? BLUE : "#D1D5DB", position: "relative", boxShadow: hl ? "0 0 0 4px #C7D2FE" : "none", verticalAlign: "middle" }}><span style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: "#fff" }} /></span>
);
export const ArrowUR: React.FC<{ on?: boolean }> = ({ on }) => <span style={{ fontSize: 16, fontWeight: 900, color: on ? BLUE : "#94A3B8", transform: on ? "translate(2px,-2px)" : "none", display: "inline-block" }}>↗</span>;
