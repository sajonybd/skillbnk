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
// FormBuilderVideo — "Form Builder" (sheet serial 18).
// Every label verified in the skillBNK code (see the header comment of the scenes part below).
// ALL names and data are FICTIONAL (Brightpath Academy). Built by _parts/build_forms.py.
// Voice: bash generate-voice-formbuilder.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  f0: 378,
  f1: 314,
  f2: 343,
  f3: 353,
  f4: 284,
  f5: 315,
  f6: 306,
  f7: 326,
  f8: 312,
  f9: 166,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"];

const PRE = ["f0"] as const; // hook, BEFORE the intro
const POST = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { f0: 400, f1: 330, f2: 330, f3: 420, f4: 360, f5: 360, f6: 330, f7: 420, f8: 420, f9: 220 };
const PACE: Record<Key, number> = { f0: 1, f1: 1, f2: 1, f3: 1, f4: 1, f5: 1, f6: 1, f7: 1, f8: 1, f9: 1 };
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
// General Form Builder — scenes (sheet serial 18). Real UI (SB-Company):
//  AllFormBuilderPage: "All Forms" · "Manage all form builder forms" · "Search Form Name..." · Create New ·
//   export · columns Form Name / Form ID / Created By / Submissions / Status / Created Date / Actions
//   (Copy Link · Clone Form · Edit · View Responses · Delete). Toasts "Link copied to clipboard!".
//  components/form-builder/FormBuilder: header "Form Builder" + "N tab(s)" badge (+ "<Element> selected"),
//   Preview · Test · Export · Import · Save.  ElementPalette "Form Elements", "Search elements...", All /
//   Categories.  Tabs + "Add Tab" → "Add New Tab" dialog ("Tab title", "Create Tab"), default "Form Page 1".
//  FormTabContent empty: "Start building your form", "Add rows and drag elements from the palette",
//   "Drop element here to create a new row", "1/2/3/4 Column Row"; with rows: "Add N Column Row".
//  DroppableColumn "Add Element" / "Drop Here".  PropertiesPanel "Properties", "Select an element to edit
//   its properties", "Basic Properties": Label, Placeholder, Required, Disabled, Read Only; "Validation Rules".
//  FormTestRenderer "Test Form" · "Test your form before publishing" · Reset · Cancel · Submit Form.
//  FormSettingsDialog "Form Settings" · "Configure your form name and settings before saving." ·
//   Form Name * · Status (Active/Inactive) · Form Options: Collect Email ("Turn on only when submissions
//   should require login…"), Limit Response ("Allow only one response per user"), Allow Editing ("Let users
//   edit their responses"), Send Confirmation Email ("Email users after form submission") · Save Form.
//   Toast "Form created successfully!".  Public SB-Frontend /form/[id]: Previous / Next / Submit Form,
//   "Thank You!" "Your form has been submitted successfully."
// ═══════════════════════════════════════════════════════════════════════════
type FBEl = { label: string; type: string; ph?: string; req?: boolean; o?: number; sel?: boolean };
type FBRow = { cols: FBEl[][]; o?: number; dropCol?: number };
const FB_HB = { prev: { x: 880, y: 13, w: 90, h: 36 }, test: { x: 978, y: 13, w: 70, h: 36 }, exp: { x: 1056, y: 13, w: 84, h: 36 }, imp: { x: 1148, y: 13, w: 84, h: 36 }, save: { x: 1246, y: 13, w: 84, h: 36 } };
const fbHdr = (k: keyof typeof FB_HB) => ({ x: MX(ctr(FB_HB[k]).x), y: MY(ctr(FB_HB[k]).y) });
const FB_PAL: [string, string][] = [["Text Input", "Single line text input field"], ["Email", "Email address input with validation"], ["Password", "Password input field"], ["Number", "Numeric input field"], ["Phone", "Telephone number input"], ["Map", "Interactive map with customizable location and zoom"], ["URL", "URL input field"], ["QR Code", "Display a QR code from an image URL"], ["Textarea", "Multi-line text input"], ["Select Dropdown", "Single selection dropdown"], ["Multi Select", "Multiple selection dropdown"]];
const fbPalPt = (name: string, list = FB_PAL) => ({ x: MX(12 + 120), y: MY(196 + list.findIndex((e) => e[0] === name) * 54 + 23) });
const FB_CAN = { x: 320, w: 690, top: 130 };
const FB_PROPS = { x: 1040, w: 290 };
const elH = 70;
const colW = (n: number) => (FB_CAN.w - 24 - (n - 1) * 12) / n;
const colX = (n: number, c: number) => FB_CAN.x + 12 + c * (colW(n) + 12);
const contentH = (r: FBRow) => Math.max(70, ...r.cols.map((c) => c.length * (elH + 8) - 8));
const fbRowH = (r: FBRow) => 40 + contentH(r) + 14;
const fbTops = (rows: FBRow[]) => { let y = FB_CAN.top; return rows.map((r) => { const t = y; y += fbRowH(r) + 14; return t; }); };
const fbColPt = (rows: FBRow[], r: number, c: number) => ({ x: MX(colX(rows[r].cols.length, c) + colW(rows[r].cols.length) / 2), y: MY(fbTops(rows)[r] + 40 + 35) });
const fbElPt = (rows: FBRow[], r: number, c: number, i: number) => ({ x: MX(colX(rows[r].cols.length, c) + 70), y: MY(fbTops(rows)[r] + 40 + i * (elH + 8) + 14) });
const fbAddRow = (rows: FBRow[], k: number) => { const ts = fbTops(rows); const y = rows.length ? ts[ts.length - 1] + fbRowH(rows[rows.length - 1]) + 4 : 0; return { x: FB_CAN.x + k * 174, y, w: 164, h: 34 }; };
const FB_EMPTY_BTN = (k: number) => ({ x: FB_CAN.x + 27 + k * 162, y: 330, w: 150, h: 36 });
const fbTabW = (s: string) => 40 + s.length * 8.2;
const fbTabX = (tabs: string[], i: number) => FB_CAN.x + 4 + tabs.slice(0, i).reduce((a, s) => a + fbTabW(s) + 4, 0);
const fbAddTabBtn = (tabs: string[]) => ({ x: fbTabX(tabs, tabs.length) + 14, y: 76, w: 96, h: 34 });

