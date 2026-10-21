import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * TemplatesStoryVideo — DEEP version (sheet serial 37, ~2.5 min). Story: Dana Brooks, Keystone Real Estate Academy (fictional).
 * Verified in code (SB-Branch Settings/Template): "Templates" + tooltip "View and manage templates created by your school and shared
 * across programs, sessions, bootcamps, and users.", search "Enter Template Title...", Create New Template, export button, Filter
 * (Category / Bootcamp / Session), columns Title / Category / Description / Attachment ("No image") / Audience / Status / Created By /
 * Creation Date / Last Update / Action (View, Edit, more → Delete). CreateEditTemplateModal: "Create New Template" / "Edit Template",
 * Title * ("Enter title"), Category * ("Add new category"), Description * (block editor), Status (Active/Inactive, "Select status"),
 * Upload Attachments, AssignToForm (assign type User / Programs / Groups / Global, "Select Programs", Session "Select Sessions"),
 * Save / Update, toasts "Template created successfully" / "Template updated successfully". ViewTemplateModal: Attachments, Status
 * Active/Inactive, Users / Programs / Groups. Learner (en.ts): My Templates, "Browse and manage your saved templates for quick and easy
 * use.", "Search Templates...", filter Type / Created Date, Template Document Details, "Easily view your template documents",
 * Table of Contents, Tags, Associated Programs, Related Templates.
 * Calm camera: one move per beat. Voice: python3 generate-voice-story.py src/TemplatesStoryVideo.tsx public/templatestory  (REDO=1)
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 354,
  d1: 302,
  d2: 124,
  d3: 229,
  d4: 337,
  d5: 172,
  d6: 351,
  d7: 153,
  d8: 243,
  d9: 214,
  d10: 298,
  d11: 212,
  d12: 302,
  p13: 240,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 16, 31, 44, 49, 58, 90, 96, 110, 112, 117, 123, 132, 140, 150, 158, 166, 174, 206, 214, 240, 250, 278, 284, 291, 312, 320, 327],
  d1: [2, 14, 45, 48, 61, 78, 93, 104, 136, 139, 147, 154, 162, 189, 194, 222, 224, 231, 236, 253, 260, 265, 273],
  d2: [2, 10, 19, 33, 40, 54, 70, 75, 79, 83, 91],
  d3: [2, 20, 33, 40, 48, 79, 82, 88, 93, 99, 108, 117, 134, 145, 153, 160, 163, 180, 188],
  d4: [2, 12, 20, 31, 47, 47, 87, 91, 97, 109, 109, 123, 139, 146, 164, 180, 192, 198, 206, 218, 230, 238, 243, 254, 286, 298, 303],
  d5: [2, 13, 31, 40, 48, 61, 76, 85, 96, 100, 108, 113],
  d6: [2, 27, 34, 40, 64, 72, 74, 84, 87, 94, 101, 129, 144, 157, 162, 166, 174, 196, 208, 213, 258, 261, 269, 277, 298, 306, 313, 319],
  d7: [2, 33, 78, 95, 96, 110, 110, 124],
  d8: [2, 22, 34, 42, 51, 60, 78, 78, 96, 103, 112, 123, 140, 148, 159, 192, 211, 217],
  d9: [9, 16, 31, 40, 50, 63, 77, 84, 112, 114, 139, 145, 156, 166, 179, 188, 193],
  d10: [2, 13, 21, 29, 61, 66, 76, 91, 91, 108, 118, 140, 143, 154, 165, 176, 183, 190, 220, 223, 231, 241, 247, 255, 262, 271],
  d11: [2, 22, 28, 34, 73, 73, 87, 100, 110, 117, 123, 130, 150, 157, 168, 172],
  d12: [2, 24, 32, 49, 61, 80, 83, 95, 95, 106, 124, 138, 150, 154, 162, 167, 176, 181, 216, 222, 228, 234, 243, 252, 268, 277],
  p13: [2, 24, 56, 62, 85, 96, 136, 138, 148, 160, 171, 193, 201],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Dana trains new real estate agents. Every week, each of them writes the same listing letter from scratch. Twelve agents, twelve versions, and Dana corrects every single one.",
  d1: "In skillbank, her reusable documents live in Templates. Each one shows its category, its attachment, who can see it, and whether it's live.",
  d2: "She clicks Create New Template, and gives it a clear title.",
  d3: "Category keeps the list tidy. She can pick an existing one, or simply type a new one, like Letters.",
  d4: "The description is the template itself. She writes the letter once, and leaves blanks in brackets, so each agent fills in their own owner, address and price.",
  d5: "She uploads the market report that agents should send along with it.",
  d6: "Next, who gets it. A template can go to single users, to groups, to a whole program, or to everyone. Dana picks her program, and the evening session.",
  d7: "Status, active. Save. And the template is live.",
  d8: "Months later, there are dozens of templates. She searches by title, or filters by category, bootcamp, or session.",
  d9: "View opens a full preview, with the attachment, the status, and exactly which programs can see it.",
  d10: "When the market changes, she edits the letter and updates it, and every agent gets the new version. She can export the whole list as well.",
  d11: "Now, the learner side. Kevin opens My Templates in his portal, and searches for the letter.",
  d12: "He gets Dana's exact version, with a table of contents, the tags, and the program it belongs to. He fills in the blanks, and he's done.",
  p13: "Twelve agents, one letter, zero rewrites. Dana spends Monday coaching now, not correcting.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);

