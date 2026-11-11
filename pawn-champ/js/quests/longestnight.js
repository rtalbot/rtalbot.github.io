// Pawn Champ - The Longest Night: the code half of js/stories/longestnight.js (docs/STORY_DATA.md):
// the vigil's hall, drawn, and the hooks the story calls by name (the lanterns on loan, your row
// of lanterns at the vigil, and who sits up with you).
//
// Later stories join the vigil at about three in the morning, with the lanterns lit and view.bg =
// 'vigil', through its cue: a "cues" entry { "cue": "vigil", "scene": ... } in their story file
// (The Second Page, js/stories/grey2.js). S.flags.vigilTonight is true while the vigil runs;
// S.flags.vigilWarned once the keeper has read Odile's line.
// Its places are drawn in js/places/vigil.js.
'use strict';

const VIGIL_LANTERNS = ['watchLantern', 'stormLantern', 'railLamp'];
const vigilLoan = key => S.loans.find(l => l.key === key);
const vigilHeld = id => S.stock.find(x => x.uniqueId === id);

storyHooks('longestnight', {
  // a lantern pawned over the counter: { unique, lent, due ("4-2", or nextMonth: the day of next
  // month), returns, key }
  lend(ctx, o) {
    const a = ctx.c.actor, item = makeUnique(o.unique);
    item.inspected = true; item.clues = item.tells.map(t => ({ text: t, cls: 'good' }));
    grantLoan({ item, name: a.name, look: a.look }, o.lent, o.due ? dayOf(o.due) : WEEKS * 5 + o.nextMonth, !!o.returns, o.key);
  },
  heldWord: () => ['one', 'two', 'three'][VIGIL_LANTERNS.filter(vigilHeld).length - 1] || '',
  // the lanterns on your counter, for a line: "an Old Colony railway lamp, the Watch Lantern..."
  heldList: () => VIGIL_LANTERNS.filter(vigilHeld).map(id => UNIQUES[id].name.replace(/^An? /, 'an ').replace(/^The /, 'the ')).join(', '),
  // the vigil's hall: your row is whichever lanterns you brought, unlit
  setUp() {
    VIGIL.out = 0; VIGIL.dawn = 0;
    VIGIL.ours = [];
    if (vigilHeld('watchLantern')) VIGIL.ours.push({ kind: 'watch', lit: false });
    if (vigilHeld('stormLantern')) VIGIL.ours.push({ kind: 'storm', lit: false });
    if (vigilHeld('railLamp')) VIGIL.ours.push({ kind: 'rail', lit: false });
  },
  // light the next lantern of that kind in your row
  light(ctx, kind) { const o = VIGIL.ours.find(x => x.kind === kind && !x.lit); if (o) o.lit = true; },
  hall(ctx, o) { Object.assign(VIGIL, o); },
  // three of the town's lanterns get their story told each year, from the pool, picked by the run
  // code: names them "told"
  told(ctx, pool) {
    const R = seededRandom(((S.run && S.run.seed) || 'vigil') + '/vigil');
    ctx.vars.told = pool.map(s => [R(), s]).sort((a, b) => a[0] - b[0]).slice(0, 3).map(x => x[1]);
  },
  // a friend among the regulars sits up with you (js/standing.js), and brings a lantern: "friend"
  friend(ctx) {
    const fr = ally('night');
    ctx.vars.friend = null;
    if (!fr || !CAST[fr.id]) return;
    ctx.vars.friend = makeActor(CAST[fr.id].look, 72, 166, { name: CAST[fr.id].name });
    ctx.vars.friendId = fr.id;
  },
  friendSits(ctx) { VIGIL.ours.push({ kind: 'friend', lit: true }); S.flags.vigilFriend = ctx.vars.friendId; },
  // and an enemy turns up to sneer: "enemy", who then fades into the crowd
  enemy(ctx) {
    const en = foe('witness');
    ctx.vars.enemy = en && CAST[en.id] ? makeActor(CAST[en.id].look, 286, 160, { name: CAST[en.id].name, facingLeft: true }) : null;
  },
  hide(ctx, who) { if (ctx.vars[who]) ctx.vars[who].hidden = true; },
  // what Vivienne Vane offers for your row
  vaneOffer: () => (vigilHeld('watchLantern') ? 300 : 0) + (vigilHeld('stormLantern') ? 60 : 0) + (vigilHeld('railLamp') ? 90 : 0),
  // she buys your row: the lanterns go, loans and all, and only a friend's lantern is left lit
  sellRow(ctx, why) {
    const offer = (vigilHeld('watchLantern') ? 300 : 0) + (vigilHeld('stormLantern') ? 60 : 0) + (vigilHeld('railLamp') ? 90 : 0);
    for (const id of VIGIL_LANTERNS) {
      const it = vigilHeld(id); if (!it) continue;
      S.stock = S.stock.filter(x => x !== it);
      S.loans = S.loans.filter(l => l.itemUid !== it.uid);
    }
    VIGIL.ours = VIGIL.ours.filter(o => o.kind === 'friend');
    S.stats.sold++; renderPanel();
    change('coin', offer, why);
  },
  litCount: () => VIGIL.ours.filter(o => o.lit).length,
  async dawn() { for (let i = 0; i < 10; i++) { VIGIL.dawn = i / 10; await sleep(60); } VIGIL.dawn = 1; },
  watchLoan: () => !!vigilLoan('vigil'),
  // Father Ignatius redeems the Watch Lantern from the collection plate
  redeem(ctx, why) {
    const loan = vigilLoan('vigil');
    const it = S.stock.find(x => x.uid === loan.itemUid);
    S.loans = S.loans.filter(l => l !== loan);
    if (it) S.stock = S.stock.filter(x => x !== it);
    change('coin', loan.owed, why);
  },
  release(ctx, name) { if (ctx.vars[name]) releaseUnique(ctx.vars[name]); },
  friendName: () => S.flags.vigilFriend && CAST[S.flags.vigilFriend] ? CAST[S.flags.vigilFriend].name : null,
  // the vigil's test: the Watch Lantern on loan, as Father Ignatius left it
  testLoan() {
    const w = makeUnique('watchLantern'); S.stock.push(w);
    S.loans.push({ id: S.uid++, itemUid: w.uid, who: 'Father Ignatius', look: CAST.ignatius.look, lent: 60, owed: 78, due: 17, returns: false, key: 'vigil' });
  }
});
