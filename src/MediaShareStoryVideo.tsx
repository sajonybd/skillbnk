import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE, GREEN } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * MediaShareStoryVideo — premium landscape (sheet serial 33). Story: Coach Ray Dalton, Summit Welding School (fictional).
 * Verified in code: SB-Branch AudioVideoSending ("Audios & Videos", "Manage audio and video media", "Add New", "Search by title...",
 * columns SN / Thumbnail / Title / Description / Media Type / Audience / Vimeo URL / Created By / Creation Date / Actions, Transcribe +
 * View actions), AddAudioVideoModal ("Add Audio or Video", Title, Media Type Video/Audio, Video URL (vimeo URL / Upload Video),
 * Description, Upload Thumbnail (optional), audience scope program/group/user, Create, toast "Media added successfully"),
 * AudioVideoTranscribe (tabs Links / Transcribe / Summary / Interview Q&As / Behavioral Q&As, "Generate with AI",
 * toast "Generated successfully"). SB-Learner en.ts AudioVideoComponents ("Audio & Videos", "These audios and videos only shared
 * with you", Videos, Instructor, View, Video Details, Overview, Summary, Interview, Add Notes).
 * Voice: python3 generate-voice-story.py src/MediaShareStoryVideo.tsx public/mediastory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "p6"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 232,
  d1: 153,
  d2: 144,
  d3: 142,
  d4: 222,
  d5: 262,
  p6: 178,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "p6"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 16, 33, 41, 57, 66, 91, 94, 101, 107, 111, 116, 118, 124, 151, 156, 167, 195, 198, 207, 212],
  d1: [2, 13, 30, 34, 45, 63, 71, 83, 98, 107, 126],
  d2: [2, 9, 36, 46, 55, 80, 86, 92, 99, 103, 108, 113, 117, 122, 127],
  d3: [2, 10, 21, 28, 39, 46, 48, 57, 70, 87, 97],
  d4: [2, 22, 55, 59, 70, 88, 99, 109, 117, 136, 140, 148, 160, 174, 184, 190],
  d5: [2, 12, 21, 25, 31, 37, 60, 83, 96, 110, 118, 127, 134, 140, 147, 178, 186, 192, 205, 211, 216],
  p6: [2, 16, 57, 63, 70, 111, 114, 124, 129, 133],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Ray recorded the perfect welding demo. He dropped the link in the group chat. Forty messages later, nobody can find it.",
  d1: "This time, he opens Audios and Videos, and clicks Add New.",
  d2: "A title, media type video, and the Vimeo link. Or he can upload the file.",
  d3: "He shares it only with the evening cohort, and clicks Create.",
  d4: "Then Transcribe. With one click, AI writes the summary, and even interview questions from the video.",
  d5: "Now let's see the learner side. Lena opens Audio and Videos in her learner portal. It's shared only with her class.",
  p6: "One video. The right learners. Nothing lost in the chat.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, SEG_START, WT);

const MENU = ["Dashboard", "Approved Member", "Audio/Video Sending", "Documents and Labs", "Assignments", "Settings"];
const ICONS = ["▦", "✅", "🎬", "📄", "📝", "⚙"];
const TITLE = "MIG Weld — Joint Prep Demo";
const URL = "https://vimeo.com/883104227";
const ROWS = [
  { t: "Safety gear walkthrough", m: "Video", a: "Morning cohort", d: "Oct 02, 2026" },
  { t: "Arc sound — what good sounds like", m: "Audio", a: "Group · Beginners", d: "Sep 28, 2026" },
  { t: "Grinder basics", m: "Video", a: "Evening cohort", d: "Sep 21, 2026" },
];

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "audios", -6),
  clickAdd: cue("d1", "add", 0),
  typeTitle: cue("d2", "title", -4),
  pickType: cue("d2", "video", -6),
  paste: cue("d2", "vimeo", -2),
  upload: cue("d2", "upload", -2),
  clickAud: cue("d3", "shares", -4),
  pickCohort: cue("d3", "evening", -2),
  clickCreate: cue("d3", "create", 0),
  clickTr: cue("d4", "transcribe", -4),
  clickGen: cue("d4", "click", -2),
  sumIn: cue("d4", "summary", -4),
  clickIQ: cue("d4", "interview", -6),
  learner: cue("d5", "learner", -8),
  clickView: cue("d5", "opens", 4),
  only: cue("d5", "only"),
};
const CLICKS = [T.clickMenu, T.clickAdd, T.typeTitle, T.pickType, T.paste, T.clickAud, T.pickCohort, T.clickCreate, T.clickTr, T.clickGen, T.clickIQ, T.clickView];
const scene = (f: number) => (f >= T.learner ? "learner" : "list");

