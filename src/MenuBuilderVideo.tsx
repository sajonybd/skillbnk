import React from "react";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { buildTimeline } from "./timeline";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ─── ANIMATION HELPERS ───────────────────────────────────────────────────────
const sp = (frame: number, start: number, fps: number, config = {}) =>
  spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 120, mass: 0.8, ...config } });

const fi = (frame: number, from: number, to: number, inDur = 18, outDur = 0) => {
  const fadeIn = interpolate(frame, [from, from + inDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!outDur) return fadeIn;
  const fadeOut = interpolate(frame, [to - outDur, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(fadeIn, fadeOut);
};

// ─── REAL UI DATA ────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "🏆", label: "Leaderboard" },
  { icon: "👥", label: "Students Management", hasArrow: true },
  { icon: "📚", label: "Courses & Programs", hasArrow: true },
  { icon: "📄", label: "Content Management", hasArrow: true },
  { icon: "📞", label: "Communication", hasArrow: true },
  { icon: "✓", label: "Attendance", hasArrow: true },
  { icon: "📧", label: "Marketing Tools", hasArrow: true },
  { icon: "$", label: "Billing & Certificate", hasArrow: true },
  { icon: "👤", label: "Staff Management", hasArrow: true },
  { icon: "🤝", label: "B2B Client" },
  { icon: "☰", label: "Menu Builder", active: true },
  { icon: "🔗", label: "Integrations" },
  { icon: "⚙️", label: "Institute Settings" },
];

const MENU_ITEMS = [
  { icon: "⊞", label: "Dashboard", type: "Page" as const },
  { icon: "🏆", label: "Leaderboard", type: "Page" as const },
  { icon: "👥", label: "Students Management", type: "Folder" as const },
  { icon: "📚", label: "Courses & Programs", type: "Folder" as const },
  { icon: "📄", label: "Content Management", type: "Folder" as const },
  { icon: "📞", label: "Communication", type: "Folder" as const },
  { icon: "✓", label: "Attendance", type: "Folder" as const },
  { icon: "📧", label: "Marketing Tools", type: "Folder" as const },
  { icon: "$", label: "Billing & Certificate", type: "Folder" as const },
  { icon: "👤", label: "Staff Management", type: "Folder" as const },
  { icon: "🤝", label: "B2B Client", type: "Page" as const },
];

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

const TSLogo: React.FC = () => (
  <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 40, height: 40, background: "linear-gradient(135deg,#1D4ED8,#7C3AED)",
        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 900, fontSize: 14,
      }}>TS4U</div>
      <div>
        <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1 }}>LAND AN IT JOB!</div>
        <div style={{ fontSize: 12, color: "#1F2937", fontWeight: 700, lineHeight: 1.3 }}>TS4U IT Engineering</div>
        <div style={{ fontSize: 11, color: "#1F2937", lineHeight: 1 }}>Bootcamp</div>
      </div>
    </div>
  </div>
);

const Sidebar: React.FC<{ highlightItem?: string }> = ({ highlightItem }) => (
  <div style={{
    width: 200, background: "#fff", borderRight: "1px solid #E5E7EB",
    display: "flex", flexDirection: "column", height: "100%", flexShrink: 0,
  }}>
    <TSLogo />
    <div style={{ padding: "8px 0", overflowY: "auto", flex: 1 }}>
      {SIDEBAR_ITEMS.map(item => {
        const isActive = item.active || item.label === highlightItem;
        return (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 16px",
            background: isActive ? "#EFF6FF" : "transparent",
            borderLeft: isActive ? "3px solid #1D4ED8" : "3px solid transparent",
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, color: isActive ? "#1D4ED8" : "#6B7280", width: 18, textAlign: "center" }}>
              {item.icon}
            </span>
            <span style={{ fontSize: 12.5, color: isActive ? "#1D4ED8" : "#374151", fontWeight: isActive ? 600 : 400, flex: 1 }}>
              {item.label}
            </span>
            {item.hasArrow && <span style={{ fontSize: 10, color: "#9CA3AF" }}>›</span>}
          </div>
        );
      })}
    </div>
  </div>
);

const TopBar: React.FC = () => (
  <div style={{
    height: 52, background: "#fff", borderBottom: "1px solid #E5E7EB",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 20px", flexShrink: 0,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "5px 12px", border: "1px solid #E5E7EB", borderRadius: 6,
        fontSize: 12, color: "#374151",
      }}>
        <span style={{ fontSize: 11 }}>🌿</span>
        <span>Branch: TS4U IT Engineering Bootca...</span>
        <span style={{ fontSize: 10, color: "#9CA3AF" }}>▼</span>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button style={{
        padding: "6px 14px", background: "#1D4ED8", border: "none",
        borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>View Attendance</button>
      <button style={{
        padding: "6px 14px", background: "#fff", border: "1px solid #E5E7EB",
        borderRadius: 6, color: "#374151", fontSize: 12, cursor: "pointer",
      }}>📖 Branch Manual</button>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "linear-gradient(135deg,#1D4ED8,#7C3AED)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 700,
      }}>SA</div>
    </div>
  </div>
);

const Badge: React.FC<{ type: "Page" | "Folder" }> = ({ type }) => (
  <span style={{
    padding: "3px 12px", borderRadius: 6, fontSize: 13, fontWeight: 700,
    background: type === "Page" ? "#10B981" : "#F59E0B",
    color: "#fff",
  }}>{type}</span>
);

// Reusable pointer/cursor with an optional expanding click-ripple ring.
// x/y are in the SAME coordinate space as the app-window content it's
// placed inside (so it inherits that container's zoom/pan naturally).
// Bigger, bolder pointer — a soft white glow halo behind a large arrow with
// a thick white outline and a drop shadow, so it reads clearly at a glance
// (matches the big high-contrast cursor style used in the reference clip).
const Cursor: React.FC<{
  x: number; y: number; opacity: number; rippleT?: number;
}> = ({ x, y, opacity, rippleT }) => (
  <div style={{ position: "absolute", left: x - 5, top: y - 5, opacity, pointerEvents: "none", zIndex: 30 }}>
    {rippleT !== undefined && rippleT > 0 && rippleT < 1 && (
      <div style={{
        position: "absolute", left: 7 - 30 * rippleT, top: 7 - 30 * rippleT,
        width: 34 + 61 * rippleT, height: 34 + 61 * rippleT,
        borderRadius: "50%", border: "3px solid #1D4ED8",
        opacity: 1 - rippleT,
      }} />
    )}
    <div style={{
      position: "absolute", left: -10, top: -10, width: 64, height: 64,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
      filter: "blur(1px)",
    }} />
    <svg width="44" height="44" viewBox="0 0 24 24" fill="#1D4ED8" stroke="#fff" strokeWidth="2.4"
      style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))" }}>
      <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
    </svg>
  </div>
);

