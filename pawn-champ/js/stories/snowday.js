// Pawn Champ - The Snow Day. Minor quest m77, batch P (docs/quests/MINOR.md#m77-the-snow-day).
// December to February. A storm shuts the town: the schools are closed, the plow hasn't been, and
// Main Street is a drift. Nobody can get to the shop all day. At seven in the morning somebody knocks
// anyway: Elmer Crocker, eighty-four, who has walked a mile from Cove Road with a copper warming pan
// under his arm. His oil tank is dry, the oil truck is coming down Cove Road behind the plow at noon,
// the driver takes cash, and his great-granddaughter is staying with him because her parents are
// both nurses, snowed in on shift at the hospital in Plymouth.
//
// The snow day needs no engine change: on that day the trade stays home (HOOKS.day drops the walk-in
// customers, as the plow never comes), and only story beats, redemptions and the regulars get through.
// If the seasons thread adds a proper closed day to js/day.js, this can switch to it.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/snowday.js.
defineStory({
  "id": "snowday",
  "kind": "minor",
  "title": "The Snow Day",
  "location": "shop",
  "months": [3, 4, 5],
  "rumour": "Big storm coming. Skip says there's no school tomorrow, and he's never wrong about that.",
  "endings": { "loan": "Warm Hands", "gift": "On the House", "sold": "Cash Only", "church": "Try the Church" },
  "outcome": "flag.snowEnd",
  "about": [
    "A winter kindness story. On a snow day when nothing in town opens, eighty-four-year-old Elmer Crocker walks a mile from Cove Road and knocks on your glass (§{elmerKnock}). His oil tank is dry, his six-year-old great-granddaughter is with him while her parents are snowed in at the hospital, and the oil truck takes cash at noon. He offers his mother's copper bed-warming pan for $90.",
    "Lend on the pan (Warm Hands), give him the money and send the pan home with him (On the House), buy the pan outright (Cash Only), or send him to the church (Try the Church). If you gave or bought, he comes back with Greta to see the shop that opens in a blizzard (§{elmerBack}); if you gave, she brings you a crayon drawing of it."
  ],
  "notes": "months: [3, 4, 5]: December to February, when a storm can shut the town. The snow day is one day in weeks 2 to 3, the same for a given run code (hook.snowDay). On it, the code half keeps the walk-in trade at home.",
  "cast": {
    "elmer": {
      "name": "Elmer Crocker",
      "look": { "skin": "#e0b8a0", "hair": "#f0f0f0", "hs": 0, "coat": "#4a3a2a", "style": "puffer", "pants": "#3a3a3a", "hat": "beanie", "hatc": "#8a2a2a", "moustache": "#f0f0f0" }
    }
  },
  "icons": {
    "warmpan": [
      "............",
      "..kkkk......",
      ".kaAAak.....",
      "kaAyyAak....",
      "kaAyyAak....",
      ".kaAAak.....",
      "..kkkkk.....",
      "......kw....",
      ".......kw...",
      "........kw..",
      ".........kw.",
      "..........k."
    ]
  },
  "uniques": {
    "warmingPan": {
      "name": "Copper bed-warming pan",
      "icon": "warmpan",
      "cat": "curio",
      "guide": 110,
      "tells": [
        "A lidded copper pan on a long turned handle. You filled it with embers and ran it between the sheets.",
        "The lid is pierced in a pattern of stars. Engraved on the handle ferrule: \"E. & R. Crocker, 1961\"."
      ]
    }
  },
  "scenes": {
    "elmerKnock": {
      "title": "Elmer Crocker knocks on the snow day",
      "customer": "elmer",
      "steps": [
        {
          "say": "elmer",
          "text": [
            "Elmer Crocker. Cove Road. I know you're not open. I walked. It's a mile. I've done it in worse, in 1978, but I was forty then.",
            "My oil tank's dry. The oil truck is coming down Cove Road behind the town plow at noon, and the driver takes cash. The bank isn't open. Nothing is open. You're not open."
          ]
        },
        { "narrate": "He opens his coat. Under it, wrapped in a dish towel, is a copper warming pan with a long wooden handle." },
        {
          "say": "elmer",
          "text": [
            "My mother warmed our beds with this when there was no oil at all. I've got my great-granddaughter with me. Her mum and dad are both nurses, and they're snowed in at the hospital in Plymouth. She's six. The house is at fifty degrees.",
            "Ninety dollars is a hundred gallons. I'll be back for it."
          ]
        },
        { "view": { "counterIcon": "warmpan" } },
        {
          "choose": [
            { "label": "Lend him $90 on the pan", "hint": "(he'll redeem it for $100 in a fortnight)", "disabled": "coin < 90" },
            { "label": "Give him $90 and send the pan home with him", "hint": "(rep +4)", "disabled": "coin < 90" },
            { "label": "Buy the pan outright for $90", "hint": "(it's yours to sell)", "disabled": "coin < 90 || !shelf.free" },
            { "label": "\"I'm sorry. Try the church.\"" }
          ],
          "as": "pick"
        },
        { "view": { "counterIcon": null } },
        {
          "if": "pick == 0",
          "then": [
            { "hook": "loan", "note": "a pawn loan of $90 on the pan, $100 to redeem, due in ten days" },
            { "set": { "snowEnd": "loan" } },
            { "say": "elmer", "text": "A fortnight. I'll walk it back, if the road's still there." }
          ]
        },
        {
          "if": "pick == 1",
          "then": [
            { "coin": -90, "why": "Gave Elmer Crocker oil money" },
            { "rep": 4 },
            { "set": { "snowEnd": "gift" } },
            { "say": "elmer", "text": "I don't... Well. My mother would have said take it and say thank you, and then knit them something. I can't knit. I'll think of something." }
          ]
        },
        {
          "if": "pick == 2",
          "then": [
            { "coin": -90, "why": "Bought Elmer Crocker's warming pan" },
            { "add": { "unique": "warmingPan" }, "as": "pan" },
            { "edit": "pan", "set": { "paid": 90 } },
            { "set": { "snowEnd": "sold" } },
            { "say": "elmer", "text": "That's fair. It's only a pan. That's what I keep telling myself on the walk." }
          ]
        },
        {
          "if": "pick == 3",
          "then": [
            { "set": { "snowEnd": "church" } },
            { "rep": -1 },
            { "say": "elmer", "text": "Father Ignatius. Yes. If the church is open. Nothing's open." },
            { "narrate": "He tucks the pan back under his coat and goes out into the snow. An hour later you see the plow go past after all, and wonder who rang the highway barn." }
          ]
        },
        { "refresh": "panel" },
        { "leave": "elmer" },
        { "narrate": "Nobody else comes in. The snow keeps on. At four, a kid on a sled goes down the middle of Main Street, which has never happened before and will never happen again." }
      ]
    },
    "elmerBack": {
      "title": "Elmer and Greta come back",
      "customer": "elmer",
      "steps": [
        { "say": "elmer", "text": "Elmer Crocker, and this is Greta. She wanted to see the shop that opens in a blizzard." },
        { "narrate": "A girl in a snowsuit two sizes too big looks round at the shelves with enormous seriousness, then at you." },
        {
          "if": "flag.snowEnd == 'gift'",
          "then": [
            { "say": "elmer", "text": "I can't knit. Greta can draw." },
            { "narrate": "Greta gives you a drawing in crayon: the shop, with snow up to the roof and a yellow light in the window. You put it up behind the counter." },
            { "rep": 1 }
          ],
          "else": [
            { "say": "elmer", "text": "The tank's full and the house is at sixty-eight. Greta says it's boring now. That's how you know it's warm." }
          ]
        },
        { "leave": "elmer" }
      ]
    }
  },
  "mornings": [
    {
      "if": "hook.snowDay",
      "then": [
        {
          "narrate": [
            "You wake to silence. Snow to the windowsills, and more coming. Main Street is a single white drift; the plow hasn't been, and the radio says it won't till tomorrow. Nobody is coming in today, or nobody with any sense.",
            "At seven o'clock somebody knocks on the glass anyway. Knocks and knocks."
          ]
        }
      ]
    }
  ],
  "beats": [
    { "drift": "snowday", "from": "2-1", "to": "3-3", "cast": "elmer", "scene": "elmerKnock" },
    { "at": "3-5", "cast": "elmer", "scene": "elmerBack", "if": "(flag.snowEnd == 'gift' || flag.snowEnd == 'sold') && hook.afterSnowDay" }
  ],
  "epilogue": [
    { "line": "Elmer Crocker's warming pan spent a fortnight in your back room, and his great-granddaughter spent the snow day warm.", "if": "flag.snowEnd == 'loan'" },
    { "line": "There's a crayon drawing behind the counter of the shop in a blizzard, with one window lit. People ask about it. You tell them it was a snow day.", "if": "flag.snowEnd == 'gift'" },
    { "line": "A copper warming pan hangs by the till, stars pierced in the lid. Elmer Crocker comes in to visit it sometimes.", "if": "flag.snowEnd == 'sold'" },
    { "line": "Elmer Crocker got his oil in the end. Father Ignatius says somebody rang the highway barn. Nobody says who didn't help.", "if": "flag.snowEnd == 'church'" }
  ],
  "talk": {
    "by": "leon",
    "rumour": [
      "Big storm coming. Two feet, they say. I'll be on the plow from midnight, and Cove Road'll be last. It's always last. It's a mile long and there's one house at the end of it.",
      "Old Elmer Crocker's house. He's eighty-four, and he won't ask anybody for anything. Not even me, and I've known him since I was a boy."
    ],
    "react": { "loan": "Elmer Crocker walked to your shop in two feet of snow, before I'd got to Cove Road. He's eighty-four. He says he wants it on his headstone. Not the oil. The walk.", "gift": "I got to Cove Road at noon. Elmer's house was warm. He said a shop on Front Street had seen to it. He wouldn't say how. He gave me coffee.", "sold": "You bought the Crocker warming pan, I hear. When I got down Cove Road, the house was warm. That's the main thing. That's always the main thing.", "church": "Father Ignatius rang me at two in the morning. I took the plow down Cove Road first, for once, and Elmer rode to the church hall in the cab with his cat on his knee." }
  }
});
