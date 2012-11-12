var should = require("should")
  , ai = require("../lib/ai")
  , DEF = require('../lib/define')

describe('Basic Logic Operations', function() {
  describe('#boardPosition()', function() {
    it('should eql', function() {
      var board = "aaaac"
      var result = ai.boardPosition(board);

      var boardPos = new Array(25);
      boardPos[0] = [0,1,2,3];
      boardPos[2] = [4];

      result.should.eql(boardPos);
    });
  });

  describe('#wordPosition()', function() {
    it('should eql', function() {
      var board = "abcdef"
      var word = ai.posToWord(board, [0,3]);
      word.should.eql('ad');
    });
  });

  describe('#wordPosition()', function() {
    it('check result', function() {
      var board = "aac"
      var result = ai.boardPosition(board);
      var wordPos = ai.wordPosition("ac", result);

      var expectedResult = [];
      expectedResult.push([0,2]);
      expectedResult.push([1,2]);

      wordPos.should.eql(expectedResult);
    });

    it('check results length', function() {
      var board = "abacddkc";
      var word = "ab";
      var boardPos;
      var wordPos;

      boardPos = ai.boardPosition(board);
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(2);

      word = "aa";
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(1);

      word = "abc";
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(4);

      word = "acdk";
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(8);
    });

    it('real world example', function() {
      var board = "bedrmnkcyaejdrxyxuntcalkr";
      var word = "xray" // c(2,1) x c(3,1) x c(2,1) x c(2,1);
      var boardPos;
      var wordPos;

      boardPos = ai.boardPosition(board);
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(24);

      word = "xrayy"; // c(2,1) x c(3,2) x c(2,1) x c(2,2)
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(12);

      word = "xxrayy"; // c(2,2) x c(3,1) x c(2,1) x c(2,2)
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(6);

      word = "xxrrayy"; // c(2,2) x c(3,2) x c(2,1) x c(2,2)
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(6);

      word = "xxrraayy" // c(2,2) x c(3,2) x c(2,2) x c(2,2);
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(3);

      word = "xxrrraayy" // c(2,2) x c(3,3) x c(2,1) x c(2,2);
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(1);
    });
  });

  describe('#weightBoard()', function() {
    var empty = [];
    for (var i = 0; i < 25; i++) {
      empty[i] = DEF.WEIGHT_EMPTY;
    }

    it('one vowel in the middle', function() {
      var board='bbbbb' + 'babbb' + 'bbbbb' + 'bbbbb' + 'bbbbb';
      var expected = [0,DEF.WEIGHT_NEAR_VOWEL,0,0,0,
                      DEF.WEIGHT_NEAR_VOWEL,DEF.WEIGHT_VOWEL,DEF.WEIGHT_NEAR_VOWEL,0,0,
                      0,DEF.WEIGHT_NEAR_VOWEL,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0];
      var status = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var weight = ai.weightBoard(board, status);
      expected = expected.add(DEF.WEIGHT_BORDER);
      expected = expected.add(empty);
      weight.should.eql(expected);
    });

    it('one vowel on border', function() {
      var board='bbbbb' + 'abbbb' + 'bbbbb' + 'bbbbb' + 'bbbbb';
      var expected = [DEF.WEIGHT_NEAR_VOWEL,0,0,0,0,
                      DEF.WEIGHT_VOWEL,DEF.WEIGHT_NEAR_VOWEL,0,0,0,
                      DEF.WEIGHT_NEAR_VOWEL,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0];
      var status = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var weight = ai.weightBoard(board, status);
      expected = expected.add(DEF.WEIGHT_BORDER);
      expected = expected.add(empty);
      weight.should.eql(expected);
    });

    it('3 vowels', function() {
      var board='bbbbb' + 'bbbbb' + 'bbbbb' + 'bbbbb' + 'bbbbb';
      var status = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var expected = [0, DEF.WEIGHT_NEAR_BLUE / 2, 0, 0, 0,
                      DEF.WEIGHT_NEAR_BLUE / 2, 0, 0, 0, 0,
                      0, 0, 0, 0, 0,
                      0, 0, 0, 0, 0,
                      0, 0, 0, 0, 0];
      var weight = ai.weightBoard(board, status);
      expected = expected.add(DEF.WEIGHT_BORDER);
      empty[0] = 0; // because status[0] == 1
      expected = expected.add(empty);
      weight.should.eql(expected);
    });
  });
});

