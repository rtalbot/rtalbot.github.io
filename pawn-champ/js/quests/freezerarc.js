// Pawn Champ - The Thing in Dory's Freezer, the long arc: the code half of its three chapters,
// js/stories/freezerTank.js, freezerSecond.js and freezerThaw.js (docs/STORY_DATA.md): where the
// thing is now, who bought it, and the thing itself drawn in the place it's in.
'use strict';

// Where the thing is now, after October and whatever chapters came since:
//   'shop'  in the tank by the till, or the tub in the back room
//   'lab'   in the marine lab's winter tank
//   'buyer' with Pomfret or Sandoval
//   'sea'   out in the harbor
function seaWhere() {
  const f = S.flags;
  if (f.thawEnd === 'together') return 'sea';
  if (f.freezerEnd === 'sea' || f.tankEnd === 'harbor' || f.secondEnd === 'home') return 'sea';
  if (f.tankEnd === 'lab' || (f.freezerEnd === 'sold' && f.freezerBuyer === 'lab')) return 'lab';
  if (f.freezerEnd === 'sold') return 'buyer';
  return 'shop';
}
// who bought it, if anyone (no buyer chosen in the cold room means Pomfret, as in freezerEnd)
const seaBuyer = () => FREEZER_BUYERS[S.flags.freezerBuyer] || FREEZER_BUYERS.pomfret;
const seaTank = () => S.stock.find(x => x.uniqueId === 'seaThing');
// what each buyer offers for a second one, in A Second One
const SECOND_FEE = { pomfret: 300, sandoval: 500, achebe: 100 };

storyHooks('freezerarc', {
  seaWhere: () => seaWhere(),
  // where it is as the scene starts, named "w" (a scene's own ending can move it)
  where(ctx) { ctx.vars.w = seaWhere(); },
  buyer: () => seaBuyer().who,
  buyerName: () => CAST[seaBuyer().who].name,
  // the thing, drawn over the place it's in (js/places/coldroom.js)
  thing(ctx, at) { Object.assign(SEA_THING, at); },
  // it leaves your shelf (the tank by the till)
  letGo() { const t = seaTank(); if (t) { S.stock = S.stock.filter(x => x !== t); renderPanel(); } },
  setFee() { S.flags.secondFee = SECOND_FEE[seaBuyer().who]; },
  fee: () => S.flags.secondFee || SECOND_FEE[seaBuyer().who],
  payFee(ctx, why) { change('coin', S.flags.secondFee || SECOND_FEE[seaBuyer().who], why); },
  // the sea's monthly gift: the month it last came
  stepMonth() { S.flags.seaStepMonth = monthNum(); },
  // somebody comes in to look at the thing in the tank
  async looker(ctx, lines) {
    const c = genShopper();
    c.actor = await enterActor(c.look, c.name);
    await say(c.actor, pick(lines));
    await runShopper(c);
  }
});
