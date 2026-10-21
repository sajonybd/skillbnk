import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, Table, PageHead, Fx } from "./storyShell";

/**
 * TranscriptionStoryVideo — DEEP (sheet serial 42, ~2.5 min). Story: Nadia Okafor, ClearPath Medical Billing Academy (fictional).
 * Verified in code: SB-Branch app/(authenticated)/transcription — GlobalHeader "Transcription" / "All Transcription Details are here",
 * search "Enter File Type/ID...", Bulk Upload, FilterModal (Updated Date, File type audio/mp3 audio/mpeg audio/wav, Status Finished /
 * Processing / Downloading), sort, Export (transcriptions.csv). Columns ID, File Name, File Type, File Size, Duration, Created By, Uploaded
 * Date, Processed Date, Status, Source, Finished Date, Action (Eye, export enabled only when Completed). ImportModal "Import Transcription",
 * "Choose a model and import method below.", "Choose a model:" Tiny (~32x) / Base (~16x) / Small (~6x) / Medium (~2x) / Large (~1x),
 * tabs Upload / Import From Link ("Enter link"), accept audio/video. FileDetails "Transcription Details", Export, "Clip Details of a
 * transcription", Player + Transcript lines (click to seek). ExportModal "Export File", "View and Download transcribed files.", Task ID,
 * Status, File Name, File Size bytes, MIME Type, "Download Files:" one button per transcribed file.
 * Lesson level: all-programs/Transcribe.tsx title "Transcribe", tabs Lesson Info / Transcribe / Summary / Interview Q&As / Behavioral Q&As /
 * Tech Impl.; Generate Transcription, Refresh Status, Copy to Transcription, Direct Download, "Generate with AI", Cancel / Save,
 * toast "Saved successfully". Learner: program/[slug] VideoContent tabs Overview / Add Notes / Download / Ratings, Resources tabs
 * Summary / Interview / Behavioral / Implementation.
 * Voice: python3 generate-voice-story.py src/TranscriptionStoryVideo.tsx public/transcribestory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 325,
  d1: 263,
  d2: 291,
  d3: 212,
  d4: 177,
  d5: 240,
  d6: 254,
  d7: 171,
  d8: 268,
  d9: 221,
  d10: 232,
  d11: 178,
  d12: 263,
  p13: 204,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 18, 28, 36, 44, 53, 84, 85, 97, 106, 118, 126, 133, 144, 151, 147, 189, 192, 199, 205, 215, 223, 228, 237, 252, 258, 267, 283, 289, 295],
  d1: [2, 12, 33, 42, 52, 60, 70, 109, 114, 121, 129, 135, 151, 163, 172, 184, 195, 198, 205, 218, 225, 233],
  d2: [2, 11, 20, 34, 73, 82, 87, 94, 101, 132, 134, 140, 157, 178, 178, 184, 189, 196, 220, 223, 230, 250, 254, 259],
  d3: [2, 12, 16, 27, 32, 39, 42, 57, 65, 70, 76, 107, 111, 117, 125, 132, 145, 150, 168, 174, 180],
  d4: [2, 12, 17, 20, 37, 41, 46, 52, 59, 90, 93, 98, 104, 120, 124, 130, 139, 147],
  d5: [2, 11, 25, 33, 58, 62, 70, 82, 89, 96, 105, 116, 134, 141, 151, 182, 184, 198],
  d6: [2, 10, 19, 30, 48, 54, 65, 96, 98, 106, 116, 121, 141, 142, 150, 157, 159, 165, 177, 186, 191, 201, 212, 216],
  d7: [2, 24, 32, 37, 45, 52, 63, 88, 88, 100, 102, 111, 121, 125, 132],
  d8: [2, 19, 33, 41, 56, 84, 87, 105, 105, 112, 122, 153, 158, 163, 169, 185, 187, 196, 205, 217, 226, 231],
  d9: [2, 17, 24, 36, 42, 69, 70, 74, 91, 96, 105, 125, 132, 137, 143, 153, 167, 177, 186],
  d10: [2, 12, 18, 30, 45, 51, 58, 66, 93, 95, 100, 106, 113, 135, 142, 148, 155, 165, 169, 174, 178, 185, 190, 196, 201],
  d11: [2, 9, 16, 24, 40, 49, 62, 74, 84, 93, 112, 126, 136, 146, 156],
  d12: [2, 18, 23, 29, 59, 63, 73, 80, 109, 112, 140, 145, 165, 169, 174, 194, 200, 205, 214, 228, 234],
  p13: [2, 15, 26, 31, 56, 66, 100, 112, 119, 132, 147, 156, 166, 172],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Nadia runs a medical billing academy. Her best teaching happens on live question and answer calls. Forty hours of recordings sit in a folder, and nobody ever watches them again.",
  d1: "In skillbank, those recordings go into Transcription. Every file shows its type, its size, its length, who uploaded it, and its status.",
  d2: "She clicks Bulk Upload. First, she chooses a model. Tiny is the fastest. Large is the most accurate. She picks Medium, a good balance.",
  d3: "She can import from a link, or upload the file itself. She drops in last Tuesday's call, and it starts uploading.",
  d4: "Back in the list, the new call is processing. A few minutes later, the status turns to completed.",
  d5: "With dozens of calls, she searches by file type or ID, and filters by type, status, or date.",
  d6: "The eye icon opens the transcription details. The recording plays on top, and every line of the conversation sits below it, with its time.",
  d7: "She clicks the line about denied claims, and the audio jumps straight to that moment.",
  d8: "Export lists the transcribed files, ready to download and reuse anywhere. And from the list, the whole library exports as a CSV.",
  d9: "Lessons can be transcribed too. In her course, she opens Transcribe on the claims lesson, and generates the transcription.",
  d10: "Copy to transcription puts the text in place. Then, on the summary tab, Generate with AI turns it into a short list of key points.",
  d11: "The same way, she generates interview questions with answers, and behavioral questions. Then she saves.",
  d12: "Now, the learner side. Omar opens the lesson. Under resources, the summary, the interview questions and the behavioral questions are waiting.",
  p13: "Forty hours of calls, finally searchable. Nadia's best answers now teach every new class.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "transcription", -6),
  tour: cue("d1", "type", -4),
  clickBulk: cue("d2", "bulk", -4),
  models: cue("d2", "tiny", -4),
  pickMedium: cue("d2", "medium", -4),
  clickLink: cue("d3", "link", -4),
  clickUploadTab: cue("d3", "upload", -2),
  drop: cue("d3", "drops", -4),
  uploading: cue("d3", "uploading", -2),
  back: cue("d4", "back", -2),
  done: cue("d4", "completed", -4),
  search: cue("d5", "searches", -4),
  clickFilter: cue("d5", "filters", -4),
  filterOff: S.d6 - 8,
  clickEye: cue("d6", "eye", -4),
  lines: cue("d6", "recording", 4),
  clickLine: cue("d7", "clicks", -2),
  clickExportD: cue("d8", "export", -4),
  exportOff: cue("d8", "list", -10),
  clickBack: cue("d8", "list", -4),
  clickCsv: cue("d8", "csv", -6),
  course: S.d9,
  clickTranscribe: cue("d9", "transcribe", -4),
  clickGen: cue("d9", "generates", -2),
  clickCopy: cue("d10", "copy", -4),
  clickSummary: cue("d10", "summary", -4),
  clickAiSum: cue("d10", "generate", -2),
  clickInterview: cue("d11", "interview", -4),
  clickAiInt: cue("d11", "answers", -2),
  clickBehav: cue("d11", "behavioral", -4),
  clickAiBeh: cue("d11", "behavioral", 8),
  clickSave: cue("d11", "saves", -2),
  learner: cue("d12", "learner", -8),
  lOpen: cue("d12", "opens", -2),
  lRes: cue("d12", "resources", -2),
  lInt: cue("d12", "interview", -2),
  lBeh: cue("d12", "behavioral", -2),
};
const CLICKS = [T.clickMenu, T.clickBulk, T.pickMedium, T.clickLink, T.clickUploadTab, T.drop, T.search, T.clickFilter, T.clickEye, T.clickLine, T.clickExportD, T.clickBack, T.clickCsv, T.clickTranscribe, T.clickGen, T.clickCopy, T.clickSummary, T.clickAiSum, T.clickInterview, T.clickAiInt, T.clickBehav, T.clickAiBeh, T.clickSave, T.lInt, T.lBeh];

// ───────── transcription list ─────────
const NEW = "qa-call-oct-14.mp3";
type R = { n: string; ty: string; sz: string; du: string; by: string; up: string; st: string; src: string };
const BASE: R[] = [
  { n: "qa-call-oct-07.mp3", ty: "audio/mp3", sz: "46.1 MB", du: "58:12", by: "Nadia Okafor", up: "Oct 07, 2026", st: "Completed", src: "Upload" },
  { n: "denials-workshop.mp4", ty: "video/mp4", sz: "312 MB", du: "1:24:40", by: "Nadia Okafor", up: "Oct 02, 2026", st: "Completed", src: "Link" },
  { n: "qa-call-sep-30.wav", ty: "audio/wav", sz: "88.4 MB", du: "51:03", by: "Ben Ruiz", up: "Sep 30, 2026", st: "Completed", src: "Upload" },
  { n: "modifier-25-recap.mp3", ty: "audio/mpeg", sz: "21.7 MB", du: "24:18", by: "Ben Ruiz", up: "Sep 24, 2026", st: "Completed", src: "Upload" },
  { n: "coding-basics-live.mp4", ty: "video/mp4", sz: "406 MB", du: "1:51:09", by: "Nadia Okafor", up: "Sep 18, 2026", st: "Completed", src: "Link" },
];
const COLS = [{ h: "File Name", w: 280 }, { h: "File Type", w: 130 }, { h: "File Size", w: 110 }, { h: "Duration", w: 100 }, { h: "Created By", w: 180 }, { h: "Uploaded Date", w: 150 }, { h: "Status", w: 140 }, { h: "Source", w: 90 }, { h: "Action", w: 120 }];
const TBX = 16, TBY = 116, RH = 62;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const ACTX = TBX + 1180 + 30; // eye button centre (Action col starts at 1180)
const stBadge = (st: string) => st === "Completed" ? <Badge t="Completed" c="#15803D" bg="#DCFCE7" fs={13} dot /> : st === "Processing" ? <Badge t="Processing" c="#1D4ED8" bg="#DBEAFE" fs={13} dot /> : <Badge t={st} c="#B45309" bg="#FEF3C7" fs={13} dot />;
const Icon: React.FC<{ x: number; y: number; on?: boolean; ch: string; w?: number; label?: string; primary?: boolean }> = ({ x, y, on, ch, w = 48, label, primary }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 48, borderRadius: 12, border: primary ? "none" : `2px solid ${on ? BLUE : LINE}`, background: primary ? BLUE : on ? "#EEF2FF" : "#fff", color: primary ? "#fff" : INK, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: label ? 16 : 20, fontWeight: 800, boxSizing: "border-box", boxShadow: primary ? "0 6px 16px #1D3FD640" : "none" }}>{ch}{label && <span>{label}</span>}</div>
);

const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const added = f >= T.back;
  const newSt = f >= T.done ? "Completed" : "Processing";
  const q = f >= T.search && f < T.clickEye ? typed(f, T.search + 4, "qa-call", 0.4) : "";
  const filt = q.length >= 7;
  const rows: R[] = added ? [{ n: NEW, ty: "audio/mp3", sz: "52.3 MB", du: "1:03:27", by: "Nadia Okafor", up: "Today, 9:40", st: newSt, src: "Upload" }, ...BASE] : BASE;
  const fo = f >= T.clickFilter + 2 && f < T.filterOff ? pr(f, T.clickFilter + 2, 10) * (1 - lin(f, T.filterOff - 10, T.filterOff)) : 0;
  const csvOn = f >= T.clickCsv - 4 && f < T.clickCsv + 40;
  return (
    <>
      <PageHead title="Transcription" sub="All Transcription Details are here" />
      <div style={{ position: "absolute", left: 470, top: 24, width: 330, height: 48, borderRadius: 12, border: `2px solid ${q ? BLUE : LINE}`, background: "#EEF2FF", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: q ? INK : "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>{q || "Enter File Type/ID..."}</div>
      <Btn x={812} y={24} w={140} label="Bulk Upload" primary fs={16} press={f >= T.clickBulk && f < T.clickBulk + 6 ? 1 : 0} />
      <Icon x={962} y={24} ch="⚲" on={fo > 0} />
      <Icon x={1018} y={24} ch="⇅" />
      <Icon x={1074} y={24} ch="⇪" w={120} label={csvOn && f < T.clickCsv + 20 ? "Exporting..." : "Export"} on={csvOn} />
      <Icon x={1204} y={24} ch="↻" />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={added ? 0 : -1} hlA={added ? 1 - lin(f, T.done + 40, T.done + 70) : 0}
        oRow={(i) => (added && i === 0 ? pr(f, T.back + 2, 12) : filt && !rows[i].n.startsWith("qa-call") ? 0.15 : 1)}
        rows={rows.map((r, i) => [
          <b style={{ fontWeight: 800, fontSize: 15 }}>{r.ty.startsWith("video") ? "🎬" : "🎧"} {r.n}</b>, <span style={{ fontSize: 14, color: GRAY }}>{r.ty}</span>,
          <span style={{ fontSize: 14 }}>{r.sz}</span>, <span style={{ fontSize: 14 }}>{r.du}</span>,
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}><Avatar t={r.by.split(" ").map((w) => w[0]).join("")} s={26} />{r.by}</div>,
          <span style={{ fontSize: 14, color: GRAY }}>{r.up}</span>, stBadge(r.st), <span style={{ fontSize: 14, color: GRAY }}>{r.src}</span>,
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ width: 40, height: 34, borderRadius: 8, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: i === 0 && f >= T.clickEye - 10 && f < T.clickEye + 6 ? "0 0 0 4px #C7D2FE" : "none" }}>👁</span>
            <span style={{ width: 40, height: 34, borderRadius: 8, background: r.st === "Completed" ? "#E0F2FE" : "#F3F4F6", color: r.st === "Completed" ? "#0369A1" : "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⇪</span>
          </div>,
        ])} />
      {fo > 0 && (
        <div style={{ position: "absolute", left: 600, top: 80, width: 470, padding: 20, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0004", opacity: fo, fontFamily: FONT, zIndex: 3 }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>Filter</div>
          {[["File type", "audio/mp3"], ["Status", "Finished"], ["Updated Date", "Last 30 days"]].map(([l, v], i) => (
            <div key={l} style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", opacity: pr(f, T.clickFilter + 8 + i * 8, 8) }}>
              <span style={{ width: 130, fontSize: 16, fontWeight: 800, color: "#374151" }}>{l}</span>
              <span style={{ flex: 1, height: 42, borderRadius: 10, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 16, fontWeight: 700, color: INK }}>{v}<span style={{ color: GRAY }}>⌄</span></span>
            </div>
          ))}
        </div>
      )}
      {csvOn && f >= T.clickCsv + 20 && (
        <div style={{ position: "absolute", left: 1000, top: 82, padding: "10px 16px", borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 16px 40px #0003", fontSize: 15, fontWeight: 800, color: INK, opacity: pr(f, T.clickCsv + 20, 8), zIndex: 3 }}>⬇ transcriptions.csv · 6 rows</div>
      )}
    </>
  );
};

// ───────── import modal ─────────
const IMX = 330, IMY = 50, IMW = 940, IMH = 660;
const IP = (x: number, y: number) => CT(IMX + x, IMY + y);
const MODELS = ["Tiny (~32x)", "Base (~16x)", "Small (~6x)", "Medium (~2x)", "Large (~1x)"];
const MODX = [28, 196, 364, 532, 720];
const MODW = [156, 156, 156, 176, 156];
const ImportModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickBulk + 4, b = T.back;
  if (f < a - 1 || f > b + 12) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b - 4, b + 8));
  const model = f >= T.pickMedium ? 3 : 1;
  const tab = f >= T.clickLink && f < T.clickUploadTab ? "link" : "upload";
  const file = f >= T.drop + 6;
  const pct = file ? Math.round(100 * lin(f, T.uploading, T.back - 16)) : 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: IMX, top: IMY + (1 - inn) * 30, width: IMW, height: IMH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 900, color: INK }}>Import Transcription</div>
        <div style={{ position: "absolute", left: 28, top: 64, fontSize: 16, fontWeight: 600, color: GRAY }}>Choose a model and import method below.</div>
        <div style={{ position: "absolute", left: 28, top: 104, fontSize: 16, fontWeight: 800, color: "#374151" }}>Choose a model:</div>
        {MODELS.map((m, i) => (
          <div key={m} style={{ position: "absolute", left: MODX[i], top: 132, width: MODW[i], height: 46, borderRadius: 10, boxSizing: "border-box", border: i === model ? "none" : `2px solid ${LINE}`, background: i === model ? BLUE : "#fff", color: i === model ? "#fff" : INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, opacity: pr(f, T.models - 6 + i * 4, 8) * 0.6 + 0.4, boxShadow: f >= T.models && f < T.pickMedium && (i === 0 || i === 4) ? "0 0 0 4px #FDE68A" : "none" }}>{m}</div>
        ))}
        {(["upload", "link"] as const).map((t, i) => (
          <div key={t} style={{ position: "absolute", left: 28 + i * 150, top: 206, width: i ? 200 : 136, height: 44, borderRadius: 10, boxSizing: "border-box", border: tab === t ? "none" : `2px solid ${LINE}`, background: tab === t ? BLUE : "#fff", color: tab === t ? "#fff" : INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>{t === "upload" ? "Upload" : "Import From Link"}</div>
        ))}
        {tab === "link" ? (
          <>
            <div style={{ position: "absolute", left: 28, top: 280, fontSize: 16, fontWeight: 800, color: "#374151" }}>Link</div>
            <div style={{ position: "absolute", left: 28, top: 306, width: IMW - 56, height: 48, borderRadius: 12, border: `2px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", fontSize: 17, color: "#9CA3AF", fontWeight: 600 }}>Enter link</div>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 28, top: 272, width: IMW - 56, height: 210, borderRadius: 14, border: `2px dashed ${file ? "#22C55E" : "#93C5FD"}`, background: file ? "#F0FDF4" : "#EFF6FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 18, fontWeight: 800, color: file ? "#15803D" : BLUE }}>
              {file ? <><span style={{ fontSize: 42 }}>🎧</span>{NEW} · 52.3 MB</> : <><span style={{ fontSize: 42 }}>⇪</span>Drag & drop an audio or video file, or click to browse<span style={{ fontSize: 14, color: GRAY, fontWeight: 600 }}>mp3 · wav · mp4 · mkv · avi</span></>}
            </div>
            {file && (
              <div style={{ position: "absolute", left: 28, top: 506, width: IMW - 56 }}>
                <div style={{ height: 12, borderRadius: 6, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: BLUE }} /></div>
                <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: GRAY }}>Uploading… {pct}%</div>
              </div>
            )}
          </>
        )}
        <Btn x={IMW - 28 - 110} y={IMH - 70} w={110} label="Cancel" fs={17} />
      </div>
    </>
  );
};

// ───────── details page ─────────
const LINES: [string, string, string][] = [
  ["00:12", "Nadia", "Okay, let's start with the question everyone sent this week."],
  ["01:48", "Priya", "Why do so many of my claims come back denied?"],
  ["02:05", "Nadia", "Most denied claims come from three things: eligibility, coding, and timing."],
  ["03:31", "Nadia", "Check eligibility before the visit, not after the claim is rejected."],
  ["05:10", "Marcus", "What about modifier 25? I keep getting that one wrong."],
  ["05:24", "Nadia", "Modifier 25 means a separate, significant service on the same day."],
  ["07:42", "Nadia", "Timely filing limits differ by payer. Keep a cheat sheet."],
  ["09:15", "Priya", "Can we get a list of the common denial codes?"],
];
const ACTIVE = 2;
const LY = (i: number) => 236 + i * 60;
const Details: React.FC<{ f: number }> = ({ f }) => {
  const seek = f >= T.clickLine + 2;
  const prog = seek ? 0.032 + (f - T.clickLine) * 0.0004 : 0.003 + Math.max(0, f - T.clickEye) * 0.00015;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.clickEye + 2, 10) }}>
      <div style={{ position: "absolute", left: 26, top: 22, display: "flex", alignItems: "center", gap: 12, fontSize: 26, fontWeight: 900, color: INK }}><span style={{ fontSize: 24, color: f >= T.clickBack - 8 && f < T.clickBack + 4 ? BLUE : INK }}>←</span>Transcription Details</div>
      <div style={{ position: "absolute", left: 30, top: 66, fontSize: 16, fontWeight: 600, color: GRAY }}>Clip Details of a transcription · {NEW}</div>
      <Btn x={1186} y={22} w={130} label="⇪  Export" fs={16} glow={f >= T.clickExportD - 6 && f < T.clickExportD + 6 ? 1 : 0} />
      <div style={{ position: "absolute", left: 26, top: 106, width: 1290, height: 100, borderRadius: 16, background: "#0F172A", display: "flex", alignItems: "center", gap: 18, padding: "0 24px", boxSizing: "border-box" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>❚❚</div>
        <div style={{ flex: 1, height: 44, display: "flex", alignItems: "center", gap: 3 }}>
          {Array.from({ length: 120 }).map((_, i) => <div key={i} style={{ flex: 1, height: 8 + ((i * 37) % 30), borderRadius: 2, background: i / 120 < prog ? "#60A5FA" : "#334155" }} />)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#CBD5E1", width: 130, textAlign: "right" }}>{seek ? "02:05" : "00:" + String(12 + Math.floor(Math.max(0, f - T.clickEye) / 30)).padStart(2, "0")} / 1:03:27</div>
      </div>
      {LINES.map(([ts, who, txt], i) => {
        const on = seek && i === ACTIVE;
        return (
          <div key={i} style={{ position: "absolute", left: 26, top: LY(i), width: 1290, height: 54, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", boxSizing: "border-box", background: on ? "#EEF2FF" : "transparent", borderLeft: on ? `4px solid ${BLUE}` : "4px solid transparent", opacity: pr(f, T.lines - 10 + i * 4, 10) }}>
            <span style={{ width: 70, fontSize: 15, fontWeight: 800, color: on ? BLUE : GRAY }}>{ts}</span>
            <span style={{ width: 80, fontSize: 15, fontWeight: 800, color: INK }}>{who}</span>
            <span style={{ flex: 1, fontSize: 17, fontWeight: on ? 800 : 600, color: on ? INK : "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txt}</span>
            <span style={{ fontSize: 16, color: "#22C55E" }}>▶</span>
          </div>
        );
      })}
    </div>
  );
};

const ExportModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickExportD + 4, b = T.exportOff;
  if (f < a - 1 || f > b + 12) return null;
  const o = pr(f, a, 12) * (1 - lin(f, b - 4, b + 8));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: 450, top: 150, width: 700, height: 420, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT, padding: 30, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>Export File</div>
        <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: GRAY }}>View and Download transcribed files.</div>
        <div style={{ marginTop: 22, fontSize: 21, fontWeight: 900, color: "#0F766E" }}>Task ID: 6714c2e9a1f0b3</div>
        {[["Status:", <span style={{ color: "#16A34A" }}>Completed</span>], ["File Name:", NEW], ["File Size:", "54,839,296 bytes"], ["MIME Type:", "audio/mp3"]].map(([l, v], i) => (
          <div key={i} style={{ marginTop: 10, fontSize: 18, fontWeight: 600, color: INK, opacity: pr(f, a + 6 + i * 5, 8) }}><b>{l as string}</b> {v as React.ReactNode}</div>
        ))}
        <div style={{ marginTop: 22, fontSize: 19, fontWeight: 800, color: INK }}>Download Files:</div>
        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          {["vtt", "srt", "txt", "json", "tsv"].map((x, i) => <div key={x} style={{ padding: "10px 16px", borderRadius: 10, background: BLUE, color: "#fff", fontSize: 17, fontWeight: 800, opacity: pr(f, a + 30 + i * 5, 8) }}>⬇ {x}</div>)}
        </div>
      </div>
    </>
  );
};

// ───────── course + lesson transcribe ─────────
const LESSONS = ["Welcome & how claims flow", "Reading an EOB", "Why claims get denied", "Modifiers that matter", "Timely filing by payer"];
const CoursePage: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.course, 12) }}>
    <PageHead title="Medical Billing Foundations" sub="Course · Module 2: Claims and denials" />
    {LESSONS.map((l, i) => (
      <div key={l} style={{ position: "absolute", left: 30, top: 120 + i * 92, width: 1290, height: 78, borderRadius: 14, background: "#fff", border: `2px solid ${i === 2 && f >= T.clickTranscribe - 30 ? BLUE : LINE}`, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
        <div style={{ width: 80, height: 50, borderRadius: 8, background: "linear-gradient(135deg,#1E3A8A,#0EA5E9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 19, fontWeight: 800, color: INK }}>Lesson {i + 1}: {l}</div><div style={{ fontSize: 14, fontWeight: 600, color: GRAY }}>Video · {[8, 14, 22, 17, 11][i]} min</div></div>
        {["✎", "🎙", "⋮"].map((c, k) => <div key={c} style={{ width: 42, height: 38, borderRadius: 9, border: `2px solid ${i === 2 && k === 1 && f >= T.clickTranscribe - 10 ? BLUE : LINE}`, background: i === 2 && k === 1 && f >= T.clickTranscribe - 10 ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: INK }}>{c}</div>)}
      </div>
    ))}
    {f >= T.clickTranscribe - 30 && f < T.clickTranscribe + 4 && <div style={{ position: "absolute", left: 1180, top: 120 + 2 * 92 - 30, padding: "4px 10px", borderRadius: 8, background: INK, color: "#fff", fontSize: 13, fontWeight: 800 }}>Transcribe</div>}
  </div>
);
const TABS = ["Lesson Info", "Transcribe", "Summary", "Interview Q&As", "Behavioral Q&As", "Tech Impl."];
const TABX = [28, 168, 300, 422, 588, 770];
const TABW = [128, 120, 110, 154, 170, 120];
const TMX = 120, TMY = 20, TMW = 1360, TMH = 790;
const TP = (x: number, y: number) => CT(TMX + x, TMY + y);
const SUMMARY = ["Most denials trace back to eligibility, coding or timing", "Verify eligibility before the visit", "Modifier 25 = separate, significant service, same day", "Timely filing limits differ by payer", "Keep a denial code cheat sheet"];
const INTQ = ["Q: What are the three most common causes of a denied claim?", "A: Eligibility issues, coding errors and missed filing limits.", "Q: When should eligibility be checked?", "A: Before the visit, so problems are fixed early."];
const BEHQ = ["Q: Tell me about a time you resolved a denied claim.", "A: Describe the denial code, what you checked, and the result.", "Q: How do you handle a payer who keeps rejecting claims?", "A: Track patterns, escalate with evidence, follow up in writing."];
const TranscribeModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickTranscribe + 4, b = T.learner - 6;
  if (f < a - 1 || f > b + 10) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b - 6, b + 6));
  const tab = f >= T.clickBehav ? 4 : f >= T.clickInterview ? 3 : f >= T.clickSummary ? 2 : f >= T.clickCopy + 4 ? 1 : 0;
  const status = f >= T.clickGen + 40 ? "Completed" : f >= T.clickGen + 2 ? "Processing" : "Not started";
  const gen = (at: number, list: string[]) => list.map((l, i) => <div key={i} style={{ marginTop: 10, fontSize: 18, fontWeight: l.startsWith("A:") ? 600 : 800, color: l.startsWith("A:") ? "#374151" : INK, opacity: pr(f, at + 18 + i * 8, 10) }}>{l.startsWith("Q") || l.startsWith("A") ? l : "• " + l}</div>);
  const aiAt = tab === 2 ? T.clickAiSum : tab === 3 ? T.clickAiInt : T.clickAiBeh;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: TMX, top: TMY + (1 - inn) * 30, width: TMW, height: TMH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>Transcribe</div>
        <div style={{ position: "absolute", left: 180, top: 32, fontSize: 16, fontWeight: 700, color: GRAY }}>Lesson 3: Why claims get denied</div>
        <div style={{ position: "absolute", left: 24, top: 72, width: 920, height: 52, borderRadius: 12, background: "#F3F4F6" }} />
        {TABS.map((t, i) => <div key={t} style={{ position: "absolute", left: TABX[i], top: 78, width: TABW[i], height: 40, borderRadius: 9, background: tab === i ? "#fff" : "transparent", boxShadow: tab === i ? "0 2px 8px #0002" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: tab === i ? BLUE : "#4B5563" }}>{t}</div>)}
        <div style={{ position: "absolute", left: 28, top: 146, right: 28, bottom: 90 }}>
          {tab === 0 && (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 292, borderRadius: 14, background: "linear-gradient(135deg,#1E3A8A,#0EA5E9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>▶</div>
              <div style={{ position: "absolute", left: 550, top: 0, fontSize: 18, fontWeight: 800, color: INK }}>Transcription Status: <span style={{ color: status === "Completed" ? "#16A34A" : status === "Processing" ? BLUE : GRAY }}>{status}</span></div>
              <Btn x={550} y={44} w={240} label="Generate Transcription" primary fs={16} press={f >= T.clickGen && f < T.clickGen + 6 ? 1 : 0} />
              <Btn x={804} y={44} w={170} label="Refresh Status" fs={16} />
              {status === "Completed" && (
                <>
                  <Btn x={550} y={110} w={240} label="Copy to Transcription" primary fs={16} press={f >= T.clickCopy && f < T.clickCopy + 6 ? 1 : 0} glow={f >= T.clickCopy - 10 && f < T.clickCopy ? 1 : 0} />
                  <Btn x={804} y={110} w={170} label="Direct Download" fs={16} />
                  <div style={{ position: "absolute", left: 550, top: 180, width: 700, padding: 16, borderRadius: 12, background: "#F0FDF4", border: "2px solid #BBF7D0", fontSize: 16, fontWeight: 700, color: "#166534", opacity: pr(f, T.clickGen + 42, 10) }}>Transcription is ready! Click the Copy to Transcription button above.</div>
                </>
              )}
              {status === "Processing" && <div style={{ position: "absolute", left: 550, top: 120, width: 700, padding: 16, borderRadius: 12, background: "#EFF6FF", border: "2px solid #BFDBFE", fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>Transcription is in progress. This may take a few minutes.</div>}
            </>
          )}
          {tab === 1 && (
            <>
              <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>Transcription Text</div>
              <div style={{ marginTop: 12, height: 420, borderRadius: 12, border: `2px solid ${BLUE}`, padding: 18, boxSizing: "border-box", fontSize: 17, fontWeight: 600, color: "#374151", lineHeight: 1.7 }}>{LINES.map((l) => l[2]).join(" ")}</div>
            </>
          )}
          {tab >= 2 && (
            <>
              <div style={{ fontSize: 19, fontWeight: 900, color: INK }}>{tab === 2 ? "Summary" : tab === 3 ? "Interview Q&As" : "Behavioral Q&As"}</div>
              <Btn x={TMW - 56 - 200} y={-8} w={200} label="✨ Generate with AI" primary fs={16} press={f >= aiAt && f < aiAt + 6 ? 1 : 0} />
              <div style={{ position: "absolute", left: 0, top: 50, width: TMW - 56, height: 450, borderRadius: 12, border: `2px solid ${LINE}`, padding: "8px 20px", boxSizing: "border-box" }}>
                {f >= aiAt + 2 && f < aiAt + 18 && <div style={{ marginTop: 14, fontSize: 17, fontWeight: 700, color: BLUE }}>Generating…</div>}
                {gen(aiAt, tab === 2 ? SUMMARY : tab === 3 ? INTQ : BEHQ)}
              </div>
            </>
          )}
        </div>
        <Btn x={TMW - 28 - 120 - 12 - 110} y={TMH - 70} w={110} label="Cancel" fs={17} />
        <Btn x={TMW - 28 - 120} y={TMH - 70} w={120} label="Save" primary fs={17} press={f >= T.clickSave && f < T.clickSave + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── learner lesson ─────────
const Learner: React.FC<{ f: number }> = ({ f }) => {
  const rt = f >= T.lBeh ? 2 : f >= T.lInt ? 1 : 0;
  const list = rt === 0 ? SUMMARY.map((s) => "• " + s) : rt === 1 ? INTQ : BEHQ;
  const at = rt === 0 ? T.lRes : rt === 1 ? T.lInt : T.lBeh;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <div style={{ position: "absolute", left: 26, top: 18, fontSize: 24, fontWeight: 900, color: INK }}>Lesson 3: Why claims get denied</div>
      <div style={{ position: "absolute", left: 26, top: 60, width: 620, height: 350, borderRadius: 16, background: "linear-gradient(135deg,#0F172A,#1E3A8A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 60 }}>▶</div>
      <div style={{ position: "absolute", left: 26, top: 426, display: "flex", gap: 8 }}>{["Overview", "Add Notes", "Download", "Ratings"].map((t, i) => <span key={t} style={{ padding: "9px 16px", borderRadius: 10, background: i === 0 ? BLUE : "#fff", color: i === 0 ? "#fff" : INK, border: i ? `2px solid ${LINE}` : "none", fontSize: 15, fontWeight: 800 }}>{t}</span>)}</div>
      <div style={{ position: "absolute", left: 26, top: 486, width: 620, fontSize: 18, fontWeight: 900, color: INK }}>Description</div>
      <div style={{ position: "absolute", left: 26, top: 516, width: 620, fontSize: 16, fontWeight: 600, color: GRAY, lineHeight: 1.6 }}>Why insurers deny claims, and the checks that stop it before the claim goes out.</div>
      <div style={{ position: "absolute", left: 670, top: 60, width: 650, height: 690, borderRadius: 16, background: "#fff", border: `2px solid ${f >= T.lRes - 6 ? BLUE : LINE}`, padding: 22, boxSizing: "border-box", opacity: pr(f, T.lOpen, 12) }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Resources</div>
        <div style={{ marginTop: 14, display: "flex", gap: 6, padding: 5, borderRadius: 11, background: "#F3F4F6", width: "fit-content" }}>{["Summary", "Interview", "Behavioral", "Implementation"].map((t, i) => <span key={t} style={{ padding: "8px 14px", borderRadius: 8, background: rt === i ? "#fff" : "transparent", boxShadow: rt === i ? "0 2px 6px #0002" : "none", fontSize: 15, fontWeight: 800, color: rt === i ? BLUE : "#4B5563" }}>{t}</span>)}</div>
        <div style={{ marginTop: 10 }}>{list.map((l, i) => <div key={rt + "-" + i} style={{ marginTop: 12, fontSize: 17, fontWeight: l.startsWith("A:") ? 600 : 800, color: l.startsWith("A:") ? "#374151" : INK, lineHeight: 1.45, opacity: pr(f, at + 4 + i * 5, 10) }}>{l}</div>)}</div>
      </div>
    </div>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.clickMenu - 10, 880, 540, 1.05],
  [T.tour + 10, 1000, 480, 1.08],
  [S.d2, 960, 470, 1.06],
  [T.pickMedium, 960, 440, 1.12],
  [S.d3, 960, 560, 1.1],
  [T.back, 960, 520, 1.04],
  [T.done - 10, 900, 470, 1.1],
  [S.d5, 1060, 440, 1.08],
  [S.d6, 960, 540, 1.0],
  [T.lines, 960, 560, 1.06],
  [T.clickLine, 900, 560, 1.12],
  [T.clickExportD, 960, 500, 1.06],
  [T.clickBack, 960, 540, 1.0],
  [T.clickCsv, 1100, 460, 1.1],
  [T.course, 960, 540, 1.0],
  [T.clickTranscribe - 20, 1080, 540, 1.08],
  [T.clickGen, 1000, 500, 1.06],
  [T.clickSummary, 960, 520, 1.06],
  [T.clickAiSum + 20, 900, 560, 1.1],
  [T.clickSave - 10, 1080, 620, 1.06],
  [T.learner, 960, 540, 1.0],
  [T.lRes, 1100, 540, 1.1],
  [PAY_START, 960, 540, 1.0],
]).map(calmK);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Transcription", "Content Management")],
  [T.tour, ...MA(400, 260)],
  [T.tour + 50, ...MA(900, 260)],
  [T.clickBulk, ...MA(882, 48)],
  [T.models, ...IP(100, 155)],
  [T.models + 30, ...IP(800, 155)],
  [T.pickMedium, ...IP(620, 155)],
  [T.clickLink, ...IP(278, 228)],
  [T.clickUploadTab, ...IP(96, 228)],
  [T.drop, ...IP(470, 376)],
  [T.back + 10, ...MA(700, rowY(0))],
  [T.done, ...MA(940, rowY(0))],
  [T.search, ...MA(630, 48)],
  [T.clickFilter, ...MA(986, 48)],
  [T.clickEye, ...MA(ACTX, rowY(0))],
  [T.lines, ...MA(500, LY(1) + 27)],
  [T.clickLine, ...MA(500, LY(ACTIVE) + 27)],
  [T.clickExportD, ...MA(1251, 46)],
  [T.exportOff - 6, 1200, 700],
  [T.clickBack, ...MA(38, 46)],
  [T.clickCsv, ...MA(1134, 48)],
  [T.clickTranscribe, ...MA(1221, 120 + 2 * 92 + 39)],
  [T.clickGen, ...TP(28 + 550 + 120, 146 + 68)],
  [T.clickCopy, ...TP(28 + 550 + 120, 146 + 134)],
  [T.clickSummary, ...TP(TABX[2] + 55, 98)],
  [T.clickAiSum, ...TP(TMW - 28 - 100, 146 + 16)],
  [T.clickInterview, ...TP(TABX[3] + 77, 98)],
  [T.clickAiInt, ...TP(TMW - 28 - 100, 146 + 16)],
  [T.clickBehav, ...TP(TABX[4] + 85, 98)],
  [T.clickAiBeh, ...TP(TMW - 28 - 100, 146 + 16)],
  [T.clickSave, ...TP(TMW - 28 - 60, TMH - 46)],
  [T.learner + 20, 1500, 860],
  [T.lRes, ...MA(800, 160)],
  [T.lInt, ...MA(670 + 22 + 5 + 100 + 6 + 50, 60 + 22 + 50 + 20)],
  [T.lBeh, ...MA(670 + 22 + 5 + 100 + 6 + 100 + 6 + 55, 60 + 22 + 50 + 20)],
  [T.lBeh + 60, 1500, 860],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "The Transcription list" },
  { at: S.d2, to: S.d3, label: "Choose a model" },
  { at: S.d3, to: S.d4, label: "Upload or import a link" },
  { at: S.d4, to: S.d6, label: "Status, search, filter" },
  { at: S.d6, to: S.d8, label: "Read and jump in the call" },
  { at: S.d8, to: T.course, label: "Export files and CSV" },
  { at: T.course, to: S.d10, label: "Transcribe a lesson" },
  { at: S.d10, to: T.learner, label: "AI summary and Q&As" },
  { at: T.learner, to: PAY_START, label: "What the learner sees" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const scene = f >= T.learner ? "learner" : f >= T.course ? "course" : "list";
  const details = f >= T.clickEye + 2 && f < T.clickBack + 2;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {scene === "learner" ? (
          <LandWin f={f} inAt={T.learner} url="learner.clearpath.example.com/program/medical-billing-foundations" learner who="Omar" prog="Medical Billing Foundations" active="Program" openGroup="My Courses" main={<Learner f={f} />} />
        ) : scene === "course" ? (
          <LandWin f={f} inAt={T.course - 6} url="academy.skillbnk.com/courses/medical-billing-foundations" branch="ClearPath Online" active="Courses" openGroup="Courses & Programs" main={<CoursePage f={f} />}
            overlay={<><TranscribeModal f={f} /><Toast f={f} at={T.clickSave + 3} text="Saved successfully" d={50} /></>} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url={details ? "academy.skillbnk.com/transcription/6714c2e9a1f0b3" : "academy.skillbnk.com/transcription"} branch="ClearPath Online" active={f >= T.clickMenu ? "Transcription" : "Dashboard"} openGroup="Content Management"
            main={details ? <Details f={f} /> : <ListPage f={f} />}
            overlay={<><ImportModal f={f} /><ExportModal f={f} /></>} />
        )}
        <Scribble f={f} at={T.done + 2} d={16} out={T.search - 6} kind="ring" x={MA(TBX + 1040 + 60, 0)[0]} y={MA(0, rowY(0))[1]} w={170} h={60} seed={3} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { calls: cue("h0", "calls"), forty: cue("h0", "forty"), folder: cue("h0", "folder"), nobody: cue("h0", "nobody") };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.forty - 6, HK.nobody + 20);
  const n = countUp(f, HK.forty - 6, 40, 26);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <HookTag f={f} text="ClearPath Medical Billing · Tuesday Q&A" />
      <div style={{ position: "absolute", left: 460, top: 150, width: 1000, height: 620, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, 6, 14) }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>📁 Recordings / Q&A calls</div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ marginTop: 14, height: 50, borderRadius: 10, background: "#F9FAFB", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", fontSize: 17, fontWeight: 700, color: INK, opacity: pr(f, 12 + i * 6, 8) }}>
            🎧 qa-call-{["oct-07", "sep-30", "sep-23", "sep-16", "sep-09", "sep-02", "aug-26", "aug-19"][i]}.mp3
            <span style={{ marginLeft: "auto", fontSize: 15, color: f >= HK.nobody - 4 ? "#DC2626" : GRAY }}>{f >= HK.nobody - 4 ? "0 views" : ["58:12", "51:03", "1:02:40", "47:55", "55:10", "49:31", "1:05:02", "53:44"][i]}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 820, width: 1920, textAlign: "center", fontSize: 52, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.forty - 4, 14) }}>{n} hours of answers nobody can find</div>
    </AbsoluteFill>
  );
};

const PY = { calls: cue("p13", "calls"), searchable: cue("p13", "searchable"), teach: cue("p13", "teach") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 560, top: 150, width: 800, height: 400, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, PY.calls - 6, 14) }}>
      <div style={{ height: 50, borderRadius: 12, border: `2px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 19, fontWeight: 700, color: INK }}>🔍 {typed(f, PY.searchable - 10, "denied claims", 0.5)}</div>
      {LINES.slice(1, 5).map((l, i) => <div key={i} style={{ marginTop: 14, fontSize: 18, fontWeight: 700, color: INK, opacity: pr(f, PY.searchable + 6 + i * 5, 10) }}><span style={{ color: BLUE, marginRight: 12 }}>{l[0]}</span>{l[2]}</div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, display: "flex", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ opacity: pr(f, PY.teach - 10 + i * 2, 10) }}><Avatar t={"ABCDEFGHJK"[i] + "L"} s={72} c1="#16A34A" c2="#15803D" /></div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.teach - 4, 14) }}>Every answer, reused by every new class</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.forty, "riser", 0.25); add(HK.nobody, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 10; i++) add(T.search + 4 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.drop + 6, "pop", 0.35); add(T.done, "chime", 0.45); add(T.clickLine + 2, "pop", 0.3);
  add(T.clickGen + 40, "ding", 0.35); add(T.clickAiSum + 18, "pop", 0.3); add(T.clickSave + 4, "chime", 0.5);
  add(T.course - 2, "whoosh", 0.3); add(T.learner, "whoosh", 0.35); add(PAY_START - 3, "whoosh", 0.4); add(PY.teach, "chime", 0.5);
  return a;
})();

export const TranscriptionStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="transcribestory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.course, T.learner]} />;
};
