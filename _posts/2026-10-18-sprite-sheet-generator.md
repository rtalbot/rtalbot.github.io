---
layout: post
title: "A sprite sheet generator that's actually useful"
description: Drop in a sprite sheet, find the frames, build animations and export a packed atlas with JSON your engine can read.
date: 2026-10-18 10:00:00 -0700
tags: [tools, gamedev, javascript]
project_link: /spritegen
project_name: the Sprite Sheet Generator
---

Old sprite sheets are a mess. Ripped sheets like the SMB3 ones on this site don't sit on a neat grid. Frames are different sizes, packed tightly, and sometimes a hat or a tail is a few pixels away from the body it belongs to. Getting usable coordinates out of one usually means an afternoon in an image editor writing numbers down.

The [Sprite Sheet Generator](/spritegen) does that part for you, then lets you turn the frames into animations and export them in formats real engines understand.

<!--more-->

## Finding frames

**Auto-detect** looks for sprites as blobs of non-background pixels. The background can be transparency, the corner colour, or any colour you pick with the eyedropper, with a tolerance setting. Two settings handle the messy cases:

- **Merge gap** joins parts that are within a few empty pixels of each other, so detached bits stay attached to their sprite.
- **Min pixels** throws away stray specks.

Frames come out in reading order, row by row, each with its own size. The first version merged frames by growing bounding boxes, which snowballed on tightly packed sheets until one frame swallowed half of Mario. The detector now works pixel by pixel, so a frame can never absorb its neighbour.

For sheets that *are* on a grid, **grid slicing** takes a cell size, offset, spacing and row/column count, and can skip empty cells or trim each one down to its contents.

Detection is only the starting point. You can select, box-select, drag, resize and draw frames by hand, nudge them with the arrow keys, rename them, and undo all of it.

## Building animations

Pick frames and press A, or double-click them, to add them to the current animation. Thumbnails can be dragged into a different order, and each frame can have its own duration. On top of that you get a default frame rate, loop, ping-pong or play-once, and a horizontal flip, which is handy when a sheet only has right-facing frames.

The preview scales with nearest-neighbour sampling, so the pixels stay sharp, and it has play, pause, step and onion skinning. It also has an anchor setting, bottom-centre by default. That matters more than it sounds: when frames are different sizes, centring each one makes the character visibly jitter, while anchoring at the feet keeps them planted.

## Getting it out

- **Packed atlas PNG.** Trimmed frames packed into one image with padding, optionally at a power-of-two size, with the background colour made transparent.
- **TexturePacker JSON (hash).** The format Phaser, PixiJS and most 2D engines already read, with an `animations` map included.
- **Site format.** The JSON shape the games on this site use.
- **Strip PNG.** One animation laid out as a horizontal strip.

It also imports TexturePacker and Aseprite JSON as well as its own exports, so you can come back and keep editing. Your current project autosaves in the browser.

Try it with the built-in examples. The SMB3 sheets load with their frames already detected and a walk cycle playing. The [Sprite Dash](/spritetest) runner was built from frames measured exactly this way.
