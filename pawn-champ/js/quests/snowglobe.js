// Pawn Champ - The Snow Globe: the code half of js/stories/snowglobe.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('snowglobe', {
  // Theo only comes if the globe is on your shelves
  globeHere() { return S.stock.some(it => it.uniqueId === 'snowGlobe'); },
  // whether tomorrow is a rain day: the shop's own rain (js/secrets.js habits()) if the shop secrets
  // are in, otherwise the globe's own, decided once a day
  rainTomorrow() {
    const d = dayNum() + 1;
    if (typeof habits === 'function') { const h = habits(); if (h.rain[d] === undefined) h.rain[d] = Math.random() < 0.2; return h.rain[d]; }
    S.flags.globeRain = S.flags.globeRain || {};
    if (S.flags.globeRain[d] === undefined) S.flags.globeRain[d] = Math.random() < 0.2;
    return S.flags.globeRain[d];
  }
});
