
// ═══════════════════════════════════════════════════════════════════════════
// Enrollment Form Builder — scenes (sheet serial 17). Real UI (SB-Company /enrollment-form-builder,
// EnrollmentFormBuilderComponent + FormsBuilder + SortableTab/Row/Field + SideInputLists + Preview):
//  Header "Enrollment Form Builder" · Add New Step · Save · Preview · Delete (red).
//  Empty: "No forms found" + "Initiate Now" → "Step 1" with "row 1".
//  "Add new step" dialog: "Enter step name" + Save.  Step pill ✎ → "Tab Settings" (Label:, Cancel/Delete/Save).
//  Row: grip + label + collapse; footer Edit · Duplicates · Delete; "Add New Row Here";
//   "Add new row"/"Update row" dialog: "Enter Step title" + Save/Update. Duplicate label = "<label> copy".
//  "Form Elements": Short Text, Paragraph, Number, Date, Dropdown, Attachment, Checkbox, Heading,
//   Radio Button, Switch, Signature, 2 Columns, 3 Columns, 4 Columns.
//  Field dialog: title = label · "Field Label:" · "Description:" · "Options:" (Option 1…, "Add New Option")
//   · "Allow multiple select" · Save · Delete · Required.
//  "Form Preview" dialog: numbered step indicator · Previous / Next / Done.  Toast "Save successfully".
//  Public enroll page (SB-Frontend /enroll/[slug]) renders the same steps (+ Order Summary, Promo code).
//  Answers saved as formStepsData → SB-Branch Pending Members → "Student Information"
//   ("All information on student enrollment is here", Status/Enrolled Program/Enrolled Session/
//   Enrolled Date, Update, Export to CSV, Print).
// ═══════════════════════════════════════════════════════════════════════════
type EFField = { label: string; type: string; o?: number; cols?: (EFField | null)[]; hl?: boolean };
type EFRow = { label: string; fields: EFField[]; o?: number; drop?: boolean; hl?: boolean };
const EF_ELEMS: [string, string][] = [["Short Text", "T"], ["Paragraph", "¶"], ["Number", "#"], ["Date", "📅"], ["Dropdown", "▾"], ["Attachment", "📎"], ["Checkbox", "☑"], ["Heading", "H"], ["Radio Button", "◉"], ["Switch", "⏻"], ["Signature", "✍"], ["2 Columns", "▥"], ["3 Columns", "▥"], ["4 Columns", "▥"]];
const ICON_OF = (t: string) => (EF_ELEMS.find((e) => e[0] === t) ?? ["", "▭"])[1];
// header buttons (main coords)
const EFB = { step: { x: 846, y: 16, w: 150 }, save: { x: 1006, y: 16, w: 90 }, prev: { x: 1106, y: 16, w: 110 }, del: { x: 1226, y: 16, w: 100 } };
const efHdr = (k: keyof typeof EFB) => ({ x: MX(ctr(EFB[k]).x), y: MY(ctr(EFB[k]).y) });
const PAL = { x: 1080, w: 246 };
const palPt = (name: string) => ({ x: MX(PAL.x + 110), y: MY(126 + EF_ELEMS.findIndex((e) => e[0] === name) * 42 + 18) });
const ROW = { x: 24, w: 1036, top: 150, gap: 16 };
const FH = (f: EFField) => (f.cols ? 128 : 56);
const rowH = (r: EFRow) => 48 + (r.fields.length ? r.fields.reduce((a, f) => a + FH(f), 0) + (r.fields.length - 1) * 8 : 64) + 24 + 48;
const rowTops = (rows: EFRow[], scroll = 0) => { let y = ROW.top - scroll; return rows.map((r) => { const t = y; y += rowH(r) + ROW.gap; return t; }); };
/** main-area y of field i in row r */
const fieldTop = (rows: EFRow[], r: number, i: number, scroll = 0) => { const t = rowTops(rows, scroll)[r] + 60; return t + rows[r].fields.slice(0, i).reduce((a, f) => a + FH(f) + 8, 0); };
const fieldTitlePt = (rows: EFRow[], r: number, i: number, scroll = 0) => ({ x: MX(ROW.x + 16 + 80), y: MY(fieldTop(rows, r, i, scroll) + 28) });
const dropPt = (rows: EFRow[], r: number, scroll = 0) => { const t = rowTops(rows, scroll)[r]; return { x: MX(ROW.x + ROW.w / 2), y: MY(t + rowH(rows[r]) - 48 - 12 - 26) }; };
const colPt = (rows: EFRow[], r: number, i: number, c: number, n: number, scroll = 0) => { const t = fieldTop(rows, r, i, scroll); const cw = (ROW.w - 32 - 24 - (n - 1) * 10) / n; return { x: MX(ROW.x + 16 + 12 + c * (cw + 10) + cw / 2), y: MY(t + 38 + 40) }; };
const rowBtn = (rows: EFRow[], r: number, which: "edit" | "dup" | "del", scroll = 0) => { const t = rowTops(rows, scroll)[r] + rowH(rows[r]) - 42; const m = { edit: [16, 80], dup: [104, 122], del: [234, 90] }[which]; return { x: ROW.x + m[0], y: t, w: m[1], h: 32 }; };
const rowBtnPt = (rows: EFRow[], r: number, which: "edit" | "dup" | "del", scroll = 0) => { const b = rowBtn(rows, r, which, scroll); return { x: MX(b.x + b.w / 2), y: MY(b.y + 16) }; };
const addRowBtn = (rows: EFRow[], scroll = 0) => { const ts = rowTops(rows, scroll); const last = ts[ts.length - 1] + rowH(rows[rows.length - 1]); return { x: ROW.x + ROW.w / 2 - 110, y: last + 34, w: 220, h: 40 }; };
const stepW = (s: string) => 92 + s.length * 8.6;
const stepX = (steps: string[], i: number) => 24 + steps.slice(0, i).reduce((a, s) => a + stepW(s) + 10, 0);
const stepEditPt = (steps: string[], i: number) => ({ x: MX(stepX(steps, i) + stepW(steps[i]) - 22), y: MY(88 + 20) });

