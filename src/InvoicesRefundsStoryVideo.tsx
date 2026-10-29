import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, countUp, makeCues, K4, mono, P3, monoP, CameraWorld, Cursor } from "./premiumKit";
import { realMenuPt, StepChipL, PortalTagL, CT, MA, BLUE, INK, GRAY, LINE, Badge, MenuExtra } from "./storyLand";
import { Stage, BeatCaption, Stamp, Person } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx, Table, PageHead } from "./storyShell";
import { LandFull, fitKey, fitPts } from "./screenKit";
import { Pill, THead, PersonCell } from "./dashKit";
import { Backdrop } from "./premiumKit";

/**
 * InvoicesRefundsStoryVideo — DEEP (sheet serial 52, Invoices / Program Payments / Refunds, training-provider side). Story: Priya, Summit Trade School.
 * Verified in code (2026-10-28), SB-Branch components/pageList/FeesAndPayments:
 *  Invoices/Invoices.tsx — header "Invoices" / "Payment requests, paid invoices and refund invoices"; search "Enter Student Name..."; "Legacy invoices (deprecated)", "Create invoice",
 *   Export CSV, filter; CURRENT table columns Invoice (#last-8) | Learner | Type (payment request / payment receipt / refund receipt) | Amount | Balance | Status (sent / paid / refunded) | Created | Actions (View).
 *   View → modal "Invoice #id" (Learner, Amount, Status, Balance, Due, Note, "Download PDF", "Resend to learner"; toast "Invoice email queued").
 *  Invoices/NewInvoiceModal.tsx + AddInvoiceData.tsx — modal "Create invoice" / "Choose a learner and request a payment"; Search Student (Name or Email), Program ("All bootcamps"), Session, table Name/Email/Phone/Program/Session/Action [Select];
 *   then card with "Available to invoice $X", "Full balance · $X" / "Custom amount", Payment amount, Due date (optional), Message to learner (optional), [Change learner] [Create and email invoice]; toast "Invoice created and email queued for the learner".
 *  ProgramPayments/ProgramPayments.tsx — header "All Transactions" / "View details of student payment records and transactions"; search "Enter Email/Name..."; Filter (Bootcamp, Session, Reviewed By, Status, Method), Sort;
 *   tabs "Payments (N)" / "Refunds (N)"; columns SN | Paid By | Contact | Program | Method | Amount (+Total) | Status | reviewed By | Payment Date | Actions (eye + menu Edit / Issue refund (approved only) / Delete).
 *  DetailsModal.tsx "Payment Details": Transaction ID #, status badge, Edit; cards Student Information, Payment Information, Payment Attachment, Review Information (Review Note); Total / Paid / Due Amount.
 *  EditProgramPayments.tsx "Update transaction": Amount, Payment Date, Payment Method, Payment Status, Email, Note, Attachment; toast "Transaction updated successfully".
 *  Refunds/CreateRefundModal.tsx "Issue refund": Payment method, Latest payment, Paid balance, Refund amount Full amount / Partial amount, Reason (Changed mind, Course not as expected, Duplicate payment, Financial hardship, Technical or access issue, Other), "Initiate refund"; toast "Refund initiated. Complete the processing step."
 *  Refunds/RefundsList.tsx + UpdateRefundModal.tsx + RefundStepper.tsx — Student | Program | Reason | Requested | Approved | Requested Date | Initiated By | Status | eye; modal "Refund": stepper Requested → Approved → Processing → Processed, Requested Amount, Reason Category,
 *   "Review this request": Approved Amount ($) Full / Partial, Admin Note, [Reject] [Approve]; then "Mark as Processed" (non-online) → Processed.
 * Menu note: "Program Payments" is a menu page (menues.json); the sidebar here puts it under Billing & Certificate (placement depends on the Menu Builder).
 * Voice: python3 generate-voice-story.py src/InvoicesRefundsStoryVideo.tsx public/invrefstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14", "p15"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 268,
  d1: 229,
  d2: 165,
  d3: 170,
  d4: 218,
  d5: 153,
  d6: 185,
  d7: 210,
  d8: 246,
  d9: 204,
  d10: 236,
  d11: 193,
  d12: 181,
  d13: 233,
  d14: 145,
  p15: 226,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13", "d14", "p15"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 13, 27, 37, 48, 51, 60, 83, 87, 93, 101, 114, 125, 130, 151, 156, 160, 166, 171, 192, 196, 202, 214, 234, 241],
  d1: [2, 12, 45, 45, 54, 64, 69, 96, 97, 101, 107, 135, 135, 147, 154, 162, 186, 190],
  d2: [2, 10, 22, 34, 48, 57, 64, 78, 92, 100, 107, 120, 126, 130, 137],
  d3: [2, 15, 27, 40, 45, 57, 77, 79, 85, 93, 98, 108, 116, 131, 142],
  d4: [2, 13, 24, 36, 60, 64, 74, 93, 109, 128, 135, 142, 147, 151, 160, 168, 177],
  d5: [2, 12, 19, 28, 34, 40, 52, 60, 82, 90, 99, 105, 109],
  d6: [2, 10, 19, 28, 35, 39, 43, 52, 61, 88, 90, 96, 103, 109, 113, 123, 140, 147, 151],
  d7: [2, 10, 17, 24, 27, 53, 53, 59, 63, 86, 90, 97, 105, 130, 133, 139, 147, 154, 165, 171, 177, 183],
  d8: [2, 14, 22, 26, 49, 53, 62, 69, 76, 84, 90, 94, 116, 127, 133, 135, 157, 166, 177, 184, 194, 210, 222],
  d9: [2, 12, 24, 46, 57, 64, 72, 78, 84, 90, 116, 132, 148, 156, 174],
  d10: [2, 16, 25, 36, 58, 64, 92, 96, 105, 111, 117, 126, 130, 138, 159, 162, 184, 190, 196, 199],
  d11: [2, 12, 22, 28, 45, 51, 57, 63, 87, 93, 112, 130, 143, 161, 164, 168],
  d12: [2, 12, 18, 29, 57, 63, 74, 83, 88, 96, 104, 109, 117, 124, 129, 134, 147, 150, 157],
  d13: [2, 12, 28, 37, 52, 70, 99, 102, 110, 134, 135, 141, 149, 175, 175, 186, 198, 202],
  d14: [2, 19, 24, 30, 37, 64, 65, 70, 76, 86, 100, 106],
  p15: [2, 46, 54, 63, 90, 91, 100, 117, 133, 147, 156, 158, 171, 189, 196],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Priya handles billing at Summit Trade School. One learner paid by card, then cash, then asked for a refund. Her running total won't add up.",
  d1: "In skillbank, billing lives in one place. As a training provider, Priya opens Billing and Certificate, then Invoices.",
  d2: "The invoices list shows each learner, the type, the amount, the balance, and the status.",
  d3: "She searches a student by name, and the one learner she needs is right there.",
  d4: "To collect a balance, she clicks create invoice, and searches for the learner by name or email.",
  d5: "She can narrow it by program and session, then select the right learner.",
  d6: "The invoice shows how much is available to invoice. She can request the full balance, or a custom amount.",
  d7: "She sets a due date, adds a short message, and creates the invoice. The learner is emailed, and pays from their portal.",
  d8: "Back in the list, she opens an invoice to see the amount, balance, and due date, then downloads a PDF or resends it.",
  d9: "Now program payments. Every payment is listed with the learner, program, method, amount, and status.",
  d10: "She filters by status, like pending, then opens a payment to see the student, the attachment, and the review notes.",
  d11: "If something is off, she edits the transaction: the amount, date, method, status, and a note.",
  d12: "For an approved payment, issue refund lets her return all of it, or part of it, with a reason.",
  d13: "The refunds tab tracks every request. She opens one, sets the approved amount, adds a note, and approves.",
  d14: "Then she marks it processed, and the tracker shows every step complete.",
  p15: "Invoices, payments, and refunds, in one place. Priya closes the month without reconciling by hand.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  mBill: cue("d1", "billing", -4), mInv: cue("d1", "invoices", -4, 1), page: cue("d1", "invoices", 6, 1),
  cType: cue("d2", "type", -2), cBal: cue("d2", "balance", -2), cStat: cue("d2", "status", -2),
  search: cue("d3", "searches", -4), filt: cue("d3", "name", 4),
  create: cue("d4", "create", -4), mod: cue("d4", "create", 8), q: cue("d4", "name", 2),
  prog: cue("d5", "program", -6), progPick: cue("d5", "program", 20), sess: cue("d5", "session", -2), sel: cue("d5", "select", -4),
  step2: S.d6, avail: cue("d6", "available", -2), full: cue("d6", "full", -2), cust: cue("d6", "custom", -2), amt: cue("d6", "custom", 14),
  due: cue("d7", "due", -2), msg: cue("d7", "message", -2), make: cue("d7", "creates", -2),
  row: cue("d8", "opens", -6), vAmt: cue("d8", "amount", -2), vBal: cue("d8", "balance", -2), vDue: cue("d8", "due", -2), pdf: cue("d8", "downloads", -2), resend: cue("d8", "resends", -2),
  mPP: cue("d9", "program", -8), ppPage: cue("d9", "program", 4), cPaid: cue("d9", "learner", -2), cMeth: cue("d9", "method", -2), cStat2: cue("d9", "status", 8),
  fOpen: cue("d10", "filters", -6), fPick: cue("d10", "pending", -8), view: cue("d10", "opens", -2), dStu: cue("d10", "student", -2), dAtt: cue("d10", "attachment", -2), dRev: cue("d10", "review", -2),
  edit: cue("d11", "edits", -6), eAmt: cue("d11", "amount", -2), eStat: cue("d11", "status", -2), eNote: cue("d11", "note", -2), eSave: cue("d11", "note", 28),
  menu: cue("d12", "approved", -10), issue: cue("d12", "issue", -2), part: cue("d12", "part", -2), reason: cue("d12", "reason", -2), init: cue("d12", "reason", 36),
  tab: cue("d13", "refunds", -6), open: cue("d13", "opens", -2), appr: cue("d13", "approved", 8), note: cue("d13", "note", -2), approve: cue("d13", "approves", -4),
  proc: cue("d14", "processed", -6), done: cue("d14", "complete", -4),
};
const CLICKS = [T.mBill, T.mInv, T.create, T.prog, T.progPick, T.sel, T.full, T.cust, T.make, T.row, T.pdf, T.resend, T.mPP, T.fOpen, T.fPick, T.view, T.edit, T.eSave, T.menu, T.issue, T.part, T.reason, T.init, T.tab, T.open, T.approve, T.proc];
const EXTRA: MenuExtra = { "Billing & Certificate": ["Program Payments"] };

// ───────── data ─────────
type Inv = [string, string, string, string, string, "Sent" | "Paid" | "Refunded", string];
const INV0: Inv[] = [
  ["#7B1E05D2", "Elena Cruz", "payment receipt", "$1,200.00", "$0.00", "Paid", "Oct 22"],
  ["#2C8D44A7", "Jamal Okoye", "payment request", "$250.00", "$250.00", "Sent", "Oct 21"],
  ["#A93F70B1", "Hannah Lee", "refund receipt", "$150.00", "$0.00", "Refunded", "Oct 19"],
  ["#5D60C2E8", "Marcus Reed", "payment receipt", "$300.00", "$0.00", "Paid", "Oct 18"],
  ["#E1B7A936", "Tomás Silva", "payment request", "$500.00", "$500.00", "Sent", "Oct 16"],
  ["#91C0D4F5", "Aisha Khan", "payment receipt", "$800.00", "$0.00", "Paid", "Oct 14"],
];
const NEWINV: Inv = ["#D41C0F67", "Marcus Reed", "payment request", "$250.00", "$250.00", "Sent", "Today"];
const stBadge = (s: string) => (s === "Paid" ? <Badge t="Paid" c="#15803D" bg="#DCFCE7" fs={15} /> : s === "Refunded" ? <Badge t="Refunded" c="#7C3AED" bg="#EDE9FE" fs={15} /> : <Badge t="Sent" c="#1E40AF" bg="#DBEAFE" fs={15} />);
const created = pr; void created;

// ───────── shared bits ─────────
const Inp: React.FC<{ x?: number; y?: number; w: number; h?: number; v: string; ph: string; on?: boolean; icon?: string }> = ({ x, y, w, h = 44, v, ph, on, icon }) => (
  <div style={{ position: x === undefined ? "relative" : "absolute", left: x, top: y, width: w === 0 ? "100%" : w, height: h, boxSizing: "border-box", borderRadius: 10, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 16, color: v ? INK : "#9CA3AF", fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden" }}>{icon && <span style={{ color: GRAY }}>{icon}</span>}{v || ph}</div>
);
const Sel: React.FC<{ w: number; v: string; ph: string; on?: boolean }> = ({ w, v, ph, on }) => (
  <div style={{ width: w, height: 44, boxSizing: "border-box", borderRadius: 10, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#D1D5DB"}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 16, color: v ? INK : "#9CA3AF" }}>{v || ph}<span style={{ color: GRAY }}>⌄</span></div>
);
const Lb: React.FC<{ t: string; opt?: boolean }> = ({ t, opt }) => <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{t}{opt && <span style={{ color: GRAY, fontWeight: 500 }}> (optional)</span>}</div>;
const B1: React.FC<{ t: string; kind?: "p" | "o" | "d"; on?: boolean; w?: number; h?: number }> = ({ t, kind = "p", on, w, h = 44 }) => (
  <span style={{ width: w === 0 ? "100%" : w, flex: w === undefined ? 1 : undefined, height: h, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 16, fontWeight: 700, background: kind === "p" ? (on ? "#1E3A8A" : BLUE) : kind === "d" ? "#DC2626" : "#fff", color: kind === "o" ? INK : "#fff", border: kind === "o" ? `1px solid ${LINE}` : "none", boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", transform: `scale(${on ? 0.97 : 1})`, whiteSpace: "nowrap" }}>{t}</span>
);
const Modal: React.FC<{ f: number; a: number; b: number; w: number; h: number; title: string; sub?: string; x?: number; y?: number; children: React.ReactNode }> = ({ f, a, b, w, h, title, sub, x = (1600 - w) / 2, y = 34, children }) => {
  const k = pr(f, a, 14) * (1 - pr(f, b, 10));
  if (k <= 0.01) return null;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * k})` }} />
      <div style={{ position: "absolute", left: x, top: y + (1 - k) * 24, width: w, height: h, borderRadius: 18, background: "#fff", boxShadow: "0 30px 90px #0006", opacity: k, fontFamily: FONT, overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ padding: "20px 28px 14px", borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: 24, fontWeight: 800, color: INK }}>{title}</div>{sub && <div style={{ fontSize: 15, color: GRAY, marginTop: 2 }}>{sub}</div>}</div>
          <div style={{ fontSize: 24, color: GRAY }}>✕</div>
        </div>
        <div style={{ position: "relative", padding: 28 }}>{children}</div>
      </div>
    </>
  );
};
const Head: React.FC<{ title: string; sub: string }> = ({ title, sub }) => <PageHead title={title} sub={sub} />;

// ───────── INVOICES page ─────────
const InvoicesPage: React.FC<{ f: number }> = ({ f }) => {
  const q = f >= T.search ? typed(f, T.search + 6, "Marcus", 0.35) : "";
  const filtered = f >= T.filt;
  const hasNew = f >= T.make + 24;
  let rows = [...(hasNew ? [NEWINV] : []), ...INV0];
  if (filtered && f < T.create - 14) rows = rows.filter((r) => r[1] === "Marcus Reed");
  const hlCol = f >= T.cStat && f < T.search ? 5 : f >= T.cBal ? 4 : f >= T.cType ? 2 : -1;
  const hlRow = f >= T.row - 6 && f < T.mPP - 16 ? 0 : -1;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <Head title="Invoices" sub="Payment requests, paid invoices and refund invoices" />
      <Inp x={470} y={24} w={270} h={42} v={q} ph="Enter Student Name..." on={f >= T.search - 4 && f < T.filt + 20} icon="⌕" />
      <span style={{ position: "absolute", left: 752, top: 24 }}><B1 t="Legacy invoices (deprecated)" kind="o" w={236} h={42} /></span>
      <span style={{ position: "absolute", left: 1000, top: 24 }}><B1 t="＋ Create invoice" w={150} h={42} on={f >= T.create - 6 && f < T.create + 6} /></span>
      <span style={{ position: "absolute", left: 1162, top: 24 }}><B1 t="Export CSV" kind="o" w={112} h={42} /></span>
      <span style={{ position: "absolute", left: 1284, top: 24 }}><B1 t="⛭" kind="o" w={42} h={42} /></span>
      {hlCol >= 0 && <div style={{ position: "absolute", left: 12 + [0, 140, 390, 580, 720, 860, 1060, 1200][hlCol], top: 120, width: [140, 250, 190, 140, 140, 200, 140, 120][hlCol], height: 54 + 66 * Math.max(1, rows.length), borderRadius: 10, background: "rgba(29,63,214,0.07)", boxShadow: "inset 0 0 0 2px #A5B4FC" }} />}
      <Table x={12} y={120} cols={[{ h: "Invoice", w: 140 }, { h: "Learner", w: 250 }, { h: "Type", w: 190 }, { h: "Amount", w: 140 }, { h: "Balance", w: 140 }, { h: "Status", w: 200 }, { h: "Created", w: 140 }, { h: "Actions", w: 120 }]}
        rows={rows.map((r, i) => [<b key="a">{r[0]}</b>, r[1], <span key="t" style={{ textTransform: "capitalize" }}>{r[2]}</span>, r[3], <span key="b" style={{ color: r[4] !== "$0.00" ? "#DC2626" : INK, fontWeight: 800 }}>{r[4]}</span>, stBadge(r[5]), r[6], <span key="v" style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${LINE}`, fontSize: 15, fontWeight: 700, background: hlRow === i ? "#E0E7FF" : "#fff" }}>View</span>])}
        hl={hlRow} oRow={(i) => (hasNew && i === 0 ? pr(f, T.make + 24, 14) : 1)} />
    </div>
  );
};

// ───────── create-invoice modal ─────────
const CreateModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.mod, b = T.make + 14;
  const stu = f >= T.step2;
  const q = f >= T.q ? typed(f, T.q, "marcus", 0.3) : "";
  const progOpen = f >= T.prog && f < T.progPick + 6, progV = f >= T.progPick + 4 ? "Welding Basics" : "";
  const sessV = f >= T.sess + 6 ? "Evening — Fall 2026" : "";
  const amt = f >= T.amt ? typed(f, T.amt, "250", 0.2) : f >= T.full ? "400" : "";
  const custom = f >= T.cust;
  const due = f >= T.due ? typed(f, T.due + 4, "11/05/2026", 0.4) : "";
  const msg = f >= T.msg ? typed(f, T.msg + 4, "Balance for Welding Basics, due Nov 5.", 1.2) : "";
  return (
    <Modal f={f} a={a} b={b} w={920} h={stu ? 790 : 640} title="Create invoice" sub="Choose a learner and request a payment" y={stu ? 14 : 64}>
      {!stu ? (
        <div>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1.2 }}><Lb t="Search Student" /><Inp w={0} v={q} ph="Name or Email" on={f >= T.q && f < T.prog} /></div>
            <div style={{ flex: 1 }}><Lb t="Program" /><Sel w={260} v={progV} ph="Select bootcamp" on={progOpen} /></div>
            <div style={{ flex: 1 }}><Lb t="Session" /><Sel w={260} v={sessV} ph="Select session" on={f >= T.sess - 2 && f < T.sel} /></div>
          </div>
          {progOpen && <div style={{ position: "absolute", left: 28 + 380 + 14 + 8, top: 118, width: 270, padding: 6, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 40px #0003", zIndex: 4 }}>{["All bootcamps", "Welding Basics", "Electrical 101", "HVAC Core"].map((p) => <div key={p} style={{ height: 38, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, borderRadius: 6, background: p === "Welding Basics" && f >= T.progPick - 4 ? "#EEF2FF" : "transparent" }}>{p}</div>)}</div>}
          <div style={{ marginTop: 20 }}>
            <THead cols={[["Name", 160], ["Email", 230], ["Phone", 130], ["Program", 150], ["Session", 130], ["Action", 90]]} />
            {[["Marcus Reed", "marcus@example.com", "555 0142", "Welding Basics", "Evening", true], ["Marcus Bell", "mbell@example.com", "555 0188", "Electrical 101", "Morning", false]].map(([n, e, p, pg, se, m], i) => {
              const show = f < T.prog + 16 ? true : m;
              if (!show) return null;
              const on = m && f >= T.sel - 8;
              return (
                <div key={n as string} style={{ display: "flex", alignItems: "center", height: 62, borderBottom: `1px solid ${LINE}`, opacity: pr(f, a + 8 + i * 4, 10), background: on ? "#F0F9FF" : "transparent" }}>
                  <div style={{ width: 160, padding: "0 12px", fontSize: 15, fontWeight: 700 }}>{n as string}</div>
                  <div style={{ width: 230, padding: "0 12px", fontSize: 14, color: "#374151" }}>{e as string}</div>
                  <div style={{ width: 130, padding: "0 12px", fontSize: 14, color: "#374151" }}>{p as string}</div>
                  <div style={{ width: 150, padding: "0 12px", fontSize: 14, color: "#374151" }}>{pg as string}</div>
                  <div style={{ width: 130, padding: "0 12px", fontSize: 14, color: "#374151" }}>{se as string}</div>
                  <div style={{ width: 90 }}><B1 t="Select" w={78} h={36} on={!!m && f >= T.sel - 4 && f < T.sel + 8} /></div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ borderRadius: 14, border: "1px solid #C7D2FE", background: "#EEF2FF80", padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Marcus Reed</div>
            <div style={{ fontSize: 14, color: GRAY }}>marcus@example.com</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #C7D2FE55", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: f >= T.avail && f < T.full ? "0 0 0 0" : "none" }}>
              <span style={{ fontSize: 15, color: GRAY }}>Available to invoice</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: BLUE, textShadow: f >= T.avail && f < T.full ? "0 0 18px #6366F188" : "none" }}>${countUp(f, T.step2 + 6, 400, 22).toFixed(2)}</span>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "#F3F4F6", fontSize: 14, color: "#374151" }}>This creates a payment invoice. The learner receives an email and pays it from their portal.</div>
          <div style={{ marginTop: 16 }}>
            <Lb t="Payment amount" />
            <div style={{ display: "flex", gap: 10 }}>
              <B1 t="Full balance · $400.00" kind={custom ? "o" : f >= T.full ? "p" : "o"} on={f >= T.full - 4 && f < T.cust - 4} />
              <B1 t="Custom amount" kind={custom ? "p" : "o"} on={f >= T.cust - 4 && f < T.amt + 20} />
            </div>
            <div style={{ marginTop: 10 }}><Inp w={0} v={amt} ph="Enter amount to request" on={f >= T.amt && f < T.due} /></div>
            <div style={{ marginTop: 6, fontSize: 13, color: GRAY }}>The learner can only pay up to the remaining enrollment balance.</div>
          </div>
          <div style={{ marginTop: 14, width: 300 }}><Lb t="Due date" opt /><Inp w={300} v={due} ph="mm/dd/yyyy" on={f >= T.due && f < T.msg} /></div>
          <div style={{ marginTop: 14 }}><Lb t="Message to learner" opt /><Inp w={0} h={70} v={msg} ph="Add context for this payment request" on={f >= T.msg && f < T.make - 8} /></div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
            <B1 t="Change learner" kind="o" w={190} />
            <B1 t={f >= T.make && f < T.make + 14 ? "Creating..." : "Create and email invoice"} w={300} on={f >= T.make - 8 && f < T.make + 14} />
          </div>
        </div>
      )}
    </Modal>
  );
};

// ───────── view-invoice modal ─────────
const ViewModal: React.FC<{ f: number }> = ({ f }) => {
  const hl = (a: number, b: number) => f >= a && f < b;
  return (
    <Modal f={f} a={T.row + 14} b={T.mPP - 30} w={640} h={470} title="Invoice #D41C0F67" sub="payment request" y={130}>
      <div style={{ fontSize: 17, lineHeight: 2.0, color: INK }}>
        <p style={{ margin: 0 }}><b>Learner:</b> Marcus Reed</p>
        <p style={{ margin: 0, background: hl(T.vAmt, T.vBal) ? "#E0E7FF" : "transparent", borderRadius: 6 }}><b>Amount:</b> $250.00</p>
        <p style={{ margin: 0 }}><b>Status:</b> sent</p>
        <p style={{ margin: 0, background: hl(T.vBal, T.vDue) ? "#E0E7FF" : "transparent", borderRadius: 6 }}><b>Balance:</b> $250.00</p>
        <p style={{ margin: 0, background: hl(T.vDue, T.pdf - 6) ? "#E0E7FF" : "transparent", borderRadius: 6 }}><b>Due:</b> 11/5/2026</p>
        <p style={{ margin: 0 }}><b>Note:</b> Balance for Welding Basics, due Nov 5.</p>
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <B1 t="Download PDF" w={190} on={f >= T.pdf - 4 && f < T.pdf + 12} />
        <B1 t="Resend to learner" w={210} on={f >= T.resend - 4 && f < T.resend + 12} />
      </div>
    </Modal>
  );
};

// ───────── PROGRAM PAYMENTS page ─────────
type Pay = [string, string, string, string, string, string, string, "Approved" | "Pending" | "Incompleted" | "Rejected", string, string];
const PAYS: Pay[] = [
  ["Marcus Reed", "marcus@example.com", "Welding Basics", "Cash", "300", "1200", "Priya N.", "Approved", "Oct 18", "m"],
  ["Elena Cruz", "elena@example.com", "Electrical 101", "Stripe", "1200", "1200", "Priya N.", "Approved", "Oct 22", "e"],
  ["Jamal Okoye", "jamal@example.com", "HVAC Core", "Custom", "250", "900", "—", "Pending", "Oct 26", "j"],
  ["Hannah Lee", "hannah@example.com", "Welding Basics", "PayPal", "150", "1200", "Priya N.", "Approved", "Oct 19", "h"],
  ["Tomás Silva", "tomas@example.com", "Electrical 101", "Cash", "500", "1200", "—", "Pending", "Oct 27", "t"],
  ["Aisha Khan", "aisha@example.com", "HVAC Core", "Stripe", "800", "900", "Priya N.", "Rejected", "Oct 14", "a"],
];
const stBadge2 = (s: string) => (s === "Approved" ? <Badge t="✓ Approved" c="#15803D" bg="#DCFCE7" fs={14} /> : s === "Rejected" ? <Badge t="✕ Rejected" c="#B91C1C" bg="#FEE2E2" fs={14} /> : s === "Incompleted" ? <Badge t="Incompleted" c="#C2410C" bg="#FFEDD5" fs={14} /> : <Badge t="⚠ Pending" c="#B45309" bg="#FEF3C7" fs={14} />);
const PaymentsPage: React.FC<{ f: number }> = ({ f }) => {
  const filtered = f >= T.fPick + 16;
  const approvedMarcus = f >= T.eSave + 12; // edit turns Jamal's pending payment approved? (stays on the pending row)
  let rows = PAYS.map((p, i) => (i === 2 && approvedMarcus ? ([...p.slice(0, 7), "Approved", ...p.slice(8)] as Pay) : p));
  if (filtered && f < T.menu - 30) rows = rows.filter((r) => r[7] === "Pending");
  const hlCol = f >= T.fOpen - 8 ? -1 : f >= T.cStat2 ? 5 : f >= T.cMeth ? 3 : f >= T.cPaid ? 1 : -1;
  const tab = f >= T.tab ? "refunds" : "payments";
  const tabY = 120;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <Head title="All Transactions" sub="View details of student payment records and transactions" />
      <Inp x={640} y={24} w={290} h={42} v="" ph="Enter Email/Name..." icon="⌕" />
      <span style={{ position: "absolute", left: 944, top: 24 }}><B1 t="⇩ Export" kind="o" w={104} h={42} /></span>
      <span style={{ position: "absolute", left: 1060, top: 24 }}><B1 t="⛭ Filter" kind="o" w={104} h={42} on={f >= T.fOpen - 4 && f < T.fPick + 4} /></span>
      <span style={{ position: "absolute", left: 1176, top: 24 }}><B1 t="⇅ Sort" kind="o" w={96} h={42} /></span>
      <div style={{ position: "absolute", left: 18, top: tabY - 12, display: "flex", gap: 6, padding: 5, borderRadius: 12, background: "#E5E7EB" }}>
        {["Payments (86)", "Refunds (2)"].map((t) => <span key={t} style={{ padding: "8px 20px", borderRadius: 9, fontSize: 16, fontWeight: 700, background: (tab === "payments") === t.startsWith("Pay") ? "#fff" : "transparent", color: INK, boxShadow: (tab === "payments") === t.startsWith("Pay") ? "0 1px 3px #0002" : "none", outline: !t.startsWith("Pay") && f >= T.tab - 6 && f < T.tab + 10 ? "4px solid #C7D2FE" : "none" }}>{t}</span>)}
      </div>
      {tab === "payments" ? (
        <>
          {hlCol >= 0 && <div style={{ position: "absolute", left: 12 + [0, 60, 290, 470, 600, 740, 890, 1030, 1170][hlCol], top: 172, width: [60, 230, 180, 130, 140, 150, 140, 140, 120][hlCol], height: 54 + 66 * rows.length, borderRadius: 10, background: "rgba(29,63,214,0.07)", boxShadow: "inset 0 0 0 2px #A5B4FC", zIndex: 1 }} />}
          <Table x={12} y={172} cols={[{ h: "SN", w: 60 }, { h: "Paid By", w: 230 }, { h: "Program", w: 180 }, { h: "Method", w: 130 }, { h: "Amount", w: 140 }, { h: "Status", w: 150 }, { h: "reviewed By", w: 140 }, { h: "Payment Date", w: 140 }, { h: "Actions", w: 120 }]}
            rows={rows.map((r, i) => [i + 1, <PersonCell key="p" name={r[0]} sub={r[1]} />, r[2], r[3], <div key="a"><b>{r[4]}</b><div style={{ fontSize: 12, color: GRAY }}>Total: {r[5]}</div></div>, stBadge2(r[7]), r[6], r[8], <span key="x" style={{ display: "inline-flex", gap: 10 }}><span style={{ width: 34, height: 34, borderRadius: 9, background: "#EEF2FF", color: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", outline: i === 0 && f >= T.view - 4 && f < T.view + 8 ? "3px solid #C7D2FE" : "none" }}>◉</span><span style={{ fontSize: 20, color: GRAY }}>⋮</span></span>])}
            hl={f >= T.menu - 12 && f < T.tab - 10 ? 0 : -1} oRow={(i) => pr(f, T.ppPage + 8 + i * 5, 10)} />
        </>
      ) : <RefundsTab f={f} />}
      {f >= T.fOpen && f < T.fPick + 16 && (
        <div style={{ position: "absolute", left: 1010, top: 74, width: 330, padding: 16, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 24px 60px #0004", zIndex: 6, opacity: pr(f, T.fOpen, 10) }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Filter</div>
          <Lb t="Status" /><Sel w={298} v={f >= T.fPick ? "Pending" : ""} ph="Select" on={f >= T.fPick - 12 && f < T.fPick + 14} />
          {f >= T.fPick - 10 && f < T.fPick + 4 && <div style={{ marginTop: 6, padding: 6, borderRadius: 10, border: `1px solid ${LINE}` }}>{["Pending", "Approved", "Incompleted", "Failed", "Rejected"].map((s) => <div key={s} style={{ height: 32, padding: "0 10px", display: "flex", alignItems: "center", fontSize: 15, background: s === "Pending" ? "#EEF2FF" : "transparent", borderRadius: 6 }}>{s}</div>)}</div>}
        </div>
      )}
    </div>
  );
};
const RefundsTab: React.FC<{ f: number }> = ({ f }) => {
  const st = f >= T.proc + 30 ? "Processed" : f >= T.approve + 16 ? "Approved" : "Pending";
  const approvedAmt = f >= T.approve ? "$150.00" : "-";
  return (
    <Table x={12} y={172} cols={[{ h: "Student", w: 190 }, { h: "Program", w: 170 }, { h: "Reason", w: 180 }, { h: "Requested", w: 120 }, { h: "Approved", w: 120 }, { h: "Requested Date", w: 150 }, { h: "Initiated By", w: 130 }, { h: "Status", w: 140 }, { h: "Actions", w: 100 }]}
      rows={[
        ["Marcus Reed", "Welding Basics", "Changed mind", "$150.00", approvedAmt, "Oct 28", "Branch", <Badge key="s" t={st} c={st === "Processed" ? "#15803D" : st === "Approved" ? "#1E40AF" : "#B45309"} bg={st === "Processed" ? "#DCFCE7" : st === "Approved" ? "#DBEAFE" : "#FEF3C7"} fs={14} />, <span key="e" style={{ width: 34, height: 34, borderRadius: 9, background: "#EEF2FF", color: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", outline: f >= T.open - 6 && f < T.open + 8 ? "3px solid #C7D2FE" : "none" }}>◉</span>],
        ["Hannah Lee", "Welding Basics", "Duplicate payment", "$150.00", "$150.00", "Oct 19", "Student", <Badge key="s2" t="Processed" c="#15803D" bg="#DCFCE7" fs={14} />, <span key="e2" style={{ color: GRAY }}>◉</span>],
      ]} hl={f >= T.open - 8 && f < T.open + 20 ? 0 : -1} oRow={() => pr(f, T.tab + 6, 12)} />
  );
};

// ───────── payment details modal ─────────
const DetailsModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.view + 6, b = T.edit + 8;
  const hl = (x: number, y: number) => f >= x && f < y;
  const Card: React.FC<{ title: string; on: boolean; children: React.ReactNode }> = ({ title, on, children }) => (
    <div style={{ borderRadius: 12, border: `${on ? 2 : 1}px solid ${on ? BLUE : LINE}`, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none", overflow: "hidden", background: "#fff" }}>
      <div style={{ padding: "10px 14px", background: "#EEF2FF", fontSize: 15, fontWeight: 800, color: INK }}>{title}</div>
      <div style={{ padding: 14, fontSize: 14, lineHeight: 1.7, color: "#374151" }}>{children}</div>
    </div>
  );
  return (
    <Modal f={f} a={a} b={b} w={980} h={720} title="Payment Details" y={36}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ fontSize: 19, fontWeight: 800 }}>Transaction ID #6720a1f4</div><div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>{stBadge2(f >= T.eSave + 14 ? "Approved" : "Pending")}<B1 t="✎ Edit" kind="o" w={90} h={36} on={f >= T.edit - 6 && f < T.edit + 8} /></div></div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card title="Student Information" on={hl(T.dStu, T.dAtt)}>Jamal Okoye<br />jamal@example.com<br />555 0166<br />Payment Date: Oct 26, 2026</Card>
        <Card title="Payment Information" on={hl(T.dStu - 4, T.dAtt) && false}>Program: HVAC Core<br />Session: Evening — Fall 2026<br />Amount: 250<br />Payment Method: Custom<br />Note: Bank transfer ref 4471</Card>
        <Card title="Payment Attachment" on={hl(T.dAtt, T.dRev)}><div style={{ height: 96, borderRadius: 8, background: "linear-gradient(135deg,#E5E7EB,#F3F4F6)", display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontWeight: 700 }}>receipt.jpg</div></Card>
        <Card title="Review Information" on={hl(T.dRev, T.edit - 8)}>Reviewed By: —<br />Review Note: Waiting for the bank confirmation.</Card>
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 14 }}>{[["Total Amount", "900.00"], ["Paid Amount", "250.00"], ["Due Amount", "650.00"]].map(([l, v]) => <div key={l} style={{ flex: 1, padding: 12, borderRadius: 12, background: "#F8FAFC", border: `1px solid ${LINE}` }}><div style={{ fontSize: 13, color: GRAY, fontWeight: 700 }}>{l}</div><div style={{ fontSize: 24, fontWeight: 900 }}>{v}</div></div>)}</div>
    </Modal>
  );
};
const EditModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.edit + 10, b = T.eSave + 6;
  const amt = f >= T.eAmt ? typed(f, T.eAmt, "250.00", 0.25) : "250.00";
  const stat = f >= T.eStat + 18 ? "Approved" : "Pending";
  const note = f >= T.eNote ? typed(f, T.eNote + 2, "Bank transfer confirmed on Oct 28.", 1.1) : "Bank transfer ref 4471";
  return (
    <Modal f={f} a={a} b={b} w={820} h={680} title="Update transaction" y={44}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><Lb t="Amount" /><Inp w={0} v={amt} ph="100.00" on={f >= T.eAmt && f < T.eStat - 30} /></div>
        <div><Lb t="Payment Date" /><Inp w={0} v="10/26/2026" ph="" /></div>
        <div><Lb t="Payment Method" /><Sel w={370} v="Custom" ph="Select Method" /></div>
        <div><Lb t="Payment Status" /><Sel w={370} v={stat} ph="Select payment status" on={f >= T.eStat - 4 && f < T.eNote - 6} /></div>
        <div style={{ gridColumn: "1 / span 2" }}><Lb t="Email" /><Inp w={0} v="jamal@example.com" ph="user@example.com" /></div>
        <div style={{ gridColumn: "1 / span 2" }}><Lb t="Note" /><Inp w={0} h={60} v={note} ph="Enter note" on={f >= T.eNote && f < T.eSave - 4} /></div>
        <div style={{ gridColumn: "1 / span 2" }}><Lb t="Attachment" /><div style={{ height: 52, borderRadius: 10, border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 15 }}>receipt.jpg</div></div>
      </div>
      <div style={{ marginTop: 18 }}><B1 t="Update" w={0} on={f >= T.eSave - 8 && f < T.eSave + 6} /></div>
    </Modal>
  );
};

// ───────── actions menu + issue refund modal ─────────
const ActionMenu: React.FC<{ f: number }> = ({ f }) => {
  const k = pr(f, T.menu, 10) * (1 - pr(f, T.issue + 10, 8));
  if (k <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1210 + 250, top: 262 + 60, width: 210, padding: 8, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 44px #0004", opacity: k, fontFamily: FONT, zIndex: 8 }}>
      {[["✎", "Edit"], ["↺", "Issue refund"], ["🗑", "Delete"]].map(([i, t]) => <div key={t} style={{ height: 42, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", borderRadius: 8, fontSize: 16, fontWeight: 600, color: t === "Delete" ? "#DC2626" : INK, background: t === "Issue refund" && f >= T.issue - 8 ? "#EEF2FF" : "transparent" }}>{i}<span>{t}</span></div>)}
    </div>
  );
};
const RefundModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.issue + 12, b = T.init + 14;
  const partial = f >= T.part;
  const amt = f >= T.part + 8 ? typed(f, T.part + 8, "150", 0.22) : "";
  const rs = f >= T.reason + 12 ? "Changed mind" : "";
  const open = f >= T.reason && f < T.reason + 14;
  return (
    <Modal f={f} a={a} b={b} w={780} h={680} title="Issue refund" y={44}>
      <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}><p style={{ margin: 0 }}>Payment method: <b>Cash</b></p><p style={{ margin: 0 }}>Latest payment: $300.00</p><p style={{ margin: 0 }}>Paid balance: $300.00</p></div>
      <div style={{ marginTop: 14 }}><Lb t="Refund amount" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Full amount", "$300.00 available", !partial], ["Partial amount", "Enter a smaller amount", partial]].map(([t, s, on]) => <div key={t as string} style={{ padding: 14, borderRadius: 12, border: `${on ? 2 : 1}px solid ${on ? BLUE : LINE}`, background: on ? "#EEF2FF" : "#fff", boxShadow: (t === "Partial amount") && f >= T.part - 4 && f < T.part + 12 ? "0 0 0 4px #C7D2FE" : "none" }}><div style={{ fontSize: 16, fontWeight: 800 }}>{t as string}</div><div style={{ fontSize: 14, color: GRAY }}>{s as string}</div></div>)}
        </div>
        {partial && <div style={{ marginTop: 10 }}><Inp w={0} v={amt} ph="Less than $300.00" on={f >= T.part + 8 && f < T.reason - 4} /></div>}
      </div>
      <div style={{ marginTop: 14 }}><Lb t="Reason" /><Sel w={724} v={rs} ph="Select a reason" on={f >= T.reason - 4 && f < T.init - 6} />
        {open && <div style={{ marginTop: 6, padding: 6, borderRadius: 10, border: `1px solid ${LINE}`, background: "#fff" }}>{["Changed mind", "Course not as expected", "Duplicate payment", "Financial hardship", "Technical or access issue", "Other"].map((s) => <div key={s} style={{ height: 34, padding: "0 12px", display: "flex", alignItems: "center", fontSize: 15, borderRadius: 6, background: s === "Changed mind" && f >= T.reason + 6 ? "#EEF2FF" : "transparent" }}>{s}</div>)}</div>}
      </div>
      <div style={{ marginTop: 18 }}><B1 t={f >= T.init && f < T.init + 12 ? "Initiating..." : "Initiate refund"} w={0} on={f >= T.init - 8 && f < T.init + 12} /></div>
    </Modal>
  );
};
const Stepper: React.FC<{ step: number }> = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "4px 0 16px" }}>
    {["Requested", "Approved", "Processing", "Processed"].map((l, i) => (
      <React.Fragment key={l}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 110 }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: i <= step ? "#16A34A" : "#E5E7EB", color: "#fff", fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i <= step ? "✓" : i + 1}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: i <= step ? INK : GRAY }}>{l}</div>
        </div>
        {i < 3 && <div style={{ width: 90, height: 4, borderRadius: 2, background: i < step ? "#16A34A" : "#E5E7EB", marginBottom: 20 }} />}
      </React.Fragment>
    ))}
  </div>
);
const ReviewModal: React.FC<{ f: number }> = ({ f }) => {
  const a = T.open + 10, b = T.proc + 80;
  const step = f >= T.done ? 3 : f >= T.approve + 16 ? 1 : 0;
  const amt = f >= T.appr ? "150" : "150";
  const note = f >= T.note ? typed(f, T.note + 2, "Cash returned at the front desk.", 1.0) : "";
  const stage: "pending" | "approved" | "done" = f >= T.done ? "done" : f >= T.approve + 16 ? "approved" : "pending";
  return (
    <Modal f={f} a={a} b={b} w={760} h={720} title="Refund" y={36}>
      <Stepper step={step} />
      <div style={{ padding: 14, borderRadius: 12, background: "#F8FAFC", border: `1px solid ${LINE}`, fontSize: 15, lineHeight: 1.8, color: "#374151" }}>Requested Amount <b style={{ fontSize: 20, color: INK }}>$150.00</b><br />Reason Category: Changed mind<br />Refund Method: Original</div>
      {stage === "pending" && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Review this request</div>
          <Lb t="Approved Amount ($)" />
          <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1 }}><Inp w={0} v={amt} ph="" on={f >= T.appr - 2 && f < T.note - 6} /></div><B1 t="Full" w={80} /><B1 t="Partial" kind="o" w={90} /></div>
          <div style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Up to $150.00 requested. Lower this to approve a partial refund.</div>
          <div style={{ marginTop: 12 }}><Lb t="Admin Note" /><Inp w={0} h={52} v={note} ph="Optional note for this decision" on={f >= T.note && f < T.approve - 8} /></div>
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}><B1 t="Reject" kind="d" /><B1 t="Approve" on={f >= T.approve - 6 && f < T.approve + 10} /></div>
        </div>
      )}
      {stage === "approved" && (
        <div style={{ marginTop: 14 }}>
          <div style={{ padding: 14, borderRadius: 12, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 15, color: "#1E3A8A", fontWeight: 700 }}>Approved for $150.00. Once the money has actually been sent back to the student, mark this as processed below.</div>
          <div style={{ marginTop: 16 }}><B1 t="Mark as Processed" w={0} on={f >= T.proc - 6 && f < T.proc + 10} /></div>
        </div>
      )}
      {stage === "done" && <div style={{ marginTop: 14, padding: 16, borderRadius: 12, background: "#F0FDF4", border: "1px solid #86EFAC", fontSize: 16, color: "#166534", fontWeight: 800 }}>✓ Refund processed on Oct 28, 2026</div>}
    </Modal>
  );
};

// ───────── window ─────────
const scrN = (f: number) => (f < T.mPP ? "inv" : "pay");
const Demo: React.FC<{ f: number }> = ({ f }) => {
  const onInv = scrN(f) === "inv";
  const overlay = (
    <>
      <CreateModal f={f} />
      <ViewModal f={f} />
      <DetailsModal f={f} />
      <EditModal f={f} />
      <RefundModal f={f} />
      <ReviewModal f={f} />
      <Toast f={f} at={T.make + 6} text="Invoice created and email queued for the learner" d={60} />
      <Toast f={f} at={T.resend + 6} text="Invoice email queued" d={50} />
      <Toast f={f} at={T.eSave + 6} text="Transaction updated successfully" d={55} />
      <Toast f={f} at={T.init + 6} text="Refund initiated. Complete the processing step." d={60} />
    </>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#F8FAFC" }}>
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]} calm={0.999}>
        <LandFull f={f} at={DEMO_START} url={onInv ? (f >= T.page ? "summit.skillbnk.com/invoices" : "summit.skillbnk.com/dashboard") : "summit.skillbnk.com/program-payments"} branch="Summit Trade School" active={f < T.page ? "Dashboard" : onInv ? "Invoices" : "Program Payments"} openGroup={f >= T.mBill ? "Billing & Certificate" : undefined} extra={EXTRA}
          main={f < T.page ? <div style={{ position: "absolute", inset: 0, background: "#F5F7FB" }}><div style={{ position: "absolute", left: 32, top: 22, fontSize: 32, fontWeight: 900, color: INK }}>Dashboard</div></div> : onInv ? <InvoicesPage f={f} /> : <PaymentsPage f={f} />}
          overlay={overlay} />
        <ActionMenuLayer f={f} />
        <Cursor f={f} pts={CURS} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Training provider portal" />
    </AbsoluteFill>
  );
};
// the row menu floats above the page (world coords inside the scaled window)
const ActionMenuLayer: React.FC<{ f: number }> = ({ f }) => {
  const k = pr(f, T.menu, 10) * (1 - pr(f, T.issue + 10, 8));
  if (k <= 0.01) return null;
  const [x, y] = fitPts([[0, ...CT(SBW0 + 1210, HDR0 + 296)]])[0].slice(1) as [number, number];
  return (
    <div style={{ position: "absolute", left: x - 190, top: y + 8, width: 250, padding: 8, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 44px #0004", opacity: k, fontFamily: FONT, zIndex: 8 }}>
      {[["✎", "Edit"], ["↺", "Issue refund"], ["🗑", "Delete"]].map(([i, t]) => <div key={t} style={{ height: 46, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 8, fontSize: 18, fontWeight: 600, color: t === "Delete" ? "#DC2626" : INK, background: t === "Issue refund" && f >= T.issue - 8 ? "#EEF2FF" : "transparent" }}>{i}<span>{t}</span></div>)}
    </div>
  );
};
const SBW0 = 250, HDR0 = 60;
void ActionMenu;

// ───────── camera / cursor / steps ─────────
const M = (x: number, y: number) => MA(x, y);
const CAMW: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.mBill, 760, 600, 1.1], [T.page + 8, 960, 540, 1.0],
  [T.cType, 1000, 560, 1.08], [T.search, 1000, 520, 1.08], [T.create - 6, 1000, 480, 1.08], [T.mod, 960, 560, 1.06], [T.step2, 960, 600, 1.06], [T.make, 960, 640, 1.06],
  [T.row - 10, 1000, 540, 1.08], [T.row + 20, 960, 560, 1.06], [T.mPP - 24, 960, 540, 1.0], [T.ppPage, 1000, 540, 1.06],
  [T.fOpen, 1040, 480, 1.08], [T.view + 10, 960, 560, 1.05], [T.edit + 14, 960, 560, 1.05], [T.eSave + 10, 1000, 540, 1.06],
  [T.menu - 8, 1040, 560, 1.08], [T.issue + 14, 960, 560, 1.05], [T.init + 16, 1000, 540, 1.06],
  [T.tab, 1000, 480, 1.06], [T.open + 12, 960, 560, 1.05], [T.proc + 40, 960, 540, 1.0], [PAY_START, 960, 540, 1.0],
]);
const CAM = CAMW.map(fitKey);
const CUR_W: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.mBill, ...realMenuPt("Billing & Certificate", undefined, false, false, EXTRA)],
  [T.mInv, ...realMenuPt("Invoices", "Billing & Certificate", false, false, EXTRA)],
  [T.page + 30, ...M(700, 300)],
  [T.cType, ...M(400, 260)], [T.cBal, ...M(790, 260)], [T.cStat, ...M(1000, 260)],
  [T.search, ...M(560, 46)], [T.filt + 30, ...M(560, 46)],
  [T.create, ...M(1072, 46)], [T.q, ...CT(560, 160)],
  [T.prog, ...CT(990, 190)], [T.progPick - 6, ...CT(930, 300)], [T.sess, ...CT(1220, 190)], [T.sel, ...CT(1405, 305)],
  [T.step2 + 20, ...CT(560, 290)], [T.full, ...CT(480, 470)], [T.cust, ...CT(760, 470)], [T.amt, ...CT(560, 540)],
  [T.due, ...CT(560, 606)], [T.msg, ...CT(560, 690)], [T.make, ...CT(1100, 740)],
  [T.row - 6, ...M(1270, 120 + 54 + 33)], [T.row + 4, ...M(1270, 120 + 54 + 33)], [T.vAmt, ...CT(600, 340)], [T.pdf, ...CT(700, 560)], [T.resend, ...CT(930, 560)],
  [T.mPP - 6, ...realMenuPt("Program Payments", "Billing & Certificate", false, false, EXTRA)],
  [T.ppPage + 20, ...M(700, 340)], [T.cPaid, ...M(300, 300)], [T.cMeth, ...M(780, 300)],
  [T.fOpen, ...M(1112, 46)], [T.fPick - 10, ...M(1160, 148)], [T.fPick, ...M(1160, 205)],
  [T.view, ...M(1255 - 12, 172 + 54 + 33)],
  [T.dStu, ...CT(560, 330)], [T.dAtt, ...CT(560, 560)], [T.dRev, ...CT(1000, 560)], [T.edit, ...CT(1380, 140)],
  [T.eAmt, ...CT(600, 270)], [T.eStat, ...CT(1100, 340)], [T.eNote, ...CT(700, 480)], [T.eSave, ...CT(560, 650)],
  [T.menu, ...M(1285, 172 + 54 + 33)], [T.issue, ...CT(1330, 300)], [T.part, ...CT(1010, 396)], [T.reason, ...CT(900, 540)], [T.init, ...CT(660, 660)],
  [T.tab, ...M(180, 108)], [T.open, ...M(1085, 172 + 54 + 33)], [T.appr, ...CT(560, 440)], [T.note, ...CT(560, 530)], [T.approve, ...CT(780, 620)],
  [T.proc, ...CT(700, 530)], [PAY_START, 1560, 880],
]);
const CURS = fitPts(CUR_W);
const STEPS = [
  { at: T.mBill, to: T.create, label: "Billing → Invoices" },
  { at: T.create, to: T.row, label: "Create an invoice" },
  { at: T.row, to: T.mPP, label: "Open, download, resend" },
  { at: T.mPP, to: T.edit, label: "Program payments" },
  { at: T.edit, to: T.menu, label: "Edit a transaction" },
  { at: T.menu, to: T.tab, label: "Issue a refund" },
  { at: T.tab, to: PAY_START, label: "Track the refund" },
];

// ───────── hook: a receipt tape that won't add up ─────────
const HK = { card: cue("h0", "card"), cash: cue("h0", "cash"), refund: cue("h0", "refund", 0, 1), add: cue("h0", "add") };
const TAPE: [string, string, number][] = [
  ["SUMMIT TRADE SCHOOL", "", 4], ["MARCUS REED · WELDING", "", 14], ["INVOICE", "$1,200.00", 26], ["CARD", "- $500.00", HK.card - 4], ["CASH", "- $300.00", HK.cash - 4], ["REFUND ASKED", "- $150.00 ?", HK.refund - 4], ["BANK TRANSFER", "- $250.00 ?", HK.add - 30], ["BALANCE", "$ ???", HK.add],
];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.refund, HK.add + 30);
  const shown = TAPE.filter(([, , at]) => f >= at).length;
  const run = ["$1,200", "$700", "$400", "$550", "$300", "$???"][Math.min(5, Math.max(0, shown - 2))];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 56, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#FBBF24" }}>SUMMIT TRADE SCHOOL</div>
          <div style={{ marginTop: 6, fontSize: 52, fontWeight: 900, color: "#F8FAFC" }}>End of month, one receipt tape</div>
        </div>
        <div style={{ position: "absolute", left: 560, top: 190, width: 560, height: 800, overflow: "hidden", clipPath: "polygon(0 0,100% 0,100% 100%,96% 97%,92% 100%,88% 97%,84% 100%,80% 97%,76% 100%,72% 97%,68% 100%,64% 97%,60% 100%,56% 97%,52% 100%,48% 97%,44% 100%,40% 97%,36% 100%,32% 97%,28% 100%,24% 97%,20% 100%,16% 97%,12% 100%,8% 97%,4% 100%,0 97%)", background: "#F8FAFC", boxShadow: "0 30px 80px #0008" }}>
          <div style={{ padding: "34px 40px", fontFamily: "'Courier New', monospace" }}>
            {TAPE.map(([a, b, at], i) => (
              <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 800, color: b.includes("?") ? "#B91C1C" : "#111827", marginTop: i === 0 ? 0 : 26, opacity: pr(f, at, 10), transform: `translateY(${(1 - pr(f, at, 10)) * 28}px)`, borderBottom: i === 1 ? "3px dashed #94A3B8" : "none", paddingBottom: i === 1 ? 18 : 0 }}><span>{a}</span><span>{b}</span></div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 1220, top: 250, width: 440, padding: "22px 30px", borderRadius: 20, background: "#0B1220", border: `5px solid ${warm > 0.4 ? "#EF4444" : "#475569"}`, opacity: pr(f, 14, 12) }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 4, color: "#94A3B8" }}>RUNNING TOTAL</div>
          <div style={{ marginTop: 8, fontSize: 80, fontWeight: 900, color: warm > 0.4 ? "#FCA5A5" : "#86EFAC", fontVariantNumeric: "tabular-nums" }}>{run}</div>
        </div>
        <Person f={f} at={HK.card - 10} x={1440} y={560} name="Priya" role="Accounts, Summit Trade School" mood={warm > 0.4 ? "stress" : "ok"} s={0.9} />
      </Stage>
      <Stamp f={f} at={HK.add + 6} x={960} y={900} text="DOESN'T ADD UP" size={64} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.card, "Part paid by card.", "card"], [HK.cash, "Part paid in cash.", "cash"], [HK.refund, "Then a refund request.", "refund"], [HK.add, "And the total won't add up.", "won't add up"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { one: cue("p15", "invoices"), close: cue("p15", "closes") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(99,102,241,0.25), transparent 62%)" }} />
    <Person f={f} at={PAY_START + 4} x={340} y={260} name="Priya" role="Summit Trade School" mood="happy" />
    {["Invoices", "Payments", "Refunds"].map((t, i) => <div key={t} style={{ position: "absolute", left: 600 + i * 330, top: 260, width: 300, height: 150, borderRadius: 22, background: "#F8FAFC", border: "6px solid #6366F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 900, color: INK, opacity: pr(f, PY.one - 6 + i * 6, 10), transform: `translateY(${(1 - pr(f, PY.one - 6 + i * 6, 10)) * 30}px)` }}>{t}</div>)}
    <div style={{ position: "absolute", left: 0, top: 500, width: 1920, textAlign: "center", fontSize: 50, fontWeight: 900, color: "#C7D2FE", opacity: pr(f, PY.close - 6, 12) }}>One place. Month closed without reconciling by hand.</div>
    <div style={{ position: "absolute", left: 0, top: 590, width: 1920, textAlign: "center", fontSize: 28, fontWeight: 700, color: "#94A3B8", opacity: pr(f, PY.close + 16, 12) }}>Example: 2 hours a week reconciling × 50 weeks = 100 hours a year</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  TAPE.forEach(([, , at]) => add(at, "key1", 0.18));
  add(HK.refund, "thud", 0.3); add(HK.add + 6, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  [T.make + 6, T.resend + 6, T.eSave + 6, T.init + 6].forEach((t) => add(t, "chime", 0.4));
  add(T.mPP, "whoosh_s", 0.3); add(T.done, "chime", 0.5);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.close, "chime", 0.5);
  return a;
})();

export const InvoicesRefundsStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="invrefstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.mPP]} finish={false} />;
};
