import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, Fx } from "./storyShell";

/**
 * ChatStoryVideo — DEEP (sheet serial 43, ~2.5 min). Story: Hannah Price, BrightSmile Dental Assistant School (fictional).
 * Verified in code: libs/shared/chat (Chatbox used by SB-Branch /my-chats and SB-Learner /chat). en.ts: All Chats, Crowds, Unread,
 * Pinned, Online Users, Archived, Search, AI Bot, Blocked Users; "Search Chat...", Create New → New Chat / New Crowd; "Active now",
 * "{count} members"; Chat Info tabs Members / Images / Voice / Files / Links; roles Crowd Owner / Crowd Admin / Crowd Moderator / Member;
 * Mute Notification; "Search messages..."; Pin Chat. CreateCrowd: "New Crowd", Crowd Name ("Enter crowd name"), Description ("Enter
 * description"), "Upload JPEG/PNG/JPG image", Type Public / Private, Read Only, Next, Select Member Scope: Custom ("Manually select
 * students…") / Branch ("Include all students in this branch.") / Dynamic ("Dynamically add students based on…"), "Select Program",
 * "Select Session", toast "Crowd created successfully". Message: Reply / Forward / Copy / Pin / Edit / Delete, "Message pinned
 * successfully!", "This is the very beginning", TextEditor "Type a message...", attachments, CaptureAudio voice notes.
 * Video Meeting is "coming soon" in code → not shown.
 * Voice: python3 generate-voice-story.py src/ChatStoryVideo.tsx public/chatstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 315,
  d1: 326,
  d2: 283,
  d3: 257,
  d4: 225,
  d5: 130,
  d6: 324,
  d7: 204,
  d8: 233,
  d9: 320,
  d10: 205,
  d11: 207,
  p12: 173,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 15, 33, 45, 77, 79, 87, 97, 102, 109, 118, 124, 160, 160, 167, 172, 195, 197, 205, 212, 225, 238, 242, 248, 255, 265, 271, 281],
  d1: [2, 21, 46, 57, 77, 94, 108, 114, 142, 144, 149, 165, 166, 174, 180, 192, 205, 235, 251, 272, 278, 288, 295],
  d2: [2, 12, 22, 27, 34, 41, 48, 53, 61, 87, 91, 111, 114, 118, 144, 148, 152, 160, 166, 176, 206, 208, 217, 223, 232, 241, 250],
  d3: [2, 21, 32, 35, 57, 60, 67, 73, 82, 90, 123, 123, 128, 136, 156, 161, 166, 173, 187, 202, 213, 222, 224, 227, 230, 233, 236, 239, 242],
  d4: [2, 10, 22, 31, 67, 67, 78, 84, 93, 103, 124, 133, 144, 156, 168, 180],
  d5: [2, 14, 21, 33, 37, 45, 54, 59, 63, 69, 85],
  d6: [2, 21, 30, 38, 54, 70, 82, 94, 100, 106, 130, 132, 139, 144, 150, 159, 170, 181, 186, 193, 220, 224, 231, 247, 247, 263, 271, 278, 283, 291],
  d7: [2, 15, 21, 24, 33, 43, 72, 72, 83, 96, 104, 112, 130, 133, 139, 146, 154, 163, 168, 171],
  d8: [2, 8, 17, 43, 45, 53, 58, 63, 93, 93, 100, 103, 122, 127, 132, 141, 142, 168, 171, 177, 182, 190, 198, 207],
  d9: [2, 13, 27, 45, 53, 58, 68, 75, 106, 128, 146, 160, 195, 211, 215, 242, 246, 257, 257, 270, 277, 286, 291],
  d10: [2, 10, 17, 22, 28, 34, 57, 61, 68, 79, 109, 109, 120, 141, 147, 151, 160, 163, 169, 176],
  d11: [2, 17, 31, 56, 60, 70, 79, 91, 99, 104, 132, 134, 139, 149, 168, 175],
  p12: [2, 13, 23, 33, 43, 72, 74, 84, 105, 119, 122, 130, 139, 146, 150],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Hannah trains dental assistants. Her learners message her on three different apps. Questions arrive at midnight, get buried by morning, and she types the same answer five times.",
  d1: "In skillbank, every conversation lives in My Chats. On the left, she can switch between all chats, crowds, unread, pinned, and who's online.",
  d2: "She creates a new crowd for her evening class. A name, a short description, and whether it's public or private. Read only is there for announcement channels.",
  d3: "Then, who's in it. She can pick students by hand, include the whole branch, or add them dynamically by program and session, so new learners join on their own.",
  d4: "The crowd is created. She posts the first message, and attaches this week's x-ray positioning guide.",
  d5: "She pins it, so it stays at the top for everyone.",
  d6: "Now, the learner side. Ana opens Chat in her portal. The new crowd is already there, with the guide pinned. She asks a question, and records a quick voice note.",
  d7: "Back in the training provider portal, Hannah replies directly to Ana's message, so the answer stays attached to the question.",
  d8: "For something private, she starts a new chat, searches for the learner, and talks one to one. She can see who's active right now.",
  d9: "Chat info shows the members and their roles: owner, admin, moderator, member. Images, voice notes, files and links are collected in one place.",
  d10: "And when the day gets busy, she filters by unread, searches past messages, or mutes a crowd for the evening.",
  d11: "On Ana's side, the reply sits right under her question, with the guide still pinned above.",
  p12: "One place for every question. Hannah answers once, and the whole class can see it.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);

const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "chats", -6),
  rail: cue("d1", "left", -2),
  clickCreate: cue("d2", "creates", -4),
  clickNewCrowd: cue("d2", "crowd", -2),
  typeName: cue("d2", "name", -4),
  typeDesc: cue("d2", "description", -2),
  clickPrivate: cue("d2", "private", -2),
  readOnly: cue("d2", "read", -2),
  clickNext: cue("d3", "then", -4),
  scopes: cue("d3", "hand", -6),
  clickDynamic: cue("d3", "dynamically", -2),
  pickProgram: cue("d3", "program", -2),
  pickSession: cue("d3", "session", -2),
  clickSave: cue("d3", "own", 4),
  typeMsg: cue("d4", "posts", -4),
  attach: cue("d4", "attaches", -4),
  send: cue("d4", "guide", 6),
  hoverMsg: cue("d5", "pins", -10),
  clickPin: cue("d5", "pins", 2),
  learner: cue("d6", "learner", -8),
  lOpen: cue("d6", "crowd", -6),
  lType: cue("d6", "asks", -4),
  lSend: cue("d6", "question", 6),
  lMic: cue("d6", "records", -2),
  lVoice: cue("d6", "note", 10),
  back: S.d7,
  hoverReply: cue("d7", "replies", -8),
  clickReply: cue("d7", "replies", 0),
  typeReply: cue("d7", "message", -2),
  sendReply: cue("d7", "attached", -2),
  clickCreate2: cue("d8", "starts", -4),
  clickNewChat: cue("d8", "chat", -2),
  searchUser: cue("d8", "searches", -4),
  pickUser: cue("d8", "learner", 0),
  typeDm: cue("d8", "talks", -4),
  sendDm: cue("d8", "active", 8),
  clickInfo: cue("d9", "info", -4),
  roles: cue("d9", "roles", -2),
  clickFiles: cue("d9", "files", -4),
  infoOff: S.d10 - 4,
  clickUnread: cue("d10", "unread", -4),
  clickSearch: cue("d10", "searches", -4),
  clickMute: cue("d10", "mutes", -4),
  learner2: S.d11,
};
const CLICKS = [T.clickMenu, T.clickCreate, T.clickNewCrowd, T.typeName, T.typeDesc, T.clickPrivate, T.readOnly, T.clickNext, T.clickDynamic, T.pickProgram, T.pickSession, T.clickSave, T.typeMsg, T.attach, T.send, T.clickPin, T.lOpen, T.lType, T.lSend, T.lMic, T.lVoice, T.clickReply, T.sendReply, T.clickCreate2, T.clickNewChat, T.pickUser, T.sendDm, T.clickInfo, T.clickFiles, T.clickUnread, T.clickSearch, T.clickMute];

// ───────── chat shell (main-area coords, 1350 x 776) ─────────
const RAILW = 64, INBX = 64, INBW = 360, BODYX = 424, BODYW = 926;
const RAIL = [["💬", "All Chats"], ["👥", "Crowds"], ["✉", "Unread"], ["📌", "Pinned"], ["🟢", "Online Users"], ["🗄", "Archived"], ["🔍", "Search"], ["🤖", "AI Bot"], ["⛔", "Blocked Users"]];
const railPt = (i: number): [number, number] => [32, 34 + i * 58];
const CROWD = "Evening Class — Fall 2026";
export type Item = { n: string; sub: string; t: string; unread?: number; crowd?: boolean; c?: string };
export type Msg = { who: string; me: boolean; text?: string; file?: string; voice?: string; reply?: string; at: number; sys?: boolean };
export const BUBBLE = (m: Msg, f: number, k: number, hl?: boolean) => (
  <div key={k} style={{ display: "flex", justifyContent: m.sys ? "center" : m.me ? "flex-end" : "flex-start", marginTop: 14, opacity: pr(f, m.at, 10), transform: `translateY(${(1 - pr(f, m.at, 10)) * 14}px)` }}>
    {m.sys ? <div style={{ fontSize: 14, fontWeight: 700, color: GRAY, padding: "6px 14px", borderRadius: 999, background: "#F3F4F6" }}>{m.text}</div> : (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: m.me ? "row-reverse" : "row" }}>
        <Avatar t={m.who.split(" ").map((w) => w[0]).join("")} s={34} c1={m.me ? "#2E64F0" : "#16A34A"} c2={m.me ? "#1D4ED8" : "#15803D"} />
        <div style={{ maxWidth: 520, padding: "10px 14px", borderRadius: 14, background: m.me ? BLUE : "#fff", color: m.me ? "#fff" : INK, border: m.me ? "none" : `1px solid ${LINE}`, fontSize: 16, fontWeight: 600, lineHeight: 1.45, boxShadow: hl ? "0 0 0 4px #C7D2FE" : "0 2px 6px #0001" }}>
          {!m.me && <div style={{ fontSize: 13, fontWeight: 800, color: "#15803D", marginBottom: 2 }}>{m.who}</div>}
          {m.reply && <div style={{ marginBottom: 6, padding: "6px 10px", borderRadius: 8, borderLeft: `3px solid ${m.me ? "#BFDBFE" : BLUE}`, background: m.me ? "#ffffff22" : "#F3F4F6", fontSize: 14, fontWeight: 600 }}>↩ {m.reply}</div>}
          {m.text}
          {m.file && <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: m.me ? "#ffffff22" : "#F3F4F6" }}><span style={{ width: 34, height: 40, borderRadius: 6, background: "#EF4444", color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>PDF</span><span style={{ fontSize: 14, fontWeight: 800 }}>{m.file}</span></div>}
          {m.voice && <div style={{ display: "flex", alignItems: "center", gap: 8, width: 260 }}><span style={{ fontSize: 16 }}>▶</span>{Array.from({ length: 26 }).map((_, i) => <span key={i} style={{ width: 4, height: 6 + ((i * 29) % 18), borderRadius: 2, background: m.me ? "#fff" : "#16A34A" }} />)}<span style={{ fontSize: 13, fontWeight: 800 }}>{m.voice}</span></div>}
        </div>
      </div>
    )}
  </div>
);
export const ChatShell: React.FC<{ f: number; rail: number; items: Item[]; sel: number; head: { n: string; sub: string; crowd?: boolean }; msgs: Msg[]; pinned?: string; pinAt?: number; input?: string; inputOn?: boolean; attach?: boolean; hlMsg?: number; replyTo?: string; overlay?: React.ReactNode; muted?: boolean; search?: string; rec?: boolean }> = (p) => {
  const { f } = p;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: RAILW, height: "100%", background: "#F8FAFC", borderRight: `1px solid ${LINE}` }}>
        {RAIL.map(([ic], i) => <div key={i} style={{ position: "absolute", left: 10, top: 12 + i * 58, width: 44, height: 44, borderRadius: 12, background: p.rail === i ? "#EEF2FF" : "transparent", border: p.rail === i ? `2px solid ${BLUE}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, boxSizing: "border-box" }}>{ic}</div>)}
      </div>
      <div style={{ position: "absolute", left: INBX, top: 0, width: INBW, height: "100%", borderRight: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 14, top: 14, width: 270, height: 44, borderRadius: 11, border: `2px solid ${LINE}`, background: "#F9FAFB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 600, color: "#9CA3AF", boxSizing: "border-box" }}>⌕ Search Chat...</div>
        <div style={{ position: "absolute", left: 294, top: 14, width: 52, height: 44, borderRadius: 11, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>＋</div>
        <div style={{ position: "absolute", left: 16, top: 70, fontSize: 14, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>{RAIL[p.rail][1].toUpperCase()}</div>
        {p.items.map((it, i) => (
          <div key={it.n} style={{ position: "absolute", left: 8, top: 96 + i * 76, width: INBW - 16, height: 70, borderRadius: 12, background: i === p.sel ? "#EEF2FF" : "transparent", display: "flex", alignItems: "center", gap: 12, padding: "0 10px", boxSizing: "border-box" }}>
            <Avatar t={it.crowd ? "👥" : it.n.split(" ").map((w) => w[0]).join("")} s={44} c1={it.c ?? (it.crowd ? "#7C3AED" : "#16A34A")} c2={it.c ?? (it.crowd ? "#6D28D9" : "#15803D")} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 16, fontWeight: 800, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.n}</span><span style={{ fontSize: 12, fontWeight: 700, color: GRAY }}>{it.t}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}><span style={{ fontSize: 14, fontWeight: 600, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 230 }}>{it.sub}</span>{it.unread ? <span style={{ minWidth: 22, height: 22, borderRadius: 11, background: BLUE, color: "#fff", fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.unread}</span> : null}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: BODYX, top: 0, width: BODYW, height: "100%", background: "#F8FAFC" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: BODYW, height: 70, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", boxSizing: "border-box" }}>
          <Avatar t={p.head.crowd ? "👥" : p.head.n.split(" ").map((w) => w[0]).join("")} s={44} c1={p.head.crowd ? "#7C3AED" : "#16A34A"} c2={p.head.crowd ? "#6D28D9" : "#15803D"} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 900, color: INK }}>{p.head.n}{p.muted ? " 🔕" : ""}</div><div style={{ fontSize: 14, fontWeight: 700, color: p.head.sub === "Active now" ? "#16A34A" : GRAY }}>{p.head.sub}</div></div>
          {p.search !== undefined ? <div style={{ width: 260, height: 40, borderRadius: 10, border: `2px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 600, color: p.search ? INK : "#9CA3AF", boxSizing: "border-box" }}>{p.search || "Search messages..."}</div> : null}
          {["🔍", "🗓", "⋮", "ⓘ"].map((c) => <div key={c} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{c}</div>)}
        </div>
        {p.pinned && (
          <div style={{ position: "absolute", left: 0, top: 70, width: BODYW, height: 46, background: "#FFFBEB", borderBottom: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", boxSizing: "border-box", fontSize: 15, fontWeight: 700, color: "#92400E", opacity: pr(f, p.pinAt ?? 0, 10) }}>📌 Pinned: {p.pinned}</div>
        )}
        <div style={{ position: "absolute", left: 24, right: 24, top: p.pinned ? 120 : 80, bottom: p.replyTo ? 128 : 88, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
          {p.msgs.filter((m) => f >= m.at - 1).map((m, k) => BUBBLE(m, f, k, p.hlMsg === k))}
        </div>
        {p.replyTo && <div style={{ position: "absolute", left: 20, right: 20, bottom: 80, height: 40, borderRadius: "10px 10px 0 0", background: "#EEF2FF", borderLeft: `3px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14, fontWeight: 700, color: BLUE }}>↩ Replying to Ana Lopez: {p.replyTo}</div>}
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 16, height: 60, borderRadius: 14, background: "#fff", border: `2px solid ${p.inputOn ? BLUE : LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", boxSizing: "border-box" }}>
          <span style={{ fontSize: 20, color: p.attach ? BLUE : GRAY }}>📎</span>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: p.input ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden" }}>{p.rec ? <span style={{ color: "#DC2626" }}>● Recording… 0:{String(Math.min(14, Math.floor(Math.max(0, f - T.lMic) / 6))).padStart(2, "0")}</span> : p.input || "Type a message..."}</span>
          <span style={{ fontSize: 20, color: p.rec ? "#DC2626" : GRAY }}>🎙</span>
          <span style={{ width: 42, height: 40, borderRadius: 10, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>➤</span>
        </div>
        {p.overlay}
      </div>
    </div>
  );
};
const B = (x: number, y: number) => MA(BODYX + x, y);
const SENDPT = (): [number, number] => MA(BODYX + BODYW - 20 - 14 - 21, 776 - 16 - 30);
const INPUTPT = (): [number, number] => MA(BODYX + 300, 776 - 46);
const ATTPT = (): [number, number] => MA(BODYX + 20 + 24, 776 - 46);
const MICPT = (): [number, number] => MA(BODYX + BODYW - 20 - 14 - 42 - 12 - 12, 776 - 46);

const WELCOME = "Welcome, everyone! This week: x-ray positioning. Guide attached.";
const ANA_Q = "For bitewings, do we angle the tube +10°?";
const REPLY = "Yes, +5 to +10°. Page 4 of the guide shows it.";
const crowdMsgs = (learner: boolean): Msg[] => [
  { who: "System", me: false, sys: true, text: `This is the very beginning of ${CROWD}`, at: T.clickSave + 8 },
  { who: "Hannah Price", me: !learner, text: WELCOME, file: "xray-positioning-guide.pdf", at: T.send + 2 },
  { who: "Ana Lopez", me: learner, text: ANA_Q, at: T.lSend + 2 },
  { who: "Ana Lopez", me: learner, voice: "0:14", at: T.lVoice + 2 },
  { who: "Hannah Price", me: !learner, text: REPLY, reply: ANA_Q, at: T.sendReply + 2 },
];
const BR_ITEMS = (f: number): Item[] => {
  const base: Item[] = [
    { n: "Morning Class — Fall 2026", sub: "Leila: Thanks, see you Monday", t: "9:12", crowd: true, c: "#0EA5E9" },
    { n: "Marcus Lee", sub: "Can I swap my clinic day?", t: "Yesterday" },
    { n: "Front Desk Team", sub: "You: Room 3 is booked", t: "Mon", crowd: true, c: "#F59E0B" },
    { n: "Priya Shah", sub: "Got it, thank you!", t: "Sun" },
  ];
  if (f < T.clickSave + 4) return base;
  const last = f >= T.sendReply ? "You: " + REPLY : f >= T.lVoice ? "Ana: 🎙 Voice message" : f >= T.send ? "You: Guide attached" : "Crowd created";
  return [{ n: CROWD, sub: last, t: "Now", crowd: true, unread: f >= T.back && f < T.clickReply ? 2 : 0 }, ...base];
};

// ───────── new crowd modal (content coords) ─────────
const NX = 420, NY = 26, NW = 760, NH = 770;
const NP = (x: number, y: number) => CT(NX + x, NY + y);
const fld = (x: number, y: number, w: number, on: boolean, v: string, ph: string, sel?: boolean) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 46, borderRadius: 11, boxSizing: "border-box", border: `2px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 16, fontWeight: 600, color: v ? INK : "#9CA3AF" }}>{v || ph}{sel && <span style={{ color: GRAY }}>⌄</span>}</div>;
const lb = (x: number, y: number, t: string) => <div style={{ position: "absolute", left: x, top: y, fontSize: 15, fontWeight: 800, color: "#374151" }}>{t}</div>;
const SCOPES: [string, string][] = [["Custom", "Manually select students to add to the crowd."], ["Branch", "Include all students in this branch."], ["Dynamic", "Dynamically add students based on program and session."]];
const CrowdModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickNewCrowd + 4, b = T.clickSave + 4;
  if (f < a - 1 || f > b + 12) return null;
  const inn = Math.min(1, sp(f, a, 30, { damping: 18, stiffness: 140 }));
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b - 2, b + 10));
  const step2 = f >= T.clickNext + 4;
  const scope = f >= T.clickDynamic ? 2 : -1;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: NX, top: NY + (1 - inn) * 30, width: NW, height: NH, borderRadius: 20, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 28, top: 22, fontSize: 26, fontWeight: 900, color: INK }}>New Crowd</div>
        <div style={{ position: "absolute", right: 28, top: 30, fontSize: 14, fontWeight: 800, color: GRAY }}>Step {step2 ? 2 : 1} of 2</div>
        {!step2 ? (
          <>
            <div style={{ position: "absolute", left: 28, top: 76, width: 120, height: 120, borderRadius: 16, border: "2px dashed #93C5FD", background: "#EFF6FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: BLUE, textAlign: "center" }}>⇪<br />Upload or<br />Drag & drop</div>
            <div style={{ position: "absolute", left: 164, top: 150, fontSize: 13, fontWeight: 600, color: GRAY }}>Upload JPEG/PNG/JPG image</div>
            {lb(28, 222, "Crowd Name")}{fld(28, 246, NW - 56, f >= T.typeName && f < T.typeDesc, typed(f, T.typeName + 2, CROWD, 1.1), "Enter crowd name")}
            {lb(28, 312, "Description")}
            <div style={{ position: "absolute", left: 28, top: 336, width: NW - 56, height: 110, borderRadius: 11, border: `2px solid ${f >= T.typeDesc && f < T.clickPrivate ? BLUE : "#D1D5DB"}`, padding: 14, boxSizing: "border-box", fontSize: 16, fontWeight: 600, color: f >= T.typeDesc ? INK : "#9CA3AF" }}>{f >= T.typeDesc ? typed(f, T.typeDesc + 2, "Questions, guides and updates for the evening cohort.", 1.2) : "Enter description"}</div>
            {lb(28, 470, "Type")}
            {["Public", "Private"].map((t, i) => {
              const on = (i === 1) === (f >= T.clickPrivate);
              return <div key={t} style={{ position: "absolute", left: 28 + i * 160, top: 496, display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 800, color: INK }}><span style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${on ? BLUE : "#9CA3AF"}`, boxSizing: "border-box", padding: 3 }}>{on && <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: BLUE }} />}</span>{t}</div>;
            })}
            {lb(28, 556, "Read Only")}
            <div style={{ position: "absolute", left: 28, top: 582, width: 52, height: 28, borderRadius: 14, background: f >= T.readOnly && f < T.readOnly + 40 ? "#93C5FD" : "#D1D5DB" }}><div style={{ position: "absolute", left: f >= T.readOnly && f < T.readOnly + 40 ? 27 : 3, top: 3, width: 22, height: 22, borderRadius: 11, background: "#fff" }} /></div>
            <div style={{ position: "absolute", left: 96, top: 586, fontSize: 14, fontWeight: 600, color: GRAY }}>Only admins can post (good for announcements)</div>
            <Btn x={NW - 28 - 120} y={NH - 70} w={120} label="Next" primary fs={17} press={f >= T.clickNext && f < T.clickNext + 6 ? 1 : 0} />
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 28, top: 76, fontSize: 20, fontWeight: 900, color: INK }}>Select Member Scope</div>
            {SCOPES.map(([t, d], i) => (
              <div key={t} style={{ position: "absolute", left: 28, top: 116 + i * 96, width: NW - 56, height: 82, borderRadius: 14, border: `2px solid ${scope === i ? BLUE : LINE}`, background: scope === i ? "#EEF2FF" : "#fff", padding: "14px 16px 0 52px", boxSizing: "border-box", opacity: pr(f, T.scopes - 8 + i * 8, 10) }}>
                <span style={{ position: "absolute", left: 16, top: 18, width: 20, height: 20, borderRadius: "50%", border: `2px solid ${scope === i ? BLUE : "#9CA3AF"}`, boxSizing: "border-box", padding: 3 }}>{scope === i && <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: BLUE }} />}</span>
                <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>{t}</div>
                <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600, color: GRAY }}>{d}</div>
              </div>
            ))}
            {scope === 2 && (
              <div style={{ opacity: pr(f, T.clickDynamic + 4, 10) }}>
                {lb(28, 418, "Program")}{fld(28, 442, NW - 56, f >= T.pickProgram && f < T.pickSession, f >= T.pickProgram + 6 ? "Dental Assisting — Fall 2026" : "", "Select Program", true)}
                {lb(28, 508, "Session")}{fld(28, 532, NW - 56, f >= T.pickSession && f < T.clickSave, f >= T.pickSession + 6 ? "Evening" : "", "Select Session", true)}
                <div style={{ position: "absolute", left: 28, top: 596, fontSize: 14, fontWeight: 700, color: "#15803D", opacity: pr(f, T.pickSession + 10, 10) }}>✓ 24 students match · new enrollments join automatically</div>
              </div>
            )}
            <Btn x={NW - 28 - 160 - 12 - 110} y={NH - 70} w={110} label="Back" fs={17} />
            <Btn x={NW - 28 - 160} y={NH - 70} w={160} label="Save & Close" primary fs={17} press={f >= T.clickSave && f < T.clickSave + 6 ? 1 : 0} />
          </>
        )}
      </div>
    </>
  );
};
const CreateMenu: React.FC<{ f: number; at: number; pick: number; which: "crowd" | "chat" }> = ({ f, at, pick, which }) => {
  if (f < at + 2 || f > pick + 6) return null;
  return (
    <div style={{ position: "absolute", left: INBX + 160, top: 64, width: 190, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, opacity: pr(f, at + 2, 8), zIndex: 4 }}>
      <div style={{ padding: "6px 10px", fontSize: 13, fontWeight: 800, color: GRAY }}>Create New</div>
      {["New Chat", "New Crowd"].map((t) => <div key={t} style={{ height: 40, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 16, fontWeight: 800, color: (which === "crowd") === (t === "New Crowd") && f >= pick - 8 ? BLUE : INK, background: (which === "crowd") === (t === "New Crowd") && f >= pick - 8 ? "#EEF2FF" : "transparent" }}>{t}</div>)}
    </div>
  );
};
const menuItemPt = (i: number): [number, number] => MA(INBX + 160 + 100, 64 + 6 + 28 + i * 40 + 20);

// msg hover menu
const MsgMenu: React.FC<{ f: number; at: number; to: number; x: number; y: number; hl: string }> = ({ f, at, to, x, y, hl }) => {
  if (f < at || f > to) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 170, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, opacity: pr(f, at, 6), zIndex: 4 }}>
      {["Reply", "Forward", "Copy", "Pin", "Edit", "Delete"].map((t) => <div key={t} style={{ height: 34, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 800, color: t === "Delete" ? "#DC2626" : t === hl ? BLUE : INK, background: t === hl ? "#EEF2FF" : "transparent" }}>{t}</div>)}
    </div>
  );
};
const MENU_ROW = (i: number) => 6 + i * 34 + 17;

// ───────── chat info drawer ─────────
const MEMBERS: [string, string][] = [["Hannah Price", "Crowd Owner"], ["Dr. Lee Morgan", "Crowd Admin"], ["Sam Ortiz", "Crowd Moderator"], ["Ana Lopez", "Member"], ["Marcus Lee", "Member"], ["Priya Shah", "Member"], ["Leila Haddad", "Member"]];
const INFO_TABS = ["Members", "Images", "Voice", "Files", "Links"];
const InfoDrawer: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.clickInfo + 2 || f > T.infoOff + 8) return null;
  const o = pr(f, T.clickInfo + 2, 10) * (1 - lin(f, T.infoOff - 2, T.infoOff + 8));
  const tab = f >= T.clickFiles ? 3 : 0;
  return (
    <div style={{ position: "absolute", right: 0, top: 0, width: 420, height: "100%", background: "#fff", borderLeft: `1px solid ${LINE}`, boxShadow: "-20px 0 50px #0002", opacity: o, transform: `translateX(${(1 - o) * 40}px)`, padding: 22, boxSizing: "border-box", zIndex: 5 }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Chat Info</div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}><Avatar t="👥" s={56} c1="#7C3AED" c2="#6D28D9" /><div><div style={{ fontSize: 17, fontWeight: 900, color: INK }}>{CROWD}</div><div style={{ fontSize: 14, fontWeight: 700, color: GRAY }}>Type: Private · Read Only: No · 24 members</div></div></div>
      <div style={{ marginTop: 16, display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "#F3F4F6" }}>{INFO_TABS.map((t, i) => <span key={t} style={{ flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 8, background: tab === i ? "#fff" : "transparent", fontSize: 14, fontWeight: 800, color: tab === i ? BLUE : "#4B5563" }}>{t}</span>)}</div>
      {tab === 0 ? MEMBERS.map(([n, r], i) => (
        <div key={n} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, opacity: pr(f, T.clickInfo + 8 + i * 4, 8) }}>
          <Avatar t={n.replace("Dr. ", "").split(" ").map((w) => w[0]).join("")} s={36} c1={i < 3 ? "#2E64F0" : "#16A34A"} c2={i < 3 ? "#1D4ED8" : "#15803D"} />
          <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: INK }}>{n}</span>
          <Badge t={r} c={i === 0 ? "#fff" : BLUE} bg={i === 0 ? BLUE : f >= T.roles && i < 4 ? "#DBEAFE" : "#EEF2FF"} fs={12} />
        </div>
      )) : ["xray-positioning-guide.pdf · 2.4 MB", "infection-control-checklist.pdf · 610 KB", "clinic-schedule-oct.pdf · 180 KB"].map((x, i) => (
        <div key={x} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, border: `1px solid ${LINE}`, opacity: pr(f, T.clickFiles + 4 + i * 5, 8) }}><span style={{ width: 30, height: 36, borderRadius: 5, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>PDF</span><span style={{ fontSize: 14, fontWeight: 700, color: INK }}>{x}</span></div>
      ))}
    </div>
  );
};

// ───────── scenes ─────────
const BranchCrowd: React.FC<{ f: number }> = ({ f }) => {
  const created = f >= T.clickSave + 4;
  const dm = f >= T.pickUser + 2 && f < T.clickInfo;
  const unread = f >= T.clickUnread && f < T.clickSearch;
  const items = unread ? BR_ITEMS(f).slice(0, 1).map((i) => ({ ...i, unread: 0 })).concat([{ n: "Marcus Lee", sub: "Can I swap my clinic day?", t: "Yesterday", unread: 1 }]) : BR_ITEMS(f);
  const typing = f >= T.typeMsg && f < T.send ? typed(f, T.typeMsg + 2, WELCOME, 1.3) : f >= T.typeReply && f < T.sendReply ? typed(f, T.typeReply + 2, REPLY, 1.3) : "";
  if (dm) {
    const dmItems: Item[] = [{ n: "Marcus Lee", sub: f >= T.sendDm ? "You: Hi Marcus, your clinical hours…" : "Active now", t: "Now" }, ...BR_ITEMS(f).filter((i) => i.n !== "Marcus Lee")];
    return (
      <ChatShell f={f} rail={0} items={dmItems} sel={0} head={{ n: "Marcus Lee", sub: "Active now" }} input={f >= T.typeDm && f < T.sendDm ? typed(f, T.typeDm + 2, "Hi Marcus, your clinical hours form is missing a signature. Can you send it by Friday?", 1.6) : ""} inputOn={f >= T.typeDm && f < T.sendDm}
        msgs={[{ who: "Marcus Lee", me: false, text: "Can I swap my clinic day?", at: 0 }, { who: "Hannah Price", me: true, text: "Hi Marcus, your clinical hours form is missing a signature. Can you send it by Friday?", at: T.sendDm + 2 }]} />
    );
  }
  return (
    <ChatShell f={f} rail={unread ? 2 : 0} items={items} sel={created ? 0 : -1}
      head={created ? { n: CROWD, sub: "24 members", crowd: true } : { n: "Morning Class — Fall 2026", sub: "31 members", crowd: true }}
      msgs={created ? crowdMsgs(false) : [{ who: "Leila Haddad", me: false, text: "Thanks, see you Monday", at: 0 }]}
      pinned={created && f >= T.clickPin + 4 ? "xray-positioning-guide.pdf" : undefined} pinAt={T.clickPin + 4}
      input={typing} inputOn={!!typing} attach={f >= T.attach && f < T.send + 4} hlMsg={f >= T.hoverMsg && f < T.clickPin + 10 ? 1 : f >= T.hoverReply && f < T.clickReply + 8 ? 2 : undefined}
      replyTo={f >= T.clickReply + 2 && f < T.sendReply ? ANA_Q : undefined} muted={f >= T.clickMute + 4}
      search={f >= T.clickSearch && f < T.clickMute ? typed(f, T.clickSearch + 4, "bitewing", 0.5) : undefined}
      overlay={<><MsgMenu f={f} at={T.hoverMsg + 4} to={T.clickPin + 2} x={180} y={470} hl="Pin" /><MsgMenu f={f} at={T.hoverReply + 2} to={T.clickReply + 2} x={400} y={400} hl="Reply" /><InfoDrawer f={f} />
        {f >= T.attach + 2 && f < T.send && <div style={{ position: "absolute", left: 20, bottom: 84, padding: "8px 12px", borderRadius: 10, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 10px 30px #0002", fontSize: 14, fontWeight: 800, color: INK, opacity: pr(f, T.attach + 2, 8) }}>📄 xray-positioning-guide.pdf · 2.4 MB</div>}
        {f >= T.clickMute - 4 && f < T.clickMute + 30 && <div style={{ position: "absolute", right: 20, top: 66, width: 210, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, zIndex: 4 }}>{["Notifications Off", "Pin Chat", "Create Event"].map((t, i) => <div key={t} style={{ height: 36, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 800, color: i === 0 ? BLUE : INK, background: i === 0 ? "#EEF2FF" : "transparent" }}>{t}</div>)}</div>}
      </>} />
  );
};
const LearnerChat: React.FC<{ f: number }> = ({ f }) => {
  const open = f >= T.lOpen + 2;
  const typing = f >= T.lType && f < T.lSend ? typed(f, T.lType + 2, ANA_Q, 1.2) : "";
  const items: Item[] = [
    { n: CROWD, sub: f >= T.learner2 ? "Hannah: " + REPLY : "Hannah: Guide attached", t: "Now", crowd: true, unread: open ? 0 : 1 },
    { n: "Hannah Price", sub: "See you Thursday!", t: "Mon", c: "#2E64F0" },
    { n: "Study Buddies", sub: "Leila: Quiz at 7?", t: "Sun", crowd: true, c: "#0EA5E9" },
  ];
  return (
    <ChatShell f={f} rail={0} items={items} sel={open ? 0 : -1} head={open ? { n: CROWD, sub: "24 members", crowd: true } : { n: "Hannah Price", sub: "Offline" }}
      msgs={open ? crowdMsgs(true) : [{ who: "Hannah Price", me: false, text: "See you Thursday!", at: 0 }]} pinned={open ? "xray-positioning-guide.pdf" : undefined} pinAt={T.lOpen + 2}
      input={typing} inputOn={!!typing} rec={f >= T.lMic && f < T.lVoice} hlMsg={f >= T.learner2 + 20 ? 4 : undefined} />
  );
};

// ───────── camera + cursor ─────────
const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.clickMenu - 10, 860, 540, 1.04],
  [T.rail, 820, 520, 1.1],
  [S.d2, 960, 540, 1.0],
  [T.typeName, 960, 470, 1.08],
  [T.clickPrivate, 960, 600, 1.08],
  [S.d3, 960, 540, 1.04],
  [T.pickProgram, 960, 600, 1.08],
  [S.d4, 1060, 560, 1.04],
  [T.typeMsg, 1100, 620, 1.1],
  [S.d5, 1100, 520, 1.1],
  [T.learner, 960, 540, 1.0],
  [T.lType, 1100, 600, 1.1],
  [T.back, 960, 540, 1.0],
  [T.clickReply, 1100, 580, 1.1],
  [S.d8, 960, 540, 1.0],
  [T.typeDm, 1100, 600, 1.08],
  [S.d9, 1000, 540, 1.0],
  [T.clickInfo + 10, 1100, 520, 1.08],
  [S.d10, 960, 540, 1.0],
  [T.learner2, 960, 540, 1.0],
  [T.learner2 + 30, 1100, 560, 1.08],
  [PAY_START, 960, 540, 1.0],
]).map(calmK);
const PLUS = MA(INBX + 320, 36);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("My Chats", "Communication")],
  [T.rail, ...MA(...railPt(0))],
  [T.rail + 50, ...MA(...railPt(4))],
  [T.clickCreate, ...PLUS],
  [T.clickNewCrowd, ...menuItemPt(1)],
  [T.typeName, ...NP(380, 269)],
  [T.typeDesc, ...NP(380, 390)],
  [T.clickPrivate, ...NP(200, 506)],
  [T.readOnly, ...NP(54, 596)],
  [T.clickNext, ...NP(NW - 88, NH - 46)],
  [T.scopes, ...NP(300, 157)],
  [T.scopes + 40, ...NP(300, 253)],
  [T.clickDynamic, ...NP(300, 349)],
  [T.pickProgram, ...NP(380, 465)],
  [T.pickSession, ...NP(380, 555)],
  [T.clickSave, ...NP(NW - 108, NH - 46)],
  [T.typeMsg, ...INPUTPT()],
  [T.attach, ...ATTPT()],
  [T.send, ...SENDPT()],
  [T.hoverMsg, ...B(650, 640)],
  [T.clickPin, ...B(265, 470 + MENU_ROW(3))],
  [T.learner + 20, 1500, 860],
  [T.lOpen, ...MA(INBX + 180, 96 + 35)],
  [T.lType, ...INPUTPT()],
  [T.lSend, ...SENDPT()],
  [T.lMic, ...MICPT()],
  [T.lVoice, ...SENDPT()],
  [T.hoverReply, ...B(250, 567)],
  [T.clickReply, ...B(485, 400 + MENU_ROW(0))],
  [T.typeReply, ...INPUTPT()],
  [T.sendReply, ...SENDPT()],
  [T.clickCreate2, ...PLUS],
  [T.clickNewChat, ...menuItemPt(0)],
  [T.searchUser, ...MA(INBX + 150, 36)],
  [T.pickUser, ...MA(INBX + 180, 96 + 35)],
  [T.typeDm, ...INPUTPT()],
  [T.sendDm, ...SENDPT()],
  [T.clickInfo, ...B(BODYW - 20 - 20, 35)],
  [T.roles, ...MA(1290, 210)],
  [T.clickFiles, ...MA(1350 - 22 - 76 - 38, 140)],
  [T.clickUnread, ...MA(...railPt(2))],
  [T.clickSearch, ...B(BODYW - 20 - 40 * 3 - 36 - 20, 35)],
  [T.clickMute, ...B(BODYW - 20 - 40 - 12 - 20, 35)],
  [T.learner2 + 20, 1500, 860],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "My Chats" },
  { at: S.d2, to: S.d3, label: "Create a crowd" },
  { at: S.d3, to: S.d4, label: "Choose the members" },
  { at: S.d4, to: T.learner, label: "Post, attach, pin" },
  { at: T.learner, to: T.back, label: "The learner joins in" },
  { at: T.back, to: S.d8, label: "Reply to the question" },
  { at: S.d8, to: S.d9, label: "One-to-one chat" },
  { at: S.d9, to: S.d10, label: "Members, roles, files" },
  { at: S.d10, to: T.learner2, label: "Filter, search, mute" },
  { at: T.learner2, to: PAY_START, label: "What the learner sees" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const isL = (f >= T.learner && f < T.back) || f >= T.learner2;
  const searchingUser = f >= T.searchUser && f < T.pickUser + 2;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {isL ? (
          <LandWin f={f} inAt={f >= T.learner2 ? T.learner2 : T.learner} url="learner.brightsmile.example.com/chat" learner who="Ana" prog="Dental Assisting — Fall 2026" active="Chat" main={<LearnerChat f={f} />} />
        ) : (
          <LandWin f={f} inAt={f >= T.back ? T.back : T.appIn} url="academy.skillbnk.com/my-chats" branch="BrightSmile Downtown" active={f >= T.clickMenu ? "My Chats" : "Dashboard"} openGroup="Communication"
            main={<>
              <BranchCrowd f={f} />
              <CreateMenu f={f} at={T.clickCreate} pick={T.clickNewCrowd} which="crowd" />
              <CreateMenu f={f} at={T.clickCreate2} pick={T.clickNewChat} which="chat" />
              {searchingUser && (
                <div style={{ position: "absolute", left: INBX, top: 0, width: INBW, height: "100%", background: "#fff", borderRight: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box", fontFamily: FONT, zIndex: 5 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: INK }}>New Chat</div>
                  <div style={{ marginTop: 10, height: 44, borderRadius: 11, border: `2px solid ${BLUE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 600, color: INK }}>⌕ {typed(f, T.searchUser + 4, "Marcus", 0.4) || <span style={{ color: "#9CA3AF" }}>Search User</span>}</div>
                  {["Marcus Lee", "Marcus Bell"].map((n, i) => <div key={n} style={{ marginTop: 10, height: 60, borderRadius: 12, background: i === 0 && f >= T.pickUser - 8 ? "#EEF2FF" : "transparent", display: "flex", alignItems: "center", gap: 10, padding: "0 10px", opacity: pr(f, T.searchUser + 20 + i * 5, 8) }}><Avatar t={n.split(" ").map((w) => w[0]).join("")} s={40} c1="#16A34A" c2="#15803D" /><div><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{n}</div><div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? "#16A34A" : GRAY }}>{i === 0 ? "Online" : "Offline"} · Learner</div></div></div>)}
                </div>
              )}
            </>}
            overlay={<><CrowdModal f={f} /><Toast f={f} at={T.clickSave + 3} text="Crowd created successfully" d={60} /><Toast f={f} at={T.clickPin + 3} text="Message pinned successfully!" d={50} /></>} />
        )}
        <Scribble f={f} at={T.rail + 4} d={16} out={T.rail + 70} kind="ring" x={MA(32, 0)[0]} y={MA(0, 150)[1]} w={80} h={300} seed={5} worldW={1920} worldH={1080} />
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
const HK = { three: cue("h0", "three"), midnight: cue("h0", "midnight"), buried: cue("h0", "buried"), five: cue("h0", "five") };
const APPS: [string, string, string][] = [["WhatsApp", "#22C55E", "Ana: do we angle the tube +10°??"], ["Text", "#3B82F6", "Marcus: can I swap clinic day"], ["Email", "#F59E0B", "Priya: question about bitewings"]];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.midnight - 6, HK.five + 20);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <HookTag f={f} text="BrightSmile Dental Assistant School · 11:58 pm" />
      {APPS.map(([a, c, m], i) => {
        const s = Math.min(1, sp(f, 4 + i * 6, 30, { damping: 16 }));
        return (
          <div key={a} style={{ position: "absolute", left: 230 + i * 500, top: 200, width: 440, height: 560, borderRadius: 40, background: "#0B1220", border: "3px solid #334155", boxShadow: "0 40px 100px #000C", opacity: s, transform: `translateY(${(1 - s) * 60}px) rotate(${(i - 1) * 3}deg)`, padding: 22, boxSizing: "border-box" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{a}</div>
            <div style={{ position: "absolute", right: 22, top: 20, minWidth: 30, height: 30, borderRadius: 15, background: "#EF4444", color: "#fff", fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{Math.max(1, Math.min(5, Math.floor((f - 10 - i * 4) / 27) + 1)) + (f >= HK.buried ? Math.floor((f - HK.buried) / 8) : 0)}</div>
            {Array.from({ length: 5 }).map((_, k) => { const at = 10 + (k * 3 + i) * 9; const old = f >= HK.buried && k < 2; return <div key={k} style={{ marginTop: 16, padding: "12px 14px", borderRadius: 14, background: k === 0 ? "#1D4ED8" : "#1E293B", fontSize: 16, fontWeight: 700, color: "#E2E8F0", opacity: pr(f, at, 8) * (old ? 0.35 : 1), transform: `translateY(${(1 - pr(f, at, 8)) * 18}px)` }}>{k === 0 ? m : ["ok thanks", "same question here", "is this on the test?", "👍"][k - 1]}<span style={{ float: "right", fontSize: 12, color: "#94A3B8" }}>{["11:58 pm", "11:59 pm", "12:01 am", "12:03 am", "12:04 am"][k]}</span></div>; })}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 820, width: 1920, textAlign: "center", fontSize: 50, fontWeight: 900, color: "#FCA5A5", opacity: pr(f, HK.five - 4, 14) }}>Same answer, typed {f >= HK.five ? 5 : 1}×</div>
    </AbsoluteFill>
  );
};

const PY = { place: cue("p12", "place"), once: cue("p12", "once"), whole: cue("p12", "whole") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 560, top: 150, width: 800, height: 400, borderRadius: 24, background: "#F8FAFC", boxShadow: "0 40px 120px #000C", padding: 28, boxSizing: "border-box", opacity: pr(f, PY.place - 6, 14) }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: INK }}>👥 {CROWD}</div>
      {BUBBLE({ who: "Ana Lopez", me: false, text: ANA_Q, at: PY.place }, f, 0)}
      {BUBBLE({ who: "Hannah Price", me: true, text: REPLY, reply: ANA_Q, at: PY.once }, f, 1)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 620, width: 1920, display: "flex", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ opacity: pr(f, PY.whole - 8 + i * 2, 10) }}><Avatar t={"ABCDEFGHJKLM"[i] + "P"} s={68} c1="#16A34A" c2="#15803D" /></div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 740, width: 1920, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.whole - 4, 14) }}>Answered once. Seen by the whole class.</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.midnight, "pop", 0.3); add(HK.buried, "riser", 0.25); add(HK.five, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 14; i++) add(T.typeName + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  for (let i = 0; i < 14; i++) add(T.typeMsg + 2 + i * 2, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.clickSave + 4, "chime", 0.5); add(T.send + 2, "pop", 0.4); add(T.clickPin + 4, "ding", 0.35);
  add(T.lSend + 2, "pop", 0.4); add(T.lVoice + 2, "pop", 0.4); add(T.sendReply + 2, "pop", 0.4); add(T.sendDm + 2, "pop", 0.4);
  add(T.learner, "whoosh", 0.35); add(T.back, "whoosh", 0.3); add(T.learner2, "whoosh", 0.3); add(PAY_START - 3, "whoosh", 0.4); add(PY.whole, "chime", 0.5);
  return a;
})();

export const ChatStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="chatstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.learner, T.back, T.learner2]} />;
};
