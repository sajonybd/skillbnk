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

// ─── Timing ───────────────────────────────────────────────────────────────────
// DURATIONS is auto-patched by generate-voice-hvac.py (keep it a plain object,
// no type annotation, so the regex can find it).
const DURATIONS = {
  h0: 156,
  h1: 189,
  h2: 258,
  h3: 144,
  t1: 354,
  h4: 196,
  h5: 194,
  h6: 261,
  c1: 178,
  c2: 235,
  c3: 203,
  c4: 197,
  h7: 87,
  h8: 210,
};

// Clips that have real audio files (auto-patched by generate-voice-hvac.py).
// A scene whose clip isn't generated yet still plays, just silently — so a new
// scene never breaks the Studio preview.
const VOICED: string[] = ["h0", "h1", "h2", "h3", "t1", "h4", "h5", "h6", "c1", "c2", "c3", "c4", "h7", "h8"];

const INTRO = INTRO_FRAMES; // MAIN INTRO length, from SkillbnkIntroVideo.tsx
const ORDER = ["h0", "h1", "h2", "h3", "t1", "h4", "h5", "h6", "c1", "c2", "c3", "c4", "h7", "h8"] as const;
type Key = (typeof ORDER)[number];

const STARTS: Record<Key, number> = (() => {
  const s = {} as Record<Key, number>;
  let pos = INTRO;
  for (const k of ORDER) {
    s[k] = pos;
    pos += DURATIONS[k];
  }
  return s;
})();

const TAIL = 30;
const OUTRO_START = INTRO + ORDER.reduce((a, k) => a + DURATIONS[k], 0) + TAIL;
export const TOTAL_FRAMES = INTRO + ORDER.reduce((a, k) => a + DURATIONS[k], 0) + TAIL + OUTRO_FRAMES; // + shared MAIN OUTRO

// ─── Brand ────────────────────────────────────────────────────────────────────
const BLUE = "#1B5EF7";
const BLUE_2 = "#7FA0FF";
const ORANGE = "#F97316";
const ORANGE_2 = "#FDBA74";
const INK = "#F1F5F9";
const MUTED = "#8A96B2";
const GREEN = "#22C55E";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
const COMPANY = "Northwind Heating & Air"; // fictional demo company

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (f: number, from: number, dur = 12) => interpolate(f, [from, from + dur], [0, 1], clamp);
const pop = (f: number, start: number, fps: number, cfg: object = {}) =>
  spring({ frame: f - start, fps, config: { damping: 16, stiffness: 160, mass: 0.7, ...cfg } });
const outro = (f: number, dur: number, n = 10) => interpolate(f, [dur - n, dur], [1, 0], clamp);
const rise = (p: number, px = 30) => `translateY(${interpolate(p, [0, 1], [px, 0])}px)`;

type SceneProps = { f: number; dur: number; fps: number };

const DarkBg: React.FC<{ children: React.ReactNode; glow?: string }> = ({ children, glow = "#2E5CF62A" }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #0B1230 0%, #04060D 100%)", fontFamily: FONT }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(#ffffff07 1px,transparent 1px),linear-gradient(90deg,#ffffff07 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${glow} 0%, transparent 60%)` }} />
    {children}
  </AbsoluteFill>
);

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", ...style }}>
    {children}
  </AbsoluteFill>
);

const Pill: React.FC<{ text: string; color?: string; opacity?: number }> = ({ text, color = "#9FB4FF", opacity = 1 }) => (
  <div
    style={{
      opacity, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
      background: `${color}1A`, border: `1px solid ${color}66`, borderRadius: 999,
      fontSize: 13, fontWeight: 700, color, letterSpacing: 1.5, textTransform: "uppercase",
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
    {text}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; border?: string }> = ({ children, style, border = "#2E3B5E" }) => (
  <div
    style={{
      background: "linear-gradient(180deg, #101A32 0%, #0B1224 100%)", border: `1px solid ${border}`,
      borderRadius: 18, boxShadow: "0 14px 40px #00000066", boxSizing: "border-box", ...style,
    }}
  >
    {children}
  </div>
);

const Bar: React.FC<{ pct: number; color: string; h?: number }> = ({ pct, color, h = 8 }) => (
  <div style={{ height: h, background: "#1E293B", borderRadius: h, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: h }} />
  </div>
);

// ─── h0: hook — your best tech lost his Saturday ─────────────────────────────
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const card = pop(f, 2, fps);
  const head = pop(f, 20, fps);
  const again = pop(f, dur * 0.62, fps, { damping: 9 });
  return (
    <DarkBg glow="#F973162A">
      <Center style={{ opacity: outro(f, dur) }}>
        <Card style={{ width: 560, padding: "20px 24px", opacity: card, transform: rise(card) }} border="#F9731655">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#FB923C,#EA580C)", color: "#fff", fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>MR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Mike Reyes</div>
              <div style={{ fontSize: 14, color: MUTED }}>Senior HVAC Tech · 14 years</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: ORANGE_2, background: "#F9731622", padding: "6px 10px", borderRadius: 8 }}>SATURDAY</div>
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "#0F1729", border: "1px dashed #F9731666", fontSize: 15, color: INK, display: "flex", gap: 10 }}>
            <span>📅</span> 8:00 AM – 4:00 PM · <b style={{ color: ORANGE_2 }}>Training the new hire</b>
          </div>
        </Card>
        <div style={{ marginTop: 38, fontSize: 50, fontWeight: 800, color: INK, letterSpacing: -0.5, textAlign: "center", opacity: head, transform: rise(head) }}>
          Your best tech just lost <span style={{ color: ORANGE }}>another Saturday.</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 34, fontWeight: 800, color: ORANGE_2, opacity: again, transform: `scale(${interpolate(again, [0, 1], [1.6, 1])})` }}>
          Again.
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── h1: the old way ──────────────────────────────────────────────────────────
const OLD = [
  { icon: "🚐", name: "Ride-alongs", sub: "Hours of senior-tech time per hire" },
  { icon: "📒", name: "Paper binders", sub: "Out of date the day they're printed" },
  { icon: "📼", name: "Safety videos", sub: "No idea who actually watched" },
];

