// Pawn Champ - Too Big for the Tank: the first chapter of The Thing in Dory's Freezer's long arc
// (round 3, batch T). Docs: docs/quests/MAJOR.md#m8-the-long-arc and docs/SEASONS.md#long-arcs-five.
// Stay-on only: these chapters are never drawn in October.
//
// "It hasn't stopped growing." Each October ending leads somewhere different and gentle, and all three
// meet at the breakwater in the March thaw:
//   tank    Too Big for the Tank  (Shop Mascot, December or January): the tank cracks one night, and
//           it needs a new home: the clawfoot tub Marv found, the marine lab's winter tank, or the harbor.
//   second  A Second One          (js/stories/freezerSecond.js)
//   thaw    The Thaw              (js/stories/freezerThaw.js)
// Back to the Sea has no middle chapter: the sea keeps leaving something on your step once a month
// (this file's "afterwards"). The chapters share a code half: js/quests/freezerarc.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "freezerTank",
  "kind": "major",
  "colour": "#5ab8b0",
  "family": "uncanny",
  "title": "Too Big for the Tank",
  "arc": "freezer",
  "after": ["mascot"],
  "months": [3, 4],
  "teaser": "The thing in the tank by the till has stopped humming in the mornings. Its tail curls all the way round the glass now, end to end.",
  "rumour": "The thing in the pawnshop tank has outgrown it, and Dory says it isn't finished.",
  "endings": { "tub": "In the Back Room", "lab": "The Winter Tank", "harbor": "Under the Ice Edge" },
  "outcome": "flag.tankEnd",
  "code": "freezerarc",
  "about": [
    "The freezer arc's chapter for when you kept the thing in a tank by your till. It's outgrown the tank; Dory says it's a juvenile, which means it's going to get bigger (§{tankDory}). The scallop boats are tied up for winter, so its feed costs more every morning.",
    "Two possible homes turn up. Marv Kettle has a cast-iron clawfoot bathtub on his van (§{tankMarv}). Dr. Achebe from the marine lab offers its winter tank, currently home to a lobster called Gerald (§{tankAchebe}).",
    "At two in the morning in week 3 or 4 the tank cracks (§{tankNight}), and you, Dory and Cal rescue it to her lobster tank. Then you decide where it lives: the tub in your back room (In the Back Room), the lab's winter tank (The Winter Tank, and the lab pays its feed), or the harbor before the ice closes (Under the Ice Edge). If it goes back to the sea, in this chapter or any other, something turns up on your step once a month afterwards. The Thaw follows in March."
  ],
  "notes": "The first of the freezer arc's three chapters, after Shop Mascot. The arc's \"afterwards\" lives here: whichever chapter put the thing back in the sea, something turns up on your step once a month.",
  "icons": {
    "clawtub": [
      "............",
      "............",
      "k..........k",
      "kk........kk",
      "kSkkkkkkkkSk",
      "kSSSSSSSSSSk",
      "kSSBBBBBBSSk",
      ".kSSSSSSSSk.",
      "..kkkkkkkk..",
      "..ky....yk..",
      "..kk....kk..",
      "............"
    ]
  },
  "uniques": {
    "clawTub": {
      "name": "Clawfoot bathtub",
      "icon": "clawtub",
      "cat": "art",
      "guide": 160,
      "condLabel": "Chipped",
      "tells": [
        "Cast iron, white enamel, four brass claw feet. It took Marv and two men from the co-op to carry it in.",
        "Stamped under the rim: STANDARD, 1912. Somebody painted the outside sea green and then thought better of it."
      ]
    },
    "thawPearl": {
      "name": "A pearl the size of a gull's egg",
      "icon": "pearl",
      "cat": "jewelry",
      "guide": 420,
      "tells": [
        "Left on the granite at the foot of the breakwater, in the thaw. Still cold.",
        "Not quite round. It looks, if you turn it in the light, like it is humming."
      ]
    }
  },
  "scenes": {
    "tankDory": {
      "title": "Dory comes to look at it: it's outgrown the tank",
      "customer": "dory",
      "steps": [
        { "say": "dory", "text": "I came to look at it. Don't make a thing of it." },
        { "narrate": "Dory stands at the tank with her hands in her coat pockets. The thing presses both small hands flat on the glass, and its tail folds over its own head to fit." },
        {
          "say": "dory",
          "text": [
            "Dr. Achebe from the lab says it's a juvenile. Juvenile. That means it's a baby, and it's going to be a bigger one.",
            "And the scallop boats are tied up till spring, so it's frozen ones from the co-op, and it knows. Look at its face. That's a face that knows."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll find it somewhere bigger.\"",
              "then": [
                { "say": "dory", "text": "Good. Ask Marv Kettle. He clears houses. Somebody on Cove Road always has a bathtub they don't want." }
              ]
            },
            {
              "label": "\"It's fine. It's happy here.\"",
              "then": [
                { "say": "dory", "text": "It's happy because it's polite. It'll stop being polite about the time the glass goes." }
              ]
            },
            {
              "label": "\"Would you take it back, Dory?\"",
              "then": [
                { "say": "dory", "text": "Where would I put it? I've got three chest freezers and one of them's full of its scallops. Ask Marv. Or the lab." }
              ]
            }
          ]
        },
        { "set": { "tankIn": true } },
        { "leave": "dory" }
      ]
    },
    "tankMarv": {
      "title": "Marv Kettle has a clawfoot bathtub on the van",
      "customer": "marv",
      "steps": [
        {
          "say": "marv",
          "text": [
            "Marv Kettle. Cleared a farmhouse on Cove Road this week. Everything had to go, and I mean everything.",
            "Dory Kittredge says you're in the market for a bathtub. I won't ask. I've got one on the van. Cast iron, claw feet. It took three of us."
          ]
        },
        { "offer": { "unique": "clawTub" }, "persona": "honest", "asking": 120, "min": 85 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "tankTub": true } },
            { "say": "marv", "text": "Back room, I'd say. Mind the floor. It's seen worse than your floor, but mind it." }
          ],
          "else": [
            { "say": "marv", "text": "Suit yourself. It'll go to a garden in Truro to grow geraniums in." }
          ]
        },
        { "leave": "marv" }
      ]
    },
    "tankAchebe": {
      "title": "Dr. Achebe from the marine lab comes to look",
      "customer": "achebe",
      "steps": [
        { "say": "achebe", "text": "Ines Achebe, from the marine lab. Dory said I could come and look. I'm the calm one." },
        { "narrate": "She watches it without a word. It watches her back. Then she writes something in a notebook and underlines it twice." },
        {
          "say": "achebe",
          "text": [
            "It needs cold salt water and the dark, and it needs room. We have a winter tank at the lab: four thousand gallons, nobody in it but a lobster called Gerald.",
            "If it ever comes to that, call me. Day or night. We'd pay for its feed, and Cal could visit on Saturdays."
          ]
        },
        { "set": { "tankLabOffer": true } },
        { "leave": "achebe" }
      ]
    },
    "tankNight": {
      "title": "Two in the morning: the tank cracks",
      "music": "tension",
      "steps": [
        {
          "stage": "shopNight",
          "view": { "candleX": 236 },
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "Two in the morning. A crack like a pistol shot from downstairs, and then the sound of a lot of water finding the floor.",
            "The tank has split down one corner. The thing is on the boards in an inch of salt water, holding on to the leg of the counter with both hands, humming a low, frightened note.",
            "You call Dory. She comes in her pajamas and her fishing boots, with Cal, and the big cooler, and no questions."
          ]
        },
        {
          "hook": "thing",
          "with": { "where": "coldroom", "x": 346, "y": 203, "hum": true, "wet": true, "others": null },
          "note": "in the lobster tank at Kittredge Fish"
        },
        {
          "stage": "coldroom",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [110, 168] },
            { "id": "dory", "cast": "dory", "at": [140, 166] },
            { "id": "cal", "cast": "cal", "at": [236, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Kittredge Fish, a quarter to three. The thing lies in the lobster tank by the back wall, in the cold, and slowly stops shaking." },
        { "say": "cal", "text": "It fits in here. Just. It won't fit by Easter." },
        { "say": "dory", "text": "It can't stay here. The inspector comes Tuesdays. So. Where does it live?" },
        { "find": "tub", "in": "stock", "match": { "uniqueId": "clawTub" } },
        {
          "choose": [
            {
              "label": "The clawfoot tub, in your back room",
              "hint": { "if": "tub", "then": "(salt water, the lights off, and it stays yours)", "else": "(you don't have one)" },
              "disabled": "!tub",
              "then": [
                { "set": { "tankEnd": "tub" } },
                { "edit": "tub", "set": { "questKey": true, "nosale": true, "condLabel": "Occupied" } },
                { "refresh": "panel" },
                { "rep": 1, "why": "Gave the sea thing a bathtub" },
                { "narrate": "By five it's in the tub in your back room, in the dark, with a hose from the harbor and a bucket of co-op scallops. It sinks to the bottom, folds its hands, and hums like a kettle coming up to the boil." },
                { "say": "dory", "text": "You're soft. I'm saying it as a fact." }
              ]
            },
            {
              "label": "Call Dr. Achebe: the lab's winter tank",
              "hint": { "if": "flag.tankLabOffer", "then": "(the lab pays its feed, $150)", "else": "(she'll come)" },
              "then": [
                { "set": { "tankEnd": "lab" } },
                { "hook": "letGo" },
                { "coin": 150, "why": "The marine lab took the sea thing (and its feed bill)", "if": "flag.tankLabOffer" },
                { "rep": 2, "why": "Sent the sea thing to the marine lab" },
                { "enter": { "id": "achebe", "cast": "achebe", "at": [290, 162], "facingLeft": true } },
                { "walk": "achebe", "to": [266, 162] },
                { "say": "achebe", "text": "Sorry. I drove with the hazards on. Is it hurt? No. Good. Hello, you." },
                { "narrate": "She carries it to the lab van like a tray of eggs. Gerald the lobster, you find out on Saturday, has been moved to a smaller tank, and is said to be furious." },
                { "remove": "achebe" }
              ]
            },
            {
              "label": "The harbor. Tonight, before the ice closes in.",
              "then": [
                { "set": { "tankEnd": "harbor" } },
                { "hook": "letGo" },
                { "rep": 2, "why": "Let the sea thing go before the ice" },
                { "sway": "dory", "by": 1, "why": "Let it go" },
                {
                  "narrate": [
                    "The three of you carry the cooler down Front Street in the snow, past the dark bakery and the plowed-in war memorial, to the slip by Pier Nine where the ice hasn't closed yet.",
                    "Dory tips the cooler. It goes into the black water like a hand into a glove. It comes up once, a long way out, between two plates of ice. Then it doesn't."
                  ]
                },
                { "say": "cal", "text": "Bye, then." },
                { "say": "dory", "text": "Bye, then." }
              ]
            }
          ]
        },
        { "hook": "thing", "with": { "where": null } }
      ]
    }
  },
  "beats": [
    { "drift": "tank-dory", "from": "1-2", "to": "1-3", "cast": "dory", "scene": "tankDory" },
    { "drift": "tank-marv", "from": "1-4", "to": "2-2", "cast": "marv", "scene": "tankMarv", "if": "flag.tankIn && !flag.tankEnd && shelf.free" },
    { "drift": "tank-achebe", "from": "2-3", "to": "3-1", "cast": "achebe", "scene": "tankAchebe", "if": "flag.tankIn && !flag.tankEnd" }
  ],
  "nights": [
    {
      "id": "tank-night",
      "window": ["3-2", "4-3"],
      "if": "flag.tankIn && !flag.tankEnd",
      "scene": "tankNight",
      "note": "no calendar entry: the night the glass goes is a surprise",
      "test": [
        { "set": { "tankIn": true } },
        { "roll": { "tankLabOffer": [true, false] } },
        { "add": { "unique": "seaThing" } },
        { "add": { "unique": "clawTub" } }
      ]
    }
  ],
  "afterwards": [
    {
      "if": "month >= 2 && week == 1 && day == 3 && hook.seaWhere == 'sea' && flag.seaStepMonth != month",
      "note": "Back to the Sea, and every later chapter that put it back in the water: once a month, early in the first week, something on the step",
      "then": [
        { "hook": "stepMonth" },
        {
          "if": "shelf.free",
          "then": [
            {
              "if": "month == 2",
              "then": [
                { "add": { "item": "ring", "name": "A ring with a green cast" }, "as": "gift" },
                {
                  "edit": "gift",
                  "set": {
                    "inspected": true,
                    "clues": [{ "text": "Left on your step before dawn, still wet.", "cls": "good" }]
                  }
                },
                { "refresh": "panel" },
                { "toast": "On the step this morning, still wet: a ring with a green cast. The sea keeps in touch.", "icon": "ring" }
              ]
            },
            {
              "if": "month == 3",
              "then": [
                { "add": { "item": "compass", "name": "A barnacled pocket compass" }, "as": "gift" },
                {
                  "edit": "gift",
                  "set": {
                    "inspected": true,
                    "clues": [{ "text": "Left on your step before dawn, still wet.", "cls": "good" }]
                  }
                },
                { "refresh": "panel" },
                { "toast": "On the step this morning, still wet: a barnacled pocket compass. The sea keeps in touch.", "icon": "compass" }
              ]
            },
            {
              "if": "month == 4",
              "then": [
                { "add": { "item": "watch", "name": "A pocket watch full of sand" }, "as": "gift" },
                {
                  "edit": "gift",
                  "set": {
                    "inspected": true,
                    "clues": [{ "text": "Left on your step before dawn, still wet.", "cls": "good" }]
                  }
                },
                { "refresh": "panel" },
                { "toast": "On the step this morning, still wet: a pocket watch full of sand. The sea keeps in touch.", "icon": "wristwatch" }
              ]
            },
            {
              "if": "month == 5",
              "then": [
                { "add": { "item": "necklace", "name": "A string of sea-worn beads" }, "as": "gift" },
                {
                  "edit": "gift",
                  "set": {
                    "inspected": true,
                    "clues": [{ "text": "Left on your step before dawn, still wet.", "cls": "good" }]
                  }
                },
                { "refresh": "panel" },
                { "toast": "On the step this morning, still wet: a string of sea-worn beads. The sea keeps in touch.", "icon": "necklace" }
              ]
            },
            {
              "if": "month == 6",
              "then": [
                { "add": { "item": "goblet", "name": "A pewter cup, rinsed clean" }, "as": "gift" },
                {
                  "edit": "gift",
                  "set": {
                    "inspected": true,
                    "clues": [{ "text": "Left on your step before dawn, still wet.", "cls": "good" }]
                  }
                },
                { "refresh": "panel" },
                { "toast": "On the step this morning, still wet: a pewter cup, rinsed clean. The sea keeps in touch.", "icon": "goblet" }
              ]
            }
          ]
        }
      ]
    }
  ],
  "mornings": [
    { "find": "tank", "in": "stock", "match": { "uniqueId": "seaThing" } },
    {
      "if": "tank && !(flag.tankEnd && flag.tankEnd != 'tub')",
      "note": "the tank, while it lasts: winter scallops cost more, and people still come in to look",
      "then": [
        { "coin": -8, "why": "Frozen scallops for the thing in the tank (winter prices)" },
        {
          "hook": "looker",
          "if": "!(flag.tankEnd == 'tub' || random < 0.5)",
          "with": [
            "Is it true it's too big for the tank now? Can I see before it isn't?",
            "My nephew says the fish in here has got hands. I said that's not a fish, then."
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "There's a clawfoot tub in your back room with the lights off and something in it, humming. You buy scallops wholesale now.", "if": "flag.tankEnd == 'tub'" },
    { "line": "The marine lab's winter tank has a new name on the door: KITTREDGE. Cal goes on Saturdays. Gerald the lobster does not.", "if": "flag.tankEnd == 'lab'" },
    { "line": "You let it go at the edge of the ice. Some mornings you go down to the slip by Pier Nine and stand there a while, for no reason you'll admit.", "if": "flag.tankEnd == 'harbor'" }
  ],
  "talk": {
    "by": "dot",
    "rumour": [
      "Dory was in for chowder and she ate it standing up. She says your thing has outgrown its tank.",
      "She says \"juvenile\" like it's a swear word now."
    ],
    "react": { "tub": "There's a bathtub in your back room with a sea creature in it. I've told everybody. You're welcome.", "lab": "The marine lab put a sign up: VISITING SATURDAYS. Cal's doing the tours. He's very bad at it.", "harbor": "You let it go before the ice. Dory says it was right. Dory never says anything was right." },
    "sway": { "tub": { "dot": 1 }, "lab": { "dory": 1, "dot": 1 }, "harbor": { "dory": 2 } }
  }
});
