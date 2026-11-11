// Pawn Champ - The Vanishing Box. Minor quest m8, batch A (docs/quests/MINOR.md#m8-the-vanishing-box).
// A ninety-year-old magician pawns a box that makes things disappear. There is no trick.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/vanishing.js,
// which also keeps the Magician's Box (an item on a police notice spends the night inside it).
defineStory({
  "id": "vanishing",
  "kind": "minor",
  "title": "The Vanishing Box",
  "location": "saintbrines",
  "rumour": "The Great Ambrose is doing a show at Saint Brine's. He's ninety.",
  "endings": { "tada": "Ta-da", "nosuch": "No Such Thing", "box": "Magician's Box" },
  "about": [
    "A small magical story. The Great Ambrose, a ninety-year-old stage magician, pawns his lacquered vanishing box for $30 to buy doves for a children's show at Saint Brine's, and warns you not to put anything small near it (§{vanishAmbrose}). Something small from your shelves goes missing.",
    "At the show (§{vanishShow}) the box makes a coin vanish, and every child, Dulcie first, finds things in their pockets, including the missing item from your shop. Ambrose quietly admits it has always done this and he doesn't know how. Help him finish the show and let the children keep their finds (Ta-da), tell the children there's no trick, so he retires and leaves you the box (No Such Thing), or buy the box, which once a run can hide one item named on a police notice from a raid (Magician's Box)."
  ],
  "notes": "Dulcie is The Saint Brine's Benefit's character (js/quests/benefit.js).",
  "cast": {
    "ambrose": {
      "name": "The Great Ambrose",
      "look": { "skin": "#f0d8c8", "hair": "#f0f0f0", "hs": 0, "coat": "#2a1a3a", "trim": "#c8a050", "style": "suit", "long": true, "pants": "#1a1a22", "moustache": "#f0f0f0", "hat": "top", "hatc": "#1a1a22", "band": "#7a1e3a" }
    }
  },
  "uniques": {
    "vanishBox": {
      "name": "Lacquered vanishing box",
      "icon": "lacquerbox",
      "cat": "curio",
      "guide": 80,
      "questKey": true,
      "tells": ["Black lacquer, gold dragons, brass hinges. No false bottom, no mirrors. You checked twice."]
    }
  },
  "overheard": [
    { "line": "To nobody: \"The Great Ambrose is doing a show at Saint Brine's. He's ninety. He did my birthday in 1979.\"" }
  ],
  "scenes": {
    "vanishAmbrose": {
      "title": "The Great Ambrose pawns his box",
      "customer": "ambrose",
      "steps": [
        {
          "say": "ambrose",
          "text": [
            "The Great Ambrose! Ninety years young, sixty of them on the stage. Mostly the Catskills.",
            "I'm doing a show for the children at Saint Brine's. But I'm thirty dollars short for doves. Pigeons, really. Would you hold my box until the show? It's the best thing I own."
          ]
        },
        { "view": { "counterIcon": "lacquerbox" } },
        {
          "choose": [
            { "label": "Lend him $30 on the box", "disabled": "coin < 30" },
            { "label": "\"I don't take magic boxes, Mr. Ambrose.\"" }
          ],
          "as": "lend"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "lend == 1",
          "then": [
            { "say": "ambrose", "text": "Nobody does, anymore. Good day!" },
            { "leave": "ambrose" },
            { "end": true }
          ]
        },
        { "coin": -30, "why": "Lent The Great Ambrose $30 on his box" },
        { "add": { "unique": "vanishBox", "paid": 30 } },
        { "set": { "vanishKnown": true } },
        { "plan": "vanishing-show" },
        { "say": "ambrose", "text": "Splendid! The show is at Saint Brine's, {when:vanishing-show|or:this week} at noon. Bring the box. Don't open it. Don't put anything small near it." },
        { "toast": "Calendar: The Great Ambrose, Saint Brine's, {when:vanishing-show} at noon", "look": "ambrose", "if": "errand.vanishing-show" },
        { "leave": "ambrose" },
        { "hook": "vanishSmall", "with": "The {it.name|lower} on your shelf is gone. You didn't see anyone take it.", "note": "Something small (guide $60 or less) goes missing from the shelves, at random." }
      ]
    },
    "vanishShow": {
      "title": "The Great Ambrose at Saint Brine's",
      "steps": [
        {
          "stage": "saintbrines",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [70, 166] },
            { "id": "ambrose", "cast": "ambrose", "at": [170, 160] },
            { "id": "dulcie", "cast": "dulcie", "at": [230, 168], "facingLeft": true }
          ]
        },
        { "narrate": "Saint Brine's hall at noon. Twenty children on the rug, and The Great Ambrose in a cape that has seen things." },
        { "say": "ambrose", "text": "For my first trick: a coin, into the box. And... gone! And now, young lady, check your pocket." },
        {
          "say": "dulcie",
          "text": { "if": "flag.vanishTaken", "then": "There's a {flag.vanishTaken.name|lower} in my pocket. Is it mine now?", "else": "There's a coin in my pocket! And a button. And a key. Whose key is this?" }
        },
        {
          "narrate": { "if": "flag.vanishTaken", "then": "Every child is pulling something out of their pockets. You recognise most of it: it's from your shelves, starting with the {flag.vanishTaken.name|lower}.", "else": "Every child is pulling small things out of their pockets. Ambrose looks more surprised than anyone." }
        },
        { "say": "ambrose", "text": "(quietly) It does this. It's always done this. I don't know how. Please don't tell them." },
        { "find": "box", "in": "stock", "match": { "uniqueId": "vanishBox" } },
        {
          "choose": [
            {
              "label": "Help him finish the show",
              "then": [
                { "set": { "vanishEnd": "tada" } },
                { "rep": 5, "why": "Helped The Great Ambrose finish his show" },
                {
                  "if": "box",
                  "then": [{ "take": "box" }, { "coin": 30, "why": "The Great Ambrose paid back his loan" }]
                },
                { "narrate": "You play the stooge. Ambrose makes your watch vanish and Father Ignatius's glasses appear on a girl in the front row. The children keep whatever they found in their pockets. Ta-da." }
              ]
            },
            {
              "label": "Tell the children there's no trick",
              "then": [
                { "set": { "vanishEnd": "nosuch" } },
                { "narrate": "You tell them there's no trick. They don't understand, and then they do, and the hall goes quiet." },
                { "say": "ambrose", "text": "Sixty years, and nobody ever said it out loud. Keep the box. I'm retiring. I was going to anyway." },
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                {
                  "if": "flag.vanishTaken.item",
                  "then": [
                    { "hook": "giveBack" },
                    { "toast": "Dulcie gives you back the {flag.vanishTaken.name|lower}.", "look": "dulcie" }
                  ]
                }
              ]
            },
            {
              "label": "Buy the box outright",
              "hint": "(+$30 to Ambrose)",
              "disabled": "coin < 30 || !box",
              "then": [
                { "set": { "vanishEnd": "box" } },
                { "coin": -30, "why": "Bought The Great Ambrose's vanishing box" },
                {
                  "edit": "box",
                  "set": {
                    "questKey": false,
                    "nosale": false,
                    "paid": 60,
                    "effect": { "vanish": 1 },
                    "effectText": "Once a run, hides one item on a police notice from a raid"
                  }
                },
                { "say": "ambrose", "text": "Sold. Treat it kindly. Feed it nothing valuable." },
                {
                  "if": "flag.vanishTaken.item",
                  "then": [
                    { "hook": "giveBack", "with": "The {flag.vanishTaken.name|lower} comes back to you from a small boy's pocket." }
                  ]
                }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [{ "at": "3-3", "cast": "ambrose", "scene": "vanishAmbrose" }],
  "errands": [
    {
      "id": "vanishing-show",
      "title": "The Great Ambrose",
      "where": "Saint Brine's",
      "scene": "vanishShow",
      "test": [{ "add": { "unique": "vanishBox" } }, { "hook": "testTaken" }]
    }
  ],
  "calendar": [
    { "id": "vanishing-show", "errand": "vanishing-show", "story": "vanishing", "where": "Saint Brine's", "title": "The Great Ambrose", "known": "flag.vanishKnown", "scene": "vanishShow" }
  ],
  "mornings": [
    { "hook": "unhide", "if": "flag.vanishHidden", "with": "The {it.name|lower} is back on the shelf. Whatever was engraved on it isn't.", "note": "The Magician's Box gives back what it hid overnight, with its police tag gone." }
  ],
  "epilogue": [
    { "line": "The Great Ambrose did three more shows at Saint Brine's before he retired. Things still turn up in the children's pockets.", "if": "flag.vanishEnd == 'tada'" },
    { "line": "The Great Ambrose retired to Florida. The lacquered box is in your back room. You don't put keys near it.", "if": "flag.vanishEnd == 'nosuch'" },
    { "line": "The lacquered box sits under the till. Sometimes, at closing, it's warm.", "if": "flag.vanishEnd == 'box'" }
  ],
  "outcome": "flag.vanishEnd"
});
