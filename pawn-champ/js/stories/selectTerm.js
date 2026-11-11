// Pawn Champ - The First Winter in Office: the first chapter of The Selectmen's Race's long arc
// (round 3, batch T). Docs: docs/quests/MAJOR.md#m11-the-long-arc and docs/SEASONS.md#long-arcs-five.
// Stay-on only: these chapters are never drawn in October.
//
// "The winner has to do the job." Whoever won in October governs, and makes a decision that lands on
// your counter. The payoff is the Annual Town Meeting in March (M32's 'warrant' hub, js/stories/warrant.js).
//   term     The First Winter in Office (November to February): a hearing at Town Hall.
//            Selectman Haines: the marina survey on Pier Nine digs up the old steamer-wharf bell, and the
//            permit hearing decides where it goes. His "commercial improvement fee" is still on your rent.
//            Selectman Bascombe: a snow-emergency parking ban on Front Street, Hal's petition against it,
//            and the binnacle compass she pawns with you to pay the plow driver's overtime herself.
//   meeting  A Year on the Board (js/stories/selectMeeting.js).
// The chapters share a code half: js/quests/selectarc.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "selectTerm",
  "kind": "major",
  "colour": "#4a8ab0",
  "family": "town",
  "title": "The First Winter in Office",
  "arc": "selectmen",
  "months": [2, 3, 4, 5],
  "teaser": { "if": "flag.selectWin == 'gordie'", "then": "Overnight a line of orange survey stakes has gone in down the length of Pier Nine, each with a little flag: HAINES HARBOR MARINA - COMING SOON.", "else": "A notice is taped to every door on Front Street, signed T. Bascombe, Select Board: SNOW EMERGENCY RULES. Underneath, on yours, someone has written \"thanks Tess\" in a way that isn't thanks." },
  "rumour": "The new selectman has made a first decision, and Front Street is not happy about it.",
  "endings": { "backed": "Backed the Board", "opposed": "With the Petition", "deal": "A Deal on the Floor" },
  "outcome": "flag.termEnd",
  "code": "selectarc",
  "about": [
    "The first winter after the election, a chapter of the Pier Nine arc that runs differently depending on who won. If Gordie won, survey stakes are on Pier Nine and he wants your voice at the marina permit hearing, and offers to waive your Front Street fee (§{termGordie}). A dig worker brings in the old steamer-wharf fog bell they found under the pier (§{termBell}), and Tess asks you to bring it to the hearing so the room can see it (§{termTessBell}).",
    "If Tess won, she's brought in a snow-emergency parking ban so the town's one plow can get through, and Front Street is cross about it (§{termTess}). She quietly pawns her father's binnacle compass to pay the plow driver's overtime till March (§{termCompass}), and Hal Mayhew asks you to sign his petition against the ban (§{termHal}).",
    "At the hearing (§{termHearing}) you back the Board (Backed the Board), speak against (With the Petition), or propose a compromise (A Deal on the Floor). For the marina that's half the pier each, which needs the bell, a good reputation or an ally; for the ban it's plowing Front Street first at four in the morning. The fight comes back at Town Meeting in March, in A Year on the Board."
  ],
  "notes": "flag.selectWin == 'gordie' means Selectman Haines won in October (the marina dig); anything else is Selectman Bascombe (the snow emergency).",
  "cast": {
    "digCrew": {
      "name": "A man from the dig crew",
      "look": { "skin": "#c89070", "hair": "#3a2a1a", "hs": 0, "coat": "#e8a020", "style": "puffer", "hat": "beanie", "hatc": "#e86a2a", "beard": "#3a2a1a", "pants": "#3a3a48", "bag": "#5a4a3a" }
    }
  },
  "icons": {
    "binnacle": [
      "....kkkk....",
      "...kyyyyk...",
      "..kyBBBByk..",
      ".kyBBkkBByk.",
      ".kyBkSrkByk.",
      ".kyBBkkBByk.",
      "..kyBBBByk..",
      "...kyyyyk...",
      "....kwwk....",
      "...kwwwwk...",
      "..kwwwwwwk..",
      "..kkkkkkkk.."
    ]
  },
  "uniques": {
    "pierBell": {
      "name": "The Pier Nine bell",
      "icon": "shipbell",
      "cat": "curio",
      "guide": 220,
      "condLabel": "Muddy",
      "tells": [
        "Cast bronze, a foot and a half across, green as a penny. Six feet of harbor mud came off it in your sink.",
        { "text": "Cast round the shoulder: STEAMER WHARF - PIER NINE - 1888. The fog bell that rang the fleet home until the wharf burned in 1931.", "cls": "good" }
      ]
    },
    "binnacle": {
      "name": "A binnacle compass",
      "icon": "binnacle",
      "cat": "curio",
      "guide": 260,
      "condLabel": "Polished",
      "tells": [
        "A brass ship's compass in its own hood, from the wheelhouse of a fishing boat. Somebody polishes it every week.",
        "Engraved on the hood: THERESA B. - HOLLOW NECK. Tess's father named the boat after her the year she was born."
      ]
    }
  },
  "scenes": {
    "termGordie": {
      "title": "Selectman Haines: the marina survey, and a permit hearing",
      "customer": "gordie",
      "steps": [
        {
          "say": "gordie",
          "text": [
            "Selectman Haines! Still sounds good. I say it in the mirror. The marina survey started Monday. Core samples! Stakes! A man with a clipboard!",
            "There's a permit hearing at Town Hall in a couple of weeks. Front Street business owners get a say. I'd love it if you said yes, loudly, near a microphone."
          ]
        },
        { "say": "gordie", "text": "And I know, I know, the commercial improvement fee. Ten dollars. Help me out at the hearing and I can make yours go away. Selectmen can do that. I checked.", "if": "!flag.selectFeeOff" },
        {
          "choose": [
            {
              "label": "\"I'll come to the hearing.\"",
              "then": [{ "say": "gordie", "text": "That's my shopkeeper!" }]
            },
            {
              "label": "\"What happens to the eleven boats?\"",
              "then": [
                { "say": "gordie", "text": "They'll be fine! We keep one. For pictures. I'm kidding. Mostly. There's a plan. It's in committee." }
              ]
            },
            {
              "label": "\"I'll say what I think, Gordie. Not what you think.\"",
              "then": [
                { "say": "gordie", "text": "That's fine! That's democracy! I hate it, but it's fine." }
              ]
            }
          ]
        },
        { "set": { "termIn": true } },
        { "toast": "Calendar: the marina permit hearing at Town Hall", "look": "gordie" },
        { "leave": "gordie" }
      ]
    },
    "termBell": {
      "title": "A man from the dig crew brings in the old steamer-wharf bell",
      "customer": "digger",
      "steps": [
        { "say": "digger", "text": "I work the dig on Pier Nine. The marina survey. We went down six feet under where the old steamer wharf was, and hit this." },
        { "narrate": "He sets it on the counter with both hands, and the whole counter rings: a bronze bell a foot and a half across, green and still muddy." },
        { "say": "digger", "text": "Selectman says anything we find is \"the marina's heritage\", which means his. I say I found it. You want it, it's yours, before somebody decides it's theirs." },
        { "offer": { "unique": "pierBell" }, "persona": "desperate", "asking": 120, "min": 80 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "termBell": "yours" } },
            { "say": "digger", "text": "Good. Don't tell him where you got it. Don't tell anybody. It's going to ring when you set it down, though. It does that." }
          ],
          "else": [
            { "set": { "termBell": "gordie" } },
            { "say": "digger", "text": "Then it goes on the Selectman's desk, and he puts it in a brochure." }
          ]
        },
        { "leave": "digger" }
      ]
    },
    "termTessBell": {
      "title": "Tess asks you to bring the bell to the hearing",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "Tess. Just Tess, this winter. I hear the dig on Pier Nine found the old fog bell.",
            "That bell rang the fleet home through every fog for forty years, until the steamer wharf burned in 1931. My grandfather came home by it. It belongs on the pier, where the boats can hear it."
          ]
        },
        {
          "say": "tess",
          "text": { "if": "flag.termBell == 'yours'", "then": "And I hear it's on your shelf. I'm not asking you to give it to me. I'm asking you to bring it to the hearing, and let the room see it.", "else": "Gordie has it on his desk, I hear, under a lamp. Come to the hearing. Say something. Anything." }
        },
        { "leave": "tess" }
      ]
    },
    "termTess": {
      "title": "Selectman Bascombe: the snow-emergency rule, and a hearing",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "Selectman Bascombe. It still sounds like somebody else. I came about the notice on your door.",
            "When the snow siren goes, nobody parks on Front Street till the plow's been through. We have one plow. It is older than me. Last storm it took nine hours to reach the war memorial, because of the cars.",
            "I know it costs you trade. I'm asking Front Street to back it at the hearing anyway. Hal Mayhew is getting up a petition against. He sells his shovels off the sidewalk, and he can't if nobody can stop."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll come to the hearing.\"",
              "then": [{ "say": "tess", "text": "Thank you. I mean it." }]
            },
            {
              "label": "\"Storm days are half my winter, Tess.\"",
              "then": [
                { "say": "tess", "text": "I know. And the other half is people who could get here because the road was clear. I'm not saying it's fair. I'm saying it's the plow." }
              ]
            },
            {
              "label": "\"Can't the plow do Front Street first?\"",
              "then": [
                { "set": { "termIdea": true } },
                { "say": "tess", "text": "At four in the morning? With one driver, on overtime we don't have? ...Say that at the hearing. Say it loudly." }
              ]
            }
          ]
        },
        { "set": { "termIn": true } },
        { "toast": "Calendar: the snow-emergency hearing at Town Hall", "look": "tess" },
        { "leave": "tess" }
      ]
    },
    "termCompass": {
      "title": "Tess pawns her father's binnacle compass to pay the plow driver",
      "customer": "tess",
      "steps": [
        { "narrate": "Tess comes in two minutes before you close, with the snow on her shoulders and a wooden box under her arm. She waits till the shop is empty." },
        { "say": "tess", "text": "The plow driver's overtime ran out in January. The reserve fund needs Town Meeting to touch it, and Town Meeting is March. The snow doesn't know that." },
        { "view": { "counterIcon": "binnacle" } },
        { "narrate": "In the box, on green felt: a brass binnacle compass from a boat's wheelhouse. THERESA B. - HOLLOW NECK, on the hood." },
        { "say": "tess", "text": "My father's. Off the boat he named for me. I want to pawn it, enough to pay Leon to plow till March, and I want it back before the first boat goes out. Nobody needs to know. Especially not Gordie." },
        {
          "choose": [
            {
              "label": "Lend her $200 until March",
              "hint": "(she owes it back with the usual interest)",
              "disabled": "coin < 200 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "lendCompass", "with": 200, "note": "a loan due the first week of March, however many months away that is" },
                { "set": { "termCompass": 200 } },
                { "say": "tess", "text": "Thank you. That's Leon paid till the thaw. I'll be back for it. I'm always back for things." }
              ]
            },
            {
              "label": "Lend her $140",
              "hint": "(less, and she'll know why)",
              "disabled": "coin < 140 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "lendCompass", "with": 140 },
                { "set": { "termCompass": 140 } },
                { "say": "tess", "text": "That's fair. That's a pawnshop. It'll do most of it. I'll find the rest." }
              ]
            },
            {
              "label": "\"Put it away, Tess. Bring it to the hearing instead and tell them.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "termCompassRefused": true } },
                { "say": "tess", "text": "Tell four hundred people I couldn't make the budget? ...You might be right. I hate that you might be right." }
              ]
            }
          ]
        },
        { "leave": "tess" }
      ]
    },
    "termHal": {
      "title": "Hal Mayhew's petition against the parking ban",
      "customer": "hal",
      "steps": [
        {
          "say": "hal",
          "text": [
            "Hal Mayhew, Mayhew's Hardware. You know the snow-emergency rule. No parking on Front Street when the siren goes.",
            "I sell forty shovels a storm off the sidewalk, and that's with people stopping. I've got a petition. Every business on Front Street has signed but two. You're one. The bakery's the other, and they'll sign if you do."
          ]
        },
        {
          "choose": [
            {
              "label": "Sign Hal's petition",
              "hint": "(the bakery will too)",
              "then": [
                { "set": { "termPetition": true } },
                { "say": "hal", "text": "Good. It's not personal with Tess. It's shovels." }
              ]
            },
            {
              "label": "\"I'll hear it out at the hearing, Hal.\"",
              "then": [{ "say": "hal", "text": "Fair. Bring a shovel. It's supposed to snow." }]
            }
          ]
        },
        { "leave": "hal" }
      ]
    },
    "termHearing": {
      "title": "The Select Board hearing at Town Hall",
      "steps": [
        { "hook": "music", "with": "night" },
        {
          "stage": "townhall",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "gordie", "cast": "gordie", "at": [210, 152], "if": "flag.selectWin == 'gordie'" },
            {
              "id": "gordie",
              "cast": "gordie",
              "at": [210, 152],
              "facingLeft": true,
              "if": "flag.selectWin != 'gordie'"
            },
            { "id": "tess", "cast": "tess", "at": [250, 154], "facingLeft": true },
            { "id": "hal", "cast": "hal", "at": [96, 164], "if": "flag.selectWin != 'gordie'" },
            {
              "id": "neighbor",
              "look": "random",
              "name": "A neighbor",
              "at": [[30, 160], [50, 165], [70, 160]]
            }
          ]
        },
        {
          "if": "flag.selectWin == 'gordie'",
          "then": [
            { "set": { "termBell": "gordie" }, "if": "!flag.termBell" },
            { "narrate": "The marina permit hearing, Town Hall. Snow on every boot, the radiators knocking, and on the Select Board table a set of drawings of Pier Nine with yachts on it." },
            { "say": "gordie", "text": "Folks! A marina. Sixty berths, a fuel dock, a boardwalk, a bistro. People walking up Front Street with money in their hands. Questions? Comments? Compliments?" },
            { "say": "tess", "text": "Where do the eleven boats go?" },
            { "say": "gordie", "text": "That is an excellent question, and it's in committee." },
            {
              "narrate": { "if": "flag.termBell == 'yours'", "then": "The bell is in a canvas bag at your feet. Every time somebody bumps the bench, it hums.", "else": "On the end of the Select Board table, under a desk lamp, sits a green bronze bell. A little card in front of it says MARINA HERITAGE." }
            },
            { "find": "bell", "in": "stock", "match": { "uniqueId": "pierBell" } },
            {
              "choose": [
                {
                  "label": "Back the marina",
                  "hint": { "if": "flag.selectFeeOff", "then": "(Gordie will remember it)", "else": "(and Gordie waives your fee)" },
                  "then": [
                    { "set": { "termEnd": "backed", "selectPier": "marina" } },
                    {
                      "if": "!flag.selectFeeOff",
                      "then": [
                        { "set": { "selectFeeOff": true } },
                        { "say": "gordie", "text": "The chair notes the support of a Front Street business owner. And the chair would like to tell that business owner, privately, that their fee is gone. Poof." }
                      ]
                    },
                    {
                      "if": "flag.termBell == 'yours'",
                      "then": [
                        { "take": "bell" },
                        { "coin": 150, "why": "Gordie bought the Pier Nine bell for the marina", "if": "bell" },
                        { "set": { "termBell": "gordie" } },
                        { "narrate": "You hand him the bell. He pays you a hundred and fifty out of his own wallet, in front of everybody, and rings it. Twice." }
                      ]
                    },
                    { "rep": -1, "why": "Backed the marina at the hearing" },
                    { "sway": "gordie", "by": 2, "why": "Backed the marina" },
                    { "sway": "tess", "by": -2, "why": "Backed the marina" },
                    { "say": "tess", "text": "Right. Noted." },
                    { "narrate": "The permit passes the Select Board two to one. It still needs the money, and the money needs Town Meeting in March." }
                  ]
                },
                {
                  "label": "Speak against it: the fleet stays",
                  "hint": "(the bell goes to the co-op)",
                  "then": [
                    { "set": { "termEnd": "opposed", "selectPier": "fleet" } },
                    { "say": "keeper", "text": "Pier Nine is eleven boats and the families on them. You can't put a fuel dock on that and call it heritage." },
                    {
                      "if": "flag.termBell == 'yours'",
                      "then": [
                        { "take": "bell" },
                        { "set": { "termBell": "pier" } },
                        {
                          "narrate": [
                            "You lift the bell out of the bag and set it on the table. It rings, low and long, the whole length of the hall. The old men in the back row sit up.",
                            "After the hearing the co-op hangs it on a post at the end of Pier Nine. You don't get a penny for it. You don't ask."
                          ]
                        }
                      ]
                    },
                    { "rep": 2, "why": "Spoke for the fleet at the hearing" },
                    { "sway": "tess", "by": 2, "why": "Spoke for the fleet" },
                    { "sway": "gordie", "by": -1, "why": "Spoke against the marina" },
                    { "say": "gordie", "text": "Okay. Okay! Democracy. The chair is... deeply... respectful." },
                    { "narrate": "The permit stalls in committee, two votes to one the other way. Gordie says he'll take it to Town Meeting in March. He says it like a threat and a jingle at once." }
                  ]
                },
                {
                  "label": "Propose a split: berths on the south half, the fleet keeps the north",
                  "hint": { "if": "flag.termBell == 'yours'", "then": "(with the bell on the line between)", "else": "(the room needs a reason to listen)" },
                  "then": [
                    {
                      "if": "flag.termBell == 'yours' || rep >= 55 || hook.voteAlly",
                      "note": "the room listens with the bell, a good name, or a friend in it",
                      "then": [
                        { "set": { "termEnd": "deal", "selectPier": "split", "selectFeeOff": true } },
                        {
                          "if": "flag.termBell == 'yours'",
                          "then": [
                            { "take": "bell" },
                            { "set": { "termBell": "pier" } },
                            { "narrate": "You set the bell on the table, between the drawings. \"Hang it where the yachts stop and the fishing boats start,\" you say, \"and everybody hears it.\"" }
                          ],
                          "else": [
                            { "narrate": "You walk up to the drawings and draw a line down the middle of Pier Nine with Gordie's own pen." }
                          ]
                        },
                        { "say": "tess", "text": "...I could live with that. The north berths are the deep ones anyway." },
                        { "say": "gordie", "text": "Half a marina is still a marina! And as a gesture, the fee for Front Street: gone. For everybody. Write that down, somebody." },
                        { "rep": 3, "why": "Brokered the Pier Nine split" },
                        { "sway": "tess", "by": 1, "why": "The Pier Nine split" },
                        { "sway": "gordie", "by": 1, "why": "The Pier Nine split" }
                      ],
                      "else": [
                        { "set": { "termEnd": "opposed", "selectPier": "fleet" } },
                        {
                          "narrate": [
                            "You stand up and propose splitting the pier. Nobody quite hears it. Gordie talks over the end of it about parking, and Tess talks over him about boats, and the chair calls a recess.",
                            "When it comes back, the permit stalls in committee. Gordie says he'll take it to Town Meeting in March."
                          ]
                        },
                        { "sway": "tess", "by": 1, "why": "Stood up at the hearing" }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "else": [
            { "narrate": "The snow-emergency hearing, Town Hall. Snow on every boot, the radiators knocking. Tess Bascombe is in the chair, in a sweater with a hole in the elbow, looking like she would rather be anywhere with a tide." },
            {
              "say": "hal",
              "text": { "if": "flag.termPetition", "then": "Forty-one signatures, every business on Front Street. No parking ban.", "else": "Thirty-nine signatures, every business on Front Street but two. No parking ban." }
            },
            { "say": "tess", "text": "Noted, Hal. Anyone else?" },
            {
              "choose": [
                {
                  "label": "Back the ban",
                  "hint": "(the plow gets through)",
                  "then": [
                    { "set": { "termEnd": "backed" } },
                    { "say": "keeper", "text": "I lose trade on storm days either way. I'd rather lose it to a clear road than a stuck plow." },
                    { "rep": 1, "why": "Backed the snow-emergency rule" },
                    { "sway": "tess", "by": 2, "why": "Backed the ban" },
                    { "sway": "hal", "by": -1, "why": "Backed the ban" },
                    { "narrate": "The rule passes. Hal folds his petition into his coat and says nothing, which for Hal is a speech." }
                  ]
                },
                {
                  "label": "Speak with Hal against it",
                  "hint": { "if": "flag.termPetition", "then": "(you signed)" },
                  "then": [
                    { "set": { "termEnd": "opposed" } },
                    { "say": "keeper", "text": "Front Street lives on storm days. People come in for a shovel and leave with a lamp. Don't take that off us." },
                    { "rep": 1, "why": "Stood with Hal on the parking ban" },
                    { "sway": "hal", "by": 2, "why": "Stood with the petition" },
                    { "sway": "tess", "by": -2, "why": "Spoke against the ban" },
                    { "narrate": "The rule fails, two to one. Tess bangs the gavel, a little hard. The plow takes eleven hours the next storm. Everybody on Front Street sells a great many shovels." }
                  ]
                },
                {
                  "label": "Propose the plow does Front Street first, at four, so the ban lifts by opening",
                  "hint": { "if": "flag.termIdea", "then": "(you said it to her already)", "else": "(somebody has to pay for four a.m.)" },
                  "then": [
                    { "set": { "termEnd": "deal" } },
                    { "say": "keeper", "text": "Plow Front Street first, at four, and lift the ban when the plow's through. We get our parking back by opening, and the plow gets its road." },
                    { "say": "hal", "text": "Who pays Leon to plow at four in the morning?" },
                    {
                      "if": "flag.termCompass",
                      "then": [
                        { "narrate": "Tess looks at you, very briefly, and doesn't say anything about a compass. Neither do you." }
                      ],
                      "else": [
                        {
                          "if": "flag.termCompassRefused",
                          "then": [
                            {
                              "narrate": [
                                "Tess stands up. \"I'll tell you who's been paying him since January,\" she says, and does, and four hundred people go quiet.",
                                "By the end of the night Hal has put fifty dollars on the table toward Leon's overtime, and so has the bakery, and so, against every instinct, have you."
                              ]
                            },
                            { "hook": "chipIn", "with": "Toward the plow driver's overtime", "note": "fifty dollars, or what you have" }
                          ],
                          "else": [{ "say": "tess", "text": "We'll find it. I'll find it. Write it down." }]
                        }
                      ]
                    },
                    { "rep": 3, "why": "The four a.m. plow" },
                    { "sway": "tess", "by": 1, "why": "The four a.m. plow" },
                    { "sway": "hal", "by": 1, "why": "The four a.m. plow" },
                    { "narrate": "It passes unanimously. On the way out Hal says it was his idea all along, and you let him." }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "term-hook", "from": "1-2", "to": "1-3", "cast": "gordie", "scene": "termGordie", "if": "flag.selectWin == 'gordie'" },
    { "drift": "term-hook", "from": "1-2", "to": "1-3", "cast": "tess", "scene": "termTess", "if": "flag.selectWin != 'gordie'" },
    { "drift": "term-bell", "from": "1-4", "to": "2-2", "cast": "digCrew", "scene": "termBell", "if": "flag.selectWin == 'gordie' && flag.termIn && shelf.free" },
    { "drift": "term-tessbell", "from": "2-3", "to": "3-1", "cast": "tess", "scene": "termTessBell", "if": "flag.selectWin == 'gordie' && flag.termIn && !flag.termEnd" },
    { "drift": "term-compass", "from": "1-4", "to": "2-2", "cast": "tess", "scene": "termCompass", "if": "flag.selectWin != 'gordie' && flag.termIn" },
    { "drift": "term-hal", "from": "2-3", "to": "3-1", "cast": "hal", "scene": "termHal", "if": "flag.selectWin != 'gordie' && flag.termIn && !flag.termEnd" }
  ],
  "nights": [
    {
      "id": "term-hearing",
      "window": ["3-2", "4-3"],
      "if": "flag.termIn && !flag.termEnd",
      "scene": "termHearing",
      "test": [
        { "roll": { "selectWin": ["tess", "gordie"] } },
        { "set": { "termIn": true } },
        { "roll": { "termPetition": [true, false], "termIdea": [true, false] } },
        {
          "if": "flag.selectWin == 'gordie'",
          "then": [
            {
              "if": "random < 0.6",
              "then": [{ "set": { "termBell": "yours" } }, { "add": { "unique": "pierBell" } }]
            }
          ],
          "else": [
            {
              "if": "random < 0.5",
              "then": [{ "set": { "termCompass": 200 } }],
              "else": [{ "set": { "termCompassRefused": true } }]
            }
          ]
        }
      ]
    }
  ],
  "calendar": [
    { "id": "term-hearing", "night": "term-hearing", "story": "selectTerm", "where": "Town Hall", "title": "The Select Board hearing", "known": "flag.termIn", "scene": "termHearing" }
  ],
  "epilogue": [
    {
      "if": "flag.selectWin == 'gordie'",
      "then": [
        { "line": "Pier Nine has drawings of yachts on it at Town Hall. The marina still needs Town Meeting's money. Your fee is gone; Gordie tells people why.", "if": "flag.termEnd == 'backed'" },
        {
          "line": { "if": "flag.termBell == 'pier'", "then": "The old steamer-wharf bell hangs at the end of Pier Nine. The co-op rings it for the first boat in every morning.", "else": "The marina permit is in committee, where Hollow Neck puts things it wants to forget." },
          "if": "flag.termEnd == 'opposed'"
        },
        { "line": "Half a marina on the south side of Pier Nine, the fleet on the north, and the old bell on the line between. The Front Street fee is gone for everybody.", "if": "flag.termEnd == 'deal'" }
      ],
      "else": [
        { "line": "When the snow siren goes, Front Street empties of cars and the plow gets through by noon. Hal Mayhew sells his shovels from the doorway now.", "if": "flag.termEnd == 'backed'" },
        { "line": "No parking ban on Front Street. The plow still takes all day. Hal sells forty shovels a storm, off the sidewalk.", "if": "flag.termEnd == 'opposed'" },
        { "line": "The plow does Front Street first, at four in the morning. By opening, the cars are back. Nobody remembers whose idea it was, and everyone says it was theirs.", "if": "flag.termEnd == 'deal'" }
      ]
    }
  ],
  "talk": {
    "by": "marguerite",
    "rumour": [
      "The new selectman's first big decision is on the Select Board agenda. I have read it. I do not take sides. I did read it twice.",
      "There will be a hearing. There will be folding chairs. There will be, I am told, a petition."
    ],
    "react": { "backed": "You backed the Board at the hearing. The minutes say so, in my handwriting, which is very legible.", "opposed": "You stood with the petition. The chair noted it. The chair notes everything.", "deal": "A deal on the floor of a Select Board hearing. In twenty-two years I have seen it four times. Five, now." },
    "sway": { "backed": { "marguerite": 1 }, "opposed": { "hal": 1 }, "deal": { "marguerite": 2 } }
  }
});
