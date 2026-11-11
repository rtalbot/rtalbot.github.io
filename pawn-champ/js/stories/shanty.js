// Pawn Champ - The Shanty Town. Major quest M31, batch N (docs/quests/MAJOR.md#m31-the-shanty-town-crime).
// When the inner harbor freezes, the fleet drags its ice-fishing shacks out onto the flats. One of
// them has a red door, and a card game behind it that the fleet loses its winter money to. The dealer,
// Monty Varnum, cheats with a shiner: a silver lighter whose lid is polished like a mirror. One night
// it slid off the table, Nando Medeiros picked it up, and his wife pawns it at your counter.
//
// Hook (W1 Tue)             Lena Medeiros pawns a silver lighter her husband brought home.
// Middle (W1 Thu)           Bev Santos: nobody wins out there. That's not odds, that's arithmetic.
// Middle (W2 Mon)           Monty comes in for his "keepsake". $200, no questions.
// Scene 1 (W2 Wed-W3 Mon)   Inside the red door: you buy in, and watch.
// Scene 2 (W3 Mon-Thu)      The flats at dusk with Bev and Nando: the derby pot, and a plan.
// Finale (W3 Thu-W4 Thu)    The derby game. Fold him, call Barrow, take his money, or take his cut.
// Months: January and February of a stay. Crossing: M29 Under the Ice (the ice saw on the wall).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/shanty.js.
defineStory({
  "id": "shanty",
  "kind": "major",
  "colour": "#b02a22",
  "family": "crime",
  "title": "The Shanty Town",
  "months": [4, 5],
  "crosses": ["undertheice"],
  "rumour": "There's a card game on the harbor ice behind a red door, and nobody ever wins it.",
  "endings": { "exposed": "Folded", "police": "Raided on the Ice", "cut": "The House Cut", "played": "Turned the Shiner" },
  "outcome": "flag.shantyEnd",
  "about": [
    "A winter crime story on the frozen harbor. Lena Medeiros pawns a silver lighter with a mirror lid that her husband Nando brought home from a shanty, instead of the truck payment (§{shantyLena}). Bev, who takes bets, tells you nobody has won the card game behind the red door since Christmas, which isn't odds but arithmetic (§{shantyBev}). Show her the lighter and she knows it: a shiner, a mirror for reading cards as you deal them. Monty Varnum, who runs the game, offers $200 for his \"keepsake\" (§{shantyMonty}); selling ends it (The House Cut).",
    "Buy into the game for $20 (§{shantyGame}). Watch the dealer's hands and you spot his new mirror, a polished thermos cap. Nando tells you the whole fleet's ice-fishing derby pot will go on Monty's table. On the flats with Bev and Nando (§{shantyFlats}) you agree a plan.",
    "On derby night (§{shantyFinale}), put the lighter on the felt and turn his thermos over in front of the fleet (Folded); ring Captain Barrow, and everyone gets written up (Raided on the Ice); play him with his own mirror and clean him out (Turned the Shiner); or sell him the lighter under the table (The House Cut)."
  ],
  "cast": {
    "lenaM": {
      "name": "Lena Medeiros",
      "look": { "skin": "#c89070", "hair": "#1a1410", "hs": 3, "coat": "#7a2a3a", "trim": "#e8e4dc", "style": "puffer", "pants": "#2a2a3a", "hat": "beanie", "hatc": "#e8e4dc" }
    },
    "nando": {
      "name": "Nando Medeiros",
      "look": { "skin": "#b88060", "hair": "#2a1e16", "hs": 0, "coat": "#e8a020", "trim": "#2a2a2a", "style": "jacket", "hat": "beanie", "hatc": "#2a4a6a", "pants": "#3a3a40", "moustache": "#2a1e16" }
    },
    "varnum": {
      "name": "Monty Varnum",
      "look": { "skin": "#e8c8a8", "hair": "#c8a870", "hs": 2, "coat": "#b88a5a", "trim": "#e8e0cc", "style": "jacket", "long": true, "pants": "#2a2a30", "hat": "fedora", "hatc": "#3a3028" }
    }
  },
  "icons": {
    "shiner": [
      "............",
      "...kkkkkk...",
      "..kSSSSSSk..",
      "..kSBBBBSk..",
      "..kSBSSBSk..",
      "..kSSSSSSk..",
      "..kkkkkkkk..",
      "..ksssssdk..",
      "..ksSsssdk..",
      "..ksssssdk..",
      "..kdddddkk..",
      "...kkkkkk..."
    ]
  },
  "uniques": {
    "shiner": {
      "name": "A silver lighter with a mirror lid",
      "icon": "shiner",
      "cat": "silver",
      "guide": 45,
      "condLabel": "Never been lit",
      "questKey": true,
      "tells": [
        "A heavy silver lighter. The flint wheel has never been struck.",
        { "text": "The inside of the lid is polished like a dentist's mirror. Lay it flat on a table and you can read any card dealt across it.", "cls": "bad" }
      ]
    }
  },
  "spots": {
    "shanties": [
      {
        "id": "truck",
        "rect": { "x": 556, "y": 180, "w": 72, "h": 44 },
        "lines": [
          "A pickup parked on the harbor. Every winter somebody leaves one out a day too long, and every spring there's a photograph in the Gazette."
        ]
      },
      {
        "id": "flag",
        "rect": { "x": 324, "y": 250, "w": 20, "h": 24 },
        "lines": [
          "A tip-up flag, standing straight up. Something's on the line. Nobody's come out to look.",
          "Still up. Whoever owns it is behind the red door."
        ]
      },
      {
        "id": "sled",
        "rect": { "x": 24, "y": 274, "w": 72, "h": 24 },
        "lines": ["A sled loaded with an auger, a bucket and a folding stool. The basics of hope."],
        "where": "the flats",
        "find": { "on": 1, "coin": 4, "line": "Four dollars folded under the bucket on the sled. Bait money, probably. Finders keepers, on the ice." }
      }
    ],
    "shantyInside": [
      {
        "id": "sign",
        "rect": { "x": 170, "y": 60, "w": 110, "h": 34 },
        "lines": ["CASH GAME. NO MARKERS. Somebody has written underneath, very small, NO WINNERS."]
      },
      {
        "id": "hole",
        "rect": { "x": 60, "y": 296, "w": 66, "h": 36 },
        "lines": [
          "The fishing hole. The line goes down into black water. It hasn't moved all night.",
          "Under the ice it's thirty feet to the harbor floor. Somebody's dropped a poker chip down it."
        ]
      }
    ]
  },
  "scenes": {
    "shantyLena": {
      "title": "Lena Medeiros pawns a silver lighter her husband brought home",
      "customer": "lenaM",
      "steps": [
        {
          "say": "lenaM",
          "text": [
            "My husband doesn't smoke. Nando has never smoked. He went out to the flats on Friday with the truck payment and came home with this.",
            "Says it was on the floor of a shanty. Says it's lucky. Take it off me before I throw it in the harbor. Forty."
          ]
        },
        { "offer": { "unique": "shiner" }, "persona": "desperate", "asking": 40, "min": 25 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "shantyOut": true } },
            { "say": "lenaM", "text": "Then it goes in the harbor. Lucky. I'll show him lucky." },
            { "leave": "lenaM" },
            { "end": true }
          ]
        },
        { "set": { "shantyIn": true } },
        { "say": "lenaM", "text": "The shanty with the red door. If you ever go out there, don't." },
        { "leave": "lenaM" }
      ]
    },
    "shantyBev": {
      "title": "Bev Santos: nobody wins out there",
      "customer": "bev",
      "steps": [
        {
          "say": "bev",
          "text": [
            "I take bets. Bowling, the Super Bowl, which day the harbor freezes. I know odds. I like odds.",
            "There's a game out on the flats this winter behind a red door. Half the fleet's been in. Nobody wins. Not once since Christmas.",
            "That's not odds. That's arithmetic. If something from that shanty comes over your counter, I'd like to see it."
          ]
        },
        { "find": "lighter", "in": "stock", "match": { "uniqueId": "shiner" } },
        {
          "choose": [
            {
              "label": "Show Bev the lighter",
              "hint": "(she knows what it is)",
              "then": [
                { "narrate": "Bev flips the lid open, looks into it, and laughs without any fun in it." },
                {
                  "say": "bev",
                  "text": [
                    "A shiner. My grandfather told me about these. Lay it flat by your hand and every card you deal goes over a mirror.",
                    "Hang on to it. He'll want it back, and he'll have another by now. Go and see. Bring twenty dollars you don't need."
                  ]
                },
                { "set": { "shantyBevKnows": true } }
              ]
            },
            { "label": "Say nothing" }
          ],
          "if": "lighter"
        },
        { "set": { "shantyGo": true } },
        { "toast": "Calendar: a card game behind the red door", "look": "bev" },
        { "leave": "bev" }
      ]
    },
    "shantyMonty": {
      "title": "Monty Varnum wants his keepsake back",
      "customer": "varnum",
      "steps": [
        {
          "say": "varnum",
          "text": [
            "Monty Varnum. I run a friendly game out on the ice. Very friendly. You've got a keepsake of mine. A lighter. It walked off.",
            "Sentimental value. Two hundred dollars, and we never had this conversation, because I don't have conversations."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell it to Monty",
              "hint": "(+$200; the story ends here)",
              "then": [
                { "find": "lighter", "in": "stock", "match": { "uniqueId": "shiner" } },
                { "take": "lighter" },
                { "coin": 200, "why": "Sold a silver lighter to Monty Varnum" },
                { "set": { "shantyEnd": "cut", "shantyDone": true } },
                { "say": "varnum", "text": "A pleasure. You should come out and play some night. On the house." },
                { "leave": "varnum" },
                { "end": true }
              ]
            },
            { "label": "\"It's not for sale.\"" }
          ]
        },
        { "say": "varnum", "text": "Everybody says that. Then it gets cold." },
        { "leave": "varnum" }
      ]
    },
    "shantyGame": {
      "title": "Inside the red door",
      "steps": [
        {
          "stage": "shantyInside",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [90, 168] },
            { "id": "varnum", "cast": "varnum", "at": [166, 150] },
            { "id": "nando", "cast": "nando", "at": [238, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Behind the red door it's eighty degrees. The heater ticks, the lantern swings, and five fishermen sit round a card table with their coats on their knees. There's a hole in the floor with a line down it. Nobody is fishing." },
        { "say": "varnum", "text": "A new face. Twenty dollars buys you in. Sit anywhere. I always sit here." },
        { "narrate": "On the wall behind him hangs a two-handed ice saw, the teeth gone brown, stamped HOB POND ICE CO.", "if": "quest.undertheice" },
        { "coin": -20, "why": "Bought into the game behind the red door" },
        {
          "choose": [
            {
              "label": "Watch the cards",
              "then": [
                { "narrate": "You play six hands. You get two pair, three of a kind and a straight, and he folds every time you have something and calls every time you don't. Like he can see through the backs." }
              ]
            },
            {
              "label": "Watch the dealer's hands",
              "then": [
                {
                  "narrate": [
                    "He deals smoothly and slowly, like a man with nowhere else to be. Every card goes across the felt past his right hand, past a steel thermos lying on its side. Its cap has been polished bright.",
                    "Every time a card crosses it, his eyes drop for a quarter of a second."
                  ]
                },
                { "set": { "shantyThermos": true } }
              ]
            },
            {
              "label": "Watch the room",
              "then": [
                { "narrate": "Nando Medeiros is in the corner, pretending not to know you. He's lost everything in front of him and he's still sitting there. The others have the same look: men who are sure the next hand is theirs." }
              ]
            }
          ]
        },
        { "narrate": "Your twenty dollars is gone in forty minutes. Monty is gracious about it." },
        { "say": "nando", "text": "(at the door, low) Saturday after next is the ice-fishing derby. The whole fleet's entry money goes in a pot, and the pot goes on his table. Talk to Bev." },
        { "set": { "shantySeen": true } },
        { "toast": "Calendar: out on the flats with Bev", "look": "bev" }
      ]
    },
    "shantyFlats": {
      "title": "The flats at dusk with Bev and Nando",
      "steps": [
        { "hook": "shanties", "with": { "raid": false } },
        {
          "stage": "shanties",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 168] },
            { "id": "bev", "cast": "bev", "at": [170, 166], "facingLeft": true },
            { "id": "nando", "cast": "nando", "at": [230, 166], "facingLeft": true }
          ]
        },
        { "narrate": "The flats at dusk. Smoke from every stovepipe leans toward town. The red door is lit, and you can hear laughing behind it, one voice." },
        { "say": "bev", "text": "Derby's Saturday. Four hundred and sixty dollars in the pot, and every man in the fleet has said he'll take it into the red door and double it for everybody." },
        {
          "say": "bev",
          "text": { "if": "flag.shantyThermos", "then": "A thermos lid. Course it is. He doesn't need the lighter any more, he's got a new mirror. That lighter in your shop is the only proof he ever had one.", "else": "He's got another shiner by now. That lighter in your shop is the only proof he ever had one." }
        },
        { "say": "nando", "text": "If somebody shows the fleet, they'll believe it. If I show them, I'm the man who lost the truck." },
        {
          "choose": [
            {
              "label": "\"I'll bring it Saturday.\"",
              "then": [{ "say": "nando", "text": "Saturday. I'll save you a chair. Don't sit in his." }]
            },
            {
              "label": "\"Why not just ring the police?\"",
              "then": [
                { "say": "bev", "text": "You could. Barrow would come out with the blue lights and the whole fleet would get written up for gambling, me included. Your call." }
              ]
            },
            {
              "label": "\"Maybe I'll play him myself.\"",
              "then": [
                { "say": "bev", "text": "With his own mirror. Ha. That's not betting, that's robbery. Mind you, so is his." }
              ]
            }
          ]
        },
        { "set": { "shantyPlan": true } },
        { "toast": "Calendar: the derby game", "look": "bev" }
      ]
    },
    "shantyFinale": {
      "title": "The derby game",
      "steps": [
        {
          "stage": "shantyInside",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [90, 168] },
            { "id": "varnum", "cast": "varnum", "at": [166, 150] },
            { "id": "nando", "cast": "nando", "at": [238, 164], "facingLeft": true },
            { "id": "bev", "cast": "bev", "at": [274, 162], "facingLeft": true, "if": "hook.bevHere" }
          ]
        },
        { "narrate": "Derby night. Nine men in a shanty built for four, every coat steaming, the derby pot in a coffee can in the middle of the felt. Monty deals the first hand like a man who has never lost one." },
        { "say": "varnum", "text": "Gentlemen. And the shopkeeper. Let's play for the fleet." },
        { "find": "lighter", "in": "stock", "match": { "uniqueId": "shiner" } },
        {
          "choose": [
            {
              "label": "Put the lighter on the felt, and turn his thermos over",
              "hint": "(in front of the fleet)",
              "disabled": "!lighter",
              "then": [
                { "take": "lighter" },
                { "narrate": "You set the lighter down in front of the coffee can and flip the lid open so the lantern shows in it. Then you reach across and turn his thermos over. The cap is a mirror too." },
                { "say": "nando", "text": "Lay it flat. Deal across it. Go on, Monty, deal across it." },
                { "narrate": "Nobody says anything. Then the fleet stands up, all nine of them at once, in a shanty built for four." },
                { "say": "varnum", "text": "Well. It's been a lovely season." },
                { "say": "bev", "text": "Everybody counts out what they came in with since Christmas. Honestly. I'll know if you don't. I always know.", "if": "bev" },
                { "narrate": "Monty leaves by the red door without his coat, and the fleet splits his bank by the light of the lantern. Nando gets the truck payment back, and Lena makes him buy you dinner." },
                { "rep": 6, "why": "Folded the game behind the red door" },
                { "heat": -2 },
                { "set": { "shantyEnd": "exposed" } }
              ]
            },
            {
              "label": "Step outside and ring Captain Barrow",
              "hint": "(blue lights on the ice)",
              "music": "tension",
              "then": [
                { "narrate": "You step out into the cold and ring the station. Twenty minutes later there are blue lights on the flats, two cruisers crawling across the ice with their doors open in case it goes." },
                { "hook": "shanties", "with": { "raid": true } },
                {
                  "stage": "shanties",
                  "fadeOut": false,
                  "fadeIn": false,
                  "actors": [
                    { "id": "you", "cast": "keeper", "name": "You", "at": [110, 168] },
                    { "id": "barrow", "cast": "barrow", "at": [190, 166], "facingLeft": true }
                  ]
                },
                { "say": "barrow", "text": "Illegal gambling, on the town's ice, with a mirror. Mr. Varnum, you are a classic. Everybody else, go home and don't do it again." },
                {
                  "hook": "moment",
                  "with": "police",
                  "sets": ["friend", "enemy"],
                  "note": "a friend speaks for you, an enemy mentions the lighter (js/standing.js)"
                },
                { "narrate": "{friend.name} is there with the cruiser, and says loudly that you were the one who rang it in. The Captain nods at you, the way she nods at people she won't have to look into.", "if": "friend" },
                {
                  "if": "enemy",
                  "then": [
                    { "narrate": "{enemy.name} mentions to the Captain that you were the one who bought that lighter in the first place. She writes your name down, slowly." },
                    { "heat": 4 }
                  ]
                },
                { "say": "barrow", "text": "And the shopkeeper. Good citizen. Don't let it go to your head." },
                { "take": "lighter" },
                { "rep": 3, "why": "Rang in the game on the ice" },
                { "heat": -6 },
                { "set": { "shantyEnd": "police" } }
              ]
            },
            {
              "label": "Play him with his own lighter",
              "hint": "(win big; not exactly honest)",
              "disabled": "!lighter",
              "then": [
                { "take": "lighter" },
                {
                  "narrate": [
                    "You lay the lighter flat by your right hand, the way he does. When the deal comes round to you, you deal across it. Slowly. Like a man with nowhere else to be.",
                    "Monty sees it on the third hand. He can't say anything without saying everything. He sits there and loses, hand after hand, until the bank is empty."
                  ]
                },
                { "say": "varnum", "text": "I'll be going, then. You've got talent. Wasted on a pawnshop." },
                { "say": "bev", "text": "That's not betting, that's robbery. Mind you, so was his. Give the derby pot back to the derby, at least.", "if": "bev" },
                { "coin": 350, "why": "Won the bank off Monty Varnum" },
                { "rep": -1 },
                { "heat": 3 },
                { "set": { "shantyEnd": "played" } }
              ]
            },
            {
              "label": "Sell Monty his lighter under the table",
              "hint": "(+$300)",
              "disabled": "!lighter",
              "then": [
                { "take": "lighter" },
                { "narrate": "At the break you pass him the lighter under the table. He counts out three hundred dollars by feel, without looking down." },
                { "say": "varnum", "text": "A pleasure doing business. You should come out and play some night." },
                { "narrate": "The derby pot goes into the coffee can and doesn't come out. Nando watches you leave." },
                { "coin": 300, "why": "Sold a silver lighter to Monty Varnum" },
                { "rep": -4 },
                { "set": { "shantyEnd": "cut" } }
              ]
            }
          ]
        },
        { "set": { "shantyDone": true } }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "lenaM", "scene": "shantyLena" },
    { "at": "1-4", "cast": "bev", "scene": "shantyBev", "if": "!flag.shantyDone" },
    { "at": "2-1", "cast": "varnum", "scene": "shantyMonty", "if": "flag.shantyIn && !flag.shantyDone && hook.shinerHere" }
  ],
  "nights": [
    {
      "id": "shanty-game",
      "window": ["2-3", "3-1"],
      "if": "flag.shantyGo && !flag.shantyDone",
      "scene": "shantyGame",
      "test": [{ "set": { "shantyGo": true } }]
    },
    {
      "id": "shanty-flats",
      "window": ["3-1", "3-4"],
      "if": "flag.shantySeen && !flag.shantyDone",
      "scene": "shantyFlats",
      "test": [{ "set": { "shantySeen": true } }, { "roll": { "shantyThermos": [true, false] } }]
    },
    {
      "id": "shanty-finale",
      "window": ["3-4", "4-4"],
      "if": "flag.shantyPlan && !flag.shantyDone",
      "scene": "shantyFinale",
      "test": [{ "set": { "shantyPlan": true } }, { "add": { "unique": "shiner" }, "if": "random < 0.8" }]
    }
  ],
  "calendar": [
    { "id": "shanty-game", "night": "shanty-game", "story": "shanty", "where": "The harbor flats", "title": "Behind the red door", "known": "flag.shantyGo", "scene": "shantyGame" },
    { "id": "shanty-flats", "night": "shanty-flats", "story": "shanty", "where": "The harbor flats", "title": "Bev's plan", "known": "flag.shantySeen", "scene": "shantyFlats" },
    { "id": "shanty-finale", "night": "shanty-finale", "story": "shanty", "where": "Behind the red door", "title": "The derby game", "known": "flag.shantyPlan", "scene": "shantyFinale" }
  ],
  "epilogue": [
    { "line": "Monty Varnum left Hollow Neck the night of the derby without his coat. The fleet hung it on the red door, and it stayed there till the ice went out.", "if": "flag.shantyEnd == 'exposed'" },
    { "line": "Captain Barrow took Monty Varnum off the ice in a cruiser. The red-door shanty was towed ashore and sold for firewood.", "if": "flag.shantyEnd == 'police'" },
    { "line": "The game behind the red door ran till the thaw. Nando Medeiros sold his truck in March.", "if": "flag.shantyEnd == 'cut'" },
    { "line": "You cleaned out a cheat with his own mirror. Monty Varnum left town. The fleet isn't sure what to make of you, and neither is Bev.", "if": "flag.shantyEnd == 'played'" }
  ],
  "talk": {
    "by": "bev",
    "rumour": [
      "Somebody's running a card game on the harbor ice this winter. Shanty with a red door. Half the fleet's been in.",
      "Nobody wins out there. Not once since Christmas. That's not odds. That's arithmetic."
    ],
    "react": { "exposed": "You turned his thermos over in front of the whole fleet. I'd have paid to see his face. Some of them did, in a way. Drinks are on me at the lanes.", "police": "Blue lights on my ice. Half the fleet's got a summons for gambling, and they think I took the bets. I didn't. That time.", "cut": "Monty's game is still running, and somebody gave him his lighter back. I've stopped taking bets on you.", "played": "You beat a cheat with his own mirror. I've no idea what odds to give you now. I like that, I think." },
    "sway": {
      "exposed": { "bev": 2, "tess": 2 },
      "police": { "dunphy": 2, "bev": -1 },
      "cut": { "bev": -3, "tess": -2 },
      "played": { "bev": 1, "dunphy": -2 }
    }
  }
});
