// Pawn Champ - The Sounding: an old man pawns a lump of lead and asks you never to clean it.
// Major quest M20, the deep set (docs/quests/MAJOR.md#m20-the-sounding-uncanny).
//
// Hook (W1 Tue-Thu)          Cyrus Whitlow pawns a sounding lead, tallow still in the cup. Don't scrape it.
// Middle (shop)              Dory's warm shell; Tess says the tide tables are wrong; Lambeth Sorrel
//                            wants the lead ($150, $250, $300).
// Scene 1 (W1 Thu-W2 Wed)    the harbormaster's shack: the 1968 survey, forty fathoms that were four hundred.
// Scene 2 (W2 Thu-W3 Wed)    Tess's launch over the Neck: one more sounding.
// Finale (W3 Thu-W4 Thu)     the lowest tide: a ring of stones and a stair, and Cyrus walking out to it.
// Looks: Cyrus's field book, hauling the line by hand, three steps down (two soundings).
// Crossings: Dory's Freezer (the thing won't hum while the lead's in the shop; released, it takes the
// lead down for you), Static on Channel 16 (a second voice on the radio, reading depths).
// The loan is $40; Cyrus redeems it for $52.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/sounding.js.
defineStory({
  "id": "sounding",
  "kind": "major",
  "colour": "#3a8a7a",
  "family": "uncanny",
  "group": "deep",
  "title": "The Sounding",
  "crosses": ["freezer", "radio"],
  "rumour": "An old man pawns a lump of lead and asks you never to clean it.",
  "endings": { "plumb": "Plumb Line", "sold": "Sold by the Fathom", "steps": "Three Steps Down", "slack": "Slack Water" },
  "about": [
    "The deep set's harbor story, slow cosmic dread with Looks along the way. Cyrus Whitlow, who surveyed the harbor in 1968, pawns his sounding lead and begs you never to scrape the tallow in its cup (§{cyrusLead}). At the harbormaster's shack he confesses to Tess and you (§{soundingShack}): he charted the Neck at forty fathoms, but the line ran out at four hundred and kept pulling. The harbor has been getting shallower every year since. Something is coming up.",
    "The signs pile up. Dory brings a scallop shell that's warm like a hand (§{doryShell}). Tess says the tide tables are drifting and every low tide is lower (§{tessTides}). Mr. Lambeth Sorrel, in a coat damp at the hems though it hasn't rained, offers $150, then $250, then $300 for the lead as it is (§{sorrelOffer}). Selling Cyrus's pawn ends it: Sorrel walks into the harbor and doesn't come up, and the problem moves up the coast (Sold by the Fathom).",
    "Go out in Tess's launch for one more sounding (§{soundingLaunch}) and let the line run out, and the lead comes up with the shop's own sign printed backwards in the tallow. At the lowest tide of the year (§{soundingLowTide}) the harbor empties and a ring of stones with a stair going down appears in the mud.",
    "Drop the lead down the stair, or throw it to the thing from Dory's freezer if it went back to the sea, and the sea comes back and settles (Plumb Line). With two Looks already, walk three steps down with Cyrus and let him go on alone (Three Steps Down). Or stay on the seawall and let Cyrus redeem his lead (Slack Water); giving it back early in the shack ends the same way. It crosses with The Thing in Dory's Freezer and Static on Channel 16."
  ],
  "cast": {
    "cyrus": {
      "name": "Cyrus Whitlow",
      "look": { "skin": "#e8c8b0", "hair": "#f0f0f0", "hs": 2, "coat": "#4a5a6a", "trim": "#c8c0a8", "style": "jacket", "long": true, "pants": "#3a3a42", "glasses": "#2a2a2e", "hat": "cap", "hatc": "#2a3a4a", "band": "#c8c0a8" }
    },
    "sorrel": {
      "name": "Mr. Lambeth Sorrel",
      "look": { "skin": "#c8ccc0", "hair": "#2a2e30", "hs": 0, "coat": "#2a3430", "trim": "#4a5a54", "style": "jacket", "long": true, "pants": "#1e2422", "hat": "wide", "hatc": "#1e2422" }
    }
  },
  "icons": {
    "fieldbook": [
      "............",
      "..kkkkkkkk..",
      ".kbbbbbbbbk.",
      ".kbBBBBBBbk.",
      ".kbbbbbbbbk.",
      ".kbpppppbbk.",
      ".kbpPPPpbbk.",
      ".kbpppppbbk.",
      ".kbbbbbbbbk.",
      ".kcccccccck.",
      ".kkkkkkkkkk.",
      "............"
    ],
    "scallop": [
      "............",
      "............",
      "...k.k.k....",
      "..kAkAkAk...",
      ".kAaAaAaAk..",
      ".kaAaAaAak..",
      ".kAaAaAaAk..",
      "..kAaAaAk...",
      "...kkakk....",
      "....kkk.....",
      "............",
      "............"
    ]
  },
  "uniques": {
    "soundingLead": {
      "name": "Sounding lead",
      "icon": "lead",
      "cat": "curio",
      "guide": 40,
      "condLabel": "Tallow still in the cup",
      "questKey": true,
      "tells": [
        "Seven pounds of lead on a frayed line. The cup in its base is packed with old tallow, to bring up a sample of the bottom.",
        "In the tallow, sharp and backwards, is the print of carved lettering. No stone in Hollow Neck is carved like that."
      ]
    },
    "fieldBook": {
      "name": "Cyrus Whitlow's field book, 1968",
      "icon": "fieldbook",
      "cat": "curio",
      "guide": 25,
      "condLabel": "Water-stained",
      "tells": [
        "Soundings in pencil, column after column, in a careful government hand.",
        "The last page is a sketch of steps, drawn from below."
      ]
    },
    "warmShell": {
      "name": "A warm scallop shell",
      "icon": "scallop",
      "cat": "curio",
      "guide": 5,
      "condLabel": "Warm",
      "tells": [
        "An ordinary scallop shell, the size of your palm.",
        "It's warm. It stays warm. Nobody else will buy it."
      ]
    }
  },
  "soundings": { "sound-fieldbook": "The harbor mouth was charted at forty fathoms in 1968. The line ran out at four hundred, and went on pulling.", "sound-haul": "Whatever is at the bottom of the Neck knows the shop. It wrote the sign back to you in the tallow.", "sound-steps": "At the lowest tide there is a stair in the harbor, and it was built for someone going up, not down.", "sound-steps2": "The water at the bottom of the stair is warm, and it breathes, and it is very patient." },
  "overheard": [
    { "line": "Quietly: \"Cyrus Whitlow was down at the harbor at four this morning with a lead line. At his age.\"" }
  ],
  "scenes": {
    "cyrusLead": {
      "title": "Cyrus Whitlow pawns the lead",
      "customer": "cyrus",
      "steps": [
        { "say": "cyrus", "text": "Cyrus Whitlow. I surveyed this harbor for the government in 1968. Every rock and every fathom. I've been retired longer than you've been alive." },
        { "view": { "counterIcon": "lead" } },
        { "narrate": "He sets a lead weight on the counter, heavy as a brick, on a frayed line. The cup in its base is packed with old grey tallow." },
        {
          "say": "cyrus",
          "text": [
            "A sounding lead. You arm the cup with tallow and the bottom sticks to it, so you know what you're anchoring on. Mud, sand, shell.",
            "I need $40 till the end of the month. And I need you not to scrape the tallow. Don't let anybody scrape the tallow."
          ]
        },
        {
          "choose": [
            {
              "label": "Lend him $40 on it",
              "hint": "(a pawn: he'll be back for it)",
              "then": [{ "view": { "counterIcon": null } }]
            },
            {
              "label": "\"I don't take lead, Mr. Whitlow.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "soundingRefused": true } },
                { "say": "cyrus", "text": "No. Probably wise." },
                { "leave": "cyrus" },
                { "end": true }
              ]
            }
          ]
        },
        { "add": { "unique": "soundingLead", "paid": 40 } },
        { "coin": -40, "why": "Lent $40 to Cyrus Whitlow against a sounding lead" },
        { "set": { "soundingPawned": true } },
        {
          "say": "cyrus",
          "text": [
            "Thank you. Look at the tallow under your glass, if you like. Just don't touch it.",
            "Tess Bascombe's got my old survey down at the harbourmaster's shack. We're going through it {placed:sounding-shack} night. You could come. Somebody besides Tess ought to hear it."
          ]
        },
        { "toast": "Calendar: the harbormaster's shack, {placed:sounding-shack} night", "look": "cyrus" },
        { "leave": "cyrus" }
      ]
    },
    "doryShell": {
      "title": "Dory brings a warm shell",
      "customer": "dory",
      "steps": [
        { "say": "dory", "text": "The dredge brought this up off the harbor mouth. It's just a scallop. Except feel it." },
        { "narrate": "It's warm. Not sun-warm. Warm like something that was just in someone's hand." },
        { "say": "dory", "text": "The boys won't touch it. Five bucks and it's yours, and I can stop thinking about it." },
        {
          "offer": { "unique": "warmShell" },
          "persona": "honest",
          "asking": 5,
          "min": 3,
          "onWatch": "continue"
        },
        { "say": "dory", "text": "And tell your fish to stop staring out the window. It's giving the customers the creeps.", "if": "quest.freezer && flag.freezerEnd == 'mascot'" },
        { "leave": "dory" }
      ]
    },
    "tessTides": {
      "title": "Tess: the tide tables are wrong",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "You haven't got a tide clock, have you? The proper kind, with the one hand.",
            "The printed tables are off. A minute a day, more now, and every low tide is lower than the one before. Twenty years I've been harbormaster. The tables are never wrong.",
            "The boats are grounding at their own moorings. And Cyrus Whitlow is out on the end of the pier every morning at four with a lead line."
          ]
        },
        { "say": "tess", "text": "You were there. You heard him. Four hundred fathoms. I keep telling myself he's eighty-two.", "if": "flag.soundingShack" },
        { "leave": "tess" }
      ]
    },
    "sorrelOffer": {
      "title": "Mr. Sorrel wants the lead",
      "customer": "sorrel",
      "note": "he comes up to three times: $150, $250, $300",
      "steps": [
        { "hook": "countVisit", "with": "sorrelVisits" },
        {
          "if": "flag.sorrelVisits == 1",
          "then": [
            { "say": "sorrel", "text": "Lambeth Sorrel. Good morning. I'm told you have a sounding lead. An old one, with the arming still in it." },
            { "narrate": "His coat is good wool, and damp at the hem and the cuffs, though it hasn't rained." }
          ],
          "else": [{ "say": "sorrel", "text": "Good morning again. I was passing. I'm always passing." }]
        },
        { "find": "lead", "in": "stock", "match": { "uniqueId": "soundingLead" } },
        {
          "if": "!lead",
          "then": [
            { "say": "sorrel", "text": "Ah. It's gone. Then so shall I." },
            { "leave": "sorrel" },
            { "end": true }
          ]
        },
        {
          "if": "flag.sorrelVisits == 1",
          "then": [{ "say": "sorrel", "text": "$150. For the lead as it is. Don't clean it, of course." }],
          "else": [
            {
              "if": "flag.sorrelVisits == 2",
              "then": [{ "say": "sorrel", "text": "$250. For the lead as it is. Don't clean it, of course." }],
              "else": [
                { "say": "sorrel", "text": "$300. For the lead as it is. Don't clean it, of course. That is the last I'll offer, and I'm not a man who offers things twice." }
              ]
            }
          ]
        },
        { "say": "sorrel", "text": "Tell me, how deep is the harbor these days?" },
        {
          "choose": [
            {
              "label": {
                "if": "flag.sorrelVisits == 1",
                "then": "Sell him the lead for $150",
                "else": { "if": "flag.sorrelVisits == 2", "then": "Sell him the lead for $250", "else": "Sell him the lead for $300" }
              },
              "hint": "(it's Cyrus's pawn: rep -4)",
              "then": [
                { "take": "lead" },
                {
                  "if": "flag.sorrelVisits == 1",
                  "then": [{ "coin": 150, "why": "Sold the sounding lead to Lambeth Sorrel" }],
                  "else": [
                    {
                      "if": "flag.sorrelVisits == 2",
                      "then": [{ "coin": 250, "why": "Sold the sounding lead to Lambeth Sorrel" }],
                      "else": [{ "coin": 300, "why": "Sold the sounding lead to Lambeth Sorrel" }]
                    }
                  ]
                },
                { "rep": -4 },
                { "set": { "soundingEnd": "sold", "soundingDone": true } },
                { "say": "sorrel", "text": "Thank you. You've done a kindness, and you'll never know to whom." },
                { "narrate": "That evening, from the shop door, you see him walk down the slipway at the end of Water Street and into the harbor, in his good coat, without hurrying. He doesn't come up." }
              ]
            },
            {
              "label": "\"It isn't mine to sell.\"",
              "then": [{ "say": "sorrel", "text": "No. Of course. I'll ask again." }]
            }
          ]
        },
        { "leave": "sorrel" }
      ]
    },
    "soundingShack": {
      "title": "The 1968 survey",
      "music": "deep",
      "steps": [
        {
          "stage": "harbormasterNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [104, 164] },
            { "id": "cyrus", "cast": "cyrus", "at": [140, 162] },
            { "id": "tess", "cast": "tess", "at": [214, 160], "facingLeft": true }
          ]
        },
        { "set": { "soundingShack": true } },
        { "narrate": "The harbormaster's shack, after dark. Tess has the 1968 survey spread over the chart table, held down with coffee mugs." },
        { "say": "tess", "text": "Forty fathoms at the Neck. Says it right there, in his handwriting. Every chart since has copied it." },
        {
          "say": "cyrus",
          "text": [
            "I wrote forty. The line ran out at four hundred. Four hundred fathoms, in a harbor you can row across, and it kept pulling.",
            "I wrote forty because I was twenty-five and wanted to keep my job. I've gone back every year since. It gets shallower. Something is coming up."
          ]
        },
        { "narrate": "He sets the lead's print beside a rubbing he's brought in a folder. The rubbing is from the nameless stone in the Old Burying Ground, the one that's older than the town. The marks are the same." },
        {
          "choose": [
            {
              "label": "Read his field book to the end",
              "hint": "(Look)",
              "then": [
                { "narrate": "Columns of pencil numbers, careful and dull. Then the numbers stop. On the last page he's drawn a flight of steps, very exactly, and the drawing is from below, looking up." },
                { "sounding": "sound-fieldbook" },
                {
                  "if": "shelf.free",
                  "then": [
                    { "say": "cyrus", "text": "Keep it. I know what's in it." },
                    { "add": { "unique": "fieldBook" } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            { "label": "Leave the field book closed" }
          ]
        },
        { "say": "tess", "text": "I've got the launch. If he's going out there again, I'd rather he went with people." },
        { "say": "cyrus", "text": "One more sounding. Over the Neck, at slack water. Then I'll know." },
        {
          "choose": [
            {
              "label": "\"I'll come out with you.\"",
              "then": [
                { "set": { "soundingLaunch": true } },
                { "say": "tess", "text": "{placed:sounding-launch} night, then. Dress warm. It's colder out there than it looks." },
                { "toast": "Calendar: the launch, over the Neck, {placed:sounding-launch} night", "look": "tess" }
              ]
            },
            {
              "label": "Give Cyrus his lead back, and stay ashore",
              "hint": "(he repays $52)",
              "then": [
                { "find": "lead", "in": "stock", "match": { "uniqueId": "soundingLead" } },
                {
                  "if": "lead",
                  "then": [
                    { "take": "lead" },
                    { "coin": 52, "why": "Cyrus Whitlow redeemed his sounding lead" }
                  ]
                },
                { "set": { "soundingEnd": "slack", "soundingDone": true } },
                { "say": "cyrus", "text": "All right. All right. It was a lot to ask." }
              ]
            }
          ]
        }
      ]
    },
    "soundingLaunch": {
      "title": "One more sounding",
      "music": "deep",
      "steps": [
        {
          "stage": "launch",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [130, 168] },
            { "id": "cyrus", "cast": "cyrus", "at": [176, 168] },
            { "id": "tess", "cast": "tess", "at": [236, 168], "facingLeft": true }
          ]
        },
        { "narrate": "Tess's launch, engine off, over the harbor mouth. Black water. Every few seconds the lighthouse turns its beam across you, and then you're in the dark again." },
        { "say": "cyrus", "text": "Fresh tallow. Here we go. Tell me when you want me to stop letting out line." },
        { "find": "lead", "in": "stock", "match": { "uniqueId": "soundingLead" } },
        { "narrate": "He arms the cup of his lead with fresh tallow, and lowers it over the side.", "if": "lead" },
        { "narrate": "Ten fathoms. Twenty. Forty, where the chart says the bottom is. The line keeps going." },
        {
          "choose": [
            {
              "label": "\"That's enough. Bring it up.\"",
              "then": [
                { "narrate": "He hauls it up. Mud in the tallow, and a little sand. An ordinary bottom." },
                { "say": "cyrus", "text": "Forty-one fathoms. Forty-one. It's right under us now." }
              ]
            },
            {
              "label": "Let it all run out",
              "then": [
                { "narrate": "A hundred fathoms. Two hundred. The reel spins and spins. At four hundred the line runs out and snaps taut, and the launch leans, and then the line goes slack." },
                { "set": { "soundingDeep": true } },
                {
                  "choose": [
                    {
                      "label": "Haul it up by hand, and keep looking down at the water",
                      "hint": "(Look)",
                      "then": [
                        { "narrate": "It's heavy, then light, then heavy again, as if something is letting go and taking hold. Far down, very far down, there's a green light that isn't the lighthouse. It's getting closer as you pull, and then it stops, and goes back down." },
                        { "sounding": "sound-haul" }
                      ]
                    },
                    {
                      "label": "Let Tess wind it in on the reel. Look at the lighthouse.",
                      "then": [
                        { "narrate": "You count the lighthouse's turns. Eleven. The reel clicks and clicks." }
                      ]
                    }
                  ]
                },
                { "narrate": "The lead comes up warm. In the fresh tallow, sharp and backwards, is the shop's sign. THE CROOKED SCALE, in letters you'd know anywhere." },
                { "say": "tess", "text": "That's it. We're going in." }
              ]
            }
          ]
        },
        { "say": "cyrus", "text": "There's a spring low coming. The lowest of the year. When it comes, it'll come all the way. I'd like you there." },
        { "set": { "soundingSounded": true } },
        { "toast": "Calendar: the lowest tide, at dawn", "look": "cyrus" }
      ]
    },
    "soundingLowTide": {
      "title": "The lowest tide",
      "music": "deep",
      "steps": [
        {
          "stage": "lowtide",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [60, 164] },
            { "id": "tess", "cast": "tess", "at": [36, 164] },
            { "id": "cyrus", "cast": "cyrus", "at": [96, 166] }
          ]
        },
        {
          "narrate": [
            "Dawn. The tide went out in the night and kept going. The harbor is gone: a mile of mud and eelgrass and a sunk hull on its side, and the sea a thin bright line beyond the breakwater, where it has never been.",
            "The whole town is on the seawall in coats and dressing gowns. Nobody is talking.",
            "Out where the Neck was, in the mud, there's a ring of dark stones. In the middle of the ring is a square hole, and steps going down into it, and at the bottom the water rises and falls like breath."
          ]
        },
        { "say": "cyrus", "text": "There. Forty fathoms. I always wanted to see it." },
        { "walk": "cyrus", "to": [128, 170] },
        { "say": "tess", "text": "Cyrus. Cyrus, come back up here." },
        { "find": "lead", "in": "stock", "match": { "uniqueId": "soundingLead" } },
        { "narrate": "In the breathing water at the foot of the stair, something pale with small hands is looking up at you. It came back. It won't go down any further.", "if": "quest.freezer && flag.freezerEnd == 'sea'", "note": "Dory's Freezer: the thing went back to the sea" },
        {
          "choose": [
            {
              "label": { "if": "quest.freezer && flag.freezerEnd == 'sea'", "then": "Throw it the lead", "else": "Run out after him and drop the lead down the stair" },
              "hint": "(Plumb Line)",
              "if": "lead",
              "then": [
                { "take": "lead" },
                {
                  "narrate": { "if": "quest.freezer && flag.freezerEnd == 'sea'", "then": "You throw it as far as you can. The little thing catches the lead in both hands, looks at you for a moment, and goes down the stair with it, into the dark, carrying it like an egg.", "else": "You catch Cyrus at the edge of the ring and take the lead from your pocket. It's warm. You drop it down the stair. It doesn't make a sound when it lands." }
                },
                { "narrate": "Then the sea comes back. All at once, the whole mile of it, and you're running, and Tess is hauling you both up the slipway by your collars." },
                { "say": "cyrus", "text": "That's all right, then. That's all right. I think I'll sleep." },
                { "rep": 6, "why": "The lowest tide" },
                { "set": { "soundingEnd": "plumb" } }
              ]
            },
            {
              "label": "Go with him. Three steps down, and look",
              "hint": "(Look)",
              "if": "flag.deepLooks >= 2",
              "then": [
                { "walk": "you", "to": [140, 170] },
                {
                  "narrate": [
                    "You walk out across the mud with him. Inside the ring it's quiet; the gulls have stopped. The steps are cut for feet a little bigger than yours.",
                    "One step. Two. Three. The water at the bottom is warm, and you can see down into it a long way, and something down there is a long way further."
                  ]
                },
                { "sounding": "sound-steps" },
                { "sounding": "sound-steps2" },
                { "say": "cyrus", "text": "You go back up now. Somebody has to keep the shop. I've been coming here for fifty-eight years." },
                { "narrate": "You go back up. He doesn't. At the bottom of the stair he turns round, and waves, and steps into the water. Then the sea comes back, quietly, and the stones are gone." },
                { "remove": "cyrus" },
                {
                  "if": "lead",
                  "then": [
                    {
                      "edit": "lead",
                      "set": { "questKey": false, "nosale": false, "condLabel": "Never redeemed" }
                    },
                    { "refresh": "panel" }
                  ]
                },
                { "set": { "soundingEnd": "steps" } }
              ]
            },
            {
              "label": "Stay on the seawall with Tess",
              "then": [
                { "narrate": "You stay. Tess stays. Cyrus walks out to the edge of the ring, and stands there a long time, and then he comes back up the slipway on his own, covered in mud to the knee." },
                { "say": "cyrus", "text": "Not today. It said not today." },
                { "narrate": "By noon the tide has come back in, as if nothing happened. The tables are right again by evening." },
                {
                  "if": "lead",
                  "then": [
                    { "take": "lead" },
                    { "coin": 52, "why": "Cyrus Whitlow redeemed his sounding lead" }
                  ]
                },
                { "set": { "soundingEnd": "slack" } }
              ]
            }
          ]
        },
        { "set": { "soundingDone": true } }
      ]
    }
  },
  "beats": [
    { "drift": "sounding-hook", "from": "1-2", "to": "1-3", "cast": "cyrus", "scene": "cyrusLead" },
    { "drift": "sounding-shell", "from": "1-4", "to": "2-1", "cast": "dory", "scene": "doryShell", "if": "flag.soundingPawned && !flag.soundingDone" },
    { "drift": "sounding-tess", "from": "2-3", "to": "2-5", "cast": "tess", "scene": "tessTides", "if": "flag.soundingPawned && !flag.soundingDone" },
    { "drift": "sounding-sorrel1", "from": "2-1", "to": "2-3", "cast": "sorrel", "scene": "sorrelOffer", "if": "hook.leadHere && !flag.soundingDone" },
    { "drift": "sounding-sorrel2", "from": "3-1", "to": "3-3", "cast": "sorrel", "scene": "sorrelOffer", "if": "hook.leadHere && !flag.soundingDone && flag.sorrelVisits == 1" },
    { "drift": "sounding-sorrel3", "from": "4-1", "to": "4-2", "cast": "sorrel", "scene": "sorrelOffer", "if": "hook.leadHere && !flag.soundingDone && flag.sorrelVisits == 2" }
  ],
  "nights": [
    {
      "id": "sounding-shack",
      "window": ["1-4", "2-3"],
      "if": "flag.soundingPawned && !flag.soundingDone",
      "scene": "soundingShack",
      "test": [{ "set": { "soundingPawned": true } }, { "add": { "unique": "soundingLead" } }]
    },
    {
      "id": "sounding-launch",
      "window": ["2-4", "3-3"],
      "if": "flag.soundingLaunch && !flag.soundingDone",
      "scene": "soundingLaunch",
      "test": [{ "set": { "soundingLaunch": true } }, { "add": { "unique": "soundingLead" } }]
    },
    {
      "id": "sounding-lowtide",
      "window": ["3-4", "4-4"],
      "if": "flag.soundingSounded && !flag.soundingDone",
      "scene": "soundingLowTide",
      "test": [
        { "set": { "soundingSounded": true, "deepLooks": 2 } },
        { "add": { "unique": "soundingLead" } }
      ]
    }
  ],
  "calendar": [
    { "id": "sounding-shack", "night": "sounding-shack", "story": "sounding", "where": "The harbormaster's shack", "title": "The 1968 survey", "known": "flag.soundingPawned", "scene": "soundingShack" },
    { "id": "sounding-launch", "night": "sounding-launch", "story": "sounding", "where": "Over the Neck", "title": "One more sounding", "known": "flag.soundingLaunch", "scene": "soundingLaunch" },
    { "id": "sounding-lowtide", "night": "sounding-lowtide", "story": "sounding", "where": "The harbor, at dawn", "title": "The lowest tide", "known": "flag.soundingSounded", "scene": "soundingLowTide" }
  ],
  "mornings": [
    { "find": "lead", "in": "stock", "match": { "uniqueId": "soundingLead" } },
    {
      "if": "lead && !flag.soundingDone",
      "note": "crossings in the shop",
      "then": [
        {
          "if": "quest.freezer && flag.freezerEnd == 'mascot' && !flag.soundingFishQuiet",
          "then": [
            { "set": { "soundingFishQuiet": true } },
            { "toast": "The thing in the tank has stopped humming. It lies at the glass facing the harbor, and won't eat." }
          ]
        },
        {
          "if": "quest.radio && flag.radioHeard && !flag.radioDone && !flag.soundingRadio",
          "then": [
            { "set": { "soundingRadio": true } },
            { "toast": "At closing the radio said \"Margaret Ruth\" as always. Then a second voice, slower, read out a depth: \"Thirty-eight fathoms.\" Getting shallower.", "icon": "radio" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "The tide tables have been right ever since. Cyrus Whitlow sleeps through the night, and has taken up crosswords.", "if": "flag.soundingEnd == 'plumb'" },
    { "line": "The tide tables in Hollow Neck are right again. In a harbor two states up the coast, they have started to be wrong.", "if": "flag.soundingEnd == 'sold'" },
    { "line": "Cyrus Whitlow's lead sits on your shelf, never redeemed. Some mornings the tallow is damp. On the lowest tides, you go and stand on the seawall, just in case he waves.", "if": "flag.soundingEnd == 'steps'" },
    { "line": "Cyrus Whitlow still goes down to the end of the pier at four in the morning with his lead line. He says the numbers are holding steady. For now.", "if": "flag.soundingEnd == 'slack'" }
  ],
  "outcome": "flag.soundingEnd"
});
