// Pawn Champ - The Grey Psalter: the code half of js/stories/psalter.js (docs/STORY_DATA.md), for what
// the data can't say: the Pack's looks, the book itself, the Pack's shopping (the Wolf Moon uses
// these too, js/quests/wolfmoon.js), and the hooks the story calls by name.
'use strict';

function cultistLook() { const l = randomLook(); l.hat = null; l.ears = true; return l; }
// The Pack in the woods: grey hoods and robes over the felt ears, and eyes that catch the firelight.
function hoodedCultistLook() {
  const l = randomLook(); delete l.bag; delete l.glasses; delete l.lantern;
  return Object.assign(l, { style: 'robe', coat: '#342e32', trim: '#1e1a1e', hat: 'hood', hatc: '#2a2428', ears: true, eye: '#e8c040' });
}
function makePsalter() {
  return { uid: S.uid++, key: 'curio', name: 'The Grey Psalter', icon: 'psalter', cat: 'curio', cond: 1, condLabel: 'Furry', guide: 30,
    fake: false, stolen: false, noticeId: null, mark: null, filed: false, paid: 0, inspected: true, knownFake: false, knownHot: false,
    clues: [{ text: 'Bound in coarse grey fur. Warm. You could swear it has a heartbeat.' }], held: null, nosale: true, psalter: true };
}
// Offer cultists anything from stock in the given categories, at a premium.
async function cultSale(a, cats, mult) {
  if (S.flags.packSpy) { await say(a, 'Brother Desmond says we don\'t shop here any more. Somebody took notes at the open house.'); return null; }
  if (S.flags.packMember) mult = Math.max(mult, 1.8);
  const offers = S.stock.filter(i => !i.held && !i.nosale && cats.includes(i.cat)).map(it => ({ it, price: Math.round(it.guide * mult) }));
  if (!offers.length) { await say(keeper, 'Nothing like that in today, sorry.'); return null; }
  cardEl.innerHTML = `<h3>${esc(a.name)} wants ${cats.map(x => CAT_LABEL[x].toLowerCase()).join(' or ')}</h3>
    <div class="meta">For "the Pack". They'll pay well:</div>
    <div class="sell-list">${offers.map((o, i) => `<button data-i="${i}"><img src="${iconURL(o.it.icon)}"><span>${esc(o.it.name)}<br><b>${money(o.price)}</b> <span class="meta">paid ${money(o.it.paid)}</span></span></button>`).join('')}
    <button data-i="-1">Don't sell them anything</button></div>`;
  cardEl.classList.remove('hidden');
  const i = await new Promise(res => cardEl.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); res(+b.dataset.i); }));
  hideCard();
  if (i < 0) return null;
  const { it, price } = offers[i];
  S.stock = S.stock.filter(x => x !== it); S.stats.sold++;
  change('coin', price, `Sold ${it.name} to the Pack`);
  onSold(it, 'cult');
  S.flags.cultPower = (S.flags.cultPower || 0) + (S.flags.packMember ? 2 : 1);
  return it;
}

storyHooks('psalter', {
  // the keeper speaks from behind the counter
  keeper(ctx) { ctx.vars.you = keeper || { name: 'You', look: CAST.keeper.look, x: 236, y: 141 }; },
  // the book on your shelf, with any fields laid over it: { "condLabel": "Returned", ... }
  addPsalter(ctx, fields) { S.stock.push({ ...makePsalter(), ...JSON.parse(JSON.stringify(fields || {})) }); },
  // a cultist shops for the Pack: { "cats": [...], "mult": 1.6 }; "sold" is what they bought, if anything
  async cultSale(ctx, { cats, mult }) { ctx.vars.sold = await cultSale(ctx.c.actor, cats, mult); },
  // how well the Pack has been fed (never below nothing)
  power(ctx, n) { S.flags.cultPower = Math.max(0, (S.flags.cultPower || 0) + n); },
  // Linnet comes in with Lark and stands just behind her, as "linnet"; they go out together
  linnetToo(ctx) { const lark = ctx.vars.lark; ctx.vars.linnet = makeActor(CAST.linnet.look, lark.x - 14, FLOOR_Y + 2, { name: CAST.linnet.name }); },
  leaveTogether(ctx) { return Promise.all([leaveShop(ctx.vars.lark), sleep(250).then(() => leaveShop(ctx.vars.linnet))]); },
  // money you may not have all of: as much of n as you've got
  spend(ctx, { n, why }) { change('coin', -Math.min(S.coin, n), why); },
  // the Howling: the show on the marsh is over, and the Pack carries Merrit into Hob's Wood in their hoods
  async intoTheWood(ctx) {
    const v = ctx.vars;
    await fadeOut();
    view.bg = 'wolfwood'; WOLFWOOD.demon = 0; WOLFWOOD._d = 0;
    const put = (a, x, y, left) => { a.x = a.tx = x; a.y = a.ty = y; a.facingLeft = !!left; };
    put(v.you, 28, 170); put(v.shepherd, 200, 142, true); put(v.merrit, 262, 150, true);
    [v.pack1, v.pack2, v.pack3, v.pack4, v.pack5].forEach((p, n) => { p.look = hoodedCultistLook(); put(p, [80, 106, 132, 214, 236][n], [158, 148, 166, 166, 150][n], n > 2); });
    await fadeIn();
  },
  demon(ctx, n) { WOLFWOOD.demon = n; }, // the demon in the smoke over the fire (js/places/wolfwood.js)
  // what Merrit Gaunt knocks off your last installment (or adds to it)
  installment(ctx, times) { S.installmentMult[3] *= times; },
  testCoin(ctx, n) { S.coin = n; }
});
