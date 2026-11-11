// Pawn Champ - Cut Lines. Minor quest m5, batch B (docs/quests/MINOR.md#m5-cut-lines).
// Two lobstermen each sell you the other man's buoys, found drifting with the lines cut. Both turn
// up for them at once at the harbormaster's shack, where Tess hears trap disputes on Wednesdays.
// MINOR.md first placed the scene at Pier Nine at dawn; it's at Tess's shack at lunch instead, so it
// fits the lunch errand and uses this batch's own art.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "cutlines",
  "kind": "minor",
  "title": "Cut Lines",
  "location": "harbormaster",
  "rumour": "Somebody's cutting trap lines off the breakwater.",
  "endings": { "shook": "Shook Hands", "feud": "Still Feuding", "wall": "Restaurant Wall" },
  "about": [
    "A small feud story. Somebody is cutting lobster trap lines off the breakwater, and each of two lobstermen blames the other. Arne Sorensen sells you Mick Doherty's buoys, found drifting (§{arneBuoys}); the next day Mick sells you Arne's (§{mickBuoys}).",
    "Holding either set gets you to a hearing at the harbormaster's shack (§{cutShack}), where Tess looks at the cut ends: a propeller, not a knife, from a relief ferry captain cutting the corner. Hand each man back his own buoys and they shake hands (Shook Hands), make them carry each other's home and they stay happily at war (Still Feuding), or sell the lot to the Clam Shack for its wall (Restaurant Wall)."
  ],
  "cast": {
    "arneSorensen": {
      "name": "Arne Sorensen",
      "look": { "skin": "#f0c8a8", "hair": "#e8d090", "hs": 0, "coat": "#c84a3a", "style": "puffer", "beard": "#e8d090", "hat": "beanie", "hatc": "#e8c040", "pants": "#e8a020", "stout": true }
    },
    "mickDoherty": {
      "name": "Mick Doherty",
      "look": { "skin": "#e8b898", "hair": "#8a3a1a", "hs": 1, "coat": "#3a7a4a", "style": "jacket", "hat": "cap", "hatc": "#e8e4dc", "pants": "#e8a020", "moustache": "#8a3a1a" }
    }
  },
  "icons": {
    "buoy": [
      ".....kk.....",
      ".....kk.....",
      "....kwwk....",
      "...krrrrk...",
      "...krRrrk...",
      "...kcccck...",
      "...kcccck...",
      "...krrrrk...",
      "...krrrrk...",
      "....krrk....",
      ".....kk.....",
      "............"
    ],
    "buoyg": [
      ".....kk.....",
      ".....kk.....",
      "....kwwk....",
      "...kggggk...",
      "...kgGggk...",
      "...kcccck...",
      "...kcccck...",
      "...kggggk...",
      "...kggggk...",
      "....kggk....",
      ".....kk.....",
      "............"
    ]
  },
  "uniques": {
    "buoysMick": {
      "name": "Painted buoys, green and white",
      "icon": "buoyg",
      "cat": "curio",
      "guide": 15,
      "condLabel": "Line cut",
      "questKey": true,
      "tells": [
        "Doherty colours: green over white, hand-painted every spring.",
        "The line is cut clean, at an angle, a foot below the buoy."
      ]
    },
    "buoysArne": {
      "name": "Painted buoys, red and yellow",
      "icon": "buoy",
      "cat": "curio",
      "guide": 15,
      "condLabel": "Line cut",
      "questKey": true,
      "tells": [
        "Sorensen colours: red over yellow, with a white band.",
        "The line is cut clean, at an angle, a foot below the buoy. Exactly like the others."
      ]
    }
  },
  "scenes": {
    "arneBuoys": {
      "title": "Arne Sorensen sells you Mick's buoys",
      "customer": "arne",
      "steps": [
        {
          "say": "arne",
          "text": [
            "Somebody's cutting trap lines off the breakwater. Forty traps I've lost this month. Forty.",
            "Found these drifting by the beacon this morning. Mick Doherty's colours. Now, I'm not saying he cut his own lines to put it on me. I'm saying he would.",
            "Ten bucks and they're yours. If Mick wants them back, he can come and ask. Nicely."
          ]
        },
        {
          "choose": [
            {
              "label": "Buy the green and white buoys",
              "hint": "($10)",
              "disabled": "coin < 10 || !shelf.free",
              "then": [
                { "add": { "unique": "buoysMick", "paid": 10 }, "as": "buoys" },
                { "coin": -10, "why": "Bought {buoys.name|lower} from {arne.name}" },
                { "say": "arne", "text": "Hang them in the window. Let him walk past." }
              ]
            },
            { "label": "\"Keep your feud out of my shop.\"" }
          ]
        },
        { "set": { "cutHeard": true } },
        { "leave": "arne" }
      ]
    },
    "mickBuoys": {
      "title": "Mick Doherty sells you Arne's buoys",
      "customer": "mick",
      "steps": [
        {
          "say": "mick",
          "text": [
            "Mick Doherty. You'll have heard about the cut lines. You'll have heard Arne Sorensen's side of it, I expect, at volume.",
            "These were floating off the breakwater. Sorensen's. He cut his own to cover cutting mine. Ten bucks."
          ]
        },
        {
          "choose": [
            {
              "label": "Buy the red and yellow buoys",
              "hint": "($10)",
              "disabled": "coin < 10 || !shelf.free",
              "then": [
                { "add": { "unique": "buoysArne", "paid": 10 }, "as": "buoys" },
                { "coin": -10, "why": "Bought {buoys.name|lower} from {mick.name}" }
              ]
            },
            { "label": "\"Keep your feud out of my shop.\"" }
          ]
        },
        { "find": "held", "in": "stock", "match": { "uniqueId": ["buoysMick", "buoysArne"] }, "all": true },
        {
          "if": "held.count",
          "then": [
            { "say": "mick", "text": "Tess Bascombe hears trap disputes at the harbormaster's shack. Midday. I'll tell her you're holding the evidence. Arne will come. Arne always comes." },
            { "plan": "cutlines-shack" },
            { "toast": "Calendar: the harbormaster's shack, at lunch", "look": "mick" }
          ]
        },
        { "leave": "mick" }
      ]
    },
    "cutShack": {
      "title": "The trap-line hearing at the harbormaster's shack",
      "steps": [
        {
          "stage": "harbormaster",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 164] },
            { "id": "arne", "cast": "arneSorensen", "at": [140, 162] },
            { "id": "mick", "cast": "mickDoherty", "at": [250, 162], "facingLeft": true },
            { "id": "tess", "cast": "tess", "at": [196, 158] }
          ]
        },
        { "narrate": "The harbormaster's shack at noon. Two lobstermen in orange bib pants, standing as far apart as one room allows. Tess has a mug in each hand and isn't sharing." },
        { "say": "arne", "text": "He cut them." },
        { "say": "mick", "text": "HE cut them." },
        { "find": "held", "in": "stock", "match": { "uniqueId": ["buoysMick", "buoysArne"] }, "all": true },
        { "find": "green", "in": "stock", "match": { "uniqueId": "buoysMick" } },
        { "find": "red", "in": "stock", "match": { "uniqueId": "buoysArne" } },
        {
          "narrate": { "if": "held.count > 1", "then": "You set both sets on Tess's desk. She turns the cut ends to the window and reads them like a tide table.", "else": "You set the buoys on Tess's desk. She turns the cut ends to the window and reads them like a tide table." },
          "if": "held.count"
        },
        {
          "say": "tess",
          "text": [
            "Same height. Same angle. Same morning. That's not a knife, gentlemen. That's a propeller.",
            "The ferry's had a relief captain all month, cutting the corner by the breakwater beacon to save four minutes. I'll have a word."
          ]
        },
        {
          "choose": [
            { "label": "Hand each man back his own buoys", "disabled": "!held.count" },
            { "label": "Make them swap: each takes the other's back to him", "disabled": "held.count != 2" },
            {
              "label": "Sell the lot to the Clam Shack for the wall",
              "hint": { "if": "held.count == 2", "then": "(+$45)", "else": "(+$20)" },
              "disabled": "!held.count"
            }
          ],
          "as": "pick"
        },
        { "take": "green" },
        { "take": "red" },
        { "refresh": "panel" },
        {
          "if": "pick == 0",
          "then": [
            { "set": { "cutEnd": "shook" } },
            { "rep": 3 },
            { "say": "mick", "text": "...A propeller." },
            { "say": "arne", "text": "Well. Forty traps. Of mine. And how many of yours?" },
            { "narrate": "They shake hands as if it hurts. Tess drinks both coffees." }
          ]
        },
        {
          "if": "pick == 1",
          "then": [
            { "set": { "cutEnd": "feud" } },
            { "say": "arne", "text": "I'll carry his, then. Since I'm the bigger man." },
            { "say": "mick", "text": "You are the bigger man, Arne. It's the chowder." },
            { "narrate": "They leave by the same door, still at it. It might be the happiest either of them has been all year." }
          ]
        },
        {
          "if": "pick == 2",
          "then": [
            { "set": { "cutEnd": "wall" } },
            { "coin": 45, "why": "Sold painted buoys to the Clam Shack", "if": "held.count == 2" },
            { "coin": 20, "why": "Sold painted buoys to the Clam Shack", "if": "held.count != 2" },
            { "narrate": "The Clam Shack hangs them over the take-out window by Friday. Arne and Mick each eat there twice to glare at the other man's colours." }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-2", "cast": "arneSorensen", "scene": "arneBuoys" },
    { "at": "2-3", "cast": "mickDoherty", "scene": "mickBuoys", "if": "flag.cutHeard" }
  ],
  "errands": [
    {
      "id": "cutlines-shack",
      "title": "The trap-line hearing",
      "where": "the harbormaster's shack",
      "scene": "cutShack",
      "test": [{ "add": { "unique": "buoysMick" } }, { "add": { "unique": "buoysArne" } }]
    }
  ],
  "calendar": [
    { "id": "cutlines-shack", "errand": "cutlines-shack", "story": "cutlines", "where": "The harbormaster's shack", "title": "The trap-line hearing" }
  ],
  "mornings": [
    {
      "if": "!flag.cutEnd && errand.cutlines-shack == -1",
      "note": "If you stay open instead, the buoys stop being evidence and are just buoys.",
      "then": [
        { "set": { "cutEnd": "lapsed" } },
        { "find": "green", "in": "stock", "match": { "uniqueId": "buoysMick" } },
        { "find": "red", "in": "stock", "match": { "uniqueId": "buoysArne" } },
        { "edit": "green", "set": { "questKey": false, "nosale": false } },
        { "edit": "red", "set": { "questKey": false, "nosale": false } },
        { "refresh": "panel", "if": "green || red" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Arne Sorensen and Mick Doherty now share a bait order. They still don't speak, but they share it.", "if": "flag.cutEnd == 'shook'" },
    { "line": "Two sets of painted buoys hang over the Clam Shack window. Tourists photograph them. Lobstermen don't.", "if": "flag.cutEnd == 'wall'" }
  ],
  "talk": {
    "by": "dory",
    "rumour": [
      "Somebody's cutting trap lines off the breakwater. Two lobstermen, one patch of water, and a feud older than my freezer."
    ],
    "react": { "shook": "The two of them shook hands on Tess's steps. I've never seen either of them shake anything but a fist.", "feud": "They're still cutting each other's lines. Tess says she's putting a buoy in the middle with a sign on it.", "wall": "One of their traps is on a restaurant wall in Boston now. As art. Imagine." },
    "sway": { "shook": { "dory": 2, "tess": 1 }, "wall": { "dory": -1 } }
  },
  "outcome": [
    { "if": "flag.cutEnd == 'shook'", "ending": "shook" },
    { "if": "flag.cutEnd == 'feud'", "ending": "feud" },
    { "if": "flag.cutEnd == 'wall'", "ending": "wall" }
  ]
});
