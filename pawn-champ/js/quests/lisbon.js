// Pawn Champ - Letters from Lisbon: the code half of js/stories/lisbon.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and the landing at noon.
// Its place is drawn in js/places/ferry.js.
'use strict';

storyHooks('lisbon', {
  // whether the letters are on your shelf
  lettersHere: () => !!S.stock.find(x => x.uniqueId === 'lisbonLetters')
});
