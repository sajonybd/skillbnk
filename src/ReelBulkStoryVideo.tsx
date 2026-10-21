import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, spring, interpolate, useCurrentFrame, useVideoConfig, Img } from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";

/**
 * ReelBulkStoryVideo — premium 1080x1920 Reel. Story: Rachel's Monday (Brookfield Property Management, fictional).
 * Hook (designed story scene) → MainIntro → ONE continuous "screen-recording" of the Bulk Enrollment page driven by a
 * virtual camera, hand-drawn scribbles, cursor & word-timed cues → payoff → MainOutro. No captions.
 * Voice: storyteller, one clip per beat, `bash generate-voice-reelstory.sh` → public/reelstory/*.mp3 and patches
 * DURATIONS, VOICED and WT (per-word start frames from Whisper) below. Without voice it falls back to estimated timing.
 * Claims verified in code: Template CSV w/ 5 fields (Email, Program, Session, First/Last Name), Upload→Map→Validate→
 * Preview&Enroll, "Will Enroll"/"Already Enrolled", "Enroll N Students", "Enrollment Queued", login details emailed to new users.
 */

// ───────────────────────── timeline (patched by the voice script) ─────────────────────────
const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "p6"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 279,
  d1: 232,
  d2: 185,
  d3: 164,
  d4: 212,
  d5: 205,
  p6: 222,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "p6"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 26, 50, 75, 79, 89, 97, 110, 136, 138, 146, 152, 159, 171, 171, 178, 193, 204, 216, 223, 242, 245, 251],
  d1: [2, 9, 15, 33, 37, 46, 58, 89, 94, 106, 123, 148, 152, 183, 188, 192, 203],
  d2: [2, 18, 30, 41, 48, 74, 84, 94, 107, 117, 129, 136, 143, 148, 154],
  d3: [2, 13, 24, 31, 58, 72, 80, 104, 121],
  d4: [15, 27, 37, 44, 50, 77, 83, 92, 106, 134, 136, 141, 147, 153, 160, 168, 185],
  d5: [2, 14, 34, 38, 40, 49, 56, 68, 95, 97, 106, 116, 121, 127, 136, 149, 157],
  p6: [2, 31, 60, 75, 106, 109, 142, 150, 155, 161, 174],
};
// @WT-END
const MUSIC = true; // soft synthesized bed under hook/demo/payoff (set false for voice+sfx only)

const SCRIPTS: Record<Seg, string> = {
  h0: "Monday, nine a.m. Forty-eight new hires start today. And Rachel is about to spend her whole afternoon typing them in, one by one.",
  d1: "But this time, she tries something different. She downloads the template. Five columns. That's all it needs.",
  d2: "She drops in her list, and skillbank lines up every column with the right field.",
  d3: "Then it checks every single row, before anything happens.",
  d4: "Forty-seven are ready to go. One is already enrolled, and she can see that before she clicks.",
  d5: "One click, and the whole team is queued. New users even get their login details by email.",
  p6: "Forty-eight people. One upload. And Rachel? She's got her afternoon back.",
};

const SEG_START = {} as Record<Seg, number>;
let _t = 0;
for (const k of SEGS) {
  SEG_START[k] = _t;
  _t += DURATIONS[k];
  if (k === "h0") _t += INTRO_FRAMES;
}
const INTRO_START = DURATIONS.h0;
const DEMO_START = SEG_START.d1;
const P6_START = SEG_START.p6;
const SCENES_END = _t;
export const TOTAL_FRAMES = SCENES_END + OUTRO_FRAMES;

const EST = 11.6;
const toks = (k: Seg) => SCRIPTS[k].trim().split(/\s+/);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const widx = (k: Seg, w: string, occ = 0) => {
  const ws = toks(k).map(norm);
  const t = norm(w);
  let c = 0;
  for (let i = 0; i < ws.length; i++) if (ws[i] === t) { if (c === occ) return i; c++; }
  return 0;
};
const wtime = (k: Seg, i: number) => {
  const a = WT[k];
  return a && a.length === toks(k).length ? a[i] : i * EST + 6;
};
/** absolute frame at which word `w` of beat `k` starts being spoken (+ off frames) */
const cue = (k: Seg, w: string | number, off = 0, occ = 0) =>
  SEG_START[k] + wtime(k, typeof w === "number" ? w : widx(k, w, occ)) + off;

// ───────────────────────── tokens + helpers ─────────────────────────
const BLUE = "#1D3FD6";
const BLUE_SOFT = "#EEF2FF";
const INK = "#111827";
const GRAY = "#6B7280";
const LINE = "#E5E7EB";
const GREEN = "#16A34A";
const AMBER = "#F59E0B";
const MARK = "#FF6A1A"; // hand-drawn marker colour
const FONT = "'Inter','SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const CAMEASE = Easing.bezier(0.55, 0, 0.1, 1);
const pr = (f: number, a: number, d = 14) => interpolate(f, [a, a + d], [0, 1], { ...cl, easing: OUT });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);
const sp = (f: number, a: number, fps = 30, cfg: object = {}) => spring({ frame: f - a, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });
const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const typed = (f: number, a: number, text: string, cpf = 0.9) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((f - a) * cpf))));
const rip = (f: number, at: number) => (f >= at && f < at + 16 ? (f - at) / 16 : 0);

type K4 = [number, number, number, number];
const camAt = (f: number, keys: K4[]): [number, number, number] => {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2], keys[0][3]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, ax, ay, az] = keys[i];
    const [b, bx, by, bz] = keys[i + 1];
    if (f < b) {
      const p = CAMEASE((f - a) / Math.max(1, b - a));
      return [ax + (bx - ax) * p, ay + (by - ay) * p, az + (bz - az) * p];
    }
  }
  const l = keys[keys.length - 1];
  return [l[1], l[2], l[3]];
};
const mono = (keys: K4[]): K4[] => {
  const o: K4[] = [];
  keys.forEach((k) => { const prev = o[o.length - 1]; o.push([prev && k[0] <= prev[0] ? prev[0] + 2 : k[0], k[1], k[2], k[3]]); });
  return o;
};
type P3 = [number, number, number];
const pathAt = (f: number, pts: P3[]): [number, number] => {
  if (f <= pts[0][0]) return [pts[0][1], pts[0][2]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, ax, ay] = pts[i];
    const [b, bx, by] = pts[i + 1];
    if (f < b) {
      const p = CAMEASE((f - a) / Math.max(1, b - a));
      const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1;
      const arc = Math.sin(Math.PI * p) * Math.min(60, d * 0.12);
      return [ax + dx * p - (dy / d) * arc, ay + dy * p + (dx / d) * arc];
    }
  }
  const l = pts[pts.length - 1];
  return [l[1], l[2]];
};
const monoP = (pts: P3[]): P3[] => {
  const o: P3[] = [];
  pts.forEach((k) => { const prev = o[o.length - 1]; o.push([prev && k[0] <= prev[0] ? prev[0] + 2 : k[0], k[1], k[2]]); });
  return o;
};

// ───────────────────────── geometry of the vertical "app window" ─────────────────────────
const WX = 60, WY = 230, WWD = 960, WHT = 2100, BARH = 56;
const CT = (x: number, y: number): [number, number] => [WX + x, WY + BARH + y]; // content → world
const PANX = 30, PANY = 400, PANW = 900, PANH = 900;
const PA = (x: number, y: number): [number, number] => CT(PANX + x, PANY + y); // panel → world
const VCX = 540, VCY = 900; // camera centre on screen

type Row = { name: string; email: string; already?: boolean };
const ROWS: Row[] = [
  { name: "Olivia Bennett", email: "olivia.bennett@example.com" },
  { name: "Marcus Cole", email: "marcus.cole@example.com" },
  { name: "Priya Nair", email: "priya.nair@example.com" },
  { name: "Leo Grant", email: "leo.grant@example.com" },
  { name: "Grace Park", email: "grace.park@example.com", already: true },
  { name: "Ethan Walsh", email: "ethan.walsh@example.com" },
];
const PROGRAM = "New CRM Rollout";
const SESSION = "October 2026 Team";
const CSV_NAME = "brookfield_team.csv";
const FIELDS = ["Email", "Program", "Session", "First Name", "Last Name"];
const FIELD_KEYS = ["email", "program", "session", "first_name", "last_name"];

