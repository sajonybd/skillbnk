import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  staticFile,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";

/**
 * ReelBulkEnrollVideo — 1080x1920 vertical Reel / Short / TikTok (≈49s: hook → main intro → explain → main outro).
 * Topic: "Enroll your whole team with one CSV" (Bulk Enrollment, SB-Branch).
 * Claims verified in code (skillbnk-code-facts.md / three-niche-videos doc / _parts/bulk.part.tsx):
 *  Template CSV fields Email, Program, Session, First Name, Last Name (names used only for new users);
 *  steps Upload CSV → Map Fields → Validate → Preview & Enroll; "Validation Results";
 *  statuses "Will Enroll" / "Already Enrolled"; button "Enroll N Students"; result "Enrollment Queued";
 *  Bulk Enroll emails login credentials to newly created users.
 * All names are fictional (Brookfield Property Management).
 * Structure = every skillBNK video: Hook → MainIntro → explain → MainOutro (both shared, portrait layouts).
 * No on-screen transcript/captions (user, 2026-10-10).
 * Voice: `bash generate-voice-reel.sh` → public/reel/v0..v5.mp3 (patches DURATIONS + VOICED).
 */

const DURATIONS = {
  v0: 270,
  v1: 200,
  v2: 210,
  v3: 230,
  v4: 150,
  v5: 140,
};
const VOICED: string[] = [];
const ORDER = ["v0", "v1", "v2", "v3", "v4", "v5"] as const;
type Key = (typeof ORDER)[number];
const TR = 12; // transition overlap (frames): a scene fades/slides out under the next one

const starts: Record<Key, number> = (() => {
  let t = 0;
  const o = {} as Record<Key, number>;
  ORDER.forEach((k) => {
    o[k] = t;
    t += DURATIONS[k];
    if (k === "v0") t += INTRO_FRAMES; // Hook → MAIN INTRO → explain → MAIN OUTRO (house order)
  });
  return o;
})();
const INTRO_START = starts.v0 + DURATIONS.v0;
const SCENES_END = ORDER.reduce((s, k) => s + DURATIONS[k], 0) + INTRO_FRAMES;
export const TOTAL_FRAMES = SCENES_END + OUTRO_FRAMES;


const C = {
  bg1: "#040716",
  bg2: "#0b2260",
  blue: "#3b82f6",
  cyan: "#22d3ee",
  red: "#ef4444",
  green: "#22c55e",
  amber: "#f59e0b",
  white: "#ffffff",
  mute: "#9fb3d9",
  card: "#0e1730",
};
const FONT = "'Inter','SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif";
const HAND = "'Caveat','Bradley Hand','Noteworthy','Segoe Print',cursive";
const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const prog = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clampX, easing: OUT });

/* ───────────────────────── background: orbs, grid, particles ───────────────────────── */

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const parts = Array.from({ length: 34 }, (_, i) => {
    const speed = 0.5 + (i % 5) * 0.25;
    const y = 1980 - ((f * speed * 2.2 + i * 313) % 2100);
    const x = (i * 211) % 1080 + Math.sin((f + i * 20) / 50) * 18;
    const s = 4 + (i % 4) * 3;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: s,
          height: s,
          borderRadius: s,
          background: i % 3 === 0 ? C.cyan : C.blue,
          opacity: 0.12 + (i % 4) * 0.08,
          filter: "blur(1px)",
        }}
      />
    );
  });
  const orb = (cx: number, cy: number, r: number, col: string, ph: number) => (
    <div
      style={{
        position: "absolute",
        left: cx + Math.sin(f / 70 + ph) * 90 - r,
        top: cy + Math.cos(f / 90 + ph) * 110 - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        background: `radial-gradient(circle, ${col} 0%, transparent 68%)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg1} 0%, #07123a 100%)`, overflow: "hidden" }}>
      {orb(220, 500, 520, "#1d4ed855", 0)}
      {orb(900, 1250, 560, "#0891b244", 2)}
      {orb(540, 1750, 480, "#3730a355", 4)}
      <AbsoluteFill
        style={{
          opacity: 0.1,
          backgroundImage:
            "linear-gradient(rgba(120,160,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,255,.7) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          transform: `translateY(${(f * 0.6) % 90}px)`,
        }}
      />
      {parts}
    </AbsoluteFill>
  );
};

/* ───────────────────────── building blocks ───────────────────────── */

const Pop: React.FC<{
  at?: number;
  from?: "up" | "down" | "left" | "right" | "zoom";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at = 0, from = "up", children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 150 } });
  const d = (1 - s) * 70;
  const tx = from === "left" ? -d : from === "right" ? d : 0;
  const ty = from === "up" ? d : from === "down" ? -d : 0;
  const sc = from === "zoom" ? 0.5 + 0.5 * s : 0.94 + 0.06 * s;
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 0.35], [0, 1], clampX),
        transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Headline: words drop in one by one; `hl` lines glow cyan with an animated underline. */
