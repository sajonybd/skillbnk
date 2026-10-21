
// ═══════════════════════════════════════════════════════════════════════════
// Manage Multiple Locations — scenes (sheet serial 20). Real UI (SB-Company AllBranches/*):
//  "All Branches" · "All branches information are available here." · Add New Branch · "Enter Branch Name..." ·
//  columns Branch Name / Slug / Short Name / Branch URL / Created By / Status / Creation Date / Last Updated /
//  Action (👁 View branch details · history). Status Approved / Pending / Rejected; new branches default Pending.
//  "Create New Branch" · "To create a new branch fill out the form below" · stepper Branch Info / Contact Person 1 /
//  Contact Person 2 / About & Social / Documents · Branch Information (Branch Name*, Branch URL, Phone Number*,
//  Fax Number*, Tax Number*) · Address Information (Street*, City*, State*, Postal Code*, Country*) ·
//  Primary / Secondary Contact Person (Full Name*, Email Address*, Phone Number*) · About & Social Media
//  (About Branch, Social Media Links: Facebook, Twitter, LinkedIn, Instagram, GitHub) · Documents (Branch Logo,
//  Business Document, Other Document) · Previous / Next / Create Branch · toast "Branch created successfully".
//  BranchDetails: Back · Refresh · "Branch information, students, and transaction summary." · Approved Students ·
//  Transactions · Transaction Amount · Monthly Transactions ("Last 12 months transaction count and amount.") ·
//  Branch Information (Branch Name, Slug, Created By, Created At, Last Updated) · Contact Details
//  (Contact Name, Email, Phone, Address).  Voice says "locations"; on-screen UI labels keep "Branch".
// ═══════════════════════════════════════════════════════════════════════════
type BrRow = { name: string; slug: string; url: string; by: string; st: "Approved" | "Pending" | "Rejected"; c: string; u: string };
const BRS: BrRow[] = [
  { name: "Brightpath — Downtown", slug: "downtown", url: "learnbrightpath.com/downtown", by: "Ava Reyes", st: "Approved", c: "Jan 12, 2026", u: "Sep 30, 2026" },
  { name: "Brightpath — Eastside", slug: "eastside", url: "learnbrightpath.com/eastside", by: "Ava Reyes", st: "Approved", c: "Mar 4, 2026", u: "Sep 28, 2026" },
  { name: "Brightpath — Northgate", slug: "northgate", url: "learnbrightpath.com/northgate", by: "Liam Chen", st: "Approved", c: "May 19, 2026", u: "Oct 2, 2026" },
  { name: "Brightpath — Lakeview", slug: "lakeview", url: "learnbrightpath.com/lakeview", by: "Liam Chen", st: "Pending", c: "Sep 22, 2026", u: "Sep 22, 2026" },
];
const NEW_BR: BrRow = { name: "Brightpath — Riverside", slug: "riverside", url: "learnbrightpath.com/riverside", by: "Ava Reyes", st: "Pending", c: "Oct 7, 2026", u: "Oct 7, 2026" };
const BR_COLS: TCol[] = [["Branch Name", 250], ["Slug / Short Name", 160], ["Branch URL", 270], ["Created By", 140], ["Status", 110], ["Creation Date", 130], ["Last Updated", 130], ["Action", 112]];
const BR_T = { x: 24, y: 160 };
const BR_ADD = { x: 1350 - 24 - 180, y: 22, w: 180, h: 40 };
const BR_URL = "company.skillbnk.com/branch-management";
const brCells = (r: BrRow, eyeHl = false): React.ReactNode[] => [<b style={{ color: BLUE }}>{r.name}</b>, <span style={{ fontFamily: "monospace", color: GRAY }}>{r.slug}</span>, <span style={{ color: "#374151" }}>{r.url}</span>, r.by, <Pill t={r.st} tone={r.st === "Approved" ? "green" : r.st === "Pending" ? "amber" : "red"} />, r.c, r.u, <span style={{ display: "flex", gap: 6 }}><IcoBtn t="👁" hl={eyeHl} /><IcoBtn t="🕘" c="#7C3AED" /></span>];
const BrList: React.FC<{ rows: BrRow[]; hlCol?: number; hlRow?: number; press?: boolean; eye?: number; rowO?: number[] }> = ({ rows, hlCol, hlRow, press, eye = -1, rowO }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="All Branches" sub="All branches information are available here." x={24} y={16} />
    <UB {...BR_ADD} label="Add New Branch" icon="＋" press={press} />
    <SearchBox x={24} y={96} w={340} ph="Enter Branch Name..." />
    <Tbl x={BR_T.x} y={BR_T.y} cols={BR_COLS} rows={rows.map((r, i) => brCells(r, eye === i))} hlCol={hlCol} hlRow={hlRow} rowO={rowO} />
  </div>
);
const BR_STEPS = ["Branch Info", "Contact Person 1", "Contact Person 2", "About & Social", "Documents"];
const BrStepper: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ position: "absolute", left: 175, top: 96, width: 1000, height: 70 }}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 23, height: 2, background: LINE }} />
    <div style={{ position: "absolute", left: 24, top: 23, height: 2, width: (952 * s) / 4, background: BLUE }} />
    {BR_STEPS.map((t, i) => <div key={t} style={{ position: "absolute", left: i * 238, top: 0, width: 48, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: i <= s ? BLUE : "#fff", border: `2px solid ${i <= s ? BLUE : "#D1D5DB"}`, color: i <= s ? "#fff" : GRAY, fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>{i < s ? "✓" : i + 1}</div>
      <div style={{ position: "absolute", left: -60, width: 168, top: 54, fontSize: 13, fontWeight: 700, color: i <= s ? INK : GRAY }}>{t}</div>
    </div>)}
  </div>
);
const BR_NEXT = { x: 1350 - 24 - 120, y: 730, w: 120, h: 42 };
const BR_PREV = { x: 24, y: 730, w: 120, h: 42 };
const BrFormShell: React.FC<{ s: number; children: React.ReactNode; press?: boolean; last?: boolean }> = ({ s, children, press, last }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="Create New Branch" sub="To create a new branch fill out the form below" back x={24} y={16} />
    <BrStepper s={s} />
    <div style={{ position: "absolute", left: 24, top: 200, width: 1302, height: 510, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>{children}</div>
    {s > 0 && <UB {...BR_PREV} v="outline" label="← Previous" />}
    <UB {...(last ? { ...BR_NEXT, x: BR_NEXT.x - 40, w: 160 } : BR_NEXT)} label={last ? "Create Branch" : "Next →"} press={press} />
  </div>
);
const brNextPt = (last = false) => ({ x: MX(last ? BR_NEXT.x - 40 + 80 : BR_NEXT.x + 60), y: MY(BR_NEXT.y + 21) });
/** form field inside the white card (card-local coords) */
const BF: React.FC<{ x: number; y: number; w: number; l: string; v: string; ph?: string; req?: boolean; glow?: boolean; h?: number; select?: boolean }> = (p) => <MInput x={p.x} y={p.y} w={p.w} label={p.l} value={p.v} ph={p.ph} req={p.req} glow={p.glow} h={p.h} select={p.select} />;
const bfPt = (x: number, y: number, w: number) => ({ x: MX(24 + x + w / 2), y: MY(200 + y + 47) });

// ═══ m0 — HOOK ═════════════════════════════════════════════════════════════
const SceneHookBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 190, B3 = 305;
  const pins: [number, number, string][] = [[520, 520, "Downtown"], [820, 380, "Eastside"], [1120, 600, "Northgate"], [1400, 430, "Riverside"]];
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <HookLine g={g} at={2} top={90} size={58}>Four locations. <span style={{ color: "#F87171" }}>Four spreadsheets.</span></HookLine>
          <HookLine g={g} at={34} top={170} size={40} color="#FCA5A5">Zero idea which one is losing students.</HookLine>
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>{pins.map(([x, y], i) => i > 0 && <line key={i} x1={pins[0][0]} y1={pins[0][1]} x2={x} y2={y} stroke="#F8717155" strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={-g * 2} opacity={fi(g, 20 + i * 10, 10)} />)}</svg>
          {pins.map(([x, y, n], i) => { const p = sp(g, 14 + i * 12, fps, { damping: 10 }); const q = fi(g, 60 + i * 12, 8); return <div key={n} style={{ position: "absolute", left: x - 90, top: y - 40, width: 180, textAlign: "center", opacity: p, transform: `scale(${0.5 + 0.5 * p})` }}>
            <div style={{ width: 64, height: 64, margin: "0 auto", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: q > 0.5 ? "#7F1D1D" : "#1E293B", border: "3px solid #F87171", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ transform: "rotate(45deg)", fontSize: 30, color: "#FECACA", fontWeight: 900 }}>{q > 0.5 ? "?" : "📍"}</span></div>
            <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, color: "#E2E8F0" }}>{n}</div>
            <div style={{ marginTop: 6, fontSize: 17, color: "#FCA5A5", opacity: q }}>📊 sheet_v{i + 3}_FINAL.xlsx</div>
          </div>; })}
          <div style={{ position: "absolute", left: 120, top: 820, display: "flex", gap: 14, alignItems: "center", opacity: fi(g, 96, 8) }}><span style={{ fontSize: 44 }}>☎️</span><span style={{ fontSize: 28, fontWeight: 800, color: "#FECACA" }}>Head office: “Can someone send me this month's numbers?”</span></div>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <HookLine g={g} at={B2} top={110} size={46} color="#CBD5E1">With most LMS platforms, every location is <span style={{ color: "#FCA5A5" }}>its own island</span>.</HookLine>
          {pins.map(([, , n], i) => <div key={n} style={{ position: "absolute", left: 200 + i * 400, top: 330, width: 320, height: 420, borderRadius: 20, background: "#111827", border: "2px solid #334155", opacity: fi(g, B2 + 8 + i * 8, 8), transform: `rotate(${(i - 1.5) * 2}deg)` }}>
            <div style={{ padding: 20, fontSize: 15, fontWeight: 800, color: "#64748B", letterSpacing: 2 }}>LOGIN</div>
            <div style={{ margin: "0 20px", height: 40, borderRadius: 8, background: "#1E293B" }} /><div style={{ margin: "14px 20px", height: 40, borderRadius: 8, background: "#1E293B" }} />
            <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center", fontSize: 22, fontWeight: 800, color: "#94A3B8" }}>{n}<br /><span style={{ fontSize: 15, color: "#F87171" }}>separate account</span></div>
          </div>)}
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={150} />
          <div style={{ position: "absolute", left: 110, top: 230, width: 760, fontSize: 70, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>One head office.<br /><span style={{ color: "#5EEAD4" }}>Every location, live.</span></div>
          {(() => { const P = [[1120, 270], [1640, 270], [1120, 800], [1640, 800]]; return <>
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>{P.map(([x, y], i) => <line key={i} x1={1380} y1={535} x2={x} y2={y} stroke="#5EEAD4" strokeWidth={4} opacity={fi(g, B3 + 20 + i * 8, 8)} />)}</svg>
            <div style={{ position: "absolute", left: 1270, top: 490, width: 220, height: 90, borderRadius: 18, background: "#0F766E", color: "#fff", fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 50px #14B8A6aa", opacity: fi(g, B3 + 12, 8) }}>HEAD OFFICE</div>
            {pins.map(([, , n], i) => <div key={n} style={{ position: "absolute", left: P[i][0] - 150, top: P[i][1] - 80, width: 300, padding: "18px 20px", borderRadius: 18, background: "#fff", boxShadow: "0 24px 50px #0009", opacity: sp(g, B3 + 24 + i * 8, fps), boxSizing: "border-box" }}><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>{n}</div><div style={{ marginTop: 6, fontSize: 19, color: GRAY }}>🎓 {[128, 96, 74, 0][i]} students · 💵 ${[184, 131, 97, 0][i]}k</div><div style={{ marginTop: 8 }}><Pill t={i === 3 ? "Pending" : "Approved"} tone={i === 3 ? "amber" : "green"} /></div></div>)}
          </>; })()}
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ m1 — Branch Management → All Branches ══════════════════════════════════
const SceneListBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = menuPt("Branch Management");
  const colAt = (i: number) => tblPt(BR_T.x, BR_T.y, BR_COLS, i, -1, 52).x;
  const hy = MY(BR_T.y + 23);
  const order = [0, 1, 2, 3, 4];
  const T0 = 120, ST = 34;
  const hl = g < T0 - 6 ? -1 : g < T0 + order.length * ST ? order[Math.min(4, Math.floor((g - T0 + 6) / ST))] : -1;
  const pts: P3[] = [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [100, colAt(0), hy]];
  order.forEach((c, i) => pts.push([T0 + i * ST, colAt(c), hy], [T0 + i * ST + 20, colAt(c), hy + 120]));
  pts.push([D, colAt(4), hy + 200]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 330, 1.9], [66, 300, 330, 1.9], [104, MX(420), 330, 1.5], [200, MX(620), 330, 1.5], [290, MX(780), 330, 1.5], [D, MX(780), 330, 1.5]];
  const names = ["Branch Name", "Slug / Short Name", "Branch URL", "Created By", "Status"];
  return (
    <FStage g={g} keys={keys} url={opened ? BR_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={rip(g, 66)} active={opened ? "Branch Management" : "Dashboard"} chip={[1, !opened ? "Company portal → Branch Management" : hl >= 0 ? `All Branches · ${names[hl]}` : "Every location, one list"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <BrList rows={BRS} hlCol={hl} />}
    </FStage>
  );
};

// ═══ m2 — Add New Branch → Branch Info (+ address) ═══════════════════════════
const SceneInfoBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const form = g >= 46;
  const ADD = { x: MX(ctr(BR_ADD).x), y: MY(ctr(BR_ADD).y) };
  const F = [
    { x: 24, y: 56, w: 610, l: "Branch Name", v: "Brightpath — Riverside", req: true, a: 60, cps: 0.6 },
    { x: 668, y: 56, w: 610, l: "Branch URL", v: "learnbrightpath.com/riverside", a: 104, cps: 0.9 },
    { x: 24, y: 142, w: 400, l: "Phone Number", v: "(555) 014-7720", req: true, a: 140, cps: 0.9 },
    { x: 446, y: 142, w: 400, l: "Fax Number", v: "(555) 014-7721", req: true, a: 160, cps: 1.2 },
    { x: 868, y: 142, w: 410, l: "Tax Number", v: "TX-48-2210", req: true, a: 176, cps: 1.2 },
    { x: 24, y: 296, w: 610, l: "Street", v: "410 River Road", req: true, a: 210, cps: 0.9 },
    { x: 668, y: 296, w: 300, l: "City", v: "Austin", req: true, a: 236, cps: 0.9 },
    { x: 990, y: 296, w: 288, l: "State", v: "TX", req: true, a: 252, cps: 0.9 },
    { x: 24, y: 382, w: 300, l: "Postal Code", v: "78701", req: true, a: 266, cps: 0.9 },
    { x: 346, y: 382, w: 300, l: "Country", v: "United States", req: true, a: 282, cps: 1, sel: true },
  ];
  const pts: P3[] = [[0, 800, 500], [30, ADD.x, ADD.y], [44, ADD.x, ADD.y]];
  F.forEach((q) => { const p = bfPt(q.x, q.y, q.w); pts.push([q.a - 4, p.x, p.y], [q.a + 8, p.x, p.y]); });
  const NX = brNextPt();
  pts.push([340, NX.x, NX.y], [356, NX.x, NX.y], [D, NX.x, NX.y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, ADD.x - 140, 140, 1.9], [48, 820, 330, 1.25], [64, MX(500), 320, 1.55], [130, MX(800), 330, 1.45], [196, MX(500), 480, 1.5], [300, MX(500), 520, 1.5], [330, NX.x - 200, NX.y - 40, 1.6], [D, NX.x - 200, NX.y - 40, 1.6]];
  return (
    <FStage g={g} keys={keys} url={form ? `${BR_URL}/subBranchform` : BR_URL} cur={cur} ripple={Math.max(rip(g, 40), rip(g, 352))} active="Branch Management" chip={[2, !form ? "Add New Branch" : g < 200 ? "Step 1 · Branch Information" : g < 330 ? "Step 1 · Address Information" : "Next"]}>
      {!form ? <BrList rows={BRS} press={g >= 34 && g < 46} /> : (
        <BrFormShell s={0} press={g >= 346 && g < 356}>
          <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>Branch Information <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Enter the basic details about your branch</span></div>
          <div style={{ position: "absolute", left: 24, top: 252, fontSize: 15, fontWeight: 800, color: INK }}>Address Information</div>
          {F.map((q) => <BF key={q.l} x={q.x} y={q.y} w={q.w} l={q.l} req={q.req} select={q.sel} v={typed(g, q.a, q.v, q.cps)} glow={g >= q.a - 4 && g < q.a + q.v.length / q.cps + 4} />)}
        </BrFormShell>
      )}
    </FStage>
  );
};

// ═══ m3 — Contact Person 1 + 2 ══════════════════════════════════════════════
const SceneContactBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const s = g < 160 ? 1 : 2;
  const P = s === 1 ? [["Full Name", "Nora Patel"], ["Email Address", "nora.patel@example.com"], ["Phone Number", "(555) 014-7730"]] : [["Full Name", "Marcus Hill"], ["Email Address", "marcus.hill@example.com"], ["Phone Number", "(555) 014-7731"]];
  const a0 = s === 1 ? 20 : 176;
  const fx = [24, 450, 876];
  const NX = brNextPt();
  const pts: P3[] = [[0, NX.x, NX.y]];
  [20, 176].forEach((base, k) => { fx.forEach((x, i) => { const p = bfPt(x, 56, 400); pts.push([base + i * 36 - 4, p.x, p.y], [base + i * 36 + 20, p.x, p.y]); }); if (k === 0) pts.push([142, NX.x, NX.y], [156, NX.x, NX.y]); });
  pts.push([300, NX.x, NX.y], [314, NX.x, NX.y], [D, NX.x, NX.y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, NX.x - 200, NX.y - 40, 1.6], [16, MX(650), 300, 1.35], [130, MX(650), 300, 1.35], [146, NX.x - 200, NX.y - 40, 1.6], [166, MX(650), 300, 1.35], [290, MX(650), 300, 1.35], [306, NX.x - 200, NX.y - 40, 1.6], [D, NX.x - 200, NX.y - 40, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${BR_URL}/subBranchform`} cur={cur} ripple={Math.max(rip(g, 152), rip(g, 310))} active="Branch Management" chip={[3, s === 1 ? "Step 2 · Primary Contact Person" : "Step 3 · Secondary Contact Person"]}>
      <BrFormShell s={s} press={(g >= 146 && g < 156) || (g >= 304 && g < 314)}>
        <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>{s === 1 ? "Primary Contact Person" : "Secondary Contact Person"} <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Enter details for the {s === 1 ? "primary" : "secondary"} contact person</span></div>
        {P.map(([l, v], i) => <BF key={s + l} x={fx[i]} y={56} w={400} l={l} req v={typed(g, a0 + i * 36, v, 1.1)} glow={g >= a0 + i * 36 - 4 && g < a0 + i * 36 + 26} />)}
      </BrFormShell>
    </FStage>
  );
};

// ═══ m4 — About & Social → Documents → Create Branch ════════════════════════
const SceneDocsBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const s = g < 170 ? 3 : 4;
  const NX = brNextPt(), CR = brNextPt(true);
  const ABOUT = bfPt(24, 56, 1254);
  const SOC = ["Facebook", "Twitter", "LinkedIn", "Instagram", "GitHub"];
  const socPt = (i: number) => ({ x: MX(24 + 24 + (i % 3) * 418 + 200), y: MY(200 + 240 + Math.floor(i / 3) * 70 + 20) });
  const up = (i: number) => g >= [212, 252, 9999][i];
  const docPt = (i: number) => ({ x: MX(24 + 24 + i * 418 + 200), y: MY(200 + 150) });
  const cur = path(g, [[0, NX.x, NX.y], [24, ABOUT.x, ABOUT.y + 10], [80, ABOUT.x, ABOUT.y + 10], [96, socPt(0).x, socPt(0).y], [126, socPt(2).x, socPt(2).y], [150, NX.x, NX.y], [164, NX.x, NX.y], [196, docPt(0).x, docPt(0).y], [210, docPt(0).x, docPt(0).y], [236, docPt(1).x, docPt(1).y], [250, docPt(1).x, docPt(1).y], [300, CR.x, CR.y], [316, CR.x, CR.y], [D, CR.x, CR.y]]);
  const keys: CamKey[] = [[0, NX.x - 200, NX.y - 40, 1.6], [20, MX(650), 330, 1.35], [150, MX(650), 360, 1.35], [170, MX(650), 330, 1.35], [280, MX(650), 330, 1.35], [300, CR.x - 200, CR.y - 40, 1.6], [330, 800, 420, 1.15], [D, 800, 420, 1.15]];
  return (
    <FStage g={g} keys={keys} url={`${BR_URL}/subBranchform`} cur={cur} ripple={Math.max(rip(g, 160), rip(g, 208), rip(g, 248), rip(g, 312))} active="Branch Management" chip={[4, s === 3 ? "Step 4 · About & Social Media" : g < 300 ? "Step 5 · Logo and documents" : "Create Branch"]}
      over={g >= 318 ? <Toast g={g} at={318} text="Branch created successfully" x={1100} y={66} /> : undefined}>
      <BrFormShell s={s} last={s === 4} press={(g >= 154 && g < 164) || (g >= 308 && g < 318)}>
        {s === 3 ? (<>
          <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>About & Social Media <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Tell us about your branch and connect your social media</span></div>
          <BF x={24} y={56} w={1254} h={110} l="About Branch" v={typed(g, 28, "Our Riverside campus offers evening Medical Assistant and Pharmacy Technician cohorts, five minutes from the River Road station.", 2.2)} ph="Describe your branch, its mission, and services..." glow={g >= 24 && g < 88} />
          <div style={{ position: "absolute", left: 24, top: 206, fontSize: 15, fontWeight: 800, color: INK }}>Social Media Links</div>
          {SOC.map((n, i) => <MInput key={n} x={24 + (i % 3) * 418} y={240 + Math.floor(i / 3) * 70} w={400} value={i === 0 && g >= 100 ? "facebook.com/brightpathriverside" : i === 2 && g >= 128 ? "linkedin.com/company/brightpath" : ""} ph={`${n} · https://example.com`} glow={(i === 0 && g >= 94 && g < 112) || (i === 2 && g >= 122 && g < 140)} />)}
        </>) : (<>
          <div style={{ position: "absolute", left: 24, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>Documents <span style={{ fontSize: 13, fontWeight: 500, color: GRAY }}>· Upload your branch logo and required documents</span></div>
          {["Branch Logo", "Business Document", "Other Document"].map((n, i) => (
            <div key={n} style={{ position: "absolute", left: 24 + i * 418, top: 60, width: 400 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{n}</div>
              <div style={{ marginTop: 8, height: 170, borderRadius: 12, border: `1.5px dashed ${up(i) ? "#86EFAC" : "#CBD5E1"}`, background: up(i) ? "#F0FDF4" : "#FAFBFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {up(i) ? (i === 0 ? <BrightLogo /> : <><span style={{ fontSize: 34 }}>📄</span><span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>riverside-business-license.pdf</span></>) : <><span style={{ fontSize: 28, color: "#9CA3AF" }}>⤒</span><span style={{ fontSize: 12.5, color: GRAY, textAlign: "center", padding: "0 20px" }}>{["Upload your branch logo (JPG, PNG)", "Upload business document (PDF, DOC, JPG, PNG)", "Upload additional document (PDF, DOC, JPG, PNG)"][i]}</span></>}
              </div>
            </div>
          ))}
        </>)}
      </BrFormShell>
    </FStage>
  );
};

// ═══ m5 — new location in the list (Pending) → View branch details ═════════
const SceneNewBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const rows = [NEW_BR, ...BRS];
  const ST = tblPt(BR_T.x, BR_T.y, BR_COLS, 4, 0);
  const EYE = tblPt(BR_T.x, BR_T.y, BR_COLS, 7, 1, 52, 28);
  const cur = path(g, [[0, 900, 500], [40, ST.x, ST.y], [120, ST.x, ST.y], [150, ST.x, ST.y + 52], [190, ST.x, ST.y + 52], [240, EYE.x, EYE.y], [258, EYE.x, EYE.y], [D, EYE.x, EYE.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MX(500), 260, 1.6], [120, MX(700), 260, 1.6], [200, MX(900), 280, 1.55], [D, MX(900), 280, 1.55]];
  return (
    <FStage g={g} keys={keys} url={BR_URL} cur={cur} ripple={rip(g, 254)} active="Branch Management" chip={[5, g < 140 ? "New location added as Pending" : g < 220 ? "Approved locations are live" : "👁 View branch details"]}>
      <BrList rows={rows} hlRow={g < 140 ? 0 : g < 220 ? 1 : 1} rowO={[fi(g, 4, 10)]} eye={g >= 248 && g < 262 ? 1 : -1} />
    </FStage>
  );
};

// ═══ m6 — branch details ══════════════════════════════════════════════════════
const SceneDetailBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const r = BRS[0];
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const vals = [18, 22, 31, 27, 35, 38, 33, 41, 46, 44, 52, 57];
  const grow = interpolate(g, [150, 220], [0, 1], { ...cl, easing: EZ });
  const stats: [string, string, string][] = [["Approved Students", "128", "🎓"], ["Transactions", "412", "🧾"], ["Transaction Amount", "$184,260", "💵"]];
  const cur = path(g, [[0, 900, 500], [40, MX(200), MY(150)], [130, MX(1100), MY(150)], [160, MX(300), MY(380)], [240, MX(800), MY(330)], [280, MX(180), MY(610)], [340, MX(180), MY(720)], [370, MX(900), MY(610)], [D, MX(900), MY(720)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(660), 190, 1.5], [130, MX(660), 190, 1.5], [160, MX(500), 360, 1.45], [250, MX(500), 380, 1.45], [280, MX(400), 650, 1.5], [350, MX(900), 650, 1.5], [D, MX(900), 650, 1.5]];
  return (
    <FStage g={g} keys={keys} url={`${BR_URL}/details/subbranchdetails-downtown`} cur={cur} ripple={0} active="Branch Management" chip={[6, g < 140 ? "Students and transactions for this location" : g < 270 ? "Monthly Transactions · last 12 months" : "Branch Information · Contact Details"]}>
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 24, top: 18, display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 15, fontWeight: 700, color: BLUE }}>← Back</span><span style={{ fontSize: 24, fontWeight: 800, color: INK }}>{r.name}</span><Pill t="approved" tone="green" /></div>
        <div style={{ position: "absolute", left: 24, top: 54, fontSize: 14, color: GRAY }}>Branch information, students, and transaction summary.</div>
        <UB x={1350 - 24 - 110} y={18} w={110} h={38} v="outline" label="Refresh" icon="↻" fs={13.5} />
        <UB x={1350 - 24 - 110 - 10 - 140} y={18} w={140} h={38} v="outline" label="Branch Login" icon="↗" fs={13.5} />
        {stats.map(([t, v, ic], i) => <div key={t} style={{ position: "absolute", left: 24 + i * 438, top: 92, width: 426, height: 104, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "16px 20px", boxSizing: "border-box", opacity: fi(g, 20 + i * 14, 8) }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: GRAY }}>{t}<span style={{ fontSize: 22 }}>{ic}</span></div><div style={{ marginTop: 6, fontSize: 32, fontWeight: 900, color: INK }}>{v}</div></div>)}
        <div style={{ position: "absolute", left: 24, top: 212, width: 1302, height: 310, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
          <div style={{ position: "absolute", left: 20, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>Monthly Transactions</div>
          <div style={{ position: "absolute", left: 20, top: 42, fontSize: 13, color: GRAY }}>Last 12 months transaction count and amount.</div>
          {vals.map((v, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 102, bottom: 40, width: 56, height: v * 3.6 * grow, borderRadius: "6px 6px 0 0", background: i === 11 ? BLUE : "#93C5FD" }} />)}
          {months.map((m, i) => <div key={m} style={{ position: "absolute", left: 60 + i * 102, bottom: 14, width: 56, textAlign: "center", fontSize: 12, color: GRAY }}>{m}</div>)}
        </div>
        {[["Branch Information", [["Branch Name", r.name], ["Slug", r.slug], ["Created By", r.by], ["Created At", r.c], ["Last Updated", r.u]]], ["Contact Details", [["Contact Name", "Grace Okafor"], ["Email", "downtown@learnbrightpath.com"], ["Phone", "(555) 014-6610"], ["Address", "88 Main Street, Austin, TX 78701"]]]].map(([t, rows]: any, k) => (
          <div key={t} style={{ position: "absolute", left: 24 + k * 658, top: 538, width: 644, height: 250, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, opacity: fi(g, 270 + k * 40, 10) }}>
            <div style={{ position: "absolute", left: 20, top: 14, fontSize: 16, fontWeight: 800, color: INK }}>{t}</div>
            {rows.map(([a, b]: string[], i: number) => <div key={a} style={{ position: "absolute", left: 20, right: 20, top: 48 + i * 38, display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ color: GRAY, fontWeight: 600 }}>{a}</span><span style={{ color: INK, fontWeight: 700 }}>{b}</span></div>)}
          </div>
        ))}
      </div>
    </FStage>
  );
};

// ═══ m7 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapBR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["🏢", "All locations", "One list, every status"], ["🪜", "5 steps", "Add a location"], ["👥", "Contacts", "Two per location"], ["📈", "Insights", "Students & transactions"]]} line={<>One head office. <span style={{ color: "#5EEAD4" }}>Every location.</span></>} />;
};
