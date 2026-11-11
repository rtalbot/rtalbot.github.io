// Pawn Champ - The Doctor's Cabinet: the code half of js/stories/cabinet.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('cabinet', {
  cabinetHere() { return S.stock.some(x => x.uniqueId === 'specCabinet'); },
  // Dr. Ladd's trust in you, one more
  trust() { S.flags.cabinetTrust = (S.flags.cabinetTrust || 0) + 1; },
  // the nest's drawing (js/places): with { queen: 0 to 1, stir: true or false }
  nest(ctx, o) { Object.assign(NEST, o); },
  // the cobwebs: one more morning of them
  cobwebs(ctx) { ctx.vars.webs = S.flags.cabinetWebs = (S.flags.cabinetWebs || 0) + 1; },
  // a cobweb over something on the shelves, at random, which takes 15% off it: with the pop-up's line
  webStock(ctx, line) {
    const near = S.stock.filter(x => !x.unique && !x.webbed);
    if (!near.length) return;
    const it = near[Math.floor(Math.random() * near.length)];
    it.webbed = true; it.condLabel = 'Cobwebbed'; it.guide = Math.round(it.guide * 0.85); renderPanel();
    ctx.vars.it = it;
    toast(storyText(line, ctx), null, it.icon);
  },
  // the shop cat (js/secrets.js)
  catGuards() { return catGuards(); },
  catName() { return catName(true); }
});
