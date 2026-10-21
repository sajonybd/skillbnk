import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE, GREEN } from "./storyLand";
import { makeTL, StoryMain, HookTag, menuPt, PageHead, Fx } from "./storyShell";

/**
 * ProgressStoryVideo — premium landscape (sheet serial 32). Story: Marcus Bell, program manager at Brightpath Academy (fictional).
 * Verified in code: SB-Branch dashboard/leaderboard/LeaderBoardPage ("Program leaderboard", "Compare learner progress for a selected
 * program and session.", Select program / Select session, "View results", "Recalculate all", columns Rank / Learner / Completion /
 * Points / Performance / Action, badges Outstanding (≥80%) / Good (≥60%) / Needs attention), LearnerProgressDialog ("View progress",
 * "<name>'s progress", "Live scores and learning activity from the learner progress API."), shared LearnerProgressView
 * ("Learning progress", Rank #, points, overall ring, "Activity breakdown", Completed / Remaining); progress page subtitle
 * "The same live progress view available in the learner panel". Activity titles come from data (illustrative).
 * Voice: python3 generate-voice-story.py src/ProgressStoryVideo.tsx public/progressstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "p5"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 260,
  d1: 210,
  d2: 216,
  d3: 198,
  d4: 194,
  p5: 187,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "p5"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 31, 49, 68, 76, 82, 90, 91, 97, 106, 114, 120, 125, 152, 161, 192, 195, 204, 220, 232, 235],
  d1: [2, 18, 38, 43, 54, 72, 90, 95, 106, 117, 120, 142, 148, 154, 170],
  d2: [2, 17, 28, 36, 51, 64, 69, 75, 94, 118, 142, 166, 174, 183, 186],
  d3: [2, 9, 19, 35, 50, 58, 93, 115, 126, 129, 156, 163],
  d4: [2, 13, 22, 28, 35, 42, 75, 81, 93, 97, 110, 121, 134, 142, 148, 161, 168],
  p5: [2, 25, 57, 66, 77, 112, 119, 130, 140, 151],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Friday, four PM. Marcus has to tell his director who is on track. Twenty-four learners, five different tools, and a guess.",
  d1: "This time, he opens Leaderboard, picks the program and the session, and clicks View results.",
  d2: "Every learner gets a rank, a completion bar, and points. Outstanding, good, or needs attention.",
  d3: "He clicks View progress on Jordan. Lessons, tests, mock interviews, all live.",
  d4: "Now let's see the learner side. Jordan sees the exact same progress in his own learner portal.",
  p5: "Twenty-four learners. One honest answer. Marcus walks in with facts.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START, DEMO_START, PAY_START, SCENES_END } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, SEG_START, WT);

const MENU = ["Dashboard", "Leaderboard", "Approved Member", "Assignments", "Groups", "Settings"];
const ICONS = ["▦", "🏆", "✅", "📝", "👥", "⚙"];
type L = { n: string; c: number; p: number };
const LB: L[] = [
  { n: "Priya Nair", c: 94, p: 562 }, { n: "Hana Sato", c: 88, p: 530 }, { n: "Diego Alvarez", c: 81, p: 497 },
  { n: "Grace Kim", c: 73, p: 455 }, { n: "Jordan Lee", c: 64, p: 412 }, { n: "Ethan Brooks", c: 47, p: 301 }, { n: "Sam Okafor", c: 32, p: 214 },
];

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "leaderboard", -6),
  clickProg: cue("d1", "program", -4),
  clickSess: cue("d1", "session", -4),
  clickView: cue("d1", "view", 0),
  rows: cue("d1", "results", 6),
  rank: cue("d2", "rank"),
  bar: cue("d2", "completion"),
  points: cue("d2", "points"),
  badges: cue("d2", "outstanding", -4),
  needs: cue("d2", "attention"),
  clickVP: cue("d3", "view", 0),
  cards: cue("d3", "lessons", -4),
  learner: cue("d4", "learner", -8),
  same: cue("d4", "same"),
};
const CLICKS = [T.clickMenu, T.clickProg, T.clickSess, T.clickView, T.clickVP];

const LX = 32, LY = 214, RH = 72;
const COLX = [0, 90, 420, 760, 900, 1110];
const rowC = (i: number) => LY + 54 + i * RH + RH / 2;
const PROG = MA(32 + 230, 136);
const SESS = MA(510 + 200, 136);
const VIEW = MA(950 + 80, 136);
const VP = MA(LX + COLX[5] + 90, rowC(4));

const PerfBadge: React.FC<{ c: number }> = ({ c }) =>
  c >= 80 ? <Badge t="✦ Outstanding" c="#047857" bg="#ECFDF5" fs={15} /> : c >= 60 ? <Badge t="✪ Good" c="#C2410C" bg="#FFF7ED" fs={15} /> : <Badge t="⚠ Needs attention" c="#BE123C" bg="#FFF1F2" fs={15} />;

const Board: React.FC<{ f: number }> = ({ f }) => {
  const sel = (x: number, w: number, at: number, v: string, ph: string) => (
    <div style={{ position: "absolute", left: x, top: 112, width: w, height: 48, borderRadius: 12, border: `2px solid ${f >= at - 4 && f < at + 20 ? BLUE : LINE}`, background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", fontSize: 18, fontWeight: 700, color: f >= at + 6 ? INK : "#9CA3AF" }}>{f >= at + 6 ? v : ph}<span style={{ color: GRAY }}>⌄</span></div>
  );
  const shown = f >= T.rows;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <PageHead title="Program leaderboard" sub="Compare learner progress for a selected program and session." />
      {sel(32, 460, T.clickProg, "Medical Assistant — Fall 2026", "Select program")}
      {sel(510, 400, T.clickSess, "Evening cohort", "Select session")}
      <Btn x={930} y={112} w={170} label="⌕  View results" primary fs={17} press={f >= T.clickView && f < T.clickView + 6 ? 1 : 0} glow={f >= T.clickView - 12 && f < T.clickView ? lin(f, T.clickView - 12, T.clickView) : 0} />
      <Btn x={1120} y={112} w={200} label="↻  Recalculate all" fs={17} />
      <div style={{ position: "absolute", left: LX, top: LY, width: 1290, height: 54 + LB.length * RH + 4, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, overflow: "hidden", boxShadow: "0 6px 24px #0000000d" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1290, height: 54, background: "#F3F4F6" }}>
          {["Rank", "Learner", "Completion", "Points", "Performance", "Action"].map((h, i) => <div key={h} style={{ position: "absolute", left: COLX[i] + 18, top: 0, height: 54, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 800, color: "#4B5563" }}>{h}</div>)}
        </div>
        {shown && LB.map((l, i) => {
          const s = pr(f, T.rows + i * 4, 10);
          const w = 240 * (l.c / 100) * lin(f, T.bar - 6 + i * 2, T.bar + 18 + i * 2);
          const hl = l.n === "Jordan Lee" && f >= T.clickVP - 14;
          return (
            <div key={l.n} style={{ position: "absolute", left: 0, top: 54 + i * RH, width: 1290, height: RH, borderTop: `1px solid ${LINE}`, opacity: s, background: hl ? "#EEF2FF" : "#fff", transform: `translateY(${(1 - s) * 16}px)` }}>
              <div style={{ position: "absolute", left: COLX[0] + 18, top: 0, height: RH, display: "flex", alignItems: "center" }}>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: i < 3 ? ["#FDE68A", "#E5E7EB", "#FED7AA"][i] : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: INK, transform: `scale(${f >= T.rank ? 1 + 0.15 * (1 - lin(f, T.rank + i * 3, T.rank + 10 + i * 3)) : 1})` }}>{i + 1}</span>
              </div>
              <div style={{ position: "absolute", left: COLX[1] + 18, top: 0, height: RH, display: "flex", alignItems: "center", gap: 12 }}><Avatar t={l.n.split(" ").map((x) => x[0]).join("")} s={38} /><b style={{ fontSize: 18, color: INK }}>{l.n}</b></div>
              <div style={{ position: "absolute", left: COLX[2] + 18, top: 0, height: RH, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 240, height: 10, borderRadius: 5, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: w, height: 10, background: BLUE }} /></div>
                <span style={{ fontSize: 17, fontWeight: 800, color: INK, width: 50 }}>{Math.round(l.c * lin(f, T.bar - 6, T.bar + 18))}%</span>
              </div>
              <div style={{ position: "absolute", left: COLX[3] + 18, top: 0, height: RH, display: "flex", alignItems: "center", fontSize: 18, fontWeight: 800, color: INK }}>{countUp(f, T.points - 4, l.p, 20)}</div>
              <div style={{ position: "absolute", left: COLX[4] + 18, top: 0, height: RH, display: "flex", alignItems: "center", opacity: pr(f, T.badges + i * 3, 8) }}><PerfBadge c={l.c} /></div>
              <div style={{ position: "absolute", left: COLX[5] + 18, top: 16, width: 150, height: 40, borderRadius: 10, background: BLUE, color: "#fff", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${hl && f >= T.clickVP && f < T.clickVP + 6 ? 0.92 : 1})` }}>View progress ↗</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// shared LearnerProgressView recreation
const FEAT: [string, number, number, string][] = [["Lessons completed", 18, 24, "📖"], ["Technical test answers", 6, 8, "🎯"], ["Mock interviews", 3, 5, "🏆"], ["Reviews", 4, 6, "✔"]];
const ProgressView: React.FC<{ f: number; at: number; x: number; y: number; w: number }> = ({ f, at, x, y, w }) => {
  const ring = 64 * lin(f, at + 6, at + 30);
  const cw = (w - 3 * 16) / 4;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: FONT }}>
      <div style={{ height: 150, borderRadius: 18, border: `2px solid ${LINE}`, background: "linear-gradient(90deg,#EEF2FF,#fff 60%)", position: "relative" }}>
        <div style={{ position: "absolute", left: 24, top: 34 }}><Avatar t="JL" s={76} /></div>
        <div style={{ position: "absolute", left: 120, top: 26 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: BLUE, letterSpacing: 2 }}>LEARNING PROGRESS</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>Jordan Lee</div>
          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            {["🏅 Rank #5", `🎯 ${countUp(f, at + 6, 412, 22)} / 600 points`, "🕒 Updated Oct 16, 2026, 3:58 PM"].map((t) => <span key={t} style={{ padding: "5px 12px", borderRadius: 999, border: `1.5px solid ${LINE}`, background: "#fff", fontSize: 15, fontWeight: 700, color: INK }}>{t}</span>)}
          </div>
        </div>
        <div style={{ position: "absolute", right: 30, top: 20, width: 110, height: 110, borderRadius: "50%", background: `conic-gradient(${BLUE} ${ring * 3.6}deg, #E5E7EB 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 86, height: 86, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: INK }}>{Math.round(ring)}%</div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
        {FEAT.map(([t, c, l, g], i) => {
          const s = sp(f, at + 14 + i * 6, 30, { damping: 13 });
          const pc = c / l;
          return (
            <div key={t} style={{ width: cw, height: 170, borderRadius: 16, border: `2px solid ${LINE}`, background: "#fff", padding: 18, boxSizing: "border-box", opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 30}px)` }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: GRAY }}>{g}&nbsp; {t}</div>
              <div style={{ marginTop: 12, fontSize: 38, fontWeight: 900, color: INK }}>{countUp(f, at + 18 + i * 6, c, 18)}<span style={{ fontSize: 22, color: GRAY }}> / {l}</span></div>
              <div style={{ marginTop: 14, height: 9, borderRadius: 5, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${pc * 100 * lin(f, at + 20 + i * 6, at + 40 + i * 6)}%`, height: 9, background: pc >= 0.75 ? GREEN : BLUE }} /></div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, height: 150, borderRadius: 16, border: `2px solid ${LINE}`, background: "#fff", padding: "16px 22px", boxSizing: "border-box", opacity: pr(f, at + 36, 12) }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Activity breakdown</div><div style={{ fontSize: 15, fontWeight: 600, color: GRAY }}>Progress across learning, reviews, content, and participation.</div></div><Badge t="6 areas" c={GRAY} bg="#F3F4F6" fs={14} /></div>
        <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
          {[["Lessons", "Completed 18", "Remaining 6"], ["Technical test", "Submitted 8", "Passed 6"], ["Mock interviews", "Completed 3", "Remaining 2"]].map(([a, b, c]) => <div key={a} style={{ flex: 1, padding: "8px 14px", borderRadius: 12, background: "#F9FAFB", fontSize: 15, fontWeight: 700, color: INK }}>{a} · <span style={{ color: GREEN }}>{b}</span> · <span style={{ color: GRAY }}>{c}</span></div>)}
        </div>
      </div>
    </div>
  );
};

const Dialog: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickVP + 4;
  if (f < a - 1 || f >= T.learner) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 15, stiffness: 170 }));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * inn})` }} />
      <div style={{ position: "absolute", left: 60, top: 26 + (1 - inn) * 40, width: 1480, height: 790, borderRadius: 22, background: "#F8FAFC", opacity: inn, boxShadow: "0 40px 120px #000A", overflow: "hidden", fontFamily: FONT }}>
        <div style={{ height: 96, background: "#fff", borderBottom: `2px solid ${LINE}`, padding: "18px 30px", boxSizing: "border-box" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>Jordan Lee's progress</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: GRAY }}>Live scores and learning activity from the learner progress API.</div>
        </div>
        <ProgressView f={f} at={a} x={30} y={120} w={1420} />
      </div>
    </>
  );
};

const LearnerSide: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: "#F8FAFC", fontFamily: FONT }}>
    <ProgressView f={f} at={T.learner + 4} x={60} y={40} w={1480} />
  </div>
);

const camClamp = (k: K4): K4 => [k[0], Math.max(760, Math.min(1080, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.22, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.clickMenu - 16, 600, 380, 1.25],
  [T.clickProg - 10, 860, 320, 1.25],
  [T.clickView + 4, 1150, 320, 1.25],
  [T.rows + 6, 960, 560, 1.05],
  [T.rank, 820, 560, 1.15],
  [T.points + 6, 1150, 560, 1.15],
  [T.badges, 1400, 560, 1.2],
  [T.needs + 20, 1400, 760, 1.3],
  [T.clickVP - 12, 1600, 720, 1.25],
  [T.clickVP + 14, 960, 540, 1.02],
  [T.cards, 960, 640, 1.12],
  [T.learner - 2, 960, 600, 1.05],
  [T.learner + 6, 960, 540, 1.0],
  [T.same, 960, 470, 1.12],
  [PAY_START, 960, 540, 1.05],
]).map(camClamp);

const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...menuPt(1)],
  [T.clickProg, PROG[0], PROG[1]],
  [T.clickSess, SESS[0], SESS[1]],
  [T.clickView, VIEW[0], VIEW[1]],
  [T.rank + 10, MA(LX + 40, rowC(0))[0], MA(LX + 40, rowC(0))[1] + 30],
  [T.badges, MA(LX + 1000, rowC(2))[0], MA(LX + 1000, rowC(2))[1]],
  [T.clickVP, VP[0], VP[1]],
  [T.cards + 30, 1300, 900],
]);
const STEPS = [
  { at: T.clickMenu, to: SEG_START.d2, label: "PICK PROGRAM & SESSION" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "RANK · COMPLETION · POINTS" },
  { at: SEG_START.d3, to: T.learner, label: "VIEW PROGRESS" },
  { at: T.learner, to: PAY_START, label: "LEARNER SEES IT TOO" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = f >= T.learner;
  const [nx, ny] = MA(LX + COLX[4] + 100, rowC(5));
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={T.learner} url="learner.brightpath.example.com/progress" sidebar={false} main={<LearnerSide f={f} />} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url="academy.skillbnk.com/branch-leaderboard" active={f >= T.clickMenu ? "Leaderboard" : "Dashboard"} menu={MENU} menuIcons={ICONS} main={<Board f={f} />} overlay={<Dialog f={f} />} />
        )}
        <Scribble f={f} at={T.needs} d={16} out={T.clickVP - 6} kind="ring" x={nx} y={ny + RH / 2} w={260} h={150} seed={5} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.same} d={16} out={PAY_START - 4} kind="under" x={960} y={CT(0, 40 + 150 + 16)[1] - 6} w={600} seed={3} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { director: cue("h0", "director"), track: cue("h0", "track"), learners: cue("h0", "learners"), tools: cue("h0", "tools"), guess: cue("h0", "guess") };
const TOOLS = [["▦", "attendance.xlsx", "#166534"], ["✉", "Quiz emails", "#1D4ED8"], ["📹", "Zoom recordings", "#2563EB"], ["📝", "Notes app", "#B45309"], ["💬", "Group chat", "#7C3AED"]];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.learners - 6, HK.guess + 10);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * lin(f, 0, DURATIONS.h0)})` }}>
        <HookTag f={f} text="📊 FRIDAY · 4:00 PM" />
        <div style={{ position: "absolute", left: 0, top: 170, width: 1920, textAlign: "center", color: "#fff", opacity: pr(f, HK.director - 6, 14) }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#CBD5E1" }}>Director asks:</div>
          <div style={{ fontSize: 76, fontWeight: 900 }}>“Who is on track?”</div>
        </div>
        {TOOLS.map(([g, t, c], i) => {
          const s = sp(f, HK.tools - 16 + i * 6, 30, { damping: 11 });
          const rot = [-6, 4, -3, 5, -4][i];
          return (
            <div key={t} style={{ position: "absolute", left: 170 + i * 330, top: 470 + (i % 2) * 70, width: 290, height: 200, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #000C", opacity: Math.min(1, s * 2), transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * Math.min(1, s)})`, padding: 24, boxSizing: "border-box" }}>
              <div style={{ fontSize: 52 }}>{g}</div>
              <div style={{ marginTop: 10, fontSize: 24, fontWeight: 900, color: c }}>{t}</div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: "#DC2626" }}>?? / 24</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, top: 860, width: 1920, textAlign: "center", fontSize: 64, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.guess - 4, 10), transform: `scale(${1 + 0.4 * (1 - pr(f, HK.guess - 4, 10))})` }}>…and a guess.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { tw: cue("p5", "twentyfour"), one: cue("p5", "one"), facts: cue("p5", "facts") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const seg: [string, number, string][] = [["Outstanding", 9, "#86EFAC"], ["Good", 10, "#FCD34D"], ["Needs attention", 5, "#FCA5A5"]];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 8) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * lin(f, PAY_START, SCENES_END)})` }}>
        <div style={{ position: "absolute", left: 0, top: 200, width: 1920, textAlign: "center", color: "#fff", fontSize: 150, fontWeight: 900, opacity: pr(f, PY.tw - 4, 10) }}>{countUp(f, PY.tw - 4, 24, 20)} <span style={{ fontSize: 50, color: "#CBD5E1" }}>learners</span></div>
        {seg.map(([t, n, c], i) => {
          const s = sp(f, PY.one + i * 7, 30, { damping: 12 });
          return (
            <div key={t} style={{ position: "absolute", left: 300 + i * 450, top: 520, width: 420, height: 230, borderRadius: 26, background: "rgba(4,7,22,0.82)", border: `3px solid ${c}88`, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 50}px)`, textAlign: "center", color: "#fff" }}>
              <div style={{ marginTop: 30, fontSize: 100, fontWeight: 900, color: c, lineHeight: 1 }}>{n}</div>
              <div style={{ marginTop: 18, fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>{t.toUpperCase()}</div>
            </div>
          );
        })}
        <Confetti f={f} at={PY.facts} cx={960} cy={480} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(HK.director - 6, "swish", 0.4);
  for (let i = 0; i < 5; i++) add(HK.tools - 16 + i * 6, "pop", 0.3);
  add(HK.learners, "riser", 0.3); add(HK.guess, "thud", 0.55);
  add(DURATIONS.h0 - 6, "whoosh", 0.5); add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  add(T.clickProg + 6, "ding", 0.35); add(T.clickSess + 6, "ding", 0.35);
  for (let i = 0; i < 7; i++) add(T.rows + i * 4, "pop", 0.22);
  add(T.bar, "riser", 0.25); add(T.needs, "thud", 0.4);
  add(T.clickVP + 4, "swish", 0.45); for (let i = 0; i < 4; i++) add(T.clickVP + 18 + i * 6, "pop", 0.3);
  add(T.learner, "whoosh", 0.45); add(T.same, "ding", 0.45);
  add(PAY_START - 3, "whoosh", 0.5); add(PY.tw, "pop", 0.4); for (let i = 0; i < 3; i++) add(PY.one + i * 7, "pop", 0.35); add(PY.facts, "chime", 0.65);
  return a;
})();

export const ProgressStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="progressstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner]} />;
};
