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
      score.should.eql(DEF.WEIGHT_RED * 2 + DEF.WEIGHT_DEEP_RED + DEF.WEIGHT_BLUE);
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

describe('Board Object', function() {
  describe('#init()', function() {
    it('check init', function() {
      var board = "bedrmnkcyaejdrxyxuntcalkr";
      var words = ["xray"];
      var board = new ai.Board(board, words);
      board.words.length.should.eql(24);
    })

    it('check order', function() {
      var board = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adc', 'bob'];
      var board = new ai.Board(board, words);
      board.words[0][2].should.eql('bob');
    })

    it('check word weight', function() {
      var board = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adb', 'bob'];
      var board = new ai.Board(board, words);

      var expectedBest = DEF.WEIGHT_BORDER[19] + DEF.WEIGHT_BORDER[23] + DEF.WEIGHT_BORDER[24]
                       + DEF.WEIGHT_VOWEL + DEF.WEIGHT_NEAR_VOWEL * 2;
      board.words[0][0].should.eql(expectedBest);
    })
  });

  describe('#alphaBeta()', function() {
    it('check init', function() {
      var boardStr = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adb', 'bob'];
      var board = new ai.Board(boardStr, words);

      var val = board.alphaBetaMax(DEF.MINUS_INFINITE, DEF.PLUS_INFINITE, 2);
      board.bestMove[2].should.eql('bob');
    })
  });
});
