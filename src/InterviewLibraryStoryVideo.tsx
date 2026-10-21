import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * InterviewLibraryStoryVideo — DEEP version (sheet serial 41, ~2.5 min). Story: Mia Chen, career coach, Harborview Tech Bootcamp (fictional).
 * Verified in code: InterviewQuestions ("Mock Interviews", "Simulated practice interviews to prepare for real ones", "Enter interview name...",
 * Add New, columns Interview Name / Type / Questions / Audience / Status / Created By / Creation Date / Action). AddEditInterviewDialog
 * ("Add Interview" — "Create a new mock interview.", Interview Title, Interview Topic, Modules, Complexity Easy/Medium/Hard,
 * Duration (minutes), Instruction, Custom Questions, Interviewer Greetings, Priority/Severity Level Low/Medium/High/Critical,
 * Expiration Date, Active, Thumbnail (optional), toast "Interview created successfully"). MockInterviewQuestion (Add New, Bulk Upload,
 * "Add Mock Interview Question" — Title *, Answer, Hint, Answer Type Audio/Video, Video URL *; "Bulk Upload Interview Questions",
 * "Upload multiple questions via CSV file", "Bulk Upload Guidelines", Skeleton CSV, Upload File). Learner en.ts MockInterviewsPage
 * ("AI Mock Interview and Discussion", "Manage and track your interview sessions", Assigned Interviews / Completed Interviews).
 * MockeInterviewsUsers ("Mock Interview Answer", "Shows a list of Mock Interview Answers", User / Email / Program / Session /
 * Enrollment Date / Total Submissions) + MarkModal (Duration, Status, Score x/100, Overall Performance, Feedback "Enter your feedback
 * and remarks...", Interview Notes, Conversation History, "Evaluate by AI" → "Evaluated by AI successfully", "Mark updated successfully",
 * Send Email, Add to Calendar).
 * Voice: python3 generate-voice-story.py src/InterviewLibraryStoryVideo.tsx public/iqstory  (REDO=1)
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 358,
  d1: 306,
  d2: 190,
  d3: 256,
  d4: 218,
  d5: 181,
  d6: 301,
  d7: 273,
  d8: 276,
  d9: 283,
  d10: 256,
  d11: 171,
  p12: 194,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 15, 33, 48, 61, 69, 103, 110, 117, 123, 141, 161, 168, 171, 184, 213, 222, 227, 235, 265, 265, 274, 284, 291, 301, 304, 315, 325, 334],
  d1: [2, 25, 58, 67, 81, 97, 106, 121, 159, 167, 175, 183, 190, 217, 220, 226, 237, 243, 263, 270, 273, 279],
  d2: [2, 13, 24, 30, 37, 66, 83, 94, 109, 121, 124, 140, 140, 157],
  d3: [2, 12, 19, 27, 48, 54, 60, 68, 94, 97, 104, 120, 123, 138, 146, 154, 164, 168, 174, 185, 202, 207],
  d4: [22, 36, 43, 49, 53, 65, 69, 74, 82, 95, 109, 133, 135, 142, 147, 160, 165, 170, 176, 181, 188],
  d5: [2, 7, 21, 48, 54, 65, 97, 112, 127, 134],
  d6: [2, 16, 23, 45, 48, 57, 63, 74, 108, 110, 126, 132, 154, 160, 165, 189, 200, 212, 216, 223, 232, 243, 253, 260, 275],
  d7: [2, 12, 19, 38, 58, 77, 77, 117, 123, 137, 147, 157, 198, 198, 205, 221, 231, 234, 243],
  d8: [2, 36, 43, 51, 88, 90, 102, 108, 120, 133, 167, 169, 179, 186, 195, 220, 222, 237],
  d9: [2, 15, 25, 30, 40, 51, 87, 90, 100, 111, 123, 141, 147, 155, 184, 189, 229, 244, 253],
  d10: [2, 10, 22, 48, 49, 58, 74, 82, 109, 113, 119, 130, 143, 151, 173, 173, 179, 185, 192, 202, 217, 226, 233],
  d11: [2, 11, 18, 30, 55, 57, 64, 72, 79, 85, 101, 105, 115, 124, 135, 140],
  p12: [7, 12, 16, 35, 51, 90, 93, 102, 112, 124, 137, 147, 152],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Mia coaches developers for job interviews. Her two hundred questions sit in an old document, and every new cohort, she copies them into a fresh practice sheet. By hand.",
  d1: "In skillbank, practice interviews live under Mock Interviews. Each one shows its type, how many questions it has, and who it's for.",
  d2: "She adds a new interview. A title, the topic, and the modules it covers.",
  d3: "For an AI interview, she sets the complexity, the length in minutes, and an instruction for how the AI interviewer should behave.",
  d4: "She adds a few questions of her own, and a greeting, so the interview opens the way she would open it.",
  d5: "A priority level, an expiration date, active, and she saves.",
  d6: "Inside the interview, she builds the question bank. Add New: the question, a model answer, a hint, and whether learners reply on audio or video.",
  d7: "And the other two hundred? Bulk Upload. She downloads the skeleton CSV, fills it in, and uploads it once.",
  d8: "Now, the learner side. In AI Mock Interview and Discussion, the new interview is waiting under Assigned Interviews.",
  d9: "Back in the training provider portal, Mock Interview Answer lists every learner who practiced, with program, session, and submissions.",
  d10: "She opens one. The whole conversation is there. Evaluate by AI suggests a score, she adds her own feedback, and saves the mark.",
  d11: "From the same screen, she can email the learner, or put a follow-up on the calendar.",
  p12: "Two hundred questions, written once. Every new cohort starts practicing on day one.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);