// ─── SCENE 1: APP REVEAL ─────────────────────────────────────────────────────
// 0-90f (3s): Full UI materializes, zooms in from slightly small
const SceneAppReveal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // ── Hook beat (0 - HOOK_UI_START): no app UI at all — a dark, premium
  // problem -> solution typographic moment ("stuck on a clunky LMS?" ->
  // "build your own nav in under 30 seconds") that earns attention before
  // the product is even shown. Everything below that references the app
  // window is timed off `uiFrame`, which only starts advancing once this
  // hook beat has mostly faded out, so the reveal begins after it.
  // Compressed to fit the new, much shorter s1 voice clip: hook now runs
  // ~165f (matches the trimmed hook narration), then a quick push toward
  // the sidebar (no slow return-to-wide — the scene cuts to MenuLoad next).
  const HOOK_UI_START = 165;
  const uiFrame = Math.max(0, frame - HOOK_UI_START);

  const problemOpacity = fi(frame, 8, 90, 15, 15);
  const problemY = interpolate(sp(frame, 8, fps), [0, 1], [24, 0]);
  const solutionOpacity = fi(frame, 85, 155, 15, 15);
  const solutionY = interpolate(sp(frame, 85, fps), [0, 1], [24, 0]);
  const tagOpacity = fi(frame, 130, 165, 12, 15);
  const tagScale = interpolate(sp(frame, 130, fps, { damping: 16, stiffness: 180 }), [0, 1], [0.85, 1]);
  const problemIconScale = interpolate(sp(frame, 4, fps, { damping: 14, stiffness: 170 }), [0, 1], [0.7, 1]);
  const solutionIconScale = interpolate(sp(frame, 82, fps, { damping: 12, stiffness: 200 }), [0, 1], [0.5, 1]);
  const hookGlow = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.6), [-1, 1], [0.15, 0.32],
  );
  // Locked-sidebar mockup: concrete evidence of the problem (a generic,
  // greyed-out menu you can't touch) instead of an abstract icon+chart.
  // A small denied-drag shake plays while the mockup is on screen.
  const mockupOpacity = fi(frame, 8, 90, 15, 15);
  const shakeGate = interpolate(frame, [22, 30, 58, 68], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame / 2.6) * 3 * shakeGate;
  const deniedOpacity = interpolate(frame, [26, 34, 56, 64], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // A quick push toward the sidebar's "Menu Builder" nav item — this is
  // what the video is about — then settles at a mild zoom as the scene
  // cuts to the next one. Sidebar item 11 sits at local window coords
  // ~(100,472); centering that requires this pan (scaled to the new peak).
  const zoom = interpolate(
    uiFrame, [0, 15, 45],
    [1, 2.0, 1.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    uiFrame, [0, 15, 45],
    [0, 1280, 831],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    uiFrame, [0, 15, 45],
    [0, -124, -80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const opacity = interpolate(uiFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const labelOpacity = fi(uiFrame, 35, 60, 12);
  const labelY = interpolate(sp(uiFrame, 35, fps), [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ background: "#0F172A", alignItems: "center", justifyContent: "center" }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.4,
      }} />

      {/* ── Hook: problem -> solution, no UI ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 42%, rgba(29,78,216,${hookGlow}) 0%, rgba(15,23,42,0) 60%)`,
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "40%", transform: "translate(-50%, -50%)",
        width: "82%", textAlign: "center",
      }}>
        {/* Problem: a concrete "locked sidebar" mockup — most platforms
            simply don't let you touch your own menu. A cursor tries to
            drag a row and gets shaken off / denied. */}
        <div style={{
          opacity: mockupOpacity, transform: `scale(${problemIconScale}) translateX(${shakeX}px)`,
          marginBottom: 16, display: "inline-block", position: "relative",
        }}>
          <div style={{
            width: 300, background: "#1E293B", border: "1px solid #334155",
            borderRadius: 12, padding: "14px 16px",
          }}>
            {[46, 64, 34, 54, 40].map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", opacity: 0.55 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: "#475569" }} />
                <div style={{ height: 8, borderRadius: 4, background: "#475569", width: w * 2 }} />
              </div>
            ))}
          </div>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
            background: "#0F172AD9", borderRadius: 12,
          }}>
            <span style={{ fontSize: 30 }}>🔒</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: "#F87171", background: "#7F1D1D33",
              border: "1px solid #7F1D1D", borderRadius: 999, padding: "4px 14px",
            }}>Not editable</span>
          </div>
          <div style={{
            position: "absolute", top: -14, right: -14, fontSize: 26,
            opacity: deniedOpacity, transform: "rotate(8deg)",
          }}>🚫</div>
        </div>
        <div style={{
          opacity: problemOpacity, transform: `translateY(${problemY}px)`,
          fontSize: 42, fontWeight: 800, color: "#CBD5E1", letterSpacing: 0.3, lineHeight: 1.3,
        }}>
          Most platforms lock down your menu.<br />You don't get to touch it.
        </div>

        {/* Solution: a clean glowing checkmark icon in brand blue */}
        <div style={{
          opacity: solutionOpacity, transform: `scale(${solutionIconScale})`,
          marginTop: 20, marginBottom: 8,
        }}>
          <svg width="68" height="68" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="34" fill="#1D4ED8" opacity="0.18" />
            <circle cx="36" cy="36" r="34" stroke="#60A5FA" strokeWidth="1.5" opacity="0.7" />
            <path d="M22 37 L31 46 L50 25" stroke="#60A5FA" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{
          opacity: solutionOpacity, transform: `translateY(${solutionY}px)`,
          fontSize: 54, fontWeight: 800, color: "#F8FAFC", letterSpacing: 0.3, lineHeight: 1.25,
        }}>
          <span style={{ color: "#60A5FA" }}>skillBNK</span> lets you customize it.<br />Build your own navigation in <span style={{ color: "#60A5FA" }}>60 seconds</span>.
        </div>
        <div style={{
          opacity: tagOpacity, transform: `scale(${tagScale})`,
          display: "inline-block", marginTop: 24,
          fontSize: 20, fontWeight: 700, color: "#1D4ED8", background: "#EFF6FF",
          padding: "8px 22px", borderRadius: 999, letterSpacing: 0.5,
        }}>
          That's it.
        </div>
      </div>

      {/* Browser window chrome */}
      <div style={{
        width: 1480, height: 820, borderRadius: 12,
        overflow: "hidden", boxShadow: "0 40px 120px #0004",
        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, opacity,
        border: "1px solid #334155",
      }}>
        {/* Browser chrome bar */}
        <div style={{
          height: 36, background: "#1E293B", display: "flex", alignItems: "center",
          padding: "0 14px", gap: 8, borderBottom: "1px solid #334155",
        }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          <div style={{
            flex: 1, maxWidth: 500, margin: "0 auto", background: "#0F172A",
            borderRadius: 6, padding: "3px 12px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 10, color: "#10B981" }}>🔒</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>
        {/* App UI */}
        <div style={{ display: "flex", height: "calc(100% - 36px)", background: "#F9FAFB" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TopBar />
            <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Menu Builder ⓘ</h1>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ padding: "7px 16px", border: "1px solid #1D4ED8", borderRadius: 7, color: "#1D4ED8", background: "#EFF6FF", fontSize: 12, fontWeight: 600 }}>
                    ⊞ Choose from template
                  </button>
                  <button style={{ padding: "7px 16px", border: "none", borderRadius: 7, color: "#fff", background: "#1D4ED8", fontSize: 12, fontWeight: 600 }}>
                    ↕ Update menus
                  </button>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: 16, maxWidth: 820, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Branch Community ⠿</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "5px 12px", background: "#EFF6FF", border: "1px solid #1D4ED8", borderRadius: 6, color: "#1D4ED8", fontSize: 11, fontWeight: 600 }}>+ Add New Folder</button>
                    <button style={{ padding: "5px 12px", background: "#FEF2F2", border: "1px solid #EF4444", borderRadius: 6, color: "#EF4444", fontSize: 11, fontWeight: 600 }}>Clear All</button>
                  </div>
                </div>
                {MENU_ITEMS.map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 18px", marginBottom: 6,
                    border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA",
                  }}>
                    <span style={{ color: "#D1D5DB", fontSize: 19 }}>⠿</span>
                    {item.type === "Folder" && <span style={{ color: "#9CA3AF", fontSize: 12 }}>›</span>}
                    <span style={{ fontSize: 21 }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: 18, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                    <Badge type={item.type} />
                    <span style={{ fontSize: 20, color: "#3B82F6", cursor: "pointer" }}>✏️</span>
                    <span style={{ fontSize: 20, color: "#EF4444", cursor: "pointer" }}>🗑</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 60, left: "50%", transform: `translateX(-50%) translateY(${labelY}px)`,
        opacity: labelOpacity, textAlign: "center",
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", letterSpacing: 1 }}>
          Menu Builder — Total navigation control
        </div>
        <div style={{ fontSize: 15, color: "#64748B", marginTop: 6 }}>skillbnk.com</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2: MENU LIST LOADS ─────────────────────────────────────────────────
// 90-225f (4.5s): Zoom into content area, rows load one by one with badges
const SceneMenuLoad: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Rows stagger in fast, then one quick, tight focus pass on the
  // edit/delete icons before settling — compressed for the new, much
  // shorter s2 voice clip (this scene is now "here's your organized nav
  // map at a glance", not a multi-step demo — editing gets its own scene).
  const zoom = interpolate(
    frame, [0, 20, 50, 90, 120, 150],
    [1, 1.15, 1.15, 2.2, 2.2, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    frame, [0, 20, 50, 90, 120, 150],
    [0, -40, -40, -911, -911, -40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    frame, [0, 20, 50, 90, 120, 150],
    [0, -35, -35, 396, 396, -35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const labelOpacity = fi(frame, 8, 40, 8);

  const cursorOpacity = fi(frame, 50, 95, 6, 8);
  const cursorX = interpolate(frame, [50, 60, 72, 80], [560, 724, 724, 760], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const cursorY = interpolate(frame, [50, 60], [20, 59], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const editRipple = interpolate(frame, [60, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const deleteRipple = interpolate(frame, [80, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorRipple = frame < 75 ? editRipple : deleteRipple;

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.4,
      }} />

      {/* App window with zoom */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
        width: 1480, height: 820, borderRadius: 12,
        overflow: "hidden", border: "1px solid #334155",
        boxShadow: "0 40px 120px #0004",
      }}>
        {/* Browser bar */}
        <div style={{ height: 36, background: "#1E293B", display: "flex", alignItems: "center", padding: "0 14px", gap: 8, borderBottom: "1px solid #334155" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          <div style={{ flex: 1, maxWidth: 500, margin: "0 auto", background: "#0F172A", borderRadius: 6, padding: "3px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#10B981" }}>🔒</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>
        <div style={{ display: "flex", height: "calc(100% - 36px)", background: "#F9FAFB" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TopBar />
            <div style={{ flex: 1, padding: 20, overflowY: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Menu Builder ⓘ</h1>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ padding: "7px 16px", border: "1px solid #1D4ED8", borderRadius: 7, color: "#1D4ED8", background: "#EFF6FF", fontSize: 12, fontWeight: 600 }}>⊞ Choose from template</button>
                  <button style={{ padding: "7px 16px", border: "none", borderRadius: 7, color: "#fff", background: "#1D4ED8", fontSize: 12, fontWeight: 600 }}>↕ Update menus</button>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: 16, maxWidth: 820, margin: "0 auto", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Branch Community ⠿</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "5px 12px", background: "#EFF6FF", border: "1px solid #1D4ED8", borderRadius: 6, color: "#1D4ED8", fontSize: 11, fontWeight: 600 }}>+ Add New Folder</button>
                    <button style={{ padding: "5px 12px", background: "#FEF2F2", border: "1px solid #EF4444", borderRadius: 6, color: "#EF4444", fontSize: 11, fontWeight: 600 }}>Clear All</button>
                  </div>
                </div>

                {MENU_ITEMS.map((item, i) => {
                  const rowDelay = 8 + i * 4;
                  const rowProg = sp(frame, rowDelay, fps, { damping: 20, stiffness: 140 });
                  const rowOpacity = fi(frame, rowDelay, 150, 8);
                  const badgeOpacity = fi(frame, rowDelay + 6, 150, 6);
                  return (
                    <div key={item.label} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 18px", marginBottom: 6,
                      border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA",
                      opacity: rowOpacity,
                      transform: `translateX(${interpolate(rowProg, [0, 1], [50, 0])}px)`,
                    }}>
                      <span style={{ color: "#D1D5DB", fontSize: 19 }}>⠿</span>
                      {item.type === "Folder" && <span style={{ color: "#9CA3AF", fontSize: 12 }}>›</span>}
                      <span style={{ fontSize: 21 }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: 18, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                      <span style={{ opacity: badgeOpacity }}>
                        <Badge type={item.type} />
                      </span>
                      <span style={{ fontSize: 20, color: "#3B82F6", opacity: rowOpacity }}>✏️</span>
                      <span style={{ fontSize: 20, color: "#EF4444", opacity: rowOpacity }}>🗑</span>
                    </div>
                  );
                })}
                <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={cursorRipple} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annotation label */}
      <div style={{
        position: "absolute", bottom: 55, left: "50%",
        transform: "translateX(-50%)", opacity: labelOpacity, textAlign: "center",
      }}>
        <div style={{
          background: "#1E293B", border: "1px solid #334155",
          borderRadius: 10, padding: "12px 28px",
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>11 menus. All visible. All organized.</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Page items link directly · Folders group sub-menus</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3: DRAG & DROP ────────────────────────────────────────────────────
// 225-345f (4s): Cursor grabs "Attendance", drags it above "Communication"
const SceneDragDrop: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // drag progress: 0→1 between frame 20-70, lifting the row up to its new slot
  const dragT = interpolate(frame, [20, 70], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Row height ~46px. Attendance (idx 6) moves up 2 positions to idx 4.
  const rowH = 46;
  const dropTargetY = -rowH * 2;

  // Settle: a spring that overshoots slightly past the drop target then
  // eases back to rest EXACTLY there (previously this interpolated back to
  // 0, i.e. undid the drag — which made the row appear to snap back on top
  // of the rows that had already shifted down, looking like a stuck stack).
  const settleSpring = sp(frame, 68, fps, { damping: 14, stiffness: 210, mass: 0.6 });
  const attendanceFinalY = dragT < 1
    ? interpolate(dragT, [0, 1], [0, dropTargetY])
    : Math.max(
        interpolate(settleSpring, [0, 1], [dropTargetY * 0.9, dropTargetY], {
          extrapolateLeft: "clamp",
        }),
        dropTargetY, // never let the settle bounce push it PAST the slot (would overlap the row above)
      );

  // Cursor position (in app-space px, relative to menu list)
  const cursorX = 450;
  const cursorBaseY = 320 + 6 * rowH + rowH / 2; // row 6 center
  const cursorY = cursorBaseY + attendanceFinalY;

  // Cursor appears at frame 8, and releases (fades) once the row has landed
  const cursorOpacity = fi(frame, 8, 140, 10, 15);
  const labelOpacity = fi(frame, 95, 120, 18);

  // Wide framing, then a hard focus push-in that tracks the row being
  // dragged (frames ~12-100, covering grab through settle), then eases
  // back out to the wide framing for the rest of the scene.
  const zoom = interpolate(
    frame, [0, 12, 100, 140],
    [1.2, 1.8, 1.8, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    frame, [0, 12, 100, 140],
    [-50, -180, -180, -50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    frame, [0, 12, 100, 140],
    [-40, -97, -97, -40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.4,
      }} />

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
        width: 1480, height: 820, borderRadius: 12,
        overflow: "hidden", border: "1px solid #334155",
        boxShadow: "0 40px 120px #0004",
      }}>
        <div style={{ height: 36, background: "#1E293B", display: "flex", alignItems: "center", padding: "0 14px", gap: 8, borderBottom: "1px solid #334155" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          <div style={{ flex: 1, maxWidth: 500, margin: "0 auto", background: "#0F172A", borderRadius: 6, padding: "3px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#10B981" }}>🔒</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>
        <div style={{ display: "flex", height: "calc(100% - 36px)", background: "#F9FAFB" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TopBar />
            <div style={{ flex: 1, padding: 20, overflowY: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Menu Builder ⓘ</h1>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ padding: "7px 16px", border: "1px solid #1D4ED8", borderRadius: 7, color: "#1D4ED8", background: "#EFF6FF", fontSize: 12, fontWeight: 600 }}>⊞ Choose from template</button>
                  <button style={{ padding: "7px 16px", border: "none", borderRadius: 7, color: "#fff", background: "#1D4ED8", fontSize: 12, fontWeight: 600 }}>↕ Update menus</button>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: 16, maxWidth: 820, margin: "0 auto", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Branch Community ⠿</span>
                </div>
                {MENU_ITEMS.map((item, i) => {
                  const isDragged = item.label === "Attendance";
                  const translateY = isDragged ? attendanceFinalY : 0;
                  // Other rows shift down to fill the gap when dragged item passes
                  const shiftDown = !isDragged && i >= 4 && i < 6
                    ? interpolate(dragT, [0, 1], [0, rowH])
                    : 0;
                  // "Picked up" styling only shows while actively dragging/settling —
                  // reverts to a normal row once dropped, instead of staying
                  // highlighted (and visually crowding its neighbors) forever.
                  const isActiveDrag = isDragged && frame < 108;

                  return (
                    <div key={item.label} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      height: 40, padding: "0 14px", marginBottom: 6,
                      border: isActiveDrag ? "1.5px dashed #1D4ED8" : "1px solid #E5E7EB",
                      borderRadius: 8,
                      background: isActiveDrag ? "#EFF6FF" : "#FAFAFA",
                      transform: `translateY(${translateY + shiftDown}px)`,
                      boxShadow: isActiveDrag && dragT > 0.05 ? "0 3px 10px #1D4ED84D" : "none",
                      zIndex: isDragged ? 10 : 0,
                      position: "relative",
                      cursor: isActiveDrag ? "grabbing" : "grab",
                    }}>
                      <span style={{ color: isActiveDrag ? "#1D4ED8" : "#D1D5DB", fontSize: 19 }}>⠿</span>
                      {item.type === "Folder" && <span style={{ color: "#9CA3AF", fontSize: 12 }}>›</span>}
                      <span style={{ fontSize: 21 }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: 16, color: isActiveDrag ? "#1D4ED8" : "#1F2937", fontWeight: isActiveDrag ? 600 : 500 }}>{item.label}</span>
                      <Badge type={item.type} />
                      <span style={{ fontSize: 20, color: "#3B82F6" }}>✏️</span>
                      <span style={{ fontSize: 20, color: "#EF4444" }}>🗑</span>
                    </div>
                  );
                })}

                {/* Cursor SVG */}
                <div style={{
                  position: "absolute",
                  left: cursorX - 200,
                  top: cursorY - 80,
                  opacity: cursorOpacity,
                  pointerEvents: "none",
                  zIndex: 20,
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1D4ED8" stroke="#fff" strokeWidth="1.5">
                    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 55, left: "50%",
        transform: "translateX(-50%)", opacity: labelOpacity, textAlign: "center",
      }}>
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "12px 28px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Drag & drop to reorder — instantly</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>No saving required · Changes reflect live</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4: EDIT MODAL ──────────────────────────────────────────────────────
// 345-465f (4s): Pencil icon clicked, Edit Menu modal slides in
const SceneEditModal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Camera pushes in toward the first row's edit icon, arriving right as the
  // cursor clicks it — then holds at the same safe bounds used elsewhere
  // (zoom 1.12 / pan -100,-50 never clips the 1480x820 window off-screen).
  // Wide, then push toward the pencil icon as it's clicked (0-18), then a
  // hard focus zoom onto the Edit Menu modal itself once it's open
  // (45-170), before releasing back to the wide framing.
  // Timings compressed to fit the new, shorter s4 voice clip.
  const zoom = interpolate(
    frame, [0, 13, 33, 124, 146],
    [1, 1.2, 1.9, 1.9, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    frame, [0, 13, 33, 124, 146],
    [0, -50, -190, -190, -50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    frame, [0, 13, 33, 124, 146],
    [0, -40, -84, -84, -40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  // Cursor travels down to the pencil icon and clicks at frame ~12
  const cursorOpacity = fi(frame, 0, 31, 7, 9);
  const cursorX = interpolate(frame, [0, 12], [1150, 724], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [0, 12], [5, 23], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [12, 29], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Modal appears right after the click
  const modalProg = sp(frame, 16, fps, { damping: 22, stiffness: 130 });
  const modalOpacity = fi(frame, 16, 84, 11);
  const modalY = interpolate(modalProg, [0, 1], [60, 0]);

  // Fields stagger
  const field1 = fi(frame, 27, 84, 11);
  const field2 = fi(frame, 36, 84, 11);
  const field3 = fi(frame, 46, 84, 11);
  const field4 = fi(frame, 55, 84, 11);

  // Second cursor: once the fields are filled in, it moves to "Save" and
  // clicks it — the form-submit beat that was missing a pointer.
  const saveCursorOpacity = fi(frame, 79, 139, 7, 11);
  const saveCursorX = interpolate(frame, [79, 92], [850, 659], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const saveCursorY = interpolate(frame, [79, 92], [140, 204], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const saveRipple = interpolate(frame, [92, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const savePress = interpolate(saveRipple, [0, 0.3, 0.6, 1], [1, 1.15, 0.9, 1]);

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.4,
      }} />

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
        width: 1480, height: 820, borderRadius: 12,
        overflow: "hidden", border: "1px solid #334155",
        boxShadow: "0 40px 120px #0004",
      }}>
        <div style={{ height: 36, background: "#1E293B", display: "flex", alignItems: "center", padding: "0 14px", gap: 8, borderBottom: "1px solid #334155" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          <div style={{ flex: 1, maxWidth: 500, margin: "0 auto", background: "#0F172A", borderRadius: 6, padding: "3px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#10B981" }}>🔒</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>

        <div style={{ display: "flex", height: "calc(100% - 36px)", background: "#F9FAFB", position: "relative" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TopBar />
            <div style={{ flex: 1, padding: 20, overflowY: "hidden", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Menu Builder ⓘ</h1>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: 16, maxWidth: 820, margin: "0 auto", position: "relative" }}>
                {MENU_ITEMS.map((item, i) => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 18px", marginBottom: 6,
                    border: i === 0 ? "1.5px solid #1D4ED8" : "1px solid #E5E7EB",
                    borderRadius: 8, background: i === 0 ? "#EFF6FF" : "#FAFAFA",
                  }}>
                    <span style={{ color: "#D1D5DB", fontSize: 19 }}>⠿</span>
                    <span style={{ fontSize: 21 }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: 18, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                    <Badge type={item.type} />
                    <span style={{
                      fontSize: 18, cursor: "pointer",
                      color: i === 0 ? "#1D4ED8" : "#3B82F6",
                      transform: i === 0 ? `scale(${interpolate(clickRipple, [0, 0.3, 0.6, 1], [1, 1.4, 0.9, 1])})` : "scale(1)",
                      display: "inline-block",
                    }}>✏️</span>
                    <span style={{ fontSize: 20, color: "#EF4444" }}>🗑</span>
                  </div>
                ))}
                <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
              </div>

              <Cursor x={saveCursorX} y={saveCursorY} opacity={saveCursorOpacity} rippleT={saveRipple} />

              {/* Overlay backdrop */}
              <div style={{
                position: "absolute", inset: -20,
                background: "#00000033",
                opacity: modalOpacity,
              }} />

              {/* Edit Modal */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: `translate(-50%, calc(-50% + ${modalY}px))`,
                width: 500, background: "#fff",
                borderRadius: 12, padding: 28,
                boxShadow: "0 20px 60px #0004",
                opacity: modalOpacity,
                border: "1px solid #E5E7EB",
              }}>
                {/* Modal header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Edit Menu</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "6px 16px", background: "#1D4ED8", border: "none", borderRadius: 7, color: "#fff", fontSize: 13, fontWeight: 600, transform: `scale(${savePress})`, display: "inline-block" }}>Save</button>
                    <button style={{ padding: "6px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 7, color: "#EF4444", fontSize: 13, fontWeight: 600 }}>Cancel</button>
                    <button style={{ width: 32, height: 32, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 7, color: "#6B7280", fontSize: 14 }}>⤢</button>
                    <button style={{ width: 32, height: 32, background: "#EF4444", border: "none", borderRadius: "50%", color: "#fff", fontSize: 14, fontWeight: 700 }}>✕</button>
                  </div>
                </div>

                {/* Fields */}
                <div style={{ opacity: field1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Menu Name</label>
                  <input readOnly value="Dashboard" style={{
                    width: "100%", padding: "9px 14px", border: "1.5px solid #1D4ED8",
                    borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box",
                    background: "#fff",
                  }} />
                </div>
                <div style={{ opacity: field2, marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Menu Slug</label>
                  <input readOnly value="dashboard" style={{
                    width: "100%", padding: "9px 14px", border: "1px solid #E5E7EB",
                    borderRadius: 8, fontSize: 14, color: "#6B7280", outline: "none", boxSizing: "border-box",
                    background: "#F9FAFB",
                  }} />
                </div>
                <div style={{ opacity: field3, marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Page Title</label>
                  <input readOnly value="Activity Monitoring" style={{
                    width: "100%", padding: "9px 14px", border: "1px solid #E5E7EB",
                    borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box",
                    background: "#fff",
                  }} />
                </div>
                <div style={{ opacity: field4, marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Page Subtitle</label>
                  <input readOnly value="High-Level Operational Oversight" style={{
                    width: "100%", padding: "9px 14px", border: "1px solid #E5E7EB",
                    borderRadius: 8, fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box",
                    background: "#fff",
                  }} />
                </div>
                <div style={{ opacity: field4, marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
                  <button style={{ padding: "9px 18px", background: "#1D4ED8", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600 }}>Select Icon</button>
                  <div style={{ width: 38, height: 38, border: "1px solid #E5E7EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontSize: 20 }}>⊞</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 55, left: "50%",
        transform: "translateX(-50%)",
        opacity: fi(frame, 90, 120, 18),
        textAlign: "center",
      }}>
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "12px 28px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Rename, re-title, change icon — per menu</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Menu Name · Slug · Page Title · Subtitle · Icon</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5: TEMPLATE PICKER ────────────────────────────────────────────────
// 465-555f (3s): "Choose from template" button highlighted, cards slide in
const SceneTemplates: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const btnPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 3), [-1, 1], [1, 1.04]
  );
  const overlayOpacity = fi(frame, 12, 73, 15);
  const card1 = sp(frame, 18, fps);
  const card2 = sp(frame, 28, fps);
  const card3 = sp(frame, 37, fps);

  const TEMPLATES = [
    { name: "Standard", items: 10, desc: "Full admin navigation", active: true },
    { name: "Minimal", items: 6, desc: "Core features only", active: false },
    { name: "Advanced", items: 14, desc: "All modules included", active: false },
  ];

  // Wide, then a mild push as the cursor clicks "Choose from template"
  // (0-16), then a hard focus zoom onto the highlighted "Standard" template
  // card once the picker panel has settled (50-300), before releasing.
  // Hold shortened to fit the new, shorter s5 voice clip.
  const zoom = interpolate(
    frame, [0, 13, 32, 142, 166],
    [1, 1.1, 1.8, 1.8, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    frame, [0, 13, 32, 142, 166],
    [0, 0, 225, 225, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    frame, [0, 13, 32, 142, 166],
    [0, 0, -79, -79, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const cursorOpacity = fi(frame, 0, 34, 8, 10);
  const cursorX = interpolate(frame, [0, 10], [780, 930], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [0, 10], [-10, 15], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Second cursor: once the picker panel is open, it moves to and clicks
  // the highlighted "Standard" card — the "choose a template" beat that
  // was missing a pointer.
  const chooseCursorOpacity = fi(frame, 47, 113, 8, 12);
  const chooseCursorX = interpolate(frame, [47, 62], [550, 415], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const chooseCursorY = interpolate(frame, [47, 62], [300, 366], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const chooseRipple = interpolate(frame, [62, 79], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const choosePress = interpolate(chooseRipple, [0, 0.3, 0.6, 1], [1, 1.05, 0.97, 1]);

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.4,
      }} />

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
        width: 1480, height: 820, borderRadius: 12,
        overflow: "hidden", border: "1px solid #334155",
        boxShadow: "0 40px 120px #0004",
      }}>
        <div style={{ height: 36, background: "#1E293B", display: "flex", alignItems: "center", padding: "0 14px", gap: 8, borderBottom: "1px solid #334155" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          <div style={{ flex: 1, maxWidth: 500, margin: "0 auto", background: "#0F172A", borderRadius: 6, padding: "3px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#10B981" }}>🔒</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>

        <div style={{ display: "flex", height: "calc(100% - 36px)", background: "#F9FAFB", position: "relative" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <TopBar />
            <div style={{ flex: 1, padding: 20, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Menu Builder ⓘ</h1>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{
                    padding: "7px 16px", border: "1.5px solid #1D4ED8", borderRadius: 7,
                    color: "#1D4ED8", background: "#EFF6FF", fontSize: 12, fontWeight: 600,
                    transform: `scale(${btnPulse})`,
                    boxShadow: `0 0 ${interpolate(btnPulse, [1, 1.04], [0, 12])}px #1D4ED866`,
                  }}>⊞ Choose from template</button>
                  <button style={{ padding: "7px 16px", border: "none", borderRadius: 7, color: "#fff", background: "#1D4ED8", fontSize: 12, fontWeight: 600 }}>↕ Update menus</button>
                </div>
              </div>

              <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
              <Cursor x={chooseCursorX} y={chooseCursorY} opacity={chooseCursorOpacity} rippleT={chooseRipple} />

              {/* Dimmed list behind */}
              <div style={{ opacity: 0.3 }}>
                {MENU_ITEMS.slice(0, 5).map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", marginBottom: 6, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff" }}>
                    <span style={{ fontSize: 21 }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: 18, color: "#1F2937" }}>{item.label}</span>
                    <Badge type={item.type} />
                  </div>
                ))}
              </div>

              {/* Template overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "#00000022",
                opacity: overlayOpacity,
              }} />

              {/* Template picker panel */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 720, background: "#fff",
                borderRadius: 14, padding: 32,
                boxShadow: "0 20px 60px #0003",
                opacity: overlayOpacity,
                border: "1px solid #E5E7EB",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Choose a template</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>Pre-organized menus ready to apply</p>
                  </div>
                  <button style={{ width: 30, height: 30, background: "#EF4444", border: "none", borderRadius: "50%", color: "#fff", fontSize: 14, fontWeight: 700 }}>✕</button>
                </div>

                <div style={{ display: "flex", gap: 18 }}>
                  {TEMPLATES.map(({ name, items, desc, active }, i) => {
                    const prog = [card1, card2, card3][i];
                    return (
                      <div key={name} style={{
                        flex: 1, border: `2px solid ${active ? "#1D4ED8" : "#E5E7EB"}`,
                        borderRadius: 12, padding: "22px 18px", cursor: "pointer",
                        background: active ? "#EFF6FF" : "#FAFAFA",
                        transform: `translateY(${interpolate(prog, [0, 1], [30, 0])}px) scale(${active ? choosePress : 1})`,
                        opacity: prog,
                      }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: active ? "#1D4ED8" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>
                          {active ? "✓" : "⊞"}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: active ? "#1D4ED8" : "#1F2937", marginBottom: 6 }}>{name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>{desc}</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>{items} menu items</div>
                        {active && (
                          <div style={{ marginTop: 14, padding: "6px 0", background: "#1D4ED8", borderRadius: 7, color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                            ✓ Applied
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 55, left: "50%",
        transform: "translateX(-50%)",
        opacity: fi(frame, 57, 73, 15),
        textAlign: "center",
      }}>
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "12px 28px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Premade templates — pick one, done</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Standard · Minimal · Advanced layouts ready to go</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 6: CTA ─────────────────────────────────────────────────────────────
// 555-600f (1.5s)
const SceneCTA: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleProg = sp(frame, 0, fps, { damping: 16, stiffness: 100 });
  const subtitleOpacity = fi(frame, 20, 45, 18);
  const glow = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{
      background: "#0F172A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.3,
      }} />
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle,#1D4ED822 0%,transparent 70%)",
        opacity: glow,
      }} />

      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 20px", border: "1px solid #1D4ED8",
          borderRadius: 100, background: "#1D4ED811",
          color: "#60A5FA", fontSize: 13, fontWeight: 600,
          letterSpacing: 1, marginBottom: 28,
          opacity: titleProg,
        }}>
          ● MENU BUILDER · skillbnk.com
        </div>
        <div style={{
          fontSize: 88, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.05,
          opacity: titleProg,
          transform: `translateY(${interpolate(titleProg, [0, 1], [60, 0])}px)`,
          fontFamily: "system-ui, sans-serif",
        }}>
          Clean.{" "}
          <span style={{ background: "linear-gradient(135deg,#3B82F6,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Flexible.
          </span>
          <br />Yours.
        </div>
        <div style={{
          marginTop: 44, display: "flex", justifyContent: "center", gap: 20,
          opacity: subtitleOpacity,
        }}>
          <div style={{
            padding: "16px 48px", borderRadius: 12, background: "#1D4ED8",
            color: "#fff", fontSize: 22, fontWeight: 700,
            boxShadow: "0 0 40px #1D4ED866",
          }}>Try it at skillbnk.com →</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};


// ─── SCENE 5b: SUB-MENU EXPANSION ───────────────────────────────────────────
const SceneSubMenu: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const SUB_ITEMS = [
    { icon: "➕", label: "Add Student" },
    { icon: "📋", label: "Students List" },
    { icon: "📊", label: "Progress Report" },
    { icon: "✅", label: "Attendance History" },
  ];
  const arrowRotate = interpolate(frame, [11, 28], [0, 90], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelOpacity = fi(frame, 57, 99, 14);
  // Camera pushes in toward the folder row, arriving as the cursor clicks
  // its chevron to expand it — safe bounds match SceneMenuLoad/SceneDragDrop.
  // Wide, then push toward the folder chevron as it's clicked (0-16), then
  // a hard focus zoom onto the fully-expanded sub-menu list (45-300),
  // before releasing back to the wide framing.
  // Hold shortened to fit the new, shorter s6 voice clip.
  const zoom = interpolate(
    frame, [0, 11, 28, 135, 156],
    [1, 1.2, 1.7, 1.7, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    frame, [0, 11, 28, 135, 156],
    [0, -50, -170, -170, -50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    frame, [0, 11, 28, 135, 156],
    [0, -40, 43, 43, -40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const cursorOpacity = fi(frame, 0, 30, 7, 9);
  const cursorX = interpolate(frame, [0, 10], [150, 32], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [0, 10], [40, 113], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",backgroundSize:"60px 60px",opacity:0.4 }} />
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:`translate(calc(-50% + ${panX}px),calc(-50% + ${panY}px)) scale(${zoom})`,width:1480,height:820,borderRadius:12,overflow:"hidden",border:"1px solid #334155",boxShadow:"0 40px 120px #0004" }}>
        <div style={{ height:36,background:"#1E293B",display:"flex",alignItems:"center",padding:"0 14px",gap:8,borderBottom:"1px solid #334155" }}>
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#EF4444" }} />
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#F59E0B" }} />
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#10B981" }} />
          <div style={{ flex:1,maxWidth:500,margin:"0 auto",background:"#0F172A",borderRadius:6,padding:"3px 12px",display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ fontSize:10,color:"#10B981" }}>🔒</span>
            <span style={{ fontSize:11,color:"#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>
        <div style={{ display:"flex",height:"calc(100% - 36px)",background:"#F9FAFB" }}>
          <Sidebar />
          <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
            <TopBar />
            <div style={{ flex:1,padding:20,overflowY:"hidden" }}>
              <h1 style={{ margin:"0 0 20px",fontSize:20,fontWeight:700,color:"#111827" }}>Menu Builder ⓘ</h1>
              <div style={{ background:"#fff",borderRadius:10,border:"1px solid #E5E7EB",padding: 16, maxWidth: 820, margin: "0 auto",position:"relative" }}>
                {MENU_ITEMS.slice(0,2).map(item => (
                  <div key={item.label} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 18px",marginBottom:6,border:"1px solid #E5E7EB",borderRadius:8,background:"#FAFAFA" }}>
                    <span style={{ color:"#D1D5DB",fontSize: 19 }}>⠿</span><span style={{ fontSize: 21 }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: 18,color:"#1F2937",fontWeight:500 }}>{item.label}</span><Badge type={item.type} />
                  </div>
                ))}
                {/* Expanded folder */}
                <div style={{ border:"1.5px solid #1D4ED8",borderRadius:8,background:"#EFF6FF",marginBottom:6,overflow:"hidden" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 18px" }}>
                    <span style={{ color:"#D1D5DB",fontSize: 19 }}>⠿</span>
                    <span style={{ fontSize:12,color:"#1D4ED8",transform:`rotate(${arrowRotate}deg)`,display:"inline-block" }}>›</span>
                    <span style={{ fontSize:16 }}>👥</span>
                    <span style={{ flex: 1, fontSize: 16,color:"#1D4ED8",fontWeight:700 }}>Students Management</span>
                    <Badge type="Folder" />
                  </div>
                  {SUB_ITEMS.map((sub, idx) => {
                    const subProg = sp(frame, 28 + idx * 9, fps, { damping: 22, stiffness: 140 });
                    const subOpacity = fi(frame, 28 + idx * 9, 156, 7);
                    return (
                      <div key={sub.label} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 14px 8px 46px",borderTop:"1px solid #DBEAFE",background:"#F0F7FF",opacity:subOpacity,transform:`translateX(${interpolate(subProg,[0,1],[40,0])}px)` }}>
                        <span style={{ fontSize:13 }}>{sub.icon}</span>
                        <span style={{ fontSize:12,color:"#374151",flex:1 }}>{sub.label}</span>
                        <span style={{ fontSize:10,background:"#E0E7FF",color:"#4F46E5",padding:"2px 8px",borderRadius:4,fontWeight:600 }}>Sub-menu</span>
                      </div>
                    );
                  })}
                </div>
                {MENU_ITEMS.slice(4,7).map(item => (
                  <div key={item.label} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 18px",marginBottom:6,border:"1px solid #E5E7EB",borderRadius:8,background:"#FAFAFA" }}>
                    <span style={{ fontSize: 21 }}>{item.icon}</span><span style={{ flex: 1, fontSize: 18,color:"#1F2937",fontWeight:500 }}>{item.label}</span><Badge type={item.type} />
                  </div>
                ))}
                <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute",bottom:55,left:"50%",transform:"translateX(-50%)",opacity:labelOpacity,textAlign:"center" }}>
        <div style={{ background:"#1E293B",border:"1px solid #334155",borderRadius:10,padding:"12px 28px" }}>
          <div style={{ fontSize:20,fontWeight:700,color:"#F1F5F9" }}>Folders expand into full sub-menus</div>
          <div style={{ fontSize:13,color:"#64748B",marginTop:4 }}>Each level draggable, editable, fully yours</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 6b: PUBLISH / GO LIVE ─────────────────────────────────────────────
const ScenePublish: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const btnScale = interpolate(frame, [7, 15, 22], [1, 0.88, 1], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  const toastProg = sp(frame, 22, fps, { damping: 18, stiffness: 120 });
  const toastOpacity = fi(frame, 22, 87, 11);
  const checkScale = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft:"clamp", extrapolateRight:"clamp", easing: Easing.out(Easing.back(2)) });
  const labelOpacity = fi(frame, 54, 94, 15);

  // Wide, then a hard focus zoom onto the "Update Menus" button as it's
  // clicked and the success toast that follows (10-120), before releasing
  // back to the wide framing to close out the scene.
  const zoom = interpolate(
    frame, [0, 7, 87, 116],
    [1, 1.5, 1.5, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panX = interpolate(
    frame, [0, 7, 87, 116],
    [0, -833, -833, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const panY = interpolate(
    frame, [0, 7, 87, 116],
    [0, 434, 434, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const cursorOpacity = fi(frame, 0, 65, 7, 11);
  const cursorX = interpolate(frame, [0, 7], [980, 1100], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [0, 7], [-5, 15], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clickRipple = interpolate(frame, [7, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Refreshed/saved menu: once the scene has zoomed back out to the wide
  // framing, swap the list to reflect the customization made earlier in
  // the video (the drag-drop reorder that moved "Attendance" up) — proof
  // the save actually stuck, not just a toast.
  const REORDERED_ITEMS = (() => {
    const arr = [...MENU_ITEMS];
    const idx = arr.findIndex(m => m.label === "Attendance");
    const [moved] = arr.splice(idx, 1);
    arr.splice(4, 0, moved);
    return arr;
  })();
  const finalT = interpolate(frame, [122, 134], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalGlow = interpolate(frame, [126, 142, 160], [0, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayItems = finalT > 0.5 ? REORDERED_ITEMS : MENU_ITEMS;

  return (
    <AbsoluteFill style={{ background: "#0F172A", overflow: "hidden" }}>
      <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(#1E293B 1px,transparent 1px),linear-gradient(90deg,#1E293B 1px,transparent 1px)",backgroundSize:"60px 60px",opacity:0.4 }} />
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:`translate(calc(-50% + ${panX}px),calc(-50% + ${panY}px)) scale(${zoom})`,width:1480,height:820,borderRadius:12,overflow:"hidden",border:"1px solid #334155",boxShadow:"0 40px 120px #0004" }}>
        <div style={{ height:36,background:"#1E293B",display:"flex",alignItems:"center",padding:"0 14px",gap:8,borderBottom:"1px solid #334155" }}>
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#EF4444" }} />
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#F59E0B" }} />
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#10B981" }} />
          <div style={{ flex:1,maxWidth:500,margin:"0 auto",background:"#0F172A",borderRadius:6,padding:"3px 12px",display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ fontSize:10,color:"#10B981" }}>🔒</span>
            <span style={{ fontSize:11,color:"#94A3B8" }}>app.skillbnk.com/menu-builder</span>
          </div>
        </div>
        <div style={{ display:"flex",height:"calc(100% - 36px)",background:"#F9FAFB",position:"relative" }}>
          <Sidebar />
          <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
            <TopBar />
            <div style={{ flex:1,padding:20,position:"relative" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
                <h1 style={{ margin:0,fontSize:20,fontWeight:700,color:"#111827" }}>Menu Builder ⓘ</h1>
                <div style={{ display:"flex",gap:10 }}>
                  <button style={{ padding:"7px 16px",border:"1px solid #1D4ED8",borderRadius:7,color:"#1D4ED8",background:"#EFF6FF",fontSize:12,fontWeight:600 }}>⊞ Choose from template</button>
                  <button style={{ padding:"7px 16px",border:"none",borderRadius:7,color:"#fff",background:"#1D4ED8",fontSize:12,fontWeight:600,transform:`scale(${btnScale})`,boxShadow:"0 4px 14px #1D4ED866" }}>↕ Update menus</button>
                </div>
              </div>
              <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} rippleT={clickRipple} />
              <div style={{ maxWidth: 820, margin: "0 auto" }}>
                {displayItems.slice(0,6).map(item => {
                  const justMoved = finalT > 0.5 && item.label === "Attendance";
                  return (
                    <div key={item.label} style={{
                      display:"flex",alignItems:"center",gap:12,padding:"14px 18px",marginBottom:6,
                      border: justMoved ? "1.5px solid #10B981" : "1px solid #E5E7EB",
                      borderRadius:8, background: justMoved ? "#ECFDF5" : "#FAFAFA",
                      boxShadow: justMoved ? `0 0 ${Math.round(finalGlow * 18)}px #10B98166` : "none",
                    }}>
                      <span style={{ color:"#D1D5DB",fontSize: 19 }}>⠿</span><span style={{ fontSize: 21 }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: 18,color:"#1F2937",fontWeight:500 }}>{item.label}</span>
                      {justMoved && (
                        <span style={{ fontSize:10,fontWeight:700,color:"#10B981",background:"#D1FAE5",padding:"2px 8px",borderRadius:999,marginRight:8 }}>✓ Saved</span>
                      )}
                      <Badge type={item.type} />
                    </div>
                  );
                })}
              </div>
              {/* Success toast */}
              <div style={{ position:"absolute",top:interpolate(toastProg,[0,1],[-90,16]),right:20,background:"#fff",border:"1px solid #D1FAE5",borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 8px 30px #10B98122",opacity:toastOpacity,minWidth:320 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",transform:`scale(${checkScale})` }}>✓</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:700,color:"#065F46" }}>Navigation updated!</div>
                  <div style={{ fontSize:12,color:"#6B7280",marginTop:2 }}>Changes are live for all users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute",bottom:55,left:"50%",transform:"translateX(-50%)",opacity:labelOpacity,textAlign:"center" }}>
        <div style={{ background:"#1E293B",border:"1px solid #10B98133",borderRadius:10,padding:"12px 28px" }}>
          <div style={{ fontSize:20,fontWeight:700,color:"#10B981" }}>Changes go live instantly</div>
          <div style={{ fontSize:13,color:"#64748B",marginTop:4 }}>No deployment · No developer · No waiting</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── VOICE-OVER ──────────────────────────────────────────────────────────────
// Generate audio first: bash generate-voice.sh (macOS Ava Enhanced, free)
const VOICE_CLIPS = [
  { file: "s0.mp3", from: 0     , dur: 106  },
  { file: "s1.mp3", from: 112   , dur: 340  },
  { file: "s2.mp3", from: 458   , dur: 271  },
  { file: "s3.mp3", from: 735   , dur: 246  },
  { file: "s4.mp3", from: 987   , dur: 220  },
  { file: "s5.mp3", from: 1213  , dur: 219  },
  { file: "s6.mp3", from: 1438  , dur: 246  },
  { file: "s7.mp3", from: 1690  , dur: 151  },
  { file: "s8.mp3", from: 1847  , dur: 196  },
];
// Timing is computed at runtime from the clip lengths above + the MAIN INTRO
// length (INTRO_FRAMES in SkillbnkIntroVideo.tsx), so re-voicing the intro
// re-times this video automatically.
const INTRO_INDEX = 0;
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

// ─── ROOT COMPOSITION ─────────────────────────────────────────────────────────
const SCENES: React.FC<{ frame: number; fps: number }>[] = [(() => null) as React.FC<{ frame: number; fps: number }>, SceneAppReveal, SceneMenuLoad, SceneDragDrop, SceneEditModal, SceneTemplates, SceneSubMenu, ScenePublish, SceneCTA];

export const MenuBuilderVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }}>
      {/* 🎙 Voice-over */}
      <VoiceTrack />
      {/* 🎬 Scenes (slot 0 = MAIN INTRO from SkillbnkIntroVideo.tsx) */}
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
