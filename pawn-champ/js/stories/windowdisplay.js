// Pawn Champ - The Window Display. Minor quest m78, batch M (docs/quests/MINOR.md#m78-the-window-display).
// December only. Every shop on Main Street dresses its window for Christmas Eve, when Hal Mayhew and
// the merchants judge them. You put a 1950s department-store bear in yours, and every morning the
// window has been rearranged overnight, better than you left it. Somebody has a key.
// Usually it's Augustin Leclair, who dressed the windows at Wexley's for twenty years and Odile's
// every December after; if The Rival Shop (M16) left Bryony Kettle across the street, it's Bryony,
// with a key she found taped behind Odile's old sign.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/windowdisplay.js.
defineStory({
  "id": "windowdisplay",
  "kind": "minor",
  "title": "The Window Display",
  "location": "shop",
  "months": [3],
  "rumour": "Every shop on Main Street dresses its window for Christmas Eve, and somebody keeps rearranging the Crooked Scale's.",
  "endings": { "theirs": "Their Window", "yours": "Your Window", "sold": "Sold from the Window" },
  "outcome": "flag.winEnd",
  "about": [
    "A December story. Marian Teague sells you the 1956 clockwork bear her uncle Augustin kept from the windows of Wexley's department store, and you dress your shop window around it for the Christmas Eve contest (§{marianBear}). Each night someone with a key rearranges your window, better each time.",
    "Sitting up to watch (§{winWatch}), you catch Augustin, who dressed Odile's windows every December and still has her key, wanting to do one last window before he goes into a home. If The Rival Shop has left Bryony across the street, it's Bryony instead, with a key she found among Odile's things. Let them dress it and win best window (Their Window), take the key back and come third (Your Window), or sell the bear to a toy collector (Sold from the Window)."
  ],
  "notes": "hook.bryony: Bryony is still across the street (The Rival Shop ran, this month or an earlier one, and she neither closed nor moved in with you, and she's still there after M16's arc). Then it's her with the key; otherwise Augustin.",
  "cast": {
    "marian": {
      "name": "Marian Teague",
      "look": { "skin": "#e8c0a0", "hair": "#7a5a3a", "hs": 3, "coat": "#3a5a4a", "style": "puffer", "pants": "#2a2a30", "bag": "#5a3a2a" }
    },
    "augustin": {
      "name": "Augustin Leclair",
      "look": { "skin": "#e8c0a0", "hair": "#f0f0f0", "hs": 0, "coat": "#2a2a3a", "trim": "#c84a3a", "style": "suit", "pants": "#2a2a3a", "glasses": "#c8a050", "moustache": "#f0f0f0" }
    }
  },
  "icons": {
    "windowbear": [
      "..kk....kk..",
      ".kwwk..kwwk.",
      ".kwwkkkkwwk.",
      "..kwwwwwwk..",
      "..kwkwwkwk..",
      "..kwwnnwwk..",
      "...kwwwwk...",
      "..krrrrrrk..",
      ".kwrrYYrrwk.",
      "..krrrrrrk..",
      "..kkk..kkk..",
      "............"
    ]
  },
  "uniques": {
    "windowBear": {
      "name": "Wexley's window bear (1956, clockwork)",
      "icon": "windowbear",
      "cat": "curio",
      "guide": 160,
      "questKey": true,
      "tells": [
        "A clockwork bear in a red coat, two feet tall. Wound up, it turns its head and lifts one paw.",
        "A brass plate on the base: WEXLEY'S OF HOLLOW NECK. CHRISTMAS 1956. And a paper tag in a careful hand: \"A.L. - left paw sticks in the cold.\""
      ]
    }
  },
  "scenes": {
    "marianBear": {
      "title": "Marian Teague sells her uncle's window bear",
      "customer": "marian",
      "steps": [
        {
          "say": "marian",
          "text": [
            "Marian Teague. I'm clearing my uncle's apartment over the bakery. He's going into the Alden House home. He has a bear.",
            "It's from Wexley's, the department store. Uncle Augustin did their windows for twenty years, till they shut in 1979. He kept the bear. He kept everything. He has keys to half of Main Street and won't say why.",
            "Sixty? And put it in your window. That's what it's for. It's been in a closet for forty-seven years."
          ]
        },
        { "offer": { "unique": "windowBear" }, "persona": "honest", "asking": 60, "min": 45 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "marian", "text": "The Historical Society said no too. Nobody wants a bear in December. In DECEMBER." },
            { "leave": "marian" },
            { "end": true }
          ]
        },
        { "set": { "winIn": true } },
        { "say": "marian", "text": "The judging's Christmas Eve. Hal Mayhew and the merchants walk the street with a clipboard. Odile won eleven years running. She never once admitted to dressing her own window." },
        { "narrate": "After she's gone you wind the bear and set it in the window. What do you build around it?" },
        {
          "choose": [
            {
              "label": "A snowy village of cotton wool",
              "then": [
                { "set": { "winTheme": 0 } },
                { "narrate": "You spend your lunch on a snowy village of cotton wool. It looks fine. It looks like a pawnshop tried." }
              ]
            },
            {
              "label": "The bear at a desk, doing the accounts",
              "then": [
                { "set": { "winTheme": 1 } },
                { "narrate": "You spend your lunch on the bear at a desk, doing the accounts. It looks fine. It looks like a pawnshop tried." }
              ]
            },
            {
              "label": "The bear in a rowboat on a mirror",
              "then": [
                { "set": { "winTheme": 2 } },
                { "narrate": "You spend your lunch on the bear in a rowboat on a mirror. It looks fine. It looks like a pawnshop tried." }
              ]
            }
          ]
        },
        { "leave": "marian" }
      ]
    },
    "winWatch": {
      "title": "Sitting up to watch the window",
      "steps": [
        { "view": { "candleX": 140 } },
        {
          "stage": "shopNight",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }]
        },
        {
          "narrate": [
            "Two in the morning. You're sitting in the dark behind the counter with a cold coffee and the cat, watching your own window.",
            "At ten past, a key turns in the front door. Somebody lets themself in, wipes their boots on the mat, and goes straight to the window without turning on a light."
          ]
        },
        { "enter": { "id": "who", "cast": "bryony", "at": [70, 166] }, "if": "hook.bryony" },
        { "enter": { "id": "who", "cast": "augustin", "at": [70, 166] }, "if": "!hook.bryony" },
        {
          "if": "hook.bryony",
          "then": [
            {
              "say": "who",
              "text": [
                "Oh, for... You're UP? Fine. Fine. Yes. It's me.",
                { "if": "flag.rivalSign == 'hers'", "then": "There was a key taped behind Odile's old sign. The one I bought. I found it putting up the hook.", "else": "There was a key taped under the counter I bought at Odile's estate sale. Labeled FRONT DOOR. In her handwriting. Who does that?" },
                "And I have to look at your window from my counter all day. All day! Cotton wool. It was a crime against retail. Somebody had to."
              ]
            }
          ],
          "else": [
            {
              "say": "who",
              "text": [
                "Ah. I hoped you'd be asleep. Augustin Leclair. I did the windows at Wexley's, 1959 to 1979, and Odile's every December after that. She gave me a key in 1980. Nobody ever asked for it back.",
                "My niece sold you my bear. Quite right. But he sulks in a bad window. Look at him. He's much happier on the ledgers.",
                "I'm going into Alden House on the second of January. I would like, very much, to do one more window."
              ]
            }
          ]
        },
        { "find": "bear", "in": "stock", "match": { "uniqueId": "windowBear" } },
        {
          "choose": [
            {
              "label": { "if": "hook.bryony", "then": "Let Bryony finish the window", "else": "Give Augustin the window, and the bear" },
              "hint": { "if": "hook.bryony", "then": "(the street will know whose it is)", "else": "(he dresses it for Christmas Eve)" },
              "then": [
                { "set": { "winEnd": "theirs" } },
                {
                  "if": "hook.bryony",
                  "then": [
                    { "say": "who", "text": "You're letting me? Really? I'll need the brass from your case. And the cat, for an hour. Don't look at me like that, the cat wants to." },
                    { "narrate": "On Christmas Eve the Crooked Scale wins best window on Main Street. Reclaimed & Co., across the street, comes second. Bryony is delighted about one of these, and very loud about the other." }
                  ],
                  "else": [
                    { "say": "who", "text": "Thank you. Leave the ledgers. Leave the cat. Go to bed." },
                    { "narrate": "On Christmas Eve the merchants crowd round your window. The bear stands on Odile's old ledgers, lifting one paw, with a tiny brass key in it. You win. Augustin, across the street in his good coat, does not clap, but he does take his hat off." }
                  ]
                },
                { "coin": 50, "why": "Best window on Main Street (a gift certificate to Mayhew's)" },
                { "rep": 4 },
                {
                  "if": "bear",
                  "then": [
                    { "edit": "bear", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            {
              "label": "Take the key back and dress it yourself",
              "then": [
                { "set": { "winEnd": "yours" } },
                {
                  "say": "who",
                  "text": { "if": "hook.bryony", "then": "Fine. FINE. Cotton wool it is. Enjoy third place.", "else": "Of course. It's your window. It's been your window for a while now. Odile would say so." }
                },
                { "narrate": "You dress it yourself. On Christmas Eve you come third, behind Mayhew's pyramid of snow shovels and the bakery's gingerbread lighthouse. Third is respectable. You keep telling yourself that." },
                { "rep": 1 },
                {
                  "if": "bear",
                  "then": [
                    { "edit": "bear", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            {
              "label": "Sell the bear to the toy collector who keeps asking",
              "hint": "(+$220)",
              "disabled": "!bear",
              "then": [
                { "set": { "winEnd": "sold" } },
                { "sell": "bear" },
                { "coin": 220, "why": "Sold the Wexley's window bear to a toy collector" },
                {
                  "say": "who",
                  "text": { "if": "hook.bryony", "then": "You sold the BEAR? The bear was the only good thing in there!", "else": "He went to a collector? Well. He'll be in a glass case. He always hated glass cases. He liked the street." }
                },
                { "narrate": "Your window goes into Christmas Eve with a sign that says OPEN and some cotton wool. You don't place." }
              ]
            }
          ]
        }
      ]
    }
  },
  "mornings": [
    { "find": "bear", "in": "stock", "match": { "uniqueId": "windowBear" } },
    {
      "if": "flag.winIn && !flag.winEnd && bear && hook.fixDue",
      "then": [
        { "toast": "Your window has been rearranged overnight. The bear now stands on a pile of old ledgers, waving at the street. It's better. That's the annoying part.", "icon": "windowbear", "if": "!flag.winFixes" },
        { "set": { "winWatch": true }, "if": "!flag.winFixes" },
        { "toast": "Calendar: sit up and watch the window", "icon": "windowbear", "if": "!flag.winFixes" },
        { "toast": "Rearranged again. The silver has been polished and set out like a table laid for a feast nobody's come to yet. People are stopping.", "icon": "windowbear", "if": "flag.winFixes == 1" },
        { "toast": "Again. A strand of white lights nobody bought, and the bear holding a tiny brass key. You have never owned a strand of white lights.", "icon": "windowbear", "if": "flag.winFixes == 2" },
        { "hook": "fixed", "note": "remembers the day (winLast) and counts it (winFixes)" }
      ]
    }
  ],
  "beats": [{ "drift": "windowdisplay", "from": "1-3", "to": "2-1", "cast": "marian", "scene": "marianBear" }],
  "nights": [
    {
      "id": "window-watch",
      "window": ["2-2", "3-4"],
      "if": "flag.winWatch && !flag.winEnd",
      "scene": "winWatch",
      "test": [
        { "set": { "winIn": true, "winWatch": true, "winTheme": 0 } },
        { "set": { "rivalIn": true, "rivalEnd": "overflow" }, "if": "random < 0.5" },
        { "add": { "unique": "windowBear" } }
      ]
    }
  ],
  "calendar": [
    { "id": "window-watch", "night": "window-watch", "story": "windowdisplay", "where": "Your shop, after hours", "title": "Watch the window", "known": "flag.winWatch", "scene": "winWatch" }
  ],
  "epilogue": [
    {
      "line": { "if": "hook.bryony", "then": "The Crooked Scale had the best window on Main Street this Christmas. Bryony Kettle dressed it, and tells everyone, and nobody believes her.", "else": "Augustin Leclair dressed one last window, yours, and it won. He moved into Alden House on the second of January with the key still on his ring." },
      "if": "flag.winEnd == 'theirs'"
    },
    { "line": "You dressed your own window and came third. Next year, you've decided, there will be no cotton wool.", "if": "flag.winEnd == 'yours'" },
    { "line": "The Wexley's bear lives in a glass case in a toy collector's house. He lifts one paw when he's wound. Nobody winds him.", "if": "flag.winEnd == 'sold'" }
  ],
  "talk": {
    "by": "hal",
    "rumour": [
      "Window contest's on again. Every shop on Main Street dresses up, and the merchants judge Christmas Eve. I'm on the clipboard.",
      "Odile won eleven years running, and she never once admitted to dressing her own window. Make of that what you like."
    ],
    "react": { "theirs": "Best window on Main Street. I gave you a ten on the clipboard. I gave the bear a ten separately.", "yours": "Third place. Respectable. My snow shovels came second, which I'm told is not \"festive\".", "sold": "Your window this year was a sign that said OPEN. I gave it a two. The two was for honesty." }
  }
});
