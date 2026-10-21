import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx")
head = fu[: fu.index("// ─── Company portal shell")]
comp = fu[fu.index("// ═══ Composition"):]
t = head
t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), """// ApplyCompanyVideo — "How to Apply for a Company on skillBNK".
// Every screen verified in the skillBNK code (claude/apply-company-video.md):
//   www.skillbnk.com/company/mycompanies ("Companies", "Apply For Company") →
//   /company/apply: Package → Details (Institute Information) → Payment (Stripe / Manual)
//   → Sign (Terms & Signature + SMS/Email code) → Verify (6-digit code, "Verify & Submit")
//   → "Application submitted successfully!" → back to Companies: Pending → Approved.
// Package names/features/prices are EXAMPLES (real plans come from the API) — prices blurred.
// ALL names and data are FICTIONAL (Northstar Skills Academy).
// Voice: bash generate-voice-apply.sh (patches DURATIONS + VOICED below).
""")
keys = [f"a{i}" for i in range(9)]
design = dict(a0=220,a1=220,a2=330,a3=420,a4=300,a5=360,a6=260,a7=300,a8=190)
pace = {k: (1 if k in ("a0","a8") else 1.05) for k in keys}
t = set_timing(t, keys, design, pace, ["a0"])
t += Path("_parts/apply_scenes.part.tsx").read_text() + "\n"
comp = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  a0: SceneHookApply, a1: SceneCompanies, a2: ScenePackage, a3: SceneDetails, a4: ScenePayment, a5: SceneSign, a6: SceneVerify, a7: SceneStatus, a8: SceneWrapApply,\n};", comp)
comp = comp.replace("export const TrainingFollowUpVideo", "export const ApplyCompanyVideo").replace('k === "t7" ? TAIL', 'k === "a8" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", "staticFile(`apply/${k}.mp3`)")
t += comp
(SRC / "ApplyCompanyVideo.tsx").write_text(t)
print("written", len(t.splitlines()))
