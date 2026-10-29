import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { FONT, pr, lin, Finish, Flash } from "./premiumKit";
import { INK, GREEN } from "./storyLand";

/**
 * storyShell — shared timeline + main composer for premium landscape story videos
 * (hook → MainIntro → one continuous demo → payoff → MainOutro), used by serials 30–32.
 */
export type TL = { SEG_START: Record<string, number>; INTRO_START: number; DEMO_START: number; PAY_START: number; SCENES_END: number; TOTAL: number };
export const makeTL = (segs: readonly string[], dur: Record<string, number>): TL => {
  const SEG_START: Record<string, number> = {};
  let t = 0;
  for (const k of segs) {
    SEG_START[k] = t;
    t += dur[k];
    if (k === "h0") t += INTRO_FRAMES;
  }
  const last = segs[segs.length - 1];
  return { SEG_START, INTRO_START: dur.h0, DEMO_START: SEG_START[segs[1]], PAY_START: SEG_START[last], SCENES_END: t, TOTAL: t + OUTRO_FRAMES };
};
export const typed = (f: number, a: number, text: string, cpf = 0.9) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor((f - a) * cpf))));
export type Fx = [number, string, number];

export const Toast: React.FC<{ f: number; at: number; text: string; d?: number }> = ({ f, at, text, d = 70 }) =>
  f >= at && f < at + d ? (
    <div style={{ position: "absolute", right: 36, bottom: 28, padding: "14px 24px", borderRadius: 14, background: "#fff", borderLeft: `6px solid ${GREEN}`, boxShadow: "0 16px 40px #0004", fontSize: 19, fontWeight: 800, color: INK, transform: `translateX(${(1 - pr(f, at, 10)) * 80}px)`, opacity: pr(f, at, 10) * (1 - lin(f, at + d - 12, at + d)), fontFamily: FONT, zIndex: 30 }}>✓&nbsp; {text}</div>
  ) : null;

export const StoryMain: React.FC<{
  f: number; tl: TL; segs: readonly string[]; voiced: string[]; dur: Record<string, number>; folder: string;
  hook: React.ReactNode; demo: React.ReactNode; payoff: React.ReactNode; sfx: Fx[]; flashes?: number[]; music?: boolean; finish?: boolean;
}> = ({ f, tl, segs, voiced, dur, folder, hook, demo, payoff, sfx, flashes = [], music = true, finish = true }) => {
  const { INTRO_START, DEMO_START, PAY_START, SCENES_END } = tl;
  const mv = (lf: number, len: number) => (music ? 0.1 * Math.min(1, lf / 20) * Math.min(1, (len - lf) / 24) : 0);
  return (
    <AbsoluteFill style={{ background: "#040716" }}>
      <Sequence from={0} durationInFrames={dur.h0 + 6}>{hook}</Sequence>
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
      <Sequence from={DEMO_START - 2} durationInFrames={PAY_START - DEMO_START + 14}>{demo}</Sequence>
      <Sequence from={PAY_START} durationInFrames={SCENES_END - PAY_START}>{payoff}</Sequence>
      <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>
      {finish && (f < INTRO_START + 4 || (f >= DEMO_START - 4 && f < SCENES_END + 2)) && <Finish f={f} w={1920} h={1080} />}
      <Flash f={f} at={INTRO_START} w={1920} h={1080} />
      <Flash f={f} at={DEMO_START} color="#0B1A55" streak={false} d={6} w={1920} h={1080} />
      {flashes.map((a, i) => <Flash key={i} f={f} at={a} d={5} streak={false} w={1920} h={1080} />)}
      <Flash f={f} at={PAY_START} w={1920} h={1080} />
      <Flash f={f} at={SCENES_END} d={8} w={1920} h={1080} />
      {segs.filter((k) => voiced.includes(k)).map((k) => (
        <Sequence key={k} from={tl.SEG_START[k] + 2} durationInFrames={dur[k]}><Audio src={staticFile(`${folder}/${k}.mp3`)} /></Sequence>
      ))}
      {sfx.map(([t, n, v], i) => (
        <Sequence key={i} from={t} durationInFrames={80}><Audio src={staticFile(`story/sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {music && (
        <>
          <Sequence from={0} durationInFrames={INTRO_START + 10}><Audio src={staticFile("story/music.wav")} volume={(lf) => mv(lf, INTRO_START + 10)} loop /></Sequence>
          <Sequence from={DEMO_START - 6} durationInFrames={SCENES_END - DEMO_START + 12}><Audio src={staticFile("story/music.wav")} startFrom={300} volume={(lf) => mv(lf, SCENES_END - DEMO_START + 12)} loop /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};

/** generic hook headline + counter card shown over the backdrop */
export const HookTag: React.FC<{ f: number; text: string }> = ({ f, text }) => (
  <div style={{ position: "absolute", left: 0, top: 36, width: 1920, display: "flex", justifyContent: "center", opacity: pr(f, 4, 10), fontFamily: FONT }}>
    <div style={{ padding: "10px 30px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: 5 }}>{text}</div>
  </div>
);

import { CT, LINE, GRAY } from "./storyLand";
/** sidebar item centre (world coords) for LandWin's menu index i */
export const menuPt = (i: number): [number, number] => CT(125, 105 + 56 * i);

export type Col = { h: string; w: number };
/** simple data table in main-area coords; rows = cells; hl = row index highlighted; oRow = per-row opacity */
export const Table: React.FC<{ x: number; y: number; cols: Col[]; rows: React.ReactNode[][]; hl?: number; hlA?: number; rowH?: number; oRow?: (i: number) => number; yOff?: (i: number) => number }> = ({ x, y, cols, rows, hl = -1, hlA = 1, rowH = 66, oRow = () => 1, yOff = () => 0 }) => {
  const W = cols.reduce((a, c) => a + c.w, 0);
  const xs = cols.map((_, i) => cols.slice(0, i).reduce((a, c) => a + c.w, 0));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, height: 54 + rows.length * rowH + 4, borderRadius: 16, background: "#fff", border: `2px solid ${LINE}`, overflow: "hidden", boxShadow: "0 6px 24px #0000000d", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 54, background: "#F3F4F6" }}>
        {cols.map((c, i) => <div key={c.h} style={{ position: "absolute", left: xs[i] + 16, top: 0, height: 54, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 800, color: "#4B5563", whiteSpace: "nowrap" }}>{c.h}</div>)}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{ position: "absolute", left: 0, top: 54 + ri * rowH + yOff(ri), width: W, height: rowH, borderTop: `1px solid ${LINE}`, opacity: oRow(ri), background: ri === hl ? `rgba(29,63,214,${0.07 * hlA})` : "#fff" }}>
          {r.map((cell, ci) => <div key={ci} style={{ position: "absolute", left: xs[ci] + 16, top: 0, width: cols[ci].w - 24, height: rowH, display: "flex", alignItems: "center", fontSize: 17, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden" }}>{cell}</div>)}
        </div>
      ))}
    </div>
  );
};
export const PageHead: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <>
    <div style={{ position: "absolute", left: 32, top: 22, fontSize: 32, fontWeight: 900, color: INK, letterSpacing: -0.5, fontFamily: FONT }}>{title}</div>
    {sub && <div style={{ position: "absolute", left: 32, top: 66, fontSize: 18, fontWeight: 600, color: GRAY, fontFamily: FONT }}>{sub}</div>}
  </>
);
