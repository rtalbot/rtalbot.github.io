// Pawn Champ - The Old Home Week Spoons: the code half of js/stories/spoons.js (docs/STORY_DATA.md),
// for what the data can't say: the hooks it calls by name.
'use strict';

// Ellery Thorne pays $40 a spoon, or $50 with Thorne's Standing Order (js/cards.js, tools/cards.js)
function spoonPrice() { return hasCard('thorne') ? 50 : 40; }
const spoonsHeld = () => S.stock.filter(it => it.uniqueId && it.uniqueId.startsWith('spoon-') && !it.fake);
// the five the set still needs: those you hold, those you've sold Thorne, and the Neck if Rook will bring it
const spoonsGathered = () => spoonsHeld().length + (S.flags.spoonsSoldThorne || 0) + (S.flags.rookNeckReturned ? 1 : 0);
// a spoon to sell you; with Hester's 1904 programme, the fake is already marked as one
function spoonGive(id) { const it = makeUnique(id); if (S.flags.spoonsProgramme && it.fake) { it.inspected = true; it.knownFake = true; it.clues = [{ text: 'Hester\'s 1904 programme lists no Lighthouse spoon for sale that year: Thorne has the only one.', cls: 'bad' }]; } return it; }
const spoonsSold = (who, n) => { const k = who === 'rook' ? 'spoonsSoldRook' : 'spoonsSoldThorne'; S.flags[k] = (S.flags[k] || 0) + n; };

storyHooks('spoons', {
  price: () => spoonPrice(),
  gathered: () => spoonsGathered(),
  countWithStudy: () => spoonsGathered() + 2,
  held(ctx) { ctx.vars.held = spoonsHeld(); },
  // when the dinner, the cornerstone and the auction landed: "tonight", "Thursday", "next Tuesday"
  dinnerWhen: () => BATCH_A.when(BATCH_A.nightOf('spoons-dinner')),
  cornerstoneWhen: () => BATCH_A.when(BATCH_A.nightOf('spoons-cornerstone')),
  auctionWhen: () => BATCH_A.when(BATCH_A.nightOf('hub-auction')),
  auctionNight: () => !!BATCH_A.nightOf('hub-auction'),
  // a seller brings a spoon over the counter
  async haggle(ctx, { spoon, persona, asking, min, extra }) {
    const item = spoonGive(spoon);
    Object.assign(item, extra || {});
    ctx.vars.offer = await counterSale(ctx.c, item, { persona, asking, min });
  },
  rookOffer: () => money(60 * spoonsHeld().length),
  thorneOffer: () => money(spoonPrice() * spoonsHeld().length),
  sellToRook() {
    const held = spoonsHeld();
    S.stock = S.stock.filter(x => !held.includes(x));
    change('coin', 60 * held.length, 'Sold Old Home Week spoons to Delphine Rook');
    spoonsSold('rook', held.length);
  },
  sellToThorne() {
    const held = spoonsHeld();
    S.stock = S.stock.filter(x => !held.includes(x)); change('coin', spoonPrice() * held.length, 'Sold Old Home Week spoons to Ellery Thorne');
    spoonsSold('thorne', held.length);
  },
  soldRook(ctx, n) { spoonsSold('rook', n); },
  // Lot 22: how high Rook goes, and winning it
  rookLimit(ctx) { ctx.vars.limit = 90 + Math.floor(Math.random() * 50); ctx.vars.over = ctx.vars.limit + 5; },
  win(ctx, price) {
    if (typeof price === 'string') price = ctx.vars[price];
    S.stock.push(makeUnique('spoon-grange', { })); const it = S.stock[S.stock.length - 1]; it.paid = price;
    change('coin', -price, 'Won Lot 22 at the Benefit Auction'); S.flags.spoonsLot22 = 'you';
    if (typeof benefitAdd === 'function' && questActive('benefit')) benefitAdd(price);
  },
  // the cornerstone: $500 for the set, less what Thorne has paid you a spoon at a time
  thornePays(ctx) { ctx.vars.pays = Math.max(0, 500 - spoonPrice() * (S.flags.spoonsSoldThorne || 0)); },
  payThorne(ctx) { if (ctx.vars.pays) change('coin', ctx.vars.pays, 'Ellery Thorne paid for the Old Home Week spoons'); },
  dropHeld() { const held = spoonsHeld(); S.stock = S.stock.filter(x => !held.includes(x)); }
});
