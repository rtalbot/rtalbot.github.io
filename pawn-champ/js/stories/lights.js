// Pawn Champ - The Christmas Lights. Minor quest m32, batch I (docs/quests/MINOR.md#m32-the-christmas-lights).
// It's October and a lineman is buying every string of Christmas lights in town. His girlfriend works
// nights and has only ever seen Hollow Neck in the dark, so he's going to spell something on the Green.
// Odile's 1958 bubble lights are under your counter, and a collector wants them too.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/lights.js.
defineStory({
  "id": "lights",
  "months": [1],
  "kind": "minor",
  "title": "The Christmas Lights",
  "location": "green",
  "rumour": "Somebody's bought every string of Christmas lights in town. In October. Paid cash.",
  "endings": { "bubbles": "Bubble Lights", "mary": "Will You Mary Me" },
  "about": [
    "An October romance. Nolan Treadwell of the light company is buying every string of Christmas lights in town, and you find Odile's 1958 bubble lights under the counter (§{lightsNolan}). Lend them, sell them to him, or say you have none. He explains: Annika, who works nights in Hyannis, has only ever seen the town in the dark, so he's going to light up the Green for her. A Christmas-shop owner, Opal Sandeman, also wants the bubble lights (§{lightsOpal}).",
    "On the Green that night (§{lightsGreen}) you hold the ladder, watch for her car, or film it from behind the war memorial. If Odile's lights are there they fill the gap in the middle, and the message reads WILL YOU MARRY ME with nine bubbling candles (Bubble Lights). Without them Nolan runs out of R, and it reads WILL YOU MARY ME; she says yes anyway (Will You Mary Me)."
  ],
  "cast": {
    "nolan": {
      "name": "Nolan Treadwell",
      "look": { "skin": "#e0b090", "hair": "#7a5a3a", "hs": 0, "coat": "#e8a020", "style": "jacket", "trim": "#c8c8c0", "pants": "#3a4a5a", "hat": "cap", "hatc": "#2a3a5a", "beard": "#7a5a3a" }
    },
    "annika": {
      "name": "Annika Soule",
      "look": { "skin": "#f0d0b8", "hair": "#e8d8a0", "hs": 4, "coat": "#6aa0b0", "style": "puffer", "pants": "#5a8a9a" }
    },
    "opal": {
      "name": "Opal Sandeman",
      "look": { "skin": "#f0d8c8", "hair": "#c8c8d0", "hs": 3, "coat": "#c83a3a", "style": "dress", "pants": "#2a6a3a", "glasses": "#c8a050", "bag": "#2a6a3a" }
    }
  },
  "icons": {
    "bubbles": [
      "............",
      ".k..k..k..k.",
      ".r..b..g..a.",
      ".R..B..G..A.",
      ".r..b..g..a.",
      ".R..B..G..A.",
      "kkkkkkkkkkkk",
      ".kk.kk.kk.kk",
      "............",
      "..kkkkkkkk..",
      "..kPPPPPPk..",
      "..kkkkkkkk.."
    ]
  },
  "uniques": {
    "bubbleLights": {
      "name": "Odile's 1958 bubble lights",
      "icon": "bubbles",
      "cat": "curio",
      "guide": 40,
      "condLabel": "Fine",
      "tells": [
        "A string of nine glass candles. Plug them in and the liquid inside bubbles, eventually.",
        "The box says NOMA in red and XMAS - O. in Odile's marker."
      ],
      "wantedBy": { "name": "Opal Sandeman", "mult": 2.25 },
      "wantedKnown": "flag.lightsOpal"
    }
  },
  "overheard": [
    { "line": "Puzzled: \"Somebody's bought every string of Christmas lights in town. In October. Hal Mayhew says he paid cash and wore sunglasses.\"" }
  ],
  "scenes": {
    "lightsNolan": {
      "title": "Nolan wants every Christmas light in town",
      "customer": "nolan",
      "steps": [
        {
          "say": "nolan",
          "text": [
            "Nolan Treadwell, Hollow Neck Light and Power. Do you have Christmas lights? Any. I've bought every string in Mayhew's. And the CVS. And the church's.",
            "Yes, I know it's October."
          ]
        },
        { "narrate": "Under the counter, behind the receipt books, is a box marked XMAS - O. in Odile's marker: a string of glass bubble lights from 1958." },
        { "add": { "unique": "bubbleLights" }, "as": "box" },
        { "refresh": "panel" },
        { "view": { "counterIcon": "bubbles" } },
        {
          "choose": [
            { "label": "Lend them to him for the night" },
            { "label": "Sell them to him ($35)" },
            { "label": "\"Sorry. Nothing.\"" }
          ],
          "as": "lights"
        },
        { "view": { "counterIcon": null } },
        { "set": { "lightsIn": true } },
        {
          "if": "lights == 0",
          "then": [
            { "set": { "lightsNolan": "lent" } },
            { "edit": "box", "set": { "questKey": true, "nosale": true } },
            { "refresh": "panel" }
          ]
        },
        {
          "if": "lights == 1",
          "then": [
            { "set": { "lightsNolan": "bought" } },
            { "sell": "box", "to": "nolan" },
            { "coin": 35, "why": "Sold Odile's bubble lights to Nolan Treadwell" },
            { "refresh": "panel" }
          ]
        },
        { "say": "nolan", "if": "lights == 2", "text": "No? Okay. I'll drive to Hyannis." },
        {
          "say": "nolan",
          "text": [
            "Can I tell you why? You can't tell anyone. Annika works nights at the hospital in Hyannis. Two years. She's only ever seen this town in the dark, on her way home.",
            "So {placed:lights-green} night I'm lighting up the Green. Every string I could find. Spelling something. You should come. Bring a thermos."
          ]
        },
        { "toast": "Calendar: something on the Green, {placed:lights-green} night", "look": "nolan" },
        { "leave": "nolan" }
      ]
    },
    "lightsOpal": {
      "title": "Opal Sandeman wants the bubble lights",
      "customer": "opal",
      "steps": [
        { "set": { "lightsOpal": true } },
        { "say": "opal", "text": "Opal Sandeman. I run Christmas in Chatham, all year round, it's a whole thing. Hal Mayhew says you've got NOMA bubble lights. The 1958 ones." },
        { "find": "box", "in": "stock", "match": { "uniqueId": "bubbleLights" } },
        {
          "if": "!box",
          "then": [
            { "say": "opal", "text": "Gone? To a lineman? For a WHAT? Oh, that's lovely. That's terrible. Lovely." },
            { "leave": "opal" },
            { "end": true }
          ]
        },
        {
          "if": "box.questKey",
          "then": [
            { "say": "opal", "text": "Lent out till after the weekend? Well, if they come back in one piece, I'll give you {hook:opalPrice}. Bubble lights never come back in one piece." },
            { "leave": "opal" },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Sell them to her ({hook:opalPrice})",
              "then": [
                { "sell": "box", "to": "opal" },
                { "set": { "lightsSold": true } },
                { "hook": "payOpal", "with": "Sold Odile's bubble lights to Opal Sandeman" },
                { "refresh": "panel" },
                { "say": "opal", "text": "They're going in the front window. On a tree. In October. With all the others." }
              ]
            },
            {
              "label": "Not for sale",
              "then": [{ "say": "opal", "text": "You're sentimental. I respect it. I've got a card." }]
            }
          ]
        },
        { "leave": "opal" }
      ]
    },
    "lightsGreen": {
      "title": "Nolan's lights on the Green",
      "steps": [
        {
          "stage": "greenNight",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [92, 170] },
            { "id": "nolan", "cast": "nolan", "at": [150, 166] }
          ]
        },
        { "narrate": "Harbor Green, eleven at night. Every string of lights in Hollow Neck is laid out across the grass in letters ten feet tall, running back to one orange extension cord and a generator from Light and Power." },
        { "say": "nolan", "text": "Hold this. Don't plug it in. Don't let me plug it in. She's off at eleven-thirty and she drives past the Green to get home." },
        {
          "narrate": { "if": "flag.lightsNolan == 'lent' || flag.lightsNolan == 'bought'", "then": "In the middle of it, where a heart would be, he's laid Odile's bubble lights in a circle.", "else": "You walk the letters with him. W, I, L, L, Y, O, U, M, A, R, Y, M, E. You count them twice." }
        },
        {
          "choose": [
            { "label": "Hold the ladder" },
            { "label": "Watch the road for her headlights" },
            {
              "label": "Hide behind the war memorial with his phone, filming",
              "then": [
                { "narrate": "You crouch behind the war memorial. The names of every Hollow Neck man lost at sea since 1851 are very close to your face. It feels like the right audience." }
              ]
            }
          ]
        },
        { "enter": { "id": "annika", "cast": "annika", "at": [300, 160], "facingLeft": true } },
        { "narrate": "Headlights. A small car slows, stops. A woman in scrubs and a puffer jacket gets out and stands at the edge of the grass, in the dark." },
        { "walk": "annika", "to": [230, 162] },
        { "narrate": "Nolan throws the switch." },
        {
          "if": "flag.lightsNolan == 'lent' || flag.lightsNolan == 'bought'",
          "then": [
            { "set": { "lightsEnd": "bubbles" } },
            { "narrate": "The whole Green lights up: WILL YOU MARRY ME, in every color Mayhew's sells. In the middle, nine glass candles start, one after another, to bubble." },
            { "say": "annika", "text": "Oh. Oh, Nolan. Is this what it looks like? The town? Is this what it looks like in the light?" },
            { "say": "nolan", "text": "No. It's much worse. Will you?" },
            { "say": "annika", "text": "Yes. Yes. Turn it off before the neighbors call it in." },
            { "rep": 3 },
            { "find": "box", "in": "stock", "match": { "uniqueId": "bubbleLights" } },
            {
              "if": "box && flag.lightsNolan == 'lent'",
              "then": [
                { "edit": "box", "set": { "questKey": false, "nosale": false } },
                { "say": "nolan", "text": "Your lights. Every bulb. I counted. Thank you." }
              ]
            }
          ],
          "else": [
            { "set": { "lightsEnd": "mary" } },
            { "narrate": "The whole Green lights up, in every color Mayhew's sells: WILL YOU MARY ME." },
            { "say": "annika", "text": "My name's Annika." },
            { "say": "nolan", "text": "I ran out of R. There's no R left in this town. I checked the church." },
            { "say": "annika", "text": "Yes. Obviously yes. I'm calling you Mary from now on." },
            { "rep": 1 }
          ]
        }
      ]
    }
  },
  "beats": [
    { "at": "2-3", "cast": "nolan", "scene": "lightsNolan" },
    { "at": "2-4", "cast": "opal", "scene": "lightsOpal", "if": "flag.lightsIn && !flag.lightsEnd" }
  ],
  "nights": [
    {
      "id": "lights-green",
      "window": ["2-4", "3-4"],
      "if": "flag.lightsIn",
      "scene": "lightsGreen",
      "test": [{ "hook": "testNolan" }]
    }
  ],
  "calendar": [
    { "id": "lights-green", "night": "lights-green", "story": "lights", "where": "Harbor Green", "title": "Nolan's lights", "known": "flag.lightsIn", "scene": "lightsGreen" }
  ],
  "sold": { "bubbleLights": [{ "set": { "lightsSold": true } }] },
  "epilogue": [
    { "line": "Nolan and Annika are getting married in December, on the Green, at night. Odile's bubble lights are invited.", "if": "flag.lightsEnd == 'bubbles'" },
    { "line": "Annika Soule calls her fiance Mary. So does all of Hollow Neck Light and Power.", "if": "flag.lightsEnd == 'mary'" }
  ],
  "outcome": "flag.lightsEnd"
});
