// Pawn Champ - The Last Column. Minor quest m64, batch L (docs/quests/MINOR.md#m64-the-last-column).
// Silas Penhallow typed "Notes from the Neck" for the Hollow Neck Clarion for forty years. The
// paper shut in 2004, the week he typed his last one, and it was never printed. His granddaughter
// pawns his typewriter while the old office is cleared for the radio station upstairs. The carbon
// ribbon still holds every letter. Read it a line at a time at the Clarion with Hester Quint, then
// let Hester print it, sell the typewriter to a writer from away, or burn the ribbon.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "lastcolumn",
  "kind": "minor",
  "title": "The Last Column",
  "location": "clarion",
  "rumour": "They're clearing out the old Clarion office for the radio station.",
  "endings": { "printed": "Notes from the Neck", "sold": "A Writer from Away", "burned": "Off the Record" },
  "outcome": "flag.columnEnd",
  "about": [
    "Corinne Penhallow pawns her grandfather Silas's typewriter from the old Clarion office, where he wrote \"Notes from the Neck\" every week for forty years (§{corinneTypewriter}). Hester says the ribbon keeps every letter ever typed, and asks to read it with you.",
    "In the dusty office (§{clarionRibbon}) the ribbon gives up Silas's last, unpublished column: a confession that Mrs. Agnes Liddle of Water Street, the town's oldest resident, whom he quoted for twenty-seven years and who got birthday cards and a Grange plaque, never existed. A novelist from away, Jasper Fane, walks in offering $250 for the typewriter. Let Hester print the column in the Athenaeum newsletter (Notes from the Neck), sell to Fane (A Writer from Away), or burn the ribbon so Mrs. Liddle stays real (Off the Record)."
  ],
  "cast": {
    "corinne": {
      "name": "Corinne Penhallow",
      "look": { "skin": "#e8c0a0", "hair": "#8a4a2a", "hs": 5, "coat": "#4a5a7a", "style": "jacket", "pants": "#2a2a30", "glasses": "#2a2a2e", "bag": "#6a4a2a" }
    },
    "fane": {
      "name": "Jasper Fane",
      "look": { "skin": "#f0d0b8", "hair": "#2a2a2e", "hs": 1, "coat": "#2a2a30", "trim": "#c84a3a", "style": "suit", "long": true, "pants": "#2a2a30", "glasses": "#1a1a1e" }
    }
  },
  "icons": {
    "typewriter": [
      "............",
      "....kkkk....",
      "...kccccc...",
      "..kkkkkkkk..",
      ".kddddddddk.",
      ".kdkdkdkdkk.",
      "kdddddddddk.",
      "kdkdkdkdkdk.",
      "kdddddddddk.",
      "kdddkkkdddk.",
      "kkkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "typewriter": {
      "name": "Silas Penhallow's typewriter",
      "icon": "typewriter",
      "cat": "curio",
      "guide": 90,
      "questKey": true,
      "tells": [
        "A 1953 Royal, black, with the E worn nearly flat. Forty years of \"the Neck\".",
        "The ribbon is single-strike carbon. Under the loupe, every letter he ever typed on it is still there, in order.",
        "The last few inches read: NOTES FROM THE NECK, BY S.P. FOR THE LAST TIME, A CONFESSION."
      ]
    }
  },
  "scenes": {
    "corinneTypewriter": {
      "title": "Corinne Penhallow pawns her grandfather's typewriter",
      "customer": "corinne",
      "steps": [
        {
          "say": "corinne",
          "text": [
            "Corinne Penhallow. They're clearing out the old Clarion office so the radio station can have the downstairs. My grandfather's desk was still exactly how he left it. In 2004.",
            "He wrote \"Notes from the Neck\" every week for forty years. Who'd had a baby, whose boat was back, what Mrs. Liddle had to say about the weather. Everyone read it first, before the news.",
            "This was his typewriter. I can't keep it in a studio apartment. I can't put it in a dumpster either."
          ]
        },
        { "offer": { "unique": "typewriter" }, "persona": "honest", "asking": 60, "min": 40 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "corinne", "text": "I'll try the Historical Society. They'll give me a receipt and a long look." },
            { "leave": "corinne" },
            { "end": true }
          ]
        },
        { "set": { "columnIn": true } },
        { "say": "corinne", "text": "Hester Quint came by the office yesterday. She says the ribbon's the kind that keeps everything. If you find anything on it, she'd like to know. She was always his best reader." },
        { "plan": "clarion-ribbon" },
        { "leave": "corinne" }
      ]
    },
    "clarionRibbon": {
      "title": "Reading the ribbon with Hester",
      "steps": [
        {
          "stage": "clarion",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "hester", "cast": "hester", "at": [168, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The old Clarion office, shut since 2004. Back issues tied in bundles to the ceiling, the desks under dust sheets, and Silas's desk still set out for work. Hester Quint has brought a magnifier the size of a dinner plate." },
        { "say": "hester", "text": "Single-strike carbon. Every key leaves its letter on the ribbon and the ribbon never goes back. Silas's whole last week is on that spool. Shall we?" },
        {
          "narrate": [
            "NOTES FROM THE NECK, by S.P. For the last time, a confession.",
            "For twenty-seven years I have quoted Mrs. Agnes Liddle of Water Street, our oldest resident, on the weather, the selectmen and the price of scallops."
          ]
        },
        { "say": "hester", "text": "I sent her a card. Every year." },
        {
          "narrate": [
            "Readers have sent her birthday cards. The Grange gave her a plaque. Father Ignatius once tried to visit.",
            "There is no Mrs. Liddle. There never was. When I needed someone to say the true thing nobody in town would say out loud, I made her say it."
          ]
        },
        { "say": "hester", "text": "Oh, Silas." },
        {
          "narrate": [
            "She said the winter of '78 was nothing. She was right. She said the new breakwater would silt the channel. She was right about that too.",
            "I am sorry. She was me. She was also, I think, all of you, on a good day. Keep the plaque. Goodnight from the Neck."
          ]
        },
        { "say": "hester", "text": "Well. I'm the town's librarian, and I'd like it on the record that I'm laughing and I'd like a moment." },
        { "enter": { "id": "fane", "cast": "fane", "at": [250, 160], "facingLeft": true } },
        { "say": "fane", "text": "Sorry. Door was open. Jasper Fane, I'm writing a novel about a small New England town, and I heard there was a newspaperman's typewriter going. Is that it? Is that the Royal? I'd give two-fifty, today." },
        { "find": "tw", "in": "stock", "match": { "uniqueId": "typewriter" } },
        {
          "if": "!tw",
          "then": [
            { "say": "fane", "text": "Oh, it's gone already? Story of my life." },
            { "remove": "fane" },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Let Hester print it in the Athenaeum newsletter",
              "hint": "(+4 rep)",
              "then": [
                { "set": { "columnEnd": "printed" } },
                { "edit": "tw", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "rep": 4 },
                { "say": "hester", "text": "The autumn newsletter. Front page. I'll run her plaque next to it." },
                { "narrate": "It goes out on Friday. By Saturday half the town has written to the Athenaeum to say they knew all along, and the other half to ask if they can have the plaque." }
              ]
            },
            {
              "label": "Sell the typewriter to Jasper Fane",
              "hint": "($250)",
              "then": [
                { "set": { "columnEnd": "sold" } },
                { "sell": "tw" },
                { "coin": 250, "why": "Sold Silas Penhallow's typewriter to a writer from away" },
                { "say": "fane", "text": "Wonderful. Is the ribbon included? I'll keep the ribbon in. Authenticity." },
                { "say": "hester", "text": "He'll put Mrs. Liddle in a book and get her wrong. Never mind. She was always better in the paper." }
              ]
            },
            {
              "label": "Burn the ribbon. Mrs. Liddle stays real.",
              "then": [
                { "set": { "columnEnd": "burned" } },
                { "edit": "tw", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "narrate": "The press-room stove still works. The ribbon goes in a coil at a time and burns with a smell like a hot typewriter, which is what it is." },
                { "say": "hester", "text": "She can keep her plaque. I'll keep sending the card. Somebody has to." },
                { "rep": 1 }
              ]
            }
          ]
        },
        { "remove": "fane" }
      ]
    }
  },
  "beats": [
    { "drift": "lastcolumn", "from": "1-3", "to": "3-2", "cast": "corinne", "scene": "corinneTypewriter" }
  ],
  "errands": [
    {
      "id": "clarion-ribbon",
      "title": "Hester wants to read the ribbon",
      "where": "the old Clarion office",
      "scene": "clarionRibbon",
      "test": [{ "add": { "unique": "typewriter" } }, { "set": { "columnIn": true } }]
    }
  ],
  "talk": {
    "by": "hester",
    "rumour": [
      "They're clearing out the old Clarion office for the radio station. Forty years of back issues, going to the dump unless I get there first.",
      "Silas Penhallow's desk is still exactly as he left it. Ribbon in the typewriter. Silas never threw anything away, including other people's secrets."
    ],
    "react": { "printed": "The autumn newsletter has sold out. It's free. We're reprinting. Mrs. Liddle's plaque is on the issues desk now.", "sold": "A writer from away has Silas's typewriter. I've reserved his book at the library already. I'll read it with a pencil.", "burned": "I sent Mrs. Liddle her birthday card this year, same as always. Somebody has to." }
  },
  "calendar": [
    { "id": "clarion-ribbon", "errand": "clarion-ribbon", "story": "lastcolumn", "where": "The Clarion office", "title": "Read the ribbon", "known": "flag.columnIn" }
  ],
  "epilogue": [
    { "line": "Mrs. Agnes Liddle's plaque hangs in the Athenaeum next to Silas Penhallow's last column. People still quote her on the weather.", "if": "flag.columnEnd == 'printed'" },
    { "line": "A novel about a small New England town comes out next year. There's a wise old woman on Water Street in it. Everyone says she's nothing like Mrs. Liddle.", "if": "flag.columnEnd == 'sold'" },
    { "line": "Mrs. Agnes Liddle of Water Street is, as far as Hollow Neck knows, still our oldest resident.", "if": "flag.columnEnd == 'burned'" }
  ]
});
