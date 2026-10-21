import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";

/**
 * premiumKit — the "human-edited" ingredients of ReelBulkStoryVideo, packaged for ANY skillBNK video
 * (vertical 1080x1920 reels AND landscape 1920x1080). Rules + recipes: claude/premium-edit-rules.md
 * Needs public/story/{grain.png,sfx/*.wav,music.wav}  (python3 make_sfx.py public/story).
 */
export const FONT = "'Inter','SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif";
export const MARK = "#FF6A1A"; // hand-drawn marker orange
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const CAMEASE = Easing.bezier(0.55, 0, 0.1, 1);
export const pr = (f: number, a: number, d = 14) => interpolate(f, [a, a + d], [0, 1], { ...cl, easing: OUT });
export const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], cl);
export const sp = (f: number, a: number, fps = 30, cfg: object = {}) => spring({ frame: f - a, fps, config: { damping: 14, stiffness: 170, mass: 0.7, ...cfg } });
export const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const rip = (f: number, at: number) => (f >= at && f < at + 16 ? (f - at) / 16 : 0);
export const countUp = (f: number, a: number, to: number, d = 22) => Math.round(to * interpolate(f, [a, a + d], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) }));

// ── word-timed cues (voice script patches WT; fallback = ~11.6 frames/word) ─────────────────
export const makeCues = (SCRIPTS: Record<string, string>, SEG_START: Record<string, number>, WT: Record<string, number[]>, EST = 11.6) => {
  const toks = (k: string) => SCRIPTS[k].trim().split(/\s+/);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const widx = (k: string, w: string, occ = 0) => {
    const ws = toks(k).map(norm), t = norm(w);
    let c = 0;
    for (let i = 0; i < ws.length; i++) if (ws[i] === t) { if (c === occ) return i; c++; }
    return 0;
  };
  const wtime = (k: string, i: number) => (WT[k] && WT[k].length === toks(k).length ? WT[k][i] : i * EST + 6);
  /** absolute frame at which word `w` of beat `k` is spoken (+off frames) */
  return (k: string, w: string | number, off = 0, occ = 0) => SEG_START[k] + wtime(k, typeof w === "number" ? w : widx(k, w, occ)) + off;
};

// ── virtual camera ──────────────────────────────────────────────────────────────────────────
export type K4 = [number, number, number, number]; // frame, focusX, focusY, zoom
export const mono = (keys: K4[]): K4[] => { const o: K4[] = []; keys.forEach((k) => { const p = o[o.length - 1]; o.push([p && k[0] <= p[0] ? p[0] + 2 : k[0], k[1], k[2], k[3]]); }); return o; };
export const camAt = (f: number, keys: K4[]): [number, number, number] => {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2], keys[0][3]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, ax, ay, az] = keys[i], [b, bx, by, bz] = keys[i + 1];
    if (f < b) { const p = CAMEASE((f - a) / Math.max(1, b - a)); return [ax + (bx - ax) * p, ay + (by - ay) * p, az + (bz - az) * p]; }
  }
  const l = keys[keys.length - 1]; return [l[1], l[2], l[3]];
};
export type P3 = [number, number, number];
export const monoP = (pts: P3[]): P3[] => { const o: P3[] = []; pts.forEach((k) => { const p = o[o.length - 1]; o.push([p && k[0] <= p[0] ? p[0] + 2 : k[0], k[1], k[2]]); }); return o; };
/** cursor path with a human arc between points */
export const pathAt = (f: number, pts: P3[]): [number, number] => {
  if (f <= pts[0][0]) return [pts[0][1], pts[0][2]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, ax, ay] = pts[i], [b, bx, by] = pts[i + 1];
    if (f < b) {
      const p = CAMEASE((f - a) / Math.max(1, b - a)), dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, arc = Math.sin(Math.PI * p) * Math.min(60, d * 0.12);
      return [ax + dx * p - (dy / d) * arc, ay + dy * p + (dx / d) * arc];
    }
  }
  const l = pts[pts.length - 1]; return [l[1], l[2]];
};

