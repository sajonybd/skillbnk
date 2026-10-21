
// ═══════════════════════════════════════════════════════════════════════════
// Programs, Instructors & Staff — scenes (sheet serial 21). Real UI (SB-Company):
//  AllPrograms: "All Bootcamps" · "Information about all Bootcamps" · Add New · "Enter Program Name..." · columns
//   SN / Name (delivery · type) / Pricing / Branch ("Not enrollable yet" + "Select branches", or branch tags +
//   "Edit branches") / Category / Published / Featured / Actions.  Edit program tabs: Course info · Branches ·
//   Progress settings · Layout & content.  Branchs.tsx: "Branches" · Select All · Deselect All · Save ·
//   "Search branches..." · branch cards (checkbox, status, name, slug) · toast "Branches updated successfully".
//  AllInstructors: "All Instructors" · "All instructors information are available here." · Add New Instructor ·
//   columns SN / Instructor Name / Email / About Instructor / Created By / Creation Date / Action.
//   CreateInstructorModal "Add New Instructor" · "To add new instructor, complete the form below." · Full Name* ·
//   Email* · About · Upload Image (optional) · Cancel / Add · toast "Instructor added successfully".
//  RoleList: "Role List" · "All role information is available here" · Add Role · columns Role Name / Description /
//   Created By / Creation Date / Last Update / Action.  Role modal "Add New Role" · Role Name · Description ·
//   Permissions (All switch, "Search permission names...", groups Dashboard / Branch Management / Staff Management /
//   Role Management / Menu Builder / Navigation / Chat) · Add · toast "Role added successfully".
//  StaffList: "Staff List" · "All information on staff members is here" · Add Staff · columns Staff Name / Email /
//   Phone Number / Roles / Status / Created By / Creation Date / Action.  AddStaffModal "Add New Staff" ·
//   "Fill in the details to add a new staff member" · Email* ("Staff will receive an invitation to this email
//   address") · Roles* ("You can assign multiple roles to a staff member") · Cancel / Add Staff ·
//   toast "Staff added successfully".
// ═══════════════════════════════════════════════════════════════════════════
type PgRow = { n: string; meta: string; price: string; br: string[]; cat: string; pub: boolean; feat: boolean };
const PGS: PgRow[] = [
  { n: "Medical Assistant", meta: "native · program", price: "$2,400", br: ["Downtown", "Eastside"], cat: "Healthcare", pub: true, feat: true },
  { n: "Pharmacy Technician", meta: "native · program", price: "$1,800", br: ["Downtown"], cat: "Healthcare", pub: true, feat: false },
  { n: "Phlebotomy Basics", meta: "native · program", price: "$950", br: [], cat: "Healthcare", pub: false, feat: false },
  { n: "CPR & First Aid", meta: "native · course", price: "Free", br: ["Downtown", "Eastside", "Northgate"], cat: "Safety", pub: true, feat: false },
];
const PG_COLS: TCol[] = [["SN", 50], ["Name", 300], ["Pricing", 110], ["Branch", 340], ["Category", 150], ["Published", 110], ["Featured", 100], ["Actions", 142]];
const PG_T = { x: 24, y: 160, rowH: 64 };
const PG_URL = "company.skillbnk.com/courses-programs/all-bootcamps";
const pgCells = (r: PgRow, i: number, brHl = false, newBr?: string[]): React.ReactNode[] => {
  const br = newBr ?? r.br;
  return [<span style={{ color: GRAY }}>{i + 1}</span>,
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 40, height: 40, borderRadius: 8, background: `linear-gradient(135deg,${BP},#134E4A)`, display: "inline-block", flexShrink: 0 }} /><span><b style={{ color: INK }}>{r.n}</b><br /><span style={{ fontSize: 12, color: GRAY }}>{r.meta}</span></span></span>,
    <b>{r.price}</b>,
    br.length ? <span style={{ display: "flex", gap: 6, alignItems: "center" }}>{br.map((b) => <Pill key={b} t={b} tone="blue" />)}<span style={{ color: GRAY }}>✎</span></span>
      : <span style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ fontSize: 12.5, color: "#B45309", fontWeight: 700 }}>Not enrollable yet</span><span style={{ fontSize: 12.5, fontWeight: 700, border: `1px solid ${LINE}`, borderRadius: 7, padding: "5px 10px", boxShadow: brHl ? "0 0 0 3px #A5B4FC" : "none" }}>Select branches</span></span>,
    r.cat, <Toggle on={r.pub ? 1 : 0} />, <Toggle on={r.feat ? 1 : 0} />, <span style={{ display: "flex", gap: 6 }}><IcoBtn t="✎" /><IcoBtn t="🕘" c="#7C3AED" /></span>];
};
const PgList: React.FC<{ hlCol?: number; hlRow?: number; brHl?: boolean; row2?: string[] }> = ({ hlCol, hlRow, brHl, row2 }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="All Bootcamps" sub="Information about all Bootcamps" x={24} y={16} />
    <UB x={1350 - 24 - 120} y={22} w={120} label="Add New" icon="＋" />
    <SearchBox x={24} y={96} w={340} ph="Enter Program Name..." />
    <Tbl x={PG_T.x} y={PG_T.y} cols={PG_COLS} rowH={PG_T.rowH} rows={PGS.map((r, i) => pgCells(r, i, brHl && i === 2, i === 2 ? row2 : undefined))} hlCol={hlCol} hlRow={hlRow} />
  </div>
);
const SEL_BR_PT = { x: MX(PG_T.x + 50 + 300 + 110 + 12 + 130 + 55), y: MY(PG_T.y + TBL_HEAD + 2 * PG_T.rowH + PG_T.rowH / 2) };