const FBElCard: React.FC<{ e: FBEl; x: number; y: number; w: number }> = ({ e, x, y, w }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: elH, opacity: e.o ?? 1, borderRadius: 8, background: "#fff", border: `${e.sel ? 2 : 1}px solid ${e.sel ? BLUE : LINE}`, boxShadow: e.sel ? "0 0 0 3px #C7D2FE" : "none", padding: "8px 10px", boxSizing: "border-box", transform: `scale(${0.95 + 0.05 * (e.o ?? 1)})` }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", whiteSpace: "nowrap", overflow: "hidden" }}>{e.label}{e.req && <span style={{ color: "#EF4444" }}> *</span>}</div>
    <div style={{ marginTop: 6, height: 32, borderRadius: 6, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 12.5, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{e.type === "Rating" ? <span style={{ color: "#F59E0B", fontSize: 16, letterSpacing: 2 }}>☆☆☆☆☆</span> : <span>{e.ph ?? ""}</span>}{e.type.includes("Select") && <span>⌄</span>}</div>
  </div>
);
const FBBuilder: React.FC<{ rows?: FBRow[]; tabs?: string[]; act?: number; press?: string; palHl?: string; sel?: FBEl | null; selType?: string; search?: string; pal?: [string, string][]; props?: React.ReactNode; emptyDrop?: boolean; addRowPress?: number }> = ({ rows = [], tabs = ["Form Page 1"], act = 0, press, palHl, sel, selType, search = "", pal = FB_PAL, props, emptyDrop, addRowPress = -1 }) => {
  const tops = fbTops(rows);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F6F7F9" }}>
      {/* header */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W - SIDE, height: 62, background: "#fff", borderBottom: `1px solid ${LINE}` }} />
      <div style={{ position: "absolute", left: 20, top: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>Form Builder</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#F3F4F6", color: "#374151" }}>{tabs.length} tab{tabs.length !== 1 ? "s" : ""}</span>
        {selType && <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999, border: `1px solid ${LINE}`, color: "#374151" }}>{selType} selected</span>}
      </div>
      <UB {...FB_HB.prev} fs={13.5} v="outline" label="Preview" press={press === "prev"} />
      <UB {...FB_HB.test} fs={13.5} v="outline" label="Test" press={press === "test"} />
      <UB {...FB_HB.exp} fs={13.5} v="outline" label="Export" press={press === "exp"} />
      <UB {...FB_HB.imp} fs={13.5} v="outline" label="Import" press={press === "imp"} />
      <UB {...FB_HB.save} fs={13.5} label="Save" press={press === "save"} />
      {/* palette */}
      <div style={{ position: "absolute", left: 0, top: 62, width: 300, height: 734, background: "#fff", borderRight: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 12, top: 14, fontSize: 17, fontWeight: 800, color: INK }}>Form Elements</div>
        <div style={{ position: "absolute", left: 12, top: 44, width: 276, height: 36, borderRadius: 8, border: `1px solid ${search ? "#A5B4FC" : "#D1D5DB"}`, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", boxSizing: "border-box", fontSize: 13.5, color: search ? INK : "#9CA3AF" }}>⌕ {search || "Search elements..."}</div>
        <div style={{ position: "absolute", left: 12, top: 90, width: 276, height: 32, borderRadius: 8, background: "#F3F4F6", display: "flex", padding: 3, boxSizing: "border-box" }}>
          <div style={{ flex: 1, borderRadius: 6, background: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: INK }}>All</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY }}>Categories</div>
        </div>
      </div>
      {pal.map(([n, d], i) => (
        <div key={n} style={{ position: "absolute", left: 12, top: 196 + i * 54, width: 276, height: 46, borderRadius: 8, border: `1px solid ${palHl === n ? BLUE : LINE}`, background: palHl === n ? BLUE_SOFT : "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 10px", boxSizing: "border-box" }}>
          <span style={{ width: 28, height: 28, borderRadius: 6, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>▭</span>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: palHl === n ? BLUE : INK }}>{n}</div><div style={{ fontSize: 11, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 210 }}>{d}</div></div>
        </div>
      ))}
      {/* tabs */}
      {tabs.map((s, i) => <div key={s} style={{ position: "absolute", left: fbTabX(tabs, i), top: 76, width: fbTabW(s), height: 34, borderRadius: 7, background: i === act ? "#fff" : "#E9ECF1", boxShadow: i === act ? "0 1px 3px #0002" : "none", fontSize: 13.5, fontWeight: 700, color: i === act ? INK : GRAY, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{s}</div>)}
      <UB {...fbAddTabBtn(tabs)} fs={13} v="outline" label="Add Tab" icon="＋" press={press === "tab"} />
      {/* canvas */}
      {rows.length === 0 ? (
        <div style={{ position: "absolute", left: FB_CAN.x, top: FB_CAN.top, width: FB_CAN.w, height: 280, borderRadius: 12, border: `2px dashed ${emptyDrop ? "#22C55E" : "#CBD5E1"}`, background: emptyDrop ? "#22C55E14" : "transparent" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontSize: 18, fontWeight: 800, color: INK }}>Start building your form</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 14, color: GRAY }}>Add rows and drag elements from the palette</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontSize: 13.5, fontWeight: 600, color: emptyDrop ? "#16A34A" : "#9CA3AF" }}>Drop element here to create a new row</div>
        </div>
      ) : rows.map((r, ri) => (
        <div key={ri} style={{ position: "absolute", left: FB_CAN.x, top: tops[ri], width: FB_CAN.w, height: fbRowH(r), borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, opacity: r.o ?? 1 }}>
          <div style={{ position: "absolute", left: 12, top: 9, fontSize: 12, fontWeight: 700, color: GRAY }}>{r.cols.length} Column{r.cols.length > 1 ? "s" : ""}</div>
          <div style={{ position: "absolute", right: 12, top: 7, display: "flex", gap: 14, fontSize: 14, color: GRAY }}><span>⠿</span><span>▥</span><span>＋</span><span style={{ color: "#DC2626" }}>🗑</span></div>
          {r.cols.map((c, ci) => {
            const x = colX(r.cols.length, ci) - FB_CAN.x; const w = colW(r.cols.length);
            const drop = r.dropCol === ci;
            return (
              <div key={ci} style={{ position: "absolute", left: x, top: 40, width: w, height: contentH(r) }}>
                {c.length === 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 8, border: `1.5px dashed ${drop ? "#22C55E" : "#D1D5DB"}`, background: drop ? "#22C55E14" : "#FAFBFC", display: "flex", alignItems: "center", justifyContent: "center" }}>{drop ? <span style={{ background: "#22C55E", color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>Drop Here</span> : <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", border: "1px dashed #D1D5DB", borderRadius: 7, padding: "6px 12px", background: "#fff" }}>＋ Add Element</span>}</div>}
                {c.map((e, ei) => <FBElCard key={ei} e={e} x={0} y={ei * (elH + 8)} w={w} />)}
              </div>
            );
          })}
        </div>
      ))}
      {rows.length === 0 ? [0, 1, 2, 3].map((k) => <UB key={k} {...FB_EMPTY_BTN(k)} fs={13} v="outline" label={`${k + 1} Column Row`} press={addRowPress === k} />)
        : [0, 1, 2, 3].map((k) => <UB key={k} {...fbAddRow(rows, k)} fs={12.5} v="outline" label={`Add ${k + 1} Column Row`} press={addRowPress === k} />)}
      {/* properties */}
      <div style={{ position: "absolute", left: FB_PROPS.x, top: 62, width: FB_PROPS.w + 20, height: 734, background: "#fff", borderLeft: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 16, top: 14, fontSize: 17, fontWeight: 800, color: INK }}>Properties</div>
        {props ?? <div style={{ position: "absolute", left: 16, top: 50, width: 260, fontSize: 13.5, color: GRAY }}>Select an element to edit its properties</div>}
      </div>
    </div>
  );
};
const FB_URL_ADD = "company.skillbnk.com/form-builder-component/add";
const FB_URL_LIST = "company.skillbnk.com/organization-form-builder";
const FBProps: React.FC<{ label: string; ph: string; req: number; gl?: "label" | "ph"; extra?: React.ReactNode }> = ({ label, ph, req, gl, extra }) => (
  <>
    <div style={{ position: "absolute", left: 16, top: 50, fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 0.6 }}>Basic Properties</div>
    <MInput x={16} y={78} w={268} label="Label" value={label} glow={gl === "label"} />
    <MInput x={16} y={156} w={268} label="Placeholder" value={ph} glow={gl === "ph"} />
    {[["Required", req], ["Disabled", 0], ["Read Only", 0]].map(([n, v], i) => <div key={n as string} style={{ position: "absolute", left: 16, top: 240 + i * 38, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: INK }}><Toggle on={v as number} />{n}</div>)}
    <div style={{ position: "absolute", left: 16, top: 370, fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 0.6 }}>Validation Rules</div>
    <div style={{ position: "absolute", left: 16, top: 396, width: 268, height: 34, borderRadius: 8, border: "1px dashed #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#374151" }}>＋ Add Validation Rule</div>
    {extra}
  </>
);
const FB_REQ = { x: MX(FB_PROPS.x + 16 + 20), y: MY(62 + 240 + 11) };

