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
// MockInterviewVideo — "AI Mock Interviews: Practice Real Conversations Before
// the Real Thing". 1920x1080 feature walkthrough.
// Order: Hook → MainIntro → Branch creates → Learner takes it → Branch evaluates
//        → Learner sees result → progress flows up → Wrap → MainOutro.
// ALL company / branch / people / course data is FICTIONAL (Brightline Home
// Services). UI is rebuilt from the real skillBNK screens, never copied.
// Voice: bash generate-voice-mock.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════

// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  q0: 174,
  q1: 154,
  q2: 125,
  q3: 203,
  q4: 138,
  q5: 176,
  q6: 104,
  q7: 233,
  q8: 86,
  q9: 112,
  q10: 220,
  q11: 127,
  q12: 138,
  q13: 157,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13"];

const PRE = ["q0"] as const; // hook, BEFORE the intro
const POST = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = {
  q0: 240, q1: 190, q2: 170, q3: 380, q4: 190, q5: 230, q6: 150, q7: 400,
  q8: 150, q9: 300, q10: 310, q11: 200, q12: 210, q13: 180,
};
const PACE: Record<Key, number> = {
  q0: 1, q1: 1.05, q2: 1.05, q3: 1.05, q4: 1.05, q5: 1.05, q6: 1.05, q7: 1.05,
  q8: 1.05, q9: 1.05, q10: 1.05, q11: 1.05, q12: 1, q13: 1,
};
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

// ─── Fictional demo data (nothing from the real screenshots) ────────────────
const COMPANY = "Brightline Home Services";
const BRANCH = "Denver Service Center";
const ADMIN = "Daniel Brooks";
const LEARNER = "Maya Robinson";
const PROGRAM = "Customer Service Excellence";
const SESSION = "Fall 2026 Cohort";
const INTERVIEW = "Handling Service Calls";
const TOPIC = "Customer phone calls";
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

