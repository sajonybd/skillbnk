import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx } from "./storyShell";

/**
 * PaymentHistoryStoryVideo — DEEP (sheet serial 51, Payment History). Story: Aisha, learner at Marco's medical assistant school (fictional).
 * Verified in code: SB-Learner Navbar profile menu ("Payments" → /payment-history, "Invoices"); payment-history PaymentHistoryPage ("Payment
 * History", "Track and manage your payments easily", Make Payment / Request Refund / Refund History, makePaymentDisabledHint),
 * TransactionsStatistics (Total Amount / Due Amount / Paid Amount), TransactionTable ("Transaction history", "{n} records", filters All /
 * Payments / Refunds, columns Transaction / Amount / Method / Date and Time / Attachment / Note / Status / Actions, statuses Approved / Pending /
 * Incompleted / Rejected, actions Pay Now / Cancel (incompleted) / View / invoice PDF), Payment Details modal (Payment ID, Amount, Method, Date
 * and Time, Attachment, Note, Download Attachment), TransactionInvoicePDF (Student Name, Course / Program, Session, Payment Method, Amount Paid,
 * Date & Time, Note), RequestRefundModal (Total Paid, Refund Details, Refund Amount ($), "Available from the last payment", Reason list,
 * Additional Details, Refund Method = last approved payment method, Contact Number, Supporting Document, "Submit Refund Request", "Refund
 * request submitted"), RefundStatusBanner ("Refund Requested — Pending Review", Amount, Requested on, Reason, Cancel Request), RefundHistoryModal.
 * Voice: python3 generate-voice-story.py src/PaymentHistoryStoryVideo.tsx public/payhiststory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "p11"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 405,
  d1: 238,
  d2: 226,
  d3: 296,
  d4: 240,
  d5: 174,
  d6: 205,
  d7: 179,
  d8: 343,
  d9: 302,
  d10: 177,
  p11: 134,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "p11"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 15, 40, 51, 57, 64, 76, 85, 96, 103, 136, 137, 143, 147, 152, 157, 183, 186, 193, 197, 205, 232, 235, 241, 244, 252, 281, 287, 295, 304, 314, 322, 331, 339, 348, 357, 366],
  d1: [2, 21, 41, 48, 59, 67, 79, 128, 128, 139, 145, 156, 166, 184, 194],
  d2: [2, 14, 25, 34, 45, 52, 59, 84, 86, 107, 110, 130, 137, 139, 160, 165, 171, 181, 192, 198],
  d3: [2, 31, 36, 49, 61, 70, 84, 109, 121, 135, 141, 158, 165, 166, 172, 195, 199, 226, 234, 250, 253, 267],
  d4: [2, 22, 44, 55, 64, 102, 102, 114, 123, 134, 141, 145, 149, 185, 185, 202],
  d5: [2, 10, 27, 39, 46, 54, 60, 69, 79, 88, 99, 109, 120, 126],
  d6: [2, 15, 28, 35, 43, 75, 78, 108, 126, 141, 156, 168, 177],
  d7: [2, 12, 22, 53, 53, 61, 70, 99, 102, 107, 113, 121, 144, 153],
  d8: [2, 12, 18, 63, 64, 75, 90, 96, 105, 129, 133, 139, 157, 170, 170, 177, 203, 203, 219, 232, 246, 264, 270, 276, 284, 290, 293, 297, 306, 312],
  d9: [2, 9, 15, 27, 36, 53, 58, 90, 90, 112, 119, 127, 132, 140, 165, 168, 176, 187, 198, 211, 225, 229, 232, 240, 246, 252, 260],
  d10: [2, 16, 28, 38, 50, 59, 65, 73, 92, 95, 102, 111, 125, 130, 132, 135, 140],
  p11: [2, 16, 37, 49, 82, 91, 97],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Every week, Marco's front desk answers the same billing questions. How much do I still owe? Did my payment go through? Can you send my receipt? And each answer means digging through bank statements and old emails.",
  d1: "In skillbank, learners answer those questions themselves. Aisha opens her profile menu, and clicks payments.",
  d2: "Payment history puts three totals on top: total amount, due amount, and paid amount, with make payment one click away.",
  d3: "Below, the transaction history lists every payment: the amount, the method, the date and time, any attachment, the note, and the status.",
  d4: "Filters split payments from refunds. And every status is clear at a glance: approved, or incompleted.",
  d5: "An unfinished card payment can be completed right here with pay now, or cancelled.",
  d6: "View opens the payment details: payment ID, amount, method, date, attachment, and note.",
  d7: "And one click downloads an invoice PDF, ready for her records, or her employer.",
  d8: "Need money back? Request refund shows her total paid. She enters the amount, picks a reason, adds the details, and submits. The refund goes back to her last payment method.",
  d9: "A banner now tracks it: refund requested, pending review, with the amount and date. Make payment pauses until it's settled, and she can cancel the request anytime.",
  d10: "Refund history keeps every request in one place, with its status and the date it was requested.",
  p11: "Every payment, one history. Fewer billing questions.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  menu: cue("d1", "profile", -6),
  payments: cue("d1", "payments", -2),
  page: cue("d1", "payments", 8),
  totals: S.d2,
  sTotal: cue("d2", "total", -4),
  sDue: cue("d2", "due", -4),
  sPaid: cue("d2", "paid", -4),
  mk: cue("d2", "make", -4),
  table: S.d3,
  cAmt: cue("d3", "amount", -4),
  cMeth: cue("d3", "method", -4),
  cDate: cue("d3", "date", -4),
  cAtt: cue("d3", "attachment", -4),
  cNote: cue("d3", "note", -4),
  cStat: cue("d3", "status", -4),
  filters: S.d4,
  fPay: cue("d4", "payments", -2),
  fRef: cue("d4", "refunds", -2),
  fAll: cue("d4", "every", -2),
  stOk: cue("d4", "approved", -4),
  stInc: cue("d4", "incompleted", -4),
  inc: S.d5,
  payNow: cue("d5", "pay", -4),
  cancel: cue("d5", "cancelled", -6),
  view: cue("d6", "view", -2),
  detail: cue("d6", "payment", -4, 1),
  closeView: S.d7 - 8,
  pdf: cue("d7", "downloads", -4),
  refund: cue("d8", "request", -2),
  rTotal: cue("d8", "total", -4),
  rAmt: cue("d8", "enters", -4),
  rReason: cue("d8", "picks", -4),
  rDetail: cue("d8", "adds", -4),
  rSubmit: cue("d8", "submits", 0),
  rMethod: cue("d8", "goes", -6),
  banner: S.d9,
  bMk: cue("d9", "pauses", -10),
  bCancel: cue("d9", "cancel", -4),
  hist: cue("d10", "refund", -2),
  histClose: PAY_START - 30,
};
const SUBMIT_AT = T.rMethod + 34;
const CLICKS = [T.menu, T.payments, T.fPay, T.fRef, T.fAll, T.view, T.closeView, T.pdf, T.refund, T.rReason, T.rReason + 22, SUBMIT_AT, T.hist];

// ───────── data ─────────
const $ = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
type Tx = { amt: number; m: string; d: string; t: string; st: "approved" | "incompleted"; att?: string; note?: string; id: string };
const TXS: Tx[] = [
  { amt: 800, m: "stripe", d: "Nov 1, 2026", t: "6:05 PM", st: "incompleted", id: "6733f1c2b7e4" },
  { amt: 800, m: "stripe", d: "Oct 1, 2026", t: "9:14 AM", st: "approved", id: "6721a09fd3c1", note: "October installment" },
  { amt: 800, m: "Bank Transfer", d: "Sep 2, 2026", t: "11:40 AM", st: "approved", att: "receipt-sep.pdf", id: "670e2b84a6f0", note: "Deposit — ref MAS-1187" },
];
const COLS: [string, number][] = [["Transaction", 170], ["Amount", 110], ["Method", 150], ["Date and Time", 150], ["Attachment", 130], ["Note", 210], ["Status", 140], ["Actions", 150]];
const colX = (i: number) => 20 + COLS.slice(0, i).reduce((a, c) => a + c[1], 0);

// ───────── page ─────────
const BAN = 100;
const Page: React.FC<{ f: number }> = ({ f }) => {
  const open = f >= SUBMIT_AT + 6;
  const by = open ? BAN * pr(f, SUBMIT_AT + 6, 14) : 0;
  const hl = (a: number, b: number) => f >= a && f < b;
  const filt = f >= T.fAll ? 0 : f >= T.fRef ? 2 : f >= T.fPay ? 1 : 0;
  const rows = filt === 2 ? [] : TXS;
  const colHl = [-1, T.cAmt, T.cMeth, T.cDate, T.cAtt, T.cNote, T.cStat].map((a, i, arr) => (a > 0 && f >= a && f < (arr[i + 1] ?? T.filters) ? i : -1)).find((v) => v >= 0) ?? -1;
  const stats: [string, number, string, string, number][] = [["Total Amount", 2400, "#2563EB", "▣", T.sTotal], ["Due Amount", 800, "#EA580C", "◷", T.sDue], ["Paid Amount", 1600, "#059669", "✓", T.sPaid]];
  const btn = (label: string, x: number, primary: boolean, on: boolean, dis = false) => <div style={{ position: "absolute", right: x, top: 22, height: 36, padding: "0 14px", borderRadius: 8, background: primary ? BLUE : "#fff", border: primary ? "none" : `1px solid ${LINE}`, color: primary ? "#fff" : INK, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", opacity: dis ? 0.5 : 1, boxShadow: on ? "0 0 0 4px #C7D2FE" : "none" }}>{label}</div>;
  const refundsExist = open;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <div style={{ position: "absolute", left: 24, top: 16, fontSize: 24, fontWeight: 800, color: INK }}>← Payment History</div>
      <div style={{ position: "absolute", left: 24, top: 52, fontSize: 15, color: GRAY }}>Track and manage your payments easily</div>
      {btn("＋ Make Payment", 24, true, hl(T.mk, T.table) || hl(T.bMk, T.bCancel), open)}
      {!open && btn("Request Refund", 180, false, hl(T.refund - 20, T.refund + 6))}
      {refundsExist && btn("⟲ Refund History", 180, false, hl(T.hist - 20, T.hist + 6))}
      {open && hl(T.bMk, T.bCancel) && <div style={{ position: "absolute", right: 24, top: 64, width: 300, padding: "8px 12px", borderRadius: 8, background: INK, color: "#fff", fontSize: 12, lineHeight: 1.4, zIndex: 4 }}>You have an open refund request. Cancel it before making a new payment.</div>}
      {open && (
        <div style={{ position: "absolute", left: 24, right: 24, top: 92, height: 84, boxSizing: "border-box", borderRadius: 12, background: "#FFFBEB", border: `1px solid ${hl(T.banner, T.bMk) ? "#F59E0B" : "#FDE68A"}`, padding: "14px 18px", opacity: pr(f, SUBMIT_AT + 6, 14), boxShadow: hl(T.banner, T.bMk) ? "0 0 0 4px #FDE68A" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: "#92400E" }}>⟲ Refund Requested — Pending Review <span style={{ padding: "2px 10px", borderRadius: 999, background: "#FEF3C7", fontSize: 12 }}>Pending</span></div>
          <div style={{ marginTop: 8, display: "flex", gap: 22, fontSize: 14, color: "#78350F" }}><span>Amount: <b>{$(150)}</b></span><span>Requested on Nov 6, 2026</span><span>Reason: Lab kit was never shipped</span></div>
          <div style={{ position: "absolute", right: 18, top: 22, height: 38, padding: "0 14px", borderRadius: 8, border: "1px solid #FCA5A5", background: "#fff", color: "#DC2626", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", boxShadow: hl(T.bCancel, T.bCancel + 40) ? "0 0 0 4px #FECACA" : "none" }}>Cancel Request</div>
        </div>
      )}
      {stats.map(([l, v, c, ic, a], i) => (
        <div key={l} style={{ position: "absolute", left: 24 + i * 442, top: 92 + by, width: 426, height: 104, boxSizing: "border-box", borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, padding: 20, overflow: "hidden", boxShadow: hl(a, a + 26) ? `0 0 0 3px ${c}66` : "none" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: c }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: GRAY }}>{l}<span style={{ width: 34, height: 34, borderRadius: 17, background: `${c}18`, color: c, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{ic}</span></div>
          <div style={{ fontSize: 26, fontWeight: 800, color: INK, marginTop: 4 }}>{$(v)}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 24, right: 24, top: 218 + by, height: 330, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${LINE}` }}>
          <div><div style={{ fontSize: 17, fontWeight: 700, color: INK }}>Transaction history</div><div style={{ fontSize: 13, color: GRAY }}>{rows.length} records</div></div>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 8, background: "#F1F5F9", fontSize: 13, fontWeight: 600, boxShadow: hl(T.filters, T.fAll + 10) ? "0 0 0 3px #C7D2FE" : "none" }}>{["All (3)", "Payments (3)", "Refunds (0)"].map((t, i) => <span key={t} style={{ padding: "6px 12px", borderRadius: 6, background: i === filt ? "#fff" : "transparent", color: i === filt ? INK : GRAY, boxShadow: i === filt ? "0 1px 2px #0002" : "none" }}>{t}</span>)}</div>
        </div>
        <div style={{ position: "relative", height: 40, background: "#F9FAFB", fontSize: 13, fontWeight: 700, color: GRAY }}>
          {COLS.map(([h, w], i) => <div key={h} style={{ position: "absolute", left: colX(i), top: 0, width: w, height: 40, display: "flex", alignItems: "center", color: colHl === i ? BLUE : GRAY, background: colHl === i ? "#EEF2FF" : "transparent" }}>{h}</div>)}
        </div>
        {rows.length === 0 && <div style={{ padding: 50, marginTop: 0, textAlign: "center", fontSize: 15, color: GRAY }}>No refunds yet</div>}
        {rows.map((r, i) => {
          const y = 114 + i * 70;
          const rowOn = (i === 0 && hl(T.inc, T.view - 10)) || (i === 1 && hl(T.view - 10, T.refund)) || (r.st === "approved" && hl(T.stOk, T.stInc)) || (i === 0 && hl(T.stInc, T.inc));
          return (
            <div key={r.id} style={{ position: "absolute", left: 0, right: 0, top: y, height: 70, borderBottom: "1px solid #F1F5F9", fontSize: 14, color: INK, background: rowOn ? "#F5F7FF" : "#fff", boxShadow: rowOn ? `inset 3px 0 0 ${BLUE}` : "none" }}>
              {[
                <span style={{ fontWeight: 600 }}><span style={{ display: "inline-flex", width: 30, height: 30, borderRadius: 8, background: "#EEF2FF", color: BLUE, alignItems: "center", justifyContent: "center", marginRight: 8 }}>↗</span>Payment</span>,
                <b>{$(r.amt)}</b>, <span style={{ color: "#374151" }}>{r.m}</span>,
                <span style={{ lineHeight: 1.25 }}>{r.d}<br /><span style={{ fontSize: 12, color: GRAY }}>{r.t}</span></span>,
                r.att ? <span style={{ color: BLUE, fontWeight: 600 }}>▤ View PDF</span> : <span style={{ color: GRAY }}>None</span>,
                <span style={{ color: GRAY, whiteSpace: "nowrap" }}>{r.note || "—"}</span>,
                <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: r.st === "approved" ? "#DCFCE7" : "#FFEDD5", color: r.st === "approved" ? "#15803D" : "#C2410C", boxShadow: (r.st === "approved" && hl(T.stOk, T.stInc)) || (r.st === "incompleted" && hl(T.stInc, T.inc)) ? "0 0 0 3px #A5B4FC" : "none" }}>{r.st === "approved" ? "✓ Approved" : "◔ Incompleted"}</span>,
                <span style={{ display: "flex", gap: 8 }}>
                  {r.st === "incompleted" && <><Ic c="#fff" bg={BLUE} on={hl(T.payNow, T.cancel)}>▭</Ic><Ic c="#DC2626" bg="#FEF2F2" on={hl(T.cancel, T.view - 10)}>ⓧ</Ic></>}
                  <Ic c={INK} bg="#fff" on={i === 1 && hl(T.view - 10, T.view + 8)}>👁</Ic><Ic c={INK} bg="#fff" on={i === 1 && hl(T.pdf - 12, T.pdf + 8)}>⇩</Ic>
                </span>,
              ].map((cell, ci) => <div key={ci} style={{ position: "absolute", left: colX(ci), top: 0, width: COLS[ci][1] - 8, height: 70, display: "flex", alignItems: "center", overflow: "hidden" }}>{cell}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const Ic: React.FC<{ c: string; bg: string; on?: boolean; children: React.ReactNode }> = ({ c, bg, on, children }) => <span style={{ width: 32, height: 32, borderRadius: 8, background: bg, color: c, border: bg === "#fff" ? `1px solid ${LINE}` : "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: on ? "0 0 0 3px #A5B4FC" : "none" }}>{children}</span>;

// ───────── overlays (dialogs) — positioned in main-area coords ─────────
const Dim: React.FC<{ o: number }> = ({ o }) => <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * o})` }} />;
const Modal: React.FC<{ f: number; at: number; end: number; w: number; h: number; children: React.ReactNode }> = ({ f, at, end, w, h, children }) => {
  if (f < at || f >= end) return null;
  const o = pr(f, at, 10) * (1 - lin(f, end - 8, end));
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, zIndex: 6 }}>
      <Dim o={o} />
      <div style={{ position: "absolute", left: (1350 - w) / 2, top: Math.max(14, (776 - h) / 2), width: w, height: h, boxSizing: "border-box", borderRadius: 14, background: "#fff", boxShadow: "0 30px 80px #0006", padding: 24, opacity: o, transform: `scale(${0.96 + 0.04 * o})` }}>{children}</div>
    </div>
  );
};
const KV: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => <div><div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>{k}</div><div style={{ marginTop: 4, fontSize: 16, color: INK, fontWeight: 600 }}>{v}</div></div>;
const RSN = ["Course not as expected", "Financial hardship", "Duplicate payment", "Technical / access issues", "Changed my mind", "Other"];
const Overlays: React.FC<{ f: number }> = ({ f }) => {
  const tx = TXS[1];
  const amt = f >= T.rAmt ? typed(f, T.rAmt + 2, "150.00", 0.4) : "800.00";
  const rsnOpen = f >= T.rReason && f < T.rReason + 22;
  const rsn = f >= T.rReason + 22 ? "Other" : "";
  const det = f >= T.rDetail ? typed(f, T.rDetail + 2, "Lab kit was never shipped", 1) : "";
  const inp = (v: string, ph: string, on: boolean, h = 40) => <div style={{ height: h, borderRadius: 8, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#E5E7EB"}`, boxShadow: on ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: h > 40 ? "flex-start" : "center", padding: h > 40 ? 10 : "0 12px", boxSizing: "border-box", fontSize: 15, color: v ? INK : "#9CA3AF" }}>{v || ph}</div>;
  const sec = (t: string) => <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.6, color: GRAY, margin: "14px 0 8px" }}>{t.toUpperCase()}</div>;
  return (
    <>
      {/* profile menu */}
      {f >= T.menu && f < T.page + 4 && (
        <div style={{ position: "absolute", right: 22, top: 62, width: 230, padding: 8, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 18px 40px #0003", fontFamily: FONT, zIndex: 6, opacity: pr(f, T.menu, 6) }}>
          {["👤  My Profile", "🔑  Change Password", "$  Payments", "▤  Invoices", "⎋  Logout"].map((t, i) => <div key={t} style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 8, fontSize: 15, color: "#374151", background: i === 2 && f >= T.payments - 10 ? "#EEF2FF" : "transparent", fontWeight: i === 2 && f >= T.payments - 10 ? 700 : 500 }}>{t}</div>)}
        </div>
      )}
      {/* payment details */}
      <div style={{ position: "absolute", left: 250, top: 60, width: 1350, height: 776 }}>
        <Modal f={f} at={T.view + 2} end={T.closeView} w={720} h={430}>
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Payment Details</div>
          <div style={{ fontSize: 14, color: GRAY }}>View payment details here.</div>
          <span style={{ position: "absolute", right: 24, top: 26, padding: "4px 12px", borderRadius: 999, background: "#DCFCE7", color: "#15803D", fontSize: 12, fontWeight: 700 }}>✓ Approved</span>
          <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 22, columnGap: 30 }}>
            <KV k="Payment ID" v={<span style={{ fontFamily: "monospace" }}>{tx.id}</span>} /><KV k="Amount" v={$(tx.amt)} /><KV k="Method" v={tx.m} /><KV k="Date and Time" v={`${tx.d} · ${tx.t}`} />
            <KV k="Attachment" v={<span style={{ color: GRAY }}>None</span>} /><KV k="Note" v={tx.note} />
          </div>
        </Modal>
        {/* invoice PDF */}
        {f >= T.pdf + 4 && f < T.refund - 6 && (
          <div style={{ position: "absolute", left: 375, top: 30, width: 600, height: 716, boxSizing: "border-box", borderRadius: 6, background: "#fff", boxShadow: "0 30px 80px #0008", padding: "36px 44px", fontFamily: "Georgia, serif", zIndex: 6, opacity: pr(f, T.pdf + 4, 10) * (1 - lin(f, T.refund - 14, T.refund - 6)), transform: `translateY(${(1 - pr(f, T.pdf + 4, 12)) * 40}px)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 900, color: "#0F766E" }}>⚕ Bayview Medical Assistant School</div><div style={{ fontSize: 26, letterSpacing: 4, color: INK }}>INVOICE</div></div>
            <div style={{ marginTop: 8, height: 3, background: "#0F766E" }} />
            {[["Student Name", "Aisha Karim"], ["Course / Program", "Medical Assistant Program"], ["Session", "Fall 2026 — Weekday"], ["Payment Method", "stripe"], ["Amount Paid", $(800)], ["Date & Time", "October 1, 2026 at 9:14 AM"], ["Note", "October installment"]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #E5E7EB", fontSize: 17, color: "#374151" }}><span>{k}</span><b style={{ color: INK }}>{v}</b></div>)}
            <div style={{ marginTop: 26, display: "inline-block", padding: "6px 18px", border: "3px solid #16A34A", color: "#16A34A", fontFamily: FONT, fontWeight: 900, fontSize: 18, transform: "rotate(-4deg)" }}>Approved</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -46, textAlign: "center", fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#E2E8F0" }}>⇩ invoice-6721a09fd3c1.pdf downloaded</div>
          </div>
        )}
        {/* request refund */}
        <Modal f={f} at={T.refund + 2} end={SUBMIT_AT + 4} w={640} h={760}>
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Request Refund</div>
          <div style={{ fontSize: 14, color: GRAY }}>Tell us a bit more so we can process it quickly</div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "#F0FDF4", display: "flex", justifyContent: "space-between", fontSize: 15, color: "#166534", boxShadow: f >= T.rTotal && f < T.rAmt ? "0 0 0 3px #86EFAC" : "none" }}>Total Paid<b>{$(1600)}</b></div>
          {sec("Refund Details")}
          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Refund Amount ($)</div>
          {inp(amt, "Enter refund amount", f >= T.rAmt && f < T.rReason)}
          <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>Available from the last payment: $800.00</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "10px 0 6px" }}>Reason</div>
          <div style={{ position: "relative" }}>{inp(rsn, "Select a reason", rsnOpen)}
            {rsnOpen && <div style={{ position: "absolute", left: 0, right: 0, top: 44, padding: 6, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 14px 30px #0003", zIndex: 3 }}>{RSN.map((r) => <div key={r} style={{ height: 32, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 6, fontSize: 14, color: INK, background: r === "Other" && f >= T.rReason + 12 ? "#EEF2FF" : "transparent" }}>{r}</div>)}</div>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "10px 0 6px" }}>Additional Details</div>
          {inp(det, "Tell us more about why you are requesting a refund", f >= T.rDetail && f < T.rSubmit, 64)}
          {sec("Refund Method")}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "#F8FAFC", border: `1px solid ${LINE}`, fontSize: 14, color: "#374151", boxShadow: f >= T.rMethod && f < SUBMIT_AT ? "0 0 0 3px #C7D2FE" : "none" }}>Last approved payment method<b style={{ color: INK }}>stripe</b></div>
          {sec("Contact")}
          {inp("(415) 555-0172", "Enter a number we can reach you on", false)}
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, height: 44, borderRadius: 8, background: f >= SUBMIT_AT - 2 ? "#1E3A8A" : BLUE, color: "#fff", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{f >= SUBMIT_AT ? "Submitting..." : "Submit Refund Request"}</div>
        </Modal>
        {/* refund history */}
        <Modal f={f} at={T.hist + 2} end={T.histClose} w={600} h={250}>
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Refund History</div>
          <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: `1px solid ${LINE}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 18, color: INK }}>{$(150)}</b><span style={{ padding: "3px 10px", borderRadius: 999, background: "#FEF3C7", color: "#B45309", fontSize: 12, fontWeight: 700 }}>Pending</span></div>
            <div style={{ marginTop: 6, fontSize: 14, color: "#374151" }}>Other — Lab kit was never shipped</div>
            <div style={{ marginTop: 6, fontSize: 13, color: GRAY }}>Requested on Nov 6, 2026</div>
          </div>
        </Modal>
      </div>
    </>
  );
};

