// Pawn Champ - The Ninth Verse: a Saint Brine's hymnal with a verse nobody printed.
// Minor quest m56, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Heard from Father Ignatius; Orla Penney sells it from a house clearance; a lunch errand at choir practice.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "hymnal",
  "kind": "minor",
  "group": "deep",
  "title": "The Ninth Verse",
  "location": "saintbrines",
  "rumour": "A hymnal from a house clearance has one verse more than it should.",
  "endings": { "torn": "Torn Out", "locked": "Locked Away", "sung": "All Nine Verses" },
  "about": [
    "A short uncanny story. Father Ignatius wants back an old Saint Brine's hymnal that went out in a house clearance, because its fishermen's hymn has a ninth verse none of the others have, and a choir member who tried it won't say what happened (§{ignatiusHymnal}). Orla Penney, who can't face him, sells it to you instead (§{orlaHymnal}).",
    "At noon choir practice (§{hymnalChoir}) Ignatius explains the old congregation sang the ninth verse to the harbor every Sunday until 1871, and the bell buoy rang in time. Let the choir sing all nine verses and feel it answered (a Look; All Nine Verses), tear the verse out to be burned (Torn Out), or give him the book to lock in the vestry safe (Locked Away)."
  ],
  "cast": {
    "orla": {
      "name": "Orla Penney",
      "look": { "skin": "#e8c0a0", "hair": "#a84a2a", "hs": 4, "coat": "#4a6a4a", "style": "puffer", "pants": "#3a3a42", "bag": "#c8a050" }
    }
  },
  "icons": {
    "hymnal": [
      "............",
      "..kkkkkkkk..",
      ".krrrrrrrrk.",
      ".krRRRRRRrk.",
      ".krrryyrrrk.",
      ".krryyyyrrk.",
      ".krrryyrrrk.",
      ".krrryyrrrk.",
      ".krrrrrrrrk.",
      ".kccccccccck",
      ".kkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "hymnal": {
      "name": "A Saint Brine's hymnal",
      "icon": "hymnal",
      "cat": "curio",
      "guide": 20,
      "questKey": true,
      "condLabel": "Well thumbed",
      "tells": [
        "A red hymnal, SAINT BRINE'S stamped on the cover, the spine broken at the fishermen's hymn.",
        "The fishermen's hymn has eight verses. This copy has nine. The ninth is handwritten, in very old brown ink, and it scans perfectly."
      ]
    }
  },
  "soundings": { "hymnal-sung": "Hollow Neck once sang to the Neck on purpose, every Sunday, and the bell buoy answered. Somebody decided to stop." },
  "overheard": [
    { "line": "Puzzled: \"The bell buoy rang at choir practice. On the beat. There wasn't a breath of wind.\"" }
  ],
  "scenes": {
    "ignatiusHymnal": {
      "title": "Father Ignatius: a hymnal with a verse too many",
      "customer": "ignatius",
      "steps": [
        {
          "say": "ignatius",
          "text": [
            "A small thing, and probably nothing. One of our old hymnals went out in the Penney house clearance, and Orla Penney rang to say it's got a verse in it that isn't in any of ours.",
            "I'd like it back, if it comes your way. The choir would rather I didn't. One of them tried the verse, apparently. I don't know what happened. They won't say."
          ]
        },
        { "set": { "hymnalHeard": true } },
        { "leave": "ignatius" }
      ]
    },
    "orlaHymnal": {
      "title": "Orla sells the hymnal",
      "customer": "orla",
      "steps": [
        {
          "say": "orla",
          "text": [
            "Orla Penney. I'm clearing my aunt's house, and I'm selling everything, and especially this.",
            "A hymnal from Saint Brine's. Father Ignatius wants it, but I can't face him. Go on. Turn to the fishermen's hymn. Count the verses."
          ]
        },
        { "offer": { "unique": "hymnal" }, "persona": "honest", "asking": 15, "min": 8 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "hymnalBought": true } },
            { "say": "orla", "text": "The choir practises at noon on weekdays. Father Ignatius will be there. Give it to him, or don't. Just don't sing it in my aunt's kitchen." },
            { "plan": "hymnal-choir" },
            { "toast": "Calendar: choir practice at Saint Brine's, at lunch", "look": "ignatius" }
          ]
        },
        { "leave": "orla" }
      ]
    },
    "hymnalChoir": {
      "title": "Choir practice",
      "steps": [
        {
          "stage": "saintbrines",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [130, 166] },
            { "id": "ignatius", "cast": "ignatius", "at": [220, 160], "facingLeft": true }
          ]
        },
        { "narrate": "Choir practice at Saint Brine's, at lunch: six singers, a piano with three dead keys, and a plate of biscuits nobody is eating." },
        { "find": "h", "in": "stock", "match": { "uniqueId": "hymnal" } },
        {
          "if": "!h",
          "then": [
            { "say": "ignatius", "text": "No hymnal? Then stay and sing with us. We're short a baritone. We're always short a baritone." },
            { "end": true }
          ]
        },
        {
          "say": "ignatius",
          "text": [
            "There it is. My predecessor's predecessor took the ninth verse out of every book. All but this one, it seems.",
            "The parish records say the old congregation sang it every Sunday, facing the harbor, and the bell buoy rang in time. Then in 1871 they stopped. The records don't say why."
          ]
        },
        {
          "choose": [
            {
              "label": "Stay while the choir sings all nine verses",
              "hint": "(Look)",
              "then": [
                { "take": "h" },
                {
                  "narrate": [
                    "They sing it. Eight verses about the sea, and then the ninth, which isn't about the sea; it's sung to it. Out in the harbor the bell buoy rings, once a line, on the beat, and the floor of the hall is warm under your feet.",
                    "At the last line every singer stops at once, as if someone had answered. Nobody wants a biscuit. Father Ignatius locks the book in the vestry safe without a word."
                  ]
                },
                { "sounding": "hymnal-sung" },
                { "set": { "hymnalEnd": "sung" } }
              ]
            },
            {
              "label": "Tear the ninth verse out",
              "then": [
                { "take": "h" },
                { "narrate": "The page comes out easily, as if it was waiting to. Father Ignatius burns it in the vestry sink and gives the rest of the book back to the choir, who are visibly relieved." },
                { "set": { "hymnalEnd": "torn" } }
              ]
            },
            {
              "label": "Give the book to Father Ignatius to lock away",
              "hint": "(rep +3)",
              "then": [
                { "take": "h" },
                { "rep": 3 },
                { "say": "ignatius", "text": "Thank you. It goes in the safe with the parish silver and the 1871 vestry minutes. I have a feeling they'll get on." },
                { "set": { "hymnalEnd": "locked" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "hymnal-ignatius", "from": "2-1", "to": "2-4", "cast": "ignatius", "scene": "ignatiusHymnal" },
    { "drift": "hymnal-orla", "from": "2-5", "to": "3-4", "cast": "orla", "scene": "orlaHymnal", "if": "flag.hymnalHeard" }
  ],
  "errands": [
    {
      "id": "hymnal-choir",
      "title": "Choir practice",
      "where": "Saint Brine's",
      "scene": "hymnalChoir",
      "test": [{ "set": { "hymnalBought": true } }, { "add": { "unique": "hymnal" } }]
    }
  ],
  "calendar": [
    { "id": "hymnal-choir", "errand": "hymnal-choir", "story": "hymnal", "where": "Saint Brine's", "title": "Choir practice", "known": "flag.hymnalBought" }
  ],
  "mornings": [
    { "find": "h", "in": "stock", "match": { "uniqueId": "hymnal", "questKey": true } },
    {
      "if": "h && errand.hymnal-choir == -1",
      "note": "skipped the errand: it's just stock now",
      "then": [{ "edit": "h", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "outcome": "flag.hymnalEnd"
});
