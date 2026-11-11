// Pawn Champ - The Turkey Platter. Minor quest m69, batch M (docs/quests/MINOR.md#m69-the-turkey-platter).
// November only. In the Delahunt family, whoever has Mom's transferware turkey platter hosts
// Thanksgiving. Mom died in March, there are four of them, and the youngest has just pawned it.
// Give it to whoever needs to host this year, sell it, or get all four to the same table.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/platter.js.
defineStory({
  "id": "platter",
  "kind": "minor",
  "title": "The Turkey Platter",
  "location": "kitchen",
  "months": [2],
  "rumour": "The Delahunts have four kids, one Thanksgiving, and one platter. The youngest has it, and he's just pawned it.",
  "endings": { "host": "The Youngest Hosts", "together": "Four at One Table", "sold": "Sold Before the Gravy" },
  "outcome": "flag.platterEnd",
  "about": [
    "A November family story. In the Delahunt family whoever has their late mom's turkey platter hosts Thanksgiving, and she gave it to Rory, the youngest, from her hospital bed. Not knowing why, he pawns it so that nobody hosts (§{roryPlatter}). He's cooking a turkey at his place anyway and invites you. Bridie, who has hosted for nine years, offers you $120 for it (§{bridiePlatter}); sell it, invite her to Rory's, or refuse.",
    "At Rory's on Thanksgiving (§{platterDinner}) the siblings squabble round two tables pushed together. Give the platter to Rory, who has worked out his mother knew he'd be alone this year (The Youngest Hosts). If Bridie came, put it in the middle of the table so the table hosts (Four at One Table). Or sell it to Cormac, who has the big table; selling it to anyone is Sold Before the Gravy."
  ],
  "cast": {
    "rory": {
      "name": "Rory Delahunt",
      "look": { "skin": "#f0d0b8", "hair": "#8a3a20", "hs": 1, "coat": "#5a6a3a", "style": "jacket", "pants": "#2a2a32", "beard": "#8a3a20" }
    },
    "bridie": {
      "name": "Bridie Delahunt",
      "look": { "skin": "#f0d0b8", "hair": "#8a3a20", "hs": 3, "coat": "#3a4a7a", "trim": "#e8e0cc", "style": "jacket", "long": true, "pants": "#2a2a30", "glasses": "#2a2a2e", "bag": "#5a3a2a" }
    },
    "cormac": {
      "name": "Cormac Delahunt",
      "look": { "skin": "#e8c0a0", "hair": "#5a2a18", "hs": 0, "coat": "#7a2a2a", "style": "puffer", "pants": "#3a3a42", "stout": true }
    },
    "nuala": {
      "name": "Nuala Delahunt",
      "look": { "skin": "#f0d0b8", "hair": "#c8642a", "hs": 4, "coat": "#2a2a2e", "style": "jacket", "pants": "#2a2a30", "bag": "#2a2a2e" }
    }
  },
  "icons": {
    "platter": [
      "............",
      "............",
      "..kkkkkkkk..",
      ".kcccccccck.",
      "kccmmmmmccck",
      "kcmmWWWmmcck",
      "kcmWWWWWmcck",
      "kccmmmmmccck",
      ".kccccccccck",
      "..kkkkkkkkk.",
      "............",
      "............"
    ]
  },
  "uniques": {
    "platter": {
      "name": "Transferware turkey platter (Delahunt)",
      "icon": "platter",
      "cat": "art",
      "guide": 90,
      "questKey": true,
      "tells": [
        "Staffordshire, brown transfer print: a turkey in a meadow, a fence, a church. Twenty inches across.",
        "A hairline crack across the turkey's tail, mended with glue from the inside. On the back, in nail polish: \"MOM. NOT THE DISHWASHER.\""
      ]
    }
  },
  "spots": {
    "thanksgiving": [
      {
        "id": "pies",
        "rect": { "x": 136, "y": 248, "w": 48, "h": 20 },
        "where": "Rory's kitchen",
        "lines": [
          "Pumpkin. Store-bought, with the label peeled off and a fork mark pressed round the edge to make it look home-made.",
          "Someone has already taken a slice. The fork marks lead to Cormac."
        ]
      },
      {
        "id": "cranberry",
        "rect": { "x": 436, "y": 246, "w": 20, "h": 18 },
        "where": "Rory's kitchen",
        "lines": [
          "Cranberry sauce from the can, standing up in the shape of the can. Mom always served it like this. Nobody will let it be changed.",
          "Nuala cuts it in slices along the ridges. \"That's what the ridges are for,\" she says."
        ],
        "find": { "on": 1, "coin": 1, "line": "Under the can opener, a dollar and a sticky note in old handwriting: \"for the gravy fund\". You leave it. Then you take it." }
      }
    ]
  },
  "scenes": {
    "roryPlatter": {
      "title": "Rory Delahunt pawns his mom's turkey platter",
      "customer": "rory",
      "steps": [
        {
          "say": "rory",
          "text": [
            "Rory Delahunt. This is my mom's turkey platter. In our family, whoever has the platter hosts Thanksgiving. Mom's rule.",
            "She died in March. My sister Bridie's hosted for nine years. Cormac says it should be him because he's got the big table. Nuala lives in Albany and says she doesn't care, which means she does. And Mom gave it to me. In the hospital. I'm the youngest. I don't know why.",
            "Forty dollars on it, till after Thanksgiving. If it's here, nobody has it, and nobody hosts, and maybe we all just stay home and nobody has to sit in her chair."
          ]
        },
        { "view": { "counterIcon": "platter" } },
        {
          "choose": [
            {
              "label": "Lend him $40 against the platter",
              "disabled": "coin < 40 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                { "hook": "lend" },
                { "set": { "platterIn": true } },
                { "say": "rory", "text": "I'm doing a turkey anyway. At mine. Front Street, Thursday at four. Not hosting. Just cooking near people. You should come, if you're not doing anything. Bring the platter, or don't." },
                { "toast": "Calendar: Thanksgiving at Rory Delahunt's", "look": "rory" }
              ]
            },
            {
              "label": "\"Your mom gave it to you for a reason.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "rory", "text": "Yeah. Everyone keeps saying that. Nobody says what the reason is." }
              ]
            }
          ]
        },
        { "leave": "rory" }
      ]
    },
    "bridiePlatter": {
      "title": "Bridie Delahunt wants to buy the platter",
      "customer": "bridie",
      "steps": [
        {
          "say": "bridie",
          "text": [
            "Bridie Delahunt. You have my mother's platter. My little brother pawned it. For forty dollars. Our mother's platter.",
            "I've hosted for nine years. I know how many people fit round a table and who can't sit next to who. I'll pay you a hundred and twenty for it, today, and Rory can keep the forty. Call it his share."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell it to her",
              "hint": "(+$120; it's Rory's pledge)",
              "disabled": "!hook.platterHere",
              "then": [
                { "hook": "clear", "with": true },
                { "coin": 120, "why": "Sold the Delahunt platter to Bridie" },
                { "rep": -3 },
                { "set": { "platterEnd": "sold" } },
                { "say": "bridie", "text": "Thank you. I'll tell him myself. He won't mind. He'll mind." }
              ]
            },
            {
              "label": "\"Rory's doing a turkey on Thursday. Four o'clock. Bring the gravy.\"",
              "then": [
                { "set": { "platterBridie": true } },
                {
                  "say": "bridie",
                  "text": [
                    "He's cooking? Rory? Rory can't boil an egg. Mom did his eggs till he was nineteen.",
                    "...Four o'clock. Fine. Somebody has to bring the gravy."
                  ]
                }
              ]
            },
            {
              "label": "\"It's his pledge. Not mine to sell.\"",
              "then": [
                { "say": "bridie", "text": "Hm. Fine. Fine. Somebody in this town has principles. It would be you." }
              ]
            }
          ]
        },
        { "leave": "bridie" }
      ]
    },
    "platterDinner": {
      "title": "Thanksgiving at Rory's, with or without the platter",
      "steps": [
        { "hook": "onPlatter", "with": false },
        {
          "stage": "thanksgiving",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [64, 168] },
            { "id": "rory", "cast": "rory", "at": [120, 164] },
            { "id": "cormac", "cast": "cormac", "at": [236, 166], "facingLeft": true },
            { "id": "nuala", "cast": "nuala", "at": [268, 162], "facingLeft": true },
            {
              "id": "bridie",
              "cast": "bridie",
              "at": [196, 160],
              "facingLeft": true,
              "if": "flag.platterBridie"
            }
          ]
        },
        { "narrate": "Thanksgiving, four o'clock, Front Street. Rory's kitchen table and a card table under one long white cloth, four chairs that don't match, and a turkey sitting on its roasting pan because there's nothing to put it on." },
        { "say": "cormac", "text": "I'm not saying I should host. I'm saying I have the table. This is two tables." },
        { "say": "nuala", "text": "I drove four hours from Albany. I don't care who hosts. I care that there's cranberry from the can, and there is, so." },
        {
          "if": "bridie",
          "then": [{ "say": "bridie", "text": "The gravy. Don't anybody touch the gravy." }],
          "else": [{ "narrate": "Rory keeps looking at the door. Bridie doesn't come." }]
        },
        {
          "if": "!hook.platterHere",
          "then": [
            { "say": "rory", "text": "We'll eat off the pan. Mom would've hated that. Pass the potatoes." },
            { "set": { "platterEnd": "host" }, "if": "!flag.platterEnd" },
            { "end": true }
          ]
        },
        { "narrate": "You put the platter on the counter, still in its newspaper. The room goes quiet the way rooms do for a fire alarm." },
        {
          "choose": [
            {
              "label": "Give it to Rory",
              "hint": "(forgive his $40)",
              "then": [
                { "hook": "clear" },
                { "hook": "onPlatter", "with": true },
                { "set": { "platterEnd": "host" } },
                { "say": "rory", "text": "She gave it to me because I'm the one with nobody at home this year. I worked it out in the car. She knew Jen was leaving before I did." },
                { "say": "nuala", "text": "So you host. Next year too, probably. I'll drive." },
                { "say": "cormac", "text": "It's still two tables." },
                { "rep": 3, "why": "Gave the Delahunt platter back to Rory" }
              ]
            },
            {
              "label": "Put it in the middle of the table",
              "hint": { "if": "bridie", "then": "(it belongs to the table)", "else": "(Bridie isn't here)" },
              "disabled": "!bridie",
              "then": [
                { "hook": "clear" },
                { "hook": "onPlatter", "with": true },
                { "set": { "platterEnd": "together" } },
                { "narrate": "You set it down in the middle of the long cloth, where the two tables meet. Bridie moves the turkey onto it without a word. Cormac pays off Rory's loan out of his wallet, then says Bridie owes him half." },
                { "coin": 52, "why": "The Delahunts settled the platter loan" },
                { "say": "bridie", "text": "Whoever has the platter hosts. Right now the table has it. So the table hosts. Mom would have called that cheating." },
                { "say": "rory", "text": "Mom cheated at Scrabble for forty years." },
                { "rep": 4, "why": "Got four Delahunts to one table" }
              ]
            },
            {
              "label": "Sell it to Cormac, who has the big table",
              "hint": "(+$150)",
              "then": [
                { "hook": "clear", "with": true },
                { "hook": "onPlatter", "with": true },
                { "set": { "platterEnd": "sold" } },
                { "coin": 150, "why": "Sold the Delahunt platter to Cormac" },
                { "rep": -2 },
                { "say": "cormac", "text": "Next year, mine. Big table. Everybody." },
                { "say": "nuala", "text": "I'll be in Albany." },
                { "say": "rory", "text": "...Can we eat off it this once? Since it's here?" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "platter", "from": "2-2", "to": "3-2", "cast": "rory", "scene": "roryPlatter" },
    { "drift": "platter", "from": "3-1", "to": "4-2", "offset": 1, "cast": "bridie", "scene": "bridiePlatter", "if": "flag.platterIn && !flag.platterEnd" }
  ],
  "nights": [
    {
      "id": "platter-dinner",
      "window": ["4-4", "4-4"],
      "weekdays": [4],
      "if": "flag.platterIn && !flag.platterEnd",
      "scene": "platterDinner",
      "test": [
        { "hook": "testSetup", "note": "Rory's pledge on the shelf, and Bridie invited six times in ten" }
      ]
    }
  ],
  "calendar": [
    { "id": "platter-dinner", "night": "platter-dinner", "story": "platter", "where": "Rory Delahunt's, Front Street", "title": "Thanksgiving dinner", "known": "flag.platterIn", "scene": "platterDinner" }
  ],
  "epilogue": [
    { "line": "Rory Delahunt hosted Thanksgiving off his mom's platter. Nuala drove down from Albany. Cormac brought a folding table, to prove a point.", "if": "flag.platterEnd == 'host'" },
    { "line": "Four Delahunts ate Thanksgiving off one platter in the middle of two tables. Nobody sat in Mom's chair. Somebody put the gravy there.", "if": "flag.platterEnd == 'together'" },
    { "line": "The Delahunt turkey platter has a new host. Nobody's quite sure who's going next year.", "if": "flag.platterEnd == 'sold'" }
  ],
  "talk": {
    "by": "dot",
    "rumour": [
      "The Delahunts: four kids, one Thanksgiving, one turkey platter. Whoever has the platter hosts. The youngest has it, and he's just pawned it.",
      "Bridie Delahunt has hosted for nine years. She's not taking this well. She's been in to tell me about it twice."
    ],
    "react": { "host": "Rory Delahunt hosted. Rory! Bridie brought her own gravy, and nobody says that like it's a bad thing.", "together": "All four Delahunts at one table. Two tables. One platter. My heart. I sent over a quart of chowder.", "sold": "The Delahunt platter got sold out from under somebody. I don't know who. Everybody's telling it differently." }
  }
});
