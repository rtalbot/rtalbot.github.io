// Pawn Champ - The Turkey Trot: the code half of js/stories/turkeytrot.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('turkeytrot', {
  // a $60 loan against the medal, due back on the Friday of week 4 (the medal is already looked at)
  lend(ctx) {
    const a = ctx.vars.della, item = makeUnique('trotMedal');
    item.inspected = true; item.clues = item.tells.map(t => ({ text: t, cls: 'good' }));
    grantLoan({ item, name: a.name, look: a.look }, 60, dayOf('4-5'), false, 'trot');
  },
  // the loan on the medal, and the medal if it's still in the shop
  findLoan(ctx) {
    const loan = S.loans.find(l => l.key === 'trot');
    ctx.vars.loan = loan || null;
    ctx.vars.medal = (loan && S.stock.find(x => x.uid === loan.itemUid)) || null;
  },
  // she has it back: the loan is closed
  clearLoan(ctx) { S.loans = S.loans.filter(l => l !== ctx.vars.loan); },
  // the errand's test setup: the loan on the medal just added
  testLoan(ctx) {
    S.loans.push({ id: S.uid++, itemUid: ctx.vars.medal.uid, who: 'Della Rourke', look: CAST.della.look, lent: 60, owed: 78, due: 20, returns: false, key: 'trot' });
  }
});
