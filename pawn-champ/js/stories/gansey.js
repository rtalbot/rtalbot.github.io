// Pawn Champ - The Gansey: a fisherman's sweater in a pattern no family in town knits.
// Minor quest m54, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Heard from Tess; Jonah Iver sells it; a lunch errand at the Historical Society.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "gansey",
  "kind": "minor",
  "group": "deep",
  "title": "The Gansey",
  "location": "historical",
  "rumour": "Someone found a fisherman's sweater on their step, knitted in a pattern no family in town uses.",
  "endings": { "society": "In the Collection", "jonah": "Back to Jonah", "burned": "Burned" },
  "about": [
    "A quiet uncanny story. Tess explains that every fishing family once knitted its own gansey pattern so the sea's dead could be named, and that Jonah Iver found one on his step, dry after a night of rain, in a pattern nobody knows (§{tessGansey}). Jonah sells it to you: it fits him exactly, and after three nights in it he keeps waking up at the breakwater, wet (§{jonahGansey}).",
    "At the Historical Society (§{ganseySociety}), Quayle finds the pattern once in 1846: worn by Absalom Tarr, who walked out of the sea, lived on Chapel Street forty years keeping bees, and walked back in. His last letter (a Look) says he was sent up to see if the town was ready. Give the gansey to the Society (In the Collection), leave it on Jonah's step for him to wear (Back to Jonah), or burn it, green, in the grate (Burned)."
  ],
  "cast": {
    "jonah": {
      "name": "Jonah Iver",
      "look": { "skin": "#e8c8a8", "hair": "#c8a060", "hs": 4, "coat": "#2a3a4a", "style": "hoodie", "pants": "#3a3a42" }
    }
  },
  "icons": {
    "gansey": [
      "............",
      "..kk....kk..",
      ".kbbkkkkbbk.",
      "kbbbBbbBbbbk",
      "kbbBbBBbBbbk",
      "kkbbBbbBbbkk",
      "..kbbBBbbk..",
      "..kbBbbBbk..",
      "..kbbBBbbk..",
      "..kbBbbBbk..",
      "..kkkkkkkk..",
      "............"
    ]
  },
  "uniques": {
    "gansey": {
      "name": "A gansey in a strange pattern",
      "icon": "gansey",
      "cat": "art",
      "guide": 50,
      "questKey": true,
      "condLabel": "Bone dry",
      "tells": [
        "Navy wool, oiled, knitted tight enough to turn rain. A fisherman's gansey.",
        "The pattern across the chest is steps, going down, over and over. It's always a little damp at the cuffs."
      ]
    }
  },
  "soundings": { "gansey-letter": "In 1846 a man walked out of the sea at the Neck in a sweater no one had knitted, and lived in Hollow Neck forty years, and then walked back in." },
  "overheard": [
    { "line": "Low voice: \"Jonah Iver's been swimming off the breakwater at night. In October.\"" }
  ],
  "scenes": {
    "tessGansey": {
      "title": "Tess: a sweater on Jonah's step",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "You know about ganseys? Every fishing family used to knit its own pattern. So when the sea gave a man back, you'd know whose he was.",
            "Jonah Iver found one folded on his doorstep last week. Dry as toast, after a night of rain. I don't know the pattern. Dot doesn't know it. Dot knows everything.",
            "He's been trying to sell it. I told him to bring it to you."
          ]
        },
        { "set": { "ganseyHeard": true } },
        { "leave": "tess" }
      ]
    },
    "jonahGansey": {
      "title": "Jonah sells the gansey",
      "customer": "jonah",
      "steps": [
        {
          "say": "jonah",
          "text": [
            "Tess sent me. It's this. It fits me exactly, which is weird, because nothing fits me.",
            "I've worn it three nights. I keep waking up at the breakwater. In it. Wet. I'd rather have the cash."
          ]
        },
        { "offer": { "unique": "gansey" }, "persona": "honest", "asking": 40, "min": 25 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "ganseyBought": true } },
            { "say": "jonah", "text": "The Historical Society has an old pattern book. Mr. Quayle could tell you whose it is. I don't want to know." },
            { "plan": "gansey-society" },
            { "toast": "Calendar: the Historical Society, at lunch", "look": "quayle" }
          ]
        },
        { "leave": "jonah" }
      ]
    },
    "ganseySociety": {
      "title": "The pattern book",
      "steps": [
        {
          "stage": "historical",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 166] },
            { "id": "quayle", "cast": "quayle", "at": [234, 158], "facingLeft": true }
          ]
        },
        { "find": "g", "in": "stock", "match": { "uniqueId": "gansey" } },
        {
          "if": "!g",
          "then": [
            { "say": "quayle", "text": "No sweater? Then I'll have my lunch. It's egg." },
            { "end": true }
          ]
        },
        { "say": "quayle", "text": "Ganseys! Every family's pattern is in here, back to the 1790s. Let's see." },
        { "narrate": "He turns pages of knitting charts, one after another. Then he stops, and puts his finger on one, and takes it away again." },
        {
          "say": "quayle",
          "text": [
            "1846. Only once. \"Worn by the man who came up out of the sea at the Neck on the ninth of March, and gave his name as Absalom Tarr.\" He lived on Chapel Street forty years. Married. Kept bees.",
            "In 1886 he walked back into the harbor in it. We have his last letter, if you'd like to read it. I never have."
          ]
        },
        {
          "choose": [
            {
              "label": "Read Absalom Tarr's last letter",
              "hint": "(Look)",
              "then": [
                { "narrate": "Small brown handwriting: \"I was sent up to see whether you were ready. You were not. You are kind and you are not ready. I have told them so, and I am going down to tell them again. Leave the sweater on the step for whoever is next. They will need it.\"" },
                { "sounding": "gansey-letter" }
              ]
            },
            { "label": "Leave it in its folder" }
          ]
        },
        {
          "choose": [
            {
              "label": "Give it to the Society",
              "hint": "(+$40, rep +3)",
              "then": [
                { "take": "g" },
                { "coin": 40, "why": "The Historical Society bought the gansey" },
                { "rep": 3 },
                { "set": { "ganseyEnd": "society" } },
                { "say": "quayle", "text": "It'll go in the case beside his bee skep. Thank you. I think." }
              ]
            },
            {
              "label": "Give it back to Jonah",
              "hint": "(rep +2)",
              "then": [
                { "take": "g" },
                { "rep": 2 },
                { "set": { "ganseyEnd": "jonah" } },
                { "narrate": "You leave it folded on Jonah's step on the way back. That night he swims out past the breakwater and back, and he's at work early the next morning, happier than anyone has seen him." }
              ]
            },
            {
              "label": "Burn it in the Society's grate",
              "then": [
                { "take": "g" },
                { "set": { "ganseyEnd": "burned" } },
                { "narrate": "The wool takes three matches to catch. When it does, it burns green, and the room smells of low tide for a week." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "gansey-tess", "from": "2-1", "to": "2-2", "cast": "tess", "scene": "tessGansey" },
    { "drift": "gansey-jonah", "from": "2-3", "to": "3-3", "cast": "jonah", "scene": "jonahGansey", "if": "flag.ganseyHeard" }
  ],
  "errands": [
    {
      "id": "gansey-society",
      "title": "The pattern book",
      "where": "the Historical Society",
      "scene": "ganseySociety",
      "test": [{ "set": { "ganseyBought": true } }, { "add": { "unique": "gansey" } }]
    }
  ],
  "calendar": [
    { "id": "gansey-society", "errand": "gansey-society", "story": "gansey", "where": "The Historical Society", "title": "The pattern book", "known": "flag.ganseyBought" }
  ],
  "mornings": [
    { "find": "g", "in": "stock", "match": { "uniqueId": "gansey", "questKey": true } },
    {
      "if": "g && errand.gansey-society == -1",
      "note": "skipped the errand: it's just stock now",
      "then": [{ "edit": "g", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "epilogue": [
    { "line": "Jonah Iver swims every night, all winter. He says the water out past the breakwater is warm. Nobody checks.", "if": "flag.ganseyEnd == 'jonah'" }
  ],
  "outcome": "flag.ganseyEnd"
});
