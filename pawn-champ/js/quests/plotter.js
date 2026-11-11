// Pawn Champ - Waypoints: the code half of js/stories/plotter.js (docs/STORY_DATA.md), for what the data
// can't say: the hooks it calls by name.
'use strict';

storyHooks('plotter', {
  plotterHere() { return !!S.stock.find(x => x.uniqueId === 'plotter'); },
  // items in use (docs/ITEMS_IN_USE.md): whether you brought a camera
  carryingPhoto() { return carrying('photo'); }
});
