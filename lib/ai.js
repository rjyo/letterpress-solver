var DEF = require('./define')
  , array = require('./array')
  , clc = require('cli-color');

var outOfRange = function(i) {
  return i < 0 || i > 4;
}

var boardPosition = function(board) {
  var results = new Array(25);

  for (var i = 0; i < board.length; i++) {
    var index = board.charCodeAt(i) - 97;
    if (results[index] === undefined) {
      results[index] = [i];
    } else {
      results[index].push(i);
    }
  }

  return results;
}

var posToWord = function(board, pos) {
  var s = '';
  for (var i = 0; i < pos.length; i++) {
    s += board.charAt(pos[i]);
  }
  return s;
}

var printSummary = function(win) {
  if (win) {
    console.log('');
    console.log(' __   __ _______ _______      _  _  _ _______      _______ _______ __   _');
    console.log('   \\_/   |______ |______      |  |  | |______      |       |_____| | \\  |');
    console.log('    |    |______ ______|      |__|__| |______      |_____  |     | |  \\_|');
    console.log('');
  } else {
    console.log('');
    console.log('  (   )');
    console.log('  (   ) (');
    console.log('   ) _   )');
    console.log('    ( \\_');
    console.log('  _(_\\ \\)__');
    console.log(' (____\\___))   Shit!!!!!');
    console.log('');
  }
}

/*
 * this function removes duplicates from wordPosition2
 */
var wordPosition = function(word, board) {
  var results = wordPosition2(word, board);
  return results.removeDuplicates();
}

/*
 * this function create words position permutations with some duplicates
 */
var wordPosition2 = function(word, board) {
  if (word.length == 0) return [];

  var results = [];
  var index = word.charCodeAt(0) - 97;
  var charPositions = board[index];
  var wordLeft = word.substring(1);

  for (var j = 0; j < charPositions.length; j++) {
    if (wordLeft.length) {
      var boardCopy = board.slice(0);
      var positionsCopy = charPositions.slice(0);
      // simplify the board and search
      var position = positionsCopy.splice(j, 1);
      boardCopy[index] = positionsCopy;

      var subs = wordPosition2(wordLeft, boardCopy);
      for (var k = 0; k < subs.length; k++) {
        results.push(position.concat(subs[k]));
      }
    } else {
      results.push([charPositions[j]]);
    }
  }

  return results;
}

var weightNearby = function(boardStr, board, i, results) {
  var nearby = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var col = parseInt(i % 5);
  var row = parseInt(i / 5);
  var nearBlue = [];
  var checkNearBlue = (board[i] == 1);
  var checkVowel = false;

  if (~'aeiou'.indexOf(boardStr[i])) { // not an vowel
    results[i] += DEF.WEIGHT_VOWEL;
    checkVowel = true;
  }

  var index;
  for (var i = 0; i < nearby.length; i++) {
    var nCol = col + nearby[i][0];
    if (outOfRange(nCol)) continue;
    var nRow = row + nearby[i][1];
    if (outOfRange(nRow)) continue;

    index = nRow * 5 + nCol;

    if (checkVowel) {
      results[index] += DEF.WEIGHT_NEAR_VOWEL;
    }

    if (checkNearBlue) {
      if (board[index] == -2) {
        checkNearBlue = false;
      } else {
        nearBlue.push(index);
      }
    }
  }

  if (checkNearBlue) {
    var w = DEF.WEIGHT_NEAR_BLUE / nearBlue.length;
    for (var i = 0; i < nearBlue.length; i++) {
      results[nearBlue[i]] += w;
    }
  }
}

var weightBoard = function(boardStr, board) {
  var results = DEF.WEIGHT_BORDER.slice(0);

  for (var i = 0; i < results.length; i++) {
    if (board[i] == 0) {
      results[i] += DEF.WEIGHT_EMPTY;
    }

    if (board[i] == -1) {
      results[i] += DEF.WEIGHT_OPPONENT_RED;
    }

    if (Math.abs(board[i]) == 2) {
      results[i] += DEF.WEIGHT_DEEP_COLOR;
      continue;
    }

    weightNearby(boardStr, board, i, results);
  }

  return results;
}