// ───────────────────────── demo timeline (all absolute frames) ─────────────────────────
const T = {
  appIn: DEMO_START,
  dlClick: cue("d1", "template", -2),
  five: cue("d1", "five"),
  columns: cue("d1", "columns", 4),
  needs: cue("d1", "needs"),
  drag: cue("d2", "drops", -6),
  drop: cue("d2", "list", 4),
  s12: cue("d2", "lines", -4),
  mapA: cue("d2", "every", -4),
  mapB: cue("d2", "field", 2),
  clickCont: SEG_START.d3 + 3,
  s23: SEG_START.d3 + 9,
  scanA: cue("d3", "checks", -2),
  scanB: cue("d3", "row", 8),
  allValid: cue("d3", "before", 2),
  clickVal: SEG_START.d4 + 3,
  s34: SEG_START.d4 + 9,
  chip47: cue("d4", "forty-seven", 2),
  already: cue("d4", "already", -2),
  seeIt: cue("d4", "see"),
  clickEnroll: cue("d5", "click", 5),
  s4D: cue("d5", "queued", -4),
  newUsers: cue("d5", "new"),
  mail: cue("d5", "email"),
};

// ───────────────────────── small UI atoms ─────────────────────────
const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 52, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.38, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
const KeyLogo: React.FC<{ s?: number; dark?: boolean }> = ({ s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38">
      <rect width="38" height="38" rx="9" fill="#0C4A6E" />
      <path d="M8 30V17l11-9 11 9v13z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="16" y="21" width="6" height="9" fill="#38BDF8" />
    </svg>
    <div>
      <div style={{ fontSize: 17 * s, fontWeight: 900, color: dark ? "#fff" : "#0C4A6E", letterSpacing: 0.8 }}>BROOKFIELD</div>
      <div style={{ fontSize: 11.5 * s, fontWeight: 600, color: dark ? "#CBD5E1" : GRAY, whiteSpace: "nowrap" }}>Property Management</div>
    </div>
  </div>
);
const Badge: React.FC<{ t: string; c: string; bg: string; fs?: number; dot?: boolean }> = ({ t, c, bg, fs = 20, dot }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: fs, fontWeight: 800, color: c, background: bg, padding: `${fs * 0.3}px ${fs * 0.7}px`, borderRadius: 999, whiteSpace: "nowrap" }}>
    {dot && <span style={{ width: fs * 0.4, height: fs * 0.4, borderRadius: "50%", background: c }} />}{t}
  </span>
);
const Btn: React.FC<{ x: number; y: number; w: number; h?: number; label: string; primary?: boolean; press?: number; fs?: number; glow?: number }> = ({ x, y, w, h = 62, label, primary, press = 0, fs = 22, glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs, fontWeight: 800, background: primary ? BLUE : "#fff", color: primary ? "#fff" : INK, border: primary ? "none" : `2px solid ${LINE}`, transform: `scale(${1 - press * 0.07})`, boxShadow: `${primary ? "0 6px 16px #1D3FD640" : "0 2px 6px #0001"}${glow > 0 ? `, 0 0 0 ${10 * glow}px #1D3FD633` : ""}` }}>{label}</div>
);
const countUp = (f: number, a: number, to: number, d = 22) => Math.round(to * interpolate(f, [a, a + d], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) }));

