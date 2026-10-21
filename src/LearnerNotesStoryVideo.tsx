import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Badge, Btn, CT, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, PageHead, Fx } from "./storyShell";

/**
 * LearnerNotesStoryVideo — premium landscape (sheet serial 36). Learner portal only. Story: Tomas Reyes, pharmacy-tech learner (fictional).
 * Verified in code (SB-Learner): lesson page tabs Overview / Sticky Notes / Download / Ratings (program/[slug] VideoContent + NewAddNote),
 * ProgramSlugNotes ("Sticky Notes", "Add Note", "New Note", Title "Enter title", Tags "Search or add tags...", "Note Content"
 * "Write something", "Save Note", toast "Note added successfully"); MyNotesPage ("My Notes", "All My Notes in One Place",
 * Grid View / List View, "Add Note"); MyNotesComponents ("Add Note", "Fill out the form to add new note", Title, Purpose
 * ("Link this note to a bootcamp, course, or other resource"), Tags, Description, "Save & Close", toast "Added new note successfully").
 * Voice: python3 generate-voice-story.py src/LearnerNotesStoryVideo.tsx public/notesstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "p5"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 306,
  d1: 193,
  d2: 226,
  d3: 220,
  d4: 229,
  p5: 165,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "p5"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [12, 23, 35, 51, 74, 81, 87, 109, 112, 117, 140, 144, 152, 163, 207, 213, 225, 241, 252, 261, 276, 282],
  d1: [2, 23, 46, 49, 56, 65, 87, 93, 102, 109, 116, 135, 144, 162],
  d2: [2, 20, 52, 62, 83, 96, 109, 111, 120, 126, 135, 142, 147, 159, 195, 198],
  d3: [2, 42, 48, 60, 73, 102, 109, 130, 135, 148, 169, 177, 183],
  d4: [2, 24, 36, 52, 81, 81, 87, 88, 95, 106, 114, 139, 156, 156, 180, 196],
  p5: [2, 16, 27, 38, 48, 89, 91, 117, 124, 136],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Tomas takes great notes. On sticky papers, on his phone, and in forty screenshots. Exam week, he can't find any of them.",
  d1: "This time, in his learner portal, he opens the lesson, and clicks Sticky Notes.",
  d2: "Add Note. A title, a tag, and the dosage rule he must not forget. Save Note.",
  d3: "Later, he opens My Notes. Every note, from every lesson, in one place.",
  d4: "He adds one more, links it to his program with Purpose, and clicks Save and Close.",
  p5: "Every note in one place. Exam week, Tomas is ready.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, SEG_START, WT);

const MENU = ["Dashboard", "My Program", "My Notes", "Documents and Labs", "Audio & Videos", "Assignments"];
const ICONS = ["▦", "🎓", "🗒", "📄", "🎬", "📝"];
const NOTE_T = "Pediatric dose rule";
const NOTE_C = "Always calculate by weight: mg/kg × kg. Double-check with the pharmacist before dispensing.";

const T = {
  appIn: DEMO_START,
  clickSticky: cue("d1", "sticky", -4),
  clickAdd: cue("d2", "add", -4),
  typeTitle: cue("d2", "title", -2),
  tag: cue("d2", "tag", -2),
  typeBody: cue("d2", "dosage", -4),
  clickSave: cue("d2", "save", 0),
  clickMy: cue("d3", "my", -6),
  every: cue("d3", "every"),
  clickAdd2: cue("d4", "adds", -2),
  purpose: cue("d4", "purpose", -6),
  clickSC: cue("d4", "save", 2),
};
const CLICKS = [T.clickSticky, T.clickAdd, T.typeTitle, T.tag, T.typeBody, T.clickSave, T.clickMy, T.clickAdd2, T.purpose, T.clickSC];
const page = (f: number) => (f >= T.clickMy + 2 ? "my" : "lesson");

// ───────── lesson page with sticky notes ─────────
const LessonPage: React.FC<{ f: number }> = ({ f }) => {
  const tab = f >= T.clickSticky + 2 ? "Sticky Notes" : "Overview";
  const saved = f >= T.clickSave + 2;
  const editing = f >= T.clickAdd + 2 && !saved;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <div style={{ position: "absolute", left: 32, top: 22, fontSize: 16, fontWeight: 800, color: BLUE, letterSpacing: 1 }}>PHARMACY TECHNICIAN · CHAPTER 3</div>
      <div style={{ position: "absolute", left: 32, top: 48, fontSize: 30, fontWeight: 900, color: INK }}>Dosage calculations</div>
      <div style={{ position: "absolute", left: 32, top: 100, width: 760, height: 428, borderRadius: 18, background: "linear-gradient(135deg,#0EA5E9,#0F172A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 80 }}>▶</div>
      <div style={{ position: "absolute", left: 32, top: 548, display: "flex", gap: 30, borderBottom: `2px solid ${LINE}`, width: 760 }}>
        {["Overview", "Sticky Notes", "Download", "Ratings"].map((t) => <div key={t} style={{ paddingBottom: 12, fontSize: 19, fontWeight: 800, color: t === tab ? BLUE : GRAY, borderBottom: t === tab ? `3px solid ${BLUE}` : "3px solid transparent", marginBottom: -2, background: t === "Sticky Notes" && f >= T.clickSticky - 12 && f < T.clickSticky + 4 ? "#EEF2FF" : "transparent", borderRadius: 6, padding: "4px 8px 12px" }}>{t}</div>)}
      </div>
      {tab === "Overview" && <div style={{ position: "absolute", left: 32, top: 610, width: 760, fontSize: 19, fontWeight: 600, color: GRAY, lineHeight: 1.5 }}>Weight-based dosing, unit conversions and the checks every technician runs before dispensing.</div>}
      {tab === "Sticky Notes" && (
        <div style={{ position: "absolute", left: 830, top: 100, width: 500, height: 700, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}`, padding: 24, boxSizing: "border-box", opacity: pr(f, T.clickSticky + 2, 10) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Sticky Notes</div>
            <div style={{ padding: "10px 18px", borderRadius: 12, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 17, transform: `scale(${f >= T.clickAdd && f < T.clickAdd + 6 ? 0.92 : 1})` }}>＋ Add Note</div></div>
          {!editing && !saved && <div style={{ marginTop: 120, textAlign: "center" }}><div style={{ fontSize: 50 }}>🗒</div><div style={{ fontSize: 21, fontWeight: 900, color: INK }}>No Notes Available</div><div style={{ marginTop: 8, fontSize: 16, fontWeight: 600, color: GRAY }}>Create a new sticky note to keep track of important information.</div></div>}
          {editing && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#374151" }}>Title</div>
              <div style={{ marginTop: 6, height: 48, borderRadius: 12, border: `2px solid ${f >= T.typeTitle && f < T.tag ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, fontWeight: 700, color: INK }}>{typed(f, T.typeTitle, NOTE_T, 1.2) || <span style={{ color: "#9CA3AF" }}>Enter title</span>}</div>
              <div style={{ marginTop: 14, fontSize: 16, fontWeight: 800, color: "#374151" }}>Tags</div>
              <div style={{ marginTop: 6, height: 48, borderRadius: 12, border: `2px solid ${f >= T.tag && f < T.typeBody ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", fontSize: 17, color: "#9CA3AF" }}>{f >= T.tag + 6 ? <Badge t="exam" c={BLUE} bg="#EEF2FF" fs={14} /> : "Search or add tags..."}</div>
              <div style={{ marginTop: 14, fontSize: 16, fontWeight: 800, color: "#374151" }}>Note Content</div>
              <div style={{ marginTop: 6, height: 190, borderRadius: 12, border: `2px solid ${f >= T.typeBody ? BLUE : "#D1D5DB"}`, padding: 14, boxSizing: "border-box", fontSize: 18, fontWeight: 600, color: f >= T.typeBody ? INK : "#9CA3AF", lineHeight: 1.5 }}>{f >= T.typeBody ? typed(f, T.typeBody, NOTE_C, 2.2) : "Write something"}</div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <span style={{ padding: "12px 20px", borderRadius: 12, border: `2px solid ${LINE}`, fontWeight: 800, fontSize: 17 }}>Cancel</span>
                <span style={{ padding: "12px 22px", borderRadius: 12, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 17, transform: `scale(${f >= T.clickSave && f < T.clickSave + 6 ? 0.92 : 1})` }}>Save Note</span>
              </div>
            </div>
          )}
          {saved && (
            <div style={{ marginTop: 22, padding: 18, borderRadius: 14, background: "#FEF9C3", border: "2px solid #FDE047", opacity: pr(f, T.clickSave + 2, 10) }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>{NOTE_T}</div>
              <div style={{ marginTop: 8, fontSize: 17, fontWeight: 600, color: "#374151", lineHeight: 1.45 }}>{NOTE_C}</div>
              <div style={{ marginTop: 10 }}><Badge t="exam" c={BLUE} bg="#EEF2FF" fs={13} /></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const LP = (x: number, y: number) => CT(250 + x, y);
const STICKY = LP(32 + 190, 548 + 18);
const ADDN = LP(830 + 500 - 24 - 70, 100 + 24 + 20);
const SAVEN = LP(830 + 500 - 24 - 60, 100 + 24 + 50 + 20 + 22 + 48 + 14 + 22 + 48 + 14 + 22 + 190 + 18 + 24);

// ───────── My Notes ─────────
const MYN: [string, string, string][] = [[NOTE_T, "exam", "#FEF9C3"], ["Look-alike drug names", "safety", "#DBEAFE"], ["Sterile compounding steps", "lab", "#DCFCE7"], ["Insurance rejection codes", "billing", "#FCE7F3"], ["Controlled substance log", "law", "#EDE9FE"]];
const MyNotes: React.FC<{ f: number }> = ({ f }) => {
  const added = f >= T.clickSC + 4;
  const notes: [string, string, string][] = added ? [["Exam day checklist", "exam", "#FFEDD5"], ...MYN] : MYN;
  const mo = f >= T.clickAdd2 + 2 && f < T.clickSC + 14 ? pr(f, T.clickAdd2 + 2, 10) * (1 - lin(f, T.clickSC + 4, T.clickSC + 14)) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC", opacity: pr(f, T.clickMy + 2, 10) }}>
      <PageHead title="My Notes" sub="All My Notes in One Place" />
      <div style={{ position: "absolute", left: 830, top: 28, display: "flex", gap: 8 }}>{["Grid View", "List View"].map((t, i) => <span key={t} style={{ padding: "10px 16px", borderRadius: 10, border: `2px solid ${i === 0 ? BLUE : LINE}`, color: i === 0 ? BLUE : GRAY, fontWeight: 800, fontSize: 16, background: "#fff" }}>{t}</span>)}</div>
      <Btn x={1130} y={24} w={170} label="＋  Add Note" primary fs={18} press={f >= T.clickAdd2 && f < T.clickAdd2 + 6 ? 1 : 0} />
      {notes.map(([t, g, c], i) => {
        const s = sp(f, T.clickMy + 6 + i * 4, 30, { damping: 13 });
        return (
          <div key={t} style={{ position: "absolute", left: 32 + (i % 3) * 430, top: 120 + Math.floor(i / 3) * 250, width: 400, height: 220, borderRadius: 18, background: c, border: `2px solid ${LINE}`, padding: 22, boxSizing: "border-box", opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 30}px)` }}>
            <div style={{ fontSize: 21, fontWeight: 900, color: INK }}>{t}</div>
            <div style={{ marginTop: 10, fontSize: 16, fontWeight: 600, color: "#4B5563", lineHeight: 1.45 }}>{i === (added ? 1 : 0) ? NOTE_C.slice(0, 70) + "…" : "Pharmacy Technician · Chapter " + (i + 2)}</div>
            <div style={{ position: "absolute", left: 22, bottom: 18 }}><Badge t={g} c={BLUE} bg="#fff" fs={13} /></div>
          </div>
        );
      })}
      {mo > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * mo})` }} />
          <div style={{ position: "absolute", left: 270, top: 60 + (1 - mo) * 40, width: 800, height: 640, borderRadius: 22, background: "#fff", opacity: mo, boxShadow: "0 40px 120px #000A", padding: 30, boxSizing: "border-box" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>Add Note</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: GRAY }}>Fill out the form to add new note</div>
            {[["Title", typed(f, T.clickAdd2 + 8, "Exam day checklist", 1.2), f < T.purpose], ["Purpose", f >= T.purpose + 6 ? "Pharmacy Technician — Fall 2026" : "", f >= T.purpose && f < T.clickSC], ["Tags", f >= T.purpose + 14 ? "exam" : "", false]].map(([l, v, on], i) => (
              <div key={l as string} style={{ marginTop: 18 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#374151" }}>{l as string}</div>
                <div style={{ marginTop: 6, height: 50, borderRadius: 12, border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 5px #C7D2FE" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 700, color: INK }}>{(v as string) || ""}{i === 1 && <span style={{ color: GRAY }}>⌄</span>}</div>
              </div>
            ))}
            <div style={{ marginTop: 18, fontSize: 16, fontWeight: 800, color: "#374151" }}>Description</div>
            <div style={{ marginTop: 6, height: 80, borderRadius: 12, border: "2px solid #D1D5DB", padding: 14, boxSizing: "border-box", fontSize: 17, color: INK, fontWeight: 600 }}>{f >= T.purpose + 10 ? "☐ ID + calculator  ☐ review dose rule  ☐ sleep 8h" : ""}</div>
            <div style={{ position: "absolute", right: 30, bottom: 28, display: "flex", gap: 10 }}>
              <span style={{ padding: "12px 22px", borderRadius: 12, border: `2px solid ${LINE}`, fontWeight: 800, fontSize: 17 }}>Cancel</span>
              <span style={{ padding: "12px 22px", borderRadius: 12, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 17, transform: `scale(${f >= T.clickSC && f < T.clickSC + 6 ? 0.92 : 1})` }}>Save & Close</span>
            </div>
          </div>
        </>
      )}
      <Toast f={f} at={T.clickSC + 3} text="Added new note successfully" />
    </div>
  );
};
const ADD2 = CT(250 + 1215, 48);
const PURP = CT(250 + 270 + 400, 60 + 30 + 34 + 18 + 22 + 76 + 18 + 22 + 25);
const SAVECL = CT(250 + 270 + 800 - 30 - 80, 60 + 640 - 28 - 24);

const camClamp = (k: K4): K4 => [k[0], Math.max(760, Math.min(1080, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.22, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickSticky - 12, 760, 640, 1.2],
  [T.clickSticky + 14, 1080, 520, 1.08],
  [T.typeTitle, 1080, 440, 1.2],
  [T.typeBody, 1080, 560, 1.2],
  [T.clickSave + 10, 1080, 500, 1.15],
  [T.clickMy - 12, 640, 440, 1.15],
  [T.clickMy + 14, 960, 520, 1.03],
  [T.every + 20, 960, 520, 1.08],
  [T.clickAdd2 + 14, 960, 520, 1.05],
  [T.purpose, 960, 480, 1.18],
  [T.clickSC - 6, 1080, 640, 1.2],
  [T.clickSC + 20, 960, 520, 1.05],
  [PAY_START, 960, 540, 1.05],
]).map(camClamp);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickSticky, STICKY[0], STICKY[1]],
  [T.clickAdd, ADDN[0], ADDN[1]],
  [T.typeTitle, ...LP(1080, 300)],
  [T.tag, ...LP(1080, 370)],
  [T.typeBody, ...LP(1080, 470)],
  [T.clickSave, SAVEN[0], SAVEN[1]],
  [T.clickMy, ...CT(125, 105 + 56 * 2)],
  [T.every + 10, 1000, 700],
  [T.clickAdd2, ADD2[0], ADD2[1]],
  [T.purpose, PURP[0], PURP[1]],
  [T.clickSC, SAVECL[0], SAVECL[1]],
]);
const STEPS = [
  { at: T.clickSticky, to: SEG_START.d2, label: "STICKY NOTES" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "ADD NOTE" },
  { at: SEG_START.d3, to: SEG_START.d4, label: "MY NOTES" },
  { at: SEG_START.d4, to: PAY_START, label: "LINK TO PROGRAM" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const p = page(f);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        <LandWin f={f} inAt={T.appIn} url={`learner.pharmaprep.example.com/${p === "my" ? "my-notes" : "program/pharmacy-tech"}`} active={p === "my" ? "My Notes" : "My Program"} menu={MENU} menuIcons={ICONS}
          main={p === "my" ? <MyNotes f={f} /> : <LessonPage f={f} />} overlay={<Toast f={f} at={T.clickSave + 3} text="Note added successfully" d={50} />} />
        <Scribble f={f} at={T.typeBody + 30} d={16} out={T.clickSave - 4} kind="under" x={LP(1080, 0)[0]} y={LP(0, 560)[1]} w={420} seed={4} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.every} d={16} out={T.clickAdd2 - 4} kind="ring" x={960} y={CT(0, 370)[1]} w={1360} h={560} seed={6} worldW={1920} worldH={1080} />
        <Confetti f={f} at={T.clickSC + 4} cx={900} cy={360} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { sticky: cue("h0", "sticky"), phone: cue("h0", "phone"), forty: cue("h0", "forty"), exam: cue("h0", "exam"), find: cue("h0", "find") };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.exam - 6, HK.find + 10);
  const shots = countUp(f, HK.forty - 6, 40, 18);
  const papers = ["mg/kg ??", "call pharm.", "DON'T FORGET", "ch.3 p.41"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * lin(f, 0, DURATIONS.h0)})` }}>
        <HookTag f={f} text="📚 EXAM WEEK · PHARMACY TECH" />
        {papers.map((t, i) => {
          const s = sp(f, HK.sticky - 6 + i * 5, 30, { damping: 10 });
          return <div key={t} style={{ position: "absolute", left: 200 + (i % 2) * 260, top: 220 + Math.floor(i / 2) * 280, width: 230, height: 230, background: ["#FDE047", "#F9A8D4", "#86EFAC", "#FDBA74"][i], boxShadow: "0 20px 50px #0009", transform: `rotate(${[-8, 6, 4, -5][i]}deg) scale(${Math.min(1, s)})`, opacity: Math.min(1, s * 2), padding: 22, boxSizing: "border-box", fontSize: 30, fontWeight: 900, color: "#1F2937", fontFamily: "'Comic Sans MS','Segoe Print',cursive" }}>{t}</div>;
        })}
        <div style={{ position: "absolute", left: 790, top: 160, width: 340, height: 700, borderRadius: 44, background: "#0B0F1A", border: "10px solid #1F2937", boxShadow: "0 40px 100px #000C", opacity: pr(f, HK.phone - 4, 12), padding: 24, boxSizing: "border-box" }}>
          <div style={{ color: "#E5E7EB", fontSize: 22, fontWeight: 900 }}>Notes</div>
          {["dosage thing", "untitled", "untitled 2", "remember!!", "untitled 3"].map((t) => <div key={t} style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#1F2937", color: "#CBD5E1", fontSize: 18, fontWeight: 700 }}>{t}</div>)}
        </div>
        <div style={{ position: "absolute", left: 1220, top: 230, width: 480, opacity: pr(f, HK.forty - 6, 12) }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>{Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ height: 90, borderRadius: 8, background: `hsl(${(i * 37) % 360},30%,${40 + (i % 3) * 10}%)` }} />)}</div>
          <div style={{ marginTop: 18, fontSize: 64, fontWeight: 900, color: "#fff" }}>{shots} <span style={{ fontSize: 30, color: "#CBD5E1" }}>screenshots</span></div>
        </div>
        <Scribble f={f} at={HK.find} d={18} out={DURATIONS.h0 + 20} kind="ring" x={960} y={540} w={1600} h={760} seed={7} color="#F87171" sw={10} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PY = { every: cue("p5", "every"), exam: cue("p5", "exam"), ready: cue("p5", "ready") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 8) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
    <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * lin(f, PAY_START, SCENES_END)})` }}>
      {MYN.concat([["Exam day checklist", "exam", "#FFEDD5"]]).map(([t, , c], i) => {
        const s = sp(f, PY.every + i * 4, 30, { damping: 12 });
        return <div key={t} style={{ position: "absolute", left: 280 + (i % 3) * 470, top: 220 + Math.floor(i / 3) * 290, width: 420, height: 240, borderRadius: 20, background: c, boxShadow: "0 30px 80px #000A", padding: 26, boxSizing: "border-box", fontSize: 26, fontWeight: 900, color: INK, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 50}px) rotate(${[-2, 1, -1, 2, -1, 1][i]}deg)` }}>🗒 {t}</div>;
      })}
      <div style={{ position: "absolute", left: 0, top: 860, width: 1920, textAlign: "center", fontSize: 54, fontWeight: 900, color: "#86EFAC", opacity: pr(f, PY.ready - 4, 10) }}>✓ Ready for exam week</div>
      <Confetti f={f} at={PY.ready} cx={960} cy={480} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); for (let i = 0; i < 4; i++) add(HK.sticky - 6 + i * 5, "pop", 0.35);
  add(HK.phone - 4, "swish", 0.35); add(HK.forty, "riser", 0.3); add(HK.find, "thud", 0.55);
  add(DURATIONS.h0 - 6, "whoosh", 0.5); add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  for (let i = 0; i < 12; i++) add(T.typeTitle + i * 1.4, ["key0", "key1", "key2"][i % 3], 0.18);
  for (let i = 0; i < 20; i++) add(T.typeBody + i * 2, ["key0", "key1", "key2"][i % 3], 0.16);
  add(T.clickSave + 2, "chime", 0.55); add(T.clickMy + 2, "swish", 0.4);
  for (let i = 0; i < 5; i++) add(T.clickMy + 6 + i * 4, "pop", 0.25);
  add(T.purpose + 6, "ding", 0.45); add(T.clickSC + 4, "chime", 0.65);
  add(PAY_START - 3, "whoosh", 0.5); for (let i = 0; i < 6; i++) add(PY.every + i * 4, "pop", 0.3); add(PY.ready, "chime", 0.65);
  return a;
})();

export const LearnerNotesStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="notesstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} />;
};
