var _ = require('underscore')
  , fs = require('fs')

var wordList = [];

var importContent = function(content) {
  var index = content.indexOf('\n');
  var last = 0;
  while (index > -1) {
    var line = content.substring(last, index);
    wordVal = valueForWord(line);
    wordList.push([line, wordVal]);
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
};

var splitChars = function(str) {
  var array = [];
  for (var i = 0; i < str.length; i++) {
    array.push(str.charAt(i));
  }
  return array;
};

var valueForWord = function(word) {
  var result = 0;
  for (var i = 0; i < word.length; i++) {
    var bit = word.charCodeAt(i) - 97;
    result = result | (1 << bit);
  }
  return result;
};

var wordInStr = function(word, wordVal, str, strVal) {
  if (!word) return false;

  // var wordVal = valueForWord(word);
  if ((wordVal & strVal) != wordVal) return false;

  // detailed check
  var strChars = splitChars(str);
  var wordChars = splitChars(word);

  var found = false;
  for (var i = 0; i < wordChars.length; i++) {
    found = false;
    for (var j = 0; j < strChars.length; j++) {
      if (strChars[j] == wordChars[i]) {
        found = true;
        strChars[j] = '';
        break;
      }
    }
    if (!found) {
      return false;
    }
  }

  return true;
}

importDir('./words');
console.log('System Ready!');

var solveBoard = function(board) {
  var boardVal = valueForWord(board); var results = [];
  for (var i = 0; i < wordList.length; i++) {
    if (wordInStr(wordList[i][0], wordList[i][1], board, boardVal)) {
      results.push(wordList[i]);
    }
  };

  return results;
};

var printResults = function(r, limit) {
  for (var i = 0; i < r.length && i < limit; i++) {
    console.log(r[i][0]);
  }
};

var readline = require('readline')
  , rl = readline.createInterface(process.stdin, process.stdout);

var results = [];

rl.setPrompt('lp% ');
rl.prompt();

rl.on('line', function(line) {
  line = line.trim();
  if (line.substr(0, 1) === '/') {
    line = line.substring(1);
    var filtered = [];
    for (var i = 0; i < results.length; i++) {
      if (wordInStr(line, valueForWord(line), results[i][0], results[i][1])) {
        filtered.push(results[i]);
      }
    };

    console.log('Filtering first 30 words, ' + filtered.length + ' results');
    console.log('--------------------');
    printResults(filtered, 30);
  } else {
    var startTime = new Date();

    results = solveBoard(line);
    results = results.sort(function(a, b) {
      return b[0].length - a[0].length;
    });

    var endTime = new Date();
    var time = (endTime - startTime)/1000;

    console.log('Found ' + results.length + ' results, time spent: ' + time + 's');
    console.log('--------------------');
    printResults(results, 30);
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
