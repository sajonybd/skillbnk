import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx")
head = fu[: fu.index("// ─── Company portal shell")]
comp = fu[fu.index("// ═══ Composition"):]
t = head
t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), """// CustomDomainVideo — "Custom Domain for Your Training Business" (sheet serial 15).
// Every screen verified in the skillBNK code (claude/custom-domain-video.md): Website Builder card
//   "Set up" → Domain setup modal → DNS instructions (4 CNAME rows + copy) → Save domain →
//   pending status + Cloudflare hostname/SSL verification (SSL TXT records) → Verify → active.
//   The registrar screen (d3) is a generic, clearly-labelled example (not skillBNK UI).
// ALL names and data are FICTIONAL (Brightpath Academy, learnbrightpath.com).
// Voice: bash generate-voice-customdomain.sh (patches DURATIONS + VOICED below).
""")
keys = ["d0","d1","d2","d3","d4","d5","d6","d7"]
design = dict(d0=230,d1=300,d2=520,d3=330,d4=360,d5=330,d6=430,d7=190)
pace = {k: (1 if k in ("d0","d7") else 1.05) for k in keys}
t = set_timing(t, keys, design, pace, ["d0"])
t += Path("_parts/wl_scenes.part.tsx").read_text() + Path("_parts/cd_scenes.part.tsx").read_text() + "\n"
comp = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  d0: SceneHookCD, d1: SceneCardSetup, d2: SceneDnsRecords, d3: SceneRegistrar, d4: ScenePending, d5: SceneVerifyDomain, d6: SceneLive, d7: SceneWrapCD,\n};", comp)
comp = comp.replace("export const TrainingFollowUpVideo", "export const CustomDomainVideo").replace('k === "t7" ? TAIL', 'k === "d7" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", "staticFile(`customdomain/${k}.mp3`)")
t += comp
(SRC / "CustomDomainVideo.tsx").write_text(t)
print("written", len(t.splitlines()))
