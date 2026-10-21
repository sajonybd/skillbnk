
// ═══════════════════════════════════════════════════════════════════════════
// SMS Campaigns — scenes (sheet serial 24). Real UI (SB-Branch Marketing/SmsMarketing):
//  "SMS Marketing" · "The school creates SMS and sends to users" · "Enter SMS Body..." · Add · columns
//  Created By / SMS Body / Users / Sent / Failed / Scheduled / Note / Last Sent / Creation Date / Actions (Cron Jobs, Edit).
//  CreateEditSmsMarketingModal (full-screen) "Create New SMS" · "To create a new SMS, complete the form below." ·
//  Sender ("Select a sender number") · Message Body · "Include user name to this SMS" → "Please use {{name}} code in
//  your SMS body" · Comment/Note · Filter User: User Type (Program Approved / Program Pending / All), Select Program,
//  Select Session · Upload CSV (Drag and Drop / Select File) · user table (Select, User, Phone) · Export to CSV ·
//  Clear All · Save as New / Send SMS · toasts "SMS sent successfully".  Alert when Twilio isn't connected:
//  "You need to integrate Twilio to send SMS. Please contact your company administrator."
// ═══════════════════════════════════════════════════════════════════════════
const SM_URL = "branch.skillbnk.com/sms-marketing";
const SM_COLS: TCol[] = [["Created By", 180], ["SMS Body", 330], ["Users", 70], ["Sent", 70], ["Failed", 70], ["Scheduled", 100], ["Note", 140], ["Last Sent", 120], ["Creation Date", 120], ["Actions", 102]];
const SM_ADD = { x: 1350 - 24 - 100, y: 22, w: 100, h: 40 };
const SM_T = { x: 24, y: 96 };
type SmRow = { b: string; u: number; se: number; fa: number; sch: boolean; note: string; d: string; o?: number };
const SM_ROWS: SmRow[] = [
  { b: "Reminder: lab practical tomorrow 9 AM, bring scrubs.", u: 31, se: 31, fa: 0, sch: false, note: "Lab day", d: "Oct 6, 2026" },
  { b: "Campus closed Monday for the holiday. Classes resume Tuesday.", u: 140, se: 139, fa: 1, sch: false, note: "Closure", d: "Oct 2, 2026" },
  { b: "Weekly: your attendance summary is ready in the portal.", u: 96, se: 96, fa: 0, sch: true, note: "Weekly", d: "Sep 29, 2026" },
];
const NEW_SM: SmRow = { b: "Hi {{name}}, tonight's class moved to 6 PM, Room 204. See you there!", u: 23, se: 23, fa: 0, sch: false, note: "Room change", d: "Oct 8, 2026" };
const smCells = (r: SmRow, act?: number): React.ReactNode[] => [<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar t="GO" s={28} c1="#14B8A6" c2="#0F766E" />Grace Okafor</span>, <span style={{ color: INK }}>{r.b}</span>, r.u, <b style={{ color: "#16A34A" }}>{r.se}</b>, <b style={{ color: "#DC2626" }}>{r.fa}</b>, r.sch ? <Pill t="Yes" tone="green" /> : <span style={{ color: GRAY }}>No</span>, <span style={{ color: "#374151" }}>{r.note}</span>, r.d, r.d, <span style={{ display: "flex", gap: 6 }}><IcoBtn t="⏱" hl={act === 0} c="#7C3AED" /><IcoBtn t="✎" hl={act === 1} /></span>];
const smActPt = (row: number, a: number) => ({ x: MX(SM_T.x + SM_COLS.slice(0, 9).reduce((s, c) => s + c[1], 0) + 12 + a * 38 + 16), y: MY(SM_T.y + TBL_HEAD + row * 56 + 28) });
const SmList: React.FC<{ rows: SmRow[]; press?: boolean; act?: [number, number]; hlRow?: number; hlCol?: number }> = ({ rows, press, act, hlRow, hlCol }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="SMS Marketing" sub="The school creates SMS and sends to users" x={24} y={14} />
    <SearchBox x={SM_ADD.x - 10 - 320} y={22} w={320} ph="Enter SMS Body..." />
    <UB {...SM_ADD} label="Add" icon="＋" press={press} />
    <Tbl x={SM_T.x} y={SM_T.y} cols={SM_COLS} rowH={56} rows={rows.map((r, i) => smCells(r, act && act[0] === i ? act[1] : undefined))} hlRow={hlRow} hlCol={hlCol} rowO={rows.map((r) => r.o ?? 1)} />
  </div>
);
const SMB = { x: 16, y: 12, w: 1568, h: 830 };
const smIn = (x: number, y: number, w: number) => ({ x: SMB.x + x + w / 2, y: SMB.y + y + 47 });
const SMS_TEXT = "Hi {{name}}, tonight's class moved to 6 PM, Room 204. See you there!";
const SmsForm: React.FC<{ g: number; sender: boolean; body: string; inc: number; note: string; glow?: string; users: number; filt: { ut: boolean; pg: boolean; se: boolean }; send?: boolean; utOpen?: boolean; uncheck?: number }> = ({ g, sender, body, inc, note, glow, users, filt, send, utOpen, uncheck = -1 }) => (
  <Modal box={SMB} title="Create New SMS" sub="To create a new SMS, complete the form below." o={1}>
    {/* left: message */}
    <MInput x={24} y={96} w={740} label="Sender" value={sender ? "+1 555 014 2200 · Brightpath Downtown" : ""} ph="Select a sender number" select glow={glow === "sender"} />
    <MInput x={24} y={182} w={740} h={150} label="Message Body" value={body} ph="Enter message body..." glow={glow === "body"} />
    <div style={{ position: "absolute", left: 24, top: 366, fontSize: 12.5, color: body.length > 300 ? "#DC2626" : GRAY }}>{body.length}/300 · Max 300 characters</div>
    <div style={{ position: "absolute", left: 24, top: 400, display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, fontWeight: 600, color: "#374151" }}><Toggle on={inc} />Include user name to this SMS</div>
    {inc > 0.5 && <div style={{ position: "absolute", left: 24, top: 434, fontSize: 13, color: GRAY }}>Please use <code style={{ background: "#DBEAFE", color: BLUE, padding: "1px 5px", borderRadius: 4 }}>{"{{name}}"}</code> code in your SMS body</div>}
    <MInput x={24} y={470} w={740} label="Comment/Note" value={note} ph="Write a note here" glow={glow === "note"} />
    {/* right: Filter User */}
    <div style={{ position: "absolute", left: 790, top: 96, width: 754, height: 640, borderRadius: 12, border: `1px solid ${LINE}` }} />
    <div style={{ position: "absolute", left: 810, top: 110, fontSize: 16, fontWeight: 800, color: INK }}>Filter User</div>
    <MInput x={810} y={140} w={230} label="User Type" value={filt.ut ? "Program Approved" : ""} ph="All" select glow={glow === "ut"} />
    <MInput x={1052} y={140} w={230} label="Select Program" value={filt.pg ? "Medical Assistant" : ""} ph="All" select glow={glow === "pg"} />
    <MInput x={1294} y={140} w={230} label="Select Session" value={filt.se ? "Evening cohort" : ""} ph="All" select glow={glow === "se"} />
    {utOpen && <div style={{ position: "absolute", left: 810, top: 212, width: 230, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, boxShadow: "0 12px 30px #0002", zIndex: 5 }}>{["All", "Program Approved", "Program Pending"].map((o) => <div key={o} style={{ padding: "9px 12px", fontSize: 13.5, fontWeight: 600, background: o === "Program Approved" ? BLUE_SOFT : "#fff" }}>{o}</div>)}</div>}
    <div style={{ position: "absolute", left: 810, top: 232, width: 714, height: 60, borderRadius: 10, border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 13.5, color: GRAY }}>⤒ Upload CSV · Drag and Drop or <b style={{ color: BLUE }}>Select File</b></div>
    <div style={{ position: "absolute", left: 810, top: 306, display: "flex", gap: 10, alignItems: "center" }}><b style={{ fontSize: 15, color: INK }}>{users} users</b><span style={{ fontSize: 13, color: BLUE, fontWeight: 700 }}>Export to CSV</span><span style={{ fontSize: 13, color: "#DC2626", fontWeight: 700 }}>Clear All</span></div>
    <div style={{ position: "absolute", left: 810, top: 336, width: 714, height: 380, borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ height: 38, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 16, fontSize: 13, fontWeight: 800, color: "#374151" }}><span style={{ width: 50 }}>Select</span><span style={{ width: 320 }}>User</span><span>Phone</span></div>
      {users > 0 && LEARNERS.map((l, i) => <div key={l.n} style={{ height: 42, borderBottom: "1px solid #F1F2F4", display: "flex", alignItems: "center", padding: "0 14px", gap: 16, fontSize: 13.5, opacity: fi(g, 4 + i * 2, 6) }}><span style={{ width: 50 }}><Chk on={i !== uncheck} /></span><span style={{ width: 320, fontWeight: 700, color: INK }}>{l.n}</span><span style={{ color: GRAY }}>Phone: {l.p}</span></div>)}
    </div>
    <UB x={SMB.w - 24 - 130 - 10 - 130} y={SMB.h - 62} w={130} h={40} v="sec" label="Save as New" />
    <UB x={SMB.w - 24 - 130} y={SMB.h - 62} w={130} h={40} label="Send SMS" icon="➤" press={send} />
  </Modal>
);