const Headline: React.FC<{ lines: { t: string; hl?: boolean }[]; at?: number; size?: number }> = ({
  lines,
  at = 4,
  size = 100,
}) => {
  const f = useCurrentFrame();
  let w = 0;
  return (
    <div style={{ position: "absolute", top: 120, left: 50, right: 50, textAlign: "center", fontFamily: FONT }}>
      {lines.map((l, li) => {
        const words = l.t.split(" ");
        const lineStart = w;
        w += words.length;
        const u = prog(f, at + lineStart * 6 + 14, at + lineStart * 6 + 34);
        return (
          <div key={li} style={{ position: "relative", display: "block", lineHeight: 1.1 }}>
            {words.map((word, wi) => {
              const a = at + (lineStart + wi) * 6;
              const p = prog(f, a, a + 16);
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: size * 0.22,
                    fontSize: size,
                    fontWeight: 900,
                    letterSpacing: -2,
                    color: l.hl ? C.cyan : C.white,
                    textShadow: l.hl ? `0 0 44px ${C.cyan}77` : "0 6px 30px rgba(0,0,0,.5)",
                    opacity: p,
                    transform: `translateY(${(1 - p) * -60}px) rotate(${(1 - p) * -4}deg)`,
                    filter: `blur(${(1 - p) * 10}px)`,
                  }}
                >
                  {word}
                </span>
              );
            })}
            {l.hl && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 2,
                  height: 8,
                  width: `${u * 62}%`,
                  transform: "translateX(-50%)",
                  borderRadius: 8,
                  background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
                  boxShadow: `0 0 24px ${C.cyan}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/** The 4 real steps of Bulk Enrollment, as a progress rail. `active` can be fractional. */
const STEPS = ["Upload CSV", "Map Fields", "Validate", "Preview & Enroll"];
const StepRail: React.FC<{ active: number; top?: number }> = ({ active, top = 395 }) => (
  <div style={{ position: "absolute", top, left: 70, right: 70, fontFamily: FONT }}>
    <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 27, height: 6, background: "rgba(255,255,255,.14)", borderRadius: 6 }} />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 27,
          height: 6,
          width: `calc((100% - 120px) * ${Math.min(1, active / 3)})`,
          background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
          borderRadius: 6,
          boxShadow: `0 0 20px ${C.cyan}`,
        }}
      />
      {STEPS.map((s, i) => {
        const done = active >= i + 0.99;
        const on = active >= i - 0.01 && !done;
        return (
          <div key={s} style={{ width: 200, textAlign: "center", position: "relative" }}>
            <div
              style={{
                width: 60,
                height: 60,
                margin: "0 auto",
                borderRadius: 30,
                background: done ? C.green : on ? C.cyan : "#1b2750",
                color: "#04101f",
                fontWeight: 900,
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${on ? 1.15 : 1})`,
                boxShadow: on ? `0 0 34px ${C.cyan}` : "none",
              }}
            >
              {done ? "✓" : <span style={{ color: on ? "#04101f" : C.mute }}>{i + 1}</span>}
            </div>
            <div style={{ marginTop: 12, fontSize: 25, fontWeight: 800, color: on || done ? C.white : C.mute }}>{s}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const Ripple: React.FC<{ at: number; x: number; y: number; color?: string }> = ({ at, x, y, color = C.cyan }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 22], [0, 1], clampX);
  if (f < at || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 90,
        top: y - 90,
        width: 180,
        height: 180,
        borderRadius: 90,
        border: `6px solid ${color}`,
        opacity: 1 - p,
        transform: `scale(${0.2 + p * 1.3})`,
      }}
    />
  );
};

const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>
    <path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z" fill="#fff" stroke="#0b1430" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

