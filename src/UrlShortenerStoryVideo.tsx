import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { FONT, cl, pr, lin, sp, rnd, rip, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Finish, Flash, Scribble, Confetti, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, IconBox, CT, MA, BLUE, INK, GRAY, LINE, GREEN } from "./storyLand";

/**
 * UrlShortenerStoryVideo — premium landscape 1920x1080 (sheet serial 26). Story: Maya Torres, Northwind Fitness Academy (fictional).
 * Hook (designed scene) → MainIntro → ONE continuous screen recording of Settings → URL Shortener (virtual camera, scribbles, cursor,
 * word-timed cues) → payoff → MainOutro. No captions; step chip at the bottom, portal tag bottom-right; no stickers over the UI.
 * Voice: `python3 generate-voice-story.py src/UrlShortenerStoryVideo.tsx public/urlstory`.
 * Verified in code (SB-Branch Settings/UrlShortener): header "URL Shortener", Add button, search "Enter Title Here...", table columns SN/Title/
 * Created By/Creation Date/Link/Redirect URL/Active/Visit/Actions, modal "Create New URL" (Title, Description, Slug, Redirect URL, Status,
 * Expiration Date, Cancel/Save), toast "Added new url successfully", Share dialog (Facebook, Messenger, LinkedIn, X, copy link),
 * public /link/[slug] page: "This link is no longer available" + "Go to Homepage".
 */

// ───────────────────────── timeline (patched by the voice script) ─────────────────────────
const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "p8"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 246,
  d1: 135,
  d2: 166,
  d3: 243,
  d4: 120,
  d5: 212,
  d6: 115,
  d7: 166,
  p8: 157,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "p8"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 24, 28, 39, 45, 60, 79, 82, 93, 93, 103, 111, 118, 132, 132, 166, 171, 181, 195, 206, 206, 214],
  d1: [2, 11, 18, 31, 49, 62, 87, 96],
  d2: [2, 16, 33, 60, 61, 69, 76, 105, 109, 121, 128, 133, 141],
  d3: [2, 37, 47, 54, 64, 84, 90, 97, 109, 139, 142, 151, 157, 168, 179],
  d4: [2, 15, 21, 32, 39, 58, 64, 72, 78, 91],
  d5: [2, 27, 33, 71, 92, 120, 140, 145, 156, 165, 172],
  d6: [2, 17, 30, 37, 57, 70, 73, 81, 85, 88],
  d7: [2, 20, 24, 28, 34, 63, 66, 76, 82, 90, 117, 120, 125, 130],
  p8: [2, 16, 30, 61, 73, 90, 100, 103, 110, 119],
};
// @WT-END
const MUSIC = true;

const SCRIPTS: Record<Seg, string> = {
  h0: "Maya's offer is ready to send. But the link is longer than the message itself. And nobody trusts a link like that.",
  d1: "So she opens URL Shortener, and clicks Add.",
  d2: "She names it, picks a short slug, and pastes in her long link.",
  d3: "She keeps it active, and sets an expiration date, so the offer ends on time.",
  d4: "One click on Save, and the short link is live.",
  d5: "Share it anywhere. Facebook, Messenger, LinkedIn, or just copy the link.",
  d6: "Now every click is counted, right there in the table.",
  d7: "And when the date passes, visitors see a clear message, not a broken page.",
  p8: "One short link. Tracked, shareable, and done when Maya says.",
};

const SEG_START = {} as Record<Seg, number>;
let _t = 0;
for (const k of SEGS) {
  SEG_START[k] = _t;
  _t += DURATIONS[k];
  if (k === "h0") _t += INTRO_FRAMES;
}
const INTRO_START = DURATIONS.h0;
const DEMO_START = SEG_START.d1;
const P8_START = SEG_START.p8;
const SCENES_END = _t;
export const TOTAL_FRAMES = SCENES_END + OUTRO_FRAMES;
const cue = makeCues(SCRIPTS, SEG_START, WT);
const typed = (f: number, a: number, text: string, cpf = 0.9) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((f - a) * cpf))));

// ───────────────────────── data ─────────────────────────
const MSG = "Summer offer! 20% off our 8-week program. Join here:";
const LONG = "https://nwf.example.com/programs/summer-intensive/enroll?utm_source=sms&utm_medium=campaign&utm_campaign=summer_offer_2026&ref=maya_batch_2&session=nov-intake";
const SHORT = "nwf.example.com/link/summer20";
const TITLE = "Summer Enrollment Offer";
const SLUG = "summer20";
const EXPIRES = "Nov 30, 2026";
const VISITS = 128;
type Row = { t: string; by: string; d: string; slug: string; red: string; visit: number };
const OLD: Row[] = [
  { t: "Open House Signup", by: "Maya Torres", d: "Sep 12, 2026", slug: "open-house", red: "nwf.example.com/events/open-house-2026", visit: 412 },
  { t: "Free Trial Class", by: "Sam Ortiz", d: "Aug 28, 2026", slug: "trial-class", red: "nwf.example.com/book/free-trial", visit: 96 },
  { t: "Referral Form", by: "Maya Torres", d: "Aug 03, 2026", slug: "refer", red: "nwf.example.com/refer-a-friend", visit: 57 },
];