const EFFieldCard: React.FC<{ f: EFField; x: number; y: number; w: number }> = ({ f, x, y, w }) => {
  const o = f.o ?? 1;
  if (f.cols) {
    const n = f.cols.length; const cw = (w - 24 - (n - 1) * 10) / n;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: 128, opacity: o, borderRadius: 10, border: `1px solid ${f.hl ? "#A5B4FC" : LINE}`, background: "#FAFBFC", transform: `scale(${0.96 + 0.04 * o})` }}>
        <div style={{ position: "absolute", left: 12, top: 9, fontSize: 13, fontWeight: 800, color: "#374151", display: "flex", gap: 8 }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span>{f.label}</div>
        <div style={{ position: "absolute", right: 12, top: 7, display: "flex", gap: 12, fontSize: 14, color: GRAY }}><span>⚙</span><span style={{ color: "#DC2626" }}>🗑</span></div>
        {f.cols.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: 12 + i * (cw + 10), top: 36, width: cw, height: 80, borderRadius: 8, border: c ? `1px solid ${LINE}` : "1.5px dashed #CBD5E1", background: "#fff", display: "flex", alignItems: "center", justifyContent: c ? "flex-start" : "center", padding: "0 12px", boxSizing: "border-box", gap: 10, opacity: c ? (c.o ?? 1) : 1 }}>
            {c ? (<><span style={{ width: 28, height: 28, borderRadius: 6, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{ICON_OF(c.type)}</span><div><div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{c.label}</div><div style={{ fontSize: 11.5, color: GRAY }}>{c.type}</div></div></>) : <span style={{ fontSize: 22, color: "#9CA3AF" }}>+</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 56, opacity: o, borderRadius: 10, border: `1px solid ${f.hl ? "#A5B4FC" : LINE}`, boxShadow: f.hl ? "0 0 0 3px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", gap: 12, transform: `translateY(${(1 - o) * -10}px)` }}>
      <span style={{ color: "#9CA3AF", fontSize: 14 }}>⋮⋮</span>
      <span style={{ width: 30, height: 30, borderRadius: 7, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{ICON_OF(f.type)}</span>
      <span style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{f.label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: GRAY, background: "#F3F4F6", padding: "3px 8px", borderRadius: 6 }}>{f.type}</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 15, color: GRAY }}>⚙</span><span style={{ fontSize: 15, color: "#DC2626", marginLeft: 8 }}>🗑</span>
    </div>
  );
};

