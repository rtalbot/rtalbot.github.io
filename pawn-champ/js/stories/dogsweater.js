// Pawn Champ - The Dog in the Sweater: m19 The Three-Legged Dog comes round again in a long stay
// (docs/quests/SEQUELS.md#the-dog-in-the-sweater). Batch U, round 3. One of the two repeat minors.
// Only if you took him in (Shop Dog): he's in the shop all winter, in a sweater Rosa knitted.
//
// Morning (W1)   Rosa from the bakery brings the sweater, red, with a hole left for the missing leg.
// Hook (W1-W2)   the dog keeps slipping out at lunchtime. Otis the mailman says he walks out to the
//                marsh every day, to Abe Coffin's shack. Then he comes back with a ring in his mouth.
// Errand         Hob's Marsh in the snow: Abe's stovepipe is cold.
// Endings: Wintering in Town, A Tank of Oil, Blue Lights on the Marsh.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/dogsweater.js.
defineStory({
  "id": "dogsweater",
  "kind": "minor",
  "title": "The Dog in the Sweater",
  "location": "marshDay",
  "sequel": "dog",
  "after": ["shopdog"],
  "months": [2, 3, 4, 5],
  "rumour": "The three-legged dog from the Crooked Scale goes out to the marsh every lunchtime, in a sweater.",
  "teaser": "The three-legged dog has taken to sleeping against the radiator with his chin on his paw, watching the snow. He has opinions about the cold, and he shares them.",
  "endings": { "town": "Wintering in Town", "oil": "A Tank of Oil", "ambulance": "Blue Lights on the Marsh" },
  "icons": {
    "dogsweater": [
      "............",
      "..kkkkkkkk..",
      ".krrrrrrrrk.",
      "krrwrrrrwrrk",
      "krrrrrrrrrrk",
      "krrwrrrrwrrk",
      "krrrrrrrrrrk",
      ".krrkkkkrrk.",
      ".krk....krk.",
      ".kk......kk.",
      "............",
      "............"
    ]
  },
  "uniques": {
    "dogSweater": {
      "name": "Hand-knitted dog sweater",
      "icon": "dogsweater",
      "cat": "curio",
      "guide": 0,
      "questKey": true,
      "tells": [
        "Red wool, a white stripe, three leg holes and a neat darned place where the fourth would go. Rosa knitted it in two evenings."
      ]
    },
    "abeRing": {
      "name": "Abe Coffin's wedding ring",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 60,
      "questKey": true,
      "condLabel": "Dog-chewed",
      "tells": [
        "Plain gold, gone thin. Inside: \"A. & M. 1958.\" There are tooth marks on it, very gentle ones."
      ]
    }
  },
  "about": [
    "A winter sequel to The Three-Legged Dog. Rosa knits the dog a red sweater, and soon after Otis the mailman comes in worried (§{dsOtis}): the dog walks out to Abe Coffin's marsh shack every lunchtime, nobody has picked up Abe's mail since Thursday, and his stovepipe isn't smoking. The dog drops Abe's wedding ring at your feet, as if asking you to come.",
    "At the shack (§{dsMarsh}) Abe's stove went out a day ago because the oil truck won't come down the marsh road in snow. Bring him into town to winter in the room over the bakery (Wintering in Town), pay $60 for oil and carry the hose out along the planks yourself (A Tank of Oil), or ring for an ambulance he won't thank you for (Blue Lights on the Marsh)."
  ],
  "scenes": {
    "dsOtis": {
      "title": "Otis: the dog walks out to the marsh",
      "customer": "otis",
      "steps": [
        {
          "say": "otis",
          "text": [
            "Otis Pelletier, with the mail, and a question. Your dog. The one in the sweater. Every lunchtime he goes out past the boardwalk, all the way out the marsh planks to the old clam digger's shack. Every day. In the snow.",
            "I've got Abe Coffin on my route. Nobody's picked up his mail since Thursday. And his stovepipe isn't smoking."
          ]
        },
        { "narrate": "As if he heard his name, the dog comes in through the door Otis left open, snow on his sweater, and drops something on the floor at your feet. It's a plain gold wedding ring, gone thin, with tooth marks on it, very gentle ones." },
        { "if": "shelf.free", "then": [{ "add": { "unique": "abeRing" } }, { "refresh": "panel" }] },
        { "plan": "ds-marsh" },
        { "set": { "dsKnown": true } },
        { "toast": "Calendar: out to Abe Coffin's shack on Hob's Marsh, {placed:ds-marsh} at noon", "look": "otis" },
        { "say": "otis", "text": "I'd go myself, but the planks and me don't get on. That dog knows the way better than you do." },
        { "leave": "otis" }
      ]
    },
    "dsMarsh": {
      "title": "Out to Abe Coffin's",
      "steps": [
        {
          "stage": "marshDay",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 164] },
            { "id": "abe", "cast": "abe", "at": [220, 160], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "Hob's Marsh at noon, iced over at the edges, the reeds stiff with frost. The dog goes ahead along the planks in his red sweater like a small, determined flag. The shack's stovepipe is cold.",
            "Abe Coffin is inside in two coats and a blanket, by a stove that went out a day ago. He tries to get up when the dog comes in, and doesn't manage it."
          ]
        },
        { "say": "abe", "text": "There you are, you old thief. Brought company. I'm all right. Oil truck won't come out the marsh road in the snow, that's all. Never does. I've been colder." },
        { "find": "ring", "in": "stock", "match": { "uniqueId": "abeRing" } },
        {
          "if": "ring",
          "then": [
            { "narrate": "You give him back the ring. He looks at it, then at the dog. \"Took it off the nail by the bed,\" he says. \"Wanted you to come and see. Didn't you. Clever boy.\"" },
            { "take": "ring" }
          ]
        },
        {
          "choose": [
            {
              "label": "Bring Abe into town for the winter",
              "hint": "(Rosa has a room over the bakery)",
              "then": [
                { "say": "abe", "text": "Into town. Me. With the bakery smell all day. ...All right. All right. Till the ice goes out. Not a day after." },
                { "narrate": "He walks back along the planks with one hand on your arm and the other on the dog, very slowly, as if it was his idea. Rosa has the room over the bakery warm before you get there." },
                { "set": { "dsEnd": "town" } },
                { "rep": 4, "why": "Brought Abe Coffin into town for the winter" }
              ]
            },
            {
              "label": "Pay for an oil delivery and walk the driver out yourself",
              "hint": "(-$60)",
              "disabled": "coin < 60",
              "then": [
                { "coin": -60, "why": "Paid for Abe Coffin's heating oil" },
                { "narrate": "You ring the oil company from the end of the marsh road, and when the truck can't get down it, you and the driver carry the hose out along the planks together, a hundred feet of it, with the dog supervising." },
                { "say": "abe", "text": "Sixty dollars. I'll dig it off in clams, come the thaw. Every clam. I'll count them." },
                { "set": { "dsEnd": "oil" } },
                { "rep": 3 }
              ]
            },
            {
              "label": "Ring for an ambulance",
              "hint": "(he won't thank you)",
              "then": [
                { "narrate": "The ambulance comes as far as the end of the marsh road, and two EMTs carry him out along the planks in a chair, swearing gently at the ice. Abe swears at them, not gently. The dog walks beside the chair the whole way." },
                { "say": "abe", "text": "Two nights in Plymouth for a cold stove. Well. You meant well. The dog meant better." },
                { "set": { "dsEnd": "ambulance" } },
                { "rep": 1 }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "ds-otis", "from": "1-3", "to": "2-2", "cast": "otis", "scene": "dsOtis", "if": "flag.dsSweater || week > 1" }
  ],
  "errands": [
    {
      "id": "ds-marsh",
      "title": "Out to Abe Coffin's",
      "where": "Hob's Marsh",
      "scene": "dsMarsh",
      "test": [
        { "set": { "dsKnown": true } },
        { "hook": "atLeast", "with": 100 },
        { "add": { "unique": "abeRing" }, "if": "random < 0.6" }
      ]
    }
  ],
  "calendar": [
    { "id": "ds-marsh", "errand": "ds-marsh", "story": "dogsweater", "where": "Hob's Marsh", "title": "Out to Abe Coffin's", "known": "flag.dsKnown" }
  ],
  "mornings": [
    {
      "if": "week == 1 && day == 2 && !flag.dsSweater",
      "note": "Rosa brings the sweater",
      "then": [
        { "set": { "dsSweater": true } },
        {
          "narrate": [
            "Rosa from the bakery knocks before you've opened up, with something red folded over her arm.",
            "It's a sweater, for the dog. Red, with a white stripe, three leg holes and a darned place where the fourth would go. He stands very still while she puts it on him, and then walks round the shop twice, slowly, so everyone can see."
          ]
        },
        { "if": "shelf.free", "then": [{ "add": { "unique": "dogSweater" } }, { "refresh": "panel" }] }
      ]
    }
  ],
  "epilogue": [
    { "line": "Abe Coffin is wintering over the bakery. Every lunchtime a three-legged dog in a red sweater walks from your door to Rosa's and back, checking on him.", "if": "flag.dsEnd == 'town'" },
    { "line": "Abe Coffin's stovepipe smokes all winter. He owes you sixty dollars in clams, and he has started counting.", "if": "flag.dsEnd == 'oil'" },
    { "line": "Abe Coffin came home from Plymouth with a new hip and a bad temper. The dog visits him every lunchtime, in his sweater, and the temper improves.", "if": "flag.dsEnd == 'ambulance'" }
  ],
  "talk": {
    "by": "otis",
    "rumour": [
      "Your dog. The three-legged one, in the sweater. He follows my route out as far as the boardwalk every day, then goes off on his own along the marsh planks. In the snow.",
      "I asked him where he was going. He looked at me like it was none of my business, which, as a mailman, it is."
    ],
    "react": { "town": "Abe Coffin's over the bakery for the winter. I deliver his mail to Rosa's now. The dog meets me at the door and takes it up himself.", "oil": "There's smoke out of Abe Coffin's stovepipe again. I can see it from the end of my route. I check every day. So does your dog.", "ambulance": "They carried Abe Coffin off the marsh in a chair. He called me a name I won't repeat as he went past my van. He's fine, then." }
  },
  "outcome": "flag.dsEnd"
});
