// Pawn Champ - The Valentine. Minor quest m79, batch P (docs/quests/MINOR.md#m79-the-valentine).
// February. Rosalie Bouchard, eighty-eight, pawns a heart-shaped candy box of valentines: forty
// letters, one a year from 1946 to 1985, each from a different man. She never married. She'd like a
// stranger to read them and tell her which one she should have. Under the loupe every capital R has
// the same little hook. Otis Pelletier, who carries the post, knows that hook: it's on every sorting
// card in the back room, in the hand of Emory Thayer, postmaster from 1946 until he died in 1986.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/valentine.js.
defineStory({
  "id": "valentine",
  "kind": "minor",
  "title": "The Valentine",
  "location": "postoffice",
  "months": [5],
  "rumour": "Rosalie Bouchard got a valentine every year for forty years, and never from the same man twice.",
  "endings": { "told": "One Hand", "kept": "Forty Men", "sold": "Collected Letters" },
  "outcome": "flag.valEnd",
  "about": [
    "A February love story. Rosalie Bouchard, eighty-eight, pawns a heart-shaped box of forty valentines from forty years and, she says, forty different men she never said yes to, and asks you to read them and tell her which one she should have married (§{rosalieBox}). Otis the mailman sees the top letter and recognises the hand: the hooked R of Emory Thayer, the town's postmaster from 1946 until he died in 1986 (§{otisHand}).",
    "In the sorting room (§{valSorting}) Otis's old route cards prove every letter was Emory's, the shy man who handed Rosalie her mail every morning and asked if it was from anyone nice. Take the box back and tell her (One Hand), give it back without a word so she keeps her forty men (Forty Men), or sell the letters to a writer from Providence (Collected Letters)."
  ],
  "notes": "months: [5]: February, for Valentine's Day.",
  "cast": {
    "rosalie": {
      "name": "Rosalie Bouchard",
      "look": { "skin": "#e8c0a8", "hair": "#f0f0f4", "hs": 3, "coat": "#a83a4a", "style": "dress", "long": true, "pants": "#3a2a2a", "glasses": "#c8a050" }
    }
  },
  "icons": {
    "heartbox": [
      "............",
      "..kk...kk...",
      ".kRRk.kRRk..",
      "kRrRRkRRrRk.",
      "kRRRRRRRRRk.",
      "kRRpppppRRk.",
      ".kRpcccpRk..",
      "..kRpppRk...",
      "...kRRRk....",
      "....kRk.....",
      ".....k......",
      "............"
    ]
  },
  "uniques": {
    "valentineBox": {
      "name": "A heart-shaped box of valentines",
      "icon": "heartbox",
      "cat": "curio",
      "guide": 60,
      "questKey": true,
      "tells": [
        "A red heart-shaped candy box, 1946, the chocolates long gone. Forty letters inside, one for every February to 1985, forty different signatures.",
        { "text": "Under the loupe: every capital R has the same little hook at the foot. Forty men, and one hand.", "cls": "good" }
      ]
    }
  },
  "scenes": {
    "rosalieBox": {
      "title": "Rosalie Bouchard pawns her valentines",
      "customer": "rosalie",
      "steps": [
        { "say": "rosalie", "text": "Rosalie Bouchard. I'd like to pawn my valentines. Don't look like that. I'm eighty-eight. I'm allowed." },
        { "narrate": "A red heart-shaped candy box, the satin gone pink at the edges. Inside, letters, tied in bundles of ten with kitchen string." },
        {
          "say": "rosalie",
          "text": [
            "Forty years, forty letters, forty men. Fishermen, a teacher, a man who sold insurance. Every one of them in love with me, and I never said yes to any of them.",
            "Everyone in town knows the names. I want somebody who doesn't to read them and tell me which one I should have married. Forty dollars. I'll want them back."
          ]
        },
        { "offer": { "unique": "valentineBox" }, "persona": "honest", "asking": 40, "min": 25 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "rosalie", "text": "Then they go back under the bed. Where they've been very happy, I'm sure." },
            { "leave": "rosalie" },
            { "end": true }
          ]
        },
        { "set": { "valIn": true } },
        { "say": "rosalie", "text": "Read them in order. 1946 first. He was a lobsterman. He couldn't spell \"February\". Nobody can." },
        { "leave": "rosalie" }
      ]
    },
    "otisHand": {
      "title": "Otis knows the hand",
      "customer": "otis",
      "steps": [
        { "say": "otis", "text": "Mail. Bills, a seed catalogue, and something for Odile from 1994 that just turned up. We don't ask." },
        { "narrate": "He sees the heart-shaped box open on the counter, and the letter on top, and stops." },
        {
          "say": "otis",
          "text": [
            "That's Emory Thayer's hand. The R with the hook. He was postmaster from 1946 till he died in '86. Every sorting card in the back room is in that hand. I learned to read his eights before I learned the route.",
            "Come by at lunch. I'll show you. Then you can tell me I'm wrong, which I'm not."
          ]
        },
        { "plan": "val-sorting" },
        { "set": { "valHand": true } },
        { "leave": "otis" }
      ]
    },
    "valSorting": {
      "title": "Forty letters, one hand",
      "steps": [
        {
          "stage": "postofficeLast",
          "fadeOut": false,
          "if": "flag.deadEnd",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "otis", "cast": "otis", "at": [220, 164], "facingLeft": true }
          ]
        },
        {
          "stage": "postoffice",
          "fadeOut": false,
          "if": "!flag.deadEnd",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "otis", "cast": "otis", "at": [220, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The sorting room at lunch. Otis has a shoebox of yellow cards on the parcel scale: routes, box numbers, forwarding addresses, forty years of them, every one in the same small upright hand." },
        { "say": "otis", "text": "Look at the R. ROUTE. RURAL. RETURN. Now look at your letters. ROSALIE." },
        { "narrate": "The hook at the foot of every R, on every card and in every letter. The lobsterman who couldn't spell February. The teacher. The insurance man. All of them Emory Thayer." },
        { "say": "otis", "text": "Emory handed her her mail every morning for forty years. Including these. He used to ask her if they were from anyone nice. He never married either. I always thought that was just Emory." },
        { "find": "box", "in": "stock", "match": { "uniqueId": "valentineBox" } },
        {
          "if": "!box",
          "then": [
            { "say": "otis", "text": "You haven't got the box any more? Then it doesn't matter what I think. It's hers, whatever it is." },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Take the box back to Rosalie, and tell her",
              "hint": "(rep +3)",
              "then": [
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "set": { "valEnd": "told" } },
                { "enter": { "id": "rosalie", "cast": "rosalie", "at": [320, 168], "facingLeft": true } },
                { "narrate": "Rosalie Bouchard's front room, that afternoon. She takes the box, and the yellow card Otis lent you, and puts them side by side under the lamp." },
                {
                  "say": "rosalie",
                  "text": [
                    "The postmaster. Every morning. \"Anything nice today, Miss Bouchard?\" And I'd say \"Only another one, Mr. Thayer,\" and he'd look so pleased for me.",
                    "Forty years. He could have just asked. I'd have said... well. I don't know what I'd have said. That's the trouble. I'd have liked to find out."
                  ]
                },
                { "narrate": "She doesn't cry. She reads the 1946 one again, the lobsterman who couldn't spell February, and laughs out loud." },
                { "rep": 3 }
              ]
            },
            {
              "label": "Give it back without a word: she can keep her forty men",
              "then": [
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "set": { "valEnd": "kept" } },
                { "narrate": "You take the box back to Rosalie Bouchard's door and give it to her, and say they were all lovely, which they were." },
                { "say": "otis", "text": "Forty men in love with her. That's a better story than one shy postmaster. Maybe it's even true. In a way." }
              ]
            },
            {
              "label": "Sell the letters to a writer from Providence",
              "hint": "(+$150)",
              "then": [
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "set": { "valEnd": "sold" } },
                { "coin": 150, "why": "Sold Rosalie Bouchard's valentines to a writer" },
                { "say": "otis", "text": "A book. \"Letters to R.\" I suppose she'll see it in the library. Hester will make sure she sees it in the library." },
                { "rep": -2 }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "drift": "valentine", "from": "1-2", "to": "2-1", "cast": "rosalie", "scene": "rosalieBox" },
    { "drift": "valentine", "from": "2-2", "to": "2-4", "cast": "otis", "scene": "otisHand", "if": "flag.valIn && hook.hasBox && !flag.valHand", "note": "the day after you look at the letters, he brings the mail and stays" }
  ],
  "errands": [
    {
      "id": "val-sorting",
      "title": "Otis has the old sorting cards out",
      "where": "the post office sorting room",
      "scene": "valSorting",
      "test": [{ "add": { "unique": "valentineBox" } }, { "set": { "valIn": true, "valHand": true } }]
    }
  ],
  "calendar": [
    { "id": "val-sorting", "errand": "val-sorting", "story": "valentine", "where": "The post office", "title": "Forty letters, one hand", "known": "flag.valHand" }
  ],
  "epilogue": [
    { "line": "On Valentine's Day Rosalie Bouchard took a red carnation to the Old Burying Ground and left it on Emory Thayer's stone. Otis saw her, on his route. He says she was talking.", "if": "flag.valEnd == 'told'" },
    { "line": "Rosalie Bouchard still has her forty valentines, under the bed, from forty men. She tells the story at the Grange. It gets better every year.", "if": "flag.valEnd == 'kept'" },
    { "line": "\"Letters to R.\" will be out in the autumn from a small press in Providence. Rosalie Bouchard hasn't been told. Somebody will tell her.", "if": "flag.valEnd == 'sold'" }
  ],
  "talk": {
    "by": "otis",
    "rumour": [
      "Rosalie Bouchard got a valentine every February for forty years. Hand-delivered. Different name every year. Then in 1986 they stopped.",
      "I wasn't on the route then. I've heard about it from every porch on it."
    ],
    "react": { "told": "Rosalie came to the counter this week and asked for a book of stamps. She hasn't sent a letter since 1985. She wouldn't say who to.", "kept": "Rosalie's telling everybody about her forty men again. She's got the dates right and the names all wrong. I deliver to her. I know.", "sold": "There's a writer from Providence asking me about Emory Thayer. I said I never knew him. I only know his eights." }
  }
});