/* ───────────────────────── camera: every scene zooms onto what matters ───────────────────────── */
// Keyframe = [frame, focusX, focusY, scale] in 1080x1920 frame coordinates. The focus point is moved to the
// centre of the viewport (540, 1010) at that scale, so small UI (badges, buttons, rows) is big enough to read
// on a phone. Headline + step rail stay fixed outside the camera.
type CamKey = [number, number, number, number];
const CAM_CX = 540;
const CAM_CY = 1010;
const camEase = Easing.inOut(Easing.cubic);
const camAt = (f: number, keys: CamKey[]): [number, number, number] => {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2], keys[0][3]];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f < b[0]) {
      const t = camEase((f - a[0]) / (b[0] - a[0]));
      return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t];
    }
  }
  const z = keys[keys.length - 1];
  return [z[1], z[2], z[3]];
};
const Cam: React.FC<{ keys: CamKey[]; top?: number; children: React.ReactNode }> = ({ keys, top = 560, children }) => {
  const f = useCurrentFrame();
  const [fx, fy, s] = camAt(f, keys);
  const mask = `linear-gradient(to bottom, transparent ${top}px, #000 ${top + 40}px, #000 1520px, transparent 1565px)`;
  return (
    <AbsoluteFill style={{ clipPath: `inset(${top}px 0 355px 0)`, WebkitMaskImage: mask, maskImage: mask }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${CAM_CX - fx * s}px, ${CAM_CY - fy * s}px) scale(${s})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/* Scene wrapper: transitions (blur-zoom / slide / flip), light streak, slow camera push, caption, audio. */
const VARIANTS = ["slideUp", "zoom", "slideLeft", "flip", "zoom", "slideUp"] as const;
const SceneShell: React.FC<{ k: Key; i: number; children: React.ReactNode }> = ({ k, i, children }) => {
  const f = useCurrentFrame();
  const D = DURATIONS[k] + TR; // visual runs TR frames into the next scene
  const v = VARIANTS[i];
  const e = interpolate(f, [0, TR + 6], [0, 1], { ...clampX, easing: OUT });
  const x = interpolate(f, [D - TR, D], [0, 1], { ...clampX, easing: Easing.in(Easing.cubic) });
  const first = i === 0;
  const en = first ? 1 : e;
  let tx = 0, ty = 0, sc = 1, rot = 0, blur = 0, rx = 0;
  if (v === "slideUp") ty = (1 - en) * 220 - x * 160;
  if (v === "slideLeft") tx = (1 - en) * 420 - x * 300;
  if (v === "zoom") { sc = 1.18 - 0.18 * en - x * 0.1; }
  if (v === "flip") { rx = (1 - en) * 38 - x * 28; ty = (1 - en) * 80; }
  blur = (1 - en) * 16 + x * 12;
  const push = 1 + (f / D) * 0.045;
  const streakP = interpolate(f, [0, TR + 16], [0, 1], clampX);
  return (
    <AbsoluteFill style={{ opacity: en * (1 - x), perspective: 1400 }}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${sc * push}) rotateX(${rx}deg) rotate(${rot}deg)`,
          filter: `blur(${blur}px)`,
          transformOrigin: "50% 55%",
        }}
      >
        {children}
      </AbsoluteFill>
      {!first && streakP < 1 && (
        <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: -300,
              bottom: -300,
              width: 340,
              left: -500 + streakP * 2000,
              transform: "rotate(18deg)",
              background: `linear-gradient(90deg, transparent, ${C.cyan}aa, #ffffffcc, ${C.blue}aa, transparent)`,
              opacity: 0.55 * (1 - streakP),
              filter: "blur(18px)",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ───────────────────────── v0 HOOK ───────────────────────── */

const NAMES = [
  "Rachel Moore — r.moore@bpm.co",
  "Daniel Ortiz — d.ortiz@bpm.co",
  "Priya Shah — p.shah@bpm.co",
  "Tom Becker — t.becker@bpm.co",
  "Alicia Grant — a.grant@bpm.co",
  "Marcus Lee — m.lee@bpm.co",
];

const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counter = Math.min(48, Math.floor(interpolate(f, [4, 190], [1, 48], clampX)));
  const stamp = spring({ frame: f - 178, fps, config: { damping: 9, stiffness: 190 } });
  const shake = f > 178 && f < 192 ? Math.sin(f * 2.4) * (192 - f) * 0.9 : 0;
  const nb = prog(f, 6, 30);
  const arc = counter / 48;
  return (
    <>
      <Headline lines={[{ t: "48 new hires." }, { t: "Typed one by one?", hl: true }]} />
      <Cam keys={CAM_V0} top={400}>
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 80,
          right: 80,
          opacity: nb,
          transform: `translateY(${(1 - nb) * 120}px) rotate(${-2.5 + shake * 0.1}deg) translateX(${shake}px)`,
          background: "#fbf6e6",
          borderRadius: 22,
          padding: "34px 40px 30px 70px",
          boxShadow: "0 40px 90px rgba(0,0,0,.55)",
          fontFamily: HAND,
          fontSize: 50,
          color: "#1d2a4a",
          minHeight: 470,
          backgroundImage: "repeating-linear-gradient(transparent 0 79px, #c9d6f2 79px 81px)",
        }}
      >
        <div style={{ position: "absolute", left: 46, top: 0, bottom: 0, width: 3, background: "#f2a1a1" }} />
        {NAMES.map((n, i) => {
          const start = 14 + i * 26;
          const chars = Math.max(0, Math.floor((f - start) * 1.7));
          const txt = n.slice(0, chars);
          const showCaret = chars > 0 && chars < n.length;
          return (
            <div key={i} style={{ height: 80, lineHeight: "80px", whiteSpace: "nowrap", minHeight: 80 }}>
              {chars > 0 && <>{i + 1}. {txt}</>}
              {showCaret && <span style={{ opacity: Math.floor(f / 4) % 2 }}>|</span>}
            </div>
          );
        })}
        {/* stamp */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 150,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 118,
            color: C.red,
            background: "rgba(251,246,230,.92)",
            border: `10px solid ${C.red}`,
            borderRadius: 24,
            padding: "4px 40px",
            letterSpacing: 6,
            whiteSpace: "nowrap",
            opacity: f >= 178 ? 0.96 : 0,
            transform: `translateX(-50%) rotate(-10deg) scale(${3 - 2 * Math.min(1, stamp)})`,
          }}
        >
          SLOW
        </div>
      </div>
      {/* counter with progress ring */}
      <Pop at={20} from="zoom" style={{ position: "absolute", top: 1160, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28, alignItems: "center" }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,.15)" strokeWidth="12" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke={C.red}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${arc * 314} 314`}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 62,
            color: C.white,
            background: C.red,
            borderRadius: 999,
            padding: "14px 44px",
            boxShadow: `0 0 ${50 + (counter % 2) * 20}px ${C.red}99`,
          }}
        >
          Typed: {counter} / 48
        </div>
      </Pop>
      </Cam>
    </>
  );
};

