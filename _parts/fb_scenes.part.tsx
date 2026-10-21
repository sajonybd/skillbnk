
// ═══════════════════════════════════════════════════════════════════════════
// General Form Builder — scenes (sheet serial 18). Real UI (SB-Company):
//  AllFormBuilderPage: "All Forms" · "Manage all form builder forms" · "Search Form Name..." · Create New ·
//   export · columns Form Name / Form ID / Created By / Submissions / Status / Created Date / Actions
//   (Copy Link · Clone Form · Edit · View Responses · Delete). Toasts "Link copied to clipboard!".
//  components/form-builder/FormBuilder: header "Form Builder" + "N tab(s)" badge (+ "<Element> selected"),
//   Preview · Test · Export · Import · Save.  ElementPalette "Form Elements", "Search elements...", All /
//   Categories.  Tabs + "Add Tab" → "Add New Tab" dialog ("Tab title", "Create Tab"), default "Form Page 1".
//  FormTabContent empty: "Start building your form", "Add rows and drag elements from the palette",
//   "Drop element here to create a new row", "1/2/3/4 Column Row"; with rows: "Add N Column Row".
//  DroppableColumn "Add Element" / "Drop Here".  PropertiesPanel "Properties", "Select an element to edit
//   its properties", "Basic Properties": Label, Placeholder, Required, Disabled, Read Only; "Validation Rules".
//  FormTestRenderer "Test Form" · "Test your form before publishing" · Reset · Cancel · Submit Form.
//  FormSettingsDialog "Form Settings" · "Configure your form name and settings before saving." ·
//   Form Name * · Status (Active/Inactive) · Form Options: Collect Email ("Turn on only when submissions
//   should require login…"), Limit Response ("Allow only one response per user"), Allow Editing ("Let users
//   edit their responses"), Send Confirmation Email ("Email users after form submission") · Save Form.
//   Toast "Form created successfully!".  Public SB-Frontend /form/[id]: Previous / Next / Submit Form,
//   "Thank You!" "Your form has been submitted successfully."
// ═══════════════════════════════════════════════════════════════════════════
type FBEl = { label: string; type: string; ph?: string; req?: boolean; o?: number; sel?: boolean };
type FBRow = { cols: FBEl[][]; o?: number; dropCol?: number };
const FB_HB = { prev: { x: 880, y: 13, w: 90, h: 36 }, test: { x: 978, y: 13, w: 70, h: 36 }, exp: { x: 1056, y: 13, w: 84, h: 36 }, imp: { x: 1148, y: 13, w: 84, h: 36 }, save: { x: 1246, y: 13, w: 84, h: 36 } };
const fbHdr = (k: keyof typeof FB_HB) => ({ x: MX(ctr(FB_HB[k]).x), y: MY(ctr(FB_HB[k]).y) });
const FB_PAL: [string, string][] = [["Text Input", "Single line text input field"], ["Email", "Email address input with validation"], ["Password", "Password input field"], ["Number", "Numeric input field"], ["Phone", "Telephone number input"], ["Map", "Interactive map with customizable location and zoom"], ["URL", "URL input field"], ["QR Code", "Display a QR code from an image URL"], ["Textarea", "Multi-line text input"], ["Select Dropdown", "Single selection dropdown"], ["Multi Select", "Multiple selection dropdown"]];
const fbPalPt = (name: string, list = FB_PAL) => ({ x: MX(12 + 120), y: MY(196 + list.findIndex((e) => e[0] === name) * 54 + 23) });
const FB_CAN = { x: 320, w: 690, top: 130 };
const FB_PROPS = { x: 1040, w: 290 };
const elH = 70;
const colW = (n: number) => (FB_CAN.w - 24 - (n - 1) * 12) / n;
const colX = (n: number, c: number) => FB_CAN.x + 12 + c * (colW(n) + 12);
const contentH = (r: FBRow) => Math.max(70, ...r.cols.map((c) => c.length * (elH + 8) - 8));
const fbRowH = (r: FBRow) => 40 + contentH(r) + 14;
const fbTops = (rows: FBRow[]) => { let y = FB_CAN.top; return rows.map((r) => { const t = y; y += fbRowH(r) + 14; return t; }); };
const fbColPt = (rows: FBRow[], r: number, c: number) => ({ x: MX(colX(rows[r].cols.length, c) + colW(rows[r].cols.length) / 2), y: MY(fbTops(rows)[r] + 40 + 35) });
const fbElPt = (rows: FBRow[], r: number, c: number, i: number) => ({ x: MX(colX(rows[r].cols.length, c) + 70), y: MY(fbTops(rows)[r] + 40 + i * (elH + 8) + 14) });
const fbAddRow = (rows: FBRow[], k: number) => { const ts = fbTops(rows); const y = rows.length ? ts[ts.length - 1] + fbRowH(rows[rows.length - 1]) + 4 : 0; return { x: FB_CAN.x + k * 174, y, w: 164, h: 34 }; };
const FB_EMPTY_BTN = (k: number) => ({ x: FB_CAN.x + 27 + k * 162, y: 330, w: 150, h: 36 });
const fbTabW = (s: string) => 40 + s.length * 8.2;
const fbTabX = (tabs: string[], i: number) => FB_CAN.x + 4 + tabs.slice(0, i).reduce((a, s) => a + fbTabW(s) + 4, 0);
const fbAddTabBtn = (tabs: string[]) => ({ x: fbTabX(tabs, tabs.length) + 14, y: 76, w: 96, h: 34 });

