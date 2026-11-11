// Pawn Champ - The Nor'easter. Minor quest m22, batch E (docs/quests/MINOR.md).
// A big storm, a power cut, and neighbors sheltering in the shop by lamplight. In the dark,
// somebody swaps the best thing on your shelf for a fake. A night scene in the shop after hours.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/noreaster.js.
defineStory({
  "id": "noreaster",
  "months": [1, 2, 3, 4, 5],
  "kind": "minor",
  "title": "The Nor'easter",
  "location": "shopNight",
  "rumour": "Big storm coming. Get your batteries.",
  "endings": { "caught": "Caught in the Dark", "lights": "Lights On" },
  "outcome": "flag.stormEnd",
  "about": [
    "A whodunnit in a storm. Hal sells you his granddad's brass hurricane lamp to pay for plywood before a nor'easter (§{halLamp}). Mrs. Ochoa comes looking for anything that makes light and offers $70 for it (§{stormBuyer}).",
    "When the storm hits (§{noreaster}) the power goes on Water Street and Hal, Mrs. Ochoa and young Jory shelter in your shop. Around midnight your best piece is swapped for a fake (or, if there's nothing worth taking, the till is $20 short). Question them: each remembers a clue about who brushed past in the dark (fish and oilskin, a ball of wool, a phone screen). With the lamp you can ask two; without it your phone dies after one. Name the right one and the real thing comes out from under a coat (Caught in the Dark); guess wrong or wait till morning and you're left with the fake (Lights On)."
  ],
  "cast": {
    "ochoa": {
      "name": "Mrs. Ochoa",
      "look": { "skin": "#c89070", "hair": "#2a1e16", "hs": 3, "coat": "#a84a6a", "style": "puffer", "pants": "#3a3a4a", "glasses": "#2a2a2e", "bag": "#6a4a8a" }
    },
    "jory": {
      "name": "Jory",
      "look": { "kid": true, "skin": "#f0c8a8", "hair": "#d0a050", "hs": 4, "coat": "#3a6a3a", "style": "hoodie", "pants": "#3a3a4a" }
    }
  },
  "icons": {
    "hlamp": [
      ".....kk.....",
      "....k..k....",
      "...kkkkkk...",
      "..kBBBBBBk..",
      ".kBBBYYBBBk.",
      ".kBBYAAYBBk.",
      ".kBBBaaBBBk.",
      "..kBBBBBBk..",
      "...kkkkkk...",
      "..kyyyyyyk..",
      "..kooooook..",
      "...kkkkkk..."
    ]
  },
  "uniques": {
    "hurricaneLamp": {
      "name": "Brass hurricane lamp",
      "icon": "hlamp",
      "cat": "curio",
      "guide": 45,
      "tells": ["A ship's hurricane lamp, brass and glass, with a full reservoir of oil. It works."]
    }
  },
  "scenes": {
    "halLamp": {
      "title": "Hal sells his granddad's hurricane lamp before the storm",
      "customer": "hal",
      "steps": [
        {
          "say": "hal",
          "text": [
            "Hal Mayhew. Big storm coming. A proper nor'easter, the radio says. Get your batteries.",
            "Thing is, I need cash for plywood more than I need this. My granddad's hurricane lamp. It'll light a room when the power goes, and it will go."
          ]
        },
        { "offer": { "unique": "hurricaneLamp" }, "persona": "honest", "asking": 30, "min": 20 },
        { "set": { "stormKnown": true } },
        { "say": "hal", "text": "It'll hit {placed:noreaster} night. Half of Water Street loses power every time. If your lights stay on, expect company." },
        { "toast": "Calendar: the nor'easter, {placed:noreaster} night", "look": "hal" },
        { "leave": "hal" }
      ]
    },
    "stormBuyer": {
      "title": "Mrs. Ochoa wants anything that makes light",
      "customer": "ochoa",
      "steps": [
        { "find": "lamp", "in": "stock", "match": { "uniqueId": "hurricaneLamp" } },
        { "say": "ochoa", "text": "Do you have batteries? Torches? Candles? A lamp? Anything that makes light? Every shop on the street is cleaned out." },
        {
          "if": "!lamp",
          "then": [
            { "hook": "keeper", "sets": ["you"] },
            { "say": "you", "text": "Sorry. Nothing that makes light." },
            { "say": "ochoa", "text": "Then I'm going to be very bored in the dark." },
            { "leave": "ochoa" },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Sell her the hurricane lamp (+$70)",
              "then": [
                { "sell": "lamp" },
                { "coin": 70, "why": "Sold the hurricane lamp before the storm" },
                { "say": "ochoa", "text": "You lifesaver." }
              ]
            },
            {
              "label": "\"That one's not for sale. I'll need it.\"",
              "then": [{ "say": "ochoa", "text": "Fair enough. Good luck." }]
            }
          ]
        },
        { "leave": "ochoa" }
      ]
    },
    "noreaster": {
      "title": "The nor'easter: a power cut, and a swap in the dark",
      "music": "tension",
      "steps": [
        { "find": "lamp", "in": "stock", "match": { "uniqueId": "hurricaneLamp" } },
        { "view": { "candleX": 160 }, "if": "lamp" },
        { "view": { "candleX": 40 }, "if": "!lamp" },
        {
          "stage": "shopNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true },
            { "id": "hal", "cast": "hal", "at": [76, 152] },
            { "id": "ochoa", "cast": "ochoa", "at": [104, 152] },
            { "id": "jory", "cast": "jory", "at": [128, 152] }
          ]
        },
        {
          "narrate": { "if": "lamp", "then": "The nor'easter hits after dark. At nine the power goes on the whole of Water Street, and you light the hurricane lamp. Within the hour three neighbors are in your shop, dripping.", "else": "The nor'easter hits after dark. At nine the power goes on the whole of Water Street. By the light of one phone, three neighbors shelter in your shop, dripping." }
        },
        {
          "hook": "swap",
          "sets": ["best", "culprit"],
          "note": "best: the best thing on the shelves, which gets swapped; culprit: 0 Hal, 1 Mrs. Ochoa, 2 Jory, at random"
        },
        {
          "narrate": { "if": "best", "then": "Somewhere around midnight, in the dark between gusts, you hear the shelf creak. The {best.name|lower} is still there. But it doesn't look quite right.", "else": "Somewhere around midnight, in the dark between gusts, you hear the till drawer slide. Twenty dollars short." }
        },
        { "hook": "tillShort", "if": "!best" },
        {
          "choose": [
            {
              "label": "Ask Hal Mayhew",
              "if": "!askedHal",
              "then": [
                { "hook": "mark", "with": "askedHal", "sets": ["askedHal"] },
                {
                  "say": "hal",
                  "text": {
                    "if": "culprit == 0",
                    "then": "Me? I was by the door holding it shut.",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            },
            {
              "label": "Ask Mrs. Ochoa",
              "if": "!askedOchoa",
              "then": [
                { "hook": "mark", "with": "askedOchoa", "sets": ["askedOchoa"] },
                {
                  "say": "ochoa",
                  "text": {
                    "if": "culprit == 1",
                    "then": "I was knitting. You can knit in the dark if you know how.",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            },
            {
              "label": "Ask Jory",
              "if": "!askedJory",
              "then": [
                { "hook": "mark", "with": "askedJory", "sets": ["askedJory"] },
                {
                  "say": "jory",
                  "text": {
                    "if": "culprit == 2",
                    "then": "I was just on my phone! Everyone was on their phone!",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          "choose": [
            {
              "label": "Ask Hal Mayhew",
              "if": "!askedHal",
              "then": [
                { "hook": "mark", "with": "askedHal", "sets": ["askedHal"] },
                {
                  "say": "hal",
                  "text": {
                    "if": "culprit == 0",
                    "then": "Me? I was by the door holding it shut.",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            },
            {
              "label": "Ask Mrs. Ochoa",
              "if": "!askedOchoa",
              "then": [
                { "hook": "mark", "with": "askedOchoa", "sets": ["askedOchoa"] },
                {
                  "say": "ochoa",
                  "text": {
                    "if": "culprit == 1",
                    "then": "I was knitting. You can knit in the dark if you know how.",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            },
            {
              "label": "Ask Jory",
              "if": "!askedJory",
              "then": [
                { "hook": "mark", "with": "askedJory", "sets": ["askedJory"] },
                {
                  "say": "jory",
                  "text": {
                    "if": "culprit == 2",
                    "then": "I was just on my phone! Everyone was on their phone!",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          "choose": [
            {
              "label": "Ask Hal Mayhew",
              "if": "!askedHal",
              "then": [
                { "hook": "mark", "with": "askedHal", "sets": ["askedHal"] },
                {
                  "say": "hal",
                  "text": {
                    "if": "culprit == 0",
                    "then": "Me? I was by the door holding it shut.",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            },
            {
              "label": "Ask Mrs. Ochoa",
              "if": "!askedOchoa",
              "then": [
                { "hook": "mark", "with": "askedOchoa", "sets": ["askedOchoa"] },
                {
                  "say": "ochoa",
                  "text": {
                    "if": "culprit == 1",
                    "then": "I was knitting. You can knit in the dark if you know how.",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            },
            {
              "label": "Ask Jory",
              "if": "!askedJory",
              "then": [
                { "hook": "mark", "with": "askedJory", "sets": ["askedJory"] },
                {
                  "say": "jory",
                  "text": {
                    "if": "culprit == 2",
                    "then": "I was just on my phone! Everyone was on their phone!",
                    "else": {
                      "if": "culprit == 0",
                      "then": "Somebody brushed past me in the dark. They smelled of fish and wet oilskin.",
                      "else": { "if": "culprit == 1", "then": "Somebody brushed past me in the dark. They had a ball of wool in their pocket. I felt it.", "else": "Somebody brushed past me in the dark. They had a phone screen on, just for a second." }
                    }
                  }
                }
              ]
            }
          ],
          "if": "lamp"
        },
        { "narrate": "Your phone dies. You don't get to ask anyone else.", "if": "!lamp" },
        {
          "if": "culprit != 0 && standing.hal >= 2",
          "note": "story moment (witness): Hal is warm or a friend, wasn't the one, and tells you what he saw",
          "then": [
            {
              "say": "hal",
              "text": { "if": "culprit == 1", "then": "Between us: it was Mrs. Ochoa at your shelf. Saw it plain when the lightning went. I wouldn't say it for anyone else.", "else": "Between us: it was Jory at your shelf. Saw it plain when the lightning went. I wouldn't say it for anyone else." }
            }
          ]
        },
        {
          "choose": [
            { "label": "It was Hal Mayhew" },
            { "label": "It was Mrs. Ochoa" },
            { "label": "It was Jory" },
            { "label": "Let it go until morning" }
          ],
          "as": "accused"
        },
        {
          "if": "accused == culprit",
          "then": [
            { "set": { "stormEnd": "caught" } },
            { "say": "hal", "text": "...Fine. FINE. It's under my coat. I was going to give it back. Probably.", "if": "culprit == 0" },
            { "say": "ochoa", "text": "...Fine. FINE. It's under my coat. I was going to give it back. Probably.", "if": "culprit == 1" },
            { "say": "jory", "text": "...Fine. FINE. It's under my coat. I was going to give it back. Probably.", "if": "culprit == 2" },
            { "narrate": "The real thing comes out from under a wet coat. The fake goes in the bin. The storm blows itself out by four, and everybody pretends to be asleep until it's light." },
            { "rep": 2 }
          ],
          "else": [
            { "set": { "stormEnd": "lights" } },
            { "say": "hal", "text": "Me?! I've been sat here the whole time!", "if": "accused == 0" },
            { "say": "ochoa", "text": "Me?! I've been sat here the whole time!", "if": "accused == 1" },
            { "say": "jory", "text": "Me?! I've been sat here the whole time!", "if": "accused == 2" },
            { "rep": -2, "if": "accused < 3" },
            { "narrate": "The power comes back at dawn. By then your three neighbors have gone home, and in the daylight you can see it plainly." },
            {
              "if": "best",
              "then": [
                {
                  "edit": "best",
                  "set": {
                    "fake": true,
                    "knownFake": true,
                    "inspected": true,
                    "clues": [{ "text": "A copy. Somebody swapped it in the storm.", "cls": "bad" }]
                  }
                },
                { "hook": "markCopy", "note": "adds \" (a copy)\" to its name" },
                { "refresh": "panel" }
              ]
            }
          ]
        },
        {
          "if": "lamp",
          "then": [{ "edit": "lamp", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
        },
        { "view": { "candleX": null } }
      ]
    }
  },
  "nights": [
    {
      "id": "noreaster",
      "window": ["4-2", "4-4"],
      "if": "flag.stormKnown",
      "scene": "noreaster",
      "test": [
        { "set": { "stormKnown": true } },
        { "add": { "unique": "hurricaneLamp" } },
        { "add": { "item": "brooch", "cond": 2 } }
      ]
    }
  ],
  "beats": [
    { "at": "4-1", "cast": "hal", "scene": "halLamp" },
    { "at": "4-2", "cast": "ochoa", "scene": "stormBuyer", "if": "flag.stormKnown && hook.beforeStorm" }
  ],
  "calendar": [
    { "id": "noreaster", "night": "noreaster", "story": "noreaster", "where": "The Crooked Scale", "title": "The nor'easter", "known": "flag.stormKnown", "scene": "noreaster" }
  ],
  "epilogue": [
    { "line": "Water Street still talks about the night of the nor'easter, and who had what under their coat.", "if": "flag.stormEnd == 'caught'" },
    { "line": "You never found out who swapped the fake onto your shelf. You have a list.", "if": "flag.stormEnd == 'lights'" }
  ]
});
