// Pawn Champ - The Portrait: the code half of js/stories/portrait.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name, and the office after hours:
//   officeAfter - Gilded Hand Finance after hours: the office in art.js, lights off, the desk lamp
//                 lit, and the empty frame-mark where the portrait hangs (PORTRAIT.hung draws it)
// Its places are drawn in js/places/office.js.
'use strict';

storyHooks('portrait', {
  // the portrait on the office wall: 0 not hung, 1 hung, 2 hung facing the wall
  hang(ctx, n) { PORTRAIT.hung = n; },
  // Wilbur redeems it: he pays back what you lent him
  redeem(ctx, why) { change('coin', ctx.vars.it.paid, why); },
  // you carry it back: it goes at the end of your shelf, and it's yours to sell now
  backOfShelf(ctx) { const it = ctx.vars.it; S.stock = S.stock.filter(x => x !== it); S.stock.push(it); releaseUnique(it); }
});
