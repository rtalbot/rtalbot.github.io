// Pawn Champ - The Blessing of the Fleet: the code half of js/stories/blessing.js (docs/STORY_DATA.md):
// the places it draws, and the hook that keeps the tally of peace between the two families.
// Its places are drawn in js/places/docks.js, js/places/grange.js.
'use strict';

storyHooks('blessing', {
  // the ending is a tally of peace: what you sabotaged, what you owned up to, and the plates
  peace(ctx, n) { S.flags.blPeace = (S.flags.blPeace || 0) + n; }
});

