// Pawn Champ - The Evidence Room: something on your shelf came out of Captain Barrow's evidence
// cage. Minor quest m23, batch D (docs/quests/MINOR.md#m23-the-evidence-room).
// Officer Dunphy is a regular (js/town.js).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "evidence",
  "kind": "minor",
  "title": "The Evidence Room",
  "location": "police",
  "rumour": "Barrow's in a mood. Something's gone missing from the station.",
  "endings": { "clean": "Clean House", "recall": "Can't Recall" },
  "outcome": "flag.evidenceEnd",
  "about": [
    "Captain Barrow comes in off duty and spots something on your shelf with her own police evidence tag on the back (§{barrowEvidence}): someone walked it out of the station's evidence cage and sold it to you. She asks to take it, quietly, and to have you at the station at lunch to go through the log. Say you can't remember who sold it and it's marked as hot (Can't Recall).",
    "At the station (§{evidenceLog}) the log shows the case signed out by K.D., and young Officer Dunphy is very busy by the coffee machine. A look in his direction gets him caught, wins Barrow's favour and a friend at the station who keeps your police heat down (Clean House), and at Town Meeting she asks for a new evidence-room lock (§{evidenceBudget}). Claiming you can't remember, or failing to turn up, costs heat (Can't Recall)."
  ],
  "cast": {
    "barrowQuiet": {
      "name": "Captain Barrow, off duty",
      "look": { "skin": "#7a5038", "hair": "#1a1210", "hs": 3, "coat": "#5a4a3a", "trim": "#e8e0c8", "style": "jacket", "hat": "cap", "hatc": "#22305a", "band": "#e2c04a", "pants": "#2a2a3a" }
    }
  },
  "scenes": {
    "barrowEvidence": {
      "title": "Captain Barrow, off duty, finds her evidence tag on your shelf",
      "customer": "barrow",
      "steps": [
        {
          "find": "it",
          "in": "stock",
          "match": { "held": false, "nosale": false, "unique": false, "fake": false, "noticeId": false },
          "note": "An ordinary thing on your shelf that turns out to have come out of the evidence cage."
        },
        {
          "if": "!it",
          "then": [
            { "say": "barrow", "text": "Just looking. Professionally." },
            { "leave": "barrow" },
            { "end": true }
          ]
        },
        {
          "say": "barrow",
          "text": [
            "Not here as a cop. Officially I'm buying a birthday present.",
            "You'll have heard I'm in a mood. I am. Something's gone missing from the station. Several somethings.",
            "That {it.name|lower}. Turn it over for me."
          ]
        },
        { "view": { "counterIcon": "{it.icon}" } },
        { "narrate": "On the back, almost rubbed away: the outline of a sticker, and a few printed digits. HNPD EVID 26-04..." },
        { "say": "barrow", "text": "That's my evidence tag. Somebody walked it out of my cage and sold it to you. I need to borrow it. Quietly. And I need you at the station at lunch tomorrow to go through the log with me." },
        {
          "choose": [
            {
              "label": "Hand it over and say you'll come",
              "hint": "(she'll pay what you paid)",
              "then": [
                { "view": { "counterIcon": null } },
                { "take": "it" },
                { "hook": "remember", "note": "flag.evidenceItem: its name, and what you paid (half its guide if nothing)" },
                { "say": "barrow", "text": "Thank you. I won't forget it." },
                { "plan": "evidence-log" }
              ]
            },
            {
              "label": "\"I bought it from someone. Can't remember who.\"",
              "hint": "(heat +6)",
              "then": [
                { "view": { "counterIcon": null } },
                { "set": { "evidenceEnd": "recall" } },
                { "edit": "it", "set": { "stolen": true, "knownHot": true } },
                { "heat": 6 },
                { "say": "barrow", "text": "Funny how that goes. Everybody's memory is terrible this week. Keep it, then. I know where it is." }
              ]
            }
          ]
        },
        { "leave": "barrow" }
      ]
    },
    "evidenceLog": {
      "title": "Lunch at the station: the evidence log",
      "steps": [
        {
          "stage": "police",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 166] },
            { "id": "barrow", "cast": "barrow", "at": [196, 160], "facingLeft": true },
            { "id": "dunphy", "cast": "dunphy", "at": [262, 154], "facingLeft": true }
          ]
        },
        { "narrate": "Hollow Neck Police, lunchtime. Barrow has the evidence log open on the counter and your {flag.evidenceItem.name|lower|or:thing} in a plastic bag beside it. By the coffee machine, a young officer is very busy not looking at you." },
        {
          "say": "barrow",
          "text": [
            "Case 26-04. Signed out for \"lab review\" three weeks ago. We haven't got a lab. Initials K.D.",
            "Now. The person who sold this to you. Anyone you'd recognise?"
          ]
        },
        {
          "choose": [
            {
              "label": "Give Kenny Dunphy a look that says: tell her yourself",
              "if": "standing.dunphy >= 2",
              "hint": "(he likes you)",
              "note": "story moment (police): Dunphy is warm or a friend, so he owns up rather than make you point at him",
              "then": [
                { "set": { "evidenceEnd": "clean", "evidenceClean": true } },
                { "heat": -10 },
                { "hook": "payBack", "note": "Barrow pays back what you paid ($20 if nobody knows)" },
                { "say": "dunphy", "text": "Captain. It was me. K.D. It was going to be thrown out anyway, and I needed the money for my mom's boiler. I'll get my coat." },
                {
                  "say": "barrow",
                  "text": [
                    "Sit DOWN, Kenny. Parking duty till Easter, and you'll pay it back.",
                    "And you. You knew, and you let him say it himself. I owe you one. So does he."
                  ]
                },
                { "sway": "dunphy", "by": 1, "why": "Let him own up to Barrow himself" }
              ]
            },
            {
              "label": "Look at the officer by the coffee machine, then back at Barrow",
              "then": [
                { "set": { "evidenceEnd": "clean", "evidenceClean": true } },
                { "heat": -10 },
                { "hook": "payBack", "note": "Barrow pays back what you paid ($20 if nobody knows)" },
                { "say": "dunphy", "text": "It was going to be thrown out anyway! Nobody ever comes back for... okay. Okay. I'll get my coat." },
                {
                  "say": "barrow",
                  "text": [
                    "Sit DOWN, Kenny.",
                    "I owe you one. I don't say that often. Ask anyone. Don't ask anyone."
                  ]
                }
              ]
            },
            {
              "label": "\"I really can't remember, Captain.\"",
              "then": [
                { "set": { "evidenceEnd": "recall" } },
                { "heat": 4 },
                { "say": "barrow", "text": "No. Of course not. It's going round, this forgetting." },
                {
                  "if": "foe.police",
                  "note": "story moment (police): an enemy on the force points at you first",
                  "then": [
                    { "say": "dunphy", "text": "Funny, Captain. That shop buys a lot of things nobody can remember buying. Just saying." },
                    { "say": "barrow", "text": "Thank you, Officer. Noted. Both of you." },
                    { "heat": 4, "why": "Officer Dunphy pointed at you first" }
                  ],
                  "else": [
                    { "narrate": "Officer Dunphy lets out a breath he has been holding since you walked in." }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "evidenceBudget": {
      "title": "Town Meeting, Article 6: the police budget",
      "steps": [
        {
          "narrate": [
            "Article 6: the police budget. Captain Barrow asks for \"a new lock for the evidence room, and a better class of padlock in general\". She doesn't look at you. She doesn't need to.",
            "It passes. Officer Dunphy, now on parking duty, is not present."
          ]
        },
        { "rep": 1 }
      ]
    }
  },
  "beats": [
    { "drift": "evidence", "from": "2-1", "to": "4-2", "cast": "barrowQuiet", "scene": "barrowEvidence", "if": "hook.candidate" }
  ],
  "errands": [
    {
      "id": "evidence-log",
      "title": "Captain Barrow's evidence log",
      "where": "the police station",
      "scene": "evidenceLog",
      "test": [{ "set": { "evidenceItem": { "name": "Gold ring", "paid": 30 } } }]
    }
  ],
  "vignettes": [
    { "hub": "meeting", "label": "Article 6: the police budget", "if": "flag.evidenceEnd == 'clean'", "scene": "evidenceBudget" }
  ],
  "calendar": [
    { "id": "evidence-log", "errand": "evidence-log", "story": "evidence", "where": "The police station", "title": "Barrow's evidence log", "known": "flag.evidenceItem" }
  ],
  "mornings": [
    { "hook": "friendAtTheStation", "if": "flag.evidenceClean && heat > 0", "note": "a friend at the station: heat keeps falling by 2 a day for the rest of the run" },
    {
      "if": "flag.evidenceItem && !flag.evidenceEnd && hook.stoodUp",
      "note": "stood her up at lunch",
      "then": [
        { "set": { "evidenceEnd": "recall" } },
        { "heat": 4 },
        { "toast": "Captain Barrow waited for you at lunch yesterday. She noticed.", "look": "barrow" }
      ]
    }
  ]
});
