import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE, GREEN } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * DocsLabsStoryVideo — premium landscape (sheet serial 35). Story: Nadia Price, Northgate Tech Academy (fictional).
 * Verified in code: SB-Branch DocumnetAndLabs ("Documents and Labs", "The Skillbnk's shared documents with students, sessions, and
 * bootcamps.", "Enter Name Here...", "Add New", columns SN / Name / Tags / Audience / Published / Created By / Creation Date / Actions,
 * Assigned To: Bootcamp / Session / Group), CreateUpdateDocLabsModal ("Add New Document", name, description, Slide "Select Slide",
 * Tags "Enter Tags", Is Free?, Publish, Create, toast "Document created successfully!"). SB-Learner DocsPage en.ts
 * ("Document & Labs Details", "View your documents & labs with ease", Table of Contents, Tags, Sessions, Programs,
 * "Attached slide", "View slide").
 * Voice: python3 generate-voice-story.py src/DocsLabsStoryVideo.tsx public/docsstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "p5"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 216,
  d1: 156,
  d2: 164,
  d3: 166,
  d4: 248,
  p5: 157,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "p5"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 21, 29, 36, 43, 50, 58, 94, 94, 100, 108, 114, 125, 131, 141, 162, 165, 168, 174],
  d1: [2, 13, 27, 44, 52, 67, 75, 82, 101, 108, 122],
  d2: [2, 11, 32, 36, 45, 70, 73, 78, 103, 107, 112, 117, 129, 129, 135],
  d3: [2, 13, 30, 31, 35, 38, 48, 83, 84, 93, 117, 121, 129],
  d4: [2, 13, 24, 30, 36, 42, 76, 77, 89, 96, 103, 108, 113, 120, 154, 160, 167, 175, 186, 199, 206, 214],
  p5: [2, 18, 31, 55, 65, 100, 108, 116, 120, 126],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Nadia's lab guide is on version four. Half her class is still following version one, from an old email.",
  d1: "This time, she opens Documents and Labs, and clicks Add New.",
  d2: "A name, the lab steps, a few tags, and the slide that goes with it.",
  d3: "She assigns it to the evening cohort, turns on Publish, and clicks Create.",
  d4: "Now let's see the learner side. Omar opens the lab in his learner portal. Always the latest version, with the slide attached.",
  p5: "One lab guide. One version. Everyone on the same page.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, SEG_START, WT);

const MENU = ["Dashboard", "Approved Member", "Audio/Video Sending", "Documents and Labs", "Assignments", "Settings"];
const ICONS = ["▦", "✅", "🎬", "📄", "📝", "⚙"];
const NAME = "Lab 4 — Configure a Cisco VLAN";
const STEPS_TXT = ["1. Open the switch console", "2. Create VLAN 20 named SALES", "3. Assign ports Fa0/1 – Fa0/12", "4. Verify with show vlan brief"];
const ROWS = [
  { n: "Lab 3 — Subnetting drill", t: ["networking"], a: "Evening cohort" },
  { n: "Linux file permissions cheat sheet", t: ["linux"], a: "All sessions" },
  { n: "Lab 2 — Cable a small office", t: ["hardware"], a: "Morning cohort" },
];

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "documents", -6),
  clickAdd: cue("d1", "add", 0),
  typeName: cue("d2", "name", -4),
  typeSteps: cue("d2", "steps", -6),
  tags: cue("d2", "tags", -4),
  clickSlide: cue("d2", "slide", -4),
  clickAssign: cue("d3", "assigns", -4),
  pickCohort: cue("d3", "evening", -2),
  publish: cue("d3", "publish", -4),
  clickCreate: cue("d3", "create", 0),
  learner: cue("d4", "learner", -8),
  latest: cue("d4", "latest"),
  slideAtt: cue("d4", "slide"),
};
const CLICKS = [T.clickMenu, T.clickAdd, T.typeName, T.typeSteps, T.tags, T.clickSlide, T.clickAssign, T.pickCohort, T.publish, T.clickCreate];

