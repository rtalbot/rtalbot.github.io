// Pawn Champ - The Prize Seed: the code half of js/stories/prizeseed.js (docs/STORY_DATA.md), for
// what the data can't say: the weigh-off drawn on the Green, and the hooks that work it.
// Its places are drawn in js/places/green.js.
'use strict';

storyHooks('prizeseed', {
  held: () => S.stock.some(x => x.uniqueId === 'prizeSeed'),
  // the weigh-off is drawn behind the bandstand, in the middle of the fair: no fade, and back after
  toWeighOff(ctx) { ctx.vars.back = view.bg; view.bg = 'weighoff'; Object.assign(WEIGH, { lift: 0, reading: '----', bare: false }); },
  fromWeighOff(ctx) { Object.assign(WEIGH, { lift: 0, reading: '----', bare: false }); view.bg = ctx.vars.back; },
  // the forklift swings it onto the scale, and the readout climbs to the reading
  async weigh(ctx, reading) {
    for (let i = 0; i <= 10; i++) { WEIGH.lift = i / 10; await sleep(120); }
    for (const n of ['0', '612', '1104', '1390', reading]) { WEIGH.reading = n; await sleep(220); }
  },
  // weighed again, off the pallet
  async bare() { WEIGH.bare = true; WEIGH.reading = '1368'; await sleep(300); }
});
