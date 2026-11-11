// Pawn Champ - The Sea Captain's Portrait: the Historical Society swears he was a captain, his
// descendant swears he was a pirate. Minor quest m30, batch G (docs/quests/MINOR.md).
// Lucinda Thrale sells it; Mr. Quayle wants it; a lunch errand at the Historical Society.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/seacaptain.js.
defineStory({
  "id": "seacaptain",
  "kind": "minor",
  "title": "The Sea Captain's Portrait",
  "location": "historical",
  "rumour": "The Historical Society wants a portrait of a sea captain. His great-great-great-granddaughter says he was a pirate.",
  "endings": { "society": "In the Front Hall", "family": "Back with the Family", "privateer": "Both, Legally" },
  "outcome": "flag.captainEnd",
  "about": [
    "Lucinda Thrale sells you the portrait of her great-great-great-grandfather, Captain Hezekiah Thrale, because the Historical Society wants to hang him as a respectable \"merchant master\" and she insists he was a pirate (§{lucindaPortrait}). Quayle comes to argue the opposite: a Salem trader, vestryman and founder of the town's first bank (§{quaylePortrait}). He asks you to bring the portrait to the Society.",
    "In the front hall (§{captainSociety}) they argue over eleven ships the Resolve took in 1779. If you look behind the canvas lining you find a 1778 letter of marque from the Continental Congress: he was a privateer, so both are right. Sell him to the Society (In the Front Hall), give him back to Lucinda (Back with the Family), or, with the letter found, let the Society hang him with a card Lucinda writes (Both, Legally)."
  ],
  "cast": {
    "lucinda": {
      "name": "Lucinda Thrale",
      "look": { "skin": "#a87050", "hair": "#1a1210", "hs": 5, "coat": "#2a2a30", "trim": "#c83a3a", "style": "jacket", "pants": "#2a2a3a", "hat": "cap", "hatc": "#1a1a1e" }
    }
  },
  "uniques": {
    "thralePortrait": {
      "name": "Portrait of Captain Hezekiah Thrale",
      "icon": "painting",
      "cat": "art",
      "guide": 80,
      "questKey": true,
      "tells": [
        "Oil on canvas, about 1790. A man in a blue coat with a telescope, looking pleased with himself, and a ship behind him flying no flag at all.",
        "The canvas is thicker in the bottom corner, as if something is tucked behind the lining."
      ]
    }
  },
  "scenes": {
    "lucindaPortrait": {
      "title": "Lucinda Thrale sells her pirate ancestor",
      "customer": "lucinda",
      "steps": [
        {
          "say": "lucinda",
          "text": [
            "Lucinda Thrale. This is Hezekiah. Captain Hezekiah Thrale, my great-great-great-grandfather. He was a pirate.",
            "The Historical Society wants to hang him in the front hall next to the founders, with a card saying \"merchant master\". He'd hate it. I'd rather sell him to someone honest."
          ]
        },
        { "offer": { "unique": "thralePortrait" }, "persona": "proud", "asking": 70, "min": 60 },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "captainBought": true } },
            { "say": "lucinda", "text": "Look at his face. That's a man who boarded things." }
          ],
          "else": [
            { "say": "lucinda", "text": "Then he goes back in the attic with the cutlass. Which is also real. Ask me about the cutlass sometime." }
          ]
        },
        { "leave": "lucinda" }
      ]
    },
    "quaylePortrait": {
      "title": "Mr. Quayle wants to argue about the portrait",
      "customer": "quayle",
      "steps": [
        {
          "say": "quayle",
          "text": [
            "You have the Thrale portrait. Bertram Quayle, the Historical Society. Hezekiah Thrale was a respected master of the Salem trade, a vestryman and a founder of this town's first bank.",
            "Miss Thrale has been telling people he was a pirate since she was nine. Come by at lunch and I'll show you the shipping records. And bring him, please. I'll argue in front of him."
          ]
        },
        { "set": { "captainQuayle": true } },
        { "plan": "captain-society", "after": 1 },
        { "toast": "Calendar: the Historical Society, at lunch", "look": "quayle" },
        { "leave": "quayle" }
      ]
    },
    "captainSociety": {
      "title": "The pirate or the vestryman",
      "steps": [
        {
          "stage": "historical",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [130, 166] },
            { "id": "quayle", "cast": "quayle", "at": [236, 158], "facingLeft": true },
            { "id": "lucinda", "cast": "lucinda", "at": [180, 162], "facingLeft": true }
          ]
        },
        { "find": "p", "in": "stock", "match": { "uniqueId": "thralePortrait" } },
        {
          "if": "!p",
          "then": [
            { "say": "quayle", "text": "No portrait? Then Miss Thrale and I will simply go on disagreeing. We've had practice." },
            { "end": true }
          ]
        },
        { "narrate": "The front hall of the Historical Society. Mr. Quayle has a ledger open on the table. Lucinda Thrale has a printout from the internet. They are not looking at each other." },
        { "say": "quayle", "text": "1779. The Thrale ship Resolve takes eleven prizes and lands their cargo at Salem. Trade." },
        { "say": "lucinda", "text": "Eleven ships. That he TOOK. Which is piracy." },
        {
          "choose": [
            {
              "label": "Look behind the canvas lining",
              "then": [
                { "narrate": "You ease the backing at the thick corner. Folded behind the lining: a letter, 1778, under the seal of the Continental Congress, authorizing Hezekiah Thrale and the Resolve to \"set upon and take\" any ship of the King." },
                { "say": "quayle", "text": "A letter of marque. A privateer." },
                { "say": "lucinda", "text": "A pirate with a permission slip." },
                { "say": "quayle", "text": "Well. Yes. Rather." }
              ]
            },
            { "label": "Let them argue it out" }
          ],
          "as": "look"
        },
        {
          "choose": [
            {
              "label": "Sell him to the Society",
              "hint": "(+$90)",
              "then": [
                { "take": "p" },
                { "coin": 90, "why": "Sold the Thrale portrait to the Historical Society" },
                { "set": { "captainEnd": "society" } },
                { "say": "lucinda", "text": "Merchant master. He's spinning. I hope he's spinning." }
              ]
            },
            {
              "label": "Give him back to Lucinda",
              "hint": "(rep +2)",
              "then": [
                { "take": "p" },
                { "rep": 2 },
                { "set": { "captainEnd": "family" } },
                { "say": "lucinda", "text": "He's going over my mantelpiece. Facing the door. So he can see who's coming." }
              ]
            },
            {
              "label": "Both: the Society hangs him, and Lucinda writes the card",
              "disabled": "look != 0",
              "hint": { "if": "look == 0", "then": "(+$70, rep +3)", "else": "(you'd need proof they're both right)" },
              "then": [
                { "take": "p" },
                { "coin": 70, "why": "The Historical Society bought the Thrale portrait" },
                { "rep": 3 },
                { "set": { "captainEnd": "privateer" } },
                { "narrate": "The card beside him now reads: \"Capt. Hezekiah Thrale, 1741-1809. Privateer, with papers. Founder of the Hollow Neck Savings Bank, with the proceeds.\" Lucinda wrote it. Mr. Quayle corrected the commas." }
              ]
            }
          ]
        }
      ]
    }
  },
  "mornings": [
    { "find": "p", "in": "stock", "match": { "uniqueId": "thralePortrait" } },
    {
      "if": "p && p.questKey && hook.errandMissed",
      "then": [{ "edit": "p", "set": { "questKey": false, "nosale": false } }, { "refresh": "panel" }]
    }
  ],
  "beats": [
    { "drift": "captain-lucinda", "from": "1-3", "to": "3-2", "cast": "lucinda", "scene": "lucindaPortrait" },
    { "drift": "captain-lucinda", "from": "1-3", "to": "3-2", "offset": 2, "cast": "quayle", "scene": "quaylePortrait", "if": "hook.hasPortrait && !flag.captainEnd" }
  ],
  "errands": [
    {
      "id": "captain-society",
      "title": "The pirate or the vestryman",
      "where": "the Historical Society",
      "scene": "captainSociety",
      "test": [
        { "set": { "captainBought": true, "captainQuayle": true } },
        { "add": { "unique": "thralePortrait" } }
      ]
    }
  ],
  "calendar": [
    { "id": "captain-society", "errand": "captain-society", "story": "seacaptain", "where": "The Historical Society", "title": "Captain or pirate", "known": "flag.captainQuayle" }
  ],
  "epilogue": [
    { "line": "School trips to the Historical Society now stop longest in front of Captain Thrale. The children like the words \"with papers\".", "if": "flag.captainEnd == 'privateer'" }
  ]
});
