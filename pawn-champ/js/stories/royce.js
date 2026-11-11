// Pawn Champ - The Man Who Came Back: the sequel to M9 Static on Channel 16 (docs/quests/SEQUELS.md#the-man-who-came-back).
// Batch U, round 3. Drawn in a later month of a stay, only if Static on Channel 16 ended Homecoming or
// Day in Court: Royce Kittredge's first winter back in a town that buried him.
//
// Hook (W1-W2)   Royce brings in the condolence book from his own memorial service in 1991. Everyone
//                in town signed it. He reads it every night, and it's killing him.
// Scene (W2-W3)  the Old Burying Ground at dusk: his stone, ROYCE KITTREDGE, LOST AT SEA, and Dory.
// Endings: What They Said (Dory reads the book), Buried at Last (the book goes into the empty grave),
// A Stop on the Tour (Felix Amory buys it for the ghost walk).
//
// Written as data: docs/STORY_DATA.md. Strict JSON inside the call.
defineStory({
  "id": "royce",
  "kind": "minor",
  "title": "The Man Who Came Back",
  "location": "graveyard",
  "sequel": "radio",
  "after": ["homecoming", "court"],
  "months": [2, 3, 4, 5],
  "rumour": "Royce Kittredge has a headstone in the Old Burying Ground, and he walks past it every day.",
  "teaser": "Royce Kittredge's first winter ashore in thirty-four years. Somebody has cleared the snow off his headstone in the Old Burying Ground, and nobody will say who.",
  "endings": { "read": "What They Said", "buried": "Buried at Last", "tour": "A Stop on the Tour" },
  "uniques": {
    "condolenceBook": {
      "name": "Condolence book, Royce Kittredge, 1991",
      "icon": "tome",
      "cat": "curio",
      "guide": 30,
      "condLabel": "Thumbed",
      "tells": [
        "Green cloth, gilt edges, from the funeral home on Chapel Street. \"In Loving Memory of Royce Kittredge, Lost at Sea, October 1991.\"",
        "Two hundred and twelve signatures. Half the town wrote something. Somebody wrote \"He owed me ten dollars and I forgive him.\" Somebody else wrote it again, underneath, in a different hand."
      ]
    }
  },
  "about": [
    "A winter sequel to The Radio. Royce Kittredge, who sank his own boat in 1991 and let the town believe him lost at sea, brings in the condolence book from his own memorial service (§{royceHook}). Depending on how The Radio ended, he is either broke and shunned by his daughter Dory, or living with her and unable to bear reading the book every night. He asks you to come and see his headstone at dusk.",
    "At the Old Burying Ground (§{royceStone}) Dory turns up too. Give Dory the book to read, full of what two hundred people said about her father (What They Said), help Royce bury it under his own stone before she takes him home for supper (Buried at Last), sell it to Felix Amory for his ghost walk (A Stop on the Tour), or just walk them both to the gate."
  ],
  "scenes": {
    "royceHook": {
      "title": "Royce brings in his own condolence book",
      "customer": "royce",
      "steps": [
        { "say": "royce", "text": "Royce Kittredge. You know me. Everybody knows me now. That's the trouble." },
        { "narrate": "He puts a green cloth book on the counter: the condolence book from his own memorial service, in 1991, from the funeral home on Chapel Street." },
        {
          "say": "royce",
          "text": { "if": "ended.radio == 'court'", "then": "Two years suspended, and the insurance company wants its money back from a man with a garden and a tar-paper shack. Dory hasn't said a word to me since the paper came out. I need sixty dollars, and I need this out of my house.", "else": "Dory found it in her mother's cedar chest and gave it to me. I think she meant it kindly. I read it every night. Two hundred people saying what I was. I can't be any of it. Take it off me." }
        },
        {
          "offer": { "unique": "condolenceBook" },
          "persona": "desperate",
          "asking": 60,
          "min": 30,
          "onWatch": "continue"
        },
        { "set": { "royceMet": true } },
        { "end": true, "if": "offer == 'watch'" },
        { "say": "royce", "if": "offer != 'deal'", "text": "No. Fair enough. Nobody wants a dead man's book. Not even the dead man." },
        { "say": "royce", "text": "They gave me a stone in the Old Burying Ground. I go and look at it, at dusk. {placed:royce-stone}, if you want to see where they put me." },
        { "set": { "royceKnown": true } },
        { "toast": "Calendar: the Old Burying Ground at dusk, {placed:royce-stone}", "look": "royce" },
        { "leave": "royce" }
      ]
    },
    "royceStone": {
      "title": "Royce's stone",
      "music": "tender",
      "steps": [
        {
          "stage": "graveyard",
          "actors": [
            { "id": "you", "cast": "keeper", "name": "You", "at": [100, 166] },
            { "id": "royce", "cast": "royce", "at": [180, 164] }
          ]
        },
        {
          "narrate": { "if": "month >= 3 && month <= 5", "then": "The Old Burying Ground at dusk, with snow on every stone but one. ROYCE KITTREDGE, MASTER OF THE MARGARET RUTH, LOST AT SEA 14 OCTOBER 1991. HE IS NOT HERE. Royce stands in front of it with his hands in his pockets.", "else": "The Old Burying Ground at dusk. ROYCE KITTREDGE, MASTER OF THE MARGARET RUTH, LOST AT SEA 14 OCTOBER 1991. HE IS NOT HERE. Royce stands in front of it with his hands in his pockets." }
        },
        { "say": "royce", "text": "They got that last line right, anyway." },
        { "enter": { "id": "dory", "cast": "dory", "at": [280, 162], "facingLeft": true } },
        { "walk": "dory", "to": [230, 162] },
        {
          "say": "dory",
          "text": { "if": "ended.radio == 'court'", "then": "I didn't come for you. I come every Thursday. I've come every Thursday for thirty-four years. I don't know how to stop.", "else": "Thought I'd find you here. Mum used to bring me on Thursdays. I don't know why I still come. You're at my kitchen table every morning." }
        },
        { "find": "book", "in": "stock", "match": { "uniqueId": "condolenceBook" } },
        {
          "choose": [
            {
              "label": "Give Dory the condolence book",
              "hint": "(what the town said about her dad)",
              "disabled": "!book",
              "off": { "hint": "(you'd need the book)" },
              "then": [
                { "take": "book" },
                { "narrate": "Dory opens it standing up, in the cold, under the lamp by the gate. She reads. Somewhere in the middle she sits down on the next stone over, which is a Pennywell, and keeps reading." },
                {
                  "say": "dory",
                  "text": [
                    "\"He showed me how to splice a line when I was nine and never once told me I was doing it wrong.\" That's Chet. That's Chet Amaral's writing.",
                    "You were all this. Before you weren't. You could try being some of it again. I'd help."
                  ]
                },
                { "narrate": "Royce doesn't say anything. He sits down beside her, and she lets him." },
                { "set": { "royceEnd": "read" } },
                { "rep": 4, "why": "Gave Dory Kittredge her father's condolence book" }
              ]
            },
            {
              "label": "Help Royce put the book in the ground, under his own stone",
              "disabled": "!book",
              "off": { "hint": "(you'd need the book)" },
              "then": [
                { "take": "book" },
                { "narrate": "Royce has brought a trowel, as if he knew. The ground under the snow is soft enough at the edge of the stone. He puts the book in a bread bag, and the bread bag in the ground, and pats it flat with his hand." },
                { "say": "royce", "text": "There. Now there's something of me in there. Royce Kittredge, 1991. Rest in peace, you poor fool." },
                { "say": "dory", "text": "Come home for supper, Dad. The other one. The one that isn't dead." },
                { "set": { "royceEnd": "buried" } },
                { "rep": 2 }
              ]
            },
            {
              "label": "Sell the book to Felix Amory for the ghost walk",
              "hint": "(+$80)",
              "disabled": "!book",
              "off": { "hint": "(you'd need the book)" },
              "then": [
                { "take": "book" },
                { "narrate": "Felix Amory pays eighty dollars the next morning, in an envelope with a ghost drawn on it. By the weekend the ghost walk has a new stop: the grave of the man who isn't in it, and a reading from his condolence book by flashlight." },
                { "say": "royce", "text": "Felix does a voice for me. It isn't my voice. It's better than my voice." },
                { "set": { "royceEnd": "tour" } },
                { "coin": 80, "why": "Felix Amory bought Royce Kittredge's condolence book" },
                { "rep": -2 }
              ]
            },
            {
              "label": "Say nothing, and walk them both to the gate",
              "then": [
                { "narrate": "You walk them both to the gate and leave them there under the lamp, three feet apart, not talking, which is nearer than they've been." },
                { "set": { "royceEnd": "buried" }, "if": "ended.radio == 'court'" },
                { "set": { "royceEnd": "read" }, "if": "ended.radio != 'court'" }
              ]
            }
          ]
        }
      ]
    }
  },
  "beats": [{ "drift": "royce-hook", "from": "1-2", "to": "2-1", "cast": "royce", "scene": "royceHook" }],
  "nights": [
    {
      "id": "royce-stone",
      "window": ["2-1", "3-4"],
      "if": "flag.royceKnown && !flag.royceEnd",
      "scene": "royceStone",
      "test": [
        { "set": { "royceKnown": true } },
        { "roll": { "radioEnd": ["homecoming", "court"] } },
        { "add": { "unique": "condolenceBook" }, "if": "random < 0.7" }
      ]
    }
  ],
  "calendar": [
    { "id": "royce-stone", "night": "royce-stone", "story": "royce", "where": "The Old Burying Ground", "title": "Royce's stone", "known": "flag.royceKnown", "scene": "royceStone" }
  ],
  "epilogue": [
    { "line": "Dory Kittredge keeps her father's condolence book by the till at the fish market. Customers sign it now. Royce pretends not to read it.", "if": "flag.royceEnd == 'read'" },
    { "line": "There's something in Royce Kittredge's grave at last: a book in a bread bag. He doesn't visit it anymore. He doesn't need to.", "if": "flag.royceEnd == 'buried'" },
    { "line": "Stop eleven on the ghost walk: the grave of the man who isn't in it. Some nights the man himself is in the crowd, heckling.", "if": "flag.royceEnd == 'tour'" }
  ],
  "talk": {
    "by": "dory",
    "rumour": [
      "Dad walks past his own headstone every day on the way to the market. Every day. He says it's the shortest way. It isn't.",
      "Mum kept the book from his memorial in her cedar chest. I gave it to him. I thought it would help. I don't think it helped."
    ],
    "react": { "read": "I read the book. All of it, in the cold, on a Pennywell. Two hundred people liked my dad. I'm going to try. That's all I've got. I'm going to try.", "buried": "He put the book in the ground under his own stone. He came home for supper after. First time he's called it home.", "tour": "Felix Amory reads my father's funeral book out loud to tourists now, with a flashlight. Dad goes along. He laughs at the sad bits. I can't decide if I mind." }
  },
  "outcome": "flag.royceEnd"
});