const FBElCard: React.FC<{ e: FBEl; x: number; y: number; w: number }> = ({ e, x, y, w }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: elH, opacity: e.o ?? 1, borderRadius: 8, background: "#fff", border: `${e.sel ? 2 : 1}px solid ${e.sel ? BLUE : LINE}`, boxShadow: e.sel ? "0 0 0 3px #C7D2FE" : "none", padding: "8px 10px", boxSizing: "border-box", transform: `scale(${0.95 + 0.05 * (e.o ?? 1)})` }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", whiteSpace: "nowrap", overflow: "hidden" }}>{e.label}{e.req && <span style={{ color: "#EF4444" }}> *</span>}</div>
    <div style={{ marginTop: 6, height: 32, borderRadius: 6, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 12.5, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{e.type === "Rating" ? <span style={{ color: "#F59E0B", fontSize: 16, letterSpacing: 2 }}>☆☆☆☆☆</span> : <span>{e.ph ?? ""}</span>}{e.type.includes("Select") && <span>⌄</span>}</div>
  </div>
);
const FBBuilder: React.FC<{ rows?: FBRow[]; tabs?: string[]; act?: number; press?: string; palHl?: string; sel?: FBEl | null; selType?: string; search?: string; pal?: [string, string][]; props?: React.ReactNode; emptyDrop?: boolean; addRowPress?: number }> = ({ rows = [], tabs = ["Form Page 1"], act = 0, press, palHl, sel, selType, search = "", pal = FB_PAL, props, emptyDrop, addRowPress = -1 }) => {
  const tops = fbTops(rows);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F6F7F9" }}>
      {/* header */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W - SIDE, height: 62, background: "#fff", borderBottom: `1px solid ${LINE}` }} />
      <div style={{ position: "absolute", left: 20, top: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>Form Builder</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#F3F4F6", color: "#374151" }}>{tabs.length} tab{tabs.length !== 1 ? "s" : ""}</span>
        {selType && <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999, border: `1px solid ${LINE}`, color: "#374151" }}>{selType} selected</span>}
      </div>
      <UB {...FB_HB.prev} fs={13.5} v="outline" label="Preview" press={press === "prev"} />
      <UB {...FB_HB.test} fs={13.5} v="outline" label="Test" press={press === "test"} />
      <UB {...FB_HB.exp} fs={13.5} v="outline" label="Export" press={press === "exp"} />
      <UB {...FB_HB.imp} fs={13.5} v="outline" label="Import" press={press === "imp"} />
      <UB {...FB_HB.save} fs={13.5} label="Save" press={press === "save"} />
      {/* palette */}
      <div style={{ position: "absolute", left: 0, top: 62, width: 300, height: 734, background: "#fff", borderRight: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 12, top: 14, fontSize: 17, fontWeight: 800, color: INK }}>Form Elements</div>
        <div style={{ position: "absolute", left: 12, top: 44, width: 276, height: 36, borderRadius: 8, border: `1px solid ${search ? "#A5B4FC" : "#D1D5DB"}`, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", boxSizing: "border-box", fontSize: 13.5, color: search ? INK : "#9CA3AF" }}>⌕ {search || "Search elements..."}</div>
        <div style={{ position: "absolute", left: 12, top: 90, width: 276, height: 32, borderRadius: 8, background: "#F3F4F6", display: "flex", padding: 3, boxSizing: "border-box" }}>
          <div style={{ flex: 1, borderRadius: 6, background: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: INK }}>All</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY }}>Categories</div>
        </div>
      </div>
      {pal.map(([n, d], i) => (
        <div key={n} style={{ position: "absolute", left: 12, top: 196 + i * 54, width: 276, height: 46, borderRadius: 8, border: `1px solid ${palHl === n ? BLUE : LINE}`, background: palHl === n ? BLUE_SOFT : "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 10px", boxSizing: "border-box" }}>
          <span style={{ width: 28, height: 28, borderRadius: 6, background: BLUE_SOFT, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>▭</span>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: palHl === n ? BLUE : INK }}>{n}</div><div style={{ fontSize: 11, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 210 }}>{d}</div></div>
        </div>
      ))}
      {/* tabs */}
      {tabs.map((s, i) => <div key={s} style={{ position: "absolute", left: fbTabX(tabs, i), top: 76, width: fbTabW(s), height: 34, borderRadius: 7, background: i === act ? "#fff" : "#E9ECF1", boxShadow: i === act ? "0 1px 3px #0002" : "none", fontSize: 13.5, fontWeight: 700, color: i === act ? INK : GRAY, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{s}</div>)}
      <UB {...fbAddTabBtn(tabs)} fs={13} v="outline" label="Add Tab" icon="＋" press={press === "tab"} />
      {/* canvas */}
      {rows.length === 0 ? (
        <div style={{ position: "absolute", left: FB_CAN.x, top: FB_CAN.top, width: FB_CAN.w, height: 280, borderRadius: 12, border: `2px dashed ${emptyDrop ? "#22C55E" : "#CBD5E1"}`, background: emptyDrop ? "#22C55E14" : "transparent" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontSize: 18, fontWeight: 800, color: INK }}>Start building your form</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 14, color: GRAY }}>Add rows and drag elements from the palette</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontSize: 13.5, fontWeight: 600, color: emptyDrop ? "#16A34A" : "#9CA3AF" }}>Drop element here to create a new row</div>
        </div>
      ) : rows.map((r, ri) => (
        <div key={ri} style={{ position: "absolute", left: FB_CAN.x, top: tops[ri], width: FB_CAN.w, height: fbRowH(r), borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, opacity: r.o ?? 1 }}>
          <div style={{ position: "absolute", left: 12, top: 9, fontSize: 12, fontWeight: 700, color: GRAY }}>{r.cols.length} Column{r.cols.length > 1 ? "s" : ""}</div>
          <div style={{ position: "absolute", right: 12, top: 7, display: "flex", gap: 14, fontSize: 14, color: GRAY }}><span>⠿</span><span>▥</span><span>＋</span><span style={{ color: "#DC2626" }}>🗑</span></div>
          {r.cols.map((c, ci) => {
            const x = colX(r.cols.length, ci) - FB_CAN.x; const w = colW(r.cols.length);
            const drop = r.dropCol === ci;
            return (
              <div key={ci} style={{ position: "absolute", left: x, top: 40, width: w, height: contentH(r) }}>
                {c.length === 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 8, border: `1.5px dashed ${drop ? "#22C55E" : "#D1D5DB"}`, background: drop ? "#22C55E14" : "#FAFBFC", display: "flex", alignItems: "center", justifyContent: "center" }}>{drop ? <span style={{ background: "#22C55E", color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>Drop Here</span> : <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", border: "1px dashed #D1D5DB", borderRadius: 7, padding: "6px 12px", background: "#fff" }}>＋ Add Element</span>}</div>}
                {c.map((e, ei) => <FBElCard key={ei} e={e} x={0} y={ei * (elH + 8)} w={w} />)}
              </div>
            );
          })}
        </div>
      ))}
      {rows.length === 0 ? [0, 1, 2, 3].map((k) => <UB key={k} {...FB_EMPTY_BTN(k)} fs={13} v="outline" label={`${k + 1} Column Row`} press={addRowPress === k} />)
        : [0, 1, 2, 3].map((k) => <UB key={k} {...fbAddRow(rows, k)} fs={12.5} v="outline" label={`Add ${k + 1} Column Row`} press={addRowPress === k} />)}
      {/* properties */}
      <div style={{ position: "absolute", left: FB_PROPS.x, top: 62, width: FB_PROPS.w + 20, height: 734, background: "#fff", borderLeft: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 16, top: 14, fontSize: 17, fontWeight: 800, color: INK }}>Properties</div>
        {props ?? <div style={{ position: "absolute", left: 16, top: 50, width: 260, fontSize: 13.5, color: GRAY }}>Select an element to edit its properties</div>}
      </div>
    </div>
  );
};
const FB_URL_ADD = "company.skillbnk.com/form-builder-component/add";
const FB_URL_LIST = "company.skillbnk.com/organization-form-builder";
const FBProps: React.FC<{ label: string; ph: string; req: number; gl?: "label" | "ph"; extra?: React.ReactNode }> = ({ label, ph, req, gl, extra }) => (
  <>
    <div style={{ position: "absolute", left: 16, top: 50, fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 0.6 }}>Basic Properties</div>
    <MInput x={16} y={78} w={268} label="Label" value={label} glow={gl === "label"} />
    <MInput x={16} y={156} w={268} label="Placeholder" value={ph} glow={gl === "ph"} />
    {[["Required", req], ["Disabled", 0], ["Read Only", 0]].map(([n, v], i) => <div key={n as string} style={{ position: "absolute", left: 16, top: 240 + i * 38, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: INK }}><Toggle on={v as number} />{n}</div>)}
    <div style={{ position: "absolute", left: 16, top: 370, fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 0.6 }}>Validation Rules</div>
    <div style={{ position: "absolute", left: 16, top: 396, width: 268, height: 34, borderRadius: 8, border: "1px dashed #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#374151" }}>＋ Add Validation Rule</div>
    {extra}
  </>
);
const FB_REQ = { x: MX(FB_PROPS.x + 16 + 20), y: MY(62 + 240 + 11) };

