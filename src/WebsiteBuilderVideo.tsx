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
// WebsiteBuilderVideo — "Website Builder" (sheet serial 16).
// Every screen verified in the skillBNK code (claude/website-builder-video.md): editor header
//   (AI · Library · Settings · Page SEO · Export · Import · Preview · Save draft · Publish changes · Live),
//   Pages panel (Global Navbar/Footer, Custom/Default pages, Add page), Design library (Components /
//   Pages, "Use page", "Add block"), drag-and-drop components, block fields + style, Build with AI
//   (Section / Full page / Import HTML), Desktop/Tablet/Mobile, Page SEO, Save draft → Publish.
// ALL names and data are FICTIONAL (Brightpath Academy).
// Voice: bash generate-voice-websitebuilder.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-mock.py (plain object, no type).
const DURATIONS = {
  b0: 230,
  b1: 300,
  b2: 330,
  b3: 420,
  b4: 400,
  b5: 330,
  b6: 420,
  b7: 230,
  b8: 320,
  b9: 330,
  b10: 260,
};

// Clips that have real audio files (auto-patched by the generator). Scenes
// whose clip isn't generated yet still play — silently — so Studio never errors.
const VOICED: string[] = [];

const PRE = ["b0"] as const; // hook, BEFORE the intro
const POST = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"] as const;
type Key = (typeof PRE)[number] | (typeof POST)[number];
const ALL: Key[] = [...PRE, ...POST];
const TAIL = 30;

// PACING: every scene is choreographed on a design length (DESIGN) and stretched
// to its real length. A scene lasts at least DESIGN × PACE, so clicks and typing
// never run faster than designed (same rule as PortalsVideo, PACE 1.05).
const DESIGN: Record<Key, number> = { b0: 230, b1: 300, b2: 330, b3: 420, b4: 400, b5: 330, b6: 420, b7: 230, b8: 320, b9: 330, b10: 260 };
const PACE: Record<Key, number> = { b0: 1, b1: 1, b2: 1, b3: 1, b4: 1, b5: 1, b6: 1, b7: 1, b8: 1, b9: 1, b10: 1 };
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
// Custom Domain — scenes (sheet serial 15). Real UI: SB-Company website-builder/page.tsx
//   card "⚙ Set up" → GlobalModal "Domain setup" (+ domain status badge):
//   "Connect a main custom domain. SkillBNK creates landing, learner, branch, and company
//    hostnames and tracks each one separately." · Free SkillBNK domains · input "customer.com"
//   · DNS instructions rows [Landing CNAME @ landing.skillbnk.com] [Learner portal CNAME learner
//     learner.skillbnk.com] [Branch portal CNAME branch branch.skillbnk.com] [Company admin CNAME
//     company company.skillbnk.com] + copy · "DNS changes can take a few minutes, and sometimes up
//     to 24 hours, depending on the registrar. Click Verify after propagation."
//   · after Save: "Cloudflare hostname and SSL verification" · "SkillBNK creates separate Cloudflare
//     custom hostnames for landing, learner, branch, and company. Each hostname can become active at
//     a different time." · per hostname: Host <status> · SSL <status> · SSL TXT records (copy)
//   · status messages (pending / active) · footer Disconnect · Verify (Checking…) · Cancel · Save domain
//   · toasts "Copied", "Custom domain setup started", "All custom domains are active".
// ═══════════════════════════════════════════════════════════════════════════
/** video caption (not product UI): points at what the viewer should notice */
const Callout: React.FC<{ o: number; text: string; x: number; y: number; c?: string }> = ({ o, text, x, y, c = "#F97316" }) =>
  o > 0.01 ? (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 12}px)`, zIndex: 60, padding: "14px 22px", borderRadius: 14, background: "rgba(4,6,13,0.9)", border: `2px solid ${c}`, color: "#F1F5F9", fontSize: 30, fontWeight: 800, fontFamily: FONT, boxShadow: `0 0 40px ${c}55` }}>{text}</div>
  ) : null;


const HOSTS = [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]];
const DNS_ROWS = [["Landing", "CNAME", "@", "landing.skillbnk.com"], ["Learner portal", "CNAME", "learner", "learner.skillbnk.com"], ["Branch portal", "CNAME", "branch", "branch.skillbnk.com"], ["Company admin", "CNAME", "company", "company.skillbnk.com"]];
const MOD = { x: 330, y: 20, w: 940 };
const StatusPill: React.FC<{ t: string; on: boolean }> = ({ t, on }) => (
  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999, border: `1px solid ${on ? "#BBF7D0" : "#FDE68A"}`, background: on ? "#F0FDF4" : "#FEFCE8", color: on ? "#15803D" : "#A16207" }}>{t} {on ? "active" : "pending"}</span>
);
/** the Domain setup modal — every block absolutely placed (fixed layout) so the cursor can hit
 *  exact targets. Content scrolls by `scroll` px. Helpers below give content-coord targets. */
const DM = { title: 0, intro: 36, free: 92, label: 204, input: 230, hint: 282, status: 308 };
const dnsTop = (saved: boolean) => (saved ? 380 : 312);
const verTop = (saved: boolean) => dnsTop(saved) + 316;
const DNS_ROW0 = 74;   // first DNS row top, inside the DNS box
const DNS_ROW_H = 44;
const HOST_ROW0 = 92;  // first hostname card top, inside the verification box
const HOST_H = 100;
/** content-coord centre of DNS row i's copy icon / hostname card i, for a given scroll */
const dnsCopyPt = (i: number, scroll: number, saved = false) => ({ x: MOD.x + MOD.w - 28 - 38, y: MOD.y + 22 - scroll + dnsTop(saved) + DNS_ROW0 + i * DNS_ROW_H + 19 });
const hostPt = (i: number, scroll: number) => ({ x: MOD.x + MOD.w / 2, y: MOD.y + 22 - scroll + verTop(true) + HOST_ROW0 + i * HOST_H + 40 });
const DomainModal: React.FC<{ g: number; domain: string; showDns: boolean; saved: boolean; active: number; scroll: number; copyIdx?: number; pressSave?: boolean; pressVerify?: boolean; checking?: boolean }> = ({ g, domain, showDns, saved, active, scroll, copyIdx = -1, pressSave, pressVerify, checking }) => {
  const on = active > 0.5;
  const IW = MOD.w - 56;
  const dT = dnsTop(saved);
  const vT = verTop(saved);
  const abs = (top: number, h: number, extra: React.CSSProperties = {}) => ({ position: "absolute" as const, left: 0, top, width: IW, height: h, ...extra });
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 40 }}>
      <div style={{ position: "absolute", left: MOD.x, top: MOD.y, width: MOD.w, height: 815, borderRadius: 16, background: "#fff", overflow: "hidden", boxShadow: "0 30px 80px #0007" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: MOD.w, height: 735, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 28, top: 22 - scroll, width: IW, height: 1400 }}>
            <div style={{ ...abs(DM.title, 30), display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>Domain setup</span>
              {saved && <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: on ? "#DCFCE7" : "#FEF9C3", color: on ? "#15803D" : "#A16207" }}>{on ? "active" : "pending"}</span>}
            </div>
            <div style={{ ...abs(DM.intro, 46), fontSize: 14, color: GRAY, lineHeight: "22px" }}>Connect a main custom domain. SkillBNK creates landing, learner, branch, and company hostnames and tracks each one separately.</div>
            <div style={{ ...abs(DM.free, 96), borderRadius: 10, border: `1px solid ${LINE}`, background: "#F8FAFC", padding: 12, boxSizing: "border-box" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>FREE SKILLBNK DOMAINS</div>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{[["Landing", `${SLUG}.skillbnk.com`], ["Learner portal", `${SLUG}.learner.skillbnk.com`], ["Branch portal", `${SLUG}.branch.skillbnk.com`], ["Company admin", `${SLUG}.company.skillbnk.com`]].map(([a, b]) => <div key={a} style={{ fontSize: 12.5, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 7, padding: "5px 8px", whiteSpace: "nowrap", overflow: "hidden" }}><b style={{ color: "#475569" }}>{a}</b> <span style={{ fontFamily: "monospace", color: INK }}>{b}</span></div>)}</div>
            </div>
            <div style={{ ...abs(DM.label, 22), fontSize: 14.5, fontWeight: 700, color: "#374151" }}>Main custom landing domain</div>
            <div style={{ ...abs(DM.input, 46), borderRadius: 8, border: `1px solid ${domain && !showDns ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: domain && !showDns ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", fontSize: 16, fontFamily: "monospace", color: domain ? INK : "#9CA3AF" }}>{domain || "customer.com"}</div>
            <div style={{ ...abs(DM.hint, 20), fontSize: 12.5, color: GRAY }}>Do not include https:// or a path.</div>
            {saved && <div style={{ ...abs(DM.status, 58), padding: "9px 14px", boxSizing: "border-box", borderRadius: 9, border: `1px solid ${on ? "#BBF7D0" : "#BFDBFE"}`, background: on ? "#F0FDF4" : "#EFF6FF", color: on ? "#166534" : "#1E40AF", fontSize: 13.5, fontWeight: 600, lineHeight: "20px" }}>{on ? "Landing and portal domains are active." : "Domain setup is pending. Complete the DNS records below, wait a few minutes for propagation, then click Verify."}</div>}
            {showDns && (
              <div style={{ ...abs(dT, 300), borderRadius: 12, border: `1px solid ${LINE}`, boxSizing: "border-box" }}>
                <div style={{ position: "absolute", left: 14, top: 14, fontSize: 15.5, fontWeight: 800, color: INK }}>DNS instructions</div>
                <div style={{ position: "absolute", left: 24, top: 50, display: "flex", fontSize: 12, fontWeight: 800, color: GRAY, letterSpacing: 0.5 }}><span style={{ width: 150 }}>HOSTNAME</span><span style={{ width: 90 }}>TYPE</span><span style={{ width: 110 }}>NAME</span><span>VALUE</span></div>
                {DNS_ROWS.map(([l, ty, n, v], i) => (
                  <div key={l} style={{ position: "absolute", left: 14, right: 14, top: DNS_ROW0 + i * DNS_ROW_H, height: 38, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 8, background: copyIdx === i ? "#EEF2FF" : "#F8FAFC", border: `1px solid ${copyIdx === i ? "#A5B4FC" : LINE}`, fontSize: 14, boxSizing: "border-box" }}>
                    <span style={{ width: 150, fontWeight: 700, color: "#374151" }}>{l}</span>
                    <span style={{ width: 90 }}><span style={{ padding: "2px 8px", borderRadius: 6, background: "#E0E7FF", color: BLUE, fontWeight: 800, fontSize: 12 }}>{ty}</span></span>
                    <span style={{ width: 110, fontFamily: "monospace", color: INK }}>{n}</span>
                    <span style={{ flex: 1, fontFamily: "monospace", color: INK }}>{v}</span>
                    <span style={{ width: 22, textAlign: "center", fontSize: 16, color: copyIdx === i ? BLUE : "#94A3B8" }}>⧉</span>
                  </div>
                ))}
                <div style={{ position: "absolute", left: 14, right: 14, top: DNS_ROW0 + 4 * DNS_ROW_H + 8, fontSize: 12.5, color: GRAY, lineHeight: "19px" }}>DNS changes can take a few minutes, and sometimes up to 24 hours, depending on the registrar. Click Verify after propagation.</div>
              </div>
            )}
            {saved && (
              <div style={{ ...abs(vT, HOST_ROW0 + 4 * HOST_H + 10), borderRadius: 12, border: `1px solid ${LINE}`, boxSizing: "border-box" }}>
                <div style={{ position: "absolute", left: 14, top: 14, fontSize: 15.5, fontWeight: 800, color: INK }}>Cloudflare hostname and SSL verification</div>
                <div style={{ position: "absolute", left: 14, right: 14, top: 40, fontSize: 12.5, color: GRAY, lineHeight: "18px" }}>SkillBNK creates separate Cloudflare custom hostnames for landing, learner, branch, and company. Each hostname can become active at a different time.</div>
                {HOSTS.map(([l, h], i) => {
                  const a = active > 0.2 + i * 0.18;
                  return (
                    <div key={l} style={{ position: "absolute", left: 14, right: 14, top: HOST_ROW0 + i * HOST_H, height: HOST_H - 10, borderRadius: 10, border: `1px solid ${a ? "#BBF7D0" : LINE}`, background: a ? "#F7FEF9" : "#fff", padding: 10, boxSizing: "border-box" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 800, color: INK }}>{l}</div><div style={{ fontSize: 12.5, fontFamily: "monospace", color: GRAY }}>{h}</div></div>
                        <StatusPill t="Host" on={a} /><StatusPill t="SSL" on={a} />
                      </div>
                      {!a && <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, background: "#F8FAFC", borderRadius: 7, padding: "6px 8px" }}><span style={{ fontWeight: 800, color: "#374151" }}>SSL TXT</span><span style={{ flex: 1, fontFamily: "monospace", color: GRAY, filter: "blur(2.5px)" }}>_acme-challenge.{h} · 9f2c4e1a7b…</span><span style={{ color: "#94A3B8" }}>⧉</span></div>}
                      {a && <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "#15803D" }}>✓ Hostname and certificate active</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: MOD.w, height: 80, borderTop: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "0 28px", boxSizing: "border-box" }}>
          {saved && <span style={{ width: 110, textAlign: "center", padding: "10px 0", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: INK }}>Disconnect</span>}
          {saved && <span style={{ width: 100, textAlign: "center", padding: "10px 0", borderRadius: 8, border: `1px solid ${pressVerify ? BLUE : LINE}`, fontSize: 14, fontWeight: 700, color: pressVerify ? BLUE : INK, transform: `scale(${pressVerify ? 0.93 : 1})` }}>{checking ? "Checking…" : "Verify"}</span>}
          <span style={{ width: 90, textAlign: "center", padding: "10px 0", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: INK }}>Cancel</span>
          <span style={{ width: 130, textAlign: "center", padding: "10px 0", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, transform: `scale(${pressSave ? 0.93 : 1})` }}>Save domain</span>
        </div>
      </div>
    </div>
  );
};
// footer button centres (content coords): [Disconnect 110][Verify 100][Cancel 90][Save domain 130], gap 10, right pad 28
const BTN_SAVE = { x: MOD.x + MOD.w - 28 - 65, y: MOD.y + 815 - 40 };
const BTN_VERIFY = { x: MOD.x + MOD.w - 28 - 130 - 10 - 90 - 10 - 50, y: MOD.y + 815 - 40 };
const CardPage: React.FC<{ children?: React.ReactNode; custom?: boolean; status?: "pending" | "active"; pressSetup?: boolean; pressVisit?: boolean; pressCopy?: number }> = ({ custom = false, status, pressSetup, pressVisit, pressCopy }) => (
  <>
    <PageTitle t="Website Builder" sub="Build and publish your company website" />
    <Btn x={1180} y={24} w={150} h={42} label="+ New Website" primary fs={14.5} />
    <SiteCard custom={custom} status={status} pressSetup={pressSetup} pressVisit={pressVisit} pressCopy={pressCopy} hl={custom ? 1 : 0} />
  </>
);
// card geometry in content coords
const CARD_SETUP = { x: MX(20 + 640 - 62), y: MY(90 + 35) };
const CARD_VISIT = { x: MX(20 + 20 + 90 + 50), y: MY(90 + 470 - 34) };

