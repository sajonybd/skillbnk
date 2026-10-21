// ═══ BULK ENROLLMENT (real UI: SB-Branch /bulk-enrollment page.tsx) ═══════════
// Title "Bulk Enrollment" · "Upload a CSV file to enroll multiple students at once." · Template CSV
// Steps: Upload CSV → Map Fields → Validate → Preview & Enroll. Fields: Email, Program, Session,
// First Name / Last Name ("Used only when creating a new user"). Preview: Student · Program ·
// Session · Status (Will Enroll / Already Enrolled). Button "Enroll N Students" →
// "Enrollment Queued" · "Bulk enrollment has been queued for processing."
const BulkStepper: React.FC<{ step: number }> = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    {["Upload CSV", "Map Fields", "Validate", "Preview & Enroll"].map((s, i) => (
      <React.Fragment key={s}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? BLUE : "#E5E7EB", color: step > i ? "#fff" : GRAY, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{step > i + 1 ? "✓" : i + 1}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: step > i ? INK : GRAY }}>{s}</span>
        {i < 3 && <span style={{ width: 60, height: 2, background: step > i + 1 ? BLUE : "#E5E7EB" }} />}
      </React.Fragment>
    ))}
  </div>
);
const SceneBulk: React.FC<SceneProps> = ({ f, dur, fps }) => {
  const D = 420;
  const g = gt(f, dur, D);
  const step = g < 70 ? 1 : g < 150 ? 2 : g < 220 ? 3 : 4;
  const UP = { x: MX(665), y: MY(330) };
  const CONT = { x: MX(1180), y: MY(720) };
  const ENROLL = { x: MX(1160), y: MY(720) };
  const cur = path(g, [[0, 900, 650], [24, UP.x, UP.y], [40, UP.x, UP.y], [120, CONT.x, CONT.y], [140, CONT.x, CONT.y], [190, CONT.x, CONT.y], [212, CONT.x, CONT.y], [300, ENROLL.x, ENROLL.y], [330, ENROLL.x, ENROLL.y], [420, 1000, 500]]);
  const ripple = Math.max(rip(g, 36), rip(g, 136), rip(g, 208), rip(g, 322));
  const queued = g >= 330;
  const willEnroll = BULK_ROWS.filter((r) => !r.already).length + BULK_EXTRA;
  const camKeys: CamKey[] = [[0, WIDE_X, WIDE_Y, 1], [20, 760, 360, 1.25], [60, 760, 360, 1.25], [80, WIDE_X, WIDE_Y, 1.05], [240, WIDE_X, WIDE_Y, 1.05], [270, 900, 520, 1.25], [300, 1150, 640, 1.35], [340, 1150, 640, 1.35], [370, WIDE_X, WIDE_Y, 1.05], [420, WIDE_X, WIDE_Y, 1.05]];
  return (
    <Stage>
      <PortalTag n={BULK_TAG} label="Training provider portal" url="admin view" />
      <CamC g={g} keys={camKeys}>
        <Browser url="branch.skillbnk.com/bulk-enrollment">
          <ProviderShell active="Approved Members" bell={2}>
            <PageTitle t="Bulk Enrollment" sub="Upload a CSV file to enroll multiple students at once." />
            <Btn x={1170} y={22} w={160} h={42} label="⤓ Template CSV" fs={14} />
            <div style={{ position: "absolute", left: 20, top: 92, width: 1310, height: 70, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 24px", boxSizing: "border-box" }}><BulkStepper step={step} /></div>
            <div style={{ position: "absolute", left: 20, top: 178, width: 1310, height: 600, background: "#fff", borderRadius: 12, border: `1px solid ${LINE}`, overflow: "hidden" }}>
              {step === 1 && (
                <>
                  <div style={{ position: "absolute", left: 30, top: 24, fontSize: 17, fontWeight: 800, color: INK }}>CSV Template Fields</div>
                  <div style={{ position: "absolute", left: 30, top: 56, display: "flex", gap: 10 }}>
                    {["Email", "Program", "Session", "First Name", "Last Name"].map((t) => <span key={t} style={{ padding: "6px 12px", borderRadius: 7, background: "#F3F4F6", fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{t}</span>)}
                  </div>
                  <div style={{ position: "absolute", left: 330, top: 110, width: 650, height: 200, borderRadius: 12, border: `2px dashed ${g >= 36 ? BLUE : "#CBD5E1"}`, background: g >= 36 ? BLUE_SOFT : "#FAFAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    {g < 44 ? (
                      <><div style={{ fontSize: 40 }}>⤒</div><div style={{ fontSize: 18, fontWeight: 800, color: INK }}>Click to upload CSV</div><div style={{ fontSize: 14, color: GRAY }}>Only .csv files are supported</div></>
                    ) : (
                      <div style={{ opacity: fi(g, 44, 8), display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 10, background: "#fff", border: `1px solid ${LINE}` }}><span style={{ fontSize: 28 }}>📄</span><div><div style={{ fontSize: 16, fontWeight: 800, color: INK }}>{CSV_NAME}</div><div style={{ fontSize: 13, color: GRAY }}>{willEnroll + BULK_ROWS.filter((r) => r.already).length} rows</div></div></div>
                    )}
                  </div>
                </>
              )}
              {step === 2 && (
                <div style={{ opacity: fi(g, 70, 8) }}>
                  <div style={{ position: "absolute", left: 30, top: 24, fontSize: 17, fontWeight: 800, color: INK }}>Map CSV columns to required fields</div>
                  {[["Email", "email"], ["Program", "program"], ["Session", "session"], ["First Name", "first_name"], ["Last Name", "last_name"]].map(([a, b], i) => (
                    <div key={a} style={{ position: "absolute", left: 30, top: 70 + i * 62, width: 900, display: "flex", alignItems: "center", gap: 20, opacity: fi(g, 76 + i * 8, 8) }}>
                      <div style={{ width: 220, fontSize: 15.5, fontWeight: 700, color: INK }}>{a} {i < 3 && <span style={{ color: "#EF4444" }}>*</span>}</div>
                      <span style={{ color: GRAY }}>←</span>
                      <div style={{ width: 360, height: 42, borderRadius: 8, border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", fontSize: 15, color: INK }}>{b}<span style={{ color: "#9CA3AF" }}>⌄</span></div>
                      <span style={{ color: GREEN, fontWeight: 800 }}>✓</span>
                    </div>
                  ))}
                  <Btn x={1060} y={530} w={220} h={44} label="Continue to Validate" primary fs={14.5} press={g >= 136 && g < 142 ? 1 : 0} />
                </div>
              )}
              {step === 3 && (
                <div style={{ opacity: fi(g, 150, 8) }}>
                  <div style={{ position: "absolute", left: 30, top: 24, display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 17, fontWeight: 800, color: INK }}>Validation Results</span>{g >= 170 && <Badge t="All rows valid" c={GREEN} bg="#DCFCE7" />}</div>
                  {BULK_ROWS.slice(0, 6).map((r, i) => (
                    <div key={r.email} style={{ position: "absolute", left: 30, top: 70 + i * 56, width: 1250, height: 50, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 20, fontSize: 14.5, color: INK, opacity: fi(g, 156 + i * 4, 6) }}>
                      <span style={{ width: 280 }}>{r.email}</span><span style={{ width: 300 }}>{PROGRAM}</span><span style={{ width: 220 }}>{SESSION}</span><span style={{ color: GREEN, fontWeight: 800 }}>✓ Valid</span>
                    </div>
                  ))}
                  <Btn x={1100} y={530} w={180} h={44} label="Validate" primary fs={14.5} press={g >= 208 && g < 214 ? 1 : 0} />
                </div>
              )}
              {step === 4 && !queued && (
                <div style={{ opacity: fi(g, 220, 8) }}>
                  <div style={{ position: "absolute", left: 30, top: 20, width: 1250, height: 40, background: "#F9FAFB", borderRadius: 8, fontSize: 14.5, fontWeight: 800, color: INK, display: "flex", alignItems: "center", padding: "0 14px", boxSizing: "border-box" }}>Enrollment Preview</div>
                  {[["#", 44], ["Student", 90], ["Program", 470], ["Session", 800], ["Status", 1060]].map(([t, x]) => <div key={t as string} style={{ position: "absolute", left: x as number, top: 74, fontSize: 13.5, fontWeight: 700, color: "#374151" }}>{t as string}</div>)}
                  {BULK_ROWS.map((r, i) => (
                    <div key={r.email} style={{ position: "absolute", left: 30, top: 100 + i * 60, width: 1250, height: 60, borderBottom: `1px solid ${LINE}`, opacity: fi(g, 224 + i * 5, 6) }}>
                      <div style={{ position: "absolute", left: 14, top: 20, fontSize: 14, color: GRAY }}>{i + 1}</div>
                      <div style={{ position: "absolute", left: 60, top: 9 }}><div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{r.name}</div><div style={{ fontSize: 12.5, color: GRAY }}>{r.email}</div></div>
                      <div style={{ position: "absolute", left: 440, top: 19, fontSize: 14.5, color: INK }}>{PROGRAM}</div>
                      <div style={{ position: "absolute", left: 770, top: 19, fontSize: 14.5, color: INK }}>{SESSION}</div>
                      <div style={{ position: "absolute", left: 1030, top: 16 }}>{r.already ? <Badge t="Already Enrolled" c="#B45309" bg="#FEF3C7" fs={12.5} /> : <Badge t="Will Enroll" c={GREEN} bg="#DCFCE7" fs={12.5} />}</div>
                    </div>
                  ))}
                  <div style={{ position: "absolute", left: 30, top: 100 + BULK_ROWS.length * 60 + 10, fontSize: 14, color: GRAY }}>+ {BULK_EXTRA} more rows</div>
                  <Btn x={30} y={530} w={180} h={44} label="Back to Validate" fs={14} />
                  <Btn x={1040} y={530} w={240} h={44} label={`Enroll ${willEnroll} Students`} primary fs={15} press={g >= 322 && g < 328 ? 1 : 0} />
                </div>
              )}
              {queued && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: fi(g, 330, 10) }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#DCFCE7", color: GREEN, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(g, 330, fps)})` }}>✓</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>Enrollment Queued</div>
                  <div style={{ fontSize: 16, color: GRAY }}>Bulk enrollment has been queued for processing.</div>
                  <Btn x={555} y={400} w={200} h={44} label="Start New Bulk Enrollment" fs={13.5} />
                </div>
              )}
            </div>
          </ProviderShell>
          <Cursor x={cur.x} y={cur.y} ripple={ripple} />
        </Browser>
      </CamC>
    </Stage>
  );
};
