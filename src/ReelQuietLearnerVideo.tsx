import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { MainIntro, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { MainOutro, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { CameraWorld, Flash, FONT, K4, countUp, lin, makeCues, mono, pr, sp } from "./premiumKit";

/**
 * ReelQuietLearnerVideo — premium 1080x1920 reel for video 29 "Who's Pending, on Trial or Gone?" (value-outcome rule 2026-10-28).
 * Order: problem (hook) → shared MainIntro → solution (4 lists, Last Active) → value → outcome in time + money (EXAMPLE) → scaling → shared MainOutro.
 * Look: soft brand-blue premium background (logo colours #0635D0 / black / gray), CTA bar "Watch the full video on YouTube" in every story scene.
 * Claims verified in code (Master Content Bank topics 33 + 36, DIRECT): member lists Pending / Trial / Approved / Inactive, Last Active column,
 * Email / Message on a member. NOT claimed: alerts, automatic flags. Time/money numbers are an labelled EXAMPLE (Priya, 37 learners = fictional).
 * Voice: python3 generate-voice-story.py src/ReelQuietLearnerVideo.tsx public/quietlearner   (patches DURATIONS, VOICED, WT)
 */

// ───────────────────────── timeline (patched by the voice script) ─────────────────────────
const SEGS = ["h0", "d1", "d2", "d3", "p4", "p5"] as const;
type Seg = (typeof SEGS)[number];
const DURATIONS: Record<Seg, number> = {
  h0: 495,
  d1: 276,
  d2: 157,
  d3: 153,
  p4: 211,
  p5: 272,
};
const VOICED: string[] = ["h0", "d1", "d2", "d3", "p4", "p5"];
// @WT-BEGIN
const WT: Record<string, number[]> = {
  h0: [2, 34, 57, 79, 79, 88, 107, 117, 123, 129, 175, 178, 207, 216, 226, 235, 270, 277, 285, 323, 330, 334, 341, 348, 358, 367, 378, 396, 403, 411, 419, 428, 447, 451, 457, 465],
  d1: [2, 10, 16, 28, 71, 71, 109, 134, 159, 168, 182, 214, 223, 231, 234, 240, 247],
  d2: [2, 10, 16, 29, 42, 52, 72, 76, 84, 88, 123, 130, 137],
  d3: [2, 14, 19, 30, 39, 44, 51, 78, 88, 102, 106, 118],
  p4: [2, 17, 30, 50, 59, 87, 90, 105, 117, 125, 139, 149, 161, 178],
  p5: [14, 25, 40, 51, 62, 73, 84, 93, 98, 107, 117, 153, 154, 160, 168, 178, 186, 210, 218, 219, 225, 228, 229],
};
// @WT-END
const MUSIC = true;

const SCRIPTS: Record<Seg, string> = {
  h0: "Monday, nine a.m. Priya has thirty-seven names in a spreadsheet. Who's waiting? Whose trial ends Friday? Who stopped coming? Sorting it out eats forty minutes a week. And one missed trial can mean a lost learner.",
  d1: "Then she opens skillbank. Four lists: Pending, Trial, Approved, and Inactive. Everyone is in the right place.",
  d2: "And the Last Active column shows who has gone quiet. Marcus? Twenty-one days.",
  d3: "Now she knows who needs a decision, a nudge, or a message.",
  p4: "Forty minutes becomes about five. As an example, that's twenty-nine hours back every year.",
  p5: "Thirty-seven learners or three hundred seventy, it's the same four lists. See the full walkthrough on YouTube. The link is in the post.",
};

const SEG_START = {} as Record<Seg, number>;
let _t = 0;
for (const k of SEGS) {
  SEG_START[k] = _t;
  _t += DURATIONS[k];
  if (k === "h0") _t += INTRO_FRAMES;
}
const INTRO_START = DURATIONS.h0;
const DEMO_START = SEG_START.d1;
const P4_START = SEG_START.p4;
const SCENES_END = _t;
export const TOTAL_FRAMES = SCENES_END + OUTRO_FRAMES;
const cue = makeCues(SCRIPTS, SEG_START, WT);

// ───────────────────────── brand tokens (from the real logo) ─────────────────────────
const BLUE = "#0635D0";
const BLUE2 = "#2A5BFF";
const INK = "#0B1230";
const GRAY = "#6B7280";
const SOFT = "#9AA5C4";
const CARD: React.CSSProperties = { background: "rgba(255,255,255,0.9)", borderRadius: 34, border: "1.5px solid rgba(255,255,255,0.95)", boxShadow: "0 30px 70px rgba(6,53,208,0.16)", position: "absolute", fontFamily: FONT, color: INK };
const rise = (o: number, dy = 30): React.CSSProperties => ({ opacity: o, transform: `translateY(${(1 - o) * dy}px)` });

const LightBG: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "linear-gradient(165deg,#D6E2FF 0%,#E8EEFF 42%,#F4F0FF 100%)" }}>
    <div style={{ position: "absolute", left: -220 + Math.sin(f / 90) * 30, top: -200, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,53,208,0.24),rgba(6,53,208,0) 70%)" }} />
    <div style={{ position: "absolute", right: -300, top: 760 + Math.cos(f / 110) * 40, width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle,rgba(130,150,255,0.34),rgba(130,150,255,0) 70%)" }} />
    <div style={{ position: "absolute", left: -260, bottom: -120, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,53,208,0.16),rgba(6,53,208,0) 70%)" }} />
  </AbsoluteFill>
);
const Logo: React.FC = () => <Img src={staticFile("quietreel/logo.png")} style={{ position: "absolute", left: 60, top: 84, width: 260 }} />;
const CtaBar: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 60, top: 1492, width: 870, height: 84, borderRadius: 42, background: `linear-gradient(90deg,${BLUE},${BLUE2})`, color: "#fff", fontFamily: FONT, fontSize: 30, fontWeight: 800, textAlign: "center", lineHeight: "84px", boxShadow: "0 14px 34px rgba(6,53,208,0.35)", transform: `scale(${1 + 0.012 * Math.sin(f / 18)})` }}>
    ▶ Watch the full video on YouTube · link in the post
  </div>
);
/** headline block (top band, x 60..930, y 190..480). `parts` alternate plain / blue. */
const Head: React.FC<{ f: number; at: number; out: number; children: React.ReactNode; small?: boolean }> = ({ f, at, out, children, small }) => {
  const o = Math.min(pr(f, at, 12), 1 - lin(f, out - 10, out));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", left: 60, top: 190, width: 870, height: 290, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: small ? 70 : 82, lineHeight: 1.03, letterSpacing: -2.5, color: INK, ...rise(o, 24) }}><div>{children}</div></div>;
};
const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: BLUE }}>{children}</span>;
const Pill: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", borderRadius: 999, fontWeight: 800, textAlign: "center", whiteSpace: "nowrap", fontFamily: FONT, ...style }}>{children}</div>
);
const Txt: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", whiteSpace: "nowrap", fontFamily: FONT, ...style }}>{children}</div>
);

