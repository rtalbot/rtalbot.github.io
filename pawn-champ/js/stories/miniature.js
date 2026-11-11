// Pawn Champ - Main Street in Miniature. Major quest M26, batch G (docs/quests/MAJOR.md#m26-main-street-in-miniature).
// Cornelius Webb spent twenty years building Main Street at one-to-forty-eight. His grandson pawns
// it. The model disagrees with the real street in three places, and the three add up to a deed.
//
// Hook (W1 Thu)             Toby Webb sells you the model. It fills the back room.
// Middle (W2 Mon)           Hester Quint wants it for the Athenaeum. "Cornelius was never wrong."
// Scene 1 (W2 Tue-Thu)      the model at night, at model height: three differences and a key.
// Scene 2 (W3 Mon-Wed)      the Athenaeum after hours: the 1952 town minutes and the alley.
// Finale (W3 Thu-W4 Thu)    the model again: the tiny Crooked Scale opens. What becomes of it.
// Crossing: The Old Home Week Spoons (M10): the model shows the 1904 cornerstone, and where.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "miniature",
  "kind": "major",
  "colour": "#a87444",
  "family": "town",
  "title": "Main Street in Miniature",
  "crosses": ["spoons"],
  "rumour": "Old Cornelius Webb built the whole of Main Street in his attic. His grandson's clearing it out.",
  "endings": { "athenaeum": "On Display", "collector": "Sold to Connecticut", "window": "In the Window" },
  "icons": {
    "model": [
      "............",
      "............",
      ".kkk..kkkk..",
      ".kWk.kkWWk..",
      "kWWWkkWWWWk.",
      "kWbWkkWbbWkk",
      "kWWWkkWWWWkW",
      "kWbWkkWbbWkW",
      "kWWWkkWWWWkW",
      "kkkkkkkkkkkk",
      "kwwwwwwwwwwk",
      ".k........k."
    ],
    "tinykey": [
      "............",
      "............",
      "....kk......",
      "...kYYk.....",
      "...kY.k.....",
      "...kYYk.....",
      "....kYk.....",
      "....kYk.....",
      "....kYYk....",
      "....kYk.....",
      "....kYYk....",
      "....kk......"
    ]
  },
  "about": [
    "A gentle mystery in a model. Toby Webb sells his grandfather's attic model of Main Street, built 1932 to 1952, the size of a pool table (§{tobyModel}). Hester Quint of the Athenaeum has wanted it since she was nine (§{hesterModel}). She'll buy it now for $120, which ends the story, or tell you there are three places where the model disagrees with the real street.",
    "Get down to its height in the dark (§{miniModel}) and shine a light on each (§{miniLook}): a back door bricked up in the alley wall, the sign over Cornelius's own hardware store changed to his wife's maiden name, and a tiny figure in an upstairs window that's there only when you look back. Taped under the table is a brass key the size of a fingernail. If Spoons is in the run, the model also shows which corner of the Grange steps holds the 1904 cornerstone.",
    "At the Athenaeum Hester reads the 1952 minutes (§{miniDeeds}): the town took Cornelius's alley for a car park, his store went under, and the question of who owned the alley was never settled. His notebook shows a strongbox inside the model of your own shop. Opening it (§{miniOpen}) finds his deed giving the alley to whoever keeps the shop. Then you decide on the model: the Athenaeum (On Display), a collector in Connecticut for $260 (Sold to Connecticut), or your own window (In the Window)."
  ],
  "cast": {
    "toby": {
      "name": "Toby Webb",
      "look": { "skin": "#f0d0b8", "hair": "#c8a060", "hs": 1, "coat": "#5a6a8a", "style": "hoodie", "trim": "#e8e4dc", "pants": "#3a3a42", "glasses": "#2a2a2e" }
    }
  },
  "uniques": {
    "mainModel": {
      "name": "Main Street, 1:48 (C. Webb, 1952)",
      "icon": "model",
      "cat": "curio",
      "guide": 150,
      "condLabel": "Twenty years of evenings",
      "questKey": true,
      "tells": [
        "Every clapboard of Main Street in 1952, to scale. The lamps are wired and still light.",
        { "text": "The model Crooked Scale has tiny goods in its window. A tiny gold ring, a tiny brass compass, a tiny vase.", "cls": "good" }
      ]
    },
    "tinyKey": {
      "name": "A tiny brass key",
      "icon": "tinykey",
      "cat": "curio",
      "guide": 0,
      "condLabel": "Smaller than a fingernail",
      "questKey": true,
      "tells": ["Taped under the model's table with a strip of 1952 Scotch tape. Stamped C.W."]
    }
  },
  "scenes": {
    "tobyModel": {
      "title": "Toby Webb sells his grandfather's Main Street",
      "customer": "toby",
      "steps": [
        {
          "say": "toby",
          "text": [
            "Toby Webb. My grandfather built Main Street. Not the real one. A model, in his attic, from 1932 to 1952. The house is sold and the model has to go by Friday.",
            "It's in the van. It's about the size of a pool table. I'll help you carry it. Eighty?"
          ]
        },
        { "offer": { "unique": "mainModel" }, "persona": "honest", "asking": 80, "min": 50 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "miniOut": true } },
            { "say": "toby", "text": "The tip, then. He'd have hated that." },
            { "leave": "toby" },
            { "end": true }
          ]
        },
        { "set": { "miniIn": true } },
        { "narrate": "It takes the two of you twenty minutes and one door frame to get it into the back room on its trestles. Toby plugs it in. Main Street lights up, all of it, in 1952." },
        { "say": "toby", "text": "He used to say the model was more accurate than the street. I never knew what that meant either." },
        { "leave": "toby" }
      ]
    },
    "hesterModel": {
      "title": "Hester Quint has wanted it since she was nine",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "Hester Quint, the Athenaeum. You have Cornelius Webb's Main Street. I have wanted that model since I was nine years old.",
            "He photographed every building, measured every window. The Historical Society uses his photographs. Cornelius was never wrong.",
            "Which is why I lie awake about the three places where his model disagrees with the street. There are three. I counted them in 1979."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell it to Hester now",
              "hint": "(+$120; the story ends here)",
              "then": [
                { "find": "model", "in": "stock", "match": { "uniqueId": "mainModel" } },
                { "take": "model" },
                { "coin": 120, "why": "Sold the Main Street model to the Athenaeum" },
                { "rep": 3 },
                { "set": { "miniEnd": "athenaeum", "miniDone": true } },
                { "say": "hester", "text": "Thank you. I'll find the three myself. I have time. I'm a librarian." },
                { "leave": "hester" },
                { "end": true }
              ]
            },
            { "label": "\"Which three?\"" }
          ]
        },
        { "say": "hester", "text": "I won't tell you. You'll see them better yourself. Turn the lights off in your back room some night, get down to its height, and look." },
        { "set": { "miniLook": true } },
        { "toast": "Calendar: a night in the back room with the model", "look": "hester" },
        { "leave": "hester" }
      ]
    },
    "miniModel": {
      "title": "Main Street at model height",
      "steps": [
        {
          "hook": "torch",
          "with": [320, 200],
          "note": "where the flashlight points on the model (js/places/miniature.js)"
        },
        { "hook": "lookStart" },
        {
          "stage": "miniature",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [150, 170] }]
        },
        { "narrate": "The back room, lights off, your chin on the edge of the table. Main Street in 1952, lit by its own little lamps. From down here you are enormous." },
        { "run": "miniLook" },
        { "run": "miniLook" },
        { "run": "miniLook" },
        { "hook": "torch", "with": [320, 200] },
        {
          "narrate": [
            "Three things, and all of them about the alley behind the shops. Your shop's alley.",
            "Feeling under the table edge for the light switch, your fingers find something taped there. A brass key smaller than your fingernail, stamped C.W."
          ]
        },
        { "add": { "unique": "tinyKey" } },
        { "refresh": "panel" },
        { "narrate": "One more thing: the model has a tiny cornerstone set into the Grange Hall's steps, carved 1904. Somebody looking for Old Home Week spoons would want to know which corner.", "if": "quest.spoons" },
        { "set": { "miniKey": true } },
        { "toast": "Calendar: the Athenaeum, after hours, with Hester", "icon": "tinykey" }
      ]
    },
    "miniLook": {
      "title": "Shine the light on one of the three",
      "steps": [
        {
          "choose": [
            {
              "label": "Shine the light on the alley wall",
              "if": "!hook.sawDoor",
              "then": [
                { "hook": "shine", "with": "door" },
                { "narrate": "In the alley wall, where the real street has a back door, the model has the door bricked up, in different bricks. Cornelius glued them in one at a time." }
              ]
            },
            {
              "label": "Shine the light on the red building's sign",
              "if": "!hook.sawSign",
              "then": [
                { "hook": "shine", "with": "sign" },
                { "narrate": "The red building. On the real street in 1952 it was Webb & Son, Cornelius's own hardware store. On the model the sign says MERRILLS." }
              ]
            },
            {
              "label": "Shine the light on the upstairs window over merrills",
              "if": "!hook.sawWindow",
              "then": [
                { "hook": "shine", "with": "window" },
                { "narrate": "In the upstairs window over MERRILLS, a tiny figure is looking down at the alley. You look away, and when you look back it isn't there. Then it is." }
              ]
            }
          ],
          "note": "played three times from miniModel: each time, one of the three you haven't looked at yet"
        }
      ]
    },
    "miniDeeds": {
      "title": "The 1952 minutes at the Athenaeum",
      "steps": [
        {
          "stage": "athenaeum",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "hester", "cast": "hester", "at": [200, 162], "facingLeft": true }
          ]
        },
        { "narrate": "The Athenaeum after closing. Hester has the 1952 town minutes out on the long table under a green lamp, and white cotton gloves on." },
        {
          "say": "hester",
          "text": [
            "The bricked door. The wrong sign. The man at the window. You saw them too. Good. Now listen.",
            "In 1952 the selectmen voted to take the alley behind Main Street for a car park. The alley belonged to Cornelius Webb. His hardware store went under that same spring.",
            "And Merrill was his wife's name before she married him. He put her name over the shop he lost. I always thought that was the saddest thing on the model. Now I think it was a signature.",
            "The minutes say \"ownership of the alley to be resolved\". It never was. Nobody has owned that alley, on paper, for seventy years."
          ]
        },
        { "narrate": "Cornelius's notebook, which came with the model, has a drawing of the model Crooked Scale with its front lifted off. Inside, a tiny counter and a tiny strongbox. In the margin: \"For whoever keeps the shop.\"" },
        { "say": "hester", "text": "He gave the model the answer, and the town the question. Open it. I'd like to be there. I'd like to be there very much." },
        { "set": { "miniDeeds": true } },
        { "toast": "Calendar: open the model Crooked Scale", "look": "hester" }
      ]
    },
    "miniOpen": {
      "title": "The tiny strongbox",
      "steps": [
        { "hook": "torch", "with": [176, 190] },
        {
          "stage": "miniature",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [130, 170] },
            { "id": "hester", "cast": "hester", "at": [200, 168], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "The back room, late. Hester holds the flashlight steady with both hands. You lift the front off the model Crooked Scale with a butter knife.",
            "A tiny counter, a tiny ledger, a tiny strongbox. The brass key turns. Inside, folded to the size of a stamp, is a deed in Cornelius Webb's hand: the alley behind Main Street, \"to whoever keeps the shop at 9 Main Street, so long as there is one\"."
          ]
        },
        { "say": "hester", "text": "He gave it to the shop, not to a person. So the town could never buy it off anybody. That old fox." },
        { "find": "key", "in": "stock", "match": { "uniqueId": "tinyKey" } },
        { "take": "key" },
        { "set": { "miniAlley": true } },
        { "rep": 3, "why": "Found Cornelius Webb's deed to the alley" },
        { "say": "hester", "text": "I'll file it with the town clerk in the morning. And the model... it's yours. What will you do with it?" },
        {
          "choose": [
            {
              "label": "Give it to the Athenaeum",
              "hint": "(Hester pays $60; rep +8)",
              "then": [
                { "find": "model", "in": "stock", "match": { "uniqueId": "mainModel" } },
                { "take": "model" },
                { "coin": 60, "why": "The Athenaeum bought the model" },
                { "rep": 8 },
                { "say": "hester", "text": "In the front hall, under glass, with the lamps on. And a little plaque. With your name on it, if you'll let me." },
                { "set": { "miniEnd": "athenaeum" } }
              ]
            },
            {
              "label": "Sell it to the model-railway collector from Connecticut",
              "hint": "(+$260)",
              "then": [
                { "find": "model", "in": "stock", "match": { "uniqueId": "mainModel" } },
                { "take": "model" },
                { "coin": 260, "why": "Sold the model to a collector from Connecticut" },
                { "say": "hester", "text": "Connecticut. Well. At least they'll keep the lamps on." },
                { "set": { "miniEnd": "collector" } }
              ]
            },
            {
              "label": "Put it in the shop window",
              "hint": "(rep +4; people stop to look)",
              "then": [
                { "find": "model", "in": "stock", "match": { "uniqueId": "mainModel" } },
                { "edit": "model", "set": { "questKey": true, "nosale": true } },
                { "rep": 4, "why": "Put Main Street in the window" },
                { "say": "hester", "text": "In the window. Main Street, looking at Main Street. Cornelius would have liked that more than a plaque." },
                { "set": { "miniEnd": "window" } }
              ]
            }
          ]
        },
        { "refresh": "panel" },
        { "set": { "miniDone": true } }
      ]
    }
  },
  "beats": [
    { "at": "1-4", "cast": "toby", "scene": "tobyModel" },
    { "at": "2-1", "cast": "hester", "scene": "hesterModel", "if": "flag.miniIn && !flag.miniDone && hook.modelHere" }
  ],
  "nights": [
    {
      "id": "mini-model",
      "window": ["2-2", "2-4"],
      "if": "flag.miniLook && !flag.miniDone && hook.modelHere",
      "scene": "miniModel",
      "test": [{ "set": { "miniLook": true } }, { "add": { "unique": "mainModel" } }]
    },
    {
      "id": "mini-deeds",
      "window": ["3-1", "3-3"],
      "if": "flag.miniKey && !flag.miniDone",
      "scene": "miniDeeds",
      "test": [{ "set": { "miniKey": true } }]
    },
    {
      "id": "mini-open",
      "window": ["3-4", "4-4"],
      "if": "flag.miniDeeds && !flag.miniDone && hook.modelHere",
      "scene": "miniOpen",
      "test": [
        { "set": { "miniDeeds": true } },
        { "add": { "unique": "mainModel" } },
        { "add": { "unique": "tinyKey" } }
      ]
    }
  ],
  "calendar": [
    { "id": "mini-model", "night": "mini-model", "story": "miniature", "where": "Your back room", "title": "Main Street at model height", "known": "flag.miniLook", "scene": "miniModel" },
    { "id": "mini-deeds", "night": "mini-deeds", "story": "miniature", "where": "The Athenaeum", "title": "The 1952 minutes", "known": "flag.miniKey", "scene": "miniDeeds" },
    { "id": "mini-open", "night": "mini-open", "story": "miniature", "where": "Your back room", "title": "The tiny strongbox", "known": "flag.miniDeeds", "scene": "miniOpen" }
  ],
  "epilogue": [
    { "line": "Cornelius Webb's Main Street stands in the Athenaeum's front hall with its lamps on. Hester Quint dusts it herself, on Tuesdays.", "if": "flag.miniEnd == 'athenaeum'" },
    { "line": "Main Street, 1952, now runs a model railway through it in a basement in Connecticut. The collector sends photographs. The trains are on time.", "if": "flag.miniEnd == 'collector'" },
    { "line": "Main Street sits in your window, looking at Main Street. Children press their noses to the glass to find the tiny Crooked Scale inside it.", "if": "flag.miniEnd == 'window'" },
    { "line": "The alley behind the shop is yours, on paper, for the first time in seventy years. You put out a bench.", "if": "flag.miniAlley" }
  ],
  "outcome": "flag.miniEnd"
});
