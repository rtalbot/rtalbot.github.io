// Pawn Champ - The Recipe Box: a dead woman's recipe box, three grown children, and the chowder card
// all three of them want. Minor quest m29, batch G (docs/quests/MINOR.md).
// Bridget pawns the box; Osgood tries to buy the card on the quiet; a lunch errand at the kitchen.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/recipebox.js.
defineStory({
  "id": "recipebox",
  "kind": "minor",
  "title": "The Recipe Box",
  "location": "kitchen",
  "rumour": "Loretta Cobb's three children have stopped speaking over a recipe card.",
  "endings": { "dots": "Two Quarts from Dot's", "copies": "Three Copies", "sold": "Highest Bidder" },
  "about": [
    "A comedy about a family secret. Loretta Cobb's chowder won the Harvest Fair eleven years running, and her three children have stopped speaking over who gets the recipe. Bridget pawns the recipe box so none of them has it, and asks you to bring it to their mother's kitchen to open the envelope in front of a witness (§{bridgetBox}). Her brother Osgood offers you $40 for just the chowder card (§{osgoodCard}); if you sell it, he won't say what it said (Highest Bidder).",
    "In the kitchen (§{recipeKitchen}) the card reads: two quarts from Dot's, into my pot, add pepper so it looks like effort, say nothing. Read it out and all three laugh until they cry (Two Quarts from Dot's), copy it out three times so they each think they have the secret (Three Copies), or auction the card to the highest Cobb (Highest Bidder)."
  ],
  "cast": {
    "bridget": {
      "name": "Bridget Cobb",
      "look": { "skin": "#e8c0a0", "hair": "#8a4a2a", "hs": 3, "coat": "#4a6a8a", "style": "puffer", "pants": "#3a3a42", "bag": "#8a6a4a" }
    },
    "osgood": {
      "name": "Osgood Cobb",
      "look": { "skin": "#e8c0a0", "hair": "#8a4a2a", "hs": 0, "coat": "#6a5a3a", "style": "vest", "vest": "#8a2a2a", "pants": "#4a4a40", "beard": "#8a4a2a" }
    },
    "faye": {
      "name": "Faye Cobb",
      "look": { "skin": "#e8c0a0", "hair": "#8a4a2a", "hs": 5, "coat": "#3a7a5a", "style": "hoodie", "pants": "#2a3a4a", "glasses": "#2a2a2e" }
    }
  },
  "uniques": {
    "recipeBox": {
      "name": "Loretta Cobb's recipe box",
      "icon": "writebox",
      "cat": "curio",
      "guide": 25,
      "questKey": true,
      "tells": [
        "A tin box painted with strawberries, rusted at the hinge. Two hundred cards in a careful hand, with gravy on most of them.",
        "One card is in an envelope, sealed with tape: CHOWDER. DO NOT OPEN UNTIL I'M GONE. Underneath, later, in pencil: \"Well, go on then.\""
      ]
    }
  },
  "scenes": {
    "bridgetBox": {
      "title": "Bridget Cobb pawns her mother's recipe box",
      "customer": "bridget",
      "steps": [
        {
          "say": "bridget",
          "text": [
            "Bridget Cobb. My mother was Loretta Cobb, of the Cobb chowder, which won the Harvest Fair eleven years running and which none of us knows how to make.",
            "The recipe's in this box. My brother wants it, my sister wants it, I want it. So none of us gets it until we sort it out. I'd rather you held it than either of them."
          ]
        },
        { "offer": { "unique": "recipeBox" }, "persona": "honest", "asking": 25, "min": 18 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "recipeHeld": true } },
            { "say": "bridget", "text": "We're clearing Mum's kitchen on Front Street. Come at lunch with the box and we'll open the envelope with a witness. Don't let Osgood sweet-talk you. He sells insurance." },
            { "plan": "recipe-kitchen", "after": 2 },
            { "toast": "Calendar: Loretta Cobb's kitchen, at lunch", "look": "bridget" }
          ],
          "else": [
            { "say": "bridget", "text": "Then it lives in my glovebox, and we'll all die not knowing." }
          ]
        },
        { "leave": "bridget" }
      ]
    },
    "osgoodCard": {
      "title": "Osgood Cobb wants just the chowder card",
      "customer": "osgood",
      "steps": [
        { "say": "osgood", "text": "Osgood Cobb. You've got Mum's box. I don't want the box. Just the chowder card. Forty dollars, cash, and the box goes back to Bridget looking exactly the same. Minus one envelope." },
        {
          "choose": [
            {
              "label": "Sell him the chowder card",
              "hint": "(+$40)",
              "then": [
                { "set": { "recipeOsgood": true } },
                { "coin": 40, "why": "Sold Osgood Cobb his mother's chowder card" },
                { "rep": -1 },
                { "narrate": "He opens the envelope in your doorway, reads the card, and goes very quiet. Then he puts it in his inside pocket and walks out without a word." },
                { "leave": "osgood", "hurry": true },
                { "end": true }
              ]
            },
            {
              "label": "\"Lunch, with your sisters, Mr. Cobb.\"",
              "then": [
                { "say": "osgood", "text": "Fine. Fine. You'll see. They'll make it a whole thing. It's always a whole thing." }
              ]
            }
          ]
        },
        { "leave": "osgood" }
      ]
    },
    "recipeKitchen": {
      "title": "Opening the chowder card",
      "steps": [
        {
          "stage": "kitchen",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "bridget", "cast": "bridget", "at": [176, 162], "facingLeft": true },
            { "id": "osgood", "cast": "osgood", "at": [206, 160], "facingLeft": true },
            { "id": "faye", "cast": "faye", "at": [236, 162], "facingLeft": true }
          ]
        },
        { "find": "box", "in": "stock", "match": { "uniqueId": "recipeBox" } },
        { "narrate": "Loretta Cobb's kitchen, half in boxes. A huge dented chowder pot on the stove that nobody can bring themselves to wrap. Three Cobbs, standing as far apart as a small kitchen allows." },
        { "take": "box" },
        { "refresh": "panel", "if": "box" },
        {
          "if": "flag.recipeOsgood",
          "then": [
            { "say": "faye", "text": "The envelope's gone. OSGOOD." },
            { "say": "osgood", "text": "You don't want to know. Trust me. You do not want to know." },
            { "narrate": "He won't say any more. Bridget takes the box. Faye takes the pot. Osgood takes the card to his grave, or at least to his car." },
            { "set": { "recipeEnd": "sold" } },
            { "end": true }
          ]
        },
        { "say": "bridget", "text": "Go on. You open it. You're neutral." },
        { "narrate": "The card, in Loretta's careful hand: \"COBB CHOWDER. Two quarts from Dot's. Into my pot. Stir. Add pepper so it looks like effort. SAY NOTHING. Love, Mum.\"" },
        {
          "choose": [
            {
              "label": "Read it out",
              "then": [
                { "narrate": "There is a long silence. Then Faye laughs, and Bridget laughs, and Osgood sits down on a box of plates and laughs until he cries. Eleven Harvest Fairs. Two quarts from Dot's." },
                { "say": "osgood", "text": "We ate it every Christmas. We SERVED it at her FUNERAL." },
                { "say": "bridget", "text": "And Dot came. And had seconds. And never said a word." },
                { "set": { "recipeEnd": "dots" } },
                { "rep": 2 }
              ]
            },
            {
              "label": "Copy it out three times, and seal each one",
              "hint": "(they each think they have the secret)",
              "then": [
                { "narrate": "You copy it out three times at the kitchen table with your back to them, seal each one, and hand them over. They go to three different cars to read them. Nobody comes back in. Nobody ever brings it up again." },
                { "set": { "recipeEnd": "copies" } },
                { "rep": 1 }
              ]
            },
            {
              "label": "Auction the card to the highest Cobb",
              "hint": "(+$60)",
              "then": [
                { "narrate": "Bridget bids twenty. Faye bids forty. Osgood bids sixty and wins, opens it in the hall, and comes back with a face like a man who has paid sixty dollars for a shopping list." },
                { "coin": 60, "why": "Auctioned the Cobb chowder card" },
                { "set": { "recipeEnd": "sold" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "recipe-bridget", "from": "1-3", "to": "3-1", "cast": "bridget", "scene": "bridgetBox" },
    { "drift": "recipe-bridget", "from": "1-3", "to": "3-1", "offset": 1, "cast": "osgood", "scene": "osgoodCard", "if": "hook.boxHere && !flag.recipeEnd" }
  ],
  "errands": [
    {
      "id": "recipe-kitchen",
      "title": "Opening the chowder card",
      "where": "Loretta Cobb's kitchen on Front Street",
      "scene": "recipeKitchen",
      "test": [
        { "set": { "recipeHeld": true } },
        {
          "roll": { "recipeOsgood": [true, true, true, false, false, false, false, false, false, false] },
          "note": "Three times in ten, Osgood got to the card first."
        },
        { "add": { "unique": "recipeBox" } }
      ]
    }
  ],
  "calendar": [
    { "id": "recipe-kitchen", "errand": "recipe-kitchen", "story": "recipebox", "where": "A kitchen on Front Street", "title": "The chowder card", "known": "flag.recipeHeld" }
  ],
  "mornings": [
    {
      "find": "box",
      "in": "stock",
      "match": { "uniqueId": "recipeBox", "questKey": true },
      "note": "Skipped the errand: the box is just a box now."
    },
    {
      "if": "box && errand.recipe-kitchen == -1",
      "then": [{ "edit": "box", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "talk": {
    "by": "bettany",
    "rumour": [
      "The Cobb children were all in for rolls on the same morning. Not speaking. Over their mother's chowder recipe, of all things. I've never seen anyone fight over a soup."
    ],
    "react": { "dots": "The Cobbs were in together this morning, laughing. Something about Dot's. Dot went bright red at her window and shut it.", "copies": "All three Cobbs are making their mother's chowder now. Separately. All three taste exactly the same. Funny, that.", "sold": "Osgood Cobb has the chowder card. He won't make it, he won't show it, and he won't eat at Dot's. Funny, that." },
    "sway": { "dots": { "dot": 2, "bettany": 1 }, "copies": { "bettany": 1 }, "sold": { "dot": -2 } }
  },
  "outcome": "flag.recipeEnd"
});
