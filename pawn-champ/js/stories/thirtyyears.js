// Pawn Champ - Every Thirty Years. Minor quest m44, batch K (docs/quests/MINOR.md).
// A thin man pawns a sea chest for thirty dollars and is never seen again. Hester Quint finds it in
// the shop's old ledgers: the same chest, the same name, in 1936, 1966 and 1996. Something lives in
// the lining, and it's polite. Its scene is a night in the shop after hours.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/thirtyyears.js.
defineStory({
  "id": "thirtyyears",
  "kind": "minor",
  "title": "Every Thirty Years",
  "location": "shopNight",
  "rumour": "Hester Quint has been reading the Crooked Scale's old pawn ledgers for the town history. She says one entry keeps coming back.",
  "endings": { "lodger": "The Lodger", "sea": "Back to Sea", "sold": "Sold On" },
  "outcome": "flag.chestEnd",
  "about": [
    "A quiet uncanny story. Mr. Quarrie pawns a sea chest for exactly thirty dollars, mentioning an old arrangement with this shop (§{quarrieChest}). Hester finds the same entry in the shop's old ledgers in 1936, 1966 and 1996, never redeemed, signed in the same hand, and after each the pawnbroker had thirty very good years (§{hesterLedgers}). She tells you to listen to it at night.",
    "After midnight (§{thirtyyears}) three polite knocks come from inside, and a voice in the coat lining explains it is the lodger: every thirty years it walks the chest to the driest shop on the harbor, keeps the damp and moths away and finds lost things, asking only to be left alone. Let it stay thirty years (The Lodger), float the chest out to sea (Back to Sea), or tell it it must be sold on (Sold On)."
  ],
  "cast": {
    "quarrie": {
      "name": "Mr. Quarrie",
      "look": { "skin": "#e0d0c0", "hair": "#3a3a3a", "hs": 0, "coat": "#2a3a3a", "style": "suit", "long": true, "trim": "#5a6a6a", "pants": "#2a2a2a", "hat": "top", "hatc": "#1a1a1a" }
    }
  },
  "icons": {
    "seachest": [
      "............",
      "............",
      "..kkkkkkkk..",
      ".kwWWWWWWwk.",
      ".kwwwwwwwwk.",
      ".kkkkyykkkk.",
      ".kwWWkkWWwk.",
      ".kwWWWWWWwk.",
      ".kwWWWWWWwk.",
      ".kwwwwwwwwk.",
      ".kkkkkkkkkk.",
      "..kk....kk.."
    ]
  },
  "uniques": {
    "thirtyChest": {
      "name": "The thirty-year sea chest",
      "icon": "seachest",
      "cat": "curio",
      "guide": 120,
      "questKey": true,
      "tells": [
        "A sailor's sea chest, camphor wood, rope handles. Bone-dry inside, though it smells of the sea.",
        "Pencilled inside the lid, in four different hands: 1936. 1966. 1996. And a space."
      ]
    }
  },
  "scenes": {
    "quarrieChest": {
      "title": "Mr. Quarrie pawns a sea chest",
      "customer": "quarrie",
      "steps": [
        {
          "say": "quarrie",
          "text": [
            "Good morning. Quarrie. I have a sea chest to pawn. Thirty dollars, if you would.",
            "I shan't haggle. It's an old arrangement with this shop. I expect your aunt left a note about it. No? Ah. She was always very busy."
          ]
        },
        { "offer": { "unique": "thirtyChest" }, "persona": "honest", "asking": 30, "min": 30 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "chestHeld": true } },
            { "say": "quarrie", "text": "Thank you. Keep it somewhere dry. Not that it matters. Good day." }
          ],
          "else": [
            { "say": "quarrie", "text": "Oh. Oh dear. Thirty years, and nobody's ever said no." },
            { "narrate": "He carries it out, slowly, and you don't see which way he goes." }
          ]
        },
        { "leave": "quarrie" }
      ]
    },
    "hesterLedgers": {
      "title": "Hester finds the chest in the old ledgers",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "Hester Quint, the Athenaeum. Odile lent me the shop's old pawn ledgers for the town history. I've found something, and I don't like it.",
            "1936: \"Sea chest, camphor, rope handles. J. Quarrie. Thirty dollars.\" Never redeemed. 1966: the same. 1996: the same. Same name. Same thirty dollars. Same handwriting in the signature, sixty years apart.",
            "And here's the part I don't like. Every time, the pawnbroker had thirty very good years. Dry cellar, no moths, lost things turning up in the right drawer. Is that chest on your shelf?"
          ]
        },
        { "hook": "keeper", "sets": ["you"] },
        { "say": "you", "text": "It is." },
        { "say": "hester", "text": "Then I would listen to it, if I were you. At night. That's when the 1966 entry says it talks." },
        { "set": { "chestKnown": true } },
        { "toast": "Calendar: listen to the sea chest, {placed:thirtyyears} night", "look": "hester" },
        { "leave": "hester" }
      ]
    },
    "thirtyyears": {
      "title": "The sea chest at night",
      "music": "eerie",
      "steps": [
        { "view": { "candleX": 120 } },
        {
          "stage": "shopNight",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "thirtyChest" } },
        {
          "if": "!it",
          "then": [
            { "narrate": "You sit up with a lamp until midnight, listening to a shelf where a sea chest used to be. Nothing happens. It's a relief, mostly." },
            { "view": { "candleX": null } },
            { "end": true }
          ]
        },
        {
          "narrate": [
            "After closing. The shop ticks and settles. At ten past midnight, from inside the sea chest, three small knocks. Polite ones.",
            "You lift the lid. The chest is empty except for a folded coat: dark, long, a little old-fashioned. Mr. Quarrie's coat. And a voice from the lining, soft as a page turning.",
            "\"Good evening. Forgive the hour. I'm the lodger. I come with the chest, or the chest comes with me, we've never settled which.\"",
            "\"Every thirty years I borrow the coat and walk the chest to the Crooked Scale, because it's the driest shop on the harbor and the people are kind. I keep the damp out. I keep the moths off. I find what you've lost. I ask only to stay thirty years, and to be let alone.\""
          ]
        },
        {
          "choose": [
            {
              "label": "\"Stay. Thirty years.\"",
              "then": [
                { "set": { "chestEnd": "lodger" } },
                { "narrate": "\"Thank you. You won't notice me. That's the idea.\" The lid closes itself, gently. In the morning there is a twenty-dollar bill on the counter that you lost in your first week, and a note in a very old hand: FOUND." },
                { "coin": 20, "why": "Found by the lodger" },
                { "rep": 2 }
              ]
            },
            {
              "label": "\"I think you should go home. To the sea.\"",
              "then": [
                { "set": { "chestEnd": "sea" } },
                { "take": "it" },
                {
                  "narrate": [
                    "\"Home.\" A long pause. \"I'd forgotten that was a choice.\"",
                    "You carry the chest to the end of Pier Nine before dawn. You set it down on the water, and it floats, high and dry, and the tide takes it out past the breakwater. It doesn't look back. Chests can't. You feel that it would have."
                  ]
                },
                { "rep": 1 }
              ]
            },
            {
              "label": "\"I'm sorry. You'll have to be sold on.\"",
              "then": [
                { "set": { "chestEnd": "sold" } },
                { "edit": "it", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                {
                  "narrate": [
                    "\"Of course. Business is business. Someone will be very lucky.\" A pause. \"Or not. It depends on them, really.\"",
                    "The coat is gone from the chest in the morning. The chest is just a chest, as far as you can tell, and yours to sell."
                  ]
                }
              ]
            }
          ]
        },
        { "view": { "candleX": null } }
      ]
    }
  },
  "nights": [
    {
      "id": "thirtyyears",
      "window": ["3-1", "4-3"],
      "if": "flag.chestKnown && !flag.chestEnd",
      "scene": "thirtyyears",
      "test": [{ "set": { "chestKnown": true } }, { "add": { "unique": "thirtyChest" } }]
    }
  ],
  "beats": [
    { "at": "1-2", "cast": "quarrie", "scene": "quarrieChest" },
    { "at": "2-4", "cast": "hester", "scene": "hesterLedgers", "if": "flag.chestHeld && hook.hasChest" }
  ],
  "calendar": [
    { "id": "thirtyyears", "night": "thirtyyears", "story": "thirtyyears", "where": "The Crooked Scale", "title": "Listen to the chest", "known": "flag.chestKnown", "scene": "thirtyyears" }
  ],
  "epilogue": [
    { "line": "The sea chest sits in the back room. The cellar has never been so dry. In 2056, someone will pencil a fifth date inside the lid.", "if": "flag.chestEnd == 'lodger'" },
    { "line": "A fisherman swears he saw a sea chest riding the swell off Gannet Island, heading east, in no hurry.", "if": "flag.chestEnd == 'sea'" },
    { "line": "Somebody bought the thirty-year sea chest. Their cellar has never been so dry. They don't know why.", "if": "flag.chestEnd == 'sold'" }
  ]
});
