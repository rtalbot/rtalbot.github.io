// Pawn Champ - High Score. Minor quest m18, batch E (docs/quests/MINOR.md).
// A man pawns an arcade machine's circuit board so nobody can beat his 1989 high score. The owner
// wants it back. Its scene is a lunch errand at Neptune's Arcade, shut for the season, by day.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/highscore.js.
defineStory({
  "id": "highscore",
  "kind": "minor",
  "title": "High Score",
  "location": "arcade",
  "rumour": "Somebody beat the high score on Harbor Blaster. First time since 1989.",
  "endings": { "high": "New High Score", "over": "Game Over" },
  "outcome": "flag.scoreEnd",
  "about": [
    "A comedy about a thirty-seven-year arcade record. Dwight Pruett, top of the Harbor Blaster table since 1989, pulled the circuit board out of the cabinet before someone could beat him, and pawns it with you to keep it out of play (§{dwightBoard}). Mr. Fontaine of Neptune's Arcade comes for it (§{fontaineAsks}): sell it to him straight away, or come down for one game on the test bench.",
    "At the shut-up arcade (§{arcadeScore}) you play three waves, choosing to swerve left, fire or swerve right as each one comes. Win two of three and you beat Pruett by ten points and put your initials on the cabinet (New High Score); otherwise Fontaine buys the board back at what you paid (Game Over). Pruett comes in afterwards, outraged or relieved (§{dwightAfter})."
  ],
  "cast": {
    "dwight": {
      "name": "Dwight Pruett",
      "look": { "skin": "#f0d0b8", "hair": "#8a7a6a", "hs": 2, "coat": "#3a4a8a", "style": "hoodie", "pants": "#4a4a52", "glasses": "#2a2a2e" }
    },
    "fontaine": {
      "name": "Mr. Fontaine",
      "look": { "skin": "#7a5038", "hair": "#e8e8e8", "hs": 0, "coat": "#c84a3a", "style": "vest", "vest": "#2a2a3a", "pants": "#2a2a3a", "moustache": "#e8e8e8", "stout": true }
    }
  },
  "icons": {
    "board": [
      "............",
      "kkkkkkkkkkkk",
      "kgggGgggggGk",
      "kgkkkgyGgggk",
      "kgkkkgygkkgk",
      "kgggggyGkkgk",
      "kgyyyyyggggk",
      "kgggGgkkkkgk",
      "kgyggGkkkkgk",
      "kgygggggGggk",
      "kkkkkkkkkkkk",
      ".y.y.y.y.y.."
    ]
  },
  "uniques": {
    "blasterBoard": {
      "name": "Harbor Blaster circuit board",
      "icon": "board",
      "cat": "curio",
      "guide": 45,
      "questKey": true,
      "tells": [
        "An arcade board, 1987. The high-score chip has DWP 2,417,550 burned into it.",
        "A sticker on the back: PROPERTY OF NEPTUNE'S ARCADE."
      ]
    }
  },
  "scenes": {
    "dwightBoard": {
      "title": "Dwight Pruett pawns the Harbor Blaster board",
      "customer": "dwight",
      "steps": [
        {
          "say": "dwight",
          "text": [
            "You'll have heard. Somebody beat the high score on Harbor Blaster. First time since 1989.",
            "Well, they didn't. They got to two million four hundred thousand and I took the board out before they could finish. I have a key. I've always had a key.",
            "Dwight Pruett. D.W.P. Top of the table for thirty-seven years. Just hold on to this for me until the season's over."
          ]
        },
        { "offer": { "unique": "blasterBoard" }, "persona": "desperate", "asking": 25, "min": 14 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "scoreBoard": true } },
            { "say": "dwight", "text": "Don't let Fontaine have it. He'll put it back. People will PLAY it." }
          ],
          "else": [{ "say": "dwight", "text": "Then I'll keep it under my mattress. Again." }]
        },
        { "leave": "dwight" }
      ]
    },
    "fontaineAsks": {
      "title": "Mr. Fontaine wants his board back",
      "customer": "fontaine",
      "steps": [
        {
          "say": "fontaine",
          "text": [
            "Fontaine, Neptune's Arcade. Somebody pinched the board out of Harbor Blaster, and I hear it's here.",
            "I know who. He's done it before, in 1994. I'll make you an offer.",
            "Come down to the arcade at lunch. One game on the test bench. Beat the high score and the board's yours to sell me at a fair price, and your initials go on the cabinet. Lose, and I'll take it off you at what you paid."
          ]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "blasterBoard" } },
        {
          "choose": [
            {
              "label": "\"I'll be there.\"",
              "then": [
                { "plan": "arcade-score" },
                { "set": { "scoreInvite": true } },
                { "toast": "Calendar: Neptune's Arcade, lunchtime {placed:arcade-score}", "look": "fontaine" },
                { "say": "fontaine", "text": "Bring your thumbs." }
              ]
            },
            {
              "label": "\"Just buy it now.\" (+{hook:buyPrice})",
              "if": "it",
              "then": [
                { "set": { "scoreEnd": "over" } },
                { "sell": "it" },
                { "hook": "paidPlus", "with": [10, "Sold Mr. Fontaine his circuit board"] },
                { "say": "fontaine", "text": "Pleasure. Pruett will be in to complain. He always is." }
              ]
            }
          ]
        },
        { "leave": "fontaine" }
      ]
    },
    "arcadeScore": {
      "title": "One game of Harbor Blaster",
      "steps": [
        {
          "stage": "arcadeDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 164] },
            { "id": "fontaine", "cast": "fontaine", "at": [196, 156], "facingLeft": true }
          ]
        },
        { "narrate": "Neptune's Arcade, shut for the season. Dust sheets over the pinball, the sun coming through the salt on the windows. Fontaine has the Harbor Blaster cabinet open and plugged into a test bench." },
        { "find": "it", "in": "stock", "match": { "uniqueId": "blasterBoard" } },
        {
          "if": "!it",
          "then": [
            { "say": "fontaine", "text": "No board? Then it's just you and me and the dust. Go on home." },
            { "set": { "scoreEnd": "over" } },
            { "end": true }
          ]
        },
        { "say": "fontaine", "text": "Three waves. Pruett's score is two million four hundred and seventeen thousand. Insert coin." },
        { "hook": "waves", "sets": ["w1", "w2", "w3", "hits"] },
        { "narrate": "{w1.cue}" },
        {
          "choose": [{ "label": "Swerve left" }, { "label": "Fire!" }, { "label": "Swerve right" }],
          "as": "a1"
        },
        { "hook": "hit", "with": 1 },
        { "narrate": "{w2.cue}" },
        {
          "choose": [{ "label": "Swerve left" }, { "label": "Fire!" }, { "label": "Swerve right" }],
          "as": "a2"
        },
        { "hook": "hit", "with": 2 },
        { "narrate": "{w3.cue}" },
        {
          "choose": [{ "label": "Swerve left" }, { "label": "Fire!" }, { "label": "Swerve right" }],
          "as": "a3"
        },
        { "hook": "hit", "with": 3 },
        {
          "if": "hits >= 2",
          "then": [
            { "set": { "scoreEnd": "high" } },
            {
              "narrate": { "if": "hits == 3", "then": "2,417,560. The cabinet plays a tune nobody in Hollow Neck has heard since 1989. You didn't lose a single boat.", "else": "2,417,560. The cabinet plays a tune nobody in Hollow Neck has heard since 1989. " }
            },
            { "say": "fontaine", "text": "Ten points! You beat him by ten points! Put your letters in." },
            { "sell": "it" },
            { "hook": "guideTimes", "with": [1.4, "Sold Mr. Fontaine the Harbor Blaster board"] },
            { "rep": 2 }
          ],
          "else": [
            { "set": { "scoreEnd": "over" } },
            { "narrate": "GAME OVER. The kraken eats your last boat. Fontaine is very kind about it." },
            { "take": "it" },
            { "hook": "paidPlus", "with": [0, "Sold Mr. Fontaine the Harbor Blaster board"] },
            { "say": "fontaine", "text": "Nobody beats Pruett first go. Here's what you paid." }
          ]
        }
      ]
    },
    "dwightAfter": {
      "title": "Dwight Pruett, after",
      "customer": "dwight",
      "steps": [
        {
          "if": "flag.scoreEnd == 'high'",
          "then": [
            {
              "say": "dwight",
              "text": [
                "You. YOU. Thirty-seven years. And now it says YOU.",
                "...Was it the kraken? Did you swerve the kraken? Nobody swerves the kraken.",
                "I'm going to need you to show me."
              ]
            }
          ],
          "else": [
            { "say": "dwight", "text": "He put it back. I've already been down there. I'm still top. Sorry about all this." }
          ]
        },
        { "leave": "dwight" }
      ]
    }
  },
  "beats": [
    { "at": "1-4", "cast": "dwight", "scene": "dwightBoard" },
    { "at": "2-1", "cast": "fontaine", "scene": "fontaineAsks", "if": "flag.scoreBoard && hook.boardHere" },
    { "at": "3-3", "cast": "dwight", "scene": "dwightAfter", "if": "flag.scoreEnd" }
  ],
  "errands": [
    {
      "id": "arcade-score",
      "title": "One game of Harbor Blaster",
      "where": "Neptune's Arcade",
      "scene": "arcadeScore",
      "test": [{ "add": { "unique": "blasterBoard" }, "as": "it" }, { "edit": "it", "set": { "paid": 20 } }]
    }
  ],
  "calendar": [
    { "id": "arcade-score", "errand": "arcade-score", "story": "highscore", "where": "Neptune's Arcade", "title": "Harbor Blaster", "known": "flag.scoreInvite" }
  ],
  "epilogue": [
    { "line": "Your three letters are at the top of the Harbor Blaster table. Dwight Pruett plays every Saturday, ten points short.", "if": "flag.scoreEnd == 'high'" },
    { "line": "D.W.P. is still top of the Harbor Blaster table. Some things in Hollow Neck never change.", "if": "flag.scoreEnd == 'over'" }
  ]
});
