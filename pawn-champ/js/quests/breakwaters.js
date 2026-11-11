// Pawn Champ - The Breakwaters Reunion: the code half of js/stories/breakwaters.js
// (docs/STORY_DATA.md), for what the data can't say: the hooks it calls by name.
'use strict';

const BW_SET = ['bwGuitar', 'bwSetList', 'bwJacket', 'bwSticks'];
const bwHas = id => S.stock.find(x => x.uniqueId === id);

// one condition step worse (Wanda had it)
function bwWear(it) {
  if (!it.cond) return;
  const was = CONDITIONS[it.cond].mult;
  it.cond--; it.condLabel = CONDITIONS[it.cond].label;
  it.guide = Math.round(it.guide * CONDITIONS[it.cond].mult / was);
}

storyHooks('breakwaters', {
  deckHere: () => !!bwHas('bwDeck'),
  deckInBag: () => !!carried('bwDeck'),
  fullSet: () => BW_SET.every(bwHas),
  // the rehearsal: lend the nth thing on a list the scene found; it comes back after the gig
  lend(ctx, { from, n, by }) {
    const it = ctx.vars[from][n];
    S.stock = S.stock.filter(x => x !== it); renderPanel();
    S.flags.bwLent.push({ it, by });
    ctx.vars[by + 'Lent'] = it;
  },
  // after the gig: what was lent comes back, and Wanda's a bit worse for it
  returnLent(ctx) {
    const lent = Array.isArray(S.flags.bwLent) ? S.flags.bwLent : [];
    for (const { it, by } of lent) { if (by === 'wanda') bwWear(it); S.stock.push(it); }
    ctx.vars.lent = lent;
    ctx.vars.dented = lent.some(l => l.by === 'wanda');
  },
  pins(ctx, on) { PINWHEEL.pins = on ? PINWHEEL.pins : null; },
  stage(ctx, on) { ANCHOR.stage = on; },
  // the tape is offered once a morning
  askedToday: () => S.flags.bwAsked === dayNum(),
  askToday() { S.flags.bwAsked = dayNum(); },
  music(ctx, track) { Sound.music(track === 'day' ? Sound.dayTrack(dayNum()) : track); },
  async walkIn(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name); },
  sellSet() { S.stock = S.stock.filter(x => !BW_SET.includes(x.uniqueId)); S.stats.sold += 4; change('coin', 220, 'Sold the Breakwaters set back to Dee'); },
  gigTest() {
    const a = makeItem('lute'), b = makeItem('goblet');
    Object.assign(S.flags, { bwIn: true, bwHeard: Math.random() < 0.5, bwLent: [{ it: a, by: 'benny' }, { it: b, by: 'wanda' }] });
    S.stock.push(makeUnique('bwTape')); S.coin = 200;
  }
});
