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
      var  word = [0,1,2];

      var result = ai.applyMove(board, word, true);
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
      var  word = [0,1,2,5];

      var result = ai.applyMove(board, word, true);
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
      var  word = [0,1,2,6];

      var result = ai.applyMove(board, word, false);
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

    it('check print', function() {
      var board = "bedrmnkcyaejdrxyxuntcalkr";
      var words = ["xray"];
      var board = new ai.Board(board, words);
      board.boardWithColor().should.be.ok;
    })

    it('check order', function() {
      var board = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adc', 'bob'];
      var board = new ai.Board(board, words);
      board.posToWord(board.words[0][1]).should.eql('bob');
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

return;

  describe('#alphaBeta()', function() {
    it('check init', function() {
      var boardStr = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adb', 'bob'];
      var board = new ai.Board(boardStr, words);

      var val = board.alphaBetaMax(DEF.MINUS_INFINITE, DEF.PLUS_INFINITE, 1);
      board.bestMove[2].should.eql('bob');
    })

    it('check ending', function() {
      var boardStr = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adb', 'bob'];
      var board = new ai.Board(boardStr, words);
      board.board = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0];

      var val = board.alphaBetaMax(DEF.MINUS_INFINITE, DEF.PLUS_INFINITE, 1);
      board.bestMove[2].should.eql('bob');
      val.should.eql(DEF.PLUS_INFINITE);
    })

    it('check ending', function() {
      var boardStr = 'adcxx' + 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxbbo';
      var words = ['adc', 'bob'];
      var board = new ai.Board(boardStr, words);
      board.board = [-1,-1,-1,-1,-1,
                     -1,-1,-1,-1,-1,
                     -1,-1,-1,-1,1,
                     1,1,1,1,1,
                     1,1,0,0,0];

      var val;

      val = board.alphaBetaMax(DEF.MINUS_INFINITE, DEF.PLUS_INFINITE, 1);
      board.bestMove[2].should.eql('adc');

      val = board.alphaBetaMax(DEF.MINUS_INFINITE, DEF.PLUS_INFINITE, 2);
      val.should.eql(DEF.MINUS_INFINITE);

    })
  });
});
