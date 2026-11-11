// Pawn Champ - The Night Ferry: the code half of js/stories/nightferry.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and anything drawn.
// Its places are drawn in js/places/ferry.js, js/places/gannet.js.
'use strict';

storyHooks('nightferry', {
  // the man from the launch turns out to be someone you know (with: the actor, named as their character)
  named(ctx, who) { ctx.vars[who].name = CAST[who].name; },
  // one of n, at random, as n
  pickOne(ctx, n) { ctx.vars.n = Math.floor(Math.random() * n); },
  // takes every item in a found list out of stock (with: its name)
  drop(ctx, name) { const list = ctx.vars[name] || []; S.stock = S.stock.filter(x => !list.includes(x)); renderPanel(); },
  // Merrit's envelope goes to the church roof: up to $150, as much as you have (with: the ledger line)
  giveBack(ctx, why) { change('coin', -Math.min(150, Math.max(0, S.coin)), why); },
  // reputation for each thing in a found list: with { each, of, why }
  repEach(ctx, w) { change('rep', w.each * (ctx.vars[w.of] || []).length, w.why); },
  jamHere: () => S.stock.some(x => x.uniqueId === 'nfJam')
});
