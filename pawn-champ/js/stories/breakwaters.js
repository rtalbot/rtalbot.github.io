// Pawn Champ - The Breakwaters Reunion. Major quest M12, batch C (docs/quests/MAJOR.md#m12).
// A local band from 1987 gets one more night, and one of their songs is about Odile. Lend them
// your stock, listen to the tape, and the gig is a third route to the lighthouse clue.
// The Harvest Fair (a warm-up on the bandstand) is Dory's freezer's hub (js/stories/freezer.js).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "breakwaters",
  "months": [1, 2],
  "kind": "major",
  "colour": "#d8a040",
  "family": "town",
  "title": "The Breakwaters Reunion",
  "crosses": ["freezer", "benefit", "selectmen"],
  "rumour": "A school bus driver wants back a guitar he pawned in 1994.",
  "endings": { "odile": "Odile in the Fog", "oneMore": "One More Night", "lastChord": "Last Chord" },
  "outcome": [
    { "if": "flag.bwLastChord", "ending": "lastChord" },
    { "if": "flag.bwGig && flag.bwHeard", "ending": "odile" },
    { "if": "flag.bwGig", "ending": "oneMore" }
  ],
  "about": [
    "A warm music story. Skip Fairweather, the school bus driver, asks after a guitar he pawned in 1994 (§{skipGuitar}). Odile held it for thirty years, with a tape in the case: BREAKWATERS, SIDE B. Give it back, sell it back for $60, or have him play and then buy it outright, which ends the story there (Last Chord).",
    "Otherwise his old band gets back together. At rehearsal in Pinwheel Lanes (§{bwRehearsal}) they need instruments and you can lend from your shelves. Dee Marchetti, the singer, wrote a song on side B about Odile, and wants you to hear it before she'll sing it. You need a tape deck: Lorna Pike may sell you one (§{bwDeckSeller}), and then you can play the tape one morning. It's about a blue light in the Gull Point lighthouse that Odile went looking for, and it gives you the lighthouse clue.",
    "They warm up on the bandstand at the Harvest Fair if it's in the run (§{bwWarmup}), and play the Rusty Anchor (§{bwGigNight}), where you can play tambourine, run merch or sit in. If you've heard the tape (or bring the deck), Dee sings Odile in the Fog (Odile in the Fog); otherwise it's One More Night. Collect the guitar, jacket, set list and sticks and Dee offers $220 for the lot."
  ],
  "cast": {
    "dee": {
      "name": "Dee Marchetti",
      "look": { "skin": "#e0b090", "hair": "#2a1e16", "hs": 5, "coat": "#8a2a3a", "style": "jacket", "trim": "#e8e4dc", "apron": "#e8e4dc", "pants": "#2a2a30" }
    },
    "benny": {
      "name": "Benny Okafor",
      "look": { "skin": "#5a3a28", "hair": "#1a1210", "hs": 0, "coat": "#e8f0f4", "style": "tee", "pants": "#3a4a6a", "glasses": "#2a2a2e" }
    },
    "wanda": {
      "name": "Wanda Lusk",
      "look": { "skin": "#f0c8a8", "hair": "#c83a1a", "hs": 4, "coat": "#2a2a30", "style": "vest", "vest": "#c83a1a", "pants": "#3a3a48", "band": "#e8e4dc" }
    },
    "lorna": {
      "name": "Lorna Pike",
      "look": { "skin": "#c89070", "hair": "#5a4a3a", "hs": 3, "coat": "#6a8a5a", "style": "puffer", "pants": "#3a3a42", "bag": "#8a5a3a" }
    }
  },
  "icons": {
    "cassette": [
      "............",
      "............",
      "kkkkkkkkkkkk",
      "kddddddddddk",
      "kdppppppppdk",
      "kdpkcppkcpdk",
      "kdppppppppdk",
      "kddddddddddk",
      "kddkkkkkkddk",
      "kkkkkkkkkkkk",
      "............",
      "............"
    ],
    "tapedeck": [
      "............",
      "..k.........",
      "..k.........",
      "kkkkkkkkkkkk",
      "kdddddddddsk",
      "kdkkkkkkkdsk",
      "kdkpcppckdsk",
      "kdkkkkkkkdsk",
      "kdddddddddsk",
      "kdrdgdbddddk",
      "kkkkkkkkkkkk",
      "............"
    ],
    "sticks": [
      "............",
      "kk......kk..",
      "kWk....kWk..",
      ".kWk..kWk...",
      "..kWkkWk....",
      "...kWWk.....",
      "...kWWk.....",
      "..kWkkWk....",
      ".kWk..kWk...",
      "kWk....kWk..",
      "kk......kk..",
      "............"
    ],
    "jacket": [
      "............",
      "...kk..kk...",
      "..kbbkkbbk..",
      ".kbbbBBbbbk.",
      "kbbbbBBbbbbk",
      "kbkbbBBbbkbk",
      "kbkbbBBbbkbk",
      "kbkbbBBbbkbk",
      "kbkbbBBbbkbk",
      "kkkbbBBbbkkk",
      "...kkkkkk...",
      "............"
    ]
  },
  "uniques": {
    "bwGuitar": {
      "name": "Skip's sunburst guitar",
      "icon": "guitar",
      "cat": "instrument",
      "guide": 140,
      "set": "The Breakwaters",
      "condLabel": "Fine",
      "tells": [
        "A paper tag on the headstock in Odile's hand: FAIRWEATHER, HOLD. 1994.",
        "Someone has scratched \"B-WATERS\" into the back, very small."
      ]
    },
    "bwTape": {
      "name": "Breakwaters, side B (cassette)",
      "icon": "cassette",
      "cat": "curio",
      "guide": 5,
      "questKey": true,
      "tells": ["Hand-labelled: BREAKWATERS - SIDE B - DON'T TAPE OVER.", "Needs a tape deck to play."]
    },
    "bwDeck": {
      "name": "Portable tape deck",
      "icon": "tapedeck",
      "cat": "curio",
      "guide": 25,
      "tells": ["Plays, rewinds, and eats tapes only occasionally."]
    },
    "bwSetList": {
      "name": "The Breakwaters' set list",
      "icon": "letter",
      "cat": "curio",
      "guide": 20,
      "set": "The Breakwaters",
      "tells": ["Taped to the stage at the Rusty Anchor. A coffee ring on song four."]
    },
    "bwJacket": {
      "name": "Breakwaters band jacket",
      "icon": "jacket",
      "cat": "curio",
      "guide": 60,
      "set": "The Breakwaters",
      "tells": ["Denim, 1987. The patch on the back is hand-stitched: a lighthouse and a wave."]
    },
    "bwSticks": {
      "name": "Wanda's drumsticks",
      "icon": "sticks",
      "cat": "instrument",
      "guide": 10,
      "set": "The Breakwaters",
      "condLabel": "Splintered",
      "tells": ["Splintered at both ends. She hits everything too hard."]
    }
  },
  "scenes": {
    "skipGuitar": {
      "title": "Skip Fairweather asks after the guitar he pawned in 1994",
      "customer": "skip",
      "steps": [
        {
          "say": "skip",
          "text": [
            "Skip Fairweather. I drive the school bus. Route 2, the long one.",
            "This is a long shot. In 1994 I pawned a sunburst guitar here. Odile said she'd hold it till I came back for it. I didn't come back for it."
          ]
        },
        { "narrate": "You check the back room. Behind the water heater, under a tarp, is a guitar case with a paper tag in Odile's handwriting: FAIRWEATHER, HOLD. In the lid pocket is a cassette labelled BREAKWATERS, SIDE B." },
        { "view": { "counterIcon": "guitar" } },
        { "say": "skip", "text": "She HELD it. Thirty years. Of course she did." },
        {
          "choose": [
            { "label": "Give it back to him" },
            { "label": "Sell it back to him ($60)" },
            {
              "label": "\"Play something first.\"",
              "then": [
                { "narrate": "Skip tunes it by ear, badly, then well. He plays a riff that climbs, stops, and goes somewhere you didn't expect." },
                {
                  "say": "skip",
                  "text": [
                    "Dee wrote that. Dee Marchetti. She cooks at Saint Brine's now. We were the Breakwaters. Four of us, one van, one good song.",
                    "Maybe it should stay here, honestly. I'm fifty-eight. What am I going to do, play the Harvest Fair?"
                  ]
                },
                {
                  "choose": [
                    { "label": "Give it back to him" },
                    { "label": "Sell it back to him ($60)" },
                    {
                      "label": "Buy it from him outright and let him go",
                      "hint": "(-$80)",
                      "disabled": "coin < 80",
                      "then": [
                        { "set": { "bwLastChord": true } },
                        { "coin": -80, "why": "Bought Skip Fairweather's guitar" },
                        { "add": { "unique": "bwGuitar" }, "as": "guitar" },
                        { "edit": "guitar", "set": { "paid": 80 } },
                        { "add": { "unique": "bwTape" }, "as": "tape" },
                        { "edit": "tape", "set": { "questKey": false, "nosale": false } },
                        { "refresh": "panel" },
                        { "say": "skip", "text": "Yeah. Yeah, that's right. Keep the tape too. I can't listen to it." },
                        { "narrate": "He plays one more chord on it before he goes, and leaves it ringing." },
                        { "view": { "counterIcon": null } },
                        { "leave": "skip" },
                        { "end": true }
                      ]
                    }
                  ],
                  "as": "give"
                }
              ]
            }
          ],
          "as": "give"
        },
        { "rep": 3, "if": "give == 0" },
        { "coin": 60, "why": "Skip bought back his guitar", "if": "give != 0" },
        { "set": { "bwIn": true } },
        {
          "say": "skip",
          "text": [
            "Dee's been on at me for years. The Harvest Fair wants a band. The Rusty Anchor would give us a Thursday. We'd need to rehearse.",
            "Benny sold his bass at a yard sale. Wanda's kit is under a kayak in her sister's garage. You wouldn't... lend us a few things? From the shelves?",
            "Back room at Pinwheel Lanes, one night next week. And keep the tape. I can't listen to it. Dee sings on side B."
          ]
        },
        { "add": { "unique": "bwTape" } },
        { "refresh": "panel" },
        { "toast": "Calendar: Breakwaters rehearsal, Pinwheel Lanes", "look": "skip" },
        { "view": { "counterIcon": null } },
        { "leave": "skip" }
      ]
    },
    "bwRehearsal": {
      "title": "Rehearsal at Pinwheel Lanes",
      "note": "Two of them need instruments, and you can lend from your stock. Lent things come back after the gig.",
      "steps": [
        { "hook": "pins", "with": false, "note": "the lanes are quiet: no pins up" },
        {
          "stage": "pinwheel",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "skip", "cast": "skip", "at": [130, 164] },
            { "id": "dee", "cast": "dee", "at": [196, 160], "facingLeft": true },
            { "id": "benny", "cast": "benny", "at": [226, 166], "facingLeft": true },
            { "id": "wanda", "cast": "wanda", "at": [256, 158], "facingLeft": true }
          ]
        },
        { "narrate": "Pinwheel Lanes on a weeknight. Somebody on lane eight is having the night of their life. The Breakwaters set up between the snack bar and the back room door." },
        {
          "say": "dee",
          "text": [
            "Dee Marchetti. You're the one who had Skip's guitar for thirty years. Odile's niece. Or nephew. Odile's.",
            "She used to sit right there at the snack bar and tell us we were too loud. She came to every show."
          ]
        },
        { "set": { "bwLent": [] } },
        { "find": "strings", "in": "forSale", "match": { "cat": "instrument" }, "all": true },
        { "say": "benny", "text": "Benny Okafor, bass. Also a dentist. Mostly a dentist. Have you got anything with strings?" },
        {
          "if": "strings.count",
          "then": [
            {
              "choose": [
                {
                  "label": "Lend the {strings.0.name|lower}",
                  "hint": "({strings.0.condLabel}, guide {strings.0.guide|money})",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "strings", "n": 0, "by": "benny" },
                      "sets": ["bennyLent"]
                    }
                  ]
                },
                {
                  "label": "Lend the {strings.1.name|lower}",
                  "hint": "({strings.1.condLabel}, guide {strings.1.guide|money})",
                  "if": "strings.count > 1",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "strings", "n": 1, "by": "benny" },
                      "sets": ["bennyLent"]
                    }
                  ]
                },
                {
                  "label": "Lend the {strings.2.name|lower}",
                  "hint": "({strings.2.condLabel}, guide {strings.2.guide|money})",
                  "if": "strings.count > 2",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "strings", "n": 2, "by": "benny" },
                      "sets": ["bennyLent"]
                    }
                  ]
                },
                {
                  "label": "Lend the {strings.3.name|lower}",
                  "hint": "({strings.3.condLabel}, guide {strings.3.guide|money})",
                  "if": "strings.count > 3",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "strings", "n": 3, "by": "benny" },
                      "sets": ["bennyLent"]
                    }
                  ]
                },
                { "label": "Lend nothing" }
              ]
            }
          ],
          "else": [{ "narrate": "Nothing on your shelves would do. They'll make do." }]
        },
        { "say": "benny", "text": "Oh, that'll do. That'll more than do.", "if": "bennyLent" },
        { "find": "drums", "in": "forSale", "match": { "cat": ["instrument", "silver"] }, "all": true },
        { "say": "wanda", "text": "Wanda. Drums. I need something to hit. Anything. I mean that." },
        {
          "if": "drums.count",
          "then": [
            {
              "choose": [
                {
                  "label": "Lend the {drums.0.name|lower}",
                  "hint": "({drums.0.condLabel}, guide {drums.0.guide|money})",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "drums", "n": 0, "by": "wanda" },
                      "sets": ["wandaLent"]
                    }
                  ]
                },
                {
                  "label": "Lend the {drums.1.name|lower}",
                  "hint": "({drums.1.condLabel}, guide {drums.1.guide|money})",
                  "if": "drums.count > 1",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "drums", "n": 1, "by": "wanda" },
                      "sets": ["wandaLent"]
                    }
                  ]
                },
                {
                  "label": "Lend the {drums.2.name|lower}",
                  "hint": "({drums.2.condLabel}, guide {drums.2.guide|money})",
                  "if": "drums.count > 2",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "drums", "n": 2, "by": "wanda" },
                      "sets": ["wandaLent"]
                    }
                  ]
                },
                {
                  "label": "Lend the {drums.3.name|lower}",
                  "hint": "({drums.3.condLabel}, guide {drums.3.guide|money})",
                  "if": "drums.count > 3",
                  "then": [
                    {
                      "hook": "lend",
                      "with": { "from": "drums", "n": 3, "by": "wanda" },
                      "sets": ["wandaLent"]
                    }
                  ]
                },
                { "label": "Lend nothing" }
              ]
            }
          ],
          "else": [{ "narrate": "Nothing on your shelves would do. They'll make do." }]
        },
        { "say": "wanda", "text": "Perfect. I'll be gentle. I won't be gentle.", "if": "wandaLent" },
        {
          "narrate": {
            "if": "flag.bwLent.count == 2",
            "then": "They play. It's rough, and loud, and every so often for a bar or two it's the band they used to be.",
            "else": { "if": "flag.bwLent.count", "then": "They play. Rough, but with a bottom end. Wanda drums on a snack bar tray.", "else": "They play. Benny hums the bass line. Wanda drums on a snack bar tray. Somebody on lane eight boos, affectionately." }
          }
        },
        {
          "say": "dee",
          "text": [
            "Side B. You've got the tape? I wrote a song on it about your aunt. Odile in the Fog. I haven't sung it in thirty years.",
            "Listen to it before the gig. Then tell me if I should sing it. You must have a tape deck in that shop. Pawnshops always have a tape deck."
          ]
        },
        { "say": "skip", "text": "The Rusty Anchor. Two weeks Thursday, or whenever they'll have us. And the Harvest Fair, if we're brave." },
        { "toast": "Calendar: the Breakwaters at the Rusty Anchor", "look": "dee" }
      ]
    },
    "bwDeckSeller": {
      "title": "Lorna Pike sells a tape deck",
      "note": "A tape deck turns up at the counter, after Dee has told you to find one.",
      "customer": "lorna",
      "steps": [
        { "say": "lorna", "text": "Lorna Pike. I'm clearing out my mother's basement. Do you buy tape decks? It's a tape deck." },
        { "offer": { "unique": "bwDeck" }, "persona": "honest", "asking": 18, "min": 10 },
        { "say": "lorna", "text": "It plays. It eats a tape now and then, but it plays.", "if": "offer == 'deal'" },
        { "leave": "lorna" }
      ]
    },
    "bwWarmup": {
      "title": "The Harvest Fair: the Breakwaters warm up on the bandstand",
      "steps": [
        { "set": { "bwWarmup": true } },
        { "enter": { "id": "dee", "cast": "dee", "at": [236, 150], "facingLeft": true } },
        { "enter": { "id": "skip", "cast": "skip", "at": [214, 152] } },
        { "narrate": "Three songs on the bandstand. The first starts in two different keys. In the second, Wanda's stick flies into the pie table. The third is a cover of a song everyone knows, and everyone sings it louder than the band." },
        { "say": "dee", "text": "Thank you, Hollow Neck! We have been the Breakwaters! We will be better on Thursday!" },
        { "say": "skip", "text": "We will be MUCH better on Thursday." },
        { "rep": 1 },
        { "remove": "dee" },
        { "remove": "skip" }
      ]
    },
    "bwGigNight": {
      "title": "The gig at the Rusty Anchor",
      "steps": [
        { "hook": "stage", "with": true, "note": "the Rusty Anchor's stage lights" },
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "drinker", "look": "random", "at": [[30, 162], [56, 166]] },
            {
              "id": "listener",
              "look": "random",
              "at": [[150, 170], [174, 162], [196, 166], [214, 170], [228, 162]],
              "facingLeft": true
            },
            { "id": "dee", "cast": "dee", "at": [268, 148], "facingLeft": true },
            { "id": "skip", "cast": "skip", "at": [248, 150] },
            { "id": "benny", "cast": "benny", "at": [306, 150], "facingLeft": true },
            { "id": "wanda", "cast": "wanda", "at": [288, 146], "facingLeft": true }
          ]
        },
        { "narrate": "The Rusty Anchor, Thursday. Half the town in a bar built for a third of it. Somebody has taped a set list to the stage." },
        {
          "narrate": {
            "if": "flag.bwLent.count == 2",
            "then": "They sound like a band. A real one, a bit older and a lot happier.",
            "else": { "if": "flag.bwLent.count", "then": "They sound good. Benny's bass line holds the whole thing up.", "else": "They sound brave. Wanda plays a beer crate. It works, mostly." }
          }
        },
        {
          "choose": [
            {
              "label": "Get up and play tambourine",
              "then": [
                { "rep": 2 },
                { "say": "wanda", "text": "You're behind the beat. Stay behind the beat. It's working." }
              ]
            },
            {
              "label": "Run the band's merch table",
              "then": [
                { "coin": 25, "why": "Sold Breakwaters cassettes off the merch table (your cut)" },
                { "narrate": "Twelve copies of a tape dubbed in Benny's waiting room. You sell eleven. Skip buys the twelfth." }
              ]
            },
            {
              "label": "Stay at the bar and listen",
              "then": [
                { "narrate": "You lean on the bar under the ship's bell, and for an hour nobody wants anything from you." }
              ]
            },
            {
              "label": "Sit in with the band on what's in your bag",
              "needs": "play",
              "without": "If you'd brought something to play, Skip would have waved you up.",
              "note": "items in use (docs/ITEMS_IN_USE.md)",
              "then": [
                { "use": "play", "as": "it" },
                { "set": { "bwSatIn": true } },
                { "rep": 4, "why": "Sat in with the Breakwaters" },
                { "narrate": "Skip waves you up. You play the {it.name|lower|or:thing} through three songs, mostly in the right key, and the Anchor cheers you like you were in the band in 1990." },
                { "say": "wanda", "text": "Not bad. Not good. But not bad. Come to the next one." }
              ]
            }
          ]
        },
        {
          "say": "dee",
          "text": [
            "This next one's off side B. I haven't sung it in thirty-four years.",
            "Did you listen to it? Should I?"
          ]
        },
        { "find": "tape", "in": "stock", "match": { "uniqueId": "bwTape" } },
        {
          "if": "!flag.bwHeard && hook.deckInBag && tape",
          "note": "the tape deck in your bag",
          "then": [
            { "set": { "bwHeard": true, "bwBackRoom": true } },
            { "narrate": "You take her into the back room, between the kegs, and play side B on the little deck you brought. Dee listens with her eyes shut. Then she goes back out and nods to Skip." }
          ]
        },
        {
          "if": "flag.bwHeard",
          "then": [
            { "say": "you", "text": "Sing it." },
            { "narrate": "Dee sings Odile in the Fog. The bar goes so quiet you can hear the ice in the glasses. At the line about the blue light, half the room looks at you." },
            {
              "say": "dee",
              "text": [
                "She rowed us out to Gull Point in '87. The lamp had been dark for twenty years. Then it came on. Blue. She said one day she'd go and find out why.",
                "Maybe she did."
              ]
            }
          ],
          "else": [
            { "say": "you", "text": "I haven't heard it yet." },
            { "say": "dee", "text": "Then not tonight. Another night." },
            { "narrate": "They close with the song everyone knows, and everyone sings it louder than the band." }
          ]
        },
        { "set": { "bwGig": true } },
        { "hook": "stage", "with": false },
        {
          "hook": "returnLent",
          "sets": ["lent", "dented"],
          "note": "lent things come back; Wanda's come back one condition worse"
        },
        {
          "if": "lent.count",
          "then": [
            { "rep": 8 },
            {
              "toast": { "if": "dented", "then": "The band brought back what you lent them. Wanda's was a bit dented.", "else": "The band brought back what you lent them." },
              "look": "benny"
            }
          ]
        },
        { "set": { "bwLent": [] } },
        {
          "add": { "unique": "bwSetList" },
          "note": "keepsakes: the set list from the stage, Benny's jacket if you lent anything, Wanda's sticks"
        },
        {
          "if": "lent.count",
          "then": [
            { "add": { "unique": "bwJacket" } },
            { "say": "benny", "text": "Take the jacket. You kept me from playing air bass. Professionally, that's worth a jacket." }
          ]
        },
        { "add": { "unique": "bwSticks" } },
        { "find": "tape", "in": "stock", "match": { "uniqueId": "bwTape" } },
        { "edit": "tape", "set": { "questKey": false, "nosale": false } },
        { "say": "skip", "text": "One more night. That's all I wanted." },
        { "find": "guitar", "in": "stock", "match": { "uniqueId": "bwGuitar" } },
        {
          "choose": [
            {
              "label": "Offer to buy the guitar off him, for good",
              "hint": "(-$80)",
              "disabled": "coin < 80 || guitar",
              "then": [
                { "coin": -80, "why": "Bought Skip's guitar after the gig" },
                { "add": { "unique": "bwGuitar" }, "as": "bought" },
                { "edit": "bought", "set": { "paid": 80 } },
                { "say": "skip", "text": "Yeah. Odile would like it back where she kept it." }
              ]
            },
            {
              "label": "Tell him to keep playing it",
              "then": [{ "say": "skip", "text": "I might. The kids on the bus might not thank you." }]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "at": "1-3", "cast": "skip", "scene": "skipGuitar" },
    { "at": "3-1", "cast": "lorna", "scene": "bwDeckSeller", "if": "flag.bwIn && !flag.bwGig && !hook.deckHere" }
  ],
  "nights": [
    {
      "id": "bw-rehearsal",
      "window": ["1-4", "2-4"],
      "if": "flag.bwIn",
      "scene": "bwRehearsal",
      "test": [{ "set": { "bwIn": true } }, { "add": { "item": "lute" } }, { "add": { "item": "goblet" } }]
    },
    {
      "id": "bw-gig",
      "window": ["3-2", "4-4"],
      "weekdays": [4],
      "if": "flag.bwIn",
      "scene": "bwGigNight",
      "test": [
        { "hook": "gigTest", "note": "a lute lent to Benny and a goblet to Wanda, the tape on the shelf, $200, and the tape heard or not" }
      ]
    }
  ],
  "vignettes": [
    { "hub": "fair", "label": "The Breakwaters warm up on the bandstand", "if": "flag.bwIn && !flag.bwWarmup && !flag.bwGig", "scene": "bwWarmup" }
  ],
  "calendar": [
    { "id": "bw-rehearsal", "night": "bw-rehearsal", "story": "breakwaters", "where": "Pinwheel Lanes", "title": "Breakwaters rehearsal", "known": "flag.bwIn", "scene": "bwRehearsal" },
    { "id": "bw-fair", "night": "hub-fair", "story": "breakwaters", "where": "Harbor Green", "title": "The Breakwaters warm up", "known": "flag.bwIn", "scene": null, "order": 2 },
    {
      "id": "bw-gig",
      "night": "bw-gig",
      "story": "breakwaters",
      "where": "The Rusty Anchor",
      "title": "The Breakwaters' gig",
      "known": "seen.bw-rehearsal",
      "scene": "bwGigNight",
      "bring": ["play"]
    }
  ],
  "mornings": [
    { "find": "tape", "in": "stock", "match": { "uniqueId": "bwTape" } },
    { "find": "deck", "in": "stock", "match": { "uniqueId": "bwDeck" } },
    {
      "if": "flag.bwIn && !flag.bwHeard && !flag.bwGig && tape && deck && !hook.askedToday",
      "note": "once you have the tape and a deck: play it before opening",
      "then": [
        { "hook": "askToday" },
        {
          "choose": [
            {
              "label": "Play the Breakwaters tape before you open",
              "then": [
                { "set": { "bwHeard": true } },
                { "hook": "music", "with": "tender" },
                {
                  "narrate": [
                    "Side B. Tape hiss, a count-in, Skip's riff. Then Dee, at twenty, singing to someone who isn't in the room:",
                    "\"Rowed out past Gull Point with the oars wrapped in rags, / the lamp had been dark since before we were born. / Then it came on blue, and you said don't tell, / so I'm telling the tape, and the tape won't tell anyone.\"",
                    "The lighthouse at Gull Point. A blue light, in a lighthouse that's been dark for decades. Odile saw it in 1987 and never stopped wondering."
                  ]
                },
                {
                  "if": "!flag.lighthouseClue",
                  "then": [
                    { "set": { "lighthouseClue": true } },
                    { "toast": "Clue: a blue light in the old lighthouse", "icon": "cassette" }
                  ],
                  "else": [
                    { "narrate": "Old Pell told you about the blue light too. Now you know Odile went looking for it long before she disappeared." }
                  ]
                },
                { "hook": "music", "with": "day" }
              ]
            },
            { "label": "Not this morning" }
          ]
        }
      ]
    },
    {
      "if": "flag.bwGig && !flag.bwSetSold && hook.fullSet",
      "note": "the full set (guitar, set list, jacket, sticks): Dee buys it back for the band",
      "then": [
        { "set": { "bwSetSold": true } },
        { "hook": "walkIn", "with": "dee", "sets": ["dee"] },
        { "say": "dee", "text": "Skip says you've got all of it. The guitar, the jacket, the set list, Wanda's poor sticks. I want the band back together. All of it. $220?" },
        {
          "choose": [
            {
              "label": "Sell her the lot ($220)",
              "then": [
                { "hook": "sellSet" },
                { "say": "dee", "text": "It's going on the wall at Saint Brine's kitchen. The kids will hate it." }
              ]
            },
            {
              "label": "Keep the collection",
              "then": [{ "say": "dee", "text": "Fair. It's in good hands. Odile's hands, nearly." }]
            }
          ]
        },
        { "leave": "dee" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Skip Fairweather drives the long route every morning. He hums at the red lights.", "if": "flag.bwLastChord" },
    { "line": "The Breakwaters play the Rusty Anchor on the first Thursday of every month now. They always finish with Odile in the Fog.", "if": "!flag.bwLastChord && flag.bwGig && flag.bwHeard" },
    { "line": "The Breakwaters play the Rusty Anchor whenever it will have them. Dee still hasn't sung side B. She says she's waiting for the right night.", "if": "!flag.bwLastChord && flag.bwGig && !flag.bwHeard" }
  ]
});
