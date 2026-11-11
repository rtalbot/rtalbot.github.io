// Pawn Champ - The Benefit: the code half of js/stories/benefit.js (docs/STORY_DATA.md): the roof fund
// and the hooks it calls by name. The attic's boxes and their lines are in the story; sorting them, and
// Father Ignatius collecting from your shelves, are loops over what's there, so they play here.
'use strict';

// ---- shared by batch A's quest files (loaded first of them, see index.html)
const BATCH_A = {
  // "tonight", "Thursday", "next Tuesday", "Monday of week 4"
  when(d) {
    if (!d) return 'one night soon';
    if (d === dayNum()) return 'tonight';
    const w = Math.ceil(d / 5), wd = DAYS[(d - 1) % 5];
    return w === S.week ? wd : w === S.week + 1 ? `next ${wd}` : `${wd} of week ${w}`;
  },
  nightOf(id) { return S.run && S.run.nights ? S.run.nights[id] : null; },
  // a few icons for batch A's unique items
  icons: {
    spoon: ['....kkkk....', '...kSSssk...', '...kSdysk...', '...ksyysk...', '....kssk....', '.....kk.....',
      '.....ksk....', '.....ksk....', '.....kSk....', '....ksSsk...', '....ksssk...', '.....kkk....'],
    snowglobe: ['....kkkk....', '..kkBBBBkk..', '.kBBcBBcBBk.', '.kBcBBBBcBk.', 'kBBBBgBBBBBk', 'kBBBggGBBcBk',
      'kBcBgggBBBBk', '.kBBBwBBBBk.', '..kkcccckk..', '..kwwwwwwk..', '.kWWWWWWWWk.', '.kkkkkkkkkk.'],
    dauber: ['....kkkk....', '....krrk....', '....kRrk....', '...kkkkkk...', '...kvVVvk...', '...kvVVvk...',
      '...kvvvvk...', '...kvVvvk...', '...kvvvvk...', '...kvvvvk...', '...kkkkkk...', '............'],
    lacquerbox: ['............', '............', '..kkkkkkkk..', '.krrrrrrrrk.', '.kyyyyyyyyk.', '.kkkkkkkkkk.',
      '.krrrrrrrrk.', '.krryyyyrrk.', '.krrykkyrrk.', '.krryyyyrrk.', '.kkkkkkkkkk.', '............'],
    tin: ['............', '............', '..kkkkkkkk..', '.kbbbbbbbbk.', '.kBBBBBBBBk.', '.kkkkkkkkkk.',
      '.kbbyybbbbk.', '.kbyYybbbbk.', '.kbbyybbbbk.', '.kbbbbbbbbk.', '.kkkkkkkkkk.', '............']
  }
};
for (const [k, v] of Object.entries(BATCH_A.icons)) if (!ICONS[k]) ICONS[k] = v;

// ---- the roof fund (S.flags.benefitPot), which other stories add to as well (bingo, spoons)
const BENEFIT_GOAL = 600;
const benefitPot = () => S.flags.benefitPot || 0;
function benefitAdd(n, why) {
  S.flags.benefitPot = benefitPot() + Math.round(n);
  if (why) toast(`${why} The roof fund stands at ${money(benefitPot())} of ${money(BENEFIT_GOAL)}.`, CAST.amabel.look);
}
const benefitMeetingDay = () => (typeof HUBS !== 'undefined' && HUBS.meeting ? BATCH_A.nightOf('hub-meeting') : BATCH_A.nightOf('benefit-meeting'));

