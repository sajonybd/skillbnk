import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE, GREEN } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * AssignmentsStoryVideo — premium landscape (sheet serial 31). Story: Chef Elena Ruiz, Harbor Culinary Institute (fictional).
 * Verified in code: SB-Branch AllAssignment ("All Assignments", "Create New Assignment", columns ID / Assignment / Groups / Mark /
 * Submissions / Status / Created At / Action, Submissions button), CreateEditAssignmentModal ("Create New Assignment", Assignment Title,
 * Groups, Total marks, Pass Mark, "Generate with AI" → dialog "Generate Assignment With AI" + Generate, toast "AI questions added",
 * Save, toast "Successfully assignment created"), AssignmentAnswers (Total submissions / Reviewed / Pending / Passed / Failed,
 * Submitted By / Submission Date / Mark / Status / Review, "Not reviewed", "View Assignment Details", Status Passed,
 * "Feedback (visible to the learner)", "Submit Review", toast "Submission answer has been updated").
 * SB-Learner assignments (en.ts): "Technical Test", tabs Technical Task / Assignments, "Total Marks", "Deadline", "Test Now",
 * "Write your answer here", "Submit", toast "Assignment updated successfully", "Submitted and pending review.".
 * Voice: python3 generate-voice-story.py src/AssignmentsStoryVideo.tsx public/assignstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "p7"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 328,
  d1: 166,
  d2: 154,
  d3: 200,
  d4: 135,
  d5: 238,
  d6: 247,
  p7: 175,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "p7"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 18, 57, 59, 67, 77, 93, 133, 138, 153, 181, 188, 214, 221, 250, 257, 263, 269, 274, 282, 291],
  d1: [2, 13, 30, 38, 51, 73, 93, 102, 118, 130],
  d2: [2, 19, 37, 50, 72, 77, 97, 116, 120, 128],
  d3: [2, 26, 46, 57, 91, 92, 106, 112, 138, 140, 145, 162],
  d4: [2, 18, 25, 30, 60, 73, 85, 91, 97, 103],
  d5: [2, 9, 17, 28, 63, 66, 82, 105, 147, 147, 157, 178, 190],
  d6: [2, 15, 21, 24, 34, 46, 75, 82, 90, 99, 135, 135, 145, 180, 180, 186, 205, 216, 216, 223],
  p7: [2, 25, 63, 72, 109, 126, 131, 141, 148],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Sunday night. Chef Elena has twenty-six emails. Attachments called final, final two, really final. And a grade sheet she hasn't opened.",
  d1: "This time, she opens Assignments, and clicks Create New Assignment.",
  d2: "A title, the group, total marks, and a pass mark.",
  d3: "Then Generate with AI. She describes the quiz, and the questions appear.",
  d4: "Save, and it's live. Now let's see the learner side.",
  d5: "In his learner portal, Sam clicks Test Now, writes his answer, and submits.",
  d6: "Back in the training provider portal, every submission is waiting. Elena adds feedback, marks it passed, and submits the review.",
  p7: "Twenty-six submissions. Zero attachments. Elena's Sunday is hers again.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, SEG_START, WT);

const MENU = ["Dashboard", "Leaderboard", "Approved Member", "Assignments", "Groups", "Settings"];
const ICONS = ["▦", "🏆", "✅", "📝", "👥", "⚙"];
const TITLE = "Knife Skills — Week 3 Quiz";
const AI_PROMPT = "8 questions on knife cuts: 4 multiple choice, 2 short answer, 2 paragraph.";
const ANSWER = "Julienne is a thin matchstick cut, about 3 mm by 3 mm by 5 cm.";
const FEEDBACK = "Great precision, Sam. Watch your claw grip.";

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "assignments", -6),
  clickCreate: cue("d1", "create", 2),
  typeTitle: cue("d2", "title", -4),
  pickGroup: cue("d2", "group", -2),
  marks: cue("d2", "marks", -4),
  pass: cue("d2", "pass", -2),
  clickAI: cue("d3", "generate", -2),
  typeAI: cue("d3", "describes", -4),
  clickGen: cue("d3", "questions", -10),
  qIn: cue("d3", "appear", -4),
  clickSave: cue("d4", "save", -2),
  learner: cue("d4", "learner", -8),
  clickTest: cue("d5", "test", -4),
  typeAns: cue("d5", "writes", -2),
  clickSubmit: cue("d5", "submits", -2),
  back: SEG_START.d6 + 4,
  clickSubs: cue("d6", "submission", -4),
  clickReview: cue("d6", "feedback", -14),
  typeFb: cue("d6", "feedback", 0),
  clickStatus: cue("d6", "passed", -10),
  pickPassed: cue("d6", "passed", 2),
  clickSubmitRev: cue("d6", "review", -4),
};
const CLICKS = [T.clickMenu, T.clickCreate, T.typeTitle, T.pickGroup, T.marks, T.pass, T.clickAI, T.clickGen, T.clickSave, T.clickTest, T.typeAns, T.clickSubmit, T.clickSubs, T.clickReview, T.clickStatus, T.pickPassed, T.clickSubmitRev];
const scene = (f: number) => (f >= T.back ? (f >= T.clickSubs + 4 ? "subs" : "list2") : f >= T.learner ? "learner" : "list");