// ── All Forms list ──
type FormRowT = { name: string; id: string; by: string; subs: number; status: "Active" | "Pending"; date: string; o?: number; hl?: boolean };
const FORMS: FormRowT[] = [
  { name: "Open House RSVP", id: "f-3c91a7", by: "Ava Reyes", subs: 64, status: "Active", date: "Sep 12, 2026" },
  { name: "Course Feedback — Week 4", id: "f-77b0e2", by: "Ava Reyes", subs: 118, status: "Active", date: "Sep 3, 2026" },
  { name: "Scholarship Interest", id: "f-1d5f40", by: "Liam Chen", subs: 23, status: "Pending", date: "Aug 28, 2026" },
  { name: "Volunteer Sign-up", id: "f-a2e9c3", by: "Liam Chen", subs: 41, status: "Active", date: "Aug 14, 2026" },
];
const FL = { create: { x: 1350 - 24 - 46 - 10 - 130, y: 22, w: 130, h: 40 }, tableTop: 160, rowH: 56 };
const FL_COLS: [string, number][] = [["Form Name", 300], ["Form ID", 130], ["Created By", 160], ["Submissions", 130], ["Status", 120], ["Created Date", 160], ["Actions", 300]];
const flColX = (i: number) => 24 + FL_COLS.slice(0, i).reduce((a, c) => a + c[1], 0);
const FL_ACTS = ["⧉", "⎘", "✎", "📋", "🗑"]; // Copy Link · Clone Form · Edit · View Responses · Delete
const flActPt = (row: number, a: number) => ({ x: MX(flColX(6) + 12 + a * 44 + 17), y: MY(FL.tableTop + 46 + row * FL.rowH + FL.rowH / 2) });
const FormsList: React.FC<{ rows: FormRowT[]; press?: string; actPress?: [number, number] }> = ({ rows, press, actPress }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="All Forms" sub="Manage all form builder forms" x={24} y={16} />
    <UB {...FL.create} label="Create New" icon="＋" press={press === "create"} />
    <div style={{ position: "absolute", left: 1350 - 24 - 46, top: 22, width: 46, height: 40, borderRadius: 8, background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⤓</div>
    <div style={{ position: "absolute", left: 24, top: 96, width: 340, height: 40, borderRadius: 8, border: "1px solid #D1D5DB", background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: "#9CA3AF" }}>⌕ Search Form Name...</div>
    <div style={{ position: "absolute", left: 24, top: FL.tableTop, width: 1300, height: 46 + rows.length * FL.rowH, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ display: "flex", height: 46, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, alignItems: "center" }}>{FL_COLS.map(([c, w]) => <div key={c} style={{ width: w, padding: "0 14px", boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: "#374151" }}>{c}</div>)}</div>
      {rows.map((r, i) => (
        <div key={r.id} style={{ display: "flex", height: FL.rowH, alignItems: "center", borderBottom: "1px solid #F1F2F4", opacity: r.o ?? 1, background: r.hl ? "#F5F7FF" : "#fff" }}>
          <div style={{ width: 300, padding: "0 14px", boxSizing: "border-box", fontSize: 14.5, fontWeight: 700, color: BLUE }}>{r.name}</div>
          <div style={{ width: 130, padding: "0 14px", boxSizing: "border-box", fontSize: 13, color: GRAY, fontFamily: "monospace" }}>{r.id}</div>
          <div style={{ width: 160, padding: "0 14px", boxSizing: "border-box", fontSize: 14, color: INK }}>{r.by}</div>
          <div style={{ width: 130, textAlign: "center", fontSize: 14.5, fontWeight: 800, color: INK }}>{r.subs}</div>
          <div style={{ width: 120, padding: "0 14px", boxSizing: "border-box" }}><span style={{ fontSize: 12.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: r.status === "Active" ? "#DCFCE7" : "#FEF3C7", color: r.status === "Active" ? "#15803D" : "#B45309" }}>{r.status}</span></div>
          <div style={{ width: 160, padding: "0 14px", boxSizing: "border-box", fontSize: 13.5, color: "#374151" }}>{r.date}</div>
          <div style={{ width: 300, padding: "0 12px", boxSizing: "border-box", display: "flex", gap: 10 }}>{FL_ACTS.map((a, k) => <div key={k} style={{ width: 34, height: 34, borderRadius: 8, background: k === 4 ? "#FEE2E2" : BLUE_SOFT, color: k === 4 ? "#DC2626" : BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: actPress && actPress[0] === i && actPress[1] === k ? "0 0 0 3px #A5B4FC" : "none" }}>{a}</div>)}</div>
        </div>
      ))}
    </div>
  </div>
);

// ═══ f0 — HOOK ══════════════════════════════════════════════════════════════
const SceneHookFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  return <Hook3 g={g} fps={fps} D={D} b2={140} b3={300}
    pain={<>Your student data is spread across <span style={{ color: "#F87171" }}>five outside tools</span>.</>}
    painSub="Who can see it? Where did that response go? Nobody knows."
    painCards={[["📊", "A paid survey app"], ["📝", "A sign-up sheet with its own login"], ["📧", "Answers buried in email"]]}
    painStat={["$$$", "every month, for tools you shouldn't need"]}
    other={<>stop at enrollment. <span style={{ color: "#FCA5A5" }}>Everything else? Another tool.</span></>}
    otherItems={["No built-in form builder", "Feedback and surveys live somewhere else", "Responses never reach your platform"]}
    win={<>Every form, built <span style={{ color: "#5EEAD4" }}>inside your platform</span>.</>}
    trust={["Drag-and-drop builder — no developer", "Your brand, one shareable link", "Every response stays in skillBNK"]}
    visual={<HookCard title="Campus Visit Feedback">
      <div style={{ marginTop: 16, opacity: fi(g, 316, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Full name *</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>Jordan Lee</div></div><div style={{ marginTop: 16, opacity: fi(g, 324, 8) }}><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Email</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, color: INK }}>jordan.lee@example.com</div></div>
      <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#374151", opacity: fi(g, 332, 8) }}>How was your visit?</div>
      <div style={{ marginTop: 6, fontSize: 40, color: "#F59E0B", letterSpacing: 8, opacity: fi(g, 338, 8) }}>★★★★★</div>
      <div style={{ marginTop: 20, height: 52, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 19, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: fi(g, 346, 8) }}>Submit Form</div>
    </HookCard>} />;
};

// ═══ f1 — All Forms → Create New ═══════════════════════════════════════════
const SceneListFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [80, 66], [318, 278], [330, 330]]);
  const opened = g >= 70;
  const M = menuPt("Form Builder");
  const CR = { x: MX(ctr(FL.create).x), y: MY(ctr(FL.create).y) };
  const SUB = { x: MX(flColX(3) + 65), y: MY(FL.tableTop + 46 + FL.rowH / 2) };
  const cur = path(g, [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [120, SUB.x, SUB.y], [170, SUB.x, SUB.y + 3 * FL.rowH], [190, MX(flColX(4) + 50), SUB.y + 3 * FL.rowH], [262, CR.x, CR.y], [282, CR.x, CR.y], [330, CR.x, CR.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 380, 1.9], [66, 300, 380, 1.9], [96, 840, 360, 1.3], [200, 840, 360, 1.3], [250, CR.x - 120, 140, 1.9], [330, CR.x - 120, 140, 1.9]];
  return (
    <FStage g={g} keys={keys} url={opened ? FB_URL_LIST : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 66), rip(g, 278))} active={opened ? "Form Builder" : "Dashboard"} chip={[1, !opened ? "Company portal → Form Builder" : g < 240 ? "All Forms — submissions and status at a glance" : "Create New"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <FormsList rows={FORMS} press={g >= 272 && g < 284 ? "create" : undefined} />}
    </FStage>
  );
};

