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
// PortalsVideo — "Company → Branch → Learner: one connected platform"
// 1920x1080 feature demo. Order: Hook → MainIntro → scenes → MainOutro.
// All company / branch / learner / course data is FICTIONAL (Summit Ridge
// Academy). UI is rebuilt from the real skillBNK screens (AI Video/portal-screenshots).
// ════════════════════════════════════════════════════════════════════════════

// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-portals.py (plain object, no type).
const DURATIONS = {
  k0: 215,
  k1: 129,
  k2: 175,
  k3: 350,
  k4: 194,
  k5: 217,
  k6: 246,
  k7: 208,
  k8: 247,
  k9: 239,
  k10: 143,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["k0", "k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8", "k9", "k10"];

const PRE = ["k0", "k1"] as const; // hook + problem, BEFORE the intro
const POST = ["k2", "k3", "k4", "k5", "k6", "k7", "k8", "k9", "k10"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: each scene is choreographed on a design length (DESIGN) and stretched to
// its scene length. A scene lasts at least DESIGN × PACE, so on-screen actions never
// run faster than the design — the voice plays at normal speed and the visuals get
// breathing room after it. Raise PACE to slow the product demos further.
const DESIGN: Record<Key, number> = { k0: 270, k1: 120, k2: 180, k3: 400, k4: 300, k5: 250, k6: 290, k7: 250, k8: 340, k9: 210, k10: 180 };
const PACE: Record<Key, number> = { k0: 1, k1: 1, k2: 1, k3: 1.05, k4: 1.05, k5: 1.05, k6: 1.05, k7: 1.05, k8: 1.05, k9: 1, k10: 1 };
const LEN = {} as Record<Key, number>;
for (const k of [...PRE, ...POST]) LEN[k] = Math.max(DURATIONS[k], Math.round(DESIGN[k] * PACE[k]));

const STARTS = {} as Record<Key, number>;
let _pos = 0;
for (const k of PRE) { STARTS[k] = _pos; _pos += LEN[k]; }
const INTRO_START = _pos;
_pos += INTRO_FRAMES;
for (const k of POST) { STARTS[k] = _pos; _pos += LEN[k]; }
const OUTRO_START = _pos + TAIL;
export const TOTAL_FRAMES = OUTRO_START + OUTRO_FRAMES;

// ─── Brand / UI tokens ───────────────────────────────────────────────────────
const BLUE = "#1D3FD6";      // skillBNK UI primary (buttons, active steps)
const BLUE_SOFT = "#EEF2FF";
const INK = "#111827";
const GRAY = "#6B7280";
const LINE = "#E5E7EB";
const GREEN = "#16A34A";
const ORANGE = "#F97316";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";

// Fictional demo data
const COMPANY = "Summit Ridge Academy";
const COURSE = "Customer Care Essentials";
const INSTRUCTOR = "Dr. Sarah Mitchell";
const LEARNER = "Emily Carter";
const BRANCHES = [
  { name: "Downtown Learning Center", slug: "downtown-learning-center", loc: "Austin, TX, United States", phone: "(512) 555-0142", mgr: "James Carter", c: "#2563EB" },
  { name: "Lakeside Campus", slug: "lakeside-campus", loc: "Dallas, TX, United States", phone: "(214) 555-0187", mgr: "Laura Bennett", c: "#0EA5E9" },
  { name: "Northgate Center", slug: "northgate-center", loc: "Houston, TX, United States", phone: "(713) 555-0126", mgr: "Michael Turner", c: "#7C3AED" },
  { name: "Westside Center", slug: "westside-center", loc: "San Antonio, TX, United States", phone: "(210) 555-0164", mgr: "Olivia Grant", c: "#DB2777" },
  { name: "Riverside Hub", slug: "riverside-hub", loc: "Fort Worth, TX, United States", phone: "(817) 555-0133", mgr: "Ethan Cole", c: "#059669" },
  { name: "Bayview Campus", slug: "bayview-campus", loc: "Corpus Christi, TX, United States", phone: "(361) 555-0119", mgr: "Sophia Reyes", c: "#EA580C" },
];

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

/** Summit Ridge brand block (used as the branch/learner portal logo) */
const SummitLogo: React.FC<{ sub?: string }> = ({ sub = "Downtown Learning Center" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width="38" height="38" viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#0F2A6B" />
      <path d="M6 28l9-13 6 8 4-5 7 10z" fill="#fff" />
      <circle cx="27" cy="11" r="3" fill="#FBBF24" />
    </svg>
    <div>
      <div style={{ fontSize: 16, fontWeight: 900, color: "#0F2A6B", letterSpacing: 1 }}>SUMMIT RIDGE</div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: GRAY }}>{sub}</div>
    </div>
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

// ─── Company portal shell ─────────────────────────────────────────────────────
const CO_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Branch Management" }, { t: "Courses & Programs", open: true },
  { t: "Programs", child: true }, { t: "Courses", child: true }, { t: "Categories", child: true },
  { t: "Mentors and Trainer", child: true }, { t: "Sessions", child: true },
  { t: "Enrollment Test Questions", child: true }, { t: "Client Reviews", child: true },
  { t: "Navigation Management", child: true },
  { t: "Attendance", more: true }, { t: "Staff Management", more: true }, { t: "Marketing", more: true },
  { t: "Form Builder" }, { t: "Menu Builder" }, { t: "Website Builder" }, { t: "Enrollment form Builder" }, { t: "Integrations" },
];
const CompanyShell: React.FC<{ active?: string; children: React.ReactNode }> = ({ active = "Courses", children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "12px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "10px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <MiniLogo s={0.62} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{COMPANY}</div>
          <div style={{ fontSize: 10.5, color: GRAY }}>Change company</div>
        </div>
        <Chevron />
      </div>
      <div style={{ marginTop: 10, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", color: "#9CA3AF", fontSize: 13 }}>⌕</div>
      <div style={{ marginTop: 8 }}>
        {CO_MENU.map((m) => {
          const on = m.t === active;
          return (
            <div key={m.t} style={{ height: 34, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 22 : 6, paddingRight: 6, borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
              <Ico c={on ? BLUE : "#4B5563"} s={14} />
              <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
              {m.more && <Chevron />}
              {m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: H - BAR, overflow: "hidden" }}>{children}</div>
  </>
);

// ─── Branch portal shell ──────────────────────────────────────────────────────
const BR_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Leaderboard" }, { t: "Students Management", more: true },
  { t: "Courses & Programs", open: true }, { t: "Programs", child: true }, { t: "Courses", child: true },
  { t: "Groups", child: true }, { t: "Terms and conditions", child: true },
  { t: "Content Management", more: true }, { t: "Communication", more: true }, { t: "Attendance", more: true },
  { t: "Marketing Tools", more: true }, { t: "Billing & Certificate", more: true }, { t: "Staff Management", more: true },
  { t: "B2B Client" }, { t: "Menu Builder" }, { t: "Integrations" }, { t: "Institute Settings" },
];
const BranchShell: React.FC<{ active?: string; children: React.ReactNode }> = ({ active = "Courses", children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ padding: "2px 6px 10px" }}><SummitLogo /></div>
      <div style={{ height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", color: "#9CA3AF", fontSize: 13 }}>⌕</div>
      <div style={{ marginTop: 8 }}>
        {BR_MENU.map((m) => {
          const on = m.t === active;
          return (
            <div key={m.t} style={{ height: 36, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 22 : 6, paddingRight: 6, borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
              <Ico c={on ? BLUE : "#4B5563"} s={14} />
              <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
              {m.more && <Chevron />}
              {m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} />
      <div style={{ height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK }}>
        <Ico c={BLUE} s={14} /><b>Branch:</b> Downtown Learning Center <span style={{ color: "#9CA3AF" }}>⌃⌄</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ height: 38, padding: "0 16px", borderRadius: 9, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>View Attendance</div>
      <div style={{ height: 38, padding: "0 16px", borderRadius: 9, background: BLUE_SOFT, color: BLUE, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>Branch Manual</div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>💬</div>
      <div style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔<span style={{ position: "absolute", top: -4, right: -4, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>3</span></div>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#2E64F0,#1D4ED8)", color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>JC</div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden" }}>{children}</div>
  </>
);

// ─── Learner portal shell ─────────────────────────────────────────────────────
const LR_MENU: { t: string; child?: number; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "My Courses", open: true }, { t: "Course", child: 1, open: true },
  { t: "Program", child: 2 }, { t: "Audios/Videos", child: 2 }, { t: "Assignments", child: 2 },
  { t: "My Enrollments", child: 1 },
  { t: "Documents", more: true }, { t: "Calendar", more: true }, { t: "Interviews", more: true },
  { t: "Chat" }, { t: "Community" }, { t: "My Notes" },
];
const LearnerShell: React.FC<{ active?: string; course?: string; children: React.ReactNode }> = ({ active = "Dashboard", course = COURSE, children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ padding: "2px 6px 14px" }}><SummitLogo /></div>
      {LR_MENU.map((m) => {
        const on = m.t === active;
        return (
          <div key={m.t} style={{ height: 38, display: "flex", alignItems: "center", gap: 9, paddingLeft: 6 + (m.child || 0) * 14, paddingRight: 6, borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 14, fontWeight: on ? 700 : 500 }}>
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
      <div style={{ width: 380, height: 38, borderRadius: 999, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 16px", color: "#9CA3AF", fontSize: 14 }}>⌕ &nbsp;Search menu name...</div>
      <div style={{ flex: 1 }} />
      <div style={{ height: 36, borderRadius: 999, background: "#F3F4F6", display: "flex", alignItems: "center", padding: 3, gap: 2 }}>
        <div style={{ height: 30, padding: "0 12px", borderRadius: 999, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center" }}>EN</div>
        <div style={{ height: 30, padding: "0 12px", color: GRAY, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center" }}>ES</div>
      </div>
      <div style={{ height: 38, borderRadius: 999, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, fontSize: 14, fontWeight: 600, color: INK }}>🎓 {course} <span style={{ color: "#9CA3AF" }}>⌄</span></div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>💬</div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📅</div>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#F472B6,#DB2777)", color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>EC</div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);

/** fictional course cover art (no real people / brands) */
const Cover: React.FC<{ w: number; h: number; title?: string; c1?: string; c2?: string; fs?: number }> = ({ w, h, title = COURSE, c1 = "#1D3FD6", c2 = "#0EA5E9", fs }) => (
  <div style={{ width: w, height: h, borderRadius: 8, background: `linear-gradient(135deg, ${c1}, ${c2})`, position: "relative", overflow: "hidden", flexShrink: 0 }}>
    <div style={{ position: "absolute", right: -h * 0.2, bottom: -h * 0.3, width: h, height: h, borderRadius: "50%", background: "#ffffff22" }} />
    <div style={{ position: "absolute", left: w * 0.08, top: h * 0.18, right: w * 0.08, color: "#fff", fontWeight: 900, fontSize: fs ?? Math.max(7, h * 0.16), lineHeight: 1.1 }}>{title}</div>
  </div>
);

// NOTE on coordinates for product scenes:
//   • Camera keys and Cursor positions use CONTENT coords (x from the window's left edge,
//     y from just below the browser bar). Wide shot = (800, 428, 1).
//   • Shell main areas start at x = SIDE (and y = HEAD for branch/learner).
const CamC: React.FC<{ g: number; keys: CamKey[]; children: React.ReactNode }> = ({ g, keys, children }) => (
  <Camera g={g} keys={keys.map((k) => [k[0], k[1], k[2] + BAR, k[3]] as CamKey)}>{children}</Camera>
);
const WIDE_X = 800;
const WIDE_Y = 428;

// ═══ k0 — HOOK ════════════════════════════════════════════════════════════════
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 270;
  const g = gt(f, dur, D);
  const lines = [
    { t: "Head office builds the training.", at: 8, c: "#F1F5F9" },
    { t: "Branches run it their own way.", at: 95, c: "#FDBA74" },
    { t: "Nobody sees what learners finished.", at: 180, c: "#FCA5A5" },
  ];
  const boxes = [
    { t: "HQ Training Plan.docx", sub: "Head office", x: 300, y: 250, at: 10, rot: -4 },
    { t: "Branch Tracker.xlsx", sub: "Branches", x: 1320, y: 250, at: 95, rot: 4 },
    { t: "Learner Emails (132)", sub: "Learners", x: 810, y: 560, at: 180, rot: -2 },
  ];
  const drift = (i: number) => Math.sin((g + i * 40) / 30) * 8;
  return (
    <Stage>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #F9731618 0%, transparent 60%)" }} />
      {/* broken dotted links between the three silos */}
      <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>
        {[[560, 320, 1320, 320], [560, 360, 900, 580], [1450, 360, 1100, 580]].map((l, i) => {
          const o = fi(g, 30 + i * 60, 20) * (0.5 + 0.5 * Math.sin(g / 6 + i));
          return <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#F97316" strokeWidth="3" strokeDasharray="10 14" opacity={o * 0.7} />;
        })}
      </svg>
      {boxes.map((b, i) => {
        const p = sp(g, b.at, fps);
        return (
          <div key={b.t} style={{ position: "absolute", left: b.x, top: b.y + drift(i), width: 300, padding: "22px 24px", borderRadius: 18, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #F9731666", boxShadow: "0 20px 50px #0009", opacity: p, transform: `scale(${0.8 + 0.2 * p}) rotate(${b.rot}deg)` }}>
            <div style={{ fontSize: 16, color: "#8A96B2", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>{b.sub}</div>
            <div style={{ marginTop: 8, fontSize: 22, color: "#F1F5F9", fontWeight: 800 }}>{b.t}</div>
            <div style={{ position: "absolute", top: -18, right: -18, width: 44, height: 44, borderRadius: "50%", background: ORANGE, color: "#fff", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(g, b.at + 12, fps, { damping: 9 })})` }}>?</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}>
        {lines.map((l) => {
          const o = fi(g, l.at, 12);
          return (
            <div key={l.t} style={{ fontSize: 50, fontWeight: 800, color: l.c, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, lineHeight: 1.35, letterSpacing: -0.5 }}>{l.t}</div>
          );
        })}
      </div>
    </Stage>
  );
};

// ═══ k1 — PROBLEM ═════════════════════════════════════════════════════════════
const SceneProblem: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 120;
  const g = gt(f, dur, D);
  const items = ["3 systems", "3 logins", "a lot of guessing"];
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fo(g, D - 10, 10) }}>
        <div style={{ display: "flex", gap: 30 }}>
          {["Company login", "Branch login", "Learner login"].map((t, i) => {
            const p = sp(g, 4 + i * 8, fps);
            return (
              <div key={t} style={{ width: 360, padding: 28, borderRadius: 18, background: "#fff", opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${(i - 1) * 3}deg)`, boxShadow: "0 20px 60px #000A" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>{t}</div>
                {["Email", "Password"].map((l) => (
                  <div key={l} style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>{l}</div>
                    <div style={{ marginTop: 6, height: 38, borderRadius: 8, border: `1px solid ${LINE}` }} />
                  </div>
                ))}
                <div style={{ marginTop: 16, height: 40, borderRadius: 8, background: "#FEE2E2", color: "#DC2626", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Forgot password?</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 56, display: "flex", gap: 22 }}>
          {items.map((t, i) => {
            const o = fi(g, 24 + i * 16, 10);
            return (
              <div key={t} style={{ padding: "14px 26px", borderRadius: 999, background: "#F9731622", border: "1px solid #F9731688", color: "#FDBA74", fontSize: 30, fontWeight: 800, opacity: o, transform: `scale(${0.8 + 0.2 * o})` }}>{t}</div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ k2 — TURN: three connected portals ══════════════════════════════════════
const SceneTurn: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 180;
  const g = gt(f, dur, D);
  const tiers = [
    { n: 1, t: "Company portal", u: "company.skillbnk.com", d: "Build & control training", at: 30 },
    { n: 2, t: "Branch portal", u: "branch.skillbnk.com", d: "Run it locally", at: 55 },
    { n: 3, t: "Learner portal", u: "learner.skillbnk.com", d: "Learn on any device", at: 80 },
  ];
  const logo = sp(g, 2, fps, { damping: 14 });
  const flow = (g % 40) / 40;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 380, filter: "drop-shadow(0 0 18px #7FA0FF40)" }} />
        </div>
        <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1].map((i) => {
            const o = fi(g, 60 + i * 25, 12);
            const y1 = 360 + i * 210 + 130;
            const y2 = y1 + 80;
            return (
              <g key={i} opacity={o}>
                <line x1="960" y1={y1} x2="960" y2={y2} stroke="#2E5CF6" strokeWidth="4" />
                <circle cx="960" cy={y1 + (y2 - y1) * flow} r="7" fill="#7FA0FF" />
                <circle cx="960" cy={y2 - (y2 - y1) * flow} r="5" fill="#22C55E" />
              </g>
            );
          })}
        </svg>
        {tiers.map((t, i) => {
          const p = sp(g, t.at, fps);
          return (
            <div key={t.t} style={{ position: "absolute", left: 560, top: 360 + i * 210, width: 800, height: 130, borderRadius: 20, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF688", boxShadow: "0 0 40px #2E5CF633", display: "flex", alignItems: "center", gap: 24, padding: "0 32px", boxSizing: "border-box", opacity: p, transform: `translateX(${(1 - p) * (i % 2 ? 80 : -80)}px)` }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#2E5CF6", color: "#fff", fontSize: 26, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#F1F5F9" }}>{t.t}</div>
                <div style={{ fontSize: 19, color: "#8A96B2", marginTop: 4 }}>{t.d}</div>
              </div>
              <div style={{ padding: "8px 16px", borderRadius: 8, background: "#0F1729", color: "#7FA0FF", fontSize: 18, fontWeight: 700 }}>{t.u}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ k3 — COMPANY: 6-step course wizard ══════════════════════════════════════
const STEPS = ["Basic Info", "Content", "Media", "Pricing", "Meta Data", "Review"];
const STEP_AT = [0, 72, 132, 192, 252, 308];
const SECTION = [
  ["Basic Information", "Let's start with the fundamental details about your course."],
  ["Course Content", "Provide detailed information about what your course covers."],
  ["Course Media", "Upload a thumbnail image to make your course visually appealing."],
  ["Pricing Information", "Set up how you want to price your course."],
  ["SEO & Meta Data", "Optimize your course for search engines to increase visibility."],
  ["Review Your Course", "Please review all information before submitting your course."],
];
const TIPS = [
  "Fill in the basic information about your course. The title should be clear and descriptive.",
  "Describe what learners will gain and what they need before starting.",
  "Use a clear 16:9 cover image — it shows on every branch and learner portal.",
  "Set your pricing strategy. Consider offering a sale price for promotions.",
  "Keep the meta title between 50–60 characters and include a call to action.",
  "Everything looks good? Submit to publish your course.",
];

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
const Editor: React.FC<{ x: number; y: number; w: number; h: number; label: string; value: string; caret?: boolean }> = ({ x, y, w, h, label, value, caret }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>{label} <span style={{ color: "#EF4444" }}>*</span></div>
    <div style={{ marginTop: 8, height: h, borderRadius: 8, border: "1px solid #D1D5DB", background: "#fff", overflow: "hidden" }}>
      <div style={{ height: 44, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 10px" }}>
        {["↶", "↷", "¶ Paragraph ⌄", "B", "I", "U", "S", "🔗", "⌫", "✂", "🖼", "▦", "❝"].map((t) => (
          <div key={t} style={{ minWidth: 30, height: 30, padding: "0 6px", borderRadius: 6, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#374151" }}>{t}</div>
        ))}
      </div>
      <div style={{ padding: "14px 16px", fontSize: 16, color: INK, lineHeight: 1.5 }}>{value}{caret && <span style={{ color: BLUE }}>|</span>}</div>
    </div>
  </div>
);

const SceneWizard: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  let step = 0;
  STEP_AT.forEach((s, i) => { if (g >= s) step = i; });
  const pct = Math.round(((step + 1) / 6) * 100);
  const stepG = g - STEP_AT[step];
  const X0 = 54;           // card inner left (main coords)
  const FW = 1242;         // full field width
  const C2 = 696;          // column-2 x
  const CW = 600;          // column width
  const NEXT = { x: SIDE + 1275, y: 800 };
  const AI = { x: SIDE + 1210, y: 55 };

  // cursor choreography (content coords)
  const cur = path(g, [
    [0, 1100, 760], [14, AI.x, AI.y], [22, AI.x, AI.y], [56, 1350, 700], [64, NEXT.x, NEXT.y], [70, NEXT.x, NEXT.y],
    [90, 900, 470], [110, 1200, 560], [120, NEXT.x, NEXT.y], [130, NEXT.x, NEXT.y],
    [138, 1480, 700], [160, 925, 500], [176, 1300, 720], [184, NEXT.x, NEXT.y], [190, NEXT.x, NEXT.y],
    [200, 925, 402], [214, 700, 520], [236, 1300, 720], [244, NEXT.x, NEXT.y], [250, NEXT.x, NEXT.y],
    [270, 925, 420], [292, 1300, 720], [300, NEXT.x, NEXT.y], [306, NEXT.x, NEXT.y],
    [330, 1200, 600], [346, NEXT.x, NEXT.y], [400, NEXT.x, NEXT.y],
  ]);
  const clicks = [18, 66, 124, 186, 202, 246, 302, 350];
  const ripple = clicks.reduce((a, c) => Math.max(a, rip(g, c)), 0);
  const press = (at: number) => (g >= at && g < at + 6 ? 1 : 0);
  const dragging = g >= 140 && g < 160;

  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [10, 1380, 110, 1.55], [26, 1380, 110, 1.55], [44, 930, 470, 1.12],
    [120, 930, 470, 1.12], [134, 930, 480, 1.2], [180, 930, 480, 1.2], [196, 930, 450, 1.12],
    [300, 930, 450, 1.12], [316, 880, 420, 1.08], [338, 1350, 760, 1.45], [360, 1350, 760, 1.45], [385, WIDE_X, WIDE_Y, 1],
  ];

  // AI-fill of step 1
  const aiFill = (i: number) => g >= 24 + i * 6;
  const glow = (i: number) => (g >= 24 + i * 6 && g < 40 + i * 6 ? 1 - (g - 24 - i * 6) / 16 : 0);

  const body = () => {
    if (step === 0)
      return (
        <>
          <Field x={X0} y={340} w={CW} label="Category" req select value={aiFill(0) ? "Customer Service" : ""} ph="Please select a Category" glow={glow(0)} />
          <Field x={C2} y={340} w={CW} label="Sub-Category" select value={aiFill(1) ? "Call Handling" : ""} ph="Please select a Category" glow={glow(1)} />
          <Field x={X0} y={420} w={FW} label="Title" req value={aiFill(2) ? COURSE : ""} ph="Enter a clear, descriptive title for your course" glow={glow(2)} counter={`${aiFill(2) ? COURSE.length : 0}/70 characters`} />
          <Field x={X0} y={500} w={CW} label="Type" req select value="Course" glow={glow(3)} />
          <Field x={C2} y={500} w={CW} label="Language" select value={aiFill(4) ? "English" : ""} ph="Select Language" glow={glow(4)} />
          <Field x={X0} y={580} w={FW} label="Delivery Type" select value="Native" glow={glow(5)} />
        </>
      );
    if (step === 1)
      return (
        <>
          <Editor x={X0} y={340} w={FW} h={150} label="Short Details" value={typed(stepG, 6, "Give every team member the skills to handle customer calls with confidence and care.", 2.4)} caret={stepG < 45} />
          <Editor x={X0} y={520} w={FW} h={130} label="Requirements" value={typed(stepG, 30, "No experience needed. A headset is recommended.", 2.4)} />
        </>
      );
    if (step === 2) {
      const dropped = g >= 160;
      const pop = sp(g, 160, fps);
      return (
        <>
          <div style={{ position: "absolute", left: X0, top: 342, fontSize: 15, fontWeight: 600, color: "#374151" }}>Course Thumbnail <span style={{ color: "#EF4444" }}>*</span></div>
          <div style={{ position: "absolute", left: X0, top: 370, width: FW, height: 220, borderRadius: 10, border: `2px dashed ${BLUE}`, background: dragging ? "#DBE4FF" : "#EEF2FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: INK }}>Upload Attachment</div>
            <div style={{ fontSize: 14, color: GRAY }}>Or</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>Drag and Drop</div>
            <div style={{ fontSize: 13, color: GRAY, marginTop: 6 }}>Allowed file types: JPG, JPEG, PNG, GIF · Max file size: 10240KB · Aspect ratio: 16:9</div>
          </div>
          {dropped && (
            <div style={{ position: "absolute", left: X0, top: 606, opacity: pop, transform: `scale(${0.8 + 0.2 * pop})`, transformOrigin: "left top" }}>
              <Cover w={176} h={99} />
              <div style={{ marginTop: 4, fontSize: 13, color: GREEN, fontWeight: 600 }}>customer-care-cover.jpg</div>
            </div>
          )}
        </>
      );
    }
    if (step === 3)
      return (
        <>
          <Field x={X0} y={340} w={FW} label="Select An Instructor" req select value={g >= 206 ? INSTRUCTOR : ""} ph="Select an instructor" glow={g >= 206 && g < 222 ? 1 - (g - 206) / 16 : 0} />
          <div style={{ position: "absolute", left: X0, top: 425, width: FW, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, fontWeight: 600, color: "#374151" }}>
            <span>Make this course free ⓘ</span><Toggle on={0} />
          </div>
          <Field x={X0} y={470} w={CW} label="Regular Price" req value={"$ " + typed(g, 214, "149", 0.5)} />
          <Field x={C2} y={470} w={CW} label="Sale Price ⓘ" value={"$ " + (typed(g, 222, "99", 0.5) || "0")} />
          <Field x={X0} y={560} w={CW} label="Is This A Demo Course?" select value="No" />
          <Field x={C2} y={560} w={CW} label="Country" select value="United States" />
        </>
      );
    if (step === 4)
      return (
        <>
          <Field x={X0} y={340} w={FW} label="Meta Title ⓘ" req value={typed(stepG, 4, "Customer Care Essentials | Summit Ridge Academy", 2.2)} counter={`${typed(stepG, 4, "Customer Care Essentials | Summit Ridge Academy", 2.2).length}/70 characters`} />
          <Editor x={X0} y={430} w={FW} h={220} label="Meta Description ⓘ" value={typed(stepG, 22, "Learn to greet, listen, solve complaints and close every call with care. Enroll today.", 2.6)} caret />
        </>
      );
    // review
    const card = (y: number, h: number, title: string, rows: [string, string][]) => (
      <div style={{ position: "absolute", left: X0, top: y, width: FW, height: h, borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ height: 50, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontSize: 17, fontWeight: 700, color: INK }}>{title}<span style={{ fontSize: 14, color: GRAY, fontWeight: 500 }}>✎ Edit</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 18px", rowGap: 12 }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ opacity: fi(g, 312 + i * 3, 8) }}>
              <div style={{ fontSize: 14, color: GRAY }}>{k}</div>
              <div style={{ fontSize: 16, color: INK, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <>
        {card(330, 200, "Basic Information", [["Category", "Customer Service"], ["Sub-Category", "Call Handling"], ["Title", COURSE], ["Type", "course"], ["Language", "English"], ["Instructor", INSTRUCTOR]])}
        {card(546, 128, "Pricing & Media", [["Regular / Sale Price", "$149 / $99"], ["Thumbnail", "customer-care-cover.jpg"]])}
      </>
    );
  };

  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" opacity={fi(g, 0, 10)} />
      <CamC g={g} keys={camKeys}>
        <Browser url="company.skillbnk.com/courses/create">
          <CompanyShell active="Courses">
            <div style={{ position: "absolute", left: 30, top: 18, width: 1290, height: 820, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, boxShadow: "0 4px 18px #0000000c" }}>
              <div style={{ position: "absolute", left: 0, top: 70, width: 1290, height: 180, background: "#F8FAFC" }} />
            </div>
            <div style={{ position: "absolute", left: 30, top: 18, width: 1290, height: 820 }}>
              <div style={{ position: "absolute", left: X0 - 30 + 24, top: 18, fontSize: 30, fontWeight: 800, color: INK }}>Create New Course</div>
              <Btn x={1100} y={16} w={160} h={42} label="Generate with AI" icon="✨" press={press(18)} />
              {/* stepper */}
              <div style={{ position: "absolute", left: 90 - 30, top: 106, width: 1170, height: 4, background: "#E5E7EB" }} />
              <div style={{ position: "absolute", left: 90 - 30, top: 106, width: (1170 * step) / 5, height: 4, background: BLUE }} />
              {STEPS.map((s, i) => {
                const done = i < step;
                const cur2 = i === step;
                const x = 90 - 30 + i * 234;
                return (
                  <React.Fragment key={s}>
                    <div style={{ position: "absolute", left: x - 22, top: 86, width: 44, height: 44, borderRadius: "50%", background: done || cur2 ? BLUE : "#fff", border: done || cur2 ? "none" : "2px solid #D1D5DB", color: done || cur2 ? "#fff" : "#6B7280", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: cur2 ? "0 0 0 6px #C7D2FE" : "none", boxSizing: "border-box" }}>{done ? "✓" : i + 1}</div>
                    <div style={{ position: "absolute", left: x - 70, top: 138, width: 140, textAlign: "center", fontSize: 14.5, fontWeight: cur2 ? 700 : 500, color: cur2 ? BLUE : done ? INK : GRAY }}>{s}</div>
                  </React.Fragment>
                );
              })}
              <div style={{ position: "absolute", left: 24, top: 170, padding: "5px 12px", borderRadius: 999, background: "#DCFCE7", border: "1px solid #86EFAC", color: GREEN, fontSize: 13, fontWeight: 800 }}>{pct}% COMPLETE</div>
              <div style={{ position: "absolute", right: 30, top: 176, fontSize: 14, color: GREEN, fontWeight: 600 }}>{step < 5 ? "Skip to next →" : "Review your submission"}</div>
              <div style={{ position: "absolute", left: 24, top: 208, width: FW, height: 8, borderRadius: 4, background: "#E5E7EB" }}>
                <div style={{ width: `${pct}%`, height: 8, borderRadius: 4, background: "#22C55E" }} />
              </div>
              <div style={{ position: "absolute", left: 26, top: 222, fontSize: 13, color: GRAY }}>Start</div>
              <div style={{ position: "absolute", right: 30, top: 222, fontSize: 13, color: GRAY }}>Complete</div>
              <div style={{ position: "absolute", left: 0, top: 250, width: 1290, height: 1, background: LINE }} />
              <div style={{ position: "absolute", left: 24, top: 258, fontSize: 21, fontWeight: 700, color: "#374151" }}>{SECTION[step][0]}</div>
              <div style={{ position: "absolute", left: 24, top: 288, fontSize: 14.5, color: GRAY }}>{SECTION[step][1]}</div>
              {/* body in card coords: shift X0 → 24 */}
              <div style={{ position: "absolute", left: -30, top: -18, width: 1350, height: 856 }}>{body()}</div>
              <div style={{ position: "absolute", left: 24, top: 672, width: FW, height: 62, borderRadius: 10, background: "#E0E7FF", border: "1px solid #C7D2FE", display: "flex", alignItems: "center", gap: 12, padding: "0 18px", boxSizing: "border-box" }}>
                <span style={{ fontSize: 18 }}>ⓘ</span>
                <div style={{ fontSize: 14.5, color: INK }}><b>Tips for this step:</b> {TIPS[step]}</div>
              </div>
              <div style={{ position: "absolute", left: 0, top: 752, width: 1290, height: 1, background: LINE }} />
              {step > 0 && <Btn x={24} y={764} w={120} h={44} label="‹ Previous" />}
              <Btn x={970} y={764} w={110} h={44} label="✕ Cancel" />
              <Btn x={1090} y={764} w={100} h={44} label="Save" soft={false} />
              <Btn x={1200} y={764} w={90} h={44} label={step === 5 ? "Submit" : "Next ›"} primary press={clicks.slice(1).reduce((a, c) => Math.max(a, press(c)), 0)} />
            </div>
          </CompanyShell>
          {dragging && (
            <div style={{ position: "absolute", left: cur.x - 70, top: cur.y - 30, zIndex: 85, transform: "rotate(-4deg)", boxShadow: "0 16px 30px #0004", borderRadius: 8 }}>
              <Cover w={176} h={99} />
            </div>
          )}
          <Toast g={g} at={354} text={`"${COURSE}" created`} x={1180} y={20} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={dragging} opacity={fi(g, 2, 8)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ k4 — COMPANY: course list → ⋮ → Branches → select → Save ═══════════════
const COURSES = [
  { t: COURSE, price: "$99", old: "$149", br: [] as string[], c1: "#1D3FD6", c2: "#0EA5E9", isNew: true },
  { t: "Sales Fundamentals", price: "$199", old: "$249", br: ["Downtown", "Lakeside"], c1: "#7C3AED", c2: "#DB2777" },
  { t: "Workplace Safety Basics", price: "Free", old: "", br: ["Downtown", "Northgate"], c1: "#EA580C", c2: "#FBBF24" },
  { t: "Leadership for New Managers", price: "$299", old: "$349", br: ["Lakeside"], c1: "#059669", c2: "#22D3EE" },
  { t: "Excel for Operations", price: "$149", old: "", br: ["Northgate"], c1: "#16A34A", c2: "#84CC16" },
  { t: "Onboarding 101", price: "Free", old: "", br: ["Downtown", "Lakeside"], c1: "#0F2A6B", c2: "#2563EB" },
  { t: "Conflict Resolution", price: "$99", old: "$129", br: ["Westside"], c1: "#BE185D", c2: "#F97316" },
];
const PriceCell: React.FC<{ price: string; old: string }> = ({ price, old }) =>
  price === "Free" ? (
    <span style={{ padding: "4px 12px", borderRadius: 6, background: "#22C55E", color: "#fff", fontWeight: 800, fontSize: 13 }}>Free</span>
  ) : (
    <div><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{price}</div>{old && <div style={{ fontSize: 13, color: GRAY, textDecoration: "line-through" }}>{old}</div>}</div>
  );

const SceneBranches: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const onList = g < 60;
  const ROW0 = 186, RH = 64;
  const DOTS = { x: SIDE + 1214, y: ROW0 + 30 };
  const MENU = { x: SIDE + 1290, y: ROW0 + RH - 4 };
  const BR_ITEM = { x: SIDE + 1110, y: MENU.y + 8 + 2 * 36 + 18 };
  const CARD_X = [30, 445, 860].map((x) => x + 20);
  const CARD_Y = [300, 500];
  const SAVE = { x: SIDE + 1255, y: 185 };
  const selAt = [104, 128, 152];
  const cur = path(g, [
    [0, 1000, 640], [22, DOTS.x, DOTS.y], [28, DOTS.x, DOTS.y], [44, BR_ITEM.x, BR_ITEM.y], [52, BR_ITEM.x, BR_ITEM.y],
    [70, 900, 640], [98, SIDE + CARD_X[0] + 22, CARD_Y[0] + 22], [106, SIDE + CARD_X[0] + 22, CARD_Y[0] + 22],
    [122, SIDE + CARD_X[1] + 22, CARD_Y[0] + 22], [130, SIDE + CARD_X[1] + 22, CARD_Y[0] + 22],
    [146, SIDE + CARD_X[2] + 22, CARD_Y[0] + 22], [154, SIDE + CARD_X[2] + 22, CARD_Y[0] + 22],
    [184, SAVE.x, SAVE.y], [300, SAVE.x, SAVE.y],
  ]);
  const clicks = [26, 50, ...selAt, 190];
  const ripple = clicks.reduce((a, c) => Math.max(a, rip(g, c)), 0);
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [18, 1330, 290, 1.45], [54, 1330, 290, 1.45], [66, 900, 420, 1.06],
    [90, 800, 420, 1.2], [160, 1000, 420, 1.2], [178, 1380, 220, 1.5], [220, 1380, 220, 1.5], [245, WIDE_X, WIDE_Y, 1],
  ];
  const menuO = g >= 28 && g < 58 ? fi(g, 28, 5) : 0;

  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={onList ? "company.skillbnk.com/courses" : "company.skillbnk.com/courses/customer-care-essentials/branches"}>
          <CompanyShell active="Courses">
            {onList ? (
              <>
                <div style={{ position: "absolute", left: 30, top: 30, fontSize: 28, fontWeight: 800, color: INK }}>Global Course Asset Registry <span style={{ fontSize: 18, color: GRAY }}>ⓘ</span></div>
                <div style={{ position: "absolute", left: 30, top: 72, fontSize: 17, color: GRAY }}>Strategic View of All Course Assets</div>
                <div style={{ position: "absolute", left: 720, top: 34, width: 330, height: 44, borderRadius: 8, background: "#E0E7FF", color: "#6B7280", fontSize: 15, display: "flex", alignItems: "center", padding: "0 14px" }}>Enter Course Title...</div>
                <Btn x={1060} y={34} w={130} h={44} label="+ Add New" primary />
                <Btn x={1200} y={34} w={110} h={44} label="⚲ Filters" soft />
                <div style={{ position: "absolute", left: 0, top: 128, width: 1350, height: 1, background: LINE }} />
                {[["SN", 20], ["Name", 80], ["Branch", 450], ["Pricing", 740], ["Category", 880], ["Published", 1070], ["Actions", 1190]].map(([t, x]) => (
                  <div key={t as string} style={{ position: "absolute", left: x as number, top: 146, fontSize: 15, color: "#374151", fontWeight: 600 }}>{t}</div>
                ))}
                {COURSES.map((c, i) => {
                  const y = ROW0 + i * RH;
                  const o = fi(g, 2 + i * 3, 8);
                  return (
                    <div key={c.t} style={{ position: "absolute", left: 0, top: y, width: 1350, height: RH, borderTop: `1px solid ${LINE}`, opacity: o, background: c.isNew ? `rgba(238,242,255,${0.6 + 0.4 * Math.sin(g / 5)})` : "transparent" }}>
                      <div style={{ position: "absolute", left: 24, top: 22, fontSize: 15, color: GRAY }}>{i + 1}</div>
                      <div style={{ position: "absolute", left: 76, top: 10 }}><Cover w={76} h={44} title={c.t} c1={c.c1} c2={c.c2} fs={7} /></div>
                      <div style={{ position: "absolute", left: 166, top: 12, fontSize: 16, fontWeight: 700, color: INK, display: "flex", gap: 8, alignItems: "center" }}>
                        {c.t}{c.isNew && <span style={{ fontSize: 11, fontWeight: 800, background: GREEN, color: "#fff", padding: "2px 7px", borderRadius: 5 }}>NEW</span>}
                      </div>
                      <div style={{ position: "absolute", left: 166, top: 36, fontSize: 13, color: GRAY }}>native · course</div>
                      <div style={{ position: "absolute", left: 450, top: 16, display: "flex", gap: 6 }}>
                        {c.br.length ? c.br.map((b) => <span key={b} style={{ padding: "5px 10px", border: `1px solid ${LINE}`, background: "#F9FAFB", borderRadius: 6, fontSize: 13, color: "#374151" }}>{b}</span>) : <span style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>Not assigned yet</span>}
                      </div>
                      <div style={{ position: "absolute", left: 740, top: 12 }}><PriceCell price={c.price} old={c.old} /></div>
                      <div style={{ position: "absolute", left: 880, top: 20, fontSize: 15, color: "#374151" }}>{i === 0 ? "Customer Service" : ["Sales", "Safety", "Leadership", "Operations", "HR", "Customer Service"][i - 1]} ✎</div>
                      <div style={{ position: "absolute", left: 1074, top: 20 }}><Toggle on={i === 0 ? 0 : 1} c="#22C55E" /></div>
                      <div style={{ position: "absolute", left: 1150, top: 12, width: 36, height: 36, borderRadius: 8, background: BLUE_SOFT, display: "flex", alignItems: "center", justifyContent: "center", color: BLUE }}>✎</div>
                      <div style={{ position: "absolute", left: 1196, top: 12, width: 36, height: 36, borderRadius: 8, background: BLUE_SOFT, display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, fontWeight: 900 }}>⋮</div>
                    </div>
                  );
                })}
                {/* ⋮ menu */}
                <div style={{ position: "absolute", left: 1040, top: ROW0 + RH - 4, width: 200, padding: 8, borderRadius: 10, background: "#fff", boxShadow: "0 12px 30px #0003", border: `1px solid ${LINE}`, opacity: menuO, zIndex: 40 }}>
                  {["History", "Course info", "Branches", "Progress settings", "Layout & content"].map((t, j) => (
                    <div key={t} style={{ height: 36, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", borderRadius: 7, background: j === 2 && g > 42 ? "#F3F4F6" : "transparent", fontSize: 15, color: INK }}><Ico s={14} />{t}</div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ position: "absolute", left: 30, top: 18, fontSize: 26, fontWeight: 800, color: INK }}>{COURSE} <span style={{ fontSize: 17, color: GRAY }}>ⓘ</span></div>
                <div style={{ position: "absolute", left: 30, top: 56, fontSize: 16, color: GRAY }}>From here you can edit this course</div>
                <Btn x={1210} y={18} w={110} h={40} label="↗ Preview" />
                <div style={{ position: "absolute", left: 20, top: 96, display: "flex", gap: 8 }}>
                  {["Course info", "Branches", "Progress settings", "Layout & content"].map((t) => (
                    <div key={t} style={{ height: 42, padding: "0 16px", borderRadius: 9, display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: t === "Branches" ? 700 : 500, color: t === "Branches" ? BLUE : "#374151", background: t === "Branches" ? "#fff" : "transparent", boxShadow: t === "Branches" ? "0 2px 8px #0000001a" : "none" }}><Ico s={14} c={t === "Branches" ? BLUE : "#4B5563"} />{t}</div>
                  ))}
                </div>
                <div style={{ position: "absolute", left: 20, top: 150, width: 1310, height: 690, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
                <div style={{ position: "absolute", left: 44, top: 172, fontSize: 18, fontWeight: 700, color: INK, display: "flex", gap: 8 }}><Ico s={18} />Branches</div>
                <Btn x={960} y={166} w={110} h={38} label="Select All" fs={14} />
                <Btn x={1080} y={166} w={120} h={38} label="Deselect All" fs={14} />
                <Btn x={1210} y={166} w={90} h={38} label="Save" primary fs={14} press={g >= 190 && g < 196 ? 1 : 0} />
                <div style={{ position: "absolute", left: 44, top: 222, width: 1262, height: 44, borderRadius: 8, border: `1px solid ${LINE}`, color: "#9CA3AF", fontSize: 15, display: "flex", alignItems: "center", padding: "0 14px" }}>⌕ &nbsp;Search branches...</div>
                {BRANCHES.map((b, i) => {
                  const x = CARD_X[i % 3];
                  const y = CARD_Y[Math.floor(i / 3)];
                  const sel = i < 3 && g >= selAt[i];
                  const po = i < 3 ? sp(g, selAt[i], fps, { damping: 12 }) : 0;
                  const o = fi(g, 60 + i * 3, 8);
                  return (
                    <div key={b.name} style={{ position: "absolute", left: x, top: y, width: 395, height: 180, borderRadius: 12, boxSizing: "border-box", padding: 18, border: sel ? `2px solid ${BLUE}` : `1px solid ${LINE}`, background: sel ? "#EEF2FF" : "#fff", opacity: o, transform: sel ? `scale(${1 + 0.03 * Math.sin(Math.min(1, po) * Math.PI)})` : undefined }}>
                      <div style={{ position: "absolute", left: 16, top: 16, width: 20, height: 20, borderRadius: 5, border: sel ? "none" : "2px solid #9CA3AF", background: sel ? BLUE : "#fff", color: "#fff", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>{sel ? "✓" : ""}</div>
                      <div style={{ position: "absolute", right: 16, top: 14, display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, padding: "3px 9px", borderRadius: 6, background: "#DCFCE7", color: GREEN }}>Approved</span>
                        {sel && <span style={{ color: BLUE, fontWeight: 900 }}>✓</span>}
                      </div>
                      <div style={{ position: "absolute", left: 16, top: 50, display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 10, background: b.c, color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{b.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>{b.name}</div>
                          <div style={{ fontSize: 13, color: GRAY }}>{b.slug}</div>
                        </div>
                      </div>
                      <div style={{ position: "absolute", left: 16, top: 104, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                        <div>📍 {b.loc}</div>
                        <div>📞 {b.phone}</div>
                      </div>
                      <div style={{ position: "absolute", left: 16, right: 16, bottom: 12, borderTop: `1px solid ${LINE}`, paddingTop: 6, fontSize: 13, color: "#374151" }}>👤 {b.mgr}</div>
                    </div>
                  );
                })}
              </>
            )}
          </CompanyShell>
          <Toast g={g} at={194} text="Course sent to 3 branches" x={1120} y={70} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ k5 — COMPANY: Progress settings ═════════════════════════════════════════
const PROGRESS_ROWS = [
  ["My Messages", "100"], ["My Uploaded Documents", "10"], ["My Calendar Events", "Total Calendar Meetings"],
  ["Answered Technical Tests", "Total Technical Tests"], ["Mock Interviews", "Total Mock Interviews"],
  ["Community Posts", "10"], ["Document & Lab Comments", "Total Labs"], ["Lessons Completed", "Total Lessons"], ["My Notes", "10"],
];
const SceneProgress: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 250;
  const g = gt(f, dur, D);
  const R0 = 196, RH = 70;
  const hi: Record<number, [number, number]> = { 7: [70, 120], 3: [110, 160], 4: [150, 200] };
  const onAt = (i: number) => 14 + i * 5;
  const active = PROGRESS_ROWS.filter((_, i) => g >= onAt(i) + 6).length;
  const SAVE = { x: SIDE + 1250, y: 116 };
  const rowY = (i: number) => R0 + i * RH + 34;
  const cur = path(g, [
    [0, 1000, 700], [60, SIDE + 1215, rowY(7)], [100, SIDE + 1215, rowY(7)], [118, SIDE + 1215, rowY(3)], [140, SIDE + 1215, rowY(3)],
    [158, SIDE + 1215, rowY(4)], [190, SIDE + 1215, rowY(4)], [210, SAVE.x, SAVE.y], [250, SAVE.x, SAVE.y],
  ]);
  const ripple = rip(g, 214);
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [50, 900, rowY(7), 1.25], [105, 900, rowY(7), 1.25], [125, 900, rowY(3) + 40, 1.25],
    [190, 900, rowY(4) - 20, 1.25], [206, 1300, 130, 1.5], [235, 1300, 130, 1.5], [250, WIDE_X, WIDE_Y, 1],
  ];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="company.skillbnk.com/courses/customer-care-essentials/progress">
          <CompanyShell active="Courses">
            <div style={{ position: "absolute", left: 20, top: 12, display: "flex", gap: 8 }}>
              {["Course info", "Branches", "Progress settings", "Layout & content"].map((t) => (
                <div key={t} style={{ height: 42, padding: "0 16px", borderRadius: 9, display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: t === "Progress settings" ? 700 : 500, color: t === "Progress settings" ? BLUE : "#374151", background: t === "Progress settings" ? "#fff" : "transparent", boxShadow: t === "Progress settings" ? "0 2px 8px #0000001a" : "none" }}><Ico s={14} c={t === "Progress settings" ? BLUE : "#4B5563"} />{t}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 20, top: 70, width: 1310, height: 780, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
            <div style={{ position: "absolute", left: 44, top: 92, fontSize: 22, fontWeight: 800, color: INK, display: "flex", alignItems: "center", gap: 10 }}>
              Learner progress <span style={{ fontSize: 13, fontWeight: 700, color: BLUE, background: BLUE_SOFT, padding: "3px 10px", borderRadius: 999 }}>{active} active</span>
            </div>
            <div style={{ position: "absolute", left: 44, top: 130, fontSize: 15, color: GRAY }}>Defaults work immediately. Customize only what this course should track.</div>
            <Btn x={1010} y={94} w={170} h={44} label="↺ Restore defaults" />
            <Btn x={1190} y={94} w={130} h={44} label="Save changes" primary press={g >= 214 && g < 220 ? 1 : 0} />
            <div style={{ position: "absolute", left: 20, top: 172, width: 1310, height: 1, background: LINE }} />
            {PROGRESS_ROWS.map(([n, t], i) => {
              const h = hi[i];
              const glow = h ? Math.min(fi(g, h[0], 8), fo(g, h[1], 10)) : 0;
              const on = interpolate(g, [onAt(i), onAt(i) + 6], [0, 1], cl);
              return (
                <div key={n} style={{ position: "absolute", left: 36, top: R0 + i * RH, width: 1278, height: RH - 10, borderRadius: 10, border: `1px solid ${glow > 0.1 ? "#818CF8" : LINE}`, background: glow > 0.1 ? `rgba(238,242,255,${glow})` : "#fff", boxShadow: glow > 0.1 ? `0 0 0 ${4 * glow}px #C7D2FE` : "none", opacity: fi(g, 2 + i * 3, 8), boxSizing: "border-box" }}>
                  <div style={{ position: "absolute", left: 16, top: 18, color: "#9CA3AF", fontWeight: 900 }}>⠿</div>
                  <div style={{ position: "absolute", left: 44, top: 8, fontSize: 16.5, fontWeight: 700, color: INK }}>{n}</div>
                  <div style={{ position: "absolute", left: 44, top: 32, fontSize: 13.5, color: GRAY }}>Included in learner progress</div>
                  <div style={{ position: "absolute", left: 1000, top: 8, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: 1 }}>TARGET</div>
                  <div style={{ position: "absolute", left: 1000, top: 28, fontSize: 15.5, color: INK }}>{t}</div>
                  <div style={{ position: "absolute", left: 1170, top: 18, color: "#374151" }}>✎</div>
                  <div style={{ position: "absolute", left: 1200, top: 20, fontSize: 13, color: GRAY }}>On</div>
                  <div style={{ position: "absolute", left: 1226, top: 17 }}><Toggle on={on} /></div>
                </div>
              );
            })}
          </CompanyShell>
          <Toast g={g} at={218} text="Progress rules saved for every branch" x={1040} y={20} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} opacity={fi(g, 40, 10)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ k6 — BRANCH: sign in → choose workspace → course inventory (Org managed) ══
const SceneBranchLogin: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 290;
  const g = gt(f, dur, D);
  const phase = g < 72 ? 0 : g < 152 ? 1 : 2;
  const SIGN = { x: 440, y: 583 };
  const DT = { x: 800, y: 267 };
  const TOG = { x: SIDE + 726, y: HEAD + 181 };
  const cur = path(g, [
    [0, 700, 700], [40, 560, 540], [52, SIGN.x, SIGN.y], [60, SIGN.x, SIGN.y], [96, 1000, 600], [120, DT.x, DT.y], [132, DT.x, DT.y],
    [165, 1100, 700], [196, TOG.x, TOG.y], [290, TOG.x, TOG.y],
  ]);
  const ripple = Math.max(rip(g, 56), rip(g, 128));
  const camKeys: CamKey[] =
    [[0, 560, 470, 1.25], [50, 560, 520, 1.3], [66, WIDE_X, WIDE_Y, 1], [96, 800, 420, 1.15], [140, 800, 420, 1.15], [158, WIDE_X, WIDE_Y, 1], [190, 1010, 270, 1.7], [260, 1010, 270, 1.7], [285, WIDE_X, WIDE_Y, 1.02]];
  const email = typed(g, 8, "james.carter@summitridge.com", 1.4);
  const pw = "•".repeat(Math.max(0, Math.min(10, Math.floor((g - 38) * 0.8))));
  const tip = fi(g, 200, 8);
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={phase < 2 ? "branch.skillbnk.com/login" : "branch.skillbnk.com/courses"}>
          {phase < 2 ? (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, width: 800, height: H - BAR, background: "#fff" }}>
                <div style={{ position: "absolute", left: 160, top: 160, width: 52, height: 52, borderRadius: 12, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 900 }}>›</div>
                <div style={{ position: "absolute", left: 160, top: 236, fontSize: 40, fontWeight: 800, color: INK }}>Welcome back</div>
                <div style={{ position: "absolute", left: 160, top: 292, fontSize: 17, color: GRAY }}>Sign in first, then choose the branch you want to manage.</div>
                <div style={{ position: "absolute", left: 160, top: 360, fontSize: 15, fontWeight: 600, color: "#374151" }}>Email</div>
                <div style={{ position: "absolute", left: 160, top: 388, width: 520, height: 50, borderRadius: 9, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 16, color: INK, gap: 10 }}>✉ {email}{g < 38 && <span style={{ color: BLUE }}>|</span>}</div>
                <div style={{ position: "absolute", left: 160, top: 456, fontSize: 15, fontWeight: 600, color: "#374151" }}>Password</div>
                <div style={{ position: "absolute", left: 160, top: 484, width: 520, height: 50, borderRadius: 9, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK, gap: 10 }}>🔒 {pw}</div>
                <Btn x={160} y={558} w={520} h={50} label="Sign in" primary press={g >= 56 && g < 62 ? 1 : 0} fs={17} />
                <div style={{ position: "absolute", left: 160, top: 630, width: 520, textAlign: "center", fontSize: 15, color: BLUE, fontWeight: 600 }}>Forgot password?</div>
              </div>
              <div style={{ position: "absolute", left: 800, top: 0, width: 800, height: H - BAR, background: "linear-gradient(160deg,#04060D,#0A0E20)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Img src={staticFile("skillbnk-logo.png")} style={{ width: 360 }} />
                <div style={{ marginTop: 30, fontSize: 38, fontWeight: 800, color: "#F1F5F9" }}>Welcome to your branch</div>
                <div style={{ marginTop: 10, fontSize: 18, color: "#8A96B2" }}>Manage courses, learners and staff in one place.</div>
              </div>
              {phase === 1 && (
                <>
                  <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * fi(g, 72, 8)})` }} />
                  <div style={{ position: "absolute", left: 420, top: 70 + (1 - fi(g, 72, 10)) * 30, width: 760, height: 700, borderRadius: 16, background: "#fff", overflow: "hidden", opacity: fi(g, 72, 10), boxShadow: "0 30px 80px #0006" }}>
                    <div style={{ padding: "24px 26px", display: "flex", gap: 16, alignItems: "center", borderBottom: `1px solid ${LINE}` }}>
                      <div style={{ width: 52, height: 52, borderRadius: 12, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⑂</div>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>Choose a workspace</div>
                        <div style={{ fontSize: 15, color: GRAY, marginTop: 2 }}>Select a branch to continue. You can change it later from the sidebar.</div>
                      </div>
                    </div>
                    <div style={{ padding: "18px 26px", background: "#F8FAFC", height: 520, boxSizing: "border-box" }}>
                      {[
                        { org: COMPANY, n: "3 branches", br: [["Downtown Learning Center", "Ready to open", true], ["Lakeside Campus", "Ready to open", false], ["Northgate Center", "Ready to open", false]] },
                        { org: "Harbor View Fitness", n: "1 branch", br: [["Main Studio", "Branch pending", false]] },
                      ].map((o) => (
                        <div key={o.org} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico c={BLUE} s={15} /></div>
                            <div><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{o.org}</div><div style={{ fontSize: 13, color: GRAY }}>{o.n}</div></div>
                          </div>
                          <div style={{ marginLeft: 16, borderLeft: `2px solid ${LINE}`, paddingLeft: 16, marginTop: 8 }}>
                            {o.br.map(([b, st, hl]) => {
                              const pending = st !== "Ready to open";
                              const hot = hl && g >= 118;
                              return (
                                <div key={b as string} style={{ height: 58, marginTop: 8, borderRadius: 10, background: pending ? "#F3F4F6" : "#fff", border: `1px solid ${hot ? BLUE : LINE}`, boxShadow: hot ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", gap: 12, padding: "0 14px", opacity: pending ? 0.6 : 1 }}>
                                  <div style={{ width: 34, height: 34, borderRadius: 8, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>⑂</div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{b}</div>
                                    <div style={{ fontSize: 12.5, color: pending ? GRAY : GREEN }}>{pending ? st : "🛡 Ready to open"}</div>
                                  </div>
                                  <Chevron />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 70, borderTop: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 14, color: GRAY }}>Signed in, but in the wrong account? <b style={{ color: INK }}>↪ Sign out</b></div>
                  </div>
                </>
              )}
            </>
          ) : (
            <BranchShell active="Courses">
              <div style={{ position: "absolute", left: 30, top: 20, fontSize: 28, fontWeight: 800, color: INK }}>Course Inventory <span style={{ fontSize: 17, color: GRAY }}>ⓘ</span></div>
              <div style={{ position: "absolute", left: 30, top: 60, fontSize: 16, color: GRAY }}>View and Manage All Course Assets</div>
              <Btn x={760} y={24} w={120} h={42} label="+ Add New" primary />
              <div style={{ position: "absolute", left: 890, top: 24, width: 300, height: 42, borderRadius: 8, background: "#E0E7FF", color: GRAY, fontSize: 15, display: "flex", alignItems: "center", padding: "0 14px" }}>Enter Title Here...</div>
              <Btn x={1200} y={24} w={110} h={42} label="⚲ Filters" soft />
              {[["SN", 20], ["Name", 80], ["Pricing", 560], ["Published", 700], ["Actions", 930]].map(([t, x]) => (
                <div key={t as string} style={{ position: "absolute", left: x as number, top: 118, fontSize: 15, color: "#374151", fontWeight: 600 }}>{t}</div>
              ))}
              {COURSES.map((c, i) => {
                const y = 150 + i * 62;
                return (
                  <div key={c.t} style={{ position: "absolute", left: 0, top: y, width: 1350, height: 62, borderTop: `1px solid ${LINE}`, background: i === 0 ? `rgba(220,252,231,${0.35 + 0.35 * Math.sin(g / 5)})` : "transparent", opacity: fi(g, 152 + i * 3, 8) }}>
                    <div style={{ position: "absolute", left: 24, top: 20, fontSize: 15, color: GRAY }}>{i + 1}</div>
                    <div style={{ position: "absolute", left: 76, top: 9 }}><Cover w={76} h={44} title={c.t} c1={c.c1} c2={c.c2} fs={7} /></div>
                    <div style={{ position: "absolute", left: 166, top: 11, fontSize: 16, fontWeight: 700, color: INK, display: "flex", gap: 8, alignItems: "center" }}>{c.t}{i === 0 && <span style={{ fontSize: 11, fontWeight: 800, background: GREEN, color: "#fff", padding: "2px 7px", borderRadius: 5 }}>NEW FROM HQ</span>}</div>
                    <div style={{ position: "absolute", left: 166, top: 35, fontSize: 13, color: GRAY }}>native · course</div>
                    <div style={{ position: "absolute", left: 560, top: 10 }}><PriceCell price={c.price} old={c.old} /></div>
                    <div style={{ position: "absolute", left: 704, top: 20, display: "flex", alignItems: "center", gap: 10 }}><Toggle on={0} /><span style={{ fontSize: 14, color: "#374151" }}>Org managed</span></div>
                    <div style={{ position: "absolute", left: 930, top: 12, display: "flex", gap: 8 }}>
                      {["👁", "✎", "⟲"].map((t) => <div key={t} style={{ width: 38, height: 38, borderRadius: 8, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{t}</div>)}
                    </div>
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 680, top: 150 + 50, padding: "10px 14px", borderRadius: 8, background: INK, color: "#fff", fontSize: 14, fontWeight: 600, opacity: tip, transform: `translateY(${(1 - tip) * 6}px)`, boxShadow: "0 8px 20px #0004", zIndex: 40 }}>Managed by the organization</div>
            </BranchShell>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ k7 — BRANCH: add a local lesson to the course ═══════════════════════════
const LESSONS = ["Greeting the customer", "Active listening", "Handling complaints", "Closing the call"];
const SceneBranchEdit: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 250;
  const g = gt(f, dur, D);
  const modal = g >= 36 && g < 150;
  const mo = modal ? Math.min(fi(g, 36, 8), fo(g, 142, 8)) : 0;
  const added = g >= 150;
  const ADDL = { x: SIDE + 1000, y: HEAD + 330 };
  const ADD = { x: 1000, y: 770 };
  const SAVE = { x: SIDE + 1280, y: HEAD + 330 };
  const cur = path(g, [
    [0, 900, 760], [28, ADDL.x, ADDL.y], [34, ADDL.x, ADDL.y], [60, 800, 250], [100, 800, 420], [128, ADD.x, ADD.y], [140, ADD.x, ADD.y],
    [175, 900, 700], [196, SAVE.x, SAVE.y], [250, SAVE.x, SAVE.y],
  ]);
  const ripple = Math.max(rip(g, 32), rip(g, 138), rip(g, 200));
  const camKeys: CamKey[] = [
    [0, WIDE_X, WIDE_Y, 1], [26, 1150, 380, 1.4], [40, 1150, 380, 1.4], [56, 800, 450, 1.2], [140, 800, 450, 1.2],
    [158, 800, 700, 1.3], [185, 800, 700, 1.3], [200, 1350, 400, 1.4], [230, 1350, 400, 1.4], [250, WIDE_X, WIDE_Y, 1],
  ];
  const rows = [...LESSONS, ...(added ? ["Welcome to the Downtown team"] : [])];
  const newO = sp(g, 150, fps);
  return (
    <Stage>
      <PortalTag n={2} label="Branch portal" url="branch.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/courses/customer-care-essentials/edit">
          <BranchShell active="Courses">
            <div style={{ position: "absolute", left: 30, top: 16, fontSize: 26, fontWeight: 800, color: INK }}>Edit Course · {COURSE} <span style={{ fontSize: 16, color: GRAY }}>ⓘ</span></div>
            <div style={{ position: "absolute", left: 30, top: 52, fontSize: 15, color: GRAY }}>Modify course settings and preferences</div>
            <Btn x={1130} y={18} w={200} h={40} label="⇪ Bulk Upload Chapters" soft fs={14} />
            <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 100, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
              <div style={{ position: "absolute", left: 14, top: 12 }}><Cover w={134} h={76} fs={12} /></div>
              <div style={{ position: "absolute", left: 164, top: 20, fontSize: 19, fontWeight: 700, color: INK, display: "flex", gap: 10, alignItems: "center" }}>{COURSE}
                <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#DCFCE7", color: GREEN, fontWeight: 700 }}>Org managed</span>
                <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, border: `1px solid ${LINE}`, color: INK, fontWeight: 700 }}>native</span>
              </div>
              <div style={{ position: "absolute", left: 164, top: 54, fontSize: 14, color: GRAY }}>Shared by {COMPANY} · Sep 29, 2026</div>
              <Btn x={990} y={30} w={140} h={40} label="+ Add new tab" primary fs={14} />
              <Btn x={1140} y={30} w={156} h={40} label="✨ Generate with AI" fs={14} />
            </div>
            <div style={{ position: "absolute", left: 20, top: 204, height: 70, display: "flex", gap: 6, padding: 6, borderRadius: 12, border: `1px solid ${LINE}`, background: "#fff" }}>
              {[["Module", `1 chapter · ${rows.length} lessons`], ["Workshop", "0 chapters · 0 lessons"], ["Interview", "0 chapters · 0 lessons"], ["Lab", "0 chapters · 0 lessons"]].map(([t, s], i) => (
                <div key={t} style={{ width: 210, padding: "8px 14px", borderRadius: 9, background: i === 0 ? BLUE_SOFT : "transparent", border: i === 0 ? "1px solid #C7D2FE" : "none" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: i === 0 ? BLUE : INK, display: "flex", gap: 8, alignItems: "center" }}>{t}<span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 999, background: "#22C55E", color: "#fff" }}>Active</span></div>
                  <div style={{ fontSize: 12.5, color: i === 0 ? BLUE : GRAY, marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 20, top: 290, width: 1310, height: 560, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
            <div style={{ position: "absolute", left: 44, top: 312, fontSize: 18, fontWeight: 700, color: INK, display: "flex", gap: 10, alignItems: "center" }}>Class List <Toggle on={0} w={34} /><span style={{ fontSize: 14, fontWeight: 500, color: GRAY }}>Drag Off</span></div>
            <Btn x={780} y={306} w={140} h={42} label="+ Add Chapter" primary fs={14} />
            <Btn x={930} y={306} w={140} h={42} label="+ Add Lesson" fs={14} press={g >= 32 && g < 38 ? 1 : 0} />
            <Btn x={1080} y={306} w={100} h={42} label="⟲ Reload" fs={14} />
            <Btn x={1190} y={306} w={130} h={42} label="✓ Save Changes" fs={14} press={g >= 200 && g < 206 ? 1 : 0} />
            {[["Module name", 44], ["Creation Date", 760], ["Session", 920], ["Group", 1020], ["Public", 1120], ["Action", 1220]].map(([t, x]) => (
              <div key={t as string} style={{ position: "absolute", left: x as number, top: 372, fontSize: 14.5, color: "#374151", fontWeight: 600 }}>{t}</div>
            ))}
            <div style={{ position: "absolute", left: 36, top: 404, width: 1280, height: 52, borderTop: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 10, paddingLeft: 8, fontSize: 17, fontWeight: 700, color: INK }}>
              <span style={{ color: "#F59E0B" }}>▾ ⛁</span> Handling Customer Calls <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 6, background: BLUE, color: "#fff" }}>Chapter</span>
            </div>
            {rows.map((t, i) => {
              const isNew = i === 4;
              const y = 456 + i * 52;
              return (
                <div key={t} style={{ position: "absolute", left: 36, top: y, width: 1280, height: 52, borderTop: `1px solid ${LINE}`, background: isNew ? `rgba(220,252,231,${0.9 * Math.max(0.35, 1 - (g - 150) / 80)})` : "transparent", opacity: isNew ? newO : 1, transform: isNew ? `translateX(${(1 - newO) * 40}px)` : undefined }}>
                  <div style={{ position: "absolute", left: 40, top: 14, fontSize: 16, color: INK, display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: BLUE }}>▶</span>{i + 1}. {t}
                    <span style={{ fontSize: 11.5, padding: "2px 9px", borderRadius: 6, background: "#22C55E", color: "#fff", fontWeight: 700 }}>Video</span>
                    {isNew && <span style={{ fontSize: 11.5, padding: "2px 9px", borderRadius: 6, background: "#FEF3C7", color: "#92400E", fontWeight: 800 }}>Branch-specific</span>}
                  </div>
                  <div style={{ position: "absolute", left: 724, top: 7, fontSize: 13.5, color: INK, lineHeight: 1.3 }}>Sep 29, 2026<br /><span style={{ color: GRAY }}>{isNew ? "4:10 PM" : "9:30 AM"}</span></div>
                  <div style={{ position: "absolute", left: 884, top: 16, fontSize: 14, fontWeight: 700, color: INK }}>Global ✎</div>
                  <div style={{ position: "absolute", left: 984, top: 16, fontSize: 14, fontWeight: 700, color: INK }}>Global ✎</div>
                  <div style={{ position: "absolute", left: 1086, top: 14 }}><Toggle on={1} c="#22C55E" /></div>
                  <div style={{ position: "absolute", left: 1186, top: 9, width: 34, height: 34, borderRadius: 8, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>✎</div>
                </div>
              );
            })}
          </BranchShell>
          {modal && (
            <>
              <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.4 * mo})`, backdropFilter: `blur(${2 * mo}px)` }} />
              <div style={{ position: "absolute", left: 540, top: 40 + (1 - mo) * 20, width: 620, height: 770, borderRadius: 14, background: "#fff", opacity: mo, boxShadow: "0 30px 80px #0006", overflow: "hidden" }}>
                <div style={{ height: 60, display: "flex", alignItems: "center", padding: "0 22px", fontSize: 22, fontWeight: 800, color: INK, borderBottom: `1px solid ${LINE}` }}>Add Lesson</div>
                <div style={{ position: "absolute", left: 0, top: 60, width: 620 }}>
                  <div style={{ position: "relative", height: 700 }}>
                    <Field x={22} y={16} w={576} label="Title" value={typed(g, 48, "Welcome to the Downtown team", 1.6)} ph="Enter title" />
                    <Field x={22} y={100} w={576} label="Content Rating" select value="Not defined" />
                    <Field x={22} y={184} w={576} label="Select type" select value="Video" />
                    <div style={{ position: "absolute", left: 22, top: 268, width: 576, height: 40, display: "flex", gap: 8 }}>
                      <div style={{ flex: 1, borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Enter URL</div>
                      <div style={{ flex: 1, borderRadius: 8, color: "#374151", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Upload Video</div>
                    </div>
                    <Field x={22} y={322} w={576} label="Provide URL *" value={typed(g, 82, "https://vimeo.com/summitridge/welcome", 1.8)} ph="Enter URL" />
                    <div style={{ position: "absolute", left: 22, top: 400, fontSize: 13, color: GRAY }}>💡 Duration will be auto-fetched for YouTube and public Vimeo videos.</div>
                    <Field x={22} y={428} w={576} label="Video duration (seconds) *" value={g >= 112 ? "90" : ""} ph="0" />
                    <div style={{ position: "absolute", left: 22, top: 516, width: 576, height: 100, borderRadius: 10, border: "2px dashed #D1D5DB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 14 }}><b style={{ color: INK }}>⇪ Drag & drop files here</b>JPG, PNG, PDF, DOCS, PPT, PPTX | Max 5MB each</div>
                    <Btn x={22} y={636} w={282} h={46} label="Cancel" />
                    <Btn x={316} y={636} w={282} h={46} label="Add" primary press={g >= 138 && g < 144 ? 1 : 0} />
                  </div>
                </div>
              </div>
            </>
          )}
          <Toast g={g} at={204} text="Lesson added for Downtown Learning Center" x={1010} y={70} />
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ k8 — LEARNER: pick enrollment → dashboard → play lesson ═══════════════════
const SceneLearner: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 340;
  const g = gt(f, dur, D);
  const phase = g < 88 ? 0 : g < 204 ? 1 : 2;
  const SWITCH = { x: 1050, y: 288 };
  const GO = { x: 1010, y: 822 };
  const GOPROG = { x: SIDE + 110, y: HEAD + 502 };
  const PLAY = { x: SIDE + 460, y: HEAD + 430 };
  const cur = path(g, [
    [0, 700, 720], [28, SWITCH.x, SWITCH.y], [36, SWITCH.x, SWITCH.y], [62, GO.x, GO.y], [74, GO.x, GO.y],
    [100, 900, 760], [130, SIDE + 500, HEAD + 330], [168, SIDE + 500, HEAD + 330], [186, GOPROG.x, GOPROG.y], [198, GOPROG.x, GOPROG.y],
    [220, 1000, 700], [244, PLAY.x, PLAY.y], [340, PLAY.x + 40, PLAY.y + 60],
  ]);
  const ripple = Math.max(rip(g, 34), rip(g, 70), rip(g, 194), rip(g, 250));
  const camKeys: CamKey[] = [
    [0, 800, 420, 1.2], [26, 900, 300, 1.4], [44, 900, 300, 1.4], [60, 900, 700, 1.3], [80, 900, 700, 1.3], [96, WIDE_X, WIDE_Y, 1],
    [120, 560, 400, 1.35], [168, 560, 400, 1.35], [186, 500, 520, 1.3], [200, 500, 520, 1.3], [214, WIDE_X, WIDE_Y, 1],
    [244, 720, 480, 1.25], [320, 720, 480, 1.25], [340, WIDE_X, WIDE_Y, 1.05],
  ];
  const pctP = interpolate(g, [120, 160], [0, 40], cl);
  const done = Math.round(interpolate(g, [120, 160], [0, 2], cl));
  const playing = g >= 250;
  const vidP = interpolate(g, [250, 340], [0, 0.45], cl);
  const selected = g >= 34;
  const mo = phase === 0 ? fo(g, 76, 10) : 0;

  const dashboard = (
    <>
      <div style={{ position: "absolute", left: 20, top: 18, fontSize: 26, fontWeight: 800, color: INK }}>Courses <span style={{ fontSize: 16, color: GRAY }}>ⓘ</span></div>
      <div style={{ position: "absolute", left: 20, top: 54, fontSize: 15, color: GRAY }}>Continue learning to keep moving forward</div>
      <Btn x={1060} y={20} w={140} h={42} label="👥 Leaderboard" fs={14} />
      <Btn x={1210} y={20} w={120} h={42} label="▦ Progress" fs={14} />
      <div style={{ position: "absolute", left: 14, top: 86, width: 1322, height: 480, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
      <div style={{ position: "absolute", left: 36, top: 104, fontSize: 30, fontWeight: 800, color: INK }}>{COURSE}</div>
      <div style={{ position: "absolute", left: 36, top: 150, fontSize: 15, color: "#374151" }}><span style={{ color: GREEN }}>🕒</span> Last updated today</div>
      <div style={{ position: "absolute", left: 36, top: 178, fontSize: 16, color: GRAY }}>Handle every customer call with confidence and care.</div>
      {[["🏢 Company:", COMPANY, 36, 214], ["📘 Branch:", "Downtown Learning Center", 420, 214], ["📅 Session:", "Fall Cohort", 36, 250], ["👤", INSTRUCTOR, 420, 250]].map(([a, b, x, y]) => (
        <div key={a as string} style={{ position: "absolute", left: x as number, top: y as number, fontSize: 17, color: INK }}><b>{a}</b> <span style={{ color: "#374151" }}>{b}</span></div>
      ))}
      <div style={{ position: "absolute", left: 30, top: 290, width: 730, height: 176, borderRadius: 12, background: "#E0E7FF", padding: 16, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 800, color: INK }}>Your Progress <span style={{ color: BLUE, fontSize: 16 }}>{Math.round(pctP)}%</span></div>
        <div style={{ marginTop: 10, height: 8, borderRadius: 4, background: "#fff" }}><div style={{ width: `${pctP}%`, height: 8, borderRadius: 4, background: BLUE }} /></div>
        <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
          {[["Completed", String(done), "#DCFCE7", GREEN, "✓"], ["In Progress", "1", "#FEF3C7", "#D97706", "◷"], ["Remaining", String(5 - done - 1), "#F3E8FF", "#7C3AED", "≡"]].map(([t, v, bg, c, ic]) => (
            <div key={t} style={{ flex: 1, height: 74, borderRadius: 10, background: bg, display: "flex", alignItems: "center", gap: 12, padding: "0 14px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ffffffaa", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{ic}</div>
              <div><div style={{ fontSize: 14, color: "#374151" }}>{t}</div><div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{v}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 800, top: 104 }}><Cover w={516} h={290} fs={40} /></div>
      <Btn x={30} y={480} w={160} h={44} label="Go to Program →" primary press={g >= 194 && g < 200 ? 1 : 0} fs={15} />
      <div style={{ position: "absolute", left: 200, top: 480, height: 44, borderRadius: 999, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 15, color: INK, gap: 8 }}>▢ {COURSE} ⌄</div>
      {[["Module & Lessons", "5"], ["Workshop & Lessons", "2"], ["Interview & Lessons", "1"], ["Lab & Lessons", "1"]].map(([t, v], i) => (
        <div key={t} style={{ position: "absolute", left: 14 + i * 334, top: 586, width: 320, height: 96, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", boxSizing: "border-box" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#EDE9FE", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>≋</div>
          <div><div style={{ fontSize: 15, color: INK }}>{t}</div><div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{v}</div><div style={{ fontSize: 12.5, color: GRAY }}>Self-paced</div></div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, top: 720, width: 1350, textAlign: "center", fontSize: 26, fontWeight: 800, color: INK }}>What you'll learn</div>
    </>
  );

  const player = (
    <>
      <div style={{ position: "absolute", left: 20, top: 20, fontSize: 24, fontWeight: 800, color: INK }}>← {COURSE} <span style={{ fontSize: 15, color: GRAY }}>ⓘ</span></div>
      <Btn x={1180} y={16} w={150} h={40} label="✎ Leave a Review" soft fs={14} />
      <div style={{ position: "absolute", left: 20, top: 70, height: 42, borderRadius: 999, background: "#fff", border: `1px solid ${LINE}`, display: "flex", padding: 4, gap: 4 }}>
        <div style={{ padding: "0 16px", borderRadius: 999, background: BLUE, color: "#fff", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center" }}>Module</div>
        <div style={{ padding: "0 16px", color: "#374151", fontSize: 15, display: "flex", alignItems: "center" }}>Workshop</div>
      </div>
      <div style={{ position: "absolute", right: 20, top: 82, fontSize: 14.5, color: "#374151" }}>🕒 Last updated today &nbsp; <b style={{ color: BLUE }}>📄 5 lessons</b></div>
      <div style={{ position: "absolute", left: 14, top: 124, width: 1322, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
      <div style={{ position: "absolute", left: 34, top: 140, fontSize: 18, fontWeight: 700, color: INK }}>Module</div>
      <div style={{ position: "absolute", left: 34, top: 166, fontSize: 13.5, color: GRAY }}>Explore key topics with structured lessons</div>
      <div style={{ position: "absolute", left: 930, top: 140, width: 390, height: 40, borderRadius: 8, border: `1px solid ${LINE}`, color: "#9CA3AF", fontSize: 14, display: "flex", alignItems: "center", padding: "0 12px" }}>⌕ &nbsp;Search chapter & modules...</div>
      {/* video */}
      <div style={{ position: "absolute", left: 30, top: 200, width: 880, height: 495, borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg,#0F2A6B,#1D3FD6 55%,#0EA5E9)" }}>
        <div style={{ position: "absolute", right: -80, bottom: -120, width: 420, height: 420, borderRadius: "50%", background: "#ffffff14" }} />
        <div style={{ position: "absolute", left: 40, top: 36, fontSize: 16, fontWeight: 700, color: "#BFDBFE", letterSpacing: 2, textTransform: "uppercase" }}>{COMPANY}</div>
        <div style={{ position: "absolute", left: 40, top: 70, fontSize: 46, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>Handling<br />Customer Calls</div>
        <div style={{ position: "absolute", left: 40, top: 190, fontSize: 20, color: "#E0E7FF" }}>Lesson 3 · Handling complaints</div>
        <div style={{ position: "absolute", left: 40, top: 240, width: 330, padding: "14px 18px", borderRadius: 12, background: "#ffffff1f", color: "#fff", fontSize: 17, fontStyle: "italic", opacity: playing ? fi(g, 262, 10) : 0 }}>“I understand — let's fix this together.”</div>
        <div style={{ position: "absolute", left: 430 - 42, top: 230 - 42, width: 84, height: 84, borderRadius: "50%", background: "#ffffffee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: BLUE, opacity: playing ? fo(g, 252, 10) : 1, transform: `scale(${g >= 250 && g < 256 ? 0.9 : 1})` }}>▶</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 880, height: 56, background: "#0009", display: "flex", alignItems: "center", gap: 14, padding: "0 18px", boxSizing: "border-box", color: "#fff", fontSize: 15 }}>
          <span>{playing ? "❚❚" : "▶"}</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#ffffff44" }}><div style={{ width: `${vidP * 100}%`, height: 6, borderRadius: 3, background: "#fff" }} /></div>
          <span>{`0:${String(Math.floor(vidP * 90)).padStart(2, "0")} / 1:30`}</span>
        </div>
      </div>
      {/* chapter list */}
      <div style={{ position: "absolute", left: 930, top: 200, width: 390, height: 70, borderRadius: 10, border: `1px solid ${LINE}`, padding: "10px 14px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>📁 Handling Customer Calls</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <span style={{ fontSize: 13, color: GRAY }}>5 lessons</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#E5E7EB" }}><div style={{ width: "40%", height: 6, borderRadius: 3, background: BLUE }} /></div>
          <span style={{ fontSize: 13, color: INK, fontWeight: 700 }}>40%</span>
        </div>
      </div>
      {[...LESSONS, "Welcome to the Downtown team"].map((t, i) => (
        <div key={t} style={{ position: "absolute", left: 930, top: 284 + i * 64, width: 390, height: 56, borderRadius: 10, border: `1px solid ${i === 2 ? "#A5B4FC" : LINE}`, background: i === 2 ? BLUE_SOFT : "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box" }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: i < 2 ? GREEN : i === 2 ? BLUE : "#E5E7EB", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i < 2 ? "✓" : "▶"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i + 1}. {t}</div>
            <div style={{ fontSize: 12, color: GRAY }}>{["1 min 40 sec", "2 min 10 sec", "1 min 30 sec", "2 min 05 sec", "1 min 30 sec"][i]}</div>
          </div>
          {i === 4 ? <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 6, background: "#FEF3C7", color: "#92400E", fontWeight: 800 }}>Branch</span> : <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 6, border: "1px solid #C7D2FE", color: BLUE }}>Video</span>}
        </div>
      ))}
    </>
  );

  return (
    <Stage>
      <PortalTag n={3} label="Learner portal" url="learner.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={phase === 2 ? "learner.skillbnk.com/program" : "learner.skillbnk.com/dashboard"}>
          <LearnerShell active={phase === 2 ? "Program" : phase === 1 ? "Dashboard" : "My Enrollments"}>
            <div style={{ opacity: phase === 0 ? 0.5 : phase === 1 ? fi(g, 88, 10) : 1 }}>{phase === 2 ? player : dashboard}</div>
          </LearnerShell>
          {phase === 0 && (
            <>
              <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * mo})` }} />
              <div style={{ position: "absolute", left: 480, top: 30, width: 640, height: 800, borderRadius: 16, background: "#F3F4F6", opacity: mo, boxShadow: "0 30px 80px #0006", overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", background: "#F3F4F6", borderBottom: `1px solid ${LINE}` }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>My Enrollments</div>
                  <div style={{ fontSize: 13.5, color: GRAY, marginTop: 2 }}>All your enrollments, newest first. Pick one to switch to it.</div>
                </div>
                <div style={{ padding: "14px 22px" }}>
                  <div style={{ height: 42, borderRadius: 8, background: "#fff", border: `1px solid ${LINE}`, color: "#9CA3AF", fontSize: 14, display: "flex", alignItems: "center", padding: "0 12px" }}>⌕ &nbsp;Search by program, company, branch, session or instructor…</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    {["All (3)", "Programs (1)", "Courses (2)", "Interviews (0)"].map((t, i) => (
                      <div key={t} style={{ height: 34, padding: "0 14px", borderRadius: 8, background: i === 0 ? BLUE : "transparent", color: i === 0 ? "#fff" : "#374151", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center" }}>{t}</div>
                    ))}
                  </div>
                  {[
                    { t: COURSE, kind: "Course", co: COMPANY, br: "Downtown Learning Center", ses: "Fall Cohort", ins: INSTRUCTOR, date: "Sep 29, 2026", fee: ["$99", "$99", "$0"], paid: true, c1: "#1D3FD6", c2: "#0EA5E9" },
                    { t: "Sales Fundamentals", kind: "Program", co: COMPANY, br: "Downtown Learning Center", ses: "Winter Session", ins: "Mark Davis", date: "Aug 12, 2026", fee: ["$199", "$199", "$0"], paid: true, c1: "#7C3AED", c2: "#DB2777" },
                  ].map((e, i) => {
                    const hot = i === 0 && selected;
                    return (
                      <div key={e.t} style={{ marginTop: 14, borderRadius: 12, background: "#fff", border: `${hot ? 2 : 1}px solid ${hot ? BLUE : LINE}`, padding: 14, boxShadow: hot ? "0 0 0 4px #C7D2FE" : "none" }}>
                        <div style={{ display: "flex", gap: 14 }}>
                          <Cover w={120} h={80} title={e.t} c1={e.c1} c2={e.c2} fs={11} />
                          <div style={{ flex: 1, fontSize: 13.5, color: "#374151", lineHeight: 1.75 }}>
                            <div style={{ fontSize: 16.5, fontWeight: 800, color: INK, display: "flex", gap: 8, alignItems: "center" }}>{e.t}
                              <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 999, background: "#DCFCE7", color: GREEN }}>✓ Approved</span>
                              <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 999, background: BLUE_SOFT, color: BLUE }}>{e.kind}</span>
                            </div>
                            <div>🏢 {e.co} &nbsp; 🏫 {e.br}</div>
                            <div>🗓 {e.ses} &nbsp; 👤 {e.ins}</div>
                            <div>📅 {e.date}</div>
                          </div>
                          <div style={{ alignSelf: "flex-start", height: 36, padding: "0 14px", borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", transform: `scale(${i === 0 && g >= 34 && g < 40 ? 0.93 : 1})` }}>Switch →</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 14, fontWeight: 700, color: INK }}>💲 Payment status <span style={{ fontSize: 12, padding: "2px 9px", borderRadius: 999, background: "#DCFCE7", color: GREEN }}>Paid</span></div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          {[["Total fee", e.fee[0], "#F3F4F6", INK], ["Paid", e.fee[1], "#DCFCE7", GREEN], ["Due", e.fee[2], "#FEF3C7", "#D97706"]].map(([k, v, bg, c]) => (
                            <div key={k} style={{ flex: 1, height: 52, borderRadius: 8, background: bg, textAlign: "center", paddingTop: 6, boxSizing: "border-box" }}>
                              <div style={{ fontSize: 12, color: GRAY }}>{k}</div>
                              <div style={{ fontSize: 17, fontWeight: 800, color: c }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ position: "absolute", left: 0, bottom: 0, width: 640, height: 76, borderTop: `1px solid ${LINE}`, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 22px", gap: 10, boxSizing: "border-box" }}>
                  <span style={{ flex: 1, fontSize: 14, color: BLUE }}>▣ Your enrollments (3)</span>
                  <div style={{ height: 42, padding: "0 16px", borderRadius: 8, background: "#fff", border: `1px solid ${LINE}`, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center" }}>Cancel</div>
                  <div style={{ height: 42, padding: "0 16px", borderRadius: 8, background: selected ? BLUE : "#A5B4FC", color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", transform: `scale(${g >= 70 && g < 76 ? 0.93 : 1})` }}>Go to selected →</div>
                </div>
              </div>
            </>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ k9 — progress flows back up ═════════════════════════════════════════════
const SceneFlowUp: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 210;
  const g = gt(f, dur, D);
  const tiers = [
    { n: 1, t: "Company portal", u: "company.skillbnk.com", y: 140 },
    { n: 2, t: "Branch portal", u: "branch.skillbnk.com", y: 440 },
    { n: 3, t: "Learner portal", u: "learner.skillbnk.com", y: 740 },
  ];
  const brPct = Math.round(interpolate(g, [70, 110], [68, 71], cl));
  const coBars = [
    ["Downtown", interpolate(g, [110, 150], [68, 71], cl)], ["Lakeside", 64], ["Northgate", 58],
  ] as [string, number][];
  const dots = [0, 1, 2, 3].map((i) => ((g + i * 18) % 72) / 72);
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 48, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 0, 12) }}>
          Every finished lesson <span style={{ color: "#22C55E" }}>flows straight back up.</span>
        </div>
        <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1="960" y1="340" x2="960" y2="440" stroke="#2E5CF6" strokeWidth="4" opacity={fi(g, 60, 10)} />
          <line x1="960" y1="640" x2="960" y2="740" stroke="#2E5CF6" strokeWidth="4" opacity={fi(g, 30, 10)} />
          {dots.map((d, i) => (
            <React.Fragment key={i}>
              <circle cx="960" cy={740 - 100 * d} r="8" fill="#22C55E" opacity={fi(g, 30, 10)} />
              <circle cx="960" cy={440 - 100 * d} r="8" fill="#22C55E" opacity={fi(g, 70, 10)} />
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
              <div style={{ padding: "18px 26px" }}>
                {i === 2 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#F472B6,#DB2777)", color: "#fff", fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>EC</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{LEARNER}</div>
                      <div style={{ fontSize: 17, color: GRAY }}>{COURSE} · Downtown Learning Center</div>
                    </div>
                    <div style={{ marginLeft: "auto", padding: "12px 18px", borderRadius: 12, background: "#DCFCE7", color: GREEN, fontWeight: 800, fontSize: 19, opacity: fi(g, 20, 10), transform: `scale(${sp(g, 20, fps, { damping: 10 })})` }}>✓ Lesson 3 completed</div>
                  </div>
                )}
                {i === 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Downtown Learning Center</div>
                      <div style={{ fontSize: 16, color: GRAY }}>Learner progress · 42 learners · {COURSE}</div>
                    </div>
                    <div style={{ marginLeft: "auto", width: 380 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: INK, fontWeight: 700 }}>Course completion <span style={{ color: GREEN }}>{brPct}%</span></div>
                      <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "#E5E7EB" }}><div style={{ width: `${brPct}%`, height: 12, borderRadius: 6, background: "#22C55E" }} /></div>
                    </div>
                  </div>
                )}
                {i === 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{COMPANY}</div>
                      <div style={{ fontSize: 16, color: GRAY }}>Reports & leaderboard · by branch</div>
                    </div>
                    <div style={{ marginLeft: "auto", width: 480 }}>
                      {coBars.map(([n, v]) => (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                          <span style={{ width: 96, fontSize: 14.5, color: "#374151" }}>{n}</span>
                          <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E5E7EB" }}><div style={{ width: `${v}%`, height: 12, borderRadius: 6, background: BLUE }} /></div>
                          <span style={{ width: 44, fontSize: 14.5, fontWeight: 700, color: INK }}>{Math.round(v)}%</span>
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

// ═══ k10 — WRAP: three portals, one platform ═════════════════════════════════
const SceneWrap: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 180;
  const g = gt(f, dur, D);
  const merge = interpolate(g, [70, 110], [0, 1], { ...cl, easing: EZ });
  const logo = sp(g, 100, fps, { damping: 13 });
  const wins = [
    { t: "Company", u: "company.skillbnk.com", c: "#2563EB" },
    { t: "Branch", u: "branch.skillbnk.com", c: "#0EA5E9" },
    { t: "Learner", u: "learner.skillbnk.com", c: "#22C55E" },
  ];
  return (
    <Stage>
      {wins.map((w, i) => {
        const p = sp(g, 4 + i * 8, fps);
        const baseX = 150 + i * 560;
        const x = baseX + (710 - baseX) * merge + (i - 1) * 40 * merge;
        const y = 380 + (i - 1) * 30 * merge;
        return (
          <div key={w.t} style={{ position: "absolute", left: x, top: y, width: 500, height: 300, borderRadius: 14, background: "#fff", overflow: "hidden", boxShadow: "0 20px 60px #000A", opacity: p * (1 - 0.15 * merge * (i === 1 ? 0 : 1)), transform: `translateY(${(1 - p) * 60}px) scale(${1 - 0.1 * merge})`, zIndex: i === 1 ? 3 : 2 }}>
            <div style={{ height: 34, background: "#1E2740", display: "flex", alignItems: "center", padding: "0 12px", gap: 6 }}>
              {["#FF6B5E", "#FFC15E", "#3ED07F"].map((c) => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
              <div style={{ margin: "0 auto", fontSize: 13, color: "#A9B4CC" }}>🔒 {w.u}</div>
            </div>
            <div style={{ display: "flex", height: 266 }}>
              <div style={{ width: 110, borderRight: `1px solid ${LINE}`, padding: 10 }}>
                {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ height: 10, borderRadius: 5, background: k === 2 ? w.c : "#E5E7EB", marginTop: 12, width: k === 2 ? "90%" : "75%" }} />)}
              </div>
              <div style={{ flex: 1, padding: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{w.t} portal</div>
                <div style={{ marginTop: 12, height: 70, borderRadius: 10, background: `${w.c}22` }} />
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>{[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 60, borderRadius: 8, background: "#F3F4F6" }} />)}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.6 + 0.4 * logo})` }}>
        <Img src={staticFile("skillbnk-logo.png")} style={{ width: 420, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", opacity: fi(g, 110, 12) }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#8A96B2", letterSpacing: 3, textTransform: "uppercase" }}>Company · Branch · Learner</div>
        <div style={{ marginTop: 10, fontSize: 52, fontWeight: 800, color: "#F1F5F9" }}>Three portals. <span style={{ color: "#7FA0FF" }}>One connected platform.</span></div>
      </div>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  k0: SceneHook, k1: SceneProblem, k2: SceneTurn, k3: SceneWizard, k4: SceneBranches,
  k5: SceneProgress, k6: SceneBranchLogin, k7: SceneBranchEdit, k8: SceneLearner, k9: SceneFlowUp, k10: SceneWrap,
};

export const PortalsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "k10" ? TAIL : 0);
        return (
          <Sequence key={k} from={STARTS[k]} durationInFrames={d}>
            <Scene f={frame - STARTS[k]} dur={d} fps={fps} />
          </Sequence>
        );
      })}
      {/* 🎬 MAIN INTRO (shared) — after the hook + problem */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}>
        <MainIntro />
      </Sequence>
      {ALL.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={`a-${k}`} from={STARTS[k]} durationInFrames={DURATIONS[k]}>
          <Audio src={staticFile(`portals/${k}.mp3`)} />
        </Sequence>
      ))}
      {/* 🎬 MAIN OUTRO (shared) */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
