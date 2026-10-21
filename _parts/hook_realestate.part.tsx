// ═══ r0 — HOOK: a new agent just lost a listing ═════════════════════════════
const SceneHookRE: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 260;
  const g = gt(f, dur, D);
  const main = (
    <>
      <div style={{ height: 60, background: "linear-gradient(90deg,#0F766E,#14B8A6)", color: "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontSize: 22, fontWeight: 800 }}>🏠 Listing update · 418 Maple Ave</div>
      <div style={{ padding: "28px 30px" }}>
        <div style={{ fontSize: 20, color: "#374151", fontWeight: 600 }}>Seller decision</div>
        <div style={{ marginTop: 10, fontSize: 46, fontWeight: 900, color: "#DC2626", opacity: fi(g, 40, 10) }}>Listing lost ✗</div>
        <div style={{ marginTop: 18, fontSize: 19, color: "#4B5563", lineHeight: 1.5, opacity: fi(g, 60, 10) }}>“The agent couldn't explain the pricing plan or the marketing timeline. We went with another brokerage.”</div>
        <div style={{ marginTop: 22, display: "flex", gap: 10, opacity: fi(g, 80, 10) }}>
          <span style={{ padding: "6px 12px", borderRadius: 8, background: "#FEF2F2", color: "#B91C1C", fontWeight: 700, fontSize: 15 }}>Agent: 3 weeks in</span>
          <span style={{ padding: "6px 12px", borderRadius: 8, background: "#F3F4F6", color: "#374151", fontWeight: 700, fontSize: 15 }}>Training: none yet</span>
        </div>
      </div>
    </>
  );
  return <HookCards g={g} fps={fps} D={D} main={main} accent="#14B8A6" cards={["👀 Shadow a top agent", "📒 The old binder", "🤞 Hope it sticks", "📞 Top producer off the phone"]} lines={[{ t: "Your new agent just lost a listing.", at: 6, c: "#F1F5F9" }, { t: "Not because they're bad…", at: 90, c: "#FDBA74" }, { t: "Nobody had time to teach your process.", at: 150, c: "#FCA5A5" }]} />;
};
