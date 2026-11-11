// Pawn Champ - game data: items, people, lines, bills. Set in present-day Hollow Neck, a foggy New England harbor town.
'use strict';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKS = 4;
const STOCK_SIZE = 24; // stock and pawned surety share this; shown on the shelves, the glass case, the pegboard and the window
const LOUPES_PER_DAY = 3;
const RENT = 40;
// Features that can be switched off without touching anything else. `?cards=1`, `?bag=0` and the like on the
// URL overrides a flag for one session (js/cards.js). Cards: docs/CARDS.md.
const FEATURES = { cards: true, stayOn: false, bag: true };
// ---- staying on past the first month (docs/SEASONS.md). Off unless ?stay=1 (FEATURES.stayOn), see js/stay.js.
// A stay runs October to March. Month 1 is today's game; from November the building has a new owner
// (the spine "The Building Changes Hands"), and his rent takes the place of the Gilded Hand's
// installments: about what month 1's bills averaged, so a later month is as tight as the first. It
// never goes down. Heating oil is added to the rent from November to February. `shoppers` adds to
// the daily shoppers (December's rush, January and February's empty streets). `season` picks the
// daytime music rotation (Sound.season, js/audio.js).
// What people want changes with the month too (docs/SEASONS.md#what-people-want): `wants` are the
// things half of the month's wanted customers ask for (warm and useful things in winter, gifts in
// December and February, gear for the boats and the garden in March), and `likes` makes shoppers and
// closing-time buyers pay a little more for those categories. October has neither.
const MONTHS = [
  { name: 'October', season: 'autumn', rent: RENT, heating: 0, shoppers: 0 },
  { name: 'November', season: 'autumn', rent: 200, heating: 20, shoppers: 0, wants: ['boots', 'flashlight', 'toolbox', 'dagger'], likes: { tools: 1.1 } },
  { name: 'December', season: 'winter', rent: 205, heating: 30, shoppers: 1, wants: ['ring', 'necklace', 'brooch', 'watch', 'musicbox', 'lute'], likes: { jewelry: 1.1, instrument: 1.1, curio: 1.05 } },
  { name: 'January', season: 'winter', rent: 205, heating: 35, shoppers: -1, wants: ['boots', 'flashlight', 'toolbox', 'tome'], likes: { tools: 1.1 } },
  { name: 'February', season: 'winter', rent: 210, heating: 35, shoppers: -1, wants: ['ring', 'brooch', 'necklace', 'boots'], likes: { jewelry: 1.1 } },
  { name: 'March', season: 'spring', rent: 220, heating: 10, shoppers: 0, wants: ['boots', 'rope', 'compass', 'spade', 'detector'], likes: { tools: 1.1 } }
];
const INSTALLMENTS = [60, 120, 200, 300]; // owed to Gilded Hand Finance at the end of each week
// Shelf (walk-in) trade at the end of each day: chance = chance + rep/chanceRep,
// price = guide x (price + rep/priceRep). Tuned in docs/MECHANICS.md.
const WALKIN = { chance: 0.06, chanceRep: 1000, price: 0.75, priceRep: 500 };
const BUYER_MULT = [0.95, 1.2]; // buyers offer this multiple of guide for their category
// Shoppers browse the displays during the day and offer for one thing they saw.
// count = base + 1 per `perStock` items on display (+1 at rep >= repBonus), capped at max.
// offer = guide x (price + rep/priceRep) x 0.92-1.06; "ask for more" adds `more` and works
// `moreChance + rep/moreRep` of the time, otherwise they walk.
const SHOPPERS = { base: [1, 2], perStock: 6, repBonus: 65, max: 5, price: 0.6, priceRep: 500, more: 0.15, moreChance: 0.3, moreRep: 200, sharp: 0.25 };
// Customers who ask for one specific thing. They pay this multiple of the item's guide, and if
// you don't have it they come back in 2-3 days to see if you found one.
const WANTED_MULT = [1.15, 1.4];

