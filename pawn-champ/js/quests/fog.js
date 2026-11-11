// Pawn Champ - The Fog Week (M3): the code half. The story itself (characters, items, scenes,
// beats, calendar, endings) is data in js/stories/fog.js; this file holds what data can't say.
// Format: docs/STORY_DATA.md.
// Its place is drawn in js/places/ferry.js.
'use strict';

storyHooks('fog', {
  // the ghost market: every fake on the shelves, at full price (the scene found them as `fakes`)
  sellFakes(ctx) {
    let total = 0;
    for (const it of ctx.vars.fakes) { S.stock = S.stock.filter(x => x !== it); total += it.guide; S.stats.sold++; }
    total = Math.round(total * (hasCard('mott') ? 1.2 : 1)); // Captain Mott's Good Word (js/cards.js)
    change('coin', total, 'Sold fakes to the dead');
  },
  // the ghost market: up to three genuine pieces at 1.4 times the guide
  sellGenuine(ctx) {
    let total = 0;
    for (const it of ctx.vars.genuine.slice(0, 3)) { S.stock = S.stock.filter(x => x !== it); total += Math.round(it.guide * 1.4); S.stats.sold++; onSold(it, 'ghost'); }
    total = Math.round(total * (hasCard('mott') ? 1.2 : 1));
    change('coin', total, 'Sold to the dead');
  },
  // the Drowned Ball: an instrument in your bag if you brought one (`packedString`), else one on
  // the shelves you could run back for. Sets `strung` to the instrument, or null.
  findString(ctx) {
    const packed = bagOn() ? bestFor('play') : null;
    const strung = packed && packed.cat === 'instrument' ? packed : S.stock.find(x => x.cat === 'instrument' && !x.held && !x.questKey && !x.nosale);
    ctx.vars.strung = strung || null;
    ctx.vars.packedString = !!(packed && packed === strung);
  }
});
