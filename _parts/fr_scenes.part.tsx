
// ═══════════════════════════════════════════════════════════════════════════
// Form Responses — scenes (sheet serial 19). Real UI (SB-Company FormResponsesPage +
// form-builder-component/responses/[id]):  header "Responses: <form name>" · "Total Responses: N" ·
//  Back to Forms · Export (Excel) · card "Form Submissions" · table Submitted By / Submitted Date /
//  Signed In (Yes/No) / Actions (View Full Response) · pagination · "No responses yet".
//  Submitted By = learner name when signed in, else the email, else "Anonymous".
//  Modal "Full Response Details": Submitted By · Email · Submitted Date, then each form page (tab) with
//  label → value; "No responses in this section".  Export → "<Form>_Responses_<YYYY-MM-DD>.xlsx",
//  sheet "Responses", columns Submitted By / Email / Submitted Date + one column per field.
//  Toast "Responses exported successfully".  All Forms "View Responses" action + Submissions count.
//  No approve / enroll action exists on form responses (none shown).
// ═══════════════════════════════════════════════════════════════════════════
type RespT = { by: string; email: string; date: string; signed: boolean; name: string; dd: string; rating: number };
const RESP: RespT[] = [
  { by: "Jordan Lee", email: "jordan.lee@example.com", date: "Oct 6, 2026", signed: true, name: "Jordan Lee", dd: "Option 2", rating: 5 },
  { by: "maria.k@example.com", email: "maria.k@example.com", date: "Oct 6, 2026", signed: false, name: "Maria Kovacs", dd: "Option 1", rating: 4 },
  { by: "Anonymous", email: "-", date: "Oct 5, 2026", signed: false, name: "Sam", dd: "Option 3", rating: 5 },
  { by: "Priya Nair", email: "priya.nair@example.com", date: "Oct 5, 2026", signed: true, name: "Priya Nair", dd: "Option 1", rating: 4 },
  { by: "Diego Alvarez", email: "diego.a@example.com", date: "Oct 4, 2026", signed: true, name: "Diego Alvarez", dd: "Option 2", rating: 3 },
  { by: "hana.s@example.com", email: "hana.s@example.com", date: "Oct 4, 2026", signed: false, name: "Hana Sato", dd: "Option 2", rating: 5 },
  { by: "Ethan Brooks", email: "ethan.b@example.com", date: "Oct 3, 2026", signed: true, name: "Ethan Brooks", dd: "Option 3", rating: 4 },
  { by: "Anonymous", email: "-", date: "Oct 3, 2026", signed: false, name: "Lee", dd: "Option 1", rating: 5 },
  { by: "Grace Kim", email: "grace.kim@example.com", date: "Oct 2, 2026", signed: true, name: "Grace Kim", dd: "Option 2", rating: 5 },
];
const RT = { x: 44, top: 160, rowH: 52, cols: [["Submitted By", 400], ["Submitted Date", 340], ["Signed In", 260], ["Actions", 262]] as [string, number][] };
const rtColX = (i: number) => RT.x + RT.cols.slice(0, i).reduce((a, c) => a + c[1], 0);
const rtRowY = (i: number) => RT.top + 46 + i * RT.rowH;
const rtEyePt = (i: number) => ({ x: MX(rtColX(3) + 14 + 17), y: MY(rtRowY(i) + RT.rowH / 2) });
const RB = { back: { x: 1350 - 24 - 112 - 10 - 160, y: 22, w: 160, h: 40 }, exp: { x: 1350 - 24 - 112, y: 22, w: 112, h: 40 } };
const rbPt = (k: keyof typeof RB) => ({ x: MX(ctr(RB[k]).x), y: MY(ctr(RB[k]).y) });
const FR_URL = "company.skillbnk.com/form-builder-component/responses/f-9e4b12";
const RespPage: React.FC<{ total?: number; press?: string; hlCol?: number; hlRow?: number; eyePress?: number; rows?: RespT[] }> = ({ total = 24, press, hlCol = -1, hlRow = -1, eyePress = -1, rows = RESP }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="Responses: Campus Visit Feedback" sub={`Total Responses: ${total}`} x={24} y={16} />
    <UB {...RB.back} v="outline" label="Back to Forms" icon="←" press={press === "back"} />
    <div style={{ position: "absolute", left: RB.exp.x, top: RB.exp.y, width: RB.exp.w, height: 40, borderRadius: 8, background: "#16A34A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14.5, fontWeight: 700, transform: `scale(${press === "exp" ? 0.93 : 1})`, boxShadow: press === "exp" ? "0 0 0 4px #86EFAC" : "none" }}>⤓ Export</div>
    <div style={{ position: "absolute", left: 24, top: 96, width: 1302, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
    <div style={{ position: "absolute", left: 44, top: 116, fontSize: 18, fontWeight: 800, color: INK }}>Form Submissions</div>
    <div style={{ position: "absolute", left: RT.x, top: RT.top, width: 1262, borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ display: "flex", height: 46, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, alignItems: "center" }}>{RT.cols.map(([c, w], i) => <div key={c} style={{ width: w, padding: "0 14px", boxSizing: "border-box", fontSize: 13.5, fontWeight: 800, color: hlCol === i ? BLUE : "#374151", background: hlCol === i ? BLUE_SOFT : "transparent", height: "100%", display: "flex", alignItems: "center" }}>{c}</div>)}</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", height: RT.rowH, alignItems: "center", borderBottom: "1px solid #F1F2F4", background: hlRow === i ? "#F5F7FF" : "#fff" }}>
          <div style={{ width: 400, padding: "0 14px", boxSizing: "border-box", fontSize: 14.5, fontWeight: r.signed ? 700 : 500, color: r.by === "Anonymous" ? GRAY : INK, display: "flex", alignItems: "center", gap: 10 }}>{r.signed ? <Avatar t={r.by.split(" ").map((s) => s[0]).join("")} s={28} /> : <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#F3F4F6", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👤</span>}{r.by}</div>
          <div style={{ width: 340, padding: "0 14px", boxSizing: "border-box", fontSize: 14, color: "#374151" }}>{r.date}</div>
          <div style={{ width: 260, padding: "0 14px", boxSizing: "border-box" }}><span style={{ fontSize: 12.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: r.signed ? "#DCFCE7" : "#F3F4F6", color: r.signed ? "#15803D" : "#374151" }}>{r.signed ? "Yes" : "No"}</span></div>
          <div style={{ width: 262, padding: "0 14px", boxSizing: "border-box" }}><div style={{ width: 34, height: 34, borderRadius: 8, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: eyePress === i ? "0 0 0 3px #A5B4FC" : "none" }}>👁</div></div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 44, top: 740, fontSize: 13.5, color: GRAY }}>Showing 1–{rows.length} of {total}</div>
    <div style={{ position: "absolute", left: 1306 - 4 * 38, top: 732, display: "flex", gap: 6 }}>{["‹", "1", "2", "3", "›"].map((p, i) => <div key={i} style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${LINE}`, background: p === "1" ? BLUE : "#fff", color: p === "1" ? "#fff" : "#374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{p}</div>)}</div>
  </div>
);

// ═══ r0 — HOOK ══════════════════════════════════════════════════════════════
const SceneHookFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  return <Hook3 g={g} fps={fps} D={D} b2={150} b3={262}
    pain={<>A parent asks about their answer… and <span style={{ color: "#F87171" }}>you can't find it</span>.</>}
    painSub="Responses buried in inboxes, spreadsheets and screenshots."
    painCards={[["📩", "38 unread form emails"], ["📑", "Three copies of the same spreadsheet"], ["❓", "Who sent this one?"]]}
    other={<>don't keep your form answers <span style={{ color: "#FCA5A5" }}>in one place</span>.</>}
    otherItems={["Responses sent one email at a time", "No way to see who was signed in", "Copy-paste to get a report"]}
    win={<>Every response, <span style={{ color: "#5EEAD4" }}>one table</span>.</>}
    trust={["Who sent it, when, signed in or not", "Every answer, page by page", "One-click Excel export"]}
    visual={<HookCard title="Responses: Campus Visit Feedback">
      <div style={{ marginTop: 6, fontSize: 16, color: GRAY }}>Total Responses: 24</div>
      {RESP.slice(0, 8).map((r, i) => <div key={i} style={{ display: "flex", padding: "13px 4px", borderTop: "1px solid #F1F2F4", fontSize: 17, opacity: fi(g, 266 + i * 5, 6) }}><span style={{ flex: 1, fontWeight: 700, color: INK }}>{r.by}</span><span style={{ width: 150, color: GRAY }}>{r.date}</span><span style={{ width: 60, fontWeight: 700, color: r.signed ? "#15803D" : GRAY }}>{r.signed ? "Yes" : "No"}</span></div>)}
    </HookCard>} />;
};

// ═══ r1 — where responses come from: shared link → Submit Form ═══════════════
const SceneSubmitFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const done = g >= 150;
  const SUB = { x: 1080, y: 640 };
  const cur = path(g, [[0, 900, 600], [40, 700, 320], [90, 700, 320], [130, SUB.x, SUB.y], [144, SUB.x, SUB.y], [330, SUB.x, SUB.y + 60]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 800, 400, 1.3], [D, 800, 400, 1.3]];
  return (
    <FStage g={g} keys={keys} url="www.skillbnk.com/form/f-9e4b12" cur={cur} ripple={rip(g, 140)} tag={{ n: 1, label: "Shared form link", url: "www.skillbnk.com" }} bg="#EEF2F6" chip={[1, done ? "Every submission is saved as a response" : "Someone fills in your form"]}>
      <div style={{ position: "absolute", left: 400, top: 60, width: 800, height: 660, background: "#fff", borderRadius: 16, border: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 40, top: 30 }}><BrightLogo /></div>
        <div style={{ position: "absolute", left: 40, top: 92, fontSize: 28, fontWeight: 900, color: INK }}>Campus Visit Feedback</div>
        {!done ? (<>
          <div style={{ position: "absolute", left: 40, top: 150, fontSize: 15, fontWeight: 700, color: "#374151" }}>Rating</div>
          <div style={{ position: "absolute", left: 40, top: 178, fontSize: 40, color: "#F59E0B", letterSpacing: 8 }}>{g >= 80 ? "★★★★★" : g >= 60 ? "★★★★☆" : "☆☆☆☆☆"}</div>
          <UB x={40} y={558} w={120} h={44} v="outline" label="Previous" />
          <UB x={SUB.x - 400 - 70} y={558} w={140} h={44} label={g >= 144 ? "Submitting..." : "Submit Form"} press={g >= 136 && g < 146} />
        </>) : (
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: fi(g, 150, 10) }}>
            <div style={{ width: 84, height: 84, margin: "0 auto", borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(g, 150, fps)})` }}>✓</div>
            <div style={{ marginTop: 20, fontSize: 30, fontWeight: 900, color: INK }}>Thank You!</div>
            <div style={{ marginTop: 8, fontSize: 17, color: GRAY }}>Your form has been submitted successfully.</div>
          </div>
        )}
      </div>
    </FStage>
  );
};