// ---- progression (see docs/PROGRESSION.md)
// Reputation tiers: what Hollow Neck calls your shop. Each tier unlocks upgrades.
const TIERS = [
  { min: 0, name: 'Junk Shop', blurb: 'People cross the street to avoid your window.' },
  { min: 45, name: 'Pawnbroker', blurb: 'A proper pawnshop. People know where to find you.' },
  { min: 70, name: 'Trusted Dealer', blurb: 'Folks send their friends. Buyers come looking for you.' },
  { min: 88, name: 'Hollow Neck Institution', blurb: 'The shop everyone in town recommends.' }
];
const BUYER_CHANCE = [0.15, 0.15, 0.19, 0.21]; // share of random customers who come to buy, by tier

// Shop upgrades, bought over the weekend after the bills. tier = minimum reputation tier.
const UPGRADES = {
  shelving: { name: 'Extra shelving', cost: 60, tier: 1, icon: '\u{1F4E6}', slots: 8,
    text: 'Eight more places for stock, from a hardware store that closed down.' },
  loupe: { name: 'Jeweler\'s test kit', cost: 50, tier: 1, icon: '\u{1F50D}', loupes: 1,
    text: 'A better loupe, acid and a magnet: one more inspection a day.' },
  safe: { name: 'Back-room safe', cost: 90, tier: 0, icon: '\u{1F512}', raidMult: 0.5, heat: 5,
    text: 'Police raids are half as likely. Captain Barrow notices the delivery (+5 heat).' },
  sign: { name: 'Fixed neon sign', cost: 80, tier: 2, icon: '\u{1F4A1}', shoppers: 1, walkin: 0.04,
    text: 'The whole word lights up now. One more shopper browses each day, and items are 4% more likely to sell at closing time.' },
  showcase: { name: 'Lit display case', cost: 120, tier: 3, icon: '\u{1F48E}', cats: ['jewelry', 'curio'], priceMult: 1.15,
    text: 'Jewelry and collectibles sell to shoppers and at closing time for 15% more.' },
  // December only, when you stay on (docs/SEASONS.md): drawn on the counter by js/seasons.js
  tree: { name: 'A little tree for the counter', cost: 25, tier: 0, icon: '\u{1F384}', months: [3], rep: 3,
    text: 'A spruce from the lot behind Mayhew\'s, and a string of lights. People like a shop with a tree in it (+3 reputation).' }
};
// the upgrades on offer this month (a few are seasonal)
const upgradeInMonth = u => !u.months || u.months.includes(typeof monthNum === 'function' ? monthNum() : 1);

// Weekly objectives. kind: count (stat rose by n this week), none (stat did not rise),
// heatBelow / repAtLeast (checked when the shop closes on Friday). Rewards are paid at once.
const OBJECTIVES = [
  [{ text: 'Catch a thief or a fraud', kind: 'count', stat: 'thieves', n: 1, reward: { coin: 15 } },
    { text: 'Inspect 10 items', kind: 'count', stat: 'inspected', n: 10, reward: { rep: 3 } },
    { text: 'Sell 6 items', kind: 'count', stat: 'sold', n: 6, reward: { coin: 15 } }],
  [{ text: 'Make 3 loans', kind: 'count', stat: 'loans', n: 3, reward: { coin: 20 } },
    { text: 'Sell no fakes', kind: 'none', stat: 'cheated', reward: { rep: 4 } },
    { text: 'End the week with heat under 15', kind: 'heatBelow', n: 15, reward: { coin: 20 } }],
  [{ text: 'Sell 10 items', kind: 'count', stat: 'sold', n: 10, reward: { coin: 25 } },
    { text: 'Catch 3 thieves or frauds', kind: 'count', stat: 'thieves', n: 3, reward: { coin: 30 } },
    { text: 'Reach Trusted Dealer (70 reputation)', kind: 'repAtLeast', n: 70, reward: { coin: 25 } }],
  [{ text: 'Buy 10 items', kind: 'count', stat: 'bought', n: 10, reward: { coin: 20 } },
    { text: 'Sell no fakes', kind: 'none', stat: 'cheated', reward: { rep: 5 } },
    { text: 'End the month as a Hollow Neck Institution (88 reputation)', kind: 'repAtLeast', n: 88, reward: { coin: 30 } }]
];

