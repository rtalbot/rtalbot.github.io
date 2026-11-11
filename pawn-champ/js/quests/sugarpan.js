// Pawn Champ - The Sugar Pan: the code half of js/stories/sugarpan.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and the sugarhouse's music and scene spots.
'use strict';

storyHooks('sugarpan', {
  // whether the sugarhouse is boiling (js/places/sugarhouse.js draws the steam)
  boiling(ctx, on) { SUGARHOUSE.boiling = on; },
  // somebody comes in from the street: with "sets" naming them
  async walkIn(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name); },
  hesterHere: () => typeof townHere === 'function' && !!townHere('hester')
});

PLACE_MUSIC.sugarhouse = 'reel'; // a fiddle tune for a sugaring-off
addSceneSpot('sugarhouse', { id: 'buckets', rect: { x: 40, y: 186, w: 40, h: 32 }, lines: [
  'A galvanised bucket on a tap, a lid against the rain. Drip. Drip. You find yourself counting.',
  'Sap is clear and barely sweet, like water somebody has thought about sugar near.'] });
addSceneSpot('sugarhouse', { id: 'woodpile', rect: { x: 476, y: 170, w: 130, h: 70 }, lines: [
  'Split ash and maple stacked bark-up under the lean-to. Half of it is cut short and half cut long. Two people stack this pile.'] });
addSceneSpot('sugarhouse', { id: 'tank', rect: { x: 40, y: 264, w: 110, h: 44 }, lines: [
  'The sap tank on its sled, brimming. A skin of ice on top, which Abijah breaks every morning with his elbow.'],
  find: { on: 1, coin: 2, line: 'Two dollars in a coffee can nailed to the sled, labelled SYRUP $2 HONOR. You leave them where they are. Then you put two more in.' } });