// ═══ r2 — All Forms → Submissions → View Responses ═══════════════════════════
const SceneListFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = menuPt("Form Builder");
  const subs = Math.round(interpolate(g, [120, 150], [23, 24], cl));
  const rows: FormRowT[] = [{ name: "Campus Visit Feedback", id: "f-9e4b12", by: "Ava Reyes", subs, status: "Active", date: "Oct 6, 2026", hl: g >= 110 }, ...FORMS];
  const SUBP = { x: MX(flColX(3) + 65), y: MY(FL.tableTop + 46 + FL.rowH / 2) };
  const VR = flActPt(0, 3);
  const cur = path(g, [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [110, SUBP.x, SUBP.y], [200, SUBP.x, SUBP.y], [250, VR.x, VR.y], [272, VR.x, VR.y], [330, VR.x, VR.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 380, 1.9], [66, 300, 380, 1.9], [100, SUBP.x - 40, SUBP.y + 60, 1.7], [200, SUBP.x - 40, SUBP.y + 60, 1.7], [240, VR.x - 200, VR.y + 40, 1.8], [D, VR.x - 200, VR.y + 40, 1.8]];
  return (
    <FStage g={g} keys={keys} url={opened ? FB_URL_LIST : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 66), rip(g, 268))} active={opened ? "Form Builder" : "Dashboard"} chip={[2, !opened ? "Company portal → Form Builder" : g < 220 ? "Submissions counts every response" : "Actions → View Responses"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <FormsList rows={rows} actPress={g >= 262 && g < 276 ? [0, 3] : undefined} />}
    </FStage>
  );
};

