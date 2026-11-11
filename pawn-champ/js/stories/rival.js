// Pawn Champ - The Rival Shop. Major quest M16, batch I (docs/quests/MAJOR.md#m16-the-rival-shop).
// Bryony Kettle opens Reclaimed & Co. across the street and bids against you on every good thing that
// comes through Hollow Neck. Her opening party, Odile's old sign, the best stall at the Harvest Fair,
// a midnight window war, and then the truth: she borrowed from the Gilded Hand too.
// Her bids, the tables you dress, her closing-down sale and your overflow are worked in
// js/quests/rival.js; the lines are here.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/rival.js.
defineStory({
  "id": "rival",
  "months": [1, 2],
  "kind": "major",
  "colour": "#b8643a",
  "family": "town",
  "title": "The Rival Shop",
  "crosses": ["barrowboy", "selectmen"],
  "rumour": "Somebody's putting exposed brick and scented candles in the old shoe repair across from your shop.",
  "endings": { "crushed": "Last One Standing", "merged": "Under One Roof", "overflow": "Across the Street" },
  "outcome": "flag.rivalEnd",
  "about": [
    "A competition story that turns into a friendship, or doesn't. Bryony Kettle opens Reclaimed & Co. across the street in the old shoe repair: exposed brick, candles, \"things with a story\" (§{rivalHello}). She tells you plainly she'll bid against you on everything good that comes through town. All month she outbids you on fresh stock and pinches the odd customer, unless you strike a deal with her.",
    "At her opening (§{rivalParty}) you meet her uncle Marv, a house clearer, and notice Merrit Gaunt of Gilded Hand Finance drop in and out without a word. Marv brings you first refusal on Odile's old enamel sign before Bryony gets it (§{rivalSignSale}). You compete for best stall at the Harvest Fair (§{rivalFair}) and for the best window before the leaf-peeper buses (§{rivalWindows}), where you can play it straight or knock over her candle pyramid. Afterwards, over coffee, she admits the Hand lent her the money and the payments go up every month.",
    "In the last week she asks what you want to do (§{rivalReckoning}). Wait her out and she has a closing-down sale (Last One Standing). Bring her and her stock into your shop (Under One Roof). Or agree that she buys your overflow at guide price (Across the Street). The last two lead on to the chapter Winter Hours."
  ],
  "cast": {
    "bryony": {
      "name": "Bryony Kettle",
      "look": { "skin": "#f0d0b8", "hair": "#b8642a", "hs": 4, "coat": "#5a7a6a", "style": "jacket", "apron": "#c8b8a0", "pants": "#2e2e36", "glasses": "#2a2a2e", "bag": "#8a5a3a" }
    }
  },
  "icons": {
    "enamelsign": [
      "............",
      "kkkkkkkkkkkk",
      "knbbbbbbbbnk",
      "kbcbcbcbcbbk",
      "kbbbbbbbbbbk",
      "kbyyyyyyyybk",
      "kbbbbbbbbbbk",
      "kbcccbbcccbk",
      "knbbbbbbbbnk",
      "kkkkkkkkkkkk",
      "..k......k..",
      "............"
    ],
    "trapTable": [
      "............",
      "............",
      "BBBBBBBBBBBB",
      "kkkkkkkkkkkk",
      "kPkPkPkPkPkk",
      "kkkkkkkkkkkk",
      "kPkPkPkPkPkk",
      "kkkkkkkkkkkk",
      "kPkPkPkPkPkk",
      "kkkkkkkkkkkk",
      ".kk......kk.",
      "............"
    ],
    "portlamp": [
      ".....kk.....",
      "....kYYk....",
      "...kYAAYk...",
      "...kYAAYk...",
      "....kYYk....",
      "..kkkkkkkk..",
      ".kyyyyyyyyk.",
      "kyokkkkkkoyk",
      "kyokBBBBkoyk",
      "kyokkkkkkoyk",
      ".kyyyyyyyyk.",
      "..kkkkkkkk.."
    ],
    "framemirror": [
      "kkkkkkkkkkkk",
      "kWWWWkWWWWWk",
      "kWBBBkWBBBWk",
      "kWBSBkWBSBWk",
      "kWBBBkWBBBWk",
      "kkkkkkkkkkkk",
      "kWBBBkWBBBWk",
      "kWBSBkWBBBWk",
      "kWBBBkWBSBWk",
      "kWWWWkWWWWWk",
      "kkkkkkkkkkkk",
      "............"
    ]
  },
  "uniques": {
    "rivalSign": {
      "name": "Odile's old enamel sign",
      "icon": "enamelsign",
      "cat": "curio",
      "guide": 60,
      "condLabel": "Rusty",
      "tells": [
        "Blue enamel on steel: ODILE'S - LOANS - BOUGHT & SOLD. Rust at every screw hole.",
        "On the back, in marker: \"Taken down 1989. Too big for the new window. O.\""
      ]
    },
    "recTable": {
      "name": "Lobster-trap coffee table",
      "icon": "trapTable",
      "cat": "art",
      "guide": 120,
      "condLabel": "Fine",
      "tells": ["A real wire trap with a glass top. The bait bag is still in it, empty, for character."]
    },
    "recLamp": {
      "name": "Porthole lamp",
      "icon": "portlamp",
      "cat": "curio",
      "guide": 70,
      "condLabel": "Fine",
      "tells": [
        "A brass ship's porthole with an Edison bulb in it. The porthole is real. The ship was a ferry."
      ]
    },
    "recMirror": {
      "name": "Mirror in an old window frame",
      "icon": "framemirror",
      "cat": "art",
      "guide": 60,
      "condLabel": "Worn",
      "tells": [
        "Six panes of mirror in a sash window from a farmhouse in Truro. The paint is the original paint."
      ]
    }
  },
  "overheard": [
    { "line": "Sniffing: \"There's a candle shop going in across from the pawnshop. Thirty dollars a candle. It smells like a library.\"" }
  ],
  "scenes": {
    "rivalHello": {
      "title": "Bryony Kettle comes over to say hello",
      "customer": "bryony",
      "steps": [
        {
          "say": "bryony",
          "text": [
            "Hi! Bryony Kettle. Reclaimed and Company? Across the street? The old shoe repair. You'll have seen the brick.",
            "I'm opening this week. Curated pieces, candles, finds. Things with a story."
          ]
        },
        { "set": { "rivalIn": true, "rivalScore": 0, "rivalBids": {} } },
        { "find": "cheap", "in": "forSale", "match": { "uniqueId": false }, "cheapest": true },
        {
          "if": "cheap",
          "then": [
            { "hook": "price", "with": { "of": "cheap", "times": 1.2 }, "sets": ["price"] },
            { "say": "bryony", "text": "Oh, that {cheap.name|lower}. For my window. Would you take {price|money}?" },
            {
              "choose": [
                {
                  "label": "Sell it to her ({price|money})",
                  "then": [
                    { "sell": "cheap", "to": "rival" },
                    { "hook": "earn", "with": "Sold a {cheap.name|lower} to Bryony Kettle" },
                    { "hook": "firstSold" },
                    { "say": "bryony", "text": "Perfect. It has such a story." }
                  ]
                },
                {
                  "label": "Not for sale",
                  "then": [{ "say": "bryony", "text": "Of course. You're attached. I get it." }]
                }
              ]
            }
          ]
        },
        {
          "say": "bryony",
          "text": [
            "Can I be honest? I'm going to be bidding against you. On everything good that comes through this town. It's nothing personal. It's retail.",
            "Come to the opening! There's wine. There's a candle called Sea Fog that smells exactly like Sea Fog."
          ]
        },
        {
          "choose": [
            {
              "label": "\"Welcome to the street.\"",
              "then": [
                { "set": { "rivalTone": "warm" } },
                { "say": "bryony", "text": "Thank you! Honestly. Not everybody's said that." }
              ]
            },
            {
              "label": "\"Good luck. You'll need it.\"",
              "then": [
                { "set": { "rivalTone": "cold" } },
                { "say": "bryony", "text": "Ha. Okay. Game on, then." }
              ]
            },
            {
              "label": "(Say nothing)",
              "then": [
                { "set": { "rivalTone": "cold" } },
                { "say": "bryony", "text": "Right. Well. The door's the one with the brass bell. Everything's the one with the brass bell." }
              ]
            }
          ]
        },
        { "toast": "Calendar: the Reclaimed & Co. opening, {placed:rival-party} night", "look": "bryony" },
        { "leave": "bryony" }
      ]
    },
    "rivalParty": {
      "title": "The Reclaimed & Co. opening",
      "steps": [
        { "hook": "dress" },
        {
          "stage": "reclaimed",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [90, 168] },
            { "id": "bryony", "cast": "bryony", "at": [196, 162], "facingLeft": true },
            { "id": "marv", "cast": "marv", "at": [150, 170], "facingLeft": true },
            { "id": "guest", "look": "random", "at": [[36, 160], [120, 166]] },
            { "id": "guestR", "look": "random", "at": [[236, 160], [262, 166]], "facingLeft": true }
          ]
        },
        { "narrate": "Reclaimed & Co., opening night. Brick, bulbs on long wires, forty candles and a coffee table made out of a lobster trap. The tag on the table says $340." },
        { "narrate": "On a crate by the door is the {flag.rivalFirst|lower} she bought off you, at three times what she paid. Its card says \"Reclaimed from a Hollow Neck estate.\"", "if": "flag.rivalFirst" },
        {
          "say": "marv",
          "text": [
            "Marv Kettle. Bryony's my niece. I clear houses. You know where the brick came from? A mill in Fall River. You know where half of this came from? Me.",
            "I used to sell the good stuff to your aunt. Odile always paid fair. Family's family, though."
          ]
        },
        { "say": "bryony", "text": "You came! Have a candle. That one's Grandfather's Study. It smells like a man who owns a pipe and doesn't smoke it." },
        {
          "choose": [
            {
              "label": "Work the room and hand out your card",
              "then": [
                { "rep": 2 },
                { "hook": "score", "with": -1 },
                { "narrate": "By nine o'clock half the room knows where to bring their grandmother's rings. Bryony notices. She keeps smiling. Her smile goes down a size." }
              ]
            },
            {
              "label": "\"How do you afford Main Street?\"",
              "then": [
                { "set": { "rivalAsked": true } },
                { "say": "bryony", "text": "Oh, you know. Savings. A small business loan. Very small. Very business." },
                { "narrate": "She laughs and changes the subject to candles. She changes it quite fast." }
              ]
            },
            {
              "label": "Buy a candle and go home",
              "then": [
                { "hook": "spend", "with": { "n": 30, "why": "A candle from Reclaimed & Co." } },
                { "say": "bryony", "text": "Sea Fog. Good choice. Burn it for twenty minutes at a time or it tunnels." }
              ]
            }
          ]
        },
        { "enter": { "id": "merrit", "cast": "merrit", "at": [300, 160], "facingLeft": true } },
        { "walk": "merrit", "to": [270, 160] },
        { "narrate": "The brass bell over the door rings. Merrit Gaunt of Gilded Hand Finance comes in, takes a glass of wine, looks once around the room, and leaves without a word." },
        { "remove": "merrit" },
        { "narrate": "Bryony doesn't take her eyes off the door until he's gone. Then she laughs at something nobody said." },
        { "set": { "rivalPartyDone": true } }
      ]
    },
    "rivalSignSale": {
      "title": "Marv Kettle has Odile's old sign: beat Bryony's offer",
      "customer": "marv",
      "steps": [
        {
          "say": "marv",
          "text": [
            "Marv Kettle, house clearances. We met at my niece's party. Or we didn't, and I'm telling you now.",
            "Cleared a barn on Route 6 yesterday. Look what was behind the hay."
          ]
        },
        { "view": { "counterIcon": "enamelsign" } },
        { "narrate": "Blue enamel on steel, four feet long, rusted at every screw hole: ODILE'S - LOANS - BOUGHT & SOLD." },
        { "say": "marv", "text": "Bryony offered me seventy for it. For her wall. \"Authentic patina.\" But it's Odile's, so you get first look. Beat seventy and it's yours." },
        { "view": { "counterIcon": null } },
        {
          "offer": { "unique": "rivalSign" },
          "persona": "honest",
          "asking": 85,
          "min": 75,
          "onWatch": "continue"
        },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "rivalSign": "yours" } },
            { "hook": "score", "with": -1 },
            { "say": "marv", "text": "Good. It'd look wrong over there. I'll tell her it went to family." }
          ],
          "else": [
            { "set": { "rivalSign": "hers" } },
            { "hook": "score", "with": 1 },
            { "say": "marv", "text": "Suit yourself. She'll hang it over the register. Odile would have laughed. Then she'd have bought it.", "if": "offer != 'watch'" }
          ]
        },
        { "leave": "marv", "if": "offer != 'watch'" }
      ]
    },
    "rivalFair": {
      "title": "Best stall at the Harvest Fair: you against Reclaimed & Co.",
      "steps": [
        { "enter": { "id": "bryony", "cast": "bryony", "at": [214, 156], "facingLeft": true } },
        { "enter": { "id": "marguerite", "cast": "marguerite", "at": [182, 152] } },
        { "say": "marguerite", "text": "Marguerite Oyelaran, chair of the fair committee, God help me. Best stall. Two entries this year. One table each. Please don't make me choose between my neighbors in front of everybody. I will, though." },
        { "say": "bryony", "text": "May the best curation win." },
        {
          "hook": "pickThree",
          "with": "You have a trestle table and an hour. What goes on it? (It all comes back to the shop afterwards.)",
          "sets": ["mine"]
        },
        {
          "hook": "judge",
          "sets": ["won"],
          "note": "what yours are worth, a bonus for each unique and for three not alike, against her score and a little luck"
        },
        {
          "narrate": { "if": "mine.count", "then": "Your table: {hook:mineList}. Hers: a pyramid of candles, dried hydrangeas in a galvanised tub, and a bicycle nobody could ride.", "else": "Your table: a tablecloth. Hers: a pyramid of candles, dried hydrangeas and a bicycle nobody could ride." }
        },
        {
          "if": "won",
          "then": [
            { "set": { "rivalFair": "yours" } },
            { "hook": "score", "with": -1 },
            { "rep": 3, "why": "Best stall at the Harvest Fair" },
            { "say": "marguerite", "text": "The rosette goes to the pawnshop. It's got things in it people actually want. Sorry, Bryony. The bicycle was very brave." },
            { "say": "bryony", "text": "Congratulations. Genuinely. I'm going to go and stand behind the pie table for a minute." }
          ],
          "else": [
            { "set": { "rivalFair": "hers" } },
            { "hook": "score", "with": 1 },
            { "say": "marguerite", "text": "The rosette goes to Reclaimed & Co. It's so... arranged. Sorry. Next year." },
            { "say": "bryony", "text": "Thank you! Thank you, Hollow Neck!" }
          ]
        },
        { "narrate": "Her phone buzzes. She reads it, and for a second she isn't smiling at anybody. Then she pins the rosette on, or claps for yours, and she is again." },
        { "remove": "bryony" },
        { "remove": "marguerite" }
      ]
    },
    "rivalWindows": {
      "title": "The window war, after midnight",
      "music": "tension",
      "steps": [
        { "hook": "dress" },
        {
          "stage": "reclaimedNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [236, 168] },
            { "id": "bryony", "cast": "bryony", "at": [120, 162] }
          ]
        },
        { "narrate": "Midnight on Main Street. The leaf-peeper buses come Saturday, and both shops are dressing their windows overnight. Through her glass you can see your own lights still on." },
        { "say": "bryony", "text": "Oh good, you're up too. I'll show you mine if you show me yours. In the morning. Like civilised people." },
        {
          "hook": "pickThree",
          "with": "Back across the street. Three things in your window, under the PAWN sign. What goes in?",
          "sets": ["mine"]
        },
        {
          "choose": [
            { "label": "While she's in the back, knock over her candle pyramid", "hint": "(+5 heat, and she'll know)" },
            { "label": "Play it straight" }
          ],
          "as": "dirty"
        },
        { "hook": "judge", "sets": ["won"] },
        {
          "if": "dirty == 0",
          "then": [
            { "set": { "rivalWindow": "sabotaged" } },
            { "heat": 5, "why": "Knocked over Bryony's window display" },
            { "hook": "score", "with": -1 },
            { "narrate": "Forty candles go over like dominoes. Wax on the hydrangeas. Wax on the bicycle. She comes out of the back room and looks at the window, and then across the street at you." },
            { "say": "bryony", "text": "Wow. Okay. Wow." }
          ],
          "else": [
            {
              "if": "won",
              "then": [
                { "set": { "rivalWindow": "yours" } },
                { "hook": "score", "with": -1 },
                { "rep": 2, "why": "The best window on Main Street" },
                { "narrate": "At two in the morning you stand in the street and look at both windows. Yours looks like a treasure chest. Hers looks like a magazine. The buses will stop at yours." }
              ],
              "else": [
                { "set": { "rivalWindow": "hers" } },
                { "hook": "score", "with": 1 },
                { "narrate": "At two in the morning you stand in the street and look at both windows. Hers glows. Yours looks like a pawnshop. The buses will stop at hers." }
              ]
            }
          ]
        },
        { "narrate": "Back inside Reclaimed & Co., she's made two coffees. On the counter, under her elbow, is a letter on heavy paper. At the top is a little gold open hand." },
        { "set": { "rivalKnows": true } },
        {
          "say": "bryony",
          "text": [
            "You've seen it. Of course you have. You get them too.",
            "Gilded Hand Finance. They lent me the money for the shop when the bank laughed. Forty thousand. The payments go up every month. In three months I lose the lot. The brick, the bulbs, the candle that smells like Sea Fog."
          ]
        },
        {
          "choose": [
            {
              "label": "\"Same lender. Small town.\"",
              "then": [
                { "set": { "rivalTone": "warm" } },
                { "say": "bryony", "text": "Same lender. Ha. Same Merrit. Does he do the thing where he says your name like it's a price?" }
              ]
            },
            {
              "label": "\"Then why bid against me?\"",
              "then": [
                { "say": "bryony", "text": "Because you were here first, and I can't afford to be second. It's not personal. It never was." }
              ]
            },
            {
              "label": "Drink the coffee and say nothing",
              "then": [
                { "narrate": "It's good coffee. Neither of you says anything for a while. Across the street your PAWN sign buzzes and stutters." }
              ]
            }
          ]
        }
      ]
    },
    "rivalReckoning": {
      "title": "The reckoning: Bryony asks",
      "customer": "bryony",
      "steps": [
        {
          "if": "!flag.rivalKnows",
          "then": [
            {
              "say": "bryony",
              "text": [
                "I need to tell you something, and I need you not to make a face. I borrowed the money for the shop from Gilded Hand Finance.",
                "Three months, and they take it all. You know how they are. You owe them too."
              ]
            },
            { "set": { "rivalKnows": true } }
          ],
          "else": [
            {
              "say": "bryony",
              "text": { "if": "flag.rivalScore >= 3", "then": "I'm winning. Did you notice? Best window, best stall, your best things in my shop. And it doesn't matter. They want it all back by January.", "else": "I'm losing. You've probably noticed. Everyone on the street has noticed. Merrit has definitely noticed." }
            }
          ]
        },
        { "say": "bryony", "text": "So. I'm here to ask. You can wait me out. I'll be gone by Christmas. Or we can try something else." },
        {
          "choose": [
            {
              "label": "Let her go under",
              "hint": "(her closing-down sale is Wednesday)",
              "then": [
                { "set": { "rivalEnd": "crushed" } },
                { "hook": "saleDay" },
                { "rep": -2 },
                { "say": "bryony", "text": "Okay. That's fair. That's... retail. Closing-down sale Wednesday. Come early, the good stuff goes." }
              ]
            },
            {
              "label": "Merge: bring her and her stock into your shop",
              "hint": "(three of her pieces, and she pays $40 of your last installment)",
              "then": [
                { "set": { "rivalEnd": "merged" } },
                {
                  "hook": "merge",
                  "sets": ["n"],
                  "note": "as many of her three pieces as fit on your shelves"
                },
                { "rep": 3, "why": "Merged with Reclaimed & Co." },
                { "refresh": "panel" },
                {
                  "say": "bryony",
                  "text": [
                    {
                      "if": "n < 3 && flag.rivalSign == 'hers'",
                      "then": "Really? Really. I'll bring the table over tonight, and whatever fits. And Odile's sign. And I'm paying forty toward your Friday. Don't argue. It's my savings, not theirs.",
                      "else": {
                        "if": "n < 3",
                        "then": "Really? Really. I'll bring the table over tonight, and whatever fits. And what's left of the candles. And I'm paying forty toward your Friday. Don't argue. It's my savings, not theirs.",
                        "else": { "if": "flag.rivalSign == 'hers'", "then": "Really? Really. I'll bring the table over tonight. And Odile's sign. And I'm paying forty toward your Friday. Don't argue. It's my savings, not theirs.", "else": "Really? Really. I'll bring the table over tonight. And what's left of the candles. And I'm paying forty toward your Friday. Don't argue. It's my savings, not theirs." }
                      }
                    },
                    "We'll need a new sign. Something with an ampersand."
                  ]
                }
              ]
            },
            {
              "label": "Send her your overflow: anything you can't shelve",
              "hint": "(she buys up to three things now, at guide)",
              "then": [
                { "set": { "rivalEnd": "overflow", "rivalPact": true } },
                { "say": "bryony", "text": "Your overflow? Everything you can't fit, you send across the street, I buy it at guide and make it pretty. You still have the counter, I still have the brick." },
                { "hook": "overflow", "note": "up to three things off your shelves, each at guide" },
                { "rep": 3, "why": "Struck a deal with Reclaimed & Co." },
                { "say": "bryony", "text": "Both of us, then. Across the street from each other. Like two people in a very small town." }
              ]
            }
          ]
        },
        { "leave": "bryony" }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "bryony", "scene": "rivalHello" },
    { "at": "2-1", "cast": "marv", "scene": "rivalSignSale", "if": "flag.rivalIn && !flag.rivalEnd" },
    { "at": "4-1", "cast": "bryony", "scene": "rivalReckoning", "if": "flag.rivalIn && !flag.rivalEnd" }
  ],
  "vignettes": [
    { "hub": "fair", "label": "Best stall: you against Reclaimed & Co.", "scene": "rivalFair", "if": "flag.rivalIn && !flag.rivalEnd && !flag.rivalFair" }
  ],
  "nights": [
    {
      "id": "rival-party",
      "window": ["1-3", "2-1"],
      "if": "flag.rivalIn",
      "scene": "rivalParty",
      "test": [
        { "set": { "rivalIn": true, "rivalScore": 0, "rivalFirst": "Brass compass", "rivalSign": "hers" } },
        { "hook": "testCoin", "with": 100 }
      ]
    },
    {
      "id": "rival-window",
      "window": ["3-1", "3-4"],
      "if": "flag.rivalIn && !flag.rivalEnd",
      "scene": "rivalWindows",
      "test": [
        { "set": { "rivalIn": true, "rivalScore": 1 } },
        { "add": { "item": "painting" } },
        { "add": { "item": "ring" } },
        { "add": { "item": "lute" } },
        { "add": { "unique": "rivalSign" } }
      ]
    }
  ],
  "calendar": [
    { "id": "rival-party", "night": "rival-party", "story": "rival", "where": "Reclaimed & Co.", "title": "Bryony's opening", "known": "flag.rivalIn", "scene": "rivalParty" },
    { "id": "rival-fair", "night": "hub-fair", "story": "rival", "where": "Harbor Green", "title": "Best stall at the fair", "known": "flag.rivalIn", "scene": null, "order": 3 },
    { "id": "rival-window", "night": "rival-window", "story": "rival", "where": "Main Street", "title": "The window war", "known": "flag.rivalPartyDone", "scene": "rivalWindows" }
  ],
  "mornings": [
    {
      "if": "flag.rivalIn && !flag.rivalEnd && !flag.rivalPact && hook.today >= 4",
      "note": "from the fourth day, while she's open and you haven't a pact",
      "then": [
        {
          "hook": "snipe",
          "sets": ["lost"],
          "note": "a customer who said they'd be back finds it across the street first (more likely the better she's doing)"
        },
        { "toast": "{lost.name} found a {lost.thing|lower} at Reclaimed & Co. and won't be back for yours.", "look": "lost", "if": "lost" },
        {
          "hook": "bid",
          "sets": ["it", "price"],
          "note": "a unique from another story on your shelves: half again its guide, every other morning at most"
        },
        {
          "if": "it",
          "then": [
            { "hook": "comesIn", "sets": ["bryony"] },
            { "view": { "counterIcon": "{it.icon}" } },
            {
              "say": "bryony",
              "text": { "if": "it.uniqueId == 'rivalSign'", "then": "I'll be straight with you. I want Odile's sign. I'll give you {price|money}. That's more than it's worth and we both know it.", "else": "Morning! I saw the {it.name|lower} come in. Everybody did. I'll give you {price|money} for it, cash, right now." }
            },
            {
              "choose": [
                {
                  "label": "Sell it to her ({price|money})",
                  "then": [
                    { "view": { "counterIcon": null } },
                    { "sell": "it", "to": "rival" },
                    { "hook": "earn", "with": "Sold the {it.name|lower} to Bryony Kettle" },
                    { "hook": "bidded", "with": "sold" },
                    { "hook": "score", "with": 1 },
                    { "set": { "rivalSign": "hers" }, "if": "it.uniqueId == 'rivalSign'" },
                    { "say": "bryony", "text": "Thank you! It's going right in the window." }
                  ]
                },
                {
                  "label": "It stays here",
                  "then": [
                    { "view": { "counterIcon": null } },
                    { "hook": "bidded", "with": "kept" },
                    { "say": "bryony", "text": "Fair enough. Then I'll find something better." }
                  ]
                }
              ]
            },
            { "leave": "bryony" }
          ]
        }
      ]
    },
    {
      "if": "flag.rivalIn && !flag.rivalEnd && !flag.rivalFair && hook.fairPast",
      "note": "she wins best stall unopposed if you never went to hers",
      "then": [
        { "set": { "rivalFair": "hers" } },
        { "hook": "score", "with": 1 },
        { "toast": "Reclaimed & Co. won best stall at the Harvest Fair. Nobody else entered.", "look": "bryony" }
      ]
    },
    {
      "if": "flag.rivalEnd == 'crushed' && flag.rivalSaleDay == hook.today",
      "then": [
        { "set": { "rivalSaleDay": -1 } },
        { "narrate": "Across the street, a banner in Bryony's window: CLOSING DOWN SALE. Everything must go, including, by the look of her, Bryony." },
        { "hook": "closingSale", "note": "three of her pieces at 40% of guide" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Reclaimed & Co. is a phone repair shop now. Somebody bought the lobster-trap table. It wasn't Bryony.", "if": "flag.rivalEnd == 'crushed'" },
    { "line": "The sign over your door has an ampersand in it now. The shop smells faintly of Sea Fog, which smells faintly of Sea Fog.", "if": "flag.rivalEnd == 'merged'" },
    { "line": "Two shops on Main Street, facing each other. Bryony waves every morning. Sometimes you wave back with something she wants.", "if": "flag.rivalEnd == 'overflow'" },
    { "line": "Odile's old sign hangs in the back room, where only you can see it.", "if": "flag.rivalSign == 'yours' && hook.signKept" }
  ]
});
