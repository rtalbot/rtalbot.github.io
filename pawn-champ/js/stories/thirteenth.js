// Pawn Champ - The Thirteenth Room: a key opens a door at closing, and behind it the shop keeps going.
// Major quest M22, the deep set (docs/quests/MAJOR.md#m22-the-thirteenth-room-uncanny).
//
// Hook (W1 Wed-W2 Mon)       Agnes Bram, who kept house for Odile's mother, pawns a brass key tagged 13
//                            and won't take it back. Odile's 1961 ledger numbers thirteen rooms.
// Scene 1 (W2 Tue-W2 Thu)    the back room after hours: a door that wasn't there. The shop, again, older.
// Errand (lunch, after it)   Agnes's kitchen on Front Street: what Odile's mother kept shut.
// Scene 2 (W3 Mon-W3 Thu)    deeper: rooms in the wrong order, and the room of forfeits.
// Finale (W4 Mon-W4 Thu)     lock it and give Agnes the key, sell it to Sorrel (if The Sounding brought
//                            him), or keep taking one thing out a night.
// Looks: the 1961 ledger's last page, the room of forfeits, every night you take something out.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/thirteenth.js.
// Mr. Sorrel is The Sounding's character (js/stories/sounding.js, which loads first).
defineStory({
  "id": "thirteenth",
  "kind": "major",
  "colour": "#7a5a8a",
  "family": "uncanny",
  "group": "deep",
  "title": "The Thirteenth Room",
  "crosses": ["sounding"],
  "rumour": "Odile's oldest ledger numbers the shop's rooms one to thirteen. The Crooked Scale has four.",
  "endings": { "locked": "Twelve Rooms", "sorrel": "His All Along", "taking": "Open All Hours" },
  "about": [
    "A quiet, eerie story about the shop itself, and part of the deep set: some choices are Looks, which go in the Storybook. Early in the month Agnes Bram, who kept house for Odile's mother, pawns a brass key tagged 13 for thirteen dollars: it has to be pawned, those are the rules (§{agnesKey}). She points you to the shop's 1961 ledger, which numbers thirteen rooms. The Crooked Scale has four.",
    "In week 2 a green door appears in the back room at closing (§{thirteenDoor}). Through it are older versions of your shop, one behind another, going back further than they should. Agnes explains over tea (§{thirteenAgnes}): everything ever forfeited at the Crooked Scale goes through that door and down, and waits to be claimed. Odile opened it once and then went to live in a lighthouse.",
    "In week 3 you can go all the way to the room of forfeits (§{thirteenDeep}): every pledge in the shop's history, some tagged with dates next year, and a pocket watch made out to you in your own handwriting. In week 4 the handle turns from the other side (§{thirteenLast}), and you decide.",
    "Twelve Rooms: lock it and give Agnes back the key. His All Along: if The Sounding is in the run, sell the key for $400 to Lambeth Sorrel, who walks through the door and takes it with him. Open All Hours: keep the key and bring out one forfeited thing every night (old stock for your shelves), knowing the door is getting easier to open from the other side too. If the key has left the shop by the time the door appears, it simply goes, and that counts as Twelve Rooms."
  ],
  "cast": {
    "agnes": {
      "name": "Agnes Bram",
      "look": { "skin": "#e8c8b0", "hair": "#e8e8e8", "hs": 3, "coat": "#3a2a3a", "trim": "#c8a050", "style": "jacket", "long": true, "pants": "#2a2228", "glasses": "#c8a050", "bag": "#4a3a2a" }
    }
  },
  "icons": {
    "key13": [
      "............",
      "..kkkk......",
      ".kyYYyk.....",
      ".kY..Ykkkkk.",
      ".ky..yyyyyyk",
      ".kyooykkykyk",
      "..kkkk.kk.k.",
      "......kk....",
      ".....kppk...",
      ".....kprk...",
      ".....kppk...",
      "......kk...."
    ]
  },
  "uniques": {
    "key13": {
      "name": "A brass key tagged 13",
      "icon": "key13",
      "cat": "curio",
      "guide": 0,
      "questKey": true,
      "condLabel": "Warm from a pocket",
      "tells": [
        "A heavy brass key on a paper tag. 13, in ink, in Odile's mother's hand.",
        "It doesn't fit any lock in the shop. You've tried them all."
      ]
    },
    "ledger1961": {
      "name": "The Crooked Scale's ledger, 1961",
      "icon": "tome",
      "cat": "curio",
      "guide": 45,
      "condLabel": "Foxed",
      "tells": [
        "A green cloth ledger. Pledges, loans, forfeits, all in Odile's mother's hand.",
        "The inside cover lists the rooms: shop, back room, stair, stock room... and on to thirteen. The Crooked Scale has four."
      ]
    },
    "watchYours": {
      "name": "A pocket watch made out to you",
      "icon": "watch",
      "cat": "jewelry",
      "guide": 120,
      "condLabel": "Running",
      "tells": [
        "Silver, a hunter case, wound and running. The oldest pledge in the thirteenth room.",
        "Its pawn ticket is dated 1961 and made out in your name. In your handwriting."
      ]
    },
    "forfeit0": {
      "name": "A wedding ring pawned in 1938",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 110,
      "condLabel": "Forfeit",
      "tells": ["Never redeemed. The inside is engraved FOR ALWAYS."]
    },
    "forfeit1": {
      "name": "A transistor radio, 1961",
      "icon": "radio",
      "cat": "curio",
      "guide": 70,
      "condLabel": "Forfeit",
      "tells": ["Still tuned to a station that went off the air in 1972. You can hear it."]
    },
    "forfeit2": {
      "name": "A child's silver christening cup",
      "icon": "goblet",
      "cat": "silver",
      "guide": 90,
      "condLabel": "Forfeit",
      "tells": ["Pawned in 1947 for a week's rent. The child would be eighty."]
    },
    "forfeit3": {
      "name": "A painted fan",
      "icon": "painting",
      "cat": "art",
      "guide": 85,
      "condLabel": "Forfeit",
      "tells": ["A harbor scene. The boats in it are moored where the Neck is deepest."]
    },
    "forfeit4": {
      "name": "A gold fob seal",
      "icon": "brooch",
      "cat": "jewelry",
      "guide": 120,
      "condLabel": "Forfeit",
      "tells": ["Pawned in 1912. The seal is the same carving as the stones in the harbor."]
    }
  },
  "soundings": { "thirteen-ledger": "The Crooked Scale was built on top of the thirteenth room, not the other way round. Whatever is forfeited here goes down.", "thirteen-forfeits": "Nothing forfeited to the Crooked Scale was ever lost. It is all still in the thirteenth room, waiting to be claimed, by someone.", "thirteen-taking": "Every night you take something out of the thirteenth room, the door is a little easier to find, and from both sides." },
  "overheard": [
    { "line": "Whispering: \"Agnes Bram's been standing outside the pawnshop at closing. Just looking at the back wall.\"" }
  ],
  "scenes": {
    "agnesKey": {
      "title": "Agnes Bram pawns the key",
      "customer": "agnes",
      "steps": [
        { "say": "agnes", "text": "Agnes Bram. I kept house for Odile's mother, when this was her shop. Before you were thought of." },
        { "view": { "counterIcon": "key13" } },
        { "narrate": "She puts a heavy brass key on the counter, on a paper tag marked 13." },
        { "say": "agnes", "text": "Give me thirteen dollars for it. I'd give it you for nothing, but it has to be pawned. Those are the rules. Don't ask me whose." },
        {
          "choose": [
            {
              "label": "Lend her $13 on it",
              "hint": "(she won't come back for it)",
              "then": [{ "view": { "counterIcon": null } }]
            },
            {
              "label": "\"I don't want it, Mrs. Bram.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "agnes", "text": "No. Odile said no, too, the first time. I'll come back when you're older." },
                { "set": { "thirteenRefused": true } },
                { "leave": "agnes" },
                { "end": true }
              ]
            }
          ]
        },
        { "add": { "unique": "key13", "paid": 13 } },
        { "coin": -13, "why": "Lent $13 to Agnes Bram against a brass key" },
        { "set": { "thirteenKey": true } },
        { "say": "agnes", "text": "There. It's the shop's again. Your grandmother's ledger is in the bottom of the back-room cupboard, under the Christmas lights. Count the rooms in it." },
        { "if": "shelf.free", "then": [{ "add": { "unique": "ledger1961" } }, { "refresh": "panel" }] },
        { "say": "agnes", "text": "And on {placed:thirteen-door} night, stay late. Not too late." },
        { "toast": "Calendar: the back room, {placed:thirteen-door} night", "look": "agnes" },
        { "leave": "agnes" }
      ]
    },
    "thirteenDoor": {
      "title": "The door",
      "music": "room13",
      "steps": [
        {
          "stage": "shopNight",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
          ]
        },
        { "narrate": "Closing time. You're turning off the lights when you notice it: in the back room, between the cupboard and the boiler, a door. Painted the same green as the walls. It wasn't there this morning." },
        { "find": "k", "in": "stock", "match": { "uniqueId": "key13" } },
        {
          "if": "!k",
          "then": [
            { "narrate": "It has a keyhole, and you haven't got the key any more. By morning it's gone." },
            { "set": { "thirteenEnd": "locked", "thirteenDone": true } },
            { "end": true }
          ]
        },
        {
          "choose": [
            { "label": "Try the key" },
            {
              "label": "Turn off the light and go upstairs",
              "then": [
                { "narrate": "You go up to bed. Some time after two you hear someone downstairs turning the pages of a ledger." },
                { "set": { "thirteenWaited": true } },
                { "end": true }
              ]
            }
          ]
        },
        {
          "stage": "roomThirteen",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] }]
        },
        {
          "narrate": [
            "The key turns as if it's turned a thousand times. Beyond the door is the shop. Your shop: the counter, the pegboard, Odile's brass scale. Older. The stock is in pounds and shillings and there's a calendar for 1961.",
            "Beyond that room is another doorway, and another shop, older again. And another. They don't go back in a straight line. You can feel it in your feet."
          ]
        },
        { "find": "led", "in": "stock", "match": { "uniqueId": "ledger1961" } },
        {
          "if": "led",
          "then": [
            {
              "choose": [
                {
                  "label": "Read the last page of the 1961 ledger, here, by this light",
                  "hint": "(Look)",
                  "then": [
                    { "narrate": "The last page isn't pledges. It's a note in Odile's mother's hand: \"The shop was built over the thirteenth room so that someone would always be keeping it. What is forfeited here goes down. Keep it shut. Keep the scale level. Tell Agnes I'm sorry.\"" },
                    { "sounding": "thirteen-ledger" }
                  ]
                },
                { "label": "Leave the ledger closed" }
              ]
            }
          ]
        },
        { "narrate": "You back out, and lock the door, and the key is warm in your hand for an hour." },
        { "set": { "thirteenOpened": true } },
        { "plan": "thirteen-agnes" },
        { "toast": "Calendar: Agnes Bram's kitchen, at lunch", "look": "agnes" }
      ]
    },
    "thirteenAgnes": {
      "title": "Agnes Bram's kitchen",
      "steps": [
        {
          "stage": "kitchen",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [130, 166] },
            { "id": "agnes", "cast": "agnes", "at": [214, 162], "facingLeft": true }
          ]
        },
        {
          "say": "agnes",
          "text": [
            "You went in. Of course you did. Sit down. There's tea.",
            "Odile's mother kept that door shut forty years. Everything anybody ever forfeited in that shop goes through it, and down. Rings, radios, watches. All of it, waiting to be claimed.",
            "She gave me the key the week she died. She said: if it goes to Odile, Odile will open it. Odile did, once. Then she gave it back to me and went to live in a lighthouse. Make of that what you like."
          ]
        },
        { "say": "agnes", "text": "And there's a man in a damp coat in town asking about keys. Don't let him have it. Or do. I'm too old to tell you which.", "if": "quest.sounding" },
        { "say": "agnes", "text": "There's further to go, if you're going. Next week. Then you'll have to decide." },
        { "set": { "thirteenAgnes": true } },
        { "toast": "Calendar: the thirteenth room again, {placed:thirteen-deep} night", "look": "agnes" }
      ]
    },
    "thirteenDeep": {
      "title": "The room of forfeits",
      "music": "room13",
      "steps": [
        {
          "stage": "roomThirteen",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] }]
        },
        { "find": "k", "in": "stock", "match": { "uniqueId": "key13" } },
        {
          "if": "!k",
          "then": [
            { "narrate": "You go to the back room. There's no door. You haven't got the key." },
            { "end": true }
          ]
        },
        {
          "narrate": [
            "Further in. 1938. 1912. A room that's all counter and no walls. A room where the scale is the size of a car. The corners of the rooms add up to more than a corner should, and walking straight brings you back to where you started, facing the other way.",
            "And then a long low room, lit by nothing, full from floor to ceiling with tagged parcels. Every forfeit in the Crooked Scale's history. Some of the tags are dated next year."
          ]
        },
        {
          "choose": [
            {
              "label": "Read the tags. All of them, as far as you can",
              "hint": "(Look)",
              "then": [
                { "narrate": "Names you know. Hollis Fenn's father. Ada Pell. Your own name, three times, for things you haven't pawned yet. The handwriting on the oldest tags isn't a hand. It's the carving from the stones." },
                { "sounding": "thirteen-forfeits" }
              ]
            },
            { "label": "Take only what's yours, and go" }
          ]
        },
        { "narrate": "On a shelf by the door is a silver pocket watch, wound and running. Its ticket, from 1961, is made out to you, in your own handwriting." },
        { "if": "shelf.free", "then": [{ "add": { "unique": "watchYours" } }, { "refresh": "panel" }] },
        { "narrate": "You find your way back by walking with your eyes shut. It works. You don't ask why." },
        { "set": { "thirteenDeep": true } },
        { "toast": "Calendar: one last time through the door, next week", "look": "agnes" }
      ]
    },
    "thirteenLast": {
      "title": "The door, one last time",
      "music": "room13",
      "steps": [
        {
          "stage": "shopNight",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
          ]
        },
        { "find": "k", "in": "stock", "match": { "uniqueId": "key13" } },
        { "narrate": "Closing. The green door is in the back room again, and it doesn't wait for you to notice it. The handle is turning very slowly from the other side." },
        {
          "if": "!k",
          "then": [
            { "narrate": "You turn the key until it won't turn any further. The handle stops. In the morning there's just the back-room wall, and a patch of green paint slightly newer than the rest." },
            { "take": "k" },
            { "rep": 4, "why": "Kept the thirteenth room shut" },
            { "narrate": "Agnes takes the key back over her kitchen table and puts it in the tea caddy. \"Twelve rooms,\" she says. \"That's plenty for anybody.\"" },
            { "set": { "thirteenEnd": "locked" } }
          ],
          "else": [
            {
              "choose": [
                {
                  "label": "Lock it for good and take the key back to Agnes",
                  "hint": "(rep +4)",
                  "then": [
                    { "narrate": "You turn the key until it won't turn any further. The handle stops. In the morning there's just the back-room wall, and a patch of green paint slightly newer than the rest." },
                    { "take": "k" },
                    { "rep": 4, "why": "Kept the thirteenth room shut" },
                    { "narrate": "Agnes takes the key back over her kitchen table and puts it in the tea caddy. \"Twelve rooms,\" she says. \"That's plenty for anybody.\"" },
                    { "set": { "thirteenEnd": "locked" } }
                  ]
                },
                {
                  "label": "Sell the key to Mr. Sorrel, who is standing outside the shop window",
                  "hint": "(+$400)",
                  "if": "quest.sounding && flag.soundingEnd != 'sold' && flag.sorrelVisits > 0",
                  "then": [
                    { "enter": { "id": "sorrel", "cast": "sorrel", "at": [230, 152], "facingLeft": true } },
                    { "say": "sorrel", "text": "Good evening. I believe that's mine. I lent it to the lady's employer a long time ago. I've come a long way up to get it back." },
                    { "take": "k" },
                    { "coin": 400, "why": "Sold the brass key to Lambeth Sorrel" },
                    { "narrate": "He walks past you into the back room and opens the green door and goes through, closing it softly behind him. The door is gone before the latch clicks." },
                    { "set": { "thirteenEnd": "sorrel" } }
                  ]
                },
                {
                  "label": "Keep the key. Go in, and bring one thing out every night",
                  "hint": "(Look, every night)",
                  "then": [
                    { "narrate": "You go in. You come out with something in your hands. Every night after, the door is waiting at closing, and you go in, and bring one thing out." },
                    { "sounding": "thirteen-taking" },
                    { "set": { "thirteenEnd": "taking", "thirteenTaken": 0 } }
                  ]
                }
              ]
            }
          ]
        },
        { "set": { "thirteenDone": true } }
      ]
    }
  },
  "beats": [{ "drift": "thirteen-hook", "from": "1-3", "to": "2-1", "cast": "agnes", "scene": "agnesKey" }],
  "nights": [
    {
      "id": "thirteen-door",
      "window": ["2-2", "2-4"],
      "if": "flag.thirteenKey && !flag.thirteenDone",
      "scene": "thirteenDoor",
      "test": [
        { "set": { "thirteenKey": true } },
        { "add": { "unique": "key13" } },
        { "add": { "unique": "ledger1961" } }
      ]
    },
    {
      "id": "thirteen-deep",
      "window": ["3-1", "3-4"],
      "if": "flag.thirteenOpened && !flag.thirteenDone",
      "scene": "thirteenDeep",
      "test": [{ "set": { "thirteenOpened": true } }, { "add": { "unique": "key13" } }]
    },
    {
      "id": "thirteen-last",
      "window": ["4-1", "4-4"],
      "if": "flag.thirteenKey && !flag.thirteenDone && (flag.thirteenDeep || flag.thirteenWaited)",
      "scene": "thirteenLast",
      "note": "if you didn't open it the first night, it waits for you at the end anyway",
      "test": [{ "set": { "thirteenKey": true, "thirteenDeep": true } }, { "add": { "unique": "key13" } }]
    }
  ],
  "errands": [
    {
      "id": "thirteen-agnes",
      "title": "Agnes Bram's kitchen",
      "where": "Front Street",
      "scene": "thirteenAgnes",
      "test": [{ "set": { "thirteenOpened": true } }]
    }
  ],
  "calendar": [
    { "id": "thirteen-door", "night": "thirteen-door", "story": "thirteenth", "where": "The back room", "title": "Stay late", "known": "flag.thirteenKey", "scene": "thirteenDoor" },
    { "id": "thirteen-agnes", "errand": "thirteen-agnes", "story": "thirteenth", "where": "Front Street", "title": "Agnes Bram's kitchen", "known": "flag.thirteenOpened" },
    { "id": "thirteen-deep", "night": "thirteen-deep", "story": "thirteenth", "where": "The thirteenth room", "title": "Further in", "known": "flag.thirteenAgnes", "scene": "thirteenDeep" },
    { "id": "thirteen-last", "night": "thirteen-last", "story": "thirteenth", "where": "The back room", "title": "The door, one last time", "known": "flag.thirteenDeep", "scene": "thirteenLast" }
  ],
  "mornings": [
    {
      "if": "flag.thirteenEnd == 'taking' && shelf.free",
      "note": "open all hours: one forfeit a morning",
      "then": [
        {
          "if": "flag.thirteenTaken == 4",
          "then": [
            { "add": { "unique": "forfeit4" } },
            { "set": { "thirteenTaken": 5 } },
            { "hook": "countLook" },
            { "refresh": "panel" },
            { "toast": "From the thirteenth room last night: a gold fob seal. The door was easier to find.", "icon": "brooch" }
          ]
        },
        {
          "if": "flag.thirteenTaken == 3",
          "then": [
            { "add": { "unique": "forfeit3" } },
            { "set": { "thirteenTaken": 4 } },
            { "hook": "countLook" },
            { "refresh": "panel" },
            { "toast": "From the thirteenth room last night: a painted fan. The door was easier to find.", "icon": "painting" }
          ]
        },
        {
          "if": "flag.thirteenTaken == 2",
          "then": [
            { "add": { "unique": "forfeit2" } },
            { "set": { "thirteenTaken": 3 } },
            { "hook": "countLook" },
            { "refresh": "panel" },
            { "toast": "From the thirteenth room last night: a child's silver christening cup. The door was easier to find.", "icon": "goblet" }
          ]
        },
        {
          "if": "flag.thirteenTaken == 1",
          "then": [
            { "add": { "unique": "forfeit1" } },
            { "set": { "thirteenTaken": 2 } },
            { "hook": "countLook" },
            { "refresh": "panel" },
            { "toast": "From the thirteenth room last night: a transistor radio, 1961. The door was easier to find.", "icon": "radio" }
          ]
        },
        {
          "if": "!flag.thirteenTaken",
          "then": [
            { "add": { "unique": "forfeit0" } },
            { "set": { "thirteenTaken": 1 } },
            { "hook": "countLook" },
            { "refresh": "panel" },
            { "toast": "From the thirteenth room last night: a wedding ring pawned in 1938. The door was easier to find.", "icon": "ring" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "The Crooked Scale has four rooms. Agnes Bram keeps a brass key in her tea caddy, and comes in for a chat on Thursdays.", "if": "flag.thirteenEnd == 'locked'" },
    { "line": "There's no door in the back room. Sometimes, at closing, the scale on the counter tips by itself, as if something very far down had been weighed.", "if": "flag.thirteenEnd == 'sorrel'" },
    { "line": "Every night at closing you go through the green door and bring one thing back. The door is a little easier to find each time. Lately it has been easier to find from the other side too.", "if": "flag.thirteenEnd == 'taking'" }
  ],
  "outcome": "flag.thirteenEnd"
});
