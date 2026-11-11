// Pawn Champ - The Turkey Platter: the code half of js/stories/platter.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and anything drawn.
// Its places are drawn in js/places/thanksgiving.js.
'use strict';

// Rory's pledge: the loan keyed 'platter', and the platter it's lent against
const platterLoan = () => S.loans.find(l => l.key === 'platter');
const platterItem = () => { const l = platterLoan(); return l ? S.stock.find(x => x.uid === l.itemUid) : null; };
function platterClear() { const l = platterLoan(), it = platterItem(); if (it) S.stock = S.stock.filter(x => x !== it); if (l) S.loans = S.loans.filter(x => x !== l); renderPanel(); }

storyHooks('platter', {
  // Rory pawns it: $40 till Thanksgiving, its tells already read
  lend(ctx) {
    const a = ctx.c.actor, item = makeUnique('platter');
    item.inspected = true; item.clues = item.tells.map(t => ({ text: t, cls: 'good' }));
    grantLoan({ item, name: a.name, look: a.look }, 40, dayOf('4-4'), false, 'platter');
  },
  platterHere: () => !!platterItem(),
  // the platter leaves the shop and Rory's loan is closed (sold: it counts as a sale)
  clear(ctx, sold) { platterClear(); if (sold) S.stats.sold++; },
  // the turkey on the platter, or still on its roasting pan
  onPlatter(ctx, on) { PLATTER.on = on; },
  testSetup() {
    const f = S.flags; f.platterIn = true; f.platterBridie = Math.random() < 0.6;
    const item = makeUnique('platter'); S.stock.push(item);
    S.loans.push({ id: S.uid++, itemUid: item.uid, who: 'Rory Delahunt', look: CAST.rory.look, lent: 40, owed: 52, due: 19, returns: false, key: 'platter' });
  }
});
