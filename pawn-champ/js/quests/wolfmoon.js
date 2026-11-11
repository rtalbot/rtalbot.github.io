// Pawn Champ - The Wolf Moon and Out of Habit: the code half of js/stories/wolfmoon.js and
// js/stories/psalterEcho.js (docs/STORY_DATA.md), for what the data can't say: who the Pack's
// newest member is, the Pack's shopping, and the wood's demon.
'use strict';

// the regulars who might have joined the Pack since October; each run's newest member is one of
// these, in felt ears (their characters are moon_dory, moon_ruthie...)
const MOON_RECRUITS = ['dory', 'ruthie', 'bev', 'hal', 'gordie'];
for (const id of MOON_RECRUITS) CAST['moon_' + id] = { name: CAST[id].name, look: { ...CAST[id].look, hat: null, ears: true } };
const moonRecruit = () => {
  if (!S.flags.moonRecruit) S.flags.moonRecruit = MOON_RECRUITS[Math.floor(seededRandom(((S.run && S.run.seed) || 'moon') + '/wolfmoon')() * MOON_RECRUITS.length)];
  return S.flags.moonRecruit;
};

storyHooks('wolfmoon', {
  // the Pack's newest member this run, picked from the run code
  recruit: () => moonRecruit(),
  recruitName: () => CAST[moonRecruit()].name,
  // how the Wolf Moon moves the newest member: { by, why }
  swayRecruit(ctx, o) { sway(moonRecruit(), o.by, o.why); },
  // the Pack shops (cultSale, js/quests/psalter.js): { cats, mult, power }. Names what was sold "sold".
  // With "power", a sale feeds the Wolf Moon (twice over if you're one of the Pack)
  async cultSale(ctx, o) {
    const before = S.flags.cultPower || 0;
    const it = await cultSale(ctx.c.actor, o.cats, o.mult);
    if (it && o.power) S.flags.moonPower = (S.flags.moonPower || 0) + 1 + ((S.flags.cultPower || 0) - before > 1 ? 1 : 0);
    ctx.vars.sold = it || null;
  },
  feedPack() { S.flags.moonPower = (S.flags.moonPower || 0) + 1; },
  // the demon over Hob's Wood (js/places/wolfwood.js)
  wood(ctx, o) { Object.assign(WOLFWOOD, o); },
  // the Psalter, or what's left of it, back on your shelf, with these fields
  addPsalter(ctx, o) { S.stock.push({ ...makePsalter(), ...JSON.parse(JSON.stringify(o)) }); }
});
