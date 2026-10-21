import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * LearnerStatusStoryVideo — premium landscape (sheet serial 30). Story: Priya Shah, admissions lead at Brightpath Academy (fictional).
 * Verified in code (SB-Branch EnrollmentStudents): menu items "Pending Member", "Trial Member", "Approved Member", "Inactive Members"
 * (menu-builder staticMenu); page titles "Pending Members" / "Trial Members" / "Inactive Members"; search "Enter Username/Email...";
 * columns Name, Email, Bootcamp, Session, Enrollment Date, State (Verified / Not Verified), Trial End Date, Last Login, Actions
 * (Edit pencil + more menu with Email / Message); MemberDetails form: "Status:" select Pending / Approved / Inactive / Trial,
 * "Enrolled Program:", "Enrolled Session:", Update; toast "Member updated successfully".
 * Voice: python3 generate-voice-story.py src/LearnerStatusStoryVideo.tsx public/statusstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "p6"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 333,
  d1: 192,
  d2: 146,
  d3: 207,
  d4: 202,
  d5: 246,
  p6: 213,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "p6"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 30, 57, 84, 84, 93, 111, 120, 126, 144, 165, 165, 171, 198, 206, 217, 225, 258, 265, 280, 291],
  d1: [2, 12, 32, 39, 50, 65, 97, 105, 115, 120, 127, 135, 148, 156],
  d2: [2, 14, 27, 44, 51, 57, 66, 88, 100, 108],
  d3: [2, 24, 74, 78, 88, 99, 105, 113, 127, 154, 160, 170],
  d4: [2, 24, 32, 67, 72, 82, 93, 99, 106, 129, 134, 145, 155, 168],
  d5: [2, 16, 36, 49, 69, 78, 87, 120, 126, 133, 151, 154, 161, 171, 186, 193],
  p6: [2, 21, 61, 67, 77, 86, 93, 101, 136, 153, 153, 172],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Monday, nine AM. Priya has thirty-seven names in a spreadsheet. Who is waiting? Whose trial ends Friday? Who quietly stopped coming?",
  d1: "This time, she opens Pending Member. Everyone waiting for a decision is right here.",
  d2: "She types Jordan in the search, and opens his enrollment.",
  d3: "Status, Approved. His program and session are already set. She clicks Update.",
  d4: "Then Trial Member. Every trial shows its end date, so nobody slips past Friday.",
  d5: "And Inactive Members shows who stopped coming. One click, and she can email or message them.",
  p6: "Four lists. Every learner in the right place. Priya's Monday is sorted.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, SEG_START, WT);

// ───────── data ─────────
const MENU = ["Dashboard", "Leaderboard", "Pending Member", "Trial Member", "Approved Member", "Inactive Members", "Assignments", "Settings"];
const ICONS = ["▦", "🏆", "⏳", "🧪", "✅", "💤", "📝", "⚙"];
type P = { n: string; e: string; b: string; s: string; d: string; v: boolean; t?: string; l?: string };
const PENDING: P[] = [
  { n: "Jordan Lee", e: "jordan.lee@example.com", b: "Medical Assistant", s: "Evening cohort", d: "Oct 09, 2026", v: true },
  { n: "Ana Ruiz", e: "ana.ruiz@example.com", b: "Phlebotomy Tech", s: "Weekend", d: "Oct 09, 2026", v: true },
  { n: "Kevin Park", e: "kevin.park@example.com", b: "Medical Assistant", s: "Morning cohort", d: "Oct 08, 2026", v: false },
  { n: "Lila Chen", e: "lila.chen@example.com", b: "Pharmacy Tech", s: "Evening cohort", d: "Oct 08, 2026", v: true },
  { n: "Omar Haddad", e: "omar.h@example.com", b: "Phlebotomy Tech", s: "Weekend", d: "Oct 07, 2026", v: true },
];
const TRIAL: P[] = [
  { n: "Grace Kim", e: "grace.kim@example.com", b: "Medical Assistant", s: "Evening cohort", d: "", v: true, t: "Oct 16, 2026" },
  { n: "Diego Alvarez", e: "diego.a@example.com", b: "Pharmacy Tech", s: "Morning cohort", d: "", v: true, t: "Oct 21, 2026" },
  { n: "Hana Sato", e: "hana.s@example.com", b: "Phlebotomy Tech", s: "Weekend", d: "", v: true, t: "Oct 24, 2026" },
  { n: "Ethan Brooks", e: "ethan.b@example.com", b: "Medical Assistant", s: "Evening cohort", d: "", v: false, t: "Oct 30, 2026" },
];
const INACTIVE: P[] = [
  { n: "Sam Okafor", e: "sam.okafor@example.com", b: "Medical Assistant", s: "Evening cohort", d: "", v: true, l: "Sep 02, 2026" },
  { n: "Maya Torres", e: "maya.torres@example.com", b: "Pharmacy Tech", s: "Weekend", d: "", v: true, l: "Aug 27, 2026" },
  { n: "Ravi Menon", e: "ravi.m@example.com", b: "Phlebotomy Tech", s: "Morning cohort", d: "", v: true, l: "Aug 19, 2026" },
];

