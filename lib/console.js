var lpb = require('./client')
  , rl = require('readline').createInterface(process.stdin, process.stdout)

var commands = {
    'create board':'Create a game, [board] is a 25-characters game of Letterpress'
  , 'list': 'List all games ready for join'
  , 'join': 'Join a game listed by \'list\' command'
  , 'move': 'Take a move in the current game'
  , 'resign': 'Resign the current game'
  , 'show': 'Show steps and other information for a certain game'
};

function LPBConsole(baseURL, playerId) {
  this.client = new lpb.LPBClient(baseURL, playerId);
}

LPBConsole.prototype = new process.EventEmitter();

LPBConsole.prototype.move = function(step, callback) {
  this.client.move(step).on('complete', callback);
}

LPBConsole.prototype.prompt = function() {
  rl.prompt();
}

LPBConsole.prototype.start = function() {
  console.log('System Ready!');
  rl.setPrompt('% ');
  rl.prompt();

  var self = this;

  rl.on('line', function(line) {
    var op = line.trim().toLowerCase();
    var i = op.indexOf(' ');
    var args = '';

    function isInGame() {
      if (!self.client.gameId) {
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
      self.client.create(args).on('complete', function(data) {
        console.log(data);
        rl.prompt();
      });
    } else if (op === 'list') {
      self.client.list().on('complete', function(data) {
        if (data instanceof Array) {
          self.games = data;
          for (var i = 0; i < data.length; i++) {
            var status = ['CREATED', 'PLAYING', 'PLAYED'];
            console.log(i + ' - ' + data[i][0] + ' - ' +  status[data[i][1]]);
          }
        }
        rl.prompt();
      });
    } else if (op === 'join') {
      var index = parseInt(args);
      if (self.games && index in self.games) {
        self.client.gameId = self.games[index][0];
        self.client.join().on('complete', function(data) {
          self.emit('join', data);
          rl.prompt();
        });
      } else {
        console.log('Unknow game: ' + args)
        rl.prompt();
      }
    } else if (op === 'move') {
      if (isInGame()) {
        self.client.move(args).on('complete', function(data) {
          if (!(data instanceof Array)) {
            console.log(data);
            return rl.prompt();
          }

          // not moved yet
          if (data.length == 0) {
            self.emit('ourmove', data);
          } else if (data[0] !== self.client.playerId) {
            self.emit('theirmove', data[1]);
          } else {
            console.log('It\'s not our turn yet.');
            rl.prompt();
          }

        });
      }
    } else if (op === 'resign') {
      if (isInGame()) {
        self.client.resign().on('complete', function(data) {
          console.log(data);
          rl.prompt();
        });
      }
    } else if (op === 'show') {
      if (isInGame()) {
        self.client.show().on('complete', function(data) {
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
}

exports.LPBConsole = LPBConsole;
