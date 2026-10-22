import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, StoryMain, Fx } from "./storyShell";

/**
 * ProgramDashboardStoryVideo — DEEP (sheet serial 47, Program Dashboard). Story: Marcus, Lone Star HVAC Institute (fictional).
 * Verified in code: SB-Branch components/pageList/dashboard/Dashboard.tsx (gradient header = branch name, "Operational work, branch
 * activity, and resource health.", "Live data"; tabs Dashboard / My Dashboard / Leader Board / Bootcamp's Dashboard, ?tab=program-dashboard)
 * and program-dashboard/index.tsx ("Bootcamp Dashboard", "Select a program and session to view the latest statistics.", Program + Session
 * selects (searchable, "All Sessions"), "Updating dashboard" pill + skeletons; cards: Bootcamp's Statistics (Approved / Pending / Inactive /
 * Trial Members, "Membership status for the selected bootcamp"), Assignments (Total Assignments / Total Answers / Accepted / Pending /
 * Rejected, View More → assignments), Documents (Documents & Labs / Users Documents / Shared Documents / Presentations / Slides),
 * Learning Content (BootcampProgress: "Lessons and chapters by category", total + bars per category, View More + program combobox),
 * Video Mock Interviews (Total Questions / Total Answers / Reviewed / Not Reviewed), Program Resources (DataCard "Total available":
 * Interviews, Audios & Videos, Templates, Total Generated Certificate)). Donut = progress/OverallProgress (white % labels > 5%, 100% centre).
 * Voice: python3 generate-voice-story.py src/ProgramDashboardStoryVideo.tsx public/progdashstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 480, d1: 300, d2: 240, d3: 300, d4: 300, d5: 400, d6: 300, d7: 320, d8: 280, d9: 280, d10: 280, d11: 170, p12: 170,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = [];
// @WT-BEGIN
const WT: Record<string, number[]> = {};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Monday, nine a.m. Marcus runs three HVAC programs, and he needs one answer: how is the evening cohort doing? He opens the enrollment sheet, the assignment inbox, the shared drive, the interview recordings, and the certificate folder. By lunch, the numbers still don't match.",
  d1: "In skillbank, Marcus clicks Dashboard. His branch header shows live data, with four tabs: Dashboard, My Dashboard, Leader Board, and Bootcamp's Dashboard.",
  d2: "He opens Bootcamp's Dashboard. One program and one session at a time, every card below shows just that cohort.",
  d3: "He searches the program list for HVAC Technician, then picks the evening session. The dashboard updates in a second.",
  d4: "Bootcamp's statistics: thirty-eight approved members, six pending, three inactive, and two on trial. Each share sits right on the ring.",
  d5: "Assignments: twenty-four assignments, and a hundred sixty-eight answers. A hundred forty-one accepted, eighteen rejected, and nine still pending review. View more opens the full assignment list.",
  d6: "Documents counts what this bootcamp can use: documents and labs, documents students shared, documents the school shared, and presentation slides.",
  d7: "Learning content adds up seventy lessons, split by category. Refrigeration leads, and EPA prep is the thinnest, so Marcus knows what to build next.",
  d8: "Video mock interviews: fifteen questions, eighty-six answers, seventy-four reviewed, and twelve still waiting for feedback.",
  d9: "Program resources: forty interview questions, twenty-six audios and videos, nine templates, and a hundred twelve certificates generated.",
  d10: "Now he switches to the morning session. Same cards, a different cohort: only two pending members, and three assignments to review.",
  d11: "Or he picks all sessions, to see the whole program at once.",
  p12: "Five places, one screen. Monday's answer, before nine fifteen.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  clickMenu: cue("d1", "clicks", -4),
  live: cue("d1", "live", -4),
  tabs: cue("d1", "four", -4),
  tabHover: cue("d1", "bootcamps", -6),
  clickTab: cue("d2", "opens", -2),
  hlProg: cue("d2", "program", -4),
  hlSess: cue("d2", "session", -4),
  cards: cue("d2", "card", -6),
  progOpen: cue("d3", "searches", -4),
  progPick: cue("d3", "technician", 6),
  sessOpen: cue("d3", "picks", -4),
  evePick: cue("d3", "evening", 6),
  stats: S.d4,
  sApproved: cue("d4", "approved", -4),
  sPending: cue("d4", "pending", -4),
  sInactive: cue("d4", "inactive", -4),
  sTrial: cue("d4", "trial", -4),
  sRing: cue("d4", "ring", -8),
  assign: S.d5,
  aAnswers: cue("d5", "answers", -4),
  aAccepted: cue("d5", "accepted", -4),
  aRejected: cue("d5", "rejected", -4),
  aPending: cue("d5", "nine", -4),
  view: cue("d5", "view", -2),
  docs: S.d6,
  dLabs: cue("d6", "labs", -6),
  dStudents: cue("d6", "students", -6),
  dSchool: cue("d6", "school", -6),
  dSlides: cue("d6", "slides", -6),
  learn: S.d7,
  lTotal: cue("d7", "seventy", -4),
  lRefrig: cue("d7", "refrigeration", -4),
  lEpa: cue("d7", "epa", -4),
  mock: S.d8,
  mQ: cue("d8", "fifteen", -4),
  mA: cue("d8", "eightysix", -4),
  mR: cue("d8", "reviewed", -4),
  mN: cue("d8", "twelve", -4),
  res: S.d9,
  rInt: cue("d9", "interview", -6),
  rAud: cue("d9", "audios", -6),
  rTpl: cue("d9", "templates", -6),
  rCert: cue("d9", "certificates", -8),
  sw: S.d10,
  sessOpen2: cue("d10", "switches", -2),
  mornPick: cue("d10", "morning", 6),
  same: cue("d10", "same", -4),
  two: cue("d10", "two", -4),
  three: cue("d10", "three", -4),
  sessOpen3: cue("d11", "picks", -6),
  allPick: cue("d11", "all", 6),
};
const CLICKS = [T.clickMenu, T.clickTab, T.progOpen, T.progPick - 6, T.sessOpen, T.evePick - 6, T.view, T.sessOpen2, T.mornPick - 6, T.sessOpen3, T.allPick - 6];

// ───────── data (one set per program + session the story selects) ─────────
type DS = { stats: number[]; assign: number[]; docs: number[]; mock: number[]; res: number[] };
const D: Record<"epa" | "hw" | "eve" | "morn" | "all", DS> = {
  epa: { stats: [12, 1, 0, 3], assign: [10, 46, 40, 4, 2], docs: [18, 9, 6, 7], mock: [8, 22, 20, 2], res: [16, 8, 4, 31] },
  hw: { stats: [9, 1, 0, 1], assign: [24, 30, 26, 2, 2], docs: [32, 8, 14, 21], mock: [15, 12, 10, 2], res: [40, 26, 9, 112] },
  eve: { stats: [38, 6, 3, 2], assign: [24, 168, 141, 9, 18], docs: [32, 57, 14, 21], mock: [15, 86, 74, 12], res: [40, 26, 9, 112] },
  morn: { stats: [44, 2, 1, 4], assign: [24, 201, 190, 3, 8], docs: [32, 61, 14, 21], mock: [15, 98, 95, 3], res: [40, 26, 9, 112] },
  all: { stats: [97, 9, 4, 9], assign: [24, 412, 371, 13, 28], docs: [32, 131, 14, 21], mock: [15, 208, 191, 17], res: [40, 26, 9, 112] },
};
const dsAt = (f: number): DS => (f < T.progPick ? D.epa : f < T.evePick ? D.hw : f < T.mornPick ? D.eve : f < T.allPick ? D.morn : D.all);
const LOADS = () => [T.progPick, T.evePick, T.mornPick, T.allPick];
const loadingAt = (f: number) => LOADS().some((a) => f >= a && f < a + 16);
const PROGS = ["EPA 608 Certification Prep", "HVAC Technician", "Commercial Refrigeration"];
const SESS = ["All Sessions", "Evening — Fall 2026", "Morning — Fall 2026", "Weekend — Fall 2026"];
const progAt = (f: number) => (f < T.progPick ? PROGS[0] : PROGS[1]);
const sessAt = (f: number) => (f < T.evePick ? SESS[3] : f < T.mornPick ? SESS[1] : f < T.allPick ? SESS[2] : SESS[0]);
const LEARN: Record<string, [string, number, string][]> = {
  [PROGS[0]]: [["Core", 10, "#27AC1F"], ["Type I", 6, "#3DB8AD"], ["Type II", 9, "#EF7817"], ["Type III", 7, "#097EF2"]],
  [PROGS[1]]: [["Electrical Fundamentals", 18, "#27AC1F"], ["Refrigeration Cycle", 24, "#3DB8AD"], ["Heating Systems", 16, "#EF7817"], ["EPA 608 Prep", 12, "#097EF2"]],
};

// ───────── page layout (main-area coords, before scroll) ─────────
const PX = 12, PW = 1326, CW = 651, C2 = PX + CW + 12;
const Y = { prog: 160, stats: 324, assign: 636, docs: 968, learn: 324, mock: 696, res: 1270 };
const H = { stats: 300, assign: 320, docs: 290, learn: 360, mock: 300, res: 220 };
const TABS = [["▦", "Dashboard", 132], ["◔", "My Dashboard", 160], ["♛", "Leader Board", 152], ["↗", "Bootcamp's Dashboard", 222]] as const;
const tabX = (i: number) => 28 + TABS.slice(0, i).reduce((a, t) => a + t[2] + 4, 0);
const SEL_W = 645, SEL_Y = Y.prog + 92, SEL2_X = PX + 12 + SEL_W + 12;

// scroll: eased moves between section targets
const SCROLL: [number, number][] = [[0, 0]];
const scrollAt = (f: number) => {
  const keys: [number, number][] = [[0, 0], [T.stats, 250], [T.assign, 520], [T.docs, 830], [T.learn, 270], [T.mock, 560], [T.res, 736], [T.sw, 0], [T.two - 10, 300], [T.sessOpen3 - 14, 0], [T.allPick + 20, 300]];
  let v = 0;
  for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * pr(f, keys[i][0], 20);
  return v;
};
void SCROLL;

// ───────── building blocks (match the real components) ─────────
const Card: React.FC<{ x: number; y: number; w: number; h: number; on?: boolean; children: React.ReactNode }> = ({ x, y, w, h, on, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: 12, background: "#fff", border: `${on ? 2 : 1}px solid ${on ? BLUE : LINE}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "0 1px 2px #0000000d", padding: 12, overflow: "hidden" }}>{children}</div>
);
const Head: React.FC<{ title: string; sub: string; right?: React.ReactNode; icon?: string }> = ({ title, sub, right, icon }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${LINE}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon && <div style={{ width: 34, height: 34, borderRadius: 10, background: "#CFFAFE", color: "#0E7490", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{icon}</div>}
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#374151" }}>{title} <span style={{ fontSize: 13, color: "#9CA3AF" }}>ⓘ</span></div>
        <div style={{ fontSize: 14, color: GRAY }}>{sub}</div>
      </div>
    </div>
    {right}
  </div>
);
const ViewMore: React.FC<{ press?: boolean }> = ({ press }) => (
  <span style={{ padding: "7px 12px", borderRadius: 8, background: press ? "#1E3A8A" : BLUE, color: "#fff", fontSize: 13, fontWeight: 700, boxShadow: press ? "0 0 0 4px #C7D2FE" : "none", transform: `scale(${press ? 0.95 : 1})`, display: "inline-block" }}>View More ↗</span>
);
const Sk: React.FC<{ w: number | string; h: number; r?: number; mt?: number }> = ({ w, h, r = 6, mt = 0 }) => <div style={{ width: w, height: h, borderRadius: r, marginTop: mt, background: "#E5E7EB" }} />;

/** OverallProgress donut + legend */
const Donut: React.FC<{ f: number; items: [string, number, string][]; hl: number; grow: number }> = ({ items, hl, grow }) => {
  const total = items.reduce((a, i) => a + i[1], 0) || 1;
  const R = 85, r = 55, cx = 110, cy = 110;
  let a0 = -90;
  const segs = items.map(([, v, c], i) => {
    const sweep = (360 * v) / total * grow;
    const a1 = a0 + sweep;
    const p = (a: number, rad: number) => [cx + rad * Math.cos((a * Math.PI) / 180), cy + rad * Math.sin((a * Math.PI) / 180)];
    const large = sweep > 180 ? 1 : 0;
    const [x1, y1] = p(a0, R), [x2, y2] = p(a1, R), [x3, y3] = p(a1, r), [x4, y4] = p(a0, r);
    const mid = (a0 + a1) / 2;
    const [lx, ly] = p(mid, r + (R - r) * 0.6);
    const out = { d: sweep <= 0.01 ? "" : `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 ${large} 0 ${x4},${y4} Z`, c, lx, ly, pct: (100 * v) / total, i };
    a0 = a1;
    return out;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ flex: 1 }}>
        {items.map(([l, v, c], i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 6, background: hl === i ? "#EEF2FF" : "transparent", boxShadow: hl === i ? `inset 3px 0 0 ${BLUE}` : "none" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
            <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#374151" }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: hl === i ? INK : GRAY }}>{v}</div>
          </div>
        ))}
      </div>
      <svg width={220} height={220}>
        {segs.map((s) => <path key={s.i} d={s.d} fill={s.c} opacity={hl < 0 || hl === s.i ? 1 : 0.45} transform={hl === s.i ? `translate(${(s.lx - cx) * 0.08},${(s.ly - cy) * 0.08})` : undefined} />)}
        {grow > 0.98 && segs.map((s) => (s.pct > 5 ? <text key={`t${s.i}`} x={s.lx} y={s.ly} fill="#fff" fontSize={12} fontWeight={700} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>{Math.floor(s.pct)}%</text> : null))}
        <circle cx={cx} cy={cy} r={37} fill="#fff" stroke="#27AC1F33" strokeWidth={8} />
        <text x={cx} y={cy} fill="#27AC1F" fontSize={15} fontWeight={800} textAnchor="middle" dominantBaseline="central" fontFamily={FONT}>100%</text>
      </svg>
    </div>
  );
};
const DonutSk = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ flex: 1 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}><Sk w={14} h={14} r={7} /><Sk w="70%" h={14} /></div>)}</div>
    <div style={{ width: 170, height: 170, borderRadius: 85, background: "#E5E7EB", marginRight: 25 }} />
  </div>
);

