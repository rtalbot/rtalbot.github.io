// Pawn Champ - things to click in scenes away from the shop, like the shop's own hotspots in
// js/secrets.js. Click one during a scene (between lines, not over a choice) for a look at it;
// clicking again moves on to the next line. A few hide a small find, once a run.
// Design: docs/SHOP_DAY.md#clicking-around-other-scenes. Loaded after js/secrets.js.
//   addSceneSpot('docks', { id: 'traps', rect: { x, y, w, h }, lines: ['...', '...'], find: { coin: 2, line: '...' } })
// rect is in native canvas pixels (640x360). Quests can add their own for their places.
'use strict';

const SCENE_SPOTS = {};
function addSceneSpot(bg, spot) { (SCENE_SPOTS[bg] = SCENE_SPOTS[bg] || []).push(spot); }
function sceneSpots() {
  return (SCENE_SPOTS[view.bg] || []).map(s => ({ id: `${view.bg}:${s.id}`, rect: () => s.rect, click: () => clickSceneSpot(view.bg, s) }));
}
function clickSceneSpot(bg, s) {
  const h = habits();
  h.spots = h.spots || {};
  const key = `${bg}:${s.id}`, n = h.spots[key] || 0;
  h.spots[key] = n + 1;
  // a spot that needs something from your bag (js/bag.js, docs/ITEMS_IN_USE.md)
  if (s.needs && typeof bagOn === 'function' && bagOn() && !h.spots[key + ':used']) {
    if (carrying(s.needs)) {
      h.spots[key + ':used'] = true;
      const it = useItem(s.needs, { hard: !!(s.use && s.use.hard) });
      const u = s.use || {};
      if (u.find && u.find.coin) { change('coin', u.find.coin, `Found ${money(u.find.coin)} at ${s.where || bg}`); Sound.coin(); }
      if (u.find && u.find.rep) change('rep', u.find.rep);
      if (u.line) toast(u.line.replace('{item}', it ? it.name.toLowerCase() : 'it'), null, it ? it.icon : 'bag');
      if (u.run) u.run(it);
      return;
    }
    if (s.without && n === 0) { toast(s.without, null, 'letter'); return; }
  }
  if (s.find && !h.spots[key + ':found'] && n === (s.find.on || 0)) {
    h.spots[key + ':found'] = true;
    if (s.find.coin) { change('coin', s.find.coin, `Found ${money(s.find.coin)} at ${s.where || bg}`); Sound.coin(); }
    if (s.find.rep) change('rep', s.find.rep);
    toast(s.find.line, null, 'letter');
    return;
  }
  toast(s.lines[n % s.lines.length], null, 'letter');
}

// ---------------------------------------------------------------- Pier Nine (night)
addSceneSpot('docks', { id: 'traps', rect: { x: 451, y: 237, w: 70, h: 46 }, lines: [
  'Lobster traps stacked to dry. One has a tag that says PROPERTY OF SOMEONE BIGGER THAN YOU.',
  'A crab has got into the bottom trap and seems to like it there.'] });
addSceneSpot('docks', { id: 'dumpster', rect: { x: 72, y: 246, w: 46, h: 34 }, where: 'the pier', lines: [
  'The fish shack\'s dumpster. You can smell it from the shop, on a south wind.',
  'A gull stands on the lid like it owns the lease.'], find: { on: 1, coin: 3, line: 'Three dollars in quarters, wedged under the dumpster\'s wheel. Somebody\'s laundry money.' } });
addSceneSpot('docks', { id: 'crates', rect: { x: 560, y: 208, w: 74, h: 75 }, lines: [
  'Crates stencilled DESTROYED, which is a strange thing to stencil on something that isn\'t.',
  'The nails in the top crate are new. Everything else on this pier is rust.'] });
addSceneSpot('docks', { id: 'ship', rect: { x: 268, y: 150, w: 196, h: 56 }, lines: [
  'A container ship waiting on the tide, lit up like a hotel nobody checks into.'] });

