// Pawn Champ - A Year a Week: the code half of js/stories/yearaweek.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('yearaweek', {
  // how old she is now: seventy-three when she let go, and a year a week since
  honoraAge: () => 73 + Math.max(1, (monthNum() - ((S.stay && S.stay.ended && S.stay.ended.widow && S.stay.ended.widow.month) || 1)) * WEEKS + S.week - 1)
});