// ───────────────────────── HOOK (problem + cost) ─────────────────────────
const NAMES = ["Ayesha R.", "Daniel K.", "Priya S.", "Marcus T.", "Elena V.", "Tom B.", "Noor A.", "Sam L.", "Lena W.", "Omar H.", "Grace P."];
const ST = ["?", "Pending", "Trial", "Approved", "??", "Pending", "Trial", "?", "Approved", "Pending", "?"];
const TE = ["", "", "Fri?", "", "", "", "Mon", "", "", "", "?"];
const HK = {
  names: cue("h0", "thirtyseven", 0), who: cue("h0", "who's", 0), trial: cue("h0", "trial", 0), stopped: cue("h0", "stopped", 0),
  forty: cue("h0", "forty", 0), lost: cue("h0", "lost", 0),
};
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const dim = lin(f, HK.who - 4, HK.who + 14);
  const sheet = (1 - dim * 0.78) * (1 - lin(f, HK.forty - 6, HK.forty + 10));
  return (
    <AbsoluteFill>
      <LightBG f={f} /><Logo />
      <Head f={f} at={0} out={HK.who - 2}>Monday, 9 AM. <B>37 names</B> in a spreadsheet.</Head>
      <Head f={f} at={HK.who - 2} out={HK.forty - 2} small>Who’s waiting? Whose trial ends <B>Friday</B>? Who <B>stopped coming</B>?</Head>
      <Head f={f} at={HK.forty - 2} out={9999}>It costs <B>time</B> and <B>money</B>, every week.</Head>
      <div style={{ position: "absolute", left: 60, top: 510, width: 870, height: 950 }}>
        <div style={{ ...CARD, left: 0, top: 0, width: 870, height: 940, opacity: sheet * pr(f, 4, 16), overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 870, height: 66, background: "rgba(6,53,208,0.06)" }}>
            {["NAME", "STATUS", "TRIAL ENDS"].map((h, i) => <Txt key={h} style={{ left: [34, 330, 600][i], top: 20, fontSize: 24, fontWeight: 800, letterSpacing: 1, color: GRAY }}>{h}</Txt>)}
          </div>
          {NAMES.map((n, i) => (
            <div key={n} style={{ position: "absolute", left: 0, top: 68 + i * 78, width: 870, height: 78, borderBottom: "1.5px solid rgba(6,53,208,0.09)", ...rise(pr(f, 14 + i * 9, 12), 14) }}>
              <Txt style={{ left: 34, top: 18, fontSize: 30, fontWeight: 700 }}>{n}</Txt>
              <Txt style={{ left: 330, top: 18, fontSize: 28, fontWeight: 600, color: GRAY }}>{ST[i]}</Txt>
              <Txt style={{ left: 600, top: 18, fontSize: 28, fontWeight: 600, color: GRAY }}>{TE[i]}</Txt>
            </div>
          ))}
        </div>
        <Pill style={{ right: 0, top: -72, padding: "12px 30px", fontSize: 36, background: BLUE, color: "#fff", boxShadow: "0 12px 26px rgba(6,53,208,0.35)", opacity: pr(f, HK.names - 6, 10) * (1 - lin(f, HK.who, HK.who + 8)) }}>{countUp(f, HK.names - 4, 37, 40)} names</Pill>
        {["Who’s waiting?", "Whose trial ends Friday?", "Who quietly stopped coming?"].map((q, i) => {
          const at = [HK.who, HK.trial, HK.stopped][i];
          const o = pr(f, at, 14) * (1 - lin(f, HK.forty - 8, HK.forty + 4));
          return (
            <div key={q} style={{ ...CARD, left: 30, top: 150 + i * 250, width: 810, height: 138, opacity: o, transform: `translateY(${(1 - o) * 40}px)` }}>
              <div style={{ position: "absolute", left: 28, top: 30, width: 78, height: 78, borderRadius: "50%", background: BLUE, color: "#fff", fontSize: 52, fontWeight: 800, textAlign: "center", lineHeight: "78px", fontFamily: FONT }}>?</div>
              <Txt style={{ left: 130, top: 40, fontSize: 40, fontWeight: 800 }}>{q}</Txt>
            </div>
          );
        })}
        <div style={{ ...CARD, left: 0, top: 0, width: 870, height: 400, ...rise(pr(f, HK.forty, 16), 40), opacity: pr(f, HK.forty, 16) }}>
          <Txt style={{ left: 44, top: 34, fontSize: 30, fontWeight: 800, letterSpacing: 1, color: GRAY }}>TIME</Txt>
          <Txt style={{ left: 44, top: 84, fontSize: 130, fontWeight: 800, letterSpacing: -4, color: BLUE }}>{countUp(f, HK.forty, 40, 30)} min</Txt>
          <Txt style={{ left: 44, top: 240, fontSize: 36, fontWeight: 700 }}>sorting the list, every week</Txt>
          <Txt style={{ left: 44, top: 300, fontSize: 34, fontWeight: 600, color: GRAY }}>about 33 hours a year</Txt>
        </div>
        <div style={{ ...CARD, left: 0, top: 440, width: 870, height: 330, ...rise(pr(f, HK.lost - 6, 16), 40), opacity: pr(f, HK.lost - 6, 16) }}>
          <Txt style={{ left: 44, top: 34, fontSize: 30, fontWeight: 800, letterSpacing: 1, color: GRAY }}>MONEY</Txt>
          <Txt style={{ left: 44, top: 84, fontSize: 104, fontWeight: 800, letterSpacing: -3 }}>1 lost learner</Txt>
          <Txt style={{ left: 44, top: 216, fontSize: 36, fontWeight: 700 }}>when a trial ends unnoticed</Txt>
        </div>
        <Pill style={{ left: 60, top: 830, padding: "14px 32px", fontSize: 30, background: "rgba(6,53,208,0.1)", color: BLUE, opacity: pr(f, HK.lost + 20, 12) }}>Example numbers · not a measured result</Pill>
      </div>
      <CtaBar f={f} />
    </AbsoluteFill>
  );
};