// ---------------------------------------------------------------- Gilded Hand Finance
addSceneSpot('office', { id: 'books', rect: { x: 31, y: 57, w: 103, h: 180 }, lines: [
  'Ledgers, bound in leather, shelved by year. Every spine is the same shade of money.',
  'One shelf is all copies of the same book on compound interest. Gifts, apparently.'] });
addSceneSpot('office', { id: 'hand', rect: { x: 283, y: 41, w: 58, h: 73 }, lines: [
  'The Gilded Hand, framed. Up close the gold leaf is peeling at one finger.',
  'Palm out. It could be a wave or a stop sign. You suspect it\'s meant to be both.'] });
addSceneSpot('office', { id: 'window', rect: { x: 477, y: 41, w: 137, h: 158 }, lines: [
  'Rain on the window, and the whole of Hollow Neck below. You can just see your own neon sign from here.'] });
addSceneSpot('office', { id: 'plant', rect: { x: 194, y: 186, w: 35, h: 51 }, lines: [
  'A plastic fern. Someone has been watering it anyway.'] });

// ---------------------------------------------------------------- Gull Point
addSceneSpot('lighthouse', { id: 'cottage', rect: { x: 566, y: 180, w: 68, h: 51 }, lines: [
  'The keeper\'s cottage. Nobody has kept it since the light went automatic, but the curtains are new.'] });
addSceneSpot('lighthouse', { id: 'door', rect: { x: 493, y: 196, w: 17, h: 35 }, lines: [
  'The lighthouse door. Fresh scratches round the lock, as if someone keeps letting themselves in.'] });
addSceneSpot('lighthouse', { id: 'sea', rect: { x: 0, y: 230, w: 260, h: 130 }, walk: false, lines: [
  'The tide is on the turn. A seal puts its head up, looks at you, and thinks better of it.'] });

// ---------------------------------------------------------------- Neptune's Arcade
addSceneSpot('arcade', { id: 'claw', rect: { x: 300, y: 96, w: 66, h: 155 }, lines: [
  'GRAB IT. The claw has the grip of a tired handshake.',
  'A plush octopus near the chute has been almost won for years.'] });
addSceneSpot('arcade', { id: 'skee', rect: { x: 200, y: 206, w: 40, h: 80 }, where: 'the arcade', lines: [
  'Skee-ball. The 100 hole is suspiciously smaller than the others.'], find: { coin: 2, line: 'Two dollars in tokens, stuck in the skee-ball return. They spend like money at the boardwalk fries stand.' } });
addSceneSpot('arcade', { id: 'fortune', rect: { x: 554, y: 83, w: 80, h: 168 }, lines: [
  'MADAME, in a glass box, waiting for a quarter. Her eyes follow you. That\'s the point of her.',
  'The card slot has a fortune half out: "You will be offered a deal. Read it twice."'] });
addSceneSpot('arcade', { id: 'prizes', rect: { x: 394, y: 149, w: 163, h: 97 }, lines: [
  'The prize counter: rubber ducks, finger traps and one wristwatch nobody has ever had enough tickets for.'] });

// ---------------------------------------------------------------- Harbor Green, by day
addSceneSpot('greenDay', { id: 'chess', rect: { x: 150, y: 274, w: 56, h: 35 }, lines: [
  'The stone chess table. Someone has left a game mid-way, and white is in trouble.',
  'You move a white bishop. It doesn\'t help.'] });
addSceneSpot('greenDay', { id: 'memorial', rect: { x: 78, y: 171, w: 36, h: 95 }, lines: [
  'The war memorial. The names on the bottom row are the same surnames as half your customers.'] });
addSceneSpot('greenDay', { id: 'pigeon', rect: { x: 236, y: 293, w: 18, h: 16 }, where: 'the Green', lines: [
  'A pigeon, waiting for you to drop something.'], find: { on: 1, coin: 1, line: 'The pigeon flaps off and leaves a dollar coin behind. Fair trade.' } });
