// Pawn Champ - The Twins' Map: two kids, a metal detector and a map in a bottle. The treasure
// turns out to be better than gold. Major quest M6, batch B (docs/quests/MAJOR.md#m6-the-twins-map).
//
// Hook (W1 Thu, shop)        the bottle and the map. Buy it, partner up, or send them home.
// Scene 1 (W2 Mon-Wed night) the sandbar at low tide: a tin with a brass key and a class photo.
// Middle (W2 Thu, shop)      Dutch Vandermeer offers $120 for the map and the key.
// Scene 2 (W3 Mon-Wed night) Fort Abel: Dutch is stuck in a drainage pipe; step two is behind a brick.
// Finale (W3 Thu-W4 Thu)     Gannet Island by the evening ferry: the 1968 time capsule and Ada's letter.
// Crossings: Grey Psalter (the way to the sandbar crosses Hob's Marsh, where the Pack practises),
// Static on Channel 16 (the twins find Royce's radio mast on Gannet Island first).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/twins.js.
defineStory({
  "id": "twins",
  "kind": "major",
  "colour": "#5ab8a0",
  "family": "town",
  "title": "The Twins' Map",
  "crosses": ["psalter", "radio"],
  "rumour": "Two kids with a metal detector found a map in a bottle on the sandbar.",
  "endings": { "classOf38": "Class of '68", "adaLetter": "Ada's Letter", "silver": "Silver Dollars", "soldMap": "Sold the Map", "sentHome": "Not Today, Kids" },
  "about": [
    "A treasure hunt with two kids. Lark and Linnet found a map in a bottle on the sandbar: the Hollow Neck Grammar Class of '68's \"three steps to the future\" (§{twinsMap}). Buy it for $10, be their partner, or send them home (Not Today, Kids).",
    "At low tide on the sandbar (§{twinsSandbar}) you dig up a tin with a brass key and a class photo at Fort Abel. A navigation tool or a spade helps. Dutch Vandermeer, the town's only detectorist, watches from the dune, then offers $120 for the map and key (§{dutchOffer}); selling ends it (Sold the Map).",
    "At Fort Abel at midnight (§{twinsFort}) Dutch is stuck in a drainpipe, trying to get there first. Help him out (with a rope if you have one) and he becomes a friend who later offers you his old detector (§{dutchDetector}), or leave him for the fire department. Under the D in ABEL is step three: the schoolhouse bell on Gannet Island.",
    "On the evening ferry to Gannet Island (§{twinsIsland}) the copper box holds letters from fourteen children, a roll of silver dollars, and a letter from Ada Lindqvist, age 12, who grew up to marry Old Pell. Give the capsule to the Athenaeum (Class of '68), keep the dollars and pay the twins their share (Silver Dollars), and give Ada's letter to Pell (Ada's Letter), who tells you about a blue light at Gull Point."
  ],
  "notes": "The Class of '68 ending keeps its old id, classOf38, so saved Storybooks still count it. Ada's Letter is the full ending: the capsule goes to the town and the letter goes to Pell.",
  "cast": {
    "dutch": {
      "name": "Dutch Vandermeer",
      "look": { "skin": "#f0c8a8", "hair": "#c8a060", "hs": 0, "coat": "#5a6a3a", "trim": "#e8a020", "style": "vest", "vest": "#5a6a3a", "hat": "wide", "hatc": "#6a5a3a", "pants": "#4a4a3a", "moustache": "#c8a060", "stout": true, "bag": "#3a3a30" }
    }
  },
  "icons": {
    "bottle": [
      ".....kk.....",
      "....kwwk....",
      "....kggk....",
      "....kGgk....",
      "...kgGggk...",
      "..kgpppPgk..",
      "..kgpppPgk..",
      "..kGpPpPgk..",
      "..kgpppPgk..",
      "..kggggggk..",
      "...kkkkkk...",
      "............"
    ],
    "brasskey": [
      "............",
      "..kkkk......",
      ".kyYYyk.....",
      ".kY..Ykkkkk.",
      ".ky..yyyyyyk",
      ".kyooykkykyk",
      "..kkkk.kk.k.",
      "............",
      ".kkkkkkkkk..",
      ".kppPPpppk..",
      ".kpPPPPppk..",
      ".kkkkkkkkk.."
    ],
    "coins": [
      "............",
      "............",
      "...kkkkkk...",
      "..kSSSSSSk..",
      "..ksssssdk..",
      "..kSSSSSSk..",
      "..ksssssdk..",
      "..kSSSSSSk..",
      "..ksssssdk..",
      "..kSSSSSSk..",
      "...kkkkkk...",
      "............"
    ],
    "detector": [
      "...kkkk.....",
      "...kddk.....",
      "....kdk.....",
      "....kdk.....",
      "....kdk.....",
      ".....kdk....",
      ".....kdk....",
      "......kdk...",
      ".....kkdkk..",
      "....kSsssk..",
      "...kSssssSk.",
      "....kkkkkk.."
    ]
  },
  "uniques": {
    "twinsMap": {
      "name": "Map in a bottle",
      "icon": "bottle",
      "cat": "curio",
      "guide": 10,
      "condLabel": "Corked",
      "questKey": true,
      "tells": [
        "Pencil on school paper: \"Hollow Neck Grammar, Class of '68. Three steps to the future.\"",
        "An X off the end of the breakwater, and a little drawing of a key."
      ]
    },
    "twinsTin": {
      "name": "Brass key and class photo",
      "icon": "brasskey",
      "cat": "curio",
      "guide": 5,
      "condLabel": "Rusty tin",
      "questKey": true,
      "tells": [
        "Fourteen children on the steps of a concrete bunker. On the back: \"Fort Abel, June 1968.\"",
        "The key's paper tag: \"Step two. Magazine two, fourth course, under the D.\""
      ]
    },
    "silverDollars": {
      "name": "Roll of Peace silver dollars",
      "icon": "coins",
      "cat": "silver",
      "guide": 200,
      "cond": 3,
      "condLabel": "Uncirculated",
      "tells": [
        "Twenty Peace dollars, still in the bank's paper.",
        "A note in the roll: \"For the Class of '68 reunion, 2018. Drinks are on us.\""
      ]
    },
    "dutchDetector": {
      "name": "Dutch's metal detector",
      "icon": "detector",
      "cat": "curio",
      "guide": 80,
      "cond": 2,
      "condLabel": "Well loved",
      "tells": [
        "A serious machine: discrimination dial, pinpoint mode, waterproof coil.",
        "A label-maker strip on the handle: PROPERTY OF D. VANDERMEER. IF FOUND, I'M NEARBY."
      ]
    },
    "adaLetter": {
      "name": "Ada's letter",
      "icon": "letter",
      "cat": "curio",
      "guide": 0,
      "condLabel": "Folded small",
      "questKey": true,
      "tells": [
        "\"To whoever finds this, from Ada Lindqvist, age 12, Gannet School.\"",
        "\"I am going to marry a fisherman and live in a white house on Front Street and I will NOT be seasick.\""
      ]
    }
  },
  "scenes": {
    "twinsMap": {
      "title": "Lark and Linnet bring in a map in a bottle",
      "customer": "lark",
      "steps": [
        {
          "hook": "linnetToo",
          "sets": ["linnet"],
          "note": "Linnet comes in with her sister and stands beside her."
        },
        { "say": "linnet", "text": "Lark said we shouldn't come back here after the amber. I said you're the only shop that talks to kids.", "if": "flag.kidsCheated" },
        { "say": "lark", "text": "We found a BOTTLE. On the sandbar, past the breakwater. The detector went crazy, but it was only the cap." },
        { "say": "linnet", "text": "There's a map inside! A real one! Everyone at school says it's fake." },
        { "view": { "counterIcon": "bottle" } },
        { "narrate": "Pencil on brittle school paper: \"Hollow Neck Grammar, Class of '68. Three steps to the future.\" An X off the end of the breakwater, and a drawing of a key." },
        {
          "choose": [
            {
              "label": "Buy the map from them",
              "hint": "($10)",
              "disabled": "coin < 10 || !shelf.free",
              "then": [
                { "add": { "unique": "twinsMap", "paid": 10 } },
                { "coin": -10, "why": "Bought a map in a bottle from Lark and Linnet" },
                { "set": { "twinsBought": true, "twinsIn": true } },
                { "say": "lark", "text": "Ten bucks! But we still get to dig, right? It's our treasure. Sort of." }
              ]
            },
            {
              "label": "\"Keep it. I'll come digging with you.\"",
              "then": [
                { "set": { "twinsPartner": true, "twinsIn": true } },
                { "say": "linnet", "text": "PARTNERS! We're partners with a shop!" }
              ]
            },
            {
              "label": "\"Run along home, you two.\"",
              "then": [
                { "set": { "twinsHome": true } },
                { "say": "lark", "text": "Fine. We'll find it ourselves. When we're older." }
              ]
            }
          ]
        },
        {
          "if": "flag.twinsIn",
          "then": [
            { "say": "lark", "text": "Low tide's after dark next week. Mum says we can go if a grown-up comes. You're a grown-up." },
            { "toast": "Calendar: the sandbar at low tide, early next week", "look": "lark" }
          ]
        },
        { "view": { "counterIcon": null } },
        { "hook": "leaveTogether", "note": "The twins go out of the door together, Linnet a step behind." }
      ]
    },
    "twinsSandbar": {
      "title": "Digging with the twins on the sandbar",
      "steps": [
        {
          "stage": "sandbarNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 162] },
            { "id": "lark", "cast": "lark", "at": [150, 164] },
            { "id": "linnet", "cast": "linnet", "at": [176, 160] }
          ]
        },
        {
          "if": "quest.psalter",
          "note": "Crossing: the Pack practises on the marsh.",
          "then": [
            { "narrate": "The short way to the sandbar is the causeway over Hob's Marsh. Out in the dark, candles in jam jars, and a dozen grown-ups practising a howl. Badly." },
            { "say": "linnet", "text": "That's Mr. Wick's club. Mum says don't look at them." },
            { "say": "lark", "text": "If they get weird, amber fixes it. Everybody knows that. It's in the book.", "if": "flag.kidsFair" }
          ]
        },
        { "narrate": "Low tide. The flats run out a quarter mile past the breakwater. Two headlamps, two buckets, one camping lantern and a metal detector that screams at every bottle cap in Massachusetts." },
        { "say": "lark", "text": "Bottle cap. Bottle cap. Ring pull. BOTTLE CAP." },
        { "say": "linnet", "text": "The map says forty steps from the last big rock, toward the lighthouse. But Lark's steps are tiny." },
        {
          "choose": [
            {
              "label": "Pace it out yourself",
              "then": [
                { "narrate": "Forty grown-up steps put you in a tide pool up to the ankle. Forty-one does it. The shovel hits metal." }
              ]
            },
            {
              "label": "Let Lark count, out loud",
              "then": [
                { "narrate": "Lark counts to forty, loses count at twenty-six, starts again, and is exactly right. The shovel hits metal." }
              ]
            },
            {
              "label": "Dig wherever the detector screams loudest",
              "then": [
                { "narrate": "Eleven bottle caps, a horseshoe and a car key later, the detector screams one last time, and means it." }
              ]
            },
            {
              "label": "Take a bearing on the lighthouse and pace it out",
              "needs": "find-way",
              "without": "A compass would settle \"toward the lighthouse\".",
              "then": [
                { "use": "find-way", "as": "it" },
                { "set": { "twinsBearing": true } },
                { "rep": 2, "why": "Found the twins' tin first time" },
                { "narrate": "You set the {it.name|lower|or:compass} on the big rock, sight the lighthouse, and walk forty steps down the bearing. Lark walks them beside you, counting, eighty tiny steps." },
                { "say": "lark", "text": "You're like a pirate. A boring pirate. A GOOD boring pirate." }
              ]
            }
          ]
        },
        {
          "if": "hook.carryingDig",
          "note": "A proper spade for the dig.",
          "then": [
            { "use": "dig", "as": "spade" },
            { "narrate": "Your {spade.name|lower} goes down through wet sand like a spoon through chowder. Linnet's beach spade is retired with honors." },
            { "say": "linnet", "text": "Can I have a go? I'll be careful. I'll be MEDIUM careful." }
          ]
        },
        { "narrate": "A rusted tobacco tin, two feet down. Inside, in oilcloth: a brass key with a paper tag, and a photo of fourteen children on the steps of a concrete bunker." },
        { "say": "linnet", "text": "That's Fort Abel! Past Gull Point! Dad says it's haunted." },
        { "say": "lark", "text": "The tag says \"Step two. Magazine two, fourth course, under the D.\" What's a course? Is it like a golf course?" },
        {
          "enter": {
            "id": "dutch",
            "cast": "dutch",
            "name": "A man on the dune",
            "at": [296, 148],
            "facingLeft": true
          }
        },
        { "narrate": "Up on the dune, a man with a much bigger metal detector has been watching you for some time. He waves. He doesn't come down." },
        { "say": "linnet", "text": "Can you keep the tin at the shop? Mum won't have rusty things in the house." },
        { "add": { "unique": "twinsTin" } },
        { "refresh": "panel" },
        { "set": { "twinsKey": true, "twinsFort": true } },
        { "say": "lark", "text": "Fort Abel's next. The week after next, when Mum's on late shift. She said yes if you come. Mostly yes." },
        { "toast": "Calendar: Fort Abel, early in week 3", "look": "lark" },
        { "remove": "dutch" }
      ]
    },
    "dutchOffer": {
      "title": "Dutch Vandermeer wants the map and the key",
      "customer": "dutch",
      "steps": [
        {
          "say": "dutch",
          "text": [
            "Dutch Vandermeer. Hollow Neck Detectorists: founder, president and, since last spring, the only member.",
            "I saw you out on the flats with the little ones. Nice tin. Grammar School, 1968, am I right? I've been looking for that capsule for eleven years."
          ]
        },
        { "find": "map", "in": "stock", "match": { "uniqueId": "twinsMap" } },
        { "find": "tin", "in": "stock", "match": { "uniqueId": "twinsTin" } },
        {
          "say": "dutch",
          "text": { "if": "map", "then": "$120 for the map and the key. Cash. The kids will have moved on to dinosaurs by Christmas.", "else": "$80 for the key and the photo. Cash. The kids will have moved on to dinosaurs by Christmas." }
        },
        {
          "choose": [
            {
              "label": "Sell them to Dutch",
              "hint": { "if": "map", "then": "(+$120)", "else": "(+$80)" },
              "disabled": "!tin",
              "then": [
                { "take": "map" },
                { "take": "tin" },
                { "coin": 120, "why": "Sold the twins' map to Dutch Vandermeer", "if": "map" },
                { "coin": 80, "why": "Sold the twins' map to Dutch Vandermeer", "if": "!map" },
                { "set": { "twinsSold": true } },
                { "rep": -6, "if": "flag.twinsPartner" },
                { "rep": -3, "if": "!flag.twinsPartner" },
                { "say": "dutch", "text": "Pleasure. I'll put your name on the plaque. Small print." },
                { "toast": "By evening the twins know. Linnet tells the whole school.", "look": "linnet" }
              ]
            },
            {
              "label": "\"They're not mine to sell.\"",
              "then": [
                { "set": { "dutchRival": true } },
                { "say": "dutch", "text": "Suit yourself. The fort's public land, you know. First come, first served." }
              ]
            }
          ]
        },
        { "leave": "dutch" }
      ]
    },
    "twinsFort": {
      "title": "Step two, at Fort Abel",
      "steps": [
        {
          "stage": "fortabel",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [130, 164] },
            { "id": "lark", "cast": "lark", "at": [166, 166] },
            { "id": "linnet", "cast": "linnet", "at": [188, 162] }
          ]
        },
        { "narrate": "Fort Abel, near midnight. A gun battery from before the First World War, with no gun, sixty years of graffiti and a wind straight off the Atlantic." },
        { "say": "linnet", "text": "Magazine two. Fourth course of bricks. Under the D." },
        { "narrate": "From the drainage pipe at the foot of the wall, a voice: \"Hello? Is someone there? I'm not stuck. I'm resting.\"" },
        { "say": "lark", "text": "It's the dune man! His bum's sticking out!" },
        { "narrate": "Dutch got here first. He tried to reach the magazine from below, through the drain, and is wedged at the hips. His detector is still beeping somewhere inside." },
        {
          "choose": [
            {
              "label": "Help Dutch out of the pipe",
              "then": [
                { "set": { "dutchFriend": true } },
                { "narrate": "It takes all three of you, both twins' scarves and a tube of Linnet's lip balm. Dutch comes out like a cork." },
                { "enter": { "id": "dutch", "cast": "dutch", "at": [250, 166], "facingLeft": true } },
                {
                  "say": "dutch",
                  "text": [
                    "Right. Well. Thank you. I owe you one. I don't say that. Ask anyone. Ask the other detectorists. There aren't any.",
                    "The D you want isn't a letter. Look at the wall. ABEL. They painted it after the war. Under the D in ABEL."
                  ]
                },
                { "walk": "dutch", "to": [270, 166] }
              ]
            },
            {
              "label": "Find the brick first, and leave him for the fire department",
              "then": [
                { "set": { "dutchStuck": true } },
                { "rep": -2 },
                { "narrate": "You call it in from the road on the way home. The fire department arrives with a winch, and so does a camera crew from the evening news." }
              ]
            },
            {
              "label": "Get a rope round him and haul",
              "needs": "climb",
              "without": "A rope would make this a lot more dignified.",
              "note": "A rope makes it clean, and Dutch owes you properly.",
              "then": [
                { "use": "climb" },
                { "set": { "dutchFriend": true, "dutchRoped": true } },
                { "rep": 2 },
                { "narrate": "A bowline round his belt, the rope over the old gun mount, and three of you leaning back. Dutch comes out in one long, slow, dignified piece." },
                { "enter": { "id": "dutch", "cast": "dutch", "at": [250, 166], "facingLeft": true } },
                {
                  "say": "dutch",
                  "text": [
                    "Now that was professional. I'll remember that. When I sell the old detector, it's yours first, and cheap.",
                    "The D you want isn't a letter. Look at the wall. ABEL. They painted it after the war. Under the D in ABEL."
                  ]
                },
                { "walk": "dutch", "to": [270, 166] }
              ]
            }
          ]
        },
        { "narrate": "Under the D in a painted ABEL, the fourth course of brick slides out like a drawer. Behind it, a brass plate: GANNET SCHOOL. THE BELL. STEP THREE." },
        { "say": "lark", "text": "Gannet Island! The ferry goes there!" },
        { "say": "linnet", "text": "The evening ferry. Next week. I'm bringing sandwiches. And a better shovel." },
        { "set": { "twinsClue": true } },
        { "toast": "Calendar: Gannet Island, by the evening ferry", "look": "linnet" }
      ]
    },
    "twinsIsland": {
      "title": "The evening ferry to Gannet Island",
      "steps": [
        {
          "stage": "gannet",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [112, 166] },
            { "id": "lark", "cast": "lark", "at": [150, 168] },
            { "id": "linnet", "cast": "linnet", "at": [172, 164] }
          ]
        },
        { "narrate": "The evening ferry puts you off on Gannet Island with forty minutes until it turns round. The schoolhouse has been shut since 1961. The bell is still in its post." },
        {
          "if": "quest.radio && !flag.radioIsland",
          "note": "Crossing: the twins find Royce's mast first.",
          "then": [
            { "set": { "twinsSawMast": true } },
            { "say": "linnet", "text": "There's a man behind the pine trees with fishing rods tied up into the sky. He waved. Then he said not to tell anyone he waved." }
          ],
          "else": [
            { "say": "linnet", "text": "Your friend with the fishing-rod aerial gave us tomatoes. He says hi. He says don't say hi.", "if": "quest.radio" }
          ]
        },
        { "narrate": "Under the bell post, a ring of stones. Under the stones, a copper box with a padlock, green as a penny. The brass key turns as if it was oiled yesterday." },
        {
          "if": "hook.carryingTime",
          "note": "A watch keeps you honest about the ferry.",
          "then": [
            { "use": "time" },
            { "set": { "twinsTimed": true } },
            {
              "narrate": [
                "You check the time when the ferry ties up and again when the box opens. Twenty-six minutes left. Time to read the letters properly, here, where they were written.",
                "One of them is to \"the boy who sits behind me\". He did. He married her. They had a hardware store on Water Street for forty years. Lark reads that one twice."
              ]
            },
            { "rep": 2, "why": "Read the 1968 letters on the island" }
          ],
          "else": [
            { "narrate": "Nobody brought a watch. You keep one eye on the ferry's smoke and read fast." }
          ]
        },
        { "narrate": "Letters to the future from fourteen children. A roll of Peace silver dollars with a note: \"For the reunion. Drinks are on us.\" And one envelope, addressed in round careful writing." },
        { "say": "linnet", "text": "\"To whoever finds this, from Ada Lindqvist, age 12. I am going to marry a fisherman and live in a white house on Front Street and I will NOT be seasick.\"" },
        { "say": "lark", "text": "Ada. Like Old Pell's Ada? His Ada was from out here, he said. She hated boats." },
        {
          "choose": [
            {
              "label": "Give the whole capsule to the Athenaeum",
              "hint": "(+8 rep)",
              "then": [
                { "set": { "twinsCapsule": true } },
                { "rep": 8, "why": "Gave the 1968 time capsule to the town" },
                { "say": "lark", "text": "We'll be in the Athenaeum! With our names on a card! Lark and Linnet, Finders." }
              ]
            },
            {
              "label": "Keep the silver dollars; give the Athenaeum the letters",
              "hint": { "if": "flag.twinsPartner", "then": "(pay the twins $60 for their share)", "else": "(pay the twins $30 for their share)" },
              "disabled": "(flag.twinsPartner && coin < 60) || (!flag.twinsPartner && coin < 30)",
              "note": "Partners get a bigger share.",
              "then": [
                { "set": { "twinsCoins": true } },
                { "add": { "unique": "silverDollars" } },
                { "refresh": "panel" },
                { "coin": -60, "why": "Paid the twins their share of the silver dollars", "if": "flag.twinsPartner" },
                { "coin": -30, "why": "Paid the twins their share of the silver dollars", "if": "!flag.twinsPartner" },
                {
                  "say": "linnet",
                  "text": { "if": "flag.twinsPartner", "then": "$60! That's a whole new detector. A cheap one.", "else": "$30! That's a whole new detector. A cheap one." }
                }
              ]
            }
          ]
        },
        { "narrate": "On the ride back, the twins fall asleep against the life jackets. Ada's letter is in your coat." },
        { "enter": { "id": "pell", "cast": "pell", "at": [260, 162], "facingLeft": true } },
        { "narrate": "Old Pell is mending a net on the landing when the ferry comes in. He looks up at the twins, and then at you." },
        {
          "choose": [
            {
              "label": "Give Ada's letter to Old Pell",
              "then": [
                { "set": { "twinsLetter": true } },
                { "rep": 4 },
                { "narrate": "He reads it standing up. Then he sits down on a lobster crate and reads it again." },
                {
                  "say": "pell",
                  "text": [
                    "\"I will NOT be seasick.\" She was, though. Every time. Forty years of being seasick for me.",
                    "You didn't have to bring me this."
                  ]
                },
                {
                  "if": "!flag.lighthouseClue",
                  "then": [
                    { "say": "pell", "text": "So I'll tell you something I've told no one. Night fishing off Gull Point, I've seen a blue light in the old lighthouse. Shut thirty years. Your aunt had a camping lantern just that color." },
                    { "set": { "lighthouseClue": true } },
                    { "toast": "Clue: a blue light in the old lighthouse", "look": "pell" }
                  ],
                  "else": [{ "say": "pell", "text": "And mind that blue light at Gull Point. I meant it." }]
                }
              ]
            },
            {
              "label": "Keep it for now",
              "then": [
                { "set": { "twinsKeptLetter": true } },
                { "add": { "unique": "adaLetter" } },
                { "refresh": "panel" },
                { "say": "pell", "text": "Evening. Good trip? You look like you found something." }
              ]
            }
          ]
        }
      ]
    },
    "dutchDetector": {
      "title": "Dutch sells his old detector",
      "customer": "dutch",
      "steps": [
        {
          "say": "dutch",
          "text": [
            "I've bought a new machine. Waterproof to ten metres. I don't swim, but it's nice to know.",
            "The old one. You'd have it for $35? The twins could use it. I mean the shop could. Whoever."
          ]
        },
        {
          "choose": [
            {
              "label": "Buy Dutch's old detector",
              "hint": "($35)",
              "disabled": "coin < 35 || !shelf.free",
              "then": [
                { "add": { "unique": "dutchDetector", "paid": 35 } },
                { "coin": -35, "why": "Bought Dutch's metal detector" },
                { "say": "dutch", "text": "Treat her gently. She's found four hundred bottle caps and one Roman coin. It was a fake, but still." }
              ]
            },
            {
              "label": "\"Give it to the twins yourself, Dutch.\"",
              "then": [
                { "set": { "dutchGift": true } },
                { "rep": 2 },
                { "say": "dutch", "text": "...Hm. Yes. Yes, I could do that. Don't tell anyone I'm nice." }
              ]
            }
          ]
        },
        { "leave": "dutch" }
      ]
    }
  },
  "beats": [
    { "at": "1-4", "cast": "lark", "scene": "twinsMap" },
    { "at": "2-4", "cast": "dutch", "scene": "dutchOffer", "if": "flag.twinsKey && !flag.twinsSold && hook.tinHere" },
    { "at": "4-2", "cast": "dutch", "scene": "dutchDetector", "if": "flag.dutchFriend" }
  ],
  "nights": [
    {
      "id": "twins-sandbar",
      "window": ["2-1", "2-3"],
      "if": "flag.twinsIn",
      "scene": "twinsSandbar",
      "test": [{ "set": { "twinsIn": true, "twinsPartner": true } }]
    },
    {
      "id": "twins-fort",
      "window": ["3-1", "3-3"],
      "if": "flag.twinsKey && !flag.twinsSold",
      "scene": "twinsFort",
      "test": [{ "set": { "twinsKey": true } }]
    },
    {
      "id": "twins-island",
      "window": ["3-4", "4-4"],
      "if": "flag.twinsClue && !flag.twinsSold",
      "scene": "twinsIsland",
      "test": [{ "set": { "twinsClue": true, "twinsPartner": true } }, { "hook": "testCoin", "with": 200 }]
    }
  ],
  "calendar": [
    {
      "id": "twins-sandbar",
      "night": "twins-sandbar",
      "story": "twins",
      "where": "The sandbar",
      "title": "Digging with the twins",
      "known": "flag.twinsIn",
      "scene": "twinsSandbar",
      "bring": ["find-way", "dig"]
    },
    {
      "id": "twins-fort",
      "night": "twins-fort",
      "story": "twins",
      "where": "Fort Abel",
      "title": "Step two, with the twins",
      "known": "flag.twinsFort && !flag.twinsSold",
      "scene": "twinsFort",
      "bring": ["climb"]
    },
    {
      "id": "twins-island",
      "night": "twins-island",
      "story": "twins",
      "where": "Gannet Island",
      "title": "The evening ferry with the twins",
      "known": "flag.twinsClue",
      "scene": "twinsIsland",
      "bring": ["time"]
    }
  ],
  "epilogue": [
    { "line": "Dutch Vandermeer dug up the 1968 time capsule on his own. He gave a talk about it at the library. Two people came, and they were twins, and they booed.", "if": "flag.twinsSold" },
    { "line": "The Class of '68's letters are in a case at the Athenaeum, with a card: \"Found by Lark and Linnet, and a friend.\"", "if": "!flag.twinsSold && flag.twinsCapsule" },
    { "line": "Lark and Linnet spent their share of the silver dollars on a second-hand detector. They still check the sandbar every low tide.", "if": "!flag.twinsSold && !flag.twinsCapsule && flag.twinsCoins" },
    { "line": "Old Pell keeps Ada's letter in his wheelhouse, folded small, where she can see the water.", "if": "flag.twinsLetter" }
  ],
  "talk": {
    "by": "skip",
    "rumour": [
      "Lark and Linnet were late for the bus again. Out on the sandbar at six in the morning with their metal detector.",
      "Found a bottle, they said. With a map. They wouldn't show me. I drive a bus, not a pirate ship."
    ],
    "react": { "classOf38": "The Class of '68 capsule is in the Athenaeum. Hester gives tours. Short ones.", "adaLetter": "Old Pell was at the bus stop this morning reading a letter. He's not taking the bus. He just likes the bench.", "silver": "The twins bought a better detector. They found my keys with it. I hadn't lost them.", "soldMap": "Somebody from out of town dug up the old schoolhouse yard on Gannet. The twins won't talk about it.", "sentHome": "The twins asked me what a map is worth. I said, depends who you show it to. They looked at your shop." },
    "sway": {
      "classOf38": { "hester": 2, "skip": 1 },
      "adaLetter": { "skip": 2 },
      "silver": { "skip": 1 },
      "soldMap": { "skip": -2 }
    }
  },
  "outcome": [
    { "if": "flag.twinsSold", "ending": "soldMap" },
    { "if": "flag.twinsCapsule && flag.twinsLetter", "ending": "adaLetter" },
    { "if": "flag.twinsCapsule", "ending": "classOf38" },
    { "if": "flag.twinsCoins", "ending": "silver" },
    { "if": "flag.twinsHome", "ending": "sentHome" }
  ]
});
