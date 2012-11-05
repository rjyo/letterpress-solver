var DEF = require('./define')
  , array = require('./array');

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

var applyMove = function(board, word) {
  board = board.slice(0);
  for (var i = 0; i < board.length; i++) {
    if (Math.abs(word[i]) == 1 && Math.abs(board[i]) != 2) {
      board[i] = word[i];
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
      case 2:
        cellCount++;
        break;
      case -1:
      case -2:
        cellCount--;
        break;
    }
    scoreCount += board[i];
  }
  if (emptyCount == 0) {
    scoreCount = cellCount > 0 ? DEF.PLUS_INFINITE : DEF.MINUS_INFINITE;
  }
  return scoreCount;
}

exports.boardPosition = boardPosition;
exports.wordPosition = wordPosition;
exports.weightBoard = weightBoard;
exports.applyMove = applyMove;
exports.evaluateBoard = evaluateBoard;
