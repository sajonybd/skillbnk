import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx")
lf = read("LessonFlowVideo.tsx")
bulk = Path("_parts/bulk.part.tsx").read_text()
t = fu
t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), """// ChangeTrainingVideo — "Roll Out a New Tool to Every Employee (Change Training)".
// Every screen verified in the skillBNK code (claude/skillbnk-code-facts.md + change-training-video.md):
//   Edit Course "Generate with AI" → AI Curriculum Generator → Bulk Enrollment (CSV:
//   Upload CSV → Map Fields → Validate → Preview & Enroll) → Program leaderboard →
//   Email Marketing (Create New Email, Delivery Reports, Cron Jobs).
//   NO deadline / auto-reminder / "everyone finishes in a week" claims.
// ALL names and data are FICTIONAL (Brookfield Property Management).
// Voice: bash generate-voice-change.sh (patches DURATIONS + VOICED below).
""")
keys = ["c0","c1","c2","c3","c4","c5","c6","c7","c8","c9"]
design = dict(c0=240,c1=360,c2=420,c3=420,c4=250,c5=200,c6=470,c7=330,c8=190,c9=190)
pace = dict(c0=1,c1=1.05,c2=1.05,c3=1.05,c4=1.05,c5=1.05,c6=1.05,c7=1.05,c8=1,c9=1)
t = set_timing(t, keys, design, pace, ["c0"])
t = set_const(t, "ACADEMY", "Brookfield Property Management")
t = set_const(t, "ADMIN", "Dana Whitfield")
t = set_const(t, "PROGRAM", "New CRM Rollout")
t = set_const(t, "SESSION", "October 2026 Team")
t = set_const(t, "LEARNER", "Leo Grant")
t = set_const(t, "EMAIL", "leo.grant@example.com")
t = replace_once(t, 'const LEARNER = "Leo Grant";', 'const LEARNER = "Leo Grant";\nconst COURSE = "Getting Started with the New CRM";')
t = t.replace('const JORDAN_AV = { t: "NS"', 'const JORDAN_AV = { t: "LG"').replace('const RACHEL_AV = { t: "AT"', 'const RACHEL_AV = { t: "DW"')
t = t.replace('<Avatar t="AT" s={34} />', '<Avatar t={RACHEL_AV.t} s={34} />')
t = t.replace("/** Harbor Point Insurance logo", "/** Brookfield Property Management logo").replace('sub = "Insurance Agency"', 'sub = "Property Management"').replace(">HARBOR POINT<", ">BROOKFIELD<")
t = t.replace('<path d="M19 7l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12v-8z" fill="none" stroke="#fff" strokeWidth="2.6" />', '<path d="M8 30V17l11-9 11 9v13z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />').replace('<path d="M13 22c2 2 4 2 6 0s4-2 6 0" fill="none" stroke="#38BDF8" strokeWidth="2.6" strokeLinecap="round" />', '<rect x="16" y="21" width="6" height="9" fill="#38BDF8" />')
t = t.replace('{ s: "New module: Claims basics"', '{ s: "New module: Tenant move-in checklist"')
t = t.replace('const SUBJECT = "Quick reminder: finish Customer Care & Compliance";', 'const SUBJECT = "Quick reminder: finish the New CRM course";')
t = t.replace("Customer Care & Compliance", "New CRM Rollout")
t = t.replace('"Nina turned it around in one week and finished every module. Great work!"', '"Leo finished every module of the New CRM course. Great work!"')
# --- AI generator block from LessonFlow
gen = between(lf, "const TypeChip", "// ═══ l0 — HOOK") + between(lf, "// ═══ l1 —", "// ═══ l3 —")
gen = re.sub(r"const CURRICULUM: .*?\n\];\n", '''const CURRICULUM: { ch: string; ls: [string, string][] }[] = [
  { ch: "Why we're switching", ls: [["Slide", "What changes, and what stays the same"], ["Video", "Walkthrough: your first login"], ["Quiz", "Old way or new way?"]] },
  { ch: "Everyday tasks in the new CRM", ls: [["Slide", "Log a maintenance request"], ["Document", "Quick reference: top 10 tasks"], ["Assignment", "Update a tenant record"]] },
  { ch: "Check your skills", ls: [["Quiz", "Find the right screen"], ["Assignment", "Close out a work order"]] },
];
''', gen, flags=re.S)
gen = re.sub(r'const PROMPT = ".*?";', 'const PROMPT = "A short course for our property managers on the new CRM: why we are switching, everyday tasks like logging maintenance requests and updating tenant records, plus a short quiz.";', gen)
gen = gen.replace("courses/handling-price-objections/edit", "courses/getting-started-new-crm/edit")
gen = gen.replace('background: "linear-gradient(135deg,#4C1D95,#7C3AED)", color: "#fff", fontSize: 12', 'background: "linear-gradient(135deg,#0C4A6E,#0EA5E9)", color: "#fff", fontSize: 12')
data = '''
// ─── Bulk Enrollment demo rows (fictional) ───────────────────────────────────
const CSV_NAME = "brookfield_team.csv";
const BULK_TAG = 2;
const BULK_EXTRA = 42;
const BULK_ROWS = [
  { name: "Olivia Bennett", email: "olivia.bennett@example.com", already: false },
  { name: "Marcus Cole", email: "marcus.cole@example.com", already: false },
  { name: "Priya Nair", email: "priya.nair@example.com", already: false },
  { name: "Leo Grant", email: "leo.grant@example.com", already: false },
  { name: "Grace Park", email: "grace.park@example.com", already: true },
  { name: "Ethan Walsh", email: "ethan.walsh@example.com", already: false },
];
'''
hook = Path("_parts/hook_change.part.tsx").read_text()
wrap_old = between(t, "// ═══ t7 — WRAP", "// ═══ Composition")
wrap = wrap_old.replace("// ═══ t7 — WRAP", "// ═══ c9 — WRAP")
wrap = wrap.replace('[["📊", "See who\'s behind", "Program Leaderboard", "#EF4444"], ["✉️", "Nudge them", "Email + weekly schedule", "#2563EB"], ["🎓", "Certify who\'s done", "Certificate generator", "#22C55E"]]',
                    '[["✨", "Build the course", "AI Curriculum Generator", "#7C3AED"], ["👥", "Enroll everyone", "Bulk Enrollment", "#2563EB"], ["📊", "Track & follow up", "Leaderboard + Email", "#22C55E"]]')
