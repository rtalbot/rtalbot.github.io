// Pawn Champ - The Selectmen's Race: the code half of js/stories/selectmen.js (docs/STORY_DATA.md), for
// what the data can't say: the shoppers a window sign brings, the clambake loan, the count at Town
// Meeting, and Gordie's fee, which outlasts the story.
'use strict';

const SELECT_MARINE = ['compass', 'spyglass', 'watch', 'tome', 'musicbox'];

// The lean is positive for Tess and negative for Gordie.
function selectLean() {
  let lean = S.flags.signFor === 'tess' ? 2 : S.flags.signFor === 'gordie' ? -2 : 0;
  if (questActive('fog') && QUESTS.fog && (S.flags.mottHappy || S.flags.ghostFair || S.flags.ghostFriend)) lean += 2; // M3 + M11
  if (S.flags.fogTess) lean += 1; // you checked in the dead at Tess's ferry landing (M3)
  return lean + (S.flags.meetingSpeech || 0);
}

storyHooks('selectmen', {
  fair: () => typeof HUBS !== 'undefined' && !!HUBS.fair, // the Harvest Fair (js/stories/freezer.js) has the clambake
  meetingInRun: () => !!S.run && hubInRun('meeting', S.run),
  stamp(ctx, flag) { S.flags[flag] = dayNum(); },
  sinceSign: () => dayNum() - S.flags.signDay,
  forSale: () => forSale().length,
  // The window sign brings its own regulars: Tess's are fishing families selling (mostly marine goods),
  // Gordie's are boardwalk money that buys high and haggles hard.
  pickSeller(ctx) {
    let s = genSeller();
    for (let k = 0; k < 4 && !SELECT_MARINE.includes(s.item.key); k++) s = genSeller();
    ctx.vars.seller = Object.assign(s, { actor: ctx.c.actor, name: ctx.c.name, look: ctx.c.look });
  },
  sell: ctx => runSeller(ctx.vars.seller),
  buy: ctx => runShopper({ ...genShopper(), sharp: true, actor: ctx.c.actor, name: ctx.c.name, look: ctx.c.look }),
  // Gordie's class ring, lent against at the clambake: he pays back $78 in five days
  ringLoan() {
    const item = makeUnique('classRing');
    item.inspected = true; item.clues = (item.tells || []).map(x => ({ text: x, cls: 'good' }));
    grantLoan({ item, name: CAST.gordie.name, look: CAST.gordie.look }, 60, dayNum() + 5, true);
  },
  // the clambake on its own night, at the Clam Shack: the deck without the arch
  noArch() { PLACES.clamshack.arch = false; },
  evening() { Sound.music('night'); },
  // the moderator's view of you (docs/quests/STANDING.md, the vote moment): a friend in the chair lets
  // your word land ("friend"); one who isn't cuts you off at the bell ("foe")
  chair(ctx) {
    const chair = ally('vote', { prefer: ['marguerite'], exclude: ['tess', 'gordie'] });
    const cold = !chair && foe('vote', { prefer: ['marguerite'], exclude: ['tess', 'gordie'] });
    ctx.vars.chair = chair && chair.id === 'marguerite' ? 'friend' : cold && cold.id === 'marguerite' ? 'foe' : null;
  },
  louder() { S.flags.meetingSpeech *= 2; },
  // the ballot: the lean, your question at the debate, and the town making up its own mind, a little
  count(ctx) {
    const swing = S.flags.debateSwing || 0;
    const noise = Math.random() * 2 - 1;
    const before = selectLean() + noise, lean = before + swing;
    const tessWins = lean > 0;
    S.flags.selectWin = tessWins ? 'tess' : 'gordie';
    if (swing && (before > 0) !== tessWins) S.flags.selectKing = true; // your question at the debate turned it
    const margin = Math.max(3, Math.round(Math.abs(lean) * 9 + Math.random() * 12));
    const win = 640 + Math.round(Math.random() * 40), lose = win - margin;
    ctx.vars.bascombe = tessWins ? win : lose; ctx.vars.haines = tessWins ? lose : win;
  },
  // Marguerite's box of campaign buttons, bought for the coffee fund
  buyButtons(ctx) { const a = ctx.vars.marguerite; buyItem({ item: makeUnique('campaignButtons'), name: a.name, look: a.look, persona: 'honest' }, 30); },
  testCoin(ctx, n) { S.coin = n; }
});

// Gordie wins: a "commercial improvement fee" on every Friday's rent from then on, through the rest of
// a stay too, until the arc takes it off (selectFeeOff, js/quests/selectarc.js). Not the story's: it
// outlasts it.
HOOKS.morning.push(async () => {
  if (S.flags.selectWin !== 'gordie' || S.flags.selectFeeOff || S.day !== 5) return;
  if (!questActive('selectmen') && monthNum() < 2) return;
  S.rentArrears += 10;
  toast('The new commercial improvement fee: +$10 on this week\'s rent', CAST.gordie.look);
});
