// Pawn Champ - Captain Ned: the code half of js/stories/ned.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('ned', {
  // the Rusty Anchor's little stage, lit or not
  anchorStage(ctx, on) { ANCHOR.stage = on; },
  // the day he moved in, so he speaks the morning after
  bought() { S.flags.nedBought = dayNum(); },
  dayAfterBought: () => !(dayNum() <= S.flags.nedBought),
  // Ruthie buys him back for what you paid
  payBack(ctx) { change('coin', ctx.vars.ned.paid, 'Ruthie bought Captain Ned back'); }
});