// ═══ d0 — HOOK ═══════════════════════════════════════════════════════════════
const SceneHookCD: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const flip = g >= 120;
  const typedNew = typed(g, 125, DOMAIN, 0.9);
  const del = interpolate(g, [100, 120], [1, 0], cl);
  const old = "brightpath-academy.someplatform.io/school/48213";
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 260, top: 300, width: 1400, height: 130, borderRadius: 26, background: "#fff", boxShadow: "0 40px 100px #000C", display: "flex", alignItems: "center", gap: 22, padding: "0 40px", opacity: sp(g, 4, fps), transform: `scale(${0.95 + 0.05 * sp(g, 4, fps)})` }}>
          <span style={{ fontSize: 44, color: flip ? "#16A34A" : "#94A3B8" }}>🔒</span>
          <span style={{ fontSize: 50, fontFamily: "monospace", fontWeight: 700, color: flip ? INK : "#64748B", whiteSpace: "nowrap", overflow: "hidden" }}>{flip ? typedNew : old.slice(0, Math.ceil(old.length * del))}<span style={{ color: BLUE }}>|</span></span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}>
          <div style={{ fontSize: 50, fontWeight: 800, color: "#FCA5A5", opacity: fi(g, 20, 12) * (flip ? 0.35 : 1) }}>Still sending learners to someone else's address?</div>
          <div style={{ marginTop: 18, fontSize: 56, fontWeight: 900, color: "#F1F5F9", opacity: fi(g, 160, 12) }}>Use <span style={{ color: "#5EEAD4" }}>your own domain.</span> Step by step.</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ d1 — card: free domains → Set up ═══════════════════════════════════════
const SceneCardSetup: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const cur = path(g, [[0, 900, 700], [60, MX(360), MY(330)], [170, MX(360), MY(420)], [230, CARD_SETUP.x, CARD_SETUP.y], [262, CARD_SETUP.x, CARD_SETUP.y], [300, CARD_SETUP.x, CARD_SETUP.y]]);
  // zoom: card → the 4 free domains (slow pan down the list) → the Set up button
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [40, MX(340), MY(250), 1.45], [80, MX(340), MY(330), 1.9], [180, MX(340), MY(380), 1.9], [220, MX(560), MY(140), 2.1], [300, MX(560), MY(140), 2.1]];
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={rip(g, 256)}>
      <CardPage pressSetup={g >= 256 && g < 264} pressCopy={g >= 100 && g < 180 ? Math.min(3, Math.floor((g - 100) / 20)) : -1} />
      <Callout o={g >= 90 && g < 210 ? Math.min(fi(g, 90, 10), fo(g, 200, 10)) : 0} text="Free addresses for your site + every portal" x={MX(700)} y={MY(260)} c="#14B8A6" />
    </CoStage>
  );
};

// ═══ d2 — type domain → DNS instructions → copy each record → Save domain ═══
const SceneDnsRecords: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 520;
  const g = gt(f, dur, D);
  const domain = typed(g, 70, DOMAIN, 0.9);
  const showDns = g >= 100;
  const scroll = interpolate(g, [120, 160], [0, 300], cl);
  const copyIdx = g >= 200 && g < 420 ? Math.min(3, Math.floor((g - 200) / 50)) : -1;
  const saved = false;
  const INPUT = { x: MOD.x + 300, y: MOD.y + 22 + DM.input + 23 };
  const pts: P3[] = [[0, 900, 600], [40, INPUT.x, INPUT.y], [110, INPUT.x, INPUT.y]];
  for (let i = 0; i < 4; i++) { const c = dnsCopyPt(i, 300); pts.push([190 + i * 50, c.x, c.y]); pts.push([205 + i * 50, c.x, c.y]); }
  pts.push([450, BTN_SAVE.x, BTN_SAVE.y], [480, BTN_SAVE.x, BTN_SAVE.y], [520, BTN_SAVE.x, BTN_SAVE.y]);
  const cur = path(g, pts);
  const r0 = dnsCopyPt(0, 300), r3 = dnsCopyPt(3, 300);
  const ripple = Math.max(rip(g, 50), ...[0, 1, 2, 3].map((i) => rip(g, 203 + i * 50)), rip(g, 476));
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MOD.x + 330, MOD.y + 180, 1.55], [110, MOD.x + 330, MOD.y + 230, 1.7], [170, MOD.x + 470, 470, 1.25], [190, r0.x - 330, r0.y + 30, 1.75], [420, r3.x - 330, r3.y - 30, 1.75], [450, MOD.x + 700, BTN_SAVE.y - 60, 1.9], [520, MOD.x + 700, BTN_SAVE.y - 60, 1.9]];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url="company.skillbnk.com/website-builder">
          <CoShell><CardPage /></CoShell>
          <DomainModal g={g} domain={domain} showDns={showDns} saved={saved} active={0} scroll={scroll} copyIdx={copyIdx} pressSave={g >= 476 && g < 484} />
          {[0, 1, 2, 3].map((i) => (g >= 205 + i * 50 && g < 235 + i * 50 ? <Toast key={i} g={g} at={205 + i * 50} text="Copied" x={1180} y={70} /> : null))}
          {g >= 484 && <Toast g={g} at={484} text="Custom domain setup started" x={1080} y={70} />}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d3 — at your domain registrar: add the 4 CNAME records ═════════════════
