// Pawn Champ - Where Odile Went: the code half of js/stories/odilewent.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('odilewent', {
  // drawn only when Odile came home in October (the Two Keepers spine, js/stay.js)
  odileHome() { return !!S.stay && S.stay.odile === 'home'; }
});
