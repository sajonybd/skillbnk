import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Stage, BeatCaption, Stamp, Person } from "./hookKit";
import { makeTL, StoryMain, Fx } from "./storyShell";
import { LandFull, fitKey, fitPts } from "./screenKit";
import { Pill, Shell, CardHead, ViewAll, Stat, THead, PersonCell, ArrowUR, Tone, toneColor } from "./dashKit";

/**
 * BranchWorkspaceStoryVideo — DEEP (sheet serial 48, Branch / School Dashboard "Branch workspace"). Story: Lena, Lakeside Skills Institute (fictional).
 * Verified in code (2026-10-28): SB-Branch components/pageList/dashboard/schools-dashboard — ActionCenter (title "Branch workspace" + info tooltip "Live queues,
 * activity, and branch insights in one place. Use Customize to arrange it your way."; widgets in order Students & Enrollments, Payments to Review, Unread
 * Notifications, Latest Community Posts, Assignments to Review, Mock Interviews to Review, then Bootcamps, Marketing, Day-to-Day Activities, Attendance,
 * Documents, Content & tools), cards/* (stats tiles + completion bar + table rows: Learner|Program|Submitted, Paid by|Payment|Status, Assignment|Submissions|Status,
 * Learner|Interview|Status, Notification|When; rows click through to the full page), widgets/*, @shared/ui dashboard board (Customize / Reset layout / Done, drag
 * handle, Hide widget, "Drag a widget by its handle to move it, choose a width, or hide it. Changes save automatically.") and plan-features (Sheet: package name,
 * "N of M dashboard features available to you", groups Available to you / Permission denied / Not in your plan, strip "See all features").
 * Voice: python3 generate-voice-story.py src/BranchWorkspaceStoryVideo.tsx public/wsstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 301,
  d1: 218,
  d2: 256,
  d3: 221,
  d4: 138,
  d5: 185,
  d6: 201,
  d7: 212,
  d8: 185,
  d9: 143,
  d10: 277,
  d11: 221,
  d12: 229,
  p13: 167,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [7, 12, 24, 43, 51, 91, 94, 103, 109, 116, 125, 132, 141, 148, 152, 156, 162, 186, 201, 217, 220, 228, 235, 246, 251, 262],
  d1: [2, 11, 33, 38, 45, 52, 60, 66, 91, 96, 101, 107, 131, 133, 138, 149, 159, 169, 178],
  d2: [2, 25, 36, 45, 84, 105, 124, 133, 142, 150, 173, 180, 186, 194, 204, 208, 216],
  d3: [2, 30, 36, 43, 73, 99, 108, 112, 121, 131, 138, 143, 161, 171, 182, 186, 198],
  d4: [2, 14, 21, 27, 32, 55, 61, 68, 81, 87, 96, 105],
  d5: [2, 15, 30, 39, 41, 49, 61, 71, 84, 91, 96, 116, 121, 128, 135],
  d6: [2, 19, 27, 34, 50, 58, 67, 91, 94, 99, 103, 107, 138, 138, 145, 163, 170],
  d7: [2, 15, 28, 43, 51, 60, 99, 118, 121, 127, 133, 145, 160, 165, 174],
  d8: [2, 13, 37, 44, 75, 75, 84, 92, 114, 115, 122, 128, 136, 142, 149],
  d9: [2, 20, 31, 37, 50, 63, 77, 105, 112, 117],
  d10: [2, 20, 35, 48, 70, 73, 98, 102, 135, 154, 168, 172, 190, 208, 229, 238, 245],
  d11: [2, 20, 25, 33, 38, 63, 67, 80, 96, 100, 119, 119, 126, 132, 141, 146, 160, 168, 174, 178, 185, 194],
  d12: [2, 18, 31, 43, 61, 69, 75, 83, 117, 120, 125, 130, 138, 142, 148, 169, 183, 186, 192],
  p13: [2, 13, 34, 43, 58, 72, 82, 87, 98, 130, 135],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Lena runs Lakeside Skills Institute. Every morning she checks six different places to see what needs her. By nine-forty, she still hasn't decided where to start.",
  d1: "In skillbank, her day starts on one page. She opens the dashboard, and her workspace loads with live queues.",
  d2: "First, students and enrollments: approved, pending, trial, and inactive members, plus the approved share of the pipeline.",
  d3: "Next, payments to review. Pending, incomplete, and rejected payments show the learner, the amount, and the status.",
  d4: "Every row is a shortcut: one click opens the full payments page.",
  d5: "Unread notifications and the latest community posts sit side by side, so nothing slips by.",
  d6: "Assignments to review count the submissions waiting, and how many are accepted, pending a decision, or rejected.",
  d7: "Mock interviews to review show questions, answers, and how many answers still have no score.",
  d8: "Further down, bootcamp progress, email and SMS activity, and the daily updates her team posts.",
  d9: "Attendance shows her team's clock-ins as approved, pending, or denied.",
  d10: "Documents and content tools count labs, shared files, slides, quizzes, audios and videos, templates, diagrams, and certificates.",
  d11: "Then she makes it hers. In customize mode, she drags widgets into her own order and hides the ones she doesn't need.",
  d12: "And plan features shows what her package includes, so she knows what is on, and what needs an upgrade.",
  p13: "One page, one look. Lena starts her day deciding, not searching.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  menu: cue("d1", "opens", -2),
  page: cue("d1", "workspace", -6),
  stu: S.d2, sApp: cue("d2", "approved", -2), sPend: cue("d2", "pending", -2), sTrial: cue("d2", "trial", -2), sIn: cue("d2", "inactive", -2), sShare: cue("d2", "share", -4),
  pay: S.d3, pPend: cue("d3", "pending", -2), pInc: cue("d3", "incomplete", -2), pRej: cue("d3", "rejected", -2), pRows: cue("d3", "learner", -4),
  row: cue("d4", "row", -2), rowClk: cue("d4", "click", -2),
  notif: S.d5, nCard: cue("d5", "notifications", -4), cCard: cue("d5", "community", -4),
  asg: S.d6, aSub: cue("d6", "submissions", -2), aAcc: cue("d6", "accepted", -2), aPend: cue("d6", "pending", -2), aRej: cue("d6", "rejected", -2),
  mock: S.d7, mQ: cue("d7", "questions", -2), mA: cue("d7", "answers", -2), mNo: cue("d7", "score", -8),
  boot: S.d8, bc: cue("d8", "bootcamp", -4), mk: cue("d8", "email", -4), dd: cue("d8", "daily", -4),
  att: S.d9, aAp: cue("d9", "approved", -2), aPe: cue("d9", "pending", -2), aDe: cue("d9", "denied", -2),
  docs: S.d10, dLab: cue("d10", "labs", -2), dTools: cue("d10", "quizzes", -4), dCert: cue("d10", "certificates", -4),
  cust: cue("d11", "customize", -8), drag: cue("d11", "drags", -4), hide: cue("d11", "hides", -4), done: cue("d11", "need", 6),
  pf: cue("d12", "plan", -10), pfInc: cue("d12", "includes", -2), pfLock: cue("d12", "upgrade", -6),
};
const CLICKS = [T.menu, T.rowClk, T.cust, T.drag + 24, T.hide + 14, T.done, T.pf, T.pfLock + 30];

// ───────── layout (main-area coords) ─────────
const PX = 12, PW = 1326, CW = 651, C2 = PX + CW + 12, CH = 360, PITCH = 376, TOP0 = 214;
const KEYS = ["stu", "pay", "notif", "comm", "asg", "mock", "boot", "mkt", "day", "att", "docs", "tools"] as const;
type CK = (typeof KEYS)[number];
const ORD0: CK[] = [...KEYS];
const ORD1: CK[] = ["pay", "stu", "notif", "comm", "asg", "mock", "boot", "mkt", "day", "att", "docs", "tools"]; // after the drag
const ORD2: CK[] = ["pay", "stu", "comm", "asg", "mock", "boot", "mkt", "day", "att", "docs", "tools"]; // after hiding Unread Notifications
const slot = (i: number): [number, number] => [i % 2 ? C2 : PX, TOP0 + Math.floor(i / 2) * PITCH];
const posOf = (k: CK, f: number): [number, number, number] => {
  const a = slot(ORD0.indexOf(k)), b = slot(ORD1.indexOf(k)), ci = ORD2.indexOf(k);
  const c = ci < 0 ? slot(ORD1.indexOf(k)) : slot(ci);
  const p1 = pr(f, T.drag + 28, 22), p2 = pr(f, T.hide + 18, 26);
  const x = a[0] + (b[0] - a[0]) * p1 + (c[0] - b[0]) * p2, y = a[1] + (b[1] - a[1]) * p1 + (c[1] - b[1]) * p2;
  const hid = k === "notif" ? 1 - pr(f, T.hide + 14, 12) : 1;
  return [x, y, hid];
};
const custP = (f: number) => pr(f, T.cust + 10, 12) * (1 - pr(f, T.done, 12));
const scrollAt = (f: number) => {
  const abs: [number, number][] = [[0, 0], [T.stu - 20, 160], [T.notif - 6, 566], [T.asg - 6, 942], [T.boot - 6, 1318], [T.att - 6, 1694], [T.docs - 6, 2070], [T.cust - 40, 0]];
  let v = 0;
  for (let i = 1; i < abs.length; i++) v += (abs[i][1] - abs[i - 1][1]) * pr(f, abs[i][0], 24);
  return v;
};
const TABS = [["▦", "Dashboard", 132], ["◔", "My Dashboard", 160], ["♛", "Leader Board", 152], ["↗", "Bootcamp's Dashboard", 222]] as const;
const tabX = (i: number) => 28 + TABS.slice(0, i).reduce((a, t) => a + t[2] + 4, 0);

// ───────── card bodies ─────────
type Row = [string, string, string, Tone, string];
const Tbl: React.FC<{ cols: [string, number][]; rows: Row[]; f: number; at: number; hl?: number; press?: boolean }> = ({ cols, rows, f, at, hl = -1, press }) => (
  <div style={{ marginTop: 12 }}>
    <THead cols={[...cols, ["", 40]]} />
    {rows.map(([n, sub, mid, tone, st], i) => (
      <div key={n} style={{ display: "flex", alignItems: "center", height: 52, borderBottom: `1px solid ${LINE}`, opacity: pr(f, at + i * 5, 10), background: hl === i ? (press ? "#E0E7FF" : "#F0FDF4") : "transparent", borderRadius: 8, boxShadow: hl === i ? "0 0 0 2px #A5B4FC" : "none" }}>
        <div style={{ width: cols[0][1], padding: "0 12px" }}><PersonCell name={n} sub={sub} /></div>
        <div style={{ width: cols[1][1], padding: "0 12px", fontSize: 14, fontWeight: 700, color: INK }}>{mid}</div>
        <div style={{ width: cols[2][1], padding: "0 12px" }}><Pill tone={tone}>{st}</Pill></div>
        <div style={{ width: 40 }}><ArrowUR on={hl === i} /></div>
      </div>
    ))}
  </div>
);
const Bar: React.FC<{ label: string; pct: number; k: number; tone: Tone }> = ({ label, pct, k, tone }) => (
  <div style={{ marginTop: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: "#64748B" }}><span>{label}</span><span>{Math.round(pct * k)}%</span></div>
    <div style={{ marginTop: 5, height: 9, borderRadius: 5, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${pct * k}%`, height: "100%", background: toneColor(tone) }} /></div>
  </div>
);
const Stats: React.FC<{ items: [string, number, Tone][]; f: number; at: number; hlI?: number }> = ({ items, f, at, hlI = -1 }) => (
  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>{items.map(([l, v, t], i) => <Stat key={l} label={l} tone={t} on={hlI === i} value={countUp(f, at + i * 4, v, 20)} />)}</div>
);
const Spark: React.FC<{ v: number[]; c: string; k: number; h?: number; w?: number }> = ({ v, c, k, h = 150, w = 60 }) => {
  const m = Math.max(...v);
  return <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: h }}>{v.map((x, i) => <div key={i} style={{ width: w, height: Math.max(4, (x / m) * h * pr(k, i * 3, 18)), borderRadius: "8px 8px 2px 2px", background: c }} />)}</div>;
};

const Card: React.FC<{ k: CK; f: number }> = ({ k, f }) => {
  const [x, y, hid] = posOf(k, f);
  const cp = custP(f);
  const gone = k === "notif" && hid <= 0.001;
  if (gone) return null;
  const shell = (on: boolean, children: React.ReactNode, h = CH) => (
    <Shell x={x} y={y} w={CW} h={h} on={on || (cp > 0 && f >= T.drag && f < T.drag + 60 && (k === "pay" || k === "stu"))} o={hid} dy={(1 - hid) * 20} rot={0} z={k === "pay" && f >= T.drag && f < T.drag + 50 ? 5 : 1}>
      {cp > 0.01 && (
        <>
          <div style={{ position: "absolute", left: 10, top: 10, width: 26, height: 26, borderRadius: 7, background: "#EEF2FF", color: BLUE, fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", opacity: cp, zIndex: 3 }}>⠿</div>
          <div style={{ position: "absolute", right: 10, top: 10, width: 26, height: 26, borderRadius: 7, background: k === "notif" && f >= T.hide ? "#FEE2E2" : "#F1F5F9", color: k === "notif" && f >= T.hide ? "#DC2626" : GRAY, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", opacity: cp, zIndex: 3 }}>◌</div>
        </>
      )}
      {children}
    </Shell>
  );
  const padL = cp > 0.01 ? 22 * cp : 0;
  const wrap = (c: React.ReactNode) => <div style={{ marginLeft: padL, marginRight: padL }}>{c}</div>;
  const g = (a: number) => pr(f, a, 20);
  if (k === "stu") {
    const hlI = f >= T.sIn && f < T.sShare ? 3 : f >= T.sTrial && f < T.sIn ? 2 : f >= T.sPend && f < T.sTrial ? 1 : f >= T.sApp && f < T.sPend ? 0 : -1;
    return shell(f >= T.stu - 2 && f < T.pay - 10, wrap(
      <>
        <CardHead icon="🎓" tone="indigo" title="Students & Enrollments" sub="Membership pipeline for this branch" right={<><Pill tone="amber">9 pending</Pill><ViewAll /></>} />
        <Stats items={[["Approved", 128, "emerald"], ["Pending", 9, "amber"], ["Trial", 14, "sky"], ["Inactive", 6, "slate"]]} f={f} at={T.stu + 8} hlI={[0, 1, 2, 3][hlI] ?? -1} />
        <Bar label="Approved membership share" pct={82} k={f >= T.sShare - 6 ? g(T.sShare - 6) : 0} tone="emerald" />
        <Tbl cols={[["Learner", 250], ["Program", 200], ["Submitted", 140]]} rows={[["Nina Patel", "nina@example.com", "Welding Basics", "amber", "2h ago"], ["Omar Haddad", "omar@example.com", "Electrical 101", "amber", "5h ago"]]} f={f} at={T.stu + 14} />
      </>));
  }
  if (k === "pay") {
    const hlRow = f >= T.row && f < T.notif - 12 ? 0 : -1;
    const hlI = f >= T.pRej && f < T.pRows ? 3 : f >= T.pInc && f < T.pRej ? 2 : f >= T.pPend && f < T.pInc ? 1 : -1;
    return shell(f >= T.pay - 2 && f < T.notif - 10, wrap(
      <>
        <CardHead icon="💳" tone="emerald" title="Payments to Review" sub="Latest payments awaiting approval or follow-up" right={<><Pill tone="amber">7 need attention</Pill><ViewAll /></>} />
        <Stats items={[["Approved", 212, "emerald"], ["Pending", 4, "amber"], ["Incomplete", 2, "slate"], ["Rejected / failed", 1, "rose"]]} f={f} at={T.pay + 8} hlI={hlI} />
        <Tbl cols={[["Paid by", 250], ["Payment", 200], ["Status", 140]]} rows={[["Chloe Bennett", "Welding Basics", "450", "amber", "Pending"], ["Ravi Menon", "Electrical 101", "300", "slate", "Incomplete"], ["Sofia Alvarez", "HVAC Core", "150", "rose", "Rejected"]]} f={f} at={T.pRows - 6} hl={hlRow} press={f >= T.rowClk && f < T.rowClk + 14} />
      </>));
  }
  if (k === "notif") {
    return shell(f >= T.nCard && f < T.cCard - 6, wrap(
      <>
        <CardHead icon="🔔" tone="sky" title="Unread Notifications" sub="Your latest updates, up to 15" right={<><Pill tone="sky">12 unread</Pill><ViewAll /></>} />
        <THead cols={[["Notification", 440], ["When", 120], ["", 40]]} />
        {[["New enrollment: Nina Patel", "2h"], ["Payment submitted by Chloe Bennett", "3h"], ["Assignment submitted: Safety Plan", "5h"], ["Mock interview answer recorded", "6h"], ["Leave request from a team member", "1d"]].map(([t, w], i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", height: 46, borderBottom: `1px solid ${LINE}`, opacity: pr(f, T.notif + 10 + i * 4, 10) }}>
            <div style={{ width: 440, padding: "0 12px", fontSize: 14, fontWeight: 700, color: INK, display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "#0EA5E9" }} />{t}</div>
            <div style={{ width: 120, padding: "0 12px", fontSize: 13, color: GRAY, fontWeight: 600 }}>{w}</div>
          </div>
        ))}
      </>));
  }
  if (k === "comm") {
    return shell(f >= T.cCard && f < T.asg - 10, wrap(
      <>
        <CardHead icon="💬" tone="sky" title="Latest Community Posts" sub="Recent conversations from your branch community" right={<><Pill tone="slate">4 latest</Pill><ViewAll /></>} />
        {[["Tyrone Brooks", "Does anyone have the torque chart from Tuesday's lab?", "20m"], ["Nina Patel", "Study group for the safety quiz, Thursday 6 pm?", "1h"], ["Instructor Cole", "Pinned: new lab hours for next week.", "3h"]].map(([n, t, w], i) => (
          <div key={n} style={{ marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", opacity: pr(f, T.cCard + i * 6, 10) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: INK }}><span>{n}</span><span style={{ color: GRAY, fontWeight: 600 }}>{w}</span></div>
            <div style={{ marginTop: 3, fontSize: 14, color: "#374151", fontWeight: 600 }}>{t}</div>
          </div>
        ))}
      </>));
  }
  if (k === "asg") {
    const hlI = f >= T.aRej ? 4 : f >= T.aPend ? 3 : f >= T.aAcc ? 2 : f >= T.aSub ? 1 : -1;
    return shell(f >= T.asg && f < T.mock - 10, wrap(
      <>
        <CardHead icon="📝" tone="amber" title="Assignments to Review" sub="3 assignments currently need a review" right={<><Pill tone="amber">26 unreviewed</Pill><ViewAll /></>} />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>{([["Total", 12, "indigo"], ["Submissions", 142, "sky"], ["Accepted", 104, "emerald"], ["Pending decision", 26, "amber"], ["Rejected", 12, "rose"]] as [string, number, Tone][]).map(([l, v, t], i) => <Stat key={l} label={l} tone={t} on={hlI === i} value={countUp(f, T.asg + 8 + i * 4, v, 20)} />)}</div>
        <Bar label="Submission decision completion" pct={82} k={f >= T.aSub ? pr(f, T.aSub, 24) : 0} tone="emerald" />
        <Tbl cols={[["Assignment", 250], ["Submissions", 200], ["Status", 140]]} rows={[["Safety Plan", "Welding Basics", "18 submitted", "amber", "9 pending"], ["Circuit Report", "Electrical 101", "24 submitted", "amber", "11 pending"]]} f={f} at={T.asg + 14} />
      </>));
  }
  if (k === "mock") {
    const hlI = f >= T.mNo ? 3 : f >= T.mA ? 1 : f >= T.mQ ? 0 : -1;
    return shell(f >= T.mock && f < T.boot - 10, wrap(
      <>
        <CardHead icon="🎤" tone="rose" title="Mock Interviews to Review" sub="Latest answers awaiting a review score" right={<><Pill tone="rose">22 pending review</Pill><ViewAll /></>} />
        <Stats items={[["Questions", 40, "indigo"], ["Answers", 58, "sky"], ["Reviewed", 36, "emerald"], ["Not reviewed", 22, "rose"]]} f={f} at={T.mock + 8} hlI={hlI} />
        <Bar label="Scoring completion" pct={62} k={f >= T.mA ? pr(f, T.mA, 24) : 0} tone="emerald" />
        <Tbl cols={[["Learner", 250], ["Interview", 200], ["Status", 140]]} rows={[["Tyrone Brooks", "Site Safety Interview", "Q3", "rose", "Not reviewed"], ["Sofia Alvarez", "Customer Service", "Q1", "rose", "Not reviewed"]]} f={f} at={T.mock + 14} />
      </>));
  }
  if (k === "boot") {
    return shell(f >= T.bc && f < T.mk - 6, wrap(
      <>
        <CardHead icon="📚" tone="indigo" title="Bootcamps" sub="Here is all the information about the bootcamps." right={<ViewAll />} />
        {[["Welding Basics", 78, "#6366F1"], ["Electrical 101", 64, "#06B6D4"], ["HVAC Core", 41, "#F59E0B"], ["Safety Fundamentals", 92, "#10B981"]].map(([n, p, c], i) => (
          <div key={n as string} style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: INK }}><span>{n as string}</span><span style={{ color: GRAY }}>{Math.round((p as number) * pr(f, T.bc + i * 5, 24))}%</span></div>
            <div style={{ marginTop: 5, height: 12, borderRadius: 6, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${(p as number) * pr(f, T.bc + i * 5, 24)}%`, height: "100%", background: c as string }} /></div>
          </div>
        ))}
      </>));
  }
  if (k === "mkt") {
    return shell(f >= T.mk && f < T.dd - 6, wrap(
      <>
        <CardHead icon="📣" tone="sky" title="Marketing's" sub="Here's an overview of all marketing (Email and SMS)" right={<ViewAll />} />
        <div style={{ marginTop: 16, display: "flex", gap: 22, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><Spark v={[40, 62, 35, 80, 55, 70]} c="#6366F1" k={f - T.mk} h={170} w={34} /></div>
          <div style={{ width: 130 }}>{[["Email", "#6366F1", 342], ["SMS", "#06B6D4", 198]].map(([l, c, v]) => <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: INK, marginBottom: 10 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: c as string }} />{l as string}<span style={{ marginLeft: "auto", color: GRAY }}>{countUp(f, T.mk, v as number, 24)}</span></div>)}</div>
        </div>
      </>));
  }
  if (k === "day") {
    return shell(f >= T.dd && f < T.att - 10, wrap(
      <>
        <CardHead icon="🗒" tone="amber" title="Day-to-Day Activities" sub="Everyone provides their daily work updates here." right={<ViewAll />} />
        <div style={{ marginTop: 16 }}><Spark v={[12, 18, 15, 26, 22, 30]} c="#F59E0B" k={f - T.dd} h={170} w={56} /></div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, fontWeight: 700, color: GRAY }}>{["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m) => <span key={m} style={{ width: 56 }}>{m} 2026</span>)}</div>
      </>));
  }
  if (k === "att") {
    const hlI = f >= T.aDe ? 3 : f >= T.aPe ? 2 : f >= T.aAp ? 1 : f >= T.att ? 0 : -1;
    const items: [string, number, string][] = [["All Attendance", 96, "#6366F1"], ["Approved", 71, "#10B981"], ["Pending", 18, "#F59E0B"], ["Denied", 7, "#F43F5E"]];
    return shell(f >= T.att && f < T.docs - 10, wrap(
      <>
        <CardHead icon="🗓" tone="emerald" title="Attendance" sub="Approval status of attendance records" right={<ViewAll />} />
        <div style={{ marginTop: 18 }}>
          {items.map(([l, v, c], i) => (
            <div key={l} style={{ marginTop: i ? 12 : 0, padding: "6px 8px", borderRadius: 8, background: hlI === i ? "#F1F5F9" : "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: INK }}><span>{l}</span><span>{countUp(f, T.att + i * 6, v, 20)}</span></div>
              <div style={{ marginTop: 4, height: 11, borderRadius: 6, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${(v / 96) * 100 * pr(f, T.att + i * 6, 22)}%`, height: "100%", background: c }} /></div>
            </div>
          ))}
        </div>
      </>));
  }
  if (k === "docs") {
    return shell(f >= T.docs && f < T.dTools - 6, wrap(
      <>
        <CardHead icon="🗂" tone="indigo" title="Documents" sub="Published documents and shared files available to this branch." right={<ViewAll />} />
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {([["Documents & Labs", "Published", 32], ["Users Documents", "Student-shared", 57], ["Shared Documents", "School-shared", 14], ["Presentations / Slides", "Total Slides", 21]] as [string, string, number][]).map(([t, s, v], i) => (
            <div key={t} style={{ borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "12px 14px", opacity: pr(f, T.docs + i * 6, 10) }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#475569" }}>{t}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>{countUp(f, T.docs + i * 6, v, 20)}</div>
              <div style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{s}</div>
            </div>
          ))}
        </div>
      </>));
  }
  return shell(f >= T.dTools && f < T.cust - 20, wrap(
    <>
      <CardHead icon="🧰" tone="sky" title="Content & tools" sub="Quick access to the resources your branch manages." right={<ViewAll />} />
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {([["Module quizzes", "Available quiz sets", 24], ["Audios & Videos", "Total", 63], ["Templates", "Total Templates", 18], ["Diagram", "Total Diagram", 11], ["Important Links", "Total", 9], ["Total Generated Certificate", "Certificates", 140]] as [string, string, number][]).map(([t, s, v], i) => (
          <div key={t} style={{ borderRadius: 12, background: f >= T.dCert && i === 5 ? "#EEF2FF" : "#F8FAFC", border: `${f >= T.dCert && i === 5 ? 2 : 1}px solid ${f >= T.dCert && i === 5 ? BLUE : "#E2E8F0"}`, padding: "10px 12px", opacity: pr(f, T.dTools + i * 5, 10) }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", minHeight: 30 }}>{t}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>{countUp(f, T.dTools + i * 5, v, 20)}</div>
            <div style={{ fontSize: 11, color: GRAY, fontWeight: 600 }}>{s}</div>
          </div>
        ))}
      </div>
    </>));
};

// ───────── plan features sheet (shared ui) ─────────
const PF_AV = ["Students & Enrollments", "Payments", "Community", "Assignments", "Mock Interviews", "Bootcamps", "Marketing", "Day-to-Day Activities"];
const PF_DENY = ["Attendance Reports"];
const PF_LOCK = ["Documents & Content"];
const PlanSheet: React.FC<{ f: number }> = ({ f }) => {
  const k = pr(f, T.pf + 8, 18) * (1 - pr(f, PAY_START - 40, 14));
  if (k <= 0.01) return null;
  const grp = (title: string, items: string[], tone: Tone, at: number, hint?: string) => (
    <div style={{ marginTop: 18, opacity: pr(f, at, 12) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#64748B", textTransform: "uppercase" }}>{title}<Pill tone={tone} fs={11}>{items.length}</Pill></div>
      {hint && <div style={{ marginTop: 4, fontSize: 12, color: GRAY, lineHeight: 1.4 }}>{hint}</div>}
      {items.map((t) => <div key={t} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 12, border: `1px solid ${LINE}`, background: tone === "emerald" ? "#fff" : "#F8FAFC", fontSize: 14, fontWeight: 700, color: tone === "emerald" ? INK : GRAY }}><span style={{ width: 28, height: 28, borderRadius: 8, background: tone === "emerald" ? "#E0E7FF" : "#F1F5F9", color: tone === "emerald" ? BLUE : GRAY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{tone === "emerald" ? "✓" : tone === "amber" ? "🔒" : "⛔"}</span><span style={{ flex: 1 }}>{t}</span>{tone === "rose" && <Pill tone="rose" fs={10}>No access</Pill>}</div>)}
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.35 * k})` }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: 470, height: "100%", background: "#fff", boxShadow: "-20px 0 60px #0004", transform: `translateX(${(1 - k) * 470}px)`, padding: 22, boxSizing: "border-box", fontFamily: FONT, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#FBBF24,#F97316)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>♛</div>
          <div><div style={{ fontSize: 17, fontWeight: 800, color: INK }}>Growth plan</div><div style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>8 of 10 dashboard features available to you</div></div>
        </div>
        <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${80 * pr(f, T.pf + 14, 24)}%`, height: "100%", background: "#10B981" }} /></div>
        {grp("Available to you", PF_AV.slice(0, 6), "emerald", T.pfInc - 4)}
        {grp("Permission denied", PF_DENY, "rose", T.pfInc + 40, "Your plan includes these, but your role cannot view them. Ask an administrator to update your role.")}
        {grp("Not in your plan", PF_LOCK, "amber", T.pfLock - 4)}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 18, background: "#F8FAFC", borderTop: `1px solid ${LINE}`, opacity: pr(f, T.pfLock, 12) }}>
          <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.5 }}>Ask Lakeside Skills Institute to add this feature to the plan.</div>
        </div>
      </div>
    </>
  );
};

// ───────── the page ─────────
const Page: React.FC<{ f: number }> = ({ f }) => {
  const sc = scrollAt(f), cp = custP(f);
  const onPage = f >= T.page;
  const off = 46 * cp;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F5F7FB", overflow: "hidden" }}>
      {onPage ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1350, height: 2600, transform: `translateY(${-sc}px)` }}>
          <div style={{ position: "absolute", left: PX, top: 10, width: PW, height: 140, borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 12px 40px rgba(15,23,42,0.08)", border: "1px solid #E2E8F0", opacity: pr(f, T.page, 12) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: 84, background: "linear-gradient(135deg,#020617,#1E1B4B 55%,#3730A3)" }}>
              <div style={{ position: "absolute", left: 20, top: 20, width: 44, height: 44, borderRadius: 16, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>▦</div>
              <div style={{ position: "absolute", left: 80, top: 14, fontSize: 21, fontWeight: 700, color: "#fff" }}>Lakeside Skills Institute — Tampa</div>
              <div style={{ position: "absolute", left: 80, top: 46, fontSize: 14, color: "rgba(224,231,255,0.75)" }}>Operational work, branch activity, and resource health.</div>
              <div style={{ position: "absolute", right: 20, top: 46, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12, fontWeight: 600, color: "#E0E7FF" }}>✦ Live data</div>
            </div>
            <div style={{ position: "absolute", left: 12, top: 92, width: PW - 24, height: 40, borderRadius: 12, background: "#F1F5F9" }} />
            {TABS.map(([ic, t, w], i) => <div key={t} style={{ position: "absolute", left: tabX(i), top: 96, width: w, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 14, fontWeight: 600, color: i === 0 ? BLUE : "#6B7280", background: i === 0 ? "#fff" : "transparent", boxShadow: i === 0 ? "0 1px 3px #0002" : "none" }}><span>{ic}</span>{t}</div>)}
          </div>
          <div style={{ position: "absolute", left: PX + 4, top: 166, display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 800, color: "#374151", opacity: pr(f, T.page + 4, 12) }}>
            <span style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF2FF", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</span>Branch workspace <span style={{ fontSize: 13, color: "#9CA3AF" }}>ⓘ</span>
          </div>
          <div style={{ position: "absolute", right: PX + 4, top: 160, display: "flex", gap: 8, alignItems: "center", opacity: pr(f, T.page + 6, 12) }}>
            <span style={{ height: 34, padding: "0 12px", borderRadius: 9, background: "#ECFDF5", color: "#047857", boxShadow: "inset 0 0 0 1px #A7F3D0", display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 800, outline: f >= T.pf - 8 && f < T.pf + 14 ? "4px solid #C7D2FE" : "none" }}>♛ Plan features</span>
            {cp > 0.5 && <span style={{ height: 34, padding: "0 12px", borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", display: "inline-flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: INK }}>Reset layout</span>}
            <span style={{ height: 34, padding: "0 14px", borderRadius: 9, background: cp > 0.5 ? BLUE : "#fff", color: cp > 0.5 ? "#fff" : INK, border: cp > 0.5 ? "none" : `1px solid ${LINE}`, display: "inline-flex", alignItems: "center", fontSize: 13, fontWeight: 800, boxShadow: f >= T.cust - 6 && f < T.cust + 10 || f >= T.done - 6 && f < T.done + 10 ? "0 0 0 4px #C7D2FE" : "none" }}>{cp > 0.5 ? "Done" : "⚙ Customize"}</span>
          </div>
          {cp > 0.01 && (
            <div style={{ position: "absolute", left: PX, top: 206, width: PW, height: 40 * cp, overflow: "hidden", borderRadius: 14, border: "1px dashed #818CF8", background: "#EEF2FF80", opacity: cp }}>
              <div style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: INK }}>▦ Drag a widget by its handle to move it, choose a width, or hide it. Changes save automatically.</div>
            </div>
          )}
          <div style={{ position: "absolute", left: 0, top: off, width: 1350, height: 2600 }}>
            {KEYS.map((k) => <Card key={k} k={k} f={f} />)}
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 24, top: 18, fontSize: 28, fontWeight: 900, color: INK }}>Welcome back</div>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 440, top: 80, width: 420, height: 200, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}` }} />)}
        </div>
      )}
    </div>
  );
};

// ───────── camera, cursor, steps ─────────
const calm = fitKey;
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.menu, 780, 700, 1.08], [T.page + 10, 960, 520, 1.0],
  [T.stu, 1000, 480, 1.1], [T.sShare, 1000, 560, 1.1], [T.pay, 1000, 520, 1.1], [T.pRows, 1000, 600, 1.12], [T.row, 1000, 620, 1.12],
  [T.notif, 1000, 520, 1.08], [T.asg, 1000, 540, 1.1], [T.mock, 1000, 540, 1.1], [T.boot, 1000, 520, 1.08], [T.att, 1000, 540, 1.1], [T.docs, 1000, 540, 1.08],
  [T.cust - 20, 1000, 460, 1.05], [T.drag, 1000, 560, 1.1], [T.hide - 6, 1000, 600, 1.08], [T.done, 1000, 520, 1.0],
  [T.pf, 1100, 540, 1.0], [T.pfInc, 1200, 560, 1.1], [T.pfLock, 1200, 620, 1.1], [PAY_START, 960, 540, 1.0],
]).map(calm);
const SCP = (t: number, x: number, y: number): [number, number, number] => [t, ...MA(x, y - scrollAt(t)) as [number, number]];
const CUR: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.menu, ...realMenuPt("Dashboard")],
  [T.page + 30, ...MA(500, 420)],
  SCP(T.sApp, 200, TOP0 + 110), SCP(T.sIn, 560, TOP0 + 110), SCP(T.sShare, 300, TOP0 + 200),
  SCP(T.pPend, C2 + 130, TOP0 + 110), SCP(T.pRej, C2 + 480, TOP0 + 110),
  SCP(T.row - 4, C2 + 300, TOP0 + 262), SCP(T.rowClk, C2 + 300, TOP0 + 262), SCP(T.rowClk + 24, C2 + 560, TOP0 + 60),
  SCP(T.nCard, 300, TOP0 + PITCH + 160), SCP(T.cCard, C2 + 300, TOP0 + PITCH + 160),
  SCP(T.aSub, 340, TOP0 + 2 * PITCH + 110), SCP(T.aRej, 560, TOP0 + 2 * PITCH + 110),
  SCP(T.mQ, C2 + 80, TOP0 + 2 * PITCH + 110), SCP(T.mNo, C2 + 500, TOP0 + 2 * PITCH + 110),
  SCP(T.bc, 300, TOP0 + 3 * PITCH + 150), SCP(T.mk, C2 + 300, TOP0 + 3 * PITCH + 150),
  SCP(T.dd, 300, TOP0 + 4 * PITCH + 150), SCP(T.aAp, C2 + 300, TOP0 + 4 * PITCH + 150),
  SCP(T.docs, 300, TOP0 + 5 * PITCH + 150), SCP(T.dTools, C2 + 300, TOP0 + 5 * PITCH + 150),
  SCP(T.cust, 1230, 177), SCP(T.cust + 40, C2 + 300, TOP0 + 80),
  SCP(T.drag, C2 + 26, TOP0 + 24), SCP(T.drag + 24, C2 + 26, TOP0 + 24), SCP(T.drag + 52, PX + 26, TOP0 + 24),
  SCP(T.hide + 6, PX + 340, TOP0 + PITCH + 30), SCP(T.hide + 14, PX + 623, TOP0 + PITCH + 22),
  SCP(T.done - 6, 700, 300), SCP(T.done, 1270, 177),
  SCP(T.pf - 4, 1080, 177), SCP(T.pf, 1080, 177), SCP(T.pfInc, 1100, 400), SCP(T.pfLock + 30, 1100, 590),
  [PAY_START, 1560, 880],
]);
const CURS = fitPts(CUR);
const STEPS = [
  { at: T.menu, to: T.stu, label: "Open the dashboard" },
  { at: T.stu, to: T.notif, label: "Students and payments" },
  { at: T.notif, to: T.boot, label: "Community, assignments, interviews" },
  { at: T.boot, to: T.cust, label: "Activity and resources" },
  { at: T.cust, to: T.pf, label: "Customize the layout" },
  { at: T.pf, to: PAY_START, label: "Plan features" },
];
const Demo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#F8FAFC" }}>
    <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]} calm={0.999}>
      <LandFull f={f} at={DEMO_START} url={f >= T.page ? "lakeside.skillbnk.com/dashboard" : "lakeside.skillbnk.com"} branch="Lakeside Skills Institute — Tampa" active="Dashboard" main={<Page f={f} />} overlay={<PlanSheet f={f} />} />
      <Cursor f={f} pts={CURS} clicks={CLICKS} from={DEMO_START + 10} />
    </CameraWorld>
    <StepChipL f={f} steps={STEPS} />
    <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Training provider portal" />
  </AbsoluteFill>
);

// ───────── hook: six tabs, six red badges, one morning ─────────
const HK = { six: cue("h0", "six"), enr: cue("h0", "morning", 4), nine: cue("h0", "nine-forty"), where: cue("h0", "where") };
const TABS_H: [string, number, string][] = [["Enrollments", 9, "#6366F1"], ["Payments", 7, "#10B981"], ["Notifications", 12, "#0EA5E9"], ["Community", 4, "#06B6D4"], ["Assignments", 26, "#F59E0B"], ["Mock interviews", 22, "#F43F5E"]];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const clock = 8 * 60 + Math.round(100 * lin(f, HK.six - 30, HK.nine + 20));
  const hh = Math.floor(clock / 60), mm = clock % 60;
  const warm = lin(f, HK.nine - 20, HK.where + 20);
  const step = Math.min(5, Math.floor(Math.max(0, f - HK.six + 10) / 34));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 56, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#FBBF24" }}>LAKESIDE SKILLS INSTITUTE</div>
          <div style={{ marginTop: 6, fontSize: 52, fontWeight: 900, color: "#F8FAFC" }}>Monday morning, tab by tab</div>
        </div>
        <div style={{ position: "absolute", right: 120, top: 60, padding: "10px 26px", borderRadius: 16, background: "#0F172A", border: `4px solid ${warm > 0.5 ? "#EF4444" : "#64748B"}`, fontSize: 64, fontWeight: 900, color: warm > 0.5 ? "#FCA5A5" : "#F8FAFC", fontVariantNumeric: "tabular-nums" }}>{hh}:{String(mm).padStart(2, "0")}</div>
        {/* browser with a growing tab strip */}
        <div style={{ position: "absolute", left: 160, top: 250, width: 1600, height: 640, borderRadius: 22, background: "#0F172A", border: "3px solid #334155", boxShadow: "0 40px 100px #000a", overflow: "hidden" }}>
          <div style={{ height: 76, background: "#1E293B", display: "flex", alignItems: "flex-end", padding: "0 18px", gap: 6 }}>
            {TABS_H.map(([t, n, c], i) => {
              const k = pr(f, HK.six - 6 + i * 34, 14);
              return (
                <div key={t} style={{ width: 246, height: 58, borderRadius: "14px 14px 0 0", background: i === step ? "#F8FAFC" : "#334155", color: i === step ? "#0F172A" : "#CBD5E1", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 20, fontWeight: 800, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, whiteSpace: "nowrap" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 6, background: c }} />{t}
                  <span style={{ marginLeft: "auto", minWidth: 30, height: 30, borderRadius: 15, background: "#EF4444", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>{Math.round(n * k)}</span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "34px 44px" }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#F8FAFC" }}>{TABS_H[step][0]}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: "#94A3B8" }}>{TABS_H[step][1]} waiting. Open the next tab to see the next pile.</div>
            {[0, 1, 2, 3].map((r) => <div key={r} style={{ marginTop: 16, height: 56, borderRadius: 12, background: "#1E293B", opacity: 0.9 - r * 0.15, width: `${96 - r * 9}%` }} />)}
          </div>
        </div>
      </Stage>
      <Stamp f={f} at={HK.where + 2} x={960} y={930} text="WHERE DO I START?" size={60} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.six, "Six places to check.", "Six"], [HK.enr, "Every single morning.", "morning"], [HK.nine, "9:40, and still no plan.", "no plan"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { one: cue("p13", "one"), dec: cue("p13", "deciding") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(99,102,241,0.25), transparent 62%)" }} />
    <Person f={f} at={PAY_START + 4} x={380} y={260} name="Lena" role="Lakeside Skills Institute" mood="happy" />
    <div style={{ position: "absolute", left: 640, top: 210, width: 900, height: 360, borderRadius: 26, background: "#F8FAFC", border: "6px solid #6366F1", padding: 28, opacity: pr(f, PY.one - 6, 12), boxSizing: "border-box" }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: INK }}>⚡ Branch workspace</div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {["Students", "Payments", "Notifications", "Community", "Assignments", "Mock interviews"].map((t, i) => <div key={t} style={{ height: 76, borderRadius: 14, background: "#EEF2FF", color: "#3730A3", fontSize: 24, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", opacity: pr(f, PY.one + i * 4, 10) }}>{t}</div>)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 650, width: 1920, textAlign: "center", fontSize: 50, fontWeight: 900, color: "#C7D2FE", opacity: pr(f, PY.dec - 6, 12) }}>Start the day deciding, not searching.</div>
    <div style={{ position: "absolute", left: 0, top: 740, width: 1920, textAlign: "center", fontSize: 28, fontWeight: 700, color: "#94A3B8", opacity: pr(f, PY.dec + 16, 12) }}>Example: 20 minutes saved each morning × 240 working days ≈ 80 hours a year</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  for (let i = 0; i < 6; i++) add(HK.six - 6 + i * 34, "pop", 0.3);
  add(HK.nine, "thud", 0.3); add(HK.where + 2, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  add(T.page, "swish", 0.3); add(T.drag + 52, "pop", 0.4); add(T.hide + 18, "swish", 0.35); add(T.pf + 8, "whoosh_s", 0.3); add(T.pfLock, "ding", 0.3);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.dec, "chime", 0.5);
  return a;
})();

export const BranchWorkspaceStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="wsstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.pf]} finish={false} />;
};