const Stepper: React.FC<{ step: number; f: number; S: number[] }> = ({ step, f, S }) => {
  const labels = ["Upload CSV", "Map Fields", "Validate", "Preview & Enroll"];
  return (
    <div style={{ position: "absolute", left: 30, top: 280, width: 900, height: 100, background: "#fff", borderRadius: 20, border: `2px solid ${LINE}` }}>
      {labels.map((s, i) => {
        const cx = 112 + i * 225 - 56 + 56;
        const done = step > i + 1, on = step === i + 1;
        const pop = i === 0 ? 1 : sp(f, S[i - 1], 30, { damping: 10 });
        return (
          <React.Fragment key={s}>
            {i < 3 && <div style={{ position: "absolute", left: cx + 32, top: 36, width: 225 - 64, height: 4, borderRadius: 2, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${(i === 0 ? lin(f, S[0] - 4, S[0] + 14) : i === 1 ? lin(f, S[1] - 4, S[1] + 14) : lin(f, S[2] - 4, S[2] + 14)) * 100}%`, height: 4, background: BLUE }} /></div>}
            <div style={{ position: "absolute", left: cx - 22, top: 14, width: 44, height: 44, borderRadius: "50%", background: done || on ? BLUE : "#E5E7EB", color: done || on ? "#fff" : GRAY, fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 1 + 0.12 * Math.max(0, pop - 0.85) : 1})`, boxShadow: on ? "0 0 0 8px #1D3FD622" : "none" }}>{done ? "✓" : i + 1}</div>
            <div style={{ position: "absolute", left: cx - 100, top: 64, width: 200, textAlign: "center", fontSize: 18, fontWeight: 800, color: done || on ? INK : GRAY }}>{s}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ───────────────────────── the window + all panels ─────────────────────────
const BulkApp: React.FC<{ f: number }> = ({ f }) => {
  const S = [T.s12, T.s23, T.s34, T.s4D];
  const step = f >= T.s4D ? 5 : f >= T.s34 ? 4 : f >= T.s23 ? 3 : f >= T.s12 ? 2 : 1; // 5 = done (stepper stays on 4)
  const panel = (k: number) => {
    const a = k === 0 ? -9999 : S[k - 1];
    const b = k === 4 ? 99999 : S[k];
    const inP = k === 0 ? 1 : pr(f, a, 16);
    const outP = k === 4 ? 0 : pr(f, b, 12);
    const vis = f >= a - 1 && f < b + 16;
    return { vis, o: inP * (1 - outP), x: (1 - inP) * 80 - outP * 80 };
  };
  const clickT = [T.dlClick, T.drop, T.clickCont, T.clickVal, T.clickEnroll];
  const press = (t: number) => (f >= t && f < t + 6 ? 1 : 0);
  const winIn = sp(f, T.appIn, 30, { damping: 18, stiffness: 120 });
  const dl = f - T.dlClick;

  // ── step 1
  const p0 = panel(0);
  const dropped = f >= T.drop;
  const rows48 = countUp(f, T.drop + 4, 48, 20);
  // ── step 3 beam
  const beamP = interpolate(f, [T.scanA, T.scanB], [0, 1], { ...cl });
  const validAt = (i: number) => T.scanA + ((i + 0.6) / 6) * (T.scanB - T.scanA);
  // ── step 4
  const rowIn = (i: number) => pr(f, T.s34 + 8 + i * 5, 12);
  const flyP = (i: number) => pr(f, T.clickEnroll + 6 + i * 3, 16);
  const queued = interpolate(f, [T.clickEnroll + 6, T.s4D], [0, 48], { ...cl });

  return (
    <div style={{ position: "absolute", left: WX, top: WY, width: WWD, height: WHT, borderRadius: 30, background: "#F6F7F9", boxShadow: "0 60px 140px #000D, 0 0 0 2px #ffffff18", overflow: "hidden", opacity: Math.min(1, winIn * 1.4), transform: `translateY(${(1 - winIn) * 120}px) scale(${0.9 + 0.1 * winIn})`, fontFamily: FONT }}>
      {/* browser bar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: WWD, height: BARH, background: "linear-gradient(180deg,#1E2740,#172036)", display: "flex", alignItems: "center", padding: "0 22px", gap: 10, boxSizing: "border-box" }}>
        {["#FF6B5E", "#FFC15E", "#3ED07F"].map((c) => <div key={c} style={{ width: 15, height: 15, borderRadius: "50%", background: c }} />)}
        <div style={{ margin: "0 auto", width: 540, height: 34, borderRadius: 9, background: "#0F1729", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#A9B4CC", fontSize: 19 }}>
          <span style={{ color: "#3ED07F", fontSize: 14 }}>🔒</span>branch.skillbnk.com/bulk-enrollment
        </div>
      </div>
      {/* content area */}
      <div style={{ position: "absolute", left: 0, top: BARH, width: WWD, height: WHT - BARH }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: WWD, height: 70, background: "#fff", borderBottom: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><span style={{ fontSize: 28, color: "#4B5563" }}>☰</span><KeyLogo s={1.1} /></div>
          <Avatar t="DW" s={46} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 88, fontSize: 46, fontWeight: 900, color: INK, letterSpacing: -1 }}>Bulk Enrollment <span style={{ fontSize: 24, color: GRAY, fontWeight: 600 }}>ⓘ</span></div>
        <div style={{ position: "absolute", left: 40, top: 148, width: 880, fontSize: 23, color: GRAY }}>Upload a CSV file to enroll multiple students at once.</div>
        <Btn x={40} y={196} w={290} h={60} label="⤓  Template CSV" fs={23} press={press(T.dlClick)} glow={f >= T.dlClick - 14 && f < T.dlClick + 20 ? 1 - Math.abs(f - T.dlClick) / 20 : 0} />
        <Stepper step={Math.min(step, 4)} f={f} S={S} />

        {/* panel */}
        <div style={{ position: "absolute", left: PANX, top: PANY, width: PANW, height: PANH, background: "#fff", borderRadius: 22, border: `2px solid ${LINE}`, overflow: "hidden" }}>
          {/* step 1 */}
          {p0.vis && (
            <div style={{ position: "absolute", inset: 0, opacity: p0.o, transform: `translateX(${p0.x}px)` }}>
              <div style={{ position: "absolute", left: 32, top: 28, fontSize: 28, fontWeight: 900, color: INK }}>CSV Template Fields</div>
              {FIELDS.map((t, i) => {
                const pos = [[32, 84], [212, 84], [412, 84], [32, 156], [232, 156]][i];
                const wd = [160, 180, 180, 180, 180][i];
                const on = pr(f, T.five + i * 8, 10);
                return (
                  <div key={t} style={{ position: "absolute", left: pos[0], top: pos[1], width: wd, height: 54, borderRadius: 12, background: on > 0.3 ? BLUE_SOFT : "#F3F4F6", border: `2px solid ${on > 0.3 ? "#A5B4FC" : "transparent"}`, color: on > 0.3 ? BLUE : "#374151", fontSize: 23, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.14 * Math.sin(Math.PI * Math.min(1, on))})`, boxSizing: "border-box" }}>
                    {t}
                    {on > 0.3 && <span style={{ position: "absolute", right: -12, top: -14, width: 30, height: 30, borderRadius: "50%", background: MARK, color: "#fff", fontSize: 17, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(f, T.five + i * 8, 30, { damping: 9 })})` }}>{i + 1}</span>}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 32, top: 228, fontSize: 20, color: GRAY }}>First / Last Name — used only when creating a new user.</div>
              <div style={{ position: "absolute", left: 32, top: 290, width: 836, height: 330, borderRadius: 20, border: `3px dashed ${dropped ? BLUE : f >= T.drag ? "#93A4F8" : "#CBD5E1"}`, background: dropped ? BLUE_SOFT : "#FAFAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, boxSizing: "border-box" }}>
                {!dropped ? (
                  <>
                    <div style={{ fontSize: 58, color: "#9CA3AF" }}>⤒</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>Click to upload CSV</div>
                    <div style={{ fontSize: 20, color: GRAY }}>Only .csv files are supported</div>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, transform: `scale(${1 + 0.18 * Math.max(0, 1 - (f - T.drop) / 10) + (sp(f, T.drop, 30, { damping: 8 }) - 1) * 0.5})`, boxShadow: "0 12px 30px #1D3FD622" }}>
                    <span style={{ fontSize: 48 }}>📄</span>
                    <div><div style={{ fontSize: 28, fontWeight: 900, color: INK }}>{CSV_NAME}</div><div style={{ fontSize: 22, color: GRAY }}>{rows48} rows · <span style={{ color: GREEN, fontWeight: 800 }}>ready</span></div></div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* step 2 */}
          {panel(1).vis && (
            <div style={{ position: "absolute", inset: 0, opacity: panel(1).o, transform: `translateX(${panel(1).x}px)` }}>
              <div style={{ position: "absolute", left: 32, top: 28, fontSize: 28, fontWeight: 900, color: INK }}>Map CSV columns to required fields</div>
              {FIELDS.map((a, i) => {
                const tm = T.mapA + (i / 5) * (T.mapB - T.mapA);
                const m = pr(f, tm, 12);
                const y = 96 + i * 142;
                return (
                  <div key={a} style={{ position: "absolute", left: 32, top: y, width: 836 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>{a} {i < 3 && <span style={{ color: "#EF4444" }}>*</span>}</div>
                    <div style={{ marginTop: 10, height: 70, borderRadius: 14, border: `2px solid ${m > 0.05 && m < 0.9 ? "#818CF8" : "#D1D5DB"}`, background: m > 0.05 && m < 0.9 ? "#F5F7FF" : "#fff", boxShadow: m > 0.05 && m < 0.9 ? "0 0 0 6px #C7D2FE" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", boxSizing: "border-box", overflow: "hidden" }}>
                      <span style={{ fontSize: 26, fontWeight: 600, color: m > 0.05 ? INK : "#9CA3AF", transform: `translateX(${(1 - m) * 50}px)`, opacity: m > 0.05 ? m : 1 }}>{m > 0.05 ? FIELD_KEYS[i] : "Select column…"}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {m > 0.4 && <span style={{ width: 38, height: 38, borderRadius: "50%", background: GREEN, color: "#fff", fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(f, tm + 5, 30, { damping: 9 })})` }}>✓</span>}
                        <span style={{ color: "#9CA3AF", fontSize: 24 }}>⌄</span>
                      </span>
                    </div>
                  </div>
                );
              })}
              <Btn x={PANW - 32 - 330} y={PANH - 94} w={330} label="Continue to Validate" primary press={press(T.clickCont)} glow={f > T.mapB && f < T.clickCont ? 1 : 0} />
            </div>
          )}
          {/* step 3 */}
          {panel(2).vis && (
            <div style={{ position: "absolute", inset: 0, opacity: panel(2).o, transform: `translateX(${panel(2).x}px)` }}>
              <div style={{ position: "absolute", left: 32, top: 28, display: "flex", alignItems: "center", gap: 18 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: INK }}>Validation Results</span>
                {f >= T.allValid && <span style={{ transform: `scale(${sp(f, T.allValid, 30, { damping: 9 })})` }}><Badge t="All rows valid" c={GREEN} bg="#DCFCE7" fs={21} /></span>}
              </div>
              <div style={{ position: "absolute", right: 32, top: 30, fontSize: 24, fontWeight: 900, color: BLUE, fontVariantNumeric: "tabular-nums" }}>{Math.round(beamP * 48)} / 48</div>
              {ROWS.map((r, i) => {
                const v = f >= validAt(i);
                const flash = v ? Math.max(0, 1 - (f - validAt(i)) / 14) : 0;
                return (
                  <div key={r.email} style={{ position: "absolute", left: 32, top: 100 + i * 100, width: 836, height: 84, borderRadius: 14, background: flash > 0 ? `rgba(220,252,231,${0.3 + flash * 0.7})` : "#fff", border: `2px solid ${v ? "#BBF7D0" : LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ fontSize: 20, color: GRAY, width: 24 }}>{i + 1}</span><span style={{ fontSize: 24, fontWeight: 700, color: INK }}>{r.email}</span></div>
                    {v ? <span style={{ color: GREEN, fontSize: 24, fontWeight: 900, transform: `scale(${1 + 0.25 * flash})` }}>✓ Valid</span> : <span style={{ color: "#9CA3AF", fontSize: 22, fontWeight: 700 }}>Checking…</span>}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 34, top: 712, fontSize: 22, color: GRAY, fontWeight: 600 }}>+ 42 more rows</div>
              {f >= T.scanA - 4 && f <= T.scanB + 8 && (
                <div style={{ position: "absolute", left: 14, top: 92 + beamP * 640, width: PANW - 28, height: 14, borderRadius: 7, background: "linear-gradient(90deg,transparent,#22C55E,#86EFAC,#22C55E,transparent)", boxShadow: "0 0 36px 10px #22C55E88", opacity: lin(f, T.scanA - 4, T.scanA) * (1 - lin(f, T.scanB, T.scanB + 8)) }} />
              )}
              <Btn x={PANW - 32 - 250} y={PANH - 94} w={250} label="Validate" primary press={press(T.clickVal)} glow={f > T.allValid + 10 && f < T.clickVal ? 1 : 0} />
            </div>
          )}
          {/* step 4 */}
          {panel(3).vis && (
            <div style={{ position: "absolute", inset: 0, opacity: panel(3).o, transform: `translateX(${panel(3).x}px)` }}>
              <div style={{ position: "absolute", left: 32, top: 24, fontSize: 28, fontWeight: 900, color: INK }}>Enrollment Preview</div>
              <div style={{ position: "absolute", left: 32, top: 78, display: "flex", gap: 16 }}>
                <span style={{ display: "inline-block", transform: `scale(${sp(f, T.chip47, 30, { damping: 8 })})`, transformOrigin: "0 50%" }}><Badge t={`${countUp(f, T.chip47, 47, 22)} Will Enroll`} c={GREEN} bg="#DCFCE7" fs={24} dot /></span>
                <span style={{ display: "inline-block", transform: `scale(${sp(f, T.already, 30, { damping: 8 })})`, transformOrigin: "0 50%" }}><Badge t="1 Already Enrolled" c="#B45309" bg="#FEF3C7" fs={24} dot /></span>
              </div>
              <div style={{ position: "absolute", left: 34, top: 142, fontSize: 19, color: GRAY }}>{PROGRAM} · {SESSION}</div>
              {ROWS.map((r, i) => {
                const a = rowIn(i);
                const fl = flyP(i);
                const hot = r.already ? pr(f, T.already, 10) : 0;
                return (
                  <div key={r.email} style={{ position: "absolute", left: 32, top: 184 + i * 96, width: 836, height: 84, borderRadius: 16, background: hot > 0.1 ? `rgba(254,243,199,${hot})` : "#fff", border: `2px solid ${hot > 0.5 ? "#FCD34D" : LINE}`, opacity: a * (1 - fl), transform: `translate(${fl * 140}px, ${(1 - a) * 24 + fl * (PANH - 130 - (184 + i * 96))}px) scale(${1 - fl * 0.7})`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <Avatar t={r.name.split(" ").map((w) => w[0]).join("")} s={52} c1={["#2E64F0", "#14B8A6", "#8B5CF6", "#F59E0B", "#9CA3AF", "#EC4899"][i]} c2={["#1D4ED8", "#0F766E", "#6D28D9", "#B45309", "#6B7280", "#BE185D"][i]} />
                      <div><div style={{ fontSize: 25, fontWeight: 800, color: INK }}>{r.name}</div><div style={{ fontSize: 18, color: GRAY }}>{r.email}</div></div>
                    </div>
                    {r.already ? <Badge t="Already Enrolled" c="#B45309" bg="#FEF3C7" fs={19} /> : <Badge t="Will Enroll" c={GREEN} bg="#DCFCE7" fs={19} />}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 34, top: 184 + 6 * 96 + 2, fontSize: 21, color: GRAY, fontWeight: 600, opacity: 1 - flyP(0) }}>+ 42 more rows</div>
              <Btn x={32} y={PANH - 94} w={170} label="Back" fs={21} />
              <Btn x={PANW - 32 - 380} y={PANH - 94} w={380} label={f >= T.clickEnroll + 8 ? "Queuing…" : "Enroll 47 Students"} primary press={press(T.clickEnroll)} glow={f > T.seeIt + 20 && f < T.clickEnroll ? 1 : 0} />
              {f >= T.clickEnroll + 6 && (
                <div style={{ position: "absolute", left: 220, top: PANH - 88, padding: "10px 20px", borderRadius: 999, background: BLUE_SOFT, color: BLUE, fontSize: 24, fontWeight: 900, fontVariantNumeric: "tabular-nums", opacity: pr(f, T.clickEnroll + 6, 8) }}>{Math.round(queued)} queued</div>
              )}
            </div>
          )}
          {/* done */}
          {panel(4).vis && f >= T.s4D - 2 && (
            <div style={{ position: "absolute", inset: 0, opacity: panel(4).o, transform: `translateX(${panel(4).x}px)`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 110, gap: 16 }}>
              <div style={{ width: 150, height: 150, borderRadius: "50%", background: "#DCFCE7", color: GREEN, fontSize: 80, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(f, T.s4D, 30, { damping: 9, stiffness: 140 })})`, boxShadow: `0 0 0 ${24 * (1 - pr(f, T.s4D, 30))}px #16A34A33` }}>✓</div>
              <div style={{ fontSize: 50, fontWeight: 900, color: INK, marginTop: 10 }}>Enrollment Queued</div>
              <div style={{ fontSize: 24, color: GRAY }}>Bulk enrollment has been queued for processing.</div>
              <div style={{ marginTop: 14, padding: "16px 28px", borderRadius: 14, border: `2px solid ${LINE}`, fontSize: 22, fontWeight: 800, color: INK }}>Start New Bulk Enrollment</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** email toast + envelopes (world coords) */
const MailToast: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.newUsers) return null;
  const [cx, cy] = PA(450, 330);
  const [tx, ty] = PA(450, 680);
  const o = sp(f, T.newUsers + 16, 30, { damping: 13 });
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const p = lin(f, T.newUsers + i * 4, T.newUsers + 28 + i * 4);
        if (p <= 0 || p >= 1) return null;
        const x = cx + (rnd(i + 3) - 0.5) * 520 * p, y = cy + (ty - cy) * p - Math.sin(p * Math.PI) * 120;
        return <div key={i} style={{ position: "absolute", left: x - 28, top: y - 22, fontSize: 52, transform: `rotate(${(rnd(i) - 0.5) * 50 * p}deg)`, opacity: Math.sin(p * Math.PI) }}>✉️</div>;
      })}
      <div style={{ position: "absolute", left: tx - 400, top: ty - 20 + (1 - o) * 90, width: 800, opacity: Math.min(1, o), borderRadius: 24, background: "#0B1230", border: "2px solid #3B82F6", boxShadow: "0 30px 80px #000B, 0 0 60px #3B82F655", padding: "26px 32px", display: "flex", alignItems: "center", gap: 24, transform: `scale(${0.92 + 0.08 * o})` }}>
        <div style={{ width: 88, height: 88, borderRadius: 22, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, transform: `scale(${1 + 0.2 * Math.max(0, 1 - (f - T.mail) / 12) * (f >= T.mail ? 1 : 0)})` }}>✉️</div>
        <div><div style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>Login details sent</div><div style={{ fontSize: 24, color: "#9FB3D9", marginTop: 6 }}>New users get their login by email</div></div>
      </div>
    </>
  );
};

/** confetti burst in world coords */
const Confetti: React.FC<{ f: number; at: number; cx: number; cy: number }> = ({ f, at, cx, cy }) => {
  const p = f - at;
  if (p < 0 || p > 50) return null;
  return (
    <>
      {Array.from({ length: 34 }, (_, i) => {
        const a = rnd(i) * Math.PI * 2, v = 160 + rnd(i + 9) * 360;
        const t = p / 50;
        const x = cx + Math.cos(a) * v * Math.min(1, t * 1.6), y = cy + Math.sin(a) * v * Math.min(1, t * 1.6) + 420 * t * t;
        const c = ["#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#22D3EE"][i % 5];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: i % 2 ? 14 : 26, borderRadius: i % 2 ? 7 : 3, background: c, opacity: 1 - t, transform: `rotate(${rnd(i + 4) * 720 * t}deg)` }} />;
      })}
    </>
  );
};

// ───────────────────────── hand-drawn scribbles ─────────────────────────
const wobble = (cx: number, cy: number, rx: number, ry: number, seed: number) => {
  const pts: string[] = [];
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = -2.2 + t * Math.PI * 2 * 1.1;
    const k = 1 + 0.045 * Math.sin(a * 3 + seed) + 0.03 * Math.sin(a * 5 + seed * 2) + (t > 0.9 ? (t - 0.9) * 0.6 : 0);
    pts.push(`${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return pts.join(" ");
};
const Scribble: React.FC<{ f: number; at: number; d?: number; out?: number; kind: "ring" | "under" | "arrow"; x: number; y: number; w?: number; h?: number; seed?: number; color?: string; sw?: number; label?: string; lx?: number; ly?: number; lrot?: number }> = ({ f, at, d = 16, out = 9999, kind, x, y, w = 200, h = 80, seed = 1, color = MARK, sw = 9, label, lx = 0, ly = 0, lrot = -4 }) => {
  if (f < at) return null;
  const p = Easing.out(Easing.cubic)(lin(f, at, at + d)) * 1;
  const o = 1 - lin(f, out, out + 10);
  if (o <= 0) return null;
  let dstr = "";
  if (kind === "ring") dstr = wobble(x, y, w / 2, h / 2, seed);
  else if (kind === "under") dstr = `M${x - w / 2} ${y + Math.sin(seed) * 3} Q${x - w / 4} ${y - 9} ${x} ${y + 3} T${x + w / 2} ${y - 4}`;
  else dstr = `M${x} ${y} Q${x + w * 0.45} ${y - h * 0.2} ${x + w} ${y + h} M${x + w - 34} ${y + h - 6} L${x + w} ${y + h} L${x + w - 8} ${y + h - 38}`;
  const lp = pr(f, at + d - 4, 10);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 2000, overflow: "visible", opacity: o, pointerEvents: "none" }}>
        <path d={dstr} pathLength={1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 3px 5px #0004)` }} />
      </svg>
      {label && (
        <div style={{ position: "absolute", left: x + lx, top: y + ly, opacity: lp * o, transform: `rotate(${lrot}deg) scale(${0.8 + 0.2 * lp})`, padding: "8px 18px", borderRadius: 12, background: color, color: "#fff", fontSize: 30, fontWeight: 900, fontStyle: "italic", letterSpacing: 0.5, boxShadow: "0 8px 22px #0006", whiteSpace: "nowrap", fontFamily: FONT }}>{label}</div>
      )}
    </>
  );
};

// ───────────────────────── cursor ─────────────────────────
const CURSOR_PTS: P3[] = monoP([
  [DEMO_START, 880, 760],
  [T.dlClick - 26, 820, 640],
  [T.dlClick - 3, ...CT(180, 226)],
  [T.dlClick + 24, ...CT(180, 226)],
  [T.five + 2, ...PA(700, 210)],
  [T.drag - 10, ...PA(760, 100)],
  [T.drag + 8, ...PA(760, 100)],
  [T.drop - 4, ...PA(450, 440)],
  [T.drop + 30, ...PA(560, 470)],
  ...[0, 1, 2, 3, 4].map((i): P3 => [T.mapA + (i / 5) * (T.mapB - T.mapA) + 2, ...PA(560, 96 + i * 142 + 80)]),
  [T.mapB + 4, ...PA(PANW - 32 - 165, PANH - 62)],
  [T.clickCont + 2, ...PA(PANW - 32 - 165, PANH - 62)],
  [T.s23 + 40, ...PA(560, 500)],
  [T.clickVal - 6, ...PA(PANW - 32 - 125, PANH - 62)],
  [T.clickVal + 3, ...PA(PANW - 32 - 125, PANH - 62)],
  [T.s34 + 50, ...PA(600, 420)],
  [T.already + 14, ...PA(740, 184 + 4 * 96 + 42)],
  [T.seeIt + 18, ...PA(740, 184 + 4 * 96 + 42)],
  [T.clickEnroll - 4, ...PA(PANW - 32 - 190, PANH - 62)],
  [T.clickEnroll + 4, ...PA(PANW - 32 - 190, PANH - 62)],
  [T.s4D + 40, ...PA(760, 520)],
]);
const CLICKS = [T.dlClick, T.drop, T.clickCont, T.clickVal, T.clickEnroll];
const Cursor: React.FC<{ f: number }> = ({ f }) => {
  const [x, y] = pathAt(f, CURSOR_PTS);
  const o = lin(f, DEMO_START + 14, DEMO_START + 24);
  const down = CLICKS.some((c) => f >= c && f < c + 5);
  const dragging = f >= T.drag + 6 && f < T.drop;
  return (
    <>
      {dragging && (
        <div style={{ position: "absolute", left: x + 4, top: y + 6, padding: "12px 20px", borderRadius: 14, background: "#fff", boxShadow: "0 16px 40px #0007", fontSize: 24, fontWeight: 800, color: INK, transform: `rotate(${Math.sin(f / 6) * 3 + 4}deg)`, whiteSpace: "nowrap" }}>📄 {CSV_NAME}</div>
      )}
      {CLICKS.map((c, i) => {
        const r = rip(f, c);
        return r > 0 ? <div key={i} style={{ position: "absolute", left: x - 10 - 55 * r, top: y - 10 - 55 * r, width: 20 + 110 * r, height: 20 + 110 * r, borderRadius: "50%", border: `5px solid ${MARK}`, opacity: 1 - r }} /> : null;
      })}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 6, opacity: o, transform: `scale(${down ? 0.86 : 1})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        <path d="M4 3l7.5 18 2.6-7.6L21.7 10.8z" fill="#0B1020" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </>
  );
};

// ───────────────────────── shared stage dressing ─────────────────────────
const Bokeh: React.FC<{ f: number; cx?: number; cy?: number; tint?: string }> = ({ f, cx = 0, cy = 0, tint = "59,130,246" }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {Array.from({ length: 9 }, (_, i) => {
      const r = 90 + rnd(i) * 160, x = rnd(i + 5) * 1080, y = rnd(i + 11) * 1920, par = 0.03 + rnd(i + 2) * 0.07;
      return <div key={i} style={{ position: "absolute", left: x - r - cx * par + Math.sin(f / (60 + i * 9) + i) * 24, top: y - r - cy * par + Math.cos(f / (70 + i * 7) + i) * 24, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(${tint},${0.16 + rnd(i + 3) * 0.12}) 0%, rgba(${tint},0) 70%)` }} />;
    })}
  </AbsoluteFill>
);
const Backdrop: React.FC<{ f: number; cx?: number; cy?: number; warm?: number }> = ({ f, cx = 0, cy = 0, warm = 0 }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #0B2260 0%, #050A22 55%, #02030C 100%)" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)", backgroundSize: "72px 72px", backgroundPosition: `${-cx * 0.05}px ${-cy * 0.05}px` }} />
    <Bokeh f={f} cx={cx} cy={cy} tint={warm > 0.5 ? "245,158,11" : "59,130,246"} />
    {warm > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, rgba(245,120,30,${0.34 * warm}) 0%, rgba(120,30,10,${0.28 * warm}) 60%, rgba(30,5,5,${0.4 * warm}) 100%)`, mixBlendMode: "screen" }} />}
  </AbsoluteFill>
);
const Finish: React.FC<{ f: number }> = ({ f }) => {
  const j = Math.floor(f / 2);
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
      <Img src={staticFile("story/grain.png")} style={{ position: "absolute", left: -60 + rnd(j) * 50, top: -60 + rnd(j + 7) * 50, width: 1200, height: 2040, opacity: 0.085, mixBlendMode: "overlay", pointerEvents: "none" }} />
    </>
  );
};
const Flash: React.FC<{ f: number; at: number; d?: number; color?: string; streak?: boolean }> = ({ f, at, d = 7, color = "#CFE0FF", streak = true }) => {
  const o = Math.max(0, 1 - Math.abs(f - at) / d);
  if (o <= 0) return null;
  const p = lin(f, at - d, at + d);
  return (
    <>
      <AbsoluteFill style={{ background: color, opacity: o * 0.85, pointerEvents: "none" }} />
      {streak && <div style={{ position: "absolute", top: 0, left: -600 + p * 2300, width: 520, height: 1920, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)", opacity: o, transform: "skewX(-14deg)", pointerEvents: "none" }} />}
    </>
  );
};
const Kinetic: React.FC<{ f: number; at: number; out: number; text: string; y?: number; size?: number; color?: string; rot?: number; sub?: string }> = ({ f, at, out, text, y = 270, size = 84, color = "#fff", rot = -1.5, sub }) => {
  if (f < at - 1 || f > out + 12) return null;
  const s = sp(f, at, 30, { damping: 11, stiffness: 200, mass: 0.6 });
  const o = Math.min(1, s * 1.5) * (1 - lin(f, out, out + 10));
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, textAlign: "center", opacity: o, transform: `translateY(${(1 - Math.min(1, s)) * 50}px) rotate(${rot}deg) scale(${0.7 + 0.3 * s})`, fontFamily: FONT, pointerEvents: "none" }}>
      <span style={{ display: "inline-block", fontSize: size, fontWeight: 900, letterSpacing: -2, color, textShadow: "0 4px 18px #000A", padding: "6px 36px 10px", borderRadius: 28, background: "rgba(4,7,22,0.88)", border: "3px solid rgba(255,106,26,0.95)", boxShadow: "0 20px 60px #000A, 0 0 50px #FF6A1A44" }}>{text}</span>
      {sub && <div style={{ fontSize: 34, fontWeight: 700, color: "#9FB3D9", marginTop: 10 }}>{sub}</div>}
    </div>
  );
};

// ───────────────────────── HOOK: Rachel's Monday ─────────────────────────
const NAMES = ["olivia.bennett", "marcus.cole", "priya.nair", "leo.grant", "grace.park", "ethan.walsh", "sofia.reyes", "noah.kim", "ava.patel", "liam.ortiz", "mia.chen", "jack.owens"];
const TINTS = [["#2E64F0", "#1D4ED8"], ["#14B8A6", "#0F766E"], ["#8B5CF6", "#6D28D9"], ["#F59E0B", "#B45309"], ["#EC4899", "#BE185D"], ["#22C55E", "#15803D"]];
const HK = {
  monday: cue("h0", "monday", -2),
  nine: cue("h0", "nine", -4),
  big48: cue("h0", "forty-eight", -2),
  today: cue("h0", "today"),
  rachel: cue("h0", "rachel"),
  form: cue("h0", "about", -10),
  clock: cue("h0", "afternoon", -8),
  type0: cue("h0", "whole", -4),
  one1: cue("h0", "one", 0, 0),
  by: cue("h0", "by"),
  one2: cue("h0", "one", 0, 1),
};
const CYCLE = 12;
const fmtTime = (mins: number) => {
  const tot = 9 * 60 + mins, h24 = Math.floor(tot / 60) % 24, m = Math.floor(tot % 60);
  return { t: `${((h24 + 11) % 12) + 1}:${String(m).padStart(2, "0")}`, ap: h24 >= 12 ? "PM" : "AM" };
};
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const H0 = DURATIONS.h0;
  const ph = pr(f, HK.form - 6, 30);
  const mins = f < HK.clock ? (f / HK.clock) * 3 : 3 + (478 - 3) * Easing.inOut(Easing.cubic)(lin(f, HK.clock, H0 - 24));
  const tm = fmtTime(mins);
  const late = lin(mins, 380, 478);
  const warm = lin(f, HK.clock - 10, H0 - 10);
  const hAng = (((9 + mins / 60) % 12) / 12) * 360, mAng = (mins % 60) * 6;
  const clx = interpolate(ph, [0, 1], [540, 300]), cly = interpolate(ph, [0, 1], [500, 470]), cls = interpolate(ph, [0, 1], [1, 0.62]);
  const tx = interpolate(ph, [0, 1], [540, 740]), ty = interpolate(ph, [0, 1], [790, 440]), ts = interpolate(ph, [0, 1], [1, 0.62]);
  const gcy = interpolate(ph, [0, 1], [1210, 840]), gs = interpolate(ph, [0, 1], [1, 0.6]);
  const done = f < HK.type0 ? 0 : Math.min(11, Math.floor((f - HK.type0) / CYCLE));
  const cyc = f - HK.type0 - Math.floor((f - HK.type0) / CYCLE) * CYCLE;
  const name = NAMES[done % NAMES.length];
  const email = `${name}@example.com`;
  const typedEmail = f < HK.type0 ? "" : email.slice(0, Math.min(email.length, Math.floor(cyc * 3.4)));
  const savePress = f >= HK.type0 && cyc >= 9 && cyc < 12 ? 1 : 0;
  const drift = { x: Math.sin(f / 31) * 3, y: Math.cos(f / 37) * 3 };
  const push = 1 + 0.045 * lin(f, 0, H0);
  const big48 = f >= HK.big48 - 2 && f < HK.big48 + 46;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} />
      <AbsoluteFill style={{ transform: `translate(${drift.x}px,${drift.y}px) scale(${push})` }}>
        {/* day chip */}
        <div style={{ position: "absolute", left: 0, top: 168, width: 1080, display: "flex", justifyContent: "center", opacity: pr(f, HK.monday, 10), transform: `translateY(${(1 - pr(f, HK.monday, 14)) * -40}px)` }}>
          <div style={{ padding: "14px 34px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 40, fontWeight: 900, letterSpacing: 6 }}>📅 MONDAY</div>
        </div>
        {/* clock */}
        <div style={{ position: "absolute", left: clx - 200, top: cly - 200, width: 400, height: 400, transform: `scale(${cls * sp(f, HK.nine - 10, 30, { damping: 13 })})` }}>
          <svg width="400" height="400" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="190" fill="#0B1230" stroke={late > 0.3 ? "#F87171" : "#3B82F6"} strokeWidth="8" />
            <circle cx="200" cy="200" r="190" fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="22" />
            {Array.from({ length: 12 }, (_, i) => <line key={i} x1="200" y1="28" x2="200" y2={i % 3 === 0 ? 56 : 44} stroke="#fff" strokeWidth={i % 3 === 0 ? 8 : 4} strokeOpacity="0.8" transform={`rotate(${i * 30} 200 200)`} />)}
            <line x1="200" y1="200" x2="200" y2="110" stroke="#fff" strokeWidth="14" strokeLinecap="round" transform={`rotate(${hAng} 200 200)`} />
            <line x1="200" y1="200" x2="200" y2="58" stroke="#60A5FA" strokeWidth="9" strokeLinecap="round" transform={`rotate(${mAng} 200 200)`} />
            <circle cx="200" cy="200" r="14" fill="#F59E0B" />
          </svg>
        </div>
        <div style={{ position: "absolute", left: tx - 360, top: ty - 80, width: 720, textAlign: "center", transform: `scale(${ts})`, opacity: pr(f, HK.nine, 10), fontSize: 130, fontWeight: 900, color: late > 0.4 ? "#FCA5A5" : "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: -4, textShadow: "0 10px 50px #0009" }}>
          {tm.t}<span style={{ fontSize: 56, marginLeft: 12, color: late > 0.4 ? "#F87171" : "#93C5FD" }}>{tm.ap}</span>
        </div>
        {/* 48 new hires grid */}
        <div style={{ position: "absolute", left: 107, top: gcy - 323, width: 866, height: 646, transform: `scale(${gs})`, transformOrigin: "50% 50%" }}>
          {Array.from({ length: 48 }, (_, i) => {
            const c = i % 8, r = Math.floor(i / 8);
            const a = sp(f, HK.big48 + 8 + i * 1.1, 30, { damping: 10, stiffness: 190 });
            const [c1, c2] = TINTS[(i * 7) % 6];
            const isDone = i < done;
            return (
              <div key={i} style={{ position: "absolute", left: c * 110, top: r * 110, width: 96, height: 96, borderRadius: "50%", transform: `scale(${a})`, background: `linear-gradient(135deg,${c1},${c2})`, opacity: isDone ? 1 : ph > 0.5 ? 0.5 : 1, border: isDone ? "5px solid #22C55E" : "5px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 34 }}>
                {isDone ? "✓" : String.fromCharCode(65 + ((i * 5) % 26)) + String.fromCharCode(65 + ((i * 11 + 3) % 26))}
              </div>
            );
          })}
        </div>
        {/* giant 48 slam */}
        {big48 && (
          <div style={{ position: "absolute", left: 0, top: 640, width: 1080, textAlign: "center", fontSize: 460, fontWeight: 900, color: "#fff", lineHeight: 1, opacity: Math.min(1, sp(f, HK.big48, 30, { damping: 12 }) * 1.5) * (1 - lin(f, HK.big48 + 30, HK.big48 + 46)), transform: `scale(${(0.5 + 0.5 * sp(f, HK.big48, 30, { damping: 9, stiffness: 220 })) * (1 + 0.25 * lin(f, HK.big48 + 28, HK.big48 + 46))})`, textShadow: "0 0 90px #3B82F6, 0 20px 60px #000A" }}>48</div>
        )}
        {f >= HK.big48 && f < HK.rachel && (
          <div style={{ position: "absolute", left: 0, top: 1576, width: 1080, textAlign: "center", opacity: pr(f, HK.big48 + 30, 12) * (1 - lin(f, HK.rachel - 8, HK.rachel + 4)), fontSize: 40, fontWeight: 900, letterSpacing: 8, color: "#93C5FD" }}>NEW HIRES · START TODAY</div>
        )}
        {/* the old way: add-student form */}
        {ph > 0.01 && (
          <div style={{ position: "absolute", left: 110, top: 1070 + (1 - ph) * 500, width: 860, height: 460, opacity: ph, borderRadius: 28, background: "#fff", boxShadow: "0 40px 100px #000C", padding: 34, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: INK }}>Add student</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: late > 0.4 ? "#DC2626" : BLUE, fontVariantNumeric: "tabular-nums" }}>{Math.min(done + 1, 48)} of 48</div>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: "#E5E7EB", marginTop: 16, overflow: "hidden" }}><div style={{ width: `${(Math.max(done, 0) / 48) * 100}%`, height: 12, background: "linear-gradient(90deg,#F59E0B,#EF4444)" }} /></div>
            <div style={{ marginTop: 26, fontSize: 22, fontWeight: 700, color: "#374151" }}>Student email</div>
            <div style={{ marginTop: 8, height: 70, borderRadius: 14, border: "3px solid #A5B4FC", background: "#F5F7FF", boxShadow: "0 0 0 6px #C7D2FE", display: "flex", alignItems: "center", padding: "0 22px", fontSize: 30, fontWeight: 600, color: INK, boxSizing: "border-box" }}>{typedEmail}<span style={{ width: 3, height: 36, background: BLUE, marginLeft: 3, opacity: Math.floor(f / 5) % 2 }} /></div>
            <div style={{ display: "flex", gap: 16, marginTop: 22, alignItems: "center" }}>
              <div style={{ flex: 1, height: 64, borderRadius: 14, border: "2px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 26, color: "#4B5563", boxSizing: "border-box" }}>{PROGRAM} ⌄</div>
              <div style={{ width: 200, height: 64, borderRadius: 14, background: BLUE, color: "#fff", fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - savePress * 0.08})` }}>Enroll</div>
            </div>
          </div>
        )}
        {/* ONE · BY · ONE */}
        {[["ONE", HK.one1], ["BY", HK.by], ["ONE", HK.one2]].map(([w, at], i) => {
          const a = at as number;
          if (f < a - 1) return null;
          const s = sp(f, a, 30, { damping: 9, stiffness: 240, mass: 0.6 });
          return (
            <div key={i} style={{ position: "absolute", left: 40 + i * 330 - (i === 1 ? 20 : 0), top: 840, width: i === 1 ? 260 : 340, textAlign: "center", fontSize: 118, fontWeight: 900, color: i === 1 ? "#fff" : "#FDBA74", opacity: Math.min(1, s * 2), transform: `scale(${1.8 - 0.8 * Math.min(1.05, s)}) rotate(${(i - 1) * 3}deg)`, textShadow: "0 8px 0 #7C2D12, 0 20px 60px #000", WebkitTextStroke: "3px #1F0A04" }}>{w as string}</div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── DEMO: one continuous screen-recording with a virtual camera ─────────────────────────
const CAM: K4[] = mono([
  [DEMO_START, 540, 930, 0.9],
  [cue("d1", "tries", -4), 520, 600, 1.1],
  [cue("d1", "downloads", -6), 440, 520, 1.45],
  [T.dlClick + 26, 440, 540, 1.42],
  [T.five - 8, 410, 850, 1.4],
  [T.needs + 4, 430, 900, 1.36],
  [T.drag - 10, 540, 1090, 1.2],
  [T.drop - 2, 540, 1110, 1.28],
  [T.drop + 8, 540, 1141, 1.55],
  [T.drop + 40, 540, 1050, 1.2],
  [T.s12 + 8, 540, 960, 1.2],
  [T.mapA, 540, 960, 1.2],
  [T.mapB, 540, 1180, 1.2],
  [T.clickCont - 14, 700, 1340, 1.6],
  [T.clickCont + 14, 700, 1340, 1.6],
  [T.s23 + 16, 540, 980, 1.2],
  [T.scanA, 540, 950, 1.2],
  [T.scanB, 540, 1230, 1.2],
  [T.allValid + 8, 480, 880, 1.45],
  [T.clickVal - 10, 700, 1380, 1.6],
  [T.clickVal + 14, 700, 1380, 1.6],
  [T.s34 + 12, 470, 890, 1.38],
  [T.chip47 + 30, 470, 890, 1.45],
  [T.already - 10, 560, 1130, 1.3],
  [T.already + 18, 700, 1290, 1.7],
  [T.seeIt + 26, 700, 1290, 1.7],
  [T.clickEnroll - 24, 600, 1330, 1.25],
  [T.clickEnroll - 4, 740, 1470, 1.7],
  [T.clickEnroll + 14, 740, 1470, 1.7],
  [T.clickEnroll + 36, 540, 1250, 1.2],
  [T.s4D + 6, 540, 1010, 1.3],
  [T.newUsers + 4, 540, 1180, 1.22],
  [P6_START, 540, 1100, 1.0],
]);
const CHAPTERS: [Seg, string][] = [["d1", "TEMPLATE"], ["d2", "MAP FIELDS"], ["d3", "VALIDATE"], ["d4", "PREVIEW"], ["d5", "ENROLL"]];

const Chapter: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 0, top: 1490, width: 1080, display: "flex", justifyContent: "center" }}>
    {CHAPTERS.map(([k, label], i) => {
      const a = SEG_START[k], b = i < 4 ? SEG_START[CHAPTERS[i + 1][0]] : P6_START;
      if (f < a - 2 || f > b + 12) return null;
      const inn = pr(f, a, 12), out = lin(f, b - 4, b + 8);
      return (
        <div key={k} style={{ position: "absolute", display: "flex", alignItems: "center", gap: 18, padding: "10px 30px 10px 10px", borderRadius: 999, background: "rgba(4,7,22,0.78)", border: "2px solid rgba(96,165,250,0.55)", boxShadow: "0 10px 40px #0009, 0 0 40px #3B82F633", opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 30 - out * 20}px) scale(${0.9 + 0.1 * inn})` }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", color: "#fff", fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: 4 }}>{label}</div>
          <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>{[0, 1, 2, 3, 4].map((d) => <div key={d} style={{ width: d === i ? 30 : 12, height: 12, borderRadius: 6, background: d <= i ? "#60A5FA" : "rgba(255,255,255,0.22)" }} />)}</div>
        </div>
      );
    })}
  </div>
);

const DemoScene: React.FC<{ f: number }> = ({ f }) => {
  const [cx, cy, cz] = camAt(f, CAM);
  const dx = Math.sin(f / 31) * 4 + Math.sin(f / 11) * 1.4, dy = Math.cos(f / 37) * 4 + Math.sin(f / 13) * 1.2;
  const rot = Math.sin(f / 47) * 0.16, breath = 1 + Math.sin(f / 90) * 0.004;
  const z = cz * breath;
  const [ex, ey] = PA(PANW - 32 - 190, PANH - 62);
  const [tbx, tby] = CT(180, 226);
  const [dzx, dzy] = PA(450, 450);
  const [ch1x, ch1y] = PA(312, 150);
  const [gx, gy] = PA(740, 184 + 4 * 96 + 42);
  const [dcx, dcy] = PA(450, 220);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} cx={cx} cy={cy} />
      <AbsoluteFill style={{ transform: `rotate(${rot}deg) scale(1.03)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `translate(${VCX - cx * z + dx}px, ${VCY - cy * z + dy}px) scale(${z})` }}>
          <BulkApp f={f} />
          <Scribble f={f} at={T.dlClick - 10} d={16} out={T.dlClick + 50} kind="ring" x={tbx} y={tby + 6} w={360} h={104} seed={2} />
          <Scribble f={f} at={T.columns - 6} d={20} out={T.s12 - 20} kind="ring" x={ch1x} y={ch1y} w={660} h={170} seed={5} />
          <Scribble f={f} at={T.already + 6} d={18} out={T.clickEnroll - 30} kind="ring" x={gx + 10} y={gy} w={330} h={80} seed={9} label="caught early" lx={-120} ly={52} lrot={-5} />
          <Scribble f={f} at={T.clickEnroll - 22} d={16} out={T.clickEnroll + 14} kind="ring" x={ex + 6} y={ey} w={430} h={110} seed={4} />
          <Confetti f={f} at={T.s4D + 2} cx={dcx} cy={dcy} />
          <MailToast f={f} />
          <Cursor f={f} />
        </div>
      </AbsoluteFill>
      <Chapter f={f} />
      <Kinetic f={f} at={T.five + 14} out={SEG_START.d2 - 6} text="5 columns." y={228} />
      <Kinetic f={f} at={T.mapA + 14} out={T.s23 - 4} text="Auto-matched." y={228} />
      <Kinetic f={f} at={T.scanA + 4} out={T.clickVal + 4} text="Every row checked." y={228} />
      <Kinetic f={f} at={T.chip47 + 14} out={T.already - 10} text="47 ready." y={228} />
      <Kinetic f={f} at={T.already + 14} out={T.clickEnroll - 20} text="1 flagged." y={228} color="#FCD34D" />
      <Kinetic f={f} at={T.clickEnroll + 6} out={T.s4D + 6} text="One click." y={228} />
    </AbsoluteFill>
  );
};

// ───────────────────────── PAYOFF ─────────────────────────
const PY = {
  n48: cue("p6", "forty-eight", -2),
  one: cue("p6", "one", -2),
  upload: cue("p6", "upload", 0),
  rachel: cue("p6", "rachel", 0),
  afternoon: cue("p6", "afternoon", 0),
  back: cue("p6", "back", 0),
};
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const n = countUp(f, PY.n48, 48, 20);
  const s48 = sp(f, PY.n48, 30, { damping: 10, stiffness: 190 });
  const back = pr(f, PY.back - 4, 16);
  const redIn = sp(f, PY.rachel - 4, 30, { damping: 14 });
  const hours = ["9 AM", "10", "11", "12 PM", "1", "2", "3", "4", "5 PM"];
  const push = 1 + 0.03 * lin(f, P6_START, SCENES_END);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, P6_START, 8) }}>
      <Backdrop f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 36%, rgba(59,130,246,0.38), transparent 60%)" }} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 0, top: 200, width: 1080, textAlign: "center", fontSize: 40, fontWeight: 900, letterSpacing: 8, color: "#93C5FD", opacity: pr(f, PY.n48, 10) }}>9:03 AM  ·  DONE</div>
        <div style={{ position: "absolute", left: 0, top: 290, width: 1080, textAlign: "center", fontSize: 420, fontWeight: 900, lineHeight: 1, color: "#fff", transform: `scale(${0.6 + 0.4 * s48})`, opacity: Math.min(1, s48 * 1.4), textShadow: "0 0 90px #3B82F6, 0 20px 60px #000A", fontVariantNumeric: "tabular-nums" }}>{n}</div>
        <div style={{ position: "absolute", left: 0, top: 730, width: 1080, textAlign: "center", fontSize: 52, fontWeight: 900, letterSpacing: 6, color: "#fff", opacity: pr(f, PY.n48 + 14, 10) }}>NEW HIRES ENROLLED</div>
        {f >= PY.one - 2 && (
          <div style={{ position: "absolute", left: 0, top: 830, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${1.5 - 0.5 * Math.min(1.05, sp(f, PY.one, 30, { damping: 10, stiffness: 220 }))})`, opacity: Math.min(1, sp(f, PY.one, 30) * 2) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 44px", borderRadius: 24, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", boxShadow: "0 20px 60px #1D4ED888", color: "#fff", fontSize: 76, fontWeight: 900, letterSpacing: 2 }}>📄 ONE UPLOAD</div>
          </div>
        )}
        {/* Rachel's calendar */}
        <div style={{ position: "absolute", left: 110, top: 1030, width: 860, height: 520, borderRadius: 28, background: "#fff", boxShadow: "0 40px 100px #000C", padding: "26px 30px", boxSizing: "border-box", opacity: pr(f, PY.rachel - 20, 16), transform: `translateY(${(1 - pr(f, PY.rachel - 20, 20)) * 90}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar t="R" s={56} />
            <div style={{ fontSize: 34, fontWeight: 900, color: INK }}>Rachel · Monday</div>
          </div>
          <div style={{ position: "relative", marginTop: 20, height: 400 }}>
            {hours.map((h, i) => (
              <div key={h} style={{ position: "absolute", left: 0, top: i * 44, width: "100%", borderTop: `2px solid ${LINE}`, fontSize: 20, fontWeight: 800, color: GRAY, paddingTop: 4 }}>{h}</div>
            ))}
            <div style={{ position: "absolute", left: 100, top: 4, right: 0, height: 36, borderRadius: 10, background: "#DBEAFE", color: BLUE, fontSize: 22, fontWeight: 800, padding: "5px 16px", boxSizing: "border-box" }}>New hire kickoff</div>
            {/* the afternoon */}
            <div style={{ position: "absolute", left: 100, top: 4 * 44 + 4, right: 0, height: 4 * 44 - 8, borderRadius: 14, background: "repeating-linear-gradient(135deg,#FEE2E2 0 18px,#FECACA 18px 36px)", border: "3px solid #F87171", color: "#B91C1C", fontSize: 30, fontWeight: 900, padding: "14px 20px", boxSizing: "border-box", opacity: redIn * (1 - back), transform: `scale(${1 - back * 0.25}) translateY(${back * -20}px)` }}>Typing 48 names…</div>
            <div style={{ position: "absolute", left: 100, top: 4 * 44 + 4, right: 0, height: 4 * 44 - 8, borderRadius: 14, background: "linear-gradient(135deg,#DCFCE7,#BBF7D0)", border: "3px solid #22C55E", color: "#15803D", fontSize: 34, fontWeight: 900, padding: "14px 20px", boxSizing: "border-box", opacity: back, transform: `scale(${0.85 + 0.15 * sp(f, PY.back, 30, { damping: 9 })})`, display: "flex", alignItems: "center", gap: 14 }}>☕ Free afternoon</div>
          </div>
        </div>
        <Confetti f={f} at={PY.back} cx={540} cy={1290} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── SFX + MAIN ─────────────────────────
type Fx = [number, string, number];
const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  // hook
  add(0, "whoosh", 0.25); add(HK.monday, "whoosh_s", 0.3); add(HK.nine, "pop", 0.35);
  add(HK.big48, "thud", 0.6);
  for (let i = 0; i < 48; i += 4) add(HK.big48 + 8 + i * 1.1, "pop", 0.22);
  add(HK.form, "swish", 0.4); add(HK.clock - 4, "riser", 0.32);
  for (let c = 0; c < 10; c++) {
    const t0 = HK.type0 + c * CYCLE;
    for (let k = 0; k < 8; k++) add(t0 + k * 1.3, ["key0", "key1", "key2"][(c + k) % 3], 0.22);
    add(t0 + 9, "click", 0.4); add(t0 + 10, "ding", 0.2);
  }
  add(HK.one1, "thud", 0.55); add(HK.by, "thud", 0.4); add(HK.one2, "thud", 0.65);
  add(DURATIONS.h0 - 6, "whoosh", 0.5);
  // demo
  add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  add(T.dlClick + 4, "swish", 0.35);
  for (let i = 0; i < 5; i++) add(T.five + i * 8, "pop", 0.3);
  add(T.drag, "whoosh_s", 0.3); add(T.drop, "thud", 0.5);
  [T.s12, T.s23, T.s34].forEach((t) => add(t, "swish", 0.45));
  add(T.s4D, "swish", 0.35);
  for (let i = 0; i < 5; i++) add(T.mapA + (i / 5) * (T.mapB - T.mapA) + 5, "ding", 0.35);
  add(T.scanA, "whoosh", 0.35);
  for (let i = 0; i < 6; i++) add(T.scanA + ((i + 0.6) / 6) * (T.scanB - T.scanA), "ding", 0.22);
  add(T.allValid, "ding", 0.55); add(T.chip47, "pop", 0.5); add(T.already, "pop", 0.5);
  add(T.clickEnroll + 2, "thud", 0.6);
  for (let i = 0; i < 6; i++) add(T.clickEnroll + 6 + i * 3, "swish", 0.15);
  add(T.s4D, "chime", 0.8); add(T.newUsers, "whoosh_s", 0.35); add(T.mail, "pop", 0.45);
  add(T.dlClick - 10, "swish", 0.2); add(T.already + 6, "swish", 0.25);
  // payoff
  add(P6_START - 3, "whoosh", 0.5); add(PY.n48, "thud", 0.6); add(PY.one, "thud", 0.55);
  add(PY.rachel, "swish", 0.3); add(PY.back, "chime", 0.8);
  return a;
})();

export const ReelBulkStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  const musicVol = (lf: number, len: number) => MUSIC ? 0.1 * Math.min(1, lf / 20) * Math.min(1, (len - lf) / 24) : 0;
  return (
    <AbsoluteFill style={{ background: "#040716" }}>
      <Sequence from={0} durationInFrames={DURATIONS.h0 + 6}><Hook f={f} /></Sequence>
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
      <Sequence from={DEMO_START - 2} durationInFrames={P6_START - DEMO_START + 14}><DemoScene f={f} /></Sequence>
      <Sequence from={P6_START} durationInFrames={SCENES_END - P6_START}><Payoff f={f} /></Sequence>
      <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>

      {/* grade layers over the story scenes only (intro/outro keep their own look) */}
      {(f < INTRO_START + 4 || (f >= DEMO_START - 4 && f < SCENES_END + 2)) && <Finish f={f} />}
      <Flash f={f} at={INTRO_START} />
      <Flash f={f} at={DEMO_START} color="#0B1A55" streak={false} d={6} />
      <Flash f={f} at={P6_START} />
      <Flash f={f} at={SCENES_END} d={8} />

      {/* voice */}
      {SEGS.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={k} from={SEG_START[k] + 2} durationInFrames={DURATIONS[k]}><Audio src={staticFile(`reelstory/${k}.mp3`)} /></Sequence>
      ))}
      {/* sound design */}
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={t} durationInFrames={80}><Audio src={staticFile(`story/sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {/* soft music bed (hook, and demo → payoff) */}
      {MUSIC && (
        <>
          <Sequence from={0} durationInFrames={INTRO_START + 10}><Audio src={staticFile("story/music.wav")} volume={(lf) => musicVol(lf, INTRO_START + 10)} loop /></Sequence>
          <Sequence from={DEMO_START - 6} durationInFrames={SCENES_END - DEMO_START + 12}><Audio src={staticFile("story/music.wav")} startFrom={300} volume={(lf) => musicVol(lf, SCENES_END - DEMO_START + 12)} loop /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
