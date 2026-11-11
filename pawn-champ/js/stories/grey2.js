// Pawn Champ - The Second Page: the Gentleman in Grey comes back for the longest night.
// Long arc of M2 (docs/quests/MAJOR.md#the-second-page-m2s-long-arc), round 3 batch S. Stay-on only:
// drawn in December (month 3) when The Gentleman in Grey ended as The Keeper in Grey (soul sold) or
// Rewritten (the Ink burned page one). Every other ending closes the story.
//
// Hook (W1 Mon morning)    Otis brings an envelope with no stamp: page two of the contract. Clause IX:
//                          hand on whatever the Firm supplies to whoever it names, until the longest
//                          night, when it collects in person. The small print: goods returned unused
//                          are refunded in full.
// Middle (W1-W3)           Three curios arrive unasked (a seeded three of four). The day after each, a
//                          regular comes in with a typed note: "Your parcel is waiting. Paid in full."
//                          Hand it over (someone in town uses it) or keep it in the back.
// Finale (the 21st)        Quillon collects. From the shop after dark, or from the vigil at Saint
//                          Brine's if The Longest Night is in this month too (its "vigil" cue). Down to
//                          the Proprietor's shop below: sign the third page, pay in cash, or hand the
//                          goods back unused. Code half: js/quests/greypage.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "grey2",
  "kind": "major",
  "colour": "#d05050",
  "family": "uncanny",
  "title": "The Second Page",
  "arc": "grey",
  "after": ["keeper", "rewritten"],
  "months": [3],
  "teaser": "A second envelope from Mr. Quillon, in the same grey paper.",
  "rumour": "Parcels are turning up on doorsteps this month, paid for, that nobody ordered.",
  "endings": { "returned": "Goods Returned Unused", "settled": "Paid in Cash", "collected": "The Shop Downstairs" },
  "outcome": "flag.g2End",
  "code": "greypage",
  "about": [
    "The December chapter of the Gentleman in Grey, for runs where October ended with you signing his contract (The Keeper in Grey) or burning it (Rewritten). Otis brings a grey envelope with no stamp, warm from his bag (§{g2Envelope}): page two of the contract. If you signed, it says you'll hand on goods the Firm supplies until the longest night, and then be collected to keep the shop downstairs. If you burned page one, it says whatever's still owed gets collected that night. In tiny type at the bottom: goods returned unused are refunded in full.",
    "Three of four curios turn up on your counter, one a week, each tagged for a regular: an Advent calendar for Skip (§{g2Visit_advent}), one mitten for Hal (§{g2Visit_mitten}), a sleigh bell for Captain Nan Ferreira (§{g2Visit_bell}) and a candle for Agathe (§{g2Visit_candle}). Each comes in the next day with a typed note saying a parcel is waiting, paid for. Hand it over and something odd happens to them (the epilogue tells you what), or tell them it isn't for anybody and keep it in the back.",
    "On the longest night Quillon opens your stockroom door onto stairs going down (or the vestry door, if you're at the church vigil), and the Proprietor, in a paper crown, reads out your tally (§{greyCollect}). Sign the third page and keep his shop after hours (The Shop Downstairs, $200 in advance). Pay the debt in cash (Paid in Cash). Or, if you held back every curio, hand them all back unused (Goods Returned Unused). If you'd sold your soul, that last one gets it back in a jar.",
    "Orsolya gives the hint beforehand: don't pass anything on, hand it back the way it came."
  ],
  "notes": "Three of the four curios come each run, in an order picked from the run code (js/quests/greypage.js), one a week; the regular each is addressed to comes in for it the day after. flag.soulSold is The Keeper in Grey; without it, the October ending was Rewritten.",
  "icons": {
    "qbell": [
      "....kkkk....",
      "....k..k....",
      "...kkkkkk...",
      "..kyyYYyyk..",
      ".kyyYYYyyyk.",
      ".kyYYyyyyyk.",
      ".kyyyyyyyok.",
      ".kkkkkkkkkk.",
      ".kooookoook.",
      "..kyyykyyk..",
      "...kkkkkk...",
      "............"
    ],
    "qmitten": [
      "............",
      "...kkkkk....",
      "..krrrrrk...",
      ".krrRrrrrk..",
      ".krrrrrrrkk.",
      ".krrrrrrkrk.",
      ".krrrrrrkrk.",
      ".krrrrrrrrk.",
      "..krrrrrrk..",
      "..kSSSSSSk..",
      "..kSSSSSSk..",
      "..kkkkkkkk.."
    ],
    "qadvent": [
      "............",
      "kkkkkkkkkkkk",
      "kgggrgggrggk",
      "kgkkgkkgkkgk",
      "kgkpgkpgkygk",
      "kgkkgkkgkkgk",
      "kggggggggggk",
      "kgkkgkkgkkgk",
      "kgkpgkygkpgk",
      "kgkkgkkgkkgk",
      "kggggggggggk",
      "kkkkkkkkkkkk"
    ],
    "qcandle": [
      ".....y......",
      "....yAy.....",
      "....yAy.....",
      ".....k......",
      "....kcck....",
      "....kcck....",
      "....kcpk....",
      "....kcck....",
      "....kcpk....",
      "...kkcckk...",
      "..kssssssk..",
      "..kkkkkkkk.."
    ]
  },
  "scenes": {
    "g2Envelope": {
      "title": "Otis brings page two of the contract, with no stamp",
      "steps": [
        { "set": { "g2Read": true } },
        { "hook": "walkIn", "with": "otis", "sets": ["otis"] },
        { "say": "otis", "text": "Morning. This one came without a stamp. Without a postmark, either. It was on top of my bag when I opened it, and it was warm." },
        { "narrate": "A grey envelope, sealed in red wax. Inside, one sheet of the same grey paper, numbered 2 at the top." },
        {
          "narrate": { "if": "flag.soulSold", "then": "Page two of a contract you signed in October. You don't remember a page two. You remember the pen, and the ink being warm.", "else": "Page two of a contract that burned in October. It hasn't burned. The Ink only reached the page it was written on." }
        },
        {
          "narrate": { "if": "flag.soulSold", "then": "\"IX. In consideration of the soul received, the Keeper shall hand on such further goods as the Firm supplies, to such persons as the Firm names, until the longest night. On the longest night the Firm shall collect the Keeper in person, to keep the shop downstairs.\"", "else": "\"IX. Should the Keeper by any means void page one, the Keeper shall hand on such further goods as the Firm supplies, to such persons as the Firm names, until the longest night, when the Firm shall collect in person whatever remains owed.\"" }
        },
        { "narrate": "At the very bottom, in type so small you need the loupe: \"Goods returned unused, in the condition supplied, shall be refunded in full.\"" },
        { "say": "otis", "text": "Return to sender? ...No. There's no return address. I looked." },
        { "leave": "otis" },
        { "toast": "Calendar: the longest night. Mr. Quillon collects.", "look": "quillon" }
      ]
    },
    "g2Visit_advent": {
      "title": "Skip Fairweather comes for the Advent calendar",
      "customer": "regular",
      "steps": [
        {
          "say": "regular",
          "text": [
            "Skip Fairweather. There was a note under my door this morning, typed, on grey paper. \"Your parcel is waiting at the pawnshop. Paid in full.\"",
            "I didn't order anything. I never order anything. ...Is that it? An Advent calendar. For the bus. The kids would go mad for it."
          ]
        },
        { "find": "it", "in": "stock", "match": { "g2": "advent" } },
        { "view": { "counterIcon": "qadvent" } },
        {
          "choose": [
            {
              "label": "Hand it over",
              "hint": "(it's paid for)",
              "disabled": "!it",
              "then": [
                { "view": { "counterIcon": null } },
                { "take": "it" },
                { "hook": "fate", "with": { "id": "advent", "fate": "given" } },
                { "rep": -2 },
                { "say": "regular", "text": "Paid in full. Well, Merry Christmas to me." },
                {
                  "hook": "later",
                  "with": { "text": "Every door on Skip's Advent calendar opened on the same morning. It has been Christmas on bus number four ever since: carols at seven, presents under the seats. The kids are exhausted. Nobody can remember what day it is.", "icon": "qadvent" },
                  "note": "a pop-up a moment later: what it did in town"
                }
              ]
            },
            {
              "label": "\"It isn't for you. It isn't for anybody.\"",
              "hint": "(keep it in the back)",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "fate", "with": { "id": "advent", "fate": "kept" } },
                { "set": { "g2Note": true } },
                { "say": "regular", "text": "Not for me? Then who's it for? Fine. The kids made a paper chain. Paper chains don't come with notes." }
              ]
            }
          ]
        },
        { "leave": "regular" }
      ]
    },
    "g2Visit_mitten": {
      "title": "Hal Mayhew comes for the mitten",
      "customer": "regular",
      "steps": [
        {
          "say": "regular",
          "text": [
            "Hal Mayhew. Got a note under the door. Says you're holding a parcel for me, paid for. Typed. Nobody types any more.",
            "One mitten. Well. I've only got the one cold hand. The other's always in a pocket."
          ]
        },
        { "find": "it", "in": "stock", "match": { "g2": "mitten" } },
        { "view": { "counterIcon": "qmitten" } },
        {
          "choose": [
            {
              "label": "Hand it over",
              "hint": "(it's paid for)",
              "disabled": "!it",
              "then": [
                { "view": { "counterIcon": null } },
                { "take": "it" },
                { "hook": "fate", "with": { "id": "mitten", "fate": "given" } },
                { "rep": -2 },
                { "say": "regular", "text": "Paid in full. Well, Merry Christmas to me." },
                {
                  "hook": "later",
                  "with": { "text": "Hal Mayhew's left hand hasn't been cold all week. On Thursday every pipe on Front Street froze at once, and Hal fixed them all, one-handed, whistling.", "icon": "qmitten" },
                  "note": "a pop-up a moment later: what it did in town"
                }
              ]
            },
            {
              "label": "\"It isn't for you. It isn't for anybody.\"",
              "hint": "(keep it in the back)",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "fate", "with": { "id": "mitten", "fate": "kept" } },
                { "set": { "g2Note": true } },
                { "say": "regular", "text": "Suit yourself. Can't hold a pipe wrench in a mitten anyway." }
              ]
            }
          ]
        },
        { "leave": "regular" }
      ]
    },
    "g2Visit_bell": {
      "title": "Captain Nan Ferreira comes for the sleigh bell",
      "customer": "regular",
      "steps": [
        {
          "say": "regular",
          "text": [
            "Captain Nan Ferreira, the Gannet ferry. I had a note. A parcel, it says, paid in full, at the pawnshop.",
            "A bell? Ships have bells. Ferries have horns. ...It's a nice bell, though. Listen to it."
          ]
        },
        { "find": "it", "in": "stock", "match": { "g2": "bell" } },
        { "view": { "counterIcon": "qbell" } },
        {
          "choose": [
            {
              "label": "Hand it over",
              "hint": "(it's paid for)",
              "disabled": "!it",
              "then": [
                { "view": { "counterIcon": null } },
                { "take": "it" },
                { "hook": "fate", "with": { "id": "bell", "fate": "given" } },
                { "rep": -2 },
                { "say": "regular", "text": "Paid in full. Well, Merry Christmas to me." },
                {
                  "hook": "later",
                  "with": { "text": "Captain Nan rang the sleigh bell from the ferry dock. Everyone who ever left Gannet Island came back on the four o'clock boat: her ex-husband, both his brothers, and a man in oilskins who says he left in 1940 and would like his room back.", "icon": "qbell" },
                  "note": "a pop-up a moment later: what it did in town"
                }
              ]
            },
            {
              "label": "\"It isn't for you. It isn't for anybody.\"",
              "hint": "(keep it in the back)",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "fate", "with": { "id": "bell", "fate": "kept" } },
                { "set": { "g2Note": true } },
                { "say": "regular", "text": "Keep it, then. I've got enough people coming back on that boat without anybody calling them." }
              ]
            }
          ]
        },
        { "leave": "regular" }
      ]
    },
    "g2Visit_candle": {
      "title": "Agathe Moss comes for the candle",
      "customer": "regular",
      "steps": [
        {
          "say": "regular",
          "text": [
            "Agathe Moss. A note came, typed, on grey paper. A parcel for me, it says, already paid for.",
            "A candle. I mend clocks, I don't need candles. But it's a pretty one. And paid for."
          ]
        },
        { "find": "it", "in": "stock", "match": { "g2": "candle" } },
        { "view": { "counterIcon": "qcandle" } },
        {
          "choose": [
            {
              "label": "Hand it over",
              "hint": "(it's paid for)",
              "disabled": "!it",
              "then": [
                { "view": { "counterIcon": null } },
                { "take": "it" },
                { "hook": "fate", "with": { "id": "candle", "fate": "given" } },
                { "rep": -2 },
                { "say": "regular", "text": "Paid in full. Well, Merry Christmas to me." },
                {
                  "hook": "later",
                  "with": { "text": "Agathe Moss lit the candle in her window. It's taller now than when she lit it. Every clock in Moss Clock Repair runs backward, and three customers have come in to collect watches they haven't brought in yet.", "icon": "qcandle" },
                  "note": "a pop-up a moment later: what it did in town"
                }
              ]
            },
            {
              "label": "\"It isn't for you. It isn't for anybody.\"",
              "hint": "(keep it in the back)",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "fate", "with": { "id": "candle", "fate": "kept" } },
                { "set": { "g2Note": true } },
                { "say": "regular", "text": "A thing that's paid for and isn't mine. In my trade we call that a mystery, and we leave it in the drawer." }
              ]
            }
          ]
        },
        { "leave": "regular" }
      ]
    },
    "greyCollect": {
      "title": "The longest night: Mr. Quillon collects, downstairs",
      "music": "infernal",
      "steps": [
        { "set": { "g2End": "pending" }, "if": "!flag.g2End" },
        {
          "if": "cue == 'vigil'",
          "then": [
            { "hook": "saveStage", "note": "from the vigil: you go back to it after" },
            {
              "stage": "vigil",
              "actors": [
                { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
                { "id": "quillon", "cast": "quillon", "at": [220, 164], "facingLeft": true }
              ]
            },
            { "narrate": "Late in the night, between one hymn and the next. A draught from the vestry door, warm, which is wrong for December. Mr. Quillon is standing in it, in a grey scarf. Nobody else looks up." },
            { "say": "quillon", "text": "Compliments of the season. Don't worry, they won't miss you. Nobody misses anybody on the longest night." },
            { "narrate": "He opens the vestry door. The vestry isn't there. The stairs are, going down, and it gets warmer with every step." }
          ],
          "else": [
            {
              "stage": "shopNight",
              "actors": [
                { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
                { "id": "quillon", "cast": "quillon", "at": [220, 164], "facingLeft": true }
              ]
            },
            { "narrate": "The longest night. The sun went down at twelve past four. At nine the bell over your door rings, although the door is locked." },
            { "say": "quillon", "text": "Compliments of the season. Shall we? It's the longest night of the year, and I do hate to waste it." },
            { "narrate": "He opens the door to your stockroom. The stockroom isn't there. The stairs are, going down, and it gets warmer with every step." }
          ]
        },
        {
          "hook": "below",
          "with": { "devil": 1, "_d": 0.6, "laugh": false },
          "note": "the Proprietor, awake (js/places/below.js)"
        },
        {
          "stage": "below",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 170] },
            { "id": "quillon", "cast": "quillon", "at": [196, 166], "facingLeft": true },
            { "id": "boss", "cast": "proprietor", "at": [281, 108], "alpha": 0 }
          ]
        },
        { "narrate": "The cavern below, and the river of fire. The Proprietor is awake this time, in a paper crown out of a Christmas cracker, and in a far better mood than the last time." },
        { "say": "boss", "text": "THE LITTLE SHOP ON MAIN STREET. SIT. NO, NOT THERE. THAT'S A SOUL." },
        { "say": "quillon", "text": "Page two, sir. Goods supplied, {flag.g2Sent|or:0}. Goods handed on, {hook:given}. Goods held back, {hook:heldBack}." },
        {
          "if": "flag.soulSold",
          "then": [
            { "say": "boss", "text": "WE HAVE YOUR SOUL ALREADY. SECOND SHELF, NEAR THE END. NOW WE'LL HAVE THE REST OF YOU. EVERY SHOP NEEDS A KEEPER, AND MINE HASN'T HAD ONE SINCE 1952." }
          ],
          "else": [
            { "say": "boss", "text": "PAGE ONE BURNED. PAGE TWO DIDN'T. WHAT'S OWED IS OWED." },
            { "say": "quillon", "text": "(quietly) And I'll have my hat back, when it's convenient.", "if": "flag.devilBeaten" }
          ]
        },
        {
          "choose": [
            {
              "label": "Sign the third page",
              "hint": { "if": "flag.soulSold", "then": "(keep his shop, after hours)", "else": "(the Firm keeps a back room in yours)" },
              "then": [
                { "set": { "g2End": "collected", "greyNights": true } },
                { "coin": 200, "why": "The Firm's wages, in advance" },
                { "rep": -3 },
                { "narrate": "The third page is short. You sign it. The ink is warm again." },
                { "hook": "below", "with": { "laugh": true } },
                {
                  "say": "boss",
                  "text": { "if": "flag.soulSold", "then": "WELCOME TO THE FIRM. DOORS OPEN AT MIDNIGHT. ALL SALES FINAL.", "else": "A BACK ROOM. EVERY SHOP NEEDS ONE. HA! HA HA!" }
                },
                { "hook": "below", "with": { "laugh": false } },
                { "say": "quillon", "text": "Your wages, in advance. We pay on time. It's the one thing people never expect of us." }
              ]
            },
            {
              "label": "Pay what's owed in cash",
              "hint": "(-{hook:price|money})",
              "disabled": "coin < hook.price",
              "then": [
                { "hook": "pay", "with": "Paid off page two of Mr. Quillon's contract" },
                { "set": { "g2End": "settled" } },
                { "say": "quillon", "text": "Cash. Again." },
                { "say": "boss", "text": "TAKE IT, QUILLON. IT'S CHRISTMAS. EVERYBODY PAYS CASH AT CHRISTMAS." },
                { "narrate": "Quillon writes you a receipt in red, blots it, and tears it off the pad. It's cold. It's the only cold thing down here." }
              ]
            },
            {
              "label": "Hand back every curio, unused",
              "disabled": "!hook.full",
              "hint": {
                "if": "hook.full",
                "then": "(the small print)",
                "else": { "if": "hook.given > 0", "then": "(you handed one on)", "else": "(you don't have them all)" }
              },
              "then": [
                { "hook": "returnAll" },
                { "set": { "g2End": "returned" } },
                { "narrate": "You set them on the counter in a row: {hook:curioList}. Still warm. Every tag still on." },
                { "say": "quillon", "text": "...Returned unused. In the condition supplied." },
                { "say": "boss", "text": "QUILLON. DID YOU PUT THE REFUND CLAUSE ON PAGE TWO AGAIN." },
                { "say": "quillon", "text": "It's the law, sir. Consumer protection. I put it in very small type." },
                { "hook": "below", "with": { "laugh": true } },
                { "say": "boss", "text": "HA! FINE. FINE! REFUND THE LITTLE SHOP. IT'S CHRISTMAS." },
                { "hook": "below", "with": { "laugh": false } },
                {
                  "if": "flag.soulSold",
                  "then": [
                    { "set": { "g2SoulBack": true } },
                    { "narrate": "Quillon goes to the second shelf, near the end, and comes back with a jar. The light in it is moving a little faster than the others. He wipes the dust off the ticket with his sleeve before he hands it over." },
                    { "say": "quillon", "text": "Refunded in full. Do try not to sell it again. The paperwork is murder." }
                  ],
                  "else": [
                    { "narrate": "Quillon hands you page two. It catches fire in your fingers without hurting, like the first page." },
                    { "say": "quillon", "text": "Refunded in full. I shall have to write a page three one day. Not this year." }
                  ]
                },
                { "rep": 3 }
              ]
            }
          ]
        },
        { "hook": "below", "with": { "devil": 0 } },
        { "walk": "quillon", "to": [360, 164] },
        { "remove": "quillon" },
        { "remove": "boss" },
        {
          "if": "cue == 'vigil'",
          "then": [
            { "hook": "backToVigil" },
            {
              "narrate": { "if": "flag.g2End == 'collected'", "then": "You come back up through the vestry door. Nobody missed you. Your coat smells of hot iron, and Sister Amabel moves her chair a little further off.", "else": "You come back up through the vestry door. Nobody missed you. The soup is still warm, and the lanterns are still lit." }
            }
          ],
          "else": [
            {
              "stage": "shopNight",
              "actors": [
                { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
              ]
            },
            {
              "narrate": { "if": "flag.g2End == 'collected'", "then": "You climb back up into your own stockroom. It's warmer than it was. It will be warmer from now on.", "else": "You climb back up into your own stockroom. It's just a stockroom again, and very cold, and you have never been so glad of a cold room." }
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "every": "g2-advent", "from": "1-3", "to": "4-1", "cast": "skip", "scene": "g2Visit_advent", "if": "hook.comes.advent" },
    { "every": "g2-mitten", "from": "1-3", "to": "4-1", "cast": "hal", "scene": "g2Visit_mitten", "if": "hook.comes.mitten" },
    { "every": "g2-bell", "from": "1-3", "to": "4-1", "cast": "nanFerreira", "scene": "g2Visit_bell", "if": "hook.comes.bell" },
    { "every": "g2-candle", "from": "1-3", "to": "4-1", "cast": "agathe", "scene": "g2Visit_candle", "if": "hook.comes.candle" }
  ],
  "cues": [
    { "cue": "vigil", "scene": "greyCollect", "if": "flag.g2Read && !flag.g2End", "note": "with The Longest Night drawn too, he collects at the vigil" }
  ],
  "nights": [
    {
      "id": "grey2-collect",
      "window": ["4-1", "4-1"],
      "if": "flag.g2Read && !flag.g2End && !hook.vigilTonight",
      "scene": "greyCollect",
      "test": [
        { "roll": { "soulSold": [true, false] } },
        {
          "if": "flag.soulSold",
          "then": [{ "set": { "devilBeaten": false } }],
          "else": [{ "set": { "devilBeaten": true } }]
        },
        { "set": { "g2Read": true, "g2Sent": 3 } },
        { "hook": "testCurios" }
      ]
    }
  ],
  "calendar": [
    { "id": "grey2-collect", "night": "grey2-collect", "story": "grey2", "where": "Downstairs", "title": "Mr. Quillon collects", "known": "flag.g2Read", "scene": "greyCollect" }
  ],
  "mornings": [
    {
      "if": "!flag.g2End",
      "then": [
        {
          "if": "!flag.g2Read",
          "then": [{ "run": "g2Envelope" }],
          "else": [
            {
              "hook": "deliver",
              "with": "A grey tag on a red thread: \"For {curio.for}. Paid in full. - Q.\"",
              "sets": ["curio"],
              "note": "the next curio, once its day has come and there's room on the shelf"
            },
            { "toast": "On the counter when you came in, unasked: {curio.name}. A grey tag: \"For {curio.for}.\"", "look": "quillon", "if": "curio" },
            {
              "if": "flag.g2Note",
              "note": "the morning after you keep one back",
              "then": [
                { "set": { "g2Note": false } },
                { "toast": "Under the door, grey paper: \"Undelivered. Noted. - Q.\"", "look": "quillon" }
              ]
            }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "hook": "fates", "note": "what became of each curio, kept from here on" },
    { "line": "It was Christmas on Skip's school bus for the whole of December, every day, and the kids still won't talk about it.", "if": "flag.g2Fate.advent == 'given'" },
    { "line": "Every pipe on Front Street froze the week Hal Mayhew's hand got warm. He says the two things aren't connected. He keeps the mitten on.", "if": "flag.g2Fate.mitten == 'given'" },
    { "line": "The man in oilskins is still on Gannet Island. Nobody has the heart to tell him about the room.", "if": "flag.g2Fate.bell == 'given'" },
    { "line": "The clocks in Moss Clock Repair ran backward until New Year's. Agathe charged for the time anyway.", "if": "flag.g2Fate.candle == 'given'" },
    {
      "line": { "if": "flag.g2SoulBack", "then": "Your soul is in a jar behind the counter, between the till and the radio, where you can keep an eye on it. It hums a little in cold weather.", "else": "Page two burned on the longest night, in your own hand, very politely. There is no page three. You check the mail every morning, all the same." },
      "if": "flag.g2End == 'returned'"
    },
    { "line": "You paid off page two in cash on the longest night. The receipt is in the till. It's the only thing in the shop that's never been warm.", "if": "flag.g2End == 'settled'" },
    { "line": "The Crooked Scale keeps two sets of hours now: upstairs until six, and downstairs after midnight, for customers who pay in jars.", "if": "flag.g2End == 'collected'" }
  ],
  "talk": {
    "by": "orsolya",
    "rumour": [
      "Parcels are turning up on doorsteps this month, paid in full, and nobody ordered them. I know that grey paper.",
      "If a man in grey sends you anything, don't pass it on. Hand it back to him the way it came. That's the only thing he ever has to honour."
    ],
    "react": { "returned": "You handed it all back unused? That's the one clause he's ever had to honour. I'll tell the cards. They'll be thrilled.", "settled": "Cash. He takes cash at Christmas. I'll remember that, and I wish I didn't have to.", "collected": "Your shop smells of hot iron after dark now. Don't look at me like that. I can smell it from the boardwalk." },
    "sway": {
      "returned": { "orsolya": 2, "ignatius": 1 },
      "settled": { "orsolya": 1 },
      "collected": { "orsolya": -2, "ignatius": -2 }
    }
  }
});
