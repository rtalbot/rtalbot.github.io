// Pawn Champ - cards: what you carry into the next month. Design: docs/CARDS.md.
//
// Finishing a month earns cards (from story endings, the main ending, aims and habits). Every card
// earned is kept in the card file (the Storybook save), and at New game the player picks a hand of
// 1 to 3. Everything here sits behind FEATURES.cards (js/data.js): with the flag off, hasCard() is
// always false, nothing is shown, and the game plays as it did before cards. Cards earned while the
// flag is off are still recorded, quietly.
'use strict';
endQuestScope(); // anything defined here belongs to no quest

// `?cards=1` or `?cards=0` on the URL overrides the flag for one session
(function () {
  try { const v = new URLSearchParams(location.search).get('cards'); if (v === '1' || v === '0') FEATURES.cards = v === '1'; } catch (e) { /* no URL */ }
})();
function cardsOn() { return !!FEATURES.cards; }

const CARD_ICON = '\u{1F5C2}';
const HAND_SIZES = [[6, 3], [3, 2], [0, 1]]; // [months finished, hand size]
const SUITS = {
  friend: { name: 'Friend', blurb: 'Someone who trusts you, or owes you.' },
  paper: { name: 'Paper', blurb: 'A document. One per hand.' },
  keepsake: { name: 'Keepsake', blurb: 'Something you start the month with.' }
};

