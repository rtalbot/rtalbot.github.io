// Pawn Champ - The Museum Job: the main story's stolen crown, told as a heist you can join, spoil or
// watch. Major quest M7, batch D (docs/quests/MAJOR.md#m7-the-museum-job).
//
// Wren's "last job of the season" (the built crown beat) becomes a three-night story here: the gala
// at the Historical Society, the job itself after hours, and the handoff at Pier Nine. If this quest
// is in the run, the built crown beat on week 4 Thursday stands aside for it.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/museum.js.
defineStory({
  "id": "museum",
  "kind": "major",
  "colour": "#c8508a",
  "family": "crime",
  "title": "The Museum Job",
  "crosses": ["hollis"],
  "rumour": "A touring exhibition of stage crowns is coming to the Historical Society. Real stones.",
  "endings": { "getaway": "Clean Getaway", "cuffs": "Wren in Cuffs", "both": "Both Hands Caught", "swap": "The Swap" },
  "outcome": "flag.museumEnd",
  "about": [
    "A heist story. Dr. Henrietta Lusk tests the town's dealers with a paste tiara (§{luskTiara}): buy it and you're out $70 and a little reputation, look closely and she trusts you. She invites you to the gala opening of her touring exhibition of stage crowns at the Historical Society. If you fence for Wren, she tips you off that she has her eye on it (§{wrenJobHint}).",
    "At the gala (§{museumGala}) Wren is working as a waitress, watching the alarm panel. You can be her lookout, propose swapping a fake of yours into the case, warn Dr. Lusk, call Captain Barrow, or just eat the canapes. If you warn Lusk or do nothing, the papers report how it went.",
    "On the night of the job (§{museumJob}) Barrow's stakeout catches Wren (Wren in Cuffs); the swap goes off clean; or, as lookout, a car slows down and you need something to whistle with, or Wren gets caught. If it worked, the handoff is at Pier Nine to Ms. Vantreece of Gilded Hand Finance, on the Hand's barge (§{museumHandoff}). Take your cut (Clean Getaway or The Swap), take a photo of her holding the crown as proof against the Hand, or text Barrow and get both of them (Both Hands Caught)."
  ],
  "cast": {
    "lusk": {
      "name": "Dr. Henrietta Lusk",
      "look": { "skin": "#d8a888", "hair": "#7a7a80", "hs": 3, "coat": "#5a1a3a", "trim": "#c8a050", "style": "jacket", "long": true, "pants": "#2a2028", "glasses": "#c8a050", "bag": "#2a2028" }
    }
  },
  "icons": {
    "tiara": [
      "............",
      "............",
      ".k..k..k..k.",
      ".kBkkRkkBk..",
      ".kSkSkSkSk..",
      "kSsSsSsSsSk.",
      "ksBsRsBsRsk.",
      "kssssssssssk",
      ".kkkkkkkkkk.",
      "............",
      "............",
      "............"
    ]
  },
  "uniques": {
    "pasteTiara": {
      "name": "Paste tiara",
      "icon": "tiara",
      "cat": "jewelry",
      "guide": 120,
      "fake": true,
      "tells": [
        "Every stone has a silver foil backing: glass, dressed up.",
        "The \"platinum\" is a rhodium wash over brass. It is crown-sized, though."
      ]
    },
    "lockpicks": {
      "name": "Wren's lockpick roll",
      "icon": "purse",
      "cat": "curio",
      "guide": 40,
      "tells": [
        "A rolled leather case of picks and tension wrenches, each one filed by hand.",
        "Stitched inside the flap: \"for emergencies and museums. W.\""
      ]
    }
  },
  "scenes": {
    "wrenJobHint": {
      "title": "Wren tips off her fence about a job",
      "customer": "wren",
      "steps": [
        {
          "say": "wren",
          "text": [
            "Don't look so worried. I'm only browsing. Partner.",
            "Keep a night free later in the month. There's a job coming in the fall. A big one. The kind you tell your grandkids about, if you're the sort who has grandkids.",
            "The Historical Society is getting a box of crowns. Real ones. Well. Real stones, on stage crowns. Close enough."
          ]
        },
        { "set": { "museumHint": true } },
        { "leave": "wren" }
      ]
    },
    "luskTiara": {
      "title": "Dr. Lusk tests you with a paste tiara",
      "customer": "lusk",
      "steps": [
        {
          "say": "lusk",
          "text": [
            "Henrietta Lusk. I curate \"Crowns of the Stage\", which opens at the Historical Society next week. Theatrical crowns, mostly. Some of the stones are real.",
            "My late aunt left me this tiara. I'm told it's very fine. What would you give me for it?"
          ]
        },
        {
          "offer": { "unique": "pasteTiara" },
          "as": "tiara",
          "persona": "proud",
          "asking": 90,
          "min": 70,
          "onWatch": "continue"
        },
        {
          "if": "offer == 'deal'",
          "then": [
            {
              "edit": "tiara",
              "set": {
                "inspected": true,
                "knownFake": true,
                "clues": [
                  { "text": "Every stone has a silver foil backing: glass, dressed up.", "cls": "bad" },
                  { "text": "The \"platinum\" is a rhodium wash over brass. It is crown-sized, though.", "cls": "bad" }
                ]
              }
            },
            { "rep": -2 },
            { "set": { "luskFooled": true } },
            {
              "say": "lusk",
              "text": [
                "Thank you. That's {tiara.paid|money} for foil and glass. You're the third dealer on Front Street to buy it.",
                "Keep it. Consider it tuition. The exhibition will show you what the real thing looks like."
              ]
            }
          ],
          "else": [
            {
              "if": "tiara.inspected",
              "then": [
                { "rep": 2 },
                { "set": { "luskTrust": true } },
                { "say": "lusk", "text": "You looked. Most people don't. Yes, it's paste. My test, I'm afraid. I like to know which dealers in a town can tell." }
              ],
              "else": [
                { "say": "lusk", "text": "You didn't even look at it. Lucky, or careful? It's paste. A test. I like to know who in town can tell." }
              ]
            }
          ]
        },
        { "say": "lusk", "text": "The opening is a little gala. Canapes, a string trio, the Lantern Queen's crown under glass. I have two invitations left over." },
        {
          "choose": [
            {
              "label": "\"I'd love to come.\"",
              "then": [
                { "set": { "museumInvite": true } },
                { "say": "lusk", "text": "Wonderful. Black tie optional. Very optional, in this town." },
                { "toast": "Calendar: the gala at the Historical Society", "look": "lusk" }
              ]
            },
            {
              "label": "\"Galas aren't really my scene.\"",
              "then": [
                { "set": { "museumDeclined": true } },
                { "say": "lusk", "text": "Pity. The canapes are the best thing about these. Good day." }
              ]
            }
          ]
        },
        { "leave": "lusk" }
      ]
    },
    "museumGala": {
      "title": "The gala at the Historical Society",
      "music": "night",
      "steps": [
        {
          "stage": "historicalGala",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [92, 164] },
            { "id": "lusk", "cast": "lusk", "at": [150, 160], "facingLeft": true },
            {
              "id": "wren",
              "cast": "wren",
              "name": "A waitress",
              "outfit": { "style": "vest", "coat": "#f0f0ea", "vest": "#1a1a1e", "pants": "#1a1a1e" },
              "at": [250, 156],
              "facingLeft": true,
              "if": "!flag.wrenGone && !flag.toldOnWren"
            },
            { "id": "guest1", "look": "random", "name": "A guest", "at": [60, 140] },
            { "id": "guest2", "look": "random", "name": "A guest", "at": [84, 138] },
            { "id": "guest3", "look": "random", "name": "A guest", "at": [108, 140], "facingLeft": true }
          ]
        },
        { "narrate": "The Historical Society, Front Street. A string trio saws gamely through something by Vivaldi. Under glass in the middle of the parlor sits the Lantern Queen's crown: five points, gold leaf over brass, and five stones that are not glass at all." },
        { "say": "lusk", "text": "Isn't she lovely? Made for a touring \"Lantern Queen\" in 1911. The company went bust and the leading lady kept the crown. The stones were her own." },
        {
          "if": "!wren",
          "then": [
            { "narrate": "You eat four crab cakes and a thing on a spoon. Nobody tries to steal anything. Dr. Lusk shows you the difference between paste and sapphire under her own loupe until you can see it with your eyes shut." },
            { "rep": 2 },
            { "set": { "museumQuiet": true } },
            { "end": true }
          ]
        },
        {
          "if": "flag.fence",
          "then": [
            {
              "say": "wren",
              "text": [
                "Canape? Don't look at me like that. Look at the alarm panel by the hall door. Then look at the guard. He walks the house every forty minutes and stops for a cigarette at the back.",
                "Write down what you see. That's all. Partner."
              ]
            },
            { "hook": "swapPiece", "sets": ["swap"] },
            {
              "choose": [
                {
                  "label": "Note the panel and the guard's rounds for her",
                  "hint": "(be her lookout)",
                  "then": [{ "set": { "museumRole": "lookout" } }]
                },
                { "label": "Tell Dr. Lusk, quietly", "then": [{ "set": { "museumRole": "warned" } }] },
                {
                  "label": "Step outside and call Captain Barrow",
                  "hint": "(heat -10)",
                  "then": [{ "set": { "museumRole": "barrow" } }]
                },
                {
                  "label": "Propose a swap: your fake goes in the case",
                  "hint": { "if": "swap", "then": "({swap.name})", "else": "(needs a fake piece in stock)" },
                  "disabled": "!swap",
                  "then": [{ "set": { "museumRole": "swap" } }]
                },
                { "label": "Just eat the canapes", "then": [{ "set": { "museumRole": "none" } }] }
              ]
            }
          ],
          "else": [
            { "narrate": "One of the waitresses has red hair and a silver tooth. She spends more time looking at the alarm panel by the hall door than at her tray." },
            {
              "choose": [
                { "label": "Tell Dr. Lusk, quietly", "then": [{ "set": { "museumRole": "warned" } }] },
                {
                  "label": "Step outside and call Captain Barrow",
                  "hint": "(heat -10)",
                  "then": [{ "set": { "museumRole": "barrow" } }]
                },
                {
                  "label": "Mind your own business and eat the canapes",
                  "then": [{ "set": { "museumRole": "none" } }]
                }
              ]
            }
          ]
        },
        { "say": "wren", "text": "Forty minutes, cigarette at the back, code panel on a four-second delay. You're a natural. I'll find you.", "if": "flag.museumRole == 'lookout'" },
        { "say": "wren", "text": "Ooh. They'd never know. Not for a week, anyway, and by then it's moved on to Providence. I like the way you think.", "if": "flag.museumRole == 'swap'" },
        { "say": "lusk", "text": "The waitress? Hm. I'll have the codes changed tonight and put a second man on the door. Thank you. Say nothing to anyone.", "if": "flag.museumRole == 'warned'" },
        {
          "if": "flag.museumRole == 'barrow'",
          "then": [
            { "heat": -10 },
            { "narrate": "You call from the porch. Captain Barrow listens, then says only: \"Don't do anything. I mean it. Go home.\" You can hear her smiling." }
          ]
        },
        { "narrate": "You eat six crab cakes. If anything is about to happen, it can happen without you.", "if": "flag.museumRole == 'none'" }
      ]
    },
    "museumJob": {
      "title": "The job, after hours (lookout, swap, or with Barrow)",
      "music": "caper",
      "steps": [
        {
          "stage": "historicalNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [70, 166] },
            { "id": "barrow", "cast": "barrow", "at": [100, 164], "if": "flag.museumRole == 'barrow'" },
            {
              "id": "wren",
              "cast": "wren",
              "name": "Wren",
              "at": [190, 160],
              "facingLeft": true,
              "if": "flag.museumRole != 'barrow'"
            }
          ]
        },
        {
          "if": "flag.museumRole == 'barrow'",
          "then": [
            { "narrate": "An unmarked car across Front Street from the Historical Society. Captain Barrow eats sunflower seeds one at a time and spits the shells into a coffee cup. You have been here three hours." },
            { "say": "barrow", "text": "She'll come. They always come. People who steal crowns can't help themselves." },
            {
              "enter": { "id": "wren", "cast": "wren", "name": "Wren", "at": [300, 152], "facingLeft": true }
            },
            { "walk": "wren", "to": [230, 154] },
            { "narrate": "At ten past two a figure in a dark hoodie lets herself in at the back. At fourteen minutes past, she comes out with a pillowcase, straight into Barrow's flashlight." },
            { "say": "wren", "text": "Oh, you have GOT to be kidding me." },
            { "say": "barrow", "text": "Evening, Wren. Nice pillowcase." },
            { "set": { "museumEnd": "cuffs", "wrenGone": true, "wrenArrested": true } },
            { "rep": 3 },
            { "end": true }
          ]
        },
        { "narrate": "Two in the morning. Moonlight on the wallpaper, the alarm panel's little red eye, and Wren with a pillowcase and a borrowed key." },
        {
          "if": "flag.museumRole == 'swap'",
          "then": [
            { "hook": "swapPiece", "sets": ["swap"] },
            { "take": "swap" },
            { "refresh": "panel" },
            { "say": "wren", "text": "Four-second delay. Glass off. Your tiara in, my crown out. Glass back on. Nobody looks closely at a crown under glass, and the ones who do are on a bus to Providence on Monday." },
            { "narrate": "The {swap.name|lower|or:fake} sits on the velvet where the Lantern Queen's crown was. In the moonlight, from the doorway, you honestly can't tell." },
            { "set": { "museumSwapped": true, "museumHandoff": true } },
            { "say": "wren", "text": "Pier Nine, later this week. My buyer wants to meet the brains. That's you. Don't tell anyone I said that." },
            { "toast": "Calendar: the handoff at Pier Nine", "look": "wren" },
            { "end": true }
          ]
        },
        { "say": "wren", "text": "Watch the street. If a car slows down, whistle. You can whistle? Everyone says they can whistle.", "note": "lookout: one bad roll and Barrow arrives" },
        { "narrate": "You stand at the window. A cat crosses Front Street. A car comes round the corner from School Street..." },
        { "use": "call", "as": "whistle", "if": "hook.carryingCall", "note": "items in use: something that actually makes a noise" },
        {
          "hook": "caught",
          "sets": ["caught"],
          "note": "a 20% chance, more with police heat, halved if you can whistle"
        },
        {
          "if": "caught && whistle",
          "then": [
            { "hook": "siren" },
            { "narrate": "...slows down. And stops. You blow the {whistle.name|lower} before the blue lights are even on. Wren is out the back door with the crown before the first officer is out of the car." },
            { "say": "wren", "text": "Now THAT is a whistle. Pier Nine. Later. Run." },
            { "set": { "museumCaseEmpty": true, "museumHandoff": true, "museumWhistle": true } },
            { "heat": 10, "why": "Seen running from the Historical Society" },
            { "toast": "Calendar: the handoff at Pier Nine", "look": "wren" },
            { "end": true }
          ]
        },
        {
          "if": "caught",
          "then": [
            { "hook": "siren" },
            { "narrate": "...slows down. And stops. Blue lights. You whistle. It comes out as a sort of hiss." },
            { "say": "wren", "text": "GO. Back door. I'll draw them. Partner." },
            { "narrate": "You run. Wren doesn't. By the time you're home, Captain Barrow has her in the back of a cruiser and the crown back on its velvet. She hasn't said your name. Yet. Barrow knows anyway." },
            { "set": { "museumEnd": "cuffs", "wrenGone": true, "wrenArrested": true } },
            { "heat": 20 }
          ],
          "else": [
            { "narrate": "...and keeps going. In the parlor, glass comes off, the crown goes into a pillowcase, the glass goes back on. Four minutes. Wren doesn't even breathe hard." },
            { "set": { "museumCaseEmpty": true, "museumHandoff": true } },
            { "say": "wren", "text": "Pier Nine, later this week. My buyer pays on delivery. Your cut's waiting." },
            { "toast": "Calendar: the handoff at Pier Nine", "look": "wren" }
          ]
        }
      ]
    },
    "museumHandoff": {
      "title": "The handoff at Pier Nine",
      "music": "caper",
      "steps": [
        {
          "stage": "docks",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 162] },
            { "id": "wren", "cast": "wren", "name": "Wren", "at": [128, 160] },
            { "id": "vantreece", "cast": "vantreece", "at": [236, 154], "facingLeft": true },
            { "id": "merrit", "cast": "merrit", "at": [270, 150], "facingLeft": true }
          ]
        },
        {
          "narrate": { "if": "quest.hollis", "then": "Pier Nine, midnight. A barge with a little gold hand painted on its bow, and stacked on its deck, a row of crates stencilled DESTROYED. Wren's buyer is already waiting.", "else": "Pier Nine, midnight. A barge with a little gold hand painted on its bow. Wren's buyer is already waiting." }
        },
        {
          "say": "vantreece",
          "text": [
            "Odile's heir. Of course. Everyone in this town turns out to be somebody's accomplice eventually.",
            "The crown, please. Gilded Hand Finance has clients in New York who collect theatrical history. Very quietly."
          ]
        },
        { "narrate": "So the Hand doesn't just lend money. It moves things: seized phones that were meant to be crushed, crowns that were meant to be under glass. Same barge, same night.", "if": "quest.hollis" },
        {
          "choose": [
            { "label": "Take your cut", "hint": "(+$150)" },
            { "label": "Take your cut, and a photo of Ms. Vantreece holding the crown", "hint": "(+$150, proof)" },
            { "label": "Text Captain Barrow before anyone opens the box", "hint": "(she gets both of them)" }
          ],
          "as": "i"
        },
        {
          "if": "i < 2",
          "then": [
            { "coin": 150, "why": "Your cut of the crown" },
            { "hook": "fenceDeals", "with": 3 },
            { "heat": 4, "if": "flag.museumSwapped" },
            { "heat": 12, "if": "!flag.museumSwapped" },
            { "set": { "museumEnd": "swap" }, "if": "flag.museumSwapped" },
            { "set": { "museumEnd": "getaway" }, "if": "!flag.museumSwapped" },
            { "say": "wren", "text": "Pleasure doing crime with you, partner. Here. You earned these." },
            {
              "if": "shelf.free",
              "then": [
                { "add": { "unique": "lockpicks" } },
                { "refresh": "panel" },
                { "toast": "Wren gave you her lockpick roll", "icon": "purse" }
              ]
            },
            {
              "if": "i == 1",
              "then": [
                { "set": { "museumPhoto": true } },
                { "use": "photo", "as": "cam", "if": "hook.carryingPhoto", "note": "items in use: a proper camera, not a phone in a pocket" },
                {
                  "if": "cam",
                  "then": [
                    { "set": { "museumSharpPhoto": true } },
                    { "narrate": "While Merrit Gaunt counts out the money, you lift the {cam.name|lower} for one frame. Ms. Vantreece, the crown and the gold hand on the bow, sharp as a court exhibit." }
                  ],
                  "else": [
                    { "narrate": "While Merrit Gaunt counts out the money, you take one photo with your phone in your pocket, lens up. Ms. Vantreece, the crown and the gold hand on the bow, all in focus. Mostly." }
                  ]
                },
                {
                  "if": "!flag.ledger",
                  "then": [
                    { "set": { "ledger": true } },
                    { "toast": "The photo is a second copy of Odile's proof", "icon": "camera" }
                  ]
                },
                {
                  "if": "flag.museumSharpPhoto && !(quest.hollis && flag.hollisFriend && !flag.hollisBetrayed)",
                  "then": [
                    { "heat": -5 },
                    { "narrate": "A print goes to the police station in a plain envelope. Captain Barrow pins it to her board and stops looking at you quite so hard." }
                  ]
                },
                {
                  "if": "quest.hollis && flag.hollisFriend && !flag.hollisBetrayed",
                  "then": [
                    { "set": { "museumHollisCase": true } },
                    { "hook": "debt", "with": 0.7, "if": "flag.museumSharpPhoto", "note": "the Hand's last instalment shrinks" },
                    { "hook": "debt", "with": 0.75, "if": "!flag.museumSharpPhoto" },
                    { "narrate": "You send it to Agathe Moss before you've even left the pier. Her tally sheet and your photo of the same barge make one case. By Friday the Hand's lawyers are very busy, and in no mood to chase small debts." }
                  ]
                }
              ]
            }
          ],
          "else": [
            {
              "set": { "museumEnd": "both", "wrenGone": true, "wrenArrested": true, "museumCaseEmpty": false }
            },
            { "heat": -15 },
            { "rep": 6 },
            { "hook": "debt", "with": 0.5 },
            { "hook": "siren" },
            { "narrate": "Barrow's cruisers come down Pier Nine with their lights off. Wren sees them first and laughs, which is worse. Ms. Vantreece is still holding the crown when the cuffs go on." },
            { "say": "wren", "text": "You. Of all people. ...Fair enough, partner. I'd have done the same." },
            { "say": "vantreece", "text": "Merrit. Call the lawyers. All of them." }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-3", "cast": "wren", "scene": "wrenJobHint", "if": "flag.fence && !flag.wrenGone && !flag.toldOnWren", "note": "if you're her fence" },
    { "drift": "museum-lusk", "from": "1-4", "to": "2-2", "cast": "lusk", "scene": "luskTiara" }
  ],
  "nights": [
    {
      "id": "museum-gala",
      "window": ["2-3", "3-2"],
      "if": "flag.museumInvite",
      "scene": "museumGala",
      "test": [
        { "hook": "galaTest", "note": "invited; Wren's fence seven times in ten; a paste tiara six times in ten" }
      ]
    },
    {
      "id": "museum-job",
      "window": ["3-1", "4-1"],
      "if": "(flag.museumRole == 'lookout' || flag.museumRole == 'swap' || flag.museumRole == 'barrow') && !flag.museumEnd && !flag.wrenGone",
      "scene": "museumJob",
      "test": [
        { "roll": { "museumRole": ["lookout", "swap", "barrow"] } },
        { "add": { "unique": "pasteTiara" } }
      ]
    },
    {
      "id": "museum-handoff",
      "window": ["4-1", "4-4"],
      "if": "flag.museumHandoff && !flag.wrenGone && flag.museumEnd != 'cuffs' && flag.museumEnd != 'both'",
      "scene": "museumHandoff",
      "test": [
        { "set": { "museumHandoff": true } },
        { "roll": { "museumSwapped": [true, false] } },
        { "set": { "hollisFriend": true } }
      ]
    }
  ],
  "calendar": [
    { "id": "museum-gala", "night": "museum-gala", "story": "museum", "where": "The Historical Society", "title": "The gala", "known": "flag.museumInvite", "scene": "museumGala" },
    {
      "id": "museum-job",
      "night": "museum-job",
      "story": "museum",
      "where": "The Historical Society",
      "title": "The job",
      "known": "(flag.museumRole == 'lookout' || flag.museumRole == 'swap' || flag.museumRole == 'barrow') && (!flag.wrenGone || seen.museum-job)",
      "scene": "museumJob",
      "bring": { "if": "flag.museumRole == 'lookout'", "then": ["call"] }
    },
    {
      "id": "museum-handoff",
      "night": "museum-handoff",
      "story": "museum",
      "where": "Pier Nine",
      "title": "The handoff",
      "known": "flag.museumHandoff",
      "scene": "museumHandoff",
      "bring": ["photo"]
    }
  ],
  "mornings": [
    {
      "if": "(flag.museumRole == 'warned' || flag.museumRole == 'none') && !flag.museumEnd && !flag.museumNews && hook.jobPast",
      "note": "you warned Lusk or stayed out of it: the job happens without you, and you read about it",
      "then": [
        { "set": { "museumNews": true } },
        {
          "if": "!flag.wrenGone && flag.museumRole == 'warned'",
          "then": [
            { "set": { "museumEnd": "cuffs", "wrenGone": true, "wrenArrested": true } },
            { "rep": 4 },
            { "toast": "The Gazette: \"Would-be crown thief caught by Historical Society guard.\" Dr. Lusk sends a thank-you card.", "look": "lusk" }
          ]
        },
        {
          "if": "!flag.wrenGone && flag.museumRole == 'none'",
          "then": [
            { "set": { "museumEnd": "getaway", "museumCaseEmpty": true } },
            { "toast": "The Gazette: \"Lantern Queen's crown stolen from Historical Society. No suspects.\" You know one.", "look": "wren" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "\"Crowns of the Stage\" moved on to Providence with a paste tiara in its center case. Nobody noticed for a week. Dr. Lusk still hasn't worked out when it happened.", "if": "flag.museumEnd == 'swap'" },
    { "line": "The Lantern Queen's crown is somewhere in New York, in a collection that doesn't officially exist.", "if": "flag.museumEnd == 'getaway'" },
    { "line": "Ms. Vantreece made bail in an hour, but the photographs of her holding a stolen crown on a Gilded Hand barge made every paper in the state.", "if": "flag.museumEnd == 'both'" },
    { "line": "The Lantern Queen's crown went back under glass. Dr. Lusk sends a postcard from every town on the tour.", "if": "flag.museumEnd == 'cuffs' && flag.museumRole != 'lookout'" },
    { "line": "Agathe Moss pinned your photo of the barge next to her tally sheet. \"One case,\" she says. \"Finally.\"", "if": "flag.museumHollisCase" }
  ]
});
