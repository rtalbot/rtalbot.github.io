// Pawn Champ - The Wrong Urn. Minor quest m37, batch J (docs/quests/MINOR.md).
// Heard from Father Ignatius. Russell Ashworth and Maureen Mayo each pawn an urn until the interment,
// and between them you work out that the funeral home handed each family the other's. A lunch errand
// at the Old Burying Ground by day, where the two plots are side by side.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: none.
defineStory({
  "id": "urn",
  "kind": "minor",
  "title": "The Wrong Urn",
  "location": "graveyard",
  "rumour": "Two funerals on the same day at Tobey's, and the new boy handed out the urns.",
  "endings": { "swap": "A Quiet Swap", "told": "Introductions", "silent": "Close Enough" },
  "about": [
    "A dark comedy. Father Ignatius is burying Walter Mayo and Dorothy Ashworth side by side on the same day, and their families haven't spoken since a fence dispute in 1979 (§{ignatiusUrns}). Russell Ashworth pawns his mother's urn to pay the stonemason (§{russellUrn}), and Maureen Mayo pawns her husband's to outdo the Ashworths' lilies (§{maureenUrn}). Set side by side on your shelf, the labels show the funeral home's new boy gave each family the wrong urn.",
    "At the interments (§{urnBurial}) swap them back without a word (A Quiet Swap), tell both families in front of everyone, which ends with them lunching together and arguing about the fence (Introductions), or hand them back as they came and let each be buried under the other's stone (Close Enough). The families redeem their urns either way (§{urnsRedeemed}), and if you miss the burial they collect them as they were."
  ],
  "notes": "Each urn is a $20 pawn. The families redeem them at $26 each, at the burial or, if you stayed open, at the counter.",
  "cast": {
    "russell": {
      "name": "Russell Ashworth",
      "look": { "skin": "#e8c0a0", "hair": "#5a4a3a", "hs": 0, "coat": "#3a3a42", "style": "suit", "trim": "#e8e8e0", "pants": "#2a2a30", "glasses": "#2a2a2e" }
    },
    "maureen": {
      "name": "Maureen Mayo",
      "look": { "skin": "#d8a888", "hair": "#e8e8e8", "hs": 3, "coat": "#4a5a3a", "trim": "#e8e0c8", "style": "dress", "long": true, "pants": "#2a2a2a", "bag": "#2a2a2a" }
    }
  },
  "icons": {
    "urn": [
      "....kkkk....",
      "...kyYYyk...",
      "....kkkk....",
      "...kyyyyk...",
      "..kyYYyyyk..",
      ".kyYyyyyyok.",
      ".kyYyyyyyok.",
      ".kyyyyyyyok.",
      "..kyyyyyok..",
      "...kkkkkk...",
      "..koooooook.",
      "..kkkkkkkk.."
    ]
  },
  "uniques": {
    "urnBronze": {
      "name": "Bronze urn (Ashworth)",
      "icon": "urn",
      "cat": "curio",
      "guide": 60,
      "questKey": true,
      "condLabel": "Occupied",
      "tells": [
        "A bronze urn, Tobey's best. The brass plate on the front says WALTER J. MAYO, 1931-2026.",
        "Russell Ashworth says it's his mother. He hasn't looked at the plate."
      ]
    },
    "urnPewter": {
      "name": "Pewter urn (Mayo)",
      "icon": "urn",
      "cat": "curio",
      "guide": 40,
      "questKey": true,
      "condLabel": "Occupied",
      "tells": [
        "A plain pewter urn with a wreath of ivy round the shoulder.",
        "Taped under the base, the crematorium's card: ASHWORTH, D. M."
      ]
    }
  },
  "overheard": [
    { "line": "\"Tobey's has a new boy on the front desk. Lovely manners. Can't read his own handwriting.\"" }
  ],
  "scenes": {
    "ignatiusUrns": {
      "title": "Father Ignatius has two burials on one day",
      "customer": "ignatius",
      "steps": [
        {
          "say": "ignatius",
          "text": [
            "I'm burying two of my parish on the same day this month, side by side in the Old Burying Ground. Walter Mayo and Dorothy Ashworth.",
            "Their families can't stand each other. Something about a fence in 1979. I've put the services an hour apart and I'm praying for no wind."
          ]
        },
        { "set": { "urnHeard": true } },
        { "leave": "ignatius" }
      ]
    },
    "russellUrn": {
      "title": "Russell Ashworth pawns his mother",
      "customer": "russell",
      "steps": [
        {
          "say": "russell",
          "text": [
            "Russell Ashworth. This is going to sound terrible. It's my mother. The urn, I mean. Tobey's best bronze, and I'm short for the stonemason.",
            "She'd have wanted me to. She pawned my bicycle twice. I'll have it back for the interment."
          ]
        },
        { "view": { "counterIcon": "urn" } },
        {
          "choose": [
            { "label": "Lend $20 on it, until the interment", "hint": "(a pawn)" },
            { "label": "\"I don't take urns.\"" }
          ],
          "as": "pawn"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "pawn == 1",
          "then": [{ "say": "russell", "text": "No. No, I suppose not. Forget I asked." }],
          "else": [
            { "add": { "unique": "urnBronze", "paid": 20 } },
            { "refresh": "panel" },
            { "coin": -20, "why": "Lent $20 to Russell Ashworth against an urn" }
          ]
        },
        {
          "if": "pawn == 0",
          "then": [
            { "set": { "urnRussell": true } },
            { "say": "russell", "text": "Don't put her in the window. She hated being looked at." }
          ]
        },
        { "leave": "russell" }
      ]
    },
    "maureenUrn": {
      "title": "Maureen Mayo pawns her husband",
      "customer": "maureen",
      "steps": [
        {
          "say": "maureen",
          "text": [
            "Maureen Mayo. You'll think I'm a terrible person. This is Walter. He always said he'd rather be useful than decorative.",
            "Twenty dollars, until we inter him. It's for the flowers. The Ashworths have ordered lilies, and I won't be outdone by an Ashworth."
          ]
        },
        { "view": { "counterIcon": "urn" } },
        {
          "choose": [
            { "label": "Lend $20 on it, until the interment", "hint": "(a pawn)" },
            { "label": "\"I don't take urns.\"" }
          ],
          "as": "pawn"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "pawn == 1",
          "then": [{ "say": "maureen", "text": "No. No, I suppose not. Forget I asked." }],
          "else": [
            { "add": { "unique": "urnPewter", "paid": 20 } },
            { "refresh": "panel" },
            { "coin": -20, "why": "Lent $20 to Maureen Mayo against an urn" }
          ]
        },
        {
          "if": "pawn == 0",
          "then": [
            { "set": { "urnMaureen": true } },
            { "say": "maureen", "text": "Mind him. He's been through enough." },
            {
              "if": "flag.urnRussell",
              "then": [
                { "narrate": "When she's gone, you set the two urns side by side on the back shelf. The bronze one says WALTER J. MAYO. The card under the pewter one says ASHWORTH." },
                { "plan": "urn-burial" },
                { "toast": "Calendar: the Old Burying Ground, lunchtime {placed:urn-burial}", "look": "maureen", "icon": "urn" }
              ]
            }
          ]
        },
        { "leave": "maureen" }
      ]
    },
    "urnBurial": {
      "title": "Two interments",
      "steps": [
        {
          "stage": "graveyardDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 164] },
            { "id": "russell", "cast": "russell", "at": [104, 162] },
            { "id": "maureen", "cast": "maureen", "at": [206, 162], "facingLeft": true }
          ]
        },
        { "narrate": "The Old Burying Ground at noon. Two fresh holes, small and square, side by side, and the two families on either side of the path, not looking at each other. Father Ignatius is praying for no wind." },
        { "find": "urns", "in": "stock", "match": { "uniqueId": ["urnBronze", "urnPewter"] }, "all": true },
        {
          "if": "urns.count < 2",
          "then": [
            { "narrate": "You've only brought one urn back. The other is somewhere in town, and someone is going to have a very strange afternoon." },
            { "set": { "urnEnd": "silent" } },
            { "end": true }
          ]
        },
        { "say": "russell", "text": "You brought her. Thank you. Can I have her before the Mayos see the bronze? It's nicer than theirs." },
        { "say": "maureen", "text": "Is that Walter? Give him here. Don't let him near that lot." },
        {
          "choose": [
            { "label": "Swap them back without a word", "hint": "(rep +2)" },
            { "label": "Tell them both, in front of everyone", "hint": "(rep +3)" },
            { "label": "Hand them back as they came", "hint": "(nobody will ever know)" }
          ],
          "as": "burial"
        },
        { "run": "urnsRedeemed" },
        {
          "if": "burial == 0",
          "then": [
            { "set": { "urnEnd": "swap" } },
            { "rep": 2 },
            { "narrate": "You hand Russell the pewter and Maureen the bronze, and turn them both by the shoulders towards the right holes. Nobody notices. Father Ignatius notices, and closes his eyes in thanks." }
          ]
        },
        {
          "if": "burial == 1",
          "then": [
            { "set": { "urnEnd": "told" } },
            { "rep": 3 },
            { "say": "maureen", "text": "He's had her for a WEEK? Walter has been on Russell Ashworth's mantelpiece for a week?" },
            { "say": "russell", "text": "And Mother's been in your... where has she been?" },
            { "say": "maureen", "text": "On the piano. Next to the photo of Walter." },
            { "narrate": "There's a long silence. Then Maureen laughs, and can't stop, and Russell starts, and by the end of the service both families are going to lunch together at the Clam Shack, and arguing about the fence." }
          ]
        },
        {
          "if": "burial == 2",
          "then": [
            { "set": { "urnEnd": "silent" } },
            { "narrate": "Russell buries Walter Mayo with full honours, and Maureen inters Dorothy Ashworth under a very good spray of lilies. Father Ignatius looks at you over his prayer book, and turns the page." }
          ]
        },
        { "refresh": "panel" }
      ]
    },
    "urnsRedeemed": {
      "title": "The families redeem their urns",
      "steps": [
        { "find": "bronze", "in": "stock", "match": { "uniqueId": "urnBronze" } },
        { "find": "pewter", "in": "stock", "match": { "uniqueId": "urnPewter" } },
        { "take": "bronze" },
        { "take": "pewter" },
        { "coin": 52, "why": "The Ashworths and the Mayos redeemed their urns" }
      ]
    }
  },
  "beats": [
    { "drift": "urn-ignatius", "from": "1-3", "to": "1-5", "cast": "ignatius", "scene": "ignatiusUrns" },
    { "drift": "urn-russell", "from": "2-1", "to": "2-2", "cast": "russell", "scene": "russellUrn", "if": "flag.urnHeard" },
    { "drift": "urn-maureen", "from": "2-3", "to": "2-5", "cast": "maureen", "scene": "maureenUrn", "if": "flag.urnHeard" }
  ],
  "errands": [
    {
      "id": "urn-burial",
      "title": "Two interments",
      "where": "The Old Burying Ground",
      "scene": "urnBurial",
      "test": [
        { "set": { "urnRussell": true, "urnMaureen": true } },
        { "add": { "unique": "urnBronze" } },
        { "add": { "unique": "urnPewter" } }
      ]
    }
  ],
  "calendar": [
    { "id": "urn-burial", "errand": "urn-burial", "story": "urn", "where": "The Old Burying Ground", "title": "Two interments", "known": "flag.urnRussell && flag.urnMaureen" }
  ],
  "mornings": [
    { "find": "urns", "in": "stock", "match": { "uniqueId": ["urnBronze", "urnPewter"] }, "all": true },
    {
      "if": "!flag.urnEnd && errand.urn-burial == -1 && urns.count >= 2",
      "note": "You stayed open instead: the families come for their urns at the counter, and take them as they are.",
      "then": [
        { "run": "urnsRedeemed" },
        { "set": { "urnEnd": "silent" } },
        { "refresh": "panel" },
        { "toast": "Russell Ashworth and Maureen Mayo came for their urns before you opened, an hour apart, and took them as they were.", "look": "maureen", "icon": "urn" }
      ]
    }
  ],
  "epilogue": [
    { "line": "The Mayos and the Ashworths have lunch at the Clam Shack every Sunday now, and argue about the fence the whole time. It's the best thing that ever happened to either family.", "if": "flag.urnEnd == 'told'" },
    { "line": "Walter Mayo and Dorothy Ashworth rest side by side, each in the right place. Father Ignatius lights a candle for you, privately.", "if": "flag.urnEnd == 'swap'" },
    { "line": "In the Old Burying Ground, Walter Mayo lies under Dorothy Ashworth's stone, and she under his. On windy days, Father Ignatius apologises to them both.", "if": "flag.urnEnd == 'silent'" }
  ],
  "outcome": "flag.urnEnd"
});
