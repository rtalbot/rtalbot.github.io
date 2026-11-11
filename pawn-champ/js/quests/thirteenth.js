// Pawn Champ - The Thirteenth Room: the code half of js/stories/thirteenth.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('thirteenth', {
  // every forfeit brought out of the room counts as a Look, without a new sounding (js/quests/deep.js)
  countLook() { S.flags.deepLooks = deepLooks() + 1; }
});
