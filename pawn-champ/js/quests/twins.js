// Pawn Champ - The Twins' Map: the code half of js/stories/twins.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name.
'use strict';

storyHooks('twins', {
  // Linnet comes in with Lark and stands just behind her, as "linnet"
  linnetToo(ctx) { const lark = ctx.vars.lark; ctx.vars.linnet = makeActor(CAST.linnet.look, lark.x - 14, FLOOR_Y + 2, { name: CAST.linnet.name }); },
  // they go out of the door together, Linnet a step behind
  leaveTogether(ctx) { return Promise.all([leaveShop(ctx.vars.lark), sleep(250).then(() => leaveShop(ctx.vars.linnet))]); },
  // things you brought in the bag (docs/ITEMS_IN_USE.md)
  carryingDig: () => !!carrying('dig'),
  carryingTime: () => !!carrying('time'),
  tinHere: () => !!S.stock.find(x => x.uniqueId === 'twinsTin'),
  // a night's test setup: this much money
  testCoin(ctx, n) { S.coin = n; }
});
