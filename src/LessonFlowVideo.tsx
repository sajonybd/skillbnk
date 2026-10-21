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

// ════════════════════════════════════════════════════════════════════════════
// LessonFlowVideo — "Create a Lesson, Present It, Assign It & Track It".
// Every screen verified in the skillBNK code (claude/skillbnk-code-facts.md):
//   Edit Course "Generate with AI" → AI Curriculum Generator (1 Sources & Settings,
//   2 Review Structure, 3 Generate & Link) → Slide Editor (Present) → presentation
//   mode → All Assignments "Create New Assignment" (Generate Assignment With AI,
//   Auto evaluation) → View Assignment Details (submissions) → Program leaderboard.
// ALL names and data are FICTIONAL (Crestview Sales Coaching).
// Voice: bash generate-voice-lesson.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  l0: 176,
  l1: 171,
  l2: 175,
  l3: 124,
  l4: 111,
  l5: 218,
  l6: 127,
  l7: 122,
  l8: 186,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"];

const PRE = ["l0"] as const; // hook, BEFORE the intro
const POST = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { l0: 230, l1: 360, l2: 420, l3: 330, l4: 210, l5: 450, l6: 300, l7: 230, l8: 190 };
const PACE: Record<Key, number> = { l0: 1, l1: 1.05, l2: 1.05, l3: 1.05, l4: 1, l5: 1.05, l6: 1.05, l7: 1.05, l8: 1 };
const LEN = {} as Record<Key, number>;
for (const k of ALL) LEN[k] = Math.max(DURATIONS[k], Math.round(DESIGN[k] * PACE[k]));

