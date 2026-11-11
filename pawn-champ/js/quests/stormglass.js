// Pawn Champ - The Storm Glass: the code half of js/stories/stormglass.js (docs/STORY_DATA.md), for what
// the data can't say yet.
'use strict';

// sold before the errand: that's the ending. (A story's "sold" part, batch 5 of
// docs/quests/TO_DATA.md, will say this as data; until then it's here, for this quest's runs only.)
HOOKS.sold.push(it => { if (questActive('stormglass') && it.uniqueId === 'stormGlass' && !S.flags.glassEnd) S.flags.glassEnd = 'sold'; });
