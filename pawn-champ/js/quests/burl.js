// Pawn Champ - The Burl Bowl: the code half of js/stories/burl.js (docs/STORY_DATA.md): the cedar
// stump it draws, and the hooks for what the bowl takes from your shelves at night.
// Its place is drawn in js/places/cedarstump.js.
'use strict';

const bowlHere = () => S.stock.find(x => x.uniqueId === 'burlBowl');
storyHooks('burl', {
  bowlHere: () => !!bowlHere(),
  // every other morning while the bowl is on the shelf it takes something: "odd" is a night it doesn't
  nightCount(ctx) { const n = (S.flags.burlNights || 0) + 1; S.flags.burlNights = n; ctx.vars.odd = !!(n % 2); },
  // something small off the shelf, at random, into the stump's hollow ("gone", or nothing if there's nothing small)
  takeSmall(ctx) {
    const small = S.stock.filter(x => !x.unique && !x.questKey && x.guide <= 60);
    ctx.vars.gone = null;
    if (!small.length) return;
    const it = small[Math.floor(Math.random() * small.length)];
    S.stock = S.stock.filter(x => x !== it);
    (S.flags.burlTaken = S.flags.burlTaken || []).push({ name: it.name, item: it });
    renderPanel();
    ctx.vars.gone = it;
  },
  takenNames: () => (S.flags.burlTaken || []).map(t => t.name.toLowerCase()).join(' and '),
  // everything the bowl took goes back on your shelves
  giveBack() {
    const taken = Array.isArray(S.flags.burlTaken) ? S.flags.burlTaken : [];
    for (const t of taken) if (t.item) S.stock.push(t.item);
    S.flags.burlTaken = [];
  }
});

