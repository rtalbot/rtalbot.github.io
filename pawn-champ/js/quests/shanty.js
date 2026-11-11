// Pawn Champ - The Shanty Town: the code half of js/stories/shanty.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('shanty', {
  shinerHere: () => S.stock.some(x => x.uniqueId === 'shiner'),
  bevHere: () => townHere('bev'),
  // blue lights on the flats (js/places/shanties.js): { raid }
  shanties(ctx, w) { Object.assign(SHANTY, w); },
  // the standing moment (js/standing.js): a friend who fits it, or else an enemy, by name
  moment(ctx, m) {
    ctx.vars.friend = typeof ally === 'function' ? ally(m) : null;
    ctx.vars.enemy = !ctx.vars.friend && typeof foe === 'function' ? foe(m) : null;
  }
});
