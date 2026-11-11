// Pawn Champ - The Old Home Week Spoons: a rich man's obsession with seven souvenir spoons, and
// the box they open. Major quest M10, batch A (docs/quests/MAJOR.md#m10-the-old-home-week-spoons).
// Uses the Cliff Road house (dinner), the Benefit Auction hub (Lot 22) and the Athenaeum basement.
// Seven sterling souvenir spoons from the town's 1904 homecoming, each with a landmark in the bowl
// and a number in the engraving. Thorne owns two. The other five come across your counter, one at
// a time, along with a fake. Laid in order, the seven numbers open the Athenaeum's cornerstone.
// Ellery Thorne pays $40 a spoon, or $50 with Thorne's Standing Order (js/cards.js): spoonPrice()
// in js/quests/spoons.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "spoons",
  "kind": "major",
  "colour": "#b0b8c8",
  "family": "town",
  "title": "The Old Home Week Spoons",
  "crosses": ["benefit", "selectmen", "overdue"],
  "rumour": "A rich man on Cliff Road will pay anything for a souvenir spoon from 1904.",
  "endings": { "thorne": "Seven Spoons", "rook": "The Highest Bidder", "scattered": "One at a Time" },
  "outcome": [
    { "if": "flag.spoonsEnd == 'thorne'", "ending": "thorne" },
    { "if": "flag.spoonsEnd == 'rook'", "ending": "rook" },
    { "if": "flag.spoonsMet", "ending": "scattered" }
  ],
  "about": [
    "A collecting story with a buried prize. Ellery Thorne of Cliff Road has two of the seven sterling souvenir spoons struck for Old Home Week in 1904, and pays a standing price for any of the other five (§{spoonsThorne}). His late sister Constance was sure the seven spelled something.",
    "Over the month the spoons walk in one at a time: the Ferry from a nana's sideboard (§{spoonFerry}), the Cannery (§{spoonCannery}), the Church (§{spoonChurch}), and the Neck, which a boy in a hoodie found \"in a place\" (§{spoonNeck}). Vic Lamoureux brings a fake Lighthouse (§{spoonFakeSale}). At dinner on Cliff Road (§{spoonsDinner}) Thorne offers $500 for the set, and his rival collector Delphine Rook offers $60 a spoon, tonight. Rook comes for the Neck, which was stolen from her car (§{spoonsRook}); give it back and she owes you a favour. If The Benefit is in the run, the Grange Hall spoon is Lot 22 at its auction (§{spoonsLot22}); if Rook wins it she'll sell it to you later, to annoy Thorne (§{spoonsRookSells}). Thorne checks on your progress (§{spoonsCheck}).",
    "With five spoons gathered, Hester Quint opens the 1904 cornerstone in the Athenaeum basement (§{spoonsCornerstone}): the numbers in the bowls work a seven-dial lock. Inside is the original deed to the Harbor Green, \"for the use of the people forever\". Give Thorne the set and the deed goes to the town (Seven Spoons), or sell both to Rook for $700, and the deed ends up with Gordie Haines (The Highest Bidder). Selling spoons off one at a time is One at a Time."
  ],
  "cast": {
    "thorne": {
      "name": "Ellery Thorne",
      "look": { "skin": "#f0d0b8", "hair": "#e8e8e8", "hs": 0, "coat": "#3a4a3a", "trim": "#c8a050", "style": "jacket", "long": true, "pants": "#4a4238", "moustache": "#e8e8e8", "glasses": "#c8a050", "hat": "wide", "hatc": "#5a4a32", "band": "#2a2a22" }
    },
    "rook": {
      "name": "Delphine Rook",
      "look": { "skin": "#6a4430", "hair": "#e8e8e8", "hs": 1, "coat": "#7a1e3a", "trim": "#e8c040", "style": "suit", "long": true, "pants": "#2a2a2a", "glasses": "#1a1a1a", "bag": "#1a1a1a" }
    },
    "spoonSellerA": {
      "name": "Nell Marchand",
      "look": { "skin": "#e0b090", "hair": "#5a3a24", "hs": 3, "coat": "#3a6a8a", "style": "puffer", "pants": "#3a3a42" }
    },
    "spoonSellerB": {
      "name": "Vic Lamoureux",
      "look": { "skin": "#f0c8a8", "hair": "#2a2a2a", "hs": 0, "coat": "#2a2a30", "trim": "#c8a050", "style": "suit", "pants": "#2a2a30", "moustache": "#2a2a2a" }
    },
    "spoonSellerC": {
      "name": "Bunny Oakes",
      "look": { "skin": "#c89070", "hair": "#c8c8c8", "hs": 2, "coat": "#8a6a3a", "style": "jacket", "pants": "#4a4238", "hat": "beanie", "hatc": "#3a6a3a" }
    },
    "spoonSellerD": {
      "name": "Teo",
      "look": { "skin": "#a87050", "hair": "#1a1210", "hs": 4, "coat": "#4a4a52", "style": "hoodie", "pants": "#2a3a4a" }
    },
    "spoonSellerE": {
      "name": "Mrs. Abernathy",
      "look": { "skin": "#f0d8c8", "hair": "#d8d8e0", "hs": 3, "coat": "#5a3a5a", "style": "dress", "pants": "#5a3a5a", "bag": "#2a2a2a" }
    }
  },
  "uniques": {
    "spoon-lighthouse": {
      "name": "Old Home Week spoon (Lighthouse)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. Lighthouse in the bowl, and a tiny 1 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoon-ferry": {
      "name": "Old Home Week spoon (Ferry)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. Ferry in the bowl, and a tiny 9 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoon-church": {
      "name": "Old Home Week spoon (Church)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. Church in the bowl, and a tiny 0 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoon-grange": {
      "name": "Old Home Week spoon (Grange Hall)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. Grange Hall in the bowl, and a tiny 4 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoon-townhall": {
      "name": "Old Home Week spoon (Town Hall)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. Town Hall in the bowl, and a tiny 1 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoon-cannery": {
      "name": "Old Home Week spoon (Cannery)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. Cannery in the bowl, and a tiny 7 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoon-neck": {
      "name": "Old Home Week spoon (the Neck)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 40,
      "set": "Old Home Week spoons",
      "tells": ["Sterling, struck 1904. the Neck in the bowl, and a tiny 6 worked into the engraving."],
      "wantedBy": { "name": "Ellery Thorne", "mult": 1 },
      "wantedKnown": "flag.spoonsMet"
    },
    "spoonFake": {
      "name": "Old Home Week spoon (Lighthouse)",
      "icon": "spoon",
      "cat": "silver",
      "guide": 4,
      "fake": true,
      "set": "Old Home Week spoons",
      "tells": [
        { "text": "Plated, and the \"1904\" is cast, not struck. There's no number in the engraving at all.", "cls": "bad" }
      ]
    },
    "thorneWatch": {
      "name": "Josiah Thorne's pocket watch",
      "icon": "watch",
      "cat": "curio",
      "guide": 160,
      "tells": ["Gold, engraved \"J.T., Selectman, 1904\". Wound once a century."]
    },
    "rookCard": {
      "name": "Delphine Rook's calling card",
      "icon": "letter",
      "cat": "curio",
      "guide": 0,
      "questKey": true,
      "tells": ["\"D. Rook. Owes you one.\" In fountain pen."]
    }
  },
  "overheard": [
    { "line": "To a friend: \"That Thorne fellow on Cliff Road paid forty dollars for a spoon. A spoon! I've got a drawer full of spoons.\"" },
    { "line": "Muttering: \"Delphine Rook's car got broken into again. They only took a spoon. Who steals a spoon?\"", "if": "!flag.rookNeckReturned" }
  ],
  "scenes": {
    "spoonsThorne": {
      "title": "Ellery Thorne's standing order",
      "customer": "thorne",
      "steps": [
        { "set": { "spoonsMet": true } },
        { "view": { "counterIcon": "spoon" } },
        {
          "say": "thorne",
          "text": [
            "Ellery Thorne, Cliff Road. I collect Hollow Neck. All of it. Today, specifically, spoons.",
            "In 1904 the town held an Old Home Week and struck seven sterling souvenir spoons. A landmark in each bowl. I have two: the Lighthouse and the Town Hall.",
            { "if": "hook.price == 40", "then": "I'll pay forty dollars for any of the other five. For the set I would pay a great deal more. My late sister was certain the seven spell something.", "else": "I'll pay fifty dollars for any of the other five. For the set I would pay a great deal more. My late sister was certain the seven spell something." },
            "Would you come to dinner, {hook:dinnerWhen}? Bring an appetite and an open mind. I'm told I talk about spoons."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'd like that.\"",
              "then": [
                { "set": { "spoonsDinner": true } },
                { "say": "thorne", "text": "Splendid. Seven o'clock. Don't mind the dogs." },
                { "toast": "Calendar: dinner at Ellery Thorne's on Cliff Road, {hook:dinnerWhen} night", "look": "thorne" }
              ]
            },
            {
              "label": "\"I just sell spoons, Mr. Thorne.\"",
              "then": [
                {
                  "say": "thorne",
                  "text": { "if": "hook.price == 40", "then": "Then sell me spoons. The offer stands: forty apiece.", "else": "Then sell me spoons. The offer stands: fifty apiece." }
                }
              ]
            }
          ]
        },
        {
          "if": "hook.auctionNight",
          "then": [
            { "set": { "spoonsLot22Known": true } },
            { "say": "thorne", "text": "And the Grange Hall spoon is Lot 22 at the Saint Brine's benefit auction, {hook:auctionWhen}. Delphine Rook will be there. Delphine is always there." }
          ]
        },
        { "toast": "Wanted: Old Home Week spoons. Ellery Thorne pays {hook:price|money} each.", "look": "thorne", "icon": "spoon" },
        { "view": { "counterIcon": null } },
        { "leave": "thorne" }
      ]
    },
    "spoonFerry": {
      "title": "Nell Marchand brings the Ferry spoon",
      "customer": "spoonSellerA",
      "steps": [
        { "say": "spoonSellerA", "text": "Clearing out my nana's sideboard. There's a little spoon with a ferry on it. She said it was from some festival." },
        {
          "hook": "haggle",
          "with": { "spoon": "spoon-ferry", "persona": "honest", "asking": 45, "min": 30 },
          "sets": ["offer"],
          "note": "the spoon over the counter; a fake one is already marked as fake if you have Hester's 1904 programme"
        },
        { "end": true, "if": "offer == 'watch'" },
        { "leave": "spoonSellerA" }
      ]
    },
    "spoonFakeSale": {
      "title": "Vic Lamoureux brings a \"Lighthouse\" spoon (a fake)",
      "customer": "spoonSellerB",
      "steps": [
        { "say": "spoonSellerB", "text": "I hear the gentleman on Cliff Road collects these. Old Home Week, 1904. The Lighthouse. Very rare." },
        {
          "hook": "haggle",
          "with": { "spoon": "spoonFake", "persona": "smooth", "asking": 60, "min": 40 },
          "sets": ["offer"],
          "note": "the spoon over the counter; a fake one is already marked as fake if you have Hester's 1904 programme"
        },
        { "end": true, "if": "offer == 'watch'" },
        { "leave": "spoonSellerB" }
      ]
    },
    "spoonCannery": {
      "title": "Bunny Oakes brings the Cannery spoon",
      "customer": "spoonSellerC",
      "steps": [
        { "say": "spoonSellerC", "text": "My dad worked at the cannery forty years. They gave him this spoon. I need the forty more than he needs the spoon. He's dead." },
        {
          "hook": "haggle",
          "with": { "spoon": "spoon-cannery", "persona": "desperate", "asking": 40, "min": 26 },
          "sets": ["offer"],
          "note": "the spoon over the counter; a fake one is already marked as fake if you have Hester's 1904 programme"
        },
        { "end": true, "if": "offer == 'watch'" },
        { "leave": "spoonSellerC" }
      ]
    },
    "spoonNeck": {
      "title": "Teo brings the Neck spoon (stolen from Rook)",
      "customer": "spoonSellerD",
      "steps": [
        { "say": "spoonSellerD", "text": "Found this. In a... in a place. It's silver, right? Spoon with a beach on it." },
        {
          "hook": "haggle",
          "with": {
            "spoon": "spoon-neck",
            "persona": "shifty",
            "asking": 35,
            "min": 18,
            "extra": { "stolen": true, "mark": "the initials D.R. scratched on the back" }
          },
          "sets": ["offer"],
          "note": "the spoon over the counter; a fake one is already marked as fake if you have Hester's 1904 programme"
        },
        { "end": true, "if": "offer == 'watch'" },
        { "leave": "spoonSellerD" }
      ]
    },
    "spoonChurch": {
      "title": "Mrs. Abernathy brings the Church spoon",
      "customer": "spoonSellerE",
      "steps": [
        { "say": "spoonSellerE", "text": "This was in the collection plate at Saint Brine's in 1950-something. My mother bought it back from the Father for a dollar. Long story." },
        {
          "hook": "haggle",
          "with": { "spoon": "spoon-church", "persona": "honest", "asking": 50, "min": 34 },
          "sets": ["offer"],
          "note": "the spoon over the counter; a fake one is already marked as fake if you have Hester's 1904 programme"
        },
        { "end": true, "if": "offer == 'watch'" },
        { "leave": "spoonSellerE" }
      ]
    },
    "spoonsDinner": {
      "title": "Dinner on Cliff Road",
      "steps": [
        {
          "stage": "cliffroad",
          "view": { "timeOfDay": 0.95 },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "thorne", "cast": "thorne", "at": [200, 162], "facingLeft": true },
            { "id": "rook", "cast": "rook", "at": [250, 164], "facingLeft": true }
          ]
        },
        { "set": { "spoonsDinnerDone": true } },
        { "narrate": "Cliff Road. Clocks in every room, ship models in glass cases, and by the fire a wolfhound asleep with a terrier asleep on top of him." },
        { "say": "rook", "text": "Delphine Rook. Ellery invites me to everything so he can watch me not get things. Hello, shopkeeper." },
        {
          "say": "thorne",
          "text": [
            "My sister Constance spent forty years on those spoons. She said the bowls spell something. She died with five of them still out there.",
            "Bring me the set and I'll pay five hundred dollars. I mean every cent of it."
          ]
        },
        { "say": "rook", "text": "And I'll pay sixty a spoon, tonight, cash, for any you've got. Constance was a dear, and quite mad." },
        { "hook": "held", "sets": ["held"], "note": "the real spoons on your shelves" },
        {
          "choose": [
            {
              "label": "Sell Rook your spoons tonight",
              "hint": { "if": "held.count", "then": "({held.count} x $60)", "else": "(you have none yet)" },
              "disabled": "!held.count",
              "then": [
                { "hook": "sellToRook" },
                { "say": "thorne", "text": "...I see. Well. The soup is very good, at least." }
              ]
            },
            {
              "label": "\"I'm with Mr. Thorne. I'll find the set.\"",
              "then": [
                { "set": { "spoonsThorneSide": true } },
                { "say": "thorne", "text": "Then you're the first person in years who didn't think I was a silly old man." }
              ]
            },
            {
              "label": "\"I'm just here for the chowder.\"",
              "then": [
                { "say": "rook", "text": "Wise. Stay neutral. Watch us fight. It's the only fun on Cliff Road." }
              ]
            }
          ]
        },
        { "set": { "spoonsFinaleKnown": true } },
        { "say": "thorne", "text": "Hester Quint at the Athenaeum thinks she knows what they open. If we have all seven, she'll take us down to the basement {hook:cornerstoneWhen}." },
        { "toast": "Calendar: the Athenaeum basement, {hook:cornerstoneWhen} night, if the set is whole", "look": "thorne" },
        { "say": "rook", "text": "And Ellery, darling: I'll see you at Lot 22.", "if": "hook.auctionNight && !flag.spoonsLot22" }
      ]
    },
    "spoonsRook": {
      "title": "Delphine Rook comes for her stolen spoon",
      "customer": "rook",
      "steps": [
        { "find": "neck", "in": "stock", "match": { "uniqueId": "spoon-neck" } },
        { "say": "rook", "text": "Delphine Rook. We've met, or we will. Someone took a spoon from my car in August. The Neck, with my initials scratched on the back." },
        {
          "if": "neck",
          "then": [
            { "say": "rook", "text": "And there it is, on your shelf. Don't worry. I don't call the police. I call in favours." },
            {
              "choose": [
                {
                  "label": "Give it back to her",
                  "then": [
                    { "take": "neck" },
                    { "set": { "rookNeckReturned": true, "rookCard": true } },
                    { "add": { "unique": "rookCard" } },
                    { "refresh": "panel" },
                    {
                      "say": "rook",
                      "text": [
                        "Well. Nobody's ever done that. Here's my card. It means I owe you one, and I always pay.",
                        "And when Ellery opens his precious box, I'll bring the Neck myself. I want to see his face."
                      ]
                    }
                  ]
                },
                {
                  "label": "Sell it back to her for $60",
                  "then": [
                    { "take": "neck" },
                    { "coin": 60, "why": "Sold the Neck spoon back to Delphine Rook" },
                    { "hook": "soldRook", "with": 1 },
                    { "say": "rook", "text": "Business is business. I respect that, a little." }
                  ]
                },
                {
                  "label": "\"I paid for it fair and square.\"",
                  "then": [
                    { "rep": -2 },
                    { "say": "rook", "text": "Fair and square. From a boy in a hoodie. Of course." }
                  ]
                }
              ]
            }
          ]
        },
        { "hook": "held", "sets": ["held"] },
        {
          "if": "held.count",
          "then": [
            {
              "say": "rook",
              "text": { "if": "held.count == 1", "then": "I see a spoon I like. Sixty apiece, today.", "else": "I see {held.count} spoons I like. Sixty apiece, today." }
            },
            {
              "choose": [
                { "label": "Sell them to Rook (+{hook:rookOffer})", "then": [{ "hook": "sellToRook" }] },
                {
                  "label": "\"They're promised to Mr. Thorne.\"",
                  "then": [{ "say": "rook", "text": "Loyal. How exhausting for you." }]
                }
              ]
            }
          ]
        },
        { "refresh": "panel" },
        { "leave": "rook" }
      ]
    },
    "spoonsCheck": {
      "title": "Thorne checks on the set",
      "customer": "thorne",
      "steps": [
        { "hook": "held", "sets": ["held"] },
        { "say": "thorne", "text": "Thorne again. How are my spoons? I make it {hook:countWithStudy} of seven, if you count the two in my study." },
        {
          "if": "held.count",
          "then": [
            {
              "choose": [
                {
                  "label": "Sell them to him now, one at a time (+{hook:thorneOffer})",
                  "then": [
                    { "hook": "sellToThorne" },
                    { "say": "thorne", "text": "Constance would be beside herself. She usually was." }
                  ]
                },
                {
                  "label": "\"I'll bring them all together, for the cornerstone.\"",
                  "then": [
                    { "say": "thorne", "text": "Yes. Yes, all together. That's how she would have wanted it." }
                  ]
                }
              ]
            }
          ]
        },
        {
          "if": "!flag.spoonsFinaleKnown",
          "then": [
            { "set": { "spoonsFinaleKnown": true } },
            { "say": "thorne", "text": "Hester Quint at the Athenaeum will open the cornerstone for us {hook:cornerstoneWhen}, if the set is whole." },
            { "toast": "Calendar: the Athenaeum basement, {hook:cornerstoneWhen} night, if the set is whole", "look": "thorne" }
          ]
        },
        { "refresh": "panel" },
        { "leave": "thorne" }
      ]
    },
    "spoonsLot22": {
      "title": "The Benefit Auction: Lot 22",
      "steps": [
        { "enter": { "id": "rook", "cast": "rook", "at": [236, 164], "facingLeft": true } },
        { "narrate": "\"Lot 22,\" calls the auctioneer. \"A souvenir spoon, sterling, Old Home Week 1904. The Grange Hall. Who'll start me at twenty?\"" },
        { "say": "rook", "text": "Twenty." },
        {
          "hook": "rookLimit",
          "sets": ["limit", "over"],
          "note": "how high Rook will go: $90 to $139, at random; you'd win at five more"
        },
        {
          "choose": [
            {
              "label": "Bid up to $80",
              "disabled": "coin < 80",
              "then": [
                {
                  "if": "limit < 80",
                  "then": [
                    { "narrate": "The bidding climbs in fives. At {limit|money} Rook stops, looks at you over her glasses, and laughs. Lot 22 is yours at {over|money}." },
                    { "hook": "win", "with": "over" }
                  ],
                  "else": [
                    { "narrate": "You stop at $80. Rook doesn't stop at all. Lot 22 goes to her at $85." },
                    { "set": { "spoonsLot22": "rook" } },
                    { "say": "rook", "text": "Don't sulk. I might sell it to you. At a price." }
                  ]
                }
              ]
            },
            {
              "label": "Bid up to $160",
              "disabled": "coin < 160",
              "then": [
                {
                  "if": "limit < 160",
                  "then": [
                    { "narrate": "The bidding climbs in fives. At {limit|money} Rook stops, looks at you over her glasses, and laughs. Lot 22 is yours at {over|money}." },
                    { "hook": "win", "with": "over" }
                  ],
                  "else": [
                    { "narrate": "You stop at $160. Rook doesn't stop at all. Lot 22 goes to her at $165." },
                    { "set": { "spoonsLot22": "rook" } },
                    { "say": "rook", "text": "Don't sulk. I might sell it to you. At a price." }
                  ]
                }
              ]
            },
            {
              "label": "Catch Rook's eye and call in her favour",
              "disabled": "!flag.rookCard",
              "hint": { "if": "flag.rookCard", "then": "", "else": "(she'd have to owe you one)" },
              "then": [
                { "set": { "rookCard": false } },
                { "find": "card", "in": "stock", "match": { "uniqueId": "rookCard" } },
                { "take": "card" },
                { "say": "rook", "text": "Fine. One favour, paid." },
                { "narrate": "Rook lowers her paddle and examines her nails. Lot 22 is yours for twenty-five dollars." },
                { "hook": "win", "with": 25 }
              ]
            },
            {
              "label": "Let Rook have it",
              "then": [
                { "set": { "spoonsLot22": "rook" } },
                { "narrate": "Rook takes Lot 22 at thirty dollars and waves the spoon at Thorne across the hall." }
              ]
            }
          ]
        },
        { "refresh": "panel" },
        { "remove": "rook" }
      ]
    },
    "spoonsRookSells": {
      "title": "Rook sells on the Grange Hall spoon",
      "note": "If Rook won Lot 22, she'll sell it on.",
      "customer": "rook",
      "steps": [
        { "say": "rook", "text": "The Grange Hall spoon. Ellery's been calling me twice a day. I'd rather sell it to you, just to annoy him." },
        {
          "choose": [
            {
              "label": "Buy it for $120",
              "disabled": "coin < 120",
              "then": [
                { "add": { "unique": "spoon-grange" }, "as": "it" },
                { "edit": "it", "set": { "paid": 120 } },
                { "set": { "spoonsGrangeBought": true } },
                { "coin": -120, "why": "Bought the Grange Hall spoon from Delphine Rook" },
                { "say": "rook", "text": "Pleasure. Truly." }
              ]
            },
            {
              "label": "\"No thank you.\"",
              "then": [{ "say": "rook", "text": "Then it stays in my drawer, next to my other trophies." }]
            }
          ]
        },
        { "refresh": "panel" },
        { "leave": "rook" }
      ]
    },
    "spoonsCornerstone": {
      "title": "The cornerstone in the Athenaeum basement",
      "steps": [
        {
          "stage": "athenaeumBasement",
          "view": { "timeOfDay": 0.95, "boxOpen": false },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 166] },
            { "id": "thorne", "cast": "thorne", "at": [136, 164] },
            { "id": "hester", "cast": "hester", "at": [196, 162], "facingLeft": true },
            { "id": "rook", "cast": "rook", "at": [250, 166], "facingLeft": true }
          ]
        },
        { "narrate": "The Athenaeum basement, after hours. Granite, pipes, a stepladder, and the cornerstone: A.D. 1904, OLD HOME WEEK." },
        { "say": "rook", "text": "Nobody invited me. I came anyway. I've brought a thermos." },
        { "say": "hester", "text": "Hester Quint, librarian. The 1904 minutes mention a box in the cornerstone with a seven-dial lock. Lay the spoons in the programme's order and read the bowls." },
        { "narrate": "Lighthouse, 1. Ferry, 9. Church, 0. Grange Hall, 4. Town Hall, 1. Cannery, 7. The Neck, 6. Hester turns the dials." },
        { "view": { "boxOpen": true } },
        { "narrate": "The block slides out on rusted runners. Inside, a lead box: a folded deed, a gold pocket watch, and a note." },
        { "say": "hester", "text": "\"The Harbor Green, conveyed to the town of Hollow Neck for the use of the people forever.\" This is the original deed. Nobody has seen it in a century." },
        { "say": "thorne", "text": "And the note. It's Grandfather's hand. \"To whoever has the patience to find this: the Green is everybody's. Don't let anybody tell you different. J.T.\"" },
        { "say": "rook", "text": "Very moving. Seven hundred dollars for the set and that bit of paper, shopkeeper. Gordie Haines would pay double for it, and I like a margin." },
        {
          "hook": "thornePays",
          "sets": ["pays"],
          "note": "$500 for the set, less what he's paid you a spoon at a time"
        },
        { "hook": "held", "sets": ["held"] },
        {
          "choose": [
            {
              "label": "Give Thorne the set, and the deed to the town",
              "hint": "(+{pays|money})",
              "then": [
                { "hook": "dropHeld" },
                { "set": { "spoonsEnd": "thorne", "greenDeed": "town" } },
                { "hook": "payThorne" },
                { "rep": 5 },
                { "narrate": "Thorne doesn't say anything for a while. Then he counts out the money, twice, because his hands are shaking." },
                { "say": "thorne", "text": "Constance was right. Of course she was. I'll take the deed to the town clerk in the morning, in person, in my good hat." }
              ]
            },
            {
              "label": "Sell Rook the set and the deed",
              "hint": "(+$700)",
              "disabled": "flag.spoonsSoldThorne > 0 || !held.count",
              "then": [
                { "hook": "dropHeld" },
                { "set": { "spoonsEnd": "rook", "greenDeed": "gordie" } },
                { "coin": 700, "why": "Delphine Rook bought the Old Home Week spoons and the Green deed" },
                { "say": "rook", "text": "Lovely doing business. Keep the watch. I don't do sentiment." },
                { "add": { "unique": "thorneWatch" }, "as": "watch" },
                {
                  "edit": "watch",
                  "set": {
                    "inspected": true,
                    "clues": [
                      { "text": "Gold, engraved \"J.T., Selectman, 1904\". Wound once a century.", "cls": "good" }
                    ]
                  }
                },
                { "narrate": "Thorne watches Rook go up the stairs with his grandfather's deed in her handbag. He doesn't say a word to you, then or ever again." }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "at": "1-3", "cast": "thorne", "scene": "spoonsThorne" },
    { "at": "1-4", "cast": "spoonSellerA", "scene": "spoonFerry", "if": "flag.spoonsMet", "note": "Spoons turn up among sellers, one every few days. One is a fake, one is stolen from Rook." },
    { "at": "2-1", "cast": "spoonSellerB", "scene": "spoonFakeSale", "if": "flag.spoonsMet" },
    { "at": "2-2", "cast": "spoonSellerC", "scene": "spoonCannery", "if": "flag.spoonsMet" },
    { "at": "2-4", "cast": "spoonSellerD", "scene": "spoonNeck", "if": "flag.spoonsMet" },
    { "at": "3-1", "cast": "spoonSellerE", "scene": "spoonChurch", "if": "flag.spoonsMet" },
    { "at": "3-2", "cast": "rook", "scene": "spoonsRook", "if": "flag.spoonsMet" },
    { "at": "3-3", "cast": "thorne", "scene": "spoonsCheck", "if": "flag.spoonsMet" },
    { "at": "4-1", "cast": "rook", "scene": "spoonsRookSells", "if": "flag.spoonsLot22 == 'rook'" }
  ],
  "nights": [
    {
      "id": "spoons-dinner",
      "window": ["1-4", "2-3"],
      "if": "flag.spoonsDinner",
      "scene": "spoonsDinner",
      "test": [{ "set": { "spoonsMet": true, "spoonsDinner": true } }, { "add": { "unique": "spoon-ferry" } }]
    },
    {
      "id": "spoons-cornerstone",
      "window": ["4-2", "4-4"],
      "if": "flag.spoonsFinaleKnown && hook.gathered >= 5",
      "scene": "spoonsCornerstone",
      "test": [
        { "set": { "spoonsMet": true, "spoonsFinaleKnown": true } },
        { "add": { "unique": "spoon-ferry" } },
        { "add": { "unique": "spoon-church" } },
        { "add": { "unique": "spoon-grange" } },
        { "add": { "unique": "spoon-cannery" } },
        { "add": { "unique": "spoon-neck" } }
      ]
    }
  ],
  "vignettes": [
    { "hub": "auction", "label": "Lot 22: an Old Home Week spoon", "if": "!flag.spoonsLot22", "scene": "spoonsLot22", "note": "The Benefit Auction hub is owned by js/quests/benefit.js." }
  ],
  "calendar": [
    { "id": "spoons-dinner", "night": "spoons-dinner", "story": "spoons", "where": "Cliff Road", "title": "Dinner at Ellery Thorne's", "known": "flag.spoonsDinner", "scene": "spoonsDinner" },
    { "id": "spoons-lot22", "night": "hub-auction", "story": "spoons", "where": "The Grange Hall", "title": "The Benefit Auction: Lot 22", "known": "flag.spoonsLot22Known && !quest.benefit", "scene": "spoonsLot22" },
    { "id": "spoons-cornerstone", "night": "spoons-cornerstone", "story": "spoons", "where": "The Athenaeum", "title": "The cornerstone", "known": "flag.spoonsFinaleKnown", "scene": "spoonsCornerstone" }
  ],
  "epilogue": [
    { "line": "The Old Home Week spoons hang in a case at the Athenaeum, labelled \"The Constance Thorne Collection\". The Harbor Green deed is framed beside them.", "if": "flag.spoonsEnd == 'thorne'" },
    { "line": "Gordie Haines paid Delphine Rook fourteen hundred dollars for a piece of paper. Ellery Thorne has stopped inviting people to dinner.", "if": "flag.spoonsEnd == 'rook'" },
    { "line": "Ellery Thorne is still looking for the rest of his sister's spoons.", "if": "flag.spoonsEnd != 'thorne' && flag.spoonsEnd != 'rook' && flag.spoonsMet" }
  ]
});
