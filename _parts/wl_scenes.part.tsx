// ═══════════════════════════════════════════════════════════════════════════
// White-Label Training Platform — scenes. Real UI (SB-Company website-builder):
// page.tsx ("Website Builder" · "Build and publish your company website", New Website:
// Name / Slug (subdomain) / Page title / Description; "Free SkillBNK domains" → Landing,
// Learner portal, Branch portal, Company admin; "Domain setup": "Main custom landing domain",
// "Do not include https:// or a path.", DNS instructions, Hostname ownership TXT, SSL TXT
// records; with a custom domain → learner.<domain>, branch.<domain>, company.<domain>).
// BrandPanel.tsx tabs Colors / Type / Layout / Site SEO / CSS; Logos: Light logo, Dark logo,
// Favicon. sb-landing auth pages (login/register) apply brand logos + colors (useAuthContent).
// ═══════════════════════════════════════════════════════════════════════════
const BRAND = "Brightpath Academy";
const SLUG = "brightpath";
const DOMAIN = "learnbrightpath.com";
const BP = "#0F766E";  // brand primary (teal) set in the Brand panel
const BP_ACC = "#F59E0B";

const BrightLogo: React.FC<{ s?: number; dark?: boolean }> = ({ s = 1, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={38 * s} height={38 * s} viewBox="0 0 38 38"><rect width="38" height="38" rx="10" fill={BP} /><circle cx="19" cy="20" r="7" fill={BP_ACC} /><path d="M19 5v5M19 30v4M6 20h4M28 20h4M9.5 10.5l3 3M25.5 26.5l3 3M9.5 29.5l3-3M25.5 13.5l3-3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
    <div><div style={{ fontSize: 16 * s, fontWeight: 900, color: dark ? "#fff" : BP, letterSpacing: 0.6 }}>BRIGHTPATH</div><div style={{ fontSize: 10.5 * s, fontWeight: 600, color: dark ? "#CCFBF1" : GRAY }}>Academy</div></div>
  </div>
);

/** Brightpath Academy public website — every section of the page (built from Design-library
 *  blocks: Academy Hero, Logo Bar, Programs, Feature Grid, Testimonials, FAQ, Call to Action,
 *  footer). `scroll` moves the page; header stays fixed. Viewport = 1600 × 856 content. */
const SITE_H = 2600;
const BrightSite: React.FC<{ g: number; fps: number; scroll: number; pressSignIn?: boolean; hosts?: boolean }> = ({ g, fps, scroll, pressSignIn, hosts }) => {
  const sec = (title: string, sub: string) => (<><div style={{ fontSize: 15, fontWeight: 800, color: BP, letterSpacing: 2 }}>{sub}</div><div style={{ marginTop: 8, fontSize: 40, fontWeight: 900, color: "#0f172a" }}>{title}</div></>);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: "Poppins, " + FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -scroll, width: W, height: SITE_H }}>
        {/* hero */}
        <div style={{ position: "absolute", left: 0, top: 70, width: W, height: 620, background: `linear-gradient(135deg, ${BP}18, #fff 60%)` }}>
          <div style={{ position: "absolute", left: 90, top: 90, width: 760 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: `${BP_ACC}26`, color: "#92400E", fontSize: 15, fontWeight: 800 }}>Fall 2026 enrollment open</div>
            <div style={{ marginTop: 22, fontSize: 64, fontWeight: 900, color: "#0f172a", lineHeight: 1.08 }}>Launch your career<br />with <span style={{ color: BP }}>{BRAND}</span></div>
            <div style={{ marginTop: 20, fontSize: 20, color: "#475569", lineHeight: 1.5 }}>Career training for customer-service and sales teams. Learn online, join live classes, earn a certificate.</div>
            <div style={{ marginTop: 30, display: "flex", gap: 14 }}><span style={{ padding: "15px 30px", borderRadius: 12, background: BP, color: "#fff", fontWeight: 800, fontSize: 17 }}>Browse programs</span><span style={{ padding: "15px 30px", borderRadius: 12, border: `2px solid ${BP_ACC}`, color: "#0f172a", fontWeight: 800, fontSize: 17 }}>Talk to us</span></div>
          </div>
          <div style={{ position: "absolute", left: 930, top: 80, width: 580, height: 440, borderRadius: 28, background: `linear-gradient(160deg,${BP},#134E4A)`, boxShadow: "0 30px 60px #0F766E40" }}>
            {[["Online", "Learn at your pace"], ["Live classes", "Weekly with coaches"], ["Certificates", "Show your skills"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 40 + (i % 2) * 260, top: 50 + i * 120, width: 240, padding: 16, borderRadius: 16, background: "#fff", boxShadow: "0 10px 30px #0003" }}><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{a}</div><div style={{ fontSize: 14, color: GRAY }}>{b}</div></div>)}
          </div>
        </div>
        {/* logo bar / stats */}
        <div style={{ position: "absolute", left: 0, top: 690, width: W, height: 140, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[["1,200+", "learners trained"], ["3", "campuses"], ["24", "programs"], ["4.8★", "learner rating"]].map(([a, b]) => <div key={b} style={{ textAlign: "center" }}><div style={{ fontSize: 40, fontWeight: 900, color: BP }}>{a}</div><div style={{ fontSize: 15, color: GRAY }}>{b}</div></div>)}
        </div>
        {/* programs (dynamic block) */}
        <div style={{ position: "absolute", left: 90, top: 900, width: 1420 }}>
          {sec("Our programs", "PROGRAMS")}
          <div style={{ marginTop: 30, display: "flex", gap: 26 }}>
            {[["Customer Service Essentials", "6 weeks · Online + live"], ["Sales Conversations", "8 weeks · Blended"], ["Team Lead Basics", "4 weeks · Live"]].map(([a, b]) => (
              <div key={a} style={{ flex: 1, borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 10px 30px #0F172A0D" }}>
                <div style={{ height: 150, background: `linear-gradient(135deg,${BP},#14B8A6)` }} />
                <div style={{ padding: 20 }}><div style={{ fontSize: 20, fontWeight: 800, color: INK }}>{a}</div><div style={{ marginTop: 6, fontSize: 15, color: GRAY }}>{b}</div><div style={{ marginTop: 16, display: "inline-block", padding: "9px 18px", borderRadius: 10, background: `${BP}14`, color: BP, fontWeight: 800, fontSize: 14 }}>Enroll now →</div></div>
              </div>
            ))}
          </div>
        </div>
        {/* features */}
        <div style={{ position: "absolute", left: 90, top: 1420, width: 1420 }}>
          {sec(`Why ${BRAND}`, "WHY US")}
          <div style={{ marginTop: 30, display: "flex", gap: 26 }}>
            {[["🎯", "Job-ready skills", "Practical lessons built with employers."], ["🎙", "AI practice calls", "Rehearse real conversations before the real thing."], ["🎓", "Certificates", "Finish a program and earn your certificate."]].map(([ic, a, b]) => <div key={a} style={{ flex: 1, padding: 26, borderRadius: 18, background: "#F8FAFC" }}><div style={{ fontSize: 36 }}>{ic}</div><div style={{ marginTop: 10, fontSize: 21, fontWeight: 800, color: INK }}>{a}</div><div style={{ marginTop: 6, fontSize: 15.5, color: GRAY }}>{b}</div></div>)}
          </div>
        </div>
        {/* testimonials */}
        <div style={{ position: "absolute", left: 0, top: 1800, width: W, height: 330, background: `${BP}0D` }}>
          <div style={{ position: "absolute", left: 90, top: 50 }}>{sec("What learners say", "TESTIMONIALS")}</div>
          {[["“I landed a team-lead role three months after finishing.”", "Sofia Reyes"], ["“The live classes and practice calls made all the difference.”", "Daniel Kim"]].map(([q, n], i) => <div key={n} style={{ position: "absolute", left: 90 + i * 720, top: 170, width: 680, padding: 24, borderRadius: 18, background: "#fff", boxShadow: "0 10px 30px #0F172A0D", boxSizing: "border-box" }}><div style={{ fontSize: 19, color: INK, fontStyle: "italic" }}>{q}</div><div style={{ marginTop: 10, fontSize: 15, fontWeight: 800, color: BP }}>— {n}</div></div>)}
        </div>
        {/* CTA */}
        <div style={{ position: "absolute", left: 90, top: 2180, width: 1420, height: 200, borderRadius: 24, background: `linear-gradient(120deg,${BP},#134E4A)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", boxSizing: "border-box" }}>
          <div><div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>Ready to start?</div><div style={{ fontSize: 17, color: "#CCFBF1", marginTop: 6 }}>Fall 2026 cohorts are filling up.</div></div>
          <span style={{ padding: "16px 32px", borderRadius: 12, background: BP_ACC, color: "#0f172a", fontWeight: 900, fontSize: 18 }}>Apply now</span>
        </div>
        {/* footer */}
        <div style={{ position: "absolute", left: 0, top: 2430, width: W, height: 170, background: "#0f172a", display: "flex", alignItems: "center", padding: "0 90px", gap: 60, boxSizing: "border-box" }}>
          <BrightLogo dark /><span style={{ flex: 1 }} />{["Programs", "About", "Contact", "Privacy"].map((x) => <span key={x} style={{ color: "#94A3B8", fontSize: 15 }}>{x}</span>)}<span style={{ color: "#64748B", fontSize: 14 }}>© 2026 {BRAND}</span>
        </div>
      </div>
      {/* fixed header */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 70, background: "#ffffffF2", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", padding: "0 40px", gap: 30, boxSizing: "border-box", zIndex: 5 }}>
        <BrightLogo /><span style={{ flex: 1 }} />{["Programs", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, color: "#374151", fontWeight: 600 }}>{t}</span>)}
        <span style={{ padding: "9px 20px", borderRadius: 999, background: BP, color: "#fff", fontWeight: 700, fontSize: 14, transform: `scale(${pressSignIn ? 0.94 : 1})` }}>Sign in</span>
      </div>
      {hosts && <div style={{ position: "absolute", right: 30, bottom: 26, display: "flex", flexDirection: "column", gap: 8, zIndex: 6 }}>{HOSTS_ALL.map(([l, h], i) => <span key={h} style={{ padding: "10px 16px", borderRadius: 12, background: "#fff", boxShadow: "0 6px 20px #0F172A26", fontSize: 15, fontWeight: 700, color: INK, opacity: sp(g, 20 + i * 10, fps) }}>🔒 {h}</span>)}</div>}
    </div>
  );
};
const HOSTS_ALL = [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]];

const WB_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Branch Management" }, { t: "Courses & Programs", more: true }, { t: "Attendance", more: true },
  { t: "Staff Management", more: true }, { t: "Marketing", more: true }, { t: "Form Builder" }, { t: "Menu Builder" },
  { t: "Website Builder" }, { t: "Enrollment form Builder" }, { t: "Integrations" },
];
const CoShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><BrightLogo /></div>
      <div style={{ marginTop: 10, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search...</div>
      {WB_MENU.map((m, i) => {
        const on = m.t === "Website Builder";
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: 120 + i * 36, width: SIDE - 24, height: 34, display: "flex", alignItems: "center", gap: 9, padding: "0 6px", boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            <Ico c={on ? BLUE : "#4B5563"} s={14} /><span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>{m.more && <Chevron />}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} /><div style={{ flex: 1 }} />
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <Avatar t="AR" c1="#14B8A6" c2="#0F766E" />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
const CoStage: React.FC<{ g: number; keys: CamKey[]; url: string; cur: { x: number; y: number }; ripple: number; children: React.ReactNode; over?: React.ReactNode }> = ({ g, keys, url, cur, ripple, children, over }) => (
  <Stage>
    <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
    <CamC g={g} keys={keys}>
      <Browser url={url}>
        <CoShell>{children}</CoShell>
        {over}
        <Cursor x={cur.x} y={cur.y} ripple={ripple} />
      </Browser>
    </CamC>
  </Stage>
);
const DomainRows: React.FC<{ custom: boolean; o?: number }> = ({ custom, o = 1 }) => {
  const rows = custom
    ? [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]]
    : [["Landing", `${SLUG}.skillbnk.com`], ["Learner portal", `${SLUG}.learner.skillbnk.com`], ["Branch portal", `${SLUG}.branch.skillbnk.com`], ["Company admin", `${SLUG}.company.skillbnk.com`]];
  return (
    <div style={{ opacity: o }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>{custom ? "CUSTOM DOMAINS" : "FREE SKILLBNK DOMAINS"}</div>
      {rows.map(([a, b]) => (
        <div key={a} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
          <span style={{ width: 120, color: GRAY, fontWeight: 600 }}>{a}</span>
          <span style={{ flex: 1, fontWeight: 700, color: custom ? BP : INK, fontFamily: "monospace" }}>{b}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>⧉ Copy</span>
        </div>
      ))}
    </div>
  );
};
/** Real site card (website-builder/page.tsx): name + status badge (+ domain status), 🌐 domain,
 *  "Set up" (⚙) top-right; description; "Free SkillBNK domains" / "Custom domains" (+ "custom" pill)
 *  rows with copy; footer Edit · Visit · delete. */
const SiteCard: React.FC<{ custom: boolean; x?: number; y?: number; o?: number; hl?: number; status?: "pending" | "active"; pressSetup?: boolean; pressVisit?: boolean; pressCopy?: number }> = ({ custom, x = 20, y = 90, o = 1, hl = 0, status = "active", pressSetup, pressVisit, pressCopy = -1 }) => {
  const rows = custom
    ? [["Landing", DOMAIN], ["Learner portal", `learner.${DOMAIN}`], ["Branch portal", `branch.${DOMAIN}`], ["Company admin", `company.${DOMAIN}`]]
    : [["Landing", `${SLUG}.skillbnk.com`], ["Learner portal", `${SLUG}.learner.skillbnk.com`], ["Branch portal", `${SLUG}.branch.skillbnk.com`], ["Company admin", `${SLUG}.company.skillbnk.com`]];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 640, height: 470, borderRadius: 14, background: "#fff", border: `${hl > 0.5 ? 2 : 1}px solid ${hl > 0.5 ? BP : LINE}`, boxShadow: "0 8px 24px #0F172A10", overflow: "hidden", opacity: o }}>
      <div style={{ height: 86, background: "#F8FAFC", borderBottom: `1px solid ${LINE}`, padding: "16px 20px", boxSizing: "border-box", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 19, fontWeight: 800, color: INK }}>{BRAND}</span>
          <Badge t="published" c={GREEN} bg="#DCFCE7" fs={11.5} />
          {custom && (status === "active" ? <Badge t="active" c={GREEN} bg="#DCFCE7" fs={11.5} /> : <Badge t="pending" c="#A16207" bg="#FEF9C3" fs={11.5} />)}
        </div>
        <div style={{ marginTop: 6, fontSize: 13.5, color: GRAY }}>🌐 {custom ? DOMAIN : `${SLUG}.skillbnk.com`}</div>
        <div style={{ position: "absolute", right: 20, top: 18, height: 34, padding: "0 12px", borderRadius: 7, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#475569", transform: `scale(${pressSetup ? 0.92 : 1})` }}>⚙ Set up</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 13.5, color: GRAY }}>Career training for customer-service and sales teams.</div>
        <div style={{ marginTop: 14, borderRadius: 10, border: `1px solid ${LINE}`, background: "#F8FAFC", padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>{custom ? "CUSTOM DOMAINS" : "FREE SKILLBNK DOMAINS"}</span>
            {custom && <span style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", background: "#EFF6FF", padding: "2px 8px", borderRadius: 999 }}>custom</span>}
          </div>
          {rows.map(([a2, b2], i) => (
            <div key={a2} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, padding: "6px 10px" }}>
              <span style={{ width: 110, color: "#475569", fontWeight: 600 }}>{a2}</span>
              <span style={{ flex: 1, fontWeight: 600, color: custom ? BP : INK, fontFamily: "monospace" }}>{b2}</span>
              <span style={{ fontSize: 13, color: pressCopy === i ? BLUE : "#94A3B8" }}>⧉</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 16, borderTop: `1px solid ${LINE}`, paddingTop: 12, display: "flex", gap: 8 }}>
        <span style={{ padding: "8px 14px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>✎ Edit</span>
        <span style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: INK, transform: `scale(${pressVisit ? 0.92 : 1})` }}>↗ Visit</span>
        <span style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, color: "#DC2626" }}>🗑</span>
      </div>
    </div>
  );
};

// ═══ w0 — HOOK: someone else's logo on your sign-up page ═══════════════════
const SceneHookWL: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 240;
  const g = gt(f, dur, D);
  const flip = g >= 150;
  const card = sp(g, 4, fps);
  const lines = [
    { t: "Your customers find your course…", at: 6, c: "#F1F5F9" },
    { t: "then sign up on someone else's page.", at: 70, c: "#FCA5A5" },
  ];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        <div style={{ position: "absolute", left: 460, top: 90, width: 1000, height: 560, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 100px #000C", opacity: card, transform: `scale(${0.92 + 0.08 * card})` }}>
          <div style={{ height: 44, background: "#1E2740", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
            {["#FF6B5E", "#FFC15E", "#3ED07F"].map((c) => <i key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            <span style={{ margin: "0 auto", fontSize: 14, color: "#A9B4CC", background: "#0F1729", padding: "5px 20px", borderRadius: 7 }}>🔒 {flip ? `${DOMAIN}/auth/login` : "genericlms-portal.io/school/8841/login"}</span>
          </div>
          <div style={{ display: "flex", height: 516 }}>
            <div style={{ flex: 1, padding: 50 }}>
              {flip ? <BrightLogo s={1.3} /> : <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 46, height: 46, borderRadius: 10, background: "#9CA3AF" }} /><span style={{ fontSize: 22, fontWeight: 800, color: "#6B7280" }}>GenericLMS</span></div>}
              <div style={{ marginTop: 40, fontSize: 34, fontWeight: 800, color: INK }}>Welcome back!</div>
              <div style={{ marginTop: 26, height: 50, borderRadius: 10, border: "1px solid #D1D5DB" }} />
              <div style={{ marginTop: 14, height: 50, borderRadius: 10, border: "1px solid #D1D5DB" }} />
              <div style={{ marginTop: 22, height: 52, borderRadius: 10, background: flip ? BP : "#6B7280", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>Sign in</div>
              {!flip && <div style={{ marginTop: 18, fontSize: 13, color: "#9CA3AF" }}>Powered by GenericLMS</div>}
            </div>
            <div style={{ width: 420, background: flip ? `linear-gradient(160deg,${BP},#134E4A)` : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>{flip ? <BrightLogo s={1.6} dark /> : <span style={{ fontSize: 60, color: "#9CA3AF" }}>?</span>}</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
          {!flip && lines.map((l) => { const o = fi(g, l.at, 12); return <div key={l.t} style={{ fontSize: 48, fontWeight: 800, color: l.c, opacity: o, lineHeight: 1.3 }}>{l.t}</div>; })}
          {flip && <div style={{ fontSize: 56, fontWeight: 900, color: "#F1F5F9", opacity: fi(g, 150, 12) }}>What if it was <span style={{ color: "#5EEAD4" }}>all yours?</span></div>}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ w1 — Website Builder → New Website ═══════════════════════════════════
const SceneNewSite: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const modal = g >= 40 && g < 250 ? Math.min(fi(g, 40, 10), fo(g, 240, 10)) : 0;
  const made = g >= 250;
  const NEW = { x: MX(1250), y: MY(46) };
  const CREATE = { x: MX(960), y: MY(640) };
  const cur = path(g, [[0, 900, 600], [24, NEW.x, NEW.y], [40, NEW.x, NEW.y], [70, MX(680), MY(250)], [200, MX(680), MY(400)], [226, CREATE.x, CREATE.y], [248, CREATE.x, CREATE.y], [330, MX(500), MY(500)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 1300, 120, 1.5], [44, 1300, 120, 1.5], [70, 930, 470, 1.25], [240, 930, 470, 1.25], [270, 600, 420, 1.3], [330, 600, 420, 1.3]];
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={Math.max(rip(g, 36), rip(g, 244))}
      over={modal > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * modal})`, zIndex: 40 }}>
          <div style={{ position: "absolute", left: MX(420), top: MY(110) + BAR, width: 640, height: 560, borderRadius: 16, background: "#fff", opacity: modal, padding: 28, boxSizing: "border-box" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>New Website</div>
            <Input x={28} y={70} w={584} label="Name" req value={typed(g, 70, BRAND)} ph="My Company Website" glow={g >= 70 && g < 110 ? 1 : 0} />
            <Input x={28} y={160} w={584} label="Slug (subdomain)" req value={typed(g, 110, SLUG)} ph="my-company" />
            <Input x={28} y={250} w={584} label="Page title" value={typed(g, 130, "Brightpath Academy — Learn with us")} ph="My Company — Learn with us" />
            <Input x={28} y={340} w={584} h={80} label="Description" value={typed(g, 165, "Career training for customer-service and sales teams.", 1.5)} ph="Short description for SEO…" />
            <Btn x={340} y={480} w={130} h={44} label="Cancel" fs={14.5} />
            <Btn x={482} y={480} w={130} h={44} label="Create" primary fs={14.5} press={g >= 244 && g < 250 ? 1 : 0} />
          </div>
        </div>
      ) : null}>
      <PageTitle t="Website Builder" sub="Build and publish your company website" />
      <Btn x={1180} y={24} w={150} h={42} label="+ New Website" primary fs={14.5} press={g >= 36 && g < 42 ? 1 : 0} />
      {made ? <SiteCard custom={false} o={sp(g, 250, fps)} /> : (
        <div style={{ position: "absolute", left: 20, top: 90, width: 1310, height: 400, borderRadius: 14, border: "1px dashed #CBD5E1", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ fontSize: 44 }}>🌐</div><div style={{ fontSize: 20, fontWeight: 800, color: INK }}>No websites yet</div><div style={{ fontSize: 15, color: GRAY }}>Create your first website to get started</div>
        </div>
      )}
    </CoStage>
  );
};

// ═══ w2 — Brand panel: Colors → Type → Logos ══════════════════════════════
const BrandSwatch: React.FC<{ label: string; c: string; hl?: boolean }> = ({ label, c, hl }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: 6, borderRadius: 8, background: hl ? "#F0FDFA" : "transparent" }}>
    <span style={{ width: 30, height: 30, borderRadius: 7, background: c, border: "1px solid #0002" }} />
    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>{label}</span>
    <span style={{ fontSize: 12.5, fontFamily: "monospace", color: GRAY }}>{c}</span>
  </div>
);
const SceneBrand: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const tab = g < 170 ? "Colors" : g < 280 ? "Type" : "Logos";
  const mix = fi(g, 70, 30);
  const prim = mix > 0.5 ? BP : "#6366F1";
  const acc = mix > 0.5 ? BP_ACC : "#F59E0B";
  const font = g >= 210 ? "Poppins" : "Inter";
  const logoIn = g >= 320;
  const cur = path(g, [[0, 900, 600], [40, 140, 260], [70, 140, 260], [150, 140, 260], [170, 230, 150], [190, 230, 150], [210, 160, 260], [280, 160, 260], [300, 140, 470], [330, 140, 470], [420, 140, 470]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 600, 440, 1.2], [420, 600, 440, 1.2]];
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url={`company.skillbnk.com/website-builder/${SLUG}`}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 56, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 12, boxSizing: "border-box" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>← {BRAND}</span><span style={{ fontSize: 13, color: GRAY }}>Home</span>
            <span style={{ flex: 1 }} />
            <span style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>✨ AI</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>Preview</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>Publish</span>
          </div>
          <div style={{ position: "absolute", left: 0, top: 56, width: 360, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: INK, marginBottom: 10 }}>Brand</div>
            <div style={{ display: "flex", borderBottom: `1px solid ${LINE}`, marginBottom: 14 }}>
              {["Colors", "Type", "Layout", "Site SEO", "CSS"].map((t) => { const on = t === tab || (tab === "Logos" && t === "Site SEO" && false); return <span key={t} style={{ flex: 1, textAlign: "center", padding: "8px 0", fontSize: 12, fontWeight: 700, color: on ? BLUE : GRAY, borderBottom: on ? `2px solid ${BLUE}` : "none" }}>{t}</span>; })}
            </div>
            {tab === "Colors" && <div><BrandSwatch label="Primary" c={prim} hl={g >= 70 && g < 110} /><BrandSwatch label="Primary text" c="#ffffff" /><BrandSwatch label="Accent" c={acc} hl={g >= 110 && g < 150} /><BrandSwatch label="Background" c="#ffffff" /><BrandSwatch label="Text" c="#0f172a" /></div>}
            {tab === "Type" && <div style={{ opacity: fi(g, 170, 8) }}>
              <Input x={14} y={100} w={330} label="Heading font" value={font} select glow={g >= 200 && g < 240 ? 1 : 0} />
              <Input x={14} y={190} w={330} label="Body font" value="Inter" select />
              <Input x={14} y={280} w={160} label="Base font size (px)" value="16" />
              <Input x={184} y={280} w={160} label="Line height" value="1.6" />
            </div>}
            {tab === "Logos" && <div style={{ opacity: fi(g, 280, 8) }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>LOGOS</div>
              {[["Light logo", false], ["Dark logo", true], ["Favicon", false]].map(([l, d], i) => (
                <div key={l as string} style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>{l as string}</div>
                  <div style={{ marginTop: 6, height: 70, borderRadius: 10, border: `1.5px dashed ${logoIn ? BP : "#CBD5E1"}`, background: d && logoIn ? "#134E4A" : "#FAFAFB", display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 }}>
                    {logoIn && g >= 320 + i * 14 ? (i === 2 ? <div style={{ width: 34, height: 34, borderRadius: 8, background: BP, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: BP_ACC }} /></div> : <BrightLogo s={0.9} dark={d as boolean} />) : <span style={{ fontSize: 13, color: GRAY }}>⤒ Upload</span>}
                  </div>
                </div>
              ))}
            </div>}
          </div>
          <div style={{ position: "absolute", left: 380, top: 76, width: 1200, height: 770, borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0 6px 20px #0F172A14", fontFamily: font === "Poppins" ? "Poppins, " + FONT : FONT }}>
            <div style={{ height: 70, display: "flex", alignItems: "center", padding: "0 34px", gap: 26, borderBottom: "1px solid #EEF2F7" }}>
              {logoIn ? <BrightLogo /> : <span style={{ fontSize: 20, fontWeight: 800, color: INK }}>{BRAND}</span>}
              <span style={{ flex: 1 }} />{["Courses", "About", "Contact"].map((t) => <span key={t} style={{ fontSize: 15, color: "#374151", fontWeight: 600 }}>{t}</span>)}
              <span style={{ padding: "9px 20px", borderRadius: 999, background: prim, color: "#fff", fontWeight: 700, fontSize: 14 }}>Sign in</span>
            </div>
            <div style={{ padding: "70px 60px", background: `linear-gradient(135deg, ${prim}14, #fff)` }}>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: `${acc}26`, color: "#92400E", fontSize: 14, fontWeight: 800 }}>Fall 2026 enrollment open</div>
              <div style={{ marginTop: 20, fontSize: 56, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>Launch your career<br />with <span style={{ color: prim }}>{BRAND}</span></div>
              <div style={{ marginTop: 18, fontSize: 19, color: "#475569" }}>Career training for customer-service and sales teams.</div>
              <div style={{ marginTop: 30, display: "flex", gap: 14 }}><span style={{ padding: "14px 28px", borderRadius: 12, background: prim, color: "#fff", fontWeight: 800 }}>Browse courses</span><span style={{ padding: "14px 28px", borderRadius: 12, border: `2px solid ${acc}`, color: "#0f172a", fontWeight: 800 }}>Talk to us</span></div>
            </div>
          </div>
          <Cursor x={cur.x} y={cur.y + 56} ripple={Math.max(rip(g, 66), rip(g, 186), rip(g, 206), rip(g, 326))} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ w3 — Domain setup → custom domain → all portals on your domain ═══════
const SceneDomain: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const modal = g >= 40 && g < 290 ? Math.min(fi(g, 40, 10), fo(g, 280, 10)) : 0;
  const custom = g >= 290;
  const DS = { x: MX(20 + 640 - 60), y: MY(90 + 35) };
  const SAVE = { x: MX(420 + 560), y: MY(110 + 560) };
  const cur = path(g, [[0, 900, 600], [24, DS.x, DS.y], [40, DS.x, DS.y], [70, MX(700), MY(250)], [250, MX(700), MY(250)], [272, SAVE.x, SAVE.y], [288, SAVE.x, SAVE.y], [400, MX(700), MY(560)]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 500, 500, 1.3], [44, 500, 500, 1.3], [70, 930, 470, 1.2], [280, 930, 470, 1.2], [310, 560, 420, 1.45], [400, 560, 420, 1.45]];
  return (
    <CoStage g={g} keys={keys} url="company.skillbnk.com/website-builder" cur={cur} ripple={Math.max(rip(g, 36), rip(g, 284))}
      over={modal > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * modal})`, zIndex: 40 }}>
          <div style={{ position: "absolute", left: MX(420), top: MY(60) + BAR, width: 680, height: 640, borderRadius: 16, background: "#fff", opacity: modal, padding: 28, boxSizing: "border-box" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Domain setup</div>
            <div style={{ fontSize: 13.5, color: GRAY, marginTop: 4 }}>Cloudflare hostname and SSL verification</div>
            <Input x={28} y={90} w={624} label="Main custom landing domain" value={typed(g, 70, DOMAIN, 1)} ph="customer.com" glow={g >= 70 && g < 110 ? 1 : 0} />
            <div style={{ position: "absolute", left: 28, top: 172, fontSize: 12.5, color: GRAY }}>Do not include https:// or a path.</div>
            <div style={{ position: "absolute", left: 28, top: 206, width: 624, opacity: fi(g, 120, 10) }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>DNS instructions</div>
              {[["Hostname ownership TXT", "Name"], ["SSL TXT records", "Name"]].map(([a, b], i) => (
                <div key={a} style={{ marginTop: 10, padding: 12, borderRadius: 10, background: "#F9FAFB", border: `1px solid ${LINE}`, opacity: fi(g, 130 + i * 20, 8) }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#374151" }}>{a} <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 6, background: "#E0E7FF", color: BLUE, fontSize: 11 }}>TXT</span></div>
                  <div style={{ marginTop: 6, fontSize: 13, fontFamily: "monospace", color: GRAY, filter: "blur(3px)" }}>{b} · _verify.learnbrightpath.com</div>
                  <div style={{ fontSize: 13, fontFamily: "monospace", color: GRAY, filter: "blur(3px)" }}>a8f3c2e9-7d41-4b6e-9c0a-2f5b8e1d3c77</div>
                </div>
              ))}
              {g >= 200 && <div style={{ marginTop: 14, display: "flex", gap: 10, opacity: fi(g, 200, 10) }}>{["All hostnames", "All SSL certificates"].map((x) => <span key={x} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700, color: INK }}>{x}</span>)}</div>}
            </div>
            <Btn x={390} y={570} w={120} h={44} label="Cancel" fs={14.5} />
            <Btn x={522} y={570} w={130} h={44} label="Save domain" primary fs={14.5} press={g >= 284 && g < 290 ? 1 : 0} />
          </div>
        </div>
      ) : null}>
      <PageTitle t="Website Builder" sub="Build and publish your company website" />
      <Btn x={1180} y={24} w={150} h={42} label="+ New Website" primary fs={14.5} />
      <SiteCard custom={custom} hl={custom ? 1 : 0} />
      {custom && <div style={{ position: "absolute", left: 690, top: 120, width: 600, opacity: fi(g, 310, 12), fontSize: 30, fontWeight: 800, color: INK, lineHeight: 1.35 }}>Every portal now runs on<br /><span style={{ color: BP }}>{DOMAIN}</span></div>}
    </CoStage>
  );
};

// ═══ w4 — Learner side: your domain, your brand, your login ═══════════════
const SceneLearnerWL: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const login = g >= 150;
  const SIGN = { x: 1460, y: 79 };
  const cur = path(g, [[0, 800, 600], [110, SIGN.x, SIGN.y], [140, SIGN.x, SIGN.y], [200, 500, 470], [300, 500, 470]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [300, WIDE_X, WIDE_Y, 1]];
  return (
    <Stage>
      <PortalTag n={2} label="Your website" url={DOMAIN} />
      <CamC g={g} keys={keys}>
        <Browser url={login ? `${DOMAIN}/auth/login` : DOMAIN}>
          {!login ? (
            <BrightSite g={g} fps={fps} scroll={interpolate(g, [10, 110, 112, 125], [0, 1700, 1700, 0], cl)} pressSignIn={g >= 136 && g < 142} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", opacity: fi(g, 150, 10), fontFamily: "Poppins, " + FONT }}>
              <div style={{ flex: 1, background: "#fff", padding: "90px 120px" }}>
                <BrightLogo s={1.3} />
                <div style={{ marginTop: 50, fontSize: 40, fontWeight: 800, color: INK }}>Welcome back!</div>
                <div style={{ marginTop: 8, fontSize: 17, color: GRAY }}>Sign in to continue learning.</div>
                <Input x={120} y={330} w={560} label="Email" value={typed(g, 190, "sofia.reyes@example.com", 1.6)} ph="you@example.com" />
                <Input x={120} y={420} w={560} label="Password" value={g >= 230 ? "••••••••••" : ""} ph="Password" />
                <div style={{ position: "absolute", left: 120, top: 530, width: 560, height: 54, borderRadius: 12, background: BP, color: "#fff", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>Sign in</div>
              </div>
              <div style={{ width: 640, background: `linear-gradient(160deg,${BP},#134E4A)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <BrightLogo s={2} dark />
                <div style={{ fontSize: 22, color: "#CCFBF1", fontWeight: 600 }}>Your training. Your brand.</div>
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={rip(g, 136)} />
        </Browser>
      </CamC>
    </Stage>
  );
};

// ═══ w5 — WRAP ═════════════════════════════════════════════════════════════
const SceneWrapWL: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 190;
  const g = gt(f, dur, D);
  const steps = [["🎨", "Your brand", "Colors · fonts · logos", "#14B8A6"], ["🌐", "Your domain", "Every portal on it", "#2563EB"], ["🔐", "Your login", "Branded sign-in pages", "#F59E0B"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
          <Img src={staticFile("skillbnk-logo.png")} style={{ width: 400, filter: "drop-shadow(0 0 20px #7FA0FF40)" }} />
        </div>
        <div style={{ position: "absolute", left: 210, top: 360, width: 1500, display: "flex", gap: 40 }}>
          {steps.map(([ic, t, s, c], i) => {
            const p = sp(g, 20 + i * 16, fps);
            return (
              <div key={t} style={{ flex: 1, height: 250, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: `1px solid ${c}88`, boxShadow: `0 0 50px ${c}33`, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56 }}>{ic}</div>
                <div style={{ marginTop: 14, fontSize: 36, fontWeight: 800, color: "#F1F5F9" }}>{t}</div>
                <div style={{ marginTop: 8, fontSize: 20, color: "#8A96B2" }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontSize: 56, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 90, 12) }}>
          Your name on everything. <span style={{ color: "#5EEAD4" }}>Not ours.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ w2 — Design library (ready-made blocks + page templates) → drag & drop → customize ═══
// Real: DesignLibraryModal ("Design library", tabs Components / Pages, search, groups Hero /
// Content / Forms / Dynamic / Conversion / Social proof, "Add block", "Use page", preview
// Desktop / Tablet / Mobile); catalog.ts blocks (Academy Hero, Programs = "Live organization
// programs", Testimonials, Pricing, FAQ, Call to Action…); Puck drag-and-drop editor with
// ComponentsBrowser (Section, Heading, Text, Button, Image, Grid, Carousel, Tabs, Accordion, Video…).
const LIB = [
  { n: "Academy Hero", d: "Education-focused hero with academy feature cards.", gp: "Hero", ic: "✧", c: "#d97706" },
  { n: "Programs", d: "Live organization programs with configurable display.", gp: "Dynamic", ic: "▥", c: "#0369a1" },
  { n: "Testimonials", d: "Customer quotations with configurable layouts.", gp: "Social proof", ic: "“", c: "#db2777" },
  { n: "Pricing", d: "Compare plans, benefits, and conversion actions.", gp: "Conversion", ic: "$", c: "#0891b2" },
  { n: "Frequently Asked Questions", d: "Expandable answers for common visitor questions.", gp: "Conversion", ic: "?", c: "#ea580c" },
  { n: "Process Timeline", d: "Present onboarding or delivery as ordered steps.", gp: "Content", ic: "↗", c: "#0891b2" },
];
const COMPS = ["Section", "Container", "Grid", "Heading", "Text", "Button", "Image", "Video", "Carousel", "Tabs", "Accordion", "Divider"];
const SceneBlocks: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 480;
  const g = gt(f, dur, D);
  const lib = g >= 30 && g < 175 ? Math.min(fi(g, 30, 10), fo(g, 165, 10)) : 0;
  const added = [g >= 110, g >= 150];          // Academy Hero, Programs added from the library
  const dragP = interpolate(g, [200, 260], [0, 1], cl); // drag "Testimonials"-style section from Components
  const dropped = g >= 262;
  const sel = g >= 290;
  const title = g < 300 ? "Launch your career" : typed(g, 300, "Start your new career this fall", 1.1) || "";
  const device = g >= 400 ? "Mobile" : "Desktop";
  const pv = interpolate(g, [400, 420], [0, 1], cl);
  const cardPos = (i: number) => ({ x: 360 + (i % 3) * 300, y: 230 + Math.floor(i / 3) * 230 });
  const DL = { x: 1010, y: 28 };
  const add1 = { x: cardPos(0).x + 24 + 175, y: cardPos(0).y + 182 };
  const add2 = { x: cardPos(1).x + 24 + 175, y: cardPos(1).y + 182 };
  const dragFrom = { x: 130, y: 260 + 9 * 34 };
  const dropTo = { x: 900, y: 600 };
  const HEAD_T = { x: 760, y: 200 };
  const MOB = { x: 1420, y: 28 };
  const cur = path(g, [[0, 800, 500], [20, DL.x, DL.y], [34, DL.x, DL.y], [90, add1.x, add1.y], [110, add1.x, add1.y], [134, add2.x, add2.y], [150, add2.x, add2.y], [190, dragFrom.x, dragFrom.y], [200, dragFrom.x, dragFrom.y], [260, dropTo.x, dropTo.y], [280, HEAD_T.x, HEAD_T.y], [292, HEAD_T.x, HEAD_T.y], [380, 1350, 300], [392, MOB.x, MOB.y], [404, MOB.x, MOB.y], [480, 900, 500]]);
  const ripple = Math.max(rip(g, 30), rip(g, 106), rip(g, 146), rip(g, 288), rip(g, 400));
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, WIDE_X, 470, 1.05], [170, WIDE_X, 470, 1.05], [190, 600, 470, 1.15], [270, 700, 470, 1.15], [290, 900, 300, 1.3], [370, 900, 300, 1.3], [400, WIDE_X, WIDE_Y, 1], [480, WIDE_X, WIDE_Y, 1]];
  const W2 = interpolate(pv, [0, 1], [1000, 400]);
  const section = (k: string, h: number, body: React.ReactNode, hl?: boolean) => (
    <div key={k} style={{ position: "relative", height: h, borderBottom: "1px solid #EEF2F7", outline: hl ? `2px solid ${BLUE}` : "none", outlineOffset: -2 }}>{body}</div>
  );
  return (
    <Stage>
      <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={keys}>
        <Browser url={`company.skillbnk.com/website-builder/${SLUG}`}>
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 56, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 10, boxSizing: "border-box" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>← {BRAND}</span><span style={{ fontSize: 13, color: GRAY }}>Home</span>
            <span style={{ flex: 1 }} />
            <span style={{ padding: "7px 14px", borderRadius: 8, background: lib > 0.5 ? BLUE : "#fff", color: lib > 0.5 ? "#fff" : INK, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>▤ Design library</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 700 }}>✨ AI</span>
            <span style={{ display: "flex", border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>{["Desktop", "Tablet", "Mobile"].map((d) => <span key={d} style={{ padding: "7px 10px", fontSize: 12.5, fontWeight: 700, background: d === device ? BLUE_SOFT : "#fff", color: d === device ? BLUE : GRAY }}>{d}</span>)}</span>
            <span style={{ padding: "7px 14px", borderRadius: 8, background: BLUE, color: "#fff", fontSize: 13.5, fontWeight: 700 }}>Publish</span>
          </div>
          {/* left: components */}
          <div style={{ position: "absolute", left: 0, top: 56, width: 260, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Components</div>
            <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Drag onto the page</div>
            {COMPS.map((c, i) => <div key={c} style={{ marginTop: 6, height: 28, borderRadius: 7, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 13, fontWeight: 600, color: INK, background: i === 9 && g >= 195 && g < 262 ? BLUE_SOFT : "#fff" }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span>{c}</div>)}
          </div>
          {/* canvas */}
          <div style={{ position: "absolute", left: 280, top: 76, width: 1020, height: 770, background: "#E9EDF3", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ margin: "10px auto", width: W2, height: 750, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: "Poppins, " + FONT, transition: "none" }}>
              <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #EEF2F7" }}><BrightLogo s={0.75} /><span style={{ flex: 1 }} /><span style={{ padding: "6px 14px", borderRadius: 999, background: BP, color: "#fff", fontSize: 12, fontWeight: 700 }}>Sign in</span></div>
              {added[0] && section("hero", 200, <div style={{ padding: pv > 0.5 ? 18 : "30px 36px", background: `linear-gradient(135deg, ${BP}14, #fff)`, height: "100%", boxSizing: "border-box", opacity: sp(g, 110, fps) }}>
                <div style={{ fontSize: pv > 0.5 ? 24 : 34, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>{title}<span style={{ color: BLUE }}>{sel && g < 360 ? "|" : ""}</span></div>
                <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>Career training for customer-service and sales teams.</div>
                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>{["Online", "Live classes", "Certificates"].map((x) => <span key={x} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", boxShadow: "0 2px 6px #0001", fontSize: 11.5, fontWeight: 700 }}>{x}</span>)}</div>
              </div>, sel)}
              {added[1] && section("prog", 200, <div style={{ padding: "18px 24px", opacity: sp(g, 150, fps) }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Our programs</div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>{["Customer Service Essentials", "Sales Conversations", "Team Lead Basics"].slice(0, pv > 0.5 ? 1 : 3).map((c) => <div key={c} style={{ width: pv > 0.5 ? 340 : 290, height: 120, borderRadius: 10, border: "1px solid #EEF2F7", padding: 10, boxSizing: "border-box" }}><div style={{ height: 60, borderRadius: 8, background: `linear-gradient(135deg,${BP},#14B8A6)` }} /><div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: INK }}>{c}</div></div>)}</div>
              </div>)}
              {dropped && section("tabs", 160, <div style={{ padding: "18px 24px", opacity: sp(g, 262, fps) }}>
                <div style={{ display: "flex", gap: 8 }}>{["Online", "Live", "Blended"].map((x, i) => <span key={x} style={{ padding: "6px 14px", borderRadius: 8, background: i === 0 ? BP : "#F1F5F9", color: i === 0 ? "#fff" : INK, fontSize: 12.5, fontWeight: 700 }}>{x}</span>)}</div>
                <div style={{ marginTop: 12, height: 10, width: "70%", borderRadius: 5, background: "#E5E7EB" }} /><div style={{ marginTop: 8, height: 10, width: "50%", borderRadius: 5, background: "#E5E7EB" }} />
              </div>)}
              {g >= 200 && g < 262 && <div style={{ height: 6, margin: "6px 24px", borderRadius: 3, background: BLUE, opacity: 0.6 }} />}
            </div>
          </div>
          {/* right: fields of the selected block */}
          <div style={{ position: "absolute", left: 1316, top: 56, width: 284, height: H - BAR - 56, background: "#fff", borderLeft: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{sel ? "Academy Hero" : "Page"}</div>
            {sel ? (
              <div style={{ opacity: fi(g, 290, 8) }}>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Title</div>
                <div style={{ marginTop: 6, minHeight: 36, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: "0 0 0 3px #C7D2FE", padding: "8px 10px", fontSize: 13, color: INK }}>{title}</div>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Description</div>
                <div style={{ marginTop: 6, borderRadius: 8, border: "1px solid #D1D5DB", padding: "8px 10px", fontSize: 12.5, color: INK }}>Career training for customer-service and sales teams.</div>
                <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Image</div>
                <div style={{ marginTop: 6, height: 60, borderRadius: 8, border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: GRAY }}>⤒ Upload</div>
                <div style={{ marginTop: 14, fontSize: 12, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>STYLE</div>
                {[["Padding", "Default"], ["Background", BP], ["Text align", "Left"]].map(([a, b]) => <div key={a} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span style={{ color: "#374151", fontWeight: 600 }}>{a}</span><span style={{ color: GRAY, fontFamily: "monospace" }}>{b}</span></div>)}
              </div>
            ) : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}
          </div>
          {/* drag ghost */}
          {g >= 200 && g < 262 && <div style={{ position: "absolute", left: cur.x + 10, top: cur.y + 10, padding: "6px 12px", borderRadius: 8, background: "#fff", border: `2px solid ${BLUE}`, fontSize: 13, fontWeight: 700, color: BLUE, boxShadow: "0 8px 20px #0003", zIndex: 80 }}>⋮⋮ Tabs</div>}
          {/* design library modal */}
          {lib > 0.01 && (
            <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * lib})`, zIndex: 60 }}>
              <div style={{ position: "absolute", left: 200, top: 60, width: 1200, height: 740, borderRadius: 16, background: "#fff", opacity: lib, padding: 24, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div><div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Design library</div><div style={{ fontSize: 13, color: GRAY }}>Choose a polished component or start from a complete editable page.</div></div>
                  <span style={{ flex: 1 }} />
                  <span style={{ display: "flex", padding: 3, borderRadius: 8, background: "#F3F4F6" }}>{["Components", "Pages"].map((t, i) => <span key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 700, background: i === 0 ? BLUE : "transparent", color: i === 0 ? "#fff" : GRAY }}>{t}</span>)}</span>
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <div style={{ width: 300, height: 38, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search</div>
                  {["All", "Hero", "Content", "Forms", "Dynamic", "Conversion", "Social proof"].map((x, i) => <span key={x} style={{ padding: "8px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: i === 0 ? INK : "#F3F4F6", color: i === 0 ? "#fff" : "#374151" }}>{x}</span>)}
                </div>
                {LIB.map((b, i) => {
                  const p = cardPos(i);
                  const done = (i === 0 && added[0]) || (i === 1 && added[1]);
                  return (
                    <div key={b.n} style={{ position: "absolute", left: p.x - 200 + 24, top: p.y - 60, width: 280, height: 210, borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden", opacity: sp(g, 34 + i * 4, fps) }}>
                      <div style={{ height: 90, background: `${b.c}1A`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: b.c }}>{b.ic}</div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 14.5, fontWeight: 800, color: INK }}>{b.n}</span><span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.gp}</span></div>
                        <div style={{ marginTop: 4, fontSize: 12, color: GRAY, height: 32 }}>{b.d}</div>
                        <div style={{ marginTop: 6, display: "flex", gap: 6 }}><span style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${LINE}`, fontSize: 12, fontWeight: 700 }}>👁 Preview</span><span style={{ padding: "5px 10px", borderRadius: 6, background: done ? GREEN : BLUE, color: "#fff", fontSize: 12, fontWeight: 700 }}>{done ? "✓ Added" : "+ Add block"}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={g >= 200 && g < 262} />
        </Browser>
      </CamC>
    </Stage>
  );
};
