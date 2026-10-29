import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { StepChipL, PortalTagL, MA, BLUE, INK, GRAY, LINE, Avatar } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, StoryMain, Fx } from "./storyShell";
import { LandFull, fitKey, fitPts } from "./screenKit";

/**
 * UserManualStoryVideo — DEEP (sheet serial 62, Documentation Viewer). Story: Rosa, Crestview Pharmacy Technician School (fictional).
 * Verified in code: SB-Branch shared/Navbar ("Branch Manual" header button → /docs), app/(authenticated)/docs/UserManual.tsx (DocsShell,
 * title "Branch User Manual", subtitle "From here you can see all instructions to use Branch.", per-page comments via GlobalComment
 * "Add Comment" / "Add Reply"); libs/shared/ui/docs DocsShell + DocsTree + types (back arrow "Back to dashboard", search "Search documents,
 * folders, and content...", "N results found", folder (amber) / page results, Enter opens the first result, 'No results found for "…"' +
 * "Try different keywords or check spelling", welcome "Welcome to the user manual" / "Pick a topic from the list to start reading.", page
 * header "Last updated by <name> · <role>" + "Last updated MMM D, YYYY · h:mm A", nested folder tree). SB-Company "Company User Manual"
 * (/docs/company); SB-Learner "User Manual" ("From here you can see all instructions to use skillBNK."). Folder / page names are example
 * content (manual pages are published by skillBNK).
 * Voice: python3 generate-voice-story.py src/UserManualStoryVideo.tsx public/manualstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "p8"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 470, d1: 260, d2: 230, d3: 300, d4: 330, d5: 230, d6: 300, d7: 300, p8: 250,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = [];
// @WT-BEGIN
const WT: Record<string, number[]> = {};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Rosa manages a pharmacy technician school. Every month she hires new staff. And every hour, someone asks her: how do I approve a payment? Where do I add a session? Her own work keeps starting over.",
  d1: "In skillbank, the answers are built in. In the header, branch manual opens the user manual, right inside the portal.",
  d2: "On the left, the contents: a folder for every part of the portal, with step-by-step pages inside.",
  d3: "Pick a page, and the guide opens on the right, with who last updated it, and when. Every step is written out, in order.",
  d4: "Or just search. Type approve payment, and matching folders and pages appear, with a count of results. Press enter, and the first one opens.",
  d5: "If a search finds nothing, it says so, and suggests different keywords.",
  d6: "Under every page, there's a comment thread. Staff can ask a question, or add a tip, right where the instructions are.",
  d7: "The company portal has its own company user manual, and learners get a user manual in their portal too.",
  p8: "New staff find answers on their own. Rosa gets her hours back. And the tenth new hire is as easy as the first.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  btn: cue("d1", "manual", -6),
  page: cue("d1", "opens", 4),
  tree: S.d2,
  folder: cue("d2", "folder", -4),
  pages: cue("d2", "pages", -6),
  pick: cue("d3", "pick", -2),
  meta: cue("d3", "who", -4),
  steps: cue("d3", "every", -4),
  search: cue("d4", "search", -4),
  type: cue("d4", "type", -2),
  results: cue("d4", "count", -6),
  enter: cue("d4", "enter", -2),
  none: S.d5,
  noneType: S.d5 + 4,
  comments: S.d6,
  ask: cue("d6", "ask", -4),
  tip: cue("d6", "tip", -4),
  company: S.d7,
  learner: cue("d7", "learners", -4),
};
const CLICKS = [T.btn, T.folder, T.pick, T.search, T.enter, T.ask + 30];

// ───────── manual content (example pages) ─────────
type Node = { t: string; kids?: string[] };
const TREE: Node[] = [
  { t: "Getting Started", kids: ["Your branch dashboard", "Switching branches"] },
  { t: "Students Management", kids: ["Approve a pending member", "Move a learner to inactive"] },
  { t: "Courses & Programs", kids: ["Create a program", "Add a session"] },
  { t: "Billing & Certificate", kids: ["Approve a payment", "Issue a refund", "Generate a certificate"] },
  { t: "Attendance", kids: ["Clock in and out", "Approve a day off"] },
  { t: "Communication", kids: ["Start a chat", "Post in the community"] },
];
const CO_TREE: Node[] = ["Getting Started", "Branch Management", "Courses & Programs", "Staff Management", "Website Builder", "Integrations"].map((t) => ({ t, kids: [] }));
const LE_TREE: Node[] = ["Getting Started", "My Courses", "Assignments", "Mock Interviews", "Calendar", "Payments"].map((t) => ({ t, kids: [] }));
const openFolder = (f: number) => (f >= T.enter + 4 ? 3 : f >= T.folder ? 2 : -1);
const activePage = (f: number) => (f >= T.enter + 4 ? "Approve a payment" : f >= T.pick ? "Add a session" : "");
const STEPS_ADD = ["Open Courses & Programs, then Programs.", "Choose the program, and open its Sessions tab.", "Click Add Session, and give it a name, like Evening — Spring 2027.", "Set the start date, end date, and class days.", "Save. Learners can now pick the new session when they enroll."];
const STEPS_PAY = ["Open Billing & Certificate, then Program Payments.", "Filter by Pending to see payments waiting for review.", "Open the payment, and check the amount, method, and receipt.", "Set the status to Approved, and add a note if needed.", "Save. The learner sees the payment as approved in their history."];

// ───────── the manual page ─────────
const TREE_W = 320;
const Manual: React.FC<{ f: number; title?: string; sub?: string; tree?: Node[] }> = ({ f, title = "Branch User Manual", sub = "From here you can see all instructions to use Branch.", tree = TREE }) => {
  const of = openFolder(f), ap = activePage(f);
  const q1 = f >= T.type ? typed(f, T.type + 2, "approve payment", 0.5) : "";
  const inNone = f >= T.none && f < T.comments;
  const q = inNone ? typed(f, T.noneType, "inventory scanner", 0.6) : f < T.enter + 4 ? q1 : "";
  const showRes = q.length > 2 && (inNone || f < T.enter + 4);
  const steps = ap === "Approve a payment" ? STEPS_PAY : STEPS_ADD;
  const hl = (a: number, b: number) => f >= a && f < b;
  const contentScroll = f >= T.comments ? 260 * pr(f, T.comments, 24) + 170 * pr(f, T.tip, 20) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F8FAFC", fontFamily: FONT }}>
      {/* header */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 0, height: 84, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 0, top: 14, display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 800, color: INK }}><span style={{ fontSize: 20, color: GRAY }}>←</span>{title}</div>
        <div style={{ position: "absolute", left: 0, top: 50, fontSize: 14, color: GRAY }}>{sub}</div>
        {ap && (
          <div style={{ position: "absolute", right: 0, top: 18, display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 12, background: hl(T.meta, T.steps) ? "#EEF2FF" : "transparent", boxShadow: hl(T.meta, T.steps) ? "0 0 0 3px #C7D2FE" : "none", opacity: pr(f, T.pick + 4, 10) }}>
            <Avatar t="JM" s={34} c1="#6366F1" c2="#4338CA" />
            <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.45 }}><div>Last updated by <b style={{ color: INK }}>Jamie Morales</b> · Support</div><div>Last updated <b style={{ color: INK }}>{ap === "Approve a payment" ? "Oct 21, 2026 · 3:40 PM" : "Oct 14, 2026 · 10:12 AM"}</b></div></div>
          </div>
        )}
      </div>
      {/* search */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 100, zIndex: 4 }}>
        <div style={{ height: 44, borderRadius: 12, background: "#fff", boxShadow: `0 0 0 ${hl(T.search, T.enter) || inNone ? 2 : 1}px ${hl(T.search, T.enter) || inNone ? "#93A5F5" : LINE}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, fontSize: 14, color: q ? INK : "#9CA3AF" }}>⌕<span style={{ flex: 1 }}>{q || "Search documents, folders, and content..."}</span>{q && <span style={{ color: GRAY }}>✕</span>}</div>
        {showRes && (
          <div style={{ marginTop: 4, borderRadius: 12, background: "#fff", boxShadow: "0 12px 30px #0f172a22, 0 0 0 1px #E5E7EB", overflow: "hidden" }}>
            {inNone ? (
              <div style={{ padding: 18, textAlign: "center" }}><div style={{ fontSize: 14, color: INK }}>No results found for "{q}"</div><div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>Try different keywords or check spelling</div></div>
            ) : (
              <>
                <div style={{ padding: "8px 12px", borderBottom: `1px solid ${LINE}`, fontSize: 12, color: GRAY, background: hl(T.results, T.enter) ? "#FEF3C7" : "transparent" }}>3 results found</div>
                {[["📄", "Approve a payment", "Billing & Certificate"], ["📁", "Billing & Certificate", "Folder"], ["📄", "Issue a refund", "Billing & Certificate"]].map(([ic, t, s], i) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: i === 0 && f >= T.enter - 10 ? "#F1F5F9" : "transparent" }}>
                    <span style={{ color: ic === "📁" ? "#F59E0B" : BLUE }}>{ic === "📁" ? "▰" : "▤"}</span>
                    <div><div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{t}</div><div style={{ fontSize: 12, color: GRAY }}>{s}</div></div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      {/* tree */}
      <div style={{ position: "absolute", left: 24, top: 160, width: TREE_W, bottom: 14, borderRadius: 16, background: "#fff", boxShadow: `0 0 0 ${hl(T.tree, T.pick) ? 2 : 1}px ${hl(T.tree, T.pick) ? "#93A5F5" : LINE}`, padding: 12, boxSizing: "border-box", overflow: "hidden" }}>
        {tree.map((n, i) => (
          <div key={n.t}>
            <div style={{ height: 36, display: "flex", alignItems: "center", gap: 10, padding: "0 8px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: INK, background: hl(T.folder - 6, T.folder + 10) && i === 2 ? "#F1F5F9" : "transparent", opacity: pr(f, T.page + 4 + i * 3, 8) }}>
              <span style={{ color: GRAY, width: 10 }}>{of === i ? "⌄" : "›"}</span><span style={{ color: "#F59E0B" }}>▰</span>{n.t}
            </div>
            {of === i && (
              <div style={{ marginLeft: 14, paddingLeft: 8, borderLeft: `1px solid ${LINE}` }}>
                {n.kids!.map((k) => <div key={k} style={{ height: 32, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", borderRadius: 8, fontSize: 13.5, fontWeight: ap === k ? 700 : 500, color: ap === k ? BLUE : "#374151", background: ap === k ? "#EEF2FF" : hl(T.pages, T.pick) ? "#F8FAFC" : "transparent" }}><span style={{ color: ap === k ? BLUE : "#94A3B8" }}>▤</span>{k}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* content */}
      <div style={{ position: "absolute", left: 24 + TREE_W + 16, right: 24, top: 160, bottom: 14, borderRadius: 16, background: "#fff", boxShadow: `0 0 0 1px ${LINE}`, overflow: "hidden" }}>
        {!ap ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "#EEF2FF", color: BLUE, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>📖</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Welcome to the user manual</div>
            <div style={{ fontSize: 14, color: GRAY }}>Pick a topic from the list to start reading.</div>
            <div style={{ marginTop: 6, padding: "8px 14px", borderRadius: 10, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700 }}>{tree[0].kids?.[0] ?? "Welcome to skillBNK"}</div>
          </div>
        ) : (
          <div style={{ position: "absolute", left: 32, right: 32, top: 28 - contentScroll, opacity: pr(f, ap === "Approve a payment" ? T.enter + 4 : T.pick + 2, 10) }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>{ap}</div>
            <div style={{ marginTop: 8, fontSize: 15, color: GRAY }}>{ap === "Approve a payment" ? "Review a learner's payment and mark it approved, so their balance is correct." : "Add a new session to a program, so learners can choose it when they enroll."}</div>
            {steps.map((s, i) => (
              <div key={s} style={{ marginTop: 16, display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 12px", borderRadius: 10, background: hl(T.steps + i * 10, T.steps + i * 10 + 14) ? "#F5F7FF" : "transparent" }}>
                <span style={{ width: 30, height: 30, borderRadius: 15, background: "#EEF2FF", color: BLUE, fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 16, color: "#1F2937", lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, height: 150, borderRadius: 12, background: "linear-gradient(135deg,#EEF2FF,#F8FAFC)", border: `1px dashed #C7D2FE`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#6366F1", fontWeight: 700 }}>Screenshot: {ap === "Approve a payment" ? "Payment Details" : "Add Session"}</div>
            {/* comments */}
            <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: INK, marginBottom: 12 }}>Comments</div>
              {f >= T.ask && <Comment f={f} at={T.ask} who="Ken Ito" c="#0EA5E9" text={typed(f, T.ask + 4, "Do I approve bank transfers before the money shows in our account?", 1.4)} />}
              {f >= T.tip && <div style={{ marginLeft: 42 }}><Comment f={f} at={T.tip} who="Rosa Delgado" c="#16A34A" text={typed(f, T.tip + 4, "Tip: wait until it clears, then approve. Add the bank reference in the note.", 1.4)} reply /></div>}
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <div style={{ flex: 1, height: 44, borderRadius: 10, border: `1px solid ${LINE}`, background: "#F8FAFC" }} />
                <span style={{ height: 44, padding: "0 16px", borderRadius: 10, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", boxShadow: hl(T.ask + 24, T.ask + 40) ? "0 0 0 4px #C7D2FE" : "none" }}>Add Comment</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const Comment: React.FC<{ f: number; at: number; who: string; c: string; text: string; reply?: boolean }> = ({ f, at, who, c, text, reply }) => (
  <div style={{ display: "flex", gap: 10, marginBottom: 12, opacity: pr(f, at, 8) }}>
    <Avatar t={who.split(" ").map((w) => w[0]).join("")} s={32} c1={c} c2={c} />
    <div style={{ flex: 1, padding: "10px 12px", borderRadius: 12, background: reply ? "#F0FDF4" : "#F8FAFC", border: `1px solid ${LINE}` }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: INK }}>{who} <span style={{ fontWeight: 500, color: GRAY }}>· just now</span></div>
      <div style={{ fontSize: 14, color: "#374151", marginTop: 2 }}>{text}</div>
      <div style={{ fontSize: 12, color: BLUE, fontWeight: 700, marginTop: 4 }}>Add Reply</div>
    </div>
  </div>
);
const Home: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#F5F7FB", fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 24, top: 18, fontSize: 24, fontWeight: 800, color: INK }}>Branch workspace</div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 24 + (i % 2) * 660, top: 66 + Math.floor(i / 2) * 318, width: 642, height: 300, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}` }} />)}
  </div>
);