const CATS = {
  jewelry: 'some jewelry, something with a bit of shine',
  silver: 'proper silver, for my mother\'s dining table',
  curio: 'a collectible for my shelf',
  art: 'a piece of art for the apartment',
  instrument: 'an instrument that actually sounds good',
  weapon: 'a decent knife'
};
const CAT_LABEL = { jewelry: 'Jewelry', silver: 'Silver', curio: 'Collectible', art: 'Art', instrument: 'Music', weapon: 'Knives', tools: 'Tools' };

// base = market value of a genuine piece in "fair" condition
const ITEMS = {
  ring: { name: 'Gold ring', icon: 'ring', cat: 'jewelry', base: 60,
    real: ['An 18K stamp, crisp and deep. The acid test holds.', 'Heavy for its size. Solid gold.'],
    fake: ['Green shows through where the plating has worn.', 'Far too light. The magnet you keep under the counter grabs it.'] },
  necklace: { name: 'Gold chain', icon: 'necklace', cat: 'jewelry', base: 80,
    real: ['Solid links and a 14K stamp on the clasp. It pools heavily in your palm.', 'Each link is soldered shut. Proper work.'],
    fake: ['Hollow links. One is already crushed flat.', 'The clasp says 14K. The magnet says otherwise.'] },
  brooch: { name: 'Ruby brooch', icon: 'brooch', cat: 'jewelry', base: 100,
    real: ['The stone is cold to the touch and takes no scratch.', 'Under the loupe, fine silk-like threads inside the ruby.'],
    fake: ['A tiny round bubble hangs inside the stone. Glass.', 'The stone warms in your hand like glass would.'] },
  candlestick: { name: 'Silver candlestick', icon: 'candlestick', cat: 'silver', base: 45,
    real: ['Even, old tarnish and a sterling hallmark.', 'It rings clean when you flick it.'],
    fake: ['The plating flakes at the base. Zinc underneath.', 'No hallmark at all, and a seam where two halves were glued.'] },
  goblet: { name: 'Silver goblet', icon: 'goblet', cat: 'silver', base: 50,
    real: ['Hallmarked and properly heavy.', 'Hand-chased pattern, slightly uneven the way real work is.'],
    fake: ['Pewter. Soft enough to dent with a thumbnail.', 'The "chasing" is cast in, every leaf identical.'] },
  watch: { name: 'Vintage watch', icon: 'wristwatch', cat: 'curio', base: 70,
    real: ['A Swiss movement, and the serial matches the case. It ticks sweetly.', 'Jewelled bearings glint inside the case back.'],
    fake: ['A cheap quartz tick inside a "mechanical" case.', 'The brand name on the dial is misspelled.'] },
  compass: { name: 'Brass compass', icon: 'compass', cat: 'curio', base: 35,
    real: ['The needle settles true and steady.', 'Navy issue markings, worn by salt.'],
    fake: ['A magnet is glued under the face. The needle never moves.', 'The brass is paint over tin.'] },
  spyglass: { name: 'Film camera', icon: 'camera', cat: 'curio', base: 40,
    real: ['The shutter fires cleanly at every speed. The lens is spotless.', 'The serial number matches the body and the lens.'],
    fake: ['The badge is glued onto a cheap plastic body.', 'No serial number, and the "lens" is a toy.'] },
  tome: { name: 'First edition', icon: 'tome', cat: 'curio', base: 40,
    real: ['First printing, and the publisher\'s line is right.', 'The signature has pressed into the paper. Real ink, real pen.'],
    fake: ['A book-club reprint with the copyright page cut out.', 'The "signature" is printed. You can see the dots.'] },
  musicbox: { name: 'Music box', icon: 'musicbox', cat: 'curio', base: 45,
    real: ['A fine comb and cylinder. The tune is clear.', 'Inlaid by hand; the joints are tight.'],
    fake: ['The tune stumbles; half the teeth are snapped off and glued.', 'The inlay is a sticker.'] },
  painting: { name: 'Oil painting', icon: 'painting', cat: 'art', base: 90,
    real: ['Old craquelure runs through the varnish. Layers of real brushwork.', 'The canvas back is darkened with age.'],
    fake: ['A print with a few brushstrokes on top. The dots show under the loupe.', 'The signature sits on top of the varnish.'] },
  vase: { name: 'Porcelain vase', icon: 'vase', cat: 'art', base: 55,
    real: ['Rings like a bell when tapped.', 'Light shines through the thin walls.'],
    fake: ['A dull thud. The glaze hides plaster.', 'The blue pattern is a transfer; you can see its edge.'] },
  statuette: { name: 'Jade figurine', icon: 'statuette', cat: 'art', base: 75,
    real: ['Cool, dense and waxy-smooth. Real jade.', 'Fine tool marks deep in the folds.'],
    fake: ['Green glass; it scratches under your knife.', 'Moulded resin, too light and warm.'] },
  lute: { name: 'Electric guitar', icon: 'guitar', cat: 'instrument', base: 50,
    real: ['The serial number checks out and the neck is dead straight.', 'Original pickups. It sings even unplugged.'],
    fake: ['The headstock logo is a decal on a cheap copy.', 'The serial number is the same one printed on every fake.'] },
  dagger: { name: 'Hunting knife', icon: 'dagger', cat: 'weapon', base: 40,
    real: ['Forged steel and a maker\'s stamp.', 'Holds an edge that shaves hair off your arm.'],
    fake: ['Pot metal painted silver.', 'The blade bends and stays bent.'] },
  // Tools (docs/ITEMS_IN_USE.md): only in trade with FEATURES.bag on. Cheap, useful when you go out.
  spade: { name: 'Garden spade', icon: 'spade', cat: 'tools', base: 25, tool: true,
    real: ['A forged blade riveted to an ash handle. It has dug a lot of gardens and has a lot left in it.', 'The maker\'s stamp is on the socket, worn but honest.'],
    fake: ['Stamped sheet steel painted to look forged. It bends against your boot.', 'The handle is pine stained to look like ash, and it\'s already split.'] },
  flashlight: { name: 'Flashlight', icon: 'flashlight', cat: 'tools', base: 20, tool: true,
    real: ['Machined aluminum, and the beam reaches the back wall without a wobble.', 'The switch clicks like a good pen. Proper work.'],
    fake: ['The "aluminum" is painted plastic, and the beam is the color of weak tea.', 'The brand name is one letter off.'] },
  prybar: { name: 'Pry bar', icon: 'prybar', cat: 'tools', base: 25, tool: true,
    real: ['Drop-forged and heavy. The claw is still sharp.', 'A contractor\'s initials are scratched in the paint. It\'s been used, not abused.'],
    fake: ['Cast, not forged. A seam runs down the side where the mold met.', 'Too light. It would bend before the nail did.'] },
  boltcutters: { name: 'Bolt cutters', icon: 'boltcutters', cat: 'tools', base: 35, tool: true,
    real: ['The jaws meet cleanly with daylight nowhere between them.', 'Heavy, with a maker\'s stamp on both handles.'],
    fake: ['The jaws don\'t quite meet. They\'d chew a padlock, not cut it.', 'Painted red to look like the good ones. The paint is the good part.'] },
  rope: { name: 'Coil of climbing rope', icon: 'rope', cat: 'tools', base: 30, tool: true,
    real: ['Kernmantle, no fraying, and the tag says it\'s rated for a fall.', 'Supple and dry, coiled the way climbers coil it.'],
    fake: ['Hardware-store rope dyed to look like climbing rope. The core is just twisted plastic.', 'The tag has been cut off, and the sheath is stiff.'] },
  boots: { name: 'Rubber boots', icon: 'boots', cat: 'tools', base: 20, tool: true,
    real: ['Thick soles, no cracks at the flex, and the inside is dry.', 'A fisherman\'s pair, the good kind, with the yellow band at the top.'],
    fake: ['Thin rubber already cracking at the ankle.', 'The famous label is a sticker.'] },
  toolbox: { name: 'Toolbox', icon: 'toolbox', cat: 'tools', base: 40, tool: true,
    real: ['Every socket has its place, and they\'re all there. Someone looked after these.', 'Old steel wrenches that still fit their nuts. They don\'t make them like this.'],
    fake: ['The tray is full, but the wrenches are pot metal and round off at a look.', 'Half the sockets are the wrong size for their slots.'] },
  detector: { name: 'Metal detector', icon: 'detector', cat: 'tools', base: 60, tool: true,
    real: ['It sings over a coin you hold under the coil, and goes quiet when you take it away.', 'The control box is sealed and the coil cable is new.'],
    fake: ['It beeps at everything, including your hand.', 'A toy with the stickers peeled off and a better one\'s stuck on.'] },
  // story-only item (never generated at random)
  amber: { name: 'Amber stone', icon: 'amber', cat: 'curio', base: 38,
    real: ['Real amber, with an ancient insect caught inside.'], fake: ['Colored glass.'] }
};
const ITEM_KEYS = Object.keys(ITEMS).filter(k => k !== 'amber' && !ITEMS[k].tool);
const TOOL_KEYS = Object.keys(ITEMS).filter(k => ITEMS[k].tool);