const STARTS = {} as Record<Key, number>;
let _pos = 0;
for (const k of PRE) { STARTS[k] = _pos; _pos += LEN[k]; }
const INTRO_START = _pos;
_pos += INTRO_FRAMES;
for (const k of POST) { STARTS[k] = _pos; _pos += LEN[k]; }
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
const ACADEMY = "Crestview Sales Coaching";
const ADMIN = "Jamie Brooks";
const PROGRAM = "Sales Conversations Program";
const SESSION = "Fall 2026 Cohort";
const COURSE = "Handling Price Objections";
const GROUP = "Fall Cohort · Group A";
const LEARNER = "Maya Lopez";
const EMAIL = "maya.lopez@example.com";
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
/** Crestview Sales Coaching logo (fictional brand, drawn in code) */
const KeyLogo: React.FC<{ sub?: string; s?: number; dark?: boolean }> = ({ sub = "Sales Coaching", s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#4C1D95" />
      <path d="M7 27l8-10 6 6 10-12" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="31" cy="11" r="3" fill="#FBBF24" />
    </svg>
    <div>
      <div style={{ fontSize: 15 * s, fontWeight: 900, color: dark ? "#fff" : "#4C1D95", letterSpacing: 0.8 }}>CRESTVIEW</div>
      <div style={{ fontSize: 10.5 * s, fontWeight: 600, color: dark ? "#CBD5E1" : GRAY, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);
const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 38, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.37, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
const JORDAN_AV = { t: "ML", c1: "#F472B6", c2: "#DB2777" };
const RACHEL_AV = { t: "JB", c1: "#7C3AED", c2: "#5B21B6" };
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
  { t: "Dashboard" }, { t: "Leaderboard" }, { t: "Students Management", open: true }, { t: "Approved Members", child: true }, { t: "Assignments", child: true },
  { t: "Courses & Programs", open: true }, { t: "Programs", child: true }, { t: "Courses", child: true },
  { t: "Content Management", open: true }, { t: "Slides", child: true },
  { t: "Communication", more: true }, { t: "Attendance", more: true }, { t: "Institute Settings" },
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
      <div style={{ position: "absolute", left: 52, top: 11, height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK, fontWeight: 700 }}>🎯 {ACADEMY}</div>
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

const Dim2: React.FC<{ o: number }> = ({ o }) => (o > 0.01 ? <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * o})`, zIndex: 40 }} /> : null);
const LEARNERS = [
  { n: LEARNER, av: JORDAN_AV }, { n: "Ben Carter", av: { t: "BC", c1: "#38BDF8", c2: "#0284C7" } }, { n: "Lila Park", av: { t: "LP", c1: "#34D399", c2: "#059669" } },
  { n: "Omar Haddad", av: { t: "OH", c1: "#FBBF24", c2: "#D97706" } }, { n: "Grace Kim", av: { t: "GK", c1: "#A78BFA", c2: "#7C3AED" } }, { n: "Tyler Ross", av: { t: "TR", c1: "#F87171", c2: "#DC2626" } },
  { n: "Ivy Chen", av: { t: "IC", c1: "#2DD4BF", c2: "#0D9488" } }, { n: "Sam Ortiz", av: { t: "SO", c1: "#FB923C", c2: "#EA580C" } },
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
  { ch: "Why buyers push back on price", ls: [["Slide", "The real reasons behind “too expensive”"], ["Video", "Coach demo: a price objection call"], ["Quiz", "Spot the objection"]] },
  { ch: "The 4-step response", ls: [["Slide", "Acknowledge, ask, show value, offer options"], ["Document", "Objection response script"], ["Assignment", "Respond to 3 common objections"]] },
  { ch: "Practice", ls: [["Quiz", "Choose the best reply"], ["Assignment", "Role-play: the discount request"]] },
];
const PROMPT = "A short course for new sales reps on handling price objections: acknowledge, ask questions, show value and offer options. Include practice and role-play.";

// ═══ l0 — HOOK ═══════════════════════════════════════════════════════════════
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const apps = [
    { ic: "📝", t: "Docs", s: "write the lesson", c: "#2563EB", at: 10 },
    { ic: "📊", t: "Slides app", s: "present it", c: "#F59E0B", at: 45 },
    { ic: "✉️", t: "Email", s: "assign it", c: "#EF4444", at: 80 },
    { ic: "▦", t: "Spreadsheet", s: "track it", c: "#16A34A", at: 115 },
  ];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        {apps.map((a, i) => {
          const p = sp(g, a.at, fps, { damping: 12 });
          const x = 190 + i * 400 + Math.sin((g + i * 30) / 25) * 10;
          const y = 260 + Math.cos((g + i * 50) / 30) * 14 + (i % 2) * 40;
          return (
            <div key={a.t} style={{ position: "absolute", left: x, top: y, width: 330, height: 300, borderRadius: 24, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${a.c}88`, boxShadow: `0 0 40px ${a.c}33`, opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${(i - 1.5) * 3}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ fontSize: 90, color: a.c }}>{a.ic}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{a.t}</div>
              <div style={{ fontSize: 21, color: "#8A96B2" }}>to {a.s}</div>
            </div>
          );
        })}
        <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1, 2].map((i) => <path key={i} d={`M ${520 + i * 400} ${420 + (i % 2) * 20} q 35 -60 70 0`} stroke="#F97316" strokeWidth="3" fill="none" strokeDasharray="8 10" opacity={fi(g, 140 + i * 8, 10) * 0.8} />)}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", opacity: fi(g, 150, 14) }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#FCA5A5" }}>Four tools. Four logins. One tired coach.</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

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
      <PortalTag n={1} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onGen ? "branch.skillbnk.com/subprogram?step=sources" : "branch.skillbnk.com/courses/handling-price-objections/edit"}>
          <ProviderShell active="Courses" bell={2}>
            {!onGen ? (
              <>
                <PageTitle t={`Edit Course · ${COURSE}`} sub="Modify course settings and preferences" />
                <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 100, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
                  <div style={{ position: "absolute", left: 14, top: 12, width: 134, height: 76, borderRadius: 8, background: "linear-gradient(135deg,#4C1D95,#7C3AED)", color: "#fff", fontSize: 12, fontWeight: 900, padding: 10, boxSizing: "border-box" }}>{COURSE}</div>
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
      <PortalTag n={1} label="Training provider portal" url="admin view" />
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

// ═══ l3 — Slide Editor: edit the title → Present ═════════════════════════════
const SLIDE_TITLE_OLD = "Acknowledge, ask, show value, offer options";
const SLIDE_TITLE_NEW = "4 steps to handle “too expensive”";
const SlideArt: React.FC<{ w: number; title: string; idx: number; caret?: boolean; sel?: boolean }> = ({ w, title, idx, caret, sel }) => {
  const s = w / 1920;
  const h = w * 9 / 16;
  const bodies = [
    ["Price is rarely the real objection", "Ask what “expensive” is compared to", "Listen for risk, timing or value"],
    ["1 · Acknowledge the concern", "2 · Ask one clarifying question", "3 · Show the value that matters to them", "4 · Offer options, not discounts"],
    ["Role-play: “Can you do 20% off?”", "Use the 4 steps out loud", "Swap roles and give feedback"],
  ][idx];
  return (
    <div style={{ width: w, height: h, background: idx === 1 ? "#FFFFFF" : "linear-gradient(135deg,#4C1D95,#7C3AED)", position: "relative", overflow: "hidden", fontFamily: FONT, boxShadow: "0 10px 30px #0003" }}>
      {idx === 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 24 * s, height: h, background: "#7C3AED" }} />}
      <div style={{ position: "absolute", left: 140 * s, top: 130 * s, right: 140 * s, fontSize: 92 * s, fontWeight: 900, color: idx === 1 ? "#1F1147" : "#fff", lineHeight: 1.1, outline: sel ? `${Math.max(2, 4 * s)}px dashed #2563EB` : "none", outlineOffset: 10 * s }}>{title}{caret && <span style={{ color: "#2563EB" }}>|</span>}</div>
      {bodies.map((b, i) => <div key={b} style={{ position: "absolute", left: 160 * s, top: (430 + i * 120) * s, fontSize: 52 * s, color: idx === 1 ? "#374151" : "#EDE9FE", fontWeight: 600 }}>{idx === 1 ? "" : "• "}{b}</div>)}
      <div style={{ position: "absolute", right: 100 * s, bottom: 70 * s, fontSize: 34 * s, color: idx === 1 ? "#7C3AED" : "#DDD6FE", fontWeight: 800 }}>{ACADEMY}</div>
    </div>
  );
};
const SceneSlides: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const sel = g >= 70 && g < 250;
  const deleting = interpolate(g, [110, 140], [SLIDE_TITLE_OLD.length, 0], cl);
  const title = g < 110 ? SLIDE_TITLE_OLD : g < 145 ? SLIDE_TITLE_OLD.slice(0, Math.round(deleting)) : typed(g, 148, SLIDE_TITLE_NEW, 0.8);
  const TITLE = { x: MX(560), y: MY(240) };
  const PRESENT = { x: MX(1037), y: MY(32) };
  const SAVE = { x: MX(1196), y: MY(32) };
  const cur = path(g, [[0, 900, 600], [60, TITLE.x, TITLE.y], [74, TITLE.x, TITLE.y], [196, TITLE.x, TITLE.y], [222, SAVE.x, SAVE.y], [236, SAVE.x, SAVE.y], [290, PRESENT.x, PRESENT.y], [330, PRESENT.x, PRESENT.y]]);
  const ripple = Math.max(rip(g, 70), rip(g, 104), rip(g, 232), rip(g, 300));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [40, 750, 360, 1.25], [64, 760, 300, 1.55], [200, 760, 300, 1.55], [216, 1350, 110, 1.6], [240, 1350, 110, 1.6], [260, WIDE_X, WIDE_Y, 1.05], [280, 1250, 110, 1.6], [330, 1250, 110, 1.6]];
  const tools = ["Elements", "Text", "Draw", "Media", "Templates", "AI", "Actions"];
  return (
    <Stage>
      <PortalTag n={2} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/slidev2">
          <ProviderShell active="Slides" bell={2}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1350, height: 64, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", boxSizing: "border-box" }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: INK, marginRight: 10 }}>Slide Editor</span>
              {["↶", "↷", "⤓ Export"].map((t) => <span key={t} style={{ height: 34, padding: "0 10px", borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: INK, display: "flex", alignItems: "center" }}>{t}</span>)}
              <span style={{ marginLeft: 14, height: 34, width: 330, borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 13.5, color: INK, display: "flex", alignItems: "center", padding: "0 10px", overflow: "hidden", whiteSpace: "nowrap" }}>Slide 2 · The 4-step response</span>
              <span style={{ flex: 1 }} />
              <span style={{ height: 34, padding: "0 14px", borderRadius: 7, background: INK, color: "#fff", fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", transform: `scale(${g >= 300 && g < 306 ? 0.92 : 1})` }}>▶ Present</span>
              <span style={{ height: 34, padding: "0 14px", borderRadius: 7, background: INK, color: "#fff", fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center" }}>Clear</span>
              <span style={{ height: 34, padding: "0 14px", borderRadius: 7, background: INK, color: "#fff", fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", transform: `scale(${g >= 232 && g < 238 ? 0.92 : 1})` }}>💾 Save</span>
            </div>
            <div style={{ position: "absolute", left: 0, top: 64, width: 78, height: 732, background: "#fff", borderRight: `1px solid ${LINE}` }}>
              {tools.map((t, i) => <div key={t} style={{ height: 66, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: i === 1 ? BLUE : "#4B5563", background: i === 1 ? BLUE_SOFT : "transparent" }}><span style={{ fontSize: 18 }}>{["▢", "T", "✎", "🖼", "▤", "✨", "⚙"][i]}</span>{t}</div>)}
            </div>
            <div style={{ position: "absolute", left: 78, top: 64, width: 210, height: 732, background: "#FAFAFB", borderRight: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Text Elements</div>
              {["Add Heading 1", "Add Heading 2", "Add Heading 3", "Add Text", "Add Quote"].map((t, i) => <div key={t} style={{ marginTop: 10, height: 44, borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 10px", fontSize: [17, 15, 14, 13, 13][i], fontWeight: [800, 700, 700, 500, 500][i], color: INK, fontStyle: i === 4 ? "italic" : "normal" }}>{t}</div>)}
            </div>
            <div style={{ position: "absolute", left: 300, top: 84, width: 880, height: 495, background: "#E5E7EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SlideArt w={840} title={title} idx={1} caret={g >= 104 && g < 200} sel={sel} />
            </div>
            <div style={{ position: "absolute", left: 1192, top: 84, width: 146, height: 690, display: "flex", flexDirection: "column", gap: 12 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ borderRadius: 6, border: `2px solid ${i === 1 ? BLUE : "transparent"}`, overflow: "hidden" }}><SlideArt w={140} title={i === 1 ? title : ["Why buyers push back on price", "", "Practice time"][i]} idx={i} /></div>)}
            </div>
            <div style={{ position: "absolute", left: 300, top: 596, width: 880, height: 180, borderRadius: 8, background: "#fff", border: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box", opacity: sel ? 1 : 0.6 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Properties</div>
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                {["Font · Inter", "Size · 92", "Weight · Bold", "Color · #1F1147"].map((t) => <span key={t} style={{ height: 34, padding: "0 12px", borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 13, color: INK, display: "flex", alignItems: "center" }}>{t}</span>)}
              </div>
            </div>
          </ProviderShell>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ l4 — presentation mode (full screen) ════════════════════════════════════
const ScenePresent: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 210;
  const g = gt(f, dur, D);
  const slide = g < 80 ? 0 : g < 150 ? 1 : 2;
  const at = [0, 80, 150][slide];
  const inP = interpolate(g, [at, at + 16], [1, 0], { ...cl, easing: EZ });
  const titles = ["Why buyers push back on price", SLIDE_TITLE_NEW, "Practice time"];
  return (
    <AbsoluteFill style={{ background: "#000", opacity: fi(g, 0, 10) * fo(g, D - 8, 8) }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${inP * 1920}px)` }}>
        <SlideArt w={1920} title={titles[slide]} idx={slide} />
      </div>
      <div style={{ position: "absolute", right: 30, top: 24, padding: "10px 16px", borderRadius: 8, background: "#ffffff22", color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: FONT, opacity: 0.85 }}>✕ Close Presentation</div>
    </AbsoluteFill>
  );
};

// ═══ l5 — All Assignments → Create New Assignment (AI questions, auto grading)
const QUESTIONS: { q: string; t: string; opts?: string[]; correct?: number }[] = [
  { q: "A buyer says “It's too expensive.” What should you do first?", t: "Single choice", opts: ["Offer a discount", "Acknowledge the concern", "Change the subject", "End the call"], correct: 1 },
  { q: "Which questions help you understand the objection? (pick 2)", t: "Multiple choice", opts: ["Compared to what?", "Why are you wrong?", "What would make it worth it?", "Can I call later?"] },
  { q: "Write how you would respond to “Can you do 20% off?”", t: "Paragraph" },
];
const SceneAssign: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 450;
  const g = gt(f, dur, D);
  const mo = fi(g, 30, 10);
  const saved = g >= 400;
  const CREATE = { x: MX(1215), y: MY(43) };
  const TITLE = { x: 550, y: 202 };
  const GRPSEL = { x: 1050, y: 202 };
  const AIBOX = { x: 800, y: 368 };
  const AIGEN = { x: 1225, y: 368 };
  const GRADE = { x: 470, y: 286 };
  const SAVE = { x: 1235, y: 790 };
  const cur = path(g, [[0, 900, 500], [20, CREATE.x, CREATE.y], [30, CREATE.x, CREATE.y], [48, TITLE.x, TITLE.y], [94, TITLE.x, TITLE.y], [106, GRPSEL.x, GRPSEL.y], [120, GRPSEL.x, GRPSEL.y], [136, GRADE.x, GRADE.y], [148, GRADE.x, GRADE.y], [166, AIBOX.x, AIBOX.y], [230, AIBOX.x, AIBOX.y], [244, AIGEN.x, AIGEN.y], [256, AIGEN.x, AIGEN.y], [360, 900, 600], [384, SAVE.x, SAVE.y], [450, SAVE.x, SAVE.y]]);
  const ripple = Math.max(rip(g, 26), rip(g, 50), rip(g, 110), rip(g, 140), rip(g, 168), rip(g, 250), rip(g, 392));
  const qShown = (i: number) => sp(g, 264 + i * 16, fps);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [16, 1350, 120, 1.5], [30, 1350, 120, 1.5], [44, 800, 300, 1.35], [150, 800, 300, 1.35], [164, 900, 400, 1.35], [250, 900, 400, 1.35], [266, 800, 560, 1.2], [370, 800, 560, 1.2], [384, 1150, 720, 1.4], [404, 1150, 720, 1.4], [420, WIDE_X, WIDE_Y, 1.05], [450, WIDE_X, WIDE_Y, 1.05]];
  const rows = [
    { id: "A-1052", n: "Respond to 3 common objections", grp: GROUP, mk: 30, sub: 0, isNew: true },
    { id: "A-1048", n: "Discovery call checklist", grp: GROUP, mk: 20, sub: 16, isNew: false },
    { id: "A-1041", n: "Value statement draft", grp: GROUP, mk: 25, sub: 18, isNew: false },
    { id: "A-1036", n: "Cold email rewrite", grp: "Fall Cohort · Group B", mk: 20, sub: 14, isNew: false },
  ];
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/all-assignments">
          <ProviderShell active="Assignments" bell={2}>
            <PageTitle t="All Assignments" sub="List of all assignments available" />
            <Btn x={1100} y={22} w={230} h={42} label="+ Create New Assignment" primary fs={14} press={g >= 26 && g < 32 ? 1 : 0} />
            <div style={{ position: "absolute", left: 20, top: 84, width: 1310, height: 700, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              <div style={{ height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
              {[["ID", 20], ["Assignment", 120], ["Groups", 520], ["Mark", 760], ["Submissions", 860], ["Status", 1000], ["Created At", 1110], ["Action", 1240]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
              {rows.filter((r) => !r.isNew || saved).map((r, i) => {
                const p = r.isNew ? sp(g, 404, fps) : 1;
                return (
                  <div key={r.id} style={{ position: "absolute", left: 0, top: 50 + i * 64, width: 1310, height: 64, borderBottom: `1px solid ${LINE}`, background: r.isNew ? "rgba(220,252,231,0.8)" : "transparent", opacity: p }}>
                    <div style={{ position: "absolute", left: 20, top: 22, fontSize: 14, color: GRAY }}>{r.id}</div>
                    <div style={{ position: "absolute", left: 120, top: 21, fontSize: 15, fontWeight: 700, color: INK }}>{r.n}</div>
                    <div style={{ position: "absolute", left: 520, top: 19 }}><Badge t={r.grp} c={BLUE} bg={BLUE_SOFT} fs={12.5} /></div>
                    <div style={{ position: "absolute", left: 770, top: 21, fontSize: 15, fontWeight: 700, color: INK }}>{r.mk}</div>
                    <div style={{ position: "absolute", left: 880, top: 21, fontSize: 15, fontWeight: 700, color: INK }}>{r.sub}</div>
                    <div style={{ position: "absolute", left: 1000, top: 19 }}><Badge t="Active" c={GREEN} bg="#DCFCE7" dot fs={12.5} /></div>
                    <div style={{ position: "absolute", left: 1110, top: 21, fontSize: 14, color: INK }}>{r.isNew ? "Oct 1, 2026" : ["Sep 24, 2026", "Sep 17, 2026", "Sep 10, 2026"][i - (saved ? 1 : 0)]}</div>
                    <div style={{ position: "absolute", left: 1240, top: 15, display: "flex", gap: 6 }}><IconBtn t="✎" /><IconBtn t="⋮" bg="#fff" c={GRAY} /></div>
                  </div>
                );
              })}
            </div>
          </ProviderShell>
          {!saved && <Dim2 o={mo} />}
          {!saved && mo > 0.01 && (
            <div style={{ position: "absolute", left: 280, top: 30, width: 1040, height: 800, borderRadius: 16, background: "#fff", opacity: mo, zIndex: 45, boxShadow: "0 30px 80px #0007", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 22, top: 18, fontSize: 22, fontWeight: 800, color: INK }}>Create New Assignment</div>
              <div style={{ position: "absolute", right: 20, top: 18, width: 30, height: 30, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: GRAY }}>×</div>
              <div style={{ position: "absolute", left: 0, top: 0, width: 1040, height: 800 }}>
                <div style={{ position: "absolute", left: -280, top: -30 }}>
                  <Input x={300} y={150} w={500} label="Assignment Title" value={typed(g, 52, "Respond to 3 common objections", 0.8)} ph="Enter assignment title" glow={g >= 48 && g < 96 ? 1 : 0} />
                  <Input x={820} y={150} w={480} label="Groups" value={g >= 114 ? GROUP : ""} ph="Search Groups" select glow={g >= 108 && g < 120 ? 1 : 0} />
                  <Input x={300} y={234} w={340} label="Grading mode" value={g >= 144 ? "Auto evaluation" : "Manual"} select glow={g >= 138 && g < 150 ? 1 : 0} />
                  <Input x={660} y={234} w={200} label="Total marks" value={g >= 290 ? "30" : "0"} />
                  <Input x={880} y={234} w={200} label="Pass Mark" value="18" />
                  <div style={{ position: "absolute", left: 1100, top: 234, fontSize: 14.5, fontWeight: 600, color: "#374151" }}>Active Status</div>
                  <div style={{ position: "absolute", left: 1100, top: 270 }}><Toggle on={1} /></div>
                  <div style={{ position: "absolute", left: 300, top: 320, width: 1000, height: 96, borderRadius: 12, border: "1px solid #DDD6FE", background: "linear-gradient(90deg,#F5F3FF,#EFF6FF)", padding: "12px 16px", boxSizing: "border-box" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#5B21B6" }}>✨ Generate Assignment With AI</div>
                    <div style={{ position: "absolute", left: 16, top: 40, width: 800, height: 40, borderRadius: 8, border: `1px solid ${g >= 166 && g < 240 ? "#A5B4FC" : "#D1D5DB"}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: g >= 170 ? INK : "#9CA3AF", boxSizing: "border-box" }}>{typed(g, 170, "3 questions on handling price objections: the first step, discovery questions, and a written reply.", 1.6) || "Enter instructions for AI generation"}</div>
                    <div style={{ position: "absolute", right: 16, top: 40, width: 140, height: 40, borderRadius: 8, background: "#7C3AED", color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 250 && g < 256 ? 0.94 : 1})` }}>{g >= 252 && g < 264 ? "Generating…" : "✨ Generate"}</div>
                  </div>
                  <div style={{ position: "absolute", left: 300, top: 430, fontSize: 16, fontWeight: 800, color: INK }}>Questions</div>
                  {QUESTIONS.map((q, i) => {
                    const p = qShown(i);
                    return (
                      <div key={q.q} style={{ position: "absolute", left: 300, top: 460 + i * (q.opts ? 104 : 74) - (i === 2 ? 0 : 0), width: 1000, borderRadius: 10, border: `1px solid ${LINE}`, background: "#FAFAFB", padding: "10px 14px", boxSizing: "border-box", opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#CBD5E1" }}>⋮⋮</span><span style={{ fontSize: 14.5, fontWeight: 700, color: INK, flex: 1 }}>{i + 1}. {q.q}</span><Badge t={q.t} c="#5B21B6" bg="#F3E8FF" fs={11.5} /><span style={{ fontSize: 13, color: GRAY }}>Mark 10</span></div>
                        {q.opts && <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>{q.opts.map((o, k) => <span key={o} style={{ fontSize: 12.5, padding: "4px 10px", borderRadius: 6, border: `1px solid ${(q.correct === k || (q.t === "Multiple choice" && (k === 0 || k === 2))) ? "#86EFAC" : LINE}`, background: (q.correct === k || (q.t === "Multiple choice" && (k === 0 || k === 2))) ? "#F0FDF4" : "#fff", color: INK }}>{(q.correct === k || (q.t === "Multiple choice" && (k === 0 || k === 2))) ? "✓ " : ""}{o}</span>)}</div>}
                      </div>
                    );
                  })}
                  <Btn x={1050} y={770} w={110} h={42} label="Cancel" fs={14.5} />
                  <Btn x={1170} y={770} w={130} h={42} label="Save" primary fs={14.5} press={g >= 390 && g < 396 ? 1 : 0} />
                </div>
              </div>
            </div>
          )}
          {g >= 266 && g < 360 && <Toast g={g} at={266} text="AI questions added" x={1180} y={60} />}
          <Toast g={g} at={402} text="Successfully assignment created" x={1080} y={60} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ l6 — View Assignment Details: submissions come back in one list ════════
const SUBS = [
  { r: LEARNERS[0], d: "Oct 3, 2026 · 9:14 AM", st: "Passed", mk: 28, rv: "Auto graded", by: "System" },
  { r: LEARNERS[1], d: "Oct 3, 2026 · 10:02 AM", st: "Passed", mk: 26, rv: "Auto graded", by: "System" },
  { r: LEARNERS[2], d: "Oct 3, 2026 · 11:40 AM", st: "Passed", mk: 24, rv: "Reviewed", by: ADMIN },
  { r: LEARNERS[3], d: "Oct 3, 2026 · 1:25 PM", st: "Pending review", mk: 18, rv: "Manual review", by: "—" },
  { r: LEARNERS[4], d: "Oct 3, 2026 · 2:58 PM", st: "Passed", mk: 22, rv: "Auto graded", by: "System" },
  { r: LEARNERS[5], d: "Oct 3, 2026 · 4:10 PM", st: "Failed", mk: 14, rv: "Auto graded", by: "System" },
  { r: LEARNERS[6], d: "Oct 3, 2026 · 5:33 PM", st: "Passed", mk: 21, rv: "Auto graded", by: "System" },
];
const SceneSubmissions: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1.05], [30, 800, 200, 1.45], [90, 800, 200, 1.45], [110, 800, 470, 1.25], [300, 800, 470, 1.25]];
  const ord = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;
  const ranked = [...SUBS].sort((a, b) => b.mk - a.mk);
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/all-assignments/a-1052">
          <ProviderShell active="Assignments" bell={2}>
            <PageTitle t="View Assignment Details" sub="Question, answers, and all submission details" back />
            {[["Total submissions", `${Math.min(SUBS.length, Math.floor(interpolate(g, [20, 120], [0, SUBS.length], cl)))}`], ["Average mark", "21.9 / 30"], ["Pass mark", "18"]].map(([k, v], i) => (
              <div key={k} style={{ position: "absolute", left: 20 + i * 330, top: 86, width: 310, height: 96, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "14px 20px", boxSizing: "border-box" }}>
                <div style={{ fontSize: 14, color: GRAY, fontWeight: 600 }}>{k}</div><div style={{ fontSize: 30, fontWeight: 800, color: INK, marginTop: 4 }}>{v}</div>
              </div>
            ))}
            <div style={{ position: "absolute", left: 1010, top: 86, width: 320, height: 96, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "14px 20px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 14, color: GRAY, fontWeight: 600 }}>Assignment</div><div style={{ fontSize: 16, fontWeight: 800, color: INK, marginTop: 6 }}>Respond to 3 common objections</div>
            </div>
            <div style={{ position: "absolute", left: 20, top: 198, width: 1310, height: 588, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 20, top: 14, fontSize: 18, fontWeight: 800, color: INK }}>Assignment Submissions</div>
              <div style={{ position: "absolute", left: 0, top: 50, width: 1310, height: 44, background: "#F9FAFB", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }} />
              {[["Submitted By", 20], ["Submission Date", 260], ["Status", 480], ["Mark", 640], ["Review", 740], ["Reviewed By", 900], ["Rank", 1060], ["Actions", 1160]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 63, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
              {SUBS.map((s, i) => {
                const p = sp(g, 20 + i * 14, fps);
                const rank = ranked.indexOf(s) + 1;
                const stc = s.st === "Passed" ? [GREEN, "#DCFCE7"] : s.st === "Failed" ? ["#DC2626", "#FEE2E2"] : ["#C2410C", "#FFEDD5"];
                return (
                  <div key={s.r.n} style={{ position: "absolute", left: 0, top: 94 + i * 64, width: 1310, height: 64, borderBottom: `1px solid ${LINE}`, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
                    <div style={{ position: "absolute", left: 20, top: 14, display: "flex", gap: 10, alignItems: "center", fontSize: 15, fontWeight: 700, color: INK }}><Avatar t={s.r.av.t} s={34} c1={s.r.av.c1} c2={s.r.av.c2} />{s.r.n}</div>
                    <div style={{ position: "absolute", left: 260, top: 22, fontSize: 13.5, color: INK }}>{s.d}</div>
                    <div style={{ position: "absolute", left: 480, top: 19 }}><Badge t={s.st} c={stc[0]} bg={stc[1]} dot fs={12.5} /></div>
                    <div style={{ position: "absolute", left: 640, top: 21, fontSize: 15, fontWeight: 800, color: INK }}>{s.mk}/30</div>
                    <div style={{ position: "absolute", left: 740, top: 21, fontSize: 13.5, color: s.rv === "Manual review" ? "#C2410C" : GRAY, fontWeight: 600 }}>{s.rv}</div>
                    <div style={{ position: "absolute", left: 900, top: 21, fontSize: 13.5, color: INK }}>{s.by}</div>
                    <div style={{ position: "absolute", left: 1060, top: 21, fontSize: 14, fontWeight: 700, color: INK }}>{ord(rank)}</div>
                    <div style={{ position: "absolute", left: 1160, top: 15, height: 34, padding: "0 12px", borderRadius: 8, background: BLUE_SOFT, color: BLUE, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center" }}>View Details</div>
                  </div>
                );
              })}
            </div>
          </ProviderShell>
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ l7 — Program leaderboard: Recalculate all → progress updates ═══════════
const SceneProgress: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const confirm = g >= 50 && g < 96 ? Math.min(fi(g, 50, 6), fo(g, 90, 6)) : 0;
  const mix = interpolate(g, [104, 170], [0, 1], { ...cl, easing: EZ });
  const RECALC = { x: MX(1245), y: MY(116) };
  const OK = { x: 986, y: 540 };
  const cur = path(g, [[0, 900, 500], [36, RECALC.x, RECALC.y], [48, RECALC.x, RECALC.y], [70, OK.x, OK.y], [92, OK.x, OK.y], [230, 1000, 700]]);
  const base = [62, 58, 55, 51, 48, 44, 41, 37];
  const after = [86, 82, 79, 74, 71, 66, 62, 52];
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1.05], [24, 1250, 140, 1.5], [48, 1250, 140, 1.5], [58, WIDE_X, 430, 1.1], [96, WIDE_X, 430, 1.1], [110, 760, 430, 1.3], [230, 760, 430, 1.3]];
  return (
    <Stage>
      <PortalTag n={4} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/branch-leaderboard">
          <ProviderShell active="Leaderboard" bell={2}>
            <PageTitle t="Program leaderboard" sub="Compare learner progress for a selected program and session." />
            <div style={{ position: "absolute", left: 20, top: 84, width: 1310, height: 64, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
            <Input x={40} y={94} w={520} value={PROGRAM} select />
            <Input x={580} y={94} w={420} value={SESSION} select />
            <Btn x={1020} y={94} w={140} h={44} label="View results" primary fs={14.5} />
            <Btn x={1170} y={94} w={150} h={44} label={g >= 92 && g < 104 ? "Recalculating" : "⟳ Recalculate all"} fs={14} press={g >= 46 && g < 52 ? 1 : 0} />
            <div style={{ position: "absolute", left: 20, top: 164, width: 1310, height: 110 + 8 * 56, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 20, top: 14, fontSize: 18, fontWeight: 800, color: INK }}>🏆 Top 10 learners</div>
              <div style={{ position: "absolute", left: 20, top: 42, fontSize: 13.5, color: GRAY }}>{PROGRAM} · {SESSION} · 8 of 8 learners</div>
              <div style={{ position: "absolute", right: 20, top: 18, fontSize: 13.5, color: GRAY }}>Updated {mix > 0.5 ? "Oct 4, 2026 · 9:02 AM" : "Oct 1, 2026 · 8:01 AM"}</div>
              <div style={{ position: "absolute", left: 0, top: 70, width: 1310, height: 40, background: "#F9FAFB", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }} />
              {[["Rank", 24], ["Learner", 100], ["Completion", 520], ["Points", 800], ["Performance", 930], ["Action", 1190]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 81, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
              {LEARNERS.map((r, i) => {
                const c = Math.round(base[i] + (after[i] - base[i]) * mix);
                const pts = c * 12;
                return (
                  <div key={r.n} style={{ position: "absolute", left: 0, top: 110 + i * 56, width: 1310, height: 56, borderBottom: `1px solid ${LINE}` }}>
                    <div style={{ position: "absolute", left: 22, top: 13, width: 32, height: 30, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, background: i < 3 ? ["#FEF3C7", "#EEF2FF", "#ECFEFF"][i] : "transparent", color: i < 3 ? ["#B45309", "#4338CA", "#0E7490"][i] : INK }}>{i + 1}</div>
                    <div style={{ position: "absolute", left: 100, top: 9, display: "flex", gap: 10, alignItems: "center" }}><Avatar t={r.av.t} s={36} c1={r.av.c1} c2={r.av.c2} /><div><div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{r.n}</div><div style={{ fontSize: 12.5, color: GRAY }}>{c}% · {pts.toLocaleString()} pts</div></div></div>
                    <div style={{ position: "absolute", left: 520, top: 21, width: 200, height: 8, borderRadius: 4, background: "#E5E7EB" }}><div style={{ width: `${c}%`, height: 8, borderRadius: 4, background: BLUE }} /></div>
                    <div style={{ position: "absolute", left: 732, top: 16, fontSize: 14, fontWeight: 700, color: INK }}>{c}%</div>
                    <div style={{ position: "absolute", left: 800, top: 16, fontSize: 15, fontWeight: 700, color: INK }}>{pts.toLocaleString()}</div>
                    <div style={{ position: "absolute", left: 930, top: 14 }}>{c >= 80 ? <Badge t="✦ Outstanding" c="#047857" bg="#ECFDF5" fs={12} /> : c >= 60 ? <Badge t="🏅 Good" c="#C2410C" bg="#FFF7ED" fs={12} /> : <Badge t="⚠ Needs attention" c="#B91C1C" bg="#FEF2F2" fs={12} />}</div>
                    <div style={{ position: "absolute", left: 1180, top: 11, height: 34, padding: "0 12px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 700, color: INK, display: "flex", alignItems: "center" }}>View progress</div>
                  </div>
                );
              })}
            </div>
          </ProviderShell>
          <Dim2 o={confirm} />
          {confirm > 0.01 && (
            <div style={{ position: "absolute", left: 520, top: 330, width: 560, height: 250, borderRadius: 14, background: "#fff", opacity: confirm, zIndex: 45, boxShadow: "0 30px 80px #0007", padding: "22px 24px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Recalculate all progress?</div>
              <div style={{ marginTop: 10, fontSize: 15, color: GRAY, lineHeight: 1.5 }}>This reruns progress calculations for every approved learner in {PROGRAM} and {SESSION}. It may take a few moments.</div>
              <div style={{ position: "absolute", right: 172, bottom: 20, width: 100, height: 40, borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>Cancel</div>
              <div style={{ position: "absolute", right: 24, bottom: 20, width: 140, height: 40, borderRadius: 8, background: INK, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 86 && g < 92 ? 0.94 : 1})` }}>Recalculate all</div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={Math.max(rip(g, 46), rip(g, 88))} opacity={fo(g, 120, 10)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ l8 — WRAP ════════════════════════════════════════════════════════════════
const SceneWrap: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["✨", "Create", "AI curriculum generator", "#7C3AED"], ["▶", "Present", "Slide editor", "#F59E0B"], ["📝", "Assign", "AI assignments", "#2563EB"], ["📈", "Track", "Submissions & progress", "#22C55E"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 150, top: 360, width: 1620, display: "flex", gap: 30 }}>
          {steps.map(([ic, t, s, c], i) => {
            const p = sp(g, 20 + i * 12, fps);
            return (
              <div key={t} style={{ flex: 1, height: 240, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${c}88`, boxShadow: `0 0 50px ${c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 54, color: c }}>{ic}</div>
                <div style={{ marginTop: 12, fontSize: 38, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
                <div style={{ marginTop: 8, fontSize: 20, color: "#8A96B2" }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 710, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 90, 12), transform: `translateY(${(1 - fi(g, 90, 12)) * 20}px)` }}>
          One place. <span style={{ color: "#7FA0FF" }}>From lesson to progress.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  l0: SceneHook, l1: SceneGenerate, l2: SceneReview, l3: SceneSlides, l4: ScenePresent, l5: SceneAssign, l6: SceneSubmissions, l7: SceneProgress, l8: SceneWrap,
};

export const LessonFlowVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "l8" ? TAIL : 0);
        return (
          <Sequence key={k} from={STARTS[k]} durationInFrames={d}>
            <Scene f={frame - STARTS[k]} dur={d} fps={fps} />
          </Sequence>
        );
      })}
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}>
        <MainIntro />
      </Sequence>
      {ALL.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={`a-${k}`} from={STARTS[k]} durationInFrames={DURATIONS[k]}>
          <Audio src={staticFile(`lesson/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