// ───────── demo ─────────
type Sc = "home" | "branch" | "company" | "learner";
const scAt = (f: number): Sc => (f < T.page ? "home" : f < T.company ? "branch" : f < T.learner ? "company" : "learner");
const BTN_X = 1140;
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.btn, 1200, 300, 1.12], [T.page + 6, 960, 540, 1.0], [T.tree, 640, 560, 1.12], [T.pick, 900, 560, 1.06],
  [T.meta, 1340, 320, 1.15], [T.steps, 1100, 580, 1.1], [T.search, 960, 380, 1.12], [T.enter + 6, 1000, 560, 1.05], [T.none, 960, 380, 1.12],
  [T.comments + 10, 1150, 640, 1.12], [T.company, 960, 540, 1.0], [T.learner, 960, 540, 1.0], [PAY_START, 960, 540, 1.0],
]).map(fitKey);
const TREE_Y = (i: number, kid = -1) => 160 + 12 + i * 36 + 18 + (kid >= 0 ? 18 + kid * 32 + 16 : 0);
const CUR: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.btn - 8, ...MA(BTN_X, -30)], [T.btn, ...MA(BTN_X, -30)],
  [T.folder, ...MA(24 + 140, TREE_Y(2))], [T.pick, ...MA(24 + 150, TREE_Y(2, 1) - 4)],
  [T.meta, ...MA(1200, 40)], [T.steps + 20, ...MA(700, 330)],
  [T.search, ...MA(500, 122)], [T.enter, ...MA(400, 122 + 30 + 34 + 20)],
  [T.none + 10, ...MA(600, 122)], [T.ask + 30, ...MA(1270, 560)], [T.company + 10, 1560, 880],
]);
const STEPS = [
  { at: T.btn, to: T.tree, label: "Branch manual" },
  { at: T.tree, to: T.pick, label: "Contents" },
  { at: T.pick, to: T.search, label: "Read a guide" },
  { at: T.search, to: T.none, label: "Search" },
  { at: T.none, to: T.comments, label: "Nothing found? It says so" },
  { at: T.comments, to: T.company, label: "Ask and share tips" },
  { at: T.company, to: PAY_START, label: "Company and learner manuals" },
];
const Demo: React.FC<{ f: number }> = ({ f }) => {
  const sc = scAt(f);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#F8FAFC" }}>
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]} calm={0.999}>
        {sc === "home" || sc === "branch" ? (
          <LandFull f={f} at={DEMO_START} url={sc === "home" ? "crestview.skillbnk.com/dashboard" : f >= T.enter + 4 ? "crestview.skillbnk.com/docs/billing-certificate/approve-a-payment" : f >= T.pick ? "crestview.skillbnk.com/docs/courses-programs/add-a-session" : "crestview.skillbnk.com/docs"} branch="Crestview Pharmacy Technician School" active="Dashboard"
            main={sc === "home" ? <><Home />{f >= T.btn - 20 && <div style={{ position: "absolute", left: BTN_X - 74, top: -50, width: 148, height: 40, borderRadius: 10, boxShadow: "0 0 0 4px #C7D2FE", pointerEvents: "none" }} />}</> : <Manual f={f} />} />
        ) : sc === "company" ? (
          <LandFull f={f} at={T.company} url="admin.skillbnk.com/docs" company="Crestview Health Education Group" active="Dashboard" main={<Manual f={T.page + 30} tree={CO_TREE} title="Company User Manual" sub="From here you can see all instructions to use Company." />} />
        ) : (
          <LandFull f={f} at={T.learner} url="learner.skillbnk.com/docs" learner who="KI" prog="Pharmacy Technician — Evening" active="" main={<Manual f={T.page + 30} tree={LE_TREE} title="User Manual" sub="From here you can see all instructions to use skillBNK." />} />
        )}
        <Cursor f={f} pts={fitPts(CUR)} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.company - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.company + 4} out={T.learner - 4} text="Company portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook: the focus bar that keeps resetting ─────────
