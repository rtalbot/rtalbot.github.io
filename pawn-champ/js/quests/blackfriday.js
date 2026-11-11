// Pawn Champ - The Black Friday Line: the code half of js/stories/blackfriday.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('blackfriday', {
  // the swan box is still on your shelves
  boxHere: () => S.stock.some(x => x.uniqueId === 'swanbox')
});
