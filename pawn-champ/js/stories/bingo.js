// Pawn Champ - Bingo Night. Minor quest m3, batch A (docs/quests/MINOR.md#m3-bingo-night).
// Dolores Fitch wins the roof-fund bingo every week. Her grandson knows why, and pawns the proof.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/bingo.js.
defineStory({
  "id": "bingo",
  "kind": "minor",
  "title": "Bingo Night",
  "location": "grange",
  "rumour": "Dolores Fitch wins the roof-fund bingo every single week.",
  "endings": { "exposed": "B-4 the Board", "lady": "Lady Luck", "full": "Full House" },
  "about": [
    "A short comic story. Dex Fitch sells you his gran's bingo dauber, which has a magnet in the cap, along with metal-backed chips (§{bingoGrandson}). Dolores Fitch wins the roof-fund bingo at the Grange every week.",
    "At noon bingo (§{bingoNoon}) you can tell Father Ignatius (B-4 the Board), have a quiet word so she starts losing gracefully (Lady Luck), or play with the dauber yourself and win $40 (Full House)."
  ],
  "cast": {
    "dolores": {
      "name": "Dolores Fitch",
      "look": { "skin": "#f0d0b8", "hair": "#c8b0e0", "hs": 3, "coat": "#3a8a8a", "style": "puffer", "pants": "#5a4a6a", "glasses": "#c84a8a", "bag": "#e8c040" }
    },
    "dex": {
      "name": "Dex Fitch",
      "look": { "skin": "#f0d0b8", "hair": "#8a5a2a", "hs": 4, "coat": "#5a6a3a", "style": "hoodie", "pants": "#2a2a32", "hat": "cap", "hatc": "#c84a3a" }
    }
  },
  "uniques": {
    "dauber": {
      "name": "Magnetic bingo dauber",
      "icon": "dauber",
      "cat": "curio",
      "guide": 5,
      "tells": [
        "A magnet is glued inside the cap. With it, a bag of bingo chips, every one with a steel back."
      ]
    }
  },
  "overheard": [
    { "line": "To a friend: \"Dolores Fitch won the bingo again. Every single week. Nobody's that lucky.\"" }
  ],
  "scenes": {
    "bingoGrandson": {
      "title": "Dex brings in his gran's dauber",
      "customer": "dex",
      "steps": [
        {
          "say": "dex",
          "text": [
            "Dex. My gran is Dolores Fitch. She wins the bingo at the Grange every single week. Every week. Everyone thinks she's lucky.",
            "I found this in her bag. A dauber with a magnet in the cap, and a bag of chips with metal backs. Give me ten bucks and I never saw any of it."
          ]
        },
        {
          "offer": { "unique": "dauber" },
          "persona": "shifty",
          "asking": 10,
          "min": 5,
          "onWatch": "continue"
        },
        {
          "if": "offer == 'watch'",
          "then": [{ "set": { "bingoKnown": true } }, { "plan": "bingo-noon" }, { "end": true }],
          "note": "Calling the police on Dex: Barrow takes him away, but you still know about the bingo."
        },
        { "set": { "bingoKnown": true } },
        { "plan": "bingo-noon" },
        { "say": "dex", "text": "She's got a spare, obviously. Noon bingo for the Saint Brine's roof, {when:bingo-noon|or:this week}. She'll be there. She's always there." },
        { "toast": "Calendar: roof-fund bingo, the Grange Hall, {when:bingo-noon} at noon", "look": "dex", "if": "errand.bingo-noon" },
        { "leave": "dex" }
      ]
    },
    "bingoNoon": {
      "title": "Roof-fund bingo at the Grange",
      "steps": [
        {
          "stage": "grange",
          "view": { "sign": "BINGO FOR THE ROOF" },
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [84, 166] },
            { "id": "ignatius", "cast": "ignatius", "at": [236, 158], "facingLeft": true },
            { "id": "dolores", "cast": "dolores", "at": [150, 164] }
          ]
        },
        { "narrate": "Noon bingo at the Grange Hall. Thirty cards, thirty players, and Father Ignatius at the cage, calling numbers he can only half hear." },
        { "say": "ignatius", "text": "B-4! Or was it D-4? There isn't a D. B-4!" },
        { "say": "dolores", "text": "BINGO." },
        { "narrate": "Dolores Fitch's chips don't sit where she puts them. They creep toward the numbers being called. Her ring is the size of a walnut." },
        { "find": "dauber", "in": "stock", "match": { "uniqueId": "dauber" } },
        {
          "choose": [
            {
              "label": "Tell Father Ignatius",
              "then": [
                { "set": { "bingoEnd": "exposed" } },
                { "rep": 3, "why": "Exposed the bingo cheat" },
                { "say": "ignatius", "text": "Dolores? Dolores! Thirty years I've given you the good seat by the urn!" },
                { "narrate": "She's banned for a month. Father Ignatius calls the rest of the numbers in a very small voice." }
              ]
            },
            {
              "label": "Have a quiet word with Dolores",
              "then": [
                { "set": { "bingoEnd": "lady" } },
                { "say": "dolores", "text": "Well. You've got eyes, haven't you. Fine. I'll lose a few. Gracefully. I'm very good at graceful." },
                { "narrate": "Dolores loses the next four games with tremendous dignity and puts her winnings in the roof jar on the way out." },
                {
                  "hook": "roofFund",
                  "if": "quest.benefit",
                  "with": [40, "Dolores gave her bingo winnings to the roof."]
                }
              ]
            },
            {
              "label": "Buy a card and play with the dauber yourself",
              "disabled": "!dauber",
              "off": { "hint": "(you'd need the dauber)" },
              "then": [
                { "set": { "bingoEnd": "full" } },
                { "coin": 40, "why": "Won the roof-fund bingo" },
                { "rep": -1 },
                { "narrate": "Your chips slide where they ought to. Full house in eleven calls. Father Ignatius gives you forty dollars and a blessing, and Dolores gives you a look." }
              ]
            }
          ]
        },
        { "view": { "sign": null } },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [{ "at": "1-4", "cast": "dex", "scene": "bingoGrandson" }],
  "errands": [
    {
      "id": "bingo-noon",
      "title": "Roof-fund bingo",
      "where": "The Grange Hall",
      "scene": "bingoNoon",
      "test": [{ "add": { "unique": "dauber" } }, { "set": { "bingoKnown": true } }]
    }
  ],
  "calendar": [
    { "id": "bingo-noon", "errand": "bingo-noon", "story": "bingo", "where": "The Grange Hall", "title": "Roof-fund bingo", "known": "flag.bingoKnown", "scene": "bingoNoon" }
  ],
  "epilogue": [
    { "line": "Dolores Fitch plays bingo in the next town over now. They think she's very lucky.", "if": "flag.bingoEnd == 'exposed'" },
    { "line": "Dolores Fitch wins bingo about once a month now, which she says is plenty.", "if": "flag.bingoEnd == 'lady'" },
    { "line": "You still have the dauber. You haven't used it since. Probably.", "if": "flag.bingoEnd == 'full'" }
  ],
  "outcome": "flag.bingoEnd"
});
