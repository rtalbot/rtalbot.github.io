// Pawn Champ - The Snow Globe. Minor quest m17, batch A (docs/quests/MINOR.md#m17-the-snow-globe).
// A snow globe from Saint Brine's donations box knows tomorrow's weather. A boy at the home wants
// it back: it was his mother's.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/snowglobe.js.
defineStory({
  "id": "snowglobe",
  "months": [1, 2, 3, 4, 5],
  "kind": "minor",
  "title": "The Snow Globe",
  "location": "saintbrines",
  "rumour": "There's a snow globe at Saint Brine's that knows the weather.",
  "endings": { "theos": "Theo's", "forecast": "Forecast" },
  "about": [
    "A small story. Father Ignatius sells you the Saint Brine's donations box for $15, including a snow globe the children swear knows the weather (§{globeBox}). Theo, a boy who lives at Saint Brine's, comes in: it was his mother's, and Ignatius sold it by accident. He has no money, but asks you to come and see where it belongs (§{globeTheo}).",
    "At Saint Brine's (§{globeVisit}) he shows you the worn round mark on the end windowsill. His mother, who worked the ferry, shook it every morning to see if she'd need her raincoat, and left it to him when she got sick. Put it back on the windowsill (Theo's), or keep it, and each morning it tells you whether it will rain tomorrow (Forecast)."
  ],
  "cast": {
    "theo": {
      "name": "Theo",
      "look": { "kid": true, "skin": "#e0b090", "hair": "#c8a050", "hs": 0, "coat": "#3a6aa8", "style": "puffer", "pants": "#3a3a42", "hat": "beanie", "hatc": "#c84a3a" }
    }
  },
  "uniques": {
    "snowGlobe": {
      "name": "Hollow Neck snow globe",
      "icon": "snowglobe",
      "cat": "curio",
      "guide": 30,
      "tells": [
        "The lighthouse, the ferry, a little snow. Shake it and the sky inside goes grey, or doesn't. It has never been wrong."
      ]
    }
  },
  "overheard": [
    { "line": "Shaking their head: \"The kids at Saint Brine's have a snow globe that knows the weather. Better than the TV.\"" }
  ],
  "scenes": {
    "globeBox": {
      "title": "Father Ignatius brings the donations box",
      "customer": "ignatius",
      "steps": [
        {
          "say": "ignatius",
          "text": [
            "Father Ignatius, from Saint Brine's! Sister Amabel sent me with the donations box. The things we can't use! Fifteen dollars for the lot?",
            "There's a snow globe in there the children swear knows the weather! I've never seen it wrong, but then I've never looked!"
          ]
        },
        { "view": { "counterIcon": "snowglobe" } },
        {
          "choose": [
            { "label": "Buy the box for $15", "disabled": "coin < 15" },
            { "label": "\"Not today, Father.\"" }
          ],
          "as": "box"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "box == 0",
          "then": [
            { "coin": -15, "why": "Bought Saint Brine's donations box" },
            { "add": { "unique": "snowGlobe", "paid": 15 } },
            { "refresh": "panel" },
            { "set": { "globeBought": true } },
            { "say": "ignatius", "text": "Bless you! What? No, I heard you. Bless you!" }
          ],
          "else": [{ "say": "ignatius", "text": "Another time! Sorry? Another time!" }]
        },
        { "leave": "ignatius" }
      ]
    },
    "globeTheo": {
      "title": "Theo asks after his mum's snow globe",
      "customer": "theo",
      "steps": [
        {
          "say": "theo",
          "text": [
            "I'm Theo. I live at Saint Brine's. Father Ignatius sold you my mum's snow globe. By accident. He does that.",
            "I don't have any money. But could you come and see where it goes? On the windowsill. Then you'd know."
          ]
        },
        { "set": { "globeKnown": true } },
        { "plan": "snowglobe-theo" },
        { "say": "theo", "text": "{when:snowglobe-theo|cap|or:One day this week}, at lunch. That's when we're allowed visitors." },
        { "toast": "Calendar: Theo at Saint Brine's, {when:snowglobe-theo} at noon", "look": "theo", "if": "errand.snowglobe-theo" },
        { "leave": "theo" }
      ]
    },
    "globeVisit": {
      "title": "Theo's windowsill",
      "steps": [
        {
          "stage": "saintbrines",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [110, 166] },
            { "id": "theo", "cast": "theo", "at": [190, 168], "facingLeft": true }
          ]
        },
        { "narrate": "Saint Brine's at lunchtime. Theo walks you to the end windowsill, where the paint is worn into a small round mark." },
        {
          "say": "theo",
          "text": [
            "Mum worked the ferry. Every morning she'd shake it to see if she needed her raincoat. If it went grey, it rained. It always did.",
            "She left it here for me when she got sick. I shake it every morning. Then I know one thing about tomorrow, at least."
          ]
        },
        { "find": "globe", "in": "stock", "match": { "uniqueId": "snowGlobe" } },
        {
          "if": "!globe",
          "then": [
            { "set": { "globeEnd": "forecast" }, "if": "!flag.globeEnd" },
            { "narrate": "You don't have it anymore. You tell him that. He nods, the way kids nod when they're used to it." },
            { "end": true }
          ]
        },
        {
          "choose": [
            {
              "label": "Put it back on the windowsill",
              "then": [
                { "take": "globe" },
                { "set": { "globeEnd": "theos" } },
                { "rep": 5, "why": "Gave Theo back his mother's snow globe" },
                { "narrate": "You set it in the worn round mark. It fits exactly. Theo shakes it. Clear skies tomorrow." },
                { "say": "theo", "text": "Told you. It knows." }
              ]
            },
            {
              "label": "Keep it. It's a good forecast, and you paid for it.",
              "then": [
                { "set": { "globeEnd": "forecast" } },
                {
                  "edit": "globe",
                  "set": {
                    "questKey": false,
                    "nosale": false,
                    "effect": { "forecast": 1 },
                    "effectText": "Each morning, shows whether tomorrow brings rain"
                  }
                },
                { "say": "theo", "text": "Okay. Will you shake it every morning, though? It doesn't work if nobody shakes it." }
              ]
            }
          ]
        },
        { "refresh": "panel" }
      ]
    }
  },
  "beats": [
    { "at": "1-5", "cast": "ignatius", "scene": "globeBox" },
    { "at": "2-2", "cast": "theo", "scene": "globeTheo", "if": "hook.globeHere" }
  ],
  "errands": [
    {
      "id": "snowglobe-theo",
      "title": "Theo's windowsill",
      "where": "Saint Brine's",
      "scene": "globeVisit",
      "test": [{ "add": { "unique": "snowGlobe" } }, { "set": { "globeKnown": true } }]
    }
  ],
  "calendar": [
    { "id": "snowglobe-theo", "errand": "snowglobe-theo", "story": "snowglobe", "where": "Saint Brine's", "title": "Theo's windowsill", "known": "flag.globeKnown", "scene": "globeVisit" }
  ],
  "mornings": [
    { "find": "globe", "in": "stock", "match": { "uniqueId": "snowGlobe" } },
    {
      "if": "globe && globe.effect.forecast && !(week == 4 && day == 5)",
      "note": "Kept, the globe tells you each morning whether tomorrow is a rain day (the shop's rain, if the shop secrets are in: js/secrets.js).",
      "then": [
        {
          "toast": { "if": "hook.rainTomorrow", "then": "You shake the snow globe. The sky inside goes grey: rain tomorrow.", "else": "You shake the snow globe. Clear skies inside: no rain tomorrow." },
          "icon": "snowglobe"
        }
      ]
    }
  ],
  "epilogue": [
    { "line": "Theo shakes his mother's snow globe every morning on the end windowsill at Saint Brine's. It's never been wrong.", "if": "flag.globeEnd == 'theos'" },
    { "line": "The snow globe sits by the till. You shake it every morning. You're not sure who you're doing it for.", "if": "flag.globeEnd == 'forecast'" }
  ],
  "outcome": "flag.globeEnd"
});
