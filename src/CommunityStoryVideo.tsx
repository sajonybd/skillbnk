import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, Fx } from "./storyShell";

/**
 * CommunityStoryVideo — DEEP (sheet serial 44, ~2.5 min). Story: Marco Reyes, Volt Line Electrical Apprenticeship (fictional).
 * Verified in code: SB-Branch pageList/Community + SB-Learner components/Community. Search "Press Enter for search a post", Filters →
 * "Filter Category": Saved Posts / Reported Posts / My Posts / Recent / Last Week / Last Month, "Filtered by Tags", Clear Filters.
 * CreatePost: "Share your thoughts with the community", Create Post, "Enter title for your post", "Write your post here...", Programs
 * ("All Programs"), Sessions ("All Sessions"), image upload ("File uploaded successfully"), toast "Post created successfully".
 * CommunityPosts: reactions ❤️ 👍 🙏 😂 🥰 😯, Like / Comment / Repost / Send, "Type your comment", menu Save This Post / Copy This Link /
 * Edit this post / Delete this post / Report This Post, "Post deleted successfully", "This action cannot be undone.". ReportPost reasons:
 * Spam or Scam, Hate Speech or Discrimination, Bullying or Harassment, Privacy Violation, Impersonation, Other; "Leave a note...".
 * Side: Trending Tags, Top Contributors (Comments / React), Upcoming Events (Interested). SharePost "Or share with link".
 * Voice: python3 generate-voice-story.py src/CommunityStoryVideo.tsx public/communitystory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "p11"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 302,
  d1: 283,
  d2: 331,
  d3: 112,
  d4: 238,
  d5: 170,
  d6: 205,
  d7: 300,
  d8: 269,
  d9: 271,
  d10: 224,
  p11: 130,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "p11"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 16, 27, 32, 48, 79, 81, 90, 100, 108, 118, 135, 137, 142, 150, 166, 169, 174, 178, 203, 205, 211, 217, 239, 244, 252, 264, 271],
  d1: [2, 20, 38, 48, 55, 59, 63, 68, 74, 83, 93, 133, 133, 138, 142, 169, 169, 195, 199, 225, 231, 237, 245, 250, 253],
  d2: [2, 15, 28, 36, 57, 71, 82, 86, 91, 116, 125, 125, 133, 149, 161, 174, 184, 204, 207, 213, 217, 221, 226, 231, 241, 249, 268, 274, 279, 283, 292],
  d3: [2, 18, 26, 33, 40, 45, 54, 58, 61, 67, 73, 74],
  d4: [2, 24, 29, 35, 67, 67, 76, 91, 97, 103, 132, 132, 141, 147, 158, 169, 184, 190, 198],
  d5: [2, 17, 22, 31, 37, 43, 55, 73, 79, 84, 88, 91, 120, 120],
  d6: [2, 11, 24, 34, 40, 52, 82, 88, 107, 111, 124, 128, 135, 154, 159, 166, 174, 181],
  d7: [2, 16, 25, 30, 40, 53, 84, 88, 100, 110, 137, 142, 149, 159, 166, 172, 213, 225, 232, 239, 249, 258, 268],
  d8: [2, 9, 19, 32, 57, 61, 69, 102, 102, 108, 127, 132, 139, 149, 165, 171, 198, 214, 214, 227, 232, 240],
  d9: [2, 30, 39, 48, 77, 85, 93, 102, 111, 141, 141, 155, 169, 198, 199, 204, 226, 232, 235, 249],
  d10: [2, 21, 40, 51, 55, 67, 76, 82, 122, 138, 139, 145, 153, 162, 170],
  p11: [2, 13, 19, 26, 37, 40, 48, 54, 80, 82, 87, 93, 102],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Marco runs an electrician apprenticeship. His apprentices meet once a week. The other six days, they're on their own, and by week six, some simply stop showing up.",
  d1: "In skillbank, Community gives them a place to talk between classes. Posts in the middle. Trending tags, top contributors, and upcoming events on the side.",
  d2: "Marco starts a post. A title, a few lines, a photo from Saturday's lab, and a tag. He can keep it to one program and session, or share it with everyone.",
  d3: "He posts it, and it's live at the top of the feed.",
  d4: "Now, the learner side. Jordan opens Community in his portal. He reacts to Marco's post, and leaves a comment.",
  d5: "Then he asks his own question, with a photo of his panel, tagged panels.",
  d6: "Two classmates answer within the hour. One reposts it for the morning group, and another shares the link.",
  d7: "Back in the training provider portal, Marco sees panels trending, and Jordan among the top contributors. Saturday's open lab shows under upcoming events.",
  d8: "To find anything fast, he searches posts, clicks a tag, or filters by saved, my posts, recent, last week, or last month.",
  d9: "Moderation is built in. Learners can report a post. Marco filters reported posts, sees the reason, and deletes the spam.",
  d10: "On Jordan's side, his question now has answers, reactions, and a reply from Marco himself.",
  p11: "Six days a week, the class keeps talking. And they keep showing up.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "community", -6),
  tourPosts: cue("d1", "posts", -4),
  tourSide: cue("d1", "trending", -4),
  clickCreate: cue("d2", "starts", -4),
  typeTitle: cue("d2", "title", -4),
  typeBody: cue("d2", "lines", -4),
  photo: cue("d2", "photo", -2),
  tag: cue("d2", "tag", -2),
  pickProgram: cue("d2", "program", -4),
  pickSession: cue("d2", "session", -2),
  clickPost: cue("d3", "posts", -4),
  learner: cue("d4", "learner", -8),
  clickReact: cue("d4", "reacts", -4),
  pickEmoji: cue("d4", "post", 0),
  clickComment: cue("d4", "comment", -8),
  sendComment: cue("d4", "comment", 14),
  clickCreateL: cue("d5", "asks", -4),
  postL: cue("d5", "panels", 6),
  answers: cue("d6", "answer", -4),
  repost: cue("d6", "reposts", -2),
  share: cue("d6", "shares", -2),
  back: S.d7,
  trend: cue("d7", "trending", -4),
  contrib: cue("d7", "contributors", -4),
  events: cue("d7", "events", -4),
  search: cue("d8", "searches", -4),
  clickTag: cue("d8", "tag", -2),
  clickFilters: cue("d8", "filters", -4),
  filtersOff: S.d9 - 4,
  report: cue("d9", "report", -4),
  clickReported: cue("d9", "reported", -4),
  clickMenuDots: cue("d9", "reason", 2),
  clickDelete: cue("d9", "deletes", -4),
  confirmDelete: cue("d9", "spam", 0),
  learner2: S.d10,
};
const CLICKS = [T.clickMenu, T.clickCreate, T.typeTitle, T.typeBody, T.photo, T.pickProgram, T.pickSession, T.clickPost, T.clickReact, T.pickEmoji, T.clickComment, T.sendComment, T.clickCreateL, T.postL, T.repost, T.share, T.search, T.clickTag, T.clickFilters, T.clickReported, T.clickMenuDots, T.clickDelete, T.confirmDelete];

// ───────── feed pieces (main coords 1350 x 776) ─────────
const FX = 20, FW = 860, RX = 900, RW = 430;
const EMO = ["❤️", "👍", "🙏", "😂", "🥰", "😯"];
type Post = { id: string; who: string; role?: string; time: string; aud: string; title: string; body: string; img?: string; tags: string[]; react: string; rc: number; cc: number; mine?: string; at: number; comments?: [string, string, number][]; flagged?: boolean };
const LabImg: React.FC<{ kind: string; h: number }> = ({ kind, h }) => (
  <div style={{ height: h, borderRadius: 12, background: kind === "panel" ? "linear-gradient(135deg,#334155,#0F172A)" : "linear-gradient(135deg,#F59E0B,#B45309)", position: "relative", overflow: "hidden" }}>
    {kind === "panel" ? Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 6) * 80, top: 30 + Math.floor(i / 6) * 70, width: 50, height: 46, borderRadius: 6, background: "#64748B", border: "3px solid #94A3B8" }} />)
      : Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 140, bottom: 0, width: 70, height: 60 + (i % 3) * 30, borderRadius: "35px 35px 0 0", background: "#78350F" }} />)}
    <div style={{ position: "absolute", right: 12, bottom: 10, fontSize: 13, fontWeight: 800, color: "#fff", background: "#0008", padding: "3px 8px", borderRadius: 6 }}>{kind === "panel" ? "IMG_2214.jpg" : "saturday-lab.jpg"}</div>
  </div>
);
const PostCard: React.FC<{ f: number; p: Post; y: number; hlReact?: boolean; picker?: number; menu?: number; showComments?: boolean; commentDraft?: string; hl?: boolean }> = ({ f, p, y, hlReact, picker, menu, showComments, commentDraft, hl }) => {
  const o = pr(f, p.at, 12);
  return (
    <div style={{ position: "absolute", left: FX, top: y + (1 - o) * 16, width: FW, borderRadius: 16, background: "#fff", border: `2px solid ${hl ? BLUE : LINE}`, boxShadow: hl ? "0 0 0 4px #C7D2FE" : "0 2px 8px #0001", padding: 18, boxSizing: "border-box", opacity: o, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar t={p.who.split(" ").map((w) => w[0]).join("")} s={44} c1={p.role ? "#2E64F0" : "#16A34A"} c2={p.role ? "#1D4ED8" : "#15803D"} />
        <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 900, color: INK }}>{p.who}{p.role && <span style={{ marginLeft: 8 }}><Badge t={p.role} c={BLUE} bg="#EEF2FF" fs={11} /></span>}</div><div style={{ fontSize: 13, fontWeight: 700, color: GRAY }}>{p.time} · {p.aud}</div></div>
        <span style={{ fontSize: 22, color: GRAY, fontWeight: 900 }}>⋯</span>
      </div>
      <div style={{ marginTop: 10, fontSize: 19, fontWeight: 900, color: INK }}>{p.title}</div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: "#374151", lineHeight: 1.45 }}>{p.body}</div>
      {p.img && <div style={{ marginTop: 10 }}><LabImg kind={p.img} h={150} /></div>}
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>{p.tags.map((t) => <span key={t} style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>#{t}</span>)}</div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: GRAY }}><span>{p.react} {p.rc}</span><span>{p.cc} comments</span></div>
      <div style={{ marginTop: 8, borderTop: `1px solid ${LINE}`, paddingTop: 8, display: "flex", justifyContent: "space-around" }}>
        {[[p.mine ?? "♡", p.mine ? "Liked" : "Like"], ["💬", "Comment"], ["↻", "Repost"], ["➤", "Send"]].map(([ic, l], i) => <span key={l} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 15, fontWeight: 800, color: i === 0 && p.mine ? "#DC2626" : "#4B5563", background: i === 0 && hlReact ? "#FEE2E2" : "transparent" }}>{ic} {l}</span>)}
      </div>
      {picker !== undefined && (
        <div style={{ position: "absolute", left: 20, bottom: 56, display: "flex", gap: 6, padding: "8px 12px", borderRadius: 999, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 16px 40px #0003", zIndex: 4 }}>
          {EMO.map((e, i) => <span key={e} style={{ fontSize: 28, transform: `scale(${i === picker ? 1.35 : 1})` }}>{e}</span>)}
        </div>
      )}
      {showComments && (
        <div style={{ marginTop: 10 }}>
          {(p.comments ?? []).filter((c) => f >= c[2]).map(([w, t, at]) => (
            <div key={w + t} style={{ marginTop: 8, display: "flex", gap: 10, opacity: pr(f, at, 10) }}>
              <Avatar t={w.split(" ").map((x) => x[0]).join("")} s={32} c1={w.startsWith("Marco") ? "#2E64F0" : "#16A34A"} c2={w.startsWith("Marco") ? "#1D4ED8" : "#15803D"} />
              <div style={{ padding: "8px 12px", borderRadius: 12, background: "#F3F4F6", fontSize: 15, fontWeight: 600, color: INK }}><b>{w}</b><br />{t}</div>
            </div>
          ))}
          {commentDraft !== undefined && <div style={{ marginTop: 10, height: 44, borderRadius: 11, border: `2px solid ${commentDraft ? BLUE : LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, fontWeight: 600, color: commentDraft ? INK : "#9CA3AF" }}>{commentDraft || "Type your comment"}</div>}
        </div>
      )}
      {menu !== undefined && (
        <div style={{ position: "absolute", right: 16, top: 54, width: 220, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, zIndex: 4 }}>
          {["Save This Post", "Copy This Link", "Edit this post", "Delete this post", "Report This Post"].map((t, i) => <div key={t} style={{ height: 38, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 800, color: i === 3 ? "#DC2626" : INK, background: i === menu ? "#FEE2E2" : "transparent" }}>{t}</div>)}
        </div>
      )}
    </div>
  );
};
const SideCards: React.FC<{ f: number; hot: boolean }> = ({ f, hot }) => {
  const tags: [string, number][] = hot ? [["panels", 14], ["conduit", 9], ["nec2026", 7], ["safety", 5]] : [["conduit", 9], ["nec2026", 7], ["safety", 5], ["tools", 3]];
  const tops: [string, number, number][] = hot ? [["Jordan Blake", 18, 31], ["Kai Turner", 12, 22], ["Rosa Diaz", 9, 17]] : [["Kai Turner", 12, 22], ["Rosa Diaz", 9, 17], ["Leo Park", 6, 10]];
  const card = (y: number, h: number, title: string, on: boolean, kids: React.ReactNode) => (
    <div style={{ position: "absolute", left: RX, top: y, width: RW, height: h, borderRadius: 16, background: "#fff", border: `2px solid ${on ? BLUE : LINE}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", padding: 16, boxSizing: "border-box", fontFamily: FONT }}>
      <div style={{ fontSize: 18, fontWeight: 900, color: INK, borderBottom: `1px solid ${LINE}`, paddingBottom: 8 }}>{title}</div>{kids}
    </div>
  );
  return (
    <>
      {card(0, 210, "Trending Tags", f >= T.trend && f < T.contrib, <div style={{ marginTop: 8 }}>{tags.map(([t, n], i) => <div key={t} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: i === 0 && hot ? BLUE : "#374151", background: (f >= T.clickTag - 6 && f < T.clickTag + 20 && t === "panels") ? "#EEF2FF" : "transparent", borderRadius: 6, padding: "2px 6px" }}><span>#{t}</span><span style={{ color: GRAY }}>{n} posts</span></div>)}</div>)}
      {card(222, 250, "Top Contributors", f >= T.contrib && f < T.events, <div>{tops.map(([n, c, r], i) => <div key={n} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}><Avatar t={n.split(" ").map((w) => w[0]).join("")} s={36} c1="#16A34A" c2="#15803D" /><span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: i === 0 && hot ? BLUE : INK }}>{n}</span><span style={{ fontSize: 13, fontWeight: 700, color: GRAY }}>{c} Comments · {r} React</span></div>)}</div>)}
      {card(484, 290, "Upcoming Events", f >= T.events && f < T.search, <div>{[["Open lab: panel wiring", "Sat, Oct 24 · 9:00 AM"], ["NEC 2026 changes Q&A", "Tue, Oct 27 · 7:00 PM"]].map(([t, d], i) => <div key={t} style={{ marginTop: 12, padding: 10, borderRadius: 12, background: "#F9FAFB", display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 46, height: 46, borderRadius: 10, background: BLUE, color: "#fff", fontSize: 12, fontWeight: 900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>OCT<span style={{ fontSize: 17 }}>{i ? 27 : 24}</span></div><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800, color: INK }}>{t}</div><div style={{ fontSize: 13, fontWeight: 600, color: GRAY }}>{d}</div></div><span style={{ padding: "5px 12px", borderRadius: 999, background: "#EEF2FF", color: BLUE, fontSize: 13, fontWeight: 800 }}>Interested</span></div>)}</div>)}
    </>
  );
};

// posts
const MARCO_POST = (f: number, learnerView: boolean): Post => ({
  id: "m", who: "Marco Reyes", role: "Instructor", time: f >= T.learner ? "2h" : "Just now", aud: "Residential Wiring — Fall 2026 · Weekend", title: "Saturday lab: what tripped you up?",
  body: "Great work on the sub-panel lab. Post one thing that confused you, and we'll go over it next week.", img: "lab", tags: ["labs", "panels"],
  react: "❤️👍", rc: learnerView && f >= T.pickEmoji + 2 ? 9 : 8, cc: learnerView && f >= T.sendComment + 2 ? 4 : 3, mine: learnerView && f >= T.pickEmoji + 2 ? "❤️" : undefined, at: T.clickPost + 4,
  comments: [["Jordan Blake", "Torque specs on the neutral bar. I guessed.", T.sendComment + 2]],
});
const JORDAN_POST = (f: number): Post => ({
  id: "j", who: "Jordan Blake", time: f >= T.learner2 ? "1h" : "Just now", aud: "Residential Wiring — Fall 2026 · Weekend", title: "Is this panel layout right?",
  body: "Practiced at home. Not sure the breakers are in the right order for the kitchen circuits.", img: "panel", tags: ["panels"],
  react: "👍🙏", rc: f >= T.answers ? 6 : 0, cc: f >= T.learner2 ? 3 : f >= T.answers ? 2 : 0, at: T.postL + 4,
  comments: [["Kai Turner", "Kitchen circuits need 20A, check slot 7.", T.answers + 4], ["Rosa Diaz", "Same mistake I made, label them first!", T.answers + 22], ["Marco Reyes", "Good catch, Kai. Jordan, bring it Saturday and we'll walk through it.", T.learner2 + 30]],
});
const OLD_POSTS = (): Post[] => [
  { id: "o1", who: "Kai Turner", time: "Yesterday", aud: "Global", title: "Best tester under $50?", body: "Looking for a non-contact voltage tester that won't die in a month.", tags: ["tools"], react: "👍", rc: 5, cc: 7, at: 0 },
  { id: "o2", who: "Rosa Diaz", time: "2 days ago", aud: "Global", title: "NEC 2026 summary sheet", body: "Made a one-page summary of the changes we covered. Hope it helps!", tags: ["nec2026"], react: "❤️🙏", rc: 12, cc: 4, at: 0 },
];
const SPAM: Post = { id: "s", who: "deals4u", time: "3h", aud: "Global", title: "Cheap certificates, no exam!!!", body: "DM me for a licence without the hours. Limited offer.", tags: [], react: "", rc: 0, cc: 0, at: 0, flagged: true };

const TopBar: React.FC<{ f: number; q?: string; filtersOn?: boolean; tagChip?: boolean; filterLabel?: string }> = ({ q, filtersOn, tagChip, filterLabel }) => (
  <>
    <div style={{ position: "absolute", left: FX, top: 0, width: 600, height: 48, borderRadius: 12, border: `2px solid ${q ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 16, fontWeight: 600, color: q ? INK : "#9CA3AF", boxSizing: "border-box" }}>⌕ {q || "Press Enter for search a post"}</div>
    <div style={{ position: "absolute", left: FX + 612, top: 0, width: 248, height: 48, borderRadius: 12, border: `2px solid ${filtersOn ? BLUE : LINE}`, background: filtersOn ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 16, fontWeight: 800, color: INK, boxSizing: "border-box" }}>⚲ Filters{filterLabel ? `: ${filterLabel}` : ""}</div>
    {tagChip && <div style={{ position: "absolute", left: FX, top: 56, width: FW, height: 40, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box", fontSize: 15, fontWeight: 800, color: INK }}># Filtered by Tags <span style={{ padding: "3px 10px", borderRadius: 999, background: BLUE, color: "#fff" }}>#panels ✕</span><span style={{ marginLeft: "auto", color: BLUE }}>Clear Tags</span></div>}
  </>
);
const ComposeBar: React.FC<{ y: number; on?: boolean; me?: string }> = ({ y, on, me = "MR" }) => (
  <div style={{ position: "absolute", left: FX, top: y, width: FW, height: 72, borderRadius: 16, background: "#fff", border: `2px solid ${on ? BLUE : LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", boxSizing: "border-box", fontFamily: FONT }}>
    <Avatar t={me} s={40} c1={me === "MR" ? "#2E64F0" : "#16A34A"} c2={me === "MR" ? "#1D4ED8" : "#15803D"} />
    <div style={{ flex: 1, height: 44, borderRadius: 22, background: "#F3F4F6", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 16, fontWeight: 600, color: "#9CA3AF" }}>Share your thoughts with the community</div>
    <div style={{ height: 44, padding: "0 18px", borderRadius: 12, background: BLUE, color: "#fff", display: "flex", alignItems: "center", fontSize: 15, fontWeight: 800 }}>Create Post</div>
  </div>
);
const CREATE_BTN = MA(FX + FW - 16 - 60, 60 + 36);

// ───────── branch feed ─────────
const BranchFeed: React.FC<{ f: number }> = ({ f }) => {
  const after = f >= T.back;
  const q = f >= T.search && f < T.clickTag ? typed(f, T.search + 4, "breaker", 0.5) : "";
  const tagOn = f >= T.clickTag + 2 && f < T.clickFilters;
  const reported = f >= T.clickReported + 2 && f < T.learner2;
  const deleted = f >= T.confirmDelete + 4;
  let posts: Post[];
  if (reported) posts = deleted ? [] : [SPAM];
  else if (after) posts = tagOn ? [JORDAN_POST(f), MARCO_POST(f, false)] : [JORDAN_POST(f), MARCO_POST(f, false), ...OLD_POSTS()];
  else posts = f >= T.clickPost + 4 ? [MARCO_POST(f, false), ...OLD_POSTS()] : OLD_POSTS();
  const top = 60 + 72 + 14 + (tagOn ? 48 : 0);
  const fo = f >= T.clickFilters + 2 && f < T.filtersOff ? pr(f, T.clickFilters + 2, 8) * (1 - lin(f, T.filtersOff - 8, T.filtersOff)) : 0;
  const ro = f >= T.clickReported - 18 && f < T.clickReported + 4 ? 1 : 0;
  let y = top;
  return (
    <div style={{ position: "absolute", left: 0, top: 14, right: 0, bottom: 0, fontFamily: FONT }}>
      <TopBar f={f} q={q} tagChip={tagOn} filtersOn={fo > 0 || ro > 0 || reported} filterLabel={reported ? "Reported Posts" : undefined} />
      {!tagOn && <ComposeBar y={60} on={f >= T.clickCreate - 10 && f < T.clickCreate + 6} />}
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        {posts.map((p) => {
          const h = p.img ? 400 : 245;
          const el = <PostCard key={p.id} f={f} p={p} y={y} hl={p.id === "j" && f >= T.clickTag + 2 && f < T.clickTag + 40} menu={p.id === "s" && f >= T.clickMenuDots + 2 && f < T.clickDelete + 4 ? (f >= T.clickDelete - 8 ? 3 : -1) : undefined} />;
          y += h + 14;
          return el;
        })}
        {reported && !deleted && (
          <div style={{ position: "absolute", left: FX, top: top + 244, width: FW, padding: 16, borderRadius: 14, background: "#FEF2F2", border: "2px solid #FECACA", boxSizing: "border-box", opacity: pr(f, T.clickReported + 8, 10) }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#B91C1C" }}>⚑ Reported by 3 learners · Spam or Scam</div>
            <div style={{ marginTop: 4, fontSize: 15, fontWeight: 600, color: "#7F1D1D" }}>Note: "Selling fake certificates in our group."</div>
          </div>
        )}
        {reported && deleted && <div style={{ position: "absolute", left: FX, top: top + 40, width: FW, textAlign: "center", fontSize: 17, fontWeight: 700, color: GRAY }}>No posts found with the current filters</div>}
      </div>
      <SideCards f={f} hot={after} />
      {(fo > 0 || ro > 0) && (
        <div style={{ position: "absolute", left: FX + 612, top: 54, width: 248, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, opacity: Math.max(fo, ro), zIndex: 5 }}>
          <div style={{ padding: "6px 10px", fontSize: 13, fontWeight: 800, color: GRAY }}>Filter Category</div>
          {["Clear", "Saved Posts", "Reported Posts", "My Posts", "Recent", "Last Week", "Last Month"].map((t, i) => {
            const on = (ro > 0 && t === "Reported Posts" && f >= T.clickReported - 6) || (fo > 0 && f >= T.clickFilters + 12 + (i - 1) * 7 && f < T.clickFilters + 12 + i * 7 && i > 0);
            return <div key={t} style={{ height: 36, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 800, color: on ? "#fff" : INK, background: on ? BLUE : "transparent" }}>{t}</div>;
          })}
        </div>
      )}
    </div>
  );
};
const FILTER_ITEM = (i: number): [number, number] => MA(FX + 612 + 124, 14 + 54 + 6 + 28 + i * 36 + 18);

// ───────── learner feed ─────────
const LearnerFeed: React.FC<{ f: number }> = ({ f }) => {
  const second = f >= T.learner2;
  const showJ = f >= T.postL + 4;
  const picker = f >= T.clickReact + 2 && f < T.pickEmoji + 4 ? (f >= T.pickEmoji - 6 ? 0 : -1) : undefined;
  const draft = f >= T.clickComment + 2 && f < T.sendComment ? typed(f, T.clickComment + 4, "Torque specs on the neutral bar. I guessed.", 1.4) : "";
  const top = 60 + 72 + 14;
  return (
    <div style={{ position: "absolute", left: 0, top: 14, right: 0, bottom: 0, fontFamily: FONT }}>
      <TopBar f={f} />
      <ComposeBar y={60} me="JB" on={f >= T.clickCreateL - 10 && f < T.clickCreateL + 6} />
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        {showJ ? (
          <PostCard f={f} p={JORDAN_POST(f)} y={top} showComments={f >= T.answers || second} hl={second && f >= T.learner2 + 30} />
        ) : (
          <PostCard f={f} p={MARCO_POST(f, true)} y={top} picker={picker} hlReact={f >= T.pickEmoji && f < T.pickEmoji + 20} showComments={f >= T.clickComment} commentDraft={f < T.sendComment + 2 ? draft : undefined} />
        )}
      </div>
      <SideCards f={f} hot={second} />
      {f >= T.repost && f < T.share + 50 && (
        <div style={{ position: "absolute", left: FX + 200, top: 300, width: 460, padding: 18, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 60px #0004", zIndex: 5, opacity: pr(f, T.repost, 8) }}>
          {f < T.share ? (<><div style={{ fontSize: 18, fontWeight: 900, color: INK }}>↻ Repost</div><div style={{ marginTop: 8, fontSize: 15, fontWeight: 600, color: GRAY }}>Kai reposted to Residential Wiring — Morning</div></>) : (<><div style={{ fontSize: 18, fontWeight: 900, color: INK }}>➤ Send</div><div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: GRAY }}>Or share with link</div><div style={{ marginTop: 8, height: 40, borderRadius: 10, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, fontWeight: 700, color: INK }}>voltline.skillbnk.com/community/post/8821</div></>)}
        </div>
      )}
    </div>
  );
};

// ───────── create post modal ─────────
const PX = 360, PY0 = 22, PW = 880, PH = 790;
const PP = (x: number, y: number) => CT(PX + x, PY0 + y);
const dd = (x: number, y: number, w: number, on: boolean, v: string, ph: string) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 46, borderRadius: 11, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 16, fontWeight: 600, color: v ? INK : "#9CA3AF" }}>{v || ph}<span style={{ color: GRAY }}>⌄</span></div>;
const CreateModal: React.FC<{ f: number; at: number; post: number; learner?: boolean }> = ({ f, at, post, learner }) => {
  if (f < at + 3 || f > post + 14) return null;
  const inn = Math.min(1, sp(f, at + 4, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, post + 2, post + 12));
  const title = learner ? "Is this panel layout right?" : "Saturday lab: what tripped you up?";
  const body = learner ? "Practiced at home. Not sure the breakers are in the right order for the kitchen circuits. #panels" : "Great work on the sub-panel lab. Post one thing that confused you, and we'll go over it next week. #labs #panels";
  const span = post - at;
  const tT = learner ? at + 10 : T.typeTitle, tB = learner ? at + 10 + span * 0.25 : T.typeBody, tP = learner ? at + 10 + span * 0.6 : T.photo;
  const photo = f >= tP + 8;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: PX, top: PY0 + (1 - inn) * 30, width: PW, height: PH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>Create Post</div>
        <div style={{ position: "absolute", left: 28, top: 80, width: PW - 56, height: 48, borderRadius: 11, border: `2px solid ${f >= tT && f < tB ? BLUE : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", fontSize: 18, fontWeight: 800, color: f >= tT ? INK : "#9CA3AF" }}>{f >= tT ? typed(f, tT + 2, title, 1.2) : "Enter title for your post"}</div>
        <div style={{ position: "absolute", left: 28, top: 144, width: PW - 56, height: 170, borderRadius: 11, border: `2px solid ${f >= tB && f < tP ? BLUE : "#D1D5DB"}`, padding: 14, boxSizing: "border-box", fontSize: 17, fontWeight: 600, color: f >= tB ? INK : "#9CA3AF", lineHeight: 1.5 }}>
          {f >= tB ? typed(f, tB + 2, body, learner ? 2.2 : 1.6).split(/(#\w+)/).map((s, i) => s.startsWith("#") ? <span key={i} style={{ color: BLUE, fontWeight: 800 }}>{s}</span> : s) : "Write your post here..."}
        </div>
        <div style={{ position: "absolute", left: 28, top: 330, width: PW - 56, height: 190, borderRadius: 12, border: `2px dashed ${photo ? "#22C55E" : "#93C5FD"}`, background: photo ? "transparent" : "#EFF6FF", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: BLUE }}>
          {photo ? <div style={{ width: "100%", opacity: pr(f, tP + 8, 10) }}><LabImg kind={learner ? "panel" : "lab"} h={190} /></div> : "🖼  Add photos or files"}
        </div>
        {!learner && (
          <>
            <div style={{ position: "absolute", left: 28, top: 540, fontSize: 15, fontWeight: 800, color: "#374151" }}>Programs</div>
            {dd(28, 564, (PW - 72) / 2, f >= T.pickProgram && f < T.pickSession, f >= T.pickProgram + 6 ? "Residential Wiring — Fall 2026" : "", "All Programs")}
            <div style={{ position: "absolute", left: 44 + (PW - 72) / 2, top: 540, fontSize: 15, fontWeight: 800, color: "#374151" }}>Sessions</div>
            {dd(44 + (PW - 72) / 2, 564, (PW - 72) / 2, f >= T.pickSession && f < T.clickPost, f >= T.pickSession + 6 ? "Weekend" : "", "All Sessions")}
            <div style={{ position: "absolute", left: 28, top: 622, fontSize: 14, fontWeight: 600, color: GRAY }}>Leave both empty to share with everyone.</div>
          </>
        )}
        <Btn x={PW - 28 - 120 - 12 - 110} y={PH - 70} w={110} label="Cancel" fs={17} />
        <Btn x={PW - 28 - 120} y={PH - 70} w={120} label="Post" primary fs={17} press={f >= post && f < post + 6 ? 1 : 0} />
      </div>
    </>
  );
};
const ConfirmDel: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickDelete + 2 || f > T.confirmDelete + 8) return null;
  const o = pr(f, T.clickDelete + 2, 8) * (1 - lin(f, T.confirmDelete + 2, T.confirmDelete + 8));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.45 * o})` }} />
      <div style={{ position: "absolute", left: 560, top: 260, width: 480, padding: 26, borderRadius: 18, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>Delete this post</div>
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 600, color: GRAY }}>This action cannot be undone.</div>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 10 }}><span style={{ padding: "10px 18px", borderRadius: 10, border: `2px solid ${LINE}`, fontSize: 16, fontWeight: 800 }}>Cancel</span><span style={{ padding: "10px 18px", borderRadius: 10, background: "#DC2626", color: "#fff", fontSize: 16, fontWeight: 800 }}>Delete</span></div>
      </div>
    </>
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.clickMenu - 10, 860, 540, 1.04],
  [T.tourPosts, 860, 560, 1.06],
  [T.tourSide, 1100, 560, 1.06],
  [S.d2, 960, 540, 1.0],
  [T.typeBody, 960, 460, 1.08],
  [T.photo, 960, 560, 1.06],
  [T.pickProgram, 960, 620, 1.08],
  [S.d3, 900, 560, 1.04],
  [T.learner, 960, 540, 1.0],
  [T.clickReact, 880, 620, 1.08],
  [S.d5, 960, 540, 1.0],
  [T.answers, 880, 600, 1.06],
  [T.back, 960, 540, 1.0],
  [T.trend, 1100, 480, 1.1],
  [T.events, 1100, 620, 1.1],
  [S.d8, 960, 540, 1.0],
  [T.clickFilters, 1000, 480, 1.08],
  [S.d9, 960, 540, 1.0],
  [T.clickMenuDots, 960, 520, 1.06],
  [T.learner2, 960, 540, 1.0],
  [T.learner2 + 40, 900, 620, 1.08],
  [PAY_START, 960, 540, 1.0],
]).map(calmK);
const POSTY = 14 + 60 + 72 + 14; // first post top (main coords)
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Community", "Communication")],
  [T.tourPosts, ...MA(440, POSTY + 120)],
  [T.tourSide, ...MA(RX + 200, 120)],
  [T.tourSide + 50, ...MA(RX + 200, 600)],
  [T.clickCreate, ...CREATE_BTN],
  [T.typeTitle, ...PP(440, 104)],
  [T.typeBody, ...PP(440, 228)],
  [T.photo, ...PP(440, 425)],
  [T.tag, ...PP(700, 228)],
  [T.pickProgram, ...PP(230, 587)],
  [T.pickSession, ...PP(650, 587)],
  [T.clickPost, ...PP(PW - 88, PH - 46)],
  [T.learner + 20, 1500, 860],
  [T.clickReact, ...MA(FX + 110, POSTY + 368)],
  [T.pickEmoji, ...MA(FX + 50, POSTY + 318)],
  [T.clickComment, ...MA(FX + 320, POSTY + 368)],
  [T.sendComment - 4, ...MA(FX + 400, POSTY + 470)],
  [T.clickCreateL, ...CREATE_BTN],
  [T.postL, ...PP(PW - 88, PH - 46)],
  [T.answers + 10, ...MA(FX + 400, POSTY + 470)],
  [T.repost, ...MA(FX + 530, POSTY + 368)],
  [T.share, ...MA(FX + 730, POSTY + 368)],
  [T.trend, ...MA(RX + 120, 70)],
  [T.contrib, ...MA(RX + 150, 300)],
  [T.events, ...MA(RX + 390, 590)],
  [T.search, ...MA(FX + 300, 38)],
  [T.clickTag, ...MA(RX + 60, 14 + 62)],
  [T.clickFilters, ...MA(FX + 736, 38)],
  [T.clickFilters + 50, ...FILTER_ITEM(6)],
  [T.report, ...MA(FX + 736, 38)],
  [T.clickReported, ...FILTER_ITEM(2)],
  [T.clickMenuDots, ...MA(FX + FW - 34, POSTY + 32)],
  [T.clickDelete, ...MA(FX + FW - 16 - 110, POSTY + 54 + 6 + 3 * 38 + 19)],
  [T.confirmDelete, ...CT(560 + 480 - 26 - 40, 260 + 26 + 100)],
  [T.learner2 + 20, 1500, 860],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "The Community feed" },
  { at: S.d2, to: S.d3, label: "Create a post" },
  { at: S.d3, to: T.learner, label: "Live in the feed" },
  { at: T.learner, to: S.d5, label: "React and comment" },
  { at: S.d5, to: S.d6, label: "Learners post too" },
  { at: S.d6, to: T.back, label: "Answers, reposts, shares" },
  { at: T.back, to: S.d8, label: "Tags, contributors, events" },
  { at: S.d8, to: S.d9, label: "Search and filter" },
  { at: S.d9, to: T.learner2, label: "Report and moderate" },
  { at: T.learner2, to: PAY_START, label: "What the learner sees" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = (f >= T.learner && f < T.back) || f >= T.learner2;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={f >= T.learner2 ? T.learner2 : T.learner} url="learner.voltline.example.com/community" learner who="Jordan" prog="Residential Wiring — Fall 2026" active="Community" main={<LearnerFeed f={f} />}
            overlay={<><CreateModal f={f} at={T.clickCreateL} post={T.postL} learner /><Toast f={f} at={T.postL + 3} text="Post created successfully" d={50} /></>} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} url="academy.skillbnk.com/community" branch="Volt Line — Phoenix" active={f >= T.clickMenu ? "Community" : "Dashboard"} openGroup="Communication" main={<BranchFeed f={f} />}
            overlay={<><CreateModal f={f} at={T.clickCreate} post={T.clickPost} /><ConfirmDel f={f} /><Toast f={f} at={T.clickPost + 3} text="Post created successfully" d={50} /><Toast f={f} at={T.confirmDelete + 3} text="Post deleted successfully" d={50} /></>} />
        )}
        <Scribble f={f} at={T.trend + 2} d={16} out={T.contrib - 4} kind="ring" x={MA(RX + 130, 0)[0]} y={MA(0, 14 + 72)[1]} w={220} h={56} seed={6} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={T.learner2 - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner2 + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook ─────────
const HK = { once: cue("h0", "once"), six: cue("h0", "six"), own: cue("h0", "own"), stop: cue("h0", "stop") };
const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.own - 6, HK.stop + 20);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <HookTag f={f} text="Volt Line Apprenticeship · weekend class" />
      {DAYS.map((d, i) => {
        const on = i === 0;
        const o = pr(f, 4 + i * 5, 10);
        return (
          <div key={d} style={{ position: "absolute", left: 170 + i * 230, top: 230, width: 200, height: 360, borderRadius: 20, background: on ? "#fff" : "#1E293B", border: on ? "none" : "2px solid #334155", boxShadow: "0 30px 80px #0009", opacity: o, padding: 18, boxSizing: "border-box" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: on ? INK : "#94A3B8" }}>{d}</div>
            {on ? <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>{Array.from({ length: 12 }).map((_, k) => <Avatar key={k} t={"ABCDEFGHJKLM"[k]} s={40} c1="#16A34A" c2="#15803D" />)}</div>
              : <div style={{ marginTop: 40, display: "flex", justifyContent: "center", opacity: pr(f, HK.own + i * 4, 10) }}><Avatar t="?" s={56} c1="#475569" c2="#334155" /></div>}
            {!on && <div style={{ position: "absolute", left: 18, bottom: 18, fontSize: 15, fontWeight: 700, color: "#64748B" }}>no one to ask</div>}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 680, width: 1920, display: "flex", justifyContent: "center", gap: 14, opacity: pr(f, HK.stop - 6, 12) }}>
        {Array.from({ length: 12 }).map((_, k) => <div key={k} style={{ opacity: k > 8 && f >= HK.stop ? 0.15 : 1 }}><Avatar t={"ABCDEFGHJKLM"[k]} s={54} c1="#16A34A" c2="#15803D" /></div>)}
      </div>
      <div style={{ position: "absolute", left: 0, top: 800, width: 1920, textAlign: "center", fontSize: 48, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.stop - 2, 14) }}>Week 6: empty seats</div>
    </AbsoluteFill>
  );
};

const PYK = { talking: cue("p11", "talking"), showing: cue("p11", "showing") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    {DAYS.map((d, i) => (
      <div key={d} style={{ position: "absolute", left: 170 + i * 230, top: 220, width: 200, height: 300, borderRadius: 20, background: "#fff", boxShadow: "0 30px 80px #0009", padding: 18, boxSizing: "border-box", opacity: pr(f, PYK.talking - 14 + i * 4, 10) }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>{d}</div>
        {["💬", "❤️", "💬"].slice(0, 1 + (i % 3)).map((e, k) => <div key={k} style={{ marginTop: 14, padding: "8px 10px", borderRadius: 10, background: "#EEF2FF", fontSize: 14, fontWeight: 800, color: BLUE }}>{e} {["#panels", "#conduit", "#nec2026"][(i + k) % 3]}</div>)}
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, top: 580, width: 1920, display: "flex", justifyContent: "center", gap: 14 }}>
      {Array.from({ length: 12 }).map((_, k) => <div key={k} style={{ opacity: pr(f, PYK.showing - 8 + k * 2, 10) }}><Avatar t={"ABCDEFGHJKLM"[k]} s={60} c1="#16A34A" c2="#15803D" /></div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PYK.showing - 4, 14) }}>The class keeps talking all week</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.own, "riser", 0.25); add(HK.stop, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 14; i++) add(T.typeTitle + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.photo + 8, "pop", 0.35); add(T.clickPost + 4, "chime", 0.5); add(T.pickEmoji + 2, "pop", 0.4); add(T.sendComment + 2, "pop", 0.35);
  add(T.postL + 4, "chime", 0.45); add(T.answers + 4, "pop", 0.3); add(T.answers + 22, "pop", 0.3); add(T.confirmDelete + 4, "thud", 0.35);
  add(T.learner, "whoosh", 0.35); add(T.back, "whoosh", 0.3); add(T.learner2, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PYK.showing, "chime", 0.5);
  return a;
})();

export const CommunityStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="communitystory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.back, T.learner2]} />;
};
