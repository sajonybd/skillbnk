import React from "react";
import { pr, K4, P3 } from "./premiumKit";
import { LandWin, WX, WY } from "./storyLand";

/** screenKit — full-bleed "real screen recording" look for the new story videos: the app fills the whole 1920x1080 frame
 *  (no laptop, no backdrop, no grain), camera moves stay inside the app so no edge is ever revealed. */
export const FS = 1.2;
export const scr = (p: [number, number]): [number, number] => [(p[0] - WX) * FS, (p[1] - WY) * FS];
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** window-world camera key -> screen key, zoom <= 1.2, clamped so the view never leaves the screen */
export const fitKey = (k: K4): K4 => {
  const [x, y] = scr([k[1], k[2]]);
  const z = 1 + (Math.min(1.2, k[3]) - 1) * 0.55;
  return [k[0], cl(x, 960 / z, 1920 - 960 / z), cl(y, 540 / z, 1080 - 540 / z), z];
};
export const fitPts = (pts: P3[]): P3[] => pts.map(([t, x, y]) => { const [a, b] = scr([x, y]); return [t, a, b] as P3; });
type LW = React.ComponentProps<typeof LandWin>;
export const LandFull: React.FC<Omit<LW, "laptop" | "inAt"> & { at: number }> = ({ at, f, ...rest }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg,#EEF0F4 0,#EEF0F4 62px,#F8FAFC 62px)", opacity: pr(f, at, 10) }}>
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${-WX * FS}px, ${-WY * FS}px) scale(${FS})`, transformOrigin: "0 0" }}>
      <LandWin f={f} inAt={-1000} laptop={false} {...(rest as any)} />
    </div>
  </div>
);