/** Camera: put your whole "world" (app window, scribbles, cursor) inside; keys are in world coords. */
export const CameraWorld: React.FC<{ f: number; keys: K4[]; vc?: [number, number]; size?: [number, number]; children: React.ReactNode }> = ({ f, keys, vc = [540, 900], size = [1080, 1920], children }) => {
  const [cx, cy, cz] = camAt(f, keys);
  const dx = Math.sin(f / 31) * 4 + Math.sin(f / 11) * 1.4, dy = Math.cos(f / 37) * 4 + Math.sin(f / 13) * 1.2; // handheld
  const rot = Math.sin(f / 47) * 0.16, z = cz * (1 + Math.sin(f / 90) * 0.004);                                  // breath
  return (
    <AbsoluteFill style={{ transform: `rotate(${rot}deg) scale(1.03)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: size[0], height: size[1], transformOrigin: "0 0", transform: `translate(${vc[0] - cx * z + dx}px, ${vc[1] - cy * z + dy}px) scale(${z})` }}>{children}</div>
    </AbsoluteFill>
  );
};

// ── stage dressing ──────────────────────────────────────────────────────────────────────────
export const Bokeh: React.FC<{ f: number; cx?: number; cy?: number; tint?: string; w?: number; h?: number }> = ({ f, cx = 0, cy = 0, tint = "59,130,246", w = 1080, h = 1920 }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {Array.from({ length: 9 }, (_, i) => {
      const r = 90 + rnd(i) * 160, x = rnd(i + 5) * w, y = rnd(i + 11) * h, par = 0.03 + rnd(i + 2) * 0.07;
      return <div key={i} style={{ position: "absolute", left: x - r - cx * par + Math.sin(f / (60 + i * 9) + i) * 24, top: y - r - cy * par + Math.cos(f / (70 + i * 7) + i) * 24, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(${tint},${0.16 + rnd(i + 3) * 0.12}) 0%, rgba(${tint},0) 70%)` }} />;
    })}
  </AbsoluteFill>
);
/** navy backdrop + grid + parallax bokeh; warm 0→1 turns it amber/red (the "pain" colour grade) */
export const Backdrop: React.FC<{ f: number; cx?: number; cy?: number; warm?: number; w?: number; h?: number }> = ({ f, cx = 0, cy = 0, warm = 0, w = 1080, h = 1920 }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #0B2260 0%, #050A22 55%, #02030C 100%)" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)", backgroundSize: "72px 72px", backgroundPosition: `${-cx * 0.05}px ${-cy * 0.05}px` }} />
    <Bokeh f={f} cx={cx} cy={cy} w={w} h={h} tint={warm > 0.5 ? "245,158,11" : "59,130,246"} />
    {warm > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, rgba(245,120,30,${0.34 * warm}) 0%, rgba(120,30,10,${0.28 * warm}) 60%, rgba(30,5,5,${0.4 * warm}) 100%)`, mixBlendMode: "screen" }} />}
  </AbsoluteFill>
);
/** vignette + jittered film grain — put on top of story scenes (not the shared intro/outro) */
export const Finish: React.FC<{ f: number; w?: number; h?: number }> = ({ f, w = 1080, h = 1920 }) => {
  const j = Math.floor(f / 2);
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
      <Img src={staticFile("story/grain.png")} style={{ position: "absolute", left: -60 + rnd(j) * 50, top: -60 + rnd(j + 7) * 50, width: w + 120, height: h + 120, opacity: 0.085, mixBlendMode: "overlay", pointerEvents: "none" }} />
    </>
  );
};
/** flash + light streak at scene joins */
export const Flash: React.FC<{ f: number; at: number; d?: number; color?: string; streak?: boolean; w?: number; h?: number }> = ({ f, at, d = 7, color = "#CFE0FF", streak = true, w = 1080, h = 1920 }) => {
  const o = Math.max(0, 1 - Math.abs(f - at) / d);
  if (o <= 0) return null;
  const p = lin(f, at - d, at + d);
  return (
    <>
      <AbsoluteFill style={{ background: color, opacity: o * 0.85, pointerEvents: "none" }} />
      {streak && <div style={{ position: "absolute", top: 0, left: -600 + p * (w + 1200), width: 520, height: h, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)", opacity: o, transform: "skewX(-14deg)", pointerEvents: "none" }} />}
    </>
  );
};
/** short kinetic sticker (2–4 words) on a dark pill with orange outline — NOT a transcript */
export const Kinetic: React.FC<{ f: number; at: number; out: number; text: string; y?: number; size?: number; color?: string; rot?: number; w?: number }> = ({ f, at, out, text, y = 228, size = 84, color = "#fff", rot = -1.5, w = 1080 }) => {
  if (f < at - 1 || f > out + 12) return null;
  const s = sp(f, at, 30, { damping: 11, stiffness: 200, mass: 0.6 });
  const o = Math.min(1, s * 1.5) * (1 - lin(f, out, out + 10));
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: w, textAlign: "center", opacity: o, transform: `translateY(${(1 - Math.min(1, s)) * 50}px) rotate(${rot}deg) scale(${0.7 + 0.3 * s})`, fontFamily: FONT, pointerEvents: "none" }}>
      <span style={{ display: "inline-block", fontSize: size, fontWeight: 900, letterSpacing: -2, color, textShadow: "0 4px 18px #000A", padding: "6px 36px 10px", borderRadius: 28, background: "rgba(4,7,22,0.88)", border: "3px solid rgba(255,106,26,0.95)", boxShadow: "0 20px 60px #000A, 0 0 50px #FF6A1A44" }}>{text}</span>
    </div>
  );
};

// ── hand-drawn scribbles (WORLD coordinates, so they move with the camera) ──────────────────────
export const wobble = (cx: number, cy: number, rx: number, ry: number, seed: number) => {
  const pts: string[] = [], N = 64;
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = -2.2 + t * Math.PI * 2 * 1.1, k = 1 + 0.045 * Math.sin(a * 3 + seed) + 0.03 * Math.sin(a * 5 + seed * 2) + (t > 0.9 ? (t - 0.9) * 0.6 : 0);
    pts.push(`${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return pts.join(" ");
};
export const Scribble: React.FC<{ f: number; at: number; d?: number; out?: number; kind: "ring" | "under" | "arrow"; x: number; y: number; w?: number; h?: number; seed?: number; color?: string; sw?: number; label?: string; lx?: number; ly?: number; lrot?: number; worldW?: number; worldH?: number }> = ({ f, at, d = 16, out = 9999, kind, x, y, w = 200, h = 80, seed = 1, color = MARK, sw = 9, label, lx = 0, ly = 0, lrot = -4, worldW = 1080, worldH = 2000 }) => {
  if (f < at) return null;
  const p = Easing.out(Easing.cubic)(lin(f, at, at + d)), o = 1 - lin(f, out, out + 10);
  if (o <= 0) return null;
  const dstr = kind === "ring" ? wobble(x, y, w / 2, h / 2, seed)
    : kind === "under" ? `M${x - w / 2} ${y + Math.sin(seed) * 3} Q${x - w / 4} ${y - 9} ${x} ${y + 3} T${x + w / 2} ${y - 4}`
    : `M${x} ${y} Q${x + w * 0.45} ${y - h * 0.2} ${x + w} ${y + h} M${x + w - 34} ${y + h - 6} L${x + w} ${y + h} L${x + w - 8} ${y + h - 38}`;
  const lp = pr(f, at + d - 4, 10);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, width: worldW, height: worldH, overflow: "visible", opacity: o, pointerEvents: "none" }}>
        <path d={dstr} pathLength={1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - p} style={{ filter: "drop-shadow(0 3px 5px #0004)" }} />
      </svg>
      {label && <div style={{ position: "absolute", left: x + lx, top: y + ly, opacity: lp * o, transform: `rotate(${lrot}deg) scale(${0.8 + 0.2 * lp})`, padding: "8px 18px", borderRadius: 12, background: color, color: "#fff", fontSize: 30, fontWeight: 900, fontStyle: "italic", letterSpacing: 0.5, boxShadow: "0 8px 22px #0006", whiteSpace: "nowrap", fontFamily: FONT }}>{label}</div>}
    </>
  );
};

