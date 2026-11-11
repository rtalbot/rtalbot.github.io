// Pawn Champ - Under the Ice. Major quest M29, batch N (docs/quests/MAJOR.md#m29-under-the-ice-uncanny).
// Hob's Pond freezes clear as glass, and skaters keep seeing a lit window under it. In 1911 the ice
// company flooded the hollow and the Teague farmhouse with it. In 1923 Caleb Teague went through the
// ice over his old house, and his mother, then his sister Clara, kept a lamp lit in the window every
// winter night so he could find the way up. This January the lamp went out. It's in your shop.
//
// Hook (W1 Tue)             Rowan Teague sells his gran's rose-painted parlor lamp.
// Middle (W1 Thu)           Madame Orsolya: it's half of a pair, and the other half is lit.
// Middle (W2 Mon, Tue)      Rowan wants it back for Clara; Mrs. Akers wants it for a lot of money.
// Scene 1 (W2 Wed-W3 Mon)   Hob's Pond at night: the window under the ice.
// Scene 2 (W3 Mon-Thu)      The Historical Society after hours: the ice company's ledger.
// Finale (W3 Thu-W4 Thu)    The coldest night on the pond, and what you do with the lamp.
// Months: January and February of a stay (docs/SEASONS.md). Crossing: M31's shanty has the ice saw.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/undertheice.js.
defineStory({
  "id": "undertheice",
  "kind": "major",
  "colour": "#7ab0d8",
  "family": "uncanny",
  "title": "Under the Ice",
  "months": [4, 5],
  "crosses": ["shanty"],
  "rumour": "Skaters on Hob's Pond keep seeing a lit window under the ice.",
  "endings": { "answered": "Answered", "home": "Back in the Window", "kept": "Kept Lit", "sold": "A Pair, Once", "dark": "Still Burning" },
  "outcome": "flag.iceEnd",
  "about": [
    "A winter ghost story with a warm ending available. Rowan Teague sells his gran's rose-painted parlor lamp, the one that stood lit in her front window every winter night (§{iceRowan}). From that night, skaters on Hob's Pond see a lit window under the ice. Madame Orsolya tells you the lamp is half of a pair, and the other half is down there, lit and waiting (§{iceOrsolya}).",
    "In week 2 you're pulled in three directions. Rowan wants the lamp back for his gran, who keeps asking whether it's lit (§{iceRowanBack}). Mrs. Akers, an antiques dealer from Concord, offers $260 for the survivor of a pair (§{iceAkers}). Selling to either ends the story there (Back in the Window, or A Pair, Once).",
    "Keep it, and the mystery opens. On the pond at night with Orsolya you see a drowned farmhouse under the ice, a lit window and a young man looking up (§{icePondNight}). At the Historical Society, with Hester if she's in town, the ice company's books tell you who he is (§{iceLedger}): in 1911 the company flooded the Teague farm, and in 1923 young C. Teague went through the ice over the old house. His mother lit a lamp in the window of the new house, and his sister Clara kept it lit for fifty years. Clara is Rowan's gran.",
    "On the coldest night (§{iceFinale}), a friend among the regulars may turn up with a rope; an enemy may have lied about the ice. Light the lamp on the ice above the window to answer him, and he comes up (Answered). Keep it lit in your own shop window instead (Kept Lit), sell it to Mrs. Akers after all (A Pair, Once), or do nothing (Still Burning)."
  ],
  "cast": {
    "rowan": {
      "name": "Rowan Teague",
      "look": { "skin": "#e8c0a0", "hair": "#5a3a22", "hs": 1, "coat": "#3a5a7a", "trim": "#e8e4dc", "style": "puffer", "hat": "beanie", "hatc": "#8a2a2a", "pants": "#3a3a40", "beard": "#5a3a22" }
    },
    "akers": {
      "name": "Mrs. Lavinia Akers",
      "look": { "skin": "#f0d0b8", "hair": "#c8c8d0", "hs": 3, "coat": "#5a2a3a", "trim": "#c8a050", "style": "jacket", "long": true, "pants": "#2a2028", "glasses": "#c8a050", "bag": "#2a2028" }
    },
    "caleb": {
      "name": "Caleb Teague",
      "look": { "skin": "#c8d8e0", "hair": "#3a2a1e", "hs": 0, "coat": "#4a4a3a", "style": "jacket", "hat": "cap", "hatc": "#3a3a30", "pants": "#3a3a30" }
    }
  },
  "icons": {
    "roseLamp": [
      ".....kk.....",
      "....kAAk....",
      "...kcRcRk...",
      "..kcRcRcck..",
      "..kRccRcck..",
      "...kkkkkk...",
      "....kyyk....",
      "...kyYYyk...",
      "..kyRyyRyk..",
      "..kyyRRyyk..",
      "...kyyyyk...",
      "..kkkkkkkk.."
    ],
    "iceTag": [
      "............",
      "..kkkkkkkk..",
      ".ksSSSSSSsk.",
      ".kSdSddSdSk.",
      ".kSSSSSSSSk.",
      ".kSdddSSdSk.",
      ".kSSSSSSSSk.",
      ".ksSSkkSSsk.",
      "..kkk..kkk..",
      "............",
      "............",
      "............"
    ]
  },
  "uniques": {
    "roseLamp": {
      "name": "A rose-painted parlor lamp",
      "icon": "roseLamp",
      "cat": "curio",
      "guide": 120,
      "condLabel": "Wick trimmed, font full",
      "questKey": true,
      "tells": [
        "A kerosene parlor lamp, about 1890, roses painted on the globe and the font. Somebody has kept the wick trimmed for a very long time.",
        "Scratched under the base, in two different hands: KEEP IT LIT FOR CALEB. 1923.",
        { "text": "The brass is cold. It stays cold in your hand, and it smells faintly of pond water.", "cls": "bad" }
      ]
    },
    "iceTag": {
      "name": "A Hob Pond Ice Co. tag, No. 14",
      "icon": "iceTag",
      "cat": "curio",
      "guide": 18,
      "condLabel": "Was frozen in the pond",
      "tells": [
        "A tin tag from an ice cutter's coat: HOB POND ICE CO. No. 14. The ledger says No. 14 was C. Teague."
      ]
    }
  },
  "spots": {
    "icepondNight": [
      {
        "id": "window",
        "rect": { "x": 290, "y": 236, "w": 104, "h": 54 },
        "lines": [
          "The window under the ice. You can see the pattern on the wallpaper. Roses, like the lamp.",
          "There are two chairs pulled up to the table down there. One has a coat over the back."
        ]
      },
      {
        "id": "icehouse",
        "rect": { "x": 462, "y": 118, "w": 140, "h": 92 },
        "lines": [
          "The old ice house. They cut the pond into blocks here and packed them in sawdust till July.",
          "The roof went in the 1938 hurricane. Nobody has wanted ice from Hob's Pond since refrigerators."
        ]
      },
      {
        "id": "barrel",
        "rect": { "x": 556, "y": 280, "w": 38, "h": 62 },
        "lines": ["The skaters' fire barrel, down to coals. It's the only warm thing for a mile."],
        "where": "Hob's Pond",
        "find": { "on": 1, "coin": 2, "line": "Two dollars in quarters in the snow by the barrel, dropped by someone buying cocoa." }
      }
    ],
    "icepond": [
      {
        "id": "hill",
        "rect": { "x": 0, "y": 110, "w": 220, "h": 100 },
        "lines": [
          "Teague's Hill. The stone wall running down it was a field boundary once, before the hollow was a pond.",
          "Sled tracks from the top to the ice. Some of them stop very suddenly in a snowbank."
        ]
      },
      {
        "id": "net",
        "rect": { "x": 466, "y": 314, "w": 52, "h": 32 },
        "lines": [
          "A hockey net, dragged off the ice for the figure skaters. There's a treaty about this. It's renegotiated daily."
        ]
      }
    ]
  },
  "scenes": {
    "iceRowan": {
      "title": "Rowan Teague sells his gran's rose-painted lamp",
      "customer": "rowan",
      "steps": [
        {
          "say": "rowan",
          "text": [
            "I'm clearing my gran's house up on the Hob Pond road. She's gone into the home on Cliff Road. Ninety-six. She's fine. She's cross about it, but fine.",
            "This was in the front window. It was always in the front window. Every winter night, lit. I don't want to throw it out, and I can't keep it. Seventy?"
          ]
        },
        { "offer": { "unique": "roseLamp" }, "persona": "honest", "asking": 70, "min": 45 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "iceOut": true } },
            { "say": "rowan", "text": "OK. It'll go to the church sale, then. She'll never know. She'll know." },
            { "leave": "rowan" },
            { "end": true }
          ]
        },
        { "set": { "iceIn": true } },
        { "say": "rowan", "text": "Funny thing. The night I took it out of the window, the kids on the pond started saying there's a light under the ice. Kids, right?" },
        { "leave": "rowan" }
      ]
    },
    "iceOrsolya": {
      "title": "Madame Orsolya: the lamp is half of a pair",
      "customer": "orsolya",
      "steps": [
        { "say": "orsolya", "text": "I came for candles and I am leaving with a feeling. What is that lamp doing on your shelf?" },
        {
          "if": "hook.lampHere",
          "then": [
            {
              "say": "orsolya",
              "text": [
                "It's half of a pair. I can see the other half from here. I can see it the way you see your own breath on a cold day.",
                "The other half is lit. It is under Hob's Pond, in a window, and somebody is standing by it waiting for this one to answer."
              ]
            }
          ],
          "else": [
            { "say": "orsolya", "text": "There was a lamp. Somebody turned it away. Now there is only the one under the pond, and it is lit, and it is waiting." }
          ]
        },
        { "say": "orsolya", "text": "Come out on the ice with me one night. Wear two pairs of socks. The dead don't feel the cold, but you will." },
        {
          "choose": [
            {
              "label": "\"I'll come.\"",
              "then": [
                { "set": { "icePond": true } },
                { "toast": "Calendar: Hob's Pond, at night, with Madame Orsolya", "look": "orsolya" }
              ]
            },
            {
              "label": "\"I don't walk on ponds at night.\"",
              "then": [{ "say": "orsolya", "text": "Nobody does. Then one night, everybody does." }]
            }
          ]
        },
        { "leave": "orsolya" }
      ]
    },
    "iceRowanBack": {
      "title": "Rowan wants the lamp back for his gran",
      "customer": "rowan",
      "steps": [
        {
          "say": "rowan",
          "text": [
            "This is going to sound strange. I went to see Gran on Sunday. The first thing she said wasn't hello. It was \"Is the lamp lit?\"",
            "She says don't light it unless you mean to answer. I said answer what, Gran. She looked at me like I'd forgotten my own name.",
            "I'd buy it back. For her window at the home. They don't let you have kerosene, but she says that doesn't matter, it just has to be there."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell it back to Rowan",
              "hint": "(+$70; the story ends here)",
              "then": [
                { "find": "lamp", "in": "stock", "match": { "uniqueId": "roseLamp" } },
                { "take": "lamp" },
                { "coin": 70, "why": "Sold the rose lamp back to Rowan Teague" },
                { "set": { "iceEnd": "home", "iceDone": true } },
                { "say": "rowan", "text": "Thank you. Really. She'll stop asking me now. Or she'll start asking something worse." }
              ]
            },
            {
              "label": "\"Let me hang on to it a little longer.\"",
              "then": [
                { "say": "rowan", "text": "OK. I'll tell her it's somewhere safe. She'll ask if it's lit." }
              ]
            }
          ]
        },
        { "leave": "rowan" }
      ]
    },
    "iceAkers": {
      "title": "Mrs. Akers of Concord wants the survivor of a pair",
      "customer": "akers",
      "steps": [
        {
          "say": "akers",
          "text": [
            "Lavinia Akers, Akers Antiques, Concord. I buy pairs. Lamps, candlesticks, china dogs. Things that were made to stand at either end of something.",
            "That lamp is the survivor of a pair. The other went in a flood, I'm told. A survivor is worth more than a pair. People like a story. Two hundred and sixty."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell it to Mrs. Akers",
              "hint": "(+$260; the story ends here)",
              "then": [
                { "find": "lamp", "in": "stock", "match": { "uniqueId": "roseLamp" } },
                { "take": "lamp" },
                { "coin": 260, "why": "Sold the rose lamp to Akers Antiques" },
                { "set": { "iceEnd": "sold", "iceDone": true } },
                { "say": "akers", "text": "Lovely. It'll go in the window in Concord, with a little card. People do like a story." }
              ]
            },
            {
              "label": "\"It isn't for sale yet.\"",
              "then": [{ "say": "akers", "text": "Yet. I like a dealer who says yet. Here's my card." }]
            }
          ]
        },
        { "leave": "akers" }
      ]
    },
    "icePondNight": {
      "title": "Hob's Pond at night: the window under the ice",
      "steps": [
        { "hook": "pond", "with": { "lit": true } },
        {
          "stage": "icepondNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "orsolya", "cast": "orsolya", "at": [200, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Hob's Pond at eleven at night. The skaters have gone home and the fire barrel is down to coals. The ice is so clear and black that the stars are in it as well as over it." },
        { "say": "orsolya", "text": "Kneel down. Put your hands round your eyes like a little box. Look straight down. There." },
        {
          "narrate": [
            "Under the ice, under eight feet of still water, there is a farmhouse: a roof ridge, a chimney, two windows. One of them is lit, warm and yellow, the way a window is lit when someone is expected.",
            "Inside there is a parlor, a table laid for two, and on the sill a lamp with roses painted on its globe. Somebody crosses in front of it. A young man in a wool cap. He stops, and looks up."
          ]
        },
        {
          "choose": [
            {
              "label": "Knock on the ice",
              "then": [
                { "narrate": "You knock twice with your knuckles. The ice rings like a bell for a long time. Below, he puts his hand flat against the glass of the window." }
              ]
            },
            {
              "label": "Keep very still",
              "then": [
                { "narrate": "You keep still. After a while he goes back to the window and stands there, looking up, the way you'd look down a road." }
              ]
            },
            { "label": "\"Who is he?\"" }
          ]
        },
        {
          "say": "orsolya",
          "text": [
            "Somebody who has been waiting for a light to be lit up here, so he can find the way. For a very long time somebody lit it. Then they stopped.",
            "Find out who he was. Names help. The Historical Society keeps the ice company's books."
          ]
        },
        { "narrate": "Something glints in the surface of the ice by your knee, frozen in: a tin tag with a number on it." },
        { "if": "shelf.free", "then": [{ "add": { "unique": "iceTag" } }, { "refresh": "panel" }] },
        { "set": { "iceSeen": true } },
        { "toast": "Calendar: the Historical Society, after hours", "look": "orsolya" }
      ]
    },
    "iceLedger": {
      "title": "The Historical Society after hours: the ice company's books",
      "steps": [
        {
          "stage": "historicalNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] },
            {
              "id": "hester",
              "cast": "hester",
              "at": [200, 162],
              "facingLeft": true,
              "if": "hook.hesterHere"
            }
          ]
        },
        {
          "if": "hester",
          "then": [
            { "narrate": "The Historical Society after hours, one lamp on. Hester Quint has the Hob Pond Ice Company's ledgers out on the long table before you have your coat off." },
            { "say": "hester", "text": "You're the third person this month to ask about Hob's Pond. The other two were nine. Sit." }
          ],
          "else": [
            { "narrate": "The Historical Society after hours, with a key from under the mat that everyone in town knows about. The Hob Pond Ice Company's ledgers are on the bottom shelf, in order, dusted." }
          ]
        },
        {
          "narrate": [
            "1911: the company buys the Teague farm in the hollow, dams Hob's Brook, and floods it. The family moves up the hill. The house is left standing. Cheaper than pulling it down.",
            "January 1923, in a clerk's hand: C. Teague, No. 14, through the ice over the old house lot, Jan 19. Not recovered. Wages to the mother, $11.40."
          ]
        },
        {
          "if": "hester",
          "then": [
            { "say": "hester", "text": "His mother put a lamp in the window of the new house that winter. Everybody on the Hob Pond road knew why. Then his little sister kept it lit. That's Clara. She's ninety-six. She went into the home in January." }
          ],
          "else": [
            { "narrate": "A clipping is folded into the page: a Gazette piece from 1973, \"The Lamp on the Hob Pond Road\". Fifty years lit, every winter night, by Mrs. Teague and then her daughter Clara." }
          ]
        },
        { "find": "tag", "in": "stock", "match": { "uniqueId": "iceTag" } },
        { "narrate": "The tag in your pocket says No. 14.", "if": "tag" },
        { "say": "hester", "text": "So the window in the house went dark, and the window in the pond came on. I don't believe a word of it. Take a thermos, the coldest night is next week.", "if": "hester" },
        { "set": { "iceLedger": true } },
        { "toast": "Calendar: Hob's Pond, the coldest night", "look": "orsolya" }
      ]
    },
    "iceFinale": {
      "title": "The coldest night on the pond",
      "steps": [
        { "hook": "pond", "with": { "lit": true } },
        {
          "stage": "icepondNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "orsolya", "cast": "orsolya", "at": [220, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The coldest night of the winter. Twelve below. The ice is talking to itself, long low notes that run from one bank to the other and back." },
        { "say": "orsolya", "text": "There he is. He knows something has changed. Look how he stands." },
        {
          "hook": "moment",
          "with": "night",
          "sets": ["friend", "enemy"],
          "note": "a friend turns up with a rope; an enemy told you the ice was safe (js/standing.js)"
        },
        {
          "if": "friend",
          "then": [
            { "narrate": "Halfway out, the ice groans under you. Then there's a flashlight on the bank, and {friend.name} with a coil of rope over one shoulder. \"Thought you might be out here,\" they say, and pay out the rope to you without another word." },
            { "rep": 1 }
          ]
        },
        { "narrate": "Halfway out, the ice groans under you, and drops an inch. {enemy.name} told you this morning the pond was solid all the way across. You get back to the bank on your hands and knees, and go out again the long way round.", "if": "enemy" },
        { "find": "lamp", "in": "stock", "match": { "uniqueId": "roseLamp" } },
        {
          "choose": [
            {
              "label": "Light the lamp and set it on the ice above the window",
              "hint": "(answer him)",
              "disabled": "!lamp",
              "music": "tender",
              "then": [
                { "take": "lamp" },
                {
                  "narrate": [
                    "The match takes the third time. The wick catches, the roses on the globe come up pink and gold, and you set it down on the black ice right over the lit window.",
                    "Nothing, at first. Then, below, the young man turns from the window, and the light behind him goes out. Something moves up through the dark water toward yours, slowly, the way you'd climb a hill you know.",
                    "Frost flowers open on the ice round the lamp, one after another, as if something were breathing out under them. Then the pond is just a pond, black and empty, with stars in it."
                  ]
                },
                { "say": "orsolya", "text": "There. He's come up. That's all anyone ever wanted, you know. A light left on." },
                { "rep": 6, "why": "Answered the lamp under Hob's Pond" },
                { "set": { "iceEnd": "answered" } },
                { "hook": "pond", "with": { "lit": false } }
              ]
            },
            {
              "label": "Take it home and keep it lit in your own window",
              "hint": "(every winter night)",
              "disabled": "!lamp",
              "then": [
                { "edit": "lamp", "set": { "name": "The rose lamp, lit in your window", "nosale": true } },
                { "refresh": "panel" },
                { "narrate": "You carry it back up the hill. That night it goes in the shop window, lit, and you sit up with it for a while." },
                { "say": "orsolya", "text": "He'll see that. He'll come and stand outside, some nights. You'll know. The step will be wet in the morning." },
                { "rep": 2, "why": "Kept the Teagues' lamp lit" },
                { "set": { "iceEnd": "kept" } },
                { "hook": "pond", "with": { "lit": false } }
              ]
            },
            {
              "label": "Ring Mrs. Akers in the morning",
              "hint": "(+$260)",
              "disabled": "!lamp",
              "then": [
                { "take": "lamp" },
                { "coin": 260, "why": "Sold the rose lamp to Akers Antiques" },
                { "say": "orsolya", "text": "Money for a light. I won't say what I think. You can see it in my face. Look at my face." },
                { "set": { "iceEnd": "sold" } }
              ]
            },
            {
              "label": { "if": "lamp", "then": "Leave it in the bag", "else": "You didn't bring a lamp" },
              "then": [
                { "narrate": "You stand on the ice and do nothing. Below, the window stays lit, and he stays by it, looking up." },
                { "say": "orsolya", "text": "Then he waits. He has had a lot of practice." },
                { "set": { "iceEnd": "dark" } }
              ]
            }
          ]
        },
        { "set": { "iceDone": true } }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "rowan", "scene": "iceRowan" },
    { "at": "1-4", "cast": "orsolya", "scene": "iceOrsolya", "if": "!flag.iceDone" },
    { "at": "2-1", "cast": "rowan", "scene": "iceRowanBack", "if": "flag.iceIn && !flag.iceDone && hook.lampHere" },
    { "at": "2-2", "cast": "akers", "scene": "iceAkers", "if": "flag.iceIn && !flag.iceDone && hook.lampHere" }
  ],
  "nights": [
    {
      "id": "ice-pond",
      "window": ["2-3", "3-1"],
      "if": "flag.icePond && !flag.iceDone",
      "scene": "icePondNight",
      "test": [{ "set": { "icePond": true } }]
    },
    {
      "id": "ice-ledger",
      "window": ["3-1", "3-4"],
      "if": "flag.iceSeen && !flag.iceDone",
      "scene": "iceLedger",
      "test": [{ "set": { "iceSeen": true } }, { "add": { "unique": "iceTag" } }]
    },
    {
      "id": "ice-finale",
      "window": ["3-4", "4-4"],
      "if": "flag.iceLedger && !flag.iceDone",
      "scene": "iceFinale",
      "test": [{ "set": { "iceLedger": true } }, { "add": { "unique": "roseLamp" }, "if": "random < 0.8" }]
    }
  ],
  "calendar": [
    { "id": "ice-pond", "night": "ice-pond", "story": "undertheice", "where": "Hob's Pond", "title": "The window under the ice", "known": "flag.icePond", "scene": "icePondNight" },
    { "id": "ice-ledger", "night": "ice-ledger", "story": "undertheice", "where": "The Historical Society", "title": "The ice company's books", "known": "flag.iceSeen", "scene": "iceLedger" },
    { "id": "ice-finale", "night": "ice-finale", "story": "undertheice", "where": "Hob's Pond", "title": "The coldest night", "known": "flag.iceLedger", "scene": "iceFinale" }
  ],
  "epilogue": [
    { "line": "Nobody has seen a light under Hob's Pond since. Clara Teague died in March, in her sleep, and the nurses said she was smiling about something.", "if": "flag.iceEnd == 'answered'" },
    { "line": "The rose lamp stands in Clara Teague's window at the home on Cliff Road, unlit. The light under Hob's Pond went out the night it arrived.", "if": "flag.iceEnd == 'home'" },
    { "line": "Every winter night the rose lamp burns in your window. Some mornings the front step is wet, as if someone stood there for a long time.", "if": "flag.iceEnd == 'kept'" },
    { "line": "The rose lamp is in a shop window in Concord with a little card. The light under Hob's Pond burned until the thaw, and the town closed the pond to skaters.", "if": "flag.iceEnd == 'sold'" },
    { "line": "The light under Hob's Pond burned all winter. When the ice went out in March it was gone, and nobody could say where.", "if": "flag.iceEnd == 'dark'" }
  ],
  "talk": {
    "by": "orsolya",
    "rumour": [
      "The children skating on Hob's Pond say there is a lit window under the ice. Children see what's there. It's grown-ups who learn not to.",
      "I went to look. I put my hands round my eyes. I will say only this: somebody down there is expecting company."
    ],
    "react": { "answered": "The light under Hob's Pond has gone out. Not the way a candle goes out. The way someone closes a door behind them when they're finally home.", "home": "Clara Teague has her lamp back on her windowsill. The pond is dark. Some things only need to be where they belong.", "kept": "There's a lamp in your window every night now. I walked past at midnight. There were wet footprints on your step, going nowhere.", "sold": "You sold a light somebody was waiting for. It's in Concord with a price on it. The pond is still lit. I can't look at you just now.", "dark": "The window under the pond is still lit. He's still waiting. Somebody always ends up waiting, in my experience. It's usually the dead." },
    "sway": {
      "answered": { "orsolya": 2, "hester": 1 },
      "home": { "orsolya": 1, "hester": 2 },
      "kept": { "orsolya": 1 },
      "sold": { "orsolya": -3, "hester": -1 },
      "dark": { "orsolya": -1 }
    }
  }
});
