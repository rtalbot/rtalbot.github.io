// Pawn Champ - Captain Barrow's Boy. Major quest M17, batch I (docs/quests/MAJOR.md#m17-captain-barrows-boy).
// Eli Barrow, seventeen, keeps selling you his grandfather's things. He's finishing the boat the old
// man never finished, to scatter him off Gannet Light, and his mother is Captain Barrow.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/barrowboy.js,
// which also draws sandbarBoat, the half-built dory on the sand below the breakwater.
defineStory({
  "id": "barrowboy",
  "kind": "major",
  "colour": "#4a7ab0",
  "family": "town",
  "title": "Captain Barrow's Boy",
  "crosses": ["rival"],
  "rumour": "The pinsetter kid at Pinwheel Lanes works double shifts and won't say what he's saving for.",
  "endings": { "told": "Told His Mother", "launched": "Off Gannet Light", "soldOn": "Sold On", "halfBuilt": "Half a Boat" },
  "about": [
    "A quiet family story. Eli Barrow, the pinsetter kid at Pinwheel Lanes and son of the police captain, starts selling his dead grandfather's things: a reel (§{eliReel}), a watch (§{eliWatch}), and then the old man's Coast Guard medals, a Gold Lifesaving Medal from the Blizzard of '78 (§{eliMedals}). You can buy, refuse, or pick up the phone and call his mother, which ends it there (§{eliTell}).",
    "Ask what he's saving for and he invites you to the lanes after closing (§{eliLanes}). His grandfather was building a dory to have his ashes scattered off Gannet Light, where his cutter went down, and died with half the planks on. Eli is finishing it in secret and hides the plans in your back room. Offer to help and you meet him at the hull on the breakwater (§{eliBoatNight}), where he needs two of three things: something brass for oarlocks, a compass, and epoxy money (or your own fixing tools). A light lets one part do.",
    "In the last week Captain Barrow calls you into the station (§{eliStation}). If you sold the medals on, she has found them in a shop window or a catalogue, and it ends badly (Sold On). Otherwise the medals come back and the truth comes out. A finished boat means mother and son row it out past Gannet Light at dawn (Off Gannet Light); half a boat means they'll finish it together next summer (Half a Boat). Calling her early is Told His Mother."
  ],
  "notes": "The boat needs two of three parts (oarlocks, a compass, the fastenings), or one and a light to work by. The medals, sold to anyone, come out at the station.",
  "cast": {
    "eli": {
      "name": "Eli Barrow",
      "look": { "skin": "#8a5a3e", "hair": "#1a1210", "hs": 1, "coat": "#c84a3a", "style": "hoodie", "pants": "#2a3a5a", "bag": "#3a3a42" }
    }
  },
  "icons": {
    "medals": [
      "..kk....kk..",
      "..kr....kb..",
      "..kRk..kBk..",
      "..krk..kbk..",
      "...k....k...",
      "..kyk..ksk..",
      ".kyYyk.ksSk.",
      ".kyyok.kssk.",
      "..kok...kk..",
      "...k........",
      "............",
      "............"
    ],
    "reel": [
      "............",
      "....kkkk....",
      "...kssssk...",
      "..ksdddssk..",
      "..ksdkkdsk..",
      "..ksdkkdskkk",
      "..ksdddsskWk",
      "...kssssk.k.",
      "....kkkk....",
      "...kdddk....",
      "..kkkkkkk...",
      "............"
    ]
  },
  "uniques": {
    "eliReel": {
      "name": "A 1950s surf-casting reel",
      "icon": "reel",
      "cat": "curio",
      "guide": 45,
      "condLabel": "Fine",
      "tells": [
        "Chrome and black bakelite. It still clicks like a good one.",
        "Scratched into the foot: L.A.B."
      ]
    },
    "eliMedals": {
      "name": "Lemuel Barrow's Coast Guard medals",
      "icon": "medals",
      "cat": "curio",
      "guide": 160,
      "condLabel": "Fine",
      "tells": [
        "A Gold Lifesaving Medal: \"Lemuel A. Barrow, BM1, USCG. 7 February 1978.\"",
        "A Coast Guard Commendation and a good-conduct ribbon, in a leather case with a broken clasp."
      ]
    },
    "eliPlans": {
      "name": "Lemuel Barrow's boat plans",
      "icon": "letter",
      "cat": "curio",
      "guide": 15,
      "questKey": true,
      "tells": [
        "A sixteen-foot dory, drawn in pencil on the back of a tide chart. Every rib measured twice.",
        "In the corner: \"For off Gannet Light. Don't make a fuss. L.\""
      ]
    }
  },
  "overheard": [
    { "line": "Quietly: \"Barrow's kid sold my brother a tackle box. A good one. His grandfather's. What's a cop's kid need money for?\"" }
  ],
  "scenes": {
    "eliReel": {
      "title": "Eli sells his grandfather's reel",
      "customer": "eli",
      "steps": [
        {
          "say": "eli",
          "text": [
            "Hey. Eli. I set pins out at Pinwheel Lanes. Do you buy fishing stuff?",
            "It's a reel. It was my grandfather's. He doesn't need it. He's dead. Sorry. That came out weird."
          ]
        },
        { "offer": { "unique": "eliReel" }, "persona": "desperate", "asking": 30, "min": 22 },
        { "set": { "eliMet": true } },
        {
          "say": "eli",
          "text": { "if": "offer == 'deal'", "then": "Cool. Thanks. That's, like, a third of a thing.", "else": "Okay. There's other places." }
        },
        {
          "choose": [
            {
              "label": "\"What are you saving for?\"",
              "then": [
                { "say": "eli", "text": "Something. It's not drugs, if that's what you're thinking. Everybody thinks that because of my mom." }
              ]
            },
            { "label": "(Let him go)" }
          ]
        },
        { "leave": "eli" }
      ]
    },
    "eliWatch": {
      "title": "Eli sells a watch that doesn't keep time",
      "customer": "eli",
      "steps": [
        { "say": "eli", "text": "Me again. This was his too. It doesn't keep time. He used to say that about himself." },
        {
          "offer": { "item": "watch", "cond": 2, "mark": "the initials L.B." },
          "persona": "desperate",
          "asking": 45,
          "min": 30
        },
        {
          "say": "eli",
          "text": { "if": "offer == 'deal'", "then": "Thanks. Two thirds of a thing.", "else": "Yeah. Fine." }
        },
        { "leave": "eli" }
      ]
    },
    "eliMedals": {
      "title": "Eli brings in his grandfather's medals",
      "customer": "eli",
      "steps": [
        { "say": "eli", "text": "Okay. Big one." },
        { "view": { "counterIcon": "medals" } },
        { "narrate": "A leather case with a broken clasp. Inside, on faded blue velvet: a gold medal on a red and white ribbon, a Coast Guard Commendation, a good-conduct ribbon." },
        { "say": "eli", "text": "They're my grandfather's. Gold Lifesaving Medal. The Blizzard of '78. He pulled four guys off a scalloper in sixty-foot seas. They're mine now. Sort of." },
        { "view": { "counterIcon": null } },
        {
          "choose": [
            {
              "label": "Buy them",
              "then": [
                { "offer": { "unique": "eliMedals" }, "persona": "desperate", "asking": 90, "min": 70 },
                {
                  "if": "offer != 'deal'",
                  "then": [
                    { "set": { "eliMedals": "refused" } },
                    { "say": "eli", "text": "Okay. Ohio, then." },
                    { "leave": "eli" },
                    { "end": true }
                  ]
                },
                { "set": { "eliMedals": "bought" } },
                { "say": "eli", "text": "That's it. That's enough. Almost." },
                {
                  "choose": [
                    {
                      "label": "\"Enough for what, Eli?\"",
                      "then": [
                        { "set": { "eliInvited": true } },
                        { "say": "eli", "text": "Come by the lanes after my shift. I'm not saying it in here. Your cat's looking at me." },
                        { "toast": "Calendar: Pinwheel Lanes after closing, {placed:eli-lanes}", "look": "eli" },
                        { "leave": "eli" }
                      ]
                    },
                    {
                      "label": "Pick up the phone and call his mother",
                      "hint": "(-15 heat)",
                      "then": [{ "run": "eliTell" }]
                    },
                    { "label": "(Let him go)", "then": [{ "leave": "eli" }] }
                  ]
                }
              ]
            },
            {
              "label": "Turn him down",
              "then": [
                { "set": { "eliMedals": "refused" } },
                { "say": "eli", "text": "Fine. There's always someone. There's a guy in Ohio who collects these. There's a guy in Ohio who collects everything." },
                { "leave": "eli" }
              ]
            },
            {
              "label": "Pick up the phone and call his mother",
              "hint": "(-15 heat)",
              "then": [{ "run": "eliTell" }]
            }
          ]
        }
      ]
    },
    "eliTell": {
      "title": "You call his mother, and she comes for him",
      "customer": "eli",
      "steps": [
        { "set": { "eliEnd": "told" } },
        { "heat": -15, "why": "Called Captain Barrow about her son" },
        { "hook": "walkIn", "with": "barrow", "sets": ["barrow"] },
        { "say": "barrow", "text": "Eli." },
        { "say": "eli", "text": "You called her. You actually called her." },
        { "say": "barrow", "text": "Car. Now. Thank you for the call. I mean that. Not many people in this town would ring me about my own kid." },
        { "find": "medals", "in": "stock", "match": { "uniqueId": "eliMedals" } },
        {
          "if": "medals",
          "then": [
            { "take": "medals" },
            { "hook": "payBack", "with": "Captain Barrow paid back what you paid for her father's medals" }
          ]
        },
        { "hook": "bothLeave", "with": ["eli", "barrow"] }
      ]
    },
    "eliLanes": {
      "title": "Pinwheel Lanes after closing",
      "steps": [
        { "hook": "clearPins" },
        {
          "stage": "pinwheel",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "eli", "cast": "eli", "at": [176, 162], "facingLeft": true }
          ]
        },
        { "narrate": "Pinwheel Lanes after closing. The carpet is louder with nobody on it. Eli is resetting the pins on lane six by hand, because the machine eats them." },
        {
          "say": "eli",
          "text": [
            "My grandfather was building a boat. A dory. In his garage. To row out past Gannet Light, where his cutter went down in '78, and he wanted his ashes scattered off it. From a boat he built himself. That was the deal.",
            "He died with half the planks on. My mom put him on the mantel in a box and the boat on the breakwater under a tarp, and she won't talk about either. Three years.",
            "So I'm finishing it. Wood's expensive. Epoxy's more expensive. And I need his plans somewhere she won't look. She searches my room. She's a cop. She thinks it's subtle."
          ]
        },
        { "add": { "unique": "eliPlans" } },
        { "refresh": "panel" },
        { "toast": "Lemuel Barrow's boat plans, in your back room", "icon": "letter" },
        {
          "choose": [
            {
              "label": "\"I'll help you finish it.\"",
              "then": [
                { "set": { "eliHelp": true } },
                { "say": "eli", "text": "Seriously? Okay. The breakwater, one night next week. Bring anything brass. Bring a compass. Do pawnshops have compasses? They must." },
                { "toast": "Calendar: Eli's boat, the breakwater, {placed:eli-boat} night", "look": "eli" }
              ]
            },
            {
              "label": "\"You should talk to your mother.\"",
              "then": [{ "say": "eli", "text": "Yeah. Everybody says that. Nobody says how." }]
            },
            {
              "label": "Step outside and call his mother from the parking lot",
              "hint": "(-15 heat)",
              "then": [
                { "set": { "eliEnd": "told" } },
                { "heat": -15, "why": "Called Captain Barrow about her son" },
                { "narrate": "You call from the parking lot. Barrow's cruiser is there in six minutes. Eli watches it pull in, then looks at you through the glass door, and goes back to setting pins." }
              ]
            }
          ]
        }
      ]
    },
    "eliBoatNight": {
      "title": "The hull on the breakwater",
      "steps": [
        { "hook": "boatStart", "sets": ["parts"] },
        {
          "stage": "sandbarBoat",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 170] },
            { "id": "eli", "cast": "eli", "at": [186, 166], "facingLeft": true }
          ]
        },
        { "narrate": "The sand below the breakwater, at dusk. Eli pulls the tarp off. Sixteen feet of dory on two sawhorses, ribs like a whale on a beach, half of it planked." },
        { "say": "eli", "text": "Three things and she floats. Oarlocks, a compass, and epoxy. Grandpa's plans say bronze oarlocks. I think the plans are optimistic." },
        { "hook": "pool", "with": "silver", "sets": ["silver1", "silver2", "silver3"] },
        {
          "choose": [
            {
              "label": "Give him the {silver1.name|lower} for oarlocks",
              "hint": "(guide {silver1.guide|money})",
              "if": "silver1",
              "then": [
                { "take": "silver1" },
                { "hook": "part" },
                { "say": "eli", "text": "That'll bend. Okay. Oarlocks." }
              ]
            },
            {
              "label": "Give him the {silver2.name|lower} for oarlocks",
              "hint": "(guide {silver2.guide|money})",
              "if": "silver2",
              "then": [
                { "take": "silver2" },
                { "hook": "part" },
                { "say": "eli", "text": "That'll bend. Okay. Oarlocks." }
              ]
            },
            {
              "label": "Give him the {silver3.name|lower} for oarlocks",
              "hint": "(guide {silver3.guide|money})",
              "if": "silver3",
              "then": [
                { "take": "silver3" },
                { "hook": "part" },
                { "say": "eli", "text": "That'll bend. Okay. Oarlocks." }
              ]
            },
            { "label": "Nothing brass to spare" }
          ]
        },
        { "hook": "pool", "with": "compass", "sets": ["compass1", "compass2"] },
        {
          "choose": [
            {
              "label": "Give him the {compass1.name|lower}",
              "hint": "(guide {compass1.guide|money})",
              "if": "compass1",
              "then": [
                { "take": "compass1" },
                { "hook": "part" },
                { "say": "eli", "text": "He had one just like it. He used to say north is wherever you're rowing from." }
              ]
            },
            {
              "label": "Give him the {compass2.name|lower}",
              "hint": "(guide {compass2.guide|money})",
              "if": "compass2",
              "then": [
                { "take": "compass2" },
                { "hook": "part" },
                { "say": "eli", "text": "He had one just like it. He used to say north is wherever you're rowing from." }
              ]
            },
            { "label": "No compass {bagWord}" }
          ]
        },
        {
          "choose": [
            {
              "label": "Pay for the epoxy and screws",
              "hint": "(-$40)",
              "disabled": "coin < 40",
              "then": [
                { "coin": -40, "why": "Epoxy and bronze screws for Eli's boat" },
                { "hook": "part" },
                { "say": "eli", "text": "I'll pay you back. I won't, probably. I'll mean to." }
              ]
            },
            { "label": "Can't spare it" },
            {
              "label": "Do the fastenings yourself with the tools you brought",
              "needs": "fix",
              "without": "With a proper set of tools you could fasten her without the bronze screws.",
              "then": [
                { "use": "fix" },
                { "hook": "part" },
                { "set": { "eliFixed": true } },
                { "say": "eli", "text": "You can DO that? Grandpa could do that. Can you show me? Slower?" }
              ]
            }
          ]
        },
        { "hook": "partsDone" },
        { "use": "light", "as": "lamp", "if": "hook.carryingLight", "note": "a light buys the last hour" },
        { "narrate": "The light goes, but you've brought the {lamp.name|lower}. One more hour on the sand, and one more plank is one more than you need.", "if": "lamp && parts == 1" },
        {
          "if": "parts >= 2 || (lamp && parts == 1)",
          "then": [
            { "set": { "eliBoatDone": true } },
            { "hook": "boatDone" },
            { "narrate": "You work till the light goes. The last plank goes on by lantern. Eli paints a name on the bow, in his grandfather's capitals: LEMUEL." },
            { "say": "eli", "text": "She floats. I mean, she will. I'm pretty sure. I'm going to tell my mom. Not tonight." }
          ],
          "else": [
            { "narrate": "You get a plank on, and then another, and then the light's gone. It's still more ribs than boat." },
            { "say": "eli", "text": "It's fine. It's closer. He took nine years over the first half." }
          ]
        }
      ]
    },
    "eliStation": {
      "title": "Captain Barrow wants a word",
      "steps": [
        {
          "stage": "police",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 170] },
            { "id": "barrow", "cast": "barrow", "at": [210, 164], "facingLeft": true },
            { "id": "eli", "cast": "eli", "at": [70, 166] }
          ]
        },
        { "narrate": "Hollow Neck Police, after hours. Captain Barrow called you in herself. Eli is on the bench by the water cooler, studying the floor." },
        { "find": "medals", "in": "stock", "match": { "uniqueId": "eliMedals" } },
        {
          "if": "flag.eliSoldMedals",
          "then": [
            { "set": { "eliEnd": "soldOn" } },
            {
              "say": "barrow",
              "text": [
                { "if": "flag.eliSoldTo == 'Bryony'", "then": "My father's Gold Lifesaving Medal is in the window of Reclaimed & Co., across the street from your shop, with a card that says \"Reclaimed from a Hollow Neck estate\".", "else": "My father's Gold Lifesaving Medal is in a dealer's catalogue in Boston. A collector there phoned me to ask if they were stolen." },
                "My son sold them to you. You sold them on. Two days' work. Thirty years in a cabinet."
              ]
            },
            { "say": "eli", "text": "I sold them. Not you. Well. You too." },
            { "heat": 15, "why": "Sold Captain Barrow's father's medals" },
            { "rep": -4 },
            {
              "narrate": { "if": "flag.eliBoatDone", "then": "The boat is finished, out on the breakwater with LEMUEL on the bow. Nobody in this room is going to row it this year.", "else": "Nobody mentions the boat. Nobody in this room knows how to." }
            },
            { "end": true }
          ]
        },
        {
          "say": "barrow",
          "text": [
            "My father's things have been walking out of my house one at a time. A reel. A watch. And now the medals.",
            "Eli says he lost them. Eli is a terrible liar. He gets it from his grandfather."
          ]
        },
        {
          "if": "medals",
          "then": [
            {
              "choose": [
                {
                  "label": "Put the medals on her desk and tell her what they were for",
                  "then": [
                    { "take": "medals" },
                    { "hook": "payBack", "with": "Captain Barrow paid back what you paid for the medals" },
                    { "rep": 2 },
                    { "say": "you", "text": "He's been finishing your father's boat. The one on the breakwater. For off Gannet Light." }
                  ]
                },
                {
                  "label": "Put the medals on her desk and say nothing else",
                  "then": [
                    { "take": "medals" },
                    { "hook": "payBack", "with": "Captain Barrow paid back what you paid for the medals" },
                    { "say": "eli", "text": "I was finishing Grandpa's boat. That's what it was for. All of it." }
                  ]
                }
              ]
            }
          ],
          "else": [
            { "say": "eli", "text": "I didn't lose them. I sold them online. To a man in Ohio. I sold them to Ohio, Mom.", "if": "flag.eliMedals == 'refused'" },
            { "say": "eli", "text": "It was for the boat. Grandpa's boat. That's all. I was going to finish it and take him out." }
          ]
        },
        { "narrate": "Barrow sits down on the edge of her own desk, which you suspect she has never done." },
        { "say": "barrow", "text": "He made me promise. \"Off Gannet Light, from the boat, and don't make a fuss.\" I couldn't look at the boat. So I didn't make a fuss. For three years." },
        { "find": "reel", "in": "stock", "match": { "uniqueId": "eliReel" } },
        {
          "if": "reel",
          "then": [
            {
              "choose": [
                {
                  "label": "Give her the reel back too",
                  "then": [
                    { "take": "reel" },
                    { "rep": 1 },
                    { "say": "barrow", "text": "He caught a forty-pound striper on that. He talked about it at my wedding." }
                  ]
                },
                { "label": "Keep the reel" }
              ]
            }
          ]
        },
        { "find": "plans", "in": "stock", "match": { "uniqueId": "eliPlans" } },
        {
          "if": "flag.eliBoatDone",
          "then": [
            { "set": { "eliEnd": "launched" } },
            { "rep": 6, "why": "Eli's boat went out off Gannet Light" },
            { "hook": "boatDone" },
            {
              "stage": "sandbarBoat",
              "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [150, 170] }]
            },
            {
              "narrate": [
                "Dawn. You watch from the breakwater as a sixteen-foot dory called LEMUEL goes out past the green light, with a police captain at the oars and her son in the bow holding a coffee can.",
                "Off Gannet Light they stop for a while. Then they row back, slower, both of them talking."
              ]
            },
            {
              "if": "plans",
              "then": [
                { "edit": "plans", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "narrate": "Eli leaves the plans with you. \"Keep them. In case anybody else ever needs a boat.\"" }
              ]
            }
          ],
          "else": [
            { "set": { "eliEnd": "halfBuilt" } },
            { "rep": 2 },
            { "say": "barrow", "text": "Half a boat. Well. I know where the other half of the planks are. They're in my garage. They've been in my garage for three years." },
            { "say": "eli", "text": "We could. Next summer. If you want." },
            {
              "if": "plans",
              "then": [
                { "take": "plans" },
                { "narrate": "You give Eli back his grandfather's plans. He gives them to his mother." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "1-3", "cast": "eli", "scene": "eliReel" },
    { "at": "1-5", "cast": "eli", "scene": "eliWatch", "if": "flag.eliMet && !flag.eliEnd" },
    { "at": "2-2", "cast": "eli", "scene": "eliMedals", "if": "flag.eliMet && !flag.eliEnd" }
  ],
  "nights": [
    {
      "id": "eli-lanes",
      "window": ["2-2", "2-4"],
      "if": "flag.eliInvited && !flag.eliEnd",
      "scene": "eliLanes",
      "test": [{ "set": { "eliMet": true, "eliMedals": "bought", "eliInvited": true } }]
    },
    {
      "id": "eli-boat",
      "window": ["3-1", "3-3"],
      "if": "flag.eliHelp && !flag.eliEnd",
      "scene": "eliBoatNight",
      "test": [
        { "set": { "eliMet": true, "eliHelp": true } },
        { "hook": "setCoin", "with": 100 },
        { "add": { "item": "goblet" } },
        { "add": { "item": "compass" } },
        { "add": { "unique": "eliPlans" } }
      ]
    },
    {
      "id": "eli-station",
      "window": ["3-4", "4-3"],
      "if": "flag.eliMet && !flag.eliEnd",
      "scene": "eliStation",
      "test": [
        { "hook": "stationTest", "note": "at random: the boat done or not, the medals sold on or not (and to whom)" }
      ]
    }
  ],
  "calendar": [
    { "id": "eli-lanes", "night": "eli-lanes", "story": "barrowboy", "where": "Pinwheel Lanes", "title": "Eli, after his shift", "known": "flag.eliInvited", "scene": "eliLanes" },
    {
      "id": "eli-boat",
      "night": "eli-boat",
      "story": "barrowboy",
      "where": "The breakwater",
      "title": "Eli's boat",
      "known": "flag.eliHelp",
      "scene": "eliBoatNight",
      "bring": ["silver", "find-way", "fix", "light"]
    },
    { "id": "eli-station", "night": "eli-station", "story": "barrowboy", "where": "The police station", "title": "Captain Barrow wants a word", "known": false, "scene": "eliStation" }
  ],
  "mornings": [
    { "hook": "cool", "if": "flag.eliEnd == 'told'", "note": "you told his mother: Barrow looks more kindly on the shop from then on" }
  ],
  "sold": {
    "eliMedals": [
      { "set": { "eliSoldMedals": true }, "note": "the medals sold to anybody come out at the station" },
      { "set": { "eliSoldTo": "Bryony" }, "if": "how == 'rival'" }
    ]
  },
  "epilogue": [
    { "line": "Eli Barrow sets pins at Pinwheel Lanes and crosses the street when he sees you. His mother waves.", "if": "flag.eliEnd == 'told'" },
    { "line": "A dory called LEMUEL is moored off the town float. On Sundays a police captain and her son row it out past Gannet Light and back.", "if": "flag.eliEnd == 'launched'" },
    { "line": "Captain Barrow bought back her father's medals for three times what you paid. She hasn't mentioned it since. She doesn't need to.", "if": "flag.eliEnd == 'soldOn'" },
    { "line": "The half-built dory has moved from the breakwater to the Barrows' driveway. Some evenings you can hear sanding.", "if": "flag.eliEnd == 'halfBuilt'" }
  ],
  "talk": {
    "by": "skip",
    "rumour": [
      "Eli Barrow was on my bus till he got his license. Good kid. Now he sets pins at Pinwheel every night and eats the free popcorn for dinner.",
      "Saving for something, he says. Won't say what. His mother's the police captain. I didn't ask twice."
    ],
    "react": { "told": "Eli's grounded till Thanksgiving. He still waves at the bus. He doesn't wave at you, I notice.", "launched": "Saw a dory going out past Gannet Light at dawn on Sunday. Captain Barrow at the oars. I pulled the bus over to watch. The kids didn't mind.", "soldOn": "Something happened with old Lemuel Barrow's medals. Nobody's saying. That's a lot of nobody saying.", "halfBuilt": "The Barrows have half a boat in their driveway now. I go past it twice a day. Every day it's a bit more boat." },
    "sway": {
      "told": { "skip": -1 },
      "launched": { "skip": 2 },
      "soldOn": { "skip": -2 },
      "halfBuilt": { "skip": 1 }
    }
  },
  "outcome": "flag.eliEnd"
});
