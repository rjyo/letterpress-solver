var _ = require('underscore')
  , redis = require('redis')
  , fs = require('fs')
  , client = redis.createClient();

var wordToKey = function(word) {
  word = word.toLowerCase();
  var key = splitChars(word);
  key = key.sort()
  key = key.join('');
  return key;
}

var twoCharsKeys = function(str) {
  var index = 0;
  var keys = []
  while (index < str.length - 1) {
    var key = str.substring(index, index + 2);
    index++;
    keys.push('lp:' + key);
  }

  return keys;
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

function solve(str, callback) {
  var key = wordToKey(str);
  var keys = twoCharsKeys(key);

  client.sinter(keys, callback);
}

function combinations(keys) {
  var results = [];
  for (var i = 0; i < keys.length; i++) {
    for (var j = i + 1; j < keys.length; j++) {
      results.push([keys[i], keys[j]]);
    }
  }
  return results;
}

function findWordIn(c, callback) {
  client.sinter(c, function(err, results) {
    var words = [];
    _.each(results, function(word) {
      if (word && wordInBoard(word, board)) {
        words.push(word);
      }
    });
    callback(words);
  });
};

var printResults = function(all, wantToUseWords) {
  var line = '';
  _.each(all, function(word) {
    if (!wantToUseWords || wordInBoard(wantToUseWords, word)) {
      line += word + '\n';
    }
  });
  console.log(line);

  var endTime = new Date();
  console.log('Time Spent: ' + (endTime - startTime)/1000 + 's');
  process.exit();
};

var args = process.argv.slice(2);
if (args.length) {

  var startTime = new Date();

  var board = args[0];
  var wantToUseWords = args[1];

  var boardKey = wordToKey(board);
  var keys = twoCharsKeys(boardKey);
  boardKey = 'lp:board:' + boardKey;
  var c = combinations(keys);

  client.smembers(boardKey, function(err, all) {
    if (all.length) {
      console.log('Using cached results');
      console.log('--------------------');
      printResults(all, wantToUseWords);
    } else {
      var finished = 0;

      console.log('Solving board: ' + boardKey);
      console.log('--------------------');
      for (var i = 0; i < c.length; i++) {
        findWordIn(c[i], function(words) {
          _.each(words, function(word) {
            client.sadd(boardKey, word);
          });
          finished++;

          if (finished == c.length) {
            client.smembers(boardKey, function(err, all) {
              printResults(all, wantToUseWords);
            });
          }
        });
      }
    }
  });
}