const SceneRegistrar: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const rows = DNS_ROWS.map(([l, ty, n, v]) => [ty, n, v]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 800, 330, 1.35], [300, 800, 420, 1.35], [330, 800, 420, 1.35]];
  return (
    <Stage>
      <PortalTag n={2} label="Your domain registrar" url="DNS settings" />
      <CamC g={g} keys={keys}>
        <Browser url="your-registrar.com/dns/learnbrightpath.com">
          <div style={{ position: "absolute", inset: 0, background: "#F8FAFC" }}>
            <div style={{ height: 64, background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", padding: "0 32px", gap: 14 }}><div style={{ width: 34, height: 34, borderRadius: 8, background: "#CBD5E1" }} /><span style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>Your registrar</span><span style={{ marginLeft: 24, fontSize: 15, color: GRAY }}>Domains › {DOMAIN} › DNS</span></div>
            <div style={{ position: "absolute", left: 80, top: 110, width: 1440 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>DNS records · {DOMAIN}</div>
              <div style={{ marginTop: 6, fontSize: 15, color: GRAY }}>Example screen — every registrar looks a little different.</div>
              <div style={{ marginTop: 24, borderRadius: 12, background: "#fff", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ display: "flex", padding: "14px 22px", background: "#F1F5F9", fontSize: 14, fontWeight: 800, color: "#475569" }}><span style={{ width: 160 }}>Type</span><span style={{ width: 260 }}>Name</span><span style={{ flex: 1 }}>Value / Target</span><span style={{ width: 120 }}>TTL</span></div>
                {rows.map(([ty, n, v], i) => {
                  const at = 40 + i * 60;
                  const o = fi(g, at, 10);
                  const val = typed(g, at + 8, v, 1.2);
                  return (
                    <div key={n} style={{ display: "flex", alignItems: "center", padding: "18px 22px", borderTop: "1px solid #E2E8F0", fontSize: 18, opacity: o, background: g >= at && g < at + 50 ? "#F0FDFA" : "#fff" }}>
                      <span style={{ width: 160 }}><span style={{ padding: "4px 10px", borderRadius: 6, background: "#E0E7FF", color: BLUE, fontWeight: 800, fontSize: 14 }}>{ty}</span></span>
                      <span style={{ width: 260, fontFamily: "monospace", color: INK }}>{n}</span>
                      <span style={{ flex: 1, fontFamily: "monospace", color: INK }}>{val}</span>
                      <span style={{ width: 120, color: GRAY }}>Auto</span>
                    </div>
                  );
                })}
              </div>
              {g >= 290 && <div style={{ marginTop: 18, display: "inline-block", padding: "12px 18px", borderRadius: 10, background: "#ECFDF5", color: "#065F46", fontWeight: 700, fontSize: 16, opacity: fi(g, 290, 10) }}>✓ 4 records saved · propagation can take a few minutes, sometimes up to 24 hours</div>}
            </div>
          </div>
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d4 — back in skillBNK: pending status + per-hostname SSL TXT records ═══
const ScenePending: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const scroll = interpolate(g, [40, 120, 200, 300], [0, 240, 240, 640], cl);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MOD.x + 330, MOD.y + 330, 1.6], [150, MOD.x + 330, MOD.y + 330, 1.6], [200, MOD.x + 470, 420, 1.4], [330, MOD.x + 470, 420, 1.4], [360, MOD.x + 470, 420, 1.4]];
  const cur = path(g, [[0, 900, 600], [360, MOD.x + 760, 520]]);
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url="company.skillbnk.com/website-builder">
          <CoShell><CardPage custom status="pending" /></CoShell>
          <DomainModal g={g} domain={DOMAIN} showDns saved active={0} scroll={scroll} />
          <Callout o={g >= 210 ? fi(g, 210, 10) : 0} text="Add these SSL TXT records too" x={MOD.x + MOD.w - 380} y={140} c="#F59E0B" />
          <Cursor x={cur.x} y={cur.y} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d5 — Verify → Checking… → every Host + SSL turns active ══════════════
const SceneVerifyDomain: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const active = interpolate(g, [90, 220], [0, 1], cl);
  const scroll = 640;
  const cur = path(g, [[0, MOD.x + 760, 520], [50, BTN_VERIFY.x, BTN_VERIFY.y], [70, BTN_VERIFY.x, BTN_VERIFY.y], [140, MOD.x + 600, 400], [330, MOD.x + 600, 400]]);
  const keys: CamKey[] = [[0, MOD.x + 470, 420, 1.4], [40, BTN_VERIFY.x - 100, BTN_VERIFY.y - 80, 1.9], [80, BTN_VERIFY.x - 100, BTN_VERIFY.y - 80, 1.9], [110, MOD.x + 470, 420, 1.4], [240, MOD.x + 470, 420, 1.4], [280, MOD.x + 330, 200, 1.6], [330, MOD.x + 330, 200, 1.6]];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url="company.skillbnk.com/website-builder">
          <CoShell><CardPage custom status={active > 0.95 ? "active" : "pending"} /></CoShell>
          <DomainModal g={g} domain={DOMAIN} showDns saved active={active} scroll={g >= 250 ? interpolate(g, [250, 275], [scroll, 300], cl) : scroll} pressVerify={g >= 64 && g < 90} checking={g >= 64 && g < 90} />
          {g >= 225 && <Toast g={g} at={225} text="All custom domains are active" x={1080} y={70} />}
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 64)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d6 — card shows Custom domains → Visit → live on your domain ══════════
const SceneLive: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 430;
  const g = gt(f, dur, D);
  const site = g >= 170;
  const cur = path(g, [[0, 900, 600], [60, MX(360), MY(330)], [130, CARD_VISIT.x, CARD_VISIT.y], [160, CARD_VISIT.x, CARD_VISIT.y], [330, 900, 600]]);
  const keys: CamKey[] = site ? [[0, WIDE_X, WIDE_Y, 1], [330, WIDE_X, WIDE_Y, 1]] : [[0, WIDE_X, WIDE_Y, 1], [30, MX(340), MY(300), 1.8], [110, MX(340), MY(360), 1.8], [140, MX(200), MY(500), 1.9], [170, MX(200), MY(500), 1.9]];
  if (site) {
    return (
      <Stage>
        <PortalTag n={3} label="Your website" url={DOMAIN} />
        <CamC g={g} keys={keys}>
          <Browser url={DOMAIN}>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 170, 10) }}><BrightSite g={g - 170} fps={fps} scroll={interpolate(g, [230, 410], [0, SITE_H - 856], cl)} hosts={g < 228} /></div>
          </Browser>
        </CamC>
      </Stage>
    );
  }
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={rip(g, 156)}>
      <CardPage custom status="active" pressVisit={g >= 156 && g < 164} />
    </CoStage>
  );
};

