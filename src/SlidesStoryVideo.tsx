import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, pr, lin, sp, makeCues, K4, mono, P3, monoP, CameraWorld, Backdrop, Scribble, Cursor } from "./premiumKit";
import { realMenuPt, LandWin, StepChipL, PortalTagL, Avatar, Badge, Btn, CT, MA, BLUE, INK, GRAY, LINE } from "./storyLand";
import { makeTL, typed, Toast, StoryMain, HookTag, menuPt, Table, PageHead, Fx } from "./storyShell";

/**
 * SlidesStoryVideo — DEEP version (sheet serial 38, ~2.5 min). Story: Leo Grant, Summit Culinary Academy (fictional).
 * Verified in code: SB-Branch ForStudents/slide/Slide.tsx ("Slides", "Manage all slides for presentations", "Enter Title...",
 * Create New Slide, Grid View / List View, export ("Slides exported successfully!"), filter Assigned To / Bootcamp / Session /
 * Created By, columns Title / Audience / Publish Status (Draft / Published) / Created By / Creation Date / Last Updated / Action,
 * View, Clone ("Slide cloned successfully")). presentation/CreateSlideTypeDialog ("Create a slide", Rich-text slide / Presentation —
 * "Use the visual editor with elements, tables, charts, and motion."). libs/shared/presentation editor: header "All presentations",
 * Undo / Redo; sidebar Template / Text / Elements / AI / Motion / Layers; AI panel "Create with AI", "Generate an editable slide deck",
 * "Choose between 1 and 10 pages", styles Professional / Minimal / Bold, "Use current slides as context"; Elements → Charts (Bar chart);
 * Motion "Transitions & animations", Effect "Fade in", Trigger. PresentationSlideActions: "Assign To", "Save Slide" → "Save as draft" /
 * "Publish for learners"; AssignToForm User / Programs / Groups / Global + Session. Learner (en.ts): "Presentations & Slides",
 * "Browse and manage your slide decks", "Search Slides By Title...", Total Slides, Uploaded Date, View, "Full Screen".
 * Voice: python3 generate-voice-story.py src/SlidesStoryVideo.tsx public/slidestory  (REDO=1)
 */

const SEGS = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 303,
  d1: 256,
  d2: 290,
  d3: 259,
  d4: 236,
  d5: 232,
  d6: 222,
  d7: 150,
  d8: 166,
  d9: 228,
  d10: 248,
  d11: 208,
  d12: 236,
  p13: 154,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "p13"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 15, 28, 40, 74, 76, 85, 94, 109, 117, 123, 165, 171, 176, 189, 189, 204, 216, 217, 239, 246, 251, 258, 272],
  d1: [2, 12, 37, 48, 55, 65, 76, 112, 115, 124, 132, 138, 145, 152, 175, 178, 184, 189, 204, 204, 220],
  d2: [2, 16, 28, 47, 57, 89, 91, 97, 104, 112, 117, 144, 148, 160, 172, 183, 201, 236, 241, 250, 261],
  d3: [2, 17, 30, 80, 82, 88, 93, 103, 111, 145, 157, 181, 207, 225, 236],
  d4: [2, 13, 26, 36, 70, 73, 86, 92, 124, 124, 133, 141, 158, 176, 180, 191, 203],
  d5: [2, 18, 28, 42, 58, 70, 82, 90, 102, 134, 141, 152, 161, 168, 175, 181],
  d6: [2, 25, 35, 43, 48, 75, 76, 81, 87, 94, 100, 108, 138, 144, 154, 162, 168, 178, 187],
  d7: [2, 10, 34, 39, 47, 57, 62, 71, 81, 87, 96, 104, 108, 112, 119, 126],
  d8: [2, 28, 41, 69, 75, 81, 89, 92, 97, 102, 128, 140],
  d9: [2, 16, 23, 34, 43, 52, 60, 67, 75, 95, 100, 109, 117, 124, 135, 149, 183, 187],
  d10: [2, 23, 28, 34, 47, 51, 57, 68, 74, 96, 115, 118, 131, 134, 146, 147, 151, 157, 164, 171, 184, 197, 203, 211],
  d11: [2, 12, 21, 30, 46, 61, 73, 91, 101, 124, 129, 136, 141, 156, 160, 166, 174],
  d12: [2, 13, 24, 43, 46, 52, 63, 94, 97, 105, 114, 122, 130, 138, 145, 175, 178, 205, 211],
  p13: [2, 17, 27, 33, 50, 62, 70, 81, 94, 100, 111],
};
// @WT-END

