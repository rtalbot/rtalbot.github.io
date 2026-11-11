// Pawn Champ - New Year's Eve at the Anchor: the sequel to M12 The Breakwaters Reunion
// (docs/quests/SEQUELS.md#new-years-eve-at-the-anchor). Batch U, round 3.
// December only, and only if the reunion didn't end Last Chord: the Breakwaters play the Rusty
// Anchor on New Year's Eve.
//
// Hook (W1-W2)   Dee Marchetti: Ruthie has booked them for New Year's Eve, and they need something to
//                ring in midnight with. Lend them a bell or an instrument off your shelves, or don't.
// Scene (W4)     New Year's Eve at the Anchor. Dee asks you to choose the last song before midnight.
// Endings: Odile at Midnight (Odile in the Fog), Everybody Sings (the song everyone knows), A Song for
// the Shop (Dee's new one, about The Crooked Scale).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/newyear.js.
defineStory({
  "id": "newyear",
  "kind": "minor",
  "title": "New Year's Eve at the Anchor",
  "location": "rustyanchor",
  "sequel": "breakwaters",
  "after": ["odile", "oneMore"],
  "months": [3],
  "rumour": "The Breakwaters are playing the Rusty Anchor on New Year's Eve.",
  "teaser": "A poster in the Rusty Anchor's window, hand-drawn: THE BREAKWATERS. NEW YEAR'S EVE. NO COVER. NO MERCY.",
  "endings": { "fog": "Odile at Midnight", "everybody": "Everybody Sings", "shop": "A Song for the Shop" },
  "about": [
    "A December sequel to The Breakwaters. Dee Marchetti's band is booked to play the Rusty Anchor all New Year's Eve, and Wanda wants something loud to ring in midnight (§{nyDee}). You can lend something from your shelves that makes a noise, which comes back with a teaspoon dent.",
    "On the night (§{nyNight}) Dee asks you to pick the last song before the countdown: \"Odile in the Fog\" (Odile at Midnight), which plays differently depending on how The Breakwaters ended; the song everyone knows, with Ruthie conducting from the bar (Everybody Sings); or something new, a song about your shop (A Song for the Shop)."
  ],
  "notes": "What rings in the New Year is the first thing on your shelves that makes a noise (an instrument, a bell, or silver), found by the findRinger hook. flag.nyLent holds the lent item's id until the night gives it back.",
  "uniques": {
    "nyLyric": {
      "name": "Lyric sheet, \"The Crooked Scale\"",
      "icon": "letter",
      "cat": "curio",
      "guide": 25,
      "condLabel": "Beer-ringed",
      "tells": [
        "Dee Marchetti's handwriting, in three colors of pen. \"There's a light on Main Street when the harbor goes dark / and a brass scale that weighs what you're worth...\"",
        "Signed by all four Breakwaters. Wanda signed it twice."
      ]
    }
  },
  "scenes": {
    "nyDee": {
      "title": "Dee needs something to ring in midnight",
      "customer": "dee",
      "steps": [
        {
          "say": "dee",
          "text": [
            "Dee Marchetti. Ruthie's booked us for New Year's Eve. The Anchor, the whole night, midnight and everything. We haven't played a midnight since 1993.",
            "Wanda says we need something to ring it in with. Something loud. Something you'd hear on Gannet Island. Have you got anything that makes a noise?"
          ]
        },
        { "hook": "findRinger", "sets": ["ringer"] },
        {
          "choose": [
            {
              "label": "Lend her something to ring in midnight with",
              "hint": { "if": "ringer", "then": "({ringer.name|lower})", "else": "(nothing on the shelves would do)" },
              "disabled": "!ringer",
              "then": [
                { "hook": "lend", "with": "ringer" },
                { "edit": "ringer", "set": { "nosale": true } },
                { "refresh": "panel" },
                { "say": "dee", "text": "The {ringer.name|lower}. Wanda will love it. Wanda will hit it with a spoon. You'll get it back. Mostly as it was." }
              ]
            },
            {
              "label": "\"Wanda will think of something. Wanda always thinks of something.\"",
              "then": [{ "say": "dee", "text": "She will. That's what frightens me." }]
            }
          ]
        },
        { "say": "dee", "text": "Come. You're practically in the band. Odile was practically in the band." },
        { "set": { "nyKnown": true } },
        { "toast": "Calendar: the Breakwaters at the Rusty Anchor, New Year's Eve", "look": "dee" },
        { "leave": "dee" }
      ]
    },
    "nyNight": {
      "title": "New Year's Eve",
      "music": "tender",
      "steps": [
        { "hook": "bandstand", "with": true },
        {
          "stage": "rustyanchor",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 168] },
            { "id": "punter", "look": "random", "at": [[24, 162], [44, 166], [66, 170]] },
            {
              "id": "drinker",
              "look": "random",
              "at": [[150, 162], [172, 166], [194, 170], [214, 162], [232, 166]],
              "facingLeft": true
            },
            { "id": "skip", "cast": "skip", "at": [248, 150] },
            { "id": "dee", "cast": "dee", "at": [268, 148], "facingLeft": true },
            { "id": "wanda", "cast": "wanda", "at": [288, 146], "facingLeft": true },
            { "id": "benny", "cast": "benny", "at": [306, 150], "facingLeft": true }
          ]
        },
        {
          "narrate": [
            "New Year's Eve at the Rusty Anchor. Paper hats, a tinsel garland on the ship's bell, snow coming in every time the door opens, and the whole of Hollow Neck that isn't asleep, which is most of it.",
            "The Breakwaters are louder than in October, and better, and Benny has bought a new bass and won't stop touching it."
          ]
        },
        { "hook": "findLent", "sets": ["lent"] },
        { "narrate": "Wanda has your {lent.name|lower} on a stand beside the drums, and every so often she taps it with a teaspoon, just to check it's still there.", "if": "lent" },
        { "say": "dee", "text": "Ten minutes to midnight. One more song before the countdown. You pick. You're the one who had Skip's guitar for thirty years." },
        {
          "choose": [
            {
              "label": "\"Odile in the Fog\"",
              "hint": { "if": "ended.breakwaters == 'odile'", "then": "", "else": "(side B, the one she's never sung)" },
              "then": [
                {
                  "narrate": { "if": "ended.breakwaters == 'odile'", "then": "Dee sings Odile in the Fog, and this time the bar sings the chorus with her, because they know it now. At the line about the blue light, nobody looks at you. They look out of the window, at the harbor, toward Gull Point.", "else": "Dee looks at you for a long second, then nods to Skip. She sings Odile in the Fog for the first time in thirty-four years. Her voice goes on the second verse and comes back on the third. Nobody in the Anchor moves." }
                },
                { "set": { "nyEnd": "fog" } },
                { "rep": 3 }
              ]
            },
            {
              "label": "The song everyone knows",
              "then": [
                { "narrate": "The song everyone knows. The whole Anchor sings it, much louder than the band, and Ruthie stands on the bar to conduct, and Skip lets the guitar go and just sings." },
                { "set": { "nyEnd": "everybody" } },
                { "rep": 2 }
              ]
            },
            {
              "label": "\"Is there anything new?\"",
              "then": [
                { "say": "dee", "text": "Funny you should ask." },
                { "narrate": "It's about a pawnshop on Main Street with a light on when the harbor goes dark. It's about you, or Odile, or both of you, or the shop. The chorus is easy enough that the bar has it by the second time round." },
                { "add": { "unique": "nyLyric" }, "if": "shelf.free" },
                { "refresh": "panel" },
                { "set": { "nyEnd": "shop" } },
                { "rep": 4, "why": "The Breakwaters wrote a song about the shop" }
              ]
            }
          ]
        },
        {
          "narrate": { "if": "lent", "then": "Then the countdown, and on twelve Wanda hits your {lent.name|lower} so hard you hear it ring in your teeth, and the ship's bell answers, and the whole bar is kissing and shouting and spilling things.", "else": "Then the countdown, and on twelve Wanda hits the ship's bell with a drumstick so hard it rings for a full minute, and the whole bar is kissing and shouting and spilling things." }
        },
        { "say": "skip", "text": "Happy New Year. One more night. I keep saying that, don't I." },
        {
          "if": "lent",
          "then": [
            { "edit": "lent", "set": { "nosale": false } },
            { "rep": 2 },
            { "toast": "Wanda gave you back the {lent.name|lower}. It has a small new dent, shaped like a teaspoon.", "look": "wanda" }
          ]
        },
        { "set": { "nyLent": null } },
        { "hook": "bandstand", "with": false },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [{ "drift": "ny-dee", "from": "1-2", "to": "2-2", "cast": "dee", "scene": "nyDee" }],
  "nights": [
    {
      "id": "ny-night",
      "window": ["4-3", "4-4"],
      "weekdays": [3, 4],
      "if": "flag.nyKnown && !flag.nyEnd",
      "scene": "nyNight",
      "test": [
        { "set": { "nyKnown": true, "bwGig": true } },
        { "roll": { "bwHeard": [true, false] } },
        {
          "if": "random < 0.5",
          "then": [{ "add": { "item": "lute" }, "as": "lute" }, { "hook": "lend", "with": "lute" }]
        }
      ]
    }
  ],
  "calendar": [
    { "id": "ny-night", "night": "ny-night", "story": "newyear", "where": "The Rusty Anchor", "title": "New Year's Eve", "known": "flag.nyKnown", "scene": "nyNight" }
  ],
  "epilogue": [
    { "hook": "giveBack", "note": "the night never came: whatever Dee borrowed is for sale again" },
    { "line": "The Breakwaters saw the New Year in with Odile in the Fog. Somebody recorded it on a phone. It has four hundred views, and three hundred and ninety of them are Hollow Neck.", "if": "flag.nyEnd == 'fog'" },
    { "line": "Ruthie conducted the Rusty Anchor from the bar at midnight. The bar has a dent in it now, and a brass plate to say so.", "if": "flag.nyEnd == 'everybody'" },
    { "line": "There's a song about The Crooked Scale. The Breakwaters close every set with it. You still don't know if it's about you or Odile.", "if": "flag.nyEnd == 'shop'" }
  ],
  "talk": {
    "by": "ruthie",
    "rumour": [
      "I've booked the Breakwaters for New Year's Eve. The whole night. I've never booked anybody for the whole night. I've never had to.",
      "Dee says they've got something new. Wanda says they've got something loud. I've taken the good glasses off the shelf."
    ],
    "react": { "fog": "They saw the year in with Odile in the Fog. The whole bar sang it. I cried into the ice bucket. Don't tell anyone. Tell everyone.", "everybody": "I conducted. From the bar. In heels. I don't remember getting down. I have a bruise shaped like a ship's bell.", "shop": "They wrote a song about your shop! Dee says it's about Odile. Skip says it's about you. Wanda says it's about the scale. They argue about it between sets." }
  },
  "outcome": "flag.nyEnd"
});
