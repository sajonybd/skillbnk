
// ═══════════════════════════════════════════════════════════════════════════
// Email Campaigns — scenes (sheet serial 23). Real UI (SB-Branch Marketing/EmailMarketing):
//  "Email Marketing" · "Create and send email campaigns to users" · "Enter Email Subject/Body..." · Add ·
//  columns Created By / Email Subject / Users / Sent / Failed / Scheduled / Note / Creation Date / Last Update / Action
//  (Delivery Reports · Cron Jobs · Edit).  Modal "Create New Email" · "Step 1: Select your audience" /
//  "Step 2: Compose your email" · Audience → Email · "Import Users (Add Mode)" · User Type (All / Approved /
//  Pending) · Program · Session · toast "Users filtered successfully" · "N Result" · Next.
//  Step 2: "Template Based" ("Use a pre-designed email template from SendGrid") / "Custom Email" ("Create your
//  own custom email body") · Sender · Subject ("Write a meaningful subject") · Email Body · "Include user name in
//  email" · "Reply to (Optional)" · "Comment/Note" · Back / Save As New / Send · toast "Email sent successfully".
//  DeliveryReports "Delivery Reports" · "View delivery statistics and recipient details" · Sent N / Failed N ·
//  Export to CSV · Email: / Sent Date: / Time:.  CronModal "Cron Jobs" · "Enter cron expression" · Active ·
//  "Click to generate" · Cancel / Save.
// ═══════════════════════════════════════════════════════════════════════════
const EM_URL = "branch.skillbnk.com/email-marketing";
const EM_COLS: TCol[] = [["Created By", 190], ["Email Subject", 300], ["Users", 70], ["Sent", 70], ["Failed", 70], ["Scheduled", 100], ["Note", 150], ["Creation Date", 130], ["Last Update", 110], ["Action", 112]];
const EM_ADD = { x: 1350 - 24 - 100, y: 22, w: 100, h: 40 };
const EM_T = { x: 24, y: 96 };
type EmRow = { s: string; u: number; se: number; fa: number; sch: boolean; note: string; c: string; o?: number };
const EM_ROWS: EmRow[] = [
  { s: "Your Medical Assistant orientation is Monday", u: 32, se: 32, fa: 0, sch: false, note: "Fall cohort", c: "Sep 29, 2026" },
  { s: "Week 3 recap + lab checklist", u: 28, se: 27, fa: 1, sch: true, note: "Weekly recap", c: "Sep 22, 2026" },
  { s: "Phlebotomy open house — Oct 18", u: 140, se: 138, fa: 2, sch: false, note: "Leads", c: "Sep 15, 2026" },
];
const NEW_EM: EmRow = { s: "Welcome to Brightpath — your first week", u: 24, se: 24, fa: 0, sch: false, note: "Fall welcome", c: "Oct 8, 2026" };
const emCells = (r: EmRow, act?: number): React.ReactNode[] => [<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar t="GO" s={28} c1="#14B8A6" c2="#0F766E" />Grace Okafor</span>, <b>{r.s}</b>, r.u, <b style={{ color: "#16A34A" }}>{r.se}</b>, <b style={{ color: "#DC2626" }}>{r.fa}</b>, r.sch ? <Pill t="Yes" tone="green" /> : <span style={{ color: GRAY }}>No</span>, <span style={{ color: "#374151" }}>{r.note}</span>, r.c, r.c, <span style={{ display: "flex", gap: 6 }}><IcoBtn t="📊" hl={act === 0} /><IcoBtn t="⏱" hl={act === 1} c="#7C3AED" /><IcoBtn t="✎" hl={act === 2} /></span>];
const emActPt = (row: number, a: number) => ({ x: MX(EM_T.x + EM_COLS.slice(0, 9).reduce((s, c) => s + c[1], 0) + 12 + a * 38 + 16), y: MY(EM_T.y + TBL_HEAD + row * 56 + 28) });
const EmList: React.FC<{ rows: EmRow[]; press?: boolean; act?: [number, number]; hlRow?: number; hlCol?: number }> = ({ rows, press, act, hlRow, hlCol }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="Email Marketing" sub="Create and send email campaigns to users" x={24} y={14} />
    <SearchBox x={EM_ADD.x - 10 - 320} y={22} w={320} ph="Enter Email Subject/Body..." />
    <UB {...EM_ADD} label="Add" icon="＋" press={press} />
    <Tbl x={EM_T.x} y={EM_T.y} cols={EM_COLS} rowH={56} rows={rows.map((r, i) => emCells(r, act && act[0] === i ? act[1] : undefined))} hlRow={hlRow} hlCol={hlCol} rowO={rows.map((r) => r.o ?? 1)} />
  </div>
);
const EMB = { x: 250, y: 18, w: 1100, h: 820 };
const EmStepHead: React.FC<{ step: 1 | 2 }> = ({ step }) => (
  <div style={{ position: "absolute", left: 24, top: 84, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700 }}>
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{step === 2 ? "✓" : 1}</span><span style={{ color: INK }}>Audience</span>
    <span style={{ width: 120, height: 3, background: step === 2 ? BLUE : LINE }} />
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: step === 2 ? BLUE : LINE, color: step === 2 ? "#fff" : GRAY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>2</span><span style={{ color: step === 2 ? INK : GRAY }}>Email</span>
  </div>
);
const emIn = (x: number, y: number, w: number) => ({ x: EMB.x + x + w / 2, y: EMB.y + y + 47 });

