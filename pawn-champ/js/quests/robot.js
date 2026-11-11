// Pawn Champ - The Robot Costume: the code half of js/stories/robot.js (docs/STORY_DATA.md), for
// what the data can't say: Main Street on Halloween night, drawn, and the suit's lights on whoever
// wears it.
// Its places are drawn in js/places/halloween.js.
'use strict';

// the suit, worn: silver cardboard, a cake-tin helmet with a red light on top
const ROBOT_SUIT = { kid: true, skin: '#c89070', hair: '#1a1210', hs: 0, coat: '#b9bec8', style: 'puffer', pants: '#8a8a92', hat: 'helm', hatc: '#d8dce4', band: '#ff4040' };

storyHooks('robot', {
  suitHere: () => S.stock.some(x => x.uniqueId === 'robotSuit'),
  // Ozzie and Rudy come in with Hazel, either side of her
  friends(ctx) {
    const a = ctx.vars.hazel;
    ctx.vars.ozzie = makeActor(CAST.ozzie.look, a.x - 18, a.y + 2, { name: CAST.ozzie.name });
    ctx.vars.rudy = makeActor(CAST.rudy.look, a.x + 18, a.y + 3, { name: CAST.rudy.name });
  },
  lightsOff() { HALLOWEEN.robot = null; },
  // somebody puts the suit on, where they stand: "robot" is them in it, lights blinking
  wear(ctx, who) {
    const a = ctx.vars[who];
    const look = who === 'russ' ? { ...ROBOT_SUIT, kid: false, skin: CAST.russ.look.skin, stout: true } : { ...ROBOT_SUIT, skin: CAST[who].look.skin };
    const r = makeActor(look, a.x, a.y, { name: who === 'russ' ? 'Russ, a robot' : 'A robot' });
    view.actors = view.actors.filter(x => x !== a);
    HALLOWEEN.robot = r; ctx.vars.robot = r;
  },
  // rented out: it comes back to the shelf, yours to sell
  putBack(ctx) { S.stock.push(ctx.vars.suit); },
  // the lights blink a while longer, then the street goes home
  async afterwards() { await sleep(1200); HALLOWEEN.robot = null; }
});
