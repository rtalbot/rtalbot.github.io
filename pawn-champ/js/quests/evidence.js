// Pawn Champ - The Evidence Room: the code half of js/stories/evidence.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

const evidenceCandidate = () => S.stock.find(i => !i.held && !i.nosale && !i.unique && !i.fake && !i.noticeId);

storyHooks('evidence', {
  // Barrow only comes if something on your shelf could be hers
  candidate: () => !!evidenceCandidate(),
  remember(ctx) { const it = ctx.vars.it; S.flags.evidenceItem = { name: it.name, paid: it.paid || Math.round(it.guide * 0.5) }; },
  payBack() { change('coin', (S.flags.evidenceItem && S.flags.evidenceItem.paid) || 20, 'Captain Barrow paid back what you paid for the evidence'); },
  friendAtTheStation() { S.heat = clamp(S.heat - 2, 0, 100); },
  // you let the lunch errand go
  stoodUp: () => !!(S.run && S.run.errands && S.run.errands['evidence-log'] === -1)
});
