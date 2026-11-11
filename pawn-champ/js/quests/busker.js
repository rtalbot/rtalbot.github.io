// Pawn Champ - The Mayor of the Boardwalk: the code half of js/stories/busker.js (docs/STORY_DATA.md):
// the hooks it calls by name. This file also draws the outside of Neptune's Arcade, which batch K
// shares (docs/quests/LOCATIONS.md):
//   arcadeFront        - the boardwalk outside the arcade at night, the sign lit (m51 The Camcorder)
//   arcadeFrontDay     - the same on an ordinary weekday lunchtime (m31)
//   arcadeFrontWinter  - winter quarters: shutters down, a stovepipe out of a stall, laundry (m46)
// The Szabo family's banner hangs over the doors once m46 ends well (S.flags.bannerEnd === 'hung').
// Batch O's carousel goes on the same boardwalk later: give it its own id (e.g. arcadeFrontCarousel).
// Its places are drawn in js/places/arcadefront.js.
'use strict';

const buskerAcc = () => S.stock.find(x => x.uniqueId === 'accordion');
storyHooks('busker', {
  accHere: () => !!buskerAcc(),
  // another Monday he pawned it
  countPawn() { S.flags.buskerPawned = (S.flags.buskerPawned || 0) + 1; }
});

