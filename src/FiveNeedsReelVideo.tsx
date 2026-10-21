import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { FONT, pr, lin, sp, rnd, countUp, makeCues, Backdrop, Finish, Flash, Scribble, Confetti } from "./premiumKit";

/**
 * FiveNeedsReelVideo — 1080x1920 marketing reel: "The 5 things people need most" (time, clarity, status, certainty, connection).
 * Hook → MainIntro → five need scenes (each: big word + a small designed motion scene) → "your product" question → payoff → MainOutro.
 * No captions: each scene has one hero word, a bottom progress chip, and visuals timed to the spoken words (WT cues).
 * Voice: confident marketing delivery. `python3 generate-voice-story.py src/FiveNeedsReelVideo.tsx public/fiveneeds`
 * (the script reads VOICE_STYLE / VOICE_SPEED below, patches DURATIONS / VOICED / WT). No product claims on screen.
 */

const SEGS = ["h0", "n1", "n2", "n3", "n4", "n5", "c6", "p7"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 228,
  n1: 287,
  n2: 232,
  n3: 295,
  n4: 287,
  n5: 315,
  c6: 161,
  p7: 169,
};
const VOICED: string[] = ["h0", "n1", "n2", "n3", "n4", "n5", "c6", "p7"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 9, 17, 25, 39, 54, 64, 69, 73, 79, 88, 97, 105, 113, 138, 144, 171, 172, 177],
  n1: [2, 37, 73, 76, 88, 93, 115, 128, 130, 153, 176, 178, 186, 194, 202, 205, 219, 232, 241, 246, 252, 256, 264],
  n2: [2, 37, 73, 75, 81, 88, 93, 96, 101, 104, 128, 128, 133, 137, 144, 152, 172, 175, 181, 189, 195],
  n3: [2, 38, 63, 67, 72, 79, 82, 107, 110, 117, 120, 127, 130, 136, 167, 171, 183, 193, 204, 212, 228, 244, 249],
  n4: [2, 58, 75, 92, 102, 112, 120, 151, 153, 157, 161, 168, 176, 185, 192, 213, 219, 226, 250, 250, 259],
  n5: [2, 49, 74, 76, 85, 93, 106, 114, 141, 141, 147, 152, 170, 182, 187, 207, 214, 226, 241, 244, 250, 257, 267, 275, 283],
  c6: [2, 20, 26, 30, 35, 65, 66, 71, 75, 86, 91, 95, 110],
  p7: [2, 18, 24, 30, 55, 66, 70, 79, 89, 101, 141, 141],
};
// @WT-END
const MUSIC = true;
const VOICE_SPEED = 1.05;
const VOICE_NAME = "onyx"; // deep, authoritative male (alternatives: ash, echo)
const VOICE_STYLE = "You are a confident, high-energy male marketing coach speaking to ambitious founders. Deep, commanding, warm voice. Authoritative, assured and direct, with a steady driving rhythm, not shouting. Land each key word with weight: Time, Clarity, Status, Certainty, Connection, and Sell that. A short crisp pause after every number. Smile slightly, sound certain and persuasive. Never salesy, never robotic.";

const SCRIPTS: Record<Seg, string> = {
  h0: "You can sell almost anything, if you know the five things people need most. Just five. Here they are.",
  n1: "One. Time. Everyone is drowning in tasks, meetings, and follow-ups. Give someone back an hour a day, and they'll pay you for it.",
  n2: "Two. Clarity. Most people don't know what to do next. Show them the one path forward, and you've already sold them.",
  n3: "Three. Status. People want to feel important, and a step ahead of their peers. Almost every premium product sells this, admitted or not.",
  n4: "Four. Certainty. Nothing feels stable right now. The one who can promise an outcome, and back it up, wins the deal.",
  n5: "Five. Connection. People feel more isolated than ever. Help them build a community, a relationship, or a team, and you're selling something they're starving for.",
  c6: "Now look at your product. Which of these five does it actually deliver?",
  p7: "That's not a feature. That's the real reason someone buys. Sell that.",
};

const SEG_START = {} as Record<Seg, number>;
let _t = 0;
for (const k of SEGS) {
  SEG_START[k] = _t;
  _t += DURATIONS[k];
  if (k === "h0") _t += INTRO_FRAMES;
}
const INTRO_START = DURATIONS.h0;
const BODY_START = SEG_START.n1;
const SCENES_END = _t;
export const TOTAL_FRAMES = SCENES_END + OUTRO_FRAMES;
const cue = makeCues(SCRIPTS, SEG_START, WT);

// ───────────────────────── tokens ─────────────────────────
const NEEDS = [
  { seg: "n1" as Seg, word: "TIME", tok: "time", num: "one", acc: "#FB923C", soft: "251,146,60" },
  { seg: "n2" as Seg, word: "CLARITY", tok: "clarity", num: "two", acc: "#22D3EE", soft: "34,211,238" },
  { seg: "n3" as Seg, word: "STATUS", tok: "status", num: "three", acc: "#FACC15", soft: "250,204,21" },
  { seg: "n4" as Seg, word: "CERTAINTY", tok: "certainty", num: "four", acc: "#34D399", soft: "52,211,153" },
  { seg: "n5" as Seg, word: "CONNECTION", tok: "connection", num: "five", acc: "#F472B6", soft: "244,114,182" },
];
const NEXT: Record<string, number> = { n1: SEG_START.n2, n2: SEG_START.n3, n3: SEG_START.n4, n4: SEG_START.n5, n5: SEG_START.c6 };
const CX = 540;