// ═══ d7 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapCD: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["⚙", "Set up", "Enter your domain", "#2563EB"], ["📋", "Copy records", "4 CNAME records", "#7C3AED"], ["🌐", "Add at registrar", "Plus SSL TXT records", "#F59E0B"], ["✅", "Verify", "Every host + SSL active", "#22C55E"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 380, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 340, width: 1640, display: "flex", gap: 28 }}>
          {steps.map(([ic, t, s, c], i) => {
            const p = sp(g, 20 + i * 12, fps);
            return (
              <div key={t} style={{ flex: 1, height: 240, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${c}88`, boxShadow: `0 0 50px ${c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c }}>STEP {i + 1}</div>
                <div style={{ marginTop: 8, fontSize: 46 }}>{ic}</div>
                <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
                <div style={{ marginTop: 6, fontSize: 18, color: "#8A96B2" }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 80, 12) }}>
          Your domain. <span style={{ color: "#5EEAD4" }}>Every portal.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
// ═══════════════════════════════════════════════════════════════════════════
// Website Builder — scenes (sheet serial 16). Real UI (SB-Company website-builder/[websiteId]):
//  EditorHeader: site + page name · AI · Library · Settings · Page SEO · Export · Import · Preview ·
//   Save draft · Publish changes · Live. Toasts "Draft saved", "Page and global design published".
//  PagesPanel: Global (Global Navbar, Global Footer) · All pages / Custom pages / Default pages ·
//   Add page (Title, Folder) · Add folder · Page SEO (SEO title, Meta description, Search preview…).
//  DesignLibraryModal: Components / Pages · "Add block" · page template "Training Academy"
//   ("An education-first page connected to live programs and learner outcomes.") → "Use page".
//  AiBuilderModal "Build with AI": Section ("One section from a prompt") / Full page / Import HTML;
//   SectionMode "Describe the section", Look, Refine.
//  Hero field help texts: "One line of the stacked hero title.", "Highlighted word or phrase inside the
//   hero title.", "Optional icon displayed next to the CTA label."
// ═══════════════════════════════════════════════════════════════════════════
const HB: [string, number][] = [["✨ AI", 64], ["▤ Library", 90], ["⚙ Settings", 100], ["🔎 Page SEO", 112], ["⤓ Export", 86], ["⤒ Import", 86], ["👁 Preview", 96], ["Save draft", 100], ["Publish changes", 146], ["↗ Live", 70]];
const HB_X: number[] = (() => { let x = W - 16; const out: number[] = []; for (let i = HB.length - 1; i >= 0; i--) { x -= HB[i][1]; out[i] = x; x -= 8; } return out; })();
const hbPt = (label: string) => { const i = HB.findIndex((h) => h[0].includes(label)); return { x: HB_X[i] + HB[i][1] / 2, y: 28 }; };
const EdHeader: React.FC<{ page: string; press?: string; on?: string }> = ({ page, press, on }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 56, background: "#fff", borderBottom: `1px solid ${LINE}`, zIndex: 20 }}>
    <div style={{ position: "absolute", left: 18, top: 9 }}><div style={{ fontSize: 15, fontWeight: 800, color: INK }}>← {BRAND}</div><div style={{ fontSize: 12, color: GRAY, fontFamily: "monospace" }}>{DOMAIN} · {page}</div></div>
    {HB.map(([t, w], i) => {
      const pr = press && t.includes(press);
      const act = on && t.includes(on);
      const primary = t === "Publish changes";
      return <div key={t} style={{ position: "absolute", left: HB_X[i], top: 12, width: w, height: 32, borderRadius: 7, border: primary ? "none" : `1px solid ${act ? BLUE : LINE}`, background: primary ? BLUE : act ? BLUE_SOFT : "#fff", color: primary ? "#fff" : act ? BLUE : INK, fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pr ? 0.92 : 1})`, boxSizing: "border-box" }}>{t}</div>;
    })}
  </div>
);
type Sec = "nav" | "hero" | "stats" | "programs" | "features" | "testi" | "pricing" | "cta" | "footer" | "timeline" | "instructors" | "faq" | "branches" | "contact" | "divider";
/** mini website sections drawn on the editor canvas (block look-alikes from the Design library) */
const MiniSec: React.FC<{ k: Sec; w: number; sel?: boolean; title?: string; hi?: string; cta?: string; o?: number; footerNote?: string; globalTag?: boolean }> = ({ k, w, sel, title = "Launch your career with", hi = BRAND, cta = "Browse programs", o = 1, footerNote, globalTag }) => {
  const box = (h: number, body: React.ReactNode, bg = "#fff") => <div style={{ position: "relative", height: h, background: bg, borderBottom: "1px solid #EEF2F7", outline: sel ? `2px solid ${BLUE}` : "none", outlineOffset: -2, opacity: o }}>{globalTag && <span style={{ position: "absolute", right: 8, top: 6, fontSize: 10, fontWeight: 800, color: "#7C3AED", background: "#F3E8FF", padding: "2px 6px", borderRadius: 5, zIndex: 2 }}>GLOBAL</span>}{body}</div>;
  const narrow = w < 600;
  switch (k) {
    case "nav": return box(48, <div style={{ display: "flex", alignItems: "center", height: 48, padding: "0 18px" }}><BrightLogo s={0.7} /><span style={{ flex: 1 }} />{!narrow && ["Programs", "About", "Contact"].map((x) => <span key={x} style={{ fontSize: 11.5, marginLeft: 14, color: "#374151", fontWeight: 600 }}>{x}</span>)}<span style={{ marginLeft: 14, padding: "5px 12px", borderRadius: 999, background: BP, color: "#fff", fontSize: 11, fontWeight: 700 }}>Sign in</span></div>);
    case "hero": return box(narrow ? 230 : 210, <div style={{ padding: narrow ? 16 : "26px 30px", display: "flex", gap: 20 }}><div style={{ flex: 1 }}><div style={{ fontSize: narrow ? 22 : 30, fontWeight: 900, color: "#0f172a", lineHeight: 1.12 }}>{title}<br /><span style={{ color: BP }}>{hi}</span></div><div style={{ marginTop: 8, fontSize: 12, color: "#475569" }}>Career training for customer-service and sales teams.</div><div style={{ marginTop: 12, display: "inline-block", padding: "8px 16px", borderRadius: 9, background: BP, color: "#fff", fontWeight: 800, fontSize: 12 }}>{cta}</div></div>{!narrow && <div style={{ width: 300, height: 160, borderRadius: 16, background: `linear-gradient(160deg,${BP},#134E4A)`, position: "relative" }}>{[["Online", "Learn at your pace"], ["Live classes", "Weekly with coaches"], ["Certificates", "Show your skills"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 14 + (i % 2) * 140, top: 12 + i * 46, width: 130, padding: "6px 8px", borderRadius: 9, background: "#fff", boxShadow: "0 4px 10px #0003" }}><div style={{ fontSize: 11, fontWeight: 800 }}>{a}</div><div style={{ fontSize: 9.5, color: GRAY }}>{b}</div></div>)}</div>}</div>, `linear-gradient(135deg, ${BP}14, #fff 60%)`);
    case "stats": return box(64, <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 64 }}>{[["1,200+", "learners"], ["24", "programs"], ["4.8★", "rating"]].map(([a, b]) => <div key={b} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: BP }}>{a}</div><div style={{ fontSize: 10.5, color: GRAY }}>{b}</div></div>)}</div>, "#F8FAFC");
    case "programs": return box(150, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Our programs <span style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", background: "#E0F2FE", padding: "2px 6px", borderRadius: 5, marginLeft: 6 }}>LIVE DATA</span></div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["Customer Service Essentials", "Sales Conversations", "Team Lead Basics"].slice(0, narrow ? 1 : 3).map((c) => <div key={c} style={{ flex: 1, height: 90, borderRadius: 9, border: "1px solid #EEF2F7", padding: 8, boxSizing: "border-box" }}><div style={{ height: 44, borderRadius: 7, background: `linear-gradient(135deg,${BP},#14B8A6)` }} /><div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: INK }}>{c}</div></div>)}</div></div>);
    case "features": return box(120, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Why {BRAND}</div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["🎯 Job-ready skills", "🎙 AI practice calls", "🎓 Certificates"].slice(0, narrow ? 2 : 3).map((x) => <div key={x} style={{ flex: 1, padding: 10, borderRadius: 9, background: "#F8FAFC", fontSize: 11.5, fontWeight: 700 }}>{x}</div>)}</div></div>);
    case "testi": return box(120, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>What learners say</div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["“I landed a team-lead role three months after finishing.”", "“The live classes made all the difference.”"].slice(0, narrow ? 1 : 2).map((x) => <div key={x} style={{ flex: 1, padding: 10, borderRadius: 9, boxShadow: "0 3px 10px #0001", fontSize: 11, fontStyle: "italic" }}>{x}</div>)}</div></div>, `${BP}0D`);
    case "pricing": return box(150, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Choose your plan</div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{[["Starter", false], ["Career Track", true], ["Team", false]].slice(0, narrow ? 1 : 3).map(([n, pop]) => <div key={n as string} style={{ flex: 1, height: 92, borderRadius: 10, border: `2px solid ${pop ? BP : "#EEF2F7"}`, padding: 8, boxSizing: "border-box", position: "relative" }}>{pop && <span style={{ position: "absolute", top: -9, left: 10, fontSize: 9.5, fontWeight: 800, color: "#fff", background: BP, padding: "2px 6px", borderRadius: 5 }}>MOST POPULAR</span>}<div style={{ fontSize: 12, fontWeight: 800, color: INK }}>{n as string}</div><div style={{ marginTop: 4, height: 8, width: "60%", borderRadius: 4, background: "#E5E7EB" }} /><div style={{ marginTop: 6, height: 8, width: "80%", borderRadius: 4, background: "#E5E7EB" }} /></div>)}</div></div>);
    case "cta": return box(84, <div style={{ margin: "12px 22px", height: 60, borderRadius: 12, background: `linear-gradient(120deg,${BP},#134E4A)`, display: "flex", alignItems: "center", padding: "0 18px", justifyContent: "space-between" }}><span style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>Ready to start?</span><span style={{ padding: "6px 12px", borderRadius: 8, background: BP_ACC, fontWeight: 900, fontSize: 11.5 }}>Apply now</span></div>);
    case "timeline": return box(136, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>How enrollment works</div><div style={{ marginTop: 10, display: "flex", gap: 10 }}>{["Pick a program", "Choose a session", "Apply online", "Start learning"].slice(0, narrow ? 2 : 4).map((x, i) => <div key={x} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #EEF2F7", display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: BP, color: "#fff", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 11.5, fontWeight: 700 }}>{x}</span></div>)}</div></div>, "#fff");
    case "instructors": return box(150, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Meet your coaches</div><div style={{ marginTop: 10, display: "flex", gap: 12 }}>{[["Maria Lopez", "Customer service"], ["James Carter", "Sales"], ["Aisha Khan", "Leadership"]].slice(0, narrow ? 2 : 3).map(([n, r], i) => <div key={n} style={{ flex: 1, padding: 10, borderRadius: 12, background: "#F8FAFC", display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 46, height: 46, borderRadius: "50%", background: ["#14B8A6", "#F59E0B", "#6366F1"][i], color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{n.split(" ").map((w) => w[0]).join("")}</span><div><div style={{ fontSize: 12.5, fontWeight: 800 }}>{n}</div><div style={{ fontSize: 11, color: GRAY }}>{r}</div></div></div>)}</div></div>);
    case "faq": return box(170, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Frequently asked questions</div>{["When do the fall programs start?", "Are classes live or online?", "Do I get a certificate?", "Can I pay in installments?"].slice(0, 4).map((q, i) => <div key={q} style={{ marginTop: 6, padding: "7px 10px", borderRadius: 8, border: "1px solid #EEF2F7", display: "flex", fontSize: 11.5, fontWeight: 700 }}><span style={{ flex: 1 }}>{q}</span><span style={{ color: BP }}>{i === 0 ? "−" : "+"}</span></div>)}</div>);
    case "branches": return box(130, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Our campuses <span style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", background: "#E0F2FE", padding: "2px 6px", borderRadius: 5, marginLeft: 6 }}>LIVE DATA</span></div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["📍 Austin", "📍 San Antonio", "📍 Houston"].slice(0, narrow ? 2 : 3).map((x) => <div key={x} style={{ flex: 1, padding: "16px 10px", borderRadius: 10, background: `${BP}0D`, fontSize: 12.5, fontWeight: 800 }}>{x}<div style={{ fontSize: 10.5, color: GRAY, fontWeight: 600 }}>Classes Mon–Thu</div></div>)}</div></div>, "#F8FAFC");
    case "contact": return box(150, <div style={{ padding: "14px 22px", display: "flex", gap: 20 }}><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Talk to an advisor</div><div style={{ fontSize: 11.5, color: GRAY, marginTop: 4 }}>We reply within one business day.</div></div><div style={{ flex: 1.3 }}>{["Name", "Email", "Message"].map((x) => <div key={x} style={{ marginTop: 6, height: 22, borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 10.5, color: "#94A3B8", padding: "3px 8px", boxSizing: "border-box" }}>{x}</div>)}<div style={{ marginTop: 6, display: "inline-block", padding: "5px 12px", borderRadius: 7, background: BP, color: "#fff", fontSize: 11, fontWeight: 800 }}>Send</div></div></div>);
    case "divider": return box(24, <div style={{ margin: "11px 22px", height: 2, background: "#CBD5E1" }} />);
    case "footer": return box(60, <div style={{ display: "flex", alignItems: "center", height: 60, padding: "0 18px", background: "#0f172a", gap: 16 }}><BrightLogo s={0.6} dark /><span style={{ flex: 1 }} />{footerNote && <span style={{ color: "#5EEAD4", fontSize: 11, fontWeight: 700 }}>{footerNote}</span>}<span style={{ color: "#94A3B8", fontSize: 10.5 }}>© 2026 {BRAND}</span></div>, "#0f172a");
  }
  return null;
};
const CAN = { x: 280, y: 72, w: 1020, h: 776 };
const Canvas: React.FC<{ secs: { k: Sec; o?: number; sel?: boolean; title?: string; hi?: string; cta?: string; footerNote?: string; globalTag?: boolean }[]; scroll?: number; device?: "Desktop" | "Tablet" | "Mobile"; dropAt?: number }> = ({ secs, scroll = 0, device = "Desktop", dropAt = -1 }) => {
  const pw = device === "Desktop" ? 980 : device === "Tablet" ? 640 : 380;
  return (
    <div style={{ position: "absolute", left: CAN.x, top: CAN.y, width: CAN.w, height: CAN.h, background: "#E9EDF3", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: (CAN.w - pw) / 2, top: 12 - scroll, width: pw, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: "Poppins, " + FONT, boxShadow: "0 4px 16px #0F172A14" }}>
        {secs.map((s, i) => (
          <React.Fragment key={s.k + i}>
            {dropAt === i && <div style={{ height: 6, margin: "4px 20px", borderRadius: 3, background: BLUE }} />}
            <MiniSec {...s} w={pw} />
          </React.Fragment>
        ))}
        {dropAt === secs.length && <div style={{ height: 6, margin: "4px 20px", borderRadius: 3, background: BLUE }} />}
      </div>
    </div>
  );
};
const LeftPages: React.FC<{ hl?: string; extra?: string[]; o?: number }> = ({ hl, extra = [], o = 1 }) => {
  const item = (t: string, ic: string, ind = false) => <div key={t} style={{ marginTop: 4, height: 30, borderRadius: 7, display: "flex", alignItems: "center", gap: 8, padding: `0 8px 0 ${ind ? 18 : 8}px`, fontSize: 13, fontWeight: hl === t ? 800 : 600, color: hl === t ? BLUE : INK, background: hl === t ? BLUE_SOFT : "transparent" }}><span style={{ color: "#94A3B8" }}>{ic}</span>{t}</div>;
  return (
    <div style={{ position: "absolute", left: 0, top: 56, width: 260, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 12, boxSizing: "border-box", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 800, color: INK, flex: 1 }}>Pages</span><span title="Add folder" style={{ fontSize: 14, color: GRAY, marginRight: 10 }}>📁+</span><span style={{ fontSize: 16, fontWeight: 800, color: hl === "+" ? BLUE : GRAY }}>＋</span></div>
      <div style={{ marginTop: 10, fontSize: 10.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>GLOBAL</div>
      {item("Global Navbar", "▭", true)}{item("Global Footer", "▭", true)}
      <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>CUSTOM PAGES</div>
      {["Home", "About", ...extra].map((t) => item(t, "📄", true))}
      <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>DEFAULT PAGES</div>
      {["Login", "Register", "Enrollment page"].map((t) => item(t, "🔒", true))}
    </div>
  );
};
const LeftComps: React.FC<{ hl?: string }> = ({ hl }) => (
  <div style={{ position: "absolute", left: 0, top: 56, width: 260, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 12, boxSizing: "border-box" }}>
    <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Components</div><div style={{ fontSize: 11.5, color: GRAY }}>Drag onto the page</div>
    {["Section", "Container", "Grid", "2 Columns", "Heading", "Text", "Button", "Image", "Video", "Carousel", "Tabs", "Accordion", "Divider", "Spacer"].map((c) => <div key={c} style={{ marginTop: 5, height: 28, borderRadius: 7, border: `1px solid ${hl === c ? BLUE : LINE}`, background: hl === c ? BLUE_SOFT : "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 12.5, fontWeight: 600, color: INK }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span>{c}</div>)}
  </div>
);
const COMP_Y = (name: string) => { const L = ["Section", "Container", "Grid", "2 Columns", "Heading", "Text", "Button", "Image", "Video", "Carousel", "Tabs", "Accordion", "Divider", "Spacer"]; return 56 + 12 + 34 + L.indexOf(name) * 33 + 14; };
const RightPanel: React.FC<{ children?: React.ReactNode; title: string }> = ({ children, title }) => (
  <div style={{ position: "absolute", left: 1316, top: 56, width: 284, height: H - BAR - 56, background: "#fff", borderLeft: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
    <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{title}</div>{children}
  </div>
);
const FieldBox: React.FC<{ label: string; help?: string; value: string; active?: boolean; mono?: boolean }> = ({ label, help, value, active, mono }) => (
  <div style={{ marginTop: 12 }}>
    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}>{label}</div>
    {help && <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{help}</div>}
    <div style={{ marginTop: 5, minHeight: 32, borderRadius: 7, border: `1px solid ${active ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: active ? "0 0 0 3px #C7D2FE" : "none", padding: "7px 9px", boxSizing: "border-box", fontSize: 12.5, color: INK, fontFamily: mono ? "monospace" : FONT }}>{value}</div>
  </div>
);
const EdStage: React.FC<{ g: number; keys: CamKey[]; page: string; press?: string; on?: string; cur: { x: number; y: number }; ripple: number; grab?: boolean; chip?: [number, string]; children: React.ReactNode }> = ({ g, keys, page, press, on, cur, ripple, grab, chip, children }) => (
  <Stage>
    <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
    <CamC g={g} keys={keys}>
      <Browser url={`company.skillbnk.com/website-builder/${SLUG}`}>
        <div style={{ position: "absolute", inset: 0, background: "#F6F7F9" }} />
        {children}
        <EdHeader page={page} press={press} on={on} />
        <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={grab} />
      </Browser>
    </CamC>
    {chip && <StepChip n={chip[0]} text={chip[1]} o={fi(g, 6, 10)} />}
  </Stage>
);
/** small step caption at the bottom of the SCREEN (outside the camera) — never covers the UI */
const StepChip: React.FC<{ n: number; text: string; o?: number }> = ({ n, text, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center", zIndex: 60, opacity: o, pointerEvents: "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 22px 9px 9px", borderRadius: 999, background: "rgba(4,6,13,0.78)", border: "1px solid #ffffff22", boxShadow: "0 10px 30px #0008", fontFamily: FONT }}>
      <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#14B8A6", color: "#fff", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      <span style={{ fontSize: 21, fontWeight: 700, color: "#F1F5F9" }}>{text}</span>
    </div>
  </div>
);
const TEMPLATE: Sec[] = ["nav", "hero", "stats", "programs", "timeline", "instructors", "testi", "faq", "branches", "cta", "footer"];
const BASE: Sec[] = ["nav", "hero", "stats", "programs", "timeline", "instructors", "testi", "cta", "footer"];
const secsOf = (ks: Sec[], extra: Record<string, any> = {}) => ks.map((k) => ({ k, globalTag: k === "nav" || k === "footer", ...(extra[k] ?? {}) }));

// ═══ b0 — HOOK: "one headline change" ticket vs. doing it yourself ═══════
const SceneHookWB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const days = Math.round(interpolate(g, [20, 95], [0, 9], cl));
  const flip = g >= 105;
  const build = (i: number) => sp(g, 120 + i * 9, fps, { damping: 13 });
  const stack: Sec[] = ["nav", "hero", "stats", "programs", "timeline", "testi", "cta", "footer"];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        {!flip ? (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 58, fontWeight: 900, color: "#F1F5F9", opacity: fi(g, 4, 10) }}>Want to change <span style={{ color: "#FBBF24" }}>one headline</span>?</div>
            <div style={{ position: "absolute", left: 610, top: 300, width: 700, padding: 30, borderRadius: 22, background: "#fff", boxShadow: "0 40px 100px #000C", opacity: sp(g, 16, fps), transform: `rotate(${interpolate(g, [16, 100], [-1, 1.5], cl)}deg)` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: GRAY, letterSpacing: 2 }}>TICKET #1042 · WEB DEVELOPER</div>
              <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: INK }}>Update homepage headline</div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16 }}><span style={{ fontSize: 64 }}>⏳</span><div><div style={{ fontSize: 60, fontWeight: 900, color: "#DC2626", lineHeight: 1 }}>{days} days</div><div style={{ fontSize: 18, color: GRAY }}>still waiting…</div></div></div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontSize: 44, fontWeight: 800, color: "#FCA5A5", opacity: fi(g, 60, 10) }}>Every small change waits on a developer.</div>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 120, top: 260, width: 760 }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#8A96B2", opacity: fi(g, 106, 8) }}>Or…</div>
              <div style={{ marginTop: 6, fontSize: 70, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.08, opacity: fi(g, 112, 10) }}>build it <span style={{ color: "#5EEAD4" }}>yourself</span><br />in minutes.</div>
              <div style={{ marginTop: 26, fontSize: 26, color: "#CBD5E1", opacity: fi(g, 150, 10) }}>Templates · blocks · drag and drop · AI · one-click publish</div>
            </div>
            <div style={{ position: "absolute", left: 1040, top: 70, width: 720, height: 940, borderRadius: 18, background: "#E9EDF3", overflow: "hidden", boxShadow: "0 40px 100px #000C" }}>
              <div style={{ margin: 18, background: "#fff", borderRadius: 10, overflow: "hidden", fontFamily: "Poppins, " + FONT }}>
                {stack.map((k, i) => <div key={k} style={{ opacity: build(i), transform: `translateY(${(1 - build(i)) * 60}px) scale(${0.96 + 0.04 * build(i)})` }}><MiniSec k={k} w={684} /></div>)}
              </div>
            </div>
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ b1 — editor header tour, timed to the voice (no tooltip overlays) ════
const TOUR = ["AI", "Library", "Settings", "Page SEO", "Preview", "Save draft", "Publish changes"];
const SceneEditorTour: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const T0 = 95, STEP = 27;  // first button ≈ when the voice says "AI"
  const step = g < T0 - 6 ? -1 : Math.min(TOUR.length - 1, Math.floor((g - T0 + 6) / STEP));
  const pts: P3[] = [[0, 800, 500], [T0 - 10, hbPt("AI").x, 30]];
  TOUR.forEach((tt, i) => { pts.push([T0 + i * STEP, hbPt(tt).x, 30]); pts.push([T0 + i * STEP + 14, hbPt(tt).x, 30]); });
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [T0 - 20, hbPt("AI").x + 120, 140, 1.8]];
  TOUR.forEach((tt, i) => keys.push([T0 + i * STEP + 6, Math.max(hbPt(tt).x - 40, hbPt("AI").x + 120), 140, 1.8]));
  keys.push([D, hbPt("Publish changes").x - 40, 140, 1.8]);
  return (
    <EdStage g={g} keys={keys} page="Home" on={step >= 0 ? TOUR[step] : undefined} cur={cur} ripple={0} chip={[1, step >= 0 ? `Editor toolbar · ${TOUR[step]}` : "The Website Builder editor"]}>
      <LeftPages hl="Home" />
      <Canvas secs={secsOf(BASE)} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
    </EdStage>
  );
};

// ═══ b2 — Pages panel: Global / Custom / Default → Add page "Programs" ═════
const ScenePages: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = gt(f, dur, D);
  const dlg = g >= 150 && g < 280 ? Math.min(fi(g, 150, 8), fo(g, 270, 8)) : 0;
  const added = g >= 280;
  const PLUS = { x: 238, y: 56 + 12 + 10 };
  const ADD = { x: 560 + 480 - 24 - 46, y: 250 + 300 - 20 - 18 };
  const cur = path(g, [[0, 800, 500], [30, 120, 130], [110, 120, 330], [130, PLUS.x, PLUS.y], [148, PLUS.x, PLUS.y], [190, 760, 360], [250, ADD.x, ADD.y], [268, ADD.x, ADD.y], [380, 140, 300]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 220, 200, 2.0], [70, 220, 260, 2.0], [110, 220, 360, 2.0], [140, 220, 120, 2.2], [170, 800, 420, 1.6], [270, 800, 420, 1.6], [300, 220, 260, 2.0], [380, 220, 260, 2.0]];
  return (
    <EdStage g={g} keys={keys} page={added ? "Programs" : "Home"} cur={cur} ripple={Math.max(rip(g, 144), rip(g, 264))} chip={[2, g < 140 ? "Pages · Global header & footer shared by every page" : added ? "New page — starts with your global header + footer" : "Add a page"]}>
      <LeftPages hl={added ? "Programs" : g >= 130 && g < 150 ? "+" : "Home"} extra={added ? ["Programs"] : []} />
      <Canvas secs={added ? secsOf(["nav", "footer"]) : secsOf(BASE)} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {dlg > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * dlg})`, zIndex: 25 }}>
          <div style={{ position: "absolute", left: 560, top: 250, width: 480, height: 300, borderRadius: 14, background: "#fff", padding: 24, boxSizing: "border-box", opacity: dlg }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>Add page</div>
            <div style={{ marginTop: 16, fontSize: 12.5, fontWeight: 600, color: GRAY }}>Title</div>
            <div style={{ marginTop: 6, height: 40, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: "0 0 0 3px #C7D2FE", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, color: INK }}>{typed(g, 175, "Programs", 0.6) || <span style={{ color: "#9CA3AF" }}>Page title</span>}</div>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 600, color: GRAY }}>Folder</div>
            <div style={{ marginTop: 6, height: 40, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, color: INK, justifyContent: "space-between" }}>Root <span style={{ color: "#9CA3AF" }}>⌄</span></div>
            <div style={{ position: "absolute", right: 24, bottom: 20, display: "flex", gap: 8 }}><span style={{ width: 84, textAlign: "center", padding: "9px 0", borderRadius: 8, border: `1px solid ${LINE}`, fontWeight: 700, fontSize: 14 }}>Cancel</span><span style={{ width: 92, textAlign: "center", padding: "9px 0", borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 700, fontSize: 14, transform: `scale(${g >= 264 && g < 272 ? 0.93 : 1})` }}>Add page</span></div>
          </div>
        </div>
      )}
    </EdStage>
  );
};

const LibShell: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (
  <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * o})`, zIndex: 25 }}>
    <div style={{ position: "absolute", left: 200, top: 70, width: 1200, height: 740, borderRadius: 16, background: "#fff", opacity: o, overflow: "hidden" }}>{children}</div>
  </div>
);
const LibTabs: React.FC<{ tab: "Components" | "Pages" }> = ({ tab }) => (
  <div style={{ position: "absolute", right: 24, top: 24, display: "flex", padding: 3, borderRadius: 8, background: "#F3F4F6" }}>{(["Components", "Pages"] as const).map((x) => <span key={x} style={{ width: 110, textAlign: "center", padding: "7px 0", borderRadius: 6, fontSize: 13, fontWeight: 700, background: x === tab ? BLUE : "transparent", color: x === tab ? "#fff" : GRAY }}>{x}</span>)}</div>
);
const LIB_TAB_PAGES = { x: 200 + 1200 - 24 - 3 - 55, y: 70 + 24 + 17 };
const LibHead: React.FC = () => (<div style={{ position: "absolute", left: 24, top: 22 }}><div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Design library</div><div style={{ fontSize: 13, color: GRAY }}>Choose a polished component or start from a complete editable page.</div></div>);

// ═══ b3 — Library → Pages → Preview "Training Academy" (Desktop/Mobile) → Use page ═
const TPL_CARD = { x: 224, y: 170, w: 520, h: 520 };
const TPL_PREVIEW = { x: TPL_CARD.x + 16 + 50, y: TPL_CARD.y + 460 + 17 };
const TPL_USE_IN_PREVIEW = { x: 200 + 1200 - 24 - 60, y: 70 + 24 + 18 };
const SceneTemplate: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const lib = g >= 26 && g < 268 ? Math.min(fi(g, 26, 8), fo(g, 260, 8)) : 0;
  const pagesTab = g >= 66;
  const previewing = g >= 104;
  const pvDevice: "Desktop" | "Mobile" = g >= 185 && g < 225 ? "Mobile" : "Desktop";
  const pvScroll = interpolate(g, [115, 180, 230, 250], [0, 620, 620, 0], cl);
  const used = g >= 268;
  const LIBB = hbPt("Library");
  const MOBT = { x: 200 + 600 + 70, y: 70 + 24 + 17 };
  const cur = path(g, [[0, 140, 300], [16, LIBB.x, 28], [28, LIBB.x, 28], [56, LIB_TAB_PAGES.x, LIB_TAB_PAGES.y], [70, LIB_TAB_PAGES.x, LIB_TAB_PAGES.y], [94, TPL_PREVIEW.x, TPL_PREVIEW.y], [106, TPL_PREVIEW.x, TPL_PREVIEW.y], [175, MOBT.x, MOBT.y], [190, MOBT.x, MOBT.y], [215, MOBT.x - 110, MOBT.y], [228, MOBT.x - 110, MOBT.y], [250, TPL_USE_IN_PREVIEW.x, TPL_USE_IN_PREVIEW.y], [264, TPL_USE_IN_PREVIEW.x, TPL_USE_IN_PREVIEW.y], [420, 1100, 520]]);
  const ripple = Math.max(rip(g, 24), rip(g, 66), rip(g, 102), rip(g, 186), rip(g, 224), rip(g, 260));
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [14, LIBB.x - 80, 120, 1.9], [30, LIBB.x - 80, 120, 1.9], [50, 1150, 200, 1.6], [72, 1150, 200, 1.6], [92, 480, 520, 1.5], [108, 480, 520, 1.5], [120, 800, 440, 1.05], [240, 800, 440, 1.05], [252, 1250, 180, 1.7], [266, 1250, 180, 1.7], [285, 790, 430, 1.05], [420, 790, 430, 1.05]];
  const chip: [number, string] = !pagesTab ? [3, "Design library"] : !previewing ? [3, "Pages tab · complete page templates"] : !used ? [3, `Preview the template · ${pvDevice}`] : [3, "Use page — the whole page is ready to edit"];
  const pvW = pvDevice === "Desktop" ? 1100 : 380;
  return (
    <EdStage g={g} keys={keys} page="Programs" press={g >= 24 && g < 32 ? "Library" : undefined} on={lib > 0.5 ? "Library" : undefined} cur={cur} ripple={ripple} chip={chip}>
      <LeftPages hl="Programs" extra={["Programs"]} />
      <Canvas secs={used ? TEMPLATE.map((k, i) => ({ k, globalTag: k === "nav" || k === "footer", o: k === "nav" || k === "footer" ? 1 : interpolate(g, [270 + i * 8, 285 + i * 8], [0, 1], cl) })) : secsOf(["nav", "footer"])} scroll={used ? interpolate(g, [330, 415], [0, 820], cl) : 0} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {lib > 0.01 && (
        <LibShell o={lib}>
          {!previewing ? (
            <>
              <LibHead /><LibTabs tab={pagesTab ? "Pages" : "Components"} />
              {pagesTab ? [["Training Academy", "An education-first page connected to live programs and learner outcomes.", "Institutes and training providers", "#d97706"], ["SaaS Marketing", "A product marketing page with features, pricing and calls to action.", "Software & services", "#7c3aed"]].map(([n, d, a, c], i) => (
                <div key={n} style={{ position: "absolute", left: TPL_CARD.x - 200 + i * 560, top: TPL_CARD.y - 70, width: TPL_CARD.w, height: TPL_CARD.h, borderRadius: 14, border: `${i === 0 && g >= 90 ? 2 : 1}px solid ${i === 0 && g >= 90 ? BLUE : LINE}`, overflow: "hidden", opacity: fi(g, 66 + i * 4, 8) }}>
                  <div style={{ height: 330, background: `${c}10`, overflow: "hidden" }}><div style={{ transform: "scale(0.52)", transformOrigin: "0 0", width: 980, margin: "12px 0 0 12px", background: "#fff" }}>{(i === 0 ? TEMPLATE : (["nav", "hero", "features", "pricing", "testi", "cta"] as Sec[])).map((k) => <MiniSec key={k} k={k} w={980} />)}</div></div>
                  <div style={{ padding: 16 }}><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{n}</div><div style={{ marginTop: 4, fontSize: 13, color: GRAY }}>{d}</div><div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: c as string }}>{a}</div></div>
                  <span style={{ position: "absolute", left: 16, top: 460, width: 100, height: 34, borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i === 0 && g >= 102 && g < 108 ? 0.92 : 1})` }}>👁 Preview</span>
                  <span style={{ position: "absolute", left: 126, top: 460, width: 100, height: 34, borderRadius: 7, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Use page</span>
                </div>
              )) : <div style={{ position: "absolute", left: 24, top: 90, fontSize: 14, color: GRAY }}>Hero · Content · Forms · Dynamic · Conversion · Social proof</div>}
            </>
          ) : (
            <>
              <div style={{ position: "absolute", left: 24, top: 26, display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>← Back to library</span><span style={{ fontSize: 13, color: GRAY }}>Previewing <b style={{ color: INK }}>Training Academy</b></span></div>
              <div style={{ position: "absolute", left: 600, top: 24, display: "flex", border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>{["Desktop", "Tablet", "Mobile"].map((d) => <span key={d} style={{ width: 90, textAlign: "center", padding: "7px 0", fontSize: 12.5, fontWeight: 700, background: d === pvDevice ? BLUE_SOFT : "#fff", color: d === pvDevice ? BLUE : GRAY }}>{d}</span>)}</div>
              <span style={{ position: "absolute", right: 24, top: 24, width: 120, height: 36, borderRadius: 8, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 258 && g < 266 ? 0.92 : 1})` }}>Use page</span>
              <div style={{ position: "absolute", left: 24, top: 76, width: 1152, height: 640, borderRadius: 10, background: "#E9EDF3", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: (1152 - pvW) / 2, top: 12 - pvScroll, width: pvW, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: "Poppins, " + FONT }}>{TEMPLATE.map((k) => <MiniSec key={k} k={k} w={pvW} />)}</div>
              </div>
            </>
          )}
        </LibShell>
      )}
    </EdStage>
  );
};

// ═══ b4 — Library → Components → Conversion → Add block "Pricing" → drag a Divider ═
const BLK = (i: number) => ({ x: 224 + (i % 2) * 580, y: 210 + Math.floor(i / 2) * 270, w: 560, h: 250 });
const BLK_ADD = (i: number) => ({ x: BLK(i).x + 124 + 55, y: BLK(i).y + 200 + 17 });
const SceneAddBlocks: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const lib = g >= 26 && g < 140 ? Math.min(fi(g, 26, 8), fo(g, 132, 8)) : 0;
  const pricing = g >= 140;
  const drag = g >= 220 && g < 300;
  const dropped = g >= 300;
  const LIBB = hbPt("Library");
  const ADDB = BLK_ADD(0);
  const SCROLL = 380;
  const dropY = CAN.y + 12 - SCROLL + 48 + 210 + 64 + 150 + 150 - 2;
  const from = { x: 120, y: COMP_Y("Divider") };
  const to = { x: 790, y: dropY };
  const cur = path(g, [[0, 900, 500], [16, LIBB.x, 28], [28, LIBB.x, 28], [80, ADDB.x, ADDB.y], [122, ADDB.x, ADDB.y], [196, from.x, from.y], [220, from.x, from.y], [296, to.x, to.y], [420, to.x + 40, to.y + 80]]);
  const secs: Sec[] = ["nav", "hero", "stats", "programs", ...(pricing ? (["pricing"] as Sec[]) : []), ...(dropped ? (["divider"] as Sec[]) : []), "timeline", "instructors", "testi", "cta", "footer"];
  const keys: CamKey[] = [[0, 790, 430, 1.05], [14, LIBB.x - 80, 120, 1.9], [30, LIBB.x - 80, 120, 1.9], [60, 520, 380, 1.5], [124, 520, 380, 1.5], [150, 790, 430, 1.1], [190, 300, 450, 1.55], [230, 300, 600, 1.55], [290, 760, 360, 1.5], [420, 760, 360, 1.5]];
  const chip: [number, string] = g < 140 ? [4, "Design library · ready-made blocks"] : g < 200 ? [4, "Pricing block added"] : [4, "Drag any component exactly where you want it"];
  return (
    <EdStage g={g} keys={keys} page="Programs" on={lib > 0.5 ? "Library" : undefined} press={g >= 24 && g < 32 ? "Library" : undefined} cur={cur} ripple={Math.max(rip(g, 24), rip(g, 116))} grab={drag} chip={chip}>
      {g < 160 ? <LeftPages hl="Programs" extra={["Programs"]} /> : <LeftComps hl={drag ? "Divider" : undefined} />}
      <Canvas secs={secs.map((k) => ({ k, globalTag: k === "nav" || k === "footer", sel: (k === "pricing" && g >= 140 && g < 210) || (k === "divider" && dropped), o: k === "pricing" ? fi(g, 140, 10) : k === "divider" ? fi(g, 300, 8) : 1 }))} scroll={pricing ? interpolate(g, [140, 170], [0, SCROLL], cl) : 0} dropAt={drag && g > 260 ? 5 : -1} />
      <RightPanel title={g >= 140 && g < 210 ? "Pricing" : dropped ? "Divider" : "Page"}><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>{g >= 140 && g < 210 ? "Compare plans, benefits, and conversion actions." : dropped ? "Spacing and line style." : "Select a block to edit its content and style."}</div></RightPanel>
      {drag && <div style={{ position: "absolute", left: cur.x + 12, top: cur.y + 10, padding: "6px 12px", borderRadius: 8, background: "#fff", border: `2px solid ${BLUE}`, fontSize: 13, fontWeight: 700, color: BLUE, zIndex: 40 }}>⋮⋮ Divider</div>}
      {lib > 0.01 && (
        <LibShell o={lib}>
          <LibHead /><LibTabs tab="Components" />
          <div style={{ position: "absolute", left: 24, top: 86, display: "flex", gap: 8 }}>{["All", "Hero", "Content", "Forms", "Dynamic", "Conversion", "Social proof"].map((x) => <span key={x} style={{ padding: "7px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: x === "Conversion" ? INK : "#F3F4F6", color: x === "Conversion" ? "#fff" : "#374151" }}>{x}</span>)}</div>
          {[["Pricing", "Compare plans, benefits, and conversion actions.", "$", "#0891b2"], ["Frequently Asked Questions", "Expandable answers for common visitor questions.", "?", "#ea580c"], ["Card Grid", "Reusable linked cards for offers, resources, or services.", "▤", "#7c3aed"], ["Call to Action", "A focused standalone conversion button.", "→", "#059669"]].map(([n, d, ic, c], i) => {
            const b = BLK(i);
            return (
              <div key={n} style={{ position: "absolute", left: b.x - 200, top: b.y - 70, width: b.w, height: b.h, borderRadius: 12, border: `${i === 0 && g >= 76 ? 2 : 1}px solid ${i === 0 && g >= 76 ? BLUE : LINE}`, overflow: "hidden" }}>
                <div style={{ height: 120, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: c }}>{ic}</div>
                <div style={{ position: "absolute", left: 14, top: 130 }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{n}</div><div style={{ fontSize: 12.5, color: GRAY, marginTop: 3 }}>{d}</div></div>
                <span style={{ position: "absolute", left: 14, top: 200, width: 100, height: 34, borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>👁 Preview</span>
                <span style={{ position: "absolute", left: 124, top: 200, width: 110, height: 34, borderRadius: 7, background: BLUE, color: "#fff", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i === 0 && g >= 116 && g < 124 ? 0.92 : 1})` }}>+ Add block</span>
              </div>
            );
          })}
        </LibShell>
      )}
    </EdStage>
  );
};

