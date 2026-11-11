// Pawn Champ - The Missing Queen: the code half of js/stories/queen.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('queen', {
  // the queen you lend him: the nth of the things that would stand up as one
  pickQueen(ctx, n) { ctx.vars.queen = ctx.vars.queens[n]; }
});
