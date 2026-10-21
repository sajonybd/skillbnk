import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx")
head = fu[: fu.index("// ─── Company portal shell")]
comp = fu[fu.index("// ═══ Composition"):]
t = head
t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), """// WhiteLabelVideo — "White-Label Training Platform" (sheet serial 14).
// Every screen verified in the skillBNK code (claude/white-label-video.md):
//   Company → Website Builder (New Website: Name / Slug / Page title / Description)
//   → Brand panel (Colors / Type / Logos) → Domain setup (Main custom landing domain, DNS TXT)
//   → every portal on your domain (learner./branch./company.<domain>) → branded login page.
// ALL names and data are FICTIONAL (Brightpath Academy, learnbrightpath.com).
// Voice: bash generate-voice-whitelabel.sh (patches DURATIONS + VOICED below).
""")
keys = ["w0","w1","w2","w3","w4","w5","w6"]
design = dict(w0=240,w1=330,w2=480,w3=420,w4=400,w5=300,w6=190)
pace = {k: (1 if k in ("w0","w6") else 1.05) for k in keys}
t = set_timing(t, keys, design, pace, ["w0"])
t += Path("_parts/wl_scenes.part.tsx").read_text() + "\n"
comp = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  w0: SceneHookWL, w1: SceneNewSite, w2: SceneBlocks, w3: SceneBrand, w4: SceneDomain, w5: SceneLearnerWL, w6: SceneWrapWL,\n};", comp)
comp = comp.replace("export const TrainingFollowUpVideo", "export const WhiteLabelVideo").replace('k === "t7" ? TAIL', 'k === "w6" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", "staticFile(`whitelabel/${k}.mp3`)")
t += comp
(SRC / "WhiteLabelVideo.tsx").write_text(t)
print("written", len(t.splitlines()))
