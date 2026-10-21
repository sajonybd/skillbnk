import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Person, Stage, BeatCaption, Stamp, Bubble } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, HookTag, Table, PageHead, Fx } from "./storyShell";

/**
 * GroupsStoryVideo — DEEP (sheet serial 41). Story: Sofia Marquez, IronWorks Welding Institute (fictional).
 * Verified in code: SB-Branch pageList/Group/Groups.tsx — title "Groups", "This page displays a list of all groups.", search
 * "Enter Title...", Create New Group, filter (Title / Category Global · Technical Test · Mock Interview / Bootcamp / Session / Status),
 * export ("Groups information exported successfully in csv format"), columns SN / Title / Description / Category / Bootcamp / Session /
 * Members / Status / Expiry Date / Creation Date / Action (Edit, Delete). GroupFormModal: "Add New Group" / "Update group", Title
 * ("Enter title"), Description, Category, Programs, Sessions, Users ("Search for users to assign"), Status Active/Inactive, Expiry Date
 * ("Select Date"), Create / Update. Groups used by assignments (Groups field), course lessons (all-programs/GroupModal: Groups "Please
 * select groups", Sessions, "Groups updated successfully"), documents, media. Learner: Technical Test → Assignments → Test Now.
 * Voice: python3 generate-voice-story.py src/GroupsStoryVideo.tsx public/groupsstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 338,
  d1: 269,
  d2: 220,
  d3: 201,
  d4: 210,
  d5: 237,
  d6: 162,
  d7: 232,
  d8: 167,
  d9: 230,
  d10: 145,
  d11: 264,
  p12: 150,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [10, 17, 35, 64, 65, 69, 74, 79, 84, 96, 108, 114, 118, 141, 143, 148, 153, 156, 161, 169, 182, 197, 202, 209, 214, 222, 231, 240, 248, 253, 259, 268, 275, 282, 295, 302],
  d1: [2, 19, 39, 48, 54, 60, 67, 90, 95, 102, 109, 117, 142, 164, 181, 183, 189, 195, 202, 214, 225, 228, 234],
  d2: [2, 16, 28, 45, 52, 75, 87, 99, 102, 108, 112, 138, 142, 150, 158, 168, 175, 184, 184],
  d3: [2, 10, 21, 33, 53, 67, 70, 75, 82, 101, 120, 126, 150, 159, 166, 170, 175, 179, 184],
  d4: [2, 16, 24, 29, 34, 41, 54, 68, 74, 79, 107, 113, 120, 127, 132, 139, 149, 165, 173, 182],
  d5: [2, 37, 67, 67, 73, 85, 93, 100, 106, 133, 135, 139, 144, 155, 169, 181, 187, 198],
  d6: [2, 10, 18, 27, 31, 36, 55, 58, 67, 94, 98, 102, 107, 113, 119],
  d7: [2, 12, 39, 43, 51, 57, 66, 91, 93, 101, 123, 130, 138, 147, 155, 178, 180, 189, 197, 203, 208],
  d8: [2, 9, 14, 36, 40, 49, 56, 70, 79, 90, 106, 114, 119, 123, 127, 135],
  d9: [2, 22, 27, 34, 73, 73, 82, 85, 88, 122, 124, 136, 159, 163, 174, 186, 194, 199, 209],
  d10: [2, 13, 26, 32, 40, 64, 70, 78, 94, 100, 105, 112],
  d11: [2, 12, 19, 21, 30, 41, 57, 73, 86, 94, 102, 135, 135, 142, 146, 153, 160, 184, 191, 199, 207, 213, 220, 225],
  p12: [2, 15, 24, 30, 46, 51, 55, 78, 81, 86, 97, 109, 115, 123],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Sofia teaches welding. Six of her twenty four students failed the bend test. She wants to send them extra practice, without the whole class getting it, and without picking the same six names every single time.",
  d1: "In skillbank, that's what Groups are for. Every group shows its category, program, session, how many members it has, and when it expires.",
  d2: "She clicks Create New Group. A title, and a short description, so other trainers know why the group exists.",
  d3: "The category tells skillbank where the group is used: global, technical test, or mock interview. She picks technical test.",
  d4: "She narrows it to her program and the evening session, then searches for the six students and ticks each one.",
  d5: "Status active, and an expiry date two weeks out, so the group closes itself after the retest. Create.",
  d6: "The group is in the list, with six members. Now she can use it anywhere.",
  d7: "In Assignments, she creates the practice test, and under Groups, picks bend test catch up. Only those six will see it.",
  d8: "In her course, she opens the retest prep lesson, and limits it to the same group.",
  d9: "Now, the learner side. Diego is in the group. Under Technical Test, the practice assignment is waiting for him.",
  d10: "Lena passed the first time. Her list doesn't show it at all.",
  d11: "Back in the training provider portal, Sofia filters groups by category, edits the members when someone passes, and exports the list as a CSV.",
  p12: "Six students got exactly what they needed. The other eighteen never saw a thing.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "groups", -6),
  tour: cue("d1", "category", -4),
  clickCreate: cue("d2", "create", -4),
  typeTitle: cue("d2", "title", -4),
  typeDesc: cue("d2", "description", -2),
  clickCat: cue("d3", "category", -4),
  pickCat: cue("d3", "picks", -2),
  pickProg: cue("d4", "program", -4),
  pickSess: cue("d4", "session", -4),
  search: cue("d4", "searches", -4),
  ticks: cue("d4", "ticks", -6),
  status: cue("d5", "status", -4),
  expiry: cue("d5", "expiry", -4),
  clickSave: cue("d5", "create", -2),
  rowHl: S.d6,
  asg: S.d7,
  asgGroups: cue("d7", "groups", -4),
  asgPick: cue("d7", "picks", 4),
  asgSave: cue("d7", "only", 6),
  course: S.d8,
  clickLessonGroups: cue("d8", "opens", -2),
  lPick: cue("d8", "limits", 0),
  lSave: cue("d8", "group", 0),
  learner: cue("d9", "learner", -8),
  lena: S.d10,
  back: S.d11,
  clickFilter: cue("d11", "filters", -4),
  filterOff: cue("d11", "edits", -10),
  clickEdit: cue("d11", "edits", -4),
  editOff: cue("d11", "exports", -12),
  clickExport: cue("d11", "exports", -4),
};
const CLICKS = [T.clickMenu, T.clickCreate, T.typeTitle, T.typeDesc, T.clickCat, T.pickCat, T.pickProg, T.pickSess, T.search, T.ticks, T.ticks + 12, T.ticks + 24, T.status, T.expiry, T.clickSave, T.asgGroups, T.asgPick, T.asgSave, T.clickLessonGroups, T.lPick, T.lSave, T.clickFilter, T.clickEdit, T.clickExport];

const GNAME = "Bend test catch-up";
const PROG = "Structural Welding — Fall 2026";
type G = { t: string; d: string; c: string; b: string; s: string; m: number; st: boolean; e: string };
const BASE: G[] = [
  { t: "Evening safety leads", d: "Shop safety walk-throughs", c: "Global", b: PROG, s: "Evening", m: 4, st: true, e: "Dec 20, 2026" },
  { t: "Mock interview — union prep", d: "Practice for union interviews", c: "Mock Interview", b: PROG, s: "Morning", m: 9, st: true, e: "Nov 30, 2026" },
  { t: "TIG advanced track", d: "Extra TIG assignments", c: "Technical Test", b: "Pipe Welding — Fall 2026", s: "Weekend", m: 7, st: true, e: "Jan 15, 2027" },
  { t: "Summer cohort archive", d: "Past cohort", c: "Global", b: "Structural Welding — Summer", s: "Evening", m: 22, st: false, e: "Sep 01, 2026" },
];
const COLS = [{ h: "SN", w: 50 }, { h: "Title", w: 250 }, { h: "Category", w: 160 }, { h: "Bootcamp", w: 270 }, { h: "Session", w: 110 }, { h: "Members", w: 100 }, { h: "Status", w: 110 }, { h: "Expiry Date", w: 140 }, { h: "Action", w: 100 }];
const TBX = 18, TBY = 120, RH = 64;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const catBadge = (c: string) => <Badge t={c} c={c === "Technical Test" ? "#B45309" : c === "Mock Interview" ? "#7C3AED" : BLUE} bg={c === "Technical Test" ? "#FEF3C7" : c === "Mock Interview" ? "#EDE9FE" : "#EEF2FF"} fs={13} />;

const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const created = f >= T.clickSave + 4;
  const members = f >= T.editOff ? 5 : 6;
  const all: G[] = created ? [{ t: GNAME, d: "Six students retaking the bend test", c: "Technical Test", b: PROG, s: "Evening", m: members, st: true, e: "Nov 03, 2026" }, ...BASE] : BASE;
  const filt = f >= T.clickFilter + 30 && f < T.clickEdit;
  const fo = f >= T.clickFilter + 2 && f < T.filterOff ? pr(f, T.clickFilter + 2, 8) * (1 - lin(f, T.filterOff - 8, T.filterOff)) : 0;
  const hlRow = created && f >= T.rowHl && f < T.rowHl + 120;
  return (
    <>
      <PageHead title="Groups" sub="This page displays a list of all groups." />
      <div style={{ position: "absolute", left: 600, top: 24, width: 320, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Enter Title...</div>
      <div style={{ position: "absolute", left: 932, top: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${fo > 0 || filt ? BLUE : LINE}`, background: fo > 0 || filt ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚲</div>
      <div style={{ position: "absolute", left: 988, top: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${f >= T.clickExport - 4 && f < T.clickExport + 30 ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⇪</div>
      <Btn x={1048} y={24} w={250} label="＋  Create New Group" primary fs={16} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={hlRow ? 0 : -1} hlA={hlRow ? 1 - lin(f, T.rowHl + 90, T.rowHl + 120) : 0}
        oRow={(i) => (created && i === 0 ? pr(f, T.clickSave + 4, 12) : filt && all[i].c !== "Technical Test" ? 0.15 : 1)}
        rows={all.map((g, i) => [
          <span style={{ color: GRAY }}>{i + 1}</span>, <div><b style={{ fontWeight: 800 }}>{g.t}</b><div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>{g.d}</div></div>, catBadge(g.c),
          <span style={{ fontSize: 14 }}>{g.b}</span>, <span style={{ fontSize: 14 }}>{g.s}</span>,
          <b style={{ fontSize: 17, color: i === 0 && created ? BLUE : INK }}>{g.m}</b>,
          g.st ? <Badge t="Active" c="#15803D" bg="#DCFCE7" fs={13} dot /> : <Badge t="Inactive" c="#B91C1C" bg="#FEE2E2" fs={13} dot />,
          <span style={{ fontSize: 14, color: GRAY }}>{g.e}</span>,
          <div style={{ display: "flex", gap: 8 }}><span style={{ width: 34, height: 32, borderRadius: 8, background: "#EEF2FF", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: i === 0 && f >= T.clickEdit - 8 && f < T.clickEdit + 6 ? "0 0 0 4px #C7D2FE" : "none" }}>✎</span><span style={{ width: 34, height: 32, borderRadius: 8, background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🗑</span></div>,
        ])} />
      {fo > 0 && (
        <div style={{ position: "absolute", left: 640, top: 80, width: 420, padding: 18, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0004", opacity: fo, zIndex: 3 }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>Filter</div>
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 800, color: "#374151" }}>Category</div>
          {["Global", "Technical Test", "Mock Interview"].map((c, i) => {
            const on = c === "Technical Test" && f >= T.clickFilter + 20;
            return <div key={c} style={{ marginTop: 8, height: 40, borderRadius: 10, border: `2px solid ${on ? BLUE : LINE}`, background: on ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontSize: 16, fontWeight: 700, color: INK, opacity: pr(f, T.clickFilter + 6 + i * 4, 8) }}><span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${on ? BLUE : "#9CA3AF"}`, background: on ? BLUE : "#fff", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</span>{c}</div>;
          })}
        </div>
      )}
    </>
  );
};

// ───────── group modal (content coords) ─────────
const GX = 160, GY = 40, GW = 1280, GH = 730;
const GP = (x: number, y: number) => CT(GX + x, GY + y);
const lab = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 15, fontWeight: 800, color: "#374151" }}>{t}</div>;
const box = (x: number, y: number, w: number, on: boolean, v: React.ReactNode, ph: string, sel?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 46, borderRadius: 11, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 16, fontWeight: 600, color: v ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>;
const STUDENTS: [string, boolean][] = [["Diego Ramos", true], ["Ava Chen", true], ["Marcus Bell", true], ["Lena Fischer", false], ["Omar Haddad", true], ["Priya Nair", true], ["Tom Becker", false], ["Kofi Mensah", true]];
const UY = (i: number) => 200 + i * 54;
const GroupModal: React.FC<{ f: number }> = ({ f }) => {
  const edit = f >= T.clickEdit;
  const a = edit ? T.clickEdit + 4 : T.clickCreate + 4, b = edit ? T.editOff : T.clickSave + 4;
  if (f < a - 1 || f > b + 12) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b - 2, b + 10));
  const catOpen = !edit && f >= T.clickCat + 2 && f < T.pickCat + 6;
  const ok = (t: number) => edit || f >= t;
  let tickN = 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: GX, top: GY + (1 - inn) * 30, width: GW, height: GH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>{edit ? "Update group" : "Add New Group"}</div>
        {lab(28, 76, "Title *")}{box(28, 100, 600, !edit && f >= T.typeTitle && f < T.typeDesc, edit ? GNAME : typed(f, T.typeTitle + 2, GNAME, 1), "Enter title")}
        {lab(28, 164, "Description")}
        <div style={{ position: "absolute", left: 28, top: 188, width: 600, height: 96, borderRadius: 11, border: `2px solid ${!edit && f >= T.typeDesc && f < T.clickCat ? BLUE : "#D1D5DB"}`, padding: 14, boxSizing: "border-box", fontSize: 16, fontWeight: 600, color: INK }}>{edit ? "Six students retaking the bend test" : typed(f, T.typeDesc + 2, "Six students retaking the bend test", 1.1)}</div>
        {lab(28, 302, "Category")}{box(28, 326, 600, catOpen, ok(T.pickCat + 2) ? catBadge("Technical Test") : "", "Select category", true)}
        {catOpen && <div style={{ position: "absolute", left: 28, top: 376, width: 600, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, zIndex: 4 }}>{["Global", "Technical Test", "Mock Interview"].map((c) => <div key={c} style={{ height: 42, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, fontWeight: 800, color: c === "Technical Test" && f >= T.pickCat - 8 ? BLUE : INK, background: c === "Technical Test" && f >= T.pickCat - 8 ? "#EEF2FF" : "transparent" }}>{c}</div>)}</div>}
        {lab(28, 390, "Programs")}{box(28, 414, 600, !edit && f >= T.pickProg && f < T.pickSess, ok(T.pickProg + 6) ? PROG : "", "Select programs", true)}
        {lab(28, 478, "Sessions")}{box(28, 502, 600, !edit && f >= T.pickSess && f < T.search, ok(T.pickSess + 6) ? "Evening" : "", "Select sessions", true)}
        {lab(28, 566, "Status")}{box(28, 590, 290, !edit && f >= T.status && f < T.expiry, ok(T.status + 6) ? <span style={{ color: "#15803D" }}>● Active</span> : "", "Select Status", true)}
        {lab(338, 566, "Expiry Date")}{box(338, 590, 290, !edit && f >= T.expiry && f < T.clickSave, ok(T.expiry + 6) ? "Nov 03, 2026" : "", "Select Date")}
        {lab(660, 76, "Users")}
        <div style={{ position: "absolute", left: 660, top: 100, width: 592, height: 586, borderRadius: 14, border: `2px solid ${LINE}`, background: "#F9FAFB" }}>
          <div style={{ position: "absolute", left: 14, top: 14, width: 564, height: 46, borderRadius: 11, border: `2px solid ${!edit && f >= T.search && f < T.ticks ? BLUE : "#D1D5DB"}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", fontSize: 16, fontWeight: 600, color: "#9CA3AF" }}>⌕ Search for users to assign</div>
          <div style={{ position: "absolute", left: 14, top: 72, fontSize: 14, fontWeight: 800, color: GRAY }}>{ok(T.pickSess + 6) ? `${PROG} · Evening · 24 students` : "All users"}</div>
          {STUDENTS.map(([n, pick], i) => {
            const k = pick ? tickN++ : -1;
            const on = edit ? pick && !(n === "Priya Nair" && f >= T.clickEdit + 30) : pick && f >= T.ticks + k * 12;
            return (
              <div key={n} style={{ position: "absolute", left: 14, top: UY(i) - 100, width: 564, height: 46, borderRadius: 10, background: on ? "#EEF2FF" : "#fff", border: `1px solid ${on ? "#C7D2FE" : LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", boxSizing: "border-box", opacity: ok(T.pickSess + 4) ? pr(f, edit ? a : T.pickSess + 4 + i * 3, 8) : 0 }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${on ? BLUE : "#9CA3AF"}`, background: on ? BLUE : "#fff", color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</span>
                <Avatar t={n.split(" ").map((w) => w[0]).join("")} s={30} c1="#16A34A" c2="#15803D" />
                <span style={{ flex: 1, fontSize: 16, fontWeight: 800, color: INK }}>{n}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: GRAY }}>Evening</span>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 14, bottom: 14, fontSize: 15, fontWeight: 900, color: BLUE }}>{edit ? (f >= T.clickEdit + 30 ? 5 : 6) : Math.min(6, Math.max(0, Math.floor((f - T.ticks) / 12) + 1))} selected</div>
        </div>
        <Btn x={GW - 28 - 130 - 12 - 110} y={GH - 70} w={110} label="Cancel" fs={17} />
        <Btn x={GW - 28 - 130} y={GH - 70} w={130} label={edit ? "Update" : "Create"} primary fs={17} press={(f >= T.clickSave && f < T.clickSave + 6) || (f >= T.editOff - 10 && f < T.editOff - 4) ? 1 : 0} />
      </div>
    </>
  );
};
const tickPt = (k: number): [number, number] => { const idx = STUDENTS.map((s, i) => [s[1], i] as [boolean, number]).filter((x) => x[0])[k][1]; return GP(660 + 14 + 22, 100 + UY(idx) - 100 + 23); };

// ───────── assignment page + modal ─────────
const AsgPage: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.asg, 10) }}>
    <PageHead title="All Assignments" sub="Create and manage assignments for your programs" />
    <Btn x={1040} y={24} w={260} label="＋  Create New Assignment" primary fs={16} />
    {["Bend test theory quiz", "Fillet weld visual check", "Shop safety refresher"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 30, top: 120 + i * 80, width: 1270, height: 66, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16, fontSize: 17, fontWeight: 800, color: INK }}>📝 {t}<span style={{ marginLeft: "auto", fontSize: 14, color: GRAY }}>Programs · {PROG}</span></div>
    ))}
  </div>
);
const AX = 300, AY = 120, AW = 1000, AH = 440;
const AP = (x: number, y: number) => CT(AX + x, AY + y);
const AsgModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.asg + 10 || f > T.asgSave + 14) return null;
  const o = pr(f, T.asg + 10, 12) * (1 - lin(f, T.asgSave + 2, T.asgSave + 12));
  const open = f >= T.asgGroups + 2 && f < T.asgPick + 6;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: AX, top: AY, width: AW, height: AH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>Create New Assignment</div>
        {lab(28, 80, "Assignment Title")}{box(28, 104, 600, false, "Bend test retake — practice set", "")}
        {lab(660, 80, "Total marks")}{box(660, 104, 140, false, "50", "")}{lab(820, 80, "Pass Mark")}{box(820, 104, 150, false, "35", "")}
        {lab(28, 176, "Groups")}{box(28, 200, 600, open, f >= T.asgPick + 2 ? <span style={{ display: "flex", gap: 8, alignItems: "center" }}>{catBadge("Technical Test")}{GNAME}</span> : "", "Select groups", true)}
        {open && <div style={{ position: "absolute", left: 28, top: 250, width: 600, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, zIndex: 4 }}>{[GNAME, "TIG advanced track", "Evening safety leads"].map((c, i) => <div key={c} style={{ height: 42, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, fontWeight: 800, color: i === 0 && f >= T.asgPick - 8 ? BLUE : INK, background: i === 0 && f >= T.asgPick - 8 ? "#EEF2FF" : "transparent" }}>{c}<span style={{ marginLeft: "auto", fontSize: 13, color: GRAY }}>{[6, 7, 4][i]} members</span></div>)}</div>}
        {lab(660, 176, "Grading mode")}{box(660, 200, 310, false, "Auto evaluation", "", true)}
        <div style={{ position: "absolute", left: 28, top: 290, width: AW - 56, padding: 16, borderRadius: 12, background: "#FFFBEB", border: "2px solid #FDE68A", fontSize: 16, fontWeight: 700, color: "#92400E", opacity: pr(f, T.asgPick + 6, 10) }}>👥 Visible only to the 6 members of “{GNAME}”</div>
        <Btn x={AW - 28 - 130} y={AH - 70} w={130} label="Save" primary fs={17} press={f >= T.asgSave && f < T.asgSave + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── course lesson groups ─────────
const LESSONS = ["Bend test: what inspectors look for", "Root pass technique", "Retest prep: 3G plate", "Final review"];
const CoursePage: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.course, 10) }}>
    <PageHead title="Structural Welding — Fall 2026" sub="Course · Module 4: Bend testing" />
    {LESSONS.map((l, i) => (
      <div key={l} style={{ position: "absolute", left: 30, top: 120 + i * 92, width: 1270, height: 78, borderRadius: 14, background: "#fff", border: `2px solid ${i === 2 && f >= T.clickLessonGroups - 20 ? BLUE : LINE}`, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
        <div style={{ width: 80, height: 50, borderRadius: 8, background: "linear-gradient(135deg,#78350F,#F59E0B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 19, fontWeight: 800, color: INK }}>Lesson {i + 1}: {l}</div><div style={{ fontSize: 14, fontWeight: 600, color: GRAY }}>{i === 2 && f >= T.lSave + 4 ? <span style={{ color: "#B45309", fontWeight: 800 }}>👥 {GNAME} only</span> : "Everyone in the program"}</div></div>
        {["✎", "👥", "⋮"].map((c, k) => <div key={c} style={{ width: 42, height: 38, borderRadius: 9, border: `2px solid ${i === 2 && k === 1 && f >= T.clickLessonGroups - 10 ? BLUE : LINE}`, background: i === 2 && k === 1 && f >= T.clickLessonGroups - 10 ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{c}</div>)}
      </div>
    ))}
  </div>
);
const LGX = 480, LGY = 180, LGW = 640, LGH = 420;
const LessonGroups: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickLessonGroups + 2 || f > T.lSave + 12) return null;
  const o = pr(f, T.clickLessonGroups + 2, 10) * (1 - lin(f, T.lSave + 2, T.lSave + 12));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.45 * o})` }} />
      <div style={{ position: "absolute", left: LGX, top: LGY, width: LGW, height: LGH, borderRadius: 18, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 26, top: 22, fontSize: 22, fontWeight: 900, color: INK }}>Lesson 3: Retest prep: 3G plate</div>
        {lab(26, 80, "Groups")}{box(26, 104, LGW - 52, f >= T.lPick - 6 && f < T.lSave, f >= T.lPick + 2 ? GNAME : "", "Please select groups", true)}
        {lab(26, 176, "Sessions")}{box(26, 200, LGW - 52, false, "Evening", "Please select sessions", true)}
        <Btn x={LGW - 26 - 120 - 12 - 110} y={LGH - 70} w={110} label="Cancel" fs={17} />
        <Btn x={LGW - 26 - 120} y={LGH - 70} w={120} label="Save" primary fs={17} press={f >= T.lSave && f < T.lSave + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── learner ─────────
const Learner: React.FC<{ f: number; diego: boolean }> = ({ f, diego }) => {
  const cards: [string, string, boolean][] = [["Bend test retake — practice set", "50 marks · due Oct 30", true], ["Bend test theory quiz", "20 marks · due Oct 24", false], ["Fillet weld visual check", "30 marks · submitted", false]];
  const list = diego ? cards : cards.slice(1);
  const at = diego ? T.learner : T.lena;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <PageHead title="Technical Test" sub="Assess Technical Skills with Accuracy and Speed" />
      <div style={{ position: "absolute", left: 32, top: 110, display: "flex", gap: 8 }}>{["Technical Task", "Assignments"].map((t, i) => <span key={t} style={{ padding: "9px 16px", borderRadius: 10, background: i ? BLUE : "#fff", color: i ? "#fff" : INK, border: i ? "none" : `2px solid ${LINE}`, fontSize: 15, fontWeight: 800 }}>{t}</span>)}</div>
      {list.map(([t, d, nw], i) => (
        <div key={t} style={{ position: "absolute", left: 32, top: 170 + i * 150, width: 1270, height: 132, borderRadius: 16, background: "#fff", border: `2px solid ${nw ? "#F59E0B" : LINE}`, boxShadow: nw ? "0 0 0 4px #FDE68A" : "none", padding: 22, boxSizing: "border-box", opacity: pr(f, at + 8 + i * 6, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>📝 {t} {nw && <Badge t="New · Group: Bend test catch-up" c="#92400E" bg="#FEF3C7" fs={12} />}</div>
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: GRAY }}>{d}</div>
          <div style={{ position: "absolute", right: 22, top: 40, width: 150, height: 48, borderRadius: 12, background: nw || i === 0 ? BLUE : "#E5E7EB", color: nw || i === 0 ? "#fff" : GRAY, fontSize: 17, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.includes("submitted") ? "See Result" : "Test Now"}</div>
        </div>
      ))}
    </div>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.clickMenu - 10, 880, 540, 1.04], [T.tour + 10, 1000, 480, 1.08],
  [S.d2, 960, 540, 1.0], [T.typeTitle, 860, 440, 1.1], [S.d3, 860, 560, 1.1], [S.d4, 960, 560, 1.04], [T.search, 1200, 520, 1.1],
  [S.d5, 960, 620, 1.08], [S.d6, 960, 520, 1.04], [T.asg, 960, 540, 1.0], [T.asgGroups, 960, 470, 1.1],
  [T.course, 960, 540, 1.0], [T.clickLessonGroups + 10, 960, 520, 1.08], [T.learner, 960, 540, 1.0], [T.learner + 30, 900, 500, 1.08],
  [T.lena, 960, 540, 1.04], [T.back, 960, 540, 1.0], [T.clickEdit + 10, 1100, 520, 1.06], [T.clickExport - 10, 1100, 460, 1.1], [PAY_START, 960, 540, 1.0],
]).map(calmK);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Groups", "Courses & Programs")],
  [T.tour, ...MA(560, 300)], [T.tour + 60, ...MA(900, 300)],
  [T.clickCreate, ...MA(1173, 48)],
  [T.typeTitle, ...GP(320, 123)], [T.typeDesc, ...GP(320, 236)],
  [T.clickCat, ...GP(320, 349)], [T.pickCat, ...GP(320, 376 + 6 + 42 + 21)],
  [T.pickProg, ...GP(320, 437)], [T.pickSess, ...GP(320, 525)],
  [T.search, ...GP(956, 137)],
  [T.ticks, ...tickPt(0)], [T.ticks + 12, ...tickPt(1)], [T.ticks + 24, ...tickPt(2)], [T.ticks + 36, ...tickPt(3)], [T.ticks + 48, ...tickPt(4)], [T.ticks + 60, ...tickPt(5)],
  [T.status, ...GP(170, 613)], [T.expiry, ...GP(480, 613)], [T.clickSave, ...GP(GW - 93, GH - 46)],
  [T.rowHl + 20, ...MA(TBX + 50 + 250 + 160 + 270 + 110 + 50, rowY(0))],
  [T.asgGroups, ...AP(320, 223)], [T.asgPick, ...AP(320, 250 + 6 + 21)], [T.asgSave, ...AP(AW - 93, AH - 46)],
  [T.clickLessonGroups, ...MA(30 + 1270 - 20 - 42 - 16 - 21, 120 + 2 * 92 + 39)],
  [T.lPick, ...CT(LGX + 320, LGY + 127)], [T.lSave, ...CT(LGX + LGW - 86, LGY + LGH - 46)],
  [T.learner + 20, 1500, 860], [T.learner + 60, ...MA(1302 - 22 - 75, 170 + 64)],
  [T.lena + 20, 1500, 860],
  [T.clickFilter, ...MA(956, 48)], [T.clickFilter + 20, ...MA(780, 80 + 18 + 30 + 8 + 48 + 20)],
  [T.clickEdit, ...MA(TBX + 1190 - 100 + 17, rowY(0))],
  [T.clickEdit + 30, ...GP(674 + 22, 100 + UY(5) - 100 + 23)],
  [T.editOff - 10, ...GP(GW - 93, GH - 46)],
  [T.clickExport, ...MA(1012, 48)],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "The Groups list" },
  { at: S.d2, to: S.d3, label: "Title and description" },
  { at: S.d3, to: S.d4, label: "Pick the category" },
  { at: S.d4, to: S.d5, label: "Program, session, members" },
  { at: S.d5, to: T.asg, label: "Status and expiry" },
  { at: T.asg, to: T.course, label: "Assign to the group" },
  { at: T.course, to: T.learner, label: "Limit a lesson" },
  { at: T.learner, to: T.back, label: "What each learner sees" },
  { at: T.back, to: PAY_START, label: "Filter, edit, export" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = f >= T.learner && f < T.back;
  const scene = f >= T.back ? "list" : f >= T.course ? "course" : f >= T.asg ? "asg" : "list";
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={f >= T.lena ? T.lena : T.learner} url="learner.ironworks.example.com/assignments" learner who={f >= T.lena ? "Lena" : "Diego"} prog={PROG} active="Assignments" openGroup="My Courses" main={<Learner f={f} diego={f < T.lena} />} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} branch="IronWorks — Houston" url={scene === "asg" ? "academy.skillbnk.com/assignments" : scene === "course" ? "academy.skillbnk.com/courses/structural-welding" : "academy.skillbnk.com/groups"}
            active={scene === "asg" ? "Assignments" : scene === "course" ? "Courses" : f >= T.clickMenu ? "Groups" : "Dashboard"} openGroup="Courses & Programs"
            main={scene === "asg" ? <AsgPage f={f} /> : scene === "course" ? <CoursePage f={f} /> : <ListPage f={f} />}
            overlay={<><GroupModal f={f} /><AsgModal f={f} /><LessonGroups f={f} /><Toast f={f} at={T.lSave + 3} text="Groups updated successfully" d={50} /><Toast f={f} at={T.clickExport + 3} text="Groups information exported successfully in csv format" d={60} /></>} />
        )}
        <Scribble f={f} at={T.rowHl + 30} d={16} out={T.rowHl + 110} kind="ring" x={MA(TBX + 50 + 250 + 160 + 270 + 110 + 50, 0)[0]} y={MA(0, rowY(0))[1]} w={90} h={56} seed={2} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

// ───────── hook (story: the bend-test line) ─────────
const HK = { sofia: cue("h0", "sofia"), six: cue("h0", "six"), failed: cue("h0", "failed"), send: cue("h0", "send"), whole: cue("h0", "whole"), picking: cue("h0", "picking"), every: cue("h0", "every") };
const CRACK = [1, 4, 9, 13, 18, 22];
const PX0 = 470, PY0 = 230, PDX = 205, PDY = 150;
const plateC = (i: number): [number, number] => [PX0 + (i % 6) * PDX + 80, PY0 + Math.floor(i / 6) * PDY + 45];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.whole - 6, HK.every + 30);
  const belt = (f * 4) % 60;
  const bend = lin(f, HK.failed - 8, HK.failed + 10);
  const fan = f >= HK.whole && f < HK.picking ? lin(f, HK.whole, HK.whole + 16) : 0;
  const pickF = f - HK.picking;
  const week = f >= HK.picking ? Math.min(3, Math.floor(pickF / 30) + 1) : 0;
  const lasso = f >= HK.picking ? (pickF % 30) / 22 : 0;
  const cracked = (i: number) => CRACK.includes(i) && f >= HK.failed + 2 + CRACK.indexOf(i) * 4;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        {/* title card */}
        <div style={{ position: "absolute", left: 120, top: 90, opacity: pr(f, HK.sofia - 6, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#FBBF24" }}>IRONWORKS WELDING INSTITUTE</div>
          <div style={{ marginTop: 6, fontSize: 64, fontWeight: 900, color: "#F8FAFC", letterSpacing: -1 }}>{typed(f, HK.sofia - 4, "Sofia's bend test.", 0.8)}</div>
        </div>
        {/* conveyor rails */}
        {[0, 1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", left: PX0 - 40, top: PY0 + r * PDY + 104, width: 6 * PDX + 40, height: 10, borderRadius: 5, background: `repeating-linear-gradient(90deg,#334155 0 30px,#1E293B 30px 60px)`, backgroundPosition: `${belt}px 0`, opacity: pr(f, HK.sofia + r * 4, 10) }} />)}
        {/* 24 welded coupons */}
        {Array.from({ length: 24 }).map((_, i) => {
          const [cx, cy] = plateC(i);
          const inn = pr(f, HK.sofia + 4 + i * 1.5, 12);
          const cr = cracked(i);
          const hit = fan > 0 && f >= HK.whole + 6 + (i % 6) * 1.5;
          const picked = f >= HK.picking && CRACK.includes(i);
          return (
            <div key={i} style={{ position: "absolute", left: cx - 80 + (1 - inn) * 300, top: cy - 45, width: 160, height: 90, opacity: inn }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: `10px 10px ${40 * bend}px ${40 * bend}px`, background: cr ? "linear-gradient(180deg,#7F1D1D,#450A0A)" : "linear-gradient(180deg,#CBD5E1,#64748B)", border: `3px solid ${hit ? "#FBBF24" : picked ? "#60A5FA" : cr ? "#F87171" : "#94A3B8"}`, boxShadow: hit ? "0 0 30px #FBBF24" : "0 10px 24px #0008", transform: `perspective(400px) rotateX(${bend * 22}deg)` }} />
              <div style={{ position: "absolute", left: 20, right: 20, top: 40, height: 6, borderRadius: 3, background: cr ? "#F97316" : "#475569" }} />
              {cr && <svg width={160} height={90} style={{ position: "absolute", inset: 0 }}><polyline points="70,8 82,30 72,46 88,64 78,84" fill="none" stroke="#FCA5A5" strokeWidth={4} strokeDasharray={120} strokeDashoffset={120 * (1 - lin(f, HK.failed + 2 + CRACK.indexOf(i) * 4, HK.failed + 12 + CRACK.indexOf(i) * 4))} /></svg>}
              <div style={{ position: "absolute", left: 8, top: 6, fontSize: 13, fontWeight: 900, color: cr ? "#FECACA" : "#1E293B" }}>#{String(i + 1).padStart(2, "0")}</div>
            </div>
          );
        })}
        {/* press bar sweeping down the line */}
        {bend > 0 && bend < 1 && <div style={{ position: "absolute", left: PX0 - 40, top: PY0 - 30 + bend * 4 * PDY, width: 6 * PDX + 40, height: 16, borderRadius: 8, background: "linear-gradient(90deg,#1E293B,#60A5FA,#1E293B)", boxShadow: "0 0 40px #60A5FA" }} />}
        <div style={{ position: "absolute", left: PX0, top: PY0 + 4 * PDY + 10, fontSize: 34, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.failed + 6, 10) }}>{Math.min(6, Math.max(0, Math.floor((f - HK.failed - 2) / 4) + 1))} of 24 cracked</div>
        {/* practice sheet + broadcast fan */}
        {f >= HK.send - 4 && f < HK.picking && (
          <>
            <div style={{ position: "absolute", left: 150, top: 470 - pr(f, HK.send, 14) * 40, width: 210, height: 260, borderRadius: 10, background: "#F8FAFC", boxShadow: "0 30px 60px #000A", padding: 20, boxSizing: "border-box", opacity: pr(f, HK.send - 4, 10), transform: `rotate(${-4 + 4 * pr(f, HK.send, 14)}deg)` }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#111827" }}>Extra practice</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}>Root pass · 3G plate</div>
              {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{ marginTop: 14, height: 8, width: `${90 - k * 9}%`, borderRadius: 4, background: "#E2E8F0" }} />)}
            </div>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              {fan > 0 && Array.from({ length: 24 }).map((_, i) => { const [x, y] = plateC(i); return <line key={i} x1={360} y1={600} x2={360 + (x - 360) * fan} y2={600 + (y - 600) * fan} stroke="#FBBF24" strokeWidth={2} opacity={0.7} />; })}
            </svg>
            {fan > 0 && <Stamp f={f} at={HK.whole + 16} x={1090} y={560} text="ALL 24?" color="#F59E0B" />}
          </>
        )}
        {/* lasso the same six, again and again */}
        {f >= HK.picking && (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              {CRACK.map((i, k) => { const [x, y] = plateC(i); const on = lasso > k / 6; return <ellipse key={i} cx={x} cy={y} rx={98} ry={62} fill="none" stroke="#60A5FA" strokeWidth={5} strokeDasharray="14 10" opacity={on ? 1 : 0} />; })}
            </svg>
            <div style={{ position: "absolute", left: 150, top: 470, width: 250, padding: "18px 22px", borderRadius: 16, background: "#0F172A", border: "2px solid #60A5FA" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#93C5FD", letterSpacing: 3 }}>PICKING NAMES</div>
              <div style={{ fontSize: 60, fontWeight: 900, color: "#F8FAFC" }}>Week {week}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#CBD5E1" }}>same six, by hand</div>
            </div>
          </>
        )}
      </Stage>
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.sofia, "Sofia teaches welding."], [HK.six, "6 of 24 failed the bend test.", "6 of 24"], [HK.send, "Extra practice — only for those six.", "only"], [HK.whole, "Not the whole class.", "whole class"], [HK.picking, "Same six names. Every. Single. Time.", "Every. Single. Time."]]} />
    </AbsoluteFill>
  );
};

