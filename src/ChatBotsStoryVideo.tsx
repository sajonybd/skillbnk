import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Person, Stage, BeatCaption, Stamp, Bubble } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, HookTag, Table, PageHead, Fx } from "./storyShell";
import { ChatShell, Item, Msg } from "./ChatStoryVideo";

/**
 * ChatBotsStoryVideo — DEEP (sheet serial 42). Story: Reza Karimi, Open Road CDL Academy (fictional).
 * Verified in code: SB-Branch pageList/Chat/AllBots ("Chat Bots", "Create or update a bot and view their history.", "Enter Bot Name...",
 * Create New Bot, export, columns SN / Bot Name / Description / Status / Bot Used / Last Sent / Created By / Creation Date / Action with
 * "Cron Jobs"); CreateEditBotModal (Bot Name "Enter name", Description, "Bot created successfully!"); CronJobsModal (All Jobs, Job Name
 * "Enter job name", Description, "Cron Expression (Use UTC timezone)", "Enter cron expression (e.g. every 5 min)", "Format: minute hour
 * day month weekday", "Cron Expression Examples:", "Click to generate", Text Message, Target Audience Channels / User Group, Select
 * Channels, Select a Program, Select a Session, Create Job, "Created job successfully", Status Active / Not Active, Stop / Restart / Edit /
 * Delete). AI Bot: libs/shared/chat (SideNavigation "AI Bot", ChatPopup floating button, "Ai is generating your answer...",
 * lib/aiAssistant.ts: replies stream from the institute's ChatGPT integration, last 6 messages sent as context, allowances metered).
 * SB-Branch Integrations: "Branch Integrations", "Managed by your organization", ChatGPT "Healthy" / "Connection verified and ready to use.",
 * "Your branch allowances", feature "Chat AI assistant", "AI requests".
 * Voice: python3 generate-voice-story.py src/ChatBotsStoryVideo.tsx public/botsstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 343,
  d1: 291,
  d2: 179,
  d3: 331,
  d4: 148,
  d5: 262,
  d6: 205,
  d7: 243,
  d8: 189,
  d9: 224,
  d10: 156,
  d11: 308,
  p12: 218,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 14, 28, 37, 46, 57, 85, 91, 97, 105, 126, 128, 133, 139, 148, 156, 165, 175, 183, 211, 214, 225, 249, 249, 258, 270, 277, 283, 292, 300, 310, 318],
  d1: [2, 24, 58, 64, 75, 93, 127, 130, 139, 148, 155, 160, 172, 180, 186, 195, 211, 216, 227, 231, 241, 256],
  d2: [2, 11, 24, 30, 37, 42, 53, 65, 92, 93, 99, 103, 133, 136],
  d3: [2, 14, 24, 31, 36, 42, 54, 88, 90, 97, 103, 111, 126, 130, 137, 163, 180, 183, 187, 192, 214, 217, 225, 233, 265, 266, 273, 282, 298, 303],
  d4: [2, 10, 15, 22, 49, 52, 58, 65, 86, 90, 94, 101, 108, 112, 117],
  d5: [2, 21, 32, 39, 44, 51, 62, 79, 87, 91, 97, 104, 114, 122, 142, 146, 151, 159, 166, 174, 184, 199, 207, 212],
  d6: [2, 23, 30, 35, 61, 64, 70, 77, 81, 84, 100, 116, 121, 144, 144, 157, 168, 172, 177],
  d7: [2, 24, 28, 34, 64, 76, 90, 103, 107, 116, 125, 129, 131, 139, 162, 165, 168, 173, 188, 194, 201, 211, 217],
  d8: [2, 10, 20, 28, 51, 51, 56, 61, 79, 83, 90, 97, 101, 106, 110, 114, 120, 136, 150, 163],
  d9: [2, 26, 36, 40, 45, 48, 54, 58, 65, 73, 79, 83, 89, 120, 123, 127, 133, 139, 148, 158, 163, 192, 192, 198],
  d10: [2, 10, 18, 24, 32, 43, 52, 66, 72, 80, 84, 91, 98],
  d11: [2, 13, 19, 22, 31, 43, 75, 77, 88, 116, 144, 150, 160, 169, 193, 194, 199, 206, 222, 233, 239, 245, 255, 265, 272, 277],
  p12: [2, 22, 27, 34, 40, 80, 80, 87, 95, 102, 142, 145, 159, 166, 174],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Reza runs a truck driving school. Every Monday at seven, he types the same reminder into two class chats. And every night, students ask questions that wait until morning for an answer.",
  d1: "In skillbank, he opens All Bots. Each bot shows how many times it's been used, and when it last sent a message.",
  d2: "He creates a new bot called Monday reminder, with a short description. Bot created.",
  d3: "Cron jobs are where the timing lives. He names the job, and sets the schedule: Monday, seven in the morning. If cron looks unfamiliar, click to generate opens a helper.",
  d4: "Then the message itself: this week's yard schedule, and a reminder to bring the logbook.",
  d5: "The audience can be chat channels, or a user group by program and session. He picks his two evening crowds, and creates the job.",
  d6: "The job is active. He can stop it over the holidays, restart it, edit the text, or delete it.",
  d7: "Now, the learner side. Monday, seven a.m. The reminder lands in the class crowd, sent by the bot, without Reza touching a thing.",
  d8: "At eleven at night, Kim has a question. She opens the chat button in the corner, and picks AI Bot.",
  d9: "She asks how to do the air brake check on a pre trip. The bot thinks for a moment, then answers, step by step.",
  d10: "Her follow up keeps the context, so she doesn't have to explain again.",
  d11: "Back in the training provider portal, Reza checks Integrations. ChatGPT is connected and healthy, and the branch allowances show how many AI requests have been used.",
  p12: "Reminders go out on time. Questions get answered at midnight. Reza gets his Mondays back.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "bots", -6),
  tour: cue("d1", "used", -4),
  clickCreate: cue("d2", "creates", -4),
  typeName: cue("d2", "called", 0),
  typeDesc: cue("d2", "description", -2),
  saveBot: cue("d2", "created", -4),
  clickCron: cue("d3", "cron", -4),
  jobName: cue("d3", "names", -2),
  cronExpr: cue("d3", "schedule", -2),
  helper: cue("d3", "generate", -4),
  msg: cue("d4", "message", -4),
  audience: cue("d5", "audience", -4),
  channels: cue("d5", "picks", -2),
  createJob: cue("d5", "creates", -2),
  jobCard: S.d6,
  stopHover: cue("d6", "stop", -4),
  learner: cue("d7", "learner", -8),
  arrive: cue("d7", "lands", -4),
  night: S.d8,
  clickBubble: cue("d8", "button", -4),
  clickAi: cue("d8", "picks", 0),
  ask: cue("d9", "asks", -4),
  send1: cue("d9", "pre", 8),
  think: cue("d9", "thinks", -2),
  answer: cue("d9", "answers", -4),
  ask2: cue("d10", "follow", -4),
  send2: cue("d10", "context", 0),
  back: S.d11,
  usage: cue("d11", "allowances", -6),
};
const CLICKS = [T.clickMenu, T.clickCreate, T.typeName, T.typeDesc, T.saveBot, T.clickCron, T.jobName, T.cronExpr, T.msg, T.audience, T.channels, T.channels + 14, T.createJob, T.clickBubble, T.clickAi, T.ask, T.send1, T.ask2, T.send2];

// ───────── All Bots list ─────────
type B = { n: string; d: string; st: boolean; u: number; l: string; by: string; c: string };
const BASE: B[] = [
  { n: "Welcome bot", d: "Greets new students in their class crowd", st: true, u: 42, l: "Oct 12, 2026", by: "Reza Karimi", c: "Aug 02, 2026" },
  { n: "Fee due reminder", d: "Monthly tuition reminder", st: true, u: 9, l: "Oct 01, 2026", by: "Lisa Grant", c: "Jun 15, 2026" },
  { n: "Holiday closure", d: "Closure notice", st: false, u: 3, l: "Jul 03, 2026", by: "Reza Karimi", c: "Jun 28, 2026" },
];
const BNAME = "Monday reminder";
const COLS = [{ h: "SN", w: 50 }, { h: "Bot Name", w: 210 }, { h: "Description", w: 300 }, { h: "Status", w: 110 }, { h: "Bot Used", w: 100 }, { h: "Last Sent", w: 140 }, { h: "Created By", w: 160 }, { h: "Action", w: 230 }];
const TBX = 18, TBY = 120, RH = 64;
const rowY = (i: number) => TBY + 54 + i * RH + RH / 2;
const CRONX = TBX + 1070 + 60;
const BotsPage: React.FC<{ f: number }> = ({ f }) => {
  const made = f >= T.saveBot + 4;
  const used = f >= T.arrive ? 1 : 0;
  const rows: B[] = made ? [{ n: BNAME, d: "Weekly yard schedule + logbook reminder", st: true, u: used, l: used ? "Today, 7:00" : "—", by: "Reza Karimi", c: "Today" }, ...BASE] : BASE;
  return (
    <>
      <PageHead title="Chat Bots" sub="Create or update a bot and view their history." />
      <div style={{ position: "absolute", left: 620, top: 24, width: 320, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Enter Bot Name...</div>
      <div style={{ position: "absolute", left: 952, top: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⇪</div>
      <Btn x={1012} y={24} w={220} label="＋  Create New Bot" primary fs={16} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} />
      <Table x={TBX} y={TBY} cols={COLS} rowH={RH} hl={made && f < T.clickCron ? 0 : -1} hlA={1}
        oRow={(i) => (made && i === 0 ? pr(f, T.saveBot + 4, 12) : 1)}
        rows={rows.map((b, i) => [
          <span style={{ color: GRAY }}>{i + 1}</span>, <b style={{ fontWeight: 800 }}>🤖 {b.n}</b>, <span style={{ fontSize: 14, color: "#374151" }}>{b.d}</span>,
          b.st ? <Badge t="Active" c="#15803D" bg="#DCFCE7" fs={13} dot /> : <Badge t="Inactive" c="#B91C1C" bg="#FEE2E2" fs={13} dot />,
          <b style={{ fontSize: 16 }}>{b.u}</b>, <span style={{ fontSize: 14, color: GRAY }}>{b.l}</span>,
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}><Avatar t={b.by.split(" ").map((w) => w[0]).join("")} s={26} />{b.by}</div>,
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ padding: "6px 12px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 800, boxShadow: i === 0 && f >= T.clickCron - 10 && f < T.clickCron + 6 ? "0 0 0 4px #C7D2FE" : "none" }}>⏱ Cron Jobs</span>
            <span style={{ width: 32, height: 30, borderRadius: 8, background: "#EEF2FF", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✎</span>
            <span style={{ width: 32, height: 30, borderRadius: 8, background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🗑</span>
          </div>,
        ])} />
    </>
  );
};

const lab = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 15, fontWeight: 800, color: "#374151" }}>{t}</div>;
const box = (x: number, y: number, w: number, on: boolean, v: React.ReactNode, ph: string, sel?: boolean, mono?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 46, borderRadius: 11, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 16, fontWeight: 600, color: v ? INK : "#9CA3AF", fontFamily: mono && v ? "monospace" : FONT, whiteSpace: "nowrap", overflow: "hidden" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>;

const BX = 420, BY = 200, BW = 760, BH = 380;
const BP = (x: number, y: number) => CT(BX + x, BY + y);
const BotModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickCreate + 3 || f > T.saveBot + 14) return null;
  const o = pr(f, T.clickCreate + 4, 10) * (1 - lin(f, T.saveBot + 2, T.saveBot + 12));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: BX, top: BY, width: BW, height: BH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 24, fontWeight: 900, color: INK }}>Create New Bot</div>
        {lab(28, 76, "Bot Name")}{box(28, 100, BW - 56, f >= T.typeName && f < T.typeDesc, typed(f, T.typeName + 2, BNAME, 0.9), "Enter name")}
        {lab(28, 164, "Description")}{box(28, 188, BW - 56, f >= T.typeDesc && f < T.saveBot, typed(f, T.typeDesc + 2, "Weekly yard schedule + logbook reminder", 1.4), "")}
        <Btn x={BW - 28 - 120} y={BH - 70} w={120} label="Save" primary fs={17} press={f >= T.saveBot && f < T.saveBot + 6 ? 1 : 0} />
      </div>
    </>
  );
};

// ───────── cron jobs modal ─────────
const JX = 60, JY = 14, JW = 1480, JH = 808;
const JP = (x: number, y: number) => CT(JX + x, JY + y);
const MSG = "This week's yard schedule: Tue & Thu 5–9 pm, Bay 3. Bring your logbook for sign-off.";
const CronModal: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickCron + 3 || f > T.learner + 2) return null;
  const inn = Math.min(1, sp(f, T.clickCron + 4, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, T.learner - 10, T.learner));
  const created = f >= T.createJob + 4;
  const chanOpen = f >= T.channels - 6 && f < T.channels + 24;
  const picked = f >= T.channels + 16 ? 2 : f >= T.channels + 2 ? 1 : 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: JX, top: JY + (1 - inn) * 30, width: JW, height: JH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 24, fontWeight: 900, color: INK }}>Cron Jobs · 🤖 {BNAME}</div>
        <div style={{ position: "absolute", left: 28, top: 76, width: 420, height: JH - 104, borderRadius: 14, background: "#F9FAFB", border: `2px solid ${LINE}`, padding: 16, boxSizing: "border-box" }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>All Jobs</div>
          {!created ? <div style={{ marginTop: 20, fontSize: 15, fontWeight: 600, color: GRAY }}>No jobs yet</div> : (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#fff", border: `2px solid ${f >= T.jobCard && f < T.learner ? BLUE : LINE}`, opacity: pr(f, T.createJob + 4, 10) }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: INK }}>Job Name: Monday yard schedule</div>
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: GRAY }}>Status: <span style={{ color: "#16A34A" }}>Active</span></div>
              <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: GRAY }}>Schedule: <code>0 13 * * 1</code> · Mon 7:00 am (CST)</div>
              <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: GRAY }}>Selected Crowds: Class B — Evening, Class A — Evening</div>
              <div style={{ marginTop: 10, display: "flex", gap: 6 }}>{["Stop", "Restart", "Edit", "Delete"].map((t, i) => <span key={t} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 13, fontWeight: 800, background: i === 3 ? "#FEE2E2" : i === 0 && f >= T.stopHover && f < T.stopHover + 30 ? BLUE : "#F3F4F6", color: i === 3 ? "#DC2626" : i === 0 && f >= T.stopHover && f < T.stopHover + 30 ? "#fff" : INK }}>{t}</span>)}</div>
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: 472, top: 76, right: 28, bottom: 28 }}>
          {lab(0, 0, "Job Name:")}{box(0, 24, 470, f >= T.jobName && f < T.cronExpr, created ? "" : typed(f, T.jobName + 2, "Monday yard schedule", 1), "Enter job name")}
          {lab(500, 0, "Description:")}{box(500, 24, 480, false, created ? "" : f >= T.jobName + 20 ? "Weekly reminder for evening classes" : "", "Description")}
          {lab(0, 92, "Cron Expression (Use UTC timezone)")}{box(0, 116, 470, f >= T.cronExpr && f < T.msg, created ? "" : typed(f, T.cronExpr + 2, "0 13 * * 1", 0.4), "Enter cron expression (e.g. */5 * * * *)", false, true)}
          <div style={{ position: "absolute", left: 500, top: 116, height: 46, padding: "0 16px", borderRadius: 11, border: `2px solid ${f >= T.helper - 6 && f < T.helper + 30 ? BLUE : LINE}`, display: "flex", alignItems: "center", fontSize: 15, fontWeight: 800, color: INK }}>Click to generate ↗</div>
          <div style={{ position: "absolute", left: 0, top: 172, width: 980, padding: "10px 14px", borderRadius: 10, background: "#F0F9FF", border: "1px solid #BAE6FD", fontSize: 13, fontWeight: 700, color: "#075985" }}>Format: minute hour day month weekday · Cron Expression Examples: <code>*/5 * * * *</code> every 5 min · <code>0 13 * * 1</code> Monday 13:00 UTC</div>
          {lab(0, 228, "Text Message")}
          <div style={{ position: "absolute", left: 0, top: 252, width: 980, height: 130, borderRadius: 11, border: `2px solid ${f >= T.msg && f < T.audience ? BLUE : "#D1D5DB"}` }}>
            <div style={{ height: 34, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 14, padding: "0 12px", fontSize: 14, fontWeight: 900, color: GRAY }}><b>B</b><i>I</i><u>U</u><span>•≡</span><span>🔗</span></div>
            <div style={{ padding: 12, fontSize: 16, fontWeight: 600, color: INK, lineHeight: 1.5 }}>{created ? "" : typed(f, T.msg + 2, MSG, 1.6)}</div>
          </div>
          {lab(0, 404, "Target Audience")}
          {["Channels", "User Group"].map((t, i) => { const ug = f >= T.audience + 6 && f < T.audience + 50; const on = i === 1 ? ug : !ug; return <div key={t} style={{ position: "absolute", left: i * 150, top: 430, padding: "10px 16px", borderRadius: 10, background: on ? BLUE : "#fff", color: on ? "#fff" : INK, border: on ? "none" : `2px solid ${LINE}`, fontSize: 15, fontWeight: 800 }}>{t}</div>; })}
          {f >= T.audience + 6 && f < T.audience + 50 && <div style={{ position: "absolute", left: 320, top: 430, width: 660, height: 46, opacity: pr(f, T.audience + 6, 8) }}>{box(0, 0, 320, false, "", "Select a Program", true)}<div style={{ position: "absolute", left: 340, top: 0 }}>{box(0, 0, 320, false, "", "Select a Session", true)}</div></div>}
          {lab(0, 494, "Select Channels")}
          {box(0, 518, 980, chanOpen, created ? "" : picked ? ["Class B — Evening", "Class A — Evening"].slice(0, picked).map((c) => `👥 ${c}`).join("   ·   ") : "", "Select Channels", true)}
          {chanOpen && <div style={{ position: "absolute", left: 0, top: 570, width: 980, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, zIndex: 4 }}>{["Class B — Evening", "Class A — Evening", "Class B — Morning", "Instructors"].map((c, i) => <div key={c} style={{ height: 40, borderRadius: 8, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontSize: 16, fontWeight: 800, color: i < picked ? BLUE : INK, background: i < picked ? "#EEF2FF" : "transparent" }}>{i < picked ? "☑" : "☐"} 👥 {c}</div>)}</div>}
          <Btn x={980 - 140} y={JH - 76 - 28 - 60} w={140} label="Create Job" primary fs={16} press={f >= T.createJob && f < T.createJob + 6 ? 1 : 0} />
        </div>
      </div>
    </>
  );
};

