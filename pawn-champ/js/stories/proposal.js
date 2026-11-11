// Pawn Champ - The Second Proposal. Minor quest m6, batch C (docs/quests/MINOR.md#m6).
// Priya said no at trivia night and pawned the ring. It says FOREVR. Teddy wants it back, and
// next Thursday they're on rival teams again.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/proposal.js.
defineStory({
  "id": "proposal",
  "kind": "minor",
  "title": "The Second Proposal",
  "location": "rustyanchor",
  "rumour": "Priya said no at the Rusty Anchor. In front of everybody.",
  "endings": { "yes": "Yes This Time", "spelled": "Spelled Right", "champions": "Trivia Champions" },
  "outcome": "flag.propEnd",
  "about": [
    "A romantic comedy. Priya Raman said \"Not now\" when Teddy Fogg proposed during the final round of trivia at the Rusty Anchor, and everyone heard \"no\". She sells you the ring he left on the table, engraved FOREVR (§{priyaRing}). Teddy comes in to buy it back and ask again properly, after the last question this time (§{teddyAsks}). Sell it back as it is, point out the spelling so he can get it fixed, or tell him to see you at trivia.",
    "At trivia night (§{propTrivia}) join Priya's team or sit with Teddy's. On Priya's team you answer three local questions; get two right and her team wins, and she tells Teddy to ask again next month (Trivia Champions). Otherwise Teddy proposes after the last question and she says yes (Yes This Time), or, if the ring was fixed or you warn him in time, she says yes to a ring spelled right (Spelled Right)."
  ],
  "cast": {
    "priya": {
      "name": "Priya Raman",
      "look": { "skin": "#a87050", "hair": "#1a1210", "hs": 5, "coat": "#3a6a8a", "style": "puffer", "pants": "#2a2a30", "glasses": "#c8a050" }
    },
    "teddy": {
      "name": "Teddy Fogg",
      "look": { "skin": "#f0c8a8", "hair": "#c88a4a", "hs": 4, "coat": "#c84a3a", "style": "hoodie", "pants": "#3a4a6a", "beard": "#c88a4a" }
    }
  },
  "uniques": {
    "forevrRing": {
      "name": "Engagement ring, engraved FOREVR",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 45,
      "questKey": true,
      "tells": [
        "Engraved inside, in a neat script: FOREVR.",
        "A good little diamond. The spelling halves what anyone would pay."
      ]
    },
    "triviaTrophy": {
      "name": "Rusty Anchor trivia trophy",
      "icon": "goblet",
      "cat": "curio",
      "guide": 15,
      "tells": [
        "A plastic cup on a wooden block. A brass plate reads: CHAMPIONS. Someone has written LES QUIZERABLES under it in marker."
      ]
    }
  },
  "scenes": {
    "priyaRing": {
      "title": "Priya pawns the ring she said no to",
      "customer": "priya",
      "steps": [
        {
          "say": "priya",
          "text": [
            "You've probably heard. I said no at the Rusty Anchor. In front of everybody. During the final round.",
            "He did it during the final round! We were two points behind! I panicked and said \"Not now\", and everyone heard \"no\".",
            "Anyway he left the ring on the table and I can't look at it. Will you buy it? Don't sell it to just anybody. I mean, sell it. Not to just anybody."
          ]
        },
        { "offer": { "unique": "forevrRing" }, "persona": "desperate", "asking": 40, "min": 25 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "propRing": true } },
            { "say": "priya", "text": "Thanks. I'm going to go and not think about it at all." }
          ]
        },
        { "leave": "priya" }
      ]
    },
    "teddyAsks": {
      "title": "Teddy wants the ring back",
      "customer": "teddy",
      "steps": [
        {
          "say": "teddy",
          "text": [
            "Teddy Fogg. I'm looking for a ring. A specific ring. It says forever on it.",
            "F-O-R-E-V-R. Forever. I paid by the letter.",
            "Trivia's Thursday at the Rusty Anchor. She captains Les Quizerables. I'm on the Quizzly Bears. I'm going to ask her again. Properly. After the last question this time."
          ]
        },
        { "find": "ring", "in": "stock", "match": { "uniqueId": "forevrRing" } },
        {
          "choose": [
            {
              "label": "Sell it back to him ($70)",
              "disabled": "!ring",
              "then": [
                { "set": { "propSold": true } },
                { "sell": "ring" },
                { "coin": 70, "why": "Sold Teddy his ring back" },
                { "say": "teddy", "text": "Thank you. Thursday. Wish me luck. Wish me, like, a normal amount of luck." }
              ]
            },
            {
              "label": "\"Teddy. How do you spell forever?\"",
              "disabled": "!ring",
              "then": [
                { "say": "teddy", "text": "F-O-R... oh no. Oh NO. Can it be fixed? By Thursday?" },
                { "hook": "keeper", "sets": ["you"] },
                { "say": "you", "text": "There's an engraver on Water Street." },
                { "set": { "propFixed": true } },
                { "sell": "ring" },
                { "coin": 70, "why": "Sold Teddy his ring back, misspelled" },
                { "say": "teddy", "text": "You've saved my life. Or my Thursday. Same thing." }
              ]
            },
            {
              "label": "\"Come and see me at trivia. We'll talk.\"",
              "then": [
                { "set": { "propHeld": true } },
                { "say": "teddy", "text": "Okay. Okay! Thursday. Hold onto it. Don't sell it to just anybody." }
              ]
            }
          ]
        },
        { "set": { "propIn": true } },
        { "toast": "Calendar: trivia night at the Rusty Anchor", "look": "teddy" },
        { "leave": "teddy" }
      ]
    },
    "propTrivia": {
      "title": "Trivia night at the Rusty Anchor",
      "steps": [
        { "hook": "anchorStage", "with": false },
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 168] },
            { "id": "priya", "cast": "priya", "at": [70, 164] },
            { "id": "teddy", "cast": "teddy", "at": [250, 162], "facingLeft": true },
            { "id": "punter", "look": "random", "at": [[40, 160], [100, 166]] },
            { "id": "barfly", "look": "random", "at": [[226, 160], [280, 166]], "facingLeft": true }
          ]
        },
        { "narrate": "Trivia night at the Rusty Anchor. Eight teams, one microphone, and the bartender reading the questions under the Prudence Gale's bell." },
        { "say": "priya", "text": "We're one short. Our Kevin has the flu. You're in. You're in, right?" },
        { "choose": [{ "label": "Join Priya's team" }, { "label": "Sit with Teddy's team" }], "as": "join" },
        {
          "if": "join == 0",
          "then": [
            { "narrate": "Round four, local history. Whose ship's bell hangs over this very bar?" },
            {
              "choose": [
                {
                  "label": "The Prudence Gale",
                  "then": [{ "hook": "point", "sets": ["right"] }, { "say": "priya", "text": "YES." }]
                },
                {
                  "label": "The Margaret Ruth",
                  "then": [{ "say": "priya", "text": "No... no, it's fine. It's fine." }]
                },
                {
                  "label": "The Gull Point light",
                  "then": [{ "say": "priya", "text": "No... no, it's fine. It's fine." }]
                }
              ]
            },
            { "narrate": "Round five, sport. How many pins stand at the end of a candlepin lane?" },
            {
              "choose": [
                { "label": "Nine", "then": [{ "say": "priya", "text": "No... no, it's fine. It's fine." }] },
                {
                  "label": "Ten",
                  "then": [{ "hook": "point", "sets": ["right"] }, { "say": "priya", "text": "YES." }]
                },
                { "label": "Twelve", "then": [{ "say": "priya", "text": "No... no, it's fine. It's fine." }] }
              ]
            },
            { "narrate": "Final question. What is the name of the pawnshop on Front Street?" },
            {
              "choose": [
                {
                  "label": "Gilded Hand Finance",
                  "then": [{ "say": "priya", "text": "No... no, it's fine. It's fine." }]
                },
                {
                  "label": "Moss Clock Repair",
                  "then": [{ "say": "priya", "text": "No... no, it's fine. It's fine." }]
                },
                {
                  "label": "The Crooked Scale",
                  "then": [{ "hook": "point", "sets": ["right"] }, { "say": "priya", "text": "YES." }]
                }
              ]
            }
          ]
        },
        {
          "if": "join == 0 && right >= 2",
          "then": [
            { "set": { "propEnd": "champions" } },
            { "rep": 2 },
            { "narrate": "Les Quizerables win by one point. Priya stands on a chair. The Quizzly Bears applaud with dignity." },
            { "say": "teddy", "text": "I was going to ask again. After the last question." },
            { "say": "priya", "text": "Ask me again when you've won something, Teddy Fogg." },
            { "say": "teddy", "text": "Is that a yes?" },
            { "say": "priya", "text": "It's a \"next month\"." },
            { "add": { "unique": "triviaTrophy" } },
            { "find": "ring", "in": "stock", "match": { "uniqueId": "forevrRing" } },
            {
              "if": "ring",
              "then": [
                { "edit": "ring", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" }
              ]
            },
            { "toast": "Priya gave you the trophy to keep. She has a shelf of them.", "look": "priya" },
            { "refresh": "panel" }
          ],
          "else": [
            {
              "narrate": [
                { "if": "join == 0", "then": "Les Quizerables come second. The Quizzly Bears win, mostly because of Teddy, who knows every flag in the world.", "else": "You sit with the Quizzly Bears. Teddy knows every flag in the world and nothing else. It's enough." },
                "After the last question, Teddy stands up. The room goes quiet. He's done this before."
              ]
            },
            {
              "if": "flag.propFixed",
              "then": [
                { "set": { "propEnd": "spelled" } },
                { "narrate": "He opens the box. Freshly engraved: FOREVER. Priya reads it twice." },
                { "say": "priya", "text": "You spelled it right." },
                { "say": "teddy", "text": "I had help." },
                { "say": "priya", "text": "Yes. Obviously yes. Sit down, everyone's looking." }
              ],
              "else": [
                {
                  "if": "flag.propSold",
                  "then": [
                    { "set": { "propEnd": "yes" } },
                    { "say": "priya", "text": "Yes. Yes! After the last question! That's all I wanted!" },
                    { "narrate": "She doesn't notice the spelling until the wedding. She laughs so hard the photographer has to stop." }
                  ],
                  "else": [
                    { "find": "ring", "in": "stock", "match": { "uniqueId": "forevrRing" } },
                    {
                      "choose": [
                        {
                          "label": "Slide him the ring across the table ($70)",
                          "disabled": "!ring",
                          "then": [
                            { "sell": "ring" },
                            { "coin": 70, "why": "Sold Teddy his ring back at trivia" },
                            { "set": { "propEnd": "yes" } },
                            { "say": "priya", "text": "Yes! After the last question! That's all I wanted!" }
                          ]
                        },
                        {
                          "label": "Tell him about the spelling first",
                          "disabled": "!ring",
                          "then": [
                            { "sell": "ring" },
                            { "coin": 70, "why": "Sold Teddy his ring back at trivia" },
                            { "set": { "propEnd": "spelled" } },
                            { "narrate": "Teddy goes pale, then borrows the bartender's chalk and writes FOREVER on the scoreboard, under Les Quizerables, in letters a foot high." },
                            { "say": "priya", "text": "Yes. You idiot. Yes." }
                          ]
                        },
                        {
                          "label": "Stay out of it",
                          "then": [
                            { "set": { "propEnd": "yes" } },
                            { "narrate": "He asks without a ring. She says yes, and then, \"Where's the ring?\" He looks at you. You go and get it from the shop." },
                            {
                              "if": "ring",
                              "then": [
                                { "sell": "ring" },
                                { "coin": 70, "why": "Sold Teddy his ring back after trivia" }
                              ]
                            },
                            { "say": "priya", "text": "Yes! After the last question! That's all I wanted!" }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            { "rep": 2 }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "1-4", "cast": "priya", "scene": "priyaRing" },
    { "at": "2-2", "cast": "teddy", "scene": "teddyAsks", "if": "flag.propRing" }
  ],
  "nights": [
    {
      "id": "prop-trivia",
      "window": ["2-3", "3-4"],
      "weekdays": [4],
      "if": "flag.propIn",
      "scene": "propTrivia",
      "test": [
        { "set": { "propIn": true, "propHeld": true, "propRing": true } },
        { "add": { "unique": "forevrRing" } }
      ]
    }
  ],
  "calendar": [
    { "id": "prop-trivia", "night": "prop-trivia", "story": "proposal", "where": "The Rusty Anchor", "title": "Trivia night", "known": "flag.propIn", "scene": "propTrivia" }
  ],
  "epilogue": [
    { "line": "Priya Raman and Teddy Fogg are getting married at the Rusty Anchor. Trivia will go ahead as normal.", "if": "flag.propEnd == 'yes' || flag.propEnd == 'spelled'" },
    { "line": "Les Quizerables are unbeaten this season. Teddy has started learning capitals.", "if": "flag.propEnd == 'champions'" }
  ]
});