// ═══ f2 — builder layout tour ═══════════════════════════════════════════════
const SceneLayoutFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [60, 30], [150, 100], [205, 152], [262, 196], [330, 300]]);
  const order: (keyof typeof FB_HB)[] = ["prev", "test", "exp", "imp", "save"];
  const T0 = 196, ST = 24;
  const on = g < T0 - 4 ? -1 : Math.min(4, Math.floor((g - T0 + 4) / ST));
  const pts: P3[] = [[0, MX(600), MY(300)], [30, MX(150), MY(300)], [80, MX(150), MY(420)], [96, MX(660), MY(230)], [140, MX(660), MY(260)], [150, MX(1180), MY(140)], [180, MX(1180), MY(140)]];
  order.forEach((k, i) => { pts.push([T0 + i * ST, fbHdr(k).x, fbHdr(k).y], [T0 + i * ST + 12, fbHdr(k).x, fbHdr(k).y]); });
  pts.push([D, fbHdr("save").x, fbHdr("save").y + 40]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(170), 420, 1.7], [86, MX(170), 420, 1.7], [104, MX(665), 330, 1.6], [140, MX(665), 330, 1.6], [156, MX(1150), 330, 1.7], [184, MX(1150), 330, 1.7], [T0 - 4, fbHdr("exp").x, 120, 1.9], [D, fbHdr("exp").x, 120, 1.9]];
  const names = { prev: "Preview", test: "Test", exp: "Export", imp: "Import", save: "Save" };
  const part = g < 92 ? "Form Elements on the left" : g < 148 ? "Your form page in the middle" : g < T0 - 4 ? "Properties on the right" : `Header · ${names[order[on]]}`;
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={0} active="Form Builder" chip={[2, part]}>
      <FBBuilder press={on >= 0 ? order[on] : undefined} palHl={g >= 30 && g < 92 ? FB_PAL[Math.min(10, Math.floor((g - 30) / 5))][0] : undefined} />
    </FStage>
  );
};