// ───────── timing ─────────
const T = {
  appIn: DEMO_START,
  clickPending: cue("d1", "pending", -6),
  ring: cue("d1", "everyone"),
  clickSearch: cue("d2", "types", -8),
  typeJ: cue("d2", "jordan", -4),
  clickEdit: cue("d2", "opens", 6),
  clickStatus: cue("d3", "status", -2),
  pickApproved: cue("d3", "approved", -2),
  progRing: cue("d3", "program"),
  clickUpdate: cue("d3", "update", 2),
  clickTrial: cue("d4", "trial", -6),
  endRing: cue("d4", "end"),
  clickInactive: cue("d5", "inactive", -6),
  clickMore: cue("d5", "click", -2),
  clickEmail: cue("d5", "email", 2),
};
const CLICKS = [T.clickPending, T.clickSearch, T.clickEdit, T.clickStatus, T.pickApproved, T.clickUpdate, T.clickTrial, T.clickInactive, T.clickMore, T.clickEmail];
const page = (f: number) => (f >= T.clickInactive + 2 ? "inactive" : f >= T.clickTrial + 2 ? "trial" : f >= T.clickEdit + 4 ? "detail" : "pending");

// ───────── targets (world) ─────────
const COLS_P = [{ h: "Name", w: 220 }, { h: "Email", w: 270 }, { h: "Bootcamp", w: 240 }, { h: "Session", w: 160 }, { h: "Enrollment Date", w: 170 }, { h: "State", w: 120 }, { h: "Actions", w: 110 }];
const COLS_T = [{ h: "Name", w: 220 }, { h: "Email", w: 270 }, { h: "Bootcamp", w: 240 }, { h: "Session", w: 160 }, { h: "Trial End Date", w: 170 }, { h: "State", w: 120 }, { h: "Actions", w: 110 }];
const COLS_I = [{ h: "Name", w: 220 }, { h: "Email", w: 270 }, { h: "Bootcamp", w: 240 }, { h: "Session", w: 160 }, { h: "Last Login", w: 170 }, { h: "State", w: 120 }, { h: "Actions", w: 110 }];
const TBX = 32, TBY = 130, RH = 66;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const EDIT = MA(TBX + 1180 + 16 + 18, rowY(0));
const MORE = MA(TBX + 1180 + 16 + 64, rowY(0));
const SEARCH = MA(1000, 48);
const STATUS = MA(330, 226);
const APPROVED = MA(200, 226 + 44 + 30 + 52);
const UPDATE = MA(1250, 520);
const TRIALDATE = MA(TBX + 890 + 70, rowY(0));
const EMAILI = MA(TBX + 1180 - 60, rowY(0) + 58);

