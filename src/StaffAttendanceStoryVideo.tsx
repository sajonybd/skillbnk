import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE, WX, WY, BAR, SBW } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx } from "./storyShell";

/**
 * StaffAttendanceStoryVideo — DEEP (sheet serial 45, Attendance Tracking). Story: Daniel Ortiz, Luxe Beauty Academy (fictional).
 * Verified in code: libs/shared/ui/attendance (MyAttendance, AttendanceModal, OffDayDialog, AttendanceReport, EditAttendanceDialog, Timer)
 * used by SB-Branch My Attendances / Attendance Report (+ header "View Attendance"). Strings: "My attendance", "Clock in and out, see your
 * hours, and request days off.", "Today's Attendance", "Today's Events", "Check In" / "Check Out", "What are you working on?", "Work session",
 * "Working now", "Attendance started" / "Attendance stopped", "Request a day off", "First day" / "Last day", "Reason" ("e.g. Sick leave,
 * family event"), "Who covers for you?" ("Choose a colleague"), "Did they agree?", "Have you told your clients or students?", "Manager",
 * "HR (optional)", "Save day off", "Day off saved", "Awaiting approval", "Approved by your manager"; report: "Attendance report", "Review a
 * staff member's hours, approve days and fix mistakes.", "Choose a staff member", "This month", "Days worked", "Hours worked", "Days off",
 * columns Date / Day / Status / First check-in / Last check-out / Sessions / Hours, "Approve this day", "Day approved", Edit ("Correct session
 * titles and times. Leave check-out empty for a session that is still running."), "Attendance updated", "Change history".
 * Voice: python3 generate-voice-story.py src/StaffAttendanceStoryVideo.tsx public/staffattstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 312,
  d1: 246,
  d2: 189,
  d3: 216,
  d4: 162,
  d5: 217,
  d6: 130,
  d7: 209,
  d8: 344,
  d9: 261,
  d10: 110,
  d11: 142,
  p12: 194,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 18, 27, 40, 52, 63, 74, 87, 124, 126, 135, 143, 150, 157, 190, 193, 198, 208, 214, 231, 235, 245, 277, 284],
  d1: [2, 16, 55, 55, 66, 72, 78, 88, 123, 124, 133, 142, 155, 160, 166, 172, 179, 201, 205, 214],
  d2: [2, 8, 18, 28, 37, 43, 69, 69, 78, 88, 96, 117, 120, 131, 139, 155, 163],
  d3: [2, 10, 30, 34, 41, 68, 69, 84, 93, 99, 105, 112, 144, 148, 155, 167, 167, 177, 181, 189],
  d4: [2, 13, 31, 34, 42, 46, 51, 71, 75, 81, 86, 95, 101, 107, 115, 124, 130, 136],
  d5: [2, 15, 23, 30, 50, 55, 63, 72, 99, 99, 105, 127, 135, 141, 147, 157, 162, 166],
  d6: [2, 10, 15, 21, 28, 45, 69, 72, 76, 83, 92, 94, 101],
  d7: [2, 15, 37, 43, 49, 77, 78, 96, 126, 129, 138, 163, 169, 177],
  d8: [2, 18, 25, 30, 63, 65, 73, 92, 102, 113, 138, 157, 165, 192, 196, 205, 213, 220, 251, 251, 282, 282, 304, 309, 314],
  d9: [2, 13, 33, 39, 48, 55, 60, 96, 101, 106, 115, 142, 142, 148, 171, 173, 178, 187, 196, 205, 211, 214, 221],
  d10: [2, 13, 21, 33, 39, 46, 61, 67, 74],
  d11: [2, 16, 37, 49, 51, 60, 69, 90, 96, 102],
  p12: [2, 16, 26, 60, 64, 72, 80, 106, 111, 121, 142, 154, 163],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Daniel runs a cosmetology academy with nine instructors. Their hours live on paper timesheets, sick days arrive by text, and every payday, he's guessing.",
  d1: "In skillbank, instructors clock in from My Attendance. Tasha checks in, and says what she's working on: color theory lab.",
  d2: "The timer runs while she works. Her status shows working now, with today's events right beside it.",
  d3: "At lunch she checks out. In the afternoon, a second session starts. Every session is kept, with its own title.",
  d4: "Next Friday she needs a day off. She picks the first and last day, and adds a reason.",
  d5: "Who covers for her? She chooses a colleague, confirms they agreed, and confirms her students have been told.",
  d6: "She picks her manager, and saves. The day off now waits for approval.",
  d7: "Now Daniel, as the manager, opens Attendance Report. He chooses Tasha, and this month.",
  d8: "Every day is there: first check in, last check out, sessions, and hours. The totals sit on top: days worked, hours worked, and days off.",
  d9: "One evening she forgot to check out. He edits the session, fixes the time, and the change history keeps a record of it.",
  d10: "Then he approves the day, and her day off.",
  d11: "On Tasha's side, it now says approved by your manager.",
  p12: "No paper timesheets. No guessing on payday. Every hour, approved and on record.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  appIn: DEMO_START,
  clickHeader: cue("d1", "attendance", -8),
  typeWork: cue("d1", "says", -2),
  checkIn: cue("d1", "lab", 4),
  timer: S.d2,
  lunchOut: cue("d3", "checks", -2),
  pmIn: cue("d3", "second", -2),
  clickOff: cue("d4", "off", -4),
  firstDay: cue("d4", "first", -2),
  reason: cue("d4", "reason", -4),
  cover: cue("d5", "colleague", -4),
  agreed: cue("d5", "agreed", -2),
  told: cue("d5", "told", -2),
  manager: cue("d6", "manager", -4),
  saveOff: cue("d6", "saves", -2),
  mgr: S.d7,
  clickReport: cue("d7", "report", -6),
  pickStaff: cue("d7", "tasha", -4),
  range: cue("d7", "month", -4),
  totals: cue("d8", "totals", -4),
  clickEdit: cue("d9", "edits", -4),
  fixTime: cue("d9", "fixes", -2),
  saveEdit: cue("d9", "history", -6),
  approve: cue("d10", "approves", -2),
  approveOff: cue("d10", "off", -4),
  back: S.d11,
};
const CLICKS = [T.clickHeader, T.typeWork, T.checkIn, T.lunchOut, T.pmIn, T.clickOff, T.firstDay, T.reason, T.cover, T.agreed, T.told, T.manager, T.saveOff, T.clickReport, T.pickStaff, T.range, T.clickEdit, T.fixTime, T.saveEdit, T.approve, T.approveOff];

const lab = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 14, fontWeight: 800, color: "#374151" }}>{t}</div>;
const box = (x: number, y: number, w: number, on: boolean, v: React.ReactNode, ph: string, sel?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 44, borderRadius: 10, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 15, fontWeight: 600, color: v ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>;
const clock = (secs: number) => `${String(Math.floor(secs / 3600)).padStart(2, "0")}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

// ───────── my attendance (instructor) ─────────
const MyAtt: React.FC<{ f: number; approved?: boolean }> = ({ f, approved }) => {
  const running = (f >= T.checkIn + 2 && f < T.lunchOut + 2) || f >= T.pmIn + 2;
  const s1 = f >= T.lunchOut + 2;
  const s2 = f >= T.pmIn + 2;
  const secs = f >= T.pmIn ? Math.min((f - T.pmIn) * 37, 3 * 3600 + 1234) : f >= T.checkIn ? Math.min((f - T.checkIn) * 97 + 9000, 3.5 * 3600) : 0;
  const workTxt = f >= T.pmIn ? "Updo practice — level 2" : typed(f, T.typeWork + 2, "Color theory lab", 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <div style={{ position: "absolute", left: 30, top: 20, fontSize: 30, fontWeight: 900, color: INK }}>My attendance</div>
      <div style={{ position: "absolute", left: 30, top: 62, fontSize: 16, fontWeight: 600, color: GRAY }}>Clock in and out, see your hours, and request days off.</div>
      <div style={{ position: "absolute", left: 1090, top: 22 }}><Btn x={0} y={0} w={220} label="Request a day off" fs={16} glow={f >= T.clickOff - 8 && f < T.clickOff + 4 ? 1 : 0} /></div>
      {/* today's attendance */}
      <div style={{ position: "absolute", left: 30, top: 110, width: 800, height: 300, borderRadius: 16, background: "#fff", border: `2px solid ${running ? "#16A34A" : LINE}`, padding: 22, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 19, fontWeight: 900, color: INK }}>Today's Attendance</span>{running ? <Badge t="Working now" c="#15803D" bg="#DCFCE7" fs={13} dot /> : s1 ? <Badge t="Clocked out" c="#475569" bg="#F1F5F9" fs={13} dot /> : <Badge t="Not started" c="#475569" bg="#F1F5F9" fs={13} dot />}</div>
        {lab(22, 62, "What are you working on?")}
        {box(22, 86, 480, f >= T.typeWork && f < T.checkIn, workTxt, "Work session")}
        <div style={{ position: "absolute", left: 522, top: 86 }}><Btn x={0} y={0} w={160} h={44} label={running ? "Check Out" : "Check In"} primary={!running} fs={16} press={(f >= T.checkIn && f < T.checkIn + 6) || (f >= T.lunchOut && f < T.lunchOut + 6) || (f >= T.pmIn && f < T.pmIn + 6) ? 1 : 0} /></div>
        <div style={{ position: "absolute", left: 22, top: 150, fontSize: 64, fontWeight: 900, color: running ? "#16A34A" : "#CBD5E1", fontFamily: "monospace", letterSpacing: 2 }}>{clock(Math.floor(secs))}</div>
        <div style={{ position: "absolute", left: 22, top: 236, display: "flex", gap: 10 }}>
          {s1 && <span style={{ padding: "6px 12px", borderRadius: 10, background: "#F1F5F9", fontSize: 14, fontWeight: 800, color: INK }}>Color theory lab · 8:58 – 12:31 · 3h 33m</span>}
          {s2 && <span style={{ padding: "6px 12px", borderRadius: 10, background: "#DCFCE7", fontSize: 14, fontWeight: 800, color: "#166534" }}>Updo practice — level 2 · 1:15 – now</span>}
        </div>
      </div>
      {/* today's events */}
      <div style={{ position: "absolute", left: 850, top: 110, width: 470, height: 300, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, padding: 22, boxSizing: "border-box" }}>
        <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>Today's Events</div>
        {[["9:00 AM", "Color theory lab · Room 2"], ["1:15 PM", "Updo practice — level 2"], ["4:00 PM", "Student clinic floor"]].map(([t, e], i) => <div key={t} style={{ marginTop: 14, display: "flex", gap: 12, fontSize: 15, fontWeight: 700, color: INK, opacity: pr(f, T.timer + i * 6, 8) }}><span style={{ width: 80, color: GRAY }}>{t}</span>{e}</div>)}
      </div>
      {/* days strip */}
      <div style={{ position: "absolute", left: 30, top: 430, width: 1290, height: 330, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, padding: 22, boxSizing: "border-box" }}>
        <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>This month</div>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const day = 17 + i;
            const st = day === 30 ? (f >= T.saveOff + 4 ? (approved ? "Approved" : "Awaiting approval") : "Upcoming") : day === 20 ? (approved ? "Approved" : "Awaiting approval") : day > 20 ? "Upcoming" : day % 7 === 3 || day % 7 === 4 ? "No record" : "Approved";
            const c = st === "Approved" ? ["#DCFCE7", "#166534"] : st === "Awaiting approval" ? ["#FEF3C7", "#92400E"] : st === "Upcoming" ? ["#F1F5F9", "#64748B"] : ["#F8FAFC", "#94A3B8"];
            return <div key={i} style={{ height: 106, borderRadius: 12, background: c[0], padding: 10, boxSizing: "border-box", border: day === 20 ? `2px solid ${BLUE}` : "none" }}><div style={{ fontSize: 15, fontWeight: 900, color: INK }}>Oct {day}</div><div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: c[1] }}>{day === 30 && f >= T.saveOff + 4 ? "Day off · " : ""}{st}</div>{day === 20 && approved && <div style={{ marginTop: 4, fontSize: 11, fontWeight: 700, color: "#166534" }}>Approved by your manager</div>}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// ───────── day off dialog (content coords) ─────────