var normalizeBoard = function(board, index) {
  var nearby = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var col = parseInt(index % 5);
  var row = parseInt(index / 5);

  var deepRed = 0;
  var deepBlue = 0;
  var count = 0;

  for (var j = 0; j < nearby.length; j++) {
    var nCol = col + nearby[j][0];
    if (outOfRange(nCol)) continue;
    var nRow = row + nearby[j][1];
    if (outOfRange(nRow)) continue;

    count++;

    var pos = nRow * 5 + nCol;
    var val = board[pos];
    if (val > 0) deepBlue++;
    if (val < 0) deepRed++;
  }

  if (board[index] < 0) {
    if(deepRed == count) board[index] = -2;
    else board[index] = -1;
  } else if (board[index] > 0) {
    if (deepBlue == count) board[index] = 2;
    else board[index] = 1;
  }

  return board;
}

var applyMove = function(board, move, ourMove) {
  for (var i = 0; i < move.length; i++) {
    if (Math.abs(board[move[i]]) != 2) {
      board[move[i]] = (ourMove ? 1 : -1);
    }
  }

  for (var i = 0; i < board.length; i++) {
    normalizeBoard(board, i);
  }
  return board;
}

var evaluateBoard = function(board) {
  var emptyCount = 0;
  var cellCount = 0;
  var scoreCount = 0;
  for (var i = 0; i < board.length; i++) {
    switch(board[i]) {
      case 0:
        emptyCount++;
        break;
      case 1:
        cellCount++;
        scoreCount += DEF.WEIGHT_BLUE;
        break;
      case 2:
        cellCount++;
        scoreCount += DEF.WEIGHT_DEEP_BLUE;
        break;
      case -1:
        cellCount--;
        scoreCount += DEF.WEIGHT_RED;
        break;
      case -2:
        cellCount--;
        scoreCount += DEF.WEIGHT_DEEP_RED;
        break;
    }
  }
  if (emptyCount == 0) {
    scoreCount = cellCount > 0 ? DEF.PLUS_INFINITE : DEF.MINUS_INFINITE;
  }
  return scoreCount;
}

var Board = function(boardStr, words) {
  this.board = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  this.boardStr = boardStr;
  this.boardPos = boardPosition(boardStr);
  this.boardWeight = weightBoard(boardStr, this.board);
  this.words = this.allWordsPositions(words);
  this.usedWords = [];
}

Board.prototype.posToWord = function(pos) {
  return posToWord(this.boardStr, pos);
}

Board.prototype.weightWord = function(wordPos) {
  var s = 0;
  for (var i = 0; i < wordPos.length; i++) {
    s += this.boardWeight[wordPos[i]];
  }
  return s;
}

Board.prototype.compareMove = function(a1, a2) {
  return a2[0] - a1[0];
}

Board.prototype.allWordsPositions = function(words) {
  var results = [];
  for (var i = 0; i < words.length; i++) {
    var wordPos = wordPosition(words[i], this.boardPos);
    for (var j = 0; j < wordPos.length; j++) {
      // 1 for move positions, 0 for the word
      results.push([words[i], wordPos[j]]);
    }
  }

  return results;
}

Board.prototype.orderedMoves = function() {
  var words = [];
  this.boardWeight = weightBoard(this.boardStr, this.board);
  for (var i = 0; i < this.words.length; i++) {
    var word = this.words[i];
    // 1 for move positions, 0 for the word
    words.push([this.weightWord(word[1]), word[1], word[0]]);
  }
  words.sort(this.compareMove);
  return words;
}

Board.prototype.evaluate = function() {
  return evaluateBoard(this.board);
}

Board.prototype.applyMove = function(move, ourMove) {
  this.usedWords.push(this.posToWord(move));
  this.board = applyMove(this.board, move, ourMove);
}

Board.prototype.isWordUsed = function(word) {
  for (var i = 0; i < this.usedWords.length; i++) {
    if (this.usedWords[i].indexOf(word) == 0) {
      return true;
    }
  }
  return false;
}

Board.prototype.boardWithColor = function() {
  var i, o1 = '', o2 = '', o = '';
  var color = {
    '-2': clc.xterm(0).bgXterm(196),
    '-1': clc.xterm(0).bgXterm(210),
    '0': clc.xterm(0).bgXterm(255),
    '2': clc.xterm(0).bgXterm(27),
    '1': clc.xterm(0).bgXterm(117)
  };
  for (i = 0; i < this.board.length; i++) {
    var f = color[this.board[i]];
    o1 += f('  ' + this.boardStr.charAt(i).toUpperCase() + '  ');
    o2 += f('     ');
    if ((i + 1) % 5 == 0) {
      o += (o2 + '\n' + o1 + '\n' + o2 + '\n');
      o1 = '';
      o2 = '';
    }
  }
  return o;
}