// ═══ p0 — HOOK ═════════════════════════════════════════════════════════════
const SceneHookPP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 196, B3 = 281;
  const msgs: [string, string, string, boolean][] = [["Sofia", "SP", "Where did the Fall Medical Assistant program go?? 😳", false], ["Liam", "LC", "It's gone. 140 enrollments attached.", false], ["Ava", "AR", "Who deleted it?", false], ["System", "⚙", "Last change by: admin", true], ["Liam", "LC", "…we ALL log in as admin.", false]];
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 900, borderRadius: 28, background: "#0F172A", border: "1px solid #334155", boxShadow: "0 40px 100px #000C" }}>
            <div style={{ padding: "22px 28px", borderBottom: "1px solid #1E293B", fontSize: 22, fontWeight: 800, color: "#E2E8F0" }}># training-team <span style={{ fontSize: 16, color: "#64748B" }}>· Monday 8:04 AM</span></div>
            {msgs.map(([n, a, m, sys], i) => { const at = 8 + i * 26; const p = sp(g, at, fps, { damping: 14 }); return <div key={i} style={{ display: "flex", gap: 14, padding: "16px 28px", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
              <span style={{ width: 48, height: 48, borderRadius: 12, background: sys ? "#7F1D1D" : "#1E3A8A", color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a}</span>
              <div><div style={{ fontSize: 17, fontWeight: 800, color: sys ? "#F87171" : "#CBD5E1" }}>{n}</div><div style={{ marginTop: 4, fontSize: sys ? 30 : 26, fontWeight: sys ? 900 : 600, color: sys ? "#FCA5A5" : "#F1F5F9", fontFamily: sys ? "monospace" : FONT }}>{m}</div></div>
            </div>; })}
          </div>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontSize: 30, fontWeight: 800, color: "#8A96B2", letterSpacing: 3 }}>MOST LMS PLATFORMS GIVE YOU</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 370, textAlign: "center" }}>
            <span style={{ position: "relative", fontSize: 110, fontWeight: 900, color: "#F1F5F9" }}>1 admin login
              <span style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `${interpolate(g, [B2 + 40, B2 + 62], [0, 105], cl)}%`, background: "#EF4444", borderRadius: 6 }} /></span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#FCA5A5", opacity: fi(g, B2 + 50, 8) }}>…and hope nobody clicks the wrong thing.</div>
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={180} />
          <div style={{ position: "absolute", left: 110, top: 260, width: 780, fontSize: 68, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>Everyone gets a role.<br /><span style={{ color: "#5EEAD4" }}>Only the access they need.</span></div>
          {[["Sofia Park", "Admissions", ["Dashboard"]], ["Liam Chen", "Branch Manager", ["Dashboard", "Branch Management"]], ["Nadia Ross", "Program Coordinator", ["Dashboard", "Menu Builder", "Chat"]]].map(([n, r, ps]: any, i) => <div key={n} style={{ position: "absolute", left: 1000, top: 200 + i * 230, width: 800, height: 200, borderRadius: 20, background: "#fff", boxShadow: "0 30px 70px #000A", padding: 26, boxSizing: "border-box", opacity: sp(g, B3 + 16 + i * 10, fps), transform: `translateX(${(1 - sp(g, B3 + 16 + i * 10, fps)) * 80}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Avatar t={n.split(" ").map((s: string) => s[0]).join("")} s={48} /><div><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>{n}</div><Pill t={r} tone="blue" /></div><span style={{ marginLeft: "auto", fontSize: 30 }}>🔐</span></div>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>{ps.map((p: string) => <span key={p} style={{ fontSize: 16, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: "#DCFCE7", color: "#15803D" }}>✓ {p}</span>)}<span style={{ fontSize: 16, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: "#F3F4F6", color: GRAY }}>✕ Everything else</span></div>
          </div>)}
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ p1 — All Bootcamps: locations per program ══════════════════════════════
const SceneListPP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = menuPt("Courses & Programs");
  const BRC = tblPt(PG_T.x, PG_T.y, PG_COLS, 3, 0, PG_T.rowH, 90);
  const PRC = tblPt(PG_T.x, PG_T.y, PG_COLS, 2, 0, PG_T.rowH);
  const cur = path(g, [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [110, PRC.x, PRC.y], [150, PRC.x, PRC.y + 64], [170, BRC.x, BRC.y], [220, BRC.x, BRC.y + 64], [260, SEL_BR_PT.x - 110, SEL_BR_PT.y], [300, SEL_BR_PT.x - 110, SEL_BR_PT.y], [D, SEL_BR_PT.x - 110, SEL_BR_PT.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 330, 1.9], [66, 300, 330, 1.9], [100, MX(560), 330, 1.45], [240, MX(700), 360, 1.55], [270, SEL_BR_PT.x - 60, SEL_BR_PT.y, 1.9], [D, SEL_BR_PT.x - 60, SEL_BR_PT.y, 1.9]];
  return (
    <FStage g={g} keys={keys} url={opened ? PG_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={rip(g, 66)} active={opened ? "Courses & Programs" : "Dashboard"} chip={[1, !opened ? "Company portal → Courses & Programs" : g < 160 ? "All Bootcamps · pricing per program" : g < 250 ? "Branch · where each program is offered" : "Not enrollable yet — no location chosen"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <PgList hlCol={g >= 100 && g < 160 ? 2 : g >= 160 ? 3 : -1} hlRow={g >= 250 ? 2 : -1} />}
    </FStage>
  );
};

// ═══ p2 — Select branches → Branches tab → Save ═════════════════════════════
const BR_CARDS = [["Downtown", "downtown", "Austin, TX"], ["Eastside", "eastside", "Austin, TX"], ["Northgate", "northgate", "Round Rock, TX"], ["Riverside", "riverside", "Austin, TX"]];
const brCardPt = (i: number) => ({ x: MX(48 + (i % 2) * 640 + 300), y: MY(270 + Math.floor(i / 2) * 140 + 60) });
const BRT_SAVE = { x: 1350 - 48 - 90, y: 186, w: 90, h: 38 };
const ScenePickPP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const edit = g >= 46;
  const on = (i: number) => (i === 0 && g >= 132) || (i === 2 && g >= 178);
  const saved = g >= 262;
  const back = g >= 300;
  const SV = { x: MX(ctr(BRT_SAVE).x), y: MY(ctr(BRT_SAVE).y) };
  const NEWBR = tblPt(PG_T.x, PG_T.y, PG_COLS, 3, 2, PG_T.rowH, 90);
  const cur = path(g, [[0, SEL_BR_PT.x, SEL_BR_PT.y], [30, SEL_BR_PT.x, SEL_BR_PT.y], [44, SEL_BR_PT.x, SEL_BR_PT.y], [80, MX(500), MY(140)], [110, brCardPt(0).x, brCardPt(0).y], [132, brCardPt(0).x, brCardPt(0).y], [160, brCardPt(2).x, brCardPt(2).y], [178, brCardPt(2).x, brCardPt(2).y], [240, SV.x, SV.y], [258, SV.x, SV.y], [300, NEWBR.x, NEWBR.y], [D, NEWBR.x, NEWBR.y]]);
  const keys: CamKey[] = [[0, SEL_BR_PT.x - 60, SEL_BR_PT.y, 1.9], [44, SEL_BR_PT.x - 60, SEL_BR_PT.y, 1.9], [60, 820, 330, 1.2], [100, MX(660), 380, 1.4], [200, MX(660), 380, 1.4], [236, SV.x - 200, SV.y + 60, 1.8], [290, SV.x - 200, SV.y + 60, 1.8], [310, NEWBR.x, NEWBR.y, 1.6], [D, NEWBR.x, NEWBR.y, 1.6]];
  return (
    <FStage g={g} keys={keys} url={back ? PG_URL : edit ? `${PG_URL}/edit/subprogram-phlebotomy?tab=branch` : PG_URL} cur={cur} ripple={Math.max(rip(g, 40), rip(g, 128), rip(g, 174), rip(g, 254))} active="Courses & Programs" chip={[2, !edit ? "Select branches" : g < 230 ? "Branches tab · tick the locations" : back ? "Now enrollable at those locations" : "Save"]}
      over={saved && g < 300 ? <Toast g={g} at={262} text="Branches updated successfully" x={1100} y={100} /> : undefined}>
      {!edit || back ? <PgList brHl={!edit && g >= 30} hlRow={back ? 2 : -1} row2={back ? ["Downtown", "Northgate"] : undefined} /> : (
        <div style={{ position: "absolute", inset: 0 }}>
          <PageTitle t="Phlebotomy Basics" sub="Edit program" back x={24} y={16} />
          <div style={{ position: "absolute", left: 24, top: 92, display: "flex", gap: 6, padding: 4, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}` }}>{["Course info", "Branches", "Progress settings", "Layout & content"].map((t) => <span key={t} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, background: t === "Branches" ? BLUE_SOFT : "transparent", color: t === "Branches" ? BLUE : GRAY }}>{t}</span>)}</div>
          <div style={{ position: "absolute", left: 24, top: 160, width: 1302, height: 620, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
          <div style={{ position: "absolute", left: 48, top: 192, fontSize: 18, fontWeight: 800, color: INK }}>Branches</div>
          <UB x={BRT_SAVE.x - 10 - 120 - 10 - 110} y={BRT_SAVE.y} w={110} h={38} v="outline" label="Select All" fs={13.5} />
          <UB x={BRT_SAVE.x - 10 - 120} y={BRT_SAVE.y} w={120} h={38} v="outline" label="Deselect All" fs={13.5} />
          <UB {...BRT_SAVE} label={g >= 254 && g < 262 ? "Saving..." : "Save"} press={g >= 250 && g < 260} fs={13.5} />
          <SearchBox x={48} y={232} w={400} ph="Search branches..." />
          {BR_CARDS.map(([n, s, loc], i) => <div key={n} style={{ position: "absolute", left: 48 + (i % 2) * 640, top: 290 + Math.floor(i / 2) * 140, width: 610, height: 120, borderRadius: 12, border: `${on(i) ? 2 : 1}px solid ${on(i) ? BLUE : LINE}`, background: on(i) ? "#F5F7FF" : "#fff", padding: 18, boxSizing: "border-box", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <Chk on={on(i)} /><span style={{ width: 52, height: 52, borderRadius: 12, background: BP, color: "#fff", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{n[0]}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 800, color: INK }}>Brightpath — {n}</div><div style={{ fontSize: 13, color: GRAY, fontFamily: "monospace" }}>{s}</div><div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>📍 {loc}</div></div>
            <Pill t={i === 3 ? "pending" : "approved"} tone={i === 3 ? "amber" : "green"} />
          </div>)}
        </div>
      )}
    </FStage>
  );
};

// ═══ p3 — Instructors → Add New Instructor ═══════════════════════════════════
const IN_COLS: TCol[] = [["SN", 50], ["Instructor Name", 250], ["Email", 260], ["About Instructor", 380], ["Created By", 140], ["Creation Date", 130], ["Action", 92]];
const INS = [["Dr. Laura Bennett", "laura.bennett@example.com", "Clinical educator, 12 years in outpatient care"], ["James Ortiz", "james.ortiz@example.com", "Certified pharmacy technician trainer"], ["Mina Cho", "mina.cho@example.com", "Phlebotomy lead, hospital lab background"]];
const IN_ADD = { x: 1350 - 24 - 200, y: 22, w: 200, h: 40 };
const SceneInstPP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const BOX = { x: 500, y: 90, w: 600, h: 620 };
  const mo = g >= 60 && g < 300 ? Math.min(fi(g, 60, 8), fo(g, 292, 8)) : 0;
  const added = g >= 300;
  const ADD = { x: MX(ctr(IN_ADD).x), y: MY(ctr(IN_ADD).y) };
  const B = (y: number) => ({ x: BOX.x + 300, y: BOX.y + y });
  const OK = { x: BOX.x + BOX.w - 24 - 45, y: BOX.y + BOX.h - 44 };
  const rows = [...(added ? [["Grace Kim", "grace.kim@example.com", "Medical assistant instructor, 8 years in clinics"]] : []), ...INS];
  const cur = path(g, [[0, 800, 500], [30, ADD.x, ADD.y], [50, ADD.x, ADD.y], [80, B(140).x, B(140).y], [120, B(140).x, B(140).y], [130, B(226).x, B(226).y], [170, B(226).x, B(226).y], [180, B(330).x, B(330).y], [240, B(330).x, B(330).y], [256, B(500).x, B(500).y], [270, OK.x, OK.y], [290, OK.x, OK.y], [D, MX(400), MY(230)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, ADD.x - 160, 140, 1.9], [60, 800, 380, 1.25], [76, 800, 260, 1.55], [180, 800, 380, 1.5], [260, 900, 600, 1.45], [300, MX(560), 280, 1.4], [D, MX(560), 280, 1.4]];
  return (
    <FStage g={g} keys={keys} url="company.skillbnk.com/courses-programs/instructors" cur={cur} ripple={Math.max(rip(g, 46), rip(g, 286))} active="Courses & Programs" chip={[3, g < 60 ? "All Instructors → Add New Instructor" : g < 300 ? "Name · email · about · photo" : "Instructor added — ready to assign"]}
      over={<>
        <Modal box={BOX} title="Add New Instructor" sub="To add new instructor, complete the form below." o={mo}>
          <MInput x={24} y={96} w={BOX.w - 48} label="Full Name" req value={typed(g, 84, "Grace Kim", 0.4)} ph="Enter Instructor full name" glow={g >= 80 && g < 126} />
          <MInput x={24} y={182} w={BOX.w - 48} label="Email" req value={typed(g, 134, "grace.kim@example.com", 0.8)} ph="Enter Instructor email" glow={g >= 130 && g < 176} />
          <MInput x={24} y={268} w={BOX.w - 48} h={110} label="About" value={typed(g, 184, "Medical assistant instructor, 8 years in clinics.", 1)} ph="Write here (maximum 200 characters)" glow={g >= 180 && g < 246} />
          <div style={{ position: "absolute", left: 24, top: 410, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Upload Image (optional)</div>
          <div style={{ position: "absolute", left: 24, top: 436, width: BOX.w - 48, height: 96, borderRadius: 10, border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 13.5, color: GRAY }}>{g >= 258 ? <><Avatar t="GK" s={52} c1="#14B8A6" c2="#0F766E" /><b style={{ color: INK }}>grace-kim.jpg</b></> : "⤒ Upload Image"}</div>
          <UB x={BOX.w - 24 - 90 - 10 - 90} y={BOX.h - 64} w={90} v="red" label="Cancel" />
          <UB x={BOX.w - 24 - 90} y={BOX.h - 64} w={90} label="Add" press={g >= 280 && g < 290} />
        </Modal>
        {added && <Toast g={g} at={300} text="Instructor added successfully" x={1100} y={110} />}
      </>}>
      <div style={{ position: "absolute", inset: 0 }}>
        <PageTitle t="All Instructors" sub="All instructors information are available here." x={24} y={16} />
        <UB {...IN_ADD} label="Add New Instructor" icon="＋" press={g >= 40 && g < 50} />
        <SearchBox x={24} y={96} w={340} ph="Enter Instructor Email/Name..." />
        <Tbl x={24} y={160} cols={IN_COLS} rows={rows.map((r, i) => [<span style={{ color: GRAY }}>{i + 1}</span>, <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar t={r[0].replace("Dr. ", "").split(" ").map((s) => s[0]).join("")} s={30} />{r[0]}</span>, r[1], <span style={{ color: "#374151" }}>{r[2]}</span>, "Ava Reyes", i === 0 && added ? "Oct 7, 2026" : "Aug 2, 2026", <span style={{ display: "flex", gap: 6 }}><IcoBtn t="✎" /><IcoBtn t="🗑" c="#DC2626" /></span>])} hlRow={added ? 0 : -1} rowO={added ? [fi(g, 300, 10)] : []} />
      </div>
    </FStage>
  );
};

// ═══ p4 — Roles: Add Role with permissions ═══════════════════════════════════
const RL_COLS: TCol[] = [["SN", 50], ["Role Name", 220], ["Description", 460], ["Created By", 150], ["Creation Date", 140], ["Last Update", 140], ["Action", 142]];
const PERM_GROUPS = ["Dashboard", "Branch Management", "Staff Management", "Role Management", "Menu Builder", "Navigation", "Chat"];
const SceneRolePP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const BOX = { x: 420, y: 30, w: 760, h: 790 };
  const mo = g >= 50 && g < 340 ? Math.min(fi(g, 50, 8), fo(g, 332, 8)) : 0;
  const added = g >= 340;
  const ROLE_ADD = { x: 1350 - 24 - 120, y: 22, w: 120, h: 40 };
  const AD = { x: MX(ctr(ROLE_ADD).x), y: MY(ctr(ROLE_ADD).y) };
  const TOG = [0, 1, 4, 6];
  const togAt = (k: number) => 190 + k * 26;
  const pOn = (i: number) => TOG.includes(i) && g >= togAt(TOG.indexOf(i)) + 6;
  const pPt = (i: number) => ({ x: BOX.x + BOX.w - 24 - 20, y: BOX.y + 330 + i * 52 + 22 });
  const OK = { x: BOX.x + BOX.w - 24 - 45, y: BOX.y + BOX.h - 44 };
  const pts: P3[] = [[0, 800, 500], [26, AD.x, AD.y], [44, AD.x, AD.y], [70, BOX.x + 380, BOX.y + 120], [110, BOX.x + 380, BOX.y + 120], [120, BOX.x + 380, BOX.y + 210], [170, BOX.x + 380, BOX.y + 210]];
  TOG.forEach((i, k) => pts.push([togAt(k) - 8, pPt(i).x, pPt(i).y], [togAt(k) + 8, pPt(i).x, pPt(i).y]));
  pts.push([314, OK.x, OK.y], [332, OK.x, OK.y], [D, MX(500), MY(240)]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [22, AD.x - 120, 140, 1.9], [56, 800, 420, 1.12], [70, 800, 200, 1.6], [176, 800, 230, 1.6], [196, 860, 560, 1.4], [300, 860, 640, 1.4], [320, 1000, 700, 1.5], [345, MX(560), 260, 1.4], [D, MX(560), 260, 1.4]];
  const rows: string[][] = [...(added ? [["Program Coordinator", "Manages programs, menus and chat for all locations"]] : []), ["Owner", "Full access to every feature"], ["Branch Manager", "Runs a single location"], ["Admissions", "Handles enrollments and pending members"]];
  return (
    <FStage g={g} keys={keys} url="company.skillbnk.com/staff-management/roles" cur={cur} ripple={Math.max(rip(g, 40), rip(g, 328), ...TOG.map((_, k) => rip(g, togAt(k))))} active="Staff Management" chip={[4, g < 50 ? "Role List → Add Role" : g < 180 ? "Name the role" : g < 340 ? "Permissions — switch on only what they need" : "Role ready to assign"]}
      over={<>
        <Modal box={BOX} title="Add New Role" sub="To add new role, complete the form below." o={mo}>
          <MInput x={24} y={88} w={BOX.w - 48} label="Role Name" value={typed(g, 72, "Program Coordinator", 0.6)} ph="Enter role name (maximum is 70 characters)" glow={g >= 70 && g < 116} />
          <MInput x={24} y={174} w={BOX.w - 48} h={64} label="Description" value={typed(g, 122, "Manages programs, menus and chat for all locations", 1.2)} ph="Write here (maximum is 300 characters)" glow={g >= 120 && g < 168} />
          <div style={{ position: "absolute", left: 24, top: 262, fontSize: 17, fontWeight: 700, color: INK }}>Permissions</div>
          <div style={{ position: "absolute", right: 24, top: 262, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: GRAY }}>All <Toggle on={0} w={34} /></div>
          <div style={{ position: "absolute", left: 24, top: 288, width: BOX.w - 48, height: 34, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13, color: "#9CA3AF", boxSizing: "border-box" }}>⌕ Search permission names...</div>
          {PERM_GROUPS.map((n, i) => <div key={n} style={{ position: "absolute", left: 24, top: 330 + i * 52, width: BOX.w - 48, height: 44, borderRadius: 10, border: `1px solid ${pOn(i) ? "#A5B4FC" : LINE}`, background: pOn(i) ? "#F5F7FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxSizing: "border-box" }}><span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{n}</span><Toggle on={pOn(i) ? 1 : 0} /></div>)}
          <UB x={BOX.w - 24 - 90 - 10 - 90} y={BOX.h - 64} w={90} v="outline" label="Cancel" />
          <UB x={BOX.w - 24 - 90} y={BOX.h - 64} w={90} label="Add" press={g >= 324 && g < 334} />
        </Modal>
        {added && <Toast g={g} at={340} text="Role added successfully" x={1100} y={110} />}
      </>}>
      <div style={{ position: "absolute", inset: 0 }}>
        <PageTitle t="Role List" sub="All role information is available here" x={24} y={16} />
        <UB {...ROLE_ADD} label="Add Role" icon="＋" press={g >= 36 && g < 46} />
        <SearchBox x={24} y={96} w={340} ph="Enter Role Name..." />
        <Tbl x={24} y={160} cols={RL_COLS} rows={rows.map((r, i) => [<span style={{ color: GRAY }}>{i + 1}</span>, <b>{r[0]}</b>, <span style={{ color: "#374151" }}>{r[1]}</span>, "Ava Reyes", i === 0 && added ? "Oct 7, 2026" : "Jan 12, 2026", i === 0 && added ? "Oct 7, 2026" : "Sep 1, 2026", <span style={{ display: "flex", gap: 6 }}><IcoBtn t="✎" /><IcoBtn t="🗑" c="#DC2626" /></span>])} hlRow={added ? 0 : -1} rowO={added ? [fi(g, 340, 10)] : []} />
      </div>
    </FStage>
  );
};

// ═══ p5 — Staff: Add Staff (email + roles → invitation) ═════════════════════
const ST_COLS: TCol[] = [["Staff Name", 240], ["Email", 270], ["Phone Number", 160], ["Roles", 220], ["Status", 110], ["Created By", 140], ["Creation Date", 130], ["Action", 32 + 0]];
const SceneStaffPP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const BOX = { x: 480, y: 140, w: 640, h: 470 };
  const mo = g >= 56 && g < 320 ? Math.min(fi(g, 56, 8), fo(g, 312, 8)) : 0;
  const ST_ADD = { x: 1350 - 24 - 130, y: 22, w: 130, h: 40 };
  const AD = { x: MX(ctr(ST_ADD).x), y: MY(ctr(ST_ADD).y) };
  const EM = { x: BOX.x + 300, y: BOX.y + 117 };
  const RO = { x: BOX.x + 300, y: BOX.y + 255 };
  const OPT = { x: BOX.x + 200, y: BOX.y + 316 };
  const OK = { x: BOX.x + BOX.w - 24 - 60, y: BOX.y + BOX.h - 44 };
  const roles = g >= 214 ? ["Program Coordinator"] : [];
  const open = g >= 186 && g < 214;
  const cur = path(g, [[0, 800, 500], [30, AD.x, AD.y], [48, AD.x, AD.y], [80, EM.x, EM.y], [160, EM.x, EM.y], [180, RO.x, RO.y], [190, RO.x, RO.y], [206, OPT.x, OPT.y], [214, OPT.x, OPT.y], [282, OK.x, OK.y], [300, OK.x, OK.y], [D, OK.x, OK.y + 60]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, AD.x - 140, 140, 1.9], [60, 800, 380, 1.3], [76, 800, 300, 1.6], [170, 800, 380, 1.55], [270, 900, 520, 1.5], [320, 800, 420, 1.15], [D, 800, 420, 1.15]];
  const staff = [["Ava Reyes", "ava.reyes@example.com", "(555) 014-1001", "Owner", "Active"], ["Liam Chen", "liam.chen@example.com", "(555) 014-1002", "Branch Manager", "Active"], ["Sofia Park", "sofia.park@example.com", "(555) 014-1003", "Admissions", "Active"]];
  return (
    <FStage g={g} keys={keys} url="company.skillbnk.com/staff-management/staff-list" cur={cur} ripple={Math.max(rip(g, 44), rip(g, 186), rip(g, 210), rip(g, 296))} active="Staff Management" chip={[5, g < 56 ? "Staff List → Add Staff" : g < 180 ? "Email — they get an invitation" : g < 310 ? "Assign one or more roles" : "Staff added"]}
      over={<>
        <Modal box={BOX} title="Add New Staff" sub="Fill in the details to add a new staff member" o={mo}>
          <MInput x={24} y={90} w={BOX.w - 48} label="Email" req value={typed(g, 84, "nadia.ross@example.com", 0.9)} ph="Email address" glow={g >= 80 && g < 166} />
          <div style={{ position: "absolute", left: 24, top: 164, fontSize: 12.5, color: GRAY }}>Staff will receive an invitation to this email address</div>
          <div style={{ position: "absolute", left: 24, top: 204, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Roles <span style={{ color: "#EF4444" }}>*</span></div>
          <div style={{ position: "absolute", left: 24, top: 230, width: BOX.w - 48, height: 44, borderRadius: 8, border: `1px solid ${open ? "#A5B4FC" : "#D1D5DB"}`, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", boxSizing: "border-box", fontSize: 14, color: "#9CA3AF" }}>{roles.length ? roles.map((r) => <Pill key={r} t={r} tone="blue" />) : "Select roles"}<span style={{ marginLeft: "auto" }}>⌄</span></div>
          {open && <div style={{ position: "absolute", left: 24, top: 278, width: BOX.w - 48, background: "#fff", borderRadius: 8, border: `1px solid ${LINE}`, boxShadow: "0 12px 30px #0002", zIndex: 5 }}>{["Program Coordinator", "Branch Manager", "Admissions"].map((r, i) => <div key={r} style={{ padding: "10px 14px", fontSize: 14, fontWeight: 600, background: i === 0 ? BLUE_SOFT : "#fff", color: INK }}>{r}</div>)}</div>}
          <div style={{ position: "absolute", left: 24, top: 284, fontSize: 12.5, color: GRAY, opacity: open ? 0 : 1 }}>You can assign multiple roles to a staff member</div>
          <UB x={BOX.w - 24 - 120 - 10 - 90} y={BOX.h - 64} w={90} v="outline" label="Cancel" />
          <UB x={BOX.w - 24 - 120} y={BOX.h - 64} w={120} label={g >= 300 && g < 320 ? "Adding..." : "Add Staff"} press={g >= 292 && g < 302} />
        </Modal>
        {g >= 320 && <Toast g={g} at={320} text="Staff added successfully" x={1100} y={110} />}
      </>}>
      <div style={{ position: "absolute", inset: 0 }}>
        <PageTitle t="Staff List" sub="All information on staff members is here" x={24} y={16} />
        <UB {...ST_ADD} label="Add Staff" icon="＋" press={g >= 38 && g < 48} />
        <SearchBox x={24} y={96} w={340} ph="Enter Staff Name/Email..." />
        <Tbl x={24} y={160} cols={ST_COLS.slice(0, 7)} rows={staff.map((r) => [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar t={r[0].split(" ").map((s) => s[0]).join("")} s={30} />{r[0]}</span>, r[1], r[2], <Pill t={r[3]} tone="blue" />, <Pill t={r[4]} tone="green" />, "Ava Reyes", "Feb 3, 2026"])} />
      </div>
    </FStage>
  );
};

// ═══ p6 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapPP: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["📚", "Programs", "Offered where you choose"], ["👩‍🏫", "Instructors", "Profiles in one list"], ["🛡", "Roles", "Feature-by-feature access"], ["✉", "Staff", "Invited with their roles"]]} line={<>The right people. <span style={{ color: "#5EEAD4" }}>The right access.</span></>} />;
};