// ═══ r3 — responses table tour ═══════════════════════════════════════════════
const SceneTableFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = tw(gt(f, dur, D), [[0, 0], [110, 100], [190, 110], [224, 170], [270, 230], [330, 290], [390, 370]]);
  const TITLE = { x: MX(260), y: MY(34) };
  const colPt = (i: number) => ({ x: MX(rtColX(i) + 70), y: MY(RT.top + 23) });
  const hl = g < 110 ? -1 : g < 170 ? 0 : g < 230 ? 1 : g < 290 ? 2 : g < 350 ? 3 : -1;
  const cur = path(g, [[0, 900, 500], [30, TITLE.x, TITLE.y + 30], [100, TITLE.x, TITLE.y + 30], [120, colPt(0).x, colPt(0).y], [160, colPt(0).x, colPt(0).y + 160], [180, colPt(1).x, colPt(1).y], [220, colPt(1).x, colPt(1).y + 160], [240, colPt(2).x, colPt(2).y], [280, colPt(2).x, colPt(2).y + 160], [300, colPt(3).x, colPt(3).y], [340, rtEyePt(2).x, rtEyePt(2).y], [D, rtEyePt(2).x, rtEyePt(2).y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(340), 120, 1.9], [100, MX(340), 120, 1.9], [130, MX(500), 360, 1.45], [230, MX(700), 360, 1.45], [300, MX(1000), 360, 1.45], [D, MX(1000), 380, 1.45]];
  const chip = g < 110 ? "Responses: form name + total" : ["Submitted By", "Submitted Date", "Signed In", "Actions → View Full Response"][Math.max(0, hl)] ?? "";
  return (
    <FStage g={g} keys={keys} url={FR_URL} cur={cur} ripple={0} active="Form Builder" chip={[3, hl === -1 && g >= 350 ? "Actions → View Full Response" : chip]}>
      <RespPage hlCol={hl} />
    </FStage>
  );
};

