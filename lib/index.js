var _ = require('underscore')
  , fs = require('fs')

var importContent = function(content, callback) {
  var index = content.indexOf('\n');
  var last = 0;
  while (index > -1) {
    var line = content.substring(last, index);
    callback(line);
    last = index + 1;
    index = content.indexOf('\n', last);
  }
}

var importDir = function(dirName) {
  var files = fs.readdirSync(dirName);
  var wordList = [];
  _.each(files, function(file) {
    var content = fs.readFileSync(dirName + '/' + file, 'utf-8');
    importContent(content, function(word) {
      strIndex = indexOfString(word);
      wordList.push([word, strIndex]);
    })
  })
  return wordList;
};

var indexOfString = function(word) {
  var result = 0;

  var detailBits = [];
  for (var i = 0; i < 26; i++) detailBits[i] = 0;

  for (var i = 0; i < word.length; i++) {
    var bit = word.charCodeAt(i) - 97;

    detailBits[bit]++;
    result = result | (1 << bit);
  }
  return [result, detailBits];
};

var isWordInString = function(word, wordVal, str, strVal) {
  if ((wordVal[0] & strVal[0]) != wordVal[0]) return false;

  // detailed check
  for (var i = 0; i < word.length; i++) {
    var bit = word.charCodeAt(i) - 97;
    if (strVal[1][bit] < wordVal[1][bit]) return false;
  }

  return true;
}

var solveBoard = function(board, words) {
  var boardVal = indexOfString(board);
  var results = [];
  for (var i = 0; i < words.length; i++) {
    if (isWordInString(words[i][0], words[i][1], board, boardVal)) {
      results.push(words[i]);
    }
  }

  return results;
}

var removeSubsets = function(results) {
  var filtered = [];
  for (var i = results.length - 1; i >= 0; i--) {
    var found = false;
    for (var j = 0; j < i; j++) {
      // same words but different ordered words should be kept
      if (results[i][0].length == results[j][0].length) continue;
      if (isWordInString(results[i][0], results[i][1], results[j][0], results[j][1])) {
        found = true;
        break;
      }
    }
    if (!found) {
      filtered.push(results[i]);
    }
  }
  return filtered;
}

var filterResults = function(input, results) {
  var filtered = [];
  for (var i = 0; i < results.length; i++) {
    if (isWordInString(input, indexOfString(input), results[i][0], results[i][1])) {
      filtered.push(results[i]);
    }
  }
  return filtered;
}

var printResults = function(results) {
  if (results.length > 1000) {
    return console.log("More than 1000 results. Try filtering with '/'");
  }

  var formattedResult = '';
  for (var i = 0; i < results.length; i++) {
    formattedResult += (results[i][0] + '                    ').substring(0, 20);
    if ((i + 1) % 5 == 0 && (i + 1) != results.length) formattedResult += '\n';
  }
  console.log(formattedResult);
}

exports.printResults = printResults;
exports.filterResults = filterResults;
exports.removeSubsets = removeSubsets;
exports.solveBoard = solveBoard;
exports.importDir = importDir;
