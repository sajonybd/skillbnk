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
// EnrollmentFlowVideo — "From Enrollment Form to Active Learner".
// 1920x1080 feature walkthrough. Every claim is verified against the code
// (see project doc claude/skillbnk-code-facts.md):
//   Enrollment Form Builder → learner enrolls on the course page (fills the form)
//   → enrollment saved as PENDING + in-app notification → Pending Members →
//   Student Information (form answers) → Status: Approved → Update → learner sees
//   "Approved" in My Enrollments. No welcome-email / auto-approval claims.
// ALL names and data are FICTIONAL (Keystone Realty Academy).
// Voice: bash generate-voice-enroll.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════

// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  e0: 196,
  e1: 236,
  e2: 197,
  e3: 121,
  e4: 197,
  e5: 118,
  e6: 148,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["e0", "e1", "e2", "e3", "e4", "e5", "e6"];

const PRE = ["e0"] as const; // hook, BEFORE the intro
const POST = ["e1", "e2", "e3", "e4", "e5", "e6"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { e0: 220, e1: 380, e2: 420, e3: 220, e4: 360, e5: 230, e6: 190 };
const PACE: Record<Key, number> = { e0: 1, e1: 1.05, e2: 1.05, e3: 1.05, e4: 1.05, e5: 1.05, e6: 1 };
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
const ACADEMY = "Keystone Realty Academy";
const ADMIN = "Rachel Morgan";
const LEARNER = "Jordan Ellis";
const EMAIL = "jordan.ellis@example.com";
const PROGRAM = "New Agent Launch Program";
const SESSION = "Fall 2026 Cohort";
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
/** Keystone Realty Academy logo (fictional brand, drawn in code) */
const KeyLogo: React.FC<{ sub?: string; s?: number; dark?: boolean }> = ({ sub = "Realty Academy", s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#7C2D12" />
      <path d="M8 20L19 10l11 10" fill="none" stroke="#FDE68A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M12 19v11h14V19" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="19" cy="23" r="2.6" fill="#FDE68A" />
    </svg>
    <div>
      <div style={{ fontSize: 16 * s, fontWeight: 900, color: dark ? "#fff" : "#7C2D12", letterSpacing: 1 }}>KEYSTONE</div>
      <div style={{ fontSize: 10.5 * s, fontWeight: 600, color: dark ? "#CBD5E1" : GRAY, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);
const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 38, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.37, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
const JORDAN_AV = { t: "JE", c1: "#F59E0B", c2: "#D97706" };
const RACHEL_AV = { t: "RM", c1: "#2E64F0", c2: "#1D4ED8" };
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
  { t: "Dashboard" }, { t: "Leaderboard" }, { t: "Students Management", open: true },
  { t: "Approved Members", child: true }, { t: "Pending Members", child: true }, { t: "Trial Members", child: true }, { t: "Inactive Members", child: true },
  { t: "Courses & Programs", more: true }, { t: "Content Management", more: true }, { t: "Communication", more: true },
  { t: "Attendance", more: true }, { t: "Billing & Certificate", more: true }, { t: "Institute Settings" },
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
      <div style={{ position: "absolute", left: 52, top: 11, height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK, fontWeight: 700 }}>🏫 {ACADEMY} · Austin</div>
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

/** enrollment form content (shared by builder, course page and answers viewer) */
const STEPS = ["Personal Info", "Experience", "Agreement"];
const ANSWERS: [string, string][] = [
  ["Full Name", LEARNER], ["Email", EMAIL], ["Phone", "(512) 555-0187"], ["Date of Birth", "Mar 14, 1994"],
  ["How did you hear about us?", "Instagram"], ["Are you licensed?", "In progress"], ["Years in sales", "1–2 years"],
  ["Why do you want to join?", "I want a structured start and a mentor in my first year."], ["Terms and Conditions", "✓ Agreed"],
];
const SIG_PATH = "M10 52 C 22 20, 34 18, 40 44 S 58 66, 66 34 C 72 14, 84 20, 86 44 C 88 60, 100 58, 112 36 C 120 22, 130 26, 134 42 L 150 40 C 170 38, 186 30, 200 34";

// ═══ e0 — HOOK: emails, spreadsheets, copy-paste ═════════════════════════════
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  const mails = ["Fall class — can I still join?", "Re: Application form (PDF)", "Where do I pay?", "Sending my documents again", "Did you get my form??", "Second follow-up"];
  const lines = [
    { t: "Someone wants to join your training.", at: 6, c: "#F1F5F9" },
    { t: "Then come the emails, the spreadsheets…", at: 70, c: "#FDBA74" },
    { t: "…and the copy-and-paste.", at: 135, c: "#FCA5A5" },
  ];
  const drift = (i: number) => Math.sin((g + i * 40) / 30) * 7;
  const card = (at: number) => sp(g, at, fps);
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 150, top: 120 + drift(0), width: 540, height: 520, borderRadius: 20, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: card(4), transform: `rotate(-3deg) scale(${0.85 + 0.15 * card(4)})`, overflow: "hidden" }}>
          <div style={{ height: 54, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 20, fontWeight: 800, color: INK, gap: 10 }}>✉ Inbox <span style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 999, background: "#EF4444", color: "#fff", fontSize: 15 }}>{Math.min(14, Math.floor(interpolate(g, [10, 120], [3, 14], cl)))}</span></div>
          {mails.map((m, i) => {
            const p = sp(g, 14 + i * 14, fps);
            return (
              <div key={m} style={{ height: 74, borderBottom: `1px solid ${LINE}`, padding: "12px 20px", boxSizing: "border-box", opacity: p, transform: `translateX(${(1 - p) * 40}px)`, background: i < 2 ? "#EFF6FF" : "#fff" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>{["Alex P.", "Sam R.", "Chris D.", "Taylor M.", "Morgan K.", "Alex P."][i]}</div>
                <div style={{ fontSize: 15, color: GRAY, marginTop: 4 }}>{m}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 760, top: 170 + drift(1), width: 560, height: 420, borderRadius: 18, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: card(60), transform: `rotate(2deg) scale(${0.85 + 0.15 * card(60)})`, overflow: "hidden" }}>
          <div style={{ height: 48, background: "#166534", color: "#fff", display: "flex", alignItems: "center", padding: "0 18px", fontSize: 17, fontWeight: 800 }}>▦ Applicants_FINAL_v3.xlsx</div>
          {Array.from({ length: 9 }).map((_, r) => (
            <div key={r} style={{ display: "flex", height: 40, borderBottom: "1px solid #E5E7EB", background: r === 0 ? "#F3F4F6" : r === 3 || r === 6 ? "#FEE2E2" : "#fff" }}>
              {["Name", "Email", "Course", "Paid?", "Access sent?"].map((c, k) => (
                <div key={k} style={{ flex: k === 1 ? 1.6 : 1, borderRight: "1px solid #E5E7EB", fontSize: 13, padding: "0 8px", display: "flex", alignItems: "center", color: r === 0 ? INK : "#6B7280", fontWeight: r === 0 ? 800 : 500 }}>
                  {r === 0 ? c : k === 4 ? (r % 3 === 0 ? "❌ ??" : "✓") : k === 3 ? (r % 2 ? "yes" : "?") : "· · ·"}
                </div>
              ))}
            </div>
          ))}
        </div>
        {[["Copy", 1400, 210, -6, 120], ["Paste", 1450, 360, 5, 132], ["Send login", 1390, 510, -3, 144]].map(([t, x, y, r, at]) => {
          const p = sp(g, at as number, fps, { damping: 11 });
          return <div key={t as string} style={{ position: "absolute", left: x as number, top: (y as number) + drift(3), width: 240, height: 110, borderRadius: 6, background: "#FDE68A", boxShadow: "0 16px 40px #0008", transform: `rotate(${r}deg) scale(${p})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, color: "#78350F" }}>{t as string}</div>;
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center" }}>
          {lines.map((l) => {
            const o = fi(g, l.at, 12);
            return <div key={l.t} style={{ fontSize: 48, fontWeight: 800, color: l.c, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, lineHeight: 1.3 }}>{l.t}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ e1 — COMPANY: Enrollment Form Builder ══════════════════════════════════
const ELEMENTS = ["Short Text", "Paragraph", "Number", "Date", "Dropdown", "Radio Button", "Checkbox", "Switch", "Attachment", "Signature", "Heading", "Terms and Conditions"];
const ELEM_ICON = ["T", "¶", "#", "📅", "⌄", "◉", "☑", "⏻", "📎", "✍", "H", "§"];
const FieldBox: React.FC<{ x: number; y: number; w: number; label: string; kind: string; p?: number; hl?: boolean }> = ({ x, y, w, label, kind, p = 1, hl }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 86, borderRadius: 10, border: `1.5px ${hl ? "solid" : "dashed"} ${hl ? "#818CF8" : "#CBD5E1"}`, background: hl ? "#F5F7FF" : "#fff", padding: "10px 14px", boxSizing: "border-box", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "#374151" }}>{label} <span style={{ fontSize: 11.5, color: GRAY, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "#F3F4F6" }}>{kind}</span></div>
    <div style={{ marginTop: 10, height: 34, borderRadius: 7, border: "1px solid #E5E7EB", background: "#FAFAFB", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13, color: "#9CA3AF", justifyContent: "space-between" }}>
      {kind === "Radio Button" ? <span>◉ Yes &nbsp; ○ In progress &nbsp; ○ Not yet</span> : kind === "Checkbox" ? <span>☐ I agree to the Terms and Conditions</span> : kind === "Signature" ? <span>✍ Draw your signature</span> : <span>{kind === "Paragraph" ? "Long answer…" : kind === "Date" ? "MM / DD / YYYY" : kind === "Number" ? "0" : "Answer…"}</span>}
      {kind === "Dropdown" && <span>⌄</span>}
    </div>
  </div>
);
const RowBar: React.FC<{ y: number; n: number; cols: string }> = ({ y, n, cols }) => (
  <div style={{ position: "absolute", left: 40, top: y, width: 940, height: 26, display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 700, color: GRAY }}>
    <span style={{ color: "#9CA3AF" }}>⋮⋮</span> Row {n} · {cols}<span style={{ marginLeft: "auto", letterSpacing: 6 }}>✎ ⧉ 🗑</span>
  </div>
);
const SceneBuilder: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = gt(f, dur, D);
  const step = g < 212 ? 0 : g < 306 ? 1 : 2;
  const tabs = g >= 306 ? STEPS : STEPS.slice(0, 2);
  const TILE = { x: 1352, y: 401 };
  const SLOT = { x: 760, y: 573 };
  const TAB2 = { x: 550, y: 172 };
  const STEPB = { x: 1200, y: 106 };
  const MSAVE = { x: 955, y: 470 };
  const SAVE = { x: 1310, y: 106 };
  const cur = path(g, [
    [0, 900, 640], [48, TILE.x, TILE.y], [60, TILE.x, TILE.y], [120, SLOT.x, SLOT.y], [190, SLOT.x, SLOT.y], [208, TAB2.x, TAB2.y],
    [236, TAB2.x, TAB2.y], [254, STEPB.x, STEPB.y], [270, 820, 404], [292, 820, 404], [302, MSAVE.x, MSAVE.y], [326, MSAVE.x, MSAVE.y], [346, SAVE.x, SAVE.y], [380, SAVE.x, SAVE.y],
  ]);
  const dragging = g >= 60 && g < 124;
  const dropP = sp(g, 124, fps);
  const modal = g >= 262 && g < 308 ? Math.min(fi(g, 262, 6), fo(g, 302, 6)) : 0;
  const ripple = Math.max(rip(g, 58), rip(g, 124), rip(g, 212), rip(g, 258), rip(g, 304), rip(g, 350));
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [18, 1300, 420, 1.45], [58, 1300, 420, 1.45], [92, 1000, 480, 1.2], [128, 760, 560, 1.4], [192, 760, 560, 1.4],
    [214, 700, 340, 1.35], [248, 700, 340, 1.35], [264, 800, 420, 1.25], [312, 800, 420, 1.25], [324, 700, 360, 1.25], [338, 1250, 150, 1.5], [380, 1250, 150, 1.5],
  ];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="company.skillbnk.com/enrollment-form-builder">
          <CompanyShell>
            <div style={{ position: "absolute", left: 20, top: 14, width: 1310, height: 64, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
              <div style={{ position: "absolute", left: 20, top: 18, fontSize: 22, fontWeight: 800, color: INK }}>Enrollment Form Builder</div>
            </div>
            <Btn x={900} y={26} w={100} h={40} label="+ Step" fs={14} press={g >= 258 && g < 264 ? 1 : 0} />
            <Btn x={1010} y={26} w={100} h={40} label="💾 Save" primary fs={14} press={g >= 350 && g < 356 ? 1 : 0} />
            <Btn x={1120} y={26} w={100} h={40} label="Preview" soft fs={14} />
            <div style={{ position: "absolute", left: 1230, top: 26, width: 90, height: 40, borderRadius: 8, border: "1px solid #FCA5A5", color: "#DC2626", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Delete</div>
            {tabs.map((t, i) => {
              const on = i === step;
              const p = i === 2 ? sp(g, 306, fps) : 1;
              return (
                <div key={t} style={{ position: "absolute", left: 20 + i * 190, top: 92, width: 180, height: 40, borderRadius: 9, background: on ? BLUE : "#fff", border: `1px solid ${on ? BLUE : LINE}`, color: on ? "#fff" : "#374151", fontSize: 14.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: on ? "#ffffff33" : "#F3F4F6", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>{t}
                </div>
              );
            })}
            {/* canvas */}
            <div style={{ position: "absolute", left: 20, top: 146, width: 980, height: 640, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
            {step === 0 && (
              <>
                <RowBar y={160} n={1} cols="2 Columns" />
                <FieldBox x={40} y={190} w={460} label="Full Name" kind="Short Text" />
                <FieldBox x={520} y={190} w={460} label="Email" kind="Short Text" />
                <RowBar y={300} n={2} cols="2 Columns" />
                <FieldBox x={40} y={330} w={460} label="Phone" kind="Number" />
                <FieldBox x={520} y={330} w={460} label="Date of Birth" kind="Date" />
                <RowBar y={440} n={3} cols="1 Column" />
                {g < 124 ? (
                  <div style={{ position: "absolute", left: 40, top: 470, width: 940, height: 86, borderRadius: 10, border: `2px dashed ${dragging ? "#818CF8" : "#CBD5E1"}`, background: dragging ? "#EEF2FF" : "#FAFAFB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: dragging ? BLUE : "#9CA3AF", fontWeight: 600 }}>Choose a component · drop it here</div>
                ) : (
                  <FieldBox x={40} y={470} w={940} label="How did you hear about us?" kind="Dropdown" p={dropP} hl={g < 190} />
                )}
                <div style={{ position: "absolute", left: 40, top: 586, width: 940, height: 44, borderRadius: 10, border: "1px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: GRAY, fontWeight: 600 }}>+ Add Row</div>
              </>
            )}
            {step === 1 && (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 212, 8) }}>
                <RowBar y={160} n={1} cols="2 Columns" />
                <FieldBox x={40} y={190} w={460} label="Are you licensed?" kind="Radio Button" />
                <FieldBox x={520} y={190} w={460} label="Years in sales" kind="Dropdown" />
                <RowBar y={300} n={2} cols="1 Column" />
                <FieldBox x={40} y={330} w={940} label="Why do you want to join?" kind="Paragraph" />
              </div>
            )}
            {step === 2 && (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 306, 8) }}>
                <RowBar y={160} n={1} cols="1 Column" />
                <FieldBox x={40} y={190} w={940} label="Terms and Conditions" kind="Checkbox" p={sp(g, 312, fps)} />
                <RowBar y={300} n={2} cols="1 Column" />
                <FieldBox x={40} y={330} w={940} label="Signature" kind="Signature" p={sp(g, 320, fps)} />
              </div>
            )}
            {/* elements panel */}
            <div style={{ position: "absolute", left: 1020, top: 146, width: 310, height: 640, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
              <div style={{ position: "absolute", left: 14, top: 14, fontSize: 17, fontWeight: 800, color: INK }}>Form Elements</div>
              {ELEMENTS.map((e, i) => {
                const hot = i === 4 && g >= 46 && g < 124;
                return (
                  <div key={e} style={{ position: "absolute", left: 12 + (i % 2) * 148, top: 54 + Math.floor(i / 2) * 58, width: 140, height: 50, borderRadius: 9, border: `1px solid ${hot ? "#818CF8" : LINE}`, background: hot ? BLUE_SOFT : "#FAFAFB", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", boxSizing: "border-box", fontSize: 12.5, fontWeight: 700, color: hot ? BLUE : "#374151" }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: "#fff", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{ELEM_ICON[i]}</span>
                    <span style={{ lineHeight: 1.1 }}>{e}</span>
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 14, top: 414, fontSize: 15, fontWeight: 800, color: INK }}>Layout</div>
              {["2 Columns", "3 Columns", "4 Columns"].map((t, i) => (
                <div key={t} style={{ position: "absolute", left: 12 + i * 98, top: 446, width: 90, height: 60, borderRadius: 9, border: `1px solid ${LINE}`, background: "#FAFAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#374151" }}>
                  <div style={{ display: "flex", gap: 3 }}>{Array.from({ length: i + 2 }).map((_, k) => <div key={k} style={{ width: 12, height: 14, borderRadius: 2, background: "#CBD5E1" }} />)}</div>{t}
                </div>
              ))}
            </div>
          </CompanyShell>
          {dragging && (
            <div style={{ position: "absolute", left: cur.x - 60, top: cur.y - 20, width: 140, height: 46, borderRadius: 9, background: "#fff", border: "2px solid #818CF8", boxShadow: "0 16px 30px #0003", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 13, fontWeight: 800, color: BLUE, zIndex: 80, transform: "rotate(-3deg)" }}>⌄ Dropdown</div>
          )}
          {modal > 0.01 && (
            <>
              <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.4 * modal})`, zIndex: 60 }} />
              <div style={{ position: "absolute", left: 570, top: 300 + (1 - modal) * 20, width: 460, height: 210, borderRadius: 14, background: "#fff", opacity: modal, zIndex: 61, boxShadow: "0 30px 80px #0006", padding: "20px 22px", boxSizing: "border-box" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Add new step</div>
                <div style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: "#374151" }}>Enter step name</div>
                <div style={{ marginTop: 8, height: 44, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: "0 0 0 3px #C7D2FE", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, color: INK }}>{typed(g, 272, "Agreement", 0.45)}<span style={{ color: BLUE }}>|</span></div>
                <div style={{ position: "absolute", right: 20, bottom: 18, width: 110, height: 40, borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 304 && g < 308 ? 0.94 : 1})` }}>Save</div>
              </div>
            </>
          )}
          <Toast g={g} at={354} text="Save successfully" x={1180} y={70} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={dragging} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ e2 — PUBLIC COURSE PAGE: pick session + fill the enrollment form ═══════
const SceneEnroll: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const step = g < 176 ? 0 : g < 280 ? 1 : 2;
  const sessionOpen = g >= 28 && g < 48;
  const sessionVal = g >= 48 ? `${SESSION} · Starts Oct 20` : "";
  const glow = (a: number, b: number) => (g >= a && g < b ? 1 : 0);
  const NEXT = { x: 1450, y: 762 };
  const ENROLL = { x: 1420, y: 762 };
  const PAD = { x: 660, y: 560 };
  const sigP = interpolate(g, [304, 342], [0, 1], cl);
  const sigPt = (t: number) => ({ x: PAD.x + 20 + t * 400, y: PAD.y + 60 + Math.sin(t * 14) * 26 });
  const cur = g >= 300 && g < 344
    ? sigPt(interpolate(g, [304, 342], [0, 1], cl))
    : path(g, [
      [0, 1200, 700], [24, 1070, 230], [30, 1070, 230], [44, 1070, 278], [52, 1070, 278], [60, 850, 378], [86, 850, 378], [90, 1290, 378],
      [114, 1290, 378], [116, 850, 468], [132, 850, 468], [134, 1290, 468], [144, 1070, 558], [160, 1070, 558], [170, NEXT.x, NEXT.y],
      [184, NEXT.x, NEXT.y], [192, 775, 371], [200, 775, 371], [206, 1290, 378], [218, 1290, 378], [222, 1070, 501], [266, 1070, 501],
      [274, NEXT.x, NEXT.y], [286, NEXT.x, NEXT.y], [294, 660, 460], [300, sigPt(0).x, sigPt(0).y], [344, sigPt(1).x, sigPt(1).y], [354, ENROLL.x, ENROLL.y], [420, ENROLL.x, ENROLL.y],
    ]);
  const ripple = Math.max(rip(g, 26), rip(g, 46), rip(g, 62), rip(g, 92), rip(g, 118), rip(g, 136), rip(g, 148), rip(g, 172), rip(g, 194), rip(g, 208), rip(g, 224), rip(g, 276), rip(g, 294), rip(g, 356));
  const done = fi(g, 362, 10);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [18, 1070, 260, 1.45], [52, 1070, 260, 1.45], [66, 1070, 480, 1.3], [350, 1070, 480, 1.3], [366, WIDE_X, WIDE_Y, 1], [420, WIDE_X, WIDE_Y, 1]];
  const stepX = [680, 970, 1260];
  return (
    <Stage>
      <PortalTag n={2} label="Course page" url="www.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="www.skillbnk.com/enroll/new-agent-launch-program">
          <div style={{ position: "absolute", inset: 0, background: "#F6F7F9" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 64, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 30, boxSizing: "border-box" }}>
            <KeyLogo />
            <div style={{ flex: 1 }} />
            {["Courses", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>{t}</span>)}
            <Avatar t={JORDAN_AV.t} s={36} c1={JORDAN_AV.c1} c2={JORDAN_AV.c2} />
          </div>
          {/* course card */}
          <div style={{ position: "absolute", left: 60, top: 96, width: 500, height: 690, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, overflow: "hidden" }}>
            <div style={{ height: 220, background: "linear-gradient(135deg,#7C2D12,#EA580C)", position: "relative", padding: 24, boxSizing: "border-box" }}>
              <div style={{ position: "absolute", right: -40, bottom: -60, width: 220, height: 220, borderRadius: "50%", background: "#ffffff22" }} />
              <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "#ffffff30", color: "#fff" }}>PROGRAM</span>
              <div style={{ marginTop: 18, fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>{PROGRAM}</div>
              <div style={{ marginTop: 8, fontSize: 14, color: "#FFEDD5" }}>by {ACADEMY}</div>
            </div>
            <div style={{ padding: "20px 24px", fontSize: 15.5, color: "#374151", lineHeight: 2 }}>
              <div>👩‍🏫 Instructor: <b>Laura Bennett</b></div>
              <div>🗓 12 weeks · Live + online</div>
              <div>📍 Austin, TX</div>
            </div>
            <div style={{ margin: "0 24px", padding: "16px 18px", borderRadius: 12, background: "#F9FAFB", border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>Order Summary</div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, color: GRAY }}>Original price <span>$1,200</span></div>
              <div style={{ marginTop: 10, height: 40, borderRadius: 8, border: `1px dashed #D1D5DB`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>Promo code</div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 800, color: INK }}>Total <span>$1,200</span></div>
            </div>
          </div>
          {/* enrollment details */}
          <div style={{ position: "absolute", left: 600, top: 96, width: 940, height: 720, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
          <div style={{ position: "absolute", left: 640, top: 116, fontSize: 24, fontWeight: 800, color: INK }}>Enrollment Details</div>
          <div style={{ position: "absolute", left: 640, top: 150, fontSize: 14.5, color: GRAY }}>Choose your session and complete the enrollment form</div>
          <Input x={640} y={180} w={860} label="" value={sessionVal} ph="Select Session" select glow={sessionOpen ? 1 : 0} />
          {/* steps */}
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              {i < 2 && <div style={{ position: "absolute", left: stepX[i] + 30, top: 286, width: 260, height: 3, background: step > i ? BLUE : "#E5E7EB" }} />}
              <div style={{ position: "absolute", left: stepX[i], top: 272, width: 30, height: 30, borderRadius: "50%", background: step >= i ? BLUE : "#E5E7EB", color: step >= i ? "#fff" : GRAY, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{step > i ? "✓" : i + 1}</div>
              <div style={{ position: "absolute", left: stepX[i] + 38, top: 278, fontSize: 14, fontWeight: 700, color: step >= i ? INK : GRAY, background: "#fff", paddingRight: 6 }}>{s}</div>
            </React.Fragment>
          ))}
          {step === 0 && (
            <>
              <Input x={640} y={326} w={420} label="Full Name" req value={typed(g, 64, LEARNER, 0.6)} ph="Answer…" glow={glow(60, 88)} />
              <Input x={1080} y={326} w={420} label="Email" req value={typed(g, 92, EMAIL, 1.2)} ph="Answer…" glow={glow(88, 116)} />
              <Input x={640} y={416} w={420} label="Phone" value={typed(g, 118, "(512) 555-0187", 1.2)} ph="0" glow={glow(116, 134)} />
              <Input x={1080} y={416} w={420} label="Date of Birth" value={g >= 138 ? "Mar 14, 1994" : ""} ph="MM / DD / YYYY" glow={glow(134, 146)} />
              <Input x={640} y={506} w={860} label="How did you hear about us?" value={g >= 152 ? "Instagram" : ""} ph="Select" select glow={glow(146, 164)} />
            </>
          )}
          {step === 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 176, 8) }}>
              <div style={{ position: "absolute", left: 640, top: 326, fontSize: 14.5, fontWeight: 600, color: "#374151" }}>Are you licensed? <span style={{ color: "#EF4444" }}>*</span></div>
              <div style={{ position: "absolute", left: 640, top: 362, display: "flex", gap: 26, fontSize: 15, color: INK }}>
                {["Yes", "In progress", "Not yet"].map((o) => {
                  const on = o === "In progress" && g >= 196;
                  return <span key={o} style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: on ? 700 : 500 }}><span style={{ width: 18, height: 18, borderRadius: "50%", border: on ? `6px solid ${BLUE}` : "2px solid #9CA3AF", boxSizing: "border-box" }} />{o}</span>;
                })}
              </div>
              <Input x={1080} y={326} w={420} label="Years in sales" value={g >= 212 ? "1–2 years" : ""} ph="Select" select glow={glow(206, 220)} />
              <Input x={640} y={416} w={860} h={110} label="Why do you want to join?" value={typed(g, 226, "I want a structured start and a mentor in my first year.", 1.6)} ph="Long answer…" glow={glow(222, 270)} />
            </div>
          )}
          {step === 2 && (
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 280, 8) }}>
              <div style={{ position: "absolute", left: 640, top: 326, width: 860, height: 110, borderRadius: 10, border: `1px solid ${LINE}`, background: "#FAFAFB", padding: "12px 16px", boxSizing: "border-box", fontSize: 13.5, color: GRAY, lineHeight: 1.5 }}>
                <b style={{ color: INK }}>Terms and Conditions</b><br />By enrolling you agree to the academy's attendance policy, class schedule and refund terms for the {PROGRAM}.
              </div>
              <div style={{ position: "absolute", left: 650, top: 450, display: "flex", gap: 10, alignItems: "center", fontSize: 15, color: INK, fontWeight: 600 }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, border: g >= 296 ? `2px solid ${BLUE}` : "2px solid #9CA3AF", background: g >= 296 ? BLUE : "#fff", color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{g >= 296 ? "✓" : ""}</span>
                I agree to the Terms and Conditions
              </div>
              <div style={{ position: "absolute", left: 640, top: 494, fontSize: 14.5, fontWeight: 600, color: "#374151" }}>Signature <span style={{ color: "#EF4444" }}>*</span></div>
              <div style={{ position: "absolute", left: PAD.x - 20, top: 520, width: 520, height: 160, borderRadius: 10, border: "1.5px dashed #CBD5E1", background: "#fff" }}>
                {sigP === 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 15 }}>Draw your signature</div>}
                <svg width="520" height="160" style={{ position: "absolute", left: 0, top: 0 }}>
                  <polyline fill="none" stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    points={Array.from({ length: 60 }).map((_, k) => { const p2 = sigPt((k / 59) * sigP); return `${p2.x - (PAD.x - 20)},${p2.y - 520 + Math.sin(k * 1.3) * 6 * sigP}`; }).join(" ")} opacity={sigP > 0 ? 1 : 0} />
                </svg>
              </div>
            </div>
          )}
          {step < 2 ? (
            <>
              <Btn x={1290} y={740} w={100} h={44} label="Back" fs={15} />
              <Btn x={1400} y={740} w={100} h={44} label="Next →" primary fs={15} press={(g >= 172 && g < 178) || (g >= 276 && g < 282) ? 1 : 0} />
            </>
          ) : (
            <Btn x={1340} y={740} w={160} h={44} label="Enroll Now" primary fs={16} press={g >= 356 && g < 362 ? 1 : 0} />
          )}
          {sessionOpen && (
            <div style={{ position: "absolute", left: 640, top: 232, width: 860, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, boxShadow: "0 16px 40px #0F172A2A", zIndex: 30, opacity: fi(g, 28, 6), padding: 6 }}>
              {[`${SESSION} · Starts Oct 20`, "Anytime: Self-Paced"].map((o, i) => (
                <div key={o} style={{ height: 40, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 600, color: i === 0 && g >= 40 ? BLUE : INK, background: i === 0 && g >= 40 ? BLUE_SOFT : "transparent" }}>{o}</div>
              ))}
            </div>
          )}
          {done > 0.01 && (
            <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * done})`, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 560, padding: "34px 36px", borderRadius: 18, background: "#fff", textAlign: "center", opacity: done, transform: `scale(${0.9 + 0.1 * sp(g, 362, fps)})` }}>
                <div style={{ width: 72, height: 72, margin: "0 auto", borderRadius: "50%", background: "#DCFCE7", color: GREEN, fontSize: 38, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                <div style={{ marginTop: 18, fontSize: 28, fontWeight: 800, color: INK }}>Enrollment submitted</div>
                <div style={{ marginTop: 10, fontSize: 16.5, color: GRAY, lineHeight: 1.5 }}>{ACADEMY} will review your enrollment for the {PROGRAM}.</div>
                <div style={{ marginTop: 14 }}><Badge t="Status: Pending approval" c="#C2410C" bg="#FFEDD5" dot fs={14} /></div>
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} opacity={fo(g, 362, 8)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ Training provider: Pending Members list ══════════════════════════════════
const PENDING = [
  { n: LEARNER, av: JORDAN_AV, ph: "(512) 555-0187", em: "jordan.ellis@…", pr: PROGRAM, se: SESSION, d: "Sep 30, 2026", t: "10:42 AM", isNew: true },
  { n: "Priya Shah", av: { t: "PS", c1: "#A855F7", c2: "#7C3AED" }, ph: "(512) 555-0143", em: "priya.shah@…", pr: "Listing Presentation Mastery", se: "Anytime: Self-Paced", d: "Sep 29, 2026", t: "4:15 PM", isNew: false },
  { n: "Marcus Reed", av: { t: "MR", c1: "#0EA5E9", c2: "#0284C7" }, ph: "(737) 555-0119", em: "marcus.reed@…", pr: PROGRAM, se: SESSION, d: "Sep 28, 2026", t: "9:05 AM", isNew: false },
  { n: "Hannah Cole", av: { t: "HC", c1: "#EC4899", c2: "#DB2777" }, ph: "(512) 555-0166", em: "hannah.cole@…", pr: "Listing Presentation Mastery", se: "Anytime: Self-Paced", d: "Sep 27, 2026", t: "2:48 PM", isNew: false },
  { n: "Diego Ramos", av: { t: "DR", c1: "#22C55E", c2: "#15803D" }, ph: "(737) 555-0172", em: "diego.ramos@…", pr: PROGRAM, se: SESSION, d: "Sep 26, 2026", t: "11:30 AM", isNew: false },
];
const PEN_COLS: [string, number][] = [["Name", 24], ["Phone Number", 236], ["Email", 400], ["Program", 600], ["Session", 860], ["Enrollment Date", 1030], ["Actions", 1210]];
const PendingPage: React.FC<{ g: number; fps: number; showAt: number; pressEdit?: boolean }> = ({ g, fps, showAt, pressEdit }) => (
  <>
    <PageTitle t="Pending Members" sub="All information on pending members is here" />
    <div style={{ position: "absolute", left: 780, top: 22, width: 300, height: 42, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, color: "#9CA3AF" }}>Enter Username/Email… ⌕</div>
    <Btn x={1090} y={22} w={120} h={42} label="⚲ Filters" soft fs={14} />
    <Btn x={1220} y={22} w={50} h={42} label="⇅" fs={15} />
    <Btn x={1280} y={22} w={50} h={42} label="⚙" fs={15} />
    <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1310, height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
      {PEN_COLS.map(([t, x]) => <div key={t} style={{ position: "absolute", left: x, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t}</div>)}
      {PENDING.map((r, i) => {
        const p = r.isNew ? sp(g, showAt + 6, fps) : 1;
        return (
          <div key={r.n} style={{ position: "absolute", left: 0, top: r.isNew ? 50 : 50 + (i - 1 + (g >= showAt ? sp(g, showAt + 6, fps) : 0)) * 66, width: 1310, height: 66, borderBottom: `1px solid ${LINE}`, background: r.isNew ? `rgba(254,243,199,${0.45 + 0.25 * Math.sin(g / 7)})` : "transparent", opacity: p, boxShadow: r.isNew ? "inset 4px 0 0 #F59E0B" : "none" }}>
            <div style={{ position: "absolute", left: 24, top: 15, display: "flex", gap: 10, alignItems: "center", fontSize: 15, fontWeight: 700, color: INK }}><Avatar t={r.av.t} s={34} c1={r.av.c1} c2={r.av.c2} />{r.n}{r.isNew && <Badge t="New" c="#fff" bg="#F59E0B" fs={11.5} />}</div>
            <div style={{ position: "absolute", left: 236, top: 23, fontSize: 14.5, color: INK }}>{r.ph}</div>
            <div style={{ position: "absolute", left: 400, top: 12, fontSize: 14.5, color: INK }}>{r.em}<div style={{ marginTop: 4 }}><Badge t="✓ Verified" c={GREEN} bg="#DCFCE7" fs={11} /></div></div>
            <div style={{ position: "absolute", left: 600, top: 21 }}><span style={{ fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "#F3F4F6", color: INK }}>{r.pr}</span></div>
            <div style={{ position: "absolute", left: 860, top: 21 }}><span style={{ fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "#F3F4F6", color: INK }}>{r.se}</span></div>
            <div style={{ position: "absolute", left: 1030, top: 13, fontSize: 14.5, color: INK, lineHeight: 1.35 }}>{r.d}<br /><span style={{ color: GRAY, fontSize: 13 }}>{r.t}</span></div>
            <div style={{ position: "absolute", left: 1210, top: 16, display: "flex", gap: 8 }}>
              <div style={{ transform: `scale(${r.isNew && pressEdit ? 0.88 : 1})` }}><IconBtn t="✎" bg={r.isNew && pressEdit ? BLUE : BLUE_SOFT} c={r.isNew && pressEdit ? "#fff" : BLUE} /></div>
              <IconBtn t="⋮" bg="#fff" c={GRAY} />
            </div>
          </div>
        );
      })}
    </div>
  </>
);

// ═══ e3 — in-app notification + the learner appears in Pending Members ══════
// (backend sends a "newEnrollment" in-app notification; enrollment status = pending)
const SceneNotify: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  const ring = g >= 10 && g < 44 ? 1 - (g - 10) / 34 : 0;
  const pop = g >= 14 && g < 66 ? Math.min(fi(g, 14, 8), fo(g, 58, 8)) : 0;
  const open = g >= 72 && g < 112 ? Math.min(fi(g, 72, 6), fo(g, 106, 6)) : 0;
  const ROW = { x: MX(300), y: MY(96 + 50 + 33) };
  const cur = path(g, [[0, 900, 520], [62, BELL.x, BELL.y], [74, BELL.x, BELL.y], [100, 1390, 128], [112, 1390, 128], [150, ROW.x, ROW.y], [220, ROW.x, ROW.y]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [12, 1380, 170, 1.6], [106, 1380, 170, 1.6], [126, 760, 330, 1.25], [220, 760, 330, 1.25]];
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/pending-member">
          <ProviderShell active="Pending Members" bell={g >= 12 ? 3 : 2} ring={ring}>
            <PendingPage g={g} fps={fps} showAt={14} />
          </ProviderShell>
          {pop > 0.01 && (
            <div style={{ position: "absolute", left: 1160, top: 70 + (1 - pop) * -14, width: 420, padding: "14px 16px", borderRadius: 12, background: "#fff", border: "1px solid #FCD34D", borderLeft: "5px solid #F59E0B", boxShadow: "0 14px 34px #0F172A33", zIndex: 60, opacity: pop, display: "flex", gap: 12 }}>
              <Avatar t={JORDAN_AV.t} s={38} c1={JORDAN_AV.c1} c2={JORDAN_AV.c2} />
              <div><div style={{ fontSize: 15, fontWeight: 800, color: INK }}>New enrollment</div><div style={{ fontSize: 14, color: "#374151", marginTop: 3 }}>{LEARNER} · {PROGRAM} · {SESSION}</div></div>
            </div>
          )}
          {open > 0.01 && (
            <div style={{ position: "absolute", left: 1180, top: 64, width: 400, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, boxShadow: "0 18px 44px #0F172A33", zIndex: 60, opacity: open, padding: 8 }}>
              <div style={{ padding: "6px 10px 10px", fontSize: 16, fontWeight: 800, color: INK }}>Notifications</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px", borderRadius: 9, background: "#FFFBEB" }}>
                <Avatar t={JORDAN_AV.t} s={34} c1={JORDAN_AV.c1} c2={JORDAN_AV.c2} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 800, color: INK }}>New enrollment</div><div style={{ fontSize: 13, color: GRAY }}>{LEARNER} · {PROGRAM}</div></div>
                <span style={{ fontSize: 12, color: GRAY }}>just now</span>
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 72)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ e4 — Student Information: form answers → Approved → Update ═════════════
const STATUS_OPTS: [string, string][] = [["Pending", "#F59E0B"], ["Approved", GREEN], ["Inactive", "#6B7280"], ["Trial", "#0EA5E9"]];
const SceneApprove: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const onInfo = g >= 30;
  const approved = g >= 204;
  const updated = g >= 242;
  const ddOpen = g >= 178 && g < 206;
  const EDIT = { x: MX(1227), y: MY(96 + 50 + 33) };
  const STATUS = { x: 440, y: 304 };
  const APPROVE = { x: 440, y: 387 };
  const UPDATE = { x: 345, y: 360 };
  const cur = path(g, [[0, 900, 500], [18, EDIT.x, EDIT.y], [30, EDIT.x, EDIT.y], [60, 900, 700], [160, 900, 700], [174, STATUS.x, STATUS.y], [184, STATUS.x, STATUS.y], [200, APPROVE.x, APPROVE.y], [216, APPROVE.x, APPROVE.y], [236, UPDATE.x, UPDATE.y], [360, UPDATE.x, UPDATE.y]]);
  const ripple = Math.max(rip(g, 24), rip(g, 178), rip(g, 204), rip(g, 240));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [12, 1430, 250, 1.5], [28, 1430, 250, 1.5], [44, WIDE_X, WIDE_Y, 1.05], [64, 800, 600, 1.3], [148, 800, 600, 1.3], [166, 560, 330, 1.6], [254, 560, 330, 1.6], [278, WIDE_X, WIDE_Y, 1.05], [360, WIDE_X, WIDE_Y, 1.05]];
  const st = approved ? STATUS_OPTS[1] : STATUS_OPTS[0];
  const cells: [string, string][] = [...ANSWERS.slice(0, 8), ANSWERS[8], ["Signature", "__sig"]];
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onInfo ? "branch.skillbnk.com/approved-member/submember-…" : "branch.skillbnk.com/pending-member"}>
          <ProviderShell active="Pending Members" bell={3}>
            {!onInfo ? (
              <PendingPage g={g + 200} fps={fps} showAt={0} pressEdit={g >= 22 && g < 30} />
            ) : (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 30, 10) }}>
                <PageTitle t="Student Information" sub="All information on student enrollment is here" back />
                <Btn x={950} y={22} w={110} h={40} label="⤓ Export" fs={14} />
                <Btn x={1070} y={22} w={100} h={40} label="🖨 Print" fs={14} />
                <Btn x={1180} y={22} w={150} h={40} label="⟲ History" soft fs={14} />
                <div style={{ position: "absolute", left: 20, top: 84, width: 1310, height: 80, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", boxSizing: "border-box" }}>
                  <Avatar t={JORDAN_AV.t} s={48} c1={JORDAN_AV.c1} c2={JORDAN_AV.c2} />
                  <div><div style={{ fontSize: 19, fontWeight: 800, color: INK }}>{LEARNER}</div><div style={{ fontSize: 14, color: GRAY }}>{EMAIL} · (512) 555-0187</div></div>
                  <div style={{ marginLeft: "auto", transform: `scale(${updated ? 1 + 0.15 * Math.max(0, 1 - (g - 242) / 12) : 1})` }}>{updated ? <Badge t="Approved" c={GREEN} bg="#DCFCE7" dot fs={14} /> : <Badge t="Pending" c="#C2410C" bg="#FFEDD5" dot fs={14} />}</div>
                </div>
                <div style={{ position: "absolute", left: 20, top: 176, width: 1310, height: 150, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
                <div style={{ position: "absolute", left: 40, top: 192, width: 300 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Status:</div>
                  <div style={{ height: 44, borderRadius: 8, border: `1px solid ${ddOpen ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: ddOpen ? "0 0 0 3px #C7D2FE" : "none", background: approved && g < 260 ? "#F0FDF4" : "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 15.5, fontWeight: 700, color: INK }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: st[1] }} />{st[0]}<span style={{ marginLeft: "auto", color: "#9CA3AF" }}>⌄</span>
                  </div>
                </div>
                <Input x={360} y={192} w={320} label="Enrolled Program:" value={PROGRAM} select />
                <Input x={700} y={192} w={300} label="Enrolled Session:" value={SESSION} select />
                <Input x={1020} y={192} w={290} label="Enrolled Date:" value="Sep 30, 2026" />
                <Btn x={40} y={280} w={110} h={40} label="Update" soft fs={15} press={g >= 240 && g < 246 ? 1 : 0} />
                {ddOpen && (
                  <div style={{ position: "absolute", left: 40, top: 270, width: 300, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, boxShadow: "0 16px 40px #0F172A33", zIndex: 30, padding: 6, opacity: fi(g, 178, 3) }}>
                    {STATUS_OPTS.map(([t, c], k) => (
                      <div key={t} style={{ height: 38, borderRadius: 7, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 15, fontWeight: 600, color: INK, background: k === 1 && g >= 196 ? "#DCFCE7" : k === 0 ? "#F9FAFB" : "transparent" }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />{t}{k === 0 && <span style={{ marginLeft: "auto", color: GRAY }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
                {/* enrollment form answers (DynamicFormViewer) */}
                <div style={{ position: "absolute", left: 20, top: 342, width: 1310, height: 444, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
                  <div style={{ position: "absolute", left: 22, top: 16, fontSize: 18, fontWeight: 800, color: INK }}>Enrollment Form <span style={{ fontSize: 14, color: GRAY, fontWeight: 600 }}>· answers submitted by {LEARNER}</span></div>
                  <div style={{ position: "absolute", left: 22, top: 48, display: "flex", gap: 8 }}>
                    {STEPS.map((s, i) => <span key={s} style={{ fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: BLUE_SOFT, color: BLUE }}>{i + 1}. {s}</span>)}
                  </div>
                  {cells.map(([k, v], i) => {
                    const c = i % 4;
                    const r = Math.floor(i / 4);
                    const hl = g >= 66 + i * 8 && g < 150;
                    return (
                      <div key={k} style={{ position: "absolute", left: 22 + c * 318, top: 88 + r * 116, width: 306, height: 104, borderRadius: 10, border: `1px solid ${hl ? "#FCD34D" : LINE}`, background: hl ? "#FFFBEB" : "#FAFAFB", padding: "10px 14px", boxSizing: "border-box", opacity: fi(g, 40 + i * 3, 8) }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: GRAY }}>{k}</div>
                        {v === "__sig" ? (
                          <svg width="200" height="66" viewBox="0 0 220 70" style={{ marginTop: 2 }}><path d={SIG_PATH} fill="none" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" /></svg>
                        ) : (
                          <div style={{ marginTop: 6, fontSize: v.length > 30 ? 14 : 16.5, fontWeight: 700, color: INK, lineHeight: 1.35 }}>{v}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </ProviderShell>
          <Toast g={g} at={246} text="Updated successfully · Jordan is now approved" x={1000} y={70} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ e5 — LEARNER: My Enrollments shows Approved → Switch → dashboard ═══════
const SceneLearner: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const onDash = false; // learner dashboard not shown: only verified screens
  const flip = sp(g, 30, fps, { damping: 12 });
  const SWITCH = { x: MX(210), y: MY(130 + 472) };
  const cur = path(g, [[0, 900, 600], [100, 900, 600], [140, SWITCH.x, SWITCH.y], [158, SWITCH.x, SWITCH.y], [230, SWITCH.x + 200, SWITCH.y - 100]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [18, 520, 420, 1.4], [90, 520, 420, 1.4], [132, 460, 560, 1.45], [190, 460, 560, 1.45], [230, 520, 420, 1.2]];
  const cards = [
    { t: PROGRAM, c1: "#7C2D12", c2: "#EA580C", ins: "Laura Bennett", se: SESSION, main: true },
    { t: "Real Estate Contracts 101", c1: "#1D3FD6", c2: "#0EA5E9", ins: "Mark Ellison", se: "Anytime: Self-Paced", main: false },
  ];
  return (
    <Stage>
      <PortalTag n={4} label="Learner portal" url="portal.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onDash ? "portal.skillbnk.com/dashboard" : "portal.skillbnk.com/my-enrollments"}>
          <LearnerShell active={onDash ? "Dashboard" : "My Enrollments"}>
            {!onDash ? (
              <>
                <PageTitle t="My Enrollments" sub="Learn, grow, and advance your career" back />
                <div style={{ position: "absolute", left: 30, top: 84, display: "flex", gap: 26, fontSize: 15.5, fontWeight: 600, color: GRAY }}>
                  {["All (2)", "Programs (2)", "Courses (0)", "Interviews (0)"].map((t, i) => <span key={t} style={{ color: i === 0 ? BLUE : GRAY, borderBottom: i === 0 ? `3px solid ${BLUE}` : "none", paddingBottom: 6 }}>{t}</span>)}
                </div>
                {cards.map((c, i) => {
                  const isApproved = !c.main || g >= 30;
                  return (
                    <div key={c.t} style={{ position: "absolute", left: 20 + i * 400, top: 130, width: 380, height: 520, background: "#fff", borderRadius: 14, border: `1px solid ${c.main && g >= 30 ? "#86EFAC" : LINE}`, overflow: "hidden", boxShadow: c.main && g >= 30 ? `0 0 ${24 * Math.max(0.3, 1 - (g - 30) / 60)}px #22C55E66` : "none" }}>
                      <div style={{ height: 190, background: `linear-gradient(135deg,${c.c1},${c.c2})`, position: "relative", padding: 16, boxSizing: "border-box" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: BLUE, color: "#fff" }}>Program</span>
                        <div style={{ position: "absolute", right: 14, top: 14, transform: c.main ? `scale(${g >= 30 ? 0.85 + 0.15 * flip : 1})` : undefined }}>
                          {isApproved ? <Badge t="✓ Approved" c={GREEN} bg="#DCFCE7" fs={13} /> : <Badge t="Pending" c="#C2410C" bg="#FFEDD5" dot fs={13} />}
                        </div>
                        <div style={{ position: "absolute", left: 16, bottom: 40, right: 16, fontSize: 23, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>{c.t}</div>
                        <div style={{ position: "absolute", left: 16, bottom: 14, fontSize: 13.5, color: "#FFEDD5" }}>🏢 {ACADEMY}</div>
                      </div>
                      <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar t={c.ins.split(" ").map((w) => w[0]).join("")} s={38} c1="#64748B" c2="#334155" />
                        <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: GRAY }}>Instructor</div><div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{c.ins}</div></div>
                        <div style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${BLUE}`, color: BLUE, fontSize: 13.5, fontWeight: 700 }}>Review</div>
                      </div>
                      <div style={{ margin: "0 18px", display: "flex", gap: 10 }}>
                        {[["Session", c.se], ["Starts", c.main ? "Oct 20, 2026" : "Anytime"]].map(([k, v]) => (
                          <div key={k} style={{ flex: 1, padding: "10px 12px", borderRadius: 9, background: "#F3F4F6" }}><div style={{ fontSize: 12.5, color: GRAY }}>{k}</div><div style={{ fontSize: 14.5, fontWeight: 700, color: INK, marginTop: 2 }}>{v}</div></div>
                        ))}
                      </div>
                      <div style={{ position: "absolute", left: 18, right: 18, top: 450, height: 44, borderRadius: 9, background: BLUE, color: "#fff", fontSize: 15.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${c.main && g >= 150 && g < 156 ? 0.95 : 1})` }}>Switch to this course →</div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 158, 12) }}>
                <PageTitle t="Welcome, Jordan" sub={`${PROGRAM} · ${SESSION}`} />
                <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 190, borderRadius: 16, background: "linear-gradient(90deg,#7C2D12,#EA580C)", color: "#fff", padding: "28px 32px", boxSizing: "border-box" }}>
                  <div style={{ fontSize: 15, opacity: 0.85 }}>Your program</div>
                  <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>{PROGRAM}</div>
                  <div style={{ marginTop: 14, width: 560, height: 10, borderRadius: 5, background: "#ffffff33" }}><div style={{ width: "4%", height: 10, borderRadius: 5, background: "#fff" }} /></div>
                  <div style={{ position: "absolute", right: 32, top: 64, padding: "12px 22px", borderRadius: 10, background: "#fff", color: "#7C2D12", fontWeight: 800, fontSize: 16 }}>Start Module 1 →</div>
                </div>
                {[["Lessons", "0 / 24"], ["Next class", "Oct 20 · 10:00 AM"], ["Assignments", "0 / 6"], ["Community", "46 members"]].map(([k, v], i) => (
                  <div key={k} style={{ position: "absolute", left: 20 + i * 330, top: 306, width: 310, height: 120, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "18px 22px", boxSizing: "border-box", opacity: fi(g, 166 + i * 5, 8) }}>
                    <div style={{ fontSize: 15, color: GRAY, fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: INK, marginTop: 8 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </LearnerShell>
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 152)} opacity={fi(g, 92, 8)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ e6 — WRAP ════════════════════════════════════════════════════════════════
const SceneWrap: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["📝", "Build the form"], ["🎓", "Learner enrolls"], ["🔔", "You're notified"], ["✅", "Review & approve"], ["🚀", "Start learning"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 400, width: 1680, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          {steps.map(([ic, t], i) => {
            const p = sp(g, 20 + i * 12, fps);
            return (
              <React.Fragment key={t}>
                <div style={{ width: 270, height: 170, borderRadius: 20, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF688", boxShadow: "0 0 40px #2E5CF633", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <div style={{ fontSize: 44 }}>{ic}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
                </div>
                {i < steps.length - 1 && <div style={{ fontSize: 32, color: "#7FA0FF", opacity: fi(g, 28 + i * 12, 8) }}>→</div>}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: fi(g, 90, 12), transform: `translateY(${(1 - fi(g, 90, 12)) * 20}px)` }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: "#F1F5F9" }}>From enrollment form <span style={{ color: "#7FA0FF" }}>to active learner.</span></div>
          <div style={{ marginTop: 12, fontSize: 26, fontWeight: 700, color: "#8A96B2" }}>All in one place.</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  e0: SceneHook, e1: SceneBuilder, e2: SceneEnroll, e3: SceneNotify, e4: SceneApprove, e5: SceneLearner, e6: SceneWrap,
};

export const EnrollmentFlowVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "e6" ? TAIL : 0);
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
          <Audio src={staticFile(`enroll/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
