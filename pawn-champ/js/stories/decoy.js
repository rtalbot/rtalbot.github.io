// Pawn Champ - The Heron Decoy. Minor quest m15, batch B (docs/quests/MINOR.md#m15-the-heron-decoy).
// Old Elias Toomey carved one heron decoy, and both his grandsons sell you "the" one, on different
// days. At lunch you take both out to the duck blind where Hob's Marsh runs onto the sandbar: real
// herons land beside the real one and ignore the other. The marsh's own background is a full-moon
// night, so the scene uses the sandbar by day, which has the blind in its salt grass.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/decoy.js.
defineStory({
  "id": "decoy",
  "kind": "minor",
  "title": "The Heron Decoy",
  "location": "marsh",
  "rumour": "Old Toomey's grandsons are at war over a duck decoy. Well, a heron.",
  "endings": { "real": "The Real Toomey", "two": "Two Herons", "show": "Sold to the Show" },
  "outcome": "flag.decoyEnd",
  "about": [
    "A small authentication story. Two brothers each sell you \"the\" heron decoy carved by their grandfather Elias Toomey, a famous carver who only made one (§{bertHeron}, §{gilHeron}). One is a fake. A loupe can tell; so can real herons, at the duck blind on the sandbar at slack tide, where they ignore the fake and stand beside the real one like old friends (§{decoyBlind}).",
    "Tell the brothers which is which (The Real Toomey), or keep quiet. Celeste Fell from the Plymouth decoy show offers $260 for the heron (§{decoyBuyer}): sell her the real one (Sold to the Show), or the fake, which she'll find out about in print (Two Herons)."
  ],
  "cast": {
    "bertToomey": {
      "name": "Bert Toomey",
      "look": { "skin": "#e8c0a0", "hair": "#6a5a4a", "hs": 0, "coat": "#6a5a3a", "trim": "#3a5a3a", "style": "jacket", "hat": "cap", "hatc": "#3a5a3a", "pants": "#4a4a3a", "beard": "#6a5a4a" }
    },
    "gilToomey": {
      "name": "Wendell Toomey",
      "look": { "skin": "#e8c0a0", "hair": "#6a5a4a", "hs": 2, "coat": "#3a5a3a", "trim": "#6a5a3a", "style": "vest", "vest": "#c8a050", "pants": "#3a3a42", "glasses": "#2a2a2e" }
    },
    "decoyLady": {
      "name": "Celeste Fell",
      "look": { "skin": "#f0d8c8", "hair": "#e8e8e8", "hs": 1, "coat": "#8a6a9a", "trim": "#e8e4dc", "style": "suit", "long": true, "pants": "#3a2a3a", "bag": "#2a2a2e" }
    }
  },
  "icons": {
    "heron": [
      ".......kk...",
      "......kssk..",
      "......ksSkkk",
      ".......ksk..",
      "......ksk...",
      ".....ksk....",
      "...kksssk...",
      "..ksSsssdk..",
      ".ksSsssddk..",
      "..kkssddk...",
      "....kwwk....",
      "...kwwwwk..."
    ]
  },
  "uniques": {
    "heronReal": {
      "name": "Toomey heron decoy",
      "icon": "heron",
      "cat": "art",
      "condLabel": "Weathered",
      "guide": 260,
      "tells": [
        "One block of white cedar. The tool marks run left to right: a left-handed carver.",
        "Under the base, burned deep: E.T. 1952, and a tiny fish."
      ]
    },
    "heronFake": {
      "name": "Toomey heron decoy",
      "icon": "heron",
      "cat": "art",
      "condLabel": "Weathered",
      "guide": 15,
      "fake": true,
      "tells": [
        "Stained pine, not cedar. The grain gives it away at the neck.",
        "The E.T. under the base was done with a hobby wood-burning pen, and not long ago."
      ]
    }
  },
  "scenes": {
    "bertHeron": {
      "title": "Bert Toomey sells you his grandfather's heron",
      "customer": "bertToomey",
      "steps": [
        {
          "say": "bertToomey",
          "text": [
            "Bert Toomey. My grandfather was Elias Toomey. The decoy carver. You'll have heard of him, or you will at the show.",
            "This is his heron. The only one he ever made. My brother Wendell says he has it. My brother Wendell is a liar with a wood-burning kit."
          ]
        },
        { "hook": "heronSale", "with": "bert", "sets": ["offer"] },
        { "end": true, "if": "offer == 'watch'" },
        { "leave": "bertToomey" }
      ]
    },
    "gilHeron": {
      "title": "Wendell Toomey sells you his grandfather's heron",
      "customer": "gilToomey",
      "steps": [
        { "say": "gilToomey", "text": "Wendell Toomey. If my brother's been in with a heron, I'm sorry for your trouble. This is Grandpa's. The real one." },
        { "hook": "heronSale", "with": "gil", "sets": ["offer"] },
        { "end": true, "if": "offer == 'watch'" },
        { "hook": "herons", "sets": ["h1", "h2", "real"] },
        {
          "if": "h1",
          "then": [
            { "say": "gilToomey", "text": "Grandpa always said the real one fools real herons. They come into the blind at the end of the sandbar on the slack tide. Midday, this week." },
            { "plan": "decoy-blind" },
            { "toast": "Calendar: the duck blind, at lunch", "look": "gilToomey" }
          ]
        },
        { "leave": "gilToomey" }
      ]
    },
    "decoyBlind": {
      "title": "Herons at slack tide",
      "steps": [
        {
          "stage": "sandbar",
          "fadeOut": false,
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [60, 164] }]
        },
        { "hook": "herons", "sets": ["h1", "h2", "real"] },
        {
          "narrate": [
            { "if": "h2", "then": "The duck blind where Hob's Marsh runs out onto the sandbar, at slack tide. You stand both decoys in the shallows and get down behind the boards.", "else": "The duck blind where Hob's Marsh runs out onto the sandbar, at slack tide. You stand the decoy in the shallows and get down behind the boards." },
            "Twenty minutes of nothing. Then three great blue herons drop out of the sky, all legs, and fold themselves up on the flats."
          ]
        },
        {
          "narrate": { "if": "h2", "then": "They wade straight past one decoy and stand beside the other like old friends. One of them preens it.", "else": "They stand beside your decoy like old friends. One of them preens it." },
          "if": "real"
        },
        { "narrate": "They give your decoy one look, and stand as far from it as the sandbar allows.", "if": "!real" },
        { "hook": "inspect" },
        { "set": { "decoyKnown": true } },
        { "refresh": "panel" },
        {
          "choose": [
            {
              "label": "Tell the Toomey brothers which is which",
              "then": [
                { "set": { "decoyEnd": "real" } },
                { "hook": "buyBack", "with": "{who} Toomey bought his decoy back" },
                { "rep": 3 },
                { "narrate": "You phone them both from the car park. The one with the fake goes very quiet. The one with the real heron cries a bit, and then they argue about who gets to keep it, which is better than what they were arguing about before." }
              ]
            },
            {
              "label": "Say nothing, and keep what you have",
              "then": [
                { "set": { "decoyQuiet": true } },
                { "narrate": "You carry them back to the shop and put them on the top shelf, side by side. Only you and three herons know." }
              ]
            }
          ]
        }
      ]
    },
    "decoyBuyer": {
      "title": "Celeste Fell, from the decoy show",
      "customer": "decoyLady",
      "note": "for anyone who kept quiet, or never went",
      "steps": [
        { "say": "decoyLady", "text": "Celeste Fell, from the decoy show in Plymouth. I heard a Toomey heron was in Hollow Neck. The Toomey heron." },
        { "hook": "herons", "sets": ["h1", "h2", "real"] },
        {
          "if": "!h1",
          "then": [
            { "say": "decoyLady", "text": "Gone already? The brothers have it? Then I shall have to be nice to them. Good day." },
            { "leave": "decoyLady" },
            { "end": true }
          ]
        },
        { "say": "decoyLady", "text": "I'll pay $260. Show me." },
        {
          "choose": [
            {
              "label": {
                "if": "h1.inspected && h1.fake",
                "then": "Sell her the heron {h1.from|or:Wendell} brought in (the fake)",
                "else": { "if": "h1.inspected", "then": "Sell her the heron {h1.from|or:Wendell} brought in (the real one)", "else": "Sell her the heron {h1.from|or:Wendell} brought in" }
              },
              "hint": "(+$260)",
              "then": [
                { "sell": "h1" },
                { "coin": 260, "why": "Sold a Toomey heron to Celeste Fell" },
                {
                  "if": "h1.fake",
                  "then": [
                    { "set": { "decoyEnd": "two" } },
                    { "hook": "cheated" },
                    { "say": "decoyLady", "text": "Lovely. Simply lovely." },
                    { "toast": "A week later, the decoy show's newsletter reviews your shop. It is not a good review.", "look": "decoyLady" },
                    { "rep": -5 }
                  ],
                  "else": [
                    { "set": { "decoyEnd": "show" } },
                    { "say": "decoyLady", "text": "Left-handed tool marks. And the little fish. Oh, Elias." }
                  ]
                }
              ]
            },
            {
              "label": {
                "if": "h2.inspected && h2.fake",
                "then": "Sell her the heron {h2.from|or:Wendell} brought in (the fake)",
                "else": { "if": "h2.inspected", "then": "Sell her the heron {h2.from|or:Wendell} brought in (the real one)", "else": "Sell her the heron {h2.from|or:Wendell} brought in" }
              },
              "hint": "(+$260)",
              "if": "h2",
              "then": [
                { "sell": "h2" },
                { "coin": 260, "why": "Sold a Toomey heron to Celeste Fell" },
                {
                  "if": "h2.fake",
                  "then": [
                    { "set": { "decoyEnd": "two" } },
                    { "hook": "cheated" },
                    { "say": "decoyLady", "text": "Lovely. Simply lovely." },
                    { "toast": "A week later, the decoy show's newsletter reviews your shop. It is not a good review.", "look": "decoyLady" },
                    { "rep": -5 }
                  ],
                  "else": [
                    { "set": { "decoyEnd": "show" } },
                    { "say": "decoyLady", "text": "Left-handed tool marks. And the little fish. Oh, Elias." }
                  ]
                }
              ]
            },
            {
              "label": "\"Not for sale.\"",
              "then": [
                { "say": "decoyLady", "text": "Everything is for sale eventually. I'll be at the show." },
                { "leave": "decoyLady" },
                { "end": true }
              ]
            }
          ]
        },
        { "leave": "decoyLady" }
      ]
    }
  },
  "beats": [
    { "at": "3-1", "cast": "bertToomey", "scene": "bertHeron" },
    { "at": "3-2", "cast": "gilToomey", "scene": "gilHeron" },
    { "at": "4-2", "cast": "decoyLady", "scene": "decoyBuyer", "if": "!flag.decoyEnd && hook.anyHeron" }
  ],
  "errands": [
    {
      "id": "decoy-blind",
      "title": "Herons at slack tide",
      "where": "the duck blind on the sandbar",
      "scene": "decoyBlind",
      "test": [{ "add": { "unique": "heronReal" } }, { "add": { "unique": "heronFake" } }]
    }
  ],
  "calendar": [
    { "id": "decoy-blind", "errand": "decoy-blind", "story": "decoy", "where": "The duck blind", "title": "Herons at slack tide" }
  ],
  "mornings": [{ "hook": "knownFakes" }],
  "epilogue": [
    { "line": "The Toomey brothers come in every Saturday now, separately, to make sure you like the other one less.", "if": "flag.decoyEnd == 'real'" },
    { "line": "There are two Toomey herons in the world now. Only one of them fools herons. The other fooled a judge.", "if": "flag.decoyEnd == 'two'" }
  ]
});
