// Pawn Champ - One More Spring: the last chapter of M13 The Widow's Walk, after A Year a Week
// (docs/quests/SEQUELS.md#one-more-spring). Batch U, round 3. March only.
// It follows A Year a Week whichever way that ended, so it's an `arc` of 'yearaweek' (js/stay.js).
//
// Hook (W1-W2)   Bettany Lowe brings a note from Cliff Road: "The first warm day. You promised. H.C."
// Errand         lunch on the widow's walk, in the first sun of the year. Honora is in her nineties,
//                in a deckchair, with a cup of tea, and she has seen the spring.
// Endings: One More Spring, Kettle On, Home by Ten Past Four (her ring, if you still have it).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/onemorespring.js.
defineStory({
  "id": "onemorespring",
  "kind": "minor",
  "title": "One More Spring",
  "location": "widowsWalkSpring",
  "arc": "yearaweek",
  "months": [6],
  "rumour": "Honora Clegg has had a deckchair carried up to her widow's walk, and she's waiting for the weather.",
  "teaser": "March. On Cliff Road, somebody has carried a deckchair up onto the Clegg widow's walk, and left it facing the sea.",
  "endings": { "spring": "One More Spring", "kettle": "Kettle On", "ring": "Home by Ten Past Four" },
  "about": [
    "A March chapter following A Year a Week. Bettany brings a shaky note from Honora Clegg, now in her nineties, who has had a deckchair carried up to her widow's walk on Cliff Road: \"The first warm day. You promised.\" (§{omsNote})",
    "On the widow's walk (§{omsWalk}) it is spring at last, and she wants to hear someone else say so. Sit with her while she names every boat going out and drifts off to sleep (One More Spring), go down and put the kettle on and come back to an empty, still-warm chair (Kettle On), or, if you have her wedding ring, put it back on her hand (Home by Ten Past Four)."
  ],
  "scenes": {
    "omsNote": {
      "title": "Bettany brings a note from Cliff Road",
      "customer": "bettany",
      "steps": [
        { "say": "bettany", "text": "I've a note for you, from Cliff Road. Honora gave it to me with her bun this morning. She can't do the hill anymore. She had a boy from the hardware carry her chair up to the walk." },
        { "view": { "counterIcon": "letter" } },
        { "narrate": "An envelope with your name on it in a hand that's gone shaky since the winter. Inside: \"The first warm day. You promised. {placed:oms-walk}, at noon, if the weather holds. It will. H.C.\"" },
        { "view": { "counterIcon": null } },
        { "say": "bettany", "text": "She's ninety-something now. She won't say which. She says it's rude to ask a woman her age when it changes every Monday." },
        { "plan": "oms-walk" },
        { "set": { "omsKnown": true } },
        { "toast": "Calendar: the widow's walk, Cliff Road, {placed:oms-walk} at noon", "look": "honora" },
        { "leave": "bettany" }
      ]
    },
    "omsWalk": {
      "title": "The first warm day",
      "steps": [
        {
          "stage": "widowsWalkSpring",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [196, 162] },
            { "id": "honora", "cast": "honora", "at": [250, 160] }
          ]
        },
        {
          "narrate": [
            "The widow's walk at noon on the first warm day of the year. No gale. The sea is flat and blue and full of light, there are crocuses in the ruts of Cliff Road below, and the first boats are out past Gull Point.",
            "Honora is in a deckchair with a rug over her knees and a cup of tea going cold beside her. She is very old now, and very small, and completely delighted."
          ]
        },
        { "say": "honora", "text": "It's spring. Isn't it. Tell me it isn't just me." },
        { "say": "you", "text": "It's spring, Mrs. Clegg." },
        { "say": "honora", "text": "Good. I thought so. I just wanted to hear somebody else say it." },
        { "find": "ring", "in": "stock", "match": { "uniqueId": "honoraRing" } },
        {
          "choose": [
            {
              "label": "Sit with her and watch the boats",
              "then": [
                { "narrate": "You sit on the deck beside her chair with your back to the railing. She names every boat that goes out, and who it belonged to in 1979, and what became of them, and she is right about all of them." },
                { "say": "honora", "text": "That's the Merrow's mooring. Empty. It ought to be empty. That's all right." },
                { "narrate": "After a while she stops talking, and you think she's asleep, and she isn't, quite, and then she is." },
                { "set": { "omsEnd": "spring" } },
                { "rep": 3 }
              ]
            },
            {
              "label": "Go down and put the kettle on",
              "then": [
                {
                  "narrate": [
                    "You go down through the cupola door and the quiet house to the kitchen, and fill the kettle, and stand by the window while it boils. Outside, somebody on the road below is whistling, badly, one of the same four songs, over and over.",
                    "When you carry the tea back up, the rug is folded over the arm of the deckchair, and the chair is empty, and still warm in the sun."
                  ]
                },
                { "set": { "omsEnd": "kettle" } },
                { "rep": 2 }
              ]
            },
            {
              "label": "Give her back her ring",
              "if": "ring",
              "hint": { "if": "flag.yawEnd == 'held'", "then": "(as promised)", "else": "(you bought it; give it back anyway)" },
              "then": [
                { "take": "ring" },
                { "narrate": "She holds out her hand, and you put the ring on it, because her fingers are too stiff to do it herself. It's loose now. She closes her hand round it." },
                { "say": "honora", "text": "\"Home by ten past four.\" He was, too, in the end. So am I." },
                { "set": { "omsEnd": "ring" } },
                { "rep": 4 }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "oms-note", "from": "1-2", "to": "2-2", "cast": "bettany", "scene": "omsNote" }],
  "errands": [
    {
      "id": "oms-walk",
      "title": "The first warm day",
      "where": "The widow's walk, Cliff Road",
      "scene": "omsWalk",
      "test": [
        { "set": { "omsKnown": true } },
        {
          "if": "random < 0.5",
          "then": [{ "add": { "unique": "honoraRing" } }, { "set": { "yawEnd": "held" } }]
        }
      ]
    }
  ],
  "calendar": [
    { "id": "oms-walk", "errand": "oms-walk", "story": "onemorespring", "where": "The widow's walk, Cliff Road", "title": "The first warm day", "known": "flag.omsKnown" }
  ],
  "epilogue": [
    { "line": "Honora Clegg saw one more spring. The Clegg house went to the Historical Society, in her will, \"on condition that somebody goes up on the walk on the first warm day, every year\".", "if": "flag.omsEnd == 'spring'" },
    { "line": "On the first warm day of the year, on Cliff Road, people say they can smell tea, and hear somebody whistling, badly, one of the same four songs.", "if": "flag.omsEnd == 'kettle'" },
    { "line": "Honora Clegg was buried with her wedding ring on, at the Old Burying Ground, next to a stone for a man who was lost at sea. Agathe Moss set the ship's clock on it to ten past four.", "if": "flag.omsEnd == 'ring'" }
  ],
  "talk": {
    "by": "orsolya",
    "rumour": [
      "The widow on Cliff Road. I read for her once, years ago. The cards came out in the same order three times, and every time the last one was the Star. Hope, it means. Or spring.",
      "She's had a chair carried up to her roof. She's waiting for the weather, she says. I've told her the weather is coming. I'm usually right about weather."
    ],
    "react": { "spring": "She saw it. The spring. I put the Star in my window for a week. People think it's a sale.", "kettle": "You went down to make the tea, and when you came back she'd gone. That's the kindest way I've ever heard of. You gave her the minute on her own.", "ring": "She went with her ring on. He'd have liked that. I had a reading that night with the cards I never use, and they were all cups. Cups are love. Also tea." }
  },
  "outcome": "flag.omsEnd"
});
