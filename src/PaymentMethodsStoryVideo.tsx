import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx } from "./storyShell";

/**
 * PaymentMethodsStoryVideo — DEEP (sheet serial 52, "Stripe & Square Payments" → Square is no longer in skillBNK, so: Stripe, PayPal and
 * custom payment methods). Story: Dana, Highway Pro CDL Academy, 3 branches (fictional).
 * Verified in code: SB-Company Integrations.tsx ("Integrations", "Manage third-party integrations for your organization.", vertical tabs
 * ChatGPT / Zoom / SendGrid / Twilio / Vimeo / Payment Methods → PayPal / Stripe / Custom; panel titles + descriptions: "Connect Stripe and
 * choose which branches can accept card payments." etc.; ?paymentTab=square falls back to PayPal), paymentMethods/Stripe.tsx (alert text,
 * Title, Secret Key:, Branches, Active + confirm "Are you sure you want to change the active state?", "Active state updated", Test connection
 * ("Testing…", "Connection verified"), Clear, Save / "Saving...", "Saved successfully"), Paypal.tsx (Title, Client ID:, Client Secret:,
 * Environment Sandbox / Production), Custommethods.tsx (Name, Additional Data + Add Field (Key / Value), Instructions, Branches, Active, Save /
 * Clear / Delete, "Add Custom Account"); SB-Branch BranchIntegrations.tsx ("Branch Integrations", "Services your organization has made
 * available to this branch.", "Managed by your organization", read-only, provider cards + Healthy / Available / No access); SB-Learner
 * payment page method grid (Square filtered out).
 * Voice: python3 generate-voice-story.py src/PaymentMethodsStoryVideo.tsx public/paymethodsstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "p10"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 500, d1: 230, d2: 190, d3: 280, d4: 260, d5: 290, d6: 390, d7: 220, d8: 330, d9: 280, p10: 170,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = [];
// @WT-BEGIN
const WT: Record<string, number[]> = {};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Dana runs a truck driving school with three locations. One takes cards at the front desk, one sends PayPal links, and one hands out bank details on paper. Money arrives late, in three different places, and nobody's sure which learner paid.",
  d1: "In skillbank, payment methods are set once, for the whole organization. Dana opens integrations in her company portal.",
  d2: "Under payment methods, there are three options: PayPal, Stripe, and custom.",
  d3: "For Stripe, she adds a title, pastes her secret key, and chooses which branches can accept card payments.",
  d4: "She switches it on, saves, and runs test connection. Connection verified.",
  d5: "PayPal works the same way: a title, the client ID and secret, sandbox or production, and the branches.",
  d6: "Custom covers everything else, like a bank transfer. She names it, adds fields for the account name and number, and writes the instructions learners will see.",
  d7: "Each method can be limited to certain branches, and turned off with one switch.",
  d8: "In every branch portal, the integrations page shows what the organization made available. Stripe, PayPal, and custom payments are ready, and the page is read only.",
  d9: "And at checkout, learners see exactly those methods: Stripe, PayPal, and bank transfer, with Dana's instructions.",
  p10: "Set up once. Every branch, every learner, paid the same way.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  menu: cue("d1", "opens", -4),
  page: cue("d1", "opens", 8),
  pm: S.d2,
  tPaypal: cue("d2", "paypal", -4),
  tStripe: cue("d2", "stripe", -4),
  tCustom: cue("d2", "custom", -4),
  stripe: S.d3,
  sTitle: cue("d3", "title", -4),
  sKey: cue("d3", "pastes", -4),
  sBr: cue("d3", "chooses", -4),
  sOn: cue("d4", "switches", -4),
  sSave: cue("d4", "saves", -2),
  sTest: cue("d4", "runs", 0),
  sOk: cue("d4", "verified", -6),
  paypal: S.d5,
  pTitle: cue("d5", "title", -4),
  pId: cue("d5", "client", -4),
  pEnv: cue("d5", "sandbox", -4),
  pBr: cue("d5", "branches", -4),
  custom: S.d6,
  cName: cue("d6", "names", -4),
  cFields: cue("d6", "fields", -4),
  cInstr: cue("d6", "writes", -4),
  limit: S.d7,
  lBr: cue("d7", "limited", -4),
  lOff: cue("d7", "switch", -4),
  branch: S.d8,
  bCards: cue("d8", "stripe", -4),
  bRead: cue("d8", "read", -4),
  learner: S.d9,
  lMethods: cue("d9", "stripe", -4),
  lBank: cue("d9", "bank", -4),
  lInstr: cue("d9", "instructions", -4),
};
const CONFIRM = T.sOn + 2, CONFIRM_OK = T.sOn + 22;
const CLICKS = [T.menu, T.pm, T.tStripe, T.sOn, CONFIRM_OK, T.sSave, T.sTest, T.paypal, T.pEnv, T.pEnv + 18, T.custom, T.cFields + 20, T.lBr + 14, T.lOff, T.lOff + 20, T.lBank];

const BRANCHES = ["Houston", "Dallas", "San Antonio"];

// ───────── company portal: Integrations ─────────
const TABS = [["✦", "ChatGPT"], ["▶", "Zoom"], ["✉", "SendGrid"], ["☎", "Twilio"], ["◉", "Vimeo"]];
const SUB = [["▣", "PayPal"], ["▭", "Stripe"], ["⚙", "Custom"]];
const PX = 300, PW = 1350 - 24 - 300 - 24; // right panel x, width (inside main area)
const META: Record<string, [string, string]> = {
  PayPal: ["PayPal", "Connect PayPal and choose which branches can accept payments."],
  Stripe: ["Stripe", "Connect Stripe and choose which branches can accept card payments."],
  Custom: ["Custom payment methods", "Create organization-specific payment instructions for selected branches."],
};
const dots = (n: number) => "•".repeat(n);
const Inp: React.FC<{ v: string; ph: string; on?: boolean; dis?: boolean; h?: number; mono?: boolean }> = ({ v, ph, on, dis, h = 40, mono: mn }) => (
  <div style={{ height: h, boxSizing: "border-box", borderRadius: 8, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#E5E7EB"}`, boxShadow: on ? "0 0 0 3px #C7D2FE" : "none", background: dis ? "#F3F4F6" : "#fff", display: "flex", alignItems: h > 40 ? "flex-start" : "center", padding: h > 40 ? 10 : "0 12px", fontSize: 15, color: v ? INK : "#9CA3AF", fontFamily: mn ? "monospace" : FONT, overflow: "hidden", whiteSpace: h > 40 ? "normal" : "nowrap" }}>{v || ph}</div>
);
const Lbl: React.FC<{ t: string; mt?: number }> = ({ t, mt = 14 }) => <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: `${mt}px 0 6px` }}>{t}</div>;
const Switch: React.FC<{ on: boolean; hl?: boolean }> = ({ on, hl }) => <span style={{ display: "inline-block", width: 44, height: 24, borderRadius: 12, background: on ? BLUE : "#D1D5DB", position: "relative", boxShadow: hl ? "0 0 0 4px #C7D2FE" : "none", verticalAlign: "middle" }}><span style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: "#fff" }} /></span>;
const Chips: React.FC<{ items: string[]; on?: boolean }> = ({ items, on }) => (
  <div style={{ minHeight: 40, boxSizing: "border-box", borderRadius: 8, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#E5E7EB"}`, boxShadow: on ? "0 0 0 3px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", flexWrap: "wrap" }}>
    {items.length ? items.map((b) => <span key={b} style={{ padding: "3px 10px", borderRadius: 6, background: "#EEF2FF", color: BLUE, fontSize: 13, fontWeight: 700 }}>{b} ✕</span>) : <span style={{ fontSize: 15, color: "#9CA3AF", paddingLeft: 4 }}>Select options</span>}
    <span style={{ marginLeft: "auto", color: GRAY }}>⌄</span>
  </div>
);
const Btn2: React.FC<{ t: string; kind?: "p" | "o" | "d"; on?: boolean; w?: number | string }> = ({ t, kind = "p", on, w = "auto" }) => (
  <span style={{ flex: w === "auto" ? 1 : undefined, width: w === "auto" ? undefined : w, height: 40, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, background: kind === "p" ? (on ? "#1E3A8A" : BLUE) : kind === "d" ? "#DC2626" : "#fff", color: kind === "o" ? INK : "#fff", border: kind === "o" ? `1px solid ${LINE}` : "none", boxShadow: on ? "0 0 0 4px #C7D2FE" : "none" }}>{t}</span>
);
const Alert: React.FC<{ t: string }> = ({ t }) => <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "12px 14px", borderRadius: 8, background: "#EEF2FF", fontSize: 14, color: GRAY, lineHeight: 1.4 }}><span style={{ color: BLUE }}>⬣</span>{t}</div>;

const StripeForm: React.FC<{ f: number }> = ({ f }) => {
  const hl = (a: number, b: number) => f >= a && f < b;
  const title = f >= T.sTitle ? typed(f, T.sTitle + 2, "Card payments", 0.6) : "";
  const saved = f >= T.sSave + 10;
  const key = saved ? "*".repeat(56) : f >= T.sKey ? dots(Math.min(48, Math.floor((f - T.sKey) * 3))) : "";
  const br = f >= T.sBr + 4 ? BRANCHES.slice(0, Math.min(3, 1 + Math.floor((f - T.sBr - 4) / 8))) : [];
  const on = f >= CONFIRM_OK;
  const testing = f >= T.sTest && f < T.sOk;
  return (
    <>
      <Alert t="This integration allows you to connect your Stripe account with our platform. Please enter your secret key and select the branches you want to integrate with." />
      <Lbl t="Title" /><Inp v={title} ph="Enter title" on={hl(T.sTitle, T.sKey)} />
      <Lbl t="Secret Key:" /><div style={{ position: "relative" }}><Inp v={key} ph="Enter Secret Key" on={hl(T.sKey, T.sBr)} dis={saved} mono />{!saved && <span style={{ position: "absolute", right: 12, top: 10, color: GRAY }}>👁</span>}</div>
      <Lbl t="Branches" /><Chips items={br} on={hl(T.sBr, T.sOn)} />
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#374151" }}>Active <Switch on={on} hl={hl(T.sOn - 6, T.sSave)} /></div>
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <span style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${LINE}`, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 600, color: saved && on ? INK : "#9CA3AF", background: "#fff", boxShadow: hl(T.sTest - 4, T.sOk + 30) ? "0 0 0 4px #C7D2FE" : "none" }}>{testing ? "◌ Testing…" : f >= T.sOk ? "✓ Test connection" : "⚡ Test connection"}</span>
        {saved && <Btn2 t="Clear" kind="d" />}
        <Btn2 t={f >= T.sSave && f < T.sSave + 10 ? "Saving..." : "Save"} on={hl(T.sSave - 4, T.sSave + 10)} />
      </div>
    </>
  );
};
const PaypalForm: React.FC<{ f: number }> = ({ f }) => {
  const hl = (a: number, b: number) => f >= a && f < b;
  const title = f >= T.pTitle ? typed(f, T.pTitle + 2, "PayPal", 0.5) : "";
  const id = f >= T.pId ? typed(f, T.pId + 2, "AeX9q2LmT0vR7bKz3WcY…", 1.2) : "";
  const sec = f >= T.pId + 16 ? dots(Math.min(40, Math.floor((f - T.pId - 16) * 3))) : "";
  const envOpen = hl(T.pEnv, T.pEnv + 18);
  const env = f >= T.pEnv + 18 ? "Production" : "";
  const br = f >= T.pBr + 2 ? BRANCHES.slice(0, Math.min(3, 1 + Math.floor((f - T.pBr - 2) / 6))) : [];
  return (
    <>
      <Alert t="This integration allows you to connect your Paypal account with our platform. Please enter your API key and select the branches you want to integrate with." />
      <Lbl t="Title" /><Inp v={title} ph="Enter title" on={hl(T.pTitle, T.pId)} />
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}><Lbl t="Client ID:" /><Inp v={id} ph="Enter Client ID" on={hl(T.pId, T.pId + 16)} mono /></div>
        <div style={{ flex: 1 }}><Lbl t="Client Secret:" /><Inp v={sec} ph="Enter Client Secret" on={hl(T.pId + 16, T.pEnv)} mono /></div>
      </div>
      <Lbl t="Environment" />
      <div style={{ position: "relative" }}><Inp v={env} ph="Select Environment" on={envOpen} />
        {envOpen && <div style={{ position: "absolute", left: 0, right: 0, top: 44, padding: 6, borderRadius: 8, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 14px 30px #0003", zIndex: 3 }}>{["Sandbox", "Production"].map((e) => <div key={e} style={{ height: 34, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 6, fontSize: 15, color: INK, background: e === "Production" && f >= T.pEnv + 8 ? "#EEF2FF" : "transparent" }}>{e}</div>)}</div>}
      </div>
      <Lbl t="Branches" /><Chips items={br} on={hl(T.pBr, T.custom)} />
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#374151" }}>Active <Switch on={f >= T.pBr + 20} /></div>
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}><Btn2 t="⚡ Test connection" kind="o" /><Btn2 t="Save" on={hl(T.pBr + 24, T.custom)} /></div>
    </>
  );
};
const CustomForm: React.FC<{ f: number }> = ({ f }) => {
  const hl = (a: number, b: number) => f >= a && f < b;
  const name = f >= T.cName ? typed(f, T.cName + 2, "Bank Transfer", 0.6) : "";
  const rows: [string, string][] = [["Account Name", "Highway Pro CDL Academy"], ["Account Number", "7720 1184 03"], ["Routing Number", "111000025"]];
  const nRows = f >= T.cFields ? Math.min(3, 1 + Math.floor((f - T.cFields) / 18)) : 0;
  const instr = f >= T.cInstr ? typed(f, T.cInstr + 2, "Use your full name as the reference and upload your receipt. We approve transfers within one business day.", 1.6) : "";
  const br = f >= T.lBr + 14 ? ["Houston", "Dallas"] : [];
  const on = f >= T.lOff + 20;
  return (
    <>
      <Alert t="Configure and manage custom integrations for your organization." />
      <Lbl t="Name" /><Inp v={name} ph="Enter Account Name" on={hl(T.cName, T.cFields)} />
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Additional Data</span><span style={{ height: 32, padding: "0 12px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", boxShadow: hl(T.cFields + 14, T.cFields + 26) ? "0 0 0 3px #C7D2FE" : "none" }}>＋ Add Field</span></div>
      {rows.slice(0, nRows).map(([k, v], i) => (
        <div key={k} style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", opacity: pr(f, T.cFields + i * 18, 8) }}>
          <div style={{ flex: 1 }}><Inp v={typed(f, T.cFields + i * 18 + 2, k, 1)} ph="Key" on={f >= T.cFields + i * 18 && f < T.cFields + i * 18 + 18} /></div>
          <div style={{ flex: 1.4 }}><Inp v={typed(f, T.cFields + i * 18 + 8, v, 1.2)} ph="Value" /></div>
          <span style={{ color: GRAY, fontSize: 14 }}>↑ ↓</span><span style={{ color: "#DC2626" }}>🗑</span>
        </div>
      ))}
      <Lbl t="Instructions" /><Inp v={instr} ph="Enter Instructions" on={hl(T.cInstr, T.limit)} h={62} />
      <Lbl t="Branches" /><Chips items={br} on={hl(T.lBr, T.lOff)} />
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "#374151" }}>Active <Switch on={on} hl={hl(T.lOff - 4, T.branch)} /></div>
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}><Btn2 t="Save" /><Btn2 t="Clear" kind="o" /><Btn2 t="Delete" kind="d" /></div>
    </>
  );
};

const Integrations: React.FC<{ f: number }> = ({ f }) => {
  const pmOn = f >= T.pm;
  const sub = f >= T.custom ? 2 : f >= T.paypal ? 0 : f >= T.tStripe + 6 ? 1 : 0;
  const subHl = f < T.stripe ? (f >= T.tCustom ? 2 : f >= T.tStripe ? 1 : f >= T.tPaypal ? 0 : -1) : -1;
  const [title, desc] = META[SUB[sub][1]];
  const scroll = f >= T.custom ? 160 * pr(f, T.cInstr - 10, 20) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <div style={{ position: "absolute", left: 24, top: 16, fontSize: 24, fontWeight: 800, color: INK }}>Integrations</div>
      <div style={{ position: "absolute", left: 24, top: 52, fontSize: 15, color: GRAY }}>Manage third-party integrations for your organization.</div>
      <div style={{ position: "absolute", left: 24, right: 24, top: 90, bottom: 14, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 252, bottom: 0, borderRight: `1px solid ${LINE}`, padding: 8, boxSizing: "border-box" }}>
          {TABS.map(([ic, t]) => <div key={t} style={{ height: 44, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderRadius: 8, fontSize: 15, fontWeight: 500, color: "#374151" }}>{ic}<span style={{ flex: 1 }}>{t}</span><span style={{ width: 8, height: 8, borderRadius: 4, background: "#10B981" }} /></div>)}
          <div style={{ height: 44, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderRadius: 8, fontSize: 15, fontWeight: 600, background: pmOn ? BLUE : "transparent", color: pmOn ? "#fff" : "#374151", boxShadow: f >= T.pm - 8 && f < T.pm + 10 ? "0 0 0 4px #C7D2FE" : "none" }}>💳<span style={{ flex: 1 }}>Payment Methods</span></div>
          {pmOn && SUB.map(([ic, t], i) => <div key={t} style={{ marginLeft: 22, height: 38, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: sub === i ? "#EEF2FF" : "transparent", color: sub === i ? BLUE : "#4B5563", boxShadow: subHl === i ? "0 0 0 3px #A5B4FC" : "none", opacity: pr(f, T.pm + 2 + i * 3, 8) }}>{ic}<span style={{ flex: 1 }}>{t}</span><span style={{ width: 8, height: 8, borderRadius: 4, background: "#10B981" }} /></div>)}
        </div>
        {pmOn ? (
          <div style={{ position: "absolute", left: 276, right: 24, top: 18 - scroll }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: INK }}>{title}</div>
            <div style={{ fontSize: 14, color: GRAY, marginBottom: 14 }}>{desc}</div>
            <div style={{ borderRadius: 12, border: `1px solid ${LINE}`, padding: 18, boxShadow: "0 1px 2px #0000000d" }}>
              {sub === 1 ? <StripeForm f={f} /> : sub === 0 && f >= T.paypal ? <PaypalForm f={f} /> : sub === 2 ? <CustomForm f={f} /> : <PaypalForm f={T.paypal - 1} />}
            </div>
            {sub === 2 && <div style={{ marginTop: 12, height: 42, borderRadius: 8, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Add Custom Account</div>}
          </div>
        ) : (
          <div style={{ position: "absolute", left: 276, right: 24, top: 18 }}><div style={{ fontSize: 19, fontWeight: 700, color: INK }}>ChatGPT</div><div style={{ fontSize: 14, color: GRAY }}>Connect your OpenAI account, choose the models branches may use, and set limits.</div></div>
        )}
      </div>
      {/* browser confirm for the Active switch */}
      {f >= CONFIRM && f < CONFIRM_OK + 4 && (
        <div style={{ position: "absolute", left: 460, top: 6, width: 440, padding: 18, borderRadius: 12, background: "#fff", boxShadow: "0 20px 50px #0005", border: `1px solid ${LINE}`, zIndex: 5 }}>
          <div style={{ fontSize: 14, color: GRAY }}>academy.skillbnk.com says</div>
          <div style={{ marginTop: 8, fontSize: 16, color: INK }}>Are you sure you want to change the active state?</div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}><Btn2 t="Cancel" kind="o" w={90} /><Btn2 t="OK" w={70} on={f >= CONFIRM_OK - 4} /></div>
        </div>
      )}
    </div>
  );
};

