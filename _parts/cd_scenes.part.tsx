// ═══════════════════════════════════════════════════════════════════════════
// Custom Domain — scenes (sheet serial 15). Real UI: SB-Company website-builder/page.tsx
//   card "⚙ Set up" → GlobalModal "Domain setup" (+ domain status badge):
//   "Connect a main custom domain. SkillBNK creates landing, learner, branch, and company
//    hostnames and tracks each one separately." · Free SkillBNK domains · input "customer.com"
//   · DNS instructions rows [Landing CNAME @ landing.skillbnk.com] [Learner portal CNAME learner
//     learner.skillbnk.com] [Branch portal CNAME branch branch.skillbnk.com] [Company admin CNAME
//     company company.skillbnk.com] + copy · "DNS changes can take a few minutes, and sometimes up
//     to 24 hours, depending on the registrar. Click Verify after propagation."
//   · after Save: "Cloudflare hostname and SSL verification" · "SkillBNK creates separate Cloudflare
//     custom hostnames for landing, learner, branch, and company. Each hostname can become active at
//     a different time." · per hostname: Host <status> · SSL <status> · SSL TXT records (copy)
//   · status messages (pending / active) · footer Disconnect · Verify (Checking…) · Cancel · Save domain
//   · toasts "Copied", "Custom domain setup started", "All custom domains are active".
// ═══════════════════════════════════════════════════════════════════════════
/** video caption (not product UI): points at what the viewer should notice */
const Callout: React.FC<{ o: number; text: string; x: number; y: number; c?: string }> = ({ o, text, x, y, c = "#F97316" }) =>
  o > 0.01 ? (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 12}px)`, zIndex: 60, padding: "14px 22px", borderRadius: 14, background: "rgba(4,6,13,0.9)", border: `2px solid ${c}`, color: "#F1F5F9", fontSize: 30, fontWeight: 800, fontFamily: FONT, boxShadow: `0 0 40px ${c}55` }}>{text}</div>
  ) : null;


const HOSTS = [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]];
const DNS_ROWS = [["Landing", "CNAME", "@", "landing.skillbnk.com"], ["Learner portal", "CNAME", "learner", "learner.skillbnk.com"], ["Branch portal", "CNAME", "branch", "branch.skillbnk.com"], ["Company admin", "CNAME", "company", "company.skillbnk.com"]];
const MOD = { x: 330, y: 20, w: 940 };
const StatusPill: React.FC<{ t: string; on: boolean }> = ({ t, on }) => (
  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 999, border: `1px solid ${on ? "#BBF7D0" : "#FDE68A"}`, background: on ? "#F0FDF4" : "#FEFCE8", color: on ? "#15803D" : "#A16207" }}>{t} {on ? "active" : "pending"}</span>
);
/** the Domain setup modal — every block absolutely placed (fixed layout) so the cursor can hit
 *  exact targets. Content scrolls by `scroll` px. Helpers below give content-coord targets. */
const DM = { title: 0, intro: 36, free: 92, label: 204, input: 230, hint: 282, status: 308 };
const dnsTop = (saved: boolean) => (saved ? 380 : 312);
const verTop = (saved: boolean) => dnsTop(saved) + 316;
const DNS_ROW0 = 74;   // first DNS row top, inside the DNS box
const DNS_ROW_H = 44;
const HOST_ROW0 = 92;  // first hostname card top, inside the verification box
const HOST_H = 100;
/** content-coord centre of DNS row i's copy icon / hostname card i, for a given scroll */
const dnsCopyPt = (i: number, scroll: number, saved = false) => ({ x: MOD.x + MOD.w - 28 - 38, y: MOD.y + 22 - scroll + dnsTop(saved) + DNS_ROW0 + i * DNS_ROW_H + 19 });
const hostPt = (i: number, scroll: number) => ({ x: MOD.x + MOD.w / 2, y: MOD.y + 22 - scroll + verTop(true) + HOST_ROW0 + i * HOST_H + 40 });
const DomainModal: React.FC<{ g: number; domain: string; showDns: boolean; saved: boolean; active: number; scroll: number; copyIdx?: number; pressSave?: boolean; pressVerify?: boolean; checking?: boolean }> = ({ g, domain, showDns, saved, active, scroll, copyIdx = -1, pressSave, pressVerify, checking }) => {
  const on = active > 0.5;
  const IW = MOD.w - 56;
  const dT = dnsTop(saved);
  const vT = verTop(saved);
  const abs = (top: number, h: number, extra: React.CSSProperties = {}) => ({ position: "absolute" as const, left: 0, top, width: IW, height: h, ...extra });
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 40 }}>
      <div style={{ position: "absolute", left: MOD.x, top: MOD.y, width: MOD.w, height: 815, borderRadius: 16, background: "#fff", overflow: "hidden", boxShadow: "0 30px 80px #0007" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: MOD.w, height: 735, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 28, top: 22 - scroll, width: IW, height: 1400 }}>
            <div style={{ ...abs(DM.title, 30), display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: INK }}>Domain setup</span>
              {saved && <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: on ? "#DCFCE7" : "#FEF9C3", color: on ? "#15803D" : "#A16207" }}>{on ? "active" : "pending"}</span>}
            </div>
            <div style={{ ...abs(DM.intro, 46), fontSize: 14, color: GRAY, lineHeight: "22px" }}>Connect a main custom domain. SkillBNK creates landing, learner, branch, and company hostnames and tracks each one separately.</div>
            <div style={{ ...abs(DM.free, 96), borderRadius: 10, border: `1px solid ${LINE}`, background: "#F8FAFC", padding: 12, boxSizing: "border-box" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>FREE SKILLBNK DOMAINS</div>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{[["Landing", `${SLUG}.skillbnk.com`], ["Learner portal", `${SLUG}.learner.skillbnk.com`], ["Branch portal", `${SLUG}.branch.skillbnk.com`], ["Company admin", `${SLUG}.company.skillbnk.com`]].map(([a, b]) => <div key={a} style={{ fontSize: 12.5, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 7, padding: "5px 8px", whiteSpace: "nowrap", overflow: "hidden" }}><b style={{ color: "#475569" }}>{a}</b> <span style={{ fontFamily: "monospace", color: INK }}>{b}</span></div>)}</div>
            </div>
            <div style={{ ...abs(DM.label, 22), fontSize: 14.5, fontWeight: 700, color: "#374151" }}>Main custom landing domain</div>
            <div style={{ ...abs(DM.input, 46), borderRadius: 8, border: `1px solid ${domain && !showDns ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: domain && !showDns ? "0 0 0 3px #C7D2FE" : "none", display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box", fontSize: 16, fontFamily: "monospace", color: domain ? INK : "#9CA3AF" }}>{domain || "customer.com"}</div>
            <div style={{ ...abs(DM.hint, 20), fontSize: 12.5, color: GRAY }}>Do not include https:// or a path.</div>
            {saved && <div style={{ ...abs(DM.status, 58), padding: "9px 14px", boxSizing: "border-box", borderRadius: 9, border: `1px solid ${on ? "#BBF7D0" : "#BFDBFE"}`, background: on ? "#F0FDF4" : "#EFF6FF", color: on ? "#166534" : "#1E40AF", fontSize: 13.5, fontWeight: 600, lineHeight: "20px" }}>{on ? "Landing and portal domains are active." : "Domain setup is pending. Complete the DNS records below, wait a few minutes for propagation, then click Verify."}</div>}
            {showDns && (
              <div style={{ ...abs(dT, 300), borderRadius: 12, border: `1px solid ${LINE}`, boxSizing: "border-box" }}>
                <div style={{ position: "absolute", left: 14, top: 14, fontSize: 15.5, fontWeight: 800, color: INK }}>DNS instructions</div>
                <div style={{ position: "absolute", left: 24, top: 50, display: "flex", fontSize: 12, fontWeight: 800, color: GRAY, letterSpacing: 0.5 }}><span style={{ width: 150 }}>HOSTNAME</span><span style={{ width: 90 }}>TYPE</span><span style={{ width: 110 }}>NAME</span><span>VALUE</span></div>
                {DNS_ROWS.map(([l, ty, n, v], i) => (
                  <div key={l} style={{ position: "absolute", left: 14, right: 14, top: DNS_ROW0 + i * DNS_ROW_H, height: 38, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 8, background: copyIdx === i ? "#EEF2FF" : "#F8FAFC", border: `1px solid ${copyIdx === i ? "#A5B4FC" : LINE}`, fontSize: 14, boxSizing: "border-box" }}>
                    <span style={{ width: 150, fontWeight: 700, color: "#374151" }}>{l}</span>
                    <span style={{ width: 90 }}><span style={{ padding: "2px 8px", borderRadius: 6, background: "#E0E7FF", color: BLUE, fontWeight: 800, fontSize: 12 }}>{ty}</span></span>
                    <span style={{ width: 110, fontFamily: "monospace", color: INK }}>{n}</span>
                    <span style={{ flex: 1, fontFamily: "monospace", color: INK }}>{v}</span>
                    <span style={{ width: 22, textAlign: "center", fontSize: 16, color: copyIdx === i ? BLUE : "#94A3B8" }}>⧉</span>
                  </div>
                ))}
                <div style={{ position: "absolute", left: 14, right: 14, top: DNS_ROW0 + 4 * DNS_ROW_H + 8, fontSize: 12.5, color: GRAY, lineHeight: "19px" }}>DNS changes can take a few minutes, and sometimes up to 24 hours, depending on the registrar. Click Verify after propagation.</div>
              </div>
            )}
            {saved && (
              <div style={{ ...abs(vT, HOST_ROW0 + 4 * HOST_H + 10), borderRadius: 12, border: `1px solid ${LINE}`, boxSizing: "border-box" }}>
                <div style={{ position: "absolute", left: 14, top: 14, fontSize: 15.5, fontWeight: 800, color: INK }}>Cloudflare hostname and SSL verification</div>
                <div style={{ position: "absolute", left: 14, right: 14, top: 40, fontSize: 12.5, color: GRAY, lineHeight: "18px" }}>SkillBNK creates separate Cloudflare custom hostnames for landing, learner, branch, and company. Each hostname can become active at a different time.</div>
                {HOSTS.map(([l, h], i) => {
                  const a = active > 0.2 + i * 0.18;
                  return (
                    <div key={l} style={{ position: "absolute", left: 14, right: 14, top: HOST_ROW0 + i * HOST_H, height: HOST_H - 10, borderRadius: 10, border: `1px solid ${a ? "#BBF7D0" : LINE}`, background: a ? "#F7FEF9" : "#fff", padding: 10, boxSizing: "border-box" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 800, color: INK }}>{l}</div><div style={{ fontSize: 12.5, fontFamily: "monospace", color: GRAY }}>{h}</div></div>
                        <StatusPill t="Host" on={a} /><StatusPill t="SSL" on={a} />
                      </div>
                      {!a && <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, background: "#F8FAFC", borderRadius: 7, padding: "6px 8px" }}><span style={{ fontWeight: 800, color: "#374151" }}>SSL TXT</span><span style={{ flex: 1, fontFamily: "monospace", color: GRAY, filter: "blur(2.5px)" }}>_acme-challenge.{h} · 9f2c4e1a7b…</span><span style={{ color: "#94A3B8" }}>⧉</span></div>}
                      {a && <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "#15803D" }}>✓ Hostname and certificate active</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: MOD.w, height: 80, borderTop: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "0 28px", boxSizing: "border-box" }}>
          {saved && <span style={{ width: 110, textAlign: "center", padding: "10px 0", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: INK }}>Disconnect</span>}
          {saved && <span style={{ width: 100, textAlign: "center", padding: "10px 0", borderRadius: 8, border: `1px solid ${pressVerify ? BLUE : LINE}`, fontSize: 14, fontWeight: 700, color: pressVerify ? BLUE : INK, transform: `scale(${pressVerify ? 0.93 : 1})` }}>{checking ? "Checking…" : "Verify"}</span>}
          <span style={{ width: 90, textAlign: "center", padding: "10px 0", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 14, fontWeight: 700, color: INK }}>Cancel</span>
          <span style={{ width: 130, textAlign: "center", padding: "10px 0", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 700, transform: `scale(${pressSave ? 0.93 : 1})` }}>Save domain</span>
        </div>
      </div>
    </div>
  );
};
// footer button centres (content coords): [Disconnect 110][Verify 100][Cancel 90][Save domain 130], gap 10, right pad 28
const BTN_SAVE = { x: MOD.x + MOD.w - 28 - 65, y: MOD.y + 815 - 40 };
const BTN_VERIFY = { x: MOD.x + MOD.w - 28 - 130 - 10 - 90 - 10 - 50, y: MOD.y + 815 - 40 };
const CardPage: React.FC<{ children?: React.ReactNode; custom?: boolean; status?: "pending" | "active"; pressSetup?: boolean; pressVisit?: boolean; pressCopy?: number }> = ({ custom = false, status, pressSetup, pressVisit, pressCopy }) => (
  <>
    <PageTitle t="Website Builder" sub="Build and publish your company website" />
    <Btn x={1180} y={24} w={150} h={42} label="+ New Website" primary fs={14.5} />
    <SiteCard custom={custom} status={status} pressSetup={pressSetup} pressVisit={pressVisit} pressCopy={pressCopy} hl={custom ? 1 : 0} />
  </>
);
// card geometry in content coords
const CARD_SETUP = { x: MX(20 + 640 - 62), y: MY(90 + 35) };
const CARD_VISIT = { x: MX(20 + 20 + 90 + 50), y: MY(90 + 470 - 34) };