/* ───────────────────────── v1 TEMPLATE ───────────────────────── */

const TEMPLATE_FIELDS = [
  { h: "Email", v: "r.moore@bpm.co" },
  { h: "Program", v: "CRM Rollout" },
  { h: "Session", v: "Oct 2026 Team" },
  { h: "First Name", v: "Rachel" },
  { h: "Last Name", v: "Moore" },
];

const TemplateScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = spring({ frame: f - 30, fps, config: { damping: 8, stiffness: 220 } });
  const sheet = prog(f, 38, 66);
  const curX = interpolate(f, [4, 26], [900, 600], { ...clampX, easing: OUT });
  const curY = interpolate(f, [4, 26], [900, 612], { ...clampX, easing: OUT });
  return (
    <>
      <Headline lines={[{ t: "Download" }, { t: "the template.", hl: true }]} />
      <StepRail active={interpolate(f, [0, 20], [-0.2, 0.0], clampX)} />
      <Cam keys={CAM_V1} top={560}>
      <div style={{ position: "absolute", top: 585, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pop at={6} from="zoom">
          <div
            style={{
              fontFamily: FONT,
              fontSize: 40,
              fontWeight: 900,
              color: C.white,
              background: C.blue,
              borderRadius: 24,
              padding: "20px 46px",
              transform: `scale(${1 - 0.08 * Math.sin(Math.min(1, press) * Math.PI)})`,
              boxShadow: `0 0 50px ${C.blue}aa`,
            }}
          >
            <span style={{ display: "inline-block", transform: `translateY(${Math.sin(f / 5) * 5}px)` }}>⤓</span> Template CSV
          </div>
        </Pop>
      </div>
      <Ripple at={30} x={540} y={622} />
      {f < 40 && <Cursor x={curX} y={curY} />}
      <div
        style={{
          position: "absolute",
          top: 725,
          left: 140,
          width: 800,
          transformOrigin: "top center",
          transform: `scaleY(${sheet})`,
          opacity: sheet,
          background: C.card,
          borderRadius: 28,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,.14)",
          boxShadow: `0 40px 90px rgba(0,0,0,.55), 0 0 70px ${C.blue}33`,
          fontFamily: FONT,
        }}
      >
        <div style={{ background: "#16264f", padding: "18px 28px", color: C.mute, fontSize: 28, fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
          <span>template.csv</span>
          <span>example row</span>
        </div>
        {TEMPLATE_FIELDS.map((r, i) => {
          const p = prog(f, 56 + i * 10, 76 + i * 10);
          const note = i >= 3;
          return (
            <div
              key={r.h}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 92,
                padding: "0 28px",
                borderTop: "1px solid rgba(255,255,255,.09)",
                opacity: p,
                transform: `translateX(${(1 - p) * 90}px)`,
                background: p > 0.05 && p < 0.75 ? "rgba(34,211,238,.12)" : "transparent",
              }}
            >
              <div style={{ color: C.cyan, fontSize: 38, fontWeight: 900 }}>{r.h}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.white, fontSize: 34, fontWeight: 700 }}>{r.v}</div>
                {note && <div style={{ color: C.amber, fontSize: 22, fontWeight: 800, marginTop: -2 }}>new users only</div>}
              </div>
            </div>
          );
        })}
      </div>
      <Pop at={150} from="up" style={{ position: "absolute", top: 1290, left: 90, right: 90, textAlign: "center", fontFamily: FONT }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: C.mute }}>
          First &amp; Last Name are <span style={{ color: C.cyan }}>only used for new users</span>
        </span>
      </Pop>
      </Cam>
    </>
  );
};

/* ───────────────────────── v2 MAP + VALIDATE ───────────────────────── */

const MAPS: [string, string, boolean][] = [
  ["email", "Email", true],
  ["program", "Program", true],
  ["session", "Session", true],
  ["first_name", "First Name", false],
  ["last_name", "Last Name", false],
];

const MapScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = interpolate(f, [0, 12, 95, 118], [0.6, 1, 1, 2], clampX);
  const panel = prog(f, 100, 126);
  const scan = interpolate(f, [128, 176], [0, 1], clampX);
  const rows = Math.floor(scan * 48);
  const valid = scan >= 1;
  const badge = spring({ frame: f - 178, fps, config: { damping: 10, stiffness: 180 } });
  return (
    <>
      <Headline lines={[{ t: "Map." }, { t: "Validate.", hl: true }]} />
      <StepRail active={active} />
      <Cam keys={CAM_V2} top={560}>
      <div style={{ position: "absolute", top: 575, left: 150, right: 150, fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: C.mute, fontSize: 26, fontWeight: 800, marginBottom: 12, padding: "0 6px" }}>
          <span>YOUR CSV</span>
          <span>SKILLBNK FIELD</span>
        </div>
        {MAPS.map(([a, b, req], i) => {
          const t0 = 12 + i * 10;
          const p = prog(f, t0, t0 + 18);
          const line = prog(f, t0 + 10, t0 + 30);
          const tick = spring({ frame: f - (t0 + 30), fps, config: { damping: 8, stiffness: 240 } });
          return (
            <div key={a} style={{ position: "relative", height: 66, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  width: 300,
                  height: 58,
                  borderRadius: 14,
                  background: "#16264f",
                  border: "2px solid rgba(255,255,255,.14)",
                  color: C.white,
                  fontSize: 28,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 22,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -100}px)`,
                }}
              >
                {a}
              </div>
              <svg style={{ position: "absolute", left: 310, top: 0 }} width="170" height="66">
                <line x1="0" y1="33" x2="170" y2="33" stroke={C.cyan} strokeWidth="5" strokeLinecap="round" strokeDasharray="170" strokeDashoffset={(1 - line) * 170} />
                <circle cx={line * 170} cy="33" r="9" fill={C.cyan} opacity={line < 1 ? 1 : 0} />
              </svg>
              <div
                style={{
                  width: 300,
                  height: 58,
                  borderRadius: 14,
                  background: line >= 1 ? "rgba(34,197,94,.16)" : "#16264f",
                  border: `2px solid ${line >= 1 ? C.green : "rgba(255,255,255,.14)"}`,
                  boxShadow: f > t0 + 28 && f < t0 + 52 ? `0 0 ${24 + 16 * Math.sin(f / 3)}px ${C.cyan}` : "none",
                  color: C.white,
                  fontSize: 28,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 20px 0 22px",
                  opacity: p,
                  transform: `translateX(${(1 - p) * 100}px)`,
                }}
              >
                <span>
                  {b} {req && <span style={{ color: C.red }}>*</span>}
                </span>
                <span style={{ color: C.green, fontSize: 32, transform: `scale(${Math.min(1, tick)})` }}>{line >= 1 ? "✓" : ""}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* validation panel */}
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 150,
          width: 780,
          opacity: panel,
          transform: `translateY(${(1 - panel) * 80}px)`,
          background: C.card,
          borderRadius: 26,
          border: `2px solid ${valid ? C.green : "rgba(255,255,255,.14)"}`,
          padding: "26px 30px 28px",
          fontFamily: FONT,
          boxShadow: valid ? `0 0 60px ${C.green}55` : "0 30px 70px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ color: C.white, fontSize: 36, fontWeight: 900 }}>Validation Results</div>
          <div
            style={{
              color: valid ? "#052e16" : C.white,
              background: valid ? C.green : "#1b2750",
              fontSize: 28,
              fontWeight: 900,
              padding: "8px 24px",
              borderRadius: 999,
              transform: `scale(${valid ? 0.9 + 0.1 * Math.min(1.3, badge) : 1})`,
            }}
          >
            {valid ? "All rows valid" : `${rows} / 48 rows`}
          </div>
        </div>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
          {Array.from({ length: 48 }, (_, i) => {
            const ok = i < rows;
            return (
              <div
                key={i}
                style={{
                  height: 30,
                  borderRadius: 8,
                  background: ok ? C.green : "#1b2750",
                  opacity: ok ? 1 : 0.7,
                  transform: `scale(${ok && i >= rows - 3 ? 1.25 : 1})`,
                  boxShadow: ok && i >= rows - 3 ? `0 0 16px ${C.green}` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
      </Cam>
    </>
  );
};

/* ───────────────────────── v3 PREVIEW + ENROLL ───────────────────────── */

const ROWS = [
  { n: "Rachel Moore", s: "Will Enroll" },
  { n: "Daniel Ortiz", s: "Will Enroll" },
  { n: "Tom Becker", s: "Already Enrolled" },
  { n: "Alicia Grant", s: "Will Enroll" },
];

const PreviewScene: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const click = 150;
  const press = spring({ frame: f - click, fps, config: { damping: 8, stiffness: 240 } });
  const queued = spring({ frame: f - (click + 12), fps, config: { damping: 12, stiffness: 120 } });
  const willN = Math.floor(interpolate(f, [60, 100], [0, 47], clampX));
  const flag = f > 70 && f < 140 ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  const curX = interpolate(f, [100, click - 2], [880, 640], { ...clampX, easing: OUT });
  const curY = interpolate(f, [100, click - 2], [900, 1214], { ...clampX, easing: OUT });
  const conf = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2;
    const t = Math.max(0, f - click - 4);
    const sp2 = 9 + (i % 5) * 3;
    return {
      x: 540 + Math.cos(a) * sp2 * t * 0.9,
      y: 1214 + Math.sin(a) * sp2 * t * 0.9 + t * t * 0.28,
      c: [C.cyan, C.green, C.amber, C.blue][i % 4],
      o: interpolate(t, [0, 46], [1, 0], clampX),
    };
  });
  return (
    <>
      <Headline lines={[{ t: "One click." }, { t: "Whole team.", hl: true }]} />
      <StepRail active={3} />
      <Cam keys={CAM_V3} top={560}>
      <div
        style={{
          position: "absolute",
          top: 575,
          left: 130,
          right: 130,
          background: C.card,
          border: "2px solid rgba(255,255,255,.14)",
          borderRadius: 34,
          padding: "26px 28px 20px",
          fontFamily: FONT,
          boxShadow: `0 40px 100px rgba(0,0,0,.6), 0 0 80px ${C.blue}33`,
        }}
      >
        <div style={{ color: C.white, fontSize: 38, fontWeight: 900, marginBottom: 10 }}>Enrollment Preview</div>
        {ROWS.map((r, i) => {
          const ok = r.s === "Will Enroll";
          const p = prog(f, 8 + i * 8, 26 + i * 8);
          return (
            <div
              key={r.n}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 10px",
                borderBottom: "1px solid rgba(255,255,255,.1)",
                opacity: p,
                transform: `translateX(${(1 - p) * 120}px)`,
                background: !ok ? `rgba(245,158,11,${0.1 + flag * 0.18})` : "transparent",
                borderRadius: !ok ? 12 : 0,
              }}
            >
              <div style={{ color: C.white, fontSize: 36, fontWeight: 700 }}>{r.n}</div>
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 800,
                  padding: "7px 22px",
                  borderRadius: 999,
                  color: ok ? "#052e16" : "#3a2500",
                  background: ok ? C.green : C.amber,
                  boxShadow: !ok ? `0 0 ${10 + flag * 26}px ${C.amber}` : "none",
                }}
              >
                {r.s}
              </div>
            </div>
          );
        })}
        <div style={{ color: C.mute, fontSize: 28, textAlign: "center", marginTop: 12 }}>+ 44 more rows</div>
      </div>
      {/* summary chips + button, replaced by the toast after the click */}
      <div style={{ position: "absolute", top: 1062, left: 100, right: 100, display: "flex", justifyContent: "center", gap: 20, fontFamily: FONT, opacity: 1 - Math.min(1, queued * 2) }}>
        <Pop at={60} from="left">
          <div style={{ fontSize: 30, fontWeight: 900, color: "#052e16", background: C.green, borderRadius: 999, padding: "10px 28px" }}>{willN} Will Enroll</div>
        </Pop>
        <Pop at={72} from="right">
          <div style={{ fontSize: 30, fontWeight: 900, color: "#3a2500", background: C.amber, borderRadius: 999, padding: "10px 28px" }}>1 Already Enrolled</div>
        </Pop>
      </div>
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - Math.min(1, queued * 2) }}>
        <Pop at={90} from="up">
          <div
            style={{
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 900,
              color: C.white,
              background: C.blue,
              padding: "26px 60px",
              borderRadius: 26,
              transform: `scale(${1 - 0.09 * Math.sin(Math.min(1, press) * Math.PI)})`,
              boxShadow: `0 0 ${34 + 30 * Math.sin(f / 7)}px ${C.blue}`,
            }}
          >
            Enroll 47 Students
          </div>
        </Pop>
      </div>
      <Ripple at={click} x={540} y={1214} />
      {f < click + 14 && f > 96 && <Cursor x={curX} y={curY} />}
      {conf.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: 14, height: 14, borderRadius: i % 2 ? 7 : 2, background: p.c, opacity: p.o, transform: `rotate(${i * 40 + f * 9}deg)` }} />
      ))}
      <div
        style={{
          position: "absolute",
          top: 1075,
          left: 130,
          right: 130,
          opacity: interpolate(queued, [0, 0.4], [0, 1], clampX),
          transform: `translateY(${(1 - Math.min(1, queued)) * 60}px) scale(${0.9 + 0.1 * Math.min(1.1, queued)})`,
          background: C.green,
          color: "#052e16",
          fontFamily: FONT,
          borderRadius: 30,
          padding: "30px 40px",
          boxShadow: `0 0 80px ${C.green}99`,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 900 }}>✓ Enrollment Queued</div>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 6 }}>Bulk enrollment has been queued for processing.</div>
      </div>
      </Cam>
    </>
  );
};

/* ───────────────────────── v4 LEARNER: login details by email ───────────────────────── */

const MAILS = ["Rachel Moore", "Daniel Ortiz", "Priya Shah", "Alicia Grant", "Marcus Lee"];

const Envelope: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 90 65">
    <rect x="2" y="2" width="86" height="61" rx="9" fill="#fff" stroke={C.blue} strokeWidth="4" />
    <path d="M6 10l39 28 39-28" fill="none" stroke={C.blue} strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

const LearnerScene: React.FC = () => {
  const f = useCurrentFrame();
  const ph = prog(f, 4, 30);
  const arrive = (i: number) => 38 + i * 14;
  const sx = 150, sy = 640, ex = 540, ey = 930;
  let buzz = 0;
  MAILS.forEach((_, i) => {
    const t = f - (arrive(i) + 16);
    if (t > 0 && t < 10) buzz = Math.sin(t * 2.4) * (10 - t) * 0.9;
  });
  return (
    <>
      <Headline lines={[{ t: "Logins go out" }, { t: "by email.", hl: true }]} />
      <Cam keys={CAM_V4} top={400}>
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 300,
          width: 480,
          height: 760,
          opacity: ph,
          transform: `translateY(${(1 - ph) * 140}px) translateX(${buzz}px) rotate(${buzz * 0.12}deg)`,
          borderRadius: 64,
          background: "#070d22",
          border: "10px solid #1c2a5a",
          boxShadow: `0 40px 100px rgba(0,0,0,.6), 0 0 80px ${C.blue}44`,
          overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{ margin: "0 auto", marginTop: 14, width: 130, height: 28, borderRadius: 14, background: "#000" }} />
        <div style={{ color: C.white, fontSize: 34, fontWeight: 900, padding: "26px 28px 12px" }}>Inbox</div>
        {MAILS.map((n, i) => {
          const p = prog(f, arrive(i) + 14, arrive(i) + 32);
          return (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                margin: "0 14px 10px",
                borderRadius: 20,
                background: "#111b3d",
                opacity: p,
                transform: `translateY(${(1 - p) * -50}px)`,
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 27, background: C.blue, color: C.white, fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {n.split(" ").map((s) => s[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontSize: 26, fontWeight: 800 }}>{n}</div>
                <div style={{ color: C.mute, fontSize: 22, fontWeight: 600 }}>Login details</div>
              </div>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}` }} />
            </div>
          );
        })}
      </div>
      {/* flying envelopes */}
      {MAILS.map((_, i) => {
        const t = interpolate(f, [arrive(i) - 6, arrive(i) + 16], [0, 1], { ...clampX, easing: Easing.inOut(Easing.cubic) });
        if (t <= 0 || t >= 1) return null;
        const x = sx + (ex - sx) * t + Math.sin(t * Math.PI) * -50;
        const y = sy + (ey - sy) * t - Math.sin(t * Math.PI) * 180;
        return (
          <div key={i} style={{ position: "absolute", left: x - 45, top: y - 32, opacity: 1 - t * 0.4, transform: `rotate(${(1 - t) * -24}deg) scale(${1 - t * 0.5})` }}>
            <Envelope />
          </div>
        );
      })}
      <Pop at={10} from="left" style={{ position: "absolute", top: 600, left: 40, fontFamily: FONT }}>
        <div style={{ background: C.blue, color: C.white, fontWeight: 900, fontSize: 26, padding: "12px 22px", borderRadius: 18, boxShadow: `0 0 36px ${C.blue}aa` }}>
          ✓ Enrolled
        </div>
      </Pop>
      </Cam>
    </>
  );
};

