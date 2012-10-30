var _ = require('underscore')
  , fs = require('fs')

var wordList = [];

var importContent = function(content) {
  var index = content.indexOf('\n');
  var last = 0;
  while (index > -1) {
    var line = content.substring(last, index);
    strIndex = indexOfString(line);
    wordList.push([line, strIndex]);
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
  for (var i = 0; i < str.length; i++) array.push(str.charAt(i));
  return array;
};

var indexOfString = function(word) {
  var result = 0;
  for (var i = 0; i < word.length; i++) {
    var bit = word.charCodeAt(i) - 97;
    result = result | (1 << bit);
  }
  return result;
};

var isWordInString = function(word, wordVal, str, strVal) {
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

var solveBoard = function(board) {
  var boardVal = indexOfString(board); var results = [];
  for (var i = 0; i < wordList.length; i++) {
    if (isWordInString(wordList[i][0], wordList[i][1], board, boardVal)) {
      results.push(wordList[i]);
    }
  };

  return results;
};

var printResults = function(r) {
  var formattedResult = '';
  for (var i = 0; i < r.length; i++) {
    formattedResult += (r[i][0] + '                    ').substring(0, 20);
    if ((i + 1) % 5 == 0) formattedResult += '\n';
  }
  console.log(formattedResult);
};

importDir('./words');
console.log('System Ready!');

var readline = require('readline')
  , rl = readline.createInterface(process.stdin, process.stdout)
  , results = [];

rl.setPrompt('lp% ');
rl.prompt();

rl.on('line', function(line) {
  line = line.trim();
  if (line.substr(0, 1) === '/') {
    line = line.substring(1);
    var filtered = [];
    for (var i = 0; i < results.length; i++) {
      if (isWordInString(line, indexOfString(line), results[i][0], results[i][1])) {
        filtered.push(results[i]);
      }
    };

    printResults(filtered);
    console.log('--------------------');
    console.log('Filtered ' + filtered.length + ' results');
  } else if (line.length) {
    var startTime = new Date();

    results = solveBoard(line);
    results = results.sort(function(a, b) {
      return b[0].length - a[0].length;
    });

    var endTime = new Date();
    var time = (endTime - startTime)/1000;

    printResults(results);
    console.log('--------------------');
    console.log('Found ' + results.length + ' results, time spent: ' + time + 's');
  }
  rl.prompt();
}).on('close', function() {
  process.exit(0);
});
