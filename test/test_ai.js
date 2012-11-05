var should = require("should")
  , ai = require("../lib/ai")
  , DEF = require('../lib/define')

describe('Array Operations', function() {
  describe('#arrayAdd()', function() {
    it('should eql', function() {
      var a1 = [1,2,3];
      var a2 = [0,1,-1];

      var a3 = ai.arrayAdd(a1, a2);
      a3.should.eql([1,3,2]);

      a1 = [1,2,3];
      a2 = [0,1,-1,4];

      var a3 = ai.arrayAdd(a1, a2);
      a3.should.eql([1,3,2]);
    });
  });

  describe('#arraySub()', function() {
    it('should eql', function() {
      var a1 = [1,2,3];
      var a2 = [0,1,-1];

      var a3 = ai.arraySub(a1, a2);
      a3.should.eql([1,1,4]);
    });
  });

  describe('#arrayMul()', function() {
    it('should eql', function() {
      var a1 = [1,2,3];
      var a2 = [0,1,-1];

      var a3 = ai.arrayMul(a1, a2);
      a3.should.eql([0,2,-3]);

      a1 = [2,2,3];
      a2 = [8,1,-1,4];

      var a3 = ai.arrayMul(a1, a2);
      a3.should.eql([16,2,-3]);
    });
  });

  describe('#arrayExpand()', function() {
    it('should eql', function() {
      var a1 = [1,2];
      var a2 = ai.arrayExpand(a1);
      a2.should.eql([0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    });
  });

  describe('#arrayWithoutDup()', function() {
    it('should eql', function() {
      var a1 = [[1,2], [1,2], [2,1]];
      var a2 = ai.arrayWithoutDup(a1);
      a2.should.eql([[1,2]]);
    });
  });
});

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
      var word = "xrayy";
      var boardPos;
      var wordPos;

      boardPos = ai.boardPosition(board);
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(12);
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
      expected = ai.arrayAdd(expected, DEF.WEIGHT_BORDER);
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
      expected = ai.arrayAdd(expected, DEF.WEIGHT_BORDER);
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
      expected = ai.arrayAdd(expected, DEF.WEIGHT_BORDER);
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
          var expanedPos = ai.arrayExpand(wordPos[j]);
          var posWeight = ai.arrayMul(expanedPos, weight);

          posWeight = ai.arraySum(posWeight);
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
      var board = [-1,-1,0,0,0,
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
      var board = [-1,-1,0,0,0,
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
});