const SCRIPTS: Record<Seg, string> = {
  h0: "Leo teaches knife skills. His best deck sits on his laptop. Learners get a blurry PDF a week later, if they remember to ask.",
  d1: "In skillbank, every deck lives under Slides. Each one shows who it's assigned to, and whether it's a draft or published.",
  d2: "He clicks Create New Slide. There are two ways to build: a quick rich-text slide, or Presentation, the full visual editor.",
  d3: "He picks Presentation. Down the left side are templates, text, elements, AI, motion, and layers.",
  d4: "He starts with AI. He describes the deck, asks for six pages, and chooses a professional style.",
  d5: "Create with AI builds an editable deck in seconds. Every slide is still his to change.",
  d6: "He types his own title, and adds a bar chart from Elements, showing which cuts the class finds hardest.",
  d7: "In Motion, a simple fade in makes each cut appear right when he talks about it.",
  d8: "Then Assign To. He shares the deck with his program, evening session.",
  d9: "Save as draft while he's still working on it. Or publish for learners when it's ready. Leo publishes.",
  d10: "Back in the list, the deck now shows as published. Next term, he can clone it in one click, or export the whole list.",
  d11: "Now, the learner side. Ana opens Presentations and Slides, and finds the deck, with its slide count.",
  d12: "She opens it, and goes full screen. The same deck Leo built ten minutes ago. No PDF, no waiting.",
  p13: "Leo builds it once, and every class sees the latest version.",
};

const TL = makeTL(SEGS, DURATIONS);
const { SEG_START: S, DEMO_START, PAY_START } = TL;
export const TOTAL_FRAMES = TL.TOTAL;
const cue = makeCues(SCRIPTS, S, WT);

const MENU = ["Dashboard", "Approved Member", "Documents and Labs", "Slides", "Templates", "Settings"];
const ICONS = ["▦", "✅", "📄", "🖼", "🧩", "⚙"];
const DECK = "Knife Skills 101";
const PROMPT = "A six-slide lesson on the four basic knife cuts for new line cooks.";
const T = {
  appIn: DEMO_START,
  clickMenu: cue("d1", "slides", -6),
  tour: cue("d1", "assigned", -4),
  clickCreate: cue("d2", "create", -2),
  richHl: cue("d2", "rich", -4),
  presHl: cue("d2", "presentation", -4),
  clickPres: cue("d3", "picks", -2),
  tabs: cue("d3", "templates", -4),
  clickAI: cue("d4", "ai", -6),
  typePrompt: cue("d4", "describes", -4),
  pages: cue("d4", "six", -4),
  style: cue("d4", "professional", -4),
  clickGen: cue("d5", "create", -4),
  deckIn: cue("d5", "builds", 6),
  editTitle: cue("d6", "title", -6),
  clickElements: cue("d6", "elements", -8),
  chartIn: cue("d6", "showing", -4),
  clickMotion: cue("d7", "motion", -4),
  fade: cue("d7", "fade", -2),
  clickAssign: cue("d8", "assign", -4),
  pickSession: cue("d8", "evening", -4),
  clickSaveMenu: cue("d9", "save", -6),
  clickPublish: cue("d9", "publishes", -4),
  back: S.d10 + 4,
  clickMore: cue("d10", "clone", -6),
  clickExport: cue("d10", "export", -2),
  learner: cue("d11", "learner", -8),
  clickView: cue("d12", "opens", -2),
  full: cue("d12", "full", -2),
};
const CLICKS = [T.clickMenu, T.clickCreate, T.clickPres, T.clickAI, T.typePrompt, T.pages, T.style, T.clickGen, T.editTitle, T.clickElements, T.chartIn, T.clickMotion, T.fade, T.clickAssign, T.pickSession, T.clickSaveMenu, T.clickPublish, T.clickMore, T.clickExport, T.clickView, T.full];
const scene = (f: number) => (f >= T.learner ? "learner" : f >= T.back ? "list2" : f >= T.clickPres + 6 ? "editor" : "list");

