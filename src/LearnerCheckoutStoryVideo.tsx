import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Cursor } from "./premiumKit";
import { LandWin, StepChipL, PortalTagL, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { Stage, BeatCaption, Stamp } from "./hookKit";
import { makeTL, typed, Toast, StoryMain, Fx } from "./storyShell";

/**
 * LearnerCheckoutStoryVideo — DEEP (sheet serial 50, Learner Checkout). Story: Jordan pays for Nadia's phlebotomy course (fictional).
 * Verified in code: SB-Learner app/payment/[enrollmentid]/page.tsx + en.ts PaymentPage ("Payment", "Make a payment for your enrollment",
 * Type: / Session:, "✓ Approved", "Unpaid" / "Partially Paid" / "✓ Fully Paid", "Switch Program", Price Breakdown (Original Price, Sale Price,
 * Promo Discount + Code:, Final Price, Paid, Due), "Select Payment Method" grid (Stripe / PayPal / custom; Square filtered out), custom:
 * "<name> Information" read-only fields, "<name> Instruction", "Amount to pay" + "Enter the amount you want to pay now.", "Note (Optional)",
 * attachment, "Pay Now - $x", toasts "Payment submitted successfully!" (→ /payment-history), "Redirecting to payment gateway..." (Stripe
 * opens in a new tab), "Incomplete payment" card (Pay Now / Cancel); validate-stripe page (PaymentValidationPage: "Validating Payment",
 * "Please wait while we process your Stripe transaction...", "Payment Successful", "Thank you for your payment!", "Redirecting to payment
 * page in 3 seconds..."); "Switched program successfully!". Payment History (PaymentHistoryPage / Stats / Table) for the pending deposit.
 * Voice: python3 generate-voice-story.py src/LearnerCheckoutStoryVideo.tsx public/checkoutstory
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "p12"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 470, d1: 230, d2: 200, d3: 330, d4: 230, d5: 230, d6: 280, d7: 260, d8: 230, d9: 250, d10: 330, d11: 330, p12: 150,
};
const VOICE_SPEED = 1.12;
const VOICED: string[] = [];
// @WT-BEGIN
const WT: Record<string, number[]> = {};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Nadia's phlebotomy course fills up every month. But after enrolling, each learner gets a separate payment link by email. Some never open it. Some pay the wrong amount. And every Friday, Nadia chases the same seven people.",
  d1: "With skillbank, paying is part of enrolling. Right after signing up, Jordan lands on the payment page for his program.",
  d2: "He sees his program, its type, and his session, with two badges: approved, and unpaid.",
  d3: "The price breakdown shows the original price, the sale price, and his promo code. Final price, eight hundred fifty dollars. Paid, zero. Due, eight hundred fifty.",
  d4: "Under select payment method, he sees what the school accepts: Stripe, PayPal, and bank transfer.",
  d5: "For his deposit, he picks bank transfer. The school's account details and instructions appear right there.",
  d6: "He enters four hundred twenty-five dollars, adds a note, attaches his transfer receipt, and taps Pay Now.",
  d7: "Payment submitted. It sits as pending in his payment history, until the school approves it.",
  d8: "Approved. Back on the payment page, the badge says partially paid, with four hundred twenty-five dollars still due.",
  d9: "For the rest, he chooses Stripe and taps Pay Now. Stripe's secure checkout opens in a new tab.",
  d10: "If he closes that tab, an incomplete payment card waits for him, with pay now, or cancel. He taps pay now, and finishes with his card.",
  d11: "skillbank validates the payment. Payment successful. The badge turns fully paid, and switch program takes him straight into his course.",
  p12: "Enroll, pay, start learning. No more chasing.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);
void VOICE_SPEED;

const T = {
  page: S.d1,
  prog: cue("d2", "program", -4),
  type: cue("d2", "type", -4),
  sess: cue("d2", "session", -4),
  badges: cue("d2", "badges", -4),
  price: S.d3,
  orig: cue("d3", "original", -4),
  sale: cue("d3", "sale", -4),
  promo: cue("d3", "promo", -4),
  final: cue("d3", "final", -4),
  paid0: cue("d3", "paid", -4),
  due: cue("d3", "due", -4),
  methods: S.d4,
  mStripe: cue("d4", "stripe", -4),
  mPaypal: cue("d4", "paypal", -4),
  mBank: cue("d4", "bank", -4),
  pickBank: cue("d5", "picks", -2),
  details: cue("d5", "account", -6),
  amount: cue("d6", "enters", -4),
  note: cue("d6", "note", -6),
  attach: cue("d6", "attaches", -4),
  pay1: cue("d6", "taps", 4),
  submitted: S.d7,
  pending: cue("d7", "pending", -4),
  approve: cue("d7", "approves", 0),
  back: S.d8,
  partial: cue("d8", "partially", -4),
  stillDue: cue("d8", "still", -6),
  pickStripe: cue("d9", "chooses", 2),
  pay2: cue("d9", "taps", 4),
  opens: cue("d9", "opens", -4),
  closes: cue("d10", "closes", -2),
  incCard: cue("d10", "incomplete", -4),
  payNowInc: cue("d10", "taps", 2),
  finish: cue("d10", "finishes", -4),
  validate: S.d11,
  success: cue("d11", "successful", -4),
  fully: cue("d11", "badge", -4),
  switchP: cue("d11", "switch", 0),
};
const STRIPE_PAY = T.validate - 14;
const CLICKS = [T.pickBank, T.attach, T.pay1, T.pickStripe, T.pay2, T.payNowInc, STRIPE_PAY, T.switchP];

// ───────── money + scenes ─────────
const $ = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
type Scene = "payA" | "hist" | "payB" | "stripe1" | "payInc" | "stripe2" | "valid" | "payC";
const sceneAt = (f: number): Scene =>
  f < T.submitted ? "payA" : f < T.back ? "hist" : f < T.opens ? "payB" : f < T.closes ? "stripe1" : f < T.finish ? "payInc" : f < T.validate ? "stripe2" : f < T.fully - 6 ? "valid" : "payC";

// ───────── payment page (max-w-4xl, centred, no sidebar) ─────────
const X0 = 368, PWD = 864;
const Y = { prog: 120, price: 312, inc: 636, method: 636 };
const INC_H = 134;
const TILE_W = (PWD - 48 - 48) / 4;
const box: React.CSSProperties = { position: "absolute", left: X0, width: PWD, boxSizing: "border-box", borderRadius: 8, background: "#fff", boxShadow: "0 1px 3px #0000001f", padding: 24 };
const field = (label: string, val: string, on = false, ph = "") => (
  <div>
    <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</div>
    <div style={{ height: 40, borderRadius: 6, border: `${on ? 2 : 1}px solid ${on ? BLUE : "#E5E7EB"}`, boxShadow: on ? "0 0 0 3px #C7D2FE" : "none", background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, color: val ? INK : "#9CA3AF", boxSizing: "border-box" }}>{val || ph}</div>
  </div>
);

const PayPage: React.FC<{ f: number; sc: Scene }> = ({ f, sc }) => {
  const state = sc === "payA" ? "A" : sc === "payC" ? "C" : "B";
  const paid = state === "A" ? 0 : state === "B" ? 425 : 850;
  const due = 850 - paid;
  const inc = sc === "payInc" ? INC_H : 0;
  const sel = state === "A" ? (f >= T.pickBank ? "bank" : null) : state === "B" ? (f >= T.pickStripe ? "stripe" : null) : null;
  const scroll = scrollAt(f, sc);
  const hl = (a: number, b: number) => f >= a && f < b;
  const amt = f >= T.amount ? typed(f, T.amount + 4, "425", 0.25) : "850";
  const noteTxt = state === "A" ? (f >= T.note ? typed(f, T.note + 4, "Deposit — transfer ref NPA-2291", 0.9) : "") : "";
  const filed = f >= T.attach + 4;
  const methodH = sel === "bank" ? 930 : sel === "stripe" ? 400 : 250;
  const payY = sel === "bank" ? 862 : sel === "stripe" ? 332 : 180;
  const payPress = (a: number) => f >= a - 2 && f < a + 6;
  const badge = (t: string, c: string, bg: string, on: boolean) => <span style={{ padding: "4px 12px", borderRadius: 999, background: bg, color: c, fontSize: 12, fontWeight: 700, boxShadow: on ? `0 0 0 3px ${c}55` : "none" }}>{t}</span>;
  const row = (k: string, v: React.ReactNode, on: boolean, extra: React.CSSProperties = {}) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 8px", borderBottom: "1px solid #E5E7EB", fontSize: 16, color: "#374151", borderRadius: 4, boxShadow: on ? `inset 0 0 0 2px ${BLUE}` : "none", ...extra }}>{k}{v}</div>
  );
  const tiles = [["stripe", "Stripe", "stripe"], ["paypal", "PayPal", "PayPal"], ["bank", "Bank Transfer", "$"]] as const;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F9FAFB", fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 2400, transform: `translateY(${-scroll}px)` }}>
        <div style={{ position: "absolute", left: X0, top: 32, display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700, color: "#1F2937" }}><span style={{ color: "#4B5563", fontSize: 24 }}>←</span>Payment</div>
        <div style={{ position: "absolute", left: X0, top: 80, fontSize: 16, color: "#4B5563" }}>Make a payment for your enrollment</div>

        {/* program + session */}
        <div style={{ ...box, top: Y.prog, height: 168, boxShadow: hl(T.prog, T.price) ? `0 0 0 2px ${BLUE}, 0 0 0 6px #C7D2FE` : box.boxShadow }}>
          <div style={{ position: "absolute", left: 24, top: 24, width: 96, height: 96, borderRadius: 6, background: "linear-gradient(135deg,#DC2626,#7F1D1D)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FEE2E2", fontSize: 40 }}>🩸</div>
          <div style={{ position: "absolute", left: 144, top: 22 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#1F2937" }}>Phlebotomy Technician Program</div>
            <div style={{ marginTop: 6, fontSize: 14, color: "#4B5563", background: hl(T.type, T.sess) ? "#FEF3C7" : "transparent" }}>Type: <b style={{ fontWeight: 600 }}>Course</b></div>
            <div style={{ marginTop: 4, fontSize: 14, color: "#4B5563", background: hl(T.sess, T.badges) ? "#FEF3C7" : "transparent" }}>Session: <b style={{ fontWeight: 600 }}>Evening — November 2026</b></div>
            <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
              {badge("✓ Approved", "#15803D", "#DCFCE7", hl(T.badges, T.price))}
              {state === "A" ? badge("Unpaid", "#B91C1C", "#FEE2E2", hl(T.badges + 10, T.price)) : state === "B" ? badge("Partially Paid", "#C2410C", "#FFEDD5", hl(T.partial, T.stillDue + 20)) : badge("✓ Fully Paid", "#15803D", "#DCFCE7", hl(T.fully, T.switchP))}
              <span style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${BLUE}`, color: BLUE, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", background: payPress(T.switchP) ? "#E0E7FF" : "#fff", boxShadow: hl(T.switchP - 20, T.switchP + 10) ? "0 0 0 3px #C7D2FE" : "none" }}>{f >= T.switchP && sc === "payC" ? "◌ Switching..." : "Switch Program →"}</span>
            </div>
          </div>
        </div>

        {/* price breakdown */}
        <div style={{ ...box, top: Y.price, height: 300 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: INK, marginBottom: 10 }}>Price Breakdown</div>
          {row("Original Price:", <span style={{ textDecoration: "line-through", color: GRAY }}>{$(1200)}</span>, hl(T.orig, T.sale))}
          {row("Sale Price:", <b style={{ fontWeight: 600 }}>{$(950)}</b>, hl(T.sale, T.promo))}
          {row(<span>Promo Discount: <span style={{ fontSize: 13, color: "#1D4ED8" }}>Code: <b>SPRING100</b></span></span> as unknown as string, <b style={{ color: "#1D4ED8" }}>-{$(100)}</b>, hl(T.promo, T.final), { background: "#EFF6FF" })}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 8px 6px", borderTop: "2px solid #D1D5DB", marginTop: 4, fontSize: 18, fontWeight: 700, color: INK, borderRadius: 4, boxShadow: hl(T.final, T.paid0) ? `inset 0 0 0 2px ${BLUE}` : "none" }}>Final Price:<span>{$(850)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", fontSize: 16, color: "#374151", borderRadius: 4, boxShadow: hl(T.paid0, T.due) ? `inset 0 0 0 2px ${BLUE}` : "none" }}>Paid:<span style={{ color: "#16A34A", fontWeight: 600 }}>{$(paid)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", fontSize: 16, color: "#374151", borderRadius: 4, boxShadow: hl(T.due, T.methods) || hl(T.stillDue, T.pickStripe - 10) ? `inset 0 0 0 2px ${BLUE}` : "none" }}>Due:<span style={{ color: "#DC2626", fontWeight: 600 }}>{$(due)}</span></div>
        </div>

        {/* incomplete gateway payment */}
        {inc > 0 && (
          <div style={{ ...box, top: Y.inc, height: 110, border: "1px solid #FDE68A", opacity: pr(f, T.closes, 10), boxShadow: hl(T.incCard, T.payNowInc + 10) ? "0 0 0 4px #FDE68A" : box.boxShadow }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: INK }}>Incomplete payment</div>
            <div style={{ fontSize: 14, color: "#4B5563" }}>You have a gateway payment that has not been completed yet.</div>
            <div style={{ marginTop: 8, display: "flex", gap: 14, fontSize: 14, color: "#374151" }}><span>Method: <b>stripe</b></span><span>Amount: <b>{$(425)}</b></span></div>
            <div style={{ position: "absolute", right: 24, top: 34, display: "flex", gap: 12 }}>
              <span style={{ height: 40, padding: "0 18px", borderRadius: 6, background: payPress(T.payNowInc) ? "#1E3A8A" : BLUE, color: "#fff", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center" }}>Pay Now</span>
              <span style={{ height: 40, padding: "0 18px", borderRadius: 6, border: "1px solid #FECACA", color: "#DC2626", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", background: "#fff" }}>ⓧ Cancel</span>
            </div>
          </div>
        )}

        {/* select payment method */}
        <div style={{ ...box, top: Y.method + inc, height: methodH }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: INK }}>Select Payment Method</div>
          <div style={{ position: "absolute", left: 24, top: 64, display: "flex", gap: 16 }}>
            {tiles.map(([k, n, ic]) => {
              const on = sel === k;
              const pulse = (k === "stripe" && hl(T.mStripe, T.mPaypal)) || (k === "paypal" && hl(T.mPaypal, T.mBank)) || (k === "bank" && hl(T.mBank, T.pickBank));
              return (
                <div key={k} style={{ width: TILE_W, height: 100, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${on ? BLUE : pulse ? "#93A5F5" : "#E5E7EB"}`, background: on ? BLUE : "#fff", color: on ? "#fff" : "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: pulse ? "0 0 0 4px #C7D2FE" : "none" }}>
                  <div style={{ height: 40, display: "flex", alignItems: "center", fontSize: k === "bank" ? 26 : 22, fontWeight: 800, fontStyle: k === "paypal" ? "italic" : "normal", color: on ? "#fff" : k === "stripe" ? "#635BFF" : k === "paypal" ? "#003087" : "#111827" }}>{ic}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div>
                </div>
              );
            })}
          </div>
          {sel === "bank" && (
            <>
              <div style={{ position: "absolute", left: 24, right: 24, top: 188, padding: 16, borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB", boxShadow: hl(T.details, T.amount) ? "0 0 0 3px #C7D2FE" : "none", opacity: pr(f, T.pickBank + 2, 10) }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: INK, marginBottom: 10 }}>Bank Transfer Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {field("Account Name:", "Northside Phlebotomy Academy")}{field("Bank:", "First Lone Star Bank")}{field("Account Number:", "4821 0093 17")}{field("Routing Number:", "111000025")}
                </div>
              </div>
              <div style={{ position: "absolute", left: 24, right: 24, top: 396, padding: 16, borderRadius: 6, border: "1px solid #E5E7EB", background: "#EFF6FF", opacity: pr(f, T.pickBank + 6, 10) }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: INK }}>Bank Transfer Instruction</div>
                <div style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>Use your full name as the transfer reference. Upload your receipt so we can approve it the same day.</div>
              </div>
              <div style={{ position: "absolute", left: 24, right: 24, top: 500 }}>
                {field("Amount to pay", amt, hl(T.amount, T.note))}
                <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>Enter the amount you want to pay now.</div>
              </div>
              <div style={{ position: "absolute", left: 24, right: 24, top: 596 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Note (Optional)</div>
                <div style={{ height: 100, borderRadius: 6, border: `${hl(T.note, T.attach) ? 2 : 1}px solid ${hl(T.note, T.attach) ? BLUE : "#E5E7EB"}`, padding: 10, boxSizing: "border-box", fontSize: 15, color: noteTxt ? INK : "#9CA3AF" }}>{noteTxt || "Write details note here..."}</div>
              </div>
              <div style={{ position: "absolute", left: 24, right: 24, top: 728, height: 110, borderRadius: 8, border: `2px dashed ${hl(T.attach - 6, T.pay1) ? BLUE : "#D1D5DB"}`, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 15, color: GRAY }}>
                {filed ? <span style={{ padding: "10px 16px", borderRadius: 8, background: "#fff", border: "1px solid #E5E7EB", color: INK, fontWeight: 600, opacity: pr(f, T.attach + 4, 8) }}>📄 transfer-receipt.pdf <span style={{ color: "#16A34A" }}>✓</span></span> : <>⇪ Upload attachment</>}
              </div>
            </>
          )}
          {sel === "stripe" && (
            <div style={{ position: "absolute", left: 24, right: 24, top: 188 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Note</div>
              <div style={{ height: 100, borderRadius: 6, border: "1px solid #E5E7EB", padding: 10, boxSizing: "border-box", fontSize: 15, color: "#9CA3AF" }}>Write details note here...</div>
            </div>
          )}
          <div style={{ position: "absolute", left: 24, right: 24, top: payY + 6, height: 48, borderRadius: 6, background: due <= 0 ? "#93A5F5" : payPress(T.pay1) || payPress(T.pay2) ? "#1E3A8A" : BLUE, opacity: sel || due <= 0 ? 1 : 0.5, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 17, fontWeight: 600 }}>
            {due <= 0 ? "Fully Paid" : <>▭ Pay Now - {$(sel === "bank" ? Number(amt || 0) : due)}</>}
          </div>
        </div>

        {/* transaction history */}
        <div style={{ ...box, top: Y.method + inc + methodH + 24, height: 200, padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", fontSize: 17, fontWeight: 600, color: INK }}>Transaction history <span style={{ fontSize: 13, color: GRAY, fontWeight: 500 }}>{state === "A" ? 0 : state === "B" ? 1 : 2} records</span></div>
          {state !== "A" && <TxRow y={60} amt={425} m="Bank Transfer" d="Nov 3, 2026" t="10:12 AM" st="approved" />}
          {state === "C" && <TxRow y={116} amt={425} m="stripe" d="Nov 5, 2026" t="7:41 PM" st="approved" />}
        </div>
      </div>
    </div>
  );
};
const TxRow: React.FC<{ y: number; amt: number; m: string; d: string; t: string; st: "approved" | "pending"; att?: boolean; note?: string }> = ({ y, amt, m, d, t, st, att, note }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 56, display: "flex", alignItems: "center", borderBottom: "1px solid #F1F5F9", fontSize: 14, color: INK }}>
    <div style={{ width: 170, padding: "0 20px", fontWeight: 600 }}>▣ Payment</div>
    <div style={{ width: 110, fontWeight: 600 }}>{$(amt)}</div>
    <div style={{ width: 140, color: "#374151" }}>{m}</div>
    <div style={{ width: 150, color: "#374151", lineHeight: 1.2 }}>{d}<br /><span style={{ fontSize: 12, color: GRAY }}>{t}</span></div>
    {att !== undefined && <div style={{ width: 110, color: att ? BLUE : GRAY }}>{att ? "View PDF" : "None"}</div>}
    {note !== undefined && <div style={{ width: 200, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note}</div>}
    <div style={{ width: 120 }}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: st === "approved" ? "#DCFCE7" : "#FEF3C7", color: st === "approved" ? "#15803D" : "#B45309" }}>{st === "approved" ? "✓ Approved" : "◷ Pending"}</span></div>
  </div>
);

// scroll per scene (eased between targets)
const scrollAt = (f: number, sc: Scene) => {
  const ease = (keys: [number, number][]) => keys.slice(1).reduce((v, k, i) => v + (k[1] - keys[i][1]) * pr(f, k[0], 20), keys[0][1]);
  if (sc === "payA") return ease([[0, 0], [T.price, 220], [T.methods, 520], [T.details - 4, 690], [T.note - 10, 1000], [T.attach - 10, 1140]]);
  if (sc === "payB") return ease([[0, 110], [T.pickStripe - 16, 520]]);
  if (sc === "payInc") return 520;
  return ease([[0, 0]]);
};

// ───────── payment history (learner portal, pending deposit) ─────────
const History: React.FC<{ f: number }> = ({ f }) => {
  const ok = f >= T.approve + 4;
  const stats: [string, number, string, string][] = [["Total Amount", 850, "#2563EB", "▣"], ["Due Amount", ok ? 425 : 850, "#EA580C", "◷"], ["Paid Amount", ok ? 425 : 0, "#059669", "✓"]];
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <div style={{ position: "absolute", left: 24, top: 18, fontSize: 24, fontWeight: 800, color: INK }}>← Payment History</div>
      <div style={{ position: "absolute", left: 24, top: 54, fontSize: 15, color: GRAY }}>Track and manage your payments easily</div>
      <div style={{ position: "absolute", right: 24, top: 24, height: 38, padding: "0 16px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center" }}>＋ Make Payment</div>
      {stats.map(([l, v, c, ic], i) => (
        <div key={l} style={{ position: "absolute", left: 24 + i * 442, top: 96, width: 426, height: 104, boxSizing: "border-box", borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, padding: 20, overflow: "hidden", boxShadow: ok && i > 0 && f < T.approve + 50 ? `0 0 0 3px ${c}55` : "none" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: c }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: GRAY }}>{l}<span style={{ width: 34, height: 34, borderRadius: 17, background: `${c}18`, color: c, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{ic}</span></div>
          <div style={{ fontSize: 26, fontWeight: 800, color: INK, marginTop: 4 }}>{$(v)}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 24, right: 24, top: 222, height: 260, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${LINE}` }}>
          <div><div style={{ fontSize: 17, fontWeight: 700, color: INK }}>Transaction history</div><div style={{ fontSize: 13, color: GRAY }}>1 records</div></div>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 8, background: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>{["All (1)", "Payments (1)", "Refunds (0)"].map((t, i) => <span key={t} style={{ padding: "6px 12px", borderRadius: 6, background: i === 0 ? "#fff" : "transparent", color: i === 0 ? INK : GRAY }}>{t}</span>)}</div>
        </div>
        <div style={{ display: "flex", height: 40, alignItems: "center", background: "#F9FAFB", fontSize: 13, fontWeight: 700, color: GRAY }}>
          {[["Transaction", 170], ["Amount", 110], ["Method", 140], ["Date and Time", 150], ["Attachment", 110], ["Note", 200], ["Status", 120]].map(([h, w], i) => <div key={h as string} style={{ width: w as number, paddingLeft: i === 0 ? 20 : 0 }}>{h}</div>)}
        </div>
        <div style={{ position: "relative", height: 60, boxShadow: f >= T.pending && f < T.back ? `inset 0 0 0 2px ${ok ? "#16A34A" : "#F59E0B"}` : "none" }}>
          <TxRow y={0} amt={425} m="Bank Transfer" d="Nov 3, 2026" t="10:12 AM" st={ok ? "approved" : "pending"} att note="Deposit — transfer ref NPA-2291" />
        </div>
      </div>
    </div>
  );
};

// ───────── Stripe-hosted checkout (generic card form, new tab) ─────────
const StripeTab: React.FC<{ f: number; second: boolean }> = ({ f, second }) => {
  const a = second ? T.finish : T.opens;
  const card = second ? typed(f, a + 8, "4242 4242 4242 4242", 0.7) : "";
  const exp = second && f >= a + 40 ? "12 / 28" : "", cvc = second && f >= a + 48 ? "123" : "";
  const nm = second && f >= a + 54 ? typed(f, a + 54, "Jordan Reyes", 0.8) : "";
  const press = f >= STRIPE_PAY - 2 && f < STRIPE_PAY + 8;
  const inp = (ph: string, v: string, w: string | number = "100%", on = false) => <div style={{ width: w, height: 44, boxSizing: "border-box", border: `1px solid ${on ? "#635BFF" : "#E0E3EB"}`, boxShadow: on ? "0 0 0 3px #635BFF33" : "none", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, color: v ? "#1A1F36" : "#A3ACB9", background: "#fff" }}>{v || ph}</div>;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, display: "flex" }}>
      <div style={{ width: 800, height: "100%", background: "#F6F9FC", padding: "90px 0 0 160px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 16, color: "#697386" }}>← Northside Phlebotomy Academy</div>
        <div style={{ marginTop: 34, fontSize: 18, color: "#697386" }}>Pay Northside Phlebotomy Academy</div>
        <div style={{ marginTop: 6, fontSize: 44, fontWeight: 700, color: "#1A1F36" }}>{$(425)}</div>
        <div style={{ marginTop: 26, width: 460, display: "flex", justifyContent: "space-between", fontSize: 16, color: "#1A1F36" }}><span>Phlebotomy Technician Program<br /><span style={{ fontSize: 14, color: "#697386" }}>Evening — November 2026 · balance</span></span><span>{$(425)}</span></div>
      </div>
      <div style={{ flex: 1, background: "#fff", padding: "90px 0 0 80px", boxSizing: "border-box", boxShadow: "-8px 0 30px #0000000d" }}>
        <div style={{ width: 460 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1F36", marginBottom: 8 }}>Email</div>
          {inp("", "jordan.reyes@mail.com")}
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1F36", margin: "22px 0 8px" }}>Card information</div>
          {inp("1234 1234 1234 1234", card, "100%", second && f >= a + 6 && f < a + 40)}
          <div style={{ display: "flex" }}>{inp("MM / YY", exp, "50%")}{inp("CVC", cvc, "50%")}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1F36", margin: "22px 0 8px" }}>Name on card</div>
          {inp("", nm)}
          <div style={{ marginTop: 30, height: 50, borderRadius: 6, background: press ? "#4B44D6" : "#635BFF", color: "#fff", fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", opacity: second ? 1 : 0.85 }}>{f >= STRIPE_PAY ? "◌ Processing…" : `Pay ${$(425)}`}</div>
          <div style={{ marginTop: 26, textAlign: "center", fontSize: 13, color: "#A3ACB9" }}>Powered by <b>stripe</b> · Secure card payment</div>
        </div>
      </div>
    </div>
  );
};

// ───────── validate-stripe page ─────────
const Validate: React.FC<{ f: number }> = ({ f }) => {
  const ok = f >= T.success;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F9FAFB", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 520, padding: 40, borderRadius: 16, background: "#fff", boxShadow: "0 10px 30px #0000001a", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, margin: "0 auto", borderRadius: 36, background: ok ? "#DCFCE7" : "#E0E7FF", color: ok ? "#16A34A" : BLUE, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${ok ? 0 : f * 9}deg) scale(${ok ? 0.8 + 0.2 * pr(f, T.success, 10) : 1})` }}>{ok ? "✓" : "◌"}</div>
        <div style={{ marginTop: 20, fontSize: 26, fontWeight: 800, color: INK }}>{ok ? "Payment Successful" : "Validating Payment"}</div>
        <div style={{ marginTop: 8, fontSize: 16, color: GRAY }}>{ok ? "Thank you for your payment!" : "Please wait while we process your Stripe transaction..."}</div>
        {ok && <div style={{ marginTop: 14, fontSize: 14, color: "#9CA3AF" }}>Redirecting to payment page in 3 seconds...</div>}
      </div>
    </div>
  );
};

// ───────── demo assembly ─────────
const URLS: Record<Scene, string> = {
  payA: "learner.skillbnk.com/payment/6731c0e2a9", payB: "learner.skillbnk.com/payment/6731c0e2a9", payInc: "learner.skillbnk.com/payment/6731c0e2a9", payC: "learner.skillbnk.com/payment/6731c0e2a9",
  hist: "learner.skillbnk.com/payment-history", stripe1: "checkout.stripe.com/c/pay/cs_live_a1B…", stripe2: "checkout.stripe.com/c/pay/cs_live_a1B…", valid: "learner.skillbnk.com/payment/validate-stripe",
};
const ENTER: Record<Scene, () => number> = { payA: () => DEMO_START, hist: () => T.submitted, payB: () => T.back, stripe1: () => T.opens, payInc: () => T.closes, stripe2: () => T.finish, valid: () => T.validate, payC: () => T.fully - 6 };

const calm = (k: K4): K4 => [k[0], Math.max(900, Math.min(1020, k[1])), Math.max(440, Math.min(640, k[2])), Math.min(1.3, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0], [T.prog, 960, 440, 1.28], [T.price, 960, 520, 1.25], [T.methods, 960, 460, 1.25], [T.pickBank + 10, 960, 560, 1.22],
  [T.amount, 960, 560, 1.25], [T.attach, 960, 580, 1.25], [T.pay1 + 10, 960, 540, 1.15], [T.submitted + 10, 960, 520, 1.08], [T.back, 960, 520, 1.15],
  [T.partial, 960, 440, 1.28], [T.pickStripe - 10, 960, 500, 1.22], [T.opens + 6, 960, 540, 1.0], [T.closes + 6, 960, 470, 1.25], [T.finish + 6, 1020, 520, 1.1],
  [T.validate, 960, 540, 1.1], [T.fully, 960, 440, 1.28], [T.switchP + 10, 960, 440, 1.3], [PAY_START, 960, 540, 1.0],
]).map(calm);
const P = (x: number, y: number, f: number, sc: Scene) => CT(x, y - scrollAt(f, sc));
const tileC = (i: number, inc = 0) => X0 + 24 + i * (TILE_W + 16) + TILE_W / 2;
const CUR: P3[] = monoP([
  [DEMO_START, 1560, 880],
  [T.prog, ...CT(X0 + 400, Y.prog + 60)], [T.badges, ...CT(X0 + 200, Y.prog + 118)],
  [T.orig, ...P(X0 + 700, Y.price + 60, T.orig + 30, "payA")], [T.due, ...P(X0 + 700, Y.price + 250, T.due + 10, "payA")],
  [T.mStripe, ...P(tileC(0), Y.method + 114, T.methods + 30, "payA")], [T.pickBank, ...P(tileC(2), Y.method + 114, T.pickBank, "payA")],
  [T.amount, ...P(X0 + 300, Y.method + 540, T.amount + 30, "payA")], [T.note, ...P(X0 + 300, Y.method + 650, T.note + 30, "payA")],
  [T.attach, ...P(X0 + 432, Y.method + 783, T.attach + 30, "payA")], [T.pay1, ...P(X0 + 432, Y.method + 892, T.pay1, "payA")],
  [T.submitted + 20, ...MA(700, 300)], [T.back + 10, 1500, 860],
  [T.pickStripe, ...P(tileC(0), Y.method + 114, T.pickStripe + 30, "payB")], [T.pay2, ...P(X0 + 432, Y.method + 362, T.pay2 + 30, "payB")],
  [T.opens + 20, 1500, 860],
  [T.payNowInc - 14, ...CT(X0 + PWD - 220, Y.inc + 54 - 520)], [T.payNowInc, ...CT(X0 + PWD - 220, Y.inc + 54 - 520)],
  [T.finish + 6, ...CT(1100, 290)], [STRIPE_PAY - 10, ...CT(1110, 560)], [STRIPE_PAY, ...CT(1110, 560)],
  [T.validate + 20, 1500, 860],
  [T.switchP - 14, ...CT(X0 + 144 + 330, Y.prog + 118)], [T.switchP, ...CT(X0 + 144 + 330, Y.prog + 118)],
  [T.switchP + 30, 1560, 880],
]);
void tileC;
const STEPS = [
  { at: T.page, to: T.price, label: "Program and session" },
  { at: T.price, to: T.methods, label: "Price breakdown" },
  { at: T.methods, to: T.submitted, label: "Pay a deposit by bank transfer" },
  { at: T.submitted, to: T.back, label: "Pending, then approved" },
  { at: T.back, to: T.validate, label: "Pay the rest with Stripe" },
  { at: T.validate, to: PAY_START, label: "Fully paid, start learning" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const sc = sceneAt(f);
  const learnerPortal = sc === "hist";
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        <LandWin f={f} inAt={ENTER[sc]()} url={URLS[sc]} sidebar={learnerPortal} learner={learnerPortal} active="" who="JR" prog="Phlebotomy Technician Program"
          main={sc === "hist" ? <History f={f} /> : sc === "stripe1" || sc === "stripe2" ? <StripeTab f={f} second={sc === "stripe2"} /> : sc === "valid" ? <Validate f={f} /> : <PayPage f={f} sc={sc} />}
          overlay={<><Toast f={f} at={T.pay1 + 4} text="Payment submitted successfully!" d={50} /><Toast f={f} at={T.pay2 + 4} text="Redirecting to payment gateway..." d={40} /><Toast f={f} at={T.switchP + 6} text="Switched program successfully!" d={50} /></>} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.submitted - 4} text="Learner payment page" />
      <PortalTagL f={f} at={T.submitted + 4} out={T.back - 4} text="Learner portal" />
      <PortalTagL f={f} at={T.back + 4} out={T.opens - 4} text="Learner payment page" />
      <PortalTagL f={f} at={T.opens + 4} out={T.closes - 4} text="Stripe checkout · new tab" />
      <PortalTagL f={f} at={T.closes + 4} out={T.finish - 4} text="Learner payment page" />
      <PortalTagL f={f} at={T.finish + 4} out={T.validate - 4} text="Stripe checkout · new tab" />
      <PortalTagL f={f} at={T.validate + 4} out={PAY_START - 6} text="Learner payment page" />
    </AbsoluteFill>
  );
};

// ───────── hook: payment links that go nowhere ─────────
const HK = { fills: cue("h0", "fills"), link: cue("h0", "link"), never: cue("h0", "never"), wrong: cue("h0", "wrong"), friday: cue("h0", "friday"), seven: cue("h0", "seven") };
type Fate = "paid" | "lost" | "wrong";
const FATES: Fate[] = ["paid", "lost", "paid", "wrong", "lost", "paid", "lost", "paid", "wrong", "lost", "paid", "lost"];
const SEAT = (i: number): [number, number] => [290 + (i % 6) * 215, 360 + Math.floor(i / 6) * 230];
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.friday - 10, HK.seven + 30);
  const fridays = f >= HK.friday ? Math.min(3, 1 + Math.floor((f - HK.friday) / 14)) : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <Stage f={f} dur={DURATIONS.h0}>
        <div style={{ position: "absolute", left: 120, top: 70, opacity: pr(f, 4, 10) }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6, color: "#F87171" }}>NORTHSIDE PHLEBOTOMY ACADEMY</div>
          <div style={{ marginTop: 6, fontSize: 56, fontWeight: 900, color: "#F8FAFC" }}>{typed(f, HK.fills, "12 enrolled. 12 payment links.", 0.7)}</div>
        </div>
        {/* outbox */}
        <div style={{ position: "absolute", left: 100, top: 470, width: 120, height: 120, borderRadius: 20, background: "#1E293B", border: "4px solid #475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, opacity: pr(f, HK.link - 10, 10) }}>📤</div>
        {FATES.map((fate, i) => {
          const [sx, sy] = SEAT(i);
          const send = HK.link + i * 4;
          const k = pr(f, send, 18);
          const ex = 220 + (sx + 70 - 220) * k, ey = 530 + (sy + 40 - 560) * k - Math.sin(k * Math.PI) * 120;
          const resolved = (fate === "paid" && f >= HK.link + 50) || (fate === "lost" && f >= HK.never) || (fate === "wrong" && f >= HK.wrong);
          const col = !resolved ? "#64748B" : fate === "paid" ? "#22C55E" : fate === "lost" ? "#475569" : "#F59E0B";
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: sx, top: sy, width: 190, height: 150, boxSizing: "border-box", borderRadius: 16, background: "#0F172A", border: `4px solid ${col}`, opacity: pr(f, HK.fills + i * 2, 10), padding: 14 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#CBD5E1" }}>Learner {String(i + 1).padStart(2, "0")}</div>
                <div style={{ marginTop: 14, fontSize: 26, fontWeight: 900, color: col }}>{!resolved ? "…" : fate === "paid" ? "✓ $850" : fate === "lost" ? "unopened" : i === 3 ? "$85 ?" : "$800 ?"}</div>
                {fate === "lost" && resolved && <div style={{ position: "absolute", right: 12, top: 10, fontSize: 22, opacity: 0.6 }}>✉</div>}
              </div>
              {f >= send - 2 && k < 1 && <div style={{ position: "absolute", left: ex - 24, top: ey - 16, width: 48, height: 32, borderRadius: 5, background: "#F8FAFC", border: "3px solid #94A3B8", fontSize: 18, textAlign: "center", lineHeight: "26px" }}>$</div>}
            </React.Fragment>
          );
        })}
        {/* Friday calendar pages */}
        {fridays > 0 && (
          <div style={{ position: "absolute", left: 1660, top: 360, width: 180, opacity: pr(f, HK.friday, 8) }}>
            {Array.from({ length: fridays }).map((_, i) => <div key={i} style={{ position: "absolute", left: i * 8, top: i * 12, width: 170, height: 190, borderRadius: 16, background: "#F8FAFC", border: "4px solid #EF4444", textAlign: "center", boxShadow: "0 10px 30px #0008" }}><div style={{ height: 44, background: "#EF4444", color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: "44px", borderRadius: "10px 10px 0 0" }}>FRIDAY</div><div style={{ fontSize: 26, fontWeight: 900, color: INK, marginTop: 30 }}>Reminder<br />×{i + 1}</div></div>)}
          </div>
        )}
      </Stage>
      <Stamp f={f} at={HK.seven + 4} x={960} y={880} text="STILL UNPAID: 7" size={56} />
      <BeatCaption f={f} end={DURATIONS.h0} beats={[[HK.link, "A separate payment link for every learner.", "payment link"], [HK.never, "Some never open it.", "never open"], [HK.wrong, "Some pay the wrong amount.", "wrong amount"], [HK.friday, "Every Friday, the same chase.", "chase"]]} />
    </AbsoluteFill>
  );
};

