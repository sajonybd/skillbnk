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
// EnrollmentFormBuilderVideo — "Enrollment Form Builder" (sheet serial 17).
// Every label verified in the skillBNK code (see the header comment of the scenes part below).
// ALL names and data are FICTIONAL (Brightpath Academy). Built by _parts/build_forms.py.
// Voice: bash generate-voice-enrollmentbuilder.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  e0: 365,
  e1: 339,
  e2: 368,
  e3: 410,
  e4: 325,
  e5: 336,
  e6: 326,
  e7: 329,
  e8: 354,
  e9: 460,
  e10: 160,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "e10"];

const PRE = ["e0"] as const; // hook, BEFORE the intro
const POST = ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "e10"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { e0: 400, e1: 330, e2: 300, e3: 420, e4: 360, e5: 420, e6: 420, e7: 380, e8: 400, e9: 460, e10: 220 };
const PACE: Record<Key, number> = { e0: 1, e1: 1, e2: 1, e3: 1, e4: 1, e5: 1, e6: 1, e7: 1, e8: 1, e9: 1, e10: 1 };
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
  <div style={{ position: "absolute", right: 26, bottom: 26, display: "flex", alignItems: "center", gap: 10, opacity: opacity * 0.92, zIndex: 50, fontFamily: FONT, padding: "6px 16px 6px 6px", borderRadius: 999, background: "rgba(4,6,13,0.72)", border: "1px solid #2E5CF644", boxShadow: "0 6px 20px #0007" }}>
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2E5CF6", color: "#fff", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
    <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#8A96B2" }}>· {url}</div>
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

// ═══════════════════════════════════════════════════════════════════════════
// White-Label Training Platform — scenes. Real UI (SB-Company website-builder):
// page.tsx ("Website Builder" · "Build and publish your company website", New Website:
// Name / Slug (subdomain) / Page title / Description; "Free SkillBNK domains" → Landing,
// Learner portal, Branch portal, Company admin; "Domain setup": "Main custom landing domain",
// "Do not include https:// or a path.", DNS instructions, Hostname ownership TXT, SSL TXT
// records; with a custom domain → learner.<domain>, branch.<domain>, company.<domain>).
// BrandPanel.tsx tabs Colors / Type / Layout / Site SEO / CSS; Logos: Light logo, Dark logo,
// Favicon. sb-landing auth pages (login/register) apply brand logos + colors (useAuthContent).
// ═══════════════════════════════════════════════════════════════════════════
const BRAND = "Brightpath Academy";
const SLUG = "brightpath";
const DOMAIN = "learnbrightpath.com";
const BP = "#0F766E";  // brand primary (teal) set in the Brand panel
const BP_ACC = "#F59E0B";

