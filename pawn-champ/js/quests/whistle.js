// Pawn Champ - The Bosun's Whistle: the code half of js/stories/whistle.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

const whistlePrice = it => Math.max(1, Math.round(it.guide * 0.3)); // what Ormsby pipes you down to

storyHooks('whistle', {
  // the dearest thing on your shelves that's for sale, as "pick", and his price for it, as "price"
  dearest(ctx) {
    const pick = S.stock.filter(x => !x.questKey && !x.nosale).sort((x, y) => y.guide - x.guide)[0] || null;
    ctx.vars.pick = pick;
    ctx.vars.price = pick ? money(whistlePrice(pick)) : null;
  },
  // he pays his price
  paid(ctx) { const it = ctx.vars.pick; change('coin', whistlePrice(it), `Sold the ${it.name.toLowerCase()} to Odell Ormsby`); }
});
