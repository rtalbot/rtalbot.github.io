// Pawn Champ - Captain Barrow's Boy: the code half of js/stories/barrowboy.js (docs/STORY_DATA.md): the
// hooks it calls by name, and sandbarBoat, the sandbar below the breakwater at dusk with Eli's half-built
// dory on sawhorses (a variant of batch B's sandbar), which fills in as the parts arrive.
// Its place is drawn in js/places/sandbar.js.
'use strict';

// ---------------------------------------------------------------- the breakwater at dusk, with the boat
const ELIBOAT = { parts: 0, done: false };
// the hull itself is drawn live, so it fills in as the parts arrive
const eliBoatBase = PLACES.sandbarBoat;
PLACES.sandbarBoat = {
  ...eliBoatBase,
  build: () => eliBoatBase.build(),
  animate(g, now) {
    eliBoatBase.animate(g, now);
    // a sixteen-foot dory: flared sides, a narrow flat bottom, a tombstone transom
    const x0 = 396, y0 = 236;
    g.fillStyle = '#2a1e16'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + 150, y0 - 6); g.lineTo(x0 + 136, y0 + 30); g.lineTo(x0 + 20, y0 + 32); g.closePath(); g.fill();
    const planks = ELIBOAT.done ? 5 : 2 + ELIBOAT.parts;
    for (let i = 0; i < 5; i++) {
      const y = y0 + 2 + i * 6, inset = i * 3;
      if (i < planks) { rect(g, x0 + 4 + inset, y, 140 - inset * 2, 5, i % 2 ? '#c8945a' : '#b8844a'); rect(g, x0 + 4 + inset, y, 140 - inset * 2, 1, '#e0b07a'); }
    }
    // the ribs show through where the planking stops
    if (!ELIBOAT.done) for (let k = 0; k < 9; k++) rect(g, x0 + 14 + k * 15, y0 + 2 + planks * 6, 2, 30 - planks * 6, '#d8b888');
    if (ELIBOAT.parts >= 1 || ELIBOAT.done) { rect(g, x0 + 50, y0 - 6, 3, 5, '#c8b070'); rect(g, x0 + 100, y0 - 8, 3, 5, '#c8b070'); } // oarlocks
    if (ELIBOAT.done) { rect(g, x0 + 30, y0 - 4, 2, 4, '#e8e4dc'); pixText(g, 'LEMUEL', x0 + 54, y0 + 14, '#2a3a5a'); }
  }
};

// items in use (docs/ITEMS_IN_USE.md): with a bag, what you brought; otherwise your shelves
const eliPool = () => (bagOn() && S.bag && S.bag.out ? packedItems().filter(x => !x.questKey) : forSale());
storyHooks('barrowboy', {
  carryingLight: () => carrying('light'),
  // a night's test setup: this much money
  setCoin(ctx, n) { S.coin = n; },
  // up to three silver things to bend into oarlocks (silver1..3), or two compasses (compass1, 2)
  pool(ctx, what) {
    const list = what === 'silver' ? eliPool().filter(it => it.cat === 'silver').slice(0, 3) : eliPool().filter(it => it.key === 'compass' || it.icon === 'compass').slice(0, 2);
    for (let i = 0; i < (what === 'silver' ? 3 : 2); i++) ctx.vars[what + (i + 1)] = list[i] || null;
  },
  // the boat on the sawhorses: start the night with none of the three parts, add one, finish her
  boatStart(ctx) { ctx.vars.parts = 0; ELIBOAT.parts = 0; ELIBOAT.done = false; },
  part(ctx) { ctx.vars.parts++; ELIBOAT.parts = ctx.vars.parts; },
  partsDone(ctx) { renderPanel(); S.flags.eliParts = ctx.vars.parts; },
  boatDone() { ELIBOAT.done = true; },
  clearPins() { PINWHEEL.pins = null; },
  // his mother comes in through the door, to the near end of the counter
  async walkIn(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name, 100, FLOOR_Y); },
  bothLeave(ctx, [a, b]) { return Promise.all([leaveShop(ctx.vars[a]), sleep(300).then(() => leaveShop(ctx.vars[b]))]); },
  // Captain Barrow pays back what you paid for her father's medals
  payBack(ctx, why) { const it = ctx.vars.medals; if (it && it.paid) change('coin', it.paid, why); },
  // you told his mother: Barrow looks more kindly on the shop from then on
  cool() { if (S.heat > 0) S.heat = Math.max(0, S.heat - 1); },
  stationTest() {
    const r = Math.random();
    Object.assign(S.flags, { eliMet: true, eliMedals: 'bought', eliBoatDone: r < 0.5, eliSoldMedals: r > 0.8, eliSoldTo: r > 0.9 ? 'Bryony' : undefined });
    const m = makeUnique('eliMedals'); m.paid = 80; if (r <= 0.8) S.stock.push(m);
    S.stock.push(makeUnique('eliReel'), makeUnique('eliPlans'));
  }
});
