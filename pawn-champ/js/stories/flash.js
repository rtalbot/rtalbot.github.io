// Pawn Champ - The Tattoo Flash. Minor quest m28, batch K (docs/quests/MINOR.md).
// An old merchant seaman pawns a folder of 1950s tattoo flash. A tattooist from New Bedford says it
// was her grandfather's, and stolen. It wasn't stolen. Its scene is a lunch errand in the back booth
// at the Rusty Anchor.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/flash.js.
defineStory({
  "id": "flash",
  "kind": "minor",
  "title": "The Tattoo Flash",
  "location": "rustyanchor",
  "rumour": "There's a tattooist from New Bedford asking every bar on the harbor about her grandfather.",
  "endings": { "homeport": "Home Port", "sold": "Sold to the Family", "framed": "Framed in Boston" },
  "outcome": "flag.flashEnd",
  "about": [
    "Augie Pereira, a retired merchant seaman with an empty oil tank, pawns a folder of 1950s tattoo flash from Sailor Mack's old shop on Pier Nine (§{augieFlash}). A week later Jolene Kask, a New Bedford tattooist, comes in: Mack was her grandfather, and the flash went missing the night he shut his shop in 1961 (§{joleneFlash}). She offers $150.",
    "Sell it to her (Sold to the Family), or bring her and Augie together in the back booth at the Rusty Anchor (§{flashBooth}). There Augie explains that Mack gave him the sheets on that last night and told him to find someone worthy to finish his homecoming swallow, and rolls up his sleeve to show the empty patch. Jolene can tattoo it there and then and take the sheets home to be pointed at (Home Port), or you can sell the folder off to be framed in Boston (Framed in Boston)."
  ],
  "cast": {
    "augie": {
      "name": "Augie Pereira",
      "look": { "skin": "#c89070", "hair": "#e8e8e8", "hs": 0, "coat": "#2a3a5a", "style": "jacket", "trim": "#e8e4dc", "pants": "#3a3a40", "beard": "#e8e8e8", "hat": "beanie", "hatc": "#2a3a5a" }
    },
    "jolene": {
      "name": "Jolene Kask",
      "look": { "skin": "#f0d0b8", "hair": "#1a1a1a", "hs": 4, "coat": "#1e1e22", "style": "jacket", "trim": "#c84a3a", "pants": "#2a2a32", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "flash": [
      "............",
      ".kkkkkkkkkk.",
      ".kppppppppk.",
      ".kpRRpbbbpk.",
      ".kpRRpbpbpk.",
      ".kpkkpbbbpk.",
      ".kppppppppk.",
      ".kpkpkpRpPk.",
      ".kpkkkpRRpk.",
      ".kppppppppk.",
      ".kkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "tattooFlash": {
      "name": "Folder of 1950s tattoo flash",
      "icon": "flash",
      "cat": "art",
      "guide": 220,
      "questKey": true,
      "tells": [
        "Forty sheets of hand-painted designs: anchors, swallows, a pin-up in a sou'wester. Signed SAILOR MACK, PIER NINE.",
        "One swallow on the last sheet has been traced so often the paper is worn shiny."
      ]
    }
  },
  "scenes": {
    "augieFlash": {
      "title": "Augie Pereira pawns Sailor Mack's flash",
      "customer": "augie",
      "steps": [
        {
          "say": "augie",
          "text": [
            "Augie Pereira. Merchant marine, forty years, retired thirty. My oil tank's empty and it's only October.",
            "This is tattoo flash. The sheets on the wall of a tattoo parlor, that you point at. Sailor Mack's, from the old shop on Pier Nine. He did my arms in 1958."
          ]
        },
        { "offer": { "unique": "tattooFlash" }, "persona": "honest", "asking": 70, "min": 45 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "flashHeld": true } },
            { "say": "augie", "text": "Don't let anybody frame it. It was never meant to be framed. It was meant to be pointed at." }
          ],
          "else": [{ "say": "augie", "text": "Fair enough. It's kept this long." }]
        },
        { "leave": "augie" }
      ]
    },
    "joleneFlash": {
      "title": "Jolene Kask wants her grandfather's flash",
      "customer": "jolene",
      "steps": [
        { "find": "it", "in": "stock", "match": { "uniqueId": "tattooFlash" } },
        {
          "say": "jolene",
          "text": [
            "Jolene Kask. I tattoo in New Bedford. I hear you have my grandfather's flash. Sailor Mack. Mack Kask.",
            "When he shut his shop on Pier Nine in 1961, the flash went missing the same night. Forty sheets, his whole life. I've been asking in every bar on this harbor for a month. A bartender at the Rusty Anchor sent me here."
          ]
        },
        {
          "if": "!it",
          "then": [
            { "say": "jolene", "text": "You sold it on? To who? ...Never mind. I'll find it. I found you." },
            { "set": { "flashEnd": "framed" } },
            { "leave": "jolene" },
            { "end": true }
          ]
        },
        { "say": "jolene", "text": "One-fifty. Today." },
        {
          "choose": [
            {
              "label": "Sell it to her (+$150)",
              "then": [
                { "set": { "flashEnd": "sold" } },
                { "sell": "it" },
                { "coin": 150, "why": "Sold Sailor Mack's flash to his granddaughter" },
                { "say": "jolene", "text": "Thank you. He'd have liked you. He liked anybody who took cash." }
              ]
            },
            {
              "label": "\"The man who pawned it has a story too. Meet him at the Rusty Anchor.\"",
              "then": [
                { "plan": "flash-booth" },
                { "set": { "flashMeet": true } },
                { "toast": "Calendar: the Rusty Anchor, lunchtime {placed:flash-booth}", "look": "jolene" },
                { "say": "jolene", "text": "The back booth. If he's the one who took it, I'd like to see his face." }
              ]
            }
          ]
        },
        { "leave": "jolene" }
      ]
    },
    "flashBooth": {
      "title": "The back booth at the Rusty Anchor",
      "steps": [
        {
          "stage": "rustyanchor",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 164] },
            { "id": "augie", "cast": "augie", "at": [156, 160], "facingLeft": true },
            { "id": "jolene", "cast": "jolene", "at": [210, 158], "facingLeft": true }
          ]
        },
        { "find": "it", "in": "stock", "match": { "uniqueId": "tattooFlash" } },
        { "narrate": "The back booth at the Rusty Anchor, lunchtime. Augie Pereira has a coffee. Jolene Kask has her arms folded. Neither has said anything yet." },
        { "say": "jolene", "text": "You took my grandfather's flash." },
        { "say": "augie", "text": "He gave it to me. The last night. He said, Augie, I never did your homecoming swallow, and I'm not going to now. Take the sheets, and find somebody who deserves them to do it." },
        { "narrate": "Augie rolls up his left sleeve. Anchors, a ship, a rose, a swallow for the first five thousand miles. Above the elbow, a bare patch the size of a playing card, sixty-five years empty." },
        { "say": "augie", "text": "I never found anybody. Everybody after Mack was a kid with a machine." },
        { "say": "jolene", "text": "...That's his swallow. On the last sheet. The one that's worn through." },
        {
          "choose": [
            {
              "label": "\"Jolene, you do it. The sheets go to whoever finishes the swallow.\"",
              "if": "it",
              "then": [
                { "set": { "flashEnd": "homeport" } },
                { "take": "it" },
                { "hook": "paidPlus", "with": [20, "Jolene Kask bought the flash for Augie's swallow"] },
                { "narrate": "Jolene sets up in the booth that afternoon with a machine from her car. Ruthie brings over a lamp. The whole bar goes quiet for the buzzing, like church." },
                { "say": "augie", "text": "Home port." },
                { "say": "jolene", "text": "The sheets go on my wall. Pointed at, not framed. That's how he wanted it, isn't it?" },
                { "rep": 4 }
              ]
            },
            {
              "label": "\"I don't have the sheets anymore. I'm sorry.\"",
              "if": "!it",
              "then": [
                { "set": { "flashEnd": "framed" } },
                { "narrate": "Augie rolls his sleeve back down. Jolene buys him another coffee, which is something." }
              ]
            },
            {
              "label": "Sell her the folder now and let them sort it out (+$150)",
              "if": "it",
              "then": [
                { "set": { "flashEnd": "sold" } },
                { "sell": "it" },
                { "coin": 150, "why": "Sold Sailor Mack's flash to his granddaughter" },
                { "narrate": "Money changes hands. Augie finishes his coffee. On her way out, Jolene doesn't take her eyes off his bare arm until she's through the door." }
              ]
            },
            {
              "label": "(Leave them to it)",
              "if": "!it",
              "then": [
                { "set": { "flashEnd": "framed" } },
                { "narrate": "Augie rolls his sleeve back down. Jolene buys him another coffee, which is something." }
              ]
            },
            {
              "label": "\"It's mine now. A dealer in Boston will frame it.\"",
              "if": "it",
              "then": [
                { "set": { "flashEnd": "framed" } },
                { "edit": "it", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "jolene", "text": "Framed. He'd hate that." },
                { "say": "augie", "text": "He hated most things. Go on, then." },
                { "narrate": "The folder is yours to sell. Augie rolls his sleeve back down." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "1-3", "cast": "augie", "scene": "augieFlash" },
    { "at": "2-3", "cast": "jolene", "scene": "joleneFlash", "if": "flag.flashHeld && !flag.flashEnd" }
  ],
  "errands": [
    {
      "id": "flash-booth",
      "title": "The back booth",
      "where": "the Rusty Anchor",
      "scene": "flashBooth",
      "test": [{ "add": { "unique": "tattooFlash" }, "as": "it" }, { "edit": "it", "set": { "paid": 50 } }]
    }
  ],
  "calendar": [
    { "id": "flash-booth", "errand": "flash-booth", "story": "flash", "where": "The Rusty Anchor", "title": "The back booth", "known": "flag.flashMeet" }
  ],
  "epilogue": [
    { "line": "Augie Pereira shows his homecoming swallow to anyone at the Rusty Anchor who'll look. Sailor Mack's flash hangs on a wall in New Bedford, and people point at it.", "if": "flag.flashEnd == 'homeport'" },
    { "line": "Sailor Mack's flash went home to New Bedford. Augie Pereira's arm still has a bare patch above the elbow.", "if": "flag.flashEnd == 'sold'" },
    { "line": "Somewhere in Boston, forty sheets of Sailor Mack's flash are behind glass, where nobody can point at them.", "if": "flag.flashEnd == 'framed'" }
  ]
});
