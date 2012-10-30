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

var solveBoard = function(board) {
  var boardVal = indexOfString(board);
  var r = [];
  for (var i = 0; i < wordList.length; i++) {
    if (isWordInString(wordList[i][0], wordList[i][1], board, boardVal)) {
      r.push(wordList[i]);
    }
  };

  return r;
};

var printResults = function(r) {
  if (r.length > 1000) {
    return console.log("More than 1000 results. Try filtering with '/'");
  }

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
  } else if (line.substring(0, 1) === 't') {
    line = line.substring(2);
    var inputs = line.split(' ');
    if (inputs.length == 1) {
      var i = indexOfString(inputs[0]);
      console.log('index: ' + i[0] + ', bits:' + i[1]);
    } else {
      var i = new Array(inputs.length);
      i[0] = indexOfString(inputs[0]);
      i[1] = indexOfString(inputs[1]);
      console.log('index: ' + i[0][0] + ', bits:' + i[0][1]);
      console.log('index: ' + i[1][0] + ', bits:' + i[1][1]);
      var test = isWordInString(inputs[0], i[0], inputs[1], i[1]);
      console.log('result: ' + test);
    }
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
