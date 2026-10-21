
// ═══════════════════════════════════════════════════════════════════════════
// Promo Codes — scenes (sheet serial 25). Real UI (SB-Company Promotions/PromoList, PromoForm, PromoUsageReport;
// SB-Frontend enroll/[slug] EnrollComp + i18n en.ts):
//  "Promo Codes" · "Manage your promotional codes and coupons" · Create Promo · card: title, Active/Inactive, code
//  (click → "Promo code copied to clipboard"), description, "Expires: MMM dd, yyyy", "20% off", Total Uses, Uses Left,
//  Total Discount Given · Edit · Report · delete.
//  PromoForm: Back to Promos · Basic Information (Title *, Code * "SUMMER50", Description) · Discount Type
//  (Percentage / Fixed Amount) · Discount Value · Max Discount (Optional) · Settings (Expiration Date *, Status,
//  Total Usage Limit (0 for unlimited), Usage Limit Per User (0 for unlimited)) · Items Selection (Items Type
//  dynamic/selected, Applicable Types * Courses/Programs, Categories (Optional), Select Items) · Private Promo
//  (Optional): Target Emails (Comma separated) "If specified, only these users can use this promo code." ·
//  Save Promo · toast "Promo created successfully!".  Code must be 4–15 characters.
//  Enroll page: Order Summary · Promo Code · "Enter code" · Apply · Original Price · Promo Code Discount · Total ·
//  toast 'Promo code "{title}" applied successfully!' · ?promo=CODE in the URL applies it automatically.
//  PromoUsageReport: Total Uses · Total Discount ("Total savings provided") · Uses Left · Top Programs Using This
//  Promo · Recent Usage Details ("Latest 100 uses of this promo code"): User / Program / Discount / Date / Status.
// ═══════════════════════════════════════════════════════════════════════════
const PR_URL = "company.skillbnk.com/promotion-components/promo-codes";
type PromoT = { t: string; code: string; d: string; exp: string; off: string; uses: number; left: string; given: string; active: boolean; o?: number };
const PROMOS: PromoT[] = [
  { t: "Open House", code: "OPEN15", d: "15% for open-house visitors", exp: "Oct 31, 2026", off: "15% off", uses: 18, left: "Unlimited", given: "$4,860", active: true },
  { t: "Referral Thank-You", code: "FRIEND100", d: "Referred by a current student", exp: "Dec 31, 2026", off: "$100 off", uses: 9, left: "41", given: "$900", active: true },
  { t: "Summer Early Bird", code: "SUMMER50", d: "Summer cohort early bird", exp: "Jun 30, 2026", off: "$50 off", uses: 64, left: "0", given: "$3,200", active: false },
];
const NEW_PROMO: PromoT = { t: "Fall Kickoff", code: "FALL20", d: "Fall cohort launch week", exp: "Oct 31, 2026", off: "20% off", uses: 0, left: "50", given: "$0", active: true };
const PR_CREATE = { x: 1350 - 24 - 160, y: 22, w: 160, h: 40 };
const prCard = (i: number) => ({ x: 24 + (i % 3) * 438, y: 96 + Math.floor(i / 3) * 330, w: 422, h: 312 });
const PromoCard: React.FC<{ p: PromoT; i: number; copyHl?: boolean; repHl?: boolean }> = ({ p, i, copyHl, repHl }) => {
  const c = prCard(i);
  return (
    <div style={{ position: "absolute", left: c.x, top: c.y, width: c.w, height: c.h, borderRadius: 14, background: "#fff", border: `1px solid ${LINE}`, padding: 20, boxSizing: "border-box", opacity: p.o ?? 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 18, color: INK }}>{p.t}</b><Pill t={p.active ? "Active" : "Inactive"} tone={p.active ? "green" : "gray"} /></div>
      <div style={{ marginTop: 10, display: "inline-block", padding: "5px 12px", borderRadius: 8, background: "#F3F4F6", border: `1px dashed ${copyHl ? BLUE : "#9CA3AF"}`, boxShadow: copyHl ? "0 0 0 3px #C7D2FE" : "none", fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: INK }}>{p.code} ⧉</div>
      <div style={{ marginTop: 10, fontSize: 13.5, color: GRAY }}>{p.d}</div>
      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span style={{ color: GRAY }}>Expires: {p.exp}</span><span style={{ fontWeight: 800, color: BLUE }}>🏷 {p.off}</span></div>
      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: BLUE_SOFT, fontSize: 12.5 }}>
        {[["Total Uses:", String(p.uses)], ["Uses Left:", p.left], ["Total Discount Given:", p.given]].map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}><span style={{ color: GRAY }}>{a}</span><b style={{ color: a.startsWith("Total Discount") ? "#16A34A" : b === "0" ? "#DC2626" : INK }}>{b}</b></div>)}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 16, display: "flex", gap: 8 }}>
        <div style={{ flex: 1, height: 34, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>✎ Edit</div>
        <div style={{ flex: 1, height: 34, borderRadius: 8, border: `1px solid ${repHl ? BLUE : LINE}`, boxShadow: repHl ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>📊 Report</div>
        <div style={{ width: 40, height: 34, borderRadius: 8, background: "#DC2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</div>
      </div>
    </div>
  );
};
const prCodePt = (i: number) => ({ x: MX(prCard(i).x + 20 + 56), y: MY(prCard(i).y + 20 + 26 + 18) });
const prRepPt = (i: number) => { const c = prCard(i); const bw = (c.w - 40 - 16 - 40) / 2; return { x: MX(c.x + 20 + bw + 8 + bw / 2), y: MY(c.y + c.h - 16 - 17) }; };
const PromoList: React.FC<{ list: PromoT[]; press?: boolean; copyHl?: number; repHl?: number }> = ({ list, press, copyHl, repHl }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <PageTitle t="Promo Codes" sub="Manage your promotional codes and coupons" x={24} y={14} />
    <UB {...PR_CREATE} label="Create Promo" icon="＋" press={press} />
    {list.map((p, i) => <PromoCard key={p.code} p={p} i={i} copyHl={copyHl === i} repHl={repHl === i} />)}
  </div>
);
// ── form (main coords, scroll moves everything up) ──
const PF = { x: 24, w: 1302 };
const pfY = (y: number, s: number) => y - s;
const PromoForm: React.FC<{ g: number; s: number; v: Record<string, string>; gl?: string; pct?: boolean; itemsSel?: boolean; prog?: boolean; status?: number; save?: boolean; picked?: boolean }> = ({ g, s, v, gl, pct = true, itemsSel, prog, status = 1, save, picked }) => {
  const Card: React.FC<{ y: number; h: number; t: string; children: React.ReactNode }> = ({ y, h, t, children }) => <div style={{ position: "absolute", left: PF.x, top: pfY(y, s), width: PF.w, height: h, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}><div style={{ position: "absolute", left: 20, top: 16, fontSize: 17, fontWeight: 800, color: INK }}>{t}</div>{children}</div>;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 24, top: pfY(18, s), fontSize: 15, fontWeight: 700, color: BLUE }}>← Back to Promos</div>
      <Card y={56} h={300} t="Basic Information">
        <MInput x={20} y={52} w={620} label="Title *" value={v.title ?? ""} ph="Summer Sale" glow={gl === "title"} />
        <MInput x={660} y={52} w={620} label="Code *" value={v.code ?? ""} ph="SUMMER50" glow={gl === "code"} />
        <MInput x={20} y={136} w={1260} label="Description" value={v.desc ?? ""} ph="Internal description" glow={gl === "desc"} />
        <div style={{ position: "absolute", left: 20, top: 222, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Discount Type</div>
        <div style={{ position: "absolute", left: 20, top: 252, display: "flex", gap: 22, fontSize: 14.5, fontWeight: 600 }}>{[["Percentage", pct], ["Fixed Amount", !pct]].map(([n, on]) => <span key={n as string} style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 18, height: 18, borderRadius: "50%", border: on ? `6px solid ${BLUE}` : "2px solid #9CA3AF", boxSizing: "border-box" }} />{n}</span>)}</div>
        <MInput x={420} y={214} w={420} label="Discount Value" value={v.val ?? ""} glow={gl === "val"} />
        <MInput x={860} y={214} w={420} label="Max Discount (Optional)" value={v.max ?? ""} glow={gl === "max"} />
      </Card>
      <Card y={372} h={200} t="Settings">
        <MInput x={20} y={52} w={300} label="Expiration Date *" value={v.exp ?? ""} ph="Pick a date" glow={gl === "exp"} />
        <div style={{ position: "absolute", left: 340, top: 52, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Status</div>
        <div style={{ position: "absolute", left: 340, top: 86, display: "flex", gap: 10, alignItems: "center", fontSize: 14, fontWeight: 700 }}><Toggle on={status} />{status > 0.5 ? "Active" : "Inactive"}</div>
        <MInput x={500} y={52} w={380} label="Total Usage Limit (0 for unlimited)" value={v.lim ?? "0"} glow={gl === "lim"} />
        <MInput x={900} y={52} w={380} label="Usage Limit Per User (0 for unlimited)" value={v.per ?? "0"} glow={gl === "per"} />
      </Card>
      <Card y={588} h={250} t="Items Selection">
        <div style={{ position: "absolute", left: 20, top: 54, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Items Type</div>
        <div style={{ position: "absolute", left: 20, top: 82, display: "flex", gap: 22, fontSize: 14.5, fontWeight: 600 }}>{[["Dynamic", !itemsSel], ["Selected", !!itemsSel]].map(([n, on]) => <span key={n as string} style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 18, height: 18, borderRadius: "50%", border: on ? `6px solid ${BLUE}` : "2px solid #9CA3AF", boxSizing: "border-box" }} />{n}</span>)}</div>
        <div style={{ position: "absolute", left: 340, top: 54, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Applicable Types *</div>
        <div style={{ position: "absolute", left: 340, top: 82, display: "flex", gap: 22, fontSize: 14.5, fontWeight: 600 }}><span style={{ display: "flex", gap: 8 }}><Chk on={false} />Courses</span><span style={{ display: "flex", gap: 8 }}><Chk on={!!prog} />Programs</span></div>
        <MInput x={660} y={54} w={620} label="Categories (Optional)" value="" ph="Search category..." />
        <UB x={20} y={140} w={160} h={38} v="outline" label="Select Items" fs={13.5} press={gl === "items"} />
        {picked && <div style={{ position: "absolute", left: 200, top: 146, display: "flex", gap: 8 }}><Pill t="Medical Assistant — Fall 2026" tone="blue" /><Pill t="Pharmacy Technician" tone="blue" /></div>}
      </Card>
      <Card y={854} h={170} t="Private Promo (Optional)">
        <MInput x={20} y={52} w={1260} label="Target Emails (Comma separated)" value={v.emails ?? ""} ph="email1@example.com, email2@example.com" />
        <div style={{ position: "absolute", left: 20, top: 140, fontSize: 12.5, color: GRAY }}>If specified, only these users can use this promo code.</div>
      </Card>
      <UB x={1350 - 24 - 140} y={pfY(1040, s)} w={140} h={42} label="Save Promo" press={save} />
      <UB x={1350 - 24 - 140 - 10 - 100} y={pfY(1040, s)} w={100} h={42} v="outline" label="Cancel" />
    </div>
  );
};
const pfPt = (x: number, y: number, w: number, s: number) => ({ x: MX(PF.x + x + w / 2), y: MY(pfY(y, s) + 47) });

// ═══ o0 — HOOK: the receipt that keeps printing ═════════════════════════════
const SceneHookPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 170, B3 = 300;
  const lines: [string, string][] = [["Manual refund — Maya T.", "-$240"], ["Manual refund — Jordan L.", "-$240"], ["Code shared on Facebook", "-$480"], ["Expired code still honoured", "-$240"], ["Discount given twice", "-$480"], ["Refund fee", "-$35"]];
  const n = Math.min(lines.length, Math.floor(interpolate(g, [14, 120], [0, lines.length + 0.99], cl)));
  const lost = lines.slice(0, n).reduce((a, l) => a + parseInt(l[1].replace(/[^0-9]/g, "")), 0);
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <div style={{ position: "absolute", left: 140, top: 200, width: 760 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#94A3B8", opacity: fi(g, 2, 8) }}>"Just give them 20% off."</div>
            <div style={{ marginTop: 14, fontSize: 70, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, 10, 10) }}>Then refund it<br /><span style={{ color: "#F87171" }}>by hand.</span></div>
            <div style={{ marginTop: 50, fontSize: 26, fontWeight: 700, color: "#FCA5A5", opacity: fi(g, 40, 8) }}>Lost to discount mistakes this month</div>
            <div style={{ fontSize: 120, fontWeight: 900, color: "#EF4444", lineHeight: 1, opacity: fi(g, 40, 8) }}>${lost.toLocaleString()}</div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 60, width: 620, height: Math.min(940, 200 + n * 110), background: "#FEFCF7", boxShadow: "0 40px 100px #000C", padding: "30px 34px", boxSizing: "border-box", fontFamily: "monospace", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),95% 100%,90% calc(100% - 14px),85% 100%,80% calc(100% - 14px),75% 100%,70% calc(100% - 14px),65% 100%,60% calc(100% - 14px),55% 100%,50% calc(100% - 14px),45% 100%,40% calc(100% - 14px),35% 100%,30% calc(100% - 14px),25% 100%,20% calc(100% - 14px),15% 100%,10% calc(100% - 14px),5% 100%,0 calc(100% - 14px))" }}>
            <div style={{ textAlign: "center", fontSize: 22, fontWeight: 900, color: INK }}>DISCOUNTS — OCTOBER</div>
            <div style={{ textAlign: "center", fontSize: 15, color: GRAY }}>kept in: discounts_FINAL_v3.xlsx</div>
            {lines.slice(0, n).map(([a, b]) => <div key={a} style={{ marginTop: 22, display: "flex", justifyContent: "space-between", fontSize: 22, color: INK }}><span>{a}</span><b style={{ color: "#DC2626" }}>{b}</b></div>)}
          </div>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <HookLine g={g} at={B2} top={190} size={48} color="#CBD5E1">Most LMS platforms have <span style={{ color: "#FCA5A5" }}>no real promo codes</span>.</HookLine>
          {[["∞", "No usage limits"], ["📅", "No expiry"], ["🎯", "No control over which programs"], ["🧾", "No report"]].map(([ic, t], i) => <div key={t} style={{ position: "absolute", left: 230 + i * 380, top: 420, width: 320, height: 240, borderRadius: 20, background: "#141A2B", border: "1px solid #7F1D1D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: fi(g, B2 + 12 + i * 10, 8), transform: `rotate(${(i - 1.5) * 2}deg)` }}><span style={{ fontSize: 58 }}>{ic}</span><span style={{ fontSize: 24, fontWeight: 800, color: "#FCA5A5", textAlign: "center", padding: "0 16px" }}>{t}</span></div>)}
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={200} />
          <div style={{ position: "absolute", left: 110, top: 280, width: 780, fontSize: 66, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>One code.<br /><span style={{ color: "#5EEAD4" }}>Limits, expiry, report.</span><br />Applied at checkout.</div>
          <div style={{ position: "absolute", left: 1040, top: 220, width: 720, borderRadius: 22, background: "#fff", boxShadow: "0 40px 100px #000C", padding: 34, boxSizing: "border-box", opacity: sp(g, B3 + 6, fps) }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Order Summary</div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}><div style={{ flex: 1, height: 52, borderRadius: 10, border: "2px solid #86EFAC", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: "monospace", fontSize: 22, fontWeight: 800 }}>FALL20 ✓</div></div>
            {[["Original Price", "$2,400"], ["Promo Code Discount", "-$480"]].map(([a, b], i) => <div key={a} style={{ marginTop: 18, display: "flex", justifyContent: "space-between", fontSize: 22, color: i ? "#16A34A" : GRAY, fontWeight: i ? 800 : 500, opacity: fi(g, B3 + 24 + i * 10, 8) }}>{a}<span>{b}</span></div>)}
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 900, color: INK, opacity: fi(g, B3 + 44, 8) }}>Total<span>$1,920</span></div>
          </div>
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ o1 — Promo Codes list ═══════════════════════════════════════════════════
const SceneListPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = menuPt("Marketing");
  const CP = { x: MX(ctr(PR_CREATE).x), y: MY(ctr(PR_CREATE).y) };
  const stat = (i: number) => ({ x: MX(prCard(i).x + 211), y: MY(prCard(i).y + 200) });
  const cur = path(g, [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [100, prCodePt(0).x, prCodePt(0).y], [140, stat(0).x, stat(0).y], [180, stat(1).x, stat(1).y], [220, stat(2).x, stat(2).y], [280, CP.x, CP.y], [296, CP.x, CP.y], [D, CP.x, CP.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 280, 360, 1.9], [66, 280, 360, 1.9], [96, MX(240), 300, 1.6], [150, MX(450), 340, 1.5], [230, MX(1100), 340, 1.5], [266, CP.x - 140, 160, 1.8], [D, CP.x - 140, 160, 1.8]];
  return (
    <FStage g={g} keys={keys} url={opened ? PR_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 66), rip(g, 292))} active={opened ? "Marketing" : "Dashboard"} chip={[1, !opened ? "Company portal → Marketing → Promo Codes" : g < 260 ? "Every code: uses, uses left, discount given" : "Create Promo"]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : <PromoList list={PROMOS} press={g >= 288 && g < 298} />}
    </FStage>
  );
};

// ═══ o2 — Basic Information + discount ═══════════════════════════════════════
const SceneBasicPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const v = { title: typed(g, 30, "Fall Kickoff", 0.4), code: typed(g, 84, "FALL20", 0.3), desc: typed(g, 120, "Fall cohort launch week", 0.8), val: g >= 236 ? "20" : "", max: g >= 286 ? "500" : "" };
  const T = pfPt(20, 56 + 52, 620, 0), C = pfPt(660, 56 + 52, 620, 0), DS = pfPt(20, 56 + 136, 1260, 0), PCT = { x: MX(PF.x + 20 + 50), y: MY(56 + 252 + 9) }, VAL = pfPt(420, 56 + 214, 420, 0), MAX = pfPt(860, 56 + 214, 420, 0);
  const cur = path(g, [[0, 900, 500], [24, T.x, T.y], [76, T.x, T.y], [84, C.x, C.y], [114, C.x, C.y], [120, DS.x, DS.y], [170, DS.x, DS.y], [200, PCT.x, PCT.y], [216, PCT.x, PCT.y], [230, VAL.x, VAL.y], [262, VAL.x, VAL.y], [280, MAX.x, MAX.y], [D, MAX.x, MAX.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, MX(420), 200, 1.7], [80, MX(900), 200, 1.7], [118, MX(650), 260, 1.5], [190, MX(450), 340, 1.6], [270, MX(850), 340, 1.6], [D, MX(850), 340, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${PR_URL}/create`} cur={cur} ripple={Math.max(rip(g, 210), rip(g, 232), rip(g, 282))} active="Marketing" chip={[2, g < 84 ? "Title" : g < 120 ? "Code — what students type (4–15 characters)" : g < 196 ? "Description" : "Percentage · Discount Value · Max Discount"]}>
      <PromoForm g={g} s={0} v={v} gl={g >= 24 && g < 80 ? "title" : g >= 84 && g < 116 ? "code" : g >= 120 && g < 174 ? "desc" : g >= 230 && g < 266 ? "val" : g >= 280 ? "max" : undefined} />
    </FStage>
  );
};

// ═══ o3 — Settings + Items + Save ═════════════════════════════════════════════
const SceneRulesPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 450;
  const g = gt(f, dur, D);
  const s = interpolate(g, [0, 24, 180, 210, 330, 350], [0, 300, 300, 520, 520, 520], { ...cl, easing: EZ });
  const v = { title: "Fall Kickoff", code: "FALL20", desc: "Fall cohort launch week", val: "20", max: "500", exp: g >= 50 ? "Oct 31, 2026" : "", lim: g >= 100 ? "50" : "0", per: g >= 140 ? "1" : "0" };
  const EX = pfPt(20, 372 + 52, 300, 300), LI = pfPt(500, 372 + 52, 380, 300), PE = pfPt(900, 372 + 52, 380, 300);
  const SEL = { x: MX(PF.x + 20 + 110), y: MY(pfY(588 + 82 + 9, 520)) };
  const PRG = { x: MX(PF.x + 340 + 140), y: MY(pfY(588 + 82 + 10, 520)) };
  const ITM = { x: MX(PF.x + 20 + 80), y: MY(pfY(588 + 140 + 19, 520)) };
  const SAVE = { x: MX(1350 - 24 - 70), y: MY(pfY(1040, 520) + 21) };
  const cur = path(g, [[0, 900, 400], [30, EX.x, EX.y], [60, EX.x, EX.y], [86, LI.x, LI.y], [120, LI.x, LI.y], [132, PE.x, PE.y], [170, PE.x, PE.y], [222, SEL.x, SEL.y], [236, SEL.x, SEL.y], [256, PRG.x, PRG.y], [270, PRG.x, PRG.y], [296, ITM.x, ITM.y], [312, ITM.x, ITM.y], [404, SAVE.x, SAVE.y], [420, SAVE.x, SAVE.y], [D, SAVE.x, SAVE.y]]);
  const keys: CamKey[] = [[0, MX(850), 340, 1.6], [26, MX(420), 200, 1.55], [80, MX(900), 200, 1.55], [180, MX(900), 220, 1.5], [214, MX(400), 220, 1.55], [330, MX(400), 260, 1.55], [390, SAVE.x - 220, SAVE.y - 100, 1.7], [D, SAVE.x - 220, SAVE.y - 100, 1.7]];
  const picked = g >= 340;
  const listO = g >= 312 && g < 340 ? 1 : 0;
  return (
    <FStage g={g} keys={keys} url={`${PR_URL}/create`} cur={cur} ripple={Math.max(rip(g, 232), rip(g, 266), rip(g, 308), rip(g, 416))} active="Marketing" chip={[3, g < 80 ? "Expiration Date" : g < 180 ? "Usage limits: 50 total, 1 per student" : g < 296 ? "Selected · Programs" : g < 390 ? "Select Items — only these programs" : "Save Promo"]}
      over={<>
        {listO > 0 && <div style={{ position: "absolute", left: MX(PF.x + 20), top: MY(pfY(588 + 184, 520)), width: 420, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, boxShadow: "0 16px 40px #0003", zIndex: 30, padding: 10 }}>{["Medical Assistant — Fall 2026", "Pharmacy Technician", "Phlebotomy Basics"].map((n, i) => <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 6px", fontSize: 14, fontWeight: 600 }}><Chk on={i < 2 && g >= 318 + i * 8} />{n}</div>)}</div>}
        {g >= 428 && <Toast g={g} at={428} text="Promo created successfully!" x={1120} y={60} />}
      </>}>
      <PromoForm g={g} s={s} v={v} gl={g >= 30 && g < 64 ? "exp" : g >= 86 && g < 124 ? "lim" : g >= 132 && g < 174 ? "per" : g >= 300 && g < 314 ? "items" : undefined} itemsSel={g >= 232} prog={g >= 266} picked={picked} save={g >= 414 && g < 424} />
    </FStage>
  );
};

// ═══ o4 — new card → copy code ══════════════════════════════════════════════
const SceneCopyPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 270;
  const g = gt(f, dur, D);
  const list = [{ ...NEW_PROMO, o: fi(g, 6, 10) }, ...PROMOS];
  const CP = prCodePt(0);
  const cur = path(g, [[0, 900, 500], [40, MX(prCard(0).x + 211), MY(prCard(0).y + 200)], [120, MX(prCard(0).x + 211), MY(prCard(0).y + 220)], [170, CP.x, CP.y], [186, CP.x, CP.y], [D, CP.x + 40, CP.y + 30]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, MX(240), 300, 1.7], [D, MX(240), 300, 1.7]];
  return (
    <FStage g={g} keys={keys} url={PR_URL} cur={cur} ripple={rip(g, 182)} active="Marketing" chip={[4, g < 160 ? "FALL20 · 20% off · 50 uses left" : "Click the code to copy it"]}
      over={g >= 188 ? <Toast g={g} at={188} text="Promo code copied to clipboard" x={460} y={66} /> : undefined}>
      <PromoList list={list} copyHl={g >= 176 && g < 196 ? 0 : -1} />
    </FStage>
  );
};

// ═══ o5 — checkout: Enter code → Apply → discount; ?promo= link ══════════════
const SceneCheckoutPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const applied = g >= 150;
  const link = g >= 280;
  const IN = { x: 300, y: 512 }, AP = { x: 494, y: 512 };
  const cur = path(g, [[0, 1100, 700], [40, IN.x, IN.y], [56, IN.x, IN.y], [120, AP.x, AP.y], [140, AP.x, AP.y], [200, 300, 600], [260, 300, 640], [290, 800, 22], [380, 800, 22], [D, 800, 60]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 330, 520, 1.7], [270, 330, 560, 1.7], [290, 700, 200, 1.6], [D, 700, 200, 1.6]];
  const url = link ? "learnbrightpath.com/enroll/medical-assistant-fall-2026?promo=FALL20" : "learnbrightpath.com/enroll/medical-assistant-fall-2026";
  return (
    <FStage g={g} keys={keys} url={url} cur={cur} ripple={Math.max(rip(g, 52), rip(g, 136))} tag={{ n: 2, label: "Your enroll page", url: DOMAIN }} chip={[5, !applied ? "Order Summary · Enter code · Apply" : !link ? "Discount applied — total updates" : "Or share a link with ?promo= — applied automatically"]}
      over={<>{g >= 152 && g < 270 && <Toast g={g} at={152} text={'Promo code "Fall Kickoff" applied successfully!'} x={1000} y={60} />}</>}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 64, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 30, boxSizing: "border-box" }}><BrightLogo /><div style={{ flex: 1 }} />{["Programs", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>{t}</span>)}</div>
      <div style={{ position: "absolute", left: 60, top: 96, width: 500, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        <div style={{ height: 200, background: `linear-gradient(135deg,${BP},#134E4A)`, padding: 24, boxSizing: "border-box" }}><span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "#ffffff30", color: "#fff" }}>PROGRAM</span><div style={{ marginTop: 16, fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>Medical Assistant — Fall 2026</div></div>
        <div style={{ margin: "20px 24px", padding: "18px 20px", borderRadius: 12, background: "#F9FAFB", border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Order Summary</div>
          <div style={{ marginTop: 14, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>Promo Code</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, height: 42, borderRadius: 8, border: `1px solid ${applied ? "#86EFAC" : g >= 50 && g < 140 ? "#A5B4FC" : "#D1D5DB"}`, display: "flex", alignItems: "center", padding: "0 12px", fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: INK }}>{applied ? "FALL20" : typed(g, 60, "FALL20", 0.15) || <span style={{ fontFamily: FONT, fontWeight: 400, color: "#9CA3AF", fontSize: 14 }}>Enter code</span>}</div>
            <div style={{ width: 90, height: 42, borderRadius: 8, background: applied ? "#fff" : BLUE, border: applied ? `1px solid ${LINE}` : "none", color: applied ? "#DC2626" : "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 132 && g < 142 ? 0.93 : 1})` }}>{applied ? "Remove" : g >= 138 ? "Applying..." : "Apply"}</div>
          </div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", fontSize: 15, color: GRAY }}>Original Price <span>$2,400</span></div>
          {applied && <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#16A34A", opacity: fi(g, 150, 8) }}>Promo Code Discount <span>-$480</span></div>}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 900, color: INK }}>Total <span>{applied ? "$1,920" : "$2,400"}</span></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 96, width: 940, height: 700, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}` }} />
      <div style={{ position: "absolute", left: 640, top: 118, fontSize: 24, fontWeight: 800, color: INK }}>Enrollment Details</div>
      <div style={{ position: "absolute", left: 640, top: 152, fontSize: 14, color: GRAY }}>Select your branch and session to continue</div>
      <Input x={640} y={190} w={860} label="Select a branch to enroll" value="Brightpath — Downtown" select />
      <Input x={640} y={290} w={860} label="Select a session" value="Evening cohort" select />
    </FStage>
  );
};

// ═══ o6 — usage report ═════════════════════════════════════════════════════════
const SceneReportPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const rep = g >= 60;
  const RP = prRepPt(0);
  const list = [{ ...NEW_PROMO, uses: 12, left: "38", given: "$5,760" }, ...PROMOS];
  const uses: [string, string, string, string][] = [["Maya Torres", "Medical Assistant — Fall 2026", "-$480", "Oct 8, 2026"], ["Jordan Lee", "Medical Assistant — Fall 2026", "-$480", "Oct 8, 2026"], ["Priya Nair", "Pharmacy Technician", "-$360", "Oct 7, 2026"], ["Diego Alvarez", "Medical Assistant — Fall 2026", "-$480", "Oct 7, 2026"], ["Hana Sato", "Pharmacy Technician", "-$360", "Oct 6, 2026"]];
  const cur = path(g, [[0, 900, 500], [36, RP.x, RP.y], [52, RP.x, RP.y], [90, MX(200), MY(120)], [140, MX(900), MY(120)], [180, MX(300), MY(300)], [250, MX(300), MY(520)], [330, MX(900), MY(620)], [D, MX(900), MY(620)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [26, RP.x, RP.y - 60, 1.8], [62, 800, 300, 1.35], [170, MX(500), 380, 1.4], [250, MX(650), 600, 1.35], [D, MX(650), 600, 1.35]];
  return (
    <FStage g={g} keys={keys} url={rep ? `${PR_URL}/report/fall20` : PR_URL} cur={cur} ripple={rip(g, 48)} active="Marketing" chip={[6, !rep ? "Report" : g < 170 ? "Total Uses · Total Discount · Uses Left" : g < 250 ? "Top Programs Using This Promo" : "Recent Usage Details — who, which program, how much"]}>
      {!rep ? <PromoList list={list} repHl={g >= 40 ? 0 : -1} /> : (
        <div style={{ position: "absolute", inset: 0, opacity: fi(g, 60, 8) }}>
          <PageTitle t="FALL20 · Fall Kickoff" sub="Latest 100 uses of this promo code" back x={24} y={14} />
          {[["Total Uses", "12", "🎟"], ["Total Discount", "$5,760", "💵"], ["Uses Left", "38", "⏳"], ["Discount Type", "20%", "🏷"]].map(([a, b, ic], i) => <div key={a} style={{ position: "absolute", left: 24 + i * 328, top: 88, width: 314, height: 104, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, padding: "16px 20px", boxSizing: "border-box" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: GRAY }}>{a}<span>{ic}</span></div><div style={{ marginTop: 6, fontSize: 30, fontWeight: 900, color: INK }}>{b}</div>{a === "Total Discount" && <div style={{ fontSize: 11.5, color: GRAY }}>Total savings provided</div>}</div>)}
          <div style={{ position: "absolute", left: 24, top: 210, width: 1302, height: 140, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
            <div style={{ position: "absolute", left: 20, top: 14, fontSize: 16, fontWeight: 800, color: INK }}>Top Programs Using This Promo</div>
            {[["Medical Assistant — Fall 2026", 8], ["Pharmacy Technician", 4]].map(([n, c], i) => <div key={n as string} style={{ position: "absolute", left: 20, top: 52 + i * 40, display: "flex", alignItems: "center", gap: 14, fontSize: 14, fontWeight: 700, color: INK }}><span style={{ width: 300 }}>{n}</span><div style={{ width: (c as number) * 100 * interpolate(g, [170, 220], [0, 1], cl), height: 18, borderRadius: 6, background: BLUE }} /><span>{c} uses</span></div>)}
          </div>
          <div style={{ position: "absolute", left: 24, top: 366, fontSize: 16, fontWeight: 800, color: INK }}>Recent Usage Details</div>
          <Tbl x={24} y={396} cols={[["User", 300], ["Program", 420], ["Discount", 180], ["Date", 220], ["Status", 182]]} rows={uses.map(([u, p, d, dt]) => [<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar t={u.split(" ").map((s) => s[0]).join("")} s={28} />{u}</span>, p, <b style={{ color: "#16A34A" }}>{d}</b>, dt, <Pill t="approved" tone="green" />])} rowO={uses.map((_, i) => fi(g, 250 + i * 8, 8))} />
        </div>
      )}
    </FStage>
  );
};

// ═══ o7 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapPR: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["🏷", "Code", "Percentage or fixed"], ["⏳", "Limits", "Total · per student · expiry"], ["🎯", "Programs", "Only what you choose"], ["🛒", "Checkout", "Applied automatically"], ["📊", "Report", "Every use, every dollar"]]} line={<>Discounts that <span style={{ color: "#5EEAD4" }}>run themselves.</span></>} />;
};
