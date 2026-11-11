// Pawn Champ - The Recipe Box: the code half of js/stories/recipebox.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('recipebox', {
  // whether the box is on your shelf
  boxHere: () => !!S.stock.find(x => x.uniqueId === 'recipeBox')
});
