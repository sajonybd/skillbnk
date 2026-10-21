# TS4U Menu Builder — AI Motion Video

A Remotion marketing video explaining the Menu Builder feature of skillbnk.com.

## Scenes (18s total @ 30fps)

| # | Scene | Frames | Duration |
|---|-------|--------|----------|
| 1 | Hook — "Your Navigation. Your Rules." | 0–90 | 3s |
| 2 | Problem — too many menus, zero control | 90–195 | 3.5s |
| 3 | Introduce Menu Builder | 195–300 | 3.5s |
| 4 | Drag & Drop to reorder | 300–390 | 3s |
| 5 | Premade Templates | 390–465 | 2.5s |
| 6 | Full Customization (icons, rename, folders) | 465–525 | 2s |
| 7 | CTA — Clean. Powerful. Yours. | 525–540 | 0.5s+ |

## Commands

```bash
# Open Remotion Studio (preview in browser)
npm start

# Render to MP4
npx remotion render src/index.ts MenuBuilderVideo out/menu-builder.mp4

# Render a single frame (preview)
npx remotion still src/index.ts MenuBuilderVideo --frame=300 out/frame300.png
```

## Voice Over (to add later)
Scenes are timed for a professional VO track. Suggested script:

1. **Hook (0-3s):** "Your navigation. Your rules."
2. **Problem (3-6.5s):** "Managing a platform with 10+ sections shouldn't feel like chaos."
3. **Intro (6.5-10s):** "Introducing Menu Builder — build your navigation exactly how you want."
4. **Organize (10-13s):** "Simply drag any menu item to reorganize your entire structure in seconds."
5. **Templates (13-15.5s):** "Or choose from premade templates — already organized, ready to go."
6. **Customize (15.5-17.5s):** "Change icons, rename, create folders — every detail, your way."
7. **CTA (17.5-18s+):** "Clean. Powerful. Yours. — skillbnk.com"

## Adding Voice-Over (macOS neural TTS — free, no API key)

```bash
# Step 1: Generate all 6 voice clips (takes ~10 seconds)
bash generate-voice.sh

# Step 2: Preview with voice in Remotion Studio
npm start

# Step 3: Render final MP4 with voice
npx remotion render src/index.ts MenuBuilderVideo out/menu-builder-with-voice.mp4
```

### Voice script (per scene)
| Scene | Frame | Line |
|-------|-------|------|
| App Reveal | 0 | "Your navigation. Your rules. Meet Menu Builder." |
| Menu List | 90 | "Your platform has every section covered..." |
| Drag & Drop | 225 | "Reordering takes seconds. Drag any menu item..." |
| Edit Modal | 345 | "Click edit on any item to fully customize it..." |
| Templates | 465 | "Don't want to build from scratch?..." |
| CTA | 555 | "Clean. Flexible. Yours. — skillbnk dot com." |

### Change the voice
Edit `generate-voice.sh` and swap the `VOICE=` line:
- `"Ava (Enhanced)"` — Siri-quality American female (recommended)
- `"Zoe (Enhanced)"` — Clear, professional female  
- `"Tom"` — Warm American male
- `"Daniel (Enhanced)"` — British male

Download Enhanced voices: **System Settings → Accessibility → Spoken Content → System Voice → Manage Voices**