// ═══ q0 — HOOK: the clock is ticking ══════════════════════════════════════════
const SceneHookSM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 175, B3 = 285;
  const mins = Math.round(interpolate(g, [10, 150], [12 * 60 + 4 * 60 + 12, 12 * 60 + 5 * 60 + 58], cl));
  const hh = Math.floor(mins / 60) - 12, mm = mins % 60;
  const opened = Math.round(interpolate(g, [30, 150], [0, 3], cl));
  const ang = (mins % 60) * 6, hang = (hh % 12) * 30 + mm * 0.5;
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  const seats = 40;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <HookLine g={g} at={2} top={70} size={56}>Class moved to 6 PM. <span style={{ color: "#F87171" }}>You emailed everyone.</span></HookLine>
          <svg width="360" height="360" style={{ position: "absolute", left: 200, top: 300 }}>
            <circle cx="180" cy="180" r="170" fill="#0F172A" stroke="#F87171" strokeWidth="8" />
            {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={180 + 140 * Math.sin((i * Math.PI) / 6)} y1={180 - 140 * Math.cos((i * Math.PI) / 6)} x2={180 + 155 * Math.sin((i * Math.PI) / 6)} y2={180 - 155 * Math.cos((i * Math.PI) / 6)} stroke="#94A3B8" strokeWidth="5" />)}
            <line x1="180" y1="180" x2={180 + 85 * Math.sin((hang * Math.PI) / 180)} y2={180 - 85 * Math.cos((hang * Math.PI) / 180)} stroke="#F1F5F9" strokeWidth="10" strokeLinecap="round" />
            <line x1="180" y1="180" x2={180 + 130 * Math.sin((ang * Math.PI) / 180)} y2={180 - 130 * Math.cos((ang * Math.PI) / 180)} stroke="#F87171" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: 200, top: 690, width: 360, textAlign: "center", fontSize: 44, fontWeight: 900, color: "#F1F5F9", fontFamily: "monospace" }}>{hh}:{String(mm).padStart(2, "0")} PM</div>
          <div style={{ position: "absolute", left: 700, top: 300, width: 1000 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#94A3B8" }}>📧 Email opened</div>
            <div style={{ fontSize: 120, fontWeight: 900, color: "#EF4444", lineHeight: 1 }}>{opened}<span style={{ fontSize: 50, color: "#64748B" }}> / 40</span></div>
            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(10, 64px)", gap: 14 }}>{Array.from({ length: seats }).map((_, i) => <div key={i} style={{ width: 64, height: 48, borderRadius: 10, background: i < 6 ? "#7F1D1D" : "#1E293B", border: `2px solid ${i < 6 ? "#F87171" : "#334155"}`, opacity: fi(g, 40 + i, 6) }} />)}</div>
            <div style={{ marginTop: 18, fontSize: 24, fontWeight: 700, color: "#FCA5A5", opacity: fi(g, 110, 8) }}>6 students show up at 4:30 to a locked room.</div>
          </div>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <HookLine g={g} at={B2} top={260} size={50} color="#CBD5E1">Most LMS platforms can only send <span style={{ color: "#FCA5A5" }}>email</span>.</HookLine>
          <HookLine g={g} at={B2 + 30} top={420} size={72}>And urgent news <span style={{ color: "#F87171" }}>waits in the inbox.</span></HookLine>
          <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontSize: 120, opacity: fi(g, B2 + 40, 8), transform: `translateY(${Math.sin(g * 0.2) * 6}px)` }}>📥💤</div>
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={210} />
          <div style={{ position: "absolute", left: 110, top: 290, width: 760, fontSize: 66, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>Text the whole class.<br /><span style={{ color: "#5EEAD4" }}>By name. In seconds.</span></div>
          <div style={{ position: "absolute", left: 1000, top: 170, width: 800, display: "flex", flexDirection: "column", gap: 14 }}>
            {LEARNERS.slice(0, 6).map((l, i) => <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 16, background: "#fff", boxShadow: "0 16px 40px #0008", opacity: sp(g, B3 + 10 + i * 7, fps), transform: `translateX(${(1 - sp(g, B3 + 10 + i * 7, fps)) * 80}px)` }}>
              <Avatar t={l.n.split(" ").map((s) => s[0]).join("")} s={44} />
              <div style={{ flex: 1 }}><div style={{ display: "inline-block", padding: "8px 14px", borderRadius: "16px 16px 16px 4px", background: "#22C55E", color: "#fff", fontSize: 17, fontWeight: 600 }}>Hi {l.n.split(" ")[0]}, tonight's class moved to 6 PM.</div></div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#16A34A", opacity: fi(g, B3 + 30 + i * 7, 6) }}>✓ sent</span>
            </div>)}
          </div>
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ q1 — SMS Marketing list → Add ═══════════════════════════════════════════
const SceneListSM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = bMenuPt("SMS Marketing");
  const colX = (i: number) => tblPt(SM_T.x, SM_T.y, SM_COLS, i, -1, 56).x;
  const hy = MY(SM_T.y + 23);
  const AD = { x: MX(ctr(SM_ADD).x), y: MY(ctr(SM_ADD).y) };
  const cur = path(g, [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [100, colX(1), hy], [140, colX(1), hy + 100], [170, colX(3), hy], [200, colX(4), hy + 60], [230, colX(5), hy], [270, AD.x, AD.y], [286, AD.x, AD.y], [D, AD.x, AD.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 280, 330, 1.9], [66, 280, 330, 1.9], [100, MX(480), 260, 1.5], [200, MX(700), 260, 1.5], [256, AD.x - 140, 160, 1.8], [D, AD.x - 140, 160, 1.8]];
  return (
    <BStage g={g} keys={keys} url={opened ? SM_URL : "branch.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 66), rip(g, 282))} active={opened ? "SMS Marketing" : "Dashboard"} chip={[1, !opened ? "Marketing Tools → SMS Marketing" : g < 250 ? "Every text · sent · failed · scheduled" : "Add"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <SmList rows={SM_ROWS} press={g >= 278 && g < 288} hlCol={g >= 100 && g < 160 ? 1 : g >= 160 && g < 250 ? 3 : -1} />}
    </BStage>
  );
};

// ═══ q2 — write the message: Sender · body with {{name}} · include name · note ═
const SceneWriteSM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const SN = smIn(24, 96, 740), BD = { x: SMB.x + 24 + 370, y: SMB.y + 182 + 27 + 75 }, TG = { x: SMB.x + 24 + 20, y: SMB.y + 400 + 11 }, NT = smIn(24, 470, 740);
  const inc = interpolate(g, [116, 124], [0, 1], cl);
  const body = typed(g, 150, SMS_TEXT, 0.55);
  const cur = path(g, [[0, 900, 500], [30, SN.x, SN.y], [46, SN.x, SN.y], [80, SN.x, SN.y + 70], [92, SN.x, SN.y + 70], [110, TG.x, TG.y], [124, TG.x, TG.y], [146, BD.x, BD.y], [290, BD.x, BD.y], [320, NT.x, NT.y], [370, NT.x, NT.y], [D, NT.x, NT.y + 120]]);
  const keys: CamKey[] = [[0, 800, 430, 1.05], [24, 420, 260, 1.6], [100, 420, 380, 1.6], [150, 420, 320, 1.55], [300, 420, 500, 1.5], [380, 420, 620, 1.45], [D, 420, 620, 1.45]];
  return (
    <BStage g={g} keys={keys} url={SM_URL} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 88), rip(g, 120))} active="SMS Marketing" chip={[2, g < 100 ? "Sender — your own Twilio number" : g < 146 ? "Include user name" : g < 316 ? "Use {{name}} — every learner sees their own" : "Comment/Note"]}
      over={<SmsForm g={g} sender={g >= 88} body={body} inc={inc} note={typed(g, 324, "Room change", 0.4)} glow={g >= 30 && g < 92 ? "sender" : g >= 146 && g < 300 ? "body" : g >= 320 && g < 372 ? "note" : undefined} users={0} filt={{ ut: false, pg: false, se: false }} />}
      >
      <SmList rows={SM_ROWS} />
    </BStage>
  );
};