const CONDITIONS = [
  { label: 'Worn', mult: 0.7 }, { label: 'Fair', mult: 1.0 }, { label: 'Fine', mult: 1.25 }, { label: 'Pristine', mult: 1.5 }
];

const MARKS = ['a swan crest', 'the initials H.G.', 'a tiny anchor', 'the initials T.M.', 'a rose stamp', 'the number 17',
  'a fox-head seal', 'the initials E.V.', 'a crescent moon', 'three dots in a row', 'a crowned fish', 'the initials R.B.',
  'a wheat sheaf', 'the initials O.S.'];
const OWNERS = ['the Harrowgate family', 'Mrs. Kessel on Rope Street', 'the Lantern Hotel', 'Saint Brine\'s Church', 'Selectman Vey',
  'the Customs office', 'Orrin\'s Jewelers', 'the Gull & Kettle tavern'];

const FIRST = ['Hobb', 'Mrs. Quell', 'Danno', 'Iselde', 'Fenwick', 'Old Marra', 'Tobin', 'Jack Sallow', 'Kevin',
  'Ottilie', 'Corwin', 'Tina', 'Gemma', 'Ned Rook', 'Juno', 'Bastian', 'Greer', 'Big Hulda', 'Lio', 'Petra',
  'Silas', 'Wynn', 'Rosamund', 'Gil', 'Teodor', 'Maud', 'Ferris', 'Nell', 'Osric', 'Dani'];
