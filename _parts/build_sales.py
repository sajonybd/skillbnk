import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
mk = read("MockInterviewVideo.tsx"); lf = read("LessonFlowVideo.tsx"); fu = read("TrainingFollowUpVideo.tsx")
P = lambda n: Path("_parts/" + n).read_text()
t = mk
t = replace_once(t, between(t, "// ════════════════════════════════════════════════════════════════════════════\n", "// ─── Timing"), """// ════════════════════════════════════════════════════════════════════════════
// SalesPlaybookVideo — "Turn Your Sales Playbook into Training Your Team Finishes".
// Every screen verified in the skillBNK code (claude/skillbnk-code-facts.md + sales-playbook-video.md):
//   AI Curriculum Generator (Add PDF: "The AI reads this PDF and uses its content to shape
//   the generated chapters and lessons") → Mock Interviews (Add Interview, AI) → learner live
//   AI interview → Mark Submission (Evaluate by AI + comment) → Program leaderboard.
// ALL names and data are FICTIONAL (Crestline Solar).
// Voice: bash generate-voice-sales.sh (patches DURATIONS + VOICED below).
// ════════════════════════════════════════════════════════════════════════════
""")
keys = ["s0","s1","s2","s3","s4","s5","s6","s7"]
design = dict(s0=240,s1=360,s2=420,s3=380,s4=400,s5=310,s6=250,s7=180)
pace = dict(s0=1,s1=1.05,s2=1.05,s3=1.05,s4=1.05,s5=1.05,s6=1.05,s7=1)
t = set_timing(t, keys, design, pace, ["s0"])
for k, v in dict(COMPANY="Crestline Solar", BRANCH="Sales Academy", ADMIN="Megan Hart", LEARNER="Ryan Ortiz", PROGRAM="Sales Playbook Training", SESSION="Q4 2026 Team", INTERVIEW="Price Objection Call", TOPIC="Sales objections").items():
    t = set_const(t, k, v)
t = replace_once(t, 'const TOPIC = "Sales objections";', 'const TOPIC = "Sales objections";\nconst COURSE = "Our Sales Playbook";\nconst ACADEMY = COMPANY;')
t = t.replace('const MAYA_AV = { t: "MR"', 'const MAYA_AV = { t: "RO"').replace('const DAN_AV = { t: "DB"', 'const DAN_AV = { t: "MH"')
t = t.replace("/** Brightline Home Services logo", "/** Crestline Solar logo").replace(">BRIGHTLINE<", ">CRESTLINE<")
# Badge with fs (needed by transplanted leaderboard)
t = t.replace('const Badge: React.FC<{ t: string; c: string; bg: string; dot?: boolean }> = ({ t, c, bg, dot }) => (\n  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,',
              'const Badge: React.FC<{ t: string; c: string; bg: string; dot?: boolean; fs?: number }> = ({ t, c, bg, dot, fs = 13 }) => (\n  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: fs,')
assert "fs = 13" in t
# fictional sales content
rep = {
 '"Booking Appointments"': '"Booking the Site Visit"', '"Handling Complaints"': '"Handling Competitor Quotes"', '"Upselling Maintenance Plans"': '"Closing the Proposal"',
 '"Phone Etiquette Basics"': '"Discovery Call Basics"', '"Scheduling Follow-ups"': '"Follow-up Calls"', '"Rachel Kim"': '"Chris Doyle"',
 'tp: "Scheduling"': 'tp: "Scheduling"', 'tp: "Service recovery"': 'tp: "Competition"', 'tp: "Greetings & tone"': 'tp: "Discovery"',
 '"Customer service"': '"Sales calls"',
 "learner.skillbnk.com/interviews/mock/handling-service-calls": "portal.skillbnk.com/interviews/mock/price-objection-call",
 'url="learner.skillbnk.com"': 'url="portal.skillbnk.com"', 'label="Branch portal"': 'label="Training provider portal"',
 "Evaluation saved · Maya has been notified": "Evaluation saved · Ryan has been notified",
 "Welcome back, Maya": "Welcome back, Ryan",
}
for a, b in rep.items(): t = t.replace(a, b)
t = re.sub(r"const QUESTIONS = \[.*?\];", '''const QUESTIONS = [
  "A homeowner says solar is too expensive. How do you respond?",
  "They have a cheaper quote from a competitor. What do you say?",
  "What if they ask for a discount you can't approve?",
];''', t, flags=re.S)
t = re.sub(r'const INSTRUCTION = ".*?";', 'const INSTRUCTION = "Play a homeowner who likes the proposal but thinks it costs too much. Stay polite but skeptical, and ask follow-up questions.";', t)
t = re.sub(r'const GREETING = ".*?";', 'const GREETING = "Hi! Thanks for joining. Let\'s practice a real sales call together.";', t)
t = t.replace('{ who: "ai", t: "Hi Maya, thanks for joining. Let\'s practice a real service call. A homeowner calls, upset that their technician is running two hours late. How do you open the call?"',
              '{ who: "ai", t: "Hi Ryan, thanks for joining. Let\'s practice a real sales call. A homeowner likes your proposal, but says it\'s too expensive. How do you respond?"')
