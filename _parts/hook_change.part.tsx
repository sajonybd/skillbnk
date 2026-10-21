// ═══ c0 — HOOK: new software, half the team still does it the old way ═══════
const SceneHookChange: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 240;
  const g = gt(f, dur, D);
  const drift = (i: number) => Math.sin((g + i * 40) / 30) * 7;
  const used = Math.round(interpolate(g, [40, 150], [0, 22], cl));
  const lines = [
    { t: "You bought new software.", at: 6, c: "#F1F5F9" },
    { t: "Three months later…", at: 80, c: "#FDBA74" },
    { t: "Half the team still does it the old way.", at: 140, c: "#FCA5A5" },
  ];
  const notes = ["📒 Paper work-order book", "▦ Tenants_FINAL_v3.xlsx", "✉️ Requests by email", "📞 Call-back sticky notes"];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 170, top: 120 + drift(0), width: 640, height: 470, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: sp(g, 4, fps), transform: "rotate(-2deg)", overflow: "hidden" }}>
          <div style={{ height: 60, background: "linear-gradient(90deg,#0C4A6E,#0EA5E9)", color: "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontSize: 22, fontWeight: 800 }}>🆕 New CRM · Team activity</div>
          <div style={{ padding: "26px 28px" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>People using it this week</div>
            <div style={{ marginTop: 10, fontSize: 64, fontWeight: 900, color: INK }}>{used} <span style={{ fontSize: 30, color: "#9CA3AF" }}>/ 48</span></div>
            <div style={{ marginTop: 12, height: 16, borderRadius: 8, background: "#E5E7EB" }}><div style={{ width: `${(used / 48) * 100}%`, height: 16, borderRadius: 8, background: "#F97316" }} /></div>
            <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Array.from({ length: 48 }).map((_, i) => <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: i < used ? "#0EA5E9" : "#E5E7EB" }} />)}
            </div>
          </div>
        </div>
        {notes.map((n, i) => {
          const p = sp(g, 60 + i * 18, fps, { damping: 12 });
          return (
            <div key={n} style={{ position: "absolute", left: 980 + (i % 2) * 330, top: 150 + Math.floor(i / 2) * 200 + drift(i + 1), width: 300, height: 160, borderRadius: 16, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #F9731666", boxShadow: "0 20px 50px #0009", opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${(i - 1.5) * 4}deg)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, boxSizing: "border-box", fontSize: 24, fontWeight: 800, color: "#FDBA74" }}>{n}</div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center" }}>
          {lines.map((l) => {
            const o = fi(g, l.at, 12);
            return <div key={l.t} style={{ fontSize: 48, fontWeight: 800, color: l.c, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, lineHeight: 1.3 }}>{l.t}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