// The cards. `quest` + `endings`: earned when that quest in this run reaches one of those endings.
// `check(title)`: earned when it returns true at the end of a finished month. `once`: used up when
// played. `earned` is the line shown when it's dealt; `hint` is shown in the Storybook until then.
const CARDS = {
  // ---- the main story and the aims (they work in every run)
  loupe: { title: 'Odile\'s Loupe', suit: 'keepsake', check: t => t === 'Free and Clear',
    text: 'Once a day, a close look at a piece of jewelry doesn\'t use a loupe.',
    earned: 'Odile gives you her own loupe. "It\'s seen more lies than you have. Use it."', hint: 'Bring Odile home with the proof.' },
  merrit: { title: 'A Note for Merrit', suit: 'paper', once: true, check: t => t === 'Family Business',
    text: 'One installment can be a week late without a strike. It\'s added to the next one.',
    earned: 'Odile writes a note on shop paper: "Merrit. Give the kid a week. You owe me that."', hint: 'Bring Odile home.' },
  amabel: { title: 'Sister Amabel Vouches for You', suit: 'friend', check: t => t === 'Pillar of the Community',
    text: 'The first time each week you call the police on an honest customer, it costs no reputation.',
    earned: 'Sister Amabel tells anyone who\'ll listen that you\'re careful, not cruel.', hint: 'Be the town\'s fairest dealer.' },
  wren: { title: 'Wren\'s Number', suit: 'friend', check: t => t === 'Friend of the Night Market',
    text: 'Wren makes her offer even if you crossed her, and pays 10% more when you fence.', price: 'You start the month at 20 heat.',
    earned: 'A number on a napkin, no name. You know whose it is.', hint: 'Do a lot of quiet business after dark.' },
  standing: { title: 'Still Standing', suit: 'paper', check: t => t === 'Still Standing',
    text: 'Start the month with $25 more. You\'ve done this before.',
    earned: 'You kept the doors open. That\'s worth something.', hint: 'Just make it through a month.' },
  pell: { title: 'Pell\'s Word', suit: 'friend', check: () => S.flags.pellLoans >= 3 && !S.flags.pellSqueezed,
    text: 'Old Pell tells you about the blue light after one fair loan, not two.',
    earned: 'Old Pell says you\'re Odile\'s people. He tells the other fishermen so.', hint: 'Be fair to Old Pell, every time.' },
  barrow: { title: 'Captain Barrow Owes You', suit: 'friend', once: true, check: () => S.flags.reports >= 3,
    text: 'When Barrow comes about the crate, you can call in the favour and she leaves.',
    earned: 'Captain Barrow leaves her card. On the back: "I owe you one. ONE."', hint: 'Help the police, more than once.' },
  twins: { title: 'The Twins Are Loyal', suit: 'friend', check: () => !!S.flags.kidsFair,
    text: 'Lark and Linnet bring you one extra find in week 2, cheap.',
    earned: 'Lark and Linnet decide you\'re their shop, for life.', hint: 'Pay the twins what their find is worth.' },
  gazette: { title: 'A Write-Up in the Gazette', suit: 'paper', check: () => tierIndex() === 3,
    text: 'One extra shopper every Monday.',
    earned: 'The Hollow Neck Gazette runs half a page on The Crooked Scale. Someone frames it.', hint: 'End the month as a Hollow Neck Institution.' },
  fathom: { title: 'Mister Fathom', suit: 'friend', check: () => !!(S.habits && S.habits.cat.days >= WEEKS * 5),
    text: 'The cat starts the month with his name, and three days into the pet streak.',
    earned: 'Mister Fathom has decided you\'re staff.', hint: 'Look after the cat. Every single day.' },

  // ---- the major quests
  ignatius: { title: 'Father Ignatius Trusts You', suit: 'friend', quest: 'benefit', endings: ['saved'], once: false,
    text: 'Every Tuesday a parishioner brings you something to sell, at a fair price. At the Benefit Auction he can plant the bidder himself, never caught.',
    earned: 'Father Ignatius writes his number on a raffle ticket. "Call me. Left ear."', hint: 'Save Saint Brine\'s.' },
  abatement: { title: 'Tax Abatement', suit: 'paper', quest: ['benefit', 'selectmen'], endings: ['saved', 'kingmaker'],
    text: 'Rent is $10 a week less.',
    earned: 'The selectmen vote you a small abatement. "For services to the town."', hint: 'Win the room at Town Meeting.' },
  hollis: { title: 'Hollis\'s Thank-You Note', suit: 'friend', quest: 'hollis', endings: ['promoted'],
    text: 'Every Wednesday Hollis brings a lot from a Customs auction, at half its guide.',
    earned: 'Hollis sends a card with a stopped watch on the front. Inside: "Never late again. Thank you."', hint: 'Get a clerk his promotion.' },
  crane: { title: 'Crane\'s Business Card', suit: 'friend', quest: 'hollis', endings: ['hush'], once: true,
    text: 'Once, when your heat reaches 50, Crane makes a call and it drops by 10.', price: 'People see the Customs car outside: -3 reputation.',
    earned: 'Deputy Director Crane\'s card, with a cell number written on the back.', hint: 'Sell a man your silence.' },
  clause: { title: 'A Clause of Your Own', suit: 'paper', quest: 'grey', endings: ['rewritten'],
    text: 'If Mr. Quillon comes, his contract has an exit: buy your soul back for $150, not $300.',
    earned: 'A scrap of contract, in ink that won\'t lie: your own exit clause.', hint: 'Rewrite a contract nobody can rewrite.' },
  callingCard: { title: 'Mr. Quillon\'s Calling Card', suit: 'friend', quest: 'grey', endings: ['keeper'],
    text: 'Curios sell for 10% more.', price: 'The cat won\'t sit on the counter.',
    earned: 'A grey card, warm to the touch. It has no name on it, and you know the name.', hint: 'Keep a bargain you shouldn\'t have made.' },
  mott: { title: 'Captain Mott\'s Good Word', suit: 'friend', quest: 'fog', endings: ['compass'],
    text: 'At the ghost market, the dead pay 20% more.',
    earned: 'Captain Mott tells every ghost in Hollow Neck about you. Loudly. From the wall.', hint: 'Get a drowned man his compass back.' },
  doubloon: { title: 'A Doubloon', suit: 'keepsake', quest: 'fog', endings: ['tycoon'],
    text: 'Start with a ghost doubloon in the back room. It can be sold from week 2.',
    earned: 'One of the dead paid you in real gold, by mistake.', hint: 'Make a fortune at the ghost market.' },
  pye: { title: 'Professor Pye\'s Card', suit: 'friend', quest: 'psalter', endings: ['amber', 'silver', 'ink'],
    text: 'If the Grey Psalter is in your month, Professor Pye comes a week early, before the Shepherd asks for the amber.',
    earned: 'Professor Pye\'s card: Department of Regrettable Books. "Call me before, next time."', hint: 'Break the Psalter\'s curse cleanly.' },
  sea: { title: 'The Sea Remembers', suit: 'keepsake', quest: 'freezer', endings: ['sea'],
    text: 'A pearl on your doorstep the first Monday.',
    earned: 'Something out past the breakwater still hums your name.', hint: 'Give the thing in the freezer back to the sea.' },
  pomfret: { title: 'Dr. Pomfret\'s Wanted List', suit: 'friend', quest: 'freezer', endings: ['sold'],
    text: 'Every Thursday Dr. Pomfret comes looking for collectibles, and pays 1.3 times the guide.',
    earned: 'Dr. Pomfret sends a list of "specimens of interest". It is four pages long.', hint: 'Sell something that hums.' },
  thorne: { title: 'Thorne\'s Standing Order', suit: 'friend', quest: 'spoons', endings: ['thorne'],
    text: 'If the spoons are in your month, Ellery Thorne pays $50 a spoon, not $40.',
    earned: 'Ellery Thorne\'s card: "For any future spoon emergencies."', hint: 'Find all seven spoons for the man who wants them.' },
  rook: { title: 'Rook Owes You', suit: 'friend', quest: 'spoons', endings: ['rook'], once: true,
    text: 'In week 2, Delphine Rook comes in and buys from your best shelf at full guide.',
    earned: 'Delphine Rook: "I don\'t forget a good deal. Or a bad one."', hint: 'Sell the set to the other collector.' },
  sideb: { title: 'Side B', suit: 'keepsake', quest: 'breakwaters', endings: ['odile'],
    text: 'Start with the Breakwaters\' cassette. In week 3 you find a tape deck in the back room, and the song points to Gull Point.',
    earned: 'Dee gives you a copy of side B. "Odile should have it. Until then, you."', hint: 'Hear the song about Odile.' },
  detector: { title: 'Dutch\'s Detector', suit: 'keepsake', quest: 'twins', endings: ['classOf38'],
    text: 'Rummaging the boxes finds a rare thing twice as often.',
    earned: 'Dutch leaves you his old metal detector, and a lecture on coil sizes.', hint: 'Give the town back its time capsule.' },
  lusk: { title: 'Dr. Lusk\'s Eye', suit: 'friend', quest: 'museum', endings: ['both'],
    text: 'One more loupe use every Monday: Dr. Lusk looks something over for you.',
    earned: 'Dr. Lusk: "If you ever need a second opinion, I\'m usually right."', hint: 'Catch the thief and the buyer.' },
  tess: { title: 'Tess\'s Harbor Pass', suit: 'friend', quest: 'radio', endings: ['homecoming'],
    text: 'Every Monday, when the boats are in, the fishing families send you an extra seller.',
    earned: 'Tess Bascombe tapes a harbor pass to your till. The fleet notices.', hint: 'Bring a lost man home on the first ferry.' },
  gordie: { title: 'Gordie\'s Jingle', suit: 'paper', quest: 'selectmen', endings: ['haines'],
    text: 'One extra shopper every day.', price: 'Rent is $5 a week more (the "commercial improvement fee").',
    earned: 'Gordie Haines writes your shop into a jingle. You will never get it out of your head.', hint: 'Put a car dealer on the Select Board.' },
  gavel: { title: 'Marguerite\'s Gavel', suit: 'friend', quest: 'selectmen', endings: ['bascombe'], once: true,
    text: 'At Town Meeting, the moderator can call the vote on Article 9 before the Hand says a word.',
    earned: 'Marguerite Oyelaran nods at you on the street. In Hollow Neck that\'s a medal.', hint: 'Elect the harbormaster.' },

  // ---- the minor quests (small cards)
  dauber: { title: 'Lucky Dauber', suit: 'keepsake', quest: 'bingo', endings: ['full'], once: true,
    text: 'Once, a day with no closing-time sale gets one anyway.',
    earned: 'A bingo dauber that has never missed. Probably magnetic.', hint: 'Call a full house.' },
  ned: { title: 'Captain Ned Remembers You', suit: 'friend', quest: 'ned', endings: ['encore'], once: true,
    text: 'Once, Captain Ned does the talking for you: a seller\'s lowest price drops by 40%.',
    earned: 'Captain Ned would like you to know he remembers you. His jaw clacks.', hint: 'Get a dummy an encore.' },
  pinwheel: { title: 'A Seat at Pinwheel Lanes', suit: 'friend', quest: 'candlepin', endings: ['strike'],
    text: 'Every Friday someone from the candlepin league comes in to buy, and pays the full guide.',
    earned: 'A league shirt with your name on the back, spelled nearly right.', hint: 'Bowl a strike.' },
  overdue: { title: 'An Overdue Slip', suit: 'paper', quest: 'overdue', endings: ['returned'],
    text: 'A close look at a book never uses a loupe. Hester Quint taught you what to look for.',
    earned: 'Hester Quint forgives your overdue fines, in writing.', hint: 'Return a book, at last.' }
};
// ---- Friend cards for the regulars (docs/quests/STANDING.md, phase 6). End a finished month with a
// regular at friend and you earn their card; with it in your hand, they start the next month warm,
// one good turn from friend. It's the only way standing outlasts a run (Rich, 2026-11-01).
// Tess and Father Ignatius already have Friend cards from their stories, which also count.
const FRIEND_CARD_FOR = { tess: 'tess', ignatius: 'ignatius' };
const FRIEND_START = 3; // warm, the most talk and counter deals can reach
(function addFriendCards() {
  if (typeof STANDING_ROLES === 'undefined') return;
  for (const id of Object.keys(STANDING_ROLES)) {
    if (FRIEND_CARD_FOR[id]) { CARDS[FRIEND_CARD_FOR[id]].friendOf = id; continue; }
    const name = (typeof TOWN !== 'undefined' && TOWN[id] && TOWN[id].name) || (CAST[id] && CAST[id].name) || id;
    const favour = STANDING_ROLES[id].favour;
    CARDS['friend-' + id] = { title: `${name}, a Friend`, suit: 'friend', friendOf: id, warmStart: id,
      text: `If ${name} is in town this month, the month starts warm between you. One good turn makes a friend, and the favour opens: ${favour.charAt(0).toLowerCase() + favour.slice(1)}`,
      earned: `${name} says to call any time. It's meant.`, hint: `End a month with ${name} as a friend.` };
  }
})();
// Tess's and Ignatius's story cards start them warm too
for (const id of Object.keys(FRIEND_CARD_FOR)) if (CARDS[FRIEND_CARD_FOR[id]] && CARDS[FRIEND_CARD_FOR[id]].friendOf) CARDS[FRIEND_CARD_FOR[id]].warmStart = id;