// ── All Forms list ──
type FormRowT = { name: string; id: string; by: string; subs: number; status: "Active" | "Pending"; date: string; o?: number; hl?: boolean };
const FORMS: FormRowT[] = [
  { name: "Open House RSVP", id: "f-3c91a7", by: "Ava Reyes", subs: 64, status: "Active", date: "Sep 12, 2026" },
  { name: "Course Feedback — Week 4", id: "f-77b0e2", by: "Ava Reyes", subs: 118, status: "Active", date: "Sep 3, 2026" },
  { name: "Scholarship Interest", id: "f-1d5f40", by: "Liam Chen", subs: 23, status: "Pending", date: "Aug 28, 2026" },
  { name: "Volunteer Sign-up", id: "f-a2e9c3", by: "Liam Chen", subs: 41, status: "Active", date: "Aug 14, 2026" },
];
const FL = { create: { x: 1350 - 24 - 46 - 10 - 130, y: 22, w: 130, h: 40 }, tableTop: 160, rowH: 56 };
const FL_COLS: [string, number][] = [["Form Name", 300], ["Form ID", 130], ["Created By", 160], ["Submissions", 130], ["Status", 120], ["Created Date", 160], ["Actions", 300]];
const flColX = (i: number) => 24 + FL_COLS.slice(0, i).reduce((a, c) => a + c[1], 0);
const FL_ACTS = ["⧉", "⎘", "✎", "📋", "🗑"]; // Copy Link · Clone Form · Edit · View Responses · Delete
const flActPt = (row: number, a: number) => ({ x: MX(flColX(6) + 12 + a * 44 + 17), y: MY(FL.tableTop + 46 + row * FL.rowH + FL.rowH / 2) });
const FormsList: React.FC<{ rows: FormRowT[]; press?: string; actPress?: [number, number] }> = ({ rows, press, actPress }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="All Forms" sub="Manage all form builder forms" x={24} y={16} />
    <UB {...FL.create} label="Create New" icon="＋" press={press === "create"} />
    <div style={{ position: "absolute", left: 1350 - 24 - 46, top: 22, width: 46, height: 40, borderRadius: 8, background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⤓</div>
    <div style={{ position: "absolute", left: 24, top: 96, width: 340, height: 40, borderRadius: 8, border: "1px solid #D1D5DB", background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>⌕ Search Form Name...</div>
    <div style={{ position: "absolute", left: 24, top: FL.tableTop, width: 1300, height: 46 + rows.length * FL.rowH, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ display: "flex", height: 46, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, alignItems: "center" }}>{FL_COLS.map(([c, w]) => <div key={c} style={{ width: w, padding: "0 14px", boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: "#374151" }}>{c}</div>)}</div>
      {rows.map((r, i) => (
        <div key={r.id} style={{ display: "flex", height: FL.rowH, alignItems: "center", borderBottom: "1px solid #F1F2F4", opacity: r.o ?? 1, background: r.hl ? "#F5F7FF" : "#fff" }}>
          <div style={{ width: 300, padding: "0 14px", boxSizing: "border-box", fontSize: 14.5, fontWeight: 700, color: BLUE }}>{r.name}</div>
          <div style={{ width: 130, padding: "0 14px", boxSizing: "border-box", fontSize: 13, color: GRAY, fontFamily: "monospace" }}>{r.id}</div>
          <div style={{ width: 160, padding: "0 14px", boxSizing: "border-box", fontSize: 14, color: INK }}>{r.by}</div>
          <div style={{ width: 130, textAlign: "center", fontSize: 14.5, fontWeight: 800, color: INK }}>{r.subs}</div>
          <div style={{ width: 120, padding: "0 14px", boxSizing: "border-box" }}><span style={{ fontSize: 12.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: r.status === "Active" ? "#DCFCE7" : "#FEF3C7", color: r.status === "Active" ? "#15803D" : "#B45309" }}>{r.status}</span></div>
          <div style={{ width: 160, padding: "0 14px", boxSizing: "border-box", fontSize: 13.5, color: "#374151" }}>{r.date}</div>
          <div style={{ width: 300, padding: "0 12px", boxSizing: "border-box", display: "flex", gap: 10 }}>{FL_ACTS.map((a, k) => <div key={k} style={{ width: 34, height: 34, borderRadius: 8, background: k === 4 ? "#FEE2E2" : BLUE_SOFT, color: k === 4 ? "#DC2626" : BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: actPress && actPress[0] === i && actPress[1] === k ? "0 0 0 3px #A5B4FC" : "none" }}>{a}</div>)}</div>
        </div>
      ))}
    </div>
  </div>
);

// ═══ f0 — HOOK ══════════════════════════════════════════════════════════════
const SceneHookFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  return <Hook3 g={g} fps={fps} D={D} b2={140} b3={300}
    pain={<>Your student data is spread across <span style={{ color: "#F87171" }}>five outside tools</span>.</>}
    painSub="Who can see it? Where did that response go? Nobody knows."
    painCards={[["📊", "A paid survey app"], ["📝", "A sign-up sheet with its own login"], ["📧", "Answers buried in email"]]}
    painStat={["$$$", "every month, for tools you shouldn't need"]}
    other={<>stop at enrollment. <span style={{ color: "#FCA5A5" }}>Everything else? Another tool.</span></>}
    otherItems={["No built-in form builder", "Feedback and surveys live somewhere else", "Responses never reach your platform"]}
    win={<>Every form, built <span style={{ color: "#5EEAD4" }}>inside your platform</span>.</>}
    trust={["Drag-and-drop builder — no developer", "Your brand, one shareable link", "Every response stays in skillBNK"]}
    visual={<HookCard title="Campus Visit Feedback">
      <div style={{ marginTop: 16, opacity: fi(g, 316, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Full name *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Jordan Lee</div></div><div style={{ marginTop: 16, opacity: fi(g, 324, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Email</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>jordan.lee@example.com</div></div>
      <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#374151", opacity: fi(g, 332, 8) }}>How was your visit?</div>
      <div style={{ marginTop: 6, fontSize: 40, color: "#F59E0B", letterSpacing: 8, opacity: fi(g, 338, 8) }}>★★★★★</div>
      <div style={{ marginTop: 20, height: 52, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 19, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: fi(g, 346, 8) }}>Submit Form</div>
    </HookCard>} />;
};

// ═══ f1 — All Forms → Create New ═══════════════════════════════════════════
const SceneListFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [80, 66], [318, 278], [330, 330]]);
  const opened = g >= 70;
  const M = menuPt("Form Builder");
  const CR = { x: MX(ctr(FL.create).x), y: MY(ctr(FL.create).y) };
  const SUB = { x: MX(flColX(3) + 65), y: MY(FL.tableTop + 46 + FL.rowH / 2) };
  const cur = path(g, [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [120, SUB.x, SUB.y], [170, SUB.x, SUB.y + 3 * FL.rowH], [190, MX(flColX(4) + 50), SUB.y + 3 * FL.rowH], [262, CR.x, CR.y], [282, CR.x, CR.y], [330, CR.x, CR.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 380, 1.9], [66, 300, 380, 1.9], [96, 840, 360, 1.3], [200, 840, 360, 1.3], [250, CR.x - 120, 140, 1.9], [330, CR.x - 120, 140, 1.9]];
  return (
    <FStage g={g} keys={keys} url={opened ? FB_URL_LIST : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 66), rip(g, 278))} active={opened ? "Form Builder" : "Dashboard"} chip={[1, !opened ? "Company portal → Form Builder" : g < 240 ? "All Forms — submissions and status at a glance" : "Create New"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <FormsList rows={FORMS} press={g >= 272 && g < 284 ? "create" : undefined} />}
    </FStage>
  );
};

// ═══ f2 — builder layout tour ═══════════════════════════════════════════════
const SceneLayoutFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [60, 30], [150, 100], [205, 152], [262, 196], [330, 300]]);
  const order: (keyof typeof FB_HB)[] = ["prev", "test", "exp", "imp", "save"];
  const T0 = 196, ST = 24;
  const on = g < T0 - 4 ? -1 : Math.min(4, Math.floor((g - T0 + 4) / ST));
  const pts: P3[] = [[0, MX(600), MY(300)], [30, MX(150), MY(300)], [80, MX(150), MY(420)], [96, MX(660), MY(230)], [140, MX(660), MY(260)], [150, MX(1180), MY(140)], [180, MX(1180), MY(140)]];
  order.forEach((k, i) => { pts.push([T0 + i * ST, fbHdr(k).x, fbHdr(k).y], [T0 + i * ST + 12, fbHdr(k).x, fbHdr(k).y]); });
  pts.push([D, fbHdr("save").x, fbHdr("save").y + 40]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(170), 420, 1.7], [86, MX(170), 420, 1.7], [104, MX(665), 330, 1.6], [140, MX(665), 330, 1.6], [156, MX(1150), 330, 1.7], [184, MX(1150), 330, 1.7], [T0 - 4, fbHdr("exp").x, 120, 1.9], [D, fbHdr("exp").x, 120, 1.9]];
  const names = { prev: "Preview", test: "Test", exp: "Export", imp: "Import", save: "Save" };
  const part = g < 92 ? "Form Elements on the left" : g < 148 ? "Your form page in the middle" : g < T0 - 4 ? "Properties on the right" : `Header · ${names[order[on]]}`;
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={0} active="Form Builder" chip={[2, part]}>
      <FBBuilder press={on >= 0 ? order[on] : undefined} palHl={g >= 30 && g < 92 ? FB_PAL[Math.min(10, Math.floor((g - 30) / 5))][0] : undefined} />
    </FStage>
  );
};

// ═══ f3 — rows + drag elements ══════════════════════════════════════════════
const SceneRowsFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const TI = 80, TE = 150, T1 = 236, TS = 300, DR = 44;
  const r2: FBRow = { cols: [g >= TI + DR ? [{ label: "Text Input", type: "Text Input", o: fi(g, TI + DR, 8) }] : [], g >= TE + DR ? [{ label: "Email", type: "Email", o: fi(g, TE + DR, 8) }] : []] };
  if (g >= TI + 16 && g < TI + DR) r2.dropCol = 0;
  if (g >= TE + 16 && g < TE + DR) r2.dropCol = 1;
  const r1: FBRow = { cols: [g >= TS + DR ? [{ label: "Select Dropdown", type: "Select Dropdown", o: fi(g, TS + DR, 8) }] : []], o: fi(g, T1 + 10, 8) };
  if (g >= TS + 16 && g < TS + DR) r1.dropCol = 0;
  const rows: FBRow[] = g >= 46 ? [r2, ...(g >= T1 + 10 ? [r1] : [])] : [];
  const BTN2 = { x: MX(ctr(FB_EMPTY_BTN(1)).x), y: MY(ctr(FB_EMPTY_BTN(1)).y) };
  const base: FBRow[] = [{ cols: [[], []] }];
  const withEl: FBRow[] = [{ cols: [[{ label: "", type: "" }], [{ label: "", type: "" }]] }];
  const ADD1 = { x: MX(ctr(fbAddRow(withEl, 0)).x), y: MY(ctr(fbAddRow(withEl, 0)).y) };
  const C0 = fbColPt(base, 0, 0), C1 = fbColPt(base, 0, 1);
  const R1C = fbColPt([withEl[0], { cols: [[]] }], 1, 0);
  const drag = g >= TI && g < TI + DR ? "Text Input" : g >= TE && g < TE + DR ? "Email" : g >= TS && g < TS + DR ? "Select Dropdown" : "";
  const cur = path(g, [[0, fbHdr("save").x, fbHdr("save").y + 40], [30, BTN2.x, BTN2.y], [44, BTN2.x, BTN2.y], [TI - 14, fbPalPt("Text Input").x, fbPalPt("Text Input").y], [TI, fbPalPt("Text Input").x, fbPalPt("Text Input").y], [TI + DR - 6, C0.x, C0.y], [TI + DR, C0.x, C0.y],
    [TE - 14, fbPalPt("Email").x, fbPalPt("Email").y], [TE, fbPalPt("Email").x, fbPalPt("Email").y], [TE + DR - 6, C1.x, C1.y], [TE + DR, C1.x, C1.y], [T1 - 16, ADD1.x, ADD1.y], [T1, ADD1.x, ADD1.y],
    [TS - 14, fbPalPt("Select Dropdown").x, fbPalPt("Select Dropdown").y], [TS, fbPalPt("Select Dropdown").x, fbPalPt("Select Dropdown").y], [TS + DR - 6, R1C.x, R1C.y], [TS + DR, R1C.x, R1C.y], [D, R1C.x + 120, R1C.y + 80]]);
  const keys: CamKey[] = [[0, fbHdr("exp").x, 120, 1.9], [26, BTN2.x + 60, BTN2.y - 60, 1.7], [50, MX(500), 330, 1.35], [D, MX(500), 380, 1.35]];
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 42), rip(g, T1 - 2))} grab={!!drag} active="Form Builder" chip={[3, g < 60 ? "2 Column Row" : g < T1 - 20 ? "Drag elements into the columns" : g < TS ? "Add 1 Column Row" : "Drop in a Select Dropdown"]}
      over={drag ? <Ghost x={cur.x} y={cur.y} label={drag} /> : undefined}>
      <FBBuilder rows={rows} palHl={drag || undefined} addRowPress={g >= 36 && g < 46 ? 1 : g >= T1 - 6 && g < T1 + 4 ? 0 : -1} />
    </FStage>
  );
};

