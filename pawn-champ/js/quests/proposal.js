// Pawn Champ - The Second Proposal: the code half of js/stories/proposal.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('proposal', {
  // you, behind the counter (a stand-in when nobody is: the tools)
  keeper(ctx) { ctx.vars.you = keeper || { name: 'You', look: CAST.keeper.look, x: 236, y: 141 }; },
  anchorStage(ctx, on) { ANCHOR.stage = on; },
  // one more right answer at trivia
  point(ctx) { ctx.vars.right = (ctx.vars.right || 0) + 1; }
});
