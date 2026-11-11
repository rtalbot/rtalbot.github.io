// Pawn Champ - The Long Con: a charming couple, an estate sale on Cliff Road, and a house full of
// fakes. You're their partner or their mark, or you turn it round on them with fakes of your own.
// Major quest M15, batch G (docs/quests/MAJOR.md#m15-the-long-con-crime).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/longcon.js.
defineStory({
  "id": "longcon",
  "kind": "major",
  "colour": "#b0803a",
  "family": "crime",
  "title": "The Long Con",
  "crosses": [],
  "rumour": "A charming couple are running an estate sale on Cliff Road, and want a local dealer to vouch for their stock.",
  "endings": { "conned": "Taken for a Ride", "cut": "A Fair Split", "turned": "The Grifters Grifted", "caught": "Called It In" },
  "outcome": [
    { "if": "flag.lcEnd == 'conned'", "ending": "conned" },
    { "if": "flag.lcEnd == 'cut'", "ending": "cut" },
    { "if": "flag.lcEnd == 'turned'", "ending": "turned" },
    { "if": "flag.lcEnd == 'caught'", "ending": "caught" },
    { "if": "flag.lcConned", "ending": "conned" }
  ],
  "about": [
    "A grifter story where you choose which side of the con you're on. Cosima Ashby-Vale and her husband are selling off a \"late great-aunt's\" house on Cliff Road and want a local dealer's signature on their certificates, $40 each (§{cosimaSword}). The first is a sabre said to have been carried at Brandywine. A loupe shows it's a reenactor's sword; you can say so, sign anyway, or sign without looking.",
    "At their sherry preview (§{longconSale}) a trusting signer is offered the sabre for $150, and buying it means you've been had (Taken for a Ride). A sharper dealer is offered a partnership: walk a Boston buyer round the whole lot at the Grange for thirty percent. Say you're in, offer your own known fakes into the lot, quietly bring in Captain Barrow, or leave. Hester confirms the provenance letters are invented (§{lcHester}). A dollar box by the door holds a dented gray bowl worth buying.",
    "In the back booth at the Rusty Anchor (§{longconBooth}) you sell them your fakes, shake on the split, or call Barrow. At the Grange lot sale (§{longconGrange}) your fakes sink the whole lot in the buyer's eyes (The Grifters Grifted), Barrow arrests them (Called It In), you tell the buyer it's all fake (also Called It In), or you call it \"remarkable\" and take your cut (A Fair Split). A reenactor turns up wanting his sword back (§{lcReenactor})."
  ],
  "cast": {
    "cosima": {
      "name": "Cosima Ashby-Vale",
      "look": { "skin": "#f0d0b8", "hair": "#c8a050", "hs": 5, "coat": "#7a2a3a", "trim": "#e8e0c8", "style": "dress", "long": true, "pants": "#2a2028", "glasses": "#c8a050", "bag": "#e8e0c8" }
    },
    "peregrine": {
      "name": "Peregrine Ashby-Vale",
      "look": { "skin": "#e8c8a8", "hair": "#5a3a24", "hs": 2, "coat": "#3a5a4a", "trim": "#e8b020", "style": "suit", "long": true, "pants": "#c8b890", "moustache": "#5a3a24" }
    },
    "reenactor": {
      "name": "A reenactor in a tricorn",
      "look": { "skin": "#e8c8a8", "hair": "#e8e0d0", "hs": 1, "coat": "#2a3a7a", "trim": "#e8e0c8", "style": "jacket", "long": true, "hat": "top", "hatc": "#1a1a1e", "pants": "#e8e0c8" }
    },
    "grosvenor": {
      "name": "Barnaby Grosvenor",
      "look": { "skin": "#c89070", "hair": "#e8e8e8", "hs": 0, "coat": "#1e2230", "trim": "#e8e0c8", "style": "suit", "long": true, "pants": "#1e2230", "glasses": "#2a2a2e", "bag": "#3a2a1e" }
    }
  },
  "uniques": {
    "lcSword": {
      "name": "\"Revolutionary War\" officer's sword",
      "icon": "dagger",
      "cat": "weapon",
      "guide": 220,
      "fake": true,
      "condLabel": "Artfully aged",
      "tells": [
        "The blade is stamped 1776 in a typeface that wasn't invented until 1957.",
        "Under the grip wrap, a sticker: BRANDYWINE REENACTORS SUPPLY, 1993."
      ]
    },
    "lcPorringer": {
      "name": "Dented pewter porringer",
      "icon": "goblet",
      "cat": "silver",
      "guide": 160,
      "condLabel": "Battered",
      "tells": [
        "Under the handle, a worn touch mark: a lamb and the initials of a Newport pewterer, around 1770.",
        "Real, and nobody at the estate sale knew it. It was in the box of kitchen junk."
      ]
    }
  },
  "scenes": {
    "cosimaSword": {
      "title": "Cosima Ashby-Vale wants a local name on her certificates",
      "customer": "cosima",
      "steps": [
        {
          "say": "cosima",
          "text": [
            "Cosima Ashby-Vale. My husband and I are clearing his late great-aunt's house on Cliff Road. Three floors of family history and not one of us can tell a Chippendale from a chip pan.",
            "We want a local name on our certificates. Buyers trust a local name. Forty dollars a signature. Start with this."
          ]
        },
        { "hook": "sword", "sets": ["sword"] },
        { "view": { "counterIcon": "{sword.icon}" } },
        { "narrate": "A cavalry sabre on a velvet cloth. The certificate beside it says it was carried at Brandywine by a Captain Ashby, who \"fell gallantly\"." },
        {
          "choose": [
            {
              "label": "Look it over with the loupe",
              "hint": "(uses an inspection)",
              "disabled": "hook.loupe < 1",
              "then": [
                { "hook": "inspect", "with": "sword", "sets": ["clues"] },
                { "narrate": "{clues}" },
                {
                  "choose": [
                    {
                      "label": "\"It's a reenactor's sword, Mrs. Ashby-Vale.\"",
                      "then": [
                        { "set": { "lcRole": "sharp" } },
                        { "say": "cosima", "text": "Is it! Goodness. Great-aunt Lavinia must have been had. Well. You do have an eye." },
                        { "narrate": "She doesn't look surprised. She looks pleased, the way a cat looks pleased." }
                      ]
                    },
                    {
                      "label": "Sign it anyway and take the forty",
                      "hint": "(+$40)",
                      "then": [
                        { "set": { "lcRole": "partner", "lcVouched": true } },
                        { "coin": 40, "why": "Signed the Ashby-Vales' certificate" },
                        { "heat": 3 },
                        { "say": "cosima", "text": "Oh, you're going to be fun." }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "Sign the certificate without looking",
              "hint": "(+$40)",
              "then": [
                { "set": { "lcRole": "mark", "lcVouched": true } },
                { "coin": 40, "why": "Signed the Ashby-Vales' certificate" },
                { "say": "cosima", "text": "Wonderful. It's such a relief to deal with someone who simply trusts people." }
              ]
            },
            {
              "label": "Decline",
              "then": [
                { "set": { "lcRole": "sharp" } },
                { "say": "cosima", "text": "Careful. I like careful." }
              ]
            }
          ]
        },
        { "view": { "counterIcon": null } },
        { "say": "cosima", "text": "We're holding a preview for the trade before the sale opens. {placed:longcon-sale} evening. Sherry. Come and see the rest of the house." },
        {
          "choose": [
            {
              "label": "\"I'll be there.\"",
              "then": [
                { "set": { "lcInvite": true } },
                { "toast": "Calendar: the estate sale preview on Cliff Road, {placed:longcon-sale}", "look": "cosima" }
              ]
            },
            {
              "label": "\"Estate sales aren't my thing.\"",
              "then": [{ "say": "cosima", "text": "Everyone says that, and then they come. Bye now." }]
            }
          ]
        },
        { "leave": "cosima" }
      ]
    },
    "longconSale": {
      "title": "The estate sale preview on Cliff Road",
      "music": "day",
      "steps": [
        {
          "stage": "cliffroadSale",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 164] },
            { "id": "cosima", "cast": "cosima", "at": [230, 160], "facingLeft": true },
            { "id": "peregrine", "cast": "peregrine", "at": [262, 158], "facingLeft": true },
            { "id": "dealer1", "look": "random", "name": "A dealer", "at": [70, 160] },
            { "id": "dealer2", "look": "random", "name": "A dealer", "at": [96, 157], "facingLeft": true }
          ]
        },
        { "narrate": "The big house on Cliff Road, every surface tagged. Two dealers from the Cape hold a teacup each up to the window. There is sherry, and it is very good sherry, which is the first thing that makes you suspicious." },
        { "say": "peregrine", "text": "Peregrine Ashby-Vale. Great-aunt Lavinia collected everything. Hepplewhite, Revere, Brandywine. Some of it's probably even real, ha ha." },
        {
          "if": "flag.lcRole == 'mark'",
          "then": [
            { "say": "peregrine", "text": "Since you've so kindly vouched for the sabre, we'd like you to have first refusal. One hundred and fifty. It's worth a great deal more. You signed the certificate, after all." },
            {
              "choose": [
                {
                  "label": "Buy the sword for $150",
                  "disabled": "coin < 150 || !shelf.free",
                  "then": [
                    {
                      "hook": "buy",
                      "with": { "unique": "lcSword", "paid": 150, "why": "Bought the Ashby-Vales' \"Revolutionary War\" sword" }
                    },
                    { "hook": "conned" },
                    { "say": "cosima", "text": "You won't regret it. Well. You won't regret it for a little while." }
                  ]
                },
                {
                  "label": "Look at it properly first",
                  "hint": "(uses an inspection)",
                  "disabled": "hook.loupe < 1",
                  "then": [
                    { "hook": "sword", "sets": ["sword"] },
                    { "hook": "inspect", "with": "sword", "sets": ["clues"] },
                    { "narrate": "You turn the blade to the light. {clues} Peregrine watches you read it and doesn't stop smiling." },
                    { "set": { "lcRole": "sharp" } },
                    { "say": "peregrine", "text": "Ah. Well. You can't blame a man for trying. Actually, you can. But you'd be the first." }
                  ]
                },
                {
                  "label": "Pass",
                  "then": [
                    { "say": "peregrine", "text": "Your loss. Someone from Connecticut will have it by Thursday." }
                  ]
                }
              ]
            }
          ]
        },
        {
          "if": "flag.lcRole != 'mark'",
          "then": [
            { "say": "cosima", "text": "Let's not be silly. You've seen the sword. You know what this is. The question is whether you're in the house or out on the step." },
            { "say": "peregrine", "text": "A dealer from Boston is coming to buy the whole contents in one lot, at the Grange, next week. He wants a local expert to walk him round. Thirty percent to the local expert." },
            { "hook": "fakes", "sets": ["fakes"] },
            {
              "choose": [
                {
                  "label": "Say you're in",
                  "hint": "(their partner)",
                  "then": [
                    { "set": { "lcPartner": true } },
                    { "say": "peregrine", "text": "Splendid. The Anchor, the back booth, later this week. We'll go over the split." },
                    { "toast": "Calendar: the Rusty Anchor, the back booth, {placed:longcon-booth} night", "look": "peregrine" }
                  ]
                },
                {
                  "label": "Say you're in, and offer them a few \"heirlooms\" from your own back room",
                  "hint": { "if": "fakes.count > 1", "then": "(you have {fakes.count} known fakes)", "else": "(you have 1 known fake)" },
                  "disabled": "!fakes.count",
                  "off": { "hint": "(needs a fake you know is fake)" },
                  "then": [
                    { "set": { "lcPartner": true, "lcTurn": true } },
                    { "say": "cosima", "text": "You have stock? Real stock? Bring a list to the Anchor. We pay cash for anything that improves the lot." },
                    { "toast": "Calendar: the Rusty Anchor, the back booth, {placed:longcon-booth} night", "look": "peregrine" }
                  ]
                },
                {
                  "label": "Say you're in, then call Captain Barrow",
                  "then": [
                    { "set": { "lcPartner": true, "lcBarrow": true } },
                    { "say": "peregrine", "text": "The Anchor, the back booth. Come thirsty." },
                    { "toast": "Calendar: the Rusty Anchor, the back booth, {placed:longcon-booth} night", "look": "peregrine" }
                  ]
                },
                {
                  "label": "Finish your sherry and leave",
                  "then": [
                    { "set": { "lcOut": true } },
                    { "say": "cosima", "text": "Pity. You'd have been good at this." }
                  ]
                }
              ]
            }
          ]
        },
        { "narrate": "On your way out you nearly kick a cardboard box of kitchen junk, ALL $1. A whisk, a colander, and a squat gray bowl with a flat pierced handle, dented on one side.", "note": "the one real thing in the house" },
        {
          "choose": [
            {
              "label": "Buy the gray bowl for a dollar",
              "disabled": "!shelf.free || coin < 1",
              "then": [
                {
                  "hook": "buy",
                  "with": { "unique": "lcPorringer", "paid": 1, "why": "Bought a dented bowl out of the junk box" }
                },
                { "set": { "lcPorringer": true } },
                { "say": "cosima", "text": "A dollar! Don't spend it all at once." }
              ]
            },
            { "label": "Leave the junk" }
          ]
        }
      ]
    },
    "lcHester": {
      "title": "Hester has read their provenance letters",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "Those people on Cliff Road. Their provenance letters quote \"the 1902 Brimble auction catalogue, lot 114\". The Athenaeum has the Brimble catalogue. It has eighty lots.",
            "There was no Great-aunt Lavinia either. The house belongs to a dentist in Worcester, and he rents it by the week."
          ]
        },
        { "set": { "lcHester": true } },
        {
          "if": "flag.lcPartner && !flag.lcBarrow",
          "then": [
            {
              "choose": [
                { "label": "\"Thanks, Hester. I'll keep it in mind.\"" },
                {
                  "label": "Take Hester's notes to Captain Barrow",
                  "hint": "(you'll be on the inside)",
                  "then": [
                    { "set": { "lcBarrow": true } },
                    { "say": "hester", "text": "Good. Barrow likes paperwork. It's the only thing she likes." }
                  ]
                }
              ]
            }
          ]
        },
        { "leave": "hester" }
      ]
    },
    "longconBooth": {
      "title": "The back booth at the Rusty Anchor",
      "music": "tension",
      "steps": [
        {
          "stage": "anchorBooth",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [196, 164] },
            { "id": "cosima", "cast": "cosima", "at": [226, 160], "facingLeft": true },
            { "id": "peregrine", "cast": "peregrine", "at": [286, 160], "facingLeft": true }
          ]
        },
        { "narrate": "The Rusty Anchor after last orders, the stools upside down on the bar. The back booth has a candle in a bottle and a napkin covered in arithmetic." },
        { "say": "peregrine", "text": "Mr. Grosvenor of Boston, Saturday morning at the Grange. Twelve hundred for the lot. You walk him round, you say \"remarkable\" at the sabre and \"oh, Revere\" at the tankard. Three hundred and sixty to you." },
        { "narrate": "There's a phone in your pocket with Captain Barrow on the other end of it. You try to sit like someone who isn't wearing a phone.", "if": "flag.lcBarrow" },
        { "hook": "fakes", "with": 3, "sets": ["fakes", "fakeNames"] },
        {
          "say": "cosima",
          "text": { "if": "flag.lcTurn", "then": "Now. Your heirlooms. What have you brought?", "else": "And if you've anything in your back room that would sweeten the lot, we pay cash. Real cash. We're not animals." },
          "if": "flag.lcTurn || fakes.count"
        },
        {
          "choose": [
            {
              "label": "Sell them your fakes as the real thing",
              "hint": "({fakeNames})",
              "if": "fakes.count",
              "then": [
                {
                  "hook": "sellFakes",
                  "with": "The Ashby-Vales bought your fakes for their lot",
                  "sets": ["total"]
                },
                { "set": { "lcPartner": true } },
                { "narrate": "Cosima turns each one over, nods, and counts {total|money} onto the table in twenties. She doesn't use a loupe. People who sell fakes never think to." },
                { "say": "peregrine", "text": "Pleasure. Saturday, then. Wear something trustworthy." }
              ]
            },
            {
              "label": "Shake on the split",
              "hint": { "if": "flag.lcBarrow", "then": "(Barrow is listening)" },
              "then": [
                { "set": { "lcCut": true } },
                { "say": "cosima", "text": "Lovely. A partnership. I do love a partnership. They're so easy to end." }
              ]
            },
            {
              "label": "Excuse yourself and call Captain Barrow from the bathroom",
              "if": "!flag.lcBarrow",
              "then": [
                { "set": { "lcBarrow": true } },
                { "narrate": "Captain Barrow listens, and says, \"Saturday. Go back out there and laugh at his jokes.\" You do. They aren't funny." }
              ]
            },
            {
              "label": "Walk out of the booth",
              "then": [
                { "set": { "lcOut": true, "lcPartner": false } },
                { "say": "peregrine", "text": "Pity. We'll find another local. There's always another local." }
              ]
            }
          ]
        },
        { "toast": "Calendar: the lot sale at the Grange Hall, {placed:longcon-grange}", "look": "grosvenor", "if": "!flag.lcOut" }
      ]
    },
    "longconGrange": {
      "title": "The lot sale at the Grange",
      "music": "tension",
      "steps": [
        {
          "stage": "grange",
          "view": { "sign": "ESTATE LOT - ONE DAY ONLY" },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 164] },
            { "id": "cosima", "cast": "cosima", "at": [190, 160], "facingLeft": true },
            { "id": "peregrine", "cast": "peregrine", "at": [214, 158], "facingLeft": true },
            { "id": "grosvenor", "cast": "grosvenor", "at": [160, 162] }
          ]
        },
        { "narrate": "The Grange Hall, on trestle tables: Great-aunt Lavinia's entire life, all three floors of it, in rows. Mr. Barnaby Grosvenor of Boston walks the rows with his hands behind his back." },
        { "say": "grosvenor", "text": "They tell me you're the local expert. Walk me round." },
        {
          "if": "flag.lcTurned",
          "then": [
            { "narrate": "He stops at the first of your pieces. He picks it up. He puts it down. He picks up the next one and makes a small, sad noise." },
            { "say": "grosvenor", "text": "Mr. Ashby-Vale, this is a fake. And this. And it's a bad fake, which is worse. If these are in the lot, what is the rest of the lot?" },
            { "narrate": "He checks the sabre next. Then the tankard. By eleven o'clock Mr. Grosvenor is in his car, and the Ashby-Vales are loading great-aunt Lavinia into a rented van, very fast, without looking at you." },
            { "say": "cosima", "text": "You. Oh, you're good. Next time, call me first." },
            { "set": { "lcEnd": "turned" } },
            { "rep": 2 }
          ],
          "else": [
            {
              "if": "flag.lcBarrow",
              "then": [
                { "enter": { "id": "barrow", "cast": "barrow", "at": [40, 164] } },
                { "walk": "barrow", "to": [100, 164] },
                { "say": "barrow", "text": "Morning, Mr. Grosvenor. Don't buy anything. Mr. and Mrs. Ashby-Vale, or whatever it is this week, there are some people in Delaware who'd like a word about a sword." },
                { "say": "peregrine", "text": "Officer, there's been a terrible misunderstanding." },
                { "say": "barrow", "text": "There usually is. Hands where I can see them. Both pairs." },
                { "set": { "lcEnd": "caught" } },
                { "rep": 4 },
                { "heat": -8 }
              ],
              "else": [
                { "say": "peregrine", "text": "Remarkable, isn't it? Brandywine. Do tell Mr. Grosvenor, you're the expert." },
                {
                  "choose": [
                    {
                      "label": "Call it remarkable",
                      "hint": "(your cut)",
                      "then": [
                        { "coin": 180, "why": "Your share of the Ashby-Vales' lot sale" },
                        { "heat": 8 },
                        { "rep": -4 },
                        { "narrate": "\"Remarkable,\" you say, and he buys the lot. Your share comes in an envelope: a hundred and eighty dollars, and a note that says \"less expenses\". The expenses were also a hundred and eighty dollars. Partners." },
                        { "set": { "lcEnd": "cut" } }
                      ]
                    },
                    {
                      "label": "Tell Mr. Grosvenor it's all fake",
                      "then": [
                        { "say": "grosvenor", "text": "All of it? Even the Revere?" },
                        { "narrate": "Especially the Revere. Mr. Grosvenor shakes your hand, gives you his card, and calls the police from the Grange Hall phone. The Ashby-Vales are halfway to Route 6 before Barrow arrives, but their van isn't, and nor is great-aunt Lavinia." },
                        { "set": { "lcEnd": "caught" } },
                        { "rep": 4 }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        { "view": { "sign": null } }
      ]
    },
    "lcReenactor": {
      "title": "The reenactor wants his sword back",
      "customer": "reenactor",
      "steps": [
        {
          "say": "reenactor",
          "text": [
            "I hear you've got a sabre, stamped 1776, with a Brandywine Reenactors sticker under the grip. That's mine. They bought it off me at a muster in Delaware and paid in a check that bounced like a rubber ball.",
            "I can give you forty for it. And the story of how I lost it, which takes about an hour."
          ]
        },
        { "find": "sword", "in": "stock", "match": { "uniqueId": "lcSword" } },
        {
          "choose": [
            {
              "label": "Sell him the sword for $40",
              "disabled": "!sword",
              "then": [
                { "sell": "sword", "to": "reenactor" },
                { "coin": 40, "why": "Sold the reenactor his own sword back" },
                { "say": "reenactor", "text": "Huzzah. Sorry. Habit." }
              ]
            },
            {
              "label": "Keep it on the wall as a lesson",
              "then": [{ "say": "reenactor", "text": "Fair. It's a good lesson. I paid for it too." }]
            }
          ]
        },
        { "leave": "reenactor" }
      ]
    }
  },
  "beats": [
    { "drift": "longcon-cosima", "from": "1-3", "to": "2-1", "cast": "cosima", "scene": "cosimaSword" },
    { "drift": "longcon-hester", "from": "2-4", "to": "3-2", "cast": "hester", "scene": "lcHester", "if": "flag.lcInvite && !flag.lcConned && !flag.lcEnd" },
    { "drift": "longcon-reenactor", "from": "3-2", "to": "4-3", "cast": "reenactor", "scene": "lcReenactor", "if": "hook.swordHere" }
  ],
  "nights": [
    {
      "id": "longcon-sale",
      "window": ["2-1", "2-4"],
      "if": "flag.lcInvite",
      "scene": "longconSale",
      "test": [
        { "hook": "saleTest", "note": "invited, as a mark, sharp or partner, with $200 and some known fakes six times in ten" }
      ]
    },
    {
      "id": "longcon-booth",
      "window": ["3-1", "3-3"],
      "if": "flag.lcPartner && !flag.lcEnd",
      "scene": "longconBooth",
      "test": [
        { "hook": "boothTest", "note": "their partner, turning it round half the time, with Barrow three times in ten, and two known fakes" }
      ]
    },
    {
      "id": "longcon-grange",
      "window": ["3-4", "4-3"],
      "if": "flag.lcPartner && !flag.lcEnd",
      "scene": "longconGrange",
      "test": [
        { "hook": "grangeTest", "note": "their partner: having sold them fakes, with Barrow, or in for a cut, a third each" }
      ]
    }
  ],
  "calendar": [
    { "id": "longcon-sale", "night": "longcon-sale", "story": "longcon", "where": "Cliff Road", "title": "The estate sale preview", "known": "flag.lcInvite", "scene": "longconSale" },
    { "id": "longcon-booth", "night": "longcon-booth", "story": "longcon", "where": "The Rusty Anchor", "title": "The back booth", "known": "flag.lcPartner", "scene": "longconBooth" },
    { "id": "longcon-grange", "night": "longcon-grange", "story": "longcon", "where": "The Grange Hall", "title": "The lot sale", "known": "flag.lcPartner && !flag.lcOut", "scene": "longconGrange" }
  ],
  "mornings": [
    {
      "if": "flag.lcConned && hook.dayAfterSword && !flag.lcEnd",
      "note": "the morning after you bought the sword: they've gone",
      "then": [
        { "set": { "lcEnd": "conned" } },
        { "find": "sword", "in": "stock", "match": { "uniqueId": "lcSword" } },
        {
          "edit": "sword",
          "set": {
            "inspected": true,
            "knownFake": true,
            "clues": [
              { "text": "The blade is stamped 1776 in a typeface that wasn't invented until 1957.", "cls": "bad" },
              { "text": "Under the grip wrap, a sticker: BRANDYWINE REENACTORS SUPPLY, 1993.", "cls": "bad" }
            ]
          }
        },
        { "toast": "The Ashby-Vales have gone. The house on Cliff Road was a weekly rental. Your sword was made in 1993 for a reenactment society in Delaware.", "look": "cosima" },
        { "refresh": "panel" }
      ]
    }
  ],
  "epilogue": [
    { "line": "You still have a sabre stamped 1776 in a typeface from 1957. You tell the story to every new dealer in town. It is the best $150 you never meant to spend.", "if": "flag.lcEnd == 'conned'" },
    { "line": "The Ashby-Vales send a Christmas card from Newport, signed \"your partners\". You keep it in the drawer with the till roll.", "if": "flag.lcEnd == 'cut'" },
    { "line": "Somewhere in Rhode Island, two grifters are telling each other about a pawnbroker in Hollow Neck, and it isn't a funny story yet.", "if": "flag.lcEnd == 'turned'" },
    { "line": "Peregrine and Cosima Ashby-Vale (real names: Pete and Connie Vail) are guests of the Commonwealth. Mr. Grosvenor sends you a dealer's card every Christmas.", "if": "flag.lcEnd == 'caught'" },
    { "line": "The dented gray bowl from the junk box is a Newport pewter porringer from about 1770. It cost you a dollar.", "if": "flag.lcPorringer && hook.porringerHere" }
  ]
});