addSceneSpot('greenDay', { id: 'bandstand', rect: { x: 190, y: 110, w: 136, h: 144 }, lines: [
  'The bandstand, freshly painted for the season. The paint is still tacky on the rail.'] });

// ---------------------------------------------------------------- Saint Brine's
addSceneSpot('saintbrines', { id: 'roof', rect: { x: 451, y: 73, w: 29, h: 118 }, lines: [
  'The ROOF FUND thermometer. Someone has colored in a little more than was given.'] });
addSceneSpot('saintbrines', { id: 'box', rect: { x: 234, y: 267, w: 29, h: 25 }, where: 'Saint Brine\'s', lines: [
  'The donations box, with a padlock bigger than it is.'], find: { rep: 1, line: 'You drop in a couple of dollars. A woman in the front pew notices, and nods.' } });
addSceneSpot('saintbrines', { id: 'board', rect: { x: 111, y: 66, w: 118, h: 84 }, lines: [
  'The notice board: a lost cat, a found cat (not the same cat), bridge on Thursdays.'] });

// ---------------------------------------------------------------- the Historical Society
addSceneSpot('historical', { id: 'portrait', rect: { x: 216, y: 34, w: 70, h: 85 }, lines: [
  'A founder of the Society, painted looking as if the painter owed him money.'] });
addSceneSpot('historical', { id: 'ship', rect: { x: 296, y: 50, w: 96, h: 60 }, lines: [
  'MERIDIAN 1849. The frame is worth more than the painting, and you\'d say so if anyone asked.'] });
addSceneSpot('historical', { id: 'clock', rect: { x: 291, y: 123, w: 22, h: 23 }, lines: [
  'A mantel clock, four minutes fast. Every clock in this town seems to be.'] });
addSceneSpot('historical', { id: 'case', rect: { x: 60, y: 189, w: 120, h: 68 }, lines: [
  'A model ship and a brass sextant under glass. The sextant\'s been polished so often the scale has worn smooth.'] });

// ---------------------------------------------------------------- the Rusty Anchor
addSceneSpot('rustyanchor', { id: 'darts', rect: { x: 454, y: 80, w: 32, h: 31 }, lines: [
  'The dartboard. The wall around it has taken more hits than the board.'] });
addSceneSpot('rustyanchor', { id: 'chalk', rect: { x: 34, y: 159, w: 80, h: 58 }, lines: [
  'TRIVIA THU, OPEN MIC, CHOWDER CUP 6. Someone has rubbed out a 5 to write the 6.'] });
addSceneSpot('rustyanchor', { id: 'bell', rect: { x: 274, y: 46, w: 26, h: 25 }, lines: [
  'The bell over the bar. Ring it and you\'re buying the room a round, so you don\'t.'] });

// ---------------------------------------------------------------- the Grange Hall
addSceneSpot('grange', { id: 'piano', rect: { x: 110, y: 170, w: 60, h: 92 }, lines: [
  'An upright piano with three keys that stick. Everyone who plays it here has learned which three.'] });
addSceneSpot('grange', { id: 'urn', rect: { x: 470, y: 196, w: 96, h: 66 }, lines: [
  'The coffee urn. It tastes as if it has been on since the hall was built.',
  'A tin for donations by the cups. It has a nail through the lid so nobody can borrow from it.'] });
addSceneSpot('grange', { id: 'roll', rect: { x: 480, y: 70, w: 66, h: 92 }, lines: [
  'The roll of Grange officers in gold paint. The Treasurer\'s line has been painted over more than the others.'] });
addSceneSpot('grange', { id: 'chairs', rect: { x: 490, y: 276, w: 130, h: 60 }, where: 'the Grange Hall', lines: [
  'Folding chairs, put out in rows by somebody who cared and pushed about by everybody since.'],
  find: { on: 1, coin: 1, line: 'A dollar bill folded very small, under the end chair. Somebody\'s bingo money.' } });