// ═══ f4 — properties panel ═══════════════════════════════════════════════════
const SceneProps2FB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = tw(gt(f, dur, D), [[0, 0], [46, 38], [141, 80], [200, 160], [247, 240], [360, 360]]);
  const sel = g >= 40;
  const label = g < 80 ? "Text Input" : typed(g, 82, "Full name", 0.6) || " ";
  const ph = g < 160 ? "" : typed(g, 162, "Jane Doe", 0.6);
  const req = interpolate(g, [236, 244], [0, 1], cl);
  const el: FBEl = { label: label.trim() ? label : "", type: "Text Input", ph, req: req > 0.5, sel };
  const rows: FBRow[] = [{ cols: [[el], [{ label: "Email", type: "Email" }]] }, { cols: [[{ label: "Select Dropdown", type: "Select Dropdown" }]] }];
  const EL = fbElPt(rows, 0, 0, 0);
  const LBL = { x: MX(FB_PROPS.x + 150), y: MY(62 + 78 + 27 + 20) };
  const PH = { x: MX(FB_PROPS.x + 150), y: MY(62 + 156 + 27 + 20) };
  const cur = path(g, [[0, MX(700), MY(500)], [28, EL.x, EL.y + 20], [40, EL.x, EL.y + 20], [70, LBL.x, LBL.y], [140, LBL.x, LBL.y], [158, PH.x, PH.y], [214, PH.x, PH.y], [232, FB_REQ.x, FB_REQ.y], [244, FB_REQ.x, FB_REQ.y], [300, EL.x + 40, EL.y + 30], [D, EL.x + 40, EL.y + 30]]);
  const keys: CamKey[] = [[0, MX(500), 380, 1.35], [26, EL.x + 80, EL.y + 40, 1.7], [44, MX(1000), 300, 1.45], [230, MX(1000), 330, 1.45], [262, MX(860), 260, 1.5], [D, MX(860), 260, 1.5]];
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 240))} active="Form Builder" chip={[4, g < 60 ? "Click an element to select it" : g < 226 ? "Properties → Label · Placeholder" : "Required"]}>
      <FBBuilder rows={rows} selType={sel ? "Text Input" : undefined} props={sel ? <div style={{ opacity: fi(g, 40, 8) }}><FBProps label={label} ph={ph} req={req} gl={g >= 70 && g < 150 ? "label" : g >= 156 && g < 220 ? "ph" : undefined} /></div> : undefined} />
    </FStage>
  );
};

