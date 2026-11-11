// Pawn Champ - The Rival Shop: the code half of js/stories/rival.js (docs/STORY_DATA.md), for what the
// data can't say: her bids on your best pieces, the tables you dress for the fair and the window war
// and how they score, her closing-down sale, the overflow you send her, and her shop's dressing.
//
// Flags are left readable for the seasons arc (batch T): rivalIn, rivalTone, rivalScore (her standing
// against you), rivalBids, rivalSnipes, rivalSign, rivalFair, rivalWindow, rivalKnows, rivalEnd.
'use strict';

const REC_STOCK = ['recTable', 'recLamp', 'recMirror']; // her pieces (js/quests/rivalarc.js uses them too)
const rivalScore = n => { S.flags.rivalScore = (S.flags.rivalScore || 0) + n; };

// Pick up to three things from your stock to show, for the fair stall and the window war. Scored on
// what they're worth, a bonus for each unique item, and a bonus for three that aren't alike.
async function rivalPickThree(prompt) {
  const picked = [];
  await narrate(prompt);
  while (picked.length < 3) {
    const opts = forSale().filter(it => !picked.includes(it)).sort((a, b) => b.guide - a.guide).slice(0, 5);
    if (!opts.length) break;
    const i = await choose([...opts.map(it => ({ label: it.name, hint: `(${CAT_LABEL[it.cat] || it.cat}, guide ${money(it.guide)})` })), picked.length ? 'That\'s enough' : 'Show nothing']);
    if (i === opts.length) break;
    picked.push(opts[i]);
  }
  return picked;
}
function rivalShowScore(items) {
  const cats = new Set(items.map(it => it.cat));
  return items.reduce((s, it) => s + Math.min(180, it.guide) + (it.uniqueId ? 40 : 0), 0) + (items.length === 3 && cats.size === 3 ? 30 : 0);
}
const bryonyShowScore = () => 140 + 35 * Math.max(-2, S.flags.rivalScore || 0) + Math.floor(Math.random() * 60);

// A unique item from another story in this run, on your shelves and free to sell, is something she
// wants. She bids half again its guide, one item a morning, every other morning at most.
function rivalTarget() {
  const f = S.flags, bids = f.rivalBids || {};
  return S.stock.find(it => {
    if (!it.uniqueId || it.held || it.nosale || it.questKey || bids[it.uniqueId]) return false;
    if (it.uniqueId === 'rivalSign') return true;
    const u = UNIQUES[it.uniqueId];
    return !!(u && u.quest && u.quest !== 'rival' && questActive(u.quest));
  });
}

