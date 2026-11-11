// Pawn Champ - Postcards Up the Coast: Odile was never found, and she's writing from further north.
// Major quest M34, batch Q, round 2 (docs/quests/MAJOR.md#m34-postcards-up-the-coast-town).
// Stay-on only: from month 2, and only when Odile wasn't found in October (The Search Goes On).
// The month's postcard itself comes in the morning (ODILE_MORNING in js/stay.js); this story is the
// envelope that comes with it.
//
// Hook (W1 Tue-Thu)          Otis Pelletier brings an envelope with postage due: a pawn ticket from Port
//                            Esther in Odile's name, and "Redeem it for me. O."
// Middle (shop)              the redeemed parcel: a ship's clock with a second ticket in its back (W2);
//                            Vernon Moody, a process server, wants Odile's postmarks (W2-W3).
// Scene 1 (W3)               the post office after hours: Otis's dead-letter room has her letters.
// Finale (W4)                the ferry landing, the last boat down the coast before the ice.
// Found sets S.stay.odile to 'home', so the rest of the stay is Two Keepers (js/stay.js).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/postcards.js.
defineStory({
  "id": "postcards",
  "kind": "major",
  "colour": "#c87a3a",
  "family": "town",
  "title": "Postcards Up the Coast",
  "from": 2,
  "requires": "hook.odileSearch",
  "rumour": "A postcard each month from a harbor town further north, and this time a pawn ticket inside.",
  "endings": { "found": "Meeting the Boat", "letters": "Care of the Post Office", "tickets": "Postmarks for Sale" },
  "outcome": "flag.pcEnd",
  "about": [
    "An Odile story that can bring her home. Otis brings a letter from Port Esther, Maine, in her hand, with a pawn ticket inside: \"Redeem it for me. You'll know why\" (§{pcOtis}). Redeem it and a parcel comes back (§{pcParcel}): Odile's ship's clock, stopped at ten past four, with a list of pawnshops up the coast, each marked with a little gold hand. Gilded Hand's collectors pawn what they take a town or two away, and Odile is buying it back, ticket by ticket.",
    "Vernon Moody, a process server for the finance company's lawyers, offers $150 for her postmarks (§{pcMoody}). Selling them ends it (Postmarks for Sale), and Odile stops writing. Ask who the lawyers are and he leaves a card.",
    "Otis finds a bundle of letters to \"The Keeper\" in the post office's dead-letter room (§{pcPostOffice}). Odile has been writing every few days since she left: she and others the Hand robbed are making a list for the attorney general, and she'll be on the last boat down before the ice.",
    "At the ferry landing (§{pcBoat}) you can wait on the ramp, and she comes down it (§{pcOdile}); her last ticket was her own wedding ring, pawned in 1979 for the shop's first rent (Meeting the Boat). If you asked about Moody, he's there too, and has quit: his mother's ring is on her list. Or leave a letter in the ticket hut and let her choose (Care of the Post Office)."
  ],
  "cast": {
    "moody": {
      "name": "Vernon Moody",
      "look": { "skin": "#e8c0a0", "hair": "#4a3a2a", "hs": 1, "coat": "#6a6a5a", "style": "jacket", "long": true, "pants": "#3a3a3a", "hat": "wide", "hatc": "#3a3a30", "bag": "#2a2a2a" }
    }
  },
  "uniques": {
    "shipClock": {
      "name": "Brass ship's clock, Chelsea",
      "icon": "compass",
      "cat": "curio",
      "guide": 140,
      "questKey": true,
      "condLabel": "Stopped at 4:10",
      "tells": [
        "A brass bulkhead clock, CHELSEA CLOCK CO. BOSTON on the dial. It hung behind Odile's counter for thirty years, until it didn't.",
        "The back unscrews. Inside, folded small: a second pawn ticket, Cutler's Reach, and a list in Odile's hand of five shops up the coast.",
        "Every shop on the list has a mark beside it: a little hand, in gold pen."
      ]
    }
  },
  "scenes": {
    "pcOtis": {
      "title": "Otis brings a letter from Odile, with postage due",
      "customer": "otis",
      "steps": [
        { "say": "otis", "text": "Postage due, I'm afraid. Three dollars. She's put a domestic stamp on a fat letter. She always did." },
        { "view": { "counterIcon": "postcards" } },
        { "narrate": "A brown envelope, Port Esther, Maine, addressed in Odile's hand. Inside, a pawn ticket from Penobscot Loan & Jewelry, made out in Odile's name, and a card: \"Redeem it for me. You'll know why. O.\"" },
        { "say": "otis", "text": "Penobscot Loan. I can send them a money order, registered, if you want it back. Forty-five, with their interest. I'd do it for her." },
        {
          "choose": [
            { "label": "Send the money order ($48)", "disabled": "coin < 48" },
            { "label": "Pay the postage and keep the ticket for now", "hint": "($3)" }
          ],
          "as": "sent"
        },
        { "view": { "counterIcon": null } },
        { "coin": -3, "why": "Postage due on a letter from Odile" },
        {
          "if": "sent == 0",
          "then": [
            { "coin": -45, "why": "Redeemed Odile's pawn ticket from Port Esther" },
            { "set": { "pcSent": true } },
            { "say": "otis", "text": "It'll be up there tomorrow. Whatever it is, it'll be back by next week." }
          ],
          "else": [
            { "say": "otis", "text": "It'll keep. Tickets up there are good for ninety days. I asked." }
          ]
        },
        { "set": { "pcMet": true } },
        { "leave": "otis" }
      ]
    },
    "pcParcel": {
      "title": "The parcel from Port Esther: Odile's ship's clock",
      "customer": "otis",
      "steps": [
        {
          "if": "!flag.pcSent",
          "then": [
            { "say": "otis", "text": "You've still got that ticket? Let me send the money order. It's Odile." },
            {
              "if": "coin >= 45",
              "then": [
                { "coin": -45, "why": "Redeemed Odile's pawn ticket from Port Esther" },
                { "set": { "pcSent": true } },
                { "narrate": "Otis comes back after lunch with the parcel. Penobscot Loan sent it the same day." }
              ],
              "else": [
                { "say": "otis", "text": "Short this week? I'll lend it you. Don't tell the postmaster." },
                { "set": { "pcSent": true, "pcOtisLent": true } }
              ]
            }
          ],
          "else": [{ "say": "otis", "text": "Your parcel from Port Esther. Heavy. Mind your toes." }]
        },
        { "view": { "counterIcon": "compass" } },
        {
          "narrate": [
            "Wrapped in a Maine newspaper: Odile's ship's clock, the one that hung behind the counter for thirty years. It's stopped at ten past four.",
            "The back unscrews. Folded inside: a second ticket, from Cutler's Reach, and a list of five pawnshops up the coast. Beside every one, a little gold hand."
          ]
        },
        { "view": { "counterIcon": null } },
        { "add": { "unique": "shipClock" } },
        { "refresh": "panel" },
        { "say": "otis", "text": "Gold hands. That's Gilded Hand, isn't it? Their collectors pawned what they took off people. She's following it." },
        { "set": { "pcClock": true } },
        { "leave": "otis" }
      ]
    },
    "pcMoody": {
      "title": "Vernon Moody, process server, wants Odile's postmarks",
      "customer": "moody",
      "steps": [
        {
          "say": "moody",
          "text": [
            "Vernon Moody, process server, out of Portland. I've a subpoena from some lawyers in Boston for \"Odile, proprietor, The Crooked Scale\", and she moves faster than I do.",
            "I hear she writes to you. Postmarks are all I need. The envelopes, the tickets. A hundred and fifty, cash, and nobody needs to know where I got them."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell him the postmarks ($150)",
              "hint": "(Odile will know)",
              "then": [
                { "coin": 150, "why": "Sold Odile's postmarks to a process server" },
                { "rep": -4 },
                { "say": "moody", "text": "Pleasure. Port Esther, Cutler's Reach. She'll be at the next one by Friday. So will I." },
                { "set": { "pcEnd": "tickets", "pcDone": true } },
                { "hook": "odile", "with": "silent", "note": "no more postcards in the mornings" }
              ]
            },
            {
              "label": "\"Who are the lawyers?\"",
              "then": [
                { "say": "moody", "text": "Big firm, nice letterhead. They act for a finance company. I don't ask which. That's the job." },
                { "set": { "pcMoodyAsked": true } },
                { "narrate": "He leaves a card. You know which finance company." }
              ]
            },
            {
              "label": "\"No.\"",
              "then": [{ "say": "moody", "text": "Fair enough. I'll find her the slow way." }]
            }
          ]
        },
        { "leave": "moody" }
      ]
    },
    "pcPostOffice": {
      "title": "The dead-letter room at the post office",
      "steps": [
        {
          "stage": "postoffice",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
            { "id": "otis", "cast": "otis", "at": [190, 162], "facingLeft": true }
          ]
        },
        { "narrate": "The post office after hours. One hanging lamp, the brass box doors, and at the back the caged door of the dead-letter room, open a crack." },
        {
          "say": "otis",
          "text": [
            "I didn't sleep. The gold hands. So I went through the dead letters, and there's a bundle addressed to \"The Keeper, The Crooked Scale\". No name. Since October.",
            "The machine sends anything without a name to the dead-letter room. Eleven years, I never thought to look for you in there."
          ]
        },
        {
          "choose": [
            {
              "label": "Read them, in order",
              "then": [
                {
                  "narrate": [
                    "Odile, every few days since she left. Port Esther: \"The Hand's collectors pawn what they take, a town or two away, so nobody sees. I'm buying it back, ticket by ticket. Every one is a name for the attorney general.\"",
                    "Little Sable Light: \"Cold. Fine. Not alone: there are four of us now, people they took things from. We have a list.\"",
                    "The last, ten days ago: \"One ticket to go, and it's the one I'm frightened of. Then I'm coming home. I'll be on the last boat down before the ice. Meet it if you want me.\""
                  ]
                },
                { "set": { "pcRead": true } }
              ]
            },
            {
              "label": "Take them home unopened",
              "then": [
                { "narrate": "You carry the bundle home under your coat. It sits on the counter all night. You know what it says anyway." }
              ]
            }
          ]
        },
        { "say": "otis", "text": "And that Moody fellow asked me which boat. I said I deliver letters, not people.", "if": "flag.pcMoodyAsked" },
        { "set": { "pcLetters": true } },
        { "toast": "Calendar: the ferry landing, the last boat down", "look": "otis" }
      ]
    },
    "pcBoat": {
      "title": "The last boat down the coast",
      "music": "sea",
      "steps": [
        {
          "stage": "ferryLandingNight",
          "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] }]
        },
        { "narrate": "The ferry landing, in the dark, the slip glazed with the first ice. The last coastal boat of the year is coming in from the north, its lights low on the water." },
        {
          "choose": [
            {
              "label": "Look for Vernon Moody first",
              "if": "flag.pcMoodyAsked",
              "then": [
                { "enter": { "id": "moody", "cast": "moody", "at": [230, 164], "facingLeft": true } },
                { "narrate": "He's in his car by the ticket hut, engine running. You knock on the window." },
                { "say": "moody", "text": "I know. I'm not here for her. I quit the finance company's lawyers this morning. I read the list she sent the attorney general. My mother's ring is on it." },
                { "narrate": "He drives away. You wait on the ramp." },
                { "run": "pcOdile" }
              ]
            },
            { "label": "Wait on the ramp", "then": [{ "run": "pcOdile" }] },
            {
              "label": "Leave a letter in the ticket hut, and go home",
              "hint": "(let her choose)",
              "then": [
                {
                  "narrate": [
                    "You write two lines on the back of a calendar page, and leave it in the ticket hut with her name on it. Then you go home to the shop and leave the light on.",
                    "In the morning there's a postcard under the door, no stamp: Gull Point, our own. \"Not yet. Soon. Thank you for letting me say so.\""
                  ]
                },
                { "set": { "pcEnd": "letters" } }
              ]
            }
          ]
        },
        { "find": "clock", "in": "stock", "match": { "uniqueId": "shipClock" } },
        {
          "edit": "clock",
          "set": { "condLabel": "Going", "questKey": false, "nosale": false },
          "if": "clock",
          "note": "the clock is yours to sell now"
        },
        { "refresh": "panel", "if": "clock" },
        { "set": { "pcDone": true } }
      ]
    },
    "pcOdile": {
      "title": "Odile comes down the ramp",
      "steps": [
        { "enter": { "id": "odile", "cast": "odile", "at": [240, 164], "facingLeft": true } },
        { "narrate": "The ramp goes down. Three passengers, then a fourth: a small woman in a long blue coat with a suitcase and a lantern she doesn't need." },
        { "say": "odile", "text": "You came. I told myself you wouldn't, so it wouldn't hurt. That was very silly." },
        { "find": "clock", "in": "stock", "match": { "uniqueId": "shipClock" } },
        { "say": "odile", "text": "You got the clock back. Wind it. It stopped the day I left, and I want to see it go.", "if": "clock" },
        { "say": "odile", "text": "The last ticket was mine. Ticket number one, The Crooked Scale, 1979. I put my own wedding ring on the scale to make the first week's rent. It's the only ticket I ever wrote for myself. I'm done running. Let's go home." },
        { "hook": "odile", "with": "home" },
        { "rep": 5, "why": "Odile came home" },
        { "set": { "pcEnd": "found" } }
      ]
    }
  },
  "beats": [
    { "drift": "pc-hook", "from": "1-2", "to": "1-4", "cast": "otis", "scene": "pcOtis" },
    { "drift": "pc-parcel", "from": "2-1", "to": "2-2", "cast": "otis", "scene": "pcParcel", "if": "flag.pcMet && !flag.pcDone && shelf.free" },
    { "drift": "pc-moody", "from": "2-3", "to": "3-1", "cast": "moody", "scene": "pcMoody", "if": "flag.pcClock && !flag.pcDone" }
  ],
  "nights": [
    {
      "id": "pc-dead",
      "window": ["3-2", "3-4"],
      "if": "flag.pcClock && !flag.pcDone",
      "scene": "pcPostOffice",
      "test": [{ "set": { "pcClock": true, "pcMoodyAsked": true } }]
    },
    {
      "id": "pc-boat",
      "window": ["4-2", "4-4"],
      "if": "flag.pcLetters && !flag.pcDone",
      "scene": "pcBoat",
      "test": [
        { "hook": "odile", "with": "search" },
        { "set": { "pcLetters": true, "pcMoodyAsked": true } },
        { "add": { "unique": "shipClock" } }
      ]
    }
  ],
  "calendar": [
    { "id": "pc-dead", "night": "pc-dead", "story": "postcards", "where": "The post office", "title": "The dead-letter room", "known": "flag.pcClock", "scene": "pcPostOffice" },
    { "id": "pc-boat", "night": "pc-boat", "story": "postcards", "where": "The ferry landing", "title": "The last boat down", "known": "flag.pcLetters", "scene": "pcBoat" }
  ],
  "epilogue": [
    { "line": "Odile is home. The ship's clock is going behind the counter, and the attorney general has a list of every gold hand from here to Canada.", "if": "flag.pcEnd == 'found'" },
    { "line": "The postcards keep coming, care of the post office. Otis reads them first and pretends he doesn't.", "if": "flag.pcEnd == 'letters'" },
    { "line": "The postcards stopped. Vernon Moody found Port Esther and Cutler's Reach and an empty room at Little Sable Light. Odile is somewhere further up the coast, and she doesn't write.", "if": "flag.pcEnd == 'tickets'" }
  ]
});
