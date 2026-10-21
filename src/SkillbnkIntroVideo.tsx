import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ════════════════════════════════════════════════════════════════════════════
// MAIN INTRO — single source of truth for every video.
// Every composition plays this intro via <MainIntro />, so changing the visuals,
// voice or length HERE updates all videos at once.
//   • Re-voice it:  bash generate-voice-intro.sh   (patches the two values below)
// ════════════════════════════════════════════════════════════════════════════
export const INTRO_AUDIO = "intro/skillbnk-intro.mp3"; // auto-patched by generate-voice-intro.py
export const INTRO_FRAMES = 150; // 5s max — auto-patched by generate-voice-intro.py (never above 150)

// ─── skillBNK brand ───────────────────────────────────────────────────────────
// Deep near-black navy background (not the flat saturated brand blue) so the
// logo's own blue keeps contrast instead of blending into a same-hue field.
const BG_TOP = "#04060D";
const BG_BOTTOM = "#0A0E20";
const BLUE = "#2E5CF6";
const BLUE_LIGHT = "#7FA0FF";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

// The actual logo file, transparent PNG, natural size 3337x817 (~4.085:1).
const LOGO_W = 1360;
const LOGO_H = Math.round(LOGO_W / (3337 / 817)); // ≈ 333

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
  spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 130, mass: 0.8, ...config } });

// ─── drifting bokeh particles (subtle depth, not distracting) ────────────────
const PARTICLES = [
  { x: 260, y: 220, size: 5, speed: 0.55, delay: 0 },
  { x: 1720, y: 300, size: 4, speed: 0.4, delay: 12 },
  { x: 420, y: 780, size: 6, speed: 0.35, delay: 24 },
  { x: 1580, y: 800, size: 4, speed: 0.5, delay: 6 },
  { x: 960, y: 150, size: 3, speed: 0.6, delay: 18 },
  { x: 1180, y: 900, size: 5, speed: 0.42, delay: 30 },
];

const Particles: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <>
    {PARTICLES.map((p, i) => {
      const drift = Math.sin((frame - p.delay) / fps * p.speed * Math.PI) * 22;
      const opacity = fi(frame, p.delay, 400, 40) * interpolate(
        Math.sin((frame / fps) * 0.7 + i), [-1, 1], [0.15, 0.4],
      );
      return (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y + drift,
          width: p.size * 6, height: p.size * 6, borderRadius: "50%",
          background: `radial-gradient(circle, ${BLUE_LIGHT}99 0%, transparent 70%)`,
          opacity,
        }} />
      );
    })}
  </>
);

