// Pawn Champ - The Donkey: the code half of js/stories/donkey.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name, and anything drawn.
//
// Its place, and the crèche and donkey drawings the vigil uses too, are in js/places/creche.js. Also
// here: donkeyInCreche(), so the crèche and the vigil leave the gap while the donkey is still missing.
'use strict';

// The donkey is missing from the crèche while this story is in the month and it hasn't gone home.
function donkeyInCreche() {
  if (!S || !S.run || !(S.run.minors || []).includes('donkey')) return true;
  return ['ransom', 'seniors'].includes(S.flags.donkeyEnd);
}

const donkeyItem = () => S.stock.find(x => x.uniqueId === 'creche');
const donkeyLoan = () => S.loans.find(l => l.key === 'donkey');
function donkeyHandBack() { // take the donkey out of stock, and settle Corey's loan
  const it = donkeyItem(), loan = donkeyLoan();
  if (it) S.stock = S.stock.filter(x => x !== it);
  if (loan) S.loans = S.loans.filter(l => l !== loan);
  renderPanel();
}

storyHooks('donkey', {
  // Corey pawns the donkey: $40 lent against it, for five weeks
  lend(ctx) { const a = ctx.c.actor; grantLoan({ item: makeUnique('creche'), name: a.name, look: a.look }, 40, WEEKS * 5, false, 'donkey'); },
  donkeyHere: () => !!donkeyItem(),
  // the Whist Club takes it, and pays off Corey's loan (why: the ledger line)
  settle(ctx, why) { const loan = donkeyLoan(); donkeyHandBack(); change('coin', loan ? loan.owed : 52, why); },
  handBack() { donkeyHandBack(); },
  // how many ransom notes are pinned up at Saint Brine's
  notes(ctx, n) { CRECHE.notes = n; }
});
