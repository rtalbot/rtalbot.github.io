// Pawn Champ - A Year a Week: the sequel to M13 The Widow's Walk (docs/quests/SEQUELS.md#a-year-a-week).
// Batch U, round 3. Drawn in a later month of a stay, only if The Widow's Walk ended Ten Past Four:
// Honora Clegg let go of 1979, caught up with her years in a week, and didn't stop. She ages a year
// a week now, and she would like to see one more spring. Its last chapter is One More Spring
// (js/quests/onemorespring.js), in March.
//
// Hook (W1-W2)   Honora pawns her wedding ring to pay for a list: the ferry round the Neck in winter,
//                the bakery's first hot cross buns, the widow's walk on the first warm day.
// Errand         lunch on the Gannet ferry with her, in the sea smoke.
// Endings (from the counter): Till Spring (you hold the ring for her), Sold for the Trip, On the House.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/yearaweek.js.
defineStory({
  "id": "yearaweek",
  "kind": "minor",
  "title": "A Year a Week",
  "location": "ferry",
  "sequel": "widow",
  "after": ["letgo"],
  "months": [2, 3, 4, 5],
  "rumour": "Honora Clegg looks a year older every time she comes into the bakery.",
  "teaser": "Honora Clegg goes past the shop window on her way to the bakery. You'd swear she's gone grey since last week.",
  "endings": { "held": "Till Spring", "sold": "Sold for the Trip", "gift": "On the House", "agathe": "Agathe's Loan" },
  "uniques": {
    "honoraRing": {
      "name": "Honora Clegg's wedding ring",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 140,
      "condLabel": "Worn thin",
      "tells": [
        "Rose gold, worn thin on the palm side. Inside: \"W. to H. 1971. Home by ten past four.\"",
        "Honora said she'd be back for it in the spring."
      ]
    }
  },
  "about": [
    "A winter sequel to The Widow's Walk. Freed from forty-seven years of one night, Honora Clegg is now ageing a year every week, and she has made a list: the ferry round the Neck in winter, hot cross buns, a new hat, the walk on the first warm day. She asks $80 on her wedding ring to pay Nan Ferreira to take the ferry the long way round (§{yawHook}).",
    "Hold the ring safe till spring (Till Spring), buy it outright (Sold for the Trip), give her the money and push the ring back (On the House), or say no and Agathe lends it instead (Agathe's Loan). Either way she asks you along, and on the ferry (§{yawFerry}) she sees her house from the water for the first time, talks about Ward if you ask, and asks you to find her on the widow's walk on the first warm day. That visit is One More Spring."
  ],
  "scenes": {
    "yawHook": {
      "title": "Honora pawns her ring for a list",
      "customer": "honora",
      "steps": [
        {
          "say": "honora",
          "text": [
            "Honora Clegg. You knew me at seventy-three. I'm {hook:honoraAge} this week. A year a week, the doctor says, as if he'd know. He's never seen it before. Nobody has.",
            "I'm not frightened. I had forty-seven years of one night. I've got a lot of catching up to do, and not much time to do it in, so I've made a list."
          ]
        },
        { "narrate": "She puts a ring on the counter, rose gold, worn thin, and next to it a list in a firm, old-fashioned hand. THE FERRY ROUND THE NECK IN WINTER. HOT CROSS BUNS. A NEW HAT. THE WALK, ON THE FIRST WARM DAY." },
        { "say": "honora", "text": "The ferry costs money if you want Nan Ferreira to go round the Neck instead of straight to Gannet. Eighty dollars, she says. I'd like it back in the spring. If." },
        { "view": { "counterIcon": "ring" } },
        {
          "choose": [
            {
              "label": "Lend her $80 and keep the ring safe till spring",
              "hint": "(-$80)",
              "disabled": "coin < 80",
              "then": [
                { "view": { "counterIcon": null } },
                { "add": { "unique": "honoraRing" }, "as": "ring" },
                { "edit": "ring", "set": { "paid": 80 } },
                { "coin": -80, "why": "Lent Honora Clegg $80 on her wedding ring" },
                { "set": { "yawEnd": "held" } },
                { "edit": "ring", "set": { "nosale": true, "condLabel": "Held till spring" } },
                { "say": "honora", "text": "In the spring, then. Don't let anybody try it on." }
              ]
            },
            {
              "label": "Buy the ring outright",
              "hint": "(-$80, it's yours to sell)",
              "disabled": "coin < 80 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "add": { "unique": "honoraRing" }, "as": "ring" },
                { "edit": "ring", "set": { "paid": 80 } },
                { "coin": -80, "why": "Bought Honora Clegg's wedding ring" },
                { "set": { "yawEnd": "sold" } },
                { "say": "honora", "text": "That's fair. I won't need it where I'm going. Wherever that is." }
              ]
            },
            {
              "label": "Give her the $80 and push the ring back across the counter",
              "hint": "(-$80, rep +3)",
              "disabled": "coin < 80",
              "then": [
                { "view": { "counterIcon": null } },
                { "coin": -80, "why": "Gave Honora Clegg the money for the ferry" },
                { "rep": 3 },
                { "set": { "yawEnd": "gift" } },
                { "say": "honora", "text": "Ward always said I'd find out who the decent people were if I stayed long enough. He meant the Hand. He didn't know about you." }
              ]
            },
            {
              "label": "\"I'm sorry, Mrs. Clegg. I can't.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "yawEnd": "agathe" } },
                { "say": "honora", "text": "No. No, quite right. Agathe will lend me something, she owes me for the clock." }
              ]
            }
          ]
        },
        { "refresh": "panel" },
        { "say": "honora", "text": "Come with me. On the ferry, {placed:yaw-ferry}, at noon. I don't want to look at the Neck from the water on my own. I did enough on my own." },
        { "plan": "yaw-ferry" },
        { "set": { "yawKnown": true } },
        { "toast": "Calendar: the Gannet ferry with Honora Clegg, {placed:yaw-ferry} at noon", "look": "honora" },
        { "leave": "honora" }
      ]
    },
    "yawFerry": {
      "title": "Round the Neck with Honora",
      "steps": [
        {
          "stage": "ferry",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
            { "id": "honora", "cast": "honora", "at": [150, 162] }
          ]
        },
        {
          "narrate": [
            "The Gannet ferry at noon, going the long way, round the Neck. Sea smoke comes up off the water in the cold like steam off a bath, and the cliffs go past in and out of it.",
            "Honora stands at the rail in a new hat. She is {hook:honoraAge} today, and looks it, and doesn't hold on to anything."
          ]
        },
        {
          "say": "honora",
          "text": [
            "There. The house. You can see the walk from here. I never once saw it from the water. Forty-seven years looking out, and I never looked back in.",
            "It's smaller than I thought. Everything is. That's the best thing about getting old quickly, you know. You find out everything was smaller than you thought."
          ]
        },
        {
          "choose": [
            {
              "label": "\"Tell me about Ward.\"",
              "then": [
                { "say": "honora", "text": "He couldn't dance and he couldn't cook and he whistled through his teeth, all day long, the same four songs. I'd give the whole house to hear him do it once more, badly." },
                { "set": { "yawWard": true } }
              ]
            },
            {
              "label": "\"Are you frightened?\"",
              "then": [
                { "say": "honora", "text": "Of running out? No. Of missing the spring. A little. I haven't seen a spring since 1979. I don't mean I didn't live through them. I mean I didn't see one." }
              ]
            },
            {
              "label": "(Just stand at the rail with her)",
              "then": [
                { "narrate": "You stand at the rail with her all the way round the Neck and back. Neither of you says anything. It's one of the best hours of your year." }
              ]
            }
          ]
        },
        { "say": "honora", "text": "Come and find me on the first warm day. On the walk. I'll want somebody to tell me it's really spring and not just me." },
        { "set": { "yawFerry": true } },
        { "rep": 2 }
      ]
    }
  },
  "beats": [{ "drift": "yaw-hook", "from": "1-2", "to": "2-1", "cast": "honora", "scene": "yawHook" }],
  "errands": [
    {
      "id": "yaw-ferry",
      "title": "Round the Neck with Honora",
      "where": "The Gannet ferry",
      "scene": "yawFerry",
      "test": [{ "set": { "yawKnown": true } }]
    }
  ],
  "calendar": [
    { "id": "yaw-ferry", "errand": "yaw-ferry", "story": "yearaweek", "where": "The Gannet ferry", "title": "Round the Neck", "known": "flag.yawKnown" }
  ],
  "epilogue": [
    { "line": "Honora Clegg's wedding ring is in the drawer under your till, in an envelope that says SPRING. She is {hook:honoraAge} this week.", "if": "flag.yawEnd == 'held'" },
    { "line": "Honora Clegg went round the Neck in a new hat on your eighty dollars. She is buying hot cross buns at the bakery a month early, and nobody has the heart to tell her.", "if": "flag.yawEnd == 'sold'" },
    { "line": "Honora Clegg crosses things off her list in pen, at the bakery, in front of everybody. She has two left.", "if": "flag.yawEnd == 'gift'" },
    { "line": "Agathe Moss lent Honora Clegg the ferry money and wouldn't take the ring. She mentions it to you whenever you go past the clock shop.", "if": "flag.yawEnd == 'agathe'" }
  ],
  "talk": {
    "by": "bettany",
    "rumour": [
      "Honora Clegg does the crossword at my window table every morning, in pen. She's a year older every Monday. I mean it. I've watched her go grey over a cinnamon roll.",
      "She's made a list. She showed me. \"Hot cross buns.\" I don't make them till Lent. I'm going to make them early."
    ],
    "react": { "held": "She says you're keeping her ring till the spring. She says it like you're keeping her a seat. I've started making the hot cross buns. I don't care what the calendar says.", "sold": "She sold Ward's ring for a boat ride round the Neck. She came in afterwards with her cheeks red and ate three buns. I'd have done the same.", "gift": "You gave her the money, I heard, and wouldn't take the ring. She told me twice. She doesn't tell me anything twice, she hasn't got the time.", "agathe": "Agathe Moss lent her the money in the end. Agathe! Who charges you to look at a watch. Honora told me you said no. She wasn't cross. She hasn't got time to be cross." }
  },
  "outcome": "flag.yawEnd"
});
