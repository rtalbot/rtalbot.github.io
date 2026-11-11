// Pawn Champ - The Thing in Dory's Freezer: the code half of js/stories/freezer.js
// (docs/STORY_DATA.md), for what the data can't say: the hooks it calls by name.
'use strict';

// what each buyer pays for the thing, and what you'd make as the broker (10%); the long arc
// (js/quests/freezerarc.js) reads this too
const FREEZER_BUYERS = {
  pomfret: { who: 'pomfret', price: 400, label: 'Dr. Pomfret, $400' },
  sandoval: { who: 'sandoval', price: 600, label: 'Kit Sandoval, $600' },
  lab: { who: 'achebe', price: 150, label: 'The marine lab, $150 and a plaque' }
};

storyHooks('freezer', {
  // the thing itself, drawn over the place it's in (js/places/coldroom.js); null takes it away
  thing(ctx, at) { if (at) Object.assign(SEA_THING, at); else SEA_THING.where = null; },
  // does the thing hum Dee's song? Only if The Breakwaters Reunion is in this run (crossing M8 + M12).
  song: () => !!(S.run && S.run.majors.includes('breakwaters')),
  setCoin(ctx, n) { S.coin = n; },
  countSale() { S.stats.sold++; },
  async walkIn(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name); },
  // Pomfret: the dearest curio that isn't one of a kind, at 1.3 times its guide
  priciestCurio(ctx) {
    const curios = forSale().filter(it => it.cat === 'curio' && !it.unique);
    const it = curios.length ? curios.reduce((m, x) => (x.guide > m.guide ? x : m)) : null;
    ctx.vars.it = it; ctx.vars.price = it ? Math.round(it.guide * 1.3) : null;
  },
  // Sandoval: a hunting knife, at 1.4 times its guide
  firstKnife(ctx) {
    const it = forSale().find(x => x.key === 'dagger') || null;
    ctx.vars.it = it; ctx.vars.price = it ? Math.round(it.guide * 1.4) : null;
  },
  sellWanted(ctx, why) {
    const it = ctx.vars.it;
    S.stock = S.stock.filter(x => x !== it); S.stats.sold++; change('coin', ctx.vars.price, storyText(why, ctx)); onSold(it, 'wanted');
  },
  freed() { S.flags.freezerFreed = dayNum(); },
  daysFreed: () => dayNum() - S.flags.freezerFreed,
  boat(ctx) {
    const b = typeof ally === 'function' && ally('night', { prefer: ['tess', 'nanFerreira'], exclude: ['dory'], min: 'warm' });
    ctx.vars.boat = b && ['tess', 'nanFerreira'].includes(b.id) ? b : null;
  },
  escort(ctx) { const b = ctx.vars.boat; change('rep', 2, `Saw the sea thing out with ${b.name}`); sway(b.id, 1, 'Saw the sea thing safely out'); },
  // somebody comes in to look at the thing in the tank
  async looker(ctx, lines) {
    const c = genShopper();
    c.actor = await enterActor(c.look, c.name);
    await say(c.actor, pick(lines));
    await runShopper(c);
  }
});