// ───────────────────────── glyph icons (svg) ─────────────────────────
const Glyph: React.FC<{ k: number; s?: number; c?: string }> = ({ k, s = 100, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {k === 0 && <><circle cx="50" cy="52" r="34" /><path d="M50 52V30M50 52L66 62" /><path d="M40 12h20" /></>}
    {k === 1 && <><path d="M22 80C22 52 62 60 62 34" /><path d="M46 44L62 26L78 44" /></>}
    {k === 2 && <><path d="M16 74L22 34L38 52L50 24L62 52L78 34L84 74Z" /><path d="M20 86h60" /></>}
    {k === 3 && <><path d="M50 12L82 24V50C82 70 66 82 50 90C34 82 18 70 18 50V24Z" /><path d="M36 50L47 61L66 40" /></>}
    {k === 4 && <><circle cx="50" cy="26" r="10" /><circle cx="22" cy="72" r="10" /><circle cx="78" cy="72" r="10" /><path d="M44 35L28 63M56 35L72 63M33 72H67" /></>}
  </svg>
);
const Heart: React.FC<{ s: number; c?: string }> = ({ s, c = "#F472B6" }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><path d="M50 88C20 66 8 48 8 32C8 18 19 10 31 10C40 10 47 15 50 22C53 15 60 10 69 10C81 10 92 18 92 32C92 48 80 66 50 88Z" fill={c} /></svg>
);

// ───────────────────────── shared pieces ─────────────────────────
const Pill: React.FC<{ t: string; c: string; bg?: string; fs?: number; rot?: number; border?: boolean }> = ({ t, c, bg = "rgba(4,7,22,0.88)", fs = 40, rot = 0, border = true }) => (
  <div style={{ display: "inline-block", padding: `${fs * 0.22}px ${fs * 0.7}px`, borderRadius: fs, background: bg, color: c, fontSize: fs, fontWeight: 900, letterSpacing: 2, border: border ? `4px solid ${c}` : "none", boxShadow: `0 16px 50px #000A, 0 0 40px ${c}55`, transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", fontFamily: FONT }}>{t}</div>
);
const Chip: React.FC<{ f: number; idx: number; a: number; b: number }> = ({ f, idx, a, b }) => {
  const n = NEEDS[idx];
  const inn = pr(f, a, 12), out = lin(f, b - 4, b + 8);
  if (f < a - 2 || f > b + 12) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 1490, width: 1080, display: "flex", justifyContent: "center", opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 30 - out * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 30px 10px 10px", borderRadius: 999, background: "rgba(4,7,22,0.8)", border: `2px solid ${n.acc}99`, boxShadow: `0 10px 40px #0009, 0 0 40px ${n.acc}33` }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: n.acc, color: "#0B1020", fontSize: 30, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{idx + 1}</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 4 }}>{n.word}</div>
        <div style={{ display: "flex", gap: 8, marginLeft: 6 }}>{NEEDS.map((_, d) => <div key={d} style={{ width: d === idx ? 30 : 12, height: 12, borderRadius: 6, background: d <= idx ? n.acc : "rgba(255,255,255,0.22)" }} />)}</div>
      </div>
    </div>
  );
};

/** wrapper for each need scene: accent glow, number, giant word, underline, fade/slide between scenes */
const NeedFrame: React.FC<{ f: number; idx: number; children: React.ReactNode }> = ({ f, idx, children }) => {
  const n = NEEDS[idx];
  const a = SEG_START[n.seg], b = NEXT[n.seg];
  const tNum = cue(n.seg, n.num, -3), tWord = cue(n.seg, n.tok, -4);
  const inn = pr(f, a, 12), out = lin(f, b - 2, b + 10);
  const sNum = sp(f, tNum, 30, { damping: 11, stiffness: 220 });
  const sW = sp(f, tWord, 30, { damping: 10, stiffness: 200, mass: 0.7 });
  const push = 1 + 0.035 * lin(f, a, b);
  const drift = Math.sin(f / 33) * 3;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: Math.min(1, inn * 1.4) * (1 - out), transform: `translateX(${(1 - inn) * 70 - out * 70}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, rgba(${n.soft},0.26), transparent 62%)` }} />
      <AbsoluteFill style={{ transform: `translateY(${drift}px) scale(${push})` }}>
        <div style={{ position: "absolute", left: 0, top: 150, width: 1080, textAlign: "center", fontSize: 38, fontWeight: 900, letterSpacing: 9, color: n.acc, opacity: Math.min(1, sNum * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.1, sNum)})` }}>NEED {idx + 1} OF 5</div>
        {f >= tWord - 2 && (
          <div style={{ position: "absolute", left: 0, top: 215, width: 1080, textAlign: "center", fontSize: n.word.length > 8 ? 126 : 208, fontWeight: 900, letterSpacing: -4, lineHeight: 1.05, color: "#fff", opacity: Math.min(1, sW * 1.6), transform: `scale(${0.5 + 0.5 * Math.min(1.08, sW)}) rotate(${(1 - Math.min(1, sW)) * -4}deg)`, textShadow: `0 0 80px ${n.acc}, 0 14px 50px #000B` }}>{n.word}</div>
        )}
        <Scribble f={f} at={tWord + 12} d={16} out={b - 2} kind="under" x={CX} y={n.word.length > 8 ? 392 : 478} w={n.word.length > 8 ? 700 : 640} seed={n.word.length} color={n.acc} sw={12} worldW={1080} worldH={1920} />
        {children}
      </AbsoluteFill>
      <Chip f={f} idx={idx} a={a + 10} b={b} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 1 · TIME ─────────────────────────
