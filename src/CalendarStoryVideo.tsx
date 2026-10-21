import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Person, Stage, BeatCaption, Stamp, Bubble } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, HookTag, Fx } from "./storyShell";

/**
 * CalendarStoryVideo — DEEP (sheet serial 43, Training Calendar). Story: Amara Okoye, BrightVein Phlebotomy School (fictional).
 * Verified in code: libs/shared/calendar + en.ts. CalendarCommon: Day / Week / Month, Today, "Search people/events/status...".
 * CalendarSidebar: Filters, "Events (as an organizer)", "Events (as an attendee)", To-Do, status Accepted / Pending / Denied /
 * Proposed New Time / Finished, Priority Low/Medium/High, Type Event/Task. CalendarCreateEvent: Add New, Event / Todo, "Fill out the form
 * to create new event", Name "Enter event name *", Purpose, Event Date & Time, All Day, Repeat Daily/Weekly/Monthly/Yearly + weekdays,
 * "Choose an end date", Location Zoom / Phone Call / Google Meet / Custom, Color, Add Reminders, Time Before "Reminder 15 minutes before",
 * Methods (max:3) Chat DM / Chat Crowds / Notification / Text Message / Email, Chat Groups (max:3), Invitations/Add Guests, Meeting Agenda,
 * Save & Close, "Successfully added a new event". CalendarEventDetails: Join with, Meeting Agenda/Follow up/Action Item, Reminder, Invited
 * Guests, "Going?" Yes/No, "Propose a new time for the event", "Invitation status updated successfully". CalendarTodoBoard: Todo / In
 * Progress / Completed / Cancelled, Due, Priority, "Task updated successfully". Learner sidebar Calendar → Events / To-Do.
 * Voice: python3 generate-voice-story.py src/CalendarStoryVideo.tsx public/calendarstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 262,
  d1: 295,
  d2: 271,
  d3: 194,
  d4: 233,
  d5: 212,
  d6: 207,
  d7: 218,
  d8: 187,
  d9: 137,
  d10: 254,
  d11: 269,
  p12: 210,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 16, 29, 38, 48, 81, 82, 91, 95, 99, 103, 126, 129, 133, 139, 142, 147, 169, 174, 182, 204, 208, 214, 220, 223, 227, 232],
  d1: [2, 13, 35, 45, 56, 68, 96, 118, 118, 131, 144, 152, 162, 171, 176, 186, 200, 210, 211, 221, 249, 258, 274],
  d2: [2, 15, 30, 51, 63, 82, 94, 130, 146, 147, 163, 172, 190, 195, 207, 216, 226, 231],
  d3: [2, 13, 19, 26, 36, 60, 61, 69, 93, 99, 108, 117, 142, 145, 155, 158, 165, 169],
  d4: [2, 10, 22, 33, 54, 57, 61, 68, 76, 91, 99, 105, 133, 136, 143, 147, 166, 169, 174, 181, 189, 204],
  d5: [2, 21, 27, 34, 51, 59, 70, 87, 127, 136, 139, 143, 151, 159],
  d6: [2, 14, 28, 34, 60, 63, 71, 81, 116, 116, 125, 146, 148, 159, 159, 169],
  d7: [2, 16, 21, 28, 52, 52, 64, 75, 81, 86, 112, 121, 126, 131, 141, 158, 160, 166, 171, 176, 184],
  d8: [2, 9, 16, 36, 37, 50, 50, 58, 70, 82, 89, 94, 100, 134, 156],
  d9: [2, 18, 30, 37, 42, 61, 64, 70, 81, 88, 93, 101],
  d10: [2, 10, 19, 26, 35, 37, 41, 49, 56, 90, 91, 97, 103, 111, 120, 124, 126, 134, 153, 161, 166, 174, 189, 198, 206, 222],
  d11: [2, 15, 21, 24, 33, 44, 68, 78, 84, 93, 100, 123, 128, 133, 152, 155, 162, 169, 176, 183, 210, 210, 221, 225, 231],
  p12: [2, 16, 61, 61, 91, 96, 119, 123, 155, 158, 165, 171, 175, 178, 184],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Amara runs a phlebotomy school. Class times live in her head, Zoom links live in her inbox, and every week someone shows up on the wrong day.",
  d1: "In skillbank, everything starts in Calendar. Day, week, or month, with today one click away, and a search across people, events, and status.",
  d2: "She clicks Add New, and picks event. A name, and the purpose, so everyone knows what it's for.",
  d3: "Then the date and time. It repeats weekly, every Tuesday and Thursday, until the end of the term.",
  d4: "The location is Zoom, so the meeting link comes with the event. She picks a color, so the lab nights stand out.",
  d5: "Reminders go out fifteen minutes before, by notification, email, and the class chat crowd.",
  d6: "She invites the guests: the whole evening session. Save and close, and the event is added.",
  d7: "Now, the learner side. Jordan opens Calendar in his portal. Tuesday's lab is already there, with the Zoom link to join.",
  d8: "He opens it, sees the agenda and the reminder, and answers the invitation. Going? Yes.",
  d9: "Thursday clashes with his shift, so he proposes a new time instead.",
  d10: "He keeps his own to do list here too. Tasks with a priority and a due date, moved from to do, to in progress, to completed.",
  d11: "Back in the training provider portal, Amara's calendar shows who accepted, who's still pending, and who proposed a new time, filtered right from the sidebar.",
  p12: "One calendar. Every class, every link, every answer. Nobody shows up on the wrong day.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "calendar", -6),
  views: cue("d1", "day", -4),
  clickMonth: cue("d1", "month", -2),
  clickWeek: cue("d1", "today", -4),
  search: cue("d1", "search", -4),
  clickAdd: cue("d2", "add", -4),
  clickEvent: cue("d2", "event", -2),
  typeName: cue("d2", "name", -2),
  typePurpose: cue("d2", "purpose", -2),
  date: cue("d3", "date", -4),
  repeat: cue("d3", "weekly", -4),
  tue: cue("d3", "tuesday", -2),
  thu: cue("d3", "thursday", -2),
  endDate: cue("d3", "end", -2),
  loc: cue("d4", "zoom", -4),
  color: cue("d4", "color", -2),
  rem: cue("d5", "fifteen", -4),
  mNotif: cue("d5", "notification", -2),
  mEmail: cue("d5", "email", -2),
  mCrowd: cue("d5", "crowd", -2),
  guests: cue("d6", "guests", -4),
  pickSession: cue("d6", "session", -2),
  save: cue("d6", "save", -2),
  learner: cue("d7", "learner", -8),
  lOpen: cue("d8", "opens", -2),
  lYes: cue("d8", "yes", -4),
  lPropose: cue("d9", "proposes", -4),
  proposeOk: cue("d9", "instead", 4),
  todo: S.d10,
  drag1: cue("d10", "progress", -6),
  drag2: cue("d10", "completed", -6),
  back: S.d11,
  fAccepted: cue("d11", "accepted", -4),
  fPending: cue("d11", "pending", -4),
  fProposed: cue("d11", "proposed", -4),
};
const CLICKS = [T.clickMenu, T.clickMonth, T.clickWeek, T.search, T.clickAdd, T.clickEvent, T.typeName, T.typePurpose, T.date, T.repeat, T.tue, T.thu, T.endDate, T.loc, T.color, T.rem, T.mNotif, T.mEmail, T.mCrowd, T.guests, T.pickSession, T.save, T.lOpen, T.lYes, T.lPropose, T.proposeOk, T.fAccepted, T.fPending, T.fProposed];

// ───────── calendar page (main coords 1350 x 776) ─────────
const SBX = 0, SBWc = 250, GX0 = 270, GW0 = 1060;
const DAYS = ["Mon 19", "Tue 20", "Wed 21", "Thu 22", "Fri 23", "Sat 24", "Sun 25"];
const HOURS = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];
const colX = (d: number) => GX0 + 60 + d * ((GW0 - 60) / 7);
const COLW = (GW0 - 60) / 7;
const rowYh = (h: number) => 150 + ((h - 8) / 14) * 600; // hour → y
type Ev = { d: number; h0: number; h1: number; t: string; c: string; mine?: boolean };
const BASE_EV: Ev[] = [
  { d: 0, h0: 9, h1: 11, t: "Anatomy review", c: "#0EA5E9" },
  { d: 2, h0: 13, h1: 14, t: "Staff sync", c: "#64748B" },
  { d: 4, h0: 10, h1: 12, t: "Skills check-off", c: "#16A34A" },
  { d: 5, h0: 9, h1: 13, t: "Clinic shadowing", c: "#F59E0B" },
];
const LAB: Ev[] = [{ d: 1, h0: 18, h1: 20, t: "Venipuncture lab", c: "#DC2626", mine: true }, { d: 3, h0: 18, h1: 20, t: "Venipuncture lab", c: "#DC2626", mine: true }];
const Sidebar: React.FC<{ f: number; learner?: boolean; filter?: string }> = ({ f, learner, filter }) => {
  const st: [string, string, number][] = [["Accepted", "#16A34A", 14], ["Pending", "#F59E0B", 7], ["Proposed New Time", "#7C3AED", 2], ["Denied", "#DC2626", 1], ["Finished", "#64748B", 0]];
  return (
    <div style={{ position: "absolute", left: SBX, top: 0, width: SBWc, height: "100%", borderRight: `1px solid ${LINE}`, background: "#fff", padding: 16, boxSizing: "border-box", fontFamily: FONT }}>
      <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>Filters</div>
      {[learner ? "Events (as an attendee)" : "Events (as an organizer)", learner ? "Events (as an organizer)" : "Events (as an attendee)", "To-Do"].map((t, i) => <div key={t} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: INK }}><span style={{ width: 16, height: 16, borderRadius: 4, background: i === 0 ? BLUE : "#fff", border: `2px solid ${i === 0 ? BLUE : "#9CA3AF"}` }} />{t}</div>)}
      <div style={{ marginTop: 18, fontSize: 14, fontWeight: 900, color: GRAY }}>Status</div>
      {st.map(([t, c, n]) => {
        const on = filter === t;
        return <div key={t} style={{ marginTop: 8, height: 34, borderRadius: 8, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", fontSize: 14, fontWeight: 800, color: on ? "#fff" : INK, background: on ? c : "transparent" }}><span style={{ width: 10, height: 10, borderRadius: 5, background: on ? "#fff" : c }} />{t}<span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.8 }}>{learner ? "" : n}</span></div>;
      })}
      <div style={{ marginTop: 18, fontSize: 14, fontWeight: 900, color: GRAY }}>Priority</div>
      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>{["Low", "Medium", "High"].map((p) => <span key={p} style={{ padding: "4px 10px", borderRadius: 999, background: "#F3F4F6", fontSize: 12, fontWeight: 800, color: INK }}>{p}</span>)}</div>
      <div style={{ marginTop: 18, fontSize: 14, fontWeight: 900, color: GRAY }}>Type</div>
      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>{["Event", "Task"].map((p) => <span key={p} style={{ padding: "4px 10px", borderRadius: 999, background: "#F3F4F6", fontSize: 12, fontWeight: 800, color: INK }}>{p}</span>)}</div>
    </div>
  );
};
const Toolbar: React.FC<{ f: number; view: string; q?: string; addOn?: boolean }> = ({ view, q, addOn }) => (
  <div style={{ position: "absolute", left: GX0, top: 14, width: GW0, height: 48, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT }}>
    <span style={{ padding: "10px 14px", borderRadius: 10, border: `2px solid ${LINE}`, fontSize: 15, fontWeight: 800, color: INK }}>Today</span>
    <span style={{ fontSize: 20, color: GRAY }}>‹ ›</span>
    <span style={{ fontSize: 20, fontWeight: 900, color: INK, width: 170 }}>October 2026</span>
    <div style={{ display: "flex", padding: 4, borderRadius: 10, background: "#F3F4F6" }}>{["Day", "Week", "Month"].map((v) => <span key={v} style={{ padding: "7px 14px", borderRadius: 8, background: view === v ? "#fff" : "transparent", boxShadow: view === v ? "0 2px 6px #0002" : "none", fontSize: 14, fontWeight: 800, color: view === v ? BLUE : "#4B5563" }}>{v}</span>)}</div>
    <div style={{ flex: 1, height: 44, borderRadius: 11, border: `2px solid ${q ? BLUE : LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, fontWeight: 600, color: q ? INK : "#9CA3AF" }}>⌕ {q || "Search people/events/status..."}</div>
    <div style={{ height: 44, padding: "0 18px", borderRadius: 11, background: BLUE, color: "#fff", display: "flex", alignItems: "center", fontSize: 15, fontWeight: 800, boxShadow: addOn ? "0 0 0 4px #C7D2FE" : "none" }}>＋ Add New</div>
  </div>
);
const WeekGrid: React.FC<{ f: number; events: Ev[]; hl?: number; badge?: (e: Ev, i: number) => React.ReactNode }> = ({ f, events, hl, badge }) => (
  <>
    <div style={{ position: "absolute", left: GX0, top: 76, width: GW0, height: 690, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden" }}>
      {DAYS.map((d, i) => <div key={d} style={{ position: "absolute", left: colX(i) - GX0, top: 0, width: COLW, height: 50, borderLeft: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: i === 1 ? BLUE : INK, background: i === 1 ? "#EEF2FF" : "#fff" }}>{d}</div>)}
      {HOURS.map((h, i) => <div key={h} style={{ position: "absolute", left: 0, top: rowYh(8 + i * 2) - 76, width: GW0, borderTop: `1px solid ${LINE}`, fontSize: 12, fontWeight: 700, color: GRAY, paddingLeft: 8 }}>{h}</div>)}
    </div>
    {events.map((e, i) => (
      <div key={i} style={{ position: "absolute", left: colX(e.d) + 4, top: rowYh(e.h0), width: COLW - 8, height: rowYh(e.h1) - rowYh(e.h0) - 4, borderRadius: 8, background: e.c + "22", borderLeft: `4px solid ${e.c}`, padding: "6px 8px", boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: INK, boxShadow: hl === i ? `0 0 0 3px ${e.c}` : "none", fontFamily: FONT }}>
        {e.t}<div style={{ fontSize: 11, fontWeight: 700, color: GRAY }}>{e.h0 > 12 ? e.h0 - 12 : e.h0}:00 {e.h0 >= 12 ? "PM" : "AM"}{e.mine ? " · Zoom" : ""}</div>{badge && badge(e, i)}
      </div>
    ))}
  </>
);
const MonthGrid: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: GX0, top: 76, width: GW0, height: 690, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden", opacity: pr(f, T.clickMonth, 8) }}>
    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => <div key={d} style={{ position: "absolute", left: i * (GW0 / 7), top: 0, width: GW0 / 7, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: GRAY }}>{d}</div>)}
    {Array.from({ length: 35 }).map((_, k) => { const day = k - 2; return <div key={k} style={{ position: "absolute", left: (k % 7) * (GW0 / 7), top: 36 + Math.floor(k / 7) * 130, width: GW0 / 7, height: 130, borderTop: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}`, padding: 6, boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: day < 1 || day > 31 ? "#D1D5DB" : day === 20 ? BLUE : INK }}>{day < 1 ? 28 + day : day > 31 ? day - 31 : day}{[5, 12, 19, 26].includes(day) && <div style={{ marginTop: 4, padding: "2px 6px", borderRadius: 5, background: "#0EA5E922", fontSize: 11, color: INK }}>Anatomy review</div>}{[9, 23].includes(day) && <div style={{ marginTop: 4, padding: "2px 6px", borderRadius: 5, background: "#16A34A22", fontSize: 11, color: INK }}>Skills check-off</div>}</div>; })}
  </div>
);
const BranchCal: React.FC<{ f: number }> = ({ f }) => {
  const after = f >= T.back;
  const view = !after && f >= T.clickMonth && f < T.clickWeek ? "Month" : "Week";
  const q = !after && f >= T.search && f < T.clickAdd ? typed(f, T.search + 4, "anatomy", 0.4) : "";
  const evs = f >= T.save + 4 ? [...BASE_EV, ...LAB] : BASE_EV;
  const filter = f >= T.fProposed ? "Proposed New Time" : f >= T.fPending ? "Pending" : f >= T.fAccepted ? "Accepted" : undefined;
  const cnt = filter === "Accepted" ? "14 accepted" : filter === "Pending" ? "7 pending" : filter === "Proposed New Time" ? "2 proposed" : "";
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <Sidebar f={f} filter={after ? filter : undefined} />
      <Toolbar f={f} view={view} q={q} addOn={f >= T.clickAdd - 10 && f < T.clickAdd + 6} />
      {view === "Month" ? <MonthGrid f={f} /> : <WeekGrid f={f} events={evs} hl={q ? 0 : after && filter ? 4 : undefined} badge={after ? (e) => e.mine && filter ? <div style={{ marginTop: 4 }}><Badge t={cnt} c="#fff" bg={filter === "Accepted" ? "#16A34A" : filter === "Pending" ? "#F59E0B" : "#7C3AED"} fs={11} /></div> : null : undefined} />}
    </div>
  );
};

// ───────── create event modal (content coords) ─────────
const EX = 60, EY = 14, EW = 1480, EH = 808;
const EP = (x: number, y: number) => CT(EX + x, EY + y);
const lab = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 14, fontWeight: 800, color: "#374151" }}>{t}</div>;
const box = (x: number, y: number, w: number, on: boolean, v: React.ReactNode, ph: string, sel?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 44, borderRadius: 10, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 15, fontWeight: 600, color: v ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>;
const chip = (x: number, y: number, t: string, on: boolean, w?: number) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 36, padding: w ? 0 : "0 12px", borderRadius: 9, background: on ? BLUE : "#fff", color: on ? "#fff" : INK, border: on ? "none" : `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, boxSizing: "border-box" }}>{t}</div>;
const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const METH = ["Chat DM", "Chat Crowds", "Notification", "Text Message", "Email"];
const METHX = [0, 100, 230, 360, 500];
const LOCS = ["Zoom", "Phone Call", "Google Meet", "Custom"];
const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#7C3AED", "#0EA5E9"];
const EventModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickAdd + 3 || f > T.save + 14) return null;
  const inn = Math.min(1, sp(f, T.clickAdd + 4, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, T.save + 2, T.save + 12));
  const ok = (t: number) => f >= t;
  const days = [false, ok(T.tue), false, ok(T.thu), false, false, false];
  const meth = [false, ok(T.mCrowd), ok(T.mNotif), false, ok(T.mEmail)];
  const L = 28, R = 760;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: EX, top: EY + (1 - inn) * 30, width: EW, height: EH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: L, top: 20, fontSize: 24, fontWeight: 900, color: INK }}>Add New</div>
        <div style={{ position: "absolute", left: 170, top: 18, display: "flex", padding: 4, borderRadius: 10, background: "#F3F4F6" }}>{["Event", "Todo"].map((v) => <span key={v} style={{ padding: "6px 16px", borderRadius: 8, background: v === "Event" && ok(T.clickEvent) ? "#fff" : "transparent", fontSize: 14, fontWeight: 800, color: v === "Event" && ok(T.clickEvent) ? BLUE : "#4B5563" }}>{v}</span>)}</div>
        <div style={{ position: "absolute", left: L, top: 58, fontSize: 14, fontWeight: 600, color: GRAY }}>Fill out the form to create new event</div>
        {lab(L, 92, "Name")}{box(L, 114, 700, f >= T.typeName && f < T.typePurpose, typed(f, T.typeName + 2, "Venipuncture lab — evening", 1), "Enter event name *")}
        {lab(L, 170, "Purpose")}{box(L, 192, 700, f >= T.typePurpose && f < T.date, typed(f, T.typePurpose + 2, "Hands-on practice: tourniquet, site selection, order of draw", 1.6), "Purpose")}
        {lab(L, 248, "Event Date & Time")}
        {box(L, 270, 240, f >= T.date && f < T.repeat, ok(T.date + 4) ? "Tue, Oct 20, 2026" : "", "Select date")}{box(L + 252, 270, 150, false, ok(T.date + 8) ? "6:00 PM" : "", "Start")}{box(L + 414, 270, 150, false, ok(T.date + 12) ? "8:00 PM" : "", "End")}
        <div style={{ position: "absolute", left: L + 584, top: 280, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: INK }}><span style={{ width: 40, height: 22, borderRadius: 11, background: "#D1D5DB", position: "relative" }}><span style={{ position: "absolute", left: 3, top: 3, width: 16, height: 16, borderRadius: 8, background: "#fff" }} /></span>All Day</div>
        {lab(L, 330, "Repeat")}{box(L, 352, 240, f >= T.repeat && f < T.tue, ok(T.repeat + 4) ? "Weekly" : "", "Never", true)}
        {WD.map((d, i) => <React.Fragment key={d}>{chip(L + 256 + i * 64, 356, d, days[i], 58)}</React.Fragment>)}
        {lab(L, 410, "Choose an end date")}{box(L, 432, 300, f >= T.endDate && f < T.loc, ok(T.endDate + 4) ? "Dec 17, 2026" : "", "Choose an end date")}
        {ok(T.endDate + 4) && <div style={{ position: "absolute", left: L + 316, top: 444, fontSize: 14, fontWeight: 700, color: BLUE }}>Occurs every Tue, Thu till - Dec 17, 2026</div>}
        {lab(L, 494, "Location")}
        {LOCS.map((l, i) => <React.Fragment key={l}>{chip(L + i * 150, 516, l, ok(T.loc) && i === 0, 140)}</React.Fragment>)}
        {lab(L, 572, "Color")}
        {COLORS.map((c, i) => <div key={c} style={{ position: "absolute", left: L + i * 46, top: 596, width: 34, height: 34, borderRadius: 17, background: c, boxShadow: ok(T.color) && i === 3 ? `0 0 0 4px #fff, 0 0 0 7px ${c}` : "none" }} />)}
        {lab(L, 652, "Meeting Agenda/Follow up/Action Item")}{box(L, 674, 700, false, ok(T.typePurpose + 40) ? "Bring gloves and badge. Pairs rotate every 20 min." : "", "Write Agenda/Follow up/Action Item")}
        <div style={{ position: "absolute", left: R - 16, top: 92, width: 2, height: EH - 190, background: LINE }} />
        {lab(R, 92, "Add Reminders")}
        {lab(R, 122, "Time Before")}{box(R, 144, 320, f >= T.rem && f < T.mNotif, ok(T.rem + 4) ? "15 minutes before" : "", "Reminder 15 minutes before", true)}
        {lab(R, 202, "Methods (max:3)")}
        {METH.map((m, i) => <React.Fragment key={m}>{chip(R + METHX[i], 224, m, meth[i])}</React.Fragment>)}
        {lab(R, 280, "Chat Groups (max:3)")}{box(R, 302, 680, false, ok(T.mCrowd + 6) ? "👥 Phlebotomy — Evening" : "", "Select Chat Groups (max:3)", true)}
        {lab(R, 366, "Invitations/Add Guests")}
        {box(R, 388, 680, f >= T.guests && f < T.save, ok(T.pickSession + 4) ? "Phlebotomy Tech — Fall 2026 · Evening session (22)" : ok(T.guests + 4) ? typed(f, T.guests + 6, "Evening", 0.4) : "", "Search users, programs, sessions")}
        {ok(T.pickSession + 4) && <div style={{ position: "absolute", left: R, top: 446, display: "flex", gap: 8, flexWrap: "wrap", width: 680 }}>{["JM", "AK", "LT", "RS", "NB", "CW", "DP", "EV"].map((t, i) => <span key={t} style={{ opacity: pr(f, T.pickSession + 4 + i * 2, 6) }}><Avatar t={t} s={36} c1="#16A34A" c2="#15803D" /></span>)}<span style={{ fontSize: 14, fontWeight: 800, color: GRAY, alignSelf: "center" }}>+14 guests</span></div>}
        {lab(R, 504, "Bootcamps/Course Link")}{box(R, 526, 680, false, ok(T.pickSession + 10) ? "Phlebotomy Tech — Fall 2026" : "", "Select", true)}
        <Btn x={EW - 28 - 160 - 12 - 110} y={EH - 66} w={110} label="Cancel" fs={16} />
        <Btn x={EW - 28 - 160} y={EH - 66} w={160} label="Save & Close" primary fs={16} press={f >= T.save && f < T.save + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── learner ─────────
const DetailsCard: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.lOpen + 2 || f >= T.todo) return null;
  const going = f >= T.lYes + 2;
  const proposed = f >= T.proposeOk;
  const prop = f >= T.lPropose + 2 && f < T.proposeOk + 4;
  return (
    <div style={{ position: "absolute", left: 640, top: 90, width: 680, height: 470, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 30px 80px #0004", padding: 26, boxSizing: "border-box", fontFamily: FONT, opacity: pr(f, T.lOpen + 2, 10), zIndex: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: "#DC2626" }} /><span style={{ fontSize: 24, fontWeight: 900, color: INK }}>Venipuncture lab — evening</span></div>
      <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: GRAY }}>{proposed ? "Thu, Oct 22 · 6:00 – 8:00 PM" : "Tue, Oct 20 · 6:00 – 8:00 PM"} · Occurs every Tue, Thu till - Dec 17</div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 15, fontWeight: 800, color: INK }}>Join with</span><span style={{ padding: "8px 14px", borderRadius: 10, background: "#2D8CFF", color: "#fff", fontSize: 14, fontWeight: 800 }}>Zoom</span><span style={{ fontSize: 13, fontWeight: 600, color: GRAY }}>zoom.us/j/84213…</span></div>
      <div style={{ marginTop: 18, fontSize: 15, fontWeight: 900, color: INK }}>Meeting Agenda/Follow up/Action Item</div>
      <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: "#374151" }}>Bring gloves and badge. Pairs rotate every 20 min.</div>
      <div style={{ marginTop: 14, fontSize: 15, fontWeight: 900, color: INK }}>Reminder</div>
      <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: "#374151" }}>15 minutes before · Notification, Email, Chat Crowds</div>
      <div style={{ marginTop: 14, fontSize: 15, fontWeight: 900, color: INK }}>Invited Guests</div>
      <div style={{ marginTop: 6, display: "flex", gap: 6 }}><Avatar t="AO" s={32} /><span style={{ fontSize: 13, fontWeight: 700, color: GRAY, alignSelf: "center" }}>Amara Okoye (Organizer)</span>{["JM", "AK", "LT", "RS"].map((t) => <Avatar key={t} t={t} s={32} c1="#16A34A" c2="#15803D" />)}<span style={{ alignSelf: "center", fontSize: 13, fontWeight: 700, color: GRAY }}>+18</span></div>
      <div style={{ position: "absolute", left: 26, bottom: 26, right: 26, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: INK }}>Going?</span>
        {["Yes", "No"].map((t) => <span key={t} style={{ padding: "9px 18px", borderRadius: 10, background: t === "Yes" && going && !proposed ? "#16A34A" : "#fff", color: t === "Yes" && going && !proposed ? "#fff" : INK, border: t === "Yes" && going && !proposed ? "none" : `2px solid ${LINE}`, fontSize: 15, fontWeight: 800 }}>{t}</span>)}
        <span style={{ marginLeft: "auto", padding: "9px 14px", borderRadius: 10, border: `2px solid ${prop || proposed ? "#7C3AED" : LINE}`, color: "#7C3AED", fontSize: 14, fontWeight: 800 }}>{proposed ? "Proposed New Time ✓" : "Propose a new time for the event"}</span>
      </div>
      {prop && (
        <div style={{ position: "absolute", left: 80, top: 160, width: 520, padding: 22, borderRadius: 16, background: "#fff", border: `2px solid #DDD6FE`, boxShadow: "0 24px 60px #0004", opacity: pr(f, T.lPropose + 2, 8) }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: INK }}>Propose a new time for the event</div>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}><span style={{ flex: 1, height: 44, borderRadius: 10, border: `2px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700 }}>Thu, Oct 22 · 7:00 PM</span><span style={{ width: 110, height: 44, borderRadius: 10, background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>Send</span></div>
        </div>
      )}
    </div>
  );
};
const TASKS: [string, string, string][] = [["Read order-of-draw chart", "High", "Oct 20"], ["Practice tourniquet on arm model", "Medium", "Oct 21"], ["Upload CPR card", "Low", "Oct 23"]];
const TodoBoard: React.FC<{ f: number }> = ({ f }) => {
  const col = (i: number) => (i === 0 ? (f >= T.drag2 + 20 ? 2 : f >= T.drag1 + 20 ? 1 : 0) : i === 1 ? 1 : 0);
  const cols = ["Todo", "In Progress", "Completed", "Cancelled"];
  const CW = 255;
  return (
    <div style={{ position: "absolute", left: GX0, top: 76, width: GW0, height: 690, fontFamily: FONT, opacity: pr(f, T.todo, 10) }}>
      {cols.map((c, i) => <div key={c} style={{ position: "absolute", left: i * (CW + 13), top: 0, width: CW, height: 680, borderRadius: 14, background: "#F3F4F6", padding: 12, boxSizing: "border-box" }}><div style={{ fontSize: 16, fontWeight: 900, color: INK }}>{c}</div>{i === 3 && <div style={{ marginTop: 40, textAlign: "center", fontSize: 13, fontWeight: 700, color: GRAY }}>Drop tasks here</div>}</div>)}
      {TASKS.map(([t, p, d], k) => {
        const c = col(k);
        const idx = TASKS.filter((_, j) => j < k && col(j) === c).length;
        const moving = k === 0 && ((f >= T.drag1 && f < T.drag1 + 20) || (f >= T.drag2 && f < T.drag2 + 20));
        const from = k === 0 && f >= T.drag2 ? 1 : 0, to = k === 0 && f >= T.drag2 ? 2 : 1;
        const prog = moving ? lin(f, f >= T.drag2 ? T.drag2 : T.drag1, (f >= T.drag2 ? T.drag2 : T.drag1) + 20) : 0;
        const x = moving ? 12 + (from + (to - from) * prog) * (CW + 13) : 12 + c * (CW + 13);
        return (
          <div key={t} style={{ position: "absolute", left: x, top: 44 + idx * 120 + (moving ? -6 : 0), width: CW - 24, height: 108, borderRadius: 12, background: "#fff", border: `2px solid ${moving ? BLUE : LINE}`, boxShadow: moving ? "0 18px 40px #0003" : "none", padding: 12, boxSizing: "border-box", transform: moving ? "rotate(-2deg)" : "none", zIndex: moving ? 3 : 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: INK }}>{t}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}><Badge t={`Priority: ${p}`} c={p === "High" ? "#B91C1C" : p === "Medium" ? "#B45309" : "#15803D"} bg={p === "High" ? "#FEE2E2" : p === "Medium" ? "#FEF3C7" : "#DCFCE7"} fs={11} /></div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: GRAY }}>Due {d}</div>
          </div>
        );
      })}
    </div>
  );
};
const LearnerCal: React.FC<{ f: number }> = ({ f }) => {
  const todo = f >= T.todo;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <Sidebar f={f} learner />
      <Toolbar f={f} view="Week" />
      {todo ? <TodoBoard f={f} /> : <WeekGrid f={f} events={[...BASE_EV.slice(0, 1), ...LAB.map((e, i) => (i === 1 && f >= T.proposeOk ? { ...e, c: "#7C3AED" } : e))]} hl={f >= T.lOpen - 20 && f < T.lOpen + 4 ? 1 : undefined} />}
      <DetailsCard f={f} />
    </div>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.clickMenu - 10, 880, 540, 1.04], [T.views, 1000, 470, 1.08], [T.search, 1100, 470, 1.08],
  [S.d2, 960, 540, 1.0], [T.typeName, 860, 440, 1.1], [S.d3, 860, 540, 1.1], [S.d4, 860, 620, 1.08], [S.d5, 1100, 460, 1.1], [S.d6, 1100, 560, 1.08],
  [T.save + 10, 960, 540, 1.0], [T.learner, 960, 540, 1.0], [T.learner + 40, 960, 600, 1.06], [T.lOpen + 10, 1100, 540, 1.06],
  [T.todo, 960, 540, 1.0], [T.drag1, 1000, 520, 1.06], [T.back, 960, 540, 1.0], [T.fAccepted, 880, 520, 1.06], [T.fProposed, 1000, 600, 1.06], [PAY_START, 960, 540, 1.0],
]).map(calmK);
const viewPt = (i: number) => MA(GX0 + 74 + 24 + 170 + 10 + 20 + 28 + i * 64, 38);
const L = 28, R = 760;
const evPt = (e: Ev): [number, number] => MA(colX(e.d) + COLW / 2, rowYh(e.h0) + 30);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Calendar", "Attendance")],
  [T.views, ...viewPt(0)], [T.clickMonth, ...viewPt(2)], [T.clickWeek, ...viewPt(1)],
  [T.search, ...MA(GX0 + 700, 38)],
  [T.clickAdd, ...MA(GX0 + GW0 - 60, 38)],
  [T.clickEvent, ...EP(214, 34)],
  [T.typeName, ...EP(L + 350, 136)], [T.typePurpose, ...EP(L + 350, 214)],
  [T.date, ...EP(L + 120, 292)], [T.repeat, ...EP(L + 120, 374)], [T.tue, ...EP(L + 256 + 64 + 29, 374)], [T.thu, ...EP(L + 256 + 3 * 64 + 29, 374)],
  [T.endDate, ...EP(L + 150, 454)], [T.loc, ...EP(L + 70, 534)], [T.color, ...EP(L + 3 * 46 + 17, 613)],
  [T.rem, ...EP(R + 160, 166)], [T.mNotif, ...EP(R + METHX[2] + 55, 242)], [T.mEmail, ...EP(R + METHX[4] + 30, 242)], [T.mCrowd, ...EP(R + METHX[1] + 60, 242)],
  [T.guests, ...EP(R + 340, 410)], [T.pickSession, ...EP(R + 340, 410)],
  [T.save, ...EP(EW - 108, EH - 44)],
  [T.learner + 20, 1500, 860], [T.learner + 60, ...evPt(LAB[0])],
  [T.lOpen, ...evPt(LAB[0])],
  [T.lYes, ...MA(640 + 26 + 70 + 30, 90 + 470 - 46)],
  [T.lPropose, ...MA(640 + 680 - 26 - 140, 90 + 470 - 46)],
  [T.proposeOk, ...MA(640 + 80 + 22 + 520 - 44 - 55, 90 + 160 + 22 + 30 + 34)],
  [T.drag1, ...MA(GX0 + 12 + 115, 76 + 44 + 54)], [T.drag1 + 20, ...MA(GX0 + 12 + 268 + 115, 76 + 44 + 54)],
  [T.drag2, ...MA(GX0 + 12 + 268 + 115, 76 + 44 + 54)], [T.drag2 + 20, ...MA(GX0 + 12 + 536 + 115, 76 + 44 + 54)],
  [T.back + 10, ...MA(700, 400)],
  [T.fAccepted, ...MA(110, 14 + 22 + 3 * 28 + 18 + 22 + 17)], [T.fPending, ...MA(110, 14 + 22 + 3 * 28 + 18 + 22 + 42 + 17)], [T.fProposed, ...MA(110, 14 + 22 + 3 * 28 + 18 + 22 + 84 + 17)],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "Calendar views and search" },
  { at: S.d2, to: S.d3, label: "Name and purpose" },
  { at: S.d3, to: S.d4, label: "Repeat weekly" },
  { at: S.d4, to: S.d5, label: "Zoom and color" },
  { at: S.d5, to: S.d6, label: "Reminders" },
  { at: S.d6, to: T.learner, label: "Invite guests" },
  { at: T.learner, to: S.d9, label: "Learner joins and replies" },
  { at: S.d9, to: T.todo, label: "Propose a new time" },
  { at: T.todo, to: T.back, label: "Personal to-do board" },
  { at: T.back, to: PAY_START, label: "Who's coming" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = f >= T.learner && f < T.back;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={T.learner} url={f >= T.todo ? "learner.brightvein.example.com/calendar/to-do" : "learner.brightvein.example.com/calendar"} learner who="Jordan" prog="Phlebotomy Tech — Fall 2026" active={f >= T.todo ? "To-Do" : "Events"} openGroup="Calendar" main={<LearnerCal f={f} />}
            overlay={<Toast f={f} at={T.lYes + 3} text="Invitation status updated successfully" d={50} />} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} branch="BrightVein — Atlanta" url="academy.skillbnk.com/calendar" active={f >= T.clickMenu ? "Calendar" : "Dashboard"} openGroup="Attendance" main={<BranchCal f={f} />}
            overlay={<><EventModal f={f} /><Toast f={f} at={T.save + 3} text="Successfully added a new event" d={60} /></>} />
        )}
        <Scribble f={f} at={T.endDate + 20} d={16} out={T.loc - 4} kind="under" x={EP(L + 316 + 180, 0)[0]} y={EP(0, 462)[1]} w={360} h={20} seed={8} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

// ───────── hook (story: the event that won't sit still) ─────────
const HK = { amara: cue("h0", "amara"), head: cue("h0", "head"), inbox: cue("h0", "inbox"), week: cue("h0", "week"), wrong: cue("h0", "wrong") };
const CGX = 360, CGY = 250, CCW = 230, CRH = 90;
const DAYS5 = ["MON", "TUE", "WED", "THU", "FRI"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.week - 6, HK.wrong + 20);
  // ghost event jumps between guesses while "class times live in her head"
  const guesses: [number, number][] = [[1, 2], [1, 3], [2, 2], [3, 3], [1, 2]];
  const gi = f >= HK.head ? Math.floor((f - HK.head) / 9) % guesses.length : 0;
  const [gd, gr] = f >= HK.week ? [1, 2] : guesses[gi];
  const jitter = f >= HK.head && f < HK.week ? Math.sin(f * 2.3) * 4 : 0;
  const zoom = lin(f, HK.week, HK.week + 18);
  const mails = ["Zoom link", "Re: Zoom link", "NEW Zoom link", "Fwd: link v3", "USE THIS ONE", "Re: which link?"];
  const dotX = lin(f, HK.week + 14, HK.wrong + 2);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 80, opacity: pr(f, HK.amara - 6, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#F87171" }}>BRIGHTVEIN PHLEBOTOMY SCHOOL</div>
          <div style={{ marginTop: 6, fontSize: 60, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.amara - 4, "When is class, actually?", 0.8)}</div>
        </div>
        {/* paper week grid */}
        <div style={{ position: "absolute", left: CGX, top: CGY, width: CCW * 5, height: CRH * 5 + 50, borderRadius: 18, background: "#F8FAFC", boxShadow: "0 30px 80px #000A", overflow: "hidden", opacity: pr(f, HK.amara, 12), transform: `scale(${1 + zoom * 0.08})`, transformOrigin: `${CCW * 2.5}px 60%` }}>
          {DAYS5.map((d, i) => <div key={d} style={{ position: "absolute", left: i * CCW, top: 0, width: CCW, height: 50, borderLeft: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: zoom > 0 && i === 2 ? "#DC2626" : "#334155", background: zoom > 0 && i === 2 ? "#FEE2E2" : "#fff" }}>{d}</div>)}
          {["4 PM", "5 PM", "6 PM", "7 PM", "8 PM"].map((h, r) => <div key={h} style={{ position: "absolute", left: 0, top: 50 + r * CRH, width: CCW * 5, height: CRH, borderTop: "1px solid #E2E8F0", fontSize: 14, fontWeight: 700, color: "#94A3B8", padding: 6, boxSizing: "border-box" }}>{h}</div>)}
          {/* the event that won't settle */}
          {f >= HK.head - 4 && (
            <>
              <div style={{ position: "absolute", left: gd * CCW + 10 + jitter + 6, top: 50 + gr * CRH + 8, width: CCW - 20, height: CRH * 2 - 16, borderRadius: 10, background: "#06B6D455", opacity: f < HK.week ? 0.7 : 0 }} />
              <div style={{ position: "absolute", left: gd * CCW + 10 + jitter, top: 50 + gr * CRH + 8, width: CCW - 20, height: CRH * 2 - 16, borderRadius: 10, background: "#FEE2E2", border: "3px dashed #DC2626", padding: 10, boxSizing: "border-box", fontSize: 18, fontWeight: 900, color: "#991B1B" }}>Venipuncture lab<div style={{ fontSize: 15, fontWeight: 700 }}>{["6 pm?", "7 pm?", "Wed??", "Thu 7?", "6 pm?"][gi]}</div></div>
            </>
          )}
          {/* wrong-day arrival on Wednesday */}
          {zoom > 0 && (
            <>
              <div style={{ position: "absolute", left: 2 * CCW + 10, top: 50 + 2 * CRH + 8, width: CCW - 20, height: CRH * 2 - 16, borderRadius: 10, border: "3px solid #334155", background: "repeating-linear-gradient(45deg,#F1F5F9 0 12px,#E2E8F0 12px 24px)", opacity: zoom }} />
              <div style={{ position: "absolute", left: 2 * CCW + 30 + dotX * 120, top: 50 + 2 * CRH + 60, width: 30, height: 30, borderRadius: 15, background: "#16A34A", boxShadow: "0 0 0 6px #16A34A44" }} />
              <div style={{ position: "absolute", left: 2 * CCW + 16, top: 50 + 4 * CRH - 24, fontSize: 15, fontWeight: 900, color: "#334155", opacity: pr(f, HK.wrong - 6, 8) }}>empty room</div>
              <svg width={CCW * 5} height={CRH * 5 + 50} style={{ position: "absolute", inset: 0 }}><path d={`M ${2 * CCW + 20} ${50 + 2 * CRH} C ${1.7 * CCW} ${50 + 1.2 * CRH}, ${1.5 * CCW} ${50 + 1.2 * CRH}, ${1.4 * CCW} ${50 + 2 * CRH + 10}`} fill="none" stroke="#DC2626" strokeWidth={5} strokeDasharray="400" strokeDashoffset={400 * (1 - lin(f, HK.wrong - 4, HK.wrong + 12))} /></svg>
              <div style={{ position: "absolute", left: 1 * CCW + 16, top: 50 + 1 * CRH + 10, fontSize: 16, fontWeight: 900, color: "#DC2626", opacity: pr(f, HK.wrong + 8, 8) }}>class was Tuesday</div>
            </>
          )}
        </div>
        {/* inbox of Zoom links stacking up */}
        {f >= HK.inbox - 4 && mails.map((m, i) => {
          const at = HK.inbox + i * 5;
          const k = pr(f, at, 12);
          return (
            <div key={m} style={{ position: "absolute", left: 1440 - (1 - k) * 600, top: 300 + i * 18 - (1 - k) * 200, width: 300, height: 170, transform: `rotate(${(i % 2 ? 3 : -3) * k}deg)`, opacity: k * (1 - 0.5 * zoom) }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "#E2E8F0", border: "2px solid #94A3B8" }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderLeft: "150px solid transparent", borderRight: "150px solid transparent", borderTop: "80px solid #CBD5E1" }} />
              <div style={{ position: "absolute", left: 16, bottom: 16, fontSize: 18, fontWeight: 900, color: "#0F172A" }}>{m}</div>
            </div>
          );
        })}
        {f >= HK.inbox && <div style={{ position: "absolute", left: 1440, top: 250, fontSize: 22, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.inbox + 20, 8) * (1 - zoom) }}>{Math.min(6, Math.floor((f - HK.inbox) / 5) + 1)} different links</div>}
      </Stage>
      <Stamp f={f} at={HK.wrong + 6} x={1540} y={760} text="WRONG DAY" />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.amara, "Amara runs a phlebotomy school."], [HK.head, "Class times live in her head…", "in her head"], [HK.inbox, "…Zoom links live in her inbox…", "in her inbox"], [HK.week, "…and every week, someone shows up on the wrong day.", "wrong day"]]} />
    </AbsoluteFill>
  );
};

