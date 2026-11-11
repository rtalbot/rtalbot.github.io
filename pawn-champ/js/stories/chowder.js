// Pawn Champ - A Ring in the Chowder. Minor quest m2, batch A (docs/quests/MINOR.md#m2-a-ring-in-the-chowder).
// A cook finds a ring in the chowder pot. It's a husband's wedding ring, lost on a honeymoon fifty
// years ago in the same restaurant, and the couple's anniversary lunch is tomorrow.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/chowder.js.
defineStory({
  "id": "chowder",
  "kind": "minor",
  "title": "A Ring in the Chowder",
  "location": "grange",
  "rumour": "Marisol found a ring in the chowder pot. Swears it wasn't hers.",
  "endings": { "fifty": "Fifty Years", "melted": "Melted Down" },
  "about": [
    "A very short, warm story. Marisol from the Clam Shack found a ring at the bottom of the chowder pot, engraved R & J 1975, and sells it to you (§{chowderFind}). The bartender at the Anchor says it's Ray Tibbets's wedding ring, lost in a bowl of chowder on his honeymoon fifty years ago, and the Tibbets' fiftieth anniversary lunch is this week.",
    "At the lunch at the Grange (§{chowderParty}) give Ray the ring during the toasts (Fifty Years), or keep quiet and keep it. Keeping it, or selling it on, is Melted Down."
  ],
  "cast": {
    "marisol": {
      "name": "Marisol Duarte",
      "look": { "skin": "#c89070", "hair": "#2a1e16", "hs": 5, "coat": "#f0ece0", "style": "tee", "apron": "#c84a3a", "pants": "#2a2a32", "band": "#c84a3a" }
    },
    "rayT": {
      "name": "Ray Tibbets",
      "look": { "skin": "#e8c0a0", "hair": "#e8e8e8", "hs": 0, "coat": "#3a4a6a", "style": "suit", "trim": "#c84a3a", "pants": "#3a3a42", "stout": true }
    },
    "juneT": {
      "name": "June Tibbets",
      "look": { "skin": "#e8c0a0", "hair": "#f0f0f0", "hs": 3, "coat": "#c87a9a", "style": "dress", "pants": "#c87a9a", "bag": "#f0ece0" }
    }
  },
  "uniques": {
    "chowderRing": {
      "name": "The chowder ring",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 70,
      "tells": ["Gold, worn thin on one side. Engraved inside: R & J 1975."],
      "wantedBy": { "name": "June Tibbets", "mult": 1.5 },
      "wantedKnown": "flag.chowderKnown"
    }
  },
  "overheard": [
    { "line": "Laughing: \"Marisol found a ring in the chowder pot. Swears it wasn't hers. She's checked everybody's fingers twice.\"" }
  ],
  "scenes": {
    "chowderFind": {
      "title": "Marisol found a ring in the chowder",
      "customer": "marisol",
      "steps": [
        {
          "say": "marisol",
          "text": [
            "Marisol Duarte. I cook at the Clam Shack. This was at the bottom of the chowder pot this morning, and before you ask: not mine. Not anybody's in the kitchen.",
            "Is it worth anything? Because if nobody claims it, I'm buying new knives."
          ]
        },
        { "offer": { "unique": "chowderRing" }, "persona": "honest", "asking": 40, "min": 28 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "marisol", "text": "Fine. I'll keep it in the tip jar until someone weeps over it." },
            { "leave": "marisol" },
            { "end": true }
          ]
        },
        { "set": { "chowderKnown": true } },
        { "say": "marisol", "text": "Oh, and Sully at the Anchor swears R and J is Ray and June Tibbets. Ray lost his wedding ring on their honeymoon. Here. In our restaurant. Fifty years ago." },
        { "plan": "chowder-party" },
        { "say": "marisol", "text": "Their fiftieth is a lunch at the Grange Hall, {when:chowder-party|or:this week}. Just saying." },
        { "toast": "Calendar: the Tibbets' fiftieth, the Grange Hall, {when:chowder-party} at noon", "look": "marisol", "if": "errand.chowder-party" },
        { "leave": "marisol" }
      ]
    },
    "chowderParty": {
      "title": "The Tibbets' fiftieth",
      "steps": [
        {
          "stage": "grange",
          "view": { "sign": "HAPPY 50TH RAY & JUNE" },
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [90, 166] },
            { "id": "ray", "cast": "rayT", "at": [196, 162], "facingLeft": true },
            { "id": "june", "cast": "juneT", "at": [220, 164], "facingLeft": true }
          ]
        },
        { "narrate": "The Grange Hall at noon: a sheet cake, a slideshow nobody can make work, and eighty people in their good sweaters." },
        { "say": "ray", "text": "Fifty years! She said yes in 1975 and she's never once let me forget the ring. Lost it in a bowl of chowder on our honeymoon, folks. Right here in Hollow Neck." },
        { "say": "june", "text": "He went back for it every summer for ten years. Ate a lot of chowder." },
        { "find": "ring", "in": "stock", "match": { "uniqueId": "chowderRing" } },
        {
          "if": "!ring",
          "then": [
            { "narrate": "You think about the ring you sold on, and clap along with everyone else." },
            { "set": { "chowderEnd": "melted" }, "if": "!flag.chowderEnd" },
            { "view": { "sign": null } },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Give Ray the ring, during the toasts",
              "then": [
                { "take": "ring" },
                { "set": { "chowderEnd": "fifty" } },
                { "rep": 6, "why": "Returned the Tibbets' ring" },
                { "narrate": "You hand it over between the second toast and the third. Ray reads the inside of the ring and sits down very suddenly." },
                { "say": "june", "text": "Oh, Raymond. Oh, it's the same one." },
                {
                  "if": "ring.paid",
                  "then": [
                    { "hook": "payBack", "with": "Ray Tibbets paid you back for the ring" },
                    { "say": "ray", "text": "No, you're taking the {ring.paid} dollars. Don't argue with a man on his anniversary." }
                  ]
                }
              ]
            },
            {
              "label": "Keep quiet. It's just a ring, and it's yours now.",
              "then": [
                { "set": { "chowderKept": true } },
                { "edit": "ring", "set": { "questKey": false, "nosale": false } },
                { "narrate": "June cuts the cake. You have a slice. It's very good cake, and you don't enjoy it at all." }
              ]
            }
          ]
        },
        { "view": { "sign": null } },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [{ "at": "2-3", "cast": "marisol", "scene": "chowderFind" }],
  "errands": [
    {
      "id": "chowder-party",
      "title": "The Tibbets' fiftieth",
      "where": "The Grange Hall",
      "scene": "chowderParty",
      "test": [{ "add": { "unique": "chowderRing" } }, { "set": { "chowderKnown": true } }]
    }
  ],
  "calendar": [
    { "id": "chowder-party", "errand": "chowder-party", "story": "chowder", "where": "The Grange Hall", "title": "The Tibbets' fiftieth", "known": "flag.chowderKnown", "scene": "chowderParty" }
  ],
  "sold": { "chowderRing": [{ "set": { "chowderEnd": "melted" }, "if": "!flag.chowderEnd" }] },
  "epilogue": [
    { "line": "Ray Tibbets wears his wedding ring on a chain now, so it can't fall in anything.", "if": "flag.chowderEnd == 'fifty'" },
    { "line": "Somewhere, a ring engraved R & J 1975 was melted down for scrap. June Tibbets never knew how close it came.", "if": "flag.chowderEnd == 'melted'" }
  ],
  "outcome": [
    { "if": "flag.chowderEnd == 'fifty'", "ending": "fifty" },
    { "if": "flag.chowderEnd == 'melted' || flag.chowderKept", "ending": "melted" }
  ]
});
