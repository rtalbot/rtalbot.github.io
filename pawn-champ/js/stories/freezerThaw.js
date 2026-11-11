// Pawn Champ - The Thaw: the last chapter of The Thing in Dory's Freezer's long arc (round 3,
// batch T). Docs: docs/quests/MAJOR.md#m8-the-long-arc. Stay-on only.
//
// Any ending, March: the ice goes out and they come back to the breakwater, a dozen of them,
// humming. Whoever has it brings it down. The arc's chapters share a code half: js/quests/freezerarc.js.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "freezerThaw",
  "kind": "major",
  "colour": "#5ab8b0",
  "family": "uncanny",
  "title": "The Thaw",
  "arc": "freezer",
  "after": ["sold", "sea", "mascot"],
  "months": [6],
  "teaser": {
    "if": "hook.seaWhere == 'sea'",
    "then": "The ice went out of the harbor in the night. On the step, wet: a scallop shell with a small handprint in the sand inside it.",
    "else": { "if": "hook.seaWhere == 'shop'", "then": "Last night the thing climbed out of its water and sat by the back door till morning, humming at the harbor.", "else": "The ice went out of the harbor in the night. Dory is waiting outside before you open, in her boots, looking at Pier Nine." }
  },
  "rumour": "The ice is out of the harbor, and something is humming under Pier Nine. More than one something.",
  "endings": { "together": "Out with the Tide", "stays": "One Stays Behind", "filmed": "Season Eight" },
  "outcome": "flag.thawEnd",
  "code": "freezerarc",
  "about": [
    "The freezer arc's last chapter, in March, which every October ending leads to. The ice goes out of the harbor, and there's humming under Pier Nine, more than Dory can count (§{thawDory}). Wherever the thing is now, in your back room, the lab's tank, a buyer's tank on the Cape, or the sea, it knows.",
    "Kit Sandoval wants the night for season eight and offers $200 for a phone call (§{thawSandoval}). On the night at the breakwater (§{thawNight}) a dozen of them wait in the water, some as big as Cal, and yours (or the lab's, or the buyer's) is in a cooler at your feet, or comes to the bottom step to hold your finger.",
    "Let it go with the others (Out with the Tide), and a pearl is left on the granite. Keep the lid shut, if it's still with you or the lab, and one stays behind (One Stays Behind). Or signal Sandoval's floodlights, which scatters them all (Season Eight, and Dory cools on you)."
  ],
  "notes": "Every October ending meets here. hook.seaWhere is where the thing is now: 'shop' (the tank or the tub), 'lab', 'buyer' or 'sea'.",
  "scenes": {
    "thawDory": {
      "title": "Dory: the ice went out, and they're gathering off the breakwater",
      "customer": "dory",
      "steps": [
        { "hook": "where", "sets": ["w"] },
        { "say": "dory", "text": "Ice went out last night. All of it, in an hour, the way it does some years. And there's humming under Pier Nine. Not one. Not three. I stopped counting." },
        {
          "say": "dory",
          "text": {
            "if": "w == 'sea'",
            "then": "One of them came up by my float this morning and held on to the ladder like it was waiting for a bus. I think I know which one.",
            "else": {
              "if": "w == 'shop'",
              "then": "And yours knows. Look at it. It hasn't taken its eyes off the back door since Sunday.",
              "else": { "if": "w == 'lab'", "then": "Ines rang me at six. It's been at the north wall of the winter tank all night, both hands on the glass.", "else": "{hook:buyerName} rang me at six from the Cape. Theirs is going round and round the tank. Theirs knows." }
            }
          }
        },
        { "say": "dory", "text": "They're gathering off the breakwater. I want to be there when whatever happens, happens. So do you, I think." },
        { "set": { "thawIn": true } },
        { "toast": "Calendar: the breakwater, in the thaw", "look": "dory" },
        { "leave": "dory" }
      ]
    },
    "thawSandoval": {
      "title": "Kit Sandoval wants the night, for season eight",
      "customer": "sandoval",
      "steps": [
        {
          "say": "sandoval",
          "text": [
            "Kit Sandoval, Strange Shores. Season eight. The bait shop says something is happening at your breakwater, and the bait shop has never once been wrong.",
            "Tell me the night. Two hundred dollars for a phone call. I'll keep the lights off till you say."
          ]
        },
        {
          "choose": [
            {
              "label": "Tell her the night",
              "hint": "(she'll bring the crew)",
              "then": [
                { "set": { "thawCrew": true } },
                { "say": "sandoval", "text": "You won't regret this. People always say they regret it. You won't." }
              ]
            },
            {
              "label": "Tell her the bait shop is wrong for once",
              "then": [
                { "set": { "thawNoCrew": true } },
                { "say": "sandoval", "text": "The bait shop is never wrong. But fine. I'll find it on my own, slower." }
              ]
            }
          ]
        },
        { "leave": "sandoval" }
      ]
    },
    "thawNight": {
      "title": "The breakwater in the thaw: a dozen of them, humming",
      "music": "tension",
      "steps": [
        { "hook": "where", "sets": ["w"], "note": "where it is as the night starts" },
        {
          "hook": "thing",
          "with": {
            "where": "greenNight",
            "x": 470,
            "y": 238,
            "hum": true,
            "wet": true,
            "others": [[-46, 8], [-22, 14], [26, 4], [48, 12], [70, 6]]
          }
        },
        {
          "stage": "greenNight",
          "actors": [
            { "id": "keeper", "cast": "keeper", "name": "You", "at": [150, 166] },
            { "id": "dory", "cast": "dory", "at": [186, 164], "facingLeft": true },
            { "id": "cal", "cast": "cal", "at": [210, 168], "facingLeft": true },
            { "id": "holder", "cast": "achebe", "at": [100, 162], "if": "w == 'lab'" },
            {
              "id": "holder",
              "cast": "pomfret",
              "at": [100, 162],
              "if": "w == 'buyer' && hook.buyer == 'pomfret'"
            },
            {
              "id": "holder",
              "cast": "sandoval",
              "at": [100, 162],
              "if": "w == 'buyer' && hook.buyer == 'sandoval'"
            },
            {
              "id": "holder",
              "cast": "achebe",
              "at": [100, 162],
              "if": "w == 'buyer' && hook.buyer == 'achebe'"
            }
          ]
        },
        {
          "narrate": [
            "The breakwater in the thaw. Rain on the granite, the harbor black and open all the way to the bell buoy, and the whole of it humming.",
            "There are a dozen of them in the water along the rocks, maybe more. Some are the size of a cat. Some are the size of Cal. They hold the weed with their small hands, and they wait."
          ]
        },
        {
          "if": "w == 'shop'",
          "then": [
            { "narrate": "Yours is in the cooler at your feet. It has gone completely quiet, which it never does." }
          ],
          "else": [
            {
              "if": "w == 'lab'",
              "then": [
                { "say": "holder", "text": "I brought it in the van with the hazards on. It hasn't stopped pushing at the lid since the Sagamore Bridge." }
              ],
              "else": [
                {
                  "if": "w == 'buyer'",
                  "then": [
                    {
                      "say": "holder",
                      "text": { "if": "hook.buyer == 'pomfret'", "then": "I drove from Wellfleet. I have not slept. The hat is in the car.", "else": "No crew. Just me. I wanted to see it without a lens in the way for once." }
                    }
                  ],
                  "else": [
                    { "narrate": "One of them comes to the bottom step and stays there, holding on, looking at you. It's bigger than it was. You know it anyway." }
                  ]
                }
              ]
            }
          ]
        },
        { "narrate": "There are two in the cooler. They have their hands through the slats, holding on to each other.", "if": "flag.secondEnd == 'pair' && w == 'buyer'" },
        { "narrate": "You know the tune. Odile in the Fog, side B of the Breakwaters' tape, hummed by a whole harbor.", "if": "flag.bwHeard" },
        {
          "choose": [
            {
              "label": { "if": "w == 'shop' || holder", "then": "Open the cooler", "else": "Go down to the bottom step" },
              "hint": "(let it go with the others)",
              "then": [
                { "set": { "thawEnd": "together" } },
                {
                  "if": "w == 'shop'",
                  "then": [
                    { "hook": "letGo" },
                    { "find": "tub", "in": "stock", "match": { "uniqueId": "clawTub" } },
                    {
                      "if": "tub",
                      "then": [
                        { "edit": "tub", "set": { "questKey": false, "nosale": false, "condLabel": "Empty" } },
                        { "refresh": "panel" }
                      ]
                    }
                  ]
                },
                { "rep": 4, "why": "Saw the sea things out on the thaw" },
                { "sway": "dory", "by": 2, "why": "The thaw at the breakwater" },
                {
                  "narrate": { "if": "w == 'shop' || holder", "then": "The lid comes up. It looks at you, at Dory, at Cal. Then it goes over the side on its hands, into the water, and the others close round it without a splash.", "else": "You go down to the bottom step. It reaches up and holds your finger, the way it did in October, for as long as it takes the tide to turn. Then it lets go." }
                },
                { "narrate": "The humming moves out past the end of the breakwater, all of it together, and gets quieter, and goes under the sound of the rain." },
                {
                  "if": "shelf.free",
                  "then": [
                    { "add": { "unique": "thawPearl" } },
                    { "refresh": "panel" },
                    { "narrate": "On the granite where it sat, there is a pearl the size of a gull's egg. Nobody saw it put there." }
                  ]
                },
                { "say": "cal", "text": "It waved. Did you see? It waved." },
                { "say": "dory", "text": ["It did not wave. It's a fish.", "It waved."] }
              ]
            },
            {
              "label": { "if": "w == 'shop'", "then": "Keep the lid shut. It stays with you.", "else": "Tell {holder.name} to take it home" },
              "hint": "(one stays behind)",
              "if": "w == 'shop' || holder",
              "then": [
                { "set": { "thawEnd": "stays" } },
                { "rep": 1 },
                {
                  "narrate": { "if": "w == 'shop'", "then": "You keep your hand on the lid. Inside, it doesn't push. After a while it starts humming again, very low, the note it hums in the back room.", "else": "{holder.name} picks up the cooler and doesn't open it. Inside, it doesn't push." }
                },
                { "narrate": "The others wait till the tide turns. Then the humming moves off, out past the bell buoy, and the harbor is just a harbor again." },
                { "say": "dory", "text": "It chose. Or you did. I can never tell the difference with that thing." }
              ]
            },
            {
              "label": "Give Kit Sandoval the signal",
              "hint": "(lights, cameras, $200)",
              "if": "flag.thawCrew",
              "then": [
                { "set": { "thawEnd": "filmed" } },
                { "coin": 200, "why": "Kit Sandoval paid for the night" },
                { "rep": -3, "why": "Brought the cameras to the breakwater" },
                { "sway": "dory", "by": -2, "why": "Brought the cameras" },
                { "hook": "letGo", "if": "w == 'shop'" },
                {
                  "narrate": [
                    "You lift a hand. Four floodlights come on at once from the Green. For one second the whole harbor is white, and full of pale, finned, surprised faces.",
                    "Then there is nothing in the water at all. Somewhere far out, under the noise of the generator, a single note, and then not even that."
                  ]
                },
                {
                  "narrate": { "if": "w == 'shop'", "then": "The cooler at your feet is open and empty, and wet. You didn't see it go.", "else": "{holder.name}'s cooler is open and empty, and wet." },
                  "if": "w == 'shop' || holder"
                },
                { "say": "dory", "text": "Well. That's season eight." }
              ]
            }
          ]
        },
        { "hook": "thing", "with": { "where": null, "others": null } }
      ]
    }
  },
  "beats": [
    { "drift": "thaw-dory", "from": "1-2", "to": "1-3", "cast": "dory", "scene": "thawDory" },
    { "drift": "thaw-sandoval", "from": "2-1", "to": "2-3", "cast": "sandoval", "scene": "thawSandoval", "if": "flag.thawIn && !flag.thawEnd" }
  ],
  "nights": [
    {
      "id": "thaw-night",
      "window": ["3-1", "4-4"],
      "if": "flag.thawIn && !flag.thawEnd",
      "scene": "thawNight",
      "test": [
        { "roll": { "freezerEnd": ["sold", "sea", "mascot"] } },
        { "roll": { "freezerBuyer": ["pomfret", "sandoval", "lab"] } },
        { "set": { "thawIn": true } },
        { "roll": { "thawCrew": [true, false] } },
        { "add": { "unique": "seaThing" }, "if": "flag.freezerEnd == 'mascot'" }
      ]
    }
  ],
  "calendar": [
    { "id": "thaw-night", "night": "thaw-night", "story": "freezerThaw", "where": "The breakwater", "title": "The thaw", "known": "flag.thawIn", "scene": "thawNight" }
  ],
  "epilogue": [
    { "line": "They went out on the thaw, all of them together. Some nights in April there's humming under Pier Nine, and Dory leaves a scallop on the ladder.", "if": "flag.thawEnd == 'together'" },
    {
      "line": { "if": "hook.seaWhere == 'shop'", "then": "The others went out on the thaw. Yours stayed. It hums in the back room all spring, and on high tides it hums louder.", "else": "The others went out on the thaw. One stayed, in a tank on the Cape, and hums at the bay." },
      "if": "flag.thawEnd == 'stays'"
    },
    { "line": "Strange Shores, season eight, episode one: forty seconds of floodlit harbor that nobody can explain. Dory won't watch it. Cal has watched it a hundred times.", "if": "flag.thawEnd == 'filmed'" }
  ],
  "talk": {
    "by": "dory",
    "rumour": [
      "The ice is going out of the harbor. Ask anyone at the co-op what they heard under Pier Nine last night.",
      "I didn't sleep. I sat on my float with a thermos and listened."
    ],
    "react": { "together": "They went out together on the tide. I leave a scallop on the ladder some nights. It's gone by morning.", "stays": "One stayed. Everybody has an opinion. Mine is it's nobody's business but its own.", "filmed": "I'm not watching it. Cal's watched it a hundred times. He pauses it on the faces." },
    "sway": { "together": { "dory": 2, "dot": 1 }, "stays": { "dot": 1 }, "filmed": { "dory": -2, "dot": 1 } }
  }
});