// ═══ q3 — Filter User → users list → Send SMS ════════════════════════════════
const SceneSendSM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const UT = smIn(810, 140, 230), PG = smIn(1052, 140, 230), SE = smIn(1294, 140, 230);
  const SEND = { x: SMB.x + SMB.w - 24 - 65, y: SMB.y + SMB.h - 42 };
  const unc = { x: SMB.x + 810 + 14 + 25, y: SMB.y + 336 + 38 + 5 * 42 + 21 };
  const users = g >= 190 ? (g >= 270 ? 23 : 24) : 0;
  const sent = g >= 380;
  const cur = path(g, [[0, 420, 620], [30, UT.x, UT.y], [46, UT.x, UT.y], [62, UT.x, UT.y + 64], [74, UT.x, UT.y + 64], [110, PG.x, PG.y], [130, PG.x, PG.y], [160, SE.x, SE.y], [184, SE.x, SE.y], [250, unc.x, unc.y], [268, unc.x, unc.y], [350, SEND.x, SEND.y], [368, SEND.x, SEND.y], [D, SEND.x, SEND.y]]);
  const keys: CamKey[] = [[0, 420, 620, 1.45], [24, 1180, 230, 1.6], [190, 1180, 260, 1.6], [210, 1180, 480, 1.45], [300, 1180, 480, 1.45], [340, SEND.x - 260, SEND.y - 120, 1.6], [D, SEND.x - 260, SEND.y - 120, 1.6]];
  return (
    <BStage g={g} keys={keys} url={SM_URL} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 70), rip(g, 126), rip(g, 180), rip(g, 264), rip(g, 364))} active="SMS Marketing" chip={[3, g < 106 ? "Filter User · User Type" : g < 190 ? "Program · Session" : g < 330 ? "Your list — untick anyone" : "Send SMS"]}
      over={<>
        <SmsForm g={g - 186} sender body={SMS_TEXT} inc={1} note="Room change" glow={g >= 30 && g < 76 ? "ut" : g >= 110 && g < 132 ? "pg" : g >= 160 && g < 186 ? "se" : undefined} users={users} filt={{ ut: g >= 70, pg: g >= 126, se: g >= 180 }} send={g >= 362 && g < 372} utOpen={g >= 46 && g < 72} uncheck={g >= 266 ? 5 : -1} />
        {sent && <Toast g={g} at={380} text="SMS sent successfully" x={1180} y={60} />}
      </>}>
      <SmList rows={SM_ROWS} />
    </BStage>
  );
};

