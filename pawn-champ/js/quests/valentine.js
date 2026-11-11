// Pawn Champ - The Valentine: the code half of js/stories/valentine.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('valentine', {
  hasBox: () => !!S.stock.find(x => x.uniqueId === 'valentineBox')
});
