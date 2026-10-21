import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { PortalCard, CARD_FRAMES, PortalKind } from "./PortalCard";

// ════════════════════════════════════════════════════════════════════════════
// RealEstateTrainingVideo — "Onboard New Real Estate Agents" (niche video).
// Every screen verified in the skillBNK code (claude/skillbnk-code-facts.md + realestate-video.md):
//   Company portal course → Branches tab (choose offices) → course editor "Generate with AI"
//   → AI Curriculum Generator → Bulk Enrollment (CSV) → Program leaderboard →
//   Generate Certificate (manual: select learner → template). NO auto certificates,
//   renewal reminders or referral tracking (not in the code).
// ALL names and data are FICTIONAL (Harborview Realty Group).
// Voice: bash generate-voice-realestate.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  r0: 220,
  r1: 274,
  r2: 190,
  r3: 120,
  r4: 186,
  r5: 102,
  r6: 131,
  r7: 208,
  r8: 150,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

const PRE = ["r0"] as const; // hook, BEFORE the intro
const POST = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { r0: 260, r1: 330, r2: 360, r3: 420, r4: 420, r5: 250, r6: 200, r7: 430, r8: 190 };
const PACE: Record<Key, number> = { r0: 1, r1: 1.05, r2: 1.05, r3: 1.05, r4: 1.05, r5: 1.05, r6: 1.05, r7: 1.05, r8: 1 };
const LEN = {} as Record<Key, number>;
for (const k of ALL) LEN[k] = Math.max(DURATIONS[k], Math.round(DESIGN[k] * PACE[k]));

// Portal poster (2s, no voice) before each scene where the portal changes.
const CARD_BEFORE: Partial<Record<Key, PortalKind>> = { r1: "company", r2: "provider" };
const STARTS = {} as Record<Key, number>;
let _pos = 0;
for (const k of PRE) { STARTS[k] = _pos; _pos += LEN[k]; }
const INTRO_START = _pos;
_pos += INTRO_FRAMES;
for (const k of POST) { if (CARD_BEFORE[k]) _pos += CARD_FRAMES; STARTS[k] = _pos; _pos += LEN[k]; }
const OUTRO_START = _pos + TAIL;
export const TOTAL_FRAMES = OUTRO_START + OUTRO_FRAMES;

// ─── Brand / UI tokens ───────────────────────────────────────────────────────
const BLUE = "#1D3FD6";
const BLUE_SOFT = "#EEF2FF";
const INK = "#111827";
const GRAY = "#6B7280";
const LINE = "#E5E7EB";
const GREEN = "#16A34A";
const ORANGE = "#F97316";
const RED = "#E11D2E";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";

// ─── Fictional demo data (nothing from real screenshots) ────────────────────
const ACADEMY = "Harborview Realty Group";
const ADMIN = "Karen Wells";
const PROGRAM = "New Agent Launch Program";
const SESSION = "Fall 2026 Cohort";
const LEARNER = "Jessica Moore";
const COURSE = "Listing Presentation Basics";
const COURSE_SLUG = "listing-presentation-basics";
const EMAIL = "jessica.moore@example.com";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EZ = Easing.inOut(Easing.cubic);
const fi = (g: number, a: number, d = 10) => interpolate(g, [a, a + d], [0, 1], cl);
const fo = (g: number, a: number, d = 10) => interpolate(g, [a, a + d], [1, 0], cl);
const sp = (g: number, a: number, fps: number, cfg: object = {}) =>
  spring({ frame: g - a, fps, config: { damping: 16, stiffness: 160, mass: 0.7, ...cfg } });
const rip = (g: number, at: number) => (g >= at && g < at + 16 ? (g - at) / 16 : 0);
const typed = (g: number, a: number, text: string, cpf = 1.4) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor((g - a) * cpf))));
type P3 = [number, number, number];
const path = (g: number, pts: P3[]) => {
  const fr = pts.map((p) => p[0]);
  return {
    x: interpolate(g, fr, pts.map((p) => p[1]), { ...cl, easing: EZ }),
    y: interpolate(g, fr, pts.map((p) => p[2]), { ...cl, easing: EZ }),
  };
};
type CamKey = [number, number, number, number]; // frame, focusX, focusY, scale (window coords)
const cam = (g: number, keys: CamKey[]) => {
  const fr = keys.map((k) => k[0]);
  const o = { ...cl, easing: EZ };
  return {
    x: interpolate(g, fr, keys.map((k) => k[1]), o),
    y: interpolate(g, fr, keys.map((k) => k[2]), o),
    s: interpolate(g, fr, keys.map((k) => k[3]), o),
  };
};
/** design-time: scenes are choreographed on a fixed timeline D and stretched to the real voice length */
const gt = (f: number, dur: number, D: number) => (f * D) / dur;

type SceneProps = { f: number; dur: number; fps: number };

// ─── Window geometry (browser window in "window coords") ────────────────────
const W = 1600;
const H = 900;
const BAR = 44;    // browser bar
const SIDE = 250;  // app sidebar
const HEAD = 60;   // branch/learner app header

// ─── Stage + camera ───────────────────────────────────────────────────────────
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #0B1230 0%, #04060D 100%)", fontFamily: FONT, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff07 1px,transparent 1px),linear-gradient(90deg,#ffffff07 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
    {children}
  </AbsoluteFill>
);

const Camera: React.FC<{ g: number; keys: CamKey[]; children: React.ReactNode }> = ({ g, keys, children }) => {
  const c = cam(g, keys);
  // keep the shot "full": when zoomed past the screen size, never let the window edge show;
  // when smaller than the screen, stay centered (floating-window look)
  const lim = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const x = W * c.s >= 1920 ? lim(c.x, 960 / c.s, W - 960 / c.s) : W / 2 + (c.x - W / 2) * Math.max(0, (c.s - 1) / 0.2) * 0;
  const y = H * c.s >= 1080 ? lim(c.y, 540 / c.s, H - 540 / c.s) : H / 2;
  return (
    <div
      style={{
        position: "absolute", left: 960 - x * c.s, top: 540 - y * c.s, width: W, height: H,
        transform: `scale(${c.s})`, transformOrigin: "0 0",
      }}
    >
      {children}
    </div>
  );
};

/** fixed top-left label: which portal we're in */
const PortalTag: React.FC<{ n: number; label: string; url: string; opacity?: number }> = ({ n, label, url, opacity = 1 }) => (
  <div style={{ position: "absolute", left: 40, top: 22, display: "flex", alignItems: "center", gap: 14, opacity, zIndex: 50, fontFamily: FONT, padding: "8px 22px 8px 8px", borderRadius: 999, background: "rgba(4,6,13,0.82)", border: "1px solid #2E5CF655", boxShadow: "0 8px 30px #0008" }}>
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2E5CF6", color: "#fff", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px #2E5CF688" }}>{n}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9", letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 17, fontWeight: 600, color: "#8A96B2" }}>· {url}</div>
  </div>
);

// ─── Cursor (same big high-contrast pointer as the Menu Builder video) ───────
const Cursor: React.FC<{ x: number; y: number; opacity?: number; ripple?: number; grab?: boolean }> = ({ x, y, opacity = 1, ripple = 0, grab }) => (
  <div style={{ position: "absolute", left: x - 5, top: y - 5, opacity, pointerEvents: "none", zIndex: 90 }}>
    {ripple > 0 && ripple < 1 && (
      <div style={{ position: "absolute", left: 7 - 30 * ripple, top: 7 - 30 * ripple, width: 34 + 61 * ripple, height: 34 + 61 * ripple, borderRadius: "50%", border: `3px solid ${BLUE}`, opacity: 1 - ripple }} />
    )}
    <div style={{ position: "absolute", left: -10, top: -10, width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)" }} />
    <svg width="44" height="44" viewBox="0 0 24 24" fill={BLUE} stroke="#fff" strokeWidth="2.4" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))", transform: grab ? "scale(0.9)" : undefined }}>
      <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
    </svg>
  </div>
);

// ─── Small UI atoms ───────────────────────────────────────────────────────────
const Ico: React.FC<{ c?: string; s?: number }> = ({ c = "#4B5563", s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.6">
    <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" />
  </svg>
);
const Chevron: React.FC<{ c?: string }> = ({ c = "#9CA3AF" }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={c} strokeWidth="1.8"><path d="M4 2l4 4-4 4" /></svg>
);
const Toggle: React.FC<{ on: number; c?: string; w?: number }> = ({ on, c = BLUE, w = 40 }) => (
  <div style={{ width: w, height: w * 0.55, borderRadius: 999, background: on > 0.5 ? c : "#D1D5DB", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 3, left: 3 + on * (w - w * 0.55), width: w * 0.55 - 6, height: w * 0.55 - 6, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px #0003" }} />
  </div>
);
const Btn: React.FC<{ x: number; y: number; w: number; h?: number; label: string; primary?: boolean; soft?: boolean; press?: number; icon?: string; fs?: number }> = ({ x, y, w, h = 40, label, primary, soft, press = 0, icon, fs = 15 }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 8, boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: fs, fontWeight: 700,
      background: primary ? BLUE : soft ? BLUE_SOFT : "#fff", color: primary ? "#fff" : soft ? BLUE : INK,
      border: primary || soft ? "none" : `1px solid ${LINE}`, transform: `scale(${1 - press * 0.06})`,
      boxShadow: primary ? "0 2px 6px #1D3FD640" : "none",
    }}
  >
    {icon && <span>{icon}</span>}
    {label}
  </div>
);
const Toast: React.FC<{ g: number; at: number; text: string; x?: number; y?: number }> = ({ g, at, text, x = 1180, y = 70 }) => {
  const o = fi(g, at, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - o) * -16, opacity: o, zIndex: 80, background: "#fff", border: `1px solid #BBF7D0`, borderLeft: `5px solid ${GREEN}`, borderRadius: 10, padding: "14px 20px", fontSize: 16, fontWeight: 700, color: INK, boxShadow: "0 12px 30px #0002", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✓</span>
      {text}
    </div>
  );
};

/** skillBNK wordmark drawn in code (the PNG logo has white "skill" and vanishes on light UI) */
const MiniLogo: React.FC<{ s?: number; dark?: boolean }> = ({ s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 * s, fontFamily: FONT }}>
    <svg width={22 * s} height={18 * s} viewBox="0 0 22 18">
      <path d="M1 1l7 8-7 8" fill="none" stroke="#9CA3AF" strokeWidth="3" />
      <path d="M8 1l7 8-7 8" fill="none" stroke={dark ? "#fff" : INK} strokeWidth="3" />
      <path d="M14 1l7 8-7 8" fill="none" stroke="#2E5CF6" strokeWidth="3" />
    </svg>
    <span style={{ fontSize: 15 * s, fontWeight: 800, color: dark ? "#fff" : INK, letterSpacing: -0.3 }}>skill<span style={{ color: "#2E5CF6" }}>BNK</span></span>
  </div>
);

// ─── Browser window ───────────────────────────────────────────────────────────
const Browser: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 16, overflow: "hidden", background: "#F6F7F9", boxShadow: "0 40px 120px #000C, 0 0 0 1px #ffffff14", fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: BAR, background: "linear-gradient(180deg,#1E2740,#172036)", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, boxSizing: "border-box" }}>
      {["#FF6B5E", "#FFC15E", "#3ED07F"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
      <div style={{ margin: "0 auto", width: 560, height: 28, borderRadius: 7, background: "#0F1729", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#A9B4CC", fontSize: 14 }}>
        <span style={{ color: "#3ED07F", fontSize: 12 }}>🔒</span>{url}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: BAR, width: W, height: H - BAR }}>{children}</div>
  </div>
);
// NOTE: children of <Browser> use coords relative to the content area (y=0 is just below the bar).
// Cursor/camera positions are in full window coords → content y + BAR.
const Field: React.FC<{ x: number; y: number; w: number; label: string; req?: boolean; value: string; ph?: string; select?: boolean; glow?: number; counter?: string; h?: number }> = ({ x, y, w, label, req, value, ph, select, glow = 0, counter, h = 44 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "#374151" }}>
      <span>{label} {req && <span style={{ color: "#EF4444" }}>*</span>}</span>
      {counter && <span style={{ fontSize: 13, color: GRAY, fontWeight: 500 }}>{counter}</span>}
    </div>
    <div style={{ marginTop: 8, height: h, borderRadius: 8, border: `1px solid ${glow > 0.05 ? "#A5B4FC" : "#D1D5DB"}`, background: glow > 0.05 ? `rgba(238,242,255,${glow})` : "#fff", boxShadow: glow > 0.05 ? `0 0 0 ${3 * glow}px #C7D2FE` : "none", display: "flex", alignItems: h > 50 ? "flex-start" : "center", padding: h > 50 ? "12px 14px" : "0 14px", boxSizing: "border-box", fontSize: 15.5, color: value ? INK : "#9CA3AF", justifyContent: "space-between", lineHeight: 1.5 }}>
      <span>{value || ph}</span>
      {select && <span style={{ color: "#9CA3AF" }}>⌄</span>}
    </div>
  </div>
);

