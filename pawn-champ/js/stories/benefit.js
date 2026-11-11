// Pawn Champ - The Benefit: a roof, an attic full of donations, an auction, and a villain who wants
// the building. Major quest M5, batch A (docs/quests/MAJOR.md#m5-the-benefit).
// Owns the Benefit Auction hub ('auction'); M10's Lot 22 is a vignette there. Its finale is Article 9,
// a vignette at the Town Meeting hub ('meeting', batch D's js/quests/selectmen.js), with a night of
// its own as a fallback while that hub doesn't exist.
// Sister Amabel's roof (built, game.js) becomes a benefit auction you're asked to run. You sort the
// attic, take donations, and hold the gavel. Then it turns out the Gilded Hand owns the land, and
// wants it rezoned at Town Meeting.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/benefit.js,
// which keeps the roof fund (benefitAdd, $600 for the whole roof) that other stories add to.
defineStory({
  "id": "benefit",
  "kind": "major",
  "colour": "#c8708a",
  "family": "town",
  "title": "The Benefit",
  "crosses": ["spoons", "selectmen", "breakwaters", "grey"],
  "rumour": "Saint Brine's attic holds forty years of donations, and the roof over it is falling in.",
  "endings": { "saved": "Saint Brine's Stands", "roof": "A Good Roof on Sold Land", "condos": "Sea View Condos" },
  "about": [
    "A town story about Saint Brine's, the children's home with a hole in its roof. Sister Amabel asks you to sort forty years of donations in the attic and hold the gavel at a benefit auction (§{benefitAsk}). Say no and Father Ignatius runs it himself, which goes about as well as you'd guess.",
    "In the attic one night (§{benefitAttic}) you look closely at three to five boxes (more with a light or a loupe). You can price things honestly for the roof fund, or buy the treasures cheap yourself, and Dulcie with the flashlight may catch you at it. Meanwhile Lois Pruett offers to give her item to the roof rather than sell it to you (§{benefitDonor}), and Ignatius comes round collecting from your shelves (§{benefitIgnatius}).",
    "At the Grange Hall auction (§{benefitGavel}) you run the lots straight, plant a bidder, let the kids help, or call on a friend or Ignatius's card. $600 pays for the whole roof. Then Merrit Gaunt of Gilded Hand Finance hands Amabel an envelope: the diocese sold them the land, and Article 9 on the Town Meeting warrant would rezone it for forty-two condos. If you skipped the auction Amabel brings the news herself (§{benefitNews}).",
    "At Town Meeting (§{benefitArticle9}) you can speak (it wins only if the roof is paid for), read a line from Odile's ledger, play Marguerite's Gavel card, or stay in your seat. Article 9 failing is Saint Brine's Stands; otherwise it's A Good Roof on Sold Land or Sea View Condos, depending on the roof."
  ],
  "notes": "The roof fund is S.flags.benefitPot, and $600 pays for the whole roof. Article 9 is saved by speaking with the roof paid for, by reading from Odile's ledger, or by Marguerite's Gavel.",
  "cast": {
    "dulcie": {
      "name": "Dulcie",
      "look": { "kid": true, "skin": "#8a5a3a", "hair": "#1a1210", "hs": 5, "coat": "#e8c040", "style": "hoodie", "pants": "#3a4a6a", "band": "#c84a3a" }
    },
    "benefitDonor": {
      "name": "Lois Pruett",
      "look": { "skin": "#e8c0a0", "hair": "#c8c8d0", "hs": 3, "coat": "#7a5a8a", "style": "puffer", "pants": "#3a3a4a", "bag": "#c84a3a" }
    }
  },
  "uniques": {
    "buttonTin": {
      "name": "A tin of buttons",
      "icon": "tin",
      "cat": "curio",
      "guide": 220,
      "tells": ["Among the buttons, a 1797 gold half eagle."]
    },
    "shakerBox": {
      "name": "Shaker sewing box",
      "icon": "musicbox",
      "cat": "art",
      "guide": 140,
      "tells": ["Swallowtail joints, no nails. The real thing."]
    },
    "sampler1899": {
      "name": "Sampler stitched in 1899",
      "icon": "painting",
      "cat": "art",
      "guide": 90,
      "tells": ["\"Hannah, aged 11, Saint Brine's, 1899.\""]
    },
    "holyRelic": {
      "name": "\"Holy relic\"",
      "icon": "goblet",
      "cat": "silver",
      "guide": 30,
      "tells": ["It's a pepper grinder."]
    }
  },
  "overheard": [
    { "line": "To a friend: \"Saint Brine's is doing an auction for the roof. Forty years of junk in that attic. Somebody's going to find a Rembrandt.\"" },
    { "line": "Quietly: \"My cousin at the diocese says they sold something big last spring. Wouldn't say what.\"", "if": "!flag.benefitAuction" }
  ],
  "scenes": {
    "benefitAsk": {
      "title": "Sister Amabel asks you to run the auction",
      "customer": "amabel",
      "steps": [
        { "set": { "benefitAsked": true } },
        { "hook": "startPot" },
        {
          "say": "amabel",
          "text": [
            { "if": "flag.charity", "then": "Me again. Your gift bought the tarp. It's blue, it flaps, and the children love it.", "else": "Me again. Don't worry, I'm not here for money this time. Well. Not directly." },
            "Father Ignatius wants to hold a benefit auction at the Grange Hall. The whole town will come. But somebody has to know what things are worth.",
            "Father Ignatius thinks Ming is a kind of soup. Forty years of donations are sitting in our attic. Would you sort them into lots, and hold the gavel on the night?"
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'd be glad to, Sister.\"",
              "then": [
                { "set": { "benefitYes": true } },
                { "say": "amabel", "text": "Bless you. Come up to the attic {when:benefit-attic|or:one night soon}, after you close. Bring your magnifying glass. The good one." },
                { "toast": "Calendar: Saint Brine's attic, {when:benefit-attic|or:one night soon} night", "look": "amabel" }
              ]
            },
            {
              "label": "\"I'm too busy, Sister. I'm sorry.\"",
              "then": [
                { "set": { "benefitNo": true } },
                { "say": "amabel", "text": "I understand. Father Ignatius will run it, then. Heaven help us all." }
              ]
            }
          ]
        },
        { "say": "amabel", "text": "The auction is {when:hub-auction|or:one night soon} night at the Grange Hall. Do come and bid." },
        { "leave": "amabel" }
      ]
    },
    "benefitAttic": {
      "title": "Sorting the donations in Saint Brine's attic",
      "steps": [
        {
          "stage": "saintbrinesAttic",
          "view": { "timeOfDay": 0.95 },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [112, 162] },
            { "id": "amabel", "cast": "amabel", "at": [190, 158], "facingLeft": true },
            { "id": "dulcie", "cast": "dulcie", "at": [150, 166], "facingLeft": true }
          ]
        },
        { "narrate": "Saint Brine's attic, after dark. One bulb, a tarp over the hole the storm made, and forty years of things people couldn't bear to throw out and didn't want either." },
        { "say": "amabel", "text": "Every box up here was given to us. Most of it was given to get it out of somebody's garage." },
        { "say": "dulcie", "text": "I'm Dulcie. I'm holding the flashlight. Is any of it treasure?" },
        { "use": "light", "as": "lit", "if": "hook.carryingLight", "note": "items in use (docs/ITEMS_IN_USE.md): a proper light and something to read small marks with" },
        { "use": "read", "as": "glass", "if": "hook.carryingRead" },
        {
          "narrate": {
            "if": "lit && glass",
            "then": "Six boxes worth a look. With your {lit.name|lower} the attic stops being one bulb and a lot of guessing. And the {glass.name|lower} reads a hallmark at arm's length. You have time to look closely at 5.",
            "else": {
              "if": "lit",
              "then": "Six boxes worth a look. With your {lit.name|lower} the attic stops being one bulb and a lot of guessing. You have time to look closely at 4.",
              "else": { "if": "glass", "then": "Six boxes worth a look. And the {glass.name|lower} reads a hallmark at arm's length. You have time to look closely at 4.", "else": "Six boxes worth a look. The bulb is old and your eyes are tired: you have time to look closely at three." }
            }
          }
        },
        {
          "hook": "sortAttic",
          "sets": ["kept"],
          "note": "look closely at three boxes (four with a light, five with a glass too), then lot each treasure or buy it cheap",
          "with": {
            "lots": [
              { "id": "buttonTin", "box": "A biscuit tin that rattles", "look": "Buttons, hundreds of them. And one that isn't a button: a 1797 gold half eagle, worn thin.", "guide": 220, "junk": 6, "treasure": true },
              { "id": "shakerBox", "box": "A wooden box with a sliding lid", "look": "Maple and pine, swallowtail joints, no nails. A Shaker sewing box, and a good one.", "guide": 140, "junk": 10, "treasure": true },
              { "id": "sampler1899", "box": "A framed piece of needlework", "look": "A sampler. Stitched along the bottom: \"Hannah, aged 11, Saint Brine's, 1899.\"", "guide": 90, "junk": 8, "treasure": true },
              { "id": "holyRelic", "box": "A silver thing labelled HOLY RELIC", "look": "A pepper grinder. Silver-plated, and it still grinds.", "guide": 30, "junk": 30 },
              { "box": "A lamp shaped like a lighthouse", "look": "The light goes round. The lamp has never worked. It is what it looks like.", "guide": 6, "junk": 6 },
              { "box": "Nine fondue sets", "look": "Nine. All the same brand, all unopened.", "guide": 12, "junk": 12 }
            ],
            "treasure": "Is that good? Your face did a thing.",
            "lot": "Lot it for the auction: {lot.box|lower}",
            "buy": "Buy it yourself at the junk price ({lot.junk|money})",
            "buyHint": "(worth about {lot.guide|money})",
            "bought": "Bought {it.name|lower} from Saint Brine's attic"
          }
        },
        {
          "if": "kept > 0 && random < 0.4",
          "then": [
            { "set": { "benefitCaught": true } },
            { "say": "dulcie", "text": "Wait. You said that was junk. You told Sister it was junk and then you bought it." },
            { "say": "amabel", "text": "...I'm sure there's an explanation. We'll say no more about it." },
            { "rep": -10, "why": "Dulcie saw you buy the attic's treasures cheap" }
          ],
          "else": [
            { "say": "amabel", "text": "That's every box sorted. The roof fund stands at {hook:pot|money}. You've done a good night's work." }
          ]
        },
        { "refresh": "panel" }
      ]
    },
    "benefitDonor": {
      "title": "Lois Pruett gives to the roof instead",
      "customer": "donor",
      "steps": [
        { "hook": "donation", "with": ["vase", "candlestick", "painting", "musicbox"], "sets": ["item"] },
        { "view": { "counterIcon": "{item.icon}" } },
        { "say": "donor", "text": "I was going to sell you this {item.name|lower}. Then I heard about the Saint Brine's auction. Can I give it to the roof instead?" },
        {
          "choose": [
            {
              "label": "\"Of course. I'll make sure it goes in a good lot.\"",
              "then": [
                {
                  "hook": "roof",
                  "with": { "item": "item", "why": "{donor.name} donated a {item.name|lower}." }
                },
                { "rep": 1 },
                { "say": "donor", "text": "Good. That feels better than money." }
              ]
            },
            {
              "label": "Make an offer for it instead",
              "then": [
                { "hook": "buyIt", "sets": ["bought"] },
                {
                  "if": "bought == 'deal'",
                  "then": [{ "say": "donor", "text": "Well. The roof will have to manage without it." }],
                  "else": [
                    {
                      "hook": "roof",
                      "with": { "item": "item", "why": "{donor.name} gave it to the auction anyway." }
                    }
                  ]
                }
              ]
            }
          ]
        },
        { "view": { "counterIcon": null } },
        { "leave": "donor" }
      ]
    },
    "benefitIgnatius": {
      "title": "Father Ignatius collects for the auction",
      "customer": "ignatius",
      "steps": [
        {
          "say": "ignatius",
          "text": [
            "Father Ignatius, from Saint Brine's! I'm collecting for the auction! Anything you can spare from the shelves!",
            "Every item goes in the pot at full value! I mean the roof! Not an actual pot!"
          ]
        },
        {
          "hook": "collect",
          "note": "up to three times: something off your shelves (the first four you could sell), or nothing more",
          "with": {
            "give": "Give the {it.name|lower}",
            "hint": "(+{it.guide|money} to the roof)",
            "none": "\"Nothing this time, Father.\"",
            "enough": "\"That's all I can spare, Father.\"",
            "why": "You gave the {it.name|lower} to the auction.",
            "thanks": [
              "Marvellous! A what? Never mind, it's marvellous!",
              "You're too kind! What? Oh, I heard you. Too kind!"
            ]
          }
        },
        { "say": "ignatius", "text": "God bless! Speak up on my left side, by the way. The right one's just for show!" },
        { "refresh": "panel" },
        { "leave": "ignatius" }
      ]
    },
    "benefitAuctionOpen": {
      "title": "The Benefit Auction opens",
      "steps": [
        {
          "stage": "grange",
          "view": { "timeOfDay": 0.95, "sign": "BENEFIT AUCTION" },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 164] },
            { "id": "amabel", "cast": "amabel", "at": [170, 160], "facingLeft": true }
          ]
        },
        { "hook": "keepAmabel" },
        { "narrate": "The Grange Hall, packed for the Saint Brine's Benefit Auction. Folding chairs, a coffee urn, bunting, and half of Hollow Neck holding numbered paddles." },
        { "say": "amabel", "text": "Look at them all. Even the people who never come to anything have come to this.", "if": "quest.benefit" }
      ]
    },
    "benefitAuctionClose": {
      "title": "The Benefit Auction closes",
      "steps": [
        { "narrate": "The urn runs dry, the chairs get stacked, and somebody's paddle is left under every seat." },
        { "view": { "sign": null } }
      ]
    },
    "benefitGavel": {
      "title": "The Saint Brine's lots, and an envelope",
      "steps": [
        { "hook": "amabelHere", "sets": ["amabel"] },
        { "enter": { "id": "ignatius", "cast": "ignatius", "at": [236, 162], "facingLeft": true } },
        { "set": { "benefitAuction": true } },
        { "hook": "potStart", "sets": ["pot"] },
        {
          "if": "flag.benefitYes",
          "then": [
            { "narrate": "You take the gavel. In the front row: Ellery Thorne and Delphine Rook, not looking at each other; Madame Orsolya in all her scarves; Gordie Haines, waving his paddle at people he wants to be seen with." },
            { "hook": "crowd", "sets": ["pal", "rival"] },
            {
              "if": "rival",
              "then": [
                { "hook": "potTimes", "with": 0.85 },
                { "narrate": "{rival.name} stands at the back with arms folded, telling everyone in earshot that the lots are overpriced and the auctioneer is worse. The first three lots go cheap." }
              ]
            },
            {
              "choose": [
                {
                  "label": "Run it straight",
                  "then": [
                    { "narrate": "You run it like Odile would have: fast, fair, and with a joke every third lot. Nobody gets a bargain they didn't earn." }
                  ]
                },
                {
                  "label": "Plant a friend in the back row to bid prices up",
                  "hint": "(+30%, if nobody notices)",
                  "then": [
                    { "hook": "potTimes", "with": 1.3 },
                    {
                      "if": "random < 0.35",
                      "then": [
                        { "rep": -8, "why": "Caught planting a bidder at the Benefit" },
                        { "narrate": "Your plant bids against himself twice. Gordie Haines notices, and tells everyone. The money still counts. Your name, less so." }
                      ],
                      "else": [
                        { "narrate": "Your plant in the back row is a natural. Every time a bid stalls, his paddle goes up. He goes home with nothing, which is the point." }
                      ]
                    }
                  ]
                },
                {
                  "label": "Let the kids \"help\"",
                  "hint": "(chaos, and the town loves it)",
                  "then": [
                    { "hook": "potTimes", "with": 0.9 },
                    { "rep": 6, "why": "The kids ran the Benefit Auction" },
                    { "narrate": "Dulcie reads the lot numbers, two boys carry things to the wrong buyers, and a seven-year-old sells a fondue set to Father Ignatius. The hall has never laughed so hard." }
                  ]
                },
                {
                  "label": "Catch {pal.name}'s eye: they'll keep the bidding going",
                  "hint": "(+25%, and nobody minds)",
                  "if": "pal",
                  "then": [
                    { "hook": "potTimes", "with": 1.25 },
                    { "narrate": "{pal.name} bids on everything, loudly, and drops out at exactly the right moment every time. Half the hall assumes it's a bit. The other half bids harder." }
                  ]
                },
                {
                  "label": "Father Ignatius Trusts You: he plants the bidder himself",
                  "hint": "(+30%, and nobody suspects a priest)",
                  "card": true,
                  "if": "hook.ignatiusCard",
                  "then": [
                    { "hook": "playCard", "with": "ignatius" },
                    { "hook": "potTimes", "with": 1.3 },
                    { "narrate": "Father Ignatius sits in the back row and bids against everyone, beaming, on lots he has no intention of buying. Nobody suspects a priest. He goes home with a fondue set anyway." }
                  ]
                }
              ]
            },
            { "narrate": "The Shaker box goes to Thorne. The tin of buttons starts a bidding war once someone sees the coin. Madame Orsolya pays sixty dollars for the \"holy relic\" and tells you she knows exactly what it is.", "if": "flag.benefitAttic && !flag.benefitSkimmed" }
          ],
          "else": [
            { "hook": "potTimes", "with": 0.7 },
            { "say": "ignatius", "text": "Lot one! A lovely, er. Lovely thing! Do I hear five dollars? Did someone say fifty? No? Five, then!" },
            { "narrate": "Father Ignatius runs the auction himself. He hears every bid from his left and none from his right. It takes three hours, and the good things go cheap." }
          ]
        },
        { "hook": "potStore" },
        {
          "if": "hook.potReached",
          "then": [
            { "set": { "benefitRoof": true } },
            { "rep": 4 },
            { "say": "amabel", "text": "{hook:pot|money}! That's the whole roof! Father, sit down before you fall down." }
          ],
          "else": [
            { "say": "amabel", "text": "{hook:pot|money}. Not the whole roof. Most of a roof. We'll patch the rest, the way we always do." }
          ]
        },
        {
          "enter": { "id": "merrit", "cast": "merrit", "at": [290, 160], "facingLeft": true },
          "note": "Merrit Gaunt bids on nothing, then hands Sister Amabel an envelope"
        },
        { "walk": "merrit", "to": [214, 160] },
        { "face": "merrit", "left": true },
        { "narrate": "All evening a thin man in a black suit has bid on nothing. Now he walks up to Sister Amabel and hands her an envelope with a gold hand on it." },
        { "say": "merrit", "text": "Merrit Gaunt, Gilded Hand Finance. Our congratulations on the roof, Sister. You'll find our petition on the Town Meeting warrant. Article 9." },
        { "say": "amabel", "text": "We bought nothing from you." },
        { "say": "merrit", "text": "No. The diocese sold us the land, last spring. Saint Brine's sits on a very fine view. Forty-two units, I believe. Good evening." },
        { "walk": "merrit", "to": [330, 160] },
        { "remove": "merrit" },
        { "set": { "benefitArticle9": true } },
        { "say": "amabel", "text": "Rezoned for condos. Town Meeting is {hook:meetingWhen}. Will you come? People listen to you. You know what things are worth." },
        { "toast": "Calendar: Town Meeting, Article 9, {hook:meetingWhen} night", "look": "amabel" },
        { "remove": "ignatius" }
      ]
    },
    "benefitNews": {
      "title": "Sister Amabel brings the news about the land",
      "customer": "amabel",
      "steps": [
        {
          "say": "amabel",
          "text": [
            "You missed quite an auction. And quite an envelope, afterwards.",
            "Saint Brine's land belongs to Gilded Hand Finance. The diocese sold it to them, without a word to us. Article 9 on the Town Meeting warrant: they want it rezoned for condos."
          ]
        },
        { "set": { "benefitArticle9": true } },
        { "say": "amabel", "text": "Town Meeting is {hook:meetingWhen}. If you came, and said something, people would listen." },
        { "toast": "Calendar: Town Meeting, Article 9, {hook:meetingWhen} night", "look": "amabel" },
        { "leave": "amabel" }
      ]
    },
    "benefitArticle9": {
      "title": "Town Meeting: Article 9",
      "steps": [
        { "hook": "meetingRoom" },
        { "enter": { "id": "merrit", "cast": "merrit", "at": [250, 160], "facingLeft": true } },
        { "enter": { "id": "amabel", "cast": "amabel", "at": [70, 164] } },
        { "set": { "benefitArticle9": true } },
        { "narrate": "\"Article 9,\" reads the moderator. \"To see if the town will rezone the parcel known as Saint Brine's, on Chapel Street, from institutional to residential use.\"" },
        { "say": "merrit", "text": "Gilded Hand Finance proposes forty-two homes with harbor views. Tax revenue. Jobs. And the children would be relocated to a modern facility. Inland." },
        { "narrate": "The hall mutters. Sister Amabel sits very straight and says nothing. People keep glancing at you." },
        {
          "choose": [
            {
              "label": "Stand up and speak for Saint Brine's",
              "hint": { "if": "flag.benefitRoof", "then": "(the roof is paid for)", "else": "(the roof isn't paid for)" },
              "then": [
                {
                  "if": "flag.benefitRoof",
                  "then": [
                    {
                      "narrate": [
                        "You tell them about the attic, the auction, and the ${hook:pot} this town raised in one night for a roof. \"They're asking us to sell that. To them.\"",
                        "The vote isn't close. Article 9 fails, and the hall stands up and claps for a nun, which in Hollow Neck has never happened before."
                      ]
                    }
                  ],
                  "else": [
                    { "narrate": "You speak well. But the roof still leaks, and Merrit Gaunt says so, gently, with figures. Article 9 passes, ninety-one to eighty-eight." }
                  ]
                }
              ]
            },
            {
              "label": "Read one line from Odile's ledger",
              "disabled": "!flag.ledger",
              "hint": { "if": "!flag.ledger", "then": "(you'd need proof)" },
              "then": [
                {
                  "narrate": [
                    "You stand and read one line, and only one, from the ledger in your coat: the interest the Hand charged Saint Brine's own diocese on the loan they called in to get the land.",
                    "Merrit Gaunt stops smiling. The room turns like a tide. Article 9 fails by a hundred votes, and three selectmen ask for a copy of the ledger."
                  ]
                },
                { "heat": 4 },
                { "set": { "benefitLedgerRead": true } }
              ]
            },
            {
              "label": "Stay in your seat",
              "then": [
                {
                  "narrate": { "if": "flag.benefitRoof", "then": "Nobody else stands up. The roof fund was a fine thing, people say, but forty-two homes is forty-two homes. Article 9 passes.", "else": "Nobody else stands up. Article 9 passes, and Sister Amabel walks out before the next article." }
                }
              ]
            },
            {
              "label": "Marguerite's Gavel: catch the moderator's eye",
              "hint": "(she calls the vote before Merrit gets to his figures)",
              "card": true,
              "if": "hook.gavelCard",
              "then": [
                { "hook": "playCard", "with": "gavel" },
                { "narrate": "Marguerite Oyelaran catches your eye, nods once, and calls the question before Merrit Gaunt has his folder open. \"All in favor.\" Very few hands. \"Opposed.\" The hall. Article 9 fails." }
              ]
            }
          ],
          "as": "spoke"
        },
        {
          "if": "spoke == 1 || spoke == 3 || (spoke == 0 && flag.benefitRoof)",
          "note": "Saint Brine's is saved",
          "then": [
            { "set": { "benefitEnd": "saved" } },
            { "rep": 8, "why": "Saved Saint Brine's at Town Meeting" },
            { "say": "amabel", "text": "Forty years I've lived in that building. Thank you." }
          ],
          "else": [
            { "set": { "benefitEnd": "roof" }, "if": "flag.benefitRoof" },
            { "set": { "benefitEnd": "condos" }, "if": "!flag.benefitRoof" },
            { "rep": -2 },
            {
              "say": "amabel",
              "text": { "if": "flag.benefitRoof", "then": "Well. At least the condos will have a good roof.", "else": "We'll find somewhere. We always do." }
            }
          ]
        },
        { "remove": "merrit" },
        { "remove": "amabel" }
      ]
    },
    "benefitMeetingNight": {
      "title": "Town Meeting, as a night of its own",
      "note": "Only while there's no Town Meeting hub (js/quests/benefit.js registers its night).",
      "steps": [
        {
          "stage": "townhall",
          "view": { "timeOfDay": 0.95 },
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] }]
        },
        { "narrate": "Town Meeting. Every seat is taken and people are standing along the walls. Articles 1 to 8 are about snowplows. Then the moderator clears her throat." },
        { "run": "benefitArticle9" },
        { "view": { "sign": null } }
      ]
    }
  },
  "beats": [
    { "at": "2-2", "cast": "amabel", "scene": "benefitAsk" },
    { "at": "2-4", "cast": "benefitDonor", "scene": "benefitDonor", "if": "flag.benefitAsked" },
    { "at": "3-1", "cast": "ignatius", "scene": "benefitIgnatius", "if": "flag.benefitAsked && !flag.benefitAuction" },
    { "at": "4-1", "cast": "amabel", "scene": "benefitNews", "if": "flag.benefitAsked && !flag.benefitArticle9" }
  ],
  "nights": [
    {
      "id": "benefit-attic",
      "window": ["2-3", "3-1"],
      "if": "flag.benefitYes",
      "scene": "benefitAttic",
      "test": [{ "set": { "benefitYes": true, "benefitPot": 140 } }, { "hook": "setCoin", "with": 200 }]
    }
  ],
  "hub": {
    "id": "auction",
    "title": "The Benefit Auction",
    "where": "The Grange Hall",
    "window": ["3-1", "3-4"],
    "picks": 2,
    "open": "benefitAuctionOpen",
    "close": "benefitAuctionClose",
    "test": [
      { "set": { "benefitAsked": true, "benefitYes": true, "benefitPot": 320, "spoonsLot22Known": true } },
      { "hook": "setCoin", "with": 300 }
    ]
  },
  "vignettes": [
    { "hub": "auction", "label": "The Saint Brine's lots", "scene": "benefitGavel", "if": "!flag.benefitAuction" },
    { "hub": "meeting", "label": "Article 9: Saint Brine's", "scene": "benefitArticle9", "if": "!flag.benefitEnd" }
  ],
  "calendar": [
    {
      "id": "benefit-attic",
      "night": "benefit-attic",
      "story": "benefit",
      "where": "Saint Brine's attic",
      "title": "Sorting the donations",
      "known": "flag.benefitYes",
      "scene": "benefitAttic",
      "bring": ["light", "read"]
    },
    { "id": "benefit-auction", "night": "hub-auction", "story": "benefit", "where": "The Grange Hall", "title": "The Benefit Auction", "known": "flag.benefitAsked", "scene": "benefitAuctionOpen" },
    { "id": "benefit-article9", "night": "hub-meeting", "story": "benefit", "where": "Town Meeting", "title": "Article 9", "known": "flag.benefitArticle9 && hook.meetingHub", "scene": "benefitArticle9" },
    { "id": "benefit-meeting", "night": "benefit-meeting", "story": "benefit", "where": "Town Meeting", "title": "Article 9", "known": "flag.benefitArticle9 && !hook.meetingHub", "scene": "benefitMeetingNight" }
  ],
  "epilogue": [
    {
      "line": { "if": "flag.benefitRoof", "then": "Saint Brine's still stands on Chapel Street, under a new roof. Dulcie wants to be an auctioneer.", "else": "Saint Brine's still stands on Chapel Street, under a blue tarp the children have named. Dulcie wants to be an auctioneer." },
      "if": "flag.benefitEnd == 'saved'"
    },
    { "line": "Saint Brine's got its new roof the same month it lost its land. The condos kept the roof.", "if": "flag.benefitEnd == 'roof' || (!flag.benefitEnd && flag.benefitAsked && flag.benefitRoof)" },
    { "line": "The children of Saint Brine's moved inland in the spring. Sister Amabel still writes to the shop at Christmas.", "if": "flag.benefitEnd == 'condos' || (!flag.benefitEnd && flag.benefitAsked && !flag.benefitRoof)" },
    { "line": "Dulcie has told everyone at school what you paid for the attic's treasures.", "if": "flag.benefitCaught" }
  ],
  "talk": {
    "by": "hal",
    "rumour": [
      "Sold Saint Brine's another blue tarp this morning. That's three. That roof is a tarp with a building under it.",
      "Father Ignatius says they're holding an auction to fix it. I'd bid. I'd bid on a roof."
    ],
    "react": { "saved": "Saint Brine's is staying where it is. Good roof, good land. I'm out of tarps for once.", "roof": "Good roof on Saint Brine's. Shame about who owns the dirt under it.", "condos": "Sea View Condos. On the Saint Brine's lot. They bought their screws somewhere else." },
    "sway": { "saved": { "ignatius": 3, "hal": 2 }, "roof": { "ignatius": 1 }, "condos": { "hal": -2 } }
  },
  "fallout": {
    "condos": { "id": "ignatius", "mood": "gone", "line": "Father Ignatius has gone to stay with his sister in Worcester. Sister Amabel says he couldn't watch the surveyors.", "after": "Father Ignatius spent the rest of the month in Worcester. He came back for the last bingo night, and lost." }
  },
  "outcome": [
    { "if": "flag.benefitEnd == 'saved'", "ending": "saved" },
    { "if": "flag.benefitEnd == 'roof' || (!flag.benefitEnd && flag.benefitAsked && flag.benefitRoof)", "ending": "roof" },
    { "if": "flag.benefitEnd == 'condos' || (!flag.benefitEnd && flag.benefitAsked)", "ending": "condos" }
  ]
});
