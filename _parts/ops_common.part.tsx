
// ═══════════════════════════════════════════════════════════════════════════
// Ops series (sheet serials 20–22) — shared table / checkbox atoms (builds on forms_common).
// ═══════════════════════════════════════════════════════════════════════════
type TCol = [string, number];
const TBL_HEAD = 46;
const Tbl: React.FC<{ x: number; y: number; cols: TCol[]; rows: React.ReactNode[][]; rowH?: number; hlRow?: number; hlCol?: number; rowO?: number[] }> = ({ x, y, cols, rows, rowH = 52, hlRow = -1, hlCol = -1, rowO = [] }) => (
  <div style={{ position: "absolute", left: x, top: y, width: cols.reduce((a, c) => a + c[1], 0), background: "#fff", borderRadius: 10, border: `1px solid ${LINE}`, overflow: "hidden" }}>
    <div style={{ display: "flex", height: TBL_HEAD, background: "#F9FAFB", borderBottom: `1px solid ${LINE}`, alignItems: "center" }}>{cols.map(([c, w], i) => <div key={c} style={{ width: w, padding: "0 12px", boxSizing: "border-box", fontSize: 13, fontWeight: 800, color: hlCol === i ? BLUE : "#374151", background: hlCol === i ? BLUE_SOFT : "transparent", height: "100%", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{c}</div>)}</div>
    {rows.map((r, ri) => (
      <div key={ri} style={{ display: "flex", height: rowH, alignItems: "center", borderBottom: "1px solid #F1F2F4", background: hlRow === ri ? "#F5F7FF" : "#fff", opacity: rowO[ri] ?? 1 }}>
        {r.map((cell, ci) => <div key={ci} style={{ width: cols[ci][1], padding: "0 12px", boxSizing: "border-box", fontSize: 13.5, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cell}</div>)}
      </div>
    ))}
  </div>
);
/** centre of a table cell, in CONTENT coords (table drawn inside the company shell main area) */
const tblPt = (x: number, y: number, cols: TCol[], ci: number, ri: number, rowH = 52, dx = 0) => ({ x: MX(x + cols.slice(0, ci).reduce((a, c) => a + c[1], 0) + (dx || cols[ci][1] / 2)), y: MY(y + TBL_HEAD + ri * rowH + rowH / 2) });
const Pill: React.FC<{ t: string; tone?: "green" | "amber" | "red" | "gray" | "blue" }> = ({ t, tone = "gray" }) => {
  const m = { green: ["#DCFCE7", "#15803D"], amber: ["#FEF3C7", "#B45309"], red: ["#FEE2E2", "#B91C1C"], gray: ["#F3F4F6", "#374151"], blue: [BLUE_SOFT, BLUE] }[tone];
  return <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: m[0], color: m[1] }}>{t}</span>;
};
const Chk: React.FC<{ on: boolean }> = ({ on }) => <span style={{ width: 20, height: 20, borderRadius: 5, border: on ? "none" : "2px solid #9CA3AF", background: on ? BLUE : "#fff", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{on ? "✓" : ""}</span>;
const IcoBtn: React.FC<{ t: string; hl?: boolean; c?: string }> = ({ t, hl, c = BLUE }) => <span style={{ width: 32, height: 32, borderRadius: 8, background: c === BLUE ? BLUE_SOFT : c + "1A", color: c, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: hl ? "0 0 0 3px #A5B4FC" : "none" }}>{t}</span>;
const SearchBox: React.FC<{ x: number; y: number; w: number; ph: string; v?: string }> = ({ x, y, w, ph, v }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 40, borderRadius: 8, border: `1px solid ${v ? "#A5B4FC" : "#D1D5DB"}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: v ? INK : "#9CA3AF", boxSizing: "border-box" }}>⌕ {v || ph}</div>;
/** shared bits for bespoke hooks */
const HookLine: React.FC<{ g: number; at: number; top: number; size?: number; children: React.ReactNode; color?: string }> = ({ g, at, top, size = 62, children, color = "#F1F5F9" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontSize: size, fontWeight: 900, color, lineHeight: 1.1, padding: "0 120px", opacity: fi(g, at, 8), transform: `translateY(${(1 - fi(g, at, 8)) * 24}px)` }}>{children}</div>
);
const SbBadge: React.FC<{ g: number; at: number; x: number; y: number }> = ({ g, at, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "#0F766E33", border: "1px solid #5EEAD488", opacity: fi(g, at, 8) }}><Img src={staticFile("skillbnk-logo.png")} style={{ height: 30 }} /><span style={{ fontSize: 22, fontWeight: 800, color: "#5EEAD4" }}>does it differently</span></div>
);
