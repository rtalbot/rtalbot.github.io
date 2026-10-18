---
layout: post
title: "Pixel Noise, twelve years on"
description: One of the first things I put on this site was a jQuery plugin that filled a canvas with flickering pixels. It finally got a proper update.
date: 2026-10-18 09:30:00 -0700
tags: [javascript, canvas, generative]
project_link: /flashy
project_name: Pixel Noise
---

Pixel Noise (it lives at `/flashy`, which tells you what I was thinking at the time) went up in February 2014, back when jQuery was how you did everything. It was a tiny jQuery plugin: give it a canvas and it chops it into square cells and keeps repainting random cells with random colours. Four canvases, four hard-coded settings, no controls.

<!--more-->

## What changed

The jQuery dependency went away a while ago. This time the whole thing got rebuilt around one full-screen canvas and a control panel:

- **Cell size** from 2 to 60 pixels.
- **Speed** in cells repainted per second, from frozen to a blizzard.
- **Fade**, which darkens the canvas a little every frame so old cells die out and only the newest ones glow. At high speed with small cells it starts to look like the Matrix rain.
- **Red, green and blue maximums**, which set the colour range of the noise.
- **Presets** (Static, Ember, Deep, Matrix, Crimson) that echo the original four canvases, and a **Shuffle** button for when you don't know what you want.
- **Save PNG** to grab the current frame.

Keyboard shortcuts: Space pauses, S saves, R shuffles and H hides the panel so you can just watch it.

## Bugs worth mentioning

Reading old code is humbling. The original passed its colour channels to the colour constructor in the wrong order, so "no green" actually meant "no blue". It also used random values from 0 to 256 as the alpha in an `rgba()` string, where alpha only goes from 0 to 1. Almost every cell came out fully opaque, which the browser quietly accepted for a decade. The animation also ran on a 10 ms `setInterval` instead of `requestAnimationFrame`, so it kept burning CPU in background tabs.

The new version uses `requestAnimationFrame` and repaints a fixed number of cells per second no matter the frame rate. It handles high-DPI screens and window resizes, and it starts paused if your system asks for reduced motion.

It's still pointless, and it's still one of my favourite things on here.
