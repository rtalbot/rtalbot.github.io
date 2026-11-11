// Pawn Champ - The Last Pageant: the minor sequel to M5 The Benefit (docs/quests/SEQUELS.md#the-last-pageant).
// Batch U, round 3. December only, and only if The Benefit ended A Good Roof on Sold Land: the
// children have a good roof for one more Christmas before the Hand takes the land in spring.
//
// Hook (W1-W2)   Dulcie brings a list: a crown for a king, a star, something gold, something that
//                smells nice, a camel. Lend them things off your shelves, sell them a box of junk, or
//                give them money for costumes.
// Scene (W3-W4)  the pageant in Saint Brine's hall. The innkeeper freezes. You can stand in, hand him
//                something to hold, or let Dulcie improvise.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/pageant.js.
defineStory({
  "id": "pageant",
  "kind": "minor",
  "title": "The Last Pageant",
  "location": "saintbrines",
  "sequel": "benefit",
  "after": ["roof"],
  "months": [3],
  "rumour": "The Saint Brine's children are putting on their Christmas pageant, the last one before the Hand takes the land.",
  "teaser": "There's a hand-lettered poster in the bakery window: THE SAINT BRINE'S CHRISTMAS PAGEANT. UNDER A GOOD ROOF. ALL WELCOME.",
  "endings": { "innkeeper": "No Room at the Inn", "lantern": "A Light in the Window", "dulcie": "Dulcie Improvises" },
  "about": [
    "A December story. Dulcie, who calls herself the director, is putting on the Saint Brine's Christmas pageant, the last in the hall before the Gilded Hand takes the land, and brings a list: a crown, a star, something gold, something that smells nice, a camel (§{pageantDulcie}). Lend her three things off your shelves, sell her a box of odds and ends for $10, or give $40 for proper costumes; the show reflects what you gave.",
    "On the night (§{pageantNight}) the seven-year-old innkeeper freezes on his one line. Stand in beside him and say it (No Room at the Inn), hand him a lantern and whisper a line that lets Mary into the stable (A Light in the Window), or leave it to Dulcie, who announces that the inn is full because the Gilded Hand bought it (Dulcie Improvises). Anything lent comes back, one piece with glitter on it."
  ],
  "notes": "What the children can borrow: up to three things on your shelves that could be a crown, a star or a gift (jewelry, silver or a curio that isn't held or a quest key), found by the findProps hook. flag.pageantLent holds their ids until the show gives them back.",
  "scenes": {
    "pageantDulcie": {
      "title": "Dulcie brings a list",
      "customer": "dulcie",
      "steps": [
        { "say": "dulcie", "text": "Dulcie. From Saint Brine's. I'm the director. Sister Amabel says I'm the stage manager, but I'm the director." },
        { "narrate": "She puts a list on the counter in purple felt pen. ONE CROWN (KING). ONE STAR (BIG). SOMETHING GOLD. SOMETHING THAT SMELLS NICE. A CAMEL OR SOMETHING LIKE A CAMEL." },
        { "say": "dulcie", "text": "It's the last one in the hall. After Christmas the Hand owns the floor. So it has to be good. It has to be the best one." },
        { "hook": "findProps", "sets": ["props", "propNames"] },
        {
          "choose": [
            {
              "label": "Lend her three things off the shelves",
              "hint": { "if": "props.count", "then": "({propNames})", "else": "(nothing on the shelves would do)" },
              "disabled": "props.count < 1",
              "then": [
                { "hook": "lendProps" },
                { "say": "dulcie", "text": "The {props.0.name|lower} is the crown. Don't argue. It's the crown." },
                { "set": { "pageantWay": "lent" } }
              ]
            },
            {
              "label": "Sell her a box of odds and ends for ten dollars",
              "hint": "(+$10)",
              "then": [
                { "coin": 10, "why": "Sold Dulcie a box of odds and ends" },
                { "narrate": "A coat hanger, a broken lampshade, two doorknobs and a tin of shoe polish. Dulcie turns each thing over in her hands, then nods, as if she's seen the whole show." },
                { "set": { "pageantWay": "box" } }
              ]
            },
            {
              "label": "Give her forty dollars for proper costumes",
              "hint": "(-$40)",
              "disabled": "coin < 40",
              "then": [
                { "coin": -40, "why": "Paid for the Saint Brine's pageant costumes" },
                { "rep": 2 },
                { "say": "dulcie", "text": "Forty dollars. That's a camel. That's a whole real camel costume from the internet." },
                { "set": { "pageantWay": "paid" } }
              ]
            }
          ]
        },
        { "say": "dulcie", "text": "The show's {placed:pageant-night} night. You're coming. It isn't a question." },
        { "set": { "pageantKnown": true } },
        { "toast": "Calendar: the Saint Brine's pageant, {placed:pageant-night} night", "look": "dulcie" },
        { "leave": "dulcie" }
      ]
    },
    "pageantNight": {
      "title": "The Christmas pageant",
      "music": "tender",
      "steps": [
        {
          "stage": "saintbrines",
          "view": { "timeOfDay": 0.9 },
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [70, 166] },
            {
              "id": "parent",
              "look": "random",
              "at": [[40, 168], [100, 168], [126, 168], [152, 168], [178, 168]]
            },
            { "id": "amabel", "cast": "amabel", "at": [206, 164], "facingLeft": true },
            { "id": "dulcie", "cast": "dulcie", "at": [240, 166], "facingLeft": true },
            { "id": "ignatius", "cast": "ignatius", "at": [290, 160], "facingLeft": true }
          ]
        },
        { "narrate": "Saint Brine's hall, every bench full and people standing at the back. No bucket under the roof this year. There's a manger made of a fruit crate, and a curtain made of two bedsheets on a broom handle." },
        { "hook": "findLent", "sets": ["lent"] },
        {
          "if": "flag.pageantWay == 'lent' && lent.count",
          "then": [
            {
              "narrate": {
                "if": "lent.count >= 3",
                "then": "The king wears your {lent.0.name|lower} on his head, and holds it there with one hand all the way through. The {lent.1.name|lower} is the gold, carried in both hands. The {lent.2.name|lower} is something that smells nice. It doesn't, but nobody says.",
                "else": { "if": "lent.count == 2", "then": "The king wears your {lent.0.name|lower} on his head, and holds it there with one hand all the way through. The {lent.1.name|lower} is the gold, carried in both hands.", "else": "The king wears your {lent.0.name|lower} on his head, and holds it there with one hand all the way through." }
              }
            }
          ],
          "else": [
            {
              "narrate": { "if": "flag.pageantWay == 'box'", "then": "The king's crown is your broken lampshade, painted gold. The star is a coat hanger and tinfoil. The camel is two boys and a brown blanket, and the shoe polish was for the camel's nose.", "else": "The camel is a real camel costume from the internet, worn by two boys who are not speaking to each other. It is magnificent." }
            }
          ]
        },
        { "narrate": "Then the innkeeper comes to his door, sees the whole town on the benches, and freezes. He's seven. He has one line. Nothing comes out." },
        { "say": "dulcie", "text": "(from behind the bedsheet) Somebody. Do something." },
        {
          "choose": [
            {
              "label": "Walk up and stand in as the innkeeper",
              "hint": "(\"No room at the inn\")",
              "then": [
                {
                  "narrate": [
                    "You walk up the aisle in your coat, stand in the cardboard doorway next to him, and say \"No room at the inn\" in a voice you didn't know you had. The innkeeper says it too, a second behind you, louder.",
                    "The whole hall claps for the innkeeper. Father Ignatius laughs so hard he has to sit down."
                  ]
                },
                { "set": { "pageantEnd": "innkeeper" } },
                { "rep": 3, "why": "Stood in as the innkeeper" }
              ]
            },
            {
              "label": "Hand him a lantern to hold, and whisper the line",
              "then": [
                { "narrate": "You find him a lantern from the vestry, light it, and put it in his hands. \"There's no room,\" you whisper, \"but there's the stable.\" He holds the lantern up so Mary can see her way, and says it, and says the stable part too, which isn't in the script." },
                { "say": "amabel", "text": "That isn't in the script. It's better than the script." },
                { "set": { "pageantEnd": "lantern" } },
                { "rep": 2 }
              ]
            },
            {
              "label": "Leave it to Dulcie",
              "then": [
                {
                  "narrate": [
                    "Dulcie walks out from behind the bedsheet in her stage manager's headset, takes the innkeeper by the hand, and announces, \"The inn is full because the Gilded Hand bought it.\"",
                    "There is a terrible silence, and then the whole hall laughs, and keeps laughing, and somebody at the back starts clapping, and the innkeeper says his line into the noise and nobody hears it, and he doesn't mind."
                  ]
                },
                { "set": { "pageantEnd": "dulcie" } },
                { "rep": 1 }
              ]
            }
          ]
        },
        { "say": "ignatius", "text": "The last one in this hall. I'm glad it was this one." },
        { "hook": "giveBack", "note": "the lent things come home, one of them with glitter on it" },
        { "toast": "Dulcie brought back everything she borrowed. One of them has glitter on it now, forever.", "look": "dulcie", "if": "lent.count" },
        { "set": { "pageantLent": [] } },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "drift": "pageant-dulcie", "from": "1-2", "to": "2-2", "cast": "dulcie", "scene": "pageantDulcie" }
  ],
  "nights": [
    {
      "id": "pageant-night",
      "window": ["3-1", "4-4"],
      "if": "flag.pageantKnown && !flag.pageantEnd",
      "scene": "pageantNight",
      "test": [
        { "set": { "pageantKnown": true } },
        { "add": { "item": "ring" }, "as": "ring" },
        { "roll": { "pageantWay": ["lent", "box", "paid"] } },
        { "hook": "lend", "with": "ring", "if": "flag.pageantWay == 'lent'" },
        { "set": { "pageantLent": [] }, "if": "flag.pageantWay != 'lent'" }
      ]
    }
  ],
  "calendar": [
    { "id": "pageant-night", "night": "pageant-night", "story": "pageant", "where": "Saint Brine's", "title": "The Christmas pageant", "known": "flag.pageantKnown", "scene": "pageantNight" }
  ],
  "epilogue": [
    { "hook": "giveBack", "note": "the show never went on: whatever Dulcie borrowed is for sale again" },
    { "line": "There is a photograph of you in the Saint Brine's scrapbook, in a cardboard doorway, turning away the holy family. The children took the scrapbook with them when they moved.", "if": "flag.pageantEnd == 'innkeeper'" },
    { "line": "The innkeeper at the last Saint Brine's pageant made room in the stable. Sister Amabel says she's going to put it in every script from now on.", "if": "flag.pageantEnd == 'lantern'" },
    { "line": "Dulcie's line about the inn and the Gilded Hand went all round Hollow Neck by morning. Merrit Gaunt was in the back row. He didn't laugh.", "if": "flag.pageantEnd == 'dulcie'" }
  ],
  "talk": {
    "by": "skip",
    "rumour": [
      "The Saint Brine's kids rehearse their pageant on my bus. All the way to school and all the way back. I know every line. I could play Joseph.",
      "It's the last one in that hall. The Hand gets the land in the spring. Dulcie's directing. God help us all."
    ],
    "react": { "innkeeper": "You played the innkeeper, I hear. The kids on my bus do your voice now. They're not kind about it, and they're spot on.", "lantern": "The little innkeeper with the lantern. He told the whole bus about it. He let Mary into the stable. That's not in the book, he says, but it should be.", "dulcie": "Dulcie told the whole hall the Gilded Hand bought the inn. That girl will be a selectman by the time she's twelve." }
  },
  "outcome": "flag.pageantEnd"
});
