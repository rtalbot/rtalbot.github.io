// Pawn Champ - the regulars through the months of a stay (docs/quests/TOWN.md#through-the-months,
// docs/SEASONS.md). Loaded after js/town.js.
//
// October is the game as it always was. From November, each regular has a line for the month, said
// once as they come in on their first visit of the month (after hello, before anything else). Some
// months, instead of a line, a regular wants something: { say, want: item key }. They ask for it as a
// wanted customer would (runWanted in js/game.js): if it's on your shelf they buy it then, at a wanted
// customer's price, and if not they come back in two or three days to see if one turned up.
// One want per regular per stay, so a month brings one or two of them.
'use strict';

const TOWN_MONTHS = {
  tess: {
    2: 'Half the fleet\'s hauled out for the winter. The harbor looks like a mouth with the teeth out.',
    3: 'First skim of ice at the slip this morning. I broke it with a boathook. It came back by noon. It always wins.',
    4: 'The harbor\'s froze to the second piling. I\'ve walked out on it every January for thirty years, and every January I say I won\'t.',
    5: 'February\'s the month the boats talk to you. Creaking in their cradles. Asking when.',
    6: { say: 'First boat goes out in two weeks, and my good compass has walked off the shack wall. If a brass one comes in, a real one, it\'s mine.', want: 'compass' } },
  ignatius: {
    2: 'Thanksgiving. I\'ll say grace over four hundred turkeys this week, and eat at none of them, and I\'ll be stuffed by Thursday anyway.',
    3: { say: 'The Christmas Eve candles want a pair of proper candlesticks on the altar. Ours are brass, and one leans. A silver one would do, if God and your shelf provide.', want: 'candlestick' },
    4: 'The boiler at Saint Brine\'s and I are both a hundred years old in January. Only one of us makes that noise.',
    5: 'Lent soon. I\'m giving up being right in arguments. I expect to fail by Thursday.',
    6: 'The crocuses are up by the gate. I count them every morning. I\'m told it isn\'t a sacrament. I\'m not convinced.' },
  hester: {
    2: 'The Athenaeum\'s radiators have come on. Everybody who doesn\'t own one is suddenly a great reader.',
    3: 'I\'ve hidden the Christmas books on the bottom shelf, so the people who really want them have to kneel.',
    4: { say: 'January is for reading what you meant to read all year. I\'d like a proper first edition for my own shelf, for once. Not the Athenaeum\'s. Mine.', want: 'tome' },
    5: 'February. Overdue fines double for anyone who returns a book with a Valentine pressed in it. That\'s not a rule. I just do it.',
    6: 'Town Meeting\'s in March. Everyone wants the 1952 minutes to prove a point. The 1952 minutes prove nothing. I\'ve read them.' },
  marguerite: {
    2: 'The warrant for March is open. Forty-one articles so far. Thirty-eight of them are about parking.',
    3: 'The Christmas tree on the Green leans to the left. A man has written to me about it. Twice. With a diagram.',
    4: 'January, and the selectmen meet in their coats, because the Town Hall heat is on article nineteen.',
    5: { say: 'My grandfather\'s watch stopped keeping time at the last meeting. A moderator should know the time to the second. If you get a good one, a Swiss one, I\'m buying.', want: 'watch' },
    6: 'Town Meeting\'s next week. I have my gavel, my glasses, and a thermos of something I won\'t name.' },
  dory: {
    2: 'Scallops are in. Everybody wants them for the holidays and nobody wants to pay. Same as every year.',
    3: 'Christmas Eve is seven fishes for half the town. I\'ve got five. The other two are on their way, I\'m told, by a man with a beard.',
    4: { say: 'My boots split on the pier this morning and I\'ve got a wet foot to show for it. If a decent pair of rubber boots comes in, the yellow band kind, save them.', want: 'boots' },
    5: 'February. The ice in the harbor makes noises at night. I don\'t like what they sound like. I sell fish. I don\'t have to like it.',
    6: 'Herring are running early. I can smell it on the wind before the boats can see it.' },
  dot: {
    2: 'The Shack closes Thanksgiving week till April. I\'ll be walking past your window for gossip, not clams.',
    3: 'Everybody wants to know who\'s bringing who to the Christmas Eve thing at the Anchor. I know. I\'m not telling. Yet.',
    4: 'January\'s quiet, so people do stupid things for something to talk about. I approve. Somebody has to.',
    5: { say: 'Valentine\'s Day, and I\'m buying myself something nice for once. A brooch. A good red one. Fifty years of other people\'s sweethearts, I\'ve earned a brooch.', want: 'brooch' },
    6: 'Shack opens in April. I\'ve already had three people ask if the fried clams will be the same. They\'re clams. They\'re always the same.' },
  ruthie: {
    2: 'Trivia this month is all Thanksgiving questions. Who brought what to the first one. Nobody knows. That\'s the beauty of it.',
    3: { say: 'The Anchor\'s Christmas raffle needs a top prize, and the jukebox needs a friend. A good electric guitar. I\'ll pay you proper for one, and hang it over the bar.', want: 'lute' },
    4: 'New Year\'s Eve, three hundred people in a room for ninety. The fire marshal came. He stayed till two.',
    5: 'February trivia\'s all love songs. The Tuesday team\'s already arguing about who wrote which.',
    6: 'March. The fishermen are back in the Anchor talking about the boats instead of the weather. That means spring.' },
  orsolya: {
    2: 'November is the month the dead lean closest. Also, my furnace. I can\'t tell which is louder.',
    3: 'Everybody wants their cards read in December. Nobody wants to hear what the cards say in December.',
    4: { say: 'January. I need a new focus for the table. Something old, with light in it. A jade figure would do. Jade remembers.', want: 'statuette' },
    5: 'The Wolf Moon has passed. You can stop looking at the marsh now. I haven\'t.',
    6: 'The thaw brings things up. Bulbs. Boots. Other things. I\'m busy in March.' },
  agathe: {
    2: 'The clocks went back and half the town brought me their clocks, as if I\'d done it.',
    3: 'Everyone wants their grandmother\'s mantel clock going by Christmas. I fix three a day and dream in springs.',
    4: 'January is for the long jobs. I have a tall-case clock in pieces on my floor. It and I aren\'t speaking.',
    5: 'The cold makes old movements sulk. I\'ve got four watches running slow and one running away.',
    6: { say: 'I\'ve a customer who wants a music box for her granddaughter\'s christening. Something with a proper comb and cylinder, not a toy. If one comes in, I\'ll pay you and fix it free.', want: 'musicbox' } },
  bev: {
    2: 'Turkey bowl this month. Three strikes in a row and you win a frozen turkey. I\'ve had a man bowl with it after.',
    3: 'Christmas league. Everyone bowls in a sweater and blames the sweater.',
    4: 'January\'s our best month. Nothing else to do in this town but bowl and complain about bowling.',
    5: { say: 'The league\'s Valentine\'s dance is at the lanes, and I\'m giving the best couple a ring. Real gold, from you, if you\'ve got one. Don\'t tell anybody it\'s a bowling prize.', want: 'ring' },
    6: 'The pinsetter knows it\'s spring. It\'s started eating pins again. It does that in March.' },
  hal: {
    2: 'Snow shovels went on the floor this week. Somebody always buys one in November and brags about it in February.',
    3: 'Christmas lights. Every year somebody buys three hundred feet and one extension cord. I sell them the second cord in January.',
    4: { say: 'Every pipe in town froze on Tuesday and I lent out my good toolbox and never saw it again. If a decent one comes in, full set, I\'m buying it before anybody else does.', want: 'toolbox' },
    5: 'February is roof rakes and rock salt. I\'ve got a man who wants to fight me over the last bag of salt. I\'m tempted.',
    6: 'Mud season. Boots, tarps, and men buying a single board to fix something they won\'t say.' },
  bettany: {
    2: 'Pies. I\'ve got two hundred pie orders for Thanksgiving and one oven. I\'ve started dreaming in crust.',
    3: 'Christmas morning I bake for the shut-ins. Hugo drives them round. Rosa sings in the van, to keep us warm.',
    4: 'Five in the morning in January is the darkest thing there is. The bread doesn\'t mind. The bread loves it.',
    5: { say: 'Rosa\'s birthday\'s Saturday. She\'s wanted a gold chain since she was twelve. A real one. If you get one in, keep it back for me, and don\'t tell her.', want: 'necklace' },
    6: 'Hot cross buns. The first ones of the year always go to the fishermen going out. That\'s my mother\'s rule.' },
  skip: {
    2: 'Kids on the bus are all talking about snow days. There\'s been no snow. They\'re practicing.',
    3: 'Christmas concert. Every kid on my route is a shepherd this year. Every one. They had a vote.',
    4: 'Two snow days already and the kids want a third. I don\'t control the weather. I tell them I do. It\'s good for discipline.',
    5: { say: 'One of the kids on my route wants to learn to take pictures. His dad\'s out on the boats. If a film camera comes in, a working one, I\'ll buy it. From me. Don\'t say from me.', want: 'spyglass' },
    6: 'March. The kids are wild. It\'s the light. It comes back and they go mad with it. So do I.' },
  gordie: {
    2: 'Black Friday sale at Haines Motors. Every car comes with a free turkey. I\'ve got a turkey problem.',
    3: { say: 'I want a painting for the office over Christmas. An oil, a real one, with a frame that says money. The clients like to see money on the wall.', want: 'painting' },
    4: 'January. Nobody buys a car in January. I sit in the showroom and practice my handshake on the mirror.',
    5: 'My TV ad\'s running again in February. "Haines Means Business." I\'m wearing a scarf this time. For the ladies.',
    6: 'Town Meeting\'s coming. I\'ve got an article on the warrant. I\'m not saying what. It\'s good for business.' },
  nanFerreira: {
    2: 'Ferry\'s down to two crossings a day till spring. The islanders do their Christmas shopping in one trip, and they carry it home on deck.',
    3: 'The island has twelve people in December and one Christmas tree. They take it in turns to have it in their house.',
    4: 'January. The ferry\'s laid up a week for the ice. The islanders ring me like I\'ve gone on holiday.',
    5: { say: 'I\'ve lost my good rope over the side, cutting us free of the ice. Climbing rope, the proper stuff, if you get any in. I\'ll pay what you ask. Nearly.', want: 'rope' },
    6: 'First run to the island with tourists on it. They ask if we see whales. I say yes. Sometimes it\'s true.' },
  marv: {
    2: 'House clearances go up after the clocks change. People decide they can\'t face another winter in that house.',
    3: 'Christmas is my worst month. Nobody clears a house at Christmas. I clear my own garage and find I\'ve kept everything.',
    4: { say: 'I cleared a cellar in January with a flashlight that died halfway down the stairs. Never again. A good one, metal, if you get one. I\'ll pay over the odds.', want: 'flashlight' },
    5: 'February. The estates from the autumn are settling. Everyone wants their share now, and nobody wants the piano.',
    6: 'Spring cleaning starts and my phone doesn\'t stop. Everyone\'s got a box. Every box is the box marked "DO NOT THROW OUT".' },
  felix: {
    2: 'Ghost walk season\'s over. I do it anyway, on Saturdays, for whoever turns up. Last week it was a dog.',
    3: 'Christmas ghost walk. Same route, more tinsel. The ghosts don\'t seem to mind.',
    4: { say: 'The January walk is all candlelight, and my lantern cracked in the cold. Somebody stole the effect. A good knife, though, a hunting knife, would do for the pirate stop. If one comes in.', want: 'dagger' },
    5: 'February\'s for writing next year\'s script. I\'ve added a ghost. He\'s a pawnbroker. He haggles.',
    6: 'March. The first tourists are back, in raincoats, asking where the haunted pawnshop is. I point. You\'re welcome.' },
  gus: {
    2: 'The chess tables on the Green are under tarps till spring. We play in the library now. Hester shushes the bishops.',
    3: 'Christmas tournament. I\'ve won it nineteen times. Every year I hope someone will beat me. Every year I\'m very disappointed in them.',
    4: 'January. Too cold for chess outside, too warm for chess inside. Hester keeps it at sixty-two. For the books.',
    5: 'February. I\'m teaching a boy off Skip\'s bus the Sicilian. He\'s teaching me a game on his phone. We\'re both losing.',
    6: { say: 'The tables on the Green open next month and the club\'s board has a crack right through the middle. If a silver goblet comes in, it\'s the club prize this year. We\'ve never had one. We\'ve had a mug.', want: 'goblet' } },
  dunphy: {
    2: 'Deer season. Lost property is full of orange hats. Nobody claims an orange hat.',
    3: 'The Captain has me on the Christmas toy drive. I\'m in charge of a box. I\'ve never been in charge of anything. I love the box.',
    4: 'January\'s break-ins are all summer houses. Lost property is full of other people\'s barbecues.',
    5: 'I\'m studying for the sergeant\'s exam again. Section four. Counterfeit goods. I think of you every time.',
    6: 'March. Somebody always drives onto the ice on the pond to check if it\'s thawed. It has. We\'ve towed two.' },
  otis: {
    2: 'Catalogs. November is the month of catalogs. My bag weighs more than I do.',
    3: 'Christmas cards. I know who isn\'t speaking to who by who stopped sending them. It\'s like reading a war.',
    4: 'January is bills. I bring them up the path apologizing. People still shut the door on me.',
    5: 'Valentine\'s. I deliver every one, even the ones with no stamp. The post office says not to. Love says otherwise.',
    6: 'Seed packets. March is all seed packets. People are planting in their heads before the ground thaws.' },
  leon: {
    2: 'Put the blade on the plow this week. The selectmen voted it one more year. It heard them. It\'s sulking.',
    3: 'First real snow. I was out at two in the morning. Your light was on again. I didn\'t see it.',
    4: 'January. Nineteen hours on the plow Tuesday. The swap shed\'s full of Christmas trees and people\'s resolutions. Mostly exercise bikes.',
    5: { say: 'I\'ve put the plow in the bank twice this month, and I spend the night digging it out with a garden spade that\'s mostly tape. If a proper spade comes in, a forged one, I\'m buying.', want: 'spade' },
    6: 'Took the blade off the plow. The selectmen want it for one more year. So do I, honestly. Don\'t tell them.' },
  vera: {
    2: 'The Thanksgiving issue. Every year I run the same recipe for stuffing, and every year three people write in to correct it.',
    3: 'Christmas issue. Letters to Santa from the second grade. I print them all, spelling and all. It\'s the best page of the year.',
    4: 'January. The year-in-review issue. I wrote it in December. Nothing happened in between. Something always does.',
    5: 'The Valentine\'s classifieds. I\'ve had a marriage proposal and a lost cat in the same box. I put them side by side.',
    6: { say: 'Town Meeting\'s in two weeks and I photograph every vote. My camera died in the cold. A film one, a good one, if one comes in. The digital ones lie.', want: 'spyglass' } },
  rhoda: {
    2: 'We shut the Harborview for the season on Sunday. Drained the pool, turned off the sign. The Ohio couple wanted to stay. I let them. They\'ll be in room nine till Christmas.',
    3: { say: 'Every winter I do the office up for Christmas, shut or not, for the man in room three. This year I want a vase on the desk, a nice one, porcelain. Shut doesn\'t mean shabby.', want: 'vase' },
    4: 'January. Sixteen empty rooms and one man in room three watching the weather channel, loud. I sit with him. It\'s company.',
    5: 'February. I repaint the rooms, one a week. Room nine\'s blue this year. The man who books it every October won\'t notice. He never looks up.',
    6: 'We open in April. I\'ve already got bookings. People book in March like it\'s a promise. It mostly is.' },
  lupe: {
    2: 'Thanksgiving centerpieces. Every table in town gets a pumpkin with something stuck in it. I\'m the something.',
    3: 'Wreaths. Two hundred wreaths, every one with my little pine cone. My hands look like I fought a cat. I fought the wire.',
    4: 'January. Funerals, mostly. The cold takes the old ones. I do them all in white, and I know every name.',
    5: 'Valentine\'s week. I sleep in the shop. Roses up to the ceiling. Somebody always orders one daisy, and I love them most.',
    6: { say: 'Easter lilies, and a wedding at Saint Brine\'s on the twentieth. The bride wants a silver candlestick on every table. I\'ve got eleven. If a twelfth comes in, it\'s mine.', want: 'candlestick' } },
  hugo: {
    2: 'Flu shots. The line goes out the door and round past the bakery. Bettany sells them muffins. Bettany\'s cleverer than me.',
    3: 'Christmas morning I drive the shut-ins their pies from Bettany\'s, and their pills, and the gossip. The gossip\'s what they wait for.',
    4: 'January. Everyone in town has the same cough. I can tell where you\'ve been by which cough you\'ve got.',
    5: { say: 'Mrs. Oldroyd on the hill fell in the dark on her porch steps. The power went. I want to give her a proper flashlight, a metal one that\'ll last. If you get one, it\'s hers.', want: 'flashlight' },
    6: 'Allergy season starts in March. The whole town sneezes at once. You can hear it from the soda fountain.' },
  mercy: {
    2: 'The pumpkins are in the compost and the trees are tagged. Every family in town has picked theirs. Every family picks the same one.',
    3: 'Christmas trees, sold off the lot behind Mayhew\'s. I sleep in the truck so nobody steals one. Somebody always tries. I let him, usually.',
    4: 'January. Feeding cows in the dark at both ends of the day. The Grange supper\'s the only light in the week.',
    5: 'February. Tapping trees. Two hundred buckets on two hundred maples. My hands hurt and the sap isn\'t running. It will.',
    6: { say: 'Sugaring! The sap\'s running, and the boots I\'ve got let in more than the buckets do. Rubber boots, the good kind, if one comes in. I\'ll trade you syrup on top.', want: 'boots' } }
};

// what a regular says (or wants) this month, or null in October and when there's nothing
function townMonthLine(id) {
  const m = typeof monthNum === 'function' ? monthNum() : 1;
  const x = m > 1 && TOWN_MONTHS[id] && TOWN_MONTHS[id][m];
  if (!x) return null;
  const o = typeof x === 'string' ? { say: x } : x;
  // a want for a tool only counts when tools are in trade (js/bag.js); otherwise it's just a line
  if (o.want && (!ITEMS[o.want] || (ITEMS[o.want].tool && !FEATURES.bag))) return { say: o.say };
  return o;
}
// said once a month, on the first visit
function townMonthDue(id) {
  const st = townState();
  st.month = st.month || {};
  return st.month[id] !== monthNum() && !!townMonthLine(id);
}
function townMonthSaid(id) { townState().month[id] = monthNum(); }