// ═══ r4 — Full Response Details ══════════════════════════════════════════════
const SceneDetailFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [40, 40], [117, 60], [225, 140], [259, 150], [341, 240], [420, 420]]);
  const r = RESP[0];
  const BOX = { x: 380, y: 30, w: 840, h: 780 };
  const mo = g >= 40 && g < 380 ? Math.min(fi(g, 40, 8), fo(g, 372, 8)) : 0;
  const E = rtEyePt(0);
  const cur = path(g, [[0, rtEyePt(2).x, rtEyePt(2).y], [26, E.x, E.y], [38, E.x, E.y], [80, BOX.x + 400, BOX.y + 130], [150, BOX.x + 400, BOX.y + 130], [200, BOX.x + 300, BOX.y + 360], [280, BOX.x + 300, BOX.y + 520], [350, BOX.x + 300, BOX.y + 640], [370, BOX.x + BOX.w - 30, BOX.y + 32], [380, BOX.x + BOX.w - 30, BOX.y + 32], [D, BOX.x + BOX.w - 30, BOX.y + 80]]);
  const keys: CamKey[] = [[0, MX(1000), 380, 1.45], [24, E.x - 200, E.y, 1.7], [46, 800, 300, 1.45], [150, 800, 300, 1.45], [200, 800, 440, 1.4], [350, 800, 600, 1.4], [384, 800, 430, 1.1], [D, 800, 430, 1.1]];
  const sections: [string, [string, string][]][] = [["Form Page 1", [["Full name", r.name], ["Email", r.email], ["Select Dropdown", r.dd]]], ["Your visit", [["Rating", String(r.rating)]]]];
  return (
    <FStage g={g} keys={keys} url={FR_URL} cur={cur} ripple={Math.max(rip(g, 36), rip(g, 378))} active="Form Builder" chip={[4, g < 160 ? "Who sent it, and when" : "Every answer, page by page"]}
      over={<Modal box={BOX} title="Full Response Details" o={mo}>
        {[["Submitted By", r.by], ["Email", r.email], ["Submitted Date", "Oct 6, 2026 · 10:42"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 24 + i * 268, top: 70, width: 256, height: 64, borderRadius: 8, background: "#F3F4F6", padding: "10px 12px", boxSizing: "border-box", opacity: fi(g, 50 + i * 10, 8) }}><div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{a}</div><div style={{ marginTop: 4, fontSize: 14, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b}</div></div>)}
        <div style={{ position: "absolute", left: 24, right: 24, top: 156, borderTop: `1px solid ${LINE}` }} />
        {sections.map(([s, rows], si) => (
          <div key={s} style={{ position: "absolute", left: 24, top: 180 + si * 330, width: BOX.w - 48, opacity: fi(g, 150 + si * 90, 10) }}>
            <div style={{ padding: "9px 16px", background: "#1D3FD61A", borderLeft: `4px solid ${BLUE}`, borderRadius: "6px 6px 0 0", fontSize: 16, fontWeight: 800, color: INK }}>{s}</div>
            <div style={{ border: `1px solid ${LINE}`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: 16 }}>
              {rows.map(([a, b]) => <div key={a} style={{ marginBottom: 14 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: GRAY }}>{a}</div><div style={{ marginTop: 3, fontSize: 16, fontWeight: 600, color: INK }}>{b}</div></div>)}
            </div>
          </div>
        ))}
      </Modal>}>
      <RespPage eyePress={g >= 28 && g < 40 ? 0 : -1} hlRow={g < 40 ? 0 : -1} />
    </FStage>
  );
};

