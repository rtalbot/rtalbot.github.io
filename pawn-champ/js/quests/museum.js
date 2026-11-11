// Pawn Champ - The Museum Job: the code half of js/stories/museum.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
//
// If this quest is in the run, the built crown beat on week 4 Thursday stands aside for it (below).
'use strict';

storyHooks('museum', {
  // the fake that can stand in for the crown: Dr. Lusk's tiara, or any fake jewelry you know is fake
  swapPiece(ctx) { ctx.vars.swap = S.stock.find(i => !i.held && (i.uniqueId === 'pasteTiara' || (i.cat === 'jewelry' && i.knownFake))) || null; },
  carryingCall: () => carrying('call'),
  carryingPhoto: () => carrying('photo'),
  // the lookout's bad roll: 20%, more with police heat, halved if you brought something to whistle with
  caught(ctx) { ctx.vars.caught = Math.random() < (0.2 + S.heat / 250) * (ctx.vars.whistle ? 0.5 : 1); },
  siren() { Sound.siren(); },
  fenceDeals(ctx, n) { S.flags.fenceDeals = (S.flags.fenceDeals || 0) + n; },
  // the Hand's last instalment, times this
  debt(ctx, times) { if (S.installmentMult[3] > 0) S.installmentMult[3] *= times; },
  // the night of the job has gone by (you weren't there)
  jobPast() {
    const night = S.run && S.run.nights ? S.run.nights['museum-job'] : dayOf('3-3');
    return !!night && dayNum() > night;
  },
  // the gala's test setup: invited; Wren's fence seven times in ten; a paste tiara six times in ten
  galaTest() { S.flags.museumInvite = true; S.flags.fence = Math.random() < 0.7; if (Math.random() < 0.6) S.stock.push(makeUnique('pasteTiara', { inspected: true, knownFake: true })); }
});

// The built crown beat (week 4 Thursday) is this story's last act; when The Museum Job runs, it stands aside.
for (const c of (SCRIPT['4-4'] && SCRIPT['4-4'].customers) || []) {
  if (c.run !== story.wrenCrown) continue;
  const w = c.when;
  c.when = () => !questActive('museum') && (!w || w());
}
