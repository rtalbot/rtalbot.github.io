// Pawn Champ - The Fog Week (M3), as data: Hollow Neck's annual haunting, when the drowned come back
// to settle their affairs. Loaded by defineStory() in js/storydata.js; the code it needs is in
// js/quests/fog.js. Format: docs/STORY_DATA.md. Keep it strict JSON inside the call.
defineStory({
  "id": "fog",
  "kind": "major",
  "colour": "#9ad0e0",
  "family": "uncanny",
  "title": "The Fog Week",
  "months": [1],
  "crosses": ["grey", "radio", "selectmen"],
  "rumour": "Once a year the fog brings Hollow Neck's drowned home to settle their affairs.",
  "endings": { "compass": "Compass Returned", "fairDeal": "Fair Prices for the Dead", "tycoon": "Ghost Market Tycoon", "allAshore": "All Ashore", "lastDance": "Last Dance", "lodger": "Lodger" },
  "outcome": [
    { "if": "flag.ghostFakes", "ending": "tycoon" },
    { "if": "flag.ballBell", "ending": "allAshore" },
    { "if": "flag.ballDance", "ending": "lastDance" },
    { "if": "flag.ghostFair", "ending": "fairDeal" },
    { "if": "flag.mottHappy", "ending": "compass" },
    { "if": "flag.haunted", "ending": "lodger" }
  ],
  "about": [
    "Once a year the Fog rolls in for three days (week 3, Monday to Wednesday) and Hollow Neck's drowned come home to settle their affairs. The town treats it as a civic event, with a harbormaster's clipboard and a sign at the bakery. The dead come to the counter like any other customers: comic, polite, a little sad, and mostly broke.",
    "The spine is Captain Mott's compass. He pawned it at the Crooked Scale in 1722 and wants it back by the ghost market, Wednesday at midnight (§{mottArrives}). The next day a net-mender sells you an old compass from his grandad's sea chest without knowing what it is (§{compassSeller}). Buy it and keep it, and at the market Mott pays $100 and brings friends who will buy anything off you (§{fogMarket}). Miss it or sell it, and Mott moves into your wall clock for the rest of the month.",
    "Around the spine, the other dead each bring a small kindness or a small bargain. Tess asks for help checking in the dead off the last ferry (§{tessFerry}, §{fogFerry}); Hosea sells his ditty bag and asks you to post a letter to his mother (§{hoseaBag}); Temperance pays in doubloons that turn to sea glass at dawn, so spend them at the market (§{temperanceBuys}, §{spendDoubloons}); Peleg brings the hand of Mott's figurehead (§{silasHand}); and Widow Ashgrove browses and invites you to the Drowned Ball (§{ashgrove}).",
    "Wednesday night is the climax, in two parts. At nine, the Drowned Ball (§{drownedBall}): mend the dead fiddler's string, then choose between ringing a bell to call Mott's lost crew home and dancing with Widow Ashgrove, and last, decide whether an old widower follows his dead wife out into the Fog. At midnight, the ghost market (§{fogMarket}): with the compass in hand, you choose what to sell the dead, who can't tell real from fake.",
    "The ending names the best (or worst) thing you did, in this order: selling the dead your fakes (Ghost Market Tycoon), calling the crew home (All Ashore), the dance (Last Dance), fair prices for genuine goods (Fair Prices for the Dead), simply returning the compass (Compass Returned), or Mott moving in (Lodger). The bell and the dance also leave a gift on your step on Thursday morning.",
    "If The Gentleman in Grey is in the run and you've signed his contract, a dead former keeper of the shop, Abner Crooke, finds you at the market and tells you how to get out of it."
  ],
  "notes": "M3 in docs/quests/MAJOR.md. months [1]: the Fog only comes in autumn, so a stay never draws it after October (docs/SEASONS.md). Ghost goods: docs/quests/ITEMS.md section C.",
  "cast": {
    "mott": {
      "name": "Captain Mott (deceased)",
      "look": { "skin": "#bcd8e8", "hair": "#dfefff", "hs": 1, "coat": "#4a6a8a", "trim": "#dfefff", "hat": "wide", "hatc": "#3a5a7a", "band": "#8ab8e0", "beard": "#dfefff", "long": true, "pants": "#3a5070", "eye": "#8af0ff" }
    },
    "ashgrove": {
      "name": "Widow Ashgrove (deceased)",
      "look": { "skin": "#c8dce8", "hair": "#e8f0f8", "hs": 3, "coat": "#6a7a9a", "trim": "#dfefff", "robe": true, "hat": "bonnet", "hatc": "#5a6a8a", "eye": "#8af0ff" }
    },
    "seaChest": {
      "name": "Brannock the net-mender",
      "look": { "skin": "#a87050", "hair": "#5a5a5a", "hs": 0, "coat": "#2a4a6a", "style": "puffer", "hat": "beanie", "hatc": "#c84a3a", "beard": "#5a5a5a", "pants": "#3a3a30" }
    },
    "ansel": {
      "name": "Ansel Ames",
      "look": { "skin": "#e8c8b0", "hair": "#e0e0e0", "hs": 0, "coat": "#2a2a3a", "trim": "#e8e0c8", "style": "suit", "pants": "#2a2a3a", "glasses": "#8a8a8a" }
    },
    "hosea": {
      "name": "Hosea Gammon (deceased)",
      "look": { "skin": "#c0d8e8", "hair": "#dfefff", "hs": 2, "coat": "#4a6a8a", "style": "jacket", "hat": "cap", "hatc": "#3a5a7a", "pants": "#3a5070", "beard": "#dfefff", "eye": "#8af0ff", "ghost": true }
    },
    "temperance": {
      "name": "Temperance Wilde (deceased)",
      "look": { "skin": "#c8dce8", "hair": "#e8f0f8", "hs": 3, "coat": "#5a7a9a", "trim": "#dfefff", "style": "dress", "hat": "bonnet", "hatc": "#3a5a7a", "pants": "#3a5070", "eye": "#8af0ff", "ghost": true }
    },
    "peleg": {
      "name": "Peleg Sowle (deceased)",
      "look": { "skin": "#bcd8e8", "hair": "#dfefff", "hs": 0, "coat": "#6a7a9a", "style": "vest", "vest": "#4a5a6a", "pants": "#3a5070", "moustache": "#dfefff", "eye": "#8af0ff", "ghost": true }
    }
  },
  "icons": {
    "dittybag": [
      ".....kk.....",
      "....k..k....",
      "...kkkkkk...",
      "..kPPPPPPk..",
      "..kpkpkpkk..",
      ".kpppppppPk.",
      ".kppPpppppk.",
      "kpppppPpppPk",
      "kppPpppppppk",
      "kpppppppPppk",
      ".kPpppppppk.",
      "..kkkkkkkk.."
    ]
  },
  "uniques": {
    "mottSextant": {
      "name": "The Prudence Gale's sextant",
      "icon": "compass",
      "cat": "curio",
      "guide": 120,
      "tells": [
        "Brass, barnacled, 1720s. Left on your step by the crew of the Prudence Gale, with a note: \"HOME. THANK YE.\""
      ]
    },
    "ashgroveCameo": {
      "name": "Widow Ashgrove's cameo",
      "icon": "brooch",
      "cat": "jewelry",
      "guide": 90,
      "tells": ["Shell cameo in gold, 1930s. Warm, for a moment, when you pick it up."]
    },
    "dittyBag": {
      "name": "A drowned sailor's ditty bag",
      "icon": "dittybag",
      "cat": "curio",
      "guide": 30,
      "tells": [
        "Canvas, tarred, 1850s. Inside: a fid, a sail needle, three knots tied for practice, and a letter never posted."
      ]
    },
    "ghostDoubloons": {
      "name": "Four ghost doubloons",
      "icon": "coins",
      "cat": "curio",
      "guide": 100,
      "nosale": true,
      "tells": ["Spanish gold, cold as the bottom of the harbor. They feel lighter every hour."],
      "ghost": { "name": "Four pieces of sea glass", "guide": 2, "icon": "seaglass" }
    },
    "figureheadHand": {
      "name": "The Prudence Gale's figurehead (a hand)",
      "icon": "statuette",
      "cat": "art",
      "guide": 80,
      "tells": [
        "A carved wooden hand, fist-sized, holding a carved wooden rose. Old gilt. It hums like a ship's hull in a swell."
      ]
    },
    "ashgroveLorgnette": {
      "name": "Widow Ashgrove's lorgnette",
      "icon": "spyglass",
      "cat": "curio",
      "guide": 60,
      "tells": [
        "Tortoiseshell opera glasses on a stick. Through them, the shop is a little more crowded than it is."
      ]
    }
  },
  "scenes": {
    "mottArrives": {
      "title": "Captain Mott comes about a compass",
      "music": "fog",
      "customer": "mott",
      "steps": [
        {
          "say": "mott",
          "text": [
            "Ahoy. Don't scream. It's undignified, and I've had a long century.",
            "Captain Jolyon Mott, drowned 1723. I'm here about a compass.",
            "I pawned it here in 1722 for four doubloons. Lost my bearings ever since. Quite literally. I hit a reef.",
            "It's brass, with a lighthouse stamped on the back. Find it before the Fog lifts on Wednesday night and I'll make it worth your while.",
            "Bring it to the ghost market. Old Burying Ground, up behind the meetinghouse, Wednesday at midnight. Follow the blue lanterns."
          ]
        },
        {
          "choose": [
            {
              "label": "I'll keep an eye out, Captain.",
              "then": [
                { "say": "mott", "text": "Good lad. Or lass. Hard to tell, everything's a bit see-through from where I am. What IS that glowing sign?" }
              ]
            },
            {
              "label": "Your pawn ticket expired about a hundred years ago.",
              "then": [
                { "say": "mott", "text": "Then I shall haunt you on a technicality. Find the compass." }
              ]
            }
          ]
        },
        { "set": { "mott": true } },
        { "toast": "Calendar: the ghost market, Old Burying Ground, Wednesday night", "look": "mott" },
        { "leave": "mott" }
      ]
    },
    "ashgrove": {
      "title": "Widow Ashgrove browses",
      "music": "fog",
      "customer": "ashgrove",
      "steps": [
        {
          "say": "ashgrove",
          "text": [
            "Widow Ashgrove, deceased. Don't mind me. I haven't any money, and I haven't any hands to speak of.",
            "I only want to look at the pretty things. It's been ninety years since I went shopping. What on earth is a \"PlayStation\"?",
            "And will you be at the Drowned Ball tomorrow night? The Grange Hall, nine o'clock. The living are invited. They hardly ever come."
          ]
        },
        { "set": { "ballKnown": true } },
        {
          "choose": [
            {
              "label": "Browse as long as you like, madam",
              "then": [
                { "narrate": "She drifts along your shelves for an hour, sighing happily at everything. On her way out, she tells every ghost in town about the lovely shop." },
                { "rep": 3 },
                { "set": { "ghostFriend": true } }
              ]
            },
            {
              "label": "No loitering. Living or dead.",
              "then": [
                { "say": "ashgrove", "text": "Well! In my day shopkeepers had manners. And bodies, mostly." }
              ]
            }
          ]
        },
        { "leave": "ashgrove" }
      ]
    },
    "compassSeller": {
      "title": "A net-mender sells an old compass",
      "customer": "seaChest",
      "steps": [
        { "say": "seaChest", "text": "Cleared out my grandad's sea chest. Found this old compass at the bottom. Doesn't work, mind. Always points out to sea. Even my phone's compass goes funny near it." },
        {
          "offer": { "item": "compass", "cond": 2, "mark": "a lighthouse stamp", "name": "Old brass compass" },
          "as": "compass",
          "persona": "honest",
          "asking": 22,
          "min": 15
        },
        {
          "edit": "compass",
          "if": "offer == 'deal'",
          "set": { "nosale": true },
          "clue": "You have a feeling somebody will come looking for this."
        },
        { "leave": "seaChest" }
      ]
    },
    "fogMarket": {
      "title": "The ghost market",
      "music": "fog",
      "steps": [
        {
          "stage": "graveyard",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
            {
              "id": "stall",
              "look": "ghost",
              "name": "A ghost",
              "at": [[162, 140], [170, 142]],
              "alpha": "faint",
              "facingLeft": true
            }
          ]
        },
        { "narrate": "The last night of the Fog. Up behind the meetinghouse, blue lanterns hang from the old elm, and the dead have laid out their wares on the box tombs: buttons, spoons, a set of false teeth. Nobody is buying. Nobody has any money." },
        {
          "if": "quest.grey && flag.devil && !flag.devilDone && !flag.abnerClause",
          "note": "crossing: the Gentleman in Grey (js/quests/grey.js)",
          "then": [
            { "enter": { "id": "abner", "cast": "abner", "at": [60, 156], "alpha": "ghost" } },
            {
              "say": "abner",
              "text": [
                "You're the new keeper. You've got his smell on you: red ink and good manners. Abner Crooke, 1952. Listen, I haven't long.",
                "He can't collect from a keeper who gave away, unpaid, everything he supplied. Don't sell one curio. Not one. Hand them all back to him at the end and watch his face."
              ]
            },
            { "set": { "abnerClause": true } },
            { "remove": "abner" },
            { "toast": "Abner's clause: if you never sell a curio, you can hand them all back at the reckoning", "look": "abner" }
          ]
        },
        { "run": "spendDoubloons" },
        { "enter": { "id": "mott", "cast": "mott", "at": [330, 158], "alpha": "ghost", "facingLeft": true } },
        { "walk": "mott", "to": [176, 158] },
        { "face": "mott", "left": true },
        { "find": "compass", "in": "stock", "match": { "mark": "a lighthouse stamp", "key": "compass" } },
        {
          "if": "compass",
          "then": [
            { "take": "compass" },
            {
              "say": "mott",
              "text": [
                "My compass! Pointing out to sea, the faithful old thing. It always wanted to come home.",
                "Four doubloons, as promised. Adjusted for a century of inflation, call it a hundred."
              ]
            },
            { "coin": 100, "why": "Captain Mott paid in doubloons" },
            { "say": "mott", "text": "And since you've been decent, I've brought some friends. The dead love a bargain, and we can't tell real from fake. Everything looks a bit see-through to us." },
            {
              "enter": {
                "id": "ghost",
                "look": "ghost",
                "name": "A ghost",
                "at": [[206, 150], [228, 154], [250, 150]],
                "alpha": "ghost",
                "facingLeft": true
              }
            },
            { "find": "fakes", "in": "stock", "match": { "fake": true, "held": false }, "all": true },
            {
              "find": "genuine",
              "in": "stock",
              "match": { "fake": false, "held": false, "nosale": false },
              "all": true
            },
            {
              "choose": [
                {
                  "label": "Sell them your fakes at full price ({fakes.count} on the shelves)",
                  "disabled": "!fakes.count",
                  "then": [
                    { "hook": "sellFakes" },
                    { "set": { "ghostFakes": true } },
                    { "say": "ghost1", "text": "Oooh, a genuine pearl necklace! It's ever so light." },
                    { "say": "mott", "text": "Ha! I'd wager half of these are fakes. Don't worry. Nobody's complained about anything since 1723." }
                  ]
                },
                {
                  "label": "Sell them genuine pieces at a fair price",
                  "disabled": "!genuine.count",
                  "then": [
                    { "hook": "sellGenuine" },
                    { "set": { "ghostFair": true } },
                    { "rep": 3 },
                    { "say": "ghost2", "text": "Real silver! I can almost feel it!" }
                  ]
                },
                {
                  "label": "Not tonight. Goodnight, Captain.",
                  "then": [{ "say": "mott", "text": "Fair enough. We've got all the time in the world." }]
                }
              ]
            },
            { "set": { "mottHappy": true } },
            { "say": "mott", "text": "Fair winds, shopkeeper. The Fog lifts at dawn." },
            { "narrate": "One by one the lanterns go out, and the stalls are only box tombs again. You walk home through the last of the Fog with your pockets heavier than when you came." }
          ],
          "else": [
            {
              "say": "mott",
              "text": [
                "No compass? I see.",
                "Then I shall come home with you and stay until it turns up. In your shop. Indefinitely.",
                "Don't worry, I'm very quiet. Mostly. Except for the shanties."
              ]
            },
            { "set": { "haunted": true } },
            { "rep": -3 },
            { "narrate": "He follows you down the hill and through your locked door, drifts into the wall clock and settles in. The second hand begins to tick in time with a sea shanty." }
          ]
        },
        { "view": { "fog": false } }
      ]
    },
    "spendDoubloons": {
      "title": "At the ghost market, doubloons buy something that lasts",
      "steps": [
        { "find": "doubloons", "in": "stock", "match": { "uniqueId": "ghostDoubloons", "ghost": true } },
        { "end": true, "if": "!doubloons" },
        {
          "enter": {
            "id": "ashgrove",
            "cast": "ashgrove",
            "at": [230, 156],
            "alpha": "ghost",
            "facingLeft": true
          }
        },
        { "say": "ashgrove", "text": "Doubloons! Real ones! Oh, I haven't seen a doubloon since my wedding. I'll give you my opera glasses for them. Through them you can see us in daylight. It's cheering, mostly." },
        {
          "choose": [
            {
              "label": "Trade the doubloons for the lorgnette",
              "then": [
                { "take": "doubloons" },
                { "add": { "unique": "ashgroveLorgnette" } },
                { "say": "ashgrove", "text": "Spend them well, I always say. Then spend them again." }
              ]
            },
            {
              "label": "Keep the doubloons",
              "then": [{ "say": "ashgrove", "text": "Suit yourself. They'll be very pretty glass." }]
            }
          ]
        },
        { "remove": "ashgrove" }
      ]
    },
    "tessFerry": {
      "title": "Tess asks for help at the ferry landing",
      "music": "fog",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "Tess Bascombe, harbormaster. Clipboard. Fog Week. You know the drill, or you will.",
            "Every year the last ferry comes in with more passengers than it left with. Half of them want to redeem things they pawned at your shop, two hundred years ago.",
            "I could use someone from the Crooked Scale at the landing {tonight:fog-ferry} to check them in. Keeps the queue civil."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll be there.\"",
              "then": [
                { "set": { "fogFerry": true } },
                { "toast": "Calendar: the ferry landing, {placed:fog-ferry} night", "look": "tess" },
                { "say": "tess", "text": "Bring a pen. They all want receipts." }
              ]
            },
            {
              "label": "\"The dead can queue on their own.\"",
              "then": [{ "say": "tess", "text": "They can. They do it very slowly." }]
            }
          ]
        },
        { "leave": "tess" }
      ]
    },
    "fogFerry": {
      "title": "The last ferry",
      "music": "fog",
      "steps": [
        {
          "stage": "ferryLandingNight",
          "view": { "fog": true },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "tess", "cast": "tess", "at": [130, 162] },
            {
              "id": "passenger",
              "look": "ghost",
              "name": "A passenger",
              "at": [[200, 154], [222, 160], [244, 154], [266, 160]],
              "alpha": "ghost",
              "facingLeft": true
            }
          ]
        },
        { "narrate": "The town slip at ten at night. The last ferry noses out of the Fog with eleven living passengers and a great many more who are not." },
        { "say": "tess", "text": "Name, year, and business in Hollow Neck. Keep it moving." },
        { "say": "passenger1", "text": "Ezekiel Marsh, 1794. I pawned my wife's silver thimble at the Crooked Scale for passage money. I'd like to redeem it. I have the ticket." },
        { "find": "silver", "in": "bag", "match": { "cat": ["silver", "jewelry"], "fake": false } },
        {
          "choose": [
            {
              "label": "Honor the ticket: give him your {silver.name|lower}",
              "disabled": "!silver",
              "off": { "label": "Honor the ticket", "hint": "(nothing silver {bagWord})" },
              "then": [
                { "take": "silver" },
                { "set": { "fogHonoured": true } },
                { "rep": 3, "why": "Honoured a 1794 pawn ticket" },
                { "say": "passenger1", "text": "It isn't a thimble. But she'd like it better. Thank you, keeper." }
              ]
            },
            {
              "label": "Help Tess with the rest of the queue",
              "then": [
                { "set": { "fogTess": true } },
                { "rep": 2 },
                { "narrate": "You and Tess check in a hundred and four of the drowned by one o'clock. She writes every name down. Nobody has ever done that for them before." },
                { "say": "tess", "text": "Good work. I'll remember that." }
              ]
            },
            {
              "label": "Tell him the ticket expired some time ago",
              "then": [{ "say": "passenger1", "text": "Everything expires, keeper. I would know." }]
            }
          ]
        },
        { "say": "passenger4", "if": "flag.mott", "text": "Captain Mott says to tell you: the compass. Don't forget the compass." },
        { "view": { "fog": false } }
      ]
    },
    "drownedBall": {
      "title": "The Drowned Ball",
      "music": "eerie",
      "steps": [
        {
          "stage": "grange",
          "view": { "timeOfDay": 0.95, "sign": "THE DROWNED BALL", "fog": true },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 168] },
            { "id": "ashgrove", "cast": "ashgrove", "at": [170, 160], "alpha": "ghost", "facingLeft": true },
            {
              "id": "mott",
              "cast": "mott",
              "if": "flag.mott",
              "at": [220, 156],
              "alpha": "ghost",
              "facingLeft": true
            },
            { "id": "neighbor1", "look": "random", "name": "A neighbor", "at": [40, 156], "alpha": 1 },
            { "id": "ghost1", "look": "ghost", "name": "A ghost", "at": [66, 162], "alpha": "ghost" },
            { "id": "neighbor2", "look": "random", "name": "A neighbor", "at": [92, 156], "alpha": 1 },
            { "id": "ghost2", "look": "ghost", "name": "A ghost", "at": [118, 162], "alpha": "ghost" }
          ]
        },
        {
          "narrate": [
            "The Grange Hall at nine. Once a year the living and the dead dance together here. The band is half and half; the fiddler has been dead since 1860 and is still the best one.",
            "Halfway through a reel, the dead fiddler's E string snaps. The music stops, and the dead stop with it, mid-step, like a film on pause. Without the music they start to fade."
          ]
        },
        { "hook": "findString", "sets": ["strung", "packedString"] },
        {
          "choose": [
            {
              "label": "Hand the fiddler a string off the {strung.name|lower} in your bag",
              "if": "packedString",
              "icon": "{strung.icon}",
              "hint": "(the instrument sells for less)",
              "then": [
                {
                  "edit": "strung",
                  "price": { "times": 0.7, "min": 5 },
                  "clue": "Missing a string. It went to a good cause."
                },
                { "set": { "ballString": true } },
                { "rep": 3, "why": "Restrung the dead fiddler on the spot" },
                { "narrate": "The string is off and in his hand before the dead have finished fading. He tunes by ear and starts again exactly where he stopped, on the same note, and the hall never misses a step." }
              ]
            },
            {
              "label": "Run back to the shop and strip a string off the {strung.name|lower}",
              "hint": "(the instrument sells for less)",
              "disabled": "!strung",
              "off": { "label": "Run back to the shop for a string", "hint": "(nothing with strings in stock)" },
              "then": [
                {
                  "edit": "strung",
                  "price": { "times": 0.7, "min": 5 },
                  "clue": "Missing a string. It went to a good cause."
                },
                { "set": { "ballString": true } },
                { "rep": 1 },
                { "narrate": "You are back in eleven minutes, out of breath. The fiddler restrings by feel, tunes by ear, and starts again exactly where he stopped, on the same note. Nobody living can work out how." }
              ]
            },
            {
              "label": "Start the hall clapping the time",
              "then": [
                { "set": { "ballClap": true } },
                { "narrate": "You clap. The neighbors clap. Then the dead clap, which sounds like rain on a tin roof. The fiddler plays the rest of the reel on three strings and a lot of nerve." }
              ]
            },
            {
              "label": "Wait for someone else to do something",
              "then": [
                { "narrate": "A girl from the high school band plays the rest of the night on a kazoo. The dead love it. Nobody has ever played the kazoo at them before." }
              ]
            }
          ]
        },
        { "say": "mott", "if": "mott", "text": "My crew can't find their way home in this muck. The Prudence Gale's bell hangs over the bar at the Rusty Anchor. Ring it at midnight and they'll follow it. The landlord wants eighty dollars for it, the pirate." },
        { "say": "ashgrove", "text": "Ninety years since anyone asked me to dance. The living ones are all so shy." },
        {
          "choose": [
            {
              "label": "Buy the bell from the Rusty Anchor for Mott's crew",
              "hint": "(-$80)",
              "disabled": "!mott || coin < 80",
              "then": [
                { "coin": -80, "why": "Bought the Prudence Gale's bell" },
                { "set": { "ballBell": true } },
                { "narrate": "At midnight you ring the bell on the Grange steps. Out in the Fog, a long way off, a crew of thirty answers it, laughing, and the sound goes out to sea." }
              ]
            },
            {
              "label": "Ask Widow Ashgrove to dance",
              "then": [
                { "set": { "ballDance": true } },
                { "narrate": "She dances like 1934: very upright, very fast, and better than you. Everybody stops to watch. When the tune ends she curtseys, and she is a little less see-through than before." }
              ]
            },
            {
              "label": "Get some punch and watch",
              "then": [
                { "narrate": "The punch is cold and tastes faintly of seaweed. Somebody's great-great-grandfather steps on your foot and apologises for eleven minutes." }
              ]
            },
            {
              "label": "Call Mott's crew home with what's in your bag",
              "if": "mott",
              "needs": "call",
              "without": "Anything loud enough to carry through the Fog would do.",
              "then": [
                { "use": "call", "as": "it" },
                { "set": { "ballBell": true, "ballOwnBell": true } },
                { "rep": 1 },
                { "narrate": "At midnight you stand on the Grange steps and sound the {it.name|lower|or:bell}. Out in the Fog, a long way off, a crew of thirty answers it, laughing, and the sound goes out to sea. The Rusty Anchor keeps its eighty dollars and its bell." }
              ]
            }
          ]
        },
        {
          "enter": { "id": "ansel", "cast": "ansel", "at": [264, 166] },
          "note": "the last waltz: a living man who wants to follow his wife into the Fog"
        },
        { "narrate": "The last waltz, before the hall empties out. On the edge of the floor, an old man in a good suit is dancing with a woman you can see the radiator through. When the music ends she walks toward the door and the Fog, and he goes after her." },
        { "say": "ansel", "text": "Ansel Ames. That's my June. Forty-one years. She says it's nice out there. She says there's room." },
        { "find": "keep", "in": "bag", "match": { "cat": "jewelry" } },
        {
          "choose": [
            {
              "label": "\"Mr. Ames. Walk me home instead.\"",
              "then": [
                { "set": { "ballAnsel": "home" } },
                { "say": "ansel", "text": "...All right. All right. She says I'm to eat a proper breakfast." },
                { "narrate": "You walk him to his door on Hatch Street. On the step he turns and waves at the Fog, and the Fog waves back." },
                { "rep": 2 }
              ]
            },
            {
              "label": "Let him go",
              "then": [
                { "set": { "ballAnsel": "gone" } },
                { "narrate": "He takes her hand at the door. The Fog folds round them like a coat. In the morning Hatch Street is talking about a house with the lights left on and the kettle still warm." }
              ]
            },
            {
              "label": "Give him the {keep.name|lower} instead",
              "disabled": "!keep",
              "off": { "label": "Give him a keepsake instead", "hint": "(nothing like jewelry {bagWord})" },
              "then": [
                { "take": "keep" },
                { "set": { "ballAnsel": "gift" } },
                { "rep": 3 },
                { "say": "ansel", "text": "That's... that's not hers. But she says it's very like. She says I'm to wear it on Sundays." },
                { "narrate": "He puts the {keep.name|lower} in his breast pocket, over his heart, and lets you walk him home." }
              ]
            }
          ]
        },
        { "remove": "ansel" },
        { "view": { "sign": null, "fog": false } }
      ]
    },
    "hoseaBag": {
      "title": "Hosea Gammon sells his ditty bag",
      "music": "fog",
      "customer": "hosea",
      "steps": [
        {
          "say": "hosea",
          "text": [
            "Hosea Gammon, able seaman, the brig Sally Ann. Went over the side off the Neck in 1856. Mind the drip.",
            "This was my ditty bag. Needle, fid, my bits of string. There's a letter in it for my mother I never got round to posting.",
            "I'll sell you the lot. Only, if you'd post the letter. She's long past reading it. But I'd know."
          ]
        },
        { "offer": { "unique": "dittyBag" }, "persona": "honest", "asking": 20, "min": 12 },
        {
          "if": "offer == 'deal'",
          "then": [
            {
              "choose": [
                {
                  "label": "\"I'll post it today.\"",
                  "then": [
                    { "set": { "hoseaLetter": true } },
                    { "rep": 1 },
                    { "say": "hosea", "text": "Mrs. Ruth Gammon, Pudding Lane. They'll have changed the name. Post it anyway." }
                  ]
                },
                {
                  "label": "\"Some things are better kept.\"",
                  "then": [{ "say": "hosea", "text": "Aye. Maybe they are." }]
                }
              ]
            }
          ]
        },
        { "leave": "hosea" }
      ]
    },
    "temperanceBuys": {
      "title": "Temperance Wilde pays in doubloons",
      "music": "fog",
      "customer": "temperance",
      "steps": [
        {
          "find": "want",
          "in": "forSale",
          "match": { "fake": false, "questKey": false, "curio": false },
          "cheapest": true
        },
        { "say": "temperance", "text": "Temperance Wilde, 1871. Lost with the Bonny Kate, if you're keeping count. Everyone else is." },
        {
          "if": "!want",
          "then": [
            { "say": "temperance", "text": "Nothing on your shelves for me, I'm afraid. I'll haunt the bakery instead." },
            { "leave": "temperance" },
            { "end": true }
          ]
        },
        {
          "say": "temperance",
          "text": [
            "I should like the {want.name|lower}. I'll pay in gold. Four doubloons. Real Spanish gold, from the bottom of the harbor.",
            "Mind you, they don't keep. At dawn after the Fog lifts, they're sea glass. Spend them while you can. The ghost market takes them."
          ]
        },
        {
          "choose": [
            {
              "label": "Take the doubloons for the {want.name|lower}",
              "then": [
                { "sell": "want", "to": "ghost" },
                { "add": { "unique": "ghostDoubloons" }, "if": "shelf.free" },
                { "set": { "doubloons": true } },
                { "say": "temperance", "text": "Lovely. I shall wear it to the Ball." },
                {
                  "if": "flag.mott",
                  "then": [
                    { "toast": "Four ghost doubloons. Spend them at the ghost market before dawn.", "look": "temperance", "icon": "coins" }
                  ],
                  "else": [
                    { "toast": "Four ghost doubloons. They won't last past the Fog.", "look": "temperance", "icon": "coins" }
                  ]
                }
              ]
            },
            {
              "label": "\"Have you anything that won't turn to glass?\"",
              "then": [
                { "say": "temperance", "text": "Dear, nothing about me keeps. That's rather the point of me." }
              ]
            },
            {
              "label": "\"Not today, madam.\"",
              "then": [{ "say": "temperance", "text": "Then I'll look. Looking is free, even for us." }]
            }
          ]
        },
        { "leave": "temperance" }
      ]
    },
    "silasHand": {
      "title": "Peleg Sowle brings the figurehead's hand",
      "music": "fog",
      "customer": "peleg",
      "steps": [
        {
          "say": "peleg",
          "text": [
            "Peleg Sowle, ship's carpenter, the Prudence Gale. Captain Mott's ship. I carved her figurehead. A lady with a rose. The reef took the rest of her.",
            "This is her hand. It washed up in 1801, and it's been in somebody's attic ever since. I'd like it on a shelf where it can see the water."
          ]
        },
        { "offer": { "unique": "figureheadHand" }, "persona": "honest", "asking": 40, "min": 25 },
        { "say": "peleg", "if": "offer == 'deal' && flag.mott", "text": "If you see the Captain, tell him I found her. He'll want to know she's ashore." },
        { "set": { "silasHand": true }, "if": "offer == 'deal'" },
        { "leave": "peleg" }
      ]
    }
  },
  "beats": [
    { "at": "3-1", "cast": "mott", "scene": "mottArrives", "alpha": "ghost", "last": true },
    { "at": "3-2", "cast": "ashgrove", "scene": "ashgrove", "alpha": "ghost" },
    { "at": "3-2", "cast": "seaChest", "scene": "compassSeller" },
    {
      "at": "3-3",
      "night": true,
      "if": "flag.ballKnown || flag.mott",
      "note": "the last fog night: the Drowned Ball at nine, the ghost market at midnight",
      "steps": [{ "run": "drownedBall", "if": "flag.ballKnown" }, { "run": "fogMarket", "if": "flag.mott" }]
    },
    { "at": "3-1", "cast": "tess", "scene": "tessFerry" },
    { "at": "3-1", "cast": "hosea", "scene": "hoseaBag", "alpha": "ghost" },
    { "at": "3-2", "cast": "temperance", "scene": "temperanceBuys", "alpha": "ghost" },
    { "at": "3-3", "cast": "peleg", "scene": "silasHand", "alpha": "ghost" }
  ],
  "nights": [
    {
      "id": "fog-ferry",
      "window": ["3-1", "3-2"],
      "if": "flag.fogFerry",
      "scene": "fogFerry",
      "test": [{ "set": { "fogFerry": true, "mott": true } }, { "add": { "item": "ring" } }]
    }
  ],
  "calendar": [
    {
      "id": "fog-ferry",
      "night": "fog-ferry",
      "story": "fog",
      "where": "The ferry landing",
      "title": "The last ferry",
      "known": "flag.fogFerry",
      "scene": "fogFerry",
      "bring": ["silver"]
    },
    {
      "id": "drowned-ball",
      "week": 3,
      "days": [3],
      "night": true,
      "story": "fog",
      "where": "The Grange Hall",
      "title": "The Drowned Ball",
      "known": "flag.ballKnown",
      "scene": "drownedBall",
      "order": -1,
      "bring": ["play", "call"]
    },
    {
      "id": "fog-week",
      "week": 3,
      "days": [1, 2, 3],
      "night": false,
      "story": "town",
      "where": "All of Hollow Neck",
      "title": "Fog Week: the drowned come back",
      "known": true,
      "scene": null
    },
    {
      "id": "ghost-market",
      "week": 3,
      "days": [3],
      "night": true,
      "story": "fog",
      "where": "The Old Burying Ground",
      "title": "The ghost market",
      "known": "flag.mott",
      "scene": "fogMarket"
    }
  ],
  "mornings": [
    {
      "if": "week == 3 && day <= 3",
      "then": [{ "view": { "fog": true } }],
      "else": [{ "view": { "fog": false } }]
    },
    { "narrate": "The Fog rolled in overnight.\n\nIn Hollow Neck that means the drowned are back for a few days to settle their affairs. The bakery has put up a sign: NO GHOSTS BEFORE NOON. The ferry is canceled.", "if": "week == 3 && day == 1" },
    {
      "toast": [
        "Captain Mott has rearranged your shelves by \"nautical importance\" again.",
        "Captain Mott told a customer your prices were \"piracy\". She agreed with him.",
        "Captain Mott sang sea shanties through the night. All of them. Twice.",
        "Captain Mott is sulking in the wall clock.",
        "Captain Mott says good morning. Then he says it again, slightly louder, from inside the wall."
      ],
      "pick": "day",
      "look": "mott",
      "if": "flag.haunted && week == 4"
    },
    {
      "if": "week == 3 && day == 4",
      "note": "gifts on the step when the Fog lifts",
      "then": [
        {
          "if": "flag.ballBell && shelf.free",
          "then": [
            { "add": { "unique": "mottSextant" } },
            { "toast": "On your step at dawn: a barnacled sextant. \"HOME. THANK YE.\"", "look": "mott" }
          ]
        },
        {
          "if": "flag.ballDance && shelf.free",
          "then": [
            { "add": { "unique": "ashgroveCameo" } },
            { "toast": "On your step at dawn: a cameo brooch, and a dance card with your name on it.", "look": "ashgrove" }
          ]
        },
        {
          "if": "flag.ghostFair && ally.witness",
          "note": "story moment (witness): a friend saw the dead pay you fairly",
          "then": [
            { "toast": "{ally.witness.name} was up before five and saw the drowned queue at your door with their doubloons. It's all over Front Street by breakfast, and nobody's laughing.", "look": "{ally.witness.id}" },
            { "rep": 2, "why": "{ally.witness.name} saw the ghosts queue for your fair prices" }
          ]
        },
        {
          "if": "flag.ghostFakes && foe.witness",
          "note": "story moment (witness): an enemy saw you sell fakes to the dead",
          "then": [
            { "toast": "{foe.witness.name} tells the queue at the Clam Shack about you up at the Burying Ground at midnight, selling painted glass to the dead.", "look": "{foe.witness.id}" },
            { "rep": -3, "why": "{foe.witness.name} saw you sell fakes to the ghosts" }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Ansel Ames eats a proper breakfast every morning at the Clam Shack. He says it's on instructions.", "if": "flag.ballAnsel == 'home'" },
    { "line": "The house on Hatch Street is still for sale. Nobody will say why, and everybody knows.", "if": "flag.ballAnsel == 'gone'" },
    { "line": "Ansel Ames wears a piece of your jewelry to church on Sundays, over his heart.", "if": "flag.ballAnsel == 'gift'" },
    { "line": "The post office returned a letter addressed to Mrs. Ruth Gammon, Pudding Lane, stamped NO SUCH STREET. You keep it in the till.", "if": "flag.hoseaLetter" },
    { "line": "Every Fog Week the Rusty Anchor rings the Prudence Gale's bell at midnight. It's a tradition now. Nobody remembers it was your idea.", "if": "flag.ballBell" },
    { "line": "Widow Ashgrove's dance card still has your name on it. She is saving the next one.", "if": "flag.ballDance" },
    {
      "if": "flag.haunted",
      "then": [
        { "line": "Captain Mott still haunts the shop. Customers find him charming. He has started taking a commission." }
      ],
      "else": [
        { "line": "Somewhere under the harbor, a ghost is wearing a necklace of painted glass. She has never been happier.", "if": "flag.ghostFakes" },
        { "line": "Every year when the Fog comes in, Captain Mott drops by to say hello. He brings friends.", "if": "!flag.ghostFakes && flag.mottHappy" }
      ]
    }
  ]
});
