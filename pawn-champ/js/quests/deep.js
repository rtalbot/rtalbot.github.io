// Pawn Champ - the deep set: what the Lovecraftian quests share (docs/quests/MAJOR.md#two-new-rules-for-the-deep-set).
// Not a quest itself. Load it before the deep quests (js/stories/sounding.js, gansey.js, helmet.js...).
// A story file lists its soundings in "soundings" and Looks with a "sounding" step (docs/STORY_DATA.md).
//
//   addSounding(id, text)   a line for the Storybook's Soundings page, found by a Look
//   await deepLook(id)      the player chose to Look: +1 Look this run, and the sounding is kept for good
//   deepLooks()             Looks so far this run
//
// What Looks do to the shop, in this run only:
//   1  Mister Fathom keeps to the windowsill some mornings, facing the harbor
//   2  every morning someone tells you the same dream before they say what they came in for
//   3  one night the shop clock runs backwards, and at dawn there's a wet box on the step (a rare find
//      from below, section H of docs/quests/ITEMS.md)
// Across runs: finding two-thirds of all soundings gives Odile one extra line at the lighthouse.
'use strict';

Object.assign(ICONS, {
  lead: ['.....kk.....', '.....kk.....', '....kssk....', '....kdsk....', '...kdssdk...', '...kdssdk...',
    '..kddssddk..', '..kddssddk..', '.kdddssdddk.', '.kppPPPPppk.', '..kkkkkkkk..', '............'],
  holed: ['............', '...kkkkkk...', '..kddddddk..', '.kddsddddk..', '.kdkkdddddk.', '.kdk.kddddk.',
    '.kdkkddsddk.', '.kdddddddk..', '..kddddddk..', '...kkkkkk...', '............', '............'],
  shipbell: ['.....kk.....', '....kook....', '...kyyyyk...', '...kyYyyk...', '..kyYyyyyk..', '..kyYyyyyk..',
    '.kyYyyyyyyk.', '.kyyyyyyyok.', 'kooooooooook', '.kkkkkkkkkk.', '.....kk.....', '.....kk.....'],
  bigring: ['............', '...kkkkkk...', '..kyYYYYyk..', '.kyY....yok.', '.kY......ok.', '.ky......ok.',
    '.ky......ok.', '.ko......ok.', '.kyo....ook.', '..kyooooyk..', '...kkkkkk...', '............']
});

const SOUNDINGS = {};
function addSounding(id, text) { SOUNDINGS[id] = { text, quest: typeof questScope !== 'undefined' ? questScope : null }; }
function deepLooks() { return (S && S.flags.deepLooks) || 0; }
async function deepLook(id) {
  S.flags.deepLooks = deepLooks() + 1;
  if (!S.flags.deepFirstDay) S.flags.deepFirstDay = dayNum();
  const book = loadBook();
  book.soundings = book.soundings || {};
  const fresh = !book.soundings[id];
  book.soundings[id] = true;
  saveBook(book);
  if (fresh && SOUNDINGS[id]) toast('A new line in the Storybook, under Soundings.', null, 'lead');
  const n = deepLooks();
  if (n === 1) toast('Something in the shop has noticed you looking.', null, 'lead');
  if (n === 3) toast('You have looked three times now. The shop clock has started to sound wrong.', null, 'lead');
}