// ═══ f5 — Add Tab → search → Rating onto the new page ═══════════════════════
const RATING_PAL: [string, string][] = [["Rating", "Star rating input"]];
const SceneTabsFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = tw(gt(f, dur, D), [[0, 0], [94, 42], [176, 132], [224, 176], [282, 236], [360, 330]]);
  const two = g >= 136;
  const tabs = two ? ["Form Page 1", "Your visit"] : ["Form Page 1"];
  const BOX = { x: 544, y: 220, w: 512, h: 200 };
  const CREATE = { x: BOX.w - 24 - 110, y: BOX.h - 60, w: 110, h: 38 };
  const mo = g >= 46 && g < 140 ? Math.min(fi(g, 46, 8), fo(g, 132, 8)) : 0;
  const ADD = { x: MX(ctr(fbAddTabBtn(["Form Page 1"])).x), y: MY(ctr(fbAddTabBtn(["Form Page 1"])).y) };
  const CR = { x: BOX.x + ctr(CREATE).x, y: BOX.y + ctr(CREATE).y };
  const search = g < 176 ? "" : typed(g, 178, "rat", 0.25);
  const pal = search.length >= 3 ? RATING_PAL : search ? FB_PAL.filter((p) => p[0].toLowerCase().includes(search) || p[1].toLowerCase().includes(search)) : FB_PAL;
  const TR = 236, DR = 46;
  const dropped = g >= TR + DR;
  const rows: FBRow[] = !two ? [{ cols: [[{ label: "Full name", type: "Text Input", ph: "Jane Doe", req: true }], [{ label: "Email", type: "Email" }]] }, { cols: [[{ label: "Select Dropdown", type: "Select Dropdown" }]] }] : dropped ? [{ cols: [[{ label: "Rating", type: "Rating", o: fi(g, TR + DR, 8) }]] }] : [];
  const SEARCH = { x: MX(150), y: MY(62 + 44 + 18) };
  const RP = fbPalPt("Rating", RATING_PAL);
  const EMPTY = { x: MX(FB_CAN.x + FB_CAN.w / 2), y: MY(FB_CAN.top + 200) };
  const cur = path(g, [[0, MX(700), MY(500)], [30, ADD.x, ADD.y], [44, ADD.x, ADD.y], [70, BOX.x + 250, BOX.y + 100], [108, BOX.x + 250, BOX.y + 100], [120, CR.x, CR.y], [134, CR.x, CR.y], [166, SEARCH.x, SEARCH.y], [176, SEARCH.x, SEARCH.y], [TR - 14, RP.x, RP.y], [TR, RP.x, RP.y], [TR + DR - 6, EMPTY.x, EMPTY.y], [TR + DR, EMPTY.x, EMPTY.y], [D, EMPTY.x + 100, EMPTY.y + 60]]);
  const keys: CamKey[] = [[0, MX(500), 330, 1.3], [26, ADD.x, 160, 1.8], [50, 800, 330, 1.4], [136, 800, 330, 1.4], [160, MX(330), 300, 1.45], [D, MX(330), 330, 1.45]];
  const drag = g >= TR && g < TR + DR;
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 132), rip(g, 174))} grab={drag} active="Form Builder" chip={[5, g < 140 ? "Add Tab → name the page → Create Tab" : g < TR ? "Search elements…" : "Drop it to create a new row"]}
      over={<>
        <Modal box={BOX} title="Add New Tab" o={mo}>
          <MInput x={24} y={70} w={BOX.w - 48} value={typed(g, 72, "Your visit", 0.5)} ph="Tab title" glow={g >= 70 && g < 116} />
          <UB {...CREATE} fs={13.5} label="Create Tab" press={g >= 126 && g < 134} />
        </Modal>
        {drag && <Ghost x={cur.x} y={cur.y} label="Rating" />}
      </>}>
      <FBBuilder rows={rows} tabs={tabs} act={two ? 1 : 0} press={g >= 36 && g < 46 ? "tab" : undefined} search={search} pal={pal} palHl={drag ? "Rating" : undefined} emptyDrop={drag && g >= TR + 18} />
    </FStage>
  );
};