const EFBuilder: React.FC<{ steps?: string[]; act?: number; rows?: EFRow[]; empty?: boolean; press?: string; palHl?: string; scroll?: number; rowPress?: [number, string] }> = ({ steps = ["Step 1"], act = 0, rows = [], empty, press, palHl, scroll = 0, rowPress }) => {
  const tops = rowTops(rows, scroll);
  const add = rows.length ? addRowBtn(rows, scroll) : null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W - SIDE, height: H - BAR - HEAD, background: "#fff" }}>
      <div style={{ position: "absolute", left: 24, top: 22, fontSize: 22, fontWeight: 800, color: INK }}>Enrollment Form Builder</div>
      <UB {...EFB.step} label="Add New Step" icon="＋" press={press === "step"} />
      <UB {...EFB.save} label="Save" icon="💾" press={press === "save"} />
      {!empty && <UB {...EFB.prev} label="Preview" icon="👁" press={press === "prev"} />}
      {!empty && <UB {...EFB.del} label="Delete" icon="🗑" v="red" press={press === "del"} />}
      <div style={{ position: "absolute", left: 0, top: 72, width: W - SIDE, height: 1, background: LINE }} />
      {empty ? (
        <div style={{ position: "absolute", left: 0, width: W - SIDE, top: 260, textAlign: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>No forms found</div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 0, top: 73, width: PAL.x - 10, height: H - BAR - HEAD - 73, overflow: "hidden" }}>
            {rows.map((r, ri) => (
              <div key={ri} style={{ position: "absolute", left: ROW.x, top: tops[ri] - 73, width: ROW.w, height: rowH(r), opacity: r.o ?? 1, borderRadius: 12, border: `1px solid ${r.hl ? "#A5B4FC" : LINE}`, background: "#F9FAFB", boxShadow: r.hl ? "0 0 0 3px #C7D2FE" : "none" }}>
                <div style={{ position: "absolute", left: 14, top: 14, display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span><span style={{ fontSize: 16, fontWeight: 800, color: INK }}>{r.label}</span></div>
                <div style={{ position: "absolute", right: 16, top: 12, fontSize: 16, color: GRAY }}>⌃</div>
                {r.fields.length === 0 && <div style={{ position: "absolute", left: 16, top: 60, width: ROW.w - 32, height: 64, borderRadius: 10, border: `1.5px dashed ${r.drop ? BLUE : "#CBD5E1"}`, background: r.drop ? "#EEF2FF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: r.drop ? BLUE : "#9CA3AF", fontWeight: 600 }}>{r.drop ? "Drop here" : ""}</div>}
                {r.fields.map((f, i) => <EFFieldCard key={i} f={f} x={16} y={fieldTop(rows, ri, i, scroll) - tops[ri]} w={ROW.w - 32} />)}
                {r.drop && r.fields.length > 0 && <div style={{ position: "absolute", left: 16, top: rowH(r) - 48 - 12 - 4, width: ROW.w - 32, height: 3, borderRadius: 2, background: BLUE }} />}
                {(["edit", "dup", "del"] as const).map((k) => { const b = rowBtn(rows, ri, k, scroll); return <UB key={k} x={b.x - ROW.x} y={b.y - tops[ri]} w={b.w} h={32} fs={13} label={{ edit: "Edit", dup: "Duplicates", del: "Delete" }[k]} icon={{ edit: "✎", dup: "⧉", del: "🗑" }[k]} v={{ edit: "soft", dup: "sec", del: "red" }[k] as any} press={rowPress?.[0] === ri && rowPress?.[1] === k} />; })}
              </div>
            ))}
            {add && <>
              <div style={{ position: "absolute", left: ROW.x, top: add.y - 18 - 73, width: ROW.w, borderTop: "1.5px dashed #D1D5DB" }} />
              <UB x={add.x} y={add.y - 73} w={add.w} label="Add New Row Here" icon="＋" press={press === "row"} />
            </>}
          </div>
          <div style={{ position: "absolute", left: 0, top: 73, width: PAL.x - 10, height: 66, background: "#fff" }} />
          {/* steps (sortable tabs) */}
          {steps.map((s, i) => (
            <div key={s + i} style={{ position: "absolute", left: stepX(steps, i), top: 88, width: stepW(s), height: 40, borderRadius: 10, boxSizing: "border-box", border: `1px solid ${i === act ? BLUE : LINE}`, background: i === act ? BLUE : "#fff", color: i === act ? "#fff" : INK, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 14.5, fontWeight: 700 }}>
              <span style={{ opacity: 0.6 }}>⋮⋮</span><span style={{ flex: 1, whiteSpace: "nowrap" }}>{s}</span><span style={{ fontSize: 14 }}>✎</span>
            </div>
          ))}
          {/* Form Elements panel (sticky) */}
          <div style={{ position: "absolute", left: PAL.x, top: 80, width: PAL.w, height: 650, borderRadius: 12, border: `1px solid ${LINE}`, background: "#fff" }} />
          <div style={{ position: "absolute", left: PAL.x + 14, top: 92, fontSize: 15, fontWeight: 800, color: INK }}>Form Elements</div>
          {EF_ELEMS.map(([n, ic], i) => (
            <div key={n} style={{ position: "absolute", left: PAL.x + 10, top: 126 + i * 42, width: PAL.w - 20, height: 36, borderRadius: 8, border: `1px solid ${palHl === n ? BLUE : LINE}`, background: palHl === n ? BLUE_SOFT : "#FAFAFB", display: "flex", alignItems: "center", gap: 10, padding: "0 10px", boxSizing: "border-box", fontSize: 13.5, fontWeight: 600, color: palHl === n ? BLUE : "#374151" }}>
              <span style={{ width: 22, textAlign: "center", color: BLUE, fontWeight: 800 }}>{ic}</span>{n}<div style={{ flex: 1 }} /><span style={{ color: "#C0C6D0" }}>⋮⋮</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
const EF_URL = "company.skillbnk.com/enrollment-form-builder";
const INIT_BTN = { x: (W - SIDE) / 2 - 70, y: 300, w: 140 };

// ═══ e0 — HOOK ═════════════════════════════════════════════════════════════
const SceneHookEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = tw(gt(f, dur, D), [[0, 0], [400, 400]]);
  return <Hook3 g={g} fps={fps} D={D} b2={140} b3={250}
    pain={<>Half-finished enrollments are <span style={{ color: "#F87171" }}>students you lose</span>.</>}
    painSub="Missing documents. Missing guardian details. Days of phone calls."
    painCards={[["📄", "No photo ID uploaded"], ["👪", "No guardian contact"], ["📞", "3 days chasing paperwork"]]}
    other={<>give you one fixed sign-up form. <span style={{ color: "#FCA5A5" }}>Name. Email. Done.</span></>}
    otherItems={["Can't add your own steps", "Can't ask program-specific questions", "Answers scattered outside the enrollment"]}
    win={<>Build <span style={{ color: "#5EEAD4" }}>your own</span> enrollment form.</>}
    trust={["Your steps, your fields — drag and drop", "Required fields, so nothing is missed", "Every answer saved with the enrollment"]}
    visual={<HookCard title="Enroll — Medical Assistant">
      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>{["Student Details", "Guardian Info", "Documents"].map((s, i) => <span key={s} style={{ padding: "8px 14px", borderRadius: 999, background: i === 0 ? BP : "#F3F4F6", color: i === 0 ? "#fff" : GRAY, fontSize: 16, fontWeight: 800 }}>{i + 1} {s}</span>)}</div>
      <div style={{ marginTop: 16, opacity: fi(g, 270, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Full Name *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Maya Torres</div></div><div style={{ marginTop: 16, opacity: fi(g, 280, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Guardian name *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Elena Torres</div></div><div style={{ marginTop: 16, opacity: fi(g, 290, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Photo ID *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>📎 id-front.jpg</div></div><div style={{ marginTop: 16, opacity: fi(g, 300, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Program of interest *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Medical Assistant</div></div>
    </HookCard>} />;
};

// ═══ e1 — open the builder → Initiate Now ══════════════════════════════════
const SceneOpenEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [192, 228], [330, 330]]);
  const opened = g >= 96;
  const init = g >= 236;
  const MENU = menuPt("Enrollment form Builder");
  const INIT = { x: MX(ctr(INIT_BTN).x), y: MY(ctr(INIT_BTN).y) };
  const rows: EFRow[] = [{ label: "row 1", fields: [], o: fi(g, 238, 10) }];
  const cur = path(g, [[0, 800, 500], [40, MENU.x, MENU.y], [86, MENU.x, MENU.y], [150, INIT.x, INIT.y], [236, INIT.x, INIT.y], [280, MX(300), MY(220)], [330, MX(300), MY(220)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [36, 300, 420, 1.9], [92, 300, 420, 1.9], [130, INIT.x, INIT.y - 40, 1.7], [240, INIT.x, INIT.y - 40, 1.7], [272, 700, 280, 1.45], [330, 700, 280, 1.45]];
  return (
    <FStage g={g} keys={keys} url={opened ? EF_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 88), rip(g, 228))} active={opened ? "Enrollment form Builder" : "Dashboard"} chip={[1, init ? "Step 1 and a first row — ready for fields" : opened ? "New institute? Click Initiate Now" : "Company portal → Enrollment form Builder"]}>
      {!opened ? (
        <div style={{ position: "absolute", inset: 0, padding: 28 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div>
          <div style={{ marginTop: 18, display: "flex", gap: 18 }}>{[["Programs", "12"], ["Active learners", "486"], ["Pending enrollments", "9"]].map(([a, b]) => <div key={a} style={{ flex: 1, height: 110, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: 18, boxSizing: "border-box" }}><div style={{ fontSize: 14, color: GRAY }}>{a}</div><div style={{ fontSize: 34, fontWeight: 900, color: INK }}>{b}</div></div>)}</div>
        </div>
      ) : (
        <>
          <EFBuilder empty={!init} rows={init ? rows : []} />
          {!init && <UB {...INIT_BTN} label="Initiate Now" press={g >= 226 && g < 236} />}
        </>
      )}
    </FStage>
  );
};

// ═══ e2 — header buttons + Form Elements panel ══════════════════════════════
const SceneTourEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const rows: EFRow[] = [{ label: "row 1", fields: [] }];
  const order: (keyof typeof EFB)[] = ["step", "save", "prev", "del"];
  const T0 = 52, ST = 30;
  const on = g < T0 - 4 ? -1 : Math.min(3, Math.floor((g - T0 + 4) / ST));
  const pts: P3[] = [[0, MX(300), MY(220)]];
  order.forEach((k, i) => { pts.push([T0 + i * ST, efHdr(k).x, efHdr(k).y]); pts.push([T0 + i * ST + 18, efHdr(k).x, efHdr(k).y]); });
  pts.push([186, palPt("Short Text").x, palPt("Short Text").y], [276, palPt("4 Columns").x, palPt("4 Columns").y], [300, palPt("4 Columns").x, palPt("4 Columns").y]);
  const cur = path(g, pts);
  const palK = g >= 172;
  const pal = palK ? EF_ELEMS[Math.min(13, Math.max(0, Math.floor((g - 186) / 6.4)))][0] : undefined;
  const keys: CamKey[] = [[0, 700, 280, 1.45], [T0 - 10, efHdr("step").x + 120, 140, 2.0], [T0 + 3 * ST, efHdr("del").x - 120, 140, 2.0], [168, efHdr("del").x - 120, 140, 2.0], [196, palPt("Short Text").x, 380, 1.55], [300, palPt("Short Text").x, 460, 1.55]];
  const names = { step: "Add New Step", save: "Save", prev: "Preview", del: "Delete" };
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={0} active="Enrollment form Builder" chip={[2, palK ? "Form Elements — 14 building blocks" : on >= 0 ? `Header · ${names[order[on]]}` : "The builder header"]}>
      <EFBuilder rows={rows} press={!palK && on >= 0 ? order[on] : undefined} palHl={pal} />
    </FStage>
  );
};

// ═══ e3 — steps: rename Step 1 (Tab Settings) + Add New Step ×2 ══════════════
const SceneStepsEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [39, 38], [166, 118], [218, 164], [306, 248], [358, 288], [407, 360], [420, 420]]);
  const s1 = g >= 118 ? "Student Details" : "Step 1";
  const steps = [s1, ...(g >= 248 ? ["Guardian Info"] : []), ...(g >= 360 ? ["Documents"] : [])];
  const rows: EFRow[] = [{ label: "row 1", fields: [] }];
  const BOX = { x: 544, y: 200, w: 512, h: 250 };
  const TS_SAVE = { x: BOX.w - 24 - 80, y: BOX.h - 64, w: 80 };
  const NS_SAVE = { x: 24, y: 150, w: 80, h: 34 };
  const tsO = g >= 40 && g < 122 ? Math.min(fi(g, 40, 8), fo(g, 114, 8)) : 0;
  const ns1 = g >= 166 && g < 252 ? Math.min(fi(g, 166, 8), fo(g, 244, 8)) : 0;
  const ns2 = g >= 290 && g < 364 ? Math.min(fi(g, 290, 8), fo(g, 356, 8)) : 0;
  const EDIT = stepEditPt(["Step 1"], 0);
  const tsSave = { x: BOX.x + ctr(TS_SAVE).x, y: BOX.y + ctr(TS_SAVE).y };
  const nsSave = { x: BOX.x + ctr(NS_SAVE).x, y: BOX.y + ctr(NS_SAVE).y };
  const cur = path(g, [[0, efHdr("del").x, efHdr("del").y], [26, EDIT.x, EDIT.y], [40, EDIT.x, EDIT.y], [60, BOX.x + 240, BOX.y + 120], [96, BOX.x + 240, BOX.y + 120], [106, tsSave.x, tsSave.y], [120, tsSave.x, tsSave.y], [150, efHdr("step").x, efHdr("step").y], [166, efHdr("step").x, efHdr("step").y], [186, BOX.x + 240, BOX.y + 120], [226, BOX.x + 240, BOX.y + 120], [236, nsSave.x, nsSave.y], [250, nsSave.x, nsSave.y], [276, efHdr("step").x, efHdr("step").y], [290, efHdr("step").x, efHdr("step").y], [306, BOX.x + 240, BOX.y + 120], [340, BOX.x + 240, BOX.y + 120], [348, nsSave.x, nsSave.y], [362, nsSave.x, nsSave.y], [420, MX(500), MY(108)]]);
  const keys: CamKey[] = [[0, efHdr("del").x - 120, 140, 2.0], [24, 420, 200, 1.8], [44, 800, 330, 1.45], [118, 800, 330, 1.45], [140, 820, 200, 1.6], [160, efHdr("step").x - 60, 160, 1.6], [176, 800, 330, 1.45], [250, 600, 210, 1.7], [280, efHdr("step").x - 100, 200, 1.5], [296, 800, 330, 1.45], [362, 600, 220, 1.6], [420, 600, 220, 1.6]];
  const typing = (a: number, s: string) => typed(g, a, s, 0.7);
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 118), rip(g, 164), rip(g, 248), rip(g, 288), rip(g, 360))} active="Enrollment form Builder" chip={[3, g < 140 ? "✎ on a step → Tab Settings → rename" : "Add New Step → name it → Save"]}
      over={<>
        <Modal box={BOX} title="Tab Settings" o={tsO}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Label:" value={g < 62 ? "Step 1" : typing(64, "Student Details")} glow={g >= 60 && g < 104} />
          <UB x={BOX.w - 24 - 80 - 10 - 86 - 10 - 86} y={BOX.h - 64} w={86} label="Cancel" v="outline" />
          <UB x={BOX.w - 24 - 80 - 10 - 86} y={BOX.h - 64} w={86} label="Delete" v="red" />
          <UB {...TS_SAVE} label="Save" press={g >= 112 && g < 120} />
        </Modal>
        <Modal box={BOX} title="Add new step" o={Math.max(ns1, ns2)}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Enter step name" value={ns1 > 0 ? typing(188, "Guardian Info") : typing(308, "Documents")} glow={(g >= 186 && g < 232) || (g >= 306 && g < 344)} />
          <UB {...NS_SAVE} fs={13.5} label="Save" press={(g >= 244 && g < 252) || (g >= 356 && g < 364)} />
        </Modal>
      </>}>
      <EFBuilder steps={steps} act={0} rows={rows} press={(g >= 158 && g < 168) || (g >= 282 && g < 292) ? "step" : undefined} />
    </FStage>
  );
};

// ═══ e4 — rows: Edit row 1 → "Personal Details"; Add New Row Here → "Contact Details" ═
const SceneRowsEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = tw(gt(f, dur, D), [[0, 0], [68, 42], [173, 126], [227, 192], [350, 284], [360, 300]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const r1 = g >= 128 ? "Personal Details" : "row 1";
  const rows: EFRow[] = [{ label: r1, fields: [] }, ...(g >= 286 ? [{ label: "Contact Details", fields: [], o: fi(g, 286, 10) }] : [])];
  const base: EFRow[] = [{ label: r1, fields: [] }];
  const BOX = { x: 544, y: 200, w: 512, h: 220 };
  const SV = { x: 24, y: 150, w: 90, h: 34 };
  const svPt = { x: BOX.x + ctr(SV).x, y: BOX.y + ctr(SV).y };
  const EDIT = rowBtnPt(base, 0, "edit");
  const ADD = { x: MX(ctr(addRowBtn(base)).x), y: MY(ctr(addRowBtn(base)).y) };
  const m1 = g >= 44 && g < 132 ? Math.min(fi(g, 44, 8), fo(g, 124, 8)) : 0;
  const m2 = g >= 196 && g < 290 ? Math.min(fi(g, 196, 8), fo(g, 282, 8)) : 0;
  const cur = path(g, [[0, MX(500), MY(108)], [30, EDIT.x, EDIT.y], [44, EDIT.x, EDIT.y], [62, BOX.x + 240, BOX.y + 110], [104, BOX.x + 240, BOX.y + 110], [114, svPt.x, svPt.y], [128, svPt.x, svPt.y], [176, ADD.x, ADD.y], [194, ADD.x, ADD.y], [214, BOX.x + 240, BOX.y + 110], [260, BOX.x + 240, BOX.y + 110], [270, svPt.x, svPt.y], [286, svPt.x, svPt.y], [360, MX(400), MY(420)]]);
  const keys: CamKey[] = [[0, 600, 220, 1.6], [26, EDIT.x + 100, EDIT.y - 60, 1.9], [50, 800, 320, 1.45], [130, 800, 320, 1.45], [160, ADD.x, ADD.y - 60, 1.8], [200, 800, 320, 1.45], [290, 800, 320, 1.45], [320, 650, 380, 1.4], [360, 650, 380, 1.4]];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 126), rip(g, 192), rip(g, 284))} active="Enrollment form Builder" chip={[4, g < 150 ? "Row → Edit → Update row" : "Add New Row Here → Add new row"]}
      over={<>
        <Modal box={BOX} title="Update row" o={m1}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Enter Step title" value={g < 64 ? "row 1" : typed(g, 66, "Personal Details", 0.7)} glow={g >= 62 && g < 112} />
          <UB {...SV} fs={13.5} label="Update" press={g >= 120 && g < 128} />
        </Modal>
        <Modal box={BOX} title="Add new row" o={m2}>
          <MInput x={24} y={70} w={BOX.w - 48} label="Enter Step title" value={typed(g, 216, "Contact Details", 0.7)} glow={g >= 214 && g < 268} />
          <UB {...SV} fs={13.5} label="Save" press={g >= 278 && g < 286} />
        </Modal>
      </>}>
      <EFBuilder steps={steps} rows={rows} press={g >= 186 && g < 196 ? "row" : undefined} rowPress={g >= 36 && g < 46 ? [0, "edit"] : undefined} />
    </FStage>
  );
};

// ═══ e5 — drag elements into "Personal Details" ═════════════════════════════
const EF_DRAGS: [string, string][] = [["Short Text", "Short Text"], ["Date", "Date"], ["Dropdown", "Dropdown"], ["Attachment", "Attachment"]];
const SceneDragEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const T = (i: number) => [96, 152, 214, 284][i]; // grab time (≈ when the voice names it); drag lasts DR
  const DR = 40;
  const n = EF_DRAGS.filter((_, i) => g >= T(i) + DR).length;
  const mk = (k: number): EFRow[] => [{ label: "Personal Details", fields: EF_DRAGS.slice(0, k).map(([t, l], i) => ({ label: l, type: t, o: i === k - 1 ? fi(g, T(i) + DR, 8) : 1 })) }, { label: "Contact Details", fields: [] }];
  const rows = mk(n);
  const dragging = EF_DRAGS.findIndex((_, i) => g >= T(i) && g < T(i) + DR);
  if (dragging >= 0) rows[0].drop = g >= T(dragging) + 18;
  const pts: P3[] = [[0, MX(400), MY(420)]];
  EF_DRAGS.forEach(([t], i) => { const P = palPt(t); const Dp = dropPt(mk(i), 0); pts.push([T(i) - 14, P.x, P.y], [T(i), P.x, P.y], [T(i) + DR - 6, Dp.x, Dp.y], [T(i) + DR, Dp.x, Dp.y]); });
  pts.push([D, MX(600), MY(520)]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, 650, 380, 1.4], [36, 900, 340, 1.3], [D, 900, 400, 1.3]];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={0} grab={dragging >= 0} active="Enrollment form Builder" chip={[5, dragging >= 0 ? `Drag ${EF_DRAGS[dragging][0]} → drop in the row` : n >= 4 ? "Four fields — dropped in seconds" : "Drag elements from the right panel"]}
      over={dragging >= 0 ? <Ghost x={cur.x} y={cur.y} label={EF_DRAGS[dragging][0]} icon={ICON_OF(EF_DRAGS[dragging][0])} /> : undefined}>
      <EFBuilder steps={steps} rows={rows} palHl={dragging >= 0 ? EF_DRAGS[dragging][0] : undefined} />
    </FStage>
  );
};

// ═══ e6 — configure the Dropdown field ═══════════════════════════════════════
const SceneConfigEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [125, 126], [194, 150], [227, 210], [314, 300], [420, 420]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const lbl = g >= 70 ? typed(g, 72, "Program of interest", 0.8) : "Dropdown";
  const saved = g >= 352;
  const mkRows = (dl: string, hl: boolean, all = false): EFRow[] => [{ label: "Personal Details", fields: [{ label: all ? "Full Name" : "Short Text", type: "Short Text" }, { label: all ? "Date of Birth" : "Date", type: "Date" }, { label: dl, type: "Dropdown", hl }, { label: all ? "Photo ID" : "Attachment", type: "Attachment" }] }, { label: "Contact Details", fields: [] }];
  const rows = mkRows(saved ? "Program of interest" : "Dropdown", (g >= 20 && g < 40) || (saved && g < 380), g >= 380);
  const BOX = { x: 544, y: 46, w: 512, h: 650 };
  const L = (y: number) => BOX.y + y;
  const OPTS = ["Medical Assistant", "Pharmacy Technician", "Phlebotomy"];
  const optV = (i: number) => (g < 150 + i * 34 ? `Option ${i + 1}` : typed(g, 152 + i * 34, OPTS[i], 1));
  const showOpt3 = g >= 216;
  const SAVE = { x: 24, y: BOX.h - 60, w: 80, h: 34 };
  const REQ = { x: BOX.w - 24 - 120, y: BOX.h - 54 };
  const TITLE = fieldTitlePt(mkRows("Dropdown", false), 0, 2);
  const ADDOPT = { x: BOX.x + 24 + 70, y: L(391) };
  const mo = g >= 40 && g < 352 ? Math.min(fi(g, 40, 8), fo(g, 344, 8)) : 0;
  const cur = path(g, [[0, MX(600), MY(520)], [26, TITLE.x, TITLE.y], [40, TITLE.x, TITLE.y], [62, BOX.x + 200, L(112)], [110, BOX.x + 200, L(112)], [124, BOX.x + 200, L(200)], [146, BOX.x + 200, L(200)], [150, BOX.x + 200, L(304)], [184, BOX.x + 200, L(350)], [200, ADDOPT.x, ADDOPT.y], [214, ADDOPT.x, ADDOPT.y], [222, BOX.x + 200, L(396)], [260, BOX.x + 200, L(396)], [292, BOX.x + REQ.x + 18, BOX.y + REQ.y + 12], [304, BOX.x + REQ.x + 18, BOX.y + REQ.y + 12], [330, BOX.x + ctr(SAVE).x, BOX.y + ctr(SAVE).y], [346, BOX.x + ctr(SAVE).x, BOX.y + ctr(SAVE).y], [420, MX(500), MY(420)]]);
  const keys: CamKey[] = [[0, 900, 400, 1.3], [24, TITLE.x + 120, TITLE.y, 1.8], [44, 800, 420, 1.25], [60, 800, 200, 1.7], [120, 800, 260, 1.7], [150, 800, 380, 1.6], [270, 800, 440, 1.5], [290, 920, 660, 1.6], [320, 700, 660, 1.6], [356, 800, 420, 1.3], [420, 800, 420, 1.3]];
  const req = g >= 300;
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 210), rip(g, 300), rip(g, 342))} active="Enrollment form Builder" chip={[6, g < 140 ? "Click a field → set its label" : g < 280 ? "Description + dropdown options" : g < 380 ? "Required → Save" : "Same for every field: Full Name · Date of Birth · Photo ID"]}
      over={<Modal box={BOX} title={lbl || " "} o={mo}>
        <MInput x={24} y={70} w={BOX.w - 48} label="Field Label:" value={lbl} glow={g >= 62 && g < 118} />
        <MInput x={24} y={156} w={BOX.w - 48} h={64} label="Description:" value={typed(g, 126, "Pick the program you want to join.", 1.4)} ph="Describe how people should use this field" glow={g >= 124 && g < 148} />
        <div style={{ position: "absolute", left: 24, top: 252, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Options:</div>
        {[0, 1, 2].filter((i) => i < 2 || showOpt3).map((i) => (
          <React.Fragment key={i}>
            <MInput x={24} y={278 + i * 50} w={BOX.w - 48 - 50} value={optV(i)} glow={g >= 150 + i * 34 && g < 182 + i * 34} />
            <div style={{ position: "absolute", left: BOX.w - 24 - 40, top: 278 + i * 50, width: 40, height: 40, borderRadius: 8, background: "#DC2626", opacity: i === 0 ? 0.5 : 1, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✕</div>
          </React.Fragment>
        ))}
        <div style={{ position: "absolute", left: 24, top: showOpt3 ? 278 + 3 * 50 : 278 + 2 * 50 + 4, fontSize: 14, fontWeight: 700, color: BLUE }}>＋ Add New Option</div>
        <div style={{ position: "absolute", left: 24, top: 512, display: "flex", alignItems: "center", gap: 10 }}><Toggle on={0} /><span style={{ fontSize: 14, fontWeight: 800, color: INK }}>Allow multiple select</span></div>
        <UB {...SAVE} fs={13.5} label="Save" press={g >= 338 && g < 346} />
        <UB x={BOX.w - 24 - 120 - 16 - 80} y={BOX.h - 60} w={80} h={34} fs={13.5} label="Delete" v="red" />
        <div style={{ position: "absolute", left: REQ.x, top: REQ.y, display: "flex", alignItems: "center", gap: 10 }}><Toggle on={req ? 1 : 0} /><span style={{ fontSize: 14, fontWeight: 600, color: INK }}>Required</span></div>
      </Modal>}>
      <EFBuilder steps={steps} rows={rows} />
    </FStage>
  );
};
// NOTE: "Add New Option" sits at y=378 (2 options) → cursor aims L(424)= BOX.y+378+... see ADDOPT

// ═══ e7 — 2 Columns + Duplicates ══════════════════════════════════════════════
const SceneColsEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = tw(gt(f, dur, D), [[0, 0], [109, 80], [170, 152], [329, 304], [380, 380]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const p1: EFRow = { label: "Personal Details", fields: [{ label: "Full Name", type: "Short Text" }, { label: "Date of Birth", type: "Date" }, { label: "Program of interest", type: "Dropdown" }, { label: "Photo ID", type: "Attachment" }] };
  const SCR = 300; // page scrolled to show the second row
  const scroll = interpolate(g, [0, 30], [0, SCR], { ...cl, easing: EZ });
  const T1 = 80, T2 = 152, T3 = 218;
  const colField = (a: EFField | null, b: EFField | null, o = 1): EFField => ({ label: "2 Columns", type: "2 Columns", cols: [a, b], o });
  const c2 = g >= T1 + 56;
  const ca = g >= T2 + 50 ? { label: "Number", type: "Number", o: fi(g, T2 + 50, 8) } : null;
  const cb = g >= T3 + 50 ? { label: "Short Text", type: "Short Text", o: fi(g, T3 + 50, 8) } : null;
  const contact: EFRow = { label: "Contact Details", fields: c2 ? [colField(ca, cb, fi(g, T1 + 56, 8))] : [] };
  const dup = g >= 312;
  const rows: EFRow[] = [p1, contact, ...(dup ? [{ label: "Contact Details copy", fields: [colField({ label: "Number", type: "Number" }, { label: "Short Text", type: "Short Text" })], o: fi(g, 312, 10) }] : [])];
  if (g >= T1 + 20 && g < T1 + 56) contact.drop = true;
  const before: EFRow[] = [p1, { label: "Contact Details", fields: [] }];
  const after: EFRow[] = [p1, { label: "Contact Details", fields: [colField(null, null)] }];
  const DP = dropPt(before, 1, SCR);
  const CA = colPt(after, 1, 0, 0, 2, SCR), CB = colPt(after, 1, 0, 1, 2, SCR);
  const DUP = rowBtnPt(after, 1, "dup", SCR);
  const drag = g >= T1 && g < T1 + 56 ? "2 Columns" : g >= T2 && g < T2 + 50 ? "Number" : g >= T3 && g < T3 + 50 ? "Short Text" : "";
  const cur = path(g, [[0, MX(500), MY(420)], [T1 - 14, palPt("2 Columns").x, palPt("2 Columns").y], [T1, palPt("2 Columns").x, palPt("2 Columns").y], [T1 + 48, DP.x, DP.y], [T1 + 56, DP.x, DP.y],
    [T2 - 14, palPt("Number").x, palPt("Number").y], [T2, palPt("Number").x, palPt("Number").y], [T2 + 44, CA.x, CA.y], [T2 + 50, CA.x, CA.y],
    [T3 - 14, palPt("Short Text").x, palPt("Short Text").y], [T3, palPt("Short Text").x, palPt("Short Text").y], [T3 + 44, CB.x, CB.y], [T3 + 50, CB.x, CB.y],
    [290, DUP.x, DUP.y], [306, DUP.x, DUP.y], [380, DUP.x + 200, DUP.y + 100]]);
  const keys: CamKey[] = [[0, 650, 380, 1.4], [40, 900, 330, 1.3], [270, 900, 330, 1.3], [292, DUP.x + 120, DUP.y - 80, 1.7], [320, DUP.x + 120, DUP.y - 40, 1.6], [350, 700, 420, 1.3], [380, 700, 420, 1.3]];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={rip(g, 304)} grab={!!drag} active="Enrollment form Builder" chip={[7, g < 280 ? "2 Columns → fields side by side" : "Duplicates copies the whole row"]}
      over={drag ? <Ghost x={cur.x} y={cur.y} label={drag} icon={ICON_OF(drag)} /> : undefined}>
      <EFBuilder steps={steps} rows={rows} scroll={scroll} palHl={drag || undefined} rowPress={g >= 298 && g < 308 ? [1, "dup"] : undefined} />
    </FStage>
  );
};

// ═══ e8 — Preview (Form Preview dialog) → Save ═════════════════════════════════
const SceneTestEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = tw(gt(f, dur, D), [[0, 0], [30, 38], [193, 146], [267, 218], [338, 284], [392, 334], [400, 345]]);
  const steps = ["Student Details", "Guardian Info", "Documents"];
  const rows: EFRow[] = [{ label: "Personal Details", fields: [{ label: "Full Name", type: "Short Text" }, { label: "Date of Birth", type: "Date" }, { label: "Program of interest", type: "Dropdown" }, { label: "Photo ID", type: "Attachment" }] }, { label: "Contact Details", fields: [{ label: "2 Columns", type: "2 Columns", cols: [{ label: "Phone", type: "Number" }, { label: "Email", type: "Short Text" }] }] }];
  const BOX = { x: 410, y: 40, w: 780, h: 740 };
  const stp = g < 150 ? 0 : g < 222 ? 1 : 2;
  const NEXT = { x: BOX.w / 2 + 8, y: BOX.h - 70, w: 120, h: 44 };
  const PREV = { x: BOX.w / 2 - 8 - 130, y: BOX.h - 70, w: 130, h: 44 };
  const nxt = { x: BOX.x + ctr(NEXT).x, y: BOX.y + ctr(NEXT).y };
  const mo = g >= 40 && g < 290 ? Math.min(fi(g, 40, 8), fo(g, 282, 8)) : 0;
  const cur = path(g, [[0, MX(500), MY(420)], [26, efHdr("prev").x, efHdr("prev").y], [40, efHdr("prev").x, efHdr("prev").y], [80, BOX.x + 400, BOX.y + 300], [130, nxt.x, nxt.y], [148, nxt.x, nxt.y], [204, nxt.x, nxt.y], [220, nxt.x, nxt.y], [272, BOX.x + BOX.w - 32, BOX.y + 32], [286, BOX.x + BOX.w - 32, BOX.y + 32], [320, efHdr("save").x, efHdr("save").y], [336, efHdr("save").x, efHdr("save").y], [400, efHdr("save").x, efHdr("save").y + 80]]);
  const keys: CamKey[] = [[0, 800, 380, 1.3], [24, efHdr("prev").x - 100, 150, 1.9], [44, 800, 430, 1.12], [280, 800, 430, 1.12], [310, efHdr("save").x - 80, 160, 1.9], [400, efHdr("save").x - 80, 160, 1.9]];
  const content: [string, string, boolean?][][] = [
    [["Full Name", "Maya Torres", true], ["Date of Birth", "06/02/2007"], ["Program of interest", "Medical Assistant", true], ["Photo ID", "📎 id-front.jpg"]],
    [["Guardian name", "Elena Torres"], ["Relationship", "Mother"]],
    [["Transcript", "📎 transcript.pdf"], ["Signature", "✍ signed"]],
  ];
  return (
    <FStage g={g} keys={keys} url={EF_URL} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 146), rip(g, 218), rip(g, 284), rip(g, 334))} active="Enrollment form Builder" chip={[8, g < 290 ? "Preview — walk the steps like a student" : "Save"]}
      over={<>
        <Modal box={BOX} title="Form Preview" o={mo}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", gap: 14 }}>
            {steps.map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: i === stp ? BLUE : i < stp ? BLUE_SOFT : "#F3F4F6", color: i === stp ? "#fff" : i < stp ? BLUE : GRAY, fontSize: 14, fontWeight: 800 }}><span>{i + 1}</span>{s}</div>)}
          </div>
          {content[stp].map(([l, v, r], i) => (
            <MInput key={stp + l} x={40} y={140 + i * 96} w={BOX.w - 80} label={l} req={r} value={v} select={l.includes("Program")} />
          ))}
          <div style={{ position: "absolute", left: 24, right: 24, top: BOX.h - 94, borderTop: "1px solid #D1D5DB" }} />
          {stp > 0 && <UB {...PREV} label="← Previous" v="outline" />}
          <UB {...NEXT} label={stp === 2 ? "Done" : "Next →"} press={(g >= 140 && g < 150) || (g >= 212 && g < 222)} />
        </Modal>
        {g >= 338 && <Toast g={g} at={338} text="Save successfully" x={1150} y={150} />}
      </>}>
      <EFBuilder steps={steps} rows={rows} press={g >= 30 && g < 42 ? "prev" : g >= 326 && g < 338 ? "save" : undefined} />
    </FStage>
  );
};
// Note: Preview renders the form for testing only (enroll action is a no-op there) — the voice says "test".

