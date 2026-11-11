// Pawn Champ - The Actuary's Pen: the code half of js/stories/actuary.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('actuary', {
  // he leaves it with you today: the pen starts its gloom tomorrow
  held() { S.flags.penHeld = dayNum(); },
  // the pen's morning note: the next pawn loan it hasn't told you about yet, as loan { who, what,
  // due, returns }; or, with none left, whether it's a gloomy day
  penNote(ctx) {
    const f = S.flags;
    f.penTold = f.penTold || [];
    const loan = S.loans.find(l => !f.penTold.includes(l.id));
    ctx.vars.loan = null;
    if (loan) {
      f.penTold.push(loan.id);
      const it = S.stock.find(i => i.uid === loan.itemUid);
      ctx.vars.loan = { who: loan.who, what: it ? it.name.toLowerCase() : 'pledge', due: dueText(loan.due), returns: !!loan.returns };
    }
    ctx.vars.gloomy = !loan && !!f.penHeld && dayNum() > f.penHeld;
  },
  // one of n, at random, as n
  pickOne(ctx, n) { ctx.vars.n = Math.floor(Math.random() * n); },
  // you stayed open on the day of the errand
  skipped: () => !!(S.run && S.run.errands && S.run.errands['actuary-anchor'] === -1)
});