storyHooks('rival', {
  // the look of her shop follows the story so far (js/places/reclaimed.js)
  dress() { RECLAIMED.sign = S.flags.rivalSign === 'hers'; RECLAIMED.closing = S.flags.rivalEnd === 'crushed'; },
  score(ctx, n) { rivalScore(n); },
  today: () => dayNum(),
  // a price for something found: { "of": "cheap", "times": 1.2 } makes "price"
  price(ctx, { of, times }) { ctx.vars.price = Math.round(ctx.vars[of].guide * times); },
  // she pays "price" for it, with this line in the ledger
  earn(ctx, why) { change('coin', ctx.vars.price, storyText(why, ctx)); },
  firstSold(ctx) { S.flags.rivalFirst = ctx.vars.cheap.name; },
  spend(ctx, { n, why }) { change('coin', -Math.min(S.coin, n), why); },
  // a customer who said they'd be back finds it across the street first: "lost" is who, and what
  snipe(ctx) {
    const f = S.flags;
    ctx.vars.lost = null;
    const due = (S.wants || []).filter(w => w.due === dayNum());
    if (!due.length || f.rivalSnipeDay === dayNum()) return;
    const chance = f.rivalWindow === 'yours' ? 0.15 : Math.min(0.6, 0.3 + 0.1 * Math.max(0, f.rivalScore || 0));
    if (Math.random() >= chance) return;
    const w = due[0];
    S.wants = S.wants.filter(x => x !== w);
    f.rivalSnipeDay = dayNum(); f.rivalSnipes = (f.rivalSnipes || 0) + 1;
    ctx.vars.lost = { name: w.name, thing: ITEMS[w.key].name, look: w.look };
  },
  // what she bids on this morning ("it", at "price"), if anything: every other morning at most
  bid(ctx) {
    const f = S.flags;
    f.rivalBids = f.rivalBids || {};
    ctx.vars.it = null;
    if (f.rivalBidDay && dayNum() - f.rivalBidDay < 2) return;
    const it = rivalTarget();
    if (!it) return;
    f.rivalBidDay = dayNum();
    ctx.vars.it = it;
    ctx.vars.price = Math.max(10, Math.round(it.guide * (it.uniqueId === 'rivalSign' ? 2.5 : 1.5)));
  },
  bidded(ctx, how) { S.flags.rivalBids[ctx.vars.it.uniqueId] = how; },
  async comesIn(ctx) { ctx.vars.bryony = await enterActor(CAST.bryony.look, CAST.bryony.name); },
  // whether the Harvest Fair has been and gone
  fairPast() { const d = S.run && S.run.nights && S.run.nights['hub-fair']; return !!d && d < dayNum(); },
  // three things for a table or a window ("mine"), and whether they beat hers ("won")
  async pickThree(ctx, prompt) { ctx.vars.mine = await rivalPickThree(storyText(prompt, ctx)); },
  judge(ctx) { ctx.vars.won = rivalShowScore(ctx.vars.mine) >= bryonyShowScore(); },
  mineList: ctx => ctx.vars.mine.map(it => it.name.toLowerCase()).join(', '),
  saleDay() { S.flags.rivalSaleDay = dayNum() + 2; },
  // merged: three of her pieces, as many as fit, and $40 off your last installment
  merge(ctx) {
    let n = 0;
    for (const id of REC_STOCK) if (shelfFree()) { S.stock.push(makeUnique(id)); n++; }
    S.installmentMult[3] = Math.max(0, S.installmentMult[3] - 40 / INSTALLMENTS[3]);
    ctx.vars.n = n;
  },
  // your overflow: up to three things she buys now, at guide
  async overflow() {
    let n = 0;
    while (n < 3) {
      const opts = forSale().filter(it => !it.questKey).sort((x, y) => x.guide - y.guide).slice(0, 5);
      if (!opts.length) break;
      const j = await choose([...opts.map(it => ({ label: `Send her the ${it.name.toLowerCase()}`, hint: `(${money(it.guide)})` })), n ? 'That\'s all for now' : 'Nothing today']);
      if (j === opts.length) break;
      const it = opts[j];
      S.stock = S.stock.filter(x => x !== it); S.stats.sold++; onSold(it, 'rival');
      change('coin', it.guide, `Bryony bought your overflow: the ${it.name.toLowerCase()}`); renderPanel(); n++;
    }
  },
  // the closing-down sale: three of her pieces at 40% of guide
  async closingSale() {
    const left = REC_STOCK.slice();
    while (left.length) {
      const opts = left.map(id => ({ id, u: UNIQUES[id], price: Math.round(UNIQUES[id].guide * 0.4) }));
      const i = await choose([...opts.map(o => ({ label: `Buy the ${o.u.name.toLowerCase()} for ${money(o.price)}`, hint: `(guide ${money(o.u.guide)})`, disabled: S.coin < o.price || !shelfFree() })), 'Leave the rest']);
      if (i === opts.length) break;
      const o = opts[i];
      const it = makeUnique(o.id); it.paid = o.price; S.stock.push(it);
      change('coin', -o.price, `Bought the ${o.u.name.toLowerCase()} at Bryony's closing-down sale`); renderPanel();
      left.splice(left.indexOf(o.id), 1);
    }
  },
  signKept: () => S.stock.some(x => x.uniqueId === 'rivalSign'),
  testCoin(ctx, n) { S.coin = n; }
});

// the fair's test run (tools/events.js) should include her stall
if (HUBS.fair) { const t = HUBS.fair.test; HUBS.fair.test = () => { if (t) t(); Object.assign(S.flags, { rivalIn: true, rivalScore: 0 }); S.stock.push(makeItem('vase'), makeItem('watch')); }; }
