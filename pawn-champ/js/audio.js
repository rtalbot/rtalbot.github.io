// Pawn Champ - music, ambience and sound effects.
//
// Every sound here is synthesised at runtime with the Web Audio API. There are no audio
// files, samples or third-party recordings, so nothing needs a licence. Where each sound
// comes from is written down in docs/AUDIO.md.
//
// Public API (used by the game and by the menu/options screen):
//   Sound.music(track)           a track id from js/soundtrack.js (docs/AUDIO.md lists them) or 'none'.
//                                Crossfades the music and the ambience bed that goes with it.
//   Sound.dayTrack(n)            the daytime track for day number n (they rotate, by Sound.season).
//   Sound.season                 'autumn' (default), 'winter' or 'spring': which daytime rotation plays.
//   Sound.place(track)           the current place's own track, or null. The game calls it whenever
//                                view.bg changes (placeMusic() in js/places.js); quests don't need to.
//   Sound.setVolume(bus, 0..1)   bus is 'master' | 'music' | 'sfx'. Settings in js/menus.js saves them.
//   Sound.getVolume(bus)         current 0..1 value.
//   Sound.on                     false mutes everything (the old on/off toggle).
//   Sound.bell() register() coin() haggle() counter() accept() reject() good() bad() blip() tone()
//   Sound.during(track, fn)      wraps an async story beat so `track` plays for its length.
// What plays: the innermost Sound.during beat, else the place's track, else the last Sound.music.
//   Sound.eerie(fn)              same as Sound.during('eerie', fn).
'use strict';

