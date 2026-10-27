import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, cl, lin, pr, sp } from "./premiumKit";

/**
 * storyLand — shared landscape (1920x1080) pieces for premium story videos:
 * LandWin (browser window + sidebar + overlay slot), StepChipL (bottom centre), PortalTagL (bottom right),
 * and small UI atoms. World coordinates == screen coordinates at zoom 1.
 */
export const BLUE = "#1D3FD6";
export const INK = "#111827";
export const GRAY = "#6B7280";
export const LINE = "#E5E7EB";
export const GREEN = "#16A34A";
export const WX = 160, WY = 96, WW = 1600, WH = 888, BAR = 52, SBW = 250;
/** content coords (inside window, under the title bar) → world */
export const CT = (x: number, y: number): [number, number] => [WX + x, WY + BAR + y];
/** main-area coords (right of the sidebar) → world */
export const HDR = 60;
export const MA = (x: number, y: number): [number, number] => CT(SBW + x, HDR + y);

/** real skillBNK branch sidebar (order from the live Branch portal) */
type RItem = { t: string; i: string; kids?: string[] };
export const REAL_MENU: RItem[] = [
  { t: "Dashboard", i: "▦" }, { t: "Leaderboard", i: "🏆" },
  { t: "Students Management", i: "👥", kids: ["Pending Member", "Trial Member", "Approved Member", "Inactive Members", "Mock Interviews Questions", "Mock Interviews Answer"] },
  { t: "Courses & Programs", i: "🎓", kids: ["Programs", "Courses", "Groups", "Assignments"] },
  { t: "Content Management", i: "🗂", kids: ["Template", "Slide", "Documents and Labs", "Audio/Video Sending", "Architecture Diagram", "Transcription"] },
  { t: "Communication", i: "💬", kids: ["My Chats", "All Bots", "Community"] }, { t: "Attendance", i: "🗓", kids: ["Calendar", "My Attendances", "Attendance Report"] },
  { t: "Marketing Tools", i: "📣", kids: ["Email Marketing", "SMS Marketing", "URL shortner"] },
  { t: "Billing & Certificate", i: "💳", kids: ["Generate Certificate", "All Certificates", "Invoices"] }, { t: "Staff Management", i: "🧑‍💼" }, { t: "B2B Client", i: "🏢" },
  { t: "Menu Builder", i: "☰" }, { t: "Integrations", i: "🔌" }, { t: "Institute Settings", i: "⚙" },
];
/** learner portal sidebar (SB-Learner AppSidebar order) */
export const LEARNER_MENU: RItem[] = [
  { t: "Dashboard", i: "▦" },
  { t: "My Courses", i: "🎓", kids: ["Program", "Assignments", "My Enrollments"] },
  { t: "Documents", i: "📄", kids: ["My Documents", "Documents and Labs", "Presentations", "Templates"] },
  { t: "Calendar", i: "🗓", kids: ["Events", "To-Do", "Availability"] },
  { t: "Interviews", i: "🎤", kids: ["Mock Interviews"] },
  { t: "Chat", i: "💬" }, { t: "Community", i: "👥" }, { t: "My Notes", i: "📝" },
];
/** company (organization) portal sidebar — order from the live Company portal (IntegrationsVideo F_MENU) */
export const COMPANY_MENU: RItem[] = [
  { t: "Dashboard", i: "▦" }, { t: "Branch Management", i: "🏢" }, { t: "Courses & Programs", i: "🎓" }, { t: "Attendance", i: "🗓" },
  { t: "Staff Management", i: "🧑‍💼" }, { t: "Marketing", i: "📣" }, { t: "Form Builder", i: "📝" }, { t: "Menu Builder", i: "☰" },
  { t: "Website Builder", i: "🌐" }, { t: "Enrollment form Builder", i: "🧾" }, { t: "Integrations", i: "🔌" },
];
const ALIAS: Record<string, string> = { Templates: "Template", Slides: "Slide" };
const norm = (a: string) => ALIAS[a] ?? a;
/** group that stays open: the one holding `active`, else the one holding `open` */
const groupOf = (a: string, M: RItem[] = REAL_MENU) => M.find((m) => m.kids?.includes(norm(a)))?.t;
const ROW = 37, KID = 32, MTOP = 122;
const layoutMenu = (open?: string, M: RItem[] = REAL_MENU) => {
  const out: { t: string; i?: string; kid: boolean; y: number; parent?: string; isOpen?: boolean; has?: boolean }[] = [];
  let y = MTOP;
  for (const m of M) {
    const isOpen = m.t === open;
    out.push({ t: m.t, i: m.i, kid: false, y, isOpen, has: !!m.kids }); y += ROW;
    if (isOpen) for (const k of m.kids!) { out.push({ t: k, kid: true, y, parent: m.t }); y += KID; }
  }
  return out;
};
/** world point of a real sidebar item (child names use the real labels, aliases ok) */
export const realMenuPt = (name: string, open?: string, learner = false, company = false): [number, number] => {
  const M = company ? COMPANY_MENU : learner ? LEARNER_MENU : REAL_MENU;
  const it = layoutMenu(open ?? groupOf(name, M), M).find((r) => r.t === norm(name));
  const y = it ? it.y + (it.kid ? KID : ROW) / 2 : MTOP;
  return CT(it?.kid ? 140 : 125, y);
};

