import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx } from "./storyShell";

/**
 * AvailabilityStoryVideo — DEEP (sheet serial 44). Story: Elena Brooks, CareFirst CNA Skills Lab (fictional).
 * Verified in code: libs/shared/calendar availability (Schedule, WeekDay, OverrideModal, AddAvailability) + en.ts CalendarAddAvailability:
 * "Create New Schedule", "Schedule name", "7-day schedule", SUN..SAT, time range "to", "Unavailable", "Copy to Other Days",
 * "Date-Specific Hours", "Adjust availability for specific dates with different hours", "Override your availability for specific dates…",
 * "Add Date Specific Hours", "Date Specific Schedule", "Select the date(s) you want to assign specific hours", From / To, Apply,
 * Save & Close, "Added new availability successfully". EventForm: Invitations/Add Guests, clicking a guest shows their "Availability"
 * for that weekday (useFindUserAvailabilityQuery) or "No available time found". Learner: Calendar → Availability, Events, Going? Yes.
 * Voice: python3 generate-voice-story.py src/AvailabilityStoryVideo.tsx public/availstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 309,
  d1: 210,
  d2: 121,
  d3: 240,
  d4: 164,
  d5: 231,
  d6: 128,
  d7: 224,
  d8: 187,
  d9: 228,
  d10: 173,
  d11: 229,
  p12: 189,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 15, 26, 35, 40, 55, 63, 94, 98, 109, 125, 132, 141, 145, 148, 157, 164, 197, 201, 212, 222, 228, 248, 258, 258, 262, 267, 274],
  d1: [2, 14, 39, 43, 51, 61, 102, 103, 114, 126, 139, 145, 153, 163],
  d2: [2, 15, 29, 34, 40, 49, 63, 69, 79, 86],
  d3: [2, 10, 22, 30, 58, 60, 67, 86, 93, 98, 129, 141, 151, 183, 205],
  d4: [2, 15, 27, 52, 56, 63, 70, 86, 89, 95, 100, 105, 114, 127, 136],
  d5: [2, 16, 40, 45, 49, 52, 84, 84, 95, 108, 123, 133, 141, 145, 164, 169, 178, 185],
  d6: [2, 19, 32, 61, 66, 79, 99],
  d7: [2, 17, 21, 27, 58, 64, 73, 78, 85, 97, 108, 115, 141, 144, 148, 171, 173, 180, 186, 194, 199],
  d8: [2, 14, 21, 25, 33, 44, 72, 78, 87, 94, 100, 107, 117, 132, 141, 149, 155, 165],
  d9: [2, 18, 25, 34, 45, 51, 63, 72, 76, 102, 103, 107, 133, 138, 143, 159, 175, 181, 190, 197],
  d10: [2, 13, 33, 39, 46, 60, 73, 84, 96, 118, 122, 126, 135, 141],
  d11: [2, 12, 28, 43, 45, 56, 63, 75, 78, 84, 112, 114, 118, 124, 129, 133, 143, 179, 197],
  p12: [2, 18, 28, 57, 60, 69, 100, 105, 114, 126, 134, 138, 145, 154],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Elena runs a nursing assistant skills lab. Thirty students each need a one on one skills check. That's thirty text threads, just to find a time that works.",
  d1: "In skillbank, it starts with availability. Elena opens Calendar, and goes to My Availability.",
  d2: "She creates a new schedule, and names it lab hours.",
  d3: "Her seven day schedule: Monday to Thursday, nine to five. Friday, mornings only. Weekends, unavailable.",
  d4: "Tuesday matches Monday, so she copies Monday's hours to the other days in one click.",
  d5: "Next Wednesday she's at a conference. Date specific hours override just that one day, without touching the rest.",
  d6: "Save and close. Her availability is set.",
  d7: "Now, the learner side. Jamal sets his own availability the same way. He works mornings, so his hours start at two.",
  d8: "Back in the training provider portal, Elena adds a skills check event, and invites Jamal as a guest.",
  d9: "Clicking his name shows his availability for that day: two to six. She books three o'clock, inside both their hours.",
  d10: "On Sunday, the calendar says no available time found, so she doesn't even try.",
  d11: "On Jamal's side, the invitation is already in his calendar, at a time he can actually make. Going? Yes.",
  p12: "Thirty skills checks, zero text threads. Everyone books inside the hours they really have.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "calendar", -6),
  clickMyAvail: cue("d1", "availability", -6),
  clickCreate: cue("d2", "creates", -4),
  typeName: cue("d2", "names", -2),
  okName: cue("d2", "hours", 6),
  mon: cue("d3", "monday", -2),
  fri: cue("d3", "friday", -2),
  wknd: cue("d3", "weekends", -2),
  clickCopy: cue("d4", "copies", -4),
  pickDays: cue("d4", "other", -2),
  applyCopy: cue("d4", "click", 0),
  clickDS: cue("d5", "date", -4),
  pickDate: cue("d5", "override", -4),
  dsFrom: cue("d5", "day", -4),
  dsApply: cue("d5", "touching", 0),
  save: cue("d6", "save", -2),
  learner: cue("d7", "learner", -8),
  lMon: cue("d7", "works", -4),
  lSave: cue("d7", "two", 10),
  back: S.d8,
  clickAdd: cue("d8", "adds", -4),
  typeName2: cue("d8", "event", -2),
  guest: cue("d8", "invites", -2),
  clickGuest: cue("d9", "clicking", -2),
  pickTime: cue("d9", "books", -2),
  sunday: cue("d10", "sunday", -4),
  saveEv: cue("d10", "try", 4),
  learner2: S.d11,
  lOpen: cue("d11", "invitation", -2),
  lYes: cue("d11", "yes", -4),
};
const CLICKS = [T.clickMenu, T.clickMyAvail, T.clickCreate, T.typeName, T.okName, T.mon, T.fri, T.wknd, T.clickCopy, T.pickDays, T.applyCopy, T.clickDS, T.pickDate, T.dsFrom, T.dsApply, T.save, T.lMon, T.lSave, T.clickAdd, T.typeName2, T.guest, T.clickGuest, T.pickTime, T.sunday, T.saveEv, T.lOpen, T.lYes];

// ───────── availability page (main coords 1350 x 776) ─────────
const DAYS7 = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const RY = (i: number) => 160 + i * 74;
type Row = { on: boolean; from: string; to: string };
const lab = (x: number, y: number, t: string, s = 14) => <div style={{ position: "absolute", left: x, top: y, fontSize: s, fontWeight: 800, color: "#374151" }}>{t}</div>;
const tbox = (x: number, y: number, w: number, v: string, on?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 42, borderRadius: 10, border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: INK, boxSizing: "border-box" }}>{v}</div>;
const elenaRows = (f: number): Row[] => {
  const base = (on: boolean, a = "9:00 AM", b = "5:00 PM"): Row => ({ on, from: a, to: b });
  const monOn = f >= T.mon + 4;
  const copied = f >= T.applyCopy + 2;
  return [
    base(false),
    monOn ? base(true) : { on: false, from: "", to: "" },
    copied ? base(true) : { on: false, from: "", to: "" },
    copied ? base(true) : { on: false, from: "", to: "" },
    copied ? base(true) : { on: false, from: "", to: "" },
    f >= T.fri + 4 ? base(true, "9:00 AM", "12:00 PM") : { on: false, from: "", to: "" },
    base(false),
  ];
};
const jamalRows = (f: number): Row[] => DAYS7.map((_, i) => (i === 0 ? { on: false, from: "", to: "" } : { on: f >= T.lMon + 4 + i * 2, from: "2:00 PM", to: "6:00 PM" }));
const AvailPage: React.FC<{ f: number; rows: Row[]; name: string; at: number; ds?: boolean; hlRow?: number; learner?: boolean }> = ({ f, rows, name, at, ds, hlRow, learner }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC", opacity: pr(f, at, 10) }}>
    <div style={{ position: "absolute", left: 30, top: 22, fontSize: 30, fontWeight: 900, color: INK }}>My Availability</div>
    <div style={{ position: "absolute", left: 30, top: 66, display: "flex", gap: 8 }}>
      <span style={{ padding: "8px 16px", borderRadius: 10, background: BLUE, color: "#fff", fontSize: 15, fontWeight: 800 }}>{name}</span>
      {!learner && <span style={{ padding: "8px 16px", borderRadius: 10, border: `2px solid ${LINE}`, fontSize: 15, fontWeight: 800, color: GRAY }}>＋ Create New</span>}
    </div>
    <div style={{ position: "absolute", left: 30, top: 120, width: 780, height: 640, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}` }}>
      <div style={{ position: "absolute", left: 20, top: 14, fontSize: 18, fontWeight: 900, color: INK }}>7-day schedule</div>
      {DAYS7.map((d, i) => {
        const r = rows[i];
        return (
          <div key={d} style={{ position: "absolute", left: 20, top: RY(i) - 120 - 6, width: 740, height: 62, borderRadius: 12, background: hlRow === i ? "#EEF2FF" : "transparent", border: hlRow === i ? `2px solid ${BLUE}` : "2px solid transparent", boxSizing: "border-box" }}>
            <span style={{ position: "absolute", left: 12, top: 18, width: 22, height: 22, borderRadius: 6, background: r.on ? BLUE : "#fff", border: `2px solid ${r.on ? BLUE : "#9CA3AF"}`, color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.on ? "✓" : ""}</span>
            <span style={{ position: "absolute", left: 50, top: 18, fontSize: 17, fontWeight: 900, color: INK }}>{d}</span>
            {r.on ? (
              <>
                <div style={{ position: "absolute", left: 120, top: 8 }}>{tbox(0, 0, 150, r.from)}</div>
                <span style={{ position: "absolute", left: 284, top: 18, fontSize: 15, fontWeight: 700, color: GRAY }}>to</span>
                <div style={{ position: "absolute", left: 312, top: 8 }}>{tbox(0, 0, 150, r.to)}</div>
                <span style={{ position: "absolute", left: 480, top: 16, fontSize: 18, color: GRAY }}>＋</span>
                {!learner && i === 1 && <span style={{ position: "absolute", left: 520, top: 14, padding: "6px 12px", borderRadius: 8, border: `2px solid ${f >= T.clickCopy - 6 && f < T.applyCopy + 6 ? BLUE : LINE}`, fontSize: 13, fontWeight: 800, color: INK, background: "#fff" }}>⧉ Copy to Other Days</span>}
              </>
            ) : <span style={{ position: "absolute", left: 120, top: 18, fontSize: 16, fontWeight: 700, color: "#9CA3AF" }}>Unavailable</span>}
          </div>
        );
      })}
    </div>
    {!learner && (
      <div style={{ position: "absolute", left: 830, top: 120, width: 490, height: 640, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, padding: 20, boxSizing: "border-box" }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: INK }}>Date-Specific Hours</div>
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: GRAY, lineHeight: 1.45 }}>Override your availability for specific dates when your hours differ from your regular weekly hours.</div>
        <div style={{ marginTop: 16, height: 46, borderRadius: 11, border: `2px solid ${f >= T.clickDS - 6 && f < T.clickDS + 6 ? BLUE : LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: INK }}>＋ Add Date Specific Hours</div>
        {ds && <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "#FEF3C7", border: "2px solid #FDE68A", opacity: pr(f, T.dsApply + 2, 10) }}><div style={{ fontSize: 16, fontWeight: 900, color: "#92400E" }}>Oct 28, 2026</div><div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>Unavailable · conference</div></div>}
      </div>
    )}
  </div>
);
// create schedule modal
const CreateModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickCreate + 2 || f > T.okName + 12) return null;
  const o = pr(f, T.clickCreate + 2, 10) * (1 - lin(f, T.okName + 2, T.okName + 12));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.45 * o})` }} />
      <div style={{ position: "absolute", left: 520, top: 240, width: 560, height: 260, borderRadius: 18, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT, padding: 26, boxSizing: "border-box" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>Create New Schedule</div>
        <div style={{ marginTop: 18, fontSize: 14, fontWeight: 800, color: "#374151" }}>Schedule name</div>
        <div style={{ marginTop: 8, height: 46, borderRadius: 11, border: `2px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, fontWeight: 700, color: INK }}>{typed(f, T.typeName + 2, "Lab hours", 0.5)}</div>
        <div style={{ position: "absolute", right: 26, bottom: 22, width: 110, height: 48 }}><Btn x={0} y={0} w={110} label="Create" primary fs={16} press={f >= T.okName && f < T.okName + 6 ? 1 : 0} /></div>
      </div>
    </>
  );
};
const CopyModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickCopy + 2 || f > T.applyCopy + 10) return null;
  const o = pr(f, T.clickCopy + 2, 8) * (1 - lin(f, T.applyCopy, T.applyCopy + 10));
  const ticked = (i: number) => i >= 2 && i <= 4 && f >= T.pickDays + (i - 2) * 6;
  return (
    <div style={{ position: "absolute", left: 250 + 30 + 20 + 520, top: 60 + 120 + RY(1) - 120 + 50, width: 260, padding: 14, borderRadius: 14, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0005", opacity: o, fontFamily: FONT, zIndex: 6 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: GRAY }}>Copy to Other Days</div>
      {DAYS7.map((d, i) => <div key={d} style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 800, color: INK }}><span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${ticked(i) || i === 1 ? BLUE : "#9CA3AF"}`, background: ticked(i) || i === 1 ? BLUE : "#fff", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{ticked(i) || i === 1 ? "✓" : ""}</span>{d}</div>)}
      <div style={{ marginTop: 10, height: 38, borderRadius: 10, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>Apply</div>
    </div>
  );
};
const DSX = 420, DSY = 70, DSW = 760, DSH = 680;
const DSModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickDS + 2 || f > T.dsApply + 10) return null;
  const o = pr(f, T.clickDS + 2, 10) * (1 - lin(f, T.dsApply, T.dsApply + 10));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.45 * o})` }} />
      <div style={{ position: "absolute", left: DSX, top: DSY, width: DSW, height: DSH, borderRadius: 18, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT, padding: 26, boxSizing: "border-box" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>Date Specific Schedule</div>
        <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600, color: GRAY }}>Select the date(s) you want to assign specific hours</div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 900, color: INK, textAlign: "center" }}>October 2026</div>
        <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {DAYS7.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 900, color: GRAY }}>{d}</div>)}
          {Array.from({ length: 35 }).map((_, k) => { const day = k - 3; const sel = day === 28 && f >= T.pickDate; return <div key={k} style={{ height: 44, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, background: sel ? BLUE : "transparent", color: sel ? "#fff" : day < 1 || day > 31 ? "#D1D5DB" : INK }}>{day < 1 ? 30 + day : day > 31 ? day - 31 : day}</div>; })}
        </div>
        <div style={{ position: "absolute", left: 26, top: 470, fontSize: 15, fontWeight: 900, color: INK }}>Wed, Oct 28</div>
        <div style={{ position: "absolute", left: 26, top: 500, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 700, color: GRAY }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${f >= T.dsFrom ? "#B45309" : "#9CA3AF"}`, background: f >= T.dsFrom ? "#B45309" : "#fff" }} /> {f >= T.dsFrom ? <b style={{ color: "#B45309" }}>Unavailable all day</b> : "Available"}
        </div>
        <div style={{ position: "absolute", left: 26, top: 520, opacity: f >= T.dsFrom ? 0 : 1 }}>{lab(0, 40, "From")}{tbox(0, 62, 150, "9:00 AM")}{lab(180, 40, "To")}{tbox(180, 62, 150, "5:00 PM")}</div>
        <div style={{ position: "absolute", right: 26, bottom: 22, width: 110, height: 48 }}><Btn x={0} y={0} w={110} label="Apply" primary fs={16} press={f >= T.dsApply && f < T.dsApply + 6 ? 1 : 0} /></div>
      </div>
    </>
  );
};

// ───────── event with guest availability (branch, after) ─────────
const EX = 60, EY = 120, EW = 1480, EH = 520;
const EP = (x: number, y: number) => CT(EX + x, EY + y);
const EventModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickAdd + 3 || f > T.saveEv + 12) return null;
  const inn = Math.min(1, sp(f, T.clickAdd + 4, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, T.saveEv + 2, T.saveEv + 12));
  const sun = f >= T.sunday;
  const booked = f >= T.pickTime + 2;
  const slots = ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: EX, top: EY + (1 - inn) * 30, width: EW, height: EH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 20, fontSize: 24, fontWeight: 900, color: INK }}>Add New</div>
        <div style={{ position: "absolute", left: 28, top: 58, fontSize: 14, fontWeight: 600, color: GRAY }}>Fill out the form to create new event</div>
        {lab(28, 92, "Name")}<div style={{ position: "absolute", left: 28, top: 114, width: 700, height: 44, borderRadius: 10, border: `2px solid ${f >= T.typeName2 && f < T.guest ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: INK, boxSizing: "border-box" }}>{typed(f, T.typeName2 + 2, "Skills check — vital signs", 1)}</div>
        {lab(28, 176, "Event Date & Time")}
        <div style={{ position: "absolute", left: 28, top: 198, width: 240, height: 44, borderRadius: 10, border: `2px solid ${sun ? "#F59E0B" : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: INK, boxSizing: "border-box" }}>{sun ? "Sun, Nov 1, 2026" : "Tue, Oct 27, 2026"}</div>
        <div style={{ position: "absolute", left: 280, top: 198, width: 160, height: 44, borderRadius: 10, border: `2px solid ${booked && !sun ? "#16A34A" : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: booked && !sun ? INK : "#9CA3AF", boxSizing: "border-box" }}>{booked && !sun ? "3:00 PM" : "Start"}</div>
        <div style={{ position: "absolute", left: 452, top: 198, width: 160, height: 44, borderRadius: 10, border: "2px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: booked && !sun ? INK : "#9CA3AF", boxSizing: "border-box" }}>{booked && !sun ? "3:30 PM" : "End"}</div>
        <div style={{ position: "absolute", left: 760, top: 92, width: 2, height: EH - 190, background: LINE }} />
        {lab(780, 92, "Invitations/Add Guests")}
        <div style={{ position: "absolute", left: 780, top: 114, width: 670, height: 44, borderRadius: 10, border: `2px solid ${f >= T.guest - 4 && f < T.clickGuest ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: INK, boxSizing: "border-box" }}>{f >= T.guest + 4 ? "" : typed(f, T.guest, "Jamal", 0.4)}</div>
        {f >= T.guest + 4 && <div style={{ position: "absolute", left: 790, top: 122, padding: "4px 12px 4px 4px", borderRadius: 999, background: f >= T.clickGuest ? BLUE : "#EEF2FF", color: f >= T.clickGuest ? "#fff" : BLUE, display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800 }}><Avatar t="JR" s={22} c1="#16A34A" c2="#15803D" />Jamal Reed ✕</div>}
        {f >= T.clickGuest + 2 && (
          <div style={{ position: "absolute", left: 780, top: 176, width: 670, padding: 18, borderRadius: 14, background: sun ? "#FFFBEB" : "#F0FDF4", border: `2px solid ${sun ? "#FDE68A" : "#BBF7D0"}`, boxSizing: "border-box", opacity: pr(f, T.clickGuest + 2, 8) }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: INK }}>Availability · Jamal Reed · {sun ? "Sunday" : "Tuesday"}</div>
            {sun ? <div style={{ marginTop: 12, fontSize: 18, fontWeight: 800, color: "#B45309" }}>No available time found</div> : (
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {slots.map((s) => { const pick = s === "3:00 PM" && booked; return <span key={s} style={{ width: 140, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: pick ? "#16A34A" : "#fff", color: pick ? "#fff" : "#166534", border: `2px solid ${pick ? "#16A34A" : "#86EFAC"}`, fontSize: 15, fontWeight: 800 }}>{s}</span>; })}
              </div>
            )}
            {!sun && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "#166534" }}>2:00 PM to 6:00 PM</div>}
          </div>
        )}
        <Btn x={EW - 28 - 160 - 12 - 110} y={EH - 66} w={110} label="Cancel" fs={16} />
        <Btn x={EW - 28 - 160} y={EH - 66} w={160} label="Save & Close" primary fs={16} press={f >= T.saveEv && f < T.saveEv + 6 ? 1 : 0} />
      </div>
    </>
  );
};
const SLOTPT = (i: number): [number, number] => EP(780 + 18 + (i % 4) * 148 + 70, 176 + 18 + 28 + 12 + Math.floor(i / 4) * 48 + 20);

const CalShell: React.FC<{ f: number; learner?: boolean; ev?: boolean }> = ({ f, learner, ev }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
    <div style={{ position: "absolute", left: 24, top: 18, fontSize: 28, fontWeight: 900, color: INK }}>Calendar</div>
    <div style={{ position: "absolute", left: 200, top: 20, display: "flex", padding: 4, borderRadius: 10, background: "#F3F4F6" }}>{["Day", "Week", "Month"].map((v) => <span key={v} style={{ padding: "6px 14px", borderRadius: 8, background: v === "Week" ? "#fff" : "transparent", fontSize: 14, fontWeight: 800, color: v === "Week" ? BLUE : "#4B5563" }}>{v}</span>)}</div>
    {!learner && <div style={{ position: "absolute", left: 990, top: 18, padding: "10px 14px", borderRadius: 10, border: `2px solid ${f >= T.clickMyAvail - 8 && f < T.clickMyAvail + 6 ? BLUE : LINE}`, background: "#fff", fontSize: 15, fontWeight: 800, color: INK }}>My Availability</div>}
    <div style={{ position: "absolute", left: 1160, top: 18, padding: "10px 18px", borderRadius: 10, background: BLUE, color: "#fff", fontSize: 15, fontWeight: 800, boxShadow: f >= T.clickAdd - 8 && f < T.clickAdd + 6 ? "0 0 0 4px #C7D2FE" : "none" }}>＋ Add New</div>
    <div style={{ position: "absolute", left: 24, top: 76, width: 1300, height: 680, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }}>
      {["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30", "Sat 31", "Sun 1"].map((d, i) => <div key={d} style={{ position: "absolute", left: 60 + i * 177, top: 0, width: 177, height: 46, borderLeft: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: INK }}>{d}</div>)}
      {["9 AM", "11 AM", "1 PM", "3 PM", "5 PM"].map((h, i) => <div key={h} style={{ position: "absolute", left: 0, top: 46 + i * 126, width: 1300, borderTop: `1px solid ${LINE}`, fontSize: 12, fontWeight: 700, color: GRAY, paddingLeft: 8 }}>{h}</div>)}
      {ev && <div style={{ position: "absolute", left: 60 + 177 + 4, top: 46 + 3 * 126 + 4, width: 169, height: 60, borderRadius: 8, background: "#16A34A22", borderLeft: "4px solid #16A34A", padding: 6, boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: INK, boxShadow: learner && f >= T.lOpen - 10 ? "0 0 0 3px #16A34A" : "none" }}>Skills check — vital signs<div style={{ fontSize: 11, color: GRAY }}>3:00 PM</div></div>}
    </div>
  </div>
);
const LearnerInvite: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.lOpen + 2) return null;
  const yes = f >= T.lYes + 2;
  return (
    <div style={{ position: "absolute", left: 620, top: 160, width: 640, height: 260, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 30px 80px #0004", padding: 24, boxSizing: "border-box", fontFamily: FONT, opacity: pr(f, T.lOpen + 2, 10), zIndex: 5 }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>Skills check — vital signs</div>
      <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: GRAY }}>Tue, Oct 27 · 3:00 – 3:30 PM</div>
      <div style={{ marginTop: 16, fontSize: 15, fontWeight: 900, color: INK }}>Invited Guests</div>
      <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: GRAY }}>Elena Brooks (Organizer) · Jamal Reed</div>
      <div style={{ position: "absolute", left: 24, bottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: INK }}>Going?</span>
        <span style={{ padding: "9px 18px", borderRadius: 10, background: yes ? "#16A34A" : "#fff", color: yes ? "#fff" : INK, border: yes ? "none" : `2px solid ${LINE}`, fontSize: 15, fontWeight: 800 }}>Yes</span>
        <span style={{ padding: "9px 18px", borderRadius: 10, border: `2px solid ${LINE}`, fontSize: 15, fontWeight: 800 }}>No</span>
      </div>
    </div>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.clickMyAvail - 10, 1100, 480, 1.06], [S.d2, 960, 520, 1.04], [S.d3, 900, 540, 1.08], [T.fri, 900, 620, 1.1],
  [S.d4, 960, 500, 1.08], [S.d5, 1100, 460, 1.06], [T.pickDate, 960, 520, 1.06], [S.d6, 960, 540, 1.0], [T.learner, 960, 540, 1.0], [T.lMon, 900, 560, 1.08],
  [T.back, 960, 540, 1.0], [T.guest, 1100, 460, 1.08], [T.clickGuest + 10, 1100, 520, 1.1], [T.sunday, 1100, 520, 1.08], [T.learner2, 960, 540, 1.0], [T.lOpen + 10, 1060, 500, 1.06], [PAY_START, 960, 540, 1.0],
]).map(calmK);
const rowPt = (i: number, x = 62): [number, number] => MA(30 + 20 + x, RY(i) - 6 + 31);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Calendar", "Attendance")],
  [T.clickMyAvail, ...MA(1060, 38)],
  [T.clickCreate, ...MA(220, 86)],
  [T.typeName, ...CT(520 + 280, 240 + 26 + 18 + 22 + 8 + 23)], [T.okName, ...CT(520 + 560 - 26 - 55, 240 + 260 - 22 - 24)],
  [T.mon, ...rowPt(1, 23)], [T.fri, ...rowPt(5, 23)], [T.wknd, ...rowPt(6, 60)],
  [T.clickCopy, ...rowPt(1, 590)], [T.pickDays, ...MA(30 + 20 + 520 + 40, 120 + RY(1) - 120 + 50 + 14 + 22 + 2 * 24 + 10)], [T.applyCopy, ...MA(30 + 20 + 520 + 130, 120 + RY(1) - 120 + 50 + 14 + 22 + 7 * 24 + 30)],
  [T.clickDS, ...MA(830 + 245, 120 + 20 + 22 + 58 + 16 + 23)],
  [T.pickDate, ...CT(DSX + 26 + 3 * 101 + 50, DSY + 26 + 22 + 20 + 16 + 24 + 8 + 18 + 4 * 50 + 22)],
  [T.dsFrom, ...CT(DSX + 26 + 11, DSY + 511)], [T.dsApply, ...CT(DSX + DSW - 26 - 55, DSY + DSH - 22 - 24)],
  [T.save, ...MA(220, 86)],
  [T.learner + 20, 1500, 860], [T.lMon, ...rowPt(1, 23)], [T.lSave, ...rowPt(6, 23)],
  [T.clickAdd, ...MA(1230, 40)], [T.typeName2, ...EP(380, 136)], [T.guest, ...EP(1100, 136)], [T.clickGuest, ...EP(880, 136)],
  [T.pickTime, ...SLOTPT(2)], [T.sunday, ...EP(148, 220)], [T.saveEv, ...EP(EW - 108, EH - 44)],
  [T.learner2 + 20, 1500, 860], [T.lOpen, ...MA(24 + 60 + 177 + 88, 76 + 46 + 3 * 126 + 30)], [T.lYes, ...MA(620 + 24 + 75 + 40, 160 + 260 - 24 - 20)],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "Open My Availability" },
  { at: S.d2, to: S.d3, label: "New schedule" },
  { at: S.d3, to: S.d4, label: "7-day hours" },
  { at: S.d4, to: S.d5, label: "Copy to other days" },
  { at: S.d5, to: T.learner, label: "Date-specific hours" },
  { at: T.learner, to: T.back, label: "Learner sets hours" },
  { at: T.back, to: S.d10, label: "Book inside their hours" },
  { at: S.d10, to: T.learner2, label: "No available time" },
  { at: T.learner2, to: PAY_START, label: "Learner says yes" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = (f >= T.learner && f < T.back) || f >= T.learner2;
  const availB = f >= T.clickMyAvail + 2 && f < T.back;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={f >= T.learner2 ? T.learner2 : T.learner} url={f >= T.learner2 ? "learner.carefirst.example.com/calendar/events" : "learner.carefirst.example.com/calendar/availability"} learner who="Jamal" prog="CNA Program — Fall 2026" active={f >= T.learner2 ? "Events" : "Availability"} openGroup="Calendar"
            main={f >= T.learner2 ? <><CalShell f={f} learner ev /><LearnerInvite f={f} /></> : <AvailPage f={f} rows={jamalRows(f)} name="Work weeks" at={T.learner} learner hlRow={f >= T.lMon && f < T.lSave ? 1 : undefined} />}
            overlay={<><Toast f={f} at={T.lSave + 3} text="Added new availability successfully" d={50} /><Toast f={f} at={T.lYes + 3} text="Invitation status updated successfully" d={50} /></>} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} branch="CareFirst — Columbus" url={availB ? "academy.skillbnk.com/calendar/availability" : "academy.skillbnk.com/calendar"} active={f >= T.clickMenu ? "Calendar" : "Dashboard"} openGroup="Attendance"
            main={availB ? <AvailPage f={f} rows={f >= T.okName + 4 ? elenaRows(f) : DAYS7.map(() => ({ on: false, from: "", to: "" }))} name={f >= T.okName + 4 ? "Lab hours" : "Default"} at={T.clickMyAvail + 2} ds={f >= T.dsApply + 2} hlRow={f >= T.mon && f < T.clickCopy ? (f >= T.wknd ? 6 : f >= T.fri ? 5 : 1) : undefined} /> : <CalShell f={f} ev={f >= T.saveEv + 4} />}
            overlay={<><CreateModal f={f} /><CopyModal f={f} /><DSModal f={f} /><EventModal f={f} /><Toast f={f} at={T.save + 3} text="Added new availability successfully" d={50} /><Toast f={f} at={T.saveEv + 3} text="Successfully added a new event" d={50} /></>} />
        )}
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={T.learner2 - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner2 + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook (story: thirty threads, two bookings) ─────────
const HK = { elena: cue("h0", "elena"), thirty: cue("h0", "thirty"), check: cue("h0", "check"), threads: cue("h0", "threads"), time: cue("h0", "time") };
const SLOT_X = 170, SLOT_Y = 250;
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.threads - 6, HK.time + 30);
  const msgs = f >= HK.threads ? Math.min(128, Math.floor((f - HK.threads) * 1.9)) : 0;
  const booked = f >= HK.time + 10 ? 2 : f >= HK.threads + 40 ? 1 : 0;
  const offers = ["Tue 10?", "can't — work", "Wed 2?", "class then", "Thu 9?", "how about Fri?", "Fri full", "Mon 4?"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 80, opacity: pr(f, HK.elena - 6, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#34D399" }}>CAREFIRST CNA SKILLS LAB</div>
          <div style={{ marginTop: 6, fontSize: 60, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.elena - 4, "30 skills checks to book.", 0.8)}</div>
        </div>
        {/* the lab's booking board: 30 empty slots */}
        <div style={{ position: "absolute", left: SLOT_X, top: SLOT_Y, width: 640, height: 600, borderRadius: 20, background: "#0F172A", border: "2px solid #334155", padding: 20, boxSizing: "border-box", opacity: pr(f, HK.thirty - 8, 12) }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#94A3B8", letterSpacing: 3 }}>SKILLS CHECK BOARD</div>
          {Array.from({ length: 30 }).map((_, i) => {
            const fill = i < booked;
            return <div key={i} style={{ position: "absolute", left: 20 + (i % 5) * 120, top: 60 + Math.floor(i / 5) * 86, width: 108, height: 72, borderRadius: 12, border: `2px dashed ${fill ? "#34D399" : "#475569"}`, background: fill ? "#064E3B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: fill ? "#6EE7B7" : "#475569", opacity: pr(f, HK.thirty - 4 + i * 0.8, 6) }}>{fill ? "BOOKED" : `#${String(i + 1).padStart(2, "0")}`}</div>;
          })}
        </div>
        {/* thirty threads: time offers bouncing back and forth */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: pr(f, HK.check, 10) }}>
          {Array.from({ length: 30 }).map((_, i) => { const y1 = SLOT_Y + 80 + (i % 30) * 17; const y2 = 220 + i * 22; return <path key={i} d={`M 820 ${y1} C 1000 ${y1}, 1100 ${y2}, 1300 ${y2}`} stroke={i % 3 ? "#334155" : "#60A5FA"} strokeWidth={2} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - lin(f, HK.check + i * 0.6, HK.check + 14 + i * 0.6))} />; })}
        </svg>
        <div style={{ position: "absolute", left: 1300, top: 200, width: 30, opacity: pr(f, HK.check, 10) }}>{Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ height: 14, width: 14, borderRadius: 7, marginBottom: 8, background: "#60A5FA" }} />)}</div>
        {f >= HK.threads && offers.map((o, i) => {
          const at = HK.threads + i * 7;
          const k = lin(f, at, at + 26);
          const left = i % 2 === 0;
          const x = left ? 830 + k * 430 : 1260 - k * 430;
          const y = 270 + ((i * 97) % 520);
          return k > 0 && k < 1 ? <div key={i} style={{ position: "absolute", left: x, top: y - Math.sin(k * Math.PI) * 50, padding: "8px 14px", borderRadius: 999, background: left ? "#DBEAFE" : "#FEE2E2", color: left ? "#1E3A8A" : "#991B1B", fontSize: 18, fontWeight: 900, whiteSpace: "nowrap" }}>{o}</div> : null;
        })}
        <div style={{ position: "absolute", left: 1400, top: 300, width: 400, opacity: pr(f, HK.threads, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#94A3B8", letterSpacing: 3 }}>MESSAGES SENT</div>
          <div style={{ fontSize: 140, fontWeight: 900, color: "#F8FAFC", lineHeight: 1 }}>{msgs}</div>
          <div style={{ marginTop: 20, fontSize: 22, fontWeight: 900, color: "#94A3B8", letterSpacing: 3 }}>SLOTS BOOKED</div>
          <div style={{ fontSize: 90, fontWeight: 900, color: "#FCA5A5", lineHeight: 1 }}>{booked} / 30</div>
        </div>
      </Stage>
      <Stamp f={f} at={HK.time + 14} x={1100} y={860} text="STILL GUESSING" color="#F59E0B" size={56} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.elena, "Elena runs a CNA skills lab."], [HK.thirty, "30 students. 30 one-on-one skills checks.", "30"], [HK.threads, "30 text threads…", "30 text threads"], [HK.time, "…just to find a time that works.", "a time that works"]]} />
    </AbsoluteFill>
  );
};

