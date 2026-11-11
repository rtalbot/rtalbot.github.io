// Pawn Champ - The Selectman's Teeth. Minor quest m35, batch I (docs/quests/MINOR.md#m35-the-selectmans-teeth).
// Selectman Harlan Plover was buried in June without his silver-mounted false teeth. His widow has
// asked the Select Board for them at every meeting since. The Town Hall custodian knows where they were.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/teeth.js.
defineStory({
  "id": "teeth",
  "kind": "minor",
  "title": "The Selectman's Teeth",
  "location": "townhall",
  "rumour": "Selectman Plover was buried without his teeth, and his widow asks the Select Board for them at every meeting.",
  "endings": { "returned": "Laid to Rest", "museum": "The Selectman's Smile", "spare": "Spare Parts" },
  "about": [
    "A comic story with a kind heart. Lonnie Dube, Town Hall's janitor for thirty-one years, found the late Selectman Plover's silver-mounted dentures in the drawer of the board table, where he always put them during long meetings (§{teethLonnie}). His widow Mabel asks the Select Board for them at every meeting, and Lonnie can't bring himself to hand them over at public comment, so he sells them to you.",
    "At the board meeting (§{teethMeeting}) stand up and hand Mrs. Plover the teeth, and the board votes unanimously to bury them with her husband (Laid to Rest), or keep your seat. Before that, Dr. Ingrid Sato of the Dental Museum of Cape Cod (her garage) offers $120 for the plate (§{teethIngrid}; The Selectman's Smile). Sold to anyone else, they become Spare Parts."
  ],
  "cast": {
    "lonnie": {
      "name": "Lonnie Dube",
      "look": { "skin": "#e0b090", "hair": "#5a4a3a", "hs": 0, "coat": "#5a6a7a", "style": "jacket", "trim": "#3a4a5a", "pants": "#3a4a5a", "hat": "cap", "hatc": "#3a4a5a", "moustache": "#5a4a3a" }
    },
    "mabel": {
      "name": "Mabel Plover",
      "look": { "skin": "#f0d0b8", "hair": "#e8e8f0", "hs": 3, "coat": "#2a2a3a", "style": "dress", "pants": "#2a2a3a", "bag": "#5a3a5a", "glasses": "#2a2a2e" }
    },
    "ingrid": {
      "name": "Dr. Ingrid Sato",
      "look": { "skin": "#f0d0b0", "hair": "#2a2420", "hs": 2, "coat": "#e8f0f0", "style": "jacket", "long": true, "pants": "#4a5a6a", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "dentures": [
      "............",
      "............",
      "..kkkkkkkk..",
      ".kRRRRRRRRk.",
      "kRcccccccRRk",
      "kRkckckckcRk",
      "kRcccccccRRk",
      ".kSSSSSSSSk.",
      ".kssssssssk.",
      "..kkkkkkkk..",
      "............",
      "............"
    ]
  },
  "uniques": {
    "ploverTeeth": {
      "name": "Selectman Plover's silver-mounted dentures",
      "icon": "dentures",
      "cat": "silver",
      "guide": 50,
      "condLabel": "Polished",
      "tells": [
        "A full upper plate on a silver mount. Hallmarked. Engraved on the inside: H.P. 1962.",
        "They are very, very clean."
      ],
      "wantedBy": { "name": "Mabel Plover", "mult": 2 },
      "wantedKnown": "flag.teethIn"
    }
  },
  "overheard": [
    { "line": "Whispering: \"Selectman Plover was buried without his teeth. His widow brings it up at every single meeting. Marguerite's started timing her.\"" }
  ],
  "scenes": {
    "teethLonnie": {
      "title": "Lonnie Dube found the selectman's teeth",
      "customer": "lonnie",
      "steps": [
        {
          "say": "lonnie",
          "text": [
            "Lonnie Dube. I do the floors at Town Hall. Thirty-one years.",
            "Selectman Plover used to take his teeth out at long meetings and put them in the drawer of the big table. Every meeting was long. He was buried in June, and nobody looked in the drawer but me.",
            "Mrs. Plover asks the board for them at every meeting. The board doesn't know. I know. And I can't walk up to a widow at public comment and hand her her husband's teeth. Can I? No."
          ]
        },
        { "offer": { "unique": "ploverTeeth" }, "persona": "honest", "asking": 25, "min": 15 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "lonnie", "text": "Back in the drawer, then. They've been fine in the drawer." },
            { "leave": "lonnie" },
            { "end": true }
          ]
        },
        { "set": { "teethIn": true } },
        { "say": "lonnie", "text": "The board meets {placed:teeth-meeting} night. She'll be there. She's always there. Third row, aisle seat." },
        { "toast": "Calendar: the Select Board, {placed:teeth-meeting} night", "look": "lonnie" },
        { "leave": "lonnie" }
      ]
    },
    "teethIngrid": {
      "title": "The Dental Museum of Cape Cod",
      "customer": "ingrid",
      "steps": [
        { "find": "teeth", "in": "stock", "match": { "uniqueId": "ploverTeeth" } },
        { "say": "ingrid", "text": "Dr. Ingrid Sato, orthodontist, retired. I run the Dental Museum of Cape Cod. It's my garage. It's a very good garage." },
        {
          "if": "!teeth",
          "then": [
            { "say": "ingrid", "text": "I heard you had the Plover plate. No? A pity. 1962. Sterling. You don't see sterling." },
            { "leave": "ingrid" },
            { "end": true }
          ]
        },
        { "say": "ingrid", "text": "I hear you have the Plover plate. 1962, sterling mount, hand-fitted in Boston. I'll give you a hundred and twenty. It would have its own case. With a light." },
        { "view": { "counterIcon": "dentures" } },
        {
          "choose": [{ "label": "Sell them to her ($120)" }, { "label": "They belong to Mrs. Plover" }],
          "as": "sell"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "sell == 0",
          "then": [
            { "set": { "teethEnd": "museum" } },
            { "sell": "teeth", "to": "ingrid" },
            { "coin": 120, "why": "Sold Selectman Plover's teeth to the Dental Museum of Cape Cod" },
            { "refresh": "panel" },
            { "say": "ingrid", "text": "Wonderful. Open Saturdays. Bring a friend. Bring a friend with an overbite." }
          ],
          "else": [{ "say": "ingrid", "text": "Of course. Sentiment. It's why I'm in dentistry." }]
        },
        { "leave": "ingrid" }
      ]
    },
    "teethMeeting": {
      "title": "The Select Board: public comment",
      "steps": [
        {
          "stage": "townhall",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [92, 170] },
            { "id": "marguerite", "cast": "marguerite", "at": [236, 156], "facingLeft": true },
            { "id": "mabel", "cast": "mabel", "at": [150, 166] },
            { "id": "townsfolk", "look": "random", "at": [[40, 166], [120, 170], [190, 166]] }
          ]
        },
        { "narrate": "The Select Board, upstairs at Town Hall. Item 14: the culvert on Pond Road. Item 15: public comment. Everybody knows what public comment is going to be." },
        { "say": "marguerite", "text": "Public comment. Mrs. Plover. Again. Welcome." },
        { "say": "mabel", "text": "Thank you, Marguerite. I'm here about my husband's teeth. He served this town for thirty years and he went into the ground without his smile. I'd like it back." },
        { "find": "teeth", "in": "stock", "match": { "uniqueId": "ploverTeeth" } },
        {
          "if": "!teeth",
          "then": [
            { "narrate": "The board looks at its papers. You look at yours. The culvert gets more discussion than it deserves." },
            { "set": { "teethEnd": "spare" }, "if": "!flag.teethEnd" },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Stand up and hand her the teeth",
              "then": [
                { "set": { "teethEnd": "returned" } },
                { "take": "teeth" },
                { "refresh": "panel" },
                { "narrate": "You walk up the aisle in total silence and put a small velvet bag in Mabel Plover's hands. She opens it. She closes it." },
                { "say": "mabel", "text": "Harlan. Oh, you old fool. They were in the drawer, weren't they? He always said the meetings ran long." },
                { "say": "marguerite", "text": "The chair will entertain a motion to let Mrs. Plover inter the teeth with her husband at the Old Burying Ground at the town's expense." },
                { "narrate": "It passes five to nothing, the only unanimous vote anyone can remember. Lonnie Dube, mopping at the back, has to go and stand in the corridor." },
                { "rep": 4, "why": "Gave Selectman Plover back his smile" },
                { "hook": "mabelPays", "with": "Mabel Plover insisted on paying", "note": "Twice the guide price." }
              ]
            },
            {
              "label": "Keep your seat",
              "then": [
                { "narrate": "You keep your seat. Mrs. Plover sits down. The board moves on to the culvert, which gets more discussion than it deserves." },
                { "set": { "teethQuiet": true } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-4", "cast": "lonnie", "scene": "teethLonnie" },
    { "at": "3-2", "cast": "ingrid", "scene": "teethIngrid", "if": "flag.teethIn && !flag.teethEnd" }
  ],
  "nights": [
    {
      "id": "teeth-meeting",
      "window": ["3-1", "4-2"],
      "if": "flag.teethIn && !flag.teethEnd",
      "scene": "teethMeeting",
      "test": [{ "set": { "teethIn": true } }, { "add": { "unique": "ploverTeeth" }, "if": "random < 0.8" }]
    }
  ],
  "calendar": [
    { "id": "teeth-meeting", "night": "teeth-meeting", "story": "teeth", "where": "Town Hall", "title": "The Select Board: public comment", "known": "flag.teethIn", "scene": "teethMeeting" }
  ],
  "sold": { "ploverTeeth": [{ "set": { "teethEnd": "spare" }, "if": "!flag.teethEnd" }] },
  "epilogue": [
    { "line": "Selectman Harlan Plover rests in the Old Burying Ground with his smile. Mabel still comes to public comment. Now she talks about the culvert.", "if": "flag.teethEnd == 'returned'" },
    { "line": "The Plover plate has its own lit case at the Dental Museum of Cape Cod, open Saturdays, in a garage.", "if": "flag.teethEnd == 'museum'" },
    { "line": "Somewhere, somebody is eating corn on the cob with a former selectman's teeth. Mabel Plover still asks the board every month.", "if": "flag.teethEnd == 'spare'" }
  ],
  "outcome": "flag.teethEnd"
});