export const Avatar: React.FC<{ t: string; s?: number; c1?: string; c2?: string }> = ({ t, s = 52, c1 = "#2E64F0", c2 = "#1D4ED8" }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg,${c1},${c2})`, color: "#fff", fontWeight: 800, fontSize: s * 0.38, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t}</div>
);
export const Badge: React.FC<{ t: string; c: string; bg: string; fs?: number; dot?: boolean }> = ({ t, c, bg, fs = 17, dot }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: fs, fontWeight: 800, color: c, background: bg, padding: `${fs * 0.28}px ${fs * 0.7}px`, borderRadius: 999, whiteSpace: "nowrap" }}>
    {dot && <span style={{ width: fs * 0.4, height: fs * 0.4, borderRadius: "50%", background: c }} />}{t}
  </span>
);
export const Btn: React.FC<{ x: number; y: number; w: number; h?: number; label: string; primary?: boolean; press?: number; fs?: number; glow?: number }> = ({ x, y, w, h = 48, label, primary, press = 0, fs = 18, glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: fs, fontWeight: 800, background: primary ? BLUE : "#fff", color: primary ? "#fff" : INK, border: primary ? "none" : `2px solid ${LINE}`, transform: `scale(${1 - press * 0.07})`, boxShadow: `${primary ? "0 6px 16px #1D3FD640" : "0 2px 6px #0001"}${glow > 0 ? `, 0 0 0 ${10 * glow}px #1D3FD633` : ""}` }}>{label}</div>
);
export const IconBox: React.FC<{ x: number; y: number; s?: number; children: React.ReactNode; on?: boolean }> = ({ x, y, s = 48, children, on }) => (
  <div style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: 12, boxSizing: "border-box", border: `2px solid ${on ? BLUE : LINE}`, background: on ? "#EEF2FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, color: GRAY }}>{children}</div>
);

const MENU = ["Dashboard", "Courses & Programs", "Enrollment", "Fees & Payments", "Community", "Settings"];
const MENU_ICON = ["▦", "🎓", "👥", "💳", "💬", "⚙"];

/** browser window with title bar, optional sidebar, main slot and a full-content overlay slot */
export const LandWin: React.FC<{
  f: number; inAt: number; url: string; active?: string; sidebar?: boolean; subtitle?: string;
  main?: React.ReactNode; overlay?: React.ReactNode; menu?: string[]; menuIcons?: string[]; openGroup?: string; laptop?: boolean; learner?: boolean; who?: string; prog?: string; branch?: string; company?: string;
}> = ({ f, inAt, url, active = "Dashboard", sidebar = true, main, overlay, openGroup, laptop = true, learner = false, who, prog, branch, company }) => {
  const s = sp(f, inAt, 30, { damping: 18, stiffness: 120 });
  const o = Math.min(1, s * 1.6);
  const lift = (1 - Math.min(1, s)) * 90, sc = 0.93 + 0.07 * Math.min(1, s);
  return (
    <>
    {laptop && <Laptop o={o} lift={lift} sc={sc} />}
    <div style={{ position: "absolute", left: WX, top: WY + (1 - Math.min(1, s)) * 90, width: WW, height: WH, opacity: o, transform: `scale(${0.93 + 0.07 * Math.min(1, s)})`, transformOrigin: "50% 50%", borderRadius: 18, background: "#fff", boxShadow: "0 40px 120px #000C, 0 0 0 2px #ffffff22", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ height: BAR, background: "#EEF0F4", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
        {["#F87171", "#FBBF24", "#34D399"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
        <div style={{ marginLeft: 24, flex: 1, maxWidth: 760, height: 32, borderRadius: 16, background: "#fff", border: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 17, fontWeight: 600, color: GRAY, whiteSpace: "nowrap", overflow: "hidden" }}>🔒&nbsp;{url}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: BAR, width: WW, height: WH - BAR, background: "#F8FAFC" }}>
        {sidebar && <RealSidebar active={active} open={openGroup} M={company ? COMPANY_MENU : learner ? LEARNER_MENU : REAL_MENU} />}
        {sidebar && <RealHeader learner={learner} who={who} prog={prog} branch={branch} company={company} />}
        <div style={{ position: "absolute", left: sidebar ? SBW : 0, top: sidebar ? HDR : 0, width: WW - (sidebar ? SBW : 0), height: sidebar ? `calc(100% - ${HDR}px)` : "100%", overflow: "hidden" }}>{main}</div>
        {overlay}
      </div>
    </div>
    </>
  );
};

const RealSidebar: React.FC<{ active: string; open?: string; M: RItem[] }> = ({ active, open, M }) => {
  const a = norm(active);
  const rows = layoutMenu(open ?? groupOf(a, M), M);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SBW, height: "100%", background: "#fff", borderRight: `1px solid ${LINE}`, boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 18, top: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: BLUE, color: "#fff", fontWeight: 900, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }}>S</div>
        <div style={{ fontSize: 21, fontWeight: 900, color: INK, letterSpacing: -0.5 }}>skillBNK</div>
      </div>
      <div style={{ position: "absolute", left: 14, top: 66, width: SBW - 28, height: 40, borderRadius: 10, border: `1px solid ${LINE}`, background: "#F9FAFB", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", boxSizing: "border-box", fontSize: 15, color: "#9CA3AF" }}>⌕&nbsp;Search menu</div>
      {rows.map((r) => {
        const on = r.t === a, parentOn = !r.kid && r.isOpen;
        return (
          <div key={r.t} style={{ position: "absolute", left: r.kid ? 30 : 10, top: r.y + 2, width: SBW - (r.kid ? 42 : 20), height: (r.kid ? KID : ROW) - 4, borderRadius: 8, display: "flex", alignItems: "center", gap: 10, padding: r.kid ? "0 12px" : "0 10px", boxSizing: "border-box", fontSize: r.kid ? 14.5 : 15.5, fontWeight: on ? 800 : parentOn ? 750 : 600, color: on ? "#fff" : parentOn ? BLUE : "#374151", background: on ? BLUE : "transparent", whiteSpace: "nowrap", borderLeft: r.kid && !on ? `2px solid ${LINE}` : undefined }}>
            {!r.kid && <span style={{ width: 20, textAlign: "center", fontSize: 15 }}>{r.i}</span>}
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</span>
            {r.has && <span style={{ fontSize: 13, color: GRAY }}>{r.isOpen ? "⌄" : "›"}</span>}
          </div>
        );
      })}
    </div>
  );
};

const RealHeader: React.FC<{ learner?: boolean; who?: string; prog?: string; branch?: string; company?: string }> = ({ learner, who, prog, branch, company }) => company ? (
  <div style={{ position: "absolute", left: SBW, top: 0, width: WW - SBW, height: HDR, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 14, boxSizing: "border-box" }}>
    <div style={{ fontSize: 20, color: GRAY }}>☰</div>
    <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>{company}</div>
    <div style={{ flex: 1 }} />
    <div style={{ position: "relative", fontSize: 19, color: GRAY }}>🔔<span style={{ position: "absolute", right: -3, top: -2, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} /></div>
    <Avatar t="OA" s={36} c1="#7C3AED" c2="#5B21B6" />
  </div>
) : learner ? (
  <div style={{ position: "absolute", left: SBW, top: 0, width: WW - SBW, height: HDR, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 14, boxSizing: "border-box" }}>
    <div style={{ fontSize: 20, color: GRAY }}>☰</div>
    <div style={{ height: 38, borderRadius: 9, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 15, fontWeight: 700, color: INK }}><span style={{ color: GRAY, fontWeight: 600 }}>Program:</span>{prog ?? "My program"} <span style={{ color: GRAY }}>⌄</span></div>
    <div style={{ flex: 1 }} />
    <div style={{ position: "relative", fontSize: 19, color: GRAY }}>🔔<span style={{ position: "absolute", right: -3, top: -2, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} /></div>
    <Avatar t={(who ?? "LR").slice(0, 2).toUpperCase()} s={36} c1="#16A34A" c2="#15803D" />
  </div>
) : (
  <div style={{ position: "absolute", left: SBW, top: 0, width: WW - SBW, height: HDR, background: "#fff", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 14, boxSizing: "border-box" }}>
    <div style={{ fontSize: 20, color: GRAY }}>☰</div>
    <div style={{ height: 38, borderRadius: 9, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", fontSize: 15, fontWeight: 700, color: INK }}><span style={{ color: GRAY, fontWeight: 600 }}>Branch:</span>{branch ?? "Main Campus"} <span style={{ color: GRAY }}>⌄</span></div>
    <div style={{ flex: 1 }} />
    <div style={{ height: 38, borderRadius: 9, background: BLUE, color: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 15, fontWeight: 800 }}>View Attendance</div>
    <div style={{ height: 38, borderRadius: 9, background: "#EEF2FF", color: BLUE, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 15, fontWeight: 800 }}>Branch Manual</div>
    <div style={{ fontSize: 19, color: GRAY, marginLeft: 6 }}>💬</div>
    <div style={{ position: "relative", fontSize: 19, color: GRAY }}>🔔<span style={{ position: "absolute", right: -3, top: -2, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} /></div>
    <Avatar t="SA" s={36} />
  </div>
);

/** laptop body behind the app window: bezel, camera, hinge and a perspective base */
const Laptop: React.FC<{ o: number; lift: number; sc: number }> = ({ o, lift, sc }) => {
  const B = 22;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o, transform: `translateY(${lift}px) scale(${sc})`, transformOrigin: "50% 50%", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: WX - B, top: WY - B - 6, width: WW + 2 * B, height: WH + 2 * B + 10, borderRadius: 30, background: "linear-gradient(180deg,#2B2F36,#16181C)", boxShadow: "0 50px 120px #000D, inset 0 0 0 2px #4B5058, inset 0 2px 0 #6B7079" }}>
        <div style={{ position: "absolute", left: "50%", top: 9, width: 9, height: 9, marginLeft: -4.5, borderRadius: "50%", background: "#0B0C0E", boxShadow: "inset 0 0 0 2px #30343A" }} />
      </div>
      <div style={{ position: "absolute", left: WX - 150, top: WY + WH + B + 4, width: WW + 300, height: 34, clipPath: "polygon(5% 0, 95% 0, 100% 72%, 98.5% 100%, 1.5% 100%, 0 72%)", background: "linear-gradient(180deg,#D7DAE0 0%,#AEB3BB 55%,#7E838B 100%)" }} />
      <div style={{ position: "absolute", left: 960 - 160, top: WY + WH + B + 4, width: 320, height: 10, borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg,#8B9099,#B9BDC4)" }} />
      <div style={{ position: "absolute", left: WX - 120, top: WY + WH + B + 40, width: WW + 240, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse at center,#000A,#0000 70%)", filter: "blur(6px)" }} />
    </div>
  );
};

/** single step caption, bottom centre, outside the product UI */
export const StepChipL: React.FC<{ f: number; steps: { at: number; to: number; label: string }[] }> = ({ f, steps }) => (
  <div style={{ position: "absolute", left: 0, top: 1006, width: 1920, height: 60, display: "flex", justifyContent: "center", fontFamily: FONT, pointerEvents: "none" }}>
    {steps.map((s, i) => {
      if (f < s.at - 2 || f > s.to + 12) return null;
      const inn = pr(f, s.at, 12), out = lin(f, s.to - 4, s.to + 8);
      return (
        <div key={i} style={{ position: "absolute", display: "flex", alignItems: "center", gap: 16, padding: "7px 28px 7px 8px", borderRadius: 999, background: "rgba(4,7,22,0.82)", border: "2px solid rgba(96,165,250,0.55)", boxShadow: "0 10px 40px #0009, 0 0 40px #3B82F633", opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 20 - out * 14}px)` }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", color: "#fff", fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 3 }}>{s.label}</div>
          <div style={{ display: "flex", gap: 6 }}>{steps.map((_, d) => <div key={d} style={{ width: d === i ? 24 : 9, height: 9, borderRadius: 5, background: d <= i ? "#60A5FA" : "rgba(255,255,255,0.22)" }} />)}</div>
        </div>
      );
    })}
  </div>
);

/** small portal tag, bottom-right corner, outside the camera */
export const PortalTagL: React.FC<{ f: number; at: number; out: number; text: string }> = ({ f, at, out, text }) => {
  const o = pr(f, at, 10) * (1 - lin(f, out, out + 10));
  if (o <= 0) return null;
  return <div style={{ position: "absolute", right: 28, top: 1022, opacity: o, fontFamily: FONT, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: "#BFD3FF", padding: "6px 16px", borderRadius: 999, background: "rgba(4,7,22,0.7)", border: "1.5px solid rgba(147,197,253,0.4)" }}>{text.toUpperCase()}</div>;
};

export const DimFill: React.FC<{ o: number }> = ({ o }) => <AbsoluteFill style={{ background: `rgba(17,24,39,${0.5 * o})`, pointerEvents: "none" }} />;
export { cl };
