// Pawn Champ - The Mayor of the Boardwalk. Minor quest m31, batch K (docs/quests/MINOR.md).
// Lucius Amadio has played the accordion outside Neptune's Arcade every day for twenty-two years. He
// pawns it every Monday and redeems it every Friday. One Friday he doesn't come. Its scene is a lunch
// errand on the boardwalk, by day.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/busker.js,
// which also draws the outside of Neptune's Arcade.
defineStory({
  "id": "busker",
  "kind": "minor",
  "title": "The Mayor of the Boardwalk",
  "location": "arcadeFront",
  "rumour": "The accordion man on the boardwalk didn't play on Friday. First Friday in twenty-two years.",
  "endings": { "encore": "Encore", "quiet": "The Quiet Boardwalk" },
  "about": [
    "A quiet story about an old street musician. Every Monday for twenty-two years Lucius Amadio, the accordion man on the boardwalk, has pawned his accordion for $40 and bought it back on Friday after playing; Odile never asked why (§{buskerMonday}). The first week he redeems it as usual and plays you a bar (§{buskerFriday}). The next Monday he pawns it again and doesn't say \"Friday\" (§{buskerAgain}).",
    "His granddaughter Posie says he's stopped playing, sure nobody was ever listening, and asks you to talk to him (§{buskerPosie}). On the arcade steps (§{buskerSteps}) hand him the accordion and ask him to play for you, and the windows along the boardwalk open and people clap for the first time (Encore). Or tell him who was listening all along. Selling it, or not going, is The Quiet Boardwalk."
  ],
  "notes": "buskerPawned counts the Mondays he pawned it. If nobody goes to the steps, the accordion is forfeit on the Tuesday of week 4.",
  "cast": {
    "lucius": {
      "name": "Lucius Amadio",
      "look": { "skin": "#d8a880", "hair": "#e8e8e8", "hs": 1, "coat": "#8a2a3a", "style": "vest", "vest": "#e8c050", "pants": "#2a2a3a", "moustache": "#e8e8e8", "hat": "flat", "hatc": "#3a3a4a" }
    },
    "posie": {
      "name": "Posie Amadio",
      "look": { "skin": "#d8a880", "hair": "#2a1e16", "hs": 3, "coat": "#3a6a8a", "style": "puffer", "pants": "#3a3a4a", "bag": "#c84a3a" }
    }
  },
  "icons": {
    "accordion": [
      "............",
      ".kkkkkkkkkk.",
      ".kRkSkSkSkRk",
      ".kRkSkSkSkRk",
      ".kRkkkkkkkRk",
      ".kRrkrkrkrRk",
      ".kRrkrkrkrRk",
      ".kRkkkkkkkRk",
      ".kRkSkSkSkRk",
      ".kRkSkSkSkRk",
      ".kkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "accordion": {
      "name": "Lucius Amadio's accordion",
      "icon": "accordion",
      "cat": "instrument",
      "guide": 160,
      "questKey": true,
      "tells": [
        "A 1950s Castelfidardo piano accordion, red pearl, re-reeded more than once.",
        "Inside the bellows, in pencil: a tally of five-bar gates. Hundreds of them."
      ]
    }
  },
  "scenes": {
    "buskerMonday": {
      "title": "Monday: Lucius pawns his accordion, as he always has",
      "customer": "lucius",
      "steps": [
        {
          "say": "lucius",
          "text": [
            "Lucius Amadio. The Mayor of the Boardwalk, they call me, because nobody else wanted the job. You're Odile's.",
            "Here is how it goes. Monday I pawn the accordion, so I have money for the week. Friday I play, I get paid, I come back and I buy it out. Twenty-two years. Odile never once asked why.",
            "Forty dollars. Same as always."
          ]
        },
        { "offer": { "unique": "accordion" }, "persona": "honest", "asking": 40, "min": 40 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "hook": "countPawn" },
            { "say": "lucius", "text": "Friday. You'll hear me before you see me." }
          ],
          "else": [
            { "set": { "buskerEnd": "quiet" } },
            { "say": "lucius", "text": "...She never haggled. Well. Things change." }
          ]
        },
        { "leave": "lucius" }
      ]
    },
    "buskerFriday": {
      "title": "Friday: he buys it out, and plays you a bar",
      "customer": "lucius",
      "steps": [
        { "find": "it", "in": "stock", "match": { "uniqueId": "accordion" } },
        {
          "if": "!it",
          "then": [
            { "say": "lucius", "text": "You SOLD it? In four days? Odile held it for twenty-two years." },
            { "set": { "buskerEnd": "quiet" } },
            { "leave": "lucius" },
            { "end": true }
          ]
        },
        { "say": "lucius", "text": "Friday! As promised. Forty, and four for your trouble." },
        { "take": "it" },
        { "coin": 44, "why": "Lucius Amadio redeemed his accordion" },
        { "narrate": "He plays four bars of a tarantella right there at the counter. The cat leaves the room. Lucius takes this as a compliment." },
        { "say": "lucius", "text": "Monday." },
        { "leave": "lucius" }
      ]
    },
    "buskerAgain": {
      "title": "Monday again",
      "customer": "lucius",
      "steps": [
        { "say": "lucius", "text": "Monday. Forty dollars." },
        { "add": { "unique": "accordion", "paid": 40 } },
        { "coin": -40, "why": "Lucius Amadio pawned his accordion again" },
        { "refresh": "panel" },
        { "hook": "countPawn" },
        { "narrate": "He doesn't say \"Friday\". He nods at the accordion on your shelf, and goes." },
        { "leave": "lucius" }
      ]
    },
    "buskerPosie": {
      "title": "His granddaughter comes instead",
      "customer": "posie",
      "steps": [
        {
          "say": "posie",
          "text": [
            "Posie Amadio. My grandfather didn't play on Friday. First Friday in twenty-two years. He didn't come here, did he?",
            "He sits on the arcade steps at lunchtime, where he used to play, with his hands in his pockets. He says the boardwalk is too quiet in the off-season and nobody was ever listening anyway.",
            "Would you come and talk to him? You have the accordion. He can't argue with the accordion."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll come at lunch.\"",
              "then": [
                { "plan": "busker-steps" },
                { "set": { "buskerAsked": true } },
                { "toast": "Calendar: the arcade steps, lunchtime {placed:busker-steps}", "look": "posie" },
                { "say": "posie", "text": "Bring it. Please." }
              ]
            },
            {
              "label": "\"It's his business, Posie.\"",
              "then": [{ "say": "posie", "text": "Okay. If you see him, though." }]
            }
          ]
        },
        { "leave": "posie" }
      ]
    },
    "buskerSteps": {
      "title": "Lucius on the arcade steps",
      "steps": [
        {
          "stage": "arcadeFrontDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "lucius", "cast": "lucius", "at": [196, 162], "facingLeft": true }
          ]
        },
        { "narrate": "Neptune's Arcade, by day, out of season. One gull, one bin, one old man on the steps with his hands in his pockets." },
        {
          "say": "lucius",
          "text": [
            "Posie sent you. Of course. She thinks I'm sad. I'm not sad. I'm retired.",
            "Twenty-two years I played this boardwalk. In August, fine, there are people. In November? I played to the gulls. I told myself the town was listening behind its windows. I counted every day in pencil inside the bellows. Last Friday I stopped counting."
          ]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "accordion" } },
        {
          "choose": [
            {
              "label": "Hand him the accordion: \"Then play for me. I'm listening.\"",
              "if": "it",
              "then": [
                { "set": { "buskerEnd": "encore" } },
                { "take": "it" },
                {
                  "narrate": [
                    "He looks at you for a while. Then he straps it on, because what else do you do with an accordion somebody is holding out to you.",
                    "He plays \"Funiculì, Funiculà\" to an audience of one. Then the taffy stall's shutter goes up six inches. Then a window above the fried-dough stand. Then a man in a dressing gown on the next balcony along, who has been listening since 2004 and never said."
                  ]
                },
                {
                  "say": "lucius",
                  "text": ["...Nobody ever CLAPPED before.", "Keep the forty. Interest. I'll be back Monday."]
                },
                { "rep": 4 }
              ]
            },
            {
              "label": "\"The town was listening. Ask around.\"",
              "then": [
                { "say": "lucius", "text": "Ask who? The gulls?" },
                { "narrate": "You give him the names: the baker who opens her window at five, the bus driver who slows down on the boardwalk turn, the woman in the taffy stall who learned all his songs by ear. He writes them on the back of his hand." },
                {
                  "if": "it",
                  "then": [
                    { "say": "lucius", "text": "Bring it Monday. Monday. Forty dollars." },
                    { "set": { "buskerEnd": "encore" } },
                    { "take": "it" },
                    { "coin": 44, "why": "Lucius Amadio redeemed his accordion" },
                    { "rep": 2 }
                  ],
                  "else": [
                    { "say": "lucius", "text": "And no accordion. That's a joke, at least. A good one." },
                    { "set": { "buskerEnd": "quiet" } }
                  ]
                }
              ]
            },
            {
              "label": "\"Then sell it. I'll give you a fair price.\" (it's worth about {it.guide|money})",
              "if": "it",
              "then": [
                { "set": { "buskerEnd": "quiet" } },
                { "edit": "it", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "lucius", "text": "Sell it. Fine. It's yours anyway, it's been yours more Mondays than it's been mine." },
                { "narrate": "The accordion is yours to sell now. The boardwalk is very quiet on the walk back." }
              ]
            },
            {
              "label": "\"It's gone, Lucius. I'm sorry.\"",
              "if": "!it",
              "then": [
                { "set": { "buskerEnd": "quiet" } },
                { "narrate": "He nods, and puts his hands back in his pockets." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "1-1", "cast": "lucius", "scene": "buskerMonday" },
    { "at": "1-5", "cast": "lucius", "scene": "buskerFriday", "if": "!flag.buskerEnd && flag.buskerPawned == 1" },
    { "at": "2-1", "cast": "lucius", "scene": "buskerAgain", "if": "!flag.buskerEnd && flag.buskerPawned == 1 && !hook.accHere" },
    { "at": "3-1", "cast": "posie", "scene": "buskerPosie", "if": "!flag.buskerEnd && flag.buskerPawned >= 2" }
  ],
  "errands": [
    {
      "id": "busker-steps",
      "title": "The Mayor of the Boardwalk",
      "where": "the steps of Neptune's Arcade",
      "scene": "buskerSteps",
      "test": [{ "add": { "unique": "accordion", "paid": 40 } }]
    }
  ],
  "calendar": [
    { "id": "busker-steps", "errand": "busker-steps", "story": "busker", "where": "Neptune's Arcade", "title": "Lucius on the steps", "known": "flag.buskerAsked" }
  ],
  "mornings": [
    {
      "if": "week == 4 && day == 2 && !flag.buskerEnd && flag.buskerPawned >= 2",
      "note": "if nobody went to the steps, the accordion is forfeit and stays on your shelf",
      "then": [
        { "find": "it", "in": "stock", "match": { "uniqueId": "accordion" } },
        {
          "if": "it && !(errand.busker-steps > 17)",
          "then": [
            { "set": { "buskerEnd": "quiet" } },
            { "edit": "it", "set": { "questKey": false, "nosale": false } },
            { "refresh": "panel" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "Lucius Amadio plays the boardwalk every day at noon. In November there are eleven people, and they clap.", "if": "flag.buskerEnd == 'encore'" },
    { "line": "Nobody plays outside Neptune's Arcade anymore. The man in the dressing gown says he misses it. He never said so at the time.", "if": "flag.buskerEnd == 'quiet'" }
  ],
  "talk": {
    "by": "skip",
    "rumour": [
      "The accordion man on the boardwalk, Lucius. I slow the bus down at the turn to hear him. Every day, twenty-two years.",
      "He didn't play on Friday. First Friday ever. The kids noticed. Kids notice everything."
    ],
    "react": { "encore": "Lucius is back on the boardwalk at noon. I slow the bus down. Today the kids clapped out the window.", "quiet": "Nobody plays the boardwalk anymore. I still slow down at the turn. Habit." },
    "sway": { "encore": { "skip": 2 }, "quiet": { "skip": -1 } }
  },
  "outcome": "flag.buskerEnd"
});
