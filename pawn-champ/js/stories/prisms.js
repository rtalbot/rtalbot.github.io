// Pawn Champ - The Lighthouse Prisms. Minor quest m26, batch J (docs/quests/MINOR.md).
// Heard from Tess. Linus Hatch, the last keeper's grandson, sells three prisms from the Gull Point
// lens; Dory and Skip each turn up one more. A lunch errand at Gull Point by day, where the old brass
// frame is waiting: all five make a lamp that throws the light's old blue.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/prisms.js,
// which also draws Gull Point by day.
defineStory({
  "id": "prisms",
  "kind": "minor",
  "title": "The Lighthouse Prisms",
  "location": "lighthouse",
  "rumour": "The last keeper of Gull Point took five prisms home the night they shut the light.",
  "endings": { "lamp": "The Old Blue", "society": "Sold to the Society", "window": "In Your Window" },
  "about": [
    "A collecting story. Tess tells you the old Gull Point lens frame is being sold and is five prisms short, because keeper Eben Hatch took them home in his coat the night the light was automated in 1994 (§{tessPrisms}). His grandson Linus sells you three he found in a sock (§{linusPrisms}). Then Dory's dredge brings up a fourth (§{doryPrism}), and Skip has the fifth in lost property, left on his bus in 1995 (§{skipPrism}).",
    "Once you have all five, or at least three by week 3, Linus invites you to Gull Point (§{prismsPoint}). With all five, build the lamp and put it back in the lighthouse so the light blinks blue again (The Old Blue), or buy the frame and put the lamp in your window (In Your Window). With any number, sell them to the Historical Society (Sold to the Society)."
  ],
  "notes": "The three from Linus count as three prisms; Dory's and Skip's make five.",
  "cast": {
    "linus": {
      "name": "Linus Hatch",
      "look": { "skin": "#e0b898", "hair": "#c87a3a", "hs": 1, "coat": "#2a4a6a", "style": "puffer", "pants": "#4a4a3a", "beard": "#c87a3a", "hat": "beanie", "hatc": "#e8e0c8" }
    }
  },
  "icons": {
    "prism": [
      "............",
      ".....kk.....",
      "....kBBk....",
      "....kSBk....",
      "...kBSBBk...",
      "...kSBBSk...",
      "..kBBSBBBk..",
      "..kSBBBSBk..",
      ".kBBBSBBBBk.",
      ".kkkkkkkkkk.",
      "............",
      "............"
    ]
  },
  "uniques": {
    "prismTrio": {
      "name": "Three lighthouse prisms",
      "icon": "prism",
      "cat": "curio",
      "guide": 180,
      "set": "Lighthouse prisms",
      "condLabel": "Chipped at the edges",
      "tells": [
        "Three curved bars of heavy glass from a Fresnel lens, each the length of your forearm.",
        "In the sun they throw a faint blue. Most lighthouse glass throws white."
      ]
    },
    "prismDory": {
      "name": "Lighthouse prism (from the dredge)",
      "icon": "prism",
      "cat": "curio",
      "guide": 60,
      "set": "Lighthouse prisms",
      "condLabel": "Sea-frosted",
      "tells": ["One more prism from the Gull Point lens, frosted by thirty years on the bottom."]
    },
    "prismSkip": {
      "name": "Lighthouse prism (lost property)",
      "icon": "prism",
      "cat": "curio",
      "guide": 60,
      "set": "Lighthouse prisms",
      "condLabel": "Sticker on it",
      "tells": ["A prism from the Gull Point lens, with a school-bus lost-property sticker on it."]
    },
    "blueLamp": {
      "name": "The Gull Point lamp",
      "icon": "prism",
      "cat": "art",
      "guide": 420,
      "condLabel": "Rebuilt",
      "tells": [
        "Five prisms in the keeper's brass frame, with a bulb in the middle.",
        "Lit, it throws a ring of blue light that you can see from the end of Water Street."
      ]
    }
  },
  "overheard": [
    { "line": "\"Gull Point used to be blue. The light. You could tell it from every other light on the coast.\"" }
  ],
  "scenes": {
    "tessPrisms": {
      "title": "Tess on the Gull Point lens",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "They're finally selling the old lens frame from Gull Point. Coast Guard surplus. It's five prisms short, and it has been since 1994.",
            "Eben Hatch kept that light thirty years. The night they automated it, he took five prisms home in his coat. Everybody knew. Nobody said.",
            "Eben's gone now. His grandson Linus is clearing the house. If anything in a coat pocket comes your way, you'll know what it is."
          ]
        },
        { "set": { "prismsHeard": true } },
        { "leave": "tess" }
      ]
    },
    "linusPrisms": {
      "title": "Linus Hatch brings three prisms",
      "customer": "linus",
      "steps": [
        { "say": "linus", "text": "Linus Hatch. I'm clearing my grandfather's house, and these were in a sock. In a drawer. In a coat." },
        { "view": { "counterIcon": "prism" } },
        { "say": "linus", "text": "Three prisms from the old Gull Point lens. There were five, he always said. I've turned the house over twice." },
        { "offer": { "unique": "prismTrio" }, "persona": "honest", "asking": 120, "min": 90 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "prismsBought": true } },
            { "say": "linus", "text": "I bought the old brass frame off the Coast Guard, for sentiment. I'm out at the point at lunch, most days, cleaning it up. If the other two ever turn up, come and see." }
          ]
        },
        { "leave": "linus" }
      ]
    },
    "doryPrism": {
      "title": "Dory's dredge brings up a prism",
      "customer": "dory",
      "steps": [
        { "say": "dory", "text": "The dredge brought this up off Gull Point. Glass, heavy as a brick, curved. Tess says it's from the old lens. Twenty-five and it's yours." },
        { "offer": { "unique": "prismDory" }, "persona": "honest", "asking": 25, "min": 20 },
        { "leave": "dory" }
      ]
    },
    "skipPrism": {
      "title": "Skip's lost property",
      "customer": "skip",
      "steps": [
        {
          "say": "skip",
          "text": [
            "Lost property off the bus. A kid brought it in for show-and-tell in 1995 and never took it home again. I've been driving it around for thirty years.",
            "Tess says it belongs with the others. Give the bus fund thirty and it's yours."
          ]
        },
        { "offer": { "unique": "prismSkip" }, "persona": "honest", "asking": 30, "min": 25 },
        { "leave": "skip" }
      ]
    },
    "prismsPoint": {
      "title": "The lens frame at Gull Point",
      "steps": [
        {
          "stage": "gullpointDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [196, 122] },
            { "id": "linus", "cast": "linus", "at": [226, 118], "facingLeft": true }
          ]
        },
        { "hook": "countPrisms", "sets": ["n"] },
        { "narrate": "Gull Point at noon. Wind, gulls, the tower's red and white bands bright in the sun. Linus has the old brass frame on a workbench by the keeper's cottage, every rivet polished." },
        {
          "if": "n == 0",
          "then": [
            { "say": "linus", "text": "You sold them on? Well. They had a good run." },
            { "set": { "prismsEnd": null } },
            { "end": true }
          ]
        },
        {
          "say": "linus",
          "text": { "if": "n >= 5", "then": "All five. You found all five. He'd have cried. He did cry, about most things.", "else": "You've got {n}. It'll stand with {n}. It won't be right." }
        },
        { "say": "linus", "text": "The Historical Society would take them as they are, for the case by the door. Or we can put them in the frame." },
        {
          "choose": [
            {
              "label": "Build the lamp, and give it to the lighthouse",
              "hint": "(rep +4)",
              "if": "n >= 5",
              "then": [
                { "hook": "clearPrisms" },
                {
                  "narrate": [
                    "The five prisms go into the frame like teeth into a jaw. Linus runs a cable from the cottage and puts in a bulb. Even at noon, the ring of light it throws on the grass is blue.",
                    "He carries it up the tower himself. That night the whole town comes down to the front to watch Gull Point blink blue, for the first time since 1994."
                  ]
                },
                { "rep": 4, "why": "Gull Point is blue again" },
                { "set": { "prismsEnd": "lamp" } }
              ]
            },
            {
              "label": "Sell them to the Historical Society",
              "hint": "(+{hook:societyPrice})",
              "then": [
                { "hook": "clearPrisms" },
                { "hook": "paySociety", "with": "Sold the Gull Point prisms to the Historical Society", "note": "$300 for all five, otherwise $50 a prism." },
                { "say": "linus", "text": "Fair enough. People ought to see them. Even if they're just sitting there, being glass." },
                { "set": { "prismsEnd": "society" } }
              ]
            },
            {
              "label": "Build the lamp, and buy the frame for your window",
              "hint": "(-$60)",
              "if": "n >= 5",
              "disabled": "coin < 60",
              "then": [
                { "hook": "clearPrisms" },
                { "coin": -60, "why": "Bought the Gull Point lamp frame from Linus Hatch" },
                { "add": { "unique": "blueLamp" } },
                { "narrate": "You build it together on the bench, and carry it home in the back of his truck. In your window that night it throws a ring of blue across Water Street, and people stop to stand in it." },
                { "set": { "prismsEnd": "window" } }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "drift": "prisms-tess", "from": "1-2", "to": "1-4", "cast": "tess", "scene": "tessPrisms" },
    { "drift": "prisms-linus", "from": "1-5", "to": "2-2", "cast": "linus", "scene": "linusPrisms", "if": "flag.prismsHeard" },
    { "drift": "prisms-dory", "from": "2-2", "to": "2-5", "cast": "dory", "scene": "doryPrism", "if": "flag.prismsBought" },
    { "drift": "prisms-skip", "from": "2-4", "to": "3-2", "cast": "skip", "scene": "skipPrism", "if": "flag.prismsBought" }
  ],
  "errands": [
    {
      "id": "prisms-point",
      "title": "The lens frame",
      "where": "Gull Point",
      "scene": "prismsPoint",
      "test": [
        { "set": { "prismsBought": true } },
        { "hook": "testCoin" },
        { "add": { "unique": "prismTrio" } },
        { "add": { "unique": "prismDory" } },
        { "add": { "unique": "prismSkip" } }
      ]
    }
  ],
  "calendar": [
    { "id": "prisms-point", "errand": "prisms-point", "story": "prisms", "where": "Gull Point", "title": "The lens frame", "known": "flag.prismsPlanned" }
  ],
  "mornings": [
    {
      "if": "flag.prismsBought && !flag.prismsPlanned && (hook.prismCount >= 5 || (week >= 3 && hook.prismCount >= 3))",
      "note": "Once the trio's in, Linus is at the point: the errand comes up in week 3, or as soon as you have all five.",
      "then": [
        { "set": { "prismsPlanned": true } },
        { "plan": "prisms-point" },
        {
          "toast": { "if": "hook.prismCount >= 5", "then": "All five prisms. Linus will be out at Gull Point at lunch.", "else": "Linus Hatch left word: he's at Gull Point at lunch, with the frame." },
          "look": "linus",
          "icon": "prism"
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "Gull Point blinks blue again. The fishermen say they can tell it from every other light on the coast, and that it feels like being let in.", "if": "flag.prismsEnd == 'lamp'" },
    { "line": "The Gull Point prisms sit in a case by the door of the Historical Society. On sunny mornings the floor in front of them goes blue.", "if": "flag.prismsEnd == 'society'" },
    { "line": "The Gull Point lamp throws a blue ring across Water Street every night. Couples stand in it. The cat sleeps in it.", "if": "flag.prismsEnd == 'window'" }
  ],
  "outcome": "flag.prismsEnd"
});