// ───────── provider: list ─────────
const COLS = [{ h: "ID", w: 90 }, { h: "Assignment", w: 340 }, { h: "Groups", w: 200 }, { h: "Mark", w: 100 }, { h: "Submissions", w: 150 }, { h: "Status", w: 130 }, { h: "Created At", w: 170 }, { h: "Action", w: 110 }];
const ROWS = [
  { id: "A-1041", t: "Mise en place checklist", g: "Fall Pro Cooks", m: 10, s: 24 },
  { id: "A-1038", t: "Food safety temps", g: "Fall Pro Cooks", m: 20, s: 26 },
  { id: "A-1032", t: "Stocks & mother sauces", g: "Weekend Bakers", m: 15, s: 18 },
];
const TBX = 32, TBY = 130, RH = 66;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const CREATE = MA(1160, 48);
const SUBS = MA(TBX + 730 + 75, rowY(0));
const ListPage: React.FC<{ f: number; created: boolean; subs?: number }> = ({ f, created, subs = 0 }) => {
  const shift = created ? pr(f, T.clickSave + 4, 14) : 0;
  const rows = created ? [{ id: "A-1042", t: TITLE, g: "Fall Pro Cooks", m: 20, s: subs }, ...ROWS] : ROWS;
  return (
    <>
      <PageHead title="All Assignments" sub="Create, assign and review assignments" />
      <Btn x={1030} y={24} w={290} label="＋  Create New Assignment" primary fs={18} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} glow={f >= T.clickCreate - 12 && f < T.clickCreate ? lin(f, T.clickCreate - 12, T.clickCreate) : 0} />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={created ? 0 : -1} oRow={(i) => (created && i === 0 ? shift : 1)}
        rows={rows.map((r, i) => [
          <span style={{ color: GRAY }}>{r.id}</span>, <b style={{ fontWeight: 800 }}>{r.t}</b>, r.g, String(r.m),
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 36, height: 36, borderRadius: 10, background: created && i === 0 && f >= T.clickSubs - 10 ? "#DBEAFE" : "#EEF2FF", border: `2px solid ${created && i === 0 && f >= T.clickSubs - 10 ? BLUE : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", color: BLUE }}>☰</span><b>{r.s}</b></div>,
          <Badge t="Active" c="#15803D" bg="#DCFCE7" fs={15} dot />, <span style={{ color: GRAY }}>{i === 0 && created ? "Oct 11, 2026" : "Oct 0" + (6 - i) + ", 2026"}</span>,
          <div style={{ display: "flex", gap: 8 }}>{["✎", "⋮"].map((g) => <span key={g} style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, fontWeight: 900 }}>{g}</span>)}</div>,
        ])} />
    </>
  );
};

// ───────── create modal ─────────
const MX = 160, MY = 20, MW = 1040, MH = 790;
const Fld: React.FC<{ x: number; y: number; w: number; label: string; v: string; ph?: string; focus?: boolean; sel?: boolean }> = ({ x, y, w, label, v, ph, focus, sel }) => (
  <>
    <div style={{ position: "absolute", left: x, top: y, fontSize: 17, fontWeight: 800, color: "#374151" }}>{label}</div>
    <div style={{ position: "absolute", left: x, top: y + 26, width: w, height: 50, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${focus ? BLUE : "#D1D5DB"}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 600, color: v ? INK : "#9CA3AF" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>
  </>
);
const QS = [["Multiple choice", "Which cut is about 3 mm × 3 mm × 5 cm?"], ["Multiple choice", "Which grip keeps your fingertips safe?"], ["Short answer", "Describe a julienne cut."], ["Paragraph", "Explain how you sharpen and hone a chef's knife."]];
const CreateModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickCreate + 4, b = T.clickSave + 4;
  if (f < a - 1 || f > b + 14) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 15, stiffness: 170 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b, b + 12));
  const ai = f >= T.clickAI + 2 && f < T.clickGen + 6 ? pr(f, T.clickAI + 2, 10) * (1 - lin(f, T.clickGen + 2, T.clickGen + 8)) : 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: MX, top: MY + (1 - inn) * 50, width: MW, height: MH, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 28, fontWeight: 900, color: INK }}>Create New Assignment</div>
        <Fld x={30} y={80} w={600} label="Assignment Title" v={typed(f, T.typeTitle, TITLE, 1.2)} focus={f >= T.typeTitle && f < T.pickGroup} />
        <Fld x={660} y={80} w={350} label="Groups" v={f >= T.pickGroup + 4 ? "Fall Pro Cooks" : ""} ph="Select Groups" sel focus={f >= T.pickGroup && f < T.marks} />
        <Fld x={30} y={176} w={300} label="Total marks" v={f >= T.marks + 4 ? "20" : ""} ph="0" focus={f >= T.marks && f < T.pass} />
        <Fld x={360} y={176} w={300} label="Pass Mark" v={f >= T.pass + 4 ? "14" : ""} ph="0" focus={f >= T.pass && f < T.clickAI} />
        <Fld x={690} y={176} w={320} label="Grading mode" v="Auto evaluation" sel />
        <div style={{ position: "absolute", left: 30, top: 290, fontSize: 21, fontWeight: 900, color: INK }}>Questions</div>
        <Btn x={600} y={280} w={200} h={46} label="✨ Generate with AI" fs={17} press={f >= T.clickAI && f < T.clickAI + 6 ? 1 : 0} glow={f >= T.clickAI - 12 && f < T.clickAI ? lin(f, T.clickAI - 12, T.clickAI) : 0} />
        <Btn x={820} y={280} w={190} h={46} label="＋ Add Question" fs={17} />
        {QS.map(([ty, q], i) => {
          const s = sp(f, T.qIn + i * 6, 30, { damping: 14 });
          return (
            <div key={i} style={{ position: "absolute", left: 30, top: 344 + i * 84, width: 980, height: 72, borderRadius: 14, border: `2px solid ${LINE}`, background: "#F9FAFB", display: "flex", alignItems: "center", gap: 14, padding: "0 18px", boxSizing: "border-box", opacity: Math.min(1, s * 2), transform: `translateX(${(1 - Math.min(1, s)) * 40}px)` }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: INK, flex: 1 }}>{q}</span>
              <Badge t={ty} c={BLUE} bg="#EEF2FF" fs={14} />
            </div>
          );
        })}
        <Btn x={760} y={MH - 72} w={110} label="Cancel" fs={18} />
        <Btn x={890} y={MH - 72} w={120} label="Save" primary fs={18} press={f >= T.clickSave && f < T.clickSave + 6 ? 1 : 0} glow={f >= T.clickSave - 12 && f < T.clickSave ? lin(f, T.clickSave - 12, T.clickSave) : 0} />
        {ai > 0 && (
          <>
            <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.4 * ai})` }} />
            <div style={{ position: "absolute", left: 170, top: 200 + (1 - ai) * 30, width: 700, height: 340, borderRadius: 20, background: "#fff", boxShadow: "0 30px 90px #0009", opacity: ai, padding: 28, boxSizing: "border-box" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Generate Assignment With AI</div>
              <div style={{ marginTop: 18, height: 150, borderRadius: 12, border: `2px solid ${BLUE}`, boxShadow: "0 0 0 5px #C7D2FE", padding: 16, boxSizing: "border-box", fontSize: 19, fontWeight: 600, color: INK, lineHeight: 1.45 }}>{typed(f, T.typeAI, AI_PROMPT, 1.6)}</div>
              <div style={{ position: "absolute", right: 28, bottom: 26, display: "flex", gap: 12 }}>
                <div style={{ width: 110, height: 46, borderRadius: 12, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800 }}>Cancel</div>
                <div style={{ width: 140, height: 46, borderRadius: 12, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, transform: `scale(${f >= T.clickGen && f < T.clickGen + 6 ? 0.93 : 1})` }}>Generate</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
const AIBTN = CT(MX + 700, MY + 303);
const GENBTN = CT(MX + 170 + 700 - 28 - 70, MY + 200 + 340 - 26 - 23);
const SAVEB = CT(MX + 950, MY + MH - 48);

// ───────── learner portal ─────────
const LearnerPage: React.FC<{ f: number }> = ({ f }) => {
  const mo = f >= T.clickTest + 2 ? pr(f, T.clickTest + 2, 10) * (1 - lin(f, T.clickSubmit + 20, T.clickSubmit + 30)) : 0;
  const done = f >= T.clickSubmit + 2;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <PageHead title="Technical Test" sub="Assess Technical Skills with Accuracy and Speed" />
      <div style={{ position: "absolute", left: 32, top: 112, display: "flex", gap: 8 }}>
        {["Technical Task", "Assignments", "Technical Question", "Assignments Test"].map((t) => <div key={t} style={{ padding: "10px 20px", borderRadius: 12, fontSize: 18, fontWeight: 800, background: t === "Assignments" ? BLUE : "#fff", color: t === "Assignments" ? "#fff" : "#374151", border: `2px solid ${t === "Assignments" ? BLUE : LINE}` }}>{t}</div>)}
      </div>
      {[TITLE, "Food safety temps"].map((t, i) => (
        <div key={t} style={{ position: "absolute", left: 32 + i * 560, top: 190, width: 530, height: 250, borderRadius: 18, background: "#fff", border: `2px solid ${i === 0 && f >= T.clickTest - 12 ? BLUE : LINE}`, boxShadow: "0 8px 26px #0000000f", padding: 24, boxSizing: "border-box" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>{t}</div>
          <div style={{ marginTop: 14, fontSize: 18, fontWeight: 600, color: GRAY }}>Total Marks: <b style={{ color: INK }}>{i === 0 ? 20 : 20}</b></div>
          <div style={{ marginTop: 6, fontSize: 18, fontWeight: 600, color: GRAY }}>Deadline: <b style={{ color: INK }}>{i === 0 ? "Oct 20, 2026" : "Oct 09, 2026"}</b></div>
          {i === 0 && done ? (
            <div style={{ position: "absolute", left: 24, bottom: 24 }}><Badge t="Submitted and pending review." c="#B45309" bg="#FEF3C7" fs={16} /></div>
          ) : (
            <div style={{ position: "absolute", left: 24, bottom: 22, width: 160, height: 48, borderRadius: 12, background: i === 0 ? BLUE : "#E5E7EB", color: i === 0 ? "#fff" : GRAY, fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i === 0 && f >= T.clickTest && f < T.clickTest + 6 ? 0.93 : 1})` }}>{i === 0 ? "Test Now" : "See Result"}</div>
          )}
        </div>
      ))}
      {mo > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * mo})` }} />
          <div style={{ position: "absolute", left: 200, top: 60 + (1 - mo) * 40, width: 1200, height: 640, borderRadius: 22, background: "#fff", opacity: mo, boxShadow: "0 40px 120px #000A", padding: 34, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 28, fontWeight: 900, color: INK }}>{TITLE}</div><Badge t="Pass: 14 (70%)" c={BLUE} bg="#EEF2FF" fs={16} /></div>
            <div style={{ marginTop: 26, fontSize: 16, fontWeight: 800, color: GRAY }}>3 of 4 · 5 marks</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800, color: INK }}>Describe a julienne cut.</div>
            <div style={{ marginTop: 20, height: 220, borderRadius: 14, border: `2px solid ${f >= T.typeAns ? BLUE : "#D1D5DB"}`, boxShadow: f >= T.typeAns ? "0 0 0 5px #C7D2FE" : "none", padding: 18, boxSizing: "border-box", fontSize: 21, fontWeight: 600, color: f >= T.typeAns ? INK : "#9CA3AF", lineHeight: 1.5 }}>{f >= T.typeAns ? typed(f, T.typeAns, ANSWER, 1.5) : "Write your answer here"}</div>
            <div style={{ position: "absolute", right: 34, bottom: 30, width: 150, height: 52, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 19, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= T.clickSubmit && f < T.clickSubmit + 6 ? 0.93 : 1})` }}>Submit</div>
          </div>
        </>
      )}
      <Toast f={f} at={T.clickSubmit + 3} text="Assignment updated successfully" />
    </div>
  );
};
const TESTNOW = CT(32 + 24 + 80, 190 + 250 - 22 - 24);
const ANSBOX = CT(200 + 600, 60 + 34 + 26 + 20 + 8 + 30 + 20 + 110);
const SUBMITB = CT(200 + 1200 - 34 - 75, 60 + 640 - 30 - 26);

// ───────── provider: submissions + review ─────────
const SubsPage: React.FC<{ f: number }> = ({ f }) => {
  const rev = f >= T.clickReview + 2 ? pr(f, T.clickReview + 2, 10) * (1 - lin(f, T.clickSubmitRev + 6, T.clickSubmitRev + 16)) : 0;
  const reviewed = f >= T.clickSubmitRev + 4;
  const stats: [string, number][] = [["Total submissions", 26], ["Reviewed", reviewed ? 1 : 0], ["Pending", reviewed ? 25 : 26], ["Passed", reviewed ? 1 : 0], ["Failed", 0]];
  const people = [["Sam Okafor", "Oct 12, 2026 · 8:41 PM", "17"], ["Priya Nair", "Oct 12, 2026 · 7:02 PM", "15"], ["Diego Alvarez", "Oct 12, 2026 · 6:15 PM", "12"], ["Hana Sato", "Oct 11, 2026 · 9:30 PM", "18"]];
  const dd = f >= T.clickStatus + 2 && f < T.pickPassed + 6 ? pr(f, T.clickStatus + 2, 8) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.clickSubs + 4, 10) }}>
      <PageHead title={TITLE} sub="Submissions" />
      {stats.map(([t, n], i) => (
        <div key={t} style={{ position: "absolute", left: 32 + i * 258, top: 110, width: 240, height: 92, borderRadius: 14, background: "#fff", border: `2px solid ${LINE}`, padding: "12px 18px", boxSizing: "border-box" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: GRAY }}>{t}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: t === "Passed" && reviewed ? GREEN : INK }}>{i === 0 ? countUp(f, T.clickSubs + 6, n, 20) : n}</div>
        </div>
      ))}
      <Table x={32} y={226} rowH={RH} hl={f >= T.clickReview - 12 ? 0 : -1}
        cols={[{ h: "Submitted By", w: 300 }, { h: "Submission Date", w: 300 }, { h: "Mark", w: 120 }, { h: "Status", w: 200 }, { h: "Review", w: 200 }, { h: "Reviewed By", w: 170 }]}
        rows={people.map((p, i) => [
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar t={p[0].split(" ").map((x) => x[0]).join("")} s={34} /><b>{p[0]}</b></div>,
          <span style={{ color: GRAY }}>{p[1]}</span>, i === 0 && reviewed ? "17 / 20" : "—",
          i === 0 && reviewed ? <Badge t="Passed" c="#15803D" bg="#DCFCE7" fs={15} /> : <Badge t="Not reviewed" c="#6B7280" bg="#F3F4F6" fs={15} />,
          <span style={{ padding: "8px 18px", borderRadius: 10, background: i === 0 && f >= T.clickReview - 12 ? BLUE : "#EEF2FF", color: i === 0 && f >= T.clickReview - 12 ? "#fff" : BLUE, fontWeight: 800, fontSize: 16 }}>Review</span>,
          i === 0 && reviewed ? "Elena Ruiz" : "—",
        ])} />
      {rev > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * rev})` }} />
          <div style={{ position: "absolute", left: 175, top: 40 + (1 - rev) * 40, width: 1000, height: 640, borderRadius: 22, background: "#fff", opacity: rev, boxShadow: "0 40px 120px #000A", padding: 30, boxSizing: "border-box" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>View Assignment Details</div>
            <div style={{ marginTop: 6, fontSize: 17, fontWeight: 600, color: GRAY }}>Sam Okafor · Describe a julienne cut.</div>
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "#F9FAFB", border: `2px solid ${LINE}`, fontSize: 19, fontWeight: 600, color: INK }}>{ANSWER}</div>
            <div style={{ marginTop: 18, fontSize: 17, fontWeight: 800, color: "#374151" }}>Status</div>
            <div style={{ marginTop: 8, width: 360, height: 50, borderRadius: 12, border: `2px solid ${dd > 0 ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 700, color: f >= T.pickPassed ? "#15803D" : INK }}>{f >= T.pickPassed ? "Passed" : "Pending"}<span style={{ color: GRAY }}>⌄</span></div>
            <div style={{ marginTop: 18, fontSize: 17, fontWeight: 800, color: "#374151" }}>Feedback (visible to the learner)</div>
            <div style={{ marginTop: 8, height: 110, borderRadius: 12, border: `2px solid ${f >= T.typeFb && f < T.clickStatus ? BLUE : "#D1D5DB"}`, padding: 14, boxSizing: "border-box", fontSize: 19, fontWeight: 600, color: f >= T.typeFb ? INK : "#9CA3AF" }}>{f >= T.typeFb ? typed(f, T.typeFb, FEEDBACK, 1.4) : "Enter your feedback and remarks for this submission..."}</div>
            <div style={{ position: "absolute", right: 30, bottom: 28, width: 180, height: 52, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 19, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= T.clickSubmitRev && f < T.clickSubmitRev + 6 ? 0.93 : 1})` }}>Submit Review</div>
            {dd > 0 && (
              <div style={{ position: "absolute", left: 30, top: 330, width: 360, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0005", padding: 6, opacity: dd }}>
                {["Pending", "Passed", "Failed", "Rejected"].map((t) => <div key={t} style={{ height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, fontWeight: 700, color: t === "Passed" && f >= T.pickPassed - 8 ? BLUE : INK, background: t === "Passed" && f >= T.pickPassed - 8 ? "#EEF2FF" : "transparent" }}>{t}</div>)}
              </div>
            )}
          </div>
        </>
      )}
      <Toast f={f} at={T.clickSubmitRev + 3} text="Submission answer has been updated" />
    </div>
  );
};
const REVIEWB = MA(32 + 720 + 200 + 16 + 40, 226 + 54 + RH / 2);
const STATUSB = MA(175 + 30 + 180, 40 + 30 + 26 + 6 + 16 + 60 + 18 + 18 + 8 + 25 + 40);
const PASSED = MA(175 + 30 + 120, 40 + 330 + 6 + 44 + 22);
const SUBMITREV = MA(175 + 1000 - 30 - 90, 40 + 640 - 28 - 26);
const FBBOX = MA(175 + 500, 40 + 470);

const Main: React.FC<{ f: number }> = ({ f }) => {
  const s = scene(f);
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      {s === "list" && <ListPage f={f} created={f >= T.clickSave + 4} />}
      {s === "list2" && <ListPage f={f} created subs={26} />}
      {s === "subs" && <SubsPage f={f} />}
    </div>
  );
};

const camClamp = (k: K4): K4 => [k[0], Math.max(760, Math.min(1080, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.22, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickMenu - 16, 600, 420, 1.2],
  [T.clickCreate - 14, 1450, 260, 1.3],
  [T.clickCreate + 16, 1000, 520, 1.05],
  [T.typeTitle - 4, 900, 330, 1.22],
  [T.pass + 10, 1000, 420, 1.18],
  [T.clickAI - 10, 1120, 470, 1.25],
  [T.clickAI + 14, 1000, 520, 1.12],
  [T.clickGen + 8, 1000, 640, 1.12],
  [T.clickSave - 12, 1150, 760, 1.25],
  [T.clickSave + 20, 1000, 420, 1.08],
  [T.learner, 960, 540, 1.0],
  [T.clickTest - 10, 520, 560, 1.25],
  [T.clickTest + 12, 960, 520, 1.08],
  [T.typeAns, 960, 520, 1.18],
  [T.clickSubmit - 6, 1300, 760, 1.25],
  [T.clickSubmit + 20, 600, 500, 1.15],
  [T.back + 6, 960, 520, 1.02],
  [T.clickSubs - 14, 1250, 360, 1.3],
  [T.clickSubs + 16, 960, 480, 1.05],
  [T.clickReview - 10, 1350, 470, 1.25],
  [T.clickReview + 14, 1000, 560, 1.1],
  [T.typeFb, 1000, 640, 1.18],
  [T.clickStatus, 820, 560, 1.22],
  [T.clickSubmitRev - 10, 1300, 800, 1.25],
  [T.clickSubmitRev + 26, 1000, 460, 1.1],
  [PAY_START, 960, 540, 1.05],
]).map(camClamp);

const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...menuPt(3)],
  [T.clickCreate, CREATE[0], CREATE[1]],
  [T.typeTitle, ...CT(MX + 300, MY + 131)],
  [T.pickGroup, ...CT(MX + 830, MY + 131)],
  [T.marks, ...CT(MX + 180, MY + 227)],
  [T.pass, ...CT(MX + 510, MY + 227)],
  [T.clickAI, AIBTN[0], AIBTN[1]],
  [T.clickGen, GENBTN[0], GENBTN[1]],
  [T.clickSave, SAVEB[0], SAVEB[1]],
  [T.learner + 20, 1200, 760],
  [T.clickTest, TESTNOW[0], TESTNOW[1]],
  [T.typeAns, ANSBOX[0], ANSBOX[1]],
  [T.clickSubmit, SUBMITB[0], SUBMITB[1]],
  [T.clickSubs, SUBS[0], SUBS[1]],
  [T.clickReview, REVIEWB[0], REVIEWB[1]],
  [T.typeFb, FBBOX[0], FBBOX[1]],
  [T.clickStatus, STATUSB[0], STATUSB[1]],
  [T.pickPassed, PASSED[0], PASSED[1]],
  [T.clickSubmitRev, SUBMITREV[0], SUBMITREV[1]],
]);
const STEPS = [
  { at: T.clickMenu, to: SEG_START.d2, label: "CREATE" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "MARKS & PASS MARK" },
  { at: SEG_START.d3, to: SEG_START.d4, label: "QUESTIONS WITH AI" },
  { at: SEG_START.d4, to: T.learner, label: "SAVE" },
  { at: T.learner, to: SEG_START.d6, label: "LEARNER SUBMITS" },
  { at: SEG_START.d6, to: PAY_START, label: "REVIEW" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const s = scene(f);
  const isL = s === "learner";
  const url = isL ? "learner.harborculinary.example.com/assignments" : s === "subs" ? "academy.skillbnk.com/assignments/A-1042/answers" : "academy.skillbnk.com/assignments";
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={T.learner} url={url} sidebar={false} main={<LearnerPage f={f} />} />
        ) : (
          <LandWin f={f} inAt={s === "list" ? T.appIn : T.back} url={url} active={f >= T.clickMenu ? "Assignments" : "Dashboard"} menu={MENU} menuIcons={ICONS} main={<Main f={f} />} overlay={<><CreateModal f={f} /><Toast f={f} at={T.clickGen + 6} text="AI questions added" d={50} /><Toast f={f} at={T.clickSave + 3} text="Successfully assignment created" d={56} /></>} />
        )}
        <Scribble f={f} at={T.qIn + 10} d={16} out={T.clickSave - 4} kind="under" x={CT(MX + 520, 0)[0]} y={CT(0, MY + 344 + 4 * 84)[1]} w={900} seed={4} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.clickSubs + 16} d={16} out={T.clickReview - 6} kind="ring" x={MA(160, 156)[0]} y={MA(160, 156)[1]} w={260} h={110} seed={6} worldW={1920} worldH={1080} />
        <Confetti f={f} at={T.clickSubmitRev + 4} cx={1000} cy={400} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { emails: cue("h0", "emails"), final: cue("h0", "final"), really: cue("h0", "really"), grade: cue("h0", "grade"), opened: cue("h0", "opened") };