const MENU = ["Dashboard", "Approved Member", "Mock Interviews Questions", "Mock Interviews Answer", "Assignments", "Settings"];
const ICONS = ["▦", "✅", "🎤", "🗂", "📝", "⚙"];
const NAME = "Frontend Developer — Behavioral";
const Q = "Tell me about a time you disagreed with a teammate.";

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "mock", -6),
  tour: cue("d1", "type", -4),
  clickAdd: cue("d2", "adds", -2),
  title: cue("d2", "title", -4),
  topic: cue("d2", "topic", -4),
  modules: cue("d2", "modules", -4),
  complexity: cue("d3", "complexity", -4),
  duration: cue("d3", "minutes", -6),
  instruction: cue("d3", "instruction", -4),
  custom: cue("d4", "questions", -6),
  greeting: cue("d4", "greeting", -4),
  priority: cue("d5", "priority", -4),
  expiry: cue("d5", "expiration", -4),
  clickSave: cue("d5", "saves", -2),
  openSet: S.d6 - 4,
  clickAddQ: cue("d6", "add", -2),
  typeQ: cue("d6", "question", -4, 1),
  typeA: cue("d6", "model", -4),
  typeH: cue("d6", "hint", -4),
  pickType: cue("d6", "audio", -2),
  addQ: S.d7 - 12,
  clickBulk: cue("d7", "bulk", -4),
  skeleton: cue("d7", "skeleton", -4),
  drop: cue("d7", "uploads", -2),
  learner: cue("d8", "learner", -8),
  assigned: cue("d8", "assigned", -4),
  back: S.d9 + 2,
  clickAnswersMenu: cue("d9", "answer", -6),
  clickRow: cue("d10", "opens", -4),
  clickAI: cue("d10", "evaluate", -2),
  feedback: cue("d10", "feedback", -6),
  saveMark: cue("d10", "saves", -2),
  email: cue("d11", "email", -2),
  cal: cue("d11", "calendar", -2),
};
const CLICKS = [T.clickMenu, T.clickAdd, T.title, T.topic, T.modules, T.complexity, T.duration, T.instruction, T.custom, T.greeting, T.priority, T.expiry, T.clickSave, T.openSet, T.clickAddQ, T.pickType, T.addQ, T.clickBulk, T.skeleton, T.drop, T.assigned, T.clickAnswersMenu, T.clickRow, T.clickAI, T.feedback, T.saveMark, T.email, T.cal];
const scene = (f: number) => (f >= T.back ? "answers" : f >= T.learner ? "learner" : f >= T.openSet ? "questions" : "list");