Board.prototype.solve = function() {
  this.bestMoveIndex = -1;
  this.bestMove = undefined;
  // return this.alphaBetaMax(DEF.MINUS_INFINITE, DEF.PLUS_INFINITE, DEF.MAX_DEPTH);

  var moves = this.orderedMoves();

  var results = [];
  for (var i = 0; i < moves.length; i++) {
    if (this.isWordUsed(moves[i][2])) continue;
    var boardCopy = this.board.slice(0);

    this.applyMove(moves[i][1], true);
    var score = this.evaluate();
    results.push([score, moves[i]]);

    // recover
    this.board = boardCopy;
    this.usedWords.pop();

    if (score == DEF.PLUS_INFINITE) {
      this.bestMoveIndex = i;
      this.bestMove = moves[i];
      return DEF.PLUS_INFINITE;
    }
  }

  results.sort(this.compareMove);
  var score = DEF.MINUS_INFINITE;

  var boardCopy = this.board.slice(0);

  // console.log('max=' + max);
  console.log(results[0]);

  var max = DEF.MAX_MOVES_STEP;
  if (max > moves.length) max = moves.length;
  for (var i = 0; i < max; i++) {
    var move = results[i][1];
    this.applyMove(move[1], true);

    var safe = this.isMoveSafe();

    this.board = boardCopy.slice(0);
    this.usedWords.pop();

    if (safe) {
      this.bestMoveIndex = i;
      this.bestMove = move;
      score = results[i][0];

      console.log('best index:' + i + ' ,score: ' + score)

      return score;
    }
    if (((i + 1) % 5) == 0) process.stdout.write('.');
    if (((i + 1) % 50) == 0) console.log(parseInt((max - i) * 100 / max) +  '% left.');
  }

  return score;
}

Board.prototype.isMoveSafe = function() {
  var safe = true;

  var moves = this.orderedMoves();

  // simulate opponent's move, if find any move to end the game,
  // then return false
  // else, return true
  var boardCopy = this.board.slice(0);
  for (var i = 0; i < moves.length; i++) {
    if (this.isWordUsed(moves[i][2])) continue;

    this.applyMove(moves[i][1], false);
    var score = this.evaluate();

    // recover
    this.board = boardCopy.slice(0);
    this.usedWords.pop();

    if (score == DEF.MINUS_INFINITE) {
      return false;
    }
  }

  this.board = boardCopy;
  return true;
}

Board.prototype.alphaBetaMax = function(alpha, beta, depth) {
  if (depth == 0) return this.evaluate();

  var moves = this.orderedMoves();
  var max = moves.length * DEF.MAX_MOVES_PERCENT;
  if (max < DEF.MAX_MOVES_STEP) max = DEF.MAX_MOVES_STEP;

  for (var i = 0; i < moves.length && i < max; i++) {
    if (this.isWordUsed(moves[i][2])) continue;
    var boardStatus = this.board.slice(0);

    this.applyMove(moves[i][1], true);
    var score = this.alphaBetaMin(alpha, beta, depth - 1);

    // recover
    this.board = boardStatus;
    this.usedWords.pop();

    if (score >= beta && score != DEF.PLUS_INFINITE) {
      return beta;
    }
    if (score > alpha) {
      this.bestMoveIndex = i;
      this.bestMove = moves[i];
      alpha = score;
    }
  }

  return alpha;
}

Board.prototype.alphaBetaMin = function(alpha, beta, depth) {
  if (depth == 0) return this.evaluate();

  var moves = this.orderedMoves();
  var max = moves.length * DEF.MAX_MOVES_PERCENT;
  for (var i = 0; i < moves.length && i < max; i++) {
    if (this.isWordUsed(moves[i][2])) return alpha;
    var boardStatus = this.board.slice(0);

    this.applyMove(moves[i][1], false);
    var score = this.alphaBetaMax(alpha, beta, depth - 1);

    // recover
    this.board = boardStatus;
    this.usedWords.pop();

    if (score <= alpha) {
      return alpha;
    }
    if (score < beta) {
      this.bestMove = moves[i];
      beta = score;
    }
  }

  return beta;
}

exports.boardPosition = boardPosition;
exports.wordPosition = wordPosition;
exports.posToWord = posToWord;
exports.printSummary = printSummary;
exports.weightBoard = weightBoard;
exports.applyMove = applyMove;
exports.evaluateBoard = evaluateBoard;

exports.Board = Board;
