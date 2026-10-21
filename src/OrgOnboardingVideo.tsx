import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { buildTimeline } from "./timeline";

// ─── helpers ───────────────────────────────────────────────────────────────
const fi = (frame: number, from: number, to: number, inDur = 16, outDur = 0) => {
  const fadeIn = interpolate(frame, [from, from + inDur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  if (!outDur) return fadeIn;
  const fadeOut = interpolate(frame, [to - outDur, to], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  });
  return Math.min(fadeIn, fadeOut);
};

const sp = (frame: number, start: number, fps: number, config?: object) =>
  spring({ frame: frame - start, fps, config: { damping: 20, stiffness: 140, mass: 0.8, ...config } });

// ─── shared bits ─────────────────────────────────────────────────────────────
const Cursor: React.FC<{ x: number; y: number; opacity: number; rippleT?: number }> = ({ x, y, opacity, rippleT }) => (
  <div style={{ position: "absolute", left: x - 5, top: y - 5, opacity, pointerEvents: "none", zIndex: 30 }}>
    {rippleT !== undefined && rippleT > 0 && rippleT < 1 && (
      <div style={{
        position: "absolute", left: 7 - 30 * rippleT, top: 7 - 30 * rippleT,
        width: 34 + 61 * rippleT, height: 34 + 61 * rippleT,
        borderRadius: "50%", border: "3px solid #1D4ED8", opacity: 1 - rippleT,
      }} />
    )}
    <div style={{
      position: "absolute", left: -10, top: -10, width: 64, height: 64, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)", filter: "blur(1px)",
    }} />
    <svg width="44" height="44" viewBox="0 0 24 24" fill="#1D4ED8" stroke="#fff" strokeWidth="2.4"
      style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))" }}>
      <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
    </svg>
  </div>
);

const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  Approved: { bg: "#DCFCE7", fg: "#15803D" },
  Pending: { bg: "#FFEDD5", fg: "#C2410C" },
  Rejected: { bg: "#FEE2E2", fg: "#DC2626" },
};

// ─── the real onboarding-wizard sidebar (matches the product screenshots:
//     "ORGANISATION SETUP" header, company switcher pill, step counter +
//     progress bar, and a checklist of steps that turn green as they're
//     completed) — NOT the main app nav sidebar, which only appears after
//     onboarding is done ─────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  { label: "Add a Branch" },
  { label: "Add an Instructor" },
  { label: "Create a Session" },
  { label: "Add a Category", optional: true },
  { label: "Create a Role" },
  { label: "Add Staff", optional: true },
  { label: "Configure Menu Builder", optional: true },
  { label: "Set Up an Integration", optional: true },
];
const ORG_NAME = "Summit Ridge Academy";

