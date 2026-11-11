// Pawn Champ - The Figure Skates. Minor quest m72, batch N (docs/quests/MINOR.md#m72-the-figure-skates).
// Maudie Fairbanks, eighty, won the state title in 1962 in these skates. She pawns them to pay for
// heating oil. Her granddaughter wants to skate in them at the winter carnival on the Green, and a
// collector wants them in a glass case. January and February, in a stay.
// The rink is batch N's props on `greenDay` (`rink`, drawn in the code half).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/skates.js.
defineStory({
  "id": "skates",
  "kind": "minor",
  "title": "The Figure Skates",
  "location": "green",
  "months": [4, 5],
  "rumour": "Maudie Fairbanks won the state title in 1962, and she's pawned her skates for heating oil.",
  "endings": { "oil": "Oil Delivered", "lent": "One Night Only", "sold": "In a Glass Case" },
  "outcome": "flag.skatesEnd",
  "about": [
    "A winter story. Maudie Fairbanks, eighty, who skates on the Green every morning at seven, pawns the skates she won the 1962 state title in because the oil man won't fill her tank on account (§{skatesMaudie}). Her granddaughter Posy comes in secretly: she has practised in those skates since she was twelve and is skating the solo at the winter carnival this week (§{skatesPosy}). A collector, Lionel Brandt, overhears and lays down his card.",
    "Pay Maudie's oil bill yourself and give the skates back (Oil Delivered), sell them to Brandt for $340 (In a Glass Case), or lend them to Posy for the carnival (§{skatesRink}). There she lands Maudie's 1962 jump and Maudie stands up off the bench; afterwards pay the oil and return the skates (Oil Delivered), or take them back to the shop as agreed (One Night Only)."
  ],
  "cast": {
    "maudie": {
      "name": "Maudie Fairbanks",
      "look": { "skin": "#f0d0b8", "hair": "#e8e8ec", "hs": 3, "coat": "#3a6a9a", "trim": "#e8e4dc", "style": "jacket", "long": true, "pants": "#2a2a3a", "hat": "beanie", "hatc": "#e86a8a" }
    },
    "posy": {
      "name": "Posy Fairbanks",
      "look": { "skin": "#f0d0b8", "hair": "#c8862a", "hs": 3, "coat": "#e86a8a", "trim": "#f4f0e4", "style": "puffer", "pants": "#2a2a3a", "hat": "beanie", "hatc": "#3a6a9a" }
    },
    "brandt": {
      "name": "Lionel Brandt",
      "look": { "skin": "#e8c8a8", "hair": "#5a5a5a", "hs": 2, "coat": "#2a2a3a", "trim": "#8a2a2a", "style": "jacket", "long": true, "pants": "#3a3a40", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "skates": [
      "............",
      "..kk....kk..",
      ".kcck..kcck.",
      ".kcck..kcck.",
      ".kcck..kcck.",
      ".kcRk..kcRk.",
      "kcccck.kccck",
      "kkkkkk.kkkkk",
      ".s..s..s..s.",
      "ssssss.sssss",
      "............",
      "............"
    ]
  },
  "uniques": {
    "skates": {
      "name": "White figure skates, 1962",
      "icon": "skates",
      "cat": "curio",
      "guide": 140,
      "condLabel": "Sharpened last week",
      "questKey": true,
      "tells": [
        "White leather boots, re-laced, the blades sharpened last week by someone who knew how.",
        "A faded ribbon is tied through the top eyelets: MASS. STATE CHAMPIONSHIP 1962, LADIES, 1ST."
      ]
    }
  },
  "spots": {
    "rink": [
      {
        "id": "sign",
        "rect": { "x": 250, "y": 214, "w": 140, "h": 18 },
        "lines": [
          "WINTER CARNIVAL. The Rotary floods the Green with a fire hose every January, and every January the bandstand gets an icicle beard."
        ]
      },
      {
        "id": "boards",
        "rect": { "x": 26, "y": 256, "w": 120, "h": 88 },
        "lines": ["The rink boards, painted white, signed in marker by every kid who ever hit them hard."],
        "where": "the rink",
        "find": { "on": 1, "coin": 2, "line": "Two dollars frozen into the slush by the boards. You chip them out with a key." }
      }
    ]
  },
  "scenes": {
    "skatesMaudie": {
      "title": "Maudie Fairbanks pawns her state-title skates for heating oil",
      "customer": "maudie",
      "steps": [
        {
          "say": "maudie",
          "text": [
            "Maudie Fairbanks. I skate on the Green every morning at seven, rain or shine, and I'm eighty. I tell everyone that. It saves time.",
            "The oil man won't fill the tank on account any more. So: these. I won the state in them. Ninety dollars and I'll have them back by March."
          ]
        },
        { "offer": { "unique": "skates" }, "persona": "honest", "asking": 90, "min": 60 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "maudie", "text": "Well. I'll wear two sweaters, then. I've done it before." },
            { "leave": "maudie" },
            { "end": true }
          ]
        },
        { "set": { "skatesIn": true } },
        { "say": "maudie", "text": "Don't let anybody try them on. Their feet will never be happy again." },
        { "leave": "maudie" }
      ]
    },
    "skatesPosy": {
      "title": "Posy wants to skate the carnival solo in her gran's skates",
      "customer": "posy",
      "steps": [
        {
          "say": "posy",
          "text": [
            "Hi. I'm Posy. Maudie's my gran. She doesn't know I'm here. Please don't tell her I'm here.",
            "The winter carnival's on the Green this week. I'm skating the solo. In Gran's skates. I've been practising in them since I was twelve. Only now they're in your shop."
          ]
        },
        { "find": "sk", "in": "stock", "match": { "uniqueId": "skates" } },
        {
          "if": "!sk",
          "then": [
            { "say": "posy", "text": "Oh. They're gone already? OK. OK. I'll skate in my own. They're fine. They're just mine." },
            { "set": { "skatesEnd": "sold" } },
            { "leave": "posy" },
            { "end": true }
          ]
        },
        { "narrate": "A man in a long coat at the jewelry case has been listening. He comes over and lays a card on the counter: LIONEL BRANDT, SPORTING MEMORABILIA." },
        { "say": "posy", "text": "...Who's that?" },
        {
          "choose": [
            {
              "label": "Pay Maudie's oil bill yourself and give the skates back",
              "hint": "(-$120)",
              "then": [
                { "take": "sk" },
                { "coin": -120, "why": "Paid Maudie Fairbanks's heating oil" },
                { "rep": 5 },
                { "set": { "skatesEnd": "oil" } },
                { "say": "posy", "text": "You're... she's going to be so cross. She's going to be so cross and so warm." }
              ]
            },
            {
              "label": "Lend them to Posy for the carnival",
              "hint": "(the rink on the Green, at lunch)",
              "then": [
                { "set": { "skatesLend": true } },
                { "plan": "skates-rink" },
                { "say": "posy", "text": "Really? I'll bring them straight back. I'll carry them on my head. Come and watch!" }
              ]
            },
            {
              "label": "Sell them to Lionel Brandt",
              "hint": "(+$340; the story ends here)",
              "then": [
                { "take": "sk" },
                { "coin": 340, "why": "Sold Maudie Fairbanks's skates to a collector" },
                { "rep": -2 },
                { "set": { "skatesEnd": "sold" } },
                { "say": "posy", "text": "Oh." }
              ]
            }
          ]
        },
        { "leave": "posy" }
      ]
    },
    "skatesRink": {
      "title": "Posy's solo at the winter carnival",
      "steps": [
        {
          "stage": "rink",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [60, 168] },
            { "id": "posy", "cast": "posy", "at": [160, 150] },
            { "id": "maudie", "cast": "maudie", "at": [250, 168], "facingLeft": true },
            { "id": "gus", "cast": "gus", "at": [280, 168], "facingLeft": true, "if": "hook.gusHere" }
          ]
        },
        { "narrate": "The rink on the Green at noon, under strings of bulbs that nobody has bothered to switch off. A loudspeaker on the bandstand plays a waltz with a scratch in it." },
        { "say": "gus", "text": "I've watched Maudie skate on this Green every morning for fifty years. She still beats me at chess afterwards. Out of spite, mainly.", "if": "gus" },
        { "say": "maudie", "text": "Those are my skates. On my granddaughter. Somebody explain this to me before I'm pleased about it." },
        { "narrate": "Posy goes out alone. She's nervous for half a lap, and then she isn't. On the last turn she does a jump that isn't on the program and lands it, and Maudie stands up off the bench." },
        { "say": "maudie", "text": "That was my jump. That was 1962. Where did she get that?" },
        { "find": "sk", "in": "stock", "match": { "uniqueId": "skates" } },
        {
          "choose": [
            {
              "label": "Give Maudie the skates back, and pay the oil",
              "hint": "(-$120)",
              "disabled": "!sk",
              "then": [
                { "take": "sk" },
                { "coin": -120, "why": "Paid Maudie Fairbanks's heating oil" },
                { "rep": 5 },
                { "set": { "skatesEnd": "oil" } },
                { "say": "maudie", "text": "I'll pay you back in March. I'll pay you back in skating lessons, if you're not careful." }
              ]
            },
            {
              "label": "Take the skates back to the shop, as agreed",
              "then": [
                { "rep": 2, "why": "Lent the Fairbanks skates for the carnival" },
                { "set": { "skatesEnd": "lent" } },
                { "say": "maudie", "text": "Fair's fair. Look after them. They've got another jump in them yet." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "skates", "from": "1-2", "to": "2-2", "cast": "maudie", "scene": "skatesMaudie" },
    { "drift": "skates", "from": "1-2", "to": "2-2", "offset": 3, "cast": "posy", "scene": "skatesPosy", "if": "flag.skatesIn && !flag.skatesEnd" }
  ],
  "errands": [
    {
      "id": "skates-rink",
      "title": "Posy's solo at the winter carnival",
      "where": "The rink on the Green",
      "scene": "skatesRink",
      "test": [{ "add": { "unique": "skates" } }, { "set": { "skatesLend": true } }]
    }
  ],
  "calendar": [
    { "id": "skates-rink", "errand": "skates-rink", "story": "skates", "where": "Harbor Green", "title": "The winter carnival", "known": "flag.skatesLend" }
  ],
  "epilogue": [
    { "line": "Maudie Fairbanks skates on the Green every morning at seven in her 1962 skates. Her tank is full. She has threatened you with lessons.", "if": "flag.skatesEnd == 'oil'" },
    { "line": "Posy Fairbanks skated the carnival solo in her gran's skates and landed the 1962 jump. The skates are back on your shelf, waiting for March.", "if": "flag.skatesEnd == 'lent'" },
    { "line": "Maudie Fairbanks's state-title skates are in a glass case in Lionel Brandt's showroom, with a card. Posy skated the carnival in her own.", "if": "flag.skatesEnd == 'sold'" }
  ],
  "talk": {
    "by": "gus",
    "rumour": [
      "Maudie Fairbanks skates on the Green every morning at seven. Eighty years old. State champion, 1962. She beats me at chess after, out of spite.",
      "Only she wasn't on the ice this morning. Somebody said the oil man's stopped filling her tank, and she's pawned her skates."
    ],
    "react": { "oil": "Maudie was on the ice at seven again this morning, in the old skates. Then she beat me in eleven moves. Thank you, I think.", "lent": "Her granddaughter landed the 1962 jump at the carnival. Maudie stood up off my bench. I've never seen her stand up for anything but a checkmate.", "sold": "Maudie's skates are in a glass case somewhere. She skates in hired ones now. She says they pinch. She means more than her feet." }
  }
});
