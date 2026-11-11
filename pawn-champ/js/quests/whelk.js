// Pawn Champ - The Left-Handed Whelk: the code half of js/stories/whelk.js (docs/STORY_DATA.md), for what
// the data can't say yet.
'use strict';

// sold before the errand: that's the ending. (A story's "sold" part, batch 5 of
// docs/quests/TO_DATA.md, will say this as data; until then it's here, for this quest's runs only.)
HOOKS.sold.push(it => { if (questActive('whelk') && it.uniqueId === 'whelk' && !S.flags.whelkEnd) S.flags.whelkEnd = 'sold'; });