// ───────────────────────── fixed targets (world coords) ─────────────────────────
const ADD = MA(1253, 48);
const TITLEF = CT(700, 208);
const SLUGF = CT(700, 392);
const REDIRF = CT(700, 484);
const ACTIVE = CT(605, 576);
const EXPF = CT(800, 668);
const DAY30 = CT(820, 609);
const SAVE = CT(990, 744);
const SHAREI = MA(1180, 222);
const COPY = CT(1048, 478);
const DISMISS = CT(250, 200);
const VISITC = MA(1121, 222);
const LINKC = MA(701, 222);

const T = {
  appIn: DEMO_START,
  open: cue("d1", "shortener", -8),
  clickAdd: cue("d1", "add", -2),
  clickTitle: cue("d2", "names", -8),
  typeTitle: cue("d2", "names", 2),
  clickSlug: cue("d2", "picks", -6),
  typeSlug: cue("d2", "short", 0),
  clickRedir: cue("d2", "and", -2, 0),
  paste: cue("d2", "pastes", 2),
  clickActive: cue("d3", "active", -6),
  clickExp: cue("d3", "expiration", -6),
  pickDay: cue("d3", "date", 8),
  clickSave: cue("d4", "save", 6),
  rowIn: cue("d4", "short", 4),
  live: cue("d4", "live"),
  clickShare: cue("d5", "share", 8),
  social: cue("d5", "facebook", -2),
  clickCopy: cue("d5", "copy", 6),
  dismiss: SEG_START.d6 + 2,
  visitA: cue("d6", "every"),
  visitB: cue("d6", "table", 4),
  expired: cue("d7", "visitors", -8),
  clear: cue("d7", "clear"),
};
const CLICKS = [T.clickAdd, T.clickTitle, T.clickSlug, T.clickRedir, T.clickActive, T.clickExp, T.pickDay, T.clickSave, T.clickShare, T.clickCopy, T.dismiss];

// ───────────────────────── the Settings → URL Shortener page ─────────────────────────
const COL = [0, 54, 264, 414, 544, 794, 964, 1054, 1124]; // x offsets in the table card
const TX = 32, TY = 130, HH = 56, RH = 72;