const COLS = [{ h: "SN", w: 60 }, { h: "Name", w: 380 }, { h: "Tags", w: 170 }, { h: "Audience", w: 190 }, { h: "Published", w: 130 }, { h: "Created By", w: 180 }, { h: "Actions", w: 160 }];
const TBX = 32, TBY = 130, RH = 70;
const ADD = MA(1225, 48);
const Switch: React.FC<{ on: boolean }> = ({ on }) => <span style={{ width: 46, height: 26, borderRadius: 13, background: on ? GREEN : "#D1D5DB", position: "relative", display: "inline-block" }}><span style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff" }} /></span>;
const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const created = f >= T.clickCreate + 4;
  const shift = created ? pr(f, T.clickCreate + 4, 14) : 0;
  const rows = created ? [{ n: NAME, t: ["networking", "lab"], a: "Evening cohort" }, ...ROWS] : ROWS;
  return (
    <>
      <PageHead title="Documents and Labs" sub="The Skillbnk's shared documents with students, sessions, and bootcamps." />
      <div style={{ position: "absolute", left: 800, top: 24, width: 340, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Enter Name Here...</div>
      <Btn x={1160} y={24} w={150} label="＋  Add New" primary fs={18} press={f >= T.clickAdd && f < T.clickAdd + 6 ? 1 : 0} glow={f >= T.clickAdd - 12 && f < T.clickAdd ? lin(f, T.clickAdd - 12, T.clickAdd) : 0} />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={created ? 0 : -1} oRow={(i) => (created && i === 0 ? shift : 1)}
        rows={rows.map((r, i) => [
          <span style={{ color: GRAY }}>{i + 1}</span>, <b style={{ fontWeight: 800 }}>📄 {r.n}</b>,
          <div style={{ display: "flex", gap: 6 }}>{r.t.map((x) => <Badge key={x} t={x} c={BLUE} bg="#EEF2FF" fs={13} />)}</div>, r.a, <Switch on />,
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar t="NP" s={30} />Nadia Price</div>,
          <div style={{ display: "flex", gap: 8 }}>{["👁", "✎", "⋮"].map((g) => <span key={g} style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, fontWeight: 900 }}>{g}</span>)}</div>,
        ])} />
    </>
  );
};