// one-quest cards keep their quest as a string; Tax Abatement has two
function cardQuests(c) { return !c.quest ? [] : Array.isArray(c.quest) ? c.quest : [c.quest]; }

// ---------------------------------------------------------------- the hand
function hasCard(id) { return cardsOn() && !!(S && S.hand && S.hand.includes(id)); }
function cardReady(id) { return hasCard(id) && !(S.cardsUsed && S.cardsUsed[id]); }
function playCard(id) {
  (S.cardsUsed = S.cardsUsed || {})[id] = true;
  log(`Played a card: ${CARDS[id].title}`);
  toast(`${CARD_ICON} ${CARDS[id].title}`);
  renderPanel();
}
function handSize(book) {
  const n = book.finished || 0;
  for (const [min, size] of HAND_SIZES) if (n >= min) return size;
  return 1;
}
// a hand is valid if it fits and holds at most one Paper
function validHand(ids, book) {
  return ids.length <= handSize(book) && ids.every(id => CARDS[id] && (book.cards || []).includes(id))
    && ids.filter(id => CARDS[id].suit === 'paper').length <= 1 && new Set(ids).size === ids.length;
}
// story cards double their quest's weight when the month's stories are drawn (js/runs.js)
function handWeight(hand, questId) {
  return cardsOn() && (hand || []).some(id => CARDS[id] && cardQuests(CARDS[id]).includes(questId)) ? 2 : 1;
}