// ───────── list ─────────
const COLS = [{ h: "Title", w: 330 }, { h: "Audience", w: 250 }, { h: "Publish Status", w: 160 }, { h: "Created By", w: 190 }, { h: "Creation Date", w: 160 }, { h: "Last Updated", w: 150 }, { h: "Action", w: 70 }];
const BASE: [string, string, boolean][] = [["Mise en place basics", "Morning session", true], ["Food safety temperatures", "Global", true], ["Stocks & mother sauces", "Group · Weekend", false]];
const ListPage: React.FC<{ f: number; after?: boolean }> = ({ f, after }) => {
  const dlg = !after && f >= T.clickCreate + 2 ? pr(f, T.clickCreate + 2, 12) : 0;
  const rows: [string, string, boolean][] = after ? [[DECK, "Evening session", true], ...BASE] : BASE;
  const dd = after && f >= T.clickMore + 2 && f < T.clickExport - 4 ? pr(f, T.clickMore + 2, 8) : 0;
  return (
    <>
      <PageHead title="Slides" sub="Manage all slides for presentations" />
      <div style={{ position: "absolute", left: 650, top: 24, width: 320, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Enter Title...</div>
      {["▦", "☰", "⚲", "⇩"].map((g, i) => <div key={g} style={{ position: "absolute", left: 984 + i * 56, top: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${(g === "⇩" && f >= T.clickExport - 6 && after) || (g === "☰") ? BLUE : LINE}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, color: "#374151" }}>{g}</div>)}
      <Btn x={1210} y={24} w={120} label="＋ Create" primary fs={17} press={f >= T.clickCreate && f < T.clickCreate + 6 ? 1 : 0} />
      <Table x={18} y={130} cols={COLS} rowH={68} hl={after ? 0 : -1}
        rows={rows.map(([t, a, p], i) => [<b style={{ fontWeight: 800 }}>🖼 {t}</b>, a, p ? <Badge t="Published" c="#15803D" bg="#DCFCE7" fs={13} dot /> : <Badge t="Draft" c="#92400E" bg="#FEF3C7" fs={13} dot />, <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar t="LG" s={28} />Leo Grant</div>, <span style={{ color: GRAY }}>{i === 0 && after ? "Today" : `Sep ${12 + i * 5}, 2026`}</span>, <span style={{ color: GRAY }}>{i === 0 && after ? "Today" : `Oct 0${2 + i}, 2026`}</span>, <span style={{ color: BLUE, fontWeight: 900 }}>👁 ⋮</span>])} />
      {dd > 0 && (
        <div style={{ position: "absolute", left: 1150, top: 130 + 54 + 34 + 20, width: 170, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, opacity: dd }}>
          {["Update", "Clone", "Delete"].map((t) => <div key={t} style={{ height: 42, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, fontWeight: 700, color: t === "Delete" ? "#B91C1C" : t === "Clone" ? BLUE : INK, background: t === "Clone" ? "#EEF2FF" : "transparent" }}>{t}</div>)}
        </div>
      )}
      {dlg > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * dlg})` }} />
          <div style={{ position: "absolute", left: 230, top: 160 + (1 - dlg) * 20, width: 880, height: 420, borderRadius: 22, background: "#fff", opacity: dlg, boxShadow: "0 40px 120px #000A", padding: 30, boxSizing: "border-box", fontFamily: FONT }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: INK }}>Create a slide</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: GRAY }}>Choose the editing experience for this slide.</div>
            {[["📝", "Rich-text slide", "Use the existing text slide editor.", T.richHl], ["✨", "Presentation", "Use the visual editor with elements, tables, charts, and motion.", T.presHl]].map(([g, t, d, at], i) => {
              const on = f >= (at as number) && (i === 1 || f < T.presHl);
              return <div key={t as string} style={{ position: "absolute", left: 30 + i * 420, top: 120, width: 400, height: 210, borderRadius: 18, border: `3px solid ${on ? BLUE : LINE}`, background: on ? "#EEF2FF" : "#fff", padding: 22, boxSizing: "border-box" }}><div style={{ fontSize: 40 }}>{g as string}</div><div style={{ marginTop: 8, fontSize: 22, fontWeight: 900, color: INK }}>{t as string}</div><div style={{ marginTop: 6, fontSize: 16, fontWeight: 600, color: GRAY, lineHeight: 1.4 }}>{d as string}</div></div>;
            })}
          </div>
        </>
      )}
    </>
  );
};

// ───────── slide art ─────────
const Slide: React.FC<{ f: number; at: number; title?: string; chart?: number; fade?: number; sc?: number }> = ({ f, at, title = "The Four Basic Cuts", chart = 0, fade = 1, sc = 1 }) => {
  const s = (k: number) => pr(f, at + k * 8, 14);
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0F172A,#1E3A8A)", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 50 * sc, top: 44 * sc, fontSize: 44 * sc, fontWeight: 900, color: "#fff", opacity: s(0) }}>{title}</div>
      <div style={{ position: "absolute", left: 50 * sc, top: 108 * sc, fontSize: 20 * sc, fontWeight: 700, color: "#93C5FD", opacity: s(1) }}>{DECK} · Lesson 1</div>
      {["Julienne", "Brunoise", "Batonnet", "Chiffonade"].map((t, i) => <div key={t} style={{ position: "absolute", left: 50 * sc + i * 140 * sc, top: 170 * sc, width: 124 * sc, height: 104 * sc, borderRadius: 14 * sc, background: ["#F97316", "#22C55E", "#EAB308", "#A855F7"][i], opacity: s(2 + i * 0.5) * (i === 0 ? 1 : fade), display: "flex", alignItems: "flex-end", padding: 10 * sc, boxSizing: "border-box", fontSize: 16 * sc, fontWeight: 900, color: "#fff" }}>{t}</div>)}
      {chart > 0 && (
        <div style={{ position: "absolute", left: 640 * sc, top: 160 * sc, width: 250 * sc, height: 140 * sc, opacity: chart }}>
          {[70, 95, 50, 85].map((h, i) => <div key={i} style={{ position: "absolute", left: i * 58 * sc, bottom: 0, width: 42 * sc, height: h * sc * chart, borderRadius: 6 * sc, background: ["#F97316", "#22C55E", "#EAB308", "#A855F7"][i] }} />)}
          <div style={{ position: "absolute", left: 0, top: -26 * sc, fontSize: 14 * sc, fontWeight: 800, color: "#BFDBFE" }}>Hardest cuts (class vote)</div>
        </div>
      )}
    </div>
  );
};

// ───────── editor ─────────
const TABS = ["Template", "Text", "Elements", "AI", "Motion", "Layers"];
const Editor: React.FC<{ f: number }> = ({ f }) => {
  const tab = f >= T.clickMotion ? "Motion" : f >= T.clickElements ? "Elements" : f >= T.clickAI ? "AI" : "";
  const deck = f >= T.deckIn;
  const title = f >= T.editTitle ? typed(f, T.editTitle + 4, "Knife Cuts Every Cook Needs", 0.8) || "The Four Basic Cuts" : "The Four Basic Cuts";
  const chart = f >= T.chartIn ? pr(f, T.chartIn, 20) : 0;
  const fade = f >= T.fade + 10 ? (Math.floor((f - T.fade) / 30) % 2 === 0 ? pr((f - T.fade) % 30, 0, 14) : 1) : 1;
  const asg = f >= T.clickAssign + 2 && f < T.clickSaveMenu - 4 ? pr(f, T.clickAssign + 2, 10) * (1 - lin(f, T.clickSaveMenu - 14, T.clickSaveMenu - 4)) : 0;
  const menu = f >= T.clickSaveMenu + 2 && f < T.clickPublish + 8 ? pr(f, T.clickSaveMenu + 2, 8) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#E5E7EB" }}>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 62, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: GRAY }}>← All presentations</span>
        <b style={{ fontSize: 18, color: INK, marginLeft: 16 }}>{DECK}</b>
        <span style={{ marginLeft: 16, fontSize: 15, color: GRAY }}>↶ Undo &nbsp; ↷ Redo</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <span style={{ padding: "10px 16px", borderRadius: 10, border: `2px solid ${f >= T.clickAssign - 8 && f < T.clickAssign + 6 ? BLUE : LINE}`, fontWeight: 800, fontSize: 15, color: INK }}>👥 Assign To</span>
          <span style={{ padding: "10px 16px", borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 15 }}>Save Slide ⌄</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 62, width: 86, bottom: 0, background: "#fff", borderRight: `1px solid ${LINE}`, paddingTop: 10 }}>
        {TABS.map((t, i) => <div key={t} style={{ height: 72, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 13, fontWeight: 800, color: t === tab ? BLUE : "#4B5563", background: t === tab ? "#EEF2FF" : f >= T.tabs + i * 6 && f < T.tabs + i * 6 + 14 ? "#F3F4F6" : "transparent" }}><span style={{ fontSize: 22 }}>{["▤", "T", "◆", "✨", "➜", "≡"][i]}</span>{t}</div>)}
      </div>
      {tab && (
        <div style={{ position: "absolute", left: 86, top: 62, width: 340, bottom: 0, background: "#fff", borderRight: `1px solid ${LINE}`, padding: 18, boxSizing: "border-box" }}>
          {tab === "AI" && (
            <>
              <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Create with AI</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: GRAY }}>Generate an editable slide deck</div>
              <div style={{ marginTop: 14, height: 130, borderRadius: 12, border: `2px solid ${f >= T.typePrompt && f < T.pages ? BLUE : LINE}`, padding: 12, fontSize: 15, fontWeight: 600, color: INK, lineHeight: 1.45 }}>{typed(f, T.typePrompt, PROMPT, 1.6)}</div>
              <div style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: "#374151" }}>Pages</div>
              <div style={{ marginTop: 6, height: 42, borderRadius: 10, border: `2px solid ${f >= T.pages && f < T.style ? BLUE : LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, fontWeight: 800, color: INK }}>{f >= T.pages + 4 ? "6" : "4"}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, marginTop: 4 }}>Choose between 1 and 10 pages</div>
              <div style={{ marginTop: 12, display: "flex", gap: 6 }}>{["Professional", "Minimal", "Bold"].map((t) => <span key={t} style={{ padding: "8px 10px", borderRadius: 8, fontSize: 13, fontWeight: 800, border: `2px solid ${t === "Professional" && f >= T.style ? BLUE : LINE}`, background: t === "Professional" && f >= T.style ? "#EEF2FF" : "#fff", color: INK }}>{t}</span>)}</div>
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: GRAY }}>☐ Use current slides as context</div>
              <div style={{ marginTop: 16, height: 46, borderRadius: 12, background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, transform: `scale(${f >= T.clickGen && f < T.clickGen + 6 ? 0.94 : 1})` }}>{f >= T.clickGen && f < T.deckIn ? "Generating…" : "✨ Create with AI"}</div>
            </>
          )}
          {tab === "Elements" && (
            <>
              <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Elements</div>
              {[["Shapes", ["▭", "◯", "△"]], ["Charts", ["Bar chart", "Line chart", "Pie chart"]], ["Tables", ["3 × 3"]]].map(([h, items]) => (
                <div key={h as string} style={{ marginTop: 16 }}><div style={{ fontSize: 15, fontWeight: 900, color: "#374151" }}>{h as string}</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>{(items as string[]).map((it) => <span key={it} style={{ padding: "10px 12px", borderRadius: 10, border: `2px solid ${it === "Bar chart" && f >= T.chartIn - 10 ? BLUE : LINE}`, background: it === "Bar chart" && f >= T.chartIn - 10 ? "#EEF2FF" : "#F9FAFB", fontSize: 14, fontWeight: 800, color: INK }}>{it}</span>)}</div></div>
              ))}
            </>
          )}
          {tab === "Motion" && (
            <>
              <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>Transitions & animations</div>
              <div style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: "#374151" }}>Effect</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>{["None", "Fade in", "Fly in from left", "Spin"].map((t) => <span key={t} style={{ padding: "9px 12px", borderRadius: 10, border: `2px solid ${t === "Fade in" && f >= T.fade ? BLUE : LINE}`, background: t === "Fade in" && f >= T.fade ? "#EEF2FF" : "#F9FAFB", fontSize: 14, fontWeight: 800, color: INK }}>{t}</span>)}</div>
              <div style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: "#374151" }}>Trigger</div>
              <div style={{ marginTop: 6, height: 42, borderRadius: 10, border: `2px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, fontWeight: 700, color: INK }}>On click</div>
            </>
          )}
        </div>
      )}
      <div style={{ position: "absolute", left: tab ? 440 : 120, right: 20, top: 90, height: 0, paddingBottom: 0 }}>
        <div style={{ position: "relative", width: tab ? 890 : 1180, height: tab ? 500 : 664, borderRadius: 8, boxShadow: "0 20px 60px #0004", overflow: "hidden", background: "#fff" }}>
          {deck ? <Slide f={f} at={T.deckIn} title={title} chart={chart} fade={fade} sc={tab ? 1 : 1.32} /> : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#CBD5E1" }}>Blank page</div>}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>{Array.from({ length: deck ? 6 : 1 }).map((_, i) => <div key={i} style={{ width: 120, height: 68, borderRadius: 6, border: `3px solid ${i === 0 ? BLUE : LINE}`, background: deck ? "linear-gradient(135deg,#0F172A,#1E3A8A)" : "#fff", opacity: deck ? pr(f, T.deckIn + i * 5, 10) : 1 }} />)}</div>
      </div>
      {asg > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(17,24,39,${0.5 * asg})` }} />
          <div style={{ position: "absolute", left: 360, top: 140, width: 640, height: 400, borderRadius: 22, background: "#fff", opacity: asg, boxShadow: "0 40px 120px #000A", padding: 28, boxSizing: "border-box" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: INK }}>Assign Slide</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: GRAY }}>You can assign a slide to groups/programs/users or globally</div>
            {[["Assign To", "Programs"], ["Programs", "Culinary Arts — Fall 2026"], ["Session", f >= T.pickSession ? "Evening" : "Select Sessions"]].map(([l, v], i) => (
              <div key={l} style={{ marginTop: 16 }}><div style={{ fontSize: 15, fontWeight: 800, color: "#374151" }}>{l}</div><div style={{ marginTop: 6, height: 46, borderRadius: 10, border: `2px solid ${i === 2 && f >= T.pickSession - 6 ? BLUE : LINE}`, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 16, fontWeight: 700, color: v.startsWith("Select") ? "#9CA3AF" : INK }}>{v}</div></div>
            ))}
          </div>
        </>
      )}
      {menu > 0 && (
        <div style={{ position: "absolute", right: 20, top: 66, width: 220, borderRadius: 12, background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 20px 50px #0004", padding: 6, opacity: menu }}>
          {["Save as draft", "Publish for learners"].map((t) => <div key={t} style={{ height: 44, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, fontWeight: 800, color: t.startsWith("Publish") && f >= T.clickPublish - 8 ? BLUE : INK, background: t.startsWith("Publish") && f >= T.clickPublish - 8 ? "#EEF2FF" : "transparent" }}>{t}</div>)}
        </div>
      )}
    </div>
  );
};
const ED = (x: number, y: number) => CT(x, y);
const tabPt = (i: number) => ED(43, 62 + 10 + 36 + i * 72);

