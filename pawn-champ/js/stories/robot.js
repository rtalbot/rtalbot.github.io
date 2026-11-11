// Pawn Champ - The Robot Costume. Minor quest m63, batch L (docs/quests/MINOR.md#m63-the-robot-costume).
// A dad built a cardboard-and-dryer-hose robot suit with working lights in 1979. His son, Russ
// Albee, now fifty, pawns it while clearing out the garage. Three kids on Front Street want it for
// Halloween, and one of them really needs it. On Halloween night, on Main Street, you decide who
// wears it: Hazel, rent it to all three by the hour, or the man who wore it first.
// Main Street on Halloween night is drawn in js/quests/robot.js, with the suit's blinking lights.
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call. Code half: js/quests/robot.js.
defineStory({
  "id": "robot",
  "months": [1],
  "kind": "minor",
  "title": "The Robot Costume",
  "location": "halloween",
  "rumour": "Somebody built a robot costume in 1979 that still lights up.",
  "endings": { "hazel": "The New Kid in Tin", "rented": "By the Hour", "russ": "The First Wearer" },
  "outcome": "flag.robotEnd",
  "about": [
    "An October story. Russ Albee pawns the robot costume his father built in 1979 from dryer hose, a cake tin and twelve blinking bulbs, and asks you to put it in the window so a kid can wear it on Halloween (§{russRobot}). Three Front Street kids press their noses to the glass (§{robotKids}): Ozzie, who's sick of being a ninja; Rudy, who wants whatever Ozzie wants; and Hazel, new in town, who thinks that if she were the robot people would ask who was inside.",
    "On Halloween (§{robotNight}) Russ wheels his father down Main Street to see the window. Give the suit to Hazel to keep (The New Kid in Tin), rent it to all three an hour each (By the Hour), give it back to the old man, who puts the helmet on his son (The First Wearer), or leave it on the counter for everyone to look at."
  ],
  "cast": {
    "russ": {
      "name": "Russ Albee",
      "look": { "skin": "#e0b090", "hair": "#8a7a6a", "hs": 0, "coat": "#5a6a4a", "style": "jacket", "pants": "#3a3a44", "glasses": "#2a2a2e", "stout": true }
    },
    "hazel": {
      "name": "Hazel",
      "look": { "kid": true, "skin": "#7a5038", "hair": "#1a1210", "hs": 4, "coat": "#e8e4dc", "style": "hoodie", "pants": "#3a3a4a" }
    },
    "ozzie": {
      "name": "Ozzie",
      "look": { "kid": true, "skin": "#f0d0b8", "hair": "#c86a2a", "hs": 0, "coat": "#3a8a4a", "style": "puffer", "pants": "#3a3a4a", "band": "#e8c040" }
    },
    "rudy": {
      "name": "Rudy",
      "look": { "kid": true, "skin": "#c89070", "hair": "#3a2a1e", "hs": 1, "coat": "#2a5aa0", "style": "hoodie", "pants": "#2a2a30" }
    }
  },
  "icons": {
    "robot": [
      "...kkkkkk...",
      "...kssssk...",
      "...kbsbsk...",
      "...kssssk...",
      ".kkkkkkkkkk.",
      "kdkssssssskd",
      "kdksrsgsbskd",
      "kdkssssssskd",
      ".k.kssssk.k.",
      "...kdkkdk...",
      "...kdk.kdk..",
      "..kkk..kkk.."
    ]
  },
  "uniques": {
    "robotSuit": {
      "name": "1979 robot costume",
      "icon": "robot",
      "cat": "curio",
      "guide": 40,
      "questKey": true,
      "tells": [
        "Cardboard painted silver, dryer-hose arms, a cake tin for a helmet. Inside the chest, a 9-volt and twelve bulbs that still work.",
        "Written inside the helmet in marker: RUSSELL A., AGE 8. IF FOUND RETURN TO 14 FRONT ST."
      ]
    }
  },
  "scenes": {
    "russRobot": {
      "title": "Russ Albee pawns his dad's robot costume",
      "customer": "russ",
      "steps": [
        { "say": "russ", "text": "Russ Albee. My dad built this in 1979. Somebody told me a robot costume from back then still lights up. It does. Watch." },
        { "narrate": "He flips a switch inside the chest. Twelve bulbs blink red, green and blue, in an order that was clearly worked out very carefully by a grown man in a garage." },
        { "say": "russ", "text": "Dryer hose, a cake tin, Christmas lights from the five-and-dime. I wore it four Halloweens running. Dad's in Bayview now, the home, and I'm clearing out the garage. I can't throw it out. I can't keep it." },
        { "offer": { "unique": "robotSuit" }, "persona": "honest", "asking": 40, "min": 25 },
        {
          "if": "offer != 'deal'",
          "then": [
            { "say": "russ", "text": "Back in the garage, then. With the ghosts and the lawnmower." },
            { "leave": "russ" },
            { "end": true }
          ]
        },
        { "set": { "robotIn": true } },
        { "say": "russ", "text": "Put it in the window. Some kid should be walking down Main Street in it on Halloween. Not a fifty-year-old man. I checked. It doesn't fit." },
        { "leave": "russ" }
      ]
    },
    "robotKids": {
      "title": "Three noses on the window",
      "customer": "hazel",
      "steps": [
        { "set": { "robotKids": true } },
        { "hook": "friends", "sets": ["ozzie", "rudy"] },
        { "narrate": "Three kids from Front Street, who have clearly been looking at your window for some time." },
        { "say": "ozzie", "text": "Ozzie. I want the robot. I've been a ninja three years running. I'm done being a ninja." },
        { "say": "rudy", "text": "Rudy. I want the robot because Ozzie wants the robot." },
        {
          "say": "hazel",
          "text": [
            "I'm Hazel. We just moved in over the hardware store. I don't know anybody yet. I'm going as a ghost. It's a sheet.",
            "It's a good sheet. I just thought, if I was the robot, people would come and ask who's in there."
          ]
        },
        { "say": "ozzie", "text": "I've got eleven dollars." },
        { "narrate": "They leave three nose prints on the glass, at three heights. Halloween's next week." },
        { "remove": "ozzie" },
        { "remove": "rudy" },
        { "leave": "hazel" }
      ]
    },
    "robotNight": {
      "title": "Halloween on Main Street: who wears the robot",
      "music": "night",
      "steps": [
        { "hook": "lightsOff" },
        {
          "stage": "halloween",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [262, 168] },
            { "id": "hazel", "cast": "hazel", "at": [150, 166] },
            { "id": "ozzie", "cast": "ozzie", "at": [120, 168] },
            { "id": "rudy", "cast": "rudy", "at": [176, 170], "facingLeft": true },
            { "id": "russ", "cast": "russ", "at": [40, 162] },
            { "id": "kid", "look": "kid", "at": [[70, 172], [210, 176]] },
            { "id": "kid3", "look": "kid", "at": [300, 172], "facingLeft": true }
          ]
        },
        { "narrate": "Halloween on Main Street. A jack-o'-lantern on every step, leaves in the gutter, and a crowd of very small pirates. The robot suit is on your counter with the door propped open." },
        { "say": "ozzie", "text": "Is it me? Tell me it's me." },
        { "narrate": "Down the street, Russ Albee is pushing a wheelchair. In it, in a blanket and a paper witch's hat, is a very old man who is looking hard at your window." },
        { "say": "russ", "text": "Dad wanted to see the trick-or-treaters. He saw the window and said, \"That's mine. I made that.\"" },
        { "find": "suit", "in": "stock", "match": { "uniqueId": "robotSuit" } },
        {
          "choose": [
            {
              "label": "Give it to Hazel, to keep",
              "disabled": "!suit",
              "then": [
                { "take": "suit" },
                { "set": { "robotEnd": "hazel" } },
                { "hook": "wear", "with": "hazel", "sets": ["robot"] },
                { "narrate": "The helmet goes on. The chest lights up. Every kid on Main Street stops." },
                { "say": "ozzie", "text": "Who's in there?" },
                { "say": "robot", "text": "Hazel. From over the hardware store. Hi." },
                { "narrate": "By the end of the street she is walking in the middle of a pack of nine kids, including Ozzie, who has decided to be her robot assistant. Russ's father claps, slowly, from the wheelchair." },
                { "rep": 3 }
              ]
            },
            {
              "label": "Rent it to all three, an hour each",
              "hint": "($5 an hour)",
              "disabled": "!suit",
              "then": [
                { "take": "suit" },
                { "set": { "robotEnd": "rented" } },
                { "hook": "wear", "with": "ozzie", "sets": ["robot"] },
                { "narrate": "Ozzie from six to seven. Rudy from seven to eight, who insists on being a robot that walks like a crab. Hazel from eight till the street lights go off. Then the suit comes back to your counter, slightly dented." },
                { "coin": 15, "why": "Rented the robot suit by the hour" },
                {
                  "edit": "suit",
                  "set": { "questKey": false, "nosale": false },
                  "note": "back on the shelf, yours to sell"
                },
                { "hook": "putBack" },
                { "refresh": "panel" },
                { "say": "hazel", "text": "Can I have it again next year? I'll save up." }
              ]
            },
            {
              "label": "Give it back to the man who wore it first",
              "disabled": "!suit",
              "then": [
                { "take": "suit" },
                { "set": { "robotEnd": "russ" } },
                { "narrate": "You carry the helmet down the street. The old man takes it in both hands and turns it over until he finds the writing inside." },
                { "say": "russ", "text": "He says the lights are wired wrong. He says he always meant to fix them." },
                { "narrate": "He puts the cake tin on his son's head. It doesn't fit. It fits well enough. The kids cheer for the tallest robot on Main Street, and Russ walks the wheelchair home with the chest lights blinking." },
                { "hook": "wear", "with": "russ", "sets": ["robot"] },
                { "rep": 2 },
                { "say": "hazel", "text": "That's okay. I like my sheet." }
              ]
            },
            {
              "label": "Leave it on the counter. Everybody can look.",
              "then": [
                { "edit": "suit", "set": { "questKey": false, "nosale": false }, "if": "suit" },
                { "refresh": "panel", "if": "suit" },
                { "narrate": "The kids come up the steps all night to look at it. Nobody wears it. In the morning it's still on the counter, lights off." }
              ]
            }
          ]
        },
        { "hook": "afterwards" }
      ]
    }
  },
  "beats": [
    { "drift": "robot", "from": "3-1", "to": "3-4", "cast": "russ", "scene": "russRobot" },
    { "drift": "robot-kids", "from": "3-2", "to": "4-2", "cast": "hazel", "scene": "robotKids", "if": "flag.robotIn && !flag.robotKids && hook.suitHere" }
  ],
  "nights": [
    {
      "id": "robot-halloween",
      "window": ["4-3", "4-4"],
      "weekdays": [3, 4],
      "if": "flag.robotIn && !flag.robotEnd",
      "scene": "robotNight",
      "test": [{ "set": { "robotIn": true } }, { "add": { "unique": "robotSuit" } }]
    }
  ],
  "calendar": [
    { "id": "robot-halloween", "night": "robot-halloween", "story": "robot", "where": "Main Street", "title": "Halloween", "known": "flag.robotKids", "scene": "robotNight" }
  ],
  "epilogue": [
    { "line": "Hazel from over the hardware store knows everybody on Front Street now. She was the robot.", "if": "flag.robotEnd == 'hazel'" },
    { "line": "Three kids have booked the robot suit for next Halloween, an hour each. Rudy has asked for crab legs.", "if": "flag.robotEnd == 'rented'" },
    { "line": "Russ Albee's father rewired the robot's lights at Bayview, at a card table, in an afternoon. They blink in the right order now.", "if": "flag.robotEnd == 'russ'" }
  ],
  "talk": {
    "by": "dot",
    "rumour": [
      "Russ Albee came by for chowder. Says his dad's robot costume still lights up, after forty-odd years.",
      "Built it out of a dryer hose. They don't make dads like that. They don't make dryer hoses like that either."
    ],
    "react": { "hazel": "That new girl over the hardware store, Hazel? Every kid on Front Street knows her now. She was the robot.", "rented": "Three kids in one robot suit, one at a time. My window counted. The crab one was the best.", "russ": "Old Mr. Albee came down Main Street in a wheelchair with a robot helmet on his son's head. I gave them both free fries." }
  }
});