const Sound = (() => {
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  // Volume sliders are linear 0..1; gains use a squared curve so the slider feels even.
  const curve = v => v * v;
  const TRIM = { music: 2.75, sfx: 4 };

  // Defaults; js/menus.js applies the saved Settings on load.
  const vol = { master: 0.7, music: 0.6, sfx: 0.8 };

  let ctx = null, master = null, musicBus = null, sfxBus = null, noise = null;
  let on = true, mood = 'none', wantMood = 'none';
  const amb = {};           // 'shop' | 'sea' -> gain node
  let carAt = 0;

  // ---------------------------------------------------------------- graph
  function init() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return false; }
    master = ctx.createGain(); master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.connect(master);
    noise = makeNoise(ctx);
    applyVolumes(true);
    buildAmbience();
    player = Soundtrack.createPlayer(ctx, musicBus);
    setInterval(ambTick, 500);
    return true;
  }
  function makeNoise(c) {
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    let seed = 1234567;
    for (let i = 0; i < len; i++) { seed = (seed * 16807) % 2147483647; d[i] = seed / 1073741823.5 - 1; }
    return buf;
  }
  function applyVolumes(now) {
    if (!ctx) return;
    const t = ctx.currentTime, k = now ? 0.001 : 0.05;
    master.gain.setTargetAtTime(on ? curve(vol.master) : 0, t, k);
    musicBus.gain.setTargetAtTime(curve(vol.music) * TRIM.music, t, k);
    sfxBus.gain.setTargetAtTime(curve(vol.sfx) * TRIM.sfx, t, k);
  }
  // Browsers only allow audio after a click or key press.
  function unlock() {
    if (!init()) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (wantMood !== mood) setMood(wantMood);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
  }

  // ---------------------------------------------------------------- instruments
  // Each takes a destination node and an absolute start time, so the same code can render
  // into an OfflineAudioContext for tests and previews.
  function env(c, dest, t, peak, attack, dur, release = 0.05) {
    const gn = c.createGain();
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur + release);
    gn.connect(dest);
    return gn;
  }
  function osc(c, type, freq, t, end, dest, detune = 0) {
    const o = c.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t); o.detune.setValueAtTime(detune, t);
    o.connect(dest); o.start(t); o.stop(end + 0.05);
    return o;
  }
  function noiseHit(dest, t, dur, peak, type, freq, q = 1) {
    const c = dest.context, src = c.createBufferSource(), f = c.createBiquadFilter();
    src.buffer = noise || (noise = makeNoise(c));
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    const gn = env(c, dest, t, peak, 0.003, dur);
    src.connect(f); f.connect(gn);
    src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.1);
    return { src, f, gn };
  }
  const INST = {
    // Soft electric piano: sine body plus a quick bright partial.
    keys(dest, t, m, dur, v = 1) {
      const c = dest.context, f = mtof(m);
      osc(c, 'sine', f, t, t + dur, env(c, dest, t, 0.07 * v, 0.01, dur, 0.3));
      osc(c, 'sine', f * 2, t, t + 0.4, env(c, dest, t, 0.02 * v, 0.005, 0.25));
      osc(c, 'triangle', f, t, t + dur, env(c, dest, t, 0.02 * v, 0.02, dur * 0.6, 0.2), 4);
    },
    // Bell pluck with an inharmonic overtone (gives the "shop bell" shimmer).
    bell(dest, t, m, dur, v = 1) {
      const c = dest.context, f = mtof(m);
      osc(c, 'sine', f, t, t + dur, env(c, dest, t, 0.05 * v, 0.004, dur, 0.4));
      osc(c, 'sine', f * 2.76, t, t + dur * 0.5, env(c, dest, t, 0.015 * v, 0.002, dur * 0.4));
    },
    bass(dest, t, m, dur, v = 1) {
      const c = dest.context, f = mtof(m), lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 500; lp.connect(dest);
      osc(c, 'triangle', f, t, t + dur, env(c, lp, t, 0.12 * v, 0.01, dur, 0.08));
    },
    // Slow detuned saw pad through a low-pass filter.
    pad(dest, t, m, dur, v = 1, cutoff = 900) {
      const c = dest.context, f = mtof(m), lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = cutoff; lp.Q.value = 0.5; lp.connect(dest);
      const gn = env(c, lp, t, 0.025 * v, Math.min(1.2, dur * 0.4), dur * 0.6, 1.2);
      osc(c, 'sawtooth', f, t, t + dur + 1.2, gn, -7);
      osc(c, 'sawtooth', f, t, t + dur + 1.2, gn, 7);
    },
    // Two close sines that beat against each other: glassy and unsettled.
    glass(dest, t, m, dur, v = 1) {
      const c = dest.context, f = mtof(m), gn = env(c, dest, t, 0.03 * v, 0.3, dur, 1.5);
      osc(c, 'sine', f, t, t + dur + 1.5, gn);
      osc(c, 'sine', f * 1.006, t, t + dur + 1.5, gn);
    },
    hat(dest, t, v = 1) { noiseHit(dest, t, 0.035, 0.03 * v, 'highpass', 7000); },
    brush(dest, t, v = 1) { noiseHit(dest, t, 0.12, 0.035 * v, 'bandpass', 2500, 0.8); },
    kick(dest, t, v = 1) {
      const c = dest.context, o = c.createOscillator(), gn = env(c, dest, t, 0.2 * v, 0.003, 0.18);
      o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.15);
      o.connect(gn); o.start(t); o.stop(t + 0.3);
    }
  };

  // ---------------------------------------------------------------- music
  // The tracks and their instruments live in js/soundtrack.js. This file only routes them
  // to the music bus and runs the ambience timer alongside.
  let player = null;
  function ambTick() {
    if (!ctx) return;
    const bed = (Soundtrack.TRACKS[mood] || {}).amb;
    seasonTick(bed);
    if (ctx.currentTime < carAt) return;
    // no gulls on the iced-in harbor in deep winter
    if (bed === 'shop') { (Math.random() < 0.5 || ambSeason() === 'deep' ? passingCar : gull)(ctx.currentTime + 0.1); carAt = ctx.currentTime + 12 + Math.random() * 18; }
    else if (bed === 'sea') { foghorn(ctx.currentTime + 0.1); carAt = ctx.currentTime + 28 + Math.random() * 20; }
  }

  // ---------------------------------------------------------------- ambience
  // Shop: a low room tone (filtered noise), the odd car passing and a gull outside.
  // Sea: low noise swelling on a slow wave and a far-off foghorn, for the harbor at night.
  function loopNoise(filterType, freq, dest) {
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter();
    src.buffer = noise; src.loop = true;
    f.type = filterType; f.frequency.value = freq;
    src.connect(f); f.connect(dest); src.start();
  }
  function buildAmbience() {
    amb.shop = ctx.createGain(); amb.shop.gain.value = 0; amb.shop.connect(sfxBus);
    const room = ctx.createGain(); room.gain.value = 0.02; room.connect(amb.shop);
    loopNoise('lowpass', 220, room);
    amb.sea = ctx.createGain(); amb.sea.gain.value = 0; amb.sea.connect(sfxBus);
    const swell = ctx.createGain(); swell.gain.value = 0.015; swell.connect(amb.sea);
    const lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 0.09; depth.gain.value = 0.013;
    lfo.connect(depth); depth.connect(swell.gain); lfo.start();
    loopNoise('lowpass', 550, swell);
    // March rain on the window: a soft hiss, faded in by seasonTick
    amb.rain = ctx.createGain(); amb.rain.gain.value = 0; amb.rain.connect(amb.shop);
    const hiss = ctx.createGain(); hiss.gain.value = 0.012; hiss.connect(amb.rain);
    loopNoise('highpass', 2500, hiss);
  }
  function passingCar(t) {
    const h = noiseHit(amb.shop, t, 3.5, 0.0001, 'bandpass', 300, 0.7);
    h.gn.gain.cancelScheduledValues(t);
    h.gn.gain.setValueAtTime(0.0001, t);
    h.gn.gain.exponentialRampToValueAtTime(0.02, t + 1.6);
    h.gn.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
    h.f.frequency.setValueAtTime(260, t); h.f.frequency.linearRampToValueAtTime(420, t + 1.6);
    h.f.frequency.linearRampToValueAtTime(220, t + 3.5);
  }

  // A herring gull somewhere down the street: three falling, slightly hoarse cries.
  function gull(t) {
    const c = ctx, bp = c.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 1.2; bp.connect(amb.shop);
    for (let i = 0; i < 3; i++) {
      const s = t + i * 0.32, o = c.createOscillator(), vib = c.createOscillator(), vd = c.createGain();
      const gn = env(c, bp, s, 0.012 - i * 0.003, 0.03, 0.22, 0.08);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1500 - i * 80, s); o.frequency.exponentialRampToValueAtTime(900 - i * 60, s + 0.3);
      vib.frequency.value = 28; vd.gain.value = 40; vib.connect(vd); vd.connect(o.frequency);
      o.connect(gn); o.start(s); o.stop(s + 0.4); vib.start(s); vib.stop(s + 0.4);
    }
  }

  // ---------------------------------------------------------------- the season in the shop
  // From November on (js/seasons.js, docs/SEASONS.md): the radiator ticks; wind from November;
  // Saint Brine's bell in December; the plow going by after dark in deep winter; in March, rain on
  // the glass and the drip into the bucket. October is as it always was.
  let seasAt = 0, dripAt = 0;
  const ambSeason = () => (typeof seasonNow === 'function' ? seasonNow() : 'autumn');
  const afterDark = () => typeof view !== 'undefined' && (view.bg === 'shopNight' || view.timeOfDay > 0.75);
  function seasonTick(bed) {
    const s = ambSeason(), t = ctx.currentTime;
    if (amb.rain) amb.rain.gain.setTargetAtTime(bed === 'shop' && s === 'thaw' ? 1 : 0, t, 1.5);
    if (bed !== 'shop' || s === 'autumn') return;
    if (s === 'thaw' && t >= dripAt) { drip(t + 0.05); dripAt = t + 1.4; }
    if (t < seasAt) return;
    seasAt = t + 7 + Math.random() * 9;
    const r = Math.random();
    if (s !== 'thaw' && r < 0.4) radiatorTick(t + 0.1);
    else if (s !== 'thaw' && r < 0.75) wind(t + 0.1, s === 'deep' ? 1.4 : 1);
    else if (s === 'winter') stBrinesBell(t + 0.1);
    else if (s === 'deep' && afterDark()) plow(t + 0.1);
    else if (s === 'thaw') gull(t + 0.1);
  }
  function radiatorTick(t) {
    for (let i = 0, n = 2 + (Math.random() * 4 | 0); i < n; i++) noiseHit(amb.shop, t + i * (0.18 + Math.random() * 0.3), 0.02, 0.025, 'bandpass', 3200 + Math.random() * 800, 4);
  }
  function wind(t, v) {
    const h = noiseHit(amb.shop, t, 5, 0.0001, 'bandpass', 500, 2);
    h.gn.gain.cancelScheduledValues(t); h.gn.gain.setValueAtTime(0.0001, t);
    h.gn.gain.exponentialRampToValueAtTime(0.018 * v, t + 2); h.gn.gain.exponentialRampToValueAtTime(0.0001, t + 5);
    h.f.frequency.setValueAtTime(380, t); h.f.frequency.linearRampToValueAtTime(720, t + 2.2); h.f.frequency.linearRampToValueAtTime(420, t + 5);
  }
  // Saint Brine's, a few streets away: four slow strokes on a low bell, through the glass
  function stBrinesBell(t) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(amb.shop);
    const quiet = ctx.createGain(); quiet.gain.value = 0.25; quiet.connect(lp);
    for (let i = 0; i < 4; i++) INST.bell(quiet, t + i * 1.6, 55, 1.4, 1);
  }
  // the town plow on Main Street: a low engine and the blade scraping, passing left to right
  function plow(t) {
    const h = noiseHit(amb.shop, t, 6, 0.0001, 'lowpass', 160, 0.7);
    h.gn.gain.cancelScheduledValues(t); h.gn.gain.setValueAtTime(0.0001, t);
    h.gn.gain.exponentialRampToValueAtTime(0.03, t + 2.5); h.gn.gain.exponentialRampToValueAtTime(0.0001, t + 6);
    const sc = noiseHit(amb.shop, t + 1, 4, 0.0001, 'bandpass', 1800, 3);
    sc.gn.gain.cancelScheduledValues(t + 1); sc.gn.gain.setValueAtTime(0.0001, t + 1);
    sc.gn.gain.exponentialRampToValueAtTime(0.008, t + 2.6); sc.gn.gain.exponentialRampToValueAtTime(0.0001, t + 5);
  }
  // one drop into a half-full bucket
  function drip(t) {
    const o = ctx.createOscillator(), gn = env(ctx, amb.shop, t, 0.02, 0.002, 0.08, 0.06);
    o.type = 'sine'; o.frequency.setValueAtTime(1400 + Math.random() * 200, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.08);
    o.connect(gn); o.start(t); o.stop(t + 0.2);
  }

  // A lighthouse foghorn far out in the harbor: one long, low, two-tone blast.
  function foghorn(t) {
    const c = ctx, lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 450; lp.connect(amb.sea);
    const gn = c.createGain();
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.03, t + 0.6);
    gn.gain.setValueAtTime(0.03, t + 2.2); gn.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
    gn.connect(lp);
    osc(c, 'sawtooth', 146, t, t + 3.6, gn); osc(c, 'sawtooth', 110, t + 1.6, t + 3.6, gn, 5);
  }

  // ---------------------------------------------------------------- moods
  // Three layers: `base` from Sound.music, the place's own track, and story beats wrapped in
  // Sound.during (innermost wins). The top one that's set plays.
  let base = 'none', placeT = null, season = 'autumn';
  const beats = [];
  const current = () => (beats.length ? beats[beats.length - 1].track : placeT || base);
  function setMood(m) {
    wantMood = m;
    if (!ctx || m === mood) return;
    const t = ctx.currentTime, bed = (Soundtrack.TRACKS[m] || {}).amb;
    mood = m;
    amb.shop.gain.setTargetAtTime(bed === 'shop' ? 1 : 0, t, 0.8);
    amb.sea.gain.setTargetAtTime(bed === 'sea' ? 1 : 0, t, 0.8);
    carAt = t + 6;
    player.start(m);
  }

  // ---------------------------------------------------------------- sound effects
  const SFX = {
    // Shop door bell: a small bell on a spring, struck twice.
    bell(d, t) { INST.bell(d, t, 88, 0.6, 1.4); INST.bell(d, t + 0.09, 91, 0.5, 1); INST.bell(d, t + 0.2, 88, 0.4, 0.5); },
    // Till: a card-reader beep, the drawer clunk, a latch click, then the "ching".
    register(d, t) {
      osc(d.context, 'square', 1960, t, t + 0.07, env(d.context, d, t, 0.02, 0.003, 0.06));
      t += 0.12;
      noiseHit(d, t, 0.06, 0.25, 'lowpass', 900);
      INST.kick(d, t, 0.4);
      noiseHit(d, t + 0.05, 0.03, 0.12, 'bandpass', 3000, 2);
      INST.bell(d, t + 0.12, 96, 0.5, 1.6); INST.bell(d, t + 0.12, 100, 0.45, 1.1);
    },
    coin(d, t) { INST.bell(d, t, 95, 0.12, 1); INST.bell(d, t + 0.07, 100, 0.25, 1); },
    // Player makes an offer: a pen tap and a questioning two-note rise.
    haggle(d, t) { noiseHit(d, t, 0.02, 0.15, 'highpass', 3000); INST.keys(d, t + 0.03, 67, 0.12, 1.2); INST.keys(d, t + 0.12, 71, 0.18, 1.2); },
    // Customer counters: the same figure falling back.
    counter(d, t) { INST.keys(d, t, 71, 0.12, 1.1); INST.keys(d, t + 0.1, 66, 0.22, 1.1); },
    // Deal struck: a bright rising major arpeggio.
    accept(d, t) { [72, 76, 79, 84].forEach((m, i) => INST.bell(d, t + i * 0.06, m, 0.35, 1.3)); },
    // Deal refused or customer walks: a dull knock and a falling minor third.
    reject(d, t) { INST.kick(d, t, 0.6); INST.keys(d, t + 0.02, 58, 0.18, 1.2); INST.keys(d, t + 0.14, 55, 0.3, 1.2); },
    good(d, t) { INST.keys(d, t, 76, 0.1, 1.3); INST.keys(d, t + 0.1, 81, 0.2, 1.3); },
    bad(d, t) {
      const c = d.context, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 800; lp.connect(d);
      osc(c, 'sawtooth', 180, t, t + 0.25, env(c, lp, t, 0.08, 0.005, 0.25));
    },
    blip(d, t) { osc(d.context, 'square', 420 + Math.random() * 60, t, t + 0.03, env(d.context, d, t, 0.012, 0.003, 0.03)); },
    // Picking a dialogue choice: a soft wooden tick.
    choice(d, t) { noiseHit(d, t, 0.03, 0.12, 'bandpass', 1800, 3); osc(d.context, 'sine', 880, t, t + 0.05, env(d.context, d, t, 0.03, 0.002, 0.04)); },
    // Loupe up to the eye: a lens click, then a clean shimmer (genuine) or a sour cluster (fake).
    loupe(d, t, fake) {
      noiseHit(d, t, 0.02, 0.14, 'highpass', 4000);
      if (fake) { INST.keys(d, t + 0.12, 61, 0.35, 1); INST.keys(d, t + 0.12, 62, 0.35, 1); INST.keys(d, t + 0.18, 55, 0.4, 0.8); }
      else { INST.bell(d, t + 0.1, 91, 0.3, 0.7); INST.bell(d, t + 0.16, 96, 0.4, 0.6); }
    },
    loupeFake(d, t) { SFX.loupe(d, t, true); },
    // A toast slides in: a quiet two-note pop.
    toast(d, t) { INST.bell(d, t, 84, 0.12, 0.45); INST.bell(d, t + 0.05, 89, 0.15, 0.4); },
    // Reputation up: a warm rising fifth. Down: a muttered low pair.
    repUp(d, t) { INST.keys(d, t, 72, 0.15, 0.8); INST.keys(d, t + 0.08, 79, 0.25, 0.8); },
    repDown(d, t) { INST.keys(d, t, 52, 0.15, 0.9); INST.keys(d, t + 0.1, 51, 0.3, 0.9); },
    // Heat rising: a police-radio squelch with a short burst of static.
    heat(d, t) {
      noiseHit(d, t, 0.18, 0.1, 'bandpass', 1400, 1.5);
      osc(d.context, 'square', 1250, t + 0.02, t + 0.06, env(d.context, d, t + 0.02, 0.012, 0.002, 0.04));
    },
    // Cruiser outside: two "whoop" sweeps of a siren, filtered so it sounds down the street.
    siren(d, t) {
      const c = d.context, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(d);
      for (let i = 0; i < 2; i++) {
        const s = t + i * 0.55, o = c.createOscillator(), gn = env(c, lp, s, 0.08, 0.05, 0.4, 0.08);
        o.type = 'sawtooth'; o.frequency.setValueAtTime(500, s); o.frequency.exponentialRampToValueAtTime(1300, s + 0.35);
        o.frequency.exponentialRampToValueAtTime(700, s + 0.5); o.connect(gn); o.start(s); o.stop(s + 0.6);
      }
    },
    // Window smash: a thump, a noise burst and a scatter of glass tinkles.
    smash(d, t) {
      INST.kick(d, t, 0.6);
      noiseHit(d, t, 0.35, 0.1, 'highpass', 2500);
      [0.05, 0.11, 0.16, 0.24, 0.31, 0.42, 0.55].forEach((o, i) => INST.bell(d, t + o, 96 + ((i * 5) % 11), 0.15, 0.5 - i * 0.05));
    },
    // Paper: a ledger or notice opened.
    paper(d, t) { const h = noiseHit(d, t, 0.16, 0.08, 'bandpass', 3500, 0.7); h.f.frequency.linearRampToValueAtTime(5500, t + 0.15); },
    // Rubber stamp on a paid bill.
    stamp(d, t) { INST.kick(d, t, 0.35); noiseHit(d, t, 0.05, 0.2, 'lowpass', 1200); },
    // Knocking at the door at night: three slow knocks on wood.
    knock(d, t) { for (let i = 0; i < 3; i++) { INST.kick(d, t + i * 0.28, 0.7); noiseHit(d, t + i * 0.28, 0.05, 0.12, 'bandpass', 600, 2); } },
    // The roller shutter going up in the morning (rising rattle) or down at closing (falling).
    shutter(d, t, down) {
      const h = noiseHit(d, t, 1.1, 0.0001, 'bandpass', down ? 900 : 400, 1.2);
      h.gn.gain.cancelScheduledValues(t); h.gn.gain.setValueAtTime(0.0001, t);
      h.gn.gain.exponentialRampToValueAtTime(0.07, t + 0.1); h.gn.gain.setValueAtTime(0.07, t + 0.9);
      h.gn.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      h.f.frequency.linearRampToValueAtTime(down ? 400 : 900, t + 1);
      for (let i = 0; i < 14; i++) noiseHit(d, t + 0.05 + i * 0.07, 0.015, 0.05, 'bandpass', 2000, 2);
      INST.kick(d, t + 1.05, 0.5);
    },
    shutterDown(d, t) { SFX.shutter(d, t, true); }
  };
  function play(fn) { if (on && init()) fn(sfxBus, ctx.currentTime); }
  const api = {
    get on() { return on; },
    set on(v) { on = !!v; applyVolumes(); },
    get mood() { return wantMood; },
    // Older single-slider hook: same as the master volume.
    get volume() { return vol.master; },
    set volume(v) { api.setVolume('master', v); },
    // Sound.music inside a Sound.during beat changes that beat's track; outside, it sets the
    // background track and overrides the place's own until the scene changes.
    music(m) {
      if (beats.length) beats[beats.length - 1].track = m;
      else { base = m; placeT = null; }
      setMood(current());
    },
    place(m) { placeT = m || null; setMood(current()); },
    get season() { return season; },
    set season(v) { season = v; },
    // Browsers may still refuse: a controller press doesn't count as a click everywhere.
    unlock,
    getVolume: bus => vol[bus],
    setVolume(bus, v) {
      if (!(bus in vol)) return;
      vol[bus] = Math.max(0, Math.min(1, +v || 0));
      applyVolumes();
    },
    // Wrap an async story beat so a track plays for its length, then the old one returns.
    during(track, fn) {
      return async (...args) => {
        const b = { track }; beats.push(b); setMood(current());
        try { return await fn(...args); } finally { beats.splice(beats.indexOf(b), 1); setMood(current()); }
      };
    },
    eerie(fn) { return api.during('eerie', fn); },
    dayTrack(n) {
      const rot = Soundtrack.ROTATIONS[season] || Soundtrack.ROTATIONS.autumn;
      return rot[(Math.max(1, n) - 1) % rot.length];
    },
    tone(freq, dur, type = 'square', v = 0.04, delay = 0) {
      play((d, t) => { t += delay; osc(d.context, type, freq, t, t + dur, env(d.context, d, t, v, 0.005, dur)); });
    },
    // For tests and previews: render a mood or effect into an OfflineAudioContext destination.
    _render: { SFX, INST, bind(c) { noise = makeNoise(c); } }
  };
  for (const k of Object.keys(SFX)) api[k] = () => play(SFX[k]);
  return api;
})();
