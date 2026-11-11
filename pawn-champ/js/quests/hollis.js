// Pawn Champ - Four Minutes Late: the code half of js/stories/hollis.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

// his old watch, if it's still on your shelf (and not on hold)
const hollisOldWatch = () => S.stock.find(x => x.key === 'watch' && x.mark === 'the initials H.F.' && !x.held);

storyHooks('hollis', {
  oldWatch: () => !!hollisOldWatch(),
  crateHere: () => S.stock.some(x => x.uniqueId === 'phoneCrate'),
  carryingPhoto: () => !!carrying('photo'),
  setCoin(ctx, n) { S.coin = n; },
  countSale() { S.stats.sold++; },
  // Agathe's tally sheet: not for sale, and its clue is the whole case
  tallySheet() {
    S.stock.push({ uid: S.uid++, key: 'curio', name: 'Agathe\'s tally sheet', icon: 'letter', cat: 'curio', cond: 1, condLabel: 'Folded', guide: 0,
      fake: false, stolen: false, noticeId: null, mark: null, filed: false, paid: 0, inspected: true, knownFake: false, knownHot: false,
      clues: [{ text: 'Forty crates logged in. Forty marked "destroyed". The signatures are all Deputy Director Crane\'s.' }], held: null, nosale: true });
    renderPanel();
  },
  // Pim comes in at Hollis's elbow
  pimArrives(ctx) { ctx.vars.pim = makeActor(CAST.pim.look, ctx.vars.hollis.x - 16, FLOOR_Y + 2, { name: CAST.pim.name }); },
  bothLeave(ctx) { return Promise.all([leaveShop(ctx.vars.hollis), sleep(250).then(() => leaveShop(ctx.vars.pim))]); },
  // Barrow has Crane: the Hand eases off the last two Fridays
  easierPayments() { S.installmentMult[2] *= 0.85; S.installmentMult[3] *= 0.85; },
  // a watch on your shelf that isn't his old one, for half again its guide
  newWatch(ctx) {
    const w = S.stock.find(x => x.key === 'watch' && !x.held && !x.fake && x.mark !== 'the initials H.F.');
    ctx.vars.w = w || null;
    ctx.vars.price = w ? money(Math.round(w.guide * 1.5)) : null;
  },
  buyWatch(ctx) {
    const w = ctx.vars.w;
    if (!w) return;
    S.stock = S.stock.filter(x => x !== w); change('coin', Math.round(w.guide * 1.5), 'Sold Hollis a new watch'); S.stats.sold++;
  },
  // what his old watch is worth: its guide, $5 at least
  worth: ctx => money(Math.max(5, ctx.vars.w ? ctx.vars.w.guide : 0)),
  payWorth(ctx) { change('coin', Math.max(5, ctx.vars.w ? ctx.vars.w.guide : 0), 'Sold Hollis his own watch'); }
});