// ───────── interviews list + Add Interview dialog ─────────
const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const created = f >= T.clickSave + 4;
  const rows: [string, string, number, string, boolean][] = [...(created ? [[NAME, "AI", 0, "Web Dev — Evening", true] as [string, string, number, string, boolean]] : []), ["System Design — Junior", "AI", 12, "Web Dev — Evening", true], ["SQL Fundamentals", "Manual", 25, "Data — Weekend", true], ["Salary Negotiation", "AI", 8, "Global", false]];
  const d = f >= T.clickAdd + 2 && f < T.clickSave + 14 ? pr(f, T.clickAdd + 2, 12) * (1 - lin(f, T.clickSave + 4, T.clickSave + 14)) : 0;
  const fld = (x: number, y: number, w: number, l: string, v: string, ph: string, on: boolean, h = 46) => (
    <>
      <div style={{ position: "absolute", left: x, top: y, fontSize: 14, fontWeight: 800, color: "#374151" }}>{l}</div>
      <div style={{ position: "absolute", left: x, top: y + 22, width: w, height: h, borderRadius: 10, border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", padding: "10px 12px", boxSizing: "border-box", fontSize: 15, fontWeight: 600, color: v ? INK : "#9CA3AF", lineHeight: 1.35, overflow: "hidden" }}>{v || ph}</div>
    </>
  );
  const on = (a: number, b: number) => f >= a && f < b;
  return (
    <>
      <PageHead title="Mock Interviews" sub="Simulated practice interviews to prepare for real ones" />
      <div style={{ position: "absolute", left: 820, top: 24, width: 330, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Enter interview name...</div>
      <Btn x={1170} y={24} w={150} label="＋  Add New" primary fs={17} press={f >= T.clickAdd && f < T.clickAdd + 6 ? 1 : 0} />
      <Table x={18} y={130} rowH={68} hl={created ? 0 : -1}
        cols={[{ h: "Interview Name", w: 360 }, { h: "Type", w: 110 }, { h: "Questions", w: 120 }, { h: "Audience", w: 220 }, { h: "Status", w: 130 }, { h: "Created By", w: 180 }, { h: "Creation Date", w: 150 }, { h: "Action", w: 40 }]}
        rows={rows.map(([n, t, q, a, s], i) => [<b style={{ fontWeight: 800, color: created && i === 0 && f >= T.openSet - 14 ? BLUE : INK }}>🎤 {n}</b>, <Badge t={t} c={t === "AI" ? "#7C3AED" : BLUE} bg={t === "AI" ? "#F3E8FF" : "#EEF2FF"} fs={13} />, String(q), a, s ? <Badge t="Active" c="#15803D" bg="#DCFCE7" fs={13} dot /> : <Badge t="Inactive" c="#B91C1C" bg="#FEE2E2" fs={13} dot />, <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar t="MC" s={28} />Mia Chen</div>, <span style={{ color: GRAY }}>{created && i === 0 ? "Today" : `Sep ${10 + i * 6}, 2026`}</span>, <span style={{ color: BLUE }}>⋮</span>])} />
      {d > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * d})` }} />
          <div style={{ position: "absolute", left: 40, top: 14, width: 1270, height: 806, borderRadius: 22, background: "#fff", opacity: d, boxShadow: "0 40px 120px #000A", fontFamily: FONT }}>
            <div style={{ position: "absolute", left: 26, top: 20, fontSize: 25, fontWeight: 900, color: INK }}>Add Interview</div>
            <div style={{ position: "absolute", left: 26, top: 54, fontSize: 15, fontWeight: 600, color: GRAY }}>Create a new mock interview.</div>
            {fld(26, 92, 590, "Interview Title", typed(f, T.title, NAME, 1.2), "Enter interview title", on(T.title, T.topic))}
            {fld(26, 172, 590, "Interview Topic", typed(f, T.topic, "Teamwork, conflict and ownership in frontend teams", 1.6), "Enter interview topic", on(T.topic, T.modules))}
            {fld(26, 252, 590, "Modules", f >= T.modules + 6 ? "Module 4 · Soft skills" : "", "Select modules", on(T.modules, T.complexity))}
            {fld(26, 332, 290, "Complexity", f >= T.complexity + 6 ? "Medium" : "", "Select complexity", on(T.complexity, T.duration))}
            {fld(326, 332, 290, "Duration (minutes)", f >= T.duration + 6 ? "20" : "", "Enter duration", on(T.duration, T.instruction))}
            {fld(26, 412, 590, "Instruction", typed(f, T.instruction, "Act as a friendly senior engineer. Ask one follow-up per answer. Push for specific examples.", 2), "Enter instruction", on(T.instruction, T.custom), 96)}
            {fld(650, 92, 590, "Custom Questions (Optional)", typed(f, T.custom, "1. Tell me about a time you disagreed with a teammate.\n2. Describe a bug you owned end to end.", 2), "Enter custom questions...", on(T.custom, T.greeting), 120)}
            {fld(650, 246, 590, "Interviewer Greetings", typed(f, T.greeting, "Hi! I'm Mia's practice partner. Relax, this is just practice.", 1.8), "Enter interviewer greetings...", on(T.greeting, T.priority), 80)}
            {fld(650, 360, 290, "Priority/Severity Level", f >= T.priority + 6 ? "High" : "", "Select priority level", on(T.priority, T.expiry))}
            {fld(950, 360, 290, "Expiration Date", f >= T.expiry + 6 ? "Dec 15, 2026" : "", "Pick expiration date", on(T.expiry, T.clickSave))}
            <div style={{ position: "absolute", left: 650, top: 440, fontSize: 14, fontWeight: 800, color: "#374151" }}>Active</div>
            <div style={{ position: "absolute", left: 650, top: 462, width: 290, height: 46, borderRadius: 10, border: "2px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: "#15803D" }}>● Active</div>
            {f >= T.complexity && f < T.duration && <div style={{ position: "absolute", left: 26, top: 404, width: 290, borderRadius: 10, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 16px 40px #0004", padding: 6 }}>{["Easy", "Medium", "Hard"].map((t) => <div key={t} style={{ height: 38, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 700, color: t === "Medium" ? BLUE : INK, background: t === "Medium" ? "#EEF2FF" : "transparent" }}>{t}</div>)}</div>}
            {f >= T.priority && f < T.expiry && <div style={{ position: "absolute", left: 650, top: 432, width: 290, borderRadius: 10, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 16px 40px #0004", padding: 6 }}>{["Low", "Medium", "High", "Critical"].map((t) => <div key={t} style={{ height: 38, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 700, color: t === "High" ? BLUE : INK, background: t === "High" ? "#EEF2FF" : "transparent" }}>{t}</div>)}</div>}
            <Btn x={1270 - 26 - 170 - 12 - 110} y={806 - 68} w={110} label="Cancel" fs={16} />
            <Btn x={1270 - 26 - 170} y={806 - 68} w={170} label="Add Interview" primary fs={16} press={f >= T.clickSave && f < T.clickSave + 6 ? 1 : 0} />
          </div>
        </>
      )}
    </>
  );
};
const DLG = (x: number, y: number) => MA(40 + x, 14 + y);

// ───────── question bank ─────────
const QPage: React.FC<{ f: number }> = ({ f }) => {
  const added = f >= T.addQ + 4;
  const bulk = f >= T.drop + 26;
  const n = (added ? 1 : 0) + (bulk ? countUp(f, T.drop + 26, 200, 30) : 0);
  const add = f >= T.clickAddQ + 2 && f < T.addQ + 14 ? pr(f, T.clickAddQ + 2, 12) * (1 - lin(f, T.addQ + 4, T.addQ + 14)) : 0;
  const bk = f >= T.clickBulk + 2 && f < T.drop + 34 ? pr(f, T.clickBulk + 2, 12) * (1 - lin(f, T.drop + 24, T.drop + 34)) : 0;
  const rows: [string, string][] = [...(added ? [[Q, "Audio"] as [string, string]] : []), ...(bulk ? [["Describe a project you're proud of.", "Video"], ["How do you handle a missed deadline?", "Audio"], ["What does good code review look like?", "Audio"], ["Walk me through a hard bug you fixed.", "Video"]] as [string, string][] : [])];
  const fld = (y: number, l: string, v: string, ph: string, on: boolean, h = 48) => (
    <>
      <div style={{ position: "absolute", left: 28, top: y, fontSize: 15, fontWeight: 800, color: "#374151" }}>{l}</div>
      <div style={{ position: "absolute", left: 28, top: y + 24, width: 800, height: h, borderRadius: 12, border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", padding: "12px 14px", boxSizing: "border-box", fontSize: 17, fontWeight: 600, color: v ? INK : "#9CA3AF" }}>{v || ph}</div>
    </>
  );
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.openSet, 12) }}>
      <div style={{ position: "absolute", left: 32, top: 22, fontSize: 28, fontWeight: 900, color: INK }}>← {NAME}</div>
      <div style={{ position: "absolute", left: 32, top: 66, fontSize: 17, fontWeight: 700, color: GRAY }}>{n} questions</div>
      <div style={{ position: "absolute", left: 640, top: 24, width: 240, height: 46, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Search by title...</div>
      <div style={{ position: "absolute", left: 890, top: 24, width: 130, height: 46, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: INK, boxSizing: "border-box" }}>All Types ⌄</div>
      <Btn x={1030} y={24} w={140} label="＋  Add New" primary fs={16} press={f >= T.clickAddQ && f < T.clickAddQ + 6 ? 1 : 0} />
      <Btn x={1180} y={24} w={150} label="⇪  Bulk Upload" fs={16} press={f >= T.clickBulk && f < T.clickBulk + 6 ? 1 : 0} />
      {rows.length === 0 ? (
        <div style={{ position: "absolute", left: 32, top: 140, width: 1290, height: 300, borderRadius: 16, border: `2px dashed ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: GRAY }}>No questions yet</div>
      ) : (
        <Table x={18} y={110} rowH={64} hl={added && !bulk ? 0 : -1} oRow={(i) => pr(f, (i === 0 ? T.addQ + 4 : T.drop + 26 + i * 4), 12)}
          cols={[{ h: "Title", w: 560 }, { h: "Answer Type", w: 170 }, { h: "Created By", w: 200 }, { h: "Creation Date", w: 200 }, { h: "Action", w: 170 }]}
          rows={rows.map(([t, a]) => [<b style={{ fontWeight: 800 }}>{t}</b>, <Badge t={a === "Audio" ? "🎙 Audio" : "🎥 Video"} c={a === "Audio" ? "#0F766E" : "#7C3AED"} bg={a === "Audio" ? "#CCFBF1" : "#F3E8FF"} fs={13} />, "Mia Chen", <span style={{ color: GRAY }}>Today</span>, <span style={{ color: BLUE }}>✎ Edit · ⟲ History</span>])} />
      )}
      {add > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * add})` }} />
          <div style={{ position: "absolute", left: 240, top: 20, width: 860, height: 790, borderRadius: 22, background: "#fff", opacity: add, boxShadow: "0 40px 120px #000A" }}>
            <div style={{ position: "absolute", left: 28, top: 22, fontSize: 25, fontWeight: 900, color: INK }}>Add Mock Interview Question</div>
            <div style={{ position: "absolute", left: 28, top: 58, fontSize: 15, fontWeight: 600, color: GRAY }}>Add a new interview question</div>
            {fld(96, "Title *", typed(f, T.typeQ, Q, 1.4), "Enter question title", f >= T.typeQ && f < T.typeA)}
            {fld(186, "Answer", typed(f, T.typeA, "Use STAR: the situation, my task, the action I took, and the result.", 1.8), "Enter model answer...", f >= T.typeA && f < T.typeH, 96)}
            {fld(324, "Hint", typed(f, T.typeH, "Focus on how you listened before you argued.", 1.6), "Enter hint for the question...", f >= T.typeH && f < T.pickType)}
            <div style={{ position: "absolute", left: 28, top: 414, fontSize: 15, fontWeight: 800, color: "#374151" }}>Answer Type</div>
            <div style={{ position: "absolute", left: 28, top: 438, display: "flex", gap: 10 }}>{["🎙 Audio", "🎥 Video"].map((t, i) => <div key={t} style={{ width: 200, height: 50, borderRadius: 12, border: `2px solid ${i === 0 && f >= T.pickType ? BLUE : "#D1D5DB"}`, background: i === 0 && f >= T.pickType ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: INK }}>{t}</div>)}</div>
            {fld(508, "Video URL *", "https://vimeo.com/889201445", "Enter video URL", false)}
            <div style={{ position: "absolute", right: 28, bottom: 26, display: "flex", gap: 10 }}>
              <span style={{ padding: "12px 22px", borderRadius: 12, border: `2px solid ${LINE}`, fontWeight: 800, fontSize: 16 }}>Cancel</span>
              <span style={{ padding: "12px 22px", borderRadius: 12, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 16, transform: `scale(${f >= T.addQ && f < T.addQ + 6 ? 0.93 : 1})` }}>Add Question</span>
            </div>
          </div>
        </>
      )}
      {bk > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * bk})` }} />
          <div style={{ position: "absolute", left: 300, top: 100, width: 740, height: 540, borderRadius: 22, background: "#fff", opacity: bk, boxShadow: "0 40px 120px #000A", padding: 30, boxSizing: "border-box" }}>
            <div style={{ fontSize: 25, fontWeight: 900, color: INK }}>Bulk Upload Interview Questions</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: GRAY }}>Upload multiple questions via CSV file</div>
            <div style={{ marginTop: 18, padding: 18, borderRadius: 14, background: "#F9FAFB", border: `2px solid ${LINE}` }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>Bulk Upload Guidelines</div>
              <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: GRAY }}>• Download the skeleton file and fill it with proper data</div>
              <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: GRAY }}>• Once filled, upload it in the form below and submit</div>
              <div style={{ marginTop: 10, display: "inline-block", padding: "8px 14px", borderRadius: 10, border: `2px solid ${f >= T.skeleton ? BLUE : LINE}`, color: BLUE, fontWeight: 800, fontSize: 15 }}>⇩ Skeleton CSV</div>
            </div>
            <div style={{ marginTop: 18, fontSize: 15, fontWeight: 800, color: "#374151" }}>Upload File *</div>
            <div style={{ marginTop: 8, height: 150, borderRadius: 14, border: `3px dashed ${f >= T.drop ? "#22C55E" : "#93C5FD"}`, background: f >= T.drop ? "#F0FDF4" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, color: f >= T.drop ? "#15803D" : BLUE }}>{f >= T.drop ? "✓ behavioral_questions.csv · 200 rows" : "⇪ Drop your CSV here"}</div>
          </div>
        </>
      )}
    </div>
  );
};

