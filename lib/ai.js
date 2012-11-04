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

var boardPosition = function(board) {
  var results = new Array(25);

  for (var i = 0; i < board.length; i++) {
    var index = board.charCodeAt(i) - 97;
    if (results[index] === undefined) {
      results[index] = i;
    } else if (typeof results[index] !== 'object') {
      var value = results[index];
      results[index] = [value, i]
    } else {
      results[index].push(i);
    }
  }

  return results;
}

var wordPosition = function(word, board) {
  var results = [];
  var position = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  for (var i = 0; i < word.length; i++) {
    var index = word.charCodeAt(i) - 97;
    var charPositions = board[index];
    if (typeof charPositions !== 'number') {
      for (var j = 0; j < charPositions.length; j++) {
        var boardCopy = board.slice(0);
        boardCopy[index] = charPositions[j]; // simplify the board and search
        results = results.concat(wordPosition(word, boardCopy));
      }
      return results;
    } else {
      position[charPositions] = 1;
    }
  }

  return [position];
}

var boardWeight = function(board) {

}

exports.arrayAdd = arrayAdd;
exports.arrayMul = arrayMul;
exports.boardPosition = boardPosition;
exports.wordPosition = wordPosition;
exports.boardWeight = boardWeight;