// ───────────────────────── DEMO (solution + value) ─────────────────────────
const D1 = { pend: cue("d1", "Pending"), trial: cue("d1", "Trial"), appr: cue("d1", "Approved"), inact: cue("d1", "Inactive"), all: cue("d1", "right") };
const D2 = { active: cue("d2", "Active"), quiet: cue("d2", "quiet"), marcus: cue("d2", "Marcus"), days: cue("d2", "twentyone") };
const D3 = { dec: cue("d3", "decision"), nudge: cue("d3", "nudge"), msg: cue("d3", "message") };
const LISTS: [string, string, number, string][] = [["Pending Member", "Waiting for a decision", 12, BLUE], ["Trial Member", "Trial in progress", 9, BLUE2], ["Approved Member", "Active learners", 11, INK], ["Inactive Members", "Gone quiet", 5, SOFT]];
const ROWS: [string, string][] = [["Ayesha R.", "Today"], ["Daniel K.", "1d ago"], ["Priya S.", "Today"], ["Marcus T.", "21 days ago"], ["Elena V.", "2d ago"], ["Tom B.", "1d ago"]];

const DemoBody: React.FC<{ f: number }> = ({ f }) => {
  const inD1 = f < SEG_START.d2, inD2 = f >= SEG_START.d2 && f < SEG_START.d3, inD3 = f >= SEG_START.d3;
  // one calm camera move: ease onto the Last Active column during d2 (≤1.12x)
  const keys: K4[] = mono([[0, 540, 960, 1], [D2.active - 10, 540, 960, 1], [D2.active + 20, 495, 900, 1.1], [SEG_START.d3 - 24, 495, 900, 1.1], [SEG_START.d3 - 6, 540, 960, 1]]);
  const cuesAt = [D1.pend, D1.trial, D1.appr, D1.inact];
  return (
    <AbsoluteFill>
      <LightBG f={f} /><Logo />
      <Head f={f} at={SEG_START.d1} out={SEG_START.d2}>One place. <B>Four lists.</B></Head>
      <Head f={f} at={SEG_START.d2} out={SEG_START.d3}><B>Last Active</B> shows who has gone quiet.</Head>
      <Head f={f} at={SEG_START.d3} out={9999} small>Know who needs a <B>decision</B>, a <B>nudge</B>, or a <B>message</B>.</Head>
      <CameraWorld f={f} keys={keys} calm={1}>
        <div style={{ position: "absolute", left: 60, top: 510, width: 870, height: 950 }}>
          {inD1 && LISTS.map((x, i) => {
            const o = pr(f, cuesAt[i] - 4, 14) * (1 - lin(f, SEG_START.d2 - 8, SEG_START.d2));
            return (
              <div key={x[0]} style={{ ...CARD, left: 0, top: i * 228, width: 870, height: 196, opacity: o, transform: `translateY(${(1 - o) * 40}px)` }}>
                <div style={{ position: "absolute", left: 34, top: 46, width: 92, height: 92, borderRadius: "50%", background: x[3] }} />
                <Txt style={{ left: 156, top: 38, fontSize: 44, fontWeight: 800 }}>{x[0]}</Txt>
                <Txt style={{ left: 156, top: 100, fontSize: 30, fontWeight: 600, color: GRAY }}>{x[1]}</Txt>
                <Txt style={{ right: 44, top: 44, fontSize: 84, fontWeight: 800, letterSpacing: -2, color: x[3] === SOFT ? GRAY : x[3] }}>{countUp(f, cuesAt[i], x[2], 22)}</Txt>
              </div>
            );
          })}
          {inD2 && (
            <>
              <div style={{ ...CARD, left: 0, top: 0, width: 870, height: 640, overflow: "hidden", ...rise(pr(f, SEG_START.d2 + 2, 14) * (1 - lin(f, SEG_START.d3 - 8, SEG_START.d3)), 30), opacity: pr(f, SEG_START.d2 + 2, 14) * (1 - lin(f, SEG_START.d3 - 8, SEG_START.d3)) }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 870, height: 66, background: "rgba(6,53,208,0.07)" }}>
                  <Txt style={{ left: 34, top: 20, fontSize: 24, fontWeight: 800, letterSpacing: 1, color: GRAY }}>LEARNER</Txt>
                  <Txt style={{ left: 480, top: 20, fontSize: 24, fontWeight: 800, letterSpacing: 1, color: GRAY }}>LAST ACTIVE</Txt>
                  <div style={{ position: "absolute", left: 450, top: 8, width: 290, height: 50, border: `4px solid ${BLUE}`, borderRadius: 14, opacity: pr(f, D2.active, 10) * (0.7 + 0.3 * Math.sin(f / 5)) }} />
                </div>
                {ROWS.map((r, i) => {
                  const m = i === 3, fade = m ? 1 - 0.55 * lin(f, D2.quiet, D2.quiet + 14) : 1;
                  return (
                    <div key={r[0]} style={{ position: "absolute", left: 0, top: 70 + i * 92, width: 870, height: 92, borderBottom: "1.5px solid rgba(6,53,208,0.09)", background: m && f > D2.marcus ? "rgba(154,165,196,0.16)" : "none", opacity: fade * pr(f, SEG_START.d2 + 6 + i * 6, 12) }}>
                      <div style={{ position: "absolute", left: 34, top: 18, width: 46, height: 46, borderRadius: "50%", background: i % 2 ? INK : BLUE, color: "#fff", fontSize: 22, fontWeight: 800, textAlign: "center", lineHeight: "46px", fontFamily: FONT }}>{r[0][0]}</div>
                      <Txt style={{ left: 104, top: 18, fontSize: 34, fontWeight: 700 }}>{r[0]}</Txt>
                      <div style={{ position: "absolute", left: 480, top: 28, width: 20, height: 20, borderRadius: "50%", background: m && f > D2.quiet ? SOFT : BLUE }} />
                      <Txt style={{ left: 516, top: 18, fontSize: 34, fontWeight: 700, color: m && f > D2.quiet ? GRAY : INK }}>{m ? (f > D2.quiet ? "21 days ago" : "Today") : r[1]}</Txt>
                    </div>
                  );
                })}
              </div>
              <Pill style={{ left: 50, top: 700, padding: "16px 36px", fontSize: 36, background: INK, color: "#fff", opacity: pr(f, D2.days - 4, 12) * (1 - lin(f, SEG_START.d3 - 8, SEG_START.d3)) }}>Marcus · 21 days ago</Pill>
            </>
          )}
          {inD3 && [["PENDING", "Noor A.", "Decide", D3.dec], ["TRIAL ENDS FRIDAY", "Sam L.", "Nudge", D3.nudge], ["QUIET 21 DAYS", "Marcus T.", "Message", D3.msg]].map((a, i) => {
            const at = a[3] as number, o = pr(f, at - 22, 14);
            return (
              <div key={a[0] as string} style={{ ...CARD, left: 0, top: i * 260, width: 870, height: 210, ...rise(o, 40) }}>
                <Txt style={{ left: 40, top: 34, fontSize: 28, fontWeight: 800, letterSpacing: 1, color: GRAY }}>{a[0] as string}</Txt>
                <Txt style={{ left: 40, top: 78, fontSize: 50, fontWeight: 800 }}>{a[1] as string}</Txt>
                <Pill style={{ right: 36, top: 48, padding: "20px 44px", fontSize: 42, background: BLUE, color: "#fff", boxShadow: "0 12px 26px rgba(6,53,208,0.35)", opacity: pr(f, at - 4, 10), transform: `scale(${0.7 + 0.3 * sp(f, at - 4, 30)})` }}>{a[2] as string}</Pill>
              </div>
            );
          })}
        </div>
      </CameraWorld>
      <CtaBar f={f} />
    </AbsoluteFill>
  );
};