const OX = 360, OY = 60, OW = 880, OH = 720;
const OP = (x: number, y: number) => CT(OX + x, OY + y);
const OffDay: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickOff + 2 || f > T.saveOff + 12) return null;
  const inn = Math.min(1, sp(f, T.clickOff + 2, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, T.saveOff + 2, T.saveOff + 12));
  const yn = (on: boolean, at: number) => ["Yes", "No"].map((t, i) => <span key={t} style={{ padding: "8px 18px", borderRadius: 10, background: on && f >= at && i === 0 ? BLUE : "#fff", color: on && f >= at && i === 0 ? "#fff" : INK, border: on && f >= at && i === 0 ? "none" : `2px solid ${LINE}`, fontSize: 15, fontWeight: 800 }}>{t}</span>);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: OX, top: OY + (1 - inn) * 30, width: OW, height: OH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 24, fontWeight: 900, color: INK }}>Request a day off</div>
        {lab(28, 76, "First day")}{box(28, 98, 400, f >= T.firstDay && f < T.reason, f >= T.firstDay + 4 ? "Fri, Oct 30, 2026" : "", "Select date")}
        {lab(452, 76, "Last day")}{box(452, 98, 400, false, f >= T.firstDay + 10 ? "Fri, Oct 30, 2026" : "", "Select date")}
        {lab(28, 160, "Reason")}{box(28, 182, 824, f >= T.reason && f < T.cover, typed(f, T.reason + 2, "Family event — sister's wedding", 1), "e.g. Sick leave, family event")}
        {lab(28, 244, "Who covers for you?")}{box(28, 266, 824, f >= T.cover && f < T.agreed, f >= T.cover + 6 ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar t="MV" s={24} />Maya Vance · Instructor</span> : "", "Choose a colleague", true)}
        {lab(28, 328, "Did they agree?")}<div style={{ position: "absolute", left: 28, top: 352, display: "flex", gap: 8 }}>{yn(true, T.agreed + 2)}</div>
        {lab(28, 410, "Have you told your clients or students?")}<div style={{ position: "absolute", left: 28, top: 434, display: "flex", gap: 8 }}>{yn(true, T.told + 2)}</div>
        {lab(28, 492, "Manager")}{box(28, 514, 400, f >= T.manager && f < T.saveOff, f >= T.manager + 6 ? "Daniel Ortiz" : "", "Choose a manager", true)}
        {lab(452, 492, "HR (optional)")}{box(452, 514, 400, false, "", "Choose HR", true)}
        {lab(28, 576, "Details (optional)")}{box(28, 598, 824, false, f >= T.manager + 10 ? "Maya has my Friday clinic group." : "", "Anything your team should know (optional)")}
        <Btn x={OW - 28 - 160 - 12 - 110} y={OH - 70} w={110} label="Cancel" fs={16} />
        <Btn x={OW - 28 - 160} y={OH - 70} w={160} label="Save day off" primary fs={16} press={f >= T.saveOff && f < T.saveOff + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── attendance report (manager) ─────────
const DAYSR: [string, string, string, string, string, number, string][] = [
  ["Oct 13", "Tue", "Approved", "8:52 AM", "5:04 PM", 2, "7h 41m"],
  ["Oct 14", "Wed", "Approved", "8:58 AM", "4:57 PM", 2, "7h 29m"],
  ["Oct 15", "Thu", "Approved", "9:03 AM", "5:10 PM", 3, "7h 52m"],
  ["Oct 16", "Fri", "Approved", "8:55 AM", "1:02 PM", 1, "4h 07m"],
  ["Oct 19", "Mon", "Awaiting approval", "8:57 AM", "11:59 PM", 2, "14h 31m"],
  ["Oct 20", "Tue", "Awaiting approval", "8:58 AM", "6:02 PM", 2, "8h 14m"],
  ["Oct 30", "Fri", "Day off", "—", "—", 0, "—"],
];
const RTY = 300, RRH = 58;
const Report: React.FC<{ f: number }> = ({ f }) => {
  const fixed = f >= T.saveEdit + 2;
  const appr = (i: number) => (i === 5 && f >= T.approve + 2) || (i === 4 && f >= T.saveEdit + 2 && f >= T.approve + 10) || (i === 6 && f >= T.approveOff + 2);
  const staff = f >= T.pickStaff + 4;
  const cols = [{ h: "Date", w: 130 }, { h: "Day", w: 80 }, { h: "Status", w: 220 }, { h: "First check-in", w: 160 }, { h: "Last check-out", w: 170 }, { h: "Sessions", w: 110 }, { h: "Hours", w: 130 }, { h: "Action", w: 290 }];
  const xs = cols.map((_, i) => cols.slice(0, i).reduce((a, c) => a + c.w, 0));
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC", opacity: pr(f, T.clickReport + 2, 10) }}>
      <div style={{ position: "absolute", left: 30, top: 20, fontSize: 30, fontWeight: 900, color: INK }}>Attendance report</div>
      <div style={{ position: "absolute", left: 30, top: 62, fontSize: 16, fontWeight: 600, color: GRAY }}>Review a staff member's hours, approve days and fix mistakes.</div>
      {box(30, 104, 400, f >= T.pickStaff - 6 && f < T.range, staff ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar t="TW" s={24} c1="#DB2777" c2="#9D174D" />Tasha Williams · Instructor</span> : "", "Choose a staff member", true)}
      {box(446, 104, 240, f >= T.range - 4 && f < T.totals, f >= T.range + 4 ? "This month" : staff ? "Last 7 days" : "", "Date range", true)}
      {staff && [["Days worked", f >= T.range + 4 ? "14" : "5"], ["Hours worked", f >= T.range + 4 ? (fixed ? "101h 52m" : "108h 12m") : "38h"], ["Days off", f >= T.range + 4 ? "1" : "0"]].map(([l, v], i) => (
        <div key={l} style={{ position: "absolute", left: 30 + i * 300, top: 170, width: 280, height: 110, borderRadius: 16, background: "#fff", border: `2px solid ${f >= T.totals && f < T.clickEdit ? BLUE : LINE}`, padding: 18, boxSizing: "border-box", opacity: pr(f, T.pickStaff + 6 + i * 4, 8) }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: GRAY }}>{l}</div><div style={{ marginTop: 4, fontSize: 36, fontWeight: 900, color: i === 1 && fixed ? "#16A34A" : INK }}>{v}</div>
        </div>
      ))}
      {staff && (
        <div style={{ position: "absolute", left: 30, top: RTY, width: 1290, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden" }}>
          <div style={{ height: 44, display: "flex", background: "#F9FAFB", borderBottom: `1px solid ${LINE}` }}>{cols.map((c) => <div key={c.h} style={{ width: c.w, padding: "12px 14px", boxSizing: "border-box", fontSize: 13, fontWeight: 900, color: GRAY }}>{c.h}</div>)}</div>
          {DAYSR.map((r, i) => {
            const fx = i === 4 && fixed;
            const st = appr(i) ? (r[2] === "Day off" ? "Day off · Approved" : "Approved") : r[2];
            const cells = [r[0], r[1], st, r[3], fx ? "5:06 PM" : r[4], String(r[5]), fx ? "7h 38m" : r[6]];
            return (
              <div key={i} style={{ position: "relative", height: RRH, display: "flex", alignItems: "center", borderBottom: `1px solid ${LINE}`, background: i === 4 && f >= T.clickEdit - 10 && f < T.saveEdit + 30 ? "#FEF3C7" : "transparent", opacity: pr(f, T.pickStaff + 10 + i * 3, 8) }}>
                {cells.map((c, k) => <div key={k} style={{ width: cols[k].w, padding: "0 14px", boxSizing: "border-box", fontSize: 15, fontWeight: k === 0 ? 800 : 600, color: (k === 4 || k === 6) && i === 4 && !fx ? "#DC2626" : INK }}>{k === 2 ? <Badge t={c} c={c.includes("Approved") ? "#15803D" : c === "Awaiting approval" ? "#92400E" : "#475569"} bg={c.includes("Approved") ? "#DCFCE7" : c === "Awaiting approval" ? "#FEF3C7" : "#F1F5F9"} fs={12} dot /> : c}</div>)}
                <div style={{ width: cols[7].w, display: "flex", gap: 8, padding: "0 10px" }}>
                  {(i === 4 || i === 5 || i === 6) && !appr(i) && <span style={{ padding: "6px 10px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 12, fontWeight: 800 }}>Approve this day</span>}
                  <span style={{ padding: "6px 10px", borderRadius: 8, border: `2px solid ${i === 4 && f >= T.clickEdit - 8 && f < T.clickEdit + 6 ? BLUE : LINE}`, fontSize: 12, fontWeight: 800, color: INK }}>Edit</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
const EDX = 380, EDY = 180, EDW = 840, EDH = 450;
const EDP = (x: number, y: number) => CT(EDX + x, EDY + y);
const EditDialog: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickEdit + 2 || f > T.saveEdit + 12) return null;
  const o = pr(f, T.clickEdit + 2, 10) * (1 - lin(f, T.saveEdit + 2, T.saveEdit + 12));
  const fixedT = f >= T.fixTime + 6;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: EDX, top: EDY, width: EDW, height: EDH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT, padding: 26, boxSizing: "border-box" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>Edit · Mon, Oct 19</div>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: GRAY }}>Correct session titles and times. Leave check-out empty for a session that is still running.</div>
        {[["Color theory lab", "8:57 AM", "12:30 PM", false], ["Bridal styling demo", "1:12 PM", fixedT ? "5:06 PM" : "11:59 PM", true]].map(([t, a, b, edit], i) => (
          <div key={i} style={{ position: "absolute", left: 26, top: 110 + i * 90, width: EDW - 52 }}>
            {lab(0, 0, "Session title")}{box(0, 22, 360, false, t as string, "")}
            {lab(380, 0, "Check in")}{box(380, 22, 170, false, a as string, "")}
            {lab(570, 0, "Check out")}<div style={{ position: "absolute", left: 570, top: 22 }}>{box(0, 0, 200, !!edit && f >= T.fixTime - 4 && f < T.saveEdit, <span style={{ color: edit && !fixedT ? "#DC2626" : INK }}>{b as string}</span>, "")}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 26, top: 300, width: EDW - 52, padding: 14, borderRadius: 12, background: "#F8FAFC", border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: INK }}>Change history</div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: GRAY }}>Oct 19 · created by Tasha Williams (check-in 1:12 PM)</div>
          {fixedT && <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: "#166534", opacity: pr(f, T.fixTime + 6, 8) }}>Oct 21 · Daniel Ortiz changed check-out 11:59 PM → 5:06 PM</div>}
        </div>
        <Btn x={EDW - 26 - 120 - 12 - 110} y={EDH - 70} w={110} label="Cancel" fs={16} />
        <Btn x={EDW - 26 - 120} y={EDH - 70} w={120} label="Save" primary fs={16} press={f >= T.saveEdit && f < T.saveEdit + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.clickHeader - 10, 1100, 480, 1.04], [T.typeWork, 900, 470, 1.1], [S.d2, 900, 500, 1.1], [S.d3, 960, 560, 1.06],
  [T.clickOff, 960, 540, 1.0], [T.firstDay, 960, 470, 1.08], [S.d5, 960, 560, 1.08], [S.d6, 960, 620, 1.08], [T.mgr, 960, 540, 1.0],
  [T.pickStaff, 900, 480, 1.08], [T.totals, 960, 480, 1.08], [S.d9, 960, 560, 1.06], [T.fixTime, 1060, 500, 1.1], [S.d10, 1060, 600, 1.06], [T.back, 960, 600, 1.06], [PAY_START, 960, 540, 1.0],
]).map(calmK);
const HDRX = CT(SBW + 1027, 30); // header "View Attendance"
const rowAct = (i: number, k: number): [number, number] => MA(30 + 1060 + 10 + k * 120 + 50, RTY + 44 + i * RRH + RRH / 2);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickHeader, ...HDRX],
  [T.typeWork, ...MA(30 + 22 + 240, 110 + 86 + 22)], [T.checkIn, ...MA(30 + 522 + 80, 110 + 86 + 22)],
  [T.timer + 20, ...MA(1080, 240)],
  [T.lunchOut, ...MA(30 + 522 + 80, 110 + 86 + 22)], [T.pmIn, ...MA(30 + 522 + 80, 110 + 86 + 22)],
  [T.clickOff, ...MA(1090 + 110, 22 + 24)],
  [T.firstDay, ...OP(228, 120)], [T.reason, ...OP(440, 204)], [T.cover, ...OP(440, 288)], [T.agreed, ...OP(28 + 40, 374)], [T.told, ...OP(28 + 40, 456)],
  [T.manager, ...OP(228, 536)], [T.saveOff, ...OP(OW - 108, OH - 46)],
  [T.mgr + 20, ...MA(700, 400)],
  [T.clickReport, ...realMenuPt("Attendance Report", "Attendance")],
  [T.pickStaff, ...MA(30 + 200, 126)], [T.range, ...MA(446 + 120, 126)],
  [T.totals, ...MA(30 + 440, 225)],
  [T.clickEdit, ...rowAct(4, 0)],
  [T.fixTime, ...EDP(26 + 570 + 100, 200 + 22 + 22)], [T.saveEdit, ...EDP(EDW - 86, EDH - 46)],
  [T.approve, ...rowAct(5, 0)], [T.approveOff, ...rowAct(6, 0)],
  [T.back + 20, ...MA(400, 600)],
]);
const STEPS = [
  { at: T.clickHeader, to: S.d2, label: "Check in" },
  { at: S.d2, to: S.d3, label: "Timer and today's events" },
  { at: S.d3, to: T.clickOff, label: "Every session kept" },
  { at: T.clickOff, to: T.mgr, label: "Request a day off" },
  { at: T.mgr, to: S.d9, label: "Attendance report" },
  { at: S.d9, to: S.d10, label: "Fix a missed check-out" },
  { at: S.d10, to: T.back, label: "Approve" },
  { at: T.back, to: PAY_START, label: "Approved by your manager" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const mgr = f >= T.mgr && f < T.back;
  const reportOn = f >= T.clickReport + 2;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {mgr ? (
          <LandWin f={f} inAt={T.mgr} branch="Luxe Beauty — Austin" url="academy.skillbnk.com/attendance-report" active={reportOn ? "Attendance Report" : "Dashboard"} openGroup="Attendance"
            main={reportOn ? <Report f={f} /> : <div />}
            overlay={<><EditDialog f={f} /><Toast f={f} at={T.saveEdit + 3} text="Attendance updated" d={50} /><Toast f={f} at={T.approve + 3} text="Day approved" d={45} /></>} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} branch="Luxe Beauty — Austin" url="academy.skillbnk.com/my-attendances" active={f >= T.clickHeader + 2 ? "My Attendances" : "Dashboard"} openGroup="Attendance"
            main={f >= T.clickHeader + 2 ? <MyAtt f={f} approved={f >= T.back} /> : <div />}
            overlay={<><OffDay f={f} /><Toast f={f} at={T.checkIn + 3} text="Attendance started" d={45} /><Toast f={f} at={T.lunchOut + 3} text="Attendance stopped" d={40} /><Toast f={f} at={T.saveOff + 3} text="Day off saved" d={45} /></>} />
        )}
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.mgr - 4} text="Instructor · training provider portal" />
      <PortalTagL f={f} at={T.mgr + 4} out={T.back - 4} text="Manager · training provider portal" />
      <PortalTagL f={f} at={T.back + 4} out={PAY_START - 6} text="Instructor · training provider portal" />
    </AbsoluteFill>
  );
};

