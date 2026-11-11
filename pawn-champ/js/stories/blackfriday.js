// Pawn Champ - The Black Friday Line. Minor quest m75, batch M (docs/quests/MINOR.md#m75-the-black-friday-line).
// November only. On Black Friday 1987 Odile ran one sale: first in line gets anything in the shop for
// a dollar. Royce Pruitt was first and bought a walnut music box with a brass swan on the lid. Everett
// Dunn was second, and he'd wanted it for the same woman. This year Royce's daughter sells you the
// box, Everett still has the flyer, and on Thanksgiving night there's somebody camped at your door.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/blackfriday.js.
defineStory({
  "id": "blackfriday",
  "kind": "minor",
  "title": "The Black Friday Line",
  "location": "shop",
  "months": [2],
  "rumour": "Somebody's planning to camp outside the Crooked Scale for Black Friday, with a flyer from 1987.",
  "endings": { "dollar": "One Dollar, as Advertised", "shared": "Both of Them Listening", "sold": "Doorbuster" },
  "outcome": "flag.bfEnd",
  "about": [
    "A November love story told late. Joyce Pruitt sells you her late mother's music box with a brass swan (§{joyceBox}). Her father bought it in this shop for a dollar, first in line at Odile's Black Friday sale in 1987. Then Everett Dunn shows you the 1987 flyer (\"first in line: anything in the shop, one dollar\") and asks whether it still stands; he was second in line that night (§{everettFlyer}).",
    "On Thanksgiving night both of them are in line at your door in the frost (§{bfLine}). Everett wanted the box for Junie Lattimer, who became Joyce's mother. Honor the flyer and he takes it home for a dollar (One Dollar, as Advertised); wind it for both of them and Joyce buys it back and invites him to come and wind it on Sundays (Both of Them Listening); or wait for the morning crowd and sell to a man with a printed list (Doorbuster)."
  ],
  "cast": {
    "joyce": {
      "name": "Joyce Pruitt",
      "look": { "skin": "#d8a880", "hair": "#5a3a22", "hs": 3, "coat": "#7a5a8a", "style": "puffer", "pants": "#2a2a32", "bag": "#3a2a22" }
    },
    "everett": {
      "name": "Everett Dunn",
      "look": { "skin": "#e8c0a0", "hair": "#e0e0e0", "hs": 1, "coat": "#4a3a2a", "trim": "#c8b890", "style": "jacket", "long": true, "pants": "#3a3a40", "hat": "cap", "hatc": "#5a3a2a", "glasses": "#3a3a3a" }
    },
    "doorbuster": {
      "name": "A man with a printed list",
      "look": { "skin": "#f0d0b8", "hair": "#2a2a2a", "hs": 0, "coat": "#1a1a1e", "style": "puffer", "pants": "#1a1a1e", "bag": "#3a3a3a" }
    }
  },
  "icons": {
    "swanbox": [
      "............",
      "......kk....",
      ".....kSSk...",
      "......kSk...",
      "....kkSSk...",
      "...kSSSSk...",
      ".kkkkkkkkkk.",
      "kwwwwwwwwwwk",
      "kwWWWyyWWWwk",
      "kwwwwwwwwwwk",
      "kkkkkkkkkkkk",
      "............"
    ]
  },
  "uniques": {
    "swanbox": {
      "name": "Walnut music box with a brass swan",
      "icon": "swanbox",
      "cat": "curio",
      "guide": 120,
      "questKey": true,
      "tells": [
        "Walnut, with a brass swan on the lid. Wind it and it plays a slow waltz nobody can name.",
        "A ballpoint note glued inside the lid: \"$1. Black Friday 1987. Best dollar I ever spent. R.\""
      ]
    }
  },
  "scenes": {
    "joyceBox": {
      "title": "Joyce Pruitt sells her mother's music box",
      "customer": "joyce",
      "steps": [
        {
          "say": "joyce",
          "text": [
            "Joyce Pruitt. This was my dad's. He bought it here, in this shop, for a dollar. Black Friday, 1987. Odile had a sale: first in line gets anything for a dollar. He camped out all night in a lawn chair.",
            "He gave it to my mom. She wound it every night for thirty-eight years. She died in the spring, and I can't listen to it. I can't throw it out either. Thirty?"
          ]
        },
        { "offer": { "unique": "swanbox" }, "persona": "honest", "asking": 30, "min": 20 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "joyce", "text": "Okay. It'll go back in the closet. It's good at closets." },
            { "leave": "joyce" },
            { "end": true }
          ]
        },
        { "set": { "bfBox": true } },
        { "say": "joyce", "text": "Put it in the window, maybe. Somebody should hear it who doesn't cry." },
        { "leave": "joyce" }
      ]
    },
    "everettFlyer": {
      "title": "Everett Dunn and the 1987 flyer",
      "customer": "everett",
      "steps": [
        { "say": "everett", "text": "Everett Dunn. That's the swan box. In your window. I'd know it anywhere." },
        { "narrate": "He unfolds a yellow flyer, soft as cloth: \"BLACK FRIDAY AT THE CROOKED SCALE. FIRST IN LINE: ANYTHING IN THE SHOP, ONE DOLLAR. — O.\" It's dated 1987." },
        { "say": "everett", "text": "I was second in line. All night in the frost, and I was second. Does it still stand? The flyer. It doesn't say which year." },
        {
          "choose": [
            {
              "label": "\"It stands. Be first in line.\"",
              "then": [
                { "set": { "bfStand": "yes" } },
                { "say": "everett", "text": "Thanksgiving night, then. I'll bring the chair. It's the same chair." }
              ]
            },
            {
              "label": "\"That was Odile's sale, Mr. Dunn.\"",
              "then": [
                { "set": { "bfStand": "no" } },
                { "say": "everett", "text": "I know. I know it was. I'll be first in line anyway. I've been second for thirty-nine years." }
              ]
            },
            {
              "label": "\"It stands. Twenty dollars, though. Inflation.\"",
              "then": [
                { "set": { "bfStand": "twenty" } },
                { "say": "everett", "text": "Thanksgiving night, then. I'll bring the chair. It's the same chair." }
              ]
            }
          ]
        },
        { "toast": "Calendar: Thanksgiving night, a line at your door", "look": "everett" },
        { "leave": "everett" }
      ]
    },
    "bfLine": {
      "title": "Thanksgiving night: the line at your door",
      "steps": [
        {
          "stage": "shopNight",
          "view": { "candleX": 236 },
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }]
        },
        {
          "narrate": [
            "Thanksgiving night, after midnight. Frost on the inside of the window. Outside your door, in a folding lawn chair with a blanket and a thermos, sits Everett Dunn. First in line.",
            "At one, a car pulls up. Joyce Pruitt gets out, looks at Everett, and sets up a camping stool behind him. Second in line.",
            "It's nine degrees. You unlock the door and bring them both in to the radiator."
          ]
        },
        { "enter": { "id": "everett", "cast": "everett", "at": [196, 164], "facingLeft": true } },
        { "enter": { "id": "joyce", "cast": "joyce", "at": [232, 162], "facingLeft": true } },
        { "say": "joyce", "text": "I want it back. I sold my mother's music box for thirty dollars. Who does that?" },
        { "say": "everett", "text": "Your father was first in line in 1987. I was second. I wanted that box for Junie Lattimer. She used to stop in front of Odile's window to look at the swan." },
        { "say": "joyce", "text": "...Junie Lattimer was my mother." },
        {
          "say": "everett",
          "text": [
            "I know. Royce bought it for a dollar and gave it to her for Christmas, and she married him in June. He was a good man. He was first in line.",
            "I'm not here to win anything. I just want to hear what she heard. Thirty-nine years. I never once heard it play."
          ]
        },
        { "find": "box", "in": "stock", "match": { "uniqueId": "swanbox" } },
        {
          "if": "!box",
          "then": [
            { "say": "joyce", "text": "It's gone? You sold it? Well. That's that, then. Thermos, Mr. Dunn?" },
            { "set": { "bfEnd": "sold" } },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": { "if": "flag.bfStand == 'no'", "then": "Honor Odile's flyer anyway", "else": "The line stands: first in line, one dollar" },
              "hint": "(Everett takes it home)",
              "then": [
                { "sell": "box" },
                { "coin": 20, "why": "Black Friday: first in line", "if": "flag.bfStand == 'twenty'" },
                { "coin": 1, "why": "Black Friday: first in line", "if": "flag.bfStand != 'twenty'" },
                { "rep": 2 },
                { "set": { "bfEnd": "dollar" } },
                {
                  "say": "everett",
                  "text": { "if": "flag.bfStand == 'twenty'", "then": "Twenty dollars. Odile would have said one. Thirty-nine years.", "else": "One dollar. Thirty-nine years." }
                },
                { "say": "joyce", "text": "Wind it every night. She did. It goes slow if you forget." },
                { "narrate": "He doesn't open it in the shop. He holds it in both hands all the way to his car." }
              ]
            },
            {
              "label": "Wind it now, for both of them",
              "hint": "(Joyce buys it back; Everett visits)",
              "then": [
                { "take": "box" },
                { "coin": 30, "why": "Joyce Pruitt bought back her mother's music box" },
                { "rep": 3 },
                { "set": { "bfEnd": "shared" } },
                { "narrate": "You wind it and set it on the counter between them. A slow waltz, a little flat on the high notes. Everett takes his cap off." },
                { "say": "joyce", "text": "Sundays. Mom's house is on Water Street. Come Sundays and wind it. Somebody should." },
                { "say": "everett", "text": "Sundays." }
              ]
            },
            {
              "label": "Wait for the five o'clock crowd",
              "hint": "(sell to the highest bidder)",
              "then": [
                { "narrate": "At five a man in a black puffer jacket joins the line with a printed list. By six there are nine people, and a small war about the music box in your window." },
                { "enter": { "id": "buster", "cast": "doorbuster", "at": [280, 166], "facingLeft": true } },
                { "say": "buster", "text": "Walnut, brass swan, working movement? One forty. Cash. I've got four more shops to do before eight." },
                { "sell": "box" },
                { "coin": 140, "why": "Sold the swan music box at the doorbuster" },
                { "rep": -2 },
                { "set": { "bfEnd": "sold" } },
                { "say": "everett", "text": "Second in line. Again." },
                { "say": "joyce", "text": "Come on, Mr. Dunn. I'll buy you breakfast. I owe somebody that, I think." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "blackfriday", "from": "3-1", "to": "3-4", "cast": "joyce", "scene": "joyceBox" },
    { "drift": "blackfriday", "from": "4-1", "to": "4-3", "cast": "everett", "scene": "everettFlyer", "if": "flag.bfBox && hook.boxHere" }
  ],
  "nights": [
    {
      "id": "bf-line",
      "window": ["4-4", "4-4"],
      "weekdays": [4],
      "if": "flag.bfBox && !flag.bfEnd",
      "scene": "bfLine",
      "test": [
        { "set": { "bfBox": true } },
        { "roll": { "bfStand": ["yes", "no", "twenty"] } },
        { "add": { "unique": "swanbox" } }
      ]
    }
  ],
  "calendar": [
    { "id": "bf-line", "night": "bf-line", "story": "blackfriday", "where": "Your front door", "title": "The Black Friday line", "known": "flag.bfStand", "scene": "bfLine" }
  ],
  "epilogue": [
    { "line": "Everett Dunn was first in line on Black Friday. He winds the swan box every night. It plays a little flat, he says, the way she would have heard it.", "if": "flag.bfEnd == 'dollar'" },
    { "line": "On Sundays Everett Dunn goes to the Pruitt house on Water Street and winds Junie's music box. Joyce makes coffee. Neither of them calls it anything.", "if": "flag.bfEnd == 'shared'" },
    { "line": "The swan music box went to a man with a printed list. Everett Dunn was second in line, again. Joyce Pruitt bought him breakfast.", "if": "flag.bfEnd == 'sold'" }
  ],
  "talk": {
    "by": "hal",
    "rumour": [
      "Everett Dunn came in for oil for the hinges of a folding chair older than me. Then he showed me a flyer from 1987. Your shop. Black Friday.",
      "He says he's going to be first in line outside your door. You having a sale? Nobody told me."
    ],
    "react": { "dollar": "Everett Dunn got his music box for a dollar. Thirty-nine years in line. I'd have given him the chair.", "shared": "Everett Dunn's on Water Street every Sunday now, at the Pruitt house. I sold him oil for the hinges. Hinges of what, I asked. He just smiled.", "sold": "I hear you sold the swan box to some fella with a list. Everett came in for a hinge and didn't say a word. He always says a word." }
  }
});
