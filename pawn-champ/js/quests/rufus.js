// Pawn Champ - The Dog Who Became a Man: the code half of js/stories/rufus.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its scene is the full-moon night (Thursday of week 4, the same moon as M4's Howling) on Harbor
// Green, in a variant drawn here:
//   greenMoon - Harbor Green at night under a big full moon (from greenNight in js/places/green.js)
// Its places are drawn in js/places/green.js.
'use strict';

storyHooks('rufus', {
  // the dog on the Green: with { dog, collar, x }
  dog(ctx, o) { Object.assign(RUFUS, o); },
  // M4 The Grey Psalter is in the run and the Pack has begun: Bettany thinks Rufus is a sign
  pack: () => questActive('psalter') && !!S.flags.cultBegun
});