// ───────────────────────── PAYOFF (outcome + scaling) ─────────────────────────
const P4 = { five: cue("p4", "five"), hours: cue("p4", "twentynine"), ex: cue("p4", "example") };
const P5 = { big: cue("p5", "thirtyseven"), three: cue("p5", "hundred"), same: cue("p5", "same"), yt: cue("p5", "YouTube") };
const Payoff: React.FC<{ f: number }> = ({ f }) => {
  const inP5 = f >= SEG_START.p5;
  return (
    <AbsoluteFill>
      <LightBG f={f} /><Logo />
      <Head f={f} at={SEG_START.p4} out={SEG_START.p5}><B>40 minutes</B> becomes about <B>5</B>.</Head>
      <Head f={f} at={SEG_START.p5} out={9999}>37 learners or 370. <B>Same four lists.</B></Head>
      <div style={{ position: "absolute", left: 60, top: 510 + (inP5 ? 90 : 0), width: 870, height: 950 }}>
        {!inP5 && (
          <>
            <div style={{ ...CARD, left: 0, top: 0, width: 870, height: 760, ...rise(pr(f, SEG_START.p4 + 6, 16) * (1 - lin(f, SEG_START.p5 - 8, SEG_START.p5)), 40), opacity: pr(f, SEG_START.p4 + 6, 16) * (1 - lin(f, SEG_START.p5 - 8, SEG_START.p5)) }}>
              <Txt style={{ left: 44, top: 36, fontSize: 30, fontWeight: 800, letterSpacing: 1, color: GRAY }}>EVERY WEEK</Txt>
              <Txt style={{ left: 44, top: 110, fontSize: 34, fontWeight: 700 }}>Before</Txt>
              <div style={{ position: "absolute", left: 44, top: 160, width: 780, height: 72, borderRadius: 36, background: "rgba(11,18,48,0.08)" }} />
              <div style={{ position: "absolute", left: 44, top: 160, width: 780 * pr(f, SEG_START.p4 + 14, 22), height: 72, borderRadius: 36, background: INK }} />
              <Txt style={{ left: 62, top: 176, fontSize: 34, fontWeight: 800, color: "#fff" }}>40 min</Txt>
              <Txt style={{ left: 44, top: 290, fontSize: 34, fontWeight: 700 }}>With skillBNK</Txt>
              <div style={{ position: "absolute", left: 44, top: 340, width: 780, height: 72, borderRadius: 36, background: "rgba(6,53,208,0.1)" }} />
              <div style={{ position: "absolute", left: 44, top: 340, width: 100 * pr(f, P4.five - 4, 14), height: 72, borderRadius: 36, background: BLUE }} />
              <Txt style={{ left: 162, top: 356, fontSize: 34, fontWeight: 800, color: BLUE, opacity: pr(f, P4.five, 10) }}>about 5 min</Txt>
              <Txt style={{ left: 44, top: 480, fontSize: 130, fontWeight: 800, letterSpacing: -4, color: BLUE, opacity: pr(f, P4.hours - 8, 12) }}>≈ {countUp(f, P4.hours, 29, 30)} hours</Txt>
              <Txt style={{ left: 44, top: 640, fontSize: 42, fontWeight: 700, opacity: pr(f, P4.hours, 12) }}>back every year</Txt>
            </div>
            <Pill style={{ left: 60, top: 820, padding: "14px 32px", fontSize: 30, background: "rgba(6,53,208,0.1)", color: BLUE, opacity: pr(f, P4.ex, 12) }}>Example calculation · not a measured result</Pill>
          </>
        )}
        {inP5 && (
          <>
            <div style={{ ...CARD, left: 0, top: 0, width: 870, height: 470, ...rise(pr(f, SEG_START.p5 + 4, 16), 30), opacity: pr(f, SEG_START.p5 + 4, 16) }}>
              <Txt style={{ left: 0, top: 70, width: 870, textAlign: "center", fontSize: 30, fontWeight: 800, letterSpacing: 1, color: GRAY }}>LEARNERS</Txt>
              <Txt style={{ left: 0, top: 130, width: 870, textAlign: "center", fontSize: 240, fontWeight: 800, letterSpacing: -8, color: BLUE }}>{Math.round(37 + 333 * lin(f, P5.three - 24, P5.three + 18))}</Txt>
            </div>
            <div style={{ position: "absolute", left: 0, top: 560, width: 870, display: "flex", justifyContent: "space-between" }}>
              {["Pending", "Trial", "Approved", "Inactive"].map((t, i) => (
                <div key={t} style={{ padding: "22px 30px", borderRadius: 999, fontFamily: FONT, fontSize: 34, fontWeight: 800, background: [BLUE, BLUE2, INK, SOFT][i], color: "#fff", ...rise(pr(f, SEG_START.p5 + 20 + i * 5, 12), 20) }}>{t}</div>
              ))}
            </div>
            <Txt style={{ left: 0, top: 700, width: 870, textAlign: "center", fontSize: 54, fontWeight: 800, ...rise(pr(f, P5.same, 14), 20) }}>Same four lists.</Txt>
          </>
        )}
      </div>
      <CtaBar f={f} />
    </AbsoluteFill>
  );
};