t = t.replace('{ who: "maya", t: "First, I\'d thank them for calling and apologize for the wait. Then I\'d confirm their address and give them a new arrival time I\'m sure about."',
              '{ who: "maya", t: "I\'d thank them for being honest, then ask what they\'re comparing it to, so I understand what too expensive means to them."')
t = t.replace('{ who: "maya", t: "I\'d explain what I can do right now, then offer to have my manager call them back today."',
              '{ who: "maya", t: "I\'d explain the options I can offer today, then have my manager call them back with an answer."')
assert "Hi Ryan" in t and "too expensive means" in t and "options I can offer" in t
t = re.sub(r"const QA = \[.*?\n\];", '''const QA = [
  ["A homeowner says solar is too expensive. How do you respond?", "Thank them, ask what they're comparing it to, then show the value."],
  ["What if they ask for a discount you can't approve?", "Explain today's options, offer a manager callback."],
];''', t, flags=re.S)
t = re.sub(r'const FEEDBACK = ".*?";', 'const FEEDBACK = "Calm, confident answer. You asked what the price was compared to before defending it. Next time, connect the savings to their own power bill sooner.";', t)
t = re.sub(r'const COMMENT = ".*?";', 'const COMMENT = "Great work, Ryan! Let\'s role-play the competitor quote on Friday.";', t)
# shims + transplanted pieces
shim = '''
// ─── Shims so transplanted provider-portal scenes use this video's shell ─────
const ProviderShell: React.FC<{ active?: string; bell?: number; ring?: number; children: React.ReactNode }> = ({ active = "Dashboard", children }) => <BranchShell active={active}>{children}</BranchShell>;
''' + between(lf, "const Input: React.FC", "const IconBtn") 
gen = between(lf, "const TypeChip", "// ═══ l0 — HOOK") + between(lf, "// ═══ l1 —", "// ═══ l3 —")
gen = re.sub(r"const CURRICULUM: .*?\n\];\n", '''const CURRICULUM: { ch: string; ls: [string, string][] }[] = [
  { ch: "How we sell", ls: [["Slide", "Our 5-step sales process"], ["Video", "Coach demo: a discovery call"], ["Quiz", "Match the step to the goal"]] },
  { ch: "Handling objections", ls: [["Slide", "Too expensive, bad timing, competitor quote"], ["Document", "Objection response script"], ["Assignment", "Answer 3 common objections"]] },
  { ch: "Closing the proposal", ls: [["Quiz", "Spot the buying signal"], ["Assignment", "Write your closing question"]] },
];
''', gen, flags=re.S)
gen = re.sub(r'const PROMPT = ".*?";', 'const PROMPT = "Turn our attached sales playbook into a course for new reps: our sales process, handling objections, and closing the proposal. Include quizzes and practice.";', gen)
gen = gen.replace("courses/handling-price-objections/edit", "courses/edit/subprogram-our-sales-playbook")
# show the attached PDF (real AttachmentCard: PDF tag, file name, size, "N attached")
gen = gen.replace('''{["📄 Add PDF", "🖼 Add images"].map((t) => <div key={t} style={{ width: 295, height: 50,''', '''{["📄 Add PDF", "🖼 Add images"].map((t) => <div key={t} style={{ width: 140, height: 50,''')
gen = gen.replace('''<div style={{ position: "absolute", left: 40, top: 362, fontSize: 16, fontWeight: 800, color: INK }}>Generation Options</div>''',
 '''{g >= 120 && <div style={{ position: "absolute", left: 340, top: 290, width: 300, height: 58, borderRadius: 9, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 10px", boxSizing: "border-box", opacity: fi(g, 120, 8) }}><span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "#111827", padding: "2px 6px", borderRadius: 4 }}>PDF</span><span style={{ fontSize: 22, color: "#EF4444" }}>📄</span><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Crestline_Sales_Playbook.pdf</div><div style={{ fontSize: 11, color: GRAY }}>2.4 MB · 1 attached</div></div></div>}
    <div style={{ position: "absolute", left: 40, top: 362, fontSize: 16, fontWeight: 800, color: INK }}>Generation Options</div>''')