// ───────── payoff ─────────
const PY = { enroll: cue("p12", "enroll"), pay: cue("p12", "pay"), learning: cue("p12", "learning"), chasing: cue("p12", "chasing") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(34,197,94,0.2), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 0, top: 330, width: 1920, display: "flex", justifyContent: "center", gap: 40 }}>
      {[["Enroll", "🧾", PY.enroll], ["Pay", "💳", PY.pay], ["Start learning", "🎓", PY.learning]].map(([t, ic, a], i) => (
        <div key={t as string} style={{ width: 380, height: 260, borderRadius: 28, background: "#F8FAFC", border: `6px solid ${f >= (a as number) ? "#22C55E" : "#334155"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: pr(f, PAY_START + 4 + i * 5, 10), transform: `scale(${0.9 + 0.1 * pr(f, a as number, 10)})` }}>
          <div style={{ fontSize: 76 }}>{ic as string}</div><div style={{ fontSize: 40, fontWeight: 900, color: INK }}>{t as string}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, top: 690, width: 1920, textAlign: "center", fontSize: 50, fontWeight: 900, color: "#BBF7D0", opacity: pr(f, PY.chasing - 6, 12) }}>One page. No payment chasing.</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2);
  FATES.forEach((_, i) => add(HK.link + i * 4, "swish", 0.18));
  add(HK.never, "thud", 0.3); add(HK.wrong, "riser", 0.25); add(HK.seven + 4, "thud", 0.45);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 6; i++) add(T.finish + 8 + i * 5, ["key0", "key1", "key2"][i % 3], 0.15);
  add(T.pay1 + 4, "chime", 0.4); add(T.approve + 4, "ding", 0.4); add(T.success, "chime", 0.5); add(T.switchP + 6, "pop", 0.35);
  [T.submitted, T.back, T.opens, T.closes, T.finish, T.validate].forEach((t) => add(t, "whoosh_s", 0.3));
  add(PAY_START - 3, "whoosh", 0.4); add(PY.learning, "chime", 0.5);
  return a;
})();

export const LearnerCheckoutStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="checkoutstory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.submitted, T.back, T.opens, T.closes, T.finish, T.validate]} />;
};
