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
// ManageLocationsVideo — "Manage Multiple Locations" (sheet serial 20).
// Every label verified in the skillBNK code (see the header comment of the scenes part below).
// ALL names and data are FICTIONAL (Brightpath Academy). Built by _parts/build_forms.py.
// Voice: bash generate-voice-locations.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  m0: 433,
  m1: 315,
  m2: 341,
  m3: 271,
  m4: 304,
  m5: 292,
  m6: 302,
  m7: 124,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7"];

const PRE = ["m0"] as const; // hook, BEFORE the intro
const POST = ["m1", "m2", "m3", "m4", "m5", "m6", "m7"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { m0: 390, m1: 318, m2: 400, m3: 259, m4: 306, m5: 342, m6: 353, m7: 150 };
const PACE: Record<Key, number> = { m0: 1, m1: 1, m2: 1, m3: 1, m4: 1, m5: 1, m6: 1, m7: 1 };
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
// Ops series (sheet serials 20–22) — shared table / checkbox atoms (builds on forms_common).
// ═══════════════════════════════════════════════════════════════════════════
type TCol = [string, number];
const TBL_HEAD = 46;
const Tbl: React.FC<{ x: number; y: number; cols: TCol[]; rows: React.ReactNode[][]; rowH?: number; hlRow?: number; hlCol?: number; rowO?: number[] }> = ({ x, y, cols, rows, rowH = 52, hlRow = -1, hlCol = -1, rowO = [] }) => (
  <div style={{ position: "absolute", left: x, top: y, width: cols.reduce((a, c) => a + c[1], 0), background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
    <div style={{ display: "flex", height: TBL_HEAD, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, alignItems: "center" }}>{cols.map(([c, w], i) => <div key={c} style={{ width: w, padding: "0 12px", boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: hlCol === i ? BLUE : "#374151", background: hlCol === i ? BLUE_SOFT : "transparent", height: "100%", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{c}</div>)}</div>
    {rows.map((r, ri) => (
      <div key={ri} style={{ display: "flex", height: rowH, alignItems: "center", borderBottom: "1px solid #F1F2F4", background: hlRow === ri ? "#F5F7FF" : "#fff", opacity: rowO[ri] ?? 1 }}>
        {r.map((cell, ci) => <div key={ci} style={{ width: cols[ci][1], padding: "0 12px", boxSizing: "border-box", fontSize: 13.5, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cell}</div>)}
      </div>
    ))}
  </div>
);
/** centre of a table cell, in CONTENT coords (table drawn inside the company shell main area) */
const tblPt = (x: number, y: number, cols: TCol[], ci: number, ri: number, rowH = 52, dx = 0) => ({ x: MX(x + cols.slice(0, ci).reduce((a, c) => a + c[1], 0) + (dx || cols[ci][1] / 2)), y: MY(y + TBL_HEAD + ri * rowH + rowH / 2) });
const Pill: React.FC<{ t: string; tone?: "green" | "amber" | "red" | "gray" | "blue" }> = ({ t, tone = "gray" }) => {
  const m = { green: ["#DCFCE7", "#15803D"], amber: ["#FEF3C7", "#B45309"], red: ["#FEE2E2", "#B91C1C"], gray: ["#F3F4F6", "#374151"], blue: [BLUE_SOFT, BLUE] }[tone];
  return <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: m[0], color: m[1] }}>{t}</span>;
};
const Chk: React.FC<{ on: boolean }> = ({ on }) => <span style={{ width: 20, height: 20, borderRadius: 5, border: on ? "none" : "2px solid #9CA3AF", background: on ? BLUE : "#fff", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{on ? "✓" : ""}</span>;
const IcoBtn: React.FC<{ t: string; hl?: boolean; c?: string }> = ({ t, hl, c = BLUE }) => <span style={{ width: 32, height: 32, borderRadius: 8, background: c === BLUE ? BLUE_SOFT : c + "1A", color: c, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: hl ? "0 0 0 3px #A5B4FC" : "none" }}>{t}</span>;
const SearchBox: React.FC<{ x: number; y: number; w: number; ph: string; v?: string }> = ({ x, y, w, ph, v }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 40, borderRadius: 8, border: `1px solid ${v ? "#A5B4FC" : "#D1D5DB"}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: v ? INK : "#9CA3AF", boxSizing: "border-box" }}>⌕ {v || ph}</div>;
/** shared bits for bespoke hooks */
const HookLine: React.FC<{ g: number; at: number; top: number; size?: number; children: React.ReactNode; color?: string }> = ({ g, at, top, size = 62, children, color = "#F1F5F9" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontSize: size, fontWeight: 900, color, lineHeight: 1.1, padding: "0 120px", opacity: fi(g, at, 8), transform: `translateY(${(1 - fi(g, at, 8)) * 24}px)` }}>{children}</div>
);
const SbBadge: React.FC<{ g: number; at: number; x: number; y: number }> = ({ g, at, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "#0F766E33", border: "1px solid #5EEAD488", opacity: fi(g, at, 8) }}><Img src={staticFile("skillbnk-logo.png")} style={{ height: 30 }} /><span style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4" }}>does it differently</span></div>
);

// ═══════════════════════════════════════════════════════════════════════════
// Manage Multiple Locations — scenes (sheet serial 20). Real UI (SB-Company AllBranches/*):
//  "All Branches" · "All branches information are available here." · Add New Branch · "Enter Branch Name..." ·
//  columns Branch Name / Slug / Short Name / Branch URL / Created By / Status / Creation Date / Last Updated /
//  Action (👁 View branch details · history). Status Approved / Pending / Rejected; new branches default Pending.
//  "Create New Branch" · "To create a new branch fill out the form below" · stepper Branch Info / Contact Person 1 /
//  Contact Person 2 / About & Social / Documents · Branch Information (Branch Name*, Branch URL, Phone Number*,
//  Fax Number*, Tax Number*) · Address Information (Street*, City*, State*, Postal Code*, Country*) ·
//  Primary / Secondary Contact Person (Full Name*, Email Address*, Phone Number*) · About & Social Media
//  (About Branch, Social Media Links: Facebook, Twitter, LinkedIn, Instagram, GitHub) · Documents (Branch Logo,
//  Business Document, Other Document) · Previous / Next / Create Branch · toast "Branch created successfully".
//  BranchDetails: Back · Refresh · "Branch information, students, and transaction summary." · Approved Students ·
//  Transactions · Transaction Amount · Monthly Transactions ("Last 12 months transaction count and amount.") ·
//  Branch Information (Branch Name, Slug, Created By, Created At, Last Updated) · Contact Details
//  (Contact Name, Email, Phone, Address).  Voice says "locations"; on-screen UI labels keep "Branch".
// ═══════════════════════════════════════════════════════════════════════════
type BrRow = { name: string; slug: string; url: string; by: string; st: "Approved" | "Pending" | "Rejected"; c: string; u: string };
const BRS: BrRow[] = [
  { name: "Brightpath — Downtown", slug: "downtown", url: "learnbrightpath.com/downtown", by: "Ava Reyes", st: "Approved", c: "Jan 12, 2026", u: "Sep 30, 2026" },
  { name: "Brightpath — Eastside", slug: "eastside", url: "learnbrightpath.com/eastside", by: "Ava Reyes", st: "Approved", c: "Mar 4, 2026", u: "Sep 28, 2026" },
  { name: "Brightpath — Northgate", slug: "northgate", url: "learnbrightpath.com/northgate", by: "Liam Chen", st: "Approved", c: "May 19, 2026", u: "Oct 2, 2026" },
  { name: "Brightpath — Lakeview", slug: "lakeview", url: "learnbrightpath.com/lakeview", by: "Liam Chen", st: "Pending", c: "Sep 22, 2026", u: "Sep 22, 2026" },
];
const NEW_BR: BrRow = { name: "Brightpath — Riverside", slug: "riverside", url: "learnbrightpath.com/riverside", by: "Ava Reyes", st: "Pending", c: "Oct 7, 2026", u: "Oct 7, 2026" };
const BR_COLS: TCol[] = [["Branch Name", 250], ["Slug / Short Name", 160], ["Branch URL", 270], ["Created By", 140], ["Status", 110], ["Creation Date", 130], ["Last Updated", 130], ["Action", 112]];
const BR_T = { x: 24, y: 160 };
const BR_ADD = { x: 1350 - 24 - 180, y: 22, w: 180, h: 40 };
const BR_URL = "company.skillbnk.com/branch-management";
const brCells = (r: BrRow, eyeHl = false): React.ReactNode[] => [<b style={{ color: BLUE }}>{r.name}</b>, <span style={{ fontFamily: "monospace", color: GRAY }}>{r.slug}</span>, <span style={{ color: "#374151" }}>{r.url}</span>, r.by, <Pill t={r.st} tone={r.st === "Approved" ? "green" : r.st === "Pending" ? "amber" : "red"} />, r.c, r.u, <span style={{ display: "flex", gap: 6 }}><IcoBtn t="👁" hl={eyeHl} /><IcoBtn t="🕘" c="#7C3AED" /></span>];
const BrList: React.FC<{ rows: BrRow[]; hlCol?: number; hlRow?: number; press?: boolean; eye?: number; rowO?: number[] }> = ({ rows, hlCol, hlRow, press, eye = -1, rowO }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="All Branches" sub="All branches information are available here." x={24} y={16} />
    <UB {...BR_ADD} label="Add New Branch" icon="＋" press={press} />
    <SearchBox x={24} y={96} w={340} ph="Enter Branch Name..." />
    <Tbl x={BR_T.x} y={BR_T.y} cols={BR_COLS} rows={rows.map((r, i) => brCells(r, eye === i))} hlCol={hlCol} hlRow={hlRow} rowO={rowO} />
  </div>
);
const BR_STEPS = ["Branch Info", "Contact Person 1", "Contact Person 2", "About & Social", "Documents"];
const BrStepper: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ position: "absolute", left: 175, top: 96, width: 1000, height: 70 }}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 23, height: 2, background: LINE }} />
    <div style={{ position: "absolute", left: 24, top: 23, height: 2, width: (952 * s) / 4, background: BLUE }} />
    {BR_STEPS.map((t, i) => <div key={t} style={{ position: "absolute", left: i * 238, top: 0, width: 48, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: i <= s ? BLUE : "#fff", border: `2px solid ${i <= s ? BLUE : "#D1D5DB"}`, color: i <= s ? "#fff" : GRAY, fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>{i < s ? "✓" : i + 1}</div>
      <div style={{ position: "absolute", left: -60, width: 168, top: 54, fontSize: 13, fontWeight: 700, color: i <= s ? INK : GRAY }}>{t}</div>
    </div>)}
  </div>
);
const BR_NEXT = { x: 1350 - 24 - 120, y: 730, w: 120, h: 42 };
const BR_PREV = { x: 24, y: 730, w: 120, h: 42 };
const BrFormShell: React.FC<{ s: number; children: React.ReactNode; press?: boolean; last?: boolean }> = ({ s, children, press, last }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="Create New Branch" sub="To create a new branch fill out the form below" back x={24} y={16} />
    <BrStepper s={s} />
    <div style={{ position: "absolute", left: 24, top: 200, width: 1302, height: 510, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>{children}</div>
    {s > 0 && <UB {...BR_PREV} v="outline" label="← Previous" />}
    <UB {...(last ? { ...BR_NEXT, x: BR_NEXT.x - 40, w: 160 } : BR_NEXT)} label={last ? "Create Branch" : "Next →"} press={press} />
  </div>
);
const brNextPt = (last = false) => ({ x: MX(last ? BR_NEXT.x - 40 + 80 : BR_NEXT.x + 60), y: MY(BR_NEXT.y + 21) });
/** form field inside the white card (card-local coords) */
const BF: React.FC<{ x: number; y: number; w: number; l: string; v: string; ph?: string; req?: boolean; glow?: boolean; h?: number; select?: boolean }> = (p) => <MInput x={p.x} y={p.y} w={p.w} label={p.l} value={p.v} ph={p.ph} req={p.req} glow={p.glow} h={p.h} select={p.select} />;
const bfPt = (x: number, y: number, w: number) => ({ x: MX(24 + x + w / 2), y: MY(200 + y + 47) });

// ═══ m0 — HOOK ═════════════════════════════════════════════════════════════
const SceneHookBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 190, B3 = 305;
  const pins: [number, number, string][] = [[520, 520, "Downtown"], [820, 380, "Eastside"], [1120, 600, "Northgate"], [1400, 430, "Riverside"]];
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <HookLine g={g} at={2} top={90} size={58}>Four locations. <span style={{ color: "#F87171" }}>Four spreadsheets.</span></HookLine>
          <HookLine g={g} at={34} top={170} size={40} color="#FCA5A5">Zero idea which one is losing students.</HookLine>
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>{pins.map(([x, y], i) => i > 0 && <line key={i} x1={pins[0][0]} y1={pins[0][1]} x2={x} y2={y} stroke="#F8717155" strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={-g * 2} opacity={fi(g, 20 + i * 10, 10)} />)}</svg>
          {pins.map(([x, y, n], i) => { const p = sp(g, 14 + i * 12, fps, { damping: 10 }); const q = fi(g, 60 + i * 12, 8); return <div key={n} style={{ position: "absolute", left: x - 90, top: y - 40, width: 180, textAlign: "center", opacity: p, transform: `scale(${0.5 + 0.5 * p})` }}>
            <div style={{ width: 64, height: 64, margin: "0 auto", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: q > 0.5 ? "#7F1D1D" : "#1E293B", border: "3px solid #F87171", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ transform: "rotate(45deg)", fontSize: 30, color: "#FECACA", fontWeight: 900 }}>{q > 0.5 ? "?" : "📍"}</span></div>
            <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, color: "#E2E8F0" }}>{n}</div>
            <div style={{ marginTop: 6, fontSize: 17, color: "#FCA5A5", opacity: q }}>📊 sheet_v{i + 3}_FINAL.xlsx</div>
          </div>; })}
          <div style={{ position: "absolute", left: 120, top: 820, display: "flex", gap: 14, alignItems: "center", opacity: fi(g, 96, 8) }}><span style={{ fontSize: 44 }}>☎️</span><span style={{ fontSize: 28, fontWeight: 800, color: "#FECACA" }}>Head office: “Can someone send me this month's numbers?”</span></div>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <HookLine g={g} at={B2} top={110} size={46} color="#CBD5E1">With most LMS platforms, every location is <span style={{ color: "#FCA5A5" }}>its own island</span>.</HookLine>
          {pins.map(([, , n], i) => <div key={n} style={{ position: "absolute", left: 200 + i * 400, top: 330, width: 320, height: 420, borderRadius: 20, background: "#111827", border: "2px solid #334155", opacity: fi(g, B2 + 8 + i * 8, 8), transform: `rotate(${(i - 1.5) * 2}deg)` }}>
            <div style={{ padding: 20, fontSize: 15, fontWeight: 800, color: "#64748B", letterSpacing: 2 }}>LOGIN</div>
            <div style={{ margin: "0 20px", height: 40, borderRadius: 8, background: "#1E293B" }} /><div style={{ margin: "14px 20px", height: 40, borderRadius: 8, background: "#1E293B" }} />
            <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 800, color: "#94A3B8" }}>{n}<br /><span style={{ fontSize: 15, color: "#F87171" }}>separate account</span></div>
          </div>)}
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={150} />
          <div style={{ position: "absolute", left: 110, top: 230, width: 760, fontSize: 70, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>One head office.<br /><span style={{ color: "#5EEAD4" }}>Every location, live.</span></div>
          {(() => { const P = [[1120, 270], [1640, 270], [1120, 800], [1640, 800]]; return <>
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>{P.map(([x, y], i) => <line key={i} x1={1380} y1={535} x2={x} y2={y} stroke="#5EEAD4" strokeWidth={4} opacity={fi(g, B3 + 20 + i * 8, 8)} />)}</svg>
            <div style={{ position: "absolute", left: 1270, top: 490, width: 220, height: 90, borderRadius: 18, background: "#0F766E", color: "#fff", fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px #14B8A6aa", opacity: fi(g, B3 + 12, 8) }}>HEAD OFFICE</div>
            {pins.map(([, , n], i) => <div key={n} style={{ position: "absolute", left: P[i][0] - 150, top: P[i][1] - 80, width: 300, padding: "18px 20px", borderRadius: 18, background: "#fff", boxShadow: "0 24px 50px #0009", opacity: sp(g, B3 + 24 + i * 8, fps), boxSizing: "border-box" }}><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>{n}</div><div style={{ marginTop: 6, fontSize: 19, color: GRAY }}>🎓 {[128, 96, 74, 0][i]} students · 💵 ${[184, 131, 97, 0][i]}k</div><div style={{ marginTop: 8 }}><Pill t={i === 3 ? "Pending" : "Approved"} tone={i === 3 ? "amber" : "green"} /></div></div>)}
          </>; })()}
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ m1 — Branch Management → All Branches ══════════════════════════════════
const SceneListBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = menuPt("Branch Management");
  const colAt = (i: number) => tblPt(BR_T.x, BR_T.y, BR_COLS, i, -1, 52).x;
  const hy = MY(BR_T.y + 23);
  const order = [0, 1, 2, 3, 4];
  const T0 = 120, ST = 34;
  const hl = g < T0 - 6 ? -1 : g < T0 + order.length * ST ? order[Math.min(4, Math.floor((g - T0 + 6) / ST))] : -1;
  const pts: P3[] = [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [100, colAt(0), hy]];
  order.forEach((c, i) => pts.push([T0 + i * ST, colAt(c), hy], [T0 + i * ST + 20, colAt(c), hy + 120]));
  pts.push([D, colAt(4), hy + 200]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 330, 1.9], [66, 300, 330, 1.9], [104, MX(420), 330, 1.5], [200, MX(620), 330, 1.5], [290, MX(780), 330, 1.5], [D, MX(780), 330, 1.5]];
  const names = ["Branch Name", "Slug / Short Name", "Branch URL", "Created By", "Status"];
  return (
    <FStage g={g} keys={keys} url={opened ? BR_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={rip(g, 66)} active={opened ? "Branch Management" : "Dashboard"} chip={[1, !opened ? "Company portal → Branch Management" : hl >= 0 ? `All Branches · ${names[hl]}` : "Every location, one list"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <BrList rows={BRS} hlCol={hl} />}
    </FStage>
  );
};

// ═══ m2 — Add New Branch → Branch Info (+ address) ═══════════════════════════
const SceneInfoBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const form = g >= 46;
  const ADD = { x: MX(ctr(BR_ADD).x), y: MY(ctr(BR_ADD).y) };
  const F = [
    { x: 24, y: 56, w: 610, l: "Branch Name", v: "Brightpath — Riverside", req: true, a: 60, cps: 0.6 },
    { x: 668, y: 56, w: 610, l: "Branch URL", v: "learnbrightpath.com/riverside", a: 104, cps: 0.9 },
    { x: 24, y: 142, w: 400, l: "Phone Number", v: "(555) 014-7720", req: true, a: 140, cps: 0.9 },
    { x: 446, y: 142, w: 400, l: "Fax Number", v: "(555) 014-7721", req: true, a: 160, cps: 1.2 },
    { x: 868, y: 142, w: 410, l: "Tax Number", v: "TX-48-2210", req: true, a: 176, cps: 1.2 },
    { x: 24, y: 296, w: 610, l: "Street", v: "410 River Road", req: true, a: 210, cps: 0.9 },
    { x: 668, y: 296, w: 300, l: "City", v: "Austin", req: true, a: 236, cps: 0.9 },
    { x: 990, y: 296, w: 288, l: "State", v: "TX", req: true, a: 252, cps: 0.9 },
    { x: 24, y: 382, w: 300, l: "Postal Code", v: "78701", req: true, a: 266, cps: 0.9 },
    { x: 346, y: 382, w: 300, l: "Country", v: "United States", req: true, a: 282, cps: 1, sel: true },
  ];
  const pts: P3[] = [[0, 800, 500], [30, ADD.x, ADD.y], [44, ADD.x, ADD.y]];
  F.forEach((q) => { const p = bfPt(q.x, q.y, q.w); pts.push([q.a - 4, p.x, p.y], [q.a + 8, p.x, p.y]); });
  const NX = brNextPt();
  pts.push([340, NX.x, NX.y], [356, NX.x, NX.y], [D, NX.x, NX.y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, ADD.x - 140, 140, 1.9], [48, 820, 330, 1.25], [64, MX(500), 320, 1.55], [130, MX(800), 330, 1.45], [196, MX(500), 480, 1.5], [300, MX(500), 520, 1.5], [330, NX.x - 200, NX.y - 40, 1.6], [D, NX.x - 200, NX.y - 40, 1.6]];
  return (
    <FStage g={g} keys={keys} url={form ? `${BR_URL}/subBranchform` : BR_URL} cur={cur} ripple={Math.max(rip(g, 40), rip(g, 352))} active="Branch Management" chip={[2, !form ? "Add New Branch" : g < 200 ? "Step 1 · Branch Information" : g < 330 ? "Step 1 · Address Information" : "Next"]}>
      {!form ? <BrList rows={BRS} press={g >= 34 && g < 46} /> : (
        <BrFormShell s={0} press={g >= 346 && g < 356}>
          <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>Branch Information <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Enter the basic details about your branch</span></div>
          <div style={{ position: "absolute", left: 24, top: 252, fontSize: 15, fontWeight: 800, color: INK }}>Address Information</div>
          {F.map((q) => <BF key={q.l} x={q.x} y={q.y} w={q.w} l={q.l} req={q.req} select={q.sel} v={typed(g, q.a, q.v, q.cps)} glow={g >= q.a - 4 && g < q.a + q.v.length / q.cps + 4} />)}
        </BrFormShell>
      )}
    </FStage>
  );
};

// ═══ m3 — Contact Person 1 + 2 ══════════════════════════════════════════════
const SceneContactBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const s = g < 160 ? 1 : 2;
  const P = s === 1 ? [["Full Name", "Nora Patel"], ["Email Address", "nora.patel@example.com"], ["Phone Number", "(555) 014-7730"]] : [["Full Name", "Marcus Hill"], ["Email Address", "marcus.hill@example.com"], ["Phone Number", "(555) 014-7731"]];
  const a0 = s === 1 ? 20 : 176;
  const fx = [24, 450, 876];
  const NX = brNextPt();
  const pts: P3[] = [[0, NX.x, NX.y]];
  [20, 176].forEach((base, k) => { fx.forEach((x, i) => { const p = bfPt(x, 56, 400); pts.push([base + i * 36 - 4, p.x, p.y], [base + i * 36 + 20, p.x, p.y]); }); if (k === 0) pts.push([142, NX.x, NX.y], [156, NX.x, NX.y]); });
  pts.push([300, NX.x, NX.y], [314, NX.x, NX.y], [D, NX.x, NX.y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, NX.x - 200, NX.y - 40, 1.6], [16, MX(650), 300, 1.35], [130, MX(650), 300, 1.35], [146, NX.x - 200, NX.y - 40, 1.6], [166, MX(650), 300, 1.35], [290, MX(650), 300, 1.35], [306, NX.x - 200, NX.y - 40, 1.6], [D, NX.x - 200, NX.y - 40, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${BR_URL}/subBranchform`} cur={cur} ripple={Math.max(rip(g, 152), rip(g, 310))} active="Branch Management" chip={[3, s === 1 ? "Step 2 · Primary Contact Person" : "Step 3 · Secondary Contact Person"]}>
      <BrFormShell s={s} press={(g >= 146 && g < 156) || (g >= 304 && g < 314)}>
        <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>{s === 1 ? "Primary Contact Person" : "Secondary Contact Person"} <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Enter details for the {s === 1 ? "primary" : "secondary"} contact person</span></div>
        {P.map(([l, v], i) => <BF key={s + l} x={fx[i]} y={56} w={400} l={l} req v={typed(g, a0 + i * 36, v, 1.1)} glow={g >= a0 + i * 36 - 4 && g < a0 + i * 36 + 26} />)}
      </BrFormShell>
    </FStage>
  );
};

// ═══ m4 — About & Social → Documents → Create Branch ════════════════════════
const SceneDocsBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const s = g < 170 ? 3 : 4;
  const NX = brNextPt(), CR = brNextPt(true);
  const ABOUT = bfPt(24, 56, 1254);
  const SOC = ["Facebook", "Twitter", "LinkedIn", "Instagram", "GitHub"];
  const socPt = (i: number) => ({ x: MX(24 + 24 + (i % 3) * 418 + 200), y: MY(200 + 240 + Math.floor(i / 3) * 70 + 20) });
  const up = (i: number) => g >= [212, 252, 9999][i];
  const docPt = (i: number) => ({ x: MX(24 + 24 + i * 418 + 200), y: MY(200 + 150) });
  const cur = path(g, [[0, NX.x, NX.y], [24, ABOUT.x, ABOUT.y + 10], [80, ABOUT.x, ABOUT.y + 10], [96, socPt(0).x, socPt(0).y], [126, socPt(2).x, socPt(2).y], [150, NX.x, NX.y], [164, NX.x, NX.y], [196, docPt(0).x, docPt(0).y], [210, docPt(0).x, docPt(0).y], [236, docPt(1).x, docPt(1).y], [250, docPt(1).x, docPt(1).y], [300, CR.x, CR.y], [316, CR.x, CR.y], [D, CR.x, CR.y]]);
  const keys: CamKey[] = [[0, NX.x - 200, NX.y - 40, 1.6], [20, MX(650), 330, 1.35], [150, MX(650), 360, 1.35], [170, MX(650), 330, 1.35], [280, MX(650), 330, 1.35], [300, CR.x - 200, CR.y - 40, 1.6], [330, 800, 420, 1.15], [D, 800, 420, 1.15]];
  return (
    <FStage g={g} keys={keys} url={`${BR_URL}/subBranchform`} cur={cur} ripple={Math.max(rip(g, 160), rip(g, 208), rip(g, 248), rip(g, 312))} active="Branch Management" chip={[4, s === 3 ? "Step 4 · About & Social Media" : g < 300 ? "Step 5 · Logo and documents" : "Create Branch"]}
      over={g >= 318 ? <Toast g={g} at={318} text="Branch created successfully" x={1100} y={66} /> : undefined}>
      <BrFormShell s={s} last={s === 4} press={(g >= 154 && g < 164) || (g >= 308 && g < 318)}>
        {s === 3 ? (<>
          <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>About & Social Media <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Tell us about your branch and connect your social media</span></div>
          <BF x={24} y={56} w={1254} h={110} l="About Branch" v={typed(g, 28, "Our Riverside campus offers evening Medical Assistant and Pharmacy Technician cohorts, five minutes from the River Road station.", 2.2)} ph="Describe your branch, its mission, and services..." glow={g >= 24 && g < 88} />
          <div style={{ position: "absolute", left: 24, top: 206, fontSize: 15, fontWeight: 800, color: INK }}>Social Media Links</div>
          {SOC.map((n, i) => <MInput key={n} x={24 + (i % 3) * 418} y={240 + Math.floor(i / 3) * 70} w={400} value={i === 0 && g >= 100 ? "facebook.com/brightpathriverside" : i === 2 && g >= 128 ? "linkedin.com/company/brightpath" : ""} ph={`${n} · https://example.com`} glow={(i === 0 && g >= 94 && g < 112) || (i === 2 && g >= 122 && g < 140)} />)}
        </>) : (<>
          <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>Documents <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Upload your branch logo and required documents</span></div>
          {["Branch Logo", "Business Document", "Other Document"].map((n, i) => (
            <div key={n} style={{ position: "absolute", left: 24 + i * 418, top: 60, width: 400 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{n}</div>
              <div style={{ marginTop: 8, height: 170, borderRadius: 12, border: `1.5px dashed ${up(i) ? "#86EFAC" : "#CBD5E1"}`, background: up(i) ? "#F0FDF4" : "#FAFBFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {up(i) ? (i === 0 ? <BrightLogo /> : <><span style={{ fontSize: 34 }}>📄</span><span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>riverside-business-license.pdf</span></>) : <><span style={{ fontSize: 28, color: "#9CA3AF" }}>⤒</span><span style={{ fontSize: 12.5, color: GRAY, textAlign: "center", padding: "0 20px" }}>{["Upload your branch logo (JPG, PNG)", "Upload business document (PDF, DOC, JPG, PNG)", "Upload additional document (PDF, DOC, JPG, PNG)"][i]}</span></>}
              </div>
            </div>
          ))}
        </>)}
      </BrFormShell>
    </FStage>
  );
};

// ═══ m5 — new location in the list (Pending) → View branch details ═════════
const SceneNewBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const rows = [NEW_BR, ...BRS];
  const ST = tblPt(BR_T.x, BR_T.y, BR_COLS, 4, 0);
  const EYE = tblPt(BR_T.x, BR_T.y, BR_COLS, 7, 1, 52, 28);
  const cur = path(g, [[0, 900, 500], [40, ST.x, ST.y], [120, ST.x, ST.y], [150, ST.x, ST.y + 52], [190, ST.x, ST.y + 52], [240, EYE.x, EYE.y], [258, EYE.x, EYE.y], [D, EYE.x, EYE.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MX(500), 260, 1.6], [120, MX(700), 260, 1.6], [200, MX(900), 280, 1.55], [D, MX(900), 280, 1.55]];
  return (
    <FStage g={g} keys={keys} url={BR_URL} cur={cur} ripple={rip(g, 254)} active="Branch Management" chip={[5, g < 140 ? "New location added as Pending" : g < 220 ? "Approved locations are live" : "👁 View branch details"]}>
      <BrList rows={rows} hlRow={g < 140 ? 0 : g < 220 ? 1 : 1} rowO={[fi(g, 4, 10)]} eye={g >= 248 && g < 262 ? 1 : -1} />
    </FStage>
  );
};

// ═══ m6 — branch details ══════════════════════════════════════════════════════
const SceneDetailBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const r = BRS[0];
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const vals = [18, 22, 31, 27, 35, 38, 33, 41, 46, 44, 52, 57];
  const grow = interpolate(g, [150, 220], [0, 1], { ...cl, easing: EZ });
  const stats: [string, string, string][] = [["Approved Students", "128", "🎓"], ["Transactions", "412", "🧾"], ["Transaction Amount", "$184,260", "💵"]];
  const cur = path(g, [[0, 900, 500], [40, MX(200), MY(150)], [130, MX(1100), MY(150)], [160, MX(300), MY(380)], [240, MX(800), MY(330)], [280, MX(180), MY(610)], [340, MX(180), MY(720)], [370, MX(900), MY(610)], [D, MX(900), MY(720)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(660), 190, 1.5], [130, MX(660), 190, 1.5], [160, MX(500), 360, 1.45], [250, MX(500), 380, 1.45], [280, MX(400), 650, 1.5], [350, MX(900), 650, 1.5], [D, MX(900), 650, 1.5]];
  return (
    <FStage g={g} keys={keys} url={`${BR_URL}/details/subbranchdetails-downtown`} cur={cur} ripple={0} active="Branch Management" chip={[6, g < 140 ? "Students and transactions for this location" : g < 270 ? "Monthly Transactions · last 12 months" : "Branch Information · Contact Details"]}>
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 24, top: 18, display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 15, fontWeight: 700, color: BLUE }}>← Back</span><span style={{ fontSize: 24, fontWeight: 800, color: INK }}>{r.name}</span><Pill t="approved" tone="green" /></div>
        <div style={{ position: "absolute", left: 24, top: 54, fontSize: 14, color: GRAY }}>Branch information, students, and transaction summary.</div>
        <UB x={1350 - 24 - 110} y={18} w={110} h={38} v="outline" label="Refresh" icon="↻" fs={13.5} />
        <UB x={1350 - 24 - 110 - 10 - 140} y={18} w={140} h={38} v="outline" label="Branch Login" icon="↗" fs={13.5} />
        {stats.map(([t, v, ic], i) => <div key={t} style={{ position: "absolute", left: 24 + i * 438, top: 92, width: 426, height: 104, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "16px 20px", boxSizing: "border-box", opacity: fi(g, 20 + i * 14, 8) }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: GRAY }}>{t}<span style={{ fontSize: 22 }}>{ic}</span></div><div style={{ marginTop: 6, fontSize: 32, fontWeight: 900, color: INK }}>{v}</div></div>)}
        <div style={{ position: "absolute", left: 24, top: 212, width: 1302, height: 310, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
          <div style={{ position: "absolute", left: 20, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>Monthly Transactions</div>
          <div style={{ position: "absolute", left: 20, top: 42, fontSize: 13, color: GRAY }}>Last 12 months transaction count and amount.</div>
          {vals.map((v, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 102, bottom: 40, width: 56, height: v * 3.6 * grow, borderRadius: "6px 6px 0 0", background: i === 11 ? BLUE : "#93C5FD" }} />)}
          {months.map((m, i) => <div key={m} style={{ position: "absolute", left: 60 + i * 102, bottom: 14, width: 56, textAlign: "center", fontSize: 12, color: GRAY }}>{m}</div>)}
        </div>
        {[["Branch Information", [["Branch Name", r.name], ["Slug", r.slug], ["Created By", r.by], ["Created At", r.c], ["Last Updated", r.u]]], ["Contact Details", [["Contact Name", "Grace Okafor"], ["Email", "downtown@learnbrightpath.com"], ["Phone", "(555) 014-6610"], ["Address", "88 Main Street, Austin, TX 78701"]]]].map(([t, rows]: any, k) => (
          <div key={t} style={{ position: "absolute", left: 24 + k * 658, top: 538, width: 644, height: 250, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, opacity: fi(g, 270 + k * 40, 10) }}>
            <div style={{ position: "absolute", left: 20, top: 14, fontSize: 16, fontWeight: 800, color: INK }}>{t}</div>
            {rows.map(([a, b]: string[], i: number) => <div key={a} style={{ position: "absolute", left: 20, right: 20, top: 48 + i * 38, display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ color: GRAY, fontWeight: 600 }}>{a}</span><span style={{ color: INK, fontWeight: 700 }}>{b}</span></div>)}
          </div>
        ))}
      </div>
    </FStage>
  );
};

// ═══ m7 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["🏢", "All locations", "One list, every status"], ["🪜", "5 steps", "Add a location"], ["👥", "Contacts", "Two per location"], ["📈", "Insights", "Students & transactions"]]} line={<>One head office. <span style={{ color: "#5EEAD4" }}>Every location.</span></>} />;
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  m0: SceneHookBR, m1: SceneListBR, m2: SceneInfoBR, m3: SceneContactBR, m4: SceneDocsBR, m5: SceneNewBR, m6: SceneDetailBR, m7: SceneWrapBR,
};

export const ManageLocationsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "m7" ? TAIL : 0);
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
          <Audio src={staticFile(`locations/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
