// Procedurally-synthesized sound effects (Web Audio API) — no audio files needed.
(function () {
  const MUTE_KEY = 'angryUncle.muted';
  let audioCtx = null;
  let muted = localStorage.getItem(MUTE_KEY) === 'true';

  function getCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function isMuted() {
    return muted;
  }

  function setMuted(value) {
    muted = value;
    localStorage.setItem(MUTE_KEY, String(value));
  }

  function toggleMuted() {
    setMuted(!muted);
    return muted;
  }

  // A bright, brief two-note metallic "plink" — closer to a music-box note
  // than a literal coin sound, but carries the same "safe, pleasant" feel.
  function playSafeTone() {
    if (muted) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.value = 0.3;
      master.connect(ctx.destination);

      [
        { freq: 1046.5, delay: 0, dur: 0.28 }, // C6
        { freq: 1568.0, delay: 0.045, dur: 0.24 }, // G6, slightly offset for shimmer
      ].forEach(({ freq, delay, dur }) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const start = now + delay;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.08, start + 0.05);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.7, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain).connect(master);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {
      // Sound is a nice-to-have — never let it break gameplay.
    }
  }

  // A low, descending, distorted growl-buzz — carries "alarm" energy without
  // being a literal buzzer sample.
  function playAngryTone() {
    if (muted) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const dur = 0.55;

      const master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);

      const carrier = ctx.createOscillator();
      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(190, now);
      carrier.frequency.exponentialRampToValueAtTime(65, now + dur);

      // Soft clipping for a gnarlier, less "clean synth" texture.
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i / 255) * 2 - 1;
        curve[i] = Math.tanh(x * 3.2);
      }
      shaper.curve = curve;

      // Tremolo LFO modulates the amplitude to give it a buzzing pulse,
      // riding on top of the overall envelope below.
      const tremolo = ctx.createOscillator();
      tremolo.type = 'square';
      tremolo.frequency.value = 34;
      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 0.35;
      tremolo.connect(tremoloGain);

      const ampGain = ctx.createGain();
      ampGain.gain.value = 0.65;
      tremoloGain.connect(ampGain.gain);

      const envGain = ctx.createGain();
      envGain.gain.setValueAtTime(0, now);
      envGain.gain.linearRampToValueAtTime(0.9, now + 0.02);
      envGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      carrier.connect(shaper).connect(ampGain).connect(envGain).connect(master);

      carrier.start(now);
      carrier.stop(now + dur + 0.02);
      tremolo.start(now);
      tremolo.stop(now + dur + 0.02);
    } catch {
      // Sound is a nice-to-have — never let it break gameplay.
    }
  }

  window.UncleSounds = { playSafeTone, playAngryTone, isMuted, setMuted, toggleMuted };
})();
