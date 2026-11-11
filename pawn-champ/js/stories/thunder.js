// Pawn Champ - The Thunder Sheet. Minor quest m68, batch L (docs/quests/MINOR.md#m68-the-thunder-sheet).
// WHNK, the town's one-room radio station over the old Clarion office, does a live Halloween radio
// play every year. A volunteer pawned the sound-effects trunk to pay the tower's electric bill.
// Redeem it for them and you do the effects live (a timing game: three cues), sell it to a theatre,
// or the play goes out with Ruthie Kroll doing every noise with her mouth.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/thunder.js.
defineStory({
  "id": "thunder",
  "months": [1],
  "kind": "minor",
  "title": "The Thunder Sheet",
  "location": "clarionStudio",
  "rumour": "WHNK might not get its Halloween radio play on the air this year.",
  "endings": { "live": "Live on WHNK", "theatre": "Sold to the Stage", "mouth": "Every Noise by Mouth" },
  "outcome": "flag.thunderEnd",
  "about": [
    "An October story. Gideon Platt of WHNK, the volunteer radio station above the old Clarion, pawns the sound-effects trunk for the Halloween radio play to pay the tower's electric bill, so the play can go out live as it has since 1961 (§{gideonTrunk}). Ruthie does every voice in it and refuses to do the thunder too.",
    "On the night (§{whnkPlay}) bring the trunk and do the effects yourself, a three-cue timing game (thunder sheet, coconuts, creaking door) where each hit you land improves the reviews (Live on WHNK). Or sell the trunk to a theatre in Providence (Sold to the Stage), or leave it in the shop so Ruthie does every noise by mouth (Every Noise by Mouth)."
  ],
  "cast": {
    "gideon": {
      "name": "Gideon Platt",
      "look": { "skin": "#e8c0a0", "hair": "#5a3a2a", "hs": 1, "coat": "#3a3a4a", "style": "hoodie", "pants": "#2a2a30", "glasses": "#2a2a2e", "beard": "#5a3a2a" }
    }
  },
  "icons": {
    "fxtrunk": [
      "............",
      "............",
      "..kkkkkkkk..",
      ".kwWWWWWWwk.",
      ".kwwwyywwwk.",
      ".kkkkkkkkkk.",
      ".kwwwwwwwwk.",
      ".kwSkwwkSwk.",
      ".kwwwwwwwwk.",
      ".kwwwwwwwwk.",
      ".kkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "fxTrunk": {
      "name": "WHNK sound-effects trunk",
      "icon": "fxtrunk",
      "cat": "curio",
      "guide": 90,
      "questKey": true,
      "tells": [
        "A steamer trunk of noises: a sheet of tin for thunder, two coconut halves, a box with a door hinge that creaks, a tray of gravel, a bag of cornflour that crunches like snow.",
        "Stencilled inside the lid: WHNK 1340 AM. PROPERTY OF THE HALLOWEEN PLAY. DO NOT LEND TO THE SCHOOL."
      ]
    }
  },
  "scenes": {
    "gideonTrunk": {
      "title": "Gideon pawns the radio play's effects trunk",
      "customer": "gideon",
      "steps": [
        {
          "say": "gideon",
          "text": [
            "Gideon Platt. I volunteer at WHNK, upstairs at the old Clarion. Mornings, the tide report. Afternoons, the swap shop. Nights, mostly sleeping in the chair.",
            "The tower's electric bill came. We've got a week before they cut us off, and the Halloween play's the last week of the month. Live. Every year since 1961.",
            "This is our effects trunk. Thunder sheet, coconuts, the creaking door. I'm pawning the play's sound to pay for the play's air. I see the problem. Seventy dollars?"
          ]
        },
        { "offer": { "unique": "fxTrunk" }, "persona": "desperate", "asking": 70, "min": 50 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "gideon", "text": "Then I'll sell the swap shop's swaps. Somebody wants a waffle iron." },
            { "leave": "gideon" },
            { "end": true }
          ]
        },
        { "set": { "thunderIn": true } },
        { "say": "gideon", "text": "The play's {placed:whnk-play} night. Ruthie Kroll's doing every part again. If you wanted to come up, there's always room by the microphone. Bring the trunk, if you're feeling generous." },
        { "leave": "gideon" }
      ]
    },
    "whnkPlay": {
      "title": "The Halloween radio play",
      "steps": [
        { "hook": "studio", "note": "off air, no flash, and the night music" },
        {
          "stage": "clarionStudio",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 168] },
            { "id": "ruthie", "cast": "ruthie", "at": [150, 164] },
            { "id": "gideon", "cast": "gideon", "at": [236, 162], "facingLeft": true }
          ]
        },
        { "narrate": "WHNK, upstairs at the old Clarion. Egg-crate foam on every wall, one microphone, a reel-to-reel, and a clock with a red second hand that everyone keeps looking at." },
        { "say": "ruthie", "text": "Ruthie Kroll, owner of the Rusty Anchor, tonight playing the Widow, the Sea Captain, the Ghost and the Narrator. I've been doing it since the Narrator died. The man, I mean." },
        { "say": "gideon", "text": "Ninety seconds. Did you bring the trunk?" },
        { "find": "trunk", "in": "stock", "match": { "uniqueId": "fxTrunk" } },
        {
          "choose": [
            {
              "label": "Give them the trunk back, and do the effects yourself",
              "hint": "(a timing game)",
              "disabled": "!trunk",
              "then": [
                { "hook": "onAir", "with": true },
                { "take": "trunk" },
                { "say": "gideon", "text": "Thank God. Thunder sheet's on the hook. Coconuts on the table. When Ruthie points, you go. And we're ON." },
                { "say": "ruthie", "text": "\"It was a night like this one, in Hollow Neck, in the fall of 1888...\"" },
                { "narrate": "Ruthie points at the thunder sheet." },
                {
                  "hook": "cue",
                  "sets": ["hit", "hits"],
                  "note": "the timing bar: hit is whether you hit it, hits how many so far"
                },
                {
                  "if": "hit",
                  "then": [
                    { "hook": "flash" },
                    { "narrate": "BOOM. The whole studio rattles. Somewhere on Main Street, a dog barks back." }
                  ],
                  "else": [
                    { "narrate": "It goes off a beat late: a long tinny wobble, like a cookie sheet dropped in another room." }
                  ]
                },
                { "say": "ruthie", "text": "\"The Captain rode up Cliff Road like the devil was behind him...\"" },
                {
                  "hook": "cue",
                  "sets": ["hit", "hits"],
                  "note": "the timing bar: hit is whether you hit it, hits how many so far"
                },
                {
                  "if": "hit",
                  "then": [
                    { "narrate": "Clop, clop, clop on the gravel tray, and a slow stop. Gideon gives you a thumbs up." }
                  ],
                  "else": [
                    { "narrate": "The coconuts gallop on, for some time after the horse has stopped. Ruthie ad-libs: \"The horse... carried on without him.\"" }
                  ]
                },
                { "say": "ruthie", "text": "\"...and the door of the old house opened, slowly, by itself.\"" },
                {
                  "hook": "cue",
                  "sets": ["hit", "hits"],
                  "note": "the timing bar: hit is whether you hit it, hits how many so far"
                },
                {
                  "if": "hit",
                  "then": [
                    { "narrate": "The hinge box creaks, long and low and perfect. Gideon puts his hand over his mouth." }
                  ],
                  "else": [{ "narrate": "The hinge box squeaks once, brightly, like a toy." }]
                },
                { "set": { "thunderEnd": "live" } },
                { "set": { "thunderHits": 0 }, "if": "hits == 0" },
                { "set": { "thunderHits": 1 }, "if": "hits == 1" },
                { "set": { "thunderHits": 2 }, "if": "hits == 2" },
                { "set": { "thunderHits": 3 }, "if": "hits == 3" },
                { "rep": 1, "if": "hits == 0" },
                { "rep": 2, "if": "hits == 1" },
                { "rep": 3, "if": "hits == 2" },
                { "rep": 4, "if": "hits == 3" },
                {
                  "narrate": {
                    "if": "hits == 3",
                    "then": "At the end the phone lines light up, all two of them. Both callers want to know who did the thunder.",
                    "else": { "if": "hits > 0", "then": "At the end the phone rings once. It's Ruthie's mother. She liked it.", "else": "At the end there's silence, then Ruthie laughing so hard she has to sit on the floor. It's the best-reviewed play in WHNK history." }
                  }
                }
              ]
            },
            {
              "label": "Tell Gideon a theatre in Providence wants the trunk",
              "hint": "($180)",
              "disabled": "!trunk",
              "then": [
                { "hook": "onAir", "with": true },
                { "set": { "thunderEnd": "theatre" } },
                { "sell": "trunk" },
                { "coin": 180, "why": "Sold the WHNK effects trunk to a theatre in Providence" },
                { "say": "gideon", "text": "A real theatre. Well. That's where it should be, really. That's the tower paid for till spring, too, if I'm honest about the commission." },
                { "narrate": "The play goes out with Ruthie doing the thunder with her cheeks and the horse with her tongue. It's better than you'd think. It's worse than the trunk." }
              ]
            },
            {
              "label": "Leave the trunk in the shop. Ruthie can manage.",
              "then": [
                { "hook": "onAir", "with": true },
                { "set": { "thunderEnd": "mouth" } },
                {
                  "if": "trunk",
                  "then": [
                    { "edit": "trunk", "set": { "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                },
                { "say": "ruthie", "text": "Fine. I've been practising. Gideon, put a towel over the mic." },
                { "narrate": "The thunder is Ruthie blowing a raspberry into a coffee can. The horse is her tongue. The creaking door is a noise she makes in her throat that nobody in the room ever wants to hear again. The phone lines light up. People are crying with laughter on Front Street." },
                { "rep": 1 }
              ]
            }
          ]
        },
        { "hook": "onAir", "with": false }
      ]
    }
  },
  "beats": [{ "drift": "thunder", "from": "2-3", "to": "3-4", "cast": "gideon", "scene": "gideonTrunk" }],
  "nights": [
    {
      "id": "whnk-play",
      "window": ["4-1", "4-4"],
      "if": "flag.thunderIn && !flag.thunderEnd",
      "scene": "whnkPlay",
      "test": [{ "set": { "thunderIn": true } }, { "add": { "unique": "fxTrunk" } }]
    }
  ],
  "calendar": [
    { "id": "whnk-play", "night": "whnk-play", "story": "thunder", "where": "WHNK, over the Clarion", "title": "The Halloween radio play", "known": "flag.thunderIn", "scene": "whnkPlay" }
  ],
  "epilogue": [
    {
      "line": { "if": "flag.thunderHits == 3", "then": "WHNK has asked you back to do the thunder next Halloween. Gideon wrote it on the studio wall.", "else": "You did the effects for WHNK's Halloween play. Gideon kept the tape. He plays it at parties." },
      "if": "flag.thunderEnd == 'live'"
    },
    { "line": "WHNK's thunder sheet is in a theatre in Providence. WHNK's tower has its lights on till spring.", "if": "flag.thunderEnd == 'theatre'" },
    { "line": "People still do Ruthie Kroll's creaking door at the bar. She hates it. She does it back.", "if": "flag.thunderEnd == 'mouth'" }
  ],
  "talk": {
    "by": "ruthie",
    "rumour": [
      "WHNK might not get the Halloween play on the air this year. The tower bill came, and Gideon at the station pawned the sound-effects kit.",
      "I've done every voice in that play since 1998. I am not doing the thunder as well."
    ],
    "react": { "live": "You did the thunder! Rattled the glasses in my bar on the radio. Gideon wants you every year.", "theatre": "The trunk's in a theatre in Providence. I did the thunder with my cheeks. Don't ask me to do it again. Don't.", "mouth": "Every noise, by mouth, live on the air. The creaking door is going to haunt me. People do it at me in the bar." }
  }
});
