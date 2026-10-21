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
// DURATIONS is auto-patched by generate-voice-lms.py (keep it a plain object,
// no type annotation, so the regex can find it). Values are frames per voice
// clip incl. a small breathing gap.
const DURATIONS = {
  p0: 164,
  p1: 310,
  p2: 118,
  p3: 64,
  p4: 195,
  p5: 324,
  p6: 123,
  p7: 85,
};

const INTRO = INTRO_FRAMES; // MAIN INTRO length, from SkillbnkIntroVideo.tsx
const ORDER = ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"] as const;
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

const TAIL = 30; // hold on the CTA after the last line
const OUTRO_START = INTRO + ORDER.reduce((a, k) => a + DURATIONS[k], 0) + TAIL;
export const TOTAL_FRAMES =
  INTRO + ORDER.reduce((a, k) => a + DURATIONS[k], 0) + TAIL + OUTRO_FRAMES; // + shared MAIN OUTRO

// ─── Brand ────────────────────────────────────────────────────────────────────
const BLUE = "#1B5EF7";
const BLUE_2 = "#7FA0FF";
const INK = "#F1F5F9";
const MUTED = "#8A96B2";
const RED = "#F05252";
const GREEN = "#22C55E";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (f: number, from: number, dur = 12) =>
  interpolate(f, [from, from + dur], [0, 1], clamp);
const pop = (f: number, start: number, fps: number, cfg: object = {}) =>
  spring({ frame: f - start, fps, config: { damping: 16, stiffness: 160, mass: 0.7, ...cfg } });
/** fade out over the last N frames of a scene */
const outro = (f: number, dur: number, n = 10) =>
  interpolate(f, [dur - n, dur], [1, 0], clamp);

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
      opacity,
      display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
      background: "#2E5CF61F", border: "1px solid #2E5CF666", borderRadius: 999,
      fontSize: 13, fontWeight: 700, color, letterSpacing: 1.5, textTransform: "uppercase",
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
    {text}
  </div>
);

