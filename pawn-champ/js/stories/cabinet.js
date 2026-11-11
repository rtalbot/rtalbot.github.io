// Pawn Champ - The Doctor's Cabinet: Rich's spider story. Major quest M19, batch J
// (docs/quests/MAJOR.md#m19-the-doctors-cabinet-uncanny).
//
// Hook (W1 Tue-Thu)          Dr. Corwin Ladd sells you the old doctor's collector's cabinet. One drawer
//                            is empty, its glass cracked. Refuse it and it's on your step next morning.
// Middle (shop)              cobwebs on the cabinet, then on your stock; Hester on old Dr. Pryne;
//                            Bettany faints at your counter; Father Ignatius on the choir and the loft;
//                            Coralie Vance from Providence wants the cabinet ($380).
// Scene 1 (W1 Thu-W2 Wed)    the surgery at night: the 1898 shipping papers say LIVE; the jar.
// Scene 2 (W2 Thu-W3 Thu)    the nest under Saint Brine's attic floor, with Sal and Father Ignatius.
// Finale (W4 Mon-Thu)        the back room at closing: she has come for her drawer.
// Endings: Fumigated (you and Sal gas her), Shipped to Providence (sold to the collector), The Town
// Keeps Its Doctor (Corwin's name cleared). With a 15-day pet streak (catGuards()), Mister Fathom finds
// the queen himself in the back room. Crossing: The Benefit (the roofers won't go into the loft).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/cabinet.js.
defineStory({
  "id": "cabinet",
  "kind": "major",
  "colour": "#6a8a5a",
  "family": "uncanny",
  "title": "The Doctor's Cabinet",
  "crosses": ["benefit"],
  "rumour": "The new doctor sold off a Victorian insect cabinet from his cellar. One drawer is empty.",
  "endings": { "gassed": "Fumigated", "sold": "Shipped to Providence", "cleared": "The Town Keeps Its Doctor" },
  "about": [
    "A creature story that's really about a town turning on its new doctor. Dr. Corwin Ladd bought old Dr. Pryne's house, and sells you a Victorian insect cabinet from the cellar (§{laddCabinet}). The bottom drawer is empty and its glass is cracked. If you won't buy it, it turns up on your step anyway. Cobwebs start appearing on it every morning.",
    "Ladd shows you Pryne's papers (§{cabinetSurgery}): live specimens shipped from Brazil in 1898, and a letter about \"R.\", a queen spider who had outgrown her drawer and was moved to the warm loft above the nave at Saint Brine's. Hester fills in Pryne's history (§{hesterPryne}). Bettany faints at your counter with a bite on her wrist (§{bettanyFaints}), sopranos keep fainting, and the town blames the new doctor's flu shots. Fetching Ladd for Bettany, taking the papers, and later giving the queen the specimen jar all raise his trust.",
    "Father Ignatius takes you up into the loft with Sal (§{ignatiusChoir}, §{cabinetNest}): ninety years of silk above the choir, and the queen. Gas her with Sal's sulphur candles, unseal the jar and give her back what was hers, or photograph her for the town. A collector from Providence, Coralie Vance, offers $380 for the cabinet (§{vanceOffer}); selling it takes the spiders with it (Shipped to Providence).",
    "In week 4 the queen comes up through your coal hatch for her drawer (§{cabinetFinale}). If your shop cat is a guardian, he stares her back into it. With the papers and either the photographs or enough trust, Dr. Ladd comes and coaxes her in, and shows the whole town on Saturday (The Town Keeps Its Doctor). Or Sal gasses her in your back room, and the town never forgives the doctor (Fumigated)."
  ],
  "notes": "The story is live while the cabinet is in and the story isn't done (flag.cabinetIn && !flag.cabinetDone). Dr. Ladd's trust (flag.cabinetTrust) goes up when you fetch him for Bettany, take the papers, or give the queen her jar; with the papers and either the photographs or a trust of 2, you can call him at the end.",
  "cast": {
    "ladd": {
      "name": "Dr. Corwin Ladd",
      "look": { "skin": "#a8704a", "hair": "#1e1a18", "hs": 0, "coat": "#3a4048", "trim": "#e8e8e0", "style": "jacket", "long": true, "pants": "#2a2a30", "glasses": "#2a2a2e", "bag": "#3a2418" }
    },
    "vance": {
      "name": "Ms. Coralie Vance",
      "look": { "skin": "#e8c8b0", "hair": "#c8c0b8", "hs": 3, "coat": "#2a2a3a", "trim": "#a8a0c8", "style": "dress", "long": true, "pants": "#1e1e28", "glasses": "#a8a0c8", "hat": "wide", "hatc": "#1e1e28", "bag": "#5a2a3a" }
    }
  },
  "icons": {
    "specCabinet": [
      ".kkkkkkkkkk.",
      ".kwwwwwwwwk.",
      ".kBkBkBkBwk.",
      ".kwwwwwwwwk.",
      ".kBkBkBkBwk.",
      ".kwwwwwwwwk.",
      ".kBkBk.k.wk.",
      ".kwwwwwwwwk.",
      ".kBkBkBkBwk.",
      ".kwwwwwwwwk.",
      ".kk......kk.",
      ".k........k."
    ],
    "specJar": [
      "............",
      "...kkkkkk...",
      "...kSSSSk...",
      "..kkkkkkkk..",
      "..kBBBBBBk..",
      "..kBkBBkBk..",
      "..kBBkkBBk..",
      "..kBkBBkBk..",
      "..kBBBBBBk..",
      "..kBBBBBBk..",
      "...kkkkkk...",
      "............"
    ]
  },
  "uniques": {
    "specCabinet": {
      "name": "Collector's cabinet, 1898",
      "icon": "specCabinet",
      "cat": "curio",
      "guide": 220,
      "questKey": true,
      "condLabel": "One drawer cracked",
      "tells": [
        "Mahogany, twelve glass-topped drawers of pinned beetles and moths, each on its card in brown ink.",
        "The bottom left drawer is empty. Its glass is cracked from underneath, and the card inside says only REGINA."
      ]
    },
    "shippingPapers": {
      "name": "Shipping papers, 1898",
      "icon": "letter",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Foxed",
      "tells": [
        "A bill of lading from Pará, Brazil, to Dr. A. Pryne, Chapel Street, Hollow Neck. Sixty specimens.",
        "Across the bottom, in red: LIVE. KEEP WARM. DO NOT OPEN IN COLD WEATHER."
      ]
    },
    "specJar": {
      "name": "A specimen jar",
      "icon": "specJar",
      "cat": "curio",
      "guide": 15,
      "condLabel": "Not empty",
      "tells": [
        "Cloudy spirit, a cork sealed with wax, and something folded up small inside.",
        "When you set it down, the thing inside turns to face you. It isn't dead."
      ]
    }
  },
  "overheard": [
    { "line": "Low: \"Both sopranos had been to see the new doctor that week. Both of them. I'm only saying.\"", "if": "flag.cabinetChoir" },
    { "line": "\"There's cobwebs in the Grange Hall you could hang a coat on. In a week. Who has a week like that?\"", "if": "flag.cabinetIn && !flag.cabinetDone" }
  ],
  "scenes": {
    "laddCabinet": {
      "title": "Dr. Ladd sells you the cabinet",
      "customer": "ladd",
      "steps": [
        { "say": "ladd", "text": "Corwin Ladd. I'm the new doctor, on Chapel Street. I bought old Dr. Pryne's house, and everything in it, which was a mistake." },
        { "narrate": "He and Sal the scrap dealer wheel it in on a hand truck: a mahogany cabinet, chest-high, twelve shallow drawers with glass tops. Beetles and moths, pinned in rows." },
        { "say": "ladd", "text": "It was in the cellar. I'd like it out of the house. The bottom drawer is empty and the glass is cracked, and I'd rather not think about why." },
        { "offer": { "unique": "specCabinet" }, "persona": "honest", "asking": 110, "min": 70 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "cabinetIn": true } },
            {
              "say": "ladd",
              "text": [
                "Thank you. Honestly. If you're ever passing after hours, I found a box of his papers down there I can't make head or tail of.",
                "{placed:cabinet-surgery} night, say. I'm always up."
              ]
            },
            { "toast": "Calendar: Dr. Ladd's surgery, {placed:cabinet-surgery} night", "look": "ladd" }
          ],
          "else": [
            { "set": { "cabinetStep": true } },
            { "say": "ladd", "text": "No? No. Fair enough. I'll find somewhere for it." }
          ]
        },
        { "leave": "ladd" }
      ]
    },
    "hesterPryne": {
      "title": "Hester on old Dr. Pryne",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "You bought Abiah Pryne's cabinet. Half of Front Street watched Sal wheel it up the hill.",
            "Dr. Pryne was the town doctor from 1891 to 1930. He collected insects, and the Athenaeum has three letters complaining about him. The smell, the crates, and \"certain escapes\".",
            "Nobody has been down that cellar in sixty years. If Dr. Ladd found papers, I'd like to know what's in them. I'd like to know before anybody else does."
          ]
        },
        { "set": { "cabinetHester": true } },
        { "leave": "hester" }
      ]
    },
    "bettanyFaints": {
      "title": "Bettany faints at the counter",
      "customer": "bettany",
      "steps": [
        { "say": "bettany", "text": "Two rolls of quarters for the bakery till, if you've got them. I've been up since four, and my wrist's been funny since the Grange." },
        { "narrate": "She puts a hand on the counter, and then she isn't standing any more. She goes down slowly, the way a coat slides off a hook." },
        {
          "choose": [
            {
              "label": "Run up Chapel Street for Dr. Ladd",
              "then": [
                { "hook": "trust" },
                { "enter": { "id": "ladd", "cast": "ladd", "at": [96, 152] } },
                { "narrate": "He comes at a run, with his bag, in his slippers." },
                { "say": "ladd", "text": "She's all right. She's all right. Look at this, though." },
                { "narrate": "On the inside of her wrist, two small red marks, a quarter-inch apart." },
                { "say": "ladd", "text": "That's a bite. Not a tick, not a bee. I've seen four of these this week, and every one of them sang in the choir." },
                { "say": "bettany", "text": "I'm fine. I'm fine! Who let a doctor in?" },
                { "remove": "ladd" }
              ]
            },
            {
              "label": "Call the ambulance from Plymouth",
              "then": [
                { "narrate": "The ambulance takes forty minutes. By then she's sitting up on your stool with a cup of tea and wants to know what all the fuss is about." },
                { "say": "bettany", "text": "It's nothing. It's the new doctor, everyone says. He gave half the choir a flu shot and now look." }
              ]
            }
          ]
        },
        { "leave": "bettany" }
      ]
    },
    "ignatiusChoir": {
      "title": "Father Ignatius on the choir and the loft",
      "customer": "ignatius",
      "steps": [
        {
          "say": "ignatius",
          "text": [
            "Two of my sopranos fainted at choir practice last night. Both at once, in the middle of the Magnificat. They're all right, thank God.",
            "We rehearse at the Grange Hall now. We had to stop using the loft at Saint Brine's. Something up there rustles. It rustles in time to the organ."
          ]
        },
        { "say": "ignatius", "if": "quest.benefit", "note": "Crossing: The Benefit.", "text": "The roofers for the Benefit won't go up there either. They went into the attic once, and came straight down, and asked for cash." },
        {
          "say": "ignatius",
          "text": [
            "And now the whole town says it's the new doctor. That he gave them something. He's a good man. He came to Mass. Nobody has spoken to him since.",
            "Would you come and look at the loft with me? {placed:cabinet-nest} night. I've asked Sal to bring his torch. Sal isn't afraid of anything."
          ]
        },
        { "set": { "cabinetChoir": true } },
        { "toast": "Calendar: Saint Brine's loft, {placed:cabinet-nest} night", "look": "ignatius" },
        { "leave": "ignatius" }
      ]
    },
    "vanceOffer": {
      "title": "Coralie Vance of Providence",
      "customer": "vance",
      "steps": [
        { "find": "cab", "in": "stock", "match": { "uniqueId": "specCabinet" } },
        { "say": "vance", "text": "Coralie Vance. I buy natural history for a museum in Providence, and for myself when the museum isn't looking." },
        {
          "if": "!cab",
          "then": [
            { "say": "vance", "text": "I heard you had the Pryne cabinet. I see I heard wrong. A pity." },
            { "leave": "vance" },
            { "end": true }
          ]
        },
        { "narrate": "She runs a gloved finger along the cracked glass of the empty drawer, and smiles at the card inside as if she's known it a long time." },
        { "say": "vance", "text": "Three hundred and eighty. Today, cash, and I'll have it collected by tonight. I won't ask where its last occupant has gone, if you won't." },
        {
          "choose": [
            {
              "label": "Sell her the cabinet",
              "hint": "(+$380)",
              "then": [
                { "sell": "cab", "to": "vance" },
                { "refresh": "panel" },
                { "coin": 380, "why": "Sold the Pryne cabinet to Coralie Vance of Providence" },
                { "set": { "cabinetEnd": "sold", "cabinetDone": true } },
                { "say": "vance", "text": "Lovely. Everything comes home to its drawer in the end, doesn't it." },
                { "narrate": "The van comes at dusk. That night, for the first time in a week, there's no cobweb on your door in the morning. Not one, anywhere in town." }
              ]
            },
            {
              "label": "\"It isn't going anywhere yet.\"",
              "then": [
                { "say": "vance", "text": "Of course. I'll be at the Motor Inn until the weekend. They have a very clean room." }
              ]
            }
          ]
        },
        { "leave": "vance" }
      ]
    },
    "cabinetSurgery": {
      "title": "Dr. Ladd's papers",
      "music": "eerie",
      "steps": [
        {
          "stage": "surgery",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "ladd", "cast": "ladd", "at": [196, 164], "facingLeft": true }
          ]
        },
        { "set": { "cabinetSurgery": true } },
        { "narrate": "Chapel Street after hours. The surgery was Dr. Pryne's front parlor, and it still is: brown bottles in a glass dispensary, a roll-top desk, and a trapdoor in the floor standing open on stone steps." },
        {
          "say": "ladd",
          "text": [
            "Thank you for coming. Nobody else will. I had a patient cross the road yesterday to avoid me.",
            "The box was down there. Under the coal. Look at this."
          ]
        },
        { "narrate": "A bill of lading, Pará to Hollow Neck, 1898: sixty specimens, assorted. Across the bottom, in red ink: LIVE. KEEP WARM. DO NOT OPEN IN COLD WEATHER." },
        { "say": "ladd", "text": "Live. He had them shipped live. And there's a letter from 1899, in his hand." },
        { "narrate": "\"The parish has kindly agreed to keep the overflow in the loft above the nave, where the chimney keeps it warm. R. is thriving. She has outgrown her drawer.\"" },
        { "say": "ladd", "text": "R. The empty drawer. I looked it up. Regina. A queen." },
        {
          "choose": [
            {
              "label": "Take the papers, to show the town",
              "hint": "(proof it isn't him)",
              "then": [
                { "narrate": "Your shelves are full. You fold the papers into your coat and squeeze them in beside the till.", "if": "!shelf.free" },
                { "add": { "unique": "shippingPapers" } },
                { "refresh": "panel" },
                { "set": { "cabinetPapers": true } },
                { "hook": "trust" }
              ]
            },
            { "label": "\"Keep them. Burn them, if I were you.\"" }
          ]
        },
        {
          "narrate": [
            "There's one more thing on the cellar step, by the lantern: a specimen jar, cloudy, corked and sealed with wax. Something folded small inside it.",
            "As you look, it unfolds. Slowly. And turns round to face you."
          ]
        },
        {
          "choose": [
            {
              "label": "Take the jar",
              "then": [
                { "add": { "unique": "specJar" } },
                { "refresh": "panel" },
                { "set": { "cabinetJar": true } },
                { "say": "ladd", "text": "Please. Take it. I haven't slept since I found it." }
              ]
            },
            {
              "label": "Leave the jar on the step",
              "then": [
                { "say": "ladd", "text": "I'll put it back under the coal. It seems to like it there." }
              ]
            }
          ]
        },
        { "say": "ladd", "if": "!flag.cabinetChoir", "text": "The loft above the nave. That's Saint Brine's. I should tell Father Ignatius. Will he even let me in?" }
      ]
    },
    "cabinetNest": {
      "title": "The loft above the nave",
      "music": "tension",
      "steps": [
        {
          "hook": "nest",
          "with": { "queen": 0, "stir": false },
          "note": "The nest's drawing: how far out the queen is (0 to 1), and whether the small ones are running."
        },
        {
          "stage": "nest",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [92, 168] },
            { "id": "ignatius", "cast": "ignatius", "at": [60, 168] },
            { "id": "sal", "cast": "junkman", "at": [124, 168] }
          ]
        },
        { "set": { "cabinetNested": true } },
        {
          "narrate": [
            "Saint Brine's, after evensong. Up the bell-rope ladder, through the attic, and under the attic boards: the hollow between the floor and the humped plaster back of the nave's ceiling.",
            "It is all silk. Sheets of it, slung between the timbers. Egg sacs on the posts, pulsing. Wrapped things hanging and turning. Candlelight from the nave comes up through the cracks."
          ]
        },
        { "say": "sal", "text": "Huh. Well. That's not mice." },
        { "say": "ignatius", "text": "Ninety years. Ninety years above our heads, and we sang to them every Sunday." },
        { "hook": "nest", "with": { "queen": 0.6 } },
        { "narrate": "At the back, in the mouth of a funnel of silk, something moves. Eight red eyes come forward out of the dark, one pair at a time." },
        { "say": "sal", "text": "I brought sulphur candles. From when I did fumigation, back when. Say the word." },
        { "find": "jar", "in": "stock", "match": { "uniqueId": "specJar" } },
        {
          "choose": [
            {
              "label": "Light Sal's sulphur candles",
              "hint": "(gas the nest)",
              "then": [
                { "hook": "nest", "with": { "stir": true } },
                { "narrate": "Sal lights four candles and kicks them under the timbers. Yellow smoke, the smell of a struck match a thousand times over. The small ones run. The wrapped things stop turning." },
                { "hook": "nest", "with": { "queen": 0 } },
                { "narrate": "The queen goes backwards into her funnel, fast, and is gone. Not dead. You can feel that she isn't dead." },
                { "say": "sal", "text": "She'll come out somewhere. They always come out somewhere. You've got her drawer, right?" },
                { "set": { "cabinetGassed": true } }
              ]
            },
            {
              "label": "Unseal the specimen jar, and set it down for her",
              "if": "flag.cabinetJar && jar",
              "then": [
                { "take": "jar" },
                { "refresh": "panel" },
                { "hook": "nest", "with": { "queen": 1, "stir": false } },
                {
                  "narrate": [
                    "You break the wax and set the jar on the boards. What was inside climbs out, small and pale and stiff after a hundred and twenty years, and picks its way up the silk to her.",
                    "She lowers her front legs. The small ones stop running. It's very quiet. Father Ignatius takes photographs, his hands shaking, and nobody stops him."
                  ]
                },
                { "set": { "cabinetPhotos": true } },
                { "hook": "trust" },
                { "say": "ignatius", "text": "Whatever that was, it was hers. I think you've done a kindness. I don't know to whom." }
              ]
            },
            {
              "label": "Back away. Let Father Ignatius take photographs for the town",
              "hint": "(proof)",
              "then": [
                { "hook": "nest", "with": { "stir": true } },
                { "narrate": "You back towards the ladder, one board at a time. Father Ignatius holds his phone up, and the flash goes off, and off, and off. Every time it does, she comes a little further out." },
                { "hook": "nest", "with": { "queen": 1 } },
                { "set": { "cabinetPhotos": true } },
                { "say": "ignatius", "text": "Down. Down, down, down." }
              ]
            },
            {
              "label": "Photograph her yourself, by the candlelight, no flash",
              "needs": "photo",
              "without": "A camera that works in this light would mean no flash.",
              "note": "Items in use (docs/ITEMS_IN_USE.md): a real camera needs no flash.",
              "then": [
                { "use": "photo", "as": "camera" },
                { "set": { "cabinetPhotos": true, "cabinetQuiet": true } },
                { "rep": 1 },
                { "narrate": "You open the {camera.name|lower|or:camera} all the way up and hold your breath for each long exposure. The silk, the sacs, the eight red eyes. No flash. She watches you do it, and stays exactly where she is." },
                { "say": "ignatius", "text": "Thank you for not... provoking her. I think she noticed." }
              ]
            }
          ]
        },
        { "narrate": "On the way down the ladder, Sal says what all three of you are thinking. \"That empty drawer. She's going to want it back.\"" },
        { "hook": "nest", "with": { "stir": false } }
      ]
    },
    "cabinetFinale": {
      "title": "Closing time: she has come for her drawer",
      "music": "tension",
      "steps": [
        {
          "stage": "shopNight",
          "view": { "candleX": 200 },
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [236, 141], "facingLeft": true }
          ]
        },
        { "find": "cab", "in": "stock", "match": { "uniqueId": "specCabinet" } },
        {
          "narrate": [
            "Closing time. You're cashing up when you hear it from the back room: a dry sound, like a broom being drawn very slowly across the floorboards.",
            "The coal hatch is open. Silk runs from it to the cabinet in long grey ropes, and the cracked drawer has been pulled out onto the floor."
          ]
        },
        {
          "narrate": { "if": "flag.cabinetGassed", "then": "She is curled round it, scorched and furious, with her legs folded under her like an umbrella. Even folded she fills the corner.", "else": "She is curled round it, legs folded under her like an umbrella. Even folded she fills the corner. Her eyes catch the till light, eight of them, one pair at a time." }
        },
        {
          "choose": [
            {
              "label": "Stand back. {hook:catName} has seen her.",
              "if": "hook.catGuards",
              "note": "A 15-day pet streak (js/secrets.js).",
              "then": [
                {
                  "narrate": [
                    "{hook:catName} walks past you into the back room, tail up, without hurrying, the way he goes to his dish.",
                    "She rears. He sits down in front of her and looks at her. Nobody in the history of the world has ever been looked at like that.",
                    "After a long minute she folds herself, smaller and smaller, into the drawer under the cracked glass. He jumps up and sits on it, and starts washing a paw."
                  ]
                },
                { "set": { "cabinetCat": true } }
              ]
            },
            {
              "label": "Telephone Dr. Ladd, and keep very still",
              "hint": "(clear his name)",
              "if": "flag.cabinetPapers && (flag.cabinetPhotos || flag.cabinetTrust >= 2)",
              "then": [
                { "enter": { "id": "ladd", "cast": "ladd", "at": [96, 152] } },
                { "narrate": "He comes in his slippers, with the papers, and a sheet of new glass he'd cut for the drawer weeks ago, just in case. He talks to her the whole time, very low, the way you'd talk to a horse. She goes back into her drawer like she's been waiting to be asked." }
              ]
            },
            {
              "label": "Telephone Sal. Tell him to bring everything.",
              "hint": "(gas her)",
              "then": [
                { "enter": { "id": "sal", "cast": "junkman", "at": [96, 152] } },
                {
                  "narrate": [
                    "Sal comes in his van with the rest of the sulphur candles and a coal shovel. You close the back room door on the two of them and stand in the shop with your hands over your ears.",
                    "It takes eleven minutes. Then Sal comes out, coughing, with the shovel over his shoulder, and asks if you've got anything to drink."
                  ]
                },
                { "say": "sal", "text": "That's done. Tomorrow I'll do the loft. Father says the Lord won't mind. The Lord didn't have to look at her." },
                { "edit": "cab", "set": { "questKey": false, "nosale": false } },
                { "rep": 3, "why": "Rid the town of the spiders" },
                { "set": { "cabinetEnd": "gassed" } },
                { "remove": "sal" }
              ]
            }
          ]
        },
        {
          "if": "flag.cabinetEnd != 'gassed'",
          "note": "The cat or Dr. Ladd: either way, he comes to take her.",
          "then": [
            { "enter": { "id": "ladd", "cast": "ladd", "at": [96, 152] }, "if": "!ladd" },
            {
              "say": "ladd",
              "text": [
                "There. There she is. She's very old, you know. She's probably the oldest thing in this town.",
                "I'll take her up to the Grange Hall on Saturday, with the papers and the photographs, and Father Ignatius, and I'll show the whole town. Then they can decide what they think of their doctor."
              ]
            },
            {
              "if": "cab",
              "then": [
                { "take": "cab" },
                { "refresh": "panel" },
                { "coin": 150, "why": "Dr. Ladd bought back the Pryne cabinet, and its occupant" }
              ]
            },
            { "rep": 5, "why": "Cleared the doctor's name" },
            { "set": { "cabinetEnd": "cleared" } },
            { "remove": "ladd" }
          ]
        },
        { "set": { "cabinetDone": true } }
      ]
    }
  },
  "beats": [
    { "drift": "cabinet-hook", "from": "1-2", "to": "1-4", "cast": "ladd", "scene": "laddCabinet" },
    { "drift": "cabinet-hester", "from": "1-5", "to": "2-2", "cast": "hester", "scene": "hesterPryne", "if": "flag.cabinetIn && !flag.cabinetDone" },
    { "drift": "cabinet-faint", "from": "2-1", "to": "2-3", "cast": "bettany", "scene": "bettanyFaints", "if": "flag.cabinetIn && !flag.cabinetDone" },
    { "drift": "cabinet-choir", "from": "2-2", "to": "2-4", "cast": "ignatius", "scene": "ignatiusChoir", "if": "flag.cabinetIn && !flag.cabinetDone" },
    { "drift": "cabinet-vance", "from": "3-2", "to": "3-5", "cast": "vance", "scene": "vanceOffer", "if": "flag.cabinetIn && !flag.cabinetDone && hook.cabinetHere" }
  ],
  "nights": [
    {
      "id": "cabinet-surgery",
      "window": ["1-4", "2-3"],
      "if": "flag.cabinetIn && !flag.cabinetDone",
      "scene": "cabinetSurgery",
      "test": [{ "set": { "cabinetIn": true } }, { "add": { "unique": "specCabinet" } }]
    },
    {
      "id": "cabinet-nest",
      "window": ["2-4", "3-4"],
      "if": "flag.cabinetIn && !flag.cabinetDone && flag.cabinetChoir",
      "scene": "cabinetNest",
      "test": [
        { "set": { "cabinetIn": true, "cabinetChoir": true, "cabinetJar": true } },
        { "add": { "unique": "specJar" } }
      ]
    },
    {
      "id": "cabinet-finale",
      "window": ["4-1", "4-4"],
      "if": "flag.cabinetIn && !flag.cabinetDone && flag.cabinetNested",
      "scene": "cabinetFinale",
      "test": [
        { "set": { "cabinetIn": true, "cabinetNested": true, "cabinetPapers": true, "cabinetPhotos": true } },
        { "add": { "unique": "specCabinet" } }
      ]
    }
  ],
  "calendar": [
    { "id": "cabinet-surgery", "night": "cabinet-surgery", "story": "cabinet", "where": "Chapel Street", "title": "Dr. Ladd's papers", "known": "flag.cabinetIn", "scene": "cabinetSurgery" },
    {
      "id": "cabinet-nest",
      "night": "cabinet-nest",
      "story": "cabinet",
      "where": "Saint Brine's",
      "title": "The loft above the nave",
      "known": "flag.cabinetChoir",
      "scene": "cabinetNest",
      "bring": ["photo"]
    },
    { "id": "cabinet-finale", "night": "cabinet-finale", "story": "cabinet", "where": "Your back room", "title": "Closing time", "known": "flag.cabinetNested", "scene": "cabinetFinale" }
  ],
  "mornings": [
    {
      "if": "flag.cabinetStep && !flag.cabinetIn",
      "note": "You refused it: it's on your step in the morning anyway.",
      "then": [
        { "set": { "cabinetIn": true } },
        { "add": { "unique": "specCabinet" } },
        { "refresh": "panel" },
        { "narrate": "When you open up, the cabinet is on your step, under a tarp, with a note: \"I couldn't have it in the house another night. Keep it. Sell it. Burn it. C. Ladd.\" And under that: \"The papers are still here, if you want them. I'm up late.\"" }
      ]
    },
    {
      "if": "flag.cabinetIn && !flag.cabinetDone && hook.cabinetHere",
      "note": "The cobwebs: on the cabinet on the second morning, then on your stock on the fourth and seventh.",
      "then": [
        { "hook": "cobwebs", "sets": ["webs"] },
        { "toast": "A fresh cobweb across the cabinet's empty drawer. You wiped it last night.", "icon": "specCabinet", "if": "webs == 2" },
        { "hook": "webStock", "if": "webs == 4 || webs == 7", "with": "Cobwebs all over the {it.name|lower} overnight, thick as gauze. It won't look the same again." }
      ]
    }
  ],
  "epilogue": [
    {
      "line": { "if": "flag.cabinetCat", "then": "The queen lives under glass in Dr. Ladd's waiting room, and the town queues to see her. Mister Fathom visits on Tuesdays, and she won't come out while he's there.", "else": "The queen lives under new glass in Dr. Ladd's waiting room. The whole town has been in to look at her, and stayed for a check-up. Hollow Neck has a doctor." },
      "if": "flag.cabinetEnd == 'cleared'"
    },
    { "line": "Saint Brine's smells of struck matches until Easter. The town never quite forgave the new doctor for the spiders, and he moved to Worcester by Christmas.", "if": "flag.cabinetEnd == 'gassed'" },
    { "line": "The cobwebs left Hollow Neck the night the cabinet did. In Providence, a museum has closed its natural history wing \"for fumigation\".", "if": "flag.cabinetEnd == 'sold'" }
  ],
  "outcome": "flag.cabinetEnd"
});
