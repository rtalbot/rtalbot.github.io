// Pawn Champ - The Big Man's Coat. Minor quest m47, batch H (docs/quests/MINOR.md#m47-the-big-mans-coat).
// The kids on Skip's bus route say a giant lives in Fort Abel. He's real: very tall, very shy, scarred,
// and he sews beautifully. He pawns a patchwork greatcoat to buy thread. The rumour turns into a
// search party with flashlights, and you can get to the fort first.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "bigcoat",
  "kind": "minor",
  "title": "The Big Man's Coat",
  "location": "fortabel",
  "rumour": "The kids say a giant lives in Fort Abel. Somebody's dad is getting up a search party.",
  "endings": { "tailor": "The Tailor of Fort Abel", "gone": "Gone by Morning", "hunted": "Flashlights" },
  "outcome": "flag.coatEnd",
  "about": [
    "A gentle story about a very big man. Torvald Brekke, the biggest person you've ever seen, pawns his patchwork coat to buy thread (§{anselCoat}). Then Skip says the kids are talking about a giant in Fort Abel, and a dad is getting up a search party with flashlights (§{coatRumour}).",
    "Go up early (§{coatFort}) and Torvald is in the old magazine, sewing mittens for the kids. Give him back his coat and walk down to meet the search party together; he ends up making coats for half the town (The Tailor of Fort Abel). Help him slip away (Gone by Morning). Or wave the flashlights over and he runs (Flashlights), which is also what happens if you let them look."
  ],
  "cast": {
    "torvald": {
      "name": "Torvald Brekke",
      "look": { "skin": "#d8b090", "hair": "#6a5a4a", "hs": 2, "coat": "#7a4a6a", "trim": "#3a6ab8", "style": "robe", "long": true, "pants": "#3a3a30", "beard": "#6a5a4a", "stout": true }
    }
  },
  "icons": {
    "greatcoat": [
      "...kkkkkk...",
      "..kRbkkGjk..",
      ".kRRbkkGjjk.",
      ".kpRbbGGjjk.",
      "kppkbbGGkjjk",
      "kppkWWyyk.kk",
      "kk.kWWyykk..",
      "...kAAccPk..",
      "...kAAccPk..",
      "...kVVrrBk..",
      "...kVVrrBk..",
      "...kkkkkkk.."
    ]
  },
  "uniques": {
    "bigCoat": {
      "name": "Patchwork greatcoat",
      "icon": "greatcoat",
      "cat": "curio",
      "guide": 160,
      "condLabel": "Hand-sewn",
      "wantedBy": { "name": "Torvald Brekke", "mult": 1 },
      "wantedKnown": "flag.coatMet",
      "tells": [
        "A greatcoat for a very big man, sewn from a hundred pieces: sailcloth, tweed, a flag, a sofa. The seams are perfect.",
        "Inside the collar, embroidered small: \"Made at the fort. A.B.\" Every stitch the same length."
      ]
    }
  },
  "scenes": {
    "anselCoat": {
      "title": "A very big man pawns his coat for thread",
      "customer": "torvald",
      "steps": [
        { "narrate": "Before you've finished turning the sign, the doorway goes dark. A man ducks under the frame, then ducks again. He is the biggest person you have ever seen, and he holds his hat in both hands." },
        {
          "say": "torvald",
          "text": [
            "Sorry. Early. Fewer people, early.",
            "I'd like to pawn my coat. For thread. Good thread is dear."
          ]
        },
        { "set": { "coatMet": true } },
        { "offer": { "unique": "bigCoat" }, "persona": "desperate", "asking": 30, "min": 20 },
        { "say": "torvald", "text": "Thank you. Please don't let anyone try it on. It won't fit them, and they'll laugh.", "if": "offer == 'deal'" },
        { "say": "torvald", "text": "That's all right. It's warm. I'll keep being warm.", "if": "offer == 'refused'" },
        { "leave": "torvald" }
      ]
    },
    "coatRumour": {
      "title": "Skip: a search party for the giant in Fort Abel",
      "customer": "skip",
      "steps": [
        {
          "say": "skip",
          "text": [
            "The kids on my route won't stop about the giant in Fort Abel. Two of them swear he waved. Waved!",
            "Now Gary Doyle's dad is getting up a search party. {placed:bigcoat-fort} night, flashlights, the lot. I'm driving the bus. Nobody asked me if I wanted to."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll go up early.\"",
              "then": [
                { "set": { "coatEarly": true } },
                { "toast": "Calendar: Fort Abel, before the flashlights", "look": "skip" }
              ]
            },
            { "label": "\"Let them look.\"", "then": [{ "set": { "coatSearch": true } }] }
          ]
        },
        { "leave": "skip" }
      ]
    },
    "coatFort": {
      "title": "Fort Abel, before the flashlights",
      "steps": [
        {
          "stage": "fortabel",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] }]
        },
        { "narrate": "Fort Abel after dark. The gun battery, the magazine with its iron door ajar, and lamplight inside. Down on the road, far off, a line of flashlights is coming up the hill." },
        { "enter": { "id": "torvald", "cast": "torvald", "at": [240, 160], "facingLeft": true } },
        { "narrate": "Inside the magazine: a cot, a stove, and fabric everywhere, folded by color. Torvald is sewing a child's coat by the lamp, very small in his very large hands." },
        { "say": "torvald", "text": "You came up. Nobody comes up. Except the kids. I made them mittens. Was that wrong?" },
        { "find": "coat", "in": "stock", "match": { "uniqueId": "bigCoat" } },
        {
          "choose": [
            {
              "label": "Give him back his coat, and walk down to meet them together",
              "hint": { "if": "!coat", "then": "(you don't have his coat)" },
              "disabled": "!coat",
              "then": [
                { "take": "coat" },
                {
                  "narrate": [
                    "He puts the coat on. In the lamplight it's a hundred colors. You walk down the hill together and meet twenty flashlights coming up.",
                    "Nobody says anything. Then Gary Doyle, aged eight, says \"Are those my mittens?\" and holds up his hands, and they are.",
                    "By the end of the week Bettany Lowe has ordered a coat, and so has half the PTA. Torvald takes their measurements on the bakery steps, as if they might break."
                  ]
                },
                { "rep": 5, "why": "Walked down the hill with Torvald Brekke" },
                { "set": { "coatEnd": "tailor" } }
              ]
            },
            {
              "label": "Help him pack, and get him out the back before they arrive",
              "then": [
                { "narrate": "He packs everything into one enormous bag in four minutes. At the back of the fort there's a drainage pipe to the shore. He has to go through it sideways." },
                { "say": "torvald", "text": "Thank you. If you see a very big coat for sale, anywhere on the coast, that's me. Saying hello." },
                { "edit": "coat", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "narrate": "The flashlights find a cold stove, an empty cot, and on it a pair of tiny mittens with a note: \"for the boy with the cold hands\"." },
                { "set": { "coatEnd": "gone" } }
              ]
            },
            {
              "label": "Wave the flashlights over",
              "then": [
                {
                  "narrate": [
                    "You wave. Twenty beams swing round and hit the magazine door at once. Torvald stands up into the light and puts his hands over his face. Somebody screams. He runs.",
                    "Nobody catches him. Nobody really tries. They take his sewing things home as souvenirs."
                  ]
                },
                { "rep": -4 },
                { "set": { "coatEnd": "hunted" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-2", "cast": "torvald", "scene": "anselCoat", "first": true },
    { "at": "2-4", "cast": "skip", "scene": "coatRumour", "if": "flag.coatMet" }
  ],
  "nights": [
    {
      "id": "bigcoat-fort",
      "window": ["3-1", "4-4"],
      "if": "flag.coatEarly",
      "scene": "coatFort",
      "test": [{ "set": { "coatEarly": true } }, { "add": { "unique": "bigCoat" } }]
    }
  ],
  "calendar": [
    { "id": "bigcoat-fort", "night": "bigcoat-fort", "story": "bigcoat", "where": "Fort Abel", "title": "Before the flashlights", "known": "flag.coatEarly", "scene": "coatFort" }
  ],
  "mornings": [
    {
      "if": "flag.coatSearch && !flag.coatEnd && week >= 4",
      "note": "nobody went up early: the search party finds the fort the week after",
      "then": [
        { "set": { "coatEnd": "hunted" } },
        { "toast": "The search party went up to Fort Abel last night. They found a stove, a cot and a lot of fabric. Whoever lived there ran.", "look": "skip" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Half of Hollow Neck wears a patchwork coat this winter. You can tell the children Torvald made for, because theirs have pockets inside the pockets.", "if": "flag.coatEnd == 'tailor'" },
    { "line": "A patchwork coat turned up in a pawnshop window in Gloucester, they say. Then in Portland. Somebody is saying hello, all the way up the coast.", "if": "flag.coatEnd == 'gone'" },
    { "line": "The kids still go up to Fort Abel. They leave thread on the magazine step. In the morning it's always gone.", "if": "flag.coatEnd == 'hunted'" }
  ]
});
