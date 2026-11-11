// Pawn Champ - The Iceboat: the code half of js/stories/iceboat.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('iceboat', {
  plankHere: () => S.stock.some(x => x.uniqueId === 'runnerPlank'),
  tessHere: () => townHere('tess'),
  // what Hob's Pond shows (js/places/icepond.js): { lit, boat, toboggan }
  pond(ctx, w) { Object.assign(POND, w); }
});
