// Pawn Champ - The Vanishing Box: the code half of js/stories/vanishing.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and the Magician's Box.
'use strict';

const vanishBox = () => S.stock.find(it => it.uniqueId === 'vanishBox');

storyHooks('vanishing', {
  // something small goes missing from the shelves, and turns up in a child's pocket at the show:
  // with the pop-up's line ({it} is the thing)
  vanishSmall(ctx, line) {
    const box = vanishBox();
    const small = S.stock.filter(it => it !== box && !it.questKey && !it.held && it.guide <= 60);
    if (!small.length) return;
    const it = pick(small);
    S.stock = S.stock.filter(x => x !== it);
    S.flags.vanishTaken = { name: it.name, guide: it.guide, paid: it.paid, item: it };
    renderPanel();
    ctx.vars.it = it;
    toast(storyText(line, ctx), null, it.icon);
  },
  // the child gives it back: with a pop-up's line, shown with the thing's icon
  giveBack(ctx, line) {
    const it = S.flags.vanishTaken.item;
    S.stock.push(it);
    if (line) toast(storyText(line, ctx), null, it.icon);
  },
  // the night's test: the box, and a ring gone missing
  testTaken() { const it = makeItem('ring'); S.flags.vanishTaken = { name: it.name, guide: it.guide, item: it }; S.coin = 100; },
  // the morning after the Magician's Box hid something: it's back, with its police tag gone
  unhide(ctx, line) {
    const it = S.flags.vanishHidden;
    S.flags.vanishHidden = null;
    if (typeof it !== 'object') return;
    it.noticeId = null; it.knownHot = false; it.mark = null;
    S.stock.push(it); renderPanel();
    ctx.vars.it = it;
    toast(storyText(line, ctx), null, it.icon);
  }
});

// The Magician's Box: once a run, an item on a police notice spends the night inside it. It comes
// back the next morning (the "unhide" hook), after any raid, with the tag gone.
HOOKS.tick.push(() => {
  if (!questActive('vanishing')) return null;
  const box = vanishBox();
  if (!box || !box.effect || S.flags.vanishUsed || view.timeOfDay < 0.9) return;
  const hot = S.stock.find(it => it.noticeId && !it.held);
  if (!hot) return;
  S.flags.vanishUsed = true; S.flags.vanishHidden = hot;
  S.stock = S.stock.filter(x => x !== hot); renderPanel();
  toast(`At closing, the ${hot.name.toLowerCase()} isn't on the shelf anymore. The lacquered box is warm.`, null, 'lacquerbox');
});