// ═══ s0 — HOOK: "BCC chaos" ═════════════════════════════════════════════════
const SceneHookEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 175, B3 = 280;
  const addrs = ["maya.torres@example.com", "jordan.lee@example.com", "priya.nair@exmaple.com", "diego.a@example.com", "hana.s@example.com", "ethan.b@example.com", "grace.kim@example.com", "sam.okafor@example.com", "lucas.w@example.com", "zara.k@example.com", "nina.p@example.com", "omar.r@example.com"];
  const n = Math.min(addrs.length, Math.floor(interpolate(g, [20, 90], [0, addrs.length], cl)));
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  const bounce = Math.round(interpolate(g, [110, 160], [0, 6], cl));
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <HookLine g={g} at={2} top={60} size={54}>Copy. Paste. <span style={{ color: "#F87171" }}>Forty-eight email addresses.</span></HookLine>
          <div style={{ position: "absolute", left: 360, top: 170, width: 1200, height: 700, borderRadius: 18, background: "#fff", boxShadow: "0 40px 100px #000C", overflow: "hidden" }}>
            <div style={{ height: 48, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 17, fontWeight: 800, color: INK }}>New message</div>
            <div style={{ padding: "14px 22px", borderBottom: `1px solid ${LINE}`, fontSize: 16, color: GRAY }}>To: <span style={{ color: INK }}>me</span></div>
            <div style={{ padding: "14px 22px", borderBottom: `1px solid ${LINE}`, fontSize: 16, color: GRAY, display: "flex", flexWrap: "wrap", gap: 8 }}>Bcc: {addrs.slice(0, n).map((a) => <span key={a} style={{ padding: "4px 10px", borderRadius: 999, background: a.includes("exmaple") ? "#FEE2E2" : "#F3F4F6", color: a.includes("exmaple") ? "#B91C1C" : INK, fontSize: 15 }}>{a}</span>)}{n >= addrs.length && <span style={{ fontSize: 15, color: GRAY }}>+36 more…</span>}</div>
            <div style={{ padding: "16px 22px", fontSize: 18, color: INK }}>Hi everyone, <span style={{ background: "#FEF3C7" }}>[NAME]</span>, your class starts Monday…</div>
            {bounce > 0 && <div style={{ position: "absolute", right: 24, bottom: 24, padding: "16px 20px", borderRadius: 14, background: "#FEF2F2", border: "2px solid #FCA5A5" }}><div style={{ fontSize: 15, fontWeight: 800, color: "#B91C1C" }}>⚠ Mail Delivery Subsystem</div><div style={{ fontSize: 30, fontWeight: 900, color: "#DC2626" }}>{bounce} bounced</div></div>}
          </div>
          <HookLine g={g} at={120} top={900} size={34} color="#FCA5A5">And you still don't know who actually got it.</HookLine>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <HookLine g={g} at={B2} top={150} size={46} color="#CBD5E1">Most LMS platforms send you <span style={{ color: "#FCA5A5" }}>somewhere else</span> to email learners.</HookLine>
          {[["📤", "Export CSV"], ["📥", "Import to email tool"], ["💸", "Pay per contact"], ["🔁", "Repeat next week"]].map(([ic, t], i) => <div key={t} style={{ position: "absolute", left: 240 + i * 380, top: 420, width: 300, height: 260, borderRadius: 20, background: "#141A2B", border: "1px solid #334155", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: fi(g, B2 + 10 + i * 10, 8) }}><span style={{ fontSize: 60 }}>{ic}</span><span style={{ fontSize: 26, fontWeight: 800, color: "#E2E8F0" }}>{t}</span>{i < 3 && <span style={{ position: "absolute", right: -58, top: 110, fontSize: 40, color: "#475569" }}>→</span>}</div>)}
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={200} />
          <div style={{ position: "absolute", left: 110, top: 280, width: 760, fontSize: 66, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>Pick a program.<br /><span style={{ color: "#5EEAD4" }}>Every learner's name.</span><br />One click.</div>
          <div style={{ position: "absolute", left: 1000, top: 200, width: 800, height: 640, borderRadius: 22, background: "#fff", boxShadow: "0 40px 100px #000C", padding: 32, boxSizing: "border-box", opacity: sp(g, B3 + 6, fps) }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: GRAY, letterSpacing: 2 }}>AUDIENCE</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}><Pill t="Approved" tone="green" /><Pill t="Medical Assistant — Fall 2026" tone="blue" /><Pill t="Evening cohort" tone="blue" /></div>
            <div style={{ marginTop: 26, fontSize: 15, fontWeight: 800, color: GRAY, letterSpacing: 2 }}>PREVIEW</div>
            {LEARNERS.slice(0, 4).map((l, i) => <div key={l.n} style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, border: `1px solid ${LINE}`, fontSize: 19, color: INK, opacity: fi(g, B3 + 24 + i * 8, 6) }}>Welcome, <b style={{ color: BP }}>{l.n.split(" ")[0]}</b>! Your first week at Brightpath…</div>)}
            <div style={{ marginTop: 18, display: "flex", gap: 10, opacity: fi(g, B3 + 64, 8) }}><Pill t="✓ Sent 24" tone="green" /><Pill t="Failed 0" tone="gray" /><Pill t="⏱ Every Monday" tone="blue" /></div>
          </div>
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ s1 — Email Marketing list ═════════════════════════════════════════════
const SceneListEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = bMenuPt("Email Marketing");
  const colX = (i: number) => tblPt(EM_T.x, EM_T.y, EM_COLS, i, -1, 56).x;
  const hy = MY(EM_T.y + 23);
  const seq = [1, 2, 3, 4, 5, 9];
  const T0 = 110, ST = 30;
  const hl = g >= T0 - 4 && g < T0 + seq.length * ST ? seq[Math.min(seq.length - 1, Math.floor((g - T0 + 4) / ST))] : -1;
  const pts: P3[] = [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [96, colX(1), hy]];
  seq.forEach((c, i) => pts.push([T0 + i * ST, colX(c), hy], [T0 + i * ST + 16, colX(c), hy + 60]));
  pts.push([290, MX(ctr(EM_ADD).x), MY(ctr(EM_ADD).y)], [D, MX(ctr(EM_ADD).x), MY(ctr(EM_ADD).y)]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 280, 330, 1.9], [66, 280, 330, 1.9], [100, MX(420), 260, 1.5], [200, MX(700), 260, 1.5], [270, MX(1100), 200, 1.6], [D, MX(1100), 160, 1.7]];
  const names = { 1: "Email Subject", 2: "Users", 3: "Sent", 4: "Failed", 5: "Scheduled", 9: "Action" } as Record<number, string>;
  return (
    <BStage g={g} keys={keys} url={opened ? EM_URL : "branch.skillbnk.com/dashboard"} cur={cur} ripple={rip(g, 66)} active={opened ? "Email Marketing" : "Dashboard"} chip={[1, !opened ? "Marketing Tools → Email Marketing" : hl >= 0 ? `Every campaign · ${names[hl]}` : "Add a new email"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <EmList rows={EM_ROWS} hlCol={hl} />}
    </BStage>
  );
};

