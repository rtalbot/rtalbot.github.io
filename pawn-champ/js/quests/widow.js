// Pawn Champ - The Widow's Walk: the code half of js/stories/widow.js (docs/STORY_DATA.md), for what
// the data can't say: the widow's walk in a gale, drawn, and the hooks the story calls by name.
// Its place is drawn in js/places/widowswalk.js.
'use strict';

storyHooks('widow', {
  clockHere: () => S.stock.some(x => x.uniqueId === 'cleggClock'),
  // the Fog Week (M3) is in this run: the drowned come home, and Ward with them
  fogInRun: () => questActive('fog') && !!(S.run && S.run.majors.includes('fog')),
  // the day something happened, kept in a flag, and the days since: the mornings after
  stamp(ctx, flag) { S.flags[flag] = dayNum(); },
  sinceLetGo: () => dayNum() - S.flags.widowLetGo,
  sinceSold: () => dayNum() - S.flags.widowSold,
  sinceHome: () => dayNum() - S.flags.widowHome,
  bought() { S.stats.bought++; },
  testCoin(ctx, n) { S.coin = n; }
});
