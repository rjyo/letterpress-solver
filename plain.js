var fs = require('fs')
  , readline = require('readline')
  , DEF = require('./lib/define')
  , rl = readline.createInterface(process.stdin, process.stdout)
  , lp = require('./lib')
  , ai = require('./lib/ai')

var wordList = lp.importDir('./words')
  , results = []
  , board

console.log('System Ready!');
rl.setPrompt('% ');
rl.prompt();

rl.on('line', function(line) {
  line = line.trim().toLowerCase();
  var op = line.substr(0,1);
  if (op === '/') {
    line = line.substring(1);
    var filtered = lp.filterResults(line, usableWords);
    lp.printResults(filtered);

    console.log('--------------------');
    console.log('Filtered ' + filtered.length + ' results');
  } else if (op === '=') {
    console.log('Board status')
    console.log('--------------------');
    console.log(board.boardWithColor());
  } else if (op === '[') {
    var move = eval(line);
    if (typeof move == 'object') {
      board.applyMove(move, false);
      console.log('Board status updated like below:');
      console.log('--------------------');
      console.log(board.boardWithColor());
      var val = board.evaluate();
      if (val == DEF.MINUS_INFINITE) {
        ai.printSummary(false);
      } else if (val == DEF.PLUS_INFINITE) {
        ai.printSummary(true);
      }
    }
  } else if (op === '<') {
    line = line.substring(1);
    var status = eval(line);
    if (typeof status == 'object') {
      board.board = status;
      console.log('Board status updated like below:');
      console.log(board.board);
    }
  } else if (op === '1' || op === '2') {
    if (op === '2') {
      board.board = board.board.multiply([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
    }

    var startTime = new Date();
    var val = board.solve();
    var endTime = new Date();
    var time = (endTime - startTime) / 1000;

    if (val == DEF.MINUS_INFINITE) {
      ai.printSummary(false);
    } else {
      if (val == DEF.PLUS_INFINITE) {
        ai.printSummary(true);
      }
      board.applyMove(board.bestMove[1], true);
      console.log('Best Move: ' + board.bestMove[2]);
      console.log(board.bestMove[1]);
      console.log('--------------------');
      console.log('Found best move at step ' + board.bestMoveIndex + '(' + parseInt(board.bestMoveIndex / board.words.length * 100) + '%), time spent: ' + time + 's');
    }
    if (op === '2') {
      board.board = board.board.multiply([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
    }
    console.log(board.boardWithColor());
  } else if (line.length == 25) {
    var startTime = new Date();

    usableWords = lp.solveBoard(line, wordList);
    usableWords = usableWords.sort(function(a, b) {
      return b[0].length - a[0].length;
    });

    var time = (new Date() - startTime) / 1000;
    startTime = new Date();

    // lp.printResults(usableWords);

    console.log('--------------------');
    console.log('Found ' + usableWords.length + ' results, time spent: ' + time + 's');

    var time = (new Date() - startTime) / 1000;
    startTime = new Date();

    var words = [];
    for (var i = 0; i < usableWords.length; i++) {
      var word = usableWords[i][0];
      words.push(word);
    }
    board = new ai.Board(line, words);

    time = (new Date() - startTime) / 1000;
    console.log('Using ' + words.length + ' results, with ' + board.words.length + ' variations, time spent: ' + time + 's');
  } else {
    console.log('Unknown input. Enter a 25-characters-long board, or use \'/\' to filter the results.');
  }
  rl.prompt();
}).on('close', function() {
  process.exit(0);
});
