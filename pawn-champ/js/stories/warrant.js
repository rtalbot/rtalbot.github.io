// Pawn Champ - Town Meeting. Major quest M32, batch P (docs/quests/MAJOR.md#m32-town-meeting-town).
// March, the six-month finale's set piece. The Annual Town Meeting warrant has forty articles, and
// three of them are about The Crooked Scale. The item at the center is the town's 1797 gavel, missing
// since 1968, which the landlord's nephew finds in his late uncle's attic and pawns.
//
// Hook (W1 Tue-Wed)          Marguerite posts the warrant in your window: articles 14, 27 and 38.
// Middle (W1 Thu-W2 Mon)     Kristof Szabo, the landlord's nephew, pawns the old gavel. He is also
//                            the petitioner on Article 27.
// Scene 1 (W2 Tue-Thu)       The Town Hall vault with Marguerite: the three petitions, and the gavel.
// Scene 2 (W3 Mon-Thu)       The meeting before the meeting, at the Rusty Anchor: canvass two of three.
// Finale (hub, W4 Mon-Thu)   The Annual Town Meeting ('warrant' hub, on the townhall background): the
//                            gavel, the three articles, then the rest of the warrant (other stories'
//                            vignettes). This is where standing pays off: ally('vote') and foe('vote').
//
// The hub is this story's own. Batch D's 'meeting' hub (js/quests/selectmen.js) belongs to M11 and
// only runs in October and November. M11's long arc (round 3, batch T) pays off here: Article 31 is
// taken first, from the hub's open, by js/quests/selectarc.js (so it can't be skipped for a vignette).
// How the room scores each article is in js/quests/warrant.js (WARRANT_SCORES).
// What the town says: Marguerite brings the warrant, and minds the gavel (sway: docs/quests/STANDING.md).
// months: [6]: the Annual Town Meeting is in March, and it's the half-year's last big evening.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "warrant",
  "kind": "major",
  "colour": "#7a9a5a",
  "family": "town",
  "title": "Town Meeting",
  "months": [6],
  "crosses": ["miniature"],
  "rumour": "The March warrant has forty articles, and three of them are about your shop.",
  "endings": { "whole": "The Whole Warrant", "carried": "Two Out of Three", "outvoted": "Outvoted" },
  "outcome": "flag.warrantEnd",
  "about": [
    "The March Annual Town Meeting, where three of the forty articles are about your shop: Article 14, making secondhand dealers hold everything thirty days; Article 27, your new landlord's bid to turn 9 Main Street into flats; and Article 38, the Chamber of Commerce wanting your alley for parking (§{warrantPosted}). Marguerite, the moderator, also mentions the town's 1797 gavel, missing since 1968.",
    "Kristof Szabo, the landlord, pawns that gavel; his uncle took it home after losing a vote (§{kristofGavel}). In the Town Hall vault Marguerite shows you the petitions (§{warrantVault}). If you found Cornelius Webb's deed in Main Street in Miniature, the alley is legally yours. Give her the gavel and your articles come up early; keep it to hand over in front of everyone; or sell it to Boston for $300.",
    "At the meeting before the meeting, in the Rusty Anchor (§{warrantCaucus}), you have time for two conversations: offer Szabo $400 down on the building so he withdraws 27, promise Captain Barrow seven days and same-day reports on 14, or offer the Chamber a bench on a footpath instead of parking.",
    "At the meeting (§{warrantOpen}) you speak, let a friend speak, or sit on your hands for each article; friends and foes in town sway the count. Winning all three is The Whole Warrant, two is Two Out of Three, fewer is Outvoted. Other stories' articles, like Article 31 on Pier Nine, are taken here too, along with the dump sticker (§{dumpSticker}) and the snowplow (§{snowplow})."
  ],
  "cast": {
    "kristof": {
      "name": "Kristof Szabo",
      "look": { "skin": "#f0d0b8", "hair": "#3a2a1a", "hs": 1, "coat": "#2a3a4a", "style": "suit", "trim": "#e8e4dc", "pants": "#2a2a32", "glasses": "#1a1a1e", "bag": "#1a1a1e" }
    },
    "chamberMan": {
      "name": "A man from the Chamber of Commerce",
      "look": { "skin": "#e0b898", "hair": "#8a8a8a", "hs": 0, "coat": "#7a2a2a", "style": "jacket", "trim": "#c8a050", "pants": "#3a3a44", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "gavel": [
      "............",
      ".kkkkkkk....",
      "kWWWWWWWk...",
      "kwwyywwwk...",
      "kWWWWWWWk...",
      ".kkkkkkk....",
      "....kck.....",
      ".....kck....",
      "......kck...",
      ".......kck..",
      "........kck.",
      ".........kk."
    ]
  },
  "uniques": {
    "meetingGavel": {
      "name": "The 1797 Meeting House gavel",
      "icon": "gavel",
      "cat": "curio",
      "guide": 240,
      "questKey": true,
      "tells": [
        "Oak head, whalebone handle, worn pale where two hundred years of moderators held it.",
        { "text": "Burned into the end grain: H.N. 1797. A crack down one face, mended with a brass band.", "cls": "good" }
      ]
    }
  },
  "scenes": {
    "warrantPosted": {
      "title": "Marguerite posts the warrant in your window",
      "customer": "marguerite",
      "steps": [
        {
          "say": "marguerite",
          "text": [
            "Marguerite Oyelaran. The Annual Town Meeting warrant, for your window. Every shop on Front Street gets one. Forty articles this year. I have read all forty twice.",
            "Three of them are about you. Article 14, a bylaw for secondhand dealers. Article 27, the new owner of this building wants it rezoned for flats. Article 38, the Chamber wants your alley for parking.",
            "I don't take sides. I'm the moderator. But I can tell you the room listens to people it's seen before. Fourth Monday of the month, seven o'clock. Not seven-oh-five.",
            "And if a gavel comes across your counter, oak, whalebone handle, 1797 burned in the end: it's ours. It went missing in 1968. We've used a soup ladle since. It has a good weight. It is still a ladle."
          ]
        },
        { "set": { "warrantKnown": true } },
        { "toast": "Calendar: the Annual Town Meeting", "look": "marguerite" },
        { "leave": "marguerite" }
      ]
    },
    "kristofGavel": {
      "title": "Kristof Szabo, the new landlord, pawns the old gavel",
      "customer": "kristof",
      "steps": [
        {
          "say": "kristof",
          "text": [
            "Kristof Szabo. I own the building now. Your building. My uncle left it to me, with everything in the attic.",
            "This was in a hatbox with his Navy medals. Oak, a bone handle. \"H.N. 1797.\" My uncle lost a vote in 1968, and I think he took the gavel home. He was like that."
          ]
        },
        { "say": "kristof", "text": "Yes, I'm Article 27. It's nothing personal. Flats are worth twice what a shop is. I do sums for a living.", "if": "flag.warrantKnown" },
        { "say": "kristof", "text": "Hundred and twenty. I'd rather not walk into Town Hall carrying it, if you follow me." },
        { "offer": { "unique": "meetingGavel" }, "persona": "honest", "asking": 120, "min": 80 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "warrantGavel": "away" } },
            { "say": "kristof", "text": "There's a man in Boston who buys this sort of thing. He'll know what it is. I'm not sure I want anyone to know what it is." },
            { "leave": "kristof" },
            { "end": true }
          ]
        },
        { "set": { "warrantGavel": "held" } },
        { "narrate": "When he's gone you weigh it in your hand. It's heavier than it looks. Two hundred years of \"the meeting will come to order\" are in the grain." },
        { "leave": "kristof" }
      ]
    },
    "warrantVault": {
      "title": "The Town Hall vault: three petitions",
      "steps": [
        {
          "stage": "townhallVault",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "marguerite", "cast": "marguerite", "at": [210, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The vault under Town Hall, after the clerk has gone home. Marguerite has the three petitions laid out on the reading table, each one weighted with a stapler." },
        {
          "say": "marguerite",
          "text": [
            "Fourteen. Officer Dunphy's bylaw, with a hundred and four signatures. It's about October. Too much in town went missing and came back on a shelf.",
            "Twenty-seven. Mr. Szabo's, and his alone. An owner can petition for his own building. He has a lawyer from Worcester who writes in green ink.",
            { "if": "flag.miniAlley", "then": "Thirty-eight. The Chamber's parking. Now, the alley. Hester filed Cornelius Webb's deed with the clerk in October: \"to whoever keeps the shop at 9 Main Street\". They'd have to take it from you, in front of everybody. That's harder.", "else": "Thirty-eight. The Chamber's parking. Nobody has owned that alley on paper since 1952. Things nobody owns, a town can take." }
          ]
        },
        { "find": "gavel", "in": "stock", "match": { "uniqueId": "meetingGavel" } },
        {
          "if": "gavel",
          "then": [
            { "say": "marguerite", "text": "And you've brought me something. Oh. Oh, look at it. The crack is still there. My predecessor's predecessor did that, in the dog-licence riot of 1931." },
            {
              "choose": [
                {
                  "label": "Give it back to her now",
                  "hint": "(she'll take your articles early, while the room is fresh)",
                  "then": [
                    { "set": { "warrantGavel": "returned" } },
                    { "edit": "gavel", "set": { "questKey": false, "nosale": false } },
                    { "say": "marguerite", "text": "Thank you. I don't take sides. I do set the order of business. Your three will come early, before the coffee runs out and the room gets mean." },
                    { "rep": 2, "why": "Gave the 1797 gavel back to the town" }
                  ]
                },
                {
                  "label": "Keep it till the meeting, and hand it over in front of everyone",
                  "hint": "(the same, and the room sees it)",
                  "then": [
                    { "set": { "warrantGavel": "held" } },
                    { "say": "marguerite", "text": "In front of everyone. You understand Town Meeting better than most people born here. Your three will come early. Bring it to the rostrum before I call the meeting to order." }
                  ]
                },
                {
                  "label": "Sell it to the dealer in Boston",
                  "hint": "(+$300; she uses the ladle)",
                  "then": [
                    { "set": { "warrantGavel": "sold" } },
                    { "edit": "gavel", "set": { "questKey": false, "nosale": false } },
                    { "coin": 300, "why": "Sold the 1797 gavel to a dealer in Boston" },
                    { "say": "marguerite", "text": "Boston. I see. Then it will be the ladle again. I'll tell the room it's a family heirloom. It is. It's my family's." }
                  ]
                }
              ]
            },
            { "refresh": "panel" }
          ],
          "else": [
            { "say": "marguerite", "text": "Mr. Szabo mentioned, in his green-ink way, that a gavel went to a dealer in Boston. If it's ours, it's gone again. The ladle and I will manage.", "if": "flag.warrantGavel == 'away'" }
          ]
        },
        { "say": "marguerite", "text": "There is a meeting before the meeting, at the Rusty Anchor. There always is. If you want to change minds, that's where minds are changed. Not at seven o'clock in the hall." },
        { "set": { "warrantVault": true } },
        { "toast": "Calendar: the meeting before the meeting, at the Rusty Anchor", "look": "marguerite" }
      ]
    },
    "warrantCaucus": {
      "title": "The meeting before the meeting, at the Rusty Anchor",
      "note": "Who you can talk to depends on who's in town: the regular if they're here, someone else if not.",
      "steps": [
        { "hook": "startCanvass", "note": "flag.warrantCanvass: which articles you've won a vote for" },
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "hold", "cast": "dunphy", "at": [220, 162], "facingLeft": true, "if": "hook.dunphyHere" },
            { "id": "hold", "cast": "barrow", "at": [220, 162], "facingLeft": true, "if": "!hook.dunphyHere" },
            { "id": "use", "cast": "kristof", "at": [290, 166], "facingLeft": true },
            { "id": "alley", "cast": "gordie", "at": [360, 162], "facingLeft": true, "if": "hook.gordieHere" },
            {
              "id": "alley",
              "cast": "chamberMan",
              "at": [360, 162],
              "facingLeft": true,
              "if": "!hook.gordieHere"
            }
          ]
        },
        { "narrate": "The Rusty Anchor, the Thursday before Town Meeting. Every table has a warrant on it, folded to a different page. Somebody has written a vote count on a beer mat." },
        { "narrate": "Ruthie Kroll is running a book on how late the meeting goes. The favorite is eleven fifty-two.", "if": "hook.ruthieHere" },
        { "narrate": "You have time for two conversations before the room gets too loud." },
        {
          "choose": [
            {
              "label": "Talk to {hold.name} about Article 14",
              "if": "!talkedHold",
              "then": [
                { "hook": "talked", "with": "hold", "sets": ["talkedHold"] },
                {
                  "say": "hold",
                  "text": { "if": "hook.dunphyHere", "then": "It's not about you. It's about October. A lot went across counters in October.", "else": "Officer Dunphy wrote it. I signed it. I sign most of what Dunphy writes. It saves time." }
                },
                {
                  "choose": [
                    {
                      "label": "\"Seven days, not thirty. And I report anything on the list the day it comes in.\"",
                      "then": [
                        {
                          "if": "heat < 50",
                          "then": [
                            { "hook": "canvassed", "with": "hold" },
                            { "say": "hold", "text": "Seven days. I could stand up for seven days. I could stand up and say \"seven\" quite loudly." }
                          ],
                          "else": [
                            { "say": "hold", "text": "With what's been through your back room this winter? I'd like to. I can't." }
                          ]
                        }
                      ]
                    },
                    {
                      "label": "\"Thirty days and I'm a storage unit with a bell on the door.\"",
                      "then": [
                        { "say": "hold", "text": "Then you'll be a storage unit with a very nice bell." }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "Talk to {use.name} about Article 27",
              "if": "!talkedUse",
              "then": [
                { "hook": "talked", "with": "use", "sets": ["talkedUse"] },
                { "say": "use", "text": "I like the shop. I do. But four flats with a harbor view pay three times the rent. I'd be a fool, and my lawyer would tell everybody." },
                {
                  "choose": [
                    {
                      "label": "Make him an offer for the building",
                      "hint": "($400 down, the rest on a note; he withdraws the article)",
                      "disabled": "coin < 400",
                      "then": [
                        { "coin": -400, "why": "A down payment on 9 Main Street" },
                        { "set": { "warrantBuilding": true } },
                        { "hook": "canvassed", "with": "use" },
                        {
                          "say": "use",
                          "text": [
                            "You want to buy it. You. With money from the till. My lawyer is going to be furious. I'm going to enjoy telling him.",
                            "Done. I'll withdraw Twenty-seven from the floor. There's a form. There's always a form."
                          ]
                        }
                      ]
                    },
                    {
                      "label": "\"Ask anyone in this bar what they got back across that counter.\"",
                      "then": [
                        { "hook": "canvassed", "with": "use" },
                        { "narrate": "You ask. A fisherman tells him about his father's watch. A teacher tells him about a guitar. Ruthie tells him about a ring. He goes quiet, and buys his own drink." },
                        { "say": "use", "text": "I still want the flats. I just don't want to be the man who said so out loud." }
                      ]
                    },
                    {
                      "label": "\"Your uncle kept the rent low for forty years. Ask yourself why.\"",
                      "then": [
                        { "say": "use", "text": "He kept it low because he was lonely and liked the woman who ran it. That isn't a business model." }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "Talk to {alley.name} about Article 38",
              "if": "!talkedAlley",
              "then": [
                { "hook": "talked", "with": "alley", "sets": ["talkedAlley"] },
                {
                  "say": "alley",
                  "text": { "if": "hook.gordieHere", "then": "Parking! People want to park! You can't sell a Buick to a man who can't park the one he's got!", "else": "The Chamber feels Main Street is under-parked. The Chamber has a chart." }
                },
                {
                  "choose": [
                    {
                      "label": "\"Leave it open as a footpath, put a bench in, and I'll put your sign up in my window.\"",
                      "then": [
                        { "hook": "canvassed", "with": "alley" },
                        {
                          "say": "alley",
                          "text": { "if": "hook.gordieHere", "then": "A bench with my name on it? You drive a hard bargain. That's a compliment. Done.", "else": "A bench. The Chamber does like a bench. I'll take it to the Chamber." }
                        }
                      ]
                    },
                    {
                      "label": "\"The alley is the town's shortcut to the harbor. Pave it and see who thanks you.\"",
                      "then": [
                        { "say": "alley", "text": "Nobody thanks anybody for parking. That's what's wrong with this country." }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "Buy a round and listen instead",
              "then": [
                { "narrate": "You buy a round. You learn that nobody in the bar has read past Article 9, and that everybody has an opinion on Article 38." },
                { "hook": "talked", "with": "round", "sets": ["talkedRound"] }
              ]
            }
          ]
        },
        {
          "if": "!talkedRound",
          "then": [
            {
              "choose": [
                {
                  "label": "Talk to {hold.name} about Article 14",
                  "if": "!talkedHold",
                  "then": [
                    { "hook": "talked", "with": "hold", "sets": ["talkedHold"] },
                    {
                      "say": "hold",
                      "text": { "if": "hook.dunphyHere", "then": "It's not about you. It's about October. A lot went across counters in October.", "else": "Officer Dunphy wrote it. I signed it. I sign most of what Dunphy writes. It saves time." }
                    },
                    {
                      "choose": [
                        {
                          "label": "\"Seven days, not thirty. And I report anything on the list the day it comes in.\"",
                          "then": [
                            {
                              "if": "heat < 50",
                              "then": [
                                { "hook": "canvassed", "with": "hold" },
                                { "say": "hold", "text": "Seven days. I could stand up for seven days. I could stand up and say \"seven\" quite loudly." }
                              ],
                              "else": [
                                { "say": "hold", "text": "With what's been through your back room this winter? I'd like to. I can't." }
                              ]
                            }
                          ]
                        },
                        {
                          "label": "\"Thirty days and I'm a storage unit with a bell on the door.\"",
                          "then": [
                            { "say": "hold", "text": "Then you'll be a storage unit with a very nice bell." }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "Talk to {use.name} about Article 27",
                  "if": "!talkedUse",
                  "then": [
                    { "hook": "talked", "with": "use", "sets": ["talkedUse"] },
                    { "say": "use", "text": "I like the shop. I do. But four flats with a harbor view pay three times the rent. I'd be a fool, and my lawyer would tell everybody." },
                    {
                      "choose": [
                        {
                          "label": "Make him an offer for the building",
                          "hint": "($400 down, the rest on a note; he withdraws the article)",
                          "disabled": "coin < 400",
                          "then": [
                            { "coin": -400, "why": "A down payment on 9 Main Street" },
                            { "set": { "warrantBuilding": true } },
                            { "hook": "canvassed", "with": "use" },
                            {
                              "say": "use",
                              "text": [
                                "You want to buy it. You. With money from the till. My lawyer is going to be furious. I'm going to enjoy telling him.",
                                "Done. I'll withdraw Twenty-seven from the floor. There's a form. There's always a form."
                              ]
                            }
                          ]
                        },
                        {
                          "label": "\"Ask anyone in this bar what they got back across that counter.\"",
                          "then": [
                            { "hook": "canvassed", "with": "use" },
                            { "narrate": "You ask. A fisherman tells him about his father's watch. A teacher tells him about a guitar. Ruthie tells him about a ring. He goes quiet, and buys his own drink." },
                            { "say": "use", "text": "I still want the flats. I just don't want to be the man who said so out loud." }
                          ]
                        },
                        {
                          "label": "\"Your uncle kept the rent low for forty years. Ask yourself why.\"",
                          "then": [
                            { "say": "use", "text": "He kept it low because he was lonely and liked the woman who ran it. That isn't a business model." }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "Talk to {alley.name} about Article 38",
                  "if": "!talkedAlley",
                  "then": [
                    { "hook": "talked", "with": "alley", "sets": ["talkedAlley"] },
                    {
                      "say": "alley",
                      "text": { "if": "hook.gordieHere", "then": "Parking! People want to park! You can't sell a Buick to a man who can't park the one he's got!", "else": "The Chamber feels Main Street is under-parked. The Chamber has a chart." }
                    },
                    {
                      "choose": [
                        {
                          "label": "\"Leave it open as a footpath, put a bench in, and I'll put your sign up in my window.\"",
                          "then": [
                            { "hook": "canvassed", "with": "alley" },
                            {
                              "say": "alley",
                              "text": { "if": "hook.gordieHere", "then": "A bench with my name on it? You drive a hard bargain. That's a compliment. Done.", "else": "A bench. The Chamber does like a bench. I'll take it to the Chamber." }
                            }
                          ]
                        },
                        {
                          "label": "\"The alley is the town's shortcut to the harbor. Pave it and see who thanks you.\"",
                          "then": [
                            { "say": "alley", "text": "Nobody thanks anybody for parking. That's what's wrong with this country." }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "Buy a round and listen instead",
                  "then": [
                    { "narrate": "You buy a round. You learn that nobody in the bar has read past Article 9, and that everybody has an opinion on Article 38." }
                  ]
                }
              ]
            }
          ]
        },
        { "set": { "warrantCaucus": true } }
      ]
    },
    "warrantOpen": {
      "title": "The Annual Town Meeting: the gavel, and your three articles",
      "steps": [
        {
          "stage": "townhall",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "marguerite", "cast": "marguerite", "at": [226, 148], "facingLeft": true },
            {
              "id": "voter",
              "look": "random",
              "name": "A voter",
              "at": [[30, 160], [50, 165], [70, 160], [90, 165], [110, 160]]
            }
          ]
        },
        { "hook": "evening", "note": "the night music, and you as the keeper other stories' parts of the evening talk through" },
        { "narrate": "The Annual Town Meeting. Four hundred folding chairs, mud on every boot, the coffee urn already gurgling. The whole of Hollow Neck has come out of the winter to argue." },
        { "find": "gavel", "in": "stock", "match": { "uniqueId": "meetingGavel" } },
        {
          "if": "flag.warrantGavel == 'held' && gavel",
          "then": [
            { "narrate": "Before seven you walk to the rostrum and put the old gavel in Marguerite's hand. She turns it over, finds H.N. 1797 with her thumb, and doesn't say anything for a moment." },
            { "edit": "gavel", "set": { "questKey": false, "nosale": false } },
            { "refresh": "panel" },
            { "say": "marguerite", "text": "This gavel was carried out of this hall in 1968 by a man who lost a vote. It has been brought back by someone who's about to stand for three. The chair notes it. The chair does not take sides." },
            { "narrate": "She brings it down once. The sound goes all the way to the back of the hall. People who were born after 1968 clap without knowing why." },
            { "rep": 4, "why": "Brought the 1797 gavel home to Town Meeting" },
            { "set": { "warrantGavel": "home" } }
          ],
          "else": [
            { "say": "marguerite", "text": "This meeting will come to order." },
            {
              "narrate": { "if": "flag.warrantGavel == 'returned'", "then": "She brings the 1797 gavel down, and the old-timers in the front row sit up as if somebody had called their names.", "else": "She brings the soup ladle down on the rostrum. It rings. It is still a ladle." }
            }
          ]
        },
        { "hook": "startVotes", "note": "your articles come early if the gavel came home" },
        {
          "say": "marguerite",
          "text": { "if": "flag.warrantGavel == 'returned' || flag.warrantGavel == 'home'", "then": "The chair will take Articles 14, 27 and 38 first, while we're all still awake. Objections? None. Good.", "else": "Article 1. Article 2. Articles 3 through 13 by consent... Article 14." }
        },
        { "narrate": "Article 14, by petition: that every secondhand dealer in town hold each item thirty days before sale, and copy every ticket to the police." },
        { "hook": "score", "with": "hold", "note": "the room before anyone speaks: what you did this month and before, your canvassing, and an early slot" },
        {
          "hook": "foe",
          "sets": ["foe"],
          "note": "standing (js/standing.js): a foe stands up against you once"
        },
        { "narrate": "{foe.name} stands up against it, and says your name more than once.", "if": "foe" },
        { "hook": "friend", "sets": ["friend"], "note": "and a friend can carry one vote for you, once" },
        {
          "choose": [
            {
              "label": "Stand up and speak",
              "hint": "(the room listens)",
              "then": [
                {
                  "choose": [
                    {
                      "label": "\"Thirty days and nobody can sell a coat back to its owner before the weather turns.\"",
                      "then": [
                        { "narrate": "You stand. Thirty days and nobody can sell a coat back to its owner before the weather turns. Somebody says \"hear, hear\", and somebody else says \"who's that?\"" }
                      ]
                    },
                    {
                      "label": "\"I already report what's on the list. Ask Captain Barrow.\"",
                      "then": [
                        { "narrate": "You stand. I already report what's on the list. Ask Captain Barrow. Somebody says \"hear, hear\", and somebody else says \"who's that?\"" }
                      ]
                    }
                  ]
                },
                { "hook": "add", "with": 1 }
              ]
            },
            {
              "label": "Let {friend.name} speak for you",
              "hint": "(a friend carries a vote)",
              "if": "friend",
              "then": [
                { "hook": "friendSpeaks", "note": "+2" },
                { "narrate": "{friend.name} stands up before you can, and talks for three minutes without notes. Two rows nod. Then four." }
              ]
            },
            {
              "label": "Sit on your hands",
              "then": [
                { "narrate": "You sit on your hands. The debate goes on without you, for forty minutes." }
              ]
            }
          ]
        },
        { "say": "marguerite", "text": "All those in favor? ... Opposed? ... The chair is in doubt. Tellers, count." },
        { "hook": "count", "with": "hold", "sets": ["won"], "note": "two points carries it" },
        {
          "narrate": { "if": "won", "then": "Article 14 fails, eighty-one to a hundred and twelve. The register stays a register.", "else": "Article 14 passes. From April, everything on your shelves sits for thirty days first." }
        },
        { "narrate": "Article 27, by petition of the owner: that 9 Main Street be rezoned from commercial to residential. Four flats. No shop." },
        {
          "if": "flag.warrantBuilding",
          "then": [
            { "say": "marguerite", "text": "The chair recognizes Mr. Szabo, who has... withdrawn the article. There is a form. It is in order. Article 27 is withdrawn." },
            { "narrate": "Somebody in the back row whoops. Kristof Szabo, in the front row, studies the ceiling." },
            { "hook": "withdrawn" }
          ],
          "else": [
            { "hook": "score", "with": "use", "note": "the room before anyone speaks: what you did this month and before, your canvassing, and an early slot" },
            {
              "hook": "foe",
              "sets": ["foe"],
              "note": "standing (js/standing.js): a foe stands up against you once"
            },
            { "narrate": "{foe.name} stands up against it, and says your name more than once.", "if": "foe" },
            { "hook": "friend", "sets": ["friend"], "note": "and a friend can carry one vote for you, once" },
            {
              "choose": [
                {
                  "label": "Stand up and speak",
                  "hint": "(the room listens)",
                  "then": [
                    {
                      "choose": [
                        {
                          "label": "\"Odile kept that shop open through nine winters worse than this one.\"",
                          "then": [
                            { "narrate": "You stand. Odile kept that shop open through nine winters worse than this one. Somebody says \"hear, hear\", and somebody else says \"who's that?\"" }
                          ]
                        },
                        {
                          "label": "\"Ask anybody here what they've pawned with us, and what they got back.\"",
                          "then": [
                            { "narrate": "You stand. Ask anybody here what they've pawned with us, and what they got back. Somebody says \"hear, hear\", and somebody else says \"who's that?\"" }
                          ]
                        }
                      ]
                    },
                    { "hook": "add", "with": 1 }
                  ]
                },
                {
                  "label": "Let {friend.name} speak for you",
                  "hint": "(a friend carries a vote)",
                  "if": "friend",
                  "then": [
                    { "hook": "friendSpeaks", "note": "+2" },
                    { "narrate": "{friend.name} stands up before you can, and talks for three minutes without notes. Two rows nod. Then four." }
                  ]
                },
                {
                  "label": "Sit on your hands",
                  "then": [
                    { "narrate": "You sit on your hands. The debate goes on without you, for forty minutes." }
                  ]
                }
              ]
            },
            { "say": "marguerite", "text": "All those in favor? ... Opposed? ... The chair is in doubt. Tellers, count." },
            { "hook": "count", "with": "use", "sets": ["won"], "note": "two points carries it" },
            {
              "narrate": { "if": "won", "then": "Article 27 fails. 9 Main Street stays a shop, on paper, for as long as anyone wants it to be.", "else": "Article 27 passes. When your lease is up, 9 Main Street becomes four flats with a view of the harbor." }
            }
          ]
        },
        { "narrate": "Article 38, by petition of the Chamber of Commerce: that the Town take the alley behind Main Street for municipal parking." },
        { "hook": "score", "with": "alley", "note": "the room before anyone speaks: what you did this month and before, your canvassing, and an early slot" },
        {
          "hook": "foe",
          "sets": ["foe"],
          "note": "standing (js/standing.js): a foe stands up against you once"
        },
        { "narrate": "{foe.name} stands up against it, and says your name more than once.", "if": "foe" },
        { "hook": "friend", "sets": ["friend"], "note": "and a friend can carry one vote for you, once" },
        {
          "choose": [
            {
              "label": "Stand up and speak",
              "hint": "(the room listens)",
              "then": [
                {
                  "choose": [
                    {
                      "label": "\"That alley is where the deliveries come. Pave it and the bakery's flour comes through my front door.\"",
                      "then": [
                        { "narrate": "You stand. That alley is where the deliveries come. Pave it and the bakery's flour comes through my front door. Somebody says \"hear, hear\", and somebody else says \"who's that?\"" }
                      ]
                    },
                    {
                      "label": "\"People cut through there to the harbor. They have since 1890.\"",
                      "then": [
                        { "narrate": "You stand. People cut through there to the harbor. They have since 1890. Somebody says \"hear, hear\", and somebody else says \"who's that?\"" }
                      ]
                    }
                  ]
                },
                { "hook": "add", "with": 1 }
              ]
            },
            {
              "label": "Let {friend.name} speak for you",
              "hint": "(a friend carries a vote)",
              "if": "friend",
              "then": [
                { "hook": "friendSpeaks", "note": "+2" },
                { "narrate": "{friend.name} stands up before you can, and talks for three minutes without notes. Two rows nod. Then four." }
              ]
            },
            {
              "label": "Sit on your hands",
              "then": [
                { "narrate": "You sit on your hands. The debate goes on without you, for forty minutes." }
              ]
            }
          ]
        },
        { "say": "marguerite", "text": "All those in favor? ... Opposed? ... The chair is in doubt. Tellers, count." },
        { "hook": "count", "with": "alley", "sets": ["won"], "note": "two points carries it" },
        {
          "narrate": { "if": "won", "then": "Article 38 fails. The alley stays an alley.", "else": "Article 38 passes. Eleven parking spaces, and a meter outside your back door." }
        },
        { "hook": "result", "note": "flag.warrantVotes and warrantEnd; reputation +2 for each article won, -2" },
        { "say": "marguerite", "text": "The rest of the warrant. Thirty-seven articles. I intend for us to be home by eleven." },
        { "cue": "warrant", "note": "other stories' business on tonight's floor: Article 31 (A Year on the Board, js/stories/selectMeeting.js)" }
      ]
    },
    "warrantClose": {
      "title": "The meeting closes",
      "steps": [
        {
          "narrate": {
            "if": "flag.warrantEnd == 'whole'",
            "then": "At eleven fifty-two the last article carries. On the way out, three people you don't know shake your hand, and one asks if you buy fishing reels.",
            "else": { "if": "flag.warrantEnd == 'carried'", "then": "At eleven fifty-two Marguerite closes the meeting. You won some and lost one. In Hollow Neck that counts as a very good year.", "else": "At eleven fifty-two Marguerite closes the meeting. Outside, the mud has frozen again. Somebody you've sold a coat to holds the door for you anyway." }
          }
        },
        { "narrate": "Everyone stacks their own chair, as usual." }
      ]
    },
    "dumpSticker": {
      "title": "Town Meeting, Article 6: the dump sticker",
      "steps": [
        {
          "narrate": [
            "Article 6: to see if the Town will charge for a dump sticker. A woman from Cove Road reads a poem she has written about the dump. It rhymes \"transfer station\" with \"abomination\".",
            "The article fails. The poem gets a standing ovation."
          ]
        }
      ]
    },
    "snowplow": {
      "title": "Town Meeting, Article 19: the snowplow, again",
      "steps": [
        {
          "narrate": [
            "Article 19: to see if the Town will repair the snowplow it bought last year. The Highway Department shows a photograph. Nobody gasps this time. Somebody laughs, and is shushed.",
            "It passes. The Highway Department promises a better photograph next year."
          ]
        },
        { "rep": 1 }
      ]
    }
  },
  "hub": {
    "id": "warrant",
    "title": "The Annual Town Meeting",
    "where": "Town Hall",
    "window": ["4-1", "4-4"],
    "picks": 2,
    "open": "warrantOpen",
    "close": "warrantClose",
    "note": "M11's long arc (A Year on the Board, js/stories/selectMeeting.js) takes Article 31 at the end of the open, on the warrant cue, so it can't be skipped for a vignette.",
    "test": [
      { "set": { "warrantKnown": true, "warrantGavel": "held" } },
      { "add": { "unique": "meetingGavel" } },
      { "set": { "warrantCanvass": { "hold": true } } }
    ]
  },
  "vignettes": [
    { "hub": "warrant", "label": "Article 6: the dump sticker", "scene": "dumpSticker", "note": "ordinary business, so the rest of the warrant has something on it" },
    { "hub": "warrant", "label": "Article 19: the snowplow, again", "scene": "snowplow" }
  ],
  "nights": [
    {
      "id": "warrant-vault",
      "window": ["2-2", "2-4"],
      "if": "flag.warrantKnown && !flag.warrantVault",
      "scene": "warrantVault",
      "test": [
        { "set": { "warrantKnown": true, "warrantGavel": "held" } },
        { "add": { "unique": "meetingGavel" } }
      ]
    },
    {
      "id": "warrant-caucus",
      "window": ["3-1", "3-4"],
      "if": "flag.warrantVault && !flag.warrantCaucus",
      "scene": "warrantCaucus",
      "test": [{ "set": { "warrantVault": true } }, { "hook": "setCoin", "with": 500 }]
    }
  ],
  "beats": [
    { "drift": "warrant", "from": "1-2", "to": "1-3", "cast": "marguerite", "scene": "warrantPosted" },
    { "drift": "warrant", "from": "1-4", "to": "2-1", "cast": "kristof", "scene": "kristofGavel", "if": "!flag.warrantGavel" }
  ],
  "calendar": [
    { "id": "warrant-vault", "night": "warrant-vault", "story": "warrant", "where": "The Town Hall vault", "title": "Three petitions", "known": "flag.warrantKnown", "scene": "warrantVault" },
    { "id": "warrant-caucus", "night": "warrant-caucus", "story": "warrant", "where": "The Rusty Anchor", "title": "The meeting before the meeting", "known": "flag.warrantVault", "scene": "warrantCaucus" },
    { "id": "warrant-meeting", "night": "hub-warrant", "story": "warrant", "where": "Town Hall", "title": "The Annual Town Meeting", "known": "flag.warrantKnown" }
  ],
  "epilogue": [
    {
      "if": "flag.warrantVotes",
      "then": [
        { "line": "Every article about The Crooked Scale went your way at Town Meeting. Marguerite Oyelaran says she doesn't take sides. She also says she has never seen that before.", "if": "flag.warrantEnd == 'whole'" },
        { "line": "You own 9 Main Street now, or the bank does, or Kristof Szabo does until the note is paid. The sign over the door is yours either way.", "if": "flag.warrantBuilding" },
        { "line": "9 Main Street is zoned for flats when the lease is up. You have a year. People keep asking what you'll do. You keep the shop open.", "if": "!flag.warrantBuilding && !flag.warrantVotes.use" },
        { "line": "Thirty days on every item, by bylaw. The back room is full of things waiting to be allowed to be sold.", "if": "!flag.warrantVotes.hold" },
        { "line": "There is a parking meter outside your back door. The bakery's flour comes through your front.", "if": "!flag.warrantVotes.alley" },
        { "line": "The alley is a footpath now, with a bench. The bench has a small brass plate on it, and somebody else's name.", "if": "flag.warrantVotes.alley && flag.warrantCanvass.alley" },
        { "line": "The 1797 gavel is back on the rostrum. Marguerite keeps the soup ladle in a drawer, for emergencies.", "if": "flag.warrantGavel == 'home'" },
        { "line": "Town Meeting is still called to order with a soup ladle. A gavel marked H.N. 1797 sits in a shop window in Boston, unsold.", "if": "flag.warrantGavel == 'sold'" }
      ]
    }
  ],
  "talk": {
    "by": "marguerite",
    "rumour": [
      "Forty articles on the March warrant. Forty. I've asked for coffee for five hundred.",
      "Three of them have your shop's address on them. I don't take sides. I do read addresses."
    ],
    "react": { "whole": "Three for three. I don't take sides. I did write it down in the minutes in very neat handwriting.", "carried": "Two out of three at Town Meeting. In this town that's a landslide. Ask Thaddeus Gorham.", "outvoted": "The room went against you. It does that. It went against me in 2009 over a crosswalk, and I'm still here, and so is the crosswalk." },
    "sway": {
      "whole": { "marguerite": 2, "dunphy": -1, "gordie": -1 },
      "carried": { "marguerite": 1 },
      "outvoted": { "dunphy": 1, "gordie": 1 }
    }
  }
});
