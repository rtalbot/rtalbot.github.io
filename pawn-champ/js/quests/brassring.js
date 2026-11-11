// Pawn Champ - The Brass Ring: the code half of js/stories/brassring.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

const RING_START = 9; // horses that come home on their own, once the town hears the carousel lit up
const ringHorse = () => S.stock.find(x => x.uniqueId === 'jumperHorse');

storyHooks('brassring', {
  horseHere: () => !!ringHorse(),
  // how the carousel is drawn (js/places/carousel.js): tarp, lit, turning, horses, riders
  carousel(ctx, o) { Object.assign(CAROUSEL, o); },
  // number seven turns a little further toward the door
  turnAgain() { S.flags.ringTurn = (S.flags.ringTurn || 0) + 1; },
  // the night of doorsteps: more horses coming home, counted in "back"
  horses(ctx, n) { ctx.vars.back = (ctx.vars.back || 0) + n; },
  horsesHome(ctx) { S.flags.ringHorses = Math.min(23, ctx.vars.back); },
  // the night it turns: the horses back on their poles, number seven too if he's in the shop
  turnHorses(ctx) {
    const horses = (S.flags.ringHorses || RING_START) + (ctx.vars.horse ? 1 : 0);
    ctx.vars.horses = horses;
    Object.assign(CAROUSEL, { tarp: false, lit: false, turning: false, horses, riders: false });
  },
  // a night's test setup: this much money
  testCoin(ctx, n) { S.coin = n; }
});

// If you kept number seven, he goes on turning, a little, for the rest of the stay: every Monday,
// whether or not this month drew the story.
HOOKS.morning.push(async () => {
  if (S.flags.ringEnd !== 'keep' || S.day !== 1 || !ringHorse()) return;
  await story.ringKept();
});