const SceneOldWay: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const at = [dur * 0.28, dur * 0.45, dur * 0.62];
  return (
    <DarkBg glow="#F973161F">
      <Center style={{ opacity: outro(f, dur) }}>
        <Pill text="How most HVAC shops train" color={ORANGE_2} opacity={fade(f, 0, 10)} />
        <div style={{ marginTop: 18, fontSize: 46, fontWeight: 800, color: INK, opacity: fade(f, 4, 12) }}>
          Still the <span style={{ color: ORANGE }}>old way.</span>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 48 }}>
          {OLD.map((o, i) => {
            const p = pop(f, at[i], fps);
            const x = pop(f, at[i] + 10, fps, { damping: 10 });
            return (
              <Card key={o.name} style={{ width: 330, height: 210, padding: 24, position: "relative", opacity: p, transform: rise(p) }}>
                <div style={{ fontSize: 44 }}>{o.icon}</div>
                <div style={{ marginTop: 14, fontSize: 26, fontWeight: 800, color: INK }}>{o.name}</div>
                <div style={{ marginTop: 6, fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{o.sub}</div>
                <div
                  style={{
                    position: "absolute", top: 18, right: 18, width: 40, height: 40, borderRadius: "50%",
                    background: "#F9731626", border: `2px solid ${ORANGE}`, color: ORANGE, fontSize: 22, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: x, transform: `scale(${interpolate(x, [0, 1], [2, 1])}) rotate(${interpolate(x, [0, 1], [-30, 0])}deg)`,
                  }}
                >
                  ✕
                </div>
              </Card>
            );
          })}
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── h2: the real cost ────────────────────────────────────────────────────────
const SceneCost: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const left = pop(f, 4, fps);
  const drain = interpolate(f, [16, dur * 0.45], [100, 38], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rightAt = dur * 0.46;
  const right = pop(f, rightAt, fps);
  const shake = f > rightAt + 30 && f < rightAt + 70 ? Math.sin(f * 1.4) * 5 : 0;
  const papers = [0, 1, 2, 3, 4];
  return (
    <DarkBg glow="#F973161F">
      <AbsoluteFill style={{ opacity: outro(f, dur), flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <Card style={{ width: 500, height: 400, padding: 30, opacity: left, transform: rise(left) }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: ORANGE_2, letterSpacing: 1.5, textTransform: "uppercase" }}>Every new hire</div>
          <div style={{ marginTop: 10, fontSize: 32, fontWeight: 800, color: INK, lineHeight: 1.2 }}>pulls a senior tech<br />off the truck.</div>
          <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 56, transform: `translateX(${interpolate(f, [16, dur * 0.45], [0, -14], clamp)}px)` }}>🚐</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: MUTED, marginBottom: 8 }}>
                <span>Billable calls this week</span>
                <span style={{ color: drain < 60 ? ORANGE_2 : INK, fontWeight: 800 }}>{drain < 60 ? "Dropping" : "Full"}</span>
              </div>
              <Bar pct={drain} color={drain < 60 ? ORANGE : GREEN} h={14} />
            </div>
          </div>
          <div style={{ marginTop: 28, fontSize: 16, color: MUTED }}>Your most valuable tech, teaching instead of earning.</div>
        </Card>
        <Card style={{ width: 500, height: 400, padding: 30, opacity: right, transform: rise(right), position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: ORANGE_2, letterSpacing: 1.5, textTransform: "uppercase" }}>“Show me the training records.”</div>
          <div style={{ marginTop: 10, fontSize: 32, fontWeight: 800, color: INK, lineHeight: 1.2 }}>Somewhere in<br />the filing cabinet…</div>
          <div style={{ position: "absolute", left: 40, bottom: 30, fontSize: 110, transform: `translateX(${shake}px)` }}>🗄️</div>
          {papers.map((i) => {
            const p = pop(f, rightAt + 26 + i * 6, fps, { damping: 12 });
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: 210 + i * 42, bottom: 50 + (i % 2) * 40, width: 70, height: 90, borderRadius: 6,
                  background: "#E5E7EB", opacity: p, transform: `rotate(${(i - 2) * 11}deg) translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
                  boxShadow: "0 6px 16px #0008", padding: 8, boxSizing: "border-box",
                }}
              >
                {[80, 60, 70, 50].map((w, j) => (
                  <div key={j} style={{ height: 5, width: `${w}%`, background: "#9CA3AF", borderRadius: 3, marginTop: 7 }} />
                ))}
              </div>
            );
          })}
        </Card>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── h3: the turn ─────────────────────────────────────────────────────────────
const SceneTurn: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const p = pop(f, 2, fps, { damping: 13 });
  return (
    <DarkBg>
      <Center style={{ opacity: outro(f, dur, 8) }}>
        <div style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, filter: `drop-shadow(0 0 ${22 * p}px #7FA0FF40)` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 420, display: "block" }} />
        </div>
        <div style={{ marginTop: 34, fontSize: 40, fontWeight: 800, color: INK, textAlign: "center", lineHeight: 1.3, opacity: fade(f, 16, 12) }}>
          turns your team's know-how into<br />
          <span style={{ backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_2} 100%)`, WebkitBackgroundClip: "text", color: "transparent" }}>
            training that runs itself.
          </span>
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── h4: AI course creator ────────────────────────────────────────────────────
const PROMPT = "Heat pump installation basics for new techs";
const OUTLINE = [
  { icon: "⚡", t: "Safety first: electrical & refrigerant" },
  { icon: "📐", t: "Sizing & placement" },
  { icon: "🔧", t: "Line set, brazing & leak check" },
  { icon: "🌡️", t: "Startup & commissioning" },
  { icon: "✅", t: "Quiz · 10 questions" },
  { icon: "📋", t: "On-the-job checklist" },
];

const SceneAI: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const panel = pop(f, 2, fps);
  const typed = Math.floor(interpolate(f, [12, 12 + PROMPT.length * 1.1], [0, PROMPT.length], clamp));
  const genStart = 12 + PROMPT.length * 1.1 + 6;
  const gen = interpolate(f, [genStart, genStart + 24], [0, 100], clamp);
  const step = (dur - genStart - 40) / OUTLINE.length;
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <Card style={{ width: 470, padding: 28, opacity: panel, transform: rise(panel) }} border="#2E5CF666">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>✨</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>AI Course Creator</span>
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: MUTED, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>What should your techs learn?</div>
          <div style={{ marginTop: 10, minHeight: 84, padding: "14px 16px", borderRadius: 12, background: "#0F1729", border: "1px solid #2A3654", fontSize: 20, color: INK, lineHeight: 1.35 }}>
            {PROMPT.slice(0, typed)}
            <span style={{ opacity: Math.floor(f / 8) % 2 === 0 && typed < PROMPT.length ? 1 : 0, color: BLUE_2 }}>|</span>
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                padding: "10px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${BLUE} 0%, #3E7BFA 100%)`, color: "#fff",
                fontWeight: 800, fontSize: 16, transform: `scale(${f > genStart - 4 && f < genStart + 2 ? 0.94 : 1})`,
              }}
            >
              Generate course
            </div>
            <div style={{ flex: 1, opacity: fade(f, genStart, 6) }}>
              <Bar pct={gen} color={BLUE_2} />
              <div style={{ marginTop: 6, fontSize: 12, color: MUTED }}>{gen < 100 ? "Building lessons…" : "Done in minutes"}</div>
            </div>
          </div>
        </Card>
        <Card style={{ width: 500, padding: 26, opacity: fade(f, genStart + 10, 10) }}>
          <div style={{ fontSize: 13, color: MUTED, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>New course</div>
          <div style={{ marginTop: 6, fontSize: 24, fontWeight: 800, color: INK }}>Heat Pump Install Basics</div>
          <div style={{ marginTop: 14 }}>
            {OUTLINE.map((o, i) => {
              const p = pop(f, genStart + 16 + i * step, fps);
              return (
                <div
                  key={o.t}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, marginTop: 9, padding: "10px 14px", borderRadius: 10,
                    background: i >= 4 ? "#2E5CF61A" : "#0F1729", border: `1px solid ${i >= 4 ? "#2E5CF655" : "#1E293B"}`,
                    opacity: p, transform: `translateX(${interpolate(p, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{o.icon}</span>
                  <span style={{ fontSize: 17, fontWeight: 600, color: INK }}>{o.t}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── h5: learn on the phone, track the team ──────────────────────────────────
const TEAM = [
  { n: "Jake Thompson", pct: 100, s: "Passed", c: GREEN },
  { n: "Maria Lopez", pct: 82, s: "In progress", c: BLUE_2 },
  { n: "Chris Patel", pct: 100, s: "Passed", c: GREEN },
  { n: "Devon King", pct: 28, s: "Needs help", c: ORANGE },
];

const SceneTrack: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const phone = pop(f, 2, fps);
  const dashAt = dur * 0.36;
  const dash = pop(f, dashAt, fps);
  const lessonPct = interpolate(f, [10, dur * 0.35], [20, 75], clamp);
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 50 }}>
        {/* Phone */}
        <div
          style={{
            width: 260, height: 520, borderRadius: 38, background: "#0B0F1C", border: "3px solid #334155", padding: 12, boxSizing: "border-box",
            boxShadow: "0 30px 80px #000A", opacity: phone, transform: rise(phone, 50),
          }}
        >
          <div style={{ height: "100%", borderRadius: 28, background: "#F8FAFC", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ width: 70, height: 16, borderRadius: 10, background: "#0B0F1C" }} />
            </div>
            <div style={{ padding: "6px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280" }}>Heat Pump Install Basics</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginTop: 2 }}>Lesson 3 · Line set & brazing</div>
            </div>
            <div style={{ margin: "8px 14px", height: 120, borderRadius: 12, background: "linear-gradient(135deg,#1E3A8A,#1B5EF7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ffffffdd", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, fontSize: 18 }}>▶</div>
            </div>
            <div style={{ margin: "4px 14px" }}>
              <div style={{ height: 6, background: "#E5E7EB", borderRadius: 4 }}>
                <div style={{ height: 6, width: `${lessonPct}%`, background: BLUE, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 5 }}>{Math.round(lessonPct)}% complete</div>
            </div>
            <div style={{ margin: "10px 14px 0", fontSize: 11, fontWeight: 800, color: "#111827" }}>Up next</div>
            {["Leak check with nitrogen", "Quick quiz"].map((t) => (
              <div key={t} style={{ margin: "6px 14px 0", padding: "8px 10px", borderRadius: 8, background: "#EEF2FF", fontSize: 11, color: "#1E3A8A", fontWeight: 600 }}>{t}</div>
            ))}
            <div style={{ marginTop: "auto", margin: "auto 14px 14px", padding: "6px 10px", borderRadius: 8, background: "#FEF3C7", fontSize: 10, color: "#92400E", fontWeight: 700 }}>
              🚐 Between calls · 6 min left
            </div>
          </div>
        </div>
        {/* Manager dashboard */}
        <Card style={{ width: 560, padding: 26, opacity: dash, transform: rise(dash) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Team progress</div>
            <div style={{ fontSize: 13, color: MUTED }}>{COMPANY}</div>
          </div>
          {TEAM.map((m, i) => {
            const p = pop(f, dashAt + 8 + i * 8, fps);
            const pct = interpolate(f, [dashAt + 10 + i * 8, dashAt + 40 + i * 8], [0, m.pct], clamp);
            const hi = m.s === "Needs help" && f > dur * 0.7;
            return (
              <div
                key={m.n}
                style={{
                  marginTop: 14, padding: "12px 14px", borderRadius: 12, opacity: p,
                  background: hi ? "#F9731614" : "#0F1729", border: `1px solid ${hi ? "#F9731688" : "#1E293B"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: INK }}>{m.n}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: m.c, background: `${m.c}22`, padding: "3px 10px", borderRadius: 999 }}>{m.s}</span>
                </div>
                <Bar pct={pct} color={m.c} />
              </div>
            );
          })}
        </Card>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── h6: automation — certificates, reminders, records ───────────────────────
const SceneAutomate: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const a = pop(f, 4, fps);
  const b = pop(f, dur * 0.3, fps);
  const c = pop(f, dur * 0.62, fps);
  const records = ["Refrigerant Handling Safety", "Ladder & Electrical Safety", "Heat Pump Install Basics", "Customer Service on Calls"];
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: INK, opacity: fade(f, 0, 10) }}>
          The admin work? <span style={{ color: BLUE_2 }}>Handled.</span>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 44, alignItems: "stretch" }}>
          {/* Certificate */}
          <div style={{ width: 330, opacity: a, transform: rise(a) }}>
            <div style={{ height: 270, borderRadius: 16, background: "#FFFDF7", border: "6px double #C9A227", padding: 20, boxSizing: "border-box", textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#8B6F16", fontWeight: 800 }}>CERTIFICATE OF COMPLETION</div>
              <div style={{ marginTop: 18, fontSize: 12, color: "#6B7280" }}>This certifies that</div>
              <div style={{ marginTop: 6, fontSize: 24, fontWeight: 800, color: "#111827", fontFamily: "Georgia, serif" }}>Jake Thompson</div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#6B7280" }}>has completed</div>
              <div style={{ marginTop: 4, fontSize: 15, fontWeight: 800, color: "#1E3A8A" }}>Refrigerant Handling Safety</div>
              <div style={{ position: "absolute", right: 18, bottom: 16, width: 46, height: 46, borderRadius: "50%", background: "#C9A227", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>★</div>
            </div>
            <div style={{ marginTop: 14, fontSize: 18, fontWeight: 800, color: INK }}>🏅 Certificates, automatic</div>
          </div>
          {/* SMS reminder */}
          <div style={{ width: 330, opacity: b, transform: rise(b) }}>
            <Card style={{ height: 270, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 12, color: MUTED, textAlign: "center" }}>Text message · now</div>
              <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: "18px 18px 18px 4px", background: "#1F2937", color: INK, fontSize: 16, lineHeight: 1.4 }}>
                Hi Devon 👋 “Ladder & Electrical Safety” is due Friday. Tap to finish it between calls →
              </div>
              <div style={{ marginTop: 12, alignSelf: "flex-end", padding: "10px 14px", borderRadius: "18px 18px 4px 18px", background: BLUE, color: "#fff", fontSize: 15, opacity: fade(f, dur * 0.3 + 30, 10) }}>
                On it 👍
              </div>
            </Card>
            <div style={{ marginTop: 14, fontSize: 18, fontWeight: 800, color: INK }}>📲 Reminders that chase for you</div>
          </div>
          {/* Records */}
          <div style={{ width: 330, opacity: c, transform: rise(c) }}>
            <Card style={{ height: 270, padding: 20 }} border="#22C55E55">
              <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Training records</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{COMPANY} · all techs</div>
              {records.map((r, i) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, opacity: fade(f, dur * 0.62 + 8 + i * 5, 8) }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: GREEN, color: "#fff", fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: INK }}>{r}</span>
                </div>
              ))}
            </Card>
            <div style={{ marginTop: 14, fontSize: 18, fontWeight: 800, color: INK }}>📁 Every record, ready</div>
          </div>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── h7: every branch, every truck ───────────────────────────────────────────
