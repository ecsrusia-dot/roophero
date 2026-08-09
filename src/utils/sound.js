// Web Audio 기반 8비트 레트로 효과음. 오디오 파일 없이 오실레이터로 합성한다.
let ctx = null;
let muted = false;

export function setMuted(m) {
  muted = m;
}

function beep({ freq = 440, dur = 0.08, type = "square", vol = 0.12, slide = 0, delay = 0 }) {
  if (muted) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* 오디오 미지원 환경은 조용히 무시 */
  }
}

export const sfx = {
  click: () => beep({ freq: 500, dur: 0.04, vol: 0.07 }),
  hit: () => beep({ freq: 220, slide: -120, dur: 0.07 }),
  crit: () => {
    beep({ freq: 330, dur: 0.06 });
    beep({ freq: 660, dur: 0.1, delay: 0.05 });
  },
  heal: () => beep({ freq: 520, slide: 200, dur: 0.12, type: "triangle" }),
  hurt: () => beep({ freq: 140, slide: -60, dur: 0.12, type: "sawtooth", vol: 0.1 }),
  smash: () => beep({ freq: 100, slide: -60, dur: 0.28, type: "sawtooth", vol: 0.18 }),
  kill: () => beep({ freq: 180, slide: -130, dur: 0.16 }),
  drop: () => {
    beep({ freq: 660, dur: 0.05 });
    beep({ freq: 880, dur: 0.09, delay: 0.06 });
  },
  dodge: () => beep({ freq: 700, slide: 300, dur: 0.07, type: "triangle", vol: 0.09 }),
  gacha: () => {
    beep({ freq: 392, dur: 0.07 });
    beep({ freq: 523, dur: 0.07, delay: 0.08 });
    beep({ freq: 659, dur: 0.12, delay: 0.16 });
  },
  legendary: () =>
    [523, 659, 784, 1046].forEach((f, i) =>
      beep({ freq: f, dur: 0.13, delay: i * 0.09, type: "triangle", vol: 0.16 })
    ),
  death: () =>
    [300, 250, 200, 150].forEach((f, i) =>
      beep({ freq: f, dur: 0.16, delay: i * 0.12, type: "sawtooth", vol: 0.13 })
    ),
  reward: () => [523, 659, 784].forEach((f, i) => beep({ freq: f, dur: 0.1, delay: i * 0.08 })),
  achievement: () =>
    [659, 784, 1046, 1318].forEach((f, i) =>
      beep({ freq: f, dur: 0.11, delay: i * 0.07, type: "triangle", vol: 0.15 })
    )
};
