var program = require('commander');

program
  .version('0.0.1')
  .option('-s, --server [url]', 'Base URL of the server')
  .option('-p, --player [player]', 'Unique player ID')
  .parse(process.argv);

var DEF = require('./lib/define')
  , lp = require('./lib')
  , ai = require('./lib/ai')

if (program.server && program.player) {
  var wordList = lp.importDir('./words')
    , results = []
    , board;

  var theirMoveApplied = false;

  var c = require('lpb-client');
  c = new c.LPBConsole(program.server, program.player);

  function takeMove() {
    var startTime = new Date();
    var val = board.solve();
    var endTime = new Date();
    var time = (endTime - startTime) / 1000;

    if (val == DEF.MINUS_INFINITE) {
      ai.printSummary(false);
      console.log(board.boardWithColor());
    } else {
      if (val == DEF.PLUS_INFINITE) {
        ai.printSummary(true);
      }
      c.move(board.bestMove[1], function(data) {
        board.applyMove(board.bestMove[1], true);
        console.log('Step ' + board.bestMoveIndex + '(' + parseInt(board.bestMoveIndex / board.words.length * 100) + '%), time: ' + time + 's');
        console.log('Our move: ' + board.bestMove[2]);
        console.log('[' + board.bestMove[1].join(', ') + ']');
        console.log(board.boardWithColor());

        c.prompt();
      });
    }
  }

  function prepareBoard(data) {
    var boardStr = data.board;
    // create the board
    console.log('Preparing board: ' + boardStr);
    var startTime = new Date();

    var usableWords = lp.solveBoard(boardStr, wordList);
    usableWords = usableWords.sort(function(a, b) {
      return b[0].length - a[0].length;
    });

    var time = (new Date() - startTime) / 1000;
    startTime = new Date();

    console.log('Found ' + usableWords.length + ' results, time spent: ' + time + 's');

    // remove subsets words
    usableWords = lp.removeSubsets(usableWords);

    var time = (new Date() - startTime) / 1000;
    startTime = new Date();

    var words = [];
    for (var i = 0; i < usableWords.length; i++) {
      var word = usableWords[i][0];
      words.push(word);
    }
    board = new ai.Board(boardStr, words);

    time = (new Date() - startTime) / 1000;
    console.log('Using ' + words.length + ' results, with ' + board.words.length + ' variations, time spent: ' + time + 's');

    for (var i = 0; i < data.steps.length; i++) {
      var p = data.steps[i][0];
      var m = data.steps[i][1];
      var ourMove = (p === program.player);
      board.applyMove(m, ourMove);
      theirMoveApplied = !ourMove;
    }
    console.log('\nCurrent board:')
    console.log('----');
    console.log(board.boardWithColor());
  }

  c.on('join', prepareBoard);

  c.on('ourmove', takeMove);

  c.on('theirmove', function(move) {
    if (!theirMoveApplied) {
      console.log('Their move: ');
      console.log('[' + move.join(', ') + ']');

      board.applyMove(move, false);
      theirMoveApplied = true;
      console.log(board.boardWithColor());
      console.log('----');
    }
    // takeMove();
    c.emit('ourmove');
  });

  c.start();
} else {
  program.outputHelp();
}
