// Pawn Champ - The Marsh Honey: the code half of js/stories/honey.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its place is drawn in js/places/marsh.js.
'use strict';

storyHooks('honey', {
  // the afternoon goes round three times: one of them (realAt, 0 to 2) exactly as it was, the other
  // two each with one thing different. with: { real: {...}, odd: [{ one field }, ...] }
  goRound(ctx, w) {
    const realAt = Math.floor(Math.random() * 3);
    const odd = w.odd.slice().sort(() => Math.random() - 0.5);
    const rounds = [0, 1, 2].map(n => n === realAt ? w.real : { ...w.real, ...odd.pop() });
    Object.assign(ctx.vars, { realAt, r1: rounds[0], r2: rounds[1], r3: rounds[2] });
  },
  carryingPhoto: () => carrying('photo'),
  carryingTime: () => carrying('time')
});