const HK = { hires: cue("h0", "hires"), hour: cue("h0", "hour"), approve: cue("h0", "approve"), session: cue("h0", "session"), over: cue("h0", "over") };
const QS: [string, number][] = [["How do I approve a payment?", 0], ["Where do I add a session?", 1], ["How do I move a learner to inactive?", 2], ["Where's the certificate button?", 3]];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.session - 10, HK.over + 30);
  const hits = [HK.approve, HK.session, HK.session + 40, HK.over - 10];
  const lastHit = hits.filter((h) => f >= h).pop() ?? HK.hour - 40;
  const prog = Math.min(0.8, Math.max(0, (f - lastHit) / 160));
  const resets = hits.filter((h) => f >= h).length;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 60, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#34D399" }}>CRESTVIEW PHARMACY TECHNICIAN SCHOOL</div>
          <div style={{ marginTop: 6, fontSize: 56, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, 6, "3 new staff this month.", 0.7)}</div>
        </div>
        {/* Rosa's own work: the focus bar */}
        <div style={{ position: "absolute", left: 160, top: 260, width: 1600, opacity: pr(f, HK.hires, 10) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 900, color: "#CBD5E1" }}><span>Rosa's monthly report</span><span style={{ color: resets ? "#F87171" : "#94A3B8" }}>restarted ×{resets}</span></div>
          <div style={{ marginTop: 14, height: 48, borderRadius: 24, background: "#1E293B", border: "3px solid #334155", overflow: "hidden" }}><div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 24, background: "linear-gradient(90deg,#34D399,#10B981)" }} /></div>
          {hits.map((h, i) => f >= h && f < h + 12 && <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 50, height: 48, borderRadius: 24, background: "#EF444466" }} />)}
        </div>
        {/* questions flying in */}
        {QS.map(([q], i) => {
          const a = hits[i];
          if (f < a - 14) return null;
          const k = pr(f, a - 14, 14);
          return <div key={q} style={{ position: "absolute", left: 200 + (i % 2) * 820 + (1 - k) * (i % 2 ? 400 : -400), top: 470 + Math.floor(i / 2) * 190, width: 700, height: 150, boxSizing: "border-box", borderRadius: 22, background: "#F8FAFC", border: "4px solid #F59E0B", padding: "22px 26px", opacity: k, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`, boxShadow: "0 18px 40px #0009" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#B45309", letterSpacing: 2 }}>NEW STAFF · {["MONDAY 9:10", "MONDAY 10:25", "MONDAY 11:40", "MONDAY 1:05"][i]}</div>
            <div style={{ marginTop: 10, fontSize: 36, fontWeight: 900, color: INK }}>{q}</div>
          </div>;
        })}
      </Stage>
      <Stamp f={f} at={HK.over + 2} x={960} y={200} text="STARTING OVER… AGAIN" size={56} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.hires, "Every month: new staff.", "new staff"], [HK.approve, "How do I approve a payment?", "approve a payment"], [HK.session, "Where do I add a session?", "add a session"], [HK.over, "Her own work keeps starting over.", "starting over"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { own: cue("p8", "own"), hours: cue("p8", "hours"), tenth: cue("p8", "tenth") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(52,211,153,0.2), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 0, top: 230, width: 1920, display: "flex", justifyContent: "center", gap: 30 }}>
      {["Ask the manual", "Read the steps", "Do it yourself"].map((t, i) => <div key={t} style={{ width: 400, height: 170, borderRadius: 24, background: "#F8FAFC", border: "5px solid #34D399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: INK, opacity: pr(f, PY.own - 6 + i * 6, 10) }}>{t}</div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 480, width: 1920, textAlign: "center", fontSize: 46, fontWeight: 900, color: "#F8FAFC", opacity: pr(f, PY.hours - 4, 12) }}>Rosa gets her hours back.</div>
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, textAlign: "center", fontSize: 34, fontWeight: 800, color: "#A7F3D0", opacity: pr(f, PY.tenth - 4, 12) }}>The 10th new hire is as easy as the first.</div>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, textAlign: "center", fontSize: 22, fontWeight: 700, color: "#94A3B8", opacity: pr(f, PY.tenth + 6, 12) }}>Example: 6 questions a day × 10 minutes each ≈ 5 hours back every week</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  [HK.approve, HK.session, HK.session + 40, HK.over - 10].forEach((h) => { add(h - 12, "swish", 0.3); add(h, "thud", 0.25); });
  add(HK.over + 2, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 8; i++) add(T.type + 2 + i * 4, ["key0", "key1", "key2"][i % 3], 0.13);
  add(T.enter + 4, "pop", 0.35); add(T.tip + 4, "ding", 0.3); add(T.company, "whoosh_s", 0.3); add(T.learner, "whoosh_s", 0.3);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.hours, "chime", 0.5);
  return a;
})();

export const UserManualStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="manualstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.page, T.company, T.learner]} finish={false} />;
};