// ─── Intro: logo bumper (75f) ─────────────────────────────────────────────────
const SceneIntro: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const p = pop(f, 4, fps, { damping: 14 });
  const scale = interpolate(p, [0, 1], [0.85, 1]);
  const blur = interpolate(p, [0, 1], [12, 0]);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #0B1230 0%, #04060D 100%)", opacity: outro(f, dur, 8) }}>
      <Center>
        <div style={{ position: "relative", transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity: fade(f, 2, 10) }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 520, display: "block" }} />
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT, fontSize: 22, fontWeight: 700, color: MUTED, letterSpacing: 0.5, opacity: fade(f, 30, 14) }}>
          Training, without the tool sprawl.
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// ─── p0: the hook ─────────────────────────────────────────────────────────────
const SceneHook: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const a = pop(f, 2, fps);
  const b = pop(f, 26, fps);
  const count = Math.round(interpolate(f, [26, 70], [1, 6], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <DarkBg>
      <Center style={{ opacity: outro(f, dur) }}>
        <Pill text="The hidden cost of training" opacity={fade(f, 0, 10)} />
        <div
          style={{
            marginTop: 26, fontSize: 56, fontWeight: 800, color: INK, textAlign: "center", lineHeight: 1.2, letterSpacing: -1,
            transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`, opacity: a,
          }}
        >
          Most training schools pay for
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 8, opacity: b, transform: `scale(${interpolate(b, [0, 1], [0.8, 1])})` }}>
          <span
            style={{
              fontSize: 150, fontWeight: 900, lineHeight: 1,
              backgroundImage: `linear-gradient(135deg, ${RED} 0%, #FF9A7A 100%)`,
              WebkitBackgroundClip: "text", color: "transparent",
            }}
          >
            {count}
          </span>
          <span style={{ fontSize: 56, fontWeight: 800, color: INK }}>different tools</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 28, fontWeight: 600, color: MUTED, opacity: fade(f, 80, 14) }}>
          …just to run <span style={{ color: INK }}>one</span> business.
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── p1: the six tools ────────────────────────────────────────────────────────
const TOOLS = [
  { icon: "🎓", name: "LMS", job: "for courses", price: 149 },
  { icon: "🌐", name: "Website builder", job: "for your site", price: 49 },
  { icon: "📇", name: "CRM", job: "for leads", price: 99 },
  { icon: "💳", name: "Payment tool", job: "for invoices", price: 69 },
  { icon: "✉️", name: "Email platform", job: "for marketing", price: 89 },
  { icon: "📅", name: "Scheduling app", job: "for sessions", price: 49 },
];
const TOOL_TOTAL = TOOLS.reduce((a, t) => a + t.price, 0);

const ToolCard: React.FC<{ t: (typeof TOOLS)[number]; p: number; tint?: number }> = ({ t, p, tint = 0 }) => (
  <div
    style={{
      width: 330, height: 128, boxSizing: "border-box", padding: "18px 20px",
      background: "linear-gradient(180deg, #101A32 0%, #0B1224 100%)",
      border: `1px solid ${tint > 0 ? `rgba(240,82,82,${0.25 + tint * 0.5})` : "#2E3B5E"}`,
      borderRadius: 18, display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 14px 40px #00000066",
      opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
    }}
  >
    <div style={{ width: 58, height: 58, borderRadius: 14, background: "#141B2E", border: "1px solid #2A3654", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
      {t.icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: INK }}>{t.name}</div>
      <div style={{ fontSize: 15, color: MUTED, marginTop: 3 }}>{t.job}</div>
    </div>
    <div style={{ fontSize: 17, fontWeight: 800, color: "#FCA5A5", background: "#F0525220", padding: "5px 10px", borderRadius: 8 }}>
      ${t.price}<span style={{ fontSize: 11, fontWeight: 600 }}>/mo</span>
    </div>
  </div>
);

const SceneTools: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const step = (dur - 30) / TOOLS.length;
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur, 8), alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: INK, opacity: fade(f, 0, 10) }}>
          One school. <span style={{ color: RED }}>Six subscriptions.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 330px)", gap: 22, marginTop: 50 }}>
          {TOOLS.map((t, i) => (
            <ToolCard key={t.name} t={t} p={pop(f, 4 + i * step, fps)} />
          ))}
        </div>
        <div style={{ marginTop: 34, fontSize: 13, color: "#56627E", letterSpacing: 1, textTransform: "uppercase", opacity: fade(f, 4 + 5 * step, 14) }}>
          Typical monthly pricing — illustrative
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── p2: the bill ─────────────────────────────────────────────────────────────
const SceneBill: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const total = Math.round(interpolate(f, [4, 50], [0, TOOL_TOTAL], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const shake = f > 50 && f < 62 ? Math.sin(f * 3) * 4 : 0;
  const s = pop(f, 48, fps, { damping: 10 });
  return (
    <DarkBg glow="#F052522A">
      <Center style={{ opacity: outro(f, dur, 8) }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: MUTED, letterSpacing: 2, textTransform: "uppercase", opacity: fade(f, 0, 8) }}>
          Your monthly tool bill
        </div>
        <div style={{ transform: `translateX(${shake}px) scale(${1 + s * 0.06})`, display: "flex", alignItems: "baseline", marginTop: 8 }}>
          <span style={{ fontSize: 170, fontWeight: 900, color: RED, lineHeight: 1, letterSpacing: -4 }}>${total}</span>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#FCA5A5", marginLeft: 8 }}>/mo</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 30, fontWeight: 700, color: INK, opacity: fade(f, 52, 12) }}>
          Minimum. <span style={{ color: MUTED }}>Just to stay open.</span>
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── p3: skillbank replaces all of it ─────────────────────────────────────────
const SceneReplace: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const logoP = pop(f, 16, fps, { damping: 13 });
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur, 6) }}>
        {TOOLS.map((t, i) => {
          const ang = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2;
          const r = interpolate(f, [0, 22], [300, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
          const o = interpolate(f, [0, 4, 18, 24], [0, 1, 1, 0], clamp);
          return (
            <div
              key={t.name}
              style={{
                position: "absolute", left: 640 + Math.cos(ang) * r * 1.4 - 36, top: 330 + Math.sin(ang) * r - 36,
                width: 72, height: 72, borderRadius: 18, background: "#141B2E", border: "1px solid #2A3654",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, opacity: o,
              }}
            >
              {t.icon}
            </div>
          );
        })}
        <Center>
          <div
            style={{
              padding: "10px 20px",
              filter: `drop-shadow(0 0 ${30 * logoP}px ${BLUE}AA)`,
              transform: `scale(${interpolate(logoP, [0, 1], [0.4, 1])})`, opacity: logoP,
            }}
          >
            <Img src={staticFile("skillbnk-logo.png")} style={{ width: 380, display: "block" }} />
          </div>
          <div style={{ marginTop: 34, fontSize: 44, fontWeight: 800, color: INK, opacity: fade(f, 26, 10) }}>
            replaces <span style={{ color: BLUE_2 }}>all of it.</span>
          </div>
        </Center>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── p4: one platform ─────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🎓", name: "Courses" },
  { icon: "🌐", name: "Website" },
  { icon: "📣", name: "Marketing" },
  { icon: "💳", name: "Payments" },
  { icon: "📅", name: "Scheduling" },
  { icon: "🏅", name: "Certificates" },
];

const SceneOnePlatform: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const step = (dur * 0.6) / FEATURES.length;
  const loginP = pop(f, dur * 0.72, fps);
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", paddingTop: 64 }}>
        <Pill text="One platform" opacity={fade(f, 0, 10)} />
        <div style={{ marginTop: 18, fontSize: 46, fontWeight: 800, color: INK, letterSpacing: -0.5, opacity: fade(f, 4, 12) }}>
          Everything your school runs on.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 300px)", gap: 20, marginTop: 44 }}>
          {FEATURES.map((ft, i) => {
            const p = pop(f, 16 + i * step, fps);
            return (
              <div
                key={ft.name}
                style={{
                  height: 86, boxSizing: "border-box", padding: "0 22px", borderRadius: 16,
                  background: "linear-gradient(180deg, #101A32 0%, #0B1224 100%)", border: "1px solid #2E5CF655",
                  display: "flex", alignItems: "center", gap: 14, opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
                }}
              >
                <span style={{ fontSize: 28 }}>{ft.icon}</span>
                <span style={{ flex: 1, fontSize: 22, fontWeight: 700, color: INK }}>{ft.name}</span>
                <span
                  style={{
                    width: 28, height: 28, borderRadius: "50%", background: GREEN, color: "#fff", fontSize: 16, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})`,
                  }}
                >
                  ✓
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 40, display: "flex", alignItems: "center", gap: 12, padding: "14px 30px", borderRadius: 999,
            background: `linear-gradient(135deg, ${BLUE} 0%, #3E7BFA 100%)`, boxShadow: `0 10px 40px ${BLUE}66`,
            fontSize: 22, fontWeight: 800, color: "#fff", opacity: loginP, transform: `scale(${interpolate(loginP, [0, 1], [0.85, 1])})`,
          }}
        >
          🔑 All in a single login
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── p5: three audiences ──────────────────────────────────────────────────────
const MiniRow: React.FC<{ w: number; c?: string }> = ({ w, c = "#E5E7EB" }) => (
  <div style={{ height: 8, width: `${w}%`, background: c, borderRadius: 4, marginTop: 8 }} />
);

const Pane: React.FC<{ title: string; sub: string; icon: string; p: number; children: React.ReactNode; active: boolean }> = ({
  title, sub, icon, p, children, active,
}) => (
  <div
    style={{
      width: 360, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${active ? 1.03 : 1})`,
      transition: "none",
    }}
  >
    <div
      style={{
        height: 250, borderRadius: 16, background: "#FAFBFD", overflow: "hidden",
        border: `2px solid ${active ? BLUE : "#2C3B57"}`, boxShadow: active ? `0 20px 60px ${BLUE}55` : "0 16px 40px #00000066",
      }}
    >
      <div style={{ height: 26, background: "linear-gradient(180deg, #202B45, #182238)", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" }}>
        {["#FF6B5E", "#FFC15E", "#3ED07F"].map((c) => (
          <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>{title}</div>
        <div style={{ fontSize: 15, color: MUTED, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  </div>
);

const SceneAudiences: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const t1 = 4, t2 = dur * 0.3, t3 = dur * 0.55;
  const active = f < t2 ? 0 : f < t3 ? 1 : 2;
  const courseColors = ["#DBEAFE", "#DCFCE7", "#FEF3C7"];
  return (
    <DarkBg>
      <AbsoluteFill style={{ opacity: outro(f, dur), alignItems: "center", paddingTop: 70 }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: INK, opacity: fade(f, 0, 10) }}>
          The right view for <span style={{ color: BLUE_2 }}>everyone.</span>
        </div>
        <div style={{ display: "flex", gap: 34, marginTop: 56 }}>
          <Pane title="Learners" sub="A clean portal built for them" icon="🙋" p={pop(f, t1, fps)} active={active === 0}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>My Courses</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {courseColors.map((c, i) => (
                <div key={c} style={{ flex: 1, height: 70, borderRadius: 8, background: c, padding: 6, boxSizing: "border-box" }}>
                  <div style={{ height: 6, width: "70%", background: "#11182733", borderRadius: 3 }} />
                  <div style={{ marginTop: 40, height: 5, background: "#ffffffaa", borderRadius: 3 }}>
                    <div style={{ height: 5, width: `${[80, 45, 20][i]}%`, background: BLUE, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <MiniRow w={90} /><MiniRow w={60} /><MiniRow w={75} />
          </Pane>
          <Pane title="Branch managers" sub="Their own admin" icon="🏫" p={pop(f, t2, fps)} active={active === 1}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Downtown Branch · Admin</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {[["Learners", "248"], ["Sessions", "12"], ["Revenue", "$18k"]].map(([k, v]) => (
                <div key={k} style={{ flex: 1, borderRadius: 8, background: "#F1F5F9", padding: 8 }}>
                  <div style={{ fontSize: 9, color: "#6B7280" }}>{k}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>{v}</div>
                </div>
              ))}
            </div>
            <MiniRow w={95} /><MiniRow w={80} /><MiniRow w={88} /><MiniRow w={55} />
          </Pane>
          <Pane title="Head office" sub="Every org, every branch" icon="🏢" p={pop(f, t3, fps)} active={active === 2}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>All Organizations</div>
            {["Summit Ridge Academy", "Lakeside Driving School", "Harbor View Fitness"].map((o, i) => (
              <div key={o} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9, background: "#F1F5F9", borderRadius: 8, padding: "7px 9px" }}>
                <div style={{ width: 16, height: 16, borderRadius: 5, background: [BLUE, "#16A34A", "#EA580C"][i] }} />
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#111827", flex: 1 }}>{o}</div>
                <div style={{ fontSize: 9, color: "#6B7280" }}>{[4, 2, 3][i]} branches</div>
              </div>
            ))}
          </Pane>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// ─── p6: tagline ──────────────────────────────────────────────────────────────
const SceneTagline: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const p = pop(f, 2, fps);
  const words = "Built for schools that are serious about growth.".split(" ");
  return (
    <DarkBg>
      <Center style={{ opacity: outro(f, dur) }}>
        <div style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 300, display: "block" }} />
        </div>
        <div style={{ marginTop: 40, fontSize: 46, fontWeight: 800, color: INK, maxWidth: 900, textAlign: "center", lineHeight: 1.25 }}>
          {words.map((w, i) => {
            const wp = fade(f, 14 + i * 5, 8);
            const hi = w.startsWith("growth");
            return (
              <span
                key={i}
                style={{
                  display: "inline-block", marginRight: 12, opacity: wp,
                  transform: `translateY(${interpolate(wp, [0, 1], [14, 0])}px)`,
                  ...(hi ? { backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_2} 100%)`, WebkitBackgroundClip: "text", color: "transparent" } : {}),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── p7: CTA ──────────────────────────────────────────────────────────────────
const SceneCTA: React.FC<SceneProps> = ({ f, fps }) => {
  const p = pop(f, 2, fps);
  const btn = pop(f, 12, fps, { damping: 11 });
  const pulse = 1 + Math.sin(f / 6) * 0.02 * fade(f, 30, 10);
  return (
    <DarkBg>
      <Center>
        <Img src={staticFile("skillbnk-logo.png")} style={{ width: 440, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-20, 0])}px)` }} />
        <div style={{ marginTop: 36, fontSize: 40, fontWeight: 800, color: INK, opacity: fade(f, 6, 10) }}>
          Start your free trial
        </div>
        <div
          style={{
            marginTop: 26, padding: "18px 44px", borderRadius: 999, background: `linear-gradient(135deg, ${BLUE} 0%, #3E7BFA 100%)`,
            color: "#fff", fontSize: 30, fontWeight: 800, letterSpacing: 0.3, boxShadow: `0 14px 40px ${BLUE}55`,
            opacity: btn, transform: `scale(${interpolate(btn, [0, 1], [0.7, 1]) * pulse})`,
          }}
        >
          skillbnk.com →
        </div>
      </Center>
    </DarkBg>
  );
};

