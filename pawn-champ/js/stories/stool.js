// Pawn Champ - Stool Nine. Major quest M27, batch G (docs/quests/MAJOR.md#m27-stool-nine-town-january-from-month-2).
// January only (a stay-on story). Pearl's Luncheonette closes after sixty-one years. Pearl sells the
// fittings through you, and everyone wants their own stool back: sixty years of initials are
// scratched under the seats. Stool nine has been missing since 1977, and it's the one Pearl wants.
//
// Hook (W1 Mon)              Pearl Santangelo sells the order wheel, and leaves the stools with you.
// Middle (W1 Wed, W2 Mon)    Dot wants the whole counter for the Clam Shack; a coffee chain wants the lease.
// Scene 1 (W1 Tue-W2 Tue)    Pearl's at five in the morning. Under the stools: who sat where.
// Scene 2 (W2 Tue-W3 Wed)    Ernie Lavallee's kitchen, and stool nine.
// Finale (W3 Wed-W4 Thu)     Pearl's last night.
// Crossings: M11 The Selectmen's Race (whoever won it cuts a ribbon), M12 The Breakwaters Reunion
// (they play the last night, if the band got back together).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "stool",
  "kind": "major",
  "colour": "#e85a6a",
  "family": "town",
  "title": "Stool Nine",
  "months": [4],
  "crosses": ["breakwaters", "selectmen"],
  "rumour": "Pearl's Luncheonette is closing at the end of January, after sixty-one years.",
  "endings": { "dot": "The Counter at the Clam Shack", "home": "Every Stool Goes Home", "chain": "Daybreak Coffee Co.", "mornings": "Thursdays at Pearl's" },
  "icons": {
    "orderwheel": [
      "............",
      "....kkkk....",
      "..kkcsSckk..",
      ".kcssssssck.",
      ".kSskkkkssk.",
      "kcsk....ksck",
      "kcsk....ksck",
      ".kSskkkkssk.",
      ".kcssssssck.",
      "..kkcsSckk..",
      "....kkkk....",
      "............"
    ],
    "stool": [
      "............",
      "..kkkkkkkk..",
      ".krRRRRRRrk.",
      ".krrrrrrrrk.",
      "..kkkkkkkk..",
      ".....ks.....",
      ".....kS.....",
      ".....ks.....",
      ".....kS.....",
      "...kkssk....",
      "..kssSSssk..",
      "..kkkkkkkk.."
    ]
  },
  "about": [
    "A January story about a diner closing. Pearl Santangelo is shutting Pearl's Luncheonette after sixty-one years. She sells you the order wheel and asks you to sell her twelve stools to the people who sat on them (§{pearlFittings}). All except stool nine, her late husband Angelo's, which someone unbolted in the night in 1977. She'd like it back before she goes.",
    "At Pearl's at five in the morning (§{stoolDawn}) the regulars' initials are scratched under the stools, and under stool eight, E.L., every year until 1977. Ernie Lavallee, the oil truck driver, has stool nine bolted to his kitchen floor (§{stoolHouse}). He took it so Pearl would stop setting a coffee for a dead man and look up at who was on eight. You can buy it, leave it with him, or ask him to bring it back himself.",
    "Dot offers $200 for the whole counter to keep in the Clam Shack over winter (§{dotCounter}). Tamsin Royle of Daybreak Coffee Co. offers $500 for all the fittings, which ends the story if you take it then (§{tamsinCalls}).",
    "On Pearl's last night (§{stoolLast}) stool nine comes home, if you found it. Then you decide: send the stools home (Every Stool Goes Home), sell to the coffee chain (Daybreak Coffee Co.), give Dot the counter (The Counter at the Clam Shack), or, if Ernie came, ask Pearl to keep cooking on Thursdays (Thursdays at Pearl's)."
  ],
  "cast": {
    "pearl": {
      "name": "Pearl Santangelo",
      "look": { "skin": "#e8c0a0", "hair": "#e8e8ec", "hs": 3, "coat": "#f4f0e4", "trim": "#c83a3a", "style": "dress", "apron": "#f4f4f0", "pants": "#3a3a40", "glasses": "#c8a050" }
    },
    "ernie": {
      "name": "Ernie Lavallee",
      "look": { "skin": "#d8a888", "hair": "#d8d8dc", "hs": 0, "coat": "#3a4a6a", "trim": "#e8c050", "style": "jacket", "pants": "#2a2a32", "hat": "cap", "hatc": "#c83a3a", "logo": "#e8c050" }
    },
    "tamsin": {
      "name": "Tamsin Royle",
      "look": { "skin": "#f0d0b8", "hair": "#2a1a14", "hs": 4, "coat": "#2a2a2a", "trim": "#e8a050", "style": "puffer", "pants": "#3a3a40", "bag": "#e8a050" }
    }
  },
  "uniques": {
    "orderWheel": {
      "name": "Pearl's order wheel",
      "icon": "orderwheel",
      "cat": "curio",
      "guide": 45,
      "condLabel": "Sixty-one years of tickets",
      "questKey": true,
      "tells": [
        "A chrome order wheel off a diner pass-through. Eight clips, worn shiny.",
        { "text": "One ticket is still clipped on, gone brown: \"#9. 2 over easy, rye, black. A.S.\" The date is 1976.", "cls": "good" }
      ]
    },
    "stoolNine": {
      "name": "Stool nine",
      "icon": "stool",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Polished",
      "questKey": true,
      "tells": [
        "A chrome lunch-counter stool with a red top. Someone has polished it every week for forty-seven years.",
        "Underneath, only two sets of initials: A.S., scratched deep, and a small E.L. right next to it, scratched once."
      ]
    }
  },
  "scenes": {
    "pearlFittings": {
      "title": "Pearl sells the order wheel",
      "customer": "pearl",
      "steps": [
        {
          "say": "pearl",
          "text": [
            "Pearl Santangelo. Pearl's, on Main Street. Sixty-one years. I close on the last Thursday of the month, and my knees close the week after.",
            "My son says sell the fittings. I don't know how to sell anything that isn't eggs. Start with this. It's the order wheel. Thirty dollars?"
          ]
        },
        { "offer": { "unique": "orderWheel" }, "persona": "proud", "asking": 30, "min": 22 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "stoolOut": true } },
            { "say": "pearl", "text": "Well. I'll give it to the dump man. He's had my eggs for forty years, he can have my wheel." },
            { "leave": "pearl" },
            { "end": true }
          ]
        },
        { "set": { "stoolIn": true } },
        {
          "say": "pearl",
          "text": [
            "And the stools. Twelve of them. Everyone in town will want the one they sat on, and you've got a till that isn't a coffee can. Sell them for me.",
            "Except stool nine. Nine's been gone since 1977. I'd like it back before I go. Come in early one morning, before the boats go out. You'll see."
          ]
        },
        { "toast": "Calendar: Pearl's, at five in the morning", "look": "pearl" },
        { "leave": "pearl" }
      ]
    },
    "dotCounter": {
      "title": "Dot wants the whole counter",
      "customer": "dot",
      "steps": [
        {
          "say": "dot",
          "text": [
            "You're selling Pearl's stools. I sat on number four from 1968 till last Tuesday. My initials are under it twice, because I got married.",
            "Here's a thought. The Clam Shack's shut all winter. I'll buy the whole counter, stools and all, and put it in my front room till spring. Nobody has to choose."
          ]
        },
        { "set": { "stoolDot": true } },
        { "say": "dot", "text": "Think about it. Two hundred for the lot. I'd go higher but I've met me." },
        { "leave": "dot" }
      ]
    },
    "tamsinCalls": {
      "title": "A coffee chain wants the lease",
      "customer": "tamsin",
      "steps": [
        {
          "say": "tamsin",
          "text": [
            "Tamsin Royle, Daybreak Coffee Co., regional expansion. We're taking Pearl's lease. It's a fantastic corner.",
            "We'd love to keep the fittings. The stools, the wheel, the pie case. Very authentic. Five hundred for the lot, and you don't have to do any of the work."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell her the fittings",
              "hint": "(+$500, rep -6; the story ends here)",
              "then": [
                { "find": "wheel", "in": "stock", "match": { "uniqueId": "orderWheel" } },
                { "take": "wheel" },
                { "coin": 500, "why": "Sold Pearl's fittings to Daybreak Coffee" },
                { "rep": -6, "why": "Sold Pearl's fittings to a coffee chain" },
                { "set": { "stoolEnd": "chain", "stoolDone": true } },
                { "say": "tamsin", "text": "Amazing. We're going to put the order wheel on the wall with a little plaque." },
                { "leave": "tamsin" },
                { "end": true }
              ]
            },
            { "label": "\"They're not mine to sell yet.\"" }
          ]
        },
        { "say": "tamsin", "text": "Sure. Take your time. The offer's good until the paint goes on." },
        { "leave": "tamsin" }
      ]
    },
    "stoolDawn": {
      "title": "Pearl's at five in the morning",
      "steps": [
        { "hook": "gap", "with": 9, "note": "which stool is missing from Pearl's counter (js/places), 0 for none" },
        {
          "stage": "pearls",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [140, 168] },
            { "id": "pearl", "cast": "pearl", "at": [300, 150], "facingLeft": true }
          ]
        },
        { "narrate": "Pearl's at five past five. Snow in the window, eggs on the flat-top, and eleven fishermen on eleven stools, not one of them talking." },
        { "say": "pearl", "text": "Turn them over when they get up. Go on. Everybody's scratched their name under their stool since 1963. I pretend I don't know." },
        { "narrate": "Under stool four, D.H. twice. Under stool two, a boat name and a heart. Under stool eight, E.L., scratched over and over, once a year, from 1966 to 1977. Then nothing." },
        {
          "say": "pearl",
          "text": [
            "Nine was my Angelo's. He sat there every morning for eleven years and ordered the same thing, and I wrote it on a ticket anyway because he liked to see me write it.",
            "He died in the winter of '76. I kept setting a coffee at nine for a year. Then one morning in '77 the stool was gone. Somebody unbolted it in the night."
          ]
        },
        {
          "choose": [
            {
              "label": "\"Who was E.L.?\"",
              "then": [
                { "say": "pearl", "text": "Ernie Lavallee. Drove the oil truck. Still does, at eighty-one, God help the road. He sat on eight for thirty years. He doesn't come in any more." }
              ]
            },
            {
              "label": "\"Did you ever look for it?\"",
              "then": [
                { "say": "pearl", "text": "Look for a stool? In a town this size? I'd have found it in a week. I didn't want to find who took it. I'd have had to be angry with them." }
              ]
            }
          ]
        },
        { "narrate": "Ernie Lavallee lives on Front Street, above the oil company's yard. Pearl says that last part without looking up from the grill." },
        { "set": { "stoolClue": true } },
        { "toast": "Calendar: Ernie Lavallee's kitchen", "look": "pearl" }
      ]
    },
    "stoolHouse": {
      "title": "Ernie Lavallee's kitchen",
      "steps": [
        {
          "stage": "kitchenNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] },
            { "id": "ernie", "cast": "ernie", "at": [230, 162], "facingLeft": true }
          ]
        },
        { "narrate": "Ernie Lavallee's kitchen. At the end of the counter, bolted to the lino, a chrome stool with a red top, polished till it shines." },
        {
          "say": "ernie",
          "text": [
            "You've been to Pearl's. I can tell. You've got that look like you've been told something.",
            "Angelo was my friend. When he died she put a coffee at nine every morning for a year, and nobody sat there, and she'd pour it out at closing.",
            "I thought, if the stool's gone, she'll stop. And she'll look up, and see who's on eight. She stopped. She never looked up.",
            "Forty-seven years I've had my coffee on that stool. Don't tell me that's pathetic. I know what it is."
          ]
        },
        {
          "choose": [
            {
              "label": "\"Bring it back yourself, on her last night.\"",
              "then": [
                { "set": { "stoolErnie": true } },
                {
                  "say": "ernie",
                  "text": ["Me. Walk in there with it. In front of everybody.", "...I'll need to shave."]
                }
              ]
            },
            {
              "label": "Buy it from him for Pearl",
              "hint": "(-$40)",
              "disabled": "coin < 40 || !shelf.free",
              "then": [
                { "coin": -40, "why": "Bought stool nine from Ernie Lavallee" },
                { "add": { "unique": "stoolNine" } },
                { "refresh": "panel" },
                { "say": "ernie", "text": "Take it. I'll unbolt it now. I've got the same wrench." }
              ]
            },
            {
              "label": "\"It's yours. Keep it.\"",
              "then": [
                { "say": "ernie", "text": "Thank you. I'll be at the back on her last night. Somebody has to." }
              ]
            }
          ]
        }
      ]
    },
    "stoolLast": {
      "title": "Pearl's last night",
      "steps": [
        { "find": "stool", "in": "stock", "match": { "uniqueId": "stoolNine" } },
        { "hook": "gap", "with": 0, "if": "flag.stoolErnie || stool" },
        { "hook": "gap", "with": 9, "if": "!(flag.stoolErnie || stool)" },
        {
          "stage": "pearls",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "pearl", "cast": "pearl", "at": [300, 150], "facingLeft": true }
          ]
        },
        { "narrate": "Pearl's last night. The whole town is on twelve stools, and on the floor, and in the doorway with the snow coming in. Pearl is cooking. She says she isn't crying, it's the onions." },
        {
          "narrate": { "if": "flag.selectWin == 'tess'", "then": "Selectman Bascombe cuts a red ribbon across the door, which is not how closings work, and nobody minds.", "else": "Selectman Haines cuts a red ribbon across the door, which is not how closings work, and nobody minds." },
          "if": "flag.selectWin == 'tess' || flag.selectWin == 'gordie'"
        },
        { "narrate": "The Breakwaters play in the corner by the pie case, unplugged and quiet, because the plates rattle.", "if": "flag.bwGig || quest.breakwaters" },
        {
          "if": "flag.stoolErnie",
          "then": [
            { "enter": { "id": "ernie", "cast": "ernie", "at": [200, 164] } },
            { "narrate": "The door opens. Ernie Lavallee, shaved, in a tie, carrying a chrome stool with a red top. The room goes quiet. He bolts it into the gap, and sits down on eight." },
            { "say": "pearl", "text": "Ernie Lavallee. Forty-seven years." },
            { "narrate": "She pours a coffee and puts it at nine. Then, after a moment, she slides it along to eight." }
          ],
          "else": [
            {
              "if": "stool",
              "then": [
                { "take": "stool" },
                { "narrate": "You carry stool nine in through the back and bolt it into the gap. Pearl turns round from the grill, sees it, and turns back to the grill so you can't see her face." },
                { "say": "pearl", "text": "Two over easy, rye, black. I'll write it on a ticket. He liked to see me write it." }
              ],
              "else": [
                { "narrate": "There's still a gap at nine. Pearl sets a coffee there anyway, the way she did in 1976, and nobody sits on it all night." }
              ]
            }
          ]
        },
        {
          "choose": [
            {
              "label": "Send the stools home, one at a time, to whoever sat on them",
              "hint": "(+$90, rep +10)",
              "then": [
                { "coin": 90, "why": "Sold Pearl's stools to the people who sat on them" },
                { "rep": 10, "why": "Sent Pearl's stools home" },
                { "narrate": "Everyone leaves with their stool over their shoulder, out into the snow, down Main Street in every direction. Pearl watches them go from the window." },
                { "set": { "stoolEnd": "home" } }
              ]
            },
            {
              "label": "Sell the fittings to Daybreak Coffee",
              "hint": "(+$500, rep -6)",
              "then": [
                { "coin": 500, "why": "Sold Pearl's fittings to Daybreak Coffee" },
                { "rep": -6, "why": "Sold Pearl's fittings to a coffee chain" },
                { "narrate": "Tamsin Royle's van takes the counter in the morning. The town walks past the new coffee shop for a week without looking in." },
                { "set": { "stoolEnd": "chain" } }
              ]
            },
            {
              "label": "Sell the whole counter to Dot for the Clam Shack",
              "hint": "(+$200)",
              "if": "flag.stoolDot",
              "then": [
                { "coin": 200, "why": "Sold Pearl's counter to Dot Haskell" },
                { "enter": { "id": "dot", "cast": "dot", "at": [60, 166] } },
                { "say": "dot", "text": "Front room of the Clam Shack. Pearl, you can come and sit at your own counter all winter and I'll make you eggs. Badly." },
                { "set": { "stoolEnd": "dot" } }
              ]
            },
            {
              "label": "Ask Pearl to keep cooking one morning a week",
              "hint": "(rep +6; Ernie will pay the rent on Thursdays)",
              "if": "flag.stoolErnie",
              "then": [
                { "rep": 6, "why": "Pearl's stays open on Thursdays" },
                { "say": "pearl", "text": "Thursdays. Fine. Five till eleven. If my knees allow. And the man on eight pays for his own coffee." },
                { "set": { "stoolEnd": "mornings" } }
              ]
            }
          ]
        },
        { "set": { "stoolDone": true } },
        { "hook": "gap", "with": 9 }
      ]
    }
  },
  "beats": [
    { "at": "1-1", "cast": "pearl", "scene": "pearlFittings" },
    { "at": "1-3", "cast": "dot", "scene": "dotCounter", "if": "flag.stoolIn && !flag.stoolDone" },
    { "at": "2-1", "cast": "tamsin", "scene": "tamsinCalls", "if": "flag.stoolIn && !flag.stoolDone" }
  ],
  "nights": [
    {
      "id": "stool-dawn",
      "window": ["1-2", "2-2"],
      "if": "flag.stoolIn && !flag.stoolDone",
      "scene": "stoolDawn",
      "test": [{ "set": { "stoolIn": true } }]
    },
    {
      "id": "stool-house",
      "window": ["2-2", "3-3"],
      "if": "flag.stoolClue && !flag.stoolDone",
      "scene": "stoolHouse",
      "test": [{ "set": { "stoolClue": true } }, { "hook": "setCoin", "with": 200 }]
    },
    {
      "id": "stool-last",
      "window": ["3-3", "4-4"],
      "if": "flag.stoolIn && !flag.stoolDone",
      "scene": "stoolLast",
      "test": [
        { "set": { "stoolIn": true } },
        {
          "if": "random < 0.5",
          "then": [{ "set": { "stoolDot": true } }],
          "else": [{ "set": { "stoolDot": false } }]
        },
        {
          "if": "random < 0.5",
          "then": [{ "set": { "stoolErnie": true } }],
          "else": [{ "add": { "unique": "stoolNine" } }]
        },
        {
          "if": "random < 0.5",
          "then": [{ "set": { "selectWin": "tess" } }],
          "else": [{ "set": { "selectWin": null } }]
        }
      ]
    }
  ],
  "calendar": [
    { "id": "stool-dawn", "night": "stool-dawn", "story": "stool", "where": "Pearl's Luncheonette", "title": "Five in the morning", "known": "flag.stoolIn", "scene": "stoolDawn" },
    { "id": "stool-house", "night": "stool-house", "story": "stool", "where": "Front Street", "title": "Ernie Lavallee's kitchen", "known": "flag.stoolClue", "scene": "stoolHouse" },
    { "id": "stool-last", "night": "stool-last", "story": "stool", "where": "Pearl's Luncheonette", "title": "Pearl's last night", "known": "flag.stoolIn", "scene": "stoolLast" }
  ],
  "epilogue": [
    { "line": "Twelve stools went home to twelve kitchens. On cold mornings, people say, Main Street smells of eggs.", "if": "flag.stoolEnd == 'home'" },
    { "line": "Daybreak Coffee Co. opened on Pearl's corner. The order wheel hangs on the wall with a little plaque. Nobody reads it.", "if": "flag.stoolEnd == 'chain'" },
    { "line": "Pearl's counter spent the winter in the front room of the Clam Shack. Pearl sat at it most mornings, telling Dot how to make eggs.", "if": "flag.stoolEnd == 'dot'" },
    { "line": "Pearl's opens on Thursdays now, five till eleven. Ernie Lavallee sits on eight. Nobody sits on nine, but there's always a coffee there.", "if": "flag.stoolEnd == 'mornings'" }
  ],
  "outcome": "flag.stoolEnd"
});