// ═══ d0 — HOOK ═══════════════════════════════════════════════════════════════
const SceneHookCD: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const flip = g >= 120;
  const typedNew = typed(g, 125, DOMAIN, 0.9);
  const del = interpolate(g, [100, 120], [1, 0], cl);
  const old = "brightpath-academy.someplatform.io/school/48213";
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 260, top: 300, width: 1400, height: 130, borderRadius: 26, background: "#fff", boxShadow: "0 40px 100px #000C", display: "flex", alignItems: "center", gap: 22, padding: "0 40px", opacity: sp(g, 4, fps), transform: `scale(${0.95 + 0.05 * sp(g, 4, fps)})` }}>
          <span style={{ fontSize: 44, color: flip ? "#16A34A" : "#94A3B8" }}>🔒</span>
          <span style={{ fontSize: 50, fontFamily: "monospace", fontWeight: 700, color: flip ? INK : "#64748B", whiteSpace: "nowrap", overflow: "hidden" }}>{flip ? typedNew : old.slice(0, Math.ceil(old.length * del))}<span style={{ color: BLUE }}>|</span></span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}>
          <div style={{ fontSize: 50, fontWeight: 800, color: "#FCA5A5", opacity: fi(g, 20, 12) * (flip ? 0.35 : 1) }}>Still sending learners to someone else's address?</div>
          <div style={{ marginTop: 18, fontSize: 56, fontWeight: 900, color: "#F1F5F9", opacity: fi(g, 160, 12) }}>Use <span style={{ color: "#5EEAD4" }}>your own domain.</span> Step by step.</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ d1 — card: free domains → Set up ═══════════════════════════════════════
