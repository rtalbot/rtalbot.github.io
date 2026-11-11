// Pawn Champ - The Lantern Slides: a 1911 Sunday-school picnic, and one child too many.
// Minor quest m57, the deep set (docs/quests/MINOR.md#the-deep-set-m53-to-m60-proposed).
// Heard from Hester Quint; Ivo Lorimer sells the box; a lunch errand at the Athenaeum.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "slides",
  "kind": "minor",
  "group": "deep",
  "title": "The Lantern Slides",
  "location": "athenaeum",
  "rumour": "Somebody has magic-lantern slides of a 1911 picnic on Gannet Island.",
  "endings": { "sold": "In the Athenaeum", "smashed": "Three Broken Slides", "turned": "One Turned Round" },
  "about": [
    "A short uncanny story. Hester tells you Ivo Lorimer found a box of magic-lantern slides of a 1911 Saint Brine's Sunday-school picnic on Gannet Island, and asks you to buy them and bring them to the Athenaeum (§{hesterSlides}). Ivo sells them, saying the last three are wrong somehow and his daughter won't have them in the house (§{ivoSlides}).",
    "At the lantern show (§{slidesShow}) the register says nineteen children went, and the group photo shows nineteen. The last three slides show a second hill on the island that isn't there now, with the children standing on it facing away: twenty of them. Put the last slide in again and see that one has turned round (a Look; One Turned Round), smash the three slides and sell the rest (Three Broken Slides), or just sell the box to the Athenaeum (In the Athenaeum)."
  ],
  "cast": {
    "ivo": {
      "name": "Ivo Lorimer",
      "look": { "skin": "#d8b090", "hair": "#3a2a1e", "hs": 1, "coat": "#7a5a3a", "style": "vest", "vest": "#4a3a2a", "pants": "#3a3a42", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "slides": [
      "............",
      ".kkkkkkkkkk.",
      ".kwwwwwwwwk.",
      ".kwkkkkkkwk.",
      ".kwkBBBBkwk.",
      ".kwkBpPBkwk.",
      ".kwkBBBBkwk.",
      ".kwkkkkkkwk.",
      ".kwwwwwwwwk.",
      ".kWWWWWWWWk.",
      ".kkkkkkkkkk.",
      "............"
    ]
  },
  "uniques": {
    "slides": {
      "name": "Magic-lantern slides, 1911",
      "icon": "slides",
      "cat": "art",
      "guide": 70,
      "questKey": true,
      "condLabel": "Glass, a few cracked",
      "tells": [
        "Thirty glass slides in a wooden box: SAINT BRINE'S SUNDAY SCHOOL, GANNET ISLAND, JULY 1911.",
        "Held to the window, the last three show the island with a second hill on it. There is only one hill on Gannet Island."
      ]
    }
  },
  "soundings": { "slides-turned": "Something under Gannet Island came up for a picnic in 1911, and stood with the children, and wasn't counted." },
  "overheard": [
    { "line": "Thoughtfully: \"Hester Quint's doing a lantern-slide show at lunch. Old Gannet Island. She asked me how many children I could count.\"" }
  ],
  "scenes": {
    "hesterSlides": {
      "title": "Hester: Ivo's lantern slides",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "Ivo Lorimer found a box of lantern slides in his barn. Saint Brine's Sunday school, Gannet Island, 1911. The Athenaeum would very much like them.",
            "He'll bring them to you, not me. He thinks I'll lecture him. I will. If you buy them, come to the Athenaeum at lunch and I'll put them on the old projector."
          ]
        },
        { "set": { "slidesHeard": true } },
        { "leave": "hester" }
      ]
    },
    "ivoSlides": {
      "title": "Ivo sells the slides",
      "customer": "ivo",
      "steps": [
        {
          "say": "ivo",
          "text": [
            "Ivo Lorimer. Barn clear-out. Glass slides, the old projector kind. A church picnic. Pretty, mostly.",
            "The last three are wrong somehow. I don't know. My daughter won't have them in the house."
          ]
        },
        { "offer": { "unique": "slides" }, "persona": "honest", "asking": 45, "min": 30 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "slidesBought": true } },
            { "plan": "slides-show" },
            { "toast": "Calendar: the Athenaeum, at lunch", "look": "hester" }
          ]
        },
        { "leave": "ivo" }
      ]
    },
    "slidesShow": {
      "title": "The lantern show",
      "steps": [
        {
          "stage": "athenaeum",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 166] },
            { "id": "hester", "cast": "hester", "at": [220, 160], "facingLeft": true }
          ]
        },
        { "find": "box", "in": "stock", "match": { "uniqueId": "slides" } },
        {
          "if": "!box",
          "then": [
            { "say": "hester", "text": "You've sold them. To whom? Never mind. I'll find out. I always find out." },
            { "end": true }
          ]
        },
        { "narrate": "Hester draws the Athenaeum's curtains and lights the old brass projector. Children in white on a ferry deck. A picnic blanket. A schoolmistress with a parasol. The island's one hill, and the schoolhouse." },
        { "say": "hester", "text": "Nineteen children went, according to the Sunday-school register. Here's the group photograph. Count them." },
        { "narrate": "Nineteen. Then she puts in the last three slides. The island has a second hill, low and dark and smooth, where the scrub pines are now. The children are standing on it in a line, facing away from the camera." },
        { "say": "hester", "text": "Count them again." },
        { "narrate": "Twenty." },
        {
          "choose": [
            {
              "label": "Put the last slide in again",
              "hint": "(Look; then the Athenaeum buys the box, +$70)",
              "then": [
                { "narrate": "The same slide. The same line of twenty children on the hill that isn't there. Except one of them has turned round. It doesn't have a face, exactly. It has the idea of one, as if it had heard about faces." },
                { "sounding": "slides-turned" },
                { "say": "hester", "text": "I'm going to keep these in the basement. With the lights on." },
                { "take": "box" },
                { "coin": 70, "why": "Sold the lantern slides to the Athenaeum" },
                { "set": { "slidesEnd": "turned" } }
              ]
            },
            {
              "label": "Smash the last three slides",
              "hint": "(+$40 for the rest)",
              "then": [
                { "take": "box" },
                { "coin": 40, "why": "Sold the rest of the slides to the Athenaeum" },
                { "narrate": "They break like any glass. Hester sweeps them up without a word, buys the other twenty-seven for forty dollars, and opens the curtains very wide." },
                { "set": { "slidesEnd": "smashed" } }
              ]
            },
            {
              "label": "Sell the box to the Athenaeum",
              "hint": "(+$70)",
              "then": [
                { "take": "box" },
                { "coin": 70, "why": "Sold the lantern slides to the Athenaeum" },
                { "say": "hester", "text": "Thank you. They'll be catalogued, and boxed, and never projected again in my lifetime." },
                { "set": { "slidesEnd": "sold" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "slides-hester", "from": "1-2", "to": "1-4", "cast": "hester", "scene": "hesterSlides" },
    { "drift": "slides-ivo", "from": "1-5", "to": "2-4", "cast": "ivo", "scene": "ivoSlides", "if": "flag.slidesHeard" }
  ],
  "errands": [
    {
      "id": "slides-show",
      "title": "The lantern show",
      "where": "the Athenaeum",
      "scene": "slidesShow",
      "test": [{ "set": { "slidesBought": true } }, { "add": { "unique": "slides" } }]
    }
  ],
  "calendar": [
    { "id": "slides-show", "errand": "slides-show", "story": "slides", "where": "The Athenaeum", "title": "The lantern show", "known": "flag.slidesBought" }
  ],
  "mornings": [
    { "find": "box", "in": "stock", "match": { "uniqueId": "slides", "questKey": true } },
    {
      "if": "box && errand.slides-show == -1",
      "note": "skipped the errand: it's just stock now",
      "then": [{ "edit": "box", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "outcome": "flag.slidesEnd"
});