const MX = 140, MY = 20, MW = 1080, MH = 790;
const MP = (x: number, y: number) => CT(MX + x, MY + y);
const AddModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickAdd + 4, b = T.clickCreate + 4;
  if (f < a - 1 || f > b + 14) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 15, stiffness: 170 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b, b + 12));
  const nSteps = Math.floor(lin(f, T.typeSteps, T.tags - 4) * 4.99);
  const tagN = f >= T.tags + 10 ? 2 : f >= T.tags + 2 ? 1 : 0;
  const box = (x: number, y: number, w: number, h: number, focus: boolean, child: React.ReactNode) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${focus ? BLUE : "#D1D5DB"}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : "none", background: "#fff", padding: "0 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600, color: INK }}>{child}</div>;
  const lab = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 17, fontWeight: 800, color: "#374151" }}>{t}</div>;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: MX, top: MY + (1 - inn) * 50, width: MW, height: MH, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 28, fontWeight: 900, color: INK }}>Add New Document</div>
        {lab(30, 80, "Name *")}
        {box(30, 106, 620, 50, f >= T.typeName && f < T.typeSteps, typed(f, T.typeName, NAME, 1.3) || <span style={{ color: "#9CA3AF" }}>Enter name</span>)}
        {lab(30, 176, "Description")}
        <div style={{ position: "absolute", left: 30, top: 202, width: 620, height: 250, borderRadius: 12, border: `2px solid ${f >= T.typeSteps && f < T.tags ? BLUE : "#D1D5DB"}`, padding: 16, boxSizing: "border-box", fontSize: 19, fontWeight: 600, color: INK, lineHeight: 1.7 }}>
          {STEPS_TXT.slice(0, nSteps).map((s) => <div key={s}>{s}</div>)}
        </div>
        {lab(680, 80, "Slide")}
        {box(680, 106, 370, 50, f >= T.clickSlide && f < T.clickAssign, f >= T.clickSlide + 6 ? "🖼 VLAN basics — 12 slides" : <span style={{ color: "#9CA3AF" }}>Select Slide</span>)}
        {lab(680, 176, "Tags")}
        {box(680, 202, 370, 50, f >= T.tags && f < T.clickSlide, tagN ? <>{["networking", "lab"].slice(0, tagN).map((t) => <Badge key={t} t={t} c={BLUE} bg="#EEF2FF" fs={14} />)}</> : <span style={{ color: "#9CA3AF" }}>Enter Tags</span>)}
        {lab(680, 272, "Assigned To")}
        {box(680, 298, 370, 50, f >= T.clickAssign && f < T.publish, f >= T.pickCohort + 4 ? "Session · Evening cohort" : <span style={{ color: "#9CA3AF" }}>Bootcamp / Session / Group</span>)}
        {lab(680, 372, "Is Free?")}
        <div style={{ position: "absolute", left: 680, top: 398 }}><Switch on={false} /></div>
        {lab(850, 372, "Publish")}
        <div style={{ position: "absolute", left: 850, top: 398, transform: `scale(${f >= T.publish && f < T.publish + 6 ? 1.15 : 1})` }}><Switch on={f >= T.publish + 2} /></div>
        <Btn x={790} y={MH - 76} w={120} label="Cancel" fs={18} />
        <Btn x={930} y={MH - 76} w={120} label="Create" primary fs={18} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} glow={f >= T.clickCreate - 12 && f < T.clickCreate ? lin(f, T.clickCreate - 12, T.clickCreate) : 0} />
        {f >= T.clickAssign + 2 && f < T.pickCohort + 8 && (
          <div style={{ position: "absolute", left: 680, top: 352, width: 370, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0005", padding: 6, opacity: pr(f, T.clickAssign + 2, 8) }}>
            {["Morning cohort", "Evening cohort", "Weekend cohort"].map((t) => <div key={t} style={{ height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, fontWeight: 700, color: t === "Evening cohort" && f >= T.pickCohort - 8 ? BLUE : INK, background: t === "Evening cohort" && f >= T.pickCohort - 8 ? "#EEF2FF" : "transparent" }}>{t}</div>)}
          </div>
        )}
      </div>
    </>
  );
};