// ───────── learner ─────────
const Learner: React.FC<{ f: number }> = ({ f }) => {
  const v = f >= T.clickView + 2 ? pr(f, T.clickView + 2, 12) : 0;
  const fs = f >= T.full + 2 ? pr(f, T.full + 2, 16) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT, background: "#F8FAFC" }}>
      <PageHead title="Presentations & Slides" sub="Browse and manage your slide decks" />
      <div style={{ position: "absolute", left: 1000, top: 24, width: 330, height: 48, borderRadius: 12, border: `2px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, color: "#9CA3AF", fontWeight: 600, boxSizing: "border-box" }}>Search Slides By Title...</div>
      {[[DECK, 6], ["Food safety temperatures", 9], ["Mise en place basics", 7]].map(([t, n], i) => (
        <div key={t as string} style={{ position: "absolute", left: 32 + i * 440, top: 120, width: 410, height: 340, borderRadius: 18, background: "#fff", border: `2px solid ${i === 0 && f >= T.clickView - 12 ? BLUE : LINE}`, overflow: "hidden", opacity: pr(f, T.learner + 6 + i * 5, 10) }}>
          <div style={{ position: "relative", height: 200 }}>{i === 0 ? <Slide f={f} at={-200} title="Knife Cuts Every Cook Needs" chart={1} sc={0.44} /> : <div style={{ height: 200, background: ["", "#7C3AED", "#059669"][i] }} />}</div>
          <div style={{ padding: "12px 18px" }}><div style={{ fontSize: 20, fontWeight: 900, color: INK }}>{t as string}</div><div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: GRAY }}>Total Slides: {n as number} · Uploaded Date: {i === 0 ? "Today" : "Oct 02, 2026"}</div></div>
          <div style={{ position: "absolute", right: 16, bottom: 14, padding: "7px 16px", borderRadius: 10, background: i === 0 ? BLUE : "#EEF2FF", color: i === 0 ? "#fff" : BLUE, fontWeight: 800, fontSize: 15 }}>View</div>
        </div>
      ))}
      {v > 0 && (
        <div style={{ position: "absolute", left: 20 * (1 - fs), top: 20 * (1 - fs), right: 20 * (1 - fs), bottom: 20 * (1 - fs), borderRadius: 18 * (1 - fs), background: "#0F172A", opacity: v, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 60 * (1 - fs), background: "#fff", display: "flex", alignItems: "center", padding: "0 24px", gap: 14, overflow: "hidden" }}>
            <b style={{ fontSize: 20, color: INK }}>{DECK}</b><span style={{ fontSize: 15, color: GRAY }}>Last Update: Today</span>
            <span style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 10, background: BLUE, color: "#fff", fontWeight: 800, fontSize: 15 }}>⛶ Full Screen</span>
          </div>
          <div style={{ position: "absolute", left: 60 * (1 - fs), top: 80 * (1 - fs), right: 60 * (1 - fs), bottom: 30 * (1 - fs) }}><Slide f={f} at={-200} title="Knife Cuts Every Cook Needs" chart={1} sc={1.4} /></div>
        </div>
      )}
    </div>
  );
};

const calmK = (k: K4): K4 => [k[0], Math.max(820, Math.min(1100, k[1])), Math.max(460, Math.min(620, k[2])), Math.min(1.12, k[3])];
const CAM: K4[] = mono([
  [DEMO_START, 960, 540, 1.0],
  [T.tour, 980, 440, 1.08],
  [S.d2, 960, 520, 1.03],
  [S.d3, 960, 540, 1.0],
  [S.d4, 620, 520, 1.12],
  [S.d5, 700, 600, 1.08],
  [S.d6, 960, 520, 1.04],
  [S.d7, 640, 480, 1.08],
  [S.d8, 960, 520, 1.04],
  [S.d9, 1400, 300, 1.1],
  [T.back, 960, 520, 1.04],
  [T.clickExport - 10, 1250, 320, 1.08],
  [T.learner, 960, 540, 1.0],
  [T.full + 20, 960, 540, 1.0],
  [PAY_START, 960, 540, 1.0],
]).map(calmK);
const CUR: P3[] = monoP([
  [DEMO_START, 1300, 760],
  [T.clickMenu, ...realMenuPt("Slide", "Content Management")],
  [T.tour, ...MA(620, 300)],
  [T.clickCreate, ...MA(1270, 48)],
  [T.richHl, ...MA(470, 390)],
  [T.clickPres, ...MA(880, 390)],
  [T.tabs, ...tabPt(0)],
  [T.tabs + 40, ...tabPt(5)],
  [T.clickAI, ...tabPt(3)],
  [T.typePrompt, ...ED(250, 220)],
  [T.pages, ...ED(250, 340)],
  [T.style, ...ED(150, 420)],
  [T.clickGen, ...ED(255, 520)],
  [T.editTitle, ...ED(800, 160)],
  [T.clickElements, ...tabPt(2)],
  [T.chartIn, ...ED(170, 230)],
  [T.clickMotion, ...tabPt(4)],
  [T.fade, ...ED(250, 175)],
  [T.clickAssign, ...ED(1320, 31)],
  [T.pickSession, ...ED(680, 480)],
  [T.clickSaveMenu, ...ED(1520, 31)],
  [T.clickPublish, ...ED(1490, 132)],
  [T.clickMore, ...MA(18 + 1290 - 20, 130 + 54 + 34)],
  [T.clickExport, ...MA(1176, 48)],
  [T.learner + 20, 1300, 820],
  [T.clickView, ...CT(32 + 410 - 50, 120 + 340 - 30)],
  [T.full, ...CT(1600 - 24 - 24 - 70, 20 + 30)],
  [T.full + 40, 1500, 900],
]);
const STEPS = [
  { at: T.clickMenu, to: S.d2, label: "The Slides list" },
  { at: S.d2, to: S.d3, label: "Rich-text or Presentation" },
  { at: S.d3, to: S.d4, label: "The visual editor" },
  { at: S.d4, to: S.d6, label: "Create with AI" },
  { at: S.d6, to: S.d8, label: "Charts and motion" },
  { at: S.d8, to: S.d10, label: "Assign and publish" },
  { at: S.d10, to: T.learner, label: "Clone and export" },
  { at: T.learner, to: PAY_START, label: "What the learner sees" },
];

const Demo: React.FC<{ f: number }> = ({ f }) => {
  const s = scene(f);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop f={f} w={1920} h={1080} />
      <CameraWorld f={f} keys={CAM} vc={[960, 540]} size={[1920, 1080]}>
        {s === "learner" ? (
          <LandWin f={f} inAt={T.learner} url="learner.summitculinary.example.com/presentation-slides" sidebar={false} main={<Learner f={f} />} />
        ) : s === "editor" ? (
          <LandWin f={f} inAt={T.appIn} url="academy.skillbnk.com/slides/presentation/knife-skills-101" sidebar={false} main={<Editor f={f} />} />
        ) : (
          <LandWin f={f} inAt={T.appIn} url="academy.skillbnk.com/slides" active={f >= T.clickMenu ? "Slides" : "Dashboard"} openGroup="Content Management" main={<ListPage f={f} after={s === "list2"} />} overlay={<><Toast f={f} at={T.clickMore + 26} text="Slide cloned successfully" d={40} /><Toast f={f} at={T.clickExport + 3} text="Slides exported successfully!" d={50} /></>} />
        )}
        <Scribble f={f} at={T.deckIn + 30} d={18} out={S.d6 - 4} kind="under" x={ED(700, 0)[0]} y={ED(0, 690)[1]} w={760} seed={4} worldW={1920} worldH={1080} />
        <Cursor f={f} pts={CUR} clicks={CLICKS} from={DEMO_START + 10} />
      </CameraWorld>
      <StepChipL f={f} steps={STEPS} />
      <PortalTagL f={f} at={DEMO_START + 14} out={T.learner - 4} text="Training provider portal" />
      <PortalTagL f={f} at={T.learner + 4} out={PAY_START - 6} text="Learner portal" />
    </AbsoluteFill>
  );
};

const HK = { laptop: cue("h0", "laptop"), blurry: cue("h0", "blurry"), week: cue("h0", "week"), ask: cue("h0", "ask") };
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const warm = lin(f, HK.blurry - 6, HK.ask + 20);
  const blur = lin(f, HK.blurry - 4, HK.blurry + 20) * 6;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop f={f} warm={warm} w={1920} h={1080} />
      <HookTag f={f} text="Leo's laptop, Sunday evening" />
      <div style={{ position: "absolute", left: 300, top: 170, width: 920, height: 560, borderRadius: 24, background: "#111827", padding: 20, boxSizing: "border-box", opacity: pr(f, 6, 24), boxShadow: "0 40px 120px #000D" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 10, overflow: "hidden", filter: `blur(${blur}px)` }}><Slide f={f} at={-200} sc={1.0} /></div>
      </div>
      <div style={{ position: "absolute", left: 250, top: 730, width: 1020, height: 40, borderRadius: "0 0 30px 30px", background: "#374151", opacity: pr(f, 6, 24) }} />
      <div style={{ position: "absolute", left: 1300, top: 280, width: 380, padding: 26, borderRadius: 22, background: "#fff", boxShadow: "0 30px 80px #000C", opacity: pr(f, HK.week - 6, 16) }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: INK }}>✉ RE: can I get the slides?</div>
        <div style={{ marginTop: 10, fontSize: 17, fontWeight: 600, color: GRAY }}>📎 KnifeSkills_scan.pdf</div>
        <div style={{ marginTop: 18, fontSize: 36, fontWeight: 900, color: "#DC2626" }}>sent 7 days later</div>
      </div>
    </AbsoluteFill>
  );
};

const PY = { once: cue("p13", "once"), latest: cue("p13", "latest") };
const Payoff: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ fontFamily: FONT, opacity: pr(f, PAY_START, 10) }}>
    <Backdrop f={f} w={1920} h={1080} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.3), transparent 62%)" }} />
    <div style={{ position: "absolute", left: 460, top: 130, width: 1000, height: 562, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px #000C", opacity: pr(f, PY.once - 6, 16) }}><Slide f={f} at={-200} title="Knife Cuts Every Cook Needs" chart={1} sc={1.12} /></div>
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, textAlign: "center", fontSize: 40, fontWeight: 800, color: "#BBF7D0", opacity: pr(f, PY.latest - 6, 14) }}>Morning, evening and weekend classes: same deck, latest version</div>
  </AbsoluteFill>
);

const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(0, "whoosh", 0.2); add(HK.blurry, "riser", 0.2); add(HK.ask, "thud", 0.4);
  add(DURATIONS.h0 - 6, "whoosh", 0.4); add(DEMO_START - 2, "whoosh", 0.3);
  CLICKS.forEach((c) => add(c, "click", 0.5));
  for (let i = 0; i < 16; i++) add(T.typePrompt + i * 2.5, ["key0", "key1", "key2"][i % 3], 0.12);
  add(T.deckIn, "chime", 0.45); add(T.chartIn + 4, "pop", 0.35); add(T.clickPublish + 4, "chime", 0.5);
  add(T.learner, "whoosh", 0.35); add(T.full + 2, "whoosh_s", 0.3);
  add(PAY_START - 3, "whoosh", 0.4); add(PY.latest, "chime", 0.45);
  return a;
})();

export const SlidesStoryVideo: React.FC = () => {
  const f = useCurrentFrame();
  return <StoryMain f={f} tl={TL} segs={SEGS} voiced={VOICED} dur={DURATIONS} folder="slidestory" hook={<Hook f={f} />} demo={<Demo f={f} />} payoff={<Payoff f={f} />} sfx={SFX} flashes={[T.clickPres + 6, T.learner]} />;
};
