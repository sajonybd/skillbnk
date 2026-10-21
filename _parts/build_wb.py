import re, sys
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx")
head = fu[: fu.index("// ─── Company portal shell")]
comp = fu[fu.index("// ═══ Composition"):]
t = head
t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), """// WebsiteBuilderVideo — "Website Builder" (sheet serial 16).
// Every screen verified in the skillBNK code (claude/website-builder-video.md): editor header
//   (AI · Library · Settings · Page SEO · Export · Import · Preview · Save draft · Publish changes · Live),
//   Pages panel (Global Navbar/Footer, Custom/Default pages, Add page), Design library (Components /
//   Pages, "Use page", "Add block"), drag-and-drop components, block fields + style, Build with AI
//   (Section / Full page / Import HTML), Desktop/Tablet/Mobile, Page SEO, Save draft → Publish.
// ALL names and data are FICTIONAL (Brightpath Academy).
// Voice: bash generate-voice-websitebuilder.sh (patches DURATIONS + VOICED below).
""")
keys = ["b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","b10"]
design = dict(b0=230,b1=300,b2=330,b3=420,b4=400,b5=330,b6=420,b7=230,b8=320,b9=330,b10=260)
pace = {k: 1 for k in keys}
t = set_timing(t, keys, design, pace, ["b0"])
t += Path("_parts/wl_scenes.part.tsx").read_text() + Path("_parts/cd_scenes.part.tsx").read_text() + Path("_parts/wb_scenes.part.tsx").read_text() + "\n"
comp = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  b0: SceneHookWB, b1: SceneEditorTour, b2: ScenePages, b3: SceneTemplate, b4: SceneAddBlocks, b5: SceneFields, b6: SceneAiSection, b7: SceneGlobal, b8: ScenePreviewSeo, b9: ScenePublish, b10: SceneWrapWB,\n};", comp)
comp = comp.replace("export const TrainingFollowUpVideo", "export const WebsiteBuilderVideo").replace('k === "t7" ? TAIL', 'k === "b10" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", "staticFile(`websitebuilder/${k}.mp3`)")
t += comp
t = portal_tag_bottom_right(t)
(SRC / "WebsiteBuilderVideo.tsx").write_text(t)
print("written", len(t.splitlines()))
