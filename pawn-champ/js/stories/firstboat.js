// Pawn Champ - The First Boat Out. Minor quest m81, batch P (docs/quests/MINOR.md#m81-the-first-boat-out).
// March. Since 1880 the first boat out past Gannet Light after the harbor ice goes carries the town's
// luck for the year, and flies the First Boat pennant to prove it: red silk, faded nearly pink, kept
// by last year's first skipper. Rui Mendes was first last year. His engine needs rebuilding and he
// pawns the pennant to pay for it. Joan Dufresne has been second four years running, and she wants
// it. Tess Bascombe says when the ice is out, and she says it's Thursday.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/firstboat.js.
defineStory({
  "id": "firstboat",
  "kind": "minor",
  "title": "The First Boat Out",
  "location": "harbormaster",
  "months": [6],
  "rumour": "Whoever sails first after the ice gets the town's luck for the year, and this year two skippers want it.",
  "endings": { "rui": "Second Year Running", "joan": "Fifth Time Lucky", "abreast": "Abreast" },
  "outcome": "flag.boatEnd",
  "about": [
    "A March story about the old custom that the first boat out past Gannet Light after the ice gets the town's luck for the year. Rui Mendes, first last year, pawns the First Boat pennant to fix his engine; Joan Dufresne, second four years running, walks straight in and offers $200 for it (§{ruiPennant}).",
    "At the harbormaster's shack as the ice goes out (§{boatShack}), Tess won't start a race but both skippers are ready. Let Rui redeem the pennant (Second Year Running), sell it to Joan (Fifth Time Lucky), or tie it on a line between their masts so they go out side by side and Tess logs a TWO for the first time since 1880 (Abreast)."
  ],
  "notes": "months: [6]: the ice goes out of the harbor in March.",
  "cast": {
    "ruiMendes": {
      "name": "Rui Mendes",
      "look": { "skin": "#c89070", "hair": "#1a1a1a", "hs": 1, "coat": "#e8b020", "style": "puffer", "pants": "#2a3a4a", "hat": "beanie", "hatc": "#2a3a4a", "beard": "#1a1a1a" }
    },
    "joanDufresne": {
      "name": "Joan Dufresne",
      "look": { "skin": "#e8c0a0", "hair": "#c86a3a", "hs": 2, "coat": "#e86a2a", "style": "puffer", "pants": "#3a3a42", "hat": "beanie", "hatc": "#f0f0f0" }
    }
  },
  "icons": {
    "pennant": [
      "............",
      ".k..........",
      ".kkk........",
      ".kRRkk......",
      ".kRRRRkk....",
      ".kRRcRRRkk..",
      ".kRRRRRRRRk.",
      ".kRRRRRkk...",
      ".kRRkkk.....",
      ".kkk........",
      ".k..........",
      ".k.........."
    ]
  },
  "uniques": {
    "firstPennant": {
      "name": "The First Boat pennant",
      "icon": "pennant",
      "cat": "curio",
      "guide": 90,
      "questKey": true,
      "tells": [
        "Red silk, faded nearly pink, on a hickory toggle. FIRST BOAT embroidered in white, and under it a column of years in different threads.",
        "The years go back to 1880. The first ones are stitched in hair."
      ]
    }
  },
  "scenes": {
    "ruiPennant": {
      "title": "Rui Mendes pawns the First Boat pennant; Joan Dufresne wants it",
      "customer": "rui",
      "steps": [
        { "say": "rui", "text": "Rui Mendes, the Ana Lucia. You know what this is? You'll know by Thursday. Everybody will." },
        { "narrate": "He unrolls a long faded pennant on the counter, red silk on a wooden toggle. FIRST BOAT, and a column of years stitched underneath, back to 1880." },
        {
          "say": "rui",
          "text": [
            "First boat out past Gannet Light when the ice goes, she gets the luck for the year. She flies this. I was first last year. Best year I ever had.",
            "My engine's in pieces in my brother's garage. Eighty for the pennant and I can buy the head gasket. I'll have it back before the ice goes. I will."
          ]
        },
        { "offer": { "unique": "firstPennant" }, "persona": "honest", "asking": 80, "min": 55 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "rui", "text": "Then I'll row. I'm joking. I'm mostly joking." },
            { "leave": "rui" },
            { "end": true }
          ]
        },
        { "set": { "boatIn": true } },
        { "leave": "rui" },
        { "hook": "walkIn", "with": "joanDufresne", "sets": ["joanDufresne"] },
        {
          "say": "joanDufresne",
          "text": [
            "Joan Dufresne, the Marie-Claude. I saw Rui come out of here without his pennant and I'd like to buy it. Two hundred. Cash.",
            "Four years I've been second. Four years I've watched that rag go out ahead of me on Rui's mast. Tess says the ice is out on Thursday. Come down to the shack at noon and see how serious I am."
          ]
        },
        { "plan": "boat-shack" },
        { "leave": "joanDufresne" }
      ]
    },
    "boatShack": {
      "title": "Ice out: the first boat past Gannet Light",
      "music": "sea",
      "steps": [
        {
          "stage": "harbormaster",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 170] },
            { "id": "tess", "cast": "tess", "at": [190, 166], "facingLeft": true },
            { "id": "rui", "cast": "ruiMendes", "at": [300, 168], "facingLeft": true },
            { "id": "joan", "cast": "joanDufresne", "at": [360, 168], "facingLeft": true }
          ]
        },
        { "narrate": "The harbormaster's shack at noon. The ice is going out on the tide in long gray plates that grind past the pilings. Two boats are idling at the float, ten feet apart, not looking at each other." },
        { "say": "tess", "text": "Channel's clear to Gannet Light in about an hour. I don't start races. I say \"the ice is out\". What happens after that is between you and God and the Coast Guard." },
        { "say": "rui", "text": "The engine's back in. My brother put it in at four this morning. I've got the eighty. I want my pennant." },
        { "say": "joan", "text": "And I've got two hundred. It's a shop. It sells things." },
        { "find": "p", "in": "stock", "match": { "uniqueId": "firstPennant" } },
        {
          "if": "!p",
          "then": [
            { "say": "tess", "text": "No pennant? Then nobody's first. Or everybody is. I like that better, but nobody asked me." },
            { "set": { "boatEnd": null } },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Let Rui redeem it",
              "hint": "(+$80; he goes first again)",
              "then": [
                { "edit": "p", "set": { "questKey": false, "nosale": false } },
                { "set": { "boatEnd": "rui" } },
                { "coin": 80, "why": "Rui Mendes redeemed the First Boat pennant" },
                { "narrate": "The Ana Lucia goes out first, pennant snapping, and the Marie-Claude a length behind, close enough that Joan could spit on Rui's transom. She considers it. You can see her considering it." },
                { "rep": 1 }
              ]
            },
            {
              "label": "Sell it to Joan",
              "hint": "(+$200)",
              "then": [
                { "edit": "p", "set": { "questKey": false, "nosale": false } },
                { "set": { "boatEnd": "joan" } },
                { "coin": 200, "why": "Sold the First Boat pennant to Joan Dufresne" },
                { "narrate": "Joan runs it up her mast before the money's out of her hand. The Marie-Claude goes out first, and the whole harbor wall cheers, because everybody likes a fifth try." },
                { "say": "rui", "text": "Fair enough. It's a shop. It sells things. Next year, Joan." }
              ]
            },
            {
              "label": "Tie it on a line between both masts: they go out abreast",
              "hint": "(+$80 from Rui; Tess has to agree)",
              "then": [
                { "edit": "p", "set": { "questKey": false, "nosale": false } },
                { "set": { "boatEnd": "abreast" } },
                { "coin": 80, "why": "Rui Mendes redeemed the First Boat pennant" },
                { "say": "tess", "text": "Abreast. On a line between the masts. If either of you pulls ahead, you tear the pennant, and you'll have to explain that to every skipper back to 1880." },
                { "narrate": "The Ana Lucia and the Marie-Claude go out past Gannet Light side by side, ten feet apart, the faded pennant slung between them, neither one gaining an inch. People on the harbor wall have never seen anything like it. Tess writes it in the log: TWO." },
                { "rep": 3 }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [{ "drift": "firstboat", "from": "1-2", "to": "2-3", "cast": "ruiMendes", "scene": "ruiPennant" }],
  "errands": [
    {
      "id": "boat-shack",
      "title": "Tess says the ice is going out",
      "where": "the harbormaster's shack",
      "scene": "boatShack",
      "test": [{ "add": { "unique": "firstPennant" } }, { "set": { "boatIn": true } }]
    }
  ],
  "calendar": [
    { "id": "boat-shack", "errand": "boat-shack", "story": "firstboat", "where": "The harbormaster's shack", "title": "Ice out", "known": "flag.boatIn" }
  ],
  "epilogue": [
    { "line": "Rui Mendes was first boat out two years running. He has stitched the year into the pennant himself, badly, and he says the luck held.", "if": "flag.boatEnd == 'rui'" },
    { "line": "Joan Dufresne was first boat out at last. The Marie-Claude had her best spring in twenty years. Joan says it was the pennant. Rui says it was the weather.", "if": "flag.boatEnd == 'joan'" },
    { "line": "The First Boat pennant has two names stitched under this year, side by side. The harbormaster's log says TWO. The luck, people say, was shared out, and went further.", "if": "flag.boatEnd == 'abreast'" }
  ],
  "talk": {
    "by": "tess",
    "rumour": [
      "The ice is breaking up. Thursday or Friday, it'll go out on the noon tide. Then everybody wants to be first past Gannet Light.",
      "Rui Mendes was first last year. Joan Dufresne's been second four years. I've put out extra fenders."
    ],
    "react": { "rui": "Rui went out first again. Joan nearly rammed him at the light. I didn't see it. I was looking at my log very hard.", "joan": "Joan Dufresne, first boat out. She came by the shack after with a bottle of something. I don't drink on duty. I do keep bottles.", "abreast": "Two boats abreast past Gannet Light with the pennant slung between them. Nobody has logged a TWO in that book since it started, in 1880. I logged it in red." }
  }
});
