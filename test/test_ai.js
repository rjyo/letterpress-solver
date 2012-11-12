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
      board.posToWord(board.words[0][1]).should.eql('adc');

      var moves = board.orderedMoves();
      board.posToWord(moves[0][1]).should.eql('bob');
    })

    it('check word weight', function() {
      var board = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['adb', 'bob'];
      var board = new ai.Board(board, words);

      var moves = board.orderedMoves();
      var expectedBest = DEF.WEIGHT_BORDER[19] + DEF.WEIGHT_BORDER[23] + DEF.WEIGHT_BORDER[24]
                       + DEF.WEIGHT_VOWEL + DEF.WEIGHT_NEAR_VOWEL * 2 + DEF.WEIGHT_EMPTY * 3;
      moves[0][0].should.eql(expectedBest);
    })
  });

  describe('#applyMove()', function() {
    it('apply', function() {
      var boardStr = 'xxiroarpiiuggozpdchzrazgj';
      var words = ['radiographic'];
      var move = [ 3, 5, 16, 8, 4, 11, 20, 21, 15, 18, 9, 17 ];

      var board = new ai.Board(boardStr, words);
      board.applyMove(move, true);

      board.usedWords.length.should.eql(1);
      board.usedWords[0].should.eql(words[0]);
    })
  });

  describe('#solve()', function() {
    it('bestMove', function() {
      var boardStr = 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxbbo';
      var words = ['xob', 'bob'];
      var board = new ai.Board(boardStr, words);
      board.board = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0];

      var val = board.solve();
      // xob has highter score but bob will win
      board.bestMove[2].should.eql('bob');
      val.should.eql(DEF.PLUS_INFINITE);
    })

    it('!isMoveSafe', function() {
      var boardStr = 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxxxx' + 'abcde';
      var words = ['abc', 'de'];
      var board = new ai.Board(boardStr, words);
      board.board = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var copy = board.board.slice(0);

      var val = board.isMoveSafe();
      val.should.eql(true);
      copy.should.eql(board.board);
    })

    it('isMoveSafe', function() {
      var boardStr = 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxxxx' + 'abcde';
      var words = ['abcde'];
      var board = new ai.Board(boardStr, words);
      board.board = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0];
      var copy = board.board.slice(0);

      var val = board.isMoveSafe();
      val.should.eql(false);
      copy.should.eql(board.board);
    })

    it('win', function() {
      var boardStr = 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxxxx' + 'abcde';
      var words = ['abc', 'de'];
      var board = new ai.Board(boardStr, words);
      board.board = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1];

      var val = board.solve();
      val.should.eql(DEF.PLUS_INFINITE);
    })

    it('lose', function() {
      var boardStr = 'xxxxx' + 'xxxxx' + 'xxxxx' + 'xxxxx' + 'abcde';
      var words = ['abc', 'de'];
      var board = new ai.Board(boardStr, words);
      board.board = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0];

      var val = board.solve();
      val.should.eql(DEF.MINUS_INFINITE);
    })

    it('check better choice', function() {
      var boardStr = 'adcex' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'xxxbo';
      var words = ['adce', 'bob'];
      var board = new ai.Board(boardStr, words);

      var val = board.solve();
      board.bestMove[2].should.eql('bob');
    })

    it('read world', function() {
      var boardStr = 'bxuwhckkvkzjphnozatpunexs';
      var words = ['ajukenboxs', 'jukebox'];
      var board = new ai.Board(boardStr, words);
      board.board = [-1,0,-1,1,1,1,0,-1,-1,-1,2,1,1,-1,-2,1,-1,-1,-2,-2,-1,-2,-2,-2,-2];

      // console.log('')
      // console.log(board.boardWithColor());
      // console.log('')

      var val = board.solve();
      val.should.eql(DEF.MINUS_INFINITE);
    })

  });

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

    it('check ending 2', function() {
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
