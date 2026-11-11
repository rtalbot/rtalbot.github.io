// Pawn Champ - The Cuckoo That Counts Down. Minor quest m7, batch E (docs/quests/MINOR.md).
// A cuckoo clock that calls the wrong hours is counting down to the spring tide. At zero, Water
// Street floods. Its scene is a lunch errand at Moss Clock Repair, with Agathe Moss, a town regular
// (js/town.js) who is in every run.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/cuckoo.js.
defineStory({
  "id": "cuckoo",
  "kind": "minor",
  "title": "The Cuckoo That Counts Down",
  "location": "clockshop",
  "rumour": "There's a cuckoo clock on Water Street that only goes off at the wrong time.",
  "endings": { "high": "High Water", "wet": "Wet Feet" },
  "outcome": "flag.cuckooEnd",
  "about": [
    "A short story about a clock that counts the wrong thing. Wes Garrity sells you his uncle's cuckoo clock, which cuckoos one fewer time each day, counting down (§{cuckooSeller}). Every morning it cuckoos the count.",
    "At Moss Clock Repair (§{cuckooMoss}) Agathe finds a ship's tide clock inside: it's counting to the year's highest spring tide, and Water Street's storm drain was never fixed. Spend the hour sandbagging with the neighbours (High Water), or take it home and wait, and the harbor comes in over your shop floor (Wet Feet), which is also what happens if you sold it."
  ],
  "cast": {
    "lyle": {
      "name": "Wes Garrity",
      "look": { "skin": "#e8c0a0", "hair": "#b86a3a", "hs": 0, "coat": "#5a6a3a", "style": "jacket", "trim": "#3a4a2a", "pants": "#3a3a30", "beard": "#b86a3a" }
    },
    "benji": {
      "name": "Benji, the apprentice",
      "look": { "skin": "#a87050", "hair": "#1a1210", "hs": 4, "coat": "#8a6a3a", "style": "tee", "apron": "#5a3a24", "pants": "#2a2a3a", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "cuckoo": [
      ".....kk.....",
      "...kkggkk...",
      "..kggggggk..",
      ".kkkkkkkkkk.",
      "..kWWWWWWk..",
      "..kWWccWWk..",
      "..kWcckcWk..",
      "..kWcckcWk..",
      "..kWWccWWk..",
      "..kkkkkkkk..",
      "....k..k....",
      "....y..y...."
    ]
  },
  "uniques": {
    "cuckoo": {
      "name": "The backwards cuckoo clock",
      "icon": "cuckoo",
      "cat": "curio",
      "guide": 55,
      "questKey": true,
      "tells": [
        "A carved Black Forest case, but the movement inside is a ship's tide clock.",
        "Someone has scratched a tide table inside the door, and circled one date."
      ]
    }
  },
  "scenes": {
    "cuckooSeller": {
      "title": "Wes Garrity's backwards cuckoo clock",
      "customer": "lyle",
      "steps": [
        {
          "say": "lyle",
          "text": [
            "Wes Garrity. My uncle left me a cuckoo clock, and half of Water Street has heard about it.",
            "It only goes off at the wrong time. Nine cuckoos at noon. Eight at one. Seven at two. Then it starts again the next day, one lower. It's counting backwards, and it's doing it at me.",
            "I'd like it out of my flat before it gets to zero."
          ]
        },
        { "offer": { "unique": "cuckoo" }, "persona": "desperate", "asking": 30, "min": 18 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "cuckoo": true } },
            { "say": "lyle", "text": "Thank you. If you want it looked at, Moss Clock Repair will open it up at lunchtime. Nobody else on the street will touch it." },
            { "plan": "cuckoo-moss" },
            { "toast": "Calendar: Moss Clock Repair, lunchtime {placed:cuckoo-moss}", "look": "lyle" }
          ],
          "else": [
            { "say": "lyle", "text": "Then it can count down in my wardrobe. I'll sleep at my sister's." }
          ]
        },
        { "leave": "lyle" }
      ]
    },
    "cuckooMoss": {
      "title": "The cuckoo clock opened up at Moss Clock Repair",
      "steps": [
        {
          "stage": "clockshopDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
            { "id": "agathe", "cast": "agathe", "at": [196, 152], "facingLeft": true }
          ]
        },
        { "narrate": "Moss Clock Repair at noon. Every clock in the place strikes twelve. The cuckoo clock in your arms cuckoos six." },
        { "find": "it", "in": "stock", "match": { "uniqueId": "cuckoo" } },
        {
          "if": "!it",
          "then": [
            { "say": "agathe", "text": "You sold it? Then I hope whoever bought it lives on high ground." },
            { "set": { "cuckooEnd": "wet", "cuckooSold": true } },
            { "end": true }
          ]
        },
        {
          "say": "agathe",
          "text": [
            "Let's have a look. That isn't a cuckoo movement. That's a tide clock from a ship, somebody's squeezed it into a cuckoo case.",
            "And it counts tides, not hours. The spring tide comes in tomorrow night, the highest of the year, and the storm drain on Water Street was never fixed.",
            "Whoever built this knew the street would flood. They built it a warning."
          ]
        },
        {
          "choose": [
            {
              "label": "Spend the hour sandbagging Water Street",
              "hint": "(+4 reputation)",
              "then": [
                { "set": { "cuckooEnd": "high" } },
                { "rep": 4, "why": "Sandbagged Water Street before the spring tide" },
                { "narrate": "You, the clock shop and three neighbors fill sandbags until your arms give out. The next night the tide comes up Water Street, sniffs at the sandbags, and goes home." },
                { "say": "agathe", "text": "I've reset it to tell the time. It still cuckoos at the spring tides. I left that in. It earned it." },
                {
                  "edit": "it",
                  "set": {
                    "guide": 70,
                    "tells": ["A tide clock in a cuckoo case. It cuckoos at the spring tides."],
                    "questKey": false,
                    "nosale": false
                  }
                },
                { "refresh": "panel" }
              ]
            },
            {
              "label": "Take it back and set it on your counter. See what happens.",
              "then": [
                { "set": { "cuckooEnd": "wet" } },
                { "hook": "floodIn", "with": 1 },
                { "say": "agathe", "text": "Suit yourself. Put your stock up high." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "at": "2-2", "cast": "lyle", "scene": "cuckooSeller" }],
  "errands": [
    {
      "id": "cuckoo-moss",
      "title": "The cuckoo clock opened up",
      "where": "Moss Clock Repair",
      "scene": "cuckooMoss",
      "test": [{ "add": { "unique": "cuckoo" } }, { "set": { "cuckoo": true } }]
    }
  ],
  "calendar": [
    { "id": "cuckoo-moss", "errand": "cuckoo-moss", "story": "cuckoo", "where": "Moss Clock Repair", "title": "The cuckoo clock", "known": "flag.cuckoo" }
  ],
  "mornings": [
    { "find": "it", "in": "stock", "match": { "uniqueId": "cuckoo" } },
    {
      "if": "flag.cuckoo && !flag.cuckooEnd && it",
      "note": "it counts down; at zero nobody looked at it in time",
      "then": [
        { "hook": "countDown" },
        { "toast": "At opening, the cuckoo clock cuckoos {flag.cuckooCount} times. It is nine in the morning.", "icon": "cuckoo", "if": "flag.cuckooCount > 0" },
        {
          "if": "flag.cuckooCount <= 0",
          "then": [{ "set": { "cuckooEnd": "wet" } }, { "hook": "floodIn", "with": -1 }]
        }
      ]
    },
    {
      "if": "hook.flooded",
      "note": "Wet Feet: the night of the spring tide, your floor floods",
      "then": [
        { "set": { "cuckooFlood": 0 } },
        { "narrate": "You open up to an inch of harbor on the shop floor. The cuckoo clock on the counter is perfectly dry. It cuckoos once, smugly, and stops for good." },
        { "hook": "floodDamage", "with": "Flood damage from the spring tide" },
        { "find": "it", "in": "stock", "match": { "uniqueId": "cuckoo" } },
        { "edit": "it", "set": { "guide": 40, "questKey": false, "nosale": false } },
        { "refresh": "panel" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Water Street stayed dry at the spring tide. There's a sandbag on a plinth outside the clock shop now.", "if": "flag.cuckooEnd == 'high'" },
    { "line": "The Crooked Scale's floorboards still smell of harbor.", "if": "flag.cuckooEnd == 'wet'" }
  ]
});