/* ───────────────────────── v5 WRAP: race + stat tiles ───────────────────────── */

const CountUp: React.FC<{ to: number; at: number; dur?: number }> = ({ to, at, dur = 30 }) => {
  const f = useCurrentFrame();
  return <>{Math.round(interpolate(f, [at, at + dur], [0, to], { ...clampX, easing: OUT }))}</>;
};

const WrapScene: React.FC = () => {
  const f = useCurrentFrame();
  const slow = interpolate(f, [16, 120], [0, 0.26], { ...clampX, easing: Easing.linear });
  const fast = prog(f, 26, 52);
  const done = f >= 54;
  const tiles = [
    { big: <CountUp to={48} at={64} />, small: "rows in the CSV", c: C.cyan },
    { big: <CountUp to={1} at={72} dur={10} />, small: "upload", c: C.green },
    { big: <CountUp to={0} at={80} dur={4} />, small: "names typed", c: C.amber },
  ];
  return (
    <>
      <Headline lines={[{ t: "48 people." }, { t: "One upload.", hl: true }]} />
      <Cam keys={CAM_V5} top={400}>
      <div style={{ position: "absolute", top: 560, left: 130, right: 130, fontFamily: FONT }}>
        {[
          { label: "One by one", p: slow, col: C.red, tag: "still typing…" },
          { label: "One CSV", p: fast, col: C.cyan, tag: "✓ Done" },
        ].map((b, i) => (
          <Pop key={b.label} at={6 + i * 8} from={i ? "right" : "left"} style={{ marginBottom: 34 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.white, fontSize: 36, fontWeight: 900, marginBottom: 10 }}>
              <span>{b.label}</span>
              <span style={{ color: i === 1 && done ? C.green : C.mute, fontSize: 30 }}>{i === 1 ? (done ? b.tag : "") : b.tag}</span>
            </div>
            <div style={{ height: 46, borderRadius: 23, background: "#16264f", overflow: "hidden" }}>
              <div style={{ width: `${b.p * 100}%`, height: "100%", borderRadius: 23, background: b.col, boxShadow: `0 0 30px ${b.col}` }} />
            </div>
          </Pop>
        ))}
      </div>
      <div style={{ position: "absolute", top: 900, left: 130, right: 130, display: "flex", gap: 24, fontFamily: FONT }}>
        {tiles.map((t, i) => (
          <Pop key={i} at={60 + i * 8} from="up" style={{ flex: "1 1 0", minWidth: 0, width: 0 }}>
            <div style={{ background: C.card, border: `2px solid ${t.c}66`, borderRadius: 28, padding: "30px 10px 26px", textAlign: "center", boxShadow: `0 0 40px ${t.c}33` }}>
              <div style={{ fontSize: 96, fontWeight: 900, color: t.c, lineHeight: 1 }}>{t.big}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.mute, marginTop: 10 }}>{t.small}</div>
            </div>
          </Pop>
        ))}
      </div>
      </Cam>
    </>
  );
};