// ═══ r5 — Signed In: Yes vs No ════════════════════════════════════════════════
const SceneSignedFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const yes = [0, 3, 4, 6, 8], no = [1, 2, 5, 7];
  const phase = g < 150 ? 0 : g < 270 ? 1 : 2;
  const step = (arr: number[], a: number, b: number) => arr[Math.min(arr.length - 1, Math.max(0, Math.floor(((g - a) / (b - a)) * arr.length)))];
  const hlRow = phase === 0 ? step(yes, 40, 150) : phase === 1 ? step(no, 150, 270) : -1;
  const sx = MX(rtColX(2) + 40);
  const cur = path(g, [[0, 900, 500], [30, sx, MY(rtRowY(0) + 26)], [140, sx, MY(rtRowY(8) + 26)], [160, MX(200), MY(rtRowY(1) + 26)], [210, MX(200), MY(rtRowY(2) + 26)], [260, MX(200), MY(rtRowY(7) + 26)], [D, MX(200), MY(rtRowY(7) + 26)]]);
  const keys: CamKey[] = [[0, MX(1000), 380, 1.45], [30, MX(560), 420, 1.4], [D, MX(560), 420, 1.4]];
  return (
    <FStage g={g} keys={keys} url={FR_URL} cur={cur} ripple={0} active="Form Builder" chip={[5, phase === 0 ? "Signed In: Yes → shown by name" : phase === 1 ? "Signed In: No → email, or Anonymous" : "Both land in the same list"]}>
      <RespPage hlCol={phase === 0 ? 2 : phase === 1 ? 0 : -1} hlRow={hlRow} />
    </FStage>
  );
};

// ═══ r6 — Export → Excel → Back to Forms ══════════════════════════════════════
const SceneExportFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = tw(gt(f, dur, D), [[0, 0], [70, 42], [110, 90], [260, 300], [294, 342], [390, 390]]);
  const EX = rbPt("exp"), BK = rbPt("back");
  const sheetO = g >= 90 && g < 300 ? Math.min(fi(g, 90, 10), fo(g, 292, 8)) : 0;
  const cur = path(g, [[0, 900, 500], [30, EX.x, EX.y], [46, EX.x, EX.y], [300, EX.x, EX.y + 60], [330, BK.x, BK.y], [346, BK.x, BK.y], [D, BK.x, BK.y]]);
  const keys: CamKey[] = [[0, MX(560), 420, 1.4], [26, EX.x - 160, 150, 1.9], [80, EX.x - 160, 150, 1.9], [100, 800, 380, 1.25], [300, 800, 380, 1.25], [326, BK.x - 60, 150, 1.9], [D, BK.x - 60, 150, 1.9]];
  const cols = ["Submitted By", "Email", "Submitted Date", "Full name", "Email", "Select Dropdown", "Rating"];
  const rows = RESP.slice(0, 8).map((r, i) => [r.by, r.email, `Oct ${6 - Math.floor(i / 2)}, 2026 1${i}:0${i}`, r.name, r.email, r.dd, String(r.rating)]);
  return (
    <FStage g={g} keys={keys} url={FR_URL} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 342))} active="Form Builder" chip={[6, g < 300 ? "Export → an Excel file, one column per field" : "Back to Forms"]}
      over={<>
        {g >= 52 && g < 300 && <Toast g={g} at={52} text="Responses exported successfully" x={1100} y={130} />}
        <Sheet x={180} y={150} w={1240} name="Campus Visit Feedback_Responses_2026-10-06.xlsx  ·  Responses" cols={cols} rows={rows} o={sheetO} />
      </>}>
      <RespPage press={g >= 38 && g < 48 ? "exp" : g >= 338 && g < 348 ? "back" : undefined} />
    </FStage>
  );
};

// ═══ r7 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapFR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["📩", "Collected", "From your shared link"], ["📋", "Listed", "Who · when · signed in"], ["👁", "Details", "Every answer, page by page"], ["⤓", "Export", "Excel, one column per field"]]} line={<>Every answer. <span style={{ color: "#5EEAD4" }}>One place.</span></>} />;
};
