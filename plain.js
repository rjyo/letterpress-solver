var _ = require('underscore')
  , fs = require('fs')
  , lp = require('./lib')
  , readline = require('readline')
  , rl = readline.createInterface(process.stdin, process.stdout)

var wordList = lp.importDir('./words')
  , results = []

console.log('System Ready!');
rl.setPrompt('% ');
rl.prompt();

rl.on('line', function(line) {
  line = line.trim();
  if (line.substr(0, 1) === '/') {
    line = line.substring(1);
    var filtered = lp.filterResults(line, results);
    lp.printResults(filtered);

    console.log('--------------------');
    console.log('Filtered ' + filtered.length + ' results');
  } else if (line.length == 25) {
    var startTime = new Date();

    results = lp.solveBoard(line, wordList);
    results = results.sort(function(a, b) {
      return b[0].length - a[0].length;
    });

    var endTime = new Date();
    var time = (endTime - startTime) / 1000;

    lp.printResults(results);

    console.log('--------------------');
    console.log('Found ' + results.length + ' results, time spent: ' + time + 's');
  } else {
    console.log('Unknown input. Enter a 25-characters-long board, or use \'/\' to filter the results.');
  }
  rl.prompt();
}).on('close', function() {
  process.exit(0);
});
