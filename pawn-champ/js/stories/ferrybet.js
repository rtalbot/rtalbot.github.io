// Pawn Champ - The Ferry Captain's Bet. Minor quest m16, batch B (docs/quests/MINOR.md#m16-the-ferry-captains-bet).
// Captain Nan Ferreira bet she could cross to Gannet Island in fog without radar. She pawns her
// grandfather's chronometer to cover the stake, and wants an honest witness on deck. Mott's compass
// (The Fog Week) helps if you have it.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/ferrybet.js.
defineStory({
  "id": "ferrybet",
  "kind": "minor",
  "title": "The Ferry Captain's Bet",
  "location": "ferry",
  "rumour": "Captain Ferreira bet she could cross in the fog without radar.",
  "endings": { "won": "By Dead Reckoning", "lost": "Aground on the Bar" },
  "outcome": "flag.betEnd",
  "about": [
    "Captain Nan Ferreira of the island ferry bet Dewey Lopes $200 she could cross to Gannet Island in the fog without radar, and she's $80 short (§{nanPawn}). She pawns her grandfather's chronometer and asks you to be her witness on deck in the first proper fog.",
    "On the crossing (§{ferrybetDeck}) you can hand her Mott's compass, which always points home, count the bell buoys for her (good odds), keep quiet and let her steer alone (even odds), or take $30 from Dewey to call the buoy wrong. If she wins she buys the chronometer back for $120 (By Dead Reckoning); if she runs aground it's yours to sell (Aground on the Bar). Missing the trip leaves it to chance."
  ],
  "notes": "Nan lends against her grandfather's chronometer for $80 and buys it back at $120 if she wins.",
  "cast": {
    "deweyLopes": {
      "name": "Dewey Lopes",
      "look": { "skin": "#b88060", "hair": "#1a1a1a", "hs": 0, "coat": "#e8a020", "style": "puffer", "hat": "beanie", "hatc": "#c84a3a", "pants": "#3a3a48", "moustache": "#1a1a1a" }
    }
  },
  "uniques": {
    "chronometer": {
      "name": "Ferreira pocket chronometer",
      "icon": "watch",
      "cat": "curio",
      "guide": 150,
      "cond": 2,
      "condLabel": "Keeps perfect time",
      "questKey": true,
      "tells": [
        "A two-day marine chronometer in a pocket case, still gimballed.",
        "Engraved inside the lid: J. FERREIRA, MASTER, 1951. It's two seconds fast, and has been since 1951."
      ]
    }
  },
  "scenes": {
    "nanPawn": {
      "title": "Nan Ferreira needs the stake for her bet",
      "customer": "nan",
      "steps": [
        {
          "say": "nan",
          "text": [
            "Nan Ferreira. I run the island ferry. You'll have heard I bet Dewey Lopes I could cross to Gannet in the fog without radar. I did. I was provoked.",
            "The stake is $200 a side, and I'm eighty short. This was my grandfather's chronometer. He crossed with nothing else for forty years.",
            "$80 against it, and I'll buy it back the day I win. And I need a witness on deck who isn't Dewey's cousin. Midday, this week, first proper fog."
          ]
        },
        { "view": { "counterIcon": "watch" } },
        {
          "choose": [
            {
              "label": "Lend her $80 against the chronometer, and be her witness",
              "disabled": "coin < 80 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "add": { "unique": "chronometer" }, "as": "chrono" },
                { "edit": "chrono", "set": { "paid": 80 } },
                { "coin": -80, "why": "Lent Nan Ferreira the stake for her bet" },
                { "set": { "betIn": true } },
                { "plan": "ferrybet-deck" },
                { "say": "nan", "text": "Good. Wear something warm. And don't touch anything in the wheelhouse." },
                { "toast": "Calendar: the ferry in the fog, at lunch", "look": "nan" }
              ]
            },
            {
              "label": "\"I don't take bets, Captain. Or lend on them.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "nan", "text": "Fair enough. I'll find it somewhere. Dewey's cousin owns a pawnshop in Fall River, but I'd sooner sink." }
              ]
            }
          ]
        },
        { "leave": "nan" }
      ]
    },
    "ferrybetDeck": {
      "title": "The bet in the fog",
      "steps": [
        {
          "stage": "ferry",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 164] },
            { "id": "nan", "cast": "nanFerreira", "at": [196, 162], "facingLeft": true },
            { "id": "dewey", "cast": "deweyLopes", "at": [250, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Noon, and the fog is so thick the bow is a rumour. The radar has a tea towel over it. Dewey Lopes has a stopwatch and a bag of malasadas." },
        { "say": "dewey", "text": "Forty minutes to the Gannet slip, Nan. Not a second over. And no peeking at the phone." },
        { "say": "nan", "text": "I don't need a phone. I need quiet. Witness, you're on the stern. Tell me when you hear the bell buoy." },
        { "find": "compass", "in": "stock", "match": { "key": "compass", "mark": "a lighthouse stamp" } },
        {
          "choose": [
            {
              "label": "Hand her Mott's old compass",
              "hint": { "if": "compass", "then": "(it always points the true way home)", "else": "(you'd need Mott's compass)" },
              "disabled": "!compass",
              "then": [
                { "narrate": "The old brass needle swings away from north and settles, steady as a finger, on Gannet Island. Nan looks at it, then at you, and doesn't ask." },
                { "say": "dewey", "text": "Thirty-eight minutes. I want a recount. I want a different fog." },
                { "say": "nan", "text": "By dead reckoning, Dewey. Like Grandpa. Witness, I'll be in for the chronometer this afternoon, with interest." },
                { "set": { "betEnd": "won" } },
                { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
                { "take": "chrono" },
                { "coin": 120, "why": "Nan Ferreira bought back her chronometer" }
              ]
            },
            {
              "label": "Listen hard and count the bell buoys for her",
              "then": [
                {
                  "if": "random < 0.75",
                  "then": [
                    { "narrate": "Bell to port. Then the gong on the bar. You call them, she turns on your word, and the slip comes out of the fog dead ahead." },
                    { "say": "dewey", "text": "Thirty-eight minutes. I want a recount. I want a different fog." },
                    { "say": "nan", "text": "By dead reckoning, Dewey. Like Grandpa. Witness, I'll be in for the chronometer this afternoon, with interest." },
                    { "set": { "betEnd": "won" } },
                    { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
                    { "take": "chrono" },
                    { "coin": 120, "why": "Nan Ferreira bought back her chronometer" }
                  ],
                  "else": [
                    { "narrate": "Bell to port. Or was it starboard? The fog bends sound. You call it, and you're wrong." },
                    { "say": "nan", "text": "Aground on the bar. In front of Dewey. Grandpa's watch is yours, keeper. A bet's a bet." },
                    { "rep": -2, "if": "flag.betCheat" },
                    { "set": { "betEnd": "lost" } },
                    { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
                    { "edit": "chrono", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            {
              "label": "Keep quiet and let her do it alone",
              "then": [
                {
                  "if": "random < 0.5",
                  "then": [
                    { "narrate": "She steers by the clock, the swell and something in her bones. The slip comes out of the fog dead ahead with two minutes to spare." },
                    { "say": "dewey", "text": "Thirty-eight minutes. I want a recount. I want a different fog." },
                    { "say": "nan", "text": "By dead reckoning, Dewey. Like Grandpa. Witness, I'll be in for the chronometer this afternoon, with interest." },
                    { "set": { "betEnd": "won" } },
                    { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
                    { "take": "chrono" },
                    { "coin": 120, "why": "Nan Ferreira bought back her chronometer" }
                  ],
                  "else": [
                    { "narrate": "She steers by the clock and the swell, and the swell lies. There is a soft long scrape under the hull." },
                    { "say": "nan", "text": "Aground on the bar. In front of Dewey. Grandpa's watch is yours, keeper. A bet's a bet." },
                    { "rep": -2, "if": "flag.betCheat" },
                    { "set": { "betEnd": "lost" } },
                    { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
                    { "edit": "chrono", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            {
              "label": "Call the bell buoy wrong, on purpose",
              "hint": "(Dewey slips you $30)",
              "then": [
                { "coin": 30, "why": "Dewey Lopes paid you to call it wrong" },
                { "set": { "betCheat": true } },
                { "narrate": "\"Bell to starboard,\" you call, and it isn't. There is a soft long scrape under the hull. Dewey finds something very interesting in his malasadas." },
                { "say": "nan", "text": "Aground on the bar. In front of Dewey. Grandpa's watch is yours, keeper. A bet's a bet." },
                { "rep": -2, "if": "flag.betCheat" },
                { "set": { "betEnd": "lost" } },
                { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
                { "edit": "chrono", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "at": "2-3", "cast": "nanFerreira", "scene": "nanPawn" }],
  "errands": [
    {
      "id": "ferrybet-deck",
      "title": "The bet in the fog",
      "where": "the island ferry",
      "scene": "ferrybetDeck",
      "test": [
        { "add": { "unique": "chronometer" } },
        { "add": { "item": "compass", "cond": 2, "mark": "a lighthouse stamp" }, "if": "random < 0.5" }
      ]
    }
  ],
  "calendar": [
    { "id": "ferrybet-deck", "errand": "ferrybet-deck", "story": "ferrybet", "where": "The island ferry", "title": "The ferry bet" }
  ],
  "mornings": [
    {
      "if": "!flag.betEnd && flag.betIn && hook.skipped",
      "note": "you stayed open instead, and she went without a witness",
      "then": [
        {
          "if": "random < 0.5",
          "then": [
            { "set": { "betEnd": "won" } },
            { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
            { "take": "chrono" },
            { "coin": 120, "why": "Nan Ferreira bought back her chronometer" },
            { "toast": "Nan Ferreira crossed in the fog and won. She came by early for the chronometer, with interest.", "look": "nanFerreira" }
          ],
          "else": [
            { "set": { "betEnd": "lost" } },
            { "find": "chrono", "in": "stock", "match": { "uniqueId": "chronometer" } },
            { "edit": "chrono", "set": { "questKey": false, "nosale": false } },
            { "refresh": "panel" },
            { "toast": "Nan Ferreira ran aground on the bar. Her grandfather's chronometer is yours to sell.", "look": "nanFerreira" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "Captain Ferreira still crosses to Gannet in the fog without radar. The Coast Guard has asked her, twice, to stop.", "if": "flag.betEnd == 'won'" },
    { "line": "Dewey Lopes framed the newspaper photo of the island ferry aground on the bar. Nan Ferreira has not been into his water taxi since.", "if": "flag.betEnd == 'lost'" }
  ]
});