// ───────── learner ─────────
const Learner: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
    <PageHead title="AI Mock Interview and Discussion" sub="Manage and track your interview sessions" />
    <div style={{ position: "absolute", left: 32, top: 110, display: "flex", gap: 8 }}>{["Assigned Interviews", "Completed Interviews"].map((t, i) => <div key={t} style={{ padding: "10px 20px", borderRadius: 12, fontSize: 17, fontWeight: 800, background: i === 0 ? BLUE : "#fff", color: i === 0 ? "#fff" : "#374151", border: `2px solid ${i === 0 ? BLUE : LINE}` }}>{t}</div>)}</div>
    {[[NAME, "AI", "Expires Dec 15"], ["System Design — Junior", "AI", ""], ["SQL Fundamentals", "Manual", ""]].map(([t, ty, e], i) => (
      <div key={t} style={{ position: "absolute", left: 32 + i * 440, top: 180, width: 410, height: 250, borderRadius: 18, background: "#fff", border: `2px solid ${i === 0 && f >= T.assigned ? BLUE : LINE}`, padding: 24, boxSizing: "border-box", opacity: pr(f, T.learner + 6 + i * 6, 12) }}>
        <div style={{ fontSize: 40 }}>🎤</div>
        <div style={{ marginTop: 6, fontSize: 21, fontWeight: 900, color: INK }}>{t}</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}><Badge t={ty} c={ty === "AI" ? "#7C3AED" : BLUE} bg={ty === "AI" ? "#F3E8FF" : "#EEF2FF"} fs={13} />{e && <Badge t={e} c="#92400E" bg="#FEF3C7" fs={13} />}</div>
      </div>
    ))}
  </div>
);

