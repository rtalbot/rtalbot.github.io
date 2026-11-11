// Pawn Champ - helpers shared by the quests in js/quests/. Each quest is its own file there.
'use strict';

// the drowned (The Fog Week, and anyone else who meets a ghost)
const GHOST = 0.6;
function ghostLook() {
  const l = randomLook();
  l.skin = '#c0d8e8'; l.coat = pick(['#4a6a8a', '#5a7a9a', '#6a7a9a']); l.hatc = '#3a5a7a'; l.pants = '#3a5070'; l.hair = '#dfefff'; l.eye = '#8af0ff';
  l.style = pick(['jacket', 'dress', 'jacket']); l.long = true; l.hat = pick(['wide', 'bonnet', 'top', null]); l.logo = undefined; l.vest = undefined; l.glasses = undefined; l.ghost = true;
  return l;
}
