---
layout: post
title: "PDF Collator: putting paperwork in order"
description: A browser tool that merges a pile of PDFs into one file, sorted the way the paperwork needs to be read, without uploading anything.
date: 2026-10-18 11:00:00 -0700
tags: [tools, pdf, javascript]
project_link: /pdfcollator
project_name: the PDF Collator
---

Some jobs come down to assembling a packet: a handful of separate PDFs that have to be merged into one file in a particular order before they're sent anywhere. Doing that by hand in a PDF editor is slow and easy to get wrong, and most online merge tools want you to upload documents you'd rather keep on your own machine.

The [PDF Collator](/pdfcollator) does it in the browser. Nothing is uploaded. The files are read, sorted and written out entirely on your device.

<!--more-->

## Sorting strategies

Drop in your PDFs and the pages are sorted straight away using one of five strategies:

- **Final Billing** (the default) orders a billing packet as invoice, ledger, 1500 claim form, consent, then SOAP notes. Each page is classified by the text on it, and pages of the same type are kept in date order.
- **Date-based** puts every page in chronological order, using dates found in the page text.
- **Filename** sorts alphabetically by source file.
- **Interleaved** takes one page from each file in turn.
- **Manual** leaves everything where you put it.

Date detection handles the formats real documents use, such as `03/05/2024`, `2024-03-05`, `March 5, 2024` and `Mar. 5, 2024`. It rejects impossible dates like February 31st instead of quietly rolling them into March.

## Tidying pages

After sorting you can fix up individual pages before saving:

- Rotate or remove any page, with undo and a "restore removed" button.
- Select pages by checkbox, by Shift-click, or by typing a list like `1-3, 7`, then rotate, remove or move them all at once.
- Drag pages to reorder them (press and hold on a phone), or use the keyboard: Alt+arrows move a page, R rotates, Delete removes.
- Open a large preview and step through pages with the arrow keys.

Each page has a colour stripe showing which file it came from, along with its original page number, so you can always trace a page back to its source.

## How it's built

It's plain JavaScript on top of three libraries: [pdf.js](https://mozilla.github.io/pdf.js/) reads the text and draws thumbnails, [pdf-lib](https://pdf-lib.js.org/) builds the merged file, and SortableJS handles drag and drop.

One bug from this round is worth sharing. pdf.js transfers the file's bytes to its background worker, which leaves the original copy unusable. Because pdf-lib was later handed that same copy, saving failed every time. The fix was simply to give pdf.js its own copy of the bytes. The lesson is that two libraries sharing an `ArrayBuffer` are not as independent as they look.

Password-protected, encrypted and damaged PDFs are now caught when you add them, with a message saying which file was skipped and why, instead of failing at the very end.
