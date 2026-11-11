// Pawn Champ - The Donkey. Minor quest m70, batch M (docs/quests/MINOR.md#m70-the-donkey). December only.
// Every December the Thursday Whist Club kidnaps the life-size carved donkey from Saint Brine's crèche
// and sends Father Ignatius ransom notes until Christmas Eve. He pays in fudge. This year the donkey
// spent November in Peg Callow's garage, and her grandson Corey, who wasn't in on it, pawned it to you.
// Take it back yourself with your own ransom note, hand it to the Whist Club, or keep it in the
// window till New Year's.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/donkey.js.
defineStory({
  "id": "donkey",
  "kind": "minor",
  "title": "The Donkey",
  "location": "saintbrines",
  "months": [3],
  "rumour": "Somebody has kidnapped Saint Brine's crèche donkey. The ransom notes are arriving. The donkey isn't.",
  "endings": { "ransom": "Your Own Ransom Note", "seniors": "Back to the Whist Club", "newyear": "Till New Year's" },
  "outcome": "flag.donkeyEnd",
  "about": [
    "A comic Christmas story. Corey Callow is clearing his nan's garage and pawns a life-size wooden donkey, with a shoebox of ransom notes made of cut-out letters (§{coreyDonkey}). Edwina Eastham of the Thursday Whist Club explains (§{edwinaDonkey}): every December since 1987 the Club kidnaps the donkey from Saint Brine's crèche and sends Father Ignatius ransom notes until Christmas Eve, and this year the notes are arriving without a donkey.",
    "Take it back to Saint Brine's yourself with your own ransom note (§{donkeyReturn}, Your Own Ransom Note), hand it to the Whist Club, who settle Corey's loan and enrol him for his truck (Back to the Whist Club), or keep it in your window till New Year's where Father Ignatius can visit it (Till New Year's). Your note can demand fudge, taunt the Club into a feud, or just say NO RAISINS."
  ],
  "cast": {
    "corey": {
      "name": "Corey Callow",
      "look": { "skin": "#e8c0a0", "hair": "#c88a4a", "hs": 0, "coat": "#4a4a5a", "style": "hoodie", "pants": "#2a3a5a", "beard": "#c88a4a" }
    },
    "edwina": {
      "name": "Edwina Eastham",
      "look": { "skin": "#c89070", "hair": "#e8e8e8", "hs": 3, "coat": "#8a2a3a", "trim": "#e8e0cc", "style": "jacket", "long": true, "pants": "#2a2a32", "glasses": "#c8a050", "bag": "#2a2a2e" }
    }
  },
  "icons": {
    "donkey": [
      "............",
      ".k.k........",
      ".kwkk.......",
      "kwwwwk......",
      "kwWwwkkkkkk.",
      ".kkwwwwwwwwk",
      "...kwwwwwwwk",
      "...kwwwwwwk.",
      "...kwkkkwk..",
      "...kwk.kwk..",
      "...kkk.kkk..",
      "............"
    ]
  },
  "uniques": {
    "creche": {
      "name": "Saint Brine's crèche donkey, carved pine",
      "icon": "donkey",
      "cat": "art",
      "guide": 140,
      "questKey": true,
      "tells": [
        "Life-size, nearly. Carved pine, painted gray. One ear has been glued back on, twice.",
        "Under the belly, in marker, years of dates: 1987, 1988, 1989... and initials, the same five sets every time."
      ]
    }
  },
  "spots": {
    "creche": [
      {
        "id": "notes",
        "rect": { "x": 110, "y": 66, "w": 120, "h": 84 },
        "where": "Saint Brine's",
        "lines": [
          "WE HAVE THE DONKEY. 2 LBS FUDGE. NO POLICE. NO RAISINS.",
          "IF YOU EVER WANT TO SEE YOUR DONKEY AGAIN, PEANUT BUTTER FUDGE THIS TIME. EDWINA SAYS HI.",
          "A Polaroid pinned under the notes: the donkey on a deckchair in a garage, wearing sunglasses."
        ]
      },
      {
        "id": "gap",
        "rect": { "x": 456, "y": 210, "w": 56, "h": 62 },
        "where": "Saint Brine's",
        "lines": [
          "Someone has put a cardboard cut-out of a dog in the donkey's place. The shepherd seems fine with it.",
          "The straw where the donkey stands has worn into four neat hoof-shaped dents over forty years."
        ],
        "find": { "on": 1, "coin": 1, "line": "In the straw, a 1987 dime and a ticket stub for the Whist Club's Christmas raffle. You keep the dime." }
      }
    ]
  },
  "scenes": {
    "coreyDonkey": {
      "title": "Corey Callow pawns a donkey from his nan's garage",
      "customer": "corey",
      "steps": [
        {
          "say": "corey",
          "text": [
            "Corey Callow. I'm clearing out my nan's garage while she's in Florida. Under a tarp in the back there's a donkey. Wooden. Life-size, near enough.",
            "And a shoebox of envelopes with letters cut out of magazines in them. I didn't read them. I read one. It said NO RAISINS.",
            "It's in the truck. Forty dollars on it? I'll get it back when Nan's home and tells me what it is."
          ]
        },
        { "view": { "counterIcon": "donkey" } },
        {
          "choose": [
            {
              "label": "Lend him $40 against the donkey",
              "disabled": "coin < 40 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "lend" },
                { "set": { "donkeyIn": true } },
                { "narrate": "It takes both of you to get it through the door. It stands beside the counter, looking at the till, with an expression of mild disappointment." }
              ]
            },
            {
              "label": "\"I don't lend on livestock.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "corey", "text": "It's not... okay. The dump, then. Sorry, donkey." },
                { "set": { "donkeyOut": true } }
              ]
            }
          ]
        },
        { "leave": "corey" }
      ]
    },
    "edwinaDonkey": {
      "title": "Edwina Eastham of the Whist Club wants the donkey",
      "customer": "edwina",
      "steps": [
        {
          "say": "edwina",
          "text": [
            "Edwina Eastham, secretary of the Thursday Whist Club. You have our donkey. Don't pretend. It's standing next to your till.",
            "Every December since 1987 we kidnap the donkey from Saint Brine's crèche and send Father Ignatius ransom notes until Christmas Eve. He pays in fudge. It is the high point of his year, and of ours.",
            "This year it was Peg Callow's turn to keep it, and Peg went to Florida and left her grandson in charge of the garage. The notes are still arriving at the rectory. Without a donkey. It's very embarrassing."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll take it back to Saint Brine's myself. With my own ransom note.\"",
              "hint": "(a lunch errand)",
              "then": [
                { "set": { "donkeyPlan": "ransom" } },
                { "say": "edwina", "text": "Your own note. In the middle of our campaign. That's... actually, that's the most exciting thing that's happened to the Club since Harold cheated." },
                { "plan": "donkey-return" },
                { "toast": "Calendar: return the donkey to Saint Brine's", "look": "edwina" }
              ]
            },
            {
              "label": "Hand it to the Whist Club",
              "hint": "(Edwina settles Corey's loan)",
              "then": [
                { "hook": "settle", "with": "Edwina Eastham settled the donkey's loan" },
                { "set": { "donkeyEnd": "seniors" } },
                { "say": "edwina", "text": "Thank you. And Peg's grandson... Corey, is it? He has a truck. We've never had a truck. Tell him he's been elected." }
              ]
            },
            {
              "label": "\"It stays in my window till New Year's.\"",
              "hint": "(people will stop to look)",
              "then": [
                { "set": { "donkeyEnd": "newyear" } },
                { "find": "donkey", "in": "stock", "match": { "uniqueId": "creche" } },
                { "edit": "donkey", "set": { "questKey": true, "nosale": true } },
                { "rep": 2, "why": "A donkey in the window" },
                { "say": "edwina", "text": "In the WINDOW? Where Father can SEE it? Oh, he'll be beside himself. Oh, you've made his Christmas. We'll send you notes instead." }
              ]
            }
          ]
        },
        { "leave": "edwina" }
      ]
    },
    "donkeyReturn": {
      "title": "The donkey goes home to Saint Brine's",
      "steps": [
        { "hook": "notes", "with": 5 },
        {
          "stage": "creche",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "ignatius", "cast": "ignatius", "at": [196, 162], "facingLeft": true },
            { "id": "edwina", "cast": "edwina", "at": [236, 164], "facingLeft": true }
          ]
        },
        { "narrate": "Saint Brine's at noon. The crèche has a gap in it the exact shape of a donkey, and five ransom notes are pinned over the children's drawings." },
        { "say": "ignatius", "text": "Twenty-two notes this year and not a hoof. I was beginning to think they'd really lost it. I've got four pounds of fudge in the vestry and nobody to give it to." },
        { "find": "donkey", "in": "stock", "match": { "uniqueId": "creche" } },
        {
          "if": "!donkey",
          "then": [
            { "say": "edwina", "text": "It's not in the van? Then where IS it?" },
            { "say": "ignatius", "text": "Oh, this is wonderful. A real mystery. I'll make more fudge." },
            { "end": true }
          ]
        },
        { "narrate": "You carry the donkey in, set it in its four worn dents in the straw, and pin your own note to the board. You wrote it last night, with scissors and an old catalogue. It says:" },
        {
          "choose": [
            { "label": "\"RETURNED. ONE POUND OF FUDGE TO THE CROOKED SCALE OR IT HAPPENS AGAIN.\"" },
            { "label": "\"THE DONKEY HAS BEEN RETURNED BY A FRIEND. THE WHIST CLUB IS SLIPPING.\"" },
            { "label": "\"MERRY CHRISTMAS, FATHER. NO RAISINS.\"" }
          ],
          "as": "note"
        },
        { "hook": "handBack" },
        { "hook": "notes", "with": 6 },
        { "set": { "donkeyEnd": "ransom" } },
        {
          "if": "note == 0",
          "then": [
            { "say": "ignatius", "text": "A ransom for the RETURN. In forty years. Edwina, did you hear? We've been outplayed." },
            { "coin": 6, "why": "A pound of fudge from the vestry, priced generously" }
          ]
        },
        {
          "if": "note == 1",
          "then": [
            { "say": "edwina", "text": "Slipping. SLIPPING. We'll see who's slipping next December." },
            { "set": { "donkeyFeud": true } }
          ]
        },
        { "say": "ignatius", "text": "No raisins. They've been saying it for forty years. I've never once put raisins in. Not once.", "if": "note == 2" },
        { "rep": 3, "why": "Brought Saint Brine's donkey home" }
      ]
    }
  },
  "beats": [
    { "drift": "donkey", "from": "1-3", "to": "2-2", "cast": "corey", "scene": "coreyDonkey" },
    { "drift": "donkey", "from": "2-1", "to": "3-1", "offset": 1, "cast": "edwina", "scene": "edwinaDonkey", "if": "flag.donkeyIn && !flag.donkeyEnd && hook.donkeyHere" }
  ],
  "errands": [
    {
      "id": "donkey-return",
      "title": "Return the donkey to Saint Brine's",
      "where": "Saint Brine's hall",
      "scene": "donkeyReturn",
      "test": [{ "set": { "donkeyIn": true, "donkeyPlan": "ransom" } }, { "add": { "unique": "creche" } }]
    }
  ],
  "calendar": [
    { "id": "donkey-return", "errand": "donkey-return", "story": "donkey", "where": "Saint Brine's", "title": "Return the donkey", "known": "flag.donkeyPlan == 'ransom'" }
  ],
  "epilogue": [
    {
      "line": { "if": "flag.donkeyFeud", "then": "The donkey is back in Saint Brine's crèche. The Thursday Whist Club has started planning next December, and you are on the list.", "else": "The donkey is back in Saint Brine's crèche, with your ransom note pinned beside it. Father Ignatius has had it framed." },
      "if": "flag.donkeyEnd == 'ransom'"
    },
    { "line": "The Thursday Whist Club got their donkey back, and a new member with a truck. Corey Callow says he's never been so busy.", "if": "flag.donkeyEnd == 'seniors'" },
    { "line": "Saint Brine's donkey spent Christmas in your window. Father Ignatius sent you three ransom notes and a pound of fudge.", "if": "flag.donkeyEnd == 'newyear'" }
  ],
  "talk": {
    "by": "ignatius",
    "rumour": [
      "Somebody has kidnapped our crèche donkey. Again. The ransom notes are arriving at the rectory. The donkey isn't.",
      "Fourteen notes so far, and not a hoof. I'm starting to worry they've really lost it this time."
    ],
    "react": { "ransom": "A ransom note for RETURNING the donkey. In forty years nobody's thought of that. I've had it framed.", "seniors": "The donkey came home on Christmas Eve, as it should, with the Whist Club and a young man with a truck.", "newyear": "Our donkey is in your window. I walk past twice a day to visit. I've been leaving notes." }
  }
});