/** Brightline Home Services logo (fictional brand, drawn in code) */
const BrightLogo: React.FC<{ sub?: string; s?: number }> = ({ sub = BRANCH, s = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#0B3B5C" />
      <path d="M7 20L19 9l12 11" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <path d="M11 19v11h16V19" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M20 17l-4 7h4l-2 6 6-8h-4l2-5z" fill="#FBBF24" />
    </svg>
    <div>
      <div style={{ fontSize: 16 * s, fontWeight: 900, color: "#0B3B5C", letterSpacing: 1 }}>BRIGHTLINE</div>
      <div style={{ fontSize: 10.5 * s, fontWeight: 600, color: GRAY, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);

const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 38, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.37, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
const MAYA_AV = { t: "MR", c1: "#14B8A6", c2: "#0F766E" };
const DAN_AV = { t: "DB", c1: "#2E64F0", c2: "#1D4ED8" };

const Badge: React.FC<{ t: string; c: string; bg: string; dot?: boolean }> = ({ t, c, bg, dot }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: c, background: bg, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
    {dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />}{t}
  </span>
);
const AIChip: React.FC = () => <span style={{ fontSize: 12.5, fontWeight: 800, color: BLUE, background: "#E0E7FF", padding: "3px 10px", borderRadius: 999 }}>AI</span>;

const PageTitle: React.FC<{ t: string; sub: string; back?: boolean; icon?: boolean }> = ({ t, sub, back, icon }) => (
  <div style={{ position: "absolute", left: 30, top: 14, display: "flex", alignItems: "center", gap: 14 }}>
    {back && <span style={{ fontSize: 24, color: BLUE, fontWeight: 700 }}>←</span>}
    {icon && (
      <div style={{ width: 44, height: 44, borderRadius: 10, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>
      </div>
    )}
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: INK }}>{t}</div>
      <div style={{ fontSize: 15, color: GRAY, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);

// ─── Branch portal shell (sidebar search can type + show a result dropdown) ──
const BR_MENU: { t: string; child?: boolean; more?: boolean }[] = [
  { t: "Dashboard" }, { t: "Leaderboard" }, { t: "Students Management", more: true },
  { t: "Courses & Programs", more: true }, { t: "Content Management", more: true }, { t: "Interviews", more: true },
  { t: "Mock Interviews", child: true },
  { t: "Communication", more: true }, { t: "Attendance", more: true }, { t: "Marketing Tools", more: true },
  { t: "Billing & Certificate", more: true }, { t: "Staff Management", more: true }, { t: "Integrations" }, { t: "Institute Settings" },
];
const BranchShell: React.FC<{ active?: string; search?: string; focus?: number; drop?: number; dropHover?: number; children: React.ReactNode }> = ({ active = "Dashboard", search = "", focus = 0, drop = 0, dropHover = 0, children }) => {
  const showMock = active === "Mock Interviews";
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box", zIndex: 5 }}>
        <div style={{ padding: "2px 6px 10px" }}><BrightLogo /></div>
        <div style={{ height: 34, borderRadius: 8, border: `1.5px solid ${focus > 0.5 ? "#818CF8" : LINE}`, boxShadow: focus > 0.5 ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 14, color: search ? INK : "#9CA3AF", fontWeight: search ? 600 : 400 }}>
          <span style={{ color: "#9CA3AF" }}>⌕</span>{search || "Search menu..."}{focus > 0.5 && <span style={{ color: BLUE, marginLeft: -6 }}>|</span>}
        </div>
        {drop > 0.01 && (
          <div style={{ position: "absolute", left: 12, top: 102, width: SIDE - 24, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, boxShadow: "0 16px 40px #0F172A33", opacity: drop, transform: `translateY(${(1 - drop) * -8}px)`, zIndex: 30, padding: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, letterSpacing: 1, padding: "4px 8px" }}>RESULTS</div>
            <div style={{ borderRadius: 8, padding: "8px 10px", background: dropHover > 0.5 ? BLUE_SOFT : "#F9FAFB" }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: dropHover > 0.5 ? BLUE : INK }}>Mock Interviews</div>
              <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Interviews › Mock Interviews</div>
            </div>
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          {BR_MENU.filter((m) => !m.child || showMock).map((m) => {
            const on = m.t === active;
            const open = m.t === "Interviews" && showMock;
            return (
              <div key={m.t} style={{ height: 36, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 6, paddingRight: 6, borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
                {!m.child && <Ico c={on ? BLUE : "#4B5563"} s={14} />}
                <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
                {m.more && !open && <Chevron />}
                {open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
        <Ico s={18} />
        <div style={{ height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK }}>
          <Ico c={BLUE} s={14} /><b>Branch:</b> {BRANCH} <span style={{ color: "#9CA3AF" }}>⌃⌄</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ height: 38, padding: "0 16px", borderRadius: 9, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>View Attendance</div>
        <div style={{ height: 38, padding: "0 16px", borderRadius: 9, background: BLUE_SOFT, color: BLUE, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>Branch Manual</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>💬</div>
        <div style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔<span style={{ position: "absolute", top: -4, right: -4, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>2</span></div>
        <Avatar t={DAN_AV.t} c1={DAN_AV.c1} c2={DAN_AV.c2} />
      </div>
      <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
    </>
  );
};

// ─── Learner portal shell (sidebar matches the real learner portal) ─────────
const LR_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "My Courses", more: true }, { t: "Documents", more: true }, { t: "Calendar", more: true },
  { t: "Interviews", open: true }, { t: "Mock Interviews", child: true }, { t: "Chat" }, { t: "Community" }, { t: "My Notes" },
];
const LR_ITEM_Y = (i: number) => 70 + i * 40; // top of sidebar item i (content coords)
const LearnerShell: React.FC<{ active?: string; press?: string; children: React.ReactNode }> = ({ active = "Mock Interviews", press, children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ padding: "2px 6px 14px" }}><BrightLogo sub="Learning Portal" /></div>
      {LR_MENU.map((m, i) => {
        const on = m.t === active || m.t === press;
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: LR_ITEM_Y(i), width: SIDE - 24, height: 38, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 8, paddingRight: 8, boxSizing: "border-box", borderRadius: 7, background: on ? "#F1F2F4" : "transparent", borderLeft: m.child ? `2px solid ${LINE}` : "none", color: "#1F2937", fontSize: 14.5, fontWeight: on ? 700 : 500 }}>
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
      <div style={{ height: 36, borderRadius: 999, background: "#F3F4F6", display: "flex", alignItems: "center", padding: 3, gap: 2 }}>
        <div style={{ height: 30, padding: "0 12px", borderRadius: 999, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center" }}>EN</div>
        <div style={{ height: 30, padding: "0 12px", color: GRAY, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center" }}>ES</div>
      </div>
      <div style={{ height: 38, borderRadius: 999, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, fontSize: 14, fontWeight: 600, color: INK }}>🎓 {PROGRAM} <span style={{ color: "#9CA3AF" }}>⌄</span></div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>💬</div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📅</div>
      <Avatar t={MAYA_AV.t} c1={MAYA_AV.c1} c2={MAYA_AV.c2} />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);

// NOTE on coordinates for product scenes:
//   • Camera keys and Cursor positions use CONTENT coords (x from the window's left edge,
//     y from just below the browser bar). Wide shot = (800, 428, 1).
//   • Shell main areas start at x = SIDE and y = HEAD.
const CamC: React.FC<{ g: number; keys: CamKey[]; children: React.ReactNode }> = ({ g, keys, children }) => (
  <Camera g={g} keys={keys.map((k) => [k[0], k[1], k[2] + BAR, k[3]] as CamKey)}>{children}</Camera>
);
const WIDE_X = 800;
const WIDE_Y = 428;
const MX = (x: number) => SIDE + x; // main-area x → content x
const MY = (y: number) => HEAD + y; // main-area y → content y

const Dim: React.FC<{ o: number }> = ({ o }) => (o > 0.01 ? <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * o})`, zIndex: 40 }} /> : null);

// ─── Branch: Mock Interviews list page ───────────────────────────────────────
const BR_ROWS = [
  { n: "Booking Appointments", aud: "Programs · 1", by: ADMIN, d: "Sep 18, 2026", on: true, q: 6 },
  { n: "Handling Complaints", aud: "Users · 8", by: ADMIN, d: "Sep 11, 2026", on: true, q: 8 },
  { n: "Upselling Maintenance Plans", aud: "Programs · 1", by: "Rachel Kim", d: "Aug 29, 2026", on: false, q: 5 },
  { n: "Phone Etiquette Basics", aud: "Users · 12", by: "Rachel Kim", d: "Aug 14, 2026", on: true, q: 7 },
  { n: "Scheduling Follow-ups", aud: "Programs · 1", by: ADMIN, d: "Jul 30, 2026", on: true, q: 6 },
];
const BR_COLS: [string, number][] = [["SN", 30], ["Interview Name", 80], ["Type", 420], ["Audience", 510], ["Created By", 680], ["Updated", 860], ["Status", 1010], ["Questions", 1110], ["Action", 1220]];
const BranchListPage: React.FC<{ g: number; fps: number; newAt?: number; pressAdd?: boolean; pressAnswer?: boolean; hoverRow?: number }> = ({ g, fps, newAt, pressAdd, pressAnswer, hoverRow = -1 }) => {
  const nw = newAt === undefined ? 0 : sp(g, newAt, fps);
  const rows = newAt !== undefined && g >= newAt ? [{ n: INTERVIEW, aud: "Programs · 1", by: ADMIN, d: "Sep 30, 2026", on: true, q: 5, isNew: true }, ...BR_ROWS.map((r) => ({ ...r, isNew: false }))] : BR_ROWS.map((r) => ({ ...r, isNew: false }));
  return (
    <>
      <PageTitle t="Mock Interviews" sub="Simulated practice interviews to prepare for real ones" />
      <Btn x={660} y={20} w={80} h={40} label="🗑 Trash" fs={13.5} />
      <Btn x={750} y={20} w={120} h={40} label="⇪ Bulk Upload" fs={13.5} />
      <Btn x={880} y={20} w={90} h={40} label="⚲ Filters" fs={13.5} />
      <Btn x={980} y={20} w={200} h={40} label="Mock Interview Answer" soft fs={13.5} press={pressAnswer ? 1 : 0} />
      <Btn x={1190} y={20} w={130} h={40} label="+ Add New" primary fs={14} press={pressAdd ? 1 : 0} />
      <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1310, height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
        {BR_COLS.map(([t, x]) => <div key={t} style={{ position: "absolute", left: x, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t}</div>)}
        {rows.map((r, i) => {
          const isNew = r.isNew;
          const y = 50 + (isNew ? 0 : (i - (newAt !== undefined && g >= newAt ? 1 : 0)) * 66 + (newAt !== undefined && g >= newAt ? 66 * nw : 0));
          const hl = isNew ? Math.max(0.25, 1 - Math.max(0, g - newAt! - 20) / 60) : hoverRow === i ? 0.5 : 0;
          return (
            <div key={r.n} style={{ position: "absolute", left: 0, top: y, width: 1310, height: 66, borderBottom: `1px solid ${LINE}`, background: isNew ? `rgba(220,252,231,${hl})` : hl ? "#F5F7FF" : "transparent", opacity: isNew ? nw : 1, transform: isNew ? `translateX(${(1 - nw) * 40}px)` : undefined }}>
              <div style={{ position: "absolute", left: 34, top: 22, fontSize: 15, color: GRAY }}>{i + 1}</div>
              <div style={{ position: "absolute", left: 80, top: 13, fontSize: 15.5, fontWeight: 700, color: INK, display: "flex", gap: 8, alignItems: "center" }}>{r.n}{isNew && <Badge t="New" c="#fff" bg={GREEN} />}</div>
              <div style={{ position: "absolute", left: 80, top: 37, fontSize: 12.5, color: GRAY }}>{isNew ? TOPIC : "Customer service"}</div>
              <div style={{ position: "absolute", left: 420, top: 20 }}><AIChip /></div>
              <div style={{ position: "absolute", left: 510, top: 21, fontSize: 14.5, color: INK }}>{r.aud}</div>
              <div style={{ position: "absolute", left: 680, top: 17, display: "flex", gap: 8, alignItems: "center", fontSize: 14.5, color: INK }}><Avatar t={r.by === ADMIN ? "DB" : "RK"} s={30} c1={r.by === ADMIN ? "#2E64F0" : "#F59E0B"} c2={r.by === ADMIN ? "#1D4ED8" : "#D97706"} />{r.by}</div>
              <div style={{ position: "absolute", left: 860, top: 21, fontSize: 14.5, color: INK }}>{r.d}</div>
              <div style={{ position: "absolute", left: 1010, top: 19 }}>{r.on ? <Badge t="Active" c={GREEN} bg="#DCFCE7" dot /> : <Badge t="Inactive" c={GRAY} bg="#F3F4F6" dot />}</div>
              <div style={{ position: "absolute", left: 1130, top: 21, fontSize: 15, fontWeight: 700, color: INK }}>{r.q}</div>
              <div style={{ position: "absolute", left: 1220, top: 16, display: "flex", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✎</div>
                <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${LINE}`, color: GRAY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⋮</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ─── Blue stats bar (learner interview page + branch mark page) ──────────────
const StatsBar: React.FC<{ y: number; items: [string, string][]; hl?: number }> = ({ y, items, hl = -1 }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: W - SIDE, height: 104, background: "linear-gradient(90deg,#1D4ED8 0%,#2B3FD6 55%,#4338CA 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
    {items.map(([k, v], i) => (
      <div key={k} style={{ padding: "12px 20px", borderRadius: 10, background: i === hl ? "#ffffff38" : "#ffffff1F", border: i === hl ? "1px solid #ffffff80" : "1px solid transparent", display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #C7D2FE" }} />
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#E0E7FF", letterSpacing: 1 }}>{k}</div>
          <div style={{ fontSize: 18.5, fontWeight: 700, color: "#fff", marginTop: 3, whiteSpace: "nowrap" }}>{v}</div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Learner: AI Mock Interview page (start / pending / result states) ───────
const FEEDBACK = "Calm, friendly opening. You apologized, confirmed the address and gave a clear new arrival time. Next time, offer a concrete option sooner when the customer asks for a discount.";
const COMMENT = "Great work, Maya! Let's role-play the discount question on Friday.";
const LearnerInterviewPage: React.FC<{ g: number; fps: number; state: "start" | "pending" | "result"; pressStart?: boolean; hlRule?: number; score?: number }> = ({ g, fps, state, pressStart, hlRule = 0, score = 85 }) => {
  const done = state !== "start";
  const items: [string, string][] = done
    ? [["DURATION", "10 minutes"], ["STATUS", "Completed"], ["COMPLEXITY", "Medium"], ["SCORE", `${state === "result" ? score : 0}/100`], ["STARTED", "Sep 30, 2026, 10:02 AM"], ["COMPLETED", "Sep 30, 2026, 10:12 AM"]]
    : [["DURATION", "10 minutes"], ["STATUS", "Not Started"], ["COMPLEXITY", "Medium"]];
  const CX = 245; const CW = 860;
  return (
    <>
      <PageTitle t="AI Mock Interview" sub="Practice your interview skills with an AI-powered interviewer" back icon />
      {done && (
        <>
          <Btn x={760} y={22} w={140} h={40} label="▷ View History" primary fs={13.5} />
          <Btn x={910} y={22} w={120} h={40} label="Add Note" fs={13.5} />
          <Btn x={1040} y={22} w={130} h={40} label="✉ Send Email" fs={13.5} />
          <Btn x={1180} y={22} w={150} h={40} label="Add to Calendar" fs={13.5} />
        </>
      )}
      <StatsBar y={84} items={items} hl={state === "result" ? 3 : -1} />
      <div style={{ position: "absolute", left: CX, top: 206, width: CW, height: state === "start" ? 470 : 568, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, boxShadow: "0 2px 10px #0000000A" }}>
        <div style={{ position: "absolute", left: 22, top: 18, fontSize: 23, fontWeight: 800, color: INK }}>Interview title: <span style={{ fontWeight: 600, color: "#374151" }}>{INTERVIEW}</span></div>
        {state === "start" && (
          <div style={{ position: "absolute", left: 18, top: 66, width: CW - 36, height: 300, borderRadius: 10, border: `1px solid ${LINE}`, background: "#FAFAFB", padding: "14px 18px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Instructions & Rules</div>
            <div style={{ marginTop: 8, fontSize: 14.5, color: "#EA580C", fontWeight: 600 }}>Important: once you start, the interview runs until it's complete.</div>
            <div style={{ marginTop: 6, fontSize: 14, color: "#4B5563" }}>It's submitted automatically when the time runs out.</div>
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: "#374151" }}>How it works:</div>
            {["The AI asks a series of questions", "You answer each question out loud", "A microphone gives the best results", "Finish within the time limit"].map((t, i) => (
              <div key={t} style={{ marginTop: 5, fontSize: 14.5, color: "#374151", display: "flex", gap: 10, alignItems: "center", padding: "2px 8px", marginLeft: -8, borderRadius: 6, background: i === 1 ? `rgba(254,243,199,${hlRule})` : "transparent", fontWeight: i === 1 && hlRule > 0.5 ? 700 : 400 }}>• {t}</div>
            ))}
            <div style={{ marginTop: 10, height: 36, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", gap: 12, padding: "0 14px", fontSize: 14, color: BLUE, fontWeight: 600 }}>🎙 🔊 Make sure your microphone and speakers are working</div>
          </div>
        )}
        {state === "start" && <Btn x={CW / 2 - 100} y={396} w={200} h={46} label="▷ Start Interview" primary fs={15.5} press={pressStart ? 1 : 0} />}
        {state === "pending" && (
          <div style={{ position: "absolute", left: 18, top: 66, width: CW - 36, height: 330, borderRadius: 10, background: "#F3F4F6", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30, boxSizing: "border-box" }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" style={{ transform: `rotate(${(g * 3) % 360}deg)` }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l3 2" /></svg>
            <div style={{ marginTop: 16, fontSize: 26, fontWeight: 800, color: INK }}>Pending Review</div>
            <div style={{ marginTop: 12, fontSize: 16, color: "#4B5563", textAlign: "center", lineHeight: 1.5, width: 520 }}>Your interview has been submitted. Results and feedback will appear here once the review is complete.</div>
            <div style={{ marginTop: 18, padding: "10px 18px", borderRadius: 8, background: "#FFFBEB", border: "1px solid #FDE68A", fontSize: 14.5, color: "#92400E", fontStyle: "italic" }}>Every practice call makes the real one easier.</div>
          </div>
        )}
        {state === "result" && (() => {
          const ring = sp(g, 30, fps, { damping: 20 });
          return (
            <div style={{ position: "absolute", left: 18, top: 66, width: CW - 36, height: 330, borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", boxSizing: "border-box" }}>
              <svg width="170" height="170" viewBox="0 0 170 170" style={{ position: "absolute", left: 40, top: 70 }}>
                <circle cx="85" cy="85" r="70" fill="none" stroke="#DCFCE7" strokeWidth="14" />
                <circle cx="85" cy="85" r="70" fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${440 * 0.85 * ring} 440`} transform="rotate(-90 85 85)" />
                <text x="85" y="84" textAnchor="middle" fontSize="40" fontWeight="800" fill={INK} fontFamily={FONT}>{Math.round(85 * ring)}</text>
                <text x="85" y="110" textAnchor="middle" fontSize="16" fill={GRAY} fontFamily={FONT}>/ 100</text>
              </svg>
              <div style={{ position: "absolute", left: 250, top: 34, fontSize: 25, fontWeight: 800, color: GREEN }}>Excellent! Reviewed ✓</div>
              <div style={{ position: "absolute", left: 250, top: 72, fontSize: 15, color: "#374151" }}>You have a strong and solid foundation.</div>
              <div style={{ position: "absolute", left: 250, top: 112, fontSize: 14, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>FEEDBACK</div>
              <div style={{ position: "absolute", left: 250, top: 136, width: 540, fontSize: 16, color: INK, lineHeight: 1.55 }}>{FEEDBACK}</div>
            </div>
          );
        })()}
        {done && (
          <div style={{ position: "absolute", left: 18, top: 410, width: CW - 36, height: 140, borderRadius: 10, background: "#F9FAFB", padding: "12px 16px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>Comments</div>
            {state === "result" ? (
              <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
                <Avatar t={DAN_AV.t} s={36} c1={DAN_AV.c1} c2={DAN_AV.c2} />
                <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 10, padding: "8px 14px", flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: INK }}>{ADMIN} <span style={{ fontWeight: 500, color: GRAY }}>· Branch · 5 min ago</span></div>
                  <div style={{ fontSize: 15, color: "#374151", marginTop: 3 }}>{COMMENT}</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar t={MAYA_AV.t} s={36} c1={MAYA_AV.c1} c2={MAYA_AV.c2} />
                  <div style={{ flex: 1, height: 38, borderRadius: 8, background: "#fff", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14.5, color: "#9CA3AF" }}>Type your comment</div>
                </div>
                <div style={{ marginTop: 10, textAlign: "center", fontSize: 14, color: GRAY }}>No comments yet</div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// ═══ q0 — HOOK: managers running practice calls one by one ════════════════════
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 240;
  const g = gt(f, dur, D);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const names = ["Jordan", "Priya", "Marcus", "Chloe", "Ethan", "Sofia", "Liam", "Ava", "Noah", "Zoe", "Owen", "Mia", "Lucas", "Ella", "Ryan", "Nora", "Caleb", "Ivy"];
  const slots = names.map((n, i) => ({ n, d: i % 5, h: Math.floor(i / 5) * 2 + (i % 2), at: 20 + i * 8 }));
  const hours = Math.round(interpolate(g, [20, 170], [0, 18], cl));
  const lines = [
    { t: "Every new hire needs practice calls.", at: 10, c: "#F1F5F9" },
    { t: "Managers run them one by one.", at: 80, c: "#FDBA74" },
    { t: "Hours gone, every single week.", at: 150, c: "#FCA5A5" },
  ];
  const CAL = { x: 150, y: 170, w: 900, h: 700 };
  const colW = (CAL.w - 80) / 5;
  const rowH = (CAL.h - 70) / 8;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: CAL.x, top: CAL.y, width: CAL.w, height: CAL.h, borderRadius: 20, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF655", boxShadow: "0 30px 80px #000A", opacity: fi(g, 0, 12), overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 24, top: 18, fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>Manager's calendar <span style={{ color: "#8A96B2", fontWeight: 600, fontSize: 17 }}>· this week</span></div>
          {days.map((d, i) => <div key={d} style={{ position: "absolute", left: 80 + i * colW, top: 64, width: colW, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#8A96B2" }}>{d}</div>)}
          {Array.from({ length: 8 }).map((_, r) => (
            <React.Fragment key={r}>
              <div style={{ position: "absolute", left: 20, top: 96 + r * rowH, fontSize: 13, color: "#5B6784" }}>{9 + r}:00</div>
              <div style={{ position: "absolute", left: 80, top: 92 + r * rowH, width: CAL.w - 100, height: 1, background: "#ffffff10" }} />
            </React.Fragment>
          ))}
          {slots.map((s) => {
            const p = sp(g, s.at, fps, { damping: 13 });
            return (
              <div key={s.n} style={{ position: "absolute", left: 84 + s.d * colW, top: 96 + s.h * rowH, width: colW - 10, height: rowH - 8, borderRadius: 9, background: "linear-gradient(135deg,#F97316,#EA580C)", opacity: p, transform: `scale(${0.6 + 0.4 * p})`, padding: "6px 10px", boxSizing: "border-box", boxShadow: "0 6px 16px #0006" }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>Practice call</div>
                <div style={{ fontSize: 12, color: "#FFEDD5" }}>with {s.n}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 1120, top: 240, width: 720 }}>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 12, padding: "14px 26px", borderRadius: 16, background: "#F9731622", border: "1px solid #F9731688", opacity: fi(g, 16, 10) }}>
            <span style={{ fontSize: 72, fontWeight: 900, color: "#FDBA74", fontVariantNumeric: "tabular-nums" }}>{hours}</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#FDBA74" }}>hours / week</span>
          </div>
          <div style={{ marginTop: 40 }}>
            {lines.map((l) => {
              const o = fi(g, l.at, 12);
              return <div key={l.t} style={{ fontSize: 46, fontWeight: 800, color: l.c, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, lineHeight: 1.3, marginTop: 14, letterSpacing: -0.5 }}>{l.t}</div>;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ q1 — BRANCH: dashboard → sidebar search "mock" → Mock Interviews ═════════
const BranchDashboard: React.FC = () => (
  <>
    <PageTitle t={`Welcome back, Daniel`} sub={`${BRANCH} · here's what's happening today`} />
    {[["Active learners", "46"], ["Courses running", "8"], ["Classes this week", "5"], ["Mock interviews", "12"]].map(([k, v], i) => (
      <div key={k} style={{ position: "absolute", left: 20 + i * 330, top: 96, width: 310, height: 120, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "18px 22px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 15, color: GRAY, fontWeight: 600 }}>{k}</div>
        <div style={{ fontSize: 38, fontWeight: 800, color: INK, marginTop: 6 }}>{v}</div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 20, top: 236, width: 820, height: 540, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
      <div style={{ position: "absolute", left: 22, top: 18, fontSize: 18, fontWeight: 700, color: INK }}>Learner activity</div>
      {[52, 64, 58, 72, 80, 68, 86, 78, 90, 84, 92, 88].map((v, i) => (
        <div key={i} style={{ position: "absolute", left: 50 + i * 62, bottom: 50, width: 34, height: v * 4.2, borderRadius: 6, background: i === 11 ? BLUE : "#C7D2FE" }} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 860, top: 236, width: 470, height: 540, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "18px 22px", boxSizing: "border-box" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>Recent activity</div>
      {["Jordan Blake finished “Booking Appointments”", "Priya Nair joined Fall 2026 Cohort", "Marcus Lee submitted an assignment", "New class: Service Calls 101"].map((t, i) => (
        <div key={t} style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center", fontSize: 14.5, color: "#374151" }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: ["#22C55E", BLUE, ORANGE, "#A855F7"][i] }} />{t}</div>
      ))}
    </div>
  </>
);
const SceneBranchSearch: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const onList = g >= 104;
  const SEARCH = { x: 120, y: 81 };
  const ITEM = { x: 120, y: 152 };
  const cur = path(g, [[0, 700, 520], [26, SEARCH.x, SEARCH.y], [32, SEARCH.x, SEARCH.y], [70, SEARCH.x + 30, SEARCH.y + 20], [92, ITEM.x, ITEM.y], [150, ITEM.x, ITEM.y], [190, 700, 500]]);
  const ripple = Math.max(rip(g, 30), rip(g, 100));
  const search = onList ? "" : typed(g, 38, "mock", 0.2);
  const drop = onList ? 0 : fi(g, 60, 8);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 300, 200, 2.0], [98, 300, 200, 2.0], [128, WIDE_X, WIDE_Y, 1], [190, WIDE_X, WIDE_Y, 1]];
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onList ? "branch.skillbnk.com/interviews/mock-interviews" : "branch.skillbnk.com/dashboard"}>
          <BranchShell active={onList ? "Mock Interviews" : "Dashboard"} search={search} focus={!onList && g >= 30 ? 1 : 0} drop={drop} dropHover={g >= 88 ? 1 : 0}>
            {onList ? <div style={{ position: "absolute", inset: 0, opacity: fi(g, 104, 12) }}><BranchListPage g={g} fps={fps} /></div> : <BranchDashboard />}
          </BranchShell>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q2 — BRANCH: the Mock Interviews list → + Add New ══════════════════════
const SceneBranchList: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 170;
  const g = gt(f, dur, D);
  const ADD = { x: MX(1255), y: MY(40) };
  const hoverRow = g > 30 && g < 100 ? Math.min(4, Math.floor((g - 30) / 16)) : -1;
  const cur = path(g, [[0, 700, 500], [30, MX(300), MY(50 + 90 + 33)], [96, MX(300), MY(50 + 90 + 4 * 66 + 33)], [132, ADD.x, ADD.y], [170, ADD.x, ADD.y]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [28, 760, 380, 1.3], [100, 760, 380, 1.3], [124, 1400, 110, 1.6], [170, 1400, 110, 1.6]];
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/interviews/mock-interviews">
          <BranchShell active="Mock Interviews">
            <BranchListPage g={g} fps={fps} pressAdd={g >= 140 && g < 146} hoverRow={hoverRow} />
          </BranchShell>
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 140)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q3 — BRANCH: Add Interview (AI) → + Add Interview → new row in the list ═
const QUESTIONS = [
  "How do you open a call with an upset homeowner?",
  "The technician is running two hours late. What do you say?",
  "What if the customer asks for a discount you can't approve?",
];
const INSTRUCTION = "Play a homeowner whose technician is running late. Stay polite but firm, and ask follow-up questions.";
const GREETING = "Hi! Thanks for joining. Let's practice a real service call together.";
const SceneAddInterview: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = gt(f, dur, D);
  const toList = g >= 326;
  const glow = (a: number, b: number) => (g >= a && g < b ? 1 : 0);
  const cur = path(g, [
    [0, MX(1255), MY(40)], [14, 494, 256], [62, 494, 256], [68, 918, 256], [102, 918, 256], [108, 1237, 256], [118, 1456, 256],
    [138, 918, 342], [158, 1349, 342], [176, 606, 454], [196, 1249, 454], [240, 1249, 454], [300, 1471, 773], [380, 1471, 773],
  ]);
  const ripple = Math.max(rip(g, 16), rip(g, 70), rip(g, 110), rip(g, 120), rip(g, 140), rip(g, 160), rip(g, 178), rip(g, 198), rip(g, 310));
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [14, 710, 250, 1.5], [100, 710, 250, 1.5], [114, 1250, 250, 1.5], [128, 1250, 250, 1.5],
    [142, 930, 330, 1.4], [170, 930, 330, 1.4], [184, 930, 440, 1.35], [238, 930, 440, 1.35], [252, 930, 620, 1.35],
    [290, 930, 620, 1.35], [302, 1350, 760, 1.5], [322, 1350, 760, 1.5], [342, 800, 300, 1.3], [380, 800, 300, 1.3],
  ];
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={toList ? "branch.skillbnk.com/interviews/mock-interviews" : "branch.skillbnk.com/interviews/mock-interviews/new"}>
          <BranchShell active="Mock Interviews">
            {toList ? (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 326, 10) }}><BranchListPage g={g} fps={fps} newAt={336} /></div>
            ) : (
              <div style={{ position: "absolute", inset: 0, opacity: fi(g, 0, 8) }}>
                <PageTitle t="Add Interview" sub="Create a practice interview for your learners" back />
                <div style={{ position: "absolute", left: 30, top: 80, height: 40, display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "#E5E7EB" }}>
                  <div style={{ width: 110, borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✨ AI</div>
                  <div style={{ width: 110, borderRadius: 8, color: "#374151", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Manual</div>
                </div>
                <div style={{ position: "absolute", left: 20, top: 130, width: 1310, height: 656, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
                <Field x={44} y={146} w={400} label="Interview Title" req value={typed(g, 20, INTERVIEW, 0.6)} ph="Enter interview title" glow={glow(16, 64)} />
                <Field x={468} y={146} w={400} label="Interview Topic" req value={typed(g, 72, TOPIC, 0.75)} ph="e.g. Customer service" glow={glow(68, 104)} />
                <Field x={892} y={146} w={190} label="Duration (minutes)" value={g >= 110 ? "10" : ""} ph="0" glow={glow(108, 118)} />
                <Field x={1106} y={146} w={200} label="Complexity" select value={g >= 124 ? "Medium" : ""} ph="Select" glow={glow(120, 136)} />
                <div style={{ position: "absolute", left: 44, top: 232, fontSize: 15, fontWeight: 600, color: "#374151" }}>Assign to</div>
                <div style={{ position: "absolute", left: 44, top: 262, display: "flex", gap: 22, fontSize: 15, color: INK }}>
                  <span style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 16, height: 16, borderRadius: "50%", border: `5px solid ${BLUE}`, boxSizing: "border-box" }} />Program / Session</span>
                  <span style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #9CA3AF", boxSizing: "border-box" }} />Specific users</span>
                </div>
                <Field x={468} y={232} w={400} label="Program" select value={g >= 146 ? PROGRAM : ""} ph="Select program" glow={glow(140, 156)} />
                <Field x={892} y={232} w={414} label="Session" select value={g >= 166 ? SESSION : ""} ph="Select session" glow={glow(160, 176)} />
                <Field x={44} y={318} w={624} h={96} label="Instruction" value={typed(g, 182, INSTRUCTION, 2.4)} ph="Tell the AI how to run this interview" glow={glow(178, 236)} />
                <Field x={692} y={318} w={614} h={96} label="Interviewer Greeting" value={typed(g, 202, GREETING, 2.0)} ph="How the AI says hello" glow={glow(198, 244)} />
                <div style={{ position: "absolute", left: 44, top: 454, fontSize: 15, fontWeight: 600, color: "#374151" }}>Custom Questions <span style={{ color: GRAY, fontWeight: 500 }}>· the AI asks these, then follows up on its own</span></div>
                <Btn x={1166} y={446} w={140} h={36} label="+ Add question" soft fs={13.5} />
                {QUESTIONS.map((q, i) => {
                  const p = sp(g, 246 + i * 14, fps);
                  return (
                    <div key={q} style={{ position: "absolute", left: 44, top: 494 + i * 54, width: 1262, height: 44, borderRadius: 8, border: `1px solid ${LINE}`, background: "#F9FAFB", display: "flex", alignItems: "center", gap: 12, padding: "0 14px", boxSizing: "border-box", opacity: p, transform: `translateX(${(1 - p) * 30}px)`, fontSize: 15.5, color: INK }}>
                      <span style={{ width: 26, height: 26, borderRadius: "50%", background: BLUE_SOFT, color: BLUE, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>{q}
                      <span style={{ marginLeft: "auto", color: "#9CA3AF" }}>⋮⋮</span>
                    </div>
                  );
                })}
                <Btn x={1010} y={690} w={116} h={46} label="Cancel" />
                <Btn x={1136} y={690} w={170} h={46} label="+ Add Interview" primary press={g >= 310 && g < 316 ? 1 : 0} />
              </div>
            )}
          </BranchShell>
          <Toast g={g} at={316} text="Interview created · assigned to Fall 2026 Cohort" x={930} y={70} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} opacity={toList ? fo(g, 330, 10) : 1} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q4 — LEARNER: sidebar Mock Interviews → the new interview is waiting ════
const LR_ROWS = [
  { n: INTERVIEW, tp: TOPIC, du: "10 min", dl: "Oct 31, 2026", st: "new", cx: "Medium", mk: "—", cr: "Sep 30, 2026" },
  { n: "Booking Appointments", tp: "Scheduling", du: "8 min", dl: "No due date", st: "done", cx: "Easy", mk: "92", cr: "Sep 18, 2026" },
  { n: "Handling Complaints", tp: "Service recovery", du: "12 min", dl: "No due date", st: "done", cx: "Medium", mk: "88", cr: "Sep 11, 2026" },
  { n: "Phone Etiquette Basics", tp: "Greetings & tone", du: "6 min", dl: "No due date", st: "done", cx: "Easy", mk: "95", cr: "Aug 14, 2026" },
  { n: "Upselling Maintenance Plans", tp: "Sales", du: "10 min", dl: "No due date", st: "inc", cx: "Hard", mk: "—", cr: "Aug 29, 2026" },
];
const CX_BADGE: Record<string, [string, string]> = { Easy: ["#15803D", "#DCFCE7"], Medium: ["#A16207", "#FEF9C3"], Hard: ["#DC2626", "#FEE2E2"] };
const LearnerListPage: React.FC<{ g: number; fps: number; showAt: number; hover?: boolean }> = ({ g, fps, showAt, hover }) => {
  const cols: [string, number][] = [["Interview Name", 24], ["Topic", 300], ["Type", 480], ["Duration", 560], ["Deadline", 670], ["Status", 810], ["Complexity", 940], ["Mark", 1060], ["Created", 1120], ["Actions", 1240]];
  return (
    <>
      <PageTitle t="Interview Practice" sub="Practical sessions to sharpen your interview technique" back />
      <div style={{ position: "absolute", left: 760, top: 22, width: 280, height: 40, borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>⌕ Search by name...</div>
      <Btn x={1050} y={22} w={130} h={40} label="Filter by type ⌄" fs={13.5} />
      <Btn x={1190} y={22} w={140} h={40} label="Latest Created ⌄" fs={13.5} />
      <div style={{ position: "absolute", left: 20, top: 84, height: 44, display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}` }}>
        {["Assigned Interviews (5)", "Completed Interviews (3)", "Incomplete Interviews (1)", "Shared with me (0)"].map((t, i) => (
          <div key={t} style={{ padding: "0 16px", borderRadius: 8, background: i === 0 ? BLUE : "transparent", color: i === 0 ? "#fff" : "#374151", fontWeight: i === 0 ? 800 : 600, fontSize: 14.5, display: "flex", alignItems: "center" }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 20, top: 142, width: 1310, height: 640, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1310, height: 48, borderBottom: `1px solid ${LINE}` }} />
        {cols.map(([t, x]) => <div key={t} style={{ position: "absolute", left: x, top: 14, fontSize: 14, fontWeight: 600, color: "#374151" }}>{t}</div>)}
        {LR_ROWS.map((r, i) => {
          const isNew = r.st === "new";
          const p = isNew ? sp(g, showAt + 14, fps) : 1;
          const pulse = isNew ? 0.35 + 0.25 * Math.sin(g / 7) : 0;
          return (
            <div key={r.n} style={{ position: "absolute", left: 0, top: 48 + i * 68, width: 1310, height: 68, borderBottom: `1px solid ${LINE}`, background: isNew ? `rgba(219,234,254,${hover ? 0.9 : pulse})` : "transparent", opacity: p, transform: isNew ? `translateY(${(1 - p) * -20}px)` : undefined, boxShadow: isNew ? `inset 4px 0 0 ${BLUE}` : "none" }}>
              <div style={{ position: "absolute", left: 24, top: 14, width: 40, height: 40, borderRadius: 8, background: ["linear-gradient(135deg,#1D3FD6,#0EA5E9)", "linear-gradient(135deg,#0F766E,#14B8A6)", "linear-gradient(135deg,#7C3AED,#A855F7)", "linear-gradient(135deg,#EA580C,#F59E0B)", "linear-gradient(135deg,#DB2777,#F472B6)"][i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>🎧</div>
              <div style={{ position: "absolute", left: 76, top: 14, fontSize: 15, fontWeight: 700, color: isNew && hover ? BLUE : INK, whiteSpace: "nowrap", width: 214, overflow: "hidden", textOverflow: "ellipsis", textDecoration: isNew && hover ? "underline" : "none" }}>{r.n}</div>
              <div style={{ position: "absolute", left: 76, top: 37, fontSize: 13, color: GRAY }}>AI Interview</div>
              <div style={{ position: "absolute", left: 300, top: 24, fontSize: 14.5, fontWeight: 600, color: INK }}>{r.tp}</div>
              <div style={{ position: "absolute", left: 480, top: 21 }}><AIChip /></div>
              <div style={{ position: "absolute", left: 560, top: 24, fontSize: 14.5, fontWeight: 600, color: INK }}>{r.du}</div>
              <div style={{ position: "absolute", left: 670, top: 24, fontSize: 14.5, color: isNew ? INK : GRAY, fontWeight: isNew ? 700 : 400 }}>{r.dl}</div>
              <div style={{ position: "absolute", left: 810, top: 21 }}>{r.st === "new" ? <Badge t="Not started" c={BLUE} bg="#DBEAFE" dot /> : r.st === "done" ? <Badge t="Done" c={GREEN} bg="#DCFCE7" dot /> : <Badge t="Incomplete" c="#C2410C" bg="#FFEDD5" dot />}</div>
              <div style={{ position: "absolute", left: 940, top: 21 }}><Badge t={r.cx} c={CX_BADGE[r.cx][0]} bg={CX_BADGE[r.cx][1]} /></div>
              <div style={{ position: "absolute", left: 1066, top: 23, fontSize: 15.5, fontWeight: 700, color: INK }}>{r.mk}</div>
              <div style={{ position: "absolute", left: 1120, top: 14, fontSize: 14, color: INK, lineHeight: 1.35 }}>{r.cr}<br /><span style={{ color: GRAY, fontSize: 12.5 }}>{isNew ? "9:40 AM" : "3:15 PM"}</span></div>
              <div style={{ position: "absolute", left: 1236, top: 17, display: "flex", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: isNew ? BLUE : BLUE_SOFT, color: isNew ? "#fff" : BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{isNew ? "▶" : "⟲"}</div>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⋮</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
const LearnerDashboard: React.FC = () => (
  <>
    <PageTitle t="Welcome back, Maya" sub={`${PROGRAM} · ${SESSION}`} />
    <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 170, borderRadius: 14, background: "linear-gradient(90deg,#1D4ED8,#4338CA)", color: "#fff", padding: "26px 30px", boxSizing: "border-box" }}>
      <div style={{ fontSize: 15, opacity: 0.85 }}>Your progress</div>
      <div style={{ fontSize: 42, fontWeight: 800, marginTop: 4 }}>64%</div>
      <div style={{ marginTop: 12, width: 600, height: 10, borderRadius: 5, background: "#ffffff33" }}><div style={{ width: "64%", height: 10, borderRadius: 5, background: "#fff" }} /></div>
    </div>
    {[["Lessons", "18 / 26"], ["Assignments", "4 / 6"], ["Mock interviews", "3 done"], ["Next class", "Thu 10:00"]].map(([k, v], i) => (
      <div key={k} style={{ position: "absolute", left: 20 + i * 330, top: 290, width: 310, height: 120, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "18px 22px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 15, color: GRAY, fontWeight: 600 }}>{k}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: INK, marginTop: 6 }}>{v}</div>
      </div>
    ))}
  </>
);
const SceneLearnerList: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const onList = g >= 32;
  const MENU = { x: 130, y: LR_ITEM_Y(5) + 19 };
  const ROW = { x: MX(20 + 150), y: MY(142 + 48 + 34) };
  const cur = path(g, [[0, 700, 500], [22, MENU.x, MENU.y], [30, MENU.x, MENU.y], [70, 800, 560], [140, ROW.x, ROW.y], [190, ROW.x, ROW.y]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [18, 300, 330, 1.6], [34, 300, 330, 1.6], [62, WIDE_X, 380, 1.15], [110, WIDE_X, 380, 1.15], [138, 800, 300, 1.45], [190, 800, 300, 1.45]];
  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onList ? "learner.skillbnk.com/interviews/mock-interviews" : "learner.skillbnk.com/dashboard"}>
          <LearnerShell active={onList ? "Mock Interviews" : "Dashboard"} press={g >= 26 && g < 32 ? "Mock Interviews" : undefined}>
            {onList ? <div style={{ position: "absolute", inset: 0, opacity: fi(g, 32, 10) }}><LearnerListPage g={g} fps={fps} showAt={32} hover={g >= 140} /></div> : <LearnerDashboard />}
          </LearnerShell>
          <Cursor x={cur.x} y={cur.y} ripple={Math.max(rip(g, 28), rip(g, 172))} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q5 — LEARNER: interview page · rules · Start Interview ═══════════════════
const START_BTN = { x: MX(245 + 430), y: MY(206 + 396 + 23) };
const SceneInterviewStart: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const hlRule = interpolate(g, [96, 108, 170, 182], [0, 1, 1, 0.3], cl);
  const cur = path(g, [[0, 800, 560], [150, 800, 560], [190, START_BTN.x, START_BTN.y], [230, START_BTN.x, START_BTN.y]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(675), MY(136), 1.45], [66, MX(675), MY(136), 1.45], [84, MX(675), MY(420), 1.6], [170, MX(675), MY(420), 1.6], [190, START_BTN.x, START_BTN.y - 40, 1.45], [230, START_BTN.x, START_BTN.y - 40, 1.45]];
  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="learner.skillbnk.com/interviews/mock/handling-service-calls">
          <LearnerShell>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 0, 8) }}>
              <LearnerInterviewPage g={g} fps={fps} state="start" hlRule={hlRule} pressStart={g >= 200 && g < 206} />
            </div>
          </LearnerShell>
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 200)} opacity={fi(g, 140, 10)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q6 — LEARNER: best-practice checklist → Continue ═════════════════════════
const TIPS = [
  ["📶", "Use a stable internet connection", "Check your connection before you begin"],
  ["💬", "Speak clearly and calmly", "Keep a steady pace, like a real call"],
  ["🎯", "Listen to the full question", "Take a second to think before answering"],
  ["🔇", "Find a quiet spot", "Background noise makes answers harder to hear"],
  ["✅", "Keep answers focused", "Be clear and avoid repeating yourself"],
  ["⏱", "Watch the time", "Pace yourself to finish every question"],
];
const SceneGuidelines: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 150;
  const g = gt(f, dur, D);
  const mo = sp(g, 2, fps, { damping: 18 });
  const CONT = { x: 1020, y: 734 };
  const cur = path(g, [[0, START_BTN.x, START_BTN.y], [80, START_BTN.x, START_BTN.y], [110, CONT.x, CONT.y], [150, CONT.x, CONT.y]]);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [18, 800, 420, 1.2], [90, 800, 420, 1.2], [108, 950, 640, 1.45], [150, 950, 640, 1.45]];
  const secs = Math.max(0, 28 - Math.floor(g / 12));
  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="learner.skillbnk.com/interviews/mock/handling-service-calls">
          <LearnerShell>
            <LearnerInterviewPage g={g} fps={fps} state="start" />
          </LearnerShell>
          <Dim o={mo} />
          <div style={{ position: "absolute", left: 500, top: 60 + (1 - mo) * 30, width: 600, height: 720, borderRadius: 16, background: "#fff", opacity: mo, zIndex: 45, boxShadow: "0 30px 80px #0007", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: 16, top: 14, width: 30, height: 30, borderRadius: "50%", background: "#EF4444", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>×</div>
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 23, fontWeight: 800, color: INK }}>Before you start</div>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 15, color: GRAY }}>A few tips for a great practice interview</div>
            {TIPS.map(([ic, t, s], i) => {
              const p = sp(g, 10 + i * 6, fps);
              return (
                <div key={t} style={{ position: "absolute", left: 24, top: 100 + i * 82, width: 552, height: 70, borderRadius: 10, background: "#F9FAFB", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", boxSizing: "border-box", opacity: p, transform: `translateX(${(1 - p) * 24}px)` }}>
                  <span style={{ fontSize: 22 }}>{ic}</span>
                  <div><div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{t}</div><div style={{ fontSize: 13.5, color: GRAY, marginTop: 2 }}>{s}</div></div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 24, top: 612, width: 552, height: 1, background: LINE }} />
            <div style={{ position: "absolute", left: 24, top: 646, fontSize: 14.5, color: GRAY }}>⏱ Auto-continuing in {secs}s</div>
            <div style={{ position: "absolute", left: 344, top: 632, width: 100, height: 44, borderRadius: 8, background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#DC2626", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Cancel</div>
            <div style={{ position: "absolute", left: 456, top: 632, width: 120, height: 44, borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 120 && g < 126 ? 0.94 : 1})` }}>Continue</div>
          </div>
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 120)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q7 — LEARNER: live AI interview (spoken answers, live transcript) ═══════
type Msg = { who: "me" | "ai" | "maya"; t: string; at: number; cpf: number; len: string };
const CHAT: Msg[] = [
  { who: "me", t: "Hello! I'm here for the interview.", at: 0, cpf: 99, len: "" },
  { who: "ai", t: "Hi Maya, thanks for joining. Let's practice a real service call. A homeowner calls, upset that their technician is running two hours late. How do you open the call?", at: 26, cpf: 2.2, len: "0:12" },
  { who: "maya", t: "First, I'd thank them for calling and apologize for the wait. Then I'd confirm their address and give them a new arrival time I'm sure about.", at: 118, cpf: 1.9, len: "0:14" },
  { who: "ai", t: "Good. What if they ask for a discount you can't approve?", at: 206, cpf: 1.8, len: "0:05" },
  { who: "maya", t: "I'd explain what I can do right now, then offer to have my manager call them back today.", at: 262, cpf: 1.7, len: "0:09" },
];
const cardH = (m: Msg) => (m.who === "me" ? 50 : 40 + Math.ceil(m.t.length / 50) * 21 + 58);
const AI_SPEAK: [number, number][] = [[26, 110], [206, 250]];
const MAYA_SPEAK: [number, number][] = [[118, 198], [262, 320]];
const inAny = (g: number, r: [number, number][]) => r.some(([a, b]) => g >= a && g < b);
const Office: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, filter: "blur(2.5px)", transform: "scale(1.04)" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 190, background: "#D8DBE0", backgroundImage: "linear-gradient(#B9BEC7 2px,transparent 2px),linear-gradient(90deg,#B9BEC7 2px,transparent 2px)", backgroundSize: "120px 60px" }} />
    {[160, 420, 700].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 40, width: 90, height: 26, borderRadius: 4, background: "#F8FAFC", boxShadow: "0 0 30px #fff" }} />)}
    <div style={{ position: "absolute", left: 0, top: 190, width: "100%", height: 290, background: "linear-gradient(90deg,#E9EEF3 0%,#F4F7FA 60%,#CBD2DA 100%)", backgroundImage: "repeating-linear-gradient(90deg,#F8FBFF 0 110px,#9AA5B1 110px 116px)" }} />
    <div style={{ position: "absolute", left: 0, top: 380, width: "100%", height: 100, background: "linear-gradient(180deg,#B8A790 0%,#8E7F6B 100%)", opacity: 0.55 }} />
    <div style={{ position: "absolute", left: 0, top: 480, width: "100%", height: 260, background: "linear-gradient(180deg,#6E6A63 0%,#4C4944 100%)" }} />
    <div style={{ position: "absolute", left: 360, top: 430, width: 700, height: 150, background: "#4A3325", clipPath: "polygon(12% 0,100% 0,100% 100%,0 100%)" }} />
    {[300, 470, 640, 810].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 470, width: 70, height: 110, borderRadius: 12, background: "#8C7560" }} />)}
  </div>
);
const SceneLive: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const P = { x: 60, y: 44, w: 1480, h: 770 }; // outer panel (content coords)
  const aiOn = inAny(g, AI_SPEAK);
  const mayaOn = inAny(g, MAYA_SPEAK);
  const secs = 598 - Math.floor(g / 8);
  const mm = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  // feed layout + auto-scroll
  const AVAIL = 560;
  let total = 0;
  const shown = CHAT.map((m) => {
    const p = m.at === 0 ? 1 : sp(g, m.at, fps);
    const y = total;
    if (g >= m.at) total += (cardH(m) + 12) * Math.min(1, p);
    return { m, p, y };
  });
  const scroll = Math.max(0, total - AVAIL);
  const BTN = { x: P.x + 634, y: P.y + P.h - 42 };
  const cur = path(g, [[0, 900, 500], [320, 900, 500], [352, BTN.x, BTN.y], [400, BTN.x, BTN.y]]);
  const submitting = fi(g, 364, 10);
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [34, 560, 400, 1.35], [112, 560, 400, 1.35], [134, 1300, 430, 1.45], [300, 1300, 430, 1.45],
    [322, WIDE_X, WIDE_Y, 1], [344, 640, 700, 1.3], [400, 640, 700, 1.3],
  ];
  const bars = (on: boolean, seed: number) => Array.from({ length: 11 }).map((_, i) => (on ? 8 + Math.abs(Math.sin(g / 3 + i * 1.7 + seed)) * 26 : 4));
  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="learner.skillbnk.com/interviews/mock/handling-service-calls/live">
          <div style={{ position: "absolute", inset: 0, background: "#0E1B4D" }} />
          <div style={{ position: "absolute", left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 18, overflow: "hidden", boxShadow: "0 20px 60px #0008", opacity: fi(g, 0, 10) }}>
            {/* stage */}
            <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: P.h, overflow: "hidden" }}>
              <Office />
              <div style={{ position: "absolute", inset: 0, background: "rgba(10,20,50,0.12)" }} />
              {/* Maya tile */}
              <div style={{ position: "absolute", left: 190, top: 200, width: 290, height: 290, borderRadius: 8, background: "#2F8F7F", overflow: "hidden", boxShadow: mayaOn ? "0 0 0 4px #5EEAD4, 0 0 40px #5EEAD488" : "0 16px 40px #0006" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontSize: 150, fontWeight: 300, color: "#fff", fontFamily: FONT }}>M</div>
                <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 56, background: "#ffffff30", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, paddingBottom: 10, boxSizing: "border-box" }}>
                  {bars(mayaOn, 0).map((h, i) => <div key={i} style={{ width: 12, height: h, background: "#3B82F6", borderRadius: 2 }} />)}
                </div>
                <div style={{ position: "absolute", left: 10, top: 10, padding: "3px 10px", borderRadius: 6, background: "#0008", color: "#fff", fontSize: 13, fontWeight: 700 }}>{LEARNER}</div>
              </div>
              {/* AI tile */}
              <div style={{ position: "absolute", left: 520, top: 200, width: 290, height: 290, borderRadius: 8, background: "#1B1742", overflow: "hidden", boxShadow: aiOn ? `0 0 0 4px #818CF8, 0 0 ${40 + 20 * Math.sin(g / 4)}px #818CF8AA` : "0 16px 40px #0006" }}>
                <svg width="200" height="200" viewBox="0 0 100 100" style={{ position: "absolute", left: 45, top: 22 }}>
                  <path d="M22 52 V44 a28 28 0 0 1 56 0 V52" fill="none" stroke="#fff" strokeWidth="4.5" />
                  <rect x="14" y="48" width="14" height="24" rx="5" fill="none" stroke="#fff" strokeWidth="4.5" />
                  <rect x="72" y="48" width="14" height="24" rx="5" fill="none" stroke="#fff" strokeWidth="4.5" />
                  <path d="M79 72 q0 14 -18 16 h-6" fill="none" stroke="#fff" strokeWidth="4.5" />
                  <rect x="44" y="84" width="14" height="8" rx="4" fill="none" stroke="#fff" strokeWidth="4" />
                  <text x="50" y="66" textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff" fontFamily={FONT}>AI</text>
                </svg>
                <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 56, background: "#ffffff22", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {aiOn ? bars(true, 3).map((h, i) => <div key={i} style={{ width: 8, height: h * 0.8, background: "#A5B4FC", borderRadius: 4 }} />) : <span style={{ color: "#C7D2FE", fontSize: 13, fontWeight: 700 }}>Listening…</span>}
                </div>
                <div style={{ position: "absolute", left: 10, top: 10, padding: "3px 10px", borderRadius: 6, background: "#0008", color: "#fff", fontSize: 13, fontWeight: 700 }}>AI Interviewer</div>
              </div>
              {/* bottom bar */}
              <div style={{ position: "absolute", left: 10, top: P.h - 70, width: 980, height: 56, borderRadius: 10, background: "#ffffffE6", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Mode:</span>
                <div style={{ height: 38, padding: "0 18px", borderRadius: 7, background: "#fff", border: `1px solid ${LINE}`, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center" }}>Manual</div>
                <div style={{ height: 38, padding: "0 18px", borderRadius: 7, background: BLUE, color: "#fff", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center" }}>Auto</div>
                <div style={{ width: 1, height: 34, background: "#D1D5DB", margin: "0 4px" }} />
                <div style={{ flex: 1, height: 40, borderRadius: 7, background: RED, color: "#fff", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${g >= 356 && g < 362 ? 0.97 : 1})` }}>✓ Complete & Submit</div>
              </div>
            </div>
            {/* right panel */}
            <div style={{ position: "absolute", left: 1000, top: 0, width: 480, height: P.h, background: "#F1F5F9" }}>
              <div style={{ position: "absolute", left: 10, top: 10, width: 460, height: 110, borderRadius: 10, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ fontSize: 16, color: "#374151", fontWeight: 600 }}>Time Remaining</div>
                <div style={{ padding: "6px 16px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{mm}</div>
              </div>
              <div style={{ position: "absolute", left: 14, top: 136, fontSize: 19, fontWeight: 800, color: INK }}>🔊 Conversation</div>
              <div style={{ position: "absolute", left: 10, top: 176, width: 460, height: AVAIL + 20, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: -scroll, width: 460 }}>
                  {shown.filter((s) => g >= s.m.at).map(({ m, p, y }) => {
                    const txt = m.cpf >= 99 ? m.t : typed(g, m.at + (m.who === "maya" ? 10 : 6), m.t, m.cpf);
                    return (
                      <div key={m.at} style={{ position: "absolute", left: 0, top: y, width: 450, minHeight: cardH(m), borderRadius: 10, background: m.who === "ai" ? "#EEF2FF" : "#fff", borderLeft: m.who === "ai" ? `4px solid ${BLUE}` : "none", padding: "10px 14px", boxSizing: "border-box", opacity: p, transform: `translateY(${(1 - p) * 16}px)`, boxShadow: "0 2px 6px #0000000D" }}>
                        {m.who !== "me" && (
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: m.who === "ai" ? "#FFEDD5" : "#DBEAFE", color: m.who === "ai" ? "#C2410C" : BLUE }}>{m.who === "ai" ? "Interviewer" : LEARNER}</span>
                        )}
                        <div style={{ marginTop: m.who === "me" ? 4 : 8, fontSize: 14.5, color: txt ? INK : GRAY, lineHeight: 1.45, fontStyle: txt ? "normal" : "italic" }}>{txt || "(Transcribing…)"}</div>
                        {m.who !== "me" && (
                          <div style={{ marginTop: 8, height: 36, borderRadius: 999, background: "#F1F3F4", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", fontSize: 12.5, color: "#374151" }}>
                            ▶ <span>0:00 / {m.len}</span><div style={{ flex: 1, height: 4, borderRadius: 2, background: "#CBD5E1" }} />🔊
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {submitting > 0.01 && (
            <div style={{ position: "absolute", inset: 0, background: `rgba(14,27,77,${0.75 * submitting})`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
              <div style={{ padding: "22px 34px", borderRadius: 14, background: "#fff", opacity: submitting, display: "flex", gap: 14, alignItems: "center", fontSize: 20, fontWeight: 700, color: INK }}>
                <svg width="26" height="26" viewBox="0 0 24 24" style={{ transform: `rotate(${g * 12}deg)` }}><circle cx="12" cy="12" r="9" fill="none" stroke={BLUE} strokeWidth="3" strokeDasharray="40 20" /></svg>
                Submitting your interview…
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 356)} opacity={fi(g, 316, 8)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q8 — LEARNER: submitted → Pending Review ═════════════════════════════════
const ScenePending: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 150;
  const g = gt(f, dur, D);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MX(675), MY(380), 1.5], [120, MX(675), MY(380), 1.5], [150, WIDE_X, WIDE_Y, 1.05]];
  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="learner.skillbnk.com/interviews/mock/handling-service-calls">
          <LearnerShell>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 0, 10) }}>
              <LearnerInterviewPage g={g} fps={fps} state="pending" />
            </div>
          </LearnerShell>
          <Toast g={g} at={8} text="Interview submitted for review" x={1060} y={70} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q9 — BRANCH: Mock Interview Answer → submissions → detail → Evaluate ════
const SUBS = [
  { t: INTERVIEW, by: LEARNER, av: MAYA_AV, mk: "", last: "Sep 30, 2026 · 10:12 AM", isNew: true },
  { t: "Handling Complaints", by: "Jordan Blake", av: { t: "JB", c1: "#F59E0B", c2: "#D97706" }, mk: "78", last: "Sep 24, 2026 · 2:40 PM", isNew: false },
  { t: "Booking Appointments", by: "Priya Nair", av: { t: "PN", c1: "#A855F7", c2: "#7C3AED" }, mk: "91", last: "Sep 22, 2026 · 11:05 AM", isNew: false },
  { t: "Phone Etiquette Basics", by: "Marcus Lee", av: { t: "ML", c1: "#EF4444", c2: "#DC2626" }, mk: "84", last: "Sep 19, 2026 · 4:18 PM", isNew: false },
  { t: "Booking Appointments", by: "Chloe Adams", av: { t: "CA", c1: "#0EA5E9", c2: "#0284C7" }, mk: "88", last: "Sep 17, 2026 · 9:52 AM", isNew: false },
];
const SubmissionsPage: React.FC<{ g: number; hover: boolean }> = ({ g, hover }) => {
  const cols: [string, number][] = [["Title", 30], ["Interview Type", 330], ["Program", 470], ["Submitted By", 700], ["Mark", 940], ["Last Submission", 1030], ["Actions", 1210]];
  return (
    <>
      <PageTitle t="Mock Interview Submissions" sub="Review and evaluate your learners' answers" back />
      <div style={{ position: "absolute", left: 1030, top: 22, width: 300, height: 40, borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>⌕ Search submissions...</div>
      <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1310, height: 50, background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }} />
        {cols.map(([t, x]) => <div key={t} style={{ position: "absolute", left: x, top: 15, fontSize: 14, fontWeight: 700, color: "#374151" }}>{t}</div>)}
        {SUBS.map((s, i) => (
          <div key={s.by} style={{ position: "absolute", left: 0, top: 50 + i * 66, width: 1310, height: 66, borderBottom: `1px solid ${LINE}`, background: s.isNew ? (hover ? "#DBEAFE" : `rgba(219,234,254,${0.35 + 0.2 * Math.sin(g / 7)})`) : "transparent" }}>
            <div style={{ position: "absolute", left: 30, top: 22, fontSize: 15.5, fontWeight: 700, color: INK, display: "flex", gap: 8, alignItems: "center" }}>{s.t}{s.isNew && <Badge t="New" c="#fff" bg={BLUE} />}</div>
            <div style={{ position: "absolute", left: 330, top: 20 }}><AIChip /></div>
            <div style={{ position: "absolute", left: 470, top: 22, fontSize: 14.5, color: INK }}>{PROGRAM}</div>
            <div style={{ position: "absolute", left: 700, top: 16, display: "flex", gap: 10, alignItems: "center", fontSize: 15, fontWeight: 600, color: INK }}><Avatar t={s.av.t} s={32} c1={s.av.c1} c2={s.av.c2} />{s.by}</div>
            <div style={{ position: "absolute", left: 940, top: 19 }}>{s.mk ? <span style={{ fontSize: 16, fontWeight: 800, color: INK }}>{s.mk}</span> : <Badge t="Pending" c="#C2410C" bg="#FFEDD5" dot />}</div>
            <div style={{ position: "absolute", left: 1030, top: 22, fontSize: 14, color: GRAY }}>{s.last}</div>
            <div style={{ position: "absolute", left: 1210, top: 16, display: "flex", gap: 8 }}>
              {[["👁", BLUE_SOFT, BLUE], ["⤓", "#F3F4F6", "#374151"], ["🗑", "#FEE2E2", "#DC2626"]].map(([ic, bg, c], k) => (
                <div key={k} style={{ width: 34, height: 34, borderRadius: 8, background: k === 0 && s.isNew && hover ? BLUE : bg, color: k === 0 && s.isNew && hover ? "#fff" : c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{ic}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
const SubmissionDetail: React.FC<{ press: boolean }> = ({ press }) => (
  <>
    <PageTitle t={`Interview by ${LEARNER}`} sub="Submission details" back />
    <div style={{ position: "absolute", left: 20, top: 96, width: 1310, height: 560, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
      <div style={{ position: "absolute", left: 28, top: 24, fontSize: 24, fontWeight: 800, color: INK, display: "flex", gap: 12, alignItems: "center" }}>{INTERVIEW} <Badge t="Awaiting review" c="#C2410C" bg="#FFEDD5" dot /></div>
      {[["Submitted by", LEARNER], ["Submission date", "Sep 30, 2026 · 10:12 AM"], ["Program", `${PROGRAM} · ${SESSION}`], ["Total mark", "—"]].map(([k, v], i) => (
        <div key={k} style={{ position: "absolute", left: 28 + (i % 2) * 640, top: 88 + Math.floor(i / 2) * 76, width: 600 }}>
          <div style={{ fontSize: 13.5, color: GRAY, fontWeight: 600 }}>{k}</div>
          <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700, color: INK, display: "flex", gap: 10, alignItems: "center" }}>{i === 0 && <Avatar t={MAYA_AV.t} s={30} c1={MAYA_AV.c1} c2={MAYA_AV.c2} />}{v}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 28, top: 262, fontSize: 18, fontWeight: 800, color: INK }}>Submission overview</div>
      {[["Total questions", "5", BLUE], ["Answered", "5", GREEN], ["Unanswered", "0", "#DC2626"]].map(([k, v, c], i) => (
        <div key={k} style={{ position: "absolute", left: 28 + i * 420, top: 302, width: 400, height: 110, borderRadius: 12, background: "#F9FAFB", border: `1px solid ${LINE}`, padding: "18px 22px", boxSizing: "border-box" }}>
          <div style={{ fontSize: 14.5, color: GRAY, fontWeight: 600 }}>{k}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: c, marginTop: 4 }}>{v}</div>
        </div>
      ))}
    </div>
    <Btn x={1110} y={590 + 90} w={220} h={48} label="Proceed to Evaluate →" primary fs={15.5} press={press ? 1 : 0} />
  </>
);
const SceneAnswers: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const stage = g < 62 ? 0 : g < 152 ? 1 : 2;
  const ANS = { x: MX(1080), y: MY(40) };
  const VIEW = { x: MX(20 + 1227), y: MY(90 + 50 + 33) };
  const PROC = { x: MX(1220), y: MY(704) };
  const cur = path(g, [[0, 800, 520], [44, ANS.x, ANS.y], [64, ANS.x, ANS.y], [128, VIEW.x, VIEW.y], [160, VIEW.x, VIEW.y], [250, PROC.x, PROC.y], [300, PROC.x, PROC.y]]);
  const ripple = Math.max(rip(g, 54), rip(g, 142), rip(g, 272));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 1300, 110, 1.55], [60, 1300, 110, 1.55], [80, 800, 330, 1.25], [118, 800, 330, 1.25], [134, 1300, 260, 1.5], [150, 1300, 260, 1.5], [168, 800, 380, 1.25], [236, 800, 380, 1.25], [258, 1350, 690, 1.5], [300, 1350, 690, 1.5]];
  const url = ["branch.skillbnk.com/interviews/mock-interviews", "branch.skillbnk.com/interviews/mock-interviews/answers", "branch.skillbnk.com/interviews/mock-interviews/answers/maya-robinson"][stage];
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={url}>
          <BranchShell active="Mock Interviews">
            {stage === 0 && <BranchListPage g={g + 400} fps={fps} newAt={0} pressAnswer={g >= 54 && g < 60} />}
            {stage === 1 && <div style={{ position: "absolute", inset: 0, opacity: fi(g, 62, 10) }}><SubmissionsPage g={g} hover={g >= 124} /></div>}
            {stage === 2 && <div style={{ position: "absolute", inset: 0, opacity: fi(g, 152, 10) }}><SubmissionDetail press={g >= 272 && g < 278} /></div>}
          </BranchShell>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q10 — BRANCH: Mark Submission → Evaluate by AI → comment → Save ════════
const QA = [
  ["How do you open a call with an upset homeowner?", "Thank them, apologize, confirm the address, give a new arrival time."],
  ["What if they ask for a discount you can't approve?", "Explain what I can do now, offer a manager callback today."],
];
const SceneEvaluate: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 310;
  const g = gt(f, dur, D);
  const EVAL = { x: MX(745), y: MY(40) };
  const SEND = { x: MX(700 + 600), y: MY(196 + 530) };
  const INPUT = { x: MX(700 + 300), y: MY(196 + 530) };
  const SAVE = { x: MX(605), y: MY(40) };
  const cur = path(g, [[0, 800, 520], [30, EVAL.x, EVAL.y], [60, EVAL.x, EVAL.y], [190, INPUT.x, INPUT.y], [236, INPUT.x, INPUT.y], [244, SEND.x, SEND.y], [252, SEND.x, SEND.y], [272, SAVE.x, SAVE.y], [310, SAVE.x, SAVE.y]]);
  const ripple = Math.max(rip(g, 38), rip(g, 192), rip(g, 248), rip(g, 280));
  const evaluating = g >= 40 && g < 80;
  const score = Math.round(interpolate(g, [80, 118], [0, 85], { ...cl, easing: Easing.out(Easing.cubic) }));
  const posted = g >= 250;
  const commentTxt = posted ? "" : typed(g, 196, COMMENT, 1.5);
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [24, 1000, 120, 1.5], [46, 1000, 120, 1.5], [70, 760, 250, 1.35], [122, 760, 250, 1.35],
    [138, MX(330), MY(470), 1.45], [184, MX(330), MY(470), 1.45], [198, MX(1015), MY(560), 1.4], [256, MX(1015), MY(560), 1.4],
    [270, 880, 140, 1.5], [300, 880, 140, 1.5], [310, 860, 300, 1.2],
  ];
  const shimmer = evaluating ? `linear-gradient(100deg, transparent ${((g - 40) * 4) % 140 - 40}%, #C7D2FE88 ${((g - 40) * 4) % 140 - 20}%, transparent ${((g - 40) * 4) % 140}%)` : "none";
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/interviews/mock-interviews/answers/maya-robinson/mark">
          <BranchShell active="Mock Interviews">
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 0, 8) }}>
              <PageTitle t="Mark Submission" sub={`${INTERVIEW} · ${LEARNER}`} back />
              <Btn x={560} y={20} w={90} h={40} label="Save" primary fs={14} press={g >= 280 && g < 286 ? 1 : 0} />
              <div style={{ position: "absolute", left: 660, top: 20, width: 170, height: 40, borderRadius: 8, background: "linear-gradient(90deg,#7C3AED,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 0 ${evaluating ? 24 : 8}px #7C3AED88`, transform: `scale(${g >= 38 && g < 44 ? 0.94 : 1})` }}>{evaluating ? "Evaluating…" : "✨ Evaluate by AI"}</div>
              <Btn x={840} y={20} w={130} h={40} label="View History" fs={13} />
              <Btn x={980} y={20} w={112} h={40} label="View Notes" fs={13} />
              <Btn x={1102} y={20} w={108} h={40} label="Send Email" fs={13} />
              <Btn x={1220} y={20} w={110} h={40} label="+ Calendar" fs={13} />
              <StatsBar y={78} items={[["DURATION", "10 minutes"], ["STATUS", "Completed"], ["SCORE", `${score}/100`], ["STARTED", "10:02 AM"], ["COMPLETED", "10:12 AM"]]} hl={g >= 80 ? 2 : -1} />
              {/* left: performance + feedback */}
              <div style={{ position: "absolute", left: 20, top: 196, width: 660, height: 590, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, backgroundImage: shimmer }}>
                <div style={{ position: "absolute", left: 24, top: 20, fontSize: 19, fontWeight: 800, color: INK }}>Overall Performance</div>
                <div style={{ position: "absolute", right: 24, top: 16, fontSize: 26, fontWeight: 900, color: score ? GREEN : GRAY, fontVariantNumeric: "tabular-nums" }}>{score}/100</div>
                <div style={{ position: "absolute", left: 24, top: 70, width: 612, height: 10, borderRadius: 5, background: "#E5E7EB" }}>
                  <div style={{ width: `${score}%`, height: 10, borderRadius: 5, background: "linear-gradient(90deg,#F59E0B,#22C55E)" }} />
                  <div style={{ position: "absolute", left: `calc(${score}% - 11px)`, top: -6, width: 22, height: 22, borderRadius: "50%", background: "#fff", border: `3px solid ${GREEN}`, boxSizing: "border-box" }} />
                </div>
                <div style={{ position: "absolute", left: 24, top: 100, width: 612, padding: "12px 16px", boxSizing: "border-box", borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 15.5, fontWeight: 700, color: "#166534", opacity: fi(g, 116, 10) }}>Excellent! You have a strong and solid foundation.</div>
                <div style={{ position: "absolute", left: 24, top: 176, fontSize: 16, fontWeight: 700, color: "#374151" }}>Feedback <span style={{ fontSize: 13, color: "#7C3AED", fontWeight: 700, opacity: fi(g, 124, 8) }}>· ✨ drafted by AI, you can edit it</span></div>
                <div style={{ position: "absolute", left: 24, top: 206, width: 612, height: 250, borderRadius: 10, border: `1px solid ${g >= 124 && g < 190 ? "#A5B4FC" : "#D1D5DB"}`, padding: "14px 16px", boxSizing: "border-box", fontSize: 16.5, color: INK, lineHeight: 1.6 }}>{typed(g, 126, FEEDBACK, 3.2) || <span style={{ color: "#9CA3AF" }}>Write feedback for the learner…</span>}</div>
                <div style={{ position: "absolute", left: 24, top: 476, display: "flex", gap: 10 }}>
                  {["Clear opening", "Empathy", "Next steps"].map((t, i) => <span key={t} style={{ opacity: fi(g, 150 + i * 8, 8) }}><Badge t={`✓ ${t}`} c={GREEN} bg="#DCFCE7" /></span>)}
                  <span style={{ opacity: fi(g, 174, 8) }}><Badge t="↗ Offer options sooner" c="#B45309" bg="#FEF3C7" /></span>
                </div>
              </div>
              {/* right: answers + comments */}
              <div style={{ position: "absolute", left: 700, top: 196, width: 630, height: 590, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
                <div style={{ position: "absolute", left: 22, top: 20, fontSize: 19, fontWeight: 800, color: INK }}>Answers</div>
                {QA.map(([q, a], i) => (
                  <div key={q} style={{ position: "absolute", left: 22, top: 58 + i * 104, width: 586, height: 92, borderRadius: 10, background: "#F9FAFB", border: `1px solid ${LINE}`, padding: "10px 14px", boxSizing: "border-box" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>Q{i + 1}. {q}</div>
                    <div style={{ fontSize: 14, color: "#374151", marginTop: 6 }}>🎙 {a}</div>
                  </div>
                ))}
                <div style={{ position: "absolute", left: 22, top: 280, fontSize: 19, fontWeight: 800, color: INK }}>Comments</div>
                {posted ? (
                  <div style={{ position: "absolute", left: 22, top: 320, width: 586, display: "flex", gap: 12, opacity: fi(g, 250, 8) }}>
                    <Avatar t={DAN_AV.t} s={36} c1={DAN_AV.c1} c2={DAN_AV.c2} />
                    <div style={{ flex: 1, background: BLUE_SOFT, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{ADMIN} <span style={{ fontWeight: 500, color: GRAY }}>· just now</span></div>
                      <div style={{ fontSize: 15, color: "#374151", marginTop: 3 }}>{COMMENT}</div>
                      <div style={{ fontSize: 13, color: BLUE, fontWeight: 700, marginTop: 6 }}>Reply</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: "absolute", left: 22, top: 330, fontSize: 14.5, color: GRAY }}>No comments yet</div>
                )}
                <div style={{ position: "absolute", left: 22, top: 510, width: 586, height: 46, borderRadius: 10, border: `1px solid ${g >= 192 && g < 250 ? "#A5B4FC" : LINE}`, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box" }}>
                  <Avatar t={DAN_AV.t} s={28} c1={DAN_AV.c1} c2={DAN_AV.c2} />
                  <span style={{ flex: 1, fontSize: 14.5, color: commentTxt ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{commentTxt || "Type your comment"}</span>
                  <span style={{ color: BLUE, fontSize: 18 }}>➤</span>
                </div>
              </div>
            </div>
          </BranchShell>
          <Toast g={g} at={284} text="Evaluation saved · Maya has been notified" x={1000} y={70} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q11 — LEARNER: score + feedback appear in the portal ═══════════════════
const SceneResult: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 200;
  const g = gt(f, dur, D);
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(675), MY(136), 1.45], [60, MX(675), MY(136), 1.45], [80, MX(675), MY(380), 1.5], [140, MX(675), MY(380), 1.5], [156, MX(675), MY(690), 1.5], [200, MX(675), MY(690), 1.5]];
  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="learner.skillbnk.com/interviews/mock/handling-service-calls">
          <LearnerShell>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 0, 10) }}>
              <LearnerInterviewPage g={g} fps={fps} state="result" />
            </div>
          </LearnerShell>
          <Toast g={g} at={6} text="Your interview has been reviewed" x={1060} y={70} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ q12 — progress flows up: learner → branch → company ═══════════════════
const SceneFlowUp: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 210;
  const g = gt(f, dur, D);
  const tiers = [
    { n: 1, t: "Company portal", u: "company.skillbnk.com", y: 150 },
    { n: 2, t: "Branch portal", u: "branch.skillbnk.com", y: 450 },
    { n: 3, t: "Learner portal", u: "learner.skillbnk.com", y: 750 },
  ];
  const lp = Math.round(interpolate(g, [30, 70], [64, 69], cl));
  const bAvg = Math.round(interpolate(g, [70, 110], [83, 84], cl));
  const coBars = [["Denver", interpolate(g, [110, 150], [83, 84], cl)], ["Boulder", 79], ["Colorado Springs", 76]] as [string, number][];
  const dots = [0, 1, 2, 3].map((i) => ((g + i * 18) % 72) / 72);
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 52, textAlign: "center", fontSize: 42, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 0, 12) }}>
          Every practice interview <span style={{ color: "#22C55E" }}>counts toward progress.</span>
        </div>
        <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1="960" y1="350" x2="960" y2="450" stroke="#2E5CF6" strokeWidth="4" opacity={fi(g, 70, 10)} />
          <line x1="960" y1="650" x2="960" y2="750" stroke="#2E5CF6" strokeWidth="4" opacity={fi(g, 30, 10)} />
          {dots.map((d, i) => (
            <React.Fragment key={i}>
              <circle cx="960" cy={750 - 100 * d} r="8" fill="#22C55E" opacity={fi(g, 30, 10)} />
              <circle cx="960" cy={450 - 100 * d} r="8" fill="#22C55E" opacity={fi(g, 70, 10)} />
            </React.Fragment>
          ))}
        </svg>
        {tiers.map((t, i) => {
          const p = sp(g, 4 + (2 - i) * 10, fps);
          return (
            <div key={t.t} style={{ position: "absolute", left: 460, top: t.y, width: 1000, height: 200, borderRadius: 18, background: "#fff", boxShadow: "0 20px 60px #000A", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, overflow: "hidden", fontFamily: FONT }}>
              <div style={{ height: 40, background: "#1E2740", display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#2E5CF6", color: "#fff", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.n}</div>
                <span style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 16 }}>{t.t}</span>
                <span style={{ color: "#8A96B2", fontSize: 14 }}>{t.u}</span>
              </div>
              <div style={{ padding: "22px 26px" }}>
                {i === 2 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <Avatar t={MAYA_AV.t} s={60} c1={MAYA_AV.c1} c2={MAYA_AV.c2} />
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{LEARNER}</div>
                      <div style={{ fontSize: 16, color: GRAY }}>{PROGRAM} · progress {lp}%</div>
                    </div>
                    <div style={{ marginLeft: "auto", padding: "12px 18px", borderRadius: 12, background: "#DCFCE7", color: GREEN, fontWeight: 800, fontSize: 19, opacity: fi(g, 20, 10), transform: `scale(${sp(g, 20, fps, { damping: 10 })})` }}>✓ Mock interview · 85/100</div>
                  </div>
                )}
                {i === 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{BRANCH}</div>
                      <div style={{ fontSize: 16, color: GRAY }}>38 mock interviews this month · 46 learners</div>
                    </div>
                    <div style={{ marginLeft: "auto", width: 360 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: INK, fontWeight: 700 }}>Average interview score <span style={{ color: GREEN }}>{bAvg}</span></div>
                      <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "#E5E7EB" }}><div style={{ width: `${bAvg}%`, height: 12, borderRadius: 6, background: "#22C55E" }} /></div>
                    </div>
                  </div>
                )}
                {i === 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{COMPANY}</div>
                      <div style={{ fontSize: 16, color: GRAY }}>Avg. mock interview score · by branch</div>
                    </div>
                    <div style={{ marginLeft: "auto", width: 470 }}>
                      {coBars.map(([n, v]) => (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                          <span style={{ width: 140, fontSize: 14.5, color: "#374151" }}>{n}</span>
                          <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E5E7EB" }}><div style={{ width: `${v}%`, height: 12, borderRadius: 6, background: BLUE }} /></div>
                          <span style={{ width: 34, fontSize: 14.5, fontWeight: 700, color: INK }}>{Math.round(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ q13 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrap: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 180;
  const g = gt(f, dur, D);
  const steps = [
    { t: "Create", s: "Branch sets up an AI interview", c: "#2563EB" },
    { t: "Practice", s: "Learners answer out loud", c: "#14B8A6" },
    { t: "Review", s: "Evaluate by AI in one click", c: "#7C3AED" },
  ];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontSize: 24, fontWeight: 700, color: "#8A96B2", letterSpacing: 4, opacity: fi(g, 14, 10) }}>AI MOCK INTERVIEWS</div>
        <div style={{ position: "absolute", left: 210, top: 390, width: 1500, display: "flex", gap: 40 }}>
          {steps.map((s, i) => {
            const p = sp(g, 26 + i * 16, fps);
            return (
              <div key={s.t} style={{ flex: 1, height: 250, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${s.c}88`, boxShadow: `0 0 50px ${s.c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 70, height: 70, borderRadius: "50%", background: s.c, color: "#fff", fontSize: 32, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ marginTop: 20, fontSize: 40, fontWeight: 800, color: "#F1F5F9" }}>{s.t}</div>
                <div style={{ marginTop: 8, fontSize: 21, color: "#8A96B2" }}>{s.s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontSize: 50, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 90, 12), transform: `translateY(${(1 - fi(g, 90, 12)) * 20}px)` }}>
          Practice real conversations <span style={{ color: "#7FA0FF" }}>before the real thing.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  q0: SceneHook, q1: SceneBranchSearch, q2: SceneBranchList, q3: SceneAddInterview, q4: SceneLearnerList,
  q5: SceneInterviewStart, q6: SceneGuidelines, q7: SceneLive, q8: ScenePending, q9: SceneAnswers,
  q10: SceneEvaluate, q11: SceneResult, q12: SceneFlowUp, q13: SceneWrap,
};

export const MockInterviewVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "q13" ? TAIL : 0);
        return (
          <Sequence key={k} from={STARTS[k]} durationInFrames={d}>
            <Scene f={frame - STARTS[k]} dur={d} fps={fps} />
          </Sequence>
        );
      })}
      {/* 🎬 MAIN INTRO (shared) — right after the hook */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}>
        <MainIntro />
      </Sequence>
      {ALL.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={`a-${k}`} from={STARTS[k]} durationInFrames={DURATIONS[k]}>
          <Audio src={staticFile(`mock/${k}.mp3`)} />
        </Sequence>
      ))}
      {/* 🎬 MAIN OUTRO (shared) */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
