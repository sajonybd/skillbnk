import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { FONT, pr, lin, sp, rnd, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Finish, Flash, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE, GREEN } from "./storyLand";

/**
 * CourseManageStoryVideo — premium landscape 1920x1080 (sheet serial 27). Story: Daniel Reyes, Harbor Lane Coaching (fictional).
 * Hook (11 scattered files) → MainIntro → ONE continuous recording of Courses & Programs (list → Add New form → Edit: tab, chapters,
 * lessons, lesson types → Bulk Upload Chapters → Published switch) → payoff → MainOutro.
 * Voice: `python3 generate-voice-story.py src/CourseManageStoryVideo.tsx public/coursestory`.
 * Verified in code (SB-Branch CoursesAndPrograms + ComponentList/all-programs): "All Bootcamps" list (SN, Name, Pricing, Delivery Type,
 * Published switch, Featured, Created At, Updated At, Actions View/Update/History), "Add New", create form steps Basic Info/Content/Media/
 * Pricing/Meta Data/Review, "Edit Bootcamp · <name>", tabs ("Add New", "Add Tab" modal: Tab Name, Active), "Add Chapter", "Add Lesson",
 * lesson modal "Select type" (Video, Link, Slide, Quiz, Assignment, Document / lab, Diagram, Template, AI Interview), "Bulk Upload Chapters"
 * (Upload CSV File / Generate by AI), toast "Course published successfully".
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "p7"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 304,
  d1: 156,
  d2: 176,
  d3: 180,
  d4: 175,
  d5: 196,
  d6: 111,
  p7: 157,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "p7"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 30, 42, 62, 75, 88, 101, 147, 147, 175, 184, 219, 223, 248, 255, 259, 271],
  d1: [2, 23, 28, 40, 57, 67, 82, 105, 114, 130],
  d2: [2, 12, 19, 31, 48, 54, 59, 71, 93, 97, 108, 117, 130, 137, 145],
  d3: [2, 14, 21, 29, 36, 67, 82, 94, 103, 127, 133, 142],
  d4: [2, 13, 21, 28, 32, 46, 59, 64, 83, 94, 102, 118, 123, 130, 142],
  d5: [2, 22, 28, 36, 66, 67, 72, 84, 96, 102, 107, 120, 133, 143],
  d6: [2, 11, 19, 45, 52, 63, 87],
  p7: [2, 13, 37, 43, 65, 70, 78, 88, 105, 113, 126],
};
// @WT-END
const MUSIC = true;

const SCRIPTS: Record<Seg, string> = {
  h0: "Daniel's course lives in eleven different places. Videos here, slides there, quizzes somewhere in an old email.",
  d1: "So he opens Courses and Programs, and clicks Add New.",
  d2: "A short form walks him through six steps, from basic info to a final review.",
  d3: "Then he builds the structure. A tab, then chapters, then lessons inside.",
  d4: "Each lesson can be a video, a slide, a quiz, an assignment, or a document.",
  d5: "Already have an outline? Upload it in bulk, or let AI draft the curriculum.",
  d6: "When it's ready, one switch publishes it.",
  p7: "One course. One place. And Daniel knows exactly where everything lives.",
};

const SEG_START = {} as Record<Seg, number>;
let _t = 0;
for (const k of SEGS) {
  SEG_START[k] = _t;
  _t += DURATIONS[k];
  if (k === "h0") _t += INTRO_FRAMES;
}
const INTRO_START = DURATIONS.h0;
const DEMO_START = SEG_START.d1;
const P7_START = SEG_START.p7;
const SCENES_END = _t;
export const TOTAL_FRAMES = SCENES_END + OUTRO_FRAMES;
const cue = makeCues(SCRIPTS, SEG_START, WT);
const typed = (f: number, a: number, text: string, cpf = 0.9) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((f - a) * cpf))));

const COURSE = "Team Leadership Essentials";
const TAB = "Foundations";
const CHAPTERS = [
  { n: "Leading Yourself", ls: [["Welcome video", "Video"], ["Self-check quiz", "Quiz"]] },
  { n: "Leading Others", ls: [["Giving feedback", "Slide"], ["Practice assignment", "Assignment"]] },
];
const LTYPES = ["Video", "Link", "Slide", "Quiz", "Assignment", "Document / lab", "Diagram", "Template", "AI Interview"];

// ───────────────────────── timeline ─────────────────────────
const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "courses", -2),
  clickNew: cue("d1", "new", -2),
  formIn: cue("d1", "new", 4),
  typeTitle: cue("d2", "form", 4),
  stepA: cue("d2", "basic", -2),
  stepB: cue("d2", "review", 2),
  editIn: SEG_START.d3 - 6,
  clickTabNew: cue("d3", "builds", -6),
  typeTab: cue("d3", "structure", -2),
  clickTabSave: cue("d3", "tab", 6),
  clickChapter: cue("d3", "chapters", -10),
  chapIn: cue("d3", "chapters", 2),
  lessonsIn: cue("d3", "lessons", -2),
  clickLesson: SEG_START.d4 + 2,
  clickType: cue("d4", "can", 0),
  hVideo: cue("d4", "video", -2),
  hSlide: cue("d4", "slide", -2),
  hQuiz: cue("d4", "quiz", -2),
  hAssign: cue("d4", "assignment", -2),
  hDoc: cue("d4", "document", -2),
  closeLesson: SEG_START.d5 + 2,
  clickBulk: cue("d5", "outline", -4),
  radioCsv: cue("d5", "upload", -2),
  fileIn: cue("d5", "bulk", 0),
  radioAi: cue("d5", "let", -4),
  typePrompt: cue("d5", "draft", -6),
  clickGen: cue("d5", "curriculum", 6),
  closeBulk: SEG_START.d6 + 2,
  toList: SEG_START.d6 + 6,
  clickSwitch: cue("d6", "switch", -2),
  toast: cue("d6", "publishes", 0),
};
const CLICKS = [T.clickMenu, T.clickNew, T.clickTabNew, T.clickTabSave, T.clickChapter, T.clickLesson, T.clickType, T.hQuiz - 4, T.closeLesson, T.clickBulk, T.radioCsv, T.radioAi, T.clickGen, T.closeBulk, T.clickSwitch];

// ───────────────────────── pages inside the window main area (1350 x 836) ─────────────────────────
const Pg: React.FC<{ f: number; a: number; b?: number; children: React.ReactNode }> = ({ f, a, b = 99999, children }) => {
  const inn = pr(f, a, 16), out = pr(f, b, 12);
  if (f < a - 1 || f > b + 14) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: inn * (1 - out), transform: `translateX(${(1 - inn) * 80 - out * 80}px)` }}>{children}</div>;
};
const Title: React.FC<{ t: string; s: string }> = ({ t, s }) => (
  <>
    <div style={{ position: "absolute", left: 32, top: 22, fontSize: 32, fontWeight: 900, color: INK, letterSpacing: -0.5, whiteSpace: "nowrap" }}>{t}</div>
    <div style={{ position: "absolute", left: 32, top: 66, fontSize: 18, fontWeight: 600, color: GRAY }}>{s}</div>
  </>
);
const Sw: React.FC<{ on: number; x: number; y: number; glow?: number }> = ({ on, x, y, glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 58, height: 32, borderRadius: 16, background: on > 0.5 ? BLUE : "#D1D5DB", boxShadow: glow > 0 ? `0 0 0 ${8 * glow}px #1D3FD633` : "none" }}>
    <div style={{ position: "absolute", top: 3, left: 3 + on * 26, width: 26, height: 26, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 6px #0004" }} />
  </div>
);

// geometry (main-area coords)
const LCOL = [0, 56, 360, 500, 650, 830, 950, 1090]; // SN, Name, Pricing, Delivery, Published, Featured, Created, Actions
const TX = 32, TY = 130, HH = 56, RH = 74;
const ADDNEW = MA(1245, 48);

type CRow = { n: string; price: string; d: string; pub: boolean; c: string };
const OLDC: CRow[] = [
  { n: "Public Speaking Basics", price: "$129.00", d: "Native", pub: true, c: "Sep 18, 2026" },
  { n: "Time Management Essentials", price: "Free", d: "Native", pub: true, c: "Aug 30, 2026" },
];

const CRowView: React.FC<{ r: CRow; y: number; i: number; sw: number; o?: number; swGlow?: number; hl?: number }> = ({ r, y, i, sw, o = 1, swGlow = 0, hl = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: 1286, height: RH, opacity: o, borderTop: `1px solid ${LINE}`, background: hl > 0 ? `rgba(29,63,214,${0.06 * hl})` : "#fff", fontSize: 17, fontWeight: 600, color: INK }}>
    <div style={{ position: "absolute", left: LCOL[0] + 18, top: 0, height: RH, display: "flex", alignItems: "center", color: GRAY }}>{i}</div>
    <div style={{ position: "absolute", left: LCOL[1], top: 0, width: 300, height: RH, display: "flex", alignItems: "center", gap: 12, fontWeight: 800 }}>
      <div style={{ width: 54, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#C7D2FE,#93C5FD)", flexShrink: 0 }} />{r.n}
    </div>
    <div style={{ position: "absolute", left: LCOL[2], top: 0, height: RH, display: "flex", alignItems: "center" }}>{r.price === "Free" ? <Badge t="Free" c="#15803D" bg="#DCFCE7" fs={16} /> : r.price}</div>
    <div style={{ position: "absolute", left: LCOL[3], top: 0, height: RH, display: "flex", alignItems: "center" }}><Badge t={r.d} c="#15803D" bg="#DCFCE7" fs={16} /></div>
    <Sw on={sw} x={LCOL[4]} y={21} glow={swGlow} />
    <Sw on={0} x={LCOL[5]} y={21} />
    <div style={{ position: "absolute", left: LCOL[6], top: 0, height: RH, display: "flex", alignItems: "center", color: GRAY }}>{r.c}</div>
    {["👁", "✎", "⟲"].map((g, k) => <div key={k} style={{ position: "absolute", left: LCOL[7] + 6 + k * 50, top: 19, width: 38, height: 36, borderRadius: 10, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: GRAY }}>{g}</div>)}
  </div>
);

const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const press = f >= T.clickNew && f < T.clickNew + 6 ? 1 : 0;
  const swOn = lin(f, T.clickSwitch, T.clickSwitch + 7);
  const newRow: CRow = { n: COURSE, price: "$149.00", d: "Native", pub: false, c: "Oct 12, 2026" };
  const hl = f >= T.toList ? Math.max(0, 1 - lin(f, T.toast + 10, T.toast + 50)) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <Title t="All Bootcamps" s="Information about all Courses" />
      <div style={{ position: "absolute", left: 800, top: 24, width: 340, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600 }}>Enter Title Here...</div>
      <Btn x={1160} y={24} w={170} label="＋  Add New" primary press={press} fs={19} glow={f >= T.clickNew - 12 && f < T.clickNew ? lin(f, T.clickNew - 12, T.clickNew) : 0} />
      <div style={{ position: "absolute", left: TX, top: TY, width: 1286, height: 600, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, overflow: "hidden", boxShadow: "0 6px 24px #0000000d" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1286, height: HH, background: "#F3F4F6" }}>
          {["SN", "Name", "Pricing", "Delivery Type", "Published", "Featured", "Created At", "Actions"].map((h, i) => <div key={h} style={{ position: "absolute", left: LCOL[i] + (i === 0 ? 18 : 0), top: 0, height: HH, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 800, color: "#4B5563" }}>{h}</div>)}
        </div>
        {f >= T.toList && <CRowView r={newRow} i={1} y={HH} sw={swOn} swGlow={f >= T.clickSwitch - 10 && f < T.clickSwitch + 8 ? 1 : 0} hl={hl} o={pr(f, T.toList + 4, 12)} />}
        {OLDC.map((r, i) => <CRowView key={r.n} r={r} i={i + (f >= T.toList ? 2 : 1)} y={HH + (i + (f >= T.toList ? pr(f, T.toList + 4, 14) : 0)) * RH} sw={1} />)}
      </div>
    </div>
  );
};

const SKEL: React.FC<{ x: number; y: number; w: number; h?: number }> = ({ x, y, w, h = 18 }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 9, background: "#E5E7EB" }} />;
const DashSkeleton: React.FC = () => (
  <div style={{ position: "absolute", inset: 0 }}>
    <SKEL x={32} y={30} w={260} h={30} /><SKEL x={32} y={76} w={420} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 32 + i * 440, top: 130, width: 410, height: 170, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}` }}><SKEL x={24} y={28} w={150} /><SKEL x={24} y={70} w={220} h={34} /></div>)}
    <div style={{ position: "absolute", left: 32, top: 330, width: 1286, height: 400, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}` }} />
  </div>
);

const STEPN = ["Basic Info", "Content", "Media", "Pricing", "Meta Data", "Review"];
const FormField: React.FC<{ x: number; y: number; w: number; label: string; text?: string; ph?: string; sel?: boolean; focus?: boolean }> = ({ x, y, w, label, text, ph, sel, focus }) => (
  <>
    <div style={{ position: "absolute", left: x, top: y, fontSize: 17, fontWeight: 800, color: "#374151" }}>{label}</div>
    <div style={{ position: "absolute", left: x, top: y + 28, width: w, height: 52, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${focus ? BLUE : "#D1D5DB"}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 600, color: text ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{text || ph}</span>{sel && <span style={{ color: GRAY }}>⌄</span>}
    </div>
  </>
);
const CreatePage: React.FC<{ f: number }> = ({ f }) => {
  const prog = lin(f, T.stepA, T.stepB);
  const step = Math.min(5, Math.floor(prog * 6 + 0.001));
  const stepPop = (i: number) => sp(f, T.stepA + (i / 6) * (T.stepB - T.stepA), 30, { damping: 10 });
  const t0 = T.typeTitle;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <Title t="Add New" s="To add, complete the form below" />
      <div style={{ position: "absolute", left: 32, top: 120, width: 1286, height: 100, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}` }}>
        {STEPN.map((s, i) => {
          const cx = 110 + i * 213, done = i < step, on = i === step;
          return (
            <React.Fragment key={s}>
              {i < 5 && <div style={{ position: "absolute", left: cx + 34, top: 36, width: 213 - 68, height: 4, borderRadius: 2, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: done ? "100%" : "0%", height: 4, background: BLUE }} /></div>}
              <div style={{ position: "absolute", left: cx - 22, top: 14, width: 44, height: 44, borderRadius: "50%", background: done || on ? BLUE : "#E5E7EB", color: done || on ? "#fff" : GRAY, fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 1 + 0.12 * Math.max(0, stepPop(i) - 0.85) : 1})`, boxShadow: on ? "0 0 0 8px #1D3FD622" : "none" }}>{done ? "✓" : i + 1}</div>
              <div style={{ position: "absolute", left: cx - 90, top: 62, width: 180, textAlign: "center", fontSize: 16, fontWeight: 800, color: done || on ? INK : GRAY }}>{s}</div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 32, top: 244, width: 1286, height: 540, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}` }}>
        {step === 0 ? (
          <>
            <FormField x={36} y={30} w={580} label="Category" text={f >= t0 + 30 ? "Leadership" : ""} ph="Select category" sel />
            <FormField x={670} y={30} w={580} label="Sub-Category" text={f >= t0 + 40 ? "Management" : ""} ph="Select sub-category" sel />
            <FormField x={36} y={130} w={1214} label="Title" text={typed(f, t0, COURSE)} ph="Enter a clear, descriptive title for your course" focus={f >= t0 - 4 && f < t0 + 30} />
            <FormField x={36} y={230} w={390} label="Type" text={f >= t0 + 50 ? "Course" : ""} ph="Select Type" sel />
            <FormField x={450} y={230} w={390} label="Language" text={f >= t0 + 58 ? "English" : ""} ph="Select Language" sel />
            <FormField x={864} y={230} w={386} label="Delivery Type" text={f >= t0 + 66 ? "Native" : ""} ph="Select Delivery Type" sel />
          </>
        ) : (
          <div style={{ opacity: pr(f, T.stepA + (step / 6) * (T.stepB - T.stepA), 8) }}>
            <div style={{ position: "absolute", left: 36, top: 30, fontSize: 26, fontWeight: 900, color: INK }}>{STEPN[step]}</div>
            {[0, 1, 2].map((r) => <React.Fragment key={r}><SKEL x={36} y={96 + r * 100} w={160} /><div style={{ position: "absolute", left: 36, top: 124 + r * 100, width: r === 0 ? 1214 : 580, height: 52, borderRadius: 12, border: "2px solid #E5E7EB", background: "#F9FAFB" }} /></React.Fragment>)}
          </div>
        )}
      </div>
    </div>
  );
};

// edit page
const ETABS = MA(190, 130); // tab pill origin (world)
const ADDTAB = MA(1245, 160);
const ADDCH = MA(1010, 270);
const ADDLS = MA(1148, 270);
const BULK = MA(1175, 48);
const EditPage: React.FC<{ f: number }> = ({ f }) => {
  const tabIn = f >= T.clickTabSave + 4;
  const chapPress = f >= T.clickChapter && f < T.clickChapter + 6 ? 1 : 0;
  const lessPress = f >= T.clickLesson && f < T.clickLesson + 6 ? 1 : 0;
  const bulkPress = f >= T.clickBulk && f < T.clickBulk + 6 ? 1 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 32, top: 22, fontSize: 30, fontWeight: 900, color: INK, whiteSpace: "nowrap" }}>Edit Bootcamp · {COURSE}</div>
      <div style={{ position: "absolute", left: 32, top: 66, fontSize: 18, fontWeight: 600, color: GRAY }}>Modify course settings and preferences</div>
      <Btn x={1030} y={24} w={290} label="⇪  Bulk Upload Chapters" press={bulkPress} fs={18} glow={f >= T.clickBulk - 12 && f < T.clickBulk ? lin(f, T.clickBulk - 12, T.clickBulk) : 0} />
      {/* tabs row */}
      <div style={{ position: "absolute", left: 32, top: 120, width: 1286, height: 80, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}` }}>
        {tabIn ? (
          <div style={{ position: "absolute", left: 20, top: 16, padding: "0 28px", height: 46, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 19, fontWeight: 800, display: "flex", alignItems: "center", transform: `scale(${0.7 + 0.3 * Math.min(1.05, sp(f, T.clickTabSave + 4, 30, { damping: 10, stiffness: 220 }))})`, transformOrigin: "left center" }}>{TAB}</div>
        ) : (
          <div style={{ position: "absolute", left: 24, top: 0, height: 80, display: "flex", alignItems: "center", fontSize: 17, fontWeight: 600, color: GRAY }}>No tabs created yet. Click “Add New” to create your first tab.</div>
        )}
        <Btn x={1100} y={16} w={166} h={48} label="＋  Add New" primary press={f >= T.clickTabNew && f < T.clickTabNew + 6 ? 1 : 0} fs={18} />
      </div>
      {/* tab content */}
      {tabIn && (
        <div style={{ position: "absolute", left: 32, top: 224, width: 1286, height: 590, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, opacity: pr(f, T.clickTabSave + 6, 12) }}>
          <div style={{ position: "absolute", left: 24, top: 22, fontSize: 22, fontWeight: 900, color: INK }}>{TAB}</div>
          <Btn x={870} y={14} w={180} h={44} label="＋  Add Chapter" primary press={chapPress} fs={17} />
          <Btn x={1066} y={14} w={170} h={44} label="＋  Add Lesson" press={lessPress} fs={17} />
          {CHAPTERS.map((c, ci) => {
            const cin = pr(f, T.chapIn + ci * 14, 14);
            const y0 = 84 + ci * 240;
            return (
              <div key={c.n} style={{ position: "absolute", left: 24, top: y0, width: 1238, opacity: cin, transform: `translateX(${(1 - cin) * 40}px)` }}>
                <div style={{ height: 58, borderRadius: 12, background: "#EEF2FF", border: "2px solid #C7D2FE", display: "flex", alignItems: "center", gap: 14, padding: "0 20px", fontSize: 20, fontWeight: 900, color: INK }}>
                  <span style={{ color: "#9CA3AF" }}>⋮⋮</span> {c.n}
                </div>
                {c.ls.map(([ln, lt], li) => {
                  const lin2 = pr(f, T.lessonsIn + (ci * 2 + li) * 9, 12);
                  return (
                    <div key={ln} style={{ marginTop: 10, marginLeft: 44, height: 54, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 14, padding: "0 20px", fontSize: 18, fontWeight: 700, color: INK, opacity: lin2, transform: `translateX(${(1 - lin2) * 40}px)` }}>
                      <span style={{ color: "#9CA3AF" }}>⋮⋮</span>{ln}<span style={{ marginLeft: "auto" }}><Badge t={lt} c={BLUE} bg="#EEF2FF" fs={15} /></span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ───────────────────────── overlays: add-tab, lesson, bulk, toast ─────────────────────────
const Dim: React.FC<{ o: number }> = ({ o }) => <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />;
const Modal: React.FC<{ f: number; a: number; b: number; w: number; h: number; title: string; children: React.ReactNode }> = ({ f, a, b, w, h, title, children }) => {
  if (f < a - 1 || f > b + 14) return null;
  const inn = sp(f, a, 30, { damping: 15, stiffness: 170 });
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b, b + 12));
  return (
    <>
      <Dim o={o} />
      <div style={{ position: "absolute", left: (1600 - w) / 2, top: (836 - h) / 2 + (1 - Math.min(1, inn)) * 50, width: w, height: h, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, transform: `scale(${0.94 + 0.06 * Math.min(1, inn)})`, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 28, fontWeight: 900, color: INK }}>{title}</div>
        {children}
      </div>
    </>
  );
};
const TabModal: React.FC<{ f: number }> = ({ f }) => (
  <Modal f={f} a={T.clickTabNew + 4} b={T.clickTabSave + 6} w={560} h={330} title="Add Tab">
    <div style={{ position: "absolute", left: 30, top: 84, fontSize: 17, fontWeight: 800, color: "#374151" }}>Tab Name</div>
    <div style={{ position: "absolute", left: 30, top: 112, width: 500, height: 52, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${BLUE}`, boxShadow: "0 0 0 5px #C7D2FE", padding: "0 16px", display: "flex", alignItems: "center", fontSize: 18, fontWeight: 600, color: typed(f, T.typeTab, TAB, 0.8) ? INK : "#9CA3AF" }}>{typed(f, T.typeTab, TAB, 0.8) || "Enter tab name"}</div>
    <div style={{ position: "absolute", left: 30, top: 190, display: "flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 800, color: "#374151" }}><Sw on={1} x={0} y={0} /><span style={{ marginLeft: 70 }}>Active</span></div>
    <Btn x={250} y={254} w={130} label="Cancel" fs={18} />
    <Btn x={400} y={254} w={130} label="Save" primary press={f >= T.clickTabSave && f < T.clickTabSave + 6 ? 1 : 0} fs={18} />
  </Modal>
);
const LessonModal: React.FC<{ f: number }> = ({ f }) => {
  const open = f >= T.clickType;
  const hs: [number, number][] = [[T.hVideo, 0], [T.hSlide, 2], [T.hQuiz, 3], [T.hAssign, 4], [T.hDoc, 5]];
  let hi = -1;
  hs.forEach(([t, i]) => { if (f >= t) hi = i; });
  return (
    <Modal f={f} a={T.clickLesson + 4} b={T.closeLesson + 4} w={720} h={700} title="Add Lesson">
      <div style={{ position: "absolute", left: 30, top: 84, display: "flex", gap: 0, width: 660, height: 52, borderRadius: 12, background: "#F3F4F6", padding: 4, boxSizing: "border-box" }}>
        <div style={{ flex: 1, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: GRAY }}>Add Chapter</div>
        <div style={{ flex: 1, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, background: "#fff", color: BLUE, boxShadow: "0 2px 6px #0002" }}>Add Lesson</div>
      </div>
      <div style={{ position: "absolute", left: 30, top: 164, fontSize: 17, fontWeight: 800, color: "#374151" }}>Title</div>
      <div style={{ position: "absolute", left: 30, top: 192, width: 660, height: 52, borderRadius: 12, boxSizing: "border-box", border: "2px solid #D1D5DB", padding: "0 16px", display: "flex", alignItems: "center", fontSize: 18, fontWeight: 600, color: "#9CA3AF" }}>Enter title</div>
      <div style={{ position: "absolute", left: 30, top: 268, fontSize: 17, fontWeight: 800, color: "#374151" }}>Select type</div>
      <div style={{ position: "absolute", left: 30, top: 296, width: 660, height: 52, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${open ? BLUE : "#D1D5DB"}`, boxShadow: open ? "0 0 0 5px #C7D2FE" : "none", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 18, fontWeight: 600, color: hi >= 0 ? INK : "#9CA3AF" }}>
        <span>{hi >= 0 ? LTYPES[hi] : "Select type"}</span><span style={{ color: GRAY }}>⌄</span>
      </div>
      {open && (
        <div style={{ position: "absolute", left: 30, top: 356, width: 660, borderRadius: 14, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0004", padding: 6, opacity: pr(f, T.clickType, 8), transform: `translateY(${(1 - pr(f, T.clickType, 10)) * -10}px)` }}>
          {LTYPES.map((t, i) => <div key={t} style={{ height: 36, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, fontWeight: i === hi ? 900 : 600, color: i === hi ? BLUE : "#374151", background: i === hi ? "#EEF2FF" : "transparent" }}>{t}</div>)}
        </div>
      )}
    </Modal>
  );
};
const BulkModal: React.FC<{ f: number }> = ({ f }) => {
  const csv = f >= T.radioCsv && f < T.radioAi, ai = f >= T.radioAi;
  const prompt = typed(f, T.typePrompt, "A 4-week leadership course for new team leads", 1.1);
  const genPress = f >= T.clickGen && f < T.clickGen + 6 ? 1 : 0;
  const Radio = ({ on, y, label }: { on: boolean; y: number; label: string }) => (
    <div style={{ position: "absolute", left: 30, top: y, display: "flex", alignItems: "center", gap: 14, fontSize: 20, fontWeight: 700, color: INK }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${on ? BLUE : "#9CA3AF"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <div style={{ width: 12, height: 12, borderRadius: "50%", background: BLUE }} />}</div>{label}
    </div>
  );
  return (
    <Modal f={f} a={T.clickBulk + 4} b={T.closeBulk} w={780} h={700} title="Bulk Upload Chapters">
      <div style={{ position: "absolute", left: 30, top: 74, width: 720, fontSize: 16, fontWeight: 600, color: GRAY, lineHeight: 1.4 }}>Add chapters and lessons to your course using a CSV file or generate content using AI.</div>
      <div style={{ position: "absolute", left: 30, top: 150, fontSize: 20, fontWeight: 900, color: INK }}>Choose Upload Method</div>
      <Radio on={csv} y={200} label="Upload CSV File" />
      <Radio on={ai} y={250} label="Generate by AI" />
      {csv && (
        <div style={{ position: "absolute", left: 30, top: 310, width: 720, opacity: pr(f, T.radioCsv, 8) }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#374151" }}>Select CSV File</div>
          <div style={{ marginTop: 10, height: 52, borderRadius: 12, border: "2px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, fontWeight: 600, color: "#6B7280" }}>Choose file</div>
          {f >= T.fileIn && <div style={{ marginTop: 10, fontSize: 17, fontWeight: 700, color: GREEN, opacity: pr(f, T.fileIn, 8) }}>Selected File: leadership_outline.csv</div>}
        </div>
      )}
      {ai && (
        <div style={{ position: "absolute", left: 30, top: 310, width: 720, opacity: pr(f, T.radioAi, 8) }}>
          <div style={{ height: 150, borderRadius: 12, border: `2px solid ${BLUE}`, boxShadow: "0 0 0 5px #C7D2FE", padding: "14px 16px", fontSize: 18, fontWeight: 600, color: prompt ? INK : "#9CA3AF", boxSizing: "border-box" }}>{prompt || "Enter your prompt here..."}</div>
          <Btn x={0} y={176} w={210} label="Generate Content" primary press={genPress} fs={18} />
          {f >= T.clickGen + 4 && <div style={{ position: "absolute", left: 230, top: 188, fontSize: 17, fontWeight: 800, color: BLUE, opacity: pr(f, T.clickGen + 4, 8) }}>✦ Drafting curriculum…</div>}
        </div>
      )}
    </Modal>
  );
};
const PubToast: React.FC<{ f: number }> = ({ f }) => (f >= T.toast && f < T.toast + 70 ? (
  <div style={{ position: "absolute", right: 36, top: 24, padding: "14px 24px", borderRadius: 14, background: "#fff", borderLeft: `6px solid ${GREEN}`, boxShadow: "0 16px 40px #0004", fontSize: 19, fontWeight: 800, color: INK, transform: `translateX(${(1 - pr(f, T.toast, 10)) * 80}px)`, opacity: pr(f, T.toast, 10) * (1 - lin(f, T.toast + 58, T.toast + 70)), fontFamily: FONT }}>✓&nbsp; Course published successfully</div>
) : null);

// ───────────────────────── demo ─────────────────────────
const SWITCHW = MA(LCOL[4] + 32 + TX, 130 + 56 + 37);
const TABNEW = CT(250 + 1245 - 250, 160);
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickMenu - 10, 560, 420, 1.2],
  [T.clickMenu + 12, 960, 520, 1.0],
  [T.clickNew - 20, 1400, 240, 1.3],
  [T.clickNew + 6, 1480, 240, 1.45],
  [T.formIn + 20, 960, 540, 1.05],
  [T.typeTitle, 960, 480, 1.25],
  [T.stepA, 960, 360, 1.2],
  [T.stepB + 10, 960, 380, 1.15],
  [T.editIn + 20, 960, 480, 1.0],
  [T.clickTabNew - 14, 1480, 330, 1.35],
  [T.typeTab, 960, 500, 1.3],
  [T.clickTabSave + 14, 900, 360, 1.25],
  [T.clickChapter - 6, 1300, 480, 1.3],
  [T.chapIn + 14, 1000, 560, 1.12],
  [T.lessonsIn + 30, 1000, 620, 1.12],
  [T.clickLesson + 6, 960, 540, 1.1],
  [T.clickType - 4, 960, 520, 1.3],
  [T.hQuiz, 960, 640, 1.3],
  [T.hDoc + 20, 960, 640, 1.3],
  [T.closeLesson + 10, 1100, 400, 1.2],
  [T.clickBulk - 10, 1500, 240, 1.4],
  [T.clickBulk + 20, 960, 540, 1.15],
  [T.radioCsv, 900, 520, 1.3],
  [T.radioAi, 900, 560, 1.3],
  [T.typePrompt + 30, 960, 640, 1.25],
  [T.clickGen + 10, 960, 640, 1.2],
  [T.toList + 10, 1000, 480, 1.05],
  [T.clickSwitch - 10, 1150, 400, 1.5],
  [T.toast + 20, 1250, 380, 1.4],
  [P7_START, 960, 540, 1.0],
]);
const LASTROW = MA(0, 0);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 800],
  [T.clickMenu, 245 + 120 + 40, 96 + 52 + 22 + 114],
  [T.clickNew, ADDNEW[0], ADDNEW[1]],
  [T.typeTitle - 6, 1000, 560],
  [T.editIn + 20, 1000, 620],
  [T.clickTabNew, ADDTAB[0] + 80, ADDTAB[1] - 16],
  [T.clickTabSave, CT(800 + 130 - 0, 418 + 99 + 120)[0], 700],
  [T.clickChapter, ADDCH[0] + 60, ADDCH[1] + 10],
  [T.clickLesson, ADDLS[0] + 40, ADDLS[1] + 10],
  [T.clickType, 960, 640 - 14],
  [T.hQuiz - 4, 960, 760],
  [T.closeLesson, 1250, 820],
  [T.clickBulk, BULK[0] + 100, BULK[1]],
  [T.radioCsv, 820, 615],
  [T.radioAi, 820, 665],
  [T.clickGen, 760, 855],
  [T.closeBulk, 1500, 300],
  [T.clickSwitch, SWITCHW[0], SWITCHW[1]],
  [T.toast + 20, 1300, 520],
]);

const STEPS = [
  { at: SEG_START.d1, to: SEG_START.d2, label: "ADD NEW" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "SIX SHORT STEPS" },
  { at: SEG_START.d3, to: SEG_START.d4, label: "TABS, CHAPTERS, LESSONS" },
  { at: SEG_START.d4, to: SEG_START.d5, label: "LESSON TYPES" },
  { at: SEG_START.d5, to: SEG_START.d6, label: "BULK UPLOAD OR AI" },
  { at: SEG_START.d6, to: P7_START, label: "PUBLISH" },
];

const DemoScene: React.FC<{ f: number }> = ({ f }) => {
  const [mx, my] = MA(0, 0);
  const listShown = f >= T.clickMenu + 6;
  const dashO = 1 - pr(f, T.clickMenu + 4, 10);
  void mx; void my;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} cx={960} cy={540} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        <LandWin
          f={f} inAt={T.appIn} url="academy.skillbnk.com/courses" active="Courses & Programs"
          main={
            <>
              {dashO > 0.01 && <div style={{ position: "absolute", inset: 0, opacity: dashO }}><DashSkeleton /></div>}
              {listShown && <Pg f={f} a={T.clickMenu + 6} b={T.formIn}><ListPage f={f} /></Pg>}
              <Pg f={f} a={T.formIn} b={T.editIn}><CreatePage f={f} /></Pg>
              <Pg f={f} a={T.editIn} b={T.toList}><EditPage f={f} /></Pg>
              <Pg f={f} a={T.toList}><ListPage f={f} /></Pg>
            </>
          }
          overlay={<><TabModal f={f} /><LessonModal f={f} /><BulkModal f={f} /><PubToast f={f} /></>}
        />
        <Scribble f={f} at={T.clickNew - 22} d={16} out={T.clickNew + 14} kind="ring" x={ADDNEW[0] - 6} y={ADDNEW[1] + 4} w={220} h={78} seed={3} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.hVideo} d={14} out={T.hSlide - 4} kind="under" x={CT(800, 0)[0] - 100} y={CT(0, 0)[1] + 389} w={160} seed={2} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.clickSwitch + 6} d={16} out={T.toast + 60} kind="ring" x={SWITCHW[0] + 2} y={SWITCHW[1]} w={110} h={64} seed={4} worldW={1920} worldH={1080} />
        <Confetti f={f} at={T.toast + 2} cx={SWITCHW[0] + 200} cy={SWITCHW[1] + 40} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={P7_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

// ───────────────────────── HOOK: 11 places ─────────────────────────
const HK = {
  daniel: cue("h0", "daniels", -4),
  eleven: cue("h0", "eleven", -6),
  places: cue("h0", "places", 0),
  videos: cue("h0", "videos", -2),
  slides: cue("h0", "slides", -2),
  quizzes: cue("h0", "quizzes", -2),
  email: cue("h0", "email", -2),
};
type Tile = { l: string; ic: string; c: string; x: number; y: number; r: number; kind?: string };
const TILES: Tile[] = [
  { l: "Welcome.mp4", ic: "🎬", c: "#EF4444", x: 230, y: 250, r: -6, kind: "video" },
  { l: "Week 2 recording", ic: "🎬", c: "#F97316", x: 1480, y: 230, r: 5, kind: "video" },
  { l: "Slides_v3.pptx", ic: "📊", c: "#F59E0B", x: 120, y: 560, r: 4, kind: "slide" },
  { l: "Feedback deck (old)", ic: "📊", c: "#EAB308", x: 1560, y: 560, r: -4, kind: "slide" },
  { l: "Outline FINAL.docx", ic: "📄", c: "#3B82F6", x: 330, y: 820, r: -3 },
  { l: "Reading list.txt", ic: "📝", c: "#64748B", x: 1380, y: 820, r: 6 },
  { l: "Quiz FINAL(2).pdf", ic: "📕", c: "#DC2626", x: 640, y: 170, r: 3, kind: "quiz" },
  { l: "Quiz answers", ic: "📕", c: "#F43F5E", x: 1130, y: 160, r: -5, kind: "quiz" },
  { l: "Old email: “quiz?”", ic: "✉", c: "#8B5CF6", x: 700, y: 860, r: -4, kind: "email" },
  { l: "Assignment.docx", ic: "📄", c: "#0EA5E9", x: 1110, y: 880, r: 3 },
  { l: "Link in chat", ic: "🔗", c: "#14B8A6", x: 60, y: 840, r: 7 },
];
const TileView: React.FC<{ f: number; t: Tile; i: number; at: number; hot?: number; toX?: number; toY?: number; to?: number }> = ({ f, t, i, at, hot = 0, toX = 960, toY = 540, to = 0 }) => {
  const s = sp(f, at + i * 3, 30, { damping: 10, stiffness: 190 });
  const bx = t.x + Math.sin(f / (40 + i * 5) + i) * 14, by = t.y + Math.cos(f / (46 + i * 4) + i) * 12;
  const x = bx + (toX - 150 - bx) * to, y = by + (toY - 40 - by) * to;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300, height: 82, borderRadius: 18, background: "#fff", boxShadow: `0 20px 50px #0008${hot > 0 ? `, 0 0 0 ${6 * hot}px ${t.c}` : ""}`, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", fontSize: 22, fontWeight: 800, color: INK, whiteSpace: "nowrap", opacity: Math.min(1, s * 2) * (1 - to * 0.9), transform: `rotate(${t.r * (1 - to)}deg) scale(${(0.3 + 0.7 * Math.min(1.08, s)) * (1 + hot * 0.12) * (1 - to * 0.4)})` }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: t.c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{t.ic}</div>{t.l}
    </div>
  );
};
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const H0 = DURATIONS.h0;
  const warm = lin(f, HK.eleven - 6, HK.email + 20);
  const n = countUp(f, HK.eleven, 11, Math.max(16, HK.places - HK.eleven));
  const push = 1 + 0.04 * lin(f, 0, H0);
  const hotOf = (kind: string, at: number) => (f >= at && f < at + 30 ? Math.sin(((f - at) / 30) * Math.PI) : 0);
  const drift = { x: Math.sin(f / 31) * 3, y: Math.cos(f / 37) * 3 };
  const sIn = sp(f, HK.eleven - 4, 30, { damping: 11 });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `translate(${drift.x}px,${drift.y}px) scale(${push})` }}>
        <div style={{ position: "absolute", left: 0, top: 36, width: 1920, display: "flex", justifyContent: "center", opacity: pr(f, 4, 10) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 30px 8px 10px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: 4 }}><Avatar t="D" s={46} c1="#F59E0B" c2="#B45309" />DANIEL · COACH</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 330, width: 1920, textAlign: "center", opacity: Math.min(1, sIn * 1.6), transform: `scale(${0.5 + 0.5 * Math.min(1.05, sIn)})` }}>
          <div style={{ fontSize: 330, fontWeight: 900, lineHeight: 1, color: "#fff", textShadow: "0 0 90px #F59E0B, 0 20px 60px #000A", fontVariantNumeric: "tabular-nums" }}>{n}</div>
          <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: 10, color: "#FCD34D" }}>PLACES</div>
        </div>
        {TILES.map((t, i) => <TileView key={t.l} f={f} t={t} i={i} at={HK.eleven - 2} hot={t.kind === "video" ? hotOf("video", HK.videos) : t.kind === "slide" ? hotOf("slide", HK.slides) : t.kind === "quiz" ? hotOf("quiz", HK.quizzes) : t.kind === "email" ? hotOf("email", HK.email) : 0} />)}
        <Scribble f={f} at={HK.email + 2} d={16} out={H0 + 20} kind="ring" x={TILES[8].x + 150} y={TILES[8].y + 41} w={380} h={130} seed={5} color="#F87171" sw={9} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── PAYOFF ─────────────────────────