assert "Crestline_Sales_Playbook.pdf" in gen and "width: 140, height: 50" in gen
gen = gen.replace('background: "linear-gradient(135deg,#4C1D95,#7C3AED)", color: "#fff", fontSize: 12', 'background: "linear-gradient(135deg,#B45309,#F59E0B)", color: "#fff", fontSize: 12')
lb = between(fu, "// ─── Fictional team (48 learners)", "/** video caption (not product UI)") + between(fu, "/** video caption (not product UI)", "// ═══ t0 — HOOK") + between(fu, "// ═══ t1 —", "// ═══ t2 —")
lb = lb.replace("const LEARNER_LB", "const LEARNER_LB")
wrap_old = between(t, "// ═══ q13 — WRAP", "// ═══ Composition")
wrap = wrap_old.replace('{ t: "Create", s: "Branch sets up an AI interview", c: "#2563EB" }', '{ t: "Teach", s: "Your playbook, built by AI", c: "#F59E0B" }').replace('{ t: "Practice", s: "Learners answer out loud", c: "#14B8A6" }', '{ t: "Practice", s: "AI role-play calls", c: "#14B8A6" }').replace('{ t: "Review", s: "Evaluate by AI in one click", c: "#7C3AED" }', '{ t: "Track", s: "Scores + leaderboard", c: "#7C3AED" }')
wrap = wrap.replace('Practice real conversations <span style={{ color: "#7FA0FF" }}>before the real thing.</span>', 'Write it once. <span style={{ color: "#7FA0FF" }}>Practice it every day.</span>')
assert "Practice it every day" in wrap and "AI role-play" in wrap
t = t.replace(wrap_old, wrap)
old_hook = between(t, "// ═══ q0 — HOOK", "// ═══ q1 —")
t = t.replace(old_hook, shim + gen + lb + P("hook_generic.part.tsx") + P("hook_sales.part.tsx") + "\n")
t = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  s0: SceneHookSales, s1: SceneGenerate, s2: SceneReview, s3: SceneAddInterview, s4: SceneLive, s5: SceneEvaluate, s6: SceneLeaderboard, s7: SceneWrap,\n};", t)
t = t.replace("export const MockInterviewVideo", "export const SalesPlaybookVideo").replace('k === "q13" ? TAIL', 'k === "s7" ? TAIL').replace("staticFile(`mock/${k}.mp3`)", "staticFile(`sales/${k}.mp3`)")
for sc, n in [("SceneGenerate",1),("SceneReview",1),("SceneAddInterview",2),("SceneLive",3),("SceneEvaluate",4),("SceneLeaderboard",5)]:
    t = scene_tag(t, sc, n)
t = t.replace('fontFamily: FONT }}>M</div>', 'fontFamily: FONT }}>R</div>').replace(">AI MOCK INTERVIEWS<", ">SALES PLAYBOOK TRAINING<")
(SRC / "SalesPlaybookVideo.tsx").write_text(t)
print("written", len(t.splitlines()))

import subprocess
subprocess.run(["python3", "_parts/add_portal_cards.py", "src/SalesPlaybookVideo.tsx"], check=True)