// ───────── answers + evaluation ─────────
const Answers: React.FC<{ f: number }> = ({ f }) => {
  const m = f >= T.clickRow + 2 ? pr(f, T.clickRow + 2, 14) : 0;
  const score = f >= T.clickAI + 20 ? countUp(f, T.clickAI + 20, 82, 24) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.back, 12) }}>
      <PageHead title="Mock Interview Answer" sub="Shows a list of Mock Interview Answers" />
      <Table x={18} y={120} rowH={66} hl={f >= T.clickRow - 10 ? 0 : -1}
        cols={[{ h: "User", w: 260 }, { h: "Email", w: 290 }, { h: "Program", w: 220 }, { h: "Session", w: 150 }, { h: "Enrollment Date", w: 180 }, { h: "Total Submissions", w: 190 }]}
        rows={[["Sam Okafor", "sam.okafor@example.com", 3], ["Priya Nair", "priya.nair@example.com", 2], ["Diego Alvarez", "diego.a@example.com", 1], ["Hana Sato", "hana.s@example.com", 2]].map(([n, e, s]) => [<div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar t={(n as string).split(" ").map((x) => x[0]).join("")} s={30} /><b>{n as string}</b></div>, <span style={{ color: GRAY }}>{e as string}</span>, "Web Development", "Evening", <span style={{ color: GRAY }}>Sep 02, 2026</span>, <b>{s as number}</b>])} />
      {m > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * m})` }} />
          <div style={{ position: "absolute", left: 30, top: 14, width: 1290, height: 806, borderRadius: 22, background: "#fff", opacity: m, boxShadow: "0 40px 120px #000A" }}>
            <div style={{ position: "absolute", left: 26, top: 20, fontSize: 24, fontWeight: 900, color: INK }}>Sam Okafor · {NAME}</div>
            <div style={{ position: "absolute", left: 26, top: 70, width: 740, height: 450, borderRadius: 16, border: `2px solid ${LINE}`, padding: 18, boxSizing: "border-box" }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>Conversation History</div>
              {[["AI", "Tell me about a time you disagreed with a teammate."], ["Sam", "On my last team we argued about state management. I listened first, then built a small demo of both options…"], ["AI", "What was the result, specifically?"], ["Sam", "We picked the simpler option and shipped two days early."]].map(([w, t], i) => (
                <div key={i} style={{ marginTop: 12, marginLeft: w === "Sam" ? 80 : 0, padding: "12px 16px", borderRadius: 14, background: w === "Sam" ? "#EEF2FF" : "#F3F4F6", fontSize: 16, fontWeight: 600, color: INK, opacity: pr(f, T.clickRow + 10 + i * 8, 10) }}><b style={{ color: w === "Sam" ? BLUE : "#7C3AED" }}>{w}:</b> {t}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 26, top: 536, width: 740, fontSize: 16, fontWeight: 900, color: INK }}>Feedback</div>
            <div style={{ position: "absolute", left: 26, top: 562, width: 740, height: 120, borderRadius: 12, border: `2px solid ${f >= T.feedback && f < T.saveMark ? BLUE : "#D1D5DB"}`, padding: 14, boxSizing: "border-box", fontSize: 16, fontWeight: 600, color: f >= T.feedback ? INK : "#9CA3AF" }}>{f >= T.feedback ? typed(f, T.feedback, "Strong structure. Next time, quantify the result earlier.", 1.6) : "Enter your feedback and remarks..."}</div>
            <div style={{ position: "absolute", left: 800, top: 70, width: 464, padding: 22, borderRadius: 16, border: `2px solid ${LINE}`, boxSizing: "border-box" }}>
              {[["Duration", "18 min"], ["Status", "Completed"], ["Started", "Oct 14, 7:02 PM"], ["Completed", "Oct 14, 7:20 PM"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 16, fontWeight: 700, color: GRAY }}><span>{l}</span><span style={{ color: INK }}>{v}</span></div>)}
              <div style={{ marginTop: 10, fontSize: 16, fontWeight: 900, color: INK }}>Score</div>
              <div style={{ fontSize: 54, fontWeight: 900, color: score ? "#15803D" : "#CBD5E1" }}>{score}/100</div>
              <div style={{ marginTop: 6, fontSize: 15, fontWeight: 800, color: GRAY }}>Overall Performance</div>
              <div style={{ marginTop: 6, height: 10, borderRadius: 5, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${score}%`, height: 10, background: "#16A34A" }} /></div>
            </div>
            <div style={{ position: "absolute", left: 800, top: 420, width: 464, height: 50, borderRadius: 12, background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, transform: `scale(${f >= T.clickAI && f < T.clickAI + 6 ? 0.95 : 1})` }}>{f >= T.clickAI && f < T.clickAI + 20 ? "Evaluating..." : "✨ Evaluate by AI"}</div>
            <div style={{ position: "absolute", left: 800, top: 486, width: 464, height: 50, borderRadius: 12, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, transform: `scale(${f >= T.saveMark && f < T.saveMark + 6 ? 0.95 : 1})` }}>Save</div>
            <div style={{ position: "absolute", left: 800, top: 560, display: "flex", gap: 10 }}>
              {[["✉", "Send Email", T.email], ["📅", "Add to Calendar", T.cal]].map(([g, t, at]) => <span key={t as string} style={{ padding: "12px 18px", borderRadius: 12, border: `2px solid ${f >= (at as number) - 6 && f < (at as number) + 30 ? BLUE : LINE}`, background: f >= (at as number) - 6 && f < (at as number) + 30 ? "#EEF2FF" : "#fff", fontSize: 16, fontWeight: 800, color: INK }}>{g as string} {t as string}</span>)}
            </div>
          </div>
        </>
      )}
      <Toast f={f} at={T.clickAI + 20} text="Evaluated by AI successfully" d={50} />
      <Toast f={f} at={T.saveMark + 3} text="Mark updated successfully" d={60} />
    </div>
  );
};
const AN = (x: number, y: number) => MA(30 + x, 14 + y);

