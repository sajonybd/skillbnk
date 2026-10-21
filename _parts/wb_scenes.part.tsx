// ═══════════════════════════════════════════════════════════════════════════
// Website Builder — scenes (sheet serial 16). Real UI (SB-Company website-builder/[websiteId]):
//  EditorHeader: site + page name · AI · Library · Settings · Page SEO · Export · Import · Preview ·
//   Save draft · Publish changes · Live. Toasts "Draft saved", "Page and global design published".
//  PagesPanel: Global (Global Navbar, Global Footer) · All pages / Custom pages / Default pages ·
//   Add page (Title, Folder) · Add folder · Page SEO (SEO title, Meta description, Search preview…).
//  DesignLibraryModal: Components / Pages · "Add block" · page template "Training Academy"
//   ("An education-first page connected to live programs and learner outcomes.") → "Use page".
//  AiBuilderModal "Build with AI": Section ("One section from a prompt") / Full page / Import HTML;
//   SectionMode "Describe the section", Look, Refine.
//  Hero field help texts: "One line of the stacked hero title.", "Highlighted word or phrase inside the
//   hero title.", "Optional icon displayed next to the CTA label."
// ═══════════════════════════════════════════════════════════════════════════
const HB: [string, number][] = [["✨ AI", 64], ["▤ Library", 90], ["⚙ Settings", 100], ["🔎 Page SEO", 112], ["⤓ Export", 86], ["⤒ Import", 86], ["👁 Preview", 96], ["Save draft", 100], ["Publish changes", 146], ["↗ Live", 70]];
const HB_X: number[] = (() => { let x = W - 16; const out: number[] = []; for (let i = HB.length - 1; i >= 0; i--) { x -= HB[i][1]; out[i] = x; x -= 8; } return out; })();
const hbPt = (label: string) => { const i = HB.findIndex((h) => h[0].includes(label)); return { x: HB_X[i] + HB[i][1] / 2, y: 28 }; };
const EdHeader: React.FC<{ page: string; press?: string; on?: string }> = ({ page, press, on }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 56, background: "#fff", borderBottom: `1px solid ${LINE}`, zIndex: 20 }}>
    <div style={{ position: "absolute", left: 18, top: 9 }}><div style={{ fontSize: 15, fontWeight: 800, color: INK }}>← {BRAND}</div><div style={{ fontSize: 12, color: GRAY, fontFamily: "monospace" }}>{DOMAIN} · {page}</div></div>
    {HB.map(([t, w], i) => {
      const pr = press && t.includes(press);
      const act = on && t.includes(on);
      const primary = t === "Publish changes";
      return <div key={t} style={{ position: "absolute", left: HB_X[i], top: 12, width: w, height: 32, borderRadius: 7, border: primary ? "none" : `1px solid ${act ? BLUE : LINE}`, background: primary ? BLUE : act ? BLUE_SOFT : "#fff", color: primary ? "#fff" : act ? BLUE : INK, fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pr ? 0.92 : 1})`, boxSizing: "border-box" }}>{t}</div>;
    })}
  </div>
);
type Sec = "nav" | "hero" | "stats" | "programs" | "features" | "testi" | "pricing" | "cta" | "footer" | "timeline" | "instructors" | "faq" | "branches" | "contact" | "divider";
/** mini website sections drawn on the editor canvas (block look-alikes from the Design library) */
const MiniSec: React.FC<{ k: Sec; w: number; sel?: boolean; title?: string; hi?: string; cta?: string; o?: number; footerNote?: string; globalTag?: boolean }> = ({ k, w, sel, title = "Launch your career with", hi = BRAND, cta = "Browse programs", o = 1, footerNote, globalTag }) => {
  const box = (h: number, body: React.ReactNode, bg = "#fff") => <div style={{ position: "relative", height: h, background: bg, borderBottom: "1px solid #EEF2F7", outline: sel ? `2px solid ${BLUE}` : "none", outlineOffset: -2, opacity: o }}>{globalTag && <span style={{ position: "absolute", right: 8, top: 6, fontSize: 10, fontWeight: 800, color: "#7C3AED", background: "#F3E8FF", padding: "2px 6px", borderRadius: 5, zIndex: 2 }}>GLOBAL</span>}{body}</div>;
  const narrow = w < 600;
  switch (k) {
    case "nav": return box(48, <div style={{ display: "flex", alignItems: "center", height: 48, padding: "0 18px" }}><BrightLogo s={0.7} /><span style={{ flex: 1 }} />{!narrow && ["Programs", "About", "Contact"].map((x) => <span key={x} style={{ fontSize: 11.5, marginLeft: 14, color: "#374151", fontWeight: 600 }}>{x}</span>)}<span style={{ marginLeft: 14, padding: "5px 12px", borderRadius: 999, background: BP, color: "#fff", fontSize: 11, fontWeight: 700 }}>Sign in</span></div>);
    case "hero": return box(narrow ? 230 : 210, <div style={{ padding: narrow ? 16 : "26px 30px", display: "flex", gap: 20 }}><div style={{ flex: 1 }}><div style={{ fontSize: narrow ? 22 : 30, fontWeight: 900, color: "#0f172a", lineHeight: 1.12 }}>{title}<br /><span style={{ color: BP }}>{hi}</span></div><div style={{ marginTop: 8, fontSize: 12, color: "#475569" }}>Career training for customer-service and sales teams.</div><div style={{ marginTop: 12, display: "inline-block", padding: "8px 16px", borderRadius: 9, background: BP, color: "#fff", fontWeight: 800, fontSize: 12 }}>{cta}</div></div>{!narrow && <div style={{ width: 300, height: 160, borderRadius: 16, background: `linear-gradient(160deg,${BP},#134E4A)`, position: "relative" }}>{[["Online", "Learn at your pace"], ["Live classes", "Weekly with coaches"], ["Certificates", "Show your skills"]].map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 14 + (i % 2) * 140, top: 12 + i * 46, width: 130, padding: "6px 8px", borderRadius: 9, background: "#fff", boxShadow: "0 4px 10px #0003" }}><div style={{ fontSize: 11, fontWeight: 800 }}>{a}</div><div style={{ fontSize: 9.5, color: GRAY }}>{b}</div></div>)}</div>}</div>, `linear-gradient(135deg, ${BP}14, #fff 60%)`);
    case "stats": return box(64, <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 64 }}>{[["1,200+", "learners"], ["24", "programs"], ["4.8★", "rating"]].map(([a, b]) => <div key={b} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: BP }}>{a}</div><div style={{ fontSize: 10.5, color: GRAY }}>{b}</div></div>)}</div>, "#F8FAFC");
    case "programs": return box(150, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Our programs <span style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", background: "#E0F2FE", padding: "2px 6px", borderRadius: 5, marginLeft: 6 }}>LIVE DATA</span></div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["Customer Service Essentials", "Sales Conversations", "Team Lead Basics"].slice(0, narrow ? 1 : 3).map((c) => <div key={c} style={{ flex: 1, height: 90, borderRadius: 9, border: "1px solid #EEF2F7", padding: 8, boxSizing: "border-box" }}><div style={{ height: 44, borderRadius: 7, background: `linear-gradient(135deg,${BP},#14B8A6)` }} /><div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: INK }}>{c}</div></div>)}</div></div>);
    case "features": return box(120, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Why {BRAND}</div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["🎯 Job-ready skills", "🎙 AI practice calls", "🎓 Certificates"].slice(0, narrow ? 2 : 3).map((x) => <div key={x} style={{ flex: 1, padding: 10, borderRadius: 9, background: "#F8FAFC", fontSize: 11.5, fontWeight: 700 }}>{x}</div>)}</div></div>);
    case "testi": return box(120, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>What learners say</div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["“I landed a team-lead role three months after finishing.”", "“The live classes made all the difference.”"].slice(0, narrow ? 1 : 2).map((x) => <div key={x} style={{ flex: 1, padding: 10, borderRadius: 9, boxShadow: "0 3px 10px #0001", fontSize: 11, fontStyle: "italic" }}>{x}</div>)}</div></div>, `${BP}0D`);
    case "pricing": return box(150, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Choose your plan</div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{[["Starter", false], ["Career Track", true], ["Team", false]].slice(0, narrow ? 1 : 3).map(([n, pop]) => <div key={n as string} style={{ flex: 1, height: 92, borderRadius: 10, border: `2px solid ${pop ? BP : "#EEF2F7"}`, padding: 8, boxSizing: "border-box", position: "relative" }}>{pop && <span style={{ position: "absolute", top: -9, left: 10, fontSize: 9.5, fontWeight: 800, color: "#fff", background: BP, padding: "2px 6px", borderRadius: 5 }}>MOST POPULAR</span>}<div style={{ fontSize: 12, fontWeight: 800, color: INK }}>{n as string}</div><div style={{ marginTop: 4, height: 8, width: "60%", borderRadius: 4, background: "#E5E7EB" }} /><div style={{ marginTop: 6, height: 8, width: "80%", borderRadius: 4, background: "#E5E7EB" }} /></div>)}</div></div>);
    case "cta": return box(84, <div style={{ margin: "12px 22px", height: 60, borderRadius: 12, background: `linear-gradient(120deg,${BP},#134E4A)`, display: "flex", alignItems: "center", padding: "0 18px", justifyContent: "space-between" }}><span style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>Ready to start?</span><span style={{ padding: "6px 12px", borderRadius: 8, background: BP_ACC, fontWeight: 900, fontSize: 11.5 }}>Apply now</span></div>);
    case "timeline": return box(136, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>How enrollment works</div><div style={{ marginTop: 10, display: "flex", gap: 10 }}>{["Pick a program", "Choose a session", "Apply online", "Start learning"].slice(0, narrow ? 2 : 4).map((x, i) => <div key={x} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #EEF2F7", display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: BP, color: "#fff", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span><span style={{ fontSize: 11.5, fontWeight: 700 }}>{x}</span></div>)}</div></div>, "#fff");
    case "instructors": return box(150, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Meet your coaches</div><div style={{ marginTop: 10, display: "flex", gap: 12 }}>{[["Maria Lopez", "Customer service"], ["James Carter", "Sales"], ["Aisha Khan", "Leadership"]].slice(0, narrow ? 2 : 3).map(([n, r], i) => <div key={n} style={{ flex: 1, padding: 10, borderRadius: 12, background: "#F8FAFC", display: "flex", gap: 10, alignItems: "center" }}><span style={{ width: 46, height: 46, borderRadius: "50%", background: ["#14B8A6", "#F59E0B", "#6366F1"][i], color: "#fff", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{n.split(" ").map((w) => w[0]).join("")}</span><div><div style={{ fontSize: 12.5, fontWeight: 800 }}>{n}</div><div style={{ fontSize: 11, color: GRAY }}>{r}</div></div></div>)}</div></div>);
    case "faq": return box(170, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Frequently asked questions</div>{["When do the fall programs start?", "Are classes live or online?", "Do I get a certificate?", "Can I pay in installments?"].slice(0, 4).map((q, i) => <div key={q} style={{ marginTop: 6, padding: "7px 10px", borderRadius: 8, border: "1px solid #EEF2F7", display: "flex", fontSize: 11.5, fontWeight: 700 }}><span style={{ flex: 1 }}>{q}</span><span style={{ color: BP }}>{i === 0 ? "−" : "+"}</span></div>)}</div>);
    case "branches": return box(130, <div style={{ padding: "14px 22px" }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Our campuses <span style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", background: "#E0F2FE", padding: "2px 6px", borderRadius: 5, marginLeft: 6 }}>LIVE DATA</span></div><div style={{ marginTop: 8, display: "flex", gap: 10 }}>{["📍 Austin", "📍 San Antonio", "📍 Houston"].slice(0, narrow ? 2 : 3).map((x) => <div key={x} style={{ flex: 1, padding: "16px 10px", borderRadius: 10, background: `${BP}0D`, fontSize: 12.5, fontWeight: 800 }}>{x}<div style={{ fontSize: 10.5, color: GRAY, fontWeight: 600 }}>Classes Mon–Thu</div></div>)}</div></div>, "#F8FAFC");
    case "contact": return box(150, <div style={{ padding: "14px 22px", display: "flex", gap: 20 }}><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Talk to an advisor</div><div style={{ fontSize: 11.5, color: GRAY, marginTop: 4 }}>We reply within one business day.</div></div><div style={{ flex: 1.3 }}>{["Name", "Email", "Message"].map((x) => <div key={x} style={{ marginTop: 6, height: 22, borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 10.5, color: "#94A3B8", padding: "3px 8px", boxSizing: "border-box" }}>{x}</div>)}<div style={{ marginTop: 6, display: "inline-block", padding: "5px 12px", borderRadius: 7, background: BP, color: "#fff", fontSize: 11, fontWeight: 800 }}>Send</div></div></div>);
    case "divider": return box(24, <div style={{ margin: "11px 22px", height: 2, background: "#CBD5E1" }} />);
    case "footer": return box(60, <div style={{ display: "flex", alignItems: "center", height: 60, padding: "0 18px", background: "#0f172a", gap: 16 }}><BrightLogo s={0.6} dark /><span style={{ flex: 1 }} />{footerNote && <span style={{ color: "#5EEAD4", fontSize: 11, fontWeight: 700 }}>{footerNote}</span>}<span style={{ color: "#94A3B8", fontSize: 10.5 }}>© 2026 {BRAND}</span></div>, "#0f172a");
  }
  return null;
};
const CAN = { x: 280, y: 72, w: 1020, h: 776 };
const Canvas: React.FC<{ secs: { k: Sec; o?: number; sel?: boolean; title?: string; hi?: string; cta?: string; footerNote?: string; globalTag?: boolean }[]; scroll?: number; device?: "Desktop" | "Tablet" | "Mobile"; dropAt?: number }> = ({ secs, scroll = 0, device = "Desktop", dropAt = -1 }) => {
  const pw = device === "Desktop" ? 980 : device === "Tablet" ? 640 : 380;
  return (
    <div style={{ position: "absolute", left: CAN.x, top: CAN.y, width: CAN.w, height: CAN.h, background: "#E9EDF3", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: (CAN.w - pw) / 2, top: 12 - scroll, width: pw, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: "Poppins, " + FONT, boxShadow: "0 4px 16px #0F172A14" }}>
        {secs.map((s, i) => (
          <React.Fragment key={s.k + i}>
            {dropAt === i && <div style={{ height: 6, margin: "4px 20px", borderRadius: 3, background: BLUE }} />}
            <MiniSec {...s} w={pw} />
          </React.Fragment>
        ))}
        {dropAt === secs.length && <div style={{ height: 6, margin: "4px 20px", borderRadius: 3, background: BLUE }} />}
      </div>
    </div>
  );
};
const LeftPages: React.FC<{ hl?: string; extra?: string[]; o?: number }> = ({ hl, extra = [], o = 1 }) => {
  const item = (t: string, ic: string, ind = false) => <div key={t} style={{ marginTop: 4, height: 30, borderRadius: 7, display: "flex", alignItems: "center", gap: 8, padding: `0 8px 0 ${ind ? 18 : 8}px`, fontSize: 13, fontWeight: hl === t ? 800 : 600, color: hl === t ? BLUE : INK, background: hl === t ? BLUE_SOFT : "transparent" }}><span style={{ color: "#94A3B8" }}>{ic}</span>{t}</div>;
  return (
    <div style={{ position: "absolute", left: 0, top: 56, width: 260, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 12, boxSizing: "border-box", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 800, color: INK, flex: 1 }}>Pages</span><span title="Add folder" style={{ fontSize: 14, color: GRAY, marginRight: 10 }}>📁+</span><span style={{ fontSize: 16, fontWeight: 800, color: hl === "+" ? BLUE : GRAY }}>＋</span></div>
      <div style={{ marginTop: 10, fontSize: 10.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>GLOBAL</div>
      {item("Global Navbar", "▭", true)}{item("Global Footer", "▭", true)}
      <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>CUSTOM PAGES</div>
      {["Home", "About", ...extra].map((t) => item(t, "📄", true))}
      <div style={{ marginTop: 12, fontSize: 10.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>DEFAULT PAGES</div>
      {["Login", "Register", "Enrollment page"].map((t) => item(t, "🔒", true))}
    </div>
  );
};
const LeftComps: React.FC<{ hl?: string }> = ({ hl }) => (
  <div style={{ position: "absolute", left: 0, top: 56, width: 260, height: H - BAR - 56, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 12, boxSizing: "border-box" }}>
    <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Components</div><div style={{ fontSize: 11.5, color: GRAY }}>Drag onto the page</div>
    {["Section", "Container", "Grid", "2 Columns", "Heading", "Text", "Button", "Image", "Video", "Carousel", "Tabs", "Accordion", "Divider", "Spacer"].map((c) => <div key={c} style={{ marginTop: 5, height: 28, borderRadius: 7, border: `1px solid ${hl === c ? BLUE : LINE}`, background: hl === c ? BLUE_SOFT : "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 12.5, fontWeight: 600, color: INK }}><span style={{ color: "#9CA3AF" }}>⋮⋮</span>{c}</div>)}
  </div>
);
const COMP_Y = (name: string) => { const L = ["Section", "Container", "Grid", "2 Columns", "Heading", "Text", "Button", "Image", "Video", "Carousel", "Tabs", "Accordion", "Divider", "Spacer"]; return 56 + 12 + 34 + L.indexOf(name) * 33 + 14; };
const RightPanel: React.FC<{ children?: React.ReactNode; title: string }> = ({ children, title }) => (
  <div style={{ position: "absolute", left: 1316, top: 56, width: 284, height: H - BAR - 56, background: "#fff", borderLeft: `1px solid ${LINE}`, padding: 14, boxSizing: "border-box" }}>
    <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>{title}</div>{children}
  </div>
);
const FieldBox: React.FC<{ label: string; help?: string; value: string; active?: boolean; mono?: boolean }> = ({ label, help, value, active, mono }) => (
  <div style={{ marginTop: 12 }}>
    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151" }}>{label}</div>
    {help && <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{help}</div>}
    <div style={{ marginTop: 5, minHeight: 32, borderRadius: 7, border: `1px solid ${active ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: active ? "0 0 0 3px #C7D2FE" : "none", padding: "7px 9px", boxSizing: "border-box", fontSize: 12.5, color: INK, fontFamily: mono ? "monospace" : FONT }}>{value}</div>
  </div>
);
const EdStage: React.FC<{ g: number; keys: CamKey[]; page: string; press?: string; on?: string; cur: { x: number; y: number }; ripple: number; grab?: boolean; chip?: [number, string]; children: React.ReactNode }> = ({ g, keys, page, press, on, cur, ripple, grab, chip, children }) => (
  <Stage>
    <PortalTag n={1} label="Company portal" url="company.skillbnk.com" />
    <CamC g={g} keys={keys}>
      <Browser url={`company.skillbnk.com/website-builder/${SLUG}`}>
        <div style={{ position: "absolute", inset: 0, background: "#F6F7F9" }} />
        {children}
        <EdHeader page={page} press={press} on={on} />
        <Cursor x={cur.x} y={cur.y} ripple={ripple} grab={grab} />
      </Browser>
    </CamC>
    {chip && <StepChip n={chip[0]} text={chip[1]} o={fi(g, 6, 10)} />}
  </Stage>
);
/** small step caption at the bottom of the SCREEN (outside the camera) — never covers the UI */
const StepChip: React.FC<{ n: number; text: string; o?: number }> = ({ n, text, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center", zIndex: 60, opacity: o, pointerEvents: "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 22px 9px 9px", borderRadius: 999, background: "rgba(4,6,13,0.78)", border: "1px solid #ffffff22", boxShadow: "0 10px 30px #0008", fontFamily: FONT }}>
      <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#14B8A6", color: "#fff", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      <span style={{ fontSize: 21, fontWeight: 700, color: "#F1F5F9" }}>{text}</span>
    </div>
  </div>
);
const TEMPLATE: Sec[] = ["nav", "hero", "stats", "programs", "timeline", "instructors", "testi", "faq", "branches", "cta", "footer"];
const BASE: Sec[] = ["nav", "hero", "stats", "programs", "timeline", "instructors", "testi", "cta", "footer"];
const secsOf = (ks: Sec[], extra: Record<string, any> = {}) => ks.map((k) => ({ k, globalTag: k === "nav" || k === "footer", ...(extra[k] ?? {}) }));

// ═══ b0 — HOOK: "one headline change" ticket vs. doing it yourself ═══════
const SceneHookWB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 230;
  const g = gt(f, dur, D);
  const days = Math.round(interpolate(g, [20, 95], [0, 9], cl));
  const flip = g >= 105;
  const build = (i: number) => sp(g, 120 + i * 9, fps, { damping: 13 });
  const stack: Sec[] = ["nav", "hero", "stats", "programs", "timeline", "testi", "cta", "footer"];
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 10, 10) }}>
        {!flip ? (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 58, fontWeight: 900, color: "#F1F5F9", opacity: fi(g, 4, 10) }}>Want to change <span style={{ color: "#FBBF24" }}>one headline</span>?</div>
            <div style={{ position: "absolute", left: 610, top: 300, width: 700, padding: 30, borderRadius: 22, background: "#fff", boxShadow: "0 40px 100px #000C", opacity: sp(g, 16, fps), transform: `rotate(${interpolate(g, [16, 100], [-1, 1.5], cl)}deg)` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: GRAY, letterSpacing: 2 }}>TICKET #1042 · WEB DEVELOPER</div>
              <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: INK }}>Update homepage headline</div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16 }}><span style={{ fontSize: 64 }}>⏳</span><div><div style={{ fontSize: 60, fontWeight: 900, color: "#DC2626", lineHeight: 1 }}>{days} days</div><div style={{ fontSize: 18, color: GRAY }}>still waiting…</div></div></div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontSize: 44, fontWeight: 800, color: "#FCA5A5", opacity: fi(g, 60, 10) }}>Every small change waits on a developer.</div>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: 120, top: 260, width: 760 }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#8A96B2", opacity: fi(g, 106, 8) }}>Or…</div>
              <div style={{ marginTop: 6, fontSize: 70, fontWeight: 900, color: "#F1F5F9", lineHeight: 1.08, opacity: fi(g, 112, 10) }}>build it <span style={{ color: "#5EEAD4" }}>yourself</span><br />in minutes.</div>
              <div style={{ marginTop: 26, fontSize: 26, color: "#CBD5E1", opacity: fi(g, 150, 10) }}>Templates · blocks · drag and drop · AI · one-click publish</div>
            </div>
            <div style={{ position: "absolute", left: 1040, top: 70, width: 720, height: 940, borderRadius: 18, background: "#E9EDF3", overflow: "hidden", boxShadow: "0 40px 100px #000C" }}>
              <div style={{ margin: 18, background: "#fff", borderRadius: 10, overflow: "hidden", fontFamily: "Poppins, " + FONT }}>
                {stack.map((k, i) => <div key={k} style={{ opacity: build(i), transform: `translateY(${(1 - build(i)) * 60}px) scale(${0.96 + 0.04 * build(i)})` }}><MiniSec k={k} w={684} /></div>)}
              </div>
            </div>
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};

// ═══ b1 — editor header tour, timed to the voice (no tooltip overlays) ════
const TOUR = ["AI", "Library", "Settings", "Page SEO", "Preview", "Save draft", "Publish changes"];
const SceneEditorTour: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 300;
  const g = gt(f, dur, D);
  const T0 = 95, STEP = 27;  // first button ≈ when the voice says "AI"
  const step = g < T0 - 6 ? -1 : Math.min(TOUR.length - 1, Math.floor((g - T0 + 6) / STEP));
  const pts: P3[] = [[0, 800, 500], [T0 - 10, hbPt("AI").x, 30]];
  TOUR.forEach((tt, i) => { pts.push([T0 + i * STEP, hbPt(tt).x, 30]); pts.push([T0 + i * STEP + 14, hbPt(tt).x, 30]); });
  const cur = path(g, pts);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [T0 - 20, hbPt("AI").x + 120, 140, 1.8]];
  TOUR.forEach((tt, i) => keys.push([T0 + i * STEP + 6, Math.max(hbPt(tt).x - 40, hbPt("AI").x + 120), 140, 1.8]));
  keys.push([D, hbPt("Publish changes").x - 40, 140, 1.8]);
  return (
    <EdStage g={g} keys={keys} page="Home" on={step >= 0 ? TOUR[step] : undefined} cur={cur} ripple={0} chip={[1, step >= 0 ? `Editor toolbar · ${TOUR[step]}` : "The Website Builder editor"]}>
      <LeftPages hl="Home" />
      <Canvas secs={secsOf(BASE)} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
    </EdStage>
  );
};

// ═══ b2 — Pages panel: Global / Custom / Default → Add page "Programs" ═════
const ScenePages: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = gt(f, dur, D);
  const dlg = g >= 150 && g < 280 ? Math.min(fi(g, 150, 8), fo(g, 270, 8)) : 0;
  const added = g >= 280;
  const PLUS = { x: 238, y: 56 + 12 + 10 };
  const ADD = { x: 560 + 480 - 24 - 46, y: 250 + 300 - 20 - 18 };
  const cur = path(g, [[0, 800, 500], [30, 120, 130], [110, 120, 330], [130, PLUS.x, PLUS.y], [148, PLUS.x, PLUS.y], [190, 760, 360], [250, ADD.x, ADD.y], [268, ADD.x, ADD.y], [380, 140, 300]]);
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [30, 220, 200, 2.0], [70, 220, 260, 2.0], [110, 220, 360, 2.0], [140, 220, 120, 2.2], [170, 800, 420, 1.6], [270, 800, 420, 1.6], [300, 220, 260, 2.0], [380, 220, 260, 2.0]];
  return (
    <EdStage g={g} keys={keys} page={added ? "Programs" : "Home"} cur={cur} ripple={Math.max(rip(g, 144), rip(g, 264))} chip={[2, g < 140 ? "Pages · Global header & footer shared by every page" : added ? "New page — starts with your global header + footer" : "Add a page"]}>
      <LeftPages hl={added ? "Programs" : g >= 130 && g < 150 ? "+" : "Home"} extra={added ? ["Programs"] : []} />
      <Canvas secs={added ? secsOf(["nav", "footer"]) : secsOf(BASE)} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {dlg > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * dlg})`, zIndex: 25 }}>
          <div style={{ position: "absolute", left: 560, top: 250, width: 480, height: 300, borderRadius: 14, background: "#fff", padding: 24, boxSizing: "border-box", opacity: dlg }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>Add page</div>
            <div style={{ marginTop: 16, fontSize: 12.5, fontWeight: 600, color: GRAY }}>Title</div>
            <div style={{ marginTop: 6, height: 40, borderRadius: 8, border: "1px solid #A5B4FC", boxShadow: "0 0 0 3px #C7D2FE", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, color: INK }}>{typed(g, 175, "Programs", 0.6) || <span style={{ color: "#9CA3AF" }}>Page title</span>}</div>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 600, color: GRAY }}>Folder</div>
            <div style={{ marginTop: 6, height: 40, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, color: INK, justifyContent: "space-between" }}>Root <span style={{ color: "#9CA3AF" }}>⌄</span></div>
            <div style={{ position: "absolute", right: 24, bottom: 20, display: "flex", gap: 8 }}><span style={{ width: 84, textAlign: "center", padding: "9px 0", borderRadius: 8, border: `1px solid ${LINE}`, fontWeight: 700, fontSize: 14 }}>Cancel</span><span style={{ width: 92, textAlign: "center", padding: "9px 0", borderRadius: 8, background: BLUE, color: "#fff", fontWeight: 700, fontSize: 14, transform: `scale(${g >= 264 && g < 272 ? 0.93 : 1})` }}>Add page</span></div>
          </div>
        </div>
      )}
    </EdStage>
  );
};

const LibShell: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (
  <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * o})`, zIndex: 25 }}>
    <div style={{ position: "absolute", left: 200, top: 70, width: 1200, height: 740, borderRadius: 16, background: "#fff", opacity: o, overflow: "hidden" }}>{children}</div>
  </div>
);
const LibTabs: React.FC<{ tab: "Components" | "Pages" }> = ({ tab }) => (
  <div style={{ position: "absolute", right: 24, top: 24, display: "flex", padding: 3, borderRadius: 8, background: "#F3F4F6" }}>{(["Components", "Pages"] as const).map((x) => <span key={x} style={{ width: 110, textAlign: "center", padding: "7px 0", borderRadius: 6, fontSize: 13, fontWeight: 700, background: x === tab ? BLUE : "transparent", color: x === tab ? "#fff" : GRAY }}>{x}</span>)}</div>
);
const LIB_TAB_PAGES = { x: 200 + 1200 - 24 - 3 - 55, y: 70 + 24 + 17 };
const LibHead: React.FC = () => (<div style={{ position: "absolute", left: 24, top: 22 }}><div style={{ fontSize: 22, fontWeight: 800, color: INK }}>Design library</div><div style={{ fontSize: 13, color: GRAY }}>Choose a polished component or start from a complete editable page.</div></div>);

// ═══ b3 — Library → Pages → Preview "Training Academy" (Desktop/Mobile) → Use page ═
const TPL_CARD = { x: 224, y: 170, w: 520, h: 520 };
const TPL_PREVIEW = { x: TPL_CARD.x + 16 + 50, y: TPL_CARD.y + 460 + 17 };
const TPL_USE_IN_PREVIEW = { x: 200 + 1200 - 24 - 60, y: 70 + 24 + 18 };
const SceneTemplate: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const lib = g >= 26 && g < 268 ? Math.min(fi(g, 26, 8), fo(g, 260, 8)) : 0;
  const pagesTab = g >= 66;
  const previewing = g >= 104;
  const pvDevice: "Desktop" | "Mobile" = g >= 185 && g < 225 ? "Mobile" : "Desktop";
  const pvScroll = interpolate(g, [115, 180, 230, 250], [0, 620, 620, 0], cl);
  const used = g >= 268;
  const LIBB = hbPt("Library");
  const MOBT = { x: 200 + 600 + 70, y: 70 + 24 + 17 };
  const cur = path(g, [[0, 140, 300], [16, LIBB.x, 28], [28, LIBB.x, 28], [56, LIB_TAB_PAGES.x, LIB_TAB_PAGES.y], [70, LIB_TAB_PAGES.x, LIB_TAB_PAGES.y], [94, TPL_PREVIEW.x, TPL_PREVIEW.y], [106, TPL_PREVIEW.x, TPL_PREVIEW.y], [175, MOBT.x, MOBT.y], [190, MOBT.x, MOBT.y], [215, MOBT.x - 110, MOBT.y], [228, MOBT.x - 110, MOBT.y], [250, TPL_USE_IN_PREVIEW.x, TPL_USE_IN_PREVIEW.y], [264, TPL_USE_IN_PREVIEW.x, TPL_USE_IN_PREVIEW.y], [420, 1100, 520]]);
  const ripple = Math.max(rip(g, 24), rip(g, 66), rip(g, 102), rip(g, 186), rip(g, 224), rip(g, 260));
  const keys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [14, LIBB.x - 80, 120, 1.9], [30, LIBB.x - 80, 120, 1.9], [50, 1150, 200, 1.6], [72, 1150, 200, 1.6], [92, 480, 520, 1.5], [108, 480, 520, 1.5], [120, 800, 440, 1.05], [240, 800, 440, 1.05], [252, 1250, 180, 1.7], [266, 1250, 180, 1.7], [285, 790, 430, 1.05], [420, 790, 430, 1.05]];
  const chip: [number, string] = !pagesTab ? [3, "Design library"] : !previewing ? [3, "Pages tab · complete page templates"] : !used ? [3, `Preview the template · ${pvDevice}`] : [3, "Use page — the whole page is ready to edit"];
  const pvW = pvDevice === "Desktop" ? 1100 : 380;
  return (
    <EdStage g={g} keys={keys} page="Programs" press={g >= 24 && g < 32 ? "Library" : undefined} on={lib > 0.5 ? "Library" : undefined} cur={cur} ripple={ripple} chip={chip}>
      <LeftPages hl="Programs" extra={["Programs"]} />
      <Canvas secs={used ? TEMPLATE.map((k, i) => ({ k, globalTag: k === "nav" || k === "footer", o: k === "nav" || k === "footer" ? 1 : interpolate(g, [270 + i * 8, 285 + i * 8], [0, 1], cl) })) : secsOf(["nav", "footer"])} scroll={used ? interpolate(g, [330, 415], [0, 820], cl) : 0} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {lib > 0.01 && (
        <LibShell o={lib}>
          {!previewing ? (
            <>
              <LibHead /><LibTabs tab={pagesTab ? "Pages" : "Components"} />
              {pagesTab ? [["Training Academy", "An education-first page connected to live programs and learner outcomes.", "Institutes and training providers", "#d97706"], ["SaaS Marketing", "A product marketing page with features, pricing and calls to action.", "Software & services", "#7c3aed"]].map(([n, d, a, c], i) => (
                <div key={n} style={{ position: "absolute", left: TPL_CARD.x - 200 + i * 560, top: TPL_CARD.y - 70, width: TPL_CARD.w, height: TPL_CARD.h, borderRadius: 14, border: `${i === 0 && g >= 90 ? 2 : 1}px solid ${i === 0 && g >= 90 ? BLUE : LINE}`, overflow: "hidden", opacity: fi(g, 66 + i * 4, 8) }}>
                  <div style={{ height: 330, background: `${c}10`, overflow: "hidden" }}><div style={{ transform: "scale(0.52)", transformOrigin: "0 0", width: 980, margin: "12px 0 0 12px", background: "#fff" }}>{(i === 0 ? TEMPLATE : (["nav", "hero", "features", "pricing", "testi", "cta"] as Sec[])).map((k) => <MiniSec key={k} k={k} w={980} />)}</div></div>
                  <div style={{ padding: 16 }}><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{n}</div><div style={{ marginTop: 4, fontSize: 13, color: GRAY }}>{d}</div><div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: c as string }}>{a}</div></div>
                  <span style={{ position: "absolute", left: 16, top: 460, width: 100, height: 34, borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i === 0 && g >= 102 && g < 108 ? 0.92 : 1})` }}>👁 Preview</span>
                  <span style={{ position: "absolute", left: 126, top: 460, width: 100, height: 34, borderRadius: 7, background: BLUE, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Use page</span>
                </div>
              )) : <div style={{ position: "absolute", left: 24, top: 90, fontSize: 14, color: GRAY }}>Hero · Content · Forms · Dynamic · Conversion · Social proof</div>}
            </>
          ) : (
            <>
              <div style={{ position: "absolute", left: 24, top: 26, display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>← Back to library</span><span style={{ fontSize: 13, color: GRAY }}>Previewing <b style={{ color: INK }}>Training Academy</b></span></div>
              <div style={{ position: "absolute", left: 600, top: 24, display: "flex", border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>{["Desktop", "Tablet", "Mobile"].map((d) => <span key={d} style={{ width: 90, textAlign: "center", padding: "7px 0", fontSize: 12.5, fontWeight: 700, background: d === pvDevice ? BLUE_SOFT : "#fff", color: d === pvDevice ? BLUE : GRAY }}>{d}</span>)}</div>
              <span style={{ position: "absolute", right: 24, top: 24, width: 120, height: 36, borderRadius: 8, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 258 && g < 266 ? 0.92 : 1})` }}>Use page</span>
              <div style={{ position: "absolute", left: 24, top: 76, width: 1152, height: 640, borderRadius: 10, background: "#E9EDF3", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: (1152 - pvW) / 2, top: 12 - pvScroll, width: pvW, background: "#fff", borderRadius: 8, overflow: "hidden", fontFamily: "Poppins, " + FONT }}>{TEMPLATE.map((k) => <MiniSec key={k} k={k} w={pvW} />)}</div>
              </div>
            </>
          )}
        </LibShell>
      )}
    </EdStage>
  );
};

// ═══ b4 — Library → Components → Conversion → Add block "Pricing" → drag a Divider ═
const BLK = (i: number) => ({ x: 224 + (i % 2) * 580, y: 210 + Math.floor(i / 2) * 270, w: 560, h: 250 });
const BLK_ADD = (i: number) => ({ x: BLK(i).x + 124 + 55, y: BLK(i).y + 200 + 17 });
const SceneAddBlocks: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const lib = g >= 26 && g < 140 ? Math.min(fi(g, 26, 8), fo(g, 132, 8)) : 0;
  const pricing = g >= 140;
  const drag = g >= 220 && g < 300;
  const dropped = g >= 300;
  const LIBB = hbPt("Library");
  const ADDB = BLK_ADD(0);
  const SCROLL = 380;
  const dropY = CAN.y + 12 - SCROLL + 48 + 210 + 64 + 150 + 150 - 2;
  const from = { x: 120, y: COMP_Y("Divider") };
  const to = { x: 790, y: dropY };
  const cur = path(g, [[0, 900, 500], [16, LIBB.x, 28], [28, LIBB.x, 28], [80, ADDB.x, ADDB.y], [122, ADDB.x, ADDB.y], [196, from.x, from.y], [220, from.x, from.y], [296, to.x, to.y], [420, to.x + 40, to.y + 80]]);
  const secs: Sec[] = ["nav", "hero", "stats", "programs", ...(pricing ? (["pricing"] as Sec[]) : []), ...(dropped ? (["divider"] as Sec[]) : []), "timeline", "instructors", "testi", "cta", "footer"];
  const keys: CamKey[] = [[0, 790, 430, 1.05], [14, LIBB.x - 80, 120, 1.9], [30, LIBB.x - 80, 120, 1.9], [60, 520, 380, 1.5], [124, 520, 380, 1.5], [150, 790, 430, 1.1], [190, 300, 450, 1.55], [230, 300, 600, 1.55], [290, 760, 360, 1.5], [420, 760, 360, 1.5]];
  const chip: [number, string] = g < 140 ? [4, "Design library · ready-made blocks"] : g < 200 ? [4, "Pricing block added"] : [4, "Drag any component exactly where you want it"];
  return (
    <EdStage g={g} keys={keys} page="Programs" on={lib > 0.5 ? "Library" : undefined} press={g >= 24 && g < 32 ? "Library" : undefined} cur={cur} ripple={Math.max(rip(g, 24), rip(g, 116))} grab={drag} chip={chip}>
      {g < 160 ? <LeftPages hl="Programs" extra={["Programs"]} /> : <LeftComps hl={drag ? "Divider" : undefined} />}
      <Canvas secs={secs.map((k) => ({ k, globalTag: k === "nav" || k === "footer", sel: (k === "pricing" && g >= 140 && g < 210) || (k === "divider" && dropped), o: k === "pricing" ? fi(g, 140, 10) : k === "divider" ? fi(g, 300, 8) : 1 }))} scroll={pricing ? interpolate(g, [140, 170], [0, SCROLL], cl) : 0} dropAt={drag && g > 260 ? 5 : -1} />
      <RightPanel title={g >= 140 && g < 210 ? "Pricing" : dropped ? "Divider" : "Page"}><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>{g >= 140 && g < 210 ? "Compare plans, benefits, and conversion actions." : dropped ? "Spacing and line style." : "Select a block to edit its content and style."}</div></RightPanel>
      {drag && <div style={{ position: "absolute", left: cur.x + 12, top: cur.y + 10, padding: "6px 12px", borderRadius: 8, background: "#fff", border: `2px solid ${BLUE}`, fontSize: 13, fontWeight: 700, color: BLUE, zIndex: 40 }}>⋮⋮ Divider</div>}
      {lib > 0.01 && (
        <LibShell o={lib}>
          <LibHead /><LibTabs tab="Components" />
          <div style={{ position: "absolute", left: 24, top: 86, display: "flex", gap: 8 }}>{["All", "Hero", "Content", "Forms", "Dynamic", "Conversion", "Social proof"].map((x) => <span key={x} style={{ padding: "7px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: x === "Conversion" ? INK : "#F3F4F6", color: x === "Conversion" ? "#fff" : "#374151" }}>{x}</span>)}</div>
          {[["Pricing", "Compare plans, benefits, and conversion actions.", "$", "#0891b2"], ["Frequently Asked Questions", "Expandable answers for common visitor questions.", "?", "#ea580c"], ["Card Grid", "Reusable linked cards for offers, resources, or services.", "▤", "#7c3aed"], ["Call to Action", "A focused standalone conversion button.", "→", "#059669"]].map(([n, d, ic, c], i) => {
            const b = BLK(i);
            return (
              <div key={n} style={{ position: "absolute", left: b.x - 200, top: b.y - 70, width: b.w, height: b.h, borderRadius: 12, border: `${i === 0 && g >= 76 ? 2 : 1}px solid ${i === 0 && g >= 76 ? BLUE : LINE}`, overflow: "hidden" }}>
                <div style={{ height: 120, background: `${c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: c }}>{ic}</div>
                <div style={{ position: "absolute", left: 14, top: 130 }}><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{n}</div><div style={{ fontSize: 12.5, color: GRAY, marginTop: 3 }}>{d}</div></div>
                <span style={{ position: "absolute", left: 14, top: 200, width: 100, height: 34, borderRadius: 7, border: `1px solid ${LINE}`, fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>👁 Preview</span>
                <span style={{ position: "absolute", left: 124, top: 200, width: 110, height: 34, borderRadius: 7, background: BLUE, color: "#fff", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i === 0 && g >= 116 && g < 124 ? 0.92 : 1})` }}>+ Add block</span>
              </div>
            );
          })}
        </LibShell>
      )}
    </EdStage>
  );
};

// ═══ b5 — select the hero → edit fields (with real help texts) → style ═════
const SceneFields: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const sel = g >= 40;
  const line1 = g < 90 ? "Launch your career with" : typed(g, 90, "Start your new career at", 0.9) || "";
  const hi = g < 170 ? BRAND : typed(g, 170, "Brightpath this fall", 0.9) || "";
  const cta = g < 250 ? "Browse programs" : typed(g, 250, "See fall programs", 0.9) || "";
  const HERO = { x: 600, y: 210 };
  const F1 = { x: 1450, y: 160 }, F2 = { x: 1450, y: 250 }, F3 = { x: 1450, y: 340 };
  const cur = path(g, [[0, 900, 500], [30, HERO.x, HERO.y], [44, HERO.x, HERO.y], [80, F1.x, F1.y], [160, F1.x, F1.y], [170, F2.x, F2.y], [240, F2.x, F2.y], [250, F3.x, F3.y], [330, F3.x, F3.y], [420, 1450, 520]]);
  const keys: CamKey[] = [[0, 790, 430, 1.05], [30, 640, 230, 1.5], [60, 640, 230, 1.5], [80, 1280, 230, 1.6], [330, 1280, 300, 1.6], [360, 900, 300, 1.3], [420, 900, 300, 1.3]];
  return (
    <EdStage g={g} keys={keys} page="Programs" cur={cur} ripple={rip(g, 40)} chip={[5, "Click a block · edit its text and style"]}>
      <LeftComps />
      <Canvas secs={["nav", "hero", "stats", "programs", "pricing"].map((k) => ({ k: k as Sec, globalTag: k === "nav", sel: k === "hero" && sel, title: line1, hi, cta }))} />
      <RightPanel title={sel ? "Academy Hero" : "Page"}>
        {sel ? (
          <div style={{ opacity: fi(g, 40, 8) }}>
            <FieldBox label="Title line" help="One line of the stacked hero title." value={line1} active={g >= 80 && g < 165} />
            <FieldBox label="Highlight" help="Highlighted word or phrase inside the hero title." value={hi} active={g >= 165 && g < 245} />
            <FieldBox label="CTA label" help="Optional icon displayed next to the CTA label." value={cta} active={g >= 245 && g < 330} />
            <div style={{ marginTop: 16, fontSize: 11.5, fontWeight: 800, color: GRAY, letterSpacing: 1 }}>STYLE</div>
            {[["Padding", "Default"], ["Background", BP], ["Text align", "Left"]].map(([a, b]) => <div key={a} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span style={{ color: "#374151", fontWeight: 600 }}>{a}</span><span style={{ color: GRAY, fontFamily: "monospace" }}>{b}</span></div>)}
          </div>
        ) : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}
      </RightPanel>
    </EdStage>
  );
};

// ═══ b6 — Build with AI: Section → describe → Look → Generate section → Add to page ═
const AI_PROMPT = "A short FAQ section for our fall programs: schedule, live classes, certificates, and payment options.";
const AIM = { x: 300, y: 90, w: 1000, h: 640 };
const AI_GEN = { x: AIM.x + AIM.w - 26 - 95, y: AIM.y + AIM.h - 22 - 21 };
const AI_ADD = { x: AIM.x + AIM.w - 26 - 14 - 65, y: AIM.y + 392 + 28 };
const AI_BOX = { x: AIM.x + 400, y: AIM.y + 176 + 55 };
const SceneAiSection: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const m = g >= 26 && g < 300 ? Math.min(fi(g, 26, 8), fo(g, 292, 8)) : 0;
  const gen = interpolate(g, [220, 250], [0, 1], cl);
  const added = g >= 296;
  const AIB = hbPt("AI");
  const cur = path(g, [[0, 900, 500], [16, AIB.x, 28], [28, AIB.x, 28], [60, AI_BOX.x, AI_BOX.y], [180, AI_BOX.x, AI_BOX.y], [204, AI_GEN.x, AI_GEN.y], [222, AI_GEN.x, AI_GEN.y], [262, AI_ADD.x, AI_ADD.y], [290, AI_ADD.x, AI_ADD.y], [420, 900, 560]]);
  const SCROLL = 380;
  const keys: CamKey[] = [[0, 790, 430, 1.05], [14, AIB.x - 60, 120, 2.0], [30, AIB.x - 60, 120, 2.0], [56, 760, 380, 1.5], [196, 760, 380, 1.5], [214, 1050, 600, 1.6], [240, 1050, 600, 1.6], [262, 1050, 480, 1.6], [292, 1050, 480, 1.6], [320, 790, 430, 1.1], [420, 790, 430, 1.1]];
  const secs: Sec[] = ["nav", "hero", "stats", "programs", "pricing", ...(added ? (["faq"] as Sec[]) : []), "timeline", "testi", "footer"];
  const chip: [number, string] = g < 210 ? [6, "Build with AI · Section from a prompt"] : !added ? [6, "Generate section → Add to page"] : [6, "AI section added — fully editable"];
  return (
    <EdStage g={g} keys={keys} page="Programs" on={m > 0.5 ? "AI" : undefined} press={g >= 24 && g < 32 ? "AI" : undefined} cur={cur} ripple={Math.max(rip(g, 24), rip(g, 218), rip(g, 286))} chip={chip}>
      <LeftComps />
      <Canvas secs={secs.map((k) => ({ k, globalTag: k === "nav" || k === "footer", sel: k === "faq", o: k === "faq" ? fi(g, 296, 12) : 1 }))} scroll={added ? interpolate(g, [296, 330], [0, SCROLL], cl) : 0} />
      <RightPanel title={added ? "Frequently asked questions" : "Page"}>{added ? <div style={{ opacity: fi(g, 300, 8) }}><FieldBox label="Title" value="Frequently asked questions" /><FieldBox label="Question 1" value="When do the fall programs start?" /><FieldBox label="Question 2" value="Are classes live or online?" /></div> : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}</RightPanel>
      {m > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * m})`, zIndex: 25 }}>
          <div style={{ position: "absolute", left: AIM.x, top: AIM.y, width: AIM.w, height: AIM.h, borderRadius: 16, background: "#fff", opacity: m }}>
            <div style={{ position: "absolute", left: 26, top: 24, fontSize: 22, fontWeight: 800, color: INK }}>✨ Build with AI</div>
            <div style={{ position: "absolute", left: 26, right: 26, top: 66, display: "flex", gap: 10 }}>{[["Section", "One section from a prompt"], ["Full page", "A complete page"], ["Import HTML", "Convert an HTML file"]].map(([tt, s], i) => <div key={tt} style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `${i === 0 ? 2 : 1}px solid ${i === 0 ? BLUE : LINE}`, background: i === 0 ? BLUE_SOFT : "#fff" }}><div style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? BLUE : INK }}>{tt}</div><div style={{ fontSize: 12.5, color: GRAY }}>{s}</div></div>)}</div>
            <div style={{ position: "absolute", left: 26, top: 150, fontSize: 14, fontWeight: 800, color: "#374151" }}>Describe the section</div>
            <div style={{ position: "absolute", left: 26, right: 26, top: 176, height: 110, borderRadius: 10, border: `1px solid ${g >= 60 && g < 200 ? "#A5B4FC" : "#D1D5DB"}`, boxShadow: g >= 60 && g < 200 ? "0 0 0 3px #C7D2FE" : "none", padding: 12, boxSizing: "border-box", fontSize: 15, color: INK, lineHeight: 1.5 }}>{typed(g, 64, AI_PROMPT, 0.95) || <span style={{ color: "#9CA3AF" }}>e.g. A pricing section for an online coding bootcamp with three plans…</span>}</div>
            <div style={{ position: "absolute", left: 26, top: 300, fontSize: 14, fontWeight: 800, color: "#374151" }}>Look</div>
            <div style={{ position: "absolute", left: 26, top: 326, display: "flex", gap: 8 }}>{["Match brand", "Clean light", "Bold dark", "Vibrant", "Editorial"].map((x, i) => <span key={x} style={{ padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: i === 0 ? INK : "#F3F4F6", color: i === 0 ? "#fff" : "#374151" }}>{x}</span>)}</div>
            {gen > 0 && gen < 1 && <div style={{ position: "absolute", left: 26, right: 26, top: 400, display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>✨ Generating section…</span><div style={{ flex: 1, height: 8, borderRadius: 4, background: "#E0E7FF" }}><div style={{ width: `${gen * 100}%`, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#7C3AED,#2563EB)" }} /></div></div>}
            {gen >= 1 && <div style={{ position: "absolute", left: 26, right: 26, top: 392, height: 56, borderRadius: 10, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", boxSizing: "border-box", opacity: fi(g, 250, 8) }}><span style={{ fontSize: 13.5 }}><b>Frequently asked questions</b> · AI, fully editable</span><span style={{ flex: 1 }} /><span style={{ width: 130, height: 36, borderRadius: 8, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 286 && g < 294 ? 0.92 : 1})` }}>＋ Add to page</span></div>}
            {gen >= 1 && <div style={{ position: "absolute", left: 26, right: 26, top: 458, height: 150, borderRadius: 10, overflow: "hidden", border: `1px solid ${LINE}`, opacity: fi(g, 252, 8) }}><MiniSec k="faq" w={948} /></div>}
            <span style={{ position: "absolute", right: 26, bottom: 22, width: 190, height: 42, borderRadius: 9, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 14.5, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${g >= 218 && g < 226 ? 0.93 : 1})` }}>✨ Generate section</span>
          </div>
        </div>
      )}
    </EdStage>
  );
};

// ═══ b7 — Global Footer: edit once, it updates on every page ═══════════════
const SceneGlobal: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 380;
  const g = gt(f, dur, D);
  const onFooter = g >= 50;
  const note = g < 120 ? "" : typed(g, 120, "Call us: (512) 555-0186", 0.9);
  const pagesPeek = g >= 250;
  const GF = { x: 110, y: 56 + 12 + 26 + 4 + 34 + 15 };
  const NOTE = { x: 1450, y: 160 };
  const cur = path(g, [[0, 900, 500], [30, GF.x, GF.y], [46, GF.x, GF.y], [100, NOTE.x, NOTE.y], [220, NOTE.x, NOTE.y], [380, 900, 600]]);
  const keys: CamKey[] = [[0, 790, 430, 1.05], [24, 200, 140, 2.2], [48, 200, 140, 2.2], [80, 1100, 200, 1.5], [230, 1100, 200, 1.5], [260, 790, 430, 1.05], [380, 790, 430, 1.05]];
  return (
    <EdStage g={g} keys={keys} page={onFooter ? "Global Footer" : "Programs"} cur={cur} ripple={rip(g, 44)} chip={[7, pagesPeek ? "Edit once — every page gets the new footer" : "Global Footer"]}>
      <LeftPages hl={onFooter ? "Global Footer" : "Programs"} extra={["Programs"]} />
      {!pagesPeek ? (
        <Canvas secs={onFooter ? [{ k: "footer", footerNote: note, sel: true, globalTag: true }] : secsOf(["nav", "hero", "footer"])} />
      ) : (
        <div style={{ position: "absolute", left: CAN.x, top: CAN.y, width: CAN.w, height: CAN.h, background: "#E9EDF3", borderRadius: 12, overflow: "hidden" }}>
          {["Home", "About", "Programs"].map((p, i) => (
            <div key={p} style={{ position: "absolute", left: 20 + i * 330, top: 40, width: 310, height: 680, borderRadius: 10, background: "#fff", overflow: "hidden", opacity: sp(g, 250 + i * 10, fps), boxShadow: "0 6px 18px #0F172A1A" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: GRAY, padding: "8px 10px", borderBottom: "1px solid #EEF2F7" }}>{p}</div>
              <div style={{ transform: "scale(0.31)", transformOrigin: "0 0", width: 1000 }}>{(["nav", "hero", "stats", "programs", "features", "cta"] as Sec[]).map((k) => <MiniSec key={k} k={k} w={980} />)}</div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}><MiniSec k="footer" w={310} footerNote="Call us: (512) 555-0186" /></div>
            </div>
          ))}
        </div>
      )}
      <RightPanel title={onFooter ? "Global Footer" : "Page"}>
        {onFooter ? <div style={{ opacity: fi(g, 50, 8) }}><FieldBox label="Contact line" value={note || ""} active={g >= 100 && g < 230} /><FieldBox label="Copyright" value={`© 2026 ${BRAND}`} /></div> : <div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div>}
      </RightPanel>
    </EdStage>
  );
};

// ═══ b8 — Preview on Desktop / Tablet / Mobile + Page SEO ══════════════════
const ScenePreviewSeo: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 400;
  const g = gt(f, dur, D);
  const device: "Desktop" | "Tablet" | "Mobile" = g < 60 ? "Desktop" : g < 120 ? "Tablet" : "Mobile";
  const seo = g >= 190 && g < 380 ? Math.min(fi(g, 190, 8), fo(g, 370, 8)) : 0;
  const SEOB = hbPt("Page SEO");
  const cur = path(g, [[0, 900, 500], [170, SEOB.x, 28], [188, SEOB.x, 28], [230, 800, 330], [400, 800, 430]]);
  const keys: CamKey[] = [[0, 790, 430, 1.05], [40, 790, 430, 1.05], [170, SEOB.x - 60, 110, 2.0], [190, SEOB.x - 60, 110, 2.0], [220, 800, 420, 1.45], [370, 800, 420, 1.45], [400, 790, 430, 1.05]];
  const sTitle = typed(g, 230, "Fall 2026 Programs | Brightpath Academy", 1.1);
  const sDesc = typed(g, 270, "Career training in customer service and sales. Online and live classes, with certificates.", 1.6);
  return (
    <EdStage g={g} keys={keys} page="Programs" on={seo > 0.5 ? "Page SEO" : undefined} press={g >= 184 && g < 192 ? "Page SEO" : undefined} cur={cur} ripple={rip(g, 184)} chip={[8, g < 170 ? `Preview · ${device}` : "Page SEO · search preview"]}>
      <LeftComps />
      <Canvas device={device} secs={(["nav", "hero", "stats", "programs", "pricing", "features", "footer"] as Sec[]).map((k) => ({ k, globalTag: k === "nav" || k === "footer" }))} />
      <div style={{ position: "absolute", left: CAN.x + CAN.w / 2 - 150, top: 800, width: 300, display: "flex", borderRadius: 9, background: "#fff", border: `1px solid ${LINE}`, overflow: "hidden", zIndex: 8 }}>{["Desktop", "Tablet", "Mobile"].map((d) => <span key={d} style={{ flex: 1, textAlign: "center", padding: "8px 0", fontSize: 13, fontWeight: 800, background: d === device ? BLUE : "#fff", color: d === device ? "#fff" : GRAY }}>{d === "Desktop" ? "🖥" : d === "Tablet" ? "▭" : "📱"} {d}</span>)}</div>
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {seo > 0.01 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * seo})`, zIndex: 25 }}>
          <div style={{ position: "absolute", left: 380, top: 110, width: 840, height: 600, borderRadius: 16, background: "#fff", padding: 26, boxSizing: "border-box", opacity: seo }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: INK }}>Page SEO · Programs</div>
            <FieldBox label="SEO title" value={sTitle || "Leave empty to use Site SEO title"} active={g >= 230 && g < 268} />
            <FieldBox label="Meta description" value={sDesc || "Leave empty to use Site SEO description"} active={g >= 268} />
            <div style={{ marginTop: 18, fontSize: 12.5, fontWeight: 700, color: "#374151" }}>Search preview</div>
            <div style={{ marginTop: 8, padding: 14, borderRadius: 10, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 12.5, color: "#16A34A" }}>{DOMAIN} › programs</div>
              <div style={{ fontSize: 18, color: "#1A0DAB", marginTop: 2 }}>{sTitle || "Programs"}</div>
              <div style={{ fontSize: 13, color: "#4D5156", marginTop: 2 }}>{sDesc}</div>
            </div>
          </div>
        </div>
      )}
    </EdStage>
  );
};

// ═══ b9 — Save draft → Publish changes → Live → the real site ══════════════
const ScenePublish: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 430;
  const g = gt(f, dur, D);
  const live = g >= 200;
  const SAVEB = hbPt("Save draft"), PUBB = hbPt("Publish changes"), LIVEB = hbPt("Live");
  const cur = path(g, [[0, 900, 500], [30, SAVEB.x, 28], [46, SAVEB.x, 28], [90, PUBB.x, 28], [106, PUBB.x, 28], [160, LIVEB.x, 28], [178, LIVEB.x, 28], [200, LIVEB.x, 28]]);
  const keys: CamKey[] = live ? [[0, WIDE_X, WIDE_Y, 1], [430, WIDE_X, WIDE_Y, 1]] : [[0, 790, 430, 1.05], [28, SAVEB.x - 80, 110, 2.1], [90, PUBB.x - 100, 110, 2.1], [150, LIVEB.x - 140, 110, 2.1], [200, LIVEB.x - 140, 110, 2.1]];
  if (live) {
    return (
      <Stage>
        <PortalTag n={2} label="Your website" url={DOMAIN} />
        <CamC g={g} keys={keys}>
          <Browser url={`${DOMAIN}/programs`}>
            <div style={{ position: "absolute", inset: 0, opacity: fi(g, 200, 10) }}><BrightSite g={g - 200} fps={fps} scroll={interpolate(g, [220, 420], [0, SITE_H - 856], cl)} /></div>
          </Browser>
        </CamC>
      </Stage>
    );
  }
  return (
    <EdStage g={g} keys={keys} page="Programs" press={g >= 42 && g < 50 ? "Save draft" : g >= 102 && g < 110 ? "Publish changes" : g >= 174 && g < 182 ? "Live" : undefined} cur={cur} ripple={Math.max(rip(g, 42), rip(g, 102), rip(g, 174))} chip={[9, g < 100 ? "Save draft" : "Publish changes → Live"]}>
      <LeftComps />
      <Canvas secs={(["nav", "hero", "stats", "programs", "pricing", "features", "footer"] as Sec[]).map((k) => ({ k, globalTag: k === "nav" || k === "footer" }))} />
      <RightPanel title="Page"><div style={{ marginTop: 10, fontSize: 12.5, color: GRAY }}>Select a block to edit its content and style.</div></RightPanel>
      {g >= 48 && g < 104 && <Toast g={g} at={48} text="Draft saved" x={1180} y={70} />}
      {g >= 108 && <Toast g={g} at={108} text="Page and global design published" x={1000} y={70} />}
    </EdStage>
  );
};

// ═══ b10 — WRAP ════════════════════════════════════════════════════════════
const SceneWrapWB: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 200;
  const g = gt(f, dur, D);
  const steps = [["📄", "Pages", "Global header & footer"], ["▤", "Library", "Blocks + page templates"], ["⋮⋮", "Drag & drop", "Every section"], ["✨", "AI", "Sections from a prompt"], ["🚀", "Publish", "Live in one click"]];
  const logo = sp(g, 4, fps, { damping: 14 });
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: fo(g, D - 8, 8) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}><Img src={staticFile("skillbnk-logo.png")} style={{ width: 380 }} /></div>
        <div style={{ position: "absolute", left: 110, top: 340, width: 1700, display: "flex", gap: 22 }}>
          {steps.map(([ic, t, s], i) => { const p = sp(g, 20 + i * 10, fps); return <div key={t} style={{ flex: 1, height: 230, borderRadius: 22, background: "linear-gradient(180deg,#101A32,#0B1224)", border: "1px solid #2E5CF666", opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 48 }}>{ic}</div><div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#F1F5F9" }}>{t}</div><div style={{ marginTop: 6, fontSize: 17, color: "#8A96B2" }}>{s}</div></div>; })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#F1F5F9", opacity: fi(g, 80, 12) }}>Your website. <span style={{ color: "#5EEAD4" }}>No developer needed.</span></div>
      </AbsoluteFill>
    </Stage>
  );
};
