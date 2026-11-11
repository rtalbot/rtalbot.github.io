// Pawn Champ - The Selectmen's Race, the long arc: the code half of its two chapters,
// js/stories/selectTerm.js and js/stories/selectMeeting.js (docs/STORY_DATA.md): Tess's compass on
// loan, and the count on Article 31.
'use strict';

const selectGov = () => S.flags.selectWin === 'gordie' ? 'gordie' : 'tess';

storyHooks('selectarc', {
  async music(ctx, track) { Sound.music(track); },
  // Tess pawns her father's binnacle compass, due the first week of March, however many months
  // away that is (loans carry over, js/stay.js)
  lendCompass(ctx, lent) {
    const item = makeUnique('binnacle');
    item.inspected = true; item.clues = (item.tells || []).map(x => ({ text: x, cls: 'good' }));
    const due = dayNum() + Math.max(0, MONTHS.length - monthNum()) * WEEKS * 5 + 2;
    grantLoan({ item, name: CAST.tess.name, look: CAST.tess.look }, lent, due, true);
  },
  // a friend in the room, other than the two selectmen (js/standing.js)
  voteAlly: () => typeof ally === 'function' && !!ally('vote', { exclude: ['tess', 'gordie'] }),
  chipIn(ctx, why) { change('coin', -Math.min(50, S.coin), why); },
  // Tess's compass is still on your shelf, on its loan
  compassHeld() { const c = S.stock.find(x => x.uniqueId === 'binnacle'); return !!(c && c.held && S.loans.some(l => l.id === c.held)); },
  warrantInRun: () => !!(S.run && hubInRun('warrant', S.run)),
  met() { questMet('selectMeeting'); },
  // inside the Annual Town Meeting: the moderator and you are already there
  fromHub(ctx) { ctx.vars.mo = view.actors.find(x => x.name === CAST.marguerite.name) || null; ctx.vars.keeper = keeper; },
  // what you said on the floor (2 for the fleet, -2 for the marina, 'split' for the split you made at
  // the hearing, 0 for nothing), named "you", and a friend in the room who backs you ("backer"); Marguerite in the chair doesn't take sides
  speak(ctx, n) {
    ctx.vars.forSplit = n === 'split';
    if (n === 'split') n = 0;
    ctx.vars.you = n;
    const fr = n && typeof ally === 'function' ? ally('vote', { exclude: ['tess', 'gordie', 'marguerite'] }) : null;
    if (fr) { ctx.vars.you += Math.sign(n); ctx.vars.backer = { name: fr.name || CAST[fr.id].name }; } else ctx.vars.backer = null;
  },
  // the count: the room before you spoke (your sign in October, the hearing, the bell), what you
  // said, and some luck. Names the result "count": 'both', 'pier' or 'marina'
  count(ctx) {
    const f = S.flags, gov = selectGov();
    let lean = f.signFor === 'tess' ? 1 : f.signFor === 'gordie' ? -1 : 0;
    if (f.selectPier === 'fleet') lean += 1; else if (f.selectPier === 'marina') lean -= 1;
    if (f.termBell === 'pier') lean += 1; else if (f.termBell === 'gordie') lean -= 1;
    if (f.termEnd === 'deal' && gov === 'tess') lean += 1;
    const split = f.selectPier === 'split' || f.termEnd === 'deal';
    const total = lean + (ctx.vars.you || 0) + (Math.random() * 2 - 1);
    ctx.vars.count = ctx.vars.forSplit || (split && Math.abs(total) < 1.5) ? 'both' : total > 0 ? 'pier' : 'marina';
  }
});
