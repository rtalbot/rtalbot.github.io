// Pawn Champ - The Overdue Book. Minor quest m9, batch A (docs/quests/MINOR.md#m9-the-overdue-book).
// A first edition you bought turns out to be sixty-five years overdue, and the librarian is very polite.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/overdue.js.
defineStory({
  "id": "overdue",
  "kind": "minor",
  "title": "The Overdue Book",
  "location": "athenaeum",
  "rumour": "The Athenaeum is holding an amnesty day. No fines, no questions.",
  "endings": { "returned": "Returned", "keepers": "Finders Keepers" },
  "about": [
    "A small story. Gil Pardee, clearing out his mother's house, sells you an old book (§{overdueGil}). Hester comes in: it's an Athenaeum first edition, due back on the third of March, 1961, and the library wrote every spring (§{overdueHester}). She invites you to the amnesty day.",
    "At the Athenaeum (§{overdueAmnesty}) return it and Hester shows you the rare-book room (Returned); if Spoons is in the run, you find the 1904 programme proving only one Lighthouse spoon was ever struck. Or tell her you bought it fair and square, or come without it (Finders Keepers)."
  ],
  "cast": {
    "gil": {
      "name": "Gil Pardee",
      "look": { "skin": "#e0b090", "hair": "#7a6a5a", "hs": 0, "coat": "#6a5a3a", "style": "jacket", "trim": "#3a3a2a", "pants": "#3a3a42", "beard": "#7a6a5a", "hat": "cap", "hatc": "#2a3a5a" }
    }
  },
  "uniques": {
    "overdueBook": {
      "name": "Overdue first edition",
      "icon": "tome",
      "cat": "curio",
      "guide": 140,
      "tells": [
        "A true first printing. Inside the cover, a library plate: \"Athenaeum copy. Due back 3 March 1961.\""
      ]
    }
  },
  "overheard": [
    { "line": "Guiltily: \"The Athenaeum's doing an amnesty day. No fines. I've had a book since 1994.\"" }
  ],
  "scenes": {
    "overdueGil": {
      "title": "Gil clears out his mother's books",
      "customer": "gil",
      "steps": [
        { "say": "gil", "text": "Clearing out my mother's house. She read everything and gave nothing back. This one looks old. You want it?" },
        { "offer": { "unique": "overdueBook" }, "persona": "honest", "asking": 50, "min": 34 },
        { "leave": "gil" }
      ]
    },
    "overdueHester": {
      "title": "Hester Quint wants the Athenaeum's book back",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "Hester Quint, from the Athenaeum. I believe you have one of ours. It was due back on the third of March, 1961.",
            "Mrs. Pardee had it out for sixty-five years. We did write. Every spring."
          ]
        },
        { "set": { "overdueKnown": true } },
        { "plan": "overdue-amnesty" },
        { "say": "hester", "text": "We're holding an amnesty day, {when:overdue-amnesty|or:this week} at noon. No fines, no questions. Bring it, if you like. Or don't, and we'll both know." },
        { "toast": "Calendar: amnesty day at the Athenaeum, {when:overdue-amnesty} at noon", "look": "hester", "if": "errand.overdue-amnesty" },
        { "leave": "hester" }
      ]
    },
    "overdueAmnesty": {
      "title": "Amnesty day at the Athenaeum",
      "steps": [
        {
          "stage": "athenaeum",
          "view": { "sign": "AMNESTY: NO FINES" },
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 166] },
            { "id": "hester", "cast": "hester", "at": [200, 160], "facingLeft": true }
          ]
        },
        { "narrate": "Amnesty day at the Athenaeum. Half the town is shuffling in with carrier bags, not making eye contact. A selectman returns a book on tax law from 1988." },
        { "find": "book", "in": "stock", "match": { "uniqueId": "overdueBook" } },
        {
          "if": "!book",
          "then": [
            { "set": { "overdueEnd": "keepers" } },
            { "say": "hester", "text": "No book? Ah. Well. It's out there in the world, being read. That's something." },
            { "view": { "sign": null } },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Return it",
              "then": [
                { "take": "book" },
                { "set": { "overdueEnd": "returned", "overdueReturned": true } },
                { "rep": 4, "why": "Returned the Athenaeum's first edition" },
                { "say": "hester", "text": "Thank you. Come and see the rare-book room. Nobody ever asks." },
                {
                  "if": "quest.spoons",
                  "then": [
                    { "set": { "spoonsProgramme": true } },
                    { "narrate": "In a glass case: the programme for Old Home Week, 1904. It lists the seven souvenir spoons, and notes that only one Lighthouse spoon was struck. Ellery Thorne owns it. Any other is a fake." }
                  ],
                  "else": [
                    { "narrate": "The rare-book room smells of leather and radiator. Hester shows you a ship's log, a cookbook from 1790, and a love letter used as a bookmark since the Civil War." }
                  ]
                }
              ]
            },
            {
              "label": "\"I bought it fair and square, Ms. Quint.\"",
              "then": [
                { "set": { "overdueEnd": "keepers" } },
                { "rep": -2 },
                { "say": "hester", "text": "Legally, perhaps. Morally, it's been on loan since 1961. Good afternoon." }
              ]
            }
          ]
        },
        { "view": { "sign": null } },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "gil", "scene": "overdueGil" },
    { "at": "2-1", "cast": "hester", "scene": "overdueHester", "if": "hook.bookHere" }
  ],
  "errands": [
    {
      "id": "overdue-amnesty",
      "title": "Amnesty day",
      "where": "The Athenaeum",
      "scene": "overdueAmnesty",
      "test": [{ "add": { "unique": "overdueBook" } }, { "set": { "overdueKnown": true } }]
    }
  ],
  "calendar": [
    { "id": "overdue-amnesty", "errand": "overdue-amnesty", "story": "overdue", "where": "The Athenaeum", "title": "Amnesty day", "known": "flag.overdueKnown", "scene": "overdueAmnesty" }
  ],
  "epilogue": [
    { "line": "The Athenaeum's first edition is back on its shelf, sixty-five years late and fine-free.", "if": "flag.overdueEnd == 'returned'" },
    { "line": "Hester Quint still nods to you on Front Street. Coolly.", "if": "flag.overdueEnd == 'keepers'" }
  ],
  "outcome": [
    { "if": "flag.overdueEnd == 'returned'", "ending": "returned" },
    { "if": "flag.overdueEnd == 'keepers' || flag.overdueKnown", "ending": "keepers" }
  ]
});