// ───────── branch portal: Branch Integrations (read-only) ─────────
const PROVIDERS: [string, string, string, "healthy" | "available" | "none", string][] = [
  ["✦", "ChatGPT", "AI content and curriculum generation", "healthy", "Connection verified and ready to use."],
  ["▶", "Zoom", "Online meetings and live sessions", "healthy", "Connection verified and ready to use."],
  ["✉", "SendGrid", "Transactional and campaign email", "healthy", "Connection verified and ready to use."],
  ["☎", "Twilio", "SMS and text-message delivery", "none", "Not configured by your organization."],
  ["◉", "Vimeo", "Video hosting and media delivery", "none", "Not enabled for this branch."],
  ["▣", "PayPal", "Online payment processing", "healthy", "Connection verified and ready to use."],
  ["▭", "Stripe", "Card and online payments", "healthy", "Connection verified and ready to use."],
  ["⚙", "Custom payments", "Organization-defined payment methods", "available", "Enabled for this branch."],
];
const BranchInt: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
    <div style={{ position: "absolute", left: 24, top: 16, fontSize: 22, fontWeight: 700, color: INK }}>⚡ Branch Integrations</div>
    <div style={{ position: "absolute", left: 24, top: 50, fontSize: 14, color: GRAY }}>Services your organization has made available to this branch.</div>
    <div style={{ position: "absolute", right: 24, top: 22, padding: "4px 10px", borderRadius: 999, border: `1px solid ${LINE}`, fontSize: 12, fontWeight: 600, color: INK, background: "#fff" }}>6 available</div>
    <div style={{ position: "absolute", left: 24, right: 24, top: 84, padding: "10px 14px", borderRadius: 12, background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#172554", boxShadow: f >= T.bRead && f < T.learner ? "0 0 0 4px #BFDBFE" : "none" }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>🛡 Managed by your organization</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>This page is read-only. Contact your organization administrator to enable an integration, change branch access, or repair a connection.</div>
    </div>
    <div style={{ position: "absolute", left: 24, right: 24, top: 160, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      {PROVIDERS.map(([ic, n, d, st, why], i) => {
        const pay = i >= 5;
        const on = pay && f >= T.bCards + (i - 5) * 10 && f < T.bRead;
        const meta = st === "healthy" ? ["Healthy", "#047857", "#D1FAE5"] : st === "available" ? ["Available", "#1D4ED8", "#DBEAFE"] : ["No access", "#6B7280", "#F3F4F6"];
        return (
          <div key={n} style={{ height: 132, boxSizing: "border-box", borderRadius: 12, background: "#fff", border: `${on ? 2 : 1}px solid ${on ? BLUE : LINE}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", padding: 16, display: "flex", gap: 12, opacity: st === "none" ? 0.7 : 1 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: st === "none" ? "#F3F4F6" : "#EEF2FF", color: st === "none" ? GRAY : BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{ic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 16, color: INK }}>{n}</b><span style={{ padding: "2px 10px", borderRadius: 999, background: meta[2], color: meta[1], fontSize: 12, fontWeight: 700 }}>{meta[0]}</span></div>
              <div style={{ fontSize: 13, color: GRAY, marginTop: 2 }}>{d}</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 12 }}>{why}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ───────── learner checkout: the methods the branch enabled ─────────
const X0 = 368, PWD = 864, TILE_W = (PWD - 48 - 48) / 4;
const Checkout: React.FC<{ f: number }> = ({ f }) => {
  const sel = f >= T.lBank ? "bank" : null;
  const hl = (a: number, b: number) => f >= a && f < b;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F9FAFB", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: X0, top: 32, fontSize: 30, fontWeight: 700, color: "#1F2937" }}><span style={{ color: "#4B5563", fontSize: 24, marginRight: 14 }}>←</span>Payment</div>
      <div style={{ position: "absolute", left: X0, top: 80, fontSize: 16, color: "#4B5563" }}>Make a payment for your enrollment</div>
      <div style={{ position: "absolute", left: X0, top: 120, width: PWD, height: 640, boxSizing: "border-box", borderRadius: 8, background: "#fff", boxShadow: "0 1px 3px #0000001f", padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: INK }}>Select Payment Method</div>
        <div style={{ position: "absolute", left: 24, top: 64, display: "flex", gap: 16 }}>
          {([["stripe", "Stripe", "stripe"], ["paypal", "PayPal", "PayPal"], ["bank", "Bank Transfer", "$"]] as const).map(([k, n, ic], i) => {
            const on = sel === k, pulse = hl(T.lMethods + i * 10, T.lMethods + i * 10 + 14);
            return <div key={k} style={{ width: TILE_W, height: 100, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${on ? BLUE : "#E5E7EB"}`, background: on ? BLUE : "#fff", color: on ? "#fff" : "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: pulse ? "0 0 0 4px #C7D2FE" : "none" }}>
              <div style={{ fontSize: k === "bank" ? 26 : 22, fontWeight: 800, fontStyle: k === "paypal" ? "italic" : "normal", color: on ? "#fff" : k === "stripe" ? "#635BFF" : k === "paypal" ? "#003087" : INK }}>{ic}</div><div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div>
            </div>;
          })}
        </div>
        {sel && (
          <>
            <div style={{ position: "absolute", left: 24, right: 24, top: 188, padding: 16, borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB", opacity: pr(f, T.lBank + 2, 10) }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: INK, marginBottom: 10 }}>Bank Transfer Information</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{[["Account Name:", "Highway Pro CDL Academy"], ["Account Number:", "7720 1184 03"], ["Routing Number:", "111000025"]].map(([k, v]) => <div key={k}><div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{k}</div><Inp v={v} ph="" /></div>)}</div>
            </div>
            <div style={{ position: "absolute", left: 24, right: 24, top: 400, padding: 16, borderRadius: 6, border: "1px solid #E5E7EB", background: "#EFF6FF", boxShadow: hl(T.lInstr, PAY_START) ? "0 0 0 4px #C7D2FE" : "none", opacity: pr(f, T.lBank + 6, 10) }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: INK }}>Bank Transfer Instruction</div>
              <div style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>Use your full name as the reference and upload your receipt. We approve transfers within one business day.</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ───────── demo ─────────
type Sc = "co" | "br" | "le";
const scAt = (f: number): Sc => (f < T.branch ? "co" : f < T.learner ? "br" : "le");
const calm = (k: K4): K4 => [k[0], Math.max(820, Math.min(1120, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.25, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.menu, 760, 700, 1.1], [T.page + 8, 960, 540, 1.0], [T.pm, 820, 560, 1.12],
  [T.stripe, 1120, 480, 1.15], [T.sBr, 1120, 560, 1.15], [T.sOn, 1100, 600, 1.15], [T.sOk, 1100, 620, 1.12],
  [T.paypal, 1120, 500, 1.12], [T.pBr, 1120, 600, 1.12], [T.custom, 1120, 500, 1.12], [T.cInstr, 1120, 580, 1.15], [T.limit, 1120, 600, 1.15],
  [T.branch + 6, 960, 540, 1.02], [T.bCards, 1000, 600, 1.12], [T.bRead, 960, 420, 1.12],
  [T.learner + 6, 960, 520, 1.15], [T.lBank, 960, 560, 1.2], [PAY_START, 960, 540, 1.0],
]).map(calm);
const FX = 24 + 276; // right panel left inside main
const CUR: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.menu, ...realMenuPt("Integrations", undefined, false, true)],
  [T.pm, ...MA(24 + 120, 90 + 8 + 5 * 44 + 22)], [T.tPaypal, ...MA(24 + 120, 90 + 8 + 6 * 44 + 19)], [T.tStripe, ...MA(24 + 120, 90 + 8 + 6 * 44 + 38 + 19)], [T.tCustom, ...MA(24 + 120, 90 + 8 + 6 * 44 + 76 + 19)],
  [T.sTitle, ...MA(FX + 400, 90 + 18 + 60 + 160)], [T.sKey, ...MA(FX + 400, 90 + 18 + 60 + 230)], [T.sBr, ...MA(FX + 400, 90 + 18 + 60 + 300)],
  [T.sOn, ...MA(FX + 80, 90 + 18 + 60 + 352)], [CONFIRM_OK, ...MA(460 + 400, 6 + 104)], [T.sSave, ...MA(FX + 820, 90 + 18 + 60 + 400)], [T.sTest, ...MA(FX + 180, 90 + 18 + 60 + 400)],
  [T.paypal - 6, ...MA(24 + 120, 90 + 8 + 6 * 44 + 19)], [T.paypal, ...MA(24 + 120, 90 + 8 + 6 * 44 + 19)],
  [T.pId, ...MA(FX + 250, 90 + 18 + 60 + 230)], [T.pEnv, ...MA(FX + 400, 90 + 18 + 60 + 300)], [T.pEnv + 18, ...MA(FX + 200, 90 + 18 + 60 + 300 + 44 + 6 + 34 + 17)],
  [T.custom - 6, ...MA(24 + 120, 90 + 8 + 6 * 44 + 76 + 19)], [T.custom, ...MA(24 + 120, 90 + 8 + 6 * 44 + 76 + 19)],
  [T.cName, ...MA(FX + 400, 90 + 18 + 60 + 130)], [T.cFields + 20, ...MA(FX + PW - 70, 90 + 18 + 60 + 185)],
  [T.cInstr, ...MA(FX + 400, 90 + 18 + 60 + 380 - 160)], [T.lBr + 14, ...MA(FX + 400, 90 + 18 + 60 + 460 - 160)], [T.lOff, ...MA(FX + 80, 90 + 18 + 60 + 510 - 160)],
  [T.branch + 8, 1560, 880], [T.bCards, ...MA(800, 160 + 2 * 144 + 66)], [T.bRead, ...MA(500, 110)],
  [T.learner + 8, 1560, 880], [T.lMethods, ...CT(X0 + 24 + TILE_W / 2, 120 + 114)], [T.lBank, ...CT(X0 + 24 + 2 * (TILE_W + 16) + TILE_W / 2, 120 + 114)],
  [T.lInstr + 20, 1560, 880],
]);
const STEPS = [
  { at: T.menu, to: T.pm, label: "Company portal → Integrations" },
  { at: T.pm, to: T.stripe, label: "Payment methods" },
  { at: T.stripe, to: T.paypal, label: "Connect Stripe" },
  { at: T.paypal, to: T.custom, label: "Connect PayPal" },
  { at: T.custom, to: T.limit, label: "Add a custom method" },
  { at: T.limit, to: T.branch, label: "Branches and on / off" },
  { at: T.branch, to: T.learner, label: "What each branch sees" },
  { at: T.learner, to: PAY_START, label: "What learners see" },
];
const Demo: React.FC<{ f: number }> = ({ f }) => {
  const sc = scAt(f);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {sc === "co" && <LandWin f={f} inAt={DEMO_START} url={f >= T.pm ? "admin.skillbnk.com/integrations?tab=paymentMethods&paymentTab=" + ["paypal", "stripe", "custom"][f >= T.custom ? 2 : f >= T.paypal ? 0 : f >= T.tStripe + 6 ? 1 : 0] : f >= T.page ? "admin.skillbnk.com/integrations" : "admin.skillbnk.com/dashboard"} company="Highway Pro CDL Academy" active={f >= T.page ? "Integrations" : "Dashboard"} main={f >= T.page ? <Integrations f={f} /> : <div style={{ position: "absolute", inset: 0, background: "#F8FAFC" }}><div style={{ position: "absolute", left: 24, top: 16, fontSize: 24, fontWeight: 800, color: INK }}>Dashboard</div>{[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 330, top: 70, width: 314, height: 120, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }} />)}{[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 660, top: 210, width: 642, height: 360, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }} />)}</div>}
          overlay={<><Toast f={f} at={CONFIRM_OK + 4} text="Active state updated" d={30} /><Toast f={f} at={T.sSave + 10} text="Saved successfully" d={30} /><Toast f={f} at={T.sOk} text="Connection verified" d={50} /><Toast f={f} at={T.lOff + 24} text="Saved successfully" d={40} /></>} />}
        {sc === "br" && <LandWin f={f} inAt={T.branch} url="dallas.skillbnk.com/integrations" branch="Dallas" active="Integrations" main={<BranchInt f={f} />} />}
        {sc === "le" && <LandWin f={f} inAt={T.learner} url="learner.skillbnk.com/payment/673a2f…" sidebar={false} main={<Checkout f={f} />} />}
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.branch - 4} text="Company portal" />
      <PortalTagL f={f} at={T.branch + 4} out={T.learner - 4} text="Branch portal · Dallas" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner payment page" />
    </AbsoluteFill>
  );
};

// ───────── hook: three branches, three money pipes ─────────
const HK = { three: cue("h0", "three"), cards: cue("h0", "cards"), paypal: cue("h0", "paypal"), paper: cue("h0", "paper"), late: cue("h0", "late"), sure: cue("h0", "sure") };
const PIPES: { lab: string; how: string; col: string; at: keyof typeof HK; y: number }[] = [
  { lab: "Houston", how: "card at the front desk", col: "#38BDF8", at: "cards", y: 250 },
  { lab: "Dallas", how: "PayPal links by text", col: "#A78BFA", at: "paypal", y: 480 },
  { lab: "San Antonio", how: "bank details on paper", col: "#FBBF24", at: "paper", y: 710 },
];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.late - 10, HK.sure + 30);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 60, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#FBBF24" }}>HIGHWAY PRO CDL ACADEMY</div>
          <div style={{ marginTop: 6, fontSize: 54, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.three, "3 locations. 3 ways to get paid.", 0.7)}</div>
        </div>
        {PIPES.map((p, i) => {
          const a = HK[p.at];
          const k = pr(f, a - 4, 20);
          const len = 900 * k;
          const broken = f >= HK.late;
          const coinT = (f - a) / 50;
          return (
            <React.Fragment key={p.lab}>
              <div style={{ position: "absolute", left: 120, top: p.y, width: 300, height: 140, boxSizing: "border-box", borderRadius: 18, background: "#0F172A", border: `5px solid ${p.col}`, padding: 16, opacity: pr(f, HK.three + i * 6, 10) }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#F8FAFC" }}>{p.lab}</div>
                <div style={{ marginTop: 8, fontSize: 21, fontWeight: 800, color: p.col }}>{f >= a - 4 ? p.how : "…"}</div>
              </div>
              {/* the pipe */}
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <path d={`M 420 ${p.y + 70} C 700 ${p.y + 70}, ${760 + i * 60} ${540 + (i - 1) * 150}, ${1320} ${520 + (i - 1) * 40}`} fill="none" stroke={p.col} strokeWidth={18} strokeLinecap="round" strokeDasharray={1100} strokeDashoffset={1100 - len} opacity={0.85} />
              </svg>
              {/* coins travelling (some drop out once things go wrong) */}
              {f >= a && Array.from({ length: 3 }).map((_, c) => {
                const t = ((coinT + c / 3) % 1);
                const drop = broken && c === i % 3;
                const x = 420 + t * 880, y = p.y + 70 + (520 + (i - 1) * 40 - p.y - 70) * t * t + (drop ? 260 * Math.max(0, t - 0.4) ** 2 * 4 : 0);
                return <div key={c} style={{ position: "absolute", left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: drop ? "#EF4444" : "#FDE047", border: "3px solid #A16207", fontSize: 18, fontWeight: 900, color: "#713F12", textAlign: "center", lineHeight: "30px", opacity: drop && t > 0.75 ? 0 : 1 }}>$</div>;
              })}
            </React.Fragment>
          );
        })}
        {/* three separate destinations */}
        {f >= HK.late && ["Card terminal account", "PayPal balance", "Bank account"].map((d, i) => (
          <div key={d} style={{ position: "absolute", left: 1330 + i * 14, top: 400 + i * 120, width: 420, height: 100, boxSizing: "border-box", borderRadius: 16, background: "#F8FAFC", border: "4px dashed #94A3B8", padding: "14px 18px", opacity: pr(f, HK.late + i * 6, 10), transform: `rotate(${(i - 1) * 2}deg)` }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>{d}</div><div style={{ fontSize: 18, fontWeight: 700, color: "#B91C1C" }}>{["2 days late", "who is this from?", "no reference"][i]}</div>
          </div>
        ))}
        {f < HK.late && <div style={{ position: "absolute", left: 1330, top: 470, width: 300, height: 140, borderRadius: 20, border: "4px dashed #475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#94A3B8", opacity: pr(f, HK.cards, 10) }}>Dana's books</div>}
      </Stage>
      <Stamp f={f} at={HK.sure + 2} x={960} y={900} text="WHO PAID?" size={64} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.cards, "One takes cards at the front desk.", "cards"], [HK.paypal, "One sends PayPal links.", "PayPal links"], [HK.paper, "One hands out bank details on paper.", "on paper"], [HK.late, "Late, scattered, and nobody's sure who paid.", "who paid"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { once: cue("p10", "once"), branch: cue("p10", "branch"), same: cue("p10", "same") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(99,102,241,0.25), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 630, top: 200, width: 660, height: 150, borderRadius: 24, background: "#F8FAFC", border: "6px solid #6366F1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: pr(f, PY.once - 6, 10) }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: GRAY }}>Company portal</div><div style={{ fontSize: 34, fontWeight: 900, color: INK }}>Stripe · PayPal · Custom</div>
    </div>
    {BRANCHES.map((b, i) => (
      <React.Fragment key={b}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={960} y1={350} x2={460 + i * 500} y2={560} stroke="#818CF8" strokeWidth={8} strokeDasharray={400} strokeDashoffset={400 * (1 - pr(f, PY.branch - 6 + i * 4, 14))} /></svg>
        <div style={{ position: "absolute", left: 300 + i * 500, top: 560, width: 320, height: 120, borderRadius: 20, background: "#F8FAFC", border: "5px solid #22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: INK, opacity: pr(f, PY.branch + i * 4, 10) }}>{b} ✓</div>
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, textAlign: "center", fontSize: 46, fontWeight: 900, color: "#C7D2FE", opacity: pr(f, PY.same - 6, 12) }}>Set up once. Every branch, paid the same way.</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  PIPES.forEach((p) => add(HK[p.at] - 4, "swish", 0.3));
  add(HK.late, "thud", 0.3); add(HK.sure + 2, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 8; i++) add(T.sKey + i * 4, ["key0", "key1", "key2"][i % 3], 0.12);
  add(T.sOk, "chime", 0.5); add(T.lOff + 24, "pop", 0.35); add(T.branch, "whoosh_s", 0.3); add(T.learner, "whoosh_s", 0.3);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.same, "chime", 0.5);
  return a;
})();

export const PaymentMethodsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="paymethodsstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.branch, T.learner]} />;
};