/** confetti burst (world coords) */
export const Confetti: React.FC<{ f: number; at: number; cx: number; cy: number }> = ({ f, at, cx, cy }) => {
  const p = f - at;
  if (p < 0 || p > 50) return null;
  return <>{Array.from({ length: 34 }, (_, i) => {
    const a = rnd(i) * Math.PI * 2, v = 160 + rnd(i + 9) * 360, t = p / 50, m = Math.min(1, t * 1.6);
    return <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * v * m, top: cy + Math.sin(a) * v * m + 420 * t * t, width: 14, height: i % 2 ? 14 : 26, borderRadius: i % 2 ? 7 : 3, background: ["#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#22D3EE"][i % 5], opacity: 1 - t, transform: `rotate(${rnd(i + 4) * 720 * t}deg)` }} />;
  })}</>;
};

/** Cursor (world coords): pass pts from monoP; clicks = frames. */
export const Cursor: React.FC<{ f: number; pts: P3[]; clicks: number[]; from: number; drag?: { a: number; b: number; label: string } }> = ({ f, pts, clicks, from, drag }) => {
  const [x, y] = pathAt(f, pts);
  const o = lin(f, from, from + 10), down = clicks.some((c) => f >= c && f < c + 5), dragging = drag && f >= drag.a && f < drag.b;
  return (
    <>
      {dragging && <div style={{ position: "absolute", left: x + 4, top: y + 6, padding: "12px 20px", borderRadius: 14, background: "#fff", boxShadow: "0 16px 40px #0007", fontSize: 24, fontWeight: 800, color: "#111827", transform: `rotate(${Math.sin(f / 6) * 3 + 4}deg)`, whiteSpace: "nowrap", fontFamily: FONT }}>{drag!.label}</div>}
      {clicks.map((c, i) => { const r = rip(f, c); return r > 0 ? <div key={i} style={{ position: "absolute", left: x - 10 - 55 * r, top: y - 10 - 55 * r, width: 20 + 110 * r, height: 20 + 110 * r, borderRadius: "50%", border: `5px solid ${MARK}`, opacity: 1 - r }} /> : null; })}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ position: "absolute", left: x - 6, top: y - 6, opacity: o, transform: `scale(${down ? 0.86 : 1})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        <path d="M4 3l7.5 18 2.6-7.6L21.7 10.8z" fill="#0B1020" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </>
  );
};
