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

var WEIGHT_VOWEL = 5;
var WEIGHT_NEAR_VOWEL = 5;
var WEIGHT_BORDER = [3,2,1,2,3,
                     2,2,0,2,2,
                     1,0,0,0,1,
                     2,2,0,2,2,
                     3,2,1,2,3];

var inBoard = function(i) {
  return i >= 0 && i < 5;
}

var weightBorder = function(array, i) {
  var nearby = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var col = parseInt(i % 5);
  var row = parseInt(i / 5);
  for (var i = 0; i < nearby.length; i++) {
    var nCol = col + nearby[i][0];
    if (!inBoard(nCol)) continue;
    var nRow = row + nearby[i][1];
    if (!inBoard(nRow)) continue;

    array[nRow * 5 + nCol] += WEIGHT_NEAR_VOWEL;
  }
}

var weightVowel = function(board, array) {
  for (var i = 0; i < array.length; i++) {
    if (~'aeiou'.indexOf(board[i])) { // not an vowel
      array[i] += WEIGHT_VOWEL;
      weightBorder(array, i);
    }
  }
}

var weightBoard = function(board) {
  var result = WEIGHT_BORDER.slice(0);
  weightVowel(board, result);
  return result;
}

exports.arrayAdd = arrayAdd;
exports.arrayMul = arrayMul;
exports.arraySum = arraySum;
exports.arrayExpand = arrayExpand;
exports.boardPosition = boardPosition;
exports.wordPosition = wordPosition;
exports.weightBoard = weightBoard;
