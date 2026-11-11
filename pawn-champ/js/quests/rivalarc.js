// Pawn Champ - The Rival Shop, the long arc: the code half of its two chapters,
// js/stories/rivalWinter.js and js/stories/rivalEve.js (docs/STORY_DATA.md): the sums (what she's
// short, what you lend and get back) and the ring on your shelf.
'use strict';

const kettleRing = () => S.stock.find(x => x.uniqueId === 'kettleRing');
// what she's short on Christmas Eve: the note, less what the winter left her and anything that helped since
function eveGap() {
  const f = S.flags;
  let gap = 900;
  if (f.rwEnd === 'chest') gap -= 350;
  else if (f.rwEnd === 'covered') gap -= 150;
  if (f.winEnd === 'theirs' && f.rivalEnd === 'overflow') gap -= 150; // she dressed the winning window (m78)
  if (f.eveAsk === 'stake') gap -= 200;
  return Math.max(100, gap);
}

storyHooks('rivalarc', {
  async music(ctx, track) { Sound.music(track); },
  // her grandmother's ring, pawned: { lent, why }
  pawnRing(ctx, o) {
    const it = makeUnique('kettleRing'); it.paid = o.lent; it.inspected = true; it.clues = (it.tells || []).map(x => ({ text: x, cls: 'good' }));
    S.stock.push(it); renderPanel();
    change('coin', -o.lent, o.why);
    S.flags.rwRing = o.lent; S.flags.rwRingMonth = monthNum();
  },
  // what she's short at the winter payment, after the Sefton lot
  short: () => S.flags.rwChest === 'hers' ? 0 : S.flags.rwChest === 'halves' ? 180 : 420,
  cover(ctx, why) {
    const short = S.flags.rwChest === 'hers' ? 0 : S.flags.rwChest === 'halves' ? 180 : 420;
    S.flags.rwCovered = short; change('coin', -short, why);
  },
  gap: () => eveGap(),
  third: () => Math.round(eveGap() / 3),
  payGap(ctx, why) { change('coin', -eveGap(), why); },
  payThird(ctx, why) { change('coin', -Math.round(eveGap() / 3), why); },
  // you call in her note: her best pieces come to your shelves, as far as there's room. Names how many "n"
  takeStock(ctx) {
    let n = 0;
    for (const id of REC_STOCK) if (shelfFree() && !S.stock.some(x => x.uniqueId === id)) { S.stock.push(makeUnique(id)); n++; }
    ctx.vars.n = n;
    renderPanel();
  },
  // she redeems the ring, with the interest
  redeemRing(ctx, why) {
    const ring = kettleRing();
    const back = Math.round((S.flags.rwRing || ring.paid || 0) * 1.3);
    S.stock = S.stock.filter(x => x !== ring); renderPanel();
    change('coin', back, why);
  },
  release(ctx, name) { if (ctx.vars[name]) releaseUnique(ctx.vars[name]); },
  // two months after the ring was pawned, with no Christmas Eve, it's yours
  ringLapsed() { const ring = kettleRing(); return !!ring && !!ring.questKey && !S.flags.eveEnd && monthNum() >= (S.flags.rwRingMonth || 99) + 3; },
  testCoin(ctx, list) { S.coin = pick(list); }
});
