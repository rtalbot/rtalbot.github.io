// Pawn Champ - The Longest Night. Major quest M30, batch M (docs/quests/MAJOR.md#m30-the-longest-night-town).
// December only. Saint Brine's sits up from dusk to dawn on the twenty-first with a lantern for
// everyone the town is missing. Odile kept a shelf of lanterns for anyone who came without one, and
// the shelf is empty. This December the lanterns come to your counter one at a time, each with a
// name attached, and on the night you carry them up the hill and keep them lit.
//
// Hook (W1 Wed to W2 Mon)    Father Ignatius pawns the Watch Lantern (1898, red glass) for the oil fund.
// Middle (W2 to W3)          Noreen Gallant sells her drowned husband's storm lantern; Josie Heald
//                            pawns her grandad's railway lamp; Vivienne Vane, a decorator from
//                            Newport, wants every lantern you have.
// Scene 1 (W3 Mon to Thu)    The shop after hours: filling the lanterns. Odile's list of names, and
//                            her last line: keep them lit until the sun is up, whatever knocks.
// Finale (W4 Mon, the 21st)  The vigil at Saint Brine's, dusk to dawn. Other stories join it at its
//                            "vigil" cue (The Second Page). The hall is drawn in js/quests/longestnight.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "longestnight",
  "kind": "major",
  "colour": "#e0a040",
  "family": "town",
  "title": "The Longest Night",
  "months": [3],
  "rumour": "Saint Brine's sits up all night on the twenty-first, with a lantern for everyone the town is missing.",
  "endings": { "dawn": "Till Dawn", "dark": "A Short Night", "sold": "Sold by Lantern Light" },
  "outcome": "flag.vigilEnd",
  "about": [
    "A December story about the vigil at Saint Brine's on the twenty-first, when the town sits up from dusk to dawn with a lantern for everyone it's missing. Odile used to bring a shelf of lanterns for people who came without one. Father Ignatius pawns the church's 1898 Watch Lantern to pay for oil (§{vigilWatch}); you can lend $60 on it, give $20 instead, or say no.",
    "Lanterns with names attached come over your counter: Noreen Gallant sells her drowned husband's storm lantern before she leaves for Florida (§{vigilNoreen}), and Josie Heald pawns her grandad's railway lamp, lit every year for his brother Teddy who went through the ice in 1958 (§{vigilJosie}). Vivienne Vane, a decorator from Newport, wants every antique lantern you have for a hotel lobby, and says she'll come to the vigil with cash (§{vigilVane}).",
    "One night you fill the lanterns and find Odile's list of the town's missing, with her note: \"Keep them lit until the sun is up. Whatever knocks.\" You can add Odile's name, or one of your own (§{vigilOil}).",
    "At the vigil (§{vigil}) your lanterns are lit and named, a friend may sit up with you, and other stories can step in around three in the morning. At two Vane offers cash for your row: sell, and it's Sold by Lantern Light. Otherwise it comes down to how many of your lanterns are still burning at four. Two or more hold till sunrise (Till Dawn); fewer is A Short Night."
  ],
  "notes": "The vigil is a cue: other stories' scenes can play inside it, at about three in the morning (\"cues\": [{ \"cue\": \"vigil\", ... }]). The Second Page's collection does, when both are drawn.",
  "cast": {
    "noreen": {
      "name": "Noreen Gallant",
      "look": { "skin": "#f0d0b8", "hair": "#d8d8d8", "hs": 3, "coat": "#6a3a4a", "style": "jacket", "long": true, "pants": "#2e2a30", "bag": "#3a2a22", "glasses": "#8a7a6a" }
    },
    "josie": {
      "name": "Josie Heald",
      "look": { "skin": "#d8a880", "hair": "#3a2416", "hs": 5, "coat": "#3a6a5a", "style": "puffer", "pants": "#2a2a3a", "band": "#e8c040" }
    },
    "vivienne": {
      "name": "Vivienne Vane",
      "look": { "skin": "#f0d0b8", "hair": "#e8d8a8", "hs": 4, "coat": "#e8e0d0", "trim": "#c8a050", "style": "jacket", "long": true, "pants": "#2a2a2e", "glasses": "#1a1a1e", "bag": "#7a2a2a" }
    }
  },
  "icons": {
    "watchlantern": [
      "....kkkk....",
      "...k....k...",
      "..kkkkkkkk..",
      "..koRRRRok..",
      "..koRYYRok..",
      "..koRYYRok..",
      "..koRRRRok..",
      "..koRRRRok..",
      "..kkkkkkkk..",
      "...koooook..",
      "....kkkk....",
      "............"
    ],
    "stormlantern": [
      "....kkkk....",
      "...k....k...",
      "...kkkkkk...",
      "..ksAAAAsk..",
      "..ksAYYAsk..",
      "..ksAYYAsk..",
      "..ksAAAAsk..",
      "..kkkkkkkk..",
      "..kddddddk..",
      "..kkkkkkkk..",
      "............",
      "............"
    ],
    "raillamp": [
      ".....kk.....",
      "....k..k....",
      "..kkkkkkkk..",
      "..kdddddkk..",
      ".kdkSSSkdk..",
      ".kdkSYSkdk..",
      ".kdkSSSkdk..",
      "..kdddddk...",
      "..kkkkkkk...",
      "...kdddk....",
      "...kkkkk....",
      "............"
    ]
  },
  "uniques": {
    "watchLantern": {
      "name": "The Watch Lantern (Saint Brine's, 1898)",
      "icon": "watchlantern",
      "cat": "curio",
      "guide": 220,
      "questKey": true,
      "set": "lanterns",
      "tells": [
        "A ship's lantern in tinned copper with a red glass globe. The first one lit at the vigil every year since 1898.",
        "Scratched inside the base, many hands: initials and years. The last is O.S., and no year."
      ]
    },
    "stormLantern": {
      "name": "Aldo Gallant's storm lantern",
      "icon": "stormlantern",
      "cat": "curio",
      "guide": 45,
      "questKey": true,
      "set": "lanterns",
      "tells": [
        "A kerosene storm lantern, dented, the brass worn bright where a hand held it.",
        "A paper tag on the bail: \"ALDO. MARIGOLD. 1991.\""
      ]
    },
    "railLamp": {
      "name": "An Old Colony railway lamp",
      "icon": "raillamp",
      "cat": "curio",
      "guide": 70,
      "set": "lanterns",
      "tells": [
        "A brakeman's hand lamp from the Old Colony line, with a clear lens and a green one that swings across.",
        "Scratched on the base: \"TEDDY. HOB'S POND. 1958.\""
      ]
    }
  },
  "spots": {
    "vigil": [
      {
        "id": "rope",
        "rect": { "x": 0, "y": 30, "w": 640, "h": 48 },
        "where": "Saint Brine's",
        "lines": [
          "Every lantern on the rope has a paper tag tied to its ring. A name and a year. The oldest says 1898.",
          "One tag just says \"the dog, 2019\". Nobody has ever taken it down.",
          "A lantern near the door has a tag in a child's handwriting: \"Grandpa (not lost, just in Florida)\"."
        ]
      },
      {
        "id": "thermos",
        "rect": { "x": 40, "y": 216, "w": 72, "h": 46 },
        "where": "Saint Brine's",
        "lines": [
          "Four thermoses: tomato soup, coffee, cocoa, and one marked FATHER I. that is not coffee.",
          "Someone has brought a tin of shortbread and written \"FOR 3 A.M. ONLY\" on the lid."
        ],
        "find": { "on": 1, "coin": 2, "line": "Two dollars folded under the shortbread tin, and a note: \"for whoever keeps the oil going\". You put it in the oil can." }
      },
      {
        "id": "creche",
        "rect": { "x": 396, "y": 196, "w": 116, "h": 76 },
        "where": "Saint Brine's",
        "lines": [
          "The crèche from the lawn, brought in out of the wind. The shepherd has a knitted hat on. It was cold.",
          "The baby in the manger is a doll from the 1970s with one eye that won't close. It has seen things."
        ]
      }
    ]
  },
  "scenes": {
    "vigilWatch": {
      "title": "Father Ignatius pawns the Watch Lantern for the oil fund",
      "customer": "ignatius",
      "steps": [
        { "set": { "vigilHeard": true } },
        {
          "say": "ignatius",
          "text": [
            "The twenty-first is the longest night of the year. Saint Brine's sits up from dusk to dawn, one lantern for everyone the town is missing. The sea, mostly. Not only the sea.",
            "Odile kept a shelf of lanterns for anyone who came without one. She sat in the back pew every year and did her accounts by them.",
            "The shelf's empty now, and so is our oil fund. This is the Watch Lantern, 1898. It's the first one lit, every year. Sixty dollars, until the collection plate on the night? Sister Amabel doesn't know I've brought it."
          ]
        },
        { "view": { "counterIcon": "watchlantern" } },
        {
          "choose": [
            {
              "label": "Lend him $60 against the Watch Lantern",
              "hint": "(he redeems it at dawn)",
              "disabled": "coin < 60 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                {
                  "hook": "lend",
                  "with": { "unique": "watchLantern", "lent": 60, "due": "4-2", "returns": false, "key": "vigil" }
                },
                { "set": { "vigilWatch": "held" } },
                { "say": "ignatius", "text": "Bring it up the hill on the night. And if any other lantern comes over your counter with a name tied to it, bring that too. That's what the shelf was for." }
              ]
            },
            {
              "label": "\"Keep your lantern, Father. Here's twenty for the oil.\"",
              "hint": "(-$20)",
              "disabled": "coin < 20",
              "then": [
                { "view": { "counterIcon": null } },
                { "coin": -20, "why": "Gave Father Ignatius twenty for the vigil oil" },
                { "rep": 2 },
                { "set": { "vigilWatch": "church" } },
                { "say": "ignatius", "text": "Bless you. Then come on the night, and if any lantern comes over your counter with a name tied to it, bring that. That's what Odile's shelf was for." }
              ]
            },
            {
              "label": "\"I can't, Father. Not this month.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "vigilWatch": "none" } },
                {
                  "say": "ignatius",
                  "text": [
                    "No, no. It's a hard month for everyone. Sister Amabel will find the oil in the bingo tin. She always does.",
                    "Come anyway, on the night. Odile never missed one."
                  ]
                }
              ]
            }
          ]
        },
        { "toast": "Calendar: the vigil at Saint Brine's, the twenty-first", "look": "ignatius" },
        { "leave": "ignatius" }
      ]
    },
    "vigilNoreen": {
      "title": "Noreen Gallant sells her drowned husband's storm lantern",
      "customer": "noreen",
      "steps": [
        {
          "say": "noreen",
          "text": [
            "Noreen Gallant. My Aldo went out on the Marigold in 1991, and the Marigold didn't come back. I've carried his lantern up to Saint Brine's every December since.",
            "I go to my daughter in Sarasota on the twentieth. One way. I can't take it on the plane, and I won't leave it in an empty house.",
            "Twenty dollars. And you light it on the night. That's the real price. The twenty is so you'll take it seriously."
          ]
        },
        { "offer": { "unique": "stormLantern" }, "persona": "honest", "asking": 20, "min": 15 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "noreen", "text": "Then I'll ask Father Ignatius to hang it in the porch. It's not the same. Nothing's the same." },
            { "leave": "noreen" },
            { "end": true }
          ]
        },
        { "set": { "vigilStorm": true } },
        { "say": "noreen", "text": "Thirty-one years. Somebody else can keep him company this time. Thank you." },
        { "leave": "noreen" }
      ]
    },
    "vigilJosie": {
      "title": "Josie Heald pawns her grandad's railway lamp",
      "customer": "josie",
      "steps": [
        {
          "say": "josie",
          "text": [
            "Josie Heald. This is my grandad's railway lamp. He was a brakeman on the Old Colony line.",
            "Every December he carries it up to Saint Brine's for his brother Teddy, who went through the ice on Hob's Pond in 1958. Grandad was nine. He was holding the other end of the rope.",
            "He's in the Alden House home now. He doesn't always know it's December. And I'm going to my mom's in Maine for Christmas, and the bus is thirty-five dollars.",
            "Thirty-five on it, and I buy it back after New Year's? And if you're going to the vigil... would you light it? For Teddy. Grandad would want it lit even if he doesn't know."
          ]
        },
        { "view": { "counterIcon": "raillamp" } },
        {
          "choose": [
            {
              "label": "Lend her $35, and light it for Teddy",
              "disabled": "coin < 35 || !shelf.free",
              "then": [
                { "view": { "counterIcon": null } },
                {
                  "hook": "lend",
                  "with": { "unique": "railLamp", "lent": 35, "nextMonth": 4, "returns": true, "key": "railLamp" },
                  "note": "due the Thursday after New Year's"
                },
                { "set": { "vigilRail": true } },
                { "say": "josie", "text": "The green lens is for \"stop\". Grandad says leave it on clear. Teddy liked the clear one." }
              ]
            },
            {
              "label": "\"Keep your grandad's lamp. I'll ask Father Ignatius to say Teddy's name.\"",
              "hint": "(rep +1)",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "vigilTeddy": true } },
                { "rep": 1 },
                { "say": "josie", "text": "Theodore Heald. Teddy. Thank you. I'll hitch to Maine. Everybody hitches in our family. It's fine." }
              ]
            },
            {
              "label": "\"I can't lend on it.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "josie", "text": "Okay. Okay. I'll ask at the Anchor. Somebody's always going north." }
              ]
            }
          ]
        },
        { "leave": "josie" }
      ]
    },
    "vigilVane": {
      "title": "Vivienne Vane, a decorator from Newport, wants every lantern you have",
      "customer": "vivienne",
      "steps": [
        { "set": { "vigilVane": true } },
        { "say": "vivienne", "text": "Vivienne Vane, Vane Interiors, Newport. I'm dressing a hotel lobby for New Year's Eve. Two hundred antique lanterns, every one lit. I have a hundred and sixty-one." },
        { "find": "watch", "in": "stock", "match": { "uniqueId": "watchLantern" } },
        { "find": "storm", "in": "stock", "match": { "uniqueId": "stormLantern" } },
        { "find": "rail", "in": "stock", "match": { "uniqueId": "railLamp" } },
        {
          "if": "watch || storm || rail",
          "then": [
            {
              "say": "vivienne",
              "text": { "if": "watch", "then": "And you have {hook:heldWord}. That red one. 1898, if I know glass, and I do. I'd pay three hundred for it this minute.", "else": "And you have {hook:heldWord}. Old ones, with the dents in the right places." }
            }
          ],
          "else": [
            { "say": "vivienne", "text": "You have none. How does a pawnshop in a harbor town have no lanterns? Never mind." }
          ]
        },
        { "say": "vivienne", "text": "I hear the church does a vigil on the twenty-first. A room full of antique lanterns. I'll come and look. I'll bring cash, because people say yes to cash at two in the morning." },
        {
          "choose": [
            {
              "label": "\"They're not for sale, Ms. Vane.\"",
              "then": [{ "say": "vivienne", "text": "Everything's for sale at two in the morning." }]
            },
            {
              "label": "\"Come to the vigil, then. See what they're for.\"",
              "then": [{ "say": "vivienne", "text": "Oh, I know what they're for. They're for a lobby." }]
            }
          ]
        },
        { "leave": "vivienne" }
      ]
    },
    "vigilOil": {
      "title": "After hours: filling the lanterns, and Odile's list of names",
      "steps": [
        {
          "stage": "shopNight",
          "view": { "candleX": 236 },
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
          ]
        },
        { "find": "watch", "in": "stock", "match": { "uniqueId": "watchLantern" } },
        { "find": "storm", "in": "stock", "match": { "uniqueId": "stormLantern" } },
        { "find": "rail", "in": "stock", "match": { "uniqueId": "railLamp" } },
        {
          "if": "watch || storm || rail",
          "then": [
            { "narrate": "After closing, on newspaper on the counter: {hook:heldList}. A can of lamp oil from Mayhew's, a rag, and a box of matches." }
          ],
          "else": [
            { "narrate": "After closing. No lanterns on the counter, but Father Ignatius asked you to come, so you go looking for Odile's lantern shelf. It's at the back of the stockroom, empty, with the dust still showing where they stood." }
          ]
        },
        { "coin": -12, "why": "Lamp oil and wicks from Mayhew's" },
        {
          "narrate": { "if": "watch", "then": "Unscrewing the Watch Lantern's base to trim the wick, a fold of paper drops out. Thin and soft, folded many times.", "else": "On the shelf's back edge, tucked behind the bracket, a fold of paper. Thin and soft, folded many times." }
        },
        {
          "narrate": [
            "A list of names in a dozen hands. \"The crew of the Abigail Cole, 1898.\" Fishermen, mostly. A girl in 1931. Teddy Heald, 1958. Aldo Gallant, 1991. Then a page in Odile's handwriting, names you half know from the ledger.",
            "At the bottom, in Odile's hand, underlined twice: \"Keep them lit until the sun is up. Whatever knocks. — O.\""
          ]
        },
        { "set": { "vigilWarned": true } },
        {
          "choose": [
            {
              "label": "Add Odile's name. She's missing too.",
              "if": "!flag.odileHome && !flag.odileFreed",
              "then": [
                { "set": { "vigilName": "odile" } },
                { "narrate": "You write \"Odile\" under her own line. It looks wrong in your handwriting. You leave it." }
              ]
            },
            {
              "label": "Add a name for your own family",
              "then": [
                { "set": { "vigilName": "family" } },
                { "narrate": "You write a name you haven't said out loud in a while. It looks small on the page, and right." }
              ]
            },
            {
              "label": "\"Not yet. Nobody yet.\"",
              "then": [
                { "set": { "vigilName": "none" } },
                { "narrate": "You fold the list along its old creases and put it in your coat." }
              ]
            }
          ]
        },
        { "toast": "Calendar: the vigil at Saint Brine's, dusk to dawn", "icon": "watchlantern" }
      ]
    },
    "vigil": {
      "title": "The vigil at Saint Brine's, dusk to dawn",
      "steps": [
        { "set": { "vigilTonight": true } },
        { "hook": "setUp", "note": "your row: whichever lanterns you brought, unlit" },
        {
          "stage": "vigil",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [104, 168] },
            { "id": "ignatius", "cast": "ignatius", "at": [168, 162], "facingLeft": true },
            { "id": "amabel", "cast": "amabel", "at": [40, 160] },
            { "id": "neighbor", "look": "random", "at": [16, 172] },
            { "id": "pew", "look": "random", "at": [[268, 170], [292, 174], [306, 166]], "facingLeft": true }
          ]
        },
        { "narrate": "The longest night. The sun went down at twelve past four, and Saint Brine's hall is already full: benches turned to the altar, coats on, and a rope strung wall to wall with the town's lanterns." },
        {
          "if": "flag.vigilWatch == 'held'",
          "then": [
            { "say": "ignatius", "text": "You brought it. Give it here. The Watch Lantern goes first. It always goes first." },
            { "hook": "light", "with": "watch" },
            { "narrate": "He lights it from the altar candle with a long taper. The red glass takes, and the whole room goes a shade warmer, as if someone opened an oven." }
          ],
          "else": [
            {
              "say": "ignatius",
              "text": { "if": "flag.vigilWatch == 'church'", "then": "Your twenty bought the oil. Look at them all.", "else": "Sister Amabel found the oil money in the bingo tin. As I said." }
            },
            { "narrate": "He lights the Watch Lantern from the altar candle with a long taper, and hangs it at the head of the rope. Red glass, 1898." }
          ]
        },
        { "find": "watch", "in": "stock", "match": { "uniqueId": "watchLantern" } },
        { "find": "storm", "in": "stock", "match": { "uniqueId": "stormLantern" } },
        { "find": "rail", "in": "stock", "match": { "uniqueId": "railLamp" } },
        {
          "if": "storm",
          "then": [
            { "hook": "light", "with": "storm" },
            { "narrate": "You light Aldo Gallant's storm lantern and hang it in your row. Father Ignatius reads the tag aloud, \"Aldo, the Marigold, 1991\", and somebody at the back says \"Noreen's Aldo\" quietly, the way you'd say hello." }
          ]
        },
        {
          "if": "rail",
          "then": [
            { "hook": "light", "with": "rail" },
            { "narrate": "The railway lamp, lens on clear. \"Theodore Heald, Hob's Pond, 1958.\" An old woman in the second row puts her hand to her mouth. \"I was at that pond,\" she says to nobody. \"Little Teddy.\"" }
          ],
          "else": [
            { "say": "ignatius", "text": "And Theodore Heald. Teddy. Hob's Pond, 1958. His brother asked, by way of his granddaughter, by way of the pawnshop. That's how it works.", "if": "flag.vigilTeddy" }
          ]
        },
        {
          "hook": "told",
          "with": [
            "Lucy Brannigan lights a lantern for her brother, who went to Alaska on a crab boat in 1979 and writes every Christmas, never with a return address.",
            "The Furtados light three, one for each of the cousins who sailed for the Grand Banks in 1966, and argue about the order.",
            "A man nobody knows lights a lantern for \"the dog, 2019\", the same as every year, and leaves before midnight.",
            "Rosa from Lowe's Bakery lights one for her grandmother in Lisbon, who isn't lost at all, but is very far away.",
            "Two teenagers hang a lantern with no tag on it at all. When Father Ignatius asks, they say \"everyone at the high school\". He doesn't ask again.",
            "Lark and Linnet light one between them for a gull with one leg that lived on the school roof, and nobody laughs, because the gull was a fixture."
          ],
          "sets": ["told"],
          "note": "three of the town's lanterns get their story told, picked from these by the run code"
        },
        { "narrate": ["{told.0}", "{told.1}", "{told.2}"] },
        { "narrate": "Before midnight you give Father Ignatius the list. He reads every name on it, slowly, and the last one, \"Odile\", twice. Nobody in the hall says anything. A few people nod.", "if": "flag.vigilName == 'odile'" },
        { "narrate": "Before midnight you give Father Ignatius the list. He reads every name on it, including the one you added, and doesn't look at you when he says it, which is a kindness.", "if": "flag.vigilName == 'family'" },
        { "cue": "vigil", "note": "later stories join the night here (The Second Page)" },
        { "narrate": "Midnight. Soup in paper cups. Father Ignatius asleep upright in the front pew, still holding his taper." },
        {
          "hook": "friend",
          "sets": ["friend", "friendId"],
          "note": "friends and grudges (js/standing.js): a friend sits up with you"
        },
        {
          "if": "friend",
          "then": [
            { "say": "friend", "text": "Budge up. I brought a thermos and a spare lantern for your row. Nobody sits up alone on my watch." },
            { "hook": "friendSits" }
          ]
        },
        { "hook": "enemy", "sets": ["enemy"] },
        {
          "if": "enemy",
          "then": [
            { "say": "enemy", "text": "I didn't know pawnbrokers came to these. I suppose somebody has to price the lanterns." },
            { "hook": "hide", "with": "enemy" }
          ]
        },
        {
          "if": "flag.vigilVane",
          "note": "two in the morning: an offer",
          "then": [
            { "enter": { "id": "vane", "cast": "vivienne", "at": [300, 164], "facingLeft": true } },
            { "narrate": "Two in the morning. The door lets in a gust of cold and a woman in a camel coat, who stamps the snow off her boots and walks along the rope like it's a shop window." },
            {
              "if": "hook.vaneOffer > 0",
              "then": [
                { "say": "vane", "text": "Every lantern in your row. {hook:vaneOffer|money}, cash, now. Blow them out and they're in my car before anybody wakes up." },
                {
                  "choose": [
                    {
                      "label": "Sell her your row",
                      "hint": "(+{hook:vaneOffer|money}; the vigil sees it go)",
                      "then": [
                        { "set": { "vigilEnd": "sold" } },
                        { "hook": "sellRow", "with": "Sold the vigil lanterns to Vane Interiors" },
                        { "rep": -6 },
                        { "narrate": "You blow them out one by one. The little puffs of smoke are the loudest thing in the hall. Sister Amabel watches you do it and doesn't say a word." },
                        {
                          "say": "ignatius",
                          "text": [
                            "...Is it morning? No. No, it isn't.",
                            "The Watch Lantern was pawned, not sold. But I suppose that's a distinction for daylight."
                          ]
                        },
                        { "narrate": "You leave by the side door. Behind you, somebody relights a candle and starts the list again from the top." },
                        { "set": { "vigilTonight": false } },
                        { "end": true }
                      ]
                    },
                    {
                      "label": "\"Sit down, Ms. Vane. Have some soup. Stay till dawn.\"",
                      "then": [
                        { "say": "vane", "text": "Soup. At two in the morning. In a church." },
                        { "narrate": "She sits. She has the tomato. By three she's asking Sister Amabel about the tags, and writing nothing down." },
                        { "set": { "vigilVaneStayed": true } }
                      ]
                    }
                  ]
                }
              ],
              "else": [
                { "say": "vane", "text": "You didn't bring any. Of course you didn't." },
                { "narrate": "She walks the rope twice, counting, then sits down at the end of a bench and doesn't leave until the soup is gone." }
              ]
            }
          ]
        },
        { "narrate": "Four in the morning. The coldest hour. The oil in the rope lanterns is low, and one by one the town's lanterns gutter and go out." },
        { "hook": "hall", "with": { "out": 4 } },
        {
          "if": "hook.litCount < 2",
          "then": [
            { "hook": "hall", "with": { "out": 8 } },
            { "set": { "vigilEnd": "dark" } },
            {
              "narrate": { "if": "hook.litCount > 0", "then": "Your one lantern holds, but one isn't a room. By five the hall is dark except for the altar candles, and people have started to go home.", "else": "Your corner has nothing to keep lit. By five the hall is dark except for the altar candles, and people have started to go home." }
            },
            { "say": "ignatius", "text": "Odile's shelf used to keep that corner lit. That's all it was. A corner. It turns out a corner matters." },
            { "rep": 1 }
          ],
          "else": [
            {
              "narrate": [
                "Your row holds. In the front of the dark hall, your lanterns are the only light that isn't candles, and people drift their chairs toward them, the way people do toward a stove.",
                "Nothing knocks. Or if it does, nobody hears it over Sister Amabel's snoring."
              ]
            },
            { "hook": "dawn", "note": "the sun comes up through the windows" },
            { "narrate": "At thirteen past seven the sun comes through the blue glass, then the gold. Father Ignatius wakes, sees the light and your row still burning, and says \"Ha!\" as if he's won something." },
            { "set": { "vigilEnd": "dawn" } },
            { "rep": 5, "why": "Kept the vigil till dawn" }
          ]
        },
        {
          "if": "hook.watchLoan && flag.vigilEnd != 'sold'",
          "then": [
            { "hook": "redeem", "with": "Father Ignatius redeemed the Watch Lantern from the collection plate" },
            { "say": "ignatius", "text": "The plate came to more than the oil. Here. The Watch Lantern goes home, and so do you." }
          ]
        },
        { "find": "storm", "in": "stock", "match": { "uniqueId": "stormLantern" } },
        { "hook": "release", "with": "storm", "if": "storm && flag.vigilEnd != 'sold'", "note": "Aldo's lantern is yours to sell now" },
        { "refresh": "panel" },
        { "set": { "vigilTonight": false } }
      ]
    }
  },
  "beats": [
    { "drift": "longestnight", "from": "1-3", "to": "2-1", "cast": "ignatius", "scene": "vigilWatch" },
    { "drift": "longestnight", "from": "2-1", "to": "2-3", "cast": "noreen", "scene": "vigilNoreen", "if": "flag.vigilHeard" },
    { "drift": "longestnight", "from": "2-4", "to": "3-2", "cast": "josie", "scene": "vigilJosie", "if": "flag.vigilHeard" },
    { "drift": "longestnight", "from": "3-1", "to": "3-3", "cast": "vivienne", "scene": "vigilVane", "if": "flag.vigilHeard" }
  ],
  "nights": [
    {
      "id": "vigil-oil",
      "window": ["3-1", "3-4"],
      "if": "flag.vigilHeard && !flag.vigilEnd",
      "scene": "vigilOil",
      "test": [{ "set": { "vigilHeard": true } }, { "add": { "unique": "watchLantern" } }]
    },
    {
      "id": "vigil",
      "window": ["4-1", "4-1"],
      "if": "flag.vigilHeard && !flag.vigilEnd",
      "scene": "vigil",
      "test": [
        { "set": { "vigilHeard": true, "vigilVane": true, "vigilWatch": "held", "vigilName": "odile" } },
        { "hook": "testLoan", "note": "the Watch Lantern, on loan" },
        { "add": { "unique": "stormLantern" } },
        { "if": "random < 0.5", "then": [{ "add": { "unique": "railLamp" } }] }
      ]
    }
  ],
  "calendar": [
    { "id": "vigil-oil", "night": "vigil-oil", "story": "longestnight", "where": "Your shop, after hours", "title": "Fill the lanterns", "known": "flag.vigilHeard", "scene": "vigilOil" },
    { "id": "vigil", "night": "vigil", "story": "longestnight", "where": "Saint Brine's", "title": "The Longest Night", "known": "flag.vigilHeard", "scene": "vigil" }
  ],
  "epilogue": [
    { "line": "On the longest night your row at Saint Brine's burned until the sun came up. There's a shelf behind your counter again, with lanterns on it, for whoever comes without one.", "if": "flag.vigilEnd == 'dawn'" },
    { "line": "The vigil at Saint Brine's went dark at five in the morning, in your corner first. Father Ignatius says next year. He says it kindly.", "if": "flag.vigilEnd == 'dark'" },
    {
      "line": { "if": "flag.vigilVaneStayed", "then": "The lanterns from Saint Brine's vigil hang in a hotel lobby in Newport, lit by electric bulbs.", "else": "The lanterns from Saint Brine's vigil hang in a hotel lobby in Newport, lit by electric bulbs. Their tags are in a drawer at Vane Interiors." },
      "if": "flag.vigilEnd == 'sold'"
    },
    { "line": "{hook:friendName} sat up with you on the longest night, and says so to anyone who asks.", "if": "hook.friendName" }
  ],
  "talk": {
    "by": "ignatius",
    "rumour": [
      "The twenty-first is the longest night. Saint Brine's sits up from dusk to dawn with a lantern for everyone the town is missing.",
      "Odile always brought a shelf of lanterns for anyone who came without one. I've been wondering who brings them now."
    ],
    "react": { "dawn": "Your row burned till the sun came through the glass. I woke up and said \"Ha!\" out loud. Sister Amabel has not let me forget it.", "dark": "The corner went dark at five. It happens. Odile's first year, it went dark at four.", "sold": "I'm told our Watch Lantern is lighting a hotel lobby in Newport. I hope the guests feel very watched." },
    "sway": {
      "dawn": { "ignatius": 3, "nanFerreira": 1 },
      "dark": { "ignatius": -1 },
      "sold": { "ignatius": -3, "nanFerreira": -2 }
    }
  }
});