const SceneCardSetup: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const cur = path(g, [[0, 900, 700], [60, MX(360), MY(330)], [170, MX(360), MY(420)], [230, CARD_SETUP.x, CARD_SETUP.y], [262, CARD_SETUP.x, CARD_SETUP.y], [300, CARD_SETUP.x, CARD_SETUP.y]]);
  // zoom: card → the 4 free domains (slow pan down the list) → the Set up button
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [40, MX(340), MY(250), 1.45], [80, MX(340), MY(330), 1.9], [180, MX(340), MY(380), 1.9], [220, MX(560), MY(140), 2.1], [300, MX(560), MY(140), 2.1]];
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={rip(g, 256)}>
      <CardPage pressSetup={g >= 256 && g < 264} pressCopy={g >= 100 && g < 180 ? Math.min(3, Math.floor((g - 100) / 20)) : -1} />
      <Callout o={g >= 90 && g < 210 ? Math.min(fi(g, 90, 10), fo(g, 200, 10)) : 0} text="Free addresses for your site + every portal" x={MX(700)} y={MY(260)} c="#14B8A6" />
    </CoStage>
  );
};

// ═══ d2 — type domain → DNS instructions → copy each record → Save domain ═══
const SceneDnsRecords: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 520;
  const g = gt(f, dur, D);
  const domain = typed(g, 70, DOMAIN, 0.9);
  const showDns = g >= 100;
  const scroll = interpolate(g, [120, 160], [0, 300], cl);
  const copyIdx = g >= 200 && g < 420 ? Math.min(3, Math.floor((g - 200) / 50)) : -1;
  const saved = false;
  const INPUT = { x: MOD.x + 300, y: MOD.y + 22 + DM.input + 23 };
  const pts: P3[] = [[0, 900, 600], [40, INPUT.x, INPUT.y], [110, INPUT.x, INPUT.y]];
  for (let i = 0; i < 4; i++) { const c = dnsCopyPt(i, 300); pts.push([190 + i * 50, c.x, c.y]); pts.push([205 + i * 50, c.x, c.y]); }
  pts.push([450, BTN_SAVE.x, BTN_SAVE.y], [480, BTN_SAVE.x, BTN_SAVE.y], [520, BTN_SAVE.x, BTN_SAVE.y]);
  const cur = path(g, pts);
  const r0 = dnsCopyPt(0, 300), r3 = dnsCopyPt(3, 300);
  const ripple = Math.max(rip(g, 50), ...[0, 1, 2, 3].map((i) => rip(g, 203 + i * 50)), rip(g, 476));
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MOD.x + 330, MOD.y + 180, 1.55], [110, MOD.x + 330, MOD.y + 230, 1.7], [170, MOD.x + 470, 470, 1.25], [190, r0.x - 330, r0.y + 30, 1.75], [420, r3.x - 330, r3.y - 30, 1.75], [450, MOD.x + 700, BTN_SAVE.y - 60, 1.9], [520, MOD.x + 700, BTN_SAVE.y - 60, 1.9]];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url="company.skillbnk.com/website-builder">
          <CoShell><CardPage /></CoShell>
          <DomainModal g={g} domain={domain} showDns={showDns} saved={saved} active={0} scroll={scroll} copyIdx={copyIdx} pressSave={g >= 476 && g < 484} />
          {[0, 1, 2, 3].map((i) => (g >= 205 + i * 50 && g < 235 + i * 50 ? <Toast key={i} g={g} at={205 + i * 50} text="Copied" x={1180} y={70} /> : null))}
          {g >= 484 && <Toast g={g} at={484} text="Custom domain setup started" x={1080} y={70} />}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d3 — at your domain registrar: add the 4 CNAME records ═════════════════
