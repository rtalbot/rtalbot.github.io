// Pawn Champ - The Selectmen's Race: one open seat on the Select Board, two candidates, and
// everyone wants a sign in your window. Major quest M11, batch D (docs/quests/MAJOR.md#m11-the-selectmens-race).
// months: [1, 2]: Gordie's clambake is at the Harvest Fair, which ends in early November (docs/SEASONS.md).
//
// This story also owns the Town Meeting hub ("meeting"). Other quests add warrant articles to it as
// vignettes: M5's Article 9, M1's three minutes, the batch D minors. Marguerite's warrant in the
// window, the Town Meeting calendar entry and Articles 4 and 11 are the town's ("town": true): they
// come with any run that has a Town Meeting. Gordie's fee is in js/quests/selectmen.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/selectmen.js.
defineStory({
  "id": "selectmen",
  "kind": "major",
  "colour": "#4a8ab0",
  "family": "town",
  "title": "The Selectmen's Race",
  "months": [1, 2],
  "crosses": ["hollis", "fog", "benefit", "spoons"],
  "rumour": "The harbormaster and the car dealer both want a sign in your window.",
  "endings": { "bascombe": "Selectman Bascombe", "haines": "Selectman Haines", "kingmaker": "Kingmaker" },
  "outcome": [
    { "if": "flag.selectKing", "ending": "kingmaker" },
    { "if": "flag.selectWin == 'tess'", "ending": "bascombe" },
    { "if": "flag.selectWin == 'gordie'", "ending": "haines" }
  ],
  "about": [
    "A small-town election, and the start of the long arc about Pier Nine. Gordie Haines, the car dealer, wants a marina where the fishing pier is (§{gordieSign}); Tess Bascombe, the harbormaster, wants the eleven working boats to stay (§{tessSign}). Each asks for a sign in your window. Gordie's brings a day-tripper shopper most days (§{signShopper}); Tess's brings a co-op fisherman selling what came up in the nets (§{signSeller}).",
    "At Gordie's clambake, at Dot's Clam Shack or at the Harvest Fair (§{clambakeNight}, §{clambake}), he's short for the caterer and asks you to hold his class ring. Lend on it or not, you now know. Marguerite puts the Town Meeting warrant in your window and offers a box of old campaign buttons (§{margueriteWarrant}).",
    "At the candidates' debate (§{selectDebate}) you can ask a question from the floor. The strongest is asking Gordie where his ring is; other stories open up questions about Gilded Hand barges at Pier Nine, Saint Brine's, or the Harbor Green deed. At Town Meeting (§{meetingOpen}) you can say a word for either, and the votes are counted. Your sign, your question and your speech all count.",
    "Endings: Selectman Bascombe or Selectman Haines, or Kingmaker if your question at the debate was what swung it. Either way it leads on to The First Winter in Office. Town Meeting also has two small articles to sit through (§{article4}, §{article11})."
  ],
  "cast": {
    "deckhand": {
      "name": "A fisherman from the co-op",
      "look": { "skin": "#d8a070", "hair": "#5a3a2a", "hs": 0, "coat": "#e86a2a", "style": "puffer", "hat": "beanie", "hatc": "#3a4a5a", "beard": "#5a3a2a", "pants": "#3a3a42" }
    },
    "boardwalker": {
      "name": "A day-tripper",
      "look": { "skin": "#f0d0b8", "hair": "#e8c890", "hs": 4, "coat": "#7ac8d8", "style": "tee", "logo": "#f4f4ee", "pants": "#e8e0d0", "glasses": "#1a1a1e" }
    }
  },
  "uniques": {
    "classRing": {
      "name": "Gordie's class ring",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 70,
      "tells": [
        "Hollow Neck High, Class of 1984. Ten karat, a red stone, a tiny car on one shoulder.",
        "Engraved inside: \"G.H. - Most Likely to Sell You Something\"."
      ]
    },
    "campaignButtons": {
      "name": "A box of old campaign buttons",
      "icon": "crate",
      "cat": "curio",
      "guide": 45,
      "tells": [
        "Sixty years of Select Board races. \"Vey for a Better Neck.\" \"Haines Means Business.\" \"Nobody 1972\"."
      ]
    }
  },
  "scenes": {
    "gordieSign": {
      "title": "Gordie Haines wants a sign in your window",
      "customer": "gordie",
      "steps": [
        {
          "say": "gordie",
          "text": [
            "Gordie Haines! Haines Motors, Route 1! \"Come on down to Haines, we'll take the pain out of your gains!\" I wrote that. I'm running for selectman.",
            "Pier Nine's half empty. I see a marina. Yachts, a boardwalk, parking. Money walking up Front Street right past your door. Can I put a sign in your window?",
            "And come to my clambake! Free chowder, live music, my treat. Everyone's invited."
          ]
        },
        { "set": { "clambakeKnown": true } },
        {
          "choose": [
            {
              "label": "Put Gordie's sign in the window",
              "hint": "(+1 shopper a day: boardwalk money)",
              "then": [
                { "set": { "signFor": "gordie" } },
                { "hook": "stamp", "with": "signDay" },
                { "say": "gordie", "text": "You won't regret it! Haines keeps his promises. Most of them. The big ones." }
              ]
            },
            {
              "label": "\"Let me think about it.\"",
              "then": [
                { "say": "gordie", "text": "Think fast! Election's at Town Meeting. Ha! Get it? Think fast." }
              ]
            },
            {
              "label": "\"No signs in my window, Gordie.\"",
              "then": [
                { "set": { "signRefused": true } },
                { "say": "gordie", "text": "Neutral! I respect it. I don't like it, but I respect it." }
              ]
            }
          ]
        },
        { "toast": "Calendar: Gordie's clambake at Dot's Clam Shack", "look": "gordie", "if": "!hook.fair" },
        { "leave": "gordie" }
      ]
    },
    "tessSign": {
      "title": "Tess Bascombe has a sign in the truck",
      "customer": "tess",
      "steps": [
        {
          "say": "tess",
          "text": [
            "Tess Bascombe. Harbormaster. I'm running against Gordie Haines, God help me.",
            "He wants a marina where Pier Nine is. There are eleven boats still fishing out of this harbor. A marina would make it none."
          ]
        },
        {
          "if": "flag.signFor == 'gordie'",
          "then": [
            { "say": "tess", "text": "I see you've got his sign up already. Fair enough. But if you change your mind, I've got one in the truck." },
            {
              "choose": [
                {
                  "label": "Swap Gordie's sign for Tess's",
                  "hint": "(+1 seller a day: the fishing families)",
                  "then": [
                    { "set": { "signFor": "tess" } },
                    { "hook": "stamp", "with": "signDay" },
                    { "set": { "signChanged": true } },
                    { "say": "tess", "text": "Good. Gordie'll live. He always does." }
                  ]
                },
                {
                  "label": "\"I'll leave it, Tess.\"",
                  "then": [{ "say": "tess", "text": "Your window. See you at Town Meeting." }]
                }
              ]
            }
          ],
          "else": [
            {
              "choose": [
                {
                  "label": "Put Tess's sign in the window",
                  "hint": "(+1 seller a day: the fishing families)",
                  "then": [
                    { "set": { "signFor": "tess" } },
                    { "hook": "stamp", "with": "signDay" },
                    { "say": "tess", "text": "Appreciated. The co-op boys will come by. They sell what they haul up in the nets, and you'd be amazed." }
                  ]
                },
                {
                  "label": "\"No signs in my window.\"",
                  "then": [{ "say": "tess", "text": "Neutral. Smart. See you at Town Meeting." }]
                }
              ]
            }
          ]
        },
        { "leave": "tess" }
      ]
    },
    "signSeller": {
      "title": "A fisherman from the co-op, sent by Tess's sign",
      "customer": "deckhand",
      "steps": [
        {
          "hook": "pickSeller",
          "sets": ["seller"],
          "note": "an ordinary seller, mostly with something marine"
        },
        { "say": "deckhand", "text": "Tess said you're fair. Hauled this up in the trawl net last week." },
        { "hook": "sell" }
      ]
    },
    "signShopper": {
      "title": "A day-tripper, sent by Gordie's sign",
      "customer": "boardwalker",
      "steps": [{ "hook": "buy", "note": "an ordinary shopper who pays well and haggles hard" }]
    },
    "clambake": {
      "title": "Gordie's clambake at the Harvest Fair",
      "steps": [
        { "enter": { "id": "you", "cast": "keeper", "name": "You", "at": [96, 164] } },
        { "enter": { "id": "gordie", "cast": "gordie", "at": [150, 160], "facingLeft": true } },
        { "enter": { "id": "tess", "cast": "tess", "at": [250, 156], "facingLeft": true } },
        { "narrate": "Behind the bandstand, Gordie Haines has a clambake going: a pit of hot rocks, seaweed, a banner that says HAINES MEANS BUSINESS, and half the fair eating for free." },
        { "narrate": "Tess Bascombe is judging the chowder contest, on the grounds that nobody else would. She tastes all nine and gives every one of them a seven." },
        { "say": "tess", "text": "They're all fine. It's chowder. Next." },
        { "walk": "gordie", "to": [120, 162] },
        {
          "say": "gordie",
          "text": [
            "Hey. Hey, pal. Little favour. The caterer wants cash and my card is... resting. You run a pawnshop, right?",
            "Class ring. Hollow Neck High, 1984. Hold it for me till next week? Nobody needs to know. Especially not the Gazette."
          ]
        },
        {
          "choose": [
            {
              "label": "Lend him $60 against the ring",
              "hint": "(he repays $78 in five days)",
              "disabled": "coin < 60 || !shelf.free",
              "then": [
                { "hook": "ringLoan" },
                { "set": { "gordieRing": true, "ringKnown": true } },
                { "say": "gordie", "text": "You're a lifesaver. A LIFE saver. Not a word, okay? Not a word." }
              ]
            },
            {
              "label": "\"Not my business, Gordie.\"",
              "then": [
                { "set": { "ringKnown": true } },
                { "say": "gordie", "text": "Sure. Sure. No problem. I'll... figure something out." },
                { "narrate": "Ten minutes later you see him slip the ring to the caterer behind the lobster pots. Interesting." }
              ]
            }
          ]
        },
        { "set": { "clambakeDone": true } }
      ]
    },
    "clambakeNight": {
      "title": "Gordie's clambake at Dot's Clam Shack (when there's no Harvest Fair)",
      "steps": [
        { "hook": "evening", "note": "night music" },
        { "hook": "noArch" },
        {
          "stage": "clamshackDusk",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 164] },
            { "id": "gordie", "cast": "gordie", "at": [150, 160], "facingLeft": true },
            { "id": "tess", "cast": "tess", "at": [250, 156], "facingLeft": true }
          ]
        },
        { "narrate": "Dot's Clam Shack, dusk. Gordie Haines has rented the whole deck: string lights, a pit of hot rocks under wet seaweed, a banner that says HAINES MEANS BUSINESS, and half of Hollow Neck eating for free." },
        { "narrate": "Tess Bascombe is judging the chowder contest, on the grounds that nobody else would. She tastes all nine and gives every one of them a seven." },
        { "say": "tess", "text": "They're all fine. It's chowder. Next." },
        { "walk": "gordie", "to": [120, 162] },
        {
          "say": "gordie",
          "text": [
            "Hey. Hey, pal. Little favour. The caterer wants cash and my card is... resting. You run a pawnshop, right?",
            "Class ring. Hollow Neck High, 1984. Hold it for me till next week? Nobody needs to know. Especially not the Gazette."
          ]
        },
        {
          "choose": [
            {
              "label": "Lend him $60 against the ring",
              "hint": "(he repays $78 in five days)",
              "disabled": "coin < 60 || !shelf.free",
              "then": [
                { "hook": "ringLoan" },
                { "set": { "gordieRing": true, "ringKnown": true } },
                { "say": "gordie", "text": "You're a lifesaver. A LIFE saver. Not a word, okay? Not a word." }
              ]
            },
            {
              "label": "\"Not my business, Gordie.\"",
              "then": [
                { "set": { "ringKnown": true } },
                { "say": "gordie", "text": "Sure. Sure. No problem. I'll... figure something out." },
                { "narrate": "Ten minutes later you see him slip the ring to the caterer behind the lobster pots. Interesting." }
              ]
            }
          ]
        },
        { "set": { "clambakeDone": true } }
      ],
      "note": "Only plays if there's no Harvest Fair to hold the clambake (there always is now). The middle is the same as the fair's: change both."
    },
    "selectDebate": {
      "title": "The candidates' debate at the Grange Hall",
      "steps": [
        { "hook": "evening", "note": "night music" },
        {
          "stage": "grange",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "marguerite", "cast": "marguerite", "at": [226, 150], "facingLeft": true },
            { "id": "tess", "cast": "tess", "at": [270, 152], "facingLeft": true },
            { "id": "gordie", "cast": "gordie", "at": [196, 152] },
            {
              "id": "voter",
              "look": "random",
              "name": "A voter",
              "at": [[40, 160], [62, 164], [84, 160], [106, 164]]
            }
          ]
        },
        { "narrate": "The candidates' debate, the Grange Hall. Folding chairs, a coffee urn, and about a hundred people who have known both candidates since kindergarten." },
        { "say": "marguerite", "text": "I am Marguerite Oyelaran, your moderator, as I have been for twenty-two years. Each candidate has two minutes. Two. I have a stopwatch and no sense of humour about it." },
        { "say": "gordie", "text": "Folks! A marina at Pier Nine means jobs, it means parking, it means visitors spending money on Front Street! Haines means business!" },
        { "say": "tess", "text": "Pier Nine is eleven working boats and the Coast Guard station. A marina means none of them. That's it. That's my two minutes." },
        { "say": "marguerite", "text": "One minute and forty seconds. Thank you, Tess. We will take questions from the floor." },
        {
          "choose": [
            {
              "label": "Ask Gordie why his class ring is in hock",
              "if": "flag.ringKnown",
              "then": [
                { "set": { "debateSwing": 3 } },
                { "say": "you", "text": "Gordie, where's your class ring tonight?" },
                { "say": "gordie", "text": "My... it's at the jeweller's. Being cleaned. Very dirty ring. Next question." },
                { "narrate": "Somebody at the back who catered a clambake laughs, loudly, and the whole room turns round to look." },
                { "narrate": "There's a murmur through the folding chairs. That one landed." }
              ]
            },
            {
              "label": "Ask who lets Gilded Hand barges load at Pier Nine at midnight",
              "if": "quest.hollis && (flag.hollisStakeout || flag.hollisSheet)",
              "then": [
                { "set": { "debateSwing": 2 } },
                { "say": "tess", "text": "Not me. My logbook says nothing's tied up at Pier Nine after ten. If something is, somebody's lying to the harbormaster, and I'll have it with the Coast Guard by Monday." },
                { "say": "gordie", "text": "I... think marinas are very well lit. Good lighting. Very safe." },
                { "narrate": "There's a murmur through the folding chairs. That one landed." }
              ]
            },
            {
              "label": "Ask where they stand on rezoning Saint Brine's",
              "if": "flag.benefitArticle9",
              "then": [
                { "set": { "debateSwing": 2 } },
                { "say": "gordie", "text": "Condos are progress! Tasteful condos. With a view. The kids would get... a very good view of them." },
                { "say": "tess", "text": "It's a children's home. I'm voting no on Article 9 and I'd like everyone here to do the same." },
                { "narrate": "There's a murmur through the folding chairs. That one landed." }
              ]
            },
            {
              "label": "Ask about the 1904 Harbor Green deed",
              "if": "flag.greenDeed",
              "then": [
                {
                  "if": "flag.greenDeed == 'town'",
                  "then": [
                    { "set": { "debateSwing": 2 } },
                    { "say": "tess", "text": "\"For the use of the people forever.\" You can't park yachts on forever, Gordie." },
                    { "say": "gordie", "text": "Forever is a long time. Things change. Deeds change." }
                  ],
                  "else": [
                    { "set": { "debateSwing": -2 } },
                    { "say": "gordie", "text": "I own the Green now, fair and square, and I'm going to put parking on it. Free parking! For everyone!" },
                    { "narrate": "The room, against its better judgement, likes the sound of free parking." }
                  ]
                },
                { "narrate": "There's a murmur through the folding chairs. That one landed." }
              ]
            },
            {
              "label": "Ask what happens to the fishing fleet",
              "then": [
                { "set": { "debateSwing": 1 } },
                { "say": "tess", "text": "It stays, if I have anything to do with it. Eleven boats is eleven families." },
                { "say": "gordie", "text": "The fleet is very picturesque! Tourists love it. We'll keep one. For pictures." },
                { "narrate": "A few people nod. A few more check their phones." }
              ]
            },
            {
              "label": "Ask how they'll bring shoppers back to Front Street",
              "then": [
                { "set": { "debateSwing": -1 } },
                { "say": "gordie", "text": "Parking! Parking, parking, parking. You can't shop where you can't park." },
                { "say": "tess", "text": "I'll be honest. I hadn't thought about it much." },
                { "narrate": "A few people nod. A few more check their phones." }
              ]
            },
            { "label": "Stay in your seat", "then": [{ "set": { "debateSwing": 0 } }] }
          ],
          "note": "the questions you can ask come from what you've learned elsewhere; each swings the vote (debateSwing) toward Tess (more) or Gordie (less)"
        },
        { "say": "marguerite", "text": "Thank you. The vote is at Town Meeting. Bring a pen. Bring two. Nobody ever brings a pen." },
        { "set": { "debateDone": true } }
      ]
    },
    "meetingOpen": {
      "title": "Town Meeting comes to order (and the Select Board vote)",
      "steps": [
        { "hook": "evening", "note": "night music" },
        {
          "stage": "townhall",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [150, 168] },
            { "id": "marguerite", "cast": "marguerite", "at": [226, 148], "facingLeft": true },
            {
              "id": "voter",
              "look": "random",
              "name": "A voter",
              "at": [[30, 160], [50, 165], [70, 160], [90, 165], [110, 160]]
            }
          ]
        },
        { "narrate": "Town Meeting, Town Hall. Four hundred folding chairs, a coffee urn the size of a lobster pot, and the whole of Hollow Neck in its second-best coat." },
        { "say": "marguerite", "text": "This meeting will come to order. It is seven o'clock. I intend for us to be home by eleven. I have intended this for twenty-two years." },
        {
          "if": "quest.selectmen && !flag.selectWin",
          "note": "Article 1: the Select Board vote",
          "then": [
            { "enter": { "id": "tess", "cast": "tess", "at": [250, 154], "facingLeft": true } },
            { "enter": { "id": "gordie", "cast": "gordie", "at": [210, 154] } },
            { "say": "marguerite", "text": "Article 1. To elect one member of the Select Board for a term of three years. The candidates are Theresa Bascombe and Gordon Haines. Does anyone wish to speak before the ballot?" },
            {
              "choose": [
                {
                  "label": "Stand up and say a word for Tess",
                  "then": [
                    { "set": { "meetingSpeech": 1 } },
                    { "say": "keeper", "text": "Tess keeps the harbor working. The harbor keeps this town. That's all." }
                  ]
                },
                {
                  "label": "Stand up and say a word for Gordie",
                  "then": [
                    { "set": { "meetingSpeech": -1 } },
                    { "say": "keeper", "text": "Front Street needs people walking down it. Gordie will bring them." }
                  ]
                },
                { "label": "Keep your seat" }
              ]
            },
            {
              "if": "flag.meetingSpeech",
              "note": "the moderator's view of you (docs/quests/STANDING.md, the vote moment)",
              "then": [
                { "hook": "chair", "sets": ["chair"] },
                {
                  "if": "chair == 'friend'",
                  "then": [
                    { "hook": "louder" },
                    { "say": "marguerite", "text": "The chair thanks the speaker, and would like that minuted in full. Take your time. The meeting has all night." }
                  ]
                },
                {
                  "if": "chair == 'foe'",
                  "then": [
                    { "set": { "meetingSpeech": 0 } },
                    { "say": "marguerite", "text": "Time. That is the bell. Sit down, please. The chair has heard quite enough from that side of the room this year." }
                  ]
                }
              ]
            },
            { "narrate": "The fishing families sit together on the left. Word got round about who helped their drowned home in the Fog, and more than one of them nods at you.", "if": "quest.fog && (flag.mottHappy || flag.ghostFair || flag.ghostFriend)" },
            { "say": "tess", "text": "Before the ballot: the keeper of the Crooked Scale stood on my landing in the Fog with a pen and a clipboard, till two in the morning, for nothing. That's the kind of town I mean.", "if": "flag.fogTess" },
            { "narrate": "Paper ballots. A wooden box with a slot. Two tellers who have hated each other since 1991 count them twice." },
            { "hook": "count", "sets": ["bascombe", "haines"] },
            {
              "say": "marguerite",
              "text": { "if": "flag.selectWin == 'tess'", "then": "The count. Bascombe, {bascombe}. Haines, {haines}. Theresa Bascombe is elected.", "else": "The count. Bascombe, {bascombe}. Haines, {haines}. Gordon Haines is elected." }
            },
            {
              "if": "flag.selectWin == 'tess'",
              "then": [
                { "say": "tess", "text": "Right. Thank you. I'll be at the harbormaster's shack at six tomorrow if anyone needs me. Same as always." },
                { "say": "gordie", "text": "Congratulations, Tess! No hard feelings! Haines Motors, Route 1, open Sunday!" },
                { "narrate": "Pier Nine stays a working pier. The Coast Guard station keeps its funding. Your rent stays exactly what it was, which is too much." },
                { "rep": 3, "if": "flag.signFor == 'tess'" }
              ],
              "else": [
                { "say": "gordie", "text": "Thank you, Hollow Neck! Marina! Parking! A brand new \"commercial improvement fee\" for Front Street businesses! Small! Tiny! You'll barely notice!" },
                { "say": "tess", "text": "You'll notice." },
                { "narrate": "The marina plan goes to committee. Boardwalk parking opens next week. And every shop on Front Street gets a letter about a ten-dollar fee." },
                { "rep": 2, "if": "flag.signFor == 'gordie'" }
              ]
            },
            { "narrate": "Afterwards, three different people tell you it was your question at the debate that did it. One of them is Gordie, and he means it as a compliment.", "if": "flag.selectKing" },
            { "remove": "tess" },
            { "remove": "gordie" }
          ]
        },
        { "say": "marguerite", "text": "The warrant articles. Who wishes to be heard?" }
      ]
    },
    "meetingClose": {
      "title": "Town Meeting ends",
      "steps": [
        { "narrate": "At eleven fifty-two Marguerite Oyelaran bangs the gavel on the last article. Everyone stacks their own chair. That is also tradition." }
      ]
    },
    "margueriteWarrant": {
      "title": "Marguerite posts the Town Meeting warrant",
      "customer": "marguerite",
      "steps": [
        { "say": "marguerite", "text": "Marguerite Oyelaran, town moderator. May I put the Town Meeting warrant in your window? Every shop on Front Street has one. It is the law. Well. It is tradition, which is stronger." },
        { "set": { "meetingKnown": true } },
        {
          "if": "quest.selectmen",
          "then": [
            { "set": { "debateKnown": true } },
            { "say": "marguerite", "text": "The Select Board seat is on it. Tess Bascombe and Gordie Haines. There is a candidates' debate first, at the Grange Hall, and then the vote at Town Meeting." },
            { "toast": "Calendar: the debate, then Town Meeting", "look": "marguerite" }
          ],
          "else": [{ "toast": "Calendar: Town Meeting", "look": "marguerite" }]
        },
        { "say": "marguerite", "text": "One more thing. I cleaned out the closet under the Town Hall stairs. Sixty years of campaign buttons. The coffee fund could use thirty dollars for them, if you're a buyer." },
        {
          "choose": [
            {
              "label": "Buy the box of buttons for $30",
              "disabled": "coin < 30 || !shelf.free",
              "then": [
                { "hook": "buyButtons" },
                { "say": "marguerite", "text": "Excellent. The coffee fund thanks you. The coffee does not; it is past thanking." }
              ]
            },
            {
              "label": "\"Not today, but I'll take the warrant.\"",
              "then": [{ "say": "marguerite", "text": "Understood. Seven o'clock sharp. Not seven-oh-five." }]
            }
          ]
        },
        { "leave": "marguerite" }
      ]
    },
    "article4": {
      "title": "Article 4: beach parking stickers",
      "steps": [
        {
          "narrate": [
            "Article 4: to see if the Town will raise the price of a beach parking sticker by five dollars. Forty minutes of debate. A man from Water Street describes, in detail, every parking space he has ever been denied.",
            "It passes by three votes. Nobody is happy. Marguerite Oyelaran looks at the clock."
          ]
        }
      ]
    },
    "article11": {
      "title": "Article 11: a new snowplow",
      "steps": [
        {
          "narrate": [
            "Article 11: to see if the Town will buy a new snowplow. The Highway Department shows a photograph of the old one. Someone gasps.",
            "It passes unanimously, the only unanimous vote of the night, and the room applauds the photograph."
          ]
        },
        { "rep": 1 }
      ]
    }
  },
  "beats": [
    { "drift": "select-hook", "from": "1-2", "to": "1-4", "cast": "gordie", "scene": "gordieSign" },
    { "drift": "select-hook", "from": "1-2", "to": "1-4", "offset": 1, "cast": "tess", "scene": "tessSign" },
    { "every": "sign-seller", "from": "1-2", "to": "4-5", "cast": "deckhand", "scene": "signSeller", "if": "flag.signFor == 'tess' && hook.sinceSign > 0", "note": "Tess's sign in the window: the fishing families bring what they haul up" },
    { "every": "sign-shopper", "from": "1-2", "to": "4-5", "cast": "boardwalker", "scene": "signShopper", "if": "(flag.signFor == 'gordie' && hook.sinceSign > 0 || flag.selectWin == 'gordie') && hook.forSale > 0", "note": "Gordie's sign, or Gordie elected: boardwalk money" },
    { "at": "2-3", "cast": "marguerite", "scene": "margueriteWarrant", "if": "hook.meetingInRun", "town": true, "note": "the town's: in any run with a Town Meeting" }
  ],
  "hub": {
    "id": "meeting",
    "title": "Town Meeting",
    "where": "Town Hall",
    "window": ["4-1", "4-4"],
    "picks": 2,
    "open": "meetingOpen",
    "close": "meetingClose"
  },
  "vignettes": [
    { "hub": "fair", "label": "Gordie Haines's clambake", "scene": "clambake", "if": "!flag.clambakeDone" },
    { "hub": "meeting", "label": "Article 4: beach parking stickers", "scene": "article4", "town": true, "note": "ordinary business, so every Town Meeting has something on the warrant" },
    { "hub": "meeting", "label": "Article 11: a new snowplow", "scene": "article11", "town": true }
  ],
  "nights": [
    {
      "id": "selectmen-clambake",
      "window": ["2-1", "2-4"],
      "if": "!hook.fair",
      "scene": "clambakeNight",
      "test": [{ "hook": "testCoin", "with": 200 }]
    },
    {
      "id": "selectmen-debate",
      "window": ["3-1", "3-4"],
      "if": "flag.debateKnown",
      "scene": "selectDebate",
      "test": [
        { "set": { "debateKnown": true } },
        {
          "if": "random < 0.6",
          "then": [{ "set": { "ringKnown": true } }],
          "else": [{ "set": { "ringKnown": false } }]
        },
        { "roll": { "signFor": ["tess", "gordie", null] } }
      ]
    }
  ],
  "calendar": [
    { "id": "selectmen-clambake", "night": "selectmen-clambake", "story": "selectmen", "where": "Dot's Clam Shack", "title": "Gordie's clambake", "known": "flag.clambakeKnown && !hook.fair" },
    { "id": "selectmen-debate", "night": "selectmen-debate", "story": "selectmen", "where": "The Grange Hall", "title": "The candidates' debate", "known": "flag.debateKnown", "scene": "selectDebate" },
    { "id": "town-meeting", "night": "hub-meeting", "story": "town", "where": "Town Hall", "title": "Town Meeting", "known": "flag.meetingKnown" }
  ],
  "epilogue": [
    { "line": "Selectman Bascombe still keeps the harbormaster's log herself, every morning at six. The eleven boats are still fishing.", "if": "flag.selectWin == 'tess'" },
    { "line": "Selectman Haines has a jingle for every vote. The marina is \"in committee\", where it may stay forever.", "if": "flag.selectWin == 'gordie'" },
    { "line": "People in Hollow Neck say the shopkeeper on Front Street picked the last selectman. You say that's nonsense, and you don't sound convincing.", "if": "flag.selectKing" }
  ]
});
