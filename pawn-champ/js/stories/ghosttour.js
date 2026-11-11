// Pawn Champ - The Ghost Tour. Minor quest m13, batch E (docs/quests/MINOR.md). Fog Week only.
// Felix Amory's ghost tour makes everything up, and in Fog Week the real ghosts come to complain.
// Its scene is an evening at the Old Burying Ground, on a fog night the majors left free.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. No code half.
defineStory({
  "id": "ghosttour",
  "kind": "minor",
  "title": "The Ghost Tour",
  "location": "graveyard",
  "needs": "fog",
  "rumour": "Felix Amory's ghost tour makes everything up.",
  "endings": { "true": "True Stories", "spooked": "Spooked", "box": "Box Office" },
  "outcome": "flag.tourEnd",
  "about": [
    "A comic Fog Week ghost story. Felix Amory runs a ghost walk where he makes most of it up, and sells you his prop lantern for a better costume (§{felixLantern}). Then a real ghost comes to the counter: Hepzibah Lusk, a milliner who drowned in 1841, is tired of being called a hanged pirate queen, and the lantern was hers (§{hepzibahComplains}). The dead mean to correct Felix on his tour, and she asks you to come and keep it civil.",
    "In the Old Burying Ground (§{ghostTour}) the dead turn up mid-tour. Let them tell their true stories one stone at a time, which the tourists love (True Stories), let them scare Felix out of the graveyard and out of the business (Spooked), or slip back to the gate and sell tickets (Box Office)."
  ],
  "cast": {
    "hepzibah": {
      "name": "Hepzibah Lusk (deceased)",
      "look": { "skin": "#c8dce8", "hair": "#e8f0f8", "hs": 3, "coat": "#7a8aaa", "trim": "#dfefff", "style": "dress", "hat": "bonnet", "hatc": "#6a7a9a", "eye": "#8af0ff" }
    }
  },
  "icons": {
    "lantern": [
      ".....kk.....",
      "....k..k....",
      "...kkkkkk...",
      "...kAAAAk...",
      "...kAYYAk...",
      "...kAYYAk...",
      "...kAaaAk...",
      "...kAAAAk...",
      "...kkkkkk...",
      "....kddk....",
      "...kkkkkk...",
      "............"
    ]
  },
  "uniques": {
    "tourLantern": {
      "name": "The ghost-tour lantern",
      "icon": "lantern",
      "cat": "curio",
      "guide": 30,
      "questKey": true,
      "tells": [
        "A real ship's lantern, 1800s. The glass is etched H.L.",
        "There's a lady's hatpin wedged in the burner, as if somebody hid it there."
      ]
    }
  },
  "scenes": {
    "felixLantern": {
      "title": "Felix Amory sells his prop lantern",
      "customer": "felix",
      "steps": [
        {
          "say": "felix",
          "text": [
            "Felix Amory. Amory's Hollow Neck Ghost Walk, nine dollars, children half price, refunds never.",
            "Fog Week is the only week anyone books, so I need cobwebs, a cape and a better hat. I'm selling the prop lantern. It's an antique. Probably.",
            "People say I make it all up. I don't make it ALL up. The graveyard is real."
          ]
        },
        { "offer": { "unique": "tourLantern" }, "persona": "honest", "asking": 24, "min": 15 },
        { "set": { "felixTour": true } },
        {
          "say": "felix",
          "text": { "if": "offer == 'deal'", "then": "Splendid. I'll borrow it back for the tour, of course. Old Burying Ground, the first nights of the Fog. Come along! Free, for a supplier.", "else": "Never mind. I'll use a torch with some tissue paper on it. Old Burying Ground, the first nights of the Fog. Come along, it's free for shopkeepers." }
        },
        { "leave": "felix" }
      ]
    },
    "hepzibahComplains": {
      "title": "In the Fog, a ghost comes in to complain about him",
      "music": "eerie",
      "customer": "hepzibah",
      "steps": [
        {
          "say": "hepzibah",
          "text": [
            "Hepzibah Lusk, milliner, drowned 1841. I have a complaint about a young man in a cape.",
            "He tells forty tourists a night that I was hanged for piracy. I made HATS. Very good hats."
          ]
        },
        { "find": "lantern", "in": "stock", "match": { "uniqueId": "tourLantern" } },
        { "say": "hepzibah", "text": "And that is my lantern. I lit my way home by it, the night the wharf gave way. He has been waving it at people.", "if": "lantern" },
        { "say": "hepzibah", "text": "Tonight he does his tour among us, at the Burying Ground. We intend to correct him. Will you come and keep it civil?" },
        { "set": { "tourKnown": true } },
        { "toast": "Calendar: the ghost tour, Old Burying Ground, {placed:ghost-tour} night", "look": "hepzibah" },
        { "leave": "hepzibah" }
      ]
    },
    "ghostTour": {
      "title": "Felix's ghost tour, among the dead",
      "music": "eerie",
      "steps": [
        {
          "stage": "graveyard",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 164] },
            { "id": "felix", "cast": "felix", "at": [150, 160] },
            { "id": "tourist", "look": "random", "name": "A tourist", "at": [[60, 160], [40, 166]] }
          ]
        },
        { "find": "lantern", "in": "stock", "match": { "uniqueId": "tourLantern" } },
        {
          "narrate": { "if": "lantern", "then": "The Old Burying Ground in the Fog. Felix leads eleven tourists between the slate stones with your lantern held high.", "else": "The Old Burying Ground in the Fog. Felix leads eleven tourists between the slate stones with a torch wrapped in orange tissue paper." }
        },
        { "say": "felix", "text": "And HERE lies Hepzibah Lusk, the Pirate Queen of Hollow Neck, hanged from that very elm for sinking nine ships!" },
        {
          "enter": {
            "id": "hepzibah",
            "cast": "hepzibah",
            "at": [300, 156],
            "alpha": "ghost",
            "facingLeft": true
          }
        },
        { "walk": "hepzibah", "to": [200, 156] },
        { "face": "hepzibah", "left": true },
        { "say": "hepzibah", "text": "Hats. I made hats." },
        { "say": "tourist1", "text": "Is she part of the tour? She's very good." },
        { "say": "felix", "text": "(to you, quietly) Is she part of the tour?" },
        {
          "choose": [
            {
              "label": "Let the ghosts tell their real stories, one stone at a time",
              "then": [
                { "set": { "tourEnd": "true" } },
                { "narrate": "For two hours the dead of Hollow Neck tell their own stories: a hatter, a cooper, a girl who rang the fire bell, a parson who lost a bet. Felix takes notes. The tourists cry twice." },
                { "say": "felix", "text": "This is SO much better than piracy." },
                { "rep": 3, "why": "Helped the dead correct the ghost tour" },
                {
                  "if": "lantern",
                  "then": [
                    { "say": "hepzibah", "text": "Keep my lantern, shopkeeper. You can sell it now. Tell whoever buys it about the hats." },
                    { "edit": "lantern", "set": { "guide": 50, "questKey": false, "nosale": false } },
                    { "refresh": "panel" }
                  ]
                }
              ]
            },
            {
              "label": "Let them give Felix the scare of his life",
              "then": [
                { "set": { "tourEnd": "spooked" } },
                { "narrate": "Every stone in the Burying Ground sits up at once. Felix makes a noise like a kettle, drops his cape, and runs for the road. The tourists give it five stars." },
                { "say": "hepzibah", "text": "I do feel a little better." },
                { "edit": "lantern", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" }
              ]
            },
            {
              "label": "Slip back to the gate and sell more tickets",
              "hint": "(+$35)",
              "then": [
                { "set": { "tourEnd": "box" } },
                { "coin": 35, "why": "Sold tickets to the ghost tour" },
                { "narrate": "The word goes round that the ghosts are real tonight. You sell thirty-five tickets at the gate. The dead are not consulted." },
                { "say": "hepzibah", "text": "Shopkeepers. Alive or dead, always shopkeepers." },
                { "edit": "lantern", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-4", "cast": "felix", "scene": "felixLantern" },
    { "at": "3-1", "cast": "hepzibah", "scene": "hepzibahComplains", "alpha": "ghost", "if": "flag.felixTour" }
  ],
  "nights": [
    {
      "id": "ghost-tour",
      "window": ["3-1", "3-2"],
      "if": "flag.felixTour",
      "scene": "ghostTour",
      "test": [{ "set": { "felixTour": true } }, { "add": { "unique": "tourLantern" } }]
    }
  ],
  "calendar": [
    { "id": "ghost-tour", "night": "ghost-tour", "story": "ghosttour", "where": "Old Burying Ground", "title": "Felix's ghost tour", "known": "flag.tourKnown", "scene": "ghostTour" }
  ],
  "epilogue": [
    { "line": "Amory's Ghost Walk is now historically accurate. It sells out every Fog Week, and Hepzibah Lusk gets a cut in hats.", "if": "flag.tourEnd == 'true'" },
    { "line": "Felix Amory sells insurance now. He doesn't go out in the fog.", "if": "flag.tourEnd == 'spooked'" },
    { "line": "You still have a roll of ghost-tour tickets in the till. The dead remember.", "if": "flag.tourEnd == 'box'" }
  ]
});
