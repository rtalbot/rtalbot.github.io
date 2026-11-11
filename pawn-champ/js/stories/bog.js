// Pawn Champ - The Cranberry Bog. Minor quest m36, batch J (docs/quests/MINOR.md).
// Heard from Hal Mayhew. Cyril Bourne pawns his grandfather's harvest scoop to make payroll and asks
// you out to see the flooded bog at dawn: a quest night, played as the next morning before you open.
// The place is its own: the bog at dawn (bogDawn), at the inland edge of Hob's Marsh.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/bog.js.
defineStory({
  "id": "bog",
  "kind": "minor",
  "title": "The Cranberry Bog",
  "location": "marsh",
  "rumour": "Cyril Bourne's cranberry bog is flooding for the harvest, and he can't make payroll.",
  "endings": { "stake": "A Share of the Harvest", "dike": "Holding the Dike", "sold": "The Last Scoop" },
  "about": [
    "A short harvest story. Hal mentions that Cyril Bourne's cranberry bog dike is weeping just as he floods for the harvest, and he can't make payroll until the co-op pays (§{halBog}). Cyril pawns his grandfather's cranberry scoop for $35 and invites you to see the bog at dawn (§{amosScoop}).",
    "At dawn (§{bogDawn}) the bog is red from the dike to the pines, and the dike is seeping. Put $80 into the harvest for a share (A Share of the Harvest), carry sandbags with the crew (Holding the Dike), or buy the scoop outright (The Last Scoop). The co-op pays out in week 4, when he redeems the scoop."
  ],
  "notes": "The loan is $35; Cyril redeems it for $46 on the Tuesday of week 4, when the co-op pays.",
  "cast": {
    "cyril": {
      "name": "Cyril Bourne",
      "look": { "skin": "#c89878", "hair": "#8a8a8a", "hs": 1, "coat": "#8a2a2a", "style": "vest", "vest": "#3a3a2a", "pants": "#3a4a5a", "hat": "cap", "hatc": "#2a3a2a", "beard": "#8a8a8a" }
    }
  },
  "icons": {
    "scoop": [
      "............",
      "..kkkkkkk...",
      ".kWWWWWWWk..",
      ".kWkkkkkWk..",
      ".kW.....Wkk.",
      ".kW.....WkWk",
      ".kWwwwwwWkWk",
      ".kWwkwkwWkk.",
      ".kwk.k.k.k..",
      ".kwk.k.k.k..",
      "..k..k..k...",
      "............"
    ]
  },
  "uniques": {
    "bogScoop": {
      "name": "Bourne's cranberry scoop",
      "icon": "scoop",
      "cat": "curio",
      "guide": 45,
      "questKey": true,
      "condLabel": "Tines worn to points",
      "tells": [
        "A wooden harvest scoop with long cedar tines, for combing berries off the vines by hand.",
        "Burned into the back: E. BOURNE 1911. The handle is dark where three generations held it."
      ]
    }
  },
  "overheard": [
    { "line": "\"Bourne's flooding the bog this week. Prettiest thing you'll ever see. At five in the morning, mind.\"" }
  ],
  "scenes": {
    "halBog": {
      "title": "Hal mentions Cyril Bourne's dike",
      "customer": "hal",
      "steps": [
        {
          "say": "hal",
          "text": [
            "Sold Cyril Bourne a pump gasket and forty sandbags this morning. His bog dike's weeping, and he floods for the harvest this week.",
            "Four hands on the crew and no payroll till the co-op pays out. He asked me where you were. I said Water Street, same as always."
          ]
        },
        { "set": { "bogHeard": true } },
        { "leave": "hal" }
      ]
    },
    "amosScoop": {
      "title": "Cyril Bourne pawns his grandfather's scoop",
      "customer": "cyril",
      "steps": [
        { "say": "cyril", "text": "Cyril Bourne. Bourne's Bog, out past the marsh road. My grandfather's scoop, from before the machines." },
        { "view": { "counterIcon": "scoop" } },
        { "say": "cyril", "text": "I need $35 till the co-op pays, for the crew. They've got families. I'll redeem it at the end of the month, with what's fair on top." },
        {
          "choose": [
            { "label": "Lend him $35 on the scoop", "hint": "(a pawn)" },
            {
              "label": "\"Not today, Mr. Bourne.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "cyril", "text": "No. Well. Somebody will." },
                { "leave": "cyril" },
                { "end": true }
              ]
            }
          ]
        },
        { "view": { "counterIcon": null } },
        { "add": { "unique": "bogScoop", "paid": 35 } },
        { "coin": -35, "why": "Lent $35 to Cyril Bourne against a cranberry scoop" },
        { "refresh": "panel" },
        { "set": { "bogPawned": true } },
        { "say": "cyril", "text": "Come out and see it. We flood {placed:bog-dawn} night, and at dawn the whole bog comes up red. You won't see anything like it, and I'd like somebody to." },
        { "toast": "Calendar: Bourne's Bog, at dawn after {placed:bog-dawn}", "look": "cyril" },
        { "leave": "cyril" }
      ]
    },
    "bogDawn": {
      "title": "The bog at dawn",
      "steps": [
        {
          "stage": "bogDawn",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [132, 172] },
            { "id": "cyril", "cast": "cyril", "at": [176, 171], "facingLeft": true }
          ]
        },
        { "set": { "bogSeen": true } },
        { "narrate": "Five in the morning, before you open. The bog has been flooded overnight, and every berry has come loose from the vines and floated up. It's red from the dike to the pines, and steaming." },
        { "say": "cyril", "text": "There. Worth getting up for. My grandfather did this with that scoop and his knees." },
        { "narrate": "Then he shows you the dike. Where the road crosses it, the bank is weeping: a thin sheet of water across the sand, and the sandbags already darkening." },
        { "say": "cyril", "text": "If that goes before we've boomed the berries in, the whole crop goes down the ditch to the marsh. And the co-op pays on weight." },
        {
          "choose": [
            {
              "label": "Put money in the harvest for a share",
              "hint": "(-$80 now, a share when the co-op pays)",
              "disabled": "coin < 80",
              "then": [
                { "coin": -80, "why": "Bought a share of the Bourne cranberry harvest" },
                { "set": { "bogEnd": "stake" } },
                { "say": "cyril", "text": "A partner. My grandfather never had a partner. He'd have hated it. Shake." },
                { "narrate": "The crew booms the berries in by seven, and the trucks start rolling by nine." }
              ]
            },
            {
              "label": "Pick up a sandbag",
              "hint": "(rep +3)",
              "then": [
                { "set": { "bogEnd": "dike" } },
                { "rep": 3, "why": "Held the Bourne dike" },
                { "narrate": "You spend two hours in the cold passing sandbags down a line of strangers. By eight the seep has stopped. Your hands won't close properly until lunchtime." },
                { "say": "cyril", "text": "That's a debt. I don't forget a debt. Ask anybody." }
              ]
            },
            {
              "label": "Offer to buy the scoop outright",
              "hint": "(+$30 to him; it's yours to sell)",
              "then": [
                { "find": "scoop", "in": "stock", "match": { "uniqueId": "bogScoop" } },
                { "coin": -30, "why": "Bought Cyril Bourne's scoop outright" },
                { "edit": "scoop", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel", "if": "scoop" },
                { "set": { "bogEnd": "sold" } },
                { "say": "cyril", "text": "Thirty. Fine. It's a museum piece anyway. I'll tell you a secret: next year I'm selling to the juice company. My knees are done." }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "bog-hal", "from": "1-3", "to": "1-5", "cast": "hal", "scene": "halBog" },
    { "drift": "bog-cyril", "from": "2-1", "to": "2-3", "cast": "cyril", "scene": "amosScoop", "if": "flag.bogHeard" }
  ],
  "nights": [
    {
      "id": "bog-dawn",
      "window": ["2-2", "3-3"],
      "if": "flag.bogPawned && !flag.bogEnd",
      "scene": "bogDawn",
      "test": [
        { "set": { "bogPawned": true } },
        { "hook": "setCoin", "with": 200 },
        { "add": { "unique": "bogScoop", "paid": 35 } }
      ]
    }
  ],
  "calendar": [
    { "id": "bog-dawn", "night": "bog-dawn", "story": "bog", "where": "Bourne's Bog", "title": "The bog at dawn", "known": "flag.bogPawned", "scene": "bogDawn" }
  ],
  "mornings": [
    {
      "if": "week == 4 && day == 2 && !flag.bogPaid && flag.bogPawned",
      "note": "the co-op pays: Cyril redeems the scoop, and pays out a share if you bought one",
      "then": [
        { "set": { "bogPaid": true } },
        { "find": "scoop", "in": "stock", "match": { "uniqueId": "bogScoop", "questKey": true } },
        { "take": "scoop" },
        { "coin": 46, "why": "Cyril Bourne redeemed his scoop", "if": "scoop" },
        { "coin": 140, "why": "Your share of the Bourne cranberry harvest", "if": "flag.bogEnd == 'stake'" },
        {
          "toast": { "if": "flag.bogEnd == 'stake'", "then": "The co-op paid out. Cyril Bourne left your share in an envelope, and a bag of berries.", "else": "Cyril Bourne came by early for his scoop. The co-op paid out." },
          "look": "cyril",
          "icon": "scoop",
          "if": "scoop || flag.bogEnd == 'stake'"
        },
        { "refresh": "panel" }
      ]
    }
  ],
  "epilogue": [
    { "line": "Cyril Bourne sends a bag of cranberries to the shop every week of the winter, with a note: \"Partner.\"", "if": "flag.bogEnd == 'stake'" },
    { "line": "The Bourne dike held. Cyril tells the story at the Rusty Anchor with you in it, a little taller each time.", "if": "flag.bogEnd == 'dike'" },
    { "line": "Bourne's Bog goes to the juice company next spring. Cyril says his knees have never been happier, and looks at the scoop in your window when he passes.", "if": "flag.bogEnd == 'sold'" }
  ],
  "talk": {
    "by": "mercy",
    "rumour": [
      "Cyril Bourne's dike is weeping, and he floods for the harvest this week. He's bought every sandbag Hal had. The co-op doesn't pay till the end of the month. He's too proud to ask the Grange."
    ],
    "react": { "stake": "Cyril Bourne told the whole Grange supper he's got a partner now. He said it like a man who's been given a medal. Then he had thirds.", "dike": "You carried sandbags on the Bourne dike, I hear. In those shoes. The Grange is talking about you over the beans. Kindly, for once.", "sold": "Cyril Bourne's selling to the juice company next year. Another bog gone to a company. The Grange held a minute's silence. It was a long minute." },
    "sway": { "stake": { "mercy": 2, "hal": 1 }, "dike": { "mercy": 2 }, "sold": { "mercy": -1 } }
  },
  "outcome": "flag.bogEnd"
});