// ---------------------------------------------------------------- effects read by the engine
function cardRent() { return (hasCard('abatement') ? -10 : 0) + (hasCard('gordie') ? 5 : 0); }
function cardShoppers() { return (hasCard('gordie') ? 1 : 0) + (hasCard('gazette') && S.day === 1 ? 1 : 0); }
function cardLoupes() { return hasCard('lusk') && S.day === 1 ? 1 : 0; }
function cardFreeLook(it) {
  if (hasCard('overdue') && it.key === 'tome') return true;
  return hasCard('loupe') && it.cat === 'jewelry' && S.cardLoupeDay !== dayNum();
}
function cardUsedLook(it) {
  if (hasCard('overdue') && it.key === 'tome') return;
  S.cardLoupeDay = dayNum();
}
// at the start of a seller's turn
function cardSeller(c) {
  if (cardReady('ned') && c.type === 'seller' && !c.cardVisitor) {
    playCard('ned');
    c.min = Math.round(c.min * 0.6); c.asking = Math.max(c.min, Math.round(c.asking * 0.8));
    toast('Captain Ned clacks his jaw from under the counter. The seller looks shaken, and cheaper.');
  }
}

function castLook(id) { return CAST[id] ? CAST[id].look : randomLook(); }
function cardSellerVisit(name, look, f, intro) {
  const item = makeItem(pick(ITEM_KEYS), { mark: innocentMark() });
  const asking = Math.max(4, Math.round(item.guide * f));
  return { type: 'seller', kind: 'genuine', item, persona: 'honest', asking, min: Math.round(asking * 0.85), look, name, intro, cardVisitor: true };
}
function cardBuyerVisit(name, look, cat, mult, intro, onArrive) {
  return { type: 'buyer', cat, mult, sharp: true, look, name, intro, onArrive, cardVisitor: true };
}
// visitors a card sends today, added to the queue by buildDay()
function cardCustomers() {
  if (!cardsOn() || !S.hand || !S.hand.length) return [];
  const out = [], d = S.day, w = S.week;
  const stockCats = forSale().map(i => i.cat);
  if (hasCard('ignatius') && d === 2) out.push(cardSellerVisit('A parishioner', randomLook(), rand(0.6, 0.7), 'Father Ignatius said you\'d give me a fair price. He said it quite loudly.'));
  if (hasCard('hollis') && d === 3) out.push(cardSellerVisit(CAST.hollis ? CAST.hollis.name : 'Hollis Fenn', castLook('hollis'), 0.5, 'A lot from the Customs auction. Properly destroyed on paper, properly sold in real life. I checked.'));
  if (hasCard('twins') && w === 2 && d === 3) out.push(cardSellerVisit(CAST.lark.name, CAST.lark.look, 0.3, 'We found this on the beach! You can have it for cheap, because you\'re our shop.'));
  if (hasCard('tess') && d === 1) { const s = genSeller(); s.name = 'From the fishing families'; out.push(s); }
  if (hasCard('pomfret') && d === 4 && stockCats.includes('curio')) out.push(cardBuyerVisit(CAST.pomfret ? CAST.pomfret.name : 'Dr. Lyle Pomfret', castLook('pomfret'), 'curio', 1.3, 'Anything odd? Anything that hums, or might? I pay for oddness.'));
  if (hasCard('pinwheel') && d === 5 && stockCats.length) out.push(cardBuyerVisit('From the candlepin league', randomLook(), pick(stockCats), 1.0, 'The league\'s doing a raffle. We\'re buying prizes, and we heard about you.'));
  if (cardReady('rook') && w === 2 && d === 2 && stockCats.length) {
    const best = forSale().reduce((a, b) => (b.guide > a.guide ? b : a));
    out.push(cardBuyerVisit(CAST.rook ? CAST.rook.name : 'Delphine Rook', castLook('rook'), best.cat, 1.0, 'I owe you one. I always pay. Show me your best shelf.', () => playCard('rook')));
  }
  return out;
}