const TimeHero: React.FC<{ f: number }> = ({ f }) => {
  const S = SEG_START.n1;
  const drown = cue("n1", "drowning", -4), c1 = cue("n1", "tasks", -4), c2 = cue("n1", "meetings", -4), c3 = cue("n1", "followups", -4);
  const hr = cue("n1", "hour", -2), pay = cue("n1", "pay", -2);
  const wave = lin(f, drown, hr - 4) * (1 - pr(f, hr + 2, 20));
  const spin = f < hr ? (f - S) * 15 : 15 * (hr - S) + (1 - pr(f, hr, 18)) * 0;
  const mAng = f < hr ? spin : ((spin % 360) + (360 - (spin % 360)) * pr(f, hr, 20));
  const hAng = 20 + (f - S) * 0.5;
  const green = pr(f, hr + 6, 14);
  const chips = [["Tasks", c1, 300, 1210], ["Meetings", c2, 540, 1270], ["Follow-ups", c3, 780, 1210]] as const;
  const away = pr(f, hr + 4, 16);
  const clockY = 900;
  return (
    <>
      <div style={{ position: "absolute", left: CX - 230, top: clockY - 230, width: 460, height: 460 }}>
        <svg width="460" height="460" viewBox="0 0 460 460">
          <circle cx="230" cy="230" r="215" fill="#0B1230" stroke="#FB923C" strokeWidth="10" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1="230" y1="34" x2="230" y2={i % 3 === 0 ? 68 : 52} stroke="#fff" strokeWidth={i % 3 === 0 ? 9 : 5} strokeOpacity="0.85" transform={`rotate(${i * 30} 230 230)`} />)}
          <path d="M230 230 L230 34 A196 196 0 0 1 400 132 Z" fill="#22C55E" opacity={0.55 * green} />
          <line x1="230" y1="230" x2="230" y2="130" stroke="#fff" strokeWidth="16" strokeLinecap="round" transform={`rotate(${hAng} 230 230)`} />
          <line x1="230" y1="230" x2="230" y2="62" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" transform={`rotate(${mAng} 230 230)`} />
          <circle cx="230" cy="230" r="16" fill="#FB923C" />
        </svg>
      </div>
      {/* rising "water" of work */}
      {wave > 0.01 && (
        <div style={{ position: "absolute", left: 90, top: clockY + 230 - wave * 330, width: 900, height: 360, overflow: "hidden", borderRadius: "40px 40px 0 0", opacity: 0.9 * (1 - away), WebkitMaskImage: "linear-gradient(180deg,#000 55%,transparent)", maskImage: "linear-gradient(180deg,#000 55%,transparent)" }}>
          <svg width="900" height="360" viewBox="0 0 900 360"><path d={`M0 30 ${Array.from({ length: 19 }, (_, i) => `L${i * 50} ${22 + Math.sin(f / 7 + i) * 10}`).join(" ")} L900 360 L0 360Z`} fill="rgba(251,146,60,0.35)" stroke="#FB923C" strokeWidth="4" /></svg>
        </div>
      )}
      {chips.map(([t, at, x, y], i) => {
        const s = sp(f, at, 30, { damping: 11, stiffness: 190 });
        return (
          <div key={t} style={{ position: "absolute", left: x - 140, top: y - 40 + Math.sin(f / 9 + i * 2) * 8 - away * 520, width: 280, textAlign: "center", opacity: Math.min(1, s * 2) * (1 - away), transform: `scale(${0.4 + 0.6 * Math.min(1.1, s)}) rotate(${(i - 1) * 5}deg)` }}>
            <Pill t={t} c="#FDBA74" fs={38} />
          </div>
        );
      })}
      {f >= hr && (
        <div style={{ position: "absolute", left: 0, top: 1160, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, hr + 6, 30) * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.1, sp(f, hr + 6, 30, { damping: 9 }))})` }}>
          <Pill t={`+${countUp(f, hr + 6, 1, 10)} HOUR BACK`} c="#4ADE80" fs={62} rot={-2} />
        </div>
      )}
      {f >= pay && (
        <div style={{ position: "absolute", left: 0, top: 1300, width: 1080, textAlign: "center", opacity: pr(f, pay, 8), transform: `scale(${0.7 + 0.3 * Math.min(1.1, sp(f, pay, 30, { damping: 9 }))}) rotate(2deg)` }}>
          <Pill t="💰 THEY'LL PAY" c="#FDE047" fs={54} />
        </div>
      )}
      <Confetti f={f} at={pay} cx={CX} cy={1320} />
    </>
  );
};

// ───────────────────────── 2 · CLARITY ─────────────────────────
const ClarityHero: React.FC<{ f: number }> = ({ f }) => {
  const know = cue("n2", "know", -2), show = cue("n2", "show", -2), path = cue("n2", "path", -4), sold = cue("n2", "sold", -3);
  const fade = pr(f, show, 14);
  const arrows = Array.from({ length: 14 }, (_, i) => {
    const ang = rnd(i) * 360, r = 150 + rnd(i + 3) * 230, a = (rnd(i + 8) * Math.PI * 2);
    return { x: CX + Math.cos(a) * r * 0.95, y: 960 + Math.sin(a) * r * 0.85, ang, i };
  });
  return (
    <>
      {arrows.map((a) => {
        const s = sp(f, SEG_START.n2 + 40 + a.i * 3, 30, { damping: 11 });
        return (
          <div key={a.i} style={{ position: "absolute", left: a.x - 40, top: a.y - 40, width: 80, height: 80, opacity: Math.min(1, s * 2) * (1 - fade) * 0.9, transform: `rotate(${a.ang + Math.sin(f / (12 + a.i)) * 25}deg) scale(${0.4 + 0.6 * Math.min(1, s)})` }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 40H68M48 20L68 40L48 60" /></svg>
          </div>
        );
      })}
      {f >= know && f < show + 10 && (
        <div style={{ position: "absolute", left: 0, top: 880, width: 1080, textAlign: "center", fontSize: 280, fontWeight: 900, color: "#fff", opacity: Math.min(1, sp(f, know, 30) * 1.5) * (1 - fade), transform: `scale(${0.6 + 0.4 * Math.min(1.1, sp(f, know, 30, { damping: 8 }))}) rotate(-6deg)`, textShadow: "0 0 70px #22D3EE" }}>?</div>
      )}
      {/* the one path */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible", opacity: pr(f, show, 8) }}>
        <path d="M540 1380 C540 1240 430 1180 500 1040 S660 880 540 700" fill="none" stroke="#0E7490" strokeWidth="74" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lin(f, show, path + 20)} />
        <path d="M540 1380 C540 1240 430 1180 500 1040 S660 880 540 700" fill="none" stroke="#22D3EE" strokeWidth="60" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lin(f, show, path + 20)} style={{ filter: "drop-shadow(0 0 24px #22D3EE)" }} />
        <path d="M540 1380 C540 1240 430 1180 500 1040 S660 880 540 700" fill="none" stroke="#ECFEFF" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="0.02 0.03" strokeDashoffset={1 - lin(f, show, path + 20)} />
      </svg>
      {f >= path + 14 && (
        <div style={{ position: "absolute", left: CX - 90, top: 590, opacity: pr(f, path + 14, 8), transform: `scale(${0.5 + 0.5 * Math.min(1.1, sp(f, path + 14, 30, { damping: 9 }))})` }}>
          <svg width="180" height="140" viewBox="0 0 180 140"><path d="M90 6L170 130H10Z" fill="#22D3EE" stroke="#ECFEFF" strokeWidth="8" strokeLinejoin="round" /></svg>
        </div>
      )}
      {f >= sold && (
        <div style={{ position: "absolute", left: 0, top: 1210, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, sold, 30) * 2), transform: `scale(${1.8 - 0.8 * Math.min(1.05, sp(f, sold, 30, { damping: 10, stiffness: 230 }))}) rotate(-8deg)` }}>
          <Pill t="SOLD ✓" c="#4ADE80" fs={92} />
        </div>
      )}
      <Confetti f={f} at={sold} cx={CX} cy={1250} />
    </>
  );
};

// ───────────────────────── 3 · STATUS ─────────────────────────
const StatusHero: React.FC<{ f: number }> = ({ f }) => {
  const imp = cue("n3", "important", -4), ahead = cue("n3", "ahead", -6), prem = cue("n3", "premium", -4);
  const up = sp(f, ahead, 30, { damping: 16, stiffness: 90, mass: 1 });
  const crown = sp(f, imp + 6, 30, { damping: 9, stiffness: 180 });
  const tints = ["#64748B", "#6B7A90", "#58677D", "#7A889C", "#64748B", "#6B7A90"];
  const xs = [190, 305, 420, 650, 765, 880];
  const burst = f >= imp && f < imp + 26 ? (f - imp) / 26 : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: 1250, width: 840, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.18)" }} />
      {xs.map((x, i) => {
        const s = sp(f, SEG_START.n3 + 30 + i * 4, 30, { damping: 12 });
        return <div key={i} style={{ position: "absolute", left: x - 42, top: 1160 - (1 - Math.min(1, s)) * -80, width: 84, height: 84, borderRadius: "50%", background: tints[i], opacity: Math.min(1, s * 2) * (1 - 0.35 * up), boxShadow: "0 10px 30px #0008", transform: `scale(${0.4 + 0.6 * Math.min(1, s)})` }} />;
      })}
      {/* podium */}
      <div style={{ position: "absolute", left: CX - 80, top: 1254 - up * 270, width: 160, height: 140 + up * 270, borderRadius: "14px 14px 0 0", background: "linear-gradient(180deg,#FDE047,#CA8A04)", boxShadow: "0 20px 60px #000A", opacity: pr(f, imp - 4, 10) }} />
      <div style={{ position: "absolute", left: CX - 66, top: 1090 - up * 270, width: 132, height: 132, borderRadius: "50%", background: "linear-gradient(135deg,#FDE047,#F59E0B)", border: "6px solid #fff", boxShadow: `0 0 ${40 + 30 * Math.sin(f / 6)}px #FACC15, 0 20px 50px #000A`, transform: `scale(${0.5 + 0.5 * Math.min(1.1, sp(f, SEG_START.n3 + 30, 30, { damping: 9 }))})` }} />
      {f >= imp && (
        <div style={{ position: "absolute", left: CX - 80, top: 960 - up * 270 - (1 - Math.min(1, crown)) * 160, width: 160, height: 120, opacity: Math.min(1, crown * 2), transform: `scale(${0.7 + 0.3 * Math.min(1.1, crown)})` }}>
          <svg width="160" height="120" viewBox="0 0 100 70"><path d="M8 62L14 20L34 40L50 8L66 40L86 20L92 62Z" fill="#FACC15" stroke="#fff" strokeWidth="4" strokeLinejoin="round" /></svg>
        </div>
      )}
      {burst > 0 && Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2, r = 110 + burst * 190;
        return <div key={i} style={{ position: "absolute", left: CX + Math.cos(a) * r - 6, top: 1010 - up * 270 + Math.sin(a) * r - 18, width: 12, height: 36, borderRadius: 6, background: "#FDE047", opacity: 1 - burst, transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }} />;
      })}
      {f >= prem && (
        <div style={{ position: "absolute", left: 0, top: 560, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, prem, 30) * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.1, sp(f, prem, 30, { damping: 9 }))}) rotate(-3deg)` }}>
          <div style={{ position: "relative", display: "inline-block", overflow: "hidden", borderRadius: 60 }}>
            <Pill t="★ PREMIUM" c="#FDE047" fs={80} />
            <div style={{ position: "absolute", top: 0, left: -200 + lin(f, prem + 6, prem + 30) * 900, width: 120, height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)", transform: "skewX(-18deg)" }} />
          </div>
        </div>
      )}
    </>
  );
};

// ───────────────────────── 4 · CERTAINTY ─────────────────────────
const CertaintyHero: React.FC<{ f: number }> = ({ f }) => {
  const stable = cue("n4", "stable", -4), promise = cue("n4", "promise", -6), back = cue("n4", "back", -4), wins = cue("n4", "wins", -4);
  const shake = f >= stable && f < promise + 16 ? (1 - lin(f, promise, promise + 16)) * 1 : 0;
  const fly = lin(f, promise - 4, promise + 10);
  const hit = f >= promise + 10;
  const sx = Math.sin(f * 2.1) * 9 * shake, sy = Math.cos(f * 1.7) * 7 * shake;
  const ang = Math.atan2(880 - 1380, 540 - 120);
  const ax = 120 + (540 - 120) * Easing.out(Easing.cubic)(fly), ay = 1380 + (880 - 1380) * Easing.out(Easing.cubic)(fly);
  return (
    <>
      <div style={{ position: "absolute", left: sx, top: sy, width: 1080, height: 1920 }}>
        {/* floor grid that shakes then goes solid */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width="1080" height="1920">
          {Array.from({ length: 6 }, (_, i) => {
            const y = 1190 + i * 44, amp = 16 * (1 - lin(f, promise, promise + 20));
            return <path key={i} d={`M60 ${y} ${Array.from({ length: 22 }, (_, k) => `L${60 + k * 47} ${y + Math.sin(f / 5 + k * 0.9 + i) * amp}`).join(" ")}`} stroke="#34D399" strokeOpacity={0.25 + i * 0.07} strokeWidth="4" fill="none" />;
          })}
        </svg>
        {/* target */}
        <svg style={{ position: "absolute", left: CX - 260, top: 620, opacity: pr(f, stable, 12) }} width="520" height="520" viewBox="0 0 520 520">
          {[250, 195, 140, 85, 32].map((r, i) => <circle key={r} cx="260" cy="260" r={r} fill={i % 2 === 0 ? "#fff" : "#10B981"} stroke="#064E3B" strokeWidth="4" />)}
        </svg>
      </div>
      {f >= promise - 4 && (
        <div style={{ position: "absolute", left: ax - 6, top: ay - 6, width: 0, height: 0, transform: `rotate(${(ang * 180) / Math.PI}deg)` }}>
          <div style={{ position: "absolute", left: -150, top: -6, width: 150, height: 12, borderRadius: 6, background: "linear-gradient(90deg,transparent,#E2E8F0)" }} />
          <div style={{ position: "absolute", left: -6, top: -18, width: 0, height: 0, borderLeft: "34px solid #fff", borderTop: "18px solid transparent", borderBottom: "18px solid transparent", filter: "drop-shadow(0 0 14px #34D399)" }} />
        </div>
      )}
      {hit && f < promise + 24 && <div style={{ position: "absolute", left: CX - 40 - (f - promise - 10) * 18, top: 840 - (f - promise - 10) * 18, width: 80 + (f - promise - 10) * 36, height: 80 + (f - promise - 10) * 36, borderRadius: "50%", border: "6px solid #34D399", opacity: 1 - lin(f, promise + 10, promise + 24) }} />}
      {f >= back && (
        <div style={{ position: "absolute", left: 0, top: 1120, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, back, 30) * 2), transform: `scale(${1.7 - 0.7 * Math.min(1.05, sp(f, back, 30, { damping: 10, stiffness: 230 }))}) rotate(-7deg)` }}>
          <Pill t="PROOF ✓" c="#34D399" fs={84} />
        </div>
      )}
      {f >= wins && (
        <div style={{ position: "absolute", left: 0, top: 1320, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, wins, 30) * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.1, sp(f, wins, 30, { damping: 9 }))})` }}>
          <Pill t="DEAL WON 🏆" c="#FDE047" fs={64} />
        </div>
      )}
      <Confetti f={f} at={wins} cx={CX} cy={1300} />
    </>
  );
};

