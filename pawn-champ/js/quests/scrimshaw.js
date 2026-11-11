// Pawn Champ - Scrimshaw: the code half of js/stories/scrimshaw.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name.
'use strict';

storyHooks('scrimshaw', {
  // old or new is decided by the run code, so a shared code has the same tooth
  toothIsOld() { return !S.run || !S.run.seed || seededRandom(S.run.seed + '/tooth')() < 0.5; }
});
