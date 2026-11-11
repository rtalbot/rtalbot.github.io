// Pawn Champ - The Sea Captain's Portrait: the code half of js/stories/seacaptain.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('seacaptain', {
  // the lunch at the Historical Society was planned and missed
  errandMissed: () => !!(S.run && S.run.errands && S.run.errands['captain-society'] === -1),
  hasPortrait: () => !!S.stock.find(x => x.uniqueId === 'thralePortrait')
});