// ───────────────────────── 5 · CONNECTION ─────────────────────────
const ConnectionHero: React.FC<{ f: number }> = ({ f }) => {
  const iso = cue("n5", "isolated", -4), comm = cue("n5", "community", -4), rel = cue("n5", "relationship", -4), team = cue("n5", "team", -4), starve = cue("n5", "starving", -4);
  const N = 10;
  const join = Easing.inOut(Easing.cubic)(lin(f, comm, comm + 30));
  const pts = Array.from({ length: N }, (_, i) => {
    const sx = 150 + rnd(i + 1) * 780, sy = 680 + rnd(i + 9) * 680;
    const a = (i / N) * Math.PI * 2 - Math.PI / 2, tx = CX + Math.cos(a) * 230, ty = 980 + Math.sin(a) * 230;
    return { x: sx + (tx - sx) * join + Math.sin(f / (20 + i)) * (1 - join) * 10, y: sy + (ty - sy) * join + Math.cos(f / (24 + i)) * (1 - join) * 10, i };
  });
  const beat = 1 + 0.09 * Math.max(0, Math.sin(f / 4.5));
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width="1080" height="1920">
        {pts.map((p, i) => {
          const q = pts[(i + 1) % N];
          const dr = lin(f, comm + 6 + i * 2, comm + 28 + i * 2);
          return <line key={i} x1={p.x} y1={p.y} x2={p.x + (q.x - p.x) * dr} y2={p.y + (q.y - p.y) * dr} stroke="#F472B6" strokeWidth="5" strokeOpacity="0.7" strokeLinecap="round" />;
        })}
        {pts.map((p, i) => {
          const q = pts[(i + 3) % N];
          const dr = lin(f, comm + 24 + i * 2, comm + 44 + i * 2);
          return <line key={`b${i}`} x1={p.x} y1={p.y} x2={p.x + (q.x - p.x) * dr} y2={p.y + (q.y - p.y) * dr} stroke="#F472B6" strokeWidth="3" strokeOpacity="0.4" strokeLinecap="round" />;
        })}
        {f >= rel && <line x1={pts[0].x} y1={pts[0].y} x2={pts[1].x} y2={pts[1].y} stroke="#FDF2F8" strokeWidth={12 * pr(f, rel, 10)} strokeLinecap="round" />}
      </svg>
      {pts.map((p) => {
        const s = sp(f, SEG_START.n5 + 40 + p.i * 3, 30, { damping: 11 });
        const joined = join > 0.5;
        const focus = f >= rel && f < team && p.i < 2;
        return <div key={p.i} style={{ position: "absolute", left: p.x - 36, top: p.y - 36, width: 72, height: 72, borderRadius: "50%", background: joined || focus ? "linear-gradient(135deg,#F9A8D4,#EC4899)" : "#64748B", border: focus ? "5px solid #fff" : "none", boxShadow: joined ? "0 0 30px #F472B688" : "0 8px 20px #0007", opacity: Math.min(1, s * 2), transform: `scale(${(0.4 + 0.6 * Math.min(1, s)) * (focus ? 1.25 : 1)})` }} />;
      })}
      {f >= iso && f < comm && (
        <div style={{ position: "absolute", left: 0, top: 560, width: 1080, textAlign: "center", opacity: pr(f, iso, 8), transform: `scale(${0.8 + 0.2 * pr(f, iso, 14)})` }}><Pill t="ALONE" c="#CBD5E1" fs={52} /></div>
      )}
      {f >= rel && f < starve && (
        <div style={{ position: "absolute", left: (pts[0].x + pts[1].x) / 2 - 36, top: (pts[0].y + pts[1].y) / 2 - 36, width: 72, height: 72, transform: `scale(${sp(f, rel + 8, 30, { damping: 8 })})` }}><Heart s={72} /></div>
      )}
      {f >= team && <Scribble f={f} at={team} d={18} out={starve + 4} kind="ring" x={CX} y={980} w={640} h={640} seed={4} color="#F472B6" sw={9} worldW={1080} worldH={1920} />}
      {f >= starve && (
        <div style={{ position: "absolute", left: CX - 120, top: 980 - 120, width: 240, height: 240, opacity: Math.min(1, sp(f, starve, 30) * 2), transform: `scale(${(0.5 + 0.5 * Math.min(1.1, sp(f, starve, 30, { damping: 9 }))) * beat})`, filter: "drop-shadow(0 0 40px #F472B6)" }}><Heart s={240} /></div>
      )}
    </>
  );
};

