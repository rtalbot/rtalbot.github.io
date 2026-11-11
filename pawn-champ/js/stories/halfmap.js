// Pawn Champ - Half a Treasure Map. Minor quest m27, batch H (docs/quests/MINOR.md#m27-half-a-treasure-map).
// Two strangers, on two days, each pawn half of the same map: a rum-runner's chart of the sandbar,
// torn down the middle in 1929. Each wants the other half. Put them together on the sandbar at
// slack tide and split what's under the old range marker, sell one half to the other, or go and dig
// before either of them gets there.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/halfmap.js.
defineStory({
  "id": "halfmap",
  "kind": "minor",
  "title": "Half a Treasure Map",
  "location": "sandbar",
  "rumour": "Two people from away are asking about the same rum-runner. Neither knows about the other.",
  "endings": { "split": "Three Ways", "sold": "Half a Map", "early": "Low Tide, Early" },
  "outcome": "flag.hmEnd",
  "about": [
    "Two people from away, each with half of the same rum-runner's chart, neither knowing about the other. Rollo Thorley pawns the west half, from his great-uncle Joe Tobin of the schooner Merry Widow (§{ozzieMap}). The next week Marnie Cray, who writes about Prohibition, brings in the east half and spots Rollo's on your shelf (§{marnieMap}).",
    "Sell her Rollo's half for $60 (Half a Map), take both halves and send them to the sandbar together at slack tide, or buy her half and keep quiet. At the dig (§{halfmapDig}) a tarred crate holds three bottles of 1929 rye and a note: \"For the wedding.\" Split them three ways and both learn something about Uncle Joe (Three Ways), or send the two off at the wrong iron and dig it up yourself (Low Tide, Early)."
  ],
  "cast": {
    "rollo": {
      "name": "Rollo Thorley",
      "look": { "skin": "#e8c0a0", "hair": "#3a3a3a", "hs": 0, "coat": "#5a4a3a", "trim": "#c8a050", "style": "jacket", "hat": "wide", "hatc": "#3a2a1e", "pants": "#3a3a30", "moustache": "#3a3a3a" }
    },
    "marnie": {
      "name": "Marnie Cray",
      "look": { "skin": "#d8a880", "hair": "#e8d090", "hs": 3, "coat": "#3a6a8a", "trim": "#e8e4dc", "style": "puffer", "pants": "#2a2a30", "bag": "#6a4a2a", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "halfmap": [
      "............",
      ".kkkkkkk....",
      ".kppppppk...",
      ".kpPPrPpk...",
      ".kppPppPk...",
      ".kpPPpprk...",
      ".kpppPpPk...",
      ".kpPppppk...",
      ".kppPPppk...",
      ".kpppppPk...",
      ".kkkkkkk....",
      "............"
    ],
    "rye": [
      "....kk......",
      "....kk......",
      "....kk......",
      "...kWWk.....",
      "..kWWWWk....",
      "..kWppWk....",
      "..kWpPWk....",
      "..kWppWk....",
      "..kWWWWk....",
      "..kWWWWk....",
      "...kkkk.....",
      "............"
    ]
  },
  "uniques": {
    "mapWest": {
      "name": "Half a chart (west)",
      "icon": "halfmap",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Torn in 1929",
      "questKey": true,
      "tells": [
        "The west half of a hand-drawn chart of the sandbar. The breakwater, soundings, and a line of X's that stops at the tear.",
        "Signed along the edge: \"J. Tobin, sch. Merry Widow.\" A rum-runner, out of Hollow Neck."
      ]
    },
    "mapEast": {
      "name": "Half a chart (east)",
      "icon": "halfmap",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Torn in 1929",
      "questKey": true,
      "tells": [
        "The east half: the duck blind, the old range marker, and the rest of the X's, ending in a circle.",
        "Written in the circle: \"6 ft. N of the iron. At slack water. Not before.\""
      ]
    },
    "tobinRye": {
      "name": "A bottle of 1929 rye",
      "icon": "rye",
      "cat": "curio",
      "guide": 90,
      "condLabel": "Still sealed",
      "tells": [
        "Canadian rye, smuggled in on a schooner in 1929 and buried in a crate on the sandbar. The cork is sealed with red wax.",
        "Hand-written on the label: \"For the wedding. J.T.\" Nobody knows whose wedding."
      ]
    }
  },
  "scenes": {
    "ozzieMap": {
      "title": "Rollo Thorley pawns half a rum-runner's chart",
      "customer": "rollo",
      "steps": [
        {
          "say": "rollo",
          "text": [
            "Name's Rollo Thorley. I'm from away. Connecticut, but further away than that, in my heart.",
            "My great-uncle Joe Tobin ran rum into this harbor in a schooner called the Merry Widow. This is half his chart. Twenty-five on it, while I look for the other half."
          ]
        },
        { "offer": { "unique": "mapWest" }, "persona": "proud", "asking": 25, "min": 18 },
        { "say": "rollo", "text": "If a woman comes in with the other half, she's a liar. Unless she sells it to me, in which case she's family.", "if": "offer == 'deal'" },
        { "leave": "rollo" }
      ]
    },
    "marnieMap": {
      "title": "Marnie Cray has the other half",
      "customer": "marnie",
      "steps": [
        { "say": "marnie", "text": "Marnie Cray. I write about Prohibition on the coast. This came up in an estate sale in Maine: half a rum-runner's chart. Tobin, the Merry Widow." },
        { "find": "west", "in": "stock", "match": { "uniqueId": "mapWest" } },
        {
          "if": "!west",
          "then": [
            { "say": "marnie", "text": "Twenty-five on it? I'm told someone in town has the other half. If they come in, keep them talking." },
            { "offer": { "unique": "mapEast" }, "persona": "honest", "asking": 25, "min": 18 },
            { "leave": "marnie" },
            { "end": true }
          ]
        },
        { "say": "marnie", "text": "You have the other half. I can see it from here. The tear matches. I'll pay you sixty for it, right now, and take both." },
        {
          "choose": [
            {
              "label": "Sell her Rollo's half",
              "hint": "(+$60)",
              "then": [
                { "take": "west" },
                { "coin": 60, "why": "Sold Rollo Thorley's half map" },
                { "set": { "hmEnd": "sold" } },
                { "say": "marnie", "text": "Wonderful. Whatever's there goes in my book. Your name goes in the acknowledgements. Small print." },
                { "toast": "Next day Rollo Thorley stands outside your window for an hour, not saying anything, holding a pawn ticket.", "look": "rollo" },
                { "rep": -3 }
              ]
            },
            {
              "label": "\"Pawn yours too. Both of you, the sandbar, at slack tide.\"",
              "then": [
                { "offer": { "unique": "mapEast" }, "persona": "honest", "asking": 25, "min": 18 },
                {
                  "if": "offer == 'deal'",
                  "then": [
                    { "set": { "hmTogether": true } },
                    { "say": "marnie", "text": "Together. With HIM. Fine. Slack tide. He brings the shovel." },
                    { "toast": "Calendar: the sandbar at slack water", "look": "marnie" },
                    { "plan": "halfmap-dig" }
                  ]
                }
              ]
            },
            {
              "label": "Buy her half, and keep quiet about Rollo's",
              "then": [
                { "offer": { "unique": "mapEast" }, "persona": "honest", "asking": 25, "min": 18 },
                {
                  "if": "offer == 'deal'",
                  "then": [
                    { "set": { "hmAlone": true } },
                    { "narrate": "With both halves under the lamp, the line of X's runs straight off one and on to the other, and ends in a circle on the sandbar." },
                    { "plan": "halfmap-dig" }
                  ]
                }
              ]
            }
          ]
        },
        { "leave": "marnie" }
      ]
    },
    "halfmapDig": {
      "title": "Six feet north of the iron",
      "steps": [
        {
          "stage": "sandbar",
          "fadeOut": false,
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [140, 166] }]
        },
        { "narrate": "The sandbar at slack water. The old iron range marker sticks up out of the flats, orange with rust. Six feet north of it, the sand is just sand." },
        {
          "if": "flag.hmTogether",
          "then": [
            { "enter": { "id": "rollo", "cast": "rollo", "at": [220, 164], "facingLeft": true } },
            { "enter": { "id": "marnie", "cast": "marnie", "at": [60, 164] } },
            { "say": "rollo", "text": "Uncle Joe's chart. My shovel. My dig." },
            { "say": "marnie", "text": "My half says \"not before slack water\". Your half didn't know that. Dig." }
          ]
        },
        {
          "choose": [
            { "label": "Dig, and split whatever it is three ways", "if": "flag.hmTogether" },
            { "label": "Tell them it's the wrong iron, and come back alone at dusk", "if": "flag.hmTogether" },
            { "label": "Dig, alone", "if": "!flag.hmTogether" }
          ],
          "as": "dig"
        },
        {
          "narrate": [
            "Two feet down the shovel hits wood. A small crate, tarred, with MERRY WIDOW burned into the lid. Inside, in straw: three bottles of rye with red wax on their corks, and a note.",
            "\"For the wedding. If I don't make it back, drink to her anyway. J.T., 1929.\""
          ]
        },
        {
          "if": "flag.hmTogether && dig == 0",
          "then": [
            { "say": "rollo", "text": "Uncle Joe never married. Family story is, he went out one night and didn't come back." },
            { "say": "marnie", "text": "Then she waited. Whoever she was. I'm putting her in the book." },
            { "add": { "unique": "tobinRye" }, "if": "shelf.free" },
            { "refresh": "panel" },
            { "hook": "buyBack", "with": "A map half, bought back" },
            { "refresh": "panel" },
            { "rep": 3 },
            { "narrate": "One bottle each. They open theirs on the spot, on the sandbar, and pour a little on the sand first." },
            { "set": { "hmEnd": "split" } }
          ],
          "else": [
            { "narrate": "They go home grumbling. You come back at dusk with the shovel.", "if": "flag.hmTogether" },
            { "hook": "digRye", "sets": ["n"] },
            { "hook": "release" },
            { "refresh": "panel" },
            {
              "narrate": { "if": "n == 1", "then": "{n} bottle of rye on your shelves, and two halves of a map that lead nowhere now.", "else": "{n} bottles of rye on your shelves, and two halves of a map that lead nowhere now." }
            },
            {
              "if": "flag.hmTogether",
              "then": [
                { "rep": -4 },
                { "toast": "Rollo Thorley and Marnie Cray are writing a book together now. You're in it. You're the villain.", "look": "marnie" }
              ]
            },
            { "set": { "hmEnd": "early" } }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "1-4", "cast": "rollo", "scene": "ozzieMap" },
    { "at": "2-2", "cast": "marnie", "scene": "marnieMap" }
  ],
  "errands": [
    {
      "id": "halfmap-dig",
      "title": "Six feet north of the iron",
      "where": "the sandbar",
      "scene": "halfmapDig",
      "test": [
        { "set": { "hmTogether": true } },
        { "add": { "unique": "mapWest" } },
        { "add": { "unique": "mapEast" } }
      ]
    }
  ],
  "calendar": [
    { "id": "halfmap-dig", "errand": "halfmap-dig", "story": "halfmap", "where": "The sandbar", "title": "Six feet north of the iron" }
  ],
  "epilogue": [
    { "line": "Marnie Cray's book has a chapter called \"The Wedding on the Sandbar.\" It has a photo of Rollo Thorley holding a bottle, crying a bit.", "if": "flag.hmEnd == 'split'" }
  ]
});