// ───────── list page ─────────
const COLS = [{ h: "SN", w: 60 }, { h: "Thumbnail", w: 130 }, { h: "Title", w: 330 }, { h: "Media Type", w: 140 }, { h: "Audience", w: 220 }, { h: "Creation Date", w: 180 }, { h: "Actions", w: 230 }];
const TBX = 32, TBY = 130, RH = 72;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const ADD = MA(1210, 48);
const TRB = MA(TBX + 1060 + 16 + 18, rowY(0));
const Thumb: React.FC<{ c: string }> = ({ c }) => <div style={{ width: 92, height: 52, borderRadius: 8, background: `linear-gradient(135deg,${c},#0F172A)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20 }}>▶</div>;
const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const created = f >= T.clickCreate + 4;
  const shift = created ? pr(f, T.clickCreate + 4, 14) : 0;
  const rows = created ? [{ t: TITLE, m: "Video", a: "Evening cohort", d: "Oct 14, 2026" }, ...ROWS] : ROWS;
  return (
    <>
      <PageHead title="Audios & Videos" sub="Manage audio and video media" />
      <div style={{ position: "absolute", left: 760, top: 24, width: 360, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>⌕&nbsp; Search by title...</div>
      <Btn x={1140} y={24} w={150} label="＋  Add New" primary fs={18} press={f >= T.clickAdd && f < T.clickAdd + 6 ? 1 : 0} glow={f >= T.clickAdd - 12 && f < T.clickAdd ? lin(f, T.clickAdd - 12, T.clickAdd) : 0} />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={created ? 0 : -1} oRow={(i) => (created && i === 0 ? shift : 1)}
        rows={rows.map((r, i) => [
          <span style={{ color: GRAY }}>{i + 1}</span>, <Thumb c={["#F97316", "#2563EB", "#7C3AED", "#059669"][i]} />, <b style={{ fontWeight: 800 }}>{r.t}</b>,
          <Badge t={r.m} c={r.m === "Video" ? BLUE : "#7C3AED"} bg={r.m === "Video" ? "#EEF2FF" : "#F3E8FF"} fs={15} />, r.a, <span style={{ color: GRAY }}>{r.d}</span>,
          <div style={{ display: "flex", gap: 8 }}>{[["✦", "Transcribe"], ["👁", ""], ["✎", ""], ["⋮", ""]].map(([g, l], k) => {
            const on = created && i === 0 && k === 0 && f >= T.clickTr - 12;
            return <span key={k} style={{ height: 36, padding: l ? "0 10px" : 0, width: l ? undefined : 36, borderRadius: 10, background: on ? BLUE : "#EEF2FF", color: on ? "#fff" : BLUE, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontWeight: 800, fontSize: 14 }}>{g}{l && ` ${l}`}</span>;
          })}</div>,
        ])} />
    </>
  );
};

// ───────── add modal ─────────
const MX = 220, MY = 30, MW = 920, MH = 770;
const Fld: React.FC<{ x: number; y: number; w: number; label: string; v: string; ph?: string; focus?: boolean; sel?: boolean }> = ({ x, y, w, label, v, ph, focus, sel }) => (
  <>
    <div style={{ position: "absolute", left: x, top: y, fontSize: 17, fontWeight: 800, color: "#374151" }}>{label}</div>
    <div style={{ position: "absolute", left: x, top: y + 26, width: w, height: 50, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${focus ? BLUE : "#D1D5DB"}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 600, color: v ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>
  </>
);
const AddModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickAdd + 4, b = T.clickCreate + 4;
  if (f < a - 1 || f > b + 14) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 15, stiffness: 170 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b, b + 12));
  const audOpen = f >= T.clickAud + 2 && f < T.pickCohort + 8 ? pr(f, T.clickAud + 2, 8) : 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: MX, top: MY + (1 - inn) * 50, width: MW, height: MH, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 28, fontWeight: 900, color: INK }}>Add Audio or Video</div>
        <Fld x={30} y={84} w={540} label="Title *" v={typed(f, T.typeTitle, TITLE, 1.2)} ph="Enter title" focus={f >= T.typeTitle && f < T.pickType} />
        <Fld x={600} y={84} w={290} label="Media Type" v={f >= T.pickType + 4 ? "Video" : ""} ph="Select media type" sel focus={f >= T.pickType && f < T.paste} />
        <div style={{ position: "absolute", left: 30, top: 180, fontSize: 17, fontWeight: 800, color: "#374151" }}>Video URL *</div>
        <div style={{ position: "absolute", left: 30, top: 206, display: "flex", gap: 6, padding: 4, borderRadius: 10, background: "#F3F4F6" }}>
          {["Video URL", "Upload Video"].map((t, i) => <div key={t} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 16, fontWeight: 800, background: (i === 0) === !(f >= T.upload && f < T.clickAud) ? "#fff" : "transparent", color: INK }}>{t}</div>)}
        </div>
        <div style={{ position: "absolute", left: 30, top: 256, width: 860, height: 50, borderRadius: 12, border: `2px solid ${f >= T.paste && f < T.clickAud ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 16px", boxSizing: "border-box", fontSize: 18, fontWeight: 600, color: f >= T.paste ? INK : "#9CA3AF" }}>{f >= T.paste + 2 ? URL : "Enter vimeo URL"}</div>
        <div style={{ position: "absolute", left: 30, top: 326, fontSize: 17, fontWeight: 800, color: "#374151" }}>Description *</div>
        <div style={{ position: "absolute", left: 30, top: 352, width: 860, height: 110, borderRadius: 12, border: "2px solid #D1D5DB", padding: 14, boxSizing: "border-box", fontSize: 17, fontWeight: 600, color: INK, lineHeight: 1.45 }}>{f >= T.paste + 10 ? "Watch the bevel angle and the gap before you strike an arc. 6 minutes." : ""}</div>
        <Fld x={30} y={482} w={540} label="Audience" v={f >= T.pickCohort + 4 ? "Session · Evening cohort" : ""} ph="Program / Group / User" sel focus={audOpen > 0} />
        <div style={{ position: "absolute", left: 600, top: 482, fontSize: 17, fontWeight: 800, color: "#374151" }}>Upload Thumbnail (optional)</div>
        <div style={{ position: "absolute", left: 600, top: 508, width: 290, height: 50, borderRadius: 12, border: "2px dashed #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: GRAY, fontWeight: 700 }}>⇪ Drop image</div>
        <Btn x={620} y={MH - 76} w={120} label="Cancel" fs={18} />
        <Btn x={760} y={MH - 76} w={130} label="Create" primary fs={18} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} glow={f >= T.clickCreate - 12 && f < T.clickCreate ? lin(f, T.clickCreate - 12, T.clickCreate) : 0} />
        {audOpen > 0 && (
          <div style={{ position: "absolute", left: 30, top: 562, width: 540, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0005", padding: 6, opacity: audOpen }}>
            {["Morning cohort", "Evening cohort", "Weekend cohort"].map((t) => <div key={t} style={{ height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, fontWeight: 700, color: t === "Evening cohort" && f >= T.pickCohort - 8 ? BLUE : INK, background: t === "Evening cohort" && f >= T.pickCohort - 8 ? "#EEF2FF" : "transparent" }}>{t}</div>)}
          </div>
        )}
      </div>
    </>
  );
};
const MP = (x: number, y: number) => CT(MX + x, MY + y);

// ───────── transcribe modal ─────────
const SUM = ["Bevel both plates to about 30 degrees.", "Leave a 2 to 3 mm root gap.", "Clean mill scale before the first pass.", "Tack at both ends, then check alignment."];
const IQ = ["Why do we bevel thicker plate before welding?", "What happens if the root gap is too tight?", "How do you check joint alignment after tacking?"];
const TrModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickTr + 4;
  if (f < a - 1 || f >= T.learner) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 15, stiffness: 170 }));
  const tab = f >= T.clickIQ + 2 ? "Interview Q&As" : "Summary";
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * inn})` }} />
      <div style={{ position: "absolute", left: 160, top: 40 + (1 - inn) * 40, width: 1060, height: 740, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: inn, fontFamily: FONT, padding: 30, boxSizing: "border-box" }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>Transcribe</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: GRAY }}>{TITLE}</div>
        <div style={{ position: "absolute", right: 30, top: 30, width: 190, height: 48, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 17, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= T.clickGen && f < T.clickGen + 6 ? 0.93 : 1})` }}>{f >= T.clickGen && f < T.sumIn ? "Generating..." : "✨ Generate with AI"}</div>
        <div style={{ marginTop: 22, display: "flex", gap: 26, borderBottom: `2px solid ${LINE}` }}>
          {["Links", "Transcribe", "Summary", "Interview Q&As", "Behavioral Q&As"].map((t) => <div key={t} style={{ paddingBottom: 12, fontSize: 18, fontWeight: 800, color: t === tab ? BLUE : GRAY, borderBottom: t === tab ? `3px solid ${BLUE}` : "3px solid transparent", marginBottom: -2 }}>{t}</div>)}
        </div>
        <div style={{ marginTop: 24 }}>
          {(tab === "Summary" ? SUM : IQ).map((s, i) => {
            const at = tab === "Summary" ? T.sumIn + i * 8 : T.clickIQ + 6 + i * 8;
            const o = pr(f, at, 10);
            return <div key={s} style={{ marginBottom: 14, padding: "16px 20px", borderRadius: 14, background: "#F9FAFB", border: `2px solid ${LINE}`, fontSize: 21, fontWeight: 700, color: INK, opacity: o, transform: `translateX(${(1 - o) * 30}px)` }}>{tab === "Summary" ? "• " : `Q${i + 1}. `}{s}</div>;
          })}
        </div>
      </div>
    </>
  );
};
const GENB = CT(160 + 1060 - 30 - 95, 40 + 30 + 24);
const IQTAB = CT(160 + 30 + 420, 40 + 30 + 70 + 30);

