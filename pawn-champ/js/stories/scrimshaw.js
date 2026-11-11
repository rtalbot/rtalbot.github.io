// Pawn Champ - Scrimshaw: an engraved whale tooth that is either 1840s and legal, or last year and
// not. Minor quest m11, batch D (docs/quests/MINOR.md#m11-scrimshaw).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/scrimshaw.js.
defineStory({
  "id": "scrimshaw",
  "kind": "minor",
  "title": "Scrimshaw",
  "location": "historical",
  "rumour": "The Historical Society is doing appraisals this week.",
  "endings": { "old": "1840s", "reported": "Last Year", "counter": "Under the Counter" },
  "about": [
    "A short authentication story. Marv Kettle sells you a scrimshaw whale tooth from a Cliff Road sea chest, engraved with a ship and MERIDIAN 1849 (§{marvTooth}). Old scrimshaw is legal to sell; new is a federal crime. Whether this one is old or new is fixed by the run code, so the same code always gets the same tooth.",
    "At the Historical Society's appraisal day (§{toothAppraisal}) Quayle reads the ink and the colour. If it's genuine he offers $220 for the Society, or you keep it to sell (1840s). If it was carved last year you can report it to the state wildlife office, which lowers your police heat (Last Year), or sell it under the counter to a man in the parking lot for $140 and a lot of heat (Under the Counter)."
  ],
  "notes": "Old or new is decided by the run code, so a shared code has the same tooth. Marv Kettle turns up in several stories (docs/catalogue/CHARACTERS.md).",
  "cast": {
    "quayle": {
      "name": "Bertram Quayle",
      "look": { "skin": "#f0d0b8", "hair": "#e8e8e8", "hs": 2, "coat": "#7a6a4a", "trim": "#2a4a2a", "style": "jacket", "long": true, "pants": "#4a4a3a", "glasses": "#2a2a2e", "moustache": "#e8e8e8" }
    }
  },
  "icons": {
    "scrimshaw": [
      ".....kk.....",
      "....kppk....",
      "....kpPk....",
      "...kppPk....",
      "...kpkPk....",
      "..kppkpPk...",
      "..kpkkpPk...",
      "..kpppkPk...",
      ".kppppPPk...",
      ".kpppPPk....",
      "..kkkkk.....",
      "............"
    ]
  },
  "uniques": {
    "toothOld": {
      "name": "Scrimshaw whale tooth",
      "icon": "scrimshaw",
      "cat": "art",
      "guide": 220,
      "questKey": true,
      "tells": [
        "The ink has worn down into the scratches, and the tooth is yellow all the way through.",
        "A ship under sail, and MERIDIAN 1849 in a sailor's capitals."
      ]
    },
    "toothNew": {
      "name": "Scrimshaw whale tooth",
      "icon": "scrimshaw",
      "cat": "art",
      "guide": 220,
      "questKey": true,
      "fake": true,
      "tells": [
        "The ink sits on top of the scratches instead of down in them.",
        "Under the brown stain the tooth is still white. Tea, maybe. This wasn't carved in 1849."
      ]
    }
  },
  "scenes": {
    "marvTooth": {
      "title": "Marv Kettle has a whale tooth",
      "customer": "marv",
      "steps": [
        {
          "say": "marv",
          "text": [
            "Marv Kettle, house clearances. I did a place on Cliff Road last week. Found this in a sea chest.",
            "Whale tooth, engraved. A ship, and \"MERIDIAN 1849\". Old scrimshaw is legal to sell. New stuff isn't, but this is old. Probably. The Historical Society is doing appraisals this week, if you want to be sure."
          ]
        },
        {
          "if": "hook.toothIsOld",
          "then": [{ "offer": { "unique": "toothOld" }, "persona": "smooth", "asking": 120, "min": 85 }],
          "else": [{ "offer": { "unique": "toothNew" }, "persona": "smooth", "asking": 120, "min": 85 }]
        },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "toothBought": true } },
            { "say": "marv", "text": "Pleasure. Get it looked at. Or don't. Your tooth now." },
            { "plan": "scrimshaw-appraisal" }
          ]
        },
        { "leave": "marv" }
      ]
    },
    "toothAppraisal": {
      "title": "Appraisal day at the Historical Society",
      "steps": [
        {
          "stage": "historical",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 166] },
            {
              "id": "appraiser",
              "cast": "lusk",
              "at": [234, 158],
              "facingLeft": true,
              "if": "quest.museum",
              "note": "The Crown Jewels' curator, if she's in town."
            },
            {
              "id": "appraiser",
              "cast": "quayle",
              "at": [234, 158],
              "facingLeft": true,
              "if": "!quest.museum"
            }
          ]
        },
        { "narrate": "Appraisal day at the Historical Society. A queue of people holding grandmothers' teapots, a folding table, and a lamp with a magnifier on an arm." },
        { "find": "tooth", "in": "stock", "match": { "uniqueId": ["toothOld", "toothNew"] } },
        {
          "if": "!tooth",
          "then": [
            { "say": "appraiser", "text": "Nothing to show me? Then have a cookie. They're from 1998, but they're free." },
            { "end": true }
          ]
        },
        {
          "say": "appraiser",
          "text": { "if": "quest.museum", "then": "Scrimshaw! I trained on this before I ever touched a crown. Let me see.", "else": "Bertram Quayle, volunteer, forty-one years. Scrimshaw is my favorite. Let's have a look." }
        },
        { "narrate": "You've already had it under your own loupe. You watch to see if they spot what you spotted.", "if": "tooth.inspected" },
        {
          "if": "tooth.uniqueId == 'toothOld'",
          "then": [
            {
              "say": "appraiser",
              "text": [
                "Look how the ink has gone down into the cuts. That's a hundred and seventy years of thumbs. Sperm whale, a sailor on the Meridian, 1840s. Lovely. And legal: it's an antique.",
                "The Society would give you two hundred and twenty for it, if you'll part with it. It would go in the case by the fireplace."
              ]
            },
            {
              "choose": [
                {
                  "label": "Sell it to the Society",
                  "hint": "(+$220)",
                  "then": [
                    { "take": "tooth" },
                    { "coin": 220, "why": "Sold the scrimshaw to the Historical Society" },
                    { "rep": 2 }
                  ]
                },
                {
                  "label": "Keep it to sell in the shop",
                  "then": [
                    {
                      "edit": "tooth",
                      "set": {
                        "questKey": false,
                        "nosale": false,
                        "inspected": true,
                        "clues": [
                          { "text": "The ink has worn down into the scratches, and the tooth is yellow all the way through.", "cls": "good" },
                          { "text": "A ship under sail, and MERIDIAN 1849 in a sailor's capitals.", "cls": "good" }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            { "set": { "toothEnd": "old" } }
          ],
          "else": [
            {
              "say": "appraiser",
              "text": [
                "Oh dear. See the ink? It sits on top. And under the stain, it's white. This was carved last year. Probably on ivory from a whale that was alive when you bought your phone.",
                "Selling that is a federal crime, I'm afraid. I'm obliged to tell you so. I'm not obliged to do anything else."
              ]
            },
            {
              "choose": [
                {
                  "label": "Report it to the state wildlife office",
                  "hint": "(heat -6)",
                  "then": [
                    { "take": "tooth" },
                    { "heat": -6 },
                    { "rep": 2 },
                    { "set": { "toothEnd": "reported" } },
                    { "narrate": "A wildlife officer collects the tooth in a ziplock bag that afternoon and takes down Marv Kettle's name. He seems almost pleased to have something to do." }
                  ]
                },
                {
                  "label": "Sell it under the counter to the man hanging round the parking lot",
                  "hint": "(+$140, heat +15)",
                  "then": [
                    { "take": "tooth" },
                    { "coin": 140, "why": "Sold a new scrimshaw tooth under the counter" },
                    { "heat": 15 },
                    { "set": { "toothEnd": "counter" } },
                    { "narrate": "He pays cash, folds the tooth into a sock, and drives off without his lights on. You don't feel great about it." }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "scrimshaw", "from": "1-3", "to": "3-3", "cast": "marv", "scene": "marvTooth" }],
  "errands": [
    {
      "id": "scrimshaw-appraisal",
      "title": "Appraisal day",
      "where": "the Historical Society",
      "scene": "toothAppraisal",
      "test": [
        {
          "if": "random < 0.5",
          "then": [{ "add": { "unique": "toothOld" } }],
          "else": [{ "add": { "unique": "toothNew" } }]
        },
        { "set": { "toothBought": true } }
      ]
    }
  ],
  "calendar": [
    { "id": "scrimshaw-appraisal", "errand": "scrimshaw-appraisal", "story": "scrimshaw", "where": "The Historical Society", "title": "Appraisal day", "known": "flag.toothBought" }
  ],
  "mornings": [
    { "find": "tooth", "in": "stock", "match": { "uniqueId": ["toothOld", "toothNew"], "questKey": true } },
    {
      "edit": "tooth",
      "set": { "questKey": false, "nosale": false },
      "if": "tooth && errand.scrimshaw-appraisal == -1",
      "note": "You skipped the appraisal: the tooth is yours to sell, for whatever it really is."
    }
  ],
  "sold": {
    "toothOld": [{ "set": { "toothEnd": "old" }, "if": "!flag.toothEnd" }],
    "toothNew": [{ "if": "!flag.toothEnd", "then": [{ "set": { "toothEnd": "counter" } }, { "heat": 15 }] }]
  },
  "outcome": "flag.toothEnd"
});
