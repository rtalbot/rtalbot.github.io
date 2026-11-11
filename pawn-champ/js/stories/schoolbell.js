// Pawn Champ - The School Bell. Minor quest m34, batch I (docs/quests/MINOR.md#m34-the-school-bell).
// Saint Brine's school bell went missing from the belfry in 1971, and someone has confessed to it at
// Saint Brine's every Lent since. It turns up in a dead janitor's cellar, and a retired insurance man
// wants to buy it before anyone asks why.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/schoolbell.js.
defineStory({
  "id": "schoolbell",
  "kind": "minor",
  "title": "The School Bell",
  "location": "saintbrines",
  "rumour": "Somebody stole the school bell out of Saint Brine's belfry in 1971, and somebody confesses to it every single Lent.",
  "endings": { "rung": "Ring True", "quiet": "Hush", "sold": "Sold for Scrap" },
  "about": [
    "A comic story about a fifty-year-old prank. Delia Weller, clearing out her grandfather's house (he was the Saint Brine's janitor for forty years), sells you a heavy bell from the cellar (§{bellDelia}). The next day Clifford Ames, retired, offers $150 for it, no questions asked (§{bellClifford}). Ask anyway and he confesses: he and the Fennimore twins stole the school bell from the belfry in 1971, the janitor kept it safe until they owned up, and they never did, though Clifford has confessed it anonymously every Lent since.",
    "Sell it to him to hide under a better blanket (Hush), or take it back to Saint Brine's at noon recess (§{bellReturn}), where Clifford, if you talked him into it, owns up to Father Ignatius, who has always known from the Boston accent, and rings it for the children (Ring True). If the bell is sold to anyone else, the ending is Sold for Scrap."
  ],
  "cast": {
    "delia": {
      "name": "Delia Weller",
      "look": { "skin": "#c89070", "hair": "#3a2a1e", "hs": 5, "coat": "#7a6a9a", "style": "puffer", "pants": "#3a3a42", "bag": "#5a4a3a" }
    },
    "clifford": {
      "name": "Clifford Ames",
      "look": { "skin": "#f0d0b8", "hair": "#d8d8d8", "hs": 0, "coat": "#8a7a5a", "style": "jacket", "trim": "#5a4a3a", "pants": "#4a4a40", "glasses": "#2a2a2e", "hat": "wide", "hatc": "#5a5a4a" }
    }
  },
  "icons": {
    "brassbell": [
      ".....kk.....",
      ".....kk.....",
      "....kyyk....",
      "...kyYyyk...",
      "...kyYyyk...",
      "..kyYyyyyk..",
      "..kyYyyyyk..",
      ".kyYyyyyyok.",
      "kkkkkkkkkkkk",
      ".....kok....",
      "......k.....",
      "............"
    ]
  },
  "uniques": {
    "brineBell": {
      "name": "Saint Brine's school bell",
      "icon": "brassbell",
      "cat": "curio",
      "guide": 110,
      "condLabel": "Tarnished",
      "tells": [
        "Cast into the brass: SAINT BRINE'S SCHOOL - 1889 - RING TRUE.",
        "The clapper is wrapped in a sock, tied on with fishing line. Somebody wanted it quiet."
      ]
    }
  },
  "overheard": [
    { "line": "Laughing: \"Somebody's confessed to stealing the Saint Brine's bell every Lent since 1971. Father Ignatius says it's always the same somebody.\"" }
  ],
  "scenes": {
    "bellDelia": {
      "title": "Delia Weller brings in a bell from the cellar",
      "customer": "delia",
      "steps": [
        {
          "say": "delia",
          "text": [
            "Delia Weller. I'm clearing out my grandfather's house on Pond Road. He was the janitor at Saint Brine's for forty years.",
            "This was in the cellar under a horse blanket. It weighs as much as I do. I'd like it to be someone else's problem."
          ]
        },
        { "offer": { "unique": "brineBell" }, "persona": "honest", "asking": 50, "min": 35 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "bellIn": true } },
            { "say": "delia", "text": "Thanks. I swear it rang once on its own, on the stairs. Probably the stairs." }
          ],
          "else": [{ "say": "delia", "text": "Okay. It's going back under the blanket." }]
        },
        { "leave": "delia" }
      ]
    },
    "bellClifford": {
      "title": "Clifford Ames wants the bell, no questions asked",
      "customer": "clifford",
      "steps": [
        { "find": "bell", "in": "stock", "match": { "uniqueId": "brineBell" } },
        { "say": "clifford", "text": "Clifford Ames. Retired. Insurance. I'll give you a hundred and fifty dollars for the bell you bought yesterday. Cash. Today. Please don't ask me why." },
        {
          "if": "!bell",
          "then": [
            { "say": "clifford", "text": "You don't have it? Oh. Oh, that's worse." },
            { "leave": "clifford" },
            { "end": true }
          ]
        },
        { "view": { "counterIcon": "brassbell" } },
        {
          "choose": [
            { "label": "Sell it to him ($150)" },
            {
              "label": "\"Mr. Ames. Were you the boy who took it?\"",
              "then": [
                {
                  "say": "clifford",
                  "text": [
                    "I was thirteen. Sister Perpetua kept us in for ringing it at the wrong time, so we took it. Me and the Fennimore twins. We got it down the ladder and then we didn't know what to do with it.",
                    "Mr. Weller caught us. He said he'd keep it safe till we owned up. We never owned up. The twins moved to Florida. I go to confession every Lent and tell whoever's in the box. Father Ignatius thinks half the town did it."
                  ]
                },
                { "set": { "bellConfessed": true } },
                {
                  "choose": [
                    { "label": "Sell it to him ($150)" },
                    {
                      "label": "\"Ring it back yourself, at Saint Brine's.\"",
                      "then": [
                        { "set": { "bellClifford": true } },
                        { "plan": "bell-return" },
                        { "say": "clifford", "text": "Recess is at noon. {placed:bell-return}. If I'm going to do it, I might as well do it in front of the children." },
                        { "toast": "Calendar: Saint Brine's at noon, {placed:bell-return}", "look": "clifford" },
                        { "view": { "counterIcon": null } },
                        { "leave": "clifford" },
                        { "end": true }
                      ]
                    },
                    { "label": "Not for sale" }
                  ],
                  "as": "asked"
                }
              ]
            },
            { "label": "Not for sale" }
          ],
          "as": "ask"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "ask == 0 || asked == 0",
          "then": [
            { "set": { "bellEnd": "quiet" } },
            { "sell": "bell", "to": "clifford" },
            { "coin": 150, "why": "Sold the Saint Brine's bell to Clifford Ames" },
            { "refresh": "panel" },
            { "say": "clifford", "text": "Thank you. It's going back under a blanket. A better blanket." }
          ],
          "else": [
            { "plan": "bell-return" },
            { "say": "clifford", "text": "I see. Then I suppose it goes back to Saint Brine's. I suppose I'll hear about it." },
            { "toast": "Calendar: take the bell back to Saint Brine's, {placed:bell-return} at noon", "look": "clifford" }
          ]
        },
        { "leave": "clifford" }
      ]
    },
    "bellReturn": {
      "title": "The bell goes home",
      "steps": [
        {
          "stage": "saintbrines",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 168] },
            { "id": "ignatius", "cast": "ignatius", "at": [200, 162], "facingLeft": true },
            { "id": "child", "look": "kid", "at": [150, 170] },
            { "id": "kids", "look": "kid", "at": [[236, 166], [256, 170], [276, 166]], "facingLeft": true }
          ]
        },
        { "find": "bell", "in": "stock", "match": { "uniqueId": "brineBell" } },
        { "narrate": "Saint Brine's at noon. Recess has been moved indoors on account of drizzle. Twenty children, one priest, and a bucket under the roof." },
        {
          "if": "!bell",
          "then": [
            { "narrate": "You came without the bell. Father Ignatius gives you a biscuit anyway." },
            { "set": { "bellEnd": "sold" }, "if": "!flag.bellEnd" },
            { "end": true }
          ]
        },
        { "say": "ignatius", "text": "Is that... that's our bell. I've been told about that bell for twenty-two years. In the box. In a disguised voice." },
        { "take": "bell" },
        { "refresh": "panel" },
        { "set": { "bellEnd": "rung" } },
        {
          "if": "flag.bellClifford",
          "then": [
            { "enter": { "id": "clifford", "cast": "clifford", "at": [130, 166] } },
            { "say": "clifford", "text": "Father. It was me. And the Fennimore twins, but mostly me. Every Lent. Same voice. I did the voice." },
            { "say": "ignatius", "text": "Clifford. I know. I've always known. Nobody else confesses in a Boston accent." },
            { "narrate": "Clifford takes the sock off the clapper and rings it, once, hard. Twenty children cheer as if it was the last day of school." },
            { "rep": 5, "why": "Brought the Saint Brine's bell home" }
          ],
          "else": [
            { "narrate": "You hand the bell to Father Ignatius. He takes the sock off the clapper and lets the smallest child ring it. She rings it eleven times." },
            { "rep": 4, "why": "Brought the Saint Brine's bell home" }
          ]
        },
        { "hook": "poorBox", "if": "bell.paid", "with": "Father Ignatius, from the poor box, against your protests", "note": "What you paid for it, up to $40." }
      ]
    }
  },
  "beats": [
    { "at": "3-1", "cast": "delia", "scene": "bellDelia" },
    { "at": "3-2", "cast": "clifford", "scene": "bellClifford", "if": "flag.bellIn && !flag.bellEnd" }
  ],
  "errands": [
    {
      "id": "bell-return",
      "title": "The bell goes home",
      "where": "Saint Brine's",
      "scene": "bellReturn",
      "test": [
        { "set": { "bellIn": true } },
        { "roll": { "bellClifford": [true, false] } },
        { "add": { "unique": "brineBell", "paid": 40 } }
      ]
    }
  ],
  "calendar": [
    { "id": "bell-return", "errand": "bell-return", "story": "schoolbell", "where": "Saint Brine's", "title": "The bell goes home", "known": "flag.bellIn", "scene": "bellReturn" }
  ],
  "sold": { "brineBell": [{ "set": { "bellEnd": "sold" }, "if": "!flag.bellEnd" }] },
  "epilogue": [
    { "line": "The Saint Brine's bell rings for recess again. Clifford Ames goes to confession at Lent and finds he has nothing to say.", "if": "flag.bellEnd == 'rung'" },
    { "line": "Somewhere in Hollow Neck a school bell sits under a good blanket. Every Lent, a Boston accent confesses in Saint Brine's.", "if": "flag.bellEnd == 'quiet'" },
    { "line": "Saint Brine's school bell went to someone who didn't know what it was. It rings for them now.", "if": "flag.bellEnd == 'sold'" }
  ],
  "outcome": "flag.bellEnd"
});
