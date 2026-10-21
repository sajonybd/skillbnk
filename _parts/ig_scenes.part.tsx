
// ═══════════════════════════════════════════════════════════════════════════
// Integrations — scenes (sheet serial 22). Real UI (SB-Company /integrations, Integrations.tsx + panels):
//  "Integrations" · "Manage third-party integrations for your organization." · Check connections ·
//  vertical tabs ChatGPT / Zoom / SendGrid / Twilio / Vimeo / Payment Methods (PayPal · Square · Stripe · Custom),
//  red dot = "Connection issue".  Panel heading + description + "Save changes before testing".
//  ChatGPT ("Configure AI features and choose the model available to your branches."): API Key, Branches,
//   Select Model (GPT-4o, GPT-4o mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo), Active, Save, Test connection.
//  Zoom ("Manage the Zoom accounts available for meetings and recordings."): Add Zoom Account, Title,
//   Zoom Account ID, Client ID, Client Secret, Branches, Active.
//  SendGrid ("Set the verified email senders that your branches can use."): API Key, Sender Emails, Branches.
//  Twilio ("Set the phone numbers your branches can use for SMS."): Account SID, Auth Token, Sender Numbers.
//  Vimeo ("Connect the video library used for secure media delivery."): Access Token, User ID.
//  Stripe ("Connect Stripe and choose which branches can accept card payments."): Title, Secret Key:, Branches.
//  Toasts "Saved successfully", "<Provider> connection verified".  Broken note "Connection needs attention" ·
//  "We could not verify the saved <X> connection. Review the settings below, save any changes, then select
//  Test connection."
// ═══════════════════════════════════════════════════════════════════════════
const IG_TABS = ["ChatGPT", "Zoom", "SendGrid", "Twilio", "Vimeo", "Payment Methods"];
const IG_PAY = ["PayPal", "Square", "Stripe", "Custom"];
const IG_DESC: Record<string, string> = { ChatGPT: "Configure AI features and choose the model available to your branches.", Zoom: "Manage the Zoom accounts available for meetings and recordings.", SendGrid: "Set the verified email senders that your branches can use.", Twilio: "Set the phone numbers your branches can use for SMS.", Vimeo: "Connect the video library used for secure media delivery.", Stripe: "Connect Stripe and choose which branches can accept card payments.", PayPal: "Connect PayPal and choose which branches can accept payments.", Square: "Connect Square and choose which branches can accept payments.", Custom: "Create organization-specific payment instructions for selected branches." };
const IG_CHK = { x: 1350 - 24 - 180, y: 22, w: 180, h: 40 };
const igTabPt = (i: number) => ({ x: MX(24 + 120), y: MY(112 + i * 48 + 20) });
const igPayPt = (k: number) => ({ x: MX(24 + 130), y: MY(112 + 6 * 48 + k * 40 + 18) });
const IG_SAVE = { x: 1326 - 24 - 110, y: 720, w: 110, h: 40 };
const IG_TEST = { x: 1326 - 24 - 110 - 10 - 170, y: 720, w: 170, h: 40 };
const igPt = (b: { x: number; y: number; w: number; h?: number }) => ({ x: MX(ctr(b).x), y: MY(ctr(b).y) });
const fPt = (x: number, y: number, w: number) => ({ x: MX(x + w / 2), y: MY(y + 47) });
const IG_URL = "company.skillbnk.com/integrations";
const IgPage: React.FC<{ tab: number; pay?: number; broken?: number[]; chkPress?: boolean; title?: string; children?: React.ReactNode; save?: boolean; test?: boolean; testBtn?: boolean; note?: string }> = ({ tab, pay = 2, broken = [], chkPress, title, children, save, test, testBtn = true, note }) => {
  const t = title ?? (tab === 5 ? IG_PAY[pay] : IG_TABS[tab]);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PageTitle t="Integrations" sub="Manage third-party integrations for your organization." x={24} y={16} />
      <UB {...IG_CHK} v="outline" label="Check connections" press={chkPress} />
      <div style={{ position: "absolute", left: 24, top: 96, width: 240, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
      {IG_TABS.map((n, i) => <div key={n} style={{ position: "absolute", left: 34, top: 112 + i * 48, width: 220, height: 40, borderRadius: 8, background: i === tab ? BLUE_SOFT : "transparent", color: i === tab ? BLUE : "#374151", fontSize: 14.5, fontWeight: i === tab ? 800 : 600, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box" }}><Ico s={14} c={i === tab ? BLUE : "#6B7280"} />{n}{broken.includes(i) && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#DC2626" }} />}</div>)}
      {tab === 5 && IG_PAY.map((n, k) => <div key={n} style={{ position: "absolute", left: 50, top: 112 + 6 * 48 + k * 40, width: 196, height: 34, borderRadius: 7, background: k === pay ? BLUE : "transparent", color: k === pay ? "#fff" : GRAY, fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 12px", boxSizing: "border-box" }}>{n}</div>)}
      <div style={{ position: "absolute", left: 280, top: 96, width: 1046, height: 690, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }} />
      <div style={{ position: "absolute", left: 304, top: 114, fontSize: 20, fontWeight: 800, color: INK }}>{t}</div>
      <div style={{ position: "absolute", left: 304, top: 146, fontSize: 14, color: GRAY }}>{IG_DESC[t] ?? ""}</div>
      <div style={{ position: "absolute", right: 48, top: 150, fontSize: 12, color: GRAY }}>Save changes before testing</div>
      <div style={{ position: "absolute", left: 304, top: 178, width: 998, height: 1, background: LINE }} />
      {note && <div style={{ position: "absolute", left: 304, top: 192, width: 998, padding: "12px 16px", borderRadius: 10, border: "1px solid #FCA5A5", background: "#FEF2F2", boxSizing: "border-box", display: "flex", gap: 12 }}><span style={{ fontSize: 18 }}>🛡</span><div><div style={{ fontSize: 14.5, fontWeight: 800, color: "#B91C1C" }}>Connection needs attention</div><div style={{ marginTop: 2, fontSize: 13, color: GRAY }}>We could not verify the saved {note} connection. Review the settings below, save any changes, then select <b>Test connection</b>.</div></div></div>}
      {children}
      {testBtn && <UB {...IG_TEST} v="outline" label="Test connection" press={test} />}
      <UB {...IG_SAVE} label="Save" press={save} />
    </div>
  );
};
const IgBranches: React.FC<{ x: number; y: number; w: number; vals: string[]; glow?: boolean }> = ({ x, y, w, vals, glow }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Branches</div>
    <div style={{ minHeight: 40, borderRadius: 8, border: `1px solid ${glow ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: glow ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", gap: 6, padding: "0 10px", boxSizing: "border-box", flexWrap: "wrap" }}>{vals.length ? vals.map((v) => <Pill key={v} t={v} tone="blue" />) : <span style={{ fontSize: 14, color: "#9CA3AF" }}>Select branches</span>}<span style={{ marginLeft: "auto", color: "#9CA3AF" }}>⌄</span></div>
  </div>
);
const IgActive: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 700, color: INK }}><Toggle on={on} />Active</div>;
const mask = (s: string) => (s.length < 8 ? s : s.slice(0, 5) + "•".repeat(Math.min(26, s.length - 5)));
const brPick = (g: number, a: number) => ["Downtown", "Eastside", "Northgate"].filter((_, i) => g >= a + i * 12);

// ═══ i0 — HOOK ═════════════════════════════════════════════════════════════
const SceneHookIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const B2 = 194, B3 = 274;
  const lost = Math.round(interpolate(g, [30, B2 - 10], [0, 7], cl));
  const beat = g < B2 ? 1 : g < B3 ? 2 : 3;
  const alerts = ["Payment failed — card checkout", "Payment failed — card checkout", "Enrollment not completed", "Payment failed — card checkout", "Customer: “Your site won't take my card”"];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        {beat === 1 && <AbsoluteFill style={{ opacity: fo(g, B2 - 6, 6) }}>
          <div style={{ position: "absolute", left: 160, top: 150, width: 720 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#94A3B8", opacity: fi(g, 2, 8) }}>Friday, 9:02 PM</div>
            <div style={{ marginTop: 10, fontSize: 66, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.08, opacity: fi(g, 8, 10) }}>Your payment key <span style={{ color: "#F87171" }}>just expired.</span></div>
            <div style={{ marginTop: 40, fontSize: 26, fontWeight: 700, color: "#FCA5A5", opacity: fi(g, 40, 8) }}>Enrollments lost this weekend</div>
            <div style={{ fontSize: 140, fontWeight: 900, color: "#EF4444", lineHeight: 1, opacity: fi(g, 40, 8) }}>{lost}</div>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 70, width: 470, height: 940, borderRadius: 60, background: "linear-gradient(180deg,#1E1B4B,#0B1020)", border: "10px solid #0F172A", boxShadow: "0 40px 100px #000C, inset 0 0 0 2px #334155" }}>
            <div style={{ marginTop: 70, textAlign: "center", fontSize: 92, fontWeight: 300, color: "#E2E8F0" }}>9:02</div>
            {alerts.map((a, i) => { const p = sp(g, 24 + i * 18, fps, { damping: 13 }); return <div key={i} style={{ margin: "14px 22px 0", padding: "14px 16px", borderRadius: 18, background: "#ffffffE6", opacity: p, transform: `translateY(${(1 - p) * -40}px)` }}><div style={{ fontSize: 13, fontWeight: 800, color: "#DC2626" }}>⚠ BRIGHTPATH CHECKOUT · now</div><div style={{ marginTop: 3, fontSize: 18, fontWeight: 700, color: INK }}>{a}</div></div>; })}
          </div>
        </AbsoluteFill>}
        {beat === 2 && <AbsoluteFill style={{ opacity: Math.min(fi(g, B2, 8), fo(g, B3 - 6, 6)) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 150, opacity: sp(g, B2 + 4, fps), transform: `rotate(${Math.sin(g * 0.6) * 4}deg)` }}>🔒</div>
          <HookLine g={g} at={B2 + 10} top={430} size={56}>Most LMS platforms lock you into <span style={{ color: "#FCA5A5" }}>their</span> providers.</HookLine>
          <HookLine g={g} at={B2 + 40} top={560} size={34} color="#94A3B8">Their payment processor. Their fees. And nobody tells you when it breaks.</HookLine>
        </AbsoluteFill>}
        {beat === 3 && <AbsoluteFill style={{ opacity: fi(g, B3, 8) }}>
          <SbBadge g={g} at={B3 + 2} x={110} y={200} />
          <div style={{ position: "absolute", left: 110, top: 280, width: 760, fontSize: 68, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.06, opacity: fi(g, B3 + 8, 10) }}>Your own accounts.<br /><span style={{ color: "#5EEAD4" }}>One click to test them all.</span></div>
          <div style={{ position: "absolute", left: 1000, top: 140, width: 800, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[["✨", "ChatGPT"], ["🎥", "Zoom"], ["✉", "SendGrid"], ["💬", "Twilio"], ["▶", "Vimeo"], ["💳", "Stripe"]].map(([ic, n], i) => { const ok = g >= B3 + 50 + i * 8; return <div key={n} style={{ height: 230, borderRadius: 20, background: "#fff", boxShadow: "0 24px 60px #000A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: sp(g, B3 + 10 + i * 6, fps) }}><span style={{ fontSize: 50 }}>{ic}</span><span style={{ fontSize: 26, fontWeight: 900, color: INK }}>{n}</span><span style={{ fontSize: 16, fontWeight: 800, padding: "5px 14px", borderRadius: 999, background: ok ? "#DCFCE7" : "#F3F4F6", color: ok ? "#15803D" : GRAY }}>{ok ? "✓ connection verified" : "testing…"}</span></div>; })}
          </div>
        </AbsoluteFill>}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ i1 — Integrations tour ══════════════════════════════════════════════════
const SceneTourIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const opened = g >= 70;
  const M = menuPt("Integrations");
  const T0 = 120, ST = 30;
  const tab = g < T0 ? 0 : Math.min(5, Math.floor((g - T0) / ST));
  const pts: P3[] = [[0, 800, 500], [36, M.x, M.y], [64, M.x, M.y], [100, igTabPt(0).x, igTabPt(0).y]];
  IG_TABS.forEach((_, i) => pts.push([T0 + i * ST, igTabPt(i).x, igTabPt(i).y], [T0 + i * ST + 14, igTabPt(i).x, igTabPt(i).y]));
  pts.push([D, igPayPt(2).x, igPayPt(2).y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 300, 450, 1.9], [66, 300, 450, 1.9], [100, MX(460), 330, 1.45], [D, MX(460), 380, 1.45]];
  return (
    <FStage g={g} keys={keys} url={opened ? IG_URL : "company.skillbnk.com/dashboard"} cur={cur} ripple={Math.max(rip(g, 66), ...IG_TABS.map((_, i) => rip(g, T0 + i * ST + 6)))} active={opened ? "Integrations" : "Dashboard"} chip={[1, !opened ? "Company portal → Integrations" : g < T0 ? "Every connection in one page" : `${IG_TABS[tab]}`]}>
      {!opened ? <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 800, color: INK }}>Dashboard</div> : (
        <IgPage tab={tab} pay={0} testBtn={false}>
          <div style={{ position: "absolute", left: 304, top: 210, fontSize: 14, color: GRAY }}>Select a provider to see its settings.</div>
        </IgPage>
      )}
    </FStage>
  );
};

// ═══ i2 — ChatGPT: key → locations → model → Save → Test ════════════════════
const SceneAiIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const KEY = { x: 304, y: 196, w: 640 }, BRS2 = { x: 304, y: 282, w: 640 }, MOD = { x: 304, y: 368, w: 640 };
  const keyV = mask(typed(g, 40, "sk-proj-8fK2mQ7xLw9tR4vB1nY6", 1.2));
  const brs = brPick(g, 116);
  const modOpen = g >= 170 && g < 214;
  const model = g >= 214 ? "GPT-4o mini" : "";
  const act = interpolate(g, [236, 244], [0, 1], cl);
  const opts: [string, string][] = [["GPT-4o", "High-intelligence flagship model for complex, multi-step tasks."], ["GPT-4o mini", "Affordable and intelligent small model for fast, lightweight tasks."], ["GPT-4 Turbo", "Latest GPT-4 Turbo with vision capabilities."]];
  const pts: P3[] = [[0, igPayPt(2).x, igPayPt(2).y], [24, igTabPt(0).x, igTabPt(0).y], [34, fPt(KEY.x, KEY.y, KEY.w).x, fPt(KEY.x, KEY.y, KEY.w).y], [100, fPt(KEY.x, KEY.y, KEY.w).x, fPt(KEY.x, KEY.y, KEY.w).y], [112, fPt(BRS2.x, BRS2.y, BRS2.w).x, fPt(BRS2.x, BRS2.y, BRS2.w).y], [156, fPt(BRS2.x, BRS2.y, BRS2.w).x, fPt(BRS2.x, BRS2.y, BRS2.w).y], [170, fPt(MOD.x, MOD.y, MOD.w).x, fPt(MOD.x, MOD.y, MOD.w).y], [190, MX(500), MY(368 + 110)], [214, MX(500), MY(368 + 110)], [236, MX(330), MY(474)], [246, MX(330), MY(474)], [284, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [300, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [340, igPt(IG_TEST).x, igPt(IG_TEST).y], [356, igPt(IG_TEST).x, igPt(IG_TEST).y], [D, igPt(IG_TEST).x, igPt(IG_TEST).y]];
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, MX(460), 380, 1.45], [30, MX(630), 330, 1.55], [230, MX(630), 400, 1.55], [270, MX(1000), 640, 1.6], [D, MX(1000), 640, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${IG_URL}?tab=chatgpt`} cur={cur} ripple={Math.max(rip(g, 30), rip(g, 172), rip(g, 212), rip(g, 240), rip(g, 296), rip(g, 352))} active="Integrations" chip={[2, g < 106 ? "ChatGPT · your own API key" : g < 166 ? "Choose which locations can use it" : g < 280 ? "Pick the model · Active" : g < 336 ? "Save" : "Test connection"]}
      over={<>{g >= 302 && g < 352 && <Toast g={g} at={302} text="Saved successfully" x={1150} y={110} />}{g >= 362 && <Toast g={g} at={362} text="ChatGPT connection verified" x={1100} y={110} />}</>}>
      <IgPage tab={0} save={g >= 292 && g < 302} test={g >= 348 && g < 358}>
        <MInput x={KEY.x} y={KEY.y} w={KEY.w} label="API Key" value={keyV} ph="Enter API Key" glow={g >= 34 && g < 104} />
        <div style={{ position: "absolute", left: KEY.x + KEY.w + 10, top: KEY.y + 27, height: 40, padding: "0 14px", borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", fontSize: 13.5, fontWeight: 700 }}>Clear</div>
        <IgBranches x={BRS2.x} y={BRS2.y} w={BRS2.w} vals={brs} glow={g >= 110 && g < 160} />
        <MInput x={MOD.x} y={MOD.y} w={MOD.w} label="Select Model" value={model} ph="Select Model" select glow={modOpen} />
        {modOpen && <div style={{ position: "absolute", left: MOD.x, top: MOD.y + 72, width: MOD.w, background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, boxShadow: "0 16px 40px #0002", zIndex: 5 }}>{opts.map(([n, d], i) => <div key={n} style={{ padding: "10px 14px", background: i === 1 ? BLUE_SOFT : "#fff" }}><div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{n}</div><div style={{ fontSize: 12, color: GRAY }}>{d}</div></div>)}</div>}
        {!modOpen && <IgActive x={304} y={462} on={act} />}
      </IgPage>
    </FStage>
  );
};

// ═══ i3 — Zoom account ═══════════════════════════════════════════════════════
const SceneZoomIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const ADDZ = { x: 304, y: 196, w: 190, h: 40 };
  const card = g >= 56;
  const F = [{ l: "Title", v: "Main campus Zoom", ph: "Enter Account Title", x: 328, y: 262, a: 66 }, { l: "Zoom Account ID", v: "aB3x-9QpL2", ph: "Enter Zoom ID", x: 816, y: 262, a: 104 }, { l: "Client ID", v: "kq7Vn2Ws1d", ph: "Enter Client ID", x: 328, y: 348, a: 140 }, { l: "Client Secret", v: "••••••••••••••••", ph: "Enter Client Secret", x: 816, y: 348, a: 172 }];
  const brs = brPick(g, 214);
  const pts: P3[] = [[0, igPt(IG_TEST).x, igPt(IG_TEST).y], [24, igTabPt(1).x, igTabPt(1).y], [34, igTabPt(1).x, igTabPt(1).y], [50, igPt(ADDZ).x, igPt(ADDZ).y], [58, igPt(ADDZ).x, igPt(ADDZ).y]];
  F.forEach((q) => { const p = fPt(q.x, q.y, 460); pts.push([q.a - 4, p.x, p.y], [q.a + 22, p.x, p.y]); });
  pts.push([210, fPt(328, 434, 460).x, fPt(328, 434, 460).y], [246, fPt(328, 434, 460).x, fPt(328, 434, 460).y], [290, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [306, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [D, igPt(IG_SAVE).x, igPt(IG_SAVE).y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, MX(1000), 640, 1.6], [20, MX(460), 330, 1.45], [60, MX(800), 380, 1.45], [250, MX(800), 420, 1.45], [280, MX(1000), 640, 1.6], [D, MX(1000), 640, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${IG_URL}?tab=zoom`} cur={cur} ripple={Math.max(rip(g, 30), rip(g, 54), rip(g, 302))} active="Integrations" chip={[3, g < 60 ? "Zoom → Add Zoom Account" : g < 206 ? "Account details from Zoom Marketplace" : g < 280 ? "Which locations can schedule with it" : "Save"]}
      over={g >= 308 ? <Toast g={g} at={308} text="Saved successfully" x={1150} y={110} /> : undefined}>
      <IgPage tab={1} testBtn={false} save={g >= 298 && g < 308}>
        <UB {...ADDZ} label="Add Zoom Account" icon="＋" fs={13.5} press={g >= 48 && g < 58} />
        {card && <div style={{ position: "absolute", left: 304, top: 248, width: 998, height: 290, borderRadius: 12, border: `1px solid ${LINE}`, background: "#FAFBFC", opacity: fi(g, 56, 8) }} />}
        {card && F.map((q) => <MInput key={q.l} x={q.x} y={q.y} w={460} label={q.l} value={typed(g, q.a, q.v, 0.7)} ph={q.ph} glow={g >= q.a - 4 && g < q.a + 26} />)}
        {card && <IgBranches x={328} y={434} w={460} vals={brs} glow={g >= 210 && g < 250} />}
        {card && <IgActive x={816} y={470} on={interpolate(g, [252, 260], [0, 1], cl)} />}
      </IgPage>
    </FStage>
  );
};

// ═══ i4 — SendGrid senders + Twilio numbers ═══════════════════════════════════
const SceneMsgIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const tw2 = g >= 190;
  const tab = tw2 ? 3 : 2;
  const chips = (arr: string[], a: number) => arr.filter((_, i) => g >= a + i * 18);
  const pts: P3[] = [[0, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [22, igTabPt(2).x, igTabPt(2).y], [32, igTabPt(2).x, igTabPt(2).y], [50, fPt(304, 196, 640).x, fPt(304, 196, 640).y], [96, fPt(304, 196, 640).x, fPt(304, 196, 640).y], [110, fPt(304, 282, 640).x, fPt(304, 282, 640).y], [150, fPt(304, 282, 640).x, fPt(304, 282, 640).y], [176, igTabPt(3).x, igTabPt(3).y], [190, igTabPt(3).x, igTabPt(3).y], [206, fPt(304, 196, 640).x, fPt(304, 196, 640).y], [236, fPt(304, 196, 640).x, fPt(304, 196, 640).y], [246, fPt(304, 282, 640).x, fPt(304, 282, 640).y], [276, fPt(304, 282, 640).x, fPt(304, 282, 640).y], [290, fPt(304, 368, 640).x, fPt(304, 368, 640).y], [330, fPt(304, 368, 640).x, fPt(304, 368, 640).y], [356, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [370, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [D, igPt(IG_SAVE).x, igPt(IG_SAVE).y]];
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, MX(1000), 640, 1.6], [20, MX(460), 330, 1.45], [44, MX(640), 320, 1.55], [170, MX(500), 330, 1.45], [200, MX(640), 340, 1.55], [340, MX(800), 500, 1.4], [D, MX(800), 500, 1.4]];
  const Chips: React.FC<{ y: number; label: string; vals: string[]; ph: string; glow: boolean }> = ({ y, label, vals, ph, glow }) => <div style={{ position: "absolute", left: 304, top: y, width: 640 }}><div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 7 }}>{label}</div><div style={{ height: 40, borderRadius: 8, border: `1px solid ${glow ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: glow ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", gap: 6, padding: "0 10px", boxSizing: "border-box" }}>{vals.length ? vals.map((v) => <Pill key={v} t={v} tone="gray" />) : <span style={{ fontSize: 14, color: "#9CA3AF" }}>{ph}</span>}</div></div>;
  return (
    <FStage g={g} keys={keys} url={`${IG_URL}?tab=${tw2 ? "twilio" : "sendgrid"}`} cur={cur} ripple={Math.max(rip(g, 28), rip(g, 186), rip(g, 366))} active="Integrations" chip={[4, !tw2 ? "SendGrid · verified sender emails" : g < 340 ? "Twilio · SMS sender numbers" : "Save"]}
      over={g >= 372 ? <Toast g={g} at={372} text="Saved successfully" x={1150} y={110} /> : undefined}>
      <IgPage tab={tab} save={g >= 364 && g < 374}>
        {!tw2 ? (<>
          <MInput x={304} y={196} w={640} label="API Key" value={mask(typed(g, 52, "SG.n7Qp2xKw.Lm9v4Tb8Yz", 1))} ph="Enter API Key" glow={g >= 50 && g < 100} />
          <Chips y={282} label="Sender Emails" vals={chips(["hello@learnbrightpath.com", "admissions@learnbrightpath.com"], 114)} ph="Add sender emails" glow={g >= 110 && g < 156} />
          <IgBranches x={304} y={368} w={640} vals={["Downtown", "Eastside", "Northgate"]} />
          <IgActive x={304} y={462} on={1} />
        </>) : (<>
          <MInput x={304} y={196} w={640} label="Account SID" value={typed(g, 208, "AC4f2e9b17d3c6a8", 0.8)} ph="Enter Account SID" glow={g >= 206 && g < 240} />
          <MInput x={304} y={282} w={640} label="Auth Token" value={g >= 250 ? "••••••••••••••••••••" : ""} ph="Enter Auth Token" glow={g >= 246 && g < 280} />
          <Chips y={368} label="Sender Numbers" vals={chips(["+1 555 014 2200", "+1 555 014 2201"], 294)} ph="Add sender numbers" glow={g >= 290 && g < 334} />
          <IgBranches x={304} y={454} w={640} vals={["Downtown", "Eastside"]} />
          <IgActive x={304} y={548} on={1} />
        </>)}
      </IgPage>
    </FStage>
  );
};

// ═══ i5 — Payment Methods → Stripe ═══════════════════════════════════════════
const ScenePayIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 390;
  const g = gt(f, dur, D);
  const pay = g < 120 ? Math.min(3, Math.max(0, Math.floor((g - 40) / 20))) : 2;
  const brs = brPick(g, 220);
  const pts: P3[] = [[0, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [24, igTabPt(5).x, igTabPt(5).y], [34, igTabPt(5).x, igTabPt(5).y]];
  [0, 1, 2, 3].forEach((k) => pts.push([40 + k * 20, igPayPt(k).x, igPayPt(k).y], [52 + k * 20, igPayPt(k).x, igPayPt(k).y]));
  pts.push([114, igPayPt(2).x, igPayPt(2).y], [124, igPayPt(2).x, igPayPt(2).y], [146, fPt(304, 246, 640).x, fPt(304, 246, 640).y], [180, fPt(304, 246, 640).x, fPt(304, 246, 640).y], [190, fPt(304, 332, 640).x, fPt(304, 332, 640).y], [214, fPt(304, 332, 640).x, fPt(304, 332, 640).y], [222, fPt(304, 418, 640).x, fPt(304, 418, 640).y], [262, fPt(304, 418, 640).x, fPt(304, 418, 640).y], [300, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [316, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [D, igPt(IG_SAVE).x, igPt(IG_SAVE).y]);
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, MX(1000), 640, 1.6], [20, MX(300), 480, 1.7], [124, MX(300), 480, 1.7], [140, MX(640), 380, 1.5], [270, MX(640), 420, 1.5], [290, MX(1000), 640, 1.6], [D, MX(1000), 640, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${IG_URL}?tab=paymentMethods`} cur={cur} ripple={Math.max(rip(g, 30), rip(g, 120), rip(g, 312))} active="Integrations" chip={[5, g < 124 ? "Payment Methods · PayPal · Square · Stripe · Custom" : g < 290 ? "Stripe · choose which locations take cards" : "Save"]}
      over={g >= 318 ? <Toast g={g} at={318} text="Saved successfully" x={1150} y={110} /> : undefined}>
      <IgPage tab={5} pay={pay} testBtn={g >= 124} save={g >= 308 && g < 318}>
        {g >= 124 && <div style={{ opacity: fi(g, 124, 8) }}>
          <div style={{ position: "absolute", left: 304, top: 194, width: 998, fontSize: 13, color: GRAY }}>This integration allows you to connect your Stripe account with our platform. Please enter your secret key and select the branches you want to integrate with.</div>
          <MInput x={304} y={246} w={640} label="Title" value={typed(g, 150, "Brightpath card payments", 0.8)} ph="Enter title" glow={g >= 146 && g < 186} />
          <MInput x={304} y={332} w={640} label="Secret Key:" value={mask(typed(g, 192, "sk_live_51Hq8vZ2kLm4", 1.2))} ph="Enter Secret Key" glow={g >= 190 && g < 218} />
          <IgBranches x={304} y={418} w={640} vals={brs} glow={g >= 220 && g < 266} />
          <IgActive x={304} y={512} on={interpolate(g, [268, 276], [0, 1], cl)} />
        </div>}
      </IgPage>
    </FStage>
  );
};

// ═══ i6 — Check connections → broken Twilio → fix → Test connection ══════════
const SceneHealthIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const checked = g >= 56;
  const onTw = g >= 120;
  const fixed = g >= 256;
  const CH = igPt(IG_CHK);
  const AT = fPt(304, 300, 640);
  const cur = path(g, [[0, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [30, CH.x, CH.y], [48, CH.x, CH.y], [96, igTabPt(3).x, igTabPt(3).y], [114, igTabPt(3).x, igTabPt(3).y], [150, MX(700), MY(230)], [190, AT.x, AT.y], [226, AT.x, AT.y], [246, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [258, igPt(IG_SAVE).x, igPt(IG_SAVE).y], [290, igPt(IG_TEST).x, igPt(IG_TEST).y], [304, igPt(IG_TEST).x, igPt(IG_TEST).y], [D, igPt(IG_TEST).x, igPt(IG_TEST).y]]);
  const keys: CamKey[] = [[0, MX(1000), 640, 1.6], [24, CH.x - 160, 150, 1.9], [60, MX(300), 360, 1.6], [120, MX(300), 360, 1.6], [140, MX(700), 300, 1.5], [236, MX(700), 360, 1.5], [250, MX(1000), 640, 1.6], [D, MX(1000), 640, 1.6]];
  return (
    <FStage g={g} keys={keys} url={`${IG_URL}?tab=${onTw ? "twilio" : "chatgpt"}`} cur={cur} ripple={Math.max(rip(g, 44), rip(g, 110), rip(g, 256), rip(g, 300))} active="Integrations" chip={[6, !checked ? "Check connections" : !onTw ? "A red dot flags a connection issue" : g < 240 ? "Connection needs attention · update it" : g < 290 ? "Save" : "Test connection"]}
      over={<>{g >= 262 && g < 300 && <Toast g={g} at={262} text="Saved successfully" x={1150} y={110} />}{g >= 308 && <Toast g={g} at={308} text="Twilio connection verified" x={1120} y={110} />}</>}>
      <IgPage tab={onTw ? 3 : 0} chkPress={g >= 40 && g < 50} broken={checked && g < 308 ? [3] : []} note={onTw && g < 308 ? "Twilio" : undefined} save={g >= 252 && g < 262} test={g >= 298 && g < 308}>
        {onTw ? (<>
          <MInput x={304} y={300} w={640} label="Auth Token" value={g >= 196 ? "••••••••••••••••••••" : "••••••••••••"} ph="Enter Auth Token" glow={g >= 186 && g < 232} />
          <MInput x={304} y={386} w={640} label="Account SID" value="AC4f2e9b17d3c6a8" />
          <IgBranches x={304} y={472} w={640} vals={["Downtown", "Eastside"]} />
        </>) : (<>
          <MInput x={304} y={196} w={640} label="API Key" value="sk-pr••••••••••••••••••" />
          <IgBranches x={304} y={282} w={640} vals={["Downtown", "Eastside", "Northgate"]} />
          <MInput x={304} y={368} w={640} label="Select Model" value="GPT-4o mini" select />
        </>)}
      </IgPage>
    </FStage>
  );
};

// ═══ i7 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 220;
  const g = gt(f, dur, D);
  return <WrapCards g={g} fps={fps} D={D} steps={[["✨", "ChatGPT", "Your key, your model"], ["🎥", "Zoom · Vimeo", "Classes and videos"], ["✉", "SendGrid · Twilio", "Email and SMS"], ["💳", "Payments", "Stripe · PayPal · Square"], ["✅", "Health", "Test every connection"]]} line={<>Your accounts. <span style={{ color: "#5EEAD4" }}>One place.</span></>} />;
};

// ═══ i6b — every connection is set per location ══════════════════════════════
const SceneLocIG: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 370;
  const g = gt(f, dur, D);
  const PROV: [string, string][] = [["✨", "ChatGPT"], ["🎥", "Zoom"], ["✉", "SendGrid"], ["💬", "Twilio"], ["💳", "Stripe"], ["🅿", "PayPal"], ["▣", "Square"]];
  const LOC: [string, string[], number][] = [["Downtown", ["ChatGPT", "Zoom", "SendGrid", "Stripe"], 70], ["Eastside", ["ChatGPT", "Twilio", "PayPal"], 150], ["Northgate", ["Zoom", "SendGrid", "Square"], 230]];
  const px = (i: number) => 230 + i * 245, py = 290;
  const lx = (j: number) => 360 + j * 600, ly = 700;
  const act = LOC.findIndex(([, , at], j) => g >= at && g < (LOC[j + 1]?.[2] ?? 999));
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: Math.min(fi(g, 0, 10), fo(g, D - 8, 8)) }}>
        <HookLine g={g} at={4} top={70} size={52}>Every connection, <span style={{ color: "#5EEAD4" }}>set per location</span>.</HookLine>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {LOC.map(([n, ps, at], j) => ps.map((p) => { const i = PROV.findIndex((q) => q[1] === p); const o = interpolate(g, [at + 10, at + 30], [0, 1], cl); return <path key={n + p} d={`M ${px(i) + 90} ${py + 150} C ${px(i) + 90} ${py + 260}, ${lx(j) + 150} ${ly - 120}, ${lx(j) + 150} ${ly}`} fill="none" stroke={j === act ? "#5EEAD4" : "#5EEAD466"} strokeWidth={j === act ? 4 : 2.5} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - o} opacity={o > 0 ? 1 : 0} />; }))}
        </svg>
        {PROV.map(([ic, n], i) => { const used = LOC.some(([, ps, at]) => ps.includes(n) && g >= at + 20); const hl = act >= 0 && LOC[act][1].includes(n); return <div key={n} style={{ position: "absolute", left: px(i), top: py, width: 180, height: 150, borderRadius: 18, background: "#fff", border: `3px solid ${hl ? "#14B8A6" : "transparent"}`, boxShadow: hl ? "0 0 40px #14B8A688" : "0 18px 40px #0008", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: sp(g, 10 + i * 5, fps) * (used || hl ? 1 : 0.75), boxSizing: "border-box" }}><span style={{ fontSize: 40 }}>{ic}</span><span style={{ fontSize: 21, fontWeight: 900, color: INK }}>{n}</span></div>; })}
        {LOC.map(([n, ps, at], j) => <div key={n} style={{ position: "absolute", left: lx(j), top: ly, width: 300, padding: "20px 22px", borderRadius: 20, background: j === act ? "#0F766E" : "#111827", border: `2px solid ${j === act ? "#5EEAD4" : "#334155"}`, boxSizing: "border-box", opacity: sp(g, at - 10, fps), transform: `scale(${j === act ? 1.05 : 1})` }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#94A3B8", letterSpacing: 2 }}>📍 LOCATION</div>
          <div style={{ marginTop: 4, fontSize: 28, fontWeight: 900, color: "#fff" }}>Brightpath — {n}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>{ps.map((p, k) => <span key={p} style={{ fontSize: 15, fontWeight: 800, padding: "5px 12px", borderRadius: 999, background: "#ffffff22", color: "#F1F5F9", opacity: fi(g, at + 20 + k * 6, 6) }}>✓ {p}</span>)}</div>
        </div>)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontSize: 30, fontWeight: 700, color: "#CBD5E1", opacity: fi(g, 300, 10) }}>Integrations → each panel → <b style={{ color: "#5EEAD4" }}>Branches</b></div>
      </AbsoluteFill>
    </Stage>
  );
};
