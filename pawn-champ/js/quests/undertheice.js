// Pawn Champ - Under the Ice: the code half of js/stories/undertheice.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('undertheice', {
  lampHere: () => S.stock.some(x => x.uniqueId === 'roseLamp'),
  hesterHere: () => townHere('hester'),
  // what Hob's Pond shows (js/places/icepond.js): { lit, boat, toboggan }
  pond(ctx, w) { Object.assign(POND, w); },
  // the standing moment (js/standing.js): a friend who fits it, or else an enemy, by name
  moment(ctx, m) {
    ctx.vars.friend = typeof ally === 'function' ? ally(m) : null;
    ctx.vars.enemy = !ctx.vars.friend && typeof foe === 'function' ? foe(m) : null;
  }
});
