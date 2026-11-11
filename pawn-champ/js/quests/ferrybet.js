// Pawn Champ - The Ferry Captain's Bet: the code half of js/stories/ferrybet.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('ferrybet', {
  // you stayed open on the day of the bet
  skipped: () => !!(S.run && S.run.errands && S.run.errands['ferrybet-deck'] === -1)
});
