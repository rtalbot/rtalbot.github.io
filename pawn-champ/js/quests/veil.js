// Pawn Champ - Something Borrowed: the code half of js/stories/veil.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name. The veil is a pawn loan (grantLoan), keyed 'veil'.
'use strict';

const veilLoan = () => S.loans.find(l => l.key === 'veil');
const veilPawned = () => { const loan = veilLoan(); return loan ? S.stock.find(x => x.uid === loan.itemUid) || null : null; };
const pawnTheVeil = (name, look, lent, looked) => {
  const item = makeUnique('veil');
  if (looked) { item.inspected = true; item.clues = item.tells.map(t => ({ text: t, cls: 'good' })); }
  grantLoan({ item, name, look }, lent, dayNum() + 8, false, 'veil');
};
storyHooks('veil', {
  // Carmen pawns the veil, already looked over: with what you lent her
  pawnVeil(ctx, lent) {
    const a = ctx.vars.carmen;
    pawnTheVeil(a.name, a.look, lent, true);
    S.flags.veilPawned = true; S.flags.veilLent = lent;
  },
  veilLoan() { return !!veilLoan(); },
  // Inés buys it out from under the loan: the loan and the veil go, and the wedding is off
  buyOut() {
    const loan = veilLoan(), it = S.stock.find(x => x.uid === loan.itemUid);
    S.loans = S.loans.filter(l => l !== loan);
    if (it) S.stock = S.stock.filter(x => x !== it);
    if (S.run && S.run.errands) S.run.errands['veil-wedding'] = -1;
  },
  // the wedding: the pawned veil, if it's in the shop; giving it back closes the loan
  findVeil(ctx) { ctx.vars.veil = veilPawned(); },
  returnPledge(ctx) { const loan = veilLoan(); S.loans = S.loans.filter(l => l !== loan); S.stock = S.stock.filter(x => x !== ctx.vars.veil); renderPanel(); },
  repay(ctx, why) { change('coin', S.flags.veilLent || 80, why); },
  // the paper-flower arch on the deck at Dot's
  arch(ctx, on) { PLACES.clamshack.arch = on; },
  // the errand's test: the veil already pawned
  testLoan() { pawnTheVeil('Carmen Ruiz', CAST.carmen.look, 80); }
});
