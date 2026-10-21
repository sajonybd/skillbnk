import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx"); lf = read("LessonFlowVideo.tsx")
P = lambda n: Path("_parts/" + n).read_text()
t = fu
t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), """// RealEstateTrainingVideo — "Onboard New Real Estate Agents" (niche video).
// Every screen verified in the skillBNK code (claude/skillbnk-code-facts.md + realestate-video.md):
//   Company portal course → Branches tab (choose offices) → course editor "Generate with AI"
//   → AI Curriculum Generator → Bulk Enrollment (CSV) → Program leaderboard →
//   Generate Certificate (manual: select learner → template). NO auto certificates,
//   renewal reminders or referral tracking (not in the code).
// ALL names and data are FICTIONAL (Harborview Realty Group).
// Voice: bash generate-voice-realestate.sh (patches DURATIONS + VOICED below).
""")
keys = ["r0","r1","r2","r3","r4","r5","r6","r7","r8"]
design = dict(r0=260,r1=330,r2=360,r3=420,r4=420,r5=250,r6=200,r7=430,r8=190)
pace = dict(r0=1,r1=1.05,r2=1.05,r3=1.05,r4=1.05,r5=1.05,r6=1.05,r7=1.05,r8=1)
t = set_timing(t, keys, design, pace, ["r0"])
for k, v in dict(ACADEMY="Harborview Realty Group", ADMIN="Karen Wells", PROGRAM="New Agent Launch Program", SESSION="Fall 2026 Cohort", LEARNER="Jessica Moore", EMAIL="jessica.moore@example.com").items():
    t = set_const(t, k, v)
t = replace_once(t, 'const LEARNER = "Jessica Moore";', 'const LEARNER = "Jessica Moore";\nconst COURSE = "Listing Presentation Basics";\nconst COURSE_SLUG = "listing-presentation-basics";')
t = t.replace('const JORDAN_AV = { t: "NS"', 'const JORDAN_AV = { t: "JM"').replace('const RACHEL_AV = { t: "AT"', 'const RACHEL_AV = { t: "KW"')
t = t.replace('<Avatar t="AT" s={34} />', '<Avatar t={RACHEL_AV.t} s={34} />')
t = t.replace("/** Harbor Point Insurance logo", "/** Harborview Realty Group logo").replace('sub = "Insurance Agency"', 'sub = "Realty Group"').replace(">HARBOR POINT<", ">HARBORVIEW<").replace('fill="#0C4A6E" />', 'fill="#0F766E" />', 1).replace('color: dark ? "#fff" : "#0C4A6E"', 'color: dark ? "#fff" : "#0F766E"')
t = t.replace('<path d="M19 7l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12v-8z" fill="none" stroke="#fff" strokeWidth="2.6" />', '<path d="M8 30V17l11-9 11 9v13z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />').replace('<path d="M13 22c2 2 4 2 6 0s4-2 6 0" fill="none" stroke="#38BDF8" strokeWidth="2.6" strokeLinecap="round" />', '<path d="M13 30c3-5 9-5 12 0" fill="none" stroke="#5EEAD4" strokeWidth="2.6" />')
t = t.replace("Customer Care & Compliance", "New Agent Launch")
t = t.replace('"Nina turned it around in one week and finished every module. Great work!"', '"Jessica completed every module of the New Agent Launch Program. Welcome to the team!"')
gen = between(lf, "const TypeChip", "// ═══ l0 — HOOK") + between(lf, "// ═══ l1 —", "// ═══ l3 —")
gen = re.sub(r"const CURRICULUM: .*?\n\];\n", '''const CURRICULUM: { ch: string; ls: [string, string][] }[] = [
  { ch: "Our listing process", ls: [["Slide", "From first call to signed listing"], ["Video", "Walkthrough: a listing appointment"], ["Quiz", "Put the steps in order"]] },
  { ch: "Pricing and the market report", ls: [["Slide", "Building a pricing plan"], ["Document", "Market report template"], ["Assignment", "Price a sample home"]] },
  { ch: "Presenting to the seller", ls: [["Quiz", "Answer common seller questions"], ["Assignment", "Record your listing pitch"]] },
];
''', gen, flags=re.S)
gen = re.sub(r'const PROMPT = ".*?";', 'const PROMPT = "Onboarding for new agents at our brokerage: our listing process, building a pricing plan with a market report, and presenting to sellers. Include quizzes and practice.";', gen)
gen = gen.replace("courses/handling-price-objections/edit", "courses/edit/subprogram-listing-presentation-basics")
gen = gen.replace('background: "linear-gradient(135deg,#4C1D95,#7C3AED)", color: "#fff", fontSize: 12', 'background: "linear-gradient(135deg,#0F766E,#14B8A6)", color: "#fff", fontSize: 12')
data = '''
// ─── Offices + Bulk Enrollment demo rows (fictional) ─────────────────────────
const OFFICES_TAG = 1;
const OFFICES = [
  { n: "Harborview – Austin", slug: "harborview-austin", loc: "Austin, TX", ph: "(512) 555-0142", mgr: "Daniel Brooks" },
  { n: "Harborview – San Antonio", slug: "harborview-san-antonio", loc: "San Antonio, TX", ph: "(210) 555-0178", mgr: "Laura Bennett" },
  { n: "Harborview – Houston", slug: "harborview-houston", loc: "Houston, TX", ph: "(713) 555-0119", mgr: "Marcus Lee" },
];
const CSV_NAME = "fall_2026_new_agents.csv";
const BULK_TAG = 2;
const BULK_EXTRA = 9;
const BULK_ROWS = [
  { name: "Jessica Moore", email: "jessica.moore@example.com", already: false },
  { name: "Priya Shah", email: "priya.shah@example.com", already: false },
  { name: "Tom Alvarez", email: "tom.alvarez@example.com", already: false },
  { name: "Hannah Cole", email: "hannah.cole@example.com", already: false },
  { name: "Diego Ramos", email: "diego.ramos@example.com", already: true },
  { name: "Tessa Nguyen", email: "tessa.nguyen@example.com", already: false },
];
'''
wrap_old = between(t, "// ═══ t7 — WRAP", "// ═══ Composition")
wrap = wrap_old.replace('[["📊", "See who\'s behind", "Program Leaderboard", "#EF4444"], ["✉️", "Nudge them", "Email + weekly schedule", "#2563EB"], ["🎓", "Certify who\'s done", "Certificate generator", "#22C55E"]]',
  '[["🏢", "One course, every office", "Company portal", "#14B8A6"], ["✨", "Built with AI", "AI Curriculum Generator", "#7C3AED"], ["📊", "Track every agent", "Leaderboard + Certificates", "#22C55E"]]')