// ─── reusable visual scene (frame/fps-driven, no audio, no hooks) ───────────
export const SkillbnkIntroScene: React.FC<{ frame: number; fps: number; portrait?: boolean }> = ({ frame, fps, portrait = false }) => {
  const logoW = portrait ? 900 : LOGO_W;
  const logoH = Math.round(logoW / (3337 / 817));
  const bgOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // ── Logo reveal: cinematic left->right wipe, combined with a soft
  //    scale-settle and a focus-pull (blur -> sharp), instead of a flat fade.
  const revealProg = sp(frame, 4, fps, { damping: 26, stiffness: 60 });
  const revealPct = interpolate(revealProg, [0, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoScale = interpolate(revealProg, [0, 1], [0.93, 1]);
  const logoBlur = interpolate(revealProg, [0, 1], [10, 0], { extrapolateLeft: "clamp" });
  const logoOpacity = fi(frame, 4, 400, 10);

  // Soft glow that blooms in behind the logo as it settles.
  const glow = interpolate(revealProg, [0, 1], [0.1, 0.5]) * interpolate(
    Math.sin((frame / fps) * Math.PI * 0.7), [-1, 1], [0.75, 1],
  );

  // ── One-time diagonal light sweep across the logo, right after it lands.
  const sweepX = interpolate(frame, [44, 78], [-40, 140], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const sweepOpacity = interpolate(frame, [44, 54, 68, 78], [0, 0.55, 0.55, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Tagline: per-letter staggered reveal for an editorial, premium feel.
  const TAGLINE = "POWERING TRAINING PROVIDERS";
  const tagStart = 58;
  const tagGroupOpacity = fi(frame, tagStart, 400, 6);

  // Thin accent rule that draws itself under the tagline.
  const ruleWidth = interpolate(
    sp(frame, tagStart + 30, fps, { damping: 22, stiffness: 110 }), [0, 1], [0, 440],
  );
  const ruleOpacity = fi(frame, tagStart + 30, 400, 12);

  // Very slow "breathing" scale on the whole lockup for a premium, alive feel.
  const breathe = 1 + interpolate(
    Math.sin((frame / fps) * Math.PI * 0.35), [-1, 1], [0, 0.012],
  ) * fi(frame, 90, 400, 30);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${BG_TOP} 0%, ${BG_BOTTOM} 100%)`,
      opacity: bgOpacity,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Subtle grid for texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(#ffffff07 1px,transparent 1px),linear-gradient(90deg,#ffffff07 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }} />
      {/* Vignette for cinematic depth */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 45%, transparent 45%, #04060DCC 100%)",
      }} />

      <Particles frame={frame} fps={fps} />

      {/* Ambient brand-blue bloom behind the lockup */}
      <div style={{
        position: "absolute", width: 1200, height: 700, borderRadius: "50%",
        left: "50%", top: "45%", transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle, ${BLUE}30 0%, transparent 65%)`,
        opacity: glow,
      }} />

      <div style={{
        position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
        transform: `scale(${breathe})`,
      }}>
        {/* Actual logo file — wiped in left to right, with a focus-pull */}
        <div style={{
          position: "relative", width: logoW, height: logoH, overflow: "hidden",
          opacity: logoOpacity,
        }}>
          <div style={{
            width: logoW, height: logoH,
            clipPath: `inset(0 ${100 - revealPct}% 0 0)`,
            transform: `scale(${logoScale})`, transformOrigin: "center",
            filter: `blur(${logoBlur}px) drop-shadow(0 8px 26px rgba(0,0,0,0.55))`,
          }}>
            <Img
              src={staticFile("skillbnk-logo.png")}
              style={{ width: logoW, height: logoH, display: "block" }}
            />
          </div>
          {/* Light sweep, clipped to the logo's own bounding box */}
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${sweepX}%`, width: "24%",
            background: "linear-gradient(115deg, transparent 8%, rgba(255,255,255,0.9) 50%, transparent 92%)",
            opacity: sweepOpacity,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }} />
        </div>

        {/* Tagline — per-letter staggered reveal (two centered lines in portrait) */}
        <div style={{
          marginTop: 38, opacity: tagGroupOpacity, display: "flex",
          flexDirection: portrait ? "column" : "row", alignItems: "center",
        }}>
          {(portrait ? ["POWERING TRAINING", "PROVIDERS"] : [TAGLINE]).map((line, li, all) => {
            const offset = all.slice(0, li).reduce((n, l) => n + l.length + 1, 0);
            return (
              <div key={li} style={{ display: "flex", marginTop: li ? 6 : 0 }}>
                {Array.from(line).map((ch, i) => {
                  const letterProg = sp(frame, tagStart + (offset + i) * 1.1, fps, { damping: 22, stiffness: 170 });
                  const ly = interpolate(letterProg, [0, 1], [14, 0]);
                  const lo = Math.min(1, letterProg * 2.2);
                  return (
                    <span key={i} style={{
                      display: "inline-block",
                      fontSize: portrait ? 50 : 42, fontWeight: 800, color: "#E9ECF7",
                      letterSpacing: 4, textTransform: "uppercase",
                      fontFamily: FONT,
                      opacity: lo, transform: `translateY(${ly}px)`,
                      whiteSpace: "pre",
                    }}>{ch === " " ? "   " : ch}</span>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 18, height: 3, width: ruleWidth, opacity: ruleOpacity,
          background: `linear-gradient(90deg, transparent 0%, ${BLUE_LIGHT} 50%, transparent 100%)`,
        }} />
      </div>

    </AbsoluteFill>
  );
};

// ─── standalone composition (adds its own audio + frame/fps hooks) ─────────
export const SkillbnkIntroVideo: React.FC<{ portrait?: boolean }> = ({ portrait = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <SkillbnkIntroScene frame={frame} fps={fps} portrait={portrait} />
      <Audio src={staticFile(INTRO_AUDIO)} volume={1} startFrom={0} />
    </>
  );
};

// ─── drop-in intro for any composition (auto-scales from the 1920x1080 design
// to the composition's own width, fades out on its last 8 frames) ────────────
// Usage: <Sequence from={0} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
export const MainIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const scale = width / 1920;
  const opacity = interpolate(frame, [INTRO_FRAMES - 8, INTRO_FRAMES], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Portrait compositions (Reels / Shorts, e.g. 1080x1920): same intro re-laid out at full
  // size (smaller logo, two-line tagline) instead of a shrunken 16:9 slide. Landscape unchanged.
  if (height > width) {
    return (
      <AbsoluteFill style={{ opacity, overflow: "hidden", background: "#04060D" }}>
        <SkillbnkIntroVideo portrait />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", background: "#04060D" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
        transform: `scale(${scale})`, transformOrigin: "top left",
      }}>
        <SkillbnkIntroVideo />
      </div>
    </AbsoluteFill>
  );
};
