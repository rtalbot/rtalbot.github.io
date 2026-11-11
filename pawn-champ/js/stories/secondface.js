// Pawn Champ - The Second Face: the same man comes in twice in one day, once as himself and once as
// the bank manager. Minor quest m48, batch G (docs/quests/MINOR.md).
// Percy Tuttle has a talent for faces and is trying on better lives. A lunch errand at the Rusty Anchor.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/secondface.js.
defineStory({
  "id": "secondface",
  "kind": "minor",
  "title": "The Second Face",
  "location": "rustyanchor",
  "rumour": "The manager of the Hollow Neck Savings Bank was seen in two places at once on Tuesday.",
  "endings": { "stage": "Open Mic", "packed": "Packed Away", "reported": "Reported" },
  "about": [
    "A comedy of disguise. Shy Percy Tuttle, who works nights at the bottle redemption, sells you his old Grange pantomime makeup kit (§{percyCase}). Later \"Mr. Bramwell\", manager of the Savings Bank, comes in to buy the kit back for Mr. Tuttle, discreetly, with a silver moustache, Percy's ears, and a habit of saying sorry (§{percyBank}).",
    "Sell \"Bramwell\" the kit (Packed Away), call the real bank and have Barrow pick him up (Reported), or say \"Hello, Percy\". He admits people only listen to him in disguise and asks you to come to his open-mic slot at the Rusty Anchor (§{faceAnchor}). Give him the kit and he does Gordie, Marguerite and Barrow to a delighted bar, or let him go on as himself (both Open Mic); slip out and the kit stays in your back room (Packed Away)."
  ],
  "cast": {
    "percy": {
      "name": "Percy Tuttle",
      "look": { "skin": "#e8c8a8", "hair": "#7a5a3a", "hs": 4, "coat": "#5a6a5a", "style": "puffer", "pants": "#4a4a42", "bag": "#2a2a2e" }
    },
    "percyBank": {
      "name": "Mr. Bramwell, from the bank",
      "look": { "skin": "#e8c8a8", "hair": "#c8c8c8", "hs": 0, "coat": "#2a2a3a", "style": "suit", "pants": "#2a2a3a", "bag": "#2a2a2e", "trim": "#e8e0c8", "long": true, "glasses": "#c8a050", "moustache": "#c8c8c8" }
    }
  },
  "uniques": {
    "makeupCase": {
      "name": "Theatrical makeup case",
      "icon": "writebox",
      "cat": "curio",
      "guide": 40,
      "questKey": true,
      "tells": [
        "A black japanned case that opens in three tiers: greasepaint, crepe hair, spirit gum, a box of noses.",
        "Inside the lid, a dozen photographs of the same face, made up as a dozen different men."
      ]
    }
  },
  "scenes": {
    "percyCase": {
      "title": "Percy Tuttle sells his makeup kit",
      "customer": "percy",
      "steps": [
        {
          "say": "percy",
          "text": [
            "Sorry. Hi. Percy. Tuttle. I work nights at the bottle redemption. Do you take, um. Makeup? Not makeup. Stage makeup. It's a kit.",
            "I used to do the Grange pantomime. Everyone. I did the whole cast one year when the flu went round. I don't really need it any more."
          ]
        },
        { "offer": { "unique": "makeupCase" }, "persona": "desperate", "asking": 30, "min": 18 },
        {
          "if": "offer == 'deal'",
          "then": [{ "set": { "faceCase": true } }, { "say": "percy", "text": "Thanks. Thank you. Sorry." }],
          "else": [
            { "set": { "faceCase": false } },
            { "say": "percy", "text": "No, no, that's fine. Sorry." }
          ]
        },
        { "leave": "percy" }
      ]
    },
    "percyBank": {
      "title": "\"Mr. Bramwell, from the bank\" wants the case back",
      "customer": "bramwell",
      "steps": [
        {
          "say": "bramwell",
          "text": [
            "Afternoon! Rupert Bramwell, manager, Hollow Neck Savings. We like to know the businesses on Front Street personally. Firm handshake. There.",
            "One of our customers, a Mr. Tuttle, may have pawned a makeup case with you this morning. Sentimental value. The bank would like to buy it back for him. Discreetly."
          ]
        },
        { "narrate": "He has a silver moustache and a very good suit, and Percy Tuttle's ears, and Percy Tuttle's bag. He also says \"sorry\" under his breath when he bumps the counter." },
        { "find": "kit", "in": "stock", "match": { "uniqueId": "makeupCase" } },
        {
          "choose": [
            {
              "label": "\"Hello, Percy.\"",
              "then": [
                { "narrate": "The moustache droops. Not the man: the moustache. One corner has come unstuck." },
                {
                  "say": "bramwell",
                  "text": [
                    "Nobody ever... how did you... sorry. Sorry. It's just that people LISTEN to Mr. Bramwell. Nobody listens to Percy.",
                    "I'm on at the Anchor's open mic at lunch. I don't know why I signed up. Ruthie made me. Will you come? Then at least one person in the room will know who I am."
                  ]
                },
                { "set": { "faceKnown": true } },
                { "plan": "face-anchor", "after": 1 },
                { "toast": "Calendar: the open mic at the Rusty Anchor, at lunch", "look": "percy" },
                { "leave": "bramwell" },
                { "end": true }
              ]
            },
            {
              "label": "Sell \"Mr. Bramwell\" the case",
              "hint": "(+$45)",
              "if": "kit",
              "then": [
                { "take": "kit" },
                { "refresh": "panel" },
                { "coin": 45, "why": "Sold the makeup case to \"Mr. Bramwell\"" },
                { "say": "bramwell", "text": "Splendid. The bank thanks you. Sorry. The BANK thanks you." },
                { "set": { "faceEnd": "packed" } }
              ]
            },
            {
              "label": "Play along, then call the real bank",
              "hint": "(heat -3)",
              "then": [
                { "narrate": "You tell him you'll look in the back. From the back you ring the Savings Bank, where the real Mr. Bramwell, bald, is at his desk eating soup. Barrow is round by four. Percy cries in the cruiser and apologizes to the upholstery." },
                { "set": { "faceEnd": "reported" } },
                { "heat": -3 },
                { "edit": "kit", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel", "if": "kit" }
              ]
            }
          ]
        },
        { "leave": "bramwell", "hurry": true }
      ]
    },
    "faceAnchor": {
      "title": "Open mic at the Rusty Anchor",
      "steps": [
        { "hook": "anchorStage", "with": true, "note": "The Anchor with its little stage out." },
        {
          "stage": "rustyanchor",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "ruthie", "cast": "ruthie", "at": [160, 160] },
            { "id": "percy", "cast": "percy", "at": [266, 150], "facingLeft": true }
          ]
        },
        { "narrate": "The Rusty Anchor's lunchtime open mic: a man with a ukulele, a girl reading a poem about her ex, and then Percy Tuttle, white as a napkin, under the one good light." },
        { "find": "kit", "in": "stock", "match": { "uniqueId": "makeupCase" } },
        {
          "choose": [
            {
              "label": "Give him back the makeup case before he goes on",
              "disabled": "!kit",
              "then": [
                { "take": "kit" },
                { "refresh": "panel" },
                { "rep": 2 },
                { "narrate": "He takes the case into the gents. He comes out as Gordie Haines, and does two minutes of Gordie selling a Buick to a lobster. Then Marguerite Oyelaran ruling the lobster out of order. Then Captain Barrow, sunflower seeds and all. The bar can't breathe." },
                { "say": "ruthie", "text": "He's back next Thursday. And the one after. I don't care if he comes as the Pope." },
                { "set": { "faceEnd": "stage" } }
              ]
            },
            {
              "label": "Let him go on as himself",
              "then": [
                { "rep": 1 },
                { "narrate": "He goes on with his own face and does nine minutes about the bottle redemption on Route 1. Some of it is very funny. Most of it is very sad. Ruthie gives him a free half, which at the Anchor is a standing ovation." },
                { "set": { "faceEnd": "stage" } },
                { "edit": "kit", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel", "if": "kit" }
              ]
            },
            {
              "label": "Slip out before he starts",
              "hint": "(keep the case)",
              "then": [
                { "narrate": "You slip out before he's on. The case sits in your back room, and every time you pass it you think of a dozen faces in the lid looking at you." },
                { "set": { "faceEnd": "packed" } },
                { "edit": "kit", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel", "if": "kit" }
              ]
            }
          ]
        },
        { "hook": "anchorStage", "with": false }
      ]
    }
  },
  "beats": [
    { "drift": "face-percy", "from": "1-4", "to": "3-2", "cast": "percy", "scene": "percyCase", "note": "The same day: himself in the morning, the bank manager in the afternoon." },
    { "drift": "face-percy", "from": "1-4", "to": "3-2", "cast": "percyBank", "scene": "percyBank", "last": true, "if": "(flag.faceCase == true || flag.faceCase == false) && !flag.faceEnd" }
  ],
  "errands": [
    {
      "id": "face-anchor",
      "title": "Open mic",
      "where": "the Rusty Anchor",
      "scene": "faceAnchor",
      "test": [{ "set": { "faceKnown": true } }, { "add": { "unique": "makeupCase" }, "if": "random < 0.7" }]
    }
  ],
  "calendar": [
    { "id": "face-anchor", "errand": "face-anchor", "story": "secondface", "where": "The Rusty Anchor", "title": "Open mic", "known": "flag.faceKnown" }
  ],
  "mornings": [
    { "find": "kit", "in": "stock", "match": { "uniqueId": "makeupCase", "questKey": true } },
    {
      "if": "kit && errand.face-anchor == -1",
      "note": "Missed the open mic: the case is just a case now.",
      "then": [
        { "edit": "kit", "set": { "questKey": false, "nosale": false } },
        { "refresh": "panel" },
        { "set": { "faceEnd": "packed" }, "if": "!flag.faceEnd" }
      ]
    }
  ],
  "talk": {
    "by": "gordie",
    "rumour": [
      "Rupert Bramwell from the Savings Bank test-drove a Buick on Tuesday. Then he test-drove it again, at the same time, from the other side of town. Different shoes.",
      "I don't know what's going on, but I sold him floor mats both times."
    ],
    "react": { "stage": "Some kid at the Anchor did me at the open mic. Selling a Buick to a lobster. I laughed so hard I bought him a drink. Then I hired him for the TV ad.", "packed": "The bank manager's only in one place at a time again. I miss the other one. He was a better tipper.", "reported": "Barrow picked up a fellow pretending to be the bank manager. I felt bad. I pretend to be a nice guy every day, and nobody arrests me." },
    "sway": { "stage": { "gordie": 2 }, "reported": { "gordie": -1 } }
  },
  "outcome": "flag.faceEnd"
});
