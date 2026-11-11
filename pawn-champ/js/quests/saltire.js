// Pawn Champ - Saltire Capital: the code half of js/stories/saltire.js (docs/STORY_DATA.md), for what
// the data can't say: what the stay keeps of it (S.stay, js/stay.js) and the strikes it wipes.
'use strict';

storyHooks('saltire', {
  // drawn only when the Hand's debt was sold on (the Paper Is Sold On spine)
  paperSold: () => !!S.stay && S.stay.spine === 'paper',
  // the ending, kept for the rest of the stay: saltireOff() (js/stay.js) reads it for the installments
  stay(ctx, end) { S.stay = S.stay || {}; S.stay.saltire = { end, month: S.month }; },
  spinePaper() { S.stay = S.stay || {}; S.stay.spine = 'paper'; }, // a night's test
  watchHere: () => S.stock.some(x => x.uniqueId === 'shattuckWatch'),
  clearStrikes() { S.strikes = 0; } // the receiver suspends the installments, and what you'd missed
});