const LearnerPage: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC", opacity: pr(f, T.learner + 4, 10) }}>
    <PageHead title="Document & Labs Details" sub="View your documents & labs with ease" />
    <div style={{ position: "absolute", left: 32, top: 110, width: 1000, height: 700, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}`, padding: 34, boxSizing: "border-box" }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: INK }}>{NAME}</div>
      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}><Badge t="networking" c={BLUE} bg="#EEF2FF" fs={14} /><Badge t="lab" c={BLUE} bg="#EEF2FF" fs={14} /><span style={{ marginLeft: 14, fontSize: 16, fontWeight: 700, color: f >= T.latest ? GREEN : GRAY }}>Last Updated: Oct 14, 2026{f >= T.latest ? " ✓" : ""}</span></div>
      <div style={{ marginTop: 26, fontSize: 22, fontWeight: 600, color: INK, lineHeight: 1.9 }}>{STEPS_TXT.map((s, i) => <div key={s} style={{ opacity: pr(f, T.learner + 12 + i * 5, 10) }}>{s}</div>)}</div>
    </div>
    <div style={{ position: "absolute", left: 1060, top: 110, width: 260, padding: 22, borderRadius: 18, background: "#fff", border: `2px solid ${LINE}`, boxSizing: "border-box" }}>
      <div style={{ fontSize: 18, fontWeight: 900, color: INK }}>Table of Contents</div>
      {["Open console", "Create VLAN", "Assign ports", "Verify"].map((t) => <div key={t} style={{ marginTop: 10, fontSize: 16, fontWeight: 600, color: GRAY }}>• {t}</div>)}
      <div style={{ marginTop: 18, fontSize: 18, fontWeight: 900, color: INK }}>Sessions</div>
      <div style={{ marginTop: 6, fontSize: 16, fontWeight: 600, color: GRAY }}>Evening cohort</div>
    </div>
    <div style={{ position: "absolute", left: 1060, top: 430, width: 260, padding: 22, borderRadius: 18, background: "#fff", border: `2px solid ${f >= T.slideAtt ? BLUE : LINE}`, boxSizing: "border-box", boxShadow: f >= T.slideAtt ? "0 0 0 6px #1D3FD622" : "none" }}>
      <div style={{ fontSize: 18, fontWeight: 900, color: INK }}>Attached slide</div>
      <div style={{ marginTop: 12, height: 120, borderRadius: 12, background: "linear-gradient(135deg,#1D3FD6,#0F172A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>VLAN basics</div>
      <div style={{ marginTop: 12, textAlign: "center", padding: "10px 0", borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 16 }}>View slide</div>
    </div>
  </div>
);

const camClamp = (k: K4): K4 => [k[0], Math.max(760, Math.min(1080, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.22, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickMenu - 16, 600, 440, 1.2],
  [T.clickAdd - 12, 1300, 300, 1.25],
  [T.clickAdd + 16, 960, 520, 1.05],
  [T.typeName, 800, 380, 1.18],
  [T.typeSteps + 10, 800, 520, 1.15],
  [T.tags, 1150, 420, 1.18],
  [T.clickAssign, 1150, 560, 1.2],
  [T.clickCreate - 10, 1150, 760, 1.22],
  [T.clickCreate + 20, 960, 480, 1.08],
  [T.learner, 960, 540, 1.0],
  [T.latest - 4, 800, 440, 1.15],
  [T.slideAtt - 4, 1100, 640, 1.2],
  [PAY_START, 960, 540, 1.05],
]).map(camClamp);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...menuPt(3)],
  [T.clickAdd, ADD[0], ADD[1]],
  [T.typeName, ...MP(330, 131)],
  [T.typeSteps, ...MP(330, 320)],
  [T.tags, ...MP(865, 227)],
  [T.clickSlide, ...MP(865, 131)],
  [T.clickAssign, ...MP(865, 323)],
  [T.pickCohort, ...MP(865, 352 + 6 + 44 + 22)],
  [T.publish, ...MP(873, 411)],
  [T.clickCreate, ...MP(990, MH - 52)],
  [T.learner + 20, 1300, 800],
  [T.slideAtt, ...CT(1190, 690)],
]);
const STEPS = [
  { at: T.clickMenu, to: SEG_START.d2, label: "ADD NEW" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "STEPS · TAGS · SLIDE" },
  { at: SEG_START.d3, to: T.learner, label: "ASSIGN & PUBLISH" },
  { at: T.learner, to: PAY_START, label: "LEARNER SEES THE LATEST" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = f >= T.learner;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={T.learner} url="learner.northgate.example.com/documents-and-labs" sidebar={false} main={<LearnerPage f={f} />} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url="academy.skillbnk.com/documents-and-labs" active={f >= T.clickMenu ? "Documents and Labs" : "Dashboard"} menu={MENU} menuIcons={ICONS} main={<ListPage f={f} />} overlay={<><AddModal f={f} /><Toast f={f} at={T.clickCreate + 3} text="Document created successfully!" d={60} /></>} />
        )}
        <Scribble f={f} at={T.publish + 6} d={14} out={T.clickCreate - 4} kind="ring" x={MP(873, 411)[0]} y={MP(873, 411)[1]} w={130} h={70} seed={4} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.latest} d={16} out={T.slideAtt - 4} kind="under" x={CT(560, 0)[0]} y={CT(0, 206)[1]} w={330} seed={5} worldW={1920} worldH={1080} />
        <Confetti f={f} at={T.clickCreate + 4} cx={1000} cy={360} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook: version chaos ─────────
const HK = { four: cue("h0", "four"), half: cue("h0", "half"), one: cue("h0", "one"), email: cue("h0", "email") };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.half - 6, HK.email + 10);
  const files = ["Lab4_v1.pdf", "Lab4_v2_fixed.pdf", "Lab4_v3_FINAL.pdf", "Lab4_v4_use-this.pdf"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * lin(f, 0, DURATIONS.h0)})` }}>
        <HookTag f={f} text="🧪 LAB DAY · NETWORKING" />
        {files.map((t, i) => {
          const s = sp(f, 10 + i * 10, 30, { damping: 12 });
          const isOld = i === 0, isNew = i === 3;
          return (
            <div key={t} style={{ position: "absolute", left: 230 + i * 380, top: 330 + (i % 2) * 60, width: 320, height: 400, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #000C", opacity: Math.min(1, s * 2), transform: `rotate(${[-5, 3, -2, 4][i]}deg) translateY(${(1 - Math.min(1, s)) * 80}px)`, padding: 26, boxSizing: "border-box", border: f >= HK.half && isOld ? "5px solid #F87171" : f >= HK.four && isNew ? "5px solid #22C55E" : "none" }}>
              <div style={{ fontSize: 80, textAlign: "center" }}>📄</div>
              <div style={{ marginTop: 18, fontSize: 22, fontWeight: 900, color: INK, textAlign: "center" }}>{t}</div>
              {f >= HK.half && isOld && <div style={{ marginTop: 24, textAlign: "center", fontSize: 22, fontWeight: 900, color: "#DC2626" }}>👥 11 learners using this</div>}
              {f >= HK.four && isNew && <div style={{ marginTop: 24, textAlign: "center", fontSize: 22, fontWeight: 900, color: "#16A34A" }}>✓ the right one</div>}
            </div>
          );
        })}
        <Scribble f={f} at={HK.email} d={18} out={DURATIONS.h0 + 20} kind="ring" x={390} y={530} w={420} h={480} seed={7} color="#F87171" sw={10} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PY = { one: cue("p5", "guide"), ver: cue("p5", "version"), page: cue("p5", "page") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 8) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
    <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * lin(f, PAY_START, SCENES_END)})` }}>
      <div style={{ position: "absolute", left: 760, top: 200, width: 400, height: 500, borderRadius: 26, background: "#fff", boxShadow: "0 40px 120px #000C", textAlign: "center", padding: 30, boxSizing: "border-box", opacity: pr(f, PY.one - 4, 12), transform: `scale(${0.8 + 0.2 * pr(f, PY.one - 4, 12)})` }}>
        <div style={{ fontSize: 110 }}>📄</div>
        <div style={{ marginTop: 10, fontSize: 26, fontWeight: 900, color: INK }}>{NAME}</div>
        <div style={{ marginTop: 20, display: "inline-block", padding: "8px 20px", borderRadius: 999, background: "#DCFCE7", color: "#15803D", fontWeight: 900, fontSize: 22, opacity: pr(f, PY.ver, 10) }}>✓ One version</div>
      </div>
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        const s = sp(f, PY.page + i * 2, 30, { damping: 12 });
        return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * 520 - 32, top: 450 + Math.sin(ang) * 330 - 32, opacity: Math.min(1, s * 2), transform: `scale(${Math.min(1, s)})` }}><Avatar t={"ABCDEFGHJKLM"[i] + "X"} s={64} /></div>;
      })}
      <Confetti f={f} at={PY.page + 10} cx={960} cy={420} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); for (let i = 0; i < 4; i++) add(10 + i * 10, "pop", 0.35);
  add(HK.half, "riser", 0.3); add(HK.email, "thud", 0.55);
  add(DURATIONS.h0 - 6, "whoosh", 0.5); add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  for (let i = 0; i < 14; i++) add(T.typeName + i * 1.4, ["key0", "key1", "key2"][i % 3], 0.18);
  for (let i = 0; i < 4; i++) add(T.typeSteps + i * 8, "pop", 0.3);
  add(T.pickCohort + 2, "ding", 0.45); add(T.publish + 2, "pop", 0.5);
  add(T.clickCreate + 2, "thud", 0.5); add(T.clickCreate + 4, "chime", 0.6);
  add(T.learner, "whoosh", 0.45); add(T.latest, "ding", 0.45); add(T.slideAtt, "pop", 0.4);
  add(PAY_START - 3, "whoosh", 0.5); add(PY.ver, "ding", 0.5); add(PY.page, "chime", 0.65);
  return a;
})();

export const DocsLabsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="docsstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner]} />;
};