const OnboardingSidebar: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const pct = Math.round(((activeStep + 1) / ONBOARDING_STEPS.length) * 100);
  const initials = ORG_NAME.split(" ").slice(0, 2).map(w => w[0]).join("");
  return (
    <div style={{
      width: 200, background: "#fff", borderRight: "1px solid #EEF0F4", display: "flex", flexDirection: "column",
      height: "100%", flexShrink: 0, padding: "16px 14px", boxSizing: "border-box", boxShadow: "1px 0 0 #00000005",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: "linear-gradient(135deg,#2E64F0,#1D4ED8)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10.5, fontWeight: 800,
          boxShadow: "0 2px 6px #1D4ED84D",
        }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 8.5, color: "#9CA3AF", fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>Organisation Setup</div>
          <div style={{ fontSize: 12, color: "#111827", fontWeight: 800, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ORG_NAME}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, background: "#F7F8FA", border: "1px solid #EEF0F4", borderRadius: 8, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontSize: 9.5, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Company: {ORG_NAME.slice(0, 9)}…</span>
        <span style={{ fontSize: 9.5, color: "#1D4ED8", fontWeight: 700, background: "#EFF6FF", padding: "2px 7px", borderRadius: 5, flexShrink: 0 }}>Switch</span>
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>{activeStep + 1} of {ONBOARDING_STEPS.length} steps</span>
        <span style={{ fontSize: 10, color: "#1D4ED8", fontWeight: 800 }}>{pct}%</span>
      </div>
      <div style={{ marginTop: 5, height: 5, background: "#EEF0F4", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3E7BFA,#1D4ED8)", borderRadius: 3 }} />
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column" }}>
        {ONBOARDING_STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;
          const isLast = i === ONBOARDING_STEPS.length - 1;
          return (
            <div key={step.label} style={{ display: "flex", gap: 8, padding: "3px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 15, flexShrink: 0 }}>
                <span style={{
                  width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "linear-gradient(135deg,#3ED07F,#16A34A)" : current ? "#fff" : "#fff",
                  border: done ? "none" : `1.5px solid ${current ? "#2563EB" : "#D9DEE7"}`,
                  boxShadow: done ? "0 1px 4px #16A34A55" : current ? "0 0 0 3px #2563EB1F" : "none",
                }}>
                  {done && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
                  {current && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB" }} />}
                </span>
                {!isLast && <div style={{ width: 1.5, flex: 1, minHeight: 8, background: done ? "#BBF0D2" : "#EEF0F4", marginTop: 1 }} />}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, paddingBottom: 6 }}>
                <span style={{
                  fontSize: 11, flex: 1,
                  color: done ? "#111827" : current ? "#1D4ED8" : "#9CA3AF",
                  fontWeight: current ? 700 : 500,
                }}>{step.label}</span>
                {step.optional && !done && (
                  <span style={{ fontSize: 7.5, color: "#9CA3AF", background: "#F3F4F6", padding: "1px 5px", borderRadius: 8, flexShrink: 0 }}>optional</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TopBar: React.FC = () => (
  <div style={{
    height: 52, background: "#fff", borderBottom: "1px solid #EEF0F4", display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 18px", flexShrink: 0, boxShadow: "0 1px 0 #00000005",
  }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 7, padding: "6px 13px", border: "1px solid #E5E7EB",
      borderRadius: 8, fontSize: 11.5, color: "#374151", background: "#FAFBFD",
    }}>
      <span style={{ fontSize: 11 }}>🏢</span><span style={{ fontWeight: 600 }}>Organization: Summit Ridge Academy</span><span style={{ fontSize: 9, color: "#9CA3AF" }}>▼</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20, height: 28 }}>
      <span style={{ fontSize: 15, color: "#9CA3AF" }}>🔔</span>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#2E64F0,#1D4ED8)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11.5, fontWeight: 700,
        boxShadow: "0 2px 8px #1D4ED84D", border: "2px solid #fff", outline: "1px solid #E5E7EB",
      }}>MT</div>
    </div>
  </div>
);

const BrowserChrome: React.FC = () => (
  <div style={{
    height: 36, background: "linear-gradient(180deg, #202B45, #182238)", display: "flex", alignItems: "center",
    padding: "0 14px", gap: 7, borderBottom: "1px solid #2C3B57",
  }}>
    <div style={{ width: 11, height: 11, borderRadius: "50%", background: "linear-gradient(135deg,#FF6B5E,#E14B3E)" }} />
    <div style={{ width: 11, height: 11, borderRadius: "50%", background: "linear-gradient(135deg,#FFC15E,#EFA22C)" }} />
    <div style={{ width: 11, height: 11, borderRadius: "50%", background: "linear-gradient(135deg,#3ED07F,#1FAF63)" }} />
    <div style={{
      flex: 1, maxWidth: 480, margin: "0 auto", background: "#0F1729", borderRadius: 6, padding: "4px 12px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "1px solid #FFFFFF0F",
    }}>
      <span style={{ fontSize: 9.5, color: "#3ED07F" }}>🔒</span>
      <span style={{ fontSize: 10.5, color: "#9DAAC4", letterSpacing: 0.2 }}>company.skillbnk.com</span>
    </div>
  </div>
);

// AppWindow: 1480x820 window, sidebar(200) + topbar(52) always present, so
// every scene's content area is a consistent 1280x732 starting at
// window-local (200, 88) — this is the coordinate frame every camera-pan
// and cursor target below is computed against.
// sidebar=false hides the onboarding-step sidebar entirely (used for the
// "My Organizations" switcher page, which sits outside the step wizard and
// shows no step checklist in the product); activeStep is ignored then.
const AppWindow: React.FC<{ zoom: number; panX: number; panY: number; sidebar?: boolean; activeStep?: number; children: React.ReactNode }> = ({ zoom, panX, panY, sidebar = true, activeStep = 0, children }) => (
  <div style={{
    position: "absolute", top: "50%", left: "50%",
    transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
    width: 1480, height: 820, borderRadius: 16, overflow: "hidden",
    border: "1px solid #2C3B57", boxShadow: "0 4px 0 #0006, 0 50px 140px #0006, 0 0 0 1px #ffffff10 inset",
    background: "#FAFBFD",
  }}>
    <BrowserChrome />
    <div style={{ display: "flex", height: "calc(100% - 36px)" }}>
      {sidebar && <OnboardingSidebar activeStep={activeStep} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <div style={{ flex: 1, position: "relative" }}>{children}</div>
      </div>
    </div>
  </div>
);

const SceneBg: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
    backgroundSize: "60px 60px", opacity: 0.4,
  }} />
);

const Label: React.FC<{ opacity: number; title: string; sub: string; tone?: "blue" | "green" }> = ({ opacity, title, sub, tone = "blue" }) => (
  <div style={{ position: "absolute", bottom: 55, left: "50%", transform: "translateX(-50%)", opacity, textAlign: "center" }}>
    <div style={{ background: "#1E293B", border: `1px solid ${tone === "blue" ? "#334155" : "#10B98133"}`, borderRadius: 10, padding: "12px 28px" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: tone === "blue" ? "#F1F5F9" : "#10B981" }}>{title}</div>
      <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{sub}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// HOOK — plays before the logo bumper. A punchy, on-screen pain-point line
// that earns attention before the brand reveal, instead of opening cold on
// a logo. Pure visual (own Sequence carries "ohook" audio separately).
// ═══════════════════════════════════════════════════════════════════════════
// Scattered "chaos" icons representing the ten different tools a training
// provider normally juggles — pop in messily, drift, then converge/vanish
// right as the "skillbank" payoff line lands, visually paying off the copy.
const CHAOS_ICONS = [
  { icon: "📧", x: 230, y: 190, rot: -14, delay: 0, drift: 0.5 },
  { icon: "📅", x: 1660, y: 170, rot: 16, delay: 5, drift: 0.4 },
  { icon: "💬", x: 175, y: 760, rot: 11, delay: 9, drift: 0.55 },
  { icon: "📊", x: 1690, y: 740, rot: -9, delay: 3, drift: 0.45 },
  { icon: "🗂️", x: 310, y: 470, rot: 19, delay: 12, drift: 0.5 },
  { icon: "🔐", x: 1610, y: 450, rot: -16, delay: 7, drift: 0.6 },
  { icon: "💳", x: 430, y: 890, rot: 9, delay: 14, drift: 0.4 },
  { icon: "🎓", x: 1500, y: 900, rot: -11, delay: 2, drift: 0.5 },
];

const ChaosIcons: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <>
    {CHAOS_ICONS.map((it, i) => {
      const pop = sp(frame - it.delay, 0, fps, { damping: 14, stiffness: 130 });
      const scaleIn = interpolate(pop, [0, 1], [0.3, 1]);
      const drift = Math.sin((frame - it.delay) / fps * it.drift * Math.PI) * 10;
      const rotDrift = it.rot + Math.sin((frame - it.delay) / fps * it.drift * Math.PI * 0.6) * 6;
      // Converge/vanish right as the payoff line lands (~frame 55-75).
      const vanish = interpolate(frame, [55, 78], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const converge = interpolate(frame, [55, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const cx = it.x + (960 - it.x) * converge * 0.5;
      const cy = it.y + (540 - it.y) * converge * 0.5;
      return (
        <div key={i} style={{
          position: "absolute", left: cx, top: cy + drift,
          opacity: Math.max(0, scaleIn) * vanish * 0.85,
          transform: `translate(-50%,-50%) scale(${scaleIn * (1 - converge * 0.4)}) rotate(${rotDrift}deg)`,
          width: 64, height: 64, borderRadius: 16, background: "#141B2E", border: "1px solid #2A3654",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          boxShadow: "0 12px 30px #00000066",
        }}>{it.icon}</div>
      );
    })}
  </>
);

const HookScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Slow continuous Ken Burns push over the whole scene for a cinematic,
  // "edited by hand" feel instead of a static frame.
  const kenBurns = interpolate(frame, [0, 173], [1, 1.07], { extrapolateRight: "clamp" });

  const kickerProg = sp(frame, 2, fps, { damping: 22, stiffness: 200 });
  const kickerOpacity = fi(frame, 2, 400, 10);
  const kickerY = interpolate(kickerProg, [0, 1], [10, 0]);

  // Kinetic entrance: blur + skew resolving into place, not just a slide.
  const line1Prog = sp(frame, 16, fps, { damping: 20, stiffness: 170 });
  const line1Y = interpolate(line1Prog, [0, 1], [30, 0]);
  const line1Blur = interpolate(line1Prog, [0, 1], [8, 0]);
  const line1Skew = interpolate(line1Prog, [0, 1], [-4, 0]);
  const line1Opacity = fi(frame, 16, 400, 12);

  const line2Prog = sp(frame, 42, fps, { damping: 16, stiffness: 150 });
  const line2Scale = interpolate(line2Prog, [0, 0.55, 1], [0.8, 1.06, 1]);
  const line2Blur = interpolate(line2Prog, [0, 1], [10, 0]);
  const line2Opacity = fi(frame, 42, 400, 14);
  // One-time shine sweep across the payoff line, echoing the logo intro's
  // own shine sweep so the two scenes feel like one crafted piece.
  const line2SweepX = interpolate(frame, [50, 76], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const line2SweepOpacity = interpolate(frame, [50, 58, 70, 76], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // A quick "weeks -> same day" comparison stat, the concrete pay-off after
  // the LMS-comparison line above it. The struck-through weeks count ticks
  // down before landing, and the arrow "fires" with a little travel + glow.
  const statOpacity = fi(frame, 70, 400, 12);
  const statY = interpolate(sp(frame, 70, fps), [0, 1], [16, 0]);
  const arrowTravel = interpolate(sp(frame, 82, fps, { damping: 14 }), [0, 1], [-8, 0]);
  const sameDayPulse = 1 + Math.max(0, Math.sin((frame - 90) / fps * Math.PI * 1.6)) * 0.05 * fi(frame, 90, 400, 8);

  // Radial energy burst + flash-wipe transition out, right before the logo
  // intro takes over — timed against the Hook's real Sequence duration
  // (~173f from real narration; see the root <Sequence> below).
  const burstScale = interpolate(frame, [146, 168], [0, 3.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const burstOpacity = interpolate(frame, [146, 156, 168], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFlash = interpolate(frame, [158, 166, 172], [0, 0.95, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitFade = interpolate(frame, [156, 172], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(circle at 50% 40%, #0B1230 0%, #04060D 100%)",
      opacity: bgOpacity * exitFade, overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, transform: `scale(${kenBurns})`, transformOrigin: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(#ffffff07 1px,transparent 1px),linear-gradient(90deg,#ffffff07 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div style={{
          position: "absolute", width: 1000, height: 1000, borderRadius: "50%",
          left: "50%", top: "48%", transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, #2E5CF62A 0%, transparent 65%)",
        }} />

        <ChaosIcons frame={frame} fps={fps} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 1200 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, opacity: kickerOpacity,
            transform: `translateY(${kickerY}px)`, marginBottom: 22,
            background: "#2E5CF61F", border: "1px solid #2E5CF666", borderRadius: 999,
            padding: "7px 18px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#9FB4FF", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Built for training providers &amp; LMS teams
            </span>
          </div>

          <div style={{
            fontSize: 60, fontWeight: 800, color: "#F1F5F9", letterSpacing: -1, lineHeight: 1.25,
            opacity: line1Opacity, transform: `translateY(${line1Y}px) skewX(${line1Skew}deg)`,
            filter: `blur(${line1Blur}px)`, textAlign: "center", width: "100%",
          }}>
            Other LMS platforms make onboarding a maze.
          </div>
          <div style={{
            position: "relative", overflow: "hidden", width: "100%", textAlign: "center",
            fontSize: 66, fontWeight: 900, letterSpacing: -1.3, marginTop: 14, lineHeight: 1.25,
            opacity: line2Opacity, transform: `scale(${line2Scale})`, filter: `blur(${line2Blur}px)`,
          }}>
            <span style={{
              position: "relative", display: "inline-block",
              backgroundImage: "linear-gradient(135deg, #2E5CF6 0%, #7FA0FF 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              skillBNK gets you live in minutes.
              <span style={{
                position: "absolute", top: 0, bottom: 0, left: `${line2SweepX}%`, width: "22%",
                background: "linear-gradient(115deg, transparent 8%, rgba(255,255,255,0.9) 50%, transparent 92%)",
                opacity: line2SweepOpacity, mixBlendMode: "screen", pointerEvents: "none",
              }} />
            </span>
          </div>

          <div style={{
            marginTop: 44, display: "flex", justifyContent: "center", width: "100%",
            opacity: statOpacity, transform: `translateY(${statY}px)`,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 28,
              background: "linear-gradient(180deg, #101A32 0%, #0B1224 100%)",
              border: "1px solid #2E3B5E", borderRadius: 18,
              padding: "22px 42px", boxShadow: "0 20px 46px #00000070, inset 0 1px 0 #ffffff0f",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, color: "#64748B", fontWeight: 600, textDecoration: "line-through" }}>Typical LMS setup</div>
                <div style={{ fontSize: 30, color: "#94A3B8", fontWeight: 800, marginTop: 6 }}>2&ndash;3 weeks</div>
              </div>
              <div style={{
                fontSize: 30, color: "#fff", transform: `translateX(${arrowTravel}px)`,
                width: 44, height: 44, borderRadius: "50%", background: "#2E5CF6",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 22px #2E5CF688",
              }}>→</div>
              <div style={{ textAlign: "center", transform: `scale(${sameDayPulse})` }}>
                <div style={{ fontSize: 16, color: "#60A5FA", fontWeight: 700 }}>With skillBNK</div>
                <div style={{ fontSize: 32, color: "#F1F5F9", fontWeight: 900, textShadow: "0 0 18px #3B82F688", marginTop: 6 }}>Same day</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radial energy burst right before the cut to the logo intro */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 500, height: 500, borderRadius: "50%",
        transform: `translate(-50%,-50%) scale(${burstScale})`,
        background: "radial-gradient(circle, #7FA0FF00 0%, #2E5CF6 55%, transparent 72%)",
        opacity: burstOpacity, pointerEvents: "none",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "#F1F5F9", opacity: exitFlash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ─── fictional USA demo data (not the user's real org data) ─────────────────
const ORG_CARDS = [
  { name: "Summit Ridge Academy", accent: "#EDE9FE", accentBar: "#7C3AED", status: "Approved", role: "Creator" },
  { name: "Lakeside Driving School", accent: "#DCFCE7", accentBar: "#16A34A", status: "Pending", role: "Creator" },
  { name: "Harbor View Fitness", accent: "#FEE2E2", accentBar: "#DC2626", status: "Rejected", role: "Creator" },
];
const OWNER = "Michael Turner";

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 1 — Manage multiple organizations from one portal
// content area 1280x732 @ window-local (200,88).
// Target: the "Switch" button on card 1, content-relative (232, 331)
//   → window-local (432, 419)  [200+232, 88+331]
//   → panX = -(432-740)*zoom = 308*zoom, panY = -(419-410)*zoom = -9*zoom
// ═══════════════════════════════════════════════════════════════════════════
// No sidebar here — "My Organizations" is the org switcher, outside the
// onboarding step wizard, so it shows no step checklist in the real product.
// Content area is the FULL 1480-wide window (no 200px sidebar offset), so
// the camera target and its window-local translation are recomputed:
// "Switch" button on card 1, content-relative (~268, 331) → window-local
// (268, 88+331=419) → panX=-(268-740)*zoom, panY=-(419-410)*zoom=-9*zoom.
const SceneOrgSwitcher: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 18, 42, 128, 151], [1, 1.12, 1.7, 1.7, 1.12], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 18, 42, 128, 151], [0, 214, 802, 802, 214], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 18, 42, 128, 151], [0, -4, -15, -15, -4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  // Cursor travels to the exact "Switch" button position computed above.
  const cursorOpacity = fi(frame, 46, 90, 8, 10);
  const cursorX = interpolate(frame, [46, 60], [560, 268], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [46, 60], [10, 331], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const switchRipple = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} sidebar={false}>
        <div style={{ position: "absolute", inset: 0, padding: 20, opacity: headerOpacity }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 32, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>My Organizations</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Select an organization to access the dashboard</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", fontSize: 11.5, fontWeight: 700, padding: "7px 14px", borderRadius: 8 }}>Go to Dashboard</div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Active: Summit Ridge Academy</div>
            <div style={{ height: 32, border: "1px solid #E5E7EB", borderRadius: 7, marginBottom: 10, background: "#F9FAFB" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["All", 6, true], ["Approved", 3, false], ["Pending", 1, false], ["Rejected", 2, false]].map(([lbl, n, active]: any) => (
                <div key={lbl} style={{
                  fontSize: 11.5, fontWeight: 700, padding: "5px 13px", borderRadius: 999,
                  background: active ? "#1D4ED8" : "transparent", color: active ? "#fff" : "#374151",
                }}>{lbl} <span style={{ opacity: 0.8 }}>{n}</span></div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {ORG_CARDS.map((org, i) => {
                const cardOpacity = fi(frame, 10 + i * 8, 400, 12);
                const cardY = interpolate(sp(frame, 10 + i * 8, fps), [0, 1], [22, 0]);
                const colors = STATUS_COLOR[org.status];
                return (
                  <div key={org.name} style={{ opacity: cardOpacity, transform: `translateY(${cardY}px)`, border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ background: org.accent, borderBottom: `2px solid ${org.accentBar}`, padding: "9px 13px", fontSize: 13, fontWeight: 700, color: org.accentBar }}>
                      {org.name}
                    </div>
                    <div style={{ padding: 13, fontSize: 11, color: "#374151" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "#9CA3AF" }}>Owner:</span><span>{OWNER}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "#9CA3AF" }}>Status:</span>
                        <span style={{ background: colors.bg, color: colors.fg, fontWeight: 700, borderRadius: 999, padding: "1px 9px", fontSize: 10 }}>{org.status}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}><span style={{ color: "#9CA3AF" }}>Role:</span><span>{org.role}</span></div>
                      {i === 0 ? (
                        <div style={{ background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 7, padding: "6px 0", fontSize: 11.5, fontWeight: 700 }}>Switch</div>
                      ) : (
                        <div style={{ background: "#F3F4F6", color: "#9CA3AF", textAlign: "center", borderRadius: 7, padding: "6px 0", fontSize: 11.5, fontWeight: 700 }}>{org.status}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={switchRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 90, 400, 15)} title="One portal, every organization" sub="Switch between them in a single click" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 2 — Add a Branch (5-step guided wizard)
// Camera pushes into the step-content column, content-relative center
// (640, 250) → window-local (860, 338) → panX=-(860-740)*zoom, panY=-(338-410)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const STEPS = ["Branch Info", "Contact 1", "Contact 2", "About & Social", "Documents"];

const StepBranchInfo: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity }}>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 1 }}>Branch Information</div>
    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>Enter the basic details about your branch</div>
    {[["Branch Name", "Downtown Learning Center"], ["Branch URL", "company.skillbnk.com/downtown"], ["Phone Number", "+1 (512) 555-0142"], ["Tax Number", "74-1234567"]].map(([l, v]) => (
      <div key={l} style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>{l}</div>
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "7px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>{v}</div>
      </div>
    ))}
    <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: "4px 0" }}>Address</div>
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 7, padding: "7px 11px", fontSize: 11.5, color: "#111827", background: "#F9FAFB" }}>482 Elm Street, Austin, TX</div>
      <div style={{ width: 90, border: "1px solid #E5E7EB", borderRadius: 7, padding: "7px 11px", fontSize: 11.5, color: "#111827", background: "#F9FAFB" }}>78701</div>
    </div>
  </div>
);

const StepContact: React.FC<{ opacity: number; label: string; name: string; email: string; phone: string }> = ({ opacity, label, name, email, phone }) => (
  <div style={{ opacity }}>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 1 }}>{label}</div>
    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>Enter details for this contact person</div>
    {[["Full Name", name], ["Email Address", email], ["Phone Number", phone]].map(([l, v]) => (
      <div key={l} style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>{l}</div>
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>{v}</div>
      </div>
    ))}
  </div>
);

const StepAbout: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity }}>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 1 }}>About &amp; Social Media</div>
    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>Tell us about your branch</div>
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "9px 11px", fontSize: 11.5, color: "#111827", background: "#F9FAFB", marginBottom: 12 }}>
      Downtown Austin's premier hands-on tech &amp; business training center for working professionals.
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
      {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(s => (
        <div key={s}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "#374151", marginBottom: 3 }}>{s}</div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "6px 9px", fontSize: 10.5, color: "#9CA3AF", background: "#F9FAFB" }}>https://{s.toLowerCase()}.com/…</div>
        </div>
      ))}
    </div>
  </div>
);