// ---------------------------------------------------------------- the sandbar at low tide
addSceneSpot('sandbar', { id: 'buoy', rect: { x: 448, y: 274, w: 60, h: 26 }, lines: [
  'A crab trap and a red-and-white buoy that the last storm threw up here. Some lobsterman knows those colors and wants it back.'] });
addSceneSpot('sandbar', { id: 'pool', rect: { x: 420, y: 232, w: 120, h: 18 }, where: 'the sandbar', lines: [
  'A tide pool with the whole sky in it. A hermit crab is trying a bottle cap for size.'],
  find: { on: 1, coin: 2, line: 'A soaked two-dollar bill caught in the weed at the edge of the pool. It dries out fine.' } });
addSceneSpot('sandbar', { id: 'breakwater', rect: { x: 300, y: 140, w: 320, h: 36 }, lines: [
  'The breakwater, granite blocks all the way out to the beacon. At low tide people walk out along it. At high tide a few of them have to swim back.'] });
addSceneSpot('sandbar', { id: 'fence', rect: { x: 140, y: 180, w: 130, h: 18 }, lines: [
  'An old snow fence, half buried. It holds the dune up with more hope than wire.'] });

// ---------------------------------------------------------------- Pinwheel Lanes
addSceneSpot('pinwheel', { id: 'balls', rect: { x: 196, y: 228, w: 60, h: 30 }, lines: [
  'Candlepin balls, small enough to hold in one hand. The game is less a sport than a long argument with physics.'] });
addSceneSpot('pinwheel', { id: 'menu', rect: { x: 476, y: 90, w: 148, h: 66 }, lines: [
  'The snack bar board. Round here a frappe is a milkshake, and anyone who calls it a milkshake is from away.'] });
addSceneSpot('pinwheel', { id: 'bench', rect: { x: 40, y: 268, w: 140, h: 30 }, where: 'Pinwheel Lanes', lines: [
  'The bench where you change into rental shoes. A single size-eleven shoe has been living under it for years.'],
  find: { on: 1, coin: 1, line: 'Under the bench, among the lost socks: four quarters. You keep them for the next game.' } });
addSceneSpot('pinwheel', { id: 'pins', rect: { x: 50, y: 116, w: 30, h: 22 }, lines: [
  'Ten skinny pins at the end of lane five. In candlepin the fallen pins stay where they drop, and you play on through them.'] });

// ---------------------------------------------------------------- a kitchen on Front Street
addSceneSpot('kitchen', { id: 'stove', rect: { x: 40, y: 140, w: 120, h: 120 }, lines: [
  'A kettle on the hob, just off the boil. Whoever lives here was expecting company, or always is.'] });
addSceneSpot('kitchen', { id: 'window', rect: { x: 250, y: 36, w: 150, h: 110 }, lines: [
  'The harbor between gingham curtains. Somebody washes this glass every week.'] });
addSceneSpot('kitchen', { id: 'fridge', rect: { x: 530, y: 120, w: 80, h: 140 }, lines: [
  'Magnets from all over the Cape, holding up a child\'s drawing of a whale with a great many teeth.'] });
addSceneSpot('kitchen', { id: 'calendar', rect: { x: 176, y: 120, w: 40, h: 26 }, lines: [
  'A free calendar from the fish market, with the tide times pencilled into every day.'] });

// ---------------------------------------------------------------- the Athenaeum reading room
addSceneSpot('athenaeum', { id: 'shelves', rect: { x: 0, y: 22, w: 150, h: 240 }, lines: [
  'Two storeys of books and a rolling ladder. A card taped to the ladder says ONE AT A TIME, PLEASE.'] });
