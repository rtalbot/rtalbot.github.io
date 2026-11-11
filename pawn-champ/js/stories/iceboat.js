// Pawn Champ - The Iceboat. Minor quest m74, batch N (docs/quests/MINOR.md#m74-the-iceboat).
// Britta Solberg is pawning her father's 1930s iceboat a piece at a time. Nils Solberg won the Hob
// Pond Cup six times. The marsh ice is rotten with salt this year, but Tess says Hob's Pond is black
// ice, four inches, and good for three days. Rebuild it for one last race, race it yourself, or sell
// the parts. January and February, in a stay. Race day is `icepondRace` (js/places/icepond.js).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/iceboat.js.
defineStory({
  "id": "iceboat",
  "kind": "minor",
  "title": "The Iceboat",
  "location": "icepond",
  "months": [4, 5],
  "rumour": "Nils Solberg's daughter is pawning his old iceboat, a piece at a time.",
  "endings": { "raced": "One Last Race", "helm": "Your Hand on the Tiller", "parts": "Sold for Parts" },
  "outcome": "flag.iceboatEnd",
  "about": [
    "A winter story. Britta Solberg is emptying her father Nils's barn before he goes into assisted living and pawns the runner plank of his old iceboat, number seven, six-time winner of the Hob Pond Cup (seven, he says) (§{iceboatPlank}). She brings the mast and red sail next, and mentions that Tess says Hob's Pond is black ice this week: race weather (§{iceboatSail}).",
    "Put the boat back together for Nils, race it yourself, or sell both pieces to a restorer in Maine (Sold for Parts). On race day (§{iceboatRace}), with both pieces in stock, Nils at eighty-seven sails one last time and comes second (One Last Race), or you race with him shouting from the bank and come third (Your Hand on the Tiller). Arrive with half a boat and it's Sold for Parts."
  ],
  "cast": {
    "britta": {
      "name": "Britta Solberg",
      "look": { "skin": "#f0d0b8", "hair": "#e8d090", "hs": 3, "coat": "#2a4a6a", "trim": "#e8e4dc", "style": "puffer", "pants": "#3a3a40", "hat": "beanie", "hatc": "#c83a2a" }
    },
    "nils": {
      "name": "Nils Solberg",
      "look": { "skin": "#f0d0b8", "hair": "#f0f0f4", "hs": 0, "coat": "#c83a2a", "trim": "#2a2a2a", "style": "jacket", "pants": "#2a2a3a", "hat": "cap", "hatc": "#2a4a6a", "beard": "#f0f0f4" }
    }
  },
  "icons": {
    "runnerPlank": [
      "............",
      "............",
      "............",
      "kkkkkkkkkkkk",
      "kWWWWWWWWWWk",
      "kwwwwwwwwwwk",
      "kkkkkkkkkkkk",
      ".ks......sk.",
      ".kss....ssk.",
      "............",
      "............",
      "............"
    ],
    "redSail": [
      ".....k......",
      ".....kk.....",
      ".....kRk....",
      ".....kRRk...",
      ".....kRrRk..",
      ".....kRRRRk.",
      ".....kRrRRRk",
      ".....kRRRRRk",
      ".....kkkkkkk",
      ".....k......",
      "....kWk.....",
      "....kkk....."
    ]
  },
  "uniques": {
    "runnerPlank": {
      "name": "An iceboat runner plank",
      "icon": "runnerPlank",
      "cat": "curio",
      "guide": 70,
      "condLabel": "Runners rusted, wood sound",
      "questKey": true,
      "tells": [
        "Eight feet of laminated spruce with a steel runner bolted under each end.",
        "Burned into the middle: SOLBERG 7. HOB POND CUP 1958 1961 1964 1969 1972 1977."
      ]
    },
    "redSail": {
      "name": "An iceboat mast and red sail",
      "icon": "redSail",
      "cat": "curio",
      "guide": 90,
      "condLabel": "Patched twice",
      "questKey": true,
      "tells": [
        "A spruce mast in two pieces and a red cotton sail with a 7 on it, patched twice, folded into a tight square."
      ]
    }
  },
  "spots": {
    "icepondRace": [
      {
        "id": "table",
        "rect": { "x": 280, "y": 302, "w": 72, "h": 22 },
        "lines": [
          "The trophy table. The Hob Pond Cup is a silver bowl dented in six places, all by Solbergs."
        ]
      },
      {
        "id": "start",
        "rect": { "x": 140, "y": 284, "w": 122, "h": 16 },
        "lines": [
          "START, sprayed on the ice in red marker paint. It'll be there till the thaw, and then in the pond for ever."
        ],
        "where": "Hob's Pond",
        "find": { "on": 1, "coin": 3, "line": "Three dollars under a cone at the start line: the entry fee somebody forgot to pay. Now you've forgotten too." }
      }
    ]
  },
  "scenes": {
    "iceboatPlank": {
      "title": "Britta Solberg pawns the runner plank off her father's iceboat",
      "customer": "britta",
      "steps": [
        {
          "say": "britta",
          "text": [
            "Britta Solberg. This is the runner plank off my father's iceboat. It's been in the barn since 1980. He won the Hob Pond Cup six times on it. Seven, he says.",
            "He's going into assisted living next month and I have to empty the barn. Sixty? I'll bring the rest."
          ]
        },
        { "offer": { "unique": "runnerPlank" }, "persona": "honest", "asking": 60, "min": 40 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "britta", "text": "OK. It can go on the woodpile. He'll never know. He knows everything." },
            { "set": { "iceboatEnd": "parts" } },
            { "leave": "britta" },
            { "end": true }
          ]
        },
        { "set": { "iceboatIn": true } },
        { "leave": "britta" }
      ]
    },
    "iceboatSail": {
      "title": "Britta brings the mast and sail, and race day is this week",
      "customer": "britta",
      "steps": [
        {
          "say": "britta",
          "text": [
            "The mast and the sail. That's all of it, apart from the backbone, which is in the barn, and Dad, who is in the kitchen telling the radio how to steer.",
            "I saw Tess Bascombe at the gas station. She said the marsh ice is rotten with salt this year but Hob's Pond is black ice, four inches. Good for three days. Race day is this week.",
            "I don't know why I'm telling you that. Seventy for these?"
          ]
        },
        { "offer": { "unique": "redSail" }, "persona": "honest", "asking": 70, "min": 50 },
        {
          "if": "offer != 'deal'",
          "then": [{ "say": "britta", "text": "Fine. Fine." }, { "leave": "britta" }, { "end": true }]
        },
        {
          "choose": [
            {
              "label": "\"Let's put it back together. For Nils.\"",
              "hint": "(race day on Hob's Pond, at lunch)",
              "then": [
                { "set": { "iceboatRace": true, "iceboatHelm": false } },
                { "plan": "iceboat-race" },
                { "say": "britta", "text": "He'll be impossible. He'll be impossible for a week. Thank you." }
              ]
            },
            {
              "label": "\"I'll race it myself.\"",
              "hint": "(race day, at lunch)",
              "then": [
                { "set": { "iceboatRace": true, "iceboatHelm": true } },
                { "plan": "iceboat-race" },
                { "say": "britta", "text": "You? Have you ever... no. Good. Dad will love teaching you. He'll love it so much." }
              ]
            },
            {
              "label": "Sell both pieces to a man restoring one in Maine",
              "hint": "(+$210; the story ends here)",
              "then": [
                { "find": "plank", "in": "stock", "match": { "uniqueId": "runnerPlank" } },
                { "take": "plank" },
                { "find": "sail", "in": "stock", "match": { "uniqueId": "redSail" } },
                { "take": "sail" },
                { "coin": 210, "why": "Sold the Solberg iceboat for parts" },
                { "rep": -2 },
                { "set": { "iceboatEnd": "parts" } },
                { "say": "britta", "text": "Maine. That's... fine. It'll sail somewhere. Just not here." }
              ]
            }
          ]
        },
        { "leave": "britta" }
      ]
    },
    "iceboatRace": {
      "title": "Race day on Hob's Pond",
      "steps": [
        { "find": "plank", "in": "stock", "match": { "uniqueId": "runnerPlank" } },
        { "find": "sail", "in": "stock", "match": { "uniqueId": "redSail" } },
        {
          "if": "plank && sail",
          "then": [{ "hook": "pond", "with": { "boat": true } }],
          "else": [{ "hook": "pond", "with": { "boat": false } }]
        },
        {
          "stage": "icepondRace",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [80, 168] },
            { "id": "britta", "cast": "britta", "at": [130, 168] },
            { "id": "nils", "cast": "nils", "at": [300, 168], "facingLeft": true },
            { "id": "tess", "cast": "tess", "at": [160, 168], "if": "hook.tessHere" }
          ]
        },
        { "narrate": "Race day on Hob's Pond. Six iceboats on the line, a course of orange flags round the pond, and a wind out of the northwest that makes your teeth ache." },
        { "say": "tess", "text": "Four inches, black, all the way across. I drilled it myself this morning. I'll be on the bank with a rope, which is what I always say.", "if": "tess" },
        {
          "if": "!(plank && sail)",
          "then": [
            { "say": "nils", "text": "Half a boat? You can't race half a boat. You can't even sink half a boat properly." },
            { "set": { "iceboatEnd": "parts" } },
            { "end": true }
          ]
        },
        { "say": "nils", "text": "Number seven. Look at her. They stopped making them right in 1960." },
        {
          "if": "!flag.iceboatHelm",
          "then": [
            { "take": "plank" },
            { "take": "sail" },
            { "rep": 4, "why": "Rebuilt the Solberg iceboat for one last race" },
            { "set": { "iceboatEnd": "raced" } },
            {
              "narrate": [
                "Nils Solberg is eighty-seven and needs two people to get him into the cockpit. Once he's in, he doesn't need anyone. The red sail fills, the runners sing, and number seven crosses the pond in about the time it takes to say so.",
                "He comes second. He says the winner jumped the start. The winner, who is his grandson-in-law, agrees."
              ]
            },
            { "say": "britta", "text": "That's the happiest I've seen him in ten years. The boat stays in the family. You'll get your money back. In instalments. In fish." }
          ],
          "else": [
            { "take": "plank" },
            { "take": "sail" },
            { "rep": 2, "why": "Raced the Solberg iceboat on Hob's Pond" },
            { "set": { "iceboatEnd": "helm" } },
            { "say": "nils", "text": "Sheet in, sheet in! Lean out! Not that far! Do you want to live?" },
            {
              "narrate": [
                "You don't steer it so much as hold on while it decides things. The red sail cracks full, the ice goes by in a black blur, and you round the last flag on one runner with Nils shouting from the bank.",
                "You finish third, which Nils says is a disgrace, and buys you a hot chocolate to say so. Britta takes the boat home in the back of the truck."
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "iceboat", "from": "1-2", "to": "2-2", "cast": "britta", "scene": "iceboatPlank" },
    { "drift": "iceboat", "from": "1-2", "to": "2-2", "offset": 3, "cast": "britta", "scene": "iceboatSail", "if": "flag.iceboatIn && !flag.iceboatEnd && hook.plankHere" }
  ],
  "errands": [
    {
      "id": "iceboat-race",
      "title": "Race day on Hob's Pond",
      "where": "Hob's Pond",
      "scene": "iceboatRace",
      "test": [
        { "add": { "unique": "runnerPlank" } },
        { "add": { "unique": "redSail" } },
        { "set": { "iceboatRace": true } },
        { "roll": { "iceboatHelm": [true, false] } }
      ]
    }
  ],
  "calendar": [
    { "id": "iceboat-race", "errand": "iceboat-race", "story": "iceboat", "where": "Hob's Pond", "title": "Race day", "known": "flag.iceboatRace" }
  ],
  "epilogue": [
    { "line": "Nils Solberg sailed number seven one last time on Hob's Pond and came second. He maintains it was a win.", "if": "flag.iceboatEnd == 'raced'" },
    { "line": "You raced the Solberg iceboat on Hob's Pond and came third. Nils Solberg still calls it a disgrace, fondly.", "if": "flag.iceboatEnd == 'helm'" },
    { "line": "The Solberg iceboat went to Maine in pieces. The Hob Pond Cup went to someone else.", "if": "flag.iceboatEnd == 'parts'" }
  ],
  "talk": {
    "by": "tess",
    "rumour": [
      "Marsh ice is rotten with salt this year. Don't go out on it. But Hob's Pond is black ice, four inches, good for three days. Race weather.",
      "And Nils Solberg's girl is selling his old iceboat a piece at a time. Number seven. He won the cup on it six times. Seven, he says."
    ],
    "react": { "raced": "Nils Solberg sailed number seven one last time. Came second. I was on the bank with a rope, which I always say. Didn't need it. Never have.", "helm": "You raced the Solberg boat. Third. Nils says it was a disgrace. He says it like it's the nicest thing he's said all year.", "parts": "The Solberg boat went to Maine in pieces. There's a gap on the start line now, where number seven used to sit." }
  }
});