const Cell: React.FC<{ x: number; w: number; y: number; children: React.ReactNode; bold?: boolean; c?: string }> = ({ x, w, y, children, bold, c = INK }) => (
  <div style={{ position: "absolute", left: x + 14, top: y, width: w - 22, height: RH, display: "flex", alignItems: "center", fontSize: 17, fontWeight: bold ? 800 : 600, color: c, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{children}</div>
);

const RowView: React.FC<{ r: Row; y: number; i: number; o?: number; hl?: number; visit?: number; shareGlow?: number }> = ({ r, y, i, o = 1, hl = 0, visit, shareGlow = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: 1286, height: RH, opacity: o, borderTop: `1px solid ${LINE}`, background: hl > 0 ? `rgba(29,63,214,${0.06 * hl})` : "#fff" }}>
    <Cell x={COL[0]} w={COL[1] - COL[0]} y={0} c={GRAY}>{i}</Cell>
    <Cell x={COL[1]} w={COL[2] - COL[1]} y={0} bold>{r.t}</Cell>
    <Cell x={COL[2]} w={COL[3] - COL[2]} y={0}>{r.by}</Cell>
    <Cell x={COL[3]} w={COL[4] - COL[3]} y={0} c={GRAY}>{r.d}</Cell>
    <Cell x={COL[4]} w={COL[5] - COL[4]} y={0} c={BLUE}><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>nwf.example.com/link/{r.slug}</span>&nbsp;↗</Cell>
    <Cell x={COL[5]} w={COL[6] - COL[5]} y={0} c={GRAY}>{r.red}</Cell>
    <div style={{ position: "absolute", left: COL[6] + 12, top: 0, height: RH, display: "flex", alignItems: "center" }}><Badge t="Active" c="#15803D" bg="#DCFCE7" fs={16} dot /></div>
    <Cell x={COL[7]} w={COL[8] - COL[7]} y={0} bold>{visit ?? r.visit}</Cell>
    {[["⤴", 0], ["✎", 1], ["⋮", 2]].map(([g, k]) => (
      <div key={k as number} style={{ position: "absolute", left: COL[8] + 6 + (k as number) * 50, top: 18, width: 38, height: 36, borderRadius: 10, border: `2px solid ${k === 0 && shareGlow > 0 ? BLUE : LINE}`, background: k === 0 && shareGlow > 0 ? "#EEF2FF" : "#fff", boxShadow: k === 0 && shareGlow > 0 ? `0 0 0 ${7 * shareGlow}px #1D3FD633` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800, color: k === 0 && shareGlow > 0 ? BLUE : GRAY }}>{g as string}</div>
    ))}
  </div>
);

const UrlPage: React.FC<{ f: number }> = ({ f }) => {
  const addPress = f >= T.clickAdd && f < T.clickAdd + 6 ? 1 : 0;
  const shift = pr(f, T.rowIn, 14);
  const newRow: Row = { t: TITLE, by: "Maya Torres", d: "Oct 12, 2026", slug: SLUG, red: "nwf.example.com/programs/summer-intensive/enroll?utm_so…", visit: 0 };
  const visit = countUp(f, T.visitA, VISITS, Math.max(20, T.visitB - T.visitA));
  const hlNew = f >= T.rowIn ? (f < T.dismiss + 30 ? 1 : Math.max(0, 1 - lin(f, T.dismiss + 30, T.dismiss + 60))) : 0;
  const shareGlow = f >= T.clickShare - 10 && f < T.clickShare + 8 ? 1 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 32, top: 22, fontSize: 32, fontWeight: 900, color: INK, letterSpacing: -0.5 }}>URL Shortener</div>
      <div style={{ position: "absolute", left: 32, top: 66, fontSize: 18, fontWeight: 600, color: GRAY }}>Create, manage, and monitor short URLs with built-in analytics.</div>
      {[0, 1, 2, 3].map((i) => <IconBox key={i} x={560 + i * 56} y={24}>{["⇩", "⚲", "⇅", "🗑"][i]}</IconBox>)}
      <div style={{ position: "absolute", left: 800, top: 24, width: 360, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600 }}>Enter Title Here...</div>
      <Btn x={1188} y={24} w={130} label="＋  Add" primary press={addPress} fs={19} glow={f >= T.clickAdd - 12 && f < T.clickAdd ? lin(f, T.clickAdd - 12, T.clickAdd) : 0} />
      {/* table */}
      <div style={{ position: "absolute", left: TX, top: TY, width: 1286, height: 560, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, overflow: "hidden", boxShadow: "0 6px 24px #0000000d" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1286, height: HH, background: "#F3F4F6" }}>
          {["SN", "Title", "Created By", "Creation Date", "Link", "Redirect URL", "Active", "Visit", "Actions"].map((h, i) => (
            <div key={h} style={{ position: "absolute", left: COL[i] + 14, top: 0, height: HH, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 800, color: "#4B5563", letterSpacing: 0.3 }}>{h}</div>
          ))}
        </div>
        {OLD.map((r, i) => <RowView key={r.slug} r={r} i={i + 2} y={HH + (i + shift) * RH} />)}
        {f >= T.rowIn - 2 && <RowView r={newRow} i={1} y={HH} o={Math.min(1, shift * 1.5)} hl={hlNew} visit={visit} shareGlow={shareGlow} />}
      </div>
    </div>
  );
};

