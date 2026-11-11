// Pawn Champ - Mister Fathom's Other Families. Minor quest m14, batch E (docs/quests/MINOR.md).
// The shop cat has been eating dinner at two other houses on Front Street, under two other names.
// Its scene is a lunch errand in a Front Street kitchen.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/fathom.js.
defineStory({
  "id": "fathom",
  "kind": "minor",
  "title": "Mister Fathom's Other Families",
  "location": "kitchen",
  "rumour": "The cat from the pawnshop eats at my house every night.",
  "endings": { "three": "Three Homes", "one": "One Home" },
  "outcome": "flag.fathomEnd",
  "about": [
    "A gentle comedy about the shop cat. Hattie Tulley tells you the cat eats dinner at her house every night and answers to Biscuit (§{hattieCat}); the next day Walt Brann says the cat has breakfast at his and is called Admiral, and offers you the collar the cat won't wear (§{waltCollar}). Hattie invites you both to her kitchen to settle whose cat he is.",
    "Over sardines (§{fathomKitchen}), with the cat eating them, Hattie mentions that Odile had her own name for him. Share him with a collar of three name tags, one left blank for Odile's name, and gifts turn up on your doormat (Three Homes), or claim him as the shop's cat alone and he sulks (One Home)."
  ],
  "cast": {
    "hattie": {
      "name": "Hattie Tulley",
      "look": { "skin": "#e8c8b0", "hair": "#d8d8d8", "hs": 3, "coat": "#7a9aba", "style": "dress", "trim": "#e8e0d0", "pants": "#4a4a5a", "glasses": "#4a4a4e", "bag": "#8a4a3a" }
    },
    "walt": {
      "name": "Walt Brann",
      "look": { "skin": "#c89070", "hair": "#5a4a3a", "hs": 0, "coat": "#e8c020", "style": "puffer", "hat": "beanie", "hatc": "#2a3a5a", "beard": "#5a4a3a", "pants": "#2a3a4a", "stout": true }
    }
  },
  "icons": {
    "collar": [
      "............",
      "...kkkkkk...",
      "..krrrrrrk..",
      ".krk....krk.",
      ".kr......rk.",
      ".kr......rk.",
      ".krk....krk.",
      "..krrrrrrk..",
      "...kkyykk...",
      "....kYyk....",
      "....kyyk....",
      ".....kk....."
    ]
  },
  "uniques": {
    "fathomCollar": {
      "name": "Mister Fathom's collar",
      "icon": "collar",
      "cat": "curio",
      "guide": 8,
      "questKey": true,
      "tells": ["Red leather, a brass bell, and room on the ring for a name tag or three."]
    }
  },
  "scenes": {
    "hattieCat": {
      "title": "Hattie Tulley: your cat eats at my house",
      "customer": "hattie",
      "steps": [
        {
          "say": "hattie",
          "text": [
            "Hattie Tulley, Front Street. I'm only in to look. And to say your cat eats at my house every night.",
            "Grey, a torn ear, yellow eyes. Sleeps on that amp. I call him Biscuit. He has the sardines and the good cushion and he leaves at six sharp.",
            "I thought he was a stray. He has a very good stray voice."
          ]
        },
        {
          "choose": [
            {
              "label": "\"He's the shop cat. He does seem to get about.\"",
              "then": [{ "say": "hattie", "text": "Well, he's welcome. He's company." }]
            },
            {
              "label": "\"Biscuit? He's never answered to anything here.\"",
              "then": [{ "say": "hattie", "text": "He answers to Biscuit. Perhaps you're saying it wrong." }]
            }
          ]
        },
        { "set": { "fathomHattie": true } },
        { "leave": "hattie" }
      ]
    },
    "waltCollar": {
      "title": "Walt Brann's cat won't wear the collar",
      "customer": "walt",
      "steps": [
        { "hook": "keeper", "sets": ["you"] },
        { "say": "walt", "text": "Walt Brann. I bought my cat a collar and he won't wear it. Grey lad, torn ear. Admiral, I call him. Breakfast at mine, every day, six till half past." },
        {
          "say": "you",
          "text": { "if": "flag.fathomHattie", "then": "Grey, torn ear, yellow eyes? He has dinner with Hattie Tulley. And he lives here.", "else": "Grey, torn ear, yellow eyes? That's the shop cat. He lives here." }
        },
        { "say": "walt", "text": "Does he now. Then he's got three homes and pays rent at none of them." },
        { "offer": { "unique": "fathomCollar" }, "persona": "honest", "asking": 10, "min": 6 },
        { "set": { "fathomInvite": true } },
        { "plan": "fathom-kitchen" },
        { "say": "walt", "text": "Hattie says we should all sit down and sort out whose cat he is. Her kitchen, lunchtime {placed:fathom-kitchen}. I'll bring the sardines." },
        { "toast": "Calendar: Hattie Tulley's kitchen, lunchtime {placed:fathom-kitchen}", "look": "walt" },
        { "leave": "walt" }
      ]
    },
    "fathomKitchen": {
      "title": "Whose cat is he?",
      "steps": [
        { "hook": "cat", "with": true },
        {
          "stage": "kitchen",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 164] },
            { "id": "hattie", "cast": "hattie", "at": [200, 156], "facingLeft": true },
            { "id": "walt", "cast": "walt", "at": [228, 160], "facingLeft": true }
          ]
        },
        { "narrate": "Hattie Tulley's kitchen. Three cups of tea, a plate of sardines, and on the windowsill, eating the sardines, a grey cat with a torn ear who regards all three of you without the slightest guilt." },
        { "say": "hattie", "text": "Biscuit." },
        { "say": "walt", "text": "Admiral." },
        { "say": "hattie", "text": "Odile had her own name for him, you know. She never told me what it was. She said he'd tell you himself if he liked you." },
        { "say": "walt", "text": "So. Whose is he?" },
        { "find": "collar", "in": "stock", "match": { "uniqueId": "fathomCollar" } },
        {
          "choose": [
            {
              "label": "Share him: a collar with three name tags",
              "hint": { "if": "collar", "then": "(the collar from your stock)" },
              "then": [
                { "set": { "fathomEnd": "three" } },
                { "narrate": "Hattie finds three little brass tags in her sewing tin. BISCUIT. ADMIRAL. And the third one you leave blank, for whatever Odile called him." },
                { "say": "walt", "text": "Breakfast at mine, dinner at Hattie's, and the rest of the day he sits in your shop looking important. Sounds like a councillor." },
                { "rep": 2, "why": "Shared the cat with Front Street" },
                { "hook": "giftsIn", "with": 2 }
              ]
            },
            {
              "label": "He's the shop's cat. One home, one name.",
              "then": [
                { "set": { "fathomEnd": "one" } },
                { "say": "hattie", "text": "Fair enough. He was yours first. Well. Odile's." },
                { "say": "walt", "text": "I'll miss him at breakfast. Tell him the door's open." },
                { "narrate": "That night the cat is back on the amp at six. He stares at you until you look away, then goes to sleep facing the wall." }
              ]
            }
          ]
        },
        { "take": "collar" },
        { "hook": "cat", "with": false }
      ]
    }
  },
  "beats": [
    { "at": "2-3", "cast": "hattie", "scene": "hattieCat" },
    { "at": "2-4", "cast": "walt", "scene": "waltCollar" }
  ],
  "errands": [
    {
      "id": "fathom-kitchen",
      "title": "Whose cat is he?",
      "where": "Hattie Tulley's kitchen, Front Street",
      "scene": "fathomKitchen",
      "test": [{ "add": { "unique": "fathomCollar" } }]
    }
  ],
  "calendar": [
    { "id": "fathom-kitchen", "errand": "fathom-kitchen", "story": "fathom", "where": "Hattie Tulley's kitchen", "title": "Whose cat is he?", "known": "flag.fathomInvite" }
  ],
  "mornings": [
    {
      "if": "hook.giftsDue",
      "note": "Three Homes: the neighbors look after their shared cat, and their shared shop",
      "then": [
        { "set": { "fathomGifts": 0 } },
        { "toast": "On the doormat: a fish from Walt, a pie from Hattie, and a note. \"For the cat. And you.\" The cat got to the fish first.", "look": "hattie" },
        { "rep": 1 }
      ]
    }
  ],
  "epilogue": [
    { "line": "The shop cat wears a red collar with three tags, one of them blank. He eats three dinners a day and is not getting any thinner about it.", "if": "flag.fathomEnd == 'three'" },
    { "line": "The shop cat still visits Front Street. He just doesn't stay for dinner any more.", "if": "flag.fathomEnd == 'one'" }
  ]
});
