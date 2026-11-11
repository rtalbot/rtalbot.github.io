// Pawn Champ - New Year's Eve at the Anchor: the code half of js/stories/newyear.js (docs/STORY_DATA.md),
// for what the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

// what rings in the New Year: something from your shelves that makes a noise
const nyRinger = it => !it.held && !it.nosale && !it.questKey && (it.cat === 'instrument' || it.icon === 'brassbell' || it.icon === 'shipbell' || it.cat === 'silver');

storyHooks('newyear', {
  findRinger(ctx) { ctx.vars.ringer = S.stock.find(nyRinger) || null; },
  // remembers which item Dee borrowed: with the name it was found as
  lend(ctx, name) { S.flags.nyLent = ctx.vars[name].uid; },
  findLent(ctx) { ctx.vars.lent = S.flags.nyLent ? S.stock.find(x => x.uid === S.flags.nyLent) || null : null; },
  // the Anchor's stage lights: with true or false
  bandstand(ctx, on) { ANCHOR.stage = on; },
  // the night never came: what Dee borrowed is for sale again
  giveBack() { if (S.flags.nyLent) { const it = S.stock.find(x => x.uid === S.flags.nyLent); if (it) it.nosale = false; } }
});