// ═══ q4 — back in the list → Cron Jobs for the weekly reminder ════════════════
const SceneRepeatSM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const rows = [{ ...NEW_SM, o: fi(g, 4, 10) }, ...SM_ROWS.map((r, i) => (i === 0 ? { ...r, sch: g >= 260 } : r))];
  const SE = tblPt(SM_T.x, SM_T.y, SM_COLS, 3, 0, 56);
  const CR = smActPt(1, 0);
  const BOX = { x: 500, y: 260, w: 600, h: 300 };
  const mo = g >= 120 && g < 258 ? Math.min(fi(g, 120, 8), fo(g, 250, 8)) : 0;
  const IN = { x: BOX.x + 300, y: BOX.y + 114 }, SV = { x: BOX.x + BOX.w - 24 - 48, y: BOX.y + BOX.h - 42 };
  const SCH = tblPt(SM_T.x, SM_T.y, SM_COLS, 5, 1, 56);
  const cur = path(g, [[0, 900, 500], [30, SE.x, SE.y], [80, SE.x + 70, SE.y], [104, CR.x, CR.y], [118, CR.x, CR.y], [150, IN.x, IN.y], [200, IN.x, IN.y], [232, SV.x, SV.y], [246, SV.x, SV.y], [290, SCH.x, SCH.y], [D, SCH.x, SCH.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, MX(560), 200, 1.6], [90, MX(1100), 230, 1.6], [126, 800, 420, 1.4], [250, 800, 420, 1.4], [270, MX(800), 230, 1.6], [D, MX(800), 230, 1.6]];
  return (
    <BStage g={g} keys={keys} url={SM_URL} cur={cur} ripple={Math.max(rip(g, 114), rip(g, 242))} active="SMS Marketing" chip={[4, g < 100 ? "Sent 23 · Failed 0" : g < 258 ? "Cron Jobs — the lab reminder, every Wednesday" : "Scheduled: Yes"]}
      over={<CronBox g={g} at={150} box={BOX} o={mo} save={g >= 240 && g < 250} expr={typed(g, 152, "0 16 * * 3", 0.25)} human="At 04:00 PM, only on Wednesday" />}>
      <SmList rows={rows} hlRow={g < 100 ? 0 : g >= 258 ? 1 : -1} act={g >= 108 && g < 120 ? [1, 0] : undefined} />
    </BStage>
  );
};

// ═══ q5 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapSM: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["📱", "Your number", "Twilio sender"], ["👋", "{{name}}", "Personal at scale"], ["🎯", "Audience", "Program · session"], ["⏱", "Repeat", "Reminders on schedule"]]} line={<>Urgent news, <span style={{ color: "#5EEAD4" }}>read in seconds.</span></>} />;
};
