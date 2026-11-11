// Pawn Champ - The Missing Queen. Minor quest m1, batch C (docs/quests/MINOR.md#m1).
// Gus plays chess for money on the Green. His white queen is a salt shaker. Lend him a proper one
// from your shelves, then back him, or bet against him, at lunch.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/queen.js.
defineStory({
  "id": "queen",
  "kind": "minor",
  "title": "The Missing Queen",
  "location": "green",
  "rumour": "That chess man on the Green took forty bucks off somebody's brother-in-law.",
  "endings": { "checkmate": "Checkmate", "hustled": "Hustled" },
  "outcome": "flag.queenEnd",
  "about": [
    "Gus Lindqvist, who hustles chess on the Green, borrows $20 against his 1961 boxwood set, whose white queen is a salt shaker since the real one went off the seawall (§{gusPawn}). A man from Connecticut wants a $100 game, and Gus asks you to bring the set and a proper queen from your shelves.",
    "At the stone table (§{queenGame}) lend him a statuette, candlestick, goblet, vase or music box to stand in as queen, or let him use the salt shaker, then back Gus, bet against him, or just watch. With a real queen he wins, splits the money, and gives you the set (Checkmate); with the salt shaker he loses to a man who was no casual player (Hustled)."
  ],
  "cast": {
    "boatShoes": {
      "name": "A man in boat shoes",
      "look": { "skin": "#f0d0b8", "hair": "#c8a060", "hs": 1, "coat": "#e8e4dc", "style": "vest", "vest": "#2a3a6a", "pants": "#c8b890", "glasses": "#1a1a1e" }
    }
  },
  "icons": {
    "chess": [
      "..k.....k...",
      ".kSk...kmk..",
      ".kSk...kmk..",
      "..k.....k...",
      ".kSk...kmk..",
      "kkkkkkkkkkkk",
      "kcncncncncnk",
      "kncncncncnck",
      "kcncncncncnk",
      "kncncncncnck",
      "kkkkkkkkkkkk",
      "............"
    ]
  },
  "uniques": {
    "gusChess": {
      "name": "Gus's chess set (no queen)",
      "icon": "chess",
      "cat": "curio",
      "guide": 30,
      "questKey": true,
      "tells": [
        "Boxwood and ebony, older than Gus. The white queen is a salt shaker.",
        "Someone has carved G.L. under the board, and the date 1961."
      ]
    }
  },
  "scenes": {
    "gusPawn": {
      "title": "Gus wants $20 against his chess set",
      "customer": "gus",
      "steps": [
        {
          "say": "gus",
          "text": [
            "Gus Lindqvist. I play chess on the Green. For money, when the weather holds.",
            "You may have heard I took forty dollars off a man's brother-in-law. It was forty-five. Rounding is for losers.",
            "I need twenty dollars until the weekend. You can hold my set. Boxwood and ebony, 1961. The white queen is a salt shaker. The real one went off the seawall in a sacrifice that, I'll admit, was theatrical."
          ]
        },
        { "view": { "counterIcon": "chess" } },
        {
          "choose": [
            { "label": "Lend him $20 and hold the set", "disabled": "coin < 20" },
            { "label": "Not today, Gus" }
          ],
          "as": "lend"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "lend == 1",
          "then": [
            { "say": "gus", "text": "Your loss. Literally, if you'd played me." },
            { "leave": "gus" },
            { "end": true }
          ]
        },
        { "set": { "queenIn": true } },
        { "coin": -20, "why": "Lent Gus Lindqvist $20 against his chess set" },
        { "add": { "unique": "gusChess" }, "as": "chess" },
        { "edit": "chess", "set": { "paid": 20 } },
        { "refresh": "panel" },
        {
          "say": "gus",
          "text": [
            "One lunchtime this week, a man from Connecticut wants a game. I'll send word. A hundred dollars. I'll need the set back for an hour.",
            "And a proper queen, if you have one. Anything that stands up straight and looks like it means it. You have shelves."
          ]
        },
        { "plan": "queen-game" },
        { "toast": "Calendar: Gus's game on the Green, at lunch", "look": "gus" },
        { "leave": "gus" }
      ]
    },
    "queenGame": {
      "title": "Gus's game on the Green",
      "steps": [
        {
          "stage": "greenDay",
          "fadeOut": false,
          "view": { "timeOfDay": 0 },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "gus", "cast": "gus", "at": [62, 158] },
            { "id": "stranger", "cast": "boatShoes", "at": [116, 158], "facingLeft": true }
          ]
        },
        { "narrate": "Harbor Green at lunch. The stone table by the memorial, a pigeon, and a man in boat shoes who says he's \"only a casual player\" twice before he sits down." },
        { "say": "gus", "text": "The set. Good. And a queen? Tell me you brought a queen." },
        {
          "find": "queens",
          "in": "forSale",
          "match": { "key": ["statuette", "candlestick", "goblet", "vase", "musicbox"] },
          "all": true,
          "note": "anything on the shelves that would stand up as a queen"
        },
        {
          "choose": [
            {
              "label": "Lend him the {queens.0.name|lower} as a queen",
              "hint": "(guide {queens.0.guide|money})",
              "if": "queens.count > 0",
              "then": [
                { "hook": "pickQueen", "with": 0, "sets": ["queen"] },
                { "take": "queen" },
                { "say": "gus", "text": "A {queen.name|lower}. She's enormous. She's magnificent. Nobody is taking her." }
              ]
            },
            {
              "label": "Lend him the {queens.1.name|lower} as a queen",
              "hint": "(guide {queens.1.guide|money})",
              "if": "queens.count > 1",
              "then": [
                { "hook": "pickQueen", "with": 1, "sets": ["queen"] },
                { "take": "queen" },
                { "say": "gus", "text": "A {queen.name|lower}. She's enormous. She's magnificent. Nobody is taking her." }
              ]
            },
            {
              "label": "Lend him the {queens.2.name|lower} as a queen",
              "hint": "(guide {queens.2.guide|money})",
              "if": "queens.count > 2",
              "then": [
                { "hook": "pickQueen", "with": 2, "sets": ["queen"] },
                { "take": "queen" },
                { "say": "gus", "text": "A {queen.name|lower}. She's enormous. She's magnificent. Nobody is taking her." }
              ]
            },
            {
              "label": "The salt shaker will have to do",
              "then": [{ "say": "gus", "text": "Salt it is. I've won with worse. Not often." }]
            }
          ]
        },
        { "say": "stranger", "text": "A hundred, then. Unless the shopkeeper wants a side bet? Twenty?" },
        {
          "choose": [
            { "label": "Back Gus ($20)" },
            { "label": "Bet on the man in boat shoes ($20)" },
            { "label": "Just watch" }
          ],
          "as": "bet"
        },
        {
          "narrate": { "if": "queen", "then": "Gus plays like a man with something to protect. Every time the stranger reaches for the queen, Gus looks at him, and he doesn't.", "else": "It goes well until move twenty, when Gus picks up his queen and salts the board by mistake. The man in boat shoes stops being a casual player very suddenly." }
        },
        { "set": { "queenEnd": "checkmate" }, "if": "queen" },
        { "set": { "queenEnd": "hustled" }, "if": "!queen" },
        { "coin": 20, "why": "Won a side bet on Gus", "if": "bet == 0 && queen" },
        { "coin": -20, "why": "Lost a side bet on Gus", "if": "bet == 0 && !queen" },
        { "coin": -20, "why": "Lost a side bet against Gus", "if": "bet == 1 && queen" },
        { "coin": 20, "why": "Won a side bet against Gus", "if": "bet == 1 && !queen" },
        { "find": "chess", "in": "stock", "match": { "uniqueId": "gusChess" } },
        {
          "if": "queen",
          "then": [
            { "say": "stranger", "text": "Checkmate. Me. I mean you. You checkmated me. I'll go." },
            { "coin": 50, "why": "Gus split his winnings with you" },
            { "say": "gus", "text": "Half the hundred, as promised. And keep the set, queen and all. I'm going out on top. The pigeon can have my table." },
            {
              "if": "chess",
              "then": [
                {
                  "edit": "chess",
                  "set": {
                    "name": "Gus's chess set",
                    "guide": 90,
                    "condLabel": "With a real queen",
                    "tells": ["Boxwood and ebony, 1961, with a queen that means it."]
                  }
                },
                { "edit": "chess", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" }
              ]
            }
          ],
          "else": [
            { "say": "stranger", "text": "Good game. Same time next year? I'll be in Maine by then." },
            { "say": "gus", "text": "He was no casual player. Keep the set. I can't look at it today. I'll be back for it. Probably." },
            {
              "if": "chess",
              "then": [
                { "edit": "chess", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "at": "2-1", "cast": "gus", "scene": "gusPawn" }],
  "errands": [
    {
      "id": "queen-game",
      "title": "Gus's game",
      "where": "the stone table on Harbor Green",
      "scene": "queenGame",
      "test": [
        { "set": { "queenIn": true } },
        { "add": { "unique": "gusChess" } },
        { "add": { "item": "statuette" } }
      ]
    }
  ],
  "calendar": [
    { "id": "queen-game", "errand": "queen-game", "story": "queen", "where": "Harbor Green", "title": "Gus's game", "known": "flag.queenIn", "scene": "queenGame" }
  ],
  "epilogue": [
    { "line": "Gus Lindqvist retired undefeated. He still sits at the stone table by the memorial and tells people how.", "if": "flag.queenEnd == 'checkmate'" }
  ]
});
