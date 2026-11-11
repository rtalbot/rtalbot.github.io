// Pawn Champ - A Second One: a chapter of The Thing in Dory's Freezer's long arc (round 3, batch T).
// Docs: docs/quests/MAJOR.md#m8-the-long-arc. Stay-on only.
//
// Sold, January or February: the buyer comes back. It won't eat, it hums at the window toward the
// sea, and they want another. There are others, under the ice. The arc's chapters share a code half:
// js/quests/freezerarc.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "freezerSecond",
  "kind": "major",
  "colour": "#5ab8b0",
  "family": "uncanny",
  "title": "A Second One",
  "arc": "freezer",
  "after": ["sold"],
  "months": [4, 5],
  "teaser": "A message on the shop phone, left at three in the morning: \"It won't eat. It sits at the window and hums at the sea. Call me back.\"",
  "rumour": "Whoever bought the thing in Dory's freezer is back in town, asking the scallopers about a second one.",
  "endings": { "pair": "A Pair", "home": "Back Under the Ice", "leftBe": "Let Them Be" },
  "outcome": "flag.secondEnd",
  "code": "freezerarc",
  "about": [
    "The freezer arc's chapter for when you sold the thing in October. Whoever bought it, Dr. Pomfret, Kit Sandoval or Dr. Achebe of the marine lab, comes back: it won't eat, and it hums at the sea all night (§{secondAsk}). They want a second one. You can agree, gently suggest letting theirs go home, or refuse, which ends it.",
    "Dory says Cal heard humming under the ice off the breakwater, several of them, and she's coming along so nobody does anything stupid (§{secondDory}). On the night (§{secondNight}) three come up into the flashlight, and in the buyer's car, under a blanket, theirs hums the same note.",
    "Net one for your finder's fee, and the two hum in a chord in the car while Dory walks home alone (A Pair; she cools on you). Talk the buyer into opening the car and letting theirs go to the others (Back Under the Ice): that's easy if you planted the idea at the start, if it's the lab, or if your reputation is high. Or switch off the flashlight and leave them be (Let Them Be)."
  ],
  "notes": "Whoever bought it in October (hook.buyer: pomfret, sandoval or achebe for the lab) comes back for a second one.",
  "scenes": {
    "secondAsk": {
      "title": "The buyer comes back: it won't eat, and they want another",
      "customer": "buyer",
      "steps": [
        {
          "if": "hook.buyer == 'pomfret'",
          "then": [
            {
              "say": "buyer",
              "text": [
                "Lyle Pomfret. You remember the hat. It has not eaten since Christmas. It sits at my window in Wellfleet and hums at the bay, all night, a single note.",
                "I am a cryptozoologist, not a monster. It is lonely. Find me a second one and I will pay three hundred dollars, from the hat."
              ]
            }
          ]
        },
        {
          "if": "hook.buyer == 'sandoval'",
          "then": [
            {
              "say": "buyer",
              "text": [
                "Kit Sandoval. Season seven was the best thing that ever happened to the network. Now they want a \"family special\" for sweeps.",
                "Off the record? It's stopped eating. It hums at the van window all the way down Route 6. Find me another one and there's five hundred in it."
              ]
            }
          ]
        },
        {
          "if": "hook.buyer == 'achebe'",
          "then": [
            {
              "say": "buyer",
              "text": [
                "Ines Achebe. It's not eating, and it hums at the north wall of the tank, which is the wall nearest the harbor. I've measured. Every night.",
                "I think there are more of them, and I think it knows where. I'm not asking you to catch one. I'm asking you to help me find out. The lab can find a hundred dollars."
              ]
            }
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll ask the scallopers.\"",
              "then": [
                { "set": { "secondIn": true } },
                { "hook": "setFee" },
                { "say": "buyer", "text": "Thank you. Call the number on the card. Any hour." }
              ]
            },
            {
              "label": "\"Have you thought about letting it go home?\"",
              "then": [
                { "set": { "secondIn": true } },
                { "hook": "setFee" },
                { "set": { "secondSoft": true } },
                {
                  "say": "buyer",
                  "text": { "if": "hook.buyer == 'achebe'", "then": "Every night, yes. I have. Find them first. Then we'll know what home means.", "else": "Home. Huh. Find me the others first, and we'll talk about home." }
                }
              ]
            },
            {
              "label": "\"I'm out of the specimen business.\"",
              "then": [
                { "set": { "secondOut": true } },
                { "say": "buyer", "text": "Of course. I understand. I'll ask Dory myself." }
              ]
            }
          ]
        },
        { "leave": "buyer" }
      ]
    },
    "secondDory": {
      "title": "Dory: there's humming under the ice off the breakwater",
      "customer": "dory",
      "steps": [
        {
          "say": "dory",
          "text": [
            "You're asking around for another one. Don't. Or do, but listen first.",
            "Cal was out on the breakwater Sunday night, which he's not supposed to be. There's humming under the ice off the end. Not one. Several.",
            "I sold the first one. I'm not selling a second. But if you're going, I'm coming, so nobody does anything stupid. Thursday, after dark."
          ]
        },
        { "set": { "secondKnown": true } },
        { "toast": "Calendar: the breakwater, under the ice", "look": "dory" },
        { "leave": "dory" }
      ]
    },
    "secondNight": {
      "title": "The breakwater after dark: three of them under the ice",
      "music": "tension",
      "steps": [
        {
          "hook": "thing",
          "with": {
            "where": "greenNight",
            "x": 470,
            "y": 238,
            "hum": true,
            "wet": true,
            "others": [[-34, 6], [30, 10]]
          }
        },
        {
          "stage": "greenNight",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [150, 166] },
            { "id": "dory", "cast": "dory", "at": [186, 164], "facingLeft": true },
            { "id": "buyer", "cast": "pomfret", "at": [100, 162], "if": "hook.buyer == 'pomfret'" },
            { "id": "buyer", "cast": "sandoval", "at": [100, 162], "if": "hook.buyer == 'sandoval'" },
            { "id": "buyer", "cast": "achebe", "at": [100, 162], "if": "hook.buyer == 'achebe'" }
          ]
        },
        {
          "narrate": [
            "The foot of the breakwater, ten degrees and no wind. The harbor is white out to the bell buoy, except a black lane along the rocks where the tide keeps it open.",
            "Dory shines the flashlight on the black water. Three of them come up into the light, pale and finned, with small hands, and look at you. The humming stops."
          ]
        },
        {
          "say": "buyer",
          "text": {
            "if": "hook.buyer == 'achebe'",
            "then": "Oh. Oh, there you all are.",
            "else": { "if": "hook.buyer == 'pomfret'", "then": "Three. THREE. The hat is trembling.", "else": "Are we rolling? Tell me we're rolling. We're not rolling. Nobody brought the camera. Of course." }
          }
        },
        { "say": "dory", "text": "There's a net in the truck. I'm not fetching it. You can." },
        { "narrate": "{buyer.name} glances back at the parking lot. In the back of the car, under a blanket, something is humming the same note as the water." },
        {
          "choose": [
            {
              "label": "Fetch the net and catch one",
              "hint": "({hook:fee|money} finder's fee)",
              "then": [
                { "set": { "secondEnd": "pair" } },
                { "hook": "payFee", "with": "A finder's fee for a second sea thing" },
                { "rep": -2, "why": "Netted a second sea thing" },
                { "sway": "dory", "by": -2, "why": "Netted a second one" },
                {
                  "narrate": [
                    "It takes you twenty minutes on your stomach on the ice. The one you catch doesn't fight. The other two go under and don't come up.",
                    "In the car, the two of them press their hands together through the cooler slats and hum in a chord. It's a nice sound. Dory walks home by herself."
                  ]
                }
              ]
            },
            {
              "label": "Ask them to open the car and let theirs go home",
              "hint": { "if": "flag.secondSoft", "then": "(you already planted the idea)" },
              "then": [
                {
                  "if": "flag.secondSoft || hook.buyer == 'achebe' || rep >= 60",
                  "then": [{ "narrate": "Nobody argues, or even pretends to." }],
                  "else": [
                    {
                      "say": "buyer",
                      "text": { "if": "hook.buyer == 'pomfret'", "then": "And lose it? No. No, I paid. I paid from the hat.", "else": "And lose the franchise? You're out of your mind." }
                    },
                    { "say": "dory", "text": "Listen to it. Listen to the car. Then tell me you paid." },
                    { "narrate": "A long silence, with humming in it. Then the car keys come out of a pocket." }
                  ]
                },
                { "set": { "secondEnd": "home" } },
                { "rep": 3, "why": "Sent the sea thing home under the ice" },
                { "sway": "dory", "by": 2, "why": "Sent it home" },
                {
                  "narrate": [
                    "The blanket comes off. It's bigger than in October, and thinner. It goes over the rocks on its hands, fast, and into the black lane, and the three in the water close round it.",
                    "For a moment there are four notes, then one chord, then nothing but the tide under the ice."
                  ]
                },
                { "say": "dory", "text": "Well. That's my college fund gone twice. Come on. The Anchor's open." }
              ]
            },
            {
              "label": "Turn off the flashlight and leave them be",
              "then": [
                { "set": { "secondEnd": "leftBe" } },
                { "rep": 1 },
                { "narrate": "You switch the flashlight off. In the dark, after a minute, the humming starts again, three notes, and from the parking lot a fourth joins in, muffled by a blanket." },
                { "say": "buyer", "text": "I can hear it. You understand? I can hear it answer." },
                { "narrate": "Nobody says anything else. You all walk back to your cars." }
              ]
            }
          ]
        },
        { "hook": "thing", "with": { "where": null, "others": null } }
      ]
    }
  },
  "beats": [
    { "drift": "second-ask", "from": "1-2", "to": "1-4", "cast": "pomfret", "scene": "secondAsk", "if": "hook.buyer == 'pomfret'" },
    { "drift": "second-ask", "from": "1-2", "to": "1-4", "cast": "sandoval", "scene": "secondAsk", "if": "hook.buyer == 'sandoval'" },
    { "drift": "second-ask", "from": "1-2", "to": "1-4", "cast": "achebe", "scene": "secondAsk", "if": "hook.buyer == 'achebe'" },
    { "drift": "second-dory", "from": "2-1", "to": "2-3", "cast": "dory", "scene": "secondDory", "if": "flag.secondIn" }
  ],
  "nights": [
    {
      "id": "second-night",
      "window": ["2-4", "4-3"],
      "if": "flag.secondKnown && !flag.secondEnd",
      "scene": "secondNight",
      "test": [
        { "set": { "freezerEnd": "sold" } },
        { "roll": { "freezerBuyer": ["pomfret", "sandoval", "lab", null] } },
        { "set": { "secondIn": true, "secondKnown": true } },
        { "roll": { "secondSoft": [true, false] } }
      ]
    }
  ],
  "calendar": [
    { "id": "second-night", "night": "second-night", "story": "freezerSecond", "where": "The breakwater", "title": "Humming under the ice", "known": "flag.secondKnown", "scene": "secondNight" }
  ],
  "epilogue": [
    { "line": "There are two of them now, with {hook:buyerName}. They hum in a chord. Dory still won't talk about it.", "if": "flag.secondEnd == 'pair'" },
    { "line": "It went back under the ice off the breakwater, to the others. The buyer sends Dory a postcard every month with nothing written on it.", "if": "flag.secondEnd == 'home'" },
    { "line": "There are three of them under the ice off the breakwater, and a fourth in a car, and they can hear each other. That will have to do for now.", "if": "flag.secondEnd == 'leftBe'" }
  ],
  "talk": {
    "by": "dory",
    "rumour": [
      "The one who bought it rang me at three in the morning. It won't eat. They want a second one.",
      "I said no. I'm telling you so you know I said no."
    ],
    "react": { "pair": "Two of them now, humming in a car on the Cape. I hope they're happy. I'm not.", "home": "It went home under the ice. I watched it go twice now. The second time was better.", "leftBe": "Three in the water and one in a car, and they can hear each other. I don't know if that's kind or cruel. Nobody does." },
    "sway": { "pair": { "dory": -2, "dot": -1 }, "home": { "dory": 2, "dot": 1 }, "leftBe": { "dory": 1 } }
  }
});
