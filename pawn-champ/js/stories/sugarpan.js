// Pawn Champ - The Sugar Pan. Minor quest m73, batch P (docs/quests/MINOR.md#m73-the-sugar-pan).
// March, sugaring season. Abijah Nutting and Prue Lacasse tap the same row of maples on the line
// between their woodlots, and boil in the one sugarhouse past Hob's Marsh, in one 1890s copper pan.
// Whoever has the pan boils this year. Prue pawns it the week the sap starts to run. Hester Quint
// has the 1874 survey, and the boundary on it is a line nobody has wanted drawn for fifty years.
// The sugarhouse is drawn (js/places/sugarhouse.js, set-pieces PR #43); SUGARHOUSE.boiling is off
// while the pan is in your shop. Its scene spots and music are in js/quests/sugarpan.js.
// months: [6]: the sap runs in March, when the nights still freeze and the days don't.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "sugarpan",
  "kind": "minor",
  "title": "The Sugar Pan",
  "location": "sugarhouse",
  "months": [6],
  "rumour": "Two neighbors past Hob's Marsh share one sugar pan, and this year neither will let the other have it.",
  "endings": { "split": "Turn and Turn About", "sold": "Highest Bidder", "boundary": "The Line" },
  "outcome": "flag.sugarEnd",
  "about": [
    "A March story about neighbours. Prue Lacasse and Abijah Nutting boil sap in one sugarhouse past Hob's Marsh, from maples on a boundary nobody has ever drawn, and whoever has the 1890s copper pan boils. Prue pawns the pan to keep it from Abijah, who walks straight in after it and asks you to come and see the sap she's wasting (§{prueSugarPan}).",
    "At the cold sugarhouse (§{sugarHouse}) the 1874 survey, which Hester has been keeping for decades, shows the line runs through the third maple from the left. Hold the pan between them on alternate days (Turn and Turn About), sell it to Abijah for $220 (Highest Bidder), or have them draw the line, buy new pans, and leave the old one with you (The Line). Drawing the line leads to Town Meeting appointing a fence viewer for the first time since 1911 (§{fenceViewer})."
  ],
  "cast": {
    "abijah": {
      "name": "Abijah Nutting",
      "look": { "skin": "#e0b090", "hair": "#e8e8e8", "hs": 0, "coat": "#c83a2a", "style": "jacket", "trim": "#1a1a1a", "pants": "#3a4a5a", "hat": "beanie", "hatc": "#c83a2a", "beard": "#e8e8e8" }
    },
    "prue": {
      "name": "Prue Lacasse",
      "look": { "skin": "#d8a080", "hair": "#8a6a4a", "hs": 2, "coat": "#3a6a4a", "style": "puffer", "pants": "#3a3a42", "hat": "beanie", "hatc": "#e8c040" }
    }
  },
  "icons": {
    "sappan": [
      "............",
      "............",
      "............",
      ".kkkkkkkkkk.",
      "kaAAAAAAAAak",
      "kaAyyyyyyAak",
      "kaayyyyyyaak",
      ".kaaaaaaaak.",
      ".kkkkkkkkkk.",
      ".k........k.",
      "............",
      "............"
    ]
  },
  "uniques": {
    "sugarPan": {
      "name": "Copper sap pan, 1890s",
      "icon": "sappan",
      "cat": "curio",
      "guide": 180,
      "questKey": true,
      "tells": [
        "Riveted copper, four feet by two, blackened underneath from a hundred and thirty springs of fire.",
        "Two sets of initials scratched in the rim, a.n. and p.l., and under them, older, two more: e.n. and j.l."
      ]
    }
  },
  "scenes": {
    "prueSugarPan": {
      "title": "Prue pawns the sugar pan, and Abijah comes in after it",
      "customer": "prue",
      "steps": [
        {
          "say": "prue",
          "text": [
            "Prue Lacasse, out past the marsh. This is a sap pan. Copper, eighteen-nineties. Don't laugh, it's heavier than it looks, I nearly put my back out.",
            "Abijah Nutting and I boil in the same sugarhouse, off the same maples. The trees are on the line between his land and mine. Nobody's ever known whose they are. Our grandfathers didn't, either.",
            "Whoever has the pan boils. He had it last year. This year I've got it, and I'd rather it sat in a pawnshop than in his sugarhouse. A hundred, and I'll be back for it in April."
          ]
        },
        { "offer": { "unique": "sugarPan" }, "persona": "honest", "asking": 100, "min": 70 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "prue", "text": "Then it goes in my barn under a tarp, and the sap runs on the ground. Good. Let it." },
            { "leave": "prue" },
            { "end": true }
          ]
        },
        { "hook": "boiling", "with": false, "note": "the sugarhouse goes cold while the pan is in your shop" },
        { "set": { "sugarIn": true } },
        { "leave": "prue" },
        { "hook": "walkIn", "with": "abijah", "sets": ["abijah"] },
        {
          "say": "abijah",
          "text": [
            "Abijah Nutting. You've got my pan. Don't tell me you haven't, I watched her back the truck up.",
            "The sap's running now. Forty gallons a day, and it sours in three. Come out to the sugarhouse at noon tomorrow and I'll show you what she's wasting."
          ]
        },
        { "plan": "sugar-house" },
        { "leave": "abijah" }
      ]
    },
    "sugarHouse": {
      "title": "At the sugarhouse: who boils this year",
      "steps": [
        {
          "stage": "sugarhouse",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 172] },
            { "id": "abijah", "cast": "abijah", "at": [230, 168], "facingLeft": true },
            { "id": "prue", "cast": "prue", "at": [470, 170], "facingLeft": true }
          ]
        },
        { "narrate": "The sugarhouse is cold, and it shouldn't be. No steam from the cupola, the arch dark. On every maple a bucket is full to the lip and running over." },
        { "say": "abijah", "text": "Forty gallons a day. Forty gallons of sap makes one of syrup. That's a gallon a day she's pouring on the ground to spite me." },
        { "say": "prue", "text": "To spite YOU. He didn't let me near the pan last year. Not once. I sat in my kitchen and smelled him boiling." },
        {
          "if": "hook.hesterHere",
          "then": [
            { "enter": { "id": "hester", "cast": "hester", "at": [330, 172] } },
            { "say": "hester", "text": "I brought the 1874 survey. You asked me to, Abijah, in 1979, and I said \"when you mean it\". Here is the line. It goes through the third maple from the left. Through it." }
          ],
          "else": [
            { "narrate": "Abijah has the 1874 survey in a plastic sleeve. Hester Quint copied it for him in 1979, he says, \"for when I mean it\". The line runs through the third maple from the left. Through it." }
          ]
        },
        { "narrate": "E.N. and J.L. on the rim are their grandfathers. Ezra Nutting and Josette Lacasse. They boiled together for fifty years and never drew the line either." },
        { "find": "pan", "in": "stock", "match": { "uniqueId": "sugarPan" } },
        {
          "if": "!pan",
          "then": [
            { "say": "abijah", "text": "You haven't brought it. Then it's on the ground again today. Thank you for coming to look at it." },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Split the season: alternate days, and you hold the pan between",
              "hint": "(they each pay you $20)",
              "then": [
                { "edit": "pan", "set": { "questKey": false, "nosale": false } },
                { "set": { "sugarEnd": "split" } },
                { "hook": "boiling", "with": true },
                { "coin": 40, "why": "Held the sugar pan for both of them" },
                { "narrate": "Odd days Abijah, even days Prue. The pan goes back in the arch. By the time you leave, steam is pouring out of the cupola and they are arguing about whose day it is." },
                { "say": "prue", "text": "It's the thirty-first, Abijah. There isn't a thirtieth-and-a-half." },
                { "rep": 2 }
              ]
            },
            {
              "label": "Sell the pan to whichever of them pays more",
              "hint": "(Abijah offers $220)",
              "then": [
                { "edit": "pan", "set": { "questKey": false, "nosale": false } },
                { "set": { "sugarEnd": "sold" } },
                { "coin": 220, "why": "Sold the 1890s sugar pan to Abijah Nutting" },
                { "hook": "boiling", "with": true },
                { "say": "abijah", "text": "Two-twenty. Worth it. Prue, you can buy syrup off me like everybody else." },
                { "narrate": "Prue Lacasse gets in her truck and drives away without a word. The steam comes up anyway. It smells wonderful, which makes it worse." }
              ]
            },
            {
              "label": "Draw the line: Hester's survey, a fence, two pans",
              "hint": "(you keep the old pan; they buy new ones)",
              "then": [
                { "edit": "pan", "set": { "questKey": false, "nosale": false } },
                { "set": { "sugarEnd": "boundary" } },
                { "add": { "unique": "sugarPan" }, "as": "kept" },
                { "edit": "kept", "set": { "questKey": false, "paid": 0 } },
                { "narrate": "You stand in the snowmelt while they pace the line. At the third maple from the left, Abijah ties a ribbon round the trunk at shoulder height. Prue ties another one round it, lower." },
                { "say": "abijah", "text": "Half a tree each. We'll buy steel pans in Vermont. They're better anyway." },
                { "say": "prue", "text": "They're not better. They're newer." },
                { "narrate": "The old copper pan comes back to your shop for good. On the way out you see them both, separately, touching the third maple." },
                { "rep": 1 }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    },
    "fenceViewer": {
      "title": "Town Meeting, Article 31: a fence viewer",
      "steps": [
        {
          "narrate": [
            "Article 31: to appoint a fence viewer, an office the town hasn't filled since 1911, to view the new line between the Nutting and Lacasse woodlots.",
            "Abijah Nutting and Prue Lacasse sit on opposite sides of the hall and both vote yes. Afterwards they are seen in the car park, sharing a thermos."
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "sugarpan", "from": "1-2", "to": "2-4", "cast": "prue", "scene": "prueSugarPan" }],
  "errands": [
    {
      "id": "sugar-house",
      "title": "Abijah wants you at the sugarhouse",
      "where": "the sugarhouse past Hob's Marsh",
      "scene": "sugarHouse",
      "test": [{ "add": { "unique": "sugarPan" } }, { "set": { "sugarIn": true } }]
    }
  ],
  "vignettes": [
    { "hub": "warrant", "label": "Article 31: a fence viewer for the Nutting-Lacasse line", "crossing": true, "if": "flag.sugarEnd == 'boundary'", "scene": "fenceViewer", "note": "Town Meeting (M32, js/stories/warrant.js): with the line drawn, the neighbors need a fence viewer." }
  ],
  "calendar": [
    { "id": "sugar-house", "errand": "sugar-house", "story": "sugarpan", "where": "The sugarhouse", "title": "The sap is running", "known": "flag.sugarIn" }
  ],
  "epilogue": [
    { "line": "The sugarhouse past Hob's Marsh boiled every day in March, alternately. Abijah and Prue each gave you a quart. The quarts are not the same color, and they each say theirs is darker.", "if": "flag.sugarEnd == 'split'" },
    { "line": "Abijah Nutting boiled alone this spring. Prue Lacasse tapped the trees on her side and boils on a turkey fryer in her yard.", "if": "flag.sugarEnd == 'sold'" },
    { "line": "There's a ribbon round the third maple from the left past Hob's Marsh, and two new steel pans. The old copper one sits on your shelf with four sets of initials on its rim.", "if": "flag.sugarEnd == 'boundary'" }
  ],
  "talk": {
    "by": "hester",
    "rumour": [
      "Abijah Nutting and Prue Lacasse share a sugarhouse and a pan past the marsh. Their grandfathers shared it too. Nobody has ever said whose trees they are.",
      "I have the 1874 survey. I have had it for forty-six years, waiting for one of them to ask."
    ],
    "react": { "split": "Odd days and even days. They brought me a quart each and asked me to say which was better. I am a librarian, not a fool.", "sold": "Abijah has the pan and Prue has a turkey fryer. The survey is still in my drawer. They'll ask, one of them, when they're old enough.", "boundary": "They drew the line at last. Through the third maple. I filed the survey with a note: \"At last\". Then I crossed it out. Then I wrote it again." }
  }
});
