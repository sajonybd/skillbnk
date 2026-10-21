"""Builds the three Forms-series videos (sheet serials 17–19). Run from the project root: python3 _parts/build_forms.py"""
import re, sys
from pathlib import Path
sys.path.insert(0, "_parts")
from buildlib import *
fu = read("TrainingFollowUpVideo.tsx")
HEAD = fu[: fu.index("// ─── Company portal shell")]
COMP = fu[fu.index("// ═══ Composition"):]
VIDEOS = {
  "EnrollmentFormBuilderVideo": dict(folder="enrollmentbuilder", part="ef_scenes.part.tsx", serial=17, title="Enrollment Form Builder",
    keys=["e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","e10"],
    design=dict(e0=400,e1=330,e2=300,e3=420,e4=360,e5=420,e6=420,e7=380,e8=400,e9=460,e10=220),
    scenes="SceneHookEF SceneOpenEF SceneTourEF SceneStepsEF SceneRowsEF SceneDragEF SceneConfigEF SceneColsEF SceneTestEF SceneAnswersEF SceneWrapEF"),
  "FormBuilderVideo": dict(folder="formbuilder", part="fb_scenes.part.tsx", serial=18, title="Form Builder",
    keys=["f0","f1","f2","f3","f4","f5","f6","f7","f8","f9"],
    design=dict(f0=400,f1=330,f2=330,f3=420,f4=360,f5=360,f6=330,f7=420,f8=420,f9=220),
    scenes="SceneHookFB SceneListFB SceneLayoutFB SceneRowsFB SceneProps2FB SceneTabsFB SceneTestFB SceneSaveFB SceneShareFB SceneWrapFB"),
  "FormResponsesVideo": dict(folder="formresponses", part="fb_scenes.part.tsx fr_scenes.part.tsx", serial=19, title="Form Responses",
    keys=["r0","r1","r2","r3","r4","r5","r6","r7"],
    design=dict(r0=400,r1=330,r2=330,r3=390,r4=420,r5=360,r6=390,r7=220),
    scenes="SceneHookFR SceneSubmitFR SceneListFR SceneTableFR SceneDetailFR SceneSignedFR SceneExportFR SceneWrapFR"),
  "ManageLocationsVideo": dict(folder="locations", part="ops_common.part.tsx br_scenes.part.tsx", serial=20, title="Manage Multiple Locations",
    keys=["m0","m1","m2","m3","m4","m5","m6","m7"],
    design=dict(m0=390,m1=318,m2=400,m3=259,m4=306,m5=342,m6=353,m7=150),
    scenes="SceneHookBR SceneListBR SceneInfoBR SceneContactBR SceneDocsBR SceneNewBR SceneDetailBR SceneWrapBR"),
  "TeamAccessVideo": dict(folder="teamaccess", part="ops_common.part.tsx pp_scenes.part.tsx", serial=21, title="Programs, Instructors & Staff",
    keys=["p0","p1","p2","p3","p4","p5","p6"],
    design=dict(p0=459,p1=365,p2=306,p3=330,p4=365,p5=353,p6=150),
    scenes="SceneHookPP SceneListPP ScenePickPP SceneInstPP SceneRolePP SceneStaffPP SceneWrapPP"),
  "IntegrationsVideo": dict(folder="integrations", part="ops_common.part.tsx ig_scenes.part.tsx", serial=22, title="Integrations",
    keys=["i0","i1","i2","i3","i4","i5","i6","i6b","i7"],
    design=dict(i0=435,i1=259,i2=365,i3=330,i4=306,i5=353,i6=283,i6b=370,i7=150),
    scenes="SceneHookIG SceneTourIG SceneAiIG SceneZoomIG SceneMsgIG ScenePayIG SceneHealthIG SceneLocIG SceneWrapIG"),
  "EmailCampaignsVideo": dict(folder="emailcampaigns", part="ops_common.part.tsx mk_common.part.tsx em_scenes.part.tsx", serial=23, title="Email Campaigns",
    keys=['s0', 's1', 's2', 's3', 's4', 's5', 's6'], design=dict(s0=448,s1=377,s2=389,s3=565,s4=295,s5=306,s6=150),
    scenes="SceneHookEM SceneListEM SceneAudEM SceneComposeEM SceneSentEM SceneCronEM SceneWrapEM"),
  "SmsCampaignsVideo": dict(folder="smscampaigns", part="ops_common.part.tsx mk_common.part.tsx sm_scenes.part.tsx", serial=24, title="SMS Campaigns",
    keys=['q0', 'q1', 'q2', 'q3', 'q4', 'q5'], design=dict(q0=495,q1=271,q2=412,q3=330,q4=259,q5=150),
    scenes="SceneHookSM SceneListSM SceneWriteSM SceneSendSM SceneRepeatSM SceneWrapSM"),
  "PromoCodesVideo": dict(folder="promocodes", part="ops_common.part.tsx pr_scenes.part.tsx", serial=25, title="Promo Codes",
    keys=['o0', 'o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7'], design=dict(o0=506,o1=306,o2=377,o3=377,o4=165,o5=448,o6=248,o7=150),
    scenes="SceneHookPR SceneListPR SceneBasicPR SceneRulesPR SceneCopyPR SceneCheckoutPR SceneReportPR SceneWrapPR"),
}
only = sys.argv[1:] or list(VIDEOS)
for name in only:
    v = VIDEOS[name]
    t = HEAD
    t = replace_once(t, between(t, "// TrainingFollowUpVideo —", "// ════"), f"""// {name} — "{v['title']}" (sheet serial {v['serial']}).
// Every label verified in the skillBNK code (see the header comment of the scenes part below).
// ALL names and data are FICTIONAL (Brightpath Academy). Built by _parts/build_forms.py.
// Voice: bash generate-voice-{v['folder']}.sh (patches DURATIONS + VOICED below).
""")
    keys = v["keys"]
    t = set_timing(t, keys, v["design"], {k: 1 for k in keys}, [keys[0]])
    t += Path("_parts/wl_scenes.part.tsx").read_text() + Path("_parts/forms_common.part.tsx").read_text() + "".join(Path("_parts/" + q).read_text() for q in v["part"].split()) + "\n"
    sc = v["scenes"].split()
    c = re.sub(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{[^}]+\};", "const SCENES: Record<Key, React.FC<SceneProps>> = {\n  " + ", ".join(f"{k}: {s}" for k, s in zip(keys, sc)) + ",\n};", COMP)
    c = c.replace("export const TrainingFollowUpVideo", f"export const {name}").replace('k === "t7" ? TAIL', f'k === "{keys[-1]}" ? TAIL').replace("staticFile(`followup/${k}.mp3`)", f"staticFile(`{v['folder']}/${{k}}.mp3`)")
    t += c
    t = portal_tag_bottom_right(t)
    old = SRC / f"{name}.tsx"
    if old.exists():  # keep voice timing from generate-voice-*.sh so a rebuild never mutes the video
        o = old.read_text()
        for pat in [r"const DURATIONS = \{[^}]+\};", r"const VOICED: string\[\] = \[[^\]]*\];"]:
            m = re.search(pat, o)
            if m and "VOICED" in pat and m.group(0).endswith("[];"): continue
            if m: t = re.sub(pat, lambda _: m.group(0), t, count=1)
    (SRC / f"{name}.tsx").write_text(t)
    print("written", name, len(t.splitlines()))