// ═══ s2 — Step 1: audience (User Type · Program · Session → select) ════════
const SceneAudEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const mo = fi(g, 30, 8);
  const ADD = { x: MX(ctr(EM_ADD).x), y: MY(ctr(EM_ADD).y) };
  const UT = emIn(24, 128, 330), PG = emIn(374, 128, 330), SE = emIn(724, 128, 352);
  const res = g >= 196;
  const NEXT = { x: EMB.x + EMB.w - 24 - 60, y: EMB.y + EMB.h - 42 };
  const unsel = [3]; // one learner opted out
  const chkOn = (i: number) => res && !(unsel.includes(i) && g >= 268);
  const rowPt = (i: number) => ({ x: EMB.x + 24 + 30, y: EMB.y + 290 + 40 + i * 44 + 22 });
  const cur = path(g, [[0, ADD.x, ADD.y], [20, ADD.x, ADD.y], [30, ADD.x, ADD.y], [60, UT.x, UT.y], [80, UT.x, UT.y], [96, UT.x, UT.y + 80], [104, UT.x, UT.y + 80], [126, PG.x, PG.y], [140, PG.x, PG.y], [166, SE.x, SE.y], [190, SE.x, SE.y], [240, rowPt(3).x, rowPt(3).y], [268, rowPt(3).x, rowPt(3).y], [370, NEXT.x, NEXT.y], [390, NEXT.x, NEXT.y], [D, NEXT.x, NEXT.y]]);
  const keys: CamKey[] = [[0, MX(1100), 160, 1.7], [24, MX(1100), 160, 1.7], [40, 800, 420, 1.05], [56, 800, 220, 1.5], [196, 800, 220, 1.5], [220, 700, 460, 1.4], [300, 700, 520, 1.4], [360, NEXT.x - 300, NEXT.y - 120, 1.6], [D, NEXT.x - 300, NEXT.y - 120, 1.6]];
  const utOpen = g >= 82 && g < 104;
  return (
    <BStage g={g} keys={keys} url={EM_URL} cur={cur} ripple={Math.max(rip(g, 26), rip(g, 78), rip(g, 100), rip(g, 136), rip(g, 186), rip(g, 264), rip(g, 386))} active="Email Marketing" chip={[2, g < 120 ? "Step 1 · User Type" : g < 196 ? "Pick the program and session" : g < 300 ? "Untick anyone who shouldn't get it" : "Next"]}
      over={<>
        <Modal box={EMB} title="Create New Email" sub="Step 1: Select your audience" o={mo}>
          <EmStepHead step={1} />
          <UB x={EMB.w - 24 - 220} y={78} w={220} h={38} v="outline" label="Import Users (Add Mode)" fs={13.5} />
          <MInput x={24} y={128} w={330} label="User Type" value={g >= 100 ? "Approved" : ""} ph="Select User Type" select glow={g >= 60 && g < 104} />
          <MInput x={374} y={128} w={330} label="Program" value={g >= 136 ? "Medical Assistant — Fall 2026" : ""} ph="Select Program" select glow={g >= 126 && g < 142} />
          <MInput x={724} y={128} w={352} label="Session" value={g >= 186 ? "Evening cohort" : ""} ph="Select Session" select glow={g >= 166 && g < 192} />
          {utOpen && <div style={{ position: "absolute", left: 24, top: 200, width: 330, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, boxShadow: "0 12px 30px #0002", zIndex: 5 }}>{["All", "Approved", "Pending"].map((o) => <div key={o} style={{ padding: "10px 14px", fontSize: 14, fontWeight: 600, background: o === "Approved" ? BLUE_SOFT : "#fff" }}>{o}</div>)}</div>}
          <div style={{ position: "absolute", left: 24, top: 250, fontSize: 16, fontWeight: 800, color: INK, opacity: fi(g, 196, 8) }}>{res ? (g >= 268 ? 23 : 24) : 0} Result</div>
          <div style={{ position: "absolute", left: 24, top: 290, width: EMB.w - 48, height: 430, borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden", opacity: fi(g, 196, 8) }}>
            <div style={{ height: 40, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 18, fontSize: 13.5, fontWeight: 800, color: "#374151" }}><span style={{ width: 50 }}>Select</span><span style={{ width: 260 }}>Name</span><span style={{ width: 340 }}>Email</span><span>Phone</span></div>
            {LEARNERS.map((l, i) => <div key={l.n} style={{ height: 44, borderBottom: "1px solid #F1F2F4", display: "flex", alignItems: "center", padding: "0 16px", gap: 18, fontSize: 14, color: INK, background: chkOn(i) ? "#F5F7FF" : "#fff", opacity: unsel.includes(i) && !chkOn(i) ? 0.5 : 1 }}><span style={{ width: 50 }}><Chk on={chkOn(i)} /></span><span style={{ width: 260, fontWeight: 700 }}>{l.n}</span><span style={{ width: 340, color: GRAY }}>{l.e}</span><span style={{ color: GRAY }}>{l.p}</span></div>)}
          </div>
          <UB x={EMB.w - 24 - 120 - 10 - 100} y={EMB.h - 62} w={100} h={40} v="outline" label="Cancel" />
          <UB x={EMB.w - 24 - 120} y={EMB.h - 62} w={120} h={40} label="Next" press={g >= 382 && g < 392} />
        </Modal>
        {g >= 198 && g < 260 && <Toast g={g} at={198} text="Users filtered successfully" x={1120} y={60} />}
      </>}>
      <EmList rows={EM_ROWS} press={g >= 22 && g < 32} />
    </BStage>
  );
};

// ═══ s3 — Step 2: Custom Email · Sender · Subject · Body with {{name}} ══════
const SceneComposeEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 450;
  const g = gt(f, dur, D);
  const custom = g >= 70;
  const TB = { x: EMB.x + 24 + 150, y: EMB.y + 150 }, CE = { x: EMB.x + 24 + 470, y: EMB.y + 150 };
  const SND = emIn(24, 200, 520), SUB = emIn(564, 200, 512);
  const BODY = { x: EMB.x + 24 + 500, y: EMB.y + 286 + 27 + 90 };
  const TOG = { x: EMB.x + 24 + 20, y: EMB.y + 520 + 11 };
  const NOTE = emIn(564, 556, 512);
  const SEND = { x: EMB.x + EMB.w - 24 - 60, y: EMB.y + EMB.h - 42 };
  const body = typed(g, 216, "Hi {{name}},\n\nWelcome to Brightpath! Your first class is Monday at 6 PM in Room 204. Bring your photo ID and wear scrubs.\n\nSee you there!", 1.6);
  const cur = path(g, [[0, SEND.x, SEND.y], [26, TB.x, TB.y], [44, TB.x, TB.y], [62, CE.x, CE.y], [72, CE.x, CE.y], [100, SND.x, SND.y], [116, SND.x, SND.y], [134, SUB.x, SUB.y], [200, SUB.x, SUB.y], [212, BODY.x, BODY.y], [300, BODY.x, BODY.y], [320, TOG.x, TOG.y], [334, TOG.x, TOG.y], [356, NOTE.x, NOTE.y], [384, NOTE.x, NOTE.y], [420, SEND.x, SEND.y], [436, SEND.x, SEND.y], [D, SEND.x, SEND.y]]);
  const keys: CamKey[] = [[0, SEND.x - 300, SEND.y - 120, 1.6], [20, 800, 230, 1.5], [96, 800, 260, 1.5], [206, 800, 420, 1.4], [310, 800, 520, 1.4], [400, SEND.x - 300, SEND.y - 120, 1.6], [D, SEND.x - 300, SEND.y - 120, 1.6]];
  const on = interpolate(g, [326, 334], [0, 1], cl);
  return (
    <BStage g={g} keys={keys} url={EM_URL} cur={cur} ripple={Math.max(rip(g, 68), rip(g, 112), rip(g, 330), rip(g, 432))} active="Email Marketing" chip={[3, g < 96 ? "Template Based or Custom Email" : g < 206 ? "Sender · Subject" : g < 316 ? "Write it once — {{name}} personalises it" : g < 410 ? "Include user name · note" : "Send"]}
      over={<Modal box={EMB} title="Create New Email" sub="Step 2: Compose your email" o={1}>
        <EmStepHead step={2} />
        {[["Template Based", "Use a pre-designed email template from SendGrid"], ["Custom Email", "Create your own custom email body"]].map(([t, d], i) => { const sel = custom ? i === 1 : i === 0; return <div key={t} style={{ position: "absolute", left: 24 + i * 320, top: 126, width: 300, height: 52, borderRadius: 10, border: `2px solid ${sel ? BLUE : LINE}`, background: sel ? BLUE_SOFT : "#fff", padding: "6px 14px", boxSizing: "border-box" }}><div style={{ fontSize: 14.5, fontWeight: 800, color: sel ? BLUE : INK }}>{t}</div><div style={{ fontSize: 11.5, color: GRAY }}>{d}</div></div>; })}
        <MInput x={24} y={200} w={520} label="Sender" value={g >= 112 ? "Brightpath Admissions · hello@learnbrightpath.com" : ""} ph="Select Sender" select glow={g >= 100 && g < 118} />
        <MInput x={564} y={200} w={512} label="Subject" value={typed(g, 136, "Welcome to Brightpath — your first week", 0.8)} ph="Write a meaningful subject" glow={g >= 134 && g < 204} />
        <div style={{ position: "absolute", left: 24, top: 286, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Email Body</div>
        <div style={{ position: "absolute", left: 24, top: 312, width: 1052, height: 190, borderRadius: 8, border: `1px solid ${g >= 212 && g < 304 ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: g >= 212 && g < 304 ? "0 0 0 3px #C7D2FE" : "none", overflow: "hidden" }}>
          <div style={{ height: 34, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 16, padding: "0 12px", fontSize: 14, color: "#374151", fontWeight: 800 }}><span>B</span><i>I</i><u>U</u><span>≡</span><span>🔗</span><span>🖼</span></div>
          <div style={{ padding: "10px 14px", fontSize: 14.5, color: INK, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{body.split("{{name}}").map((p, i, a) => <React.Fragment key={i}>{p}{i < a.length - 1 && <span style={{ background: "#DBEAFE", color: BLUE, fontWeight: 800, borderRadius: 4, padding: "0 4px" }}>{"{{name}}"}</span>}</React.Fragment>)}</div>
        </div>
        <div style={{ position: "absolute", left: 24, top: 520, display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, fontWeight: 600, color: "#374151" }}><Toggle on={on} />Include user name in email</div>
        <MInput x={24} y={556} w={520} label="Reply to (Optional)" value="admissions@learnbrightpath.com" ph="Enter email to receive reply" />
        <MInput x={564} y={556} w={512} label="Comment/Note" value={typed(g, 358, "Fall welcome", 0.5)} ph="Write a note here" glow={g >= 356 && g < 388} />
        <UB x={EMB.w - 24 - 120 - 10 - 150 - 10 - 100} y={EMB.h - 62} w={100} h={40} v="outline" label="Back" />
        <UB x={EMB.w - 24 - 120 - 10 - 150} y={EMB.h - 62} w={150} h={40} v="sec" label="Save As New" />
        <UB x={EMB.w - 24 - 120} y={EMB.h - 62} w={120} h={40} label={g >= 438 ? "Sending..." : "Send"} press={g >= 428 && g < 438} />
      </Modal>}>
      <EmList rows={EM_ROWS} />
    </BStage>
  );
};

// ═══ s4 — sent → new row → Delivery Reports ═════════════════════════════════
const SceneSentEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const rows = [{ ...NEW_EM, o: fi(g, 10, 10) }, ...EM_ROWS];
  const SE = tblPt(EM_T.x, EM_T.y, EM_COLS, 3, 0, 56);
  const RP = emActPt(0, 0);
  const BOX = { x: 400, y: 70, w: 800, h: 700 };
  const mo = g >= 150 ? fi(g, 150, 8) : 0;
  const cur = path(g, [[0, 900, 500], [40, SE.x, SE.y], [90, SE.x + 70, SE.y], [130, RP.x, RP.y], [146, RP.x, RP.y], [200, BOX.x + 400, BOX.y + 160], [300, BOX.x + 400, BOX.y + 480], [330, BOX.x + BOX.w - 110, BOX.y + 100], [D, BOX.x + BOX.w - 110, BOX.y + 100]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MX(560), 200, 1.6], [110, MX(1100), 210, 1.6], [156, 800, 420, 1.12], [D, 800, 420, 1.12]];
  return (
    <BStage g={g} keys={keys} url={EM_URL} cur={cur} ripple={rip(g, 142)} active="Email Marketing" chip={[4, g < 120 ? "Sent to 24 learners · 0 failed" : "Delivery Reports — who got it, and when"]}
      over={<>
        {g < 120 && <Toast g={g} at={6} text="Email sent successfully" x={1150} y={60} />}
        <Modal box={BOX} title="Delivery Reports" sub="View delivery statistics and recipient details" o={mo}>
          <div style={{ position: "absolute", left: 24, top: 86, display: "flex", gap: 10 }}><Pill t="Sent 24 Email Successful" tone="green" /><Pill t="Failed 0 Email" tone="gray" /></div>
          <UB x={BOX.w - 24 - 140} y={78} w={140} h={36} v="outline" label="Export to CSV" fs={13} />
          {LEARNERS.slice(0, 7).map((l, i) => <div key={l.n} style={{ position: "absolute", left: 24, top: 132 + i * 76, width: BOX.w - 48, height: 66, borderRadius: 10, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", boxSizing: "border-box", opacity: fi(g, 164 + i * 6, 8) }}><Avatar t={l.n.split(" ").map((s) => s[0]).join("")} s={36} /><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{l.n}</div><div style={{ fontSize: 13, color: GRAY }}>Email: {l.e}</div></div><div style={{ fontSize: 12.5, color: GRAY, textAlign: "right" }}>Sent Date: Oct 8, 2026<br />Time: 9:02 AM</div></div>)}
        </Modal>
      </>}>
      <EmList rows={rows} hlRow={0} act={g >= 136 && g < 150 ? [0, 0] : undefined} />
    </BStage>
  );
};

// ═══ s5 — Cron Jobs: repeat it ════════════════════════════════════════════════
const SceneCronEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const rows = [{ ...NEW_EM, s: "Week 1 check-in — how is it going?", sch: g >= 250 }, ...EM_ROWS];
  const CR = emActPt(0, 1);
  const BOX = { x: 500, y: 260, w: 600, h: 300 };
  const mo = g >= 60 && g < 250 ? Math.min(fi(g, 60, 8), fo(g, 242, 8)) : 0;
  const IN = { x: BOX.x + 300, y: BOX.y + 114 };
  const SV = { x: BOX.x + BOX.w - 24 - 48, y: BOX.y + BOX.h - 42 };
  const SCH = tblPt(EM_T.x, EM_T.y, EM_COLS, 5, 0, 56);
  const cur = path(g, [[0, 800, 500], [40, CR.x, CR.y], [56, CR.x, CR.y], [90, IN.x, IN.y], [150, IN.x, IN.y], [220, SV.x, SV.y], [238, SV.x, SV.y], [280, SCH.x, SCH.y], [D, SCH.x, SCH.y]]);
  const keys: CamKey[] = [[0, 800, 420, 1.12], [30, MX(1100), 210, 1.6], [64, 800, 420, 1.4], [240, 800, 420, 1.4], [270, MX(800), 210, 1.6], [D, MX(800), 210, 1.6]];
  return (
    <BStage g={g} keys={keys} url={EM_URL} cur={cur} ripple={Math.max(rip(g, 52), rip(g, 234))} active="Email Marketing" chip={[5, g < 60 ? "Cron Jobs" : g < 250 ? "Every Monday at 9 — automatically" : "Scheduled: Yes"]}
      over={<CronBox g={g} at={90} box={BOX} o={mo} save={g >= 230 && g < 240} expr={typed(g, 94, "0 9 * * 1", 0.25)} human="At 09:00 AM, only on Monday" />}>
      <EmList rows={rows} act={g >= 46 && g < 60 ? [0, 1] : undefined} hlRow={g >= 250 ? 0 : -1} />
    </BStage>
  );
};

// ═══ s6 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapEM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["🎯", "Audience", "Program · session · status"], ["✍", "Compose", "{{name}} in every email"], ["📊", "Reports", "Sent · failed · when"], ["⏱", "Repeat", "Cron jobs on autopilot"]]} line={<>Every learner. <span style={{ color: "#5EEAD4" }}>By name. On time.</span></>} />;
};
