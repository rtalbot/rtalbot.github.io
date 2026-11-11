// Pawn Champ - The Gentleman in Grey: the code half of js/stories/grey.js (docs/STORY_DATA.md), for
// what the data can't say: the curio engine (Mr. Quillon's curios, his deliveries, the favour each
// sale costs, Orsolya's cards), the hooks the story calls by name, and the daylight graveyard.
// The Grey Page (js/quests/greypage.js) uses makeCurio().
// Its place is drawn in js/places/graveyard.js.
'use strict';

// this file loads before the story file, outside its quest's scope: its own hooks only run in runs
// that drew The Gentleman in Grey
const greyOn = fn => function (...args) { return questActive('grey') ? fn.apply(this, args) : null; };

// Mr. Quillon's curios. Each run he brings a seeded handful (3 to 5) of these ten, and every one sold
// costs its own favour. docs/quests/ITEMS.md section B.
const CURIOS = [
  { name: 'Mirror of Second Chances', icon: 'mirror', guide: 140, effect: 'The woman who bought the Mirror of Second Chances hasn\'t left her house since. She keeps reliving the same Tuesday.',
    favour: { ask: 'Slip this letter under Old Pell\'s door. It says his Ada loved another man. It isn\'t true, of course.',
      done: () => { change('rep', -3); S.flags.pellSqueezed = true; S.flags.pellLetter = true; } } },
  { name: 'Ever-Full Purse', icon: 'purse', guide: 160, effect: 'The man who bought the Ever-Full Purse is rich. His neighbors\' bank accounts are all mysteriously overdrawn.',
    favour: { ask: 'Tie this red ribbon to Merrit Gaunt\'s door. He\'ll think the police are onto him and take it out on everyone.',
      done: () => { change('heat', 6); S.installmentMult[S.week - 1] *= 1.1; S.installmentMult[Math.min(3, S.week)] *= 1.1; } } },
  { name: 'Locket That Remembers', icon: 'necklace', guide: 120, effect: 'The girl who bought the Locket That Remembers can\'t stop remembering. Everything. All at once.',
    favour: { ask: 'Tell Captain Barrow that Sister Amabel has been skimming the children\'s home donations.',
      done: () => { change('rep', -5); S.flags.amabelSlandered = true; } } },
  { name: 'Compass to What You Want', icon: 'compass', guide: 150, effect: 'The man who bought the Compass to What You Want walked into the harbor at low tide. He\'s still walking. The needle keeps pointing further out.',
    favour: { ask: 'Leave this dead gull on the twins\' doorstep, with a note saying the sea wants its amber back.',
      done: () => { change('rep', -2); S.flags.kidsScared = true; S.flags.kidsFair = false; } } },
  { name: 'A Ticket for Any Train', icon: 'qticket', guide: 130, effect: 'The woman who bought the Ticket for Any Train caught one that isn\'t on the timetable. Her sister got a postcard this morning, postmarked 1931.',
    favour: { ask: 'Tell Captain Barrow you saw a boy from the Point breaking into cars. Any boy. She\'ll pick one.',
      done: () => { change('heat', 6); S.flags.barrowLied = true; } } },
  { name: 'Gloves of Perfect Pitch', icon: 'qgloves', guide: 140, effect: 'The man who bought the Gloves of Perfect Pitch can play anything now. He played the church organ all night. He\'s still at it. His fingers are bleeding.',
    favour: { ask: 'Ring the Clam Shack and cancel Skip Fairweather\'s retirement party. Say he\'s changed his mind.',
      done: () => { change('rep', -3); S.flags.skipParty = true; } } },
  { name: 'The Agreeable Chair', icon: 'qchair', guide: 120, effect: 'Everyone who sits in the Agreeable Chair agrees with its new owner. His wife agreed to leave. So did his friends.',
    favour: { ask: 'Tell Gordie Haines that Tess Bascombe has been counting votes against him. Then tell Tess the same about Gordie.',
      done: () => { change('rep', -3); S.flags.selectmenSplit = true; } } },
  { name: 'A Bottomless Teacup', icon: 'qteacup', guide: 110, effect: 'The lady who bought the Bottomless Teacup has been at her kitchen table since Sunday. The tea never runs out, and neither does the afternoon.',
    favour: { ask: 'Pull the plug on the big freezer behind Dory Kittredge\'s fish counter tonight. Plug it back in before dawn, so she never knows why.',
      done: () => { change('rep', -2); S.flags.doryFreezer = true; } } },
  { name: 'The Lucky Penny, 1909', icon: 'coin', guide: 100, effect: 'The boy who bought the Lucky Penny won every coin toss, every scratch card and every parking space for a week. This morning the luck came due. His car is in the harbor.',
    favour: { ask: 'Next time a customer overpays you by mistake, keep it. All of it. And smile.',
      done: () => { change('coin', 25, 'Kept a customer\'s overpayment'); change('rep', -4); S.flags.shortchanged = true; } } },
  { name: 'A Patient Umbrella', icon: 'qumbrella', guide: 90, effect: 'The man who bought the Patient Umbrella has stayed bone dry for a week. It has rained on him, and only him, for a week.',
    favour: { ask: 'Slip the knot on the harbormaster\'s skiff tonight. Just the one knot. The tide will do the rest.',
      done: () => { change('heat', 5); S.flags.skiffLoose = true; } } }
];
const INK = { name: 'Ink That Writes True', icon: 'inkwell', guide: 400 };
// this run's curios, in delivery order: a seeded 3 to 5, always including the Mirror (Mrs. Pryce's scene)
function runCurios() {
  if (!S.flags.curioList) {
    const r = seededRandom(((S.run && S.run.seed) || 'curated') + '/curios');
    const rest = CURIOS.slice(1).map(c => [r(), c]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
    const n = 3 + Math.floor(r() * 3);
    const pick = [CURIOS[0], ...rest.slice(0, n - 1)];
    // the Mirror goes in first or second, so Mrs. Pryce's scene has time to happen
    if (r() < 0.5) [pick[0], pick[1]] = [pick[1], pick[0]];
    S.flags.curioList = pick.map(c => CURIOS.indexOf(c));
  }
  return S.flags.curioList.map(i => CURIOS[i]);
}
function curioByName(name) { return CURIOS.find(x => x.name === name); }
// the favour owed next: the oldest sale not yet paid for
function nextFavour() {
  const q = S.flags.favourQueue || [];
  if (q.length) return CURIOS[q[0]].favour;
  const list = runCurios(), sold = list.find(c => S.stock.some(x => x.curio && x.name === c.name));
  return (sold || list[Math.min(S.flags.curiosGiven || 0, list.length - 1)]).favour;
}
function makeCurio(c, nosale) {
  return { uid: S.uid++, key: 'curio', name: c.name, icon: c.icon, cat: 'curio', cond: 3, condLabel: 'Uncanny', guide: c.guide,
    fake: false, stolen: false, noticeId: null, mark: null, filed: false, paid: 0, inspected: true, knownFake: false, knownHot: false,
    clues: [{ text: 'It hums. It is warm, like a cup someone just put down.' }], held: null, curio: true, nosale: !!nosale };
}

// ---------------------------------------------------------------- the engine: favours and deliveries
HOOKS.morning.push(greyOn(async () => {
  if (!S.flags.devil || S.flags.devilDone) return;
  // favours owed for curios sold
  if (!S.flags.favourQueue) S.flags.favourQueue = [];
  while (S.flags.favourQueue.length) {
    const f = CURIOS[S.flags.favourQueue.shift()].favour;
    const q = await enterActor(CAST.quillon.look, CAST.quillon.name);
    await say(q, 'A curio sold, and a favour falls due. A small one.');
    await say(q, f.ask);
    const i = await choose(['Do it', `Refuse (he'll take ${money(Math.min(60, S.coin))} instead)`]);
    if (i === 0) { f.done(); S.flags.cruel++; await say(q, 'You see? Hardly anything at all.'); }
    else { change('coin', -Math.min(60, S.coin), 'Mr. Quillon balanced the books'); S.flags.refusedFavours = (S.flags.refusedFavours || 0) + 1; await say(q, 'Then the books must balance some other way.'); }
    await leaveShop(q);
  }
  // deliveries
  if (S.week === 4 && S.day === 1 && !S.flags.inkGiven) {
    S.stock.push(makeCurio(INK, true)); S.flags.inkGiven = true;
    toast('A gift on the counter: Ink That Writes True. "Not for sale. - Q."', null, 'inkwell');
  } else if (S.flags.curiosGiven < runCurios().length && shelfFree() && !(S.week === 2)) {
    const c = runCurios()[S.flags.curiosGiven];
    S.stock.push(makeCurio(c)); S.flags.curiosGiven++;
    toast(`A delivery from Mr. Quillon: ${c.name}`, CAST.quillon.look);
  }
  renderPanel();
}));

HOOKS.sold.push(greyOn((it) => {
  if (!it.curio) return;
  const c = curioByName(it.name);
  if (c) (S.flags.favourQueue = S.flags.favourQueue || []).push(CURIOS.indexOf(c));
  if (c) setTimeout(() => toast(c.effect, null, c.icon), 1500);
}));
HOOKS.sold.push(greyOn((it) => {
  if (!it.curio || it.name === INK.name) return;
  S.flags.curioSales = (S.flags.curioSales || 0) + 1;
  if (it.name === CURIOS[0].name) S.flags.mirrorSold = true;
}));
// the cards warn you which favour is next
HOOKS.morning.push(greyOn(async () => {
  if (!S.flags.orsolyaCards || !S.flags.devil || S.flags.devilDone || S.day !== 1) return;
  const f = nextFavour();
  toast(`Orsolya's cards, under your door: "His next favour: ${f.ask.split('.')[0].toLowerCase()}."`, CAST.orsolya.look);
}));

storyHooks('grey', {
  runCurios() { runCurios(); },
  tone() { Sound.tone(110, 0.8, 'sawtooth', 0.04); },
  inkHere: () => S.stock.some(x => x.name === INK.name),
  // the cavern below the arcade (js/places/below.js): how the Proprietor is drawn (devil, laugh)
  below(ctx, w) { Object.assign(BELOW, w); },
  // down the stairs: fade out, the cavern, the Proprietor asleep, you and Quillon at the bottom
  async downstairs(ctx) {
    await fadeOut();
    view.bg = 'below'; BELOW.devil = 0; BELOW._d = 0; BELOW.laugh = false;
    const k = ctx.vars.you, q = ctx.vars.quillon;
    k.x = k.tx = 110; k.y = k.ty = 170; q.x = q.tx = 196; q.y = q.ty = 166; q.facingLeft = true;
  },
  fadeIn() { return fadeIn(); },
  cancelDebt() { S.installmentMult[3] = 0; },
  // Abner's clause: every curio goes back
  handBackCurios() { S.stock = S.stock.filter(x => !x.curio); },
  // Mrs. Pryce sells the Mirror back: it's yours again, not for sale, and the sale is undone
  mirrorBack() {
    S.stock.push(makeCurio(CURIOS[0], true)); S.flags.curioSales = Math.max(0, (S.flags.curioSales || 1) - 1); S.flags.mirrorBack = true;
  },
  testCoin(ctx, n) { S.coin = n; }
});

// Your soul, at the end: the ending's title, and its first line
HOOKS.ending.push(greyOn((title, lines) => {
  if (!S.flags.soulSold) return;
  lines.unshift('The Crooked Scale never closes now. The customers keep coming and the shelves are never empty. Sometimes you catch your reflection in the window and it is a little bit grey.');
  return 'The Keeper in Grey';
}));