const MENU = ["Dashboard", "Approved Member", "Documents and Labs", "Slides", "Templates", "Settings"];
const ICONS = ["▦", "✅", "📄", "🖼", "🧩", "⚙"];
const TITLE = "Listing Letter — First Contact";
const LETTER = ["Dear [Owner Name],", "I noticed your home at [Property Address].", "Homes nearby recently sold for [Price Range].", "I'd love to send you a free market report.", "— [Agent Name], Keystone Realty"];
type R = { t: string; c: string; a: string; s: boolean; img: boolean };
const BASE: R[] = [
  { t: "Buyer consultation checklist", c: "Checklists", a: "New Agents — Fall 2026", s: true, img: false },
  { t: "Open house sign-in sheet", c: "Forms", a: "All agents (Global)", s: true, img: true },
  { t: "Price reduction talk track", c: "Scripts", a: "Group · Senior agents", s: false, img: false },
  { t: "Offer summary for sellers", c: "Letters", a: "New Agents — Fall 2026", s: true, img: false },
];

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "templates", -6),
  tour: cue("d1", "category", -4),
  clickCreate: cue("d2", "create", -2),
  typeTitle: cue("d2", "title", -6),
  clickCat: cue("d3", "category", -4),
  typeCat: cue("d3", "type", -2),
  desc: cue("d4", "writes", -4),
  blanks: cue("d4", "blanks"),
  upload: cue("d5", "uploads", -4),
  clickAssign: cue("d6", "who", -4),
  showTypes: cue("d6", "users", -6),
  pickProgram: cue("d6", "program", -4, 1),
  pickSession: cue("d6", "session", -4),
  status: cue("d7", "status", -4),
  clickSave: cue("d7", "save", -2),
  search: cue("d8", "searches", -4),
  clickFilter: cue("d8", "filters", -4),
  filterOff: S.d9 - 10,
  clickView: cue("d9", "view", -4),
  viewOff: S.d10 - 6,
  clickEdit: cue("d10", "edits", -4),
  clickUpdate: cue("d10", "updates", -2),
  clickExport: cue("d10", "export", -2),
  learner: cue("d11", "learner", -8),
  lSearch: cue("d11", "searches", -4),
  clickOpen: cue("d12", "gets", -6),
  fill: cue("d12", "fills"),
};
const CLICKS = [T.clickMenu, T.clickCreate, T.typeTitle, T.clickCat, T.desc, T.upload, T.clickAssign, T.pickProgram, T.pickSession, T.status, T.clickSave, T.search, T.clickFilter, T.clickView, T.clickEdit, T.clickUpdate, T.clickExport, T.lSearch, T.clickOpen];

