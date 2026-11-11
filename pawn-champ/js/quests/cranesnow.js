// Pawn Champ - Crane in the Snow: the code half of js/stories/cranesnow.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('cranesnow', {
  // the weather on Water Street this month: with { "2": "...", ..., "other": "..." }, sets "weather"
  weather(ctx, byMonth) { ctx.vars.weather = byMonth[monthNum()] || byMonth.other; },
  siren() { Sound.siren(); }
});
