// Pawn Champ - The Weathervane: Town Hall's copper whale comes in as "scrap". Minor quest m10,
// batch D (docs/quests/MINOR.md#m10-the-weathervane).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "weathervane",
  "kind": "minor",
  "title": "The Weathervane",
  "location": "townhall",
  "rumour": "Town Hall's whale is off the roof for repairs.",
  "endings": { "back": "Back on the Roof", "whaling": "Gone Whaling", "turnedIn": "Turned In" },
  "outcome": "flag.vaneEnd",
  "about": [
    "Dale Corrigan, the roofer repairing Town Hall's copper whale weathervane, tries to sell it to you as \"scrap\" because his boat payment is due (§{daleVane}). Refuse, or call the police on the spot (Turned In). If you buy it, he texts in a panic before the selectmen sit and asks you onto the roof (§{vaneRoof}).",
    "Help him bolt it back on, faster with a tool or climbing gear in your bag (Back on the Roof), sell it to a no-questions collector in Newport for $400 and draw the police's attention (Gone Whaling), or call Captain Barrow, who went to high school with Dale (Turned In). Town Meeting's Article 7 (§{vaneArticle}) then hears that the whale fixed itself, was stolen, or is in the evidence room."
  ],
  "cast": {
    "dale": {
      "name": "Dale Corrigan",
      "look": { "skin": "#e0b090", "hair": "#8a5a2a", "hs": 0, "coat": "#3a5a8a", "style": "tee", "hat": "cap", "hatc": "#e8702a", "beard": "#8a5a2a", "pants": "#5a5a48", "belt": "#6a4a2a" }
    }
  },
  "icons": {
    "whale": [
      "............",
      "............",
      "..........kk",
      ".........kjk",
      "..kkkkkkkjk.",
      ".kjJJJJJjjk.",
      "kjkJJJJjjjjk",
      "kjjjjjjjjjk.",
      ".kjjjjjjjk..",
      "..kkkkkkk...",
      ".....k......",
      "............"
    ]
  },
  "uniques": {
    "weathervane": {
      "name": "Copper whale weathervane",
      "icon": "whale",
      "cat": "art",
      "guide": 400,
      "questKey": true,
      "tells": [
        "Stamped under the tail: HOLLOW NECK 1888.",
        "The green on it is a century deep. Nobody made this for scrap."
      ]
    }
  },
  "scenes": {
    "daleVane": {
      "title": "Dale Corrigan has some copper \"scrap\" in the truck",
      "customer": "dale",
      "steps": [
        {
          "say": "dale",
          "text": [
            "Dale Corrigan, Corrigan Roofing. You heard Town Hall's whale is off the roof for repairs? I'm the repairs.",
            "Anyway. Unrelated. I've got some copper scrap in the truck. Big old whale shape. Sixty bucks and it's yours."
          ]
        },
        {
          "offer": { "unique": "weathervane" },
          "persona": "desperate",
          "asking": 60,
          "min": 45,
          "onWatch": "continue"
        },
        { "if": "offer == 'watch'", "then": [{ "set": { "vaneEnd": "turnedIn" } }, { "end": true }] },
        {
          "if": "offer == 'deal'",
          "then": [
            { "set": { "vaneBought": true } },
            {
              "say": "dale",
              "text": [
                "Great. Great. It's scrap. Just so we're clear. It came off in my hands, and copper's at a good price, and the boat payment was due, and...",
                "Forget it. Thanks."
              ]
            },
            { "plan": "weathervane-roof" }
          ],
          "else": [{ "say": "dale", "text": "Yeah. No. You're right. I'll... think of something." }]
        },
        { "leave": "dale" }
      ]
    },
    "vaneRoof": {
      "title": "On the Town Hall roof with Dale and the whale",
      "note": "The lunch errand: Dale, guilty, wants it back on the roof before the selectmen sit at one.",
      "steps": [
        {
          "stage": "townhallRoof",
          "fadeOut": false,
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [120, 166] },
            { "id": "dale", "cast": "dale", "at": [170, 164], "facingLeft": true }
          ]
        },
        { "narrate": "A text at eleven: \"pls. the whale. selectmen sit at 1. i will owe u forever. - D\". So at noon you're on the roof of Town Hall with a copper whale under one arm and a roofer who won't look at you." },
        { "say": "dale", "text": "It really did come off in my hands. Then I had it in the truck. Then I had a bad idea. Then I had you." },
        { "find": "vane", "in": "stock", "match": { "uniqueId": "weathervane" } },
        {
          "choose": [
            {
              "label": "Help him bolt it back on",
              "hint": "(+6 rep)",
              "disabled": "!vane",
              "then": [
                { "take": "vane" },
                { "set": { "vaneUp": true, "vaneEnd": "back" } },
                { "rep": 6 },
                {
                  "if": "hook.carryingFix || hook.carryingClimb",
                  "note": "items in use (docs/ITEMS_IN_USE.md)",
                  "then": [
                    { "use": "fix", "as": "kit", "if": "hook.carryingFix" },
                    { "use": "climb", "as": "kit", "if": "!hook.carryingFix" },
                    { "set": { "vaneQuick": true } },
                    {
                      "narrate": { "if": "kit", "then": "The {kit.name|lower} makes a job of it instead of an adventure. Five minutes, and the whale swings back to face the harbor before the first selectman is out of his car.", "else": "Your kit makes a job of it instead of an adventure. Five minutes, and the whale swings back to face the harbor before the first selectman is out of his car." }
                    },
                    { "say": "dale", "text": "That was professional. That was more professional than me. Here. All sixty. I don't deserve to keep any of it." },
                    { "coin": 60, "why": "Dale paid back the whale" }
                  ],
                  "else": [
                    { "narrate": "Twenty minutes, two wrenches and one near-death experience later, the whale swings back to face the harbor. Somewhere below, the selectmen arrive and don't look up." },
                    { "say": "dale", "text": "I'll pay you back the sixty. Out of the Town Hall job. Which I still have. Because of you." },
                    { "coin": 30, "why": "Dale paid back half the whale" }
                  ]
                }
              ]
            },
            {
              "label": "Ring a collector in Newport instead",
              "hint": "($400, and it will be missed)",
              "disabled": "!vane",
              "then": [
                { "take": "vane" },
                { "set": { "vaneEnd": "whaling", "vaneSold": true } },
                { "coin": 400, "why": "Sold Town Hall's whale to a collector" },
                { "narrate": "The collector's van is in the Town Hall lot by two. He doesn't ask a single question, which is how you know exactly what kind of collector he is." },
                { "say": "dale", "text": "Oh no. Oh, no no no. They're going to notice. They're going to look UP." }
              ]
            },
            {
              "label": "Call Captain Barrow",
              "then": [
                { "take": "vane" },
                { "set": { "vaneEnd": "turnedIn" } },
                { "heat": -5 },
                { "rep": 2 },
                { "narrate": "Captain Barrow climbs the ladder herself, looks at Dale, looks at the whale, and sighs the sigh of a woman who went to high school with him." },
                { "say": "dale", "text": "Hi, Denise." }
              ]
            }
          ]
        }
      ]
    },
    "vaneArticle": {
      "title": "Town Meeting, Article 7: the weathervane",
      "note": "At Town Meeting, the whale is on the warrant either way.",
      "steps": [
        {
          "if": "flag.vaneEnd == 'back'",
          "then": [
            {
              "narrate": [
                "Article 7: to see if the Town will raise $3,000 to repair the Town Hall weathervane. The Building Committee reports, with some confusion, that it appears to have repaired itself.",
                "The article is passed over. Dale Corrigan, in the back row, gives you a very small thumbs up."
              ]
            },
            { "rep": 1 }
          ],
          "else": [
            { "narrate": "Article 7: to see if the Town will raise $3,000 to replace the Town Hall weathervane, \"removed by persons unknown\". It passes. Dale Corrigan, in the back row, does not raise his hand or his eyes.", "if": "flag.vaneEnd == 'whaling'" },
            { "narrate": "Article 7: to see if the Town will raise $3,000 to repair the Town Hall weathervane. Captain Barrow reports that the whale is in the evidence room and \"in good spirits\". Laughter. It passes.", "if": "flag.vaneEnd != 'whaling'" }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "weathervane", "from": "1-2", "to": "3-3", "cast": "dale", "scene": "daleVane" }],
  "errands": [
    {
      "id": "weathervane-roof",
      "title": "Dale needs the whale back on Town Hall",
      "where": "the Town Hall roof",
      "scene": "vaneRoof",
      "test": [{ "add": { "unique": "weathervane" } }, { "set": { "vaneBought": true } }]
    }
  ],
  "vignettes": [
    { "hub": "meeting", "label": "Article 7: the weathervane", "if": "flag.vaneEnd", "scene": "vaneArticle" }
  ],
  "calendar": [
    {
      "id": "weathervane-roof",
      "errand": "weathervane-roof",
      "story": "weathervane",
      "where": "Town Hall roof",
      "title": "Put the whale back",
      "known": "flag.vaneBought",
      "bring": ["fix", "climb"]
    }
  ],
  "mornings": [
    {
      "if": "flag.vaneSold && !flag.vaneMissed",
      "note": "the whale is missed the morning after it goes",
      "then": [
        { "set": { "vaneMissed": true } },
        { "heat": 10, "why": "Town Hall's whale was missed" },
        { "toast": "The Gazette: \"Who took Town Hall's whale?\" There's a photo of the empty cupola.", "look": "dale" }
      ]
    },
    { "find": "vane", "in": "stock", "match": { "uniqueId": "weathervane" } },
    {
      "if": "vane && vane.questKey && hook.stoodUp",
      "note": "you skipped the errand: it's still in your stock, and now it's hot",
      "then": [
        {
          "edit": "vane",
          "set": { "questKey": false, "nosale": false, "stolen": true, "condLabel": "Missed" }
        },
        { "refresh": "panel" },
        { "heat": 5 },
        { "toast": "Town Hall's whale has been reported missing. The one in your back room.", "look": "dale" }
      ]
    }
  ],
  "sold": {
    "weathervane": [
      {
        "set": { "vaneEnd": "whaling" },
        "if": "!flag.vaneEnd",
        "note": "sold over the counter instead: gone whaling"
      }
    ]
  }
});
