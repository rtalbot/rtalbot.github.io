// Pawn Champ - The Portrait. Minor quest m49, batch K (docs/quests/MINOR.md).
// A junior clerk from the Gilded Hand pawns the oil portrait of his manager from the office wall, and
// insists it shows his real face. Under the loupe there's a second face beneath the paint: the same
// face, a hundred and thirty years earlier. The manager is Merrit Gaunt. Its scene is the Gilded Hand's
// top floor after hours (officeAfter, drawn in the code half, with the portrait on the wall).
// Merrit reads the main story's flags only (the ledger, the deal with Ms. Vantreece).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/portrait.js.
defineStory({
  "id": "portrait",
  "kind": "minor",
  "title": "The Portrait",
  "location": "officeAfter",
  "rumour": "A clerk from the Gilded Hand has been asking pawnshops whether they take oil paintings. Nervously.",
  "endings": { "returned": "Back on the Wall", "turned": "Facing the Wall", "sold": "Off the Wall" },
  "about": [
    "A short uncanny story about the Gilded Hand. Wilbur Fairley, a junior clerk, pawns the oil portrait of his manager Merrit Gaunt from the office wall, because it shows Gaunt's real face and he needs a week without it watching him (§{wilburPawns}). Gaunt comes in offering $150 for it (§{merritPortrait}); his greeting depends on how you've dealt with the Hand before.",
    "Before the audit Wilbur begs you to help hang it back after hours (§{wilburBack}). Refuse and he redeems it himself (Back on the Wall). In the dark office (§{portrait}) hang it the right way round (Back on the Wall), hang it facing the wall to reveal an 1891 stamp on the back (Facing the Wall), or take it away again. Gaunt has been sitting behind the desk the whole time. Selling it to him, or taking it back to your shop, ends Off the Wall."
  ],
  "cast": {
    "wilbur": {
      "name": "Wilbur Fairley",
      "look": { "skin": "#f0d0b8", "hair": "#c8a070", "hs": 1, "coat": "#3a3a44", "style": "suit", "trim": "#c8a050", "pants": "#2a2a30", "glasses": "#2a2a2e", "bag": "#3a2a1e" }
    }
  },
  "uniques": {
    "gauntPortrait": {
      "name": "Portrait of a manager, in oils",
      "icon": "painting",
      "cat": "art",
      "guide": 70,
      "questKey": true,
      "tells": [
        "Merrit Gaunt, three-quarter length, in a dark suit, painted to look much more expensive than it is.",
        "Under the loupe, through the varnish: another face, painted first and painted over. The same face. Side-whiskers, a high collar. The canvas stamp says 1891."
      ]
    }
  },
  "scenes": {
    "wilburPawns": {
      "title": "Wilbur Fairley pawns his manager's portrait",
      "customer": "wilbur",
      "steps": [
        {
          "say": "wilbur",
          "text": [
            "Wilbur Fairley. Junior clerk, Gilded Hand Finance. Please don't tell anyone I was here. Do you take oil paintings?",
            "It's Mr. Gaunt. The portrait in the office. I sit opposite it, nine hours a day. It isn't a flattering painting. It's an ACCURATE painting. It shows his real face. Nobody else sees it.",
            "I took it off the wall at lunch. I'll put it back before the audit. I just need one week without it looking at me."
          ]
        },
        { "offer": { "unique": "gauntPortrait" }, "persona": "desperate", "asking": 30, "min": 15 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "portraitHeld": true } },
            { "say": "wilbur", "text": "Use your loupe on it. Go on. Then tell me I'm imagining things." }
          ],
          "else": [
            { "say": "wilbur", "text": "Then it's back on the wall by two o'clock and I'm back opposite it. Fine. FINE." }
          ]
        },
        { "leave": "wilbur" }
      ]
    },
    "merritPortrait": {
      "title": "Merrit Gaunt wants his portrait",
      "customer": "merrit",
      "note": "What he says first depends on how the main story stands between you.",
      "steps": [
        { "find": "it", "in": "stock", "match": { "uniqueId": "gauntPortrait" } },
        {
          "if": "flag.gaveLedger",
          "then": [
            { "say": "merrit", "text": "We have an understanding now, you and I. So I'll be brief, as one understands." }
          ],
          "else": [
            {
              "if": "flag.leveraged",
              "then": [
                { "say": "merrit", "text": "Ms. Vantreece hasn't forgotten your little threat. Neither have I. I'm here about something else." }
              ],
              "else": [
                {
                  "if": "flag.ledger",
                  "then": [
                    { "say": "merrit", "text": "You have something of ours already. Let's not make it two things." }
                  ],
                  "else": [
                    {
                      "if": "flag.burned",
                      "then": [
                        { "say": "merrit", "text": "I hear you burn things you shouldn't read. Sensible. Be sensible again." }
                      ],
                      "else": [
                        { "say": "merrit", "text": "Merrit Gaunt. You know me. Everyone on Water Street knows me, on Fridays." }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "if": "!it",
          "then": [
            { "say": "merrit", "text": "There was a portrait of me on our wall. It isn't there. If it comes to you, I'm a buyer." },
            { "leave": "merrit" },
            { "end": true }
          ]
        },
        { "say": "merrit", "text": "A portrait of me is on your shelf. Company property. My clerk is unwell. One-fifty, and we'll say no more about it." },
        {
          "choose": [
            {
              "label": "Sell it to him (+$150)",
              "then": [
                { "set": { "portraitEnd": "sold" } },
                { "sell": "it", "to": "merrit" },
                { "coin": 150, "why": "Sold Merrit Gaunt his own portrait" },
                { "refresh": "panel" },
                { "say": "merrit", "text": "Thank you. Did you look at it under the loupe? ...No. Of course not. Good." }
              ]
            },
            {
              "label": "\"Your clerk pawned it. It's his to redeem.\"",
              "then": [
                { "set": { "portraitStood": true } },
                { "say": "merrit", "text": "Then he'd better redeem it before the audit. For his sake." }
              ]
            }
          ]
        },
        { "leave": "merrit" }
      ]
    },
    "wilburBack": {
      "title": "Wilbur asks for help hanging it back",
      "customer": "wilbur",
      "steps": [
        {
          "say": "wilbur",
          "text": [
            "He knows. He hasn't said anything. He just keeps looking at the wall where it was, and then at me, and smiling.",
            "The audit's next week. It has to go back up. Tonight, after hours, I have a key. It takes two to hang, it's heavy, and I can't ask anyone at work. Please."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll come {placed:portrait} night.\"",
              "then": [
                { "set": { "portraitNight": true } },
                { "toast": "Calendar: Gilded Hand Finance, after hours, {placed:portrait} night", "look": "wilbur" },
                { "say": "wilbur", "text": "The side door. Don't touch the lift. The lift tells him." }
              ]
            },
            {
              "label": "\"I'm not breaking into the Gilded Hand, Wilbur.\"",
              "then": [
                { "find": "it", "in": "stock", "match": { "uniqueId": "gauntPortrait" } },
                {
                  "if": "it",
                  "then": [
                    { "take": "it" },
                    { "hook": "redeem", "with": "Wilbur Fairley redeemed the portrait", "note": "He pays back what you lent him." },
                    { "refresh": "panel" }
                  ]
                },
                { "set": { "portraitEnd": "returned" } },
                { "say": "wilbur", "text": "Then I'll buy it back and do it alone. Somehow." }
              ]
            }
          ]
        },
        { "leave": "wilbur" }
      ]
    },
    "portrait": {
      "title": "Hang the portrait",
      "music": "tension",
      "steps": [
        { "hook": "hang", "with": 0, "note": "Nothing on the wall yet." },
        {
          "stage": "officeAfter",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 164] },
            { "id": "wilbur", "cast": "wilbur", "at": [92, 164] }
          ]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "gauntPortrait" } },
        { "narrate": "Gilded Hand Finance, the top floor, after hours. Rain on the big window. Only the green desk lamp is on, and Wilbur swears he turned it off at five." },
        {
          "if": "!it",
          "then": [
            { "say": "wilbur", "text": "You don't have it? Then he does. Then it's already... Let's go. Let's go now." },
            { "set": { "portraitEnd": "sold" } },
            { "end": true }
          ]
        },
        { "say": "wilbur", "text": "There. The hook. Lift on three." },
        {
          "choose": [
            {
              "label": "Hang it the right way round",
              "then": [
                { "take": "it" },
                { "refresh": "panel" },
                { "hook": "hang", "with": 1 },
                { "set": { "portraitEnd": "returned" } },
                { "narrate": "It goes up straight. In the lamplight, for a second, there are two faces in the paint, and both of them look pleased to be home." }
              ]
            },
            {
              "label": "Hang it facing the wall",
              "then": [
                { "take": "it" },
                { "refresh": "panel" },
                { "hook": "hang", "with": 2, "note": "2: hung with its face to the wall." },
                { "set": { "portraitEnd": "turned" } },
                { "narrate": "It goes up straight, with its face to the wall: brown canvas, the framer's label, and the stamp. 1891." }
              ]
            },
            {
              "label": "\"Leave it. Wilbur, we're taking it back with us.\"",
              "then": [
                { "hook": "backOfShelf", "note": "It goes back on your shelf, at the end, and it is yours to sell now." },
                { "set": { "portraitEnd": "sold" } },
                { "narrate": "You carry it back down the stairs between you. Wilbur doesn't look at it once." }
              ]
            }
          ]
        },
        { "enter": { "id": "merrit", "cast": "merrit", "at": [280, 150], "facingLeft": true } },
        { "narrate": "A chair creaks behind the desk. Merrit Gaunt has been sitting there in the dark the whole time." },
        {
          "say": "merrit",
          "text": {
            "if": "flag.portraitEnd == 'returned'",
            "then": "Thank you, Wilbur. Thank you, pawnbroker. It's a family resemblance, if anybody asks. Go home.",
            "else": { "if": "flag.portraitEnd == 'turned'", "then": "...Well. That's honest, at least. Leave it. I've looked at myself for long enough.", "else": "Keep it, then. Sell it. Whoever buys it will get used to it. Everybody does." }
          }
        },
        { "say": "wilbur", "text": "Am I fired?" },
        { "say": "merrit", "text": "Nobody is ever fired from the Gilded Hand, Wilbur." },
        { "hook": "hang", "with": 0 }
      ]
    }
  },
  "beats": [
    { "at": "2-2", "cast": "wilbur", "scene": "wilburPawns" },
    { "at": "2-4", "cast": "merrit", "scene": "merritPortrait", "if": "flag.portraitHeld && !flag.portraitEnd" },
    { "at": "3-2", "cast": "wilbur", "scene": "wilburBack", "if": "flag.portraitHeld && !flag.portraitEnd" }
  ],
  "nights": [
    {
      "id": "portrait",
      "window": ["3-3", "4-3"],
      "if": "flag.portraitNight && !flag.portraitEnd",
      "scene": "portrait",
      "test": [{ "set": { "portraitNight": true } }, { "add": { "unique": "gauntPortrait" } }]
    }
  ],
  "calendar": [
    { "id": "portrait", "night": "portrait", "story": "portrait", "where": "Gilded Hand Finance", "title": "Hang the portrait", "known": "flag.portraitNight", "scene": "portrait" }
  ],
  "epilogue": [
    { "line": "Merrit Gaunt's portrait is back on the Gilded Hand's wall. Wilbur Fairley has asked to move desks. Twice.", "if": "flag.portraitEnd == 'returned'" },
    { "line": "The portrait in Merrit Gaunt's office hangs facing the wall. Nobody turns it round. Wilbur Fairley sleeps better.", "if": "flag.portraitEnd == 'turned'" },
    { "line": "Somewhere, someone owns a portrait of Merrit Gaunt painted in 1891. They've got used to it.", "if": "flag.portraitEnd == 'sold'" }
  ],
  "talk": {
    "by": "gordie",
    "rumour": [
      "A kid from the Gilded Hand came on the lot asking if I take oil paintings in trade. Oil paintings! On a Buick!",
      "Sweating like it was August. Whatever he's carrying, he wants it gone more than he wants a car."
    ],
    "react": { "returned": "That portrait is back up at the Gilded Hand, I hear. The kid's asked to move desks. I'd ask to move towns.", "turned": "Merrit Gaunt's portrait is hanging backwards. Backwards! I'd put that in an ad if I could figure out what it means.", "sold": "There's a painting of Merrit Gaunt loose in the world. If anybody offers it to me in trade, the answer is no." },
    "sway": { "turned": { "gordie": 1 }, "sold": { "gordie": -1 } }
  },
  "outcome": "flag.portraitEnd"
});
