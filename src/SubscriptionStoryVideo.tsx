import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Cursor, Backdrop } from "./premiumKit";
import { realMenuPt, StepChipL, PortalTagL, CT, MA, BLUE, INK, GRAY, LINE, Badge } from "./storyLand";
import { Stage, BeatCaption, Stamp, Person } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx, PageHead } from "./storyShell";
import { LandFull, fitKey, fitPts } from "./screenKit";
import { Pill } from "./dashKit";

/**
 * SubscriptionStoryVideo — DEEP (sheet serial 53, Subscriptions & Package Management, organization portal). Story: Omar, Northgate Career Academy (fictional).
 * Verified in code (2026-10-28), SB-Company /my-subscription: header "My Subscription" / "Manage your subscription, payments, and billing information", button "My Organizations";
 *  tabs Overview | Transactions | Change Plan | Payment | Verification. Overview: plan card + status (active/trial/cancelled/expired/grace_period/suspended), billing cycle label,
 *  feature usage bars ("Limit: N", "Unlimited", "Not Included" + "Upgrade required to access this feature", "Approaching limit"). Transactions: Upcoming charges, Open invoices,
 *  Invoice history, Recent payments; "Pay now" / "Pay balance" / "Pay part of this balance". Change Plan: "Change Your Plan", billing-cycle pills, package cards with badges
 *  Current Plan / Most Popular / Upgrade / Downgrade; dialog "Change Subscription Plan" (from → to; upgrade: prorated credit, immediately; downgrade: scheduled for next payment date,
 *  keep features until then); banner "Downgrade Scheduled" + Cancel Downgrade. Payment: "Manage how you pay for your subscription", "Currently using: …", tabs "Stripe / Card" and
 *  "Manual / Bank Transfer", "We never store your full card details." Verification: "Terms and Conditions" with 6-digit code + signature.
 * Fictional data: plan names/prices/limits are examples. The My Subscription page is opened from the organization portal (no sidebar entry is claimed).
 * Voice: python3 generate-voice-story.py src/SubscriptionStoryVideo.tsx public/substory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 470, d1: 230, d2: 170, d3: 230, d4: 220, d5: 190, d6: 220, d7: 230, d8: 280, d9: 270, d10: 300, d11: 240, p12: 210,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = [];
// @WT-BEGIN
const WT: Record<string, number[]> = {};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Omar runs Northgate Career Academy. The plan is in one email, the card is in another, and the invoice is buried in his inbox. Renewal is in three days.",
  d1: "In skillbank, it all lives on one page. As an organization, Omar opens My Subscription, with five tabs.",
  d2: "Overview shows his plan, its status, and the billing cycle.",
  d3: "Below, every feature shows usage against its limit, with a warning when he is approaching it.",
  d4: "Features outside his plan are marked, so he knows exactly what an upgrade would unlock.",
  d5: "The transactions tab lists upcoming charges, open invoices, and payment history.",
  d6: "He can pay an invoice in full, or pay part of the balance.",
  d7: "Change plan shows every package for the billing cycle, with his current plan marked.",
  d8: "He picks a higher plan and confirms. An upgrade takes effect immediately, with a prorated credit.",
  d9: "A downgrade is scheduled for the next payment date, so he keeps his features until then.",
  d10: "Under payment, he chooses to pay by card, or by manual bank transfer. Full card details are never stored.",
  d11: "Verification holds the terms and conditions, confirmed with a six digit code and a signature.",
  p12: "Plans, payments, and billing, in one page. Omar never hunts through email for a renewal again.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  open: cue("d1", "opens", -4), tabs: cue("d1", "five", -2),
  plan: cue("d2", "plan", -2), stat: cue("d2", "status", -2), cyc: cue("d2", "billing", -2),
  use: cue("d3", "usage", -2), warn: cue("d3", "approaching", -4),
  out: cue("d4", "outside", -2), unl: cue("d4", "unlock", -4),
  tTab: cue("d5", "transactions", -4), inv: cue("d5", "open", -2), hist: cue("d5", "payment", -2),
  full: cue("d6", "full", -4), part: cue("d6", "part", -4), amt: cue("d6", "part", 14), payP: cue("d6", "balance", 6),
  cTab: cue("d7", "change", -6), cur: cue("d7", "current", -2),
  up: cue("d8", "higher", -4), conf: cue("d8", "confirms", -4), imm: cue("d8", "immediately", -4),
  down: cue("d9", "downgrade", -4), dconf: cue("d9", "scheduled", -4), keep: cue("d9", "keeps", -2),
  pTab: cue("d10", "payment", -6), man: cue("d10", "manual", -4), nostore: cue("d10", "never", -2),
  vTab: cue("d11", "verification", -4), code: cue("d11", "six", -2), sig: cue("d11", "signature", -2),
};
const CLICKS = [T.tTab, T.full, T.part, T.payP, T.cTab, T.up, T.conf, T.down, T.dconf, T.pTab, T.man, T.vTab];
const TAB_NAMES = ["Overview", "Transactions", "Change Plan", "Payment", "Verification"];
const TAB_W = [130, 150, 150, 120, 140];
const tabNow = (f: number) => (f >= T.vTab ? 4 : f >= T.pTab ? 3 : f >= T.cTab ? 2 : f >= T.tTab ? 1 : 0);

// ───────── data ─────────
const upgraded = (f: number) => f >= T.conf + 40;
const downSched = (f: number) => f >= T.dconf + 40;
const PLANS: [string, string, string, string[]][] = [
  ["Starter", "$99", "Downgrade", ["Up to 150 learners", "5 staff accounts", "Standard support"]],
  ["Growth", "$299", "Current Plan", ["Up to 500 learners", "25 staff accounts", "Custom domain"]],
  ["Scale", "$599", "Upgrade", ["Up to 2,000 learners", "Unlimited staff", "Custom domain + white label"]],
];

const Bar: React.FC<{ f: number; at: number; v: number; max: number; warn?: boolean }> = ({ f, at, v, max, warn }) => (
  <div style={{ height: 12, borderRadius: 6, background: "#E5E7EB", overflow: "hidden" }}><div style={{ width: `${(v / max) * 100 * pr(f, at, 30)}%`, height: "100%", borderRadius: 6, background: warn ? "#F59E0B" : "#4F46E5" }} /></div>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; on?: boolean; children: React.ReactNode; o?: number }> = ({ x, y, w, h, on, children, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", borderRadius: 16, background: "#fff", border: `${on ? 2 : 1}px solid ${on ? BLUE : "#E2E8F0"}`, boxShadow: on ? "0 0 0 5px #C7D2FE" : "0 8px 24px rgba(15,23,42,0.05)", padding: 18, overflow: "hidden", opacity: o, fontFamily: FONT }}>{children}</div>
);

void 0;
// ───────── tabs content ─────────
const Overview: React.FC<{ f: number }> = ({ f }) => {
  const plan = upgraded(f) ? ["Scale", "$599"] : ["Growth", "$299"];
  const feats: [string, string, number, number, string, boolean][] = [
    ["Learners", "Limit: 500", 438, 500, "Approaching limit", true],
    ["Staff accounts", "Limit: 25", 9, 25, "", false],
    ["Courses & programs", "Unlimited", 18, 40, "", false],
  ];
  return (
    <>
      <Card x={12} y={166} w={640} h={230} on={f >= T.plan && f < T.stat}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: GRAY }}>Current plan</div><span style={{ outline: f >= T.stat && f < T.cyc ? "4px solid #C7D2FE" : "none", borderRadius: 999 }}><Pill tone="emerald" fs={15}>● active</Pill></span></div>
        <div style={{ marginTop: 8, fontSize: 46, fontWeight: 900, color: INK }}>{plan[0]}</div>
        <div style={{ marginTop: 4, fontSize: 24, fontWeight: 800, color: BLUE }}>{plan[1]}<span style={{ fontSize: 17, color: GRAY, fontWeight: 600 }}> / month</span></div>
        <div style={{ marginTop: 12, fontSize: 16, color: "#374151" }}>Renews Nov 1, 2026</div>
      </Card>
      <Card x={668} y={166} w={660} h={230} on={f >= T.cyc && f < T.use}>
        <div style={{ fontSize: 16, fontWeight: 800, color: GRAY }}>Billing cycle</div>
        <div style={{ marginTop: 10, fontSize: 40, fontWeight: 900, color: INK }}>Monthly</div>
        <div style={{ marginTop: 10, fontSize: 16, color: "#374151", lineHeight: 1.7 }}>Next payment: Nov 1, 2026<br />Payment method: Stripe / Card</div>
      </Card>
      <Card x={12} y={414} w={1316} h={330} on={f >= T.use && f < T.out}>
        <div style={{ fontSize: 20, fontWeight: 900, color: INK, marginBottom: 12 }}>Plan features &amp; usage</div>
        {feats.map(([n, l, v, m, w, warn], i) => (
          <div key={n} style={{ padding: "8px 0", opacity: pr(f, T.use + i * 8, 12), outline: warn && f >= T.warn && f < T.out ? "3px solid #FCD34D" : "none", outlineOffset: 4, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700 }}><span>{n}</span><span style={{ color: warn ? "#B45309" : GRAY }}>{v} · {l}</span></div>
            <div style={{ marginTop: 6 }}><Bar f={f} at={T.use + i * 8} v={v} max={m} warn={warn} /></div>
            {warn && f >= T.warn - 6 && <div style={{ marginTop: 4, fontSize: 14, fontWeight: 800, color: "#B45309" }}>⚠ {w}</div>}
          </div>
        ))}
        <div style={{ padding: "8px 0", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: pr(f, T.use + 30, 12), outline: f >= T.out && f < T.tTab - 6 ? "3px solid #C7D2FE" : "none", outlineOffset: 4, borderRadius: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Custom domain <span style={{ color: GRAY, fontWeight: 600 }}>(white label)</span></span>
          <span style={{ display: "flex", gap: 12, alignItems: "center" }}><span style={{ fontSize: 14, color: GRAY }}>Upgrade required to access this feature</span><Pill tone="slate" fs={14}>Not Included</Pill></span>
        </div>
      </Card>
    </>
  );
};

const Transactions: React.FC<{ f: number }> = ({ f }) => {
  const paid = f >= T.payP + 36;
  const hl = (a: number, b: number) => f >= a && f < b;
  const Row: React.FC<{ a: string; b: string; c: string; d?: React.ReactNode }> = ({ a, b, c, d }) => (
    <div style={{ display: "flex", alignItems: "center", height: 46, borderBottom: `1px solid ${LINE}`, fontSize: 16 }}><div style={{ width: 200, fontWeight: 800 }}>{a}</div><div style={{ width: 160, color: GRAY }}>{b}</div><div style={{ width: 120, fontWeight: 800 }}>{c}</div><div style={{ marginLeft: "auto" }}>{d}</div></div>
  );
  return (
    <>
      <Card x={12} y={166} w={430} h={190} on={hl(T.tTab, T.inv)}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Upcoming charges</div>
        <Row a="Growth plan" b="Nov 1, 2026" c="$299.00" />
      </Card>
      <Card x={458} y={166} w={870} h={190} on={hl(T.inv, T.hist)}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Open invoices <span style={{ fontSize: 14, color: GRAY, fontWeight: 600 }}>Customer-facing invoices due for this subscription</span></div>
        {!paid ? <Row a="INV-1042" b="Due Nov 1" c="$299.00" d={<span style={{ display: "flex", gap: 10 }}><span style={{ padding: "7px 14px", borderRadius: 9, background: hl(T.full - 4, T.full + 10) ? "#1E3A8A" : BLUE, color: "#fff", fontSize: 15, fontWeight: 800, boxShadow: hl(T.full - 4, T.part - 20) ? "0 0 0 4px #C7D2FE" : "none" }}>Pay now</span><span style={{ padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${LINE}`, fontSize: 15, fontWeight: 800, background: hl(T.part - 4, T.part + 10) ? "#E0E7FF" : "#fff" }}>Pay part of this balance</span></span>} /> : <Row a="INV-1042" b="Balance" c="$149.00" d={<Pill tone="amber" fs={14}>partially paid</Pill>} />}
      </Card>
      <Card x={12} y={374} w={650} h={370}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Invoice history</div>
        <Row a="INV-1031" b="Oct 1" c="$299.00" d={<Pill tone="emerald" fs={14}>paid</Pill>} />
        <Row a="INV-1019" b="Sep 1" c="$299.00" d={<Pill tone="emerald" fs={14}>paid</Pill>} />
        <Row a="INV-1008" b="Aug 1" c="$299.00" d={<Pill tone="emerald" fs={14}>paid</Pill>} />
      </Card>
      <Card x={678} y={374} w={650} h={370} on={hl(T.hist, T.full - 10)}>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Recent payments</div>
        {paid && <Row a="Card ••4242" b="Today" c="$150.00" d={<Pill tone="emerald" fs={14}>succeeded</Pill>} />}
        <Row a="Card ••4242" b="Oct 1" c="$299.00" d={<Pill tone="emerald" fs={14}>succeeded</Pill>} />
        <Row a="Card ••4242" b="Sep 1" c="$299.00" d={<Pill tone="emerald" fs={14}>succeeded</Pill>} />
      </Card>
    </>
  );
};

const ChangePlan: React.FC<{ f: number }> = ({ f }) => {
  const cur = upgraded(f) ? "Scale" : "Growth";
  return (
    <>
      <div style={{ position: "absolute", left: 14, top: 160, fontFamily: FONT }}><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Change Your Plan</div><div style={{ fontSize: 15, color: GRAY }}>Upgrade or downgrade your subscription to better fit your needs</div></div>
      <div style={{ position: "absolute", left: 14, top: 228, display: "flex", gap: 8, fontFamily: FONT }}>{["Monthly", "Quarterly", "Annually"].map((c, i) => <span key={c} style={{ padding: "7px 18px", borderRadius: 999, fontSize: 15, fontWeight: 800, background: i === 0 ? BLUE : "#fff", color: i === 0 ? "#fff" : INK, border: `1px solid ${i === 0 ? BLUE : LINE}` }}>{c}</span>)}</div>
      {downSched(f) && <div style={{ position: "absolute", left: 540, top: 214, width: 788, padding: "10px 16px", borderRadius: 12, background: "#FEF3C7", border: "1px solid #FCD34D", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: pr(f, T.dconf + 40, 12) }}><span style={{ fontSize: 15, color: "#92400E", fontWeight: 800 }}>Downgrade Scheduled · Starter from Nov 1, 2026</span><span style={{ fontSize: 14, fontWeight: 800, padding: "6px 12px", borderRadius: 8, background: "#fff", border: "1px solid #FCD34D" }}>Cancel Downgrade</span></div>}
      {PLANS.map(([n, p, , feats], i) => {
        const isCur = n === cur;
        const badge = isCur ? "Current Plan" : n === "Scale" && !upgraded(f) ? "Upgrade" : n === "Starter" ? "Downgrade" : "Downgrade";
        const pop = n === "Scale";
        const on = (n === "Scale" && f >= T.up - 6 && f < T.conf) || (n === "Starter" && f >= T.down - 6 && f < T.dconf) || (isCur && f >= T.cur && f < T.up - 10);
        return (
          <Card key={n} x={12 + i * 446} y={300} w={424} h={430} on={on} o={pr(f, T.cTab + 6 + i * 6, 12)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 28, fontWeight: 900 }}>{n}</div>{pop && <Pill tone="indigo" fs={13}>★ Most Popular</Pill>}</div>
            <div style={{ marginTop: 8, fontSize: 44, fontWeight: 900, color: BLUE }}>{p}<span style={{ fontSize: 17, color: GRAY, fontWeight: 600 }}> / month</span></div>
            <div style={{ marginTop: 14, lineHeight: 2.0, fontSize: 17, color: "#374151" }}>{feats.map((x) => <div key={x}>✓ {x}</div>)}</div>
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, background: isCur ? "#E5E7EB" : badge === "Upgrade" ? BLUE : "#fff", color: isCur ? GRAY : badge === "Upgrade" ? "#fff" : INK, border: badge === "Downgrade" ? `1.5px solid ${LINE}` : "none" }}>{badge}</div>
          </Card>
        );
      })}
    </>
  );
};

const Payment: React.FC<{ f: number }> = ({ f }) => {
  const manual = f >= T.man + 6;
  return (
    <>
      <div style={{ position: "absolute", left: 14, top: 160, fontFamily: FONT }}><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Payment</div><div style={{ fontSize: 15, color: GRAY }}>Manage how you pay for your subscription</div></div>
      <div style={{ position: "absolute", left: 14, top: 226, fontFamily: FONT, fontSize: 16, fontWeight: 700 }}>Currently using: {manual ? "Manual / Bank Transfer" : "Stripe / Card"} <Pill tone="emerald" fs={13}>Active</Pill></div>
      <div style={{ position: "absolute", left: 14, top: 268, display: "flex", gap: 6, padding: 5, borderRadius: 12, background: "#E5E7EB", fontFamily: FONT }}>{["Stripe / Card", "Manual / Bank Transfer"].map((t, i) => <span key={t} style={{ padding: "9px 22px", borderRadius: 9, fontSize: 16, fontWeight: 800, background: (i === 1) === manual ? "#fff" : "transparent", outline: i === 1 && f >= T.man - 6 && f < T.man + 10 ? "4px solid #C7D2FE" : "none" }}>{t}</span>)}</div>
      <Card x={12} y={346} w={760} h={310} on={f >= T.nostore && !manual}>
        {!manual ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Card on file</div>
            <div style={{ marginTop: 14, padding: 16, borderRadius: 14, background: "linear-gradient(135deg,#1E3A8A,#4F46E5)", color: "#fff", width: 380 }}><div style={{ fontSize: 14, opacity: 0.8 }}>VISA</div><div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 3, marginTop: 10 }}>•••• •••• •••• 4242</div><div style={{ fontSize: 14, marginTop: 8, opacity: 0.85 }}>Expires 08/28</div></div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}><span style={{ padding: "10px 20px", borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 16 }}>Update card</span><span style={{ padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${LINE}`, fontWeight: 800, fontSize: 16 }}>Remove card</span></div>
            <div style={{ marginTop: 14, fontSize: 15, color: "#166534", fontWeight: 700 }}>🔒 We never store your full card details.</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Pay by bank transfer</div>
            <div style={{ marginTop: 12, fontSize: 16, color: "#374151", lineHeight: 1.8 }}>Invoices are issued each cycle. Transfer the amount using the invoice reference, and your payment is recorded once it is confirmed.</div>
          </>
        )}
      </Card>
    </>
  );
};

const Verification: React.FC<{ f: number }> = ({ f }) => {
  const digits = f >= T.code ? typed(f, T.code + 4, "482915", 0.18) : "";
  return (
    <>
      <div style={{ position: "absolute", left: 14, top: 160, fontFamily: FONT }}><div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Terms and Conditions</div><div style={{ fontSize: 15, color: GRAY }}>Confirm the subscription terms for your organization</div></div>
      <Card x={12} y={232} w={900} h={440}>
        <div style={{ height: 120, borderRadius: 10, background: "#F8FAFC", border: `1px solid ${LINE}`, padding: 14, fontSize: 14, color: GRAY, lineHeight: 1.7 }}>1. Subscription and billing terms… 2. Plan changes and proration… 3. Cancellation and renewal…</div>
        <div style={{ marginTop: 16, fontSize: 15, fontWeight: 800 }}>6-digit verification code</div>
        <div style={{ marginTop: 8, display: "flex", gap: 10, outline: f >= T.code && f < T.sig - 6 ? "4px solid #C7D2FE" : "none", outlineOffset: 6, borderRadius: 10, width: "fit-content" }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 52, height: 58, borderRadius: 10, border: `1.5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900 }}>{digits[i] ?? ""}</div>)}</div>
        <div style={{ marginTop: 16, fontSize: 15, fontWeight: 800 }}>Signature</div>
        <div style={{ marginTop: 8, height: 90, borderRadius: 10, border: `1.5px dashed #CBD5E1`, outline: f >= T.sig ? "4px solid #C7D2FE" : "none", outlineOffset: 4, display: "flex", alignItems: "center", paddingLeft: 24, fontSize: 40, fontStyle: "italic", fontWeight: 600, color: "#1E3A8A", fontFamily: "'Brush Script MT', cursive" }}>{f >= T.sig + 6 ? typed(f, T.sig + 6, "Omar Haddad", 0.4) : ""}</div>
      </Card>
    </>
  );
};

// ───────── modals ─────────
const ChangeDialog: React.FC<{ f: number }> = ({ f }) => {
  const up = f < T.down - 30;
  const a = up ? T.up + 6 : T.down + 6, b = up ? T.conf + 40 : T.dconf + 40;
  const k = pr(f, a, 12) * (1 - pr(f, b, 10));
  if (k <= 0.01) return null;
  const [from, to] = up ? ["Growth", "Scale"] : ["Scale", "Starter"];
  const press = up ? f >= T.conf - 6 && f < T.conf + 12 : f >= T.dconf - 6 && f < T.dconf + 12;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * k})` }} />
      <div style={{ position: "absolute", left: 400, top: 170 + (1 - k) * 24, width: 800, height: 430, borderRadius: 18, background: "#fff", boxShadow: "0 30px 90px #0006", opacity: k, fontFamily: FONT, padding: 30, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>Change Subscription Plan</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20, fontSize: 24, fontWeight: 900 }}><span style={{ padding: "10px 24px", borderRadius: 12, background: "#F3F4F6" }}>{from}</span><span style={{ color: BLUE }}>→</span><span style={{ padding: "10px 24px", borderRadius: 12, background: "#E0E7FF", color: BLUE }}>{to}</span></div>
        <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: up ? "#ECFDF5" : "#FEF3C7", border: `1px solid ${up ? "#6EE7B7" : "#FCD34D"}`, fontSize: 17, lineHeight: 1.6, color: up ? "#065F46" : "#92400E", fontWeight: 700, outline: f >= (up ? T.imm : T.keep) ? "3px solid #C7D2FE" : "none" }}>
          {up ? "Upgrade: a prorated credit is applied and the change takes effect immediately." : "Downgrade: the change is scheduled for your next payment date. You keep your current features until then."}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 12, justifyContent: "flex-end" }}><span style={{ padding: "12px 26px", borderRadius: 10, border: `1.5px solid ${LINE}`, fontWeight: 800, fontSize: 17 }}>Cancel</span><span style={{ padding: "12px 26px", borderRadius: 10, background: press ? "#1E3A8A" : BLUE, color: "#fff", fontWeight: 800, fontSize: 17, boxShadow: press ? "0 0 0 4px #C7D2FE" : "none" }}>Confirm change</span></div>
      </div>
    </>
  );
};
const PartPop: React.FC<{ f: number }> = ({ f }) => {
  const k = pr(f, T.part + 4, 12) * (1 - pr(f, T.payP + 40, 10));
  if (k <= 0.01) return null;
  const v = f >= T.amt ? typed(f, T.amt, "150", 0.2) : "";
  return (
    <div style={{ position: "absolute", left: 760, top: 330, width: 560, padding: 22, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 24px 60px #0004", opacity: k, fontFamily: FONT, zIndex: 6 }}>
      <div style={{ fontSize: 20, fontWeight: 900 }}>Pay part of this balance</div>
      <div style={{ marginTop: 6, fontSize: 15, color: GRAY }}>Balance due: $299.00</div>
      <div style={{ marginTop: 12, height: 48, borderRadius: 10, border: `2px solid ${BLUE}`, boxShadow: "0 0 0 4px #C7D2FE", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 20, fontWeight: 700 }}>${v}</div>
      <div style={{ marginTop: 14 }}><span style={{ display: "inline-block", padding: "11px 24px", borderRadius: 10, background: f >= T.payP - 4 && f < T.payP + 12 ? "#1E3A8A" : BLUE, color: "#fff", fontWeight: 800, fontSize: 17 }}>Pay $150.00</span></div>
    </div>
  );
};

// ───────── window ─────────
const Page: React.FC<{ f: number }> = ({ f }) => {
  const tn = tabNow(f);
  const left = 18 + TAB_W.slice(0, tn).reduce((a, b) => a + b + 6, 0);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F5F7FB", fontFamily: FONT }}>
      <PageHead title="My Subscription" sub="Manage your subscription, payments, and billing information" />
      <span style={{ position: "absolute", left: 1140, top: 26 }}><span style={{ padding: "11px 20px", borderRadius: 10, border: `1.5px solid ${LINE}`, background: "#fff", fontSize: 16, fontWeight: 800 }}>My Organizations</span></span>
      <div style={{ position: "absolute", left: 14, top: 98, display: "flex", gap: 6, padding: 5, borderRadius: 12, background: "#E5E7EB", outline: f >= T.tabs && f < T.plan - 8 ? "4px solid #C7D2FE" : "none" }}>
        {TAB_NAMES.map((t, i) => <span key={t} style={{ width: TAB_W[i], textAlign: "center", padding: "9px 0", borderRadius: 9, fontSize: 16, fontWeight: 800, background: tn === i ? "#fff" : "transparent", color: INK, boxShadow: tn === i ? "0 1px 3px #0002" : "none" }}>{t}</span>)}
      </div>
      {void left}
      {tn === 0 && <Overview f={f} />}
      {tn === 1 && <Transactions f={f} />}
      {tn === 2 && <ChangePlan f={f} />}
      {tn === 3 && <Payment f={f} />}
      {tn === 4 && <Verification f={f} />}
    </div>
  );
};

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const overlay = (
    <>
      <PartPop f={f} />
      <ChangeDialog f={f} />
      <Toast f={f} at={T.payP + 36} text="Payment received" d={50} />
    </>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#F8FAFC" }}>
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]} calm={0.999}>
        <LandFull f={f} at={DEMO_START} url="northgate.skillbnk.com/my-subscription" company="Northgate Career Academy" active="" main={<Page f={f} />} overlay={overlay} />
        <Cursor f={f} pts={CURS} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Organization portal" />
    </AbsoluteFill>
  );
};

// ───────── camera / cursor / steps ─────────
const M = (x: number, y: number) => MA(x, y);
const CAMW: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.tabs, 1000, 420, 1.06], [T.plan, 900, 520, 1.1], [T.use, 960, 700, 1.1], [T.out + 30, 960, 760, 1.06],
  [T.tTab + 10, 1000, 600, 1.06], [T.part + 10, 1100, 520, 1.1], [T.cTab + 10, 960, 640, 1.04], [T.up, 1000, 640, 1.06], [T.conf, 960, 560, 1.06],
  [T.down + 10, 960, 620, 1.04], [T.pTab + 10, 900, 560, 1.06], [T.vTab + 10, 900, 600, 1.06], [PAY_START, 960, 540, 1.0],
]);
const CAM = CAMW.map(fitKey);
const tabPt = (i: number): [number, number] => M(18 + TAB_W.slice(0, i).reduce((a, b) => a + b + 6, 0) + TAB_W[i] / 2, 98 + 28);
const CUR_W: P3[] = monoP([
  [DEMO_START, 1560, 880], [T.open, ...M(700, 60)], [T.tabs, ...tabPt(2)], [T.plan, ...M(300, 280)], [T.stat, ...M(560, 190)], [T.cyc, ...M(800, 260)],
  [T.use, ...M(500, 500)], [T.warn, ...M(300, 560)], [T.out, ...M(560, 690)],
  [T.tTab, ...tabPt(1)], [T.inv, ...M(800, 250)], [T.hist, ...M(1000, 560)],
  [T.full, ...M(1130, 258)], [T.part, ...M(1250, 258)], [T.amt, ...M(1320, 500)], [T.payP, ...M(1250, 480)],
  [T.cTab, ...tabPt(2)], [T.cur, ...M(220, 440)], [T.up, ...M(1000, 700)], [T.conf, ...M(1330, 620)],
  [T.down, ...M(220, 700)], [T.dconf, ...M(1330, 620)],
  [T.pTab, ...tabPt(3)], [T.man, ...M(300, 296)], [T.nostore, ...M(300, 560)],
  [T.vTab, ...tabPt(4)], [T.code, ...M(300, 450)], [T.sig, ...M(300, 560)], [PAY_START, 1560, 880],
]);
const CURS = fitPts(CUR_W);
const STEPS = [
  { at: T.open, to: T.tTab, label: "My Subscription" },
  { at: T.tTab, to: T.cTab, label: "Transactions & invoices" },
  { at: T.cTab, to: T.down, label: "Upgrade a plan" },
  { at: T.down, to: T.pTab, label: "Schedule a downgrade" },
  { at: T.pTab, to: T.vTab, label: "Payment method" },
  { at: T.vTab, to: PAY_START, label: "Verification" },
];

// ───────── hook: three places, one renewal ─────────
const HK = { plan: cue("h0", "plan"), card: cue("h0", "card"), inv: cue("h0", "invoice"), ren: cue("h0", "renewal") };
const NOTES: [string, string, number, number, number][] = [
  ["PLAN", "in an old email", HK.plan - 6, 360, 250], ["CARD", "in another email", HK.card - 6, 800, 330], ["INVOICE", "buried in the inbox", HK.inv - 6, 1240, 250],
];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.inv, HK.ren + 30);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 56, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#FBBF24" }}>NORTHGATE CAREER ACADEMY</div>
          <div style={{ marginTop: 6, fontSize: 52, fontWeight: 900, color: "#F8FAFC" }}>Where is our subscription?</div>
        </div>
        {NOTES.map(([t, s, at, x, y], i) => (
          <div key={t} style={{ position: "absolute", left: x, top: y, width: 380, padding: "26px 30px", borderRadius: 18, background: "#FEF08A", color: "#1F2937", boxShadow: "0 20px 50px #0007", transform: `rotate(${[-4, 3, -2][i]}deg) translateY(${(1 - pr(f, at, 12)) * 40}px)`, opacity: pr(f, at, 12) }}>
            <div style={{ fontSize: 40, fontWeight: 900 }}>{t}</div><div style={{ marginTop: 6, fontSize: 28, fontWeight: 700 }}>{s}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 640, top: 640, width: 640, padding: "22px 30px", borderRadius: 20, background: "#0B1220", border: `5px solid ${warm > 0.4 ? "#EF4444" : "#475569"}`, opacity: pr(f, HK.ren - 14, 12), textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 4, color: "#94A3B8" }}>RENEWAL IN</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: warm > 0.4 ? "#FCA5A5" : "#F8FAFC" }}>3 DAYS</div>
        </div>
        <Person f={f} at={HK.plan - 10} x={1600} y={620} name="Omar" role="Operations, Northgate" mood={warm > 0.4 ? "stress" : "ok"} s={0.9} />
      </Stage>
      <Stamp f={f} at={HK.ren + 6} x={960} y={872} text="NOBODY KNOWS WHERE" size={48} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.plan, "The plan is in one email.", "plan"], [HK.card, "The card is in another.", "card"], [HK.inv, "The invoice is buried.", "invoice"], [HK.ren, "And renewal is days away.", "renewal"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { one: cue("p12", "plans"), hunt: cue("p12", "hunts") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(99,102,241,0.25), transparent 62%)" }} />
    <Person f={f} at={PAY_START + 4} x={340} y={260} name="Omar" role="Northgate Career Academy" mood="happy" />
    {["Plans", "Payments", "Billing"].map((t, i) => <div key={t} style={{ position: "absolute", left: 600 + i * 330, top: 260, width: 300, height: 150, borderRadius: 22, background: "#F8FAFC", border: "6px solid #6366F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: INK, opacity: pr(f, PY.one - 6 + i * 6, 10), transform: `translateY(${(1 - pr(f, PY.one - 6 + i * 6, 10)) * 30}px)` }}>{t}</div>)}
    <div style={{ position: "absolute", left: 0, top: 500, width: 1920, textAlign: "center", fontSize: 50, fontWeight: 900, color: "#C7D2FE", opacity: pr(f, PY.hunt - 6, 12) }}>One page. No more hunting for a renewal.</div>
    <div style={{ position: "absolute", left: 0, top: 590, width: 1920, textAlign: "center", fontSize: 28, fontWeight: 700, color: "#94A3B8", opacity: pr(f, PY.hunt + 16, 12) }}>Example: 1 hour a month hunting for billing details × 12 = 12 hours a year</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  NOTES.forEach(([, , at]) => add(at, "key1", 0.25));
  add(HK.ren + 6, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  add(T.payP + 36, "chime", 0.4); add(T.conf + 40, "chime", 0.5); add(T.dconf + 40, "chime", 0.4);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.hunt, "chime", 0.5);
  return a;
})();

export const SubscriptionStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="substory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.tTab]} finish={false} />;
};
