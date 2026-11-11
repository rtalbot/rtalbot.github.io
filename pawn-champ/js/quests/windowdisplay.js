// Pawn Champ - The Window Display: the code half of js/stories/windowdisplay.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('windowdisplay', {
  // Bryony is still across the street: The Rival Shop ran (this month or an earlier one) and she
  // neither closed nor moved in with you, and she's still there after M16's arc (js/quests/rivalarc.js)
  bryony: () => !!S.flags.rivalIn && !['crushed', 'merged'].includes(S.flags.rivalEnd) && !['gone', 'note'].includes(S.flags.eveEnd),
  // somebody rearranges the window: at most three times, and never two nights running
  fixDue() {
    const f = S.flags, n = f.winFixes || 0;
    return f.winLast !== dayNum() && n < 3 && !(f.winLast && dayNum() - f.winLast < 2);
  },
  fixed() { S.flags.winLast = dayNum(); S.flags.winFixes = (S.flags.winFixes || 0) + 1; }
});
