// ═══════════════════════════════════════════════════════════════════════════
// Apply for a company — scenes. Real UI: SB-Frontend /company/mycompanies and
// /company/apply (ApplyComp.tsx, company-form.tsx, SignatureTerms.tsx,
// SmsVerification.tsx, PackageCard.tsx). Labels from i18n/messages/en.ts.
// ═══════════════════════════════════════════════════════════════════════════
const ORG = "Northstar Skills Academy";
const CONTACT = "Olivia Hart";
const CONTACT_EMAIL = "olivia@northstarskills.example";
const NAV = 70;
const ME_AV = { t: "OH", c1: "#F472B6", c2: "#DB2777" };

const NorthLogo: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38"><rect width="38" height="38" rx="9" fill="#1E3A8A" /><path d="M19 6l3.5 9.5L32 19l-9.5 3.5L19 32l-3.5-9.5L6 19l9.5-3.5z" fill="#FBBF24" /></svg>
    <div><div style={{ fontSize: 15 * s, fontWeight: 900, color: "#1E3A8A", letterSpacing: 0.8 }}>NORTHSTAR</div><div style={{ fontSize: 10.5 * s, fontWeight: 600, color: GRAY }}>Skills Academy</div></div>
  </div>
);

/** www.skillbnk.com header (signed in) */
const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: NAV, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 34, boxSizing: "border-box" }}>
      <MiniLogo s={1.3} />
      <div style={{ flex: 1 }} />
      {["Courses", "For Companies", "Blog", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>{t}</span>)}
      <Avatar t={ME_AV.t} c1={ME_AV.c1} c2={ME_AV.c2} s={38} />
    </div>
    <div style={{ position: "absolute", left: 0, top: NAV, width: W, height: H - BAR - NAV, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
const SY = (y: number) => NAV + y; // page y → content y

const FLOW_STEPS = ["Package", "Details", "Payment", "Sign", "Verify"];
const ApplyFrame: React.FC<{ step: number; title: string; sub: string; children: React.ReactNode }> = ({ step, title, sub, children }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 22, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {FLOW_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: step > i ? BLUE : "#E5E7EB", color: step > i ? "#fff" : GRAY, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{step > i + 1 ? "✓" : i + 1}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: step > i ? INK : GRAY }}>{s}</span>
          </div>
          {i < 4 && <span style={{ width: 70, height: 2, background: step > i + 1 ? BLUE : "#E5E7EB" }} />}
        </React.Fragment>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 76, textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: INK }}>{title}</div>
      <div style={{ fontSize: 16, color: GRAY, marginTop: 4 }}>{sub}</div>
    </div>
    {children}
  </>
);
const SiteStage: React.FC<{ g: number; keys: CamKey[]; url: string; cur: { x: number; y: number }; ripple: number; children: React.ReactNode; toast?: React.ReactNode }> = ({ g, keys, url, cur, ripple, children, toast }) => (
  <Stage>
    <PortalTag n={1} label="skillBNK website" url="www.skillbnk.com" />
    <CamC g={g} keys={keys}>
      <Browser url={url}>
        <SiteShell>{children}</SiteShell>
        {toast}
        <Cursor x={cur.x} y={cur.y} ripple={ripple} />
      </Browser>
    </CamC>
  </Stage>
);

