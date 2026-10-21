// Shared runtime timeline builder: lays voice clips end-to-end with a small gap,
// giving the MAIN INTRO slot exactly INTRO_FRAMES (its audio lives inside
// <MainIntro />, so that clip is not played by the voice track).
export type Clip = { file: string; from: number; dur: number };

export const buildTimeline = (
  clips: Clip[],
  introIndex: number,
  introFrames: number,
  gap = 6,
  tail = 30,
) => {
  const starts: number[] = [];
  let pos = 0;
  clips.forEach((c, i) => {
    starts.push(pos);
    pos += i === introIndex ? introFrames : c.dur + gap;
  });
  const last = clips.length - 1;
  const total = starts[last] + (last === introIndex ? introFrames : clips[last].dur) + tail;
  const durs = starts.map((s, i) => (i < last ? starts[i + 1] - s : total - s));
  return { starts, durs, total };
};