wrap = wrap.replace("Stop chasing. <span style={{ color: \"#7FA0FF\" }}>Start finishing.</span>", "Roll it out. <span style={{ color: \"#7FA0FF\" }}>Make it stick.</span>")
assert "Make it stick" in wrap and "Enroll everyone" in wrap
t = t.replace(wrap_old, wrap)
old_hook = between(t, "// ═══ t0 — HOOK", "// ═══ t1 —")
t = t.replace(old_hook, data + gen + bulk + hook + "\n")
t = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  c0: SceneHookChange, c1: SceneGenerate, c2: SceneReview, c3: SceneBulk, c4: SceneLeaderboard, c5: SceneBehind, c6: SceneEmail, c7: SceneReports, c8: SceneWeekLater, c9: SceneWrap,\n};", t)
t = t.replace("export const TrainingFollowUpVideo", "export const ChangeTrainingVideo").replace('k === "t7" ? TAIL', 'k === "c9" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", "staticFile(`change/${k}.mp3`)")
for sc, n in [("SceneGenerate",1),("SceneReview",1),("SceneLeaderboard",3),("SceneBehind",3),("SceneEmail",4),("SceneReports",4),("SceneWeekLater",3)]:
    t = scene_tag(t, sc, n)
(SRC / "ChangeTrainingVideo.tsx").write_text(t)
print("written", len(t.splitlines()))

import subprocess
subprocess.run(["python3", "_parts/add_portal_cards.py", "src/ChangeTrainingVideo.tsx"], check=True)