// ─── Composition ──────────────────────────────────────────────────────────────
const SCENES: Record<Key, React.FC<SceneProps>> = {
  p0: SceneHook,
  p1: SceneTools,
  p2: SceneBill,
  p3: SceneReplace,
  p4: SceneOnePlatform,
  p5: SceneAudiences,
  p6: SceneTagline,
  p7: SceneCTA,
};

export const LMSProblemVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#04060D", fontFamily: FONT }}>
      {INTRO > 0 && (
        <Sequence from={0} durationInFrames={INTRO}>
          <MainIntro />
        </Sequence>
      )}

      {ORDER.map((k, i) => {
        const Scene = SCENES[k];
        const isLast = i === ORDER.length - 1;
        const dur = DURATIONS[k] + (isLast ? TAIL : 0);
        return (
          <Sequence key={k} from={STARTS[k]} durationInFrames={dur}>
            <Scene f={frame - STARTS[k]} dur={dur} fps={fps} />
          </Sequence>
        );
      })}

      {ORDER.map((k) => (
        <Sequence key={`a-${k}`} from={STARTS[k]} durationInFrames={DURATIONS[k]}>
          <Audio src={staticFile(`lms/${k}.mp3`)} />
        </Sequence>
      ))}
      {/* 🎬 MAIN OUTRO (shared, from SkillbnkOutroVideo.tsx) */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
