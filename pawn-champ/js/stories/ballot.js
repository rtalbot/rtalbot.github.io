// Pawn Champ - The Ballot Box. Minor quest m65, batch L (docs/quests/MINOR.md#m65-the-ballot-box).
// A walnut ballot box with a crank, from Marv Kettle's house clearances. Its false bottom holds 37
// uncounted ballots from the 1956 selectmen's race, which Thaddeus Gorham lost by eleven votes. He
// is ninety-six. Marguerite Oyelaran checks them against the records in the Town Hall vault. Count
// them in public at Town Meeting (a vignette in the 'meeting' hub, js/quests/selectmen.js), take
// them to him quietly, or leave history alone. Crosses with M11 (The Selectmen's Race).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/ballot.js.
defineStory({
  "id": "ballot",
  "kind": "minor",
  "title": "The Ballot Box",
  "location": "townhall",
  "crosses": ["selectmen"],
  "rumour": "Somebody found a box of ballots from the 1956 election.",
  "endings": { "recount": "Recount", "quiet": "Between Us", "sealed": "Let It Lie" },
  "about": [
    "A town history story. Marv brings in a walnut ballot box from the old town clerk's house (§{marvBallot}). It has a false bottom, and under it are thirty-seven uncounted ballots from the March 1956 selectman's race, which Thaddeus Gorham, now ninety-six, lost by eleven votes.",
    "In the Town Hall vault (§{ballotVault}) Marguerite won't count them except in public. Count them at Town Meeting under any other business (§{ballotCount}), and the old man ties sixty-nine years late (Recount); take them to his kitchen table quietly (Between Us); or seal them in the vault until 2056 (Let It Lie)."
  ],
  "notes": "Counting them in public only sets ballotPublic; the ending is a recount from then on, even if Town Meeting never comes.",
  "cast": {
    "gorham": {
      "name": "Thaddeus Gorham",
      "look": { "skin": "#d8a888", "hair": "#e8e8e8", "hs": 0, "coat": "#4a4a5a", "style": "suit", "pants": "#3a3a44", "glasses": "#c8a050", "moustache": "#e8e8e8" }
    }
  },
  "icons": {
    "ballotbox": [
      "............",
      ".....kk.....",
      "..kkkkkkkk..",
      ".kWWWkkWWWk.",
      ".kwwwwwwwwk.",
      ".kwwwkkwwwkk",
      ".kwwwkkwwwkd",
      ".kwwwwwwwwkd",
      ".kwwwwwwwwkk",
      ".kWWWWWWWWk.",
      "..kkkkkkkk..",
      "............"
    ]
  },
  "uniques": {
    "ballotBox": {
      "name": "Walnut ballot box with a crank",
      "icon": "ballotbox",
      "cat": "curio",
      "guide": 120,
      "questKey": true,
      "tells": [
        "Walnut, brass crank, a bell that rings once for every ballot. Stencilled: TOWN OF HOLLOW NECK.",
        "It's an inch shallower inside than outside. There's a false bottom, and paper under it."
      ]
    }
  },
  "scenes": {
    "marvBallot": {
      "title": "Marv Kettle brings in a ballot box",
      "customer": "marv",
      "steps": [
        { "say": "marv", "text": "Marv. House clearances. You'll want this one. Out of a house on Cove Road, the old town clerk's place. Walnut. It's got a crank, and a bell, listen." },
        { "narrate": "He turns the crank. A small brass bell goes ding. He looks very pleased." },
        { "say": "marv", "text": "Ninety and it's yours. It's just a box. Probably." },
        { "offer": { "unique": "ballotBox" }, "persona": "honest", "asking": 90, "min": 60 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "marv", "text": "Suit yourself. The Historical Society'll want it. They always want things. They never pay for them." },
            { "leave": "marv" },
            { "end": true }
          ]
        },
        { "set": { "ballotIn": true } },
        {
          "narrate": [
            "When he's gone you turn it over. It's an inch shallower inside than out. Under a thin walnut board: thirty-seven paper ballots, folded once, marked in pencil. SELECTMAN, MARCH 1956.",
            "You ring Town Hall. Marguerite Oyelaran, the moderator, answers on the first ring, and says \"Don't touch them. Come at lunch. Bring gloves.\""
          ]
        },
        { "plan": "ballot-vault" },
        { "leave": "marv" }
      ]
    },
    "ballotVault": {
      "title": "Marguerite looks at the ballots in the Town Hall vault",
      "steps": [
        {
          "stage": "townhallVault",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "marguerite", "cast": "marguerite", "at": [200, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The vault under Town Hall: a round steel door, a hundred and seventy years of annual reports, and one bulb on a chain. On the top shelf, a row of old ballot boxes with a gap in it." },
        {
          "say": "marguerite",
          "text": [
            "That's where it lived. Precinct Two's box. The Annual Report for 1956 says Precinct Two had four hundred and twelve voters. The tally sheet says three hundred and seventy-five ballots were counted.",
            "Thirty-seven short. Nobody noticed, because nobody counts the counters. Thaddeus Gorham lost that race by eleven votes. He's ninety-six and he still plays cribbage at the Grange every Thursday.",
            "I could count them now. I won't. I'm the moderator. Things like this get counted in public or not at all."
          ]
        },
        { "find": "box", "in": "stock", "match": { "uniqueId": "ballotBox" } },
        {
          "if": "!box",
          "then": [
            { "say": "marguerite", "text": "You haven't brought the box. Then nothing happens today. Things like that usually don't." },
            { "end": true }
          ]
        },
        { "say": "marguerite", "text": "And with a selectmen's race on this year, everyone will have an opinion. Gordie will want to make a jingle.", "if": "quest.selectmen" },
        {
          "choose": [
            {
              "label": "Count them in public at Town Meeting",
              "hint": "(Marguerite holds them till then)",
              "then": [
                { "set": { "ballotPublic": true } },
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "marguerite", "text": "Any other business, Town Meeting night. I'll put them in an envelope and sit on it. Literally. In this town you have to." },
                { "toast": "Calendar: Town Meeting. Thirty-seven ballots under any other business.", "look": "marguerite" }
              ]
            },
            {
              "label": "Take them to Thaddeus Gorham, quietly",
              "then": [
                { "set": { "ballotEnd": "quiet" } },
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                {
                  "narrate": [
                    "That afternoon you sit at Thaddeus Gorham's kitchen table while he unfolds thirty-seven ballots one at a time with a butter knife.",
                    "Twenty-four for Gorham. Thirteen for Ellis. He was eleven behind, and now he's even. A tie, sixty-nine years late."
                  ]
                },
                { "enter": { "id": "gorham", "cast": "gorham", "at": [100, 164] } },
                {
                  "say": "gorham",
                  "text": [
                    "A tie. Well, I'll be. I spent sixty-nine years thinking I'd lost. I hadn't. I just hadn't won.",
                    "Don't tell anybody. Ellis has been dead since 1990, and his grandson coaches my great-grandson's Little League team. They're doing well."
                  ]
                },
                { "rep": 2 },
                { "remove": "gorham" }
              ]
            },
            {
              "label": "Leave history alone: the ballots go back in the vault, sealed",
              "hint": "(you keep the box)",
              "then": [
                { "set": { "ballotEnd": "sealed" } },
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "say": "marguerite", "text": "An envelope, a seal, a note: \"Not to be opened before 2056.\" Somebody can count them at the centenary. I'll be dead. I find that restful." },
                { "heat": -2 }
              ]
            }
          ]
        }
      ]
    },
    "ballotCount": {
      "title": "Town Meeting: thirty-seven ballots from 1956",
      "steps": [
        { "set": { "ballotEnd": "recount" } },
        { "enter": { "id": "gorham", "cast": "gorham", "at": [90, 164] } },
        {
          "narrate": [
            "Marguerite stands, takes an envelope out from under her, and explains. The hall goes quiet in a way it hasn't since the snowplow vote of 1998.",
            "The town clerk reads each ballot aloud. Gorham. Gorham. Ellis. Gorham. People start keeping score on the backs of their warrants.",
            "Twenty-four for Gorham. Thirteen for Ellis. Thaddeus Gorham was eleven votes behind in March 1956. As of tonight, he is level."
          ]
        },
        { "say": "gorham", "text": "A tie! Sixty-nine years and I get a tie! Somebody tell my wife. She's in the Burying Ground, but tell her." },
        { "narrate": "Gordie Haines leads a standing ovation for the tie, then looks thoughtfully at his own ballot box. Tess Bascombe looks thoughtfully at Gordie.", "if": "quest.selectmen" },
        { "narrate": "By a show of hands the meeting votes to make Thaddeus Gorham Honorary Selectman for Life, and to recount Precinct Two every March from now on, just in case." },
        { "rep": 4 },
        { "remove": "gorham" }
      ]
    }
  },
  "beats": [{ "drift": "ballot", "from": "1-2", "to": "3-1", "cast": "marv", "scene": "marvBallot" }],
  "errands": [
    {
      "id": "ballot-vault",
      "title": "Marguerite wants to see the ballots",
      "where": "the Town Hall vault",
      "scene": "ballotVault",
      "test": [{ "add": { "unique": "ballotBox" } }, { "set": { "ballotIn": true } }]
    }
  ],
  "vignettes": [
    { "hub": "meeting", "label": "Any other business: thirty-seven ballots from 1956", "scene": "ballotCount", "if": "flag.ballotPublic && !flag.ballotEnd" }
  ],
  "calendar": [
    { "id": "ballot-vault", "errand": "ballot-vault", "story": "ballot", "where": "The Town Hall vault", "title": "The 1956 ballots", "known": "flag.ballotIn" }
  ],
  "epilogue": [
    { "line": "Thaddeus Gorham, Honorary Selectman for Life, sits in the front row at every Town Meeting now. He votes on everything, twice, out of habit.", "if": "flag.ballotEnd == 'recount' || (!flag.ballotEnd && flag.ballotPublic)" },
    { "line": "Thaddeus Gorham knows he tied in 1956. So do you. He still cheers for the Ellis boy's Little League team.", "if": "flag.ballotEnd == 'quiet'" },
    { "line": "There is an envelope in the Town Hall vault marked \"Not to be opened before 2056.\"", "if": "flag.ballotEnd == 'sealed'" }
  ],
  "talk": {
    "by": "marguerite",
    "rumour": [
      "Somebody found a box of ballots from the 1956 election. Unopened. I haven't slept.",
      "Thaddeus Gorham lost that race by eleven votes. He's ninety-six. He mentions it."
    ],
    "react": { "recount": "A tie, sixty-nine years late, and the meeting was still home by eleven fifty-two. My finest hour.", "quiet": "Thaddeus came to the Grange on Thursday and won at cribbage, and smiled the whole time. He wouldn't say why. I know why.", "sealed": "The 1956 ballots are sealed in the vault till the centenary. I put the envelope on the top shelf. I put a note on the envelope. I put a second note on the note." },
    "sway": { "recount": { "marguerite": 3 }, "quiet": { "marguerite": 1 }, "sealed": { "marguerite": 1 } }
  },
  "outcome": [
    { "if": "flag.ballotEnd == 'quiet'", "ending": "quiet" },
    { "if": "flag.ballotEnd == 'sealed'", "ending": "sealed" },
    { "if": "flag.ballotEnd == 'recount' || flag.ballotPublic", "ending": "recount" }
  ]
});
