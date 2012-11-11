var rest = require('restler');

// create a service constructor for very easy API wrappers a la HTTParty...
var LPBClient = function(baseURL, playerId) {
  this.playerId = playerId;
  this.baseURL = baseURL;
};

LPBClient.prototype.create = function(board) {
  return rest.get(this.baseURL + '/api/create/' + board);
};

LPBClient.prototype.list = function() {
  return rest.get(this.baseURL + '/api/list');
};

LPBClient.prototype.join = function() {
  return rest.get(this.baseURL + '/api/join', {
    headers: {
      'x-lpb-game_id': this.gameId,
      'x-lpb-player_id': this.playerId
    }
  });
};

LPBClient.prototype.move = function(step) {
  var url = this.baseURL + '/api/move';
  if (step) {
    url = url + '/' + step;
  }
  return rest.get(url, {
    headers: {
      'x-lpb-game_id': this.gameId,
      'x-lpb-player_id': this.playerId
    }
  });
};

LPBClient.prototype.resign = function() {
  return rest.get(this.baseURL + '/api/resign', {
    headers: {
      'x-lpb-game_id': this.gameId,
      'x-lpb-player_id': this.playerId
    }
  });
};

LPBClient.prototype.show = function() {
  return rest.get(this.baseURL + '/api/show', {
    headers: {
      'x-lpb-game_id': this.gameId,
      'x-lpb-player_id': this.playerId
    }
  });
};

exports.LPBClient = LPBClient;
