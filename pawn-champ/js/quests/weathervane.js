// Pawn Champ - The Weathervane: the code half of js/stories/weathervane.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('weathervane', {
  // items in use (docs/ITEMS_IN_USE.md)
  carryingFix: () => !!carrying('fix'),
  carryingClimb: () => !!carrying('climb'),
  // you let the lunch errand go
  stoodUp: () => !!(S.run && S.run.errands && S.run.errands['weathervane-roof'] === -1)
});

