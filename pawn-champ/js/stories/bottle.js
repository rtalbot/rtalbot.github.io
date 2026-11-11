// Pawn Champ - Return to Sender: a message in a bottle, addressed to the shop in Odile's handwriting,
// dated next year. Minor quest m60, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Dot brings word (Old Pell found it); a lunch errand on the breakwater.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "bottle",
  "kind": "minor",
  "group": "deep",
  "title": "Return to Sender",
  "location": "sandbar",
  "rumour": "A bottle on the breakwater, addressed to the Crooked Scale.",
  "endings": { "thrown": "Thrown Back", "sealed": "Still Sealed", "opened": "Opened" },
  "uniques": {
    "odileBottle": {
      "name": "A sealed bottle from the breakwater",
      "icon": "bottle",
      "cat": "curio",
      "guide": 15,
      "condLabel": "Sealed with wax",
      "wantedBy": { "name": "Bertram Quayle", "mult": 8 },
      "wantedKnown": "flag.bottleKept",
      "tells": [
        "Green glass, a wax seal, a rolled letter inside.",
        "Through the glass: THE CROOKED SCALE, HIGH STREET, in Aunt Odile's hand. And a date. Next year's."
      ]
    }
  },
  "soundings": { "bottle-letter": "\"It's still coming up. Keep the scale level. They weigh things too.\" A letter from Odile, dated next year." },
  "overheard": [
    { "line": "Laughing: \"Old Pell won't fish off the breakwater this week. Says there's a bottle out there with his name on it. Not his name. Somebody's.\"" }
  ],
  "about": [
    "A very short uncanny story. Dot says Old Pell found a bottle in the rocks at the end of the breakwater, addressed to your shop in Odile's handwriting, and he wouldn't touch it (§{dotBottle}).",
    "At low tide (§{bottleBreakwater}) the bottle is dated next October. Throw it back unopened (Thrown Back), keep it sealed for a collector (Still Sealed), or open it, which counts as a Look: a note from Odile saying \"It's still coming up. Keep the scale level. They weigh things too\" (Opened)."
  ],
  "scenes": {
    "dotBottle": {
      "title": "Dot: a bottle on the breakwater",
      "customer": "dot",
      "steps": [
        {
          "say": "dot",
          "text": [
            "Old Pell came into the Clam Shack white as a sheet. There's a bottle wedged in the rocks at the end of the breakwater. Green glass, message in it.",
            "It's addressed to this shop, he says. In Odile's writing. He knows her writing. He wouldn't touch it.",
            "Low tide's around noon this week. You could walk out and get it. Or leave it for the sea. I know which I'd do, and I'd do the other one."
          ]
        },
        { "set": { "bottleHeard": true } },
        { "plan": "bottle-breakwater" },
        { "toast": "Calendar: the breakwater, at lunch", "look": "dot" },
        { "leave": "dot" }
      ]
    },
    "bottleBreakwater": {
      "title": "The bottle in the rocks",
      "steps": [
        {
          "stage": "sandbar",
          "fadeOut": false,
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [200, 164] }]
        },
        {
          "narrate": [
            "Low tide. You walk out along the granite blocks to the beacon. Wedged in a crack, just above the weed line, is a green bottle with a wax seal.",
            "THE CROOKED SCALE, HIGH STREET, HOLLOW NECK. Odile's hand, no question. And a date in the corner, in the same ink: next October."
          ]
        },
        {
          "choose": [
            {
              "label": "Throw it back into the sea, unopened",
              "then": [
                { "set": { "bottleEnd": "thrown" } },
                { "narrate": "It goes a long way. It bobs once, and then the tide has it, heading out past the beacon. Maybe it's going to whoever it was really for. Maybe that's still you." }
              ]
            },
            {
              "label": "Keep it sealed",
              "hint": "(a collector would pay well)",
              "then": [
                { "set": { "bottleKept": true, "bottleEnd": "sealed" } },
                {
                  "if": "shelf.free",
                  "then": [
                    { "add": { "unique": "odileBottle" } },
                    { "refresh": "panel" },
                    { "narrate": "You carry it home in both hands. Bertram Quayle at the Historical Society collects sealed bottles. He'd pay a lot more for one that's never been opened." }
                  ],
                  "else": [
                    { "narrate": "You have no room for it. You set it back in its crack in the rocks. It'll be there. It's been waiting this long." }
                  ]
                }
              ]
            },
            {
              "label": "Break the seal and read it",
              "hint": "(Look)",
              "then": [
                { "set": { "bottleEnd": "opened" } },
                {
                  "narrate": [
                    "The wax cracks. The letter is short, on the shop's own notepaper, and the ink is fresh.",
                    "\"Whoever's behind the counter now. It's still coming up. Keep the scale level. They weigh things too. O.\""
                  ]
                },
                { "sounding": "bottle-letter" },
                { "narrate": "When you look up from the letter, the bottle in your other hand is full of seawater, though the seal was tight." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "bottle-dot", "from": "1-2", "to": "2-2", "cast": "dot", "scene": "dotBottle" }],
  "errands": [
    {
      "id": "bottle-breakwater",
      "title": "The bottle in the rocks",
      "where": "the breakwater",
      "scene": "bottleBreakwater",
      "test": [{ "set": { "bottleHeard": true } }]
    }
  ],
  "calendar": [
    { "id": "bottle-breakwater", "errand": "bottle-breakwater", "story": "bottle", "where": "The breakwater", "title": "The bottle in the rocks", "known": "flag.bottleHeard" }
  ],
  "epilogue": [
    {
      "line": { "if": "flag.odileFreed || flag.odileHome", "then": "You keep Odile's letter in the till drawer. When you showed it to her, she read it twice and asked you not to show it to her again.", "else": "You keep Odile's letter in the till drawer, in case she comes back to write it." },
      "if": "flag.bottleEnd == 'opened'",
      "note": "with the bottle opened, Odile won't explain at the lighthouse; she only looks at the scale"
    },
    { "line": "The sealed bottle sits on the shelf by the scale. On still nights you could swear something inside is writing.", "if": "flag.bottleEnd == 'sealed'" }
  ],
  "outcome": "flag.bottleEnd"
});
