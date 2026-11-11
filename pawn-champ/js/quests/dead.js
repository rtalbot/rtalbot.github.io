// Pawn Champ - The Dead Letter Office: the code half of js/stories/dead.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('dead', {
  albumHere() { return !!S.stock.find(x => x.uniqueId === 'stampAlbum'); },
  // the letters from the dead-letter room: Old Pell's, and one for each crossing in the run. The
  // scene reads them out; this remembers who got one, and +2 reputation a letter.
  deliverLetters() {
    const letters = ['Old Pell'];
    if (questActive('hollis')) letters.push('Hollis Fenn');
    if (questActive('radio')) letters.push('Royce Kittredge');
    if (questActive('breakwaters')) letters.push('the Breakwaters');
    S.flags.deadLetters = letters;
    change('rep', 2 * letters.length, 'Delivered letters from the dead-letter room');
    if (letters.includes('Hollis Fenn')) S.flags.hollisLetter = true;
    if (letters.includes('Royce Kittredge')) S.flags.royceLetter = true;
    if (letters.includes('the Breakwaters')) S.flags.bwLetter = true;
  }
});