const PY = { one: cue("p12", "calendar"), answer: cue("p12", "answer"), wrong: cue("p12", "wrong") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 460, top: 160, width: 1000, height: 380, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 28, boxSizing: "border-box", opacity: pr(f, PY.one - 8, 12) }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>🗓 Venipuncture lab — every Tue & Thu, 6 PM</div>
      <div style={{ marginTop: 16, display: "flex", gap: 12 }}><Badge t="Zoom link attached" c="#1D4ED8" bg="#DBEAFE" fs={16} /><Badge t="Reminder 15 min before" c="#92400E" bg="#FEF3C7" fs={16} /></div>
      <div style={{ marginTop: 26, display: "flex", gap: 12 }}>{[["Accepted", 19, "#16A34A"], ["Pending", 1, "#F59E0B"], ["Proposed New Time", 2, "#7C3AED"]].map(([t, n, c]) => <div key={t as string} style={{ flex: 1, padding: 18, borderRadius: 16, background: (c as string) + "18", opacity: pr(f, PY.answer + 2, 10) }}><div style={{ fontSize: 36, fontWeight: 900, color: c as string }}>{n as number}</div><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{t as string}</div></div>)}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 620, width: 1920, textAlign: "center", fontSize: 42, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.wrong - 6, 14) }}>Nobody shows up on the wrong day</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.inbox, "riser", 0.25); add(HK.wrong, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 12; i++) add(T.typeName + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.save + 4, "chime", 0.5); add(T.lYes + 3, "pop", 0.4); add(T.proposeOk + 2, "pop", 0.35); add(T.drag1 + 20, "pop", 0.3); add(T.drag2 + 20, "ding", 0.35);
  add(T.learner, "whoosh", 0.35); add(T.todo, "whoosh", 0.25); add(T.back, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PY.wrong, "chime", 0.5);
  return a;
})();

export const CalendarStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="calendarstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.back]} />;
};
