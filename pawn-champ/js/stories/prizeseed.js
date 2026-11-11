// Pawn Champ - The Prize Seed. Minor quest m62, batch L (docs/quests/MINOR.md#m62-the-prize-seed).
// Amos Haight paid $600 for one seed from last year's record pumpkin, and pawns it to pay for the
// forklift that swings his 1,400-pound pumpkin onto the scale. His rival Lorraine Ames wants the
// seed badly. The weigh-off is a vignette in the Harvest Fair hub ('fair', js/stories/freezer.js);
// if you never make it to the scale, Amos comes in for the seed afterwards.
// The weigh-off (the forklift, the scale and its readout) is drawn in js/quests/prizeseed.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/prizeseed.js.
defineStory({
  "id": "prizeseed",
  "months": [1],
  "kind": "minor",
  "title": "The Prize Seed",
  "location": "green",
  "rumour": "Amos Haight paid six hundred dollars for one pumpkin seed.",
  "endings": { "returned": "Back in the Ground", "sold": "Lorraine's Now", "judged": "Re-Weighed" },
  "outcome": "flag.seedEnd",
  "about": [
    "An October rivalry. Amos Haight pawns the $650 prize pumpkin seed from last year's record pumpkin to pay the forklift man at the Harvest Fair weigh-off, and warns you about Lorraine Ames (§{amosSeed}). Lorraine, second last year by four pounds, offers you double and hints that Amos weighs his pumpkin on the pallet (§{lorraineSeed}).",
    "At the weigh-off (§{weighOff}) give Amos his seed back out of the prize (Back in the Ground), sell it to Lorraine for $300 (Lorraine's Now), or ask for a re-weigh off the pallet, which makes Lorraine the winner and the two shake hands (Re-Weighed). If you skip the fair, Amos comes in afterwards for the seed (§{amosAfter}) and you choose between him and Lorraine."
  ],
  "cast": {
    "amos": {
      "name": "Amos Haight",
      "look": { "skin": "#e8c0a0", "hair": "#c8c0b0", "hs": 0, "coat": "#3a6a3a", "style": "jacket", "hat": "cap", "hatc": "#e8702a", "pants": "#4a4a3a", "beard": "#c8c0b0", "stout": true }
    },
    "lorraine": {
      "name": "Lorraine Ames",
      "look": { "skin": "#a87058", "hair": "#2a1e16", "hs": 3, "coat": "#a83a2a", "style": "puffer", "pants": "#2a2a30", "glasses": "#c8a050" }
    }
  },
  "icons": {
    "ringbox": [
      "............",
      "............",
      "...kkkkkk...",
      "..kvVVVVvk..",
      ".kvVVVVVVvk.",
      ".kkkkkkkkkk.",
      ".kvvvcpvvvk.",
      ".kvvvpcvvvk.",
      ".kvvvvvvvvk.",
      ".kvvvvvvvvk.",
      "..kkkkkkkk..",
      "............"
    ]
  },
  "uniques": {
    "prizeSeed": {
      "name": "Prize pumpkin seed in a ring box",
      "icon": "ringbox",
      "cat": "curio",
      "guide": 150,
      "questKey": true,
      "wantedBy": { "name": "Lorraine Ames", "mult": 2 },
      "wantedKnown": "flag.seedLorraine",
      "tells": [
        "One flat white seed on violet velvet, the size of a thumbnail.",
        "The lid is labelled in ballpoint: 1,611 HAIGHT. DO NOT EAT."
      ]
    }
  },
  "scenes": {
    "amosSeed": {
      "title": "Amos Haight pawns his prize seed",
      "customer": "amos",
      "steps": [
        {
          "say": "amos",
          "text": [
            "Amos Haight. You'll have heard I paid six hundred dollars for a seed. That's a lie. It was six-fifty.",
            "It came out of last year's record pumpkin. Sixteen hundred and eleven pounds. This year's is bigger, and the forklift man wants cash before he'll lift it onto the scale at the fair.",
            "So I need a hundred and fifty, and somebody I trust to hold this. Don't let Lorraine Ames near it. She has a cousin who can pick locks."
          ]
        },
        { "offer": { "unique": "prizeSeed" }, "persona": "desperate", "asking": 150, "min": 110 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "amos", "text": "Then I'm rolling it onto the scale myself. It's fourteen hundred pounds. I have a bad back. I'll manage." },
            { "leave": "amos" },
            { "end": true }
          ]
        },
        { "set": { "seedIn": true } },
        { "say": "amos", "text": "The weigh-off's at the Harvest Fair. I'll buy it back once I've won. Plant it in April. That's the deal." },
        { "leave": "amos" }
      ]
    },
    "lorraineSeed": {
      "title": "Lorraine Ames would pay double",
      "customer": "lorraine",
      "steps": [
        { "set": { "seedLorraine": true } },
        {
          "say": "lorraine",
          "text": [
            "Lorraine Ames. Ames Farm, Route 9. Second place last year by four pounds, which is a grapefruit.",
            "You have Amos's seed. Everyone knows. He told the whole Clam Shack line. If you ever want to sell it, I'll pay double what he paid you. Not out of spite. Mostly out of spite.",
            "And watch that scale at the weigh-off. Last year he weighed his on the pallet. I'm just saying."
          ]
        },
        { "leave": "lorraine" }
      ]
    },
    "weighOff": {
      "title": "The giant-pumpkin weigh-off at the Harvest Fair",
      "steps": [
        { "hook": "toWeighOff" },
        { "enter": { "id": "amos", "cast": "amos", "at": [64, 164] } },
        { "enter": { "id": "lorraine", "cast": "lorraine", "at": [236, 160], "facingLeft": true } },
        { "narrate": "Behind the bandstand there's a forklift, a platform scale, a crowd, and on the forks a pumpkin the size of a small car. It is very, very orange." },
        { "say": "amos", "text": "Easy! EASY! Mind her, she bruises!" },
        { "hook": "weigh", "with": "1412" },
        { "narrate": "The readout says one thousand four hundred and twelve. Amos throws his cap in the air. Lorraine looks at the pallet, then at you." },
        { "say": "lorraine", "text": "He's done it again. That's the pallet. Everyone can see that's the pallet. Is anyone going to say anything?" },
        { "find": "seed", "in": "stock", "match": { "uniqueId": "prizeSeed" } },
        {
          "if": "seed",
          "then": [
            {
              "choose": [
                {
                  "label": "Give Amos his seed back",
                  "hint": "(he pays the loan back out of the prize, $180)",
                  "then": [
                    { "take": "seed" },
                    { "set": { "seedEnd": "returned" } },
                    { "coin": 180, "why": "Amos bought back his prize seed" },
                    { "rep": 2 },
                    { "say": "amos", "text": "Back in the box, back in the drawer, back in the ground in April. You're a good egg. A good seed." },
                    { "say": "lorraine", "text": "I'll beat you with an ordinary seed, Amos. That'll be worse for you." }
                  ]
                },
                {
                  "label": "Sell it to Lorraine",
                  "hint": "($300)",
                  "then": [
                    { "sell": "seed", "to": "lorraine" },
                    { "set": { "seedEnd": "sold" } },
                    { "coin": 300, "why": "Sold the prize seed to Lorraine Ames" },
                    { "say": "lorraine", "text": "Thank you. I'm going to name the pumpkin after you. Not in a nice way. In a grateful way." },
                    { "say": "amos", "text": "That's my record. That's my seed. She'll grow it on Route 9 out of SPITE." }
                  ]
                },
                {
                  "label": "Ask them to weigh it again, off the pallet",
                  "then": [
                    { "take": "seed" },
                    { "set": { "seedEnd": "judged" } },
                    { "narrate": "The forklift sets the pumpkin down again, slowly, on bare scale this time. The pallet goes on its own. Forty-four pounds of oak." },
                    { "hook": "bare" },
                    { "narrate": "One thousand three hundred and sixty-eight. Lorraine's, waiting its turn, goes on next: one thousand three hundred and ninety. The crowd makes the noise a crowd makes at a pumpkin." },
                    { "say": "lorraine", "text": "Twenty-two pounds. I'll take it. Amos. Shake my hand." },
                    { "say": "amos", "text": "Fine. Fine. You can have half the seeds out of this one. I'll keep the old one. Hold on to it for me till spring." },
                    { "coin": 150, "why": "Amos paid back the loan on the seed" },
                    { "rep": 3 }
                  ]
                }
              ]
            }
          ],
          "else": [{ "say": "amos", "text": "You haven't got it? Then who has? LORRAINE." }]
        },
        { "remove": "amos" },
        { "remove": "lorraine" },
        { "hook": "fromWeighOff" }
      ]
    },
    "amosAfter": {
      "title": "Amos comes in for his seed after the fair",
      "customer": "amos",
      "steps": [
        {
          "say": "amos",
          "text": [
            "Fourteen hundred and twelve pounds! First place! There was some business about a pallet. Nothing came of it.",
            "Now. My seed. Lorraine says she offered you double. Did she? She did. Of course she did."
          ]
        },
        { "find": "seed", "in": "stock", "match": { "uniqueId": "prizeSeed" } },
        {
          "if": "seed",
          "then": [
            {
              "choose": [
                {
                  "label": "Give Amos his seed back",
                  "hint": "($160)",
                  "then": [
                    { "take": "seed" },
                    { "set": { "seedEnd": "returned" } },
                    { "coin": 160, "why": "Amos bought back his prize seed" },
                    { "rep": 2 },
                    { "say": "amos", "text": "Back in the box, back in the drawer, back in the ground in April. You're a good egg. A good seed." }
                  ]
                },
                {
                  "label": "Sell it to Lorraine",
                  "hint": "($300)",
                  "then": [
                    { "sell": "seed", "to": "lorraine" },
                    { "set": { "seedEnd": "sold" } },
                    { "coin": 300, "why": "Sold the prize seed to Lorraine Ames" },
                    { "say": "amos", "text": "That's my record. That's my seed. She'll grow it on Route 9 out of SPITE." },
                    { "narrate": "Lorraine pays cash at your counter that afternoon and leaves before you've finished counting it." }
                  ]
                }
              ]
            }
          ],
          "else": [{ "say": "amos", "text": "You haven't got it? Then who has? LORRAINE." }]
        },
        { "leave": "amos" }
      ]
    }
  },
  "beats": [
    { "drift": "prizeseed", "from": "1-2", "to": "2-1", "cast": "amos", "scene": "amosSeed" },
    { "drift": "prizeseed-lorraine", "from": "1-4", "to": "2-1", "cast": "lorraine", "scene": "lorraineSeed", "if": "flag.seedIn && !flag.seedLorraine" },
    { "drift": "prizeseed-after", "from": "3-2", "to": "4-2", "cast": "amos", "scene": "amosAfter", "if": "flag.seedIn && !flag.seedEnd && hook.held" }
  ],
  "vignettes": [
    { "hub": "fair", "label": "The giant-pumpkin weigh-off", "scene": "weighOff", "if": "flag.seedIn && !flag.seedEnd" }
  ],
  "epilogue": [
    { "line": "Amos Haight's prize seed is in a drawer on his farm, waiting for April.", "if": "flag.seedEnd == 'returned'" },
    { "line": "Lorraine Ames has the Haight seed. Amos has a new sign at the end of his drive: NOT FOR SALE TO AMES.", "if": "flag.seedEnd == 'sold'" },
    { "line": "The fair committee bought a new pallet rule. They call it the Haight amendment. Amos calls it something else.", "if": "flag.seedEnd == 'judged'" }
  ],
  "talk": {
    "by": "mercy",
    "rumour": [
      "Amos Haight is telling the whole Grange he paid six hundred dollars for one pumpkin seed. One seed. For the giant pumpkin weigh-off at the fair.",
      "Lorraine Ames has won the weigh-off four years running. She was at the supper. She asked for the salt in a voice I'd call dangerous."
    ],
    "react": { "returned": "Amos has his seed back, I hear. He's building it a little greenhouse. For a seed. In October. I've lent him a heater.", "sold": "Lorraine Ames has the Haight seed. Amos sat at the far end of the Grange table and passed nothing all night. Not even the bread.", "judged": "Pallet off, Lorraine won by twenty-two pounds. They shared a basket of fries after, at Dot's. Didn't speak. Shared it. That's the Grange for you." }
  }
});
