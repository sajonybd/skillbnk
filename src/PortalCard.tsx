import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// ════════════════════════════════════════════════════════════════════════════
// PortalCard — a short "poster" between scenes whenever the video switches portal
// (CEO feedback 2026-10-03: make Company / Training provider / Learner switches obvious,
// for single-institute AND multi-location viewers). No voice; 2 seconds.
// Wording rule: never say "branch" to viewers → "Training provider portal".
// ════════════════════════════════════════════════════════════════════════════
export const CARD_FRAMES = 60;
export type PortalKind = "company" | "provider" | "learner" | "website";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";
const INFO: Record<PortalKind, { title: string; url: string; who: string; icon: string; c: string }> = {
  company: { title: "Company portal", url: "company.skillbnk.com", who: "Head office · runs every location from one place", icon: "🏢", c: "#0284C7" },
  provider: { title: "Training provider portal", url: "branch.skillbnk.com", who: "Your academy or training team · where courses are built and run", icon: "🎯", c: "#4F46E5" },
  website: { title: "Your course page", url: "your public website", who: "Where new learners find a course and enroll", icon: "🌐", c: "#D97706" },
  learner: { title: "Learner portal", url: "portal.skillbnk.com", who: "Your learners · where they study, practice and track progress", icon: "🎓", c: "#059669" },
};
const ORDER: PortalKind[] = ["company", "provider", "learner"];
const NOTE: Record<PortalKind, string> = {
  website: "",
  company: "For multi-location organizations",
  provider: "Single academy? This is your main portal",
  learner: "Every learner gets their own",
};

export const PortalCard: React.FC<{ kind: PortalKind }> = ({ kind }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const inO = interpolate(f, [0, 8], [0, 1], cl);
  const outO = interpolate(f, [CARD_FRAMES - 8, CARD_FRAMES], [1, 0], cl);
  const pop = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 150, mass: 0.7 } });
  const i = INFO[kind];
  const sweep = interpolate(f, [0, 22], [-1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFFFFF 0%, #F4F6FB 55%, #EAEFF8 100%)", fontFamily: FONT, opacity: Math.min(inO, outO) }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(#0F172A0D 1.2px, transparent 1.2px)", backgroundSize: "28px 28px" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${i.c}26 0%, transparent 60%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 26, fontWeight: 800, letterSpacing: 6, color: "#94A3B8", transform: `translateX(${sweep * 80}px)` }}>NOW IN THE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", alignItems: "center", gap: 28, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop }}>
        <div style={{ width: 120, height: 120, borderRadius: 30, background: "#FFFFFF", border: `1px solid ${i.c}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 66, boxShadow: `0 20px 50px ${i.c}40, 0 2px 6px #0F172A14` }}>{i.icon}</div>
        <div>
          <div style={{ fontSize: 84, fontWeight: 900, color: "#0F172A", letterSpacing: -1, lineHeight: 1 }}>{i.title}</div>
          <div style={{ marginTop: 12, fontSize: 28, fontWeight: 700, color: i.c }}>{i.url}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontSize: 32, color: "#475569", fontWeight: 600, opacity: interpolate(f, [10, 20], [0, 1], cl) }}>{i.who}</div>
      {/* where this portal sits: Company → Training provider → Learner */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: interpolate(f, [14, 26], [0, 1], cl) }}>
        {ORDER.map((k, n) => {
          const on = k === kind;
          const x = INFO[k];
          return (
            <React.Fragment key={k}>
              <div style={{ width: 380, padding: "22px 20px", borderRadius: 20, textAlign: "center", background: on ? "#FFFFFF" : "rgba(255,255,255,0.55)", border: `${on ? 2 : 1}px solid ${on ? x.c : "#E2E8F0"}`, boxShadow: on ? `0 24px 60px ${x.c}38, 0 2px 8px #0F172A12` : "0 1px 3px #0F172A0A", transform: `scale(${on ? 1.06 : 0.96})` }}>
                <div style={{ fontSize: 40 }}>{x.icon}</div>
                <div style={{ marginTop: 6, fontSize: 26, fontWeight: 800, color: on ? "#0F172A" : "#94A3B8" }}>{x.title}</div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600, color: on ? x.c : "#A3AEC0" }}>{NOTE[k]}</div>
              </div>
              {n < 2 && <div style={{ fontSize: 40, color: "#CBD5E1", fontWeight: 900 }}>→</div>}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