// ═══ f6 — Test ══════════════════════════════════════════════════════════════
const SceneTestFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [24, 36], [130, 162], [212, 188], [295, 282], [330, 330]]);
  const tabs = ["Form Page 1", "Your visit"];
  const rows: FBRow[] = [{ cols: [[{ label: "Rating", type: "Rating" }]] }];
  const BOX = { x: 400, y: 50, w: 800, h: 700 };
  const mo = g >= 40 ? fi(g, 40, 8) : 0;
  const SUB = { x: BOX.w - 24 - 130, y: BOX.h - 64, w: 130, h: 40 };
  const RES = { x: BOX.w - 24 - 130 - 10 - 90, y: BOX.h - 64, w: 90, h: 40 };
  const err = g >= 168 && g < 240;
  const nameV = g < 186 ? "" : typed(g, 188, "Jordan Lee", 0.6);
  const cur = path(g, [[0, MX(700), MY(500)], [26, fbHdr("test").x, fbHdr("test").y], [38, fbHdr("test").x, fbHdr("test").y], [90, BOX.x + 300, BOX.y + 300], [150, BOX.x + ctr(SUB).x, BOX.y + ctr(SUB).y], [164, BOX.x + ctr(SUB).x, BOX.y + ctr(SUB).y], [184, BOX.x + 300, BOX.y + 170], [222, BOX.x + 300, BOX.y + 170], [270, BOX.x + ctr(RES).x, BOX.y + ctr(RES).y], [286, BOX.x + ctr(RES).x, BOX.y + ctr(RES).y], [D, BOX.x + ctr(RES).x, BOX.y + ctr(RES).y + 30]]);
  const keys: CamKey[] = [[0, MX(500), 330, 1.3], [24, fbHdr("test").x, 150, 1.9], [44, 800, 420, 1.15], [130, 800, 420, 1.15], [150, 900, 560, 1.5], [176, 760, 300, 1.5], [240, 760, 330, 1.5], [262, 1000, 620, 1.6], [D, 1000, 620, 1.6]];
  const reset = g >= 282;
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 36), rip(g, 162), rip(g, 282))} active="Form Builder" chip={[6, g < 160 ? "Test — try the form before publishing" : g < 260 ? "Required fields are checked" : "Reset clears it"]}
      over={<Modal box={BOX} title="Test Form" sub="Test your form before publishing" o={mo}>
        <div style={{ position: "absolute", left: 24, top: 90, fontSize: 15, fontWeight: 800, color: INK }}>Form Page 1</div>
        <MInput x={24} y={120} w={360} label="Full name" req value={reset ? "" : nameV} ph="Jane Doe" glow={g >= 186 && g < 230} />
        {err && !nameV && <div style={{ position: "absolute", left: 24, top: 192, fontSize: 12.5, color: "#DC2626", fontWeight: 600 }}>Full name is required</div>}
        <MInput x={408} y={120} w={368} label="Email" value={reset || g < 196 ? "" : "jordan.lee@example.com"} ph="" />
        <MInput x={24} y={214} w={752} label="Select Dropdown" value="" ph="" select />
        <div style={{ position: "absolute", left: 24, top: 310, fontSize: 15, fontWeight: 800, color: INK }}>Your visit</div>
        <div style={{ position: "absolute", left: 24, top: 340, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Rating</div>
        <div style={{ position: "absolute", left: 24, top: 364, fontSize: 30, color: "#F59E0B", letterSpacing: 6 }}>{!reset && g >= 230 ? "★★★★★" : "☆☆☆☆☆"}</div>
        <UB {...RES} v="outline" label="Reset" press={g >= 278 && g < 288} />
        <UB {...SUB} label="Submit Form" press={g >= 156 && g < 166} />
        <UB x={24} y={BOX.h - 64} w={90} h={40} v="outline" label="Cancel" />
      </Modal>}>
      <FBBuilder rows={rows} tabs={tabs} act={1} press={g >= 30 && g < 42 ? "test" : undefined} />
    </FStage>
  );
};
// NOTE: the required-field message is drawn as plain text; the renderer validates required fields on submit.

