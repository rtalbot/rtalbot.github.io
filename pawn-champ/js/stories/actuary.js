// Pawn Champ - The Actuary's Pen: a retired insurance man's fountain pen that knows how things end.
// Minor quest m41, batch G (docs/quests/MINOR.md).
// While you hold it, it tells you each morning how one pawned item will leave the shop, and it
// makes you a little gloomy. He wants it back before it tells him about himself.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/actuary.js.
defineStory({
  "id": "actuary",
  "kind": "minor",
  "title": "The Actuary's Pen",
  "location": "rustyanchor",
  "rumour": "A retired insurance man drinks alone at the Anchor and tells everyone their odds.",
  "endings": { "returned": "Back in His Pocket", "redeemed": "Redeemed", "kept": "The Odds on the Shelf" },
  "outcome": "flag.penEnd",
  "about": [
    "A small uncanny story. Emmett Ardley, a retired actuary, pawns the pen he was given when he retired: it writes down how things will end, and it's never wrong, and he'd like it somewhere else before it gets round to him (§{emmettPen}). While you hold it, it writes gloomy notes on your till roll each morning, including which loans will and won't come back.",
    "A few days later he wants it back, over lunch at the Rusty Anchor (§{actuaryAnchor}). Sell it back (Back in His Pocket); put it on the bar and let it write his ending, which turns out to be \"Redeemed\", and the pen goes quiet (Redeemed); or keep it (The Odds on the Shelf)."
  ],
  "cast": {
    "emmett": {
      "name": "Emmett Ardley",
      "look": { "skin": "#e8d0c0", "hair": "#9a9a9a", "hs": 0, "coat": "#4a4a52", "trim": "#2a2a30", "style": "suit", "long": true, "pants": "#3a3a42", "glasses": "#2a2a2e", "hat": "top", "hatc": "#2a2a30" }
    }
  },
  "uniques": {
    "actuaryPen": {
      "name": "The actuary's pen",
      "icon": "feather",
      "cat": "curio",
      "guide": 90,
      "questKey": true,
      "condLabel": "Fully inked",
      "effectText": "Each morning, it writes down how one pawned item will leave the shop",
      "tells": [
        "A black fountain pen with a gold nib, engraved L.P., MUTUAL OF NEW ENGLAND, 40 YEARS.",
        "The nib is wet. You haven't filled it. Nobody has, for some time."
      ]
    }
  },
  "scenes": {
    "emmettPen": {
      "title": "Emmett Ardley pawns the pen that knows how things end",
      "customer": "emmett",
      "steps": [
        {
          "say": "emmett",
          "text": [
            "Emmett Ardley. Forty years an actuary. Do you know what an actuary does? We tell people how likely things are to end. Mostly, very.",
            "This pen was a retirement present. It writes down how things will end. It's never wrong. I would like it to be somewhere else for a while, before it gets round to me."
          ]
        },
        { "offer": { "unique": "actuaryPen" }, "persona": "desperate", "asking": 50, "min": 30 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "hook": "held" },
            { "say": "emmett", "text": "Don't leave it near the ledger. It will start on the ledger." },
            { "plan": "actuary-anchor", "after": 3 }
          ],
          "else": [{ "say": "emmett", "text": "No. No, I expect that was always going to happen." }]
        },
        { "leave": "emmett" }
      ]
    },
    "actuaryAnchor": {
      "title": "Mr. Ardley wants his pen back",
      "steps": [
        {
          "stage": "rustyanchor",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [150, 166] },
            { "id": "emmett", "cast": "emmett", "at": [196, 162], "facingLeft": true },
            { "id": "ruthie", "cast": "ruthie", "at": [264, 154], "facingLeft": true }
          ]
        },
        { "find": "pen", "in": "stock", "match": { "uniqueId": "actuaryPen" } },
        { "narrate": "The Rusty Anchor at lunch. Mr. Ardley is on his usual stool with a half of bitter he has been nursing since about 2019. Ruthie Kroll is polishing the same glass in front of him, to keep him company." },
        {
          "if": "!pen",
          "then": [
            { "say": "emmett", "text": "You sold it. Of course you did. Somebody had to." },
            { "say": "ruthie", "text": "Cheer up, Emmett. It's someone else's problem now." },
            { "set": { "penEnd": "kept" } },
            { "end": true }
          ]
        },
        { "say": "emmett", "text": "I'd like it back now, please. While I still don't know." },
        { "say": "ruthie", "text": "Or let it tell you, Emmett. You've told everybody else theirs for forty years." },
        {
          "choose": [
            {
              "label": "Give it back to him",
              "hint": "(+$50, he buys it back)",
              "then": [
                { "take": "pen" },
                { "coin": 50, "why": "Emmett Ardley bought his pen back" },
                { "narrate": "He puts it in his inside pocket and buttons the jacket over it. He looks safer, and not at all happier." },
                { "set": { "penEnd": "returned" } }
              ]
            },
            {
              "label": "Put it on the bar and let it write",
              "hint": "(rep +2)",
              "then": [
                { "narrate": "The pen rolls to the edge of a beer mat and writes, in neat copperplate: \"L. Ardley. Redeemed.\"" },
                { "say": "emmett", "text": "Redeemed. Me. Not forfeited. Redeemed." },
                { "narrate": "He laughs. Ruthie says she has never heard him laugh. He signs up for her trivia team on the spot and leaves the pen on the bar for you, like a tip." },
                { "edit": "pen", "set": { "questKey": false, "nosale": false, "condLabel": "Quiet" } },
                { "refresh": "panel" },
                { "rep": 2 },
                { "set": { "penEnd": "redeemed", "penQuiet": true } }
              ]
            },
            {
              "label": "Keep it",
              "then": [
                { "say": "emmett", "text": "Then I hope it's kinder to you than it was to me. It won't be." },
                { "edit": "pen", "set": { "questKey": false, "nosale": false } },
                { "refresh": "panel" },
                { "set": { "penEnd": "kept" } }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "actuary-emmett", "from": "1-3", "to": "3-2", "cast": "emmett", "scene": "emmettPen" }],
  "errands": [
    {
      "id": "actuary-anchor",
      "title": "Mr. Ardley's pen",
      "where": "the Rusty Anchor",
      "scene": "actuaryAnchor",
      "test": [{ "set": { "penHeld": 1 } }, { "add": { "unique": "actuaryPen" } }]
    }
  ],
  "calendar": [
    { "id": "actuary-anchor", "errand": "actuary-anchor", "story": "actuary", "where": "The Rusty Anchor", "title": "The actuary's pen", "known": "flag.penHeld" }
  ],
  "mornings": [
    { "find": "pen", "in": "stock", "match": { "uniqueId": "actuaryPen" } },
    {
      "if": "pen && !flag.penQuiet",
      "note": "the pen's morning note",
      "then": [
        { "hook": "penNote", "sets": ["loan", "gloomy"] },
        {
          "toast": { "if": "loan.returns", "then": "The pen has written on the till roll: \"{loan.who}. The {loan.what}. Redeemed, {loan.due}.\" You feel, for no reason, a little sad about it.", "else": "The pen has written on the till roll: \"{loan.who}. The {loan.what}. Never coming back.\" You sigh, and can't stop." },
          "icon": "feather",
          "if": "loan"
        },
        {
          "if": "gloomy",
          "then": [
            { "hook": "pickOne", "with": 3, "sets": ["n"] },
            { "toast": "The pen has written \"nothing pawned, nothing lost\" on the till roll, and underlined it twice.", "icon": "feather", "if": "n == 0" },
            { "toast": "The pen has written today's date on the till roll and drawn a small box round it, like a headstone.", "icon": "feather", "if": "n == 1" },
            { "toast": "You notice you've been looking at the rain for twenty minutes. The pen is on the counter, looking pleased.", "icon": "feather", "if": "n == 2" }
          ]
        }
      ]
    },
    {
      "if": "pen && pen.questKey && hook.skipped",
      "note": "you skipped the errand: you keep the pen, and the gloom",
      "then": [
        { "edit": "pen", "set": { "questKey": false, "nosale": false } },
        { "refresh": "panel" },
        { "set": { "penEnd": "kept" } }
      ]
    }
  ]
});