const BRANCHES = [
  { city: "Dallas", trucks: 8 },
  { city: "Fort Worth", trucks: 5 },
  { city: "Austin", trucks: 6 },
];

const SceneBranches: React.FC<SceneProps> = ({ f, dur, fps }) => (
  <DarkBg>
    <AbsoluteFill style={{ opacity: outro(f, dur, 8), alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 24 }}>
        {BRANCHES.map((b, i) => {
          const p = pop(f, 2 + i * 8, fps);
          const pct = interpolate(f, [20, 70], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <Card key={b.city} style={{ width: 330, padding: 24, opacity: p, transform: rise(p) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: MUTED }}>{COMPANY}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: INK }}>{b.city}</div>
                </div>
                <span style={{ width: 34, height: 34, borderRadius: "50%", background: GREEN, color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pct >= 99 ? 1 : 0})` }}>✓</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 22, letterSpacing: 2 }}>{"🚐".repeat(b.trucks)}</div>
              <div style={{ marginTop: 14 }}>
                <Bar pct={pct} color={GREEN} h={10} />
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: MUTED }}>Same training. Same standard.</div>
            </Card>
          );
        })}
      </div>
      <div style={{ marginTop: 40, fontSize: 40, fontWeight: 800, color: INK, opacity: fade(f, 30, 12) }}>
        Every branch. Every truck. <span style={{ color: GREEN }}>One standard.</span>
      </div>
    </AbsoluteFill>
  </DarkBg>
);

// ─── h8: CTA ──────────────────────────────────────────────────────────────────
const SceneCTA: React.FC<SceneProps> = ({ f, fps }) => {
  const p = pop(f, 2, fps);
  const btn = pop(f, 30, fps, { damping: 11 });
  const pulse = 1 + Math.sin(f / 6) * 0.02 * fade(f, 50, 10);
  return (
    <DarkBg>
      <Center>
        <div style={{ opacity: p, transform: rise(p, -20), filter: `drop-shadow(0 0 ${18 * p}px #7FA0FF40)` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 420, display: "block" }} />
        </div>
        <div style={{ marginTop: 34, fontSize: 42, fontWeight: 800, color: INK, opacity: fade(f, 10, 10) }}>
          Train techs faster.
        </div>
        <div style={{ marginTop: 6, fontSize: 30, fontWeight: 700, color: MUTED, opacity: fade(f, 20, 10) }}>
          Get them back on the job.
        </div>
        <div
          style={{
            marginTop: 30, padding: "16px 40px", borderRadius: 999, background: `linear-gradient(135deg, ${BLUE} 0%, #3E7BFA 100%)`,
            color: "#fff", fontSize: 26, fontWeight: 800, boxShadow: `0 14px 40px ${BLUE}55`,
            opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.7, 1]) * pulse})`,
          }}
        >
          Start your free trial · skillbnk.com
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── c1: real-time chat / direct messages ─────────────────────────────────────
const CHAT = [
  { me: true, who: "Sarah · Dispatch", t: "Mike, can you check Devon's brazing on the Elm St job?" },
  { me: false, who: "Mike Reyes", t: "On it. Heading there after lunch 👍" },
  { me: true, who: "Sarah · Dispatch", t: "Perfect. Photo when you're done?" },
  { me: false, who: "Mike Reyes", t: "📷 Leak check passed ✅" },
];

const SceneChat: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const win = pop(f, 2, fps);
  const step = (dur - 50) / CHAT.length;
  const people = [
    { n: "Mike Reyes", on: true }, { n: "Devon King", on: true }, { n: "Maria Lopez", on: false }, { n: "Jake Thompson", on: true },
  ];
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", justifyContent: "center" }}>
        <Pill text="Real-time chat" opacity={fade(f, 0, 10)} />
        <Card style={{ marginTop: 22, width: 900, height: 460, display: "flex", overflow: "hidden", opacity: win, transform: rise(win) }}>
          <div style={{ width: 250, borderRight: "1px solid #1E293B", padding: 20 }}>
            <div style={{ fontSize: 13, color: MUTED, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Team · {COMPANY.split(" ")[0]}</div>
            {people.map((p, i) => (
              <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "8px 10px", borderRadius: 10, background: i === 0 ? "#2E5CF61F" : "transparent" }}>
                <div style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: "#1E293B", color: INK, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.n.split(" ").map((x) => x[0]).join("")}
                  <span style={{ position: "absolute", right: -1, bottom: -1, width: 11, height: 11, borderRadius: "50%", background: p.on ? GREEN : "#475569", border: "2px solid #0B1224" }} />
                </div>
                <span style={{ fontSize: 16, color: INK, fontWeight: 600 }}>{p.n}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "1px solid #1E293B" }}>
              <span style={{ fontSize: 19, fontWeight: 800, color: INK }}>Mike Reyes</span>
              <span style={{ fontSize: 13, color: GREEN, fontWeight: 700 }}>● Online · on a job in Dallas</span>
            </div>
            {CHAT.map((m, i) => {
              const at = 14 + i * step;
              const p = pop(f, at, fps);
              const typing = !m.me && f > at - 18 && f < at;
              return (
                <React.Fragment key={i}>
                  {typing && (
                    <div style={{ alignSelf: "flex-start", marginTop: 14, padding: "10px 16px", borderRadius: 16, background: "#1F2937", color: MUTED, fontSize: 18, letterSpacing: 3 }}>
                      {".".repeat(1 + (Math.floor(f / 5) % 3))}
                    </div>
                  )}
                  <div
                    style={{
                      alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 440, marginTop: 14, padding: "12px 16px",
                      borderRadius: m.me ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: m.me ? BLUE : "#1F2937", color: "#fff", fontSize: 17, lineHeight: 1.4,
                      opacity: f >= at ? p : 0, transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
                    }}
                  >
                    {m.t}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── c2: shared calendar ──────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const EVENTS = [
  { d: 0, top: 30, h: 90, t: "Heat pump training", s: "8:00 AM · Dallas", c: BLUE },
  { d: 2, top: 110, h: 110, t: "Ride-along", s: "Devon + Mike", c: ORANGE },
  { d: 3, top: 40, h: 80, t: "Team huddle", s: "7:30 AM · Video", c: "#A855F7" },
  { d: 4, top: 150, h: 90, t: "Refrigerant safety due", s: "All new techs", c: GREEN },
];

const SceneCalendar: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const cal = pop(f, 2, fps);
  const step = (dur * 0.55) / EVENTS.length;
  const toastAt = dur * 0.68;
  const toast = pop(f, toastAt, fps);
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", justifyContent: "center" }}>
        <Pill text="One shared calendar" opacity={fade(f, 0, 10)} />
        <div style={{ position: "relative", marginTop: 22 }}>
          <Card style={{ width: 900, padding: 22, opacity: cal, transform: rise(cal) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>Training & ops · This week</span>
              <span style={{ fontSize: 14, color: MUTED }}>{COMPANY}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {DAYS.map((d, di) => (
                <div key={d}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: MUTED, textAlign: "center", paddingBottom: 8 }}>{d}</div>
                  <div style={{ position: "relative", height: 280, borderRadius: 12, background: "#0F1729", border: "1px solid #1E293B" }}>
                    {EVENTS.filter((e) => e.d === di).map((e) => {
                      const p = pop(f, 16 + EVENTS.indexOf(e) * step, fps);
                      return (
                        <div
                          key={e.t}
                          style={{
                            position: "absolute", left: 6, right: 6, top: e.top, height: e.h, borderRadius: 10, padding: "8px 10px",
                            background: `${e.c}2E`, borderLeft: `4px solid ${e.c}`, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 800, color: INK, lineHeight: 1.2 }}>{e.t}</div>
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{e.s}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div
            style={{
              position: "absolute", right: -30, top: -26, padding: "12px 18px", borderRadius: 14, background: "#0F1729",
              border: `1px solid ${GREEN}88`, boxShadow: "0 16px 40px #000A", fontSize: 16, fontWeight: 700, color: INK,
              opacity: toast, transform: `translateY(${interpolate(toast, [0, 1], [-20, 0])}px)`,
            }}
          >
            🔔 12 techs notified automatically
          </div>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── c3: referrals ────────────────────────────────────────────────────────────
const REFS = [
  { n: "Mike Reyes", c: 3, st: "Reward earned" },
  { n: "Jake Thompson", c: 2, st: "Reward earned" },
  { n: "Maria Lopez", c: 1, st: "In review" },
];
const FUNNEL = [
  { l: "Referred", v: 14 },
  { l: "Interviewed", v: 9 },
  { l: "Hired", v: 5 },
];

const SceneReferral: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const a = pop(f, 2, fps);
  const b = pop(f, dur * 0.3, fps);
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", justifyContent: "center" }}>
        <Pill text="Built-in referrals" opacity={fade(f, 0, 10)} />
        <div style={{ display: "flex", gap: 26, marginTop: 24 }}>
          <Card style={{ width: 430, padding: 26, opacity: a, transform: rise(a) }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Refer a tech 🤝</div>
            <div style={{ marginTop: 6, fontSize: 15, color: MUTED }}>Share your link. Get rewarded when they're hired.</div>
            <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: 10, background: "#0F1729", border: "1px dashed #2E5CF688", fontSize: 15, color: BLUE_2, fontWeight: 700 }}>
              northwind.skillbnk.com/r/mike
            </div>
            <div style={{ marginTop: 24 }}>
              {FUNNEL.map((s, i) => {
                const w = interpolate(f, [14 + i * 10, 44 + i * 10], [0, (s.v / 14) * 100], clamp);
                return (
                  <div key={s.l} style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: INK, marginBottom: 6 }}>
                      <span>{s.l}</span>
                      <b>{Math.round((w / 100) * 14)}</b>
                    </div>
                    <Bar pct={w} color={i === 2 ? GREEN : BLUE_2} h={10} />
                  </div>
                );
              })}
            </div>
          </Card>
          <Card style={{ width: 430, padding: 26, opacity: b, transform: rise(b) }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Top referrers 🏆</div>
            {REFS.map((r, i) => {
              const p = pop(f, dur * 0.3 + 10 + i * 8, fps);
              return (
                <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "#0F1729", border: "1px solid #1E293B", opacity: p, transform: rise(p, 16) }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: ["#C9A227", "#94A3B8", "#B45309"][i], color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>{r.n}</div>
                    <div style={{ fontSize: 13, color: MUTED }}>{r.c} referral{r.c > 1 ? "s" : ""}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: r.st === "In review" ? BLUE_2 : GREEN, background: r.st === "In review" ? "#7FA0FF22" : "#22C55E22", padding: "4px 10px", borderRadius: 999 }}>{r.st}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 18, fontSize: 14, color: MUTED, opacity: fade(f, dur * 0.55, 10) }}>✓ Every referral & reward tracked automatically</div>
          </Card>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── c4: one tool instead of many ─────────────────────────────────────────────
const OLD_APPS = [
  { i: "💬", n: "Chat app" },
  { i: "📅", n: "Calendar" },
  { i: "📊", n: "Spreadsheets" },
  { i: "📱", n: "Group texts" },
  { i: "🎓", n: "Training LMS" },
  { i: "🤝", n: "Referral tracker" },
];
const ALL_IN = ["Training", "Chat", "Calendar", "Referrals", "Certificates", "Records"];

const SceneAllInOne: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const collapse = interpolate(f, [dur * 0.18, dur * 0.4], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const logo = pop(f, dur * 0.38, fps, { damping: 12 });
  const chipsAt = dur * 0.48;
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur) }}>
        {OLD_APPS.map((a, i) => {
          const ang = (i / OLD_APPS.length) * Math.PI * 2 - Math.PI / 2;
          const r = 250 * (1 - collapse);
          const p = pop(f, 2 + i * 4, fps);
          return (
            <div
              key={a.n}
              style={{
                position: "absolute", left: 640 + Math.cos(ang) * r * 1.5 - 70, top: 300 + Math.sin(ang) * r - 40,
                width: 140, padding: "12px 0", borderRadius: 16, background: "#141B2E", border: "1px solid #2A3654", textAlign: "center",
                opacity: p * (1 - collapse), transform: `scale(${1 - collapse * 0.6})`,
              }}
            >
              <div style={{ fontSize: 30 }}>{a.i}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 4, fontWeight: 700 }}>{a.n}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${interpolate(logo, [0, 1], [0.5, 1])})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 370, display: "flex", justifyContent: "center", gap: 12 }}>
          {ALL_IN.map((c, i) => {
            const p = pop(f, chipsAt + i * 5, fps);
            return (
              <div key={c} style={{ padding: "10px 18px", borderRadius: 999, background: "#2E5CF61F", border: "1px solid #2E5CF666", fontSize: 18, fontWeight: 700, color: INK, opacity: p, transform: rise(p, 16) }}>
                <span style={{ color: GREEN }}>✓</span> {c}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontSize: 44, fontWeight: 800, color: INK, opacity: fade(f, chipsAt + 36, 12) }}>
          One tool. <span style={{ color: BLUE_2 }}>Your whole HVAC operation.</span>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── t1: the 3 kinds of training every small company needs ───────────────────
const THREE = [
  {
    n: 1, icon: "🧑‍🔧", title: "Onboarding", sub: "New hires, job-ready fast", c: BLUE_2,
    items: ["Company & safety basics", "Tools & truck setup", "First ride-along checklist"],
  },
  {
    n: 2, icon: "🔁", title: "Ongoing training", sub: "Best practices & customer care", c: GREEN,
    items: ["Customer care on every call", "Best-practice refreshers", "Monthly safety updates"],
  },
  {
    n: 3, icon: "🚀", title: "New tools & services", sub: "Roll out change fast", c: ORANGE_2,
    items: ["New dispatch app", "New heat pump line", "New service area"],
  },
];

const SceneThreeTypes: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const at = [dur * 0.2, dur * 0.42, dur * 0.66];
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: INK, textAlign: "center", opacity: fade(f, 0, 12) }}>
          Every small company needs <span style={{ color: BLUE_2 }}>3 kinds of training</span>
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
          {THREE.map((t, i) => {
            const p = pop(f, at[i], fps);
            const active = f >= at[i] && (i === 2 || f < at[i + 1]);
            return (
              <Card
                key={t.title}
                border={active ? `${t.c}AA` : "#2E3B5E"}
                style={{ width: 340, padding: 24, opacity: p, transform: `${rise(p)} scale(${active ? 1.03 : 1})` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${t.c}26`, border: `2px solid ${t.c}`, color: t.c, fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {t.n}
                  </div>
                  <span style={{ fontSize: 30 }}>{t.icon}</span>
                </div>
                <div style={{ marginTop: 14, fontSize: 25, fontWeight: 800, color: INK }}>{t.title}</div>
                <div style={{ marginTop: 4, fontSize: 15, color: MUTED }}>{t.sub}</div>
                <div style={{ marginTop: 16 }}>
                  {t.items.map((it, j) => (
                    <div key={it} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, opacity: fade(f, at[i] + 10 + j * 6, 8) }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: t.c, color: "#0B1224", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 15, color: INK }}>{it}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
        <div style={{ marginTop: 34, fontSize: 24, fontWeight: 700, color: MUTED, opacity: fade(f, dur * 0.86, 12) }}>
          All three, <span style={{ color: INK }}>in one place.</span>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── Composition ──────────────────────────────────────────────────────────────
const SCENES: Record<Key, React.FC<SceneProps>> = {
  h0: SceneHook,
  h1: SceneOldWay,
  h2: SceneCost,
  h3: SceneTurn,
  h4: SceneAI,
  h5: SceneTrack,
  h6: SceneAutomate,
  h7: SceneBranches,
  h8: SceneCTA,
  c1: SceneChat,
  c2: SceneCalendar,
  c3: SceneReferral,
  c4: SceneAllInOne,
  t1: SceneThreeTypes,
};

export const HVACTrainingVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={INTRO}>
        <MainIntro />
      </Sequence>

      {ORDER.map((k, i) => {
        const Scene = SCENES[k];
        const dur = DURATIONS[k] + (i === ORDER.length - 1 ? TAIL : 0);
        return (
          <Sequence key={k} from={STARTS[k]} durationInFrames={dur}>
            <Scene f={frame - STARTS[k]} dur={dur} fps={fps} />
          </Sequence>
        );
      })}

      {ORDER.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={`a-${k}`} from={STARTS[k]} durationInFrames={DURATIONS[k]}>
          <Audio src={staticFile(`hvac/${k}.mp3`)} />
        </Sequence>
      ))}
      {/* 🎬 MAIN OUTRO (shared, from SkillbnkOutroVideo.tsx) */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
