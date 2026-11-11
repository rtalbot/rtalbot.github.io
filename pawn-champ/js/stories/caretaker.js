// Pawn Champ - The Caretaker's Keys. Minor quest m67, batch L (docs/quests/MINOR.md#m67-the-caretakers-keys).
// A ring of forty labelled keys to the shut summer houses on Cliff Road. The caretaker, Orrin Greer,
// is in hospital, and his nephew Wally, who pawns them, is nervous: keys keep leaving the board and
// coming back. It isn't a burglar. A family who lost their apartment has been living in a different shut
// cottage each week. Now the keys are in your shop, they're stuck in the last one. Tell Captain
// Barrow, warn them, or find them somewhere for the winter with Father Ignatius.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/caretaker.js.
defineStory({
  "id": "caretaker",
  "kind": "minor",
  "title": "The Caretaker's Keys",
  "location": "cottage",
  "rumour": "Somebody's been asking Hal Mayhew to copy summer-house keys.",
  "endings": { "reported": "Told Barrow", "warned": "A Week's Head Start", "wintered": "Somewhere Warm" },
  "about": [
    "A quiet winter story. Wally Greer pawns his hospitalised uncle's ring of forty summer-house keys from Cliff Road, because the keys on the board keep moving and one, for Gull's Rest, has been copied (§{wallyKeys}).",
    "At Gull's Rest after dark (§{cottageNight}) the stove is warm and you find Lucia Varela and her son Mateo, who lost their apartment in August and have been moving from one empty summer house to another, washing the sheets before they go. Call Captain Barrow (Told Barrow), give them a week and a key to the one house with a working furnace (A Week's Head Start), or ring Father Ignatius, who has an apartment over Saint Brine's old schoolroom (Somewhere Warm)."
  ],
  "cast": {
    "wally": {
      "name": "Wally Greer",
      "look": { "skin": "#f0d0b8", "hair": "#c8a060", "hs": 2, "coat": "#6a7a5a", "style": "hoodie", "pants": "#3a3a44", "hat": "beanie", "hatc": "#3a4a6a" }
    },
    "lucia": {
      "name": "Lucia Varela",
      "look": { "skin": "#c89070", "hair": "#1a1210", "hs": 3, "coat": "#8a4a5a", "style": "puffer", "pants": "#2a2a30" }
    },
    "mateo": {
      "name": "Mateo",
      "look": { "kid": true, "skin": "#c89070", "hair": "#1a1210", "hs": 1, "coat": "#e8a020", "style": "hoodie", "pants": "#3a4a6a" }
    }
  },
  "icons": {
    "keyring": [
      "....kkkk....",
      "...k....k...",
      "..k......k..",
      "..k......k..",
      "..k.kk...k..",
      "...kyyk.k...",
      "..kyYyk.kk..",
      ".kyk.kykyYk.",
      "kyk..kykyk..",
      "kk...kyk.kyk",
      ".....kk...kk",
      "............"
    ]
  },
  "uniques": {
    "caretakerKeys": {
      "name": "A caretaker's ring of forty house keys",
      "icon": "keyring",
      "cat": "curio",
      "guide": 30,
      "questKey": true,
      "tells": [
        "Forty keys, each with a paper tag in the same tidy hand: HALLORAN. THE PINES. GULL'S REST. WEST WIND.",
        "Thirty-nine tags are yellow with age. GULL'S REST is on a fresh tag, and the key has been cut this year."
      ]
    }
  },
  "scenes": {
    "wallyKeys": {
      "title": "Wally Greer pawns his uncle's keys",
      "customer": "wally",
      "steps": [
        {
          "say": "wally",
          "text": [
            "Wally Greer. My uncle Orrin's the caretaker for the summer houses on Cliff Road. He's in hospital in Plymouth. His hip. He gave me the keys to mind.",
            "And keys keep... moving. He keeps them on a board in his kitchen. Every week one's gone, and the next week it's back, and a different one's gone. I'm not a brave man. I don't want them in my house.",
            "Forty dollars and I never have to look at that board again."
          ]
        },
        { "offer": { "unique": "caretakerKeys" }, "persona": "desperate", "asking": 40, "min": 25 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "wally", "text": "I'll put them in the freezer. People say that helps. With ghosts." },
            { "leave": "wally" },
            { "end": true }
          ]
        },
        { "set": { "keysIn": true } },
        { "say": "wally", "text": "The one that was gone this week was Gull's Rest. It's still gone. The tag's here, look. The key's new. Somebody had a copy cut." },
        { "narrate": "One key on the ring is brighter than the rest. Gull's Rest, the shingled cottage at the very end of Cliff Road. Hal Mayhew, at the hardware store, would know who had it cut." },
        { "toast": "Calendar: Gull's Rest, {placed:caretaker-cottage} night", "look": "wally" },
        { "leave": "wally" }
      ]
    },
    "cottageNight": {
      "title": "Gull's Rest after dark",
      "steps": [
        { "stage": "cottage", "actors": [{ "id": "you", "cast": "keeper", "name": "You", "at": [40, 168] }] },
        { "hook": "music", "with": "night" },
        {
          "narrate": [
            "Gull's Rest, after dark. The shutters are closed and every chair is under a dust sheet, but there are footprints in the dust, big and small, and the woodstove is warm.",
            "A child's drawing is taped to the stovepipe: a house, a sun, four people, a cat."
          ]
        },
        { "enter": { "id": "mateo", "cast": "mateo", "at": [230, 170], "facingLeft": true } },
        { "enter": { "id": "lucia", "cast": "lucia", "at": [260, 164], "facingLeft": true } },
        { "say": "mateo", "text": "Mom. Mom, it's not Mr. Greer." },
        {
          "say": "lucia",
          "text": [
            "We're not stealing. We don't take anything. We wash the sheets before we go. Our landlord sold the building in August and we had a week to get out.",
            "I used to clean these houses for Orrin. I know which ones are empty when. A different one every week, so nobody notices the smoke. My husband works nights at the plant. We're on the list for an apartment in Plymouth. February, they say.",
            "Then the keys stopped coming back on the board. So we're here. Are you going to call someone?"
          ]
        },
        { "find": "keys", "in": "stock", "match": { "uniqueId": "caretakerKeys" } },
        {
          "choose": [
            {
              "label": "Call Captain Barrow. It's a break-in, whatever the reason.",
              "then": [
                { "set": { "keysEnd": "reported" } },
                { "take": "keys" },
                { "heat": -6 },
                { "rep": -3 },
                { "enter": { "id": "barrow", "cast": "barrow", "at": [120, 164] } },
                { "say": "barrow", "text": "I know the Varelas. I'm not charging anyone with anything. But you can't stay here, Lucia. I'll drive you to the shelter in Plymouth." },
                { "narrate": "She takes the keys back to Orrin Greer at the hospital herself. Mateo leaves his drawing on the stovepipe." },
                { "remove": "barrow" }
              ]
            },
            {
              "label": "Give them a week's warning, and the key to one more house",
              "hint": "(the keys stay with you)",
              "then": [
                { "set": { "keysEnd": "warned" } },
                { "edit": "keys", "set": { "questKey": false, "nosale": false }, "note": "yours to sell now" },
                { "refresh": "panel", "if": "keys" },
                { "say": "lucia", "text": "A week. Thank you. Then we'll see." },
                { "narrate": "You leave them the key to West Wind, the only house on the road with a working furnace, and keep the other thirty-nine." }
              ]
            },
            {
              "label": "Ring Father Ignatius. Saint Brine's has an apartment over the old schoolroom.",
              "hint": "(+5 rep)",
              "then": [
                { "set": { "keysEnd": "wintered" } },
                { "take": "keys" },
                { "rep": 5 },
                { "narrate": "Father Ignatius answers on the second ring and doesn't ask a single question until he's at the door with the church van." },
                { "enter": { "id": "ignatius", "cast": "ignatius", "at": [120, 164] } },
                { "say": "ignatius", "text": "There's an apartment over the old schoolroom. It's cold and the stairs are terrible and it's yours till February. Longer, if Plymouth is slow, which it will be." },
                { "say": "mateo", "text": "Can I bring my drawing?" },
                { "narrate": "The keys go back to Orrin Greer in hospital, with a note from you, and Gull's Rest goes dark again with its dust sheets straight." },
                { "remove": "ignatius" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "caretaker", "from": "1-2", "to": "2-3", "cast": "wally", "scene": "wallyKeys" }],
  "nights": [
    {
      "id": "caretaker-cottage",
      "window": ["2-1", "3-4"],
      "if": "flag.keysIn && !flag.keysEnd",
      "scene": "cottageNight",
      "test": [{ "set": { "keysIn": true } }, { "add": { "unique": "caretakerKeys" } }]
    }
  ],
  "calendar": [
    { "id": "caretaker-cottage", "night": "caretaker-cottage", "story": "caretaker", "where": "Gull's Rest, Cliff Road", "title": "The shut cottage", "known": "flag.keysIn", "scene": "cottageNight" }
  ],
  "epilogue": [
    { "line": "The Varelas spent the winter at the shelter in Plymouth. Orrin Greer changed every lock on Cliff Road from his hospital bed.", "if": "flag.keysEnd == 'reported'" },
    { "line": "Smoke comes out of a different chimney on Cliff Road every week. Nobody on the road is there to see it.", "if": "flag.keysEnd == 'warned'" },
    { "line": "The Varelas are in the apartment over Saint Brine's old schoolroom. Mateo's drawing is on the stovepipe there now.", "if": "flag.keysEnd == 'wintered'" }
  ],
  "talk": {
    "by": "hal",
    "rumour": [
      "Somebody's been in asking me to copy summer-house keys. Paid cash. Wouldn't say whose.",
      "Orrin Greer's the caretaker up there, and Orrin's in hospital. So somebody's minding a lot of empty houses, or somebody isn't."
    ],
    "react": { "reported": "Barrow had me change forty locks on Cliff Road. Good business. I didn't enjoy it.", "warned": "Smoke out of West Wind's chimney all week. Nobody's in West Wind. I sold somebody a lot of kindling.", "wintered": "Father Ignatius was in buying a space heater and weatherstripping for the old schoolroom. Paid for it himself. Wouldn't let me give him the discount." },
    "sway": { "reported": { "hal": -1 }, "wintered": { "hal": 1, "ignatius": 2 } }
  },
  "outcome": "flag.keysEnd"
});
