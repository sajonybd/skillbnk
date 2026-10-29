import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { StepChipL, PortalTagL, MA, BLUE, INK, GRAY, LINE, Avatar } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, Toast, StoryMain, Fx } from "./storyShell";
import { LandFull, fitKey, fitPts } from "./screenKit";
import { Sw } from "./dashKit";

/**
 * NotificationsStoryVideo — DEEP (sheet serial 54, Notifications & Preferences). Story: Maya, Brightline Dental Assistant School (fictional).
 * Verified in code: SB-Branch shared/NotificationMenu (bell → "Notifications" list, unread marker, click = mark read + open item, "All
 * Notifications"), pageList/notifications/NotificationsComponent ("Notifications List", "Mark all as Read", title + text + time ago),
 * shared/Navbar profile menu (My Profile, Notification Preferences, "Notification" sound switch → toast "Notification Off"), pageList/Profile/
 * NotificationPreferences ("Notification Preferences", "Manage how you receive notifications across different channels", channels push /
 * web / chat / email / SMS with "All Turn On" / "All Turn Off", rows = notification types, "Not Available" where a channel does not apply,
 * "Save Changes" → "Save changes successfully"). Row titles + available channels from skillbnk-backend ms-notification-service
 * helper/notificationRoles.ts. Learner: NotificationPreferencesPage ("Notification Center", categories Account / Content / Calendar / Billing /
 * Education / Organization / Other, Quick Actions "Enable All in" / "Disable All in", Billing = Transaction Status Updated, Order Status
 * Changed, Order Transaction Status Updated, Invoice Sent).
 * Voice: python3 generate-voice-story.py src/NotificationsStoryVideo.tsx public/notifstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "p11"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 470, d1: 230, d2: 220, d3: 230, d4: 190, d5: 330, d6: 250, d7: 330, d8: 120, d9: 210, d10: 300, p11: 220,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = [];
// @WT-BEGIN
const WT: Record<string, number[]> = {};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Maya runs a dental assistant school. Her phone buzzes all day: a new slide, a template, a profile update. A hundred and forty alerts by noon. So when a new enrollment came in, and a payment waited for review, she missed both.",
  d1: "In skillbank, every alert lands in one place. Maya clicks the bell and sees what's new, with unread alerts marked.",
  d2: "Each alert says what happened, and when. One click opens the exact item, and marks it as read.",
  d3: "All notifications shows the full list, newest first. Mark all as read clears the rest in one go.",
  d4: "Now, the noise. From her profile menu, she opens notification preferences.",
  d5: "Every type of alert has its own row, with five channels: push, web, chat, email, and SMS. Where a channel doesn't apply, it simply says not available.",
  d6: "She turns on email and SMS for new enrollment, and email for payment status updated.",
  d7: "For a whole channel, one click does it. All turn off silences push on every row. Then she turns push back on, only for new enrollment and new transaction.",
  d8: "Save changes. Done.",
  d9: "And in a meeting, the notification switch in the same menu mutes the alert sound.",
  d10: "Learners get the same control in their notification center. Billing, calendar, education: each category has its own switches, for every channel.",
  p11: "Fewer alerts. The right ones. Nothing important missed. And as the school grows, the noise doesn't.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  bell: cue("d1", "bell", -6),
  unread: cue("d1", "unread", -4),
  what: cue("d2", "happened", -4),
  open: cue("d2", "opens", -2),
  all: cue("d3", "all", -4),
  list: cue("d3", "all", 10),
  markAll: cue("d3", "mark", -2),
  prof: cue("d4", "profile", -4),
  prefMenu: cue("d4", "preferences", -6),
  pref: S.d5,
  rows: cue("d5", "row", -4),
  ch: cue("d5", "push", -4),
  na: cue("d5", "available", -10),
  enEmail: cue("d6", "email", -2),
  enSms: cue("d6", "sms", -2),
  payEmail: cue("d6", "email", -2, 1),
  allOff: cue("d7", "silences", -8),
  backOn: cue("d7", "back", -4),
  enPush: cue("d7", "enrollment", -4),
  txPush: cue("d7", "transaction", -4),
  save: cue("d8", "save", 0),
  mute: cue("d9", "switch", -4),
  muted: cue("d9", "mutes", 0),
  learner: S.d10,
  billing: cue("d10", "billing", -4),
  lSw: cue("d10", "switches", -4),
};
const CLICKS = [T.bell, T.open, T.all, T.markAll, T.prof, T.prefMenu, T.enEmail, T.enSms, T.payEmail, T.allOff, T.enPush, T.txPush, T.save, T.prof + 0.5, T.mute, T.billing];

// ───────── data ─────────
type Alert = { t: string; x: string; when: string; c1: string; important?: boolean };
const ALERTS: Alert[] = [
  { t: "New Enrollment", x: "Hannah Price enrolled in Dental Assistant — Evening", when: "2 minutes ago", c1: "#16A34A", important: true },
  { t: "New Transaction Created", x: "Luis Ortega paid $450.00 by bank transfer — waiting for review", when: "14 minutes ago", c1: "#F59E0B", important: true },
  { t: "Mock Interview Submitted", x: "Ava Chen submitted Front Desk Interview", when: "38 minutes ago", c1: "#6366F1" },
  { t: "New Day to Day Activity Created", x: "Dr. Patel posted today's chairside lab update", when: "1 hour ago", c1: "#0EA5E9" },
  { t: "Student Document Created", x: "Noah Kim uploaded Infection Control Checklist", when: "2 hours ago", c1: "#64748B" },
  { t: "Show & Tell Created", x: "Grace Liu shared a new Show and Tell", when: "3 hours ago", c1: "#64748B" },
  { t: "Calendar Event Rescheduled", x: "Radiography Practicum moved to Thursday 6 PM", when: "5 hours ago", c1: "#64748B" },
  { t: "Profile Updated", x: "Your profile has been updated successfully.", when: "yesterday", c1: "#64748B" },
];
type Ch = "push" | "web" | "chat" | "email" | "sms";
const CH: Ch[] = ["push", "web", "chat", "email", "sms"];
const ROWS: [string, Ch[]][] = [
  ["Password Updated", ["push", "web", "chat", "email", "sms"]],
  ["Profile Updated", ["push", "web", "chat", "email"]],
  ["Show & Tell Created", ["web", "chat"]],
  ["Student Document Created", ["web", "chat"]],
  ["New Calendar Event Created", ["web", "chat", "push", "email"]],
  ["Calendar Event Rescheduled", ["web", "chat", "push", "email"]],
  ["New Day to Day Activity Created", ["web", "push", "chat"]],
  ["New Transaction Created", ["web", "push", "chat"]],
  ["Payment Status Updated", ["web", "push", "chat", "email"]],
  ["New Enrollment", ["web", "push", "chat", "email", "sms"]],
  ["Enrollment Status Updated", ["web", "push", "chat", "email", "sms"]],
  ["Mock Interview Submitted", ["web", "push", "chat"]],
];
const R_EN = 9, R_PAY = 8, R_TX = 7;
/** current switch state for row r / channel c */
const isOn = (f: number, r: number, c: Ch): boolean => {
  if (!ROWS[r][1].includes(c)) return false;
  let on = c === "push" || c === "web" || c === "chat";
  if (r === R_EN && c === "email" && f >= T.enEmail) on = true;
  if (r === R_EN && c === "sms" && f >= T.enSms) on = true;
  if (r === R_PAY && c === "email" && f >= T.payEmail) on = true;
  if (c === "push" && f >= T.allOff) on = (r === R_EN && f >= T.enPush) || (r === R_TX && f >= T.txPush);
  return on;
};

