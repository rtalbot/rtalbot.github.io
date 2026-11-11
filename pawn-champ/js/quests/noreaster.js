// Pawn Champ - The Nor'easter: the code half of js/stories/noreaster.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('noreaster', {
  // you, behind the counter
  // you, behind the counter (a stand-in when nobody is: the tools)
  keeper(ctx) { ctx.vars.you = keeper || { name: 'You', look: CAST.keeper.look, x: 236, y: 141 }; },
  // remembers that you asked someone: with the name to set
  mark(ctx, name) { ctx.vars[name] = true; },
  // the best thing on the shelves gets swapped in the dark, by one of the three, at random
  swap(ctx) {
    const best = forSale().filter(x => !x.fake && !x.questKey).sort((p, q) => q.guide - p.guide)[0] || null;
    ctx.vars.best = best;
    ctx.vars.culprit = randi(0, 2);
    S.flags.stormSwap = best ? best.uid : 0;
  },
  // nothing worth swapping, so they take twenty from the till
  tillShort() { change('coin', -Math.min(S.coin, 20), 'Robbed in the dark during the storm'); },
  markCopy(ctx) { ctx.vars.best.name += ' (a copy)'; },
  // Mrs. Ochoa only comes before the storm
  beforeStorm: () => dayNum() <= ((S.run && S.run.nights && S.run.nights.noreaster) || 99)
});
