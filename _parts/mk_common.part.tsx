
// ═══════════════════════════════════════════════════════════════════════════
// Marketing series (sheet serials 23–24) — training-provider (location) portal shell.
// Sidebar labels as in the earlier verified follow-up video (Marketing Tools → Email Marketing / SMS Marketing).
// ═══════════════════════════════════════════════════════════════════════════
const B_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Leaderboard" }, { t: "Students Management", more: true }, { t: "Courses & Programs", more: true },
  { t: "Marketing Tools", open: true }, { t: "Email Marketing", child: true }, { t: "SMS Marketing", child: true },
  { t: "Attendance", more: true }, { t: "Communication", more: true }, { t: "Integrations" }, { t: "Institute Settings" },
];
const bMenuPt = (t: string) => ({ x: 12 + 110, y: 106 + B_MENU.findIndex((m) => m.t === t) * 36 + 17 });
const BShell: React.FC<{ active: string; children: React.ReactNode }> = ({ active, children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ padding: "2px 6px 10px" }}><BrightLogo /></div>
      <div style={{ height: 34, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 14, color: "#9CA3AF" }}>⌕ Search menu...</div>
      {B_MENU.map((m, i) => {
        const on = m.t === active;
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: 106 + i * 36, width: SIDE - 24, height: 34, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 6, paddingRight: 6, boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            {!m.child && <Ico c={on ? BLUE : "#4B5563"} s={14} />}<span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>{m.more && <Chevron />}{m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}` }}>
      <div style={{ position: "absolute", left: 18, top: 21 }}><Ico s={18} /></div>
      <div style={{ position: "absolute", left: 52, top: 11, height: 38, border: `1px solid ${LINE}`, borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 14, color: INK, fontWeight: 700 }}>🏢 Brightpath — Downtown</div>
      <div style={{ position: "absolute", right: 18, top: 12 }}><Avatar t="GO" s={36} c1="#14B8A6" c2="#0F766E" /></div>
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
const BR_TAG: Tag = { n: 1, label: "Training provider portal", url: "admin view" };
const BStage: React.FC<{ g: number; keys: CamKey[]; url: string; cur: { x: number; y: number }; ripple: number; chip?: [number, string]; over?: React.ReactNode; active: string; children: React.ReactNode }> = ({ g, keys, url, cur, ripple, chip, over, active, children }) => (
  <Stage>
    <PortalTag n={BR_TAG.n} label={BR_TAG.label} url={BR_TAG.url} />
    <CamC g={g} keys={keys}>
      <Browser url={url}>
        <BShell active={active}>{children}</BShell>
        {over}
        <Cursor x={cur.x} y={cur.y} ripple={ripple} />
      </Browser>
    </CamC>
    {chip && <StepChip n={chip[0]} text={chip[1]} o={fi(g, 6, 10)} />}
  </Stage>
);
type Lrn = { n: string; e: string; p: string };
const LEARNERS: Lrn[] = [["Maya Torres", "maya.torres@example.com", "(555) 014-2210"], ["Jordan Lee", "jordan.lee@example.com", "(555) 014-2211"], ["Priya Nair", "priya.nair@example.com", "(555) 014-2212"], ["Diego Alvarez", "diego.a@example.com", "(555) 014-2213"], ["Hana Sato", "hana.s@example.com", "(555) 014-2214"], ["Ethan Brooks", "ethan.b@example.com", "(555) 014-2215"], ["Grace Kim", "grace.kim@example.com", "(555) 014-2216"], ["Sam Okafor", "sam.okafor@example.com", "(555) 014-2217"]].map(([n, e, p]) => ({ n, e, p }));
const CronBox: React.FC<{ g: number; at: number; box: { x: number; y: number; w: number; h: number }; o: number; save: boolean; expr: string; human: string }> = ({ g, at, box, o, save, expr, human }) => (
  <Modal box={box} title="Cron Jobs" o={o}>
    <div style={{ position: "absolute", left: 24, top: 66, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Cron expression (Use UTC timezone)</div>
    <div style={{ position: "absolute", left: 24, top: 92, width: box.w - 48, height: 44, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: g >= at && g < at + 40 ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", padding: "0 12px", boxSizing: "border-box", fontSize: 17, color: expr ? INK : "#9CA3AF", fontFamily: "monospace" }}>{expr || "Enter cron expression"}</div>
    <div style={{ position: "absolute", left: 24, top: 146, fontSize: 15, fontWeight: 700, color: "#16A34A", opacity: fi(g, at + 30, 8) }}>{human}</div>
    <div style={{ position: "absolute", left: 24, top: 182, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, color: INK }}>Active: <Toggle on={1} /></div>
    <UB x={24} y={box.h - 62} w={170} h={40} v="outline" label="Click to generate ↗" fs={13.5} />
    <UB x={box.w - 24 - 96 - 10 - 96} y={box.h - 62} w={96} h={40} v="red" label="Cancel" />
    <UB x={box.w - 24 - 96} y={box.h - 62} w={96} h={40} label="Save" press={save} />
  </Modal>
);
