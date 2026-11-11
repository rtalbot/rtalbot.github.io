// Pawn Champ - Static on Channel 16: a dead boat calls on the radio every night at closing. The
// ghost turns out to be a living man. Major quest M9, batch B (docs/quests/MAJOR.md#m9-static-on-channel-16).
//
// Hook (W1 Tue, at dusk)     Chet Amaral sells a marine VHF radio. At closing it says "Margaret Ruth".
//                            Sell it and the buyer brings it back next morning, white-faced.
// Middle (W2 Mon, shop)      Chet comes back: Tess Bascombe will pull the 1991 file after hours.
// Scene 1 (W2 Tue-Thu night) the harbormaster's shack: the file, the bearing, Gannet Island.
// Scene 2 (W3 Mon-Wed night) Gannet Island: Royce Kittredge is alive. He gives you the logbook.
// Finale (W3 Thu-W4 Thu)     the ferry landing at first light: Dory, Barrow, or nobody.
// Crossings: The Fog Week (Tess notices nobody from the Margaret Ruth came home in the fog), The
// Twins' Map (the twins find the mast first). Dory's freezer (M8) is batch C's; whichever lands
// second writes that crossing.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/radio.js.
defineStory({
  "id": "radio",
  "kind": "major",
  "colour": "#d07a4a",
  "family": "crime",
  "title": "Static on Channel 16",
  "crosses": ["twins", "fog", "freezer"],
  "rumour": "A radio in a pawnshop calls a sunk boat's name every night at closing.",
  "endings": { "homecoming": "Homecoming", "court": "Day in Court", "silence": "Radio Silence", "returned": "Back to Chet" },
  "about": [
    "A ghost story that turns out to be a crime. Chet Amaral, a retired Coast Guard radioman, sells you an old marine radio (§{chetRadio}). That night at closing, switched off and unplugged, it says \"Margaret Ruth\" three times. It does it every night after that, and if you sell it the buyer brings it back.",
    "Chet explains (§{chetBack}): the Margaret Ruth was Royce Kittredge's scalloper, lost with all hands in flat calm in 1991, and the only call was her name, three times. Give him the radio back and it ends there (Back to Chet). In the harbormaster's shack with Tess (§{radioShack}) the old file shows the Gilded Hand held the boat's loan and the debt died with her. If Fog is in the run, Tess notes that no one from the Margaret Ruth has ever walked up the pier in Fog Week. Chet's direction-finder points at Gannet Island, where nobody lives.",
    "On Gannet (§{radioIsland}) you find Royce Kittredge alive in a tar-paper shack with a mast made of fishing rods. He sank his own boat so his debts would die with him and his wife would keep the house, and he's called its name every night since so his daughter Dory might somehow know. He'll be on the first ferry, and you decide who meets it (§{radioLanding}): Dory (Homecoming), Captain Barrow for a reward (Day in Court), or nobody, and the radio goes back to Chet (Radio Silence)."
  ],
  "notes": "Tess runs in The Selectmen's Race and Dory leads Dory's Freezer; they are defined there.",
  "cast": {
    "chet": {
      "name": "Chet Amaral",
      "look": { "skin": "#a87050", "hair": "#d0d0d0", "hs": 0, "coat": "#2a3a5a", "trim": "#e8e4dc", "style": "jacket", "hat": "cap", "hatc": "#22305a", "band": "#e2c04a", "pants": "#4a4a40", "moustache": "#d0d0d0", "stout": true }
    },
    "royce": {
      "name": "Royce Kittredge",
      "look": { "skin": "#d0a078", "hair": "#e8e8e8", "hs": 2, "coat": "#5a6a3a", "trim": "#8a7a4a", "style": "jacket", "beard": "#e8e8e8", "hat": "beanie", "hatc": "#8a2a2a", "pants": "#3a3a30" }
    },
    "radioBuyer": {
      "name": "The man who bought the radio",
      "look": { "skin": "#e8d8d0", "hair": "#5a4a3a", "hs": 0, "coat": "#7a7a6a", "style": "puffer", "pants": "#3a3a42" }
    }
  },
  "icons": {
    "radio": [
      ".........k..",
      ".........k..",
      ".kkkkkkkkkk.",
      ".kddddddddk.",
      ".kdaaaaAddk.",
      ".kdaaaaaddk.",
      ".kddddddddk.",
      ".kdsdsdkkdk.",
      ".kdsdsdkkdk.",
      ".kddddddddk.",
      ".kkkkkkkkkk.",
      "............"
    ],
    "lifering": [
      "....kkkk....",
      "..kkaccakk..",
      ".kaakkkkaak.",
      ".kak....kak.",
      "kak......kak",
      "kck......kck",
      "kak......kak",
      ".kak....kak.",
      ".kaakkkkaak.",
      "..kkaccakk..",
      "....kkkk....",
      "............"
    ]
  },
  "uniques": {
    "vhfRadio": {
      "name": "Marine VHF radio",
      "icon": "radio",
      "cat": "curio",
      "guide": 50,
      "cond": 2,
      "condLabel": "Coast Guard surplus",
      "tells": [
        "A base-station set, Coast Guard grey. Channel 16 is taped in place.",
        "A brass plate: U.S.C.G. STATION HOLLOW NECK. It isn't plugged in. It doesn't need to be."
      ]
    },
    "ruthLog": {
      "name": "Logbook of the Margaret Ruth",
      "icon": "tome",
      "cat": "curio",
      "guide": 0,
      "condLabel": "Salt-stained",
      "questKey": true,
      "tells": [
        "The last entry, 14 October 1991: \"Flat calm. Opened the seacocks at 2240. God forgive me. Tell Dory.\"",
        "Every page after it is blank, and dated. Thirty-four years of dates."
      ]
    },
    "ruthRing": {
      "name": "Life ring, Margaret Ruth",
      "icon": "lifering",
      "cat": "curio",
      "guide": 70,
      "condLabel": "Sun-faded",
      "wantedBy": { "name": "Dory Kittredge", "mult": 1 },
      "wantedKnown": "flag.radioIsland",
      "tells": [
        "Stencilled MARGARET RUTH, HOLLOW NECK. Washed up on Gannet Island in November 1991.",
        "Someone has tied a fresh line to it, recently, and then untied it."
      ]
    }
  },
  "scenes": {
    "chetRadio": {
      "title": "Chet Amaral sells a radio, at dusk",
      "customer": "chet",
      "steps": [
        {
          "say": "chet",
          "text": [
            "Chet Amaral. Coast Guard, thirty-one years, radioman. Retired. My wife says the house can't take one more radio.",
            "This was the base set at the old station. Works fine. Mostly. It's yours for thirty."
          ]
        },
        {
          "offer": { "unique": "vhfRadio" },
          "persona": "honest",
          "asking": 30,
          "min": 20,
          "onWatch": "continue"
        },
        { "if": "offer == 'watch'", "then": [{ "set": { "radioOut": true } }, { "end": true }] },
        {
          "if": "offer != 'deal'",
          "then": [{ "set": { "radioRefused": true } }, { "leave": "chet" }, { "end": true }]
        },
        { "say": "chet", "text": "If it... says anything, at night. Don't mind it. It's just the channel." },
        { "leave": "chet" },
        { "view": { "timeOfDay": 0.85 } },
        {
          "narrate": [
            "You're turning the sign to CLOSED when the radio on the shelf, switched off and unplugged, crackles.",
            "\"Margaret Ruth. Margaret Ruth. Margaret Ruth.\"\n\nThen nothing at all."
          ]
        },
        { "set": { "radioHeard": true } }
      ]
    },
    "chetBack": {
      "title": "Chet comes back about the radio",
      "customer": "chet",
      "steps": [
        {
          "say": "chet",
          "text": [
            "Is it doing it? It is, isn't it. It did it in my kitchen for a month.",
            "The Margaret Ruth was a scalloper. Royce Kittredge's boat. She went down off Gannet Island in October '91. Flat calm, and all hands.",
            "I was on watch. There was no mayday. Just her name, three times. Same as you're hearing.",
            "It's not the radio. Something is transmitting. Nobody believes a retired radioman, but Tess Bascombe might. She's harbormaster now. She'd pull the old file for us after hours."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll come.\"",
              "then": [
                { "set": { "radioShack": true } },
                { "say": "chet", "text": "Good. This week, after dark. The shack at the end of the town pier. Bring a thermos. Tess's coffee is a crime." },
                { "toast": "Calendar: the harbormaster's shack, this week", "look": "chet" }
              ]
            },
            {
              "label": "Give the radio back to Chet",
              "hint": "(he refunds $20)",
              "then": [
                { "set": { "radioOut": true } },
                { "find": "radio", "in": "stock", "match": { "uniqueId": "vhfRadio" } },
                { "take": "radio" },
                { "refresh": "panel" },
                { "coin": 20, "why": "Chet took his radio back" },
                { "say": "chet", "text": "Fair enough. I'll put it back in the garage. My wife will be thrilled." }
              ]
            },
            {
              "label": "\"It's not my business, Chet.\"",
              "then": [
                { "say": "chet", "text": "No. No, I suppose it isn't. It wasn't mine either, for thirty-four years." }
              ]
            }
          ]
        },
        { "leave": "chet" }
      ]
    },
    "radioShack": {
      "title": "Chet and the 1991 file",
      "steps": [
        {
          "stage": "harbormasterNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [108, 164] },
            { "id": "chet", "cast": "chet", "at": [140, 162] },
            { "id": "tess", "cast": "tess", "at": [216, 160], "facingLeft": true }
          ]
        },
        { "narrate": "The harbormaster's shack, after hours. Charts, radios, filing cabinets back to 1970, and a coffee maker that has never once been switched off." },
        { "say": "tess", "text": "Tess Bascombe. Chet says you've got his ghost. Here. October 1991. I was a deckhand on the next boat over." },
        { "narrate": "The file is thin. Lost in flat calm, eleven miles out. No wreckage but one life ring, which washed up on Gannet Island. No bodies. The insurance paid Royce's widow in full." },
        { "say": "tess", "text": "Royce had loans with half the waterfront. Gilded Hand Finance had the boat. Then the boat was gone, and the debt went with it." },
        {
          "if": "quest.fog",
          "note": "Crossing: The Fog Week.",
          "then": [
            {
              "say": "tess",
              "text": [
                "Something else. Every Fog Week the drowned come up the harbor, you've heard the stories. I've seen them. Every crew that ever went down.",
                "Every crew but one. Nobody from the Margaret Ruth has ever walked up that pier. Not once."
              ]
            },
            { "say": "chet", "text": "Because nobody drowned." }
          ]
        },
        { "say": "chet", "text": "Eleven-forty. Here it comes." },
        { "narrate": "The big set on the shelf crackles: \"Margaret Ruth. Margaret Ruth. Margaret Ruth.\" Chet swings an old direction-finder on its stand, twice, and the needle settles." },
        { "say": "chet", "text": "Two-one-five degrees. Four miles. That's Gannet Island. Nobody's lived on Gannet since the school shut." },
        { "say": "tess", "text": "Somebody does." },
        {
          "if": "shelf.free",
          "then": [
            { "say": "tess", "text": "Take this. It's been in my lost-and-found since '91. Dory never wanted to see it. Maybe one day she will." },
            { "add": { "unique": "ruthRing" } },
            { "refresh": "panel" }
          ]
        },
        { "say": "chet", "text": "Evening ferry, next week. I'm too old for the island, so you're going. You're the one it's calling at closing." },
        { "set": { "radioBearing": true } },
        { "toast": "Calendar: Gannet Island, by the evening ferry, next week", "look": "chet" }
      ]
    },
    "radioIsland": {
      "title": "Gannet Island: following the signal",
      "steps": [
        { "stage": "gannet", "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [150, 166] }] },
        { "narrate": "Gannet Island, off the evening ferry. Past the shut schoolhouse, behind the pines: a tar-paper shack, a garden in rows, and a radio mast made of fishing rods lashed end to end." },
        { "narrate": "Two sets of small sneaker prints go up to the door and straight back again.", "if": "flag.twinsSawMast", "note": "Crossing: The Twins' Map." },
        {
          "enter": {
            "id": "royce",
            "cast": "royce",
            "name": "An old man in the garden",
            "at": [236, 160],
            "facingLeft": true
          }
        },
        { "say": "royce", "text": "You've come about the radio. You've got the shop on the high street. Odile's place. I listen to the harbor channel. I know everybody." },
        { "edit": "royce", "set": { "name": "Royce Kittredge" }, "note": "Now he says who he is." },
        { "say": "royce", "text": "Royce Kittredge. Skipper of the Margaret Ruth, lost with all hands. I was all hands. There was only ever me aboard that night." },
        {
          "choose": [
            {
              "label": "\"Why?\"",
              "then": [
                { "say": "royce", "text": "Because I owed the Hand more than the boat was worth, and the house was in the loan too. A drowned man's debts die with him. His wife keeps the house." }
              ]
            },
            {
              "label": "\"Your daughter thinks you're dead.\"",
              "then": [
                { "say": "royce", "text": "I know. That was the price. Her mother had the house and Dory had a roof over her, and I had this." }
              ]
            }
          ]
        },
        {
          "say": "royce",
          "text": [
            "I opened the seacocks in flat calm and rowed here in the dinghy. I meant to stay one winter. Thirty-four years, now.",
            "Every night at the hour the fish market closes, I call my boat. So that Dory would know, somewhere, that I was out here. I never thought anyone would actually hear it."
          ]
        },
        { "narrate": "He gives you a logbook, salt-stained, with a last entry dated 14 October 1991. Every page after it is blank, and dated." },
        { "add": { "unique": "ruthLog" } },
        { "refresh": "panel" },
        { "say": "royce", "text": "The first ferry off this island is at six. I've been not getting on it for thirty-four years. You decide who's waiting at the landing. I'll be on it." },
        { "set": { "radioIsland": true } },
        { "toast": "Calendar: the first ferry, at the town landing", "look": "royce" }
      ]
    },
    "radioLanding": {
      "title": "The first ferry",
      "steps": [
        {
          "stage": "ferryLanding",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [120, 164] }]
        },
        { "narrate": "The town landing, before dawn. The streetlamp is still on. Out on the water, the first ferry from Gannet Island is a white speck getting slowly bigger." },
        {
          "choose": [
            { "label": "Bring Dory Kittredge to meet the boat" },
            { "label": "Bring Captain Barrow", "hint": "(heat -10, a $50 reward)" },
            { "label": "Nobody. Keep his secret, and give Chet back the radio" }
          ],
          "as": "who"
        },
        { "enter": { "id": "royce", "cast": "royce", "at": [330, 160], "facingLeft": true } },
        {
          "if": "who == 0",
          "then": [
            { "enter": { "id": "dory", "cast": "dory", "at": [160, 162] } },
            { "say": "dory", "text": "You said it was about Dad's boat. You said to come early. I run a fish market. I'm always up early. Why are we..." },
            { "walk": "royce", "to": [220, 162] },
            { "narrate": "Royce comes down the gangway with a duffel bag and a paper bag of tomatoes, and stops. Dory puts down the crate she's holding." },
            { "say": "dory", "text": "You're late." },
            { "say": "royce", "text": "I know, love." },
            { "find": "ring", "in": "stock", "match": { "uniqueId": "ruthRing" } },
            {
              "if": "ring",
              "then": [
                {
                  "choose": [
                    {
                      "label": "Give Dory the Margaret Ruth's life ring",
                      "then": [
                        { "take": "ring" },
                        { "refresh": "panel" },
                        { "rep": 2 },
                        { "say": "dory", "text": "It hung in the harbormaster's for thirty years. I used to cross the street." }
                      ]
                    },
                    { "label": "Keep it on your shelf" }
                  ]
                }
              ]
            },
            { "rep": 10, "why": "Brought Royce Kittredge home" },
            { "set": { "radioEnd": "homecoming" } },
            { "narrate": "Barrow hears by lunchtime. There is talk of a fraud charge. The file goes into a drawer, and the drawer is never opened again." }
          ]
        },
        {
          "if": "who == 1",
          "then": [
            { "enter": { "id": "barrow", "cast": "barrow", "at": [160, 162] } },
            { "walk": "royce", "to": [240, 162] },
            { "say": "barrow", "text": "Royce Kittredge. I was nine when they read your name out in church." },
            { "say": "royce", "text": "I heard. I was listening." },
            { "say": "barrow", "text": "You'll have a lawyer. And the insurance company will have a great many questions. Thank you, keeper. The department doesn't forget a good citizen." },
            { "heat": -10 },
            { "coin": 50, "why": "Police reward for the Margaret Ruth case" },
            { "set": { "radioEnd": "court" } },
            { "narrate": "By noon the whole waterfront knows. Dory reads it in the paper, at the fish market, between customers." }
          ]
        },
        {
          "if": "who == 2",
          "then": [
            { "narrate": "The ferry comes in. Royce doesn't get off. He stands at the rail and lifts one hand to you, and goes back with the boat." },
            { "remove": "royce" },
            { "enter": { "id": "chet", "cast": "chet", "at": [170, 162] } },
            { "find": "radio", "in": "stock", "match": { "uniqueId": "vhfRadio" } },
            { "take": "radio" },
            { "refresh": "panel" },
            { "say": "chet", "text": "So you're giving it back. Then I won't ask. Thirty-four years I've not asked about that boat. I can do a few more." },
            { "set": { "radioEnd": "silence" } }
          ]
        },
        { "set": { "radioDone": true } }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "chet", "scene": "chetRadio", "last": true },
    { "at": "2-1", "cast": "chet", "scene": "chetBack", "if": "flag.radioHeard && !flag.radioOut && hook.radioHere" }
  ],
  "nights": [
    {
      "id": "radio-shack",
      "window": ["2-2", "2-4"],
      "if": "flag.radioShack",
      "scene": "radioShack",
      "test": [{ "set": { "radioShack": true } }]
    },
    {
      "id": "radio-island",
      "window": ["3-1", "3-3"],
      "if": "flag.radioBearing",
      "scene": "radioIsland",
      "test": [{ "set": { "radioBearing": true } }]
    },
    {
      "id": "radio-landing",
      "window": ["3-4", "4-4"],
      "if": "flag.radioIsland",
      "scene": "radioLanding",
      "test": [
        { "set": { "radioIsland": true } },
        { "add": { "unique": "vhfRadio" } },
        { "add": { "unique": "ruthRing" } }
      ]
    }
  ],
  "calendar": [
    { "id": "radio-shack", "night": "radio-shack", "story": "radio", "where": "The harbormaster's shack", "title": "Chet and the 1991 file", "known": "flag.radioShack", "scene": "radioShack" },
    { "id": "radio-island", "night": "radio-island", "story": "radio", "where": "Gannet Island", "title": "Following the signal", "known": "flag.radioBearing", "scene": "radioIsland" },
    { "id": "radio-landing", "night": "radio-landing", "story": "radio", "where": "The ferry landing", "title": "The first ferry", "known": "flag.radioIsland", "scene": "radioLanding" }
  ],
  "mornings": [
    { "toast": "At closing last night the radio said it again: \"Margaret Ruth.\"", "icon": "radio", "if": "flag.radioHeard && !flag.radioDone && hook.radioHere && day > 1", "note": "It calls every night at closing; the morning after, you remember it did." },
    {
      "if": "hook.buyerBack",
      "note": "Sell it, and the buyer brings it back the next morning (once).",
      "then": [
        { "hook": "buyerEnters", "sets": ["buyer"] },
        {
          "say": "buyer",
          "text": [
            "...It said a name. All night. Not loud. Just, every time I nearly fell asleep.",
            "I don't want my money back. I don't want anything. Here."
          ]
        },
        { "hook": "radioBack" },
        { "toast": "The radio is back on your shelf. Nobody else will take it now.", "icon": "radio" },
        { "hook": "buyerLeaves" }
      ]
    }
  ],
  "sold": { "vhfRadio": [{ "hook": "buyerKeeps", "if": "!flag.radioDone && !flag.radioReturned" }] },
  "epilogue": [
    { "line": "Royce Kittredge works the counter at his daughter's fish market. He is terrible at it. Dory lets him.", "if": "flag.radioEnd == 'homecoming'" },
    { "line": "Royce Kittredge got two years, suspended. The insurance company is still writing letters.", "if": "flag.radioEnd == 'court'" },
    { "line": "Channel 16 is quiet at closing now. Some nights, out past the breakwater, a light on Gannet Island blinks three times.", "if": "flag.radioEnd == 'silence'" }
  ],
  "outcome": [
    { "if": "flag.radioEnd == 'homecoming'", "ending": "homecoming" },
    { "if": "flag.radioEnd == 'court'", "ending": "court" },
    { "if": "flag.radioEnd == 'silence'", "ending": "silence" },
    { "if": "flag.radioEnd == 'returned' || flag.radioOut", "ending": "returned" }
  ]
});