const PY = { one: cue("p7", "one", -2), place: cue("p7", "place"), daniel: cue("p7", "daniel"), lives: cue("p7", "lives") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const fly = lin(f, P7_START + 2, PY.place + 6);
  const cnt = Math.max(1, Math.round(interpolate(fly, [0, 1], [11, 1])));
  const card = sp(f, PY.one, 30, { damping: 13, stiffness: 160 });
  const pub = sp(f, PY.daniel, 30, { damping: 10 });
  const push = 1 + 0.03 * lin(f, P7_START, SCENES_END);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, P7_START, 8) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.34), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {TILES.map((t, i) => <TileView key={t.l} f={P7_START + 40} t={t} i={i} at={P7_START - 100} to={Easing01(fly)} toX={960} toY={540} />)}
        <div style={{ position: "absolute", left: 0, top: 120, width: 1920, textAlign: "center" }}>
          <span style={{ fontSize: 120, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums", textShadow: "0 0 70px #3B82F6" }}>{cnt}</span>
          <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: 8, color: "#93C5FD", marginLeft: 22 }}>{cnt === 1 ? "PLACE" : "PLACES"}</span>
        </div>
        <div style={{ position: "absolute", left: 600, top: 380, width: 720, height: 360, borderRadius: 30, background: "#fff", boxShadow: "0 50px 130px #000C", padding: 40, boxSizing: "border-box", opacity: Math.min(1, card * 1.6), transform: `scale(${0.6 + 0.4 * Math.min(1.05, card)})` }}>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <div style={{ width: 120, height: 88, borderRadius: 14, background: "linear-gradient(135deg,#C7D2FE,#93C5FD)" }} />
            <div>
              <div style={{ fontSize: 38, fontWeight: 900, color: INK, lineHeight: 1.1 }}>{COURSE}</div>
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}><Badge t="Native" c="#15803D" bg="#DCFCE7" fs={18} /><Badge t={TAB} c={BLUE} bg="#EEF2FF" fs={18} /></div>
            </div>
          </div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
            {CHAPTERS.map((c, i) => <div key={c.n} style={{ height: 48, borderRadius: 12, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 18px", fontSize: 21, fontWeight: 800, color: INK, opacity: pr(f, PY.one + 10 + i * 8, 10) }}>{c.n}<span style={{ marginLeft: "auto", fontSize: 17, color: GRAY }}>{c.ls.length} lessons</span></div>)}
          </div>
          <div style={{ position: "absolute", right: 34, top: 36, opacity: Math.min(1, pub * 2), transform: `scale(${0.7 + 0.3 * Math.min(1.05, pub)})` }}><Badge t="Published" c="#15803D" bg="#DCFCE7" fs={22} dot /></div>
        </div>
        <Confetti f={f} at={PY.lives} cx={960} cy={560} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Easing01 = (p: number) => p * p * (3 - 2 * p);

// ───────────────────────── SFX + MAIN ─────────────────────────
type Fx = [number, string, number];
const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(HK.daniel, "swish", 0.35);
  for (let i = 0; i < 11; i++) add(HK.eleven - 2 + i * 3, "pop", 0.3);
  add(HK.places, "thud", 0.6); add(HK.eleven - 6, "riser", 0.3);
  [HK.videos, HK.slides, HK.quizzes, HK.email].forEach((t) => add(t, "ding", 0.3));
  add(DURATIONS.h0 - 6, "whoosh", 0.5);
  add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  add(T.formIn, "swish", 0.4);
  for (let i = 0; i < 24; i++) add(T.typeTitle + i * 1.2, ["key0", "key1", "key2"][i % 3], 0.18);
  for (let i = 0; i < 6; i++) add(T.stepA + 4 + (i / 6) * (T.stepB - T.stepA), "ding", 0.3);
  add(T.editIn, "swish", 0.4);
  for (let i = 0; i < 11; i++) add(T.typeTab + i * 1.5, ["key0", "key1", "key2"][i % 3], 0.18);
  add(T.clickTabSave + 4, "pop", 0.5); add(T.chapIn, "pop", 0.4); add(T.chapIn + 14, "pop", 0.4);
  for (let i = 0; i < 4; i++) add(T.lessonsIn + i * 9, "pop", 0.3);
  add(T.clickLesson + 4, "swish", 0.4); add(T.clickType, "pop", 0.4);
  [T.hVideo, T.hSlide, T.hQuiz, T.hAssign, T.hDoc].forEach((t) => add(t, "ding", 0.35));
  add(T.clickBulk + 4, "swish", 0.4); add(T.fileIn, "thud", 0.45);
  for (let i = 0; i < 20; i++) add(T.typePrompt + i * 1.6, ["key0", "key1", "key2"][i % 3], 0.16);
  add(T.clickGen + 4, "riser", 0.35); add(T.toList, "swish", 0.4);
  add(T.toast, "chime", 0.8);
  add(P7_START - 3, "whoosh", 0.5); add(PY.one, "thud", 0.5); add(PY.place, "pop", 0.5); add(PY.daniel, "chime", 0.7); add(PY.lives, "chime", 0.6);
  return a;
})();

export const CourseManageStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  const musicVol = (lf: number, len: number) => (MUSIC ? 0.1 * Math.min(1, lf / 20) * Math.min(1, (len - lf) / 24) : 0);
  return (
    <AbsoluteFill style={{ background: "#040716" }}>
      <Sequence from={0} durationInFrames={DURATIONS.h0 + 6}><Hook f={f} /></Sequence>
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
      <Sequence from={DEMO_START - 2} durationInFrames={P7_START - DEMO_START + 14}><DemoScene f={f} /></Sequence>
      <Sequence from={P7_START} durationInFrames={SCENES_END - P7_START}><Payoff f={f} /></Sequence>
      <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>

      {(f < INTRO_START + 4 || (f >= DEMO_START - 4 && f < SCENES_END + 2)) && <Finish f={f} w={1920} h={1080} />}
      <Flash f={f} at={INTRO_START} w={1920} h={1080} />
      <Flash f={f} at={DEMO_START} color="#0B1A55" streak={false} d={6} w={1920} h={1080} />
      <Flash f={f} at={P7_START} w={1920} h={1080} />
      <Flash f={f} at={SCENES_END} d={8} w={1920} h={1080} />

      {SEGS.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={k} from={SEG_START[k] + 2} durationInFrames={DURATIONS[k]}><Audio src={staticFile(`coursestory/${k}.mp3`)} /></Sequence>
      ))}
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={t} durationInFrames={80}><Audio src={staticFile(`story/sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {MUSIC && (
        <>
          <Sequence from={0} durationInFrames={INTRO_START + 10}><Audio src={staticFile("story/music.wav")} volume={(lf) => musicVol(lf, INTRO_START + 10)} loop /></Sequence>
          <Sequence from={DEMO_START - 6} durationInFrames={SCENES_END - DEMO_START + 12}><Audio src={staticFile("story/music.wav")} startFrom={300} volume={(lf) => musicVol(lf, SCENES_END - DEMO_START + 12)} loop /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