// ───────── camera + cursor ─────────
const calm = (k: K4): K4 => [k[0], Math.max(800, Math.min(1120, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.25, k[3])];
const B = (f: number) => (f >= SUBMIT_AT + 6 ? BAN : 0);
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.menu, 1120, 440, 1.15], [T.page + 6, 960, 520, 1.0],
  [T.totals, 960, 400, 1.15], [T.table, 960, 560, 1.12], [T.filters, 1120, 500, 1.15], [T.stOk, 1000, 560, 1.12],
  [T.inc, 1120, 540, 1.18], [T.view, 960, 520, 1.05], [T.pdf, 960, 540, 1.04], [T.refund, 960, 540, 1.04], [T.rAmt, 960, 470, 1.12],
  [T.rMethod, 960, 600, 1.12], [T.banner, 960, 400, 1.15], [T.bMk, 1120, 420, 1.18], [T.hist, 960, 520, 1.05], [PAY_START, 960, 540, 1.0],
]).map(calm);
const rowY = (i: number, f: number) => 218 + B(f) + 74 + 40 + i * 70 + 35;
const CUR: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.menu, ...MA(1350 - 40, -30)], [T.payments, ...MA(1350 - 130, 2 + 2 * 40 + 20)],
  [T.sTotal, ...MA(240, 150)], [T.sPaid, ...MA(1120, 150)], [T.mk, ...MA(1350 - 90, 40)],
  [T.cAmt, ...MA(colX(1) + 40, 300)], [T.cStat, ...MA(colX(6) + 50, 300)],
  [T.fPay, ...MA(1350 - 24 - 20 - 160, 250)], [T.fRef, ...MA(1350 - 24 - 20 - 50, 250)], [T.fAll, ...MA(1350 - 24 - 20 - 255, 250)],
  [T.payNow, ...MA(colX(7) + 16, rowY(0, T.payNow))], [T.cancel, ...MA(colX(7) + 56, rowY(0, T.cancel))],
  [T.view - 6, ...MA(colX(7) + 16, rowY(1, T.view))], [T.view, ...MA(colX(7) + 16, rowY(1, T.view))],
  [T.closeView, ...MA(1000, 600)],
  [T.pdf - 6, ...MA(colX(7) + 56, rowY(1, T.pdf))], [T.pdf, ...MA(colX(7) + 56, rowY(1, T.pdf))],
  [T.refund - 8, ...MA(1350 - 250, 40)], [T.refund, ...MA(1350 - 250, 40)],
  [T.rAmt, ...MA(675, 200)], [T.rReason, ...MA(675, 290)], [T.rReason + 22, ...MA(675, 290 + 44 + 6 + 5 * 32 + 16)],
  [T.rDetail, ...MA(675, 370)], [SUBMIT_AT - 8, ...MA(675, 776 - 8 - 44)], [SUBMIT_AT, ...MA(675, 776 - 8 - 44)],
  [T.banner + 10, ...MA(700, 160)], [T.bMk, ...MA(1350 - 90, 40)], [T.bCancel, ...MA(1350 - 110, 92 + 41)],
  [T.hist - 8, ...MA(1350 - 260, 40)], [T.hist, ...MA(1350 - 260, 40)], [T.histClose + 10, 1560, 880],
]);
const STEPS = [
  { at: T.menu, to: T.totals, label: "Profile menu → Payments" },
  { at: T.totals, to: T.table, label: "Total, due and paid" },
  { at: T.table, to: T.filters, label: "Every transaction" },
  { at: T.filters, to: T.inc, label: "Filters and statuses" },
  { at: T.inc, to: T.view, label: "Finish or cancel" },
  { at: T.view, to: T.refund, label: "Details and invoice PDF" },
  { at: T.refund, to: T.banner, label: "Request a refund" },
  { at: T.banner, to: PAY_START, label: "Track the refund" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
    <Backdrop f={f} w={1920} h={1080} />
    <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
      <LandWin f={f} inAt={DEMO_START} url={f >= T.page ? "learner.skillbnk.com/payment-history" : "learner.skillbnk.com/dashboard"} learner active={f >= T.page ? "" : "Dashboard"} who="AK" prog="Medical Assistant Program"
        main={f >= T.page ? <Page f={f} /> : <LearnerDash />}
        overlay={<><Overlays f={f} /><Toast f={f} at={SUBMIT_AT + 4} text="Refund request submitted" d={50} /></>} />
      <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
    </CameraWorld>
    <StepChipL f={f} steps={STEPS} />
    <PortalTagL f={f} at={DEMO_START + 14} out={PAY_START - 6} text="Learner portal" />
  </AbsoluteFill>
);
const LearnerDash: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
    <div style={{ position: "absolute", left: 24, top: 18, fontSize: 24, fontWeight: 800, color: INK }}>Dashboard</div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 330, top: 70, width: 314, height: 120, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }} />)}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 24 + i * 660, top: 210, width: 642, height: 360, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}` }} />)}
  </div>
);

// ───────── hook: the "now serving" billing queue ─────────
const HK = { week: cue("h0", "week"), owe: cue("h0", "owe"), through: cue("h0", "through"), receipt: cue("h0", "receipt"), digging: cue("h0", "digging"), emails: cue("h0", "emails") };
const QS = ["How much do I still owe?", "Did my payment go through?", "Can you send my receipt?", "Was my deposit received?", "Why does it say unpaid?", "Can I get an invoice for work?", "Did you get my transfer?", "What's my balance?"];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.digging - 10, HK.emails + 30);
  const serving = 14 + Math.floor(lin(f, HK.week, HK.emails + 20) * 3);
  const waiting = f < HK.owe ? 0 : Math.min(QS.length, 1 + Math.floor((f - HK.owe) / 16));
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 70, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#2DD4BF" }}>BAYVIEW MEDICAL ASSISTANT SCHOOL · FRONT DESK</div>
          <div style={{ marginTop: 6, fontSize: 56, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.week, "Same questions. Every week.", 0.7)}</div>
        </div>
        {/* now-serving display */}
        <div style={{ position: "absolute", left: 140, top: 300, width: 380, height: 300, borderRadius: 26, background: "#020617", border: "6px solid #334155", textAlign: "center", opacity: pr(f, HK.week + 6, 10), boxShadow: "0 0 60px #2DD4BF33" }}>
          <div style={{ marginTop: 26, fontSize: 26, fontWeight: 900, letterSpacing: 4, color: "#94A3B8" }}>NOW SERVING</div>
          <div style={{ fontSize: 150, fontWeight: 900, color: "#F87171", fontFamily: "monospace", lineHeight: 1.2, textShadow: "0 0 30px #EF444488" }}>{serving}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#64748B" }}>waiting: {waiting + 9}</div>
        </div>
        {/* question tickets */}
        {QS.slice(0, waiting).map((q, i) => {
          const a = HK.owe + i * 16;
          const k = pr(f, a, 14);
          const col = i % 3;
          return <div key={q} style={{ position: "absolute", left: 640 + col * 400 + (1 - k) * 200, top: 260 + Math.floor(i / 3) * 170, width: 370, height: 140, boxSizing: "border-box", borderRadius: 14, background: "#FEF9C3", border: "3px dashed #CA8A04", padding: "16px 18px", transform: `rotate(${((i * 37) % 7) - 3}deg)`, opacity: k, boxShadow: "0 14px 30px #0008" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#A16207", fontFamily: "monospace" }}>TICKET #{serving + i + 1}</div>
            <div style={{ marginTop: 10, fontSize: 25, fontWeight: 900, color: "#422006", lineHeight: 1.2 }}>{q}</div>
          </div>;
        })}
        {/* the digging: statements + email pile */}
        {f >= HK.digging && (
          <div style={{ position: "absolute", left: 180, top: 650, opacity: pr(f, HK.digging, 10) }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 46, top: -i * 8, width: 220, height: 140, borderRadius: 8, background: i % 2 ? "#E2E8F0" : "#F8FAFC", border: "3px solid #64748B", transform: `rotate(${(i % 3) * 4 - 4}deg)`, padding: 12, boxSizing: "border-box", fontSize: 16, fontWeight: 800, color: "#475569" }}>{i % 2 ? "✉ Re: Re: payment?" : "Bank statement · Oct"}</div>)}
          </div>
        )}
      </Stage>
      <Stamp f={f} at={HK.emails + 2} x={1180} y={830} text="27 BILLING EMAILS THIS WEEK" size={48} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.owe, "How much do I still owe?", "still owe"], [HK.through, "Did my payment go through?", "go through"], [HK.receipt, "Can you send my receipt?", "receipt"], [HK.digging, "Every answer: digging through statements and emails.", "digging"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { every: cue("p11", "every"), one: cue("p11", "one"), fewer: cue("p11", "fewer") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(45,212,191,0.2), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 560, top: 230, width: 800, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #0009", padding: 26, boxSizing: "border-box", opacity: pr(f, PY.every - 4, 12) }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>Payment History</div>
      <div style={{ marginTop: 14, display: "flex", gap: 14 }}>{[["Total", 2400, "#2563EB"], ["Due", 800, "#EA580C"], ["Paid", 1600, "#059669"]].map(([l, v, c]) => <div key={l as string} style={{ flex: 1, borderRadius: 14, border: `1px solid ${LINE}`, borderTop: `5px solid ${c}`, padding: 14 }}><div style={{ fontSize: 16, color: GRAY, fontWeight: 700 }}>{l as string}</div><div style={{ fontSize: 34, fontWeight: 900, color: INK }}>{$(v as number)}</div></div>)}</div>
      {TXS.map((t, i) => <div key={t.id} style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 18, color: "#374151", padding: "8px 4px", borderBottom: `1px solid ${LINE}`, opacity: pr(f, PY.one + i * 4, 8) }}><span>{t.d}</span><span>{t.m}</span><b>{$(t.amt)}</b><span style={{ color: t.st === "approved" ? "#15803D" : "#C2410C", fontWeight: 800 }}>{t.st === "approved" ? "Approved" : "Incompleted"}</span></div>)}
    </div>
    <div style={{ position: "absolute", left: 0, top: 790, width: 1920, textAlign: "center", fontSize: 48, fontWeight: 900, color: "#99F6E4", opacity: pr(f, PY.fewer - 4, 12) }}>Every payment. One history. Fewer billing questions.</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  QS.forEach((_, i) => add(HK.owe + i * 16, "pop", 0.2));
  add(HK.digging, "thud", 0.3); add(HK.emails + 2, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 6; i++) add(T.rDetail + 2 + i * 5, ["key0", "key1", "key2"][i % 3], 0.14);
  add(T.pdf + 4, "swish", 0.35); add(SUBMIT_AT + 4, "chime", 0.45); add(PAY_START - 3, "whoosh", 0.4); add(PY.fewer, "chime", 0.5);
  return a;
})();

export const PaymentHistoryStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="payhiststory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.page]} />;
};
