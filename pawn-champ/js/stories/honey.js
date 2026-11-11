// Pawn Champ - The Marsh Honey. Minor quest m50, batch J (docs/quests/MINOR.md).
// Heard from Bettany. Philippa Gage keeps seven hives on the bank of Hob's Marsh, and her honey makes
// the afternoon go strange. A lunch errand at the hives (marshHives): taste from the comb and the
// afternoon goes round three times with small differences, and you have to say which one was real.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/honey.js.
defineStory({
  "id": "honey",
  "kind": "minor",
  "title": "The Marsh Honey",
  "location": "marsh",
  "rumour": "A spoonful of Philippa Gage's marsh honey, and the afternoon happens twice.",
  "endings": { "real": "The Real Afternoon", "loop": "Round Again", "jar": "Just Honey" },
  "outcome": "flag.honeyEnd",
  "about": [
    "A gentle uncanny story. Bettany warns you that Philippa Gage's marsh honey once made her whole morning happen twice (§{bettanyHoney}). Philippa, who keeps seven hives on Hob's Marsh, sells you a jar and invites you out to taste it from the comb (§{philippaHoney}).",
    "At the hives (§{honeyHives}) you can decline and just sell a jar to Bettany (Just Honey). If you taste it, the noon scene plays three times with small differences (the number of hives, the bird on the post, the bell, the colour of her veil), and you must say which time round was the real one. A photo or a watch in your bag helps. Pick right and she gives you a case to sell (The Real Afternoon); pick wrong and you lose the afternoon and the rest of the day happens slightly twice (Round Again)."
  ],
  "cast": {
    "philippa": {
      "name": "Philippa Gage",
      "look": { "skin": "#c89070", "hair": "#2a1e16", "hs": 3, "coat": "#e8e0c8", "style": "jacket", "long": true, "trim": "#e8c040", "pants": "#4a5a3a", "hat": "wide", "hatc": "#e8e0c8", "band": "#3a6ab0" }
    }
  },
  "icons": {
    "honeyjar": [
      "............",
      "...kkkkkk...",
      "...kwWwWk...",
      "..kkkkkkkk..",
      "..kAAAAAAk..",
      "..kAaccaAk..",
      "..kAcaacAk..",
      "..kAaccaAk..",
      "..kAAAAAAk..",
      "..kaaaaaak..",
      "...kkkkkk...",
      "............"
    ]
  },
  "uniques": {
    "marshHoney": {
      "name": "Marsh honey",
      "icon": "honeyjar",
      "cat": "curio",
      "guide": 12,
      "condLabel": "Sealed",
      "tells": [
        "Wildflower honey from Hob's Marsh, dark as tea, with a bit of comb in it.",
        "The label, handwritten: \"Not on a working day.\""
      ]
    },
    "honeyCase": {
      "name": "A case of marsh honey",
      "icon": "honeyjar",
      "cat": "curio",
      "guide": 72,
      "condLabel": "Twelve jars",
      "tells": ["Twelve jars of Philippa Gage's marsh honey, each labelled \"Not on a working day.\""]
    }
  },
  "overheard": [
    { "line": "\"I had Gage honey on my toast and had to eat breakfast twice. Two breakfasts. I'm not complaining.\"" }
  ],
  "scenes": {
    "bettanyHoney": {
      "title": "Bettany tells how the morning happened twice",
      "customer": "bettany",
      "steps": [
        {
          "say": "bettany",
          "text": [
            "I put Philippa Gage's marsh honey in the buns one morning. Never again. The whole morning happened twice. I took the same tray out of the oven two times.",
            "The second time I burned my thumb, and the first time I didn't, so I knew which one was the real one. You've got to keep your wits about you with that honey."
          ]
        },
        { "set": { "honeyHeard": true } },
        { "leave": "bettany" }
      ]
    },
    "philippaHoney": {
      "title": "Philippa Gage sells you a jar of marsh honey",
      "customer": "philippa",
      "steps": [
        {
          "say": "philippa",
          "text": [
            "Philippa Gage. Seven hives on the bank of Hob's Marsh. Always seven: my mother's number, and her mother's.",
            "I sell to a few shops. It's good honey. It's a little bit too good, people say."
          ]
        },
        { "offer": { "unique": "marshHoney" }, "persona": "honest", "asking": 12, "min": 8 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "honeyBought": true } },
            { "plan": "honey-hives" },
            { "say": "philippa", "text": "Come out at lunch and taste it from the comb. Not on a working day, I'd usually say. But you look like you can keep your wits." },
            { "toast": "Calendar: Philippa Gage's hives, lunchtime {placed:honey-hives}", "look": "philippa", "icon": "honeyjar" }
          ]
        },
        { "leave": "philippa" }
      ]
    },
    "honeyHives": {
      "title": "Tasting from the comb: which afternoon was the real one?",
      "steps": [
        {
          "stage": "marshHives",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [124, 164] },
            { "id": "philippa", "cast": "philippa", "at": [160, 162], "facingLeft": true }
          ]
        },
        { "narrate": "Hob's Marsh at noon, the bees loud in the wildflowers. Philippa lifts the lid of the third of seven white hives. On the jetty post behind her sits a heron. Saint Brine's bell rings twelve across the water, and she pulls her blue veil down." },
        { "say": "philippa", "text": "Here. From the comb. Just a fingertip." },
        {
          "choose": [
            { "label": "Taste it" },
            {
              "label": "Politely, no",
              "hint": "(buy a jar for Bettany instead)",
              "then": [
                { "set": { "honeyEnd": "jar" } },
                { "say": "philippa", "text": "Wise. Take a jar for the baker, then. She knows how to treat it." },
                { "coin": 18, "why": "Sold a jar of marsh honey to Bettany Lowe" },
                { "end": true }
              ]
            }
          ]
        },
        { "narrate": "It tastes of clover and salt and something like the smell of a book. The light goes a little gold at the edges." },
        {
          "hook": "goRound",
          "sets": ["realAt", "r1", "r2", "r3"],
          "note": "three goes round: two with one thing different, one exactly as it was",
          "with": {
            "real": { "hives": "seven", "bird": "a heron", "bell": "twelve", "veil": "blue" },
            "odd": [{ "hives": "eight" }, { "bird": "an egret" }, { "bell": "thirteen" }, { "veil": "green" }]
          }
        },
        {
          "narrate": [
            "The first time round: Philippa lifts the lid of the third of {r1.hives} white hives. On the jetty post behind her sits {r1.bird}. Saint Brine's bell rings {r1.bell} across the water, and she pulls her {r1.veil} veil down.",
            "The second time round: Philippa lifts the lid of the third of {r2.hives} white hives. On the jetty post behind her sits {r2.bird}. Saint Brine's bell rings {r2.bell} across the water, and she pulls her {r2.veil} veil down.",
            "The third time round: Philippa lifts the lid of the third of {r3.hives} white hives. On the jetty post behind her sits {r3.bird}. Saint Brine's bell rings {r3.bell} across the water, and she pulls her {r3.veil} veil down."
          ]
        },
        {
          "if": "hook.carryingPhoto",
          "note": "items in use (docs/ITEMS_IN_USE.md): you took a picture before you tasted",
          "then": [
            { "use": "photo", "as": "camera" },
            { "set": { "honeyPhoto": true } },
            { "narrate": "You took a picture before you tasted. On the {camera.name|lower|or:camera}: seven hives, a heron on the post, a blue veil." }
          ],
          "else": [
            {
              "if": "hook.carryingTime",
              "then": [
                { "use": "time" },
                { "set": { "honeyTimed": true } },
                { "narrate": "You checked the time before you tasted. Noon. The bell should have rung twelve." }
              ]
            }
          ]
        },
        { "say": "philippa", "text": "Now. Which one are you standing in?" },
        {
          "choose": [
            { "label": "The first time round was the real one" },
            { "label": "The second time round was the real one" },
            { "label": "The third time round was the real one" }
          ],
          "as": "picked"
        },
        {
          "if": "picked == realAt",
          "then": [
            { "set": { "honeyEnd": "real" } },
            { "narrate": "The gold goes out of the light. The bees are just bees. Philippa laughs and claps you on the back, hard enough to hurt." },
            { "say": "philippa", "text": "Wits! Bettany was right about you. Take a case. Sell it to people with the afternoon off." },
            { "add": { "unique": "honeyCase" } },
            { "refresh": "panel" }
          ],
          "else": [
            { "set": { "honeyEnd": "loop" } },
            {
              "narrate": [
                "You blink, and you're behind your own counter, and it's four o'clock, and you can't remember the walk back. A customer you don't remember serving thanks you warmly on the way out.",
                "For the rest of the day, everything happens twice, the second time a little late."
              ]
            },
            { "rep": -1 }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "honey-bettany", "from": "1-3", "to": "1-5", "cast": "bettany", "scene": "bettanyHoney" },
    { "drift": "honey-philippa", "from": "2-1", "to": "2-4", "cast": "philippa", "scene": "philippaHoney", "if": "flag.honeyHeard" }
  ],
  "errands": [
    {
      "id": "honey-hives",
      "title": "Tasting from the comb",
      "where": "Hob's Marsh",
      "scene": "honeyHives",
      "test": [{ "set": { "honeyBought": true } }, { "add": { "unique": "marshHoney" } }]
    }
  ],
  "calendar": [
    {
      "id": "honey-hives",
      "errand": "honey-hives",
      "story": "honey",
      "where": "Hob's Marsh",
      "title": "Tasting from the comb",
      "known": "flag.honeyBought",
      "bring": ["photo", "time"]
    }
  ],
  "epilogue": [
    { "line": "Philippa Gage's marsh honey sells out of your window every Saturday. Nobody buys it on a Monday.", "if": "flag.honeyEnd == 'real'" },
    { "line": "Some afternoons you still catch yourself saying a thing for the second time. Philippa says it wears off. Philippa says it wears off.", "if": "flag.honeyEnd == 'loop'" },
    { "line": "Bettany Lowe bakes with Gage honey only on Sundays now, and only for the people she likes.", "if": "flag.honeyEnd == 'jar'" }
  ]
});
