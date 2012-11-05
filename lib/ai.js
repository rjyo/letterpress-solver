var DEF = require('./define');

var arrayAdd = function(a1, a2) {
  var l1 = a1.length;
  var l2 = a2.length;
  var len = (l1 < l2 ? l1 : l2);
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    result[i] = a1[i] + a2[i];
  }
  return result;
}

var arraySub = function(a1, a2) {
  var l1 = a1.length;
  var l2 = a2.length;
  var len = (l1 < l2 ? l1 : l2);
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    result[i] = a1[i] - a2[i];
  }
  return result;
}

var arrayMul = function(a1, a2) {
  var l1 = a1.length;
  var l2 = a2.length;
  var len = (l1 < l2 ? l1 : l2);
  var result = new Array(len);

  for (var i = 0; i < len; i++) {
    result[i] = a1[i] * a2[i];
  }
  return result;
}

var arraySum = function(a1) {
  var result = 0;
  for (var i = 0; i < a1.length; i++) {
    result += a1[i];
  }
  return result;
}

var arrayExpand = function(a1) {
  var result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for (var i = 0; i < a1.length; i++) result[a1[i]] = 1;
  return result;
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

var wordPosition = function(word, board) {
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

      var subs = wordPosition(wordLeft, boardCopy);
      for (var k = 0; k < subs.length; k++) {
        results.push(position.concat(subs[k]));
      }
    } else {
      results.push([charPositions[j]]);
    }
  }

  return results;
}

var outOfRange = function(i) {
  return i < 0 || i > 4;
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
    if (word[i] == 1 && board[i] != -2) {
      board[i] = 1;
    }
  }
  for (var i = 0; i < board.length; i++) {
    normalizeBoard(board, i);
  }
  return board;
}

exports.arrayAdd = arrayAdd;
exports.arraySub = arraySub;
exports.arrayMul = arrayMul;
exports.arraySum = arraySum;
exports.arrayExpand = arrayExpand;
exports.boardPosition = boardPosition;
exports.wordPosition = wordPosition;
exports.weightBoard = weightBoard;
exports.applyMove = applyMove;
