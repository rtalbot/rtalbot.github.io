// Pawn Champ - High Score: the code half of js/stories/highscore.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its place is drawn in js/places/arcade.js.
'use strict';

// the game: three waves, and each one tells you what's coming. ok is the right answer: 0 swerve
// left, 1 fire, 2 swerve right.
const BLASTER = [
  { cue: 'A seagull dives from the left!', ok: 0 }, { cue: 'A lobster boat dead ahead, guns blazing!', ok: 1 },
  { cue: 'A tidal wave rises on the right!', ok: 2 }, { cue: 'The kraken surfaces in front of you!', ok: 1 },
  { cue: 'Two jet-skis come in from the right!', ok: 2 }, { cue: 'The harbormaster\'s launch swerves in from the left!', ok: 0 }];
const blasterBoard = () => S.stock.find(x => x.uniqueId === 'blasterBoard');

storyHooks('highscore', {
  boardHere: () => !!blasterBoard(),
  // what Fontaine pays for the board today: what you paid, and $10
  buyPrice: () => { const it = blasterBoard(); return it ? money(it.paid + 10) : ''; },
  // three waves drawn from BLASTER, as w1, w2 and w3, and no hits yet
  waves(ctx) { const w = shuffle(BLASTER.slice()).slice(0, 3); ctx.vars.w1 = w[0]; ctx.vars.w2 = w[1]; ctx.vars.w3 = w[2]; ctx.vars.hits = 0; },
  // wave n: the answer chosen (as a1, a2, a3) against the right one
  hit(ctx, n) { if (ctx.vars['a' + n] === ctx.vars['w' + n].ok) { ctx.vars.hits++; Sound.good(); } else Sound.bad(); },
  // Fontaine pays for the board (it): with [what you paid and this much more, why]
  paidPlus(ctx, [n, why]) { change('coin', ctx.vars.it.paid + n, why); },
  // or its guide price times this: with [times, why]
  guideTimes(ctx, [x, why]) { change('coin', Math.round(ctx.vars.it.guide * x), why); }
});
