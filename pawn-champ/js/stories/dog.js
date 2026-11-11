// Pawn Champ - The Three-Legged Dog. Minor quest m19, batch E (docs/quests/MINOR.md).
// A three-legged dog sleeps in your doorway. He belongs to a clam digger out on Hob's Marsh, who
// can't afford to feed him. Its scene is a lunch errand on the marsh by day.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/dog.js.
defineStory({
  "id": "dog",
  "kind": "minor",
  "title": "The Three-Legged Dog",
  "location": "marsh",
  "rumour": "That three-legged dog sleeps in your doorway every morning.",
  "endings": { "home": "Home", "shopdog": "Shop Dog", "pound": "Pound" },
  "outcome": "flag.dogEnd",
  "about": [
    "A small kindness story. A three-legged dog has taken to sleeping across your doorway every morning, and Rosa from the bakery tells you whose he is: Abe Coffin, a clam digger who lives in a shack out on Hob's Marsh, has been poorly and there hasn't been much food (§{dogOwner}). You can offer to walk the dog home at lunchtime, or say he isn't your dog.",
    "At the shack (§{marshDog}) Abe offers to sell you his father's clam rake for $20 so he and the dog can eat. Buy it and leave the dog with him (Home), buy it and take the dog to be your shop dog (Shop Dog), call animal control on him (Pound), just leave, or, with something to dig with in your bag, spend two hours digging him a week of clams so he keeps the rake."
  ],
  "cast": {
    "abe": {
      "name": "Abe Coffin",
      "look": { "skin": "#c89878", "hair": "#b8b8b8", "hs": 1, "coat": "#6a7a4a", "style": "vest", "vest": "#3a4a2a", "pants": "#4a4a3a", "hat": "cap", "hatc": "#3a3a2a", "beard": "#c8c8c8" }
    },
    "rosa": {
      "name": "Rosa from the bakery",
      "look": { "skin": "#d8a880", "hair": "#2a1e16", "hs": 3, "coat": "#f0e8e0", "style": "tee", "apron": "#e8e0d8", "pants": "#4a4a52" }
    }
  },
  "icons": {
    "rake": [
      "..........kk",
      ".........kWk",
      "........kWk.",
      ".......kWk..",
      "......kWk...",
      ".....kWk....",
      "..kkkkkk....",
      ".kssssssk...",
      ".ksksksks...",
      ".ks.ks.ks...",
      ".k..k..k....",
      "............"
    ],
    "blanket": [
      "............",
      ".kkkkkkkkkk.",
      ".krrbrrbrrk.",
      ".krrbrrbrrk.",
      ".kbbbbbbbbk.",
      ".krrbrrbrrk.",
      ".krrbrrbrrk.",
      ".kbbbbbbbbk.",
      ".krrbrrbrrk.",
      ".kkkkkkkkkk.",
      "............",
      "............"
    ]
  },
  "uniques": {
    "clamRake": {
      "name": "Abe Coffin's clam rake",
      "icon": "rake",
      "cat": "curio",
      "guide": 30,
      "tells": ["Hand-forged tines, an ash handle worn smooth. Fifty years of Hob's Marsh clams."]
    },
    "dogBlanket": {
      "name": "The dog's blanket",
      "icon": "blanket",
      "cat": "curio",
      "guide": 0,
      "questKey": true,
      "effect": { "raidMult": 0.9 },
      "effectText": "A dog by the door: raids are 10% less likely",
      "tells": ["Tartan, hairy, and not for sale. Neither is the dog."]
    }
  },
  "scenes": {
    "dogOwner": {
      "title": "Rosa: whose dog is in your doorway",
      "customer": "rosa",
      "steps": [
        {
          "say": "rosa",
          "text": [
            "Rosa, from the bakery. That three-legged dog sleeps in your doorway every morning now, did you know? He used to sleep in mine.",
            "He belongs to the clam digger who lives out on the marsh. Abe Coffin. Abe's been poorly, and I don't think there's been much food in that shack."
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll walk him home at lunchtime.\"",
              "then": [
                { "set": { "dogWalk": true } },
                { "plan": "marsh-dog" },
                { "say": "rosa", "text": "Bless you. Out past the boardwalk, follow the planks. The dog knows the way better than you will." },
                { "toast": "Calendar: walk the dog home to Hob's Marsh, lunchtime {placed:marsh-dog}", "look": "rosa" }
              ]
            },
            { "label": "\"Not my dog.\"", "then": [{ "say": "rosa", "text": "He seems to think he is." }] }
          ]
        },
        { "leave": "rosa" }
      ]
    },
    "marshDog": {
      "title": "Walking the dog home to Abe Coffin",
      "steps": [
        {
          "stage": "marshDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 164] },
            { "id": "abe", "cast": "abe", "at": [220, 156], "facingLeft": true }
          ]
        },
        { "narrate": "Hob's Marsh at noon: reeds, mud, a heron that doesn't trust you. The dog trots ahead along the planks to a tar-paper shack with a stovepipe and an old man sitting on an upturned bucket." },
        {
          "say": "abe",
          "text": [
            "There you are, you old thief. Been eating somebody else's breakfast?",
            "Abe Coffin. Thank you for bringing him. I can't feed him like I should. Can't feed me like I should.",
            "Tell you what. That's my clam rake. My father forged it. Give me twenty for it and I'll eat this week, and so will he."
          ]
        },
        {
          "choose": [
            {
              "label": "Buy the rake and leave the dog at home",
              "hint": "(-$20)",
              "disabled": "coin < 20 || !shelf.free",
              "then": [
                { "add": { "unique": "clamRake" }, "as": "rake" },
                { "edit": "rake", "set": { "paid": 20 } },
                { "hook": "bought" },
                { "coin": -20, "why": "Bought Abe Coffin's clam rake" },
                { "set": { "dogEnd": "home" } },
                { "rep": 2 },
                { "say": "abe", "text": "He'll still come and sleep in your doorway. He likes the smell of the bakery." }
              ]
            },
            {
              "label": "Buy the rake, and offer to take the dog",
              "hint": "(-$20, the dog guards your door)",
              "disabled": "coin < 20 || !shelf.free",
              "then": [
                { "add": { "unique": "clamRake" }, "as": "rake" },
                { "edit": "rake", "set": { "paid": 20 } },
                { "hook": "bought" },
                { "coin": -20, "why": "Bought Abe Coffin's clam rake" },
                { "set": { "dogEnd": "shopdog" } },
                { "say": "abe", "text": "Take him. He likes you better anyway. Take his blanket too, or he won't settle." },
                { "add": { "unique": "dogBlanket" } },
                { "refresh": "panel" },
                { "narrate": "The dog walks back to town beside you, very slowly, as if he has decided it was his idea." }
              ]
            },
            {
              "label": "Call animal control. Abe can't look after him.",
              "then": [
                { "set": { "dogEnd": "pound" } },
                { "rep": -3, "why": "Called animal control on Abe Coffin's dog" },
                { "narrate": "The van comes out along the marsh road. The dog goes quietly. Abe doesn't say anything at all." }
              ]
            },
            {
              "label": "Leave the dog and go",
              "then": [
                { "set": { "dogEnd": "home" } },
                { "say": "abe", "text": "Well, thank you for walking him, anyway." }
              ]
            },
            {
              "label": "Keep your money. Dig him a week of clams instead",
              "hint": "(he keeps the rake)",
              "needs": "dig",
              "without": "With a spade or a rake of your own, you could dig him a week of clams.",
              "note": "items in use (docs/ITEMS_IN_USE.md): his father's rake stays with him",
              "then": [
                { "use": "dig", "as": "it" },
                { "set": { "dogEnd": "clams" } },
                { "rep": 4, "why": "Dug clams with Abe Coffin" },
                {
                  "narrate": { "if": "it", "then": "Two hours on the flats with your {it.name|lower} and his father's rake, the dog supervising. Two full buckets by the time the tide turns.", "else": "Two hours on the flats with your spade and his father's rake, the dog supervising. Two full buckets by the time the tide turns." }
                },
                { "say": "abe", "text": "Twenty dollars would've lasted me a week. That lot'll last me two, and I've still got the rake. Come back at the next low tide and I'll show you where the big ones are." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "at": "3-3", "cast": "rosa", "scene": "dogOwner" }],
  "errands": [
    {
      "id": "marsh-dog",
      "title": "Walking the dog home",
      "where": "Hob's Marsh",
      "scene": "marshDog",
      "test": [{ "hook": "setCoin", "with": 100 }]
    }
  ],
  "calendar": [
    {
      "id": "marsh-dog",
      "errand": "marsh-dog",
      "story": "dog",
      "where": "Hob's Marsh",
      "title": "Walk the dog home",
      "known": "flag.dogWalk",
      "bring": ["dig"]
    }
  ],
  "mornings": [
    {
      "if": "week == 3 && day == 3 && !flag.dogSeen",
      "then": [
        { "set": { "dogSeen": true } },
        { "narrate": "When you go to open up, there's a dog asleep across your doorway: grey muzzle, one ear up, three legs. He lets you step over him, and then he comes in." }
      ]
    }
  ],
  "epilogue": [
    { "line": "Abe Coffin still digs the flats at Hob's Marsh with his father's rake. A three-legged dog guards the buckets.", "if": "flag.dogEnd == 'clams'" },
    { "line": "A three-legged dog sleeps across the door of the Crooked Scale. Nobody has tried to rob the place since.", "if": "flag.dogEnd == 'shopdog'" },
    { "line": "Abe Coffin and his dog still walk the marsh planks every morning. The dog still stops at your doorway on the way.", "if": "flag.dogEnd == 'home'" },
    { "line": "Somebody from the next town adopted the three-legged dog. Abe Coffin never came into town again.", "if": "flag.dogEnd == 'pound'" }
  ]
});