addSceneSpot('athenaeum', { id: 'catalogue', rect: { x: 150, y: 196, w: 24, h: 66 }, lines: [
  'The card catalogue, still in use. A drawer marked SHIPWRECKS (LOCAL) has been opened so often its brass handle shines.'] });
addSceneSpot('athenaeum', { id: 'window', rect: { x: 236, y: 0, w: 170, h: 196 }, lines: [
  'The big arched window over the harbor. It\'s the best seat in town, and free, as long as you stay quiet.'] });
addSceneSpot('athenaeum', { id: 'table', rect: { x: 474, y: 276, w: 140, h: 40 }, where: 'the Athenaeum', lines: [
  'Green lamps along the long table. Someone has left a book lying face down, and the librarian will hear about it.'],
  find: { on: 1, rep: 1, line: 'You close the book and put it back where it belongs. The librarian notices, and gives you the smallest nod.' } });

// ---------------------------------------------------------------- the Cliff Road house
addSceneSpot('cliffroad', { id: 'dogs', rect: { x: 40, y: 250, w: 90, h: 40 }, lines: [
  'A big dog asleep on top of a smaller dog. Neither of them minds.'] });
addSceneSpot('cliffroad', { id: 'portrait', rect: { x: 96, y: 40, w: 70, h: 88 }, lines: [
  'A Thorne in a captain\'s coat. The painter gave him a kind face and, you suspect, charged extra for it.'] });
addSceneSpot('cliffroad', { id: 'ships', rect: { x: 440, y: 90, w: 170, h: 52 }, lines: [
  'Ship models in glass cases, every line rigged. Each has a brass plate with a name and a year, and two of the years are the years they sank.'] });
addSceneSpot('cliffroad', { id: 'table', rect: { x: 150, y: 244, w: 345, h: 20 }, lines: [
  'The table is laid for twelve. The silver is real. You can tell from here; in your line of work you always can.'] });

// ---------------------------------------------------------------- the old burying ground, at night
addSceneSpot('graveyard', { id: 'sign', rect: { x: 106, y: 300, w: 44, h: 26 }, lines: [
  'OLD BURYING GROUND, 1660. The sexton says the gate squeaks on purpose, so the dead know someone is coming.'] });
addSceneSpot('graveyard', { id: 'church', rect: { x: 428, y: 40, w: 124, h: 178 }, lines: [
  'The meeting house. One window is lit, though nobody ever admits to being in there this late.'] });
addSceneSpot('graveyard', { id: 'oak', rect: { x: 180, y: 40, w: 120, h: 186 }, lines: [
  'An oak older than the oldest stone. Its roots have been slowly shoving the front row out of line for three hundred years.'] });
addSceneSpot('graveyard', { id: 'stones', rect: { x: 500, y: 236, w: 120, h: 60 }, lines: [
  'Slate headstones with winged skulls, worn soft by the weather. One says only HE MEANT WELL.'] });

// ---------------------------------------------------------------- the harbormaster's shack (day and night)
for (const bg of ['harbormaster', 'harbormasterNight']) {
  addSceneSpot(bg, { id: 'charts', rect: { x: 20, y: 28, w: 180, h: 72 }, lines: [
    'Charts of the harbor and its approaches, with every rock that ever sank a boat marked in red pencil.'] });
  addSceneSpot(bg, { id: 'tides', rect: { x: 20, y: 110, w: 70, h: 64 }, lines: [
    'This month\'s tide table. Half of Hollow Neck plans its life around it. The other half are tourists.'] });
  addSceneSpot(bg, { id: 'oilskins', rect: { x: 14, y: 180, w: 110, h: 64 }, lines: [
    'Life jackets and an oilskin on hooks. They smell of every storm since the shack went up.'] });
  addSceneSpot(bg, { id: 'coffee', rect: { x: 368, y: 180, w: 32, h: 34 }, lines: [
    'The coffee maker, which is never switched off. The pot has rings inside it like a tree, one for every year.'] });
}
