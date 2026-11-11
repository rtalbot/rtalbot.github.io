// Pawn Champ - Four Accounts of a Lamp: a leaded-glass lamp broken at the Grange, and four
// regulars who each tell it so they come out of it well. Minor quest m42, batch G (docs/quests/MINOR.md).
// Father Ignatius pawns the pieces; at the Saint Brine's soup lunch you hear all four and decide who pays.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/lamp.js.
defineStory({
  "id": "lamp",
  "kind": "minor",
  "title": "Four Accounts of a Lamp",
  "location": "grange",
  "rumour": "Somebody broke the Grange Hall's leaded-glass lamp, and four people have owned up to being nowhere near it.",
  "endings": { "split": "Four Ways", "blamed": "One to Blame", "mended": "Mended" },
  "uniques": {
    "grangeLamp": {
      "name": "Leaded-glass lamp (broken)",
      "icon": "hlamp",
      "cat": "art",
      "guide": 30,
      "questKey": true,
      "condLabel": "In pieces",
      "tells": [
        "Leaded glass in amber and green: a dragonfly shade, about 1910. Three panels cracked and one gone.",
        "The base is fine. There's a smear of cake frosting on the switch."
      ]
    }
  },
  "about": [
    "A comedy of four witnesses. Father Ignatius brings in the Grange Hall's broken dragonfly lamp, which has lit the Saint Brine's soup lunch since 1910, and says four good people have each told him how they tried to save it (§{ignatiusLamp}). He asks you to hold it and come to the soup lunch to hear them.",
    "At the lunch (§{lampLunch}) Hal, Bettany, Gordie and Marguerite each give their heroic account, and the clues (frosting on the light switch, a stepladder, a man shouting about chains, everyone standing up) suggest they all had a hand in it. Say it was all four and they split the repair (Four Ways), pick one of them to pay (One to Blame), or pay to mend it yourself and keep it (Mended)."
  ],
  "scenes": {
    "ignatiusLamp": {
      "title": "Father Ignatius brings in the broken lamp",
      "customer": "ignatius",
      "steps": [
        {
          "say": "ignatius",
          "text": [
            "The dragonfly lamp from the Grange Hall. It's lit the Saint Brine's soup lunch since 1910. On Sunday somebody broke it, and four good people have each explained to me, at length, how they were the one who tried to save it.",
            "Hold it for me? The repair is a hundred and fifty dollars. Come to the soup lunch and hear them. You don't have to forgive anyone. That's my job."
          ]
        },
        { "offer": { "unique": "grangeLamp" }, "persona": "honest", "asking": 30, "min": 22 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "lampHeld": true } },
            { "plan": "lamp-lunch", "after": 2 },
            { "toast": "Calendar: the soup lunch at the Grange Hall", "look": "ignatius" },
            { "say": "ignatius", "text": "Bless you. Bring an appetite. It's split pea, it's always split pea." }
          ],
          "else": [
            { "say": "ignatius", "text": "Fair enough. I'll keep it in the vestry with the other things I can't fix." }
          ]
        },
        { "leave": "ignatius" }
      ]
    },
    "lampLunch": {
      "title": "The soup lunch: four accounts of a lamp",
      "steps": [
        {
          "stage": "grange",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "hal", "cast": "hal", "at": [150, 160], "facingLeft": true },
            { "id": "bettany", "cast": "bettany", "at": [180, 157], "facingLeft": true },
            { "id": "gordie", "cast": "gordie", "at": [210, 160], "facingLeft": true },
            { "id": "marguerite", "cast": "marguerite", "at": [240, 157], "facingLeft": true }
          ]
        },
        { "find": "lamp", "in": "stock", "match": { "uniqueId": "grangeLamp" } },
        { "narrate": "The Grange Hall, the Saint Brine's soup lunch. Split pea, bread rolls, and an empty hook over the middle table where the dragonfly lamp used to hang. Four people find reasons to sit near you." },
        { "say": "hal", "text": "I saw it start to swing, on account of the draught, and I went for the stepladder. Quick as you like. If I'd been one second quicker." },
        { "say": "bettany", "text": "I was carrying the cake for Mrs. Haskell's birthday. I saw it going and I put the cake down, on the floor, to catch it. The cake was ruined. Nobody thanks you for a cake." },
        { "say": "gordie", "text": "I'll be honest with you, because I'm an honest man. Ask anyone on Route 1. I was the only one who said, from the start, that lamp needed a better chain." },
        { "say": "marguerite", "text": "I called the meeting to order. The lamp was swinging because people were standing up out of turn. I am not saying who. Points of order exist for a reason." },
        { "narrate": "There is frosting on the light switch. There was a stepladder in the middle of the room. There was a man shouting about chains. Everyone was standing up." },
        {
          "choose": [
            {
              "label": "Say it was all four of them, and they split the repair",
              "hint": "(they buy it back mended, +$40)",
              "then": [
                { "take": "lamp" },
                { "refresh": "panel", "if": "lamp" },
                { "coin": 40, "why": "Four regulars bought back the Grange lamp, mended" },
                { "rep": 2 },
                { "narrate": "A long pause. Then Bettany laughs, and Hal says \"the stepladder did wobble\", and Gordie says nothing for the first time anyone can remember, and Marguerite rules the motion carried. They split it four ways. The lamp goes back up in time for Advent." },
                { "set": { "lampEnd": "split" } }
              ]
            },
            {
              "label": "Pick one of them to pay",
              "hint": "(+$40, and they sulk)",
              "then": [
                { "take": "lamp" },
                { "refresh": "panel", "if": "lamp" },
                {
                  "choose": [
                    {
                      "label": "Hal Mayhew",
                      "then": [
                        { "coin": 40, "why": "Hal Mayhew paid for the Grange lamp" },
                        { "say": "hal", "text": "Fine. FINE. But I want it minuted that I was trying to help." },
                        { "set": { "lampEnd": "blamed", "lampBlamed": "hal" } }
                      ]
                    },
                    {
                      "label": "Bettany Lowe",
                      "then": [
                        { "coin": 40, "why": "Bettany Lowe paid for the Grange lamp" },
                        { "say": "bettany", "text": "Fine. FINE. But I want it minuted that I was trying to help." },
                        { "set": { "lampEnd": "blamed", "lampBlamed": "bettany" } }
                      ]
                    },
                    {
                      "label": "Gordie Haines",
                      "then": [
                        { "coin": 40, "why": "Gordie Haines paid for the Grange lamp" },
                        { "say": "gordie", "text": "Fine. FINE. But I want it minuted that I was trying to help." },
                        { "set": { "lampEnd": "blamed", "lampBlamed": "gordie" } }
                      ]
                    },
                    {
                      "label": "Marguerite Oyelaran",
                      "then": [
                        { "coin": 40, "why": "Marguerite Oyelaran paid for the Grange lamp" },
                        { "say": "marguerite", "text": "Fine. FINE. But I want it minuted that I was trying to help." },
                        { "set": { "lampEnd": "blamed", "lampBlamed": "marguerite" } }
                      ]
                    }
                  ]
                },
                { "narrate": "The lamp goes back up. The other three are very kind to the one who paid, in the way that people are kind when they've got away with something." }
              ]
            },
            {
              "label": "Pay for the repair yourself and keep the lamp",
              "hint": "(-$100, a lamp worth $180)",
              "disabled": "coin < 100 || !lamp",
              "then": [
                { "take": "lamp" },
                { "refresh": "panel", "if": "lamp" },
                { "coin": -100, "why": "Paid to mend the Grange lamp" },
                {
                  "add": {
                    "unique": "grangeLamp",
                    "name": "Leaded-glass dragonfly lamp",
                    "guide": 180,
                    "condLabel": "Mended",
                    "questKey": false,
                    "nosale": false,
                    "paid": 130,
                    "tells": [
                      "Leaded glass in amber and green: a dragonfly shade, about 1910. Mended, by someone who knew what they were doing."
                    ]
                  },
                  "if": "shelf.free"
                },
                { "refresh": "panel" },
                { "say": "marguerite", "text": "Well. That's one way to close a discussion." },
                { "set": { "lampEnd": "mended" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "lamp-ignatius", "from": "1-3", "to": "3-2", "cast": "ignatius", "scene": "ignatiusLamp" }
  ],
  "errands": [
    {
      "id": "lamp-lunch",
      "title": "The soup lunch",
      "where": "the Grange Hall",
      "scene": "lampLunch",
      "test": [
        { "set": { "lampHeld": true } },
        { "hook": "testCoin", "with": 150 },
        { "add": { "unique": "grangeLamp" } }
      ]
    }
  ],
  "calendar": [
    { "id": "lamp-lunch", "errand": "lamp-lunch", "story": "lamp", "where": "The Grange Hall", "title": "The soup lunch", "known": "flag.lampHeld" }
  ],
  "mornings": [
    {
      "find": "lamp",
      "in": "stock",
      "match": { "uniqueId": "grangeLamp", "questKey": true },
      "note": "Skipped the soup lunch: the lamp is just a lamp now."
    },
    {
      "if": "lamp && errand.lamp-lunch == -1",
      "then": [{ "edit": "lamp", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "talk": {
    "by": "ignatius",
    "rumour": [
      "The dragonfly lamp at the Grange Hall came down at the soup lunch. Four people have explained to me how they heroically tried to save it. I believe all four. I am a priest."
    ],
    "react": { "split": "The dragonfly lamp is back over the soup. Four good people paid for it, and three of them are still telling everyone they didn't need to.", "blamed": "The lamp is mended. One parishioner paid for it and has sat on the other side of the hall ever since. I am praying for everyone, unevenly.", "mended": "You have the dragonfly lamp in your window now? It looks happy. We have a strip light. The soup tastes worse." },
    "sway": { "split": { "ignatius": 2 }, "blamed": { "ignatius": -1 }, "mended": { "ignatius": -1 } }
  },
  "outcome": "flag.lampEnd"
});