// ═══ f3 — rows + drag elements ══════════════════════════════════════════════
const SceneRowsFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const TI = 80, TE = 150, T1 = 236, TS = 300, DR = 44;
  const r2: FBRow = { cols: [g >= TI + DR ? [{ label: "Text Input", type: "Text Input", o: fi(g, TI + DR, 8) }] : [], g >= TE + DR ? [{ label: "Email", type: "Email", o: fi(g, TE + DR, 8) }] : []] };
  if (g >= TI + 16 && g < TI + DR) r2.dropCol = 0;
  if (g >= TE + 16 && g < TE + DR) r2.dropCol = 1;
  const r1: FBRow = { cols: [g >= TS + DR ? [{ label: "Select Dropdown", type: "Select Dropdown", o: fi(g, TS + DR, 8) }] : []], o: fi(g, T1 + 10, 8) };
  if (g >= TS + 16 && g < TS + DR) r1.dropCol = 0;
  const rows: FBRow[] = g >= 46 ? [r2, ...(g >= T1 + 10 ? [r1] : [])] : [];
  const BTN2 = { x: MX(ctr(FB_EMPTY_BTN(1)).x), y: MY(ctr(FB_EMPTY_BTN(1)).y) };
  const base: FBRow[] = [{ cols: [[], []] }];
  const withEl: FBRow[] = [{ cols: [[{ label: "", type: "" }], [{ label: "", type: "" }]] }];
  const ADD1 = { x: MX(ctr(fbAddRow(withEl, 0)).x), y: MY(ctr(fbAddRow(withEl, 0)).y) };
  const C0 = fbColPt(base, 0, 0), C1 = fbColPt(base, 0, 1);
  const R1C = fbColPt([withEl[0], { cols: [[]] }], 1, 0);
  const drag = g >= TI && g < TI + DR ? "Text Input" : g >= TE && g < TE + DR ? "Email" : g >= TS && g < TS + DR ? "Select Dropdown" : "";
  const cur = path(g, [[0, fbHdr("save").x, fbHdr("save").y + 40], [30, BTN2.x, BTN2.y], [44, BTN2.x, BTN2.y], [TI - 14, fbPalPt("Text Input").x, fbPalPt("Text Input").y], [TI, fbPalPt("Text Input").x, fbPalPt("Text Input").y], [TI + DR - 6, C0.x, C0.y], [TI + DR, C0.x, C0.y],
    [TE - 14, fbPalPt("Email").x, fbPalPt("Email").y], [TE, fbPalPt("Email").x, fbPalPt("Email").y], [TE + DR - 6, C1.x, C1.y], [TE + DR, C1.x, C1.y], [T1 - 16, ADD1.x, ADD1.y], [T1, ADD1.x, ADD1.y],
    [TS - 14, fbPalPt("Select Dropdown").x, fbPalPt("Select Dropdown").y], [TS, fbPalPt("Select Dropdown").x, fbPalPt("Select Dropdown").y], [TS + DR - 6, R1C.x, R1C.y], [TS + DR, R1C.x, R1C.y], [D, R1C.x + 120, R1C.y + 80]]);
  const keys: CamKey[] = [[0, fbHdr("exp").x, 120, 1.9], [26, BTN2.x + 60, BTN2.y - 60, 1.7], [50, MX(500), 330, 1.35], [D, MX(500), 380, 1.35]];
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 42), rip(g, T1 - 2))} grab={!!drag} active="Form Builder" chip={[3, g < 60 ? "2 Column Row" : g < T1 - 20 ? "Drag elements into the columns" : g < TS ? "Add 1 Column Row" : "Drop in a Select Dropdown"]}
      over={drag ? <Ghost x={cur.x} y={cur.y} label={drag} /> : undefined}>
      <FBBuilder rows={rows} palHl={drag || undefined} addRowPress={g >= 36 && g < 46 ? 1 : g >= T1 - 6 && g < T1 + 4 ? 0 : -1} />
    </FStage>
  );
};

// ═══ f4 — properties panel ═══════════════════════════════════════════════════
const SceneProps2FB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = tw(gt(f, dur, D), [[0, 0], [46, 38], [141, 80], [200, 160], [247, 240], [360, 360]]);
  const sel = g >= 40;
  const label = g < 80 ? "Text Input" : typed(g, 82, "Full name", 0.6) || " ";
  const ph = g < 160 ? "" : typed(g, 162, "Jane Doe", 0.6);
  const req = interpolate(g, [236, 244], [0, 1], cl);
  const el: FBEl = { label: label.trim() ? label : "", type: "Text Input", ph, req: req > 0.5, sel };
  const rows: FBRow[] = [{ cols: [[el], [{ label: "Email", type: "Email" }]] }, { cols: [[{ label: "Select Dropdown", type: "Select Dropdown" }]] }];
  const EL = fbElPt(rows, 0, 0, 0);
  const LBL = { x: MX(FB_PROPS.x + 150), y: MY(62 + 78 + 27 + 20) };
  const PH = { x: MX(FB_PROPS.x + 150), y: MY(62 + 156 + 27 + 20) };
  const cur = path(g, [[0, MX(700), MY(500)], [28, EL.x, EL.y + 20], [40, EL.x, EL.y + 20], [70, LBL.x, LBL.y], [140, LBL.x, LBL.y], [158, PH.x, PH.y], [214, PH.x, PH.y], [232, FB_REQ.x, FB_REQ.y], [244, FB_REQ.x, FB_REQ.y], [300, EL.x + 40, EL.y + 30], [D, EL.x + 40, EL.y + 30]]);
  const keys: CamKey[] = [[0, MX(500), 380, 1.35], [26, EL.x + 80, EL.y + 40, 1.7], [44, MX(1000), 300, 1.45], [230, MX(1000), 330, 1.45], [262, MX(860), 260, 1.5], [D, MX(860), 260, 1.5]];
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 38), rip(g, 240))} active="Form Builder" chip={[4, g < 60 ? "Click an element to select it" : g < 226 ? "Properties → Label · Placeholder" : "Required"]}>
      <FBBuilder rows={rows} selType={sel ? "Text Input" : undefined} props={sel ? <div style={{ opacity: fi(g, 40, 8) }}><FBProps label={label} ph={ph} req={req} gl={g >= 70 && g < 150 ? "label" : g >= 156 && g < 220 ? "ph" : undefined} /></div> : undefined} />
    </FStage>
  );
};

