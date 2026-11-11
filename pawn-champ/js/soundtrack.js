// Pawn Champ - the soundtrack.
//
// Twenty-three pieces of music, all composed for this game and played live by small Web Audio
// synthesisers. No samples, loops or recordings from anywhere else. docs/AUDIO.md lists
// every track and where it plays.
//
// js/audio.js owns the volume buses and asks this file for music:
//   const player = Soundtrack.createPlayer(ctx, musicBus);
//   player.start('day');        crossfades to a track ('none' or an unknown id stops)
// For tests and previews:
//   Soundtrack.render(offlineCtx, 'day', seconds) schedules a track into an OfflineAudioContext.
'use strict';

const Soundtrack = (() => {
  // ================================================================ notes and chords
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const acc = a => (a === '#' ? 1 : a === 'b' ? -1 : 0);

  // 'C#5' -> 73
  function nn(s) {
    const m = /^([A-G])(#|b)?(-?\d)$/.exec(s);
    if (!m) throw new Error('bad note ' + s);
    return 12 * (+m[3] + 1) + PC[m[1]] + acc(m[2]);
  }

  // A melody line: "r:4 A4:2 C5:2 D5:8 | ..." in 16th-note steps. '|' marks a bar line and is
  // checked, so a miscounted bar throws instead of drifting. Returns one array per bar of
  // [step, midi, lengthInSteps].
  function line(str, steps = 16) {
    const bars = [[]];
    let pos = 0;
    for (const tok of str.trim().split(/\s+/)) {
      if (tok === '|') {
        if (pos % steps) throw new Error(`bar ${bars.length} of "${str.slice(0, 30)}..." has ${pos % steps} extra steps`);
        continue;
      }
      const [n, l] = tok.split(':');
      const len = +l;
      const bar = Math.floor(pos / steps);
      while (bars.length <= bar) bars.push([]);
      if (n !== 'r') bars[bar].push([pos % steps, nn(n), len]);
      pos += len;
    }
    while (bars.length < Math.ceil(pos / steps)) bars.push([]);
    return bars;
  }

  const QUAL = {
    '': [0, 4, 7], m: [0, 3, 7], 5: [0, 7], 6: [0, 4, 7, 9], m6: [0, 3, 7, 9],
    7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], m9: [0, 3, 7, 10, 14],
    maj9: [0, 4, 7, 11, 14], 9: [0, 4, 7, 10, 14], 13: [0, 4, 10, 14, 21],
    sus4: [0, 5, 7], '7sus4': [0, 5, 7, 10], '9sus4': [0, 5, 7, 10, 14],
    m7b5: [0, 3, 6, 10], '7b9': [0, 4, 7, 10, 13], dim7: [0, 3, 6, 9], add9: [0, 4, 7, 14],
    'maj7#11': [0, 4, 7, 11, 18], aug: [0, 4, 8], dim: [0, 3, 6]
  };
  // 'F#m7b5/C' -> { root: 6, bass: 0, iv: [0, 3, 6, 10] }
  function chord(sym) {
    const m = /^([A-G])(#|b)?([^/]*)(?:\/([A-G])(#|b)?)?$/.exec(sym);
    if (!m || !QUAL[m[3]]) throw new Error('bad chord ' + sym);
    const root = (PC[m[1]] + acc(m[2]) + 12) % 12;
    const bass = m[4] ? (PC[m[4]] + acc(m[5]) + 12) % 12 : root;
    return { sym, root, bass, iv: QUAL[m[3]] };
  }
  // "Fmaj9 | Em7 A7b9 | ..." -> per bar, a list of { ...chord, at, len } (chords split a bar evenly).
  function changes(str, steps = 16) {
    return str.split('|').map(b => {
      const syms = b.trim().split(/\s+/);
      const len = steps / syms.length;
      return syms.map((s, i) => Object.assign(chord(s), { at: i * len, len }));
    });
  }
  // Close voicing around `center`. Five-note chords drop the root (the bass plays it).
  function voicing(ch, center = 62) {
    const ivs = ch.iv.length >= 5 ? ch.iv.slice(1) : ch.iv;
    const out = ivs.map(iv => {
      const pc = (ch.root + iv) % 12;
      let n = center - 6 + ((pc - (center - 6)) % 12 + 12) % 12;
      return n;
    });
    return [...new Set(out)].sort((a, b) => a - b);
  }
  // Bass note for a chord, the lowest one at or above `lo`.
  const bassOf = (ch, lo = 36) => lo + ((ch.bass - lo) % 12 + 12) % 12;
  const rootOf = (ch, lo = 36) => lo + ((ch.root - lo) % 12 + 12) % 12;
  // Chord sounding at a step in a bar.
  const chordAt = (bars, bar, s) => { const b = bars[bar % bars.length]; let c = b[0]; for (const x of b) if (x.at <= s) c = x; return c; };

  // Small seeded random, so a track sounds the same each time through but not mechanical.
  function rng(seed) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }

  // ================================================================ synth building blocks
  const noiseCache = new WeakMap();
  function noiseBuf(c) {
    if (noiseCache.has(c)) return noiseCache.get(c);
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    const r = rng(99);
    for (let i = 0; i < len; i++) d[i] = r() * 2 - 1;
    noiseCache.set(c, buf);
    return buf;
  }
  // Gain envelope: attack to `peak`, fall toward `sus * peak` with time constant `dec`,
  // then release with time constant `rel` from t + dur. Returns [gainNode, stopTime].
  function amp(c, dest, t, dur, peak, a = 0.005, dec = 0.3, sus = 0, rel = 0.15) {
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(peak * sus, t + a, dec);
    g.gain.setTargetAtTime(0, t + Math.max(dur, a), rel);
    g.connect(dest);
    return [g, t + Math.max(dur, a) + rel * 6];
  }
  function osc(c, type, f, t, end, dest, detune = 0) {
    const o = c.createOscillator();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (detune) o.detune.setValueAtTime(detune, t);
    o.connect(dest); o.start(t); o.stop(end);
    return o;
  }
  function filt(c, type, f, q, dest) {
    const b = c.createBiquadFilter();
    b.type = type; b.frequency.value = f; b.Q.value = q; b.connect(dest);
    return b;
  }
  // Vibrato on one or more oscillators: fades in after `delay`.
  function vibrato(c, oscs, t, end, rate, cents, delay = 0.2) {
    const l = c.createOscillator(), d = c.createGain();
    l.frequency.value = rate;
    d.gain.setValueAtTime(0, t); d.gain.linearRampToValueAtTime(cents, t + delay + 0.3);
    l.connect(d); oscs.forEach(o => d.connect(o.detune));
    l.start(t); l.stop(end);
  }
  function noise(c, t, end, dest) {
    const s = c.createBufferSource();
    s.buffer = noiseBuf(c); s.loop = true;
    s.connect(dest); s.start(t, (t * 7.31) % 1.5); s.stop(end);
    return s;
  }

  // ================================================================ instruments
  // Every instrument is (dest, t, midi, durSeconds, velocity 0..1, opts) and only uses the
  // context it's given, so the same code plays live and renders offline.
  const I = {
    // Electric piano: two-operator FM. The modulator's depth falls fast, so notes start with a
    // bell-like bark and settle into a round tone. Harder notes are brighter.
    epiano(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const [g, end] = amp(c, d, t, dur, 0.11 * v, 0.004, 1.1 + (72 - m) * 0.02, 0.15, 0.25);
      const car = osc(c, 'sine', f, t, end, g);
      const mod = c.createOscillator(), mg = c.createGain();
      mod.frequency.value = f; mg.gain.setValueAtTime(f * (0.6 + v * 1.4), t);
      mg.gain.setTargetAtTime(f * 0.18, t, 0.12);
      mod.connect(mg); mg.connect(car.frequency); mod.start(t); mod.stop(end);
      const [tg, tend] = amp(c, d, t, 0.02, 0.012 * v, 0.001, 0.05);
      osc(c, 'sine', f * 7.1, t, tend, tg);
    },
    // Acoustic-ish piano: a few slightly stretched partials with their own decays and a soft
    // hammer knock. Low notes ring longer.
    piano(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m), ring = 1.6 + (84 - m) * 0.05;
      const parts = [[1, 1, 1], [2.003, 0.45, 0.6], [3.008, 0.22, 0.4], [4.02, 0.12, 0.25], [5.03, 0.05, 0.18]];
      const lp = filt(c, 'lowpass', 1800 + v * 4000, 0.3, d);
      for (const [r, a, k] of parts) {
        const [g, end] = amp(c, lp, t, dur, 0.06 * v * a, 0.003, ring * k, 0, 0.3);
        osc(c, r === 1 ? 'triangle' : 'sine', f * r, t, end, g, r === 1 ? 0 : 2);
      }
      const [hg, hend] = amp(c, filt(c, 'bandpass', f * 4, 1, d), t, 0.01, 0.03 * v, 0.001, 0.02);
      noise(c, t, hend, hg);
    },
    // Nylon guitar: saw and triangle through a low-pass that closes quickly after the pluck.
    guitar(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 600, 1.5, d);
      lp.frequency.setValueAtTime(900 + 3600 * v, t);
      lp.frequency.setTargetAtTime(500, t, 0.12);
      const [g, end] = amp(c, lp, t, dur, 0.09 * v, 0.002, 0.7, 0, 0.12);
      osc(c, 'sawtooth', f, t, end, g, -3); osc(c, 'triangle', f, t, end, g, 3);
    },
    // Upright bass: round sine body with a little bow-free "thump" on the attack.
    upright(d, t, m, dur, v = 0.8) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 900, 0.7, d);
      const [g, end] = amp(c, lp, t, dur, 0.15 * v, 0.008, 0.5, 0.25, 0.1);
      osc(c, 'sine', f, t, end, g); osc(c, 'triangle', f, t, end, g);
      const [tg, tend] = amp(c, lp, t, 0.03, 0.05 * v, 0.002, 0.04);
      osc(c, 'sine', f * 2, t, tend, tg);
    },
    // Electric bass for the lo-fi and title tracks.
    ebass(d, t, m, dur, v = 0.8) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 300, 2, d);
      lp.frequency.setValueAtTime(350 + 900 * v, t); lp.frequency.setTargetAtTime(280, t, 0.1);
      const [g, end] = amp(c, lp, t, dur, 0.12 * v, 0.004, 0.6, 0.5, 0.06);
      osc(c, 'sine', f, t, end, g); osc(c, 'sawtooth', f, t, end, g);
    },
    // Synthwave bass: two saws an octave apart, punchy filter.
    synbass(d, t, m, dur, v = 0.8) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 300, 4, d);
      lp.frequency.setValueAtTime(1600 * v + 300, t); lp.frequency.setTargetAtTime(260, t, 0.07);
      const [g, end] = amp(c, lp, t, dur, 0.09 * v, 0.003, 0.2, 0.6, 0.04);
      osc(c, 'sawtooth', f, t, end, g, -6); osc(c, 'sawtooth', f, t, end, g, 6); osc(c, 'square', f, t, end, g);
    },
    // Short synth pluck for arpeggios.
    pluck(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 800, 3, d);
      lp.frequency.setValueAtTime(5000 * v + 600, t); lp.frequency.setTargetAtTime(700, t, 0.06);
      const [g, end] = amp(c, lp, t, Math.min(dur, 0.12), 0.07 * v, 0.002, 0.15, 0, 0.12);
      osc(c, 'square', f, t, end, g, -5); osc(c, 'sawtooth', f, t, end, g, 5);
    },
    // Lead synth: detuned saws, gentle filter, vibrato that arrives late in long notes.
    lead(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 1200, 1, d);
      lp.frequency.setValueAtTime(800, t); lp.frequency.linearRampToValueAtTime(2200 + 1400 * v, t + 0.05);
      lp.frequency.setTargetAtTime(1700, t + 0.05, 0.4);
      const [g, end] = amp(c, lp, t, dur, 0.09 * v, 0.015, 0.6, 0.7, 0.18);
      const o = [osc(c, 'sawtooth', f, t, end, g, -8), osc(c, 'sawtooth', f, t, end, g, 8), osc(c, 'triangle', f * 2, t, end, g)];
      if (dur > 0.35) vibrato(c, o, t, end, 5.2, 14, 0.25);
    },
    // Muted trumpet: saw through a nasal band, breathy attack, late vibrato.
    trumpet(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const bp = filt(c, 'bandpass', 1300, 1.2, d);
      const lp = filt(c, 'lowpass', 600, 0.8, bp);
      lp.frequency.setValueAtTime(500, t); lp.frequency.linearRampToValueAtTime(1800 + 1200 * v, t + 0.07);
      lp.frequency.setTargetAtTime(1500, t + 0.07, 0.3);
      const [g, end] = amp(c, lp, t, dur, 0.32 * v, 0.035, 0.8, 0.75, 0.12);
      const o = [osc(c, 'sawtooth', f, t, end, g), osc(c, 'sawtooth', f, t, end, g, 6)];
      o[0].frequency.setValueAtTime(f * 0.97, t); o[0].frequency.linearRampToValueAtTime(f, t + 0.06);
      if (dur > 0.4) vibrato(c, o, t, end, 4.8, 16, 0.3);
      const [bg, bend] = amp(c, filt(c, 'bandpass', f * 3, 2, d), t, 0.06, 0.025 * v, 0.01, 0.04);
      noise(c, t, bend, bg);
    },
    // Flute: sine with a little second harmonic and breath noise.
    flute(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const [g, end] = amp(c, d, t, dur, 0.12 * v, 0.05, 0.8, 0.8, 0.1);
      const o = [osc(c, 'sine', f, t, end, g), osc(c, 'triangle', f * 2, t, end, filt(c, 'lowpass', 2500, 0.5, g))];
      if (dur > 0.3) vibrato(c, o, t, end, 5, 12, 0.2);
      const [bg] = amp(c, filt(c, 'bandpass', f * 2, 3, d), t, dur, 0.012 * v, 0.04, 0.3, 0.4, 0.1);
      noise(c, t, end, bg);
    },
    // Vibraphone: sine with its 4th and 10th partials and a slow motor tremolo.
    vibes(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const trem = c.createGain(); trem.connect(d);
      const l = c.createOscillator(), ld = c.createGain();
      l.frequency.value = 5.5; ld.gain.value = 0.25; l.connect(ld); ld.connect(trem.gain);
      const [g, end] = amp(c, trem, t, dur, 0.11 * v, 0.002, 1.4, 0, 0.3);
      osc(c, 'sine', f, t, end, g);
      const [g2, e2] = amp(c, trem, t, 0.1, 0.02 * v, 0.001, 0.25);
      osc(c, 'sine', f * 4, t, e2, g2);
      const [g3, e3] = amp(c, trem, t, 0.02, 0.008 * v, 0.001, 0.06);
      osc(c, 'sine', f * 10, t, e3, g3);
      l.start(t); l.stop(end);
    },
    // Music box tine: bright partials, quick decay. opts.detune pulls it out of tune.
    musicbox(d, t, m, dur, v = 0.7, o = {}) {
      const c = d.context, f = mtof(m), dt = o.detune || 0;
      const [g, end] = amp(c, d, t, 0.01, 0.09 * v, 0.001, 0.7, 0, 0.3);
      osc(c, 'sine', f, t, end, g, dt);
      const [g2, e2] = amp(c, d, t, 0.01, 0.025 * v, 0.001, 0.2, 0, 0.1);
      osc(c, 'sine', f * 3.01, t, e2, g2, dt);
      const [g3, e3] = amp(c, d, t, 0.01, 0.01 * v, 0.001, 0.06, 0, 0.05);
      osc(c, 'sine', f * 6.4, t, e3, g3, dt);
    },
    // Bell for melodies (softer than the shop-door bell in audio.js).
    bell(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const [g, end] = amp(c, d, t, 0.01, 0.05 * v, 0.002, 0.9, 0, 0.4);
      osc(c, 'sine', f, t, end, g);
      const [g2, e2] = amp(c, d, t, 0.01, 0.018 * v, 0.001, 0.35);
      osc(c, 'sine', f * 2.76, t, e2, g2);
    },
    // A distant church bell: inharmonic partials with a long ring.
    toll(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      for (const [r, a, k] of [[0.5, 0.6, 3], [1, 1, 2.2], [1.19, 0.5, 1.5], [1.5, 0.35, 1.2], [2.0, 0.3, 1], [2.6, 0.15, 0.6]]) {
        const [g, end] = amp(c, d, t, 0.02, 0.035 * v * a, 0.003, k, 0, 0.5);
        osc(c, 'sine', f * r, t, end, g);
      }
    },
    // String section: three detuned saws, slow bow, soft top. opts.short for staccato.
    strings(d, t, m, dur, v = 0.6, o = {}) {
      const c = d.context, f = mtof(m), short = o.short;
      const lp = filt(c, 'lowpass', 900 + 2600 * v, 0.6, d);
      const [g, end] = short ? amp(c, lp, t, dur, 0.05 * v, 0.006, 0.08, 0.3, 0.06)
        : amp(c, lp, t, dur, 0.035 * v, o.attack || 0.35, 1, 1, 0.5);
      const os = [osc(c, 'sawtooth', f, t, end, g, -9), osc(c, 'sawtooth', f, t, end, g, 0), osc(c, 'sawtooth', f, t, end, g, 10)];
      if (!short && dur > 0.5) vibrato(c, os, t, end, 5.5, 8, 0.4);
    },
    // Warm pad.
    pad(d, t, m, dur, v = 0.6, o = {}) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', o.cutoff || 1200, 0.7, d);
      const [g, end] = amp(c, lp, t, dur, 0.03 * v, o.attack || 0.6, 1, 1, 0.9);
      osc(c, 'sawtooth', f, t, end, g, -7); osc(c, 'sawtooth', f, t, end, g, 7); osc(c, 'triangle', f / 2, t, end, g);
    },
    // Choir "ah": buzzy source through three vowel formants.
    choir(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m), mix = c.createGain();
      mix.gain.value = 1;
      for (const [ff, q, a] of [[700, 6, 1], [1150, 7, 0.6], [2650, 9, 0.25]]) {
        const b = filt(c, 'bandpass', ff, q, d); const bg = c.createGain(); bg.gain.value = a * 3; bg.connect(b); mix.connect(bg);
      }
      const [g, end] = amp(c, mix, t, dur, 0.1 * v, 0.5, 1, 1, 0.8);
      const os = [osc(c, 'sawtooth', f, t, end, g, -6), osc(c, 'sawtooth', f, t, end, g, 7), osc(c, 'sawtooth', f, t, end, g, 1)];
      vibrato(c, os, t, end, 4.6, 10, 0.4);
    },
    // Glass: two close sines beating against each other.
    glass(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m);
      const [g, end] = amp(c, d, t, dur, 0.04 * v, 0.4, 1, 1, 1.2);
      osc(c, 'sine', f, t, end, g); osc(c, 'sine', f * 1.007, t, end, g);
    },
    // Low drone with a slow filter breath.
    drone(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 300, 2, d);
      const l = c.createOscillator(), ld = c.createGain();
      l.frequency.value = 0.13; ld.gain.value = 180; l.connect(ld); ld.connect(lp.frequency);
      const [g, end] = amp(c, lp, t, dur, 0.09 * v, 1.5, 1, 1, 1.5);
      osc(c, 'sawtooth', f, t, end, g, -4); osc(c, 'sawtooth', f, t, end, g, 5);
      l.start(t); l.stop(end);
    },

    // Drawbar organ: sine partials at 1, 2, 3 and 4 times the note, through a slow rotary wobble.
    organ(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m), rot = c.createGain(); rot.connect(d);
      const l = c.createOscillator(), ld = c.createGain();
      l.frequency.value = 5.8; ld.gain.value = 0.12; l.connect(ld); ld.connect(rot.gain);
      const [g, end] = amp(c, rot, t, dur, 0.05 * v, 0.01, 1, 1, 0.08);
      for (const [r, a] of [[1, 1], [2, 0.6], [3, 0.35], [4, 0.25], [0.5, 0.5]]) {
        const pg = c.createGain(); pg.gain.value = a; pg.connect(g);
        osc(c, 'sine', f * r, t, end, pg);
      }
      l.start(t); l.stop(end);
    },
    // Fiddle: a bowed saw through a body resonance, quick bow attack, vibrato on held notes.
    fiddle(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const body = filt(c, 'peaking', 2800, 1.5, d); body.gain.value = 6;
      const lp = filt(c, 'lowpass', 5200, 0.6, body);
      const [g, end] = amp(c, lp, t, dur, 0.06 * v, 0.02, 0.5, 0.8, 0.07);
      const o = [osc(c, 'sawtooth', f, t, end, g, -4), osc(c, 'sawtooth', f, t, end, g, 4)];
      if (dur > 0.25) vibrato(c, o, t, end, 6, 14, 0.12);
      const [bg, bend] = amp(c, filt(c, 'bandpass', f * 4, 2, d), t, 0.04, 0.02 * v, 0.005, 0.03);
      noise(c, t, bend, bg);
    },
    // Reed (button accordion / concertina): two square reeds a few cents apart, so it beats.
    reed(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m);
      const bp = filt(c, 'lowpass', 2400, 0.7, d);
      const [g, end] = amp(c, bp, t, dur, 0.035 * v, 0.04, 0.6, 0.85, 0.1);
      osc(c, 'square', f, t, end, g, -7); osc(c, 'square', f, t, end, g, 7); osc(c, 'sawtooth', f * 2, t, end, g, 0);
    },
    // Pizzicato string: a plucked triangle and saw with a fast filter close.
    pizz(d, t, m, dur, v = 0.7) {
      const c = d.context, f = mtof(m);
      const lp = filt(c, 'lowpass', 400, 1, d);
      lp.frequency.setValueAtTime(800 + 2400 * v, t); lp.frequency.setTargetAtTime(350, t, 0.05);
      const [g, end] = amp(c, lp, t, 0.02, 0.14 * v, 0.002, 0.18 + (60 - Math.min(m, 60)) * 0.006, 0, 0.08);
      osc(c, 'triangle', f, t, end, g); osc(c, 'sawtooth', f, t, end, g, 3);
    },
    // A sonar ping: a pure tone that falls a hair as it fades.
    sonar(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m);
      const [g, end] = amp(c, d, t, 0.05, 0.07 * v, 0.004, 1.4, 0, 0.6);
      const o = osc(c, 'sine', f, t, end, g); o.frequency.setTargetAtTime(f * 0.985, t + 0.1, 1);
    },
    // A long glide from note m to note `to`: whale song under the harbor, or a howl.
    glide(d, t, m, dur, v = 0.6, o = {}) {
      const c = d.context, f = mtof(m), f2 = mtof(o.to ?? m);
      const lp = filt(c, 'lowpass', o.cutoff || 900, 2, d);
      const [g, end] = amp(c, lp, t, dur, 0.08 * v, dur * 0.3, 1, 1, dur * 0.2);
      const os = [osc(c, o.wave || 'triangle', f, t, end, g), osc(c, 'sawtooth', f, t, end, g, 9)];
      for (const x of os) { x.frequency.setValueAtTime(f, t); x.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.7); x.frequency.setTargetAtTime(f2 * 0.94, t + dur * 0.8, dur * 0.2); }
      vibrato(c, os, t, end, 4.2, o.wobble || 18, dur * 0.3);
    },
    // Theremin: a sine that scoops up into each note and wavers wide.
    theremin(d, t, m, dur, v = 0.6) {
      const c = d.context, f = mtof(m);
      const [g, end] = amp(c, d, t, dur, 0.09 * v, 0.12, 1, 0.9, 0.3);
      const o = [osc(c, 'sine', f, t, end, g), osc(c, 'triangle', f, t, end, filt(c, 'lowpass', 1200, 0.5, g))];
      for (const x of o) { x.frequency.setValueAtTime(f * 0.94, t); x.frequency.exponentialRampToValueAtTime(f, t + 0.18); }
      vibrato(c, o, t, end, 6.3, 28, 0.15);
    },

    // ---------------------------------------------------------------- drums
    kick(d, t, v = 0.8, o = {}) {
      const c = d.context, o1 = c.createOscillator();
      const [g, end] = amp(c, d, t, 0.02, 0.45 * v, 0.002, o.long ? 0.22 : 0.12);
      o1.frequency.setValueAtTime(o.soft ? 110 : 150, t); o1.frequency.exponentialRampToValueAtTime(44, t + 0.12);
      o1.connect(g); o1.start(t); o1.stop(end);
      if (!o.soft) { const [cg, ce] = amp(c, filt(c, 'highpass', 2500, 0.7, d), t, 0.004, 0.08 * v, 0.001, 0.01); noise(c, t, ce, cg); }
    },
    snare(d, t, v = 0.7, o = {}) {
      const c = d.context;
      const [g, end] = amp(c, filt(c, 'bandpass', o.lofi ? 1400 : 1900, 0.8, d), t, 0.01, 0.45 * v, 0.001, o.lofi ? 0.07 : 0.09);
      noise(c, t, end, g);
      const [bg, be] = amp(c, d, t, 0.01, 0.18 * v, 0.001, 0.05);
      const b = osc(c, 'triangle', 190, t, be, bg); b.frequency.exponentialRampToValueAtTime(150, t + 0.06);
    },
    rim(d, t, v = 0.6) {
      const c = d.context;
      const [g, end] = amp(c, filt(c, 'bandpass', 1700, 4, d), t, 0.005, 0.35 * v, 0.001, 0.025);
      osc(c, 'triangle', 1700, t, end, g); noise(c, t, end, g);
    },
    hat(d, t, v = 0.5, o = {}) {
      const c = d.context;
      const [g, end] = amp(c, filt(c, 'highpass', o.lofi ? 5500 : 7500, 0.7, d), t, 0.005, 0.07 * v, 0.001, o.open ? 0.12 : 0.02);
      noise(c, t, end, g);
    },
    ride(d, t, v = 0.5) {
      const c = d.context;
      const [g, end] = amp(c, filt(c, 'bandpass', 6500, 1.5, d), t, 0.005, 0.12 * v, 0.001, 0.35);
      noise(c, t, end, g);
      const [pg, pe] = amp(c, d, t, 0.005, 0.012 * v, 0.001, 0.3);
      osc(c, 'sine', 4980, t, pe, pg); osc(c, 'sine', 6230, t, pe, pg);
    },
    shaker(d, t, v = 0.5) {
      const c = d.context;
      const [g, end] = amp(c, filt(c, 'bandpass', 6000, 1.2, d), t, 0.02, 0.1 * v, 0.012, 0.025);
      noise(c, t, end, g);
    },
    // Brush swirl on a snare: a soft, long swish.
    brush(d, t, v = 0.5, dur = 0.3) {
      const c = d.context;
      const [g, end] = amp(c, filt(c, 'bandpass', 3200, 0.6, d), t, dur, 0.12 * v, dur * 0.4, 0.2, 0.6, 0.08);
      noise(c, t, end, g);
    },
    // Frame drum / low tom.
    tom(d, t, v = 0.7, pitch = 90) {
      const c = d.context, o1 = c.createOscillator();
      const [g, end] = amp(c, d, t, 0.02, 0.5 * v, 0.002, 0.22);
      o1.frequency.setValueAtTime(pitch * 1.4, t); o1.frequency.exponentialRampToValueAtTime(pitch, t + 0.08);
      o1.connect(g); o1.start(t); o1.stop(end);
      const [ng, ne] = amp(c, filt(c, 'lowpass', 700, 0.7, d), t, 0.01, 0.12 * v, 0.001, 0.04);
      noise(c, t, ne, ng);
    },
    // Big low drum hit with a long tail.
    boom(d, t, v = 0.8) {
      const c = d.context, o1 = c.createOscillator();
      const [g, end] = amp(c, d, t, 0.03, 0.7 * v, 0.003, 0.5);
      o1.frequency.setValueAtTime(75, t); o1.frequency.exponentialRampToValueAtTime(38, t + 0.4);
      o1.connect(g); o1.start(t); o1.stop(end);
      const [ng, ne] = amp(c, filt(c, 'lowpass', 400, 0.7, d), t, 0.02, 0.2 * v, 0.001, 0.12);
      noise(c, t, ne, ng);
    },
    heartbeat(d, t, v = 0.7) {
      I.kick(d, t, 0.5 * v, { soft: true, long: true });
      I.kick(d, t + 0.22, 0.35 * v, { soft: true, long: true });
    },
    // A noise swell that rises into the next downbeat.
    swell(d, t, dur, v = 0.6) {
      const c = d.context, bp = filt(c, 'bandpass', 300, 1.5, d);
      bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(4000, t + dur);
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.08 * v, t + dur);
      g.gain.linearRampToValueAtTime(0, t + dur + 0.03); g.connect(bp);
      noise(c, t, t + dur + 0.05, g);
    },
    // Vinyl crackle: a few tiny clicks.
    crackle(d, t, v = 0.5, r = Math.random) {
      const c = d.context;
      const n = r() < 0.5 ? 0 : r() < 0.7 ? 1 : 2;
      for (let i = 0; i < n; i++) {
        const s = t + r() * 0.15;
        const [g, end] = amp(c, filt(c, 'highpass', 2000 + r() * 3000, 0.7, d), s, 0.001, 0.05 * v * (0.3 + r()), 0.0005, 0.002);
        noise(c, s, end, g);
      }
    }
  };

  // ================================================================ the tracks
  // Each track: bpm, steps per bar (16 = 4/4, 12 = 3/4), bars, loopFrom (bar the loop
  // returns to, so an intro plays once), swing (0..1 of a step, applied to off-beat 8ths, or
  // 16ths when swing16 is set), amb (ambience bed), lofi (darker, with vinyl), mix (channel
  // strips: pan, verb, echo, gain) and play(p, bar, step, time, pass).

  // ---------------------------------------------------------------- Title: "Neon Over the Harbor"
  const T_TITLE = {
    name: 'Neon Over the Harbor', bpm: 96, bars: 16, loopFrom: 4, amb: 'shop', gain: 0.57,
    ch: changes('Dm9 | Bbmaj9 | Fmaj7 | C6 | Dm9 | Bbmaj9 | Fmaj7 | C6 | Dm9 | Bbmaj9 | Fmaj7 | C6 | Gm9 | Bbmaj7 | Am7 | A7sus4 A7'),
    mel: line(`r:16 | r:16 | r:16 | r:16 |
      r:4 A4:2 C5:2 D5:6 C5:2 | D5:3 F5:3 E5:2 D5:4 C5:4 | A4:6 G4:2 A4:2 C5:6 | E5:10 D5:2 C5:2 G4:2 |
      r:4 A4:2 C5:2 D5:4 F5:4 | A5:6 G5:2 F5:4 E5:4 | F5:4 E5:2 C5:2 E5:2 F5:2 G5:4 | E5:12 r:4 |
      D5:4 F5:4 A5:4 Bb5:4 | A5:6 F5:2 D5:8 | E5:4 G5:4 C6:4 A5:4 | D6:8 C#6:8`),
    mix: { pad: { verb: 0.5 }, arp: { pan: 0.3, verb: 0.25, echo: 0.4 }, bass: {}, lead: { pan: -0.1, verb: 0.35, echo: 0.3 },
      kick: {}, snare: { verb: 0.4 }, hat: { pan: -0.25 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, intro = bar < 4, b = bar >= 12;
      if (first) voicing(c, b ? 67 : 60).forEach(m => I.pad(p.ch.pad, t, m, sd * c.len, b ? 0.75 : 0.6));
      const v = voicing(c, 74), pat = [0, 1, 2, 3, 2, 1, 3, 2];
      if (s % 2 === 0 || (b && !intro)) I.pluck(p.ch.arp, t, v[pat[(s >> (b ? 0 : 1)) % 8] % v.length] || v[0], sd, s % 4 === 0 ? 0.7 : 0.5);
      const root = rootOf(c, 33);
      if (intro) { if (first) I.ebass(p.ch.bass, t, root, sd * c.len, 0.6); }
      else if (s % 2 === 0) I.synbass(p.ch.bass, t, s % 4 === 2 ? root + 12 : root, sd * 1.6, s % 8 === 0 ? 0.9 : 0.7);
      if (!intro) {
        if (s === 0 || s === 8 || (s === 10 && bar % 2)) I.kick(p.ch.kick, t, 0.9);
        if (s === 4 || s === 12) I.snare(p.ch.snare, t, 0.7);
        if (bar === 15 && s >= 13) I.snare(p.ch.snare, t, 0.3 + (s - 12) * 0.12);
        if (s % 2 === 0) I.hat(p.ch.hat, t, s % 4 === 2 ? 0.6 : 0.35, { open: s === 14 });
      }
      if (bar === 3 && s === 0) I.swell(p.ch.snare, t, sd * 16, 0.7);
      p.notes(this.mel, bar, s, (m, len) => I.lead(p.ch.lead, t, m, sd * len * 0.95, 0.75));
    }
  };

  // ---------------------------------------------------------------- Day 1: "Counter Hours" (lo-fi)
  const T_DAY = {
    name: 'Counter Hours', bpm: 78, bars: 16, swing: 0.28, swing16: true, lofi: true, amb: 'shop', gain: 0.36,
    ch: changes('Fmaj9 | Em7 A7b9 | Dm9 | Cmaj9 | Bbmaj7 | Am7 | Gm9 | C9sus4 | Fmaj9 | Em7 A7b9 | Dm9 | Cmaj9 | Bbmaj7 | Am7 | Gm9 | C9sus4'),
    mel: line(`r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 |
      r:2 C6:2 A5:2 G5:2 A5:8 | G5:4 E5:4 r:2 C#5:2 E5:4 | F5:6 E5:2 D5:2 C5:2 A4:4 | B4:2 C5:2 D5:2 E5:10 |
      r:2 D5:2 F5:2 A5:2 G5:4 F5:4 | E5:8 r:4 C5:2 D5:2 | F5:4 A5:4 G5:2 F5:2 D5:4 | G5:6 F5:2 r:8`),
    mix: { keys: { pan: -0.15, verb: 0.3 }, lead: { pan: 0.2, verb: 0.35, echo: 0.3, gain: 1.9 }, bass: {}, kick: {}, snare: { verb: 0.15 },
      hat: { pan: 0.3, gain: 2.2 }, vinyl: { gain: 0.6 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, r = p.r;
      if (first) voicing(c, 63).forEach((m, i) => I.epiano(p.ch.keys, t + i * 0.014 + r() * 0.006, m, sd * c.len * 0.92, 0.55 + r() * 0.1));
      if (c.len === 16 && s === 7) voicing(c, 66).slice(1).forEach((m, i) => I.epiano(p.ch.keys, t + i * 0.01, m, sd * 3, 0.35));
      const root = bassOf(c, 36);
      if (first) I.ebass(p.ch.bass, t, root, sd * (c.len === 16 ? 6 : 6), 0.85);
      if (c.len === 16 && s === 7) I.ebass(p.ch.bass, t, root, sd * 2, 0.5);
      if (c.len === 16 && s === 10) I.ebass(p.ch.bass, t, root + (bar % 2 ? 12 : 7), sd * 4, 0.7);
      if (s === 0 || s === 10 || (s === 7 && bar % 2)) I.kick(p.ch.kick, t, s === 7 ? 0.5 : 0.8, { soft: true });
      if (s === 4 || s === 12) I.snare(p.ch.snare, t + 0.018, 0.6, { lofi: true });
      if (s % 2 === 0) I.hat(p.ch.hat, t, [0.55, 0.3, 0.45, 0.3][(s / 2) % 4] + r() * 0.1, { lofi: true });
      if (s === 15 && bar % 4 === 3) I.hat(p.ch.hat, t, 0.25, { lofi: true });
      I.crackle(p.ch.vinyl, t, 0.6, r);
      p.notes(this.mel, bar, s, (m, len) => I.epiano(p.ch.lead, t + 0.01, m, sd * len, 0.75));
    }
  };

  // ---------------------------------------------------------------- Day 2: "Secondhand Bossa"
  const T_BOSSA = {
    name: 'Secondhand Bossa', bpm: 132, bars: 16, amb: 'shop', gain: 0.5,
    ch: changes('Cmaj7 | Cmaj7 | D9 | D9 | Dm7 | G7b9 | Cmaj7 | A7 | Dm7 | G7 | Em7 | A7 | Dm9 | G13 | Cmaj9 | Cmaj9'),
    mel: line(`E5:6 D5:2 E5:4 G5:4 | B4:12 r:4 | A4:2 B4:2 C5:2 D5:2 E5:4 F#5:4 | E5:12 r:4 |
      F5:6 E5:2 D5:4 C5:4 | B4:4 Ab4:4 B4:4 D5:4 | E5:4 G5:4 B5:8 | A5:4 G5:4 E5:4 C#5:4 |
      r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16`),
    vib: line(`r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 |
      r:8 A5:2 F5:2 D5:4 | B5:4 G5:4 F5:8 | r:8 B5:2 G5:2 E5:4 | C#6:4 A5:4 G5:8 |
      F5:2 A5:2 C6:4 D6:8 | B5:4 A5:2 G5:2 F5:8 | E5:16 | r:16`),
    mix: { gtr: { pan: -0.25, verb: 0.2 }, bass: {}, flute: { pan: 0.15, verb: 0.35, echo: 0.15 }, vibes: { pan: 0.25, verb: 0.35, gain: 1.5 },
      rim: { pan: 0.2, verb: 0.15 }, shaker: { pan: 0.4 }, kick: {}, pad: { verb: 0.5 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), r = p.r;
      const stabs = bar % 2 ? [2, 6, 10] : [0, 3, 6, 10, 13];
      if (stabs.includes(s)) voicing(c, 62).forEach((m, i) => I.guitar(p.ch.gtr, t + i * 0.009, m, sd * 2.5, 0.5 + r() * 0.1));
      const root = rootOf(c, 36), fifth = root + 7 > 47 ? root - 5 : root + 7;
      if (s === 0) I.upright(p.ch.bass, t, root, sd * 5.5, 0.85);
      if (s === 6) I.upright(p.ch.bass, t, fifth, sd * 1.5, 0.6);
      if (s === 8) I.upright(p.ch.bass, t, fifth, sd * 5.5, 0.75);
      if (s === 14) I.upright(p.ch.bass, t, root, sd * 1.5, 0.55);
      if ([0, 6, 8, 14].includes(s)) I.kick(p.ch.kick, t, 0.35, { soft: true });
      if ((bar % 2 ? [4, 10] : [0, 6, 12]).includes(s)) I.rim(p.ch.rim, t, 0.55);
      I.shaker(p.ch.shaker, t, s % 4 === 2 ? 0.7 : s % 2 ? 0.25 : 0.45);
      if (bar >= 8 && s === 0) voicing(c, 70).forEach(m => I.pad(p.ch.pad, t, m, sd * 16, 0.35, { cutoff: 1600 }));
      p.notes(this.mel, bar, s, (m, len) => I.flute(p.ch.flute, t, m, sd * len * 0.92, 0.75));
      p.notes(this.vib, bar, s, (m, len) => I.vibes(p.ch.vibes, t, m, sd * len, 0.75));
    }
  };

  // ---------------------------------------------------------------- Day 3: "Harbor Shuffle" (jazz blues)
  const BLUES = 'F7 | Bb7 | F7 | F7 | Bb7 | Bb7 | F7 | D7 | Gm7 | C7 | F7 | C7';
  const HEAD = `F5:2 A5:2 C6:4 A5:2 F5:6 | Ab5:4 F5:2 D5:2 F5:8 | C5:2 D5:2 F5:2 A5:2 G5:2 F5:2 D5:4 | Eb5:4 C5:4 r:8 |
    D5:2 F5:2 Ab5:4 Bb5:2 Ab5:6 | F5:4 D5:4 Bb4:8 | A4:2 C5:2 F5:4 E5:2 F5:6 | F#5:4 A5:4 C6:8 |
    Bb5:4 A5:2 G5:2 F5:4 D5:4 | E5:4 G5:4 Bb5:8 | A5:6 G5:2 F5:8 | r:16`;
  const T_SHUFFLE = {
    name: 'Harbor Shuffle', bpm: 120, bars: 24, swing: 0.62, amb: 'shop', gain: 0.57,
    ch: changes(BLUES + ' | ' + BLUES),
    head: line(HEAD),
    mix: { bass: {}, comp: { pan: -0.2, verb: 0.25 }, vibes: { pan: 0.2, verb: 0.35 }, horn: { pan: 0.1, verb: 0.35, echo: 0.1 },
      ride: { pan: 0.35, verb: 0.15, gain: 2 }, hat: { pan: 0.3 }, kick: {}, snare: { verb: 0.2, gain: 2 } },
    walk(bar, beat) {
      const c = chordAt(this.ch, bar, 0), n = chordAt(this.ch, bar + 1, 0), root = rootOf(c, 36);
      const third = root + c.iv[1], fifth = root + 7, six = root + 9, target = rootOf(n, 36);
      if (beat === 0) return root;
      if (beat === 1) return bar % 2 ? third : root + 2;
      if (beat === 2) return bar % 2 ? fifth : third;
      return target + (bar % 3 === 0 ? 1 : -1) === fifth ? six : target + (bar % 3 === 0 ? 1 : -1);
    },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), chorus2 = bar >= 12;
      if (s % 4 === 0) I.upright(p.ch.bass, t, this.walk(bar, s / 4), sd * 3.6, s === 0 ? 0.85 : 0.7);
      const comp = bar % 2 ? [4, 10] : [0, 6];
      if (comp.includes(s)) voicing(c, 63).forEach(m => I.epiano(p.ch.comp, t, m, sd * 1.6, chorus2 ? 0.5 : 0.4));
      if ([0, 4, 6, 8, 12, 14].includes(s)) I.ride(p.ch.ride, t, s % 4 === 2 ? 0.4 : 0.6);
      if (s === 4 || s === 12) I.hat(p.ch.hat, t, 0.35);
      if (s % 4 === 0) I.kick(p.ch.kick, t, 0.18, { soft: true });
      if (s === 14 && bar % 2) I.snare(p.ch.snare, t, 0.15, { lofi: true });
      if (bar === 23 && s >= 8 && s % 2 === 0) I.snare(p.ch.snare, t, 0.35, { lofi: true });
      p.notes(this.head, bar % 12, s, (m, len) => chorus2
        ? I.trumpet(p.ch.horn, t, m - 12, sd * len * 0.9, 0.7)
        : I.vibes(p.ch.vibes, t, m, sd * len, 0.8));
    }
  };

  // ---------------------------------------------------------------- Night: "Closing Time" (noir)
  const T_NIGHT = {
    name: 'Closing Time', bpm: 66, bars: 16, swing: 0.5, amb: 'sea', gain: 0.64,
    ch: changes('Am9 | Am9 | Dm9 | Dm9 | Bm7b5 | E7b9 | Am9 | Fmaj7 E7 | Am9 | Am9 | Dm9 | Dm9 | Bm7b5 | E7b9 | Am9 | Fmaj7 E7'),
    horn: line(`r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 |
      r:4 E5:2 G5:2 A5:8 | B5:4 A5:2 G5:2 E5:8 | r:2 F5:2 A5:2 C6:2 B5:4 A5:4 | G5:4 F5:4 E5:8 |
      D5:4 F5:4 A5:6 G5:2 | G#5:8 F5:4 D5:4 | C5:4 E5:4 B4:8 | A4:8 G#4:8`),
    mix: { keys: { pan: -0.2, verb: 0.45 }, horn: { pan: 0.1, verb: 0.5, echo: 0.15 }, cel: { pan: 0.35, verb: 0.5, echo: 0.3, gain: 1.8 },
      bass: {}, brush: { pan: -0.1, verb: 0.2, gain: 1.3 }, ride: { pan: 0.3, verb: 0.3, gain: 2 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, r = p.r;
      if (first) voicing(c, 60).forEach((m, i) => I.epiano(p.ch.keys, t + i * 0.02, m, sd * c.len * 0.95, 0.5));
      if (c.len === 16 && s === 10) voicing(c, 64).slice(-3).forEach(m => I.epiano(p.ch.keys, t, m, sd * 4, 0.28));
      const root = rootOf(c, 33);
      if (first) I.upright(p.ch.bass, t, root, sd * 7, 0.85);
      if (c.len === 16 && s === 8) I.upright(p.ch.bass, t, root + 7 > 45 ? root - 5 : root + 7, sd * 5, 0.7);
      if (c.len === 16 && s === 14 && bar % 2) I.upright(p.ch.bass, t, rootOf(chordAt(this.ch, bar + 1, 0), 33) + 1, sd * 2, 0.55);
      if (s % 4 === 0) I.brush(p.ch.brush, t, 0.5, sd * 3.5);
      if (s === 4 || s === 12) I.snare(p.ch.brush, t, 0.12, { lofi: true });
      if ([0, 4, 6, 8, 12, 14].includes(s)) I.ride(p.ch.ride, t, s % 4 === 2 ? 0.25 : 0.4);
      if (bar < 8 && bar % 2 === 1 && s === 8) voicing(c, 79).reverse().forEach((m, i) => I.musicbox(p.ch.cel, t + i * sd * 2, m, sd * 2, 0.5));
      p.notes(this.horn, bar, s, (m, len) => I.trumpet(p.ch.horn, t + r() * 0.01, m, sd * len * 0.93, 0.75));
    }
  };

  // ---------------------------------------------------------------- Eerie: "Something in the Stock" (waltz)
  const T_EERIE = {
    name: 'Something in the Stock', bpm: 72, steps: 12, bars: 16, amb: 'sea', gain: 0.9,
    ch: changes('Cm | Ab | Fm | G | Cm | Ab | Fm | G | Cm | Ab | Fm | G | Cm | Ab | Fm | G', 12),
    box: line(`r:12 | r:12 | r:12 | r:12 | r:12 | r:12 | r:12 | r:12 |
      G5:4 C6:4 Eb6:4 | D6:6 C6:2 B5:4 | C6:4 Ab5:4 F5:4 | G5:12 |
      G5:4 C6:4 Eb6:4 | F6:6 Eb6:2 D6:4 | Eb6:4 C6:4 Ab5:4 | B5:8 r:4`, 12),
    mix: { drone: { verb: 0.4 }, low: { verb: 0.5 }, glass: { pan: 0.4, verb: 0.7, echo: 0.3 }, box: { pan: -0.2, verb: 0.6, echo: 0.25 },
      beat: { verb: 0.3 }, fx: { verb: 0.6 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), r = p.r;
      if (bar % 4 === 0 && s === 0) { I.drone(p.ch.drone, t, 36, sd * 48, 0.8); I.drone(p.ch.drone, t, 42, sd * 48, 0.55); }
      if (s === 0) I.strings(p.ch.low, t, rootOf(c, 48), sd * 11, 0.35, { attack: 1.2 });
      if (s === 0 && bar % 2 === 0) I.strings(p.ch.low, t, rootOf(c, 48) + c.iv[1] + 12, sd * 22, 0.25, { attack: 1.5 });
      if (bar % 2 === 1 && s === 6) I.glass(p.ch.glass, t, [84, 85, 90, 91, 86][bar % 5], sd * 10, 0.6);
      if (bar % 4 === 2 && s === 0) I.heartbeat(p.ch.beat, t, 0.8);
      if ((bar === 7 || bar === 15) && s === 0) I.swell(p.ch.fx, t, sd * 12, 0.7);
      p.notes(this.box, bar, s, (m, len) => {
        const drift = (bar - 8) * 7 + (r() - 0.5) * 24;
        I.musicbox(p.ch.box, t + (r() < 0.2 ? sd * 0.4 : 0), m, sd * len, 0.75, { detune: -drift });
      });
    }
  };

  // ---------------------------------------------------------------- Cult: "Hollow Neck" (ritual)
  const T_CULT = {
    name: 'Hollow Neck', bpm: 84, bars: 16, amb: 'sea', gain: 0.56,
    chant: line(`r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 |
      D4:8 Eb4:4 D4:4 | C4:8 D4:8 | F4:6 Eb4:2 D4:4 Eb4:4 | D4:16 |
      A4:8 Bb4:4 A4:4 | G4:4 F4:4 Eb4:8 | F4:4 Eb4:4 D4:4 C4:4 | D4:16`),
    mix: { choir: { verb: 0.6 }, lead: { verb: 0.55, echo: 0.15 }, drone: { verb: 0.3 }, drum: { verb: 0.3 }, toll: { pan: -0.3, verb: 0.7, gain: 2.5 },
      shaker: { pan: 0.35, verb: 0.2, gain: 2 } },
    play(p, bar, s, t) {
      const sd = p.sd, dark = Math.floor(bar / 4) % 2 === 1;
      if (bar % 4 === 0 && s === 0) {
        (dark ? [51, 55, 58] : [50, 57, 62]).forEach(m => I.choir(p.ch.choir, t, m, sd * 62, 0.55));
        I.drone(p.ch.drone, t, 38, sd * 64, 0.7);
        I.toll(p.ch.toll, t, dark ? 63 : 62, sd * 16, 0.7);
      }
      if (s === 0) I.boom(p.ch.drum, t, bar % 2 ? 0.6 : 0.85);
      if (s === 3 || s === 6) I.tom(p.ch.drum, t, 0.55, 80);
      if (s === 10) I.tom(p.ch.drum, t, 0.65, 95);
      if (s === 12 && bar % 2) I.tom(p.ch.drum, t, 0.45, 70);
      if (bar >= 8 && s % 2 === 0) I.shaker(p.ch.shaker, t, s % 4 === 0 ? 0.5 : 0.3);
      p.notes(this.chant, bar, s, (m, len) => { I.choir(p.ch.lead, t, m, sd * len * 0.95, 0.8); I.choir(p.ch.lead, t, m - 12, sd * len * 0.95, 0.5); });
    }
  };

  // ---------------------------------------------------------------- Tension: "Heat"
  const T_TENSION = {
    name: 'Heat', bpm: 112, bars: 8, amb: 'shop', gain: 0.69,
    ch: changes('Em | Em | Cmaj7 | Cmaj7 | Am | Am | B7sus4 | B7'),
    mix: { ost: { pan: -0.2, verb: 0.2, gain: 1.8 }, long: { pan: 0.2, verb: 0.45, gain: 1.3 }, bass: {}, tick: { pan: 0.35, verb: 0.1, gain: 1.3 }, kick: {}, boom: { verb: 0.5 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), v = voicing(c, 64);
      const pat = [0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 1, 0, 2, 1, 3, 2];
      I.strings(p.ch.ost, t, v[pat[s] % v.length], sd * 0.8, s % 4 === 0 ? 0.7 : 0.45, { short: true });
      const root = rootOf(c, 36);
      if (s % 2 === 0) I.synbass(p.ch.bass, t, root, sd * 1.4, s % 8 === 0 ? 0.8 : 0.55);
      if (s % 2 === 0) I.rim(p.ch.tick, t, s % 4 === 0 ? 0.35 : 0.2);
      if (s === 0 || s === 8 || (s === 11 && bar % 2)) I.kick(p.ch.kick, t, 0.75);
      if (bar % 4 === 0 && s === 0) I.boom(p.ch.boom, t, 0.8);
      if ((bar >= 4 || pass % 2) && s === 0 && bar % 2 === 0) voicing(c, 55).forEach(m => I.strings(p.ch.long, t, m, sd * 30, 0.55, { attack: 0.8 }));
      if (pass % 2 && s === 0) I.strings(p.ch.long, t, v[v.length - 1] + 12, sd * 15, 0.4, { attack: 0.5 });
      if (bar === 7 && s === 8) I.swell(p.ch.boom, t, sd * 8, 0.6);
    }
  };

  // ---------------------------------------------------------------- Good ending: "Still Standing"
  const T_ENDING = {
    name: 'Still Standing', bpm: 80, bars: 16, amb: 'shop', gain: 1.25,
    ch: changes('D | A/C# | Bm7 | Gmaj7 | D/F# | Gmaj7 | Em7 | A7sus4 A7 | D | A/C# | Bm7 | Gmaj7 | D/F# | Gmaj7 | Em7 | A7sus4 A7'),
    mel: line(`F#5:4 A5:4 D6:8 | C#6:4 B5:4 A5:8 | B5:6 A5:2 F#5:8 | G5:4 F#5:4 E5:4 D5:4 |
      F#5:6 E5:2 D5:4 F#5:4 | B5:8 A5:4 G5:4 | G5:4 F#5:4 E5:4 B4:4 | C#5:8 E5:8 |
      F#5:4 A5:4 D6:8 | C#6:4 B5:4 A5:8 | B5:6 A5:2 F#5:8 | G5:4 F#5:4 E5:4 D5:4 |
      F#5:6 E5:2 D5:4 F#5:4 | B5:8 A5:4 G5:4 | G5:4 A5:4 B5:4 C#6:4 | D6:16`),
    mix: { piano: { pan: -0.1, verb: 0.35 }, lead: { pan: 0.1, verb: 0.4 }, str: { verb: 0.5 }, bass: {}, kick: {}, rim: { pan: 0.2, verb: 0.2 },
      shaker: { pan: 0.35 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, two = bar >= 8, v = voicing(c, 62);
      if (first) I.piano(p.ch.piano, t, bassOf(c, 38), sd * c.len, 0.6);
      if (s % 2 === 0 && s !== c.at) I.piano(p.ch.piano, t, v[[0, 1, 2, 1, 0, 1, 2, 1][(s / 2) % 8] % v.length], sd * 3, 0.38);
      if (two && first) {
        v.forEach(m => I.strings(p.ch.str, t, m - 12, sd * c.len, 0.45, { attack: 0.5 }));
        I.upright(p.ch.bass, t, bassOf(c, 33), sd * c.len * 0.9, 0.6);
      }
      if (two) {
        if (s === 0 || s === 8) I.kick(p.ch.kick, t, 0.4, { soft: true });
        if (s === 4 || s === 12) I.rim(p.ch.rim, t, 0.4);
        I.shaker(p.ch.shaker, t, s % 4 === 2 ? 0.5 : 0.25);
      }
      p.notes(this.mel, bar, s, (m, len) => two ? I.strings(p.ch.lead, t, m, sd * len * 0.95, 0.75, { attack: 0.08 }) : I.piano(p.ch.lead, t, m, sd * len, 0.75));
    }
  };

  // ---------------------------------------------------------------- Bad ending: "Shuttered"
  const T_LOST = {
    name: 'Shuttered', bpm: 58, bars: 8, amb: 'sea', gain: 1.92,
    ch: changes('Cm | Abmaj7 | Fm7 | G7sus4 G7 | Cm | Abmaj7 | Fm7 | G7sus4 G7'),
    mel: line(`Eb5:8 D5:4 C5:4 | C5:8 Bb4:8 | Ab4:4 C5:4 F5:8 | D5:8 B4:8 |
      Eb5:8 D5:4 C5:4 | C5:8 Bb4:8 | Ab4:4 C5:4 F5:4 Eb5:4 | D5:8 r:8`),
    mix: { piano: { verb: 0.5 }, lead: { verb: 0.55, echo: 0.1 }, str: { verb: 0.6 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, two = bar >= 4;
      if (first) { I.piano(p.ch.piano, t, bassOf(c, 36), sd * c.len, 0.5); voicing(c, 58).forEach((m, i) => I.piano(p.ch.piano, t + 0.03 * i, m, sd * c.len, 0.32)); }
      if (two && first) voicing(c, 62).forEach(m => I.strings(p.ch.str, t, m, sd * c.len, 0.35, { attack: 1 }));
      p.notes(this.mel, bar, s, (m, len) => { I.piano(p.ch.lead, t, m, sd * len, 0.7); if (two) I.piano(p.ch.lead, t + 0.01, m + 12, sd * len, 0.3); });
    }
  };

  // ================================================================ more scenes (the second music pass)
  // Each of these belongs to a kind of scene rather than a single story. docs/AUDIO.md lists where
  // they play; PLACE_MUSIC in js/places.js gives a place its track.

  // ---------------------------------------------------------------- The devil: "The Gentleman's Terms" (tango)
  const T_INFERNAL = {
    name: 'The Gentleman\'s Terms', bpm: 100, bars: 16, amb: null, gain: 0.85,
    ch: changes('Dm | Dm | A7 | A7 | A7 | A7 | Dm | Dm | Gm | Gm | Dm | Dm | Eb7 | A7b9 | Dm | A7'),
    mel: line(`A4:3 A4:1 A4:4 Bb4:4 A4:4 | D5:6 C#5:2 D5:8 | E5:3 E5:1 E5:4 F5:4 E5:4 | C#5:12 r:4 |
      G4:2 A4:2 Bb4:2 C#5:2 E5:4 G5:4 | F5:4 E5:4 D5:4 C#5:4 | D5:12 A4:4 | F4:8 r:8 |
      Bb4:3 Bb4:1 Bb4:4 C5:4 D5:4 | G5:12 F5:2 E5:2 | F5:3 F5:1 F5:4 E5:4 D5:4 | A5:12 r:4 |
      G5:4 F5:4 Eb5:4 Db5:4 | C#5:4 E5:4 G5:4 Bb5:4 | A5:4 F5:4 D5:8 | r:4 E4:4 G4:4 C#5:4`),
    mix: { organ: { pan: -0.2, verb: 0.45 }, bass: { gain: 1.4 }, lead: { pan: 0.15, verb: 0.5, echo: 0.1, gain: 1.6 },
      harp: { pan: 0.35, verb: 0.4, echo: 0.2 }, drone: { verb: 0.5 }, drum: { verb: 0.4 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), v = voicing(c, 60), root = rootOf(c, 38);
      // the marcato: a short, heavy chord on every beat, the first and third leaned on
      if (s % 4 === 0) v.forEach(m => I.organ(p.ch.organ, t, m, sd * (s % 8 === 0 ? 2.2 : 1.2), s % 8 === 0 ? 0.8 : 0.5));
      // habanera bass: root, the fifth pushed early, root
      if (s === 0 || s === 8) I.pizz(p.ch.bass, t, root, sd * 3, 0.9);
      if (s === 6 || s === 14) I.pizz(p.ch.bass, t, root + 7 > 50 ? root - 5 : root + 7, sd * 2, 0.6);
      if (s === 0 && bar % 4 === 0) I.drone(p.ch.drone, t, 38, sd * 64, 0.5);
      if (bar === 12 && s === 0) I.drone(p.ch.drone, t, 44, sd * 16, 0.6); // the tritone, under the Eb
      if (s === 0 || s === 6 || s === 8) I.tom(p.ch.drum, t, s === 0 ? 0.6 : 0.35, 70);
      if (bar === 15 && s === 8) I.swell(p.ch.drum, t, sd * 8, 0.6);
      // a harpsichord-ish arpeggio joins the second time through
      if (pass > 0 && s % 2 === 1) { const a = voicing(c, 76); I.pluck(p.ch.harp, t, a[(s >> 1) % a.length], sd, 0.4); }
      p.notes(this.mel, bar, s, (m, len) => I.strings(p.ch.lead, t, m, sd * len * 0.92, 0.75, { attack: 0.04 }));
    }
  };

  // ---------------------------------------------------------------- The spider nest: "Under the Attic Boards"
  const SKITTER = [76, 77, 76, 75, 76, 79, 76, 75, 76, 77, 74, 75];
  const T_NEST = {
    name: 'Under the Attic Boards', bpm: 92, steps: 12, bars: 16, amb: null, gain: 1.4,
    low: line(`E2:6 F2:6 | E2:6 G2:3 F#2:3 | E2:6 F2:6 | Eb2:12 |
      E2:6 F2:6 | E2:6 Bb2:6 | A2:6 G#2:6 | E2:12 |
      E2:6 F2:6 | E2:6 G2:3 F#2:3 | C3:6 B2:6 | Bb2:12 |
      E2:6 F2:6 | G2:3 F#2:3 F2:3 E2:3 | F2:6 Eb2:6 | E2:12`, 12),
    mix: { skit: { pan: 0.3, verb: 0.35, echo: 0.2, gain: 0.8 }, low: { verb: 0.4, gain: 1.2 }, glass: { pan: -0.35, verb: 0.7 },
      beat: { verb: 0.3 }, choir: { verb: 0.8, gain: 0.7 }, fx: { verb: 0.6 } },
    play(p, bar, s, t) {
      const sd = p.sd, r = p.r, shift = [0, 0, 1, -1, 0, 0, 3, 2][bar % 8];
      // something small and quick, running about in the silk
      if (r() > 0.18) I.pizz(p.ch.skit, t + r() * 0.01, SKITTER[s] + shift, sd, 0.25 + r() * 0.35);
      p.notes(this.low, bar, s, (m, len) => { I.strings(p.ch.low, t, m + 12, sd * len, 0.5, { attack: 0.4 }); I.pizz(p.ch.low, t, m, sd * 2, 0.8); });
      if (bar % 2 === 1 && s === 6) { I.glass(p.ch.glass, t, 88, sd * 12, 0.5); I.glass(p.ch.glass, t, 89, sd * 12, 0.4); }
      // the egg sacs, pulsing
      if (s === 0 && bar % 2 === 0) I.heartbeat(p.ch.beat, t, 0.7);
      // the choir in the nave below, through the plaster
      if (bar >= 8 && bar % 4 === 0 && s === 0) [52, 59, 64].forEach(m => I.choir(p.ch.choir, t, m, sd * 44, 0.35));
      if (bar === 15 && s === 0) I.swell(p.ch.fx, t, sd * 12, 0.6);
    }
  };

  // ---------------------------------------------------------------- The wolf ritual: "The Moon Table"
  const T_MOON = {
    name: 'The Moon Table', bpm: 100, bars: 16, amb: 'sea', gain: 0.51,
    chant: line(`r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 |
      D4:4 F4:4 G4:8 | A4:4 G4:2 F4:2 E4:8 | D4:4 F4:4 G4:4 C5:4 | A4:16 |
      D5:4 C5:4 A4:8 | G4:4 F4:4 E4:8 | F4:4 E4:4 D4:4 C4:4 | D4:16`),
    mix: { drum: { verb: 0.3, gain: 1.1 }, drone: { verb: 0.4 }, howl: { pan: 0.25, verb: 0.8, echo: 0.3 }, howl2: { pan: -0.4, verb: 0.9, echo: 0.2 },
      chant: { verb: 0.55, echo: 0.1 }, shaker: { pan: 0.3, gain: 1.6 } },
    play(p, bar, s, t) {
      const sd = p.sd;
      // 3 + 3 + 4 + 2 + 2 + 2: it leans forward and won't sit still
      if (s === 0) I.boom(p.ch.drum, t, 0.85);
      if (s === 3 || s === 6) I.tom(p.ch.drum, t, 0.6, 85);
      if (s === 10) I.tom(p.ch.drum, t, 0.7, 100);
      if (s === 12 || s === 14) I.tom(p.ch.drum, t, s === 12 ? 0.5 : 0.4, 70);
      if (bar >= 4 && s % 2 === 0) I.shaker(p.ch.shaker, t, s % 4 === 0 ? 0.5 : 0.25);
      if (bar % 4 === 0 && s === 0) { I.drone(p.ch.drone, t, 38, sd * 64, 0.7); I.drone(p.ch.drone, t, 45, sd * 64, 0.45); }
      // the howls, one near and one answering far off
      if (bar % 4 === 3 && s === 0) I.glide(p.ch.howl, t, 67, sd * 14, 0.7, { to: 74, cutoff: 1600, wave: 'sine', wobble: 22 });
      if (bar % 8 === 5 && s === 8) I.glide(p.ch.howl2, t, 69, sd * 12, 0.45, { to: 76, cutoff: 1300, wave: 'sine', wobble: 26 });
      p.notes(this.chant, bar, s, (m, len) => { I.choir(p.ch.chant, t, m, sd * len * 0.95, 0.8); I.choir(p.ch.chant, t, m - 12, sd * len * 0.95, 0.55); });
    }
  };

  // ---------------------------------------------------------------- The deep: "Soundings"
  const T_DEEP = {
    name: 'Soundings', bpm: 60, bars: 16, amb: 'sea', gain: 0.87,
    ch: changes('C#m9 | C#m9 | Amaj7 | Amaj7 | F#m9 | F#m9 | G#7sus4 | G#7sus4 | C#m9 | C#m9 | Amaj7 | D | F#m9 | Bm | G#7sus4 | C#m'),
    mix: { pad: { verb: 0.7 }, drone: { verb: 0.4, gain: 1.2 }, ping: { pan: 0.3, verb: 0.6, echo: 0.6 }, answer: { pan: -0.45, verb: 0.8, echo: 0.3 },
      whale: { pan: -0.15, verb: 0.8, echo: 0.2 }, choir: { verb: 0.8 }, boom: { verb: 0.7 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s);
      if (s === 0 && bar % 2 === 0) voicing(c, 56).forEach(m => I.pad(p.ch.pad, t, m, sd * 30, 0.55, { cutoff: 650, attack: 2 }));
      if (s === 0 && bar % 4 === 0) { I.drone(p.ch.drone, t, 25, sd * 64, 0.9); I.drone(p.ch.drone, t, 37, sd * 64, 0.5); }
      // our line going down, and every so often something down there pings back
      if (s === 0 && bar % 2 === 0) I.sonar(p.ch.ping, t, 88, sd * 4, 0.7);
      if (s === 10 && bar % 4 === 1) I.sonar(p.ch.answer, t, 87, sd * 4, 0.45);
      if (s === 4 && (bar === 5 || bar === 13)) I.glide(p.ch.whale, t, 49, sd * 20, 0.6, { to: 56, cutoff: 700 });
      if (s === 8 && bar === 10) I.glide(p.ch.whale, t, 61, sd * 16, 0.45, { to: 54, cutoff: 900 });
      if (bar >= 8 && bar % 4 === 0 && s === 0) [37, 44, 49].forEach(m => I.choir(p.ch.choir, t, m, sd * 60, 0.4));
      if (s === 0 && (bar === 8 || bar === 14)) I.boom(p.ch.boom, t, 0.6);
    }
  };

  // ---------------------------------------------------------------- The observatory: "The Wrong Star"
  const T_STARS = {
    name: 'The Wrong Star', bpm: 70, bars: 16, amb: null, gain: 0.6,
    ch: changes('Fmaj7 | Fmaj7#11 | Ebmaj7 | Ebmaj7#11 | Dbmaj7 | Dbmaj7#11 | Cm9 | Caug | Amaj7 | Amaj7#11 | Gmaj7 | Gmaj7#11 | Fmaj7 | Dbmaj7 | Bbmaj7 | Caug'),
    mel: line(`r:16 | r:16 | r:16 | r:16 |
      F5:8 G5:8 | C6:12 r:4 | D6:8 Eb6:4 D6:4 | E6:16 |
      C#6:8 D#6:8 | E6:12 r:4 | B5:8 C#6:8 | D6:12 r:4 |
      A5:4 B5:4 C6:8 | F5:8 Ab5:8 | D6:8 A5:8 | G#5:16`),
    mix: { pad: { verb: 0.6 }, arp: { pan: 0.3, verb: 0.6, echo: 0.45 }, glass: { pan: -0.4, verb: 0.8 }, lead: { pan: -0.05, verb: 0.6, echo: 0.25, gain: 1.4 },
      bass: { verb: 0.3 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), v = voicing(c, 78);
      if (s === 0) voicing(c, 60).forEach(m => I.pad(p.ch.pad, t, m, sd * 16, 0.5, { cutoff: 1500, attack: 1 }));
      if (s === 0) I.upright(p.ch.bass, t, rootOf(c, 36), sd * 14, 0.5);
      // the stars: a celesta turning up and down the chord
      const up = [...v, ...v.map(m => m + 12)], walk = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 2, 3];
      I.musicbox(p.ch.arp, t, up[walk[s] % up.length], sd * 2, s % 4 === 0 ? 0.55 : 0.35);
      if (bar % 4 === 1 && s === 8) I.glass(p.ch.glass, t, v[v.length - 1] + 12, sd * 14, 0.45);
      p.notes(this.mel, bar, s, (m, len) => I.theremin(p.ch.lead, t, m - 12, sd * len * 0.97, 0.8));
    }
  };

  // ---------------------------------------------------------------- Room Thirteen: "Room Thirteen"
  // A lounge tune heard through a motel wall, from a room that shouldn't be there. Somewhere
  // past bar 8 one note each bar comes back wrong.
  const T_ROOM13 = {
    name: 'Room Thirteen', bpm: 88, bars: 16, swing: 0.3, amb: null, muffle: 900, lofi: true, gain: 0.44,
    ch: changes('Ebmaj7 | Cm7 | Fm7 | Bb7 | Gm7 | C7b9 | Fm7 | Bb7 | Ebmaj7 | Cm7 | Fm7 | Bb7 | Gm7 | C7b9 | Fm7 | Bb7'),
    mel: line(`G5:6 F5:2 G5:4 Bb5:4 | G5:12 r:4 | Ab5:6 G5:2 Ab5:4 C6:4 | Ab5:12 r:4 |
      Bb5:4 A5:4 G5:4 F5:4 | E5:4 G5:4 Bb5:4 Db6:4 | C6:8 Ab5:8 | F5:16`),
    mix: { keys: { pan: -0.2, verb: 0.3 }, vibes: { pan: 0.2, verb: 0.3 }, bass: {}, brush: { gain: 1.4 },
      ring: { dry: true, verb: 0.6 }, fx: { dry: true, verb: 0.7 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), r = p.r;
      if (s === 0 || s === 10) voicing(c, 62).forEach((m, i) => I.epiano(p.ch.keys, t + i * 0.015, m, sd * (s ? 5 : 9), s ? 0.4 : 0.55));
      if (s === 0) I.upright(p.ch.bass, t, rootOf(c, 36), sd * 7, 0.8);
      if (s === 8) I.upright(p.ch.bass, t, rootOf(c, 36) + 7, sd * 7, 0.65);
      if (s % 4 === 0) I.brush(p.ch.brush, t, 0.5, sd * 3.5);
      p.notes(this.mel, bar % 8, s, (m, len) => {
        const wrong = bar >= 8 && s === 0 && r() < 0.7 ? 1 : 0;
        I.vibes(p.ch.vibes, t, m + wrong, sd * len, 0.8);
      });
      // in this room, not the next one: a thin high ringing that won't go away
      if (bar % 8 === 0 && s === 0) I.glass(p.ch.ring, t, 95, sd * 120, 0.12);
      if (bar % 8 === 7 && s === 0) I.swell(p.ch.fx, t, sd * 16, 0.5);
    }
  };

  // ---------------------------------------------------------------- The Fog Week: "Fog Week"
  const T_FOG = {
    name: 'Fog Week', bpm: 100, steps: 12, bars: 16, amb: 'sea', gain: 1.27,
    ch: changes('Am | G | Am | Em | F | G | Am | Am | C | G | Am | Em | F | G | E | Am', 12),
    mel: line(`E5:4 A4:2 A4:4 B4:2 | D5:4 B4:2 G4:6 | E5:4 A4:2 A4:2 B4:2 C5:2 | B4:12 |
      C5:4 A4:2 F4:4 A4:2 | B4:4 D5:2 G5:6 | E5:4 D5:2 C5:2 B4:2 A4:2 | A4:12 |
      G5:4 E5:2 C5:4 E5:2 | D5:4 B4:2 G4:6 | A4:4 C5:2 E5:4 F#5:2 | G5:12 |
      F5:4 E5:2 C5:4 A4:2 | B4:4 C5:2 D5:6 | E5:4 G#4:2 B4:6 | A4:12`, 12),
    mix: { pad: { verb: 0.7 }, reed: { pan: -0.1, verb: 0.75, echo: 0.35, gain: 0.9 }, whistle: { pan: 0.15, verb: 0.8, echo: 0.4 },
      buoy: { pan: -0.3, verb: 0.8, gain: 2 }, glass: { verb: 0.8 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s);
      if (s === 0) voicing(c, 57).forEach(m => I.pad(p.ch.pad, t, m, sd * 12, 0.5, { cutoff: 700, attack: 1.2 }));
      if (s === 0) I.pad(p.ch.pad, t, rootOf(c, 33), sd * 12, 0.6, { cutoff: 400, attack: 0.8 });
      // the bell buoy rocks when it likes, not on the beat
      if ((bar * 7 + s) % 29 === 0 || (bar % 5 === 2 && s === 5)) I.toll(p.ch.buoy, t, [69, 68, 69, 71][bar % 4], sd * 12, 0.5);
      if (bar % 4 === 3 && s === 6) I.glass(p.ch.glass, t, 81, sd * 16, 0.4);
      // a concertina somewhere in the fog plays the old tune; after it, someone whistles it
      p.notes(this.mel, bar, s, (m, len) => (bar < 8) !== (pass % 2 === 1)
        ? I.reed(p.ch.reed, t, m - 12, sd * len * 0.95, 0.6)
        : I.flute(p.ch.whistle, t, m, sd * len * 0.95, 0.55));
    }
  };

  // ---------------------------------------------------------------- Heists and cons: "Light Fingers"
  const T_CAPER = {
    name: 'Light Fingers', bpm: 126, bars: 16, swing: 0.55, amb: null, gain: 0.55,
    ch: changes('Fm6 | Fm6 | Db7 | C7 | Fm6 | Fm6 | Gm7b5 C7 | Fm6 | Bbm7 | Eb7 | Abmaj7 | Dbmaj7 | Gm7b5 | C7 | Fm6 | C7'),
    mel: line(`r:2 C5:1 r:1 F5:2 Ab5:2 G5:2 F5:2 r:4 | r:2 C5:1 r:1 F5:2 Ab5:2 C6:4 D6:2 r:2 | B5:4 Ab5:4 F5:4 Eb5:4 | E5:8 G5:4 r:4 |
      r:2 C5:1 r:1 F5:2 Ab5:2 G5:2 F5:2 r:4 | r:2 C5:1 r:1 F5:2 Ab5:2 Db6:4 C6:4 | Bb5:4 Ab5:4 G5:4 E5:4 | F5:8 r:8 |
      Db5:2 F5:2 Ab5:2 Bb5:2 r:8 | Db6:4 Bb5:2 G5:2 r:8 | C5:2 Eb5:2 G5:2 Ab5:2 r:8 | C6:4 Ab5:2 F5:2 r:8 |
      Bb5:4 Db6:4 C6:4 Bb5:4 | Bb5:2 G5:2 E5:4 C5:8 | r:2 C5:1 r:1 F5:2 Ab5:2 G5:2 F5:2 r:4 | G4:4 Bb4:4 Db5:4 E5:4`),
    mix: { bass: { gain: 1.1 }, horn: { pan: 0.1, verb: 0.35, echo: 0.1 }, flute: { pan: -0.25, verb: 0.4 }, vibes: { pan: 0.3, verb: 0.35, gain: 1.3 },
      rim: { pan: -0.2, verb: 0.2 }, hat: { pan: 0.3 }, kick: {} },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), root = rootOf(c, 36);
      // tiptoeing bass: short eighths
      if (s % 2 === 0) I.upright(p.ch.bass, t, root + [0, 7, 12, 7, 0, 7, 9, 7][s / 2], sd * 1.1, s % 4 === 0 ? 0.85 : 0.6);
      if ((bar % 2 ? [6, 14] : [2, 10]).includes(s)) voicing(c, 66).forEach(m => I.vibes(p.ch.vibes, t, m, sd * 1.5, 0.45));
      if (s === 4 || s === 12) I.rim(p.ch.rim, t, 0.5);
      if (s % 4 === 2) I.hat(p.ch.hat, t, 0.4);
      if (s === 0) I.kick(p.ch.kick, t, 0.35, { soft: true });
      p.notes(this.mel, bar, s, (m, len) => {
        I.trumpet(p.ch.horn, t, m - 12, sd * len * 0.85, 0.7);
        if (pass % 2 === 1) I.flute(p.ch.flute, t, m, sd * len * 0.85, 0.5);
      });
    }
  };

  // ---------------------------------------------------------------- Town dances and fairs: "Grange Hall Reel"
  const T_REEL = {
    name: 'Grange Hall Reel', bpm: 112, bars: 16, swing: 0.12, swing16: true, amb: 'shop', gain: 0.73,
    ch: changes('G | G | C | D | G | G | C D | G | Em | Em | C | D | Em | C | D | G'),
    mel: line(`G5:2 B5:2 D6:2 B5:2 G5:2 B5:2 D5:2 G5:2 | A5:2 B5:2 A5:2 G5:2 E5:2 D5:2 B4:2 D5:2 |
      E5:2 G5:2 E5:2 C5:2 E5:2 G5:2 C6:2 B5:2 | A5:2 F#5:2 D5:2 F#5:2 A5:4 F#5:2 A5:2 |
      G5:2 B5:2 D6:2 B5:2 G5:2 B5:2 D5:2 G5:2 | A5:2 B5:2 A5:2 G5:2 E5:2 G5:2 B5:2 D6:2 |
      E6:2 D6:2 C6:2 B5:2 A5:2 F#5:2 D5:2 F#5:2 | G5:4 B4:2 D5:2 G5:8 |
      E6:4 B5:2 E6:2 G6:2 E6:2 B5:2 G5:2 | E5:2 G5:2 B5:2 E6:2 D6:2 B5:2 A5:2 G5:2 |
      C6:4 G5:2 C6:2 E6:2 C6:2 G5:2 E5:2 | D5:2 F#5:2 A5:2 D6:2 C6:2 A5:2 F#5:2 D5:2 |
      E5:2 G5:2 B5:2 G5:2 E6:2 B5:2 G5:2 B5:2 | C6:2 B5:2 A5:2 G5:2 E5:2 G5:2 C6:2 E6:2 |
      D6:2 C6:2 B5:2 A5:2 F#5:2 A5:2 D5:2 F#5:2 | G5:4 D5:2 B4:2 G4:8`),
    mix: { fiddle: { pan: 0.15, verb: 0.3, gain: 1.2 }, whistle: { pan: -0.3, verb: 0.35, gain: 0.8 }, piano: { pan: -0.15, verb: 0.25 },
      bass: {}, stomp: { verb: 0.25 }, shaker: { pan: 0.35 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at;
      // piano boom-chuck: bass on the beat, the chord on the off
      if (s % 8 === 0 || first) I.piano(p.ch.piano, t, s % 16 === 8 ? rootOf(c, 36) + 7 : bassOf(c, 36), sd * 3, 0.7);
      if (s % 8 === 4) voicing(c, 60).forEach(m => I.piano(p.ch.piano, t, m, sd * 2, 0.45));
      if (s % 8 === 0) I.upright(p.ch.bass, t, s === 8 ? rootOf(c, 36) + 7 : rootOf(c, 36), sd * 3, 0.7);
      // feet on the floorboards
      if (s % 4 === 0) I.kick(p.ch.stomp, t, s % 8 === 0 ? 0.55 : 0.35, { soft: true });
      if (s % 4 === 2) I.shaker(p.ch.shaker, t, 0.45);
      if (bar === 15 && s >= 8 && s % 2 === 0) I.tom(p.ch.stomp, t, 0.4, 120);
      p.notes(this.mel, bar, s, (m, len) => {
        I.fiddle(p.ch.fiddle, t, m, sd * len * 0.9, s % 4 === 0 ? 0.8 : 0.6);
        if (pass % 2 === 1) I.flute(p.ch.whistle, t, m + 12, sd * len * 0.8, 0.45);
      });
    }
  };

  // ---------------------------------------------------------------- Winter days: "First Ice" (jazz waltz)
  const T_WINTER = {
    name: 'First Ice', bpm: 132, steps: 12, bars: 16, swing: 0.2, amb: 'shop', gain: 0.9,
    ch: changes('Bbmaj7 | Gm7 | Cm7 | F7 | Dm7 | Gm7 | Ebmaj7 | F7sus4 | Bbmaj7 | Bb7 | Ebmaj7 | Ebm6 | Dm7 | G7 | Cm7 F7 | Bbmaj9', 12),
    mel: line(`D5:4 F5:4 A5:4 | Bb5:8 A5:4 | G5:4 Eb5:4 C5:4 | A4:8 C5:4 |
      F5:4 A5:4 C6:4 | D6:8 Bb5:4 | G5:4 Bb5:4 D6:4 | C6:12 |
      D6:4 C6:4 Bb5:4 | Ab5:8 F5:4 | G5:4 Bb5:4 Eb6:4 | Gb5:8 Eb5:4 |
      F5:4 A5:4 D6:4 | B5:8 G5:4 | Eb5:6 A4:6 | Bb4:12`, 12),
    mix: { piano: { pan: -0.15, verb: 0.4 }, lead: { pan: 0.05, verb: 0.4 }, box: { pan: 0.35, verb: 0.55, echo: 0.25 }, bass: {},
      brush: { pan: -0.1, gain: 1.2 }, bells: { pan: 0.4, verb: 0.3 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at;
      if (first) I.upright(p.ch.bass, t, bassOf(c, 36), sd * 3.5, 0.8);
      if (s === 8 && c.len === 12) I.upright(p.ch.bass, t, rootOf(c, 36) + 7, sd * 3.5, 0.55);
      if (s === 4 || s === 8 || (c.len === 6 && s === 10)) voicing(c, 62).forEach((m, i) => I.piano(p.ch.piano, t + i * 0.01, m, sd * 3, 0.4));
      if (s % 4 === 0) I.brush(p.ch.brush, t, s === 0 ? 0.45 : 0.3, sd * 3);
      // sleigh bells, a long way off
      if (s % 2 === 0) I.hat(p.ch.bells, t, s % 4 === 0 ? 0.35 : 0.2, { open: s === 0 });
      if (s === 0 && bar % 2 === 0) I.bell(p.ch.bells, t, 96, sd * 2, 0.25);
      p.notes(this.mel, bar, s, (m, len) => {
        I.piano(p.ch.lead, t, m, sd * len, 0.7);
        if (bar >= 8 || pass > 0) I.musicbox(p.ch.box, t, m + 12, sd * len, 0.45);
      });
    }
  };

  // ---------------------------------------------------------------- Staying open late: "After Five"
  const T_DUSK = {
    name: 'After Five', bpm: 70, bars: 16, swing: 0.25, swing16: true, lofi: true, amb: 'shop', gain: 0.48,
    ch: changes('Dbmaj9 | Dbmaj9 | Bbm9 | Bbm9 | Gbmaj9 | Fm7 | Ebm9 | Ab9sus4 | Dbmaj9 | Dbmaj9 | Bbm9 | Bbm9 | Gbmaj9 | Fm7 | Ebm9 | Ab9sus4'),
    mel: line(`r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 |
      r:4 F5:4 Ab5:4 C6:4 | Eb6:8 C6:4 Ab5:4 | Db6:8 C6:4 Bb5:4 | F5:12 r:4 |
      Bb5:4 Db6:4 F6:8 | Eb6:4 C6:4 Ab5:8 | Gb5:4 Bb5:4 Db6:4 F6:4 | Eb6:12 r:4`),
    mix: { keys: { pan: -0.15, verb: 0.4 }, vibes: { pan: 0.2, verb: 0.45, echo: 0.2, gain: 1.4 }, bass: {}, kick: {}, snare: { verb: 0.2 },
      hat: { pan: 0.3, gain: 1.8 }, vinyl: { gain: 0.6 } },
    play(p, bar, s, t) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, r = p.r;
      if (first) voicing(c, 62).forEach((m, i) => I.epiano(p.ch.keys, t + i * 0.02 + r() * 0.006, m, sd * c.len * 0.9, 0.5));
      if (c.len === 16 && s === 10) voicing(c, 66).slice(-2).forEach(m => I.epiano(p.ch.keys, t, m, sd * 4, 0.3));
      if (first) I.upright(p.ch.bass, t, rootOf(c, 33), sd * 8, 0.8);
      if (s === 10) I.upright(p.ch.bass, t, rootOf(c, 33) + 7, sd * 5, 0.55);
      if (s === 0 || s === 9) I.kick(p.ch.kick, t, 0.6, { soft: true });
      if (s === 8) I.snare(p.ch.snare, t + 0.02, 0.4, { lofi: true });
      if (s % 2 === 0) I.hat(p.ch.hat, t, s % 4 === 0 ? 0.4 : 0.22, { lofi: true });
      I.crackle(p.ch.vinyl, t, 0.5, r);
      p.notes(this.mel, bar, s, (m, len) => I.vibes(p.ch.vibes, t, m, sd * len, 0.75));
    }
  };

  // ---------------------------------------------------------------- Tender moments: "Keepsakes"
  const T_TENDER = {
    name: 'Keepsakes', bpm: 72, bars: 16, amb: 'shop', gain: 1.9,
    ch: changes('G | D/F# | Em7 | Cmaj7 | G/B | Am7 | D7sus4 | D7 | Em | C | G | D/F# | Em7 | Am7 | Cmaj7 D7sus4 | G'),
    mel: line(`B4:4 D5:4 G5:8 | F#5:4 E5:4 D5:8 | E5:6 D5:2 B4:8 | C5:4 B4:4 G4:8 |
      D5:4 G5:4 B5:8 | A5:4 G5:4 E5:8 | G5:8 A5:8 | F#5:12 r:4 |
      G5:4 B5:4 E6:8 | E6:4 D6:4 C6:8 | B5:6 A5:2 G5:8 | A5:4 F#5:4 D5:8 |
      E5:4 G5:4 B5:8 | C6:4 B5:4 A5:8 | G5:8 A5:8 | G5:16`),
    mix: { piano: { pan: -0.1, verb: 0.45 }, lead: { pan: 0.05, verb: 0.45 }, cello: { pan: 0.2, verb: 0.5 }, flute: { pan: 0.25, verb: 0.5, echo: 0.15 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), first = s === c.at, v = voicing(c, 60);
      if (first) I.piano(p.ch.piano, t, bassOf(c, 36), sd * c.len, 0.55);
      if (s % 4 === 2) I.piano(p.ch.piano, t, v[(s >> 2) % v.length], sd * 4, 0.3);
      if (bar >= 8 && first) I.strings(p.ch.cello, t, bassOf(c, 48), sd * c.len, 0.45, { attack: 0.6 });
      p.notes(this.mel, bar, s, (m, len) => {
        I.piano(p.ch.lead, t, m, sd * len, 0.7);
        if (pass % 2 === 1 && bar >= 8) I.flute(p.ch.flute, t, m, sd * len * 0.95, 0.45);
      });
    }
  };

  // ---------------------------------------------------------------- Out on the water by day: "Slack Water"
  const T_SEA = {
    name: 'Slack Water', bpm: 110, steps: 12, bars: 16, amb: 'sea', gain: 0.77,
    ch: changes('D | D | G | D | D | Bm | E7 | A7 | D | G | D | Bm | G | A | D | A7', 12),
    mel: line(`A4:4 D5:2 F#5:4 E5:2 | D5:4 A4:2 A4:6 | B4:4 D5:2 G5:4 F#5:2 | F#5:4 E5:2 D5:6 |
      A4:4 D5:2 F#5:4 A5:2 | B5:4 A5:2 F#5:6 | G#5:4 F#5:2 E5:4 D5:2 | E5:12 |
      F#5:4 A5:2 D6:4 A5:2 | B5:4 G5:2 D5:6 | A5:4 F#5:2 D5:4 F#5:2 | B4:4 D5:2 F#5:6 |
      G5:4 F#5:2 E5:4 D5:2 | C#5:4 E5:2 A5:6 | F#5:4 E5:2 D5:4 E5:2 | E5:6 C#5:6`, 12),
    mix: { reed: { pan: -0.15, verb: 0.35, echo: 0.1 }, gtr: { pan: 0.3, verb: 0.25 }, bass: {}, drum: { verb: 0.25 }, shaker: { pan: -0.35 },
      whistle: { pan: 0.2, verb: 0.4 } },
    play(p, bar, s, t, pass) {
      const sd = p.sd, c = chordAt(this.ch, bar, s), v = voicing(c, 60), root = rootOf(c, 38);
      if (s === 0) I.upright(p.ch.bass, t, root, sd * 5, 0.85);
      if (s === 6) I.upright(p.ch.bass, t, root + 7 > 50 ? root - 5 : root + 7, sd * 5, 0.65);
      if (s % 2 === 0) I.guitar(p.ch.gtr, t, [...v, v[0] + 12][[0, 1, 2, 3, 2, 1][s / 2]], sd * 3, s % 6 === 0 ? 0.6 : 0.4);
      if (s === 0 || s === 6) I.tom(p.ch.drum, t, s ? 0.3 : 0.45, 110);
      if (s % 2 === 0 && bar >= 4) I.shaker(p.ch.shaker, t, s % 6 === 0 ? 0.45 : 0.25);
      p.notes(this.mel, bar, s, (m, len) => pass % 2 === 1 && bar >= 8
        ? I.flute(p.ch.whistle, t, m + 12, sd * len * 0.9, 0.5)
        : I.reed(p.ch.reed, t, m, sd * len * 0.92, 0.65));
    }
  };

  const TRACKS = {
    title: T_TITLE, day: T_DAY, bossa: T_BOSSA, shuffle: T_SHUFFLE, night: T_NIGHT,
    eerie: T_EERIE, cult: T_CULT, tension: T_TENSION, ending: T_ENDING, lost: T_LOST,
    infernal: T_INFERNAL, nest: T_NEST, moon: T_MOON, deep: T_DEEP, stars: T_STARS, room13: T_ROOM13,
    fog: T_FOG, caper: T_CAPER, reel: T_REEL, winter: T_WINTER, dusk: T_DUSK, tender: T_TENDER, sea: T_SEA
  };
  // Daytime tracks rotate by day so the week doesn't loop one tune. Each season has its own
  // rotation; Sound.season picks one (js/audio.js). A season not listed uses autumn's.
  const ROTATIONS = {
    autumn: ['day', 'bossa', 'shuffle'],
    winter: ['winter', 'day', 'shuffle'],
    spring: ['day', 'bossa', 'sea']
  };
  const DAY_ROTATION = ROTATIONS.autumn;

  // ================================================================ mixer and player
  // Shared effects: a plate-like reverb (generated impulse) and a tempo-synced echo, then a
  // gentle compressor so all the tracks sit at a similar level.
  function makeFx(c, out) {
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    comp.connect(out);
    const conv = c.createConvolver();
    const len = Math.floor(c.sampleRate * 2.6), ir = c.createBuffer(2, len, c.sampleRate), r = rng(7);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch); let lp = 0;
      for (let i = 0; i < len; i++) {
        const k = i / len;
        lp += ((r() * 2 - 1) - lp) * (0.55 - 0.4 * k); // darker as it decays
        d[i] = i < c.sampleRate * 0.012 ? 0 : lp * Math.pow(1 - k, 3.2);
      }
    }
    conv.buffer = ir;
    const verbIn = c.createGain(), verbOut = c.createGain();
    verbOut.gain.value = 0.55;
    verbIn.connect(conv); conv.connect(verbOut); verbOut.connect(comp);
    const echoIn = c.createGain(), delay = c.createDelay(2), fb = c.createGain(), elp = filt(c, 'lowpass', 2600, 0.5, fb), echoOut = c.createGain();
    fb.gain.value = 0.33; echoOut.gain.value = 0.6;
    echoIn.connect(delay); delay.connect(elp); fb.connect(delay); elp.connect(echoOut); echoOut.connect(comp); echoOut.connect(verbIn);
    return {
      comp, verbIn, echoIn,
      tempo(bpm, t) { delay.delayTime.setValueAtTime(60 / bpm * 0.75, t); }
    };
  }

  // One playing track: its own fader, channel strips and step counter.
  function session(c, T, fx, t0, fadeIn) {
    const steps = T.steps || 16, sd = 60 / T.bpm / 4;
    const fader = c.createGain();
    fader.gain.setValueAtTime(fadeIn ? 0 : T.gain, t0 - 0.01);
    if (fadeIn) fader.gain.linearRampToValueAtTime(T.gain, t0 + 1.2);
    fader.connect(fx.comp);
    let bus = fader;
    if (T.lofi) {
      // Darker top and a soft tape-style saturation.
      const shaper = c.createWaveShaper(), curve = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6); }
      shaper.curve = curve; shaper.connect(fader);
      bus = filt(c, 'lowpass', 4200, 0.4, shaper);
    }
    // Heard through a wall: everything but the `dry` channels goes through a low-pass.
    if (T.muffle) bus = filt(c, 'lowpass', T.muffle, 0.9, bus);
    const ch = {};
    for (const [name, m] of Object.entries(T.mix)) {
      const inp = c.createGain(); inp.gain.value = m.gain ?? 1;
      const pan = c.createStereoPanner ? c.createStereoPanner() : null;
      const to = m.dry ? fader : bus;
      if (pan) { pan.pan.value = m.pan || 0; inp.connect(pan); pan.connect(to); } else inp.connect(to);
      if (m.verb) { const s = c.createGain(); s.gain.value = m.verb; inp.connect(s); s.connect(fx.verbIn); }
      if (m.echo) { const s = c.createGain(); s.gain.value = m.echo; inp.connect(s); s.connect(fx.echoIn); }
      ch[name] = inp;
    }
    fx.tempo(T.bpm, t0);
    const r = rng(T.bpm * 31 + T.bars);
    const p = {
      ch, sd, r,
      notes(bars, bar, s, fn) { for (const [ms, m, len] of bars[bar % bars.length] || []) if (ms === s) fn(m, len); }
    };
    let step = 0, next = t0;
    const loopFrom = T.loopFrom || 0;
    return {
      fader,
      fill(until) {
        while (next < until) {
          const n = Math.floor(step / steps);
          const bar = n < T.bars ? n : loopFrom + (n - loopFrom) % (T.bars - loopFrom);
          const pass = n < T.bars ? 0 : 1 + Math.floor((n - T.bars) / (T.bars - loopFrom));
          const s = step % steps;
          const off = T.swing ? (T.swing16 ? s % 2 === 1 : s % 4 === 2) : false;
          T.play(p, bar, s, next + (off ? T.swing * sd : 0), pass);
          next += sd; step++;
        }
      }
    };
  }

  function createPlayer(c, out) {
    const fx = makeFx(c, out);
    let cur = null, timer = null;
    return {
      start(id) {
        const t = c.currentTime;
        if (cur) { const f = cur.fader; f.gain.cancelScheduledValues(t); f.gain.setValueAtTime(f.gain.value, t); f.gain.linearRampToValueAtTime(0, t + 1.2); setTimeout(() => f.disconnect(), 6000); }
        cur = null; clearInterval(timer); timer = null;
        const T = TRACKS[id];
        if (!T) return;
        const s = cur = session(c, T, fx, t + 0.15, true);
        const tick = () => s.fill(c.currentTime + 0.3);
        tick(); timer = setInterval(tick, 60);
      }
    };
  }

  // Schedule `seconds` of a track into an OfflineAudioContext (tests and previews).
  function render(c, id, seconds) {
    const fx = makeFx(c, c.destination);
    session(c, TRACKS[id], fx, 0.05, false).fill(seconds);
  }

  return { TRACKS, DAY_ROTATION, ROTATIONS, createPlayer, render, _theory: { nn, line, chord, changes, voicing } };
})();
