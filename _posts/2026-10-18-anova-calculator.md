---
layout: post
title: "An ANOVA calculator that shows its work"
description: A one-way ANOVA calculator that walks through every step, with Tukey post-hoc tests and a chart of your actual data.
date: 2026-10-18 11:30:00 -0700
tags: [statistics, tools, javascript]
project_link: /anova
project_name: the ANOVA calculator
---

The ANOVA page has been on this site since 2014. It's a one-way analysis of variance calculator, built for when you have three or more groups and want to know whether their means really differ, or whether the gaps are just noise.

Most calculators give you an F statistic and a p-value and stop there. This one shows the arithmetic: the sums of squares, the degrees of freedom, the mean squares and how they combine into F, using your numbers. It's as much for understanding ANOVA as for running one.

<!--more-->

## What it does

- **Enter data** by typing values into each group, or **paste straight from a spreadsheet**. That works with one column per group (an optional first row becomes the group names) or with two columns of group and value. You can have up to ten groups and rename any of them.
- **The ANOVA table** shows the sums of squares, degrees of freedom, mean squares, F and the p-value, plus a ready-to-copy line such as *F(2, 27) = 4.85, p = 0.0159, η² = 0.264*.
- **Effect size.** η² (eta squared) says how much of the variation the groups explain, and ω² (omega squared) is a less biased version of the same idea. A significant p-value with a tiny effect size is worth knowing about.
- **Group summary** gives n, mean, standard deviation, a 95% confidence interval, and the min, median and max for each group.
- **Tukey HSD.** A significant F only tells you that *some* means differ. The Tukey test compares every pair while keeping the overall false-positive rate at 5%, and it uses the Tukey–Kramer version when the groups are different sizes.
- **Chart.** Every value is plotted as a dot, with each group's mean and 95% confidence interval drawn over it, so you see the spread as well as the averages.

## Checking it against the textbook

A statistics tool is only useful if it's right. The calculator includes R's classic **PlantGrowth** dataset as a sample: plant weights under a control and two treatments. Load it and you should see F(2, 27) = 4.846 and p = 0.0159, with Tukey finding that only treatment 2 vs treatment 1 is significant (adjusted p = 0.012). Those numbers match R and SciPy to more than six significant figures.

The core ANOVA arithmetic from 2014 was already correct. The fixes in this round were around it: the medians and quartiles were wrong, the group stats showed a population variance where a sample SD belonged, and inputs like "12abc" were quietly accepted as 12. Very small p-values used to round down to zero and are now shown as "< 0.0001".