// ───────── the page ─────────
const Page: React.FC<{ f: number }> = ({ f }) => {
  const onTab = f >= T.clickTab + 2;
  const ds = dsAt(f);
  const load = onTab && loadingAt(f);
  const sc = onTab ? scrollAt(f) : 0;
  const prog = progAt(f), sess = sessAt(f);
  const grow = (a: number) => pr(f, a, 22);
  const lastLoad = Math.max(T.clickTab + 2, ...LOADS().filter((a) => f >= a + 16).map((a) => a + 16));
  const g = grow(lastLoad);
  const hlStats = f >= T.sTrial + 30 ? -1 : f >= T.sTrial ? 3 : f >= T.sInactive ? 2 : f >= T.sPending ? 1 : f >= T.sApproved ? 0 : -1;
  const hlAssign = f >= T.view ? -1 : f >= T.aPending ? 3 : f >= T.aRejected ? 4 : f >= T.aAccepted ? 2 : f >= T.aAnswers ? 1 : f >= T.assign + 6 ? 0 : -1;
  const hlMock = f >= T.res ? -1 : f >= T.mN ? 3 : f >= T.mR ? 2 : f >= T.mA ? 1 : f >= T.mQ ? 0 : -1;
  const hlDoc = f >= T.learn ? -1 : f >= T.dSlides ? 3 : f >= T.dSchool ? 2 : f >= T.dStudents ? 1 : f >= T.dLabs ? 0 : -1;
  const hlRes = f >= T.sw ? -1 : f >= T.rCert ? 3 : f >= T.rTpl ? 2 : f >= T.rAud ? 1 : f >= T.rInt ? 0 : -1;
  const morningHl = f >= T.two && f < T.sessOpen3 - 10;
  const learn = LEARN[prog];
  const lTot = learn.reduce((a, l) => a + l[1], 0), lMax = Math.max(...learn.map((l) => l[1]));
  const inRange = (a: number, b: number) => f >= a && f < b;
  const progDD = inRange(T.progOpen, T.progPick + 2);
  const sessDD = inRange(T.sessOpen, T.evePick + 2) || inRange(T.sessOpen2, T.mornPick + 2) || inRange(T.sessOpen3, T.allPick + 2);
  const ddPick = inRange(T.sessOpen, T.evePick + 2) ? 1 : inRange(T.sessOpen2, T.mornPick + 2) ? 2 : 0;
  const ddPickAt = inRange(T.sessOpen, T.evePick + 2) ? T.evePick : inRange(T.sessOpen2, T.mornPick + 2) ? T.mornPick : T.allPick;
  const q = progDD ? typed(f, T.progOpen + 8, "HVAC", 0.35) : "";
  const tabSel = f >= T.clickTab ? 3 : 0;

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F5F7FB", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1350, height: 1600, transform: `translateY(${-sc}px)` }}>
        {/* header card + tabs (Dashboard.tsx) */}
        <div style={{ position: "absolute", left: PX, top: 10, width: PW, height: 140, borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 12px 40px rgba(15,23,42,0.08)", border: "1px solid #E2E8F0" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: 84, background: "linear-gradient(135deg,#020617,#1E1B4B 55%,#3730A3)" }}>
            <div style={{ position: "absolute", right: -40, top: -70, width: 220, height: 220, borderRadius: 110, background: "rgba(34,211,238,0.2)", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", left: 20, top: 20, width: 44, height: 44, borderRadius: 16, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>▦</div>
            <div style={{ position: "absolute", left: 80, top: 14, fontSize: 21, fontWeight: 700, color: "#fff" }}>Lone Star HVAC Institute — Austin</div>
            <div style={{ position: "absolute", left: 80, top: 46, fontSize: 14, color: "rgba(224,231,255,0.75)" }}>Operational work, branch activity, and resource health.</div>
            <div style={{ position: "absolute", right: 20, top: 46, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12, fontWeight: 600, color: "#E0E7FF", boxShadow: f >= T.live && f < T.live + 40 ? "0 0 0 4px rgba(165,180,252,0.6)" : "none" }}>✦ Live data</div>
          </div>
          <div style={{ position: "absolute", left: 12, top: 92, width: PW - 24, height: 40, borderRadius: 12, background: "#F1F5F9" }} />
          {TABS.map(([ic, t, w], i) => {
            const pulse = f >= T.tabs + i * 8 && f < T.tabs + i * 8 + 14 && f < T.clickTab;
            const hov = i === 3 && f >= T.tabHover && f < T.clickTab;
            return <div key={t} style={{ position: "absolute", left: tabX(i), top: 96, width: w, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 14, fontWeight: 600, color: tabSel === i ? BLUE : "#6B7280", background: tabSel === i ? "#fff" : hov || pulse ? "rgba(255,255,255,0.8)" : "transparent", boxShadow: tabSel === i ? "0 1px 3px #0002" : pulse ? "0 0 0 2px #A5B4FC" : "none" }}>{ic} {t}</div>;
          })}
        </div>

        {onTab ? (
          <>
            {/* program + session (program-dashboard/index.tsx) */}
            <Card x={PX} y={Y.prog} w={PW} h={150}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>Bootcamp Dashboard</div>
              <div style={{ fontSize: 14, color: GRAY }}>Select a program and session to view the latest statistics.</div>
              {load && <div style={{ position: "absolute", right: 14, top: 14, padding: "6px 12px", borderRadius: 999, background: "#E8ECFB", color: BLUE, fontSize: 13, fontWeight: 600 }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: BLUE, marginRight: 8, opacity: f % 14 < 7 ? 1 : 0.4 }} />Updating dashboard</div>}
              {[["Program", prog, 0, inRange(T.hlProg, T.hlSess) || progDD], ["Session", sess, SEL_W + 12, inRange(T.hlSess, T.cards) || sessDD || morningHl]].map(([l, v, x, on]) => (
                <div key={l as string} style={{ position: "absolute", left: 12 + (x as number), top: 66 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{l as string}</div>
                  <div style={{ marginTop: 6, width: SEL_W, height: 42, boxSizing: "border-box", borderRadius: 8, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 3px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 15, color: INK }}>{v as string}<span style={{ color: GRAY }}>⌄</span></div>
                </div>
              ))}
            </Card>

            {/* column 1 */}
            <Card x={PX} y={Y.stats} w={CW} h={H.stats} on={inRange(T.stats, T.assign)}>
              <Head title="Bootcamp's Statistics" sub="Membership status for the selected bootcamp" />
              {load ? <DonutSk /> : <Donut f={f} hl={hlStats} grow={Math.max(g, grow(T.stats))} items={[["Approved Members", ds.stats[0], "#2A9A13"], ["Pending Members", ds.stats[1], "#EF7817"], ["Inactive Members", ds.stats[2], "#DC3545"], ["Trial Members", ds.stats[3], "#3DB8AD"]]} />}
            </Card>
            <Card x={PX} y={Y.assign} w={CW} h={H.assign} on={inRange(T.assign, T.docs) || (morningHl && f >= T.three)}>
              <Head title="Assignments" sub="Submission and review status" right={<ViewMore press={inRange(T.view, T.view + 14)} />} />
              {load ? <DonutSk /> : <Donut f={f} hl={morningHl && f >= T.three ? 3 : hlAssign} grow={Math.max(g, grow(T.assign))} items={[["Total Assignments", ds.assign[0], "#097EF2"], ["Total Answers", ds.assign[1], "#3DB8AD"], ["Accepted", ds.assign[2], "#27AC1F"], ["Pending", ds.assign[3], "#FF9900"], ["Rejected", ds.assign[4], "#FE5454"]]} />}
            </Card>
            <Card x={PX} y={Y.docs} w={CW} h={H.docs} on={inRange(T.docs, T.learn)}>
              <Head icon="▤" title="Documents" sub="Resources available to this bootcamp" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Documents & Labs", "All Documents", "📄"], ["Users Documents", "Student-shared documents", "👤"], ["Shared Documents", "School-shared documents", "🗂"], ["Presentations / Slides", "Total Slides", "▭"]].map(([t, c, ic], i) => (
                  <div key={t} style={{ height: 92, boxSizing: "border-box", borderRadius: 12, padding: "10px 14px", background: hlDoc === i ? "#EEF2FF" : "#F8FAFC", border: `${hlDoc === i ? 2 : 1}px solid ${hlDoc === i ? BLUE : LINE}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#374151" }}><span style={{ width: 26, height: 26, borderRadius: 8, background: "#E0E7FF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{ic}</span>{t}</div>
                    {load ? <Sk w={60} h={24} mt={8} /> : <div style={{ fontSize: 26, fontWeight: 700, color: INK, marginTop: 4 }}>{ds.docs[i]}</div>}
                    <div style={{ fontSize: 12, color: GRAY }}>{c}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* column 2 */}
            <Card x={C2} y={Y.learn} w={CW} h={H.learn} on={inRange(T.learn, T.mock)}>
              <Head title="Learning Content" sub="Lessons and chapters by category" right={<div style={{ display: "flex", gap: 8, alignItems: "center" }}><ViewMore /><span style={{ width: 150, padding: "6px 10px", boxSizing: "border-box", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, color: INK, whiteSpace: "nowrap", overflow: "hidden" }}>{prog}</span></div>} />
              <div style={{ borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0", padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, color: GRAY }}>LEARNING CONTENT</div><div style={{ fontSize: 32, fontWeight: 700, color: INK, background: inRange(T.lTotal, T.lRefrig) ? "#FEF3C7" : "transparent", borderRadius: 6, padding: "0 4px" }}>{lTot}</div></div>
                  <div style={{ fontSize: 12, color: GRAY }}>Lessons across categories</div>
                </div>
                {learn.map(([n, v, c], i) => {
                  const on = (i === 1 && inRange(T.lRefrig, T.lEpa)) || (i === 3 && inRange(T.lEpa, T.mock));
                  return (
                    <div key={n} style={{ marginTop: 14, padding: on ? "4px 6px" : "0 0", borderRadius: 8, background: on ? "#EEF2FF" : "transparent" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#374151" }}><span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: c, marginRight: 8 }} />{n}</span><span>{v}</span></div>
                      <div style={{ marginTop: 6, height: 8, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}><div style={{ width: `${Math.max(4, (100 * v) / lMax) * Math.max(g, grow(T.learn))}%`, height: "100%", borderRadius: 4, background: c }} /></div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card x={C2} y={Y.mock} w={CW} h={H.mock} on={inRange(T.mock, T.res)}>
              <Head title="Video Mock Interviews" sub="Answers and review status" />
              {load ? <DonutSk /> : <Donut f={f} hl={hlMock} grow={Math.max(g, grow(T.mock))} items={[["Total Questions", ds.mock[0], "#097EF2"], ["Total Answers", ds.mock[1], "#3DB8AD"], ["Reviewed", ds.mock[2], "#27AC1F"], ["Not Reviewed", ds.mock[3], "#FF9900"]]} />}
            </Card>

            {/* program resources (DataCard) */}
            <Card x={PX} y={Y.res} w={PW} h={H.res} on={inRange(T.res, T.sw)}>
              <div style={{ paddingBottom: 8, marginBottom: 10, borderBottom: `1px solid ${LINE}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>Program Resources</div>
                <div style={{ fontSize: 14, color: GRAY }}>Content and resources connected to the selected program.</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[["Interviews", "Interview Questions", "🎤"], ["Audios & Videos", "Shared with students", "▶"], ["Templates", "School-created templates", "▦"], ["Total Generated Certificate", "Certificates issued", "🏅"]].map(([t, c, ic], i) => (
                  <div key={t} style={{ height: 120, boxSizing: "border-box", borderRadius: 16, padding: 10, background: "#fff", boxShadow: hlRes === i ? `0 0 0 2px ${BLUE}, 0 8px 24px rgba(15,23,42,0.08)` : "0 0 0 1px #E2E8F0, 0 8px 24px rgba(15,23,42,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 36, height: 36, borderRadius: 10, background: "#E8ECFB", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{ic}</span><span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{t}</span></div>
                    <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, color: GRAY }}>TOTAL AVAILABLE</div>
                    {load ? <Sk w={50} h={24} mt={4} /> : <div style={{ fontSize: 28, fontWeight: 700, color: INK, lineHeight: 1.1 }}>{ds.res[i]}</div>}
                    <div style={{ fontSize: 12, color: GRAY }}>{c}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* dropdowns (searchable selects) */}
            {progDD && (
              <div style={{ position: "absolute", left: PX + 12, top: SEL_Y + 46, width: SEL_W, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 40px #0003", padding: 6, zIndex: 5, opacity: pr(f, T.progOpen, 6) }}>
                <div style={{ height: 36, borderRadius: 6, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 14, color: q ? INK : "#9CA3AF" }}>⌕&nbsp; {q || "Search..."}</div>
                {PROGS.filter((p) => !q || p.toLowerCase().includes(q.toLowerCase())).map((p) => <div key={p} style={{ height: 38, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 6, fontSize: 15, color: INK, background: p === PROGS[1] && f >= T.progPick - 10 ? "#EEF2FF" : "transparent" }}>{p}{p === prog && <span style={{ marginLeft: "auto" }}>✓</span>}</div>)}
              </div>
            )}
            {sessDD && (
              <div style={{ position: "absolute", left: SEL2_X, top: SEL_Y + 46, width: SEL_W, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 40px #0003", padding: 6, zIndex: 5 }}>
                <div style={{ height: 36, borderRadius: 6, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 14, color: "#9CA3AF" }}>⌕&nbsp; Search...</div>
                {SESS.map((s, i) => <div key={s} style={{ height: 38, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 6, fontSize: 15, color: INK, background: i === ddPick && f >= ddPickAt - 10 ? "#EEF2FF" : "transparent" }}>{s}{s === sess && <span style={{ marginLeft: "auto" }}>✓</span>}</div>)}
              </div>
            )}
          </>
        ) : (
          /* Dashboard tab (schools dashboard) — kept soft, the story moves on to Bootcamp's Dashboard */
          <div style={{ opacity: 0.55 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: PX + i * 446, top: 160, width: 434, height: 180, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }} />)}
            {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: PX + i * 669, top: 352, width: 657, height: 330, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }} />)}
          </div>
        )}
      </div>
    </div>
  );
};

// ───────── camera + cursor (world coords) ─────────
const W = (x: number, y: number, f: number) => MA(x, y - (f >= T.clickTab + 2 ? scrollAt(f) : 0));
const cardC = (x: number, y: number, w: number, h: number, f: number): [number, number] => W(x + w / 2, y + h / 2, f);
const calm = (k: K4): K4 => [k[0], Math.max(760, Math.min(1160, k[1])), Math.max(430, Math.min(650, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.clickMenu, 900, 470, 1.05], [T.tabs, 1000, 400, 1.1], [T.clickTab, 1160, 400, 1.08],
  [T.hlProg, 960, 470, 1.08], [T.progOpen, 820, 520, 1.1], [T.sessOpen, 1100, 520, 1.1], [T.evePick + 10, 960, 540, 1.02],
  [T.stats + 6, ...cardC(PX, Y.stats, CW, H.stats, T.stats + 30), 1.12],
  [T.assign + 6, ...cardC(PX, Y.assign, CW, H.assign, T.assign + 30), 1.12],
  [T.docs + 6, ...cardC(PX, Y.docs, CW, H.docs, T.docs + 30), 1.12],
  [T.learn + 6, ...cardC(C2, Y.learn, CW, H.learn, T.learn + 30), 1.1],
  [T.mock + 6, ...cardC(C2, Y.mock, CW, H.mock, T.mock + 30), 1.12],
  [T.res + 6, ...cardC(PX, Y.res, PW, H.res, T.res + 30), 1.04],
  [T.sw + 10, 1100, 480, 1.08], [T.two, 820, 560, 1.06], [T.sessOpen3 - 8, 1100, 480, 1.08], [T.allPick + 24, 960, 540, 1.0],
  [PAY_START, 960, 540, 1.0],
]).map(calm);
const CUR: P3[] = monoP([
  [DEMO_START, 1500, 860],
  [T.clickMenu, ...realMenuPt("Dashboard")],
  [T.tabs, ...MA(tabX(0) + 66, 112)], [T.tabHover, ...MA(tabX(3) + 111, 112)], [T.clickTab, ...MA(tabX(3) + 111, 112)],
  [T.hlProg, ...MA(PX + 12 + 300, SEL_Y + 21)], [T.progOpen, ...MA(PX + 12 + 300, SEL_Y + 21)], [T.progPick - 6, ...MA(PX + 12 + 120, SEL_Y + 46 + 6 + 36 + 19)],
  [T.sessOpen, ...MA(SEL2_X + 300, SEL_Y + 21)], [T.evePick - 6, ...MA(SEL2_X + 120, SEL_Y + 46 + 6 + 36 + 38 + 19)],
  [T.stats + 20, ...W(PX + 500, Y.stats + 200, T.stats + 30)],
  [T.view - 10, ...W(PX + CW - 60, Y.assign + 30, T.view)], [T.view, ...W(PX + CW - 60, Y.assign + 30, T.view)],
  [T.docs + 20, ...W(PX + 330, Y.docs + 160, T.docs + 30)],
  [T.learn + 20, ...W(C2 + 330, Y.learn + 220, T.learn + 30)],
  [T.mock + 20, ...W(C2 + 520, Y.mock + 180, T.mock + 30)],
  [T.res + 20, ...W(PX + 900, Y.res + 140, T.res + 30)],
  [T.sessOpen2, ...MA(SEL2_X + 300, SEL_Y + 21)], [T.mornPick - 6, ...MA(SEL2_X + 120, SEL_Y + 46 + 6 + 36 + 76 + 19)],
  [T.two + 10, ...W(PX + 500, Y.stats + 150, T.two + 30)],
  [T.sessOpen3, ...MA(SEL2_X + 300, SEL_Y + 21)], [T.allPick - 6, ...MA(SEL2_X + 120, SEL_Y + 46 + 6 + 36 + 19)],
  [T.allPick + 30, 1560, 900],
]);
const STEPS = [
  { at: T.clickMenu, to: T.clickTab, label: "Open the dashboard" },
  { at: T.clickTab, to: T.stats, label: "Pick a program and session" },
  { at: T.stats, to: T.assign, label: "Bootcamp's statistics" },
  { at: T.assign, to: T.docs, label: "Assignments" },
  { at: T.docs, to: T.learn, label: "Documents" },
  { at: T.learn, to: T.mock, label: "Learning content" },
  { at: T.mock, to: T.res, label: "Video mock interviews" },
  { at: T.res, to: T.sw, label: "Program resources" },
  { at: T.sw, to: PAY_START, label: "Compare sessions" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
    <Backdrop f={f} w={1920} h={1080} />
    <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
      <LandWin f={f} inAt={DEMO_START} branch="Lone Star HVAC — Austin" url={f >= T.clickTab + 2 ? "academy.skillbnk.com/dashboard?tab=program-dashboard" : "academy.skillbnk.com/dashboard?tab=schools-dashboard"} active="Dashboard" main={<Page f={f} />} />
      <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
    </CameraWorld>
    <StepChipL f={f} steps={STEPS} />
    <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Training provider portal" />
  </AbsoluteFill>
);

// ───────── hook (story: five places, numbers that don't match) ─────────
const HK = { monday: cue("h0", "monday"), runs: cue("h0", "runs"), evening: cue("h0", "evening"), enroll: cue("h0", "enrollment"), inbox: cue("h0", "inbox"), drive: cue("h0", "drive"), rec: cue("h0", "recordings"), folder: cue("h0", "folder"), lunch: cue("h0", "lunch"), match: cue("h0", "match") };
const SRC: { at: keyof typeof HK; t: string; ic: string; line: string; c: string; from: [number, number] }[] = [
  { at: "enroll", t: "Enrollment sheet", ic: "▦", line: "Evening: 49 enrolled", c: "#16A34A", from: [-500, 200] },
  { at: "inbox", t: "Assignment inbox", ic: "✉", line: "41 students submitting", c: "#2563EB", from: [2400, 160] },
  { at: "drive", t: "Shared drive", ic: "🗂", line: "Fall docs · 14 files", c: "#F59E0B", from: [-500, 900] },
  { at: "rec", t: "Interview recordings", ic: "▶", line: "86 videos · ? reviewed", c: "#DC2626", from: [2400, 900] },
  { at: "folder", t: "Certificate folder", ic: "🏅", line: "cert_final_v3.pdf", c: "#7C3AED", from: [960, 1400] },
];
const SLOT = (i: number): [number, number] => (i < 3 ? [500 + i * 330, 330] : [665 + (i - 3) * 330, 520]);
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.lunch - 10, HK.match + 30);
  const t = lin(f, HK.evening, HK.lunch + 6); // 9:00 → 12:10
  const mins = 9 * 60 + Math.round(190 * t);
  const hh = Math.floor(mins / 60), mm = mins % 60;
  const hA = ((hh % 12) + mm / 60) * 30, mA = mm * 6;
  const clk = (a: number, len: number, w: number, c: string) => <line x1={110} y1={110} x2={110 + len * Math.sin((a * Math.PI) / 180)} y2={110 - len * Math.cos((a * Math.PI) / 180)} stroke={c} strokeWidth={w} strokeLinecap="round" />;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 70, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#FBBF24" }}>LONE STAR HVAC INSTITUTE</div>
          <div style={{ marginTop: 6, fontSize: 56, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.monday, "Monday. 3 programs. 1 question.", 0.7)}</div>
        </div>
        {/* the clock */}
        <div style={{ position: "absolute", left: 1560, top: 60, opacity: pr(f, HK.monday + 4, 10) }}>
          <svg width={220} height={220}>
            <circle cx={110} cy={110} r={100} fill="#0F172A" stroke={warm > 0.5 ? "#F87171" : "#64748B"} strokeWidth={6} />
            {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={110 + 84 * Math.sin((i * 30 * Math.PI) / 180)} y1={110 - 84 * Math.cos((i * 30 * Math.PI) / 180)} x2={110 + 94 * Math.sin((i * 30 * Math.PI) / 180)} y2={110 - 94 * Math.cos((i * 30 * Math.PI) / 180)} stroke="#94A3B8" strokeWidth={4} />)}
            {clk(hA, 52, 9, "#F8FAFC")}{clk(mA, 78, 5, "#FBBF24")}<circle cx={110} cy={110} r={8} fill="#FBBF24" />
          </svg>
          <div style={{ textAlign: "center", fontSize: 30, fontWeight: 900, color: warm > 0.5 ? "#FCA5A5" : "#E2E8F0" }}>{`${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "p.m." : "a.m."}`}</div>
        </div>
        {/* the report frame with five empty slots */}
        <div style={{ position: "absolute", left: 470, top: 250, width: 1010, height: 470, borderRadius: 24, border: "4px dashed #475569", opacity: pr(f, HK.evening - 6, 12) }}>
          <div style={{ position: "absolute", left: 24, top: -22, padding: "4px 14px", background: "#0B1220", fontSize: 26, fontWeight: 900, color: "#E2E8F0" }}>How is the <span style={{ color: "#FBBF24" }}>evening cohort</span> doing?</div>
        </div>
        {SRC.map((s, i) => {
          const a = HK[s.at];
          const k = pr(f, a - 4, 16);
          const [sx, sy] = SLOT(i);
          const x = s.from[0] + (sx - s.from[0]) * k, y = s.from[1] + (sy - s.from[1]) * k;
          const bad = f >= HK.match && (i === 0 || i === 1);
          return f >= a - 6 ? (
            <div key={s.t} style={{ position: "absolute", left: x, top: y, width: 300, height: 160, boxSizing: "border-box", borderRadius: 16, background: "#F8FAFC", border: `4px solid ${bad ? "#EF4444" : s.c}`, padding: 16, transform: `rotate(${(1 - k) * (i % 2 ? 14 : -14) + (i % 2 ? 1.5 : -1.5)}deg)`, boxShadow: "0 18px 40px #0008" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 900, color: INK }}><span style={{ width: 40, height: 40, borderRadius: 10, background: s.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.ic}</span>{s.t}</div>
              <div style={{ marginTop: 18, fontSize: 22, fontWeight: 800, color: bad ? "#DC2626" : "#334155" }}>{s.line}</div>
            </div>
          ) : null;
        })}
        {f >= HK.match && (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M ${SLOT(0)[0] + 260} ${SLOT(0)[1] + 120} Q ${(SLOT(0)[0] + SLOT(1)[0]) / 2 + 150} ${SLOT(0)[1] + 230} ${SLOT(1)[0] + 40} ${SLOT(1)[1] + 120}`} fill="none" stroke="#EF4444" strokeWidth={6} strokeDasharray={600} strokeDashoffset={600 * (1 - lin(f, HK.match, HK.match + 14))} />
            <text x={(SLOT(0)[0] + SLOT(1)[0]) / 2 + 150} y={SLOT(0)[1] + 230} fill="#EF4444" fontSize={64} fontWeight={900} textAnchor="middle" fontFamily={FONT} opacity={pr(f, HK.match + 8, 8)}>≠</text>
          </svg>
        )}
      </Stage>
      <Stamp f={f} at={HK.match + 6} x={960} y={800} text="NUMBERS DON'T MATCH" size={54} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.monday, "Monday. One question.", "One question"], [HK.evening, "How is the evening cohort doing?", "evening cohort"], [HK.enroll, "Five places to look.", "Five places"], [HK.lunch, "By lunch, the numbers still don't match.", "don't match"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff: five sources fold into one screen ─────────
const PY = { five: cue("p12", "five"), one: cue("p12", "one"), monday: cue("p12", "mondays"), fifteen: cue("p12", "fifteen") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const k = pr(f, PY.one - 4, 18);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(99,102,241,0.25), transparent 62%)" }} />
      {SRC.map((s, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = 960 + Math.cos(a) * 520 * (1 - k) - 130, y = 470 + Math.sin(a) * 300 * (1 - k) - 34;
        return <div key={s.t} style={{ position: "absolute", left: x, top: y, width: 260, height: 68, borderRadius: 14, background: "#F8FAFC", border: `4px solid ${s.c}`, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", boxSizing: "border-box", fontSize: 19, fontWeight: 900, color: INK, opacity: (1 - k) * pr(f, PAY_START + 2 + i * 3, 8), transform: `scale(${1 - 0.5 * k})` }}><span style={{ color: s.c }}>{s.ic}</span>{s.t}</div>;
      })}
      <div style={{ position: "absolute", left: 960 - 330, top: 270, width: 660, height: 380, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #0009", opacity: k, transform: `scale(${0.7 + 0.3 * k})`, overflow: "hidden" }}>
        <div style={{ height: 70, background: "linear-gradient(135deg,#020617,#1E1B4B 55%,#3730A3)", color: "#fff", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 22px" }}>Bootcamp's Dashboard · HVAC Technician</div>
        <div style={{ display: "flex", gap: 14, padding: 18 }}>
          {[["Approved", "38", "#2A9A13"], ["Pending review", "9", "#FF9900"], ["Not reviewed", "12", "#FF9900"], ["Certificates", "112", "#2563EB"]].map(([l, v, c]) => <div key={l} style={{ flex: 1, borderRadius: 14, background: "#F8FAFC", border: `1px solid ${LINE}`, padding: 12 }}><div style={{ fontSize: 14, fontWeight: 700, color: GRAY }}>{l}</div><div style={{ fontSize: 40, fontWeight: 900, color: c }}>{v}</div></div>)}
        </div>
        <div style={{ margin: "0 18px", height: 120, borderRadius: 14, background: "#F1F5F9", display: "flex", alignItems: "flex-end", gap: 14, padding: 16, boxSizing: "border-box" }}>{[18, 24, 16, 12].map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / 24) * 100}%`, borderRadius: 8, background: ["#27AC1F", "#3DB8AD", "#EF7817", "#097EF2"][i] }} />)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 720, width: 1920, textAlign: "center", fontSize: 54, fontWeight: 900, color: "#F8FAFC", opacity: pr(f, PY.five - 4, 10) }}>5 places <span style={{ color: "#64748B" }}>→</span> <span style={{ color: "#FBBF24", opacity: pr(f, PY.one - 2, 10) }}>1 screen</span></div>
      <div style={{ position: "absolute", left: 0, top: 810, width: 1920, textAlign: "center", fontSize: 36, fontWeight: 800, color: "#A5B4FC", opacity: pr(f, PY.monday - 4, 12) }}>Monday's answer before 9:15 a.m.</div>
    </AbsoluteFill>
  );
};

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  SRC.forEach((s) => add(HK[s.at] - 2, "swish", 0.35));
  add(HK.match, "riser", 0.25); add(HK.match + 8, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  LOADS().forEach((l) => add(l + 16, "pop", 0.3));
  [T.stats, T.assign, T.docs, T.learn, T.mock, T.res].forEach((t) => add(t, "whoosh_s", 0.25));
  add(PAY_START - 3, "whoosh", 0.4); add(PY.one, "chime", 0.5);
  return a;
})();

export const ProgramDashboardStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="progdashstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.clickTab]} />;
};
