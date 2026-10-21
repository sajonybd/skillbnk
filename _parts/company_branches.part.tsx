// ═══ COMPANY PORTAL: course → Branches tab → select offices → Save ═══════════
// Real UI (see plan-portals doc): edit tabs Course info | Branches | Progress settings |
// Layout & content, "Preview"; Branches tab: Select All / Deselect All / Save,
// "Search branches…", grid of branch cards (checkbox, logo, name + slug, 📍, 📞, 👤).
const CO2_MENU: { t: string; child?: boolean; more?: boolean; open?: boolean }[] = [
  { t: "Dashboard" }, { t: "Branch Management" }, { t: "Courses & Programs", open: true }, { t: "Programs", child: true }, { t: "Courses", child: true },
  { t: "Categories", child: true }, { t: "Mentors and Trainer", child: true }, { t: "Sessions", child: true },
  { t: "Attendance", more: true }, { t: "Staff Management", more: true }, { t: "Marketing", more: true },
  { t: "Form Builder" }, { t: "Menu Builder" }, { t: "Website Builder" }, { t: "Enrollment form Builder" }, { t: "Integrations" },
];
const CompanyShell2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: H - BAR, background: "#fff", borderRight: `1px solid ${LINE}`, padding: "14px 12px", boxSizing: "border-box" }}>
      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: "8px 10px" }}><KeyLogo sub="Change company" /></div>
      <div style={{ marginTop: 10, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13.5, color: "#9CA3AF" }}>⌕ Search...</div>
      {CO2_MENU.map((m, i) => {
        const on = m.t === "Courses";
        return (
          <div key={m.t} style={{ position: "absolute", left: 12, top: 120 + i * 34, width: SIDE - 24, height: 32, display: "flex", alignItems: "center", gap: 9, paddingLeft: m.child ? 30 : 6, paddingRight: 6, boxSizing: "border-box", borderRadius: 7, background: on ? BLUE_SOFT : "transparent", color: on ? BLUE : "#1F2937", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
            {!m.child && <Ico c={on ? BLUE : "#4B5563"} s={14} />}
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{m.t}</span>
            {m.more && <Chevron />}
            {m.open && <span style={{ color: "#9CA3AF", fontSize: 11 }}>⌄</span>}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: SIDE, top: 0, width: W - SIDE, height: HEAD, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, boxSizing: "border-box" }}>
      <Ico s={18} />
      <div style={{ flex: 1 }} />
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔔</div>
      <Avatar t={RACHEL_AV.t} c1={RACHEL_AV.c1} c2={RACHEL_AV.c2} />
    </div>
    <div style={{ position: "absolute", left: SIDE, top: HEAD, width: W - SIDE, height: H - BAR - HEAD, overflow: "hidden", background: "#F6F7F9" }}>{children}</div>
  </>
);
const SceneOffices: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 330;
  const g = gt(f, dur, D);
  const onTab = g >= 46;
  const TAB = { x: MX(300), y: MY(110) };
  const card = (i: number) => ({ x: MX(40 + i * 430 + 200), y: MY(300) });
  const SAVE = { x: MX(1270), y: MY(176) };
  const picks = [100, 150, 200];
  const cur = path(g, [[0, 900, 600], [30, TAB.x, TAB.y], [50, TAB.x, TAB.y], [90, card(0).x, card(0).y], [104, card(0).x, card(0).y], [140, card(1).x, card(1).y], [154, card(1).x, card(1).y], [190, card(2).x, card(2).y], [204, card(2).x, card(2).y], [250, SAVE.x, SAVE.y], [272, SAVE.x, SAVE.y], [330, SAVE.x, SAVE.y]]);
  const ripple = Math.max(rip(g, 44), rip(g, picks[0]), rip(g, picks[1]), rip(g, picks[2]), rip(g, 266));
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [24, 600, 200, 1.4], [56, 600, 200, 1.4], [80, WIDE_X, 380, 1.15], [220, WIDE_X, 380, 1.15], [244, 1300, 220, 1.5], [290, 1300, 220, 1.5], [330, WIDE_X, WIDE_Y, 1.05]];
  return (
    <Stage>
      <PortalTag n={OFFICES_TAG} label="Company portal" url="company.skillbnk.com" />
      <CamC g={g} keys={camKeys}>
        <Browser url={`company.skillbnk.com/courses/${COURSE_SLUG}`}>
          <CompanyShell2>
            <PageTitle t={`Edit Program · ${COURSE}`} sub={PROGRAM} />
            <Btn x={1210} y={22} w={120} h={42} label="👁 Preview" fs={14} />
            <div style={{ position: "absolute", left: 20, top: 84, display: "flex", gap: 6, padding: 5, borderRadius: 10, background: "#fff", border: `1px solid ${LINE}` }}>
              {["Course info", "Branches", "Progress settings", "Layout & content"].map((t) => {
                const on = (t === "Branches") === onTab;
                return <div key={t} style={{ padding: "9px 18px", borderRadius: 8, fontSize: 15, fontWeight: 700, background: on ? BLUE : "transparent", color: on ? "#fff" : "#374151" }}>{t}</div>;
              })}
            </div>
            <div style={{ position: "absolute", left: 20, top: 146, width: 1310, height: 640, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}` }}>
              {!onTab ? (
                <div style={{ padding: 30 }}>
                  {[["Title", COURSE], ["Program", PROGRAM], ["Type", "course"], ["Language", "English"], ["Delivery Type", "Native"]].map(([a, b]) => (
                    <div key={a} style={{ display: "flex", gap: 20, padding: "14px 0", borderBottom: `1px solid ${LINE}`, fontSize: 16 }}><span style={{ width: 200, color: GRAY, fontWeight: 600 }}>{a}</span><span style={{ color: INK, fontWeight: 700 }}>{b}</span></div>
                  ))}
                </div>
              ) : (
                <div style={{ opacity: fi(g, 46, 8) }}>
                  <div style={{ position: "absolute", left: 24, top: 18, width: 420, height: 42, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 14.5, color: "#9CA3AF" }}>⌕ Search branches…</div>
                  <Btn x={890} y={18} w={120} h={42} label="Select All" fs={14} />
                  <Btn x={1020} y={18} w={140} h={42} label="Deselect All" fs={14} />
                  <Btn x={1170} y={18} w={116} h={42} label="Save" primary fs={14.5} press={g >= 266 && g < 272 ? 1 : 0} />
                  {OFFICES.map((o, i) => {
                    const on = g >= picks[i];
                    return (
                      <div key={o.n} style={{ position: "absolute", left: 24 + i * 430, top: 84, width: 410, height: 250, borderRadius: 12, border: `2px solid ${on ? BLUE : LINE}`, background: on ? "#F5F8FF" : "#fff", padding: 20, boxSizing: "border-box" }}>
                        <div style={{ position: "absolute", right: 16, top: 16, width: 24, height: 24, borderRadius: 6, border: `2px solid ${on ? BLUE : "#CBD5E1"}`, background: on ? BLUE : "#fff", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</div>
                        <KeyLogo sub={o.n} />
                        <div style={{ marginTop: 18, fontSize: 18, fontWeight: 800, color: INK }}>{o.n}</div>
                        <div style={{ fontSize: 13, color: GRAY }}>{o.slug}</div>
                        <div style={{ marginTop: 14, fontSize: 14.5, color: "#374151", lineHeight: 1.8 }}>📍 {o.loc}<br />📞 {o.ph}<br />👤 {o.mgr}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CompanyShell2>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};