const Verified: React.FC<{ v: boolean }> = ({ v }) => (v ? <Badge t="Verified" c="#15803D" bg="#DCFCE7" fs={15} /> : <Badge t="Not Verified" c="#B45309" bg="#FEF3C7" fs={15} />);
const Acts: React.FC<{ glowEdit?: boolean; glowMore?: boolean }> = ({ glowEdit, glowMore }) => (
  <div style={{ display: "flex", gap: 10 }}>
    {[["✎", glowEdit], ["⋮", glowMore]].map(([g, on], i) => (
      <div key={i} style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${on ? BLUE : LINE}`, background: on ? "#EEF2FF" : "#EEF2FF80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: BLUE }}>{g as string}</div>
    ))}
  </div>
);
const NameCell: React.FC<{ p: P }> = ({ p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar t={p.n.split(" ").map((x) => x[0]).join("")} s={34} /><b style={{ fontWeight: 800 }}>{p.n}</b></div>
);
const Search: React.FC<{ text: string; focus: boolean }> = ({ text, focus }) => (
  <div style={{ position: "absolute", left: 800, top: 24, width: 400, height: 48, borderRadius: 12, border: `2px solid ${focus ? BLUE : LINE}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : "none", background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: text ? INK : "#9CA3AF", fontWeight: 600, fontFamily: FONT }}>⌕&nbsp;&nbsp;{text || "Enter Username/Email..."}</div>
);

const PendingPage: React.FC<{ f: number }> = ({ f }) => {
  const q = typed(f, T.typeJ, "Jordan", 0.5);
  const filt = q.length >= 3 ? lin(f, T.typeJ + 6, T.typeJ + 16) : 0;
  return (
    <>
      <PageHead title="Pending Members" sub="Enrollments waiting for a decision" />
      <Search text={q} focus={f >= T.clickSearch && f < T.clickEdit} />
      <Table x={TBX} y={TBY} cols={COLS_P} rowH={RH} hl={f >= T.clickEdit - 14 ? 0 : -1}
        oRow={(i) => (i === 0 ? 1 : 1 - filt)}
        rows={PENDING.map((p, i) => [<NameCell p={p} />, <span style={{ color: GRAY }}>{p.e}</span>, p.b, p.s, <span style={{ color: GRAY }}>{p.d}</span>, <Verified v={p.v} />, <Acts glowEdit={i === 0 && f >= T.clickEdit - 12} />])} />
    </>
  );
};

const Select: React.FC<{ x: number; y: number; w: number; label: string; value: string; focus?: boolean; ring?: boolean }> = ({ x, y, w, label, value, focus, ring }) => (
  <>
    <div style={{ position: "absolute", left: x, top: y, fontSize: 17, fontWeight: 800, color: "#374151" }}>{label}</div>
    <div style={{ position: "absolute", left: x, top: y + 28, width: w, height: 52, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${focus ? BLUE : "#D1D5DB"}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : ring ? "0 0 0 4px #BBF7D0" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 700, color: INK }}>{value}<span style={{ color: GRAY }}>⌄</span></div>
  </>
);
const DetailPage: React.FC<{ f: number }> = ({ f }) => {
  const approved = f >= T.pickApproved + 2;
  const open = f >= T.clickStatus + 2 && f < T.pickApproved + 8;
  const o = pr(f, T.clickStatus + 2, 8) * (1 - lin(f, T.pickApproved + 2, T.pickApproved + 8));
  const opts = ["Pending", "Approved", "Inactive", "Trial"];
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.clickEdit + 4, 10) }}>
      <div style={{ position: "absolute", left: 32, top: 22, display: "flex", alignItems: "center", gap: 16 }}><Avatar t="JL" s={56} /><div><div style={{ fontSize: 30, fontWeight: 900, color: INK }}>Jordan Lee</div><div style={{ fontSize: 17, fontWeight: 600, color: GRAY }}>jordan.lee@example.com · Medical Assistant</div></div></div>
      <div style={{ position: "absolute", left: 32, top: 150, width: 1286, height: 420, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 6px 24px #0000000d" }} />
      <Select x={60} y={190} w={560} label="Status:" value={approved ? "Approved" : "Pending"} focus={open} />
      <Select x={700} y={190} w={590} label="Enrolled Program:" value="Medical Assistant — Fall 2026" ring={f >= T.progRing && f < T.clickUpdate} />
      <Select x={60} y={310} w={560} label="Enrolled Session:" value="Evening cohort" ring={f >= T.progRing && f < T.clickUpdate} />
      <Btn x={1130} y={492} w={160} label="Update" primary press={f >= T.clickUpdate && f < T.clickUpdate + 6 ? 1 : 0} glow={f >= T.clickUpdate - 12 && f < T.clickUpdate ? lin(f, T.clickUpdate - 12, T.clickUpdate) : 0} />
      {open && (
        <div style={{ position: "absolute", left: 60, top: 300, width: 560, borderRadius: 14, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0005", opacity: o, transform: `translateY(${(1 - o) * 12}px)`, padding: 6, zIndex: 5 }}>
          {opts.map((t) => {
            const on = t === "Approved" && f >= T.pickApproved - 10;
            return <div key={t} style={{ height: 52, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 19, fontWeight: 700, color: on ? BLUE : INK, background: on ? "#EEF2FF" : "transparent" }}>{t}{on && <span style={{ marginLeft: "auto" }}>✓</span>}</div>;
          })}
        </div>
      )}
    </div>
  );
};

const TrialPage: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, opacity: pr(f, T.clickTrial + 2, 10) }}>
    <PageHead title="Trial Members" sub="Learners on a trial, with the date it ends" />
    <Search text="" focus={false} />
    <Table x={TBX} y={TBY} cols={COLS_T} rowH={RH} hl={f >= T.endRing ? 0 : -1}
      oRow={(i) => pr(f, T.clickTrial + 4 + i * 4, 10)}
      rows={TRIAL.map((p) => [<NameCell p={p} />, <span style={{ color: GRAY }}>{p.e}</span>, p.b, p.s, <b style={{ fontWeight: 800 }}>{p.t}</b>, <Verified v={p.v} />, <Acts />])} />
  </div>
);
const InactivePage: React.FC<{ f: number }> = ({ f }) => {
  const dd = f >= T.clickMore + 2 ? pr(f, T.clickMore + 2, 8) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: pr(f, T.clickInactive + 2, 10) }}>
      <PageHead title="Inactive Members" sub="Learners who stopped coming" />
      <Search text="" focus={false} />
      <Table x={TBX} y={TBY} cols={COLS_I} rowH={RH} hl={f >= T.clickMore - 10 ? 0 : -1}
        oRow={(i) => pr(f, T.clickInactive + 4 + i * 4, 10)}
        rows={INACTIVE.map((p, i) => [<NameCell p={p} />, <span style={{ color: GRAY }}>{p.e}</span>, p.b, p.s, <span style={{ color: "#B91C1C", fontWeight: 700 }}>{p.l}</span>, <Verified v={p.v} />, <Acts glowMore={i === 0 && f >= T.clickMore - 10} />])} />
      {dd > 0 && (
        <div style={{ position: "absolute", left: TBX + 1180 - 170, top: rowY(0) + 26, width: 200, borderRadius: 14, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0005", padding: 8, opacity: dd, transform: `translateY(${(1 - dd) * 10}px)`, fontFamily: FONT }}>
          {[["✉", "Email"], ["💬", "Message"]].map(([g, t], i) => {
            const on = i === 0 && f >= T.clickEmail - 8;
            return <div key={t} style={{ height: 48, borderRadius: 10, marginBottom: 6, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", fontSize: 18, fontWeight: 800, color: BLUE, background: on ? "#DBEAFE" : "#EEF2FF" }}>{g}&nbsp;{t}</div>;
          })}
        </div>
      )}
    </div>
  );
};

const Main: React.FC<{ f: number }> = ({ f }) => {
  const p = page(f);
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      {p === "pending" && <PendingPage f={f} />}
      {p === "detail" && <DetailPage f={f} />}
      {p === "trial" && <TrialPage f={f} />}
      {p === "inactive" && <InactivePage f={f} />}
    </div>
  );
};

const camClamp = (k: K4): K4 => [k[0], Math.max(760, Math.min(1080, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.22, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickPending - 24, 700, 420, 1.15],
  [T.clickPending + 4, 560, 380, 1.3],
  [T.ring - 4, 960, 520, 1.08],
  [T.clickSearch - 10, 1250, 300, 1.3],
  [T.typeJ + 24, 1250, 300, 1.35],
  [T.clickEdit - 10, 1400, 380, 1.3],
  [T.clickEdit + 14, 960, 500, 1.08],
  [T.clickStatus - 6, 760, 460, 1.25],
  [T.pickApproved + 10, 760, 480, 1.25],
  [T.progRing, 1000, 470, 1.12],
  [T.clickUpdate - 12, 1450, 640, 1.3],
  [T.clickUpdate + 20, 1300, 420, 1.15],
  [T.clickTrial - 16, 700, 460, 1.2],
  [T.clickTrial + 16, 960, 500, 1.06],
  [T.endRing - 6, 1350, 400, 1.3],
  [T.endRing + 50, 1350, 420, 1.3],
  [T.clickInactive - 14, 700, 520, 1.2],
  [T.clickInactive + 16, 960, 500, 1.06],
  [T.clickMore - 10, 1440, 420, 1.3],
  [T.clickEmail + 30, 1440, 440, 1.35],
  [PAY_START, 960, 540, 1.05],
]).map(camClamp);

const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickPending, ...menuPt(2)],
  [T.ring + 10, 1000, 600],
  [T.clickSearch, SEARCH[0], SEARCH[1]],
  [T.clickEdit - 14, EDIT[0] - 60, EDIT[1] + 30],
  [T.clickEdit, EDIT[0], EDIT[1]],
  [T.clickStatus, STATUS[0], STATUS[1]],
  [T.pickApproved, APPROVED[0], APPROVED[1]],
  [T.clickUpdate, UPDATE[0], UPDATE[1]],
  [T.clickTrial, ...menuPt(3)],
  [T.endRing, TRIALDATE[0] + 40, TRIALDATE[1] + 40],
  [T.clickInactive, ...menuPt(5)],
  [T.clickMore, MORE[0], MORE[1]],
  [T.clickEmail, EMAILI[0], EMAILI[1]],
]);
const STEPS = [
  { at: T.clickPending, to: SEG_START.d2, label: "PENDING" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "FIND THE LEARNER" },
  { at: SEG_START.d3, to: SEG_START.d4, label: "CHANGE STATUS" },
  { at: SEG_START.d4, to: SEG_START.d5, label: "TRIALS" },
  { at: SEG_START.d5, to: PAY_START, label: "INACTIVE" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const p = page(f);
  const url = `academy.skillbnk.com/${p === "detail" ? "approved-member/submember-jordan" : p === "trial" ? "trial-member" : p === "inactive" ? "inactive-members" : "pending-member"}`;
  const active = p === "trial" ? "Trial Member" : p === "inactive" ? "Inactive Members" : f >= T.clickPending ? "Pending Member" : "Dashboard";
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        <LandWin f={f} inAt={T.appIn} url={url} active={active} menu={MENU} menuIcons={ICONS} main={<Main f={f} />} overlay={<Toast f={f} at={T.clickUpdate + 3} text="Member updated successfully" />} />
        <Scribble f={f} at={T.ring} d={16} out={T.clickSearch - 4} kind="ring" x={MA(675, 300)[0]} y={MA(675, 300)[1]} w={1330} h={360} seed={3} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.endRing} d={16} out={T.clickInactive - 6} kind="ring" x={TRIALDATE[0]} y={TRIALDATE[1]} w={190} h={60} seed={5} worldW={1920} worldH={1080} />
        <Confetti f={f} at={T.clickUpdate + 4} cx={UPDATE[0] - 300} cy={UPDATE[1] - 200} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { names: cue("h0", "names"), waiting: cue("h0", "waiting"), friday: cue("h0", "friday"), quietly: cue("h0", "quietly"), coming: cue("h0", "coming") };
const SHEET = ["Jordan Lee", "Grace Kim", "Sam Okafor", "Ana Ruiz", "Diego Alvarez", "Maya Torres", "Kevin Park", "Hana Sato"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.waiting - 6, HK.coming + 10);
  const inn = pr(f, 6, 22);
  const n = countUp(f, HK.names - 10, 37, 24);
  const q = (i: number) => sp(f, HK.waiting + i * 6, 30, { damping: 10 });
  const clock = 9 * 60 + Math.floor(lin(f, 0, DURATIONS.h0) * 47);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * lin(f, 0, DURATIONS.h0)})` }}>
        <HookTag f={f} text="⏰ MONDAY · ADMISSIONS" />
        <div style={{ position: "absolute", left: 300, top: 140 + (1 - inn) * 100, width: 980, height: 800, borderRadius: 24, background: "#fff", opacity: inn, boxShadow: "0 50px 140px #000D", overflow: "hidden" }}>
          <div style={{ height: 64, background: "#E7F5EC", borderBottom: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 26px", fontSize: 22, fontWeight: 900, color: "#166534" }}>▦ learners_FINAL_v3.xlsx</div>
          <div style={{ display: "flex", height: 52, background: "#F3F4F6", fontSize: 19, fontWeight: 800, color: "#4B5563", alignItems: "center" }}><span style={{ width: 80, paddingLeft: 26 }}>#</span><span style={{ width: 420 }}>Name</span><span>Status ???</span></div>
          {SHEET.map((s, i) => (
            <div key={s} style={{ display: "flex", height: 82, alignItems: "center", borderTop: `1px solid ${LINE}`, fontSize: 24, fontWeight: 700, color: INK }}>
              <span style={{ width: 80, paddingLeft: 26, color: GRAY }}>{i + 1}</span><span style={{ width: 420 }}>{s}</span>
              <span style={{ fontSize: 34, fontWeight: 900, color: "#DC2626", transform: `scale(${0.3 + 0.7 * Math.min(1.15, q(i))})`, opacity: Math.min(1, q(i) * 2) }}>?</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 1360, top: 220, width: 300, textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, color: warm > 0.5 ? "#FCA5A5" : "#fff", fontVariantNumeric: "tabular-nums" }}>{n}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#CBD5E1" }}>names</div>
          <div style={{ marginTop: 60, fontSize: 64, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{Math.floor(clock / 60)}:{String(clock % 60).padStart(2, "0")}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#CBD5E1" }}>AM</div>
        </div>
        <Scribble f={f} at={HK.quietly} d={18} out={DURATIONS.h0 + 20} kind="ring" x={1000} y={560} w={280} h={600} seed={7} color="#F87171" sw={10} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { four: cue("p6", "four"), every: cue("p6", "every"), sorted: cue("p6", "sorted") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const cards: [string, number, string, string][] = [["Pending", 12, "#FCD34D", "⏳"], ["Trial", 9, "#93C5FD", "🧪"], ["Approved", 11, "#86EFAC", "✅"], ["Inactive", 5, "#FCA5A5", "💤"]];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 8) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * lin(f, PAY_START, SCENES_END)})` }}>
        {cards.map(([t, n, c, g], i) => {
          const s = sp(f, PY.four + i * 7, 30, { damping: 12 });
          return (
            <div key={t} style={{ position: "absolute", left: 210 + i * 390, top: 320, width: 340, height: 360, borderRadius: 28, background: "rgba(4,7,22,0.82)", border: `3px solid ${c}88`, boxShadow: `0 30px 80px #000A, 0 0 40px ${c}33`, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 60}px)`, textAlign: "center", color: "#fff" }}>
              <div style={{ marginTop: 40, fontSize: 60 }}>{g}</div>
              <div style={{ fontSize: 120, fontWeight: 900, color: c, lineHeight: 1.1 }}>{countUp(f, PY.every, n, 24)}</div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>{t.toUpperCase()}</div>
            </div>
          );
        })}
        <Confetti f={f} at={PY.sorted} cx={960} cy={480} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(6, "swish", 0.4);
  for (let i = 0; i < 8; i++) add(HK.waiting + i * 6, "pop", 0.25);
  add(HK.friday, "riser", 0.3); add(HK.quietly, "thud", 0.55);
  add(DURATIONS.h0 - 6, "whoosh", 0.5); add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  for (let i = 0; i < 6; i++) add(T.typeJ + i * 2, ["key0", "key1", "key2"][i % 3], 0.2);
  add(T.clickEdit + 4, "swish", 0.4); add(T.pickApproved + 2, "ding", 0.5);
  add(T.clickUpdate + 2, "thud", 0.5); add(T.clickUpdate + 4, "chime", 0.7);
  add(T.clickTrial + 2, "swish", 0.35); add(T.endRing, "ding", 0.4);
  add(T.clickInactive + 2, "swish", 0.35); add(T.clickMore + 2, "pop", 0.4);
  add(PAY_START - 3, "whoosh", 0.5); for (let i = 0; i < 4; i++) add(PY.four + i * 7, "pop", 0.4); add(PY.sorted, "chime", 0.65);
  return a;
})();

export const LearnerStatusStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="statusstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} />;
};
