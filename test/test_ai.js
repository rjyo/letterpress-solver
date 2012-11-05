var should = require("should")
  , ai = require("../lib/ai")
  , DEF = require('../lib/define')

describe('Board Operations', function() {
  describe('#applyMove()', function() {
    it('remove deep red', function() {
      var board = [-2,-1,0,0,0,
                   -1,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0];
      var  word = [1,1,1,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0];

      var result = ai.applyMove(board, word);
      var expected = [-1,1,1,0,0,
                      -1,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0];
      result.should.eql(expected);
    });

    it('make deep blue', function() {
      var board = [0,-1,0,0,0,
                   -1,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,1];
      var  word = [1,1,1,0,0,
                   1,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0];

      var result = ai.applyMove(board, word);
      var expected = [2,1,1,0,0,
                      1,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,1];
      result.should.eql(expected);
    });

    it('they play', function() {
      var board = [-2,-1,0,0,0,
                   -1,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,1];
      var  word = [-1,-1,-1,0,0,
                   0,-1,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0];

      var result = ai.applyMove(board, word);
      var expected = [-2,-2,-1,0,0,
                      -1,-1,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,1];
      result.should.eql(expected);
    });
  });

  describe('#evaluateBoard()', function() {
    it('red', function() {
      var board = [-2,-1,0,0,0,
                   -1,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,0,
                   0,0,0,0,1];
      var score = ai.evaluateBoard(board);
      score.should.eql(-3);
    })

    it('ending', function() {
      var board = [-2,-2,-1,1,2,
                   -2,-2,-1,1,1,
                   -2,-2,1,1,1,
                   -2,-2,1,1,1,
                   -2,-2,1,1,1];
      var score = ai.evaluateBoard(board);
      score.should.eql(DEF.PLUS_INFINITE);
    })
  });
});