// mornings: things a card brings to the step, and Crane's call
HOOKS.morning.push(async () => {
  if (!cardsOn() || !S.hand || !S.hand.length) return;
  if (hasCard('sea') && S.week === 1 && S.day === 1 && !S.cardPearl && shelfFree()) {
    S.cardPearl = true;
    const it = UNIQUES.seaPearl ? makeUnique('seaPearl', { guide: 60 }) : makeItem('necklace', { name: 'A sea pearl', guide: 60 });
    S.stock.push(it);
    toast('On the doorstep at dawn, still wet: a pearl. The sea remembers you.', null, it.icon);
  }
  if (hasCard('sideb') && S.week === 3 && S.day === 1 && !S.flags.lighthouseClue) {
    await narrate('Behind Odile\'s winter coats in the back room: a portable tape deck with fresh batteries, as if someone left it for you.\n\nSide B. A woman sings about rowing out to Gull Point and a blue light in the old lighthouse.');
    S.flags.lighthouseClue = true;
    toast('Clue: a blue light in the old lighthouse');
  }
  if (cardReady('crane') && S.heat >= 50) {
    playCard('crane');
    change('heat', -10, 'Deputy Director Crane made a call'); change('rep', -3);
    toast('A Customs car idles outside for an hour. Afterwards the police seem less interested in you. The neighbors seem more.');
  }
});