/* camera paths per scene (local frames) */
const CAM_V0: CamKey[] = [[0, 540, 1010, 1], [24, 430, 700, 1.25], [60, 430, 780, 1.3], [100, 430, 900, 1.3], [140, 430, 1000, 1.3], [166, 540, 820, 1.07], [238, 540, 820, 1.07], [264, 540, 975, 1.12]];
const CAM_V1: CamKey[] = [[0, 540, 1010, 1], [12, 540, 650, 1.8], [58, 540, 900, 1.0], [84, 540, 840, 1.3], [100, 540, 930, 1.3], [116, 540, 1020, 1.3], [132, 540, 1110, 1.3], [152, 760, 1160, 1.7], [178, 540, 1290, 1.4]];
const CAM_V2: CamKey[] = [[0, 540, 1010, 1], [10, 540, 800, 1.1], [24, 540, 652, 1.35], [44, 540, 724, 1.35], [64, 540, 796, 1.35], [84, 540, 868, 1.35], [104, 540, 940, 1.35], [120, 540, 1130, 1.2], [150, 540, 1230, 1.25], [170, 700, 1090, 1.7]];
const CAM_V3: CamKey[] = [[0, 540, 1010, 1], [10, 540, 800, 1.1], [44, 540, 720, 1.3], [64, 760, 860, 1.65], [100, 540, 1090, 1.35], [118, 540, 1214, 1.8], [166, 540, 1170, 1.2]];
const CAM_V4: CamKey[] = [[0, 540, 1010, 1], [10, 420, 760, 1.3], [34, 540, 900, 1.5], [60, 540, 800, 1.7], [96, 540, 900, 1.6], [124, 540, 980, 1.6]];
const CAM_V5: CamKey[] = [[0, 540, 1010, 1], [12, 540, 700, 1.2], [34, 540, 760, 1.5], [58, 540, 640, 1.4], [80, 540, 1000, 1.3], [96, 260, 1000, 1.7], [112, 540, 1000, 1.7], [128, 820, 1000, 1.7]];

/* ───────────────────────── composition ───────────────────────── */

const SCENES: Record<Key, React.FC> = {
  v0: HookScene,
  v1: TemplateScene,
  v2: MapScene,
  v3: PreviewScene,
  v4: LearnerScene,
  v5: WrapScene,
};

export const ReelBulkEnrollVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg1 }}>
    <Bg />
    {ORDER.map((k, i) => {
      const S = SCENES[k];
      return (
        <Sequence key={k} from={starts[k]} durationInFrames={DURATIONS[k] + TR}>
          <SceneShell k={k} i={i}>
            <S />
          </SceneShell>
        </Sequence>
      );
    })}
    {/* shared main intro (portrait layout), right after the hook */}
    <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}>
      <MainIntro />
    </Sequence>
    {/* voice: linear timeline, never overlapped */}
    {ORDER.filter((k) => VOICED.includes(k)).map((k) => (
      <Sequence key={`a-${k}`} from={starts[k]} durationInFrames={DURATIONS[k]}>
        <Audio src={staticFile(`reel/${k}.mp3`)} />
      </Sequence>
    ))}
    {/* shared closing card, same as every other skillBNK video (portrait layout) */}
    <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}>
      <MainOutro />
    </Sequence>
  </AbsoluteFill>
);
