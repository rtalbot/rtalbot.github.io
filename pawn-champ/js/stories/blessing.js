// Pawn Champ - The Blessing of the Fleet: the last two scallop families have hated each other since
// 1964, and their kids are getting married on the day of the Blessing. Major quest M18, batch H
// (docs/quests/MAJOR.md#m18-the-blessing-of-the-fleet).
//
// Hook (W1 Wed, shop)        Fátima Medeiros pawns the family's festa crown to pay the caterer.
// Middle (W1 Thu, shop)      Declan Halloran pawns the 1964 anniversary plate, and offers you $50
//                            to have the crown "not ready" for the Blessing.
// Middle (W2 Mon, shop)      Fátima offers $50 to sell the plate to a tourist. Ana invites you to
//                            the rehearsal dinner: you're the only one both families still talk to.
// Scene 1 (W2 Tue-Thu night) the rehearsal dinner at the Clam Shack: two tables, one story about 1964,
//                            and Avó Graça's biscuit tin of pieces. Agathe Moss can rivet china.
// Middle (W3 Mon/Tue, shop)  Each family comes to redeem. Hand it back, or keep your bargain.
// Scene 2 (W3 Tue-Thu night) the Blessing at Pier Nine, the fleet dressed overall: the crowning.
// Finale (W4 Mon-Thu night)  the wedding at the Grange Hall in a nor'easter, by candlelight.
// The ending is a tally of peace: what you sabotaged, what you owned up to, and whether the two
// plates are on the top table together.
// Uses the town cast: Father Ignatius blesses the boats, Dot caters, Agathe rivets the plate, Tess
// calls the weather.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/blessing.js,
// which also draws Pier Nine by day and dressed for the Blessing, and the Grange in a storm.
defineStory({
  "id": "blessing",
  "months": [1, 2, 6],
  "kind": "major",
  "colour": "#c84a6a",
  "family": "town",
  "title": "The Blessing of the Fleet",
  "crosses": ["benefit", "selectmen", "noreaster"],
  "rumour": "A Medeiros is marrying a Halloran. On the day of the Blessing. Somebody hide the cutlery.",
  "endings": { "wedding": "The Wedding", "halfway": "A Wedding, Then a Feud", "feud": "The Feud" },
  "about": [
    "A comic feud story. A Medeiros is marrying a Halloran on the day of the Blessing of the Fleet, and the two fishing families haven't spoken in sixty years. Fátima Medeiros pawns the family festa crown for the caterer (§{fatimaCrown}); Declan Halloran pawns his mother's painted plate for the band and offers you fifty to make sure the crown isn't ready in time (§{declanPlate}). Fátima then offers her own fifty for the plate to go missing, and invites you to the rehearsal dinner (§{fatimaBribe}).",
    "At the Clam Shack (§{blDinner}) the grandparents tell why: a joint anniversary party in 1964, two plates Peg Halloran painted for each other's families, a crooked wheelhouse, and one plate thrown on the deck. Avó Graça still has the pieces in a biscuit tin. Borrow it and Agathe Moss rivets it back together for $25.",
    "Each family comes to redeem (§{fatimaRedeem}, §{declanRedeem}), and each bribe you took lets you hold the other's heirloom back. At the Blessing on Pier Nine (§{blBlessing}) the bride is crowned, or not; you can own up and run for the crown. Tess warns of a nor'easter.",
    "The wedding at the Grange Hall in the storm (§{blWedding}) is the payoff. Putting both plates side by side on the top table is the best moment. Every kind act along the way adds to a peace tally, and every bribe takes from it: three or more is The Wedding, one or two is A Wedding, Then a Feud, none is The Feud."
  ],
  "notes": "blPeace is the tally (the peace hook adds to it): 3 or more is the wedding, 1 or 2 halfway, less a feud.",
  "cast": {
    "fatima": {
      "name": "Fátima Medeiros",
      "look": { "skin": "#c89870", "hair": "#2a1a14", "hs": 3, "coat": "#7a1e3a", "trim": "#e8c060", "style": "dress", "long": true, "pants": "#2a1a1a", "bag": "#2a1a1a" }
    },
    "declan": {
      "name": "Declan Halloran",
      "look": { "skin": "#f0c8a8", "hair": "#c8642a", "hs": 0, "coat": "#2a4a3a", "trim": "#e8e4dc", "style": "jacket", "hat": "cap", "hatc": "#2a3a2a", "pants": "#3a3a30", "beard": "#c8642a", "stout": true }
    },
    "anaMedeiros": {
      "name": "Ana Medeiros",
      "look": { "skin": "#c89870", "hair": "#2a1a14", "hs": 1, "coat": "#e8e4dc", "trim": "#7a1e3a", "style": "tee", "pants": "#2a3a5a" }
    },
    "kieran": {
      "name": "Kieran Halloran",
      "look": { "skin": "#f0c8a8", "hair": "#c8642a", "hs": 2, "coat": "#3a5a8a", "style": "hoodie", "pants": "#3a3a42" }
    },
    "graca": {
      "name": "Avó Graça",
      "look": { "skin": "#b88a64", "hair": "#e8e8e8", "hs": 1, "coat": "#1e1e22", "style": "dress", "long": true, "pants": "#1e1e22", "hat": "veil", "hatc": "#1e1e22" }
    },
    "fergus": {
      "name": "Fergus Halloran",
      "look": { "skin": "#f0c8a8", "hair": "#e8e8e8", "hs": 0, "coat": "#4a5a3a", "style": "vest", "vest": "#8a7a5a", "pants": "#3a3a30", "moustache": "#e8e8e8", "hat": "cap", "hatc": "#4a4a40" }
    }
  },
  "icons": {
    "plate": [
      "............",
      "...kkkkkk...",
      "..kcccccck..",
      ".kcbbbbbbck.",
      ".kcbcccbbck.",
      ".kcbcBBcbck.",
      ".kcbcBBcbck.",
      ".kcbbcccbck.",
      ".kcbbbbbbck.",
      "..kcccccck..",
      "...kkkkkk...",
      "............"
    ],
    "shards": [
      "............",
      "............",
      "..kkk..kkk..",
      ".kcbk.kbcck.",
      ".kcck..kck..",
      "..kk.kk.k...",
      "....kbck.kk.",
      ".kkk.kck.kck",
      "kccbk.k..kck",
      ".kkk.......k",
      "............",
      "............"
    ]
  },
  "uniques": {
    "festaCrown": {
      "name": "Medeiros festa crown",
      "icon": "crown",
      "cat": "jewelry",
      "guide": 420,
      "condLabel": "Polished every May",
      "questKey": true,
      "tells": [
        "A silver crown with a dove on top, the kind carried at the Holy Ghost festa. Hallmarked in Porto, 1911.",
        "Inside the band, scratched small: every Medeiros bride since 1912. Twenty-two names. A space after the last."
      ]
    },
    "hallPlate": {
      "name": "Halloran anniversary plate",
      "icon": "plate",
      "cat": "curio",
      "guide": 60,
      "condLabel": "Not a chip on it",
      "questKey": true,
      "tells": [
        "A hand-painted plate: a scalloper in blue, NOSSA SENHORA on her bow, and round the rim \"Zeca & Graça, 25 years, 1964\".",
        "Wait. It's the Medeiros boat. On the Halloran plate. Signed on the back: Peg H."
      ]
    },
    "gracaShards": {
      "name": "Biscuit tin of plate pieces",
      "icon": "shards",
      "cat": "curio",
      "guide": 0,
      "condLabel": "Kept since 1964",
      "questKey": true,
      "tells": [
        "Eleven pieces of a hand-painted plate in a Danish biscuit tin. A green boat, PEG H, and \"Fergus & Peg, 25 years\".",
        "Every piece is there. Somebody went down on the floor in 1964 and picked up every one."
      ]
    },
    "mendedPlate": {
      "name": "Riveted anniversary plate",
      "icon": "plate",
      "cat": "curio",
      "guide": 45,
      "condLabel": "Riveted by Agathe Moss",
      "questKey": true,
      "tells": [
        "Eleven pieces held with fourteen little brass staples, the old way. It would hold soup.",
        "The Halloran boat, PEG H, painted by Peg Halloran for the Medeiros family. Fergus & Peg, 25 years."
      ]
    }
  },
  "scenes": {
    "fatimaCrown": {
      "title": "Fátima Medeiros pawns the festa crown",
      "customer": "fatima",
      "steps": [
        {
          "say": "fatima",
          "text": [
            "Fátima Medeiros. My daughter is getting married on the day of the Blessing. To a Halloran. You don't know what that means. You will.",
            "The caterer wants half now. This is our festa crown. Every Medeiros bride is crowned on the pier at the Blessing. Lend me a hundred on it and I'll have it back the Monday before."
          ]
        },
        { "view": { "counterIcon": "crown" } },
        {
          "choose": [
            { "label": "Lend $100 on the crown", "hint": "(she redeems for $120)", "disabled": "coin < 100 || !shelf.free" },
            {
              "label": "\"I can't, Mrs. Medeiros.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "fatima", "text": "Then I'll sell the car. Ana can go to her wedding on the bus." },
                { "leave": "fatima" },
                { "end": true }
              ]
            }
          ]
        },
        { "view": { "counterIcon": null } },
        { "coin": -100, "why": "Lent on the Medeiros festa crown" },
        { "add": { "unique": "festaCrown" } },
        { "refresh": "panel" },
        { "set": { "blCrown": true } },
        { "say": "fatima", "text": "Polish it if you like. Don't let a Halloran touch it. They have damp hands." },
        { "leave": "fatima" }
      ]
    },
    "declanPlate": {
      "title": "Declan Halloran pawns his mother's plate, and offers a bribe",
      "customer": "declan",
      "steps": [
        {
          "say": "declan",
          "text": [
            "Declan Halloran. My boy's marrying Fátima Medeiros's girl, God help us all. The band wants a deposit.",
            "This was my mother's. Peg Halloran. She painted it in 1964. Forty on it, back the Tuesday before the Blessing."
          ]
        },
        { "view": { "counterIcon": "plate" } },
        {
          "choose": [
            {
              "label": "Lend $40 on the plate",
              "hint": "(he redeems for $50)",
              "disabled": "coin < 40 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "coin": -40, "why": "Lent on the Halloran plate" },
                { "add": { "unique": "hallPlate" } },
                { "refresh": "panel" },
                { "set": { "blPlate": true } }
              ]
            },
            { "label": "\"Not today, Mr. Halloran.\"", "then": [{ "view": { "counterIcon": null } }] }
          ]
        },
        {
          "if": "flag.blCrown",
          "then": [
            { "say": "declan", "text": "And while I'm here. I hear you've got the Medeiros crown. It would be a shame, a real shame, if it wasn't ready for the Blessing. Polishing takes time. Fifty dollars of time." },
            {
              "choose": [
                {
                  "label": "Take his fifty",
                  "hint": "(+$50)",
                  "then": [
                    { "coin": 50, "why": "Declan Halloran's fifty" },
                    { "set": { "blBribeH": true } },
                    { "say": "declan", "text": "Good man. Good woman. Good... shop." }
                  ]
                },
                {
                  "label": "\"It'll be ready.\"",
                  "then": [{ "say": "declan", "text": "Can't blame a man for asking. You can. People do." }]
                }
              ]
            }
          ]
        },
        { "leave": "declan" }
      ]
    },
    "fatimaBribe": {
      "title": "Fátima's counter-offer, and an invitation",
      "customer": "fatima",
      "steps": [
        {
          "if": "flag.blPlate",
          "then": [
            {
              "say": "fatima",
              "text": [
                "Declan Halloran pawned his mother's plate here. Don't look surprised, everyone on Pier Nine knows everything by six a.m.",
                "If a tourist happened to buy it before Tuesday. Fifty dollars says a tourist might."
              ]
            },
            {
              "choose": [
                {
                  "label": "Take her fifty",
                  "hint": "(+$50)",
                  "then": [
                    { "coin": 50, "why": "Fátima Medeiros's fifty" },
                    { "set": { "blBribeM": true } },
                    { "say": "fatima", "text": "I knew you had sense. Odile had sense." }
                  ]
                },
                {
                  "label": "\"It's his plate, Mrs. Medeiros.\"",
                  "then": [
                    { "say": "fatima", "text": "It's our boat on it. Did he tell you that? Our boat. On his plate." }
                  ]
                }
              ]
            }
          ]
        },
        { "say": "fatima", "text": "And Ana says you're to come to the rehearsal dinner, {placed:bl-dinner}, at the Clam Shack. She says you're the only person in town both families still speak to. She says you can sit in the middle. There is no middle." },
        {
          "choose": [
            {
              "label": "\"I'll be there.\"",
              "then": [
                { "set": { "blDinner": true } },
                { "toast": "Calendar: the rehearsal dinner at the Clam Shack", "look": "anaMedeiros" },
                { "say": "fatima", "text": "Bring an appetite. Bring a helmet." }
              ]
            },
            {
              "label": "\"Leave me out of it.\"",
              "then": [
                { "set": { "blOut": true, "blDinner": true } },
                { "say": "fatima", "text": "Everyone says that. Then they come to the Blessing anyway, for the shouting." }
              ]
            }
          ]
        },
        { "leave": "fatima" }
      ]
    },
    "blDinner": {
      "title": "The rehearsal dinner at the Clam Shack",
      "steps": [
        {
          "stage": "clamshackDusk",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [160, 166] },
            { "id": "fatima", "cast": "fatima", "at": [60, 164] },
            { "id": "graca", "cast": "graca", "at": [88, 166] },
            { "id": "declan", "cast": "declan", "at": [262, 164], "facingLeft": true },
            { "id": "fergus", "cast": "fergus", "at": [236, 166], "facingLeft": true }
          ]
        },
        { "narrate": "The Clam Shack deck, strung with lights. Two long tables with a gap between them you could moor a boat in. Ana and Kieran sit at the end of each, holding hands across the gap." },
        { "enter": { "id": "dot", "cast": "dot", "at": [196, 160] } },
        { "say": "dot", "text": "Fried clams, both tables. Same fryer. Same oil. If anybody wants to make something of that, they can make it in the car park." },
        {
          "say": "graca",
          "text": [
            "You. Come here. You want to know why? Nobody tells the young ones why. I'll tell you.",
            "1964. Zeca and me, twenty-five years. Fergus and Peg, twenty-five years, same week. One party, here, on this deck. Peg painted plates for us. Ours had their boat on it. Theirs had ours."
          ]
        },
        { "say": "fergus", "text": "And Zeca said Peg had painted his wheelhouse crooked." },
        { "say": "graca", "text": "It WAS crooked." },
        { "say": "fergus", "text": "And I threw your plate on the deck. And you picked up every piece. And we've not said good morning since." },
        { "narrate": "Nobody says anything. A gull lands on the rail, looks at everyone, and leaves." },
        { "say": "graca", "text": "I still have the pieces. In a biscuit tin. Sixty-one years. I don't know why." },
        {
          "choose": [
            {
              "label": "\"May I borrow the tin?\"",
              "hint": "(Agathe Moss rivets china, the old way: $25)",
              "then": [
                { "say": "graca", "text": "Borrow. Not keep. If you lose one piece I'll know." },
                {
                  "if": "shelf.free",
                  "then": [
                    { "add": { "unique": "gracaShards" } },
                    { "refresh": "panel" },
                    { "set": { "blShards": true } }
                  ]
                },
                { "hook": "peace", "with": 1 }
              ]
            },
            {
              "label": "Raise a toast to both boats",
              "then": [
                { "narrate": "\"To the Nossa Senhora and the Peg H.\" Half the deck lifts a glass. The other half lifts a glass a second later, so it won't look like they agreed." },
                { "hook": "peace", "with": 1 }
              ]
            },
            {
              "label": "Eat your clams and stay out of it",
              "then": [{ "narrate": "The clams are excellent. The silence is better seasoned." }]
            }
          ]
        },
        { "set": { "blDinnerDone": true } }
      ]
    },
    "fatimaRedeem": {
      "title": "Fátima comes for the crown",
      "customer": "fatima",
      "steps": [
        { "find": "crown", "in": "stock", "match": { "uniqueId": "festaCrown" } },
        { "say": "fatima", "text": "A hundred and twenty, as agreed. My crown, please. The Blessing is this week." },
        {
          "if": "!crown",
          "then": [
            { "say": "fatima", "text": "You... where is it? Never mind. Never mind! I'll crown her with a saucepan." },
            { "hook": "peace", "with": -2 },
            { "set": { "blNoCrown": true } },
            { "leave": "fatima" },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Hand back the crown",
              "hint": "(+$120)",
              "then": [
                { "take": "crown" },
                { "coin": 120, "why": "Fátima Medeiros redeemed the crown" },
                { "set": { "blCrownBack": true } },
                { "say": "fatima", "text": "Thank you. Look at it. Twenty-two names. Ana is twenty-three." }
              ]
            },
            {
              "label": "\"It's not ready yet. The polishing.\"",
              "hint": "(Declan's bargain)",
              "if": "flag.blBribeH",
              "then": [
                { "set": { "blCrownHeld": true } },
                { "hook": "peace", "with": -2 },
                { "say": "fatima", "text": "Not READY? It's silver! It's always ready! ...This is Declan. I can smell the diesel from here." }
              ]
            }
          ]
        },
        { "leave": "fatima" }
      ]
    },
    "declanRedeem": {
      "title": "Declan comes for the plate",
      "customer": "declan",
      "steps": [
        { "find": "plate", "in": "stock", "match": { "uniqueId": "hallPlate" } },
        { "say": "declan", "text": "Fifty, there you go. Mam's plate, please. It goes on the top table. I don't know why. It always has." },
        {
          "choose": [
            {
              "label": "Hand back the plate",
              "hint": "(+$50)",
              "disabled": "!plate",
              "then": [
                { "take": "plate" },
                { "coin": 50, "why": "Declan Halloran redeemed the plate" },
                { "set": { "blPlateBack": true } }
              ]
            },
            {
              "label": "\"Sold, I'm afraid. A tourist.\"",
              "hint": "(Fátima's bargain: you keep it)",
              "if": "flag.blBribeM && plate",
              "then": [
                { "hook": "peace", "with": -2 },
                { "set": { "blPlateLie": true } },
                { "edit": "plate", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "declan", "text": "Sold. To a TOURIST. ...She was in here, wasn't she. Fátima. I can smell the bacalhau." }
              ]
            },
            {
              "label": "\"It's gone, Mr. Halloran.\"",
              "if": "!plate",
              "then": [
                { "hook": "peace", "with": -2 },
                { "set": { "blPlateLie": false } },
                { "say": "declan", "text": "Sold. To a TOURIST. ...She was in here, wasn't she. Fátima. I can smell the bacalhau." }
              ]
            }
          ]
        },
        { "leave": "declan" }
      ]
    },
    "blBlessing": {
      "title": "The Blessing at Pier Nine",
      "steps": [
        {
          "stage": "docksFleet",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "ignatius", "cast": "ignatius", "at": [276, 158], "facingLeft": true },
            { "id": "ana", "cast": "anaMedeiros", "at": [196, 164] },
            { "id": "fatima", "cast": "fatima", "at": [160, 164] }
          ]
        },
        { "narrate": "Pier Nine at dusk, the whole fleet dressed overall: signal flags bow to masthead to stern, wreaths on every bow. Half the town is on the pier. The other half is on the boats." },
        { "say": "ignatius", "text": "Bless these boats, and those who work them, and those who wait for them. Especially those who wait." },
        {
          "if": "flag.blCrownBack",
          "then": [
            { "narrate": "Fátima lifts the silver crown and sets it on Ana's head. A dove, twenty-two names, and a little space. On the Peg H, Declan Halloran takes his cap off. He doesn't seem to know he's done it." },
            { "hook": "peace", "with": 1 }
          ],
          "else": [
            { "say": "fatima", "text": "No crown. The first Medeiros bride in a hundred years with no crown. Because of a HALLORAN." },
            { "find": "crown", "in": "stock", "match": { "uniqueId": "festaCrown" } },
            {
              "choose": [
                {
                  "label": "Own up: the crown is in your shop, and why",
                  "hint": { "if": "crown", "then": "(fetch it in time)" },
                  "then": [
                    { "hook": "peace", "with": 2 },
                    { "narrate": "You tell them about the fifty dollars. Both fifties, if there were two. Fátima's face goes through several weathers." },
                    {
                      "if": "crown",
                      "then": [
                        { "take": "crown" },
                        { "coin": 120, "why": "Fátima Medeiros redeemed the crown, late" },
                        { "set": { "blCrownBack": true } },
                        { "narrate": "You run. You come back up the pier with the crown under your coat, and Ana is crowned ten minutes late, which the old women say is lucky." }
                      ]
                    },
                    { "say": "fatima", "text": "Declan Halloran paid you to... and I paid you to... We are the same. God help me. We are the SAME." }
                  ]
                },
                {
                  "label": "Say nothing",
                  "then": [
                    { "hook": "peace", "with": -1 },
                    { "narrate": "Ana is crowned with a ring of beach roses somebody pulls off the fence. It looks lovely. Nobody on the Medeiros side will ever say so." }
                  ]
                }
              ]
            }
          ]
        },
        { "enter": { "id": "tess", "cast": "tess", "at": [60, 164] } },
        { "say": "tess", "text": "Weather coming. A proper nor'easter, the day of the wedding. Tie everything down twice." },
        { "set": { "blBlessed": true } },
        { "toast": "Calendar: the wedding at the Grange Hall", "look": "ana" }
      ]
    },
    "blWedding": {
      "title": "The wedding at the Grange Hall, in a nor'easter",
      "steps": [
        {
          "stage": "grangeStorm",
          "view": { "timeOfDay": 0.95, "sign": "ANA & KIERAN" },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 166] },
            { "id": "ana", "cast": "anaMedeiros", "at": [300, 160] },
            { "id": "kieran", "cast": "kieran", "at": [326, 160], "facingLeft": true },
            { "id": "graca", "cast": "graca", "at": [80, 166] },
            { "id": "fergus", "cast": "fergus", "at": [470, 166], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "The Grange Hall in a nor'easter. The power went at six. There are candles on every table and rain coming sideways down the tall windows, and every forty seconds the lightning shows the harbor, and the boats pulling at their lines.",
            "The vows are done. The top table has a gap in the middle where the plate goes."
          ]
        },
        { "find": "plate", "in": "stock", "match": { "uniqueId": "hallPlate" } },
        { "find": "mended", "in": "stock", "match": { "uniqueId": "mendedPlate" } },
        {
          "choose": [
            {
              "label": "Put both plates on the top table, side by side",
              "if": "plate && mended",
              "then": [
                { "take": "plate" },
                { "take": "mended" },
                { "hook": "peace", "with": 3 },
                { "narrate": "Two plates. One with a green boat and one with a red one, each painted by Peg Halloran for the other family. One whole, one held together with fourteen brass staples." },
                { "say": "fergus", "text": "She painted their wheelhouse crooked. I always knew. I couldn't say it, so I threw a plate." },
                { "say": "graca", "text": "Sixty-one years, Fergus." },
                { "say": "fergus", "text": "Good morning, Graça." }
              ]
            },
            {
              "label": "Give Avó Graça her plate back, riveted",
              "if": "mended",
              "then": [
                { "take": "mended" },
                { "hook": "peace", "with": 2 },
                { "say": "graca", "text": "Every piece. Fourteen staples. Who did this? ...Of course. The clock woman. Patient." }
              ]
            },
            {
              "label": "Put the Halloran plate on the top table",
              "hint": { "if": "flag.blPlateLie", "then": "(the one you said was sold)" },
              "if": "plate && !mended",
              "then": [
                { "take": "plate" },
                { "hook": "peace", "with": 0, "if": "flag.blPlateLie" },
                { "hook": "peace", "with": 1, "if": "!flag.blPlateLie" },
                { "say": "fergus", "text": "That's Peg's plate. Declan said it was sold. To a tourist. Who here is the tourist?", "if": "flag.blPlateLie" }
              ]
            },
            { "label": "Leave the gap", "then": [{ "hook": "peace", "with": -1 }] }
          ]
        },
        { "hook": "peace", "with": -1, "if": "flag.blOut" },
        { "hook": "peace", "with": 1, "if": "flag.blBribeH && flag.blCrownBack", "note": "took the money and did nothing for it: honest, in its way" },
        {
          "if": "flag.blPeace >= 3",
          "then": [
            { "set": { "blEnd": "wedding" } },
            { "narrate": "Somebody finds a fiddle. Somebody else finds an accordion. The Medeiroses and the Hallorans dance in the candlelight, badly, together, while the storm takes the Grange's weathervane off and nobody notices till morning." },
            { "rep": 8, "why": "The Medeiros-Halloran wedding" }
          ],
          "else": [
            {
              "if": "flag.blPeace >= 1",
              "then": [
                { "set": { "blEnd": "halfway" } },
                { "narrate": "It goes beautifully until the speeches. Declan's speech mentions a crooked wheelhouse. Fátima's speech mentions damp hands. Ana and Kieran leave through the kitchen, into the storm, holding hands and laughing, and leave both families to it." },
                { "rep": 3 }
              ],
              "else": [
                { "set": { "blEnd": "feud" } },
                { "narrate": "The lights come back on at nine, and so does 1964. By ten the Hallorans are on one side of the hall, the Medeiroses on the other, and Father Ignatius is standing in the middle with his arms out like a man holding back the sea." },
                { "say": "kieran", "text": "We're married. You can't un-marry us by shouting." },
                { "say": "ana", "text": "They can try. They've had sixty years of practice." },
                { "rep": -3 }
              ]
            }
          ]
        },
        { "find": "held", "in": "stock", "match": { "uniqueId": "festaCrown" } },
        {
          "if": "held",
          "then": [
            { "edit": "held", "set": { "questKey": false, "nosale": false } },
            { "refresh": "panel" },
            { "toast": "Nobody ever came back for the festa crown. It's yours to sell now. Twenty-two names.", "icon": "crown" }
          ]
        },
        { "view": { "sign": null } },
        { "set": { "blDone": true } }
      ]
    }
  },
  "beats": [
    { "at": "1-3", "cast": "fatima", "scene": "fatimaCrown" },
    { "at": "1-4", "cast": "declan", "scene": "declanPlate" },
    { "at": "2-1", "cast": "fatima", "scene": "fatimaBribe", "if": "flag.blCrown || flag.blPlate" },
    { "at": "3-1", "cast": "fatima", "scene": "fatimaRedeem", "if": "flag.blCrown" },
    { "at": "3-2", "cast": "declan", "scene": "declanRedeem", "if": "flag.blPlate" }
  ],
  "nights": [
    {
      "id": "bl-dinner",
      "window": ["2-2", "2-4"],
      "if": "flag.blDinner && !flag.blOut",
      "scene": "blDinner",
      "test": [{ "set": { "blDinner": true } }]
    },
    {
      "id": "bl-blessing",
      "window": ["3-2", "3-4"],
      "if": "flag.blDinner",
      "scene": "blBlessing",
      "test": [{ "set": { "blDinner": true, "blCrown": true } }, { "add": { "unique": "festaCrown" } }]
    },
    {
      "id": "bl-wedding",
      "window": ["4-1", "4-4"],
      "if": "flag.blBlessed",
      "scene": "blWedding",
      "test": [
        { "set": { "blBlessed": true } },
        { "add": { "unique": "hallPlate" } },
        { "add": { "unique": "mendedPlate" } }
      ]
    }
  ],
  "calendar": [
    { "id": "bl-dinner", "night": "bl-dinner", "story": "blessing", "where": "The Clam Shack", "title": "The rehearsal dinner", "known": "flag.blDinner && !flag.blOut", "scene": "blDinner" },
    { "id": "bl-blessing", "night": "bl-blessing", "story": "blessing", "where": "Pier Nine", "title": "The Blessing of the Fleet", "known": "flag.blDinner", "scene": "blBlessing" },
    { "id": "bl-wedding", "night": "bl-wedding", "story": "blessing", "where": "The Grange Hall", "title": "Ana and Kieran's wedding", "known": "flag.blBlessed", "scene": "blWedding" }
  ],
  "mornings": [
    { "find": "shards", "in": "stock", "match": { "uniqueId": "gracaShards" } },
    {
      "if": "shards && !flag.blMended",
      "note": "Agathe rivets the plate overnight, if you can pay her",
      "then": [
        {
          "if": "coin < 25",
          "then": [
            { "toast": "Agathe Moss can rivet the plate for $25, when you have it.", "look": "agathe", "icon": "shards" }
          ],
          "else": [
            { "coin": -25, "why": "Agathe Moss riveted the 1964 plate" },
            { "take": "shards" },
            { "add": { "unique": "mendedPlate" } },
            { "set": { "blMended": true } },
            { "toast": "Agathe Moss sends the plate back: fourteen brass rivets, every piece. \"Like a clock,\" her note says. \"It only needed someone patient.\"", "look": "agathe", "icon": "plate" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "Fergus Halloran and Graça Medeiros say good morning on Pier Nine now. It takes them both about a minute. Nobody hurries them.", "if": "flag.blEnd == 'wedding'" },
    { "line": "Ana and Kieran live on Gannet Island, which is neutral water. Both mothers visit, on alternate ferries.", "if": "flag.blEnd == 'halfway'" },
    { "line": "The Medeiros-Halloran feud is in its sixty-second year. Ana and Kieran have started one of their own, about whose turn it is to visit whose mother.", "if": "flag.blEnd == 'feud'" }
  ],
  "talk": {
    "by": "ignatius",
    "rumour": [
      "I'm to bless the fleet this year and marry a Medeiros to a Halloran on the same day. I have been praying about it. Mostly about the seating."
    ],
    "react": { "wedding": "The Medeiroses and the Hallorans danced together in the Grange, in the dark. I have seen miracles. That was a good one.", "halfway": "It was a beautiful wedding until the speeches. The young ones left through the kitchen. I gave them my blessing on the way past the bins.", "feud": "I stood between two families with my arms out for an hour. My arms still ache. My faith, less so. Mostly." },
    "sway": {
      "wedding": { "ignatius": 3, "tess": 1 },
      "halfway": { "ignatius": 1 },
      "feud": { "ignatius": -1 }
    }
  },
  "outcome": "flag.blEnd"
});
