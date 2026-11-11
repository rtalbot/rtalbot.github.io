// Pawn Champ - Town Meeting: the code half of js/stories/warrant.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name (how the room votes), and the vault's scene spots.
'use strict';

// The room before anyone speaks, for each of the three articles about the shop: what you did this
// month and before (Cornelius Webb's deed from M26, your heat, your name in town).
const WARRANT_SCORES = {
  hold: f => (S.heat >= 50 ? -1 : 0) + (S.rep >= 70 ? 1 : 0),
  use: f => (S.rep >= 70 ? 1 : 0),
  alley: f => (f.miniAlley ? 2 : 0)
};
const warrantCap = s => s[0].toUpperCase() + s.slice(1);
const warrantHere = id => typeof townHere === 'function' && !!townHere(id);

storyHooks('warrant', {
  setCoin(ctx, n) { S.coin = n; },
  // the meeting before the meeting: who's in town, and whom you've talked to
  dunphyHere: () => warrantHere('dunphy'),
  gordieHere: () => warrantHere('gordie'),
  ruthieHere: () => warrantHere('ruthie'),
  startCanvass() { if (!S.flags.warrantCanvass || typeof S.flags.warrantCanvass !== 'object') S.flags.warrantCanvass = {}; },
  canvassed(ctx, id) { S.flags.warrantCanvass[id] = true; },
  talked(ctx, id) { ctx.vars['talked' + warrantCap(id)] = true; },
  // the Annual Town Meeting
  evening(ctx) { Sound.music('night'); keeper = ctx.vars.you; },
  startVotes(ctx) {
    const g = S.flags.warrantGavel;
    ctx.vars.vote = { early: g === 'returned' || g === 'home', foeDone: false, allyDone: false, votes: {}, score: 0 };
  },
  score(ctx, id) {
    const v = ctx.vars.vote, f = S.flags;
    v.score = WARRANT_SCORES[id](f) + ((f.warrantCanvass || {})[id] ? 1 : 0) + (v.early ? 1 : 0);
  },
  // standing (js/standing.js): a foe stands up against you once; a friend carries one vote for you
  foe(ctx) {
    const v = ctx.vars.vote;
    ctx.vars.foe = null;
    if (v.foeDone || typeof foe !== 'function') return;
    const e = foe('vote');
    if (e) { v.foeDone = true; v.score -= 1; ctx.vars.foe = { id: e.id, name: e.name || CAST[e.id].name }; }
  },
  friend(ctx) {
    const v = ctx.vars.vote;
    const fr = !v.allyDone && typeof ally === 'function' ? ally('vote') : null;
    ctx.vars.friend = fr ? { id: fr.id, name: fr.name || CAST[fr.id].name } : null;
  },
  add(ctx, n) { ctx.vars.vote.score += n; },
  friendSpeaks(ctx) { ctx.vars.vote.allyDone = true; ctx.vars.vote.score += 2; },
  count(ctx, id) { ctx.vars.won = ctx.vars.vote.votes[id] = ctx.vars.vote.score >= 2; },
  withdrawn(ctx) { ctx.vars.vote.votes.use = true; },
  result(ctx) {
    const f = S.flags, votes = ctx.vars.vote.votes;
    f.warrantVotes = votes;
    const wins = Object.values(votes).filter(Boolean).length;
    change('rep', wins * 2 - 2, `Town Meeting: ${wins} of 3 articles went your way`);
    f.warrantEnd = wins === 3 ? 'whole' : wins === 2 ? 'carried' : 'outvoted';
  }
});

addSceneSpot('townhallVault', { id: 'door', rect: { x: 4, y: 74, w: 172, h: 172 }, lines: [
  'The vault door is a foot thick. Marguerite says it has been shut twice since 1911, both times by accident.',
  'A brass plate: MOSLER SAFE CO. HAMILTON, OHIO. Somebody has polished the O.'] });
addSceneSpot('townhallVault', { id: 'reports', rect: { x: 190, y: 40, w: 410, h: 172 }, lines: [
  'Annual Town Reports back to 1854. In 1902 the town spent four dollars on "a goat, for the lawn".',
  'The 1968 report, page 41: "The moderator\'s gavel was not returned at the close of the meeting. Inquiries continue."'],
  find: { on: 1, coin: 2, line: 'Two dollars folded into the 1968 report as a bookmark. Somebody\'s inquiry fee, never spent.' } });
addSceneSpot('townhallVault', { id: 'table', rect: { x: 360, y: 240, w: 160, h: 66 }, lines: [
  'Three petitions on the table, each with its signatures. Some names are on two of them. One name is on all three, in different pens.'] });
