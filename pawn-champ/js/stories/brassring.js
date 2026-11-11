// Pawn Champ - The Brass Ring. Major quest M28, batch G
// (docs/quests/MAJOR.md#m28-the-brass-ring-uncanny-november-to-march-stay-on).
// November to March (a stay-on story). The boardwalk carousel's owner has died, and her niece is
// selling the horses one at a time. One comes to your shop, and every morning it has turned a little
// further toward the door. Madame Orsolya says the carousel "was never wound by hand".
//
// Hook (W1 Mon)              Junie Lisle sells you the gray jumper, number seven.
// Middle (W1 Wed, W2 Tue)    Orsolya: the carousel turns on what comes home to it. A collector from
//                            Providence wants the whole set, starting with yours.
// Scene 1 (W1 Thu-W2 Wed)    the boardwalk at night: the carousel under its tarp, lights coming on alone.
// Scene 2 (W2 Wed-W3 Wed)    a night going house to house to talk people out of their horses.
// Finale (W3 Wed-W4 Thu)     the night it turns, with whatever horses came back.
// Crossings: m61 The Photo Booth (the same faces), M12 The Breakwaters Reunion (the band organ plays their song).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/brassring.js.
defineStory({
  "id": "brassring",
  "kind": "major",
  "colour": "#e2b04a",
  "family": "uncanny",
  "title": "The Brass Ring",
  "months": [2, 3, 4, 5, 6],
  "crosses": ["photobooth", "breakwaters"],
  "rumour": "Olive Lisle, who ran the boardwalk carousel for fifty-two years, has died, and her niece is selling the horses.",
  "endings": { "home": "Once More Round", "collector": "Sold to Providence", "keep": "It Never Quite Stops" },
  "about": [
    "A winter story about a town getting its carousel back for one night. Olive Lisle ran the boardwalk carousel for fifty-two years. Now she's died, and her niece Junie is selling the horses off one at a time. She sells you number seven, a gray jumper from 1911 (§{junieHorse}). Every morning he has turned a little further toward the door.",
    "Madame Orsolya tells you the carousel was never wound by hand: it turns on what comes home to it (§{orsolyaRing}). After dark on the boardwalk the bulbs light by themselves, and you can take the last brass ring from the chute (§{ringBoardwalk}). Most of the twenty-four horses were sold to townspeople years ago, so you go round the doorsteps asking for them back for one night (§{ringRounds}): Mrs. Wynn's kitchen, Ruthie's bar at the Rusty Anchor, the summer people's empty house on Cliff Road, where leaving the brass ring brings the horses out on their own. Meanwhile Lyman Greaves, a collector from Providence, offers $300 for number seven (§{lymanCalls}); selling ends the story (Sold to Providence).",
    "On the night it turns (§{ringTurn}), New Year's Eve if it falls in December, it needs twelve or more horses home. If they're there, the carousel turns once with pale children from every decade on it. That ties in with the photo booth's fourth frame and The Breakwaters if those are in the run. Then Greaves offers $600 for the whole set. Send the horses home in the morning (Once More Round), sell them to Providence (Sold to Providence), or keep number seven by your till, where he never quite stops turning (It Never Quite Stops; §{ringKept} plays on Mondays after)."
  ],
  "notes": "Nine horses come home on their own once the town hears the carousel lit up; the night of doorsteps adds more, up to 23 (number seven makes 24). It turns with 12 or more.",
  "cast": {
    "junie": {
      "name": "Junie Lisle",
      "look": { "skin": "#c89070", "hair": "#3a2418", "hs": 5, "coat": "#5a7a9a", "trim": "#e8e0d0", "style": "puffer", "pants": "#3a3a48", "hat": "beanie", "hatc": "#e8c050", "bag": "#8a5a3a" }
    },
    "lyman": {
      "name": "Lyman Greaves",
      "look": { "skin": "#f0d0b8", "hair": "#c8c8cc", "hs": 1, "coat": "#2a3a2a", "trim": "#c8a050", "style": "suit", "long": true, "pants": "#2a2a2a", "glasses": "#c8a050", "hat": "top", "hatc": "#1a1a1a" }
    },
    "wynn": {
      "name": "Mrs. Wynn",
      "look": { "skin": "#8a5a3a", "hair": "#e8e8ec", "hs": 3, "coat": "#7a4a6a", "trim": "#e8e0d0", "style": "dress", "pants": "#3a3a40", "glasses": "#2a2a2e" }
    }
  },
  "icons": {
    "horse": [
      "............",
      ".......kk...",
      "......kssk..",
      ".....kssssk.",
      "..kkkkssk.k.",
      ".kssssssk...",
      "kssrrrsssk..",
      ".ksssssssk..",
      "..kskkksk...",
      "..ky...ky...",
      "..ky...ky...",
      "..kk...kk..."
    ],
    "brassring": [
      "............",
      "............",
      "....kkkk....",
      "...kyYYyk...",
      "..kyk..kyk..",
      "..kY....Yk..",
      "..kY....yk..",
      "..kyk..kyk..",
      "...kyyyyk...",
      "....kkkk....",
      "............",
      "............"
    ]
  },
  "uniques": {
    "jumperHorse": {
      "name": "Carousel horse, number seven",
      "icon": "horse",
      "cat": "art",
      "guide": 160,
      "condLabel": "Gray jumper, 1911",
      "questKey": true,
      "tells": [
        "A carved gray jumping horse with a red saddle and a brass pole-hole through its back. A 7 is painted under the saddle flap.",
        { "text": "The paint on its hooves is worn through to the wood, as if it had been running. It has never been off its pole.", "cls": "good" }
      ]
    },
    "brassRing": {
      "name": "The brass ring",
      "icon": "brassring",
      "cat": "curio",
      "guide": 20,
      "condLabel": "Never caught",
      "questKey": true,
      "tells": [
        "A plain brass ring the size of a bracelet, from the carousel's ring arm. Whoever caught it rode free.",
        "It's warm. It's been sitting in the snow all winter, and it's warm."
      ]
    }
  },
  "scenes": {
    "junieHorse": {
      "title": "Junie Lisle sells you number seven",
      "customer": "junie",
      "steps": [
        {
          "say": "junie",
          "text": [
            "Junie Lisle. My aunt Olive had the carousel at the end of the boardwalk. Fifty-two years. She died in the autumn and left it to six of us, and five of us live in Florida.",
            "They want it sold a horse at a time. Most of them went years ago, to people in town, when Olive needed the oil bill paid. This one's number seven. A hundred and twenty?"
          ]
        },
        { "offer": { "unique": "jumperHorse" }, "persona": "honest", "asking": 120, "min": 85 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "set": { "ringOut": true } },
            { "say": "junie", "text": "That's all right. I'll try the antiques place in Kittery. Olive hated Kittery." },
            { "leave": "junie" },
            { "end": true }
          ]
        },
        { "set": { "ringIn": true, "ringTurn": 0 } },
        { "say": "junie", "text": "Put him facing the window. Olive always said they like to see where they're going." },
        { "leave": "junie" }
      ]
    },
    "orsolyaRing": {
      "title": "Madame Orsolya feels the horse pulling",
      "customer": "orsolya",
      "steps": [
        {
          "say": "orsolya",
          "text": [
            "You have one of Olive's horses. I can feel it from the street. It's pulling, isn't it? Toward the boardwalk.",
            "That carousel was never wound by hand. Olive told me so in 1979, very drunk, at my booth. It turns on what comes home to it. Horses. People. Children who grew up.",
            "Go and look at it after dark. Don't touch the ring. Or do. I'm not your mother."
          ]
        },
        { "set": { "ringHeard": true } },
        { "toast": "Calendar: the boardwalk carousel, after dark", "look": "orsolya" },
        { "leave": "orsolya" }
      ]
    },
    "lymanCalls": {
      "title": "Lyman Greaves wants number seven",
      "customer": "lyman",
      "steps": [
        {
          "say": "lyman",
          "text": [
            "Lyman Greaves, of Greaves Fine Carousel Art, Providence. I have nine of Olive Lisle's horses already, and her niece's blessing to collect the rest.",
            "You have number seven, the gray jumper, 1911. I'll give you three hundred for him today."
          ]
        },
        { "find": "horse", "in": "stock", "match": { "uniqueId": "jumperHorse" } },
        {
          "choose": [
            {
              "label": "Sell him number seven",
              "hint": "(+$300; the story ends here)",
              "disabled": "!horse",
              "then": [
                { "take": "horse" },
                { "coin": 300, "why": "Sold carousel horse number seven to Lyman Greaves" },
                { "refresh": "panel" },
                { "set": { "ringEnd": "collector", "ringDone": true } },
                { "say": "lyman", "text": "Splendid. He'll have a climate-controlled room with twenty-three friends. Horses don't like the cold, you know." },
                { "leave": "lyman" },
                { "end": true }
              ]
            },
            { "label": "\"Not yet.\"" }
          ]
        },
        { "say": "lyman", "text": "Then I'll make the same offer on the night it turns. People always say it turns. It never does." },
        { "leave": "lyman" }
      ]
    },
    "ringBoardwalk": {
      "title": "The carousel after dark",
      "steps": [
        {
          "hook": "carousel",
          "with": { "tarp": true, "lit": false, "turning": false, "horses": 0, "riders": false },
          "note": "How the carousel is drawn: under its tarp, dark, no horses."
        },
        {
          "stage": "carousel",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 168] },
            { "id": "orsolya", "cast": "orsolya", "at": [150, 166] }
          ]
        },
        {
          "narrate": [
            "The end of the boardwalk, past the dark arcade. Snow on the planks, snow on the tarp, and under it twenty-four brass poles with nothing on them.",
            "A bulb comes on under the canopy. Then another, on the far side. Nobody is anywhere near the switch box, and the switch box has no cover on it and no wires going in."
          ]
        },
        { "say": "orsolya", "text": "There. Olive said it always did this in the winter. Missing them." },
        { "walk": "you", "to": [250, 166] },
        { "narrate": "On the ring arm by the rail, the chute still holds one ring. Brass, not iron like the rest. Whoever caught it rode free next summer. It's warm in your glove." },
        {
          "if": "shelf.free",
          "then": [
            { "add": { "unique": "brassRing" } },
            { "refresh": "panel" },
            { "set": { "ringHasRing": true } }
          ]
        },
        { "say": "orsolya", "text": "Twenty-four horses in twenty-four houses. Kitchens, the bar, that big house on Cliff Road. Some of them won't want to give them back. You'll have to ask nicely, and more than once." },
        { "set": { "ringClue": true } },
        { "toast": "Calendar: a night of doorsteps", "look": "orsolya" }
      ]
    },
    "ringRounds": {
      "title": "Asking for the horses back",
      "steps": [
        {
          "hook": "horses",
          "with": 9,
          "sets": ["back"],
          "note": "Nine come home on their own. Each \"horses\" adds to the count."
        },
        {
          "stage": "kitchenNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] },
            { "id": "wynn", "cast": "wynn", "at": [230, 162], "facingLeft": true }
          ]
        },
        { "narrate": "Mrs. Wynn's kitchen on Front Street. A painted horse stands where a dishwasher ought to be, with a tea towel over its saddle." },
        { "say": "wynn", "text": "Olive sold him to my husband in 1988 for the price of a winter's oil. Our kids learned to walk holding on to his legs. Now you want him back on a pole in the snow." },
        {
          "choose": [
            {
              "label": "\"Just for one night. Then he comes home.\"",
              "then": [
                { "hook": "horses", "with": 5 },
                { "say": "wynn", "text": "One night. And my grandson rides him. If it turns. Which it won't." }
              ]
            },
            {
              "label": "Offer to buy him",
              "hint": "(-$30)",
              "disabled": "coin < 30",
              "then": [
                { "hook": "horses", "with": 4 },
                { "coin": -30, "why": "Bought a carousel horse from Mrs. Wynn" },
                { "say": "wynn", "text": "Thirty dollars. Olive would laugh. Take him, then." }
              ]
            },
            {
              "label": "\"Keep him. I'm sorry I asked.\"",
              "then": [{ "say": "wynn", "text": "Good. Goodnight." }]
            }
          ]
        },
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] },
            { "id": "ruthie", "cast": "ruthie", "at": [250, 160], "facingLeft": true }
          ]
        },
        { "narrate": "The Rusty Anchor. Over the bar, on a chain, a black horse with a gold mane and a life ring round its neck. Three regulars have their own horses at home, it turns out, and are listening." },
        { "say": "ruthie", "text": "That horse has been over my bar since 1971. People get engaged under it." },
        {
          "choose": [
            {
              "label": "\"It turns once, and then it comes back to you.\"",
              "then": [
                { "hook": "horses", "with": 5 },
                { "say": "ruthie", "text": "Fine. Lads, you too. Go and get yours. Bring them down the boardwalk Thursday. If it doesn't turn I'm charging you all for the chain." }
              ]
            },
            {
              "label": "\"Olive would want it.\"",
              "then": [
                { "hook": "horses", "with": 2 },
                { "say": "ruthie", "text": "Olive wanted a lot of things. I'll bring mine. These lot can make their own minds up." }
              ]
            }
          ]
        },
        {
          "stage": "cliffroad",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] }]
        },
        {
          "narrate": [
            "The big house on Cliff Road, where the summer people's things live in winter. Four horses stand in the front hall in a row, under dust sheets, like guests waiting to be shown in.",
            "The housekeeper says the owners are in Naples, the Florida one, and won't answer the phone after six. The horses were bought as \"a feature\"."
          ]
        },
        { "find": "ring", "in": "stock", "match": { "uniqueId": "brassRing" } },
        {
          "choose": [
            {
              "label": "Ask her to let them out for one night",
              "then": [
                { "hook": "horses", "with": 2 },
                { "narrate": "She lets you take two. \"The other two are on loan to a museum,\" she says. They are not." }
              ]
            },
            {
              "label": "Leave a note and the brass ring on the hall table",
              "hint": "(they'll come)",
              "disabled": "!ring",
              "then": [
                { "take": "ring" },
                { "refresh": "panel" },
                { "hook": "horses", "with": 4 },
                { "set": { "ringGaveRing": true } },
                { "narrate": "You leave the ring on the hall table. In the morning the housekeeper calls you, very calm, to say that the front door is open and the four horses are standing in the snow, facing the boardwalk." }
              ]
            },
            { "label": "Leave them" }
          ]
        },
        { "hook": "horsesHome", "note": "ringHorses: how many came back, at most 23." },
        { "set": { "ringRounds": true } },
        { "toast": "About {flag.ringHorses} of the twenty-four horses are coming home.", "look": "orsolya" }
      ]
    },
    "ringTurn": {
      "title": "The night it turns",
      "steps": [
        { "find": "horse", "in": "stock", "match": { "uniqueId": "jumperHorse" } },
        {
          "hook": "turnHorses",
          "sets": ["horses"],
          "note": "horses: the ones back on their poles tonight, number seven too if he is in the shop."
        },
        {
          "stage": "carousel",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 168] },
            { "id": "orsolya", "cast": "orsolya", "at": [150, 166] }
          ]
        },
        {
          "narrate": {
            "if": "month == 3 && week == 4",
            "then": { "if": "horse", "then": "New Year's Eve, an hour before midnight. The tarp is off. Half the town is on the boardwalk in boots and blankets, and {horses} of the twenty-four horses are back on their poles, number seven among them.", "else": "New Year's Eve, an hour before midnight. The tarp is off. Half the town is on the boardwalk in boots and blankets, and {horses} of the twenty-four horses are back on their poles." },
            "else": { "if": "horse", "then": "A clear, freezing night. The tarp is off. Half the town is on the boardwalk in boots and blankets, and {horses} of the twenty-four horses are back on their poles, number seven among them.", "else": "A clear, freezing night. The tarp is off. Half the town is on the boardwalk in boots and blankets, and {horses} of the twenty-four horses are back on their poles." }
          }
        },
        {
          "if": "horses >= 12",
          "then": [
            { "hook": "carousel", "with": { "lit": true } },
            { "narrate": "Nobody touches anything. The bulbs come on, all of them at once, and the band organ wheezes and finds its note, and the carousel begins to turn." },
            { "narrate": "The organ roll is playing something nobody remembers loading: a waltz, then a slow version of the Breakwaters' one song. Benny Okafor has to sit down.", "if": "flag.bwGig || quest.breakwaters" },
            { "hook": "carousel", "with": { "turning": true, "riders": true } },
            { "narrate": "There are riders. Pale children in coats from every decade it ran, one on every horse, holding on with both hands, and the people on the boardwalk are calling out their own names." },
            { "narrate": "You know some of the faces. They're the same children who turn up in the fourth frame of the photo booth at Pinwheel Lanes.", "if": "quest.photobooth || flag.boothEnd" }
          ],
          "else": [
            { "narrate": "Two bulbs come on, and one of the horses rocks on its pole and stops. Not enough of them came home." }
          ]
        },
        {
          "say": "orsolya",
          "text": { "if": "horses >= 12", "then": "Once round. That's all it ever needed. Once round with everybody home.", "else": "It tried. It needed more of them. Some people don't let go of a thing, even for a night." }
        },
        { "enter": { "id": "lyman", "cast": "lyman", "at": [280, 162], "facingLeft": true } },
        { "say": "lyman", "text": "Remarkable. Some sort of timer, I expect. My offer stands: six hundred for your share, and I take every horse on that deck to Providence tonight." },
        {
          "choose": [
            {
              "label": "Let it turn, and send the horses home in the morning",
              "hint": "(rep +8)",
              "then": [
                { "take": "horse" },
                { "rep": 8, "why": "The carousel turned once more" },
                { "narrate": "In the morning the horses go home, one at a time, on shoulders and sledges and in the backs of trucks. Number seven goes to Junie Lisle, who cries, and then laughs about Kittery." },
                { "set": { "ringEnd": "home" } }
              ]
            },
            {
              "label": "Sell the set to Lyman Greaves",
              "hint": "(+$600, rep -4)",
              "then": [
                { "take": "horse" },
                { "coin": 600, "why": "Sold the carousel horses to Lyman Greaves" },
                { "rep": -4, "why": "Sold Olive Lisle's carousel to Providence" },
                { "hook": "carousel", "with": { "turning": false, "riders": false } },
                { "narrate": "The truck pulls away at two in the morning. As it reaches the end of the boardwalk, every bulb on the empty carousel comes on and goes out again." },
                { "set": { "ringEnd": "collector" } }
              ]
            },
            {
              "label": "Take number seven home to the shop",
              "hint": "(keep him: he never quite stops)",
              "if": "horse",
              "then": [
                { "narrate": "You carry number seven back up Main Street in the snow. He's lighter than he was. When you set him down by the till, facing the window, he seems content." },
                { "set": { "ringEnd": "keep" } }
              ]
            }
          ]
        },
        { "refresh": "panel" },
        { "set": { "ringDone": true } }
      ]
    },
    "ringKept": {
      "title": "Number seven turns in the night (every Monday, if you kept him)",
      "steps": [
        { "narrate": "Number seven has turned a little in the night again. He seems to be listening for something down by the boardwalk." }
      ]
    }
  },
  "beats": [
    { "at": "1-1", "cast": "junie", "scene": "junieHorse" },
    { "at": "1-3", "cast": "orsolya", "scene": "orsolyaRing", "if": "flag.ringIn && !flag.ringDone" },
    { "at": "2-2", "cast": "lyman", "scene": "lymanCalls", "if": "flag.ringIn && !flag.ringDone && hook.horseHere" }
  ],
  "nights": [
    {
      "id": "ring-boardwalk",
      "window": ["1-4", "2-3"],
      "if": "flag.ringHeard && !flag.ringDone",
      "scene": "ringBoardwalk",
      "test": [{ "set": { "ringHeard": true } }]
    },
    {
      "id": "ring-rounds",
      "window": ["2-3", "3-3"],
      "if": "flag.ringClue && !flag.ringDone",
      "scene": "ringRounds",
      "test": [
        { "set": { "ringClue": true } },
        { "hook": "testCoin", "with": 100 },
        { "add": { "unique": "brassRing" } }
      ]
    },
    {
      "id": "ring-turn",
      "window": ["3-3", "4-4"],
      "if": "flag.ringClue && !flag.ringDone",
      "scene": "ringTurn",
      "test": [
        { "set": { "ringClue": true } },
        {
          "roll": { "ringHorses": [16, 16, 16, 16, 16, 16, 16, 9, 9, 9] },
          "note": "Usually enough horses to turn it."
        },
        { "add": { "unique": "jumperHorse" } }
      ]
    }
  ],
  "calendar": [
    { "id": "ring-boardwalk", "night": "ring-boardwalk", "story": "brassring", "where": "The boardwalk", "title": "The carousel after dark", "known": "flag.ringHeard", "scene": "ringBoardwalk" },
    { "id": "ring-rounds", "night": "ring-rounds", "story": "brassring", "where": "Around town", "title": "Asking for the horses back", "known": "flag.ringClue", "scene": "ringRounds" },
    { "id": "ring-turn", "night": "ring-turn", "story": "brassring", "where": "The boardwalk", "title": "The night it turns", "known": "flag.ringClue", "scene": "ringTurn" }
  ],
  "mornings": [
    {
      "if": "flag.ringIn && !flag.ringDone && hook.horseHere",
      "note": "Every morning the horse is in the shop, it has turned a little further toward the door.",
      "then": [
        { "hook": "turnAgain" },
        { "narrate": "You put the gray horse facing the window last night. This morning he's facing the shelves. You must have knocked him.", "if": "flag.ringTurn == 1" },
        { "narrate": "The gray horse has turned again in the night. He's facing the door now, and there are four little scuffs in the dust where his hooves are.", "if": "flag.ringTurn == 2" },
        { "narrate": "Number seven is right by the door this morning, a foot from where you left him. Mister Fathom won't go near him.", "if": "flag.ringTurn == 4" }
      ]
    }
  ],
  "epilogue": [
    { "line": "The carousel turned once more, with everybody home. The horses are back in their kitchens and bars, and on cold nights, people say, they face the sea.", "if": "flag.ringEnd == 'home'" },
    { "line": "Olive Lisle's horses stand in a climate-controlled room in Providence. The empty carousel lights up on its own, now and then, and the town has stopped mentioning it.", "if": "flag.ringEnd == 'collector'" },
    { "line": "Number seven stands by your till. He turns a little in the night, every night, toward the boardwalk. Customers pat him for luck.", "if": "flag.ringEnd == 'keep'" }
  ],
  "talk": {
    "by": "orsolya",
    "rumour": [
      "Olive Lisle has died. She ran the carousel at the end of the boardwalk for fifty-two years. Her niece is selling the horses.",
      "That carousel was never wound by hand. Olive told me so, very drunk, at my booth, in 1979."
    ],
    "react": { "home": "It went round once with everybody home. I heard the organ from my booth. I didn't go and look. I didn't need to.", "collector": "The horses are in Providence. The carousel lights up by itself some nights, looking for them. I keep my curtain shut.", "keep": "You kept number seven. He turns at night, doesn't he. I won't say I told you. I'll just think it loudly." },
    "sway": { "home": { "orsolya": 3 }, "collector": { "orsolya": -1 }, "keep": { "orsolya": -1 } }
  },
  "outcome": "flag.ringEnd"
});