const StepDocuments: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity }}>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 1 }}>Documents</div>
    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>Upload your branch logo and required documents</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {["Branch Logo", "Business Document"].map(d => (
        <div key={d} style={{ border: "1.5px dashed #93C5FD", background: "#EFF6FF", borderRadius: 9, padding: "16px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 3 }}>{d}</div>
          <div style={{ fontSize: 10, color: "#6B7280" }}>Drag &amp; Drop or Browse</div>
        </div>
      ))}
    </div>
  </div>
);

const SceneAddBranch: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 15, 38, 240, 262], [1, 1.06, 1.35, 1.35, 1.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 15, 38, 240, 262], [0, -14, -135, -135, -14], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 15, 38, 240, 262], [0, 20, 97, 97, 20], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  // Five sub-steps, each ~44f, starting once the camera has pushed in.
  const STEP_DUR = 44;
  const STEP_START = 40;
  const stepIdx = Math.min(4, Math.max(0, Math.floor((frame - STEP_START) / STEP_DUR)));
  const stepLocalFrame = frame - (STEP_START + stepIdx * STEP_DUR);
  const stepOpacity = fi(stepLocalFrame, 0, STEP_DUR, 10, 10);

  const headerOpacity = fi(frame, 4, 400, 12);

  const stepContent = [
    <StepBranchInfo opacity={stepOpacity} />,
    <StepContact opacity={stepOpacity} label="Primary Contact Person" name="James Carter" email="james.carter@summitridge.com" phone="+1 (512) 555-0198" />,
    <StepContact opacity={stepOpacity} label="Secondary Contact Person" name="Laura Bennett" email="laura.bennett@summitridge.com" phone="+1 (512) 555-0173" />,
    <StepAbout opacity={stepOpacity} />,
    <StepDocuments opacity={stepOpacity} />,
  ][stepIdx];

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={0}>
          {/* No duplicate local sidebar here — AppWindow already renders the
              real onboarding-step sidebar (OnboardingSidebar) at activeStep=0,
              so this panel is the full-width content area only. */}
          <div style={{ padding: "18px 22px", position: "relative", height: "100%", boxSizing: "border-box" }}>
            <div style={{ opacity: headerOpacity, fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 10 }}>Add a Branch</div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: 16, opacity: headerOpacity }}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 78 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10.5, fontWeight: 700,
                      background: i < stepIdx ? "#1D4ED8" : "#fff",
                      color: i < stepIdx ? "#fff" : i === stepIdx ? "#1D4ED8" : "#9CA3AF",
                      border: i === stepIdx ? "2px solid #1D4ED8" : "1.5px solid #D1D5DB",
                    }}>{i < stepIdx ? "✓" : i + 1}</div>
                    <div style={{ fontSize: 9, color: i <= stepIdx ? "#111827" : "#9CA3AF", fontWeight: i === stepIdx ? 700 : 500, marginTop: 3, textAlign: "center" }}>{s}</div>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < stepIdx ? "#1D4ED8" : "#E5E7EB", marginTop: -12 }} />}
                </React.Fragment>
              ))}
            </div>

            {stepContent}
          </div>
      </AppWindow>
      <Label opacity={fi(frame, 240, 400, 15)} title="A guided setup, start to finish" sub="Branch info, contacts, bio & documents" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 3 — Existing branches / add another branch