// ───────────────────────── modal "Create New URL" ─────────────────────────
const Field: React.FC<{ y: number; label: string; text?: string; focus?: boolean; ph?: string; caret?: number; icon?: string; ring?: number }> = ({ y, label, text, focus, ph, caret = 0, icon, ring = 0 }) => (
  <>
    <div style={{ position: "absolute", left: 30, top: y, fontSize: 17, fontWeight: 800, color: "#374151" }}>{label}</div>
    <div style={{ position: "absolute", left: 30, top: y + 26, width: 540, height: 50, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${focus ? BLUE : "#D1D5DB"}`, boxShadow: focus ? "0 0 0 5px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, fontWeight: 600, color: text ? INK : "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", justifyContent: "space-between" }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{text || ph || ""}{focus && caret > 0 && <span style={{ display: "inline-block", width: 2, height: 24, background: BLUE, marginLeft: 2, verticalAlign: "middle", opacity: Math.floor(caret / 5) % 2 }} />}</span>
      {icon && <span style={{ color: GRAY, fontSize: 20 }}>{icon}</span>}
    </div>
  </>
);

const CreateModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickAdd + 4, b = T.clickSave + 8;
  if (f < a - 1 || f > b + 14) return null;
  const inn = sp(f, a, 30, { damping: 15, stiffness: 170 });
  const outP = lin(f, b, b + 12);
  const o = Math.min(1, inn * 1.5) * (1 - outP);
  const focusAt = (t: number, nxt: number) => f >= t && f < nxt;
  const titleF = focusAt(T.clickTitle, T.clickSlug), slugF = focusAt(T.clickSlug, T.clickRedir), redirF = focusAt(T.clickRedir, T.clickActive), expF = f >= T.clickExp && f < T.clickSave;
  const calOpen = f >= T.clickExp + 2 && f < T.pickDay + 8;
  const cal = pr(f, T.clickExp + 2, 10) * (1 - lin(f, T.pickDay + 2, T.pickDay + 8));
  const savePress = f >= T.clickSave && f < T.clickSave + 6 ? 1 : 0;
  const active = f >= T.clickActive;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: 500, top: 50 + (1 - Math.min(1, inn)) * 60, width: 600, height: 740, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, transform: `scale(${0.94 + 0.06 * Math.min(1, inn)})`, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 28, fontWeight: 900, color: INK }}>Create New URL</div>
        <div style={{ position: "absolute", left: 30, top: 66, fontSize: 17, fontWeight: 600, color: GRAY }}>To create a new URL, complete the form below.</div>
        <Field y={110} label="Title" text={typed(f, T.typeTitle, TITLE)} focus={titleF} caret={f - T.clickTitle} />
        <Field y={202} label="Description" ph="Enter description" />
        <Field y={294} label="Slug" text={typed(f, T.typeSlug, SLUG, 0.7)} focus={slugF} caret={f - T.clickSlug} />
        <Field y={386} label="Redirect URL" text={f >= T.paste ? LONG : ""} focus={redirF} caret={f < T.paste ? f - T.clickRedir : 0} />
        <div style={{ position: "absolute", left: 30, top: 478, fontSize: 17, fontWeight: 800, color: "#374151" }}>Status</div>
        <div style={{ position: "absolute", left: 30, top: 504, width: 330, height: 50, borderRadius: 12, background: "#F3F4F6", padding: 4, boxSizing: "border-box", display: "flex", gap: 4 }}>
          {["Active", "Inactive"].map((s, i) => (
            <div key={s} style={{ flex: 1, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, background: i === 0 && active ? "#16A34A" : "transparent", color: i === 0 && active ? "#fff" : "#6B7280", boxShadow: i === 0 && active ? "0 4px 12px #16A34A55" : "none" }}>{s}</div>
          ))}
        </div>
        <Field y={570} label="Expiration Date" text={f >= T.pickDay + 4 ? EXPIRES : ""} focus={expF} icon="📅" ph="Select a date" />
        <Btn x={260} y={670} w={130} label="Cancel" fs={19} />
        <Btn x={410} y={670} w={160} label="Save" primary press={savePress} fs={19} glow={f >= T.clickSave - 12 && f < T.clickSave ? lin(f, T.clickSave - 12, T.clickSave) : 0} />
        {/* date picker */}
        {calOpen && (
          <div style={{ position: "absolute", left: 240, top: 290, width: 330, height: 312, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 24px 70px #0007", opacity: cal, transform: `translateY(${(1 - cal) * 16}px)`, boxSizing: "border-box", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 900, color: INK, padding: "0 6px 10px" }}><span>‹</span><span>November 2026</span><span>›</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", rowGap: 0, textAlign: "center" }}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} style={{ height: 30, fontSize: 14, fontWeight: 800, color: "#9CA3AF" }}>{d}</div>)}
              {days.map((d) => {
                const sel = d === 30 && f >= T.pickDay - 4;
                return <div key={d} style={{ height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: sel ? "#fff" : "#374151", gridColumnStart: d === 1 ? 1 : undefined }}><span style={{ width: 36, height: 36, borderRadius: "50%", background: sel ? BLUE : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{d}</span></div>;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Toast: React.FC<{ f: number }> = ({ f }) => (
  <>
      {/* toast */}
      {f >= T.clickSave + 2 && f < T.clickSave + 70 && (
        <div style={{ position: "absolute", right: 36, top: 24, padding: "14px 24px", borderRadius: 14, background: "#fff", borderLeft: `6px solid ${GREEN}`, boxShadow: "0 16px 40px #0004", fontSize: 19, fontWeight: 800, color: INK, transform: `translateX(${(1 - pr(f, T.clickSave + 2, 10)) * 80}px)`, opacity: pr(f, T.clickSave + 2, 10) * (1 - lin(f, T.clickSave + 58, T.clickSave + 70)), fontFamily: FONT }}>✓&nbsp; Added new url successfully</div>
      )}
  </>
);

const ShareDialog: React.FC<{ f: number }> = ({ f }) => {
  const a = T.clickShare + 4, b = T.dismiss + 4;
  if (f < a - 1 || f > b + 14) return null;
  const inn = sp(f, a, 30, { damping: 15, stiffness: 170 });
  const o = Math.min(1, inn * 1.5) * (1 - lin(f, b, b + 12));
  const copyPress = f >= T.clickCopy && f < T.clickCopy + 6 ? 1 : 0;
  const names = ["Facebook", "Messenger", "LinkedIn", "X"];
  const cols = ["#1877F2", "#0A84FF", "#0A66C2", "#111111"];
  const glyph = ["f", "✉", "in", "𝕏"];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * o})` }} />
      <div style={{ position: "absolute", left: 480, top: 250 + (1 - Math.min(1, inn)) * 50, width: 640, height: 320, borderRadius: 22, background: "#fff", boxShadow: "0 40px 120px #000A", opacity: o, transform: `scale(${0.94 + 0.06 * Math.min(1, inn)})`, fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 0, top: 26, width: 640, textAlign: "center", fontSize: 24, fontWeight: 900, color: INK }}>Share this link</div>
        {names.map((n, i) => {
          const s = sp(f, T.social + i * 8, 30, { damping: 10, stiffness: 220 });
          return (
            <div key={n} style={{ position: "absolute", left: 128 * (i + 1) - 40, top: 92, width: 80, textAlign: "center", transform: `scale(${0.4 + 0.6 * Math.min(1.1, s)})`, opacity: Math.min(1, s * 2) }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: cols[i], color: "#fff", fontSize: 32, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 24px ${cols[i]}66` }}>{glyph[i]}</div>
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: GRAY, whiteSpace: "nowrap", marginLeft: -10, marginRight: -10 }}>{n}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 40, top: 226, width: 560, height: 58, borderRadius: 14, border: `2px solid ${LINE}`, background: "#F9FAFB", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 18px", fontSize: 18, fontWeight: 600, color: INK }}>
          <span>https://{SHORT}</span>
          <div style={{ width: 42, height: 40, borderRadius: 10, background: f >= T.clickCopy ? "#DCFCE7" : "#fff", border: `2px solid ${f >= T.clickCopy ? GREEN : LINE}`, transform: `scale(${1 - copyPress * 0.12})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: f >= T.clickCopy ? GREEN : GRAY, fontWeight: 900 }}>{f >= T.clickCopy ? "✓" : "⧉"}</div>
        </div>
      </div>
    </>
  );
};

// public page /link/[slug] after expiry
const ExpiredPage: React.FC<{ f: number }> = ({ f }) => {
  const o = pr(f, T.expired, 12);
  if (o <= 0.01) return null;
  const s = sp(f, T.expired + 4, 30, { damping: 14 });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F8FAFC", opacity: o, fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 760, padding: "48px 56px", borderRadius: 26, background: "#fff", boxShadow: "0 30px 90px #0002", textAlign: "center", border: `2px solid ${LINE}`, transform: `translateY(${(1 - Math.min(1, s)) * 40}px)` }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#FEF3C7", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>⏳</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: INK, letterSpacing: -1 }}>This link is no longer available</div>
        <div style={{ marginTop: 16, fontSize: 21, fontWeight: 600, color: GRAY, lineHeight: 1.45 }}>The link you're trying to access doesn't exist or has expired. Please check the link and try again.</div>
        <div style={{ marginTop: 30, display: "inline-block", padding: "16px 40px", borderRadius: 14, background: BLUE, color: "#fff", fontSize: 21, fontWeight: 800, boxShadow: "0 8px 22px #1D3FD655" }}>Go to Homepage</div>
      </div>
    </div>
  );
};

const CAM: K4[] = mono([
  [DEMO_START, 960, 560, 0.97],
  [T.open - 6, 1060, 330, 1.08],
  [T.clickAdd - 22, 1400, 250, 1.3],
  [T.clickAdd + 6, 1450, 240, 1.45],
  [T.clickAdd + 30, 960, 568, 1.12],
  [T.clickTitle - 4, 960, 450, 1.2],
  [T.clickSlug, 960, 520, 1.2],
  [T.clickRedir, 960, 560, 1.2],
  [T.paste + 20, 960, 600, 1.18],
  [T.clickActive - 10, 960, 650, 1.2],
  [T.clickExp - 4, 1010, 660, 1.2],
  [T.pickDay - 10, 1040, 640, 1.25],
  [T.pickDay + 24, 1040, 700, 1.2],
  [T.clickSave - 12, 1080, 700, 1.2],
  [T.clickSave + 12, 1130, 700, 1.25],
  [T.rowIn + 10, 1120, 360, 1.25],
  [T.live + 8, 1120, 380, 1.15],
  [T.clickShare - 12, 1380, 380, 1.4],
  [T.clickShare + 10, 1500, 380, 1.45],
  [T.clickShare + 26, 960, 560, 1.28],
  [T.clickCopy - 8, 1100, 600, 1.45],
  [T.clickCopy + 26, 1100, 600, 1.45],
  [T.dismiss + 16, 1180, 400, 1.1],
  [T.visitA - 6, 1330, 410, 1.5],
  [T.visitB + 18, 1330, 410, 1.5],
  [T.expired - 14, 1100, 450, 1.1],
  [T.expired + 18, 960, 540, 1.1],
  [T.clear + 40, 960, 540, 1.2],
  [P8_START, 960, 540, 1.05],
]);

const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.open + 18, 1260, 420],
  [T.clickAdd, ADD[0], ADD[1]],
  [T.clickTitle - 4, TITLEF[0] + 120, TITLEF[1]],
  [T.clickTitle, TITLEF[0] + 120, TITLEF[1]],
  [T.clickSlug, SLUGF[0] + 120, SLUGF[1]],
  [T.clickRedir, REDIRF[0] + 120, REDIRF[1]],
  [T.clickActive, ACTIVE[0], ACTIVE[1]],
  [T.clickExp, EXPF[0] + 100, EXPF[1]],
  [T.pickDay, DAY30[0], DAY30[1]],
  [T.clickSave, SAVE[0], SAVE[1]],
  [T.rowIn + 24, 1230, 520],
  [T.clickShare, SHAREI[0], SHAREI[1]],
  [T.clickCopy - 8, 1050, 560],
  [T.clickCopy, COPY[0], COPY[1]],
  [T.dismiss, DISMISS[0], DISMISS[1]],
  [T.visitA, VISITC[0] + 40, VISITC[1] + 90],
  [T.visitB + 10, VISITC[0] + 60, VISITC[1] + 120],
  [T.expired + 30, 1200, 760],
]);

