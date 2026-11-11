// Pawn Champ - The Bowling Ball: the code half of js/stories/bowlingball.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('bowlingball', {
  // the day you bought the ball, so it asks to be opened the morning after
  markDay() { S.flags.ballDay = dayNum(); },
  dayAfter() { return dayNum() > S.flags.ballDay; },
  // the lanes in the middle of the day, with no pins standing
  clearPins() { PINWHEEL.pins = null; },
  // items in use (docs/ITEMS_IN_USE.md)
  carryingCut() { return carrying('cut'); },
  carryingPry() { return carrying('pry'); }
});
