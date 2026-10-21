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
// TrainingFollowUpVideo — "Stop Chasing Employees to Complete Training".
// Every claim verified in code (claude/skillbnk-code-facts.md):
//   Program Leaderboard (completion % per learner) → Email Marketing
//   ("Create New Email": Step 1 audience = user type/program/session + recipient
//   checkboxes, Step 2 compose, Send) → Delivery Reports → Cron Jobs (repeat) →
//   Generate Certificate (select learner → progress + template → Upload Certificate)
//   → All Certificates. NO deadline / auto-reminder / auto-certificate claims.
// ALL names and data are FICTIONAL (Harbor Point Insurance Agency).
// Voice: bash generate-voice-followup.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  t0: 265,
  t1: 199,
  t2: 133,
  t3: 235,
  t4: 164,
  t5: 94,
  t6: 204,
  t7: 156,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"];

const PRE = ["t0"] as const; // hook, BEFORE the intro
const POST = ["t1", "t2", "t3", "t4", "t5", "t6", "t7"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { t0: 240, t1: 250, t2: 200, t3: 470, t4: 330, t5: 190, t6: 430, t7: 190 };
const PACE: Record<Key, number> = { t0: 1, t1: 1.05, t2: 1.05, t3: 1.05, t4: 1.05, t5: 1, t6: 1.05, t7: 1 };
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
const ACADEMY = "Harbor Point Insurance";
const ADMIN = "Alex Turner";
const PROGRAM = "Customer Care & Compliance 2026";
const SESSION = "Q4 Team Rollout";
const LEARNER = "Nina Shah";
const EMAIL = "nina.shah@example.com";
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
/** Harbor Point Insurance logo (fictional brand, drawn in code) */
const KeyLogo: React.FC<{ sub?: string; s?: number; dark?: boolean }> = ({ sub = "Insurance Agency", s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#0C4A6E" />
      <path d="M19 7l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12v-8z" fill="none" stroke="#fff" strokeWidth="2.6" />
      <path d="M13 22c2 2 4 2 6 0s4-2 6 0" fill="none" stroke="#38BDF8" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
    <div>
      <div style={{ fontSize: 15 * s, fontWeight: 900, color: dark ? "#fff" : "#0C4A6E", letterSpacing: 0.8 }}>HARBOR POINT</div>
      <div style={{ fontSize: 10.5 * s, fontWeight: 600, color: dark ? "#CBD5E1" : GRAY, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);
const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 38, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.37, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
const JORDAN_AV = { t: "NS", c1: "#14B8A6", c2: "#0F766E" };
const RACHEL_AV = { t: "AT", c1: "#2E64F0", c2: "#1D4ED8" };
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
      <div style={{ position: "absolute", left: 52, top: 11, height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK, fontWeight: 700 }}>🏢 {ACADEMY} · Seattle</div>
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
  const name = i === 40 ? LEARNER : `${FIRST[i % 24]} ${LAST[(i * 7 + 3 + Math.floor(i / 24) * 5) % 24]}`;
  const comp = i < 36 ? Math.round(98 - i * (37 / 35)) : BEHIND[i - 36];
  const after = i < 36 ? Math.min(100, comp + 2) : AFTER[i - 36];
  const hue = (i * 47) % 360;
  return { name, email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`, comp, after, behind: i >= 36, av: { t: name.split(" ").map((w) => w[0]).join(""), c1: `hsl(${hue} 70% 55%)`, c2: `hsl(${hue} 70% 40%)` } };
});
const NINA = TEAM[40];

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

// ═══ t0 — HOOK: chasing people one by one ═══════════════════════════════════
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 240;
  const g = gt(f, dur, D);
  const msgs = ["Hey, did you finish the compliance module?", "Reminder #2: training is still open 🙏", "Just checking in again…", "Can you send me a screenshot when done?", "Reminder #3!!"];
  const lines = [
    { t: "Your team has training to finish.", at: 6, c: "#F1F5F9" },
    { t: "Who's done? Who's behind?", at: 70, c: "#FDBA74" },
    { t: "So you chase. One by one.", at: 140, c: "#FCA5A5" },
  ];
  const drift = (i: number) => Math.sin((g + i * 40) / 30) * 7;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 140, top: 110 + drift(0), width: 560, height: 560, borderRadius: 20, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: sp(g, 4, fps), transform: "rotate(-2deg)", overflow: "hidden" }}>
          <div style={{ height: 56, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 19, fontWeight: 800, color: INK }}>💬 Direct messages</div>
          {msgs.map((m, i) => {
            const p = sp(g, 12 + i * 22, fps);
            return (
              <div key={m} style={{ margin: "14px 18px 0 auto", width: 420, padding: "12px 16px", borderRadius: "16px 16px 4px 16px", background: "#2563EB", color: "#fff", fontSize: 16, fontWeight: 600, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                {m}<div style={{ fontSize: 12, color: "#BFDBFE", marginTop: 4, textAlign: "right" }}>Seen · no reply</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 760, top: 160 + drift(1), width: 500, height: 420, borderRadius: 18, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: sp(g, 50, fps), transform: "rotate(2deg)", overflow: "hidden" }}>
          <div style={{ height: 48, background: "#166534", color: "#fff", display: "flex", alignItems: "center", padding: "0 18px", fontSize: 17, fontWeight: 800 }}>▦ Who_Finished_Training.xlsx</div>
          {Array.from({ length: 9 }).map((_, r) => (
            <div key={r} style={{ display: "flex", height: 41, borderBottom: "1px solid #E5E7EB", background: r === 0 ? "#F3F4F6" : "#fff" }}>
              {["Name", "Module 1", "Module 2", "Quiz", "Done?"].map((c, k) => (
                <div key={k} style={{ flex: k === 0 ? 1.6 : 1, borderRight: "1px solid #E5E7EB", fontSize: 13, padding: "0 8px", display: "flex", alignItems: "center", color: r === 0 ? INK : "#6B7280", fontWeight: r === 0 ? 800 : 500 }}>
                  {r === 0 ? c : k === 0 ? "· · ·" : (r * 3 + k) % 4 === 0 ? "?" : (r + k) % 3 === 0 ? "✗" : "✓"}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 1330, top: 190 + drift(2), width: 420, height: 320, borderRadius: 18, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #F9731666", boxShadow: "0 30px 80px #000A", opacity: sp(g, 96, fps), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ fontSize: 80 }}>⏰</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#FDBA74" }}>{Math.round(interpolate(g, [96, 200], [2, 6], cl))} hours a week</div>
          <div style={{ fontSize: 18, color: "#8A96B2" }}>spent following up</div>
        </div>
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
      <PortalTag n={1} label="Training provider portal" url="admin view" />
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
      <PortalTag n={1} label="Training provider portal" url="admin view" />
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
const SUBJECT = "Quick reminder: finish Customer Care & Compliance";
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
              <div style={{ position: "absolute", left: 20, top: 13, display: "flex", gap: 10, alignItems: "center" }}><Avatar t="AT" s={34} /><div><div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{ADMIN}</div><div style={{ fontSize: 12, color: GRAY }}>Role: Trainer</div></div></div>
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
  const vis = [TEAM[0], NINA, TEAM[3], TEAM[37], TEAM[45], TEAM[12], TEAM[38], TEAM[20], TEAM[43], TEAM[47]];
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
      <PortalTag n={3} label="Training provider portal" url="admin view" />
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
                      <div style={{ position: "absolute", left: 760, top: 20 }}><span style={{ fontSize: 12.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: BLUE_SOFT, color: BLUE }}>Customer Care & Compliance</span></div>
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
                <div style={{ position: "absolute", left: 40, top: 478, width: 600, height: 130, borderRadius: 8, border: `1px solid ${g >= 244 && g < 330 ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: g >= 244 && g < 330 ? "0 0 0 3px #C7D2FE" : "none", padding: "12px 14px", boxSizing: "border-box", fontSize: 15, color: INK, lineHeight: 1.5 }}>{typed(g, 248, "Nina turned it around in one week and finished every module. Great work!", 1.1) || <span style={{ color: "#9CA3AF" }}>Enter your testimonial here...</span>}</div>
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
                        <div style={{ position: "absolute", left: 520, top: 23, fontSize: 14, color: INK }}>Customer Care & Compliance</div>
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
  const steps = [["📊", "See who's behind", "Program Leaderboard", "#EF4444"], ["✉️", "Nudge them", "Email + weekly schedule", "#2563EB"], ["🎓", "Certify who's done", "Certificate generator", "#22C55E"]];
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
          Stop chasing. <span style={{ color: "#7FA0FF" }}>Start finishing.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  t0: SceneHook, t1: SceneLeaderboard, t2: SceneBehind, t3: SceneEmail, t4: SceneReports, t5: SceneWeekLater, t6: SceneCertificate, t7: SceneWrap,
};

export const TrainingFollowUpVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "t7" ? TAIL : 0);
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
          <Audio src={staticFile(`followup/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
