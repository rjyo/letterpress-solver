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

    it('one vowel in the middle', function() {
      var board='bbbbb' + 'babbb' + 'bbbbb' + 'bbbbb' + 'bbbbb';
      var expected = [0,DEF.WEIGHT_NEAR_VOWEL,0,0,0,
                      DEF.WEIGHT_NEAR_VOWEL,DEF.WEIGHT_VOWEL,DEF.WEIGHT_NEAR_VOWEL,0,0,
                      0,DEF.WEIGHT_NEAR_VOWEL,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0];
      var weight = ai.weightBoard(board);
      expected = expected.add(DEF.WEIGHT_BORDER);
      weight.should.eql(expected);
    });

    it('one vowel on border', function() {
      var board='bbbbb' + 'abbbb' + 'bbbbb' + 'bbbbb' + 'bbbbb';
      var expected = [DEF.WEIGHT_NEAR_VOWEL,0,0,0,0,
                      DEF.WEIGHT_VOWEL,DEF.WEIGHT_NEAR_VOWEL,0,0,0,
                      DEF.WEIGHT_NEAR_VOWEL,0,0,0,0,
                      0,0,0,0,0,
                      0,0,0,0,0];
      var weight = ai.weightBoard(board);
      expected = expected.add(DEF.WEIGHT_BORDER);
      weight.should.eql(expected);
    });

    it('3 vowels', function() {
      var board='bbbbb' + 'aabbb' + 'bbbbb' + 'bbbbb' + 'bbbbo';
      var expected = [DEF.WEIGHT_NEAR_VOWEL, DEF.WEIGHT_NEAR_VOWEL, 0, 0, 0,
                      DEF.WEIGHT_NEAR_VOWEL + DEF.WEIGHT_VOWEL, DEF.WEIGHT_VOWEL + DEF.WEIGHT_NEAR_VOWEL, DEF.WEIGHT_NEAR_VOWEL, 0, 0,
                      DEF.WEIGHT_NEAR_VOWEL, DEF.WEIGHT_NEAR_VOWEL, 0, 0, 0,
                      0, 0, 0, 0, DEF.WEIGHT_NEAR_VOWEL,
                      0, 0, 0, DEF.WEIGHT_NEAR_VOWEL,DEF.WEIGHT_VOWEL];
      var weight = ai.weightBoard(board);
      expected = expected.add(DEF.WEIGHT_BORDER);
      weight.should.eql(expected);
    });
  });

  describe('#weightWord()', function() {
    it('check ordering', function() {
      var board = 'adcxb' + 'xxxxx' + 'xxxxx' + 'xxxxb' + 'bbbbo';
      var words = ['bob', 'adb'];
      var weight = ai.weightBoard(board);
      var boardPos = ai.boardPosition(board);

      var bestWeight = 0;
      var bestPosition;
      var bestWord;
      for (var i = 0; i < words.length; i++) {
        var wordPos = ai.wordPosition(words[i], boardPos);
        for (var j = 0; j < wordPos.length; j++) {
          var expanedPos = wordPos[j].expand();
          var posWeight = expanedPos.multiply(weight);

          posWeight = posWeight.sum();
          if (posWeight > bestWeight) {
            bestWeight = posWeight;
            bestWord = words[i];
            bestPosition = wordPos[j];
          }
        }
      }

      var expectedBest = DEF.WEIGHT_BORDER[19] + DEF.WEIGHT_BORDER[23] + DEF.WEIGHT_BORDER[24]
                       + DEF.WEIGHT_VOWEL + DEF.WEIGHT_NEAR_VOWEL * 2;
      bestWeight.should.eql(expectedBest);
    });
  });
});

