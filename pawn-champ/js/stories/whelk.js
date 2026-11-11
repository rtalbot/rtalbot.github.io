// Pawn Champ - The Left-Handed Whelk: a shell that plays the shop an hour from now.
// Minor quest m53, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Heard from Dot; Wilhelmina Holm sells it; a lunch errand on the sandbar at low tide.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/whelk.js.
defineStory({
  "id": "whelk",
  "kind": "minor",
  "group": "deep",
  "title": "The Left-Handed Whelk",
  "location": "sandbar",
  "rumour": "A retired teacher has a shell that whispers.",
  "endings": { "returned": "Back to the Sand", "sold": "In a Collection", "listened": "An Hour Ahead" },
  "about": [
    "A short uncanny story. Dot tells you retired teacher Wilhelmina Holm has a shell she won't stop listening to (§{dotWhelk}). Wilhelmina sells it to you: the only left-handed whelk in ten thousand shells from the sandbar, and what you hear in it isn't the sea but your own shop an hour ahead (§{wilhelminaWhelk}). Each morning after, it gives you a snatch of the day to come.",
    "At the end of the sandbar at low water (§{whelkSandbar}) she shows you where she found it. Put it back in the sand (Back to the Sand), keep it to sell to the Cape Shell Club (In a Collection), or listen once more out there and hear much further ahead than you want; the next morning it hears the shop empty with the sea on the floor, and then falls silent (a Look; An Hour Ahead)."
  ],
  "cast": {
    "wilhelmina": {
      "name": "Wilhelmina Holm",
      "look": { "skin": "#f0d0b8", "hair": "#d8d8d8", "hs": 3, "coat": "#6a8a6a", "trim": "#e8e0c8", "style": "jacket", "long": true, "pants": "#4a4a3a", "glasses": "#4a3a2a", "bag": "#8a6a3a" }
    }
  },
  "icons": {
    "whelk": [
      "............",
      "......kk....",
      ".....kpPk...",
      "....kpPpk...",
      "...kPpPk....",
      "..kpPpPpk...",
      "..kPpkpPk...",
      "..kpPkPpk...",
      "...kpPpPk...",
      "....kpPpk...",
      ".....kkPk...",
      ".......kk..."
    ]
  },
  "uniques": {
    "whelk": {
      "name": "A left-handed whelk",
      "icon": "whelk",
      "cat": "curio",
      "guide": 40,
      "questKey": true,
      "condLabel": "Perfect",
      "wantedBy": { "name": "The Cape Shell Club", "mult": 2.25 },
      "wantedKnown": "flag.whelkFree",
      "tells": [
        "A whelk shell, cream and rust, the size of your fist. It coils to the left. Almost none do.",
        "Count the turns: eleven. A shell that size has room for six."
      ]
    }
  },
  "soundings": { "whelk-listen": "Time is shallower near the Neck. You can hear an hour ahead in a shell from the sandbar, and on some days you hear further than you want." },
  "overheard": [
    { "line": "Amused: \"Wilhelmina Holm held a shell to my ear and told me what I was going to order for lunch. She was right.\"" }
  ],
  "scenes": {
    "dotWhelk": {
      "title": "Dot: Wilhelmina's shell",
      "customer": "dot",
      "steps": [
        {
          "say": "dot",
          "text": [
            "Wilhelmina Holm. Taught half this town to spell. Collects shells off the sandbar.",
            "She's got one she won't stop listening to. Says it's not the sea you hear in it. She wants rid of it before she gets to like it too much. I said try the pawnshop."
          ]
        },
        { "set": { "whelkHeard": true } },
        { "leave": "dot" }
      ]
    },
    "wilhelminaWhelk": {
      "title": "Wilhelmina sells the whelk",
      "customer": "wilhelmina",
      "steps": [
        {
          "say": "wilhelmina",
          "text": [
            "Wilhelmina Holm. Dot sent me. I've found ten thousand shells on that sandbar. This is the only one that coils to the left.",
            "Hold it to your ear. Go on. That's not the sea. That's your shop. An hour from now. Somebody's about to come in and ask about a guitar."
          ]
        },
        { "offer": { "unique": "whelk" }, "persona": "honest", "asking": 30, "min": 20 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "whelkBought": true } },
            { "say": "wilhelmina", "text": "I found it at the end of the bar, at the lowest water. If you want to put it back, I'll show you where. I'm out there every lunchtime." },
            { "plan": "whelk-sandbar" },
            { "toast": "Calendar: the sandbar, at lunch", "look": "wilhelmina" }
          ]
        },
        { "leave": "wilhelmina" }
      ]
    },
    "whelkSandbar": {
      "title": "The lowest water",
      "steps": [
        {
          "stage": "sandbar",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 166] },
            { "id": "wilhelmina", "cast": "wilhelmina", "at": [210, 162], "facingLeft": true }
          ]
        },
        { "narrate": "Low water. Wilhelmina walks you out to the very end of the bar, where the sand goes grey and the harbor mouth is close enough to hear." },
        { "find": "shell", "in": "stock", "match": { "uniqueId": "whelk" } },
        {
          "if": "!shell",
          "then": [
            { "say": "wilhelmina", "text": "You've sold it. Well. Somebody's going to have a very well-informed afternoon." },
            { "end": true }
          ]
        },
        { "say": "wilhelmina", "text": "Here. In this hollow. There were a lot of them once, my mother said. All left-handed. Then they went back down." },
        {
          "choose": [
            {
              "label": "Put it back where she found it",
              "then": [
                { "take": "shell" },
                { "rep": 2 },
                { "set": { "whelkEnd": "returned" } },
                { "narrate": "You set it in the hollow. By the time you've walked back to the dunes, the tide has covered it. Wilhelmina doesn't look back once, and then does." }
              ]
            },
            {
              "label": "Keep it to sell",
              "hint": "(the Shell Club pays $90)",
              "then": [
                { "edit": "shell", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "set": { "whelkFree": true } },
                { "say": "wilhelmina", "text": "The Cape Shell Club will pay you ninety for it. They're all mad. You'll get on." }
              ]
            },
            {
              "label": "Hold it to your ear one more time, out here",
              "hint": "(Look)",
              "then": [
                { "narrate": "Out here it's louder. The shop an hour ahead, then a day, then a week: the till, the door, voices you don't know yet. Then much further, and you take it away from your ear." },
                { "sounding": "whelk-listen" },
                { "edit": "shell", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "set": { "whelkFree": true, "whelkEnd": "listened" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "whelk-dot", "from": "2-4", "to": "3-2", "cast": "dot", "scene": "dotWhelk" },
    { "drift": "whelk-wilhelmina", "from": "3-3", "to": "4-1", "cast": "wilhelmina", "scene": "wilhelminaWhelk", "if": "flag.whelkHeard" }
  ],
  "errands": [
    {
      "id": "whelk-sandbar",
      "title": "The lowest water",
      "where": "the sandbar",
      "scene": "whelkSandbar",
      "test": [{ "set": { "whelkBought": true } }, { "add": { "unique": "whelk" } }]
    }
  ],
  "calendar": [
    { "id": "whelk-sandbar", "errand": "whelk-sandbar", "story": "whelk", "where": "The sandbar", "title": "The lowest water", "known": "flag.whelkBought" }
  ],
  "mornings": [
    { "find": "shell", "in": "stock", "match": { "uniqueId": "whelk" } },
    {
      "if": "shell && flag.whelkEnd != 'returned'",
      "note": "while you hold it, the shell tells you who's coming",
      "then": [
        {
          "if": "flag.whelkEnd == 'listened' && !flag.whelkQuiet",
          "then": [
            { "set": { "whelkQuiet": true } },
            { "toast": "This morning you held the whelk to your ear and heard the shop, very far ahead: empty, the shelves bare, the door open, the sea on the floor. Then nothing. It's just a shell now.", "icon": "whelk" }
          ],
          "else": [
            {
              "toast": [
                "The whelk, this morning: a bell over the door, and someone saying \"is this the place?\".",
                "The whelk, this morning: coins on the counter, a lot of them.",
                "The whelk, this morning: someone laughing, then the door.",
                "The whelk, this morning: the scale's pan settling, slowly.",
                "The whelk, this morning: rain, though the sky is clear."
              ],
              "pick": "random",
              "icon": "whelk",
              "if": "!flag.whelkQuiet"
            }
          ]
        }
      ]
    },
    { "find": "kept", "in": "stock", "match": { "uniqueId": "whelk", "questKey": true } },
    {
      "if": "kept && errand.whelk-sandbar == -1",
      "note": "skipped the errand: it's just stock now",
      "then": [
        { "edit": "kept", "set": { "questKey": false, "nosale": false } },
        { "refresh": "panel" },
        { "set": { "whelkFree": true } }
      ]
    }
  ],
  "outcome": "flag.whelkEnd"
});