wrap = wrap.replace("Stop chasing. <span style={{ color: \"#7FA0FF\" }}>Start finishing.</span>", "Every office. <span style={{ color: \"#5EEAD4\" }}>One standard.</span>")
assert "One standard" in wrap and "every office" in wrap
t = t.replace(wrap_old, wrap)
old_hook = between(t, "// ═══ t0 — HOOK", "// ═══ t1 —")
t = t.replace(old_hook, data + gen + P("bulk.part.tsx") + P("company_branches.part.tsx") + P("hook_generic.part.tsx") + P("hook_realestate.part.tsx") + "\n")
t = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  r0: SceneHookRE, r1: SceneOffices, r2: SceneGenerate, r3: SceneReview, r4: SceneBulk, r5: SceneLeaderboard, r6: SceneBehind, r7: SceneCertificate, r8: SceneWrap,\n};", t)
t = t.replace("export const TrainingFollowUpVideo", "export const RealEstateTrainingVideo").replace('k === "t7" ? TAIL', 'k === "r8" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", "staticFile(`realestate/${k}.mp3`)")
for sc, n in [("SceneGenerate",2),("SceneReview",2),("SceneLeaderboard",3),("SceneBehind",3),("SceneCertificate",4)]:
    t = scene_tag(t, sc, n)
t = t.replace("i === 40 ? LEARNER", "i === 0 ? LEARNER").replace("const NINA = TEAM[40];", "const NINA = TEAM[0];").replace("[TEAM[0], NINA, TEAM[3]", "[TEAM[2], NINA, TEAM[3]")
t = t.replace("{ACADEMY} · Seattle", "{ACADEMY} · Austin")
(SRC / "RealEstateTrainingVideo.tsx").write_text(t)
print("written", len(t.splitlines()))

import subprocess
subprocess.run(["python3", "_parts/add_portal_cards.py", "src/RealEstateTrainingVideo.tsx"], check=True)