// ───────── hook (story: the payday guess) ─────────
const HK = { daniel: cue("h0", "daniel"), nine: cue("h0", "nine"), paper: cue("h0", "paper"), sick: cue("h0", "sick"), payday: cue("h0", "payday"), guessing: cue("h0", "guessing") };
const SHEETS = ["Mon 9–5?", "Tue 8:30–4", "Wed ??–6", "Thu 9–5", "Fri (half?)"];
const TEXTS = ["sick today, sorry", "running late, cover me?", "can't come tmrw", "swapped w/ Maya"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.payday - 6, HK.guessing + 30);
  const roll = f >= HK.payday ? Math.floor((f - HK.payday) / 2) : 0;
  const amount = f >= HK.guessing + 10 ? "$ ? ? ? ?" : `$${(3000 + ((roll * 7919) % 9000)).toLocaleString()}`;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 80, opacity: pr(f, HK.daniel - 6, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#F472B6" }}>LUXE BEAUTY ACADEMY</div>
          <div style={{ marginTop: 6, fontSize: 60, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.daniel - 4, "9 instructors. 0 records.", 0.8)}</div>
        </div>
        {/* nine paper timesheets fanned out, scribbled */}
        {Array.from({ length: 9 }).map((_, i) => {
          const k = pr(f, HK.nine - 6 + i * 3, 12);
          const x = 160 + (i % 5) * 200, y = 260 + Math.floor(i / 5) * 290;
          const smudge = f >= HK.paper + i * 3;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y + (1 - k) * 80, width: 180, height: 250, borderRadius: 6, background: "#FEFCE8", boxShadow: "0 18px 40px #0008", transform: `rotate(${((i * 37) % 11) - 5}deg)`, opacity: k, padding: 12, boxSizing: "border-box", fontFamily: "'Comic Sans MS','Marker Felt',cursive" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#713F12" }}>TIMESHEET · #{i + 1}</div>
              {SHEETS.map((s, r) => <div key={r} style={{ marginTop: 10, fontSize: 15, color: smudge && (r + i) % 3 === 0 ? "#DC2626" : "#422006", textDecoration: smudge && (r + i) % 4 === 1 ? "line-through" : "none", borderBottom: "1px solid #E7E5E4" }}>{s}</div>)}
              {smudge && i % 3 === 0 && <div style={{ position: "absolute", right: 14, bottom: 20, width: 60, height: 60, borderRadius: 30, border: "6px solid #92400E55" }} />}
            </div>
          );
        })}
        {/* sick-day texts sliding in */}
        {TEXTS.map((t, i) => {
          const k = pr(f, HK.sick + i * 6, 12);
          return <div key={t} style={{ position: "absolute", left: 1220 + (1 - k) * 300, top: 260 + i * 80, width: 380, padding: "12px 16px", borderRadius: 16, background: "#1E293B", border: "2px solid #334155", color: "#E2E8F0", fontSize: 19, fontWeight: 800, opacity: k }}><span style={{ fontSize: 13, color: "#94A3B8" }}>text · 6:{String(40 + i * 7).slice(-2)} am</span><br />{t}</div>;
        })}
        {/* payday calculator */}
        {f >= HK.payday - 6 && (
          <div style={{ position: "absolute", left: 1240, top: 600, width: 360, height: 220, borderRadius: 20, background: "#0F172A", border: "3px solid #475569", padding: 18, boxSizing: "border-box", opacity: pr(f, HK.payday - 6, 10) }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#94A3B8", letterSpacing: 3 }}>PAYROLL · FRIDAY</div>
            <div style={{ marginTop: 10, height: 80, borderRadius: 10, background: "#022C22", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", fontFamily: "monospace", fontSize: 48, fontWeight: 900, color: f >= HK.guessing + 10 ? "#F87171" : "#4ADE80" }}>{amount}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>{["7", "8", "9", "+"].map((b) => <span key={b} style={{ flex: 1, height: 36, borderRadius: 8, background: "#334155", color: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900 }}>{b}</span>)}</div>
          </div>
        )}
      </Stage>
      <Stamp f={f} at={HK.guessing + 12} x={640} y={850} text="GUESSING" color="#F472B6" size={56} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.daniel, "Daniel runs a cosmetology academy."], [HK.paper, "Hours live on paper timesheets…", "paper timesheets"], [HK.sick, "…sick days arrive by text…", "by text"], [HK.payday, "…and every payday, he's guessing.", "guessing"]]} />
    </AbsoluteFill>
  );
};

