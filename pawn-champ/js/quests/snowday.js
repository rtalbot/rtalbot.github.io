// Pawn Champ - The Snow Day: the code half of js/stories/snowday.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
//
// The snow day needs no engine change: on that day the trade stays home (HOOKS.day drops the walk-in
// customers, as the plow never comes), and only story beats, redemptions and the regulars get through.
// If the seasons thread adds a proper closed day to js/day.js, this can switch to it.
'use strict';

// the day: one in weeks 2 to 3, the same for a given run code
const snowDayNum = () => driftDay('snowday', '2-1', '3-3');
const isSnowDay = () => !!S.run && questActive('snowday') && dayNum() === snowDayNum();

// Main Street is a drift: nobody comes in to trade. Story beats, redemptions and regulars still do.
HOOKS.day.push(list => {
  if (!isSnowDay()) return;
  for (let i = list.length - 1; i >= 0; i--) if (!['story', 'redeem'].includes(list[i].type) && !list[i].town) list.splice(i, 1);
});

storyHooks('snowday', {
  snowDay: isSnowDay,
  afterSnowDay: () => dayNum() > snowDayNum(),
  // a pawn loan of $90 on the pan, $100 to redeem, due in ten days
  loan() {
    grantLoan({ item: makeUnique('warmingPan'), name: CAST.elmer.name, look: CAST.elmer.look, persona: 'honest' }, 90, Math.min(dayNum() + 10, WEEKS * 5), true, 'elmer');
    S.loans[S.loans.length - 1].owed = 100;
  }
});
