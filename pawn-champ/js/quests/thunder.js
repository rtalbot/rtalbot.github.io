// Pawn Champ - The Thunder Sheet: the code half of js/stories/thunder.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

// The studio is drawn in js/places/clarion.js. CLARION.flash > 0 lights the room for a thunderclap.
CLARION.flash = 0;
const studioAnim = PLACES.clarionStudio.animate;
PLACES.clarionStudio.animate = function (g, now) {
  studioAnim.call(this, g, now);
  if (CLARION.flash > 0) { g.fillStyle = `rgba(220,230,255,${Math.min(0.7, CLARION.flash)})`; g.fillRect(0, 0, NW, NH); CLARION.flash -= 0.04; }
};

// ---------------------------------------------------------------- the effects: a timing bar
// A marker sweeps a bar over the stage; Hit! stops it. The nearer the middle, the better the noise.
// Built on choose(), so the test tools can play it too.
async function thunderCue() {
  const host = document.querySelector('#stage');
  const bar = document.createElement('div');
  bar.style.cssText = 'position:absolute;left:30%;right:30%;top:12%;height:14px;background:linear-gradient(90deg,#2a2a5a,#6a6ac0 40%,#e8e8ff 50%,#6a6ac0 60%,#2a2a5a);border:2px solid #1a1a1e;z-index:5;pointer-events:none';
  const mark = document.createElement('div');
  mark.style.cssText = 'position:absolute;top:-4px;width:4px;height:22px;background:#ff4a3a;border:1px solid #1a1a1e';
  bar.appendChild(mark); if (host) host.appendChild(bar);
  const t0 = performance.now(); let pos = 0, live = true;
  const step = () => { if (!live) return; const t = (performance.now() - t0) / 700; pos = Math.abs((t % 2) - 1); mark.style.left = `calc(${pos * 100}% - 2px)`; requestAnimationFrame(step); };
  step();
  await choose(['Hit!']);
  live = false; bar.remove();
  return Math.abs(pos - 0.5) < 0.16;
}

storyHooks('thunder', {
  // off air, no flash, and the night music
  studio() { CLARION.onAir = false; CLARION.flash = 0; Sound.music('night'); },
  onAir(ctx, on) { CLARION.onAir = on; },
  // one cue on the timing bar: hit, and hits so far
  async cue(ctx) { ctx.vars.hit = await thunderCue(); ctx.vars.hits = (ctx.vars.hits || 0) + (ctx.vars.hit ? 1 : 0); },
  flash() { CLARION.flash = 0.8; }
});