// ═══ e9 — public enroll page → Student Information (answers by step) ══════════
const SceneAnswersEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 460;
  const g = gt(f, dur, D);
  if (g < 200) {
    const stp = g < 120 ? 0 : 1;
    const NEXT = { x: 1360, y: 742 };
    const cur = path(g, [[0, 1100, 700], [30, 850, 284], [60, 850, 284], [100, NEXT.x, NEXT.y], [118, NEXT.x, NEXT.y], [200, 1000, 470]]);
    const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 1000, 400, 1.35], [190, 1000, 420, 1.35], [200, 1000, 420, 1.35]];
    const steps = ["Student Details", "Guardian Info", "Documents"];
    const sx = [640, 920, 1200];
    return (
      <FStage g={g} keys={keys} url={`${DOMAIN}/enroll/medical-assistant-fall-2026`} cur={cur} ripple={rip(g, 112)} tag={{ n: 2, label: "Your enroll page", url: DOMAIN }} chip={[9, "Students fill the same steps on your enroll page"]}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 64, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 30, boxSizing: "border-box" }}>
          <BrightLogo /><div style={{ flex: 1 }} />{["Programs", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>{t}</span>)}
        </div>
        <div style={{ position: "absolute", left: 60, top: 96, width: 500, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, overflow: "hidden" }}>
          <div style={{ height: 210, background: `linear-gradient(135deg,${BP},#134E4A)`, padding: 24, boxSizing: "border-box" }}>
            <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "#ffffff30", color: "#fff" }}>PROGRAM</span>
            <div style={{ marginTop: 16, fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>Medical Assistant — Fall 2026</div>
            <div style={{ marginTop: 8, fontSize: 14, color: "#CCFBF1" }}>by {BRAND}</div>
          </div>
          <div style={{ margin: "20px 24px", padding: "16px 18px", borderRadius: 12, background: "#F9FAFB", border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>Order Summary</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, color: GRAY }}>Original price <span>$2,400</span></div>
            <div style={{ marginTop: 10, height: 40, borderRadius: 8, border: "1px dashed #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>Promo code</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 800, color: INK }}>Total <span>$2,400</span></div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 600, top: 96, width: 940, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
        <div style={{ position: "absolute", left: 640, top: 118, fontSize: 24, fontWeight: 800, color: INK }}>Enrollment Details</div>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i < 2 && <div style={{ position: "absolute", left: sx[i] + 30, top: 186, width: 250, height: 3, background: stp > i ? BP : "#E5E7EB" }} />}
            <div style={{ position: "absolute", left: sx[i], top: 172, width: 30, height: 30, borderRadius: "50%", background: stp >= i ? BP : "#E5E7EB", color: stp >= i ? "#fff" : GRAY, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{stp > i ? "✓" : i + 1}</div>
            <div style={{ position: "absolute", left: sx[i] + 38, top: 178, fontSize: 14, fontWeight: 700, color: stp >= i ? INK : GRAY, background: "#fff", paddingRight: 6 }}>{s}</div>
          </React.Fragment>
        ))}
        {stp === 0 ? (<>
          <Input x={640} y={232} w={420} label="Full Name" req value={typed(g, 34, "Maya Torres", 0.5)} glow={g >= 30 && g < 60 ? 1 : 0} />
          <Input x={1080} y={232} w={420} label="Date of Birth" value="06/02/2007" />
          <Input x={640} y={322} w={860} label="Program of interest" req value="Medical Assistant" select />
          <Input x={640} y={412} w={420} label="Phone" value="(555) 014-2290" />
          <Input x={1080} y={412} w={420} label="Email" value="maya.torres@example.com" />
          <Input x={640} y={502} w={860} label="Photo ID" value="📎 id-front.jpg" />
        </>) : (<div style={{ opacity: fi(g, 120, 8) }}>
          <Input x={640} y={232} w={420} label="Guardian name" value={typed(g, 130, "Elena Torres", 0.5)} glow={g >= 128 ? 1 : 0} />
          <Input x={1080} y={232} w={420} label="Relationship" value="" ph="Select" select />
        </div>)}
        <div style={{ position: "absolute", left: 1300, top: 720, width: 120, height: 44, borderRadius: 8, background: BP, color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 110 && g < 120 ? 0.93 : 1})` }}>Next →</div>
      </FStage>
    );
  }
  // ── Student Information (Pending Members → open the enrollment) ──
  const h = g - 200;
  const EXP = { x: MX(1350 - 24 - 3 * 46 + 21), y: MY(42) };
  const PRN = { x: MX(1350 - 24 - 2 * 46 + 21), y: MY(42) };
  const cur = path(h, [[0, 900, 500], [40, 700, 440], [140, 700, 640], [190, EXP.x, EXP.y], [206, EXP.x, EXP.y], [226, PRN.x, PRN.y], [260, PRN.x, PRN.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 760, 300, 1.35], [80, 760, 360, 1.35], [140, 760, 560, 1.35], [180, EXP.x - 160, 140, 1.9], [260, EXP.x - 160, 140, 1.9]];
  const ans: [string, [string, string][]][] = [["Student Details", [["Full Name", "Maya Torres"], ["Date of Birth", "06/02/2007"], ["Program of interest", "Medical Assistant"], ["Photo ID", "id-front.jpg"]]], ["Guardian Info", [["Guardian name", "Elena Torres"], ["Relationship", "Mother"]]]];
  return (
    <Stage>
      <PortalTag n={3} label="Training provider portal" url="admin view" />
      <CamC g={h} keys={keys}>
        <Browser url="branch.skillbnk.com/pending-members/maya-torres">
          <div style={{ position: "absolute", inset: 0, background: "#F6F7F9", opacity: fi(h, 0, 8) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
              <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><BrightLogo /></div>
              {["Dashboard", "Enrollment & Students", "Pending Members", "Programs", "Attendance"].map((m, i) => <div key={m} style={{ position: "absolute", left: 12, top: 90 + i * 36, width: SIDE - 24, height: 34, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 10px", boxSizing: "border-box", fontSize: 13.5, fontWeight: m === "Pending Members" ? 700 : 500, background: m === "Pending Members" ? BLUE_SOFT : "transparent", color: m === "Pending Members" ? BLUE : "#1F2937", gap: 9 }}><Ico s={14} c={m === "Pending Members" ? BLUE : "#4B5563"} />{m}</div>)}
            </div>
            <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}` }} />
            <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD }}>
              <PageTitle t="Student Information" sub="All information on student enrollment is here" back x={24} y={14} />
              {[["⤓", "#16A34A"], ["🖨", BLUE], ["🕘", "#7C3AED"]].map(([ic, c], i) => <div key={i} style={{ position: "absolute", left: 1350 - 24 - (3 - i) * 46, top: 22, width: 40, height: 40, borderRadius: 8, background: c + "1A", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: (i === 0 && h >= 196 && h < 210) || (i === 1 && h >= 240) ? `0 0 0 3px ${c}55` : "none" }}>{ic}</div>)}
              <div style={{ position: "absolute", left: 24, top: 90, width: 1302, height: 92, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
              {[["Status:", "Pending"], ["Enrolled Program:", "Medical Assistant — Fall 2026"], ["Enrolled Session:", "Evening cohort"], ["Enrolled Date:", "Oct 3, 2026"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 44 + i * 318, top: 104, width: 296 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{a}</div><div style={{ marginTop: 6, height: 36, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 14, color: INK, justifyContent: "space-between" }}>{b}{i < 3 && <span style={{ color: "#9CA3AF" }}>⌄</span>}</div></div>)}
              {ans.map(([s, rows], si) => (
                <div key={s} style={{ position: "absolute", left: 24, top: 200 + si * 270, width: 1302, opacity: fi(h, 30 + si * 40, 10) }}>
                  <div style={{ padding: "10px 16px", background: BLUE_SOFT, borderLeft: `4px solid ${BLUE}`, borderRadius: "8px 8px 0 0", fontSize: 16, fontWeight: 800, color: INK }}>{s}</div>
                  <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {rows.map(([a, b]) => <div key={a} style={{ padding: "10px 14px", background: "#F9FAFB", borderRadius: 8 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: GRAY }}>{a}</div><div style={{ marginTop: 3, fontSize: 15.5, fontWeight: 700, color: INK }}>{b}</div></div>)}
                  </div>
                </div>
              ))}
            </div>
            <Cursor x={cur.x} y={cur.y} ripple={Math.max(rip(h, 200), rip(h, 236))} />
          </div>
        </Browser>
      </CamC>
      <StepChip n={10} text={h < 170 ? "Every answer saved with the enrollment — step by step" : "Export to CSV · Print"} o={fi(h, 4, 10)} />
    </Stage>
  );
};

// ═══ e10 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapEF: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["🪜", "Steps", "Student · Guardian · Docs"], ["⋮⋮", "Drag fields", "14 elements"], ["⚙", "Configure", "Label · options · Required"], ["👁", "Preview", "Test before saving"], ["📋", "Answers", "Saved with each enrollment"]]} line={<>Your questions. <span style={{ color: "#5EEAD4" }}>Your enrollment form.</span></>} />;
};
