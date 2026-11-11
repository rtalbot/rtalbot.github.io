// Pawn Champ - The Candlepin Trophy: the code half of js/stories/candlepin.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and the bowling.
'use strict';

// ---------------------------------------------------------------- the bowling: a timing bar
// A marker sweeps along a bar over the stage; the "Roll" button stops it. The nearer the middle,
// the more pins go down. Built with a choose() button, so the test tools can play it too.
async function candleBall(up) {
  const host = document.querySelector('#stage');
  const bar = document.createElement('div');
  bar.style.cssText = 'position:absolute;left:30%;right:30%;top:12%;height:14px;background:linear-gradient(90deg,#5a2a2a,#c8a040 40%,#f8e8a0 50%,#c8a040 60%,#5a2a2a);border:2px solid #1a1a1e;z-index:5;pointer-events:none';
  const mark = document.createElement('div');
  mark.style.cssText = 'position:absolute;top:-4px;width:4px;height:22px;background:#f8f8f0;border:1px solid #1a1a1e';
  bar.appendChild(mark); host.appendChild(bar);
  const t0 = performance.now(); let pos = 0, live = true;
  const step = () => { if (!live) return; const t = (performance.now() - t0) / 900; pos = Math.abs((t % 2) - 1); mark.style.left = `calc(${pos * 100}% - 2px)`; requestAnimationFrame(step); };
  step();
  await choose(['Roll!']);
  live = false; bar.remove();
  const acc = 1 - Math.abs(pos - 0.5) * 2;
  return Math.min(up, Math.round(up * (0.15 + 0.85 * Math.pow(acc, 1.3))));
}
async function candleBox() {
  let pins = Array(10).fill(true), down = 0;
  PINWHEEL.pins = pins.slice();
  for (let ball = 1; ball <= 3 && down < 10; ball++) {
    const up = pins.filter(Boolean).length;
    const n = await candleBall(up);
    // knock down n of the standing pins, front ones first with a bit of scatter
    const left = pins.map((p, i) => (p ? i : -1)).filter(i => i >= 0).sort((a, b) => a - b + (Math.random() - 0.5) * 4);
    for (const i of left.slice(0, n)) pins[i] = false;
    down += n; PINWHEEL.pins = pins.slice();
    await narrate(n === up ? (ball === 1 ? 'Every pin goes down. A strike, in candlepin. Somebody drops a hot dog.' : 'The last of them go down.') : n ? `${n} down. ${up - n} still standing${ball < 3 ? ', and the deadwood stays on the lane.' : '.'}` : 'It goes clean between the pins. Nothing falls. Somebody says "ooh".');
  }
  return down;
}

storyHooks('candlepin', {
  // the lanes with no pins drawn on them (js/places/pinwheel.js)
  pins() { PINWHEEL.pins = null; },
  // one box, three balls: how many pins went down, as "down"
  async bowl(ctx) { ctx.vars.down = await candleBox(); }
});
