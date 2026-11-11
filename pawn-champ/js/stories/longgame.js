// Pawn Champ - The Long Game: a dead man's postcard chess game, and the opponent still writing.
// Minor quest m58, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Ruthie Kroll brings the box; the next card arrives at the shop after hours. Crossing: The Missing
// Queen (m1), where Gus plays it for you.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/longgame.js.
defineStory({
  "id": "longgame",
  "kind": "minor",
  "group": "deep",
  "title": "The Long Game",
  "location": "shopNight",
  "rumour": "A dead man's chess opponent is still sending moves.",
  "endings": { "won": "Checkmate, Gus", "resigned": "Resigned", "playing": "Your Move" },
  "icons": {
    "postcards": [
      "............",
      ".kkkkkkk....",
      ".kpppppkkkk.",
      ".kpkkkpkppk.",
      ".kpppppkpk..",
      ".kkkkkkkppk.",
      "..kpkpkpkpk.",
      "..kkkkkkkkk.",
      "..kSkSkSk...",
      "..kkkkkkk...",
      "............",
      "............"
    ],
    "blackpawn": [
      "............",
      ".....kk.....",
      "....kvvk....",
      "....kvvk....",
      ".....kk.....",
      "....kvvk....",
      "...kvVvvk...",
      "...kvvvvk...",
      "..kvvvvvvk..",
      "..kkkkkkkk..",
      "............",
      "............"
    ]
  },
  "uniques": {
    "longGame": {
      "name": "A travelling chess set and forty years of postcards",
      "icon": "postcards",
      "cat": "curio",
      "guide": 35,
      "questKey": true,
      "condLabel": "Mid-game",
      "tells": [
        "A folding pocket chess set, pieces pegged in, the game half played. A shoebox of postcards: one move each, since 1985.",
        "The opponent's cards are postmarked HOLLOW NECK. No sender, no stamp. Every one of them arrived damp."
      ]
    },
    "blackPawn": {
      "name": "A black pawn that isn't stone",
      "icon": "blackpawn",
      "cat": "curio",
      "guide": 0,
      "nosale": true,
      "condLabel": "Cold",
      "tells": [
        "A chess pawn, black, heavy for its size, and cold however long you hold it.",
        "Under the loupe it isn't carved. It grew."
      ]
    }
  },
  "soundings": { "longgame-cards": "Something in the Neck plays chess by post, slowly, and it has been winning since 1985. It is only patient because it can afford to be." },
  "overheard": [
    { "line": "Low: \"Lemuel Grote's chess cards are still coming to the Anchor. He's been dead since August.\"" }
  ],
  "about": [
    "A short uncanny story. Lemuel Grote played chess by postcard with someone for forty years from stool nine at the Rusty Anchor; he died in August and the cards still come under the bar door, wet, once a week. Ruthie sells you the board and the box of cards to be rid of them (§{ruthieLong}).",
    "Late one night a damp card slides under your door: a move, and \"Who are you?\" (§{longCard}). You can read every card in the box and see the opponent's notes drift into who in town will die (a Look). Then hand the game to Gus, who finds mate in four (§{longGus}, Checkmate, Gus), play on yourself, a move a week, slowly losing (§{longPlay}, Your Move), or resign politely and find a cold black pawn on the mat (§{longResign}, Resigned)."
  ],
  "scenes": {
    "ruthieLong": {
      "title": "Ruthie brings Lemuel Grote's chess game",
      "customer": "ruthie",
      "steps": [
        {
          "say": "ruthie",
          "text": [
            "You know Lemuel Grote? Sat on stool nine at the Anchor for forty years, playing chess by postcard with somebody. Never said who.",
            "He died in August. The cards haven't stopped. They come under the door at the Anchor, wet, one a week, and the bar staff won't open up alone.",
            "I want it out of my bar. The board and the box. Give me something for it and the next card's your problem."
          ]
        },
        { "offer": { "unique": "longGame" }, "persona": "honest", "asking": 25, "min": 10 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "longBought": true } },
            { "say": "ruthie", "text": "The cards come on {placed:longgame-card} nights. Late. You'll hear it." },
            { "toast": "Calendar: the next card, {placed:longgame-card} night", "look": "ruthie" }
          ]
        },
        { "leave": "ruthie" }
      ]
    },
    "longCard": {
      "title": "The next card",
      "music": "eerie",
      "steps": [
        {
          "stage": "shopNight",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "After midnight. You're doing the books by the till when something slides under the shop door: a postcard, damp, the ink run a little.",
            "On the front, a picture of Hollow Neck harbor from the water, a view no postcard printer ever had. On the back, in a hand like seaweed drying: \"Kt e8-f7. Your move. Who are you?\""
          ]
        },
        { "find": "board", "in": "stock", "match": { "uniqueId": "longGame" } },
        {
          "if": "!board",
          "then": [
            { "narrate": "You've sold the board. You put the card in the bin. In the morning, it's back on the mat, dry this time." },
            { "set": { "longEnd": "playing" } },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Read every card in the box, in order",
              "hint": "(Look)",
              "then": [
                { "narrate": "Forty years of moves. The early cards are polite. Then the opponent starts adding things: the weather in the Neck, which is never the same as the weather in town. Who has died. Who will. The last card before Lemuel died just says \"Soon, old friend. Your move.\"" },
                { "sounding": "longgame-cards" },
                {
                  "choose": [
                    {
                      "label": "Take it to Gus on the Green and let him play",
                      "if": "(quest.queen || hook.gusHere) && mood.gus != 'enemy'",
                      "then": [{ "run": "longGus" }]
                    },
                    {
                      "label": "Take it to Gus on the Green and let him play",
                      "if": "(quest.queen || hook.gusHere) && mood.gus == 'enemy'",
                      "then": [{ "run": "longGusFoe" }]
                    },
                    {
                      "label": "Play on: write a move and leave it on the step",
                      "then": [{ "run": "longPlay" }]
                    },
                    { "label": "Resign, politely", "then": [{ "run": "longResign" }] }
                  ]
                }
              ]
            },
            {
              "label": "Take it to Gus on the Green and let him play",
              "if": "(quest.queen || hook.gusHere) && mood.gus != 'enemy'",
              "then": [{ "run": "longGus" }]
            },
            {
              "label": "Take it to Gus on the Green and let him play",
              "if": "(quest.queen || hook.gusHere) && mood.gus == 'enemy'",
              "note": "story moment (appraise): Gus is your enemy, so he won't play it for you",
              "then": [{ "run": "longGusFoe" }]
            },
            { "label": "Play on: write a move and leave it on the step", "then": [{ "run": "longPlay" }] },
            { "label": "Resign, politely", "then": [{ "run": "longResign" }] }
          ]
        },
        { "edit": "board", "set": { "questKey": false, "nosale": false } },
        { "refresh": "panel" },
        { "edit": "board", "set": { "condLabel": "Mid-game" }, "if": "flag.longEnd == 'playing'" },
        { "edit": "board", "set": { "condLabel": "Finished" }, "if": "flag.longEnd != 'playing'" }
      ]
    },
    "longGus": {
      "title": "The long game: Gus plays it",
      "steps": [
        { "enter": { "id": "gus", "cast": "gus", "at": [200, 152], "facingLeft": true } },
        { "say": "gus", "text": "For you? I'd play the devil himself. Sit.", "if": "mood.gus == 'friend'", "note": "story moment (appraise): a friend" },
        { "say": "gus", "text": "Let me see. Hm. Hm! Forty years and Lemuel never saw this. Rook to h8. Mate in four." },
        { "narrate": "Four more cards come, one a night, each wetter than the last. On the fifth night a card comes that just says \"Well played.\" Gus doesn't go to the Green the next day. He says he needs a rest." },
        { "set": { "longEnd": "won" } }
      ]
    },
    "longGusFoe": {
      "title": "The long game: Gus won't play it for you",
      "note": "story moment (appraise): Gus is an enemy. He tells you the game's lost, and laughs.",
      "steps": [
        { "enter": { "id": "gus", "cast": "gus", "at": [200, 152], "facingLeft": true } },
        {
          "say": "gus",
          "text": [
            "Lemuel's game. Let me see.",
            "Lost. Lost in about 1991, if you know where to look. Black's been toying with him since. Good luck with that.",
            "No, I won't play it for you. Ask me nicely in another forty years."
          ]
        },
        { "narrate": "He's still laughing when you get to the end of the Green." },
        { "remove": "gus" },
        {
          "choose": [
            {
              "label": "Play on anyway: write a move and leave it on the step",
              "then": [{ "run": "longPlay" }]
            },
            { "label": "Resign, politely", "then": [{ "run": "longResign" }] }
          ]
        }
      ]
    },
    "longPlay": {
      "title": "The long game: you play on",
      "steps": [
        { "narrate": "You write a move on a card from the rack by the till and leave it on the step. In the morning it's gone and the step is wet. A new card comes the next week. And the week after." },
        { "set": { "longEnd": "playing" } }
      ]
    },
    "longResign": {
      "title": "The long game: you resign",
      "steps": [
        {
          "narrate": [
            "You write \"I resign. Thank you for the game.\" and leave it on the step.",
            "In the morning the card is gone. In its place, on the mat, is a single black chess pawn, cold as the harbor in March."
          ]
        },
        { "if": "shelf.free", "then": [{ "add": { "unique": "blackPawn" } }, { "refresh": "panel" }] },
        { "set": { "longEnd": "resigned" } }
      ]
    }
  },
  "beats": [
    { "drift": "longgame-ruthie", "from": "1-2", "to": "2-2", "cast": "ruthie", "scene": "ruthieLong" }
  ],
  "nights": [
    {
      "id": "longgame-card",
      "window": ["2-4", "3-4"],
      "if": "flag.longBought && !flag.longEnd",
      "scene": "longCard",
      "test": [{ "set": { "longBought": true } }, { "add": { "unique": "longGame" } }]
    }
  ],
  "calendar": [
    { "id": "longgame-card", "night": "longgame-card", "story": "longgame", "where": "The shop, after hours", "title": "The next card", "known": "flag.longBought", "scene": "longCard" }
  ],
  "epilogue": [
    { "line": "A damp postcard still comes under the shop door every week. You're losing. Slowly. Everyone does.", "if": "flag.longEnd == 'playing'" }
  ],
  "outcome": "flag.longEnd"
});