const PY = { zero: cue("p12", "zero"), hours: cue("p12", "hours") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(16,185,129,0.25), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 360, top: 180, width: 1200, display: "flex", flexWrap: "wrap", gap: 14 }}>
      {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ width: 186, height: 70, borderRadius: 12, background: "#064E3B", border: "2px solid #34D399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#A7F3D0", opacity: pr(f, PAY_START + 6 + i * 2, 8) }}>BOOKED · #{String(i + 1).padStart(2, "0")}</div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 720, width: 1920, textAlign: "center", fontSize: 44, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.zero - 4, 14) }}>30 skills checks · 0 text threads</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.threads, "riser", 0.25); add(HK.time + 14, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  add(T.applyCopy + 2, "pop", 0.4); add(T.dsApply + 2, "pop", 0.35); add(T.save + 4, "chime", 0.45); add(T.lSave + 4, "chime", 0.4); add(T.pickTime + 2, "ding", 0.35); add(T.saveEv + 4, "chime", 0.45); add(T.lYes + 3, "pop", 0.4);
  add(T.learner, "whoosh", 0.35); add(T.back, "whoosh", 0.3); add(T.learner2, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PY.hours, "chime", 0.5);
  return a;
})();

export const AvailabilityStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="availstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.back, T.learner2]} />;
};
