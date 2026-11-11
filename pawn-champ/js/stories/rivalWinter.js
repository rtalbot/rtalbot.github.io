// Pawn Champ - Winter Hours: the first chapter of The Rival Shop's long arc (round 3, batch T).
// Docs: docs/quests/MAJOR.md#m16-the-long-arc and docs/SEASONS.md#long-arcs-five. Stay-on only: these
// chapters are never drawn in October.
//
// "She was three months from losing everything." Last One Standing closes the story: she's gone by
// November. Under One Roof (she's behind your counter) and Across the Street (she's still in the brick)
// lead on, and the Gilded Hand's note on Reclaimed & Co. comes due on Christmas Eve.
//   winter  Winter Hours (November or December): her winter payment. She pawns her grandmother's ring
//           with you; Marv clears a sea captain's house on Cove Road, and one chest in the lot could
//           make the payment; at the end of the month Merrit Gaunt comes to collect it.
//   eve     Christmas Eve (js/stories/rivalEve.js).
// The December window contest is m78 The Window Display (js/stories/windowdisplay.js), which already
// reads M16's flags; if Bryony dressed your winning window, it counts in Christmas Eve. The chapters
// share a code half: js/quests/rivalarc.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "rivalWinter",
  "kind": "major",
  "colour": "#b8643a",
  "family": "town",
  "title": "Winter Hours",
  "arc": "rival",
  "after": ["merged", "overflow"],
  "months": [2, 3],
  "teaser": { "if": "flag.rivalEnd == 'merged'", "then": "Bryony is already in when you come down, putting your shelves in order by color. \"Don't look at me like that. It's the first. The letters come on the first.\"", "else": "Across the street, Reclaimed & Co. has a new card in the window: WINTER HOURS. Somebody has added underneath, in pen, \"for now\"." },
  "rumour": "Reclaimed & Co. has a payment due at the end of the month, and Bryony Kettle has started selling the candles at cost.",
  "endings": { "covered": "On Your Account", "chest": "The Captain's Chest", "stripped": "Stripped Shelves" },
  "outcome": "flag.rwEnd",
  "code": "rivalarc",
  "about": [
    "The second chapter of the Bryony story, for runs where she joined your shop or became your across-the-street partner. The Hand has doubled her payments for the winter: $1,800 by the end of the month. She pawns her grandmother's sapphire ring with you, and swears she'll have it back by Christmas (§{rwRing}), or you can turn the ring down and look for another way.",
    "Marv is clearing a dead captain's house on Cove Road, $300 for the lot (§{rwMarv}). Going through it at Reclaimed & Co. after closing (§{rwLotNight}), Bryony finds an 1851 sea chest that a Boston dealer would pay over a thousand for. You can front her the money, go halves, buy the lot yourself, or leave it.",
    "Merrit Gaunt collects the payment in your shop (§{rwMerrit}). If the chest paid it, it's The Captain's Chest. If she's short, you cover it from your till (On Your Account) or watch his men carry off her best stock (Stripped Shelves). Merrit says he'll see her on Christmas Eve, which is the next chapter."
  ],
  "notes": "flag.rivalEnd == 'merged' means Bryony is behind your counter (Under One Roof); otherwise she's still across the street (Across the Street).",
  "uniques": {
    "kettleRing": {
      "name": "Nana Kettle's sapphire",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 240,
      "questKey": true,
      "tells": [
        "A small sapphire in an old platinum claw, worn thin on one side from eighty years of one hand.",
        "Engraved inside: \"A.K. from W.K. 1947\". Bryony says her grandmother never took it off, and then she did."
      ]
    },
    "captainChest": {
      "name": "A captain's sea chest",
      "icon": "seachest",
      "cat": "art",
      "guide": 560,
      "condLabel": "Original paint",
      "tells": [
        "Pine, painted blue-green, with rope beckets on both ends and a ship painted inside the lid.",
        { "text": "Inside the lid, under the ship: \"Capt. J. Sefton, Bark Amity, 1851\". A dealer in Boston would weep.", "cls": "good" }
      ]
    }
  },
  "scenes": {
    "rwRing": {
      "title": "Bryony pawns her grandmother's ring for the winter payment",
      "customer": "bryony",
      "steps": [
        {
          "say": "bryony",
          "text": { "if": "flag.rivalEnd == 'merged'", "then": "Can I talk to you as the other half of the ampersand? The Hand's letter came. The payments double for the winter. Eighteen hundred by the end of the month, or they call the whole note.", "else": "Morning, neighbor. The Hand's letter came. Winter payments. Eighteen hundred by the end of the month, or they call the whole note, and the brick goes back to the mill it came from." }
        },
        { "say": "bryony", "text": "I've got most of it. Not all. So I'm doing the thing people do in your shop." },
        { "view": { "counterIcon": "ring" } },
        { "narrate": "She puts a little velvet box on the counter and doesn't open it for a second. Then she does: a small sapphire in an old platinum claw." },
        { "say": "bryony", "text": "My grandmother's. She wore it every day for sixty years, cleaning fish in Fall River. I want it back by Christmas. I will have it back by Christmas." },
        {
          "choose": [
            {
              "label": "Lend her $180 against it",
              "disabled": "coin < 180 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                {
                  "hook": "pawnRing",
                  "with": { "lent": 180, "why": "Lent Bryony $180 against her grandmother's ring" }
                },
                { "say": "bryony", "text": "Thank you. Put it somewhere I can't see it from the street." }
              ]
            },
            {
              "label": "Lend her $120",
              "hint": "(fair for the stone)",
              "disabled": "coin < 120 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                {
                  "hook": "pawnRing",
                  "with": { "lent": 120, "why": "Lent Bryony $120 against her grandmother's ring" }
                },
                { "say": "bryony", "text": "Thank you. Put it somewhere I can't see it from the street." }
              ]
            },
            {
              "label": "\"Keep the ring. Let's find the money another way.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "rwNoRing": true } },
                { "say": "bryony", "text": "Another way. Okay. Marv's clearing a house this month. Marv always says there's one good thing in every house." }
              ]
            }
          ]
        },
        { "set": { "rwIn": true } },
        { "leave": "bryony" }
      ]
    },
    "rwMarv": {
      "title": "Marv is clearing the Sefton house on Cove Road",
      "customer": "marv",
      "steps": [
        {
          "say": "marv",
          "text": [
            "Marv Kettle. The Sefton place on Cove Road, the old captain's house. The last Sefton died in October, and the nephews want it empty by the first.",
            "Whole house, three hundred dollars, as is. I'm bringing the van round to Bryony's back door tonight to go through it. She asked me to ask you. I'd have asked anyway."
          ]
        },
        { "set": { "rwLot": true } },
        { "toast": "Calendar: the Sefton lot, at Reclaimed & Co.", "look": "marv" },
        { "leave": "marv" }
      ]
    },
    "rwLotNight": {
      "title": "After closing at Reclaimed & Co.: the Sefton lot, and a sea chest",
      "steps": [
        { "hook": "music", "with": "night" },
        {
          "stage": "reclaimedNight",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 168] },
            { "id": "bryony", "cast": "bryony", "at": [120, 162] },
            { "id": "marv", "cast": "marv", "at": [170, 166], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "Reclaimed & Co., after closing. Marv's van is backed up to the back door with a whole house in it: chairs, quilts, a barometer, eleven boxes of National Geographic and a sewing machine nobody can lift.",
            "At the bottom of the van, under the quilts, is a pine sea chest painted blue-green, with rope handles. Bryony opens the lid and stops talking, which she never does."
          ]
        },
        { "view": { "counterIcon": "seachest" } },
        { "say": "bryony", "text": "Inside the lid. Look. \"Capt. J. Sefton, Bark Amity, 1851\", and a ship painted under it. There's a dealer in Boston who'd pay twelve hundred for this. That's the winter payment. That's the brick." },
        { "say": "marv", "text": "Three hundred for the lot. I'm not splitting the lot. I'm family, not a charity." },
        { "view": { "counterIcon": null } },
        {
          "choose": [
            {
              "label": "Front her the three hundred",
              "hint": "(she sells the chest to Boston)",
              "disabled": "coin < 300",
              "then": [
                { "set": { "rwChest": "hers" } },
                { "coin": -300, "why": "Fronted Bryony the Sefton lot" },
                { "sway": "marv", "by": 1, "why": "Bought the Sefton lot" },
                { "say": "bryony", "text": "I'll pay you back the day Boston pays me. I'll pay you back with a candle on top." }
              ]
            },
            {
              "label": "Go halves with her on the lot",
              "hint": "($150 each, and half of what Boston pays)",
              "disabled": "coin < 150",
              "then": [
                { "set": { "rwChest": "halves" } },
                { "coin": -150, "why": "Half the Sefton lot" },
                { "sway": "marv", "by": 1, "why": "Bought the Sefton lot" },
                { "say": "bryony", "text": "Partners in a dead captain's house. It's romantic, if you don't think about it." }
              ]
            },
            {
              "label": "Buy the lot yourself",
              "hint": "(the chest goes on your shelf)",
              "disabled": "coin < 300 || !shelf.free",
              "then": [
                { "set": { "rwChest": "yours" } },
                { "coin": -300, "why": "Bought the Sefton lot" },
                { "add": { "unique": "captainChest", "paid": 300 } },
                { "refresh": "panel" },
                { "say": "bryony", "text": "Oh. Okay. Okay. That's... retail." },
                { "narrate": "She helps you carry it across the street anyway, because it's heavy and it's snowing. She doesn't say anything the whole way." }
              ]
            },
            {
              "label": "Let her find it somewhere else",
              "then": [
                { "set": { "rwChest": "none" } },
                { "say": "marv", "text": "Then it goes to the auction in Sandwich, and some dentist from Wellesley gets a sea chest for his boat shoes." }
              ]
            }
          ]
        },
        {
          "if": "flag.rwChest == 'hers' || flag.rwChest == 'halves'",
          "then": [
            { "narrate": "The Boston dealer drives down on Saturday in a car that costs more than the building. He pays eleven hundred and fifty, and argues for an hour first." },
            { "coin": 300, "why": "Bryony paid back the Sefton lot", "if": "flag.rwChest == 'hers'" },
            { "coin": 575, "why": "Half of what Boston paid for the Sefton chest", "if": "flag.rwChest == 'halves'" }
          ]
        },
        { "set": { "rwLotDone": true } }
      ]
    },
    "rwMerrit": {
      "title": "Merrit Gaunt collects the winter payment, on neutral ground",
      "customer": "merrit",
      "steps": [
        { "enter": { "id": "bryony", "cast": "bryony", "at": [300, 152], "facingLeft": true } },
        { "walk": "bryony", "to": [266, 152] },
        { "say": "merrit", "text": "Merrit Gaunt, Gilded Hand Finance. I'm here about Reclaimed & Company's winter payment. Ms. Kettle suggested we meet on neutral ground. She chose yours. I find that interesting." },
        {
          "if": "hook.short == 0",
          "then": [
            { "say": "bryony", "text": "Eighteen hundred. Count it. There's a dead sea captain in there somewhere." },
            { "say": "merrit", "text": "Correct to the dollar. Merry Christmas, Ms. Kettle. I'll see you on the twenty-fourth for the rest." },
            { "set": { "rwEnd": "chest" } },
            { "rep": 2, "why": "Saw Bryony make the winter payment" }
          ],
          "else": [
            { "say": "bryony", "text": "I'm {hook:short|money} short. I'll have it in a week. I'll have it in two days." },
            { "say": "merrit", "text": "The Hand doesn't do two days. It does what's on the shelves. Your stock, at our valuation, which you won't enjoy." },
            {
              "choose": [
                {
                  "label": "Cover the {hook:short|money} from your till",
                  "disabled": "coin < hook.short",
                  "then": [
                    { "set": { "rwEnd": "covered" } },
                    { "hook": "cover", "with": "Covered Bryony's winter payment" },
                    { "rep": 2, "why": "Covered Bryony's winter payment" },
                    { "sway": "marv", "by": 1, "why": "Covered Bryony" },
                    { "say": "bryony", "text": "I don't know what to say. I'll say it at Christmas. I'll have worked it out by then." },
                    { "say": "merrit", "text": "How generous. I'll note it in the file. I note everything in the file." }
                  ]
                },
                {
                  "label": "Let him take her stock",
                  "then": [
                    { "set": { "rwEnd": "stripped" } },
                    { "say": "merrit", "text": "Very good. The van is outside. We'll take the lamps, the table and anything with a story." },
                    {
                      "narrate": { "if": "flag.rivalEnd == 'merged'", "then": "Two men in grey coats carry her lobster-trap table and three boxes of candles out of your shop. Your own stock they don't touch. They make a point of not touching it.", "else": "Across the street, two men in grey coats carry out the lobster-trap table, the porthole lamp and the bicycle nobody could ride. The window is bare by noon." }
                    },
                    { "sway": "marv", "by": -1, "why": "Watched Bryony stripped" }
                  ]
                }
              ]
            }
          ]
        },
        { "say": "merrit", "text": "Until Christmas Eve, then." },
        { "remove": "bryony" },
        { "leave": "merrit" }
      ]
    }
  },
  "beats": [
    { "drift": "rw-ring", "from": "1-2", "to": "1-3", "cast": "bryony", "scene": "rwRing" },
    { "drift": "rw-marv", "from": "1-4", "to": "2-2", "cast": "marv", "scene": "rwMarv", "if": "flag.rwIn" },
    { "drift": "rw-merrit", "from": "4-1", "to": "4-3", "cast": "merrit", "scene": "rwMerrit", "if": "flag.rwIn && !flag.rwEnd" }
  ],
  "nights": [
    {
      "id": "rw-lot",
      "window": ["2-2", "3-3"],
      "if": "flag.rwLot && !flag.rwLotDone",
      "scene": "rwLotNight",
      "test": [
        { "set": { "rwIn": true, "rwLot": true } },
        { "roll": { "rivalEnd": ["merged", "overflow"] } },
        { "hook": "testCoin", "with": [100, 200, 400] }
      ]
    }
  ],
  "calendar": [
    { "id": "rw-lot", "night": "rw-lot", "story": "rivalWinter", "where": "Reclaimed & Co.", "title": "The Sefton lot", "known": "flag.rwLot", "scene": "rwLotNight" }
  ],
  "afterwards": [
    { "find": "ring", "in": "stock", "match": { "uniqueId": "kettleRing" } },
    {
      "if": "hook.ringLapsed",
      "note": "the ring, if no Christmas Eve ever came (the chapter lapsed): after two months it's yours",
      "then": [
        { "hook": "release", "with": "ring" },
        { "toast": "Bryony never came back for her grandmother's ring. It's been long enough. It's yours to sell.", "look": "bryony", "icon": "ring" }
      ]
    }
  ],
  "epilogue": [
    { "line": "A dead sea captain's chest paid Bryony's winter payment. She keeps the receipt from Boston in the register, under the tray.", "if": "flag.rwEnd == 'chest'" },
    { "line": "You covered the last of Bryony's winter payment. She hasn't said thank you, exactly. She has brought you coffee every morning since.", "if": "flag.rwEnd == 'covered'" },
    { "line": "The Gilded Hand took her best stock for the winter payment. Reclaimed & Co. is mostly candles now, and the candles are mostly gone.", "if": "flag.rwEnd == 'stripped'" }
  ],
  "talk": {
    "by": "marv",
    "rumour": [
      "My niece has a winter payment due to the Hand. I'm clearing the Sefton house on Cove Road this month. There's always one good thing in a house.",
      "Don't tell her I said. She'll know I said."
    ],
    "react": { "chest": "A dead sea captain paid my niece's winter payment. I'd have charged him rent.", "covered": "You covered her. I don't forget things like that, and I clear a lot of attics.", "stripped": "The Hand took her table and her lamps. Half of that stock was mine first. I'll find her more." },
    "sway": { "chest": { "marv": 1 }, "covered": { "marv": 2 }, "stripped": { "marv": -1 } }
  }
});
