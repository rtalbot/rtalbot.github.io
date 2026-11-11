// Pawn Champ - The Answering Machine. Minor quest m40, batch K (docs/quests/MINOR.md).
// A box lot from a flea-market dealer has an old answering machine in it, with one saved message.
// It's Aunt Odile, the night she left. Its scene is a night in the shop after hours, playing the
// tape. Then the Gilded Hand wants it. The message points at the main story's lighthouse without
// giving it away, and the ending line changes if Odile comes home.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "answering",
  "kind": "minor",
  "title": "The Answering Machine",
  "location": "shopNight",
  "rumour": "Norbert Fisk at the flea market cleared out a storage unit the Gilded Hand auctioned off. Says some of it came from your shop.",
  "endings": { "saved": "Saved Message", "erased": "Erased" },
  "outcome": "flag.answerEnd",
  "about": [
    "An Odile story. Norbert Fisk from the flea market bought a storage unit the Gilded Hand auctioned off, and brings in an answering machine with your shop's name on it and one message (§{norbertBox}).",
    "One night after closing you can play it (§{answering}): Odile, from a pay phone, the night she left, telling you not to let the Hand in the back room, not to sign anything Merrit brings, and that she'll be \"where the light is\". Or leave it blinking. Merrit Gaunt then comes for it, offering $80 (§{merritMachine}). Sell it and he erases it in the street (Erased), or keep it (Saved Message)."
  ],
  "cast": {
    "norbert": {
      "name": "Norbert Fisk",
      "look": { "skin": "#f0c8a8", "hair": "#6a5a4a", "hs": 1, "coat": "#6a7a4a", "style": "vest", "vest": "#4a5a3a", "pants": "#4a4a40", "hat": "cap", "hatc": "#c84a3a", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "answering": [
      "............",
      "............",
      ".kkkkkkkkkk.",
      ".kddddddddk.",
      ".kdkkkkkkdk.",
      ".kdkSSSSkdk.",
      ".kdkkkkkkdk.",
      ".kddRdddddk.",
      ".kdsdsdsddk.",
      ".kkkkkkkkkk.",
      "............",
      "............"
    ]
  },
  "uniques": {
    "answeringMachine": {
      "name": "Answering machine, one message",
      "icon": "answering",
      "cat": "curio",
      "guide": 15,
      "questKey": true,
      "tells": [
        "A 1990s tape answering machine. The red light still blinks: 1 MESSAGE.",
        "A strip of masking tape on the base: THE CROOKED SCALE, in Odile's capitals."
      ]
    }
  },
  "scenes": {
    "norbertBox": {
      "title": "Norbert Fisk brings a box lot from the Hand's storage unit",
      "customer": "norbert",
      "steps": [
        {
          "say": "norbert",
          "text": [
            "Norbert Fisk, Fisk's Finds, the flea market by the ferry. The Gilded Hand auctioned off a storage unit last month. Unpaid fees. I bought the lot, sight unseen.",
            "Some of it's got your shop's name on. Thought you'd want first go. Mostly it's junk. Except this, which is also junk, but it blinks."
          ]
        },
        { "offer": { "unique": "answeringMachine" }, "persona": "smooth", "asking": 15, "min": 8 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "answerHeld": true } },
            { "say": "norbert", "text": "One message on it. I didn't listen. I'm a dealer, not a snoop. ...I listened to the first second. It's a woman. Then I stopped." }
          ],
          "else": [
            { "say": "norbert", "text": "Back in the box, then. Somebody'll buy it. Somebody buys everything." }
          ]
        },
        { "leave": "norbert" }
      ]
    },
    "answering": {
      "title": "After closing: one message",
      "music": "eerie",
      "steps": [
        {
          "stage": "shopNight",
          "view": { "candleX": 236 },
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "answeringMachine" } },
        {
          "if": "!it",
          "then": [
            { "narrate": "You cash up. The shelf where the answering machine was is just a shelf." },
            { "view": { "candleX": null } },
            { "end": true }
          ]
        },
        { "narrate": "After closing. You plug the answering machine in behind the counter. The red light blinks. 1 MESSAGE. On the tape, in Odile's hand, a date: the night she left." },
        {
          "choose": [
            {
              "label": "Press PLAY",
              "then": [
                { "set": { "answerPlayed": true } },
                {
                  "narrate": [
                    "A beep. Wind, a pay phone, a ferry horn far off. Then Odile.",
                    "\"It's me. I'm calling the shop because they're listening to the house. If this is you, kiddo, then I'm gone and they gave you the keys. Good. You'll do fine. Don't let the Hand in the back room, and don't sign anything Merrit brings you.\"",
                    "\"I'll be where the light is. Don't come looking. Not yet. And feed the cat, he's a liar, he's been fed—\"",
                    "BEEP. END OF MESSAGES. In the dark, Mister Fathom climbs onto the machine and lies down across it.",
                    "Where the light is. You look out of the window, at the harbor, and the headland across it."
                  ]
                },
                { "view": { "candleX": null } }
              ]
            },
            {
              "label": "Leave it blinking. Not tonight.",
              "then": [
                { "set": { "answerUnplayed": true } },
                { "narrate": "You unplug it. The light goes out. That's worse." },
                { "view": { "candleX": null } }
              ]
            }
          ]
        }
      ]
    },
    "merritMachine": {
      "title": "Merrit Gaunt wants the answering machine",
      "customer": "merrit",
      "steps": [
        { "find": "it", "in": "stock", "match": { "uniqueId": "answeringMachine" } },
        { "say": "merrit", "text": "A flea-market man has been selling Gilded Hand property. Some of it came here. A telephone answering machine, recorded on a line we have a lien on." },
        {
          "if": "!it",
          "then": [
            { "say": "merrit", "text": "Not here? Then it's nowhere. Good." },
            { "set": { "answerEnd": "erased" } },
            { "leave": "merrit" },
            { "end": true }
          ]
        },
        {
          "say": "merrit",
          "text": { "if": "flag.answerPlayed", "then": "You've listened to it. Of course you have. Eighty dollars, and it goes back where it belongs.", "else": "Eighty dollars. I won't ask if you've played it." }
        },
        {
          "choose": [
            {
              "label": "Sell it to him (+$80)",
              "then": [
                { "set": { "answerEnd": "erased" } },
                { "sell": "it" },
                { "coin": 80, "why": "Sold Odile's answering machine to Merrit Gaunt" },
                { "narrate": "He takes it out to the black car. Through the window you watch him press ERASE, and wait for the long beep, and drop the machine in the bin on the corner." }
              ]
            },
            {
              "label": "\"It has my shop's name on it. It stays.\"",
              "then": [
                { "set": { "answerEnd": "saved" } },
                { "edit": "it", "set": { "questKey": false, "nosale": true } },
                { "refresh": "panel" },
                { "say": "merrit", "text": "Odile said that too. About the shop. Look where it got her." },
                { "heat": 3, "why": "Kept Odile's answering machine from the Gilded Hand" }
              ]
            }
          ]
        },
        { "leave": "merrit" }
      ]
    }
  },
  "beats": [
    { "at": "2-2", "cast": "norbert", "scene": "norbertBox" },
    { "at": "3-4", "cast": "merrit", "scene": "merritMachine", "if": "flag.answerHeld && !flag.answerEnd" }
  ],
  "nights": [
    {
      "id": "answering",
      "window": ["2-3", "3-3"],
      "if": "flag.answerHeld && !flag.answerPlayed && !flag.answerUnplayed",
      "scene": "answering",
      "test": [{ "set": { "answerHeld": true } }, { "add": { "unique": "answeringMachine" } }]
    }
  ],
  "calendar": [
    { "id": "answering", "night": "answering", "story": "answering", "where": "The Crooked Scale", "title": "One message", "known": "flag.answerHeld", "scene": "answering" }
  ],
  "epilogue": [
    {
      "line": { "if": "flag.odileFreed || flag.odileHome", "then": "Odile came home and played her own message, twice, and laughed at the bit about the cat. Then she stopped laughing, and kept the tape.", "else": "Odile's answering machine sits behind the counter, unplugged. You know the message by heart." },
      "if": "flag.answerEnd == 'saved'"
    },
    { "line": "The answering machine on your shelf has no messages. The red light doesn't blink. You keep checking.", "if": "flag.answerEnd == 'erased'" }
  ]
});
