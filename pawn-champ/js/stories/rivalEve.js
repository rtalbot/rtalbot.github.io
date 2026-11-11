// Pawn Champ - Christmas Eve: the second chapter of The Rival Shop's long arc (round 3, batch T).
// Docs: docs/quests/MAJOR.md#m16-the-long-arc. Stay-on only.
//
// December, or January if it slips: the whole note on Reclaimed & Co. comes due. Merrit offers to
// sell it to you first. On the night, you pay it, go partners, call it in yourself, or let her go.
// The chapters share a code half: js/quests/rivalarc.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "rivalEve",
  "kind": "major",
  "colour": "#b8643a",
  "family": "town",
  "title": "Christmas Eve",
  "arc": "rivalWinter",
  "months": [3, 4],
  "teaser": { "if": "month == 3", "then": "A card from Bryony under the door, with a candle stub taped inside: \"The note comes due on Christmas Eve. Wish me luck. Or don't. Come over either way.\"", "else": "A card from Bryony under the door, a week late for Christmas: \"They gave me till the first Friday of January. Don't ask what that cost. Come over.\"" },
  "rumour": "The Gilded Hand calls in the whole note on Reclaimed & Co. this month.",
  "endings": { "saved": "Paid in Full", "partners": "Under One Sign", "note": "You Hold Her Note", "gone": "Gone by New Year" },
  "outcome": "flag.eveEnd",
  "code": "rivalarc",
  "about": [
    "The last chapter of the Bryony story. The Gilded Hand calls in her whole note on Christmas Eve (or the first Friday of January, if the chapter slips), and she's short (§{eveAsk}). She asks what you think: put up $200 for a stake (or her name on your sign), wait and see what's in the till, or let the shop go.",
    "Merrit Gaunt offers to sell you her note for $600 (§{eveMerrit}). Buy it and she owes you, not the Hand; or turn him down, or walk across the street and tell her.",
    "On the night, with snow and carols on Main Street (§{eveNight}), it comes down to you. If you hold the note, tear it up (Paid in Full), make it a partnership (Under One Sign), or call it in and take her shop (You Hold Her Note). If you don't, pay what she's short (Paid in Full), co-sign with her (Under One Sign), or let her hand over the keys and go home to Fall River (Gone by New Year). If she pawned her grandmother's ring, she redeems it only if she stays."
  ],
  "notes": "The night is Christmas Eve in December, or the first Friday of January if the chapter slips to month 4. hook.gap is what she's short: the note, less what the winter left her and anything that helped since.",
  "scenes": {
    "eveAsk": {
      "title": "Bryony: the whole note comes due, and she's short",
      "customer": "bryony",
      "steps": [
        {
          "say": "bryony",
          "text": [
            { "if": "month == 3", "then": "It's the whole note on Christmas Eve. Merrit was very clear. He brought a calendar with the day circled in gold.", "else": "It's the whole note on the first Friday of January. Merrit was very clear. He brought a calendar with the day circled in gold." },
            "I've got everything I own in a coffee can, and I'm {hook:gap|money} short. I'm not asking you for money. I'm asking what you think I should do. That's worse, I know."
          ]
        },
        {
          "choose": [
            {
              "label": { "if": "flag.rivalEnd == 'merged'", "then": "Make it official: her name on the sign", "else": "Buy a stake in Reclaimed & Co." },
              "hint": "($200 now, and you're in it together)",
              "disabled": "coin < 200",
              "then": [
                { "set": { "eveAsk": "stake" } },
                {
                  "coin": -200,
                  "why": { "if": "flag.rivalEnd == 'merged'", "then": "Put Bryony's name on the sign", "else": "Bought a stake in Reclaimed & Co." }
                },
                {
                  "say": "bryony",
                  "text": { "if": "flag.rivalEnd == 'merged'", "then": "Kettle and the Crooked Scale. It's terrible. I love it. I'll paint it myself.", "else": "Partners across a street. People will talk. Let them; it's free advertising." }
                }
              ]
            },
            {
              "label": "\"Hold on till the night. We'll see what's in the till.\"",
              "then": [
                { "set": { "eveAsk": "wait" } },
                { "say": "bryony", "text": "Okay. Okay. I'll be the one who looks calm. You be the one who counts." }
              ]
            },
            {
              "label": "\"Maybe it's time to let the brick go.\"",
              "then": [
                { "set": { "eveAsk": "go" } },
                { "say": "bryony", "text": "Maybe. My mother says come home to Fall River. My mother has said that every week since 2009." }
              ]
            }
          ]
        },
        { "set": { "eveIn": true } },
        {
          "toast": { "if": "month == 3", "then": "Calendar: Christmas Eve, on Main Street", "else": "Calendar: the first Friday of January, on Main Street" },
          "look": "bryony"
        },
        { "leave": "bryony" }
      ]
    },
    "eveMerrit": {
      "title": "Merrit Gaunt offers to sell you her note",
      "customer": "merrit",
      "steps": [
        {
          "say": "merrit",
          "text": [
            "Merrit Gaunt. A small matter, between businesses. The Hand is tidying its book before the new year.",
            { "if": "month == 3", "then": "Ms. Kettle's note. Forty thousand on paper, and on Christmas Eve it will be worth whatever her shop is worth to us, which is the brick. I would sell it to you tonight for $600.", "else": "Ms. Kettle's note. Forty thousand on paper, and on the first Friday of January it will be worth whatever her shop is worth to us, which is the brick. I would sell it to you tonight for $600." },
            "You would hold her note. You could call it, and the shop across the street is yours. Or not. What people do with paper is their own affair."
          ]
        },
        {
          "choose": [
            {
              "label": "Buy Bryony's note ($600)",
              "hint": "(she owes you, not the Hand)",
              "disabled": "coin < 600",
              "then": [
                { "set": { "eveNote": true } },
                { "coin": -600, "why": "Bought Bryony Kettle's note from the Gilded Hand" },
                { "say": "merrit", "text": "A pleasure. The paper will be at your door by morning. Mind the ink. It never quite dries." }
              ]
            },
            {
              "label": "\"No.\"",
              "then": [{ "say": "merrit", "text": "As you like. The offer was the courtesy." }]
            },
            {
              "label": "Say nothing, and tell Bryony after",
              "then": [
                { "set": { "eveTold": true } },
                { "say": "merrit", "text": "Of course." },
                { "narrate": "After he's gone you walk across the street and tell her. She laughs, the way people laugh at a car accident." }
              ]
            }
          ]
        },
        { "leave": "merrit" }
      ]
    },
    "eveNight": {
      "title": "The note comes due on Main Street",
      "music": "tension",
      "steps": [
        {
          "if": "flag.rivalEnd == 'merged'",
          "then": [
            {
              "stage": "shopNight",
              "view": { "candleX": 236 },
              "actors": [
                { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 168] },
                { "id": "bryony", "cast": "bryony", "at": [120, 162] }
              ]
            }
          ],
          "else": [
            {
              "stage": "reclaimedNight",
              "actors": [
                { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 168] },
                { "id": "bryony", "cast": "bryony", "at": [120, 162] }
              ]
            }
          ]
        },
        {
          "narrate": {
            "if": "month == 3",
            "then": { "if": "flag.rivalEnd == 'merged'", "then": "Christmas Eve on Main Street. Snow coming down past the streetlights, carols from the Rusty Anchor, every window lit. Bryony has put a candle in your window. It smells of Sea Fog.", "else": "Christmas Eve on Main Street. Snow coming down past the streetlights, carols from the Rusty Anchor, every window lit. Reclaimed & Co. has one string of bulbs on, and Bryony behind the counter in her coat." },
            "else": { "if": "flag.rivalEnd == 'merged'", "then": "The first Friday of January. The lights are still up on Main Street, because nobody can face the ladder. Bryony is behind your counter, polishing the same lamp for the third time.", "else": "The first Friday of January. The lights are still up on Main Street, because nobody can face the ladder. Reclaimed & Co. has one string of bulbs on, and Bryony behind the counter in her coat." }
          }
        },
        { "narrate": "Across the street your own window, the one she dressed, still has the rosette in it.", "if": "flag.winEnd == 'theirs' && flag.rivalEnd == 'overflow'" },
        {
          "if": "!flag.eveNote",
          "then": [
            { "enter": { "id": "merrit", "cast": "merrit", "at": [300, 160], "facingLeft": true } },
            { "walk": "merrit", "to": [200, 162] },
            { "say": "merrit", "text": "Ms. Kettle. The note, in full. Or the keys." },
            { "say": "bryony", "text": "I've got all of it but {hook:gap|money}." }
          ],
          "else": [
            { "narrate": "Nobody comes at nine. The Gilded Hand has nothing to come for. The paper is in your coat." },
            { "say": "bryony", "text": "So. You're the bank now. I've got all of it but {hook:gap|money}. Funny, isn't it. It's the same number whoever's asking." }
          ]
        },
        { "find": "ring", "in": "stock", "match": { "uniqueId": "kettleRing" } },
        {
          "choose": [
            {
              "label": "Tear up the note",
              "hint": "(she owes nobody)",
              "if": "flag.eveNote",
              "then": [
                { "set": { "eveEnd": "saved" } },
                { "narrate": "You tear it in half, and in half again, and put it in her wastebasket with the candle ends." },
                { "rep": 5, "why": "Saved Reclaimed & Co." },
                { "sway": "marv", "by": 2, "why": "Saved Bryony" },
                { "sway": "gordie", "by": 1, "why": "Saved Reclaimed & Co." },
                { "say": "bryony", "text": "I'm going to cry, and then I'm going to bid against you on everything good that comes through this town. Merry Christmas." }
              ]
            },
            {
              "label": "Make the note a partnership",
              "hint": "(you're in it together, for good)",
              "if": "flag.eveNote",
              "then": [
                { "set": { "eveEnd": "partners" } },
                { "rep": 3, "why": "Went partners with Bryony" },
                { "sway": "marv", "by": 2, "why": "Went partners with Bryony" },
                { "sway": "gordie", "by": 2, "why": "Went partners with Bryony" },
                {
                  "say": "bryony",
                  "text": { "if": "flag.rivalEnd == 'merged'", "then": "Then the ampersand is real. We'll need a bigger one.", "else": "Two shops, one note, one street. We're going to fight about everything." }
                }
              ]
            },
            {
              "label": "Call the note in",
              "hint": "(the shop is yours by morning)",
              "if": "flag.eveNote",
              "then": [
                { "set": { "eveEnd": "note" } },
                { "rep": -4, "why": "Called in Bryony Kettle's note" },
                { "sway": "marv", "by": -3, "why": "Called in Bryony's note" },
                { "hook": "takeStock", "sets": ["n"] },
                {
                  "narrate": { "if": "n > 0", "then": "She looks from you to the shelves and back. Then she puts the keys on the counter, and the lights, and the brass bell over the door rings once as she goes. In the morning her best pieces are on your shelves.", "else": "She looks from you to the shelves and back. Then she puts the keys on the counter, and the lights, and the brass bell over the door rings once as she goes." }
                }
              ]
            },
            {
              "label": "Pay the {hook:gap|money}",
              "hint": "(she's free and clear)",
              "disabled": "coin < hook.gap",
              "if": "!flag.eveNote",
              "then": [
                { "set": { "eveEnd": "saved" } },
                { "hook": "payGap", "with": "Paid off Bryony's note" },
                { "say": "merrit", "text": "Paid in full. How unusual. Good night, Ms. Kettle. Good night, both of you." },
                { "rep": 5, "why": "Saved Reclaimed & Co." },
                { "sway": "marv", "by": 2, "why": "Saved Bryony" },
                { "sway": "gordie", "by": 1, "why": "Saved Reclaimed & Co." },
                { "say": "bryony", "text": "I'm going to cry, and then I'm going to bid against you on everything good that comes through this town. Merry Christmas." }
              ]
            },
            {
              "label": "Co-sign the note with her",
              "hint": "({hook:third|money} now, partners for good)",
              "disabled": "coin < hook.third",
              "if": "!flag.eveNote",
              "then": [
                { "set": { "eveEnd": "partners" } },
                { "hook": "payThird", "with": "Co-signed Bryony's note" },
                { "say": "merrit", "text": "Two names on the paper. The Hand likes two names. Good night." },
                { "rep": 3, "why": "Went partners with Bryony" },
                { "sway": "marv", "by": 2, "why": "Went partners with Bryony" },
                { "sway": "gordie", "by": 2, "why": "Went partners with Bryony" },
                {
                  "say": "bryony",
                  "text": { "if": "flag.rivalEnd == 'merged'", "then": "Then the ampersand is real. We'll need a bigger one.", "else": "Two shops, one note, one street. We're going to fight about everything." }
                }
              ]
            },
            {
              "label": "Let her hand over the keys",
              "then": [
                { "set": { "eveEnd": "gone" } },
                { "rep": -1 },
                { "say": "merrit", "text": "The keys, then. Thank you. The Hand will find a better tenant. It always does.", "if": "merrit" },
                { "narrate": "She puts the keys on the counter. Then she takes a candle from the window, Sea Fog, and gives it to you." },
                { "say": "bryony", "text": "Fall River. My mother will be unbearable. It was a good street. You were a good neighbor, mostly." }
              ]
            }
          ]
        },
        {
          "if": "ring",
          "then": [
            {
              "if": "flag.eveEnd == 'saved' || flag.eveEnd == 'partners'",
              "then": [
                { "hook": "redeemRing", "with": "Bryony redeemed her grandmother's ring" },
                { "narrate": "Before she goes home she counts out the ring money, with the interest, to the penny, and puts her grandmother's ring back on. \"You said by Christmas. I said by Christmas.\"" }
              ],
              "else": [
                { "hook": "release", "with": "ring" },
                { "narrate": "She doesn't ask about her grandmother's ring, and you don't mention it. In the morning it's still in the drawer, and it's yours." }
              ]
            }
          ]
        },
        { "remove": "merrit" }
      ]
    }
  },
  "beats": [
    { "drift": "eve-ask", "from": "1-2", "to": "1-3", "cast": "bryony", "scene": "eveAsk" },
    { "drift": "eve-merrit", "from": "2-1", "to": "2-3", "cast": "merrit", "scene": "eveMerrit", "if": "flag.eveIn && !flag.eveEnd" }
  ],
  "nights": [
    {
      "id": "eve-night",
      "window": ["4-1", "4-3"],
      "if": "flag.eveIn && !flag.eveEnd",
      "scene": "eveNight",
      "test": [
        { "set": { "eveIn": true, "rivalIn": true } },
        { "roll": { "rivalEnd": ["merged", "overflow"] } },
        { "roll": { "rwEnd": ["chest", "covered", "stripped"] } },
        { "roll": { "eveNote": [true, true, false, false, false] }, "note": "four times in ten" },
        { "set": { "rwRing": 120 } },
        { "hook": "testCoin", "with": [200, 900] },
        { "add": { "unique": "kettleRing", "paid": 120 } }
      ]
    }
  ],
  "calendar": [
    { "id": "eve-night", "night": "eve-night", "story": "rivalEve", "where": "Main Street", "title": "The note comes due", "known": "flag.eveIn", "scene": "eveNight" }
  ],
  "epilogue": [
    { "line": "Reclaimed & Co. is open, free and clear, and bidding against you on everything good that comes through Hollow Neck. Bryony sends a candle every Christmas Eve.", "if": "flag.eveEnd == 'saved'" },
    {
      "line": { "if": "flag.rivalEnd == 'merged'", "then": "The sign over your door says KETTLE & THE CROOKED SCALE now. The ampersand is very large. She painted it.", "else": "Two shops on Main Street on one note, with two names on it. You argue about everything, across the street, at the top of your voices." },
      "if": "flag.eveEnd == 'partners'"
    },
    { "line": "You held her note and you called it. Reclaimed & Co. is yours, and dark. The brass bell over the door hasn't rung since.", "if": "flag.eveEnd == 'note'" },
    { "line": "Bryony Kettle went home to Fall River. The old shoe repair is empty again, with a FOR LEASE sign and forty candle rings on the floor.", "if": "flag.eveEnd == 'gone'" }
  ],
  "talk": {
    "by": "gordie",
    "rumour": [
      "The Hand calls the whole note on the candle shop this month. I know a man who knows a man who leases brick.",
      "If you want my advice, and everybody does: never be the second shop on a street. Unless you're me."
    ],
    "react": { "saved": "Reclaimed & Co., paid in full. On Main Street. In this economy. I sent flowers. Well, a brochure.", "partners": "Two names on one note. Smart. Never compete with somebody you can sign with.", "note": "You bought her paper and called it. I've done that. I didn't feel good about it either.", "gone": "The candle lady's gone home to Fall River. The brick's for lease. I've already had three calls." },
    "sway": {
      "saved": { "marv": 2, "gordie": 1 },
      "partners": { "gordie": 2, "marv": 1 },
      "note": { "gordie": 1, "marv": -3 },
      "gone": { "marv": -1 }
    }
  }
});