// ═══ b5 — select the hero → edit fields (with real help texts) → style ═════
const SceneFields: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const sel = g >= 40;
  const line1 = g < 90 ? "Launch your career with" : typed(g, 90, "Start your new career at", 0.9) || "";
  const hi = g < 170 ? BRAND : typed(g, 170, "Brightpath this fall", 0.9) || "";
  const cta = g < 250 ? "Browse programs" : typed(g, 250, "See fall programs", 0.9) || "";
  const HERO = { x: 600, y: 210 };
  const F1 = { x: 1450, y: 160 }, F2 = { x: 1450, y: 250 }, F3 = { x: 1450, y: 340 };
  const cur = path(g, [[0, 900, 500], [30, HERO.x, HERO.y], [44, HERO.x, HERO.y], [80, F1.x, F1.y], [160, F1.x, F1.y], [170, F2.x, F2.y], [240, F2.x, F2.y], [250, F3.x, F3.y], [330, F3.x, F3.y], [420, 1450, 520]]);
  const keys: CamKey[] = [[0, 790, 430, 1.05], [30, 640, 230, 1.5], [60, 640, 230, 1.5], [80, 1280, 230, 1.6], [330, 1280, 300, 1.6], [360, 900, 300, 1.3], [420, 900, 300, 1.3]];
  return (
    <EdStage g={g} keys={keys} page="Programs" cur={cur} ripple={rip(g, 40)} chip={[5, "Click a block · edit its text and style"]}>
      <LeftComps />
      <Canvas secs={["nav", "hero", "stats", "programs", "pricing"].map((k) => ({ k: k as Sec, globalTag: k === "nav", sel: k === "hero" && sel, title: line1, hi, cta }))} />
      <RightPanel title={sel ? "Academy Hero" : "Page"}>
        {sel ? (
          <div style={{ opacity: fi(g, 40, 8) }}>
            <FieldBox label="Title line" help="One line of the stacked hero title." value={line1} active={g >= 80 && g < 165} />
            <FieldBox label="Highlight" help="Highlighted word or phrase inside the hero title." value={hi} active={g >= 165 && g < 245} />
            <FieldBox label="CTA label" help="Optional icon displayed next to the CTA label." value={cta} active={g >= 245 && g < 330} />
            <div style={{ marginTop: 16, fontSize: 11.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>STYLE</div>
            {[["Padding", "Default"], ["Background", BP], ["Text align", "Left"]].map(([a, b]) => <div key={a} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span style={{ color: "#374151", fontWeight: 600 }}>{a}</span><span style={{ color: GRAY, fontFamily: "monospace" }}>{b}</span></div>)}
          </div>
        ) : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}
      </RightPanel>
    </EdStage>
  );
};

// ═══ b6 — Build with AI: Section → describe → Look → Generate section → Add to page ═
const AI_PROMPT = "A short FAQ section for our fall programs: schedule, live classes, certificates, and payment options.";
const AIM = { x: 300, y: 90, w: 1000, h: 640 };
const AI_GEN = { x: AIM.x + AIM.w - 26 - 95, y: AIM.y + AIM.h - 22 - 21 };
const AI_ADD = { x: AIM.x + AIM.w - 26 - 14 - 65, y: AIM.y + 392 + 28 };
const AI_BOX = { x: AIM.x + 400, y: AIM.y + 176 + 55 };
const SceneAiSection: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const m = g >= 26 && g < 300 ? Math.min(fi(g, 26, 8), fo(g, 292, 8)) : 0;
  const gen = interpolate(g, [220, 250], [0, 1], cl);
  const added = g >= 296;
  const AIB = hbPt("AI");
  const cur = path(g, [[0, 900, 500], [16, AIB.x, 28], [28, AIB.x, 28], [60, AI_BOX.x, AI_BOX.y], [180, AI_BOX.x, AI_BOX.y], [204, AI_GEN.x, AI_GEN.y], [222, AI_GEN.x, AI_GEN.y], [262, AI_ADD.x, AI_ADD.y], [290, AI_ADD.x, AI_ADD.y], [420, 900, 560]]);
  const SCROLL = 380;
  const keys: CamKey[] = [[0, 790, 430, 1.05], [14, AIB.x - 60, 120, 2.0], [30, AIB.x - 60, 120, 2.0], [56, 760, 380, 1.5], [196, 760, 380, 1.5], [214, 1050, 600, 1.6], [240, 1050, 600, 1.6], [262, 1050, 480, 1.6], [292, 1050, 480, 1.6], [320, 790, 430, 1.1], [420, 790, 430, 1.1]];
  const secs: Sec[] = ["nav", "hero", "stats", "programs", "pricing", ...(added ? (["faq"] as Sec[]) : []), "timeline", "testi", "footer"];
  const chip: [number, string] = g < 210 ? [6, "Build with AI · Section from a prompt"] : !added ? [6, "Generate section → Add to page"] : [6, "AI section added — fully editable"];
  return (
    <EdStage g={g} keys={keys} page="Programs" on={m > 0.5 ? "AI" : undefined} press={g >= 24 && g < 32 ? "AI" : undefined} cur={cur} ripple={Math.max(rip(g, 24), rip(g, 218), rip(g, 286))} chip={chip}>
      <LeftComps />
      <Canvas secs={secs.map((k) => ({ k, globalTag: k === "nav" || k === "footer", sel: k === "faq", o: k === "faq" ? fi(g, 296, 12) : 1 }))} scroll={added ? interpolate(g, [296, 330], [0, SCROLL], cl) : 0} />
      <RightPanel title={added ? "Frequently asked questions" : "Page"}>{added ? <div style={{ opacity: fi(g, 300, 8) }}><FieldBox label="Title" value="Frequently asked questions" /><FieldBox label="Question 1" value="When do the fall programs start?" /><FieldBox label="Question 2" value="Are classes live or online?" /></div> : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}</RightPanel>
      {m > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * m})`, zIndex: 25 }}>
          <div style={{ position: "absolute", left: AIM.x, top: AIM.y, width: AIM.w, height: AIM.h, borderRadius: 16, background: "#fff", opacity: m }}>
            <div style={{ position: "absolute", left: 26, top: 24, fontSize: 22, fontWeight: 800, color: INK }}>✨ Build with AI</div>
            <div style={{ position: "absolute", left: 26, right: 26, top: 66, display: "flex", gap: 10 }}>{[["Section", "One section from a prompt"], ["Full page", "A complete page"], ["Import HTML", "Convert an HTML file"]].map(([tt, s], i) => <div key={tt} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `${i === 0 ? 2 : 1}px solid ${i === 0 ? BLUE : LINE}`, background: i === 0 ? BLUE_SOFT : "#fff" }}><div style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? BLUE : INK }}>{tt}</div><div style={{ fontSize: 12.5, color: GRAY }}>{s}</div></div>)}</div>
            <div style={{ position: "absolute", left: 26, top: 150, fontSize: 14, fontWeight: 800, color: "#374151" }}>Describe the section</div>
            <div style={{ position: "absolute", left: 26, right: 26, top: 176, height: 110, borderRadius: 10, border: `1px solid ${g >= 60 && g < 200 ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: g >= 60 && g < 200 ? "0 0 0 3px #C7D2FE" : "none", padding: 12, boxSizing: "border-box", fontSize: 15, color: INK, lineHeight: 1.5 }}>{typed(g, 64, AI_PROMPT, 0.95) || <span style={{ color: "#9CA3AF" }}>e.g. A pricing section for an online coding bootcamp with three plans…</span>}</div>
            <div style={{ position: "absolute", left: 26, top: 300, fontSize: 14, fontWeight: 800, color: "#374151" }}>Look</div>
            <div style={{ position: "absolute", left: 26, top: 326, display: "flex", gap: 8 }}>{["Match brand", "Clean light", "Bold dark", "Vibrant", "Editorial"].map((x, i) => <span key={x} style={{ padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: i === 0 ? INK : "#F3F4F6", color: i === 0 ? "#fff" : "#374151" }}>{x}</span>)}</div>
            {gen > 0 && gen < 1 && <div style={{ position: "absolute", left: 26, right: 26, top: 400, display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>✨ Generating section…</span><div style={{ flex: 1, height: 8, borderRadius: 4, background: "#E0E7FF" }}><div style={{ width: `${gen * 100}%`, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#7C3AED,#2563EB)" }} /></div></div>}
            {gen >= 1 && <div style={{ position: "absolute", left: 26, right: 26, top: 392, height: 56, borderRadius: 10, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", boxSizing: "border-box", opacity: fi(g, 250, 8) }}><span style={{ fontSize: 13.5 }}><b>Frequently asked questions</b> · AI, fully editable</span><span style={{ flex: 1 }} /><span style={{ width: 130, height: 36, borderRadius: 8, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 286 && g < 294 ? 0.92 : 1})` }}>＋ Add to page</span></div>}
            {gen >= 1 && <div style={{ position: "absolute", left: 26, right: 26, top: 458, height: 150, borderRadius: 10, overflow: "hidden", border: `1px solid ${LINE}`, opacity: fi(g, 252, 8) }}><MiniSec k="faq" w={948} /></div>}
            <span style={{ position: "absolute", right: 26, bottom: 22, width: 190, height: 42, borderRadius: 9, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 14.5, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 218 && g < 226 ? 0.93 : 1})` }}>✨ Generate section</span>
          </div>
        </div>
      )}
    </EdStage>
  );
};

// ═══ b7 — Global Footer: edit once, it updates on every page ═══════════════
const SceneGlobal: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = gt(f, dur, D);
  const onFooter = g >= 50;
  const note = g < 120 ? "" : typed(g, 120, "Call us: (512) 555-0186", 0.9);
  const pagesPeek = g >= 250;
  const GF = { x: 110, y: 56 + 12 + 26 + 4 + 34 + 15 };
  const NOTE = { x: 1450, y: 160 };
  const cur = path(g, [[0, 900, 500], [30, GF.x, GF.y], [46, GF.x, GF.y], [100, NOTE.x, NOTE.y], [220, NOTE.x, NOTE.y], [380, 900, 600]]);
  const keys: CamKey[] = [[0, 790, 430, 1.05], [24, 200, 140, 2.2], [48, 200, 140, 2.2], [80, 1100, 200, 1.5], [230, 1100, 200, 1.5], [260, 790, 430, 1.05], [380, 790, 430, 1.05]];
  return (
    <EdStage g={g} keys={keys} page={onFooter ? "Global Footer" : "Programs"} cur={cur} ripple={rip(g, 44)} chip={[7, pagesPeek ? "Edit once — every page gets the new footer" : "Global Footer"]}>
      <LeftPages hl={onFooter ? "Global Footer" : "Programs"} extra={["Programs"]} />
      {!pagesPeek ? (
        <Canvas secs={onFooter ? [{ k: "footer", footerNote: note, sel: true, globalTag: true }] : secsOf(["nav", "hero", "footer"])} />
      ) : (
        <div style={{ position: "absolute", left: CAN.x, top: CAN.y, width: CAN.w, height: CAN.h, background: "#E9EDF3", borderRadius: 12, overflow: "hidden" }}>
          {["Home", "About", "Programs"].map((p, i) => (
            <div key={p} style={{ position: "absolute", left: 20 + i * 330, top: 40, width: 310, height: 680, borderRadius: 10, background: "#fff", overflow: "hidden", opacity: sp(g, 250 + i * 10, fps), boxShadow: "0 6px 18px #0F172A1A" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: GRAY, padding: "8px 10px", borderBottom: "1px solid #EEF2F7" }}>{p}</div>
              <div style={{ transform: "scale(0.31)", transformOrigin: "0 0", width: 1000 }}>{(["nav", "hero", "stats", "programs", "features", "cta"] as Sec[]).map((k) => <MiniSec key={k} k={k} w={980} />)}</div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}><MiniSec k="footer" w={310} footerNote="Call us: (512) 555-0186" /></div>
            </div>
          ))}
        </div>
      )}
      <RightPanel title={onFooter ? "Global Footer" : "Page"}>
        {onFooter ? <div style={{ opacity: fi(g, 50, 8) }}><FieldBox label="Contact line" value={note || ""} active={g >= 100 && g < 230} /><FieldBox label="Copyright" value={`© 2026 ${BRAND}`} /></div> : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}
      </RightPanel>
    </EdStage>
  );
};

// ═══ b8 — Preview on Desktop / Tablet / Mobile + Page SEO ══════════════════
const ScenePreviewSeo: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const device: "Desktop" | "Tablet" | "Mobile" = g < 60 ? "Desktop" : g < 120 ? "Tablet" : "Mobile";
  const seo = g >= 190 && g < 380 ? Math.min(fi(g, 190, 8), fo(g, 370, 8)) : 0;
  const SEOB = hbPt("Page SEO");
  const cur = path(g, [[0, 900, 500], [170, SEOB.x, 28], [188, SEOB.x, 28], [230, 800, 330], [400, 800, 430]]);
  const keys: CamKey[] = [[0, 790, 430, 1.05], [40, 790, 430, 1.05], [170, SEOB.x - 60, 110, 2.0], [190, SEOB.x - 60, 110, 2.0], [220, 800, 420, 1.45], [370, 800, 420, 1.45], [400, 790, 430, 1.05]];
  const sTitle = typed(g, 230, "Fall 2026 Programs | Brightpath Academy", 1.1);
  const sDesc = typed(g, 270, "Career training in customer service and sales. Online and live classes, with certificates.", 1.6);
  return (
    <EdStage g={g} keys={keys} page="Programs" on={seo > 0.5 ? "Page SEO" : undefined} press={g >= 184 && g < 192 ? "Page SEO" : undefined} cur={cur} ripple={rip(g, 184)} chip={[8, g < 170 ? `Preview · ${device}` : "Page SEO · search preview"]}>
      <LeftComps />
      <Canvas device={device} secs={(["nav", "hero", "stats", "programs", "pricing", "features", "footer"] as Sec[]).map((k) => ({ k, globalTag: k === "nav" || k === "footer" }))} />
      <div style={{ position: "absolute", left: CAN.x + CAN.w / 2 - 150, top: 800, width: 300, display: "flex", borderRadius: 9, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden", zIndex: 8 }}>{["Desktop", "Tablet", "Mobile"].map((d) => <span key={d} style={{ flex: 1, textAlign: "center", padding: "8px 0", fontSize: 13, fontWeight: 800, background: d === device ? BLUE : "#fff", color: d === device ? "#fff" : GRAY }}>{d === "Desktop" ? "🖥" : d === "Tablet" ? "▭" : "📱"} {d}</span>)}</div>
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {seo > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * seo})`, zIndex: 25 }}>
          <div style={{ position: "absolute", left: 380, top: 110, width: 840, height: 600, borderRadius: 16, background: "#fff", padding: 26, boxSizing: "border-box", opacity: seo }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: INK }}>Page SEO · Programs</div>
            <FieldBox label="SEO title" value={sTitle || "Leave empty to use Site SEO title"} active={g >= 230 && g < 268} />
            <FieldBox label="Meta description" value={sDesc || "Leave empty to use Site SEO description"} active={g >= 268} />
            <div style={{ marginTop: 18, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Search preview</div>
            <div style={{ marginTop: 8, padding: 14, borderRadius: 10, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 12.5, color: "#16A34A" }}>{DOMAIN} › programs</div>
              <div style={{ fontSize: 18, color: "#1A0DAB", marginTop: 2 }}>{sTitle || "Programs"}</div>
              <div style={{ fontSize: 13, color: "#4D5156", marginTop: 2 }}>{sDesc}</div>
            </div>
          </div>
        </div>
      )}
    </EdStage>
  );
};

// ═══ b9 — Save draft → Publish changes → Live → the real site ══════════════
const ScenePublish: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 430;
  const g = gt(f, dur, D);
  const live = g >= 200;
  const SAVEB = hbPt("Save draft"), PUBB = hbPt("Publish changes"), LIVEB = hbPt("Live");
  const cur = path(g, [[0, 900, 500], [30, SAVEB.x, 28], [46, SAVEB.x, 28], [90, PUBB.x, 28], [106, PUBB.x, 28], [160, LIVEB.x, 28], [178, LIVEB.x, 28], [200, LIVEB.x, 28]]);
  const keys: CamKey[] = live ? [[0, WIDE_X, WIDE_Y, 1], [430, WIDE_X, WIDE_Y, 1]] : [[0, 790, 430, 1.05], [28, SAVEB.x - 80, 110, 2.1], [90, PUBB.x - 100, 110, 2.1], [150, LIVEB.x - 140, 110, 2.1], [200, LIVEB.x - 140, 110, 2.1]];
  if (live) {
    return (
      <Stage>
        <PortalTag n={2} label="Your website" url={DOMAIN} />
        <CamC g={g} keys={keys}>
          <Browser url={`${DOMAIN}/programs`}>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 200, 10) }}><BrightSite g={g - 200} fps={fps} scroll={interpolate(g, [220, 420], [0, SITE_H - 856], cl)} /></div>
          </Browser>
        </CamC>
      </Stage>
    );
  }
  return (
    <EdStage g={g} keys={keys} page="Programs" press={g >= 42 && g < 50 ? "Save draft" : g >= 102 && g < 110 ? "Publish changes" : g >= 174 && g < 182 ? "Live" : undefined} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 102), rip(g, 174))} chip={[9, g < 100 ? "Save draft" : "Publish changes → Live"]}>
      <LeftComps />
      <Canvas secs={(["nav", "hero", "stats", "programs", "pricing", "features", "footer"] as Sec[]).map((k) => ({ k, globalTag: k === "nav" || k === "footer" }))} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {g >= 48 && g < 104 && <Toast g={g} at={48} text="Draft saved" x={1180} y={70} />}
      {g >= 108 && <Toast g={g} at={108} text="Page and global design published" x={1000} y={70} />}
    </EdStage>
  );
};

