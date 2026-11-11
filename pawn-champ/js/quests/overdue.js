// Pawn Champ - The Overdue Book: the code half of js/stories/overdue.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('overdue', {
  // Hester only comes if the book is on your shelves
  bookHere() { return S.stock.some(it => it.uniqueId === 'overdueBook'); }
});
