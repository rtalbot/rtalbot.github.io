// Pawn Champ - The Dog Who Became a Man. Minor quest m52, batch K (docs/quests/MINOR.md).
// A cheerful man named Rufus pawns his own dog collar. He was a dog first. On the full moon he's a
// dog again, and he likes it better. Its scene is the full-moon night (Thursday of week 4, the same
// moon as M4's Howling) on Harbor Green, in a variant drawn here:
//   greenMoon - Harbor Green at night under a big full moon (from greenNight in js/places/green.js)
// Crossing with M4 The Grey Psalter: if the Pack is in the run, Bettany thinks Rufus is a sign, and on
// the night he can go to them. It only reads M4's flags.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/rufus.js.
defineStory({
  "id": "rufus",
  "kind": "minor",
  "title": "The Dog Who Became a Man",
  "location": "greenMoon",
  "rumour": "Hal Mayhew hired a new stock boy who fetches things before you've finished asking.",
  "endings": { "good": "Good Boy", "man": "Back by Dawn", "pack": "Leader of the Pack" },
  "outcome": "flag.rufusEnd",
  "about": [
    "A gentle uncanny comedy. Rufus, Hal's eager new stock boy, was a dog until one spring and turns back into one at every full moon, and he likes being a dog better. He pawns his old collar for $5, hoping that without it he won't go back (§{rufusPawns}). Then Hal comes in to say he'll make Rufus full-time if he stays (§{rufusAsked}). If the Grey Psalter's Pack is in the run, Bettany comes instead, sure Rufus is their sign, and offers $40 for the collar.",
    "On the full moon on Harbor Green (§{rufusMoon}) a big shaggy dog sits next to a folded set of clothes and looks at your pocket. Put the collar on him and he stays a dog, asleep across the hardware store doorway (Good Boy), wait with him till dawn so he's a man again for his full-time job (Back by Dawn), or, with the Pack about, let him run off to the howling (Leader of the Pack)."
  ],
  "notes": "Crossing with M4 The Grey Psalter: if the Pack is in the run (hook.pack), Bettany thinks Rufus is a sign, and on the night he can go to them. It only reads M4's flags.",
  "cast": {
    "rufus": {
      "name": "Rufus",
      "look": { "skin": "#e0b090", "hair": "#b08850", "hs": 4, "coat": "#c8a050", "style": "tee", "pants": "#3a4a6a", "beard": "#b08850" }
    }
  },
  "icons": {
    "rufustag": [
      "............",
      "...kkkkkk...",
      "..kbbbbbbk..",
      ".kbk....kbk.",
      ".kb......bk.",
      ".kb......bk.",
      ".kbk....kbk.",
      "..kbbbbbbk..",
      "...kkyykk...",
      "...kyYYyk...",
      "...kyyyyk...",
      "....kkkk...."
    ]
  },
  "uniques": {
    "rufusCollar": {
      "name": "Rufus's dog collar",
      "icon": "rufustag",
      "cat": "curio",
      "guide": 5,
      "questKey": true,
      "tells": [
        "Blue nylon, chewed at one end. The tag says RUFUS. IF FOUND, RETURN TO RUFUS.",
        "It's sized for a big dog. A very big dog. It's also been let out, twice, by hand."
      ]
    }
  },
  "scenes": {
    "rufusPawns": {
      "title": "Rufus pawns his own dog collar",
      "customer": "rufus",
      "steps": [
        {
          "say": "rufus",
          "text": [
            "Hi! Hi. I'm Rufus. I'm the new stock boy at Mayhew's Hardware. I fetch things before Hal's finished asking. He says it's uncanny. It isn't, it's just fetching.",
            "Can I pawn this? It's my collar. From before. I was a dog first, you see, and then one spring I was a man, and I've been trying very hard at it.",
            "Except on the full moon. On the full moon I'm a dog again. And I like it better. So I thought, if I didn't have the collar, I might not go back. Five dollars? For a sandwich."
          ]
        },
        { "offer": { "unique": "rufusCollar" }, "persona": "honest", "asking": 5, "min": 3 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "rufusPawned": true } },
            { "say": "rufus", "text": "The full moon's Thursday week, on the Green. If I come in asking for it, don't give it to me. Probably. I don't know." }
          ],
          "else": [
            { "say": "rufus", "text": "That's okay! I'll keep it. I'm good at keeping things. I bury them." }
          ]
        },
        { "leave": "rufus" }
      ]
    },
    "rufusAsked": {
      "title": "Week 4: Hal wants him to stay, or the Pack want him to come",
      "customer": "visitor",
      "steps": [
        {
          "if": "hook.pack",
          "then": [
            {
              "say": "visitor",
              "text": [
                "Bettany, from the bakery. This is Pack business, so. Quietly. There's a man in town who turns into a dog on the full moon. Brother Desmond says that's a sign. THE sign.",
                "We'd like his collar for the Moon Table. Forty dollars. He can come too, obviously. He'd love it. Everybody howls."
              ]
            },
            { "set": { "rufusSign": true } },
            { "find": "it", "in": "stock", "match": { "uniqueId": "rufusCollar" } },
            {
              "choose": [
                {
                  "label": "Sell her the collar (+$40)",
                  "then": [
                    { "sell": "it" },
                    { "coin": 40, "why": "Sold Rufus's collar to the Pack" },
                    { "say": "visitor", "text": "AWOO. Sorry. We're practising." }
                  ]
                },
                { "label": "\"It's his. He can decide on the night.\"" }
              ],
              "if": "it"
            }
          ],
          "else": [
            {
              "say": "visitor",
              "text": [
                "Hal Mayhew. My stock boy Rufus. Best I've ever had. Shelves the screws by size, and I never taught him. He's asked for Thursday night off. Full moon, he says, like that explains it.",
                "He says you've got something of his. If he stays on, I'll make him full-time. Just so you know what's riding on it."
              ]
            }
          ]
        },
        { "set": { "rufusMoon": true } },
        { "toast": "Calendar: the full moon on Harbor Green, Thursday night", "look": "visitor" },
        { "leave": "visitor" }
      ]
    },
    "rufusMoon": {
      "title": "Full moon on Harbor Green",
      "steps": [
        { "hook": "dog", "with": { "dog": true, "collar": false, "x": 300 } },
        {
          "stage": "greenMoon",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] }]
        },
        { "narrate": "Full moon over Harbor Green. On the bench by the memorial: a man's shirt and trousers, folded, and a pair of shoes side by side. Sitting next to them, very upright, a big shaggy dog." },
        { "narrate": "Out across the harbor, on Hob's Marsh, the Pack is howling, slightly out of time. The dog's ears go up.", "if": "hook.pack" },
        { "narrate": "He sees you. He does not bark. He comes over and sits on your foot, and looks at your pocket, where the collar is." },
        { "find": "it", "in": "stock", "match": { "uniqueId": "rufusCollar" } },
        {
          "choose": [
            {
              "label": { "if": "it", "then": "Put the collar on him", "else": "(You don't have the collar)" },
              "then": [
                {
                  "if": "it",
                  "then": [
                    { "set": { "rufusEnd": "good" } },
                    { "hook": "dog", "with": { "collar": true } },
                    { "take": "it" },
                    {
                      "narrate": [
                        "The tag jingles. He shakes himself from nose to tail, the whole dog, and then he runs three laps of the Green flat out for the sheer joy of it, and comes back, and sits on your foot again.",
                        "In the morning the clothes are still folded on the bench. Hal Mayhew puts a sign up for a stock boy. There's a big shaggy dog asleep across the hardware store's doorway, and Hal doesn't move him."
                      ]
                    },
                    { "rep": 2 }
                  ],
                  "else": [
                    { "set": { "rufusEnd": "man" } },
                    { "narrate": "You sit on the bench with him all night. He puts his head on your knee. Some time before dawn, he sighs, a long, whole-dog sigh." },
                    { "hook": "dog", "with": { "dog": false } },
                    { "enter": { "id": "rufus", "cast": "rufus", "at": [200, 164], "facingLeft": true } },
                    {
                      "say": "rufus",
                      "text": [
                        "Brr. Hi. Thanks for staying. It's very cold being a man in October with no clothes on.",
                        "I'll go in to Hal's at eight. Full-time, he said. You can keep the collar. Sell it. Or keep it. I don't know. I'll know next month."
                      ]
                    },
                    {
                      "if": "it",
                      "then": [
                        { "edit": "it", "set": { "questKey": false, "nosale": false } },
                        { "refresh": "panel" }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "Scratch his ears and wait with him until dawn",
              "then": [
                { "set": { "rufusEnd": "man" } },
                { "narrate": "You sit on the bench with him all night. He puts his head on your knee. Some time before dawn, he sighs, a long, whole-dog sigh." },
                { "hook": "dog", "with": { "dog": false } },
                { "enter": { "id": "rufus", "cast": "rufus", "at": [200, 164], "facingLeft": true } },
                {
                  "say": "rufus",
                  "text": [
                    "Brr. Hi. Thanks for staying. It's very cold being a man in October with no clothes on.",
                    "I'll go in to Hal's at eight. Full-time, he said. You can keep the collar. Sell it. Or keep it. I don't know. I'll know next month."
                  ]
                },
                {
                  "if": "it",
                  "then": [
                    { "edit": "it", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            {
              "label": "Let him go to the howling",
              "if": "hook.pack",
              "then": [
                { "set": { "rufusEnd": "pack" } },
                { "if": "it", "then": [{ "take": "it" }, { "hook": "dog", "with": { "collar": true } }] },
                {
                  "narrate": [
                    "You open your hand. He looks at you once, and then he's gone across the causeway at a gallop, toward the howling.",
                    "A minute later the howling gets a great deal more in tune."
                  ]
                }
              ]
            }
          ]
        },
        { "hook": "dog", "with": { "dog": false } }
      ]
    }
  },
  "nights": [
    {
      "id": "rufus-moon",
      "window": ["4-4", "4-4"],
      "weekdays": [4],
      "if": "flag.rufusMoon && !flag.rufusEnd",
      "scene": "rufusMoon",
      "test": [{ "set": { "rufusMoon": true } }, { "add": { "unique": "rufusCollar" } }]
    }
  ],
  "beats": [
    { "at": "3-2", "cast": "rufus", "scene": "rufusPawns" },
    { "at": "4-2", "cast": "hal", "scene": "rufusAsked", "if": "flag.rufusPawned && !hook.pack" },
    { "at": "4-2", "cast": "bettany", "scene": "rufusAsked", "if": "flag.rufusPawned && hook.pack" }
  ],
  "calendar": [
    { "id": "rufus-moon", "night": "rufus-moon", "story": "rufus", "where": "Harbor Green", "title": "Full moon", "known": "flag.rufusMoon", "scene": "rufusMoon" }
  ],
  "epilogue": [
    { "line": "A big shaggy dog sleeps across the doorway of Mayhew's Hardware. His tag says RUFUS. He fetches.", "if": "flag.rufusEnd == 'good'" },
    { "line": "Rufus is full-time at Mayhew's Hardware now. Every full moon he takes Thursday night off, and comes in on Friday very cheerful.", "if": "flag.rufusEnd == 'man'" },
    { "line": "The Pack has a real dog now. He doesn't know what a Moon Table is. He likes the donuts.", "if": "flag.rufusEnd == 'pack'" }
  ]
});