// ═══ b10 — WRAP ════════════════════════════════════════════════════════════
const SceneWrapWB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 200;
  const g = gt(f, dur, D);
  const steps = [["📄", "Pages", "Global header & footer"], ["▤", "Library", "Blocks + page templates"], ["⋮⋮", "Drag & drop", "Every section"], ["✨", "AI", "Sections from a prompt"], ["🚀", "Publish", "Live in one click"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}><Img src={staticFile("skillbnk-logo.png")} style={{ width: 380 }} /></div>
        <div style={{ position: "absolute", left: 110, top: 340, width: 1700, display: "flex", gap: 22 }}>
          {steps.map(([ic, t, s], i) => { const p = sp(g, 20 + i * 10, fps); return <div key={t} style={{ flex: 1, height: 230, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF666", opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 48 }}>{ic}</div><div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{t}</div><div style={{ marginTop: 6, fontSize: 17, color: "#8A96B2" }}>{s}</div></div>; })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 80, 12) }}>Your website. <span style={{ color: "#5EEAD4" }}>No developer needed.</span></div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ Composition ═════════════════════════════════════════════════════════════
const SCENES: Record<Key, React.FC<SceneProps>> = {
  b0: SceneHookWB, b1: SceneEditorTour, b2: ScenePages, b3: SceneTemplate, b4: SceneAddBlocks, b5: SceneFields, b6: SceneAiSection, b7: SceneGlobal, b8: ScenePreviewSeo, b9: ScenePublish, b10: SceneWrapWB,
};

export const WebsiteBuilderVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {ALL.map((k) => {
        const Scene = SCENES[k];
        const d = LEN[k] + (k === "b10" ? TAIL : 0);
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
          <Audio src={staticFile(`websitebuilder/${k}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
