// Pawn Champ - The Sideshow Banner. Minor quest m46, batch K (docs/quests/MINOR.md).
// The Marvellous Szabos, a family of retired carnival performers, winter in the shut stalls on the
// boardwalk. Their hand-painted banner is the last thing left from the show. Somebody in town has
// complained. Its scene is a lunch errand at the winter quarters (arcadeFrontWinter, drawn in
// js/quests/busker.js). In the good ending the banner goes up over the arcade doors, and stays
// there for the rest of the run.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/banner.js.
defineStory({
  "id": "banner",
  "months": [1],
  "kind": "minor",
  "title": "The Sideshow Banner",
  "location": "arcadeFrontWinter",
  "rumour": "There's smoke coming out of the taffy stall on the boardwalk. In October. Somebody's living in there.",
  "endings": { "hung": "Under the Banner", "museum": "Sold to Sarasota", "gone": "Moved On" },
  "about": [
    "An October story about two retired circus performers. Ilona Szabo, once the Strongest Woman in New England, borrows on the last banner from their show (§{ilonaBanner}); she and her brother Pip winter in the taffy stall on the boardwalk. Pip tells you there's a complaint about them and asks you to lunch, banner and all (§{pipAsks}).",
    "At lunch (§{bannerQuarters}) Clarice Dunmore of the Boardwalk Preservation Committee turns up. Hang the banner over the arcade doors and she remembers seeing the show as a girl, and withdraws the complaint (Under the Banner). Or call a circus museum in Sarasota to buy it and send the Szabos somewhere warm (Sold to Sarasota). Otherwise they leave (Moved On)."
  ],
  "cast": {
    "ilona": {
      "name": "Ilona Szabo",
      "look": { "skin": "#e0b090", "hair": "#c8c8d0", "hs": 3, "coat": "#7a2a5a", "style": "dress", "trim": "#e8c050", "pants": "#3a2a3a", "stout": true }
    },
    "pip": {
      "name": "Pip Szabo",
      "look": { "skin": "#e0b090", "hair": "#e8e8e8", "hs": 0, "coat": "#c84a3a", "style": "jacket", "trim": "#e8c050", "pants": "#2a2a4a", "moustache": "#e8e8e8", "hat": "helm", "hatc": "#c8c8d0" }
    },
    "dunmore": {
      "name": "Mrs. Clarice Dunmore",
      "look": { "skin": "#f0d0b8", "hair": "#d8c8a0", "hs": 3, "coat": "#8a9aaa", "style": "puffer", "pants": "#4a4a52", "bag": "#3a2a1e", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "banner": [
      "............",
      "kkkkkkkkkkkk",
      "kpppppppppk.",
      "kpRRpbbpyypk",
      "kpRRpbbpyypk",
      "kppppppppppk",
      "kprrrrrrrrpk",
      "kppppppppppk",
      "kkkkkkkkkkkk",
      ".r.y.r.y.r..",
      ".r.y.r.y.r..",
      "............"
    ]
  },
  "uniques": {
    "szaboBanner": {
      "name": "Sideshow banner, The Marvellous Szabos",
      "icon": "banner",
      "cat": "art",
      "guide": 180,
      "questKey": true,
      "tells": [
        "Hand-painted canvas, twelve feet long: THE MARVELLOUS SZABOS. A strongwoman, a man in a cannon, a dog on a ball.",
        "Signed in the corner by a known banner painter from Sarasota, 1961. Museums collect these."
      ]
    }
  },
  "scenes": {
    "ilonaBanner": {
      "title": "Ilona Szabo borrows on the banner",
      "customer": "ilona",
      "steps": [
        {
          "say": "ilona",
          "text": [
            "Ilona Szabo. Once, the Strongest Woman in New England. Now, the strongest woman in the taffy stall.",
            "My brother and I winter on the boardwalk. We have done it for eleven years. Mr. Fontaine at the arcade doesn't mind, and the stalls are dry. But propane is not free.",
            "This is our banner. It is the last thing from the show. I don't want to sell it. I want to borrow on it, until spring."
          ]
        },
        { "offer": { "unique": "szaboBanner" }, "persona": "honest", "asking": 70, "min": 50 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "bannerHeld": true } },
            { "say": "ilona", "text": "Keep it rolled. Paint cracks if you fold it. Like people." }
          ],
          "else": [
            { "say": "ilona", "text": "Then we'll burn the furniture. There isn't much. It will be a short winter, one way or another." }
          ]
        },
        { "leave": "ilona" }
      ]
    },
    "pipAsks": {
      "title": "Pip asks you to lunch",
      "customer": "pip",
      "steps": [
        {
          "say": "pip",
          "text": [
            "Pip Szabo. The Human Cannonball, retired, obviously. The helmet is for the cold.",
            "Somebody has put a notice on our shutter. \"Complaints received. Unlawful occupation. Hearing to follow.\" Ilona tore it down. Then she put it back up, because she's proud, and she wants them to see she read it.",
            "She'd never ask. So I'm asking. Come to lunch at the stalls. Bring the banner, if you can. She talks better with it in the room."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll be there.\"",
              "then": [
                { "plan": "banner-quarters" },
                { "set": { "bannerAsked": true } },
                { "toast": "Calendar: the boardwalk winter quarters, lunchtime {placed:banner-quarters}", "look": "pip" },
                { "say": "pip", "text": "Ilona makes a goulash. It will knock you over. That's a compliment." }
              ]
            },
            {
              "label": "\"I'm sorry, Pip. I can't get into it.\"",
              "then": [{ "set": { "bannerEnd": "gone" } }, { "say": "pip", "text": "Of course. Nobody can." }]
            }
          ]
        },
        { "leave": "pip" }
      ]
    },
    "bannerQuarters": {
      "title": "Lunch with the Marvellous Szabos",
      "steps": [
        {
          "stage": "arcadeFrontWinter",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "ilona", "cast": "ilona", "at": [150, 162], "facingLeft": true },
            { "id": "pip", "cast": "pip", "at": [176, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The boardwalk in winter quarters. Smoke from a stovepipe through the taffy stall's roof, washing on a line, a woodpile stacked very neatly. Goulash on a camp stove." },
        { "say": "ilona", "text": "Pip told you. Of course he did. He was fired out of a cannon two thousand times. He has no discretion left." },
        { "enter": { "id": "dunmore", "cast": "dunmore", "at": [300, 160], "facingLeft": true } },
        { "walk": "dunmore", "to": [230, 160] },
        { "say": "dunmore", "text": "Clarice Dunmore, the Boardwalk Preservation Committee. I made the complaint, and I'm not ashamed of it. People can't just live on the boardwalk. What will visitors think?" },
        { "say": "pip", "text": "Visitors? It's October. The visitors are us." },
        { "find": "it", "in": "stock", "match": { "uniqueId": "szaboBanner" } },
        {
          "choose": [
            {
              "label": "Unroll the banner and hang it over the arcade doors: \"Let them think the Szabos live here.\"",
              "if": "it",
              "then": [
                { "take": "it" },
                { "refresh": "panel" },
                { "narrate": "Pip gets on the woodpile. Ilona lifts the woodpile, with Pip on it. Twelve feet of hand-painted canvas goes up over the doors of Neptune's Arcade, and the wind fills it like a sail." },
                { "set": { "bannerEnd": "hung" } },
                { "hook": "pause", "with": 900, "note": "A beat before Mrs. Dunmore speaks." },
                { "say": "dunmore", "text": "...Oh. Oh, I remember them. My father took me. 1962. The dog on the ball." },
                { "say": "ilona", "text": "The dog was called Lajos. He was smarter than Pip." },
                { "say": "dunmore", "text": "I'll... withdraw the complaint. I'll say it was a misunderstanding. It was a misunderstanding." },
                { "rep": 5 }
              ]
            },
            { "label": "\"I don't have the banner anymore. But they belong here.\"", "if": "!it" },
            {
              "label": "\"A circus museum in Sarasota would pay $300 for this. Sell it, and rent somewhere warm.\"",
              "if": "it",
              "then": [
                { "set": { "bannerEnd": "museum" } },
                { "sell": "it", "to": "museum" },
                { "hook": "museumShare", "with": "Sold the Szabos' banner to a circus museum, and gave them their share", "note": "$300, less what you lent on it." },
                { "refresh": "panel" },
                { "narrate": "You make the call from the pay phone by the arcade. Sarasota says yes before you've finished describing the dog. Ilona takes her share without a word, and then a word: \"Warm.\"" },
                { "say": "pip", "text": "Florida. I was fired out of a cannon in Florida, 1971. Into a lake. On purpose, mostly." }
              ]
            },
            { "label": "\"Mrs. Dunmore has a point. I'm sorry.\"" }
          ],
          "as": "pick"
        },
        {
          "if": "!it || pick == 2",
          "note": "Either way, they move on.",
          "then": [
            { "set": { "bannerEnd": "gone" } },
            { "edit": "it", "set": { "questKey": false, "nosale": false } },
            { "refresh": "panel", "if": "it" },
            { "say": "ilona", "text": "Yes. Everyone is sorry. Eat the goulash. Then go." },
            {
              "narrate": { "if": "it", "then": "By the end of the week the stalls are empty, swept, the stovepipe hole patched with a square of tin. Nobody comes back for the banner. It's yours to sell.", "else": "By the end of the week the stalls are empty, swept, the stovepipe hole patched with a square of tin." }
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-1", "cast": "ilona", "scene": "ilonaBanner" },
    { "at": "2-4", "cast": "pip", "scene": "pipAsks", "if": "flag.bannerHeld && !flag.bannerEnd" }
  ],
  "errands": [
    {
      "id": "banner-quarters",
      "title": "Lunch with the Marvellous Szabos",
      "where": "the boardwalk stalls",
      "scene": "bannerQuarters",
      "test": [{ "add": { "unique": "szaboBanner", "paid": 60 } }]
    }
  ],
  "calendar": [
    { "id": "banner-quarters", "errand": "banner-quarters", "story": "banner", "where": "The boardwalk", "title": "Lunch with the Szabos", "known": "flag.bannerAsked" }
  ],
  "epilogue": [
    { "line": "The Marvellous Szabos' banner hangs over Neptune's Arcade all winter. Clarice Dunmore brings them soup on Sundays, and pretends it was extra.", "if": "flag.bannerEnd == 'hung'" },
    { "line": "The Szabos winter in Sarasota now, three streets from the circus museum. They visit their banner every Tuesday, and tell the tour groups which bits are lies.", "if": "flag.bannerEnd == 'museum'" },
    { "line": "The taffy stall on the boardwalk has a square of tin on the roof where a stovepipe used to be. Nobody knows where the Szabos went.", "if": "flag.bannerEnd == 'gone'" }
  ],
  "talk": {
    "by": "marguerite",
    "rumour": [
      "Somebody's living in the taffy stall on the boardwalk. There's a stovepipe through the roof. It's October.",
      "And now there's a complaint on my desk about it, from the Boardwalk Preservation Committee. Which is Clarice Dunmore, and a letterhead."
    ],
    "react": { "hung": "Clarice Dunmore withdrew her complaint in writing. She called it a misunderstanding. I've framed the letter.", "museum": "The Szabos have gone to Florida, I hear. Somebody paid their way. The complaint file is closed. Warmly.", "gone": "The taffy stall is empty and the complaint is closed. I don't feel as good about it as the paperwork does." },
    "sway": { "hung": { "marguerite": 2 }, "museum": { "marguerite": 1 }, "gone": { "marguerite": -1 } }
  },
  "outcome": "flag.bannerEnd"
});
