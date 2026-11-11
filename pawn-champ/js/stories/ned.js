// Pawn Champ - Captain Ned. Minor quest m12, batch C (docs/quests/MINOR.md#m12).
// Ruthie Kroll quit ventriloquism because the dummy kept talking. Now he's on your shelf, and
// her farewell show is at the Rusty Anchor's open mic.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/ned.js.
defineStory({
  "id": "ned",
  "kind": "minor",
  "title": "Captain Ned",
  "location": "rustyanchor",
  "rumour": "Ruthie Kroll quit ventriloquism. Says the dummy kept talking.",
  "endings": { "encore": "Encore", "heckler": "Heckler", "ohio": "Sold to Ohio" },
  "outcome": "flag.nedEnd",
  "about": [
    "A comic story with a shiver in it. Ruthie Kroll has quit ventriloquism after forty-one years because her dummy, Captain Ned, kept talking when she wasn't doing it, and she sells him to you (§{ruthieNed}). The next night, as you lock up, Ned says good night before you do.",
    "At her farewell show at the Rusty Anchor open mic (§{nedOpenMic}) Ruthie freezes alone on stage, and a tourist from Ohio offers $80 for Ned. Put Ned in her hands for a twenty-minute encore and she buys him back (Encore), sit in the front row with him on your knee while he heckles her in a voice nobody is doing (Heckler), sell him to the tourist (Sold to Ohio), or just watch."
  ],
  "cast": {
    "ohio": {
      "name": "A tourist from Ohio",
      "look": { "skin": "#e8b890", "hair": "#8a6a4a", "hs": 0, "coat": "#c8302a", "style": "tee", "pants": "#c8b890", "hat": "cap", "hatc": "#c8302a" }
    }
  },
  "icons": {
    "dummy": [
      "...kkkkkk...",
      "..kaAAAAak..",
      ".kaaaaaaaak.",
      "...kppppk...",
      "...kpkpkk...",
      "...kppppk...",
      "...kkrrkk...",
      "....kppk....",
      "..kbbbbbbk..",
      ".kbbSbbSbbk.",
      ".kbbbbbbbbk.",
      ".kkkkkkkkkk."
    ]
  },
  "uniques": {
    "captainNed": {
      "name": "Captain Ned",
      "icon": "dummy",
      "cat": "curio",
      "guide": 50,
      "questKey": true,
      "tells": [
        "A ventriloquist's dummy in a yellow sou'wester, with a pipe and a painted squint.",
        "The jaw lever is stiff. You're not sure how anyone made him talk."
      ]
    }
  },
  "scenes": {
    "ruthieNed": {
      "title": "Ruthie Kroll sells you Captain Ned",
      "customer": "ruthie",
      "steps": [
        {
          "say": "ruthie",
          "text": [
            "You'll have heard I've quit ventriloquism. Forty-one years. I'm quitting.",
            "This is Captain Ned. He's a sea captain. He has opinions about the harbor, the weather and my private life.",
            "He kept talking. Not when I was doing it. When I wasn't. I'd like him to live somewhere else now."
          ]
        },
        { "offer": { "unique": "captainNed" }, "persona": "honest", "asking": 40, "min": 28 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "ruthie", "text": "Then he's coming home with me. He'll be unbearable about it." },
            { "leave": "ruthie" },
            { "end": true }
          ]
        },
        { "set": { "nedIn": true } },
        { "hook": "bought", "note": "flag.nedBought is the day he moved in" },
        { "say": "ruthie", "text": "My farewell show is at the Rusty Anchor open mic. Just me, no Ned. Come, if you like. Bring nothing wooden." },
        { "toast": "Calendar: Ruthie's farewell show, the Rusty Anchor", "look": "ruthie" },
        { "leave": "ruthie" }
      ]
    },
    "nedOpenMic": {
      "title": "Ruthie's farewell show",
      "steps": [
        { "hook": "anchorStage", "with": true },
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "ruthie", "cast": "ruthie", "at": [270, 150], "facingLeft": true },
            { "id": "ohio", "cast": "ohio", "at": [200, 164], "facingLeft": true },
            { "id": "punter", "look": "random", "at": [[40, 162], [76, 168], [112, 162]] },
            { "id": "punter4", "look": "random", "at": [236, 168], "facingLeft": true }
          ]
        },
        { "narrate": "Open mic at the Rusty Anchor. A poem about a lobster, a man with a banjo, and then Ruthie Kroll, alone on the little stage, with her hand in the shape of somebody who isn't there." },
        { "say": "ruthie", "text": "Good evening. I'm Ruthie. For forty-one years I was half of a double act. Tonight I'm..." },
        { "narrate": "She stops. Her hand keeps opening and closing on nothing." },
        { "find": "ned", "in": "stock", "match": { "uniqueId": "captainNed" } },
        { "say": "ohio", "text": "Is that the dummy lady? I came to see the dummy. Is that the dummy in your bag? I'll give you eighty dollars for him. Cash. He'd look great in the den." },
        {
          "choose": [
            {
              "label": "Take Ned up to her",
              "disabled": "!ned",
              "then": [
                { "set": { "nedEnd": "encore" } },
                { "take": "ned" },
                { "rep": 3 },
                { "narrate": "You put him in her hands. She looks at him for a long moment. Then he looks at the audience." },
                { "say": "ruthie", "text": "\"WHAT are you all looking at? Has nobody here seen a sea captain before?\"" },
                { "narrate": "Twenty minutes. They do the bit about the harbormaster, and the bit about Ruthie's cooking, and a new one about the pawnshop that the room enjoys more than you do." },
                { "say": "ruthie", "text": "Thank you. Thank you. He's coming home. I'll pay you back what you gave me, and he'll complain about the price all the way." },
                { "hook": "payBack", "note": "Ruthie pays back what you paid for him" }
              ]
            },
            {
              "label": "Sit in the front row with Ned on your knee",
              "disabled": "!ned",
              "then": [
                { "set": { "nedEnd": "heckler" } },
                { "rep": 1 },
                { "edit": "ned", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                {
                  "narrate": [
                    "You sit in the front row with Ned on your knee. You don't move your lips. You don't move anything.",
                    "\"Speak UP, Ruthie! Some of us are made of wood!\""
                  ]
                },
                { "say": "ruthie", "text": "Oh, YOU'RE here, are you?" },
                { "narrate": "It becomes a double act with a heckler. The heckler gets the best lines. Nobody can work out who's doing his voice, and Ruthie doesn't ask. She just looks at you, and then at him, and laughs until she has to sit down." },
                { "say": "ruthie", "text": "Keep him. He likes it there. I can tell when he likes it somewhere." }
              ]
            },
            {
              "label": "Sell Ned to the tourist ($80)",
              "disabled": "!ned",
              "then": [
                { "set": { "nedEnd": "ohio" } },
                { "sell": "ned" },
                { "coin": 80, "why": "Sold Captain Ned to a tourist from Ohio" },
                { "say": "ohio", "text": "Fantastic. He's going on the bar in the den. My wife will love him. My wife will not love him." },
                { "narrate": "Ruthie does a quiet, lovely set alone, mostly about the harbor. At the end, as the tourist leaves, you hear a small voice from his bag say, \"Ohio?\"" }
              ]
            },
            {
              "label": "Leave him in the bag and just watch",
              "then": [
                { "narrate": "Ruthie does fifteen minutes on her own. It's fine. It's quieter than she wanted. From your bag, someone sighs." },
                {
                  "if": "ned",
                  "then": [
                    { "edit": "ned", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            }
          ]
        },
        { "hook": "anchorStage", "with": false }
      ]
    }
  },
  "mornings": [
    { "find": "ned", "in": "stock", "match": { "uniqueId": "captainNed" } },
    {
      "if": "flag.nedIn && !flag.nedSpoke && ned && hook.dayAfterBought",
      "then": [
        { "set": { "nedSpoke": true } },
        { "toast": "Last night, as you locked up, Captain Ned said \"Good night.\" You hadn't said anything yet.", "icon": "dummy" }
      ]
    }
  ],
  "beats": [{ "at": "2-3", "cast": "ruthie", "scene": "ruthieNed" }],
  "nights": [
    {
      "id": "ned-mic",
      "window": ["2-4", "4-3"],
      "weekdays": [1, 2, 3],
      "if": "flag.nedIn",
      "scene": "nedOpenMic",
      "test": [
        { "set": { "nedIn": true } },
        { "add": { "unique": "captainNed" }, "as": "n" },
        { "edit": "n", "set": { "paid": 35 } }
      ]
    }
  ],
  "calendar": [
    { "id": "ned-mic", "night": "ned-mic", "story": "ned", "where": "The Rusty Anchor", "title": "Ruthie's farewell show", "known": "flag.nedIn", "scene": "nedOpenMic" }
  ],
  "epilogue": [
    { "line": "Ruthie Kroll and Captain Ned are booked every Saturday at the Rusty Anchor. Ruthie says she's semi-retired. Ned says she isn't.", "if": "flag.nedEnd == 'encore'" },
    { "line": "Captain Ned sits on the shelf behind the till. Every night at closing, someone says \"Good night.\"", "if": "flag.nedEnd == 'heckler'" },
    { "line": "Somewhere in Ohio, a sea captain sits on a bar in a den and has opinions about it.", "if": "flag.nedEnd == 'ohio'" }
  ]
});