// Panel centered, width 760. "+Add Another Branch" row content-relative
// (640, 238) → window-local (840, 326) → panX=-(840-740)*zoom, panY=-(326-410)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const SceneMultiBranch: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 14, 36, 118, 140], [1, 1.08, 1.5, 1.5, 1.08], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 14, 36, 118, 140], [0, -12, -150, -150, -12], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 14, 36, 118, 140], [0, 10, 126, 126, 10], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const row2Opacity = fi(frame, 34, 400, 12);
  const row2Y = interpolate(sp(frame, 34, fps), [0, 1], [16, 0]);

  const cursorOpacity = fi(frame, 46, 90, 8, 10);
  const cursorX = interpolate(frame, [46, 60], [900, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [46, 60], [30, 238], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const BRANCHES = [
    { name: "Downtown Learning Center", status: "Pending" },
    { name: "Riverside Learning Center", status: "Approved" },
  ];

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={0}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{
            width: 760, margin: "0 auto",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 1 }}>Add a Branch</div>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 18 }}>Create branches to organise your operations and students.</div>

            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: 16, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
                <span>Existing Branches</span><span style={{ color: "#6B7280", fontWeight: 500 }}>2 total</span>
              </div>
              {BRANCHES.map((b, i) => {
                const colors = STATUS_COLOR[b.status];
                const rowOpacity = i === 0 ? headerOpacity : row2Opacity;
                const rowY = i === 0 ? 0 : row2Y;
                return (
                  <div key={b.name} style={{
                    opacity: rowOpacity, transform: `translateY(${rowY}px)`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 13px", border: "1px solid #F3F4F6", borderRadius: 8, marginBottom: 8, background: "#FAFAFA",
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>🔀 {b.name}</span>
                    <span style={{ background: colors.bg, color: colors.fg, fontWeight: 700, borderRadius: 999, padding: "2px 11px", fontSize: 10.5 }}>{b.status}</span>
                  </div>
                );
              })}
              <div style={{ border: "1px dashed #CBD5E1", borderRadius: 8, textAlign: "center", padding: "8px 0", fontSize: 11.5, fontWeight: 700, color: "#374151", marginTop: 4 }}>
                + Add Another Branch
              </div>
            </div>
            <div style={{ marginTop: 14, background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 8, padding: "10px 0", fontSize: 12.5, fontWeight: 700 }}>Continue →</div>
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 95, 400, 15)} title="Run as many branches as you need" sub="Each with its own team, contacts & setup" tone="green" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 4 — Add an Instructor
// "Add Instructor" button, content-relative (152, 248) → window-local
// (352, 336) → panX=-(352-740)*zoom, panY=-(336-410)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const SceneAddInstructor: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 14, 34, 96, 118], [1, 1.1, 1.55, 1.55, 1.1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 14, 34, 96, 118], [0, 60, 601, 601, 60], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 14, 34, 96, 118], [0, 20, 115, 115, 20], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const field1 = fi(frame, 20, 400, 11);
  const field2 = fi(frame, 30, 400, 11);
  const field3 = fi(frame, 40, 400, 11);

  const cursorOpacity = fi(frame, 62, 96, 8, 10);
  const cursorX = interpolate(frame, [62, 76], [900, 152], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [62, 76], [40, 248], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [76, 94], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={1}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Add an Instructor</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 14 }}>Create an instructor profile to assign to sessions.</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 640 }}>
            <div style={{ opacity: field1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Full Name</div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>Dr. Sarah Mitchell</div>
            </div>
            <div style={{ opacity: field2 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Email</div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>sarah.mitchell@summitridge.com</div>
            </div>
          </div>
          <div style={{ opacity: field3, marginTop: 12, maxWidth: 640 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>About</div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 11.5, color: "#111827", background: "#F9FAFB", minHeight: 36 }}>
              15 years teaching full-stack development &amp; product design.
            </div>
          </div>
          <div style={{ opacity: field3, marginTop: 16, background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 8, padding: "10px 0", fontSize: 12.5, fontWeight: 700, maxWidth: 260 }}>
            Add Instructor →
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 60, 400, 15)} title="Add instructors in seconds" sub="Assign them to sessions right away" />
    </AbsoluteFill>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// SCENE 5 — Create a Session
// "Create Session" button, content-relative (140, 210) -> window-local
// (340, 298) -> panX=(540-140)*zoom, panY=(322-210)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const SceneCreateSession: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 14, 34, 96, 118], [1, 1.1, 1.35, 1.35, 1.1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 14, 34, 96, 118], [0, 56, 400 * 1.35 * 0.4, 400 * 1.35, 56], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 14, 34, 96, 118], [0, 16, 112 * 1.35 * 0.4, 112 * 1.35, 16], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const field1 = fi(frame, 20, 400, 11);
  const field2 = fi(frame, 30, 400, 11);

  const cursorOpacity = fi(frame, 62, 96, 8, 10);
  const cursorX = interpolate(frame, [62, 76], [900, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [62, 76], [40, 210], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [76, 94], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={2}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Create a Session</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 14 }}>Set up your first session to start running your programs.</div>

          <div style={{ opacity: field1, maxWidth: 260, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Session Name</div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>October Bootcamp</div>
          </div>
          <div style={{ opacity: field2, maxWidth: 260, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Starting Date</div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>📅 Oct 6, 2026</div>
          </div>
          <div style={{ opacity: field2, background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 8, padding: "10px 0", fontSize: 12.5, fontWeight: 700, maxWidth: 260 }}>
            Create Session →
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 60, 400, 15)} title="Launch your first session" sub="Name it, pick a date, and you're running" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 6 — Add a Category (optional)
// "Create Category" button, content-relative (140, 160) -> panX=(540-140)*zoom, panY=(322-160)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const SceneAddCategory: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 14, 34, 96, 118], [1, 1.08, 1.3, 1.3, 1.08], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 14, 34, 96, 118], [0, 43, 400 * 1.3 * 0.45, 400 * 1.3, 43], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 14, 34, 96, 118], [0, 27, 162 * 1.3 * 0.45, 162 * 1.3, 27], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const field1 = fi(frame, 20, 400, 11);

  const cursorOpacity = fi(frame, 60, 94, 8, 10);
  const cursorX = interpolate(frame, [60, 74], [900, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [60, 74], [40, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [74, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={3}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Add a Category</div>
            <span style={{ fontSize: 9, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 10 }}>Optional</span>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 14 }}>Organise your programs and courses into categories.</div>

          <div style={{ opacity: field1, maxWidth: 260, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Category Name</div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>Test Preparation</div>
          </div>
          <div style={{ opacity: field1, background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 8, padding: "10px 0", fontSize: 12.5, fontWeight: 700, maxWidth: 260, marginBottom: 8 }}>
            Create Category →
          </div>
          <div style={{ opacity: field1, color: "#6B7280", textAlign: "center", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 600, maxWidth: 260, border: "1px solid #E5E7EB" }}>
            Skip
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 58, 400, 15)} title="Stay organized, or skip it" sub="Categories are entirely optional" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 7 — Create a Role
// "All" permissions toggle flips on partway through, then "Create Role"
// button, content-relative (140, 340) -> panX=(540-140)*zoom, panY=(322-340)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const PERMISSION_GROUPS = ["Branch Management", "Chat", "Program", "Enrollment Test", "Staff Management", "Role Management"];

const SceneCreateRole: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 14, 34, 110, 132], [1, 1.05, 1.22, 1.22, 1.05], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 14, 34, 110, 132], [0, 46, 400 * 1.22 * 0.45, 400 * 1.22, 46], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 14, 34, 110, 132], [0, -3, -18 * 1.22 * 0.45, -18 * 1.22, -3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const field1 = fi(frame, 18, 400, 11);
  const gridOpacity = fi(frame, 30, 400, 11);
  // "All" toggle flips on around frame 58, permissions cascade blue shortly after.
  const allOn = interpolate(frame, [56, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cursorOpacity = fi(frame, 40, 96, 8, 10);
  const cursorX = interpolate(frame, [40, 56, 92], [900, 592, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [40, 56, 92], [40, 36, 340], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [92, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={4}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Create a Role</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>Define roles and permissions for your organisation staff.</div>

          <div style={{ display: "flex", gap: 14, opacity: field1, marginBottom: 10 }}>
            <div style={{ flex: 1, maxWidth: 260 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Role Name</div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#111827", background: "#F9FAFB" }}>Branch Manager</div>
            </div>
          </div>

          <div style={{ opacity: gridOpacity }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#111827" }}>Permissions</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>All</span>
                <div style={{ width: 28, height: 15, borderRadius: 8, background: allOn > 0.5 ? "#2563EB" : "#D1D5DB", position: "relative" }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: allOn > 0.5 ? 15 : 2 }} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxWidth: 720 }}>
              {PERMISSION_GROUPS.map(g => (
                <div key={g} style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "6px 9px" }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "#111827" }}>{g}</span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 9, color: "#6B7280" }}>View</span>
                    <div style={{ width: 20, height: 11, borderRadius: 6, background: allOn > 0.5 ? "#2563EB" : "#D1D5DB" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ opacity: gridOpacity, marginTop: 14, background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 8, padding: "10px 0", fontSize: 12.5, fontWeight: 700, maxWidth: 260 }}>
            Create Role →
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 78, 400, 15)} title="Exactly the access they need" sub="Toggle whole groups on with one switch" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 8 — Add Staff (optional)
// "Next step" button, content-relative (150, 140) -> panX=(540-150)*zoom, panY=(322-140)*zoom
// ═══════════════════════════════════════════════════════════════════════════
const SceneAddStaff: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 14, 34, 96, 118], [1, 1.08, 1.3, 1.3, 1.08], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 14, 34, 96, 118], [0, 42, 390 * 1.3 * 0.45, 390 * 1.3, 42], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 14, 34, 96, 118], [0, 24, 182 * 1.3 * 0.45, 182 * 1.3, 24], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const listOpacity = fi(frame, 20, 400, 11);

  const cursorOpacity = fi(frame, 60, 94, 8, 10);
  const cursorX = interpolate(frame, [60, 74], [900, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [60, 74], [40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [74, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={5}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Add Staff</div>
            <span style={{ fontSize: 9, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 10 }}>Optional</span>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 14 }}>Invite staff members and assign them roles.</div>

          <div style={{ opacity: listOpacity, border: "1px solid #E5E7EB", borderRadius: 9, padding: 13, maxWidth: 420, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6B7280", marginBottom: 9 }}>
              <span style={{ fontWeight: 700, color: "#111827" }}>Existing Staff</span><span>1 total</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#111827" }}>Michael Turner</div>
                <div style={{ fontSize: 10, color: "#6B7280" }}>michael.turner@summitridge.com</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, opacity: listOpacity }}>
            <div style={{ background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", textAlign: "center", borderRadius: 8, padding: "10px 22px", fontSize: 12.5, fontWeight: 700 }}>Next step →</div>
            <div style={{ color: "#111827", textAlign: "center", borderRadius: 8, padding: "10px 18px", fontSize: 12.5, fontWeight: 700, border: "1px solid #E5E7EB" }}>Add another</div>
          </div>
        </div>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
      </AppWindow>
      <Label opacity={fi(frame, 58, 400, 15)} title="Bring your team in" sub="Invite staff and assign them roles anytime" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 9 — Configure Menu Builder (optional). Camera-only push, no cursor.
// ═══════════════════════════════════════════════════════════════════════════
const MENU_ITEMS = ["Dashboard", "Courses", "Programs", "URL shortener", "Daily Log", "Team Track"];

const SceneConfigureMenu: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 16, 40, 100, 122], [1, 1.06, 1.16, 1.16, 1.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 16, 40, 100, 122], [0, 18, 140 * 1.16 * 0.5, 140 * 1.16, 18], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 16, 40, 100, 122], [0, 3, 22 * 1.16 * 0.5, 22 * 1.16, 3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={6}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Configure Menu Builder</div>
                <span style={{ fontSize: 9, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 10 }}>Optional</span>
              </div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Customise the navigation menu shown in your branch portal.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "6px 12px", fontSize: 10.5, fontWeight: 700, color: "#374151" }}>Choose from template</div>
              <div style={{ background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", boxShadow: "0 3px 10px #1D4ED84D", borderRadius: 7, padding: "6px 12px", fontSize: 10.5, fontWeight: 700 }}>Update menus</div>
            </div>
          </div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 9, maxWidth: 700 }}>
            {MENU_ITEMS.map((item, i) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
              }}>
                <span style={{ color: "#D1D5DB", fontSize: 12 }}>⠿</span>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: "#E5E7EB" }} />
                <span style={{ fontSize: 11.5, color: "#111827", flex: 1 }}>{item}</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "2px 9px", borderRadius: 10 }}>Page</span>
              </div>
            ))}
          </div>
        </div>
      </AppWindow>
      <Label opacity={fi(frame, 60, 400, 15)} title="Your navigation, your call" sub="Drag, rename & rearrange anytime" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 10 — Set Up an Integration (optional, last step). Camera-only push.