// ═══ f7 — Save → Form Settings → Save Form ══════════════════════════════════
const SceneSaveFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [14, 36], [40, 66], [141, 150], [160, 182], [212, 204], [282, 226], [341, 248], [381, 360], [420, 392]]);
  const tabs = ["Form Page 1", "Your visit"];
  const rows: FBRow[] = [{ cols: [[{ label: "Rating", type: "Rating" }]] }];
  const BOX = { x: 520, y: 40, w: 560, h: 740 };
  const mo = g >= 40 && g < 372 ? Math.min(fi(g, 40, 8), fo(g, 364, 8)) : 0;
  const OPTS: [string, string][] = [["Collect Email", "Turn on only when submissions should require login. Leave off for public website embeds."], ["Limit Response", "Allow only one response per user"], ["Allow Editing", "Let users edit their responses"], ["Send Confirmation Email", "Email users after form submission"]];
  const optY = (i: number) => 300 + i * 78;
  const SAVEF = { x: BOX.w - 24 - 120, y: BOX.h - 62, w: 120, h: 40 };
  const sv = { x: BOX.x + ctr(SAVEF).x, y: BOX.y + ctr(SAVEF).y };
  const optPt = (i: number) => ({ x: BOX.x + 120, y: BOX.y + optY(i) + 26 });
  const cur = path(g, [[0, MX(700), MY(500)], [26, fbHdr("save").x, fbHdr("save").y], [38, fbHdr("save").x, fbHdr("save").y], [64, BOX.x + 260, BOX.y + 120], [126, BOX.x + 260, BOX.y + 120], [140, BOX.x + 260, BOX.y + 200], [170, BOX.x + 260, BOX.y + 200], [190, optPt(0).x, optPt(0).y], [214, optPt(1).x, optPt(1).y], [236, optPt(2).x, optPt(2).y], [258, optPt(3).x, optPt(3).y], [330, optPt(3).x, optPt(3).y + 20], [350, sv.x, sv.y], [364, sv.x, sv.y], [D, sv.x, sv.y + 40]]);
  const keys: CamKey[] = [[0, MX(500), 330, 1.3], [24, fbHdr("save").x - 80, 150, 1.9], [46, 800, 300, 1.45], [176, 800, 320, 1.45], [196, 800, 520, 1.45], [330, 800, 520, 1.45], [350, 900, 620, 1.5], [380, 800, 420, 1.2], [D, 800, 420, 1.2]];
  const hlOpt = g < 180 ? -1 : Math.min(3, Math.floor((g - 182) / 22));
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 36), rip(g, 360))} active="Form Builder" chip={[7, g < 176 ? "Save → Form Settings: name + status" : g < 340 ? "Form Options" : "Save Form"]}
      over={<>
        <Modal box={BOX} title="Form Settings" sub="Configure your form name and settings before saving." o={mo}>
          <MInput x={24} y={92} w={BOX.w - 48} label="Form Name" req value={typed(g, 66, "Campus Visit Feedback", 0.5)} ph="Enter form name" glow={g >= 64 && g < 132} />
          <MInput x={24} y={176} w={BOX.w - 48} label="Status" value={g >= 150 ? "Active" : ""} ph="Select status" select glow={g >= 138 && g < 172} />
          <div style={{ position: "absolute", left: 24, top: 262, fontSize: 15, fontWeight: 800, color: INK }}>Form Options</div>
          {OPTS.map(([t, d], i) => (
            <div key={t} style={{ position: "absolute", left: 24, top: optY(i), width: BOX.w - 48, height: 66, borderRadius: 10, border: `1px solid ${hlOpt === i ? "#A5B4FC" : LINE}`, background: hlOpt === i ? "#F5F7FF" : "#fff", boxSizing: "border-box", padding: "10px 14px" }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{t}</div>
              <div style={{ marginTop: 3, fontSize: 12, color: GRAY, width: 420, lineHeight: 1.3 }}>{d}</div>
              <div style={{ position: "absolute", right: 14, top: 20 }}><Toggle on={0} /></div>
            </div>
          ))}
          <UB x={SAVEF.x - 10 - 90} y={SAVEF.y} w={90} h={40} v="outline" label="Cancel" />
          <UB {...SAVEF} label={g >= 362 && g < 372 ? "Saving..." : "Save Form"} press={g >= 356 && g < 366} />
        </Modal>
        {g >= 372 && <Toast g={g} at={372} text="Form created successfully!" x={1100} y={150} />}
      </>}>
      <FBBuilder rows={rows} tabs={tabs} act={1} press={g >= 30 && g < 42 ? "save" : undefined} />
    </FStage>
  );
};