// at the start of a month: what the hand changes before day one (startGame, js/menus.js)
function applyHand() {
  if (!cardsOn() || !S.hand || !S.hand.length || S.handApplied) return;
  S.handApplied = true;
  S.cardsUsed = S.cardsUsed || {};
  if (hasCard('standing')) S.coin += 25;
  // Friend cards: the regular starts warm (standing resets every run otherwise)
  if (typeof standingState === 'function') for (const id of S.hand) {
    const who = CARDS[id] && CARDS[id].warmStart;
    if (!who) continue;
    const st = standingState();
    st.v[who] = Math.max(st.v[who] || 0, FRIEND_START);
    st.best[who] = Math.max(st.best[who] || 0, st.v[who]);
  }
  if (hasCard('wren')) S.heat = Math.max(S.heat, 20);
  if (hasCard('fathom')) {
    const h = habits();
    h.cat.named = true; h.cat.streak = 3; h.cat.best = Math.max(h.cat.best, 3); h.cat.last = 0;
  }
  if (hasCard('doubloon')) {
    const it = makeItem('compass', { name: 'A ghost doubloon', icon: 'coins', cat: 'curio', guide: 40, cond: 2 });
    it.key = 'unique'; it.unique = true; it.tells = ['Spanish gold, 1715. It is a little see-through.']; it.nosale = true; it.cardKeepsake = 'doubloon';
    S.stock.push(it);
  }
  if (hasCard('sideb')) {
    const it = UNIQUES.bwTape ? makeUnique('bwTape', { questKey: false }) : makeItem('tome', { name: 'Breakwaters, side B (cassette)', guide: 5 });
    it.nosale = true; it.cardKeepsake = 'sideb';
    S.stock.push(it);
  }
  renderPanel();
}
// the doubloon goes on sale in week 2
HOOKS.morning.push(async () => {
  if (S.week >= 2) for (const it of S.stock) if (it.cardKeepsake === 'doubloon' && it.nosale) { it.nosale = false; renderPanel(); }
});

// ---------------------------------------------------------------- earning
// the cards this month earned, given the ending's title
function earnedCards(title) {
  const ends = {};
  for (const { q, end } of (typeof runOutcomes === 'function' ? runOutcomes() : [])) if (end) ends[q.id] = end;
  if (typeof applyQuestEndings === 'function') applyQuestEndings(); // so a story's last sway counts
  const friendNow = who => !!(S.standing && typeof standing === 'function' && standing(who) >= 4);
  return Object.keys(CARDS).filter(id => {
    const c = CARDS[id];
    if (c.friendOf && friendNow(c.friendOf)) return true;
    if (c.check) { try { return !!c.check(title); } catch (e) { return false; } }
    return cardQuests(c).some(q => ends[q] && c.endings.includes(ends[q]));
  });
}
// Only a finished month earns cards. They're kept even while the flag is off.
HOOKS.ending.push((title) => {
  S.newCards = [];
  if (S.over) return;
  const book = loadBook();
  book.cards = book.cards || [];
  book.finished = (book.finished || 0) + 1;
  for (const id of earnedCards(title)) if (!book.cards.includes(id)) { book.cards.push(id); S.newCards.push(id); }
  saveBook(book);
});

