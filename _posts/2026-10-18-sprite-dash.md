---
layout: post
title: "Sprite Dash: turning a sprite test into a runner"
description: The old Sprite Test page was a character you could nudge around with the arrow keys. Now it's an endless runner that keeps getting faster.
date: 2026-10-18 10:30:00 -0700
tags: [games, javascript, canvas]
project_link: /spritetest
project_name: Sprite Dash
---

The Sprite Test page started as exactly that: a test. It loaded a couple of Super Mario Bros. 3 sprite sheets, played a walk cycle, and let you push the character around with the arrow keys while a Fly Guy wandered across the screen. It proved the sprite and animation code worked, but there was nothing to *do*.

So it's a game now. **Sprite Dash** is an endless runner: Mario runs, the world scrolls, and you jump and duck your way past whatever the sprite sheet throws at you.

<!--more-->

## How it plays

- **Jump** with Space, ↑ or W. Hold it to jump higher, tap it for a short hop.
- **Duck** with ↓ or S. Ducking in mid-air drops you out of a jump fast.
- **Stomp** shy guys and ostriches by landing on them. Stomps chain into combos for bonus points.
- **Avoid** spinies, snakes and the birds. Low birds have to be jumped, high birds have to be ducked.

On a phone, tap the right side of the screen to jump and hold the left side to duck. Your best score is saved in the browser.

## Making it feel fast

The thing I cared about most was the sense of speed. The run speed climbs smoothly the whole game, and a few layers sell it:

- **Parallax.** Far mountains, mid hills, the brick ground and a row of foreground grass all scroll at different rates, so the screen has depth.
- **Speed streaks.** Past a certain speed, white streaks start whipping across the sky, and there are more of them the faster you go.
- **Motion trail.** At high speed Mario leaves a faint after-image.
- **Dust and impact.** Little dust particles kick up from his feet, and landing, stomping and crashing each get a puff, a screen shake or a flash.
- **Animation rate.** The run cycle speeds up with the scroll speed, so his legs always match the ground.

The sky also moves from day to sunset to night as the distance climbs, which gives a rough sense of how far you've got before you even look at the score.

## Under the hood

Everything is drawn into a small low-resolution canvas, about 200 pixels tall, where one canvas pixel is one sprite pixel. That buffer is then scaled up to the window with smoothing turned off. The pixel art stays crisp at any size, and particles and streaks automatically land on the same pixel grid as the sprites.

The sprite rectangles were measured straight from the sheets by finding the connected blobs of non-transparent pixels. That's the same idea behind the auto-detect in the [Sprite Sheet Generator](/spritegen), which is how this game got made.

Obstacle spacing scales with the current speed, so there's always enough room to react, with the occasional tight pair once you're a few hundred metres in. Hitboxes are a little smaller than the sprites, because a game that feels fair is more fun than one that's pixel-perfect.