// ═══ f5 — Add Tab → search → Rating onto the new page ═══════════════════════
const RATING_PAL: [string, string][] = [["Rating", "Star rating input"]];
const SceneTabsFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = tw(gt(f, dur, D), [[0, 0], [94, 42], [176, 132], [224, 176], [282, 236], [360, 330]]);
  const two = g >= 136;
  const tabs = two ? ["Form Page 1", "Your visit"] : ["Form Page 1"];
  const BOX = { x: 544, y: 220, w: 512, h: 200 };
  const CREATE = { x: BOX.w - 24 - 110, y: BOX.h - 60, w: 110, h: 38 };
  const mo = g >= 46 && g < 140 ? Math.min(fi(g, 46, 8), fo(g, 132, 8)) : 0;
  const ADD = { x: MX(ctr(fbAddTabBtn(["Form Page 1"])).x), y: MY(ctr(fbAddTabBtn(["Form Page 1"])).y) };
  const CR = { x: BOX.x + ctr(CREATE).x, y: BOX.y + ctr(CREATE).y };
  const search = g < 176 ? "" : typed(g, 178, "rat", 0.25);
  const pal = search.length >= 3 ? RATING_PAL : search ? FB_PAL.filter((p) => p[0].toLowerCase().includes(search) || p[1].toLowerCase().includes(search)) : FB_PAL;
  const TR = 236, DR = 46;
  const dropped = g >= TR + DR;
  const rows: FBRow[] = !two ? [{ cols: [[{ label: "Full name", type: "Text Input", ph: "Jane Doe", req: true }], [{ label: "Email", type: "Email" }]] }, { cols: [[{ label: "Select Dropdown", type: "Select Dropdown" }]] }] : dropped ? [{ cols: [[{ label: "Rating", type: "Rating", o: fi(g, TR + DR, 8) }]] }] : [];
  const SEARCH = { x: MX(150), y: MY(62 + 44 + 18) };
  const RP = fbPalPt("Rating", RATING_PAL);
  const EMPTY = { x: MX(FB_CAN.x + FB_CAN.w / 2), y: MY(FB_CAN.top + 200) };
  const cur = path(g, [[0, MX(700), MY(500)], [30, ADD.x, ADD.y], [44, ADD.x, ADD.y], [70, BOX.x + 250, BOX.y + 100], [108, BOX.x + 250, BOX.y + 100], [120, CR.x, CR.y], [134, CR.x, CR.y], [166, SEARCH.x, SEARCH.y], [176, SEARCH.x, SEARCH.y], [TR - 14, RP.x, RP.y], [TR, RP.x, RP.y], [TR + DR - 6, EMPTY.x, EMPTY.y], [TR + DR, EMPTY.x, EMPTY.y], [D, EMPTY.x + 100, EMPTY.y + 60]]);
  const keys: CamKey[] = [[0, MX(500), 330, 1.3], [26, ADD.x, 160, 1.8], [50, 800, 330, 1.4], [136, 800, 330, 1.4], [160, MX(330), 300, 1.45], [D, MX(330), 330, 1.45]];
  const drag = g >= TR && g < TR + DR;
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 132), rip(g, 174))} grab={drag} active="Form Builder" chip={[5, g < 140 ? "Add Tab → name the page → Create Tab" : g < TR ? "Search elements…" : "Drop it to create a new row"]}
      over={<>
        <Modal box={BOX} title="Add New Tab" o={mo}>
          <MInput x={24} y={70} w={BOX.w - 48} value={typed(g, 72, "Your visit", 0.5)} ph="Tab title" glow={g >= 70 && g < 116} />
          <UB {...CREATE} fs={13.5} label="Create Tab" press={g >= 126 && g < 134} />
        </Modal>
        {drag && <Ghost x={cur.x} y={cur.y} label="Rating" />}
      </>}>
      <FBBuilder rows={rows} tabs={tabs} act={two ? 1 : 0} press={g >= 36 && g < 46 ? "tab" : undefined} search={search} pal={pal} palHl={drag ? "Rating" : undefined} emptyDrop={drag && g >= TR + 18} />
    </FStage>
  );
};

