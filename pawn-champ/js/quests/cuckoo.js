// Pawn Champ - The Cuckoo That Counts Down: the code half of js/stories/cuckoo.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its place is drawn in js/places/clockshop.js.
'use strict';

storyHooks('cuckoo', {
  // one cuckoo fewer each morning, from three
  countDown() { S.flags.cuckooCount = (S.flags.cuckooCount === undefined ? 4 : S.flags.cuckooCount) - 1; },
  // the spring tide floods the shop this many days from today (-1: it already has, last night)
  floodIn(ctx, n) { S.flags.cuckooFlood = dayNum() + n; },
  // the morning after the flood night
  flooded: () => !!S.flags.cuckooFlood && dayNum() > S.flags.cuckooFlood,
  // up to $20 of damage, as much as you have
  floodDamage(ctx, why) { change('coin', -Math.min(S.coin, 20), why); }
});