storyHooks('benefit', {
  // the fund starts with what Saint Brine's had, and what you gave Sister Amabel for the roof
  startPot() { S.flags.benefitPot = 120 + (S.flags.charity === 2 ? 20 : S.flags.charity === 1 ? 5 : 0); },
  pot: () => benefitPot(),
  setCoin(ctx, n) { S.coin = n; },
  carryingLight: () => carrying('light'),
  carryingRead: () => carrying('read'),
  // Town Meeting: "tonight", "Thursday", "next Tuesday"...
  meetingWhen: () => BATCH_A.when(benefitMeetingDay()),
  meetingHub: () => !!HUBS.meeting,
  // the attic: look closely at three boxes (four with a light, five with a glass too), then lot each
  // treasure you found or buy it yourself at the junk price. "kept" is how many you bought.
  // with: { lots: [{ id, box, look, guide, junk, treasure }], treasure, lot, buy, buyHint, bought }
  async sortAttic(ctx, w) {
    const looks = 3 + (ctx.vars.lit ? 1 : 0) + (ctx.vars.glass ? 1 : 0);
    const seen = new Set();
    for (let n = 0; n < looks; n++) {
      const left = w.lots.filter(l => !seen.has(l));
      const i = await choose(left.map(l => l.box));
      const l = left[i]; seen.add(l);
      await narrate(l.look);
      if (l.treasure) await say(ctx.vars.dulcie, storyText(w.treasure, ctx));
    }
    let pot = 0;
    const kept = [];
    for (const l of w.lots) {
      if (!seen.has(l) || !l.treasure) { pot += seen.has(l) ? l.guide : Math.max(l.junk, Math.round(l.guide * 0.3)); continue; }
      ctx.vars.lot = l;
      const i = await choose([{ label: storyText(w.lot, ctx) },
        { label: storyText(w.buy, ctx), hint: storyText(w.buyHint, ctx), disabled: S.coin < l.junk }]);
      if (i === 0) pot += l.guide;
      else kept.push(l);
    }
    for (const l of kept) {
      const it = makeUnique(l.id); it.paid = l.junk; it.inspected = true; it.clues = (it.tells || []).map(t => ({ text: t, cls: 'good' }));
      ctx.vars.it = it;
      S.stock.push(it); change('coin', -l.junk, storyText(w.bought, ctx));
      S.flags.benefitSkimmed = (S.flags.benefitSkimmed || 0) + 1;
    }
    benefitAdd(pot);
    S.flags.benefitAttic = true;
    ctx.vars.kept = kept.length;
  },
  // what Lois Pruett nearly sold you: one of these, at random
  donation(ctx, keys) { ctx.vars.item = makeItem(pick(keys), { cond: 2 }); },
  // to the roof fund: { "item": a name in the scene, "why": the pop-up's first words }
  roof(ctx, w) { benefitAdd(ctx.vars[w.item].guide, storyText(w.why, ctx)); },
  // haggle to buy the item instead: "bought" is 'deal' or not
  async buyIt(ctx) {
    const item = ctx.vars.item, a = ctx.vars.donor;
    const cc = { item, persona: 'honest', asking: Math.round(item.guide * 0.6), min: Math.round(item.guide * 0.45), name: a.name, look: a.look };
    const r = await negotiate(cc, a, 'buy');
    hideCard();
    if (r.result === 'deal') buyItem(cc, r.price);
    ctx.vars.bought = r.result;
  },
  // Father Ignatius asks three times for something off your shelves
  // with: { give, hint, none, enough, why, thanks: [the first time, after] }
  async collect(ctx, w) {
    for (let n = 0; n < 3; n++) {
      const items = forSale().filter(it => !it.questKey).slice(0, 4);
      if (!items.length) break;
      const i = await choose([...items.map(it => { ctx.vars.it = it; return { label: storyText(w.give, ctx), hint: storyText(w.hint, ctx) }; }), storyText(n ? w.enough : w.none, ctx)]);
      if (i === items.length) break;
      const it = items[i];
      ctx.vars.it = it;
      S.stock = S.stock.filter(x => x !== it);
      benefitAdd(it.guide, storyText(w.why, ctx));
      change('rep', 1); log(`Donated ${it.name} to the Benefit Auction`);
      await say(ctx.vars.ignatius, storyText(w.thanks[n === 0 ? 0 : 1], ctx));
    }
  },
  // the auction: Sister Amabel stays on the stage the evening opened with
  keepAmabel(ctx) { BATCH_A.auctionCast = { am: ctx.vars.amabel }; },
  amabelHere(ctx) {
    ctx.vars.amabel = (BATCH_A.auctionCast || {}).am || makeActor(CAST.amabel.look, 170, 160, { name: CAST.amabel.name, facingLeft: true });
  },
  // what the lots fetch: the fund so far, times how the bidding goes, kept back into the fund at the end
  potStart(ctx) { ctx.vars.pot = benefitPot(); },
  potTimes(ctx, n) { ctx.vars.pot *= n; },
  potStore(ctx) { S.flags.benefitPot = Math.round(ctx.vars.pot); },
  potReached: () => benefitPot() >= BENEFIT_GOAL,
  // friends and grudges (docs/quests/STANDING.md): a regular who likes you bids the room up ("pal");
  // one who doesn't talks it down ("rival"). Father Ignatius is busy.
  crowd(ctx) {
    ctx.vars.pal = (typeof ally === 'function' && ally('auction', { exclude: ['ignatius'] })) || null;
    ctx.vars.rival = (!ctx.vars.pal && typeof foe === 'function' && foe('auction', { exclude: ['ignatius'] })) || null;
  },
  ignatiusCard: () => cardReady('ignatius'),
  gavelCard: () => cardReady('gavel'),
  playCard(ctx, id) { playCard(id); },
  // Article 9 plays in whichever hall Town Meeting is in
  meetingRoom() {
    if (view.bg !== 'townhall' && view.bg !== 'grange') { view.bg = PLACES.townhall ? 'townhall' : 'grange'; }
    view.sign = view.bg === 'grange' ? 'TOWN MEETING' : view.sign;
  }
});

// Fallback: Town Meeting as a night of its own (the story's benefitMeetingNight), only while there's no
// Town Meeting hub (batch D).
// Registered once every script has loaded, so it only exists when batch D's hub doesn't.
addEventListener('load', () => {
  if (HUBS.meeting) return;
  questNight({ id: 'benefit-meeting', quest: 'benefit', window: ['4-1', '4-4'], when: () => !HUBS.meeting && !!S.flags.benefitAsked && !S.flags.benefitEnd, run: () => story.benefitMeetingNight(),
    test: () => { S.flags.benefitAsked = true; S.flags.benefitArticle9 = true; S.flags.benefitPot = 640; S.flags.benefitRoof = true; S.flags.ledger = true; } });
});