// ───────── learner: crowd + AI bot ─────────
const REMINDER: Msg = { who: "Monday reminder", me: false, text: MSG, at: T.arrive + 4 };
const LearnerCrowd: React.FC<{ f: number }> = ({ f }) => {
  const items: Item[] = [
    { n: "Class B — Evening", sub: f >= T.arrive + 4 ? "Monday reminder: This week's yard…" : "Coach Reza: Good work tonight", t: f >= T.arrive + 4 ? "7:00" : "Fri", crowd: true, unread: f >= T.arrive + 4 ? 1 : 0 },
    { n: "Reza Karimi", sub: "See you Tuesday", t: "Fri", c: "#2E64F0" },
    { n: "Study group", sub: "Kim: quiz me on signs?", t: "Sun", crowd: true, c: "#0EA5E9" },
  ];
  return <ChatShell f={f} rail={0} items={items} sel={0} head={{ n: "Class B — Evening", sub: "18 members", crowd: true }} msgs={[{ who: "Reza Karimi", me: false, text: "Good work tonight. Rest up.", at: 0 }, REMINDER]} />;
};
const Q1 = "How do I do the air brake check on a pre-trip?";
const A1 = ["1. Build air pressure to governor cut-out (about 120–140 psi).", "2. Engine off, release brakes, apply foot brake: leak no more than 4 psi in 1 minute.", "3. Fan the brakes: low-air warning should come on by 60 psi.", "4. Keep fanning: the parking brake valve should pop out between 20 and 45 psi."];
const Q2 = "And if the warning doesn't come on?";
const A2 = "Then the truck isn't safe to drive. Write it up on your inspection report and tell your instructor before you leave the yard.";
const AiPopup: React.FC<{ f: number }> = ({ f }) => {
  const open = f >= T.clickBubble + 2;
  const ai = f >= T.clickAi + 2;
  const draft = f >= T.ask && f < T.send1 ? typed(f, T.ask + 2, Q1, 1.4) : f >= T.ask2 && f < T.send2 ? typed(f, T.ask2 + 2, Q2, 1.4) : "";
  const thinking = (f >= T.send1 + 2 && f < T.answer) || (f >= T.send2 + 2 && f < T.send2 + 26);
  const nA1 = f >= T.answer ? Math.min(A1.length, Math.floor((f - T.answer) / 14) + 1) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 30, top: 24, fontSize: 30, fontWeight: 900, color: INK }}>Dashboard</div>
      <div style={{ position: "absolute", left: 30, top: 70, fontSize: 16, fontWeight: 600, color: GRAY }}>Welcome back, Kim</div>
      {["Next class: Tue 5:00 pm · Bay 3", "Pre-trip inspection: 72% complete", "Logbook hours: 18 / 40"].map((t, i) => <div key={t} style={{ position: "absolute", left: 30 + i * 300, top: 120, width: 280, height: 110, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, padding: 18, boxSizing: "border-box", fontSize: 16, fontWeight: 800, color: INK }}>{t}</div>)}
      <div style={{ position: "absolute", right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, background: BLUE, color: "#fff", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: f >= T.clickBubble - 20 && !open ? "0 0 0 8px #BFDBFE, 0 10px 30px #1D3FD680" : "0 10px 30px #1D3FD680" }}>💬</div>
      {open && (
        <div style={{ position: "absolute", right: 24, bottom: 100, width: 560, height: 640, borderRadius: 20, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 30px 80px #0005", overflow: "hidden", opacity: pr(f, T.clickBubble + 2, 10) }}>
          <div style={{ height: 60, background: BLUE, color: "#fff", display: "flex", alignItems: "center", gap: 12, padding: "0 18px", fontSize: 18, fontWeight: 900 }}>{ai ? <>🤖 AI Bot <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, opacity: 0.85 }}>Online</span></> : <>Chats</>}</div>
          {!ai ? (
            <div style={{ display: "flex", height: 580 }}>
              <div style={{ width: 60, background: "#F8FAFC", borderRight: `1px solid ${LINE}` }}>{["💬", "👥", "✉", "📌", "🟢", "🤖"].map((c, i) => <div key={c} style={{ margin: "10px 8px", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, background: i === 5 && f >= T.clickAi - 12 ? "#EEF2FF" : "transparent", border: i === 5 && f >= T.clickAi - 12 ? `2px solid ${BLUE}` : "2px solid transparent", boxSizing: "border-box" }}>{c}</div>)}</div>
              <div style={{ flex: 1, padding: 12 }}>{["Class B — Evening", "Reza Karimi", "Study group"].map((n) => <div key={n} style={{ height: 56, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, padding: "0 8px", fontSize: 15, fontWeight: 800, color: INK }}><Avatar t={n[0]} s={36} c1="#7C3AED" c2="#6D28D9" />{n}</div>)}</div>
            </div>
          ) : (
            <div style={{ position: "relative", height: 580, background: "#F8FAFC" }}>
              <div style={{ position: "absolute", left: 16, right: 16, top: 12, bottom: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
                {f >= T.send1 && <div style={{ alignSelf: "flex-end", maxWidth: 400, padding: "10px 14px", borderRadius: 14, background: BLUE, color: "#fff", fontSize: 15, fontWeight: 600 }}>{Q1}</div>}
                {nA1 > 0 && <div style={{ alignSelf: "flex-start", maxWidth: 470, padding: "10px 14px", borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.45 }}><div style={{ fontSize: 12, fontWeight: 900, color: "#7C3AED" }}>🤖 AI Bot</div>{A1.slice(0, nA1).map((l) => <div key={l}>{l}</div>)}</div>}
                {f >= T.send2 && <div style={{ alignSelf: "flex-end", maxWidth: 400, padding: "10px 14px", borderRadius: 14, background: BLUE, color: "#fff", fontSize: 15, fontWeight: 600 }}>{Q2}</div>}
                {f >= T.send2 + 26 && <div style={{ alignSelf: "flex-start", maxWidth: 470, padding: "10px 14px", borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.45 }}><div style={{ fontSize: 12, fontWeight: 900, color: "#7C3AED" }}>🤖 AI Bot</div>{typed(f, T.send2 + 26, A2, 2.4)}</div>}
                {thinking && <div style={{ alignSelf: "flex-start", fontSize: 14, fontWeight: 700, color: "#7C3AED", fontStyle: "italic" }}>Ai is generating your answer...</div>}
              </div>
              <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: 52, borderRadius: 12, background: "#fff", border: `2px solid ${draft ? BLUE : LINE}`, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box" }}>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: draft ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{draft || "Type a message..."}</span>
                <span style={{ width: 40, height: 36, borderRadius: 9, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const POPX = 1350 - 24 - 560, POPY = 776 - 100 - 640;

// ───────── integrations ─────────
const Integrations: React.FC<{ f: number }> = ({ f }) => {
  const used = Math.round(1240 + 7 * Math.min(1, lin(f, T.usage, T.usage + 40)));
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, opacity: pr(f, T.back, 10) }}>
      <PageHead title="Branch Integrations" sub="Managed by your organization" />
      {[["ChatGPT", "AI content and curriculum generation", "Healthy", "Connection verified and ready to use."], ["SendGrid", "Transactional and campaign email", "Healthy", "Connection verified and ready to use."], ["Zoom", "Online meetings and live sessions", "Available", "Enabled for this branch; verification is pending."]].map(([n, d, st, note], i) => (
        <div key={n} style={{ position: "absolute", left: 30 + i * 430, top: 116, width: 410, height: 170, borderRadius: 16, background: "#fff", border: `2px solid ${i === 0 ? BLUE : LINE}`, boxShadow: i === 0 ? "0 0 0 4px #C7D2FE" : "none", padding: 20, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 20, fontWeight: 900, color: INK }}>{n}</span><Badge t={st} c={st === "Healthy" ? "#15803D" : "#1D4ED8"} bg={st === "Healthy" ? "#DCFCE7" : "#DBEAFE"} fs={13} dot /></div>
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: GRAY }}>{d}</div>
          <div style={{ marginTop: 18, fontSize: 14, fontWeight: 700, color: "#374151" }}>{note}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 30, top: 310, width: 1270, height: 300, borderRadius: 16, background: "#fff", border: `2px solid ${f >= T.usage - 6 ? BLUE : LINE}`, padding: 22, boxSizing: "border-box", opacity: pr(f, T.back + 20, 10) }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Your branch allowances</div>
        {[["Chat AI assistant", "AI requests", used, 5000], ["Course builder", "AI tokens", 182000, 500000], ["Email send", "Email recipients", 3410, 10000]].map(([n, u, v, max], i) => (
          <div key={n as string} style={{ marginTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: INK }}><span>{n as string} <span style={{ color: GRAY, fontWeight: 600 }}>· {u as string}</span></span><span>{(v as number).toLocaleString()} / {(max as number).toLocaleString()}</span></div>
            <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${(100 * (v as number)) / (max as number)}%`, height: "100%", background: i === 0 ? "#7C3AED" : BLUE }} /></div>
          </div>
        ))}
        <div style={{ marginTop: 22, fontSize: 14, fontWeight: 600, color: GRAY }}>Allowance resets Every month</div>
      </div>
    </div>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.clickMenu - 10, 880, 540, 1.04], [T.tour + 10, 1060, 480, 1.08],
  [S.d2, 960, 520, 1.04], [T.clickCron, 960, 540, 1.0], [T.cronExpr, 1000, 440, 1.08], [S.d4, 1100, 560, 1.06], [S.d5, 1100, 620, 1.06],
  [T.jobCard, 860, 500, 1.08], [T.learner, 960, 540, 1.0], [T.arrive, 1100, 560, 1.06], [T.night, 960, 540, 1.0], [T.clickAi + 10, 1100, 520, 1.06],
  [T.answer, 1100, 540, 1.1], [T.back, 960, 540, 1.0], [T.usage, 960, 620, 1.06], [PAY_START, 960, 540, 1.0],
]).map(calmK);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("All Bots", "Communication")],
  [T.tour, ...MA(TBX + 50 + 210 + 300 + 110 + 50, rowY(0))], [T.tour + 40, ...MA(TBX + 50 + 210 + 300 + 110 + 100 + 70, rowY(0))],
  [T.clickCreate, ...MA(1122, 48)],
  [T.typeName, ...BP(380, 123)], [T.typeDesc, ...BP(380, 211)], [T.saveBot, ...BP(BW - 88, BH - 46)],
  [T.clickCron, ...MA(CRONX, rowY(0))],
  [T.jobName, ...JP(472 + 235, 76 + 47)], [T.cronExpr, ...JP(472 + 235, 76 + 139)], [T.helper, ...JP(472 + 590, 76 + 139)],
  [T.msg, ...JP(472 + 490, 76 + 300)],
  [T.audience, ...JP(472 + 220, 76 + 450)], [T.audience + 50, ...JP(472 + 60, 76 + 450)],
  [T.channels - 8, ...JP(472 + 490, 76 + 541)], [T.channels, ...JP(472 + 200, 76 + 570 + 26)], [T.channels + 14, ...JP(472 + 200, 76 + 570 + 66)],
  [T.createJob, ...JP(472 + 910, JH - 104 - 30)],
  [T.stopHover, ...JP(80, 76 + 16 + 30 + 14 + 80)],
  [T.learner + 20, 1500, 860],
  [T.night + 10, ...MA(900, 500)], [T.clickBubble, ...MA(1350 - 56, 776 - 56)],
  [T.clickAi, ...MA(POPX + 38, POPY + 60 + 10 + 5 * 64 + 22)],
  [T.ask, ...MA(POPX + 260, POPY + 60 + 580 - 40)], [T.send1, ...MA(POPX + 560 - 48, POPY + 60 + 580 - 40)],
  [T.ask2, ...MA(POPX + 260, POPY + 60 + 580 - 40)], [T.send2, ...MA(POPX + 560 - 48, POPY + 60 + 580 - 40)],
  [T.back + 10, ...MA(240, 200)], [T.usage, ...MA(600, 380)],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "All Bots" },
  { at: S.d2, to: T.clickCron, label: "Create a bot" },
  { at: T.clickCron, to: S.d4, label: "Schedule with cron" },
  { at: S.d4, to: S.d5, label: "Write the message" },
  { at: S.d5, to: S.d6, label: "Pick the audience" },
  { at: S.d6, to: T.learner, label: "Stop, restart, edit" },
  { at: T.learner, to: T.night, label: "The bot posts on time" },
  { at: T.night, to: T.back, label: "AI Bot answers at night" },
  { at: T.back, to: PAY_START, label: "Connection and allowances" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = f >= T.learner && f < T.back;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          f >= T.night ? <LandWin f={f} inAt={T.night} url="learner.openroad.example.com/dashboard" learner who="Kim" prog="Class B CDL — Fall 2026" active="Dashboard" main={<AiPopup f={f} />} />
            : <LandWin f={f} inAt={T.learner} url="learner.openroad.example.com/chat" learner who="Kim" prog="Class B CDL — Fall 2026" active="Chat" main={<LearnerCrowd f={f} />} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} branch="Open Road — Dallas" url={f >= T.back ? "academy.skillbnk.com/integrations" : "academy.skillbnk.com/all-bots"}
            active={f >= T.back ? "Integrations" : f >= T.clickMenu ? "All Bots" : "Dashboard"} openGroup={f >= T.back ? undefined : "Communication"}
            main={f >= T.back ? <Integrations f={f} /> : <BotsPage f={f} />}
            overlay={<><BotModal f={f} /><CronModal f={f} /><Toast f={f} at={T.saveBot + 3} text="Bot created successfully!" d={50} /><Toast f={f} at={T.createJob + 3} text="Created job successfully" d={50} /></>} />
        )}
        <Scribble f={f} at={T.cronExpr + 30} d={16} out={T.msg - 4} kind="ring" x={JP(472 + 235, 0)[0]} y={JP(0, 76 + 139)[1]} w={500} h={64} seed={7} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};

// ───────── hook (story: the Monday road) ─────────
const HK = { reza: cue("h0", "reza"), monday: cue("h0", "monday"), types: cue("h0", "types"), two: cue("h0", "two"), night: cue("h0", "night"), ask: cue("h0", "ask"), wait: cue("h0", "wait"), morning: cue("h0", "morning") };
const ROADY = 760;
const Truck: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <div style={{ position: "absolute", left: x, top: ROADY - 150 + Math.sin(f / 3) * 1.5, width: 360, height: 160 }}>
    <div style={{ position: "absolute", left: 0, top: 10, width: 240, height: 110, borderRadius: 8, background: "linear-gradient(180deg,#F8FAFC,#CBD5E1)", border: "3px solid #94A3B8" }}><div style={{ position: "absolute", left: 18, top: 34, fontSize: 24, fontWeight: 900, color: "#1D4ED8", letterSpacing: 2 }}>OPEN ROAD</div></div>
    <div style={{ position: "absolute", left: 246, top: 30, width: 100, height: 90, borderRadius: "10px 30px 8px 8px", background: "linear-gradient(180deg,#DC2626,#991B1B)" }}><div style={{ position: "absolute", left: 50, top: 12, width: 38, height: 30, borderRadius: "4px 16px 4px 4px", background: "#BAE6FD" }} /></div>
    {[40, 180, 300].map((wx) => <div key={wx} style={{ position: "absolute", left: wx, top: 110, width: 44, height: 44, borderRadius: 22, background: "#0F172A", border: "6px solid #475569", boxSizing: "border-box", transform: `rotate(${f * 20}deg)` }}><div style={{ width: 4, height: 32, margin: "0 auto", background: "#94A3B8" }} /></div>)}
  </div>
);
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const night = lin(f, HK.night - 10, HK.night + 10) * (1 - lin(f, HK.morning, HK.morning + 16));
  const dawn = lin(f, HK.morning - 4, HK.morning + 16);
  const roadShift = (f * 14) % 120;
  const signs = ["MON 7:00 · Oct 5", "MON 7:00 · Oct 12", "MON 7:00 · Oct 19", "MON 7:00 · Oct 26"];
  const signX = (k: number) => 1920 - (f - (HK.monday + k * 22)) * 26;
  const typedCount = signs.filter((_, k) => signX(k) < 760).length;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${night > 0.5 ? "#020617" : "#0B1A3A"} 0%, ${dawn > 0 ? `rgba(251,146,60,${0.7 * dawn})` : "#0F2350"} 70%)` }} />
      <Backdrop f={f} warm={dawn * 0.4} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        {/* title */}
        <div style={{ position: "absolute", left: 120, top: 90, opacity: pr(f, HK.reza - 6, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#93C5FD" }}>OPEN ROAD CDL ACADEMY</div>
          <div style={{ marginTop: 6, fontSize: 60, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.reza - 4, "Reza's Monday routine.", 0.8)}</div>
        </div>
        {/* stars + moon at night, sun at dawn */}
        {night > 0 && Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 211) % 1900, top: 40 + ((i * 97) % 420), width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: night * (0.4 + 0.6 * Math.abs(Math.sin(f / 10 + i))) }} />)}
        <div style={{ position: "absolute", left: 1620, top: 120, width: 110, height: 110, borderRadius: 55, background: "#F1F5F9", boxShadow: "0 0 60px #F1F5F9AA", opacity: night }}><div style={{ position: "absolute", left: 30, top: -8, width: 100, height: 100, borderRadius: 50, background: "#020617" }} /></div>
        <div style={{ position: "absolute", left: 1560, top: ROADY - 120 * dawn, width: 200, height: 200, borderRadius: 100, background: "radial-gradient(circle,#FDE68A,#F97316)", boxShadow: "0 0 120px #F97316", opacity: dawn }} />
        {/* road */}
        <div style={{ position: "absolute", left: 0, top: ROADY, width: 1920, height: 70, background: "#1E293B", borderTop: "5px solid #475569" }}>
          <div style={{ position: "absolute", left: -roadShift, top: 30, width: 2100, height: 8, background: "repeating-linear-gradient(90deg,#FBBF24 0 60px,transparent 60px 120px)" }} />
        </div>
        {/* Monday signposts passing, each one = the same reminder typed again */}
        {signs.map((s, k) => {
          const x = signX(k);
          if (x > 1920 || x < -300 || f < HK.monday) return null;
          return (
            <div key={s} style={{ position: "absolute", left: x, top: ROADY - 210, transform: "scale(0.85)", transformOrigin: "50% 100%", opacity: 0.9 }}>
              <div style={{ width: 230, padding: "12px 14px", borderRadius: 10, background: "#166534", border: "4px solid #F8FAFC", color: "#F8FAFC", fontSize: 20, fontWeight: 900, textAlign: "center" }}>{s}</div>
              <div style={{ width: 8, height: 120, margin: "0 auto", background: "#94A3B8" }} />
            </div>
          );
        })}
        <Truck x={300} f={f} />
        {/* two class chats receiving the same hand-typed message */}
        <div style={{ position: "absolute", left: 760, top: 220, width: 760, opacity: pr(f, HK.types - 6, 10) * (1 - lin(f, HK.night - 10, HK.night)) }}>
          {["Class B — Evening", "Class A — Evening"].map((c, i) => (
            <div key={c} style={{ marginTop: i ? 14 : 0, padding: "14px 18px", borderRadius: 14, background: "#0F172A", border: `2px solid ${f >= HK.two + i * 10 ? "#60A5FA" : "#334155"}`, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 120, fontSize: 16, fontWeight: 900, color: "#93C5FD" }}>{c}</span>
              <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>{f >= HK.two + i * 10 ? "Yard schedule this week… bring your logbook." : typed(f, HK.types, "Yard schedule this week…", 0.9)}</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#FBBF24" }}>×{Math.max(1, typedCount)}</span>
            </div>
          ))}
        </div>
      </Stage>
      {/* night questions hang on a "waiting" line */}
      {f >= HK.ask - 2 && (
        <div style={{ position: "absolute", left: 760, top: 240, width: 1000 }}>
          {[["Kim", "How many psi for the air brake check?"], ["Luis", "Do I need the logbook Tuesday?"], ["Ana", "What's the coupling order again?"], ["Tom", "Is the quiz open-book?"]].map(([w, q], i) => {
            const at = HK.ask + i * 6;
            const drop = pr(f, at, 12);
            const hrs = f >= HK.wait ? Math.min(8, Math.floor(lin(f, HK.wait, HK.morning + 10) * 8)) : 0;
            return (
              <div key={w} style={{ position: "relative", marginTop: 14, height: 76, opacity: drop, transform: `translateY(${(1 - drop) * -120}px)` }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 640, padding: "12px 16px", borderRadius: 14, background: "#F8FAFC", fontSize: 19, fontWeight: 800, color: "#111827" }}><span style={{ color: "#2563EB" }}>{w}:</span> {q}</div>
                <div style={{ position: "absolute", left: 660, top: 14, width: 300, height: 22, borderRadius: 11, background: "#1E293B", overflow: "hidden" }}><div style={{ width: `${(hrs / 8) * 100}%`, height: "100%", background: "linear-gradient(90deg,#F59E0B,#EF4444)" }} /></div>
                <div style={{ position: "absolute", left: 660, top: 42, fontSize: 15, fontWeight: 800, color: "#FCA5A5" }}>{hrs ? `unanswered · ${hrs}h` : "11:42 pm"}</div>
              </div>
            );
          })}
        </div>
      )}
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.reza, "Reza runs a truck driving school."], [HK.monday, "Every Monday at 7…", "Every Monday"], [HK.types, "…the same reminder, typed by hand.", "same reminder"], [HK.night, "Every night, students ask questions…", "Every night"], [HK.wait, "…that wait until morning.", "wait until morning"]]} />
    </AbsoluteFill>
  );
};

const PY = { time: cue("p12", "time"), midnight: cue("p12", "midnight"), mondays: cue("p12", "mondays") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    {[["🤖 Monday reminder", "Sent · Mon 7:00 am", PY.time], ["🤖 AI Bot", "Answered · 11:43 pm", PY.midnight]].map(([t, s, at], i) => (
      <div key={t as string} style={{ position: "absolute", left: 360 + i * 620, top: 240, width: 580, height: 200, borderRadius: 24, background: "#fff", boxShadow: "0 40px 120px #000C", padding: 30, boxSizing: "border-box", opacity: pr(f, (at as number) - 8, 12) }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>{t as string}</div>
        <div style={{ marginTop: 14 }}><Badge t={s as string} c="#15803D" bg="#DCFCE7" fs={18} dot /></div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, textAlign: "center", fontSize: 44, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.mondays - 4, 14) }}>Reza gets his Mondays back</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.night, "riser", 0.25); add(HK.morning, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 12; i++) add(T.typeName + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  for (let i = 0; i < 12; i++) add(T.msg + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.saveBot + 4, "chime", 0.45); add(T.createJob + 4, "chime", 0.5); add(T.arrive + 4, "pop", 0.45); add(T.answer, "ding", 0.35); add(T.send2 + 26, "pop", 0.35);
  add(T.learner, "whoosh", 0.35); add(T.night, "whoosh", 0.25); add(T.back, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PY.mondays, "chime", 0.5);
  return a;
})();

export const ChatBotsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="botsstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.night, T.back]} />;
};
