// Pawn Champ - The Halvorsen Plates: old star photographs, and one star that keeps getting closer.
// Major quest M21, the deep set (docs/quests/MAJOR.md#m21-the-halvorsen-plates-uncanny).
//
// Hook (W1 Tue-Thu)          Leo Halvorsen pawns a crate of glass-plate negatives from the shut observatory.
// Middle (shop)              Leo sells the observatory telescope; Hester names the night the Athenaeum
//                            keeps late; Ottoline Corliss wants the plates ($120, then $350).
// Scene 1 (W2 Thu-W3 Tue)    the Athenaeum basement: Augusta Halvorsen's logs.
// Scene 2 (W3 Wed-W4 Mon)    the Signal Hill observatory: crank the slit open and look.
// Finale (W4 Tue-Thu)        Harbor Green, the whole town looking up.
// Looks: Augusta's last entry; watching through the telescope.
// The loan is $60; Leo redeems it for $78. After Correspondence, Augusta brings you something from
// 1932 each Monday. The observatory is drawn in js/places/observatory.js; the "observatory" hook moves
// its slit and window.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/plates.js.
defineStory({
  "id": "plates",
  "kind": "major",
  "colour": "#4a5aa0",
  "family": "uncanny",
  "group": "deep",
  "title": "The Halvorsen Plates",
  "crosses": ["psalter", "breakwaters"],
  "rumour": "A crate of old star photographs, and one star that keeps getting closer.",
  "endings": { "shuttered": "Shuttered", "correspondence": "Correspondence", "published": "Everyone Looking Up", "shelf": "Left on the Shelf" },
  "about": [
    "Cosmic horror on a small scale, and part of the deep set (some choices are Looks). Leo Halvorsen, who fixes bikes, pawns a crate of glass star photographs from his great-grandmother Augusta's observatory on Signal Hill (§{leoPlates}). One star on them, not in any catalogue, gets brighter on every plate, and the last plate shows the observatory dome from above. Then he sells you her telescope, which keeps swinging round to point just over the lighthouse (§{leoScope}).",
    "Hester invites you to read Augusta's logs in the Athenaeum basement (§{hesterPlates}, §{platesLogs}). The star is a window, and it comes closer when it is looked at. Augusta vanished in 1932, the day after she tried to hold it off from the other side. Meanwhile an amateur astronomer, Ottoline Corliss, wants to buy the plates and post them online (§{ottolinePlates}). Selling them, though they're Leo's pawn, ends the story with the whole world looking up (Everyone Looking Up).",
    "At the observatory (§{platesDome}) the window is a lit room with Augusta inside, holding up a plate that says CLOSE IT. On the night of the star (§{platesGreen}) half the town is on Harbor Green looking up, and every look brings it closer. Smash the plates and the telescope lens on the bandstand steps to shut it (Shuttered). If you've had a Look in the deep set, line up the dome plate in the telescope and bring Augusta home (Correspondence); she moves into Leo's spare room and brings you mint 1930s stock on Mondays. Or give Leo his plates back and leave it to him (Left on the Shelf)."
  ],
  "cast": {
    "leo": {
      "name": "Leo Halvorsen",
      "look": { "skin": "#f0c8a8", "hair": "#d8a050", "hs": 4, "coat": "#c84a2a", "style": "hoodie", "pants": "#2a3a4a", "hat": "beanie", "hatc": "#2a2a2a" }
    },
    "augusta": {
      "name": "Dr. Augusta Halvorsen",
      "look": { "skin": "#f0d0b8", "hair": "#3a2a1e", "hs": 3, "coat": "#3a3a4a", "trim": "#c8c0a8", "style": "jacket", "long": true, "pants": "#2a2a30", "hat": "wide", "hatc": "#2a2a30" }
    },
    "ottoline": {
      "name": "Ottoline Corliss",
      "look": { "skin": "#c89070", "hair": "#1e1a16", "hs": 4, "coat": "#e8e0c8", "style": "puffer", "pants": "#3a3a42", "glasses": "#2a2a2e", "bag": "#3a5a7a" }
    }
  },
  "icons": {
    "plates": [
      "............",
      ".kkkkkkkkkk.",
      ".kwwwwwwwwk.",
      ".kwkkkkkkwk.",
      ".kwkddddkwk.",
      ".kwkdSddkwk.",
      ".kwkddSdkwk.",
      ".kwkkkkkkwk.",
      ".kwwwwwwwwk.",
      ".kWWWWWWWWk.",
      ".kkkkkkkkkk.",
      "............"
    ],
    "scope": [
      "..........kk",
      ".........kyk",
      "........kyyk",
      ".......kyyk.",
      "......kyyk..",
      ".....kyyk...",
      "....kyyk....",
      "...kook.....",
      "..k.kk......",
      ".k..k.k.....",
      "k...k..k....",
      "....k......."
    ]
  },
  "uniques": {
    "plates": {
      "name": "The Halvorsen plates",
      "icon": "plates",
      "cat": "curio",
      "guide": 60,
      "questKey": true,
      "condLabel": "41 glass negatives",
      "wantedBy": { "name": "Ottoline Corliss", "mult": 2 },
      "wantedKnown": "flag.platesOttoline",
      "tells": [
        "Glass star plates, 1929 to 1932, labelled in a neat hand: A. HALVORSEN, SIGNAL HILL.",
        "One faint star is ringed in red ink, \"not in any catalogue\". It's brighter on every plate after.",
        "The last plate, 4 October 1932, isn't the sky. It's the observatory dome, photographed from above."
      ]
    },
    "halvorsenScope": {
      "name": "Telescope from the old observatory",
      "icon": "scope",
      "cat": "curio",
      "guide": 130,
      "condLabel": "Brass, dented",
      "tells": [
        "A brass refractor, five-inch, ALVAN CLARK on the tube.",
        "Set it down anywhere and it swings, slowly, to point just above the lighthouse."
      ]
    },
    "augusta0": {
      "name": "A 1932 fountain pen, never used",
      "icon": "inkwell",
      "cat": "curio",
      "guide": 60,
      "condLabel": "Mint, 1932",
      "tells": ["Brand new. Ninety-four years old."]
    },
    "augusta1": {
      "name": "A cloche hat, still in its box",
      "icon": "purse",
      "cat": "curio",
      "guide": 45,
      "condLabel": "Mint, 1932",
      "tells": ["Brand new. Ninety-four years old."]
    },
    "augusta2": {
      "name": "A tin of tooth powder, sealed",
      "icon": "tin",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Mint, 1932",
      "tells": ["Brand new. Ninety-four years old."]
    }
  },
  "soundings": { "plates-entry": "There is a window above Hollow Neck that opens onto somewhere else, and it comes closer when it is looked at. It lines up with Signal Hill and the lighthouse.", "plates-watched": "Augusta Halvorsen has been watching the window from the other side since 1932, holding it shut with her eyes." },
  "overheard": [
    { "line": "Squinting: \"My star app says there's nothing there. There's something there. Over the lighthouse.\"" }
  ],
  "scenes": {
    "leoPlates": {
      "title": "Leo Halvorsen pawns the plates",
      "customer": "leo",
      "steps": [
        { "say": "leo", "text": "Leo Halvorsen. Bike repair, Water Street. My great-grandmother ran the observatory up on Signal Hill till 1932. The town's finally selling the hill, so I'm clearing it out." },
        { "view": { "counterIcon": "plates" } },
        { "narrate": "A wooden crate of glass negatives, each in a paper sleeve. Star fields, labelled in a neat, upright hand." },
        { "say": "leo", "text": "Hold one up to the window. Pretty, right? I need sixty bucks till the bike season. I'll come back for them. Probably." },
        {
          "choose": [
            { "label": "Lend him $60 on the crate", "then": [{ "view": { "counterIcon": null } }] },
            {
              "label": "\"I don't deal in glass, Leo.\"",
              "then": [
                { "view": { "counterIcon": null } },
                { "say": "leo", "text": "Fair. Scrap man'll give me eight bucks. Bye, Great-Gran." },
                { "set": { "platesRefused": true } },
                { "leave": "leo" },
                { "end": true }
              ]
            }
          ]
        },
        { "add": { "unique": "plates", "paid": 60 } },
        { "coin": -60, "why": "Lent $60 to Leo Halvorsen against a crate of glass plates" },
        { "set": { "platesPawned": true } },
        { "narrate": "When he's gone you hold the plates up to the window, one after another. A star ringed in red: \"not in any catalogue\". Brighter on every plate. The last plate isn't the sky at all. It's the observatory dome, photographed from above." },
        { "leave": "leo" }
      ]
    },
    "leoScope": {
      "title": "Leo sells the telescope",
      "customer": "leo",
      "steps": [
        { "say": "leo", "text": "Me again. Found the telescope under a tarp. It's brass, it's heavy, and it keeps swinging round on its own to point at the lighthouse. Just over it, actually." },
        {
          "offer": { "unique": "halvorsenScope" },
          "persona": "honest",
          "asking": 60,
          "min": 40,
          "onWatch": "continue"
        },
        { "say": "leo", "text": "Everybody's phone says there's nothing up there. My eyes say otherwise. Night after night." },
        { "leave": "leo" }
      ]
    },
    "hesterPlates": {
      "title": "Hester: Augusta's logs",
      "customer": "hester",
      "steps": [
        {
          "say": "hester",
          "text": [
            "You have a crate of glass. Don't look like that; I know everything that leaves Signal Hill.",
            "The Athenaeum has Augusta Halvorsen's observing logs in the basement. I've never read past 1931. I'd rather not read past it alone.",
            "We keep late on {placed:plates-logs} night. Bring Leo."
          ]
        },
        { "set": { "platesHester": true } },
        { "toast": "Calendar: the Athenaeum basement, {placed:plates-logs} night", "look": "hester" },
        { "leave": "hester" }
      ]
    },
    "ottolinePlates": {
      "title": "Ottoline Corliss wants the plates",
      "customer": "ottoline",
      "note": "she comes up to twice: $120, then $350",
      "steps": [
        { "hook": "countVisit", "with": "ottolineVisits" },
        { "set": { "platesOttoline": true } },
        {
          "say": "ottoline",
          "text": { "if": "flag.ottolineVisits == 1", "then": "Ottoline Corliss. I photograph the sky from my garage roof. I hear you have the Halvorsen plates. Everybody's seen the new star. I'd like to show them where it came from.", "else": "It's brighter every night. The plates. Please. The whole internet wants to know." }
        },
        { "find": "p", "in": "stock", "match": { "uniqueId": "plates" } },
        {
          "if": "!p",
          "then": [{ "say": "ottoline", "text": "Gone? Oh, no." }, { "leave": "ottoline" }, { "end": true }]
        },
        {
          "choose": [
            {
              "label": { "if": "flag.ottolineVisits == 1", "then": "Sell her the plates for $120", "else": "Sell her the plates for $350" },
              "hint": "(they're Leo's pawn: rep -4)",
              "then": [
                { "take": "p" },
                { "coin": 120, "why": "Sold the Halvorsen plates to Ottoline Corliss", "if": "flag.ottolineVisits == 1" },
                { "coin": 350, "why": "Sold the Halvorsen plates to Ottoline Corliss", "if": "flag.ottolineVisits != 1" },
                { "rep": -4 },
                { "set": { "platesEnd": "published", "platesDone": true } },
                { "say": "ottoline", "text": "Thank you! They're going up tonight. Everyone's going to see this." }
              ]
            },
            {
              "label": "\"Not yet.\"",
              "then": [{ "say": "ottoline", "text": "I'll come back. Everyone will." }]
            }
          ]
        },
        { "leave": "ottoline" }
      ]
    },
    "platesLogs": {
      "title": "Augusta's logs",
      "music": "stars",
      "steps": [
        {
          "stage": "athenaeumBasement",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
            { "id": "leo", "cast": "leo", "at": [140, 164] },
            { "id": "hester", "cast": "hester", "at": [220, 160], "facingLeft": true }
          ]
        },
        { "narrate": "The Athenaeum basement, after hours. Hester has three green logbooks on the reading table under the one good lamp." },
        { "say": "hester", "text": "Augusta Halvorsen. First woman with a doctorate in astronomy from the state college. The town thought she was mad. The college thought she was right. Here." },
        { "narrate": "Careful, dull entries for two years. Then: \"The object in Cepheus is not distant. Its parallax is impossible. It is approaching on a line that passes through Signal Hill and Gull Point light.\"" },
        { "say": "leo", "text": "She built a shutter for the dome. Dad said so. Nobody knew what for." },
        { "narrate": "Professor Pye looks up from the next table, where he's been reading about wolves. \"I read those in 1979,\" he says. \"I went back to the werewolves. Werewolves are a much safer problem.\"", "if": "quest.psalter" },
        {
          "choose": [
            {
              "label": "Read her last entry",
              "hint": "(Look)",
              "then": [
                { "narrate": "3 October 1932. \"It is a window. There is a room behind it, and a desk, and someone has been sitting at it watching us for longer than we have been looking. It comes closer when it is looked at. I believe it can be held off the same way, from the other side. Tomorrow I will try.\"" },
                { "sounding": "plates-entry" },
                { "say": "hester", "text": "There is no entry for the fourth of October." }
              ]
            },
            { "label": "Close the logbook" }
          ]
        },
        { "say": "leo", "text": "I've still got a key to the observatory. {placed:plates-dome} night. Let's see what she saw." },
        { "set": { "platesLogsRead": true } },
        { "toast": "Calendar: the Signal Hill observatory, {placed:plates-dome} night", "look": "leo" }
      ]
    },
    "platesDome": {
      "title": "The observatory",
      "music": "stars",
      "steps": [
        { "hook": "observatory", "with": { "slit": 0, "window": 0.2 } },
        {
          "stage": "observatory",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 164] },
            { "id": "leo", "cast": "leo", "at": [160, 164] }
          ]
        },
        { "narrate": "The observatory on Signal Hill: a plaster dome cracked like an egg, a brass crank, a mount with nothing on it. The whole town is below you, and the lighthouse turning beyond it." },
        { "find": "scope", "in": "stock", "match": { "uniqueId": "halvorsenScope" } },
        { "narrate": "You and Leo set the telescope back on its mount. It swings round before you've tightened the clamp.", "if": "scope" },
        { "say": "leo", "text": "Okay. Cranking. Tell me when." },
        { "hook": "observatory", "with": { "slit": 1 } },
        { "view": { "bg": "observatorySky" } },
        { "hook": "observatory", "with": { "window": 0.6 } },
        {
          "narrate": [
            "The slit opens on stars. And there, just above the lighthouse, one that isn't a star at all: a small lit square, like a window across a street at night.",
            "Through the eyepiece it's a room. A desk, a lamp, a woman in a long coat writing. She looks up. She looks straight at you. She holds a glass plate up against her side of the window: CLOSE IT."
          ]
        },
        {
          "choose": [
            {
              "label": "Keep watching",
              "hint": "(Look)",
              "then": [
                { "hook": "observatory", "with": { "window": 1 } },
                { "narrate": "She sighs, the way people do with a child who won't go to bed, and holds up a second plate. It's a photograph of the Crooked Scale's window, from above. Then she goes back to watching, very hard, and the window gets a little smaller." },
                { "sounding": "plates-watched" }
              ]
            },
            { "label": "Crank the slit shut" }
          ]
        },
        { "hook": "observatory", "with": { "slit": 0 } },
        {
          "say": "leo",
          "text": [
            "That was her. That was Great-Gran. She's been holding it off. For ninety years.",
            "It's too close now. Everybody can see it. They're all going to be on the Green looking at it, and every look makes it worse. We need to be there."
          ]
        },
        { "set": { "platesDome": true } },
        { "toast": "Calendar: Harbor Green, the night of the star", "look": "leo" }
      ]
    },
    "platesGreen": {
      "title": "The night of the star",
      "music": "stars",
      "steps": [
        {
          "stage": "greenNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 164] },
            { "id": "leo", "cast": "leo", "at": [140, 164] },
            {
              "id": "neighbour",
              "look": "random",
              "at": [[190, 156], [212, 160], [234, 156], [256, 160]],
              "facingLeft": true
            }
          ]
        },
        { "narrate": "Harbor Green, after dark. Half the town is out in lawn chairs with blankets and thermoses, looking up. Over the lighthouse the window is as big as the moon now, and lit, and getting bigger every time somebody points." },
        { "narrate": "Somebody on the Green says the Breakwaters played their last gig in 1989 under a new star, right about there. Nobody else remembers it.", "if": "quest.breakwaters" },
        { "find": "p", "in": "stock", "match": { "uniqueId": "plates" } },
        { "find": "scope", "in": "stock", "match": { "uniqueId": "halvorsenScope" } },
        {
          "choose": [
            {
              "label": "Smash the plates on the bandstand steps",
              "hint": { "if": "scope", "then": "(and the telescope's lens)", "else": "" },
              "if": "p",
              "then": [
                { "take": "p" },
                { "take": "scope" },
                { "narrate": "Forty-one plates break on the bandstand steps like a dropped tray of glasses. The telescope lens goes last. Over the lighthouse the window flickers, and dims, and is a star, and then is nothing." },
                {
                  "choose": [
                    {
                      "label": "Pay Leo what the plates were worth",
                      "hint": "(-$120, rep +4)",
                      "then": [{ "coin": -120, "why": "Paid Leo Halvorsen for the plates" }, { "rep": 4 }]
                    },
                    { "label": "Don't" }
                  ]
                },
                { "set": { "platesEnd": "shuttered" } }
              ]
            },
            {
              "label": "Set the 1932 plate in the telescope like a slide, and point it up",
              "if": "p && scope && flag.deepLooks >= 1",
              "then": [
                { "take": "p" },
                {
                  "narrate": [
                    "You slide the last plate, the dome from above, into the eyepiece holder. You point the telescope at the window. For a moment the two pictures line up: her room, your hill, the same moment from both sides.",
                    "The window closes like an eye. And there's a woman on the Green in a long 1930s coat, holding a lamp, who would like very much to know what year it is."
                  ]
                },
                { "enter": { "id": "augusta", "cast": "augusta", "at": [180, 164], "facingLeft": true } },
                { "say": "augusta", "text": "Ninety-four years? Good heavens. I'd have brought a bag." },
                { "say": "leo", "text": "Hi. Um. Hi. I'm Leo. You're my great-grandmother. You can have my spare room." },
                { "rep": 6, "why": "Brought Augusta Halvorsen home" },
                { "set": { "platesEnd": "correspondence" } }
              ]
            },
            {
              "label": "Give Leo his plates back and let him decide",
              "then": [
                {
                  "if": "p",
                  "then": [{ "take": "p" }, { "coin": 78, "why": "Leo Halvorsen redeemed his plates" }]
                },
                { "say": "leo", "text": "I'll put them back in the dome. In the dark. Where she kept them." },
                { "narrate": "By the next night the window is a faint star again. By the end of the week only Mister Fathom still watches it." },
                { "set": { "platesEnd": "shelf" } }
              ]
            }
          ]
        },
        { "set": { "platesDone": true } }
      ]
    }
  },
  "beats": [
    { "drift": "plates-hook", "from": "1-2", "to": "1-4", "cast": "leo", "scene": "leoPlates" },
    { "drift": "plates-scope", "from": "2-1", "to": "2-2", "cast": "leo", "scene": "leoScope", "if": "flag.platesPawned && !flag.platesDone && shelf.free" },
    { "drift": "plates-hester", "from": "2-2", "to": "2-3", "cast": "hester", "scene": "hesterPlates", "if": "hook.platesHere && !flag.platesDone" },
    { "drift": "plates-otto1", "from": "2-4", "to": "3-2", "cast": "ottoline", "scene": "ottolinePlates", "if": "hook.platesHere && !flag.platesDone && !flag.ottolineVisits" },
    { "drift": "plates-otto2", "from": "4-1", "to": "4-2", "cast": "ottoline", "scene": "ottolinePlates", "if": "hook.platesHere && !flag.platesDone && flag.ottolineVisits == 1" }
  ],
  "nights": [
    {
      "id": "plates-logs",
      "window": ["2-4", "3-2"],
      "if": "flag.platesHester && !flag.platesDone",
      "scene": "platesLogs",
      "test": [{ "set": { "platesHester": true } }, { "add": { "unique": "plates" } }]
    },
    {
      "id": "plates-dome",
      "window": ["3-3", "4-1"],
      "if": "flag.platesLogsRead && !flag.platesDone",
      "scene": "platesDome",
      "test": [
        { "set": { "platesLogsRead": true } },
        { "add": { "unique": "plates" } },
        { "add": { "unique": "halvorsenScope" } }
      ]
    },
    {
      "id": "plates-green",
      "window": ["4-2", "4-4"],
      "if": "flag.platesDome && !flag.platesDone",
      "scene": "platesGreen",
      "test": [
        { "set": { "platesDome": true, "deepLooks": 1 } },
        { "add": { "unique": "plates" } },
        { "add": { "unique": "halvorsenScope" } }
      ]
    }
  ],
  "calendar": [
    { "id": "plates-logs", "night": "plates-logs", "story": "plates", "where": "The Athenaeum basement", "title": "Augusta's logs", "known": "flag.platesHester", "scene": "platesLogs" },
    { "id": "plates-dome", "night": "plates-dome", "story": "plates", "where": "Signal Hill", "title": "The observatory", "known": "flag.platesLogsRead", "scene": "platesDome" },
    { "id": "plates-green", "night": "plates-green", "story": "plates", "where": "Harbor Green", "title": "The night of the star", "known": "flag.platesDome", "scene": "platesGreen" }
  ],
  "mornings": [
    {
      "if": "flag.platesEnd == 'correspondence' && day == 1 && shelf.free",
      "note": "after Correspondence: Augusta sells you something from 1932 each Monday",
      "then": [
        {
          "if": "flag.augustaGoods == 2",
          "then": [
            { "add": { "unique": "augusta2" } },
            { "set": { "augustaGoods": 3 } },
            { "refresh": "panel" },
            { "toast": "Augusta Halvorsen dropped by with a tin of tooth powder, sealed. \"Mint condition. Obviously.\"", "look": "augusta" }
          ]
        },
        {
          "if": "flag.augustaGoods == 1",
          "then": [
            { "add": { "unique": "augusta1" } },
            { "set": { "augustaGoods": 2 } },
            { "refresh": "panel" },
            { "toast": "Augusta Halvorsen dropped by with a cloche hat, still in its box. \"Mint condition. Obviously.\"", "look": "augusta" }
          ]
        },
        {
          "if": "!flag.augustaGoods",
          "then": [
            { "add": { "unique": "augusta0" } },
            { "set": { "augustaGoods": 1 } },
            { "refresh": "panel" },
            { "toast": "Augusta Halvorsen dropped by with a 1932 fountain pen, never used. \"Mint condition. Obviously.\"", "look": "augusta" }
          ]
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "There is no new star over Hollow Neck. Leo Halvorsen sweeps the last of the glass off the bandstand steps every spring, though there isn't any left.", "if": "flag.platesEnd == 'shuttered'" },
    { "line": "Augusta Halvorsen lives in Leo's spare room and is learning to use a phone. She has opinions about it. She has opinions about everything since 1932.", "if": "flag.platesEnd == 'correspondence'" },
    { "line": "The Halvorsen star is on every news site. Everyone in the world is looking up at it. It is very bright now.", "if": "flag.platesEnd == 'published'" },
    { "line": "The plates are back in the dark of the dome on Signal Hill. Some nights the star over the lighthouse is a little brighter, and some nights a little less, like someone resting their eyes.", "if": "flag.platesEnd == 'shelf'" }
  ],
  "outcome": "flag.platesEnd"
});
