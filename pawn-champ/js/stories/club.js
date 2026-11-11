// Pawn Champ - The Christmas Club. Major quest M25, batch G (docs/quests/MAJOR.md#m25-the-christmas-club-crime-december-stay-on).
// December only (a stay-on story). For thirty-one years the Rusty Anchor's regulars have paid five
// dollars a week into a Christmas Club. The treasurer pawns the club's cashbox, empty, and vanishes.
// He didn't take the money: somebody had been shaving it for years, and he tried to win it back.
//
// Hook (W1 Tue)              Leland Coombs pawns the club's tin cashbox. Empty.
// Middle (W1 Thu, W2 Tue)    Ruthie: Leland's gone and payout is in three weeks. Merle Gagnon, the
//                            club's secretary, wants the box back, "for the records".
// Scene 1 (W1 Thu-W2 Wed)    Leland's dark house: last year's tree still up, a drawer of scratch tickets.
// Scene 2 (W2 Wed-W3 Wed)    the Harborview Motor Inn, shut for winter, one room lit.
// Finale (W3 Wed-W4 Thu)     payout night at the Rusty Anchor.
// Crossings: M16 The Rival Shop (if Bryony is still across the street, she offers to go halves).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/xmasclub.js.
defineStory({
  "id": "club",
  "kind": "major",
  "colour": "#c83a3a",
  "family": "crime",
  "title": "The Christmas Club",
  "months": [3],
  "crosses": ["rival"],
  "rumour": "The Rusty Anchor's Christmas Club pays out this month, and nobody can find the treasurer.",
  "endings": { "cover": "Merry Christmas from the Crooked Scale", "barrow": "Leland Goes to Barrow", "skimmer": "Breakfast at the Harborview", "merle": "Merle's Christmas" },
  "about": [
    "A small December mystery. Leland Coombs, treasurer of the Rusty Anchor's Christmas Club for thirty-one years, pawns the club's cashbox, empty, and asks you to keep it from anybody (§{lelandBox}). Then he vanishes. Ruthie tells you, and takes you to his cold house (§{ruthieClub}, §{clubHouse}): a drawer full of losing scratch tickets from a man who never played, and the key to room 14 at the Harborview, a motel shut for the winter.",
    "Merle Gagnon, the club's secretary, offers $120 for the box \"to save any fuss\" (§{merleCalls}); selling it ends the story with Leland blamed (Merle's Christmas). In room 14 (§{clubMotel}) Leland explains: the club has been short a dollar or two a week since 2009, written in after his totals in very neat handwriting, and he lost another $120 on tickets trying to win it back. Ask whose handwriting and he says Merle's.",
    "On payout night the club is $420 short (§{clubPayout}). Cover it yourself (halves with Bryony if she's across the street) for Merry Christmas from the Crooked Scale; hand Leland to Captain Barrow (Leland Goes to Barrow); or put the box's stubs on the bar and let the room see the handwriting change in 2009 (Breakfast at the Harborview)."
  ],
  "notes": "The club is $420 short on payout night: Merle's skimming, plus Leland's scratch tickets. With Bryony from across the street, you each pay half.",
  "cast": {
    "leland": {
      "name": "Leland Coombs",
      "look": { "skin": "#e8c0a0", "hair": "#9a9aa0", "hs": 1, "coat": "#6a5a3a", "trim": "#c8b890", "style": "puffer", "pants": "#3a3a40", "glasses": "#2a2a2e", "hat": "beanie", "hatc": "#3a5a3a" }
    },
    "merle": {
      "name": "Merle Gagnon",
      "look": { "skin": "#f0d0b8", "hair": "#c8a8a0", "hs": 3, "coat": "#8a3a4a", "trim": "#e8e0d0", "style": "jacket", "long": true, "pants": "#2a2a32", "glasses": "#8a6a3a", "bag": "#3a2a2a" }
    }
  },
  "icons": {
    "cashbox": [
      "............",
      "............",
      "..kkkkkkkk..",
      ".kddddddddk.",
      ".kdsssssSdk.",
      "kkkkkkkkkkkk",
      "kdrrrrrrrrdk",
      "kdrRrrrrRrdk",
      "kdrrrkkrrrdk",
      "kdrrrrrrrrdk",
      "kkkkkkkkkkkk",
      "............"
    ],
    "motelkey": [
      "............",
      "....kk......",
      "...kssk.....",
      "...ksk......",
      "...kssk.....",
      "...ksk......",
      "..kkkkkk....",
      ".kRRRRRRk...",
      "kRRcRRRRRk..",
      ".kRRRRRRk...",
      "..kRRRRk....",
      "...kkkk....."
    ]
  },
  "uniques": {
    "clubBox": {
      "name": "The Christmas Club cashbox",
      "icon": "cashbox",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Empty",
      "questKey": true,
      "tells": [
        "A red tin cashbox, R.A.C.C. 1993 painted on the lid. Inside, thirty-one years of passbook stubs, one for every member, every week.",
        { "text": "From 2009 the weekly totals change pen. Somebody has been writing them a dollar or two short, every week, for fifteen years, in very neat handwriting.", "cls": "good" }
      ]
    },
    "harborKey": {
      "name": "Harborview room key",
      "icon": "motelkey",
      "cat": "curio",
      "guide": 4,
      "condLabel": "Room 14",
      "questKey": true,
      "tells": [
        "A brass key on a red plastic diamond. HARBORVIEW MOTOR INN, ROOM 14. IF FOUND DROP IN ANY MAILBOX."
      ]
    }
  },
  "scenes": {
    "lelandBox": {
      "title": "Leland Coombs pawns an empty cashbox",
      "customer": "leland",
      "steps": [
        {
          "say": "leland",
          "text": [
            "Leland Coombs. I'm the treasurer of the Christmas Club down the Anchor. Thirty-one years. Five dollars a week, paid out before Christmas.",
            "This is the club's box. It's empty, before you ask. I need forty dollars, and I need it to be in a drawer that isn't mine for a while."
          ]
        },
        { "offer": { "unique": "clubBox" }, "persona": "desperate", "asking": 40, "min": 25 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "clubOut": true } },
            { "say": "leland", "text": "No. No, fair enough. I wouldn't either." },
            { "leave": "leland" },
            { "end": true }
          ]
        },
        { "set": { "clubIn": true } },
        { "say": "leland", "text": "Don't let anybody have it. Anybody. I'll be back for it before the twentieth. Probably." },
        { "leave": "leland", "hurry": true },
        { "toast": "A pawned cashbox, an empty one. Who pawns an empty cashbox?", "icon": "cashbox" }
      ]
    },
    "ruthieClub": {
      "title": "Ruthie: Leland has vanished",
      "customer": "ruthie",
      "steps": [
        {
          "say": "ruthie",
          "text": [
            "Leland Coombs hasn't been in the Anchor for four days. Leland. He's been in the Anchor every day since Reagan.",
            "Payout's in three weeks. Forty people, five dollars a week, all year. For some of them it's the whole of Christmas."
          ]
        },
        { "find": "box", "in": "stock", "match": { "uniqueId": "clubBox" } },
        {
          "choose": [
            {
              "label": "\"He pawned the club's cashbox with me.\"",
              "hint": "(she'll want to see it)",
              "if": "box",
              "then": [
                { "set": { "clubToldRuthie": true } },
                { "say": "ruthie", "text": "He pawned the box? Empty? Oh, Leland. That's not a man running off with money. That's a man who wants somebody to look in the box." }
              ]
            },
            { "label": "\"I'll ask around.\"" }
          ]
        },
        { "say": "ruthie", "text": "He lives on Front Street, the green house with last year's wreath still on it. I've got a key, God help me. Come with me after you close." },
        { "set": { "clubAsked": true } },
        { "toast": "Calendar: Leland's house, after closing", "look": "ruthie" },
        { "leave": "ruthie" }
      ]
    },
    "merleCalls": {
      "title": "Merle Gagnon wants the box back",
      "customer": "merle",
      "steps": [
        {
          "say": "merle",
          "text": [
            "Merle Gagnon. I keep the minutes for the Christmas Club, and the bank book, and I have for twenty years. Leland's gone a little funny, I'm afraid.",
            "I understand he left the club's cashbox with you. That's club property, with all our records in it. I'll give you a hundred and twenty for it, to save any fuss."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell her the box",
              "hint": "(+$120; the story ends here)",
              "then": [
                { "find": "box", "in": "stock", "match": { "uniqueId": "clubBox" } },
                { "take": "box" },
                { "coin": 120, "why": "Sold the Christmas Club cashbox to Merle Gagnon" },
                { "refresh": "panel" },
                { "set": { "clubEnd": "merle", "clubDone": true } },
                { "say": "merle", "text": "Thank you. You've been a great help to the club. I'll mention you in the minutes." },
                { "leave": "merle" },
                { "end": true }
              ]
            },
            { "label": "\"Leland asked me to hold it.\"" }
          ]
        },
        { "set": { "clubMerle": true } },
        { "say": "merle", "text": "Of course. Leland asks a lot of people a lot of things." },
        { "leave": "merle" }
      ]
    },
    "clubHouse": {
      "title": "Leland's house",
      "steps": [
        {
          "stage": "kitchenNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "ruthie", "cast": "ruthie", "at": [160, 164] }
          ]
        },
        { "narrate": "Leland's kitchen, by the light over the table. The heat is off. In the front room, last year's tree is still up, brown, standing in a ring of its own needles." },
        { "say": "ruthie", "text": "Leland? It's Ruthie. If you're in here dead I'm going to be furious." },
        { "narrate": "He isn't. The table drawer is full of scratch tickets. Hundreds. Lucky 7s, Winter Wonderland, Cash Blast. Every one scratched, and every one a loser. The oldest is from the first of November." },
        { "say": "ruthie", "text": "He doesn't play. Thirty years I've never seen him buy a ticket. He says it's a tax on hope." },
        { "narrate": "On the fridge, under a magnet from the Harborview Motor Inn, a calendar. December has one thing on it: \"14\", circled twice. And behind the magnet, a key on a red plastic diamond." },
        { "if": "shelf.free", "then": [{ "add": { "unique": "harborKey" } }, { "refresh": "panel" }] },
        {
          "say": "ruthie",
          "text": [
            "The Harborview's shut for the winter. Has been since Columbus Day. Who goes to a motel that's shut?",
            "Somebody who doesn't want to be found, and doesn't want to go far. Go and see him. He'll talk to you. He won't talk to me."
          ]
        },
        { "set": { "clubKey": true } },
        { "toast": "Calendar: the Harborview Motor Inn, room 14", "look": "ruthie" }
      ]
    },
    "clubMotel": {
      "title": "Room 14 at the Harborview",
      "steps": [
        { "hook": "room", "with": 14, "note": "Room 14 is the one lit at the Harborview." },
        {
          "stage": "motorinn",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] }]
        },
        { "narrate": "The Harborview Motor Inn, shut for the season. Half the sign is dead. The pool is full of snow. Upstairs, behind one curtain out of sixteen, a light is on." },
        { "enter": { "id": "leland", "cast": "leland", "at": [250, 160], "facingLeft": true } },
        {
          "say": "leland",
          "text": [
            "Ruthie sent you. Course she did. I paid the owner's boy fifty dollars for the room. There's no heat. It's still warmer than my house.",
            "I didn't take the money. I do the tally every November, the bank book against the stubs. This year I did it properly, back to the beginning. It's been short since 2009.",
            "A dollar here, two there. Every week. Somebody writing the totals in after me. In very neat handwriting.",
            "Three hundred dollars, near enough. I thought, I'll win it back before anyone has to know. That's what the tickets were. Now it's four hundred and twenty."
          ]
        },
        {
          "choose": [
            {
              "label": "\"Come back and tell the club what you found.\"",
              "hint": "(he'll be at payout night)",
              "then": [
                { "set": { "clubFound": true, "clubLelandBack": true } },
                { "say": "leland", "text": "In front of forty people. Who'll all think I'm a thief. Well. They'll think it anyway. All right. I'll come." }
              ]
            },
            {
              "label": "\"Whose handwriting?\"",
              "then": [
                { "set": { "clubFound": true, "clubKnowsMerle": true } },
                {
                  "say": "leland",
                  "text": [
                    "Merle's. Merle Gagnon. The secretary. She keeps the bank book. She does the flowers for the church. I've known her since kindergarten.",
                    "Nobody will believe it from me. Not now. Not with a drawer full of tickets."
                  ]
                },
                { "find": "box", "in": "stock", "match": { "uniqueId": "clubBox" } },
                { "narrate": "The stubs are in the box on your shelf. Fifteen years of neat handwriting.", "if": "box" }
              ]
            },
            {
              "label": "\"Stay here. I'll sort it out.\"",
              "then": [
                { "set": { "clubFound": true } },
                { "say": "leland", "text": "That's kind. I'll stay. I've got a kettle and a radio and nobody looking at me." }
              ]
            }
          ]
        }
      ]
    },
    "clubPayout": {
      "title": "Christmas Club payout night",
      "steps": [
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 166] },
            { "id": "ruthie", "cast": "ruthie", "at": [150, 164] },
            { "id": "merle", "cast": "merle", "at": [260, 160], "facingLeft": true }
          ]
        },
        { "narrate": "Payout night at the Rusty Anchor. Tinsel on the bell, forty regulars, and a row of white envelopes on the bar with names on them. The bank sent what was in the account. It isn't enough." },
        { "say": "ruthie", "text": "We're $420 short. Forty envelopes, and I can fill thirty-six of them." },
        { "say": "merle", "text": "I did say Leland had gone funny. I'm very sorry, everyone. I did try to keep an eye on things." },
        {
          "if": "flag.clubLelandBack",
          "then": [
            { "enter": { "id": "leland", "cast": "leland", "at": [210, 162], "facingLeft": true } },
            { "say": "leland", "text": "I'm here. I lost a hundred and twenty dollars of it on scratch tickets. The rest went before me. A dollar or two a week, since 2009." }
          ]
        },
        { "narrate": "Bryony Kettle from across the street catches your eye from the end of the bar, and holds up her checkbook. Halves?", "if": "hook.bryonyHere" },
        { "find": "box", "in": "stock", "match": { "uniqueId": "clubBox" } },
        {
          "choose": [
            {
              "label": { "if": "hook.bryonyHere", "then": "Go halves with Bryony on the shortfall", "else": "Cover the shortfall from your till" },
              "hint": { "if": "hook.bryonyHere", "then": "(-$210, rep +12)", "else": "(-$420, rep +12)" },
              "disabled": "(hook.bryonyHere && coin < 210) || (!hook.bryonyHere && coin < 420)",
              "then": [
                { "coin": -210, "why": "Covered the Christmas Club payout", "if": "hook.bryonyHere" },
                { "coin": -420, "why": "Covered the Christmas Club payout", "if": "!hook.bryonyHere" },
                { "rep": 12, "why": "Covered the Christmas Club payout" },
                { "say": "ruthie", "text": "You don't have to do that. Oh, you've done it. Right. Everyone! Drinks are on nobody, but the envelopes are full." },
                { "set": { "clubEnd": "cover" } }
              ]
            },
            {
              "label": { "if": "flag.clubFound", "then": "Tell Captain Barrow where Leland has been staying", "else": "Give Captain Barrow Leland's name" },
              "hint": "(heat -6)",
              "then": [
                { "heat": -6, "why": "Gave Leland Coombs to Captain Barrow" },
                { "narrate": "Captain Barrow is very polite about it, and takes Leland home by way of the station. The envelopes go out thirty-six full and four with IOUs in them." },
                { "say": "merle", "text": "A terrible business. I'll write it up in the minutes." },
                { "set": { "clubEnd": "barrow" } }
              ]
            },
            {
              "label": "Put the stubs on the bar, and ask Merle to read out the totals",
              "hint": "(rep +8)",
              "if": "box && (flag.clubFound || box.inspected)",
              "then": [
                { "take": "box" },
                { "rep": 8, "why": "Showed the Christmas Club the stubs" },
                { "narrate": "You put the box on the bar. Ruthie lays the stubs out in rows, year by year. From 2009 the handwriting changes. Everybody in the room has had a sympathy card in that handwriting." },
                { "say": "merle", "text": "It was a dollar. A dollar a week. Nobody ever noticed a dollar." },
                { "say": "ruthie", "text": "Leland noticed. Merle, you'll pay it back by New Year's, and you'll do it in envelopes, with everyone watching." },
                {
                  "if": "leland",
                  "then": [
                    { "say": "leland", "text": "And the hundred and twenty I lost, I'll work off. The Harborview wants someone to do breakfasts when it opens in May. I make a decent egg." }
                  ],
                  "else": [
                    { "narrate": "Leland comes down from the Harborview the next morning, and offers to work off the hundred and twenty he lost making breakfasts at the motel when it opens in May." }
                  ]
                },
                { "set": { "clubEnd": "skimmer" } }
              ]
            }
          ]
        },
        { "refresh": "panel" },
        { "set": { "clubDone": true } }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "leland", "scene": "lelandBox" },
    { "at": "1-4", "cast": "ruthie", "scene": "ruthieClub", "if": "flag.clubIn && !flag.clubDone" },
    { "at": "2-2", "cast": "merle", "scene": "merleCalls", "if": "flag.clubIn && !flag.clubDone && hook.boxHere" }
  ],
  "nights": [
    {
      "id": "club-house",
      "window": ["1-4", "2-3"],
      "if": "flag.clubAsked && !flag.clubDone",
      "scene": "clubHouse",
      "test": [{ "set": { "clubAsked": true } }]
    },
    {
      "id": "club-motel",
      "window": ["2-3", "3-3"],
      "if": "flag.clubKey && !flag.clubDone",
      "scene": "clubMotel",
      "test": [{ "set": { "clubKey": true } }, { "add": { "unique": "clubBox" } }]
    },
    {
      "id": "club-payout",
      "window": ["3-3", "4-4"],
      "if": "flag.clubAsked && !flag.clubDone",
      "scene": "clubPayout",
      "test": [
        { "set": { "clubAsked": true, "clubFound": true } },
        { "roll": { "clubLelandBack": [true, false] } },
        {
          "roll": { "rivalEnd": ["overflow", null] },
          "note": "Half the time Bryony is still across the street (The Rival Shop)."
        },
        { "hook": "testCoin", "with": 500 },
        { "add": { "unique": "clubBox" } }
      ]
    }
  ],
  "calendar": [
    { "id": "club-house", "night": "club-house", "story": "club", "where": "Front Street", "title": "Leland's house", "known": "flag.clubAsked", "scene": "clubHouse" },
    { "id": "club-motel", "night": "club-motel", "story": "club", "where": "The Harborview Motor Inn", "title": "Room 14", "known": "flag.clubKey", "scene": "clubMotel" },
    { "id": "club-payout", "night": "club-payout", "story": "club", "where": "The Rusty Anchor", "title": "Christmas Club payout", "known": "flag.clubAsked", "scene": "clubPayout" }
  ],
  "epilogue": [
    { "line": "Forty envelopes went out full. Next year's Christmas Club has a new treasurer, a new box, and a card on the Anchor's wall that says \"with thanks to The Crooked Scale\".", "if": "flag.clubEnd == 'cover'" },
    { "line": "Leland Coombs paid back his hundred and twenty dollars and a fine. He doesn't drink at the Anchor any more. Merle Gagnon is the new treasurer.", "if": "flag.clubEnd == 'barrow'" },
    { "line": "Merle Gagnon paid back fifteen years of dollars in envelopes, one a day, at the Anchor bar. In May, Leland Coombs starts doing breakfasts at the Harborview.", "if": "flag.clubEnd == 'skimmer'" },
    { "line": "The Christmas Club came up short, and Leland Coombs took the blame. Merle Gagnon's minutes say so, in very neat handwriting.", "if": "flag.clubEnd == 'merle'" }
  ],
  "talk": {
    "by": "ruthie",
    "rumour": [
      "Leland Coombs has kept the Christmas Club box behind my bar for thirty-one years. Five dollars a week, forty people. It pays out before Christmas.",
      "He hasn't been in for three days. Leland. He's been in every day since Reagan."
    ],
    "react": { "cover": "You filled four envelopes from your own till. Don't argue with me, I counted. There's a card on my wall with your name on it now.", "barrow": "Leland's paid his fine. He drinks at home now. I miss him on his stool, and I don't blame you, and I do a bit.", "skimmer": "Merle Gagnon pays a dollar back into the Christmas Club every day, at my bar, in front of everyone. Fifteen years of dollars. I've never sold so much hot chocolate.", "merle": "The Christmas Club came up short and Leland got the blame. Merle wrote the minutes. I don't like how neat they are." },
    "sway": {
      "cover": { "ruthie": 3 },
      "barrow": { "ruthie": -1 },
      "skimmer": { "ruthie": 2 },
      "merle": { "ruthie": -2 }
    }
  },
  "outcome": "flag.clubEnd"
});
