var _ = require('underscore')
  , fs = require('fs')

var wordList = [];

var importContent = function(content) {
  var index = content.indexOf('\n');
  var last = 0;
  while (index > -1) {
    var line = content.substring(last, index);
    wordList.push(line);
    last = index + 1;
    index = content.indexOf('\n', last);
  }
}

var importDir = function(dirName) {
  var files = fs.readdirSync(dirName);
  _.each(files, function(file) {
    var content = fs.readFileSync(dirName + '/' + file, 'utf-8');
    importContent(content);
  });
}

var splitChars = function(str) {
  var array = [];
  for (var i = 0; i < str.length; i++) {
    array.push(str.charAt(i));
  }
  return array;
}

var wordInBoard = function(word, board) {
  if (!word) return false;

  var boardChars = splitChars(board);
  var wordChars = splitChars(word);

  var found = false;
  for (var i = 0; i < wordChars.length; i++) {
    found = false;
    for (var j = 0; j < boardChars.length; j++) {
      if (boardChars[j] == wordChars[i]) {
        found = true;
        boardChars[j] = '';
        break;
      }
    }
    if (!found) {
      return false;
    }
  }

  return true;
}

var args = process.argv.slice(2);
if (args.length) {

  var startTime = new Date();
  var board = args[0];
  var wantToUseWords = args[1];

  importDir('./words');

  var startTime = new Date();
  var results = [];
  for (var i = 0; i < wordList.length; i++) {
    if (wordInBoard(wordList[i], board)) {
      if (!wantToUseWords || wordInBoard(wantToUseWords, wordList[i])) {
        results.push(wordList[i]);
      }
    }
  };
  var endTime = new Date();
  var time = (endTime - startTime)/1000;

  console.log('Solving board: ' + board);
  console.log('--------------------');
  _.each(results, function(result) {
    console.log(result);
  });
  console.log('--------------------');
  console.log('Time Spent: ' + time + 's');
}
