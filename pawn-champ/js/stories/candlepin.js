// Pawn Champ - The Candlepin Trophy. Minor quest m24, batch C (docs/quests/MINOR.md#m24).
// The losing captain pawns the league trophy in a sulk. On league night both teams want it, and
// you can sell it back or bowl one box for it (a timing mini-game: three balls, ten pins, in the
// code half).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/candlepin.js.
defineStory({
  "id": "candlepin",
  "kind": "minor",
  "title": "The Candlepin Trophy",
  "location": "pinwheel",
  "rumour": "The Pinwheel Lanes league trophy's gone missing.",
  "endings": { "strike": "Strike", "gutter": "Gutter", "sold": "Fair and Square" },
  "about": [
    "A small comic story. Marty Doucette, captain of the team that came second in the Pinwheel Lanes league by one pin, sells you the league trophy so that Bev's winning team can't have it (§{martyTrophy}).",
    "On league night (§{candleLeague}) both captains offer $60. Sell it back to Bev's team (Fair and Square), bowl one box on lane six for it, where knocking down all ten earns you a place on the team (Strike), or keep it in your window and let both captains glare at it (Gutter)."
  ],
  "cast": {
    "marty": {
      "name": "Marty Doucette",
      "look": { "skin": "#e0b090", "hair": "#3a2a1e", "hs": 0, "coat": "#3a8a4a", "style": "tee", "stout": true, "pants": "#2a2a30", "moustache": "#3a2a1e" }
    }
  },
  "icons": {
    "trophy": [
      ".....kk.....",
      "....kSSk....",
      "....kssk....",
      ".....kk.....",
      "kkkkkkkkkkkk",
      "kSkSSSSsskSk",
      "kSkSSSSsskSk",
      ".kkSSSssskk.",
      "...kSssk....",
      "....kssk....",
      "..kkkkkkkk..",
      "..kwwwwwwk.."
    ]
  },
  "uniques": {
    "candleTrophy": {
      "name": "Candlepin league trophy",
      "icon": "trophy",
      "cat": "silver",
      "guide": 20,
      "questKey": true,
      "tells": [
        "Silver plate over something that isn't silver.",
        "Engraved: PINWHEEL LANES TUESDAY LEAGUE. The newest name is HARBOR SPARES."
      ]
    }
  },
  "scenes": {
    "martyTrophy": {
      "title": "Marty Doucette pawns the league trophy",
      "customer": "marty",
      "steps": [
        {
          "say": "marty",
          "text": [
            "Marty Doucette, captain of the Deadwood. Second place, Pinwheel Lanes Tuesday league. By one pin.",
            "You'll hear the league trophy's gone missing. It hasn't. I took it home \"to polish\" and I'm not giving it to Bev Santos. She has a forklift driver on her team. A professional.",
            "Buy it. Then it's not mine and it's not hers. It's just yours."
          ]
        },
        { "offer": { "unique": "candleTrophy" }, "persona": "proud", "asking": 25, "min": 20 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "marty", "text": "Fine. It's going in my garage. Under the kayak." },
            { "leave": "marty" },
            { "end": true }
          ]
        },
        { "set": { "candleIn": true } },
        { "say": "marty", "text": "League night's Tuesday at Pinwheel Lanes. Bev will want it back. Let her ask. Let her ask nicely." },
        { "toast": "Calendar: league night at Pinwheel Lanes", "look": "marty" },
        { "leave": "marty" }
      ]
    },
    "candleLeague": {
      "title": "League night at Pinwheel Lanes",
      "steps": [
        { "hook": "pins", "note": "The lanes with no pins drawn on them." },
        {
          "stage": "pinwheel",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "marty", "cast": "marty", "at": [96, 164] },
            { "id": "bev", "cast": "bev", "at": [210, 162], "facingLeft": true },
            { "id": "bowler", "look": "random", "at": [50, 160] },
            { "id": "bowlers", "look": "random", "at": [[240, 166], [270, 160]], "facingLeft": true }
          ]
        },
        { "narrate": "League night at Pinwheel Lanes. Two teams, one trophy, and the trophy is in your bag." },
        { "say": "bev", "text": "Bev Santos, Harbor Spares, champions. I'll give you sixty for it. It's ours." },
        { "say": "marty", "text": "And I'll give you sixty to NOT give it to her." },
        { "find": "trophy", "in": "stock", "match": { "uniqueId": "candleTrophy" } },
        {
          "choose": [
            {
              "label": "Sell it back to the champions ($60)",
              "disabled": "!trophy",
              "then": [
                { "set": { "candleEnd": "sold" } },
                { "sell": "trophy", "to": "bev" },
                { "coin": 60, "why": "Sold the league trophy back to the Harbor Spares" },
                { "refresh": "panel" },
                { "say": "bev", "text": "Thank you. It's going in a glass case. With a lock." },
                { "say": "marty", "text": "This is the darkest day in Deadwood history." }
              ]
            },
            {
              "label": "Bowl one box for it on lane six",
              "disabled": "!trophy",
              "then": [
                { "say": "bev", "text": "One box. Three balls. Knock all ten down and we'll make you an honorary Spare. Leave one standing and the trophy stays with you, and we BOTH glare at you." },
                { "say": "marty", "text": "For once, Bev, I agree." },
                {
                  "hook": "bowl",
                  "sets": ["down"],
                  "note": "The bowling: three balls at ten pins, in the code half. \"down\" is how many fell."
                },
                {
                  "if": "down >= 10",
                  "then": [
                    { "set": { "candleEnd": "strike" } },
                    { "take": "trophy" },
                    { "coin": 30, "why": "Both captains chipped in after your ten-box" },
                    { "rep": 3 },
                    { "refresh": "panel" },
                    { "say": "bev", "text": "Ten in a box. Okay. Okay! You're on the team. Tuesday nights. Bring your own shoes." },
                    { "say": "marty", "text": "The Deadwood would like it on record that we asked first." },
                    { "narrate": "The trophy goes back on the shelf at Pinwheel Lanes, between the two captains, who agree to share it. That lasts a week." }
                  ],
                  "else": [
                    { "set": { "candleEnd": "gutter" } },
                    { "edit": "trophy", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" },
                    { "say": "bev", "text": "{down}. Not ten. It stays with you, then." },
                    { "say": "marty", "text": "And we'll be keeping an eye on it." }
                  ]
                }
              ]
            },
            {
              "label": "Keep it. It's on your shelf now.",
              "then": [
                { "set": { "candleEnd": "gutter" } },
                { "edit": "trophy", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "bev", "text": "Unbelievable." },
                { "say": "marty", "text": "Unbelievable. Bev, we'll glare at it together." }
              ]
            }
          ]
        },
        { "hook": "pins" }
      ]
    }
  },
  "beats": [{ "at": "2-4", "cast": "marty", "scene": "martyTrophy" }],
  "nights": [
    {
      "id": "candle-league",
      "window": ["3-1", "4-4"],
      "weekdays": [2],
      "if": "flag.candleIn",
      "scene": "candleLeague",
      "test": [{ "set": { "candleIn": true } }, { "add": { "unique": "candleTrophy" } }]
    }
  ],
  "calendar": [
    { "id": "candle-league", "night": "candle-league", "story": "candlepin", "where": "Pinwheel Lanes", "title": "League night", "known": "flag.candleIn", "scene": "candleLeague" }
  ],
  "mornings": [
    { "find": "trophy", "in": "stock", "match": { "uniqueId": "candleTrophy" } },
    { "toast": "Marty and Bev stop on the sidewalk, side by side, to glare at the trophy in your window.", "look": "bev", "if": "flag.candleEnd == 'gutter' && day == 1 && trophy", "note": "Gutter: both teams glare at it every Monday." }
  ],
  "epilogue": [
    { "find": "trophy", "in": "stock", "match": { "uniqueId": "candleTrophy" } },
    { "line": "You bowl for the Harbor Spares on Tuesday nights. Your average is terrible. Nobody minds.", "if": "flag.candleEnd == 'strike'" },
    { "line": "The Pinwheel Lanes league trophy is still in your window. Both captains still glare at it.", "if": "flag.candleEnd == 'gutter' && trophy" }
  ],
  "talk": {
    "by": "bev",
    "rumour": [
      "Somebody walked off with the league trophy at Pinwheel. I know who. He knows I know. League night is going to be a bloodbath. A slow, candlepin bloodbath."
    ],
    "react": { "strike": "The trophy's back on the shelf at Pinwheel. My team polishes it on Tuesdays.", "gutter": "We lost the trophy fair and square. I'm not over it. I will never be over it.", "sold": "You sold us our own trophy. I respect a businesswoman. Or man. I respect a business." },
    "sway": { "strike": { "bev": 3 }, "sold": { "bev": -1 } }
  },
  "fallout": {
    "gutter": { "id": "bev", "mood": "cold", "line": "We lost the trophy, and I think you know how. I'm not talking to you until league night. The next one. Next year.", "after": "Bev Santos bowled against your name on the scoreboard all month, in her head." }
  },
  "outcome": "flag.candleEnd"
});