const STEPS = [
  { at: T.open, to: SEG_START.d2, label: "ADD A LINK" },
  { at: SEG_START.d2, to: SEG_START.d3, label: "FILL THE FORM" },
  { at: SEG_START.d3, to: SEG_START.d4, label: "SET EXPIRY" },
  { at: SEG_START.d4, to: SEG_START.d5, label: "SAVE" },
  { at: SEG_START.d5, to: SEG_START.d6, label: "SHARE" },
  { at: SEG_START.d6, to: SEG_START.d7, label: "TRACK VISITS" },
  { at: SEG_START.d7, to: P8_START, label: "WHEN IT EXPIRES" },
];

const DemoScene: React.FC<{ f: number }> = ({ f }) => {
  const [cx, cy] = [960, 540];
  const expiredShown = f >= T.expired;
  const url = expiredShown ? `https://${SHORT}` : "academy.skillbnk.com/settings/url-shortener";
  const [vx, vy] = VISITC;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} cx={cx} cy={cy} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        <LandWin f={f} inAt={T.appIn} url={url} active="Settings" sidebar={!expiredShown} main={<UrlPage f={f} />} overlay={<><CreateModal f={f} /><Toast f={f} /><ShareDialog f={f} /><ExpiredPage f={f} /></>} />
        <Scribble f={f} at={T.open + 4} d={16} out={T.clickAdd - 6} kind="ring" x={ADD[0]} y={ADD[1]} w={190} h={78} seed={3} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.paste + 6} d={18} out={T.clickActive - 6} kind="under" x={REDIRF[0]} y={REDIRF[1] + 34} w={500} seed={2} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.rowIn + 16} d={18} out={T.clickShare - 14} kind="ring" x={LINKC[0] - 10} y={LINKC[1]} w={290} h={66} seed={6} worldW={1920} worldH={1080} />
        <Scribble f={f} at={T.visitA + 4} d={16} out={T.expired - 6} kind="ring" x={vx} y={vy} w={96} h={64} seed={4} worldW={1920} worldH={1080} />
        <Confetti f={f} at={T.rowIn + 4} cx={1100} cy={360} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.expired - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.expired} out={P8_START - 6} text="What visitors see" />
    </AbsoluteFill>
  );
};

