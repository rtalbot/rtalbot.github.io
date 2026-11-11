// Pawn Champ - The Turkey Trot. Minor quest m76, batch M (docs/quests/MINOR.md#m76-the-turkey-trot).
// November only. The day before the Thanksgiving race, Della Rourke pawns the medal she has run every
// race with since 1999, to pay her pledge, and wants it back by the start. At eight on Thanksgiving
// morning her brother hasn't turned up with the cash. Give it to her on trust, keep it till she pays,
// or pay the pledge yourself.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/turkeytrot.js.
defineStory({
  "id": "turkeytrot",
  "kind": "minor",
  "title": "The Turkey Trot",
  "location": "green",
  "months": [2],
  "rumour": "Della Rourke has run every race since 1999 with a medal pinned inside her shirt. This year she's short the pledge.",
  "endings": { "trust": "On Trust", "rules": "Cash at the Start", "pledge": "Your Pledge" },
  "about": [
    "A November story. The day before the Thanksgiving Turkey Trot for Saint Brine's roof, Della Rourke pawns the 1999 state cross-country medal she has worn inside her shirt in every race since, to pay her $60 pledge (§{dellaMedal}). Her brother Mick is meant to bring cash to the start line so she can buy it back there.",
    "At the start (§{trotStart}) Mick hasn't come. Give her the medal on trust, and she runs and pays you Friday with a pie (On Trust); hold to the deal, so she runs without it for the first time and finishes eleventh (Cash at the Start); or pay her pledge yourself and give her the medal (Your Pledge)."
  ],
  "cast": {
    "della": {
      "name": "Della Rourke",
      "look": { "skin": "#e8c0a0", "hair": "#2a1e16", "hs": 4, "coat": "#c84a3a", "style": "hoodie", "pants": "#2a2a3a", "band": "#f0f0f0" }
    }
  },
  "icons": {
    "medal": [
      "...rbbbbr...",
      "....rbbr....",
      ".....rr.....",
      ".....kk.....",
      "....kYYk....",
      "...kYyyYk...",
      "...kYyyYk...",
      "...kYyyYk...",
      "....kYYk....",
      ".....kk.....",
      "............",
      "............"
    ]
  },
  "uniques": {
    "trotMedal": {
      "name": "State cross-country medal, 1999",
      "icon": "medal",
      "cat": "curio",
      "guide": 45,
      "questKey": true,
      "tells": [
        "Gilt on bronze, a runner in relief, a red, white and blue ribbon gone soft. STATE CHAMPION, GIRLS, 1999.",
        "The pin on the back has been replaced with a safety pin. Twice."
      ]
    }
  },
  "scenes": {
    "dellaMedal": {
      "title": "Della Rourke pawns her medal for the pledge",
      "customer": "della",
      "steps": [
        {
          "say": "della",
          "text": [
            "Della Rourke. Tomorrow's the Turkey Trot. Five miles, the Green out to Gull Point and back, for Saint Brine's roof. Every runner pledges sixty. Payday's Friday.",
            "State cross-country, 1999. I ran it on a broken toe. I've run every race since with this pinned inside my shirt. Every one. I've never run without it.",
            "Sixty on it. My brother Mick's bringing cash to the start line at eight, and I buy it back right there. I need it back by the start. That's the whole deal."
          ]
        },
        { "view": { "counterIcon": "medal" } },
        {
          "choose": [
            { "label": "Lend her $60, back by the start", "disabled": "coin < 60 || !shelf.free" },
            {
              "label": "\"Pledge it on Friday. The roof will wait.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "della", "text": "The roof will wait. The pledges close at seven forty-five. Okay. I'll ask Mick for it tonight. Mick doesn't answer at night." },
                { "leave": "della" },
                { "end": true }
              ]
            }
          ]
        },
        { "view": { "counterIcon": null } },
        { "hook": "lend", "note": "A $60 loan against the medal, due back on the Friday of week 4." },
        { "set": { "trotIn": true } },
        { "plan": "trot-start", "after": 1 },
        { "say": "della", "text": "Eight o'clock. The bandstand. Bring it in your pocket, not in a bag. Bags get lost at races." },
        { "toast": "Calendar: the Turkey Trot start line, Thanksgiving morning", "look": "della" },
        { "leave": "della" }
      ]
    },
    "trotStart": {
      "title": "The Turkey Trot start line",
      "steps": [
        {
          "stage": "greenDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [70, 168] },
            { "id": "della", "cast": "della", "at": [150, 164], "facingLeft": true },
            { "id": "skip", "cast": "skip", "at": [250, 162], "facingLeft": true },
            {
              "id": "runner",
              "look": "random",
              "outfit": { "style": "hoodie" },
              "at": [[180, 168], [194, 172], [208, 168], [222, 172], [236, 168]],
              "facingLeft": true
            }
          ]
        },
        { "narrate": "Thanksgiving morning, ten to eight, frost on the Green. A hundred runners in turkey hats, a man dressed as a pie, and Skip Fairweather with a megaphone, standing on the bus bumper." },
        { "say": "skip", "text": "Two minutes! Anybody who hasn't pledged, Sister Amabel is at the table and she can see you!" },
        {
          "hook": "findLoan",
          "sets": ["loan", "medal"],
          "note": "The loan on the medal, and the medal if it is still in the shop."
        },
        { "say": "della", "text": "Mick's not here. Mick's not answering. Mick is asleep on a couch in Plymouth with his phone in a shoe. I know it." },
        {
          "if": "!medal",
          "then": [
            { "say": "della", "text": "You don't even have it with you? Okay. Okay. I'll run. I can run." },
            { "set": { "trotEnd": "rules" } },
            { "end": true }
          ]
        },
        { "say": "della", "text": "You've got it in your pocket. I can see the ribbon." },
        {
          "choose": [
            {
              "label": "Give it to her. She pays Friday.",
              "hint": "(on trust)",
              "then": [
                { "hook": "clearLoan" },
                { "take": "medal" },
                { "refresh": "panel" },
                { "set": { "trotEnd": "trust", "trotOwed": true } },
                {
                  "narrate": [
                    "She pins it inside her shirt without looking, the way you'd do up a button. Skip fires the starting horn, which is the bus horn.",
                    "Thirty-four minutes later she comes back down Front Street first in her age group, third overall, and raises one hand at you without slowing down."
                  ]
                },
                { "rep": 2 }
              ]
            },
            {
              "label": "\"Cash at the start. That was the deal.\"",
              "hint": "(she runs without it)",
              "then": [
                { "set": { "trotEnd": "rules" } },
                { "edit": "medal", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "della", "text": "Yeah. Yeah, it was. Fair's fair." },
                { "narrate": "She runs without it. She finishes eleventh, which is fine, and walks back past you with her hands on her head, which is not." },
                { "say": "skip", "text": "Never seen her run without it. Nineteen years on that bus route. Never once." },
                { "rep": -1 }
              ]
            },
            {
              "label": "Pay her pledge yourself, and give her the medal",
              "hint": "(forgive the $60)",
              "then": [
                { "hook": "clearLoan" },
                { "take": "medal" },
                { "refresh": "panel" },
                { "set": { "trotEnd": "pledge" } },
                { "narrate": "You put your name on Sister Amabel's pledge sheet under Della's. Sister Amabel writes \"PAID\" next to both with great satisfaction." },
                { "say": "della", "text": "I'm going to win my age group now. I don't have a choice. That's how this works." },
                { "narrate": "She does." },
                { "say": "skip", "text": "Saw that. The whole bus saw that. The whole bus is going to tell everybody." },
                { "rep": 4, "why": "Paid a runner's pledge to Saint Brine's roof" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "at": "4-3", "cast": "della", "scene": "dellaMedal" }],
  "errands": [
    {
      "id": "trot-start",
      "title": "The Turkey Trot start line",
      "where": "Harbor Green, the bandstand",
      "scene": "trotStart",
      "test": [
        { "set": { "trotIn": true } },
        { "add": { "unique": "trotMedal" }, "as": "medal" },
        { "hook": "testLoan" }
      ]
    }
  ],
  "calendar": [
    { "id": "trot-start", "errand": "trot-start", "story": "turkeytrot", "where": "Harbor Green", "title": "The Turkey Trot", "known": "flag.trotIn" }
  ],
  "mornings": [
    {
      "if": "flag.trotOwed && !flag.trotPaid && (week > 4 || (week == 4 && day >= 5))",
      "note": "Friday: Della pays what she owes, and brings a pie.",
      "then": [
        { "set": { "trotPaid": true } },
        { "coin": 78, "why": "Della Rourke paid what she owed, and a pie" },
        { "toast": "Della Rourke was waiting when you opened: seventy-eight dollars in an envelope, and a pumpkin pie, still warm.", "look": "della" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Della Rourke ran the Turkey Trot with her medal pinned inside her shirt, as always, and paid you on Friday, as promised.", "if": "flag.trotEnd == 'trust'" },
    { "line": "Della Rourke ran the Turkey Trot without her medal for the first time since 1999. It's still in your case. She walks past it.", "if": "flag.trotEnd == 'rules'" },
    { "line": "Your name is on Saint Brine's Turkey Trot sheet, next to Della Rourke's, who won her age group with her medal pinned on.", "if": "flag.trotEnd == 'pledge'" }
  ],
  "talk": {
    "by": "skip",
    "rumour": [
      "Della Rourke's run every race since 1999 with her state medal pinned inside her shirt. The kids call it her lucky medal. She says it's not luck.",
      "Turkey Trot's Thanksgiving morning. Sixty to enter, for the church roof. Della's short this year. Payday's the day after. Bad timing."
    ],
    "react": { "trust": "Della came down Front Street with one hand up. The whole bus saw it. She said you're all right. She doesn't say that.", "rules": "Della ran without the medal. Eleventh. She was fine. She wasn't fine.", "pledge": "You paid Della's pledge. The kids want to know if you'll pay theirs. I said no. I said maybe." },
    "sway": { "trust": { "skip": 2 }, "rules": { "skip": -1 }, "pledge": { "skip": 1 } }
  },
  "outcome": "flag.trotEnd"
});
