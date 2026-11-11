// Pawn Champ - a short-term loan when cash runs out (docs/MECHANICS.md#short-term-loans).
// Loaded after js/standing.js.
//
// Phone for a loan from the ledger or the Friday bills screen. One loan at a time, repaid on the
// Friday of the following week. Who answers depends on the month:
//   Gilded Hand     in October: the people you already owe.
//   Saltire Capital in later months, unless M35 put them in receivership; then the Hand again,
//                   unless Odile's testimony shut the Hand down too, and nobody lends.
// A missed repayment to the Hand or Saltire is a strike, and the fee is charged again for a week's
// extension. A loan due after the month's last Friday moves into the next month if you Stay on.
// Gordie's friendly Friday loan is his standing favour (docs/quests/STANDING.md), not this: it runs
// before the bills, so the phone is for whatever is still short after it.
'use strict';

const BORROW = {
  hand: { name: 'Gilded Hand Finance', short: 'the Hand', look: 'merrit', fee: 0.3, max: 150 },
  saltire: { name: 'Saltire Capital', short: 'Saltire', look: null, fee: 0.25, max: 250 }
};
const BORROW_AMOUNTS = [50, 100, 150, 250];

// Who would answer the phone right now, with today's terms; null if nobody will lend.
function lender() {
  if (!S) return null;
  if (mainStoryOn()) return { key: 'hand', ...BORROW.hand };
  const sal = S.stay && S.stay.saltire;
  if (!sal || sal.end !== 'exposed') return { key: 'saltire', ...BORROW.saltire };
  if (!S.flags.odileFreed) return { key: 'hand', ...BORROW.hand };
  return null;
}
const loanFee = (L, n) => Math.round(n * L.fee);
const loanDueText = w => (w > WEEKS ? 'the first Friday of next month' : `Friday of week ${w}`);
const loanDueNow = () => !!S.borrowed && S.borrowed.week <= S.week;

const LOAN_CALL = {
  hand: L => `Merrit Gaunt answers on the first ring, as if he'd been sitting with his hand on the phone. "Gilded Hand Finance. Short this week? We can help with that. We help with everything."`,
  saltire: L => 'Eleven seconds of cello, then a pleasant voice from Boston. "Saltire Capital, small business bridge facility. I can approve that while we\'re talking."'
};

// The phone call. Resolves to the amount borrowed, or 0.
async function phoneForLoan() {
  if (!S) return 0;
  if (S.borrowed) {
    await showModal(`<h2>The phone</h2><p>You still owe ${esc(S.borrowed.name)} ${money(S.borrowed.owed)}, due ${loanDueText(S.borrowed.week)}. Nobody lends twice on the same Friday's promise.</p>`);
    return 0;
  }
  const L = lender();
  if (!L) {
    await showModal('<h2>The phone</h2><p>Saltire\'s number is disconnected, and the Gilded Hand\'s office has a padlock on it. Nobody in Hollow Neck is lending this month.</p>');
    return 0;
  }
  const week = S.week + 1;
  const amts = BORROW_AMOUNTS.filter(n => n <= L.max);
  const v = await showModal(`<h2>A call to ${esc(L.name)}</h2><p>${esc(LOAN_CALL[L.key](L))}</p>
    <p>Terms: borrow up to ${money(L.max)}, plus a ${Math.round(L.fee * 100)}% fee, paid back ${loanDueText(week)}. One loan at a time.</p>
    <p class="muted">Miss the Friday and it's a strike, and the fee is charged again for another week.</p>`,
  [...amts.map(n => ({ label: `Borrow ${money(n)} (pay back ${money(n + loanFee(L, n))})`, value: n })), { label: 'Hang up', value: 0 }]);
  if (!(v > 0)) return 0;
  S.borrowed = { from: L.key, name: L.name, short: L.short, fee: L.fee, lent: v, owed: v + loanFee(L, v), week };
  change('coin', v, `Borrowed from ${L.name}`);
  if (typeof Sound !== 'undefined' && Sound.stamp) Sound.stamp();
  toast(`Borrowed ${money(v)} from ${L.name}. ${money(S.borrowed.owed)} due ${loanDueText(week)}.`, L.look && CAST[L.look] ? CAST[L.look].look : null);
  return v;
}

// rows and buttons for the Friday bills screen (js/game.js bills())
function loanBillRow(paid) {
  if (!S.borrowed) return '';
  const b = S.borrowed;
  return `<tr><td>Loan from ${esc(b.name)}${loanDueNow() ? '' : ` (due ${loanDueText(b.week)})`}</td><td>${money(b.owed)}</td><td>${paid ? '<span class="good">paid</span>' : loanDueNow() ? '' : '<span class="muted">not yet</span>'}</td></tr>`;
}
function repayLoan() {
  const b = S.borrowed;
  change('coin', -b.owed, `Paid back ${b.name}`);
  S.borrowed = null;
}
// After the bills: an unpaid loan that was due. Returns true if it cost a strike. strikesBefore: the
// strike count when the bills opened.
async function missedLoan(strikesBefore) {
  if (!loanDueNow()) return false;
  const b = S.borrowed;
  b.week = S.week + 1;
  b.owed += Math.round(b.lent * b.fee);
  // one strike a Friday: if the rent or an installment already cost one tonight, the loan only grows
  if (S.strikes > strikesBefore) { log(`Missed a loan payment to ${b.name}: now ${money(b.owed)}`); return false; }
  S.strikes++; S.strikeBy = b.from; log(`Missed a loan payment to ${b.name}`);
  if (typeof Sound !== 'undefined' && Sound.knock) Sound.knock();
  await showModal(b.from === 'hand'
    ? `<h2>A visit in the night</h2><p>Merrit Gaunt writes the loan's new total on a card and tucks it into your door: ${money(b.owed)}, due ${loanDueText(b.week)}. <b>Strike ${S.strikes} of 2.</b></p>`
    : `<h2>A letter from Saltire Capital</h2><p>Your bridge facility has been extended "as a courtesy", to ${money(b.owed)}, due ${loanDueText(b.week)}. <b>Strike ${S.strikes} of 2.</b></p>`, [{ label: 'Continue' }]);
  return true;
}

// the month's end: a loan still out is noted on the ending screen
HOOKS.ending.push((title, lines) => {
  if (S && S.borrowed && !S.over) lines.push(`You still owe ${S.borrowed.name} ${money(S.borrowed.owed)}. They will want it on the first Friday of next month, whatever happens to the shop.`);
});