// ───────────────────────── sound (no thud — user rule) ─────────────────────────
type Fx = [number, string, number];
const SFX: Fx[] = (() => {
  const a: Fx[] = [];
  const add = (t: number, n: string, v = 0.5) => a.push([Math.max(0, Math.round(t)), n, v]);
  add(2, "whoosh", 0.25); add(HK.names, "pop", 0.35); add(HK.who, "pop", 0.35); add(HK.trial, "pop", 0.35); add(HK.stopped, "pop", 0.35);
  add(HK.forty, "swish", 0.4); add(HK.lost, "pop", 0.45); add(DURATIONS.h0 - 6, "whoosh", 0.5);
  add(DEMO_START - 2, "whoosh", 0.4);
  [D1.pend, D1.trial, D1.appr, D1.inact].forEach((t) => add(t, "pop", 0.4));
  add(SEG_START.d2, "swish", 0.4); add(D2.active, "ding", 0.45); add(D2.days, "pop", 0.4);
  add(SEG_START.d3, "swish", 0.4); [D3.dec, D3.nudge, D3.msg].forEach((t) => add(t, "pop", 0.4));
  add(SEG_START.p4, "whoosh", 0.4); add(P4.five, "pop", 0.4); add(P4.hours, "chime", 0.7);
  add(SEG_START.p5, "swish", 0.4); add(P5.three, "ding", 0.45); add(P5.same, "pop", 0.4);
  add(SCENES_END - 6, "whoosh", 0.5);
  return a;
})();