// ───────── learner side ─────────
const LearnerPage: React.FC<{ f: number }> = ({ f }) => {
  const det = f >= T.clickView + 2 ? pr(f, T.clickView + 2, 12) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <PageHead title="Audio & Videos" sub="These audios and videos only shared with you" />
      <div style={{ position: "absolute", left: 32, top: 112, display: "flex", gap: 8 }}>{["Videos", "Audios"].map((t, i) => <div key={t} style={{ padding: "10px 22px", borderRadius: 12, fontSize: 18, fontWeight: 800, background: i === 0 ? BLUE : "#fff", color: i === 0 ? "#fff" : "#374151", border: `2px solid ${i === 0 ? BLUE : LINE}` }}>{t}</div>)}</div>
      {[TITLE, "Grinder basics", "Safety gear walkthrough"].map((t, i) => (
        <div key={t} style={{ position: "absolute", left: 32 + i * 500, top: 186, width: 470, height: 330, borderRadius: 18, background: "#fff", border: `2px solid ${i === 0 && f >= T.clickView - 12 ? BLUE : LINE}`, overflow: "hidden", opacity: pr(f, T.learner + 6 + i * 5, 10) }}>
          <div style={{ height: 180, background: `linear-gradient(135deg,${["#F97316", "#7C3AED", "#2563EB"][i]},#0F172A)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 54 }}>▶</div>
          <div style={{ padding: "14px 20px" }}>
            <div style={{ fontSize: 21, fontWeight: 900, color: INK }}>{t}</div>
            <div style={{ marginTop: 6, fontSize: 16, fontWeight: 600, color: GRAY }}>Instructor: Ray Dalton</div>
            <div style={{ position: "absolute", right: 20, bottom: 18 }}><span style={{ padding: "8px 18px", borderRadius: 10, background: i === 0 ? BLUE : "#EEF2FF", color: i === 0 ? "#fff" : BLUE, fontWeight: 800, fontSize: 16 }}>View</span></div>
          </div>
        </div>
      ))}
      {det > 0 && (
        <div style={{ position: "absolute", left: 20, top: 20, right: 20, bottom: 20, borderRadius: 18, background: "#fff", boxShadow: "0 30px 90px #0006", opacity: det, transform: `scale(${0.96 + 0.04 * det})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 30, top: 24, fontSize: 26, fontWeight: 900, color: INK }}>Video Details</div>
          <div style={{ position: "absolute", left: 30, top: 74, width: 820, height: 460, borderRadius: 16, background: "linear-gradient(135deg,#F97316,#0F172A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 90 }}>▶</div>
          <div style={{ position: "absolute", left: 30, top: 556, fontSize: 24, fontWeight: 900, color: INK }}>{TITLE}</div>
          <div style={{ position: "absolute", left: 30, top: 600, display: "flex", gap: 24 }}>{["Overview", "Summary", "Interview", "Add Notes"].map((t) => <span key={t} style={{ fontSize: 18, fontWeight: 800, color: t === "Summary" ? BLUE : GRAY, borderBottom: t === "Summary" ? `3px solid ${BLUE}` : "none", paddingBottom: 6 }}>{t}</span>)}</div>
          <div style={{ position: "absolute", left: 30, top: 650, width: 820, fontSize: 18, fontWeight: 600, color: INK, lineHeight: 1.5 }}>• {SUM[0]}&nbsp;&nbsp;• {SUM[1]}</div>
          <div style={{ position: "absolute", left: 890, top: 74, width: 400, fontSize: 18, fontWeight: 900, color: INK }}>Upcoming Videos</div>
          {["Grinder basics", "Safety gear walkthrough"].map((t, i) => <div key={t} style={{ position: "absolute", left: 890, top: 112 + i * 110, width: 400, height: 96, borderRadius: 14, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", gap: 14, padding: 12, boxSizing: "border-box" }}><div style={{ width: 110, height: 70, borderRadius: 10, background: ["#7C3AED", "#2563EB"][i] }} /><b style={{ fontSize: 17, color: INK }}>{t}</b></div>)}
        </div>
      )}
    </div>
  );
};
const VIEWB = CT(32 + 470 - 60, 186 + 330 - 34);

const camClamp = (k: K4): K4 => [k[0], Math.max(760, Math.min(1080, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.22, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickMenu - 16, 600, 440, 1.2],
  [T.clickAdd - 12, 1300, 300, 1.25],
  [T.clickAdd + 16, 960, 520, 1.05],
  [T.typeTitle, 900, 360, 1.18],
  [T.paste, 960, 460, 1.15],
  [T.clickAud, 900, 640, 1.18],
  [T.clickCreate - 10, 1150, 760, 1.22],
  [T.clickCreate + 20, 960, 480, 1.08],
  [T.clickTr - 10, 1300, 380, 1.22],
  [T.clickTr + 14, 960, 520, 1.05],
  [T.clickGen - 6, 1200, 300, 1.2],
  [T.sumIn + 10, 900, 520, 1.12],
  [T.clickIQ + 30, 900, 520, 1.12],
  [T.learner, 960, 540, 1.0],
  [T.clickView - 10, 700, 560, 1.18],
  [T.clickView + 14, 960, 540, 1.04],
  [T.only, 820, 560, 1.12],
  [PAY_START, 960, 540, 1.05],
]).map(camClamp);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...menuPt(2)],
  [T.clickAdd, ADD[0], ADD[1]],
  [T.typeTitle, ...MP(300, 135)],
  [T.pickType, ...MP(745, 135)],
  [T.paste, ...MP(450, 281)],
  [T.clickAud, ...MP(300, 533)],
  [T.pickCohort, ...MP(200, 562 + 6 + 44 + 22)],
  [T.clickCreate, ...MP(825, MH - 52)],
  [T.clickTr, TRB[0] + 30, TRB[1]],
  [T.clickGen, GENB[0], GENB[1]],
  [T.clickIQ, IQTAB[0], IQTAB[1]],
  [T.learner + 20, 1300, 800],
  [T.clickView, VIEWB[0], VIEWB[1]],
  [T.only + 20, 1200, 900],
]);
const STEPS = [
  { at: T.clickMenu, to: SEG_START.d2, label: "ADD NEW" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "TITLE · TYPE · LINK" },
  { at: SEG_START.d3, to: SEG_START.d4, label: "CHOOSE THE AUDIENCE" },
  { at: SEG_START.d4, to: T.learner, label: "AI SUMMARY & Q&As" },
  { at: T.learner, to: PAY_START, label: "ONLY THEIR CLASS SEES IT" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = scene(f) === "learner";
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={T.learner} url="learner.summitwelding.example.com/audio-video" sidebar={false} main={<LearnerPage f={f} />} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url="academy.skillbnk.com/audio-video-sending" active={f >= T.clickMenu ? "Audio/Video Sending" : "Dashboard"} menu={MENU} menuIcons={ICONS} main={<ListPage f={f} />} overlay={<><AddModal f={f} /><TrModal f={f} /><Toast f={f} at={T.clickCreate + 3} text="Media added successfully" d={56} /><Toast f={f} at={T.sumIn} text="Generated successfully" d={50} /></>} />
        )}
        <Scribble f={f} at={T.pickCohort + 6} d={16} out={T.clickCreate - 4} kind="ring" x={MP(270, 533)[0]} y={MP(270, 533)[1]} w={580} h={80} seed={4} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.only} d={16} out={PAY_START - 4} kind="under" x={CT(300, 0)[0]} y={CT(0, 96)[1]} w={520} seed={6} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook: lost in the group chat ─────────
const HK = { link: cue("h0", "link"), forty: cue("h0", "forty"), nobody: cue("h0", "nobody") };
const MSGS = ["is class still at 6?", "can someone resend the slides", "👍", "who has the parking code", "lol same", "running 5 min late", "did anyone get the link?", "which link??", "the video one", "scroll up", "I scrolled, can't find it 😩"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.forty - 6, HK.nobody + 10);
  const scroll = lin(f, HK.forty - 4, HK.nobody + 6) * 170;
  const n = countUp(f, HK.forty - 6, 40, 24);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * lin(f, 0, DURATIONS.h0)})` }}>
        <HookTag f={f} text="💬 EVENING COHORT · GROUP CHAT" />
        <div style={{ position: "absolute", left: 560, top: 130 + (1 - pr(f, 6, 20)) * 100, width: 800, height: 840, borderRadius: 34, background: "#F1F5F9", opacity: pr(f, 6, 20), boxShadow: "0 50px 140px #000D", overflow: "hidden" }}>
          <div style={{ height: 90, background: "#fff", borderBottom: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", fontSize: 24, fontWeight: 900, color: INK }}>Welding · Evening 🔥<span style={{ padding: "4px 14px", borderRadius: 999, background: "#DC2626", color: "#fff", fontSize: 20 }}>+{n}</span></div>
          <div style={{ position: "absolute", left: 0, top: 90, width: 800, bottom: 0, overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 20 - scroll, width: 800 }}>
            <div style={{ margin: "0 28px 16px auto", width: 520, padding: "16px 20px", borderRadius: 20, background: BLUE, color: "#fff", fontSize: 20, fontWeight: 700, opacity: pr(f, HK.link - 6, 10) }}>Demo video! 🎥 vimeo.com/883104227<br /><span style={{ fontSize: 15, opacity: 0.8 }}>Ray · 6:02 PM</span></div>
            {MSGS.map((m, i) => <div key={i} style={{ margin: i % 3 === 2 ? "0 28px 14px auto" : "0 auto 14px 28px", width: "fit-content", maxWidth: 520, padding: "14px 20px", borderRadius: 20, background: "#fff", fontSize: 20, fontWeight: 600, color: INK, boxShadow: "0 2px 8px #0001" }}>{m}</div>)}
          </div></div>
        </div>
        <Scribble f={f} at={HK.nobody} d={18} out={DURATIONS.h0 + 20} kind="ring" x={716} y={844} w={360} h={90} seed={7} color="#F87171" sw={10} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { one: cue("p6", "one"), right: cue("p6", "right"), nothing: cue("p6", "nothing") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const chips: [string, number, string][] = [["🎬 1 video", PY.one, "#93C5FD"], ["👥 Evening cohort only", PY.right, "#86EFAC"], ["✨ Summary + Q&As", PY.nothing, "#FCD34D"]];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 8) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * lin(f, PAY_START, SCENES_END)})` }}>
        <div style={{ position: "absolute", left: 610, top: 170, width: 700, height: 400, borderRadius: 26, background: "linear-gradient(135deg,#F97316,#0F172A)", boxShadow: "0 40px 120px #000C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 110, opacity: pr(f, PAY_START + 4, 12) }}>▶</div>
        {chips.map(([t, at, c], i) => {
          const s = sp(f, at, 30, { damping: 12 });
          return <div key={t} style={{ position: "absolute", left: 250 + i * 480, top: 680, width: 440, padding: "22px 0", textAlign: "center", borderRadius: 999, background: "rgba(4,7,22,0.85)", border: `3px solid ${c}88`, color: c, fontSize: 32, fontWeight: 900, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 40}px)` }}>{t}</div>;
        })}
        <Confetti f={f} at={PY.nothing + 10} cx={960} cy={420} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(6, "swish", 0.4); add(HK.link - 6, "pop", 0.45);
  for (let i = 0; i < 10; i++) add(HK.forty - 4 + i * 4, "pop", 0.18);
  add(HK.forty, "riser", 0.3); add(HK.nobody, "thud", 0.55);
  add(DURATIONS.h0 - 6, "whoosh", 0.5); add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  for (let i = 0; i < 14; i++) add(T.typeTitle + i * 1.4, ["key0", "key1", "key2"][i % 3], 0.18);
  add(T.paste + 2, "thud", 0.4); add(T.pickCohort + 2, "ding", 0.45);
  add(T.clickCreate + 2, "thud", 0.5); add(T.clickCreate + 4, "chime", 0.6);
  add(T.clickTr + 4, "swish", 0.4); for (let i = 0; i < 4; i++) add(T.sumIn + i * 8, "pop", 0.35);
  add(T.learner, "whoosh", 0.45); add(T.clickView + 2, "swish", 0.4); add(T.only, "ding", 0.45);
  add(PAY_START - 3, "whoosh", 0.5); add(PY.one, "pop", 0.4); add(PY.right, "pop", 0.4); add(PY.nothing, "chime", 0.65);
  return a;
})();

export const MediaShareStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="mediastory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner]} />;
};