const BrightLogo: React.FC<{ s?: number; dark?: boolean }> = ({ s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38"><rect width="38" height="38" rx="10" fill={BP} /><circle cx="19" cy="20" r="7" fill={BP_ACC} /><path d="M19 5v5M19 30v4M6 20h4M28 20h4M9.5 10.5l3 3M25.5 26.5l3 3M9.5 29.5l3-3M25.5 13.5l3-3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
    <div><div style={{ fontSize: 16 * s, fontWeight: 900, color: dark ? "#fff" : BP, letterSpacing: 0.6 }}>BRIGHTPATH</div><div style={{ fontSize: 10.5 * s, fontWeight: 600, color: dark ? "#CCFBF1" : GRAY }}>Academy</div></div>
  </div>
);

/** Brightpath Academy public website — every section of the page (built from Design-library
 *  blocks: Academy Hero, Logo Bar, Programs, Feature Grid, Testimonials, FAQ, Call to Action,
 *  footer). `scroll` moves the page; header stays fixed. Viewport = 1600 × 856 content. */
const SITE_H = 2600;
const BrightSite: React.FC<{ g: number; fps: number; scroll: number; pressSignIn?: boolean; hosts?: boolean }> = ({ g, fps, scroll, pressSignIn, hosts }) => {
  const sec = (title: string, sub: string) => (<><div style={{ fontSize: 15, fontWeight: 800, color: BP, letterSpacing: 2 }}>{sub}</div><div style={{ marginTop: 8, fontSize: 40, fontWeight: 900, color: "#0f172a" }}>{title}</div></>);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: "Poppins, " + FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -scroll, width: W, height: SITE_H }}>
        {/* hero */}
        <div style={{ position: "absolute", left: 0, top: 70, width: W, height: 620, background: `linear-gradient(135deg, ${BP}18, #fff 60%)` }}>
          <div style={{ position: "absolute", left: 90, top: 90, width: 760 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: `${BP_ACC}26`, color: "#92400E", fontSize: 15, fontWeight: 800 }}>Fall 2026 enrollment open</div>
            <div style={{ marginTop: 22, fontSize: 64, fontWeight: 900, color: "#0f172a", lineHeight: 1.08 }}>Launch your career<br />with <span style={{ color: BP }}>{BRAND}</span></div>
            <div style={{ marginTop: 20, fontSize: 20, color: "#475569", lineHeight: 1.5 }}>Career training for customer-service and sales teams. Learn online, join live classes, earn a certificate.</div>
            <div style={{ marginTop: 30, display: "flex", gap: 14 }}><span style={{ padding: "15px 30px", borderRadius: 12, background: BP, color: "#fff", fontWeight: 800, fontSize: 17 }}>Browse programs</span><span style={{ padding: "15px 30px", borderRadius: 12, border: `2px solid ${BP_ACC}`, color: "#0f172a", fontWeight: 800, fontSize: 17 }}>Talk to us</span></div>
          </div>
          <div style={{ position: "absolute", left: 930, top: 80, width: 580, height: 440, borderRadius: 28, background: `linear-gradient(160deg,${BP},#134E4A)`, boxShadow: "0 30px 60px #0F766E40" }}>
            {[["Online", "Learn at your pace"], ["Live classes", "Weekly with coaches"], ["Certificates", "Show your skills"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 40 + (i % 2) * 260, top: 50 + i * 120, width: 240, padding: 16, borderRadius: 16, background: "#fff", boxShadow: "0 10px 30px #0003" }}><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{a}</div><div style={{ fontSize: 14, color: GRAY }}>{b}</div></div>)}
          </div>
        </div>
        {/* logo bar / stats */}
        <div style={{ position: "absolute", left: 0, top: 690, width: W, height: 140, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[["1,200+", "learners trained"], ["3", "campuses"], ["24", "programs"], ["4.8★", "learner rating"]].map(([a, b]) => <div key={b} style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 900, color: BP }}>{a}</div><div style={{ fontSize: 15, color: GRAY }}>{b}</div></div>)}
        </div>
        {/* programs (dynamic block) */}
        <div style={{ position: "absolute", left: 90, top: 900, width: 1420 }}>
          {sec("Our programs", "PROGRAMS")}
          <div style={{ marginTop: 30, display: "flex", gap: 26 }}>
            {[["Customer Service Essentials", "6 weeks · Online + live"], ["Sales Conversations", "8 weeks · Blended"], ["Team Lead Basics", "4 weeks · Live"]].map(([a, b]) => (
              <div key={a} style={{ flex: 1, borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 10px 30px #0F172A0D" }}>
                <div style={{ height: 150, background: `linear-gradient(135deg,${BP},#14B8A6)` }} />
                <div style={{ padding: 20 }}><div style={{ fontSize: 20, fontWeight: 800, color: INK }}>{a}</div><div style={{ marginTop: 6, fontSize: 15, color: GRAY }}>{b}</div><div style={{ marginTop: 16, display: "inline-block", padding: "9px 18px", borderRadius: 10, background: `${BP}14`, color: BP, fontWeight: 800, fontSize: 14 }}>Enroll now →</div></div>
              </div>
            ))}
          </div>
        </div>
        {/* features */}
        <div style={{ position: "absolute", left: 90, top: 1420, width: 1420 }}>
          {sec(`Why ${BRAND}`, "WHY US")}
          <div style={{ marginTop: 30, display: "flex", gap: 26 }}>
            {[["🎯", "Job-ready skills", "Practical lessons built with employers."], ["🎙", "AI practice calls", "Rehearse real conversations before the real thing."], ["🎓", "Certificates", "Finish a program and earn your certificate."]].map(([ic, a, b]) => <div key={a} style={{ flex: 1, padding: 26, borderRadius: 18, background: "#F8FAFC" }}><div style={{ fontSize: 36 }}>{ic}</div><div style={{ marginTop: 10, fontSize: 21, fontWeight: 800, color: INK }}>{a}</div><div style={{ marginTop: 6, fontSize: 15.5, color: GRAY }}>{b}</div></div>)}
          </div>
        </div>
        {/* testimonials */}
        <div style={{ position: "absolute", left: 0, top: 1800, width: W, height: 330, background: `${BP}0D` }}>
          <div style={{ position: "absolute", left: 90, top: 50 }}>{sec("What learners say", "TESTIMONIALS")}</div>
          {[["“I landed a team-lead role three months after finishing.”", "Sofia Reyes"], ["“The live classes and practice calls made all the difference.”", "Daniel Kim"]].map(([q, n], i) => <div key={n} style={{ position: "absolute", left: 90 + i * 720, top: 170, width: 680, padding: 24, borderRadius: 18, background: "#fff", boxShadow: "0 10px 30px #0F172A0D", boxSizing: "border-box" }}><div style={{ fontSize: 19, color: INK, fontStyle: "italic" }}>{q}</div><div style={{ marginTop: 10, fontSize: 15, fontWeight: 800, color: BP }}>— {n}</div></div>)}
        </div>
        {/* CTA */}
        <div style={{ position: "absolute", left: 90, top: 2180, width: 1420, height: 200, borderRadius: 24, background: `linear-gradient(120deg,${BP},#134E4A)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", boxSizing: "border-box" }}>
          <div><div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>Ready to start?</div><div style={{ fontSize: 17, color: "#CCFBF1", marginTop: 6 }}>Fall 2026 cohorts are filling up.</div></div>
          <span style={{ padding: "16px 32px", borderRadius: 12, background: BP_ACC, color: "#0f172a", fontWeight: 900, fontSize: 18 }}>Apply now</span>
        </div>
        {/* footer */}
        <div style={{ position: "absolute", left: 0, top: 2430, width: W, height: 170, background: "#0f172a", display: "flex", alignItems: "center", padding: "0 90px", gap: 60, boxSizing: "border-box" }}>
          <BrightLogo dark /><span style={{ flex: 1 }} />{["Programs", "About", "Contact", "Privacy"].map((x) => <span key={x} style={{ color: "#94A3B8", fontSize: 15 }}>{x}</span>)}<span style={{ color: "#64748B", fontSize: 14 }}>© 2026 {BRAND}</span>
        </div>
      </div>
      {/* fixed header */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 70, background: "#ffffffF2", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", padding: "0 40px", gap: 30, boxSizing: "border-box", zIndex: 5 }}>
        <BrightLogo /><span style={{ flex: 1 }} />{["Programs", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, color: "#374151", fontWeight: 600 }}>{t}</span>)}
        <span style={{ padding: "9px 20px", borderRadius: 999, background: BP, color: "#fff", fontWeight: 700, fontSize: 14, transform: `scale(${pressSignIn ? 0.94 : 1})` }}>Sign in</span>
      </div>
      {hosts && <div style={{ position: "absolute", right: 30, bottom: 26, display: "flex", flexDirection: "column", gap: 8, zIndex: 6 }}>{HOSTS_ALL.map(([l, h], i) => <span key={h} style={{ padding: "10px 16px", borderRadius: 12, background: "#fff", boxShadow: "0 6px 20px #0F172A26", fontSize: 15, fontWeight: 700, color: INK, opacity: sp(g, 20 + i * 10, fps) }}>🔒 {h}</span>)}</div>}
    </div>
  );
};
const HOSTS_ALL = [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]];

const WB_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Branch Management" }, { t: "Courses & Programs", more: true }, { t: "Attendance", more: true },
  { t: "Staff Management", more: true }, { t: "Marketing", more: true }, { t: "Form Builder" }, { t: "Menu Builder" },
  { t: "Website Builder" }, { t: "Enrollment form Builder" }, { t: "Integrations" },
];
const CoShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><BrightLogo /></div>
      <div style={{ marginTop: 10, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search...</div>
      {WB_MENU.map((m, i) => {
        const on = m.t === "Website Builder";
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: 120 + i * 36, width: SIDE - 24, height: 34, display: "flex", alignItems: "center", gap: 9, padding: "0 6px", boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            <Ico c={on ? BLUE : "#4B5563"} s={14} /><span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>{m.more && <Chevron />}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} /><div style={{ flex: 1 }} />
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <Avatar t="AR" c1="#14B8A6" c2="#0F766E" />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
const CoStage: React.FC<{ g: number; keys: CamKey[]; url: string; cur: { x: number; y: number }; ripple: number; children: React.ReactNode; over?: React.ReactNode }> = ({ g, keys, url, cur, ripple, children, over }) => (
  <Stage>
    <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
    <CamC g={g} keys={keys}>
      <Browser url={url}>
        <CoShell>{children}</CoShell>
        {over}
        <Cursor x={cur.x} y={cur.y} ripple={ripple} />
      </Browser>
    </CamC>
  </Stage>
);
const DomainRows: React.FC<{ custom: boolean; o?: number }> = ({ custom, o = 1 }) => {
  const rows = custom
    ? [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]]
    : [["Landing", `${SLUG}.skillbnk.com`], ["Learner portal", `${SLUG}.learner.skillbnk.com`], ["Branch portal", `${SLUG}.branch.skillbnk.com`], ["Company admin", `${SLUG}.company.skillbnk.com`]];
  return (
    <div style={{ opacity: o }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>{custom ? "CUSTOM DOMAINS" : "FREE SKILLBNK DOMAINS"}</div>
      {rows.map(([a, b]) => (
        <div key={a} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
          <span style={{ width: 120, color: GRAY, fontWeight: 600 }}>{a}</span>
          <span style={{ flex: 1, fontWeight: 700, color: custom ? BP : INK, fontFamily: "monospace" }}>{b}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>⧉ Copy</span>
        </div>
      ))}
    </div>
  );
};
/** Real site card (website-builder/page.tsx): name + status badge (+ domain status), 🌐 domain,
 *  "Set up" (⚙) top-right; description; "Free SkillBNK domains" / "Custom domains" (+ "custom" pill)
 *  rows with copy; footer Edit · Visit · delete. */
const SiteCard: React.FC<{ custom: boolean; x?: number; y?: number; o?: number; hl?: number; status?: "pending" | "active"; pressSetup?: boolean; pressVisit?: boolean; pressCopy?: number }> = ({ custom, x = 20, y = 90, o = 1, hl = 0, status = "active", pressSetup, pressVisit, pressCopy = -1 }) => {
  const rows = custom
    ? [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]]
    : [["Landing", `${SLUG}.skillbnk.com`], ["Learner portal", `${SLUG}.learner.skillbnk.com`], ["Branch portal", `${SLUG}.branch.skillbnk.com`], ["Company admin", `${SLUG}.company.skillbnk.com`]];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 640, height: 470, borderRadius: 14, background: "#fff", border: `${hl > 0.5 ? 2 : 1}px solid ${hl > 0.5 ? BP : LINE}`, boxShadow: "0 8px 24px #0F172A10", overflow: "hidden", opacity: o }}>
      <div style={{ height: 86, background: "#F8FAFC", borderBottom: `1px solid ${LINE}`, padding: "16px 20px", boxSizing: "border-box", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 19, fontWeight: 800, color: INK }}>{BRAND}</span>
          <Badge t="published" c={GREEN} bg="#DCFCE7" fs={11.5} />
          {custom && (status === "active" ? <Badge t="active" c={GREEN} bg="#DCFCE7" fs={11.5} /> : <Badge t="pending" c="#A16207" bg="#FEF9C3" fs={11.5} />)}
        </div>
        <div style={{ marginTop: 6, fontSize: 13.5, color: GRAY }}>🌐 {custom ? DOMAIN : `${SLUG}.skillbnk.com`}</div>
        <div style={{ position: "absolute", right: 20, top: 18, height: 34, padding: "0 12px", borderRadius: 7, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#475569", transform: `scale(${pressSetup ? 0.92 : 1})` }}>⚙ Set up</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 13.5, color: GRAY }}>Career training for customer-service and sales teams.</div>
        <div style={{ marginTop: 14, borderRadius: 10, border: `1px solid ${LINE}`, background: "#F8FAFC", padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>{custom ? "CUSTOM DOMAINS" : "FREE SKILLBNK DOMAINS"}</span>
            {custom && <span style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", background: "#EFF6FF", padding: "2px 8px", borderRadius: 999 }}>custom</span>}
          </div>
          {rows.map(([a2, b2], i) => (
            <div key={a2} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, padding: "6px 10px" }}>
              <span style={{ width: 110, color: "#475569", fontWeight: 600 }}>{a2}</span>
              <span style={{ flex: 1, fontWeight: 600, color: custom ? BP : INK, fontFamily: "monospace" }}>{b2}</span>
              <span style={{ fontSize: 13, color: pressCopy === i ? BLUE : "#94A3B8" }}>⧉</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 16, borderTop: `1px solid ${LINE}`, paddingTop: 12, display: "flex", gap: 8 }}>
        <span style={{ padding: "8px 14px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>✎ Edit</span>
        <span style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: INK, transform: `scale(${pressVisit ? 0.92 : 1})` }}>↗ Visit</span>
        <span style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, color: "#DC2626" }}>🗑</span>
      </div>
    </div>
  );
};

// ═══ w0 — HOOK: someone else's logo on your sign-up page ═══════════════════
const SceneHookWL: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 240;
  const g = gt(f, dur, D);
  const flip = g >= 150;
  const card = sp(g, 4, fps);
  const lines = [
    { t: "Your customers find your course…", at: 6, c: "#F1F5F9" },
    { t: "then sign up on someone else's page.", at: 70, c: "#FCA5A5" },
  ];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 460, top: 90, width: 1000, height: 560, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 100px #000C", opacity: card, transform: `scale(${0.92 + 0.08 * card})` }}>
          <div style={{ height: 44, background: "#1E2740", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
            {["#FF6B5E", "#FFC15E", "#3ED07F"].map((c) => <i key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            <span style={{ margin: "0 auto", fontSize: 14, color: "#A9B4CC", background: "#0F1729", padding: "5px 20px", borderRadius: 7 }}>🔒 {flip ? `${DOMAIN}/auth/login` : "genericlms-portal.io/school/8841/login"}</span>
          </div>
          <div style={{ display: "flex", height: 516 }}>
            <div style={{ flex: 1, padding: 50 }}>
              {flip ? <BrightLogo s={1.3} /> : <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 46, height: 46, borderRadius: 10, background: "#9CA3AF" }} /><span style={{ fontSize: 22, fontWeight: 800, color: "#6B7280" }}>GenericLMS</span></div>}
              <div style={{ marginTop: 40, fontSize: 34, fontWeight: 800, color: INK }}>Welcome back!</div>
              <div style={{ marginTop: 26, height: 50, borderRadius: 10, border: "1px solid #D1D5DB" }} />
              <div style={{ marginTop: 14, height: 50, borderRadius: 10, border: "1px solid #D1D5DB" }} />
              <div style={{ marginTop: 22, height: 52, borderRadius: 10, background: flip ? BP : "#6B7280", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>Sign in</div>
              {!flip && <div style={{ marginTop: 18, fontSize: 13, color: "#9CA3AF" }}>Powered by GenericLMS</div>}
            </div>
            <div style={{ width: 420, background: flip ? `linear-gradient(160deg,${BP},#134E4A)` : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>{flip ? <BrightLogo s={1.6} dark /> : <span style={{ fontSize: 60, color: "#9CA3AF" }}>?</span>}</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
          {!flip && lines.map((l) => { const o = fi(g, l.at, 12); return <div key={l.t} style={{ fontSize: 48, fontWeight: 800, color: l.c, opacity: o, lineHeight: 1.3 }}>{l.t}</div>; })}
          {flip && <div style={{ fontSize: 56, fontWeight: 900, color: "#F1F5F9", opacity: fi(g, 150, 12) }}>What if it was <span style={{ color: "#5EEAD4" }}>all yours?</span></div>}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ w1 — Website Builder → New Website ═══════════════════════════════════
const SceneNewSite: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const modal = g >= 40 && g < 250 ? Math.min(fi(g, 40, 10), fo(g, 240, 10)) : 0;
  const made = g >= 250;
  const NEW = { x: MX(1250), y: MY(46) };
  const CREATE = { x: MX(960), y: MY(640) };
  const cur = path(g, [[0, 900, 600], [24, NEW.x, NEW.y], [40, NEW.x, NEW.y], [70, MX(680), MY(250)], [200, MX(680), MY(400)], [226, CREATE.x, CREATE.y], [248, CREATE.x, CREATE.y], [330, MX(500), MY(500)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 1300, 120, 1.5], [44, 1300, 120, 1.5], [70, 930, 470, 1.25], [240, 930, 470, 1.25], [270, 600, 420, 1.3], [330, 600, 420, 1.3]];
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={Math.max(rip(g, 36), rip(g, 244))}
      over={modal > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * modal})`, zIndex: 40 }}>
          <div style={{ position: "absolute", left: MX(420), top: MY(110) + BAR, width: 640, height: 560, borderRadius: 16, background: "#fff", opacity: modal, padding: 28, boxSizing: "border-box" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>New Website</div>
            <Input x={28} y={70} w={584} label="Name" req value={typed(g, 70, BRAND)} ph="My Company Website" glow={g >= 70 && g < 110 ? 1 : 0} />
            <Input x={28} y={160} w={584} label="Slug (subdomain)" req value={typed(g, 110, SLUG)} ph="my-company" />
            <Input x={28} y={250} w={584} label="Page title" value={typed(g, 130, "Brightpath Academy — Learn with us")} ph="My Company — Learn with us" />
            <Input x={28} y={340} w={584} h={80} label="Description" value={typed(g, 165, "Career training for customer-service and sales teams.", 1.5)} ph="Short description for SEO…" />
            <Btn x={340} y={480} w={130} h={44} label="Cancel" fs={14.5} />
            <Btn x={482} y={480} w={130} h={44} label="Create" primary fs={14.5} press={g >= 244 && g < 250 ? 1 : 0} />
          </div>
        </div>
      ) : null}>
      <PageTitle t="Website Builder" sub="Build and publish your company website" />
      <Btn x={1180} y={24} w={150} h={42} label="+ New Website" primary fs={14.5} press={g >= 36 && g < 42 ? 1 : 0} />
      {made ? <SiteCard custom={false} o={sp(g, 250, fps)} /> : (
        <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 400, borderRadius: 14, border: "1px dashed #CBD5E1", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ fontSize: 44 }}>🌐</div><div style={{ fontSize: 20, fontWeight: 800, color: INK }}>No websites yet</div><div style={{ fontSize: 15, color: GRAY }}>Create your first website to get started</div>
        </div>
      )}
    </CoStage>
  );
};

// ═══ w2 — Brand panel: Colors → Type → Logos ══════════════════════════════
const BrandSwatch: React.FC<{ label: string; c: string; hl?: boolean }> = ({ label, c, hl }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: 6, borderRadius: 8, background: hl ? "#F0FDFA" : "transparent" }}>
    <span style={{ width: 30, height: 30, borderRadius: 7, background: c, border: "1px solid #0002" }} />
    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>{label}</span>
    <span style={{ fontSize: 12.5, fontFamily: "monospace", color: GRAY }}>{c}</span>
  </div>
);
const SceneBrand: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const tab = g < 170 ? "Colors" : g < 280 ? "Type" : "Logos";
  const mix = fi(g, 70, 30);
  const prim = mix > 0.5 ? BP : "#6366F1";
  const acc = mix > 0.5 ? BP_ACC : "#F59E0B";
  const font = g >= 210 ? "Poppins" : "Inter";
  const logoIn = g >= 320;
  const cur = path(g, [[0, 900, 600], [40, 140, 260], [70, 140, 260], [150, 140, 260], [170, 230, 150], [190, 230, 150], [210, 160, 260], [280, 160, 260], [300, 140, 470], [330, 140, 470], [420, 140, 470]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 600, 440, 1.2], [420, 600, 440, 1.2]];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url={`company.skillbnk.com/website-builder/${SLUG}`}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 56, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 12, boxSizing: "border-box" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>← {BRAND}</span><span style={{ fontSize: 13, color: GRAY }}>Home</span>
            <span style={{ flex: 1 }} />
            <span style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>✨ AI</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>Preview</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>Publish</span>
          </div>
          <div style={{ position: "absolute", left: 0, top: 56, width: 360, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: INK, marginBottom: 10 }}>Brand</div>
            <div style={{ display: "flex", borderBottom: `1px solid ${LINE}`, marginBottom: 14 }}>
              {["Colors", "Type", "Layout", "Site SEO", "CSS"].map((t) => { const on = t === tab || (tab === "Logos" && t === "Site SEO" && false); return <span key={t} style={{ flex: 1, textAlign: "center", padding: "8px 0", fontSize: 12, fontWeight: 700, color: on ? BLUE : GRAY, borderBottom: on ? `2px solid ${BLUE}` : "none" }}>{t}</span>; })}
            </div>
            {tab === "Colors" && <div><BrandSwatch label="Primary" c={prim} hl={g >= 70 && g < 110} /><BrandSwatch label="Primary text" c="#ffffff" /><BrandSwatch label="Accent" c={acc} hl={g >= 110 && g < 150} /><BrandSwatch label="Background" c="#ffffff" /><BrandSwatch label="Text" c="#0f172a" /></div>}
            {tab === "Type" && <div style={{ opacity: fi(g, 170, 8) }}>
              <Input x={14} y={100} w={330} label="Heading font" value={font} select glow={g >= 200 && g < 240 ? 1 : 0} />
              <Input x={14} y={190} w={330} label="Body font" value="Inter" select />
              <Input x={14} y={280} w={160} label="Base font size (px)" value="16" />
              <Input x={184} y={280} w={160} label="Line height" value="1.6" />
            </div>}
            {tab === "Logos" && <div style={{ opacity: fi(g, 280, 8) }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>LOGOS</div>
              {[["Light logo", false], ["Dark logo", true], ["Favicon", false]].map(([l, d], i) => (
                <div key={l as string} style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>{l as string}</div>
                  <div style={{ marginTop: 6, height: 70, borderRadius: 10, border: `1.5px dashed ${logoIn ? BP : "#CBD5E1"}`, background: d && logoIn ? "#134E4A" : "#FAFAFB", display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 }}>
                    {logoIn && g >= 320 + i * 14 ? (i === 2 ? <div style={{ width: 34, height: 34, borderRadius: 8, background: BP, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: BP_ACC }} /></div> : <BrightLogo s={0.9} dark={d as boolean} />) : <span style={{ fontSize: 13, color: GRAY }}>⤒ Upload</span>}
                  </div>
                </div>
              ))}
            </div>}
          </div>
          <div style={{ position: "absolute", left: 380, top: 76, width: 1200, height: 770, borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0 6px 20px #0F172A14", fontFamily: font === "Poppins" ? "Poppins, " + FONT : FONT }}>
            <div style={{ height: 70, display: "flex", alignItems: "center", padding: "0 34px", gap: 26, borderBottom: "1px solid #EEF2F7" }}>
              {logoIn ? <BrightLogo /> : <span style={{ fontSize: 20, fontWeight: 800, color: INK }}>{BRAND}</span>}
              <span style={{ flex: 1 }} />{["Courses", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, color: "#374151", fontWeight: 600 }}>{t}</span>)}
              <span style={{ padding: "9px 20px", borderRadius: 999, background: prim, color: "#fff", fontWeight: 700, fontSize: 14 }}>Sign in</span>
            </div>
            <div style={{ padding: "70px 60px", background: `linear-gradient(135deg, ${prim}14, #fff)` }}>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: `${acc}26`, color: "#92400E", fontSize: 14, fontWeight: 800 }}>Fall 2026 enrollment open</div>
              <div style={{ marginTop: 20, fontSize: 56, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>Launch your career<br />with <span style={{ color: prim }}>{BRAND}</span></div>
              <div style={{ marginTop: 18, fontSize: 19, color: "#475569" }}>Career training for customer-service and sales teams.</div>
              <div style={{ marginTop: 30, display: "flex", gap: 14 }}><span style={{ padding: "14px 28px", borderRadius: 12, background: prim, color: "#fff", fontWeight: 800 }}>Browse courses</span><span style={{ padding: "14px 28px", borderRadius: 12, border: `2px solid ${acc}`, color: "#0f172a", fontWeight: 800 }}>Talk to us</span></div>
            </div>
          </div>
          <Cursor x={cur.x} y={cur.y + 56} ripple={Math.max(rip(g, 66), rip(g, 186), rip(g, 206), rip(g, 326))} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ w3 — Domain setup → custom domain → all portals on your domain ═══════
const SceneDomain: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const modal = g >= 40 && g < 290 ? Math.min(fi(g, 40, 10), fo(g, 280, 10)) : 0;
  const custom = g >= 290;
  const DS = { x: MX(20 + 640 - 60), y: MY(90 + 35) };
  const SAVE = { x: MX(420 + 560), y: MY(110 + 560) };
  const cur = path(g, [[0, 900, 600], [24, DS.x, DS.y], [40, DS.x, DS.y], [70, MX(700), MY(250)], [250, MX(700), MY(250)], [272, SAVE.x, SAVE.y], [288, SAVE.x, SAVE.y], [400, MX(700), MY(560)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 500, 500, 1.3], [44, 500, 500, 1.3], [70, 930, 470, 1.2], [280, 930, 470, 1.2], [310, 560, 420, 1.45], [400, 560, 420, 1.45]];
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={Math.max(rip(g, 36), rip(g, 284))}
      over={modal > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * modal})`, zIndex: 40 }}>
          <div style={{ position: "absolute", left: MX(420), top: MY(60) + BAR, width: 680, height: 640, borderRadius: 16, background: "#fff", opacity: modal, padding: 28, boxSizing: "border-box" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Domain setup</div>
            <div style={{ fontSize: 13.5, color: GRAY, marginTop: 4 }}>Cloudflare hostname and SSL verification</div>
            <Input x={28} y={90} w={624} label="Main custom landing domain" value={typed(g, 70, DOMAIN, 1)} ph="customer.com" glow={g >= 70 && g < 110 ? 1 : 0} />
            <div style={{ position: "absolute", left: 28, top: 172, fontSize: 12.5, color: GRAY }}>Do not include https:// or a path.</div>
            <div style={{ position: "absolute", left: 28, top: 206, width: 624, opacity: fi(g, 120, 10) }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>DNS instructions</div>
              {[["Hostname ownership TXT", "Name"], ["SSL TXT records", "Name"]].map(([a, b], i) => (
                <div key={a} style={{ marginTop: 10, padding: 12, borderRadius: 10, background: "#F9FAFB", border: `1px solid ${LINE}`, opacity: fi(g, 130 + i * 20, 8) }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#374151" }}>{a} <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 6, background: "#E0E7FF", color: BLUE, fontSize: 11 }}>TXT</span></div>
                  <div style={{ marginTop: 6, fontSize: 13, fontFamily: "monospace", color: GRAY, filter: "blur(3px)" }}>{b} · _verify.learnbrightpath.com</div>
                  <div style={{ fontSize: 13, fontFamily: "monospace", color: GRAY, filter: "blur(3px)" }}>a8f3c2e9-7d41-4b6e-9c0a-2f5b8e1d3c77</div>
                </div>
              ))}
              {g >= 200 && <div style={{ marginTop: 14, display: "flex", gap: 10, opacity: fi(g, 200, 10) }}>{["All hostnames", "All SSL certificates"].map((x) => <span key={x} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: INK }}>{x}</span>)}</div>}
            </div>
            <Btn x={390} y={570} w={120} h={44} label="Cancel" fs={14.5} />
            <Btn x={522} y={570} w={130} h={44} label="Save domain" primary fs={14.5} press={g >= 284 && g < 290 ? 1 : 0} />
          </div>
        </div>
      ) : null}>
      <PageTitle t="Website Builder" sub="Build and publish your company website" />
      <Btn x={1180} y={24} w={150} h={42} label="+ New Website" primary fs={14.5} />
      <SiteCard custom={custom} hl={custom ? 1 : 0} />
      {custom && <div style={{ position: "absolute", left: 690, top: 120, width: 600, opacity: fi(g, 310, 12), fontSize: 30, fontWeight: 800, color: INK, lineHeight: 1.35 }}>Every portal now runs on<br /><span style={{ color: BP }}>{DOMAIN}</span></div>}
    </CoStage>
  );
};

// ═══ w4 — Learner side: your domain, your brand, your login ═══════════════
const SceneLearnerWL: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const login = g >= 150;
  const SIGN = { x: 1460, y: 79 };
  const cur = path(g, [[0, 800, 600], [110, SIGN.x, SIGN.y], [140, SIGN.x, SIGN.y], [200, 500, 470], [300, 500, 470]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [300, WIDE_X, WIDE_Y, 1]];
  return (
    <Stage>
      <PortalTag n={2} label="Your website" url={DOMAIN} />
      <CamC g={g} keys={keys}>
        <Browser url={login ? `${DOMAIN}/auth/login` : DOMAIN}>
          {!login ? (
            <BrightSite g={g} fps={fps} scroll={interpolate(g, [10, 110, 112, 125], [0, 1700, 1700, 0], cl)} pressSignIn={g >= 136 && g < 142} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", opacity: fi(g, 150, 10), fontFamily: "Poppins, " + FONT }}>
              <div style={{ flex: 1, background: "#fff", padding: "90px 120px" }}>
                <BrightLogo s={1.3} />
                <div style={{ marginTop: 50, fontSize: 40, fontWeight: 800, color: INK }}>Welcome back!</div>
                <div style={{ marginTop: 8, fontSize: 17, color: GRAY }}>Sign in to continue learning.</div>
                <Input x={120} y={330} w={560} label="Email" value={typed(g, 190, "sofia.reyes@example.com", 1.6)} ph="you@example.com" />
                <Input x={120} y={420} w={560} label="Password" value={g >= 230 ? "••••••••••" : ""} ph="Password" />
                <div style={{ position: "absolute", left: 120, top: 530, width: 560, height: 54, borderRadius: 12, background: BP, color: "#fff", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>Sign in</div>
              </div>
              <div style={{ width: 640, background: `linear-gradient(160deg,${BP},#134E4A)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <BrightLogo s={2} dark />
                <div style={{ fontSize: 22, color: "#CCFBF1", fontWeight: 600 }}>Your training. Your brand.</div>
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 136)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ w5 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapWL: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["🎨", "Your brand", "Colors · fonts · logos", "#14B8A6"], ["🌐", "Your domain", "Every portal on it", "#2563EB"], ["🔐", "Your login", "Branded sign-in pages", "#F59E0B"]];
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
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 56, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 90, 12) }}>
          Your name on everything. <span style={{ color: "#5EEAD4" }}>Not ours.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ w2 — Design library (ready-made blocks + page templates) → drag & drop → customize ═══
// Real: DesignLibraryModal ("Design library", tabs Components / Pages, search, groups Hero /
// Content / Forms / Dynamic / Conversion / Social proof, "Add block", "Use page", preview
// Desktop / Tablet / Mobile); catalog.ts blocks (Academy Hero, Programs = "Live organization
// programs", Testimonials, Pricing, FAQ, Call to Action…); Puck drag-and-drop editor with
// ComponentsBrowser (Section, Heading, Text, Button, Image, Grid, Carousel, Tabs, Accordion, Video…).
const LIB = [
  { n: "Academy Hero", d: "Education-focused hero with academy feature cards.", gp: "Hero", ic: "✧", c: "#d97706" },
  { n: "Programs", d: "Live organization programs with configurable display.", gp: "Dynamic", ic: "▥", c: "#0369a1" },
  { n: "Testimonials", d: "Customer quotations with configurable layouts.", gp: "Social proof", ic: "“", c: "#db2777" },
  { n: "Pricing", d: "Compare plans, benefits, and conversion actions.", gp: "Conversion", ic: "$", c: "#0891b2" },
  { n: "Frequently Asked Questions", d: "Expandable answers for common visitor questions.", gp: "Conversion", ic: "?", c: "#ea580c" },
  { n: "Process Timeline", d: "Present onboarding or delivery as ordered steps.", gp: "Content", ic: "↗", c: "#0891b2" },
];
const COMPS = ["Section", "Container", "Grid", "Heading", "Text", "Button", "Image", "Video", "Carousel", "Tabs", "Accordion", "Divider"];
const SceneBlocks: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 480;
  const g = gt(f, dur, D);
  const lib = g >= 30 && g < 175 ? Math.min(fi(g, 30, 10), fo(g, 165, 10)) : 0;
  const added = [g >= 110, g >= 150];          // Academy Hero, Programs added from the library
  const dragP = interpolate(g, [200, 260], [0, 1], cl); // drag "Testimonials"-style section from Components
  const dropped = g >= 262;
  const sel = g >= 290;
  const title = g < 300 ? "Launch your career" : typed(g, 300, "Start your new career this fall", 1.1) || "";
  const device = g >= 400 ? "Mobile" : "Desktop";
  const pv = interpolate(g, [400, 420], [0, 1], cl);
  const cardPos = (i: number) => ({ x: 360 + (i % 3) * 300, y: 230 + Math.floor(i / 3) * 230 });
  const DL = { x: 1010, y: 28 };
  const add1 = { x: cardPos(0).x + 24 + 175, y: cardPos(0).y + 182 };
  const add2 = { x: cardPos(1).x + 24 + 175, y: cardPos(1).y + 182 };
  const dragFrom = { x: 130, y: 260 + 9 * 34 };
  const dropTo = { x: 900, y: 600 };
  const HEAD_T = { x: 760, y: 200 };
  const MOB = { x: 1420, y: 28 };
  const cur = path(g, [[0, 800, 500], [20, DL.x, DL.y], [34, DL.x, DL.y], [90, add1.x, add1.y], [110, add1.x, add1.y], [134, add2.x, add2.y], [150, add2.x, add2.y], [190, dragFrom.x, dragFrom.y], [200, dragFrom.x, dragFrom.y], [260, dropTo.x, dropTo.y], [280, HEAD_T.x, HEAD_T.y], [292, HEAD_T.x, HEAD_T.y], [380, 1350, 300], [392, MOB.x, MOB.y], [404, MOB.x, MOB.y], [480, 900, 500]]);
  const ripple = Math.max(rip(g, 30), rip(g, 106), rip(g, 146), rip(g, 288), rip(g, 400));
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, WIDE_X, 470, 1.05], [170, WIDE_X, 470, 1.05], [190, 600, 470, 1.15], [270, 700, 470, 1.15], [290, 900, 300, 1.3], [370, 900, 300, 1.3], [400, WIDE_X, WIDE_Y, 1], [480, WIDE_X, WIDE_Y, 1]];
  const W2 = interpolate(pv, [0, 1], [1000, 400]);
  const section = (k: string, h: number, body: React.ReactNode, hl?: boolean) => (
    <div key={k} style={{ position: "relative", height: h, borderBottom: "1px solid #EEF2F7", outline: hl ? `2px solid ${BLUE}` : "none", outlineOffset: -2 }}>{body}</div>
  );
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url={`company.skillbnk.com/website-builder/${SLUG}`}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 56, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 10, boxSizing: "border-box" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>← {BRAND}</span><span style={{ fontSize: 13, color: GRAY }}>Home</span>
            <span style={{ flex: 1 }} />
            <span style={{ padding: "7px 14px", borderRadius: 8, background: lib > 0.5 ? BLUE : "#fff", color: lib > 0.5 ? "#fff" : INK, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>▤ Design library</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>✨ AI</span>
            <span style={{ display: "flex", border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>{["Desktop", "Tablet", "Mobile"].map((d) => <span key={d} style={{ padding: "7px 10px", fontSize: 12.5, fontWeight: 700, background: d === device ? BLUE_SOFT : "#fff", color: d === device ? BLUE : GRAY }}>{d}</span>)}</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>Publish</span>
          </div>
          {/* left: components */}
          <div style={{ position: "absolute", left: 0, top: 56, width: 260, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Components</div>
            <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Drag onto the page</div>
            {COMPS.map((c, i) => <div key={c} style={{ marginTop: 6, height: 28, borderRadius: 7, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 13, fontWeight: 600, color: INK, background: i === 9 && g >= 195 && g < 262 ? BLUE_SOFT : "#fff" }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span>{c}</div>)}
          </div>
          {/* canvas */}
          <div style={{ position: "absolute", left: 280, top: 76, width: 1020, height: 770, background: "#E9EDF3", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ margin: "10px auto", width: W2, height: 750, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: "Poppins, " + FONT, transition: "none" }}>
              <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #EEF2F7" }}><BrightLogo s={0.75} /><span style={{ flex: 1 }} /><span style={{ padding: "6px 14px", borderRadius: 999, background: BP, color: "#fff", fontSize: 12, fontWeight: 700 }}>Sign in</span></div>
              {added[0] && section("hero", 200, <div style={{ padding: pv > 0.5 ? 18 : "30px 36px", background: `linear-gradient(135deg, ${BP}14, #fff)`, height: "100%", boxSizing: "border-box", opacity: sp(g, 110, fps) }}>
                <div style={{ fontSize: pv > 0.5 ? 24 : 34, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>{title}<span style={{ color: BLUE }}>{sel && g < 360 ? "|" : ""}</span></div>
                <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>Career training for customer-service and sales teams.</div>
                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>{["Online", "Live classes", "Certificates"].map((x) => <span key={x} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", boxShadow: "0 2px 6px #0001", fontSize: 11.5, fontWeight: 700 }}>{x}</span>)}</div>
              </div>, sel)}
              {added[1] && section("prog", 200, <div style={{ padding: "18px 24px", opacity: sp(g, 150, fps) }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Our programs</div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>{["Customer Service Essentials", "Sales Conversations", "Team Lead Basics"].slice(0, pv > 0.5 ? 1 : 3).map((c) => <div key={c} style={{ width: pv > 0.5 ? 340 : 290, height: 120, borderRadius: 10, border: "1px solid #EEF2F7", padding: 10, boxSizing: "border-box" }}><div style={{ height: 60, borderRadius: 8, background: `linear-gradient(135deg,${BP},#14B8A6)` }} /><div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: INK }}>{c}</div></div>)}</div>
              </div>)}
              {dropped && section("tabs", 160, <div style={{ padding: "18px 24px", opacity: sp(g, 262, fps) }}>
                <div style={{ display: "flex", gap: 8 }}>{["Online", "Live", "Blended"].map((x, i) => <span key={x} style={{ padding: "6px 14px", borderRadius: 8, background: i === 0 ? BP : "#F1F5F9", color: i === 0 ? "#fff" : INK, fontSize: 12.5, fontWeight: 700 }}>{x}</span>)}</div>
                <div style={{ marginTop: 12, height: 10, width: "70%", borderRadius: 5, background: "#E5E7EB" }} /><div style={{ marginTop: 8, height: 10, width: "50%", borderRadius: 5, background: "#E5E7EB" }} />
              </div>)}
              {g >= 200 && g < 262 && <div style={{ height: 6, margin: "6px 24px", borderRadius: 3, background: BLUE, opacity: 0.6 }} />}
            </div>
          </div>
          {/* right: fields of the selected block */}
          <div style={{ position: "absolute", left: 1316, top: 56, width: 284, height: H - BAR - 56, background: "#fff", borderLeft: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{sel ? "Academy Hero" : "Page"}</div>
            {sel ? (
              <div style={{ opacity: fi(g, 290, 8) }}>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Title</div>
                <div style={{ marginTop: 6, minHeight: 36, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: "0 0 0 3px #C7D2FE", padding: "8px 10px", fontSize: 13, color: INK }}>{title}</div>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Description</div>
                <div style={{ marginTop: 6, borderRadius: 8, border: "1px solid #D1D5DB", padding: "8px 10px", fontSize: 12.5, color: INK }}>Career training for customer-service and sales teams.</div>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Image</div>
                <div style={{ marginTop: 6, height: 60, borderRadius: 8, border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: GRAY }}>⤒ Upload</div>
                <div style={{ marginTop: 14, fontSize: 12, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>STYLE</div>
                {[["Padding", "Default"], ["Background", BP], ["Text align", "Left"]].map(([a, b]) => <div key={a} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span style={{ color: "#374151", fontWeight: 600 }}>{a}</span><span style={{ color: GRAY, fontFamily: "monospace" }}>{b}</span></div>)}
              </div>
            ) : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}
          </div>
          {/* drag ghost */}
          {g >= 200 && g < 262 && <div style={{ position: "absolute", left: cur.x + 10, top: cur.y + 10, padding: "6px 12px", borderRadius: 8, background: "#fff", border: `2px solid ${BLUE}`, fontSize: 13, fontWeight: 700, color: BLUE, boxShadow: "0 8px 20px #0003", zIndex: 80 }}>⋮⋮ Tabs</div>}
          {/* design library modal */}
          {lib > 0.01 && (
            <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * lib})`, zIndex: 60 }}>
              <div style={{ position: "absolute", left: 200, top: 60, width: 1200, height: 740, borderRadius: 16, background: "#fff", opacity: lib, padding: 24, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div><div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Design library</div><div style={{ fontSize: 13, color: GRAY }}>Choose a polished component or start from a complete editable page.</div></div>
                  <span style={{ flex: 1 }} />
                  <span style={{ display: "flex", padding: 3, borderRadius: 8, background: "#F3F4F6" }}>{["Components", "Pages"].map((t, i) => <span key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 700, background: i === 0 ? BLUE : "transparent", color: i === 0 ? "#fff" : GRAY }}>{t}</span>)}</span>
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <div style={{ width: 300, height: 38, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search</div>
                  {["All", "Hero", "Content", "Forms", "Dynamic", "Conversion", "Social proof"].map((x, i) => <span key={x} style={{ padding: "8px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: i === 0 ? INK : "#F3F4F6", color: i === 0 ? "#fff" : "#374151" }}>{x}</span>)}
                </div>
                {LIB.map((b, i) => {
                  const p = cardPos(i);
                  const done = (i === 0 && added[0]) || (i === 1 && added[1]);
                  return (
                    <div key={b.n} style={{ position: "absolute", left: p.x - 200 + 24, top: p.y - 60, width: 280, height: 210, borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden", opacity: sp(g, 34 + i * 4, fps) }}>
                      <div style={{ height: 90, background: `${b.c}1A`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: b.c }}>{b.ic}</div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 14.5, fontWeight: 800, color: INK }}>{b.n}</span><span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.gp}</span></div>
                        <div style={{ marginTop: 4, fontSize: 12, color: GRAY, height: 32 }}>{b.d}</div>
                        <div style={{ marginTop: 6, display: "flex", gap: 6 }}><span style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${LINE}`, fontSize: 12, fontWeight: 700 }}>👁 Preview</span><span style={{ padding: "5px 10px", borderRadius: 6, background: done ? GREEN : BLUE, color: "#fff", fontSize: 12, fontWeight: 700 }}>{done ? "✓ Added" : "+ Add block"}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={g >= 200 && g < 262} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Forms series (sheet serials 17–19) — shared atoms. Every label verified in SB-Company code.
// House rules: no hover/tooltip overlays (StepChip bottom-centre only), PortalTag bottom-right,
// cursor targets are constants computed from the same layout functions that draw the UI.
// ═══════════════════════════════════════════════════════════════════════════
const F_MENU = ["Dashboard", "Branch Management", "Courses & Programs", "Attendance", "Staff Management", "Marketing", "Form Builder", "Menu Builder", "Website Builder", "Enrollment form Builder", "Integrations"];
const F_MORE = ["Courses & Programs", "Attendance", "Staff Management", "Marketing"];
const menuPt = (t: string) => ({ x: 12 + 100, y: 120 + F_MENU.indexOf(t) * 36 + 17 });
const FShell: React.FC<{ active: string; children: React.ReactNode }> = ({ active, children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><BrightLogo /></div>
      <div style={{ marginTop: 10, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search...</div>
      {F_MENU.map((m, i) => {
        const on = m === active;
        return (
          <div key={m} style={{ position: "absolute", left: 12, top: 120 + i * 36, width: SIDE - 24, height: 34, display: "flex", alignItems: "center", gap: 9, padding: "0 6px", boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            <Ico c={on ? BLUE : "#4B5563"} s={14} /><span style={{ flex: 1, whiteSpace: "nowrap" }}>{m}</span>{F_MORE.includes(m) && <Chevron />}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} /><div style={{ flex: 1 }} />
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <Avatar t="AR" c1="#14B8A6" c2="#0F766E" />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
/** small step caption at the bottom-centre of the SCREEN (outside the camera) — never covers the UI */
const StepChip: React.FC<{ n: number; text: string; o?: number }> = ({ n, text, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center", zIndex: 60, opacity: o, pointerEvents: "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 22px 9px 9px", borderRadius: 999, background: "rgba(4,6,13,0.78)", border: "1px solid #ffffff22", boxShadow: "0 10px 30px #0008", fontFamily: FONT }}>
      <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#14B8A6", color: "#fff", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      <span style={{ fontSize: 21, fontWeight: 700, color: "#F1F5F9" }}>{text}</span>
    </div>
  </div>
);
type Tag = { n: number; label: string; url: string };
const CO_TAG: Tag = { n: 1, label: "Company portal", url: "company.skillbnk.com" };
/** Generic stage: browser + optional company shell + overlay + cursor; chip outside the camera. */
const FStage: React.FC<{ g: number; keys: CamKey[]; url: string; cur: { x: number; y: number }; ripple: number; grab?: boolean; chip?: [number, string]; over?: React.ReactNode; active?: string; tag?: Tag; bg?: string; children: React.ReactNode }> = ({ g, keys, url, cur, ripple, grab, chip, over, active, tag = CO_TAG, bg = "#F6F7F9", children }) => (
  <Stage>
    <PortalTag n={tag.n} label={tag.label} url={tag.url} />
    <CamC g={g} keys={keys}>
      <Browser url={url}>
        <div style={{ position: "absolute", inset: 0, background: bg }} />
        {active ? <FShell active={active}>{children}</FShell> : children}
        {over}
        <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={grab} />
      </Browser>
    </CamC>
    {chip && <StepChip n={chip[0]} text={chip[1]} o={fi(g, 6, 10)} />}
  </Stage>
);
/** shadcn-style button, absolute */
const UB: React.FC<{ x: number; y: number; w: number; h?: number; label: string; v?: "primary" | "outline" | "red" | "soft" | "sec"; press?: boolean; icon?: string; fs?: number; dim?: boolean }> = ({ x, y, w, h = 40, label, v = "primary", press, icon, fs = 14.5, dim }) => {
  const bg = { primary: BLUE, outline: "#fff", red: "#DC2626", soft: BLUE_SOFT, sec: "#F3F4F6" }[v];
  const c = { primary: "#fff", outline: INK, red: "#fff", soft: BLUE, sec: INK }[v];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 8, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: fs, fontWeight: 700, background: bg, color: c, border: v === "outline" ? `1px solid ${LINE}` : "none", transform: `scale(${press ? 0.93 : 1})`, opacity: dim ? 0.5 : 1, boxShadow: press ? `0 0 0 4px ${v === "red" ? "#FCA5A5" : "#C7D2FE"}` : "none", whiteSpace: "nowrap" }}>
      {icon && <span style={{ fontSize: fs }}>{icon}</span>}{label}
    </div>
  );
};
const ctr = (b: { x: number; y: number; w: number; h?: number }) => ({ x: b.x + b.w / 2, y: b.y + (b.h ?? 40) / 2 });
/** centred dialog in CONTENT coords, dims the page */
const Modal: React.FC<{ box: { x: number; y: number; w: number; h: number }; title: string; o: number; sub?: string; children?: React.ReactNode }> = ({ box, title, o, sub, children }) => (
  o <= 0.01 ? null : (
    <div style={{ position: "absolute", inset: 0, zIndex: 40, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)" }} />
      <div style={{ position: "absolute", left: box.x, top: box.y + (1 - o) * 20, width: box.w, height: box.h, background: "#fff", borderRadius: 12, boxShadow: "0 30px 80px #0006", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 24, top: 22, fontSize: 19, fontWeight: 800, color: INK }}>{title}</div>
        {sub && <div style={{ position: "absolute", left: 24, top: 50, fontSize: 13.5, color: GRAY }}>{sub}</div>}
        <div style={{ position: "absolute", right: 20, top: 20, fontSize: 16, color: "#9CA3AF" }}>✕</div>
        {children}
      </div>
    </div>
  )
);
/** label + input in modal-local coords */
const MInput: React.FC<{ x: number; y: number; w: number; label?: string; value: string; ph?: string; glow?: boolean; h?: number; select?: boolean; req?: boolean }> = ({ x, y, w, label, value, ph = "", glow, h = 40, select, req }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    {label && <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 }}>{label}{req && <span style={{ color: "#EF4444" }}> *</span>}</div>}
    <div style={{ height: h, borderRadius: 8, border: `1px solid ${glow ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: glow ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: h > 48 ? "flex-start" : "center", padding: h > 48 ? "9px 12px" : "0 12px", boxSizing: "border-box", fontSize: 14.5, color: value ? INK : "#9CA3AF", justifyContent: "space-between", lineHeight: 1.4 }}>
      <span>{value || ph}{glow && <span style={{ color: BLUE }}>|</span>}</span>{select && <span style={{ color: "#9CA3AF" }}>⌄</span>}
    </div>
  </div>
);
/** drag ghost that follows the cursor */
const Ghost: React.FC<{ x: number; y: number; label: string; icon?: string; o?: number }> = ({ x, y, label, icon = "▭", o = 1 }) => (
  <div style={{ position: "absolute", left: x + 14, top: y + 10, zIndex: 85, opacity: 0.92 * o, padding: "8px 14px", borderRadius: 8, background: "#fff", border: `2px solid ${BLUE}`, boxShadow: "0 14px 30px #1D3FD640", fontSize: 14, fontWeight: 700, color: INK, display: "flex", gap: 8, alignItems: "center", whiteSpace: "nowrap" }}>
    <span style={{ color: BLUE }}>{icon}</span>{label}
  </div>
);
/** mini spreadsheet used for "export" moments */
const Sheet: React.FC<{ x: number; y: number; cols: string[]; rows: string[][]; w: number; name: string; o?: number }> = ({ x, y, cols, rows, w, name, o = 1 }) => {
  const cw = w / cols.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 24px 60px #0005", border: "1px solid #D1D5DB" }}>
      <div style={{ height: 38, background: "#107C41", color: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, fontWeight: 700, gap: 8 }}>▦ {name}</div>
      <div style={{ display: "flex", background: "#F3F4F6", borderBottom: "1px solid #D1D5DB" }}>{cols.map((c) => <div key={c} style={{ width: cw, padding: "8px 10px", boxSizing: "border-box", fontSize: 12.5, fontWeight: 800, color: "#374151", borderRight: "1px solid #E5E7EB", whiteSpace: "nowrap", overflow: "hidden" }}>{c}</div>)}</div>
      {rows.map((r, i) => <div key={i} style={{ display: "flex", borderBottom: "1px solid #EEF0F3" }}>{r.map((c, j) => <div key={j} style={{ width: cw, padding: "8px 10px", boxSizing: "border-box", fontSize: 12.5, color: INK, borderRight: "1px solid #F1F2F4", whiteSpace: "nowrap", overflow: "hidden" }}>{c}</div>)}</div>)}
    </div>
  );
};
/** generic wrap card row used by all three closing scenes */
const WrapCards: React.FC<{ g: number; fps: number; D: number; steps: string[][]; line: React.ReactNode }> = ({ g, fps, D, steps, line }) => {
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}><Img src={staticFile("skillbnk-logo.png")} style={{ width: 380 }} /></div>
        <div style={{ position: "absolute", left: 110, top: 340, width: 1700, display: "flex", gap: 22 }}>
          {steps.map(([ic, t, s], i) => { const p = sp(g, 20 + i * 10, fps); return <div key={t} style={{ flex: 1, height: 230, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF666", opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 48 }}>{ic}</div><div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{t}</div><div style={{ marginTop: 6, fontSize: 17, color: "#8A96B2", textAlign: "center", padding: "0 10px" }}>{s}</div></div>; })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 80, 12) }}>{line}</div>
      </AbsoluteFill>
    </Stage>
  );
};
/** time-warp: maps scene time (in D units, ≈ voice time) to choreography time so each click lands on its word */
const tw = (g: number, pairs: [number, number][]) => interpolate(g, pairs.map((p) => p[0]), pairs.map((p) => p[1]), cl);
/** HOUSE HOOK (rule 2026-10-06): 1) PAIN/FEAR the viewer recognises → 2) WHAT OTHER LMS DON'T GIVE YOU → 3) skillBNK SOLUTION + TRUST.
 *  Beats are timed in D units; `b2`/`b3` are the frames where beat 2 and beat 3 start. */
const Hook3: React.FC<{ g: number; fps: number; D: number; b2: number; b3: number;
  pain: React.ReactNode; painSub: string; painCards: [string, string][]; painStat?: [string, string];
  other: React.ReactNode; otherItems: string[];
  win: React.ReactNode; trust: string[]; visual: React.ReactNode }> = ({ g, fps, D, b2, b3, pain, painSub, painCards, painStat, other, otherItems, win, trust, visual }) => {
  const beat = g < b2 ? 1 : g < b3 ? 2 : 3;
  const shake = beat === 1 ? Math.sin(g * 1.7) * interpolate(g, [b2 - 30, b2 - 6], [0, 3], cl) : 0;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && (
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #3B0A0A ${interpolate(g, [0, b2], [0, 40], cl)}%, transparent 75%)`, transform: `translateX(${shake}px)`, opacity: fo(g, b2 - 6, 6) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontSize: 66, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.12, padding: "0 140px", opacity: fi(g, 2, 10), transform: `scale(${0.94 + 0.06 * sp(g, 2, fps)})` }}>{pain}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontSize: 30, fontWeight: 600, color: "#FCA5A5", opacity: fi(g, 24, 10) }}>{painSub}</div>
            <div style={{ position: "absolute", left: 160, right: 160, top: 420, display: "flex", gap: 26, justifyContent: "center" }}>
              {painCards.map(([ic, t], i) => { const p = sp(g, 34 + i * 12, fps, { damping: 11 }); return <div key={t} style={{ width: 380, padding: "26px 24px", borderRadius: 20, background: "#1B0B0F", border: "2px solid #F87171", opacity: p, transform: `translateY(${(1 - p) * 60}px) rotate(${(i - 1) * 2}deg)`, boxShadow: "0 20px 60px #7F1D1D66" }}><div style={{ fontSize: 48 }}>{ic}</div><div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#FECACA", lineHeight: 1.2 }}>{t}</div></div>; })}
            </div>
            {painStat && <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", opacity: fi(g, 70, 10) }}><span style={{ fontSize: 64, fontWeight: 900, color: "#EF4444" }}>{painStat[0]}</span> <span style={{ fontSize: 30, color: "#FCA5A5", fontWeight: 700 }}>{painStat[1]}</span></div>}
          </AbsoluteFill>
        )}
        {beat === 2 && (
          <AbsoluteFill style={{ opacity: Math.min(fi(g, b2, 8), fo(g, b3 - 6, 6)) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 30, fontWeight: 800, color: "#8A96B2", letterSpacing: 4 }}>MOST LMS PLATFORMS</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 62, fontWeight: 900, color: "#F1F5F9", padding: "0 160px", lineHeight: 1.12 }}>{other}</div>
            <div style={{ position: "absolute", left: 460, width: 1000, top: 450 }}>
              {otherItems.map((t, i) => <div key={t} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 16, background: "#141A2B", border: "1px solid #ffffff1A", opacity: fi(g, b2 + 14 + i * 12, 8), transform: `translateX(${(1 - fi(g, b2 + 14 + i * 12, 8)) * -40}px)` }}><span style={{ width: 44, height: 44, borderRadius: "50%", background: "#7F1D1D", color: "#FCA5A5", fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</span><span style={{ fontSize: 32, fontWeight: 700, color: "#CBD5E1" }}>{t}</span></div>)}
            </div>
          </AbsoluteFill>
        )}
        {beat === 3 && (
          <AbsoluteFill style={{ opacity: fi(g, b3, 8) }}>
            <div style={{ position: "absolute", left: 110, top: 200, width: 820 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "#0F766E33", border: "1px solid #5EEAD488", opacity: fi(g, b3 + 2, 8) }}><Img src={staticFile("skillbnk-logo.png")} style={{ height: 30 }} /><span style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4" }}>does it differently</span></div>
              <div style={{ marginTop: 26, fontSize: 66, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.08, opacity: fi(g, b3 + 8, 10) }}>{win}</div>
              <div style={{ marginTop: 34 }}>
                {trust.map((t, i) => <div key={t} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16, opacity: fi(g, b3 + 30 + i * 12, 8) }}><span style={{ width: 40, height: 40, borderRadius: "50%", background: "#16A34A", color: "#fff", fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(g, b3 + 30 + i * 12, fps)})` }}>✓</span><span style={{ fontSize: 30, fontWeight: 700, color: "#E2E8F0" }}>{t}</span></div>)}
              </div>
            </div>
            <div style={{ position: "absolute", left: 1000, top: 150, width: 820, height: 780, opacity: sp(g, b3 + 6, fps), transform: `translateY(${(1 - sp(g, b3 + 6, fps)) * 60}px)` }}>{visual}</div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
const HookCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "#fff", boxShadow: "0 40px 100px #000C", overflow: "hidden", padding: 32, boxSizing: "border-box" }}>
    <BrightLogo /><div style={{ marginTop: 18, fontSize: 30, fontWeight: 900, color: INK }}>{title}</div>{children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// Enrollment Form Builder — scenes (sheet serial 17). Real UI (SB-Company /enrollment-form-builder,
// EnrollmentFormBuilderComponent + FormsBuilder + SortableTab/Row/Field + SideInputLists + Preview):
//  Header "Enrollment Form Builder" · Add New Step · Save · Preview · Delete (red).
//  Empty: "No forms found" + "Initiate Now" → "Step 1" with "row 1".
//  "Add new step" dialog: "Enter step name" + Save.  Step pill ✎ → "Tab Settings" (Label:, Cancel/Delete/Save).
//  Row: grip + label + collapse; footer Edit · Duplicates · Delete; "Add New Row Here";
//   "Add new row"/"Update row" dialog: "Enter Step title" + Save/Update. Duplicate label = "<label> copy".
//  "Form Elements": Short Text, Paragraph, Number, Date, Dropdown, Attachment, Checkbox, Heading,
//   Radio Button, Switch, Signature, 2 Columns, 3 Columns, 4 Columns.
//  Field dialog: title = label · "Field Label:" · "Description:" · "Options:" (Option 1…, "Add New Option")
//   · "Allow multiple select" · Save · Delete · Required.
//  "Form Preview" dialog: numbered step indicator · Previous / Next / Done.  Toast "Save successfully".
//  Public enroll page (SB-Frontend /enroll/[slug]) renders the same steps (+ Order Summary, Promo code).
//  Answers saved as formStepsData → SB-Branch Pending Members → "Student Information"
//   ("All information on student enrollment is here", Status/Enrolled Program/Enrolled Session/
//   Enrolled Date, Update, Export to CSV, Print).
// ═══════════════════════════════════════════════════════════════════════════
type EFField = { label: string; type: string; o?: number; cols?: (EFField | null)[]; hl?: boolean };
type EFRow = { label: string; fields: EFField[]; o?: number; drop?: boolean; hl?: boolean };
const EF_ELEMS: [string, string][] = [["Short Text", "T"], ["Paragraph", "¶"], ["Number", "#"], ["Date", "📅"], ["Dropdown", "▾"], ["Attachment", "📎"], ["Checkbox", "☑"], ["Heading", "H"], ["Radio Button", "◉"], ["Switch", "⏻"], ["Signature", "✍"], ["2 Columns", "▥"], ["3 Columns", "▥"], ["4 Columns", "▥"]];
const ICON_OF = (t: string) => (EF_ELEMS.find((e) => e[0] === t) ?? ["", "▭"])[1];
// header buttons (main coords)
const EFB = { step: { x: 846, y: 16, w: 150 }, save: { x: 1006, y: 16, w: 90 }, prev: { x: 1106, y: 16, w: 110 }, del: { x: 1226, y: 16, w: 100 } };
const efHdr = (k: keyof typeof EFB) => ({ x: MX(ctr(EFB[k]).x), y: MY(ctr(EFB[k]).y) });
const PAL = { x: 1080, w: 246 };
const palPt = (name: string) => ({ x: MX(PAL.x + 110), y: MY(126 + EF_ELEMS.findIndex((e) => e[0] === name) * 42 + 18) });
const ROW = { x: 24, w: 1036, top: 150, gap: 16 };
const FH = (f: EFField) => (f.cols ? 128 : 56);
const rowH = (r: EFRow) => 48 + (r.fields.length ? r.fields.reduce((a, f) => a + FH(f), 0) + (r.fields.length - 1) * 8 : 64) + 24 + 48;
const rowTops = (rows: EFRow[], scroll = 0) => { let y = ROW.top - scroll; return rows.map((r) => { const t = y; y += rowH(r) + ROW.gap; return t; }); };
/** main-area y of field i in row r */
const fieldTop = (rows: EFRow[], r: number, i: number, scroll = 0) => { const t = rowTops(rows, scroll)[r] + 60; return t + rows[r].fields.slice(0, i).reduce((a, f) => a + FH(f) + 8, 0); };
const fieldTitlePt = (rows: EFRow[], r: number, i: number, scroll = 0) => ({ x: MX(ROW.x + 16 + 80), y: MY(fieldTop(rows, r, i, scroll) + 28) });
const dropPt = (rows: EFRow[], r: number, scroll = 0) => { const t = rowTops(rows, scroll)[r]; return { x: MX(ROW.x + ROW.w / 2), y: MY(t + rowH(rows[r]) - 48 - 12 - 26) }; };
const colPt = (rows: EFRow[], r: number, i: number, c: number, n: number, scroll = 0) => { const t = fieldTop(rows, r, i, scroll); const cw = (ROW.w - 32 - 24 - (n - 1) * 10) / n; return { x: MX(ROW.x + 16 + 12 + c * (cw + 10) + cw / 2), y: MY(t + 38 + 40) }; };
const rowBtn = (rows: EFRow[], r: number, which: "edit" | "dup" | "del", scroll = 0) => { const t = rowTops(rows, scroll)[r] + rowH(rows[r]) - 42; const m = { edit: [16, 80], dup: [104, 122], del: [234, 90] }[which]; return { x: ROW.x + m[0], y: t, w: m[1], h: 32 }; };
const rowBtnPt = (rows: EFRow[], r: number, which: "edit" | "dup" | "del", scroll = 0) => { const b = rowBtn(rows, r, which, scroll); return { x: MX(b.x + b.w / 2), y: MY(b.y + 16) }; };
const addRowBtn = (rows: EFRow[], scroll = 0) => { const ts = rowTops(rows, scroll); const last = ts[ts.length - 1] + rowH(rows[rows.length - 1]); return { x: ROW.x + ROW.w / 2 - 110, y: last + 34, w: 220, h: 40 }; };
const stepW = (s: string) => 92 + s.length * 8.6;
const stepX = (steps: string[], i: number) => 24 + steps.slice(0, i).reduce((a, s) => a + stepW(s) + 10, 0);
const stepEditPt = (steps: string[], i: number) => ({ x: MX(stepX(steps, i) + stepW(steps[i]) - 22), y: MY(88 + 20) });

const EFFieldCard: React.FC<{ f: EFField; x: number; y: number; w: number }> = ({ f, x, y, w }) => {
  const o = f.o ?? 1;
  if (f.cols) {
    const n = f.cols.length; const cw = (w - 24 - (n - 1) * 10) / n;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: 128, opacity: o, borderRadius: 10, border: `1px solid ${f.hl ? "#A5B4FC" : LINE}`, background: "#FAFBFC", transform: `scale(${0.96 + 0.04 * o})` }}>
        <div style={{ position: "absolute", left: 12, top: 9, fontSize: 13, fontWeight: 800, color: "#374151", display: "flex", gap: 8 }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span>{f.label}</div>
        <div style={{ position: "absolute", right: 12, top: 7, display: "flex", gap: 12, fontSize: 14, color: GRAY }}><span>⚙</span><span style={{ color: "#DC2626" }}>🗑</span></div>
        {f.cols.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: 12 + i * (cw + 10), top: 36, width: cw, height: 80, borderRadius: 8, border: c ? `1px solid ${LINE}` : "1.5px dashed #CBD5E1", background: "#fff", display: "flex", alignItems: "center", justifyContent: c ? "flex-start" : "center", padding: "0 12px", boxSizing: "border-box", gap: 10, opacity: c ? (c.o ?? 1) : 1 }}>
            {c ? (<><span style={{ width: 28, height: 28, borderRadius: 6, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{ICON_OF(c.type)}</span><div><div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{c.label}</div><div style={{ fontSize: 11.5, color: GRAY }}>{c.type}</div></div></>) : <span style={{ fontSize: 22, color: "#9CA3AF" }}>+</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 56, opacity: o, borderRadius: 10, border: `1px solid ${f.hl ? "#A5B4FC" : LINE}`, boxShadow: f.hl ? "0 0 0 3px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", gap: 12, transform: `translateY(${(1 - o) * -10}px)` }}>
      <span style={{ color: "#9CA3AF", fontSize: 14 }}>⋮⋮</span>
      <span style={{ width: 30, height: 30, borderRadius: 7, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{ICON_OF(f.type)}</span>
      <span style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{f.label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: GRAY, background: "#F3F4F6", padding: "3px 8px", borderRadius: 6 }}>{f.type}</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 15, color: GRAY }}>⚙</span><span style={{ fontSize: 15, color: "#DC2626", marginLeft: 8 }}>🗑</span>
    </div>
  );
};

const EFBuilder: React.FC<{ steps?: string[]; act?: number; rows?: EFRow[]; empty?: boolean; press?: string; palHl?: string; scroll?: number; rowPress?: [number, string] }> = ({ steps = ["Step 1"], act = 0, rows = [], empty, press, palHl, scroll = 0, rowPress }) => {
  const tops = rowTops(rows, scroll);
  const add = rows.length ? addRowBtn(rows, scroll) : null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W - SIDE, height: H - BAR - HEAD, background: "#fff" }}>
      <div style={{ position: "absolute", left: 24, top: 22, fontSize: 22, fontWeight: 800, color: INK }}>Enrollment Form Builder</div>
      <UB {...EFB.step} label="Add New Step" icon="＋" press={press === "step"} />
      <UB {...EFB.save} label="Save" icon="💾" press={press === "save"} />
      {!empty && <UB {...EFB.prev} label="Preview" icon="👁" press={press === "prev"} />}
      {!empty && <UB {...EFB.del} label="Delete" icon="🗑" v="red" press={press === "del"} />}
      <div style={{ position: "absolute", left: 0, top: 72, width: W - SIDE, height: 1, background: LINE }} />
      {empty ? (
        <div style={{ position: "absolute", left: 0, width: W - SIDE, top: 260, textAlign: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>No forms found</div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 0, top: 73, width: PAL.x - 10, height: H - BAR - HEAD - 73, overflow: "hidden" }}>
            {rows.map((r, ri) => (
              <div key={ri} style={{ position: "absolute", left: ROW.x, top: tops[ri] - 73, width: ROW.w, height: rowH(r), opacity: r.o ?? 1, borderRadius: 12, border: `1px solid ${r.hl ? "#A5B4FC" : LINE}`, background: "#F9FAFB", boxShadow: r.hl ? "0 0 0 3px #C7D2FE" : "none" }}>
                <div style={{ position: "absolute", left: 14, top: 14, display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span><span style={{ fontSize: 16, fontWeight: 800, color: INK }}>{r.label}</span></div>
                <div style={{ position: "absolute", right: 16, top: 12, fontSize: 16, color: GRAY }}>⌃</div>
                {r.fields.length === 0 && <div style={{ position: "absolute", left: 16, top: 60, width: ROW.w - 32, height: 64, borderRadius: 10, border: `1.5px dashed ${r.drop ? BLUE : "#CBD5E1"}`, background: r.drop ? "#EEF2FF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: r.drop ? BLUE : "#9CA3AF", fontWeight: 600 }}>{r.drop ? "Drop here" : ""}</div>}
                {r.fields.map((f, i) => <EFFieldCard key={i} f={f} x={16} y={fieldTop(rows, ri, i, scroll) - tops[ri]} w={ROW.w - 32} />)}
                {r.drop && r.fields.length > 0 && <div style={{ position: "absolute", left: 16, top: rowH(r) - 48 - 12 - 4, width: ROW.w - 32, height: 3, borderRadius: 2, background: BLUE }} />}
                {(["edit", "dup", "del"] as const).map((k) => { const b = rowBtn(rows, ri, k, scroll); return <UB key={k} x={b.x - ROW.x} y={b.y - tops[ri]} w={b.w} h={32} fs={13} label={{ edit: "Edit", dup: "Duplicates", del: "Delete" }[k]} icon={{ edit: "✎", dup: "⧉", del: "🗑" }[k]} v={{ edit: "soft", dup: "sec", del: "red" }[k] as any} press={rowPress?.[0] === ri && rowPress?.[1] === k} />; })}
              </div>
            ))}
            {add && <>
              <div style={{ position: "absolute", left: ROW.x, top: add.y - 18 - 73, width: ROW.w, borderTop: "1.5px dashed #D1D5DB" }} />
              <UB x={add.x} y={add.y - 73} w={add.w} label="Add New Row Here" icon="＋" press={press === "row"} />
            </>}
          </div>
          <div style={{ position: "absolute", left: 0, top: 73, width: PAL.x - 10, height: 66, background: "#fff" }} />
          {/* steps (sortable tabs) */}
          {steps.map((s, i) => (
            <div key={s + i} style={{ position: "absolute", left: stepX(steps, i), top: 88, width: stepW(s), height: 40, borderRadius: 10, boxSizing: "border-box", border: `1px solid ${i === act ? BLUE : LINE}`, background: i === act ? BLUE : "#fff", color: i === act ? "#fff" : INK, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 14.5, fontWeight: 700 }}>
              <span style={{ opacity: 0.6 }}>⋮⋮</span><span style={{ flex: 1, whiteSpace: "nowrap" }}>{s}</span><span style={{ fontSize: 14 }}>✎</span>
            </div>
          ))}
          {/* Form Elements panel (sticky) */}
          <div style={{ position: "absolute", left: PAL.x, top: 80, width: PAL.w, height: 650, borderRadius: 12, border: `1px solid ${LINE}`, background: "#fff" }} />
          <div style={{ position: "absolute", left: PAL.x + 14, top: 92, fontSize: 15, fontWeight: 800, color: INK }}>Form Elements</div>
          {EF_ELEMS.map(([n, ic], i) => (
            <div key={n} style={{ position: "absolute", left: PAL.x + 10, top: 126 + i * 42, width: PAL.w - 20, height: 36, borderRadius: 8, border: `1px solid ${palHl === n ? BLUE : LINE}`, background: palHl === n ? BLUE_SOFT : "#FAFAFB", display: "flex", alignItems: "center", gap: 10, padding: "0 10px", boxSizing: "border-box", fontSize: 13.5, fontWeight: 600, color: palHl === n ? BLUE : "#374151" }}>
              <span style={{ width: 22, textAlign: "center", color: BLUE, fontWeight: 800 }}>{ic}</span>{n}<div style={{ flex: 1 }} /><span style={{ color: "#C0C6D0" }}>⋮⋮</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
const EF_URL = "company.skillbnk.com/enrollment-form-builder";
const INIT_BTN = { x: (W - SIDE) / 2 - 70, y: 300, w: 140 };

// ═══ e0 — HOOK ═════════════════════════════════════════════════════════════
const SceneHookEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = tw(gt(f, dur, D), [[0, 0], [400, 400]]);
  return <Hook3 g={g} fps={fps} D={D} b2={140} b3={250}
    pain={<>Half-finished enrollments are <span style={{ color: "#F87171" }}>students you lose</span>.</>}
    painSub="Missing documents. Missing guardian details. Days of phone calls."
    painCards={[["📄", "No photo ID uploaded"], ["👪", "No guardian contact"], ["📞", "3 days chasing paperwork"]]}
    other={<>give you one fixed sign-up form. <span style={{ color: "#FCA5A5" }}>Name. Email. Done.</span></>}
    otherItems={["Can't add your own steps", "Can't ask program-specific questions", "Answers scattered outside the enrollment"]}
    win={<>Build <span style={{ color: "#5EEAD4" }}>your own</span> enrollment form.</>}
    trust={["Your steps, your fields — drag and drop", "Required fields, so nothing is missed", "Every answer saved with the enrollment"]}
    visual={<HookCard title="Enroll — Medical Assistant">
      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>{["Student Details", "Guardian Info", "Documents"].map((s, i) => <span key={s} style={{ padding: "8px 14px", borderRadius: 999, background: i === 0 ? BP : "#F3F4F6", color: i === 0 ? "#fff" : GRAY, fontSize: 16, fontWeight: 800 }}>{i + 1} {s}</span>)}</div>
      <div style={{ marginTop: 16, opacity: fi(g, 270, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Full Name *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Maya Torres</div></div><div style={{ marginTop: 16, opacity: fi(g, 280, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Guardian name *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Elena Torres</div></div><div style={{ marginTop: 16, opacity: fi(g, 290, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Photo ID *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>📎 id-front.jpg</div></div><div style={{ marginTop: 16, opacity: fi(g, 300, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Program of interest *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Medical Assistant</div></div>
    </HookCard>} />;
};

// ═══ e1 — open the builder → Initiate Now ══════════════════════════════════
const SceneOpenEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [192, 228], [330, 330]]);
  const opened = g >= 96;
  const init = g >= 236;
  const MENU = menuPt("Enrollment form Builder");
  const INIT = { x: MX(ctr(INIT_BTN).x), y: MY(ctr(INIT_BTN).y) };
  const rows: EFRow[] = [{ label: "row 1", fields: [], o: fi(g, 238, 10) }];
  const cur = path(g, [[0, 800, 500], [40, MENU.x, MENU.y], [86, MENU.x, MENU.y], [150, INIT.x, INIT.y], [236, INIT.x, INIT.y], [280, MX(300), MY(220)], [330, MX(300), MY(220)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [36, 300, 420, 1.9], [92, 300, 420, 1.9], [130, INIT.x, INIT.y - 40, 1.7], [240, INIT.x, INIT.y - 40, 1.7], [272, 700, 280, 1.45], [330, 700, 280, 1.45]];
  return (
    <FStage g={g} keys={keys} url={opened ? EF_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 88), rip(g, 228))} active={opened ? "Enrollment form Builder" : "Dashboard"} chip={[1, init ? "Step 1 and a first row — ready for fields" : opened ? "New institute? Click Initiate Now" : "Company portal → Enrollment form Builder"]}>
      {!opened ? (
        <div style={{ position: "absolute", inset: 0, padding: 28 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div>
          <div style={{ marginTop: 18, display: "flex", gap: 18 }}>{[["Programs", "12"], ["Active learners", "486"], ["Pending enrollments", "9"]].map(([a, b]) => <div key={a} style={{ flex: 1, height: 110, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 18, boxSizing: "border-box" }}><div style={{ fontSize: 14, color: GRAY }}>{a}</div><div style={{ fontSize: 34, fontWeight: 900, color: INK }}>{b}</div></div>)}</div>
        </div>
      ) : (
        <>
          <EFBuilder empty={!init} rows={init ? rows : []} />
          {!init && <UB {...INIT_BTN} label="Initiate Now" press={g >= 226 && g < 236} />}
        </>
      )}
    </FStage>
  );
};

// ═══ e2 — header buttons + Form Elements panel ══════════════════════════════
const SceneTourEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const rows: EFRow[] = [{ label: "row 1", fields: [] }];
  const order: (keyof typeof EFB)[] = ["step", "save", "prev", "del"];
  const T0 = 52, ST = 30;
  const on = g < T0 - 4 ? -1 : Math.min(3, Math.floor((g - T0 + 4) / ST));
  const pts: P3[] = [[0, MX(300), MY(220)]];
  order.forEach((k, i) => { pts.push([T0 + i * ST, efHdr(k).x, efHdr(k).y]); pts.push([T0 + i * ST + 18, efHdr(k).x, efHdr(k).y]); });
  pts.push([186, palPt("Short Text").x, palPt("Short Text").y], [276, palPt("4 Columns").x, palPt("4 Columns").y], [300, palPt("4 Columns").x, palPt("4 Columns").y]);
  const cur = path(g, pts);
  const palK = g >= 172;
  const pal = palK ? EF_ELEMS[Math.min(13, Math.max(0, Math.floor((g - 186) / 6.4)))][0] : undefined;
  const keys: CamKey[] = [[0, 700, 280, 1.45], [T0 - 10, efHdr("step").x + 120, 140, 2.0], [T0 + 3 * ST, efHdr("del").x - 120, 140, 2.0], [168, efHdr("del").x - 120, 140, 2.0], [196, palPt("Short Text").x, 380, 1.55], [300, palPt("Short Text").x, 460, 1.55]];
  const names = { step: "Add New Step", save: "Save", prev: "Preview", del: "Delete" };
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={0} active="Enrollment form Builder" chip={[2, palK ? "Form Elements — 14 building blocks" : on >= 0 ? `Header · ${names[order[on]]}` : "The builder header"]}>
      <EFBuilder rows={rows} press={!palK && on >= 0 ? order[on] : undefined} palHl={pal} />
    </FStage>
  );
};

// ═══ e3 — steps: rename Step 1 (Tab Settings) + Add New Step ×2 ══════════════
const SceneStepsEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [39, 38], [166, 118], [218, 164], [306, 248], [358, 288], [407, 360], [420, 420]]);
  const s1 = g >= 118 ? "Student Details" : "Step 1";
  const steps = [s1, ...(g >= 248 ? ["Guardian Info"] : []), ...(g >= 360 ? ["Documents"] : [])];
  const rows: EFRow[] = [{ label: "row 1", fields: [] }];
  const BOX = { x: 544, y: 200, w: 512, h: 250 };
  const TS_SAVE = { x: BOX.w - 24 - 80, y: BOX.h - 64, w: 80 };
  const NS_SAVE = { x: 24, y: 150, w: 80, h: 34 };
  const tsO = g >= 40 && g < 122 ? Math.min(fi(g, 40, 8), fo(g, 114, 8)) : 0;
  const ns1 = g >= 166 && g < 252 ? Math.min(fi(g, 166, 8), fo(g, 244, 8)) : 0;
  const ns2 = g >= 290 && g < 364 ? Math.min(fi(g, 290, 8), fo(g, 356, 8)) : 0;
  const EDIT = stepEditPt(["Step 1"], 0);
  const tsSave = { x: BOX.x + ctr(TS_SAVE).x, y: BOX.y + ctr(TS_SAVE).y };
  const nsSave = { x: BOX.x + ctr(NS_SAVE).x, y: BOX.y + ctr(NS_SAVE).y };
  const cur = path(g, [[0, efHdr("del").x, efHdr("del").y], [26, EDIT.x, EDIT.y], [40, EDIT.x, EDIT.y], [60, BOX.x + 240, BOX.y + 120], [96, BOX.x + 240, BOX.y + 120], [106, tsSave.x, tsSave.y], [120, tsSave.x, tsSave.y], [150, efHdr("step").x, efHdr("step").y], [166, efHdr("step").x, efHdr("step").y], [186, BOX.x + 240, BOX.y + 120], [226, BOX.x + 240, BOX.y + 120], [236, nsSave.x, nsSave.y], [250, nsSave.x, nsSave.y], [276, efHdr("step").x, efHdr("step").y], [290, efHdr("step").x, efHdr("step").y], [306, BOX.x + 240, BOX.y + 120], [340, BOX.x + 240, BOX.y + 120], [348, nsSave.x, nsSave.y], [362, nsSave.x, nsSave.y], [420, MX(500), MY(108)]]);
  const keys: CamKey[] = [[0, efHdr("del").x - 120, 140, 2.0], [24, 420, 200, 1.8], [44, 800, 330, 1.45], [118, 800, 330, 1.45], [140, 820, 200, 1.6], [160, efHdr("step").x - 60, 160, 1.6], [176, 800, 330, 1.45], [250, 600, 210, 1.7], [280, efHdr("step").x - 100, 200, 1.5], [296, 800, 330, 1.45], [362, 600, 220, 1.6], [420, 600, 220, 1.6]];
  const typing = (a: number, s: string) => typed(g, a, s, 0.7);
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 118), rip(g, 164), rip(g, 248), rip(g, 288), rip(g, 360))} active="Enrollment form Builder" chip={[3, g < 140 ? "✎ on a step → Tab Settings → rename" : "Add New Step → name it → Save"]}
      over={<>
        <Modal box={BOX} title="Tab Settings" o={tsO}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Label:" value={g < 62 ? "Step 1" : typing(64, "Student Details")} glow={g >= 60 && g < 104} />
          <UB x={BOX.w - 24 - 80 - 10 - 86 - 10 - 86} y={BOX.h - 64} w={86} label="Cancel" v="outline" />
          <UB x={BOX.w - 24 - 80 - 10 - 86} y={BOX.h - 64} w={86} label="Delete" v="red" />
          <UB {...TS_SAVE} label="Save" press={g >= 112 && g < 120} />
        </Modal>
        <Modal box={BOX} title="Add new step" o={Math.max(ns1, ns2)}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Enter step name" value={ns1 > 0 ? typing(188, "Guardian Info") : typing(308, "Documents")} glow={(g >= 186 && g < 232) || (g >= 306 && g < 344)} />
          <UB {...NS_SAVE} fs={13.5} label="Save" press={(g >= 244 && g < 252) || (g >= 356 && g < 364)} />
        </Modal>
      </>}>
      <EFBuilder steps={steps} act={0} rows={rows} press={(g >= 158 && g < 168) || (g >= 282 && g < 292) ? "step" : undefined} />
    </FStage>
  );
};

// ═══ e4 — rows: Edit row 1 → "Personal Details"; Add New Row Here → "Contact Details" ═
const SceneRowsEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = tw(gt(f, dur, D), [[0, 0], [68, 42], [173, 126], [227, 192], [350, 284], [360, 300]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const r1 = g >= 128 ? "Personal Details" : "row 1";
  const rows: EFRow[] = [{ label: r1, fields: [] }, ...(g >= 286 ? [{ label: "Contact Details", fields: [], o: fi(g, 286, 10) }] : [])];
  const base: EFRow[] = [{ label: r1, fields: [] }];
  const BOX = { x: 544, y: 200, w: 512, h: 220 };
  const SV = { x: 24, y: 150, w: 90, h: 34 };
  const svPt = { x: BOX.x + ctr(SV).x, y: BOX.y + ctr(SV).y };
  const EDIT = rowBtnPt(base, 0, "edit");
  const ADD = { x: MX(ctr(addRowBtn(base)).x), y: MY(ctr(addRowBtn(base)).y) };
  const m1 = g >= 44 && g < 132 ? Math.min(fi(g, 44, 8), fo(g, 124, 8)) : 0;
  const m2 = g >= 196 && g < 290 ? Math.min(fi(g, 196, 8), fo(g, 282, 8)) : 0;
  const cur = path(g, [[0, MX(500), MY(108)], [30, EDIT.x, EDIT.y], [44, EDIT.x, EDIT.y], [62, BOX.x + 240, BOX.y + 110], [104, BOX.x + 240, BOX.y + 110], [114, svPt.x, svPt.y], [128, svPt.x, svPt.y], [176, ADD.x, ADD.y], [194, ADD.x, ADD.y], [214, BOX.x + 240, BOX.y + 110], [260, BOX.x + 240, BOX.y + 110], [270, svPt.x, svPt.y], [286, svPt.x, svPt.y], [360, MX(400), MY(420)]]);
  const keys: CamKey[] = [[0, 600, 220, 1.6], [26, EDIT.x + 100, EDIT.y - 60, 1.9], [50, 800, 320, 1.45], [130, 800, 320, 1.45], [160, ADD.x, ADD.y - 60, 1.8], [200, 800, 320, 1.45], [290, 800, 320, 1.45], [320, 650, 380, 1.4], [360, 650, 380, 1.4]];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 126), rip(g, 192), rip(g, 284))} active="Enrollment form Builder" chip={[4, g < 150 ? "Row → Edit → Update row" : "Add New Row Here → Add new row"]}
      over={<>
        <Modal box={BOX} title="Update row" o={m1}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Enter Step title" value={g < 64 ? "row 1" : typed(g, 66, "Personal Details", 0.7)} glow={g >= 62 && g < 112} />
          <UB {...SV} fs={13.5} label="Update" press={g >= 120 && g < 128} />
        </Modal>
        <Modal box={BOX} title="Add new row" o={m2}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Enter Step title" value={typed(g, 216, "Contact Details", 0.7)} glow={g >= 214 && g < 268} />
          <UB {...SV} fs={13.5} label="Save" press={g >= 278 && g < 286} />
        </Modal>
      </>}>
      <EFBuilder steps={steps} rows={rows} press={g >= 186 && g < 196 ? "row" : undefined} rowPress={g >= 36 && g < 46 ? [0, "edit"] : undefined} />
    </FStage>
  );
};

// ═══ e5 — drag elements into "Personal Details" ═════════════════════════════
const EF_DRAGS: [string, string][] = [["Short Text", "Short Text"], ["Date", "Date"], ["Dropdown", "Dropdown"], ["Attachment", "Attachment"]];
const SceneDragEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const T = (i: number) => [96, 152, 214, 284][i]; // grab time (≈ when the voice names it); drag lasts DR
  const DR = 40;
  const n = EF_DRAGS.filter((_, i) => g >= T(i) + DR).length;
  const mk = (k: number): EFRow[] => [{ label: "Personal Details", fields: EF_DRAGS.slice(0, k).map(([t, l], i) => ({ label: l, type: t, o: i === k - 1 ? fi(g, T(i) + DR, 8) : 1 })) }, { label: "Contact Details", fields: [] }];
  const rows = mk(n);
  const dragging = EF_DRAGS.findIndex((_, i) => g >= T(i) && g < T(i) + DR);
  if (dragging >= 0) rows[0].drop = g >= T(dragging) + 18;
  const pts: P3[] = [[0, MX(400), MY(420)]];
  EF_DRAGS.forEach(([t], i) => { const P = palPt(t); const Dp = dropPt(mk(i), 0); pts.push([T(i) - 14, P.x, P.y], [T(i), P.x, P.y], [T(i) + DR - 6, Dp.x, Dp.y], [T(i) + DR, Dp.x, Dp.y]); });
  pts.push([D, MX(600), MY(520)]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, 650, 380, 1.4], [36, 900, 340, 1.3], [D, 900, 400, 1.3]];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={0} grab={dragging >= 0} active="Enrollment form Builder" chip={[5, dragging >= 0 ? `Drag ${EF_DRAGS[dragging][0]} → drop in the row` : n >= 4 ? "Four fields — dropped in seconds" : "Drag elements from the right panel"]}
      over={dragging >= 0 ? <Ghost x={cur.x} y={cur.y} label={EF_DRAGS[dragging][0]} icon={ICON_OF(EF_DRAGS[dragging][0])} /> : undefined}>
      <EFBuilder steps={steps} rows={rows} palHl={dragging >= 0 ? EF_DRAGS[dragging][0] : undefined} />
    </FStage>
  );
};

// ═══ e6 — configure the Dropdown field ═══════════════════════════════════════
const SceneConfigEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [125, 126], [194, 150], [227, 210], [314, 300], [420, 420]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const lbl = g >= 70 ? typed(g, 72, "Program of interest", 0.8) : "Dropdown";
  const saved = g >= 352;
  const mkRows = (dl: string, hl: boolean, all = false): EFRow[] => [{ label: "Personal Details", fields: [{ label: all ? "Full Name" : "Short Text", type: "Short Text" }, { label: all ? "Date of Birth" : "Date", type: "Date" }, { label: dl, type: "Dropdown", hl }, { label: all ? "Photo ID" : "Attachment", type: "Attachment" }] }, { label: "Contact Details", fields: [] }];
  const rows = mkRows(saved ? "Program of interest" : "Dropdown", (g >= 20 && g < 40) || (saved && g < 380), g >= 380);
  const BOX = { x: 544, y: 46, w: 512, h: 650 };
  const L = (y: number) => BOX.y + y;
  const OPTS = ["Medical Assistant", "Pharmacy Technician", "Phlebotomy"];
  const optV = (i: number) => (g < 150 + i * 34 ? `Option ${i + 1}` : typed(g, 152 + i * 34, OPTS[i], 1));
  const showOpt3 = g >= 216;
  const SAVE = { x: 24, y: BOX.h - 60, w: 80, h: 34 };
  const REQ = { x: BOX.w - 24 - 120, y: BOX.h - 54 };
  const TITLE = fieldTitlePt(mkRows("Dropdown", false), 0, 2);
  const ADDOPT = { x: BOX.x + 24 + 70, y: L(391) };
  const mo = g >= 40 && g < 352 ? Math.min(fi(g, 40, 8), fo(g, 344, 8)) : 0;
  const cur = path(g, [[0, MX(600), MY(520)], [26, TITLE.x, TITLE.y], [40, TITLE.x, TITLE.y], [62, BOX.x + 200, L(112)], [110, BOX.x + 200, L(112)], [124, BOX.x + 200, L(200)], [146, BOX.x + 200, L(200)], [150, BOX.x + 200, L(304)], [184, BOX.x + 200, L(350)], [200, ADDOPT.x, ADDOPT.y], [214, ADDOPT.x, ADDOPT.y], [222, BOX.x + 200, L(396)], [260, BOX.x + 200, L(396)], [292, BOX.x + REQ.x + 18, BOX.y + REQ.y + 12], [304, BOX.x + REQ.x + 18, BOX.y + REQ.y + 12], [330, BOX.x + ctr(SAVE).x, BOX.y + ctr(SAVE).y], [346, BOX.x + ctr(SAVE).x, BOX.y + ctr(SAVE).y], [420, MX(500), MY(420)]]);
  const keys: CamKey[] = [[0, 900, 400, 1.3], [24, TITLE.x + 120, TITLE.y, 1.8], [44, 800, 420, 1.25], [60, 800, 200, 1.7], [120, 800, 260, 1.7], [150, 800, 380, 1.6], [270, 800, 440, 1.5], [290, 920, 660, 1.6], [320, 700, 660, 1.6], [356, 800, 420, 1.3], [420, 800, 420, 1.3]];
  const req = g >= 300;
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 210), rip(g, 300), rip(g, 342))} active="Enrollment form Builder" chip={[6, g < 140 ? "Click a field → set its label" : g < 280 ? "Description + dropdown options" : g < 380 ? "Required → Save" : "Same for every field: Full Name · Date of Birth · Photo ID"]}
      over={<Modal box={BOX} title={lbl || " "} o={mo}>
        <MInput x={24} y={70} w={BOX.w - 48} label="Field Label:" value={lbl} glow={g >= 62 && g < 118} />
        <MInput x={24} y={156} w={BOX.w - 48} h={64} label="Description:" value={typed(g, 126, "Pick the program you want to join.", 1.4)} ph="Describe how people should use this field" glow={g >= 124 && g < 148} />
        <div style={{ position: "absolute", left: 24, top: 252, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Options:</div>
        {[0, 1, 2].filter((i) => i < 2 || showOpt3).map((i) => (
          <React.Fragment key={i}>
            <MInput x={24} y={278 + i * 50} w={BOX.w - 48 - 50} value={optV(i)} glow={g >= 150 + i * 34 && g < 182 + i * 34} />
            <div style={{ position: "absolute", left: BOX.w - 24 - 40, top: 278 + i * 50, width: 40, height: 40, borderRadius: 8, background: "#DC2626", opacity: i === 0 ? 0.5 : 1, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✕</div>
          </React.Fragment>
        ))}
        <div style={{ position: "absolute", left: 24, top: showOpt3 ? 278 + 3 * 50 : 278 + 2 * 50 + 4, fontSize: 14, fontWeight: 700, color: BLUE }}>＋ Add New Option</div>
        <div style={{ position: "absolute", left: 24, top: 512, display: "flex", alignItems: "center", gap: 10 }}><Toggle on={0} /><span style={{ fontSize: 14, fontWeight: 800, color: INK }}>Allow multiple select</span></div>
        <UB {...SAVE} fs={13.5} label="Save" press={g >= 338 && g < 346} />
        <UB x={BOX.w - 24 - 120 - 16 - 80} y={BOX.h - 60} w={80} h={34} fs={13.5} label="Delete" v="red" />
        <div style={{ position: "absolute", left: REQ.x, top: REQ.y, display: "flex", alignItems: "center", gap: 10 }}><Toggle on={req ? 1 : 0} /><span style={{ fontSize: 14, fontWeight: 600, color: INK }}>Required</span></div>
      </Modal>}>
      <EFBuilder steps={steps} rows={rows} />
    </FStage>
  );
};
// NOTE: "Add New Option" sits at y=378 (2 options) → cursor aims L(424)= BOX.y+378+... see ADDOPT

// ═══ e7 — 2 Columns + Duplicates ══════════════════════════════════════════════
const SceneColsEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = tw(gt(f, dur, D), [[0, 0], [109, 80], [170, 152], [329, 304], [380, 380]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const p1: EFRow = { label: "Personal Details", fields: [{ label: "Full Name", type: "Short Text" }, { label: "Date of Birth", type: "Date" }, { label: "Program of interest", type: "Dropdown" }, { label: "Photo ID", type: "Attachment" }] };
  const SCR = 300; // page scrolled to show the second row
  const scroll = interpolate(g, [0, 30], [0, SCR], { ...cl, easing: EZ });
  const T1 = 80, T2 = 152, T3 = 218;
  const colField = (a: EFField | null, b: EFField | null, o = 1): EFField => ({ label: "2 Columns", type: "2 Columns", cols: [a, b], o });
  const c2 = g >= T1 + 56;
  const ca = g >= T2 + 50 ? { label: "Number", type: "Number", o: fi(g, T2 + 50, 8) } : null;
  const cb = g >= T3 + 50 ? { label: "Short Text", type: "Short Text", o: fi(g, T3 + 50, 8) } : null;
  const contact: EFRow = { label: "Contact Details", fields: c2 ? [colField(ca, cb, fi(g, T1 + 56, 8))] : [] };
  const dup = g >= 312;
  const rows: EFRow[] = [p1, contact, ...(dup ? [{ label: "Contact Details copy", fields: [colField({ label: "Number", type: "Number" }, { label: "Short Text", type: "Short Text" })], o: fi(g, 312, 10) }] : [])];
  if (g >= T1 + 20 && g < T1 + 56) contact.drop = true;
  const before: EFRow[] = [p1, { label: "Contact Details", fields: [] }];
  const after: EFRow[] = [p1, { label: "Contact Details", fields: [colField(null, null)] }];
  const DP = dropPt(before, 1, SCR);
  const CA = colPt(after, 1, 0, 0, 2, SCR), CB = colPt(after, 1, 0, 1, 2, SCR);
  const DUP = rowBtnPt(after, 1, "dup", SCR);
  const drag = g >= T1 && g < T1 + 56 ? "2 Columns" : g >= T2 && g < T2 + 50 ? "Number" : g >= T3 && g < T3 + 50 ? "Short Text" : "";
  const cur = path(g, [[0, MX(500), MY(420)], [T1 - 14, palPt("2 Columns").x, palPt("2 Columns").y], [T1, palPt("2 Columns").x, palPt("2 Columns").y], [T1 + 48, DP.x, DP.y], [T1 + 56, DP.x, DP.y],
    [T2 - 14, palPt("Number").x, palPt("Number").y], [T2, palPt("Number").x, palPt("Number").y], [T2 + 44, CA.x, CA.y], [T2 + 50, CA.x, CA.y],
    [T3 - 14, palPt("Short Text").x, palPt("Short Text").y], [T3, palPt("Short Text").x, palPt("Short Text").y], [T3 + 44, CB.x, CB.y], [T3 + 50, CB.x, CB.y],
    [290, DUP.x, DUP.y], [306, DUP.x, DUP.y], [380, DUP.x + 200, DUP.y + 100]]);
  const keys: CamKey[] = [[0, 650, 380, 1.4], [40, 900, 330, 1.3], [270, 900, 330, 1.3], [292, DUP.x + 120, DUP.y - 80, 1.7], [320, DUP.x + 120, DUP.y - 40, 1.6], [350, 700, 420, 1.3], [380, 700, 420, 1.3]];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={rip(g, 304)} grab={!!drag} active="Enrollment form Builder" chip={[7, g < 280 ? "2 Columns → fields side by side" : "Duplicates copies the whole row"]}
      over={drag ? <Ghost x={cur.x} y={cur.y} label={drag} icon={ICON_OF(drag)} /> : undefined}>
      <EFBuilder steps={steps} rows={rows} scroll={scroll} palHl={drag || undefined} rowPress={g >= 298 && g < 308 ? [1, "dup"] : undefined} />
    </FStage>
  );
};

// ═══ e8 — Preview (Form Preview dialog) → Save ═════════════════════════════════
const SceneTestEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = tw(gt(f, dur, D), [[0, 0], [30, 38], [193, 146], [267, 218], [338, 284], [392, 334], [400, 345]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const rows: EFRow[] = [{ label: "Personal Details", fields: [{ label: "Full Name", type: "Short Text" }, { label: "Date of Birth", type: "Date" }, { label: "Program of interest", type: "Dropdown" }, { label: "Photo ID", type: "Attachment" }] }, { label: "Contact Details", fields: [{ label: "2 Columns", type: "2 Columns", cols: [{ label: "Phone", type: "Number" }, { label: "Email", type: "Short Text" }] }] }];
  const BOX = { x: 410, y: 40, w: 780, h: 740 };
  const stp = g < 150 ? 0 : g < 222 ? 1 : 2;
  const NEXT = { x: BOX.w / 2 + 8, y: BOX.h - 70, w: 120, h: 44 };
  const PREV = { x: BOX.w / 2 - 8 - 130, y: BOX.h - 70, w: 130, h: 44 };
  const nxt = { x: BOX.x + ctr(NEXT).x, y: BOX.y + ctr(NEXT).y };
  const mo = g >= 40 && g < 290 ? Math.min(fi(g, 40, 8), fo(g, 282, 8)) : 0;
  const cur = path(g, [[0, MX(500), MY(420)], [26, efHdr("prev").x, efHdr("prev").y], [40, efHdr("prev").x, efHdr("prev").y], [80, BOX.x + 400, BOX.y + 300], [130, nxt.x, nxt.y], [148, nxt.x, nxt.y], [204, nxt.x, nxt.y], [220, nxt.x, nxt.y], [272, BOX.x + BOX.w - 32, BOX.y + 32], [286, BOX.x + BOX.w - 32, BOX.y + 32], [320, efHdr("save").x, efHdr("save").y], [336, efHdr("save").x, efHdr("save").y], [400, efHdr("save").x, efHdr("save").y + 80]]);
  const keys: CamKey[] = [[0, 800, 380, 1.3], [24, efHdr("prev").x - 100, 150, 1.9], [44, 800, 430, 1.12], [280, 800, 430, 1.12], [310, efHdr("save").x - 80, 160, 1.9], [400, efHdr("save").x - 80, 160, 1.9]];
  const content: [string, string, boolean?][][] = [
    [["Full Name", "Maya Torres", true], ["Date of Birth", "06/02/2007"], ["Program of interest", "Medical Assistant", true], ["Photo ID", "📎 id-front.jpg"]],
    [["Guardian name", "Elena Torres"], ["Relationship", "Mother"]],
    [["Transcript", "📎 transcript.pdf"], ["Signature", "✍ signed"]],
  ];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 146), rip(g, 218), rip(g, 284), rip(g, 334))} active="Enrollment form Builder" chip={[8, g < 290 ? "Preview — walk the steps like a student" : "Save"]}
      over={<>
        <Modal box={BOX} title="Form Preview" o={mo}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", gap: 14 }}>
            {steps.map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: i === stp ? BLUE : i < stp ? BLUE_SOFT : "#F3F4F6", color: i === stp ? "#fff" : i < stp ? BLUE : GRAY, fontSize: 14, fontWeight: 800 }}><span>{i + 1}</span>{s}</div>)}
          </div>
          {content[stp].map(([l, v, r], i) => (
            <MInput key={stp + l} x={40} y={140 + i * 96} w={BOX.w - 80} label={l} req={r} value={v} select={l.includes("Program")} />
          ))}
          <div style={{ position: "absolute", left: 24, right: 24, top: BOX.h - 94, borderTop: "1px solid #D1D5DB" }} />
          {stp > 0 && <UB {...PREV} label="← Previous" v="outline" />}
          <UB {...NEXT} label={stp === 2 ? "Done" : "Next →"} press={(g >= 140 && g < 150) || (g >= 212 && g < 222)} />
        </Modal>
        {g >= 338 && <Toast g={g} at={338} text="Save successfully" x={1150} y={150} />}
      </>}>
      <EFBuilder steps={steps} rows={rows} press={g >= 30 && g < 42 ? "prev" : g >= 326 && g < 338 ? "save" : undefined} />
    </FStage>
  );
};
// Note: Preview renders the form for testing only (enroll action is a no-op there) — the voice says "test".

// ═══ e9 — public enroll page → Student Information (answers by step) ══════════
const SceneAnswersEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 460;
  const g = gt(f, dur, D);
  if (g < 200) {
    const stp = g < 120 ? 0 : 1;
    const NEXT = { x: 1360, y: 742 };
    const cur = path(g, [[0, 1100, 700], [30, 850, 284], [60, 850, 284], [100, NEXT.x, NEXT.y], [118, NEXT.x, NEXT.y], [200, 1000, 470]]);
    const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 1000, 400, 1.35], [190, 1000, 420, 1.35], [200, 1000, 420, 1.35]];
    const steps = ["Student Details", "Guardian Info", "Documents"];
    const sx = [640, 920, 1200];
    return (
      <FStage g={g} keys={keys} url={`${DOMAIN}/enroll/medical-assistant-fall-2026`} cur={cur} ripple={rip(g, 112)} tag={{ n: 2, label: "Your enroll page", url: DOMAIN }} chip={[9, "Students fill the same steps on your enroll page"]}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 64, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 30, boxSizing: "border-box" }}>
          <BrightLogo /><div style={{ flex: 1 }} />{["Programs", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>{t}</span>)}
        </div>
        <div style={{ position: "absolute", left: 60, top: 96, width: 500, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, overflow: "hidden" }}>
          <div style={{ height: 210, background: `linear-gradient(135deg,${BP},#134E4A)`, padding: 24, boxSizing: "border-box" }}>
            <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "#ffffff30", color: "#fff" }}>PROGRAM</span>
            <div style={{ marginTop: 16, fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>Medical Assistant — Fall 2026</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#CCFBF1" }}>by {BRAND}</div>
          </div>
          <div style={{ margin: "20px 24px", padding: "16px 18px", borderRadius: 12, background: "#F9FAFB", border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>Order Summary</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, color: GRAY }}>Original price <span>$2,400</span></div>
            <div style={{ marginTop: 10, height: 40, borderRadius: 8, border: "1px dashed #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>Promo code</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 800, color: INK }}>Total <span>$2,400</span></div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 600, top: 96, width: 940, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
        <div style={{ position: "absolute", left: 640, top: 118, fontSize: 24, fontWeight: 800, color: INK }}>Enrollment Details</div>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i < 2 && <div style={{ position: "absolute", left: sx[i] + 30, top: 186, width: 250, height: 3, background: stp > i ? BP : "#E5E7EB" }} />}
            <div style={{ position: "absolute", left: sx[i], top: 172, width: 30, height: 30, borderRadius: "50%", background: stp >= i ? BP : "#E5E7EB", color: stp >= i ? "#fff" : GRAY, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{stp > i ? "✓" : i + 1}</div>
            <div style={{ position: "absolute", left: sx[i] + 38, top: 178, fontSize: 14, fontWeight: 700, color: stp >= i ? INK : GRAY, background: "#fff", paddingRight: 6 }}>{s}</div>
          </React.Fragment>
        ))}
        {stp === 0 ? (<>
          <Input x={640} y={232} w={420} label="Full Name" req value={typed(g, 34, "Maya Torres", 0.5)} glow={g >= 30 && g < 60 ? 1 : 0} />
          <Input x={1080} y={232} w={420} label="Date of Birth" value="06/02/2007" />
          <Input x={640} y={322} w={860} label="Program of interest" req value="Medical Assistant" select />
          <Input x={640} y={412} w={420} label="Phone" value="(555) 014-2290" />
          <Input x={1080} y={412} w={420} label="Email" value="maya.torres@example.com" />
          <Input x={640} y={502} w={860} label="Photo ID" value="📎 id-front.jpg" />
        </>) : (<div style={{ opacity: fi(g, 120, 8) }}>
          <Input x={640} y={232} w={420} label="Guardian name" value={typed(g, 130, "Elena Torres", 0.5)} glow={g >= 128 ? 1 : 0} />
          <Input x={1080} y={232} w={420} label="Relationship" value="" ph="Select" select />
        </div>)}
        <div style={{ position: "absolute", left: 1300, top: 720, width: 120, height: 44, borderRadius: 8, background: BP, color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 110 && g < 120 ? 0.93 : 1})` }}>Next →</div>
      </FStage>
    );
  }
  // ── Student Information (Pending Members → open the enrollment) ──
  const h = g - 200;
  const EXP = { x: MX(1350 - 24 - 3 * 46 + 21), y: MY(42) };
  const PRN = { x: MX(1350 - 24 - 2 * 46 + 21), y: MY(42) };
  const cur = path(h, [[0, 900, 500], [40, 700, 440], [140, 700, 640], [190, EXP.x, EXP.y], [206, EXP.x, EXP.y], [226, PRN.x, PRN.y], [260, PRN.x, PRN.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 760, 300, 1.35], [80, 760, 360, 1.35], [140, 760, 560, 1.35], [180, EXP.x - 160, 140, 1.9], [260, EXP.x - 160, 140, 1.9]];
  const ans: [string, [string, string][]][] = [["Student Details", [["Full Name", "Maya Torres"], ["Date of Birth", "06/02/2007"], ["Program of interest", "Medical Assistant"], ["Photo ID", "id-front.jpg"]]], ["Guardian Info", [["Guardian name", "Elena Torres"], ["Relationship", "Mother"]]]];
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={h} keys={keys}>
        <Browser url="branch.skillbnk.com/pending-members/maya-torres">
          <div style={{ position: "absolute", inset: 0, background: "#F6F7F9", opacity: fi(h, 0, 8) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
              <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><BrightLogo /></div>
              {["Dashboard", "Enrollment & Students", "Pending Members", "Programs", "Attendance"].map((m, i) => <div key={m} style={{ position: "absolute", left: 12, top: 90 + i * 36, width: SIDE - 24, height: 34, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 10px", boxSizing: "border-box", fontSize: 13.5, fontWeight: m === "Pending Members" ? 700 : 500, background: m === "Pending Members" ? BLUE_SOFT : "transparent", color: m === "Pending Members" ? BLUE : "#1F2937", gap: 9 }}><Ico s={14} c={m === "Pending Members" ? BLUE : "#4B5563"} />{m}</div>)}
            </div>
            <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}` }} />
            <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD }}>
              <PageTitle t="Student Information" sub="All information on student enrollment is here" back x={24} y={14} />
              {[["⤓", "#16A34A"], ["🖨", BLUE], ["🕘", "#7C3AED"]].map(([ic, c], i) => <div key={i} style={{ position: "absolute", left: 1350 - 24 - (3 - i) * 46, top: 22, width: 40, height: 40, borderRadius: 8, background: c + "1A", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: (i === 0 && h >= 196 && h < 210) || (i === 1 && h >= 240) ? `0 0 0 3px ${c}55` : "none" }}>{ic}</div>)}
              <div style={{ position: "absolute", left: 24, top: 90, width: 1302, height: 92, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
              {[["Status:", "Pending"], ["Enrolled Program:", "Medical Assistant — Fall 2026"], ["Enrolled Session:", "Evening cohort"], ["Enrolled Date:", "Oct 3, 2026"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 44 + i * 318, top: 104, width: 296 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{a}</div><div style={{ marginTop: 6, height: 36, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 14, color: INK, justifyContent: "space-between" }}>{b}{i < 3 && <span style={{ color: "#9CA3AF" }}>⌄</span>}</div></div>)}
              {ans.map(([s, rows], si) => (
                <div key={s} style={{ position: "absolute", left: 24, top: 200 + si * 270, width: 1302, opacity: fi(h, 30 + si * 40, 10) }}>
                  <div style={{ padding: "10px 16px", background: BLUE_SOFT, borderLeft: `4px solid ${BLUE}`, borderRadius: "8px 8px 0 0", fontSize: 16, fontWeight: 800, color: INK }}>{s}</div>
                  <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {rows.map(([a, b]) => <div key={a} style={{ padding: "10px 14px", background: "#F9FAFB", borderRadius: 8 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: GRAY }}>{a}</div><div style={{ marginTop: 3, fontSize: 15.5, fontWeight: 700, color: INK }}>{b}</div></div>)}
                  </div>
                </div>
              ))}
            </div>
            <Cursor x={cur.x} y={cur.y} ripple={Math.max(rip(h, 200), rip(h, 236))} />
          </div>
        </Browser>
      </CamC>
      <StepChip n={10} text={h < 170 ? "Every answer saved with the enrollment — step by step" : "Export to CSV · Print"} o={fi(h, 4, 10)} />
    </Stage>
  );
};

// ═══ e10 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["🪜", "Steps", "Student · Guardian · Docs"], ["⋮⋮", "Drag fields", "14 elements"], ["⚙", "Configure", "Label · options · Required"], ["👁", "Preview", "Test before saving"], ["📋", "Answers", "Saved with each enrollment"]]} line={<>Your questions. <span style={{ color: "#5EEAD4" }}>Your enrollment form.</span></>} />;
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  e0: SceneHookEF, e1: SceneOpenEF, e2: SceneTourEF, e3: SceneStepsEF, e4: SceneRowsEF, e5: SceneDragEF, e6: SceneConfigEF, e7: SceneColsEF, e8: SceneTestEF, e9: SceneAnswersEF, e10: SceneWrapEF,
};

export const EnrollmentFormBuilderVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "e10" ? TAIL : 0);
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
          <Audio src={staticFile(`enrollmentbuilder/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
