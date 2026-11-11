// Pawn Champ - Wren's Winter: the sequel to M7 The Museum Job (docs/quests/SEQUELS.md#wrens-winter).
// Batch U, round 3. Drawn in a later month of a stay, only if The Museum Job ended The Swap or
// Wren in Cuffs.
//
// The Swap      In Providence somebody finally looked closely at the crown under glass. It's Dr. Lusk's
//               paste tiara, the one she sold you in October. Greer Ashby, for the insurers, comes to
//               the counter; then Wren is back in town, on the Green in the dark, with a plan.
// Wren in Cuffs Wren's trial is in the district court, which sits upstairs in Town Hall on Tuesdays,
//               and her lawyer has put you on the witness list.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/wrenwinter.js.
defineStory({
  "id": "wrenwinter",
  "kind": "minor",
  "title": "Wren's Winter",
  "location": "townhall",
  "sequel": "museum",
  "after": ["swap", "cuffs"],
  "months": [2, 3, 4, 5],
  "rumour": "The Lantern Queen's crown is in the papers again.",
  "teaser": "The Gazette has the Lantern Queen's crown on page three again, under a headline with a question mark in it.",
  "endings": { "turned": "The Buyer's Name", "gone": "Out of Town", "sold": "Sold Out", "straight": "Under Oath", "spoke": "A Character Witness", "absent": "Empty Chair" },
  "about": [
    "A winter sequel to The Museum Job, which runs one of two ways depending on how that ended. If Wren got away with the swap, insurance investigator Greer Ashby comes in: the crown that went to Providence is paste, and you were one of three dealers who handled it (§{wwHook}). That night Wren leaves a note asking to meet on the Green. If Wren was arrested, her lawyer Odessa Penhallow tells you you're a witness in Commonwealth v. Wren.",
    "On the Green (§{wwNight}) give Ashby the real buyer, the Gilded Hand (The Buyer's Name), lend Wren $100 for the bus to Montreal (Out of Town), or turn Wren in for the reward (Sold Out). At the trial in Town Hall, tell it straight (Under Oath), tell it straight and then speak for her (A Character Witness), or don't turn up and let the case fall over (Empty Chair)."
  ],
  "notes": "Which way it goes is how The Museum Job ended: Wren in Cuffs (ended.museum == 'cuffs') is the trial at Town Hall; anything else (The Swap) is Greer Ashby, then Wren on the Green.",
  "cast": {
    "ashby": {
      "name": "Greer Ashby",
      "look": { "skin": "#e8c8b0", "hair": "#c8a050", "hs": 3, "coat": "#3a4a5a", "trim": "#c8c8c8", "style": "jacket", "long": true, "pants": "#2a2a32", "glasses": "#2a2a2e", "bag": "#5a3a24" }
    },
    "penhallow": {
      "name": "Odessa Penhallow",
      "look": { "skin": "#6a4430", "hair": "#1a1210", "hs": 3, "coat": "#2a2a3a", "trim": "#e8e0c8", "style": "suit", "long": true, "pants": "#1e1e28", "glasses": "#c8a050", "bag": "#1a1a1a" }
    }
  },
  "uniques": {
    "wrenSubpoena": {
      "name": "Subpoena, Commonwealth v. Wren",
      "icon": "letter",
      "cat": "curio",
      "guide": 0,
      "questKey": true,
      "tells": [
        "\"You are hereby commanded to appear and give evidence.\" The date is underlined twice, by hand, by somebody who has met you."
      ]
    }
  },
  "scenes": {
    "wwHook": {
      "title": "The insurers' investigator, or Wren's lawyer",
      "customer": "visitor",
      "steps": [
        {
          "if": "ended.museum != 'cuffs'",
          "then": [
            {
              "say": "visitor",
              "text": [
                "Greer Ashby. I find things for the people who insured them. The Lantern Queen's crown went on to Providence in October, and in Providence somebody finally looked at it closely.",
                "It's paste. Foil-backed glass on brass. Dr. Lusk recognized it at once: it's her late aunt's tiara, which she sold to three dealers on Front Street as a test. You were the third."
              ]
            },
            {
              "choose": [
                {
                  "label": "\"I sold it on. I don't remember who to.\"",
                  "then": [
                    { "say": "visitor", "text": "Of course. I'm at the Motor Inn. I'm very patient. It's the main qualification." }
                  ]
                },
                {
                  "label": "\"Ask the Historical Society about their guard.\"",
                  "then": [
                    { "say": "visitor", "text": "Of course. I'm at the Motor Inn. I'm very patient. It's the main qualification." }
                  ]
                },
                {
                  "label": "\"I'd like to help, if I can.\"",
                  "then": [
                    { "set": { "wwHelpful": true } },
                    { "say": "visitor", "text": "Good. People who want to help usually know something. Here's my card. I'm at the Motor Inn." }
                  ]
                }
              ]
            },
            { "set": { "wwKnown": true } },
            { "leave": "visitor" },
            { "narrate": "That evening there's a folded note under the shop door, in pencil, in a hand you know. \"The Green. {placed:ww-night}, after dark. Bring nothing. W.\"" },
            { "toast": "Calendar: the Green after dark, {placed:ww-night}", "look": "wren" }
          ],
          "else": [
            { "say": "visitor", "text": "Odessa Penhallow. I'm defending Wren, God help me. She won't tell me her surname. She says she hasn't used it since 2009." },
            { "view": { "counterIcon": "letter" } },
            {
              "say": "visitor",
              "text": [
                "The prosecution has you down as a witness: something about a tip, or a job, or you just being in the wrong place in October. I don't know what you'll say. Nobody does. That's why you're interesting.",
                "District court sits in the upstairs hall at Town Hall. {placed:ww-night}. Wear something with a collar."
              ]
            },
            { "view": { "counterIcon": null } },
            { "add": { "unique": "wrenSubpoena" }, "if": "shelf.free" },
            { "refresh": "panel" },
            { "set": { "wwKnown": true } },
            { "toast": "Calendar: Commonwealth v. Wren, Town Hall, {placed:ww-night}", "look": "visitor" },
            { "leave": "visitor" }
          ]
        }
      ]
    },
    "wwNight": {
      "title": "Wren on the Green, or Commonwealth v. Wren",
      "music": "caper",
      "steps": [
        {
          "if": "ended.museum != 'cuffs'",
          "then": [
            {
              "stage": "greenNight",
              "actors": [
                { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
                { "id": "wren", "cast": "wren", "at": [180, 162], "facingLeft": true, "name": "Wren" }
              ]
            },
            {
              "narrate": { "if": "month >= 3 && month <= 5", "then": "Harbor Green after dark, the snow on the bandstand blue under the streetlamps. Wren is sitting on the back of a bench with her feet on the seat, eating chips out of a paper bag.", "else": "Harbor Green after dark. Wren is sitting on the back of a bench with her feet on the seat, eating chips out of a paper bag." }
            },
            {
              "say": "wren",
              "text": [
                "Partner. You've met Ashby. She's good. She'll find the crown in New York by March, and then she'll find the barge, and then me. And then you, because you're very findable. You have a sign.",
                "So. Three ways out of this, and I'm fine with any of them, which is a lie."
              ]
            },
            {
              "choose": [
                {
                  "label": "Give Ashby the buyer instead: Ms. Vantreece, and the barge with the gold hand on it",
                  "hint": "(the crown goes home)",
                  "then": [
                    { "say": "wren", "text": "The Hand. Oh, that's lovely. That's so much worse for them than for us. You'd make a terrible criminal. A good one, though." },
                    { "narrate": "Ashby takes it down in a notebook at the Motor Inn without blinking. Three weeks later the Lantern Queen's crown is found in a private collection in New York that isn't supposed to exist, with a Gilded Hand invoice in the box." },
                    { "set": { "wwEnd": "turned" } },
                    { "rep": 3 },
                    { "heat": -5 }
                  ]
                },
                {
                  "label": "Lend Wren a hundred dollars to be in Montreal by morning",
                  "hint": "(-$100)",
                  "disabled": "coin < 100",
                  "then": [
                    { "coin": -100, "why": "Lent Wren the bus fare to Montreal" },
                    { "say": "wren", "text": "I'll pay you back. I won't, but I'll mean to, and that's nearly the same." },
                    { "narrate": "She folds the bills into her glove, kisses you on the cheek, and walks off toward the bus station with the chip bag. Ashby checks out of the Motor Inn on Friday. She leaves her card on your counter anyway." },
                    { "set": { "wwEnd": "gone" } },
                    { "heat": 3 }
                  ]
                },
                {
                  "label": "Tell Ashby about Wren",
                  "hint": "(Ashby's reward: +$200)",
                  "then": [
                    {
                      "narrate": [
                        "You don't say it to Wren. You say it to Ashby the next morning, in the Motor Inn coffee shop, and she writes it down without blinking and pays you without counting.",
                        "They pick Wren up at the bus station that afternoon. She doesn't look surprised. She looks, through the window of the cruiser, at your shop, for about as long as it takes to drive past it."
                      ]
                    },
                    { "set": { "wwEnd": "sold" } },
                    { "coin": 200, "why": "The insurers' reward for Wren" },
                    { "rep": -2 },
                    { "heat": -6 }
                  ]
                }
              ]
            }
          ],
          "else": [
            {
              "stage": "townhall",
              "view": { "sign": "DISTRICT COURT IN SESSION" },
              "actors": [
                { "id": "you", "cast": "keeper", "name": "You", "at": [100, 166] },
                { "id": "penhallow", "cast": "penhallow", "at": [140, 164] },
                { "id": "wren", "cast": "wren", "at": [176, 164], "name": "Wren" },
                { "id": "barrow", "cast": "barrow", "at": [250, 160], "facingLeft": true }
              ]
            },
            { "narrate": "The upstairs hall at Town Hall, with the folding chairs set out in rows and a judge from Barnstable at the moderator's table. Wren sits beside her lawyer in a borrowed cardigan and looks exactly like someone who has never stolen a crown." },
            { "say": "barrow", "text": "You were at the Historical Society in October. Tell the court what you saw, and what you knew before you saw it." },
            { "narrate": "Wren doesn't look at you. She's looking at the window, where the weather is, very hard." },
            {
              "choose": [
                {
                  "label": "Tell it straight, all of it",
                  "hint": "(under oath)",
                  "then": [
                    { "narrate": "You tell it the way it happened. It takes eleven minutes. When you get to the part about the job, Wren closes her eyes, and then she opens them and gives you a nod, like a referee." },
                    { "say": "barrow", "text": "Thank you. That's all the Commonwealth needs." },
                    { "narrate": "Eighteen months, in Framingham. Penhallow says it could have been a great deal worse. Wren waves at you with her cuffed hands on the way out." },
                    { "set": { "wwEnd": "straight" } },
                    { "rep": 3 },
                    { "heat": -6 }
                  ]
                },
                {
                  "label": "Tell it straight, then ask to speak for her: first offence, and the crown went back",
                  "hint": "(a character witness)",
                  "then": [
                    { "narrate": "You tell it the way it happened. Then you ask if you can say one more thing, and the judge, who has a cold and wants to go home, lets you." },
                    { "say": "you", "text": "She didn't hurt anybody. The crown is back under glass. She's the only person in this town who has never once lied to me about what she was." },
                    { "say": "penhallow", "text": "No further questions. I couldn't have written that." },
                    { "narrate": "A suspended sentence and two hundred hours of community service, to be served at the Historical Society, under Dr. Lusk. Wren laughs out loud in court and has to apologize." },
                    { "set": { "wwEnd": "spoke" } },
                    { "rep": 1 },
                    { "heat": 2 }
                  ]
                },
                {
                  "label": "Don't go. Leave the chair empty.",
                  "hint": "(contempt of court: -$50)",
                  "then": [
                    {
                      "narrate": [
                        "You open the shop instead. At eleven, a constable comes in with a paper that says you owe the court fifty dollars and its patience. By noon it's done: without your evidence the case falls over, and Wren walks out of Town Hall into the weather.",
                        "That evening there's a single wrapped chocolate on your doorstep, the expensive kind, with a note: \"Partner.\""
                      ]
                    },
                    { "set": { "wwEnd": "absent" } },
                    { "coin": -50, "why": "Fined for contempt of court" },
                    { "heat": 5 }
                  ]
                }
              ]
            },
            { "find": "subpoena", "in": "stock", "match": { "uniqueId": "wrenSubpoena" } },
            { "take": "subpoena" },
            { "view": { "sign": null } }
          ]
        }
      ]
    }
  },
  "beats": [
    { "drift": "ww-hook", "from": "1-2", "to": "1-4", "cast": "ashby", "scene": "wwHook", "if": "ended.museum != 'cuffs' && !flag.wwKnown" },
    { "drift": "ww-hook", "from": "1-2", "to": "1-4", "cast": "penhallow", "scene": "wwHook", "if": "ended.museum == 'cuffs' && !flag.wwKnown" }
  ],
  "nights": [
    {
      "id": "ww-night",
      "window": ["2-1", "3-4"],
      "weekdays": [2, 3],
      "if": "flag.wwKnown && !flag.wwEnd",
      "scene": "wwNight",
      "test": [
        { "set": { "wwKnown": true } },
        { "roll": { "museumEnd": ["swap", "cuffs"] } },
        { "hook": "coinAtLeast", "with": 200 }
      ]
    }
  ],
  "calendar": [
    {
      "id": "ww-night",
      "night": "ww-night",
      "story": "wrenwinter",
      "where": { "if": "ended.museum == 'cuffs'", "then": "Town Hall", "else": "Harbor Green" },
      "title": { "if": "ended.museum == 'cuffs'", "then": "Commonwealth v. Wren", "else": "Wren, after dark" },
      "known": "flag.wwKnown",
      "scene": "wwNight"
    }
  ],
  "epilogue": [
    { "line": "The Lantern Queen's crown is back under glass in Providence. The invoice found with it was on Gilded Hand letterhead. Wren sends a postcard of the museum, unsigned.", "if": "flag.wwEnd == 'turned'" },
    { "line": "A postcard from Montreal, no message, just a drawing of a crown with a question mark on it.", "if": "flag.wwEnd == 'gone'" },
    { "line": "Greer Ashby closed the file on the Lantern Queen's crown, except for the crown. Wren hasn't written. You didn't expect her to.", "if": "flag.wwEnd == 'sold'" },
    { "line": "Wren is doing eighteen months in Framingham. She is, according to Penhallow, running the library.", "if": "flag.wwEnd == 'straight'" },
    { "line": "Wren is doing two hundred hours at the Historical Society. Dr. Lusk says she has never had a volunteer who knows so much about the locks.", "if": "flag.wwEnd == 'spoke'" },
    { "line": "Wren is out, somewhere. Captain Barrow has written your name on a list, and underlined it.", "if": "flag.wwEnd == 'absent'" }
  ],
  "talk": {
    "by": "dunphy",
    "rumour": [
      "The Lantern Queen's crown is back on the board in the squad room. Somebody in Providence finally looked at it properly.",
      "There's an insurance woman staying at the Motor Inn asking questions. And the Captain's got a court date upstairs at Town Hall. Busy month for a crown."
    ],
    "react": { "turned": "The crown turned up in New York with a Gilded Hand invoice in the box. The Captain read it twice and then had to go and sit in her car.", "gone": "That girl Wren was in town, I heard, and now she isn't. Nobody at the bus station saw anything. Nobody at a bus station ever sees anything.", "sold": "They picked Wren up at the bus station. Somebody gave her to the insurance woman. I hope they got a good price, because they'll be paying for it.", "straight": "You told the court all of it, the Captain says. She was impressed. She doesn't get impressed. She gets coffee.", "spoke": "Two hundred hours at the Historical Society. The Captain says that's putting the fox in charge of the crowns, but she was smiling.", "absent": "You didn't show. The case fell over. The Captain has a list now, and you're on it. I've seen the list. It's short." }
  },
  "outcome": "flag.wwEnd"
});