// ---------------------------------------------------------------- what the player sees
function indexCardHTML(id, o = {}) {
  const c = CARDS[id];
  const q = cardQuests(c).map(x => QUESTS[x]).filter(Boolean)[0];
  return `<div class="index-card suit-${c.suit}${o.picked ? ' picked' : ''}${o.used ? ' used' : ''}" ${o.data ? `data-card="${id}"` : ''}
    style="${q && q.colour ? `--quest:${q.colour}` : ''}">
    <div class="ic-top"><b>${esc(c.title)}</b><span class="ic-suit">${SUITS[c.suit].name}${c.once ? ' · once' : ''}</span></div>
    <p>${esc(c.text)}</p>${c.price ? `<p class="ic-price">${esc(c.price)}</p>` : ''}
    ${o.line ? `<p class="ic-line">${esc(c.earned)}</p>` : ''}</div>`;
}
function blankIndexCardHTML(id) {
  return `<div class="index-card blank"><div class="ic-top"><b>· · ·</b><span class="ic-suit">${SUITS[CARDS[id].suit].name}</span></div><p class="muted">${esc(CARDS[id].hint)}</p></div>`;
}

// The card file on the New game panel. Returns a function giving the chosen hand.
function cardPicker(host, book) {
  if (!cardsOn() || !(book.cards || []).length) return () => [];
  const size = handSize(book);
  let hand = [];
  const preset = window.__pawnHand; // tools/autoplay.js
  if (Array.isArray(preset)) hand = preset.filter(id => (book.cards || []).includes(id)).slice(0, size);
  const box = document.createElement('div');
  box.className = 'card-file';
  host.querySelector('.menu-card').insertBefore(box, host.querySelector('.menu-card .menu-list') || null);
  const draw = () => {
    box.innerHTML = `<h3>${CARD_ICON} Odile's card file</h3>
      <p class="muted">Bring up to ${size} card${size === 1 ? '' : 's'} into this month (${hand.length} chosen). One Paper at most.${size < 3 ? ` More room after ${size === 1 ? 3 : 6} finished months.` : ''}</p>
      ${(book.finished || 0) === 1 && hand.length === 0 ? '<p class="ic-odile">"Everyone in this town is worth knowing once." - O.</p>' : ''}
      <div class="card-row">${book.cards.filter(id => CARDS[id]).map(id => indexCardHTML(id, { data: true, picked: hand.includes(id) })).join('')}</div>`;
    box.querySelectorAll('[data-card]').forEach(el => el.onclick = e => {
      e.stopPropagation();
      const id = el.dataset.card;
      if (hand.includes(id)) hand = hand.filter(x => x !== id);
      else {
        if (CARDS[id].suit === 'paper') hand = hand.filter(x => CARDS[x].suit !== 'paper'); // a second Paper swaps out the first
        hand.push(id);
        if (hand.length > size) hand.shift();
      }
      draw();
    });
  };
  draw();
  return () => hand.slice();
}

// the Storybook's Cards page
function cardsBookHTML(book) {
  if (!cardsOn()) return '';
  const have = book.cards || [];
  return `<h3>${CARD_ICON} Cards</h3>
    <p class="muted">${have.length} of ${Object.keys(CARDS).length} found. Finish a month to earn them; pick a hand under New game.</p>
    <div class="card-row">${Object.keys(CARDS).map(id => (have.includes(id) ? indexCardHTML(id) : blankIndexCardHTML(id))).join('')}</div>`;
}

// the hand on the GOALS menu
function handHTML() {
  if (!cardsOn() || !S.hand || !S.hand.length) return '';
  return `<h3>${CARD_ICON} Your hand</h3><div class="card-row">${S.hand.map(id => indexCardHTML(id, { used: !!(S.cardsUsed && S.cardsUsed[id]) })).join('')}</div>`;
}

// on the ending screen: the hand played, and anything new
function cardsEndingHTML() {
  if (!cardsOn()) return '';
  let h = '';
  if (S.hand && S.hand.length) h += `<p class="muted">Played with: ${S.hand.map(id => `<b>${esc(CARDS[id].title)}</b>`).join(', ')}.</p>`;
  if (S.newCards && S.newCards.length) h += `<h3>${CARD_ICON} New in the card file</h3><div class="card-row deal">${S.newCards.map(id => indexCardHTML(id, { line: true })).join('')}</div>`;
  else if (S.over) h += '<p class="muted">Cards are only earned by finishing the month.</p>';
  return h;
}