const PY = { six: cue("p12", "six"), eighteen: cue("p12", "eighteen") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 460, top: 200, width: 1000, height: 300, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, PY.six - 8, 12) }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>👥 {GNAME}</div>
      <div style={{ marginTop: 18, display: "flex", gap: 16 }}>{["DR", "AC", "MB", "OH", "PN", "KM"].map((t, i) => <div key={t} style={{ opacity: pr(f, PY.six + i * 3, 8) }}><Avatar t={t} s={84} c1="#F59E0B" c2="#B45309" /></div>)}</div>
      <div style={{ marginTop: 18, fontSize: 18, fontWeight: 700, color: GRAY }}>Practice set · retest lesson · closes Nov 03</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 580, width: 1920, display: "flex", justifyContent: "center", gap: 10 }}>{Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ opacity: 0.35 * pr(f, PY.eighteen - 6 + i, 8) }}><Avatar t="·" s={46} c1="#475569" c2="#334155" /></div>)}</div>
    <div style={{ position: "absolute", left: 0, top: 690, width: 1920, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.eighteen, 14) }}>The right six. Nobody else.</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.failed, "thud", 0.35); add(HK.whole, "riser", 0.25); add(HK.picking, "thud", 0.4);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 12; i++) add(T.typeTitle + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.clickSave + 4, "chime", 0.5); add(T.asgSave + 4, "pop", 0.4); add(T.lSave + 4, "ding", 0.35); add(T.clickExport + 4, "pop", 0.35);
  add(T.learner, "whoosh", 0.35); add(T.lena, "whoosh", 0.25); add(T.back, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PY.eighteen, "chime", 0.5);
  return a;
})();

export const GroupsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="groupsstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.asg, T.course, T.learner, T.back]} />;
};
