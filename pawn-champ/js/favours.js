// Pawn Champ - what friends and enemies do (docs/quests/STANDING.md#3-friends-and-enemies-in-other-scenes).
// Loaded after js/standing.js.
//
// Favours and grudges. When a regular in town becomes a friend (or an enemy), they come in the next
// morning and say so: that's the hear-first line. Then their favour (or grudge) takes effect, once a
// run. Effects that last some days only run while they still feel that way, so mending a grudge
// back to sore ends it. How hard a grudge hits follows STANDING_ROLES[id].harm (1 or 2 bad deals).
//
// Engine moments, for every run with no quest code:
//   police  a friend on the force rings before Captain Barrow's raid; an enemy makes one likelier
//   debt    a friend lends on a Friday you can't cover; an enemy tells people you're short
//   word    once a week, a friend halves a big reputation hit, or an enemy makes it worse
// The other moments (auction, vote, appraise, night, witness) are for stories: ally() and foe().
'use strict';

// Effect kinds, applied by favourApply():
//   shoppers n, days       more (or fewer) shoppers a day
//   sellers n, days        more ordinary sellers a day (n > 0), or fewer ordinary customers (n < 0)
//   find                   tomorrow, the regular brings something in cheap and genuine
//   haggle n, days         sellers' lowest prices move by n (a fraction)
//   rep / coin / heat      straight away
//   fix                    one thing on your shelf goes up a condition
//   reveal                 the truth about one thing on your shelf
//   markdown               the best thing in your window loses a fifth of its value
//   wants n                customers' wanted items come back n days sooner (or later)
//   raid                   (police) the next raid is called off / raids more likely for the month
//   loan                   (debt) a loan on a short Friday
const FAVOURS = {
  tess: {
    favour: { line: 'I told the boats you\'re straight. Anything that comes up in a net this week, they\'ll bring to you first.', fx: [{ k: 'sellers', n: 1, days: 5 }] },
    grudge: { line: 'Word\'s gone round the pier. Nobody on the boats will sell to you this week. I didn\'t have to say much.', fx: [{ k: 'sellers', n: -1, days: 5 }] } },
  ignatius: {
    favour: { line: 'I mentioned you on Sunday. From the pulpit. Kindly. People were awake for once.', fx: [{ k: 'rep', n: 4 }] },
    grudge: { line: 'My sermon on Sunday was on usury. I didn\'t say your name. I didn\'t have to. I looked at the window.', fx: [{ k: 'rep', n: -3 }, { k: 'shoppers', n: -1, days: 2 }] } },
  hester: {
    favour: { line: 'Let me look at your shelf properly. I know where most of this town\'s things came from, and some of them are lying to you.', fx: [{ k: 'reveal' }] },
    grudge: { line: 'I\'ve written to the Gazette about the provenance of a certain piece in your window. They print letters on Thursdays.', fx: [{ k: 'markdown' }] } },
  marguerite: {
    favour: { line: 'Your name came up in the selectmen\'s meeting. I made sure it came up in a good sentence.', fx: [{ k: 'rep', n: 3 }] },
    grudge: { line: 'Your sign is eleven inches over the line on Front Street. It always has been. Today, somebody measured.', fx: [{ k: 'coin', n: -20 }] } },
  dory: {
    favour: { line: 'Something good came up in the dredge. I\'ll bring it by tomorrow. Mates\' rates. Don\'t make it weird.', fx: [{ k: 'find' }] },
    grudge: { line: 'The chain on Route 1 gives me cash on the dock now. I told them why I\'m not coming to you.', fx: [{ k: 'sellers', n: -1, days: 3 }] } },
  dot: {
    favour: { line: 'I\'ve been telling everyone on the walk to the Shack that you\'re honest. Half of them believed me.', fx: [{ k: 'shoppers', n: 1, days: 3 }] },
    grudge: { line: 'I walk past forty people a morning. I\'ve been telling them what I think. That\'s all. Just what I think.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  ruthie: {
    favour: { line: 'I gave you a shout from the mic on trivia night. Round four, the question about you. Everybody got it right.', fx: [{ k: 'shoppers', n: 2, days: 1 }] },
    grudge: { line: 'You\'re barred from the Anchor. And I told the trivia teams why. They\'re very competitive people.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  orsolya: {
    favour: { line: 'I read your cards last night without asking. They are good this week. I have told my clients so.', fx: [{ k: 'shoppers', n: 1, days: 2 }, { k: 'haggle', n: -0.1, days: 2 }] },
    grudge: { line: 'I read your cards last night. I have told my clients what was in them. I did not soften it.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  agathe: {
    favour: { line: 'Give me the worst thing on your shelf. No. The second worst. I\'ll have it back by closing, better.', fx: [{ k: 'fix' }] },
    grudge: { line: 'I\'ve told Water Street I won\'t look at anything that\'s been through your hands. Clocks remember.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  bev: {
    favour: { line: 'The Tuesday league\'s coming in after practice. I said you\'d do them a deal. Do them a deal.', fx: [{ k: 'shoppers', n: 2, days: 1 }] },
    grudge: { line: 'They\'re taking bets at the lanes on how long your shop lasts. I\'m holding the money.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  hal: {
    favour: { line: 'Your PAWN sign was buzzing. It was the transformer. It isn\'t now. You can see it from the bridge.', fx: [{ k: 'shoppers', n: 1, days: 5 }] },
    grudge: { line: 'Your sign\'s going to go. The transformer. I\'ve got the part. I\'m not coming over.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  bettany: {
    favour: { line: 'Everyone who buys a roll before seven gets told about your window. It\'s on the bag now. In pencil.', fx: [{ k: 'shoppers', n: 1, days: 3 }] },
    grudge: { line: 'I\'ve stopped sending people across the street to you. I just stopped. I don\'t want to talk about it.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  skip: {
    favour: { line: 'The parents ask me where to get a cheap bike for Christmas. I tell them. Your name. Every stop.', fx: [{ k: 'shoppers', n: 1, days: 3 }] },
    grudge: { line: 'The parents ask me where to get a cheap bike. I say Route 1. Every stop.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  gordie: {
    favour: { line: 'Listen. If a Friday ever comes up short, you call me. Not the bank. Me. A friend\'s rate, which is no rate.', fx: [{ k: 'loan' }] },
    grudge: { line: 'You\'ll hear my new radio spot. "Why buy used from a pawnshop?" No reason. No reason at all.', fx: [{ k: 'shoppers', n: -1, days: 5 }] } },
  nanFerreira: {
    favour: { line: 'The islanders ask me where to sell what they find in their attics. I tell them. Mind you\'re fair.', fx: [{ k: 'sellers', n: 1, days: 3 }] },
    grudge: { line: 'The islanders ask me where to sell their things. I tell them Hyannis. It\'s a nice ride.', fx: [{ k: 'sellers', n: -1, days: 3 }] } },
  marv: {
    favour: { line: 'I\'ve got a house on Cliff Road to clear. You get first pick before the van leaves. Tomorrow. Early.', fx: [{ k: 'find' }] },
    grudge: { line: 'The clearances go to Plymouth now. The man there calls me Marvin. I hate it. Worth it.', fx: [{ k: 'sellers', n: -1, days: 3 }] } },
  felix: {
    favour: { line: 'The walk stops at your window tonight. I\'ve told them the shop\'s friendly. Spirits and staff.', fx: [{ k: 'shoppers', n: 2, days: 1 }] },
    grudge: { line: 'Stop nine has a new story. It\'s about you. The tourists cross the road.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  gus: {
    favour: { line: 'I sit on the bench outside. When a seller comes out of your door, I tell them they did well. They come back softer.', fx: [{ k: 'haggle', n: -0.15, days: 3 }] },
    grudge: { line: 'I sit on the bench outside. When a seller goes in, I tell them what you paid the last man. They go in harder.', fx: [{ k: 'haggle', n: 0.15, days: 3 }] } },
  dunphy: {
    favour: { line: 'If the Captain\'s ever on her way to your door, I\'ll ring the shop first. You didn\'t hear that.', fx: [{ k: 'raid', n: 0 }] },
    grudge: { line: 'I\'ve put a note on the Captain\'s desk about your back room. Just a note. She reads all her notes.', fx: [{ k: 'raid', n: 1.5 }, { k: 'heat', n: 5 }] } },
  otis: {
    favour: { line: 'Anything coming to your customers, I\'ll get it on the first round. Anything for you, I\'ll knock.', fx: [{ k: 'wants', n: -1 }] },
    grudge: { line: 'Your post goes in the back of the bag now. It gets there. It gets there when it gets there.', fx: [{ k: 'wants', n: 1 }] } },
  leon: {
    favour: { line: 'Your stretch is first on my route now, snow or no snow. And I\'ve told the swap shed you\'re fair. They listen to me up there. It\'s the only place they do.', fx: [{ k: 'shoppers', n: 1, days: 3 }] },
    grudge: { line: 'Your stretch is last on my route. If the bank ends up across your door, that\'s where the snow wanted to go.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  vera: {
    favour: { line: 'There\'s a paragraph about you in Wednesday\'s Gazette. "Around Town". It\'s nice. I checked it with a ruler.', fx: [{ k: 'rep', n: 3 }, { k: 'shoppers', n: 1, days: 1 }] },
    grudge: { line: 'You\'re in the police blotter this week. Nothing illegal. Just described. Accurately.', fx: [{ k: 'rep', n: -3 }, { k: 'shoppers', n: -1, days: 2 }] } },
  rhoda: {
    favour: { line: 'Every guest who asks me where to go in town, I\'m sending to you. They\'ve all got money and none of them know what anything\'s worth.', fx: [{ k: 'shoppers', n: 1, days: 3 }] },
    grudge: { line: 'My guests ask where to buy something old and nice. I tell them Plymouth, hon. It\'s a lovely drive.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  lupe: {
    favour: { line: 'Your card\'s in every bouquet I send out this week. A little one, next to the pine cone. People read the cards. They read them twice.', fx: [{ k: 'rep', n: 2 }, { k: 'shoppers', n: 1, days: 2 }] },
    grudge: { line: 'There are black ribbons in my window this week. If anyone asks me who they\'re for, I tell them.', fx: [{ k: 'shoppers', n: -1, days: 3 }] } },
  hugo: {
    favour: { line: 'Captain Barrow collected her pills this morning. Your name came up. I said you were steady. She listens to her pharmacist, and nobody else.', fx: [{ k: 'heat', n: -8 }] },
    grudge: { line: 'Captain Barrow collected her pills this morning. Your name came up. I told her what I\'ve seen go in your back door. I\'m a pharmacist. I notice doses.', fx: [{ k: 'heat', n: 6 }] } },
  mercy: {
    favour: { line: 'The farms inland ask me where to sell what they dig out of their barns. I\'ve been saying your name first. Mind you\'re fair to them.', fx: [{ k: 'sellers', n: 1, days: 3 }] },
    grudge: { line: 'The farms inland ask me where to sell what\'s in their barns. I say Plymouth now. I say it twice.', fx: [{ k: 'sellers', n: -1, days: 3 }] } }
};

// ---------------------------------------------------------------- state
function favourState() {
  const st = standingState();
  st.fav = st.fav || { opened: {}, fx: [], used: {}, word: null };
  return st.fav;
}
const favourKind = id => isFriend(id) ? 'favour' : isFoe(id) ? 'grudge' : null;
// is the regular who gave this effect still of the same mind? (a mended grudge stops; a friend who
// cools to warm keeps their favour going, a friend who cools further doesn't)
const favourLive = e => e.kind === 'favour' ? isFriend(e.id, 'warm') : isFoe(e.id);
const favourToday = k => S && S.standing && S.standing.fav ? S.standing.fav.fx.filter(e => e.k === k && e.month === monthNum() && dayNum() >= e.from && dayNum() <= e.to && favourLive(e)) : [];
// grudges hit harder from the regulars with power in town (harm 2)
function favourScale(id, kind, e) {
  const h = kind === 'grudge' ? (STANDING_ROLES[id] && STANDING_ROLES[id].harm) || 1 : 1;
  if (h < 2) return e;
  const x = { ...e };
  if (x.days) x.days = x.days + 2;
  if (x.k === 'coin' || x.k === 'rep') x.n *= 2;
  return x;
}

// ---------------------------------------------------------------- the morning visit
// One regular a morning comes in to open their favour or grudge, from week 2 (week 1 is plain trade).
HOOKS.morning.push(async () => {
  if (!S || !S.run || typeof TOWN === 'undefined' || dayNum() < TOWN_TALK_FROM) return;
  const fs = favourState();
  const id = Object.keys(FAVOURS).find(x => favourKind(x) && !fs.opened[x] && townHere(x));
  if (!id) return;
  const kind = favourKind(id), f = FAVOURS[id][kind];
  fs.opened[id] = kind;
  const a = await enterActor(TOWN[id].look, TOWN[id].name);
  await say(a, f.line);
  await leaveShop(a);
  fs.busy = true; // a grudge's own reputation cost isn't a "word" moment
  try { for (const raw of f.fx) favourApply(id, kind, favourScale(id, kind, raw)); } finally { fs.busy = false; }
});

function favourApply(id, kind, e) {
  const fs = favourState(), who = TOWN[id].name;
  const why = kind === 'favour' ? `A favour from ${who}` : `${who}'s grudge`;
  if (e.k === 'rep' || e.k === 'heat') return change(e.k, e.n, why);
  if (e.k === 'coin') return change('coin', e.n, why);
  if (e.k === 'fix') return favourFix(id);
  if (e.k === 'reveal') return favourReveal(id);
  if (e.k === 'markdown') return favourMarkdown(id);
  if (e.k === 'wants') { S.wants = (S.wants || []).map(w => ({ ...w, due: Math.max(dayNum() + 1, w.due + e.n) })); return; }
  // lasting effects: from today (or tomorrow, for a find) for some days
  const from = e.k === 'find' ? dayNum() + 1 : dayNum();
  // effects last at most to the end of this month (day numbers start again when you Stay on)
  fs.fx.push({ ...e, id, kind, month: monthNum(), from, to: e.days ? from + e.days - 1 : e.k === 'find' ? from : WEEKS * 5 });
}

// ---------------------------------------------------------------- one-off effects
function favourFix(id) {
  const cands = S.stock.filter(it => !it.fake && !it.held && it.cond !== undefined && it.cond < CONDITIONS.length - 1);
  if (!cands.length) { toast(`${TOWN[id].name} looked over your shelf. Nothing needs her.`, TOWN[id].look); return; }
  const it = cands.sort((x, y) => y.guide - x.guide)[0];
  const c0 = CONDITIONS[it.cond], c1 = CONDITIONS[it.cond + 1];
  it.guide = Math.round(it.guide / c0.mult * c1.mult); it.cond++; it.condLabel = c1.label;
  toast(`${TOWN[id].name} brought back the ${it.name.toLowerCase()}: now ${c1.label.toLowerCase()}.`, TOWN[id].look);
  log(`${TOWN[id].name} repaired the ${it.name.toLowerCase()} (now ${c1.label})`);
  renderPanel();
}
function favourReveal(id) {
  const liar = S.stock.find(it => (it.fake && !it.knownFake) || (it.stolen && !it.knownHot));
  if (!liar) { toast(`${TOWN[id].name} went along your shelf. "Honest, all of it. How dull."`, TOWN[id].look); return; }
  if (liar.fake) liar.knownFake = true; else liar.knownHot = true;
  liar.clues = liar.clues || [];
  liar.clues.push(liar.fake ? `${TOWN[id].name}: "That's a copy. A good one. Still a copy."` : `${TOWN[id].name}: "That came out of a house that didn't sell it."`);
  toast(`${TOWN[id].name}: the ${liar.name.toLowerCase()} is ${liar.fake ? 'a fake' : 'stolen'}.`, TOWN[id].look);
  renderPanel();
}
function favourMarkdown(id) {
  const it = (typeof forSale === 'function' ? forSale() : S.stock).filter(x => !x.questKey && !x.uniqueId).sort((x, y) => y.guide - x.guide)[0];
  if (!it) return;
  it.guide = Math.round(it.guide * 0.8);
  toast(`After the letter in the Gazette, nobody will pay full price for the ${it.name.toLowerCase()}.`, TOWN[id].look);
  log(`${TOWN[id].name}'s letter knocked a fifth off the ${it.name.toLowerCase()}`);
}

// ---------------------------------------------------------------- effects on the day
// more or fewer shoppers (js/game.js shopperCount)
function standingShoppers() { return favourToday('shoppers').reduce((n, e) => n + e.n, 0); }
// sellers, finds and haggling: on the day's list
HOOKS.day.push(list => {
  if (!S || !S.standing || !S.standing.fav) return;
  let more = 0;
  for (const e of favourToday('sellers')) more += e.n;
  for (let i = 0; i < more; i++) {
    let c = null;
    for (let n = 0; n < 6 && (!c || c.item.fake || c.item.stolen); n++) c = genSeller();
    if (c.item.fake || c.item.stolen) continue;
    c.persona = 'honest';
    list.push(c);
  }
  for (let i = 0; i > more; i--) { // fewer: an ordinary seller or loan who doesn't come
    const k = list.findIndex(c => (c.type === 'seller' || c.type === 'loan') && !c.town && !c.find);
    if (k >= 0) list.splice(k, 1);
  }
  for (const e of favourToday('find')) {
    if (S.standing.fav.used['find:' + e.id]) continue;
    S.standing.fav.used['find:' + e.id] = true;
    let c = null;
    for (let n = 0; n < 8 && (!c || c.item.fake || c.item.stolen); n++) c = genSeller();
    if (c.item.fake || c.item.stolen) continue;
    const it = c.item;
    if (it.cond < CONDITIONS.length - 1) { it.guide = Math.round(it.guide / CONDITIONS[it.cond].mult * CONDITIONS[it.cond + 1].mult); it.cond++; it.condLabel = CONDITIONS[it.cond].label; }
    Object.assign(c, { persona: 'honest', asking: Math.round(it.guide * 0.5), name: TOWN[e.id].name, look: TOWN[e.id].look, find: e.id,
      intro: e.id === 'marv' ? 'First pick, as promised. Out of a house on Cliff Road.' : 'Here. Out of the mud. Mates\' rates.' });
    c.min = Math.round(c.asking * 0.85);
    list.push(c);
  }
  const h = favourToday('haggle').reduce((n, e) => n + e.n, 0);
  if (h) for (const c of list) if ((c.type === 'seller' || c.type === 'loan') && !c.find && c.min) c.min = Math.max(1, Math.min(c.asking, Math.round(c.min * (1 + h))));
});

// ---------------------------------------------------------------- engine moments
// police: called by the morning raid check in js/game.js.
// standingRaid(): the raid chance multiplier (an enemy on the force makes raids likelier).
// standingRaidWarned(): when a raid is about to happen, a friend on the force rings ahead instead
// (once a run). Returns true if the raid is called off.
function standingRaid() {
  if (!S || !S.standing) return 1;
  return favourToday('raid').reduce((m, e) => m * (e.n || 1), 1);
}
function standingRaidWarned() {
  if (!S || !S.standing) return false;
  const fs = favourState();
  const friend = ally('police');
  if (!friend || fs.opened[friend.id] !== 'favour' || fs.used['police:' + friend.id]) return false;
  fs.used['police:' + friend.id] = true;
  toast(`The phone rings: ${friend.name}. "She's on her way." You have ten minutes to tidy the back room.`, friend.look);
  log(`${friend.name} rang ahead of a police raid`);
  change('heat', -10);
  return true;
}

// word: called by change() in js/game.js for a reputation loss of 4 or more. Once a week.
function standingWord(n) {
  if (!S || !S.standing || !S.run) return n;
  const fs = favourState();
  if (fs.word === S.week || fs.busy) return n;
  const f = ally('word'), e = foe('word');
  if (f) { fs.word = S.week; toast(`${f.name} puts in a good word for you around town.`, f.look); return Math.ceil(n / 2); }
  if (e) { fs.word = S.week; toast(`${e.name} makes sure the whole town hears about it.`, e.look); return n - 2; }
  return n;
}

// debt: called by endWeek in js/game.js before the bills. A friend who lends (once a run) is paid
// back the next Friday; an enemy tells people you're short (once a run).
async function standingBeforeBills() {
  if (!S || !S.standing || !S.run) return;
  const fs = favourState();
  const owe = fs.loan;
  if (owe && owe.week < S.week) {
    fs.loan = null;
    const who = TOWN[owe.id];
    if (S.coin >= owe.amt) { change('coin', -owe.amt, `Paid ${who.name} back`); toast(`You pay ${who.name} back. "Pleasure doing business."`, who.look); }
    else { shiftStanding(owe.id, -2, `Couldn't pay ${who.name} back`); toast(`You can't pay ${who.name} back this week. He says it's fine. It isn't.`, who.look); }
  }
  const short = billsDue() - S.coin;
  if (short <= 0) return;
  const f = ally('debt');
  if (f && fs.opened[f.id] === 'favour' && !fs.used['loan:' + f.id]) {
    fs.used['loan:' + f.id] = true;
    const amt = Math.min(40, short);
    const a = await enterActor(TOWN[f.id].look, TOWN[f.id].name);
    await say(a, `I heard you\'re short. Don\'t say anything. Here\'s ${money(amt)}. Next Friday. No rate.`);
    await leaveShop(a);
    change('coin', amt, `${TOWN[f.id].name} lent you ${money(amt)}`);
    fs.loan = { id: f.id, amt, week: S.week };
    return;
  }
  const e = foe('debt');
  if (e && !fs.used['short:' + e.id]) {
    fs.used['short:' + e.id] = true;
    toast(`${e.name} has been telling Front Street you can't make your Friday.`, e.look);
    fs.busy = true; change('rep', -3, `${e.name} told the town you were short`); fs.busy = false;
  }
}