// ───────────────────────── hook ─────────────────────────
const HK = { sell: cue("h0", "sell", -4), five: cue("h0", "five", -6), most: cue("h0", "most", -2), just: cue("h0", "just", -2), here: cue("h0", "here", -2) };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const H0 = DURATIONS.h0;
  const s5 = sp(f, HK.five, 30, { damping: 9, stiffness: 210, mass: 0.7 });
  const push = 1 + 0.04 * lin(f, 0, H0);
  const drift = { x: Math.sin(f / 31) * 3, y: Math.cos(f / 37) * 3 };
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} />
      <AbsoluteFill style={{ transform: `translate(${drift.x}px,${drift.y}px) scale(${push})` }}>
        {f >= HK.sell - 2 && (
          <div style={{ position: "absolute", left: 0, top: 200, width: 1080, textAlign: "center", fontSize: 130, fontWeight: 900, letterSpacing: 6, color: "#FDBA74", opacity: Math.min(1, sp(f, HK.sell, 30) * 2), transform: `scale(${1.6 - 0.6 * Math.min(1.05, sp(f, HK.sell, 30, { damping: 10, stiffness: 230 }))})`, textShadow: "0 8px 0 #7C2D12, 0 20px 60px #000" }}>SELL</div>
        )}
        {f >= HK.five - 2 && (
          <div style={{ position: "absolute", left: 0, top: 380, width: 1080, textAlign: "center", fontSize: 640, fontWeight: 900, lineHeight: 1, color: "#fff", opacity: Math.min(1, s5 * 1.6), transform: `scale(${0.4 + 0.6 * Math.min(1.08, s5)}) rotate(${(1 - Math.min(1, s5)) * 6}deg)`, textShadow: "0 0 120px #3B82F6, 0 30px 80px #000A" }}>5</div>
        )}
        {f >= HK.most && (
          <div style={{ position: "absolute", left: 0, top: 1060, width: 1080, textAlign: "center", fontSize: 54, fontWeight: 900, letterSpacing: 7, color: "#93C5FD", opacity: pr(f, HK.most, 10) }}>THINGS PEOPLE NEED MOST</div>
        )}
        <Scribble f={f} at={HK.just} d={16} out={H0 + 10} kind="under" x={CX} y={1110} w={820} seed={3} worldW={1080} worldH={1920} />
        <div style={{ position: "absolute", left: 90, top: 1200, width: 900, display: "flex", justifyContent: "space-between" }}>
          {NEEDS.map((n, i) => {
            const at = HK.here + i * 6, s = sp(f, at, 30, { damping: 10, stiffness: 200 }), on = f >= at;
            return (
              <div key={i} style={{ width: 150, height: 150, borderRadius: "50%", border: `5px ${on ? "solid" : "dashed"} ${on ? n.acc : "rgba(255,255,255,0.35)"}`, background: on ? `rgba(${n.soft},0.16)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.7 + 0.3 * Math.min(1.1, s) : pr(f, HK.just, 10)})`, opacity: pr(f, HK.just, 10), boxShadow: on ? `0 0 40px ${n.acc}66` : "none" }}>
                {on && <Glyph k={i} s={86} c={n.acc} />}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── question + payoff ─────────────────────────
const Medallions: React.FC<{ f: number; at: number; y: number; size?: number; on?: number }> = ({ f, at, y, size = 140, on }) => {
  const gap = 24, total = size * 5 + gap * 4, x0 = (1080 - total) / 2 - 20;
  return (
    <div style={{ position: "absolute", left: x0, top: y, display: "flex", gap }}>
      {NEEDS.map((n, i) => {
        const s = sp(f, at + i * 5, 30, { damping: 10, stiffness: 200 });
        const lit = on === undefined ? true : f >= on + i * 14 && f < on + i * 14 + 26;
        return (
          <div key={i} style={{ width: size, textAlign: "center", opacity: Math.min(1, s * 2), transform: `scale(${0.4 + 0.6 * Math.min(1.1, s)}) translateY(${lit && on !== undefined ? -14 : 0}px)` }}>
            <div style={{ width: size, height: size, borderRadius: "50%", border: `5px solid ${n.acc}`, background: `rgba(${n.soft},${lit ? 0.35 : 0.14})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: lit ? `0 0 50px ${n.acc}` : `0 0 20px ${n.acc}44` }}><Glyph k={i} s={size * 0.6} c={n.acc} /></div>
            <div style={{ marginTop: 10, fontSize: 21, fontWeight: 900, letterSpacing: 1, color: "#fff", opacity: 0.9 }}>{n.word}</div>
          </div>
        );
      })}
    </div>
  );
};
const Question: React.FC<{ f: number }> = ({ f }) => {
  const a = SEG_START.c6, b = SEG_START.p7;
  const prod = cue("c6", "product", -4), which = cue("c6", "which", -2), del = cue("c6", "deliver", -2);
  const inn = pr(f, a, 12), out = lin(f, b - 2, b + 10);
  const sp1 = sp(f, prod, 30, { damping: 11 });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: inn * (1 - out), transform: `translateX(${(1 - inn) * 70 - out * 70}px)` }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
      <div style={{ position: "absolute", left: 0, top: 230, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, a + 4, 30) * 2), transform: `scale(${0.7 + 0.3 * Math.min(1.1, sp(f, a + 4, 30))})` }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 8, color: "#93C5FD" }}>NOW LOOK AT</div>
      </div>
      <div style={{ position: "absolute", left: 190, top: 340, width: 700, height: 330, borderRadius: 36, background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", boxShadow: "0 40px 110px #000B, 0 0 80px #3B82F677", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, opacity: Math.min(1, sp1 * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.08, sp1)}) rotate(${(1 - Math.min(1, sp1)) * -5}deg)` }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: "#DBEAFE", letterSpacing: 6 }}>YOUR</div>
        <div style={{ fontSize: 104, fontWeight: 900, color: "#fff", letterSpacing: -3, lineHeight: 1 }}>PRODUCT</div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width="1080" height="1920">
        {NEEDS.map((n, i) => {
          const x = (1080 - (140 * 5 + 24 * 4)) / 2 - 20 + 70 + i * 164;
          return <line key={i} x1="540" y1="670" x2={x} y2="905" stroke={n.acc} strokeWidth="5" strokeDasharray="12 12" strokeOpacity={0.7 * pr(f, which, 10)} strokeDashoffset={-f * 1.4} />;
        })}
      </svg>
      <Medallions f={f} at={which - 6} y={910} on={which + 6} />
      {f >= del && (
        <div style={{ position: "absolute", left: 0, top: 1210, width: 1080, textAlign: "center", opacity: Math.min(1, sp(f, del, 30) * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.1, sp(f, del, 30, { damping: 8 }))})` }}>
          <div style={{ fontSize: 190, fontWeight: 900, color: "#FDE047", textShadow: "0 0 70px #FACC15" }}>WHICH ONE?</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const a = SEG_START.p7;
  const feat = cue("p7", "feature", -2), reason = cue("p7", "reason", -4), sell = cue("p7", "sell", -4), that = cue("p7", "that", -2);
  const strike = lin(f, feat + 6, feat + 20);
  const sR = sp(f, reason, 30, { damping: 11 });
  const sS = sp(f, sell, 30, { damping: 9, stiffness: 230 });
  const sT = sp(f, that, 30, { damping: 9, stiffness: 230 });
  const push = 1 + 0.03 * lin(f, a, SCENES_END);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, a, 8) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.38), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 0, top: 250, width: 1080, textAlign: "center", opacity: pr(f, a + 2, 10) }}>
          <span style={{ position: "relative", display: "inline-block", fontSize: 120, fontWeight: 900, letterSpacing: -2, color: strike > 0.1 ? "#64748B" : "#fff" }}>A FEATURE
            <span style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `${strike * 108}%`, background: "#F87171", borderRadius: 6, transform: "rotate(-3deg)" }} />
          </span>
        </div>
        {f >= reason - 2 && (
          <div style={{ position: "absolute", left: 0, top: 480, width: 1080, textAlign: "center", opacity: Math.min(1, sR * 2), transform: `scale(${0.7 + 0.3 * Math.min(1.1, sR)})` }}>
            <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: 6, color: "#93C5FD" }}>THE REAL REASON</div>
            <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -4, color: "#fff", lineHeight: 1.05, textShadow: "0 0 80px #3B82F6" }}>THEY BUY</div>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, top: 800, width: 1080, textAlign: "center", lineHeight: 0.95 }}>
          {f >= sell - 2 && <div style={{ fontSize: 250, fontWeight: 900, letterSpacing: -6, color: "#FDBA74", opacity: Math.min(1, sS * 2), transform: `scale(${1.8 - 0.8 * Math.min(1.05, sS)}) rotate(-2deg)`, textShadow: "0 10px 0 #7C2D12, 0 30px 80px #000" }}>SELL</div>}
          {f >= that - 2 && <div style={{ fontSize: 250, fontWeight: 900, letterSpacing: -6, color: "#fff", opacity: Math.min(1, sT * 2), transform: `scale(${1.8 - 0.8 * Math.min(1.05, sT)}) rotate(2deg)`, textShadow: "0 10px 0 #1E3A8A, 0 30px 80px #000, 0 0 100px #3B82F6" }}>THAT.</div>}
        </div>
        <Medallions f={f} at={that + 6} y={1380} size={120} />
        <Confetti f={f} at={that} cx={540} cy={1100} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── SFX + MAIN ─────────────────────────
type Fx = [number, string, number];
const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(HK.sell, "thud", 0.55); add(HK.five, "thud", 0.7); add(HK.most, "swish", 0.3); add(HK.just, "pop", 0.4);
  NEEDS.forEach((_, i) => add(HK.here + i * 6, "pop", 0.4));
  add(DURATIONS.h0 - 6, "whoosh", 0.5);
  NEEDS.forEach((n) => { add(SEG_START[n.seg] - 3, "whoosh", 0.4); add(cue(n.seg, n.num, -3), "thud", 0.5); add(cue(n.seg, n.tok, -4), "thud", 0.6); });
  // time
  add(cue("n1", "tasks", -4), "pop", 0.4); add(cue("n1", "meetings", -4), "pop", 0.4); add(cue("n1", "followups", -4), "pop", 0.4); add(cue("n1", "drowning", -4), "riser", 0.3);
  add(cue("n1", "hour", -2), "chime", 0.7); add(cue("n1", "pay", -2), "ding", 0.6);
  // clarity
  add(cue("n2", "know", -2), "pop", 0.45); add(cue("n2", "show", -2), "whoosh_s", 0.45); add(cue("n2", "sold", -3), "thud", 0.6); add(cue("n2", "sold", 2), "chime", 0.6);
  // status
  add(cue("n3", "important", -4), "ding", 0.55); add(cue("n3", "ahead", -6), "whoosh_s", 0.45); add(cue("n3", "premium", -4), "chime", 0.7);
  // certainty
  add(cue("n4", "stable", -4), "riser", 0.3); add(cue("n4", "promise", 4), "thud", 0.7); add(cue("n4", "back", -4), "thud", 0.55); add(cue("n4", "wins", -4), "chime", 0.8);
  // connection
  add(cue("n5", "isolated", -4), "pop", 0.35); add(cue("n5", "community", -4), "whoosh_s", 0.4);
  for (let i = 0; i < 6; i++) add(cue("n5", "community", 6 + i * 4), "ding", 0.25);
  add(cue("n5", "relationship", -4), "chime", 0.5); add(cue("n5", "starving", -4), "thud", 0.5);
  // question + payoff
  add(SEG_START.c6 - 3, "whoosh", 0.5); add(cue("c6", "product", -4), "thud", 0.55);
  for (let i = 0; i < 5; i++) add(cue("c6", "which", 6 + i * 14), "ding", 0.35);
  add(cue("c6", "deliver", -2), "thud", 0.6);
  add(SEG_START.p7 - 3, "whoosh", 0.5); add(cue("p7", "feature", 6), "swish", 0.4); add(cue("p7", "reason", -4), "pop", 0.45);
  add(cue("p7", "sell", -4), "thud", 0.7); add(cue("p7", "that", -2), "thud", 0.8); add(cue("p7", "that", 4), "chime", 0.8);
  return a.filter(([, n]) => n !== "thud"); // no thud sounds (user: extra sounds feel unfocused)
})();

export const FiveNeedsReelVideo: React.FC = () => {
  const f = useCurrentFrame();
  const musicVol = (lf: number, len: number) => (MUSIC ? 0.1 * Math.min(1, lf / 20) * Math.min(1, (len - lf) / 24) : 0);
  const heroes = [TimeHero, ClarityHero, StatusHero, CertaintyHero, ConnectionHero];
  return (
    <AbsoluteFill style={{ background: "#040716" }}>
      <Sequence from={0} durationInFrames={DURATIONS.h0 + 6}><Hook f={f} /></Sequence>
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
      <Sequence from={BODY_START - 2} durationInFrames={SCENES_END - BODY_START + 4}>
        <AbsoluteFill>
          <Backdrop f={f} />
          {NEEDS.map((n, i) => {
            const H = heroes[i];
            const a = SEG_START[n.seg], b = NEXT[n.seg];
            if (f < a - 3 || f > b + 14) return null;
            return <NeedFrame key={n.seg} f={f} idx={i}><H f={f} /></NeedFrame>;
          })}
          {f >= SEG_START.c6 - 3 && f <= SEG_START.p7 + 14 && <Question f={f} />}
          {f >= SEG_START.p7 - 3 && <Payoff f={f} />}
        </AbsoluteFill>
      </Sequence>
      <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>

      {(f < INTRO_START + 4 || (f >= BODY_START - 4 && f < SCENES_END + 2)) && <Finish f={f} />}
      <Flash f={f} at={INTRO_START} />
      <Flash f={f} at={BODY_START} color="#0B1A55" streak={false} d={6} />
      {NEEDS.slice(1).map((n) => <Flash key={n.seg} f={f} at={SEG_START[n.seg]} d={5} streak={false} color="#CFE0FF" />)}
      <Flash f={f} at={SEG_START.c6} d={6} />
      <Flash f={f} at={SEG_START.p7} />
      <Flash f={f} at={SCENES_END} d={8} />

      {SEGS.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={k} from={SEG_START[k] + 2} durationInFrames={DURATIONS[k]}><Audio src={staticFile(`fiveneeds/${k}.mp3`)} /></Sequence>
      ))}
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={t} durationInFrames={80}><Audio src={staticFile(`story/sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {MUSIC && (
        <>
          <Sequence from={0} durationInFrames={INTRO_START + 10}><Audio src={staticFile("story/music.wav")} volume={(lf) => musicVol(lf, INTRO_START + 10)} loop /></Sequence>
          <Sequence from={BODY_START - 6} durationInFrames={SCENES_END - BODY_START + 12}><Audio src={staticFile("story/music.wav")} startFrom={300} volume={(lf) => musicVol(lf, SCENES_END - BODY_START + 12)} loop /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
