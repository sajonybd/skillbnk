// ═══ s0 — HOOK: the best script lives in one rep's head ═════════════════════
const SceneHookSales: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 240;
  const g = gt(f, dur, D);
  const reps = [["Top rep", 92, "#16A34A"], ["Rep 2", 61, "#F59E0B"], ["Rep 3", 48, "#F97316"], ["Rep 4", 39, "#DC2626"], ["Rep 5", 33, "#DC2626"]] as [string, number, string][];
  const main = (
    <>
      <div style={{ height: 60, background: "linear-gradient(90deg,#4C1D95,#7C3AED)", color: "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontSize: 22, fontWeight: 800 }}>📈 Close rate this quarter</div>
      <div style={{ padding: "26px 30px" }}>
        {reps.map(([n, v, c], i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, opacity: fi(g, 10 + i * 10, 10) }}>
            <div style={{ width: 110, fontSize: 19, fontWeight: 700, color: INK }}>{n}</div>
            <div style={{ flex: 1, height: 22, borderRadius: 11, background: "#F3F4F6" }}><div style={{ width: `${interpolate(g, [10 + i * 10, 60 + i * 10], [0, v], cl)}%`, height: 22, borderRadius: 11, background: c }} /></div>
            <div style={{ width: 56, fontSize: 19, fontWeight: 800, color: c }}>{v}%</div>
          </div>
        ))}
      </div>
    </>
  );
  return <HookCards g={g} fps={fps} D={D} main={main} accent="#7C3AED" cards={["🧠 The script is in one head", "📄 Playbook PDF nobody opens", "🤷 Every rep pitches differently", "⏱ No time to role-play"]} lines={[{ t: "Your best sales script", at: 6, c: "#F1F5F9" }, { t: "lives in one rep's head.", at: 50, c: "#FDBA74" }, { t: "Everyone else is guessing.", at: 130, c: "#FCA5A5" }]} />;
};