// ───────────────────────── HOOK: the long link ─────────────────────────
const HK = {
  mayas: cue("h0", "mayas", -6),
  ready: cue("h0", "ready"),
  longer: cue("h0", "longer"),
  itself: cue("h0", "itself"),
  nobody: cue("h0", "nobody"),
  trusts: cue("h0", "trusts"),
};
const PhoneCard: React.FC<{ f: number; link: string; count: number; bad?: number; good?: number; tag?: string }> = ({ f, link, count, bad = 0, good = 0, tag }) => (
  <div style={{ position: "absolute", left: 560, top: 130, width: 800, height: 820, borderRadius: 36, background: "#F8FAFC", boxShadow: "0 50px 140px #000D", overflow: "hidden", fontFamily: FONT }}>
    <div style={{ height: 96, background: "#fff", borderBottom: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 30px", gap: 16 }}>
      <Avatar t="NF" s={56} c1="#14B8A6" c2="#0F766E" />
      <div>
        <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Northwind Fitness Academy</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: GRAY }}>Text message · Members</div>
      </div>
    </div>
    <div style={{ padding: "40px 40px 0" }}>
      <div style={{ marginLeft: "auto", width: 640, borderRadius: 28, borderBottomRightRadius: 8, padding: "26px 30px", background: good > 0.5 ? "#16A34A" : BLUE, color: "#fff", boxShadow: "0 14px 40px #1D3FD655", transform: `translateX(${bad > 0 ? Math.sin(f * 1.7) * 5 * bad : 0}px)` }}>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.35 }}>{MSG}</div>
        <div style={{ marginTop: 12, fontSize: good > 0.5 ? 30 : 24, fontWeight: 700, lineHeight: 1.4, wordBreak: "break-all", color: "#DBEAFE", textDecoration: "underline", fontFamily: good > 0.5 ? FONT : "ui-monospace,Menlo,Consolas,monospace" }}>{link}{good < 0.5 && <span style={{ display: "inline-block", width: 3, height: 26, background: "#fff", marginLeft: 2, opacity: Math.floor(f / 5) % 2 }} />}</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "baseline", gap: 14 }}>
      <div style={{ fontSize: 96, fontWeight: 900, color: good > 0.5 ? "#16A34A" : bad > 0.3 ? "#DC2626" : INK, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: GRAY }}>characters</div>
    </div>
    {tag && <div style={{ position: "absolute", right: 36, bottom: 52, padding: "10px 22px", borderRadius: 999, background: good > 0.5 ? "#DCFCE7" : "#FEE2E2", color: good > 0.5 ? "#15803D" : "#B91C1C", fontSize: 26, fontWeight: 900, border: `3px solid ${good > 0.5 ? "#22C55E" : "#F87171"}` }}>{tag}</div>}
  </div>
);
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const H0 = DURATIONS.h0;
  const warm = lin(f, HK.longer - 6, HK.trusts + 20);
  const n = Math.floor(lin(f, HK.ready, HK.itself) * LONG.length);
  const bad = lin(f, HK.nobody - 4, HK.nobody + 14);
  const inn = pr(f, HK.mayas, 22);
  const push = 1 + 0.04 * lin(f, 0, H0);
  const drift = { x: Math.sin(f / 31) * 3, y: Math.cos(f / 37) * 3 };
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <AbsoluteFill style={{ transform: `translate(${drift.x}px,${drift.y}px) scale(${push})` }}>
        <div style={{ position: "absolute", left: 0, top: 36, width: 1920, display: "flex", justifyContent: "center", opacity: pr(f, 4, 10) }}>
          <div style={{ padding: "10px 30px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: 5 }}>✉ MAYA · MARKETING</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: inn, transform: `translateY(${(1 - inn) * 120}px)` }}>
          <PhoneCard f={f} link={LONG.slice(0, n)} count={MSG.length + 1 + n} bad={bad} tag={bad > 0.4 ? "Looks like spam" : undefined} />
        </div>
        <Scribble f={f} at={HK.nobody + 4} d={18} out={H0 + 20} kind="ring" x={960} y={500} w={720} h={250} seed={7} color="#F87171" sw={10} worldW={1920} worldH={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── PAYOFF ─────────────────────────
const PY = { one: cue("p8", "short"), tracked: cue("p8", "tracked"), done: cue("p8", "done"), maya: cue("p8", "maya") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const p = lin(f, P8_START + 4, PY.one + 16);
  const cnt = Math.round(interpolate(p, [0, 1], [MSG.length + 1 + LONG.length, MSG.length + 1 + SHORT.length]));
  const good = lin(f, PY.one - 4, PY.one + 6);
  const link = good > 0.5 ? SHORT : LONG.slice(0, Math.round(LONG.length * (1 - p * 3)));
  const chip = (at: number, t: string, c: string, bg: string, x: number) => {
    const s = sp(f, at, 30, { damping: 11 });
    return <div style={{ position: "absolute", left: x, top: 990 - 70, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 30}px) scale(${0.8 + 0.2 * Math.min(1, s)})`, padding: "12px 26px", borderRadius: 999, background: bg, color: c, fontSize: 28, fontWeight: 900, border: `3px solid ${c}55` }}>{t}</div>;
  };
  const push = 1 + 0.03 * lin(f, P8_START, SCENES_END);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, P8_START, 8) }}>
      <Backdrop f={f} w={1920} h={1080} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.34), transparent 62%)" }} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 0, top: -30, width: 1920, height: 1080 }}>
          <PhoneCard f={f} link={link} count={cnt} good={good} tag={good > 0.5 ? "Sent ✓" : undefined} />
        </div>
        {chip(PY.tracked, `${VISITS} visits`, "#93C5FD", "rgba(4,7,22,0.85)", 360)}
        {chip(PY.done, `Ends ${EXPIRES}`, "#FCD34D", "rgba(4,7,22,0.85)", 1330)}
        <Confetti f={f} at={PY.maya} cx={960} cy={500} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── SFX + MAIN ─────────────────────────
type Fx = [number, string, number];
const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.25); add(HK.mayas, "swish", 0.4);
  for (let i = 0; i < 40; i++) add(HK.ready + (i / 40) * (HK.itself - HK.ready), ["key0", "key1", "key2"][i % 3], 0.16);
  add(HK.longer, "riser", 0.3); add(HK.nobody, "thud", 0.55); add(HK.trusts, "thud", 0.4);
  add(DURATIONS.h0 - 6, "whoosh", 0.5);
  add(DEMO_START - 2, "whoosh", 0.4);
  CLICKS.forEach((c) => add(c, "click", 0.6));
  add(T.clickAdd + 4, "swish", 0.4);
  for (let i = 0; i < 20; i++) add(T.typeTitle + i * 1.3, ["key0", "key1", "key2"][i % 3], 0.2);
  for (let i = 0; i < 8; i++) add(T.typeSlug + i * 1.5, ["key0", "key1", "key2"][i % 3], 0.2);
  add(T.paste, "thud", 0.45); add(T.paste + 3, "ding", 0.3);
  add(T.clickActive + 2, "pop", 0.5); add(T.clickExp + 2, "swish", 0.3); add(T.pickDay + 2, "ding", 0.5);
  add(T.clickSave + 2, "thud", 0.55); add(T.clickSave + 4, "chime", 0.7); add(T.rowIn, "whoosh_s", 0.35);
  add(T.clickShare + 4, "swish", 0.4);
  for (let i = 0; i < 4; i++) add(T.social + i * 8, "pop", 0.4);
  add(T.clickCopy + 2, "ding", 0.55);
  for (let i = 0; i < 12; i++) add(T.visitA + (i / 12) * (T.visitB - T.visitA), "pop", 0.14);
  add(T.expired, "whoosh", 0.4); add(T.clear, "thud", 0.4);
  add(P8_START - 3, "whoosh", 0.5); add(PY.one, "chime", 0.7); add(PY.tracked, "pop", 0.4); add(PY.done, "pop", 0.4); add(PY.maya, "chime", 0.6);
  return a;
})();

export const UrlShortenerStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  const musicVol = (lf: number, len: number) => (MUSIC ? 0.1 * Math.min(1, lf / 20) * Math.min(1, (len - lf) / 24) : 0);
  return (
    <AbsoluteFill style={{ background: "#040716" }}>
      <Sequence from={0} durationInFrames={DURATIONS.h0 + 6}><Hook f={f} /></Sequence>
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
      <Sequence from={DEMO_START - 2} durationInFrames={P8_START - DEMO_START + 14}><DemoScene f={f} /></Sequence>
      <Sequence from={P8_START} durationInFrames={SCENES_END - P8_START}><Payoff f={f} /></Sequence>
      <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>

      {(f < INTRO_START + 4 || (f >= DEMO_START - 4 && f < SCENES_END + 2)) && <Finish f={f} w={1920} h={1080} />}
      <Flash f={f} at={INTRO_START} w={1920} h={1080} />
      <Flash f={f} at={DEMO_START} color="#0B1A55" streak={false} d={6} w={1920} h={1080} />
      <Flash f={f} at={T.expired} d={5} streak={false} w={1920} h={1080} />
      <Flash f={f} at={P8_START} w={1920} h={1080} />
      <Flash f={f} at={SCENES_END} d={8} w={1920} h={1080} />

      {SEGS.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={k} from={SEG_START[k] + 2} durationInFrames={DURATIONS[k]}><Audio src={staticFile(`urlstory/${k}.mp3`)} /></Sequence>
      ))}
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={t} durationInFrames={80}><Audio src={staticFile(`story/sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {MUSIC && (
        <>
          <Sequence from={0} durationInFrames={INTRO_START + 10}><Audio src={staticFile("story/music.wav")} volume={(lf) => musicVol(lf, INTRO_START + 10)} loop /></Sequence>
          <Sequence from={DEMO_START - 6} durationInFrames={SCENES_END - DEMO_START + 12}><Audio src={staticFile("story/music.wav")} startFrom={300} volume={(lf) => musicVol(lf, SCENES_END - DEMO_START + 12)} loop /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