const TRADES = ['the cab driver', 'from the fish market', 'the office temp', 'off the ferry', 'from the call center', 'the baker',
  'the dockworker', 'the student', 'the nurse', 'the gambler', 'the barber', 'the lobsterman', 'the barista', 'the electrician', 'the bus driver'];

const SKINS = ['#f0c8a8', '#e0b090', '#c89070', '#a87050', '#7a5038', '#5a3a28'];
const HAIRS = ['#2a1e16', '#4a2a18', '#7a4a28', '#b07a40', '#d8c070', '#8a8a8a', '#d0d0d0', '#5a2418'];
const COATS = ['#5a3a6a', '#3a6a5a', '#a83a2a', '#2a3a6a', '#8a7a4a', '#4a4a52', '#c86a3a', '#3a5a3a', '#6a5a8a', '#e8e4dc', '#2e5a7e', '#8a2a4a', '#d8b040', '#1e1e22'];
const HATS = [null, null, null, null, 'cap', 'cap', 'beanie', 'beanie', 'hood', 'bonnet'];
const STYLES = ['jacket', 'jacket', 'hoodie', 'hoodie', 'puffer', 'tee', 'tee', 'suit', 'vest', 'dress'];

// Personas drive haggling floors (min fraction of asking they'll take) and lines.
const PERSONAS = {
  honest: { min: [0.68, 0.8], patience: 2,
    pitch: ['This {item} was my mom\'s. I\'d keep it if I could.', 'Fair price for a fair {item}, that\'s all I\'m after.', 'The furnace died. The {item} will have to go.'],
    accept: ['Thanks. Really.', 'That\'s fair. Thanks.'], counter: ['I can\'t go that low. Could you do {n}?', 'Meet me at {n}?'],
    leave: ['I\'ll try the place on Main Street. Bye.', 'No, I can\'t. Sorry.'], refused: ['Oh. Right. Okay then.'] },
  desperate: { min: [0.45, 0.6], patience: 3,
    pitch: ['Please. I need cash before tonight.', 'Take the {item}. Whatever you can do.', 'Rent\'s due and my landlord isn\'t the patient type.'],
    accept: ['Oh, thank God.', 'It\'ll do. It has to.'], counter: ['That\'s... could you manage {n}?', 'Please, {n} at least?'],
    leave: ['...Right. I\'ll figure something out.'], refused: ['Please... no. Fine. Fine.'] },
  smooth: { min: [0.4, 0.55], patience: 2,
    pitch: ['Rare {item}, pal. You won\'t see another one this year.', 'Estate sale, big old house on the Cape. Practically a steal.', 'Collectors online would lose their minds over this {item}.'],
    accept: ['Pleasure doing business.', 'You\'ve got a good eye.'], counter: ['Come on. {n} and we\'re friends.', 'For you? {n}.'],
    leave: ['Your loss.'], refused: ['Pity. Someone else will snap it up.'] },
  shifty: { min: [0.3, 0.45], patience: 2,
    pitch: ['Found it. Honest. No questions, yeah?', 'Quick sale. I\'m double parked.', 'It\'s mine. Mostly. Look, do you want the {item} or not?'],
    accept: ['Done. You never saw me.', 'Nice. I\'m off.'], counter: ['{n}. Final. I\'ve got places to be.', '{n} and I\'m gone.'],
    leave: ['Forget it.'], refused: ['Whatever.'] },
  proud: { min: [0.8, 0.92], patience: 1,
    pitch: ['Finest {item} in Hollow Neck. I know what it\'s worth.', 'Don\'t insult me with a low number.', 'I\'ve had offers for this {item}. Better ones, I\'m sure.'],
    accept: ['Hmph. Acceptable.'], counter: ['Insulting. {n}, not a penny less.'],
    leave: ['I\'ll take it to the auction house.'], refused: ['Your loss.'] }
};

