// Pawn Champ - Main Street in Miniature: the code half of js/stories/miniature.js (docs/STORY_DATA.md),
// for what the data can't say: the hooks it calls by name, and where the flashlight points.
'use strict';

const MINI_SPOTS = { door: [589, 186], sign: [332, 160], window: [292, 140] }; // MINIATURE.torch targets in js/places/miniature.js
const miniSeen = new Set(); // what you've shone the light on tonight

storyHooks('miniature', {
  modelHere() { return !!S.stock.find(x => x.uniqueId === 'mainModel'); },
  torch(ctx, at) { MINIATURE.torch = at; },
  lookStart() { miniSeen.clear(); },
  shine(ctx, id) { MINIATURE.torch = MINI_SPOTS[id]; miniSeen.add(id); },
  sawDoor() { return miniSeen.has('door'); },
  sawSign() { return miniSeen.has('sign'); },
  sawWindow() { return miniSeen.has('window'); }
});
