// Pawn Champ - The Photo Booth: the code half of js/stories/photobooth.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and the lobby at closing.
// Its places are drawn in js/places/pinwheel.js.
'use strict';

storyHooks('photobooth', {
  // the booth's lamp: how bright its flash is
  flash(ctx, n) { PHOTOBOOTH.flash = n; },
  // it flashes four times
  async flashes() { for (let i = 0; i < 4; i++) { PHOTOBOOTH.flash = 0.8; await sleep(350); } },
  // kept running: one to three sittings a morning, at two dollars
  sittings() { const n = 1 + (dayNum() * 7) % 3; change('coin', n * 2, `${n} sitting${n > 1 ? 's' : ''} in the photo booth`); },
  // every fourth morning, Len in the fourth frame
  fourthFrame: () => dayNum() % 4 === 0
});
