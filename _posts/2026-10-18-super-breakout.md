---
layout: post
title: "Super Breakout"
description: A from-scratch Breakout clone in plain JavaScript and canvas, with five levels defined in JSON.
date: 2026-10-18 09:00:00 -0700
tags: [games, javascript, canvas]
project_link: /breakout
project_name: Breakout
---

Breakout is the game I always come back to when I want to remember how games work. A ball, a paddle, a wall of bricks: it's small enough to finish and still has real problems to solve in collision, angles and feel.

<!--more-->

## What's in it

The game runs full-screen on a single canvas with no libraries. The pieces are what you'd expect if you sketched Breakout on paper: a `Vector` for the ball's direction, `Rectangle` and `Circle` for collision, a `Paddle`, `Brick`s with hit points, a `Level` that lays out the bricks, and a `Game` that runs the loop and keeps score.

There are five levels: *Warm Up*, *The Wall*, *Checkerboard*, *Pyramid* and *Fortress*. They live in a JSON file rather than in the code. Each level is a grid of numbers, where the number is how many hits that brick takes, so adding a level means editing data, not JavaScript.

## The paddle angle

The detail that makes Breakout feel right is how the ball leaves the paddle. If it simply reflected, you'd have no control. Instead, where the ball hits the paddle sets the angle it comes off at: dead centre sends it straight up, and the edges send it out at a steep angle. That one rule turns a physics toy into a game where you're aiming.

## Sound without sound files

The blips are generated on the fly with the Web Audio API. There's a short tone at one pitch for the paddle, another for bricks, a low thud for walls and a longer tone for clearing a level. With no audio assets there's nothing to load, and it fits the retro look.

It's not finished and probably never will be. Power-ups and a level editor are always on the list.
