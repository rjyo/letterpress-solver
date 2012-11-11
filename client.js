var lpb = require('./lib/lpb')
  , readline = require('readline')

var commands = {
    'create board':'Create a game, [board] is a 25-characters game of Letterpress'
  , 'list': 'List all games ready for join'
  , 'join': 'Join a game listed by \'list\' command'
  , 'move': 'Take a move in the current game'
  , 'resign': 'Resign the current game'
  , 'show': 'Show steps and other information for a certain game'
};

var client = new lpb.LPBClient('http://localhost:3000', 'PLAYER_1')
  , rl = readline.createInterface(process.stdin, process.stdout)

console.log('System Ready!');
rl.setPrompt('% ');
rl.prompt();

var games;

rl.on('line', function(line) {
  var op = line.trim().toLowerCase();
  var i = op.indexOf(' ');
  var args = '';

  function isInGame() {
    if (!client.gameId) {
      console.log('Join a game first')
      rl.prompt();
      return false;
    } else {
      return true;
    }
  }

  if (i != -1) {
    args = op.substring(i + 1);
    op = op.substr(0, i);
  }

  if (op === 'create') {
    client.create(args).on('complete', function(data) {
      console.log(data);
      rl.prompt();
    });
  } else if (op === 'list') {
    client.list().on('complete', function(data) {
      if (data instanceof Array) {
        games = data;
        for (var i in data) {
          console.log(i + ' - Game ID: ' + data[i]);
        }
      }
      rl.prompt();
    });
  } else if (op === 'join') {
    var index = parseInt(args);
    if (games && index in games) {
      client.gameId = games[index];
      client.join().on('complete', function(data) {
        console.log(data);
        rl.prompt();
      });
    } else {
      console.log('Unknow game: ' + args)
      rl.prompt();
    }
  } else if (op === 'move') {
    if (isInGame()) {
      client.move(args).on('complete', function(data) {
        console.log(data);
        rl.prompt();
      });
    }
  } else if (op === 'resign') {
    if (isInGame()) {
      client.resign().on('complete', function(data) {
        console.log(data);
        rl.prompt();
      });
    }
  } else if (op === 'show') {
    if (isInGame()) {
      client.show().on('complete', function(data) {
        console.log(data);
        rl.prompt();
      });
    }
  } else if (op === '?' || op === 'help') {
    for (var cmd in commands) {
      console.log((cmd + '          ').substring(0, 12) + ' -- ' + commands[cmd]);
    }
    rl.prompt();
  } else {
    rl.prompt();
  }
}).on('close', function() {
  process.exit(0);
});