const FILES = ["knife_quiz_final.docx", "knife_quiz_final2.docx", "quiz REALLY final.pdf", "IMG_4471.jpg", "answers (1).docx", "sam_quiz_v3.pages", "final_final.docx"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.final - 6, HK.opened + 10);
  const n = countUp(f, HK.emails - 12, 26, 20);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * lin(f, 0, DURATIONS.h0)})` }}>
        <HookTag f={f} text="🌙 SUNDAY · 11:40 PM" />
        <div style={{ position: "absolute", left: 260, top: 140 + (1 - pr(f, 6, 20)) * 100, width: 900, height: 820, borderRadius: 24, background: "#fff", opacity: pr(f, 6, 20), boxShadow: "0 50px 140px #000D", overflow: "hidden" }}>
          <div style={{ height: 70, background: "#F3F4F6", borderBottom: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 26px", fontSize: 24, fontWeight: 900, color: INK, justifyContent: "space-between" }}>✉ Inbox<span style={{ padding: "4px 16px", borderRadius: 999, background: "#DC2626", color: "#fff", fontSize: 22 }}>{n} unread</span></div>
          {FILES.map((t, i) => {
            const s = sp(f, HK.final - 20 + i * 7, 30, { damping: 12 });
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, height: 104, padding: "0 26px", borderTop: `1px solid ${LINE}`, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - Math.min(1, s)) * -60}px)` }}>
                <Avatar t={["SO", "PN", "DA", "HS", "GK", "SO", "EB"][i]} s={46} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 21, fontWeight: 800, color: INK }}>RE: Week 3 quiz</div><div style={{ fontSize: 18, fontWeight: 600, color: GRAY }}>📎 {t}</div></div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 1240, top: 300 + (1 - pr(f, HK.grade, 16)) * 60, width: 420, height: 420, borderRadius: 24, background: "#fff", opacity: pr(f, HK.grade, 16), transform: "rotate(3deg)", boxShadow: "0 40px 120px #000C", padding: 26, boxSizing: "border-box" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#166534" }}>▦ grades.xlsx</div>
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ marginTop: 14, height: 34, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 18, fontWeight: 800, color: "#9CA3AF" }}>— — —</div>)}
        </div>
        <Scribble f={f} at={HK.really} d={18} out={DURATIONS.h0 + 20} kind="ring" x={710} y={560} w={860} h={330} seed={7} color="#F87171" sw={10} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { tw: cue("p7", "twentysix"), zero: cue("p7", "zero"), sunday: cue("p7", "sunday") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const big = (at: number, n: number, t: string, c: string, x: number) => {
    const s = sp(f, at, 30, { damping: 12 });
    return (
      <div style={{ position: "absolute", left: x, top: 300, width: 560, height: 380, borderRadius: 30, background: "rgba(4,7,22,0.82)", border: `3px solid ${c}88`, boxShadow: `0 30px 80px #000A, 0 0 40px ${c}33`, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 60}px)`, textAlign: "center", color: "#fff" }}>
        <div style={{ marginTop: 50, fontSize: 170, fontWeight: 900, color: c, lineHeight: 1 }}>{countUp(f, at, n, 22)}</div>
        <div style={{ marginTop: 20, fontSize: 36, fontWeight: 900, letterSpacing: 3 }}>{t}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 8) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * lin(f, PAY_START, SCENES_END)})` }}>
        {big(PY.tw, 26, "SUBMISSIONS", "#86EFAC", 330)}
        {big(PY.zero, 0, "ATTACHMENTS", "#93C5FD", 1030)}
        <Confetti f={f} at={PY.sunday} cx={960} cy={480} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(6, "swish", 0.4);
  for (let i = 0; i < 7; i++) add(HK.final - 20 + i * 7, "pop", 0.25);
  add(HK.grade, "riser", 0.3); add(HK.really, "thud", 0.55);
  add(DURATIONS.h0 - 6, "whoosh", 0.5); add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  for (let i = 0; i < 14; i++) add(T.typeTitle + i * 1.4, ["key0", "key1", "key2"][i % 3], 0.18);
  for (let i = 0; i < 16; i++) add(T.typeAI + i * 2, ["key0", "key1", "key2"][i % 3], 0.18);
  for (let i = 0; i < 4; i++) add(T.qIn + i * 6, "pop", 0.4);
  add(T.clickSave + 2, "thud", 0.5); add(T.clickSave + 4, "chime", 0.6);
  add(T.learner, "whoosh", 0.45);
  for (let i = 0; i < 16; i++) add(T.typeAns + i * 2, ["key0", "key1", "key2"][i % 3], 0.18);
  add(T.clickSubmit + 3, "ding", 0.55); add(T.back, "whoosh", 0.45);
  for (let i = 0; i < 12; i++) add(T.typeFb + i * 2, ["key0", "key1", "key2"][i % 3], 0.18);
  add(T.pickPassed + 2, "ding", 0.5); add(T.clickSubmitRev + 4, "chime", 0.7);
  add(PAY_START - 3, "whoosh", 0.5); add(PY.tw, "pop", 0.4); add(PY.zero, "thud", 0.45); add(PY.sunday, "chime", 0.65);
  return a;
})();

export const AssignmentsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="assignstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.back]} />;
};
