// Pawn Champ - The Christmas Lights: the code half of js/stories/lights.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

const lightsPrice = () => { const box = S.stock.find(x => x.uniqueId === 'bubbleLights'); return box ? Math.round(box.guide * 2.25) : 0; };
storyHooks('lights', {
  // what Opal Sandeman pays for the bubble lights, and paying it: with the ledger's reason
  opalPrice() { return money(lightsPrice()); },
  payOpal(ctx, why) { change('coin', Math.round(ctx.vars.box.guide * 2.25), why); },
  // the night's test: Nolan borrowed the lights, bought them, or went without
  testNolan() {
    const r = Math.random();
    S.flags.lightsIn = true; S.flags.lightsNolan = r < 0.4 ? 'lent' : r < 0.7 ? 'bought' : null;
    if (r < 0.4) S.stock.push(makeUnique('bubbleLights', { questKey: true, nosale: true }));
  }
});