const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.tour, 980, 440, 1.08],
  [S.d2, 960, 520, 1.03],
  [S.d3, 900, 560, 1.08],
  [S.d4, 1150, 420, 1.08],
  [S.d5, 1150, 560, 1.06],
  [T.openSet, 960, 540, 1.02],
  [S.d7, 960, 520, 1.04],
  [T.learner, 960, 540, 1.0],
  [T.back, 960, 520, 1.03],
  [S.d10, 960, 540, 1.0],
  [T.clickAI, 1150, 520, 1.08],
  [S.d11, 1150, 620, 1.08],
  [PAY_START, 960, 540, 1.0],
]).map(calmK);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Mock Interviews Questions", "Students Management")],
  [T.tour, ...MA(560, 230)],
  [T.clickAdd, ...MA(1245, 48)],
  [T.title, ...DLG(320, 137)],
  [T.topic, ...DLG(320, 217)],
  [T.modules, ...DLG(320, 297)],
  [T.complexity, ...DLG(170, 377)],
  [T.duration, ...DLG(470, 377)],
  [T.instruction, ...DLG(320, 480)],
  [T.custom, ...DLG(945, 170)],
  [T.greeting, ...DLG(945, 305)],
  [T.priority, ...DLG(795, 405)],
  [T.expiry, ...DLG(1095, 405)],
  [T.clickSave, ...DLG(1270 - 26 - 85, 806 - 44)],
  [T.openSet, ...MA(220, 130 + 54 + 34)],
  [T.clickAddQ, ...MA(1100, 47)],
  [T.typeQ, ...MA(240 + 428, 20 + 144)],
  [T.typeA, ...MA(240 + 428, 20 + 258)],
  [T.typeH, ...MA(240 + 428, 20 + 372)],
  [T.pickType, ...MA(240 + 128, 20 + 463)],
  [T.addQ, ...MA(240 + 860 - 28 - 70, 20 + 790 - 26 - 24)],
  [T.clickBulk, ...MA(1255, 47)],
  [T.skeleton, ...MA(300 + 30 + 80, 100 + 210)],
  [T.drop, ...MA(670, 100 + 400)],
  [T.learner + 20, 1300, 820],
  [T.assigned, ...CT(240, 300)],
  [T.clickAnswersMenu, ...realMenuPt("Mock Interviews Answer", "Students Management")],
  [T.clickRow, ...MA(150, 120 + 54 + 33)],
  [T.clickAI, ...AN(1032, 445)],
  [T.feedback, ...AN(396, 620)],
  [T.saveMark, ...AN(1032, 511)],
  [T.email, ...AN(890, 583)],
  [T.cal, ...AN(1100, 583)],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "Your interviews" },
  { at: S.d2, to: S.d3, label: "Title, topic, modules" },
  { at: S.d3, to: S.d5, label: "How the AI interviewer behaves" },
  { at: S.d5, to: T.openSet, label: "Priority and expiry" },
  { at: T.openSet, to: S.d7, label: "Add a question" },
  { at: S.d7, to: T.learner, label: "Bulk upload from CSV" },
  { at: T.learner, to: T.back, label: "What the learner sees" },
  { at: T.back, to: PAY_START, label: "Review, score, follow up" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const s = scene(f);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {s === "learner" ? (
          <LandWin f={f} inAt={T.learner} url="learner.harborview.example.com/mock-interviews" sidebar={false} main={<Learner f={f} />} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url={`academy.skillbnk.com/${s === "answers" ? "mock-interviews-answer" : s === "questions" ? "mock-interviews/frontend-behavioral" : "mock-interviews"}`} active={s === "answers" ? "Mock Interviews Answer" : f >= T.clickMenu ? "Mock Interviews Questions" : "Dashboard"} openGroup="Students Management"
            main={s === "answers" ? <Answers f={f} /> : s === "questions" ? <QPage f={f} /> : <ListPage f={f} />} overlay={<Toast f={f} at={T.clickSave + 3} text="Interview created successfully" d={50} />} />
        )}
        <Scribble f={f} at={T.instruction + 30} d={18} out={T.custom - 4} kind="ring" x={DLG(320, 0)[0]} y={DLG(0, 482)[1]} w={640} h={140} seed={4} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

const HK = { two: cue("h0", "two"), copies: cue("h0", "copies"), hand: cue("h0", "hand") };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.copies - 6, HK.hand + 20);
  const n = countUp(f, HK.two - 6, 200, 24);
  const copies = Math.floor(lin(f, HK.copies - 4, HK.hand + 10) * 5);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <HookTag f={f} text="Harborview Tech · new cohort starts Monday" />
      <div style={{ position: "absolute", left: 200, top: 170, width: 620, height: 760, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, 6, 20) }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#1D4ED8" }}>📄 interview_questions_OLD.docx</div>
        {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ marginTop: 16, height: 12, width: `${55 + ((i * 17) % 40)}%`, borderRadius: 6, background: "#E5E7EB" }} />)}
        <div style={{ position: "absolute", right: 30, bottom: 26, fontSize: 64, fontWeight: 900, color: INK }}>{n}<span style={{ fontSize: 24, color: GRAY }}> questions</span></div>
      </div>
      {Array.from({ length: copies }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 980 + i * 60, top: 220 + i * 80, width: 520, height: 300, borderRadius: 16, background: "#fff", boxShadow: "0 20px 60px #000B", padding: 22, boxSizing: "border-box", opacity: pr(f, HK.copies - 4 + i * 14, 12) }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#166534" }}>▦ practice_sheet_cohort_{i + 7}.xlsx</div>
          {[0, 1, 2, 3].map((k) => <div key={k} style={{ marginTop: 14, height: 10, width: `${50 + k * 10}%`, borderRadius: 5, background: "#E5E7EB" }} />)}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const PY = { once: cue("p12", "once"), day: cue("p12", "day") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 0, top: 220, width: 1920, textAlign: "center", color: "#fff", opacity: pr(f, PY.once - 8, 16) }}>
      <div style={{ fontSize: 140, fontWeight: 900, lineHeight: 1 }}>201</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: "#93C5FD" }}>questions in one bank, written once</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, display: "flex", justifyContent: "center", gap: 24 }}>
      {["Fall cohort", "Winter cohort", "Spring cohort"].map((t, i) => <div key={t} style={{ padding: "18px 34px", borderRadius: 999, background: "rgba(4,7,22,0.85)", border: "2px solid #86EFAC88", color: "#BBF7D0", fontSize: 28, fontWeight: 800, opacity: pr(f, PY.day - 10 + i * 8, 14) }}>{t}: practicing day one</div>)}
    </div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.two, "riser", 0.2); add(HK.hand, "thud", 0.4);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.45));
  add(T.clickSave + 4, "chime", 0.45); add(T.addQ + 4, "pop", 0.35); add(T.drop + 26, "chime", 0.45);
  add(T.learner, "whoosh", 0.35); add(T.back, "whoosh", 0.3); add(T.clickAI + 20, "ding", 0.4); add(T.saveMark + 4, "chime", 0.45);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.day, "chime", 0.45);
  return a;
})();

export const InterviewLibraryStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="iqstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.back]} />;
};
