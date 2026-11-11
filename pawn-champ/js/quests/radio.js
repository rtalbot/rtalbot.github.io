// Pawn Champ - Static on Channel 16: the code half of js/stories/radio.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('radio', {
  radioHere() { return S.stock.some(x => x.uniqueId === 'vhfRadio'); },
  // sold, it comes back the next morning: the buyer keeps a copy of it till then
  buyerKeeps(ctx) { S.flags.radioBack = { due: dayNum() + 1, item: { ...ctx.vars.it } }; },
  buyerBack() { const b = S.flags.radioBack; return !!b && !(b.due > dayNum()); },
  async buyerEnters(ctx) {
    ctx.vars.back = S.flags.radioBack;
    S.flags.radioBack = null; S.flags.radioReturned = true;
    ctx.vars.buyer = await enterActor(CAST.radioBuyer.look, CAST.radioBuyer.name);
  },
  // back on the shelf, and nobody else will take it now
  radioBack(ctx) { S.stock.push({ ...ctx.vars.back.item, questKey: true, nosale: true, paid: 0 }); renderPanel(); },
  buyerLeaves(ctx) { return leaveShop(ctx.vars.buyer, true); }
});
