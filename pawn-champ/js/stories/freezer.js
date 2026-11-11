// Pawn Champ - The Thing in Dory's Freezer. Major quest M8, batch C (docs/quests/MAJOR.md#m8).
// Something came up in a scallop dredge and the whole town wants a piece of it. You broker it,
// let it go, or give it a tank by the till.
//
// This file also holds the Harvest Fair hub (batch C owns it, docs/quests/BATCHES.md): an evening
// on Harbor Green that M8, M11 and M12 each add a vignette to. It's the town's, not this story's,
// so the fair happens in a run when any of its vignettes' stories does.
// months: [1, 2]: it owns the Harvest Fair, which can't run after early November (docs/SEASONS.md).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "freezer",
  "kind": "major",
  "colour": "#5ab8b0",
  "family": "uncanny",
  "title": "The Thing in Dory's Freezer",
  "months": [1, 2],
  "crosses": ["breakwaters", "radio", "selectmen"],
  "rumour": "Something in a chest freezer behind the fish market. It isn't frozen.",
  "endings": { "sold": "Sold", "sea": "Back to the Sea", "mascot": "Shop Mascot" },
  "outcome": "flag.freezerEnd",
  "about": [
    "A warm, funny creature story that starts a long arc. Dory Kittredge's nephew Cal dredged something up, and it's in her chest freezer, not frozen and humming (§{doryAsks}). She asks if you know anyone who buys unusual specimens; Cal starts college next fall. Say no and the story ends there.",
    "In her cold room (§{freezerCold}) it's a pale finned thing the size of a cat, with two small hands. It hums along to tunes, and it holds your finger if you let it. Three buyers circle: Dr. Pomfret, a cryptozoologist with $400 in his hat (§{pomfretVisit}); Kit Sandoval of the cable show Strange Shores, $600 (§{sandovalVisit}); and the marine lab, $150 and a plaque. You can promise to broker a sale, tell Dory to put it back in the sea, or just let it hold your finger.",
    "Cal has entered it in the biggest-catch contest at the Harvest Fair, the town's evening on Harbor Green (§{fairOpen}, §{fairClose}). In Sandoval's tent it escapes into the dunk tank (§{sandovalTent}): help catch it on camera, hide it under your coat, or sell tickets.",
    "At the breakwater Dory decides, and asks you (§{freezerEnd}). Broker the sale for your 10% (Sold); let it go back to the sea (Back to the Sea), after which the sea leaves gifts on your step; or pay Dory $80 and keep it in a tank by your till (Shop Mascot). If The Breakwaters is in the run, the tune it hums is theirs. Each ending leads to a later chapter: A Second One (sold), Too Big for the Tank (mascot), and The Thaw in March for all three."
  ],
  "cast": {
    "cal": {
      "name": "Cal",
      "look": { "skin": "#d8a888", "hair": "#2a1e16", "hs": 4, "coat": "#2a6a5a", "style": "hoodie", "pants": "#3a3a48" }
    },
    "pomfret": {
      "name": "Dr. Lyle Pomfret",
      "look": { "skin": "#f0d0b8", "hair": "#c8c8c0", "hs": 2, "coat": "#8a7a4a", "style": "vest", "vest": "#a89a6a", "hat": "wide", "hatc": "#8a7a4a", "glasses": "#2a2a2e", "beard": "#c8c8c0", "bag": "#5a4a2a", "pants": "#6a5a3a" }
    },
    "sandoval": {
      "name": "Kit Sandoval",
      "look": { "skin": "#c89070", "hair": "#1a1210", "hs": 5, "coat": "#1e1e26", "style": "jacket", "trim": "#e8c040", "glasses": "#1a1a1e", "pants": "#2a2a30" }
    },
    "achebe": {
      "name": "Dr. Ines Achebe",
      "look": { "skin": "#6a4430", "hair": "#1a1210", "hs": 3, "coat": "#e8e4dc", "style": "jacket", "long": true, "glasses": "#2a2a2e", "pants": "#3a4a5a" }
    }
  },
  "icons": {
    "pearl": [
      "............",
      "............",
      "..kkkkkkkk..",
      ".kwWWWWWWwk.",
      "kwWkkkkkkWwk",
      "kWk.kkkk.kWk",
      "kWkkcSSckkWk",
      "kwkkSccSkkwk",
      ".kwkkkkkkwk.",
      "..kwwwwwwk..",
      "...kkkkkk...",
      "............"
    ],
    "tooth": [
      "............",
      "...kk.......",
      "..kcck......",
      "..kccck.....",
      "...kccck....",
      "...kcpcck...",
      "....kcppck..",
      "....kcpppck.",
      ".....kcpppk.",
      "......kkppk.",
      "........kk..",
      "............"
    ],
    "tank": [
      "kkkkkkkkkkkk",
      "kSSSSSSSSSSk",
      "kBBBBBBBBBBk",
      "kBBBBJJBBBBk",
      "kBBJJJJJkBBk",
      "kBBJJJJJJJBk",
      "kBBBJJJJBBBk",
      "kBBBBBBBBBBk",
      "kBgBBBBBBgBk",
      "kggBBBBBggBk",
      "kkkkkkkkkkkk",
      ".kk......kk."
    ]
  },
  "uniques": {
    "seaThing": {
      "name": "The thing in the freezer",
      "icon": "tank",
      "cat": "curio",
      "guide": 600,
      "questKey": true,
      "condLabel": "Alive",
      "tells": [
        "It is warm to the touch, which a thing from a freezer should not be.",
        "It holds your finger with a small, cold hand while you look."
      ]
    },
    "seaPearl": {
      "name": "A sea pearl",
      "icon": "pearl",
      "cat": "jewelry",
      "guide": 150,
      "tells": ["Left on your step at dawn, still wet.", "Perfectly round. The sea doesn't usually bother."]
    },
    "seaRing": {
      "name": "A green-gold ring",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 120,
      "tells": [
        "No hallmark. Older than hallmarks.",
        "The gold has a green cast, like sunlight through water."
      ]
    },
    "seaTooth": {
      "name": "Something's tooth",
      "icon": "tooth",
      "cat": "curio",
      "guide": 60,
      "wantedBy": { "name": "Dr. Lyle Pomfret", "mult": 3.3 },
      "tells": [
        "Long, curved, and not from any fish in the guide.",
        "There is a tiny hole drilled through the root, as if it was once worn."
      ]
    }
  },
  "scenes": {
    "fairOpen": {
      "title": "The Harvest Fair on Harbor Green",
      "steps": [
        { "hook": "thing", "with": null },
        {
          "stage": "green",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "fairgoer", "look": "random", "at": [[36, 150], [70, 158], [230, 150]] },
            { "id": "neighbor", "look": "random", "at": [[262, 158], [290, 150]], "facingLeft": true }
          ]
        },
        { "narrate": "The Harvest Fair on Harbor Green. Pumpkins, a pie table, the high school band doing its best on the bandstand, and a dunk tank nobody has volunteered for yet. Strings of bulbs come on one after another." }
      ]
    },
    "fairClose": {
      "title": "The fair winds down",
      "steps": [
        { "hook": "thing", "with": null },
        {
          "if": "flag.freezerIn && !flag.freezerFair && quest.freezer",
          "note": "the stories that pass through the fair still need their next step, even if you were elsewhere",
          "then": [
            { "set": { "freezerFair": true } },
            { "toast": "Dory, passing with a cooler: \"The breakwater, one night next week. I'm deciding.\"", "look": "dory" }
          ]
        },
        { "narrate": "Near ten the bulbs go off a string at a time. Someone has left a pie on the war memorial. You take it home, on the grounds that it would be a shame." }
      ]
    },
    "doryAsks": {
      "title": "Dory asks about unusual specimens",
      "customer": "dory",
      "steps": [
        {
          "say": "dory",
          "text": [
            "Dory Kittredge. Kittredge Fish, end of Pier Nine. Your aunt used to buy my scallop shells for her window. Two for a dollar.",
            "Hypothetically. Do you know anyone who buys... unusual specimens?",
            "Something came up in my nephew's dredge on Saturday. It's in my chest freezer. It isn't frozen. It hums.",
            "Cal starts college next fall. If it's worth something, I want a fair price for it. If it isn't, I want it out of my freezer."
          ]
        },
        {
          "choose": [
            { "label": "\"I might know some people. Can I see it?\"" },
            {
              "label": "\"What sort of specimen hums?\"",
              "then": [
                { "say": "dory", "text": "This sort. That's all I can tell you. You'd have to see it." },
                {
                  "choose": [
                    { "label": "\"Then I'd better see it.\"" },
                    {
                      "label": "\"I don't know anyone, Dory. Sorry.\"",
                      "then": [
                        { "set": { "freezerOut": true } },
                        { "say": "dory", "text": "No. Course not. Forget I asked." },
                        { "leave": "dory" },
                        { "end": true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "\"I don't know anyone who buys that sort of thing.\"",
              "then": [
                { "set": { "freezerOut": true } },
                { "say": "dory", "text": "No. Course not. Forget I asked." },
                { "leave": "dory" },
                { "end": true }
              ]
            }
          ]
        },
        { "set": { "freezerIn": true } },
        {
          "say": "dory",
          "text": [
            "Come by the shed after you close. Round the back, by the cold room. The front door sticks.",
            "And don't tell anybody. Half the bait shop already knows, so it's a bit late, but don't."
          ]
        },
        { "toast": "Calendar: Dory's cold room, Pier Nine, after closing", "look": "dory" },
        { "leave": "dory" }
      ]
    },
    "pomfretVisit": {
      "title": "Dr. Pomfret follows a whisper",
      "note": "The town wants a piece: Pomfret and Sandoval start turning up, each after something that makes no sense.",
      "customer": "pomfret",
      "steps": [
        {
          "say": "pomfret",
          "text": [
            "Dr. Lyle Pomfret. Cryptozoology. Independent. There's a whisper at the bait shop and I follow whispers.",
            "I need a fish tank. A big one. Failing that, a cooler. Failing that, anything old enough to have seen something."
          ]
        },
        {
          "hook": "priciestCurio",
          "sets": ["it", "price"],
          "note": "the dearest curio on your shelves that isn't one of a kind, at 1.3 times its guide"
        },
        {
          "if": "it",
          "then": [
            { "say": "pomfret", "text": "That {it.name|lower}. It has the air of a thing that's seen something. {price|money}?" },
            {
              "choose": [
                {
                  "label": "Sell it to him ({price|money})",
                  "then": [{ "hook": "sellWanted", "with": "Sold {it.name} to Dr. Pomfret" }]
                },
                { "label": "Not for sale" }
              ]
            }
          ],
          "else": [{ "say": "pomfret", "text": "No? A pity." }]
        },
        { "say": "pomfret", "text": "If a certain specimen should pass through your hands, I pay four hundred. Cash. I keep it in an envelope in my hat." },
        { "set": { "pomfretMet": true } },
        { "leave": "pomfret" }
      ]
    },
    "sandovalVisit": {
      "title": "Kit Sandoval wants a harpoon",
      "customer": "sandoval",
      "steps": [
        { "say": "sandoval", "text": "Kit Sandoval, Strange Shores. It's on cable. Season six. Do you have a harpoon?" },
        {
          "hook": "firstKnife",
          "sets": ["it", "price"],
          "note": "a hunting knife on your shelves, at 1.4 times its guide"
        },
        {
          "if": "it",
          "then": [
            { "say": "sandoval", "text": "A hunting knife. Not a harpoon, but it reads as dangerous on camera. {price|money}." },
            {
              "choose": [
                {
                  "label": "Sell it ({price|money})",
                  "then": [{ "hook": "sellWanted", "with": "Sold a knife to Kit Sandoval" }]
                },
                { "label": "Not for sale" }
              ]
            }
          ],
          "else": [{ "say": "sandoval", "text": "No harpoon. Fine. We'll use a mop and shoot it in shadow." }]
        },
        { "say": "sandoval", "text": "We're filming a reveal at the Harvest Fair. Six hundred to whoever gets a certain freezer into my tent. Tell your friends." },
        { "set": { "sandovalMet": true } },
        { "leave": "sandoval" }
      ]
    },
    "freezerCold": {
      "title": "The cold room at Kittredge Fish",
      "steps": [
        { "hook": "thing", "with": { "where": "coldroom", "x": 346, "y": 203, "hum": true, "wet": false } },
        {
          "stage": "coldroom",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 168] },
            { "id": "dory", "cast": "dory", "at": [140, 166] },
            { "id": "cal", "cast": "cal", "at": [236, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Kittredge Fish, after closing. One fluorescent tube, three chest freezers, and a smell you stop noticing after a minute. The middle freezer is open." },
        { "say": "dory", "text": "Go on. Look." },
        { "narrate": "Sitting in the scallops, not frozen, is a pale finned thing the size of a cat. It has two small hands. It's humming. When you lean over, it stops humming and looks at you." },
        { "say": "cal", "text": "It likes you. It bit Aunt Dory." },
        { "say": "dory", "text": "It nibbled. And it likes scallops, and it hates haddock, and it hums when the radio's on and louder when it's off." },
        { "narrate": "The tune it hums goes up, and then somewhere you don't expect. You almost know it.", "if": "hook.song", "note": "Dee's song: only if The Breakwaters Reunion is in this run" },
        { "say": "dory", "text": "There's a Dr. Pomfret who'd pay four hundred. A TV woman who'd pay six. And the marine lab, who'd give me a hundred and fifty and a plaque. What do I do?" },
        {
          "choose": [
            {
              "label": "\"Let me broker it. I'll find you the best buyer.\"",
              "then": [
                { "set": { "freezerPlan": "sell" } },
                {
                  "choose": [
                    {
                      "label": "Dr. Pomfret, $400",
                      "then": [
                        { "set": { "freezerBuyer": "pomfret" } },
                        { "say": "dory", "text": "Right. Good. That's Cal's first year, nearly." }
                      ]
                    },
                    {
                      "label": "Kit Sandoval, $600",
                      "then": [
                        { "set": { "freezerBuyer": "sandoval" } },
                        { "say": "dory", "text": "Right. Good. That's Cal's first year, nearly." }
                      ]
                    },
                    {
                      "label": "The marine lab, $150 and a plaque",
                      "then": [
                        { "set": { "freezerBuyer": "lab" } },
                        { "say": "dory", "text": "The lab. Huh. Cal would like a plaque." }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "label": "\"Put it back in the sea, Dory.\"",
              "then": [
                { "set": { "freezerPlan": "sea" } },
                {
                  "say": "dory",
                  "text": [
                    "Easy to say when it's not your freezer and not your nephew.",
                    "Let me think about it."
                  ]
                }
              ]
            },
            {
              "label": "(Say nothing, and let it hold your finger)",
              "then": [
                { "set": { "freezerPlan": "quiet", "freezerBond": true } },
                { "narrate": "You say nothing. A small cold hand closes around your finger and holds on. It starts humming again." },
                { "say": "dory", "text": "Well. That settles nothing." }
              ]
            }
          ]
        },
        { "say": "cal", "text": "Also I entered it in the biggest-catch contest at the Harvest Fair. Before anyone says anything, the entry fee was two dollars." },
        { "say": "dory", "text": "CAL." },
        { "toast": "Calendar: the Harvest Fair on Harbor Green", "look": "cal" },
        { "hook": "thing", "with": null }
      ]
    },
    "sandovalTent": {
      "title": "The Harvest Fair: Kit Sandoval films the reveal",
      "steps": [
        { "set": { "freezerFair": true } },
        { "enter": { "id": "dory", "cast": "dory", "at": [196, 156], "facingLeft": true } },
        { "enter": { "id": "sandoval", "cast": "sandoval", "at": [226, 152], "facingLeft": true } },
        { "say": "sandoval", "text": "Lights. Camera. And on the count of three, the cooler. Three!" },
        { "narrate": "The cooler opens. The thing looks at the camera, at the crowd, and at the dunk tank. Then it is in the dunk tank." },
        { "hook": "thing", "with": { "where": "green", "x": 520, "y": 238, "hum": true, "wet": true } },
        {
          "narrate": { "if": "quest.breakwaters", "then": "Dr. Benny Okafor, DDS, sitting on the dunk tank seat for the band fund, lifts his feet very slowly.", "else": "The man on the dunk tank seat lifts his feet very slowly." }
        },
        { "say": "dory", "text": "Somebody DO something." },
        {
          "choose": [
            {
              "label": "Help catch it for the camera",
              "hint": "(Sandoval pays $40)",
              "then": [
                { "set": { "freezerCaught": true } },
                { "coin": 40, "why": "Kit Sandoval paid you to wrangle a sea creature" },
                { "narrate": "It takes four people, a fishing net and a whole bag of scallops. Sandoval gets every second of it." },
                { "say": "sandoval", "text": "That is season seven. That is a SPIN-OFF." }
              ]
            },
            {
              "label": "Help hide it: your coat over the tank",
              "then": [
                { "set": { "freezerHid": true } },
                { "rep": 2 },
                { "narrate": "You drop your coat over the cage. By the time the lights swing round, the footage is mostly of a wet dentist and your coat." },
                { "say": "dory", "text": "I owe you. Don't tell me how much." }
              ]
            },
            {
              "label": "Sell tickets to the dunk tank",
              "hint": "(+$35)",
              "then": [
                { "set": { "freezerTickets": true } },
                { "coin": 35, "why": "Sold tickets to the dunk tank" },
                { "heat": 2 },
                { "narrate": "A dollar a look. The line goes round the bandstand twice. Dory doesn't say anything, very loudly." }
              ]
            }
          ]
        },
        { "narrate": "By dark it's back in the cooler, humming. Dory sits down next to it." },
        { "say": "dory", "text": "I'm deciding. Come down to the breakwater one night next week. Bring whoever you're bringing." },
        { "toast": "Calendar: the breakwater, with Dory", "look": "dory" },
        { "hook": "thing", "with": null },
        { "remove": "dory" },
        { "remove": "sandoval" }
      ]
    },
    "freezerEnd": {
      "title": "The breakwater: Dory decides",
      "music": "tension",
      "steps": [
        { "hook": "thing", "with": { "where": "greenNight", "x": 470, "y": 238, "hum": true, "wet": true } },
        {
          "stage": "greenNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 166] },
            { "id": "dory", "cast": "dory", "at": [186, 164], "facingLeft": true },
            { "id": "cal", "cast": "cal", "at": [210, 168], "facingLeft": true },
            { "id": "buyer", "cast": "pomfret", "at": [100, 162], "if": "flag.freezerBuyer == 'pomfret'" },
            { "id": "buyer", "cast": "sandoval", "at": [100, 162], "if": "flag.freezerBuyer == 'sandoval'" },
            { "id": "buyer", "cast": "achebe", "at": [100, 162], "if": "flag.freezerBuyer == 'lab'" }
          ]
        },
        { "narrate": "The foot of the breakwater, past the end of the Green. The cooler is on the first granite block, lid open. The thing sits on the edge of it with its hands folded, looking at the harbor." },
        {
          "if": "hook.song",
          "then": [
            { "narrate": "It's humming. You know the tune now: Odile in the Fog, side B of the Breakwaters' tape. Nobody can explain it, and nobody tries.", "if": "flag.bwHeard" },
            { "say": "cal", "text": "Is that... the song my bus driver hums? Skip? Why does it know Skip's song?", "if": "!flag.bwHeard" }
          ]
        },
        {
          "say": "buyer",
          "if": "buyer",
          "text": {
            "if": "flag.freezerBuyer == 'lab'",
            "then": "Ines Achebe, marine lab. I'm the calm one. It would have a proper tank, and a name, and graduate students.",
            "else": { "if": "flag.freezerBuyer == 'pomfret'", "then": "The envelope is in the hat. The hat is on my head. I am ready.", "else": "Crew's in the van. We go live in ten. Well, we go on tape in ten." }
          }
        },
        { "say": "dory", "text": "Right. You've all had your say. Now I'm asking the one person here who doesn't want anything out of it. What do we do?" },
        {
          "choose": [
            {
              "label": { "if": "buyer", "then": "Broker the sale to {buyer.name}", "else": "Broker the sale to Dr. Pomfret" },
              "hint": {
                "if": "flag.freezerBuyer == 'sandoval'",
                "then": "(your 10%: $60)",
                "else": { "if": "flag.freezerBuyer == 'lab'", "then": "(your 10%: $15)", "else": "(your 10%: $40)" }
              },
              "then": [
                { "set": { "freezerEnd": "sold" } },
                { "coin": 60, "why": "Your cut for brokering the thing in the freezer", "if": "flag.freezerBuyer == 'sandoval'" },
                { "coin": 15, "why": "Your cut for brokering the thing in the freezer", "if": "flag.freezerBuyer == 'lab'" },
                { "coin": 40, "why": "Your cut for brokering the thing in the freezer", "if": "flag.freezerBuyer != 'sandoval' && flag.freezerBuyer != 'lab'" },
                {
                  "if": "flag.freezerBuyer == 'lab'",
                  "then": [
                    { "rep": 4 },
                    { "narrate": "Dr. Achebe carries the cooler like it's full of eggs. Three weeks later a small brass plaque goes up in the lab's hallway: KITTREDGE'S SPECIMEN. Cal visits it on Saturdays." }
                  ],
                  "else": [
                    { "narrate": "The cooler goes into the back of a car. It stops humming when the lid closes. Dory counts the money twice and puts it in an envelope marked CAL." }
                  ]
                },
                { "say": "dory", "text": "Good. Fine. Good." },
                { "narrate": "Dory doesn't speak to anyone for a week. Not angrily. She just doesn't." }
              ]
            },
            {
              "label": "Let it go. Back to the sea.",
              "then": [
                { "set": { "freezerEnd": "sea" } },
                { "hook": "freed", "note": "flag.freezerFreed: the day it went back" },
                { "rep": 3 },
                { "narrate": "Dory lifts it out of the cooler herself. It holds on to her thumb a moment, then to Cal's. Then it slides off the granite into the black water without a splash." },
                { "narrate": "A little way out it comes up once and looks back. At you, you think. Then it's gone.", "if": "flag.freezerBond" },
                { "say": "cal", "text": "There goes college." },
                { "say": "dory", "text": "There goes the best thing that ever came up in a dredge. Come on. I'll buy you both a chowder." },
                {
                  "hook": "boat",
                  "sets": ["boat"],
                  "note": "a friend with a boat sees it safely out (docs/quests/STANDING.md, the night moment): Tess or Nan Ferreira, warm or better"
                },
                {
                  "if": "boat",
                  "then": [
                    {
                      "narrate": [
                        "A light comes round the end of the breakwater: {boat.name}, in the launch, engine off, drifting. \"Heard there was something going out tonight. Thought it might want an escort past the ledges.\"",
                        "The launch follows a small wake out past the bell buoy until there's no wake to follow."
                      ]
                    },
                    { "hook": "escort" }
                  ]
                }
              ]
            },
            {
              "label": "Take it back to the shop. It can live in a tank by the till.",
              "hint": "(pay Dory $80)",
              "disabled": "coin < 80",
              "then": [
                { "set": { "freezerEnd": "mascot" } },
                { "coin": -80, "why": "Paid Dory for the thing in the freezer" },
                { "add": { "unique": "seaThing" }, "as": "it" },
                { "edit": "it", "set": { "paid": 80 } },
                { "refresh": "panel" },
                { "say": "dory", "text": "You'll feed it? Scallops. It won't touch haddock. Snob." },
                { "say": "cal", "text": "Can I visit? I'm going to visit." },
                { "narrate": "It rides back to Front Street in the cooler, humming the whole way." }
              ]
            }
          ],
          "as": "end"
        },
        {
          "if": "buyer && end != 0",
          "then": [
            {
              "say": "buyer",
              "text": {
                "if": "flag.freezerBuyer == 'pomfret'",
                "then": "Well. I shall keep the envelope in the hat, then.",
                "else": { "if": "flag.freezerBuyer == 'sandoval'", "then": "We still have the dunk tank footage. That's an episode.", "else": "Honestly? Good." }
              }
            }
          ]
        },
        { "hook": "thing", "with": null }
      ]
    }
  },
  "hub": {
    "id": "fair",
    "title": "The Harvest Fair",
    "where": "Harbor Green",
    "window": ["2-2", "3-1"],
    "picks": 2,
    "town": true,
    "open": "fairOpen",
    "close": "fairClose",
    "test": [{ "set": { "freezerIn": true, "bwIn": true } }]
  },
  "vignettes": [
    { "hub": "fair", "label": "Kit Sandoval's tent (Dory's freezer)", "if": "flag.freezerIn && !flag.freezerFair", "scene": "sandovalTent" }
  ],
  "beats": [
    { "at": "1-2", "cast": "dory", "scene": "doryAsks" },
    { "at": "1-3", "cast": "pomfret", "scene": "pomfretVisit", "if": "flag.freezerIn" },
    { "at": "2-1", "cast": "sandoval", "scene": "sandovalVisit", "if": "flag.freezerIn" }
  ],
  "nights": [
    {
      "id": "freezer-cold",
      "window": ["1-3", "2-1"],
      "if": "flag.freezerIn",
      "scene": "freezerCold",
      "test": [{ "set": { "freezerIn": true } }]
    },
    {
      "id": "freezer-end",
      "window": ["3-2", "4-4"],
      "if": "flag.freezerIn",
      "scene": "freezerEnd",
      "test": [
        { "set": { "freezerIn": true, "freezerFair": true } },
        { "roll": { "freezerBuyer": ["pomfret", "sandoval", "lab", null] } },
        { "set": { "freezerBond": true } },
        { "hook": "setCoin", "with": 200 }
      ]
    }
  ],
  "calendar": [
    { "id": "harvest-fair", "night": "hub-fair", "story": "town", "where": "Harbor Green", "title": "The Harvest Fair", "known": true, "scene": null },
    { "id": "freezer-cold", "night": "freezer-cold", "story": "freezer", "where": "Kittredge Fish, Pier Nine", "title": "Dory's freezer", "known": "flag.freezerIn", "scene": "freezerCold" },
    { "id": "freezer-fair", "night": "hub-fair", "story": "freezer", "where": "Harbor Green", "title": "Sandoval films the reveal", "known": "flag.freezerIn && seen.freezer-cold", "scene": null, "order": 1 },
    { "id": "freezer-end", "night": "freezer-end", "story": "freezer", "where": "The breakwater", "title": "Dory decides", "known": "flag.freezerFair", "scene": "freezerEnd" }
  ],
  "mornings": [
    {
      "if": "flag.freezerEnd == 'sea' && flag.freezerFreed",
      "note": "released: the sea leaves a gift on the step for three mornings, and Pomfret wants the tooth",
      "then": [
        {
          "if": "hook.daysFreed == 1 && !(flag.freezerGiftsGot >= 1)",
          "then": [
            { "set": { "freezerGiftsGot": 1 } },
            { "add": { "unique": "seaPearl" } },
            { "refresh": "panel" },
            { "toast": "On the step this morning, still wet: a sea pearl.", "icon": "pearl" }
          ]
        },
        {
          "if": "hook.daysFreed == 2 && !(flag.freezerGiftsGot >= 2)",
          "then": [
            { "set": { "freezerGiftsGot": 2 } },
            { "add": { "unique": "seaRing" } },
            { "refresh": "panel" },
            { "toast": "On the step this morning, still wet: a green-gold ring.", "icon": "ring" }
          ]
        },
        {
          "if": "hook.daysFreed == 3 && !(flag.freezerGiftsGot >= 3)",
          "then": [
            { "set": { "freezerGiftsGot": 3 } },
            { "add": { "unique": "seaTooth" } },
            { "refresh": "panel" },
            { "toast": "On the step this morning, still wet: something's tooth.", "icon": "tooth" }
          ]
        },
        { "find": "tooth", "in": "stock", "match": { "uniqueId": "seaTooth" } },
        {
          "if": "hook.daysFreed == 4 && tooth && !flag.pomfretTooth",
          "then": [
            { "set": { "pomfretTooth": true } },
            { "hook": "walkIn", "with": "pomfret", "sets": ["pomfret"] },
            { "say": "pomfret", "text": "I hear things wash up on your step. Is that a TOOTH? Two hundred dollars. From the hat." },
            {
              "choose": [
                {
                  "label": "Sell it to him ($200)",
                  "then": [
                    { "take": "tooth" },
                    { "hook": "countSale" },
                    { "coin": 200, "why": "Sold Dr. Pomfret something's tooth" }
                  ]
                },
                {
                  "label": "Keep it",
                  "then": [{ "say": "pomfret", "text": "I understand. I wouldn't sell it either." }]
                }
              ]
            },
            { "leave": "pomfret" }
          ]
        }
      ]
    },
    { "find": "tank", "in": "stock", "match": { "uniqueId": "seaThing" } },
    {
      "if": "tank && flag.freezerEnd == 'mascot'",
      "note": "kept: the tank eats $5 of scallops a day, and somebody always comes in to look at it",
      "then": [
        { "coin": -5, "why": "Scallops for the thing in the tank" },
        {
          "hook": "looker",
          "with": [
            "I only came in to see the fish. Is it a fish?",
            "My kid says you've got a thing in a tank that hums.",
            "Can I just look at it for a minute? Since I'm here."
          ],
          "note": "a shopper comes in, says one of these, and browses"
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "There's a plaque at the marine lab with the Kittredge name on it. Cal shows it to everyone.", "if": "flag.freezerEnd == 'sold' && flag.freezerBuyer == 'lab'" },
    { "line": "Cal Kittredge starts college in the fall. Dory still won't say what paid for it.", "if": "flag.freezerEnd == 'sold' && flag.freezerBuyer != 'lab'" },
    { "line": "Some mornings there's still something on your step: a shell, a smooth stone, once a fork. The sea keeps in touch.", "if": "flag.freezerEnd == 'sea'" },
    { "line": "The thing in the tank by the till hums all day. Customers ask what it is. You tell them it's the shop mascot, which is true.", "if": "flag.freezerEnd == 'mascot'" }
  ]
});
