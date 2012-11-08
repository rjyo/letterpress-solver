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

var weightNearVowel = function(array, i) {
  var nearby = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var col = parseInt(i % 5);
  var row = parseInt(i / 5);
  for (var i = 0; i < nearby.length; i++) {
    var nCol = col + nearby[i][0];
    if (outOfRange(nCol)) continue;
    var nRow = row + nearby[i][1];
    if (outOfRange(nRow)) continue;

    array[nRow * 5 + nCol] += DEF.WEIGHT_NEAR_VOWEL;
  }
}

var weightVowel = function(board, array) {
  for (var i = 0; i < array.length; i++) {
    if (~'aeiou'.indexOf(board[i])) { // not an vowel
      array[i] += DEF.WEIGHT_VOWEL;
      weightNearVowel(array, i);
    }
  }
}

var weightBoard = function(board) {
  var result = DEF.WEIGHT_BORDER.slice(0);
  weightVowel(board, result);
  return result;
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

var Board = function(boardStr, words, board, usedWords) {
  this.boardStr = boardStr;
  this.boardPos = boardPosition(boardStr);
  this.boardWeight = weightBoard(boardStr);
  this.words = this.allWordsPositions(words);
  this.words.sort(this.orderWords);
  if (!board) {
    this.board = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  } else {
    this.board = board;
  }
  if (usedWords) {
    this.usedWords = usedWords;
  } else {
    this.usedWords = [];
  }
  this.processed = 0;
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

Board.prototype.orderWords = function(a1, a2) {
  return a2[0] - a1[0];
}

Board.prototype.allWordsPositions = function(words) {
  var results = [];
  for (var i = 0; i < words.length; i++) {
    var wordPos = wordPosition(words[i], this.boardPos);
    for (var j = 0; j < wordPos.length; j++) {
      // 0 for ordering, 1 for move positions
      results.push([this.weightWord(wordPos[j], this.boardWeight), wordPos[j]]);
    };
  }

  return results;
}

Board.prototype.evaluate = function() {
  return evaluateBoard(this.board);
}

Board.prototype.applyMove = function(move, ourMove) {
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
  var i, v, o = '';
  var deepRed = clc.xterm(0).bgXterm(196), lightRed = clc.xterm(0).bgXterm(210),
      deepBlue = clc.xterm(0).bgXterm(27), lightBlue = clc.xterm(0).bgXterm(117);
  for (i = 0; i < this.board.length; i++) {
    switch(this.board[i]) {
      case -2:
        v = deepRed(this.boardStr.charAt(i));
        break;
      case -1:
        v = lightRed(this.boardStr.charAt(i));
        break;
      case 2:
        v = deepBlue(this.boardStr.charAt(i));
        break;
      case 1:
        v = lightBlue(this.boardStr.charAt(i));
        break;
      default:
        v = this.boardStr.charAt(i);
    }
    o += v + ' ';
    if ((i + 1) % 5 == 0) {
      o += '\n';
    }
  }
  return o;
}

Board.prototype.alphaBetaMax = function(alpha, beta, depth) {
  if (depth == 0) return this.evaluate();

  for (var i = 0; i < this.words.length && i < DEF.MAX_MOVES_EXPLORE; i++) {
    if (this.isWordUsed(this.words[i][2])) return beta;
    this.usedWords.push(this.words[i][2]);
    var boardStatus = this.board.slice(0);

    this.applyMove(this.words[i][1], true);
    var score = this.alphaBetaMin(alpha, beta, depth - 1);

    // recover
    this.board = boardStatus;
    this.usedWords.pop();

    if (score >= beta) {
      return beta;
    }
    if (score > alpha) {
      this.processed = i;
      this.bestMove = this.words[i];
      alpha = score;
    }
  }

  return alpha;
}

Board.prototype.alphaBetaMin = function(alpha, beta, depth) {
  if (depth == 0) return this.evaluate();

  for (var i = 0; i < this.words.length && i < DEF.MAX_MOVES_EXPLORE; i++) {
    if (this.isWordUsed(this.words[i][2])) return alpha;
    this.usedWords.push(this.words[i][2]);
    var boardStatus = this.board.slice(0);

    this.applyMove(this.words[i][1], false);
    var score = this.alphaBetaMax(alpha, beta, depth - 1);

    // recover
    this.board = boardStatus;
    this.usedWords.pop();

    if (score <= alpha) {
      return alpha;
    }
    if (score < beta) {
      this.bestMove = this.words[i];
      beta = score;
    }
  }

  return beta;
}

exports.boardPosition = boardPosition;
exports.wordPosition = wordPosition;
exports.posToWord = posToWord;
exports.weightBoard = weightBoard;
exports.applyMove = applyMove;
exports.evaluateBoard = evaluateBoard;

exports.Board = Board;
