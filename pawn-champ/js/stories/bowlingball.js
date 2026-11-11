// Pawn Champ - The Bowling Ball. Minor quest m39, batch I (docs/quests/MINOR.md#m39-the-bowling-ball).
// A candlepin ball with a hollow core and something rattling inside it. The man who bowled with it
// was the league treasurer in 1979, the year the new-lanes fund vanished.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/bowlingball.js.
defineStory({
  "id": "bowlingball",
  "kind": "minor",
  "title": "The Bowling Ball",
  "location": "pinwheel",
  "rumour": "There's a candlepin ball that rattles like a maraca, and the man who owns it won't let anybody look inside.",
  "endings": { "league": "The Gunnar Lund Trophy", "split": "Finder's Fee", "rattle": "Still Rattling" },
  "about": [
    "A small mystery in a bowling ball. Arlo Lund sells his late father's candlepin ball, which rattles (§{ballArlo}). His father was league treasurer in 1979, the year the league's money went missing, and people still talk.",
    "The next morning you can drill out the plug. Inside is a key to locker 9 at Pinwheel Lanes. With Bev and Arlo at the lanes (§{ballLocker}), and something to cut or pry the old lock, you find $1,240 in 1979 bills and a note: Gunnar Lund hid the new-lanes fund from the owner, who was about to skip town with it. Give it all to the league (The Gunnar Lund Trophy) or take a finder's fee and split it with Arlo (Finder's Fee). Selling the ball unopened is Still Rattling."
  ],
  "cast": {
    "arlo": {
      "name": "Arlo Lund",
      "look": { "skin": "#f0d0b8", "hair": "#d8c8a0", "hs": 0, "coat": "#3a6a9a", "style": "tee", "stout": true, "pants": "#2a2a30", "beard": "#d8c8a0" }
    }
  },
  "icons": {
    "bowlball": [
      "............",
      "............",
      "....kkkk....",
      "...kvvvvk...",
      "..kvVvvvvk..",
      "..kVvvvvvk..",
      "..kvvvvvvk..",
      "..kvvvvvvk..",
      "...kvvvvk...",
      "....kkkk....",
      "............",
      "............"
    ]
  },
  "uniques": {
    "lundBall": {
      "name": "Gunnar Lund's candlepin ball",
      "icon": "bowlball",
      "cat": "curio",
      "guide": 12,
      "condLabel": "Chipped",
      "tells": [
        "Purple, small enough to hold in one hand, like every candlepin ball. Something inside it rattles.",
        "A plug of a slightly different purple, sanded flush, on one side."
      ]
    }
  },
  "overheard": [
    { "line": "Chuckling: \"There's a ball on lane four that rattles like a maraca. Bev won't let it on the lanes. Says it's haunted. Says it's worse than haunted, it's uneven.\"" }
  ],
  "scenes": {
    "ballArlo": {
      "title": "Arlo Lund sells his father's ball",
      "customer": "arlo",
      "steps": [
        {
          "say": "arlo",
          "text": [
            "Arlo Lund. This was my father's ball. Gunnar Lund. He bowled a hundred and forty with it in 1979 and never let anybody else touch it.",
            "It rattles. Always has. Bev Santos says a rattling ball is bad luck on her lanes. Bev says a lot of things. I could use ten dollars more than I could use a ball."
          ]
        },
        { "offer": { "unique": "lundBall" }, "persona": "desperate", "asking": 15, "min": 8 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "ballIn": true } },
            { "hook": "markDay" },
            { "say": "arlo", "text": "Dad was league treasurer, you know. The year the money went. People said things. People still say things." }
          ],
          "else": [{ "say": "arlo", "text": "Fair enough. It's a ball." }]
        },
        { "leave": "arlo" }
      ]
    },
    "ballLocker": {
      "title": "Locker 9 at Pinwheel Lanes",
      "steps": [
        { "hook": "clearPins" },
        {
          "stage": "pinwheel",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "bev", "cast": "bev", "at": [196, 162], "facingLeft": true },
            { "id": "arlo", "cast": "arlo", "at": [90, 166] }
          ]
        },
        { "narrate": "Pinwheel Lanes at lunchtime. A league of retirees on lanes one to four. Behind the snack bar, a wall of green lockers nobody has opened since the carpet was new." },
        { "say": "bev", "text": "Locker 9. That's from before me. That's from before the carpet. Arlo, did you know about this?" },
        { "say": "arlo", "text": "Dad never said a word. Not one. For forty years people said he took the money." },
        {
          "if": "quest.barrowboy && flag.eliEnd != 'told'",
          "note": "Eli Barrow, if The Barrow Boy is in the run and he hasn't been found out.",
          "then": [
            { "enter": { "id": "eli", "cast": "eli", "at": [236, 166], "facingLeft": true } },
            { "say": "eli", "text": "The key's too far gone. I've got bolt cutters. I've got everything. Don't ask why I've got bolt cutters." },
            { "remove": "eli" }
          ],
          "else": [
            {
              "if": "hook.carryingCut || hook.carryingPry",
              "note": "Items in use (docs/ITEMS_IN_USE.md).",
              "then": [
                { "use": "cut", "as": "it", "hard": true, "if": "hook.carryingCut" },
                { "use": "pry", "as": "it", "hard": true, "if": "!hook.carryingCut" },
                { "set": { "ballOpened": true } },
                { "rep": 1 },
                { "say": "bev", "text": "The key won't turn. Forty years of snack-bar steam. Tell me you brought something." },
                {
                  "narrate": { "if": "it", "then": "You did. The {it.name|lower} does the rest.", "else": "You did. It does the rest." }
                }
              ],
              "else": [
                { "say": "bev", "text": "The key won't turn. Forty years of snack-bar steam. Arlo, the fire axe." },
                { "say": "arlo", "text": "We are not using the fire axe, Bev." },
                { "narrate": "Twenty minutes, a butter knife and most of a can of WD-40 later, the key gives up before the lock does. Bev fetches the hammer from the pinsetter room." }
              ]
            }
          ]
        },
        { "narrate": "The locker opens with a noise like a bad knee. Inside: a canvas bank bag, and in it twelve hundred and forty dollars in 1979 bills, rubber-banded, and a letter." },
        { "say": "arlo", "text": "\"Harold Voss is going to skip town with the new-lanes fund. I've hidden it till the audit. If you're reading this, I didn't get to tell anybody. G.L.\" Harold Voss owned this place. He left in 1980. With a waitress." },
        { "say": "bev", "text": "The new-lanes fund. My mother put five dollars a week into that." },
        {
          "choose": [
            {
              "label": "Give it all to the league",
              "then": [
                { "set": { "ballEnd": "league" } },
                { "rep": 5, "why": "Found the 1979 league fund" },
                { "say": "bev", "text": "New pinsetters. Real ones. And the trophy gets a new name. The Gunnar Lund Trophy. Arlo, you're presenting it. In a tie." },
                { "say": "arlo", "text": "He'd hate that. He'd love that." }
              ]
            },
            {
              "label": "Take a finder's fee and split the rest with Arlo",
              "hint": "(+$150)",
              "then": [
                { "set": { "ballEnd": "split" } },
                { "coin": 150, "why": "A finder's fee from the 1979 league fund" },
                { "rep": -1 },
                { "say": "arlo", "text": "Fair. You found it. I mean, Dad found it. Then he hid it. Then you found it." },
                { "say": "bev", "text": "The league will hear about this. The league hears about everything." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "at": "2-1", "cast": "arlo", "scene": "ballArlo" }],
  "errands": [
    {
      "id": "ball-locker",
      "title": "Locker 9",
      "where": "Pinwheel Lanes",
      "scene": "ballLocker",
      "test": [{ "set": { "ballIn": true, "ballOpen": true } }]
    }
  ],
  "calendar": [
    {
      "id": "ball-locker",
      "errand": "ball-locker",
      "story": "bowlingball",
      "where": "Pinwheel Lanes",
      "title": "Locker 9",
      "known": "flag.ballOpen",
      "scene": "ballLocker",
      "bring": ["cut", "pry"]
    }
  ],
  "mornings": [
    { "find": "ball", "in": "stock", "match": { "uniqueId": "lundBall" } },
    {
      "if": "flag.ballIn && !flag.ballOpen && !flag.ballAsked && !flag.ballEnd && ball && hook.dayAfter",
      "note": "The morning after you buy it: open it up?",
      "then": [
        { "set": { "ballAsked": true } },
        {
          "choose": [
            {
              "label": "Drill out the plug in the rattling ball",
              "then": [
                { "set": { "ballOpen": true } },
                {
                  "edit": "ball",
                  "set": {
                    "guide": 2,
                    "condLabel": "Drilled",
                    "clues": [{ "text": "Drilled open. It was hollow, and it held a key." }]
                  }
                },
                { "narrate": "Under the plug, the core is hollow. Out drops a small brass key stamped 9, wrapped in a note in pencil: \"LOCKER 9. FOR THE LEAGUE. G.L. 1979.\"" },
                { "plan": "ball-locker" },
                { "toast": "Calendar: locker 9 at Pinwheel Lanes, {placed:ball-locker} at noon", "icon": "bowlball" },
                { "refresh": "panel" }
              ]
            },
            { "label": "Leave it rattling" }
          ]
        }
      ]
    }
  ],
  "sold": { "lundBall": [{ "set": { "ballEnd": "rattle" }, "if": "!flag.ballEnd && !flag.ballOpen" }] },
  "epilogue": [
    { "line": "The Tuesday league bowls for the Gunnar Lund Trophy. Arlo presents it, in a tie, every year.", "if": "flag.ballEnd == 'league'" },
    { "line": "Pinwheel Lanes still has the old pinsetters. Arlo Lund bought a boat with his half. The league talks about it.", "if": "flag.ballEnd == 'split'" },
    { "line": "Somewhere a candlepin ball still rattles. Nobody in Hollow Neck ever found out why the new lanes never got built.", "if": "flag.ballEnd == 'rattle'" }
  ],
  "outcome": "flag.ballEnd"
});
