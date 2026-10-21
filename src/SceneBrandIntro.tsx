import React from "react";
import { AbsoluteFill, interpolate, spring, Easing } from "remotion";

// ─── skillBNK Brand Colors ───────────────────────────────────────────────────
const BLUE   = "#1B5EF7";  // "BNK" + blue chevron
const BLACK  = "#111111";  // "skill" text
const GRAY   = "#AAAAAA";  // gray chevron
const BG     = "#FFFFFF";  // clean white background

// ─── Chevron SVG (the ">>" double-arrow mark) ─────────────────────────────────
const Chevron: React.FC<{
  color: string;
  x: number;
  opacity: number;
  scale: number;
  size?: number;
}> = ({ color, x, opacity, scale, size = 90 }) => {
  const s = size;
  // Single chevron ">" as a thick angled path
  const pts = `
    M ${s * 0.15},${s * 0.05}
    L ${s * 0.85},${s * 0.5}
    L ${s * 0.15},${s * 0.95}
    L ${s * 0.15},${s * 0.75}
    L ${s * 0.58},${s * 0.5}
    L ${s * 0.15},${s * 0.25}
    Z
  `;
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: "50%",
      transform: `translateY(-50%) scale(${scale})`,
      opacity,
      transformOrigin: "left center",
    }}>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <path d={pts} fill={color} />
      </svg>
    </div>
  );
};

// ─── Animated Scene ──────────────────────────────────────────────────────────
// Total: 90 frames @ 30fps = 3s
//   0–18f  : BG flash + gray chevron shoots in from left
//   8–26f  : Blue chevron shoots in behind
//  20–38f  : "skill" text slides in
//  30–48f  : "BNK" text slides in (blue)
//  48–70f  : Tagline fades in
//  70–90f  : Hold / subtle breathe

export const SceneBrandIntro: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const sp = (start: number, cfg?: object) =>
    spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 150, mass: 0.7, ...cfg } });

  const fi = (from: number, to: number, dur = 16) =>
    interpolate(frame, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── BG flash from black → white ───────────────────────────────────────────
  const bgBrightness = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Gray chevron (left, larger) ────────────────────────────────────────────
  const gray1Prog = sp(2, { damping: 22, stiffness: 200 });
  const gray1X = interpolate(gray1Prog, [0, 1], [-200, 650]);
  const gray1Scale = interpolate(gray1Prog, [0, 0.3, 1], [1.4, 1.1, 1]);

  // ── Blue chevron (right, slightly smaller) ────────────────────────────────
  const blue1Prog = sp(6, { damping: 22, stiffness: 180 });
  const blue1X = interpolate(blue1Prog, [0, 1], [-200, 718]);
  const blue1Scale = interpolate(blue1Prog, [0, 0.3, 1], [1.3, 1.05, 1]);

  // ── "skill" text ──────────────────────────────────────────────────────────
  const skillProg = sp(18, { damping: 20, stiffness: 140 });
  const skillX = interpolate(skillProg, [0, 1], [-400, 0]);
  const skillOpacity = fi(18, 30, 10);

  // ── "BNK" text ────────────────────────────────────────────────────────────
  const bnkProg = sp(26, { damping: 20, stiffness: 120 });
  const bnkX = interpolate(bnkProg, [0, 1], [120, 0]);
  const bnkOpacity = fi(26, 38, 10);

  // ── Tagline ───────────────────────────────────────────────────────────────
  const tagOpacity = fi(48, 66, 18);
  const tagY = interpolate(
    spring({ frame: frame - 48, fps, config: { damping: 18, stiffness: 100 } }),
    [0, 1], [20, 0]
  );

  // ── Subtle scale breathe on hold ─────────────────────────────────────────
  const breathe = 1 + interpolate(
    Math.sin(((frame - 70) / fps) * Math.PI * 1.5),
    [-1, 1], [0, 0.008]
  ) * interpolate(frame, [68, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `rgb(${Math.round(bgBrightness * 255)}, ${Math.round(bgBrightness * 255)}, ${Math.round(bgBrightness * 255)})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>

      {/* Center content wrapper */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${breathe})`,
      }}>

        {/* Chevron container — absolute positioned within a sized box */}
        <div style={{ position: "relative", width: 1920, height: 180 }}>

          {/* Gray chevron */}
          <Chevron
            color={GRAY}
            x={gray1X}
            opacity={Math.min(1, gray1Prog * 3)}
            scale={gray1Scale}
            size={110}
          />
          {/* Blue chevron (slightly right, overlapping) */}
          <Chevron
            color={BLUE}
            x={blue1X}
            opacity={Math.min(1, blue1Prog * 3)}
            scale={blue1Scale}
            size={100}
          />

          {/* "skill" */}
          <div style={{
            position: "absolute",
            left: 810,
            top: "50%",
            transform: `translateY(-50%) translateX(${skillX}px)`,
            opacity: skillOpacity,
            display: "flex",
            alignItems: "baseline",
          }}>
            <span style={{
              fontSize: 110,
              fontWeight: 900,
              color: BLACK,
              letterSpacing: -3,
              lineHeight: 1,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}>skill</span>
          </div>

          {/* "BNK" */}
          <div style={{
            position: "absolute",
            left: 1010,
            top: "50%",
            transform: `translateY(-50%) translateX(${bnkX}px)`,
            opacity: bnkOpacity,
          }}>
            <span style={{
              fontSize: 110,
              fontWeight: 900,
              color: BLUE,
              letterSpacing: -3,
              lineHeight: 1,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}>BNK</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute",
        bottom: 300,
        left: 650,
        textAlign: "left",
        opacity: tagOpacity,
        transform: `translateY(${tagY}px)`,
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 500,
          color: "#555",
          letterSpacing: 4,
          textTransform: "uppercase",
          fontFamily: "-apple-system, sans-serif",
        }}>
          Powering Training Providers · skillbnk.com
        </div>
      </div>

      {/* Bottom accent bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 6,
        background: `linear-gradient(90deg, ${GRAY} 0%, ${BLUE} 50%, ${BLACK} 100%)`,
        opacity: fi(35, 50, 15),
      }} />
    </AbsoluteFill>
  );
};
