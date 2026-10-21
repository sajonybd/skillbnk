"""Insert a 2s PortalCard before every scene where the portal changes (idempotent).
Usage: python3 _parts/add_portal_cards.py src/X.tsx [...]"""
import re, sys
from pathlib import Path
KIND = {"Company portal": "company", "Training provider portal": "provider", "Branch portal": "provider", "Learner portal": "learner", "Course page": "website"}
for fn in sys.argv[1:]:
    p = Path(fn); t = p.read_text()
    if "CARD_BEFORE" in t: print(fn, "already has cards"); continue
    t = t.replace('label="Branch portal"', 'label="Training provider portal"').replace('url="learner.skillbnk.com"', 'url="portal.skillbnk.com"')
    m = re.search(r"const SCENES: Record<Key, React.FC<SceneProps>> = \{(.*?)\};", t, re.S)
    pairs = re.findall(r"(\w+): (\w+)", m.group(1))
    last = None; cards = {}
    for key, scene in pairs:
        i = t.find(f"const {scene}: React.FC")
        j = t.find("\n};\n", i)
        lab = re.search(r'<PortalTag[^>]*label="([^"]+)"', t[i:j])
        if not lab: continue
        k = KIND[lab.group(1)]
        if k != last: cards[key] = k
        last = k
    t = t.replace('import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";', 'import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";\nimport { PortalCard, CARD_FRAMES, PortalKind } from "./PortalCard";', 1)
    decl = "// Portal poster (2s, no voice) before each scene where the portal changes.\nconst CARD_BEFORE: Partial<Record<Key, PortalKind>> = { " + ", ".join(f'{k}: "{v}"' for k, v in cards.items()) + " };\n"
    old = "for (const k of POST) { STARTS[k] = _pos; _pos += LEN[k]; }"
    assert old in t, fn
    t = t.replace(old, "for (const k of POST) { if (CARD_BEFORE[k]) _pos += CARD_FRAMES; STARTS[k] = _pos; _pos += LEN[k]; }")
    t = t.replace("const STARTS = {} as Record<Key, number>;", decl + "const STARTS = {} as Record<Key, number>;", 1)
    anchor = "      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}>"
    assert anchor in t, fn
    t = t.replace(anchor, """      {ALL.filter((k) => CARD_BEFORE[k]).map((k) => (
        <Sequence key={`card-${k}`} from={STARTS[k] - CARD_FRAMES} durationInFrames={CARD_FRAMES}>
          <PortalCard kind={CARD_BEFORE[k]!} />
        </Sequence>
      ))}
""" + anchor, 1)
    p.write_text(t); print(fn, cards)