// ═══════════════════════════════════════════════════════════════════════════
const INTEGRATION_TABS = ["ChatGPT", "Zoom", "SendGrid", "Twilio", "Vimeo", "Payments"];

const SceneIntegration: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const zoom = interpolate(frame, [0, 16, 42, 130, 152], [1, 1.06, 1.18, 1.18, 1.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panX = interpolate(frame, [0, 16, 42, 130, 152], [0, 21, 140 * 1.18 * 0.5, 140 * 1.18, 21], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 16, 42, 130, 152], [0, 11, 72 * 1.18 * 0.5, 72 * 1.18, 11], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  const headerOpacity = fi(frame, 4, 400, 12);
  const panelOpacity = fi(frame, 24, 400, 11);
  const saveGlow = interpolate(frame, [90, 106, 122], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <SceneBg />
      <AppWindow zoom={zoom} panX={panX} panY={panY} activeStep={7}>
        <div style={{ position: "absolute", inset: 0, padding: 22, opacity: headerOpacity }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Set Up an Integration</div>
            <span style={{ fontSize: 9, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 10 }}>Optional</span>
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>Connect third-party tools like Zoom, Vimeo, or Twilio.</div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {INTEGRATION_TABS.map((t, i) => (
              <div key={t} style={{
                fontSize: 10.5, fontWeight: 700, padding: "6px 12px", borderRadius: 7,
                background: i === 0 ? "#1D4ED8" : "#fff", color: i === 0 ? "#fff" : "#374151",
                border: i === 0 ? "none" : "1px solid #E5E7EB",
              }}>{t}</div>
            ))}
          </div>

          <div style={{ opacity: panelOpacity, border: "1px solid #E5E7EB", borderRadius: 10, padding: 14, maxWidth: 460 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>API Key</div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 12, color: "#9CA3AF", background: "#F9FAFB", marginBottom: 10 }}>sk-••••••••••••••••••••</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Select Model</div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 11px", fontSize: 11.5, color: "#111827", background: "#F9FAFB", marginBottom: 12 }}>GPT-4o — flagship model</div>
            <div style={{
              background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", textAlign: "center", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 700,
              boxShadow: `0 3px 10px #1D4ED84D, 0 0 ${18 * saveGlow}px #1D4ED8${Math.round(saveGlow * 153).toString(16).padStart(2, "0")}`,
            }}>Save</div>
          </div>
        </div>
      </AppWindow>
      <Label opacity={fi(frame, 58, 400, 15)} title="Connect the tools you already use" sub="Zoom, SendGrid, Twilio & more — one click away" />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENE 11 — CTA
// ═══════════════════════════════════════════════════════════════════════════
const SceneOrgCTA: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleProg = sp(frame, 0, fps, { damping: 16, stiffness: 100 });
  const subOpacity = fi(frame, 20, 400, 18);
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ background: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <SceneBg />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,#1D4ED822 0%,transparent 70%)", opacity: glow }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 20px", border: "1px solid #1D4ED8",
          borderRadius: 100, background: "#1D4ED811", color: "#60A5FA", fontSize: 13, fontWeight: 600, letterSpacing: 1,
          marginBottom: 28, opacity: titleProg,
        }}>● ORGANIZATIONS · company.skillbnk.com</div>
        <div style={{
          fontSize: 76, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.05, opacity: titleProg,
          transform: `translateY(${interpolate(titleProg, [0, 1], [60, 0])}px)`, fontFamily: "system-ui, sans-serif",
        }}>
          One Account.{" "}
          <span style={{ background: "linear-gradient(135deg,#3B82F6,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Every Organization.
          </span>
        </div>
        <div style={{ marginTop: 44, display: "flex", justifyContent: "center", gap: 20, opacity: subOpacity }}>
          <div style={{ padding: "16px 48px", borderRadius: 12, background: "linear-gradient(135deg, #2E64F0, #1D4ED8)", color: "#fff", fontSize: 22, fontWeight: 700, boxShadow: "0 3px 10px #1D4ED84D, 0 0 40px #1D4ED866" }}>
            Try it at company.skillbnk.com →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── voice-over ────────────────────────────────────────────────────────────
// Generated by: bash generate-voice-orgs.sh (see generate-voice-orgs.py)
const VOICE_CLIPS = [
  { file: "ohook.mp3", from: 0     , dur: 244  },
  { file: "o0.mp3", from: 250   , dur: 123  },
  { file: "o1.mp3", from: 379   , dur: 188  },
  { file: "o2.mp3", from: 573   , dur: 328  },
  { file: "o3.mp3", from: 907   , dur: 173  },
  { file: "o4.mp3", from: 1086  , dur: 162  },
  { file: "o5.mp3", from: 1254  , dur: 157  },
  { file: "o6.mp3", from: 1417  , dur: 211  },
  { file: "o7.mp3", from: 1634  , dur: 226  },
  { file: "o8.mp3", from: 1866  , dur: 170  },
  { file: "o9.mp3", from: 2042  , dur: 178  },
  { file: "o10.mp3", from: 2226  , dur: 252  },
  { file: "o11.mp3", from: 2484  , dur: 204  },
];
// Timing is computed at runtime from the clip lengths above + the MAIN INTRO
// length (INTRO_FRAMES in SkillbnkIntroVideo.tsx), so re-voicing the intro
// re-times this video automatically.
const INTRO_INDEX = 1;
const TL = buildTimeline(VOICE_CLIPS, INTRO_INDEX, INTRO_FRAMES);
export const TOTAL_FRAMES = TL.total + OUTRO_FRAMES; // + shared MAIN OUTRO

const VoiceTrack: React.FC = () => (
  <>
    {VOICE_CLIPS.map(({ file, dur }, i) =>
      i === INTRO_INDEX ? null : (
        <Sequence key={file} from={TL.starts[i]} durationInFrames={dur}>
          <Audio src={staticFile(file)} volume={1} startFrom={0} />
        </Sequence>
      ),
    )}
  </>
);

// ─── root composition ─────────────────────────────────────────────────────
const SCENES: React.FC<{ frame: number; fps: number }>[] = [HookScene, (() => null) as React.FC<{ frame: number; fps: number }>, SceneOrgSwitcher, SceneAddBranch, SceneMultiBranch, SceneAddInstructor, SceneCreateSession, SceneAddCategory, SceneCreateRole, SceneAddStaff, SceneConfigureMenu, SceneIntegration, SceneOrgCTA];

export const OrgOnboardingVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }}>
      <VoiceTrack />
      {/* 🎬 Scenes (slot 1 = MAIN INTRO from SkillbnkIntroVideo.tsx) */}
      {SCENES.map((Scene, i) => (
        <Sequence key={i} from={TL.starts[i]} durationInFrames={TL.durs[i]}>
          {i === INTRO_INDEX ? <MainIntro /> : <Scene frame={frame - TL.starts[i]} fps={fps} />}
        </Sequence>
      ))}
      {/* 🎬 MAIN OUTRO (shared, from SkillbnkOutroVideo.tsx) */}
      <Sequence from={TL.total} durationInFrames={OUTRO_FRAMES}>
        <MainOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