// a little odd every morning, in step with how much you've looked
const DREAM_LINES = [
  'Before she says what she wants: "I dreamt about a stair last night. Going down. The water at the bottom was warm. Isn\'t that funny?"',
  'He puts his things on the counter, then: "Do you dream about steps? My wife does. Now I do."',
  'Before anything else: "Sorry. Long night. Same dream as everybody. The stair, you know."',
  'A teenager, not looking up from her phone: "Everyone in my class had the stair dream. It\'s like a meme now."',
  'An old man, apologising: "I\'ve been counting the steps in my sleep. I\'m up to forty."'
];
HOOKS.morning.push(async () => {
  const n = deepLooks();
  if (!n || dayNum() <= (S.flags.deepFirstDay || 0)) return;
  if (n >= 3 && !S.flags.deepWetBox) {
    S.flags.deepWetBox = true;
    await narrate('Last night the shop clock ran backwards. You heard it from upstairs: every tick a little late, and the wrong way round.');
    const ids = ['wetStone', 'wetBell', 'wetRing', 'wetLantern'];
    const id = ids[(S.run && S.run.seed ? Math.floor(seededRandom(S.run.seed + '/wetbox')() * ids.length) : randi(0, ids.length - 1))];
    const it = makeUnique(id), room = shelfFree();
    if (room) { S.stock.push(it); renderPanel(); }
    await narrate(`At dawn there's a box on the step, soaked through, though it didn't rain. Inside, packed in eelgrass: ${it.name.toLowerCase()}.${room ? '' : ' Your shelves are full. When you look again, the box is gone.'}`);
    return;
  }
  if (n >= 2) toast(pick(DREAM_LINES));
  else if (dayNum() % 2 === 0) toast(`${catName(true)} spent the night on the windowsill, facing the harbor. He won't come to the counter this morning.`);
});

// the wet box: one rare find from below
addUnique('wetStone', { name: 'A stone with a hole that whistles', icon: 'holed', cat: 'curio', guide: 80, condLabel: 'Wet',
  tells: ['Dark, smooth and heavy, with a hole worn right through it.', 'At low tide it whistles. Only at low tide. You checked.'] });
addUnique('wetBell', { name: 'A ship\'s bell from no ship on record', icon: 'shipbell', cat: 'silver', guide: 140, condLabel: 'Barnacled',
  tells: ['Bronze, green with age. The name cast into it has been worn smooth, deliberately.', 'Hester Quint has no record of any ship that size lost off Hollow Neck. She checked twice.'] });
addUnique('wetRing', { name: 'A gold ring too big for any finger', icon: 'bigring', cat: 'jewelry', guide: 190, condLabel: 'Heavy',
  tells: ['Real gold, by the weight and the scratch test.', 'Your wrist fits through it. It wasn\'t made for a wrist either.'] });
addUnique('wetLantern', { name: 'A lantern that\'s already lit', icon: 'lantern', cat: 'silver', guide: 110, condLabel: 'Burning',
  tells: ['A brass storm lantern with a steady little flame.', 'There\'s no oil in it, and no wick.'] });

// the Storybook page
function soundingsBookHTML(book) {
  const all = Object.entries(SOUNDINGS);
  if (!all.length) return '';
  const found = book.soundings || {};
  const n = all.filter(([id]) => found[id]).length;
  if (!n && !all.some(([, s]) => s.quest && book.quests[s.quest] && book.quests[s.quest].met)) return '';
  return `<h3>Soundings <span class="muted">${n} of ${all.length}</span></h3><div class="book-list">${all.map(([id, s]) => found[id]
    ? `<div class="book-quest"><p>${esc(s.text)}</p></div>`
    : '<div class="book-quest unmet"><p class="muted">· · ·</p></div>').join('')}</div>`;
}
function soundingsFound() { const b = loadBook(); return Object.keys(SOUNDINGS).filter(id => b.soundings && b.soundings[id]).length; }
const SOUNDINGS_FOR_ODILE = () => Math.ceil(Object.keys(SOUNDINGS).length * 2 / 3);

// the lighthouse: Odile knows
{
  const lighthouse = story.lighthouse;
  story.lighthouse = async () => {
    await lighthouse();
    if (soundingsFound() < SOUNDINGS_FOR_ODILE()) return;
    const o = view.actors.find(a => a.name === CAST.odile.name);
    if (o) await say(o, 'One more thing. You\'ve been taking soundings, haven\'t you. I can tell. I wondered who\'d be next.');
  };
}
