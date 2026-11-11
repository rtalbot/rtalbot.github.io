// Pawn Champ - the town cast: twenty-six regulars who live in Hollow Neck whatever stories a run draws
// (docs/quests/TOWN.md). Each one runs a place in town and owns a topic of town talk.
//   - They come into the shop: to pass on the rumour of a drawn quest on their topic, a day or two
//     before it starts; to react when a quest on their topic has ended; and at least once a run just
//     to be seen.
//   - Three of them are in the spotlight each run (picked from the run code) and play their own
//     three-step thread, centred on one thing they want back or want gone.
// Quests use these CAST entries and never define their own copy. A quest that needs a harbormaster,
// a priest, a librarian or a trivia host uses the regular.
'use strict';

const TOWN = {};
const TOWN_SPOTLIGHT = 3;
// about this many regulars are in town in a month; the rest are away (Rich, 2026-11-01)
// the first day a regular comes in to talk (rumours, threads, chat); before it, only as a customer
const TOWN_TALK_FROM = 6;
const TOWN_PRESENT = 8;
const TOWN_VISITS_PER_DAY = 2;
function addRegular(id, r) {
  TOWN[id] = { id, ...r };
  CAST[id] = { name: r.name, look: r.look };
}

// ---------------------------------------------------------------- run state
function townState() {
  S.town = S.town || { met: {}, told: {}, reacted: {}, thr: {} };
  return S.town;
}
function thread(id) {
  const t = townState().thr;
  return (t[id] = t[id] || { step: 0, f: {}, end: null });
}
const regularLook = id => CAST[id].look;

// ---------------------------------------------------------------- what a regular says about a quest
// TOWN_TALK[questId] = { by: regular, rumour: [lines], react: { ending: line } or a line for any ending }
// One row per quest. The rumour is said a day or two before the quest's first customer.
const TOWN_TALK = {
  hollis: { by: 'agathe', rumour: ['A word of warning, shop to shop. Hollis Fenn, a clerk at the Customs House, brought me his watch this morning. It stopped at eight minutes to nine and made him late for his promotion interview.', 'I opened it up. Nothing wrong with it. He thinks somebody stopped it on purpose, and he wanted me to swear to that. I fix clocks. I don\'t swear to them. If he brings it to you next, that\'s why.'],
    react: { promoted: 'Hollis Fenn got his promotion. He came in to have his watch cleaned, and tipped. Nobody tips a clock shop.', hush: 'Somebody at Customs bought a very expensive silence. You can hear it from Water Street.', betrayed: 'Hollis Fenn doesn\'t come by the shop anymore. He says the watch keeps perfect time now, and he hates it.', leftToThem: 'That business at Customs blew over, they say. Things that blow over usually land somewhere.', walkedAway: 'That Customs clerk still talks about his watch. To anyone. He\'s on to the mailman now.' } },
  grey: { by: 'orsolya', rumour: ['A gentleman in a grey suit walked past my booth and the crystal ball fogged over. It has never fogged. It is a fishbowl.', 'He asks shopkeepers what they want. Don\'t tell him.'],
    react: { keeper: 'The cards won\'t come out of the deck when I think of you. That has never happened. I\'ve stopped thinking of you.', paid: 'You sold his curios. I can feel them all over town, like a draught.', rewritten: 'The man in grey has gone. You did something to his paperwork, I hear. Good. Paperwork is how they get you.', abner: 'Old Abner Crooke has stopped walking the boardwalk at night. I used to see him every Tuesday. He looked like a man who\'d finally been let off.', betterOffer: 'You traded with him and walked away. Nobody walks away. Walk carefully.', refused: 'You never signed. I read it in a teacup this morning, and in your face just now.' } },
  fog: { by: 'tess', rumour: ['I hear the fog\'s coming in early this year. The real stuff. The old-timers call it Mott\'s week.', 'Every boat is tied up till it clears. The drowned don\'t keep to the channel.'],
    react: { compass: 'Captain Mott\'s mooring has a fresh rope on it this morning, tied in a knot nobody has used since sail.', fairDeal: 'The fog cleared and everybody\'s grandmother\'s debts were settled. Fair prices, they say. The dead talk about you.', tycoon: 'You made money off the drowned. I\'ve seen it done before. Odile wouldn\'t.', allAshore: 'The Prudence Gale\'s bell rang at midnight and every drowned man in the harbor came ashore for one drink. My grandfather bought the round. Thank you.', lastDance: 'They danced at the Grange, the drowned and the living. Widow Ashgrove danced every one. I sat out, and I\'m sorry I did.', lodger: 'You\'ve still got one of them, haven\'t you. The cold spot by your door. Tell him the fog\'s gone.' } },
  psalter: { by: 'skip', rumour: ['On my route, there\'s a crossing guard who growls. I mean growls. At the bus.', 'And the vice-principal\'s wearing felt ears to assembly. Felt. Wolf. Ears.'],
    react: { amber: 'The crossing guard waved at me today. A normal wave. With a hand.', silver: 'Half the PTA had a funny week and nobody will talk about it. Funny week. That\'s all.', ink: 'Somebody burned an old book on the marsh, I heard. The kids say the howling stopped.', returned: 'The howling stopped, and the old book\'s back on your shelf, they say. The crossing guard asked me if you\'re open Saturdays.', partial: 'Some of them came back from the marsh. Some of them, the kids say, are still out there.', watch: 'Barrow\'s got a box in the evidence room that growls. The officers draw straws for night shift.', none: 'I heard the man from the Hand went into the marsh. I didn\'t hear about him coming out.' } },
  radio: { by: 'ruthie', rumour: ['The fishermen at the bar are whispering about Channel 16. A boat that sank in 1991 is calling in. At closing time.', 'They say it calls from your shop. I said don\'t be silly. Then I came over to look.'],
    react: { homecoming: 'Royce Kittredge bought a round at the Anchor. Thirty-five years late. The bar forgave him in about a minute.', court: 'There\'s a trial in Barnstable about the Margaret Ruth. Half the bar is going. They\'re making signs.', silence: 'Channel 16 is quiet now. The fishermen say it\'s worse.', returned: 'Chet has his radio back. He listens to it at the bar with one earphone, like a man waiting for a ballgame.' } },
  spoons: { by: 'gordie', rumour: ['Ellery Thorne up on Cliff Road. Old money, new Buick, from me. He\'s paying anything for souvenir spoons. Spoons!', 'If I had a spoon I\'d sell it to him and buy a better car. From me.'],
    react: { thorne: 'Thorne got all seven spoons. Paid cash for the last one, they say. I sent him a brochure.', rook: 'Delphine Rook outbid Ellery Thorne. I\'m going to sell her a car. She\'s got the temperament.', scattered: 'Those spoons went all over town. My cousin\'s got one. He stirs coffee with it, like an animal.' } },
  selectmen: { by: 'gordie', rumour: ['Gordie Haines! You know me. I\'m running for selectman. Big things for Pier Nine. Big, shiny things.', 'Tess Bascombe\'s running too. Good woman. Wrong. I\'ll be by with a sign.'],
    react: { bascombe: 'Selectman Bascombe. I lost to a woman in a beanie. I respect it. I\'m going to sell her a truck.', haines: 'SELECTMAN Haines! The marina\'s coming. The jingle is already written.', kingmaker: 'I hear you decided that race. Whoever you are, I want you on my side next time.' } },
  breakwaters: { by: 'ruthie', rumour: ['Remember the Breakwaters? 1987? No, you were a baby. Skip, the bus driver, was their guitarist.', 'He wants his guitar back. He pawned it here in 1994. I said, Skip, nothing lasts thirty years in a pawnshop. Then I thought about Odile.'],
    react: { odile: 'They played the song about Odile at the Anchor. Dee couldn\'t get through the last verse, so the whole bar sang it for her.', oneMore: 'The Breakwaters played one more night. The floor\'s still sticky. That\'s a compliment.', lastChord: 'The Breakwaters are done, Skip says. Done done. He still plays in the bus depot when he thinks nobody\'s listening.' } },
  freezer: { by: 'dot', rumour: ['Dory Kittredge\'s nephew, from the fish market, was at the Clam Shack window white as a napkin. Something came up in the dredge, and it\'s in her freezer.', 'He says it isn\'t frozen. He says it looked at him.'],
    react: { sold: 'That TV crew went home with the thing from the freezer. Dory bought a new truck. She doesn\'t look happy in it.', sea: 'Dory took it back out past the breakwater herself, they say. In a cooler. At dawn.', mascot: 'You\'ve got it, haven\'t you. Dory\'s thing. In the back. People are coming to the Clam Shack just to ask.' } },
  museum: { by: 'hester', rumour: ['A touring exhibition of stage crowns is coming to the Historical Society. Real stones on the costume jewelry. Somebody thought that was a good idea.', 'I\'ve read every account of every theft in this county since 1712. They all started with somebody thinking something was a good idea.'],
    react: { getaway: 'The crowns exhibition left early. Short one crown. Dr. Lusk is writing a very angry letter to everyone.', cuffs: 'Barrow caught the red-haired girl. Dr. Lusk sent the police a fruit basket.', both: 'They caught everyone involved in the crown business, I hear. Everyone. I\'d check your own pockets.', swap: 'Dr. Lusk swears the crown she took home is real. The light in it is wrong. I didn\'t tell her.' } },
  // batch G (M23 to M28)
  dead: { by: 'marguerite', rumour: ['The post office closes on the twentieth. I argued against the merger for two hours at Town Meeting. We get a drop box outside the pharmacy.', 'Winifred Paine has been our postmistress for forty-one years. She\'s selling up. I hope somebody gives her a fair price.'],
    react: { anselm: 'A stamp dealer from Worcester left town very pleased with himself. Winifred didn\'t look pleased at all.', inspector: 'A federal inspector thanked the town in writing. It\'s the first letter from Washington I\'ve ever framed.', auction: 'Winifred Paine sold a sheet of stamps in Boston for more than the post office building. I\'ve asked her to speak at Town Meeting. She said no, in the nicest way.', swap: 'The Postal Museum has a new display. Winifred says the stamps look very crisp. She said it twice.' } },
  plotter: { by: 'tess', rumour: ['Word on the pier is somebody\'s been dragging for scallops in the closed area off Gannet. At night, lights off. The fleet knows who, and nobody will say.', 'If a chartplotter comes across your counter, I\'d like to know. That\'s all I\'ll say.'],
    react: { hearing: 'You put it on the table in front of everybody. That was right. It was also my nephew. Give me a week.', family: 'You brought it to me first, outside, in the wind. I won\'t forget that. Neither will Kenny, and that\'s good for him.', overboard: 'Overboard, you said. Funny how much goes overboard in this harbor. The bed\'s quiet now, anyway.', sold: 'Half the fleet found the closed bed this week. Somebody sold them the way in. I can guess who.' } },
  miniature: { by: 'hester', rumour: ['Cornelius Webb built the whole of Main Street in his attic, from 1932 to 1952. His grandson is clearing the house.', 'I have wanted that model since I was nine. If it comes across your counter, I will be very calm about it.'],
    react: { athenaeum: 'Main Street is in our front hall with its lamps on. Children press their noses to the glass. I have stopped wiping it.', collector: 'Connecticut. Well. They send photographs. The trains run through the bank.', window: 'Main Street in your window, looking at Main Street. I walk past it twice a day on purpose.' } },
  stool: { by: 'dot', rumour: ['Pearl\'s is closing at the end of the month. Sixty-one years. I sat on stool four for most of them.', 'Pearl says she wants one stool back before she goes. Number nine. It\'s been gone since 1977, and nobody says who took it.'],
    react: { dot: 'Pearl\'s counter is in my front room till spring. She comes in at five and tells me my eggs are wrong. They are.', home: 'Every stool went home. Mine\'s in my kitchen with my initials under it twice. I sit on it to peel potatoes.', chain: 'There\'s a coffee shop on Pearl\'s corner now. I walk on the other side of the street. It\'s very good coffee. I hate it.', mornings: 'Pearl\'s is open Thursdays. Ernie Lavallee sits on eight in a tie. We all pretend not to notice. We all notice.' } },
  // the deep set (M20 to M22, m53 to m60)
  sounding: { by: 'tess', rumour: ['Old Cyrus Whitlow was down on the town pier at dawn with a sounding line, swinging lead into water he can\'t see the bottom of.', 'He says the harbor\'s deeper than it was. I said harbors don\'t do that. He said this one does.'],
    react: { plumb: 'The tide tables are right again. Cyrus Whitlow says you found the bottom for him. I don\'t ask.', sold: 'Lambeth Sorrel has Cyrus\'s lead now. The soundings off the pier changed overnight. Deeper.', steps: 'Somebody saw three steps going down off the end of the pier at low water. Then the tide came in.', slack: 'Slack water all week. No current, no tide, no wind. The boats just sat. Then it let go.' } },
  plates: { by: 'marv', rumour: ['I\'m clearing the old observatory on Gull Point for Leo Halvorsen. Crates of glass plates, star photographs from the 1920s. Nobody wants them. I asked Hester.', 'His grandfather wrote in the margin of one of them. "Closer." Just that. I put that crate in the van last.'],
    react: { shuttered: 'Leo nailed the observatory dome shut himself. From the inside. Then he climbed out of the window. I\'ve cleared stranger houses. Not many.', correspondence: 'Leo Halvorsen is writing to an observatory in Chile about those plates. They write back. I\'ve stopped taking crates from Gull Point.', published: 'Everybody was on the Green last night, looking up. I looked too. Thirty years of attics, and I\'ve never wanted to look up before.', shelf: 'The Halvorsen plates are still on your shelf. Don\'t hold them up to the light. I did, once, in the van.' } },
  thirteenth: { by: 'orsolya', rumour: ['Agnes Bram kept house for Odile\'s mother. She came to my parlor asking how many rooms your shop has.', 'I told her four. She laughed at me. She is ninety-one and she laughed at me.'],
    react: { locked: 'Your shop has twelve rooms too many and you\'ve locked them all. Good. Some doors are better as walls.', sorrel: 'The thirteenth room is Lambeth Sorrel\'s now, I hear. He was always going to want it. The cards never liked him.', taking: 'Open all hours, they say. Your lamp burns all night. People see someone at the counter who isn\'t you.' } },
  whelk: { by: 'dot', rumour: ['Wilhelmina Holm, the retired teacher, was at my window holding a shell to her ear. Left-handed whelk. She says it plays your shop. An hour from now.'],
    react: { returned: 'Wilhelmina put her whelk back in the sand. She says she misses knowing what you\'d say before you say it.', sold: 'That whelk went to a collector. He wrote to Wilhelmina saying it only plays the sea now. She was very pleased.', listened: 'Wilhelmina says she listened all the way to the end of the hour. She won\'t say what you did.' } },
  gansey: { by: 'tess', rumour: ['Jonah Iver found a gansey on his step. A fisherman\'s sweater. The pattern isn\'t any family\'s in town. I checked them all. I\'ve got them on cards.'],
    react: { society: 'The gansey\'s at the Historical Society, in a case. The pattern is from a boat that never came home. Hester found it.', jonah: 'Jonah Iver wears that gansey now. He says it\'s warm. He says it\'s too warm, some nights.', burned: 'Somebody burned the gansey on the beach. The smoke went out to sea against the wind.' } },
  helmet: { by: 'dory', rumour: ['Bertil Sousa came up early from the harbor mouth on Monday and he\'s been selling his diving gear ever since. All of it. He won\'t say what he saw.'],
    react: { returned: 'Bertil threw the helmet back where he found it. He says it stopped fogging the second it went under.', decor: 'That diving helmet is over the bar at the Anchor. It fogs up during trivia. Ruthie\'s added it to the questions.', listened: 'Bertil says you listened inside the helmet. He wants to know what it said. So do I.' } },
  hymnal: { by: 'ignatius', rumour: ['A hymnal from a house clearance has nine verses of "Eternal Father" where every other book has eight. The choir won\'t touch it.', 'I hummed the ninth verse once, by accident. The organ played along. The organ was off.'],
    react: { torn: 'The ninth verse is torn out and burned. The choir sings eight. I think the organ misses it.', locked: 'The hymnal is in the vestry safe. Sometimes, during the eighth verse, the safe hums.', sung: 'We sang all nine verses on Sunday. Every boat in the harbor rang its bell at the end. Nobody was on them.' } },
  slides: { by: 'hester', rumour: ['Ivo Lorimer has a box of magic-lantern slides from the 1911 Sunday-school picnic on Gannet. I counted the children in the photographs. I counted twice.'],
    react: { sold: 'The 1911 slides are in the Athenaeum. I\'ve stopped counting the children. I\'ve started counting the shadows.', smashed: 'Three of the slides were smashed. The picnic\'s one child short now. The right one, I hope.', turned: 'One slide is turned round in its box. Nobody turns it back, or says why.' } },
  longgame: { by: 'gus', rumour: ['Lemuel Grote played chess by postcard from stool nine at the Anchor for forty years. He never told me who with. He died in August.', 'The postcards haven\'t stopped. Ruthie, at the Anchor, says they come under the bar door, wet. Forty years I asked him for a game.'],
    react: { won: 'I won Lemuel\'s last game for him. Rook to h8. I read the final card out at the Anchor, and nobody knew what to do, so they clapped.', resigned: 'You resigned Lemuel\'s game. The postcards stopped. I said it was the decent thing. I\'d have played on.', playing: 'The cards still come, your move every time. Ruthie keeps stool nine empty. I sit on stool eight.' } },
  stormglass: { by: 'tess', rumour: ['I hear Hap Lorimer, out on the point, has a storm glass that\'s growing crystals into a coastline no chart has. I\'d like it on my shelf where I can watch it.'],
    react: { tess: 'The storm glass is on my shelf in the shack. It\'s still growing. Some mornings I check the charts against it.', sold: 'You sold the storm glass to a dealer. Good riddance. The weather\'s been ordinary since. I miss it.', watched: 'You watched the storm glass finish its coast. I hope you wrote it down. I didn\'t.' } },
  bottle: { by: 'otis', rumour: ['I hear Old Pell found a bottle on the breakwater addressed to the Crooked Scale. Odile\'s handwriting. Dated next year.', 'I deliver everything addressed to that shop. I did not deliver that. I\'d like it on the record.'],
    react: { thrown: 'You threw Odile\'s bottle back. Return to sender. I respect it.', sealed: 'The bottle\'s still sealed on your shelf. Undelivered. It\'s killing me.', opened: 'You opened Odile\'s bottle. I won\'t ask what it said. I\'ll ask Dot. Dot will know.' } },
  bingo: { by: 'bev', rumour: ['Dolores Fitch wins the roof-fund bingo every week. Every week. I run a bowling alley, I know odds. Those aren\'t odds.'],
    react: { exposed: 'Dolores Fitch is barred from bingo. She\'s taken up candlepin. God help us.', lady: 'Dolores won again. Lucky, they say. I\'m watching her bowl.', full: 'Bingo had a full house for the first time in years. Father Ignatius cried during B-12.' } },
  chowder: { by: 'bettany', rumour: ['Did you hear? Marisol, who does the chowder supper at the Grange, found a ring in the pot. Cooked right in with the clams. She swears it isn\'t hers.', 'Everybody in town has been in to ask if it\'s theirs. Nobody\'s lost a ring. Everybody wants one.'],
    react: { fifty: 'The Tibbets had their fifty years at the Grange. I did the cake. He cried into the frosting.', melted: 'That chowder ring got melted down, they say. I hope it was nobody\'s. It was somebody\'s.' } },
  cuckoo: { by: 'agathe', rumour: ['There\'s a cuckoo clock on Water Street that only goes off at the wrong time. Wrong in a pattern. Benji, my apprentice, says it\'s counting down.', 'Benji is nineteen. Everything is counting down when you\'re nineteen.'],
    react: { high: 'That cuckoo was a tide clock, in the end. It knew about the flood before the radio did.', wet: 'Water Street flooded. The cuckoo called it. Nobody listened to the cuckoo. They never do.' } },
  decoy: { by: 'hal', rumour: ['The Toomey grandsons were in buying padlocks. Separately. Each one asked if the other had been in.', 'It\'s over their grandfather\'s heron decoy. A wooden bird. Two padlocks.'],
    react: { real: 'The real Toomey heron is in the window of the Historical Society. The Toomeys visit on alternate days.', two: 'There are two Toomey herons now. One of them\'s lying. The Toomeys bought more padlocks.', show: 'The Toomey heron went to the decoy show. Sold to a man from Maine. The grandsons are speaking again, against him.' } },
  dog: { by: 'bettany', rumour: ['There\'s a three-legged dog that sleeps in your doorway. I see him at five, when I start the ovens. He gets a heel of bread.'],
    react: { home: 'That three-legged dog went home, they said. He still comes by at five for the bread. Old habits.', shopdog: 'You kept the dog! He sits in your doorway like he\'s on the payroll.', pound: 'The dog\'s at the pound in Plymouth. I drove over with bread. He remembered.' } },
  evidence: { by: 'dunphy', rumour: ['Something walked out of the evidence room. Captain Barrow\'s in a mood. I wasn\'t there. I was at lunch. I\'m always at lunch.'],
    react: { clean: 'The evidence room\'s back in order. I\'m on parking now. It\'s outdoors. It\'s fine.', recall: 'Nobody at the station can remember anything this week. Me included. Me especially.' } },
  fathom: { by: 'dot', rumour: ['I hear Hattie Tulley says your cat has dinner at hers every night. Walt Brann says he has breakfast at his. That cat is doing very well for himself.'],
    react: { three: 'Your cat has three homes and three names. Everybody\'s happy. Especially the cat.', one: 'Hattie Tulley stopped putting out sardines. She says she understands. She does not understand.' } },
  ferrybet: { by: 'nanFerreira', rumour: ['I\'ve bet the whole Anchor I can take the ferry to Gannet in fog without radar. Dead reckoning, like my grandfather.', 'Tess says she\'ll pull my licence. I said, after.'],
    react: { won: 'Dead reckoning. Fog like wool. I could smell Gannet before I saw it. Tess bought me a drink and called me an idiot. Both fair.', lost: 'The ferry\'s on the bar off Gannet. Nobody hurt. My licence is on Tess\'s desk and my pride\'s at the bottom of the harbor.' } },
  ghosttour: { by: 'orsolya', rumour: ['Felix Amory\'s ghost tour is all made up. Every word. In Fog Week, of all weeks. The dead do not like being made up.'],
    react: { true: 'Felix tells the true stories now. His tours are shorter. The dead seem pleased.', spooked: 'Felix Amory saw something on his own tour. He has taken up knitting.', box: 'Felix\'s tour sold out the whole week. The dead were not consulted.' } },
  highscore: { by: 'bev', rumour: ['Somebody beat the high score on Harbor Blaster at the arcade. First time since 1989. The man who held it is taking it very badly.'],
    react: { high: 'New name at the top of Harbor Blaster. The old champ came to Pinwheel to sulk. I let him.', over: 'The old score stands. The man who holds it bought a round for the whole arcade. Of quarters.' } },
  ned: { by: 'dot', rumour: ['I hear Ruthie Kroll, who does trivia at the Anchor, is retiring her ventriloquist act. Captain Ned, the dummy. Forty-one years. She says the dummy kept talking after she stopped.'],
    react: { encore: 'Ruthie and Captain Ned did an encore at the Anchor. She says it was the last one. It wasn\'t.', heckler: 'Somebody heckled Ruthie\'s farewell show. From inside her own dummy, it sounded like.', ohio: 'Captain Ned went to a man from Ohio. Ruthie says she can still hear him, faintly, from the west.' } },
  noreaster: { by: 'hal', rumour: ['Big storm coming. A proper nor\'easter, the radio says. I\'m out of D batteries and the week hasn\'t started.'],
    react: { caught: 'Lost power in the storm, I hear. Something walked off in the dark. Get a lantern. I sell lanterns.', lights: 'You kept the lights on through the storm. Half of Front Street came in to stand near you.' } },
  overdue: { by: 'hester', rumour: ['The Athenaeum is holding an amnesty day. No fines, no questions. Some of those books have been out since Eisenhower.'],
    react: { returned: 'One of the oldest overdue books in the county came home this week. I checked it in myself. I may have wept.', keepers: 'An Athenaeum book is still out there. I know where. I have a very long memory and a very short temper.' } },
  proposal: { by: 'ruthie', rumour: ['Did you hear about trivia night? A fella called Teddy proposed to Priya, in front of everybody, and she said no. He\'d put the ring in the answer envelope. I read it out. I\'ll never forgive myself.'],
    react: { yes: 'Priya said yes the second time. At trivia. I read it out again. Everybody stood up.', spelled: 'He got the ring engraved properly this time. F-O-R-E-V-E-R. Spelled right. She said that was all she wanted.', champions: 'Priya and Teddy are still together. On different trivia teams. They win alternate weeks.' } },
  queen: { by: 'bev', rumour: ['Gus Lindqvist, the chess hustler on the Green, took forty bucks off my brother-in-law. I offered him a lane. He said bowling has no endgame.'],
    react: { checkmate: 'Gus retired undefeated. He came to Pinwheel to gloat. I let him bowl one frame. He got a strike. Unbearable.', hustled: 'Gus got hustled by a man in boat shoes. Now he plays for nothing on Sundays, to remember.' } },
  scrimshaw: { by: 'hester', rumour: ['The Historical Society is doing appraisals this week. Every whale tooth in the county will be in a queue on Front Street.', 'Half of them were carved in 1840. The other half were carved in 1990 and dipped in tea.'],
    react: { old: 'The scrimshaw was real. 1840s. It\'s at the Historical Society now, in a case with a little card.', reported: 'That whale tooth was carved last year. Somebody reported it. The carver is very proud of being reported.', counter: 'A whale tooth changed hands under the counter, I hear. I won\'t ask whose counter.' } },
  seance: { by: 'orsolya', rumour: ['I am holding a séance for the Harrow widow. A real one. I need a few things from your shelves for the table. Dead men like their own things.'],
    react: { will: 'Clement Harrow\'s will turned up. In a box. Exactly where the dead man said. I am taking credit.', lid: 'You kept the lid shut on Harrow. Wise. Some dead men only want to argue.' } },
  snowglobe: { by: 'ignatius', rumour: ['We have a snow globe at Saint Brine\'s that knows the weather. Little Theo shakes it every morning and it\'s right. More often than the radio.'],
    react: { theos: 'Theo\'s snow globe is back on his windowsill. He says it\'s sunny tomorrow. I\'ve cancelled the umbrellas.', forecast: 'The snow globe went to a weatherman in Boston. Theo listens to him on the radio and corrects him.' } },
  vanishing: { by: 'ignatius', rumour: ['The Great Ambrose, the old stage magician, is doing a show for the children at lunch. He\'s ninety. His box is older. Pray for him, and for the box.'],
    react: { tada: 'Ambrose made Dulcie vanish and come back. The children want it done to the bishop.', nosuch: 'Ambrose told the children there\'s no such thing as magic. Then the box made Dulcie vanish anyway. I am still thinking about it.', box: 'The vanishing box is in your shop now? Keep the lid closed. We still don\'t know where Dulcie went for those four minutes.' } },
  veil: { by: 'dot', rumour: ['Carmen Ruiz booked my deck for a wedding. Small one. Her mother doesn\'t know. I\'m not going to be the one who tells her.'],
    react: { old: 'Carmen got married on my deck in her grandmother\'s veil. Her mother came. I cried into the coleslaw.', elope: 'Carmen eloped. Off my deck, into a dinghy. Her mother found out from the newspaper.', sold: 'Carmen\'s grandmother\'s veil got sold. Inés hasn\'t been in for lunch since.' } },
  weathervane: { by: 'marguerite', rumour: ['The copper whale weathervane is off the Town Hall roof for repairs. I sat through two meetings about the whale. There will be a third.'],
    react: { back: 'The whale is back on the roof. The third meeting has been cancelled. I will remember this as a good week.', whaling: 'Our 1888 whale is gone. There will be a meeting. There will be many meetings.', turnedIn: 'Someone turned in the whale. The roofer is very sorry. He has said so at three meetings.' } },
  nightferry: { by: 'tess', rumour: ['The island ferry\'s engine was warm at six this morning. It doesn\'t run till seven. Second time this week.', 'Nothing in the log. I like a boat that writes things down.'],
    react: { exposed: 'Two in the morning on my slip, and the ferry stayed tied up. First time in a year. I slept like a baby. A baby with binoculars.', cut: 'The night boat\'s still running. I see a light in your back room some nights. I see a lot of lights.', returned: 'Parcels going out of the post office every Tuesday, no return address. The postmistress asked me if it was legal. I said I hadn\'t heard.', ashore: 'The two o\'clock boat stopped by itself. Boats don\'t stop by themselves. Somebody got nervous.' } },
  halfmap: { by: 'hal', rumour: ['Sold a shovel to a man from Connecticut this morning. Sold a shovel to a woman from Maine this afternoon. Both asked where the sandbar is. Neither knows about the other.'],
    react: { split: 'The shovel people came back together and bought a bottle opener. Rusty one. Seemed happy with it.', sold: 'The man from Connecticut came back and returned his shovel. Said he had no use for it now. Said it sadly.', early: 'Somebody dug a hole on the sandbar at dusk and filled it in badly. I sell a very good rake, for next time.' } },
  lure: { by: 'dory', rumour: ['Derby weigh-in\'s on my scale again this year. Remy Sauvé\'s won three years running on that wooden plug of his. Everybody wants it. He wants diesel.'],
    react: { owner: 'Four in a row for Remy. He carved the notch on my scale counter. I\'ve left it.', kid: 'The Peake girl won the derby! Hand line, wooden plug, a fish as long as she is. She\'s on my wall now, next to the lobster.', sold: 'The man from Connecticut caught a shopping cart on Remy\'s lure. Remy won on a spoon. I laughed so hard I dropped a halibut.' } },
  bigcoat: { by: 'bettany', rumour: ['There\'s a very big man who comes past the bakery at five, when the ovens go on. He never comes in. He just stands in the warm a bit. The kids say he lives in the fort.'],
    react: { tailor: 'Torvald measured me for a coat on my own steps. Very gently. Like I was a loaf. It\'s the best coat I\'ve ever had.', gone: 'Nobody stands in the warm at five any more. I leave a roll on the step anyway. It\'s gone by six. Gulls, probably.', hunted: 'They went up the fort with flashlights and found nobody. I hope nobody stays found.' } },
  widow: { by: 'tess', rumour: ['There\'s a light on the Clegg widow\'s walk up on Cliff Road every night. Has been since the Merrow went down off the Neck in \'79.', 'I\'ve seen Honora Clegg on the pier. She looks thirty. She was thirty in 1979.'],
    react: { home: 'The Clegg light\'s out on Cliff Road. Last gale, my night man swears a dragger came in past the breakwater with no engine and no hull. Nothing in the log. I\'ve left it out.', letgo: 'Honora Clegg came by the shack to ask about tide tables. For gardening. She\'s gone gray, and she looks happier than I\'ve ever seen anyone look.', hand: 'The Gilded Hand\'s got the Clegg house. Nobody saw Honora leave. Her dinghy\'s still on the rack.' } },
  longcon: { by: 'hester', rumour: ['There\'s an estate sale on Cliff Road. "Great-aunt Lavinia\'s collection". I have read every probate record in this county since 1712. There is no Lavinia.'],
    react: { conned: 'Those people on Cliff Road sold somebody a sword and left on the Tuesday ferry. If it was you, I\'m not going to say anything. I\'m going to look at you.', cut: 'The Cliff Road lot went to Boston. With a local expert\'s blessing, I hear. I keep a list, you know. Of local experts.', turned: 'The Boston dealer walked out of the Grange in four minutes, I hear. Somebody had salted their fakes with worse fakes. I would like to shake that person\'s hand. Gloved.', caught: 'Captain Barrow arrested two people at the Grange for forging the past. I sent her a card. I have never sent a policewoman a card.' } },
  seacaptain: { by: 'hester', rumour: ['Lucinda Thrale and Bertram Quayle are at war over a portrait. He says her ancestor was a vestryman. She says pirate. I have the records. I\'m staying out of it with great pleasure.'],
    react: { society: 'Captain Thrale hangs in the Historical Society now, as a merchant master. Lucinda stands in front of him on Saturdays and tells visitors otherwise.', family: 'Captain Thrale is over Lucinda\'s mantelpiece, facing the door. Bertram has stopped speaking to her. They were never speaking much.', privateer: 'A letter of marque! Behind the lining! I have been in that Society a thousand times. I may never forgive myself, or whoever found it.' } },
  actuary: { by: 'ruthie', rumour: ['There\'s a man at the end of my bar, Emmett, retired from insurance. Tells everyone their odds. He told the darts team they had a twelve percent chance of making it home. Two of them didn\'t.', 'He keeps writing things down with a fancy pen and then putting it away very quick.'],
    react: { returned: 'Emmett has his pen back. He keeps it buttoned up inside his jacket like it might bite. Still drinks the one half. Still the same half.', redeemed: 'Emmett Ardley is on my trivia team! He knows every life expectancy since 1850. We came second. He laughed!', kept: 'Emmett says you\'ve got his pen. He says good luck. He says it the way other people say sorry.' } },
  rival: { by: 'gordie', rumour: ['Somebody leased the old shoe repair across from your place. Exposed brick. Bulbs on long wires. Thirty-dollar candles. I know the type. I sell them hatchbacks.', 'Paid the first year up front, I hear. Somebody lent her that money, and it wasn\'t a bank.'],
    react: { crushed: 'Reclaimed & Co. is closing. I went to the sale. Bought a candle. It smells like a man who lost a bet.', merged: 'You and the candle lady, under one roof. Smart. Never compete with somebody you can hire.', overflow: 'Two shops on Main Street and both still open. Somebody\'s sending somebody business. I can always tell.' } },
  lights: { by: 'hal', rumour: ['A fella from Light and Power bought every string of Christmas lights in my store. In October. Cash. Sunglasses.', 'I asked him what for. He said "a project". Last man who said "a project" to me built a pergola. In February.'],
    react: { bubbles: 'He lit up the whole Green for a girl and she said yes. I\'m already out of lights for the wedding.', mary: 'WILL YOU MARY ME. Ten feet tall on the Green. I had an R in the back. Nobody asked.' } },
  schoolbell: { by: 'ignatius', rumour: ['Our school bell was taken from the belfry in 1971. Somebody confesses to it every Lent, in a disguised voice. The same disguised voice.', 'I would like the bell back. I would also like, just once, to hear a different sin.'],
    react: { rung: 'The bell is home. Clifford Ames rang it himself, in front of the children. I absolved him for the last time, I hope.', quiet: 'Lent came and the voice confessed again. The bell, I\'m told, is somewhere warm and quiet. So is the voice.', sold: 'Our bell went to a stranger, I hear. Somewhere there is a very old, very Catholic dinner gong.' } },
  teeth: { by: 'marguerite', rumour: ['Mabel Plover has asked the Select Board for her husband\'s teeth at every meeting since June. Public comment. Every time. The board does not have the teeth.', 'I\'ve started timing her. Four minutes, very dignified, and then the culvert.'],
    react: { returned: 'We voted five to nothing to bury Harlan Plover\'s teeth with him. I\'ve chaired that board eleven years and I\'ve never had five to nothing.', museum: 'Harlan Plover\'s teeth are in a museum in a garage. Mabel visits on Saturdays. She says they look well.', spare: 'Mabel Plover still comes to public comment. Somebody, somewhere, has her husband\'s teeth. I don\'t want to know whose mouth.' } },
  bowlingball: { by: 'bev', rumour: ['There\'s a ball on lane four that rattles. Like a maraca. Arlo Lund won\'t let anybody look inside. It was his father\'s.', 'His father was league treasurer in 1979. That\'s all I\'ll say. This town has long memories and short averages.'],
    react: { league: 'We found the 1979 fund. In a locker. Gunnar Lund was honest the whole time, and the trophy\'s got his name on it now. I cried on lane six.', split: 'Somebody took a finder\'s fee off the 1979 league fund. The league has opinions. The league always has opinions.', rattle: 'That ball still rattles, somewhere. I hope whoever has it keeps it off my lanes.' } },
  // batch K: the boardwalk and after hours
  flash: { by: 'ruthie', rumour: ['There\'s a tattooist from New Bedford asking every bar on the harbor about her grandfather. Sailor Mack. He had a shop on Pier Nine in the fifties.', 'I sent her your way. Don\'t ask me why. Old Augie Pereira went quiet when she said the name, that\'s all.'],
    react: { homeport: 'Jolene Kask set up in my back booth and tattooed a swallow on Augie Pereira. Whole bar went quiet for the buzzing. He\'s shown it to everybody twice.', sold: 'Sailor Mack\'s flash went back to New Bedford, I hear. Augie still rolls his sleeve down when anyone asks.', framed: 'Somebody framed Sailor Mack\'s flash and sold it to Boston. Augie says Mack would have hated that. Mack hated most things.' } },
  answering: { by: 'dot', rumour: ['Norbert Fisk from the flea market was at my window bragging. Bought a storage unit the Gilded Hand auctioned off. Says half of it came from your shop.', 'Odile\'s things, he means. He wouldn\'t say which. He wanted me to guess. I don\'t guess, I know.'],
    react: { saved: 'You kept something of Odile\'s away from the Hand, I hear. Good. She\'d have done the same for you.', erased: 'Merrit Gaunt was seen putting a machine in the bin on Water Street. Nobody puts a thing in a bin like that unless it matters.' } },
  thirtyyears: { by: 'hester', rumour: ['I\'ve been reading the Crooked Scale\'s old pawn ledgers for the town history. Odile lent them to me. One entry keeps coming back.', 'Every thirty years. The same chest, the same name, the same thirty dollars. 1936, 1966, 1996. You can do the arithmetic.'],
    react: { lodger: 'Your cellar is the driest on the harbor now, I\'d guess. The 1966 ledger says the same. I\'ve made a note for 2056.', sea: 'You sent the chest back to sea. A fisherman saw it off Gannet, heading east. I\'ve added that to the file.', sold: 'You sold the chest on. Somebody in town has a very dry cellar and no idea why. I\'ll find out who. I always do.' } },
  camcorder: { by: 'vera', rumour: ['The Gazette got a press release from a cable show called Haunted Harbors. They\'re filming a ghost hunt at Neptune\'s Arcade, at night, with lights and a man who whispers.', 'I\'m going for the paper. I\'ll take my camera. I\'ll take a thermos. I don\'t expect to need the camera.'],
    react: { aired: 'Your tape\'s on television. I watched it twice. There\'s a man inside the arcade straightening the prize counter, and I can\'t make him out, and I\'ve been a photographer for forty years.', kept: 'You kept the arcade tape. The network rang the Gazette asking where it went. I said I\'d never heard of it. I find that\'s often true.', taped: 'You taped over it. In front of him, I hear. I\'d have liked one look. Just one. Then I\'d have done the same.' } },
  rufus: { by: 'bettany', rumour: ['There\'s a man who comes past the bakery at five every morning and sniffs the air at my back door. Very politely.', 'Hal\'s new stock boy, Rufus. Lovely lad. He likes the heels of the loaves best.'],
    react: { good: 'There\'s a big shaggy dog asleep across Hal\'s doorway now. He comes by at five for the heel of the loaf. Same as before, really.', man: 'Rufus is full-time at Hal\'s. He still comes by at five and sniffs. Every full moon he doesn\'t.', pack: 'The Pack has a real dog now. He doesn\'t know what any of it means. He likes the donuts. So do I, honestly.' } },
  // batch J: the spider and the marsh
  cabinet: { by: 'hugo', rumour: ['The new doctor, Dr. Ladd, sold off a Victorian cabinet of insects from old Dr. Pryne\'s cellar. One drawer\'s empty. Cracked glass.', 'And people have started saying his flu shots make them faint. They don\'t. I\'ve sold flu shots for thirty years. I\'d like that on record.'],
    react: { gassed: 'Saint Brine\'s smells of sulphur, and the sopranos have stopped fainting. People are taking their flu shots again. I would like that on record too.', sold: 'The cabinet\'s gone to Providence, I hear, and the bites stopped the same week. Dr. Ladd\'s waiting room is full again. Nobody\'s apologized to him. I have.', cleared: 'Dr. Ladd keeps something under glass in his waiting room now. People come in for flu shots just to look at her. Best vaccination rate in the county.' } },
  prisms: { by: 'tess', rumour: ['The Coast Guard are selling the old Gull Point lens frame. Five prisms short, since 1994.', 'Eben Hatch kept that light thirty years. Everybody knew where the prisms went. Nobody said.'],
    react: { lamp: 'Gull Point is blue again. I stood on the end of the pier last night like a kid.', society: 'The Gull Point prisms are in a case at the Historical Society. Better than a sock in a drawer.', window: 'Your window throws the old Gull Point blue across Water Street. Boats coming in think it\'s the point. Turn it down a bit.' } },
  urn: { by: 'lupe', rumour: ['Two funerals on the same day at Saint Brine\'s, side by side. Walter Mayo and Dorothy Ashworth. The families haven\'t spoken since a fence in 1979.', 'Both families ordered lilies. Each one asked how many the other ordered. I\'m doing the arrangements an hour apart, and I\'m not answering the phone.'],
    react: { swap: 'Walter and Dorothy are each where they should be, I hear. The lilies matched in the end. Somebody saw to it, and it wasn\'t me.', told: 'The Mayos and the Ashworths had lunch together, after! I sent a centerpiece. They argued about it. Then they split it.', silent: 'It was a lovely double interment. Father Ignatius won\'t say a word about it. Neither will I. I\'ve been told not to look at the stones too closely.' } },
  honey: { by: 'bettany', rumour: ['I baked with Philippa Gage\'s marsh honey once and took the same tray out of the oven twice.', 'Seven hives on the marsh bank, always seven. Keep your wits if she offers you the comb.'],
    react: { real: 'You kept your wits with the Gage honey. I could tell. You only came in once this morning.', loop: 'You came in twice yesterday and asked me the same thing. Gage honey? I knew it.', jar: 'Thank you for the honey. Sundays only, and only for the people I like.' } },
  // stay-on majors (round 2, batches Q and R): only drawn from month 2 on
  odilewent: { by: 'tess', rumour: ['The Coast Guard went over Gull Point last week, now the fuss is done. Something was lit up in the lantern room. Blue.', 'Nothing in it to burn. I watched that blue from my window every night Odile was gone, and she says she never lit a thing.'],
    react: { dark: 'Gull Point\'s all the way dark now. First time in thirty years I\'ve not looked for it at night. I miss it, and I\'m glad.', keeper: 'There\'s a blue light on the point Fridays now. Odile says it\'s her. I logged it anyway, like Ansgar did.', lit: 'Gull Point light is on the charts again. I wrote to the Coast Guard. I didn\'t ask. Odile says Ansgar would have liked that.' },
    sway: { lit: { tess: 3, hester: 1 }, keeper: { tess: 1 }, dark: { orsolya: -1 } } },
  postcards: { by: 'otis', rumour: ['There\'s a fat envelope in my bag for you, from Port Esther, Maine. Domestic stamp. Postage due. I\'d know that handwriting anywhere.', 'I\'m not to say what\'s in it. I don\'t know what\'s in it. It feels like a ticket.'],
    react: { found: 'I saw Odile off the last boat. I\'ve delivered a lot of things to that shop. Never the best one before.', letters: 'Another card for you, care of the post office. I read it. I always read them. "Soon," it says. I believe her.', tickets: 'No more postcards for you. I check the dead-letter room every morning anyway.' },
    sway: { found: { otis: 3, tess: 1 }, letters: { otis: 1 }, tickets: { otis: -4, tess: -2 } } },
  saltire: { by: 'gordie', rumour: ['A lady from Saltire Capital in Boston bought me lunch. She asked about every lease on Main Street, and she paid in cash. Who pays cash for a lobster roll?', 'I hear Lionel Shattuck\'s payments doubled. I hear yours have too. I\'m a car dealer; I can hear a squeeze from Route 1.'],
    react: { signed: 'You signed with Saltire. I\'d have signed too, so I can\'t say anything. I\'m saying it anyway: that was Main Street.', stood: 'You stood up at the hearing. Tabled! I sold a minivan on the strength of that speech.', exposed: 'Fourteen companies at one address! Saltire\'s in receivership. I\'d put that on a billboard if I had one free.' },
    sway: { signed: { gordie: -2, hal: -3, marguerite: -2 }, stood: { gordie: 1, hal: 2 }, exposed: { gordie: 2, hal: 2, marguerite: 3 } } },
  collector: { by: 'rhoda', rumour: ['I\'ve opened one room at the Harborview in the off-season. A gentleman from Boston, Mr. Fairbairn. Cash, a week ahead, room six, the one at the back. Good coat.', 'He\'s looking for a painting by a woman called Vail. He asked me if I had any in the rooms. Hon, I have seascapes from a gas station.'],
    react: { exposed: 'Captain Barrow took my room-six gentleman away from Dot\'s in the back of her car, with a stack of wet paintings. He\'d paid to Sunday. I\'m keeping it.', cheque: 'Mr. Fairbairn paid you six hundred dollars in front of Dot, I hear, and checked out the same night. He left the towels. He took the soap. They always take the soap.', stung: 'Nice picture behind your counter, hon. I found two more just like it under the bed in room six.', passed: 'Gordie\'s still got his Vail in the showroom. My room-six gentleman left without saying goodbye. He left a forwarding address in Boston. It\'s a parking garage.' },
    sway: { exposed: { dot: 2, rhoda: 1 }, cheque: { rhoda: 2, dot: 1 }, stung: { dot: 1 }, passed: { gordie: -1 } } },
};

// one line for each regular the first time you meet them in a run
// ---------------------------------------------------------------- the twenty regulars
// thread: three async steps (actor, state) -> they set t.f flags and, on the last step, t.end.
// endings: what the Storybook calls each end. epilogue: the line on the ending screen.

// helpers for thread steps
function townItem(o) { const it = oddItem(o); it.cat = o.cat || 'curio'; return it; }
async function townBuy(a, it, price, yes, no) {
  view.counterIcon = it.icon;
  const i = await choose([{ label: `Buy the ${it.name.toLowerCase()} for ${money(price)}`, hint: `(guide ${money(it.guide)})`, disabled: S.coin < price || !shelfFree() }, no || 'Not today']);
  view.counterIcon = null;
  if (i !== 0) return false;
  it.paid = price; S.stock.push(it); S.stats.bought++;
  change('coin', -price, yes || `Bought a ${it.name.toLowerCase()}`);
  renderPanel();
  return true;
}
async function townGive(a, amounts, why) {
  const opts = amounts.map(n => ({ label: `Give ${money(n)}`, disabled: S.coin < n }));
  const i = await choose([...opts, 'Not this time']);
  if (i >= amounts.length) return 0;
  change('coin', -amounts[i], why);
  return amounts[i];
}
function townTakeFromStock(filter) { return forSale().filter(it => !it.questKey && !it.uniqueId && filter(it)); }

// a sore regular's one mending response (STANDING.md, rule 6): it costs pride, money or an item.
// o: { say, label, cost (dollars, optional), yes, no }. Returns mend(a, t) for addRegular.
function townMend(o) {
  return async a => {
    await say(a, o.say);
    const cost = o.cost || 0;
    const i = await choose([{ label: cost ? `${o.label} (${money(cost)})` : o.label, disabled: S.coin < cost }, o.refuse || 'Say nothing']);
    if (i !== 0) { if (o.no) await say(a, o.no); return false; }
    if (cost) change('coin', -cost, o.why || o.label.replace(/"/g, ''));
    await say(a, o.yes);
    return true;
  };
}

addRegular('tess', {
  name: 'Tess Bascombe', place: 'the harbormaster\'s shack', topic: 'the water: boats, fog, the fleet, the island',
  look: { skin: '#c89070', hair: '#9a9a9a', hs: 1, coat: '#e8b020', trim: '#2a3a5a', style: 'jacket', hat: 'beanie', hatc: '#2a3a5a', pants: '#2a3a4a' },
  meet: 'Tess Bascombe, harbormaster. I\'ve run the harbor for nineteen years. Odile used to bring me coffee when the fog was in.',
  chat: ['Two scallopers left in the whole fleet. Pell\'s is one of them. Look after him.', 'The ferry\'s late. The ferry\'s always late. I\'ve stopped writing it down.', 'If you ever want to know what\'s in the harbor, ask me. If you want to know what\'s under it, ask Dory.'],
  // Tess likes it straight and can't stand an angle
  small: [
    { say: 'Two scallopers left in the whole fleet. Pell\'s is one of them.', opts: [
      { label: '"What happened to the rest?"', tone: 'straight', reply: 'Sold to the big outfits in New Bedford, sold for scrap, or sunk. In about that order.' },
      { label: '"Is he all right?"', tone: 'kind', reply: 'He\'s seventy-four and he still goes out alone. So no. But he\'s happy.' },
      { label: '"Fewer boats, fewer sellers."', tone: 'sharp', reply: 'Spoken like a shopkeeper.' }] },
    { say: 'The ferry\'s late. The ferry\'s always late. I\'ve stopped writing it down.', opts: [
      { label: '"Write it down when it\'s early."', tone: 'wry', reply: 'That\'d be a very short book.' },
      { label: '"Whose fault is it?"', tone: 'straight', reply: 'The tide\'s, says Nan Ferreira. Nan\'s never late. The ferry is. She takes it personally.' },
      { label: '"Could it run late on purpose? For a price?"', tone: 'sly', reply: 'No. And I\'ll forget you asked.' }] },
    { say: 'Fog tonight. The horn on Gannet Rock goes every thirty seconds. You\'ll stop hearing it by Tuesday.', opts: [
      { label: '"Do you still hear it?"', tone: 'straight', reply: 'Every one. Nineteen years. I count them when I can\'t sleep.' },
      { label: '"I like it. It\'s company."', tone: 'kind', reply: 'Odile said that. Then she bought earplugs.' },
      { label: '"Can\'t they switch it off?"', tone: 'sharp', reply: 'Not while there\'s a boat out. There\'s always a boat out.' }] },
    { say: 'Somebody tied up at the town float overnight and didn\'t pay. I\'ve got the name off his transom.', opts: [
      { label: '"What will you do?"', tone: 'straight', reply: 'Send him a bill. Then a ruder bill. Then I\'ll let the air out of his dinghy.' },
      { label: '"Let him off. It\'s been a hard year."', tone: 'kind', reply: 'It\'s been a hard year for the float too.' },
      { label: '"What\'s it worth to keep his name quiet?"', tone: 'sly', reply: 'Nothing. I\'m telling everyone. Starting with you.' }] },
    { say: 'Ask me what\'s in the harbor. Go on. I\'ve waited years for somebody to.', opts: [
      { label: '"All right. What\'s in the harbor?"', tone: 'straight', reply: 'Four hundred moorings, two scallopers, one sunk dragger and a shopping cart nobody can explain.' },
      { label: '"What\'s under it?"', tone: 'wry', reply: 'Ask Dory. She\'ll tell you, and then you won\'t sleep.' },
      { label: '"Not today, Tess."', tone: 'sharp', reply: 'Nobody ever asks.' }] }
  ],
  reckon: {
    up: { say: 'I heard how {quest} went. That was good for the water. I wanted to say so.', opts: [
      { label: '"It was the right thing to do."', tone: 'straight', reply: 'It was. Don\'t make a habit of telling me so.' },
      { label: '"I\'m glad, Tess."', tone: 'kind', reply: 'So am I. There. We\'re both glad. Don\'t tell anyone.' },
      { label: '"It paid well, too."', tone: 'sly', reply: 'Course it did. Never mind.' }] },
    down: { say: 'I heard about {quest}. I heard what you did. I\'d rather hear it from you.', opts: [
      { label: '"I got it wrong, Tess. I know."', tone: 'straight', reply: 'Well. You said it plain. That\'s something.' },
      { label: '"There was money in it."', tone: 'sly', reply: 'There\'s money in a lot of things. Wrecking, for one.' },
      { label: '"It\'s none of the harbor\'s business."', tone: 'sharp', reply: 'Everything that floats is the harbor\'s business. Good day.' }] }
  },
  mend: townMend({ say: 'Tess stops in the doorway and doesn\'t come any further in.', label: '"I was wrong, Tess. Your coffee\'s on me this month."', cost: 10, why: 'Paid for Tess\'s coffee, by way of sorry',
    yes: 'Black. No sugar. Fine. We\'re square. Nearly.', no: 'Right. I\'ll be at the shack.' }),
  title: 'The Ice Plant', endings: { running: 'The Plant Runs', halfway: 'One Compressor Short', shut: 'Landed in New Bedford' },
  steps: [
    async (a, t) => {
      await say(a, 'The co-op ice plant on Pier Nine has been dead since March. No ice, no landing. The last two boats sell their catch in New Bedford now.');
      const i = await respond(a, 'tess', [
        { label: '"What happened to it?"', tone: 'straight' },
        { label: '"Is the fleet going to be all right?"', tone: 'kind' },
        { label: '"What\'s the co-op paying for help?"', tone: 'sly', save: 'angle' }
      ]);
      await say(a, ['The compressor seized in March. The co-op voted to fix it in April. They\'re still voting.', 'Not without ice. Fish don\'t keep, and people don\'t wait.', 'Nothing. That\'s what help costs, round here.'][i]);
      await say(a, 'So I\'m selling things to fix it. This barometer\'s hung in the shack since 1958. The town will never notice. I will.');
      t.f.barometer = await townBuy(a, townItem({ name: 'Harbormaster\'s barometer', icon: 'compass', cat: 'curio', guide: 80, condLabel: 'Fine', clue: 'Brass, 1958. "HOLLOW NECK HARBOR" engraved round the dial. Still says "change".' }), 45, 'Bought Tess\'s barometer');
      await say(a, t.f.barometer ? 'Good. Put it where the light hits it. It likes to be looked at.' : 'Fair enough. It\'ll go to the antique man in Plymouth. He calls me "dear".');
    },
    async (a, t) => {
      await say(a, 'The compressor\'s ordered. The man wants the rest in cash before he\'ll put it on a truck. I\'m short.');
      const i = await respond(a, 'tess', [
        { label: '"How short?"', tone: 'straight' },
        { label: '"Why aren\'t the boats paying for it?"', tone: 'sharp' },
        { label: '"And if I help, what do I get out of it?"', tone: 'sly', save: 'angle' }
      ]);
      await say(a, ['Eighty-five dollars. I\'ve got twenty-five of it in the coffee tin.', 'They are. Pell gave me a hundred dollars in ones and a halibut. The halibut didn\'t help.', 'Scallops. And my good opinion, which is worth less than scallops.'][i]);
      const n = await townGive(a, [60, 25], 'Chipped in for the co-op ice plant');
      t.f.gave = n;
      await say(a, n >= 60 ? 'That\'s the rest of it. You\'ll get it back in scallops, and you\'ll be sick of scallops.' : n ? 'That gets us closer. Pell\'s putting in what he can. Which is fish.' : 'No, I know. Everybody\'s got a Hand on their shoulder this year.');
    },
    async (a, t) => {
      const score = (t.f.barometer ? 1 : 0) + (t.f.gave >= 60 ? 2 : t.f.gave ? 1 : 0);
      if (score >= 2) {
        t.end = 'running';
        await say(a, 'Listen. Hear that? No. You can\'t hear it from here. The ice plant\'s running. Two boats landed at Pier Nine this morning.');
        if (t.f.gave) { change('coin', t.f.gave + 20, 'Tess paid back the ice plant money, with interest'); await say(a, said('tess', 'angle') ? 'You asked what you\'d get out of it. Your money back, and a bit. And scallops every Friday. I did warn you.' : 'Your money back, and a bit. And a bag of scallops on your step every Friday. Don\'t argue.'); }
        change('rep', 6);
        await say(a, 'The co-op wants a brass plate on the compressor. A name. I said I\'d ask you.');
        const p = await respond(a, 'tess', [
          { label: '"Put Pell\'s name on it."', tone: 'kind', save: 'plate', value: 'pell' },
          { label: '"Put the shop on it. It\'s good advertising."', tone: 'straight', save: 'plate', value: 'shop' },
          { label: '"Leave it blank. Nobody reads plates."', tone: 'wry', save: 'plate', value: 'blank' }
        ]);
        await say(a, ['He\'ll hate that. Done.', 'Honest, at least. "THE CROOKED SCALE". The only straight thing on the pier.', 'I read plates. It\'s half the job. Blank, then.'][p]);
      } else if (score === 1) {
        t.end = 'halfway';
        await say(a, 'We got one compressor going. Half the ice. The boats land here on good days. It\'s a start.');
        change('rep', 2);
        const p = await respond(a, 'tess', [
          { label: '"What would it take to get the second one going?"', tone: 'straight' },
          { label: '"Half\'s better than none, Tess."', tone: 'kind' },
          { label: '"Is that the best the co-op could do?"', tone: 'sharp' }
        ]);
        await say(a, ['A good winter and a bad memory. Same as everything.', 'It is. I keep telling Pell that. He keeps telling me half a fish isn\'t a fish.', 'It\'s the best anybody did. Including you.'][p]);
      } else {
        t.end = 'shut';
        await say(a, 'The ice plant\'s done. The boats will land in New Bedford for good now. Not your fault. I just wanted to tell somebody.');
        const p = await respond(a, 'tess', [
          { label: '"I\'m sorry, Tess."', tone: 'kind' },
          { label: '"Could anything have saved it?"', tone: 'straight' },
          { label: '"The chain on Route 1 will buy their fish anyway."', tone: 'sly' }
        ]);
        await say(a, ['So am I. Thanks for listening. Odile used to listen. You\'re about as good at it.', 'Eighty-five dollars, in March. Anything at all, in March.', 'They will. At half the price. Good day.'][p]);
      }
    }
  ],
  epilogue: { running: 'The co-op ice plant hums on Pier Nine. Tess Bascombe leaves scallops on your step every Friday.', halfway: 'Half the fleet lands at Hollow Neck. Tess says half is a number you can work with.', shut: 'The last scallopers land in New Bedford now. Tess still keeps the ice plant keys on her belt.' }
});

addRegular('ignatius', {
  name: 'Father Ignatius', place: 'Saint Brine\'s', topic: 'Saint Brine\'s, the children, the raffle and the bingo',
  look: { skin: '#e8c0a0', hair: '#e8e8e8', hs: 1, coat: '#22222a', style: 'suit', trim: '#f0f0f0', pants: '#22222a', glasses: '#3a3a3a', stout: true },
  meet: 'Father Ignatius Wole, Saint Brine\'s. Speak into the left ear. The right one retired in 1990.',
  chat: ['The children have started a raffle for the roof. First prize is a roof.', 'Sister Amabel runs Saint Brine\'s. I just bless things and lose at bingo.', 'Odile gave us a piano once. Nobody plays it. Everybody leans on it.'],
  // Father Ignatius likes kindness and a joke, and winces at a sharp answer
  small: [
    { say: 'The children have started a raffle for the roof. First prize is a roof.', opts: [
      { label: '"What\'s second prize?"', tone: 'wry', reply: 'A smaller roof. Over the shed.' },
      { label: '"Put me down for a ticket."', tone: 'kind', reply: 'Bless you. The ticket\'s a dollar. The blessing\'s free.' },
      { label: '"Roofs cost a fortune."', tone: 'sharp', reply: 'So the roof keeps telling me.' }] },
    { say: 'Sister Amabel runs Saint Brine\'s. I just bless things and lose at bingo.', opts: [
      { label: '"Bless the till while you\'re here."', tone: 'wry', reply: 'He makes a small cross at your till. "That\'s for the till. The rest of you can come on Sunday."' },
      { label: '"You must do more than that."', tone: 'kind', reply: 'I also lose at whist. And I sit with people. That\'s most of it, really. Sitting.' },
      { label: '"Nice work if you can get it."', tone: 'sharp', reply: 'It is. The hours are terrible.' }] },
    { say: 'Odile gave us a piano once. Nobody plays it. Everybody leans on it.', opts: [
      { label: '"Did she play?"', tone: 'straight', reply: 'Like a woman wrestling a bear. She won most days.' },
      { label: '"Leaning\'s a kind of music."', tone: 'wry', reply: 'That\'s very good. I\'ll use it in a sermon and say it was mine.' },
      { label: '"Sell it."', tone: 'sharp', reply: 'To whom? It weighs as much as the bishop.' }] },
    { say: 'Somebody leaves a pound of coffee on the rectory step every week. No note. I\'ve prayed about it. I\'ve also checked the doorbell camera.', opts: [
      { label: '"Maybe it\'s a thank-you."', tone: 'kind', reply: 'Maybe. I\'ve decided to say thank you back, every week, to nobody. It\'s good practice.' },
      { label: '"Maybe it\'s an angel."', tone: 'wry', reply: 'Angels drink tea, I\'m almost certain.' },
      { label: '"If it\'s free, why ask?"', tone: 'sharp', reply: 'Because somebody\'s giving, and they deserve a face. Even a blurry one.' }] },
    { say: 'I heard the Grange Hall bingo has a loaded cage. I don\'t believe it. I believe it a little.', opts: [
      { label: '"Want me to come and watch it?"', tone: 'kind', reply: 'Would you? Thursdays. Sit near the front and look suspicious. You have the face for it. That was a compliment.' },
      { label: '"Or you\'re just bad at bingo."', tone: 'wry', reply: 'That is also what Sister Amabel says. I don\'t believe her either.' },
      { label: '"Then stop playing."', tone: 'sharp', reply: 'And give up hope? In my line of work?' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I said a prayer of thanks for you. A short one. I didn\'t know your middle name.', opts: [
      { label: '"Thank you, Father."', tone: 'kind', reply: 'Thank you. That\'s how it goes, you see. Round and round.' },
      { label: '"Make the next one longer."', tone: 'wry', reply: 'I\'ll add a bit about the roof. It\'s relevant to everybody.' },
      { label: '"Prayers don\'t pay the bills."', tone: 'sharp', reply: 'No. Nor do bills, as it turns out.' }] },
    down: { say: 'I heard about {quest}. I\'m not angry. I\'m a priest. I\'m disappointed, which is worse, and I\'ve had more practice.', opts: [
      { label: '"I\'m sorry, Father. I got it wrong."', tone: 'kind', reply: 'There. That\'s the whole of it, really. The rest is just paperwork.' },
      { label: '"Are you allowed to be disappointed?"', tone: 'wry', reply: 'Professionally, yes. It\'s in the contract. Very small print.' },
      { label: '"It was business."', tone: 'sharp', reply: 'So was the boiler, in 1974. I\'ll see myself out.' }] }
  },
  mend: townMend({ say: 'Father Ignatius stops by the door, turning his hat round in his hands. He\'s waiting for something.', label: 'Put ten dollars in the roof tin and say sorry', cost: 10, why: 'Put money in Saint Brine\'s roof tin',
    yes: 'Accepted. All of it. The roof thanks you, and so do I.', no: 'Another day, then. I have a great many days. Most of them are Tuesday.' }),
  title: 'The Processional Cross', endings: { home: 'Carried Home', kept: 'In the Window', gone: 'Gone to Boston' },
  steps: [
    async (a, t) => {
      await say(a, 'In 1974 my predecessor sold our processional cross to pay for a boiler. Silver, with a fish on the boss. The boiler died in 1981. The cross, I hope, did not.');
      await say(a, 'The bishop visits at the end of the month. I would like very much to carry it in front of him. If anything with a silver fish on it comes across your counter...');
      let i = await respond(a, 'ignatius', [
        { label: '"I\'ll keep an eye out, Father."', tone: 'kind', save: 'promised' },
        { label: '"What would it be worth to you?"', tone: 'sly' },
        { label: '"A fish? On a cross?"', tone: 'wry' }
      ]);
      if (i === 2) {
        await say(a, 'The first Christians drew fish in the sand. Our parish chose a cod. It\'s a fishing town. We do our best.');
        i = await respond(a, 'ignatius', [
          { label: '"Then I\'ll look out for a cod."', tone: 'wry', save: 'promised' },
          { label: '"Crosses aren\'t really my line."', tone: 'sharp' }
        ]) === 0 ? 0 : 3;
      }
      t.f.promised = !!said('ignatius', 'promised');
      await say(a, ['Bless you. That\'s free, by the way. The blessing.', 'Everything I have, which is eleven dollars and the bingo float. I\'d rather not spend the bingo float.', '', 'No. Nor mine, these days, apparently.'][i]);
    },
    async (a, t) => {
      await say(a, 'News. I heard a dealer at the Route 1 flea market has a silver cross with a fish on it. Sister Amabel saw it herself, and she has very good eyes. He wants a hundred and sixty. The parish has forty.');
      const i = await respond(a, 'ignatius', [
        { label: '"Have you been to see it?"', tone: 'straight' },
        { label: '"Shall I go and haggle him down?"', tone: 'kind' },
        { label: '"A hundred and sixty is robbery."', tone: 'sharp' }
      ]);
      await say(a, ['Not yet. If it is ours, I\'ll shout, and priests shouldn\'t shout at flea markets.', 'You\'re kind. He\'d see you coming. He sees everybody coming. He has a mirror on a stick.', 'Robbery is a strong word. Sister Amabel used a stronger one.'][i]);
      await say(a, 'I could sell you our spare candlesticks. They were a gift from a cardinal. A minor cardinal.');
      t.f.sticks = await townBuy(a, makeItem('candlestick', { cond: 2, mark: 'a crowned fish' }), 55, 'Bought Saint Brine\'s spare candlesticks');
      await say(a, t.f.sticks ? 'There. Ninety-five dollars of the way. The cardinal would understand. He was very relaxed about money.' : 'No, no. Quite right. They\'re very heavy candlesticks.');
      if (t.f.promised) await say(a, 'You said you\'d keep an eye out. I notice you have two. I\'m grateful for both.');
    },
    async (a, t) => {
      await narrate('A man in a fleece vest has followed Father Ignatius in, carrying something long wrapped in a beach towel.');
      await say(a, 'He heard you buy silver. He says he\'ll sell it to you instead of me. For a hundred. I am trying very hard not to be cross. That was a pun. I didn\'t mean it.');
      // warm: Father Ignatius knows the dealer's mother, and says so; the price drops
      const warm = isFriend('ignatius', 'warm');
      let price = 100;
      if (warm) {
        await say(a, 'Leave this to me. ... Young man, does your mother still sing alto at Our Lady of the Harbor? She does? Then you\'ll take eighty, won\'t you.');
        await narrate('The man in the fleece vest says he\'ll take eighty.');
        price = 80;
      }
      const share = t.f.sticks ? 55 : 0;
      const give = Math.max(0, price - share - 40);
      const i = await choose([{ label: `Buy it and give it to the Father (${money(give)} after the parish's share)`, disabled: S.coin < give }, { label: `Buy it for the shop (${money(price)})`, hint: '(guide $240)', disabled: S.coin < price || !shelfFree() }, 'Let it go']);
      if (i === 0) {
        t.end = 'home'; if (give) change('coin', -give, 'Bought back Saint Brine\'s cross'); change('rep', 8);
        await say(a, 'There it is. There\'s the fish. I am going to carry this in front of the bishop and I am going to walk very slowly.');
        const p = await respond(a, 'ignatius', [
          { label: '"I\'ll be in the back pew."', tone: 'kind' },
          { label: '"Only if there\'s bingo after."', tone: 'wry' }
        ]);
        await say(a, ['The back pew is where the saints sit. And the people who leave early. Be the first kind.', 'There is always bingo after. It\'s practically doctrine.'][p]);
      } else if (i === 1) {
        t.end = 'kept'; change('coin', -price, 'Bought a silver processional cross');
        const it = townItem({ name: 'Processional cross, 1890s', icon: 'candlestick', cat: 'silver', guide: 240, condLabel: 'Fine', clue: 'Silver on oak. A fish on the boss. "S. BRINE" scratched inside the socket.' });
        it.paid = price; S.stock.push(it); renderPanel(); change('rep', -4);
        await say(a, 'Well. It\'s in town, at least. I shall come and visit it. In the window. Like a grandparent.');
        const p = await respond(a, 'ignatius', [
          { label: '"It\'ll be safe here, Father. Visit any time."', tone: 'kind' },
          { label: '"It was a good price."', tone: 'sharp' }
        ]);
        await say(a, ['I will. I\'ll bring a cloth for the glass.', 'It was. I\'ll pray for the price. It needs it more than you do.'][p]);
      } else {
        t.end = 'gone';
        await say(a, 'He says a man in Boston wants it. Then it goes to Boston. God is in Boston too. I\'m told.');
        const p = await respond(a, 'ignatius', [
          { label: '"I\'m sorry, Father."', tone: 'kind' },
          { label: '"Boston\'s only an hour on the train."', tone: 'wry' },
          { label: '"It\'s only silver."', tone: 'sharp' }
        ]);
        await say(a, ['Don\'t be. You owed it nothing. Neither did I, really. It just felt like we did.', 'Seventy minutes. I\'ve timed it. I\'ll visit, and I\'ll pretend I\'m there for the chowder.', 'Yes. And the fish is only a fish. And I\'m only a priest. Good day.'][p]);
      }
    }
  ],
  epilogue: { home: 'At the bishop\'s visit, Father Ignatius carries the silver cross down the aisle of Saint Brine\'s, very slowly.', kept: 'Saint Brine\'s cross sits in your window. Father Ignatius visits it on Sundays.', gone: 'Saint Brine\'s cross went to Boston. Father Ignatius carried a broom handle with a paper fish on it, and the bishop said it was lovely.' }
});

addRegular('hester', {
  name: 'Hester Quint', place: 'the Athenaeum', topic: 'the town\'s past: who owned what, who built what, who lied about it',
  look: { skin: '#e8c0a0', hair: '#8a3a20', hs: 3, coat: '#4a5a6a', style: 'jacket', trim: '#e8e0c8', long: true, pants: '#2a2a32', glasses: '#2a2a2e' },
  meet: 'Hester Quint, the Athenaeum. I\'m going to look at your book shelf now. Don\'t take it personally.',
  chat: ['Odile had a library card from 1971. She never once returned anything on time. I liked her very much.', 'If you want to know who owned something before you, ask me. I probably have it in a drawer.', 'Your shelf has nothing of ours on it today. I\'m almost disappointed.'],
  // Hester likes a straight answer and has no time for an angle
  small: [
    { say: 'Odile had a library card from 1971. She never once returned anything on time. I liked her very much.', opts: [
      { label: '"What did she borrow?"', tone: 'straight', reply: 'Tide tables. Every year. She said she liked to know when the water was coming for her.' },
      { label: '"Do I owe her fines?"', tone: 'wry', reply: 'Four hundred and twelve dollars. I waived it at the funeral. It felt right.' },
      { label: '"Could I get a card?"', tone: 'kind', reply: 'You could. Bring proof of address and a promise. I\'ll know if the promise is any good.' }] },
    { say: 'Somebody\'s been cutting the coast maps out of our county atlases. Only the coast. Only the pages with wrecks on.', opts: [
      { label: '"I\'ll watch for them coming over my counter."', tone: 'straight', reply: 'Thank you. They\'re about this big and they smell faintly of guilt.' },
      { label: '"What would a page like that fetch?"', tone: 'sly', reply: 'From you, nothing. I\'d see to that.' },
      { label: '"Maybe it\'s for a school project."', tone: 'kind', reply: 'A school project with a metal detector and a pickup truck. Yes. Maybe.' }] },
    { say: 'If you want to know who owned something before you, ask me. I probably have it in a drawer.', opts: [
      { label: '"Who had this shop before Odile?"', tone: 'straight', reply: 'A sailmaker called Amos Quint. No relation. I\'ve checked twice, hoping.' },
      { label: '"Have you got a drawer on me?"', tone: 'wry', reply: 'A folder. It\'s very thin. You could change that.' },
      { label: '"I\'d rather not know."', tone: 'sharp', reply: 'Most people would rather not. That\'s why I\'m here.' }] },
    { say: 'Your shelf has nothing of ours on it today. I\'m almost disappointed.', opts: [
      { label: '"I check every book that comes in."', tone: 'straight', reply: 'Do you? Good. Most people think books are bricks with opinions.' },
      { label: '"Give it time."', tone: 'wry', reply: 'I give everything time. It\'s the whole job.' },
      { label: '"Finders keepers."', tone: 'sly', reply: 'Not in this town. We have a charter about it. Somewhere.' }] },
    { say: 'The board wants to sell our whaling logs to a university in Connecticut. I would sooner sell my teeth.', opts: [
      { label: '"Then fight them. Out loud."', tone: 'straight', reply: 'I intend to. At the next meeting. With footnotes.' },
      { label: '"I\'m sorry, Hester."', tone: 'kind', reply: 'Don\'t be sorry. Be at the meeting.' },
      { label: '"What\'s a university paying for whaling logs?"', tone: 'sly', reply: 'Enough to make the board forget what a town is for.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I\'ve written it down. In the town\'s record, not mine. Mine is private.', opts: [
      { label: '"It was the right thing. That\'s all."', tone: 'straight', reply: 'That\'s never all. But I\'ll take it.' },
      { label: '"Spell my name right."', tone: 'wry', reply: 'I always spell names right. It\'s the least we can do for people.' },
      { label: '"Is there anything in it for me?"', tone: 'sly', reply: 'A line in a book. It lasts longer than money.' }] },
    down: { say: 'I heard about {quest}. It will go in the record. I keep the record.', opts: [
      { label: '"Then put down that I was wrong."', tone: 'straight', reply: 'I will. In the margin. The margin is where history gets honest.' },
      { label: '"Records get lost."', tone: 'sly', reply: 'Not mine.' },
      { label: '"Write what you like."', tone: 'sharp', reply: 'I always do.' }] }
  },
  mend: async a => {
    await say(a, 'Hester stands at your book shelf with her arms folded and doesn\'t look at you.');
    const books = townTakeFromStock(it => it.key === 'tome' || it.cat === 'book');
    const i = await choose([books.length ? `Give the Athenaeum the ${books[0].name.toLowerCase()}` : '"I was wrong, Hester. Write that down."', 'Say nothing']);
    if (i !== 0) { await say(a, 'Hm.'); return false; }
    if (books.length) { S.stock = S.stock.filter(x => x !== books[0]); renderPanel(); await say(a, 'For the Athenaeum. With your name in the front. That\'s how a thing gets mended in this town: in ink.'); }
    else await say(a, 'I will. Today\'s date, and your exact words. You can\'t take them back now.');
    return true;
  },
  title: 'The Town Charter', endings: { returned: 'Back in the Case', sold: 'Sold to Cliff Road', framed: 'Over the Till' },
  steps: [
    async (a, t) => {
      await say(a, 'The Athenaeum is missing its copy of the 1790 town charter. Lent to a selectman in 1962. He died in 1970. It didn\'t come back. It never does.');
      await say(a, 'I\'m told his house was cleared out by a pawnbroker. This one. Odile, I mean, not you. You were not a pawnbroker in 1970. I checked.');
      let i = await respond(a, 'hester', [
        { label: '"I\'ll look through Odile\'s things."', tone: 'straight', save: 'looked' },
        { label: '"If it turns up, it\'s mine."', tone: 'sly' },
        { label: '"Why does a piece of paper matter so much?"', tone: 'straight' }
      ]);
      if (i === 2) {
        await say(a, 'Because it says who we promised to be. We\'ve not been very good at it.');
        i = await respond(a, 'hester', [
          { label: '"Then I\'ll help you find it."', tone: 'kind', save: 'looked' },
          { label: '"Promises don\'t pay rent."', tone: 'sharp' }
        ]) === 0 ? 0 : 1;
      }
      t.f.looked = !!said('hester', 'looked');
      await say(a, t.f.looked ? 'Thank you. It\'s parchment, about so big, and it smells of a man who smoked a pipe for sixty years.' : 'Technically. Morally, it\'s the town\'s. I\'ll be back with morals.');
    },
    async (a, t) => {
      await say(a, 'The Athenaeum is selling some duplicates to pay for a search of the county archives. Thirty dollars for the box. There may be something good in it. Librarians aren\'t allowed to say.');
      const good = Math.random() < 0.5;
      t.f.box = await townBuy(a, makeItem('tome', { cond: good ? 2 : 0, guide: good ? 120 : 20 }), 30, 'Bought a box of Athenaeum duplicates');
      await say(a, t.f.box ? 'Lovely. If there\'s a first edition in there, you didn\'t hear it from me.' : 'They\'ll go to the church sale. Father Ignatius will price them all at a dollar.');
      await say(a, 'If you did find the charter. Hypothetically. What would you do with it?');
      const i = await respond(a, 'hester', [
        { label: '"Give it back."', tone: 'kind', save: 'promised' },
        { label: '"Depends who\'s asking."', tone: 'sly' },
        { label: '"I don\'t know yet."', tone: 'straight', sway: 1, save: 'unsure' }
      ]);
      await say(a, ['That\'s easy to say in the second week. I\'ll write it down anyway.', 'Everyone\'s asking. That\'s the trouble with a thing that matters.', 'Good. That\'s honest. People who know already are usually lying.'][i]);
    },
    async (a, t) => {
      await narrate('Under the boxes in the corner, flat in a cardboard folder labelled "VERY OLD, DON\'T", a sheet of parchment that smells of pipe smoke.');
      await say(a, 'That\'s it. That\'s the charter. You found it. I may need to sit on the radiator.');
      if (said('hester', 'promised') && isFriend('hester', 'warm')) await say(a, 'You told me you\'d give it back. I\'ve been trying not to hope. It\'s very bad for a librarian, hope. It makes us lend things.');
      else if (said('hester', 'unsure')) await say(a, 'You said you didn\'t know what you\'d do. Well. Now you have to know.');
      const i = await choose(['Give it back to the Athenaeum', 'Sell it to Ellery Thorne on Cliff Road ($150)', 'Frame it and hang it over the till']);
      if (i === 0) { t.end = 'returned'; change('rep', 8); await say(a, 'You\'ll have a plaque. Small. By the drinking fountain. People will lean on it.'); }
      else if (i === 1) { t.end = 'sold'; change('coin', 150, 'Sold the 1790 town charter to Ellery Thorne'); change('rep', -6); await say(a, said('hester', 'promised') ? 'You told me you\'d give it back. I wrote it down. I\'ll leave the page open.' : 'Ellery Thorne. Of course. He\'ll keep it in a drawer with the spoons. I\'ll be visiting it, with a sandwich, every Tuesday.'); }
      else {
        t.end = 'framed'; change('rep', 2);
        // honest in week 3, she respects it; promised, she doesn't
        if (said('hester', 'promised')) sway('hester', -2, 'You told her you\'d give the charter back, and framed it');
        await say(a, said('hester', 'promised') ? 'Over the till. You said you\'d give it back. Everyone will see it, and I\'ll see that.' : 'Over the till. Well. Everyone in town will see it. That\'s more than saw it in the case. I hate that you\'re right.');
      }
    }
  ],
  epilogue: { returned: 'The 1790 charter is back in its case at the Athenaeum, with a very small plaque that thanks the Crooked Scale.', sold: 'The 1790 charter hangs in Ellery Thorne\'s hall. Hester Quint visits on Tuesdays and glares at it.', framed: 'The 1790 town charter hangs over your till. Tourists photograph it. Hester Quint dusts it, uninvited.' }
});

addRegular('marguerite', {
  name: 'Marguerite Oyelaran', place: 'Town Hall', topic: 'town business: votes, permits, meetings and the selectmen',
  look: { skin: '#7a5038', hair: '#e8e8e8', hs: 3, coat: '#4a5a7a', trim: '#e8e0c8', style: 'jacket', long: true, pants: '#2a2a3a', glasses: '#2a2a2e', bag: '#6a4a2a' },
  meet: 'Marguerite Oyelaran, town moderator. Twenty-two years of Town Meeting. I will not be hurried, and neither will you.',
  chat: ['Article 14 is about the parking at the ferry landing. It has been Article 14 for nine years.', 'Odile once spoke for forty minutes at Town Meeting about a streetlight. She won. The streetlight is still on.', 'If a thing needs a permit in this town, I know about it. If it doesn\'t, I know about that too.'],
  // Marguerite likes a straight answer; a joke at the wrong moment puts her back up
  small: [
    { say: 'Article 14 is about the parking at the ferry landing. It has been Article 14 for nine years.', opts: [
      { label: '"What\'s actually in it?"', tone: 'straight', reply: 'Eleven parking spaces and nine years of grievance. Mostly the grievance.' },
      { label: '"Maybe this is its year."', tone: 'wry', reply: 'That isn\'t funny. It is never funny.' },
      { label: '"Who keeps blocking it?"', tone: 'sly', reply: 'Everyone who already has a space. Which is to say, the selectmen.' }] },
    { say: 'Odile once spoke for forty minutes at Town Meeting about a streetlight. She won. The streetlight is still on.', opts: [
      { label: '"What did she say for forty minutes?"', tone: 'straight', reply: 'That the town had a duty not to let her trip. And that if it did, she\'d trip outside the selectmen\'s houses.' },
      { label: '"Forty minutes on one light bulb?"', tone: 'wry', reply: 'Forty-one. I let her run over. I\'ve never done it since.' },
      { label: '"Good for her."', tone: 'kind', reply: 'Yes. It was. She never asked for anything else.' }] },
    { say: 'Your sign has a permit. Odile\'s, from 1971. I looked.', opts: [
      { label: '"Is it still good?"', tone: 'straight', reply: 'Signs are permanent in Hollow Neck, unless they fall on someone. Don\'t let it fall on someone.' },
      { label: '"Thank you for checking."', tone: 'kind', reply: 'I check everybody. You\'re the first to thank me.' },
      { label: '"Could we say we lost it?"', tone: 'sly', reply: 'You could say anything. I have the copy.' }] },
    { say: 'Someone leaves a garden gnome on the Town Hall steps every night. I have taken in eleven.', opts: [
      { label: '"Do you know who?"', tone: 'straight', reply: 'Yes. I\'m waiting for him to run out of gnomes. He\'s waiting for me to run out of shelf.' },
      { label: '"Put the gnomes on the warrant."', tone: 'wry', reply: 'Please don\'t. Someone would second it.' },
      { label: '"I\'ll buy the gnomes."', tone: 'sly', reply: 'They\'re evidence.' }] },
    { say: 'The selectmen want the March meeting on a weeknight. People will come straight from work in boots. Boots drip.', opts: [
      { label: '"Put newspaper down at the door."', tone: 'straight', reply: 'Yes. The Gazette. It\'s finally good for something. Don\'t tell Hester I said that.' },
      { label: '"Wet boots are democracy."', tone: 'wry', reply: 'Democracy can wipe its feet.' },
      { label: '"Why do you care about boots?"', tone: 'sharp', reply: 'Because I mop the hall afterwards. Myself. For twenty-two years.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I don\'t take sides. I\'m the moderator. I\'m taking a side, just this once, in here.', opts: [
      { label: '"It needed doing."', tone: 'straight', reply: 'Yes. Most things that need doing don\'t get done. Thank you.' },
      { label: '"Your secret\'s safe."', tone: 'wry', reply: 'Call it an abstention, with feeling.' },
      { label: '"Thank you, Marguerite."', tone: 'kind', reply: 'Don\'t thank me. I\'ll get used to it.' }] },
    down: { say: 'I heard about {quest}. The town is talking. I am supposed to keep order when the town talks, and I am finding it difficult.', opts: [
      { label: '"I was wrong. I\'ll say so to anyone who asks."', tone: 'straight', reply: 'They\'ll ask. Mean it each time.' },
      { label: '"Order! Order!"', tone: 'wry', reply: 'No.' },
      { label: '"The town can mind its own business."', tone: 'sharp', reply: 'The town is my business.' }] }
  },
  mend: townMend({ say: 'Marguerite puts a printed form on the counter: a sign permit, renewal overdue since 2009.', label: 'Fill it in and pay the renewal', cost: 15, why: 'Renewed the shop sign\'s permit',
    yes: 'Thank you. That\'s all most of us want. The forms filled in.', no: 'I\'ll leave it here. It isn\'t going anywhere. Neither am I.' }),
  title: 'The Gavel', endings: { tess: 'Moderator Bascombe', hester: 'Moderator Quint', dot: 'Moderator Haskell', stays: 'Twenty-Three Years' },
  steps: [
    async (a, t) => {
      await say(a, 'My grandfather\'s gavel cracked at the last meeting. Lignum vitae, 1894. It has called order on every vote in this town since the trolley.');
      await say(a, 'Agathe Moss says she could pin it. Or I could sell it to you and buy a plastic one, and that would be a sign, wouldn\'t it. That I\'m done.');
      let i = await respond(a, 'marguerite', [
        { label: '"Have Agathe pin it."', tone: 'straight' },
        { label: '"I\'ll buy it, if you\'re done." ($40)', disabled: S.coin < 40 || !shelfFree() },
        { label: '"Plastic gavels bounce."', tone: 'wry' }
      ]);
      if (i === 2) {
        await say(a, 'Thank you. I\'ll write that down nowhere. Well?');
        i = await respond(a, 'marguerite', [
          { label: '"Have Agathe pin it."', tone: 'straight' },
          { label: '"I\'ll buy it, if you\'re done." ($40)', disabled: S.coin < 40 || !shelfFree() }
        ]);
      }
      t.f.sold = i === 1;
      if (i === 1) {
        const it = townItem({ name: 'Town Meeting gavel, 1894', icon: 'statuette', cat: 'curio', guide: 90, condLabel: 'Cracked', clue: 'Lignum vitae. "H.N.T.M." on the head. Cracked clean through, and still heavy enough to end an argument.' });
        if (S.coin >= 40 && shelfFree()) { it.paid = 40; S.stock.push(it); change('coin', -40, 'Bought Marguerite Oyelaran\'s gavel'); renderPanel(); }
        await say(a, 'There. I\'ve said it out loud. I want to stop. I just want to hand it to someone who won\'t let Article 14 win.');
      } else await say(a, 'Agathe, then. Twenty-three years. Well. Let\'s see who\'s ready.');
      await say(a, 'Twenty-two years. Tell me honestly. Have I earned stopping, or am I just tired?');
      const p = await respond(a, 'marguerite', [
        { label: '"Tired is a good enough reason."', tone: 'straight', save: 'tired' },
        { label: '"You\'ve earned it twice over."', tone: 'kind' },
        { label: '"Twenty-two\'s a nice round number."', tone: 'wry' }
      ]);
      await say(a, ['Yes. It is, isn\'t it. Nobody has said that to me. They all say "earned".', 'That\'s kind. Everybody says "earned". It makes it sound like a pension.', 'It isn\'t round. It isn\'t anything. Never mind.'][p]);
    },
    async (a, t) => {
      await say(a, 'I\'ve been asking around. Who do you trust to run a room full of people who all think they\'re right? You see everyone. You\'d know.');
      const i = await choose(['"Tess Bascombe. She runs a harbor."', '"Hester Quint. She knows every rule since 1790."', '"Dot Haskell. Everybody already tells her everything."', '"You. Nobody else will be as good."']);
      t.f.pick = ['tess', 'hester', 'dot', 'stays'][i];
      await say(a, ['Tess. She\'d move things along. Perhaps too far along.', 'Hester. Yes. She would make them read the warrant. Aloud.', 'Dot. Hm. She\'d have the votes counted before the meeting starts.', 'Flattery. I accept it. I\'m eighty-one and I accept it.'][i]);
      if (t.f.pick === 'stays') {
        const p = await respond(a, 'marguerite', [
          { label: '"It wasn\'t flattery. I meant it."', tone: 'straight', sway: 1 },
          { label: '"It was a bit."', tone: 'wry' }
        ]);
        await say(a, ['Then I\'ll think about it properly. Which is worse.', 'Hm. I knew that. I still accept it.'][p]);
      } else {
        await say(a, `Would you say so to ${TOWN[t.f.pick].name}? They\'ll listen to the shop. Everybody comes in here.`);
        const p = await respond(a, 'marguerite', [
          { label: '"I\'ll put a word in."', tone: 'straight', save: 'word' },
          { label: '"Leave me out of town politics."', tone: 'sharp' }
        ]);
        await say(a, ['Good. A short word. They hate long ones.', 'Nobody is out of town politics. You\'re just out of the room.'][p]);
      }
    },
    async (a, t) => {
      t.end = t.f.pick || 'stays';
      if (t.end === 'stays') await say(a, 'I\'ve decided. Twenty-three years. The new gavel is pinned and it\'s louder than the old one. Article 14 should be afraid.');
      else {
        await say(a, `I've done it. I handed the gavel to ${TOWN[t.end].name} last night, in front of everybody. They called order. The room actually came to order. I went home and slept for eleven hours.`);
        if (said('marguerite', 'word') && isFriend('marguerite', 'warm')) await say(a, `${TOWN[t.end].name.split(' ')[0]} told me you\'d put a word in. A short one. The right one.`);
      }
      change('rep', 4);
      const p = await respond(a, 'marguerite', [
        { label: t.end === 'stays' ? '"Good. The town needs you."' : '"Will you miss it?"', tone: 'kind' },
        { label: t.end === 'stays' ? '"What\'s the first thing you\'ll do?"' : '"What will you do with your Tuesdays?"', tone: 'straight' },
        { label: '"Gavel down. Meeting adjourned."', tone: 'wry' }
      ]);
      await say(a, t.end === 'stays'
        ? ['The town needs a new streetlight. I\'ll settle for needing me.', 'Article 14. First. Before anyone has their coffee.', 'Not yet it isn\'t.'][p]
        : ['Every Tuesday. And every Tuesday I\'ll be glad. Both at once. That\'s retirement, I\'m told.', 'Read the warrants. All of them, since 1894. For pleasure, this time.', 'Not yet it isn\'t. I have the minutes to write.'][p]);
    }
  ],
  epilogue: { tess: 'Tess Bascombe runs Town Meeting now. Votes take eleven minutes. Article 14 passed.', hester: 'Hester Quint runs Town Meeting now, and reads every warrant article aloud. Article 14 is still Article 14.', dot: 'Dot Haskell runs Town Meeting now. Everyone knows how it will go before it starts, and it goes that way.', stays: 'Marguerite Oyelaran moderates her twenty-third year of Town Meeting with a pinned gavel and no intention of stopping.' }
});

addRegular('dory', {
  name: 'Dory Kittredge', place: 'Kittredge Fish on Pier Nine', topic: 'the pier, and whatever comes up in the nets',
  look: { skin: '#d8a888', hair: '#7a5a42', hs: 3, coat: '#3a5a6a', style: 'jacket', apron: '#e0a020', hat: 'beanie', hatc: '#c84a3a', pants: '#2a3a4a', shoe: '#e0a020' },
  meet: 'Dory Kittredge. Kittredge Fish, end of Pier Nine. If it came out of the water, I\'ve sold it or I\'ve thrown it back.',
  chat: ['The dredges bring up all sorts. Bottles, boots, one time a bowling ball. Bev Santos bought it.', 'My freezer\'s older than me. It sounds like it\'s thinking.', 'Fish is up. Everything\'s up. The fish don\'t know why either.'],
  // Dory likes a joke and a straight answer, and hates being handled gently
  small: [
    { say: 'The dredges bring up all sorts. Bottles, boots, one time a bowling ball. Bev Santos bought it.', opts: [
      { label: '"Does it bowl?"', tone: 'wry', reply: 'Bev says it hooks left. Everything out of this harbor hooks left.' },
      { label: '"What\'s the oddest thing you\'ve hauled?"', tone: 'straight', reply: 'A wedding cake in a sealed tin. 1962. We didn\'t eat it. We thought about it.' },
      { label: '"That must be lonely work."', tone: 'kind', reply: 'It\'s fish. Fish don\'t need company. Neither do I.' }] },
    { say: 'My freezer\'s older than me. It sounds like it\'s thinking.', opts: [
      { label: '"What\'s it thinking about?"', tone: 'wry', reply: 'Retirement. Same as me.' },
      { label: '"Why not get it fixed?"', tone: 'straight', reply: 'Hal says the part costs more than the freezer. Hal says that about everything, and he\'s always right.' },
      { label: '"Poor old thing."', tone: 'kind', reply: 'The freezer or me? Don\'t answer.' }] },
    { say: 'Fish is up. Everything\'s up. The fish don\'t know why either.', opts: [
      { label: '"What\'s still cheap?"', tone: 'straight', reply: 'Advice. Here: never buy a lobster off a man with a cooler in a car park.' },
      { label: '"Are the fish getting a cut?"', tone: 'wry', reply: 'The fish are getting the worst of it, as usual.' },
      { label: '"That must be hard on you."', tone: 'kind', reply: 'It\'s hard on everybody. I\'m not special. Buy some haddock.' }] },
    { say: 'Somebody\'s buying every monkfish I land. Every week. Cash. Says it\'s for "a project".', opts: [
      { label: '"What sort of project?"', tone: 'straight', reply: 'Didn\'t ask. Man pays cash for monkfish, you don\'t ask. You count.' },
      { label: '"Put the price up."', tone: 'sly', reply: 'Did. He paid it. Now I\'m nervous.' },
      { label: '"Monkfish are hideous."', tone: 'wry', reply: 'They\'re ugly so the rest of us look better. Show some respect.' }] },
    { say: 'Ice on the pier this morning. Slid six feet with a tote of haddock. Didn\'t drop one.', opts: [
      { label: '"Show-off."', tone: 'wry', reply: 'Six feet. Not one haddock. Put it on my headstone.' },
      { label: '"Get some salt down."', tone: 'straight', reply: 'I did. After. That\'s how it works on a pier.' },
      { label: '"Are you all right? You could\'ve been hurt."', tone: 'kind', reply: 'I said I didn\'t drop one.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. The pier heard too. You\'ve got a reputation down there now. A good one. Don\'t ruin it.', opts: [
      { label: '"I\'ll do my best to ruin it slowly."', tone: 'wry', reply: 'Good. Slowly\'s the only way anything happens on Pier Nine.' },
      { label: '"Just did what was fair."', tone: 'straight', reply: 'That\'s rarer than you\'d think. Ask a fish.' },
      { label: '"That means a lot, Dory."', tone: 'kind', reply: 'Don\'t get soppy. It\'s a pier.' }] },
    down: { say: 'I heard about {quest}. The whole pier did. Go on, then. Tell me why.', opts: [
      { label: '"No excuse. I got it wrong."', tone: 'straight', reply: 'All right. That\'s an answer. I can sell fish to an answer.' },
      { label: '"I was hoping you wouldn\'t hear."', tone: 'wry', reply: 'On a pier? Sound carries over water. So does everything else.' },
      { label: '"I\'m so sorry you\'re upset."', tone: 'kind', reply: 'I\'m not upset. I\'m informed.' }] }
  },
  mend: townMend({ say: 'Dory leans on your counter and waits, like a woman who could wait all day.', label: 'Buy a fish off her. A big one', cost: 12, why: 'Bought a very large fish off Dory, by way of sorry',
    yes: 'Striped bass. You\'ll be eating it till Thursday. That\'s the point.', no: 'Suit yourself. Fish don\'t wait. Neither do I.' }),
  title: 'What Came Up', endings: { freezer: 'A New Freezer', bargain: 'Something Good in the Mud', mud: 'Just Mud' },
  steps: [
    async (a, t) => {
      await say(a, 'I\'m saving for a new freezer. The old one makes a noise like it wants to talk. So I sell what comes up in the dredge.');
      await say(a, 'This came up Tuesday. Box, crusted shut. Could be anything. Twenty dollars, no peeking.');
      const i = await respond(a, 'dory', [
        { label: '"What do you reckon\'s in it?"', tone: 'straight' },
        { label: '"Does the freezer talk back?"', tone: 'wry' },
        { label: '"Poor freezer. Is it going to be all right?"', tone: 'kind' }
      ]);
      await say(a, ['If I knew, it\'d be thirty.', 'Only at night. Mostly about the Red Sox.', 'It\'s a freezer. Save it for people.'][i]);
      const good = Math.random() < 0.45;
      const it = good ? makeItem(pick(['ring', 'watch', 'compass']), { cond: 0 }) : townItem({ name: 'Barnacled box (a bent spoon)', icon: 'tin', guide: 4, condLabel: 'Crusted' });
      t.f.box1 = await townBuy(a, it, 20, 'Bought a box from Dory\'s dredge', 'Pass');
      if (t.f.box1) { t.f.lucky = good; await narrate(good ? `You chip it open. Inside, under the mud, a ${it.name.toLowerCase()}.` : 'You chip it open. A bent spoon and a great deal of mud.'); }
    },
    async (a, t) => {
      let i;
      if (t.f.box1) {
        await say(a, 'That box last week. Tell me straight. Good or mud?');
        i = await respond(a, 'dory', [
          { label: t.f.lucky ? '"Good. Better than twenty dollars\' worth."' : '"Mud. And a spoon."', tone: 'straight', save: 'honest' },
          { label: '"Never you mind."', tone: 'sly' },
          { label: '"It was lovely of you to sell it to me."', tone: 'kind' }
        ]);
        await say(a, [t.f.lucky ? 'Ha. Good. I\'d rather it went to somebody who\'d say so.' : 'Ha. The spoon\'s worth something to somebody. Probably not you.', 'Fair. A woman likes a mystery. Not this much.', 'It was twenty dollars. Lovely doesn\'t come into it.'][i]);
      } else {
        await say(a, 'You passed on the box. Smart, or scared?');
        i = await respond(a, 'dory', [
          { label: '"Scared."', tone: 'straight' },
          { label: '"Smart. I had a feeling about the spoon."', tone: 'wry' },
          { label: '"I didn\'t want to take your money."', tone: 'kind' }
        ]);
        await say(a, ['Honest. All right.', 'Ha. You don\'t know it was a spoon. Nobody does. Not now.', 'I wanted you to take my box. Different thing.'][i]);
      }
      await say(a, 'Another one. Long, heavy, wrapped in net. Thirty dollars. I\'d keep it but I need the freezer more than I need a mystery.');
      const good = Math.random() < 0.45;
      const it = good ? makeItem(pick(['spyglass', 'candlestick', 'dagger']), { cond: 1 }) : townItem({ name: 'Net-wrapped length of chain', icon: 'key', guide: 6, condLabel: 'Rusted' });
      t.f.box2 = await townBuy(a, it, 30, 'Bought a parcel from Dory\'s dredge', 'Pass');
      if (t.f.box2) { t.f.lucky = t.f.lucky || good; await narrate(good ? `Under the net: a ${it.name.toLowerCase()}, in better shape than it has any right to be.` : 'Under the net: chain. Just chain. Dory is very interested in the ceiling.'); }
    },
    async (a, t) => {
      if (t.f.box1 || t.f.box2) {
        t.end = t.f.lucky ? 'bargain' : 'freezer';
        await say(a, 'New freezer\'s in. It doesn\'t make any noise at all. I keep checking it\'s on.');
        if (t.f.box1 && t.f.box2 && isFriend('dory', 'warm')) await say(a, 'You came back for the second box. Most people only gamble on me once.');
        await say(a, 'Here. Last thing out of the old one before it went. On the house.');
        giveItem(townItem({ name: 'Sea-worn brass porthole ring', icon: 'compass', guide: 35, condLabel: 'Sea-worn', clue: 'Off a dragger that went down in the 1950s. Dory won\'t say which.' }), true);
        change('rep', 3);
        const p = await respond(a, 'dory', [
          { label: '"Which dragger?"', tone: 'straight' },
          { label: '"You\'ll miss the old freezer\'s chat."', tone: 'wry' },
          { label: '"You didn\'t have to do that, Dory."', tone: 'kind' }
        ]);
        await say(a, ['I said I won\'t say. Ask Tess. She won\'t say either, but she\'ll take longer about it.', 'I will. I\'ve started talking to the new one. It doesn\'t answer. Rude.', 'I know I didn\'t. That\'s what on the house means.'][p]);
      } else {
        t.end = 'mud';
        await say(a, 'Still the old freezer. It\'s started humming a tune now. I think it\'s the one from the radio ad for Haines Motors.');
        const p = await respond(a, 'dory', [
          { label: '"Want me to come and hum along?"', tone: 'wry' },
          { label: '"I should have bought a box."', tone: 'straight' },
          { label: '"I\'m sorry, Dory."', tone: 'kind' }
        ]);
        await say(a, ['Don\'t you dare. It\'ll think it\'s got an audience.', 'You should. Next year. Bring more than twenty dollars.', 'Don\'t be. It\'s a freezer.'][p]);
      }
    }
  ],
  epilogue: { freezer: 'Dory Kittredge has a new freezer that never talks. She misses it a little.', bargain: 'Dory Kittredge has a new freezer, and you have something good that came up in the mud. She says it\'s even.', mud: 'Dory Kittredge\'s old freezer hums the Haines Motors jingle at night. Nobody can sleep on Pier Nine.' }
});

addRegular('dot', {
  name: 'Dot Haskell', place: 'Dot\'s Clam Shack', topic: 'gossip: who\'s courting, who\'s feuding, who\'s back in town',
  look: { skin: '#c89070', hair: '#2a1e16', hs: 1, coat: '#3a4a6a', style: 'puffer', pants: '#2a2a30', bag: '#8a5a3a' },
  meet: 'Dot Haskell. Dot\'s Clam Shack, end of Water Street. I walk past your window every morning on my way to open up.',
  chat: ['Everybody comes to the window eventually. I just listen while I fry.', 'Odile and I had a deal. She told me nothing and I told her everything.', 'The Shack closes at the first frost. Until then, I hear it all.'],
  // Dot likes kindness and can't abide a sharp word
  small: [
    { say: 'Everybody comes to the window eventually. I just listen while I fry.', opts: [
      { label: '"What have you heard lately?"', tone: 'straight', reply: 'I heard you lock up at five and sit in the dark till six. Don\'t tell me if it\'s true. I like it as it is.' },
      { label: '"You must hear some sad things."', tone: 'kind', reply: 'Mostly sad. Some funny. People will tell a woman with a fryer anything.' },
      { label: '"Do you ever keep any of it to yourself?"', tone: 'sharp', reply: 'Everything that matters. You\'d be surprised. Most people would be.' }] },
    { say: 'Odile and I had a deal. She told me nothing and I told her everything.', opts: [
      { label: '"Shall we keep the same deal?"', tone: 'wry', reply: 'Yes. You\'re already good at telling me nothing.' },
      { label: '"I\'d like to hear everything."', tone: 'kind', reply: 'Then you\'ll want a chair. And a clam roll. Come by.' },
      { label: '"Sounds one-sided."', tone: 'sharp', reply: 'It was. She got the better end. She always did.' }] },
    { say: 'I heard the Haskell cousins are back from Florida. Both of them. Tanned. Unbearable.', opts: [
      { label: '"Your family?"', tone: 'straight', reply: 'Frank\'s. Which makes them mine, by law. Not by choice.' },
      { label: '"Feed them till they\'re bearable."', tone: 'kind', reply: 'I\'ve tried. They\'re bearable for the length of one clam roll. Then they talk about Florida again.' },
      { label: '"Why should I care?"', tone: 'sharp', reply: 'You shouldn\'t. I just had to tell somebody, and you were nearest.' }] },
    { say: 'The Shack closes at the first frost. I can feel it coming. In my knees and in the till.', opts: [
      { label: '"What do you do all winter?"', tone: 'straight', reply: 'Knit. Badly. Ask anyone in town who\'s had a scarf off me.' },
      { label: '"I\'ll miss the clams."', tone: 'kind', reply: 'They\'ll miss you. Well. They won\'t. They\'re clams. I will.' },
      { label: '"Sell chowder in winter."', tone: 'sly', reply: 'From a shack with no heat? You\'d make a terrible clam.' }] },
    { say: 'Somebody parked across the Shack\'s back door twice this week. Silver car. Out-of-state plates.', opts: [
      { label: '"I\'ll keep an eye out for it."', tone: 'kind', reply: 'Would you? I\'ve told everybody else. You\'re the only one who offered.' },
      { label: '"Tell Officer Dunphy."', tone: 'straight', reply: 'I did. He wrote it down. He writes everything down. Then he has a sandwich.' },
      { label: '"Let the air out of his tires."', tone: 'sly', reply: 'I didn\'t hear that. I\'ve thought it, but I didn\'t hear it.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. It\'s all over the window. They\'re saying nice things about you. I\'m letting them.', opts: [
      { label: '"Thank you for letting them, Dot."', tone: 'kind', reply: 'I don\'t let just anybody be talked about nicely. You can ask.' },
      { label: '"What exactly are they saying?"', tone: 'straight', reply: 'That you\'re all right. That\'s high praise on Water Street.' },
      { label: '"They\'d better."', tone: 'sharp', reply: 'They don\'t have to, you know. Nobody has to.' }] },
    down: { say: 'I heard about {quest}. Everyone at the window\'s heard. I\'d like to tell them something different. Give me something.', opts: [
      { label: '"Tell them I\'m sorry. Because I am."', tone: 'kind', reply: 'All right. I\'ll tell them. I\'ll tell them slowly, so it sinks in.' },
      { label: '"Tell them the truth. I got it wrong."', tone: 'straight', reply: 'That\'s harder to fry. I\'ll manage.' },
      { label: '"Tell them what you like."', tone: 'sharp', reply: 'I will. You won\'t like it.' }] }
  },
  mend: townMend({ say: 'Dot walks past the window, stops, and comes in without smiling.', label: 'Buy a clam roll and eat it at her window, where everyone can see', cost: 8, why: 'Ate humble pie at Dot\'s window. And a clam roll',
    yes: 'Everyone saw. That was the point. All right. We\'re talking.', no: 'Suit yourself. The window\'s always open. I\'m not, today.' }),
  title: 'Frank\'s Oyster Knife', endings: { given: 'Back in the Drawer', ticket: 'Six Dollars, as Agreed', sold: 'Sold to a Collector' },
  steps: [
    async (a, t) => {
      await say(a, 'My Frank pawned his oyster knife here in 1998. Fishing was bad that winter. He never came back for it. He meant to.');
      await narrate('She puts a pawn ticket on the counter, soft as cloth. Odile\'s handwriting: "F. Haskell. Oyster knife, Dexter. $6."');
      await say(a, 'He passed in 2003. I just want to know if it\'s still here. Odile never threw anything out.');
      const i = await respond(a, 'dot', [
        { label: '"I\'ll look in the back."', tone: 'kind' },
        { label: '"Leave the ticket with me."', tone: 'straight' },
        { label: '"A ticket that old doesn\'t count any more."', tone: 'sharp' }
      ]);
      t.f.ticket = true;
      await say(a, ['Thank you. Take your time. It\'s been twenty-eight years. It can be twenty-eight years and a day.', 'Mind it. It\'s the only thing I have in his handwriting. Well. Odile\'s handwriting. His name.', 'No. I suppose it doesn\'t. Odile kept it anyway.'][i]);
      const p = await respond(a, 'dot', [
        { label: '"What was Frank like?"', tone: 'kind', save: 'frank' },
        { label: '"I\'ll let you know what I find."', tone: 'straight' }
      ]);
      await say(a, ['Big hands. Bad jokes. He sang to the oysters. He said they opened up just to make him stop.', 'Do. I walk past every morning. You know where I am.'][p]);
    },
    async (a, t) => {
      await narrate('In the back, in a cigar box marked "1998, NOT YET": a short knife with a worn wooden handle. DEXTER, RUSSELL on the blade.');
      await say(a, 'Oh. That\'s it. That\'s his. He used to open oysters with it on the porch and give me every second one.');
      t.f.found = true;
      const i = await respond(a, 'dot', [
        { label: '"Do you want to hold it?"', tone: 'kind' },
        { label: '"It\'s in decent shape. Odile oiled it."', tone: 'straight' },
        { label: '"It\'s just a knife, Dot."', tone: 'sharp' }
      ]);
      await say(a, ['She weighs it in both hands. "It\'s lighter than I remember. Everything is."', 'She did? Course she did. She looked after things. That was the whole of Odile.', 'It is. And a ticket\'s just paper. And I\'m just a woman with a fryer.'][i]);
      await say(a, 'There\'s a man who comes to the Shack who collects these. He told me once a 1920s Dexter goes for eighty. I don\'t care about that. I\'m just telling you because you\'d find out.');
      const p = await respond(a, 'dot', [
        { label: '"Thank you for telling me."', tone: 'kind', save: 'trusted' },
        { label: '"Eighty, you said?"', tone: 'sly', sway: -1, save: 'eighty' }
      ]);
      await say(a, ['That\'s all right. It\'s what Frank would have done. He was honest to a fault. The fault was money.', 'Eighty. That\'s what I said.'][p]);
    },
    async (a, t) => {
      if (said('dot', 'frank') && isFriend('dot', 'warm')) await say(a, 'You asked what Frank was like. Nobody asks about him any more. I\'ve been thinking about that all week.');
      await say(a, 'So. Frank\'s knife. What do I owe you?');
      const i = await choose(['"Nothing. Take it home."', '"Six dollars. The ticket\'s the ticket."', '"I\'ve had an offer of $80 from your collector."']);
      if (i === 0) { t.end = 'given'; change('rep', 6); await say(a, 'You\'re Odile\'s all right. Lunch is on me till the frost. Don\'t argue with a woman holding a knife.'); }
      else if (i === 1) { t.end = 'ticket'; change('coin', 6, 'Dot redeemed Frank\'s oyster knife'); change('rep', 3); await say(a, 'Six dollars. As agreed in 1998. Frank would laugh. He\'d laugh for a week.'); }
      else { t.end = 'sold'; change('coin', 80, 'Sold Frank Haskell\'s oyster knife to a collector'); change('rep', -6); await say(a, said('dot', 'trusted') ? 'I told you because I trusted you. That\'s my mistake, not Frank\'s. I\'ll wave tomorrow. I might not mean it.' : 'Well. That\'s business. I\'ll wave tomorrow. I might not mean it.'); }
    }
  ],
  epilogue: { given: 'Frank Haskell\'s oyster knife is back in Dot\'s kitchen drawer. Your lunch at the Clam Shack is free until the frost.', ticket: 'Dot Haskell redeemed a 1998 pawn ticket for six dollars and tells everyone about it.', sold: 'Frank Haskell\'s oyster knife is in a collector\'s case. Dot still waves at your window, most days.' }
});

addRegular('ruthie', {
  name: 'Ruthie Kroll', place: 'the Rusty Anchor', topic: 'music, trivia night, and the Anchor\'s regulars',
  look: { skin: '#f0c8a8', hair: '#e8e0d0', hs: 1, coat: '#7a3a6a', style: 'jacket', trim: '#e8c040', long: true, pants: '#2a2a30', glasses: '#2a2a2e' },
  meet: 'Ruthie Kroll. I host trivia at the Rusty Anchor on Thursdays, and the open mic when they let me. Forty-one years in show business. Mostly the business.',
  chat: ['Trivia this week is "Boats, and Other Boats". I write the questions. I don\'t know the answers.', 'The bell over the Anchor\'s bar is off the Prudence Gale. Nobody rings it.', 'Odile was on the trivia team that never won. They were called "Second Hand". She named it.'],
  // Ruthie likes a quip back, and goes cold at a sharp one
  small: [
    { say: 'Trivia this week is "Boats, and Other Boats". I write the questions. I don\'t know the answers.', opts: [
      { label: '"Give me one."', tone: 'wry', reply: 'What\'s the difference between a boat and a ship? About forty thousand dollars. That\'s not the official answer.' },
      { label: '"Then who checks them?"', tone: 'straight', reply: 'The bartender. He\'s never wrong, because he\'s the bartender.' },
      { label: '"Sounds dull."', tone: 'sharp', reply: 'It is dull. That\'s why there\'s beer. Honestly.' }] },
    { say: 'The bell over the Anchor\'s bar is off the Prudence Gale. Nobody rings it.', opts: [
      { label: '"What happens if somebody does?"', tone: 'straight', reply: 'The last man who rang it moved to Ohio the next week. Coincidence. Probably.' },
      { label: '"Dare me?"', tone: 'wry', reply: 'Over my dead body. At my age, that\'s not a long wait, so be patient.' },
      { label: '"Superstitious nonsense."', tone: 'sharp', reply: 'Then ring it. Go on. I\'ll look up flights to Ohio.' }] },
    { say: 'Odile was on the trivia team that never won. They were called "Second Hand". She named it.', opts: [
      { label: '"Who else was on it?"', tone: 'straight', reply: 'Odile, Father Ignatius, a man called Denny and a dog called Admiral. The dog was best on sport.' },
      { label: '"Second\'s honest, at least."', tone: 'wry', reply: 'That\'s what she said. Every week. Through her teeth.' },
      { label: '"I\'d have named it better."', tone: 'sharp', reply: 'You wouldn\'t. Nobody ever has.' }] },
    { say: 'Open mic Saturday. A man played the spoons for twenty minutes. Twenty. I timed it with a calendar.', opts: [
      { label: '"Was he any good?"', tone: 'straight', reply: 'For the first two minutes. Then he found a second gear. Nobody wanted a second gear.' },
      { label: '"I\'ll bring my own spoons next week."', tone: 'wry', reply: 'Bring forks. Forks would be new.' },
      { label: '"Ban him."', tone: 'sharp', reply: 'It\'s an open mic. That\'s the tragedy of it.' }] },
    { say: 'Forty-one years in show business. I once opened for a man who opened for a very famous crooner. In Fall River.', opts: [
      { label: '"What was he like?"', tone: 'straight', reply: 'Short. Kind. Lifts in his shoes. He tipped the cloakroom girl twenty dollars, and she was me.' },
      { label: '"Sing me something."', tone: 'wry', reply: 'She hums two bars of something with a key change in it. "There. That\'s ten dollars at the door, normally."' },
      { label: '"Show business is dead."', tone: 'sharp', reply: 'So I\'ve heard. I\'m still in it. I\'m very hard to kill.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. The Anchor\'s been toasting you. Not by name. They don\'t know your name. "That shop."', opts: [
      { label: '"Tell them it\'s the Crooked Scale. Spelled with a K."', tone: 'wry', reply: 'It\'s spelled with a C. I\'ll tell them it\'s a K. Nobody checks.' },
      { label: '"Tell them thanks."', tone: 'kind', reply: 'I\'ll tell them. They\'ll toast that too. They toast anything.' },
      { label: '"Toasts don\'t buy stock."', tone: 'sharp', reply: 'No. They\'re free. That\'s what makes them toasts.' }] },
    down: { say: 'I heard about {quest}. The Anchor\'s talking. I\'ve been on stage forty-one years and I know what a room sounds like when it\'s turned.', opts: [
      { label: '"Then I need a better second act."', tone: 'wry', reply: 'You do. Everybody gets one. Make it shorter than the spoons man.' },
      { label: '"I got it wrong. I know."', tone: 'straight', reply: 'Good. The room likes that. Rooms are softer than people think.' },
      { label: '"I don\'t perform for the Anchor."', tone: 'sharp', reply: 'Everybody performs for the Anchor. You\'re just doing it badly.' }] }
  },
  mend: townMend({ say: 'Ruthie comes in, puts her bag on the counter and waits with the face she uses for hecklers.', label: 'Buy a round at the Anchor in the shop\'s name', cost: 15, why: 'Bought a round at the Rusty Anchor',
    yes: 'In the shop\'s name. They\'ll drink to you whether they like you or not. That\'s the beauty of a round.', no: 'Fine. I\'ve played tougher rooms. One, in Fall River.' }),
  title: 'Trivia Night', endings: { champions: 'Trivia Champions', close: 'Second Place', noShow: 'Never Showed' },
  steps: [
    async (a, t) => {
      await say(a, 'Trivia needs a prize this month. Something from a real shop. Something with a story. The last prize was a gift card to a tanning salon in Kingston.');
      const r = await respond(a, 'ruthie', [
        { label: '"A tanning salon\'s got a story."', tone: 'wry' },
        { label: '"What sort of thing do you want?"', tone: 'straight' },
        { label: '"I\'m not a charity, Ruthie."', tone: 'sharp' }
      ]);
      await say(a, ['It\'s got a warning, is what it\'s got.', 'Something people want to touch. A thing you\'d pick up off the table without asking.', 'Nobody said charity. I said prize. Prize is a much nicer word.'][r]);
      const opts = townTakeFromStock(it => it.guide <= 60).slice(0, 2);
      const i = await choose([...opts.map(it => ({ label: `Donate the ${it.name.toLowerCase()}`, hint: `(guide ${money(it.guide)})` })), { label: 'Donate $10 toward a prize', disabled: S.coin < 10 }, 'Not this month']);
      if (i < opts.length) { S.stock = S.stock.filter(x => x !== opts[i]); renderPanel(); t.f.donated = true; change('rep', 3); await say(a, 'Perfect. I\'ll say it\'s from the Crooked Scale, and I\'ll make up a story if it hasn\'t got one.'); }
      else if (i === opts.length) { change('coin', -10, 'Donated to the Rusty Anchor trivia prize'); t.f.donated = true; change('rep', 1); await say(a, 'Ten dollars. I\'ll buy something with a story. Or a story.'); }
      else await say(a, 'Next month, then. The tanning salon is very keen.');
    },
    async (a, t) => {
      await say(a, 'The shop should have a team. Odile\'s team was "Second Hand". They came second in 1996 and never got over it.');
      const i = await respond(a, 'ruthie', [
        { label: '"Put us down. Second Hand rides again."', tone: 'wry', save: 'team' },
        { label: '"Is there a prize for second?"', tone: 'sly', save: 'team' },
        { label: '"I\'m no good at trivia."', tone: 'straight' }
      ]);
      t.f.team = i !== 2;
      await say(a, ['Thursday night. Bring a pencil. Bring a better pencil than that.', 'There\'s a prize for second. It\'s called dignity. Thursday. I\'ll put you down.', 'Nobody\'s good at trivia. That\'s what the beer\'s for.'][i]);
      if (t.f.team) {
        await say(a, 'Who\'s on the team? Odile had three people and a dog.');
        const p = await respond(a, 'ruthie', [
          { label: '"The cat. She\'s good on fish."', tone: 'wry' },
          { label: '"Just me."', tone: 'straight' }
        ]);
        await say(a, ['Cats are allowed. Dogs are allowed. One year we had a parrot. It cheated.', 'Bold. A team of one. If you lose, you can\'t blame anybody. That\'s the worst kind.'][p]);
      }
    },
    async (a, t) => {
      if (!t.f.team) {
        t.end = 'noShow'; await say(a, 'Trivia was Thursday. You weren\'t there. The tanning salon won. I don\'t want to talk about it.');
        const p = await respond(a, 'ruthie', [
          { label: '"Next time, Ruthie. Save me a seat."', tone: 'wry' },
          { label: '"I\'m sorry I let you down."', tone: 'kind' },
          { label: '"It\'s only trivia."', tone: 'sharp' }
        ]);
        await say(a, ['I always save a seat. Ask Odile\'s. It\'s still there.', 'You didn\'t let me down. You let the tanning salon win. There\'s a difference. A small one.', 'Only trivia. Forty-one years in show business and that\'s what they say.'][p]);
        return;
      }
      await say(a, 'Last night\'s tiebreaker, since you left before it: what\'s the name of the boat whose bell hangs over the Anchor\'s bar?');
      // warm: Ruthie can't give the answer, but she can look at the ceiling
      if (isFriend('ruthie', 'warm')) await narrate('Ruthie, very slowly and for no reason at all, looks up.');
      const i = await choose(['"The Prudence Gale."', '"The Margaret Ruth."', '"The Second Hand."']);
      if (i === 0) {
        t.end = 'champions'; change('coin', 40, 'Won the Rusty Anchor trivia pot'); change('rep', 3); await say(a, 'The Prudence Gale. Second Hand wins. First place. Odile would have stood on a chair.');
        const p = await respond(a, 'ruthie', [
          { label: '"I\'ll stand on one for her."', tone: 'wry' },
          { label: '"Luck, mostly."', tone: 'straight' }
        ]);
        await say(a, ['Not on my chairs. They\'re older than me and less steady.', 'Luck is most of trivia. The rest is having been to the bar.'][p]);
      } else {
        t.end = 'close'; await say(a, 'The Prudence Gale. It\'s over the bar. You\'ve looked at it. Second place, then. Odile would understand. Too well.');
        const p = await respond(a, 'ruthie', [
          { label: '"Second Hand, second place. Tradition."', tone: 'wry' },
          { label: '"That question was rigged."', tone: 'sharp' }
        ]);
        await say(a, ['Tradition. I\'ll put it on the sign.', 'It was. I rigged it. To be easy. Good night.'][p]);
      }
    }
  ],
  epilogue: { champions: 'Second Hand, the Crooked Scale\'s trivia team, won the Rusty Anchor\'s trivia night. Ruthie had the name engraved on a bell that nobody rings.', close: 'Second Hand came second at trivia, as tradition demands.', noShow: 'Ruthie Kroll keeps a seat for the Crooked Scale at trivia. The tanning salon keeps winning.' }
});

addRegular('orsolya', {
  name: 'Madame Orsolya', place: 'her parlor at the end of the boardwalk', topic: 'anything uncanny',
  look: { skin: '#d8b8a0', hair: '#2a1e2a', hs: 1, coat: '#6a2a4a', trim: '#e2b04a', hat: 'wide', hatc: '#2a1a2a', band: '#e2b04a', style: 'dress', glasses: '#141416' },
  meet: 'Madame Orsolya. The parlor at the end of the boardwalk, open all winter. Most of what I see is nonsense. I\'m right about one thing a week.',
  chat: ['The cards say you will meet a stranger. You run a shop. The cards are lazy this week.', 'Your cat looked at me through the window. I looked away first. I always do.', 'Odile never let me read her palm. She said she already knew how it ended.'],
  // Orsolya likes kindness; a flat, sensible answer is the one thing she can't forgive
  small: [
    { say: 'The cards say you will meet a stranger. You run a shop. The cards are lazy this week.', opts: [
      { label: '"Read them again, for me."', tone: 'kind', reply: 'She turns one over. "Be nice to the woman with the cards." Well. There it is.' },
      { label: '"Maybe they mean a strange stranger."', tone: 'wry', reply: 'In this town, that narrows it down to everyone.' },
      { label: '"They\'re just printed card."', tone: 'straight', reply: 'So is money, and you take that very seriously.' }] },
    { say: 'Your cat looked at me through the window. I looked away first. I always do.', opts: [
      { label: '"She likes you. That\'s how she shows it."', tone: 'kind', reply: 'Then I\'m honored. And still not looking.' },
      { label: '"Who taught her that?"', tone: 'wry', reply: 'Odile. Or the other way around.' },
      { label: '"She looks at everyone like that."', tone: 'straight', reply: 'She does not. Look again.' }] },
    { say: 'Odile never let me read her palm. She said she already knew how it ended.', opts: [
      { label: '"Did she?"', tone: 'kind', reply: 'I think so. I think she was at peace with the ending and curious about the middle.' },
      { label: '"Would you read mine?"', tone: 'wry', reply: 'Not today. Today your palm is in a bad mood.' },
      { label: '"Nobody knows how it ends."', tone: 'straight', reply: 'Everybody knows how it ends. The trick is the order.' }] },
    { say: 'A woman asked me last week if her husband would come home. I said yes. He did. With a canoe. I didn\'t see the canoe.', opts: [
      { label: '"You were right, though. That\'s lovely."', tone: 'kind', reply: 'It was lovely. Not for the canoe. It\'s in the living room.' },
      { label: '"Lucky guess."', tone: 'straight', reply: 'All guesses are lucky if you make enough of them. That isn\'t what I do. Mostly.' },
      { label: '"Can you see the next canoe?"', tone: 'wry', reply: 'I see a kayak. It\'s none of your business.' }] },
    { say: 'Last night the boardwalk lights went out at midnight. All of them. Then they came back one at a time from the far end. Like somebody walking.', opts: [
      { label: '"Were you frightened?"', tone: 'kind', reply: 'Yes. I always am. It\'s polite.' },
      { label: '"Who walks the boardwalk at midnight?"', tone: 'wry', reply: 'Me. And one other. We don\'t speak.' },
      { label: '"Bad wiring."', tone: 'straight', reply: 'Hal Mayhew said so too. Then he went very quiet and asked to go home.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I didn\'t need to. I saw it in the tea leaves on Tuesday. Then somebody told me.', opts: [
      { label: '"Thank you for looking out for me."', tone: 'kind', reply: 'Somebody has to. The cat can only do so much.' },
      { label: '"What else did the tea say?"', tone: 'wry', reply: 'That you\'d ask. And to drink less coffee.' },
      { label: '"Tea leaves are just tea."', tone: 'straight', reply: 'Then I\'ll stop telling you what\'s in them.' }] },
    down: { say: 'I heard about {quest}. The cards turned up the Tower three times this week. I don\'t like to say I told you so. I didn\'t tell you, so I can\'t.', opts: [
      { label: '"I\'m sorry. Tell me how to put it right."', tone: 'kind', reply: 'You\'ve started. That\'s the only part the cards can\'t do for you.' },
      { label: '"The Tower again? Rearrange the deck."', tone: 'wry', reply: 'I did. It came back up. It does that.' },
      { label: '"I don\'t believe in cards."', tone: 'straight', reply: 'They believe in you. That\'s worse.' }] }
  },
  mend: townMend({ say: 'Madame Orsolya comes in, sits on the chair by the door, and holds out her hand, palm up. She\'s asking for yours.', label: 'Let her read your palm, and listen to all of it', cost: 5, why: 'Paid Madame Orsolya for a palm reading',
    yes: 'There. A long life line. A short temper line, getting longer. Don\'t let it.', no: 'Another day. Your hand will still be there. Probably.' }),
  title: 'The Crystal Ball', endings: { redeemed: 'Twenty Dollars', market: 'Market Price', kept: 'It Isn\'t Glass' },
  steps: [
    async (a, t) => {
      await say(a, 'Years ago I pawned my grandmother\'s crystal ball to Odile. Twenty dollars. The one I use now is a fishbowl from the garden center. The fish is in a jar. He\'s fine.');
      await say(a, 'Give me your hand.');
      const i = await respond(a, 'orsolya', [
        { label: 'Give her your hand', tone: 'kind', save: 'hand' },
        { label: '"What\'s it cost?"', tone: 'sly' },
        { label: '"I\'ll keep my hands, thanks."', tone: 'straight' }
      ]);
      await say(a, ['A long life line. A short patience line. A small cut from a box knife. That last one isn\'t prophecy, it\'s a Band-Aid.', 'For you, nothing. The first one is always free. Like the fishbowl.', 'Then I\'ll read the counter. Counters are honest. They can\'t pull away.'][i]);
      await say(a, 'Hm. There\'s something heavy in your back room, wrapped in velvet. You\'ll find it on a quiet day.');
      const p = await respond(a, 'orsolya', [
        { label: '"I\'ll look for it. I promise."', tone: 'kind' },
        { label: '"There\'s nothing back there but mops."', tone: 'straight' },
        { label: '"How quiet a day?"', tone: 'wry' }
      ]);
      await say(a, ['Don\'t look. Find. It\'s different.', 'Mops. Yes. And behind the mops?', 'Quiet enough to hear the clock. Agathe says it\'s slow. I say it\'s in no hurry.'][p]);
      t.f.asked = true;
    },
    async (a, t) => {
      await narrate('A quiet morning. In the back, behind a mop that predates you, something heavy wrapped in purple velvet: a ball of clear rock crystal the size of a grapefruit.');
      await say(a, 'You found it. I said you would. I\'m right about one thing a week, and this week it\'s this.');
      await say(a, 'That\'s quartz, you know, not glass, and older than the building. The wrong sort of person would pay a great deal for it. Are you the wrong sort of person?');
      const i = await respond(a, 'orsolya', [
        { label: '"I hope not."', tone: 'kind', save: 'hope' },
        { label: '"Aren\'t you supposed to know?"', tone: 'wry' },
        { label: '"Depends what it\'s worth."', tone: 'straight', save: 'worth' }
      ]);
      await say(a, ['Hope is a good answer. It\'s the only honest one, really.', 'I know. I want to hear you say it.', 'There it is. Plain as a fishbowl.'][i]);
      t.f.found = true;
    },
    async (a, t) => {
      if (said('orsolya', 'hope') && isFriend('orsolya', 'warm')) await say(a, 'You said you hoped you weren\'t the wrong sort. I\'ve been holding you to it. Gently. Like a crystal.');
      await say(a, 'I have the ticket. Twenty dollars, as it says. Or do we talk about what it\'s worth?');
      const i = await choose(['"Twenty dollars. The ticket\'s the ticket."', '"It\'s rock crystal. $150."', '"I think I\'ll keep it."']);
      if (i === 0) { t.end = 'redeemed'; change('coin', 20, 'Madame Orsolya redeemed her crystal ball'); change('rep', 4); await say(a, 'Here is one true thing, free: be kind to the next person who sells you something they love. It comes back. That one\'s free because it isn\'t a prophecy.'); }
      else if (i === 1) { t.end = 'market'; change('coin', 150, 'Sold Madame Orsolya her crystal ball'); await say(a, said('orsolya', 'worth') ? 'You did say it depended on what it was worth. A hundred and fifty. At least you warned me.' : 'A hundred and fifty. Odile would have done the same. No. She wouldn\'t. Here.'); }
      else {
        t.end = 'kept';
        const it = townItem({ name: 'Rock crystal ball', icon: 'amber', cat: 'curio', guide: 260, condLabel: 'Flawless', clue: 'Clear quartz, a grapefruit\'s size. Look into it long enough and the shop looks back.' });
        it.paid = 0; giveItem(it, true); change('rep', -6);
        await say(a, 'Keep it, then. Look into it some night. You won\'t like what\'s looking back, but you\'ll have earned it.');
      }
    }
  ],
  epilogue: { redeemed: 'Madame Orsolya reads fortunes in her grandmother\'s crystal ball again, and the fish has his bowl back.', market: 'Madame Orsolya paid market price for her own crystal ball. She says your future is "expensive".', kept: 'A rock crystal ball sits on your shelf. On quiet nights it fogs over, though it isn\'t glass.' }
});

addRegular('agathe', {
  name: 'Agathe Moss', place: 'Moss Clock Repair on Water Street', topic: 'clocks, watches and anything that ticks or ought to',
  look: { skin: '#d8b090', hair: '#d0d0d0', hs: 3, coat: '#8a6a3a', trim: '#e8e0c8', style: 'jacket', long: true, pants: '#2a2a2a', glasses: '#2a2a2e' },
  meet: 'Agathe Moss. Moss Clock Repair, Water Street. My father\'s shop. I keep it four minutes fast, out of respect.',
  chat: ['Your shop clock is four minutes slow. Odile never let anyone touch it. I know why now. I won\'t say.', 'Benji, my apprentice, has taken a cuckoo clock apart six times. It is still a cuckoo clock.', 'Everybody\'s watch is on their phone. I fix the ones that aren\'t.'],
  // Agathe likes it straight; she has no patience for a joke
  small: [
    { say: 'Your shop clock is four minutes slow. Odile never let anyone touch it. I know why now. I won\'t say.', opts: [
      { label: '"Is it a good reason?"', tone: 'straight', reply: 'Yes. That much I\'ll say. It\'s a good reason.' },
      { label: '"So I\'m four minutes early for everything."', tone: 'wry', reply: 'No. You\'re late. Everybody is. That\'s not a joke.' },
      { label: '"Fix it, then."', tone: 'sharp', reply: 'No. It isn\'t mine to fix. Or yours, yet.' }] },
    { say: 'Benji, my apprentice, has taken a cuckoo clock apart six times. It is still a cuckoo clock.', opts: [
      { label: '"Is he any good?"', tone: 'straight', reply: 'Good hands. Bad attention span. Like a cuckoo.' },
      { label: '"Give him time."', tone: 'kind', reply: 'I give him nothing but time. It\'s all I sell.' },
      { label: '"Maybe the cuckoo\'s winning."', tone: 'wry', reply: 'It isn\'t a contest. It\'s a clock.' }] },
    { say: 'Everybody\'s watch is on their phone. I fix the ones that aren\'t.', opts: [
      { label: '"Do you own a phone?"', tone: 'straight', reply: 'Yes. It\'s in a drawer. I wind it on Sundays. That was nearly a joke. Don\'t encourage me.' },
      { label: '"Phones don\'t tick. That\'s sad."', tone: 'kind', reply: 'Phones don\'t need me. That\'s what\'s sad.' },
      { label: '"Time\'s time."', tone: 'wry', reply: 'It isn\'t. Ask anyone who\'s waited for something.' }] },
    { say: 'A man brought me a watch that stopped the hour his father died. He wants it fixed. He wants it left. He\'s coming back Thursday to decide.', opts: [
      { label: '"What will you tell him?"', tone: 'straight', reply: 'That I can do either. Then I\'ll stop talking. It\'s his watch.' },
      { label: '"Poor man."', tone: 'kind', reply: 'Yes. He looked at it like it might start on its own.' },
      { label: '"Spooky."', tone: 'wry', reply: 'Spooky? It\'s a mainspring and a man.' }] },
    { say: 'Someone on the boardwalk is selling "antique" pocket watches. The movements are from 2019. I could tell from across the street.', opts: [
      { label: '"I\'ll turn them away if they come to me."', tone: 'straight', reply: 'Good. Look at the crown. If it\'s shiny and the case isn\'t, it\'s a liar.' },
      { label: '"What\'s he asking for them?"', tone: 'sly', reply: 'Too much. Don\'t even think about it.' },
      { label: '"From across the street? Show-off."', tone: 'wry', reply: 'It was a very narrow street.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. Good. Things done properly, in the right order. That\'s all a clock is, really.', opts: [
      { label: '"It needed doing properly."', tone: 'straight', reply: 'Yes. Most things do. Most people don\'t.' },
      { label: '"Thank you, Agathe."', tone: 'kind', reply: 'Don\'t thank me. I didn\'t do it.' },
      { label: '"Tick tock."', tone: 'wry', reply: 'Please don\'t.' }] },
    down: { say: 'I heard about {quest}. My father used to say a man shows you who he is when the clock\'s against him. I\'m told yours was.', opts: [
      { label: '"I got it wrong. I won\'t again."', tone: 'straight', reply: 'Don\'t promise. Do. Promises are for people who sell watches on the boardwalk.' },
      { label: '"I\'m sorry I disappointed you."', tone: 'kind', reply: 'Don\'t be sorry for me. Be sorry about the thing.' },
      { label: '"Your father said a lot of things."', tone: 'wry', reply: 'He did. Most of them were right. Good day.' }] }
  },
  mend: townMend({ say: 'Agathe comes in and stands looking at your shop clock, not at you.', label: 'Have her clean and oil the shop clock, at her rate, without touching the hands', cost: 15, why: 'Paid Agathe Moss to clean the shop clock',
    yes: 'Done. Four minutes slow, still. I didn\'t touch the hands. I know why it\'s slow, and so do you, nearly.', no: 'Fine. It\'ll keep. Clocks are patient. I\'m less so.' }),
  title: 'The Last Clock', endings: { sold: 'Sold on Consignment', kept: 'Still Ticking', finished: 'Finished for Her' },
  steps: [
    async (a, t) => {
      await say(a, 'I\'ll be blunt. Most of what you sell that ticks, doesn\'t.');
      const r = await respond(a, 'agathe', [
        { label: '"Fair. What would you fix first?"', tone: 'straight' },
        { label: '"It ticks in spirit."', tone: 'wry' },
        { label: '"Don\'t insult my stock."', tone: 'sharp' }
      ]);
      await say(a, ['Whatever you\'d be ashamed to sell. That\'s usually the one that ticks the worst.', 'Spirit doesn\'t keep time.', 'Somebody has to. It\'s certainly not going to insult itself.'][r]);
      await say(a, 'I can fix one thing on your shelves. Anything that ticks, or turns, or ought to. Fifteen dollars. It\'ll come back better than it went.');
      const opts = townTakeFromStock(it => ['watch', 'musicbox', 'compass', 'spyglass', 'wristwatch'].includes(it.key) && it.cond < 3).slice(0, 2);
      const i = await choose([...opts.map(it => ({ label: `Have her fix the ${it.name.toLowerCase()} ($15)`, hint: `(${it.condLabel})`, disabled: S.coin < 15 })), 'Nothing needs fixing']);
      if (i < opts.length) {
        const it = opts[i];
        change('coin', -15, `Agathe Moss repaired a ${it.name.toLowerCase()}`);
        const up = Math.min(3, it.cond + 1);
        it.guide = Math.round(it.guide / CONDITIONS[it.cond].mult * CONDITIONS[up].mult); it.cond = up; it.condLabel = CONDITIONS[up].label; renderPanel();
        t.f.fixed = true;
        await say(a, `There. ${CONDITIONS[up].label}. I'll have Benji bring it back. Don't let him wind it.`);
      } else await say(a, 'Nothing? Look at that clock on your wall and say that again. No, don\'t. Leave it.');
    },
    async (a, t) => {
      await say(a, 'My father\'s last clock. A mantel clock he never finished. The case is done. The movement is in a biscuit tin. Thirty-one years in a biscuit tin.');
      const r = await respond(a, 'agathe', [
        { label: '"Why have you never finished it?"', tone: 'straight' },
        { label: '"That must be hard, Agathe."', tone: 'kind' },
        { label: '"Everything in my shop is unfinished."', tone: 'wry' }
      ]);
      await say(a, ['Because then it\'s finished. And so is he.', 'It\'s a clock. You wind it every morning, and it\'s there.', 'Your shop is a shop. This is a clock.'][r]);
      await say(a, 'Would you sell it for me? Consignment. Somebody in this town should want a clock that was never finished.');
      const i = await respond(a, 'agathe', [
        { label: '"I\'ll put it in the window."', tone: 'kind' },
        { label: '"You should finish it, Agathe."', tone: 'straight', save: 'urged' }
      ]);
      t.f.consign = i === 0;
      if (i === 0) {
        const it = townItem({ name: 'Moss mantel clock (unfinished)', icon: 'watch', cat: 'curio', guide: 120, condLabel: 'Unfinished', clue: 'Walnut case, brass bezel, no hands. "A.M. - for when you\'re ready" pencilled inside the back door.' });
        it.consigned = 'agathe'; giveItem(it, true);
        await say(a, 'Thank you. Don\'t tell me when it sells. Tell me after.');
      } else await say(a, 'Finish it. Hm. That\'s what he said too. He said it every night for a year.');
    },
    async (a, t) => {
      const clock = S.stock.find(x => x.consigned === 'agathe');
      if (t.f.consign && !clock) { t.end = 'sold'; await say(a, 'You sold it. Good. Somebody has a clock with no hands on their mantel. That\'s the most honest clock in Hollow Neck.'); change('rep', 3); return; }
      if (t.f.consign && clock) {
        if (isFriend('agathe', 'warm')) await say(a, 'I keep walking past it. I don\'t know what I want you to do. I think I want you to tell me.');
        const i = await choose(['Give the clock back to her to finish', 'Keep it in the window a while longer']);
        if (i === 0) { S.stock = S.stock.filter(x => x !== clock); renderPanel(); t.end = 'finished'; change('rep', 5); await say(a, 'You\'re right. It\'s mine to finish. Come by Water Street in a month. It\'ll be four minutes fast.'); }
        else { t.end = 'kept'; await say(a, 'Leave it. It\'s nice seeing it from the street. Like he\'s working late.'); }
        return;
      }
      t.end = 'finished'; change('rep', 4);
      await say(a, said('agathe', 'urged') ? 'You told me to finish it. So I did. My father\'s clock. It runs four minutes fast. Of course it does.' : 'I finished it. My father\'s clock. It runs four minutes fast. Of course it does.');
      const p = await respond(a, 'agathe', [
        { label: '"Can I come and see it?"', tone: 'straight' },
        { label: '"He\'d be proud of you."', tone: 'kind' },
        { label: '"Four minutes fast. Out of respect."', tone: 'wry' }
      ]);
      await say(a, ['Yes. Come at four minutes to the hour. You\'ll be on time.', 'He\'d be checking my bushings. That\'s the same thing, with him.', 'Yes. Exactly that. It\'s just right.'][p]);
    }
  ],
  epilogue: { sold: 'Somebody in Hollow Neck has a handless mantel clock on their shelf, made by Ezra Moss and never finished.', kept: 'An unfinished Moss mantel clock sits in your window. Agathe walks past it on her way home.', finished: 'Agathe Moss finished her father\'s last clock. It sits in her window on Water Street, four minutes fast.' }
});

addRegular('bev', {
  name: 'Bev Santos', place: 'Pinwheel Lanes on Route 9', topic: 'games, bets, leagues and the arcade',
  look: { skin: '#c89070', hair: '#5a3a2a', hs: 3, coat: '#2a5aa0', style: 'tee', pants: '#2a2a30', glasses: '#2a2a2e' },
  meet: 'Bev Santos. I run the snack bar at Pinwheel Lanes and captain Harbor Spares. Candlepin. Skinny pins. Real bowling.',
  chat: ['Candlepin is ten pins and three balls and no mercy. Come down on a Tuesday.', 'Odile bowled a 128 in 1993. It\'s still on the wall. Nobody\'s beaten it in her lane.', 'Whatever the bet is, I\'ll take the other side.'],
  // Bev likes a crack and an angle; being handled gently makes her itch
  small: [
    { say: 'Candlepin is ten pins and three balls and no mercy. Come down on a Tuesday.', opts: [
      { label: '"Bet I break ninety."', tone: 'sly', reply: 'Five bucks says you don\'t break seventy. Tuesday. Bring the five.' },
      { label: '"What\'s the trick?"', tone: 'straight', reply: 'Throw it hard and pray. You get three balls a frame. You\'ll need all three.' },
      { label: '"Sounds hard on the arms. Look after yourself."', tone: 'kind', reply: 'I\'ve been bowling forty years. My arms look after me.' }] },
    { say: 'Odile bowled a 128 in 1993. It\'s still on the wall. Nobody\'s beaten it in her lane.', opts: [
      { label: '"I\'ll take that record."', tone: 'sly', reply: 'Ha. Even money says you won\'t. I\'ll hold the stakes.' },
      { label: '"Is 128 good?"', tone: 'straight', reply: 'In candlepin? 128 is a miracle with a pencil behind its ear.' },
      { label: '"Leave it up for her."', tone: 'kind', reply: 'I wasn\'t going to take it down. I\'m not a monster. I just like to see people try.' }] },
    { say: 'Whatever the bet is, I\'ll take the other side.', opts: [
      { label: '"The sun comes up tomorrow."', tone: 'wry', reply: 'Other side. Fog\'s due. You\'ll never see it.' },
      { label: '"I bet you can\'t walk past a bet."', tone: 'sly', reply: 'Taken. Wait. Damn.' },
      { label: '"Gambling\'s a slippery thing, Bev."', tone: 'kind', reply: 'So\'s a lane. I\'ve been on both for forty years. I\'m fine.' }] },
    { say: 'The claw machine at the lanes hasn\'t paid out since 2009. Kids still try. That\'s hope. Or that\'s arithmetic.', opts: [
      { label: '"Is it rigged?"', tone: 'straight', reply: 'It\'s a claw machine. Rigged is the factory setting.' },
      { label: '"Want to split the take?"', tone: 'sly', reply: 'Ha. The take is eleven dollars in quarters and a lot of sticky. You can have the sticky.' },
      { label: '"Those poor kids."', tone: 'kind', reply: 'Don\'t poor them. They\'re learning. It\'s cheaper than college.' }] },
    { say: 'League night got rained out. Bowling. Indoors. The roof leaks onto lane three.', opts: [
      { label: '"Bowl round it. Call it a water hazard."', tone: 'wry', reply: 'That\'s golf. But I\'m stealing it.' },
      { label: '"Hal Mayhew could patch that."', tone: 'straight', reply: 'Hal\'s patched it six times. The roof\'s winning.' },
      { label: '"Oh no, that\'s awful."', tone: 'kind', reply: 'It\'s a leak, not a funeral. Although there was a funeral home team on lane three. They took it well.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I had money on you. Not much. Enough to buy you a hot dog. Come and get it.', opts: [
      { label: '"What were the odds?"', tone: 'sly', reply: 'Four to one. Against. Don\'t take it personally. Take the hot dog.' },
      { label: '"With mustard."', tone: 'wry', reply: 'Mustard. Somebody after my own heart. Shaped like Rhode Island.' },
      { label: '"That\'s sweet of you, Bev."', tone: 'kind', reply: 'It isn\'t sweet. It\'s a hot dog.' }] },
    down: { say: 'I heard about {quest}. I had money on you. I lost it. I don\'t like losing.', opts: [
      { label: '"Double or nothing on the next one?"', tone: 'sly', reply: 'Ha. Now you\'re talking my language. All right. You\'re on.' },
      { label: '"Bet on me again. I\'ll do better."', tone: 'wry', reply: 'Everyone says that. Sometimes it\'s true. I\'ll think about it.' },
      { label: '"I\'m so sorry about your money."', tone: 'kind', reply: 'Don\'t be sorry about the money. Be sorry about how I lost it.' }] }
  },
  mend: townMend({ say: 'Bev comes in, slaps a five-dollar bill on the counter and leaves her hand on it. "You know what this is."', label: 'Match it. A bet on yourself, double or nothing', cost: 5, why: 'Matched Bev\'s five-dollar bet',
    yes: 'There it is. Money on the table. Now I believe you. We\'re square.', no: 'Didn\'t think so. She takes the five back.' }),
  title: 'The Pinsetter', endings: { saved: 'Lanes Open', sponsor: 'The Crooked Scales', closed: 'Closed for Winter' },
  steps: [
    async (a, t) => {
      await say(a, 'Pinwheel\'s pinsetter on lane eight died. The part\'s from 1971 and so is everything that knows how to fit it. The owner wants to close for the winter.');
      const i = await respond(a, 'bev', [
        { label: '"How much do you need?"', tone: 'straight' },
        { label: '"Bet you can\'t raise it."', tone: 'sly', save: 'bet' },
        { label: '"Oh, Bev. I\'m sorry."', tone: 'kind' }
      ]);
      await say(a, ['Four hundred. I\'ve got nineteen league shirts at twenty each. You do the math. I did. Then I sat down.', 'Five bucks says I do. Shake on it.', 'Don\'t be sorry. Buy a shirt.'][i]);
      await say(a, 'I\'m selling the league shirts from the back to pay for it. This one\'s from 1971. Champions. It\'s got a mustard stain shaped like Rhode Island.');
      t.f.shirt = await townBuy(a, townItem({ name: 'Pinwheel Lanes champions\' shirt, 1971', icon: 'purse', cat: 'curio', guide: 45, condLabel: 'Stained', clue: 'Rayon, chain-stitched "PINWHEEL CHAMPS 71" on the back. A mustard stain shaped like Rhode Island.' }), 20, 'Bought a 1971 bowling shirt from Bev');
    },
    async (a, t) => {
      await say(a, 'League\'s taking sponsors. Thirty dollars and a team gets your name on its shirts. The other teams are a funeral home and a septic company.');
      await say(a, 'Septic offered forty for naming rights. I told them thirty was the price. Don\'t tell them.');
      const i = await respond(a, 'bev', [
        { label: 'Sponsor a team ($30)', disabled: S.coin < 30 },
        { label: '"Make it twenty-five and you\'ve got a deal."', tone: 'sly', disabled: S.coin < 25 },
        { label: '"Not this season."', tone: 'straight' }
      ]);
      t.f.sponsor = i !== 2;
      if (t.f.sponsor) {
        change('coin', i === 1 ? -25 : -30, 'Sponsored a candlepin team');
        await say(a, i === 1 ? 'Twenty-five. You\'re a shark. I like sharks. The Crooked Scales it is. Sounds like we cheat.' : 'The Crooked Scales. I like it. Sounds like we cheat.');
        const p = await respond(a, 'bev', [
          { label: '"Gold shirts. Like the scales."', tone: 'wry' },
          { label: '"Black. We mean business."', tone: 'sly' },
          { label: '"Whatever\'s cheapest."', tone: 'straight' }
        ]);
        await say(a, ['Gold. We\'ll look like a trophy cabinet. A losing one.', 'Black. Intimidating. The septic company will wet itself. Professionally.', 'Cheapest is orange. Nobody wants orange. You\'re getting orange.'][p]);
      } else await say(a, 'Septic company it is, then. They\'re good. They practice.');
    },
    async (a, t) => {
      const score = (t.f.shirt ? 1 : 0) + (t.f.sponsor ? 1 : 0);
      if (said('bev', 'bet')) {
        await say(a, score ? 'Sold all nineteen shirts. You owe me five bucks.' : 'Didn\'t sell the shirts. I owe you five bucks. I hate this.');
        if (score && S.coin >= 5) change('coin', -5, 'Lost a five-dollar bet to Bev Santos');
        else if (!score) change('coin', 5, 'Won a five-dollar bet off Bev Santos');
      }
      if (score >= 2) {
        t.end = 'sponsor'; change('rep', 5); await say(a, 'The Crooked Scales came third, the pinsetter\'s fixed, and lane eight is open all winter. Your name\'s on the scoreboard. Spelled right, mostly.');
        if (isFriend('bev', 'warm')) await say(a, 'Come and bowl a frame for the team. Odile\'s lane. Nobody else gets Odile\'s lane.');
        const p = await respond(a, 'bev', [
          { label: '"Third. Next year, second."', tone: 'wry' },
          { label: '"Bet you we win it next year."', tone: 'sly' },
          { label: '"I\'m so proud of you all."', tone: 'kind' }
        ]);
        await say(a, ['Second. Aim low, you\'ll never be disappointed. That\'s the league motto.', 'Ha. Done. I\'ll hold the stakes. I always hold the stakes.', 'Proud. Hm. Don\'t make it weird. Bring a shirt.'][p]);
      } else if (score === 1) {
        t.end = 'saved'; change('rep', 2); await say(a, 'We scraped together enough for the pinsetter. Lane eight\'s back. It still eats one pin a night. We call it the toll.');
        const p = await respond(a, 'bev', [
          { label: '"Pay the toll. Respect the lane."', tone: 'wry' },
          { label: '"Couldn\'t you fix it properly?"', tone: 'straight' }
        ]);
        await say(a, ['Exactly. You get it. Most people want a refund.', 'With what? Mustard? Lane eight runs. That\'s enough.'][p]);
      } else {
        t.end = 'closed'; await say(a, 'Pinwheel\'s closing for the winter. The pins go in boxes. I go to my sister\'s in Fall River, and she bowls ten-pin. Pray for me.');
        const p = await respond(a, 'bev', [
          { label: '"I\'ll light a candle. A candlepin."', tone: 'wry' },
          { label: '"Oh, Bev. You\'ll be all right."', tone: 'kind' }
        ]);
        await say(a, ['Ha. That\'s terrible. I\'m having it printed on a shirt.', 'I know I will. That\'s why I didn\'t ask.'][p]);
      }
    }
  ],
  epilogue: { sponsor: 'The Crooked Scales bowl at Pinwheel Lanes every Tuesday, sponsored by you, and come third every time.', saved: 'Pinwheel Lanes stays open all winter. Lane eight takes one pin a night as a toll.', closed: 'Pinwheel Lanes is shut for the winter. Bev Santos sends a postcard from Fall River: "Ten-pin. Help."' }
});

addRegular('hal', {
  name: 'Hal Mayhew', place: 'Mayhew\'s Hardware on Front Street', topic: 'storms, roofs, and anything you\'d fix with a hammer',
  look: { skin: '#d8a880', hair: '#4a3a2a', hs: 0, coat: '#e8c020', style: 'jacket', trim: '#3a3a2a', pants: '#2a3a4a', hat: 'wide', hatc: '#e8c020', beard: '#4a3a2a' },
  meet: 'Hal Mayhew. Mayhew\'s Hardware, since 1938. Nails by the pound. Advice by the hour, free.',
  chat: ['The big chain on Route 1 sells nails in plastic boxes of twelve. Twelve! What do you build with twelve nails?', 'Your PAWN sign buzzes. That\'s the transformer. Or it\'s haunted. Either way, I\'ve got a part.', 'Odile bought one key blank a week for thirty years. I never asked. Best customer I had.'],
  small: [
    { say: 'Storm coming Thursday. Folks buy tarps on Wednesday and come back for rope on Thursday. Every time.', opts: [
      { label: '"Why not buy both at once?"', tone: 'straight', reply: 'Because then they\'d have to admit it\'s coming.' },
      { label: '"Put the rope next to the tarps, then."', tone: 'sly', reply: 'And sell them one trip instead of two? I like the second trip. They stop for coffee.' },
      { label: '"I\'ll take a tarp. Just in case."', tone: 'kind', reply: 'Just in case. That\'s the most sensible thing anybody\'s said in here all week.' }] },
    { say: 'My father kept a ledger of every nail he sold. 1938 to 1971. Two million and some.', opts: [
      { label: '"Does it balance?"', tone: 'straight', reply: 'To the nail. He\'d sit up till it did.' },
      { label: '"What would a collector give for it?"', tone: 'sly', reply: 'To me it\'s worth more than you\'ve got. To a collector, I\'ll never find out.' },
      { label: '"That\'s a lot of fences."', tone: 'wry', reply: 'Fences, barns, two churches. And the undertaker. He never said which nails went where.' }] },
    { say: 'Somebody\'s been buying bolt cutters. Three pairs this month, three different people. I wrote it down. In case.', opts: [
      { label: '"Who were they?"', tone: 'straight', reply: 'Two I knew. One wore a hat indoors. I don\'t trust a hat indoors.' },
      { label: '"Maybe people just lose bolt cutters."', tone: 'wry', reply: 'Nobody loses bolt cutters. They lend them to a brother-in-law. Same thing.' },
      { label: '"Keep that list somewhere safe, Hal."', tone: 'kind', reply: 'In the till, under the twenties. Nobody looks under the twenties.' }] },
    { say: 'January\'s the hard month. Nobody builds anything in January. They just fix what broke in December.', opts: [
      { label: '"Then January\'s your busy month."', tone: 'straight', reply: 'That\'s the theory. The theory\'s been wrong since 1981.' },
      { label: '"Sell them sledges."', tone: 'wry', reply: 'I sold sledges in 1979. It didn\'t snow till March. I still have four.' }] }
  ],
  reckon: {
    up: { say: '{quest}. People were talking about it in the store. They say you did right by it.', opts: [
      { label: '"I did what anyone would."', tone: 'kind', reply: 'No. Anyone didn\'t. You did.' },
      { label: '"It was a fair deal, too."', tone: 'straight', sway: 1, reply: 'Right and fair. My favorite kind.' }] },
    down: { say: '{quest}. I heard how that went. I sell honest nails. I like to deal with people who do the same.', opts: [
      { label: '"You\'re right. I got that one wrong."', tone: 'straight', sway: 1, reply: 'Well. That\'s a start. Nails are still by the pound.' },
      { label: '"It was business, Hal."', tone: 'sly', sway: -1, reply: 'So\'s mine. Funny how different they look.' }] }
  },
  mend: async a => {
    await say(a, 'Hal Mayhew. You know where the store is. I\'m not here to buy.');
    const i = await respond(a, 'hal', [
      { label: '"I was wrong, Hal. I\'m sorry."', tone: 'straight' },
      { label: 'Buy a pound of nails you don\'t need ($6)', disabled: S.coin < 6 },
      { label: '"Business is business."', tone: 'sly' }]);
    if (i === 1) change('coin', -6, 'Bought a pound of nails from Hal Mayhew');
    await say(a, ['Well. It takes a straight board to say that. We\'re square.', 'A pound of nails. You don\'t need them. I know you don\'t. All right. We\'re square.', 'Then I\'ll mind mine.'][i]);
    return i < 2;
  },
  title: 'Nails by the Pound', endings: { stays: 'Mayhew\'s Stays Open', sold: 'Sold to the Chain', both: 'A Counter in the Corner' },
  steps: [
    async (a, t) => {
      await say(a, 'The chain on Route 1 wants to buy me out. Good money. They\'d keep the sign and sell plastic boxes of twelve nails underneath it.');
      const j = await respond(a, 'hal', [
        { label: '"Are you going to sell?"', tone: 'straight' },
        { label: '"How much are they offering?"', tone: 'sly' },
        { label: '"Plastic boxes of twelve. The horror."', tone: 'wry' }
      ]);
      await say(a, ['Not if I can help it. That\'s the trouble. I can\'t help it much longer.', 'Enough that you\'re asking. That\'s how they get you.', 'Laugh. Twelve nails, two dollars. Do the sum and stop laughing.'][j]);
      await say(a, 'I need forty to tide the store over till spring. You can hold my grandfather\'s level. Brass and rosewood, 1910. I\'ll be back for it.');
      view.counterIcon = 'compass';
      const i = await respond(a, 'hal', [
        { label: 'Lend him $40 on the level', tone: 'straight', disabled: S.coin < 40 || !shelfFree() },
        { label: '"Thirty, and I\'ll hold it."', tone: 'sly', disabled: S.coin < 30 || !shelfFree() },
        '"I can\'t lend right now, Hal."'
      ]);
      view.counterIcon = null;
      if (i < 2) {
        const n = i === 0 ? 40 : 30;
        change('coin', -n, `Lent Hal Mayhew ${money(n)} against his grandfather's level`);
        const it = townItem({ name: 'Mayhew\'s brass level, 1910', icon: 'compass', cat: 'curio', guide: 70, condLabel: 'Fine', clue: 'Rosewood and brass. The bubble still finds true. "J. MAYHEW" stamped at one end.' });
        it.held = 'Hal Mayhew'; it.paid = n; S.stock.push(it); renderPanel();
        t.f.loan = n;
        await say(a, n === 40 ? 'Don\'t sell it. I mean it. I\'ll be back.' : 'Thirty. You\'d have done well at the chain. Don\'t sell it. I\'ll be back.');
      } else await say(a, 'No, I know. Everybody\'s got their own roof to fix.');
    },
    async (a, t) => {
      await say(a, 'Can I ask you something? You run a shop. Is it worth it? Every morning, opening up, for people who want twelve nails?');
      const j = await respond(a, 'hal', [
        { label: '"Most mornings. Not all."', tone: 'straight', save: 'honest' },
        { label: '"Every morning, Hal."', tone: 'kind' },
        { label: '"It is when the money\'s good."', tone: 'sly' }
      ]);
      await say(a, ['Most. That\'s an honest number. Nobody gives me honest numbers.', 'You say that like you mean it. Odile said it like that too.', 'The chain\'s money is good. That\'s the whole problem.'][j]);
      await say(a, 'So what would you do? In my boots.');
      const i = await respond(a, 'hal', [
        { label: '"Keep it open. The town needs a man who sells nails by the pound."', tone: 'kind' },
        { label: '"Take the money, Hal. Go fishing."', tone: 'straight' },
        { label: '"Rent me a corner. I\'ll sell secondhand tools in your store."', tone: 'sly' }
      ]);
      t.f.advice = ['stays', 'sold', 'both'][i];
      await say(a, ['That\'s what my grandfather said. He was wrong about a lot of things. Not that.', 'Fishing. I hate fishing. I\'d be good at it though.', 'A pawnshop corner in a hardware store. Odile suggested that in 1995. I said no. I was wrong.'][i]);
    },
    async (a, t) => {
      t.end = t.f.advice || 'stays';
      const lv = S.stock.find(x => x.held === 'Hal Mayhew');
      if (t.f.loan) {
        if (lv) { S.stock = S.stock.filter(x => x !== lv); renderPanel(); }
        change('coin', t.f.loan + 8, 'Hal Mayhew redeemed his level');
        await say(a, `${t.f.loan === 40 ? 'Forty' : 'Thirty'}, and eight for your trouble. The level comes home.`);
      }
      await say(a, { stays: 'I turned the chain down. The sign stays. The nails stay. By the pound.', sold: 'I sold. Signed this morning. I\'m going to buy a boat and hate it.', both: 'There\'s a corner in Mayhew\'s with your name on a card. Secondhand tools, honest prices. We\'ll see who\'s right.' }[t.end]);
      if (said('hal', 'honest')) await say(a, 'You told me most mornings, not all. I\'ve been counting since. It\'s most.');
      const i = await respond(a, 'hal', [
        { label: '"Good. The town needed that."', tone: 'kind' },
        { label: '"What did it cost you?"', tone: 'straight' },
        { label: '"Told you so."', tone: 'wry' }
      ]);
      await say(a, [
        { stays: 'The town needs a lot of things. It\'s got nails, anyway.', sold: 'The town needed a chain store? Maybe it did. It\'s got one.', both: 'We\'ll see if the town agrees. It\'s a small corner.' }[t.end],
        { stays: 'Sleep, mostly. And the boat I wasn\'t going to buy.', sold: 'Seventy-eight years of a name over a door. They paid well for it. That\'s the trouble.', both: 'Half a shelf and some pride. The shelf was dusty. So was the pride.' }[t.end],
        'You did. Don\'t do it again. I\'ve got a face to keep.'][i]);
      if (isFriend('hal', 'warm')) await say(a, 'And come by the store. If that back door of yours ever needs a proper lock, I\'ll fit it myself. No charge. Don\'t tell anyone.');
      change('rep', t.end === 'sold' ? 0 : 3);
    }
  ],
  epilogue: { stays: 'Mayhew\'s Hardware still sells nails by the pound. Hal says the chain sends him a birthday card, out of spite.', sold: 'Mayhew\'s is a chain store now. Hal Mayhew bought a boat and is bad at fishing, cheerfully.', both: 'A corner of Mayhew\'s Hardware sells the Crooked Scale\'s secondhand tools. Hal says it\'s the busiest corner he\'s got.' }
});

addRegular('bettany', {
  name: 'Bettany Lowe', place: 'Lowe\'s Bakery on Front Street', topic: 'the town at five in the morning: who\'s up, who\'s out, who\'s hungry',
  look: { skin: '#f0c8a8', hair: '#d8c070', hs: 3, coat: '#e8dcc0', trim: '#c8b890', style: 'tee', apron: '#f4eee0', stout: true },
  meet: 'Bettany Lowe. The bakery on Front Street. I\'m up at four. I see everybody who\'s up before you, which is everybody.',
  chat: ['Rosa does the counter, I do the ovens. If you\'ve met Rosa, you\'ve met the bakery.', 'Day-olds. For you. Don\'t tell the cat.', 'Odile came in at six every day for a roll, and paid on Fridays. Exact change. For thirty years.'],
  small: [
    { say: 'The fishermen come in at four-thirty. The nurses at six. The teenagers at eleven, asking for yesterday\'s.', opts: [
      { label: '"Who comes in at five?"', tone: 'straight', reply: 'Nobody you\'d expect. Ask me again when you know me better.' },
      { label: '"You must never sleep."', tone: 'kind', reply: 'I sleep at eight. Like a baby. Or a fisherman.' },
      { label: '"Sell the teenagers tomorrow\'s instead."', tone: 'wry', reply: 'I tried. They\'re not stupid. Just hungry.' }] },
    { say: 'Rosa\'s going to college in the fall. Nursing. I\'ll have to learn to smile at people.', opts: [
      { label: '"You\'ll be fine at the counter."', tone: 'kind', reply: 'Liar. Nice liar. Have a roll.' },
      { label: '"Hire someone."', tone: 'straight', reply: 'Hire who? Everybody who wants to get up at four already works for me. It\'s me.' },
      { label: '"Smiling\'s overrated."', tone: 'sharp', reply: 'Tell the customers that. They\'re the ones who have to look at me.' }] },
    { say: 'There was a man asleep in the bus shelter at five this morning. I left him a roll. He was gone by six, and so was the roll.', opts: [
      { label: '"That was kind of you."', tone: 'kind', reply: 'It was a roll. Don\'t make a fuss.' },
      { label: '"Did you know him?"', tone: 'straight', reply: 'No. He had good boots. Too good for a bus shelter. I keep thinking about the boots.' },
      { label: '"You\'ll have every drifter in town at your door."', tone: 'sharp', reply: 'Good. They\'ll be warm.' }] },
    { say: 'The Pennicks sell anadama at the farmers\' market. It\'s fine. It\'s fine. It\'s not fine.', opts: [
      { label: '"Yours is better. Everybody says so."', tone: 'kind', reply: 'Everybody says so to me. I want to know what they say to the Pennicks.' },
      { label: '"What\'s wrong with it?"', tone: 'straight', reply: 'Too much molasses. They cover things up with molasses.' },
      { label: '"Sounds like a feud."', tone: 'wry', reply: 'Since 1971. Over a cornmeal order. I wasn\'t born. I\'m still in it.' }] }
  ],
  reckon: {
    up: { say: '{quest}. I heard all about it at five this morning. Everybody tells the bakery first.', opts: [
      { label: '"I was lucky."', tone: 'kind', reply: 'You were decent. Luck\'s something else.' },
      { label: '"It was the right thing to do."', tone: 'straight', reply: 'It was. Take a roll. Take two.' }] },
    down: { say: '{quest}. I heard how it went at five this morning. Everybody tells the bakery.', opts: [
      { label: '"I\'d do it differently now."', tone: 'kind', sway: 1, reply: 'Then I won\'t tell the eleven o\'clock lot. Not all of it.' },
      { label: '"People should mind their own business."', tone: 'sharp', sway: -1, reply: 'At five in the morning, other people\'s business is all there is.' }] }
  },
  mend: async a => {
    await say(a, 'Morning. No day-olds. Day-olds are for friends.');
    const i = await respond(a, 'bettany', [
      { label: '"I was short with you, Bettany. I\'m sorry."', tone: 'kind' },
      { label: 'Buy a dozen rolls ($8)', disabled: S.coin < 8 },
      { label: '"I\'m busy."', tone: 'sharp' }]);
    if (i === 1) change('coin', -8, 'Bought a dozen rolls from Lowe\'s Bakery');
    await say(a, ['Well. Have a roll, then. It\'s yesterday\'s. That\'s an apology too.', 'A dozen. You can\'t eat a dozen. Give them to the cat. All right. We\'re all right.', 'Everybody is.'][i]);
    return i < 2;
  },
  title: 'Mother\'s Recipe Tin', endings: { home: 'Rose Tin', copied: 'A Copy on the Wall', lost: 'From Memory' },
  steps: [
    async (a, t) => {
      await say(a, 'Here. Day-olds. I\'ve also come to ask. My mother\'s recipe tin went in the house clearance when she passed. Painted roses on the lid. Every recipe I don\'t know by heart is in it.');
      const j = await respond(a, 'bettany', [
        { label: '"I\'m sorry about your mother."', tone: 'kind' },
        { label: '"What\'s in it that you don\'t know?"', tone: 'straight' },
        { label: '"Day-olds as a bribe? Bold."', tone: 'wry' }
      ]);
      await say(a, ['Thank you. She\'d have said you were too thin. You are, a bit.', 'The anadama. The Christmas stollen. One she called "for funerals", which I\'m not ready to need.', 'Day-olds are a greeting. A bribe is a whole loaf.'][j]);
      await say(a, 'The house clearance man sells to you sometimes. Marv Kettle. If he brings a tin with roses on it...');
      const i = await respond(a, 'bettany', [
        { label: '"I\'ll keep an eye out for roses."', tone: 'kind', save: 'promised' },
        { label: '"If it comes in, it\'ll have a price."', tone: 'sharp' }
      ]);
      await say(a, i === 0 ? 'Thank you. You\'ll know it by the lid. It sticks.' : 'Everything has, I suppose. Bread has.');
      change('rep', 1);
      t.f.asked = true;
    },
    async (a, t) => {
      await narrate('Marv Kettle, the house clearance man, has left a crate on your step overnight, with a note: "Odds and sods. $25 the lot." On top, a tin with painted roses on the lid.');
      const it = townItem({ name: 'Rose-painted recipe tin', icon: 'tin', cat: 'curio', guide: 15, condLabel: 'Worn', clue: 'Index cards in a looping hand. "Anadama. Do NOT tell the Pennicks." The lid sticks.' });
      t.f.tin = await townBuy(a, it, 25, 'Bought Marv Kettle\'s crate (with a recipe tin)', 'Leave the crate on the step');
      if (t.f.tin) {
        await say(a, 'That\'s it. That\'s it! The lid sticks just like I remember.');
        const i = await respond(a, 'bettany', [
          { label: '"It\'s safe. It\'s on the shelf."', tone: 'kind' },
          { label: '"We can talk about it next time."', tone: 'straight' }
        ]);
        await say(a, i === 0 ? 'On the shelf. With the brass and the clocks. She\'d have liked the company.' : 'Next time. I can wait. I\'ve waited since spring.');
      } else {
        await say(a, 'Was that it? On your step? It\'s gone. Marv took the crate back. Marv. MARV.');
        if (said('bettany', 'promised')) await say(a, 'You said you\'d keep an eye out for roses.');
        const i = await respond(a, 'bettany', [
          { label: '"I should have looked closer. I\'m sorry."', tone: 'kind' },
          { label: '"Twenty-five was steep for a crate of junk."', tone: 'sharp' }
        ]);
        await say(a, i === 0 ? 'It\'s not your fault. It\'s Marv\'s. It\'s always Marv\'s.' : 'It wasn\'t junk. It was my mother.');
      }
    },
    async (a, t) => {
      const tin = S.stock.find(x => x.name === 'Rose-painted recipe tin');
      if (!tin) {
        t.end = 'lost';
        await say(a, 'I\'m doing the anadama from memory. It\'s close. My mother would say it\'s close. She\'d say it the way she said things.');
        const i = await respond(a, 'bettany', [
          { label: '"Close is good. Close is yours."', tone: 'kind' },
          { label: '"Could you not just guess the rest?"', tone: 'sharp' }
        ]);
        await say(a, i === 0 ? 'Close is mine. I like that. I\'ll put it on the sign.' : 'I am guessing. That\'s what close means.');
        return;
      }
      await say(a, 'So. The tin. I\'ll not pretend I haven\'t been thinking about it every morning at four.');
      const i = await respond(a, 'bettany', [
        { label: 'Give her the tin', tone: 'kind' },
        { label: 'Sell it to her for $25', tone: 'straight' },
        { label: 'Let her copy the recipes, keep the tin', tone: 'sly' }
      ]);
      S.stock = i === 2 ? S.stock : S.stock.filter(x => x !== tin); renderPanel();
      if (i === 0) { t.end = 'home'; change('rep', 6); await say(a, 'You\'re getting bread till Christmas. Don\'t argue with a woman who gets up at four.'); }
      else if (i === 1) { t.end = 'home'; change('coin', 25, 'Sold Bettany Lowe her mother\'s recipe tin'); change('rep', 2); await say(a, 'Twenty-five. Worth every penny. Every crumb.'); }
      else { t.end = 'copied'; await say(a, 'I\'ll copy them out tonight. The cards can stay here. Mother always said recipes were for sharing. She never shared one.'); }
      if (said('bettany', 'promised') && t.end === 'home') await say(a, 'You said you\'d keep an eye out for roses. Most people say that. You did it.');
      if (isFriend('bettany', 'warm') && t.end === 'home') await say(a, 'And listen. I see everybody on Front Street at five in the morning. If you ever need to know who was at your door before you opened, ask me first.');
    }
  ],
  epilogue: { home: 'Lowe\'s Bakery makes Bettany\'s mother\'s anadama bread again, from the card in the rose tin. The first loaf of every batch goes to the Crooked Scale.', copied: 'Bettany Lowe\'s mother\'s recipes hang, copied out, on the bakery wall. The tin is still on your shelf.', lost: 'Bettany Lowe makes her mother\'s bread from memory. It\'s close.' }
});

addRegular('skip', {
  name: 'Skip Fairweather', place: 'the school bus', topic: 'the kids and the school, and who\'s out on the roads',
  look: { skin: '#e0b090', hair: '#a89a8a', hs: 2, coat: '#3a5a8a', style: 'jacket', trim: '#e8c040', pants: '#3a3a40', moustache: '#a89a8a', hat: 'cap', hatc: '#e8c040' },
  meet: 'Skip Fairweather. I drive the school bus. Twice a day, every street in town. The kids tell me everything, and most of it\'s even true.',
  chat: ['Lark and Linnet ride the front seat. They show me everything they find. I\'ve seen a lot of bottle caps.', 'Bus 4 has done three hundred thousand miles. Me too, nearly.', 'I used to play guitar. Long story. Ask Ruthie, she tells it better.'],
  small: [
    { say: 'A cat gets on at Cedar Street every morning, rides to the school, gets off and walks home. I don\'t charge.', opts: [
      { label: '"Whose cat is it?"', tone: 'straight', reply: 'Nobody\'s. Everybody\'s. It\'s got a better attendance record than half the sixth grade.' },
      { label: '"Charge it half fare."', tone: 'wry', reply: 'It\'d pay in mice. I\'ve seen its wallet.' },
      { label: '"That\'s sweet, Skip."', tone: 'kind', reply: 'Don\'t tell anyone. I\'ve a reputation for shouting at the back seat.' }] },
    { say: 'The twins found a bottle on the beach with a note in it. It said "HELP". Then, smaller, "with homework".', opts: [
      { label: '"Did they write back?"', tone: 'wry', reply: 'They put it back in the sea with the answers. Wrong answers. I checked.' },
      { label: '"Somebody should help with the homework."', tone: 'kind', reply: 'That\'s what I said. Then they asked me about fractions, and I had to drive.' },
      { label: '"That\'s littering."', tone: 'sharp', reply: 'It\'s recycling. With hope.' }] },
    { say: 'There\'s a car parked on Shore Road with nobody in it. Third morning running. Out-of-state plates.', opts: [
      { label: '"Did you tell Officer Dunphy?"', tone: 'straight', reply: 'Kenny wrote it down. Kenny writes everything down. Then he loses the pad.' },
      { label: '"Maybe somebody\'s out fishing."', tone: 'kind', reply: 'Maybe. No rods on the roof, though. Just a coffee cup on the dash, going cold.' },
      { label: '"None of our business."', tone: 'sharp', reply: 'Everything on my route is my business. Twice a day.' }] },
    { say: 'I played guitar at the Anchor, years back. The band was called the Fairweather Friends. Nobody came twice.', opts: [
      { label: '"Play something for me sometime."', tone: 'kind', reply: 'Careful. I might.' },
      { label: '"With a name like that, I\'m not surprised."', tone: 'wry', reply: 'That\'s what Ruthie said. She still won\'t book us.' },
      { label: '"Why did you stop?"', tone: 'straight', reply: 'The bus needed driving. The band didn\'t need playing.' }] }
  ],
  reckon: {
    up: { say: 'The kids were talking about {quest} on the bus. Your name came up. Nicely, for once.', opts: [
      { label: '"Kids talk."', tone: 'wry', reply: 'Kids talk truth. That\'s why nobody listens to them.' },
      { label: '"I hope it helped somebody."', tone: 'kind', reply: 'It did. I heard it from the back seat.' }] },
    down: { say: 'The kids were talking about {quest} on the bus. I heard your name. I wish I hadn\'t.', opts: [
      { label: '"They\'re right. I\'ll make it up."', tone: 'kind', sway: 1, reply: 'Make it up to them, not me. They\'re the ones who\'ll remember.' },
      { label: '"Kids exaggerate."', tone: 'sharp', sway: -1, reply: 'Not about this. They save it for fish.' }] }
  },
  mend: async a => {
    await say(a, 'Afternoon. Just dropping off. Not stopping.');
    const i = await respond(a, 'skip', [
      { label: '"Skip, I was out of line."', tone: 'kind' },
      { label: 'Put $5 in the school book-drive tin', disabled: S.coin < 5 },
      { label: '"Did you want something?"', tone: 'sharp' }]);
    if (i === 1) change('coin', -5, 'Put $5 in the school book-drive tin');
    await say(a, ['Ah, everybody\'s out of line once. I drive kids. I\'d know.', 'For the books? That\'s... all right. That\'s all right, then.', 'No. Nothing.'][i]);
    return i < 2;
  },
  title: 'Bus Number Four', endings: { bought: 'His Own Bus', scrapped: 'Scrapped', kids: 'The Kids Chipped In' },
  steps: [
    async (a, t) => {
      await say(a, 'The town\'s retiring Bus 4. My bus. Twenty-two years. They\'re auctioning it at the end of the month and somebody will turn it into a food truck.');
      const j = await respond(a, 'skip', [
        { label: '"Twenty-two years is a long time to love a bus."', tone: 'kind' },
        { label: '"A food truck. Could be worse. Could be a planter."', tone: 'wry' },
        { label: '"It\'s a bus, Skip."', tone: 'sharp', save: 'onlyBus' }
      ]);
      await say(a, ['She doesn\'t love me back. She stalls on Cedar Hill to make a point.', 'Don\'t. They did that to Bus 2. There are geraniums where the kids sat.', 'It\'s a bus. Yes. Like your shop is a room.'][j]);
      await say(a, 'I\'m selling my thirty-year safe-driving pin to start a fund. Gold-filled. It\'s the only gold thing I own.');
      t.f.pin = await townBuy(a, townItem({ name: 'Safe-driving pin, 30 years', icon: 'brooch', cat: 'jewelry', guide: 30, condLabel: 'Fine', clue: 'Gold-filled, enamel school bus, "30 YRS - NO ACCIDENTS". The bus on it is number 4.' }), 20, 'Bought Skip Fairweather\'s safe-driving pin');
      await say(a, t.f.pin ? 'Mind the enamel. The little bus has a chip where I kept touching it.' : 'That\'s all right. I\'ll pin it back on. It looks better on a driver.');
    },
    async (a, t) => {
      await say(a, 'The auction reserve is a thousand. I\'ve got six hundred and a jar the kids made with "BUS" written on it in glitter.');
      const j = await respond(a, 'skip', [
        { label: '"How much is in the jar?"', tone: 'straight' },
        { label: '"Glitter. You\'ll never get it off the bus."', tone: 'wry' }
      ]);
      await say(a, j === 0 ? 'They won\'t let me count it. They say it\'s bad luck. It rattles like about eleven dollars.' : 'It\'s already on the bus. It\'s on me. I sparkle on Sundays.');
      await say(a, 'Could you lend me fifty? Back by the end of the month.');
      const n = await townGive(a, [50], 'Lent Skip Fairweather $50 for the bus auction');
      t.f.loan = n;
      await say(a, n ? 'Fifty. That\'s a tire. That\'s one tire on Bus 4. Thank you.' : 'No, that\'s fair. I\'ll ask the jar again.');
    },
    async (a, t) => {
      if (t.f.loan) change('coin', t.f.loan, 'Skip Fairweather paid back the bus loan');
      if (t.f.pin && t.f.loan) { t.end = 'bought'; change('rep', 5); await say(a, 'I got it. Bus 4 is mine. It\'s parked at my sister\'s. I sit in it. Just sit. Here\'s your fifty.'); }
      else if (t.f.pin || t.f.loan) { t.end = 'kids'; change('rep', 3); await say(a, 'The kids\' jar had three hundred and eleven dollars in it. Three hundred and eleven! I\'m short-changed the bank but I\'ve got my bus.'); }
      else { t.end = 'scrapped'; await say(a, 'Bus 4 went for scrap. A man from Brockton. I waved at it on the trailer. The kids waved too.'); }
      if (t.end === 'scrapped') {
        if (said('skip', 'onlyBus')) await say(a, 'You told me it was only a bus. It was. It was only my bus.');
        const i = await respond(a, 'skip', [
          { label: '"I\'m sorry, Skip."', tone: 'kind' },
          { label: '"They\'ll give you a newer one."', tone: 'straight' }
        ]);
        await say(a, i === 0 ? 'Thanks. Don\'t be. It\'s the kids I\'m sorry for. They named the seats.' : 'They have. It beeps when it reverses. I hate the beep.');
        return;
      }
      const i = await respond(a, 'skip', [
        { label: '"Take the kids to the beach in it."', tone: 'kind' },
        { label: '"Does it still stall on Cedar Hill?"', tone: 'wry' },
        { label: '"Don\'t let them make it a food truck now."', tone: 'straight' }
      ]);
      await say(a, ['Last day of school. I told them already. They\'ve already packed.', 'Worse than ever. She knows she\'s mine now. She\'s showing off.', 'Over my dead body. And she\'d stall on that too.'][i]);
      if (isFriend('skip', 'warm')) await say(a, 'And if you ever need to get across town quick, wave me down. Bus 4 doesn\'t mind a detour. The kids like a detour.');
    }
  ],
  epilogue: { bought: 'Skip Fairweather owns Bus 4. On the last day of school he drives the kids to the beach in it, for free.', kids: 'The kids of Hollow Neck bought Skip Fairweather his bus with a glitter jar. He keeps the jar on the dashboard.', scrapped: 'Bus 4 went for scrap. Skip Fairweather drives a new one that beeps when it reverses. He hates the beep.' }
});

addRegular('gordie', {
  name: 'Gordie Haines', place: 'Haines Motors on Route 1', topic: 'money: who\'s buying, who\'s selling, who\'s building what',
  look: { skin: '#f0c8a8', hair: '#c8a060', hs: 0, coat: '#c83a3a', trim: '#f4f4ee', style: 'suit', stout: true, moustache: '#c8a060', pants: '#2a2a3a' },
  meet: 'Gordie Haines! Haines Motors, Route 1! "Come on down to Haines, we\'ll take the pain out of your gains!" I wrote that.',
  chat: ['Everybody in this town will buy a car from me eventually. I\'m a patient man. I\'m not, but I tell people that.', 'Odile sold me a cigar box once for eight dollars. It was empty. I still have it. She was good.', 'I\'ve got a new jingle. You want to hear it? You\'re going to hear it.'],
  small: [
    { say: 'There\'s a man on Route 1 selling tires out of a barn. No sign. Better prices than mine. I respect him and I want him gone.', opts: [
      { label: '"Buy him out."', tone: 'sly', reply: 'I tried. He wanted the barn price for a barn full of tires. Smart man. Terrible man.' },
      { label: '"Beat his price."', tone: 'straight', reply: 'Beat it. Listen to this. Have you ever been a car dealer? Don\'t.' },
      { label: '"Hire him."', tone: 'wry', reply: 'I did. He sold me four tires. I don\'t know how.' }] },
    { say: 'Somebody bought the empty lot by the boatyard and nobody knows who. I always know who.', opts: [
      { label: '"I might know."', tone: 'sly', reply: 'You don\'t. But I like how you said it. Say it like that to a customer.' },
      { label: '"Ask the town clerk."', tone: 'straight', reply: 'The clerk says "a trust". A trust! Nobody trusts a trust.' },
      { label: '"Maybe it\'s you, and you forgot."', tone: 'wry', reply: 'I\'d remember. I\'d have put up a banner.' }] },
    { say: 'I bid at every auction in this county. Not to win. To make the other fellow pay.', opts: [
      { label: '"That\'s mean, Gordie."', tone: 'kind', reply: 'That\'s business. Mean\'s when you enjoy it. I enjoy it a little.' },
      { label: '"Remind me never to bid against you."', tone: 'wry', reply: 'Bid with me instead. I nod, you raise. Partners. Ha!' },
      { label: '"Teach me."', tone: 'sly', reply: 'Lesson one: yawn when you want it. Lesson two costs money.' }] },
    { say: 'Never say the number first. That\'s the whole secret of Haines Motors. Say a feeling. "Comfortable." Nobody knows what comfortable costs.', opts: [
      { label: '"I\'ll try that on my next seller."', tone: 'sly', reply: 'You will, and it\'ll work, and you\'ll owe me lunch.' },
      { label: '"That\'s a con, Gordie."', tone: 'straight', reply: 'It\'s a conversation. Shorter word, longer lunch.' },
      { label: '"How comfortable is a Buick?"', tone: 'wry', reply: 'Very. Ask me about the payments and it gets less comfortable.' }] }
  ],
  reckon: {
    up: { say: 'I heard how {quest} went! Smart. Smart and lucky, which is smarter than smart.', opts: [
      { label: '"Luck had nothing to do with it."', tone: 'sly', reply: 'That\'s what I tell people too! We should do lunch.' },
      { label: '"It was mostly luck."', tone: 'straight', reply: 'Never say that out loud. Write it down and burn it.' }] },
    down: { say: 'I heard how {quest} went. Bad for business. My business. I\'m in all business.', opts: [
      { label: '"What would it take to square it?"', tone: 'sly', sway: 1, reply: 'A smile and a favor later. I collect. Ask anyone.' },
      { label: '"It wasn\'t about you, Gordie."', tone: 'straight', sway: -1, reply: 'Everything in this town is about me. Read the billboards.' }] }
  },
  mend: async a => {
    await say(a, 'Gordie Haines. You know me. I don\'t hold grudges. I just hold onto them.');
    const i = await respond(a, 'gordie', [
      { label: 'Buy him lunch at the clam shack ($10)', tone: 'sly', disabled: S.coin < 10 },
      { label: '"You were right and I was wrong."', tone: 'wry' },
      { label: '"I\'ve nothing to say to you."', tone: 'straight' }]);
    if (i === 0) change('coin', -10, 'Bought Gordie Haines lunch');
    await say(a, ['Lunch! A deal-maker. My heart says the clam shack. My doctor says the clam shack, but sadly.', 'Say it again. Slower. I want to remember the feeling. Fine. Fine! We\'re good.', 'Then I\'ll do the talking. I\'m better at it.'][i]);
    return i < 2;
  },
  title: 'A Touch of Class', endings: { art: 'Real Art', fake: 'The Showroom Fake', ad: 'Star of the Ad' },
  steps: [
    async (a, t) => {
      await say(a, 'The showroom needs class. A painting. A vase. Something that says "this man reads". I don\'t, but the vase doesn\'t know that.');
      const j = await respond(a, 'gordie', [
        { label: '"Class costs, Gordie."', tone: 'sly' },
        { label: '"Want something that says you read? Buy a book."', tone: 'wry' },
        { label: '"What\'s your budget?"', tone: 'straight' }
      ]);
      await say(a, ['Everything costs! That\'s the beauty of it. Show me the tag, I\'ll show you the jingle.', 'A book! Ha! Books don\'t sparkle. You\'re funny. I\'ll use that.', 'Budget. You sound like my accountant. I don\'t listen to him either.'][j]);
      const opts = townTakeFromStock(it => ['painting', 'vase', 'statuette'].includes(it.key)).slice(0, 2);
      const i = await choose([...opts.map(it => ({ label: `Sell him the ${it.name.toLowerCase()} for ${money(Math.round(it.guide * 1.4))}`, hint: it.knownFake ? '(you know it\'s a fake)' : `(guide ${money(it.guide)})` })), '"Nothing classy in today, Gordie."']);
      if (i < opts.length) {
        const it = opts[i], p = Math.round(it.guide * 1.4);
        S.stock = S.stock.filter(x => x !== it); S.stats.sold++; renderPanel();
        change('coin', p, `Sold Gordie Haines a ${it.name.toLowerCase()} for his showroom`);
        t.f.sold = it.fake ? 'fake' : 'art'; t.f.price = p;
        await say(a, 'Beautiful. I don\'t know what it is. That\'s how you know it\'s art.');
      } else await say(a, 'Nothing? I\'ll check back. I\'m very patient. I\'m not.');
    },
    async (a, t) => {
      await say(a, 'I\'m shooting a TV ad on Saturday. Local cable. I want a local business owner to say "I bought my truck from Gordie and I\'ve never looked back." You don\'t have a truck. That\'s fine. Acting!');
      const i = await respond(a, 'gordie', [
        { label: '"One take. And I want top billing."', tone: 'sly' },
        { label: '"Only if I can wear a cowboy hat."', tone: 'wry', save: 'hat' },
        { label: '"I don\'t want my face on cable, Gordie."', tone: 'straight' }
      ]);
      t.f.ad = i < 2;
      if (!t.f.ad) { await say(a, 'Your loss. My cousin\'s doing it. He\'s got no truck either.'); return; }
      change('coin', 40, 'Paid for a Haines Motors TV ad');
      await say(a, i === 0 ? 'Top billing! You\'re the only billing. Forty dollars and a free car wash for life.' : 'A hat! Yes! Forty dollars, a free car wash for life, and you keep the hat.');
      await say(a, 'Let\'s hear it. "I bought my truck from Gordie and I\'ve never looked back."');
      const j = await respond(a, 'gordie', [
        { label: '"I bought my truck from Gordie and I\'ve never looked back."', tone: 'straight' },
        { label: '"I bought my truck from Gordie, and I\'ve never looked back. I\'m too scared to."', tone: 'wry' }
      ]);
      await say(a, j === 0 ? 'Flat. Perfect. Honest people sound flat. That\'s how you know.' : 'Ha! No. Yes. No. We\'ll shoot both and my cousin can pick.');
    },
    async (a, t) => {
      if (t.f.ad) {
        t.end = 'ad'; change('rep', 2);
        await say(a, 'Did you see it? You\'re on during the late news. People in the diner recognize you. They point. You looked natural. You looked terrified, but natural.');
        if (said('gordie', 'hat')) await say(a, 'And the hat! They call you Tex at the diner now. You\'re welcome.');
        const i = await respond(a, 'gordie', [
          { label: '"Do I get paid every time it airs?"', tone: 'sly' },
          { label: '"Never again, Gordie."', tone: 'straight' }
        ]);
        await say(a, i === 0 ? 'Residuals! You\'re learning. No.' : 'You say that. They all say that. Then my cousins call them.');
      } else if (t.f.sold === 'fake') {
        t.end = 'fake'; change('rep', -5);
        await say(a, 'A man from the auction house came in for a car and looked at my showroom piece, walked all the way round it, and laughed. Then he bought a Buick. So I\'m even. Are we even? We\'re not even.');
        const i = await respond(a, 'gordie', [
          { label: '"Tell people it\'s a fake. As a selling point."', tone: 'sly' },
          { label: `Refund him ${money(t.f.price || 0)}`, tone: 'straight', sway: 2, disabled: S.coin < (t.f.price || 0) },
          { label: '"Buyer beware, Gordie."', tone: 'sharp' }
        ]);
        if (i === 1) change('coin', -(t.f.price || 0), 'Refunded Gordie Haines for the showroom fake');
        await say(a, ['A selling point. A fake on purpose. You\'re a genius or a crook. In cars that\'s one job.', 'A refund. Nobody refunds me. I don\'t know where to put my hands. Keep the hands. Thank you.', 'Beware! I\'m the one who says that! I\'ve got it on a mug!'][i]);
      } else {
        t.end = 'art'; change('rep', 2);
        await say(a, 'People come into the showroom just to look at the art now. They buy cars to have an excuse. Class! It works!');
        const i = await respond(a, 'gordie', [
          { label: '"Have you named it yet?"', tone: 'wry' },
          { label: '"Glad it sold some cars."', tone: 'straight' }
        ]);
        await say(a, i === 0 ? 'The Haines Gallery of Automotive Art. On a banner. A big one.' : 'Seven cars and a lawnmower. The lawnmower was mine. I sold it to myself to see if I could.');
      }
      if (isFriend('gordie', 'warm')) await say(a, 'Listen. If a Friday ever comes up short for you, and those fellows in the gold rings come round, you ring Haines Motors. I don\'t lend money. I lend it to you.');
    }
  ],
  epilogue: { ad: 'You appear in a Haines Motors ad on local cable, every night during the late news.', fake: 'Gordie Haines still has your fake in his showroom. He\'s started telling customers it\'s a fake, as a selling point.', art: 'Gordie Haines\'s showroom has real art now. He has given it a name. Not the painting. The showroom.' }
});

addRegular('nanFerreira', {
  name: 'Captain Nan Ferreira', place: 'the Gannet Island ferry', topic: 'the ferry and the island: who\'s going across, and who\'s coming back',
  look: { skin: '#c89070', hair: '#2a1e16', hs: 3, coat: '#22305a', trim: '#e8e4dc', style: 'jacket', hat: 'cap', hatc: '#e8e4dc', band: '#22305a', pants: '#2a2a30' },
  meet: 'Nan Ferreira. I run the ferry to Gannet. Four crossings a day, five in summer, none when Tess says no. I come over for groceries and gossip. Mostly gossip.',
  chat: ['Forty minutes across, forty back. I could do it blind. I\'ve been asked not to say that.', 'Sixty-one people on Gannet in winter. I know how every one of them takes their coffee.', 'Old Pell won\'t ride the ferry. He says a man with a boat doesn\'t take the bus.'],
  small: [
    { say: 'Fog\'s on its way. I can smell it. Tess checks the radio. I check my nose. We\'re both right.', opts: [
      { label: '"Which one\'s right more often?"', tone: 'straight', reply: 'The nose. Don\'t tell Tess.' },
      { label: '"Be careful out there, Nan."', tone: 'kind', reply: 'I\'m always careful. That\'s the job. Careful, then forty minutes.' },
      { label: '"Has the nose ever been wrong?"', tone: 'wry', reply: 'Once. 1998. It was a barbecue on the island.' }] },
    { say: 'A man asked me to take him across at midnight last week. Cash. I said no. I always say no at midnight.', opts: [
      { label: '"Who was he?"', tone: 'straight', reply: 'Never seen him. Good coat. Wrong shoes for a boat.' },
      { label: '"How much cash?"', tone: 'sly', reply: 'Enough that I\'m still thinking about it. Which is why I said no.' },
      { label: '"Always?"', tone: 'wry', reply: 'Nearly always. For a friend, I might. I don\'t have many.' }] },
    { say: 'The island school has four children this year. The teacher crosses with me every morning and grades homework on the bench.', opts: [
      { label: '"Will they keep the school open?"', tone: 'straight', reply: 'Till it\'s three. Then they\'ll argue. Then it\'ll be two.' },
      { label: '"Four\'s plenty for a school."', tone: 'kind', reply: 'Four\'s plenty for a school. It\'s not plenty for a budget.' },
      { label: '"Does she mark them fairly in a swell?"', tone: 'wry', reply: 'Everybody gets a B in a swell. The children know the tide tables.' }] },
    { say: 'Gannet gets the paper a day late and the gossip a day early. I carry both.', opts: [
      { label: '"What\'s the gossip?"', tone: 'sly', reply: 'For you? Nothing. You\'re mainland.' },
      { label: '"Which is more accurate?"', tone: 'straight', reply: 'The gossip. The paper prints corrections.' },
      { label: '"You should charge extra for the gossip."', tone: 'wry', reply: 'I do. It\'s in the fare.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest} on the island. Sixty-one people heard. That\'s everyone.', opts: [
      { label: '"Good news travels."', tone: 'wry', reply: 'Forty minutes each way.' },
      { label: '"It was the right call."', tone: 'straight', reply: 'It was. That\'s all I\'ll say. It\'s a lot, from me.' }] },
    down: { say: 'I heard about {quest} on the island. They don\'t forget much over there. Nothing else to do.', opts: [
      { label: '"I made a bad call. I own it."', tone: 'straight', sway: 1, reply: 'Owning it\'s something. I\'ll tell them that much.' },
      { label: '"Don\'t take it so hard, Nan."', tone: 'kind', sway: -1, reply: 'I\'ll take it how I take it.' }] }
  },
  mend: async a => {
    await say(a, 'I\'ll keep it short. You know why.');
    const i = await respond(a, 'nanFerreira', [
      { label: '"I was wrong, and I know it."', tone: 'straight' },
      { label: 'Buy a ten-crossing ferry ticket ($15)', disabled: S.coin < 15 },
      { label: '"Let\'s not make a thing of it."', tone: 'kind' }]);
    if (i === 1) change('coin', -15, 'Bought a ten-crossing ticket for the Gannet ferry');
    await say(a, ['Good. Then we\'re done with it.', 'Ten crossings. You\'ll have to use them. That\'s the punishment. All right.', 'I\'m not making anything. I\'m going.'][i]);
    return i < 2;
  },
  title: 'The Gannet Belle', endings: { dock: 'On the Ferry Dock', sold: 'Over a Bar in Hyannis', scrap: 'Gone with the Belle' },
  steps: [
    async (a, t) => {
      await say(a, 'The town\'s retiring the old ferry. The Gannet Belle, 1952. My father ran her, then me. The breakers in Fall River tow her away at the end of the month.');
      const j = await respond(a, 'nanFerreira', [
        { label: '"What\'s she worth as scrap?"', tone: 'straight' },
        { label: '"I\'m so sorry, Nan."', tone: 'kind' },
        { label: '"Can\'t the island club together and keep her?"', tone: 'straight' }
      ]);
      await say(a, ['Eleven hundred dollars. My father paid nine hundred for her. Seventy-odd years to go up two hundred.', 'Don\'t be. She\'s a boat. Save it for people.', 'Sixty-one people. Fifty of them own a boat already, and the other eleven get seasick.'][j]);
      await say(a, 'I took her wheel off before they could. I want it on the new ferry dock, where the island can see it. The dock isn\'t built, and I\'m forty dollars short on her mooring till the tow comes.');
      await narrate('She stands the wheel against your counter. Teak and brass, and taller than the till.');
      const i = await respond(a, 'nanFerreira', [
        { label: 'Lend her $40 on the wheel', hint: '(she\'ll redeem it for $50)', tone: 'straight', disabled: S.coin < 40 },
        { label: '"I haven\'t got room for that much wheel, Nan."', tone: 'wry' }
      ]);
      if (i === 0) { change('coin', -40, 'Lent Nan Ferreira $40 on the Gannet Belle\'s wheel'); t.f.loan = true; await say(a, 'Put it in the back where it can\'t see the water. It sulks.'); }
      else await say(a, 'Fair. It\'s a lot of wheel. It can go to Fall River with her, then.');
    },
    async (a, t) => {
      if (!t.f.loan) {
        await say(a, 'The breakers want the Belle with her wheel on. Part of the price, they said. I\'ve bolted it back. She looks better for it, which doesn\'t help.');
        const i = await respond(a, 'nanFerreira', [
          { label: '"Better on her than over somebody\'s bar."', tone: 'straight' },
          { label: '"That must have been hard."', tone: 'kind' }
        ]);
        await say(a, i === 0 ? 'That\'s what I told myself with the wrench. It nearly worked.' : 'It was a wrench and six bolts. Hard\'s a big word for it.');
        return;
      }
      await say(a, 'How\'s it look, back there?');
      const j = await respond(a, 'nanFerreira', [
        { label: '"Like it\'s waiting."', tone: 'straight' },
        { label: '"Like a wheel that lost its boat."', tone: 'wry' }
      ]);
      await say(a, j === 0 ? 'It is. So am I.' : 'Don\'t make it sadder than it is. It\'s sulking enough.');
      await say(a, 'A man from a seafood place in Hyannis saw it in your back room. He wants it over his bar. He says he\'ll give you a hundred and twenty for it. It\'s your back room and my ticket. Your call, I suppose, till I pay you.');
      const i = await respond(a, 'nanFerreira', [
        { label: '"It stays in the back till you come for it."', tone: 'straight', save: 'kept' },
        { label: '"A hundred and twenty is a lot of money, Nan."', hint: '(sell it)', tone: 'sly' }
      ]);
      if (i === 1) { t.f.sold = true; change('coin', 120, 'Sold the Gannet Belle\'s wheel to a restaurant in Hyannis'); await say(a, 'It is. It is a lot of money.'); }
      else await say(a, 'Good. The dock\'s nearly done. I\'ll be in with your fifty.');
    },
    async (a, t) => {
      if (t.f.sold) {
        t.end = 'sold'; change('rep', -4);
        await say(a, 'I went over to Hyannis to see it. They\'ve hung a plastic lobster off one of the spokes. A plastic lobster.');
        const i = await respond(a, 'nanFerreira', [
          { label: '"It was a fair price, Nan."', tone: 'straight' },
          { label: '"I\'m sorry. I shouldn\'t have."', tone: 'kind' }
        ]);
        await say(a, i === 0 ? 'It was. That\'s what makes it hard to stay angry. I\'m managing.' : 'Sorry doesn\'t take a lobster off a wheel.');
        return;
      }
      if (t.f.loan) {
        t.end = 'dock'; change('coin', 50, 'Nan Ferreira redeemed the Gannet Belle\'s wheel'); change('rep', 5);
        await say(a, 'Fifty, as agreed. The wheel goes up on the new dock tomorrow. The whole island\'s coming across to watch. Sixty-one people. Two crossings.');
        if (said('nanFerreira', 'kept')) await say(a, 'You said it stays in the back till I came for it. A hundred and twenty on the counter, and it stayed. I won\'t forget that.');
        const i = await respond(a, 'nanFerreira', [
          { label: '"I\'ll come across and see it."', tone: 'straight' },
          { label: '"I\'m glad, Nan. Truly."', tone: 'kind' }
        ]);
        await say(a, i === 0 ? 'Last ferry\'s five. Don\'t miss it. I won\'t wait. I\'ll wait a bit.' : 'Truly. You don\'t have to make a speech.');
        if (isFriend('nanFerreira', 'warm')) await say(a, 'And if you ever need to get to the island after the last crossing, come to the dock and ask. I don\'t do midnight. For you, I might.');
        return;
      }
      t.end = 'scrap';
      await say(a, 'The Belle went to Fall River on a tow. I followed her out as far as the bell buoy. Then I turned round. Somebody had to run the ferry.');
      const i = await respond(a, 'nanFerreira', [
        { label: '"Did you keep anything of hers?"', tone: 'straight' },
        { label: '"That\'s so sad, Nan."', tone: 'kind' }
      ]);
      await say(a, i === 0 ? 'Her bell. The breakers didn\'t ask. I didn\'t say.' : 'It\'s a boat.');
    }
  ],
  epilogue: { dock: 'The Gannet Belle\'s wheel stands on the new ferry dock. Islanders touch it for luck on the way aboard.', sold: 'The Gannet Belle\'s wheel hangs over a bar in Hyannis, with a plastic lobster on it. Nan Ferreira takes the long way round the Cape.', scrap: 'The Gannet Belle was broken up in Fall River. Nan Ferreira kept her bell, and rings it when the fog comes in.' }
});

addRegular('marv', {
  name: 'Marv Kettle', place: 'Kettle Clearances, the van on Front Street', topic: 'house clearances: whose house is being emptied, and what was in the attic',
  look: { skin: '#e0b090', hair: '#3a2a1e', hs: 0, coat: '#4a5a6a', style: 'jacket', pants: '#3a3a3a', hat: 'cap', hatc: '#c84a3a', stout: true },
  meet: 'Marv Kettle, house clearances. When somebody in this town dies or moves to Florida, I\'m the one with the van. Odile bought from me for twenty years.',
  chat: ['Every attic in Hollow Neck has a box marked "DO NOT THROW OUT". Nobody knows what\'s in it. I do.', 'Odile never haggled with me. She just looked at me until I came down ten dollars.', 'Families fight over the silver and leave the photographs. Every time.'],
  small: [
    { say: 'Cleared a house on Elm Street. Six hundred jigsaw puzzles, every one finished, glued and framed. Six hundred.', opts: [
      { label: '"What\'s the market for glued puzzles?"', tone: 'sly', reply: 'There isn\'t one. That\'s why I\'m telling you. Two dollars each, I\'ll do you a deal.' },
      { label: '"Somebody spent a life on those."', tone: 'kind', reply: 'Thirty years. The daughter wants them burned. I\'ve kept the one of the lighthouse.' },
      { label: '"Burn them."', tone: 'sharp', reply: 'You and the daughter would get on.' }] },
    { say: 'There\'s always one thing in a house nobody can explain. The last one had a church pew in the kitchen.', opts: [
      { label: '"Did you ask the family?"', tone: 'straight', reply: 'They said "What pew?" I said "Exactly."' },
      { label: '"What did you get for it?"', tone: 'sly', reply: 'More than you\'d think. Less than I said at the Anchor.' },
      { label: '"Maybe they were very devout cooks."', tone: 'wry', reply: 'Grace before gravy. Could be.' }] },
    { say: 'Two brothers once sawed a sideboard in half rather than let the other have it. I sold both halves.', opts: [
      { label: '"Who got the better half?"', tone: 'wry', reply: 'The left. The left had the drawers.' },
      { label: '"How much for the halves?"', tone: 'sly', reply: 'Forty each. I\'d have got ninety for the whole thing. Brothers.' },
      { label: '"You made money off a family feud."', tone: 'sharp', reply: 'I made money off a sideboard. The feud was free.' }] },
    { say: 'Found Odile\'s handwriting on a pawn ticket in a house last week. From 1971. She was everywhere, Odile.', opts: [
      { label: '"What was pawned?"', tone: 'straight', reply: 'A wedding ring. Redeemed the same week. The marriage lasted fifty years. Not because of the ring, I suppose.' },
      { label: '"Any money in an old ticket?"', tone: 'sly', reply: 'A ticket? No. I kept it anyway. Don\'t tell anyone I keep things.' },
      { label: '"She got around."', tone: 'wry', reply: 'She got everywhere. I\'d clear a house and find she\'d been there first.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. People in my line notice who deals straight and who only says they do.', opts: [
      { label: '"And which am I?"', tone: 'sly', reply: 'The kind I\'d sell to first. Don\'t let it go to your head.' },
      { label: '"I try to."', tone: 'straight', reply: 'Trying\'s most of it. The rest is the van.' }] },
    down: { say: 'I heard about {quest}. I\'m no saint, so I won\'t lecture. I\'ll just say I heard.', opts: [
      { label: '"Fair. It wasn\'t my finest."', tone: 'straight', sway: 1, reply: 'None of us has a finest. Some of us have a less bad.' },
      { label: '"Who asked you?"', tone: 'sharp', sway: -1, reply: 'Nobody. That\'s never stopped me.' }] }
  },
  mend: async a => {
    await say(a, 'Marv Kettle. You remember. The one with the van. I\'ve a crate in it. Not for you.');
    const i = await respond(a, 'marv', [
      { label: 'Buy the crate, sight unseen ($15)', tone: 'sly', disabled: S.coin < 15 },
      { label: '"I treated you badly, Marv."', tone: 'straight' },
      { label: '"Shut the door on your way out."', tone: 'sharp' }]);
    if (i === 0) { change('coin', -15, 'Bought a crate from Marv Kettle, sight unseen'); giveItem(townItem({ name: 'Crate of odds and sods', icon: 'crate', cat: 'curio', guide: 12, condLabel: 'Worn', clue: 'Three egg cups, a doorknob, a tide table from 1986 and a key nobody will ever match.' })); }
    await say(a, ['Sight unseen! Now you\'re talking my language. All right. We\'re all right.', 'You did. I\'ve been treated worse by better. Fine.', 'I\'ll shut it. I\'ll shut it firmly.'][i]);
    return i < 2;
  },
  title: 'Mother\'s House', endings: { sealed: 'Handed Over Sealed', opened: 'Read It First', posted: 'Posted from Plymouth' },
  steps: [
    async (a, t) => {
      await say(a, 'I\'m clearing a house on Cedar Street. It\'s my mother\'s. She went in March. I\'ve put it off six months, which is five months longer than I tell anyone else to.');
      const j = await respond(a, 'marv', [
        { label: '"I\'m sorry about your mother, Marv."', tone: 'kind' },
        { label: '"Six months is a long time to leave a house."', tone: 'straight' },
        { label: '"Family discount, then?"', tone: 'sly' }
      ]);
      await say(a, ['She\'d have said "Don\'t be sorry, be useful." She said it to the minister at Dad\'s funeral.', 'Six months is nothing. I\'ve cleared houses left since Nixon. It\'s different when it\'s your mother\'s kettle.', 'Ha. She\'d have liked you. She haggled with the milkman.'][j]);
      await say(a, 'I can\'t sell her things to strangers. You\'re not a stranger. You\'re a shop.');
      t.f.bowl = await townBuy(a, townItem({ name: 'Pressed-glass punch bowl', icon: 'vase', cat: 'curio', guide: 75, condLabel: 'Fine', clue: 'Heavy, 1930s, not a chip on it. There\'s a doily stuck to the base that nobody has moved in sixty years.' }), 35, 'Bought Marv Kettle\'s mother\'s punch bowl');
      await say(a, t.f.bowl ? 'She got it out twice a year. Christmas, and when the Red Sox won. So, once a year. Mostly.' : 'No, that\'s fine. The dealer in Plymouth will take it. He takes everything.');
    },
    async (a, t) => {
      if (!t.f.bowl) {
        t.f.posted = true;
        await say(a, 'The Plymouth dealer rang. He found an envelope taped under Mother\'s punch bowl. He\'s posting it to me. He says he didn\'t open it. I believe him about half.');
        const i = await respond(a, 'marv', [
          { label: '"Which half?"', tone: 'sly' },
          { label: '"At least it\'s coming back to you."', tone: 'kind' }
        ]);
        await say(a, i === 0 ? 'The half that says he didn\'t read it. The other half says he resealed it nicely.' : 'Second class. She\'d have liked that. She never paid for first.');
        return;
      }
      await narrate('Under the doily, taped flat to the base of the punch bowl: an envelope. In pencil, "For Marvin, when the house is empty."');
      const bowl = S.stock.find(x => x.name === 'Pressed-glass punch bowl');
      const i = await respond(a, 'marv', [
        { label: 'Hand it over sealed', tone: 'straight' },
        { label: 'Hand it over, and the bowl with it', tone: 'kind', disabled: !bowl },
        { label: 'Steam it open first and read it', hint: '(he\'ll be in in a minute)', tone: 'sly' }
      ]);
      if (i === 2) { t.f.how = 'opened'; await narrate('A key, and two lines: "Your father never sold the beach hut on Gannet. I couldn\'t go, and I couldn\'t let it go. It\'s yours."'); await narrate('You seal it again. The flap won\'t lie quite flat.'); }
      else t.f.how = 'sealed';
      if (i === 1) { S.stock = S.stock.filter(x => x !== bowl); renderPanel(); t.f.bowlBack = true; }
      await say(a, 'Under the bowl? She told me where every key in that house was, and she never told me that.');
      const j = await respond(a, 'marv', [
        { label: '"Aren\'t you going to open it?"', tone: 'straight' },
        { label: '"Want me to read it out?"', tone: 'sly' }
      ]);
      await say(a, j === 0 ? 'Not here. Not in a shop. No offence.' : 'Ha. No. You\'d read it the way you read price tags.');
      await narrate('He puts the envelope in his inside pocket without looking at it.');
    },
    async (a, t) => {
      if (t.f.posted) { t.end = 'posted'; await say(a, 'The letter came from Plymouth. Mother kept Dad\'s beach hut on Gannet all these years. There was a key. I went over on Nan\'s ferry. It\'s full of his fishing rods. Nobody\'s touched them since 1974.'); }
      else if (t.f.how === 'opened') {
        t.end = 'opened'; change('rep', -3);
        await say(a, 'Dad\'s beach hut on Gannet. She kept it. But you knew that, didn\'t you. The flap was wet.');
        const i = await respond(a, 'marv', [
          { label: '"I\'m sorry, Marv. I looked."', tone: 'straight', sway: 1 },
          { label: '"I don\'t know what you mean."', tone: 'sly', sway: -1 }
        ]);
        await say(a, i === 0 ? 'I know. Everybody looks. You\'re the first who said so.' : 'Course not. Nor do I. Nor did the steam.');
        await say(a, 'I\'m not angry. I clear houses. I know people look.');
        return;
      } else {
        t.end = 'sealed'; change('rep', t.f.bowlBack ? 6 : 4);
        await say(a, 'Mother kept Dad\'s beach hut on Gannet. Forty years, and she never said. There was a key in the envelope. His fishing rods are still in it.');
        if (t.f.bowlBack) await say(a, 'The punch bowl\'s in the hut now. On the windowsill. I don\'t know what I\'ll put in it. Probably nothing.');
      }
      const i = await respond(a, 'marv', [
        { label: '"Will you keep the hut?"', tone: 'straight' },
        { label: '"Old rods sell well, you know."', tone: 'sly' },
        { label: '"I\'m glad she left you something."', tone: 'kind' }
      ]);
      await say(a, ['Keep it, sit in it, never fish. That\'s the plan.', 'They do. I know exactly how well. That\'s why I\'m not telling you.', 'She left me a house full of everything. This is the only bit I wanted.'][i]);
      if (isFriend('marv', 'warm')) await say(a, 'Here\'s a thing. Next house I clear, you get first look before Plymouth does. Don\'t tell Plymouth.');
    }
  ],
  epilogue: { sealed: 'Marv Kettle spends his Sundays in his father\'s beach hut on Gannet, and has stopped clearing houses on Sundays.', opened: 'Marv Kettle still sells to the Crooked Scale. He tapes his own envelopes shut now, twice.', posted: 'Marv Kettle found his father\'s beach hut by a letter posted from Plymouth. He sends the dealer a Christmas card.' }
});

addRegular('felix', {
  name: 'Felix Amory', place: 'the ghost walk, from the Green at dusk', topic: 'the town\'s legends, and the tourists who come for them',
  look: { skin: '#f0d0b8', hair: '#2a1e16', hs: 5, coat: '#1a1a22', trim: '#8a1a2a', style: 'suit', long: true, pants: '#1a1a22', hat: 'wide', hatc: '#1a1a22', band: '#8a1a2a' },
  meet: 'Felix Amory. The Hollow Neck Ghost Walk, seven o\'clock from the Green, twelve dollars, children half. I tell the town\'s stories. Some of them happened.',
  chat: ['A tourist asked me if the Crooked Scale is haunted. I said "Which part?" She tipped me ten dollars.', 'Every town has a lady in grey. Ours has three. They don\'t get on.', 'Tourists ask me where to get chowder. I tell them the truth. Then they go to the place on Route 1 anyway.'],
  small: [
    { say: 'A tourist asked me tonight if ghosts can cross water. I said only on the ferry. She asked for the timetable.', opts: [
      { label: '"Can they?"', tone: 'straight', reply: 'Officially, no. Unofficially, ask Nan who sits in the back row on the last crossing.' },
      { label: '"Did she catch the ferry?"', tone: 'wry', reply: 'She caught it. I don\'t know about the ghost.' },
      { label: '"You shouldn\'t tease the tourists."', tone: 'kind', reply: 'Teasing them is what they pay for. Twelve dollars, children half.' }] },
    { say: 'I\'m writing a book of the walk. Chapter one is the bell. Chapter two is also the bell. It\'s a good bell.', opts: [
      { label: '"Put me in chapter three."', tone: 'wry', reply: 'Chapter three is the public toilets on the Green. Choose your words.' },
      { label: '"Will it sell?"', tone: 'straight', reply: 'Forty copies. Thirty to my mother.' },
      { label: '"I\'d read it."', tone: 'kind', reply: 'You say that now. Wait till chapter two.' }] },
    { say: 'Somebody\'s been following the walk. Not on it. Behind it. Same long coat every night.', opts: [
      { label: '"A ghost?"', tone: 'wry', reply: 'Worse. A competitor.' },
      { label: '"Have you told the police?"', tone: 'straight', reply: 'And say what? "A man is walking on a public street, near me, rudely"?' },
      { label: '"Be careful, Felix."', tone: 'kind', reply: 'I\'m always careful. It\'s the walk that isn\'t.' }] },
    { say: 'Every legend in this town has three versions. The true one, the one the family tells, and mine. Mine sells.', opts: [
      { label: '"Which one\'s the true one?"', tone: 'straight', reply: 'Usually the dullest. That\'s how you can tell.' },
      { label: '"Tell me yours about the lighthouse."', tone: 'wry', reply: 'Twelve dollars. Children half. You\'re not a child. You\'re close.' },
      { label: '"That doesn\'t seem fair to the families."', tone: 'kind', reply: 'The families get in free. They come every year to check I\'ve got it wrong.' }] }
  ],
  reckon: {
    up: { say: 'I heard how {quest} ended. It\'s going in the walk. Don\'t worry, I\'ll make you taller.', opts: [
      { label: '"Make me mysterious, too."', tone: 'wry', reply: 'Done. Mysterious, taller, and seen only at dusk.' },
      { label: '"Leave me out of it."', tone: 'straight', reply: 'Too late. You\'re a stop.' }] },
    down: { say: 'I heard how {quest} ended. It\'s going in the walk. You\'re not the hero of it.', opts: [
      { label: '"Every story needs a villain. Make me a good one."', tone: 'wry', sway: 1, reply: 'A good villain! A sorry one. I can work with sorry. Tourists love sorry.' },
      { label: '"Keep my name out of your walk."', tone: 'straight', sway: -1, reply: 'Names are public. Stories are mine.' }] }
  },
  mend: async a => {
    await say(a, 'Felix Amory. I\'ve been telling a story about you on the walk. It isn\'t flattering.');
    const i = await respond(a, 'felix', [
      { label: '"Give it a better ending. I\'m sorry."', tone: 'wry' },
      { label: 'Buy two tickets for tonight\'s walk ($24)', disabled: S.coin < 24 },
      { label: '"Tell what you like."', tone: 'sharp' }]);
    if (i === 1) change('coin', -24, 'Bought two tickets for the ghost walk');
    await say(a, ['A redemption. Tourists love those. Fine. You\'re redeemed by Thursday.', 'Two tickets! You\'ll have to come. You\'ll have to stand there while I tell it. I\'ll change the ending.', 'I will. I always do.'][i]);
    return i < 2;
  },
  title: 'Stop Number Nine', endings: { odile: 'Odile on the Tour', tall: 'The Haunted Pawnshop', off: 'Not on the Route' },
  steps: [
    async (a, t) => {
      await say(a, 'I want the Crooked Scale on the walk. Stop nine, between the Customs House and the bell. I need something in your window I can point at. Something with a past.');
      const j = await respond(a, 'felix', [
        { label: '"Everything in here has a past. Some of it\'s even true."', tone: 'wry' },
        { label: '"How many tourists will that bring?"', tone: 'straight' },
        { label: '"Do you believe the stories you tell?"', tone: 'kind' }
      ]);
      await say(a, ['Oh, I like you. Most shopkeepers just ask "How many people?"', 'Twelve a night, in season. Four in fog. They don\'t buy. They look at things in the dark.', 'I believe them while I\'m telling them. That\'s the trick. And the job.'][j]);
      const opts = townTakeFromStock(it => it.guide <= 90).slice(0, 2);
      const i = await choose([...opts.map(it => ({ label: `Sell him the ${it.name.toLowerCase()} for ${money(it.guide)}`, hint: '(it stays in your window, as his)' })), '"Point at the door. It\'s old."']);
      if (i < opts.length) { const it = opts[i]; S.stock = S.stock.filter(x => x !== it); S.stats.sold++; renderPanel(); change('coin', it.guide, `Sold Felix Amory a ${it.name.toLowerCase()} for the ghost walk`); t.f.prop = true; await say(a, 'Perfect. I\'ll give it a name. Things on the walk need names.'); }
      else await say(a, 'The door. Hm. The door\'s good. Doors are underrated.');
    },
    async (a, t) => {
      await say(a, 'Now the story. Tourists don\'t come for a shop. They come for what happened in it. What happened in it?');
      const i = await respond(a, 'felix', [
        { label: 'Tell him about Odile, and the cigar boxes she never threw out', tone: 'kind' },
        { label: 'Make one up: a drowned sea captain who haggles at closing time', tone: 'wry' },
        { label: '"Nothing happened. It\'s a shop."', tone: 'straight' }
      ]);
      t.f.story = ['odile', 'tall', 'off'][i];
      await say(a, i === 0 ? 'Cigar boxes. Forty years of "not yet". Better than a ghost story.' : i === 1 ? 'A haggling ghost! Oh, they\'ll love that. I love that. I\'m going to say I saw him.' : 'Everybody says that. Then something happens.');
      if (t.f.story === 'off') return;
      await say(a, 'Would you tell it yourself? To the walk? Just once, on the step, in the dark?');
      const j = await respond(a, 'felix', [
        { label: '"Only if I get to wear the hat."', tone: 'wry', save: 'hat' },
        { label: '"No. That\'s your job."', tone: 'straight' }
      ]);
      await say(a, j === 0 ? 'You can wear the hat. You can\'t keep the hat. Nobody keeps the hat.' : 'Fair. It\'s my only job.');
    },
    async (a, t) => {
      if (t.f.story === 'odile') { t.end = 'odile'; change('rep', 4); await say(a, 'Twelve people stood outside your window last night while I told them about Odile. Nobody screamed. One woman cried. That\'s better than screaming.'); }
      else if (t.f.story === 'tall') { t.end = 'tall'; change('coin', 30, 'Ghost-walk tourists bought souvenirs'); change('rep', -1); await say(a, 'They come in after the walk asking for the haggling captain, and they buy something to get out of the shop with dignity. You\'re welcome. I think.'); }
      else { t.end = 'off'; await say(a, 'Stop nine is the public toilets on the Green now. They\'re haunted in their own way.'); }
      if (t.f.prop && t.end !== 'off') await say(a, 'And I point at the thing in your window. I\'ve called it "the Widow\'s Last Purchase". Nobody\'s asked which widow.');
      if (said('felix', 'hat') && t.end !== 'off') await say(a, 'And you, on the step, in the hat. Two of them asked for your autograph. I signed it for you. Don\'t worry, I did it well.');
      const i = await respond(a, 'felix', t.end === 'off' ? [
        { label: '"Maybe next year."', tone: 'kind' },
        { label: '"The toilets suit the walk better."', tone: 'wry' }
      ] : [
        { label: t.end === 'odile' ? '"She\'d have hated the fuss."' : '"Does the captain get a cut?"', tone: 'wry' },
        { label: '"It\'s not really true, though."', tone: 'straight' }
      ]);
      await say(a, t.end === 'off' ? ['Next year. I\'ll hold stop nine. Well. The toilets will.', 'They do get the crowds.'][i]
        : i === 0 ? (t.end === 'odile' ? 'She\'d have stood at the back and corrected me. I\'d have let her.' : 'He\'s dead. He works for tips.')
        : 'Nothing on the walk is "true". It\'s told. That\'s different, and it\'s better.');
      if (isFriend('felix', 'warm')) await say(a, 'Here\'s a thing. Some nights I\'ll stop the walk at your window and let them look in. Thirty tourists with nothing to do but buy. Leave the lights on.');
    }
  ],
  epilogue: { odile: 'Stop nine on the Hollow Neck Ghost Walk is the Crooked Scale, and the story is Odile\'s. Felix Amory says it\'s the only true stop on the route.', tall: 'Tourists come to the Crooked Scale after dark asking for the captain who haggles. You\'ve started haggling in a deeper voice.', off: 'The Ghost Walk goes past the Crooked Scale without stopping. Felix Amory tips his hat to the window anyway.' }
});

addRegular('gus', {
  name: 'Gus Lindqvist', place: 'the stone chess tables on the Green', topic: 'the Green, and the old men on its benches',
  look: { skin: '#e8c8a8', hair: '#d8d8d0', hs: 2, coat: '#3a4a3a', style: 'jacket', trim: '#c8a050', hat: 'cap', hatc: '#2a2a2a', beard: '#d8d8d0', pants: '#4a4038' },
  meet: 'Gus Lindqvist. Chess on the Green, every day it isn\'t raining and most days it is. Five dollars a game. Undefeated since the Carter administration.',
  chat: ['Every bench on the Green has its man. When a man goes, his bench stays empty for a year. That\'s the rule. Nobody wrote it down.', 'Odile played me once. She lost on purpose. I could tell. I\'ve never forgiven her.', 'Never play a man who brings his own clock.'],
  small: [
    { say: 'Oskar has played the same opening for forty years. It doesn\'t work. He says it will.', opts: [
      { label: '"Tell him it doesn\'t work."', tone: 'straight', reply: 'I have. Every Tuesday since 1986.' },
      { label: '"Maybe he\'s waiting you out."', tone: 'wry', reply: 'Then he\'ll be playing alone. That opening won\'t beat a pigeon.' },
      { label: '"Let him win one, Gus."', tone: 'kind', reply: 'Odile tried that with me. Look how I turned out.' }] },
    { say: 'A boy beat me on Saturday. Twelve years old. I shook his hand, went home, and lay down.', opts: [
      { label: '"Good for him."', tone: 'straight', reply: 'Good for him. Bad for my afternoon.' },
      { label: '"Did he bring his own clock?"', tone: 'wry', reply: 'He brought his own clock. I should have known.' },
      { label: '"Rematch him. For money."', tone: 'sly', reply: 'A child? I\'m a hustler, not a monster.' }] },
    { say: 'There\'s a new man sitting on the bench by the war memorial. Nobody\'s told him it\'s still in its year.', opts: [
      { label: '"Tell him gently."', tone: 'kind', reply: 'Gently. I\'ve never done anything gently. I\'ll send Oskar.' },
      { label: '"He\'ll work it out."', tone: 'straight', reply: 'He will. The pigeons will tell him.' },
      { label: '"Play him for it."', tone: 'sly', reply: 'Play a man for a dead man\'s bench? No. Maybe. No.' }] },
    { say: 'Sellers sit on the benches before they come to you. I see their faces. I know who\'ll take less.', opts: [
      { label: '"Tell me, next time."', tone: 'sly', reply: 'For a game, I might. For five dollars, I might sooner.' },
      { label: '"That\'s their business, Gus."', tone: 'straight', reply: 'It\'s the Green\'s business. The Green sees everything.' },
      { label: '"Poor souls."', tone: 'kind', reply: 'Some of them. Some of them are lying to you, and I can see that too.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. On the benches. They don\'t agree on much. They agreed on that.', opts: [
      { label: '"It was the honest move."', tone: 'straight', reply: 'It was. Not always the winning one. This time it was both.' },
      { label: '"Thank them for me."', tone: 'kind', reply: 'I won\'t. They\'d get ideas. I\'ll nod.' }] },
    down: { say: 'I heard about {quest}, on the benches. Even Oskar shook his head, and Oskar opens with the pawn on the edge.', opts: [
      { label: '"I made a bad move."', tone: 'straight', sway: 1, reply: 'Everybody does. It\'s the next move people remember.' },
      { label: '"The benches should mind the board."', tone: 'sly', sway: -1, reply: 'The benches are the board, here.' }] }
  },
  mend: async a => {
    await say(a, 'Gus. You know where to find me. On the bench. I came in for a pencil.');
    const i = await respond(a, 'gus', [
      { label: 'Ask for a game, and pay the $5', disabled: S.coin < 5 },
      { label: '"I owe you an apology, Gus."', tone: 'straight' },
      { label: '"Pencils are by the till."', tone: 'sly' }]);
    if (i === 0) change('coin', -5, 'Lost a game of chess to Gus Lindqvist');
    await say(a, ['Sit. You\'re white. You\'ll lose. That\'s how we make up, on the Green.', 'You do. Thank you. Paid in full. Pencil\'s on me.', 'So they are.'][i]);
    return i < 2;
  },
  title: 'The White Knight', endings: { quiet: 'Back on the Board', told: 'Told the Club', sold: 'Twenty Dollars, and Mate' },
  steps: [
    async (a, t) => {
      await say(a, 'The Green Chess Club has a walnut set from 1931. It lost a white knight at the county final in 1979. We\'ve played with a salt shaker ever since. Forty-seven years of salt.');
      const j = await respond(a, 'gus', [
        { label: '"Who lost it?"', tone: 'straight' },
        { label: '"A salt shaker\'s a fine knight. It moves funny."', tone: 'wry' }
      ]);
      await say(a, j === 0 ? 'Nobody lost it. It was taken. At the county final. That\'s the story.' : 'It moves exactly like a knight. It just tastes better.');
      await say(a, 'You\'ve got Odile\'s back room. If a walnut knight turns up with "H.N.C.C." scratched under it, I\'d like to hear.');
      const i = await respond(a, 'gus', [
        { label: '"I\'ll look in the back tonight."', tone: 'straight', save: 'look' },
        { label: '"I\'ll keep an eye out."', tone: 'kind' },
        { label: '"What\'s it worth to the club?"', tone: 'sly' }
      ]);
      await say(a, ['Tonight. Good. Most people say "sometime".', 'An eye. Fine. Keep it on the cigar boxes. Odile kept everything in cigar boxes.', 'More than to you. Which is why I\'m asking nicely and not paying.'][i]);
    },
    async (a, t) => {
      await narrate('In the back, in a cigar box marked "1979, NOT YET": a white walnut knight, H.N.C.C. scratched under the base. Under it, a ticket in Odile\'s hand: "G. Lindqvist. Chess piece. $2. Rent."');
      await say(a, 'You found it. And the ticket. Ah.');
      await say(a, 'I had a bad winter in 1979. I meant to come back for it. Then it had been gone too long to explain. So I said it was stolen at the county final. I said it for forty-seven years.');
      if (said('gus', 'look')) await say(a, 'You said you\'d look that night. You did. I almost wish you hadn\'t.');
      const i = await respond(a, 'gus', [
        { label: '"Why not just tell them?"', tone: 'straight' },
        { label: '"Everybody has a bad winter."', tone: 'kind' },
        { label: '"Forty-seven years is a long con, Gus."', tone: 'sly' }
      ]);
      await say(a, ['Because the first year it was embarrassing. The tenth it was a lie. By the fortieth it was history.', 'Not everybody pawns the club\'s knight in it.', 'It wasn\'t a con. It was a... yes. It was a con.'][i]);
      t.f.found = true;
    },
    async (a, t) => {
      await say(a, 'Before you say anything. Do you think I\'m a liar?');
      const j = await respond(a, 'gus', [
        { label: '"I think you were embarrassed."', tone: 'kind' },
        { label: '"Yes. For forty-seven years."', tone: 'straight' },
        { label: '"Everybody lies, Gus."', tone: 'sly' }
      ]);
      await say(a, ['Embarrassed for forty-seven years. That\'s a long blush.', 'Thank you. Nobody\'s said it. It\'s a relief, like taking off a shoe.', 'That\'s what liars say. I\'d know.'][j]);
      await say(a, 'So. Two dollars on the ticket, plus forty-seven years. What do I owe you?');
      const i = await respond(a, 'gus', [
        { label: '"Nothing. Put it back on the board. Nobody needs the ticket."', tone: 'kind' },
        { label: '"Nothing. But tell the club."', tone: 'straight' },
        { label: '"Two on the ticket, and twenty for the trouble."', tone: 'sly' }
      ]);
      if (i === 0) { t.end = 'quiet'; change('rep', 5); await say(a, 'Back on the board. I\'ll say it turned up in a coat pocket. It\'s even nearly true.'); }
      else if (i === 1) { t.end = 'told'; change('rep', 2); await say(a, 'I told them. Oskar laughed so hard he lost on time. Then they voted me club treasurer. They said I know what money\'s for.'); }
      else { t.end = 'sold'; change('coin', 22, 'Gus Lindqvist redeemed a chess knight pawned in 1979'); await say(a, 'Twenty-two dollars. Fair. Expensive, but fair. Mate in one, as they say. They don\'t say that.'); }
      if (isFriend('gus', 'warm') && t.end !== 'sold') await say(a, 'And listen. Some afternoon a seller will be on my bench, making up their mind. If you want, I\'ll come in and sit by the window. They come down a bit when I\'m watching. Everybody does.');
    }
  ],
  epilogue: { quiet: 'The Green Chess Club plays with all thirty-two pieces again. Gus Lindqvist says the knight turned up in a coat pocket.', told: 'Gus Lindqvist, treasurer of the Green Chess Club, keeps the books in pencil. He says it\'s so he can change his mind.', sold: 'Gus Lindqvist redeemed his knight for twenty-two dollars. He charges six dollars a game now, to make it back.' }
});

addRegular('dunphy', {
  name: 'Officer Dunphy', place: 'the front desk at the police station', topic: 'the station: who got pulled over, and what came in to lost property',
  look: { skin: '#f0c8a8', hair: '#c86a3a', hs: 0, coat: '#22305a', trim: '#e2c04a', style: 'uniform', pants: '#1a2240', moustache: '#c86a3a' },
  meet: 'Officer Kenny Dunphy, Hollow Neck Police. I\'m not here officially. I\'m never here officially. I just like the shop.',
  chat: ['Captain Barrow says my face tells everyone what I\'m thinking. Right now I\'m thinking about lunch.', 'Lost property this week: four umbrellas, a set of false teeth and a goat. The goat\'s been claimed.', 'I pulled over a selectman on Tuesday. I let him go. He let me know he\'d let me go.'],
  small: [
    { say: 'Somebody stole a lawn flamingo on Elm Street. Then brought it back. In a hat. I\'ve opened a file.', opts: [
      { label: '"Any suspects?"', tone: 'straight', reply: 'Teenagers. Or the Pennicks. Or a teenage Pennick.' },
      { label: '"The case of the century, Kenny."', tone: 'wry', reply: 'Don\'t. The Captain already said that. Not nicely.' },
      { label: '"I hope the flamingo\'s all right."', tone: 'kind', reply: 'It\'s fine. It looks better in the hat. Don\'t tell anyone I said that.' }] },
    { say: 'The Captain says a good officer knows every face on the beat. I know every dog. Is that close?', opts: [
      { label: '"It\'s a good start."', tone: 'kind', reply: 'That\'s what I said! The Captain said "Dunphy." Just "Dunphy."' },
      { label: '"Dogs don\'t steal much."', tone: 'straight', reply: 'You haven\'t met the terrier on Cedar Street.' },
      { label: '"Want me to point out a few faces?"', tone: 'sly', reply: 'Is that... is that a bribe? I can\'t tell. I\'ll say no to be safe.' }] },
    { say: 'Lost property got a violin case on Tuesday. No violin. Just a sandwich. Very old.', opts: [
      { label: '"What kind of sandwich?"', tone: 'wry', reply: 'Evidence. I\'m not allowed to say. Egg.' },
      { label: '"Somebody misses that case."', tone: 'kind', reply: 'That\'s what I thought. I put a notice up. Somebody came in and claimed the sandwich.' }] },
    { say: 'If anything ever comes across your counter that feels wrong, you can just ring me. Not the station. Me.', opts: [
      { label: '"I will, Kenny."', tone: 'kind', save: 'ring', reply: 'Good. My number\'s on the back of a parking ticket. I\'ll bring you one. A blank one.' },
      { label: '"Wrong to who?"', tone: 'sly', reply: 'To you. You\'d know. You\'ve got the face for it. Not like me.' },
      { label: '"That\'s not how it works."', tone: 'straight', reply: 'It\'s how it works with me. It\'s why I\'m not a sergeant.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest} at the station. The Captain said "Huh." You know what that means, from her.', opts: [
      { label: '"Good \'huh\' or bad \'huh\'?"', tone: 'straight', reply: 'Good. Short. The bad one\'s longer, with your name in it.' },
      { label: '"Thanks for telling me, Kenny."', tone: 'kind', reply: 'I\'m not telling you. I\'m not here officially.' }] },
    down: { say: 'I heard about {quest} at the station. I\'m not here officially. But I heard it officially.', opts: [
      { label: '"I\'ll do better, Kenny."', tone: 'kind', sway: 1, reply: 'I hope so. I like the shop. I\'d like to keep liking it.' },
      { label: '"Is that a threat, Officer?"', tone: 'sly', sway: -1, reply: 'No. Yes. I don\'t know. It\'s a feeling. I\'m having it at you.' }] }
  },
  mend: async a => {
    await say(a, 'Officer Dunphy. I\'m on duty. Sort of. More than usual.');
    const i = await respond(a, 'dunphy', [
      { label: '"Kenny, I owe you an apology."', tone: 'kind' },
      { label: 'Put $10 in the Police Benevolent tin', disabled: S.coin < 10 },
      { label: '"Are we done, Officer?"', tone: 'sly' }]);
    if (i === 1) change('coin', -10, 'Put $10 in the Police Benevolent tin');
    await say(a, ['Oh. Okay. Nobody apologizes to me. Usually it\'s the other way round. Okay!', 'For the widows and orphans. And the Christmas party. Mostly the party. Thanks. We\'re good.', 'We\'re done.'][i]);
    return i < 2;
  },
  title: 'The Sergeant\'s Exam', endings: { sergeant: 'Sergeant Dunphy', retake: 'Next Spring', parking: 'Parking Duty' },
  steps: [
    async (a, t) => {
      await say(a, 'I\'m sitting the sergeant\'s exam. Section four is stolen and counterfeit property. The Captain says ask a pawnbroker, because a pawnbroker sees it all first.');
      const j = await respond(a, 'dunphy', [
        { label: '"Happy to help, Kenny."', tone: 'kind' },
        { label: '"Ask away."', tone: 'straight' },
        { label: '"What\'s it worth to you?"', tone: 'sly' }
      ]);
      await say(a, ['Really? Most people say "Is this about the parking?"', 'Okay. Okay. I wrote them down. I can\'t read my writing. It\'s fine.', 'A... I can\'t pay you. I\'m a police officer. Is that a test? Was that section four?'][j]);
      await say(a, 'So. How do you tell a fake?');
      const i = await respond(a, 'dunphy', [
        { label: '"You look. Marks, seams, weight. Then you look again."', tone: 'straight' },
        { label: '"If the price is too good, it\'s fake."', tone: 'sly' },
        { label: '"Honestly, Kenny? A feeling."', tone: 'kind' }
      ]);
      t.f.a = i === 0;
      await say(a, i === 0 ? 'Marks, seams, weight, look again. I\'m writing that on my hand.' : i === 1 ? 'Too good, fake. Short. I like short.' : 'A feeling. I get a lot of feelings. Most of them are lunch.');
    },
    async (a, t) => {
      await say(a, 'Practice question. Lost property sent me this. Real gold or not?');
      view.counterIcon = 'ring';
      await narrate('A man\'s signet ring, heavy for its size. Inside the band, faint: 14K, and a maker\'s mark. Where the edge is worn, it\'s the same yellow all the way through.');
      const i = await respond(a, 'dunphy', [
        { label: '"Real. Look at the wear: same color all the way down."', tone: 'straight' },
        { label: '"Fake. Nothing that heavy is in lost property by accident."', tone: 'sly' },
        { label: '"Ask the Captain."', tone: 'kind' }
      ]);
      view.counterIcon = null;
      t.f.b = i === 0;
      await say(a, i === 0 ? 'Same color all the way down. Oh. Oh, that\'s good. That\'s a real thing you can check.' : i === 1 ? 'That\'s what I said. I didn\'t want to say it first.' : 'I can\'t ask the Captain. She\'ll know I don\'t know.');
      await say(a, 'Can I ask you one off the exam? Do you ever buy things you know are stolen?');
      const j = await respond(a, 'dunphy', [
        { label: '"Never knowingly."', tone: 'straight', save: 'never' },
        { label: '"Is this off the record, Kenny?"', tone: 'sly', save: 'offRecord' },
        { label: '"Sometimes people need the money more than the law needs the watch."', tone: 'kind' }
      ]);
      await say(a, ['Knowingly. That\'s the word, isn\'t it. That\'s the whole of section four.', 'Everything I say is off the record. Nobody keeps a record of me.', 'That\'s... yeah. That\'s the part they don\'t put in the exam.'][j]);
    },
    async (a, t) => {
      const score = (t.f.a ? 1 : 0) + (t.f.b ? 1 : 0);
      if (score === 2) { t.end = 'sergeant'; change('rep', 3); change('heat', -5); await say(a, 'I passed. Section four, full marks. The Captain said "Huh." That\'s the nicest thing she\'s ever said to me. Sergeant Dunphy. Say it. No, don\'t.'); }
      else if (score === 1) { t.end = 'retake'; change('rep', 1); await say(a, 'Missed it by two points. Section four. I\'ll sit it again in the spring. I\'m keeping the ring question on my fridge.'); }
      else { t.end = 'parking'; await say(a, 'I didn\'t pass. They\'ve put me on parking for the winter. It\'s fine. It\'s outdoors. Everybody\'s pleased to see me, right up until they aren\'t.'); }
      if (t.end === 'sergeant' && said('dunphy', 'offRecord')) await say(a, 'You asked me once if things were off the record. I remember things now. It\'s part of the job. I\'m sorry. I\'m not sorry. I\'m a sergeant.');
      const i = await respond(a, 'dunphy', t.end === 'sergeant' ? [
        { label: '"Congratulations, Sergeant."', tone: 'kind' },
        { label: '"Will you be checking my shelves now?"', tone: 'sly' }
      ] : [
        { label: '"You\'ll get it next time, Kenny."', tone: 'kind' },
        { label: '"Two points. That stings."', tone: 'straight' }
      ]);
      await say(a, t.end === 'sergeant' ? ['You said it. I told you not to. Say it again.', 'Oh. I hadn\'t thought of that. I\'m thinking of it now.'][i]
        : ['You think? Thanks. I\'ll do your street last.', 'It does. Right here. I\'m pointing at my whole self.'][i]);
      if (isFriend('dunphy', 'warm')) await say(a, 'And, off the record. If the Captain\'s ever on her way over here, I might ring the shop first. Wrong number. You didn\'t hear that.');
    }
  ],
  epilogue: { sergeant: 'Sergeant Kenny Dunphy keeps a loupe in his top pocket and checks every ring that comes into lost property.', retake: 'Officer Dunphy sits the sergeant\'s exam again in the spring. Section four is on his fridge.', parking: 'Officer Dunphy writes parking tickets on Front Street all winter. He never writes one outside the Crooked Scale.' }
});

addRegular('otis', {
  name: 'Otis Pelletier', place: 'the post office, and every porch in town', topic: 'the mail: letters, parcels, and who\'s hearing from where',
  look: { skin: '#b88060', hair: '#1a1a1a', hs: 1, coat: '#3a4a6a', trim: '#c84a3a', style: 'jacket', pants: '#3a4a6a', hat: 'cap', hatc: '#3a4a6a', bag: '#6a4a2a' },
  meet: 'Otis Pelletier. Your mailman. I\'ve brought this shop its bills for eleven years and never once a check. I live in hope.',
  chat: ['Mrs. Okonjo gets a postcard from her sister every Tuesday. I only read the fronts. Everybody reads the fronts.', 'I know which dogs bite, which porches sag, and which letters people pretend they never got.', 'The post office has had the same wanted poster up since 1994. He\'d be seventy now. I check every face on the route.'],
  small: [
    { say: 'There\'s a dog on Bay Street that waits for me every day to bark at me. If I\'m late, it looks worried.', opts: [
      { label: '"It loves you, Otis."', tone: 'kind', reply: 'It loves barking at me. That\'s close enough, at my age.' },
      { label: '"Bark back."', tone: 'wry', reply: 'I did once. It looked so hurt. I bring it a biscuit now. It still barks.' },
      { label: '"Sounds like a lawsuit waiting."', tone: 'sharp', reply: 'Everything does, to the post office.' }] },
    { say: 'There\'s a woman on my route who\'s written herself a letter every birthday for forty years. She opens them very slowly.', opts: [
      { label: '"What does she write?"', tone: 'straight', reply: 'I don\'t know. I only see the fronts. Her handwriting\'s got shakier and kinder.' },
      { label: '"That\'s lovely."', tone: 'kind', reply: 'It is. I make sure hers is on top that day.' },
      { label: '"Saves on friends."', tone: 'wry', reply: 'That\'s what she says. Word for word.' }] },
    { say: 'Every December I get letters for Santa. I answer the ones with drawings. The post office says not to. The post office can write to me.', opts: [
      { label: '"What do they ask for?"', tone: 'straight', reply: 'Ponies. Phones. One wanted his dad home off the boats by Christmas. I couldn\'t do anything about that one.' },
      { label: '"You\'re a soft touch, Otis."', tone: 'wry', reply: 'Hard as nails. I\'m eating a candy cane.' },
      { label: '"That\'s kind of you."', tone: 'kind', reply: 'It\'s the job. Nobody told me it wasn\'t.' }] },
    { say: 'If you\'re ever waiting on something, an envelope from the court, a check, a parcel, tell me. I can\'t make it come quicker. I can make sure it\'s on top.', opts: [
      { label: '"I\'ll remember that."', tone: 'kind', save: 'onTop', reply: 'Good. Most people don\'t. Then they wonder why I look hurt.' },
      { label: '"Is that allowed?"', tone: 'straight', reply: 'Putting mail on top? It\'s practically the whole job.' },
      { label: '"Can you make the bills come slower?"', tone: 'wry', reply: 'Everyone asks. I\'ve tried. They find a way.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I hear everything on the route, a day before the paper.', opts: [
      { label: '"What are people saying?"', tone: 'straight', reply: 'That you did right. On porches, mostly. Porches are honest.' },
      { label: '"Put it on the front of a postcard."', tone: 'wry', reply: 'I\'ll put it on the front of every postcard. Nobody reads the backs.' }] },
    down: { say: 'I heard about {quest}. I hear everything on the route. I wish some of it had stayed in the envelope.', opts: [
      { label: '"So do I, Otis."', tone: 'kind', sway: 1, reply: 'Well. That\'s honest. Here\'s your mail. Nothing bad in it, I checked the fronts.' },
      { label: '"Mind your route."', tone: 'sharp', sway: -1, reply: 'My route is your street.' }] }
  },
  mend: async a => {
    await say(a, 'Your mail.');
    await narrate('He leaves it on the counter and doesn\'t stop to talk.');
    const i = await respond(a, 'otis', [
      { label: '"Otis, I\'m sorry. I was rude."', tone: 'kind' },
      { label: 'Buy a book of stamps from him ($9)', disabled: S.coin < 9 },
      { label: '"Just leave it on the counter."', tone: 'sharp' }]);
    if (i === 1) change('coin', -9, 'Bought a book of stamps from Otis Pelletier');
    await say(a, ['Oh, that\'s all right. Dogs bite me all the time. I keep coming back.', 'Stamps! Nobody buys stamps. You\'re forgiven, and you\'re strange.', 'I did.'][i]);
    return i < 2;
  },
  title: 'Return to Sender', endings: { posted: 'Return to Sender', shelf: 'On the Shelf', unclaimed: 'Dead Letter' },
  steps: [
    async (a, t) => {
      await say(a, 'They moved the sorting frame at the post office and found this behind it. Addressed to Odile, at this shop. Postmarked Lisbon, 1987. I\'m very sorry. It isn\'t my fault, but I\'m sorry.');
      const j = await respond(a, 'otis', [
        { label: '"Thirty-nine years late. Is that a record?"', tone: 'wry' },
        { label: '"It\'s not your fault, Otis."', tone: 'kind' },
        { label: '"Who\'s it from?"', tone: 'straight' }
      ]);
      await say(a, ['The record\'s 1931. A postcard from Niagara. "Wish you were here." They weren\'t, by then.', 'No. But I\'m the one holding it. That\'s the job.', 'Just "M." I only read the fronts. This once, I read the back. Forgive me.'][j]);
      view.counterIcon = 'letter';
      await narrate('One page, in a careful hand: "Odile, keep the blue box for me until I come for it. Don\'t open it. You\'ll want to. M."');
      view.counterIcon = null;
      const i = await respond(a, 'otis', [
        { label: 'Look for a blue box in the back', tone: 'kind' },
        { label: 'Put the letter in the drawer', tone: 'straight' }
      ]);
      t.f.look = i === 0;
      await say(a, i === 0 ? 'I\'ll wait. No I won\'t, I\'ve got the whole of Front Street. Tell me next time.' : 'Fair. It\'s waited thirty-nine years. It\'s good at it.');
    },
    async (a, t) => {
      if (!t.f.look) {
        await say(a, 'Did you ever look for that blue box? No? I keep thinking about it on the route. Somebody\'s still waiting on that.');
        const i = await respond(a, 'otis', [
          { label: '"Maybe some things should stay lost."', tone: 'wry' },
          { label: '"I haven\'t had time, Otis."', tone: 'straight' }
        ]);
        await say(a, i === 0 ? 'Maybe. It\'s not the post office\'s view. The post office thinks everything should arrive.' : 'Nobody has. That\'s how a letter ends up behind a sorting frame.');
        return;
      }
      await narrate('Behind the back-room shelves, wrapped in a Lisbon newspaper from 1987: a small blue enamel box. Locked. No key anywhere.');
      const j = await respond(a, 'otis', [
        { label: '"Should we open it?"', tone: 'sly', save: 'curious' },
        { label: '"It isn\'t ours to open."', tone: 'kind' }
      ]);
      await say(a, j === 0 ? 'We? No. I\'m a federal employee. You\'re on your own.' : 'That\'s the right answer. It\'s also the boring one. I respect it.');
      await say(a, 'The return address on the letter is a street in Lisbon. It\'s still there. I looked it up on my break. I could send it back. Twelve dollars, insured.');
      const i = await respond(a, 'otis', [
        { label: 'Pay $12 and post it back to Lisbon', tone: 'kind', disabled: S.coin < 12 },
        { label: 'Keep it, and put it on the shelf', tone: 'sly' }
      ]);
      if (i === 0) { change('coin', -12, 'Posted Odile\'s blue box back to Lisbon'); t.f.posted = true; await say(a, 'Return to sender. Best two words in the job.'); }
      else { t.f.shelf = giveItem(townItem({ name: 'Blue enamel box, locked', icon: 'tin', cat: 'curio', guide: 90, condLabel: 'Fine', clue: 'Lisbon, about 1950. Locked, no key. Something inside shifts when you tilt it, and stops when you stop.' })); await say(a, t.f.shelf ? 'Don\'t open it. That\'s my advice, as a federal employee.' : 'No room on your shelves? I\'ll take it back to the post office. Dead letters keep forever.'); }
    },
    async (a, t) => {
      if (t.f.posted) {
        t.end = 'posted'; change('coin', 60, 'A thank-you from Lisbon'); change('rep', 4);
        await say(a, 'Airmail, from Lisbon. M. died in 2009. Her granddaughter opened the box. Her great-grandmother\'s wedding ring, that the family thought went down with a boat. She sent a photograph, and sixty dollars, which is far too much postage.');
        const i = await respond(a, 'otis', [
          { label: 'Give him $20 of it for the trouble', tone: 'kind', sway: 1, disabled: S.coin < 20 },
          { label: '"Far too much postage. I\'ll manage."', tone: 'wry' }
        ]);
        if (i === 0) change('coin', -20, 'Gave Otis Pelletier a share of the Lisbon thank-you');
        await say(a, i === 0 ? 'I can\'t take it. I\'m taking it. For the stamp club. We\'re three people and a kettle.' : 'Put that on my headstone. "Far too much postage."');
      } else if (t.f.shelf) {
        t.end = 'shelf';
        await say(a, 'You\'ve still got the blue box. I can tell. You\'ve got the face of someone who hasn\'t opened a box.');
        if (said('otis', 'curious')) await say(a, 'You asked if we should open it. You\'ve been asking it every morning since, haven\'t you.');
        const i = await respond(a, 'otis', [
          { label: '"I haven\'t opened it."', tone: 'straight' },
          { label: '"I\'ve been tempted."', tone: 'wry' }
        ]);
        await say(a, i === 0 ? 'I know. That\'s what I said.' : 'Everybody is. That\'s what the box is for.');
      } else {
        t.end = 'unclaimed';
        await say(a, 'I\'ve sent Odile\'s letter to the dead letter office. They keep them forever. Like you do.');
        const i = await respond(a, 'otis', [
          { label: '"Some letters are happier there."', tone: 'kind' },
          { label: '"It was thirty-nine years late, Otis. Let it go."', tone: 'sharp' }
        ]);
        await say(a, i === 0 ? 'That\'s what I tell myself. On the long streets.' : 'It was somebody\'s whole life in an envelope. But fine.');
      }
      if (isFriend('otis', 'warm')) await say(a, 'And if there\'s ever something you\'re waiting on, I\'ll have it on your counter a day early. Don\'t ask how. Federal secret.');
    }
  ],
  epilogue: { posted: 'A photograph from Lisbon is pinned behind your till: a bride, in 1952, wearing a ring that came back by post.', shelf: 'A blue enamel box from Lisbon sits on your shelf, locked. Otis Pelletier asks after it every morning.', unclaimed: 'Odile\'s letter from Lisbon is in the dead letter office. Otis Pelletier says some letters are happier there.' }
});

// ---------------------------------------------------------------- the six newest (2026-11-03)
// Rich asked for a bigger pool again. These six run the town's winter: the plow, the paper, the
// motel that shuts, the florist, the pharmacy and the farm inland. Each has a month or two in which
// they matter most (TOWN_MONTHS in js/townmonths.js).

addRegular('leon', {
  name: 'Leon Thibodeau', place: 'the swap shed at the transfer station, and the town plow', topic: 'what the town throws away, and the roads when it snows',
  look: { skin: '#d8a888', hair: '#5a4a3a', hs: 0, coat: '#8a5a2a', trim: '#3a2a1a', style: 'jacket', pants: '#3a4050', hat: 'beanie', hatc: '#e0702a', beard: '#5a4a3a', stout: true },
  meet: 'Leon Thibodeau. I run the swap shed up at the transfer station, and when it snows I drive the plow. Between the two, I\'ve seen everything this town owns, coming or going.',
  chat: ['The rule at the swap shed: take what you need, leave what you don\'t, sell nothing. Two out of three\'s not bad for most people.', 'You can tell a lot about a house by what goes in the dumpster in the spring. Mostly exercise bikes.', 'Odile used to come up on Saturdays with a flask and go through the shed like a heron. She never took more than one thing. She always took the right one.'],
  small: [
    { say: 'Somebody left a wedding dress at the swap shed on Saturday. Somebody else took it on Sunday. I\'d like to know both stories. I never will.', opts: [
      { label: '"Maybe it went somewhere happy."', tone: 'kind', reply: 'That\'s what I\'ve decided. I decide that about most things up there.' },
      { label: '"Same bride, second thoughts?"', tone: 'wry', reply: 'Ha. Could be. It was gone by noon.' },
      { label: '"What would a dress like that fetch?"', tone: 'sly', reply: 'Nothing. That\'s the rule. You\'d be amazed how hard that rule is on people.' }] },
    { say: 'I plowed your street at three this morning. You had a light on in the back at three in the morning. Just saying.', opts: [
      { label: '"Inventory."', tone: 'straight', reply: 'Sure. I do my inventory at three too. It\'s called lying awake.' },
      { label: '"You didn\'t see anything, Leon."', tone: 'sly', reply: 'I see snow. That\'s all the town pays me to see.' },
      { label: '"Thanks for doing the street."', tone: 'kind', reply: 'Somebody thanked me. Write it down. Date and time.' }] },
    { say: 'People throw out their dad\'s tools the week after the funeral. Then they come up the week after that and look for them. I keep a shelf.', opts: [
      { label: '"That\'s decent of you."', tone: 'kind', reply: 'It\'s a shelf. Anyone can have a shelf.' },
      { label: '"How long do you keep them?"', tone: 'straight', reply: 'Till they come. Some don\'t. I\'ve got a level from 2009 still waiting.' },
      { label: '"Send the ones nobody claims my way."', tone: 'sly', reply: 'Swap shed rules. Nobody sells. Not even me, not even to you.' }] },
    { say: 'The plow\'s older than I am. The selectmen keep voting not to replace it, and it keeps not dying, out of spite.', opts: [
      { label: '"Sounds like a few people I know."', tone: 'wry', reply: 'Sounds like me. That\'s why we get on.' },
      { label: '"What happens when it does die?"', tone: 'straight', reply: 'Front Street gets dug out by hand, and they vote me a new one in March. After the thaw.' },
      { label: '"Buy your own, then."', tone: 'sharp', reply: 'With what? Swap shed money? That\'s the whole joke.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. The swap shed hears everything. People talk while they\'re throwing things out.', opts: [
      { label: '"What did they say?"', tone: 'straight', reply: 'That you did right. Then they left a lamp and took a lamp.' },
      { label: '"Good. Put it on the shed door."', tone: 'wry', reply: 'The shed door\'s full. I\'ll put it on the plow.' }] },
    down: { say: 'I heard about {quest}. Folks were saying it at the dumpsters. That\'s where things go when people are done with them.', opts: [
      { label: '"They\'re right. I\'m not proud of it."', tone: 'straight', sway: 1, reply: 'Well. That\'s the first thing anybody\'s owned up to at the transfer station.' },
      { label: '"Then they can say it to my face."', tone: 'sharp', sway: -1, reply: 'They won\'t. They\'ll say it to me. I\'ll be plowing your street. Last.' }] }
  },
  mend: townMend({ say: 'Leon. From the shed. I was passing. Your walk\'s iced.', label: '"Leon, I was out of line. I\'m sorry."', refuse: 'Say nothing', yes: 'All right. I\'ll do your walk on the way back. Don\'t make it a thing.', no: 'Suit yourself. Mind the ice.' }),
  title: 'Take One, Leave One', endings: { home: 'Home by Plow', roof: 'A Roof for the Shed', window: 'In the Window' },
  steps: [
    async (a, t) => {
      await say(a, 'Somebody left this at the swap shed. In a garbage bag. I know a garbage bag when I see one, and this isn\'t garbage.');
      view.counterIcon = 'painting';
      await narrate('An oil painting of the harbor at dusk, the Gull Point light just lit. Real brushwork, a good old frame, and in the corner a small signature: "R. Thaxter, 1948".');
      view.counterIcon = null;
      const i = await respond(a, 'leon', [
        { label: '"It\'s good, Leon. A few hundred dollars, maybe more."', tone: 'straight' },
        { label: '"Somebody loved this. You can tell."', tone: 'kind' },
        { label: '"I\'d give you twenty for the frame."', tone: 'sly' }
      ]);
      t.f.lowball = i === 2;
      await say(a, ['A few hundred. And the shed roof leaks like a colander, and the town won\'t fix it. That\'s a thought I didn\'t want to have.', 'You can. Somebody looked at that harbor every morning for sixty years.', 'Nothing at the shed gets sold, even to you. I only wanted to know what I had.'][i]);
      await say(a, 'Keep it in your back room for me, will you? If it sits on the shed shelf, somebody\'ll take it for the frame.');
      await narrate('He leans it against the wall behind the counter, face in.');
    },
    async (a, t) => {
      await say(a, 'A woman came up to the shed on Saturday, crying. Glenda Rowe. Her son-in-law cleared her mother\'s house while she was at the hospital and took the lot to the dump. Including her mother\'s painting. The harbor, at dusk.');
      if (t.f.lowball) await say(a, 'The one you\'d have given me twenty for. Just so you know whose it was.');
      await say(a, 'Now. Shed rules say it belongs to whoever takes it, and I took it. And the roof leaks on the books. What would you do?');
      const i = await respond(a, 'leon', [
        { label: '"Give it back to her. Today."', tone: 'kind' },
        { label: '"Sell it and fix the roof. She threw it out, in the end."', tone: 'sly' },
        { label: '"Ask her what she wants."', tone: 'straight' }
      ]);
      t.f.choice = ['home', 'roof', 'window'][i];
      await say(a, ['That\'s what I was going to do. I wanted to hear somebody else say it.', 'Her son-in-law threw it out. Not her. But the roof. I don\'t know. I\'ll sleep on it, and do it anyway.', 'Huh. I never ask people what they want at the shed. I just watch what they take.'][i]);
    },
    async (a, t) => {
      if (t.f.choice === 'roof') {
        t.end = 'roof';
        await say(a, 'A dealer in Boston gave three hundred for it. The roof was two-sixty. Here\'s the rest, for keeping it dry.');
        change('coin', 40, 'Leon Thibodeau\'s share of the painting');
        await say(a, 'Glenda came up last week and saw the new roof. I told her. She didn\'t say anything. She took a teapot and left.');
      } else if (t.f.choice === 'window') {
        t.end = 'window'; change('rep', 3);
        await say(a, 'Glenda says she\'s got no wall for it. One room over the bakery, since her mother\'s house went. She asked if it could hang in your window, not for sale, so she can walk past it in the mornings.');
        await narrate('The harbor at dusk goes up in your window with a card: NOT FOR SALE. People stop and look at it, and then at the rest of the window.');
      } else {
        t.end = 'home'; change('rep', 4);
        await say(a, 'I took it down to Glenda\'s in the plow. Seemed right. She held the door open and the snow came in and she didn\'t care.');
      }
      const i = await respond(a, 'leon', [
        { label: '"The shed rules held up, then."', tone: 'wry' },
        { label: '"I\'m glad, Leon."', tone: 'kind' },
        { label: '"Next time, bring me the frame first."', tone: 'sly' }
      ]);
      await say(a, ['Take one, leave one. It\'s not a rule, really. It\'s more of a hope.', 'Me too. Don\'t tell the selectmen. They\'ll think I\'m soft and cut the salt budget.', 'Ha. No.'][i]);
      if (isFriend('leon', 'warm')) await say(a, 'Here\'s a thing. When it snows, your stretch is first on my route now. Nobody plows Front Street before me, and nobody gets plowed before you.');
    }
  ],
  epilogue: { home: 'Glenda Rowe\'s mother\'s harbor hangs over a bed in one room above the bakery. Leon Thibodeau delivered it in the plow.', roof: 'The swap shed has a new roof, paid for by a painting. Leon Thibodeau doesn\'t talk about it.', window: 'R. Thaxter\'s harbor hangs in your window, not for sale. Glenda Rowe walks past it every morning on her way to the bakery.' }
});

addRegular('vera', {
  name: 'Vera Bassett', place: 'the Gazette office, over Mayhew\'s Hardware', topic: 'what\'s going in the paper: notices, letters to the editor, and the obituaries',
  look: { skin: '#e8c0a0', hair: '#b8b8b8', hs: 1, coat: '#6a3a3a', trim: '#e8e0c8', style: 'jacket', long: true, pants: '#2a2a32', glasses: '#2a2a2e', bag: '#5a4a3a' },
  meet: 'Vera Bassett, the Gazette. Editor, reporter, photographer, and the one who sweeps up. If it happens in Hollow Neck, I\'ve written it down by Wednesday noon.',
  chat: ['Letters to the editor are the best-read page. Nobody admits it. Everybody counts how many times their name\'s in.', 'I write every obituary myself. Four hundred and eleven so far. I\'d like to write my own, but I\'d be up against a deadline.', 'The police blotter is the second-best-read page. "A man on Bay Street reported a suspicious raccoon." That\'s a real one. That\'s this week.'],
  small: [
    { say: 'Somebody sent a letter to the editor about your window. Signed "A Concerned Neighbor". I know the handwriting. He owns six garden gnomes.', opts: [
      { label: '"Print it. I could use the attention."', tone: 'wry', reply: 'That\'s what I said. He\'ll be furious that it worked.' },
      { label: '"What did it say?"', tone: 'straight', reply: 'That your window is "busy". That\'s all. One word, underlined twice.' },
      { label: '"Tell him to mind his gnomes."', tone: 'sharp', reply: 'I don\'t take sides. I take letters.' }] },
    { say: 'I proofread every page with a ruler under each line. Forty years. One mistake gets through every week anyway. Just one. It\'s like a law of nature.', opts: [
      { label: '"What got through this week?"', tone: 'wry', reply: '"The selectmen will meat on Tuesday." Gordie brought sausages. He thought it was a theme.' },
      { label: '"Nobody minds one mistake, Vera."', tone: 'kind', reply: 'I mind. That\'s what the ruler\'s for. But thank you.' },
      { label: '"Have you tried two rulers?"', tone: 'straight', reply: 'I\'ve tried everything. The typo is bigger than both of us.' }] },
    { say: 'Old Mr. Gammage comes in every Wednesday to check his obituary hasn\'t run. He\'s ninety-six.', opts: [
      { label: '"Do you keep one ready?"', tone: 'straight', reply: 'Of course. I\'ve rewritten it eleven times. It gets better every year, like him. Don\'t tell him.' },
      { label: '"That\'s rather sweet."', tone: 'kind', reply: 'It is. He reads the whole page, to see who he\'s outlived. Then he buys a donut.' },
      { label: '"Run it early. See what he does."', tone: 'sly', reply: 'I have thought about it. Late at night. I am not proud of the thought.' }] },
    { say: 'The Gazette\'s been printed in Plymouth since our press died in 1994. I drive the pages down on Wednesday nights. In winter, it\'s a sport.', opts: [
      { label: '"Who covers the paper when you\'re snowed in?"', tone: 'straight', reply: 'Nobody. It\'s come out every week since 1886. Leon plows me out first. He doesn\'t know that\'s why.' },
      { label: '"You must love it."', tone: 'kind', reply: 'I love it the way you love a dog that bites. Loyally, with gloves on.' },
      { label: '"Go digital. Save the drive."', tone: 'sharp', reply: 'Mr. Gammage doesn\'t have a computer. Mr. Gammage has a donut and a Wednesday.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. I\'m writing it up. A paragraph, page three. You come out of it well. I checked.', opts: [
      { label: '"Spell the shop right."', tone: 'wry', reply: 'The Crooked Scale. Two words, no "e" on crook. I\'ve got a ruler.' },
      { label: '"Do I need to say anything?"', tone: 'straight', reply: 'You already did. I write things down. That\'s the whole trick.' }] },
    down: { say: 'I heard about {quest}. It\'s going in the paper, because it happened. I\'ll write it fair. I can\'t write it kind.', opts: [
      { label: '"That\'s all I\'d ask, Vera."', tone: 'straight', sway: 1, reply: 'Then you\'ll get it. Page five. Below the fold, which is the best I can do.' },
      { label: '"Print a word of it and I\'ll pull my ad."', tone: 'sharp', sway: -1, reply: 'You don\'t have an ad. Now you never will.' }] }
  },
  mend: async a => {
    await say(a, 'Vera Bassett. I\'m doing the rounds for the classifieds. I wasn\'t going to stop here.');
    const i = await respond(a, 'vera', [
      { label: 'Buy a quarter-page ad in the Gazette ($15)', tone: 'straight', disabled: S.coin < 15 },
      { label: '"I was wrong, Vera. Write that down."', tone: 'kind' },
      { label: '"Then don\'t."', tone: 'sharp' }]);
    if (i === 0) change('coin', -15, 'A quarter-page ad in the Gazette');
    await say(a, ['A quarter page. Font? No, I\'ll choose the font. We\'re square.', 'I will. Small, on page two. Where only the people who matter read it.', 'I won\'t.'][i]);
    return i < 2;
  },
  title: 'The Unprinted Letter', endings: { printed: 'Printed at Last', ruthie: 'Back to Its Writer', stove: 'Into the Stove' },
  steps: [
    async (a, t) => {
      await say(a, 'This was my father\'s. He edited the Gazette from 1951 to 1988, on this, and so did I till the ribbons stopped coming. The printer in Plymouth wants paying before Christmas, and the ads have gone to the radio.');
      const j = await respond(a, 'vera', [
        { label: '"Are you sure you want to sell it?"', tone: 'kind' },
        { label: '"Let me look at it properly."', tone: 'straight' },
        { label: '"Typewriters are having a moment. Hipsters."', tone: 'wry' }
      ]);
      await say(a, ['No. I\'m sure I want to pay the printer. It isn\'t the same thing.', 'Look all you like. It\'s a 1952 Royal. It weighs as much as a small child and it has never once made a typo. I made them all.', 'So I hear. They can have it if they promise to write something.'][j]);
      t.f.bought = await townBuy(a, townItem({ name: 'Royal typewriter, 1952', icon: 'inkwell', cat: 'curio', guide: 85, condLabel: 'Good', clue: 'Glossy black, round glass keys, a ribbon gone grey. Under the platen, a sheet of onionskin is still wound in, half-typed.' }), 40, 'Bought Vera Bassett\'s father\'s typewriter');
      await say(a, t.f.bought ? 'Mind the carriage return. It goes like a shotgun.' : 'No? Fair enough. The dealer in Plymouth has offered thirty. He has a nicer coat than you.');
    },
    async (a, t) => {
      if (t.f.bought) {
        await narrate('You wind the onionskin out of the Royal. A letter to the editor, dated July 6th, 1971, typed by somebody who had to look for each key.');
        await narrate('"I am the one who broke the window at Town Hall on the Fourth. It wasn\'t Tito Abreu. He was just standing there. Please print this so they stop saying it was him. Ruth Kroll, age 15."');
        await say(a, 'You found it. I never knew it was in there. Dad must have typed it up from her note and then... not run it.');
      } else {
        await say(a, 'I was cleaning the Royal before the Plymouth man came for it, and there was a sheet still wound in. A letter to the editor. July, 1971. Dad typed it up from somebody\'s note and never ran it.');
        await narrate('She reads it to you. "I am the one who broke the window at Town Hall on the Fourth. It wasn\'t Tito Abreu. He was just standing there. Please print this so they stop saying it was him. Ruth Kroll, age 15."');
      }
      await say(a, 'Ruthie. Ruthie Kroll, from the Anchor. And Tito Abreu, who never got the job at Town Hall, and everybody\'s always said why. He\'s on Bay Street. He\'s seventy.');
      const i = await respond(a, 'vera', [
        { label: '"Print it. Fifty-five years late is still the truth."', tone: 'straight' },
        { label: '"Give it to Ruthie. It\'s hers to tell."', tone: 'kind' },
        { label: '"Burn it. Nobody needs this now."', tone: 'sharp' }
      ]);
      t.f.choice = ['printed', 'ruthie', 'stove'][i];
      await say(a, ['That\'s what my father should have said. I\'ll have to ask Ruthie first. I won\'t ask her permission. I\'ll ask her to read it.', 'That\'s kinder than the Gazette usually is. I\'ll take it to the Anchor myself.', 'I\'ve got a woodstove. I\'ve never put a letter in it. I don\'t know if I can.'][i]);
    },
    async (a, t) => {
      if (t.f.choice === 'printed') {
        t.end = 'printed'; change('rep', 3);
        await say(a, 'It ran on Wednesday. Page one, below the fold, with an editor\'s note under it. Mine. It said the Gazette got it wrong in 1971, and I\'m sorry, and so was my father, I think.');
        await say(a, 'Tito Abreu came in with the paper in his hand. He didn\'t say anything. He bought a second copy.');
      } else if (t.f.choice === 'ruthie') {
        t.end = 'ruthie';
        await say(a, 'I gave it to Ruthie at the bar. She read it twice, then she went and found Tito Abreu at the end of the counter, and she bought him a drink, and then another one, and then she told the whole room.');
        await say(a, 'I didn\'t print it. I didn\'t have to. The Anchor\'s a faster paper than mine.');
      } else {
        t.end = 'stove';
        await say(a, 'I put it in the stove. It went up very fast, onionskin. I\'ve been sitting with it.');
        await say(a, 'Ruthie never knew it was there. Tito never will. I\'ve kept a lot of secrets for this town. That\'s the first one I made myself.');
      }
      const i = await respond(a, 'vera', [
        { label: '"You did right, Vera."', tone: 'kind' },
        { label: '"Will you write about it?"', tone: 'straight' },
        { label: '"Good story, anyway."', tone: 'wry' }
      ]);
      await say(a, ['I did something. That\'s most of the job.', 'I already have. It\'s in a drawer. It\'ll run when I\'m in the obituaries.', 'The best ones never make the paper. That\'s the secret of the paper.'][i]);
      if (isFriend('vera', 'warm')) await say(a, 'One more thing. There\'s an "Around Town" paragraph going spare next week. I could find something nice to say about a pawnshop. It\'d take some looking.');
    }
  ],
  epilogue: { printed: 'The Gazette ran a 1971 letter on its front page, with an apology. Tito Abreu has it framed over his television.', ruthie: 'Ruthie Kroll bought Tito Abreu a drink every trivia night that month. Nobody else knows why. Everybody knows why.', stove: 'Vera Bassett\'s father\'s typewriter has a blank sheet in it now. She says she\'s keeping it ready.' }
});

addRegular('rhoda', {
  name: 'Rhoda Pickering', place: 'the Harborview Motor Inn, out on Route 1', topic: 'out-of-towners: who\'s staying, who\'s checked out, and what they left behind',
  look: { skin: '#f0c8a8', hair: '#c8502a', hs: 3, coat: '#2a8a8a', trim: '#f0e0a0', style: 'puffer', pants: '#2a2a3a', glasses: '#6a2a4a', bag: '#c8a050' },
  meet: 'Rhoda Pickering, the Harborview. Sixteen rooms, a pool, and an ice machine that\'s outlived two husbands. If somebody\'s in town who isn\'t from town, they\'ve signed my register.',
  chat: ['People leave the strangest things in motel rooms. Teeth. A canoe paddle. A whole wedding cake, once, untouched. I didn\'t ask.', 'Room nine has the good view. Room fourteen has the good heater. Nobody gets both. That\'s life.', 'You can tell who\'s up to something by how they sign the register. Too neat. Nobody\'s that neat on holiday.'],
  small: [
    { say: 'A couple from Ohio asked me where the "real" Hollow Neck is. I said, you\'re standing in it, hon, that\'s the ice machine.', opts: [
      { label: '"What did they want, a lighthouse?"', tone: 'wry', reply: 'A lighthouse, a lobster and a ghost. I sent them to Felix for two of those.' },
      { label: '"Send them my way."', tone: 'sly', reply: 'I did. They bought a snow globe from you and called it authentic. Everybody won.' },
      { label: '"Tourists."', tone: 'sharp', reply: 'Tourists pay for my roof, sweetheart. And for yours, some weeks.' }] },
    { say: 'Every motel has one guest who never checks out. Not a ghost. A man from Worcester. He\'s been in room three since 2019. He pays on Fridays.', opts: [
      { label: '"What does he do all day?"', tone: 'straight', reply: 'Crosswords, and the weather channel, loud. I asked once. He said "Recovering." From what, he didn\'t say.' },
      { label: '"Maybe he just likes it there."', tone: 'kind', reply: 'Nobody likes it there. It\'s a motel. But he does seem to.' },
      { label: '"Raise his rent and see."', tone: 'sly', reply: 'Ha. I thought about it. Then he fixed my ice machine without asking.' }] },
    { say: 'I\'ve had a honeymoon and a divorce in the same room in the same week. Different couples. Same towels.', opts: [
      { label: '"Which tipped better?"', tone: 'sly', reply: 'The divorce. Always the divorce. They\'re in a hurry to be somewhere else.' },
      { label: '"That room\'s seen a lot."', tone: 'kind', reply: 'They all have. I paint them every spring. It doesn\'t take.' },
      { label: '"Same towels? Wash them."', tone: 'wry', reply: 'I wash everything, smart mouth. I mean the same brand. Mostly.' }] },
    { say: 'The register goes back to 1961. Every out-of-towner who ever came to Hollow Neck and couldn\'t afford the inn on the Green. I keep them in the boiler room.', opts: [
      { label: '"Anybody famous?"', tone: 'straight', reply: 'A senator, a man who said he was a senator, and a Rockette. She left a shoe.' },
      { label: '"You could sell those to Hester."', tone: 'sly', reply: 'Hester would want them for free and in order. I\'ve got one of those two.' },
      { label: '"That\'s a lot of goodbyes."', tone: 'kind', reply: 'It\'s a lot of hellos, hon. It depends which end of the book you start.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. From a guest, if you can believe it. You\'re what people from away talk about now.', opts: [
      { label: '"What did they say?"', tone: 'straight', reply: 'That the pawnshop in Hollow Neck is worth the drive. I\'m putting it on the brochure.' },
      { label: '"Tell them I\'m open late."', tone: 'wry', reply: 'I tell them everything. That\'s what the free coffee\'s for.' }] },
    down: { say: 'I heard about {quest}. Guests were talking about it at breakfast. Not the way you\'d want.', opts: [
      { label: '"I know. I\'d like to put it right."', tone: 'kind', sway: 1, reply: 'Then put it right, hon. Guests leave on Sunday. Gossip doesn\'t.' },
      { label: '"Your guests can mind their eggs."', tone: 'sharp', sway: -1, reply: 'My guests can stay somewhere else, too. Like your shoppers.' }] }
  },
  mend: async a => {
    await say(a, 'Rhoda Pickering. I\'m only here for change for the ice machine. Don\'t read anything into it.');
    const i = await respond(a, 'rhoda', [
      { label: 'Give her the change, and a roll of quarters on the house ($10)', tone: 'sly', disabled: S.coin < 10 },
      { label: '"I was out of line, Rhoda."', tone: 'wry' },
      { label: '"Bank\'s on Front Street."', tone: 'sharp' }]);
    if (i === 0) change('coin', -10, 'A roll of quarters for the Harborview\'s ice machine');
    await say(a, ['On the house! Well. You know the way to a motel keeper\'s heart. It\'s quarters.', 'You were. I\'ve been out of line since 1979. Fine.', 'So it is.'][i]);
    return i < 2;
  },
  title: 'Lost and Found', endings: { posted: 'Return Postage', sold: 'Sold Off the Lot', desk: 'Next October' },
  steps: [
    async (a, t) => {
      await say(a, 'Forty-five years of the Harborview\'s lost and found. One suitcase. I\'m doing a clear-out while we\'re shut, and I\'m not going through it again. Thirty dollars, the lot, as is.');
      const j = await respond(a, 'rhoda', [
        { label: '"What\'s in it?"', tone: 'straight' },
        { label: '"Anything good?"', tone: 'sly' },
        { label: '"Forty-five years of people\'s stuff. That\'s a lot."', tone: 'kind' }
      ]);
      await say(a, ['Sunglasses, mostly. Two hundred pairs of sunglasses. People lose their eyes on holiday.', 'If there was, hon, I\'d have found it. Probably.', 'It\'s everybody\'s holiday. It\'s heavier than it looks.'][j]);
      t.f.bought = await townBuy(a, townItem({ name: 'Suitcase of lost property', icon: 'bag', cat: 'curio', guide: 30, condLabel: 'Worn', clue: 'A 1970s Samsonite, stickered with HARBORVIEW MOTOR INN, crammed with sunglasses, paperbacks, a toupee and one baby shoe.' }), 30, 'Bought the Harborview\'s lost and found');
      await say(a, t.f.bought ? 'Sold. I feel lighter. Literally, my back thanks you.' : 'Suit yourself. I\'ll go through it once more before the dump. Once.');
    },
    async (a, t) => {
      if (t.f.bought) await narrate('At the bottom of the suitcase, folded into a Harborview napkin: a thin gold wedding ring. On the napkin, in pencil: "Rm 9. Oct 1979. Under the sink."');
      else await say(a, 'I went through it once more. Look at this. A wedding ring, in a napkin. "Room nine, October 1979, under the sink." My handwriting. I was twenty-two.');
      await say(a, 'I looked in the 1979 register. Room nine, October: Mr. and Mrs. D. Ferrante, Providence. And here\'s the thing, hon. Mr. Ferrante still books room nine. Every October. Alone. He\'s never once asked about a ring.');
      const i = await respond(a, 'rhoda', [
        { label: '"Post it to him. He\'ll know what it means."', tone: 'kind' },
        { label: '"Forty-seven years unclaimed. Sell it, split it."', tone: 'sly' },
        { label: '"Keep it at the desk. Hand it to him next October."', tone: 'straight' }
      ]);
      t.f.choice = ['posted', 'sold', 'desk'][i];
      await say(a, ['A ring in the post. He\'ll think it\'s a summons. Fine, I\'ll write a note with it.', 'You\'re a practical sort. So am I, mostly. Mostly.', 'In person. Yes. I want to see his face. That\'s terrible of me. I\'ll do it anyway.'][i]);
    },
    async (a, t) => {
      if (t.f.choice === 'sold') {
        t.end = 'sold';
        await say(a, 'Eighty-two dollars for the gold, from the place in Plymouth. Here\'s your half. Mr. Ferrante will be in room nine next October, same as ever, and I\'ll give him extra towels.');
        change('coin', 41, 'Half of a 1979 wedding ring from the Harborview');
      } else if (t.f.choice === 'posted') {
        t.end = 'posted'; change('rep', 3);
        await say(a, 'He wrote back. A real letter. His wife lost it in room nine, the week before she left him. He looked under every sink in Providence for a year. He says thank you, and that he\'ll be in room nine in October, and that he\'s going to wear it.');
      } else {
        t.end = 'desk'; change('rep', 2);
        await say(a, 'It\'s in the desk drawer, in the napkin, in an envelope that says FERRANTE. Every time I open the drawer I see it. October\'s a long way off. I don\'t mind.');
      }
      const i = await respond(a, 'rhoda', [
        { label: '"Forty-seven years under a sink."', tone: 'wry' },
        { label: '"I hope he\'s all right."', tone: 'kind' },
        { label: '"Anything else in the lost and found?"', tone: 'sly' }
      ]);
      await say(a, ['Forty-seven years in my suitcase. The sink was only one night.', 'He books room nine every October. He\'s all right enough.', 'Two hundred pairs of sunglasses. You\'re welcome to them.'][i]);
      if (isFriend('rhoda', 'warm')) await say(a, 'Listen. Every guest who asks me where to go in town, I\'m sending to you now. They\'ve all got money and none of them know what anything\'s worth.');
    }
  ],
  epilogue: { posted: 'A thin gold ring went back to Providence by post. Mr. Ferrante books room nine at the Harborview every October, and wears it.', sold: 'A 1979 wedding ring went for scrap in Plymouth. Rhoda Pickering gives the guest in room nine extra towels, and never says why.', desk: 'An envelope marked FERRANTE waits in the Harborview\'s desk drawer for October.' }
});

addRegular('lupe', {
  name: 'Lupe Fonseca', place: 'Fonseca\'s Flowers, Front Street', topic: 'weddings and funerals: who\'s marrying, who\'s being buried, and who sends flowers to whom',
  look: { skin: '#b07850', hair: '#1a1210', hs: 3, coat: '#c84a6a', style: 'tee', apron: '#3a6a3a', pants: '#2a2a30', long: true },
  meet: 'Lupe Fonseca, Fonseca\'s Flowers, across from the bakery. I do the weddings and the funerals, which in this town is mostly the same hundred people in different shoes.',
  chat: ['You can tell how a marriage is going by the anniversary order. Year one, two dozen roses. Year twenty, a cactus. It\'s a nice cactus.', 'Nobody orders flowers for themselves. Except Madame Orsolya. Black tulips, every Friday.', 'The best funeral I ever did was all daffodils, in November. She\'d asked for it in writing. I had them flown in from somewhere I can\'t pronounce.'],
  small: [
    { say: 'A man came in and asked for "flowers that say sorry but not too sorry". I\'ve been doing this twenty years. I knew exactly what he meant.', opts: [
      { label: '"What did you give him?"', tone: 'straight', reply: 'Carnations. They say "I was wrong" and "it was a small thing" at the same time.' },
      { label: '"Not too sorry. I like him already."', tone: 'wry', reply: 'You would. You\'d get carnations too.' },
      { label: '"Poor woman."', tone: 'kind', reply: 'She sent him back for roses. She knew exactly what he meant too.' }] },
    { say: 'Two people in this town have sent each other anonymous flowers every Valentine\'s Day for eleven years. They don\'t know it\'s each other. I do.', opts: [
      { label: '"Tell them!"', tone: 'kind', reply: 'And lose two of my best customers? Also, it\'s the most romantic thing I\'ve ever seen. I\'m not touching it.' },
      { label: '"Who?"', tone: 'sly', reply: 'Ha. You\'d sell the information. I\'d sell more flowers. Neither of us is getting it.' },
      { label: '"Eleven years is a long time to not notice."', tone: 'straight', reply: 'People notice. They just don\'t want to be wrong.' }] },
    { say: 'Father Ignatius tells me how long a funeral will be by how many lilies I bring. Six lilies, short service. Twelve, he settles in.', opts: [
      { label: '"What\'s the most you\'ve brought?"', tone: 'straight', reply: 'Forty. A harbormaster. He went on till the candles guttered. Nobody minded.' },
      { label: '"Bring six to everything."', tone: 'wry', reply: 'I tried that once. He spoke for an hour anyway. Out of principle.' },
      { label: '"That\'s a lovely thing between you."', tone: 'kind', reply: 'It is. We\'ve buried half the town together. You get close.' }] },
    { say: 'In December I make wreaths till my hands bleed, and every one has a little pine cone wired at the bottom. Nobody\'s ever noticed. It\'s my signature.', opts: [
      { label: '"I\'ll look for it."', tone: 'kind', reply: 'Now you\'ll see them all over town. That\'s the curse. Sorry.' },
      { label: '"Ever thought of charging for the pine cone?"', tone: 'sly', reply: 'The pine cone is free. The pine cone is the only free thing I do.' },
      { label: '"Get gloves."', tone: 'sharp', reply: 'Gloves are for people who don\'t know where the wire is. I always know where the wire is.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. Somebody ordered flowers about it. For you, sort of. They didn\'t sign the card.', opts: [
      { label: '"Who sends flowers to a pawnshop?"', tone: 'wry', reply: 'Somebody who meant it. Water them. They\'re on your step.' },
      { label: '"That\'s kind of them."', tone: 'kind', reply: 'It\'s kind of you, is what they meant. I\'m only the messenger.' }] },
    down: { say: 'I heard about {quest}. I did the flowers for a sad occasion this week, and your name came up over the ribbons.', opts: [
      { label: '"I\'m sorry. I didn\'t think it through."', tone: 'kind', sway: 1, reply: 'People never do. Then they come and buy carnations. Come and buy carnations.' },
      { label: '"Stick to the ribbons, Lupe."', tone: 'sharp', sway: -1, reply: 'I will. Black ones, for your window.' }] }
  },
  mend: async a => {
    await say(a, 'Lupe Fonseca. I\'m dropping off a delivery next door. I thought I\'d see if you\'re still in a mood.');
    const i = await respond(a, 'lupe', [
      { label: 'Buy a bunch of carnations from her bucket ($8)', tone: 'kind', disabled: S.coin < 8 },
      { label: '"I\'m sorry, Lupe. I was a pig."', tone: 'wry' },
      { label: '"Still in one."', tone: 'sharp' }]);
    if (i === 0) change('coin', -8, 'A bunch of carnations from Lupe Fonseca');
    await say(a, ['Carnations. You know what they mean. All right. I accept.', 'You were. A nice pig, mostly. Fine.', 'Then I\'ll leave you in it.'][i]);
    return i < 2;
  },
  title: 'Forget-Me-Nots', endings: { march: 'Every March', stone: 'On the Stone', name: 'The Name in the Ledger' },
  steps: [
    async (a, t) => {
      await say(a, 'Every February for thirty-one years, an envelope comes under my door. Cash, and a note: "Forget-me-nots. Maryann Lavoie, Saint Brine\'s. March the third." I\'ve never known who.');
      await say(a, 'This year there was no money in it. Just this.');
      view.counterIcon = 'letter';
      await narrate('A pawn ticket from this shop, in Odile\'s hand. "No. 4471. Locket, gold, with photograph. 1994." Never redeemed.');
      view.counterIcon = null;
      const i = await respond(a, 'lupe', [
        { label: '"Let me look in the back."', tone: 'kind' },
        { label: '"Unredeemed pledges belong to the shop, Lupe."', tone: 'sharp' },
        { label: '"Whoever it is, they wanted you to have it."', tone: 'straight' }
      ]);
      t.f.mine = i === 1;
      await say(a, ['Would you? I have a feeling the money\'s stopped for a reason.', 'I know they do. I\'m not asking for it. I\'m asking you to look at it.', 'They wanted somebody to have it. I\'m only the florist.'][i]);
    },
    async (a, t) => {
      await narrate('In a cigar box in the back room, under ticket 4471: a small gold locket. Inside, a photograph of a young woman laughing at someone outside the picture, and a curl of dark hair.');
      await narrate('Odile\'s ledger for 1994 has the pledge: "H. Tolland. $40. Says not to sell it while he\'s alive."');
      await say(a, 'Hiram Tolland. He died in August, on the boats till he was eighty. I did his flowers. Nobody came to his funeral but the co-op. I never knew he knew her.');
      if (t.f.mine) await say(a, 'It\'s yours, legally. You said so. I\'m only asking what you\'ll do with it.');
      const i = await respond(a, 'lupe', [
        { label: 'Sell the locket, and pay for her flowers out of it', tone: 'straight' },
        { label: 'Give Lupe the locket, for the grave', tone: 'kind' },
        { label: '"Put his name on the card this year."', tone: 'wry' }
      ]);
      t.f.choice = ['march', 'stone', 'name'][i];
      await say(a, ['Ten years of March out of a locket. He\'d have liked that, I think. He was a practical man.', 'On the stone. In a little tin, so the frost doesn\'t get it. Yes.', 'From Hiram. After thirty-one years. Oh, I\'m going to cry on the ribbon.'][i]);
    },
    async (a, t) => {
      if (t.f.choice === 'march') {
        t.end = 'march';
        await say(a, 'The locket fetched seventy in Plymouth. Fifty does ten years of forget-me-nots. Here\'s the rest. It\'s yours anyway.');
        change('coin', 20, 'What was left from Hiram Tolland\'s locket');
      } else if (t.f.choice === 'stone') {
        t.end = 'stone'; change('rep', 3);
        await say(a, 'It\'s on Maryann\'s stone, in a tin, under the forget-me-nots. Father Ignatius blessed it. He said he\'d never blessed a locket. He said it felt like the right first.');
      } else {
        t.end = 'name'; change('rep', 2);
        await say(a, 'I put "From Hiram" on the card. Maryann\'s sister is still alive, in the home in Plymouth. She saw it in the Gazette, and she rang me. She said, "Hiram Tolland? He asked her to the dance in 1963 and she said no. She always said she should have said yes."');
      }
      const i = await respond(a, 'lupe', [
        { label: '"Thirty-one years of flowers."', tone: 'kind' },
        { label: '"Will you keep doing them?"', tone: 'straight' },
        { label: '"You\'re going to cry on the ribbon."', tone: 'wry' }
      ]);
      await say(a, ['And one locket. That\'s a whole life, in my line of work.', 'Every March the third. I don\'t need the envelope.', 'I already did. I had to redo the bow.'][i]);
      if (isFriend('lupe', 'warm')) await say(a, 'I\'m putting your card in my bouquets now. A little one. Next to the pine cone.');
    }
  ],
  epilogue: { march: 'Forget-me-nots go on Maryann Lavoie\'s grave every March the third, paid for ten years ahead by a gold locket.', stone: 'A small gold locket lies in a tin on Maryann Lavoie\'s stone at Saint Brine\'s, under the forget-me-nots.', name: 'Every March the third, Lupe Fonseca\'s forget-me-nots go on Maryann Lavoie\'s grave with a card: "From Hiram."' }
});

addRegular('hugo', {
  name: 'Hugo Pettengill', place: 'Pettengill\'s Pharmacy and soda fountain, Front Street', topic: 'who\'s poorly, who\'s on the mend, and the shut-ins up on the hill',
  look: { skin: '#e8c8a8', hair: '#d8d0c0', hs: 0, coat: '#f0f0ec', trim: '#2a4a8a', style: 'suit', pants: '#3a3a44', glasses: '#2a2a2e', moustache: '#d8d0c0' },
  meet: 'Hugo Pettengill. Pettengill\'s Pharmacy, since 1911, though not me personally. Prescriptions at the back, soda fountain at the front, and I hear about every cough in town before the doctor does.',
  chat: ['The soda fountain still does an egg cream. Nobody under seventy orders one. I keep the syrup for them.', 'Half my job is pills and the other half is listening. The listening isn\'t on anyone\'s insurance.', 'My grandfather sold everything in that shop. Leeches, toothache drops you couldn\'t sell now, a tonic called Vigor. The shelves remember.'],
  small: [
    { say: 'Flu\'s going round the school. I can tell by the cough drops. Cherry goes first, then honey, then the ones nobody likes.', opts: [
      { label: '"Which ones has it got to?"', tone: 'straight', reply: 'Honey. By Friday it\'ll be the menthol, and then we\'re in trouble.' },
      { label: '"Look after yourself, Hugo."', tone: 'kind', reply: 'I\'m a pharmacist. I\'ve been immune to everything since 1987. Mostly by glaring at it.' },
      { label: '"Put the price up on the cherry."', tone: 'sly', reply: 'Absolutely not. That\'s a sentence I\'ll be thinking about all day.' }] },
    { say: 'I deliver to the shut-ins on the hill on Thursdays. Mrs. Oldroyd has me in for tea and tells me who\'s died. She\'s usually right.', opts: [
      { label: '"That\'s good of you."', tone: 'kind', reply: 'It\'s the best part of the week. The tea\'s terrible. I drink two cups.' },
      { label: '"Usually?"', tone: 'wry', reply: 'She buried the postmaster in 2016. He came to the door. She\'s never forgiven him.' },
      { label: '"Who\'s on the list this week?"', tone: 'straight', reply: 'Nine houses. Fewer than last year. That\'s the only list I don\'t like getting shorter.' }] },
    { say: 'Somebody asked me for "something to make my husband less boring". I gave her a crossword book. She came back for a second one.', opts: [
      { label: '"Did it work?"', tone: 'wry', reply: 'He does them in pen now. She says it\'s thrilling. I\'ll take the credit.' },
      { label: '"You should charge for advice."', tone: 'sly', reply: 'Then nobody would ask. And I\'d have to stop listening, which I couldn\'t.' },
      { label: '"Very sensible."', tone: 'straight', reply: 'Pharmacy is mostly sensible. The rest is egg creams.' }] },
    { say: 'The old jars on my top shelf are still labelled. Laudanum, belladonna, arsenic. Empty, all of them. Tourists photograph them. Nobody asks for any.', opts: [
      { label: '"I\'d buy the jars."', tone: 'sly', reply: 'Everybody would. They\'re staying. They hold the shelf up, I think.' },
      { label: '"Strange to think people bought those."', tone: 'straight', reply: 'They did. Signed for them, too. There\'s a book somewhere.' },
      { label: '"Spooky."', tone: 'sharp', reply: 'Not spooky. History. Spooky is what Orsolya sells.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. Mrs. Oldroyd told me, over the terrible tea. She approved. She doesn\'t approve of anything.', opts: [
      { label: '"Tell her thank you."', tone: 'kind', reply: 'I will. She\'ll deny she said it. That\'s how you know she meant it.' },
      { label: '"What else does she say about me?"', tone: 'wry', reply: 'That you need a haircut. She says that about everybody. It\'s a compliment.' }] },
    down: { say: 'I heard about {quest}. In the waiting line for prescriptions. People talk in a line. It wasn\'t kind.', opts: [
      { label: '"It wasn\'t my best. I\'ll do better."', tone: 'kind', sway: 1, reply: 'That\'s all anyone can say. I hear it from the doctor every week.' },
      { label: '"People in lines have too much time."', tone: 'wry', sway: -1, reply: 'Possibly. They also have long memories. And short tempers. And the flu.' }] }
  },
  mend: async a => {
    await say(a, 'Hugo Pettengill. I\'m doing the Thursday round. You\'re not on it. I thought I\'d look in.');
    const i = await respond(a, 'hugo', [
      { label: '"I was rude to you, Hugo. I\'m sorry."', tone: 'kind' },
      { label: 'Give him something for the shut-ins\' tea tin ($10)', tone: 'straight', disabled: S.coin < 10 },
      { label: '"Don\'t look in."', tone: 'sharp' }]);
    if (i === 1) change('coin', -10, 'For the shut-ins\' tea tin at Pettengill\'s');
    await say(a, ['Thank you. That\'s better than anything I\'ve got behind the counter.', 'For the tea tin. Mrs. Oldroyd will buy worse tea with it. We\'re square.', 'Right you are.'][i]);
    return i < 2;
  },
  title: 'The Poison Book', endings: { athenaeum: 'To the Athenaeum', sold: 'Sold to Salem', torn: 'One Page Missing' },
  steps: [
    async (a, t) => {
      await say(a, 'I\'ve been clearing the back stockroom. My grandfather\'s poison register. Every grain of arsenic and strychnine sold over the counter from 1911 to 1958, and the name of who signed for it.');
      view.counterIcon = 'tome';
      await narrate('A heavy ledger, red leather gone brown. Columns of names, dates and poisons, and in the last column, in different hands: "Rats." "Rats." "Weeds." "Rats."');
      view.counterIcon = null;
      await say(a, 'Hester wants it for the Athenaeum. A man in Salem who collects "true crime" has offered three hundred. I don\'t like him. I want to know what it\'s worth before I don\'t like him properly.');
      const i = await respond(a, 'hugo', [
        { label: '"It\'s a town record. It belongs with Hester."', tone: 'straight' },
        { label: '"Three hundred is fair. Maybe low."', tone: 'sly' },
        { label: '"Read it before you decide."', tone: 'kind' }
      ]);
      t.f.lean = ['athenaeum', 'sold', 'read'][i];
      await say(a, ['That\'s what I think. I wanted somebody else to think it, so I\'m not just being sentimental.', 'Low! He\'ll go higher? I don\'t like that I\'m pleased about it.', 'Read it. Yes. I\'ve been putting that off. I know too many of these surnames.'][i]);
    },
    async (a, t) => {
      await say(a, 'I read it. February 1931. "Mrs. Eunice Strand. One ounce, arsenic. Rats." Her husband died that March. A stomach complaint, it says on the stone.');
      await say(a, 'Her great-grandson teaches fourth grade at the school. Lovely man. Gets his allergy pills from me. If that book goes to Salem, he\'ll be on a podcast by spring.');
      const i = await respond(a, 'hugo', [
        { label: '"Give it to Hester whole. It\'s history."', tone: 'straight' },
        { label: '"Sell it. People die of stomach complaints."', tone: 'sly' },
        { label: '"Take that page out first. Give it to the family."', tone: 'kind' }
      ]);
      t.f.choice = ['athenaeum', 'sold', 'torn'][i];
      await say(a, ['Whole. Hester will put it in a drawer that only opens for people with a reason. That\'s fair, I think.', 'They do. They did. I don\'t like that I\'m going to do this.', 'Tear a page out of my grandfather\'s book. He\'d have done it himself, I think. He knew her.'][i]);
    },
    async (a, t) => {
      if (t.f.choice === 'sold') {
        t.end = 'sold';
        await say(a, 'The man from Salem paid three-fifty. You were right that it was low. Here\'s a finder\'s fee, which is a thing I\'ve just invented.');
        change('coin', 35, 'A finder\'s fee from Hugo Pettengill');
        await say(a, 'I\'ve stopped reading the Salem papers. I don\'t want to know.');
      } else if (t.f.choice === 'torn') {
        t.end = 'torn'; change('rep', 2);
        await say(a, 'I gave the page to the Strand boy. In an envelope, at the counter, with his allergy pills. He opened it there. He went white, then he laughed, then he said, "Great-Gran always said Grandad Obed was a rat." Then he took the page home.');
        await say(a, 'Hester has the rest of the book. She noticed the page was gone. She looked at me over her glasses for a very long time and wrote "page 61 wanting" in the catalogue.');
      } else {
        t.end = 'athenaeum'; change('rep', 3);
        await say(a, 'Hester has it in the locked case. You need a reason and a pencil to read it. She asked me if I wanted a plaque. I said no. She made one anyway.');
      }
      const i = await respond(a, 'hugo', [
        { label: '"Your grandfather kept a good book."', tone: 'kind' },
        { label: '"Any more books in that stockroom?"', tone: 'sly' },
        { label: '"Do you think she did it?"', tone: 'straight' }
      ]);
      await say(a, ['He kept good books and bad secrets. I\'m trying to do the other way round.', 'A box of 1950s hairnets and a bottle of Vigor. You can have the hairnets.', 'I think she bought an ounce of arsenic for the rats. That\'s all the book says. That\'s all I\'ll ever say.'][i]);
      if (isFriend('hugo', 'warm')) await say(a, 'Captain Barrow collects her blood pressure pills from me on Mondays. If your name ever comes up, I\'ll say you\'re steady. She listens to her pharmacist. Nobody else, but me.');
    }
  ],
  epilogue: { athenaeum: 'The Pettengill poison register is in the Athenaeum\'s locked case. Hester Quint made a plaque nobody asked for.', sold: 'The Pettengill poison register went to a collector in Salem. Hugo Pettengill doesn\'t read the Salem papers any more.', torn: 'The Pettengill poison register is at the Athenaeum, page 61 wanting. A fourth-grade teacher keeps it in a drawer.' }
});

addRegular('mercy', {
  name: 'Mercy Hapgood', place: 'Hapgood Farm out on the Plymouth road, and the Grange Hall', topic: 'the farms inland and the Grange: the suppers, the fair, and whose barn is falling down',
  look: { skin: '#e0a880', hair: '#a86a3a', hs: 3, coat: '#5a6a3a', trim: '#c8a050', style: 'jacket', pants: '#3a3a5a', hat: 'beanie', hatc: '#a82a2a', shoe: '#5a3a1a' },
  meet: 'Mercy Hapgood. Hapgood Farm, out past the bogs. Pumpkins in October, trees in December, syrup in March, and the Grange supper whenever there\'s a Saturday.',
  chat: ['The Grange supper is beans, brown bread and an argument about the fair. It\'s been the same argument since 1952.', 'Every barn inland has one thing up in the rafters that nobody\'s looked at since Truman. Mine had a sleigh.', 'Cows don\'t care what day it is. That\'s the best and the worst thing about cows.'],
  small: [
    { say: 'Somebody from Boston asked me if my pumpkins were "heritage". I said they\'re orange and they\'re from the field. She paid double.', opts: [
      { label: '"Heritage pricing. I should try it."', tone: 'sly', reply: 'You already do. I\'ve seen your window.' },
      { label: '"Were they heritage?"', tone: 'straight', reply: 'My grandmother planted the seed. So, yes, if you squint. I squinted all the way to the bank.' },
      { label: '"Good for you."', tone: 'kind', reply: 'Good for the roof fund. The barn\'s a sieve.' }] },
    { say: 'The Grange has had the same president for thirty years because nobody else will take the gavel. Every year he resigns. Every year we vote him back in.', opts: [
      { label: '"Why does he keep resigning?"', tone: 'straight', reply: 'So we\'ll ask him. Then he does a little speech. It\'s the highlight of the supper.' },
      { label: '"Sounds like a man who loves a vote."', tone: 'wry', reply: 'He loves the speech. The vote\'s just the excuse.' },
      { label: '"Somebody should just take it off him."', tone: 'sharp', reply: 'You try. He sleeps with it.' }] },
    { say: 'The fair queen\'s crown is in a shoebox in the Grange kitchen. Every girl who\'s worn it since 1949 signed the inside of the lid.', opts: [
      { label: '"Did you ever wear it?"', tone: 'straight', reply: '1989. I\'m on the lid between a dentist and a girl who moved to Paris. I\'m the one who stayed.' },
      { label: '"That lid must be worth something."', tone: 'sly', reply: 'To about four hundred women in this county. Don\'t you dare.' },
      { label: '"That\'s lovely."', tone: 'kind', reply: 'It is. It\'s also a shoebox. We\'re not fancy.' }] },
    { say: 'Sugaring starts when the nights freeze and the days don\'t. Forty gallons of sap for one of syrup. People complain about the price. People haven\'t boiled sap.', opts: [
      { label: '"Forty to one? That\'s worse than my margins."', tone: 'wry', reply: 'Nothing\'s worse than your margins. I\'ve heard about your margins.' },
      { label: '"How long do you boil it?"', tone: 'straight', reply: 'All night, some nights. I sleep in the sugarhouse in a deck chair. It\'s the best sleep of the year.' },
      { label: '"Charge more, then."', tone: 'sly', reply: 'I charge what my grandmother charged plus a dollar. That\'s the rule. Somebody has to have one.' }] }
  ],
  reckon: {
    up: { say: 'I heard about {quest}. At the Grange supper. Between the beans and the argument. It came up in the good part.', opts: [
      { label: '"There\'s a good part?"', tone: 'wry', reply: 'The brown bread. You were mentioned during the brown bread.' },
      { label: '"I\'m glad it went right."', tone: 'straight', reply: 'So are the farms. We talk about who\'s straight. It\'s a short list. You\'re on it.' }] },
    down: { say: 'I heard about {quest}. At the Grange. During the argument. You were the argument this week.', opts: [
      { label: '"Then I\'ll come and answer for it."', tone: 'straight', sway: 1, reply: 'At a Grange supper? That\'s brave. Bring a dish.' },
      { label: '"Farmers. What do they know?"', tone: 'sly', sway: -1, reply: 'Where your food comes from. And now, where not to sell.' }] }
  },
  mend: townMend({ say: 'Mercy Hapgood. I\'ve got syrup in the truck for the bakery. None for you.', label: 'Buy a quart of her syrup anyway', cost: 12, why: 'A quart of Hapgood Farm syrup', refuse: '"Suit yourself."', yes: 'Twelve dollars. My grandmother\'s price plus one. All right. You can have a bottle next year too.', no: 'I will.' }),
  title: 'The Carousel Horse', endings: { fair: 'Back at the Fair', sold: 'Gone to New Hampshire', kept: 'Back in the Rafters' },
  steps: [
    async (a, t) => {
      await say(a, 'The barn roof came down on Sunday. Half of it. And up in what was left of the rafters, wrapped in feed sacks, we found this. Help me with it, it\'s in the truck.');
      view.counterIcon = 'statuette';
      await narrate('A carved wooden horse, life-sized from the neck up, its body broken off at the pole. Glass eyes, a carved rose on the bridle, gold leaf on the mane, nearly all flaked away.');
      view.counterIcon = null;
      await say(a, 'It\'s off the fair carousel. The old one. They sold the carousel off in 1961 and everybody said all the horses went to a park in New Hampshire. Not this one. Grandad was on the fair board. Grandad was a thief, apparently.');
      const i = await respond(a, 'mercy', [
        { label: '"It\'s carousel work from the 1900s. Collectors pay a lot."', tone: 'straight' },
        { label: '"Your grandad had taste, at least."', tone: 'wry' },
        { label: '"I\'d take it off your hands for eighty."', tone: 'sly' }
      ]);
      t.f.lowball = i === 2;
      await say(a, ['A lot. And I need a lot. A barn roof\'s a lot. I hate this.', 'He had taste and a ladder. That\'s a dangerous man.', 'Eighty? For the fair carousel? You\'ll be telling me next it\'s pine. It\'s not pine.'][i]);
      await say(a, 'Keep it for me while I think. It can\'t stay in a barn with no roof.');
    },
    async (a, t) => {
      await say(a, 'It\'s got out. Everybody at the Grange supper knows. The fair board wants it back for the fair, on a stand, with a sign. A man from the park in New Hampshire rang me. He wants it for the carousel. He said a number. It\'s a roof.');
      if (t.f.lowball) await say(a, 'More than eighty, I\'ll tell you that for nothing.');
      const i = await respond(a, 'mercy', [
        { label: '"Give it to the fair. That\'s where it lived."', tone: 'kind' },
        { label: '"Sell it to New Hampshire. Fix the barn."', tone: 'straight' },
        { label: '"Put it back in the rafters when the roof\'s on. Tell nobody."', tone: 'sly' }
      ]);
      t.f.choice = ['fair', 'sold', 'kept'][i];
      await say(a, ['The fair. And the barn leaks another year. Grandad would hate it, so I like it.', 'New Hampshire. Back on the carousel with all its brothers. It\'d go round again. That\'s something.', 'Back up where Grandad put it. Ha. That\'s the most Hapgood thing anybody\'s ever said to me.'][i]);
    },
    async (a, t) => {
      if (t.f.choice === 'sold') {
        t.end = 'sold';
        await say(a, 'The man from New Hampshire came with a trailer and a check. The barn has a roof. He sent a photo: our horse, on the carousel, between a zebra and a sea serpent, going round.');
        await say(a, 'You kept it dry for two weeks. Here. Storage, at a farm rate.');
        change('coin', 30, 'Mercy Hapgood, for keeping the carousel horse');
      } else if (t.f.choice === 'fair') {
        t.end = 'fair'; change('rep', 4);
        await say(a, 'It\'s in the Grange Hall till the fair, on a stand Hal built, with a sign: "RETURNED, 1961 TO 2026, BY THE HAPGOODS, WITH APOLOGIES." The president gave a speech. It was long.');
      } else {
        t.end = 'kept'; change('rep', 1);
        await say(a, 'The roof went on last week. Second-hand tin, and Leon\'s help, and a loan from my sister. And the horse is back in the rafters, in its feed sacks. Grandad would be proud. That\'s not a compliment.');
      }
      const i = await respond(a, 'mercy', [
        { label: '"Will you tell the Grange what your grandad did?"', tone: 'straight' },
        { label: '"Any other horses up there?"', tone: 'wry' },
        { label: '"I\'m glad the barn\'s all right."', tone: 'kind' }
      ]);
      await say(a, ['They know. Everybody knows. That\'s the Grange. We only pretend not to.', 'I looked. A sleigh, a bathtub and a box of 1940s fair ribbons. All blue. He stole those too.', 'It\'s a barn. It\'ll fall down again. They all do. That\'s why there\'s a Grange.'][i]);
      if (isFriend('mercy', 'warm')) await say(a, 'Here\'s a thing. The farms inland ask me where to sell what they dig out of their barns. From now on, I\'ll say your name first.');
    }
  ],
  epilogue: { fair: 'A carousel horse stands in the Grange Hall with a sign: "RETURNED, 1961 TO 2026, BY THE HAPGOODS, WITH APOLOGIES."', sold: 'The Hollow Neck fair horse goes round again on a carousel in New Hampshire, between a zebra and a sea serpent. Hapgood Farm has a new barn roof.', kept: 'The Hollow Neck fair horse is back in the Hapgood rafters, in feed sacks, where Grandad put it.' }
});

// ---------------------------------------------------------------- the run's town plan
// Made once per run from the run code: who's in the spotlight, and who visits on which day.
// Spotlight picks favour regulars whose thread you haven't finished in an earlier run.
function hookDay(questId) {
  let best = null;
  for (const [key, sc] of Object.entries(SCRIPT)) for (const c of (sc.customers || [])) if (c.quest === questId) {
    const d = dayOf(key); if (best === null || d < best) best = d;
  }
  return best;
}
function planTown(run) {
  if (run.town) return run.town;
  // each month of a stay has its own town (October's seed is unchanged, so a code still gives the
  // same October); run.townAfter (js/stay.js) says whose thread this stay has already started and
  // who was in town last month
  const r = seededRandom(run.seed + '/town' + (run.month > 1 ? '/m' + run.month : ''));
  const after = run.townAfter || { started: [], last: [] };
  const book = typeof loadBook === 'function' ? loadBook() : { town: {} };
  const done = (book.town || {});
  const ids = Object.keys(TOWN);
  // the spotlight: unfinished threads first, three of them, never one already played this stay;
  // a regular who was in town last month is less likely to be back this month
  const order = ids.map(id => ({ id, w: (done[id] && done[id].length ? 1 : 3) * r() * (after.last.includes(id) ? 0.5 : 1) })).sort((a, b) => b.w - a.w).map(x => x.id);
  const spotlight = order.filter(id => !after.started.includes(id)).slice(0, TOWN_SPOTLIGHT);
  const days = {};
  const count = d => (days[d] || []).length;
  const busy = (d, id) => (days[d] || []).some(v => v.id === id);
  const put = (d, v) => { (days[d] = days[d] || []).push(v); };
  // pick the least crowded day in a window, preferring later days (closer to what's coming)
  const bestDay = (from, to, id) => {
    const c = [];
    for (let d = Math.max(2, from); d <= Math.min(20, to); d++) if (!busy(d, id) && count(d) < TOWN_VISITS_PER_DAY) c.push(d);
    if (!c.length) return null;
    const low = Math.min(...c.map(count));
    const best = c.filter(d => count(d) === low);
    return best[Math.floor(r() * best.length)];
  };
  // thread steps: a step each in weeks 1-2, 2-3 and 3-4
  const windows = [[6, 9], [10, 14], [15, 19]];
  for (const id of spotlight) windows.forEach((w, n) => { const d = bestDay(w[0], w[1], id); if (d) put(d, { id, step: n }); });
  // rumours: the regular who owns the topic, one to three days before the quest's first customer
  for (const q of [...run.majors, ...(run.minors || [])]) {
    const talk = TOWN_TALK[q];
    if (!talk || !TOWN[talk.by]) continue;
    const h = hookDay(q);
    if (h === null || h < 2) continue;
    const merge = [h - 1, h - 2, h - 3].find(d => d >= TOWN_TALK_FROM && busy(d, talk.by));
    if (merge) { days[merge].find(v => v.id === talk.by).rumour = q; continue; }
    const d = bestDay(Math.max(TOWN_TALK_FROM, h - 3), h - 1, talk.by);
    if (d) put(d, { id: talk.by, rumour: q });
  }
  // who's in town this month: the spotlight, every regular a drawn story needs for its rumour, and a
  // few more from the shuffled order until there are about TOWN_PRESENT. Everyone else is away.
  const present = new Set(spotlight);
  for (const q of [...run.majors, ...(run.minors || [])]) if (TOWN_TALK[q] && TOWN[TOWN_TALK[q].by]) present.add(TOWN_TALK[q].by);
  for (const id of order) if (present.size < TOWN_PRESENT) present.add(id);
  // week 1: a few of them come in as ordinary customers, buying or selling, and introduce themselves
  // (Rich: their talk only makes sense once you've seen the town; week 1 is for learning the trade)
  for (const id of order) {
    if (!present.has(id)) continue;
    const d = bestDay(2, TOWN_TALK_FROM - 1, id);
    if (d && count(d) === 0) put(d, { id, customer: true });
  }
  // everyone in town comes in at least once with something to say, from week 2
  // (after the week-1 customer visit, if they had one)
  for (const id of ids) {
    if (!present.has(id)) continue;
    if (Object.values(days).some(vs => vs.some(v => v.id === id && !v.customer))) continue;
    const d = bestDay(TOWN_TALK_FROM, 19, id);
    if (d) put(d, { id, cameo: true });
  }
  // a second, later visit for regulars with a reaction to give: added at the end of week 4
  for (const id of ids) { if (!present.has(id)) continue; const d = bestDay(17, 20, id); if (d && r() < 0.5) put(d, { id, late: true }); }
  run.town = { spotlight, present: ids.filter(id => present.has(id)), days };
  return run.town;
}
// is this regular in town this month (and hasn't left)? Quests can use it to bring a regular in.
function townHere(id) {
  if (!S || !S.run || !TOWN[id]) return false;
  const mood = townMood(id);
  return planTown(S.run).present.includes(id) && !(mood && mood.mood === 'gone');
}
function townToday() {
  if (!S.run) return [];
  const plan = planTown(S.run);
  return plan.days[dayNum()] || [];
}

// reactions waiting for a regular: quests on their topic that have ended this run
function pendingReactions(id) {
  if (!S.run) return [];
  const st = townState();
  const out = [];
  for (const q of [...S.run.majors, ...(S.run.minors || [])]) {
    const talk = TOWN_TALK[q], quest = QUESTS[q];
    if (!talk || talk.by !== id || st.reacted[q] || !quest || !(S.run.met && S.run.met[q])) continue;
    const end = quest.outcome ? quest.outcome(S.flags) : null;
    if (!end) continue;
    const line = typeof talk.react === 'string' ? talk.react : talk.react && talk.react[end];
    if (line) out.push({ q, line });
  }
  return out;
}

// ---------------------------------------------------------------- consequences
// Some quest endings cost you a regular for the rest of the run (Rich, 2026-11-01: "I like the idea
// of consequences"). They're back next run, as if nothing happened, because next run it didn't.
//   gone: they leave town. No more visits, and their thread (if they're in the spotlight) stops.
//   cold: they still come in, but only to say so once; their thread stops, and later visits are curt.
// line: what you hear (a morning notice when they go, their words when they're cold).
// after: the ending-screen line, used in place of a thread ending they never reached.
const TOWN_FALLOUT = {
  grey: { keeper: { id: 'orsolya', mood: 'gone', line: 'Madame Orsolya\'s parlor is shuttered. A card in the window: "CLOSED. ASK THE KEEPER WHY."', after: 'Madame Orsolya kept her parlor shut until the month was out. She says she couldn\'t bear to read what she\'d see.' } },
  psalter: { partial: { id: 'bettany', mood: 'gone', line: 'Lowe\'s Bakery opens late, with Rosa alone at the counter. Bettany didn\'t come back from the marsh.', after: 'Bettany Lowe came back from Hob\'s Marsh in the first week of the next month, muddy, and asked for a roll.' } },
  selectmen: { haines: { id: 'tess', mood: 'cold', line: 'Selectman Haines. You had a window and a sign, and you know which sign I mean. I\'ll be at the shack.', after: 'Tess Bascombe stopped bringing her coffee in after the election. She\'ll get over it. She says so.' },
    bascombe: { id: 'gordie', mood: 'cold', line: 'I lost. I\'m not mad. I\'m a professional. I\'m going to stand over here and not be mad, for a while.', after: 'Gordie Haines didn\'t send you a calendar this year. He sends everyone a calendar.' } },
  freezer: { sold: { id: 'dory', mood: 'cold', line: 'It\'s on its way to a studio in New York in a crate. It looked at me. I\'m not selling you anything else out of the water this month.', after: 'Dory Kittredge sold nothing to the Crooked Scale for the rest of the month. She sold it to the chain on Route 1. Out of spite.' } },
  hollis: { betrayed: { id: 'agathe', mood: 'cold', line: 'Hollis told me what you did. My father would have stopped your clock for that. I\'ll just stop coming in.', after: 'Agathe Moss crossed the street to avoid your window for the rest of the month.' } },
  ned: { ohio: { id: 'ruthie', mood: 'cold', line: 'Ohio. You sold Captain Ned to Ohio. I hope he talks to them all night.', after: 'Ruthie Kroll took the Crooked Scale off the trivia sign-up sheet. In pen.' } },
  veil: { sold: { id: 'dot', mood: 'cold', line: 'A girl\'s grandmother\'s veil. Sold. I\'ll still walk past. I won\'t be waving.', after: 'Dot Haskell walked past your window every morning that month, eyes front.' } },
  dog: { pound: { id: 'bettany', mood: 'cold', line: 'Plymouth. The pound in Plymouth. I\'ll keep his bread for him anyway.', after: 'Bettany Lowe kept the heel of every loaf for a dog who wasn\'t there.' } },
  overdue: { keepers: { id: 'hester', mood: 'cold', line: 'You have an Athenaeum book. I know you have it. I am not going to say anything else.', after: 'Hester Quint said nothing else for the rest of the month. Loudly.' } },
  weathervane: { whaling: { id: 'marguerite', mood: 'cold', line: 'Our 1888 whale is gone, and I hear your counter had something to do with it. I am not hurrying back.', after: 'Marguerite Oyelaran added an article to the next Town Meeting warrant. It\'s about weathervanes, and it\'s about you.' } },
  decoy: { two: { id: 'hal', mood: 'cold', line: 'Two Toomey herons and one of them\'s a liar. I hear you sold the liar. I sell honest nails, myself.', after: 'Hal Mayhew sold you your nails by the pound that month, but he weighed them twice.' } },
  evidence: { clean: { id: 'dunphy', mood: 'cold', line: 'You looked at me. In front of the Captain. I\'m on parking duty now. I\'ll be doing your street. Thoroughly.', after: 'Officer Dunphy ticketed every car on your street that month, including his own.' } },
  scrimshaw: { reported: { id: 'marv', mood: 'cold', line: 'You gave a wildlife officer my name. Over a tooth I found in a sea chest. I didn\'t carve it. I\'ll be selling to Plymouth for a while.', after: 'Marv Kettle took his house clearances to the dealer in Plymouth for the rest of the month.' } },
  fog: { tycoon: { id: 'tess', mood: 'cold', line: 'You sold fakes to the drowned. My grandfather is one of the drowned. Good day.', after: 'Tess Bascombe stayed away from the Crooked Scale until the fog came back the next year.' } },
  nightferry: { cut: { id: 'tess', mood: 'cold', line: 'I count the lights on my water at two in the morning. One of them is your back room. I\'ll be at the shack.', after: 'Tess Bascombe logged every crate that went through your back door that month, in pencil, and kept the log at home.' } },
  bigcoat: { hunted: { id: 'bettany', mood: 'cold', line: 'You waved the flashlights over. Nobody stands in the warm at five any more. I\'m too busy to talk.', after: 'Bettany Lowe left a roll on the bakery step every morning that month. Nobody came for it.' } },
};
function townMood(id) {
  if (!S.run) return null;
  for (const q of [...S.run.majors, ...(S.run.minors || [])]) {
    const f = TOWN_FALLOUT[q], quest = QUESTS[q];
    if (!f || !quest || !(S.run.met && S.run.met[q]) || !quest.outcome) continue;
    const x = f[quest.outcome(S.flags)];
    if (x && x.id === id) return { ...x, q };
  }
  return null;
}

// ---------------------------------------------------------------- a visit
async function townVisit(c, v) {
  const a = c.actor, r = TOWN[v.id], st = townState();
  let said = false;
  const mood = townMood(v.id);
  if (mood) { // cold: say so once, then keep it short; the thread stops here
    st.cold = st.cold || {};
    st.reacted[mood.q] = true;
    if (!st.cold[v.id]) { st.cold[v.id] = true; change('rep', -2); await say(a, mood.line); }
    else if (!(typeof talkMend === 'function' && await talkMend(a, v.id))) await say(a, 'Just passing through.'); // a chance to make it up (js/standing.js)
    if (v.rumour && !st.told[v.rumour] && !(S.run.met && S.run.met[v.rumour])) { st.told[v.rumour] = true; await say(a, TOWN_TALK[v.rumour].rumour[0]); }
    await leaveShop(a);
    return;
  }
  if (!st.met[v.id]) { st.met[v.id] = true; await say(a, r.meet); said = true; }
  // a stay: their line for the month, once, on the first visit of the month (js/townmonths.js)
  let want = null;
  if (typeof townMonthDue === 'function' && townMonthDue(v.id)) {
    const m = townMonthLine(v.id);
    townMonthSaid(v.id);
    await say(a, m.say); said = true;
    want = m.want || null;
  }
  for (const x of pendingReactions(v.id).slice(0, 1)) { st.reacted[x.q] = true; await say(a, x.line); said = true; }
  // talks (js/standing.js): a reckoning after a quest ending moved them, or a sore regular's mending offer
  if (typeof talkReckon === 'function' && await talkReckon(a, v.id)) said = true;
  else if (typeof talkMend === 'function' && await talkMend(a, v.id)) said = true;
  if (v.rumour && !st.told[v.rumour] && !(S.run.met && S.run.met[v.rumour])) {
    st.told[v.rumour] = true;
    for (const line of TOWN_TALK[v.rumour].rumour) await say(a, line);
    said = true;
  }
  if (v.step !== undefined) {
    const t = thread(v.id);
    if (t.step === v.step && !t.end) { await r.steps[v.step](a, t); t.step++; said = true; }
  }
  if (!said) {
    const used = st.chat = st.chat || {};
    const n = used[v.id] || 0; used[v.id] = n + 1;
    if (r.small && r.small.length && typeof talkSmall === 'function') await talkSmall(a, v.id, r.small[n % r.small.length]);
    else await say(a, r.chat[n % r.chat.length]);
  }
  // what they wanted this month: on the shelf, they buy it; if not, they come back for it
  if (want) return runWanted({ type: 'wanted', actor: a, key: want, mult: WANTED_MULT[1], sharp: false, name: r.name, look: r.look, pitched: true });
  await leaveShop(a);
}
HOOKS.day = HOOKS.day || [];
HOOKS.day.push(list => {
  for (const v of townToday()) {
    const r = TOWN[v.id];
    if (!r) continue;
    // a regular who has left town (TOWN_FALLOUT) is announced once and stays away
    const mood = townMood(v.id);
    if (mood && mood.mood === 'gone') {
      const st = townState(); st.gone = st.gone || {};
      if (!st.gone[v.id]) { st.gone[v.id] = true; st.reacted[mood.q] = true; toast(mood.line, r.look); }
      continue;
    }
    // week 1: an ordinary customer who happens to be a regular. They introduce themselves and trade.
    if (v.customer) {
      if (list.some(c => c.cast === v.id)) continue;
      let c = null;
      for (let n = 0; n < 6 && (!c || (c.item && (c.item.fake || c.item.stolen))); n++) c = forSale().length >= 2 && Math.random() < 0.5 ? genBuyer() : genSeller();
      if (c.item && (c.item.fake || c.item.stolen)) continue;
      Object.assign(c, { name: r.name, look: r.look, town: v.id });
      if (c.persona) c.persona = 'honest';
      const st = townState();
      if (!st.met[v.id]) { st.met[v.id] = true; c.intro = r.meet; }
      list.push(c);
      continue;
    }
    // a regular already in today for a quest of their own doesn't come in twice just to chat
    if ((v.cameo || v.late) && list.some(c => c.cast === v.id)) continue;
    // a regular with nothing to do today (a late visit with no reaction) stays home
    if (v.late && !pendingReactions(v.id).length && !(mood && !(townState().cold || {})[v.id])) continue;
    list.push({ type: 'story', town: v.id, name: r.name, look: r.look, first: !!v.rumour, run: c => townVisit(c, v) });
  }
});

// ---------------------------------------------------------------- endings and the Storybook
HOOKS.ending.push((title, lines) => {
  if (!S.run || !S.town) return;
  const book = loadBook();
  book.town = book.town || {};
  for (const id of (S.run.town ? S.run.town.spotlight : [])) {
    const t = S.town.thr[id];
    const mood = townMood(id);
    if ((!t || !t.end) && mood) { lines.push(mood.after); continue; }
    if (!t || !t.end) continue;
    lines.push(TOWN[id].epilogue[t.end]);
    const e = book.town[id] = book.town[id] || [];
    if (!e.includes(t.end)) e.push(t.end);
  }
  saveBook(book);
});
function townBookHTML(book) {
  const done = book.town || {};
  const rows = Object.values(TOWN).map(r => {
    const e = done[r.id] || [];
    const all = Object.keys(r.endings);
    if (!e.length) return `<div class="book-quest unmet"><b>${esc(r.name)}</b> <span class="muted">${esc(r.place)}</span><p class="muted">${esc(r.title)}: · · ·</p></div>`;
    return `<div class="book-quest"><b>${esc(r.name)}</b> <span class="muted">${esc(r.place)} · ${e.length} of ${all.length}${typeof standingBookNote === 'function' ? esc(standingBookNote(r.id, book)) : ''}</span>
      <p>${esc(r.title)}: ${all.map(k => e.includes(k) ? esc(r.endings[k]) : '<span class="muted">· · ·</span>').join(' &nbsp;/&nbsp; ')}</p></div>`;
  }).join('');
  return `<h3>The town <span class="muted">${Object.keys(done).filter(id => TOWN[id] && done[id].length).length} of ${Object.keys(TOWN).length}</span></h3><div class="book-list">${rows}</div>`;
}
