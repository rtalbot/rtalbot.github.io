// Pawn Champ - The Lucky Lure. Minor quest m33, batch H (docs/quests/MINOR.md#m33-the-lucky-lure).
// Remy Sauvé's wooden striper plug has taken the biggest fish in the Pier Nine derby three years
// running. He pawns it to pay his fuel bill, and every fisherman in town wants it. At the weigh-in on
// Pier Nine you find out whether the luck was in the lure, the kid, or the old man.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/lure.js.
defineStory({
  "id": "lure",
  "kind": "minor",
  "title": "The Lucky Lure",
  "location": "docks",
  "rumour": "Remy Sauvé's lure has won the striper derby three years running. He's short on fuel money this year.",
  "endings": { "owner": "Four in a Row", "kid": "Beginner's Luck", "sold": "It Was Never the Lure" },
  "outcome": "flag.lureEnd",
  "about": [
    "Remy Sauvé, short of diesel money, pawns Old Faithful, the lure that has won the striper derby three years running (§{augieLure}). The next day Grant Whitcombe offers $200 for it, and eleven-year-old Tilly Peake, who has never caught a striper, comes in just to ask if it's true you have it (§{lureSuitors}).",
    "Before the weigh-in Remy comes back without the money (§{augieBack}). Give it back on credit and he wins a fourth time (Four in a Row), lend it to Tilly on his say-so and she lands a fish longer than she is (Beginner's Luck), or keep it. If you sold it to Grant, Grant catches nothing and Remy wins off the pier with a spoon, because it was never the lure (§{lureWeighin}; It Was Never the Lure)."
  ],
  "cast": {
    "remy": {
      "name": "Remy Sauvé",
      "look": { "skin": "#e0b090", "hair": "#d8d8d8", "hs": 2, "coat": "#c8a020", "trim": "#3a3a30", "style": "jacket", "hat": "cap", "hatc": "#2a4a2a", "pants": "#3a3a30", "beard": "#d8d8d8" }
    },
    "tilly": {
      "name": "Tilly Peake",
      "look": { "skin": "#8a5a3a", "hair": "#1a1210", "hs": 3, "coat": "#e86a2a", "style": "hoodie", "pants": "#2a3a5a", "kid": true }
    },
    "sportsman": {
      "name": "Grant Whitcombe",
      "look": { "skin": "#f0d0b0", "hair": "#c8a870", "hs": 0, "coat": "#e8e4dc", "trim": "#2a4a8a", "style": "vest", "vest": "#2a4a8a", "pants": "#c8b890", "glasses": "#1a1a1e" }
    }
  },
  "icons": {
    "lure": [
      "............",
      "............",
      ".........kk.",
      "..kkkkkkkjjk",
      ".kGgGgGgjjjk",
      "kcGgGgGgjjk.",
      ".kccccccckk.",
      "..kkkkkkk...",
      "...k...k....",
      "..kSk.kSk...",
      "...k...k....",
      "............"
    ]
  },
  "uniques": {
    "luckyLure": {
      "name": "Remy's lucky lure",
      "icon": "lure",
      "cat": "curio",
      "guide": 40,
      "condLabel": "Tooth-marked",
      "wantedBy": { "name": "every fisherman on Pier Nine", "mult": 4 },
      "wantedKnown": "true",
      "tells": [
        "A hand-carved wooden plug, painted like a mackerel. The paint is mostly tooth marks now.",
        "Carved into the lip, tiny: \"A.S. 1979\". Three notches beside it, and room for a fourth."
      ]
    }
  },
  "scenes": {
    "augieLure": {
      "title": "Remy Sauvé pawns his lucky lure",
      "customer": "remy",
      "steps": [
        {
          "say": "remy",
          "text": [
            "Remy Sauvé. Forty years on the water and the diesel still costs more than the fish.",
            "Here. Old Faithful. Biggest striper in the derby three years running. Don't tell anybody you've got it, or they'll come in here with crowbars."
          ]
        },
        { "offer": { "unique": "luckyLure" }, "persona": "desperate", "asking": 40, "min": 30 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "lureIn": true } },
            { "say": "remy", "text": "I'll have it back for the weigh-in. Probably. Don't fish with it." }
          ]
        },
        { "leave": "remy" }
      ]
    },
    "lureSuitors": {
      "title": "Grant Whitcombe wants the lure, and Tilly Peake wants to see it",
      "customer": "grant",
      "steps": [
        { "find": "it", "in": "stock", "match": { "uniqueId": "luckyLure" } },
        {
          "if": "!it",
          "then": [
            { "say": "grant", "text": "Everybody says you've got Remy's lure. You don't? Huh. Never mind." },
            { "leave": "grant" },
            { "end": true }
          ]
        },
        { "say": "grant", "text": "Grant Whitcombe. I fish the derby every year. I hear Remy Sauvé pawned his plug. I'll give you two hundred for it. Cash. Today." },
        {
          "choose": [
            {
              "label": "Sell it to Grant",
              "hint": "(+$200)",
              "then": [
                { "sell": "it" },
                { "coin": 200, "why": "Sold Remy's lure to Grant Whitcombe" },
                { "set": { "lureSold": true } },
                { "say": "grant", "text": "Four in a row, and it's my name on the board." }
              ]
            },
            { "label": "\"It's Remy's. He's coming back for it.\"" }
          ]
        },
        { "leave": "grant" },
        { "hook": "arrive", "with": "tilly", "sets": ["tilly"] },
        {
          "say": "tilly",
          "text": [
            "Is it true you've got Mr. Sauvé's lucky lure? I've never caught a striper. Not one. I've been fishing off Pier Nine since I was six. I'm eleven.",
            "I'm not asking to buy it. I've got four dollars. I'm just asking if it's true."
          ]
        },
        { "set": { "lureTilly": true } },
        { "leave": "tilly" }
      ]
    },
    "augieBack": {
      "title": "Remy comes back before the weigh-in",
      "customer": "remy",
      "steps": [
        { "say": "remy", "text": "Weigh-in's this week. I haven't got the money. Haven't got the fuel, either." },
        {
          "if": "flag.lureSold",
          "then": [
            {
              "say": "remy",
              "text": [
                "Sold. To the Whitcombe boy. Well. It's yours to sell, I suppose.",
                "I'll fish anyway. Off the end of the pier, like when I was a kid. Come and watch."
              ]
            },
            { "plan": "lure-weighin" },
            { "leave": "remy" },
            { "end": true }
          ]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "luckyLure" } },
        {
          "choose": [
            {
              "label": "Give it back on credit",
              "hint": "(he pays when he can)",
              "then": [
                { "take": "it" },
                { "set": { "lureAugie": true } },
                { "say": "remy", "text": "You're a soft touch. Odile was a soft touch. I'll bring you the head." }
              ]
            },
            {
              "label": "Lend it to Tilly Peake for the derby",
              "hint": "(Remy's idea, once you tell him)",
              "if": "flag.lureTilly",
              "then": [
                { "take": "it" },
                { "set": { "lureKid": true } },
                { "say": "remy", "text": "The Peake girl? Who fishes off the pier every morning with a hand line? ...Yes. Give it to her. I've had three." }
              ]
            },
            {
              "label": "Keep it until he pays",
              "then": [
                { "say": "remy", "text": "Fair. Business is business. I'll fish with a spoon and a prayer." }
              ]
            }
          ]
        },
        { "plan": "lure-weighin" },
        { "leave": "remy" }
      ]
    },
    "lureWeighin": {
      "title": "The striper derby weigh-in",
      "steps": [
        {
          "stage": "docksDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] },
            { "id": "remy", "cast": "remy", "at": [240, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Pier Nine at noon, the derby weigh-in. A scale hung from a gantry, a chalkboard, and a crowd of people in waders all pretending not to care." },
        { "enter": { "id": "dory", "cast": "dory", "at": [300, 162], "facingLeft": true } },
        { "say": "dory", "text": "Biggest fish wins. Weighed on my scale. If anyone argues with my scale, they can argue with my freezer." },
        {
          "if": "flag.lureSold",
          "then": [
            { "enter": { "id": "grant", "cast": "sportsman", "at": [180, 164] } },
            { "say": "grant", "text": "Nothing. Three days with the luckiest lure on the coast and I caught a shopping trolley." },
            { "narrate": "Then Remy walks up the pier with a striper over his shoulder the size of a schoolboy. He caught it on a spoon off the end of the pier, he says, at dawn, with a borrowed rod." },
            { "say": "remy", "text": "It was never the lure, son. It was knowing where they sit." },
            { "set": { "lureEnd": "sold" } }
          ],
          "else": [
            {
              "if": "flag.lureKid",
              "then": [
                { "enter": { "id": "tilly", "cast": "tilly", "at": [180, 168] } },
                { "narrate": "Tilly Peake comes up the pier dragging a striper with both hands. It is longer than she is tall. The crowd parts for it." },
                { "say": "tilly", "text": "I caught it on the lure! I caught it on the... the lure was... I caught it!" },
                { "say": "remy", "text": "That's the one. She stood where I told her and didn't let go. That's all it ever was." },
                { "rep": 4, "why": "Tilly Peake won the derby" },
                { "set": { "lureEnd": "kid" } }
              ],
              "else": [
                {
                  "if": "flag.lureAugie",
                  "then": [
                    { "narrate": "Remy's striper goes on the scale and the needle swings round further than anyone's seen. Four in a row. He carves the fourth notch with a penknife, right there on the pier." },
                    { "rep": 2 },
                    { "set": { "lureEnd": "owner" } }
                  ],
                  "else": [
                    { "narrate": "Remy comes in third, on a spoon. He nods to you on the way past. The lure is on your shelf, and you have a feeling it's sulking." },
                    { "find": "it", "in": "stock", "match": { "uniqueId": "luckyLure" } },
                    {
                      "choose": [
                        {
                          "label": "Give him the lure anyway",
                          "hint": "(for next year)",
                          "then": [
                            {
                              "if": "it",
                              "then": [
                                { "take": "it" },
                                { "rep": 2 },
                                { "set": { "lureEnd": "owner" } },
                                { "say": "remy", "text": "Next year, then. Five in a row sounds better anyhow." }
                              ]
                            }
                          ]
                        },
                        { "label": "Keep it" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-3", "cast": "remy", "scene": "augieLure" },
    { "at": "2-4", "cast": "sportsman", "scene": "lureSuitors", "if": "flag.lureIn" },
    { "at": "3-3", "cast": "remy", "scene": "augieBack", "if": "flag.lureIn" }
  ],
  "errands": [
    {
      "id": "lure-weighin",
      "title": "The striper derby weigh-in",
      "where": "Pier Nine",
      "scene": "lureWeighin",
      "test": [{ "set": { "lureKid": true } }]
    }
  ],
  "calendar": [
    { "id": "lure-weighin", "errand": "lure-weighin", "story": "lure", "where": "Pier Nine", "title": "The derby weigh-in" }
  ],
  "epilogue": [
    { "line": "Tilly Peake has a striper on the wall of the bait shop with her name under it. Remy Sauvé taught her where they sit.", "if": "flag.lureEnd == 'kid'" },
    { "line": "Grant Whitcombe has a very expensive lure in a glass case in Connecticut. It has never caught anything.", "if": "flag.lureEnd == 'sold'" }
  ]
});
