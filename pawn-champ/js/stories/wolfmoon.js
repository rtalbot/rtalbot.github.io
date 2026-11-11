// Pawn Champ - The Wolf Moon: the Grey Psalter's long arc. Round 3, batch S.
// docs/quests/MAJOR.md#the-wolf-moon-m4s-long-arc. Stay-on only.
//
// The Wolf Moon (major, January, month 4): the Pack wasn't cured in October (Lost to the Marsh,
// Evidence Locker, Merrit Eaten), so it has grown at every full moon since, and the newest member
// goes on the stake at the Wolf Moon. It's in the bylaws.
//   Hook (W1 Tue-Thu)     Professor Pye: the Pack has a new member a month, the Wolf Moon is the one
//                         night the demon has to come all the way out of the book, and a book shut
//                         while it's out can't be got back into. The old cures still work.
//   Middle (W2 Mon-Wed)   The newest member (a seeded regular) shops for the Wolf Moon in felt ears.
//   Middle (W2 Thu-W3 Tue) Desmond Wick at the back door at dusk, cold and more wolf than he was.
//                         Help him (he'll trust you) or call Captain Barrow (the Pack hears).
//   Finale (W3 Thu)       Hob's Wood in the snow: twice the hoods, and the regular on the stake.
// Its echo, Out of Habit, is js/stories/psalterEcho.js. Code half: js/quests/wolfmoon.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "wolfmoon",
  "kind": "major",
  "colour": "#b08ad0",
  "family": "uncanny",
  "title": "The Wolf Moon",
  "arc": "psalter",
  "after": ["partial", "watch", "none"],
  "months": [4],
  "teaser": "Paw prints in the snow on the shop step, going round the building twice.",
  "rumour": "The Pack has grown since October. There are felt ears in the pews at Saint Brine's.",
  "endings": { "cured": "The Moon Goes Down", "returned": "Home to the Shop", "pack": "The Pack Grows" },
  "outcome": "flag.moonEnd",
  "about": [
    "January's chapter of the Psalter arc, for when October ended with the book still loose (Desmond lost in the woods, the book in an evidence locker it escaped from, or Merrit eaten). Professor Pye explains (§{moonPye}): the Pack has grown by one member a month, and at the Wolf Moon the newest goes on the stake. This year that's one of your regulars, Dory, Ruthie, Bev, Hal or Gordie, picked by the run.",
    "In week 2 the new member comes in wearing felt ears to buy silver or a blade for the night (§{moonRecruitShops}); each sale feeds the Pack, and you can warn them that the stake isn't a figure of speech. At dusk Desmond scratches at the back door, more wolf than man (§{moonDesmond}): giving him money and your scarf earns the trust you need later, while phoning Barrow only feeds the Pack.",
    "At the Wolf Moon in Hob's Wood (§{wolfMoon}), the demon comes all the way out of the book to feed. The old cures still work (amber, true silver, the Ink), and so does the new one: shut the book while the demon is out, if Pye told you when. Or ask Desmond to hand the book back, if he trusts you. If the Pack has been fed too well, silver and shutting the book fail.",
    "The Moon Goes Down: the demon is gone and the Pack takes its ears off. Home to the Shop: Desmond gives the book back and it lives on your high shelf, wrapped in your scarf. The Pack Grows: you failed or walked away, and your regular wears the ears to work from now on. Whichever regular was picked remembers how you treated them."
  ],
  "notes": "The Pack's newest member is one of five regulars, picked from the run code (hook.recruit; their felt-eared characters are moon_dory, moon_ruthie and so on, made in the code half). They shop for the Wolf Moon in week 2, and go on the stake in week 3.",
  "scenes": {
    "moonPye": {
      "title": "Professor Pye: the Pack has grown, and the Wolf Moon is coming",
      "customer": "pye",
      "steps": [
        { "say": "pye", "text": "Professor Pye, Department of Regrettable Books. You remember. I wish you didn't have to." },
        {
          "if": "flag.cultSaved == 'partial'",
          "then": [
            { "say": "pye", "text": "Desmond Wick never came back out of Hob's Wood in October. The book stayed with him. The Pack goes out to him now, every full moon." }
          ],
          "else": [
            {
              "if": "flag.cultSaved == 'none'",
              "then": [
                { "say": "pye", "text": "Your Mr. Gaunt was never found, and the Pack kept the book. Nobody organized a search party. That should have worried more people than it did." }
              ],
              "else": [
                { "say": "pye", "text": "The Psalter was in the police evidence locker. It isn't now. The locker was opened from the inside, and Desmond Wick was released on Tuesday for lack of a book." }
              ]
            }
          ]
        },
        {
          "say": "pye",
          "text": [
            "It's been feeding. A new member at every full moon: a teller at the bank in November, and in December, {hook:recruitName}. The newest always goes on the stake at the Wolf Moon. It's in the bylaws. They have bylaws.",
            "The Wolf Moon is January's. It's the one night the demon has to come all the way out of the book to feed. Shut the book while it's out, and it has nowhere to go back to. If the Pack hasn't fed it too well first.",
            "And the old cures still work. Amber, true silver, the Ink. And Pennick's diary says the book is only ever lent."
          ]
        },
        { "set": { "moonLore": true, "returnCure": true, "moonKnown": true } },
        { "toast": "Calendar: the Wolf Moon in Hob's Wood, {placed:wolfmoon} night", "look": "pye" },
        { "leave": "pye" }
      ]
    },
    "moonRecruitShops": {
      "title": "The Pack's newest member shops for the Wolf Moon, in felt ears",
      "music": "cult",
      "customer": "member",
      "steps": [
        {
          "say": "member",
          "text": [
            "Don't laugh. I joined at the December moon. They meet Thursdays and somebody always brings chowder, and I'm sick of making my own.",
            "Brother Desmond wants silver for the Wolf Moon. Or a good blade. I said I knew a shop."
          ],
          "if": "hook.recruit == 'dory'"
        },
        {
          "say": "member",
          "text": [
            "Ruthie, from trivia. Yes, the ears. I joined in December. They have a quiz night. The questions are all about the moon, but still.",
            "Brother Desmond wants silver, or something with an edge, for the Wolf Moon. I volunteered. I always volunteer."
          ],
          "if": "hook.recruit == 'ruthie'"
        },
        {
          "say": "member",
          "text": [
            "Bev, from the lanes. I joined at the December moon. They've got a league. A howling league. There are standings.",
            "Brother Desmond sent me for silver, or a good knife. For the Wolf Moon. I didn't ask. You don't ask in a league."
          ],
          "if": "hook.recruit == 'bev'"
        },
        {
          "say": "member",
          "text": [
            "Hal Mayhew. Don't start. I joined at the December moon. They needed somebody who could fix a folding table, and then they gave me the ears.",
            "Brother Desmond wants silver, or a blade, for the Wolf Moon. I'd sell him one myself, but he says it has to come from here."
          ],
          "if": "hook.recruit == 'hal'"
        },
        {
          "say": "member",
          "text": [
            "Gordie Haines. Yes, these are ears. I joined at the December moon. Networking. You'd be amazed who's in the Pack.",
            "Brother Desmond wants silver for the Wolf Moon, or a blade. Something with presence. I said, I know just the dealer."
          ],
          "if": "hook.recruit == 'gordie'"
        },
        {
          "hook": "cultSale",
          "with": { "cats": ["silver", "weapon", "jewelry"], "mult": 1.8, "power": true },
          "sets": ["sold"]
        },
        {
          "if": "sold",
          "then": [
            { "say": "member", "text": "He'll be pleased. He does pleased with his whole face now. It's a lot of face." }
          ],
          "else": [
            {
              "say": "member",
              "text": { "if": "hook.recruit == 'hal'", "then": "Fair enough. I'd sell him one from my own shop, but it's got to come from here. Bylaws.", "else": "Fair enough. I'll try the hardware store. Oh. That's Hal's. Never mind." }
            }
          ]
        },
        {
          "choose": [
            {
              "label": "\"The newest one goes on the stake. Did they tell you that?\"",
              "then": [
                { "set": { "moonWarned": true } },
                { "say": "member", "text": "That's a figure of speech. It's a figure of speech, isn't it? ...Isn't it?" }
              ]
            },
            {
              "label": "\"Nice ears.\"",
              "then": [{ "say": "member", "text": "They're felt. Bettany makes them. She's very fast now." }]
            }
          ]
        },
        { "leave": "member" }
      ]
    },
    "moonDesmond": {
      "title": "Desmond Wick at the back door at dusk, more wolf than he was",
      "music": "cult",
      "customer": "desmond",
      "steps": [
        { "narrate": "At dusk, a scratch at the back door. Not a knock. Desmond Wick is on the step in a cardigan gone stiff with frost. There's grey fur on the backs of his hands that wasn't there in October." },
        {
          "say": "desmond",
          "text": [
            "I don't want to come in. It doesn't like your shop. It says the shop is where it was sold, and it remembers being sold.",
            "It's very cold in the woods. I used to teach fractions. I can still do them in my head, if I try. Three quarters. Seven eighths. It doesn't like me doing that, either."
          ]
        },
        {
          "choose": [
            {
              "label": "Give him twenty dollars and your scarf",
              "hint": "(-$20)",
              "disabled": "coin < 20",
              "then": [
                { "coin": -20, "why": "Gave Desmond Wick twenty dollars and a scarf" },
                { "set": { "moonDesmond": true } },
                { "rep": 1 },
                { "say": "desmond", "text": "Thank you. Seven eighths. Thank you. When it's out of the book, on the night, come and stand by the rock. I'll try to remember you." }
              ]
            },
            {
              "label": "Keep him talking and phone Captain Barrow",
              "hint": "(heat -3)",
              "then": [
                { "heat": -3 },
                { "hook": "feedPack", "note": "the Pack hears: the Wolf Moon is fed one more" },
                { "narrate": "By the time the cruiser's lights turn into the alley, the step is empty. There are paw prints in the snow, going away fast, and they aren't a man's." }
              ]
            },
            {
              "label": "\"Go home, Mr. Wick.\"",
              "then": [{ "say": "desmond", "text": "I don't know where that is any more. But all right." }]
            }
          ]
        },
        { "leave": "desmond" }
      ]
    },
    "wolfMoon": {
      "title": "The Wolf Moon in Hob's Wood, and the newest member on the stake",
      "music": "moon",
      "steps": [
        { "hook": "wood", "with": { "demon": 0, "_d": 0 } },
        {
          "stage": "wolfwood",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [28, 170] },
            { "id": "shepherd", "cast": "shepherd", "at": [200, 142], "facingLeft": true },
            {
              "id": "victim",
              "cast": "moon_dory",
              "at": [262, 150],
              "facingLeft": true,
              "if": "hook.recruit == 'dory'"
            },
            {
              "id": "victim",
              "cast": "moon_ruthie",
              "at": [262, 150],
              "facingLeft": true,
              "if": "hook.recruit == 'ruthie'"
            },
            {
              "id": "victim",
              "cast": "moon_bev",
              "at": [262, 150],
              "facingLeft": true,
              "if": "hook.recruit == 'bev'"
            },
            {
              "id": "victim",
              "cast": "moon_hal",
              "at": [262, 150],
              "facingLeft": true,
              "if": "hook.recruit == 'hal'"
            },
            {
              "id": "victim",
              "cast": "moon_gordie",
              "at": [262, 150],
              "facingLeft": true,
              "if": "hook.recruit == 'gordie'"
            },
            {
              "id": "pack",
              "look": "hooded",
              "name": "The Pack",
              "at": [[70, 160], [92, 150], [114, 166], [136, 156]]
            },
            {
              "id": "packFar",
              "look": "hooded",
              "name": "The Pack",
              "at": [[214, 166], [236, 150], [300, 160]],
              "facingLeft": true
            }
          ]
        },
        {
          "narrate": [
            "The Wolf Moon, over Hob's Wood. The snow in the clearing is trodden flat in a ring around the stones, and there are twice as many grey hoods as there were in October. The moon is white tonight, and enormous.",
            "On the stake by the fire, still in the felt ears, looking more surprised than frightened: {hook:recruitName}."
          ]
        },
        {
          "say": "victim",
          "text": { "if": "flag.moonWarned", "then": "You said. You did say. I thought it was a figure of speech.", "else": "It's in the bylaws, apparently. Nobody reads the bylaws." }
        },
        { "say": "shepherd", "text": "THE NEWEST IS THE SWEETEST. IT IS WRITTEN. ON PAGE FOUR." },
        { "hook": "wood", "with": { "demon": 1 } },
        { "narrate": "Desmond opens the Psalter on the flat rock. This time the smoke doesn't gather over the fire. It comes up out of the pages themselves, all of it, a grey wolf's head with nothing left behind it in the book." },
        { "find": "amber", "in": "stock", "match": { "key": "amber" } },
        { "find": "silver", "in": "bag", "match": { "cat": "silver", "fake": false } },
        { "find": "ink", "in": "stock", "match": { "name": "Ink That Writes True" } },
        {
          "choose": [
            {
              "label": "Raise the amber and let it drink the demon",
              "disabled": "!amber",
              "off": { "hint": "(you need the twins' amber)" },
              "then": [
                { "take": "amber" },
                { "narrate": "You hold the amber up to the moon. The little beetle inside seems to open its mouth, and the wolf's head, all of it out of the book at once, pours howling into the stone." },
                {
                  "hook": "addPsalter",
                  "with": {
                    "name": "Demon in Amber",
                    "icon": "amber",
                    "psalter": false,
                    "guide": 300,
                    "condLabel": "Occupied",
                    "clues": [
                      { "text": "Something very small and very angry is trapped inside. It was bigger in January." }
                    ],
                    "nosale": false,
                    "curio": false
                  }
                }
              ]
            },
            {
              "label": { "if": "silver", "then": "Press true silver to the Psalter's binding (your {silver.name|lower})", "else": "Press true silver to the Psalter's binding" },
              "disabled": "!silver",
              "hint": { "if": "flag.moonPower >= 2", "then": "(the Pack has been well fed...)" },
              "off": { "hint": "(you need genuine silver {bagWord})" },
              "then": [
                { "take": "silver" },
                {
                  "if": "flag.moonPower >= 2",
                  "then": [
                    {
                      "narrate": [
                        "It's been fed too well. The wolf's head doesn't need the book any more. It takes the Shepherd instead, all the way this time, and Desmond goes off into the pines on four feet.",
                        "The Pack cuts the stake loose in the confusion, and they keep the newest member. They always keep the newest."
                      ]
                    },
                    { "set": { "moonEnd": "pack" } },
                    { "rep": -2 }
                  ],
                  "else": [
                    { "narrate": "The silver hisses against the empty binding. With nowhere to go back to, the wolf's head thins in the moonlight like breath on a cold morning, and is gone." }
                  ]
                }
              ]
            },
            {
              "label": "Write the demon's true name with the Ink That Writes True",
              "disabled": "!ink",
              "off": { "hint": "(you'd need truthful ink)" },
              "then": [
                { "take": "ink" },
                { "narrate": "You write a name you have never heard in the snow on the flat rock, with a finger dipped in the Ink. The demon reads it upside down, looks embarrassed, and stops existing." }
              ]
            },
            {
              "label": "Shut the Psalter while it's out of the book",
              "disabled": "!flag.moonLore",
              "hint": { "if": "flag.moonPower >= 2", "then": "(it's been fed well...)" },
              "off": { "hint": "(you'd need to know when)" },
              "then": [
                {
                  "if": "flag.moonPower >= 2",
                  "then": [
                    {
                      "narrate": [
                        "It's been fed too well. The wolf's head doesn't need the book any more. It takes the Shepherd instead, all the way this time, and Desmond goes off into the pines on four feet.",
                        "The Pack cuts the stake loose in the confusion, and they keep the newest member. They always keep the newest."
                      ]
                    },
                    { "set": { "moonEnd": "pack" } },
                    { "rep": -2 }
                  ],
                  "else": [
                    { "narrate": "While every hood in the clearing is turned up to the smoke, you step to the rock and shut the Psalter. It's heavier than a book. The wolf's head turns, finds the door closed, and comes apart in the cold like breath." }
                  ]
                }
              ]
            },
            {
              "label": "Ask Desmond to hand the book back, as if over the counter",
              "disabled": "!flag.moonDesmond",
              "off": { "hint": "(he'd have to trust you)" },
              "then": [
                {
                  "narrate": [
                    "\"It was only ever lent, Desmond.\" You hold out your hands, the way you do at the counter. He looks at your scarf, still round his neck, and at the book, and he shuts it, and hands it across.",
                    "The wolf's head finds the door closed and the book in a pawnbroker's hands, where it was sold. It goes out like a match."
                  ]
                },
                {
                  "hook": "addPsalter",
                  "with": {
                    "condLabel": "Returned",
                    "clues": [{ "text": "Just a book now. On full moons it whimpers, a little." }]
                  },
                  "if": "shelf.free"
                },
                { "set": { "moonEnd": "returned" } },
                { "rep": 9 },
                { "say": "shepherd", "text": "Seven eighths. ...I think I'd like to go home. Do I still have a home?" }
              ]
            },
            {
              "label": "Back away. Not your circus.",
              "then": [
                {
                  "narrate": [
                    "You back away into the pines. Behind you the howling goes up and up. Nobody screams, which is worse.",
                    "In the morning {hook:recruitName} is back at work, in the felt ears, and doesn't want to talk about it."
                  ]
                },
                { "set": { "moonEnd": "pack" } },
                { "rep": -5 }
              ]
            }
          ],
          "as": "pick"
        },
        { "hook": "wood", "with": { "demon": 0 } },
        {
          "if": "pick == 0 || pick == 2 || ((pick == 1 || pick == 3) && !(flag.moonPower >= 2))",
          "note": "the amber, the Ink, or silver or the shut book on a Pack that wasn't fed too well",
          "then": [
            { "set": { "moonEnd": "cured" } },
            { "rep": 8 },
            { "narrate": "All round the ring, grey hoods go back and felt ears come off. Somebody starts to cry. Somebody else has brought a thermos." },
            { "say": "shepherd", "text": "Fractions. I can do fractions again. Would anyone like to hear some?" }
          ]
        },
        {
          "if": "flag.moonEnd != 'pack'",
          "then": [
            { "say": "victim", "text": "Untie me, would you? And I'd like that in writing, that I was the newest. I'm never joining anything again." },
            { "hook": "swayRecruit", "with": { "by": 2, "why": "Got them off the stake at the Wolf Moon" } }
          ],
          "else": [
            { "hook": "swayRecruit", "with": { "by": -2, "why": "Left them in the Pack at the Wolf Moon" } }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "moon-pye", "from": "1-2", "to": "1-4", "cast": "pye", "scene": "moonPye" },
    { "drift": "moon-recruit-dory", "from": "2-1", "to": "2-3", "cast": "moon_dory", "scene": "moonRecruitShops", "if": "hook.recruit == 'dory' && flag.moonKnown" },
    { "drift": "moon-recruit-ruthie", "from": "2-1", "to": "2-3", "cast": "moon_ruthie", "scene": "moonRecruitShops", "if": "hook.recruit == 'ruthie' && flag.moonKnown" },
    { "drift": "moon-recruit-bev", "from": "2-1", "to": "2-3", "cast": "moon_bev", "scene": "moonRecruitShops", "if": "hook.recruit == 'bev' && flag.moonKnown" },
    { "drift": "moon-recruit-hal", "from": "2-1", "to": "2-3", "cast": "moon_hal", "scene": "moonRecruitShops", "if": "hook.recruit == 'hal' && flag.moonKnown" },
    { "drift": "moon-recruit-gordie", "from": "2-1", "to": "2-3", "cast": "moon_gordie", "scene": "moonRecruitShops", "if": "hook.recruit == 'gordie' && flag.moonKnown" },
    { "drift": "moon-desmond", "from": "2-4", "to": "3-2", "cast": "desmond", "scene": "moonDesmond", "if": "flag.moonKnown && !flag.moonEnd" }
  ],
  "nights": [
    {
      "id": "wolfmoon",
      "window": ["3-4", "3-4"],
      "if": "!flag.moonEnd",
      "scene": "wolfMoon",
      "test": [
        {
          "roll": { "moonLore": [true, true, true, true, true, true, true, false, false, false] },
          "note": "seven times in ten"
        },
        { "roll": { "moonDesmond": [true, false] } },
        { "roll": { "moonPower": [0, 1, 2] } },
        { "set": { "returnCure": true } },
        {
          "if": "random < 0.3",
          "then": [{ "add": { "item": "amber", "cond": 2, "name": "Amber with insect", "guide": 48 } }]
        }
      ]
    }
  ],
  "calendar": [
    {
      "id": "wolfmoon",
      "night": "wolfmoon",
      "story": "wolfmoon",
      "where": "Hob's Wood",
      "title": "The Wolf Moon",
      "known": "flag.moonKnown",
      "scene": "wolfMoon",
      "bring": ["silver"]
    }
  ],
  "epilogue": [
    { "hook": "recruit", "note": "the newest member is drawn by now, whether or not anyone met them" },
    { "line": "The Pack of the Grey Psalter broke up on the Wolf Moon. {hook:recruitName} kept the felt ears, and wears them to the town's New Year's party, as a warning.", "if": "flag.moonEnd == 'cured'" },
    { "line": "The Grey Psalter is back on your high shelf, not for sale, wrapped in your old scarf. Desmond Wick visits it on Saturdays and does fractions at it.", "if": "flag.moonEnd == 'returned'" },
    { "line": "{hook:recruitName} wears felt ears to work now. The Pack meets Thursdays, and there are more of them every month.", "if": "flag.moonEnd == 'pack'" }
  ],
  "talk": {
    "by": "skip",
    "rumour": [
      "There's a crossing guard on my route in felt ears again, and now there's two. They wave at the bus together.",
      "The kids say the Pack's got a rule: the newest one's for the Wolf Moon. Kids make things up. Mostly."
    ],
    "react": { "cured": "Nobody growled at the bus all week. The kids are almost disappointed.", "returned": "Mr. Wick's back helping out at the school. Fractions, mostly. He's very keen on fractions.", "pack": "Three crossing guards in ears now. One of them howled the bus all the way to the school." },
    "sway": {
      "cured": { "skip": 1, "ignatius": 1 },
      "returned": { "skip": 2 },
      "pack": { "skip": -1, "ignatius": -1 }
    }
  }
});