const SceneRegistrar: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const rows = DNS_ROWS.map(([l, ty, n, v]) => [ty, n, v]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 800, 330, 1.35], [300, 800, 420, 1.35], [330, 800, 420, 1.35]];
  return (
    <Stage>
      <PortalTag n={2} label="Your domain registrar" url="DNS settings" />
      <CamC g={g} keys={keys}>
        <Browser url="your-registrar.com/dns/learnbrightpath.com">
          <div style={{ position: "absolute", inset: 0, background: "#F8FAFC" }}>
            <div style={{ height: 64, background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", padding: "0 32px", gap: 14 }}><div style={{ width: 34, height: 34, borderRadius: 8, background: "#CBD5E1" }} /><span style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>Your registrar</span><span style={{ marginLeft: 24, fontSize: 15, color: GRAY }}>Domains › {DOMAIN} › DNS</span></div>
            <div style={{ position: "absolute", left: 80, top: 110, width: 1440 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>DNS records · {DOMAIN}</div>
              <div style={{ marginTop: 6, fontSize: 15, color: GRAY }}>Example screen — every registrar looks a little different.</div>
              <div style={{ marginTop: 24, borderRadius: 12, background: "#fff", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ display: "flex", padding: "14px 22px", background: "#F1F5F9", fontSize: 14, fontWeight: 800, color: "#475569" }}><span style={{ width: 160 }}>Type</span><span style={{ width: 260 }}>Name</span><span style={{ flex: 1 }}>Value / Target</span><span style={{ width: 120 }}>TTL</span></div>
                {rows.map(([ty, n, v], i) => {
                  const at = 40 + i * 60;
                  const o = fi(g, at, 10);
                  const val = typed(g, at + 8, v, 1.2);
                  return (
                    <div key={n} style={{ display: "flex", alignItems: "center", padding: "18px 22px", borderTop: "1px solid #E2E8F0", fontSize: 18, opacity: o, background: g >= at && g < at + 50 ? "#F0FDFA" : "#fff" }}>
                      <span style={{ width: 160 }}><span style={{ padding: "4px 10px", borderRadius: 6, background: "#E0E7FF", color: BLUE, fontWeight: 800, fontSize: 14 }}>{ty}</span></span>
                      <span style={{ width: 260, fontFamily: "monospace", color: INK }}>{n}</span>
                      <span style={{ flex: 1, fontFamily: "monospace", color: INK }}>{val}</span>
                      <span style={{ width: 120, color: GRAY }}>Auto</span>
                    </div>
                  );
                })}
              </div>
              {g >= 290 && <div style={{ marginTop: 18, display: "inline-block", padding: "12px 18px", borderRadius: 10, background: "#ECFDF5", color: "#065F46", fontWeight: 700, fontSize: 16, opacity: fi(g, 290, 10) }}>✓ 4 records saved · propagation can take a few minutes, sometimes up to 24 hours</div>}
            </div>
          </div>
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d4 — back in skillBNK: pending status + per-hostname SSL TXT records ═══
const ScenePending: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 360;
  const g = gt(f, dur, D);
  const scroll = interpolate(g, [40, 120, 200, 300], [0, 240, 240, 640], cl);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, MOD.x + 330, MOD.y + 330, 1.6], [150, MOD.x + 330, MOD.y + 330, 1.6], [200, MOD.x + 470, 420, 1.4], [330, MOD.x + 470, 420, 1.4], [360, MOD.x + 470, 420, 1.4]];
  const cur = path(g, [[0, 900, 600], [360, MOD.x + 760, 520]]);
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url="company.skillbnk.com/website-builder">
          <CoShell><CardPage custom status="pending" /></CoShell>
          <DomainModal g={g} domain={DOMAIN} showDns saved active={0} scroll={scroll} />
          <Callout o={g >= 210 ? fi(g, 210, 10) : 0} text="Add these SSL TXT records too" x={MOD.x + MOD.w - 380} y={140} c="#F59E0B" />
          <Cursor x={cur.x} y={cur.y} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d5 — Verify → Checking… → every Host + SSL turns active ══════════════
const SceneVerifyDomain: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const active = interpolate(g, [90, 220], [0, 1], cl);
  const scroll = 640;
  const cur = path(g, [[0, MOD.x + 760, 520], [50, BTN_VERIFY.x, BTN_VERIFY.y], [70, BTN_VERIFY.x, BTN_VERIFY.y], [140, MOD.x + 600, 400], [330, MOD.x + 600, 400]]);
  const keys: CamKey[] = [[0, MOD.x + 470, 420, 1.4], [40, BTN_VERIFY.x - 100, BTN_VERIFY.y - 80, 1.9], [80, BTN_VERIFY.x - 100, BTN_VERIFY.y - 80, 1.9], [110, MOD.x + 470, 420, 1.4], [240, MOD.x + 470, 420, 1.4], [280, MOD.x + 330, 200, 1.6], [330, MOD.x + 330, 200, 1.6]];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url="company.skillbnk.com/website-builder">
          <CoShell><CardPage custom status={active > 0.95 ? "active" : "pending"} /></CoShell>
          <DomainModal g={g} domain={DOMAIN} showDns saved active={active} scroll={g >= 250 ? interpolate(g, [250, 275], [scroll, 300], cl) : scroll} pressVerify={g >= 64 && g < 90} checking={g >= 64 && g < 90} />
          {g >= 225 && <Toast g={g} at={225} text="All custom domains are active" x={1080} y={70} />}
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 64)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ d6 — card shows Custom domains → Visit → live on your domain ══════════
const SceneLive: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 430;
  const g = gt(f, dur, D);
  const site = g >= 170;
  const cur = path(g, [[0, 900, 600], [60, MX(360), MY(330)], [130, CARD_VISIT.x, CARD_VISIT.y], [160, CARD_VISIT.x, CARD_VISIT.y], [330, 900, 600]]);
  const keys: CamKey[] = site ? [[0, WIDE_X, WIDE_Y, 1], [330, WIDE_X, WIDE_Y, 1]] : [[0, WIDE_X, WIDE_Y, 1], [30, MX(340), MY(300), 1.8], [110, MX(340), MY(360), 1.8], [140, MX(200), MY(500), 1.9], [170, MX(200), MY(500), 1.9]];
  if (site) {
    return (
      <Stage>
        <PortalTag n={3} label="Your website" url={DOMAIN} />
        <CamC g={g} keys={keys}>
          <Browser url={DOMAIN}>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 170, 10) }}><BrightSite g={g - 170} fps={fps} scroll={interpolate(g, [230, 410], [0, SITE_H - 856], cl)} hosts={g < 228} /></div>
          </Browser>
        </CamC>
      </Stage>
    );
  }
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={rip(g, 156)}>
      <CardPage custom status="active" pressVisit={g >= 156 && g < 164} />
    </CoStage>
  );
};

// ═══ d7 — WRAP ═══════════════════════════════════════════════════════════════
const SceneWrapCD: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["⚙", "Set up", "Enter your domain", "#2563EB"], ["📋", "Copy records", "4 CNAME records", "#7C3AED"], ["🌐", "Add at registrar", "Plus SSL TXT records", "#F59E0B"], ["✅", "Verify", "Every host + SSL active", "#22C55E"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 380, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 340, width: 1640, display: "flex", gap: 28 }}>
          {steps.map(([ic, t, s, c], i) => {
            const p = sp(g, 20 + i * 12, fps);
            return (
              <div key={t} style={{ flex: 1, height: 240, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${c}88`, boxShadow: `0 0 50px ${c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c }}>STEP {i + 1}</div>
                <div style={{ marginTop: 8, fontSize: 46 }}>{ic}</div>
                <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
                <div style={{ marginTop: 6, fontSize: 18, color: "#8A96B2" }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 80, 12) }}>
          Your domain. <span style={{ color: "#5EEAD4" }}>Every portal.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