const PERSONA_WEIGHTS = {
  genuine: { honest: 45, desperate: 30, proud: 20, shifty: 5 },
  fake: { smooth: 55, honest: 25, proud: 20 },
  stolen: { shifty: 50, smooth: 30, desperate: 20 }
};

// Named cast. Looks are rendered by art.js (style: jacket, hoodie, puffer, tee, suit, uniform, vest, dress, robe).
const CAST = {
  keeper: { name: 'You', look: { skin: '#e0b090', hair: '#5a2418', hs: 0, coat: '#3f5a4a', style: 'tee', apron: '#8a7a5a', pants: '#3a3a48' } },
  merrit: { name: 'Merrit Gaunt', look: { skin: '#e8d0c0', hair: '#1a1a1a', hs: 0, coat: '#1e1e26', trim: '#c8a050', style: 'suit', long: true, pants: '#1a1a1a', glasses: '#0e0e10', bag: '#3a2a1e' } },
  barrow: { name: 'Captain Barrow', look: { skin: '#7a5038', hair: '#1a1210', hs: 3, coat: '#22305a', trim: '#e2c04a', style: 'uniform', hat: 'helm', hatc: '#1a2240', band: '#e2c04a', pants: '#1a2240' } },
  wren: { name: 'Wren', look: { skin: '#f0c8a8', hair: '#c83a1a', hs: 5, coat: '#2a2a30', trim: '#c83a1a', style: 'hoodie', pants: '#3a4a6a' } },
  pell: { name: 'Old Pell', look: { skin: '#e0b090', hair: '#c8c8c8', hs: 2, coat: '#e0a020', style: 'puffer', beard: '#e8e8e8', pants: '#3a3a42', hat: 'beanie', hatc: '#2a3a5a' } },
  lark: { name: 'Lark', look: { kid: true, skin: '#c89070', hair: '#2a1e16', hs: 4, coat: '#c84a3a', style: 'hoodie', pants: '#3a4a6a' } },
  linnet: { name: 'Linnet', look: { kid: true, skin: '#c89070', hair: '#2a1e16', hs: 5, coat: '#3a8a6a', style: 'puffer', pants: '#3a3a4a', band: '#e8c040' } },
  amabel: { name: 'Sister Amabel', look: { skin: '#f0c8a8', hair: '#3a2a1e', robe: true, coat: '#2e2e3a', hat: 'veil', hatc: '#22222c', bag: '#5a7a9a' } },
  vantreece: { name: 'Ms. Vantreece', look: { skin: '#f0d8c8', hair: '#e8e0c0', hs: 1, coat: '#e8e4dc', trim: '#c8a050', style: 'suit', long: true, pants: '#e8e4dc', glasses: '#c8a050' } },
  odile: { name: 'Aunt Odile', look: { skin: '#e0b090', hair: '#a8a8b0', hs: 3, coat: '#2a4a6a', style: 'jacket', trim: '#e0d0b0', long: true, lantern: true, pants: '#2a2a2a' } },
  junkman: { name: 'Sal the scrap dealer', look: { skin: '#c89070', hair: '#5a5a5a', hs: 0, coat: '#5a5a42', style: 'vest', vest: '#e8a020', hat: 'cap', hatc: '#3a3a2a', beard: '#5a5a5a' } }
};

const LOAN_PITCH = [
  'I need {n} for a few days. Hold my {item} and I\'ll be back for it {when}.',
  'Could you loan me {n} against this {item}? I\'ll pick it up {when}, I swear.',
  'I get paid {when}. Loan me {n} on the {item} until then?'
];
const WANTED_PITCH = ['Any chance you have a {item}? I\'ve been looking for weeks.', 'I\'m after a {item}. Not just any, a decent one.',
  'My brother\'s birthday is Saturday. He wants a {item}. Got one?', 'Do you ever get a {item} in? I\'d pay well.'];
const WANTED_LATER = ['No? Keep an eye out. I\'ll come back {when}.', 'Shame. I\'ll swing by again {when}, in case one turns up.'];
const SHOPPER_PITCH = ['How much for the {item} {where}?', 'That {item} {where}. What would you take for it?', 'I like the {item} {where}. Is it for sale?'];
const BUYER_PITCH = ['Looking for {cat}. Got anything?', 'Hi there. I\'m after {cat}.', 'Someone said you might have {cat}?'];
