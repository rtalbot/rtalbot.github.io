// Pawn Champ - The Christmas Club: the code half of js/stories/club.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('club', {
  // whether the cashbox is on your shelf
  boxHere: () => !!S.stock.find(x => x.uniqueId === 'clubBox'),
  // Bryony from across the street, if The Rival Shop left her there (its arc can send her home)
  bryonyHere: () => (S.flags.rivalEnd === 'merged' || S.flags.rivalEnd === 'overflow') && !['gone', 'note'].includes(S.flags.eveEnd),
  // which room is lit at the Harborview (js/places)
  room(ctx, n) { HARBORVIEW.room = n; },
  // a night's test setup: this much money
  testCoin(ctx, n) { S.coin = n; }
});