export const ReelQuietLearnerVideo: React.FC = () => {
  const f = useCurrentFrame();
  const musicVol = (lf: number, len: number) => (MUSIC ? 0.1 * Math.min(1, lf / 20) * Math.min(1, (len - lf) / 24) : 0);
  return (
    <AbsoluteFill style={{ background: "#E8EEFF" }}>
      <Sequence from={0} durationInFrames={DURATIONS.h0 + 6}><Hook f={f} /></Sequence>
      <Sequence from={INTRO_START} durationInFrames={INTRO_FRAMES}><MainIntro /></Sequence>
      <Sequence from={DEMO_START - 2} durationInFrames={P4_START - DEMO_START + 14}><DemoBody f={f} /></Sequence>
      <Sequence from={P4_START} durationInFrames={SCENES_END - P4_START}><Payoff f={f} /></Sequence>
      <Sequence from={SCENES_END} durationInFrames={OUTRO_FRAMES}><MainOutro /></Sequence>
      <Flash f={f} at={INTRO_START} />
      <Flash f={f} at={DEMO_START} color="#0B1A55" streak={false} d={6} />
      <Flash f={f} at={P4_START} />
      <Flash f={f} at={SCENES_END} d={8} />
      {SEGS.filter((k) => VOICED.includes(k)).map((k) => (
        <Sequence key={k} from={SEG_START[k] + 2} durationInFrames={DURATIONS[k]}><Audio src={staticFile(`quietlearner/${k}.mp3`)} /></Sequence>
      ))}
      {SFX.map(([t, n, v], i) => (
        <Sequence key={i} from={t} durationInFrames={80}><Audio src={staticFile(`story/sfx/${n}.wav`)} volume={v} /></Sequence>
      ))}
      {MUSIC && (
        <>
          <Sequence from={0} durationInFrames={INTRO_START + 10}><Audio src={staticFile("story/music.wav")} volume={(lf) => musicVol(lf, INTRO_START + 10)} loop /></Sequence>
          <Sequence from={DEMO_START - 6} durationInFrames={SCENES_END - DEMO_START + 12}><Audio src={staticFile("story/music.wav")} startFrom={300} volume={(lf) => musicVol(lf, SCENES_END - DEMO_START + 12)} loop /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
