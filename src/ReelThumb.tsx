import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop, Finish, Scribble, FONT, MARK } from "./premiumKit";

const ROWS = [["Olivia Bennett", "olivia.bennett@example.com", 0], ["Marcus Cole", "marcus.cole@example.com", 0], ["Grace Park", "grace.park@example.com", 1], ["Ethan Walsh", "ethan.walsh@example.com", 0]] as const;
const COL = [["#2E64F0", "#1D4ED8"], ["#14B8A6", "#0F766E"], ["#9CA3AF", "#6B7280"], ["#EC4899", "#BE185D"]];
const Card: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ width: 860 * s, borderRadius: 30 * s, background: "#fff", padding: 30 * s, boxSizing: "border-box", boxShadow: "0 50px 120px #000D", fontFamily: FONT }}>
    <div style={{ fontSize: 34 * s, fontWeight: 900, color: "#111827" }}>Enrollment Preview</div>
    <div style={{ display: "flex", gap: 14 * s, margin: `${14 * s}px 0 ${12 * s}px` }}>
      <span style={{ fontSize: 24 * s, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: `${7 * s}px ${18 * s}px`, borderRadius: 999 }}>● 47 Will Enroll</span>
      <span style={{ fontSize: 24 * s, fontWeight: 800, color: "#B45309", background: "#FEF3C7", padding: `${7 * s}px ${18 * s}px`, borderRadius: 999 }}>● 1 Already Enrolled</span>
    </div>
    {ROWS.map(([n, e, a], i) => (
      <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 92 * s, borderRadius: 16 * s, border: `2px solid ${a ? "#FCD34D" : "#E5E7EB"}`, background: a ? "#FEF3C7" : "#fff", padding: `0 ${20 * s}px`, marginTop: 10 * s }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * s }}>
          <div style={{ width: 54 * s, height: 54 * s, borderRadius: "50%", background: `linear-gradient(135deg,${COL[i][0]},${COL[i][1]})`, color: "#fff", fontWeight: 800, fontSize: 21 * s, display: "flex", alignItems: "center", justifyContent: "center" }}>{n.split(" ").map((w) => w[0]).join("")}</div>
          <div><div style={{ fontSize: 26 * s, fontWeight: 800, color: "#111827" }}>{n}</div><div style={{ fontSize: 18 * s, color: "#6B7280" }}>{e}</div></div>
        </div>
        <span style={{ fontSize: 20 * s, fontWeight: 800, color: a ? "#B45309" : "#16A34A", background: a ? "#FDE68A" : "#DCFCE7", padding: `${6 * s}px ${14 * s}px`, borderRadius: 999 }}>{a ? "Already Enrolled" : "Will Enroll"}</span>
      </div>
    ))}
    <div style={{ marginTop: 22 * s, height: 70 * s, borderRadius: 16 * s, background: "#1D3FD6", color: "#fff", fontSize: 30 * s, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px #1D3FD655" }}>Enroll 47 Students</div>
  </div>
);
const Txt: React.FC<{ s: number; align?: "left" | "center" }> = ({ s, align = "center" }) => (
  <div style={{ fontFamily: FONT, textAlign: align }}>
    <div style={{ fontSize: 560 * s, fontWeight: 900, lineHeight: 0.9, color: "#fff", textShadow: "0 0 120px #3B82F6, 0 30px 80px #000A", letterSpacing: -10 * s }}>48</div>
    <div style={{ fontSize: 74 * s, fontWeight: 900, letterSpacing: 10 * s, color: "#93C5FD", marginTop: 10 * s }}>NEW HIRES</div>
  </div>
);
const Upload: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "inline-block", fontFamily: FONT, fontSize: 130 * s, fontWeight: 900, color: "#fff", padding: `${6 * s}px ${44 * s}px ${14 * s}px`, borderRadius: 30 * s, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", boxShadow: "0 30px 80px #1D4ED888", transform: "rotate(-2deg)", letterSpacing: -2 }}>ONE UPLOAD.</div>
);
export const ReelThumb: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  if (portrait)
    return (
      <AbsoluteFill>
        <Backdrop f={40} w={1080} h={1920} />
        <Img src={staticFile("skillbnk-logo.png")} style={{ position: "absolute", left: 70, top: 120, width: 360 }} />
        <div style={{ position: "absolute", left: 0, top: 230, width: 1080 }}><Txt s={1} /></div>
        <div style={{ position: "absolute", left: 110, top: 840, transform: "rotate(-2.5deg)" }}>
          <Card s={1} />
          <Scribble f={99} at={0} d={1} kind="ring" x={716} y={378} w={290} h={84} seed={3} worldW={1080} worldH={1920} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 1480, width: 1080, textAlign: "center" }}><Upload s={1} /></div>
        <Finish f={40} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <Backdrop f={40} w={1280} h={720} />
      <Img src={staticFile("skillbnk-logo.png")} style={{ position: "absolute", left: 50, top: 36, width: 250 }} />
      <div style={{ position: "absolute", left: 20, top: 90, width: 640 }}><Txt s={0.74} /></div>
      <div style={{ position: "absolute", left: 40, top: 560 }}><Upload s={0.6} /></div>
      <div style={{ position: "absolute", left: 640, top: 70, transform: "rotate(2deg)" }}>
        <Card s={0.7} />
        <Scribble f={99} at={0} d={1} kind="ring" x={498} y={282} w={250} h={68} seed={3} worldW={600} worldH={600} />
      </div>
      <Finish f={40} w={1280} h={720} />
    </AbsoluteFill>
  );
};
