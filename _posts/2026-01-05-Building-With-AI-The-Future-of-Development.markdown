---
layout: post
title: "Building With AI: Reviving a Website and Creating Interactive Tools"
tags: ai, copilot, development, anova, statistics, web-development
date: 2026-01-05
---

After five years of dormancy, this site is back—and it's different. Not just in design, but in how it was built. This resurrection story is as much about the future of development as it is about statistical calculators and Jekyll themes.

<!--more-->

## The Five-Year Gap

I last touched this site in 2021. One post. A simple "Hello World." Then life happened, priorities shifted, and the site sat frozen in time. Coming back to it felt like opening a time capsule—familiar yet distant.

But something had changed in those five years. Not the site, but the tools available to build it.

## Enter Agentic AI

I didn't rebuild this site alone. I had help from GitHub Copilot—not just autocomplete suggestions, but an actual AI agent that could reason, plan, and execute complex tasks.

Here's what that looked like:

### The ANOVA Calculator

I had a stub page for an ANOVA (Analysis of Variance) calculator. Just a blank page with a promise. I told Copilot: "Build me a fully functional ANOVA calculator with visualizations and explanations."

What happened next was remarkable:

1. **Planning**: The AI broke down the task—data entry, calculations, visualization, educational content
2. **Implementation**: It wrote the statistical algorithms, built the UI, added Chart.js visualizations
3. **Refinement**: When I asked for improvements (sample datasets, theme integration, larger text), it understood context and made coherent changes

The entire calculator—hundreds of lines of JavaScript, CSS, and HTML—came together in hours, not days.

### What Made This Different

This wasn't just fancy autocomplete. The AI:

- **Understood intent**: "Make colors theme-aware" → it traced through CSS variables, updated all hardcoded colors, and ensured consistency
- **Fixed its mistakes**: When the box plot visualization didn't work, it recognized the issue and replaced it with a proper implementation
- **Maintained context**: Changes to one component correctly propagated to related parts
- **Explained decisions**: It could articulate why certain approaches were better

This is what "agentic AI" means—tools that don't just generate code, but understand projects holistically.

## The Human Part

But I wasn't passive. My role was:

**Vision**: I decided what to build and why
**Judgment**: I reviewed code, caught issues (like "the text is white on white!")
**Iteration**: I pushed for better UX, clearer explanations, more relatable examples
**Integration**: I ensured everything fit together as a cohesive experience

The AI was incredibly productive, but I was the architect. It handled the how; I owned the what and why.

## What This Means for Development

Working this way felt like having a senior developer pair programming with me—one who never gets tired, never gets frustrated, and can instantly recall syntax across any language or framework.

Some observations:

### Speed
What would have taken me days took hours. Not because the AI is faster at typing, but because it eliminates context switching and decision fatigue.

### Quality
The code is clean, consistent, and follows best practices. The AI doesn't take shortcuts or write messy code because it's tired.

### Learning
I learned while building. Seeing how the AI structured solutions taught me new patterns and approaches.

### Focus
I could focus on user experience and design decisions instead of fighting with CSS specifics or debugging edge cases.

## The Calculator Itself

The ANOVA calculator turned out great:

- **Interactive data entry** with real-time statistics
- **Relatable sample datasets** (coffee brewing methods, plant growth, exercise programs)
- **Dynamic theme system** that responds to color preferences
- **Educational explanations** that show both theory and actual calculations
- **Clear visualizations** comparing group means

Try it at [/anova](/anova) and load one of the sample datasets. 

## What's Next

This is just the beginning. I'm planning:

**More interactive tools**: Correlation matrices, regression visualizers, probability calculators
**Deep dives**: Technical posts about interesting problems and solutions
**Experiments**: Testing new frameworks, techniques, and ideas
**Real projects**: Building things that solve actual problems

The constraint before was time and energy. With AI assistance, that constraint is dramatically reduced. The bottleneck now is ideas and motivation, not implementation capacity.

## The Broader Shift

We're at an inflection point. Development is changing from "writing code" to "directing systems." The skill isn't typing faster or memorizing APIs—it's:

- Articulating clear requirements
- Evaluating solutions critically
- Understanding tradeoffs
- Maintaining coherent vision

It's closer to architecture than construction.

## A Note on Tools

I'm using GitHub Copilot with Claude Sonnet 4.5 as the underlying model. The agent can:

- Read and edit files across the project
- Run terminal commands
- Search codebases semantically
- Apply changes in parallel
- Maintain context across long sessions

It feels less like a code assistant and more like a development partner.

## Closing Thoughts

Five years ago, I wrote "Hello World" and stopped. Today, I'm back with a functional statistical calculator, a modern theme system, and a completely refreshed site—all built in a matter of hours with AI assistance.

This isn't about AI replacing developers. It's about amplifying what we can do. I'm still making the decisions, solving the problems, and ensuring quality. But I'm doing it faster, with less frustration, and with more time to focus on what matters—building things that are useful and interesting.

Expect more posts. More projects. More experiments. The tools have caught up with the ideas, and there's a lot to build.

---

**Technical Details:**
- Built with Jekyll, hosted on GitHub Pages
- ANOVA calculator uses vanilla JavaScript and Chart.js
- Dynamic theming via CSS custom properties
- Developed with GitHub Copilot (Claude Sonnet 4.5)
- [View source on GitHub](https://github.com/rtalbot/rtalbot.github.io)

**Up Next:** I'm thinking about building a correlation matrix visualizer or an interactive guide to probability distributions. What would you find most useful?
