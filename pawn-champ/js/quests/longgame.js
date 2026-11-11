// Pawn Champ - The Long Game: the code half of js/stories/longgame.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('longgame', {
  // Gus is on the Green this month (js/town.js), even without The Missing Queen
  gusHere() { return townHere('gus') && !!CAST.gus; }
});