// ───────── list page ─────────
const COLS = [{ h: "Title", w: 330 }, { h: "Category", w: 140 }, { h: "Attachment", w: 130 }, { h: "Audience", w: 230 }, { h: "Status", w: 120 }, { h: "Created By", w: 180 }, { h: "Last Update", w: 140 }, { h: "Action", w: 40 }];
const TBX = 18, TBY = 130, RH = 66;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const Thumb = () => <div style={{ width: 70, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#0EA5E9,#1E3A8A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>PDF</div>;
const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const created = f >= T.clickSave + 4;
  const q = f >= T.search && f < T.clickView ? typed(f, T.search + 4, "Listing", 0.5) : "";
  const filtering = q.length >= 4;
  const all: R[] = created ? [{ t: TITLE, c: "Letters", a: "New Agents — Fall 2026 · Evening", s: true, img: true }, ...BASE] : BASE;
  const rows = all.map((r) => ({ ...r, show: !filtering || r.t.toLowerCase().includes("listing") }));
  const fo = f >= T.clickFilter + 2 && f < T.filterOff ? pr(f, T.clickFilter + 2, 10) * (1 - lin(f, T.filterOff - 10, T.filterOff)) : 0;
  const updated = f >= T.clickUpdate + 4;
  return (
    <>
      <PageHead title="Templates" sub="Schools create templates and share them with students" />
      <div style={{ position: "absolute", left: 640, top: 24, width: 330, height: 48, borderRadius: 12, border: `2px solid ${q ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: q ? INK : "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>{q || "Enter Template Title..."}</div>
      <div style={{ position: "absolute", left: 984, top: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${fo > 0 ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚲</div>
      <div style={{ position: "absolute", left: 1040, top: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${f >= T.clickExport - 6 && f < T.clickExport + 30 ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⇩</div>
      <Btn x={1100} y={24} w={230} label="＋  Create New Template" primary fs={16} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={created ? 0 : -1} hlA={created ? 1 - lin(f, T.clickSave + 60, T.clickSave + 90) : 0}
        oRow={(i) => (created && i === 0 ? pr(f, T.clickSave + 4, 14) : rows[i].show ? 1 : 0.15)}
        rows={rows.map((r, i) => [
          <b style={{ fontWeight: 800 }}>🧩 {r.t}</b>, <Badge t={r.c} c={BLUE} bg="#EEF2FF" fs={13} />,
          r.img ? <Thumb /> : <span style={{ color: GRAY, fontSize: 14 }}>No image</span>, <span style={{ fontSize: 15 }}>{r.a}</span>,
          r.s ? <Badge t="Active" c="#15803D" bg="#DCFCE7" fs={13} dot /> : <Badge t="Inactive" c="#B91C1C" bg="#FEE2E2" fs={13} dot />,
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar t="DB" s={28} />Dana Brooks</div>,
          <span style={{ color: GRAY, fontSize: 15 }}>{i === 0 && created ? (updated ? "Today, 10:42" : "Today, 9:15") : "Oct 0" + (i + 3) + ", 2026"}</span>,
          <span style={{ color: BLUE, fontWeight: 900 }}>⋮</span>,
        ])} />
      {fo > 0 && (
        <div style={{ position: "absolute", left: 640, top: 80, width: 450, padding: 20, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0004", opacity: fo, transform: `translateY(${(1 - fo) * 10}px)`, fontFamily: FONT }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>Filter</div>
          {[["Category", "Letters"], ["Bootcamp", "New Agents — Fall 2026"], ["Session", "Evening"]].map(([l, v], i) => (
            <div key={l} style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", opacity: pr(f, T.clickFilter + 8 + i * 8, 8) }}>
              <span style={{ width: 110, fontSize: 16, fontWeight: 800, color: "#374151" }}>{l}</span>
              <span style={{ flex: 1, height: 42, borderRadius: 10, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, fontWeight: 700, color: INK }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// ───────── create / edit modal ─────────
const MX = 120, MY = 14, MW = 1120, MH = 806;
const MP = (x: number, y: number) => CT(MX + x, MY + y);
const lab = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 16, fontWeight: 800, color: "#374151" }}>{t}</div>;
const box = (x: number, y: number, w: number, on: boolean, v: React.ReactNode, ph: string, sel?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 48, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 17, fontWeight: 600, color: v ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>;
const Blanks: React.FC<{ s: string; hl: boolean }> = ({ s, hl }) => <>{s.split(/(\[[^\]]+\])/).map((p, k) => (p.startsWith("[") ? <span key={k} style={{ background: hl ? "#FEF08A" : "#EEF2FF", color: BLUE, fontWeight: 800, borderRadius: 4, padding: "0 3px" }}>{p}</span> : p))}</>;
const Modal: React.FC<{ f: number }> = ({ f }) => {
  const editMode = f >= T.clickEdit;
  const a = editMode ? T.clickEdit + 4 : T.clickCreate + 4, b = editMode ? T.clickUpdate + 4 : T.clickSave + 4;
  if (f < a - 1 || f > b + 14) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b, b + 12));
  const lines = editMode ? 5 : Math.floor(lin(f, T.desc, T.blanks + 10) * 5.99);
  const catOpen = !editMode && f >= T.clickCat + 2 && f < T.typeCat + 30;
  const typesOpen = !editMode && f >= T.showTypes - 4 && f < T.pickProgram + 4;
  const scope = editMode || f >= T.pickProgram + 4 ? "Programs" : "";
  const filled = (t: number) => editMode || f >= t;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: MX, top: MY + (1 - inn) * 30, width: MW, height: MH, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>{editMode ? "Edit Template" : "Create New Template"}</div>
        {lab(28, 74, "Title *")}{box(28, 98, 640, !editMode && f >= T.typeTitle && f < T.clickCat, editMode ? TITLE : typed(f, T.typeTitle, TITLE, 1.1), "Enter title")}
        {lab(700, 74, "Category *")}{box(700, 98, 390, catOpen, filled(T.typeCat + 14) ? "Letters" : catOpen ? typed(f, T.typeCat, "Letters", 0.4) : "", "Add new category", true)}
        {lab(28, 166, "Description *")}
        <div style={{ position: "absolute", left: 28, top: 190, width: 640, height: 290, borderRadius: 12, border: `2px solid ${!editMode && f >= T.desc && f < T.upload ? BLUE : editMode && f < T.clickUpdate ? BLUE : "#D1D5DB"}`, padding: 18, boxSizing: "border-box", fontSize: 19, fontWeight: 600, color: INK, lineHeight: 1.75 }}>
          {LETTER.slice(0, lines).map((l, i) => <div key={i}><Blanks s={editMode && i === 2 ? "Homes nearby recently sold for [Price Range] — up 6% this year." : l} hl={f >= T.blanks} /></div>)}
        </div>
        {lab(28, 498, "Upload Attachments")}
        <div style={{ position: "absolute", left: 28, top: 522, width: 640, height: 92, borderRadius: 12, border: `2px dashed ${filled(T.upload + 10) ? "#22C55E" : "#93C5FD"}`, background: filled(T.upload + 10) ? "#F0FDF4" : "#EFF6FF", display: "flex", alignItems: "center", gap: 14, padding: "0 18px", fontSize: 17, fontWeight: 800, color: filled(T.upload + 10) ? "#15803D" : BLUE }}>
          {filled(T.upload + 10) ? <><span style={{ width: 54, height: 54, borderRadius: 10, background: "linear-gradient(135deg,#0EA5E9,#1E3A8A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>PDF</span>market-report-oct.pdf · 1.2 MB ✓</> : "⇪ Drop files or click to upload"}
        </div>
        {lab(700, 166, "Assign To")}{box(700, 190, 390, typesOpen, scope, "Select assign type", true)}
        {lab(700, 258, "Programs")}{box(700, 282, 390, !editMode && f >= T.pickProgram + 4 && f < T.pickSession, filled(T.pickProgram + 10) ? "New Agents — Fall 2026" : "", "Select Programs", true)}
        {lab(700, 350, "Session")}{box(700, 374, 390, !editMode && f >= T.pickSession && f < T.status, filled(T.pickSession + 6) ? "Evening" : "", "Select Sessions", true)}
        {lab(700, 442, "Status")}{box(700, 466, 390, !editMode && f >= T.status && f < T.clickSave, filled(T.status + 6) ? <span style={{ color: "#15803D" }}>● Active</span> : "", "Select status", true)}
        {typesOpen && (
          <div style={{ position: "absolute", left: 700, top: 242, width: 390, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0005", padding: 6, zIndex: 3 }}>
            {["User", "Programs", "Groups", "Global"].map((t, i) => <div key={t} style={{ height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 17, fontWeight: 700, color: t === "Programs" && f >= T.pickProgram - 6 ? BLUE : INK, background: t === "Programs" && f >= T.pickProgram - 6 ? "#EEF2FF" : "transparent", opacity: pr(f, T.showTypes + i * 6, 8) }}>{t}</div>)}
          </div>
        )}
        <Btn x={MW - 28 - 130 - 12 - 110} y={MH - 70} w={110} label="Cancel" fs={17} />
        <Btn x={MW - 28 - 130} y={MH - 70} w={130} label={editMode ? "Update" : "Save"} primary fs={17} press={(f >= T.clickSave && f < T.clickSave + 6) || (f >= T.clickUpdate && f < T.clickUpdate + 6) ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── view modal ─────────
const ViewModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickView + 2 || f > T.viewOff + 10) return null;
  const o = pr(f, T.clickView + 2, 12) * (1 - lin(f, T.viewOff - 4, T.viewOff + 6));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: 80, top: 20, width: 1200, height: 800, borderRadius: 22, background: "#fff", opacity: o, boxShadow: "0 40px 120px #000A", fontFamily: FONT, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>{TITLE}</div>
        <div style={{ position: "absolute", left: 28, top: 76, width: 330, padding: 20, borderRadius: 16, background: "#F9FAFB", border: `2px solid ${LINE}`, boxSizing: "border-box" }}>
          <div style={{ height: 150, borderRadius: 12, background: "linear-gradient(135deg,#0EA5E9,#1E3A8A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>market-report-oct.pdf</div>
          <div style={{ marginTop: 14, fontSize: 16, fontWeight: 900, color: INK }}>Attachments</div>
          {[["Status", <Badge t="Active" c="#fff" bg="#16A34A" fs={13} />], ["Programs", "New Agents — Fall 2026"], ["Sessions", "Evening"], ["Groups", "—"], ["Users", "—"]].map(([l, v], i) => (
            <div key={i} style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: GRAY, opacity: pr(f, T.clickView + 14 + i * 5, 8) }}><span>{l as string}</span><span style={{ color: INK }}>{v as React.ReactNode}</span></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 386, top: 76, right: 28, padding: 26, borderRadius: 16, border: `2px solid ${LINE}`, fontSize: 21, fontWeight: 600, color: INK, lineHeight: 1.8 }}>
          {LETTER.map((l, i) => <div key={i}><Blanks s={l} hl /></div>)}
        </div>
      </div>
    </>
  );
};

// ───────── learner ─────────
const Learner: React.FC<{ f: number }> = ({ f }) => {
  const q = typed(f, T.lSearch + 4, "listing", 0.5);
  const det = f >= T.clickOpen + 2 ? pr(f, T.clickOpen + 2, 14) : 0;
  const cards: [string, string][] = [[TITLE, "Letters"], ["Buyer consultation checklist", "Checklists"], ["Open house sign-in sheet", "Forms"], ["Offer summary for sellers", "Letters"]];
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <PageHead title="My Templates" sub="Browse and manage your saved templates for quick and easy use." />
      <div style={{ position: "absolute", left: 900, top: 24, width: 300, height: 48, borderRadius: 12, border: `2px solid ${q ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: q ? INK : "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>{q || "Search Templates..."}</div>
      <div style={{ position: "absolute", left: 1214, top: 24, display: "flex", gap: 8 }}>{["Type", "Created Date"].map((t) => <span key={t} style={{ padding: "12px 12px", borderRadius: 10, border: `2px solid ${LINE}`, background: "#fff", fontSize: 14, fontWeight: 800, color: "#374151" }}>{t} ⌄</span>)}</div>
      {cards.map(([t, c], i) => {
        const hide = q.length >= 4 && !t.toLowerCase().includes("listing");
        return (
          <div key={t} style={{ position: "absolute", left: 32 + (i % 2) * 650, top: 110 + Math.floor(i / 2) * 230, width: 620, height: 205, borderRadius: 18, background: "#fff", border: `2px solid ${i === 0 && f >= T.clickOpen - 12 ? BLUE : LINE}`, padding: 24, boxSizing: "border-box", opacity: (hide ? 0.15 : 1) * pr(f, T.learner + 6 + i * 4, 10) }}>
            <div style={{ fontSize: 36 }}>🧩</div><div style={{ marginTop: 6, fontSize: 22, fontWeight: 900, color: INK }}>{t}</div>
            <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: GRAY }}>Dana Brooks · Oct 2026</div>
            <div style={{ position: "absolute", right: 24, top: 24 }}><Badge t={c} c={BLUE} bg="#EEF2FF" fs={13} /></div>
          </div>
        );
      })}
      {det > 0 && (
        <div style={{ position: "absolute", left: 16, top: 16, right: 16, bottom: 16, borderRadius: 18, background: "#fff", boxShadow: "0 30px 90px #0006", opacity: det, padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>Template Document Details</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: GRAY }}>Easily view your template documents</div>
          <div style={{ position: "absolute", left: 30, top: 110, width: 250, padding: 18, borderRadius: 14, border: `2px solid ${LINE}` }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>Table of Contents</div>
            {["Greeting", "The property", "Recent sales", "Your offer", "Sign-off"].map((t) => <div key={t} style={{ marginTop: 8, fontSize: 15, fontWeight: 600, color: GRAY }}>• {t}</div>)}
          </div>
          <div style={{ position: "absolute", left: 300, top: 110, width: 700 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: INK }}>{TITLE}</div>
            <div style={{ marginTop: 6 }}><Badge t="Category: Letters" c={BLUE} bg="#EEF2FF" fs={13} /></div>
            <div style={{ marginTop: 18, padding: 24, borderRadius: 14, background: "#F9FAFB", border: `2px solid ${LINE}`, fontSize: 21, fontWeight: 600, color: INK, lineHeight: 1.8 }}>
              {LETTER.map((l, i) => {
                const fill = f >= T.fill + i * 6;
                const done = l.replace("[Owner Name]", "Mr. Alvarez").replace("[Property Address]", "18 Cedar Lane").replace("[Price Range]", "$480k–$520k").replace("[Agent Name]", "Kevin Shaw");
                return <div key={i}>{fill ? <span style={{ background: "#DCFCE7", borderRadius: 4 }}>{done}</span> : <Blanks s={l} hl />}</div>;
              })}
            </div>
          </div>
          <div style={{ position: "absolute", right: 30, top: 110, width: 270, padding: 18, borderRadius: 14, border: `2px solid ${LINE}` }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>Tags</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}><Badge t="listing" c={BLUE} bg="#EEF2FF" fs={13} /><Badge t="outreach" c={BLUE} bg="#EEF2FF" fs={13} /></div>
            <div style={{ marginTop: 16, fontSize: 17, fontWeight: 900, color: INK }}>Associated Programs</div>
            <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: GRAY }}>New Agents — Fall 2026</div>
            <div style={{ marginTop: 16, fontSize: 17, fontWeight: 900, color: INK }}>Related Templates</div>
            <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: GRAY }}>Offer summary for sellers</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ───────── calm camera: one gentle move per beat ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.clickMenu - 10, 860, 520, 1.06],
  [T.tour + 10, 980, 460, 1.1],
  [S.d2, 960, 540, 1.0],
  [T.typeTitle, 900, 380, 1.1],
  [S.d4, 760, 520, 1.12],
  [S.d5, 760, 700, 1.1],
  [S.d6, 1150, 520, 1.12],
  [S.d7, 1150, 620, 1.1],
  [T.clickSave + 20, 960, 500, 1.04],
  [S.d8, 1000, 380, 1.1],
  [S.d9, 960, 540, 1.0],
  [S.d10, 960, 540, 1.04],
  [T.clickExport - 10, 1300, 300, 1.1],
  [T.learner, 960, 540, 1.0],
  [S.d12, 960, 540, 1.04],
  [T.fill, 900, 520, 1.1],
  [PAY_START, 960, 540, 1.0],
]).map(calmK);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Template", "Content Management")],
  [T.tour, ...MA(560, 300)],
  [T.tour + 60, ...MA(900, 300)],
  [T.clickCreate, ...MA(1215, 48)],
  [T.typeTitle, ...MP(340, 122)],
  [T.clickCat, ...MP(890, 122)],
  [T.desc, ...MP(340, 330)],
  [T.upload, ...MP(340, 568)],
  [T.clickAssign, ...MP(890, 214)],
  [T.pickProgram, ...MP(890, 242 + 6 + 44 + 22)],
  [T.pickSession, ...MP(890, 398)],
  [T.status, ...MP(890, 490)],
  [T.clickSave, ...MP(MW - 28 - 65, MH - 46)],
  [T.search, ...MA(800, 48)],
  [T.clickFilter, ...MA(1008, 48)],
  [T.clickView, ...MA(TBX + 1290 - 20, rowY(0))],
  [T.clickEdit, ...MA(TBX + 1290 - 20, rowY(0))],
  [T.clickUpdate, ...MP(MW - 28 - 65, MH - 46)],
  [T.clickExport, ...MA(1064, 48)],
  [T.learner + 20, 1300, 820],
  [T.lSearch, ...CT(1050, 48)],
  [T.clickOpen, ...CT(340, 210)],
  [T.fill + 40, 1300, 900],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "The Templates list" },
  { at: S.d2, to: S.d4, label: "Title and category" },
  { at: S.d4, to: S.d6, label: "Letter with blanks + attachment" },
  { at: S.d6, to: S.d8, label: "Choose who gets it" },
  { at: S.d8, to: S.d9, label: "Search and filter" },
  { at: S.d9, to: S.d10, label: "Preview" },
  { at: S.d10, to: T.learner, label: "Edit, update, export" },
  { at: T.learner, to: PAY_START, label: "What the learner sees" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = f >= T.learner;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={T.learner} url="learner.keystone.example.com/my-templates" sidebar={false} main={<Learner f={f} />} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url="academy.skillbnk.com/templates" active={f >= T.clickMenu ? "Templates" : "Dashboard"} openGroup="Content Management" main={<ListPage f={f} />}
            overlay={<><Modal f={f} /><ViewModal f={f} /><Toast f={f} at={T.clickSave + 3} text="Template created successfully" d={70} /><Toast f={f} at={T.clickUpdate + 3} text="Template updated successfully" d={60} /></>} />
        )}
        <Scribble f={f} at={T.blanks + 4} d={18} out={T.upload - 6} kind="ring" x={MP(348, 0)[0]} y={MP(0, 335)[1]} w={660} h={300} seed={4} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { week: cue("h0", "week"), scratch: cue("h0", "scratch"), twelve: cue("h0", "twelve"), corrects: cue("h0", "corrects") };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.twelve - 6, HK.corrects + 20);
  const n = countUp(f, HK.twelve - 6, 12, 24);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <HookTag f={f} text="Keystone Realty · new agents, week 2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const s = sp(f, HK.scratch - 20 + i * 6, 30, { damping: 16 });
        const red = f >= HK.corrects - 10;
        return (
          <div key={i} style={{ position: "absolute", left: 180 + (i % 6) * 270, top: 200 + Math.floor(i / 6) * 330, width: 240, height: 300, borderRadius: 16, background: "#fff", boxShadow: "0 20px 50px #000A", opacity: Math.min(1, s * 2), transform: `rotate(${((i * 37) % 9) - 4}deg)`, padding: 18, boxSizing: "border-box" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: INK }}>listing letter ({i + 1}).docx</div>
            {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ marginTop: 12, height: 9, width: `${60 + ((i * 7 + k * 13) % 40)}%`, borderRadius: 5, background: red && (i + k) % 4 === 0 ? "#F87171" : "#E5E7EB" }} />)}
            {red && i % 3 === 0 && <div style={{ position: "absolute", right: 14, bottom: 14, fontSize: 26, fontWeight: 900, color: "#DC2626" }}>✎ fix</div>}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 900, width: 1920, textAlign: "center", fontSize: 50, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.twelve - 4, 14) }}>{n} agents, {n} versions</div>
    </AbsoluteFill>
  );
};

const PY = { one: cue("p13", "letter"), zero: cue("p13", "zero"), coaching: cue("p13", "coaching") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 700, top: 140, width: 520, height: 420, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, PY.one - 6, 14) }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>{TITLE}</div>
      <div style={{ marginTop: 16, fontSize: 19, fontWeight: 600, color: INK, lineHeight: 1.7 }}>{LETTER.slice(0, 4).map((l, i) => <div key={i}><Blanks s={l} hl /></div>)}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, display: "flex", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ opacity: pr(f, PY.zero + i * 2, 10) }}><Avatar t={"ABCDEFGHJKLM"[i] + "S"} s={72} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.coaching - 6, 14) }}>Monday: coaching, not correcting</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.twelve, "riser", 0.25); add(HK.corrects, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 14; i++) add(T.typeTitle + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.blanks, "ding", 0.35); add(T.upload + 10, "pop", 0.35); add(T.pickProgram + 4, "pop", 0.3);
  add(T.clickSave + 4, "chime", 0.5); add(T.clickUpdate + 4, "chime", 0.45); add(T.learner, "whoosh", 0.35);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.coaching, "chime", 0.5);
  return a;
})();

export const TemplatesStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="templatestory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner]} />;
};
