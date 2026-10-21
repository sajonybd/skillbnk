import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ════════════════════════════════════════════════════════════════════════════
// MAIN OUTRO — single source of truth for every video's closing card.
// Every composition ends with <MainOutro />, so changing the links, text,
// voice or length HERE updates all videos at once.
//   • Voice it:  bash generate-voice-outro.sh   (patches the two values below)
// ════════════════════════════════════════════════════════════════════════════
export const OUTRO_AUDIO = "outro/skillbnk-outro.mp3"; // auto-patched by generate-voice-outro.py ("" = silent until voiced)
export const OUTRO_FRAMES = 150; // 5s max — auto-patched by generate-voice-outro.py (never above 150)

export const OUTRO_HEADLINE = "Ready to get started?";
export const OUTRO_SUBLINE = "One platform for training, learning & operations.";

type LinkCard = { key: string; title: string; sub: string; primary?: boolean };
export const OUTRO_LINKS: LinkCard[] = [
  { key: "mail", title: "Email Us", sub: "hello@skillbnk.com" },
  { key: "web", title: "Explore skillBNK", sub: "skillbnk.com" },
  { key: "linkedin", title: "LinkedIn", sub: "company/skillbnk" },
  { key: "inquiry", title: "Talk to Us", sub: "skillbnk.com/inquiry", primary: true },
];

// ─── brand ───────────────────────────────────────────────────────────────────
const BG_TOP = "#04060D";
const BG_BOTTOM = "#0A0E20";
const BLUE = "#2E5CF6";
const INK = "#F1F5F9";
const MUTED = "#8A96B2";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
const LOGO_W = 520;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sp = (frame: number, start: number, fps: number, cfg: object = {}) =>
  spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 140, mass: 0.8, ...cfg } });

// ─── icons (inline SVG, no emoji — renders identically everywhere) ───────────
const Icon: React.FC<{ kind: string }> = ({ kind }) => {
  const c = { fill: "none", stroke: "#fff", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "mail")
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" {...c}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    );
  if (kind === "web")
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" {...c}>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4M7 9h10M7 12h6" />
      </svg>
    );
  if (kind === "linkedin")
    return (
      <svg width="34" height="34" viewBox="0 0 24 24">
        <text x="12" y="17" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="15" fill="#fff">in</text>
      </svg>
    );
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" {...c}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
};

// ─── reusable visual scene (1920x1080 design, frame/fps driven) ─────────────
export const SkillbnkOutroScene: React.FC<{ frame: number; fps: number; portrait?: boolean }> = ({ frame, fps, portrait = false }) => {
  const bg = interpolate(frame, [0, 12], [0, 1], clamp);
  const logo = sp(frame, 2, fps, { damping: 16 });
  const head = sp(frame, 12, fps);
  const sub = interpolate(frame, [22, 36], [0, 1], clamp);
  const glow = 0.7 + Math.sin((frame / fps) * Math.PI * 1.2) * 0.3;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${BG_TOP} 0%, ${BG_BOTTOM} 100%)`, opacity: bg,
        fontFamily: FONT, alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(#ffffff07 1px,transparent 1px),linear-gradient(90deg,#ffffff07 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        style={{
          position: "absolute", width: 1400, height: 800, left: "50%", top: "55%", transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle, ${BLUE}26 0%, transparent 65%)`,
        }}
      />

      <div style={{ position: "relative", width: portrait ? 940 : 1640, display: "flex", flexDirection: "column", alignItems: portrait ? "center" : undefined, textAlign: portrait ? "center" : undefined }}>
        <Img
          src={staticFile("skillbnk-logo.png")}
          style={{
            width: portrait ? 640 : LOGO_W, alignSelf: portrait ? "center" : "flex-start", opacity: logo,
            transform: `translateY(${interpolate(logo, [0, 1], [-30, 0])}px)`,
          }}
        />
        <div
          style={{
            marginTop: portrait ? 90 : 70, fontSize: portrait ? 92 : 64, fontWeight: 800, color: INK, letterSpacing: -1,
            opacity: head, transform: `translateY(${interpolate(head, [0, 1], [30, 0])}px)`,
          }}
        >
          {OUTRO_HEADLINE}
        </div>
        <div style={{ marginTop: 14, fontSize: portrait ? 36 : 28, fontWeight: 600, color: MUTED, opacity: sub }}>{OUTRO_SUBLINE}</div>

        <div style={{ marginTop: 56, display: "flex", gap: portrait ? 24 : 26, flexWrap: portrait ? "wrap" : "nowrap", width: portrait ? 940 : undefined }}>
          {OUTRO_LINKS.map((l, i) => {
            const p = sp(frame, 30 + i * 7, fps, { damping: 15 });
            return (
              <div
                key={l.key}
                style={{
                  flex: portrait ? "1 1 calc(50% - 12px)" : "1 1 0", minWidth: 0, height: portrait ? 290 : 250, borderRadius: 22, boxSizing: "border-box", padding: "34px 20px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: l.primary ? "linear-gradient(160deg, #3B4BF5 0%, #2A36E0 100%)" : "#1A2140",
                  border: `1px solid ${l.primary ? "#5B6BFF" : "#2C355C"}`,
                  boxShadow: l.primary ? `0 0 ${60 * glow}px #3B4BF588, 0 20px 50px #0008` : "0 20px 50px #0008",
                  opacity: p, transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 72, height: 72, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    background: l.primary ? "#ffffff2E" : "#3A4466",
                  }}
                >
                  <Icon kind={l.key} />
                </div>
                <div style={{ marginTop: 22, fontSize: portrait ? 38 : 32, fontWeight: 800, color: "#fff" }}>{l.title}</div>
                <div style={{ marginTop: 10, fontSize: portrait ? 28 : 23, fontWeight: 600, color: l.primary ? "#D6DBFF" : MUTED, textAlign: "center" }}>{l.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── standalone composition (own audio + hooks) ─────────────────────────────
export const SkillbnkOutroVideo: React.FC<{ portrait?: boolean }> = ({ portrait = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <SkillbnkOutroScene frame={frame} fps={fps} portrait={portrait} />
      {OUTRO_AUDIO ? <Audio src={staticFile(OUTRO_AUDIO)} volume={1} startFrom={0} /> : null}
    </>
  );
};

// ─── drop-in outro for any composition (auto-scales from 1920x1080 to the
// composition width, fades in on its first 8 frames) ─────────────────────────
// Usage: <Sequence from={X} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>
export const MainOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const scale = width / 1920;
  const opacity = interpolate(frame, [0, 8], [0, 1], clamp);
  // Portrait compositions (Reels / Shorts, e.g. 1080x1920) get the same card re-laid out
  // as a 2x2 grid at full size instead of a shrunken 16:9 slide. Landscape is unchanged.
  if (height > width) {
    return (
      <AbsoluteFill style={{ opacity, overflow: "hidden", background: "#04060D" }}>
        <SkillbnkOutroVideo portrait />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", background: "#04060D" }}>
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
          transform: `scale(${scale})`, transformOrigin: "top left",
        }}
      >
        <SkillbnkOutroVideo />
      </div>
    </AbsoluteFill>
  );
};