// ───────── header-anchored menus (main-area coords; header sits at y -60..0) ─────────
const BELL_X = 1268, AV_X = 1310;
const BellMenu: React.FC<{ f: number }> = ({ f }) => {
  if (f < T.bell || f >= T.all + 10) return null;
  const read0 = f >= T.open + 4;
  return (
    <div style={{ position: "absolute", right: 20, top: 6, width: 470, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 24px 60px #0f172a33", fontFamily: FONT, zIndex: 8, opacity: pr(f, T.bell, 8) * (1 - lin(f, T.all + 2, T.all + 10)), overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${LINE}`, fontSize: 17, fontWeight: 800, color: INK, display: "flex", justifyContent: "space-between" }}>Notifications<span style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: "#EF4444", borderRadius: 999, padding: "2px 8px" }}>{read0 ? 2 : 3} new</span></div>
      {ALERTS.slice(0, 5).map((a, i) => {
        const unread = i < 3 && !(i === 0 && read0);
        const on = (i === 0 && f >= T.open - 14 && f < T.open + 14) || (f >= T.what && f < T.open - 14 && i === 1);
        return (
          <div key={a.t} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 18px", borderBottom: "1px solid #F1F5F9", background: on ? "#EEF2FF" : unread ? "#F8FAFF" : "#fff" }}>
            <Avatar t={a.t.split(" ").map((w) => w[0]).join("").slice(0, 2)} s={36} c1={a.c1} c2={a.c1} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{a.t}</div>
              <div style={{ fontSize: 13, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.x}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{a.when}</div>
            </div>
            {unread && <span style={{ width: 10, height: 10, borderRadius: 5, background: BLUE, boxShadow: f >= T.unread && f < T.what ? "0 0 0 5px #C7D2FE" : "none" }} />}
          </div>
        );
      })}
      <div style={{ padding: 12, textAlign: "center", fontSize: 14, fontWeight: 800, color: BLUE, background: f >= T.all - 6 ? "#EEF2FF" : "#fff" }}>All Notifications</div>
    </div>
  );
};
const ProfileMenu: React.FC<{ f: number }> = ({ f }) => {
  const a1 = f >= T.prof && f < T.pref, a2 = f >= T.mute - 18 && f < T.muted + 30;
  if (!a1 && !a2) return null;
  const at = a1 ? T.prof : T.mute - 18;
  const soundOn = !(f >= T.muted);
  return (
    <div style={{ position: "absolute", right: 16, top: 6, width: 280, padding: 8, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 44px #0f172a33", fontFamily: FONT, zIndex: 8, opacity: pr(f, at, 6) }}>
      {[["👤", "My Profile"], ["🔔", "Notification Preferences"]].map(([ic, t], i) => <div key={t} style={{ height: 42, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", borderRadius: 8, fontSize: 15, color: "#374151", background: i === 1 && a1 && f >= T.prefMenu - 10 ? "#EEF2FF" : "transparent", fontWeight: i === 1 && a1 && f >= T.prefMenu - 10 ? 800 : 500 }}>{ic} {t}</div>)}
      <div style={{ height: 42, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", borderRadius: 8, fontSize: 15, color: "#374151", background: a2 ? "#F8FAFC" : "transparent" }}><span>🔔 Notification</span><Sw on={soundOn} hl={a2 && f >= T.mute - 4} /></div>
      <div style={{ height: 42, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontSize: 15, color: "#374151" }}>⎋ Sign out</div>
    </div>
  );
};

// ───────── pages ─────────
const Home: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#F5F7FB", fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 24, top: 18, fontSize: 24, fontWeight: 800, color: INK }}>Branch workspace</div>
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 660, top: 66, width: 642, height: 300, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}` }} />)}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 660, top: 384, width: 642, height: 300, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}` }} />)}
  </div>
);
const ListPage: React.FC<{ f: number }> = ({ f }) => {
  const cleared = f >= T.markAll + 6;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 24, top: 16, fontSize: 22, fontWeight: 800, color: INK }}>Notifications List</div>
      <div style={{ position: "absolute", right: 24, top: 12, height: 40, padding: "0 16px", borderRadius: 8, background: f >= T.markAll - 2 && f < T.markAll + 8 ? "#1E3A8A" : BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", boxShadow: f >= T.markAll - 20 && f < T.markAll + 10 ? "0 0 0 4px #C7D2FE" : "none" }}>Mark all as Read</div>
      <div style={{ position: "absolute", left: 24, right: 24, top: 66, bottom: 10, borderRadius: 12, background: "#F1F5F9", padding: 12 }}>
        {ALERTS.slice(0, 8).map((a, i) => {
          const unread = !cleared && i > 0 && i < 4;
          return (
            <div key={a.t} style={{ display: "flex", alignItems: "center", gap: 14, height: 70, marginBottom: 12, padding: "0 16px", borderRadius: 10, background: "#fff", boxShadow: "0 1px 2px #0000000f", opacity: pr(f, T.list + i * 3, 8) }}>
              <Avatar t={a.t.split(" ").map((w) => w[0]).join("").slice(0, 2)} s={40} c1={a.c1} c2={a.c1} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{a.t}</div><div style={{ fontSize: 14, color: GRAY }}>{a.x}</div></div>
              <span style={{ fontSize: 14, color: "#6B7280" }}>{a.when}</span>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: unread ? BLUE : "transparent", transform: `scale(${unread ? 1 : 0})` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
const COLW = 196, NAMEW = 1302 - 5 * COLW;
const PrefPage: React.FC<{ f: number }> = ({ f }) => {
  const hl = (a: number, b: number) => f >= a && f < b;
  const cellHl = (r: number, c: Ch) => (r === R_EN && c === "email" && hl(T.enEmail - 6, T.enEmail + 18)) || (r === R_EN && c === "sms" && hl(T.enSms - 6, T.enSms + 18)) || (r === R_PAY && c === "email" && hl(T.payEmail - 6, T.payEmail + 18)) || (r === R_EN && c === "push" && hl(T.enPush - 6, T.enPush + 18)) || (r === R_TX && c === "push" && hl(T.txPush - 6, T.txPush + 18));
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 0, height: 78, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ position: "absolute", left: 0, top: 14, fontSize: 21, fontWeight: 800, color: INK }}>Notification Preferences</div>
        <div style={{ position: "absolute", left: 0, top: 46, fontSize: 14, color: GRAY }}>Manage how you receive notifications across different channels</div>
        <div style={{ position: "absolute", right: 0, top: 20, height: 36, padding: "0 14px", borderRadius: 8, background: f >= T.save - 2 && f < T.save + 10 ? "#1E3A8A" : BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: hl(T.save - 14, T.save + 12) ? "0 0 0 4px #C7D2FE" : "none" }}>{f >= T.save && f < T.save + 10 ? "◌ Saving..." : "💾 Save Changes"}</div>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, top: 96 }}>
        <div style={{ display: "flex", height: 50, borderRadius: "6px 6px 0 0", background: BLUE, color: "#fff", fontSize: 15, fontWeight: 600 }}>
          <div style={{ width: NAMEW, padding: "0 16px", display: "flex", alignItems: "center", borderRight: "1px solid #ffffff44" }}>Notification</div>
          {CH.map((c, i) => (
            <div key={c} style={{ width: COLW, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", borderRight: i < 4 ? "1px solid #ffffff44" : "none", background: hl(T.ch + i * 7, T.ch + i * 7 + 12) || (c === "push" && hl(T.allOff - 18, T.allOff + 16)) ? "#ffffff26" : "transparent" }}>
              <span style={{ textTransform: c === "sms" ? "none" : "capitalize" }}>{c === "sms" ? "SMS" : c}</span>
              <span style={{ display: "flex", gap: 8, fontSize: 15 }}><span title="All Turn On">✓</span><span style={{ borderRadius: 6, padding: "0 4px", background: c === "push" && hl(T.allOff - 6, T.allOff + 10) ? "#ffffff55" : "transparent" }}>⊘</span></span>
            </div>
          ))}
        </div>
        {ROWS.map(([name, chs], r) => {
          const rowOn = (r === R_EN && hl(T.enEmail - 10, T.allOff - 10)) || (r === R_PAY && hl(T.payEmail - 8, T.payEmail + 24)) || hl(T.rows + r * 3, T.rows + r * 3 + 8);
          return (
            <div key={name} style={{ display: "flex", height: 47, borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, background: rowOn ? "#F5F7FF" : "#fff" }}>
              <div style={{ width: NAMEW, padding: "0 16px", display: "flex", alignItems: "center", fontSize: 15, color: INK, fontWeight: r === R_EN || r === R_TX || r === R_PAY ? 700 : 500, borderRight: `1px solid ${LINE}` }}>{name}</div>
              {CH.map((c, i) => (
                <div key={c} style={{ width: COLW, display: "flex", alignItems: "center", justifyContent: "center", borderRight: i < 4 ? `1px solid ${LINE}` : "none" }}>
                  {chs.includes(c) ? <span style={{ borderRadius: 14, boxShadow: cellHl(r, c) ? "0 0 0 4px #C7D2FE" : "none" }}><Sw on={isOn(f, r, c)} /></span> : <span style={{ fontSize: 13, color: "#9CA3AF", background: hl(T.na, T.enEmail - 10) ? "#FEF3C7" : "transparent", padding: "2px 6px", borderRadius: 4 }}>Not Available</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const LCATS: [string, string][] = [["Account", "#8B5CF6"], ["Content", "#06B6D4"], ["Calendar", "#10B981"], ["Billing", "#F59E0B"], ["Education", "#14B8A6"], ["Organization", "#6366F1"], ["Other", "#F43F5E"]];
const LROWS: string[] = ["Transaction Status Updated", "Order Status Changed", "Order Transaction Status Updated", "Invoice Sent"];
const LearnerCenter: React.FC<{ f: number }> = ({ f }) => {
  const cat = f >= T.billing ? 3 : 2;
  const rows = cat === 3 ? LROWS : ["Calendar Event Created", "Calendar Event Rescheduled", "Calendar Event Invitation", "Calendar Reminder"];
  const on = (r: number, c: number) => (c < 2 ? true : c === 3 ? r !== 1 : r === 0 && f >= T.lSw + 10);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F8FAFC", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 24, top: 14, fontSize: 24, fontWeight: 800, color: INK }}>Notification Center</div>
      <div style={{ position: "absolute", left: 24, top: 50, fontSize: 14, color: GRAY }}>Customize your notification settings to stay informed your way.</div>
      <div style={{ position: "absolute", right: 24, top: 18, height: 38, padding: "0 16px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center" }}>Save Changes</div>
      <div style={{ position: "absolute", left: 24, top: 92, width: 300, height: 600, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Categories</div><div style={{ fontSize: 12, color: GRAY, marginBottom: 10 }}>Select a category to manage</div>
        {LCATS.map(([n, c], i) => <div key={n} style={{ height: 44, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", borderRadius: 10, marginBottom: 4, background: cat === i ? `linear-gradient(90deg, ${c}, ${c}cc)` : "transparent", color: cat === i ? "#fff" : "#374151", fontSize: 15, fontWeight: 700, boxShadow: i === 3 && f >= T.billing - 14 && f < T.billing + 6 ? "0 0 0 4px #FDE68A" : "none" }}><span style={{ width: 26, height: 26, borderRadius: 8, background: cat === i ? "#ffffff33" : `${c}22` }} />{n}</div>)}
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 800, color: INK }}>Quick Actions</div>
        <div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>Enable All in Push · Disable All in SMS</div>
      </div>
      <div style={{ position: "absolute", left: 340, right: 24, top: 92, height: 420, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, padding: 18, boxSizing: "border-box" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{LCATS[cat][0]} Notifications</div>
        <div style={{ fontSize: 13, color: GRAY, marginBottom: 14 }}>Manage how you receive {LCATS[cat][0].toLowerCase()} notifications</div>
        <div style={{ display: "flex", height: 40, alignItems: "center", background: "#F8FAFC", borderRadius: 8, fontSize: 13, fontWeight: 800, color: GRAY }}>
          <div style={{ width: 380, padding: "0 12px" }}>Notification Type</div>{["Push", "Web", "Chat", "Email", "SMS"].map((c) => <div key={c} style={{ width: 120, textAlign: "center" }}>{c}</div>)}
        </div>
        {rows.map((r, i) => (
          <div key={r} style={{ display: "flex", height: 64, alignItems: "center", borderBottom: "1px solid #F1F5F9", fontSize: 15, color: INK, opacity: pr(f, (cat === 3 ? T.billing : T.learner) + i * 4, 8) }}>
            <div style={{ width: 380, padding: "0 12px", fontWeight: 700 }}>{r}</div>
            {[0, 1, 2, 3, 4].map((c) => <div key={c} style={{ width: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}><span style={{ borderRadius: 14, boxShadow: cat === 3 && i === 0 && c === 4 && f >= T.lSw && f < T.lSw + 30 ? "0 0 0 4px #FDE68A" : "none" }}><Sw on={on(i, c)} /></span><span style={{ fontSize: 10, color: GRAY }}>{on(i, c) ? "On" : "Off"}</span></div>)}
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────── demo ─────────
type Sc = "home" | "list" | "pref" | "learner";
const scAt = (f: number): Sc => (f < T.list ? "home" : f < T.pref ? "list" : f < T.learner ? "pref" : "learner");
const PCOL = (c: number) => 24 + NAMEW + c * COLW + COLW / 2;
const PROW = (r: number) => 96 + 50 + r * 47 + 23;
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.bell, 1340, 380, 1.15], [T.open, 1340, 360, 1.15], [T.list, 960, 520, 1.0], [T.markAll, 1300, 320, 1.1],
  [T.prof, 1360, 300, 1.15], [T.pref + 4, 960, 520, 1.0], [T.rows, 760, 560, 1.1], [T.ch, 1200, 320, 1.12], [T.na, 1000, 460, 1.05],
  [T.enEmail - 10, 1300, 760, 1.15], [T.payEmail, 1300, 720, 1.15], [T.allOff - 12, 1000, 320, 1.12], [T.enPush - 6, 900, 700, 1.12],
  [T.save - 10, 1400, 300, 1.15], [T.mute - 14, 1380, 300, 1.15], [T.learner + 4, 960, 520, 1.0], [T.billing, 700, 520, 1.12], [T.lSw, 1100, 460, 1.1], [PAY_START, 960, 540, 1.0],
]).map(fitKey);
const CUR: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.bell, ...MA(BELL_X, -30)], [T.unread, ...MA(1310, 6 + 52 + 3 * 92)], [T.open, ...MA(1100, 6 + 52 + 46)],
  [T.all - 8, ...MA(1110, 6 + 52 + 5 * 92 + 22)], [T.all, ...MA(1110, 6 + 52 + 5 * 92 + 22)],
  [T.markAll - 10, ...MA(1250, 32)], [T.markAll, ...MA(1250, 32)],
  [T.prof, ...MA(AV_X, -30)], [T.prefMenu, ...MA(1180, 6 + 8 + 42 + 21)],
  [T.rows, ...MA(200, PROW(4))], [T.ch, ...MA(PCOL(0), 96 + 25)], [T.na + 10, ...MA(PCOL(3), PROW(2))],
  [T.enEmail, ...MA(PCOL(3), PROW(R_EN))], [T.enSms, ...MA(PCOL(4), PROW(R_EN))], [T.payEmail, ...MA(PCOL(3), PROW(R_PAY))],
  [T.allOff, ...MA(24 + NAMEW + COLW - 30, 96 + 25)], [T.enPush, ...MA(PCOL(0), PROW(R_EN))], [T.txPush, ...MA(PCOL(0), PROW(R_TX))],
  [T.save - 8, ...MA(1270, 38)], [T.save, ...MA(1270, 38)],
  [T.mute - 18, ...MA(AV_X, -30)], [T.mute, ...MA(1290, 6 + 8 + 2 * 42 + 21)],
  [T.learner + 10, ...MA(700, 500)], [T.billing, ...MA(24 + 150, 92 + 60 + 3 * 48 + 22)], [T.lSw, ...MA(340 + 18 + 380 + 4 * 120 + 60, 92 + 18 + 74 + 40 + 32)],
  [PAY_START - 10, 1560, 880],
]);
const STEPS = [
  { at: T.bell, to: T.all, label: "The bell" },
  { at: T.all, to: T.prof, label: "All notifications" },
  { at: T.prof, to: T.enEmail - 10, label: "Notification preferences" },
  { at: T.enEmail - 10, to: T.allOff - 12, label: "Turn on what matters" },
  { at: T.allOff - 12, to: T.mute - 18, label: "Quiet the rest, save" },
  { at: T.mute - 18, to: T.learner, label: "Mute the sound" },
  { at: T.learner, to: PAY_START, label: "Learners choose too" },
];
const Demo: React.FC<{ f: number }> = ({ f }) => {
  const sc = scAt(f);
  const learner = sc === "learner";
  const main = sc === "home" ? <Home /> : sc === "list" ? <ListPage f={f} /> : sc === "pref" ? <PrefPage f={f} /> : <LearnerCenter f={f} />;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#F8FAFC" }}>
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]} calm={0.999}>
        <LandFull f={f} at={learner ? T.learner : DEMO_START} learner={learner} who="HP" prog="Dental Assistant — Evening"
          url={learner ? "learner.skillbnk.com/notification-preferences" : sc === "pref" ? "brightline.skillbnk.com/notification-preferences" : sc === "list" ? "brightline.skillbnk.com/notifications" : "brightline.skillbnk.com/dashboard"}
          branch="Brightline Dental Assistant School" active={learner ? "" : "Dashboard"}
          main={<>{main}{!learner && <><BellMenu f={f} /><ProfileMenu f={f} /></>}</>}
          overlay={<><Toast f={f} at={T.save + 10} text="Save changes successfully" d={40} /><Toast f={f} at={T.muted + 2} text="Notification Off" d={40} /></>} />
        <Cursor f={f} pts={fitPts(CUR)} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

// ───────── hook: the alert avalanche ─────────
const HK = { buzz: cue("h0", "buzzes"), slide: cue("h0", "slide"), tmpl: cue("h0", "template"), hundred: cue("h0", "hundred"), enroll: cue("h0", "enrollment"), payment: cue("h0", "payment"), missed: cue("h0", "missed") };
const NOISE = ["New Slide Created", "Template Created", "Profile Updated", "New media received", "Show & Tell Created", "Content Created", "Diagram Created", "Important Link Created", "Student Document Created", "Slide Created", "Day to Day Activity", "Template Created"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.enroll - 10, HK.missed + 30);
  const count = Math.round(140 * lin(f, HK.buzz, HK.hundred + 10));
  const rain = (i: number) => HK.buzz + i * 5;
  const pileY = (i: number) => 900 - Math.floor(i / 6) * 58;
  const n = 60;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 60, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#38BDF8" }}>BRIGHTLINE DENTAL ASSISTANT SCHOOL</div>
          <div style={{ marginTop: 6, fontSize: 56, fontWeight: 900, color: "#F8FAFC" }}>Alerts today: <span style={{ color: count > 100 ? "#F87171" : "#FDE68A", fontFamily: "monospace" }}>{count}</span></div>
        </div>
        {/* the tray where alerts land */}
        <div style={{ position: "absolute", left: 360, top: 360, width: 1200, height: 640, borderRadius: 30, border: "4px dashed #334155", opacity: pr(f, HK.buzz - 4, 10) }} />
        {Array.from({ length: n }).map((_, i) => {
          const a = rain(i);
          if (f < a) return null;
          const k = pr(f, a, 14);
          const col = i % 6;
          const imp = i === 30 || i === 33; // the two that matter, buried later
          const isEn = i === 30;
          const tx = 400 + col * 190 + ((i * 37) % 30), ty = pileY(i) - 60;
          const showImp = imp && f >= (isEn ? HK.enroll : HK.payment) - 4;
          return (
            <div key={i} style={{ position: "absolute", left: tx, top: 300 + (ty - 300) * k - (1 - k) * 200, width: 180, height: 50, boxSizing: "border-box", borderRadius: 12, background: showImp ? "#FEF3C7" : "#E2E8F0", border: `3px solid ${showImp ? "#F59E0B" : "#94A3B8"}`, fontSize: 14, fontWeight: 800, color: showImp ? "#92400E" : "#475569", padding: "6px 10px", whiteSpace: "nowrap", overflow: "hidden", transform: `rotate(${((i * 53) % 12) - 6}deg)`, boxShadow: showImp && f < HK.missed ? "0 0 30px #F59E0B" : "0 6px 14px #0006", zIndex: i }}>🔔 {showImp ? (isEn ? "New Enrollment" : "Payment to review") : NOISE[i % NOISE.length]}</div>
          );
        })}
      </Stage>
      <Stamp f={f} at={HK.missed + 2} x={960} y={250} text="MISSED: 2 THAT MATTERED" size={52} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.slide, "A new slide. A template. A profile update.", "profile update"], [HK.hundred, "140 alerts by noon.", "140 alerts"], [HK.enroll, "A new enrollment, and a payment to review…", "new enrollment"], [HK.missed, "…buried and missed.", "missed"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff: value + example outcome ─────────
const PY = { fewer: cue("p11", "fewer"), right: cue("p11", "right"), missed: cue("p11", "missed"), grows: cue("p11", "grows") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(56,189,248,0.2), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 0, top: 210, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
      <div style={{ textAlign: "center", opacity: pr(f, PY.fewer - 6, 10) }}><div style={{ fontSize: 130, fontWeight: 900, color: "#64748B", textDecoration: "line-through", fontFamily: "monospace" }}>140</div><div style={{ fontSize: 30, fontWeight: 800, color: "#94A3B8" }}>alerts a day</div></div>
      <div style={{ fontSize: 80, color: "#38BDF8", opacity: pr(f, PY.fewer, 10) }}>→</div>
      <div style={{ textAlign: "center", opacity: pr(f, PY.right - 4, 10) }}><div style={{ fontSize: 130, fontWeight: 900, color: "#FDE68A", fontFamily: "monospace" }}>12</div><div style={{ fontSize: 30, fontWeight: 800, color: "#FDE68A" }}>that matter</div></div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, textAlign: "center", fontSize: 44, fontWeight: 900, color: "#F8FAFC", opacity: pr(f, PY.missed - 6, 12) }}>Nothing important missed.</div>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, textAlign: "center", fontSize: 30, fontWeight: 800, color: "#BAE6FD", opacity: pr(f, PY.grows - 6, 12) }}>More learners, more locations — not more noise.</div>
    <div style={{ position: "absolute", left: 0, top: 720, width: 1920, textAlign: "center", fontSize: 22, fontWeight: 700, color: "#94A3B8", opacity: pr(f, PY.grows, 12) }}>Example: 30 fewer interruptions a day × 1 minute each ≈ 2.5 hours back every week</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  for (let i = 0; i < 60; i += 3) add(HK.buzz + i * 5, "pop", 0.12);
  add(HK.enroll, "ding", 0.3); add(HK.missed + 2, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  add(T.markAll + 6, "swish", 0.3); add(T.save + 10, "chime", 0.45); add(T.muted + 2, "pop", 0.35); add(T.learner, "whoosh_s", 0.3);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.right, "chime", 0.5);
  return a;
})();

export const NotificationsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="notifstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.list, T.pref, T.learner]} finish={false} />;
};
