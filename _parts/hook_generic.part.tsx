// ═══ HOOK (generic): floating cards + three headline lines ══════════════════
const HookCards: React.FC<{ g: number; fps: number; D: number; main: React.ReactNode; cards: string[]; lines: { t: string; at: number; c: string }[]; accent: string }> = ({ g, fps, D, main, cards, lines, accent }) => {
  const drift = (i: number) => Math.sin((g + i * 40) / 30) * 7;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 170, top: 110 + drift(0), width: 640, height: 480, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #000A", opacity: sp(g, 4, fps), transform: "rotate(-2deg)", overflow: "hidden" }}>{main}</div>
        {cards.map((n, i) => {
          const p = sp(g, 60 + i * 18, fps, { damping: 12 });
          return (
            <div key={n} style={{ position: "absolute", left: 980 + (i % 2) * 330, top: 140 + Math.floor(i / 2) * 200 + drift(i + 1), width: 300, height: 160, borderRadius: 16, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${accent}66`, boxShadow: "0 20px 50px #0009", opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${(i - 1.5) * 4}deg)`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, boxSizing: "border-box", fontSize: 24, fontWeight: 800, color: "#FDBA74" }}>{n}</div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center" }}>
          {lines.map((l) => {
            const o = fi(g, l.at, 12);
            return <div key={l.t} style={{ fontSize: 48, fontWeight: 800, color: l.c, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, lineHeight: 1.3 }}>{l.t}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