// ═══ f6 — Test ══════════════════════════════════════════════════════════════
const SceneTestFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = tw(gt(f, dur, D), [[0, 0], [24, 36], [130, 162], [212, 188], [295, 282], [330, 330]]);
  const tabs = ["Form Page 1", "Your visit"];
  const rows: FBRow[] = [{ cols: [[{ label: "Rating", type: "Rating" }]] }];
  const BOX = { x: 400, y: 50, w: 800, h: 700 };
  const mo = g >= 40 ? fi(g, 40, 8) : 0;
  const SUB = { x: BOX.w - 24 - 130, y: BOX.h - 64, w: 130, h: 40 };
  const RES = { x: BOX.w - 24 - 130 - 10 - 90, y: BOX.h - 64, w: 90, h: 40 };
  const err = g >= 168 && g < 240;
  const nameV = g < 186 ? "" : typed(g, 188, "Jordan Lee", 0.6);
  const cur = path(g, [[0, MX(700), MY(500)], [26, fbHdr("test").x, fbHdr("test").y], [38, fbHdr("test").x, fbHdr("test").y], [90, BOX.x + 300, BOX.y + 300], [150, BOX.x + ctr(SUB).x, BOX.y + ctr(SUB).y], [164, BOX.x + ctr(SUB).x, BOX.y + ctr(SUB).y], [184, BOX.x + 300, BOX.y + 170], [222, BOX.x + 300, BOX.y + 170], [270, BOX.x + ctr(RES).x, BOX.y + ctr(RES).y], [286, BOX.x + ctr(RES).x, BOX.y + ctr(RES).y], [D, BOX.x + ctr(RES).x, BOX.y + ctr(RES).y + 30]]);
  const keys: CamKey[] = [[0, MX(500), 330, 1.3], [24, fbHdr("test").x, 150, 1.9], [44, 800, 420, 1.15], [130, 800, 420, 1.15], [150, 900, 560, 1.5], [176, 760, 300, 1.5], [240, 760, 330, 1.5], [262, 1000, 620, 1.6], [D, 1000, 620, 1.6]];
  const reset = g >= 282;
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 36), rip(g, 162), rip(g, 282))} active="Form Builder" chip={[6, g < 160 ? "Test — try the form before publishing" : g < 260 ? "Required fields are checked" : "Reset clears it"]}
      over={<Modal box={BOX} title="Test Form" sub="Test your form before publishing" o={mo}>
        <div style={{ position: "absolute", left: 24, top: 90, fontSize: 15, fontWeight: 800, color: INK }}>Form Page 1</div>
        <MInput x={24} y={120} w={360} label="Full name" req value={reset ? "" : nameV} ph="Jane Doe" glow={g >= 186 && g < 230} />
        {err && !nameV && <div style={{ position: "absolute", left: 24, top: 192, fontSize: 12.5, color: "#DC2626", fontWeight: 600 }}>Full name is required</div>}
        <MInput x={408} y={120} w={368} label="Email" value={reset || g < 196 ? "" : "jordan.lee@example.com"} ph="" />
        <MInput x={24} y={214} w={752} label="Select Dropdown" value="" ph="" select />
        <div style={{ position: "absolute", left: 24, top: 310, fontSize: 15, fontWeight: 800, color: INK }}>Your visit</div>
        <div style={{ position: "absolute", left: 24, top: 340, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Rating</div>
        <div style={{ position: "absolute", left: 24, top: 364, fontSize: 30, color: "#F59E0B", letterSpacing: 6 }}>{!reset && g >= 230 ? "★★★★★" : "☆☆☆☆☆"}</div>
        <UB {...RES} v="outline" label="Reset" press={g >= 278 && g < 288} />
        <UB {...SUB} label="Submit Form" press={g >= 156 && g < 166} />
        <UB x={24} y={BOX.h - 64} w={90} h={40} v="outline" label="Cancel" />
      </Modal>}>
      <FBBuilder rows={rows} tabs={tabs} act={1} press={g >= 30 && g < 42 ? "test" : undefined} />
    </FStage>
  );
};
// NOTE: the required-field message is drawn as plain text; the renderer validates required fields on submit.

// ═══ f7 — Save → Form Settings → Save Form ══════════════════════════════════
const SceneSaveFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [14, 36], [40, 66], [141, 150], [160, 182], [212, 204], [282, 226], [341, 248], [381, 360], [420, 392]]);
  const tabs = ["Form Page 1", "Your visit"];
  const rows: FBRow[] = [{ cols: [[{ label: "Rating", type: "Rating" }]] }];
  const BOX = { x: 520, y: 40, w: 560, h: 740 };
  const mo = g >= 40 && g < 372 ? Math.min(fi(g, 40, 8), fo(g, 364, 8)) : 0;
  const OPTS: [string, string][] = [["Collect Email", "Turn on only when submissions should require login. Leave off for public website embeds."], ["Limit Response", "Allow only one response per user"], ["Allow Editing", "Let users edit their responses"], ["Send Confirmation Email", "Email users after form submission"]];
  const optY = (i: number) => 300 + i * 78;
  const SAVEF = { x: BOX.w - 24 - 120, y: BOX.h - 62, w: 120, h: 40 };
  const sv = { x: BOX.x + ctr(SAVEF).x, y: BOX.y + ctr(SAVEF).y };
  const optPt = (i: number) => ({ x: BOX.x + 120, y: BOX.y + optY(i) + 26 });
  const cur = path(g, [[0, MX(700), MY(500)], [26, fbHdr("save").x, fbHdr("save").y], [38, fbHdr("save").x, fbHdr("save").y], [64, BOX.x + 260, BOX.y + 120], [126, BOX.x + 260, BOX.y + 120], [140, BOX.x + 260, BOX.y + 200], [170, BOX.x + 260, BOX.y + 200], [190, optPt(0).x, optPt(0).y], [214, optPt(1).x, optPt(1).y], [236, optPt(2).x, optPt(2).y], [258, optPt(3).x, optPt(3).y], [330, optPt(3).x, optPt(3).y + 20], [350, sv.x, sv.y], [364, sv.x, sv.y], [D, sv.x, sv.y + 40]]);
  const keys: CamKey[] = [[0, MX(500), 330, 1.3], [24, fbHdr("save").x - 80, 150, 1.9], [46, 800, 300, 1.45], [176, 800, 320, 1.45], [196, 800, 520, 1.45], [330, 800, 520, 1.45], [350, 900, 620, 1.5], [380, 800, 420, 1.2], [D, 800, 420, 1.2]];
  const hlOpt = g < 180 ? -1 : Math.min(3, Math.floor((g - 182) / 22));
  return (
    <FStage g={g} keys={keys} url={FB_URL_ADD} cur={cur} ripple={Math.max(rip(g, 36), rip(g, 360))} active="Form Builder" chip={[7, g < 176 ? "Save → Form Settings: name + status" : g < 340 ? "Form Options" : "Save Form"]}
      over={<>
        <Modal box={BOX} title="Form Settings" sub="Configure your form name and settings before saving." o={mo}>
          <MInput x={24} y={92} w={BOX.w - 48} label="Form Name" req value={typed(g, 66, "Campus Visit Feedback", 0.5)} ph="Enter form name" glow={g >= 64 && g < 132} />
          <MInput x={24} y={176} w={BOX.w - 48} label="Status" value={g >= 150 ? "Active" : ""} ph="Select status" select glow={g >= 138 && g < 172} />
          <div style={{ position: "absolute", left: 24, top: 262, fontSize: 15, fontWeight: 800, color: INK }}>Form Options</div>
          {OPTS.map(([t, d], i) => (
            <div key={t} style={{ position: "absolute", left: 24, top: optY(i), width: BOX.w - 48, height: 66, borderRadius: 10, border: `1px solid ${hlOpt === i ? "#A5B4FC" : LINE}`, background: hlOpt === i ? "#F5F7FF" : "#fff", boxSizing: "border-box", padding: "10px 14px" }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{t}</div>
              <div style={{ marginTop: 3, fontSize: 12, color: GRAY, width: 420, lineHeight: 1.3 }}>{d}</div>
              <div style={{ position: "absolute", right: 14, top: 20 }}><Toggle on={0} /></div>
            </div>
          ))}
          <UB x={SAVEF.x - 10 - 90} y={SAVEF.y} w={90} h={40} v="outline" label="Cancel" />
          <UB {...SAVEF} label={g >= 362 && g < 372 ? "Saving..." : "Save Form"} press={g >= 356 && g < 366} />
        </Modal>
        {g >= 372 && <Toast g={g} at={372} text="Form created successfully!" x={1100} y={150} />}
      </>}>
      <FBBuilder rows={rows} tabs={tabs} act={1} press={g >= 30 && g < 42 ? "save" : undefined} />
    </FStage>
  );
};

