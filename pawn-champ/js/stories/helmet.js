// Pawn Champ - The Diver's Helmet: a copper helmet whose faceplate fogs from the inside.
// Minor quest m55, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Heard from Dory; Bertil Sousa sells it; a lunch errand on Pier Nine.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "helmet",
  "kind": "minor",
  "group": "deep",
  "title": "The Diver's Helmet",
  "location": "docks",
  "rumour": "A salvage diver came up early from the harbor mouth and has been selling his gear ever since.",
  "endings": { "returned": "Back in the Water", "decor": "Over the Bar", "listened": "Listening" },
  "about": [
    "A short uncanny story. Dory tells you that Bertil Sousa, a salvage diver, came up white after four minutes at the harbor mouth, sold his boat, and is selling his gear (§{doryHelmet}). He sells you his father's copper diving helmet, warning that the faceplate fogs from the inside in the mornings, as if someone were breathing in it (§{bertilHelmet}).",
    "On Pier Nine (§{helmetPier}) he tells you what he found below: no bottom, a carved wall going down, and a sound like a church full of people breathing in and not breathing out. Drop the helmet back in the water (Back in the Water), sell it to Ruthie for over the bar at the Rusty Anchor, where the regulars start sharing a dream (Over the Bar), or put it on and hear the sound yourself (a Look; Listening)."
  ],
  "cast": {
    "bertil": {
      "name": "Bertil Sousa",
      "look": { "skin": "#c89070", "hair": "#2a2a2a", "hs": 0, "coat": "#2a2a30", "style": "puffer", "pants": "#2a3a4a", "beard": "#2a2a2a", "hat": "beanie", "hatc": "#c84a2a" }
    }
  },
  "icons": {
    "helmet": [
      "....kkkk....",
      "..kkooookk..",
      ".koyyyyyyok.",
      ".koykkkkyok.",
      "koyk.BB.kyok",
      "koyk.Bb.kyok",
      "koyk....kyok",
      ".koykkkkyok.",
      ".kooyyyyook.",
      "kyyyyyyyyyyk",
      "kooooooooook",
      ".kkkkkkkkkk."
    ]
  },
  "uniques": {
    "diveHelmet": {
      "name": "Copper diving helmet",
      "icon": "helmet",
      "cat": "curio",
      "guide": 160,
      "questKey": true,
      "condLabel": "Fogged",
      "tells": [
        "A twelve-bolt copper diving helmet, dented, with three brass-framed portholes.",
        "Every morning the faceplate is fogged. From the inside."
      ]
    }
  },
  "soundings": { "helmet-listen": "Down at the Neck it is not quiet. There is a sound like a great many people breathing in, and not yet breathing out." },
  "overheard": [
    { "line": "Shaking his head: \"Bertil Sousa sold his boat. Bertil. He loved that boat more than his brother.\"" }
  ],
  "scenes": {
    "doryHelmet": {
      "title": "Dory: Bertil came up early",
      "customer": "dory",
      "steps": [
        {
          "say": "dory",
          "text": [
            "You know Bertil Sousa? Salvage diver. Went down at the harbor mouth to clear a fouled mooring for me last week.",
            "Four minutes and he was back up, white as a gull. Sold his boat Tuesday. Now he's selling his gear, piece by piece. He'll be in to you, I'd bet."
          ]
        },
        { "set": { "helmetHeard": true } },
        { "leave": "dory" }
      ]
    },
    "bertilHelmet": {
      "title": "Bertil sells the helmet",
      "customer": "bertil",
      "steps": [
        {
          "say": "bertil",
          "text": [
            "Bertil Sousa. Diving helmet. Real copper, twelve bolts, my father's. It works.",
            "You should know. The faceplate fogs up in the mornings. From inside. Like somebody's breathing in it."
          ]
        },
        { "offer": { "unique": "diveHelmet" }, "persona": "honest", "asking": 90, "min": 60 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "helmetBought": true } },
            { "say": "bertil", "text": "If you want to know what I saw, I'll be on Pier Nine at lunch, most days. I can't stop going down there to look at it." },
            { "plan": "helmet-pier" },
            { "toast": "Calendar: Pier Nine, at lunch", "look": "bertil" }
          ]
        },
        { "leave": "bertil" }
      ]
    },
    "helmetPier": {
      "title": "Bertil on the pier",
      "steps": [
        {
          "stage": "docks",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [60, 162] },
            { "id": "bertil", "cast": "bertil", "at": [90, 160], "facingLeft": true }
          ]
        },
        { "find": "h", "in": "stock", "match": { "uniqueId": "diveHelmet" } },
        {
          "say": "bertil",
          "text": [
            "Forty feet, the chart says. I went down sixty and there was no bottom. Just a wall, carved, going down. And the sound.",
            "Not loud. Like a church full of people breathing in. All together. And not breathing out."
          ]
        },
        {
          "if": "!h",
          "then": [
            { "say": "bertil", "text": "You sold it on. Good. Better somebody who doesn't know." },
            { "end": true }
          ]
        },
        { "say": "bertil", "text": "Ruthie Kroll wants the helmet for over the bar at the Anchor. A hundred and fifty. Or you could put it back where it came from. Or..." },
        {
          "choose": [
            {
              "label": "Drop it off the end of the pier",
              "hint": "(rep +2)",
              "then": [
                { "take": "h" },
                { "rep": 2 },
                { "set": { "helmetEnd": "returned" } },
                { "narrate": "It sinks fast, portholes down. Bertil watches the water close over it and lets out a breath he looks like he's been holding all week." }
              ]
            },
            {
              "label": "Sell it to Ruthie for the Rusty Anchor",
              "hint": "(+$150)",
              "then": [
                { "take": "h" },
                { "coin": 150, "why": "Sold the diving helmet to the Rusty Anchor" },
                { "set": { "helmetEnd": "decor" } },
                { "narrate": "Ruthie hangs it over the bar that night. By the weekend, the regulars are all having the same dream, and comparing notes." }
              ]
            },
            {
              "label": "Put it on, and listen",
              "hint": "(Look)",
              "then": [
                {
                  "narrate": [
                    "It's heavy and cold and smells of old brass. Bertil closes the faceplate. It fogs at once, though you're holding your breath.",
                    "And under the gulls and the traffic you hear it: very far down, a sound like a great many people breathing in together. Waiting to breathe out."
                  ]
                },
                { "sounding": "helmet-listen" },
                { "edit": "h", "set": { "questKey": false, "nosale": false, "condLabel": "Fogged, always" } },
                { "refresh": "panel" },
                { "set": { "helmetEnd": "listened" } },
                { "say": "bertil", "text": "You heard it. Good. I'm not mad. Keep the helmet. I'm done with it." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "helmet-dory", "from": "2-2", "to": "2-4", "cast": "dory", "scene": "doryHelmet" },
    { "drift": "helmet-bertil", "from": "2-5", "to": "3-4", "cast": "bertil", "scene": "bertilHelmet", "if": "flag.helmetHeard" }
  ],
  "errands": [
    {
      "id": "helmet-pier",
      "title": "Bertil on the pier",
      "where": "Pier Nine",
      "scene": "helmetPier",
      "test": [{ "set": { "helmetBought": true } }, { "add": { "unique": "diveHelmet" } }]
    }
  ],
  "calendar": [
    { "id": "helmet-pier", "errand": "helmet-pier", "story": "helmet", "where": "Pier Nine", "title": "Bertil on the pier", "known": "flag.helmetBought" }
  ],
  "mornings": [
    { "find": "h", "in": "stock", "match": { "uniqueId": "diveHelmet", "questKey": true } },
    {
      "if": "h && errand.helmet-pier == -1",
      "note": "skipped the errand: it's just stock now",
      "then": [{ "edit": "h", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "epilogue": [
    { "line": "The helmet over the bar at the Rusty Anchor fogs every night at closing. Ruthie wipes it down and pretends not to notice.", "if": "flag.helmetEnd == 'decor'" }
  ],
  "outcome": "flag.helmetEnd"
});