// ═══ a0 — HOOK ════════════════════════════════════════════════════════════
const SceneHookApply: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  const steps = ["Package", "Details", "Payment", "Sign", "Verify"];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: fi(g, 6, 12) }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#8A96B2", letterSpacing: 4 }}>READY TO BRING YOUR TRAINING ONLINE?</div>
          <div style={{ marginTop: 18, fontSize: 72, fontWeight: 900, color: "#F1F5F9" }}>Set up your company on <span style={{ color: "#7FA0FF" }}>skillBNK</span></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 22 }}>
          {steps.map((s, i) => {
            const p = sp(g, 60 + i * 14, fps);
            return (
              <div key={s} style={{ width: 230, height: 150, borderRadius: 20, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF666", boxShadow: "0 0 40px #2E5CF622", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#2E5CF6", color: "#fff", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9" }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#FDBA74", opacity: fi(g, 150, 12) }}>Five steps. A few minutes.</div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ a1 — Companies (My Companies) → Apply For Company ═══════════════════
const SceneCompanies: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  const BTN = { x: 1400, y: SY(70) };
  const cur = path(g, [[0, 800, 600], [90, BTN.x, BTN.y], [130, BTN.x, BTN.y], [220, BTN.x, BTN.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [100, 1250, 160, 1.5], [220, 1250, 160, 1.5]];
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/mycompanies" cur={cur} ripple={rip(g, 120)}>
      <div style={{ position: "absolute", left: 60, top: 40 }}><div style={{ fontSize: 30, fontWeight: 800, color: INK }}>Companies</div><div style={{ fontSize: 16, color: GRAY, marginTop: 4 }}>All company information is here.</div></div>
      <div style={{ position: "absolute", left: 880, top: 50, width: 400, height: 44, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: "#9CA3AF" }}>⌕ Search companies...</div>
      <Btn x={1300} y={50} w={200} h={44} label="Apply For Company" primary fs={15} press={g >= 120 && g < 128 ? 1 : 0} />
      <div style={{ position: "absolute", left: 60, top: 140, width: 1480, height: 560, borderRadius: 14, background: "#fff", border: `1px dashed #CBD5E1`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 54 }}>🏢</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>No companies found</div>
        <div style={{ fontSize: 16, color: GRAY }}>You haven't added any companies yet</div>
        <Btn x={640} y={360} w={200} h={44} label="Apply For Company" soft fs={15} />
      </div>
    </SiteStage>
  );
};

// ═══ a2 — Choose Your Package ════════════════════════════════════════════
const PKGS = [
  { n: "Starter", popular: false, trial: "", feats: ["Course builder", "Learner portal", "Enrollment forms", "Certificates"] },
  { n: "Growth", popular: true, trial: "14 days", feats: ["Everything in Starter", "AI Curriculum Generator", "Mock interviews", "Email marketing"] },
  { n: "Scale", popular: false, trial: "", feats: ["Everything in Growth", "Multiple locations", "Website builder", "Integrations"] },
];
const ScenePackage: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const annual = g >= 90;
  const CYC = { x: 870, y: SY(170) };
  const SEL = { x: 800, y: SY(690) };
  const cur = path(g, [[0, 800, 700], [70, CYC.x, CYC.y], [94, CYC.x, CYC.y], [200, SEL.x, SEL.y], [240, SEL.x, SEL.y], [330, SEL.x, SEL.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [60, 800, 230, 1.4], [100, 800, 230, 1.4], [140, WIDE_X, 470, 1.05], [330, WIDE_X, 470, 1.05]];
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/apply" cur={cur} ripple={Math.max(rip(g, 86), rip(g, 232))}>
      <ApplyFrame step={1} title="Choose Your Package" sub="Select the perfect plan for your institution">
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 10 }}>
          {["Monthly", "Annually"].map((c) => {
            const on = (c === "Annually") === annual;
            return <span key={c} style={{ padding: "9px 22px", borderRadius: 999, fontSize: 15, fontWeight: 700, background: on ? BLUE : "#E5E7EB", color: on ? "#fff" : "#4B5563", boxShadow: on ? "0 4px 12px #1D3FD640" : "none" }}>{c}</span>;
          })}
          <span style={{ marginLeft: 20, padding: "9px 22px", borderRadius: 999, fontSize: 15, fontWeight: 700, border: `1px solid ${BLUE}`, color: BLUE, background: "#fff" }}>Custom Package</span>
        </div>
        {PKGS.map((p, i) => {
          const o = sp(g, 20 + i * 10, fps);
          const pick = p.popular && g >= 232;
          return (
            <div key={p.n} style={{ position: "absolute", left: 210 + i * 400, top: 220, width: 370, height: 500, borderRadius: 18, background: "#fff", border: `2px solid ${p.popular ? BLUE : LINE}`, boxShadow: p.popular ? "0 20px 50px #1D3FD628" : "0 2px 8px #0001", opacity: o, transform: `translateY(${(1 - o) * 30}px) scale(${pick ? 1.02 : 1})`, padding: 26, boxSizing: "border-box" }}>
              {p.popular && <div style={{ position: "absolute", top: -14, left: 120, padding: "4px 14px", borderRadius: 999, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 800 }}>Most Popular</div>}
              <div style={{ fontSize: 24, fontWeight: 800, color: INK }}>{p.n}</div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 40, fontWeight: 900, color: INK, filter: "blur(9px)" }}>$000</span><span style={{ fontSize: 15, color: GRAY }}>/ {annual ? "year" : "month"}</span></div>
              {p.trial && <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: GREEN }}>🎁 Free Trial: {p.trial}</div>}
              <div style={{ marginTop: 18, fontSize: 14, fontWeight: 800, color: "#374151" }}>Included Features ({p.feats.length})</div>
              {p.feats.map((ft) => <div key={ft} style={{ marginTop: 10, fontSize: 15, color: "#374151" }}><span style={{ color: GREEN, fontWeight: 900 }}>✓</span> &nbsp;{ft}</div>)}
              <div style={{ position: "absolute", left: 26, right: 26, bottom: 24, height: 46, borderRadius: 10, background: p.popular ? BLUE : "#F3F4F6", color: p.popular ? "#fff" : INK, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pick && g < 240 ? 0.95 : 1})` }}>Select Package</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>Plans and prices shown are examples</div>
      </ApplyFrame>
    </SiteStage>
  );
};

// ═══ a3 — Institute Information ══════════════════════════════════════════
const SceneDetails: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const NEXT = { x: 1230, y: SY(720) };
  const cur = path(g, [[0, 900, 600], [20, 420, SY(250)], [150, 420, SY(250)], [170, 520, SY(520)], [260, 520, SY(520)], [290, 1120, SY(300)], [340, 1120, SY(300)], [380, NEXT.x, NEXT.y], [420, NEXT.x, NEXT.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 560, 330, 1.35], [150, 560, 330, 1.35], [170, 560, 600, 1.35], [260, 560, 600, 1.35], [290, 1100, 420, 1.3], [340, 1100, 420, 1.3], [370, 1150, 680, 1.4], [420, 1150, 680, 1.4]];
  const T = (a: number, s: string, c = 1.2) => typed(g, a, s, c);
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/apply?packageId=growth" cur={cur} ripple={rip(g, 402)}>
      <ApplyFrame step={2} title="Institute Information" sub="Fill in your institution details">
        <div style={{ position: "absolute", left: 160, top: 150, width: 1280, height: 620, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}` }}>
          <div style={{ position: "absolute", left: 30, top: 16, fontSize: 14, color: GRAY }}>Selected Package: <b style={{ color: INK }}>Growth · Annually</b></div>
          <Field x={30} y={50} w={560} label="Company Name" req value={T(20, ORG)} ph="Enter company name" glow={g >= 20 && g < 60 ? 1 : 0} />
          <Field x={30} y={130} w={560} label="Street" req value={T(55, "1200 Congress Ave")} ph="Street" />
          <Field x={30} y={210} w={270} label="City" req value={T(80, "Austin")} ph="City" />
          <Field x={320} y={210} w={270} label="Postal Code" req value={T(95, "78701")} ph="Postal Code" />
          <Field x={30} y={290} w={270} label="State" req value={T(110, "Texas")} ph="State" />
          <Field x={320} y={290} w={270} label="Country" req value={g >= 125 ? "United States" : ""} ph="Select country" select />
          <Field x={30} y={370} w={270} label="Phone Number" req value={T(140, "+1 512 555 0186")} ph="Phone Number" />
          <Field x={320} y={370} w={270} label="Website URL" value={T(160, "northstarskills.example")} ph="Website URL" />
          <div style={{ position: "absolute", left: 30, top: 456, fontSize: 16, fontWeight: 800, color: INK }}>Contact Person 1</div>
          <Field x={30} y={486} w={270} label="Name" req value={T(175, CONTACT)} ph="Please enter name" glow={g >= 175 && g < 230 ? 1 : 0} />
          <Field x={320} y={486} w={270} label="Email" req value={T(195, CONTACT_EMAIL, 1.6)} ph="Please enter email" />
          <div style={{ position: "absolute", left: 650, top: 50, width: 600, fontSize: 15, fontWeight: 600, color: "#374151" }}>Logo</div>
          <div style={{ position: "absolute", left: 650, top: 78, width: 290, height: 150, borderRadius: 12, border: `2px dashed ${g >= 300 ? BLUE : "#CBD5E1"}`, background: g >= 300 ? BLUE_SOFT : "#FAFAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {g >= 300 ? <div style={{ opacity: fi(g, 300, 8) }}><NorthLogo s={1.2} /></div> : <span style={{ fontSize: 15, fontWeight: 700, color: GRAY }}>⤒ Upload logo</span>}
          </div>
          <div style={{ position: "absolute", left: 960, top: 50, fontSize: 15, fontWeight: 600, color: "#374151" }}>Business Document</div>
          <div style={{ position: "absolute", left: 960, top: 78, width: 290, height: 150, borderRadius: 12, border: `2px dashed ${g >= 320 ? BLUE : "#CBD5E1"}`, background: g >= 320 ? BLUE_SOFT : "#FAFAFB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: g >= 320 ? INK : GRAY }}>{g >= 320 ? "📄 business-license.pdf" : "⤒ Upload document"}</div>
          <div style={{ position: "absolute", left: 650, top: 250, fontSize: 15, fontWeight: 600, color: "#374151" }}>About</div>
          <div style={{ position: "absolute", left: 650, top: 278, width: 600, height: 120, borderRadius: 8, border: "1px solid #D1D5DB", padding: "10px 14px", boxSizing: "border-box", fontSize: 15, color: INK, lineHeight: 1.5 }}>{T(230, "Career training for new sales and customer-service teams in Central Texas.", 1.4) || <span style={{ color: "#9CA3AF" }}>Write about the company</span>}</div>
          <Btn x={1010} y={550} w={240} h={46} label="Next: Payment" primary fs={15.5} press={g >= 402 && g < 410 ? 1 : 0} />
          <Btn x={880} y={550} w={110} h={46} label="Clear" fs={15} />
        </div>
      </ApplyFrame>
    </SiteStage>
  );
};

// ═══ a4 — Payment Details (Stripe / Manual) ═══════════════════════════════
const ScenePayment: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const manual = g >= 120;
  const MAN = { x: 1010, y: SY(400) };
  const CONT = { x: 1090, y: SY(690) };
  const cur = path(g, [[0, 800, 700], [60, 600, SY(400)], [90, 600, SY(400)], [110, MAN.x, MAN.y], [130, MAN.x, MAN.y], [240, CONT.x, CONT.y], [300, CONT.x, CONT.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [50, 800, 440, 1.3], [300, 800, 520, 1.3]];
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/apply?packageId=growth" cur={cur} ripple={Math.max(rip(g, 118), rip(g, 262))}>
      <ApplyFrame step={3} title="Payment Details" sub="Choose a payment method to continue">
        <div style={{ position: "absolute", left: 360, top: 160, width: 880, height: 600, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontSize: 15, color: GRAY }}>Selected Package: <b style={{ color: INK }}>Growth</b></div>
          <div style={{ marginTop: 8, display: "flex", gap: 24, fontSize: 15, color: "#374151" }}><span>Base: <b style={{ filter: "blur(6px)" }}>$000</b></span><span>Discount: <b style={{ filter: "blur(6px)" }}>$00</b></span><span>Final: <b style={{ filter: "blur(6px)" }}>$000</b></span></div>
          <div style={{ marginTop: 26, fontSize: 18, fontWeight: 800, color: INK }}>Select Payment Method</div>
          <div style={{ marginTop: 14, display: "flex", gap: 20 }}>
            {[["💳 Stripe", "Pay securely with card.", false], ["🧾 Manual", "Continue with manual payment.", true]].map(([t, d, isMan]) => {
              const on = (isMan as boolean) === manual && (manual || false);
              return (
                <div key={t as string} style={{ flex: 1, height: 110, borderRadius: 12, border: `2px solid ${on ? BLUE : LINE}`, background: on ? BLUE_SOFT : "#fff", padding: 20, boxSizing: "border-box" }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>{t as string}</div>
                  <div style={{ marginTop: 6, fontSize: 14.5, color: GRAY }}>{d as string}</div>
                </div>
              );
            })}
          </div>
          {manual && (
            <div style={{ marginTop: 22, padding: 20, borderRadius: 12, background: "#FFFBEB", border: "1px solid #FDE68A", opacity: fi(g, 124, 10) }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>Manual Payment</div>
              <div style={{ marginTop: 6, fontSize: 14.5, color: "#374151", lineHeight: 1.5 }}>You selected manual payment. You will get all payment details in your company dashboard. Continue to sign the terms and complete verification.</div>
            </div>
          )}
          <Btn x={30} y={520} w={110} h={46} label="Back" fs={15} />
          {manual && <Btn x={620} y={520} w={220} h={46} label="Continue to Sign" primary fs={15.5} press={g >= 262 && g < 270 ? 1 : 0} />}
        </div>
      </ApplyFrame>
    </SiteStage>
  );
};

// ═══ a5 — Terms & Signature → verification choice ═════════════════════════
const SceneSign: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const agreed = g >= 80;
  const draw = interpolate(g, [110, 200], [0, 1], cl);
  const emailPick = g >= 250;
  const AGREE = { x: 420, y: SY(400) };
  const PAD = { x: 760, y: SY(520) };
  const EM = { x: 1000, y: SY(668) };
  const GO = { x: 1290, y: SY(740) };
  const cur = path(g, [[0, 800, 700], [60, AGREE.x, AGREE.y], [84, AGREE.x, AGREE.y], [110, PAD.x - 200, PAD.y], [200, PAD.x + 160, PAD.y - 10], [240, EM.x, EM.y], [256, EM.x, EM.y], [320, GO.x, GO.y], [360, GO.x, GO.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [50, 700, 420, 1.3], [100, 760, 560, 1.35], [210, 760, 560, 1.35], [240, 1000, 680, 1.3], [360, 1000, 680, 1.3]];
  const sig = "M 0 40 C 30 -10, 50 70, 80 30 S 130 0, 150 40 S 200 70, 230 20 S 290 50, 330 30";
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/apply?packageId=growth" cur={cur} ripple={Math.max(rip(g, 80), rip(g, 252), rip(g, 340))}>
      <ApplyFrame step={4} title="Terms & Signature" sub="Review and sign the terms">
        <div style={{ position: "absolute", left: 260, top: 150, width: 1080, height: 650, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, padding: 26, boxSizing: "border-box" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Terms and Conditions</div>
          <div style={{ marginTop: 10, height: 120, borderRadius: 10, background: "#F9FAFB", border: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box", overflow: "hidden" }}>
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ height: 9, borderRadius: 5, background: "#E5E7EB", marginBottom: 12, width: `${92 - i * 9}%` }} />)}
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 15.5, color: INK, fontWeight: 600 }}>
            <span style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${agreed ? BLUE : "#CBD5E1"}`, background: agreed ? BLUE : "#fff", color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{agreed ? "✓" : ""}</span>
            I have read and agree to the terms and conditions
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 18, fontWeight: 800, color: INK }}>Signature</span><span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>Clear Signature</span></div>
          <div style={{ marginTop: 8, height: 130, borderRadius: 10, border: "1.5px dashed #CBD5E1", background: "#FCFCFD", position: "relative" }}>
            <svg width="400" height="90" style={{ position: "absolute", left: 300, top: 22 }} viewBox="-10 -10 350 90"><path d={sig} fill="none" stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} /></svg>
          </div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: GRAY }}>Please sign above using your mouse or touchscreen.</div>
          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 700, color: "#374151" }}>Choose how you'd like to receive your verification code:</div>
          <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
            {[["📱 SMS to", "+1 512 ••• 0186", false], ["✉️ Email to", "olivia@north•••.example", true]].map(([a, b, isE]) => {
              const on = (isE as boolean) ? emailPick : !emailPick;
              return <div key={a as string} style={{ flex: 1, height: 54, borderRadius: 10, border: `2px solid ${on ? BLUE : LINE}`, background: on ? BLUE_SOFT : "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontSize: 15, color: INK }}><b>{a as string}</b><span style={{ color: GRAY }}>{b as string}</span></div>;
            })}
          </div>
          <Btn x={800} y={580} w={230} h={46} label="Sign & Continue" primary fs={15.5} press={g >= 340 && g < 348 ? 1 : 0} />
        </div>
      </ApplyFrame>
    </SiteStage>
  );
};

// ═══ a6 — Email Verification → Verify & Submit ════════════════════════════
const SceneVerify: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 260;
  const g = gt(f, dur, D);
  const code = "482916";
  const n = Math.max(0, Math.min(6, Math.floor((g - 40) / 12)));
  const GO = { x: 800, y: SY(560) };
  const cur = path(g, [[0, 900, 700], [30, 800, SY(420)], [120, 800, SY(420)], [150, GO.x, GO.y], [170, GO.x, GO.y], [260, GO.x, GO.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 800, 520, 1.35], [260, 800, 520, 1.35]];
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/apply?packageId=growth" cur={cur} ripple={rip(g, 164)} toast={g >= 180 ? <Toast g={g} at={180} text="Application submitted successfully!" x={1060} y={90} /> : null}>
      <ApplyFrame step={5} title="Email Verification" sub="Verify your email address">
        <div style={{ position: "absolute", left: 500, top: 160, width: 600, height: 470, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontSize: 46 }}>✉️</div>
          <div style={{ marginTop: 8, fontSize: 15, color: GRAY }}>We've sent a verification code to</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>{CONTACT_EMAIL}</div>
          <div style={{ marginTop: 6, fontSize: 14, color: GRAY }}>Enter the 6-digit code below to verify your email address</div>
          <div style={{ marginTop: 26, display: "flex", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ width: 58, height: 66, borderRadius: 10, border: `2px solid ${i === n && n < 6 ? BLUE : i < n ? "#A5B4FC" : "#D1D5DB"}`, fontSize: 30, fontWeight: 800, color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>{i < n ? code[i] : ""}</div>)}
          </div>
          <div style={{ marginTop: 18, fontSize: 14, color: GRAY }}>Resend code in {Math.max(0, 59 - Math.floor(g / 6))}s</div>
          <div style={{ marginTop: 22, width: 300, height: 48, borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 164 && g < 172 ? 0.95 : 1})` }}>{g >= 164 && g < 182 ? "Verifying..." : "Verify & Submit"}</div>
        </div>
      </ApplyFrame>
    </SiteStage>
  );
};

// ═══ a7 — Companies list: Pending → Approved → Explore Company ════════════
const SceneStatus: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const approved = g >= 150;
  const EXP = { x: 210, y: SY(483) };
  const cur = path(g, [[0, 900, 700], [60, 600, SY(300)], [200, 600, SY(300)], [250, EXP.x, EXP.y], [300, EXP.x, EXP.y]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [40, 520, 360, 1.45], [300, 520, 360, 1.45]];
  const card = sp(g, 6, fps);
  return (
    <SiteStage g={g} keys={keys} url="www.skillbnk.com/company/mycompanies" cur={cur} ripple={rip(g, 270)}>
      <div style={{ position: "absolute", left: 60, top: 40 }}><div style={{ fontSize: 30, fontWeight: 800, color: INK }}>Companies</div><div style={{ fontSize: 16, color: GRAY, marginTop: 4 }}>All company information is here.</div></div>
      <Btn x={1300} y={50} w={200} h={44} label="Apply For Company" primary fs={15} />
      <div style={{ position: "absolute", left: 60, top: 130, width: 560, height: 400, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, boxShadow: "0 10px 30px #0F172A12", opacity: card, transform: `translateY(${(1 - card) * 20}px)`, padding: 26, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <NorthLogo s={1.3} />
          <div style={{ transform: `scale(${approved ? 1 + 0.15 * Math.max(0, 1 - (g - 150) / 12) : 1})` }}>{approved ? <Badge t="Approved" c={GREEN} bg="#DCFCE7" dot /> : <Badge t="Pending" c="#B45309" bg="#FEF3C7" dot />}</div>
        </div>
        <div style={{ marginTop: 22, fontSize: 22, fontWeight: 800, color: INK }}>{ORG}</div>
        <div style={{ marginTop: 10, fontSize: 15, color: GRAY, lineHeight: 1.8 }}>📍 1200 Congress Ave, Austin, Texas, United States<br />✉️ {CONTACT_EMAIL}<br />Added: Oct 3, 2026</div>
        <div style={{ position: "absolute", left: 26, right: 26, bottom: 24, display: "flex", gap: 12, opacity: approved ? 1 : 0.4 }}>
          <div style={{ flex: 1, height: 46, borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 270 && g < 278 ? 0.95 : 1})` }}>Explore Company</div>
          <div style={{ flex: 1, height: 46, borderRadius: 10, border: `1px solid ${LINE}`, color: INK, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>Access Branch</div>
        </div>
      </div>
    </SiteStage>
  );
};

// ═══ a8 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapApply: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["📦", "Pick a package", "#2563EB"], ["🏫", "Add your details", "#7C3AED"], ["✍️", "Sign & verify", "#14B8A6"], ["🚀", "Start building", "#22C55E"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 160, top: 370, width: 1600, display: "flex", gap: 30 }}>
          {steps.map(([ic, t, c], i) => {
            const p = sp(g, 20 + i * 12, fps);
            return (
              <div key={t} style={{ flex: 1, height: 220, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${c}88`, boxShadow: `0 0 50px ${c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 52 }}>{ic}</div>
                <div style={{ marginTop: 14, fontSize: 32, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 80, 12) }}>
          Apply in minutes. <span style={{ color: "#7FA0FF" }}>Train for years.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
