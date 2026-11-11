// Pawn Champ - Four Minutes Late: a stopped watch, a clerk's crackpot theory, and the real
// conspiracy he trips over. Major quest M1 (docs/quests/MAJOR.md).
// A stopped watch makes a clerk late. He decides it was a conspiracy. It wasn't, but while
// he's chasing it, he and his new friends stumble onto one that is. You are only ever on the
// edge of it, and you go deeper only if you choose to.
// Grown in batch E: the Customs House records room by night, and Town Meeting's "any other business".
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "hollis",
  "kind": "major",
  "colour": "#6a9ad8",
  "family": "crime",
  "title": "Four Minutes Late",
  "crosses": ["museum", "selectmen"],
  "rumour": "A Customs clerk is sure somebody stopped his watch on purpose.",
  "endings": { "promoted": "Promoted", "hush": "Hush Money", "betrayed": "Betrayed", "leftToThem": "Left to Them", "walkedAway": "Not My Business" },
  "outcome": [
    { "if": "flag.hollisWin || flag.hollisMeetingWin", "ending": "promoted" },
    { "if": "flag.craneBlackmail", "ending": "hush" },
    { "if": "flag.hollisBetrayed", "ending": "betrayed" },
    { "if": "flag.hollisAlone", "ending": "leftToThem" },
    { "if": "flag.hollisOut || !flag.hollisFriend", "ending": "walkedAway" }
  ],
  "about": [
    "A comic conspiracy that turns out to be a real one. Hollis Fenn, a Customs clerk, sells you the watch that stopped the morning of his promotion interview, sure it was sabotage (§{hollisLate}). Believe him and you meet Agathe Moss at her clock shop (§{hollisFound}): the watch just rusted, but forty crates of seized phones were signed off as destroyed and never were. Keep Agathe's tally sheet for them, or stay out (Not My Business).",
    "Deputy Director Crane offers you $80 for the sheet (§{craneOffer}). With Hollis you can break into the Customs House records room after ten (§{customsRecords}) for the destruction certificates, signed by Crane on a day he was in Boston; a camera helps, and Crane's nephew Tobias nearly catches you. Pim, the night street-sweeper, tells you a Customs van goes to Pier Nine every Tuesday at midnight (§{hollisPlan}).",
    "At the stakeout (§{stakeout}) you watch crates marked DESTROYED loaded onto a Gilded Hand barge. Take the sheet to Captain Barrow (Promoted), take Crane's hush money (Hush Money), or leave it to them (Left to Them). Selling the sheet earlier is Betrayed. If Town Meeting is on, Hollis can make his case there with your proof (§{hollisMeeting}).",
    "Afterwards: Wren wants any crate you lifted (§{wrenPhones}), Hollis brings the news (§{hollisAfter}), Tobias pawns his uncle's cufflinks (§{tobiasCufflinks}), and Hollis offers a symbolic dollar for his old watch, to frame (§{hollisWatchBack})."
  ],
  "cast": {
    "hollis": {
      "name": "Hollis Fenn",
      "look": { "skin": "#f0c8a8", "hair": "#8a6a4a", "hs": 2, "coat": "#7a7a6a", "trim": "#5a7aa0", "style": "suit", "pants": "#4a4a40", "moustache": "#8a6a4a", "glasses": "#2a2a2e", "bag": "#5a3a24" }
    },
    "tobias": {
      "name": "Tobias Crane",
      "look": { "skin": "#f0d8c8", "hair": "#c8a050", "hs": 4, "coat": "#4a5a7a", "trim": "#e8e0c8", "style": "suit", "pants": "#2a2a3a" }
    },
    "pim": {
      "name": "Pim",
      "look": { "skin": "#a87050", "hair": "#2a1e16", "hs": 4, "coat": "#3a4a5a", "style": "vest", "vest": "#e8a020", "hat": "beanie", "hatc": "#e8a020", "pants": "#2a3a4a" }
    },
    "crane": {
      "name": "Deputy Director Crane",
      "look": { "skin": "#f0d8c8", "hair": "#3a2a1e", "hs": 0, "coat": "#2a3a5a", "trim": "#8a2a2a", "style": "suit", "long": true, "moustache": "#3a2a1e", "pants": "#1e2230" }
    }
  },
  "uniques": {
    "craneCertificate": {
      "name": "Destruction certificate No. 4471",
      "icon": "letter",
      "cat": "curio",
      "guide": 0,
      "questKey": true,
      "tells": [
        "Forty crates, \"crushed and disposed of\". Signed by Deputy Director Crane, on a day he was in Boston."
      ]
    },
    "seizedChronometer": {
      "name": "A seized ship's chronometer",
      "icon": "watch",
      "cat": "curio",
      "guide": 150,
      "stolen": true,
      "tells": [
        "Brass, gimballed, in a mahogany box. Customs evidence tag still on the hinge: \"SEIZED. FOR DESTRUCTION.\" Nobody destroys a thing like this."
      ]
    },
    "phoneCrate": {
      "name": "A crate of \"destroyed\" phones",
      "icon": "crate",
      "cat": "curio",
      "guide": 110,
      "stolen": true,
      "tells": [
        "Forty knock-off phones. The crate is stencilled DESTROYED.",
        "Seized cargo. Anyone who looks will know it."
      ]
    },
    "benchLoupe": {
      "name": "Agathe's bench loupe",
      "icon": "compass",
      "cat": "curio",
      "guide": 60,
      "questKey": true,
      "effect": { "loupe": 1 },
      "effectText": "+1 inspection a day while you keep it",
      "tells": ["A watchmaker's loupe, brass, ground by hand. M. MOSS on the rim."]
    },
    "craneCufflinks": {
      "name": "Monogrammed cufflinks, D.C.",
      "icon": "ring",
      "cat": "jewelry",
      "guide": 85,
      "tells": ["Gold, enamel, a D.C. monogram. A gift \"for twenty years of loyal service\"."]
    }
  },
  "scenes": {
    "hollisLate": {
      "title": "Hollis Fenn sells his stopped watch",
      "customer": "hollis",
      "steps": [
        {
          "say": "hollis",
          "text": [
            "Hollis Fenn. U.S. Customs, Port of Hollow Neck. Clerk, pay grade GS-7. Do you buy watches?",
            "This one stopped at eight minutes to nine this morning. My promotion interview was at nine. I arrived at twenty past. My phone was charging in the car.",
            "The job went to Deputy Director Crane's nephew. A watch doesn't just stop on the most important morning of a man's life. Not by accident."
          ]
        },
        {
          "offer": { "item": "watch", "cond": 0, "mark": "the initials H.F." },
          "persona": "desperate",
          "asking": 20,
          "min": 12
        },
        {
          "choose": [
            {
              "label": "\"You really think someone stopped it on purpose?\"",
              "then": [
                { "set": { "hollisFriend": true } },
                {
                  "say": "hollis",
                  "text": [
                    "You... believe me? Nobody believes me.",
                    "My friend Agathe repairs clocks on Water Street. Moss Clock Repair. She'll know if this was tampered with.",
                    "Come by after closing on Monday. Knock twice. Then once. Then twice again."
                  ]
                },
                { "toast": "Calendar: Moss Clock Repair, Monday night (week 2)", "look": "hollis" }
              ]
            },
            {
              "label": "\"Watches break, Mr. Fenn. It's just a broken watch.\"",
              "then": [
                { "say": "hollis", "text": "That is exactly what they would want me to think. Goodbye." }
              ]
            },
            { "label": "(Say nothing)", "then": [{ "say": "hollis", "text": "Hm. Goodbye, then." }] }
          ]
        },
        { "leave": "hollis" }
      ]
    },
    "hollisFound": {
      "title": "Moss Clock Repair, after closing: the watch, and the bonded warehouse",
      "note": "W2 Monday night, at Agathe's workshop on Water Street (only if you befriended Hollis).",
      "steps": [
        {
          "stage": "clockshop",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "hollis", "cast": "hollis", "at": [124, 164] },
            { "id": "agathe", "cast": "agathe", "at": [196, 152], "facingLeft": true }
          ]
        },
        { "narrate": "Moss Clock Repair, Water Street, after closing. Two knocks, one, two. Every clock on the walls says eleven minutes to midnight, and every one of them is right." },
        { "say": "hollis", "text": "I was right! Well. I was wrong. But I was right!" },
        { "say": "agathe", "text": "Agathe Moss. Customs inspector, retired. This was my father's shop. I took the watch apart on that bench. Mainspring, rusted through. Nobody sabotaged anything." },
        { "say": "hollis", "text": "BUT. While I was investigating the watch, I asked Agathe about Crane. And Agathe asked about the bonded warehouse." },
        { "say": "agathe", "text": "Seized cargo goes into the bonded warehouse to be destroyed. Forty crates of counterfeit phones went in last month. On paper they were all crushed. Not one was." },
        { "say": "hollis", "text": "Somebody searched my apartment last night. Would you keep Agathe's tally sheet for us? Nobody would look in a pawnshop." },
        {
          "if": "standing.agathe >= 2",
          "note": "story moment (appraise): Agathe is warm or a friend, and vouches for you",
          "then": [
            { "say": "agathe", "text": "I've looked at their shelf. Honest labels, honest prices, mostly. I'd trust them with it. I can't say that about anyone at Customs." }
          ]
        },
        {
          "if": "standing.agathe <= -2",
          "note": "story moment (appraise): Agathe is sore or an enemy, and doesn't want you to have it",
          "then": [
            { "say": "agathe", "text": "The pawnshop? Hollis. I've seen what they put on that shelf and what they call it." },
            { "say": "hollis", "text": "Agathe, nobody else will take it. Please." }
          ]
        },
        {
          "choose": [
            {
              "label": "Keep it safe for them",
              "then": [
                { "set": { "hollisSheet": true } },
                { "sway": "agathe", "by": 1, "why": "Kept Agathe's tally sheet when she didn't trust you", "if": "standing.agathe <= -2" },
                { "hook": "tallySheet", "note": "Agathe's tally sheet goes on your shelves: not for sale, and its clue is the signatures" },
                { "say": "agathe", "text": "Sensible. Hide it among the junk." },
                { "say": "hollis", "text": "You're a true friend." }
              ]
            },
            {
              "label": "I can't get involved in Customs business",
              "then": [
                { "set": { "hollisOut": true } },
                { "say": "agathe", "text": "Can't blame you. Mind the step on your way out." }
              ]
            }
          ]
        }
      ]
    },
    "craneOffer": {
      "title": "Deputy Director Crane wants the papers back",
      "customer": "crane",
      "steps": [
        {
          "say": "crane",
          "text": [
            "Deputy Director Crane, Port Customs. Charming little shop.",
            "One of my staff, a Mr. Fenn, is unwell. Paranoid. He has been removing official documents.",
            "If he left anything here, I'd pay 80 to see it back where it belongs. And my office does sign off the import licenses for this street."
          ]
        },
        {
          "choose": [
            {
              "label": "Hand over the tally sheet (+$80)",
              "then": [
                { "find": "sheet", "in": "stock", "match": { "name": "Agathe's tally sheet" } },
                { "take": "sheet" },
                { "coin": 80, "why": "Sold Hollis's papers to Deputy Crane" },
                { "set": { "hollisBetrayed": true } },
                { "say": "crane", "text": "Very civic of you. I won't forget it." }
              ]
            },
            {
              "label": "\"Never heard of any documents.\"",
              "then": [
                { "heat": 5 },
                { "say": "crane", "text": "Of course you haven't. Do keep your license somewhere safe." }
              ]
            },
            {
              "label": "Play along: \"Let me check my back room. Come back in a few days.\"",
              "then": [
                { "set": { "craneStalled": true } },
                { "say": "crane", "text": "Thursday, then. I'm a patient man." }
              ]
            }
          ]
        },
        { "leave": "crane" }
      ]
    },
    "hollisPlan": {
      "title": "Hollis and Pim: the Customs van goes to Pier Nine",
      "customer": "hollis",
      "steps": [
        {
          "if": "flag.hollisBetrayed",
          "then": [
            { "say": "hollis", "text": "They searched my apartment again. Turned it inside out. They didn't find anything, because it's here. Isn't it?" },
            {
              "choose": [
                {
                  "label": "Lie: \"Of course. It's safe.\"",
                  "then": [
                    { "say": "hollis", "text": "Thank goodness. Then there's still hope." },
                    { "set": { "hollisLied": true } }
                  ]
                },
                {
                  "label": "Tell him the truth: you sold it to Crane",
                  "then": [
                    { "say": "hollis", "text": "...Right. Well. At least you told me." },
                    { "set": { "hollisConfessed": true } }
                  ]
                }
              ]
            },
            { "leave": "hollis" },
            { "end": true }
          ]
        },
        { "hook": "pimArrives", "sets": ["pim"], "note": "Pim comes in at Hollis's elbow" },
        { "say": "pim", "text": "Pim. I drive the night street-sweeper on the waterfront. Every Tuesday at midnight, a Customs van goes to Pier Nine. Not the bonded warehouse. Pier Nine." },
        { "say": "hollis", "text": "And Crane came here, to YOU? Then he knows. It has to be tomorrow night.", "if": "flag.craneStalled" },
        { "say": "hollis", "text": "We'll watch from behind the fish market. Will you come? We need someone respectable. Relatively." },
        {
          "choose": [
            {
              "label": "I'll be there",
              "then": [
                { "set": { "hollisStakeout": true } },
                { "say": "pim", "text": "Tomorrow, midnight. Wear something dark. And put your phone on silent." },
                { "toast": "Calendar: the stakeout at Pier Nine, Tuesday night", "look": "pim" }
              ]
            },
            {
              "label": "This is as far as I go, Hollis",
              "then": [
                { "set": { "hollisAlone": true } },
                { "say": "hollis", "text": "I understand. Keep the sheet safe, at least." }
              ]
            }
          ]
        },
        { "hook": "bothLeave", "note": "Hollis goes, and Pim a moment after him" }
      ]
    },
    "stakeout": {
      "title": "The stakeout at Pier Nine",
      "music": "tension",
      "steps": [
        {
          "stage": "docks",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [60, 162] },
            { "id": "hollis", "cast": "hollis", "at": [80, 160] },
            { "id": "agathe", "cast": "agathe", "at": [40, 164] }
          ]
        },
        { "narrate": "Pier Nine, midnight. You crouch behind the fish market dumpsters with a retired inspector, a street-sweeper driver and a GS-7 customs clerk." },
        { "enter": { "id": "crane", "cast": "crane", "at": [300, 152], "facingLeft": true } },
        { "walk": "crane", "to": [220, 152] },
        { "face": "crane", "left": true },
        { "narrate": "A Customs van backs up. Men unload crate after crate, every one stencilled DESTROYED, onto a barge with a little gold logo on the bow: an open hand." },
        { "say": "agathe", "text": "Gilded Hand Finance. Crane \"destroys\" the seized cargo and the Hand sells it in Boston." },
        { "say": "hollis", "text": "I knew it! I mean, I didn't know THIS. I was mostly wrong about the watch. But I KNEW it!" },
        {
          "if": "hook.carryingPhoto",
          "note": "items in use: the barge on film",
          "then": [
            { "use": "photo" },
            { "set": { "hollisBargePhoto": true } },
            { "narrate": "You get the whole thing on film: the van, the DESTROYED stencils, the little gold hand on the bow, and Crane counting crates with his own finger." }
          ]
        },
        {
          "choose": [
            {
              "label": "Lift one crate of \"destroyed\" phones while nobody's looking",
              "hint": "(hot stock, +12 heat)",
              "disabled": "!shelf.free",
              "note": "while everyone watches the barge, one crate sits at the end of the line, unguarded",
              "then": [
                { "add": { "unique": "phoneCrate" } },
                { "set": { "hollisCrate": true } },
                { "heat": 12, "why": "Took a crate off the Gilded Hand barge" },
                { "narrate": "Forty knock-off phones in a crate stencilled DESTROYED. Agathe sees you do it, and decides she didn't." }
              ]
            },
            { "label": "Keep your hands in your pockets" }
          ]
        },
        {
          "choose": [
            {
              "label": "Take the tally sheet to Captain Barrow tonight",
              "then": [
                { "set": { "hollisWin": true } },
                { "find": "sheet", "in": "stock", "match": { "name": "Agathe's tally sheet" } },
                { "take": "sheet" },
                {
                  "if": "flag.hollisBargePhoto",
                  "then": [{ "heat": -14 }, { "rep": 8 }],
                  "else": [{ "heat": -10 }, { "rep": 6 }]
                },
                { "hook": "easierPayments", "note": "the last two Fridays' payments to the Hand are 15% lower" },
                { "narrate": "The photos go on Barrow's desk with the tally sheet. \"Pictures. Somebody finally brought me pictures.\"", "if": "flag.hollisBargePhoto" },
                { "narrate": "Barrow reads the sheet twice, swears once, and sends four patrol cars to Pier Nine. By dawn Crane is in a cell and Gilded Hand Finance is short a barge." }
              ]
            },
            {
              "label": "Slip away, and later sell Crane your silence",
              "hint": "(+$120)",
              "then": [
                { "set": { "craneBlackmail": true, "hollisBetrayed": true } },
                { "coin": 120, "why": "Crane paid for your silence" },
                { "heat": 8 },
                { "narrate": "Next morning Crane leaves an envelope with a hundred and twenty in cash on your counter without a word. Hollis never learns why the case went cold." }
              ]
            },
            {
              "label": "Leave it to them. It's their fight.",
              "then": [
                { "set": { "hollisAlone": true } },
                { "narrate": "You slip home. Hollis and Agathe go to the newspaper at dawn. Crane is \"suspended pending an internal review\", which in Hollow Neck means promoted sideways." }
              ]
            }
          ]
        }
      ]
    },
    "hollisAfter": {
      "title": "Hollis comes back with the news",
      "customer": "hollis",
      "steps": [
        {
          "if": "flag.hollisWin",
          "then": [
            {
              "say": "hollis",
              "text": [
                "GS-9! Agathe is acting Director. Pim got a certificate from the town. Laminated.",
                "Agathe says my old watch was just broken all along. I've decided to find that funny."
              ]
            },
            {
              "hook": "newWatch",
              "sets": ["w", "price"],
              "note": "a watch on your shelf that isn't his old one, and half again its guide"
            },
            {
              "if": "w",
              "then": [
                { "say": "hollis", "text": "Is that a watch? I'll give you {price} for it. Don't tell me if it's reliable. I'd rather not know." },
                { "hook": "buyWatch" }
              ]
            },
            { "rep": 2 },
            {
              "if": "shelf.free",
              "then": [
                { "say": "hollis", "text": "Oh, and Agathe sent this. Her father's bench loupe. She says you've got the eye for it. I'd take that as a compliment; she's never said it to me." },
                { "add": { "unique": "benchLoupe" } },
                { "refresh": "panel" }
              ]
            }
          ],
          "else": [
            {
              "if": "flag.hollisLied",
              "then": [
                {
                  "say": "hollis",
                  "text": [
                    "Crane walked free. Someone gave him back Agathe's sheet. You wouldn't know anything about that, would you?",
                    "No. No, of course not. Goodbye."
                  ]
                }
              ],
              "else": [
                { "say": "hollis", "text": "The case went cold. Just like that. Someone must have talked.", "if": "flag.craneBlackmail" },
                {
                  "say": "hollis",
                  "text": [
                    "Crane got moved to the harbor parking office. They say that's a punishment. I'm not sure.",
                    "Thank you for keeping the sheet, anyway."
                  ],
                  "if": "!flag.craneBlackmail"
                }
              ]
            }
          ]
        },
        { "leave": "hollis" }
      ]
    },
    "hollisRecords": {
      "title": "Hollis needs the destruction certificates",
      "customer": "hollis",
      "steps": [
        {
          "say": "hollis",
          "text": [
            "Crane will deny everything. We need the destruction certificates: the ones that say forty crates were crushed. They're in the records room at the Customs House.",
            "My badge still opens the back door. Nobody's thought to cancel it. Nobody thinks about me at all, which is finally useful.",
            "{placed:customs-records} night, after ten. Will you hold the torch?"
          ]
        },
        {
          "choose": [
            {
              "label": "\"I'll hold the torch.\"",
              "then": [
                { "set": { "hollisRecords": true } },
                { "toast": "Calendar: the Customs House records room, {placed:customs-records} night", "look": "hollis" },
                { "say": "hollis", "text": "Bring gloves. Not for fingerprints. It's just very cold in there." }
              ]
            },
            {
              "label": "\"Breaking into a federal building is where I get off, Hollis.\"",
              "then": [
                { "say": "hollis", "text": "That's fair. That's very fair. I'll take photos with my phone. My phone takes terrible photos." }
              ]
            }
          ]
        },
        { "leave": "hollis" }
      ]
    },
    "customsRecords": {
      "title": "The Customs House records room, after ten",
      "music": "tension",
      "steps": [
        {
          "stage": "customsRecords",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [96, 166] },
            { "id": "hollis", "cast": "hollis", "at": [130, 164] }
          ]
        },
        { "narrate": "The Customs House after ten. Hollis's badge beeps green at the back door, and he looks so moved you think he might cry. The records room is three floors of filing cabinets and one radiator that doesn't work." },
        { "say": "hollis", "text": "Destruction certificates, last month. Here. Forty crates, crushed and disposed of. Signed Crane. On the day he was at a conference in Boston. I know because I booked his train." },
        {
          "if": "flag.hollisBetrayed",
          "then": [
            {
              "choose": [
                { "label": "Photograph everything and get out" },
                {
                  "label": "Step into the corridor and text Crane that Hollis is here",
                  "then": [
                    { "set": { "hollisCaught": true } },
                    { "coin": 40, "why": "Crane paid for the tip-off" },
                    { "narrate": "Ten minutes later the night guard walks Hollis out of the building by his elbow. Crane leaves forty dollars under your door. Hollis is suspended. He still doesn't know." },
                    { "end": true }
                  ]
                }
              ]
            }
          ]
        },
        { "narrate": "Down the corridor from the records room is the evidence cage. Seized goods, tagged FOR DESTRUCTION: a box of watches, a stuffed puffin, a ship's chronometer in a mahogany case. The tags are all dated last year.", "note": "the cage: seized goods awaiting destruction, which never seem to get destroyed" },
        { "say": "hollis", "text": "They were supposed to be crushed. The crusher's been broken since 2019. Nobody wanted to fill in the form." },
        {
          "choose": [
            {
              "label": "Pocket the chronometer",
              "hint": "(hot; +heat)",
              "then": [
                { "add": { "unique": "seizedChronometer" }, "if": "shelf.free" },
                { "heat": 5, "why": "Took a chronometer out of the Customs evidence cage" },
                { "set": { "hollisChronometer": true } },
                { "say": "hollis", "text": "You did NOT just... Fine. I didn't see that. I'm a GS-7. I can't see that high." }
              ]
            },
            {
              "label": "Photograph the tags",
              "then": [
                { "set": { "hollisCageTags": true } },
                { "say": "hollis", "text": "Oh, that's good. \"For destruction\", a year ago, still here. That's the whole case in one photo." }
              ]
            },
            { "label": "Keep walking" }
          ]
        },
        {
          "if": "hook.carryingPhoto",
          "note": "items in use: a real camera instead of Hollis's phone (docs/ITEMS_IN_USE.md)",
          "then": [
            { "use": "photo", "as": "camera" },
            { "set": { "hollisGoodPhotos": true } },
            { "narrate": "You brought the {camera.name|lower}. Every certificate, every signature, every date, sharp enough to read from the back of the Grange Hall." },
            { "say": "hollis", "text": "Oh, that's a REAL camera. My phone just gives up when it sees a signature." }
          ]
        },
        {
          "choose": [
            { "label": "Take the original certificate", "hint": "(stronger proof, and riskier)" },
            { "label": "Just take photos" }
          ],
          "as": "proof"
        },
        { "enter": { "id": "tobias", "cast": "tobias", "at": [300, 160], "facingLeft": true } },
        { "walk": "tobias", "to": [220, 160] },
        { "face": "tobias", "left": true },
        { "narrate": "Footsteps. Tobias Crane, the nephew who got Hollis's promotion, working late so he looks keen, eating soup out of a mug." },
        { "say": "tobias", "text": "Fenn? What are you doing in records at eleven at night?" },
        {
          "choose": [
            {
              "label": "Slip him twenty to forget it",
              "hint": "(-$20)",
              "disabled": "coin < 20",
              "then": [
                { "coin": -20, "why": "Paid Tobias Crane to forget he saw you" },
                { "say": "tobias", "text": "Saw who? I'm eating soup." }
              ]
            },
            {
              "label": "Tell him it's a secret audit, and he's been chosen to keep it secret",
              "then": [
                { "say": "hollis", "text": "Internal audit, Tobias. Very hush-hush. Regional wants to know who can be trusted. Can you be trusted?" },
                { "say": "tobias", "text": "I can be SO trusted. Is it... is it about my uncle?" },
                { "say": "hollis", "text": "I can't say. But eat your soup somewhere else." }
              ]
            }
          ],
          "as": "excuse"
        },
        {
          "if": "proof == 0",
          "then": [
            { "set": { "hollisProof": "original" } },
            { "add": { "unique": "craneCertificate" }, "if": "shelf.free" },
            {
              "if": "excuse == 1 && random < 0.5",
              "then": [
                { "heat": 8 },
                { "narrate": "On his way out Tobias glances at the folder under your arm. He'll mention it to someone. He mentions everything to someone." }
              ]
            }
          ],
          "else": [{ "set": { "hollisProof": "photos" } }]
        },
        { "narrate": "You leave the way you came. Hollis holds the door for you, and for the radiator, out of habit." }
      ]
    },
    "wrenPhones": {
      "title": "Wren hears about the crate",
      "customer": "wren",
      "steps": [
        { "find": "crate", "in": "stock", "match": { "uniqueId": "phoneCrate" } },
        { "say": "wren", "text": "Heard you've got a crate that doesn't exist. Forty phones that got \"crushed\". Ninety, cash, and it never existed twice." },
        {
          "choose": [{ "label": "Sell Wren the crate (+$90)" }, { "label": "\"No idea what you mean.\"" }],
          "as": "i"
        },
        {
          "if": "i == 0 && crate",
          "then": [
            { "take": "crate" },
            { "coin": 90, "why": "Sold Wren the crate of phones" },
            { "hook": "countSale" },
            { "say": "wren", "text": "Pleasure. You were never here. Neither was I." }
          ],
          "else": [{ "say": "wren", "text": "Sure. When it starts ringing, you know where I am." }]
        },
        { "leave": "wren" }
      ]
    },
    "tobiasCufflinks": {
      "title": "Tobias Crane pawns his uncle's cufflinks",
      "note": "Epilogue: Crane's nephew pawns his uncle's cufflinks.",
      "customer": "tobias",
      "steps": [
        {
          "say": "tobias",
          "text": [
            "Tobias Crane. My uncle has been... reassigned. To a cell, mostly. He left me his cufflinks and a lot of explaining to do.",
            "They're real gold. He always said so. He also said a lot of things."
          ]
        },
        { "offer": { "unique": "craneCufflinks" }, "persona": "desperate", "asking": 50, "min": 32 },
        {
          "say": "tobias",
          "text": { "if": "offer == 'deal'", "then": "Thanks. Fenn says I can stay on as his assistant if I learn to file. I'm learning to file.", "else": "Fair. I'll try the place in Salem." }
        },
        { "leave": "tobias" }
      ]
    },
    "hollisWatchBack": {
      "title": "Hollis wants his old watch back, for a dollar",
      "note": "The last week: if his old watch is still on your shelf.",
      "customer": "hollis",
      "steps": [
        {
          "find": "w",
          "in": "stock",
          "match": { "key": "watch", "mark": "the initials H.F.", "held": false }
        },
        {
          "say": "hollis",
          "text": [
            "Is that... that's my watch. H.F. on the back. Still saying eight fifty-two.",
            "I'd like it back. Not to wear. I'm going to frame it and hang it over my desk, stopped, so every morning I remember the day I was wrong about the right thing.",
            "I can offer you one dollar. It's a symbolic dollar. I've been told that's a thing."
          ]
        },
        {
          "choose": [
            {
              "label": "Sell it back for $1",
              "then": [
                { "take": "w" },
                { "coin": 1, "why": "Sold Hollis his own watch, symbolically" },
                { "hook": "countSale" },
                { "set": { "hollisFramed": true } },
                { "rep": 3 },
                { "say": "hollis", "text": "Thank you. I'll put the dollar in the frame too. No. I'll put the receipt in the frame. Can I have a receipt?" }
              ]
            },
            {
              "label": "\"It's worth more than that.\"",
              "hint": "({hook:worth})",
              "then": [
                { "take": "w" },
                { "hook": "payWorth", "note": "its guide, or $5 at least" },
                { "hook": "countSale" },
                { "say": "hollis", "text": "That's... fair. Strictly speaking. I'll frame the receipt for that instead." }
              ]
            },
            {
              "label": "\"It's not for sale.\"",
              "then": [
                { "say": "hollis", "text": "No. No, I understand. It's part of the shop now. Like a ghost, but more punctual." }
              ]
            }
          ]
        },
        { "leave": "hollis" }
      ]
    },
    "hollisMeeting": {
      "title": "Town Meeting, any other business: Hollis Fenn has three minutes",
      "steps": [
        { "enter": { "id": "hollis", "cast": "hollis", "at": [190, 150], "facingLeft": true } },
        { "say": "hollis", "text": "Hollis Fenn, Customs. My watch stopped at eight fifty-two on the morning of my promotion interview. Coincidence? I thought not. I was wrong. But listen." },
        { "narrate": "The room groans. Somebody at the back says \"the watch man\". Hollis goes pink to the ears." },
        {
          "choose": [
            {
              "label": "Stand up with the certificate",
              "disabled": "flag.hollisProof != 'original'",
              "hint": { "if": "flag.hollisProof == 'original'", "then": "", "else": "(you'd need the original)" }
            },
            { "label": "Stand up with the photos", "disabled": "!flag.hollisProof" },
            { "label": "Let Agathe do it" },
            { "label": "Stay in your seat" }
          ],
          "as": "i"
        },
        {
          "if": "i <= 1 && (i == 0 || flag.hollisCageTags || flag.hollisGoodPhotos || random < 0.6)",
          "then": [
            { "set": { "hollisMeetingWin": true } },
            { "rep": 5 },
            { "narrate": "You hold up certificate No. 4471 and read out the date, and where Crane was that day. Deputy Director Crane, in the third row, stands up and resigns on the spot. Then he sits down, because there's nowhere else to go.", "if": "i == 0" },
            {
              "narrate": {
                "if": "flag.hollisGoodPhotos",
                "then": "Your photos are sharp enough to read from the back row: certificate No. 4471, signed Crane, on a day he was in Boston. The hall goes very quiet. By eleven Crane has \"stepped back to spend more time with his barge\".",
                "else": { "if": "flag.hollisCageTags", "then": "The signature photo is blurry. The one of the evidence cage isn't: FOR DESTRUCTION, dated a year ago, on a stuffed puffin. The hall laughs, and then it stops laughing. By eleven Crane has \"stepped back to spend more time with his barge\".", "else": "The photos are blurry, but the signature isn't. By eleven Crane has \"stepped back to spend more time with his barge\"." }
              },
              "if": "i != 0"
            }
          ],
          "else": [
            {
              "if": "i == 2 && flag.hollisProof",
              "then": [
                { "set": { "hollisMeetingWin": true } },
                { "rep": 2 },
                { "narrate": "Agathe Moss walks to the microphone, reads out three numbers and one signature, and sits down. Thirty years in Customs. Nobody groans at Agathe." }
              ],
              "else": [
                { "narrate": "Hollis is laughed off before he gets to the barge. Crane is moved sideways to the harbor parking office, which in Hollow Neck is where careers go to be fined." }
              ]
            }
          ]
        },
        { "remove": "hollis" }
      ]
    }
  },
  "beats": [
    { "at": "1-2", "cast": "hollis", "scene": "hollisLate" },
    { "at": "4-4", "cast": "hollis", "scene": "hollisWatchBack", "if": "hook.oldWatch && !flag.hollisBetrayed && !flag.hollisCaught" },
    { "at": "2-1", "night": true, "if": "flag.hollisFriend", "steps": [{ "run": "hollisFound" }] },
    { "at": "2-3", "cast": "crane", "scene": "craneOffer", "if": "flag.hollisSheet" },
    { "at": "3-1", "cast": "hollis", "scene": "hollisPlan", "if": "flag.hollisSheet" },
    { "at": "3-2", "night": true, "if": "flag.hollisStakeout", "steps": [{ "run": "stakeout" }] },
    { "at": "4-2", "cast": "hollis", "scene": "hollisAfter", "if": "flag.hollisSheet" },
    { "at": "2-4", "cast": "hollis", "scene": "hollisRecords", "if": "flag.hollisSheet && !flag.hollisOut" },
    { "at": "3-4", "cast": "wren", "scene": "wrenPhones", "if": "hook.crateHere" },
    { "at": "4-3", "cast": "tobias", "scene": "tobiasCufflinks", "if": "flag.hollisWin || flag.hollisMeetingWin" }
  ],
  "nights": [
    {
      "id": "customs-records",
      "window": ["2-4", "3-1"],
      "if": "flag.hollisRecords",
      "scene": "customsRecords",
      "test": [{ "set": { "hollisRecords": true, "hollisSheet": true } }, { "hook": "setCoin", "with": 100 }]
    }
  ],
  "vignettes": [
    { "hub": "meeting", "label": "Any other business: Hollis Fenn has three minutes", "crossing": true, "scene": "hollisMeeting", "if": "flag.hollisFriend && !flag.hollisOut && !flag.hollisWin && !flag.craneBlackmail && !flag.hollisCaught", "note": "Crossing: Town Meeting (M5 or M11). Hollis gets three minutes under \"any other business\"." }
  ],
  "calendar": [
    {
      "id": "customs-records",
      "night": "customs-records",
      "story": "hollis",
      "where": "The Customs House",
      "title": "The records room",
      "known": "flag.hollisRecords",
      "scene": "customsRecords",
      "bring": ["photo"]
    },
    {
      "id": "clockshop",
      "week": 2,
      "days": [1],
      "night": true,
      "story": "hollis",
      "where": "Moss Clock Repair, Water Street",
      "title": "Hollis and the stopped watch",
      "known": "flag.hollisFriend",
      "scene": "hollisFound"
    },
    {
      "id": "stakeout",
      "week": 3,
      "days": [2],
      "night": true,
      "story": "hollis",
      "where": "Pier Nine",
      "title": "The stakeout",
      "known": "flag.hollisStakeout",
      "scene": "stakeout",
      "bring": ["photo"]
    }
  ],
  "epilogue": [
    { "line": "Somewhere in the Customs House paperwork, a ship's chronometer is still listed as destroyed.", "if": "flag.hollisChronometer" },
    { "line": "Over Hollis Fenn's desk at the Customs House: a stopped watch, a receipt for one dollar, and a brass plate that says 8:52.", "if": "flag.hollisFramed" },
    { "line": "Hollis Fenn is the only man ever to win a Town Meeting argument that started with a stopped watch.", "if": "flag.hollisMeetingWin" },
    { "line": "Hollis Fenn was suspended for trespassing in his own office. He thinks Tobias tipped them off.", "if": "flag.hollisCaught" },
    { "line": "Hollis Fenn, GS-9, still owns a watch that runs four minutes slow. He says it keeps him humble.", "if": "flag.hollisWin" },
    { "line": "Hollis Fenn never did find out who sold him out. He has his suspicions. He has a lot of suspicions.", "if": "!flag.hollisWin && flag.hollisBetrayed" },
    { "line": "Hollis and Agathe still meet every Friday to compare notes on Deputy Director Crane.", "if": "!flag.hollisWin && !flag.hollisBetrayed && flag.hollisAlone" }
  ]
});
