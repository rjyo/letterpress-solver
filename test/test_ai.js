var should = require("should")
  , ai = require("../lib/ai")

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
    })
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
    })
  });
})

describe('Basic AI Operations', function() {
  describe('#boardPosition()', function() {
    it('should eql', function() {
      var board = "aaaac"
      var result = ai.boardPosition(board);

      var boardPos = new Array(25);
      boardPos[0] = [0,1,2,3];
      boardPos[2] = 4;

      result.should.eql(boardPos);
    })
  });

  describe('#wordPosition()', function() {
    it('check result', function() {
      var board = "aaaacc"
      var result = ai.boardPosition(board);
      var wordPos = ai.wordPosition("ac", result);

      var expectedResult = [];
      expectedResult.push([1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      expectedResult.push([0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

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

      word = "abc";
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(4);

      word = "acdk";
      wordPos = ai.wordPosition(word, boardPos);
      wordPos.length.should.eql(8);
    })
  });

  describe('#boardWeight()', function() {
    it('check result', function() {
      var board='xxiroarpiiuggozpdchzrazgj';
    });
  });

})

