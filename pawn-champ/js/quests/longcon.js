// Pawn Champ - The Long Con: the code half of js/stories/longcon.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its places are drawn in js/places/cliffroad.js, js/places/rustyanchor.js.
'use strict';

// the fakes you could pass off: ones you know are fake and are free to sell
const lcFakes = () => S.stock.filter(x => x.knownFake && !x.held && !x.questKey && x.uniqueId !== 'lcSword');

storyHooks('longcon', {
  // the sabre on the counter (not in stock), as sword
  sword(ctx) { ctx.vars.sword = makeUnique('lcSword'); },
  loupe: () => S.loupe,
  // look at a thing with the loupe (with: its name); what you find, as clues
  inspect(ctx, name) { const it = ctx.vars[name]; inspect(it); ctx.vars.clues = it.clues.map(x => x.text).join(' '); },
  // buy a unique outright: with { unique, paid, why }
  buy(ctx, w) {
    const it = makeUnique(w.unique); it.paid = w.paid; S.stock.push(it); S.stats.bought++;
    change('coin', -w.paid, w.why); renderPanel();
  },
  // the day you bought their sword; they're gone the morning after
  conned() { S.flags.lcConned = dayNum(); },
  dayAfterSword: () => dayNum() === S.flags.lcConned + 1,
  // your known fakes as fakes (at most with of them), and their names in a list
  fakes(ctx, n) {
    const all = lcFakes(), fakes = n ? all.slice(0, n) : all;
    ctx.vars.fakes = fakes;
    ctx.vars.fakeNames = fakes.map(x => x.name.toLowerCase()).join(', ');
  },
  // they buy your fakes at half again their guide (with: the ledger line), as total
  sellFakes(ctx, why) {
    const fakes = ctx.vars.fakes;
    let total = 0;
    for (const f of fakes) total += Math.round(f.guide * 1.5);
    S.stock = S.stock.filter(x => !fakes.includes(x)); S.stats.sold += fakes.length; renderPanel();
    change('coin', total, why);
    S.flags.lcTurned = total;
    ctx.vars.total = total;
  },
  swordHere: () => S.stock.some(x => x.uniqueId === 'lcSword'),
  porringerHere: () => S.stock.some(x => x.uniqueId === 'lcPorringer'),
  saleTest() {
    S.flags.lcInvite = true; S.flags.lcRole = pick(['mark', 'sharp', 'partner']); S.coin = 200;
    if (Math.random() < 0.6) S.stock.push(makeItem('ring', { fake: true }), makeItem('vase', { fake: true }));
    S.stock.forEach(x => { if (x.fake) x.knownFake = true; });
  },
  boothTest() {
    S.flags.lcPartner = true; S.flags.lcTurn = Math.random() < 0.5; S.flags.lcBarrow = Math.random() < 0.3;
    S.stock.push(makeItem('ring', { fake: true }), makeItem('painting', { fake: true }));
    S.stock.forEach(x => { if (x.fake) x.knownFake = true; });
  },
  grangeTest() {
    S.flags.lcPartner = true;
    const r = Math.random();
    if (r < 0.33) S.flags.lcTurned = 90; else if (r < 0.66) S.flags.lcBarrow = true; else S.flags.lcCut = true;
  }
});
