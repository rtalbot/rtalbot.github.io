// Pawn Champ - Something Borrowed: a bride pawns her grandmother's veil to pay for the elopement her
// mother doesn't know about. Minor quest m21, batch D (docs/quests/MINOR.md#m21-something-borrowed).
// months: [1]: the wedding is on a deck over the water, in October (docs/SEASONS.md).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/veil.js.
defineStory({
  "id": "veil",
  "kind": "minor",
  "title": "Something Borrowed",
  "location": "clamshack",
  "months": [1],
  "rumour": "Carmen Ruiz is eloping. Her mother doesn't know.",
  "endings": { "old": "Something Old", "elope": "Elopement", "sold": "Veil for Sale" },
  "about": [
    "An October story. Carmen Ruiz is eloping with Danny Pacheco on the deck at Dot's Clam Shack, and everyone knows but her mother. She pawns her grandmother's wedding veil for the deposit, mostly so it won't be in the cedar chest when her mother looks (§{carmenVeil}). Her mother, Inés, comes in knowing the veil is gone (§{inesVeil}): tell her about the wedding, keep Carmen's secret, or sell her the veil out from under the loan (Veil for Sale).",
    "At the wedding (§{veilWedding}) bring the veil back to Carmen or just watch. If you told Inés, she turns up, says her own mother married in that veil on a fishing boat in the rain, and pins it on Carmen herself, provided you brought it (Something Old). Otherwise Carmen marries with or without the veil (Elopement)."
  ],
  "notes": "carmenWed and carmenBride are Carmen on her wedding day, without and with the veil.",
  "cast": {
    "carmen": {
      "name": "Carmen Ruiz",
      "look": { "skin": "#c89070", "hair": "#2a1a12", "hs": 5, "coat": "#e8a8b8", "trim": "#f4eedc", "style": "jacket", "pants": "#3a3a4a", "bag": "#c8a050" }
    },
    "ines": {
      "name": "Inés Ruiz",
      "look": { "skin": "#c89070", "hair": "#8a8a8a", "hs": 3, "coat": "#2a3a5a", "trim": "#c8a050", "style": "dress", "long": true, "pants": "#2a2a3a", "bag": "#2a2a2a" }
    },
    "ray": {
      "name": "Danny Pacheco",
      "look": { "skin": "#a87050", "hair": "#1a1210", "hs": 0, "coat": "#2a2a30", "trim": "#f4f4ee", "style": "suit", "pants": "#2a2a30" }
    },
    "carmenWed": {
      "name": "Carmen Ruiz (on her wedding day)",
      "look": { "skin": "#c89070", "hair": "#2a1a12", "hs": 5, "coat": "#f4f4ee", "trim": "#f4eedc", "style": "dress", "pants": "#3a3a4a", "bag": "#c8a050", "long": true }
    },
    "carmenBride": {
      "name": "Carmen Ruiz (in the veil)",
      "look": { "skin": "#c89070", "hair": "#2a1a12", "hs": 5, "coat": "#f4f4ee", "trim": "#f4eedc", "style": "dress", "pants": "#3a3a4a", "bag": "#c8a050", "long": true, "hat": "veil", "hatc": "#f4f4ee" }
    }
  },
  "icons": {
    "veil": [
      "....kkk.....",
      "...kyyyk....",
      "...kcccck...",
      "..kcpcccck..",
      "..kccpcccck.",
      ".kcpcccpcck.",
      ".kcccpccccck",
      "kcpcccpcccck",
      "kccpcccpccck",
      "kcccccccccck",
      ".kkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "veil": {
      "name": "Lace veil",
      "icon": "veil",
      "cat": "art",
      "guide": 110,
      "tells": [
        "Brussels lace, hand-made, with a darn near the hem in three different threads.",
        "A label sewn inside the band: \"Lucía 1952 - Inés 1984 -\" and a space."
      ]
    }
  },
  "scenes": {
    "carmenVeil": {
      "title": "Carmen pawns her grandmother's veil",
      "customer": "carmen",
      "steps": [
        {
          "say": "carmen",
          "text": [
            "Have you heard? \"Carmen Ruiz is eloping, and her mother doesn't know.\" That's me. Hi. Everyone in town knows except my mother.",
            "Danny and I are getting married on the deck at Dot's Clam Shack. His cousin is a notary. The deposit for the deck is the problem.",
            "This was my grandmother's veil. Then my mother's. Lend me eighty on it? I'll buy it back after. I just need it to not be in my mother's cedar chest when she goes looking."
          ]
        },
        { "view": { "counterIcon": "veil" } },
        {
          "choose": [
            { "label": "Lend her $80 against the veil", "disabled": "coin < 80 || !shelf.free" },
            { "label": "Lend her $50", "disabled": "coin < 50 || !shelf.free" },
            { "label": "\"I can't take your grandmother's veil.\"" }
          ],
          "as": "lend"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "lend < 2",
          "then": [
            { "hook": "pawnVeil", "with": 80, "if": "lend == 0" },
            { "hook": "pawnVeil", "with": 50, "if": "lend == 1" },
            { "say": "carmen", "text": "Thank you. Day after tomorrow... no. The day after that. Noon, on the deck. You should come. Somebody from my side should be there." },
            { "plan": "veil-wedding", "after": 3 },
            { "toast": "Calendar: a wedding at Dot's Clam Shack", "look": "carmen" }
          ],
          "else": [
            { "say": "carmen", "text": "No. You're right. I'll sell my bike. Danny's bike. Somebody's bike." }
          ]
        },
        { "leave": "carmen" }
      ]
    },
    "inesVeil": {
      "title": "Inés Ruiz knows the veil is gone",
      "customer": "ines",
      "steps": [
        {
          "say": "ines",
          "text": [
            "Inés Ruiz. My daughter has been in here. Don't look at the floor, everybody looks at the floor.",
            "My mother's veil is gone from the cedar chest. Carmen thinks I don't know what the deck at Dot's costs to rent. I know what everything in this town costs."
          ]
        },
        {
          "choose": [
            {
              "label": "Tell her about the wedding on the deck",
              "then": [
                { "set": { "inesKnows": true } },
                {
                  "say": "ines",
                  "text": [
                    "Noon. On a deck. Over the water. In October.",
                    "...She always did hate a fuss. So did I, once. Thank you."
                  ]
                }
              ]
            },
            {
              "label": "\"It's Carmen's to tell, Mrs. Ruiz.\"",
              "then": [{ "say": "ines", "text": "Hm. Loyal. To her, at least. Good." }]
            },
            {
              "label": "Let her buy the veil out from under the loan",
              "hint": "(+$110)",
              "if": "hook.veilLoan",
              "then": [
                { "hook": "buyOut", "note": "The loan and the veil go, and the wedding errand is off." },
                { "coin": 110, "why": "Sold Carmen's pawned veil to her mother" },
                { "rep": -3 },
                { "set": { "veilEnd": "sold" } },
                { "say": "ines", "text": "Good. It goes back in the chest. She can have it at a proper wedding. With a priest. And me." }
              ]
            }
          ]
        },
        { "leave": "ines" }
      ]
    },
    "veilWedding": {
      "title": "Carmen and Danny's wedding",
      "steps": [
        { "hook": "arch", "with": true, "note": "Paper flowers on the trellis at the rail." },
        {
          "stage": "clamshack",
          "fadeOut": false,
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] }]
        },
        { "hook": "findVeil", "sets": ["veil"] },
        { "narrate": "Noon at Dot's. Somebody has wound paper flowers round a trellis at the rail. There are eleven guests, a notary in a fishing vest, and a gull with designs on the cake." },
        {
          "choose": [
            {
              "label": "Bring the veil",
              "hint": { "if": "veil", "then": "(you give back her pledge)", "else": "(it isn't in the shop)" },
              "disabled": "!veil"
            },
            { "label": "Just sit at a picnic table and watch" }
          ],
          "as": "bring"
        },
        {
          "enter": {
            "id": "carmen",
            "cast": "carmenBride",
            "name": "Carmen Ruiz",
            "at": [200, 156],
            "facingLeft": true
          },
          "if": "bring == 0"
        },
        {
          "enter": {
            "id": "carmen",
            "cast": "carmenWed",
            "name": "Carmen Ruiz",
            "at": [200, 156],
            "facingLeft": true
          },
          "if": "bring != 0"
        },
        { "enter": { "id": "danny", "cast": "ray", "at": [228, 156], "facingLeft": true } },
        {
          "if": "bring == 0",
          "then": [
            { "hook": "returnPledge" },
            { "say": "carmen", "text": "You brought it? You BROUGHT it. Danny, hold this. Hold everything." }
          ]
        },
        {
          "if": "flag.inesKnows",
          "then": [
            { "enter": { "id": "ines", "cast": "ines", "at": [40, 162] } },
            { "walk": "ines", "to": [170, 160] },
            { "face": "ines" },
            { "say": "ines", "text": "Your grandmother was married in that. On a fishing boat. In the rain. Don't let anyone tell you a deck is worse." },
            { "say": "carmen", "text": "Mama?" }
          ]
        },
        {
          "if": "bring == 0 && flag.inesKnows",
          "then": [
            { "set": { "veilEnd": "old" } },
            { "rep": 6 },
            { "narrate": "Inés pins the veil herself. Her hands are steadier than the notary's. Afterwards she writes something on the label inside the band, after her own name, and doesn't show anyone." }
          ],
          "else": [
            { "set": { "veilEnd": "elope" } },
            { "rep": 3, "if": "bring == 0" },
            { "rep": 1, "if": "bring != 0" },
            {
              "narrate": { "if": "bring == 0", "then": "Carmen is married in her grandmother's veil, on a deck over the harbor, with a gull watching. It is a very good wedding.", "else": "Carmen is married bareheaded, on a deck over the harbor, with a gull watching. It is a good wedding anyway." }
            }
          ]
        },
        {
          "if": "bring == 0",
          "then": [
            { "say": "carmen", "text": "And here: from the gift envelope. It's yours, it was always going to be yours." },
            { "hook": "repay", "with": "Carmen repaid the veil loan" }
          ]
        },
        { "hook": "arch", "with": false }
      ]
    }
  },
  "beats": [
    { "drift": "veil", "from": "2-1", "to": "3-2", "cast": "carmen", "scene": "carmenVeil" },
    { "drift": "veil", "from": "2-1", "to": "3-2", "offset": 2, "cast": "ines", "scene": "inesVeil", "if": "flag.veilPawned" }
  ],
  "errands": [
    {
      "id": "veil-wedding",
      "title": "Carmen and Danny's wedding",
      "where": "the deck at Dot's Clam Shack",
      "scene": "veilWedding",
      "test": [
        { "hook": "testLoan" },
        { "set": { "veilPawned": true, "veilLent": 80 } },
        { "roll": { "inesKnows": [true, false] } }
      ]
    }
  ],
  "calendar": [
    { "id": "veil-wedding", "errand": "veil-wedding", "story": "veil", "where": "Dot's Clam Shack", "title": "Carmen's wedding", "known": "flag.veilPawned && flag.veilEnd != 'sold'" }
  ],
  "mornings": [
    {
      "if": "flag.veilPawned && !flag.veilEnd && errand.veil-wedding == -1",
      "note": "You stayed open: they're married anyway. If the veil sells later, that's the ending that sticks.",
      "then": [
        { "set": { "veilEnd": "elope" } },
        { "toast": "Carmen Ruiz married Danny Pacheco on the deck at Dot's yesterday. Her grandmother's veil is still on your shelf.", "look": "carmen" }
      ]
    }
  ],
  "sold": { "veil": [{ "set": { "veilEnd": "sold" } }] },
  "outcome": "flag.veilEnd"
});