// ═══ f8 — copy link → public form → submitted ═══════════════════════════════
const SceneShareFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = tw(gt(f, dur, D), [[0, 0], [141, 66], [201, 150], [246, 254], [282, 344], [420, 420]]);
  if (g < 150) {
    const rows: FormRowT[] = [{ name: "Campus Visit Feedback", id: "f-9e4b12", by: "Ava Reyes", subs: 0, status: "Active", date: "Oct 6, 2026", hl: true }, ...FORMS];
    const CP = flActPt(0, 0);
    const cur = path(g, [[0, 800, 500], [50, CP.x, CP.y], [70, CP.x, CP.y], [150, CP.x, CP.y]]);
    const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 820, 330, 1.3], [50, CP.x - 260, CP.y, 1.7], [150, CP.x - 260, CP.y, 1.7]];
    return (
      <FStage g={g} keys={keys} url={FB_URL_LIST} cur={cur} ripple={rip(g, 66)} active="Form Builder" chip={[8, "New form, Active → Copy Link"]}
        over={g >= 72 ? <Toast g={g} at={72} text="Link copied to clipboard!" x={1150} y={150} /> : undefined}>
        <FormsList rows={rows} actPress={g >= 62 && g < 74 ? [0, 0] : undefined} />
      </FStage>
    );
  }
  const h = g - 150;
  const page = h < 110 ? 0 : 1;
  const done = h >= 200;
  const NEXT = { x: 1100, y: 640 }, SUBMIT = { x: 1080, y: 640 };
  const cur = path(h, [[0, 900, 500], [24, 700, 300], [70, 700, 300], [96, NEXT.x, NEXT.y], [108, NEXT.x, NEXT.y], [140, 760, 330], [170, 820, 330], [186, SUBMIT.x, SUBMIT.y], [198, SUBMIT.x, SUBMIT.y], [270, 900, 600]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 800, 400, 1.3], [200, 800, 400, 1.3], [214, 800, 380, 1.2], [270, 800, 380, 1.2]];
  return (
    <FStage g={h} keys={keys} url="www.skillbnk.com/form/f-9e4b12" cur={cur} ripple={Math.max(rip(h, 104), rip(h, 194))} tag={{ n: 2, label: "Shared form link", url: "www.skillbnk.com" }} bg="#EEF2F6" chip={[9, done ? "Submitted — it lands in Responses" : "Anyone with the link can fill it in"]}>
      <div style={{ position: "absolute", left: 400, top: 60, width: 800, height: 660, background: "#fff", borderRadius: 16, boxShadow: "0 20px 50px #0001", border: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 40, top: 30 }}><BrightLogo /></div>
        <div style={{ position: "absolute", left: 40, top: 92, fontSize: 28, fontWeight: 900, color: INK }}>Campus Visit Feedback</div>
        {!done ? (page === 0 ? (<>
          <MInput x={40} y={150} w={340} label="Full name" req value={typed(h, 28, "Jordan Lee", 0.4)} ph="Jane Doe" glow={h >= 24 && h < 60} />
          <MInput x={410} y={150} w={350} label="Email" value={h >= 50 ? "jordan.lee@example.com" : ""} />
          <MInput x={40} y={240} w={720} label="Select Dropdown" value={h >= 66 ? "Option 2" : ""} ph="" select />
          <UB x={NEXT.x - 400 - 60} y={NEXT.y - 60 - 22} w={120} h={44} label="Next" press={h >= 100 && h < 110} />
        </>) : (<div style={{ opacity: fi(h, 110, 8) }}>
          <div style={{ position: "absolute", left: 40, top: 150, fontSize: 15, fontWeight: 700, color: "#374151" }}>Rating</div>
          <div style={{ position: "absolute", left: 40, top: 178, fontSize: 40, color: "#F59E0B", letterSpacing: 8 }}>{h >= 172 ? "★★★★★" : h >= 150 ? "★★★★☆" : "☆☆☆☆☆"}</div>
          <UB x={40} y={NEXT.y - 60 - 22} w={120} h={44} v="outline" label="Previous" />
          <UB x={SUBMIT.x - 400 - 70} y={SUBMIT.y - 60 - 22} w={140} h={44} label="Submit Form" press={h >= 190 && h < 200} />
        </div>)) : (
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: fi(h, 200, 10) }}>
            <div style={{ width: 84, height: 84, margin: "0 auto", borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(h, 200, fps)})` }}>✓</div>
            <div style={{ marginTop: 20, fontSize: 30, fontWeight: 900, color: INK }}>Thank You!</div>
            <div style={{ marginTop: 8, fontSize: 17, color: GRAY }}>Your form has been submitted successfully.</div>
          </div>
        )}
      </div>
    </FStage>
  );
};

// ═══ f9 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapFB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["▥", "Rows & columns", "Drag any element in"], ["⚙", "Properties", "Label · placeholder · Required"], ["🗂", "Pages", "Split long forms into tabs"], ["🧪", "Test", "Before you publish"], ["🔗", "Share", "One link, every response"]]} line={<>One builder. <span style={{ color: "#5EEAD4" }}>Every form.</span></>} />;
};
