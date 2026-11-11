// Pawn Champ - The Last Pageant: the code half of js/stories/pageant.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name, and anything drawn.
'use strict';

// what the children borrow: the things on your shelves that could be a crown, a star or a gift
const pageantProp = it => !it.held && !it.nosale && !it.questKey && ['jewelry', 'silver', 'curio'].includes(it.cat);
const pageantLentItems = () => (Array.isArray(S.flags.pageantLent) ? S.flags.pageantLent : []).map(uid => S.stock.find(x => x.uid === uid)).filter(Boolean);

storyHooks('pageant', {
  // up to three props, and their names for the button
  findProps(ctx) {
    ctx.vars.props = S.stock.filter(pageantProp).slice(0, 3);
    ctx.vars.propNames = ctx.vars.props.map(p => p.name.toLowerCase()).join(', ');
  },
  lendProps(ctx) {
    S.flags.pageantLent = ctx.vars.props.map(p => p.uid);
    for (const p of ctx.vars.props) p.nosale = true;
    renderPanel();
  },
  // for the night's test: Dulcie borrowed this one thing
  lend(ctx, name) { S.flags.pageantLent = [ctx.vars[name].uid]; },
  findLent(ctx) { ctx.vars.lent = pageantLentItems(); },
  // what Dulcie borrowed is for sale again (after the show, or at the end of the month if it never went on)
  giveBack() { for (const it of pageantLentItems()) it.nosale = false; }
});
