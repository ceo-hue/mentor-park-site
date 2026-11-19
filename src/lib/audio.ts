/**
 * 음원 파일 없이 Web Audio로 합성하는 사운드.
 *  - 배경: 낮게 깔리는 패드(사인파 3개 + 느린 필터 흔들림)
 *  - 누르기: 진행률에 따라 올라가는 톤
 *  - 분해: 유리 파편 노이즈 + 높은 핑, 1.4초 뒤 다시 모이는 화음
 * 브라우저 정책상 사용자 클릭(START) 이후에만 시작한다.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let holdOsc: OscillatorNode | null = null;
let holdGain: GainNode | null = null;
let enabled = true;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  startPad();
  return ctx;
}

function startPad() {
  if (!ctx || !master) return;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 700;
  filter.Q.value = 0.7;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();
  const pad = ctx.createGain();
  pad.gain.value = 0.05;
  filter.connect(pad).connect(master);
  [110, 164.81, 246.94].forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i === 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1) * 6;
    o.connect(filter);
    o.start();
  });
}

export function startAudio(on: boolean) {
  enabled = on;
  const c = ensure();
  if (!c || !master) return;
  c.resume();
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.linearRampToValueAtTime(on ? 0.8 : 0, c.currentTime + 1.5);
}

export function setSound(on: boolean) {
  enabled = on;
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(on ? 0.8 : 0, ctx.currentTime + 0.4);
}

export function holdTone(progress: number) {
  if (!ctx || !master || !enabled) return;
  if (progress <= 0.01) {
    if (holdGain && holdOsc) {
      holdGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      const o = holdOsc;
      setTimeout(() => o.stop(), 300);
      holdOsc = null;
      holdGain = null;
    }
    return;
  }
  if (!holdOsc) {
    holdOsc = ctx.createOscillator();
    holdOsc.type = "sine";
    holdGain = ctx.createGain();
    holdGain.gain.value = 0;
    holdOsc.connect(holdGain).connect(master);
    holdOsc.start();
  }
  holdOsc.frequency.setTargetAtTime(220 + progress * 660, ctx.currentTime, 0.03);
  holdGain!.gain.setTargetAtTime(0.06 + progress * 0.08, ctx.currentTime, 0.05);
}

export function shatterSound() {
  if (!ctx || !master || !enabled) return;
  const t = ctx.currentTime;
  // 파편 노이즈
  const len = Math.floor(ctx.sampleRate * 0.8);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3200;
  bp.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.value = 0.5;
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  // 유리 핑
  for (let i = 0; i < 7; i++) {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 1800 + Math.random() * 2600;
    const at = t + Math.random() * 0.35;
    og.gain.setValueAtTime(0, at);
    og.gain.linearRampToValueAtTime(0.06, at + 0.005);
    og.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
    o.connect(og).connect(master);
    o.start(at);
    o.stop(at + 0.55);
  }
  // 재조립 화음
  [392, 523.25, 659.25, 987.77].forEach((f, i) => {
    const o = ctx!.createOscillator();
    const og = ctx!.createGain();
    o.type = "sine";
    o.frequency.value = f;
    const at = t + 1.45 + i * 0.07;
    og.gain.setValueAtTime(0, at);
    og.gain.linearRampToValueAtTime(0.045, at + 0.25);
    og.gain.exponentialRampToValueAtTime(0.0001, at + 2.2);
    o.connect(og).connect(master!);
    o.start(at);
    o.stop(at + 2.3);
  });
}