// ─── Shared atoms ────────────────────────────────────────────────────────────
/** Harborview Realty Group logo (fictional brand, drawn in code) */
const KeyLogo: React.FC<{ sub?: string; s?: number; dark?: boolean }> = ({ sub = "Realty Group", s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#0F766E" />
      <path d="M8 30V17l11-9 11 9v13z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M13 30c3-5 9-5 12 0" fill="none" stroke="#5EEAD4" strokeWidth="2.6" />
    </svg>
    <div>
      <div style={{ fontSize: 15 * s, fontWeight: 900, color: dark ? "#fff" : "#0F766E", letterSpacing: 0.8 }}>HARBORVIEW</div>
      <div style={{ fontSize: 10.5 * s, fontWeight: 600, color: dark ? "#CBD5E1" : GRAY, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);
const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 38, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.37, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
const JORDAN_AV = { t: "JM", c1: "#14B8A6", c2: "#0F766E" };
const RACHEL_AV = { t: "KW", c1: "#2E64F0", c2: "#1D4ED8" };
const Badge: React.FC<{ t: string; c: string; bg: string; dot?: boolean; fs?: number }> = ({ t, c, bg, dot, fs = 13 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: fs, fontWeight: 700, color: c, background: bg, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
    {dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />}{t}
  </span>
);
const PageTitle: React.FC<{ t: string; sub: string; back?: boolean; x?: number; y?: number }> = ({ t, sub, back, x = 30, y = 14 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14 }}>
    {back && <span style={{ fontSize: 24, color: BLUE, fontWeight: 700 }}>←</span>}
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: INK }}>{t} <span style={{ fontSize: 16, color: GRAY }}>ⓘ</span></div>
      <div style={{ fontSize: 15, color: GRAY, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);
const Input: React.FC<{ x: number; y: number; w: number; h?: number; label?: string; value?: string; ph?: string; select?: boolean; glow?: number; req?: boolean; fs?: number }> = ({ x, y, w, h = 44, label, value = "", ph = "", select, glow = 0, req, fs = 15.5 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    {label && <div style={{ fontSize: 14.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{label} {req && <span style={{ color: "#EF4444" }}>*</span>}</div>}
    <div style={{ height: h, borderRadius: 8, border: `1px solid ${glow > 0.05 ? "#A5B4FC" : "#D1D5DB"}`, background: glow > 0.05 ? "#F5F7FF" : "#fff", boxShadow: glow > 0.05 ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: h > 50 ? "flex-start" : "center", padding: h > 50 ? "10px 14px" : "0 14px", boxSizing: "border-box", fontSize: fs, color: value ? INK : "#9CA3AF", justifyContent: "space-between", lineHeight: 1.45 }}>
      <span>{value || ph}</span>{select && <span style={{ color: "#9CA3AF" }}>⌄</span>}
    </div>
  </div>
);
const IconBtn: React.FC<{ t: string; bg?: string; c?: string; s?: number }> = ({ t, bg = BLUE_SOFT, c = BLUE, s = 34 }) => (
  <div style={{ width: s, height: s, borderRadius: 8, background: bg, color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{t}</div>
);

// ─── Camera helpers (content coords) ─────────────────────────────────────────
const CamC: React.FC<{ g: number; keys: CamKey[]; children: React.ReactNode }> = ({ g, keys, children }) => (
  <Camera g={g} keys={keys.map((k) => [k[0], k[1], k[2] + BAR, k[3]] as CamKey)}>{children}</Camera>
);
const WIDE_X = 800;
const WIDE_Y = 428;
const MX = (x: number) => SIDE + x;
const MY = (y: number) => HEAD + y;

// ─── Company portal shell ────────────────────────────────────────────────────
const CO_MENU = ["Dashboard", "Courses & Programs", "Website Builder", "Menu Builder", "Form Builder", "Enrollment Form Builder", "Integrations", "Promotions", "Staff Management", "Institute Settings"];
const CompanyShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><KeyLogo sub="Company portal" /></div>
      <div style={{ marginTop: 12 }}>
        {CO_MENU.map((m) => {
          const on = m === "Enrollment Form Builder";
          return (
            <div key={m} style={{ height: 38, display: "flex", alignItems: "center", gap: 9, padding: "0 8px", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 14, fontWeight: on ? 700 : 500 }}>
              <Ico c={on ? BLUE : "#4B5563"} s={14} /><span style={{ whiteSpace: "nowrap" }}>{m}</span>
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} />
      <div style={{ width: 360, height: 38, borderRadius: 999, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 16px", color: "#9CA3AF", fontSize: 14 }}>⌕ &nbsp;Search menu name...</div>
      <div style={{ flex: 1 }} />
      <div style={{ height: 38, padding: "0 14px", borderRadius: 9, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: INK }}>🏢 {ACADEMY}</div>
      <Avatar t={RACHEL_AV.t} c1={RACHEL_AV.c1} c2={RACHEL_AV.c2} />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);

// ─── Training-provider portal shell (bell can ring + open) ───────────────────
const PV_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Leaderboard" }, { t: "Students Management", more: true }, { t: "Courses & Programs", more: true },
  { t: "Marketing Tools", open: true }, { t: "Email Marketing", child: true }, { t: "SMS Marketing", child: true },
  { t: "Billing & Certificate", open: true }, { t: "Generate Certificate", child: true }, { t: "All Certificates", child: true },
  { t: "Attendance", more: true }, { t: "Communication", more: true }, { t: "Institute Settings" },
];
const PV_ITEM_Y = (i: number) => 106 + i * 36;
const BELL = { x: 1512, y: 30 };
const ProviderShell: React.FC<{ active?: string; bell?: number; ring?: number; children: React.ReactNode }> = ({ active = "Dashboard", bell = 2, ring = 0, children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ padding: "2px 6px 10px" }}><KeyLogo /></div>
      <div style={{ height: 34, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 14, color: "#9CA3AF" }}>⌕ Search menu...</div>
      {PV_MENU.map((m, i) => {
        const on = m.t === active;
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: PV_ITEM_Y(i), width: SIDE - 24, height: 34, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 6, paddingRight: 6, boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            {!m.child && <Ico c={on ? BLUE : "#4B5563"} s={14} />}
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
            {m.more && <Chevron />}
            {m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}` }}>
      <div style={{ position: "absolute", left: 18, top: 21 }}><Ico s={18} /></div>
      <div style={{ position: "absolute", left: 52, top: 11, height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK, fontWeight: 700 }}>🏢 {ACADEMY} · Austin</div>
      <div style={{ position: "absolute", left: 870, top: 11, height: 38, padding: "0 16px", borderRadius: 9, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>View Attendance</div>
      <div style={{ position: "absolute", left: 1194, top: 12, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>💬</div>
      <div style={{ position: "absolute", left: BELL.x - SIDE - 18, top: 12, width: 36, height: 36, borderRadius: "50%", border: `1px solid ${ring > 0 ? "#FCA5A5" : LINE}`, background: ring > 0 ? "#FEF2F2" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, transform: `rotate(${Math.sin(ring * 30) * 18 * ring}deg)` }}>
        🔔<span style={{ position: "absolute", top: -5, right: -6, background: "#EF4444", color: "#fff", fontSize: 10.5, fontWeight: 800, borderRadius: 999, padding: "1px 6px" }}>{bell}</span>
      </div>
      <div style={{ position: "absolute", left: W - SIDE - 56, top: 11 }}><Avatar t={RACHEL_AV.t} c1={RACHEL_AV.c1} c2={RACHEL_AV.c2} /></div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);

// ─── Learner portal shell ────────────────────────────────────────────────────
const LR_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "My Courses", open: true }, { t: "Program", child: true }, { t: "My Enrollments", child: true },
  { t: "Documents", more: true }, { t: "Calendar", more: true }, { t: "Interviews", more: true }, { t: "Chat" }, { t: "Community" }, { t: "My Notes" },
];
const LearnerShell: React.FC<{ active?: string; children: React.ReactNode }> = ({ active = "My Enrollments", children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ padding: "2px 6px 14px" }}><KeyLogo sub="Learning Portal" /></div>
      {LR_MENU.map((m, i) => {
        const on = m.t === active;
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: 70 + i * 40, width: SIDE - 24, height: 38, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 8, paddingRight: 8, boxSizing: "border-box", borderRadius: 7, background: on ? "#F1F2F4" : "transparent", color: "#1F2937", fontSize: 14.5, fontWeight: on ? 700 : 500 }}>
            {!m.child && <Ico c="#4B5563" s={14} />}
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
            {m.more && <Chevron />}
            {m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} />
      <div style={{ width: 380, height: 38, borderRadius: 999, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 16px", color: "#9CA3AF", fontSize: 14 }}>⌕ &nbsp;Search menu name...</div>
      <div style={{ flex: 1 }} />
      <div style={{ height: 38, borderRadius: 999, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, fontSize: 14, fontWeight: 600, color: INK }}>🎓 {PROGRAM} <span style={{ color: "#9CA3AF" }}>⌄</span></div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <Avatar t={JORDAN_AV.t} c1={JORDAN_AV.c1} c2={JORDAN_AV.c2} />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);

const Dim: React.FC<{ o: number }> = ({ o }) => (o > 0.01 ? <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * o})`, zIndex: 40 }} /> : null);

// ─── Fictional team (48 learners) ────────────────────────────────────────────
const FIRST = ["Olivia", "Marcus", "Priya", "Daniel", "Grace", "Ethan", "Sofia", "Ryan", "Chloe", "Owen", "Isla", "Lucas", "Hannah", "Leo", "Ava", "Caleb", "Ruby", "Jack", "Mila", "Henry", "Zara", "Eli", "Nora", "Sam"];
const LAST = ["Bennett", "Cole", "Nair", "Reyes", "Park", "Walsh", "Rossi", "Hayes", "Grant", "Foster", "Lin", "Morgan", "Brooks", "Diaz", "Ward", "Price", "Ellis", "Kim", "Ortiz", "Reed", "Khan", "Moore", "Lane", "Fox"];
const BEHIND = [48, 45, 41, 38, 31, 29, 27, 24, 22, 19, 16, 14];
const AFTER = [86, 100, 92, 78, 100, 88, 74, 81, 69, 90, 62, 71];
const TEAM = Array.from({ length: 48 }).map((_, i) => {
  const name = i === 0 ? LEARNER : `${FIRST[i % 24]} ${LAST[(i * 7 + 3 + Math.floor(i / 24) * 5) % 24]}`;
  const comp = i < 36 ? Math.round(98 - i * (37 / 35)) : BEHIND[i - 36];
  const after = i < 36 ? Math.min(100, comp + 2) : AFTER[i - 36];
  const hue = (i * 47) % 360;
  return { name, email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`, comp, after, behind: i >= 36, av: { t: name.split(" ").map((w) => w[0]).join(""), c1: `hsl(${hue} 70% 55%)`, c2: `hsl(${hue} 70% 40%)` } };
});
const NINA = TEAM[0];

// ─── Program leaderboard (real UI: SB-Branch dashboard/leaderboard/LeaderBoardPage.tsx)
// Columns: Rank · Learner · Completion · Points · Performance · Action (View progress)
// Performance badge (from code): ≥80 "Outstanding", ≥60 "Good", else "Needs attention".
const LB_ROW = 56;
const LB_TOP = 164; // main-area y where the scrolling results start
const LB_VIEW = 796 - LB_TOP; // visible height
const CARD1_H = 70 + 40 + 10 * LB_ROW;
const CARD2_Y = CARD1_H + 16;
const LB_TOTAL = CARD2_Y + 70 + 40 + 38 * LB_ROW + 10;
const LB_MAX = LB_TOTAL - LB_VIEW;
const Perf: React.FC<{ p: number }> = ({ p }) =>
  p >= 80 ? <Badge t="✦ Outstanding" c="#047857" bg="#ECFDF5" fs={12} /> : p >= 60 ? <Badge t="🏅 Good" c="#C2410C" bg="#FFF7ED" fs={12} /> : <Badge t="⚠ Needs attention" c="#B91C1C" bg="#FEF2F2" fs={12} />;
const LbColumns: React.FC<{ y: number }> = ({ y }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: 1310, height: 40, background: "#F9FAFB", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
    {[["Rank", 24], ["Learner", 100], ["Completion", 520], ["Points", 800], ["Performance", 930], ["Action", 1190]].map(([t, x]) => (
      <div key={t as string} style={{ position: "absolute", left: x as number, top: 11, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{t as string}</div>
    ))}
  </div>
);
const LbRow: React.FC<{ r: (typeof TEAM)[number]; rank: number; y: number; mix: number }> = ({ r, rank, y, mix }) => {
  const c = Math.round(r.comp + (r.after - r.comp) * mix);
  const pts = Math.round(c * 12);
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1310, height: LB_ROW, borderBottom: `1px solid ${LINE}`, background: rank <= 3 ? "#FFFDFA" : "#fff" }}>
      <div style={{ position: "absolute", left: 22, top: 13, width: 32, height: 30, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, background: rank <= 3 ? ["#FEF3C7", "#EEF2FF", "#ECFEFF"][rank - 1] : "transparent", color: rank <= 3 ? ["#B45309", "#4338CA", "#0E7490"][rank - 1] : INK }}>{rank}</div>
      <div style={{ position: "absolute", left: 100, top: 9, display: "flex", gap: 10, alignItems: "center" }}>
        <Avatar t={r.av.t} s={36} c1={r.av.c1} c2={r.av.c2} />
        <div><div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{r.name}</div><div style={{ fontSize: 12.5, color: GRAY }}>{c}% · {pts.toLocaleString()} pts</div></div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 21, width: 200, height: 8, borderRadius: 4, background: "#E5E7EB" }}><div style={{ width: `${c}%`, height: 8, borderRadius: 4, background: BLUE }} /></div>
      <div style={{ position: "absolute", left: 732, top: 16, fontSize: 14, fontWeight: 700, color: INK }}>{c}%</div>
      <div style={{ position: "absolute", left: 800, top: 16, fontSize: 15, fontWeight: 700, color: INK }}>{pts.toLocaleString()}</div>
      <div style={{ position: "absolute", left: 930, top: 14 }}><Perf p={c} /></div>
      <div style={{ position: "absolute", left: 1180, top: 11, height: 34, padding: "0 12px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 700, color: INK, display: "flex", alignItems: "center" }}>View progress</div>
    </div>
  );
};
const LeaderboardPage: React.FC<{ scroll: number; mix?: number; filled?: number; pressView?: boolean; updated?: string }> = ({ scroll, mix = 0, filled = 1, pressView, updated = "Oct 1, 2026 · 8:01 AM" }) => (
  <>
    <PageTitle t="Program leaderboard" sub="Compare learner progress for a selected program and session." />
    <div style={{ position: "absolute", left: 20, top: 84, width: 1310, height: 64, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
    <Input x={40} y={94} w={520} value={filled > 0.5 ? PROGRAM : ""} ph="Select program" select />
    <Input x={580} y={94} w={420} value={filled > 0.5 ? SESSION : ""} ph="Select session" select />
    <Btn x={1020} y={94} w={140} h={44} label="View results" primary fs={14.5} press={pressView ? 1 : 0} />
    <Btn x={1170} y={94} w={150} h={44} label="⟳ Recalculate all" fs={14} />
    <div style={{ position: "absolute", left: 0, top: LB_TOP, width: W - SIDE, height: LB_VIEW, overflow: "hidden", opacity: filled }}>
      <div style={{ position: "absolute", left: 20, top: -scroll, width: 1310 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1310, height: CARD1_H, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 20, top: 14, fontSize: 18, fontWeight: 800, color: INK }}>🏆 Top 10 learners</div>
          <div style={{ position: "absolute", left: 20, top: 42, fontSize: 13.5, color: GRAY }}>{PROGRAM} · {SESSION} · 10 of {TEAM.length} learners</div>
          <div style={{ position: "absolute", right: 20, top: 18, fontSize: 13.5, color: GRAY }}>Updated {updated}</div>
          <LbColumns y={70} />
          {TEAM.slice(0, 10).map((r, i) => <LbRow key={i} r={r} rank={i + 1} y={110 + i * LB_ROW} mix={mix} />)}
        </div>
        <div style={{ position: "absolute", left: 0, top: CARD2_Y, width: 1310, height: 70 + 40 + 38 * LB_ROW, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 20, top: 14, fontSize: 18, fontWeight: 800, color: INK }}>Other learners</div>
          <div style={{ position: "absolute", left: 20, top: 42, fontSize: 13.5, color: GRAY }}>38 ranked below the top 10</div>
          <LbColumns y={70} />
          {TEAM.slice(10).map((r, i) => {
            const y = 110 + i * LB_ROW;
            if (CARD2_Y + y - scroll < -LB_ROW || CARD2_Y + y - scroll > LB_VIEW + LB_ROW) return null;
            return <LbRow key={i} r={r} rank={i + 11} y={y} mix={mix} />;
          })}
        </div>
      </div>
    </div>
  </>
);
/** video caption (not product UI): points at what the viewer should notice */
const Callout: React.FC<{ o: number; text: string; x: number; y: number; c?: string }> = ({ o, text, x, y, c = "#F97316" }) =>
  o > 0.01 ? (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 12}px)`, zIndex: 60, padding: "14px 22px", borderRadius: 14, background: "rgba(4,6,13,0.9)", border: `2px solid ${c}`, color: "#F1F5F9", fontSize: 30, fontWeight: 800, fontFamily: FONT, boxShadow: `0 0 40px ${c}55` }}>{text}</div>
  ) : null;


// ─── Offices + Bulk Enrollment demo rows (fictional) ─────────────────────────
const OFFICES_TAG = 1;
const OFFICES = [
  { n: "Harborview – Austin", slug: "harborview-austin", loc: "Austin, TX", ph: "(512) 555-0142", mgr: "Daniel Brooks" },
  { n: "Harborview – San Antonio", slug: "harborview-san-antonio", loc: "San Antonio, TX", ph: "(210) 555-0178", mgr: "Laura Bennett" },
  { n: "Harborview – Houston", slug: "harborview-houston", loc: "Houston, TX", ph: "(713) 555-0119", mgr: "Marcus Lee" },
];
const CSV_NAME = "fall_2026_new_agents.csv";
const BULK_TAG = 2;
const BULK_EXTRA = 9;
const BULK_ROWS = [
  { name: "Jessica Moore", email: "jessica.moore@example.com", already: false },
  { name: "Priya Shah", email: "priya.shah@example.com", already: false },
  { name: "Tom Alvarez", email: "tom.alvarez@example.com", already: false },
  { name: "Hannah Cole", email: "hannah.cole@example.com", already: false },
  { name: "Diego Ramos", email: "diego.ramos@example.com", already: true },
  { name: "Tessa Nguyen", email: "tessa.nguyen@example.com", already: false },
];
const TypeChip: React.FC<{ t: string }> = ({ t }) => {
  const m: Record<string, [string, string]> = { Slide: ["#7C3AED", "#F3E8FF"], Video: ["#DC2626", "#FEE2E2"], Quiz: ["#0369A1", "#E0F2FE"], Assignment: ["#B45309", "#FEF3C7"], Document: ["#047857", "#D1FAE5"] };
  return <span style={{ fontSize: 11.5, fontWeight: 800, padding: "3px 9px", borderRadius: 6, color: m[t][0], background: m[t][1] }}>{t}</span>;
};
const Stepper: React.FC<{ step: number }> = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {["Sources & Settings", "Review Structure", "Generate & Link"].map((s, i) => (
      <React.Fragment key={s}>
        <span style={{ width: 24, height: 24, borderRadius: "50%", background: step > i ? BLUE : "#E5E7EB", color: step > i ? "#fff" : GRAY, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{step > i + 1 ? "✓" : i + 1}</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: step > i ? INK : GRAY }}>{s}</span>
        {i < 2 && <span style={{ width: 40, height: 2, background: step > i + 1 ? BLUE : "#E5E7EB" }} />}
      </React.Fragment>
    ))}
  </div>
);
const CURRICULUM: { ch: string; ls: [string, string][] }[] = [
  { ch: "Our listing process", ls: [["Slide", "From first call to signed listing"], ["Video", "Walkthrough: a listing appointment"], ["Quiz", "Put the steps in order"]] },
  { ch: "Pricing and the market report", ls: [["Slide", "Building a pricing plan"], ["Document", "Market report template"], ["Assignment", "Price a sample home"]] },
  { ch: "Presenting to the seller", ls: [["Quiz", "Answer common seller questions"], ["Assignment", "Record your listing pitch"]] },
];
const PROMPT = "Onboarding for new agents at our brokerage: our listing process, building a pricing plan with a market report, and presenting to sellers. Include quizzes and practice.";

// ═══ l1 — Edit Course → Generate with AI → Sources & Settings → generating ══
const GenForm: React.FC<{ g: number; typedPrompt: string; diff: string; aud: string; tone: string; pressGen: boolean; progress: number }> = ({ g, typedPrompt, diff, aud, tone, pressGen, progress }) => (
  <>
    <div style={{ position: "absolute", left: 20, top: 14, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>✨ AI Curriculum Generator</div>
      <span style={{ fontSize: 14, color: GRAY }}>{COURSE} · Module</span>
    </div>
    <div style={{ position: "absolute", left: 20, top: 54 }}><Stepper step={1} /></div>
    <div style={{ position: "absolute", left: 20, top: 96, width: 640, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
    <div style={{ position: "absolute", left: 40, top: 112, fontSize: 16, fontWeight: 800, color: INK }}>Describe your course</div>
    <div style={{ position: "absolute", left: 40, top: 136, width: 600, fontSize: 12.5, color: GRAY }}>The more detail you provide, the better the result.</div>
    <div style={{ position: "absolute", left: 40, top: 160, width: 600, height: 120, borderRadius: 8, border: `1px solid ${typedPrompt && g < 160 ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: typedPrompt && g < 160 ? "0 0 0 3px #C7D2FE" : "none", padding: "10px 12px", boxSizing: "border-box", fontSize: 14.5, color: typedPrompt ? INK : "#9CA3AF", lineHeight: 1.5 }}>{typedPrompt || "Describe the course content, objectives, target audience, difficulty level, and any specific topics you want to include..."}</div>
    <div style={{ position: "absolute", left: 40, top: 294, display: "flex", gap: 10 }}>
      {["📄 Add PDF", "🖼 Add images"].map((t) => <div key={t} style={{ width: 295, height: 50, borderRadius: 9, border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#374151" }}>{t}</div>)}
    </div>
    <div style={{ position: "absolute", left: 40, top: 362, fontSize: 16, fontWeight: 800, color: INK }}>Generation Options</div>
    <div style={{ position: "absolute", left: 40, top: 392, display: "flex", gap: 8 }}>
      {["Balanced", "Video Led", "Hands On", "Assessment Heavy"].map((t, i) => <span key={t} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: i === 0 ? BLUE : "#F3F4F6", color: i === 0 ? "#fff" : "#374151" }}>{t}</span>)}
    </div>
    <div style={{ position: "absolute", left: 40, top: 436, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>Course structure</div>
    <div style={{ position: "absolute", left: 180, top: 430, display: "flex", gap: 4, padding: 3, borderRadius: 8, background: "#F3F4F6" }}>
      <span style={{ padding: "4px 12px", borderRadius: 6, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700 }}>AI decides</span><span style={{ padding: "4px 12px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Custom</span>
    </div>
    <Input x={40} y={472} w={290} label="Difficulty Level" value={diff} select />
    <Input x={350} y={472} w={290} label="Target audience" value={aud} select />
    <Input x={40} y={556} w={190} label="Language" value="English" select />
    <Input x={245} y={556} w={190} label="Tone" value={tone} select />
    <Input x={450} y={556} w={190} label="Depth" value="Practical" select />
    <div style={{ position: "absolute", left: 40, top: 642, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>Lesson types</div>
    <div style={{ position: "absolute", left: 40, top: 666, display: "flex", gap: 8 }}>
      {["Video", "Quiz", "Assignment", "Slide", "Document"].map((t) => <span key={t} style={{ padding: "5px 11px", borderRadius: 7, fontSize: 13, fontWeight: 700, background: BLUE_SOFT, color: BLUE }}>☑ {t}</span>)}
    </div>
    <Btn x={40} y={716} w={600} h={48} label="✨ Generate with AI" primary fs={16} press={pressGen ? 1 : 0} />
    <div style={{ position: "absolute", left: 680, top: 96, width: 650, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      {progress > 0 ? (
        <>
          <div style={{ fontSize: 40 }}>✨</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Generating curriculum...</div>
          <div style={{ width: 420, height: 10, borderRadius: 5, background: "#E5E7EB" }}><div style={{ width: `${progress}%`, height: 10, borderRadius: 5, background: "linear-gradient(90deg,#7C3AED,#2563EB)" }} /></div>
          <div style={{ fontSize: 14, color: GRAY }}>{Math.round(progress)}%</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 40 }}>📚</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>No Saved Curriculum</div>
          <div style={{ fontSize: 14.5, color: GRAY, textAlign: "center", width: 420 }}>Generate curriculum using the form on the left, then save it to your library for <b>Module</b>.</div>
        </>
      )}
    </div>
  </>
);
const SceneGenerate: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const onGen = g >= 40;
  const GENAI = { x: MX(1215), y: MY(140) };
  const TXT = { x: MX(340), y: MY(220) };
  const DIFF = { x: MX(185), y: MY(524) };
  const AUD = { x: MX(495), y: MY(524) };
  const TONE = { x: MX(340), y: MY(608) };
  const GEN = { x: MX(340), y: MY(740) };
  const cur = path(g, [[0, 900, 600], [24, GENAI.x, GENAI.y], [34, GENAI.x, GENAI.y], [56, TXT.x, TXT.y], [160, TXT.x, TXT.y], [176, DIFF.x, DIFF.y], [186, DIFF.x, DIFF.y], [200, AUD.x, AUD.y], [210, AUD.x, AUD.y], [224, TONE.x, TONE.y], [236, TONE.x, TONE.y], [256, GEN.x, GEN.y], [270, GEN.x, GEN.y], [360, 1100, 500]]);
  const ripple = Math.max(rip(g, 30), rip(g, 60), rip(g, 180), rip(g, 204), rip(g, 230), rip(g, 262));
  const progress = interpolate(g, [266, 350], [0, 100], cl);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [16, 1300, 200, 1.5], [36, 1300, 200, 1.5], [52, 600, 300, 1.45], [160, 600, 300, 1.45], [176, 600, 600, 1.4], [270, 600, 600, 1.4], [292, WIDE_X, WIDE_Y, 1.05], [360, WIDE_X, WIDE_Y, 1.05]];
  return (
    <Stage>
      <PortalTag n={2} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onGen ? "branch.skillbnk.com/subprogram?step=sources" : "branch.skillbnk.com/courses/edit/subprogram-listing-presentation-basics"}>
          <ProviderShell active="Courses" bell={2}>
            {!onGen ? (
              <>
                <PageTitle t={`Edit Course · ${COURSE}`} sub="Modify course settings and preferences" />
                <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 100, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
                  <div style={{ position: "absolute", left: 14, top: 12, width: 134, height: 76, borderRadius: 8, background: "linear-gradient(135deg,#0F766E,#14B8A6)", color: "#fff", fontSize: 12, fontWeight: 900, padding: 10, boxSizing: "border-box" }}>{COURSE}</div>
                  <div style={{ position: "absolute", left: 164, top: 22, fontSize: 19, fontWeight: 700, color: INK }}>{COURSE}</div>
                  <div style={{ position: "absolute", left: 164, top: 54, fontSize: 14, color: GRAY }}>{PROGRAM} · 0 lessons</div>
                  <Btn x={950} y={30} w={140} h={40} label="+ Add new tab" primary fs={14} />
                  <Btn x={1100} y={30} w={190} h={40} label="✨ Generate with AI" fs={14} press={g >= 30 && g < 36 ? 1 : 0} />
                </div>
                <div style={{ position: "absolute", left: 20, top: 206, height: 70, display: "flex", gap: 6, padding: 6, borderRadius: 12, border: `1px solid ${LINE}`, background: "#fff" }}>
                  {["Module", "Workshop", "Interview", "Lab"].map((t, i) => <div key={t} style={{ width: 210, padding: "8px 14px", borderRadius: 9, background: i === 0 ? BLUE_SOFT : "transparent", fontSize: 17, fontWeight: 700, color: i === 0 ? BLUE : INK }}>{t}<div style={{ fontSize: 12.5, fontWeight: 500, color: GRAY }}>0 chapters · 0 lessons</div></div>)}
                </div>
                <div style={{ position: "absolute", left: 20, top: 292, width: 1310, height: 490, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 16 }}>No chapters yet</div>
              </>
            ) : (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 40, 10) }}>
                <GenForm g={g} typedPrompt={typed(g, 62, PROMPT, 1.6)} diff={g >= 186 ? "Beginner" : "Intermediate"} aud={g >= 210 ? "Working professionals" : "General learners"} tone={g >= 236 ? "Friendly" : "Professional"} pressGen={g >= 262 && g < 268} progress={progress} />
              </div>
            )}
          </ProviderShell>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ l2 — Review Structure → Save to Library → Generate & Link → Add to course
const LessonRow: React.FC<{ t: string; n: string; status?: string; o?: number }> = ({ t, n, status, o = 1 }) => (
  <div style={{ height: 42, display: "flex", alignItems: "center", gap: 10, padding: "0 14px 0 36px", borderTop: `1px solid ${LINE}`, opacity: o }}>
    <span style={{ color: "#CBD5E1" }}>⋮⋮</span><TypeChip t={t} /><span style={{ fontSize: 14.5, color: INK, fontWeight: 600, flex: 1 }}>{n}</span>
    {status && <Badge t={status} c={status === "COMPLETED" ? GREEN : status === "MANUAL VIDEO" ? GRAY : BLUE} bg={status === "COMPLETED" ? "#DCFCE7" : status === "MANUAL VIDEO" ? "#F3F4F6" : "#DBEAFE"} fs={11.5} dot />}
  </div>
);
const SceneReview: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const saved = g >= 130;
  const genStart = 200;
  const gp = interpolate(g, [genStart, 320], [0, 1], cl);
  const total = 7;
  const done = Math.round(gp * total);
  const SAVE = { x: MX(1240), y: MY(124) };
  const GENR = { x: MX(1190), y: MY(124) };
  const ADDC = { x: MX(1240), y: MY(124) };
  const cur = path(g, [[0, 1100, 500], [60, 900, 420], [110, SAVE.x, SAVE.y], [128, SAVE.x, SAVE.y], [180, GENR.x, GENR.y], [198, GENR.x, GENR.y], [320, 1000, 400], [340, ADDC.x, ADDC.y], [356, ADDC.x, ADDC.y], [420, ADDC.x, ADDC.y]]);
  const ripple = Math.max(rip(g, 124), rip(g, 196), rip(g, 352));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1.05], [20, 1000, 420, 1.3], [100, 1000, 420, 1.3], [116, 1350, 160, 1.5], [134, 1350, 160, 1.5], [150, 1000, 420, 1.25], [176, 1300, 160, 1.5], [200, 1300, 160, 1.5], [216, 1000, 450, 1.25], [326, 1000, 450, 1.25], [342, 1350, 160, 1.5], [380, 1350, 160, 1.5], [420, WIDE_X, WIDE_Y, 1.05]];
  let idx = 0;
  return (
    <Stage>
      <PortalTag n={2} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url={saved ? "branch.skillbnk.com/subprogram?step=generate" : "branch.skillbnk.com/subprogram?step=review"}>
          <ProviderShell active="Courses" bell={2}>
            <div style={{ position: "absolute", left: 20, top: 14, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>✨ AI Curriculum Generator</div>
              <span style={{ fontSize: 14, color: GRAY }}>{COURSE} · Module</span>
            </div>
            <div style={{ position: "absolute", left: 20, top: 54 }}><Stepper step={saved ? 3 : 2} /></div>
            <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 22, top: 16, fontSize: 19, fontWeight: 800, color: INK }}>{saved ? "Saved Curriculum - Module" : "Fresh Generated Curriculum"}</div>
              <div style={{ position: "absolute", left: 22, top: 44, fontSize: 13.5, color: GRAY }}>{saved ? `${done} of ${total} lesson assets generated · videos stay manual` : "Review and save your newly generated curriculum"}</div>
              {!saved && <Btn x={1100} y={14} w={180} h={42} label="Save to Library" primary fs={14.5} press={g >= 124 && g < 130 ? 1 : 0} />}
              {saved && g < 330 && <Btn x={1050} y={14} w={230} h={42} label={g >= genStart ? (gp < 1 ? "Queueing assets..." : "Generate remaining (0)") : `✨ Generate remaining (${total})`} soft fs={14} press={g >= 196 && g < 202 ? 1 : 0} />}
              {saved && g >= 330 && <Btn x={1100} y={14} w={180} h={42} label={g >= 360 ? "Saving course..." : "Add to course"} primary fs={14.5} press={g >= 352 && g < 358 ? 1 : 0} />}
              {saved && g >= genStart && (
                <div style={{ position: "absolute", left: 22, top: 70, width: 1266, height: 50, borderRadius: 10, border: "1px solid #BFDBFE", background: "#EFF6FF", display: "flex", alignItems: "center", gap: 14, padding: "0 16px", boxSizing: "border-box" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: INK }}>Batch progress</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#DBEAFE" }}><div style={{ width: `${gp * 100}%`, height: 8, borderRadius: 4, background: BLUE }} /></div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>{Math.round(gp * 100)}%</span>
                </div>
              )}
              <div style={{ position: "absolute", left: 22, top: saved && g >= genStart ? 132 : 76, width: 1266 }}>
                {CURRICULUM.map((c, ci) => (
                  <div key={c.ch} style={{ marginBottom: 12, borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden", opacity: fi(g, ci * 12, 10), transform: `translateY(${(1 - fi(g, ci * 12, 10)) * 16}px)` }}>
                    <div style={{ height: 44, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", background: "#F9FAFB", fontSize: 15.5, fontWeight: 800, color: INK }}><span style={{ color: "#F59E0B" }}>▾</span>Chapter {ci + 1}: {c.ch}<span style={{ marginLeft: "auto", fontSize: 12.5, color: GRAY, fontWeight: 600 }}>{c.ls.length} lessons</span></div>
                    {c.ls.map(([t, n]) => {
                      const k = t === "Video" ? -1 : idx++;
                      const st = !saved || g < genStart ? undefined : t === "Video" ? "MANUAL VIDEO" : done > k ? "COMPLETED" : "QUEUED";
                      return <LessonRow key={n} t={t} n={n} status={st} />;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </ProviderShell>
          {g >= 362 && <Toast g={g} at={362} text="Course drafts created successfully" x={1060} y={130} />}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ BULK ENROLLMENT (real UI: SB-Branch /bulk-enrollment page.tsx) ═══════════
// Title "Bulk Enrollment" · "Upload a CSV file to enroll multiple students at once." · Template CSV
// Steps: Upload CSV → Map Fields → Validate → Preview & Enroll. Fields: Email, Program, Session,
// First Name / Last Name ("Used only when creating a new user"). Preview: Student · Program ·
// Session · Status (Will Enroll / Already Enrolled). Button "Enroll N Students" →
// "Enrollment Queued" · "Bulk enrollment has been queued for processing."
const BulkStepper: React.FC<{ step: number }> = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    {["Upload CSV", "Map Fields", "Validate", "Preview & Enroll"].map((s, i) => (
      <React.Fragment key={s}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? BLUE : "#E5E7EB", color: step > i ? "#fff" : GRAY, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{step > i + 1 ? "✓" : i + 1}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: step > i ? INK : GRAY }}>{s}</span>
        {i < 3 && <span style={{ width: 60, height: 2, background: step > i + 1 ? BLUE : "#E5E7EB" }} />}
      </React.Fragment>
    ))}
  </div>
);
const SceneBulk: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const step = g < 70 ? 1 : g < 150 ? 2 : g < 220 ? 3 : 4;
  const UP = { x: MX(665), y: MY(330) };
  const CONT = { x: MX(1180), y: MY(720) };
  const ENROLL = { x: MX(1160), y: MY(720) };
  const cur = path(g, [[0, 900, 650], [24, UP.x, UP.y], [40, UP.x, UP.y], [120, CONT.x, CONT.y], [140, CONT.x, CONT.y], [190, CONT.x, CONT.y], [212, CONT.x, CONT.y], [300, ENROLL.x, ENROLL.y], [330, ENROLL.x, ENROLL.y], [420, 1000, 500]]);
  const ripple = Math.max(rip(g, 36), rip(g, 136), rip(g, 208), rip(g, 322));
  const queued = g >= 330;
  const willEnroll = BULK_ROWS.filter((r) => !r.already).length + BULK_EXTRA;
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 760, 360, 1.25], [60, 760, 360, 1.25], [80, WIDE_X, WIDE_Y, 1.05], [240, WIDE_X, WIDE_Y, 1.05], [270, 900, 520, 1.25], [300, 1150, 640, 1.35], [340, 1150, 640, 1.35], [370, WIDE_X, WIDE_Y, 1.05], [420, WIDE_X, WIDE_Y, 1.05]];
  return (
    <Stage>
      <PortalTag n={BULK_TAG} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/bulk-enrollment">
          <ProviderShell active="Approved Members" bell={2}>
            <PageTitle t="Bulk Enrollment" sub="Upload a CSV file to enroll multiple students at once." />
            <Btn x={1170} y={22} w={160} h={42} label="⤓ Template CSV" fs={14} />
            <div style={{ position: "absolute", left: 20, top: 92, width: 1310, height: 70, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 24px", boxSizing: "border-box" }}><BulkStepper step={step} /></div>
            <div style={{ position: "absolute", left: 20, top: 178, width: 1310, height: 600, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              {step === 1 && (
                <>
                  <div style={{ position: "absolute", left: 30, top: 24, fontSize: 17, fontWeight: 800, color: INK }}>CSV Template Fields</div>
                  <div style={{ position: "absolute", left: 30, top: 56, display: "flex", gap: 10 }}>
                    {["Email", "Program", "Session", "First Name", "Last Name"].map((t) => <span key={t} style={{ padding: "6px 12px", borderRadius: 7, background: "#F3F4F6", fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{t}</span>)}
                  </div>
                  <div style={{ position: "absolute", left: 330, top: 110, width: 650, height: 200, borderRadius: 12, border: `2px dashed ${g >= 36 ? BLUE : "#CBD5E1"}`, background: g >= 36 ? BLUE_SOFT : "#FAFAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    {g < 44 ? (
                      <><div style={{ fontSize: 40 }}>⤒</div><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Click to upload CSV</div><div style={{ fontSize: 14, color: GRAY }}>Only .csv files are supported</div></>
                    ) : (
                      <div style={{ opacity: fi(g, 44, 8), display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 10, background: "#fff", border: `1px solid ${LINE}` }}><span style={{ fontSize: 28 }}>📄</span><div><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{CSV_NAME}</div><div style={{ fontSize: 13, color: GRAY }}>{willEnroll + BULK_ROWS.filter((r) => r.already).length} rows</div></div></div>
                    )}
                  </div>
                </>
              )}
              {step === 2 && (
                <div style={{ opacity: fi(g, 70, 8) }}>
                  <div style={{ position: "absolute", left: 30, top: 24, fontSize: 17, fontWeight: 800, color: INK }}>Map CSV columns to required fields</div>
                  {[["Email", "email"], ["Program", "program"], ["Session", "session"], ["First Name", "first_name"], ["Last Name", "last_name"]].map(([a, b], i) => (
                    <div key={a} style={{ position: "absolute", left: 30, top: 70 + i * 62, width: 900, display: "flex", alignItems: "center", gap: 20, opacity: fi(g, 76 + i * 8, 8) }}>
                      <div style={{ width: 220, fontSize: 15.5, fontWeight: 700, color: INK }}>{a} {i < 3 && <span style={{ color: "#EF4444" }}>*</span>}</div>
                      <span style={{ color: GRAY }}>←</span>
                      <div style={{ width: 360, height: 42, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 15, color: INK }}>{b}<span style={{ color: "#9CA3AF" }}>⌄</span></div>
                      <span style={{ color: GREEN, fontWeight: 800 }}>✓</span>
                    </div>
                  ))}
                  <Btn x={1060} y={530} w={220} h={44} label="Continue to Validate" primary fs={14.5} press={g >= 136 && g < 142 ? 1 : 0} />
                </div>
              )}
              {step === 3 && (
                <div style={{ opacity: fi(g, 150, 8) }}>
                  <div style={{ position: "absolute", left: 30, top: 24, display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 17, fontWeight: 800, color: INK }}>Validation Results</span>{g >= 170 && <Badge t="All rows valid" c={GREEN} bg="#DCFCE7" />}</div>
                  {BULK_ROWS.slice(0, 6).map((r, i) => (
                    <div key={r.email} style={{ position: "absolute", left: 30, top: 70 + i * 56, width: 1250, height: 50, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 20, fontSize: 14.5, color: INK, opacity: fi(g, 156 + i * 4, 6) }}>
                      <span style={{ width: 280 }}>{r.email}</span><span style={{ width: 300 }}>{PROGRAM}</span><span style={{ width: 220 }}>{SESSION}</span><span style={{ color: GREEN, fontWeight: 800 }}>✓ Valid</span>
                    </div>
                  ))}
                  <Btn x={1100} y={530} w={180} h={44} label="Validate" primary fs={14.5} press={g >= 208 && g < 214 ? 1 : 0} />
                </div>
              )}
              {step === 4 && !queued && (
                <div style={{ opacity: fi(g, 220, 8) }}>
                  <div style={{ position: "absolute", left: 30, top: 20, width: 1250, height: 40, background: "#F9FAFB", borderRadius: 8, fontSize: 14.5, fontWeight: 800, color: INK, display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box" }}>Enrollment Preview</div>
                  {[["#", 44], ["Student", 90], ["Program", 470], ["Session", 800], ["Status", 1060]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 74, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
                  {BULK_ROWS.map((r, i) => (
                    <div key={r.email} style={{ position: "absolute", left: 30, top: 100 + i * 60, width: 1250, height: 60, borderBottom: `1px solid ${LINE}`, opacity: fi(g, 224 + i * 5, 6) }}>
                      <div style={{ position: "absolute", left: 14, top: 20, fontSize: 14, color: GRAY }}>{i + 1}</div>
                      <div style={{ position: "absolute", left: 60, top: 9 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{r.name}</div><div style={{ fontSize: 12.5, color: GRAY }}>{r.email}</div></div>
                      <div style={{ position: "absolute", left: 440, top: 19, fontSize: 14.5, color: INK }}>{PROGRAM}</div>
                      <div style={{ position: "absolute", left: 770, top: 19, fontSize: 14.5, color: INK }}>{SESSION}</div>
                      <div style={{ position: "absolute", left: 1030, top: 16 }}>{r.already ? <Badge t="Already Enrolled" c="#B45309" bg="#FEF3C7" fs={12.5} /> : <Badge t="Will Enroll" c={GREEN} bg="#DCFCE7" fs={12.5} />}</div>
                    </div>
                  ))}
                  <div style={{ position: "absolute", left: 30, top: 100 + BULK_ROWS.length * 60 + 10, fontSize: 14, color: GRAY }}>+ {BULK_EXTRA} more rows</div>
                  <Btn x={30} y={530} w={180} h={44} label="Back to Validate" fs={14} />
                  <Btn x={1040} y={530} w={240} h={44} label={`Enroll ${willEnroll} Students`} primary fs={15} press={g >= 322 && g < 328 ? 1 : 0} />
                </div>
              )}
              {queued && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: fi(g, 330, 10) }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#DCFCE7", color: GREEN, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(g, 330, fps)})` }}>✓</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>Enrollment Queued</div>
                  <div style={{ fontSize: 16, color: GRAY }}>Bulk enrollment has been queued for processing.</div>
                  <Btn x={555} y={400} w={200} h={44} label="Start New Bulk Enrollment" fs={13.5} />
                </div>
              )}
            </div>
          </ProviderShell>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};
// ═══ COMPANY PORTAL: course → Branches tab → select offices → Save ═══════════
// Real UI (see plan-portals doc): edit tabs Course info | Branches | Progress settings |
// Layout & content, "Preview"; Branches tab: Select All / Deselect All / Save,
// "Search branches…", grid of branch cards (checkbox, logo, name + slug, 📍, 📞, 👤).
const CO2_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Branch Management" }, { t: "Courses & Programs", open: true }, { t: "Programs", child: true }, { t: "Courses", child: true },
  { t: "Categories", child: true }, { t: "Mentors and Trainer", child: true }, { t: "Sessions", child: true },
  { t: "Attendance", more: true }, { t: "Staff Management", more: true }, { t: "Marketing", more: true },
  { t: "Form Builder" }, { t: "Menu Builder" }, { t: "Website Builder" }, { t: "Enrollment form Builder" }, { t: "Integrations" },
];
const CompanyShell2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><KeyLogo sub="Change company" /></div>
      <div style={{ marginTop: 10, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search...</div>
      {CO2_MENU.map((m, i) => {
        const on = m.t === "Courses";
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: 120 + i * 34, width: SIDE - 24, height: 32, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 6, paddingRight: 6, boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            {!m.child && <Ico c={on ? BLUE : "#4B5563"} s={14} />}
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
            {m.more && <Chevron />}
            {m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} />
      <div style={{ flex: 1 }} />
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <Avatar t={RACHEL_AV.t} c1={RACHEL_AV.c1} c2={RACHEL_AV.c2} />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
const SceneOffices: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const onTab = g >= 46;
  const TAB = { x: MX(300), y: MY(110) };
  const card = (i: number) => ({ x: MX(40 + i * 430 + 200), y: MY(300) });
  const SAVE = { x: MX(1270), y: MY(176) };
  const picks = [100, 150, 200];
  const cur = path(g, [[0, 900, 600], [30, TAB.x, TAB.y], [50, TAB.x, TAB.y], [90, card(0).x, card(0).y], [104, card(0).x, card(0).y], [140, card(1).x, card(1).y], [154, card(1).x, card(1).y], [190, card(2).x, card(2).y], [204, card(2).x, card(2).y], [250, SAVE.x, SAVE.y], [272, SAVE.x, SAVE.y], [330, SAVE.x, SAVE.y]]);
  const ripple = Math.max(rip(g, 44), rip(g, picks[0]), rip(g, picks[1]), rip(g, picks[2]), rip(g, 266));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 600, 200, 1.4], [56, 600, 200, 1.4], [80, WIDE_X, 380, 1.15], [220, WIDE_X, 380, 1.15], [244, 1300, 220, 1.5], [290, 1300, 220, 1.5], [330, WIDE_X, WIDE_Y, 1.05]];
  return (
    <Stage>
      <PortalTag n={OFFICES_TAG} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={`company.skillbnk.com/courses/${COURSE_SLUG}`}>
          <CompanyShell2>
            <PageTitle t={`Edit Program · ${COURSE}`} sub={PROGRAM} />
            <Btn x={1210} y={22} w={120} h={42} label="👁 Preview" fs={14} />
            <div style={{ position: "absolute", left: 20, top: 84, display: "flex", gap: 6, padding: 5, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}` }}>
              {["Course info", "Branches", "Progress settings", "Layout & content"].map((t) => {
                const on = (t === "Branches") === onTab;
                return <div key={t} style={{ padding: "9px 18px", borderRadius: 8, fontSize: 15, fontWeight: 700, background: on ? BLUE : "transparent", color: on ? "#fff" : "#374151" }}>{t}</div>;
              })}
            </div>
            <div style={{ position: "absolute", left: 20, top: 146, width: 1310, height: 640, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
              {!onTab ? (
                <div style={{ padding: 30 }}>
                  {[["Title", COURSE], ["Program", PROGRAM], ["Type", "course"], ["Language", "English"], ["Delivery Type", "Native"]].map(([a, b]) => (
                    <div key={a} style={{ display: "flex", gap: 20, padding: "14px 0", borderBottom: `1px solid ${LINE}`, fontSize: 16 }}><span style={{ width: 200, color: GRAY, fontWeight: 600 }}>{a}</span><span style={{ color: INK, fontWeight: 700 }}>{b}</span></div>
                  ))}
                </div>
              ) : (
                <div style={{ opacity: fi(g, 46, 8) }}>
                  <div style={{ position: "absolute", left: 24, top: 18, width: 420, height: 42, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14.5, color: "#9CA3AF" }}>⌕ Search branches…</div>
                  <Btn x={890} y={18} w={120} h={42} label="Select All" fs={14} />
                  <Btn x={1020} y={18} w={140} h={42} label="Deselect All" fs={14} />
                  <Btn x={1170} y={18} w={116} h={42} label="Save" primary fs={14.5} press={g >= 266 && g < 272 ? 1 : 0} />
                  {OFFICES.map((o, i) => {
                    const on = g >= picks[i];
                    return (
                      <div key={o.n} style={{ position: "absolute", left: 24 + i * 430, top: 84, width: 410, height: 250, borderRadius: 12, border: `2px solid ${on ? BLUE : LINE}`, background: on ? "#F5F8FF" : "#fff", padding: 20, boxSizing: "border-box" }}>
                        <div style={{ position: "absolute", right: 16, top: 16, width: 24, height: 24, borderRadius: 6, border: `2px solid ${on ? BLUE : "#CBD5E1"}`, background: on ? BLUE : "#fff", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</div>
                        <KeyLogo sub={o.n} />
                        <div style={{ marginTop: 18, fontSize: 18, fontWeight: 800, color: INK }}>{o.n}</div>
                        <div style={{ fontSize: 13, color: GRAY }}>{o.slug}</div>
                        <div style={{ marginTop: 14, fontSize: 14.5, color: "#374151", lineHeight: 1.8 }}>📍 {o.loc}<br />📞 {o.ph}<br />👤 {o.mgr}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CompanyShell2>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};
// ═══ HOOK (generic): floating cards + three headline lines ══════════════════
const HookCards: React.FC<{ g: number; fps: number; D: number; main: React.ReactNode; cards: string[]; lines: { t: string; at: number; c: string }[]; accent: string }> = ({ g, fps, D, main, cards, lines, accent }) => {
  const drift = (i: number) => Math.sin((g + i * 40) / 30) * 7;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 170, top: 110 + drift(0), width: 640, height: 480, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: sp(g, 4, fps), transform: "rotate(-2deg)", overflow: "hidden" }}>{main}</div>
        {cards.map((n, i) => {
          const p = sp(g, 60 + i * 18, fps, { damping: 12 });
          return (
            <div key={n} style={{ position: "absolute", left: 980 + (i % 2) * 330, top: 140 + Math.floor(i / 2) * 200 + drift(i + 1), width: 300, height: 160, borderRadius: 16, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${accent}66`, boxShadow: "0 20px 50px #0009", opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${(i - 1.5) * 4}deg)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, boxSizing: "border-box", fontSize: 24, fontWeight: 800, color: "#FDBA74" }}>{n}</div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center" }}>
          {lines.map((l) => {
            const o = fi(g, l.at, 12);
            return <div key={l.t} style={{ fontSize: 48, fontWeight: 800, color: l.c, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, lineHeight: 1.3 }}>{l.t}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
// ═══ r0 — HOOK: a new agent just lost a listing ═════════════════════════════
const SceneHookRE: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 260;
  const g = gt(f, dur, D);
  const main = (
    <>
      <div style={{ height: 60, background: "linear-gradient(90deg,#0F766E,#14B8A6)", color: "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontSize: 22, fontWeight: 800 }}>🏠 Listing update · 418 Maple Ave</div>
      <div style={{ padding: "28px 30px" }}>
        <div style={{ fontSize: 20, color: "#374151", fontWeight: 600 }}>Seller decision</div>
        <div style={{ marginTop: 10, fontSize: 46, fontWeight: 900, color: "#DC2626", opacity: fi(g, 40, 10) }}>Listing lost ✗</div>
        <div style={{ marginTop: 18, fontSize: 19, color: "#4B5563", lineHeight: 1.5, opacity: fi(g, 60, 10) }}>“The agent couldn't explain the pricing plan or the marketing timeline. We went with another brokerage.”</div>
        <div style={{ marginTop: 22, display: "flex", gap: 10, opacity: fi(g, 80, 10) }}>
          <span style={{ padding: "6px 12px", borderRadius: 8, background: "#FEF2F2", color: "#B91C1C", fontWeight: 700, fontSize: 15 }}>Agent: 3 weeks in</span>
          <span style={{ padding: "6px 12px", borderRadius: 8, background: "#F3F4F6", color: "#374151", fontWeight: 700, fontSize: 15 }}>Training: none yet</span>
        </div>
      </div>
    </>
  );
  return <HookCards g={g} fps={fps} D={D} main={main} accent="#14B8A6" cards={["👀 Shadow a top agent", "📒 The old binder", "🤞 Hope it sticks", "📞 Top producer off the phone"]} lines={[{ t: "Your new agent just lost a listing.", at: 6, c: "#F1F5F9" }, { t: "Not because they're bad…", at: 90, c: "#FDBA74" }, { t: "Nobody had time to teach your process.", at: 150, c: "#FCA5A5" }]} />;
};

// ═══ t1 — Program leaderboard: pick program + session → View results ═══════
const SceneLeaderboard: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 250;
  const g = gt(f, dur, D);
  const PROGSEL = { x: MX(300), y: MY(116) };
  const SESSEL = { x: MX(790), y: MY(116) };
  const VIEW = { x: MX(1090), y: MY(116) };
  const filled = g >= 60 ? fi(g, 60, 10) : 0;
  const cur = path(g, [[0, 700, 600], [20, PROGSEL.x, PROGSEL.y], [28, PROGSEL.x, PROGSEL.y], [38, SESSEL.x, SESSEL.y], [46, SESSEL.x, SESSEL.y], [54, VIEW.x, VIEW.y], [70, VIEW.x, VIEW.y], [110, 900, 560], [250, 900, 560]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [14, 900, 160, 1.5], [62, 900, 160, 1.5], [84, 760, 420, 1.3], [170, 760, 420, 1.3], [200, 760, 380, 1.15], [250, 760, 380, 1.15]];
  const scroll = interpolate(g, [150, 235], [0, 200], { ...cl, easing: EZ });
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/branch-leaderboard">
          <ProviderShell active="Leaderboard" bell={2}>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 0, 8) }}>
              <LeaderboardPage scroll={scroll} filled={g >= 28 ? (g >= 60 ? filled : 0) : 0} pressView={g >= 56 && g < 62} />
              {g < 60 && <div style={{ position: "absolute", left: 20, top: LB_TOP, width: 1310, height: 300, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 16, gap: 6 }}><b style={{ color: INK }}>No rankings yet</b>Select a program and session, then View results</div>}
            </div>
          </ProviderShell>
          <Cursor x={cur.x} y={cur.y} ripple={Math.max(rip(g, 24), rip(g, 42), rip(g, 58))} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ t2 — scroll down: "Needs attention" learners ═══════════════════════════
const SceneBehind: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 200;
  const g = gt(f, dur, D);
  const scroll = interpolate(g, [6, 80], [200, LB_MAX], { ...cl, easing: EZ });
  const camKeys: CamKey[] = [[0, 760, 380, 1.15], [70, 760, 380, 1.15], [100, 1000, 520, 1.3], [200, 1000, 520, 1.3]];
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/branch-leaderboard">
          <ProviderShell active="Leaderboard" bell={2}>
            <LeaderboardPage scroll={scroll} />
          </ProviderShell>
          <Cursor x={MX(1300)} y={MY(300 + interpolate(g, [6, 80], [0, 380], cl))} opacity={fo(g, 86, 8)} />
        </Browser>
      </CamC>
      <Callout o={fi(g, 92, 12)} text="12 learners · Needs attention" x={1180} y={130} />
    </Stage>
  );
};

// ─── Email Marketing list ────────────────────────────────────────────────────
const CAMPAIGNS = [
  { s: "Welcome to the team training", u: 48, se: 48, fa: 0, d: "Sep 2, 2026", sch: "No" },
  { s: "Weekly learning tip", u: 48, se: 47, fa: 1, d: "Sep 9, 2026", sch: "Yes" },
  { s: "New module: Claims basics", u: 48, se: 48, fa: 0, d: "Sep 16, 2026", sch: "No" },
  { s: "Live class starts Monday", u: 31, se: 31, fa: 0, d: "Sep 23, 2026", sch: "No" },
];
const SUBJECT = "Quick reminder: finish New Agent Launch";
const EmailListPage: React.FC<{ g: number; fps: number; newAt?: number; sched?: boolean; pressAdd?: boolean; pressReports?: boolean; pressCron?: boolean }> = ({ g, fps, newAt, sched, pressAdd, pressReports, pressCron }) => {
  const has = newAt !== undefined && g >= newAt;
  const nw = has ? sp(g, newAt!, fps) : 0;
  const rows = has ? [{ s: SUBJECT, u: 12, se: 12, fa: 0, d: "Oct 1, 2026", sch: sched ? "Yes" : "No", isNew: true }, ...CAMPAIGNS.map((c) => ({ ...c, isNew: false }))] : CAMPAIGNS.map((c) => ({ ...c, isNew: false }));
  return (
    <>
      <PageTitle t="Email Marketing" sub="Create and send email campaigns to users" />
      <div style={{ position: "absolute", left: 760, top: 22, width: 300, height: 42, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, color: "#9CA3AF" }}>Enter Email Subject/Body…</div>
      <Btn x={1070} y={22} w={100} h={42} label="+ Add" primary fs={15} press={pressAdd ? 1 : 0} />
      <Btn x={1180} y={22} w={100} h={42} label="⚲ Filters" fs={14} />
      <div style={{ position: "absolute", left: 1290, top: 22, width: 42, height: 42, borderRadius: 9, background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</div>
      <div style={{ position: "absolute", left: 20, top: 84, width: 1310, height: 700, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1310, height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
        {[["Created By", 20], ["Email Subject", 210], ["Users", 560], ["Sent", 640], ["Failed", 710], ["Creation Date", 790], ["Cron Active", 940], ["Actions", 1050]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
        {rows.map((r, i) => {
          const y = 50 + (r.isNew ? 0 : (i - (has ? 1 : 0)) * 64 + (has ? 64 * nw : 0));
          return (
            <div key={r.s} style={{ position: "absolute", left: 0, top: y, width: 1310, height: 64, borderBottom: `1px solid ${LINE}`, background: r.isNew ? `rgba(220,252,231,${Math.max(0.3, 1 - Math.max(0, g - newAt! - 30) / 80)})` : "transparent", opacity: r.isNew ? nw : 1 }}>
              <div style={{ position: "absolute", left: 20, top: 13, display: "flex", gap: 10, alignItems: "center" }}><Avatar t={RACHEL_AV.t} s={34} /><div><div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{ADMIN}</div><div style={{ fontSize: 12, color: GRAY }}>Role: Trainer</div></div></div>
              <div style={{ position: "absolute", left: 210, top: 21, width: 340, fontSize: 14.5, fontWeight: 700, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.s}</div>
              <div style={{ position: "absolute", left: 566, top: 21, fontSize: 15, color: INK }}>{r.u}</div>
              <div style={{ position: "absolute", left: 646, top: 21, fontSize: 15, fontWeight: 700, color: GREEN }}>{r.se}</div>
              <div style={{ position: "absolute", left: 716, top: 21, fontSize: 15, fontWeight: 700, color: "#DC2626" }}>{r.fa}</div>
              <div style={{ position: "absolute", left: 790, top: 21, fontSize: 14, color: INK }}>{r.d}</div>
              <div style={{ position: "absolute", left: 940, top: 19 }}>{r.sch === "Yes" ? <Badge t="Yes" c={GREEN} bg="#DCFCE7" fs={12.5} /> : <span style={{ fontSize: 14, color: GRAY }}>No</span>}</div>
              <div style={{ position: "absolute", left: 1050, top: 15, display: "flex", gap: 8 }}>
                <div style={{ height: 34, padding: "0 12px", borderRadius: 7, background: r.isNew && pressReports ? BLUE : BLUE_SOFT, color: r.isNew && pressReports ? "#fff" : BLUE, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center" }}>↗ Reports</div>
                <div style={{ height: 34, padding: "0 12px", borderRadius: 7, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", transform: `scale(${r.isNew && pressCron ? 0.92 : 1})` }}>Cron Jobs</div>
                <IconBtn t="✎" />
                <IconBtn t="🗑" bg="#FEE2E2" c="#DC2626" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
const NEW_ROW_Y = MY(84 + 50 + 32);
const REPORTS_BTN = { x: MX(1050 + 46), y: NEW_ROW_Y };
const CRON_BTN = { x: MX(1050 + 92 + 8 + 45), y: NEW_ROW_Y };


// ═══ t3 — Create New Email (real 2-step modal) ════════════════════════════════
// Step 1 "Select your audience": User Type / Program / Session filter → "N Result",
// row checkboxes + "Select All" + "Remove Selected (N)" (removes them from recipients).
// Step 2 "Compose your email": SendGrid Template, Sender, Subject, Include user name,
// Reply to, Comment/Note → Back / Save As New / Send.
const MODAL = { x: 280, y: 26, w: 1040 };
const SceneEmail: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 470;
  const g = gt(f, dur, D);
  const step2 = g >= 288;
  const mo = fi(g, 30, 10);
  const mh = step2 ? 640 : 804;
  const ADD = { x: MX(1120), y: MY(43) };
  const UT = { x: 460, y: 212 };
  const PRG = { x: 800, y: 212 };
  const SES = { x: 1140, y: 212 };
  const SELALL = { x: 1268, y: 268 };
  const REMOVE = { x: 1150, y: 268 };
  const NEXT = { x: 1240, y: 782 };
  const TPL = { x: 545, y: 212 };
  const SUBJ = { x: 800, y: 302 };
  const TOG = { x: 320, y: 351 };
  const NOTE = { x: 1055, y: 442 };
  const SEND = { x: 1225, y: 592 };
  const vis = [TEAM[2], NINA, TEAM[3], TEAM[37], TEAM[45], TEAM[12], TEAM[38], TEAM[20], TEAM[43], TEAM[47]];
  const all = [...vis, ...TEAM.filter((r) => !vis.includes(r))];
  const unAt = [1, 3, 4, 6, 8, 9].map((k, n) => ({ k, at: 128 + n * 14 }));
  const hiddenBehind = all.map((r, k) => ({ r, k })).filter(({ r, k }) => r.behind && k >= 10);
  const isChecked = (k: number) => {
    if (g < 114) return false;
    const u = unAt.find((x) => x.k === k);
    if (u) return g < u.at + 2;
    const h = hiddenBehind.findIndex((x) => x.k === k);
    if (h >= 0) return g < 226 + h * 3;
    return true;
  };
  const removed = g >= 252;
  const rows = removed ? all.filter((r) => r.behind) : all;
  const selCount = removed ? 0 : all.filter((_, k) => isChecked(k)).length;
  const results = (removed ? 12 : g >= 94 ? 48 : 0) - selCount;
  const tScroll = removed ? 0 : interpolate(g, [204, 224], [0, 48 * 40 - 400], { ...cl, easing: EZ });
  const rowY = (k: number) => 350 + k * 40;
  const curPts: P3[] = [[0, 900, 500], [20, ADD.x, ADD.y], [30, ADD.x, ADD.y], [46, UT.x, UT.y], [54, UT.x, UT.y], [62, PRG.x, PRG.y], [70, PRG.x, PRG.y], [78, SES.x, SES.y], [92, SES.x, SES.y], [108, SELALL.x, SELALL.y], [116, SELALL.x, SELALL.y]];
  unAt.forEach((c) => { curPts.push([c.at - 6, 326, rowY(c.k)]); curPts.push([c.at + 4, 326, rowY(c.k)]); });
  curPts.push([224, 326, 690], [240, REMOVE.x, REMOVE.y], [254, REMOVE.x, REMOVE.y], [276, NEXT.x, NEXT.y], [286, NEXT.x, NEXT.y], [298, TPL.x, TPL.y], [308, TPL.x, TPL.y], [318, SUBJ.x, SUBJ.y], [380, SUBJ.x, SUBJ.y], [388, TOG.x, TOG.y], [396, TOG.x, TOG.y], [404, NOTE.x, NOTE.y], [424, NOTE.x, NOTE.y], [446, SEND.x, SEND.y], [470, SEND.x, SEND.y]);
  const cur = path(g, curPts);
  const ripple = Math.max(rip(g, 26), rip(g, 50), rip(g, 66), rip(g, 82), rip(g, 112), ...unAt.map((c) => rip(g, c.at)), rip(g, 250), rip(g, 282), rip(g, 302), rip(g, 320), rip(g, 392), rip(g, 406), rip(g, 456));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [16, 1300, 120, 1.5], [30, 1300, 120, 1.5], [42, WIDE_X, WIDE_Y, 1.05], [50, 800, 230, 1.4], [94, 800, 230, 1.4], [104, 900, 420, 1.25], [204, 900, 420, 1.25], [238, 1050, 330, 1.4], [262, 1050, 330, 1.4], [276, 1150, 700, 1.4], [292, 800, 320, 1.3], [384, 800, 320, 1.3], [400, 800, 420, 1.25], [440, 1100, 560, 1.4], [470, 1100, 560, 1.4]];
  return (
    <Stage>
      <PortalTag n={2} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/email-marketing">
          <ProviderShell active="Email Marketing" bell={2}>
            <EmailListPage g={g} fps={fps} pressAdd={g >= 26 && g < 32} />
          </ProviderShell>
          <Dim o={mo} />
          {mo > 0.01 && (
            <div style={{ position: "absolute", left: MODAL.x, top: MODAL.y + (1 - mo) * 20, width: MODAL.w, height: mh, borderRadius: 16, background: "#fff", opacity: mo, zIndex: 45, boxShadow: "0 30px 80px #0007", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 20, top: 18, fontSize: 22, fontWeight: 800, color: INK }}>Create New Email</div>
              <div style={{ position: "absolute", left: 20, top: 50, fontSize: 14.5, color: GRAY }}>{step2 ? "Step 2: Compose your email" : "Step 1: Select your audience"}</div>
              <div style={{ position: "absolute", right: 20, top: 18, width: 30, height: 30, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: GRAY }}>×</div>
              <div style={{ position: "absolute", left: 20, top: 82, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{step2 ? "✓" : 1}</span><span style={{ color: INK }}>Audience</span>
                <span style={{ width: 120, height: 3, background: step2 ? BLUE : "#E5E7EB" }} />
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: step2 ? BLUE : "#E5E7EB", color: step2 ? "#fff" : GRAY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>2</span><span style={{ color: step2 ? INK : GRAY }}>Email</span>
              </div>
              {!step2 && <div style={{ position: "absolute", right: 20, top: 76, height: 36, padding: "0 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: INK, display: "flex", alignItems: "center" }}>Import Users (Add Mode)</div>}
            </div>
          )}
          {mo > 0.01 && !step2 && (
            <div style={{ position: "absolute", inset: 0, zIndex: 46, opacity: mo }}>
              <Input x={300} y={160} w={320} label="User Type" value={g >= 56 ? "Approved" : ""} ph="Select User Type" select glow={g >= 50 && g < 62 ? 1 : 0} />
              <Input x={640} y={160} w={320} label="Program" value={g >= 72 ? PROGRAM : ""} ph="Select Program" select glow={g >= 66 && g < 78 ? 1 : 0} fs={14.5} />
              <Input x={980} y={160} w={320} label="Session" value={g >= 88 ? SESSION : ""} ph="Select Session" select glow={g >= 82 && g < 94 ? 1 : 0} />
              <div style={{ position: "absolute", left: 300, top: 250, width: 1000, height: 36, display: "flex", alignItems: "center", gap: 12, opacity: fi(g, 94, 10) }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: INK }}>{results} Result</span>
                <span style={{ flex: 1 }} />
                {selCount > 0 && <span style={{ height: 32, padding: "0 12px", borderRadius: 7, background: "#EF4444", color: "#fff", fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", transform: `scale(${g >= 250 && g < 256 ? 0.94 : 1})` }}>Remove Selected ({selCount})</span>}
                <span style={{ fontSize: 14, fontWeight: 700, color: BLUE, textDecoration: "underline" }}>{selCount === 48 ? "Remove All" : "Select All"}</span>
              </div>
              <div style={{ position: "absolute", left: 300, top: 290, width: 1000, height: 440, borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden", opacity: fi(g, 94, 10) }}>
                <div style={{ height: 40, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 18, padding: "0 16px", fontSize: 14, fontWeight: 700, color: "#374151" }}>
                  <span style={{ width: 50 }}>Select</span><span style={{ width: 240 }}>Name</span><span style={{ width: 330 }}>Email</span><span style={{ width: 170 }}>Phone</span><span>Actions</span>
                </div>
                <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: -tScroll, width: 1000, opacity: removed ? fi(g, 254, 12) : 1 }}>
                    {rows.map((r, k) => {
                      const on = !removed && isChecked(k);
                      return (
                        <div key={r.name + k} style={{ height: 40, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 18, padding: "0 16px", fontSize: 14.5, color: INK, background: on ? "#EFF6FF" : "#fff" }}>
                          <span style={{ width: 50 }}><span style={{ display: "inline-flex", width: 20, height: 20, borderRadius: 5, border: on ? `2px solid ${BLUE}` : "2px solid #9CA3AF", background: on ? BLUE : "#fff", color: "#fff", fontSize: 13, alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</span></span>
                          <span style={{ width: 240, fontWeight: 600 }}>{r.name}</span>
                          <span style={{ width: 330, color: GRAY }}>{r.email}</span>
                          <span style={{ width: 170, color: GRAY }}>(206) 555-01{String(10 + TEAM.indexOf(r)).slice(-2)}</span>
                          <span style={{ color: GRAY, letterSpacing: 8 }}>✎🗑</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Btn x={1180} y={760} w={120} h={44} label="Next →" primary fs={15} press={g >= 282 && g < 288 ? 1 : 0} />
            </div>
          )}
          {mo > 0.01 && step2 && (
            <div style={{ position: "absolute", inset: 0, zIndex: 46, opacity: fi(g, 288, 8) }}>
              <Input x={300} y={160} w={490} label="SendGrid Template" value={g >= 304 ? "Training reminder" : ""} ph="Select a template" select glow={g >= 298 && g < 310 ? 1 : 0} />
              <Input x={810} y={160} w={490} label="Sender" value={`${ADMIN} · training@harborpoint.example`} select />
              <Input x={300} y={250} w={1000} label="Subject" value={typed(g, 322, SUBJECT, 0.9)} ph="Write a meaningful subject" glow={g >= 318 && g < 384 ? 1 : 0} />
              <div style={{ position: "absolute", left: 300, top: 340, display: "flex", gap: 10, alignItems: "center", fontSize: 14.5, fontWeight: 600, color: "#374151" }}><Toggle on={g >= 394 ? 1 : 0} />Include user name in email</div>
              <Input x={300} y={390} w={490} label="Reply to (Optional)" value="alex.turner@example.com" />
              <Input x={810} y={390} w={490} label="Comment/Note" value={typed(g, 408, "Q4 nudge #1", 0.6)} ph="Write a note here" glow={g >= 404 && g < 428 ? 1 : 0} />
              <Btn x={880} y={570} w={100} h={44} label="Back" fs={15} />
              <Btn x={990} y={570} w={150} h={44} label="Save As New" fs={15} />
              <Btn x={1150} y={570} w={150} h={44} label={g >= 458 ? "Sending…" : "Send"} primary fs={15} press={g >= 456 && g < 462 ? 1 : 0} />
            </div>
          )}
          {g < 150 && <Toast g={g} at={94} text="Users filtered successfully" x={1100} y={60} />}
          {g >= 252 && g < 300 && <Toast g={g} at={254} text="Removed 36 users from recipients" x={1060} y={60} />}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ t4 — sent → Delivery Reports → Cron Jobs (repeat weekly) ═══════════════
const SceneReports: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const rep = g >= 84 && g < 168 ? Math.min(fi(g, 84, 8), fo(g, 160, 8)) : 0;
  const cron = g >= 184 && g < 262 ? Math.min(fi(g, 184, 8), fo(g, 254, 8)) : 0;
  const CLOSE = { x: 1167, y: 161 };
  const CRON_IN = { x: 800, y: 362 };
  const CRON_SAVE = { x: 1040, y: 462 };
  const cur = path(g, [[0, 1225, 782], [40, 900, 400], [70, REPORTS_BTN.x, REPORTS_BTN.y], [82, REPORTS_BTN.x, REPORTS_BTN.y], [140, 900, 500], [154, CLOSE.x, CLOSE.y], [164, CLOSE.x, CLOSE.y], [180, CRON_BTN.x, CRON_BTN.y], [188, CRON_BTN.x, CRON_BTN.y], [200, CRON_IN.x, CRON_IN.y], [232, CRON_IN.x, CRON_IN.y], [246, CRON_SAVE.x, CRON_SAVE.y], [330, CRON_SAVE.x + 100, CRON_SAVE.y - 200]]);
  const ripple = Math.max(rip(g, 80), rip(g, 160), rip(g, 186), rip(g, 200), rip(g, 250));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 900, 230, 1.45], [70, 900, 230, 1.45], [90, WIDE_X, 400, 1.15], [160, WIDE_X, 400, 1.15], [176, 1250, 230, 1.45], [190, 800, 380, 1.4], [258, 800, 380, 1.4], [276, 1000, 230, 1.45], [330, 1000, 230, 1.45]];
  const expr = typed(g, 202, "0 15 * * 1", 0.4);
  return (
    <Stage>
      <PortalTag n={2} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/email-marketing">
          <ProviderShell active="Email Marketing" bell={2}>
            <EmailListPage g={g} fps={fps} newAt={16} sched={g >= 256} pressReports={g >= 80 && g < 86} pressCron={g >= 186 && g < 192} />
          </ProviderShell>
          {g < 14 && <Dim o={fo(g, 4, 10)} />}
          <Dim o={Math.max(rep, cron)} />
          {rep > 0.01 && (
            <div style={{ position: "absolute", left: 400, top: 130, width: 800, height: 520, borderRadius: 16, background: "#fff", opacity: rep, zIndex: 45, boxShadow: "0 30px 80px #0007", padding: "20px 24px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Delivery Reports</div>
              <div style={{ fontSize: 14, color: GRAY, marginTop: 4 }}>View delivery statistics and recipient details</div>
              <div style={{ position: "absolute", right: 18, top: 16, width: 30, height: 30, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: GRAY }}>×</div>
              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: "#DCFCE7", color: GREEN, fontWeight: 800, fontSize: 14 }}>Sent 12 Email Successful</div>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: "#F3F4F6", color: GRAY, fontWeight: 700, fontSize: 14 }}>Failed 0 Email</div>
              </div>
              {TEAM.slice(36, 42).map((r, i) => (
                <div key={r.name} style={{ marginTop: 10, height: 64, borderRadius: 10, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", opacity: fi(g, 92 + i * 5, 8) }}>
                  <Avatar t={r.av.t} s={36} c1={r.av.c1} c2={r.av.c2} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{r.name}</div><div style={{ fontSize: 13, color: GRAY }}>Email: {r.email}</div></div>
                  <div style={{ fontSize: 13, color: GRAY, textAlign: "right" }}>Sent Date: Oct 1, 2026<br />Time: 3:02 PM</div>
                </div>
              ))}
            </div>
          )}
          {cron > 0.01 && (
            <div style={{ position: "absolute", left: 500, top: 250, width: 600, height: 250, borderRadius: 16, background: "#fff", opacity: cron, zIndex: 45, boxShadow: "0 30px 80px #0007", padding: "20px 24px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 21, fontWeight: 800, color: INK }}>Cron Jobs</div>
              <div style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: "#374151" }}>Cron expression (Use UTC timezone)</div>
              <div style={{ marginTop: 8, height: 44, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: g >= 198 && g < 240 ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, color: expr ? INK : "#9CA3AF", fontFamily: "monospace" }}>{expr || "Enter cron expression"}</div>
              <div style={{ marginTop: 8, fontSize: 14.5, fontWeight: 700, color: GREEN, opacity: fi(g, 228, 8) }}>At 03:00 PM, only on Monday</div>
              <div style={{ position: "absolute", left: 24, bottom: 20, height: 40, padding: "0 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: INK, display: "flex", alignItems: "center" }}>Click to generate ↗</div>
              <div style={{ position: "absolute", right: 130, bottom: 20, width: 96, height: 40, borderRadius: 8, background: "#EF4444", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Cancel</div>
              <div style={{ position: "absolute", right: 24, bottom: 20, width: 96, height: 40, borderRadius: 8, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 250 && g < 256 ? 0.94 : 1})` }}>Save</div>
            </div>
          )}
          {g < 80 && <Toast g={g} at={14} text="Email sent to 12 learners" x={1150} y={60} />}
          <Toast g={g} at={256} text="Cron job saved · repeats every Monday" x={1060} y={60} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};


// ═══ t5 — one week later: completion moves up ═══════════════════════════════
const SceneWeekLater: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const mix = interpolate(g, [50, 140], [0, 1], { ...cl, easing: EZ });
  const lbl = Math.min(fi(g, 0, 10), fo(g, 44, 10));
  const camKeys: CamKey[] = [[0, 1000, 520, 1.3], [190, 1000, 520, 1.3]];
  return (
    <Stage>
      <PortalTag n={1} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/branch-leaderboard">
          <ProviderShell active="Leaderboard" bell={2}>
            <LeaderboardPage scroll={LB_MAX} mix={mix} updated={mix > 0.5 ? "Oct 8, 2026 · 8:01 AM" : "Oct 1, 2026 · 8:01 AM"} />
          </ProviderShell>
        </Browser>
      </CamC>
      {lbl > 0.01 && (
        <AbsoluteFill style={{ background: `rgba(4,6,13,${0.75 * lbl})`, alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: lbl, fontSize: 72, fontWeight: 900, color: "#F1F5F9", transform: `scale(${0.9 + 0.1 * lbl})` }}>One week later…</div>
        </AbsoluteFill>
      )}
    </Stage>
  );
};


// ═══ t6 — Generate Certificate (real flow: list → Select → template → Next →
// "User Information" form → Upload Certificate → All Certificates) ═════════
// Template names/descriptions from libs/shared/certificate/src/lib/templates.ts
const TEMPLATES = [
  { n: "Classic Blue", d: "Blue gradient certificate with a strong verified badge." },
  { n: "Gold Elegance", d: "Formal white and gold certificate for premium programs." },
  { n: "Modern Slate", d: "Clean dark header certificate with modern spacing." },
];
const CertificateArt: React.FC<{ w: number; h: number; tpl: number; name: string }> = ({ w, h, tpl, name }) => {
  const s = w / 600;
  const head = tpl === 0 ? "linear-gradient(120deg,#1D4ED8,#38BDF8)" : tpl === 2 ? "#1E293B" : "transparent";
  const ink = tpl === 1 ? "#92400E" : "#0F172A";
  return (
    <div style={{ width: w, height: h, borderRadius: 8 * s, background: "#fff", border: tpl === 1 ? `${4 * s}px double #D4A017` : `1px solid ${LINE}`, boxSizing: "border-box", position: "relative", overflow: "hidden", fontFamily: "Georgia, serif" }}>
      {tpl !== 1 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.26, background: head }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.08, textAlign: "center", fontSize: 18 * s, letterSpacing: 3 * s, color: tpl === 1 ? "#B45309" : "#fff", fontWeight: 700 }}>CERTIFICATE OF COMPLETION</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.33, textAlign: "center", fontSize: 13 * s, color: "#6B7280" }}>This certifies that</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.41, textAlign: "center", fontSize: 38 * s, color: ink, fontStyle: "italic" }}>{name}</div>
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: h * 0.62, textAlign: "center", fontSize: 13 * s, color: "#374151", lineHeight: 1.4 }}>has successfully completed {PROGRAM}</div>
      <div style={{ position: "absolute", left: w * 0.08, bottom: h * 0.09, fontSize: 11 * s, color: "#374151", borderTop: "1px solid #9CA3AF", paddingTop: 3 * s, fontFamily: FONT }}>{ADMIN} · Instructor</div>
      {tpl === 0 && <div style={{ position: "absolute", right: w * 0.07, bottom: h * 0.07, width: 64 * s, height: 64 * s, borderRadius: "50%", background: "#1D4ED8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 * s, fontWeight: 800, fontFamily: FONT, boxShadow: `0 0 0 ${4 * s}px #BFDBFE` }}>✓ VERIFIED</div>}
      {tpl === 1 && <div style={{ position: "absolute", right: w * 0.07, bottom: h * 0.07, width: 60 * s, height: 60 * s, borderRadius: "50%", background: "radial-gradient(circle,#FDE68A,#D4A017)", color: "#78350F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 * s }}>★</div>}
      <div style={{ position: "absolute", left: w * 0.08, bottom: h * 0.2, fontFamily: FONT }}><KeyLogo s={0.6 * s} /></div>
    </div>
  );
};
const SceneCertificate: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 430;
  const g = gt(f, dur, D);
  const page = g < 70 ? 0 : g < 190 ? 1 : g < 370 ? 2 : 3;
  const SEL = { x: MX(1215), y: MY(96 + 50 + 33) };
  const TPL2 = { x: MX(660), y: MY(560) };
  const NEXT = { x: MX(1265), y: MY(756) };
  const TESTI = { x: MX(340), y: MY(560) };
  const UPLOAD = { x: MX(140), y: MY(683) };
  const cur = path(g, [[0, 900, 600], [50, SEL.x, SEL.y], [62, SEL.x, SEL.y], [100, 800, 400], [130, TPL2.x, TPL2.y], [146, TPL2.x, TPL2.y], [172, NEXT.x, NEXT.y], [186, NEXT.x, NEXT.y], [240, TESTI.x, TESTI.y], [300, TESTI.x, TESTI.y], [346, UPLOAD.x, UPLOAD.y], [366, UPLOAD.x, UPLOAD.y], [430, UPLOAD.x + 300, UPLOAD.y - 300]]);
  const ripple = Math.max(rip(g, 60), rip(g, 140), rip(g, 182), rip(g, 244), rip(g, 360));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 1250, 250, 1.45], [64, 1250, 250, 1.45], [80, WIDE_X, WIDE_Y, 1.05], [96, 700, 300, 1.35], [124, 700, 560, 1.35], [176, 1200, 720, 1.4], [194, WIDE_X, WIDE_Y, 1.05], [216, 1180, 420, 1.3], [236, 560, 560, 1.35], [330, 560, 560, 1.35], [350, 400, 720, 1.45], [374, WIDE_X, 400, 1.1], [430, WIDE_X, 400, 1.1]];
  const tpl = g >= 142 ? 1 : 0;
  const certRows = [
    { id: "CERT-2026-1048", r: NINA, isNew: true },
    { id: "CERT-2026-1047", r: TEAM[37], isNew: false },
    { id: "CERT-2026-1046", r: TEAM[1], isNew: false },
    { id: "CERT-2026-1045", r: TEAM[2], isNew: false },
    { id: "CERT-2026-1044", r: TEAM[5], isNew: false },
  ];
  const prog = Math.round(100 * sp(g, 76, fps, { damping: 20 }));
  return (
    <Stage>
      <PortalTag n={4} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url={["branch.skillbnk.com/branch-generate-certificate", "branch.skillbnk.com/subcertificate", "branch.skillbnk.com/subcertificateuser", "branch.skillbnk.com/all-certificates"][page]}>
          <ProviderShell active={page === 3 ? "All Certificates" : "Generate Certificate"} bell={2}>
            {page === 0 && (
              <>
                <PageTitle t="Generate Certificate" sub="Generate certificates quickly and easily" back />
                <div style={{ position: "absolute", left: 760, top: 22, width: 300, height: 42, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, color: "#9CA3AF" }}>Search by student name…</div>
                <Btn x={1070} y={22} w={160} h={42} label="All Certificates" primary fs={14} />
                <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
                  <div style={{ height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
                  {[["ID", 20], ["Student Name", 90], ["Phone Number", 330], ["Email", 490], ["Program", 760], ["Session", 960], ["Action", 1170]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
                  {[NINA, TEAM[38], TEAM[0], TEAM[4], TEAM[9], TEAM[13], TEAM[21]].map((r, i) => (
                    <div key={r.name} style={{ position: "absolute", left: 0, top: 50 + i * 66, width: 1310, height: 66, borderBottom: `1px solid ${LINE}` }}>
                      <div style={{ position: "absolute", left: 20, top: 23, fontSize: 14, color: INK }}>{3120 - i * 7}</div>
                      <div style={{ position: "absolute", left: 90, top: 15, display: "flex", gap: 10, alignItems: "center", fontSize: 15, fontWeight: 700, color: INK }}><Avatar t={r.av.t} s={34} c1={r.av.c1} c2={r.av.c2} />{r.name}</div>
                      <div style={{ position: "absolute", left: 330, top: 23, fontSize: 14, color: INK }}>(206) 555-01{String(10 + TEAM.indexOf(r)).slice(-2)}</div>
                      <div style={{ position: "absolute", left: 490, top: 23, fontSize: 14, color: INK }}>{r.email}</div>
                      <div style={{ position: "absolute", left: 760, top: 20 }}><span style={{ fontSize: 12.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: BLUE_SOFT, color: BLUE }}>New Agent Launch</span></div>
                      <div style={{ position: "absolute", left: 960, top: 20 }}><span style={{ fontSize: 12.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "#F3F4F6", color: INK }}>{SESSION}</span></div>
                      <div style={{ position: "absolute", left: 1170, top: 16, height: 34, padding: "0 16px", borderRadius: 8, background: i === 0 && g >= 58 ? BLUE : BLUE_SOFT, color: i === 0 && g >= 58 ? "#fff" : BLUE, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>Select</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {page === 1 && (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 70, 10) }}>
                <PageTitle t="Generate Certificate" sub="Generate certificates quickly and easily" back />
                <div style={{ position: "absolute", left: 20, top: 90, width: 420, height: 300, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 22, boxSizing: "border-box" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Profile</div>
                  <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}><Avatar t={NINA.av.t} s={52} c1={NINA.av.c1} c2={NINA.av.c2} /><div><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{LEARNER}</div><div style={{ fontSize: 13.5, color: GRAY }}>ID 3120</div></div></div>
                  {[["Email", NINA.email], ["Phone Number", "(206) 555-0150"]].map(([k, v]) => <div key={k} style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 14, color: GRAY }}>{k}<b style={{ color: INK }}>{v}</b></div>)}
                </div>
                <div style={{ position: "absolute", left: 460, top: 90, width: 440, height: 300, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 22, boxSizing: "border-box" }}>
                  {[["Program", PROGRAM], ["Session", SESSION], ["Enrollment Date", "Sep 2, 2026"], ["Status", "Approved"]].map(([k, v], i) => <div key={k} style={{ marginTop: i ? 18 : 4, display: "flex", justifyContent: "space-between", fontSize: 14.5, color: GRAY }}>{k}<b style={{ color: INK, maxWidth: 250, textAlign: "right" }}>{v}</b></div>)}
                </div>
                <div style={{ position: "absolute", left: 920, top: 90, width: 410, height: 300, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 22, boxSizing: "border-box" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Progress</div>
                  <svg width="170" height="170" viewBox="0 0 170 170" style={{ position: "absolute", left: 120, top: 70 }}>
                    <circle cx="85" cy="85" r="70" fill="none" stroke="#DCFCE7" strokeWidth="14" />
                    <circle cx="85" cy="85" r="70" fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${4.4 * prog} 440`} transform="rotate(-90 85 85)" />
                    <text x="85" y="96" textAnchor="middle" fontSize="36" fontWeight="800" fill={INK} fontFamily={FONT}>{prog}%</text>
                  </svg>
                </div>
                <div style={{ position: "absolute", left: 20, top: 406, width: 1310, height: 310, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 22, boxSizing: "border-box" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Templates</div>
                  {TEMPLATES.map((t, i) => (
                    <div key={t.n} style={{ position: "absolute", left: 22 + i * 430, top: 52, width: 410, padding: 10, borderRadius: 12, border: `2px solid ${tpl === i ? BLUE : LINE}`, background: tpl === i ? BLUE_SOFT : "#fff", boxSizing: "border-box" }}>
                      <CertificateArt w={386} h={170} tpl={i} name={LEARNER} />
                      <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: tpl === i ? BLUE : INK }}>{tpl === i ? "✓ " : ""}{t.n}</div>
                      <div style={{ fontSize: 12, color: GRAY }}>{t.d}</div>
                    </div>
                  ))}
                </div>
                <Btn x={1210} y={734} w={110} h={44} label="Next" primary fs={15} press={g >= 182 && g < 188 ? 1 : 0} />
              </div>
            )}
            {page === 2 && (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 190, 10) }}>
                <PageTitle t="User Information" sub="Generate certificates quickly and easily" back />
                <Btn x={1220} y={22} w={110} h={42} label="Export" fs={14} />
                <div style={{ position: "absolute", left: 20, top: 90, width: 640, height: 700, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
                <Input x={40} y={106} w={290} label="User Name *" value={LEARNER} />
                <Input x={350} y={106} w={290} label="Instructor Name" value={ADMIN} />
                <Input x={40} y={190} w={290} label="Bootcamp *" value={PROGRAM} select fs={14} />
                <Input x={350} y={190} w={290} label="Session *" value={SESSION} select />
                <Input x={40} y={274} w={600} label="Details Line 1" value="Has successfully completed the program requirements" fs={14.5} />
                <Input x={40} y={358} w={600} label="Details Line 2" value="and has achieved outstanding results." fs={14.5} />
                <div style={{ position: "absolute", left: 40, top: 446, fontSize: 18, fontWeight: 800, color: INK }}>Testimonial <span style={{ color: "#EF4444" }}>*</span></div>
                <div style={{ position: "absolute", left: 40, top: 478, width: 600, height: 130, borderRadius: 8, border: `1px solid ${g >= 244 && g < 330 ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: g >= 244 && g < 330 ? "0 0 0 3px #C7D2FE" : "none", padding: "12px 14px", boxSizing: "border-box", fontSize: 15, color: INK, lineHeight: 1.5 }}>{typed(g, 248, "Jessica completed every module of the New Agent Launch Program. Welcome to the team!", 1.1) || <span style={{ color: "#9CA3AF" }}>Enter your testimonial here...</span>}</div>
                <div style={{ position: "absolute", left: 40, top: 640, width: 600, height: 1, background: LINE }} />
                <Btn x={40} y={660} w={200} h={46} label={g >= 362 ? "Uploading…" : "Upload Certificate"} soft fs={15} press={g >= 360 && g < 366 ? 1 : 0} />
                <div style={{ position: "absolute", left: 680, top: 90, width: 650, height: 470, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 20, boxSizing: "border-box" }}>
                  <CertificateArt w={610} h={420} tpl={1} name={LEARNER} />
                </div>
              </div>
            )}
            {page === 3 && (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 370, 10) }}>
                <PageTitle t="All Certificates" sub="Maintain the existing generated certificates" />
                <Btn x={1150} y={22} w={180} h={42} label="Generate Certificate" primary fs={14} />
                <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
                  <div style={{ height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
                  {[["Certificate ID", 24], ["Student Name", 230], ["Bootcamp", 520], ["Session", 820], ["Generated By", 990], ["Generated Date", 1160]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
                  {certRows.map((c, i) => {
                    const p = c.isNew ? sp(g, 380, fps) : 1;
                    return (
                      <div key={c.id} style={{ position: "absolute", left: 0, top: 50 + i * 66, width: 1310, height: 66, borderBottom: `1px solid ${LINE}`, background: c.isNew ? "rgba(220,252,231,0.8)" : "transparent", opacity: p, transform: c.isNew ? `translateX(${(1 - p) * 40}px)` : undefined }}>
                        <div style={{ position: "absolute", left: 24, top: 23, fontSize: 14.5, fontWeight: 700, color: INK }}>⧉ {c.id}</div>
                        <div style={{ position: "absolute", left: 230, top: 15, display: "flex", gap: 10, alignItems: "center", fontSize: 15, fontWeight: 700, color: INK }}><Avatar t={c.r.av.t} s={34} c1={c.r.av.c1} c2={c.r.av.c2} />{c.r.name}</div>
                        <div style={{ position: "absolute", left: 520, top: 23, fontSize: 14, color: INK }}>New Agent Launch</div>
                        <div style={{ position: "absolute", left: 820, top: 23, fontSize: 14, color: INK }}>{SESSION}</div>
                        <div style={{ position: "absolute", left: 990, top: 15, display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: INK }}><Avatar t="AT" s={30} />{ADMIN}</div>
                        <div style={{ position: "absolute", left: 1160, top: 15, fontSize: 14, color: INK, lineHeight: 1.35 }}>Oct {c.isNew ? 8 : 7 - i}, 2026<br /><span style={{ fontSize: 12.5, color: GRAY }}>{c.isNew ? "4:20 PM" : "11:05 AM"}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ProviderShell>
          <Toast g={g} at={368} text="Certificate uploaded" x={1180} y={60} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ t7 — WRAP ════════════════════════════════════════════════════════════════
const SceneWrap: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["🏢", "One course, every office", "Company portal", "#14B8A6"], ["✨", "Built with AI", "AI Curriculum Generator", "#7C3AED"], ["📊", "Track every agent", "Leaderboard + Certificates", "#22C55E"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 210, top: 360, width: 1500, display: "flex", gap: 40 }}>
          {steps.map(([ic, t, s, c], i) => {
            const p = sp(g, 20 + i * 16, fps);
            return (
              <div key={t} style={{ flex: 1, height: 250, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${c}88`, boxShadow: `0 0 50px ${c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56 }}>{ic}</div>
                <div style={{ marginTop: 14, fontSize: 36, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
                <div style={{ marginTop: 8, fontSize: 20, color: "#8A96B2" }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 56, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 90, 12), transform: `translateY(${(1 - fi(g, 90, 12)) * 20}px)` }}>
          Every office. <span style={{ color: "#5EEAD4" }}>One standard.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  r0: SceneHookRE, r1: SceneOffices, r2: SceneGenerate, r3: SceneReview, r4: SceneBulk, r5: SceneLeaderboard, r6: SceneBehind, r7: SceneCertificate, r8: SceneWrap,
};

export const RealEstateTrainingVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "r8" ? TAIL : 0);
        return (
          <Sequence key={k} from={STARTS[k]} durationInFrames={d}>
            <Scene f={frame - STARTS[k]} dur={d} fps={fps} />
          </Sequence>
        );
      })}
      {ALL.filter((k) => CARD_BEFORE[k]).map((k) => (
        <Sequence key={`card-${k}`} from={STARTS[k] - CARD_FRAMES} durationInFrames={CARD_FRAMES}>
          <PortalCard kind={CARD_BEFORE[k]!} />
        </Sequence>
      ))}
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}>
        <MainIntro />
      </Sequence>
      {ALL.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={`a-${k}`} from={STARTS[k]} durationInFrames={DURATIONS[k]}>
          <Audio src={staticFile(`realestate/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