// ═══ f8 — copy link → public form → submitted ═══════════════════════════════
const SceneShareFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [141, 66], [201, 150], [246, 254], [282, 344], [420, 420]]);
  if (g < 150) {
    const rows: FormRowT[] = [{ name: "Campus Visit Feedback", id: "f-9e4b12", by: "Ava Reyes", subs: 0, status: "Active", date: "Oct 6, 2026", hl: true }, ...FORMS];
    const CP = flActPt(0, 0);
    const cur = path(g, [[0, 800, 500], [50, CP.x, CP.y], [70, CP.x, CP.y], [150, CP.x, CP.y]]);
    const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 820, 330, 1.3], [50, CP.x - 260, CP.y, 1.7], [150, CP.x - 260, CP.y, 1.7]];
    return (
      <FStage g={g} keys={keys} url={FB_URL_LIST} cur={cur} ripple={rip(g, 66)} active="Form Builder" chip={[8, "New form, Active → Copy Link"]}
        over={g >= 72 ? <Toast g={g} at={72} text="Link copied to clipboard!" x={1150} y={150} /> : undefined}>
        <FormsList rows={rows} actPress={g >= 62 && g < 74 ? [0, 0] : undefined} />
      </FStage>
    );
  }
  const h = g - 150;
  const page = h < 110 ? 0 : 1;
  const done = h >= 200;
  const NEXT = { x: 1100, y: 640 }, SUBMIT = { x: 1080, y: 640 };
  const cur = path(h, [[0, 900, 500], [24, 700, 300], [70, 700, 300], [96, NEXT.x, NEXT.y], [108, NEXT.x, NEXT.y], [140, 760, 330], [170, 820, 330], [186, SUBMIT.x, SUBMIT.y], [198, SUBMIT.x, SUBMIT.y], [270, 900, 600]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 800, 400, 1.3], [200, 800, 400, 1.3], [214, 800, 380, 1.2], [270, 800, 380, 1.2]];
  return (
    <FStage g={h} keys={keys} url="www.skillbnk.com/form/f-9e4b12" cur={cur} ripple={Math.max(rip(h, 104), rip(h, 194))} tag={{ n: 2, label: "Shared form link", url: "www.skillbnk.com" }} bg="#EEF2F6" chip={[9, done ? "Submitted — it lands in Responses" : "Anyone with the link can fill it in"]}>
      <div style={{ position: "absolute", left: 400, top: 60, width: 800, height: 660, background: "#fff", borderRadius: 16, boxShadow: "0 20px 50px #0001", border: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 40, top: 30 }}><BrightLogo /></div>
        <div style={{ position: "absolute", left: 40, top: 92, fontSize: 28, fontWeight: 900, color: INK }}>Campus Visit Feedback</div>
        {!done ? (page === 0 ? (<>
          <MInput x={40} y={150} w={340} label="Full name" req value={typed(h, 28, "Jordan Lee", 0.4)} ph="Jane Doe" glow={h >= 24 && h < 60} />
          <MInput x={410} y={150} w={350} label="Email" value={h >= 50 ? "jordan.lee@example.com" : ""} />
          <MInput x={40} y={240} w={720} label="Select Dropdown" value={h >= 66 ? "Option 2" : ""} ph="" select />
          <UB x={NEXT.x - 400 - 60} y={NEXT.y - 60 - 22} w={120} h={44} label="Next" press={h >= 100 && h < 110} />
        </>) : (<div style={{ opacity: fi(h, 110, 8) }}>
          <div style={{ position: "absolute", left: 40, top: 150, fontSize: 15, fontWeight: 700, color: "#374151" }}>Rating</div>
          <div style={{ position: "absolute", left: 40, top: 178, fontSize: 40, color: "#F59E0B", letterSpacing: 8 }}>{h >= 172 ? "★★★★★" : h >= 150 ? "★★★★☆" : "☆☆☆☆☆"}</div>
          <UB x={40} y={NEXT.y - 60 - 22} w={120} h={44} v="outline" label="Previous" />
          <UB x={SUBMIT.x - 400 - 70} y={SUBMIT.y - 60 - 22} w={140} h={44} label="Submit Form" press={h >= 190 && h < 200} />
        </div>)) : (
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: fi(h, 200, 10) }}>
            <div style={{ width: 84, height: 84, margin: "0 auto", borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(h, 200, fps)})` }}>✓</div>
            <div style={{ marginTop: 20, fontSize: 30, fontWeight: 900, color: INK }}>Thank You!</div>
            <div style={{ marginTop: 8, fontSize: 17, color: GRAY }}>Your form has been submitted successfully.</div>
          </div>
        )}
      </div>
    </FStage>
  );
};

// ═══ f9 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["▥", "Rows & columns", "Drag any element in"], ["⚙", "Properties", "Label · placeholder · Required"], ["🗂", "Pages", "Split long forms into tabs"], ["🧪", "Test", "Before you publish"], ["🔗", "Share", "One link, every response"]]} line={<>One builder. <span style={{ color: "#5EEAD4" }}>Every form.</span></>} />;
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  f0: SceneHookFB, f1: SceneListFB, f2: SceneLayoutFB, f3: SceneRowsFB, f4: SceneProps2FB, f5: SceneTabsFB, f6: SceneTestFB, f7: SceneSaveFB, f8: SceneShareFB, f9: SceneWrapFB,
};

export const FormBuilderVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "f9" ? TAIL : 0);
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
          <Audio src={staticFile(`formbuilder/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