const PY = { paper: cue("p12", "paper"), record: cue("p12", "record") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(244,114,182,0.22), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 460, top: 200, width: 1000, height: 300, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, PY.paper - 8, 12) }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>October · 9 instructors</div>
      <div style={{ marginTop: 20, display: "flex", gap: 14 }}>{[["Days worked", "118"], ["Hours worked", "912h"], ["Days off", "6"], ["Approved", "100%"]].map(([l, v]) => <div key={l} style={{ flex: 1, padding: 16, borderRadius: 14, background: "#F8FAFC" }}><div style={{ fontSize: 14, fontWeight: 800, color: GRAY }}>{l}</div><div style={{ fontSize: 36, fontWeight: 900, color: INK }}>{v}</div></div>)}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 580, width: 1920, textAlign: "center", fontSize: 44, fontWeight: 800, color: "#FBCFE8", opacity: pr(f, PY.record - 6, 14) }}>Every hour, approved and on record</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.sick, "pop", 0.3); add(HK.payday, "riser", 0.25); add(HK.guessing + 12, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  add(T.checkIn + 3, "chime", 0.4); add(T.saveOff + 3, "chime", 0.4); add(T.saveEdit + 3, "ding", 0.35); add(T.approve + 3, "chime", 0.45);
  add(T.mgr, "whoosh", 0.35); add(T.back, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PY.record, "chime", 0.5);
  return a;
})();

export const StaffAttendanceStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="staffattstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.mgr, T.back]} />;
};
