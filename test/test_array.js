var should = require("should")
  , ai = require("../lib/ai")
  , DEF = require('../lib/define')

describe('Array Operations', function() {
  describe('#arrayAdd()', function() {
    it('should eql', function() {
      var a1 = [1,2,3];
      var a2 = [0,1,-1];

      var a3 = a1.add(a2);
      a3.should.eql([1,3,2]);
      a1.should.eql([1,2,3]);

      a1 = [1,2,3];
      a2 = [0,1,-1,4];

      var a3 = a1.add(a2);
      a3.should.eql([1,3,2]);
      a1.should.eql([1,2,3]);
    });
  });

  describe('#arraySub()', function() {
    it('should eql', function() {
      var a1 = [1,2,3];
      var a2 = [0,1,-1];

      var a3 = a1.sub(a2);
      a3.should.eql([1,1,4]);
    });
  });

  describe('#arrayMul()', function() {
    it('should eql', function() {
      var a1 = [1,2,3];
      var a2 = [0,1,-1];

      var a3 = a1.multiply(a2);
      a3.should.eql([0,2,-3]);

      a1 = [2,2,3];
      a2 = [8,1,-1,4];

      a3 = a1.multiply(a2);
      a3.should.eql([16,2,-3]);
    });
  });

  describe('#arrayExpand()', function() {
    it('should eql', function() {
      var a1 = [1,2];
      var a2 = a1.expand();
      a2.should.eql([0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    });
  });

  describe('#arrayWithoutDup()', function() {
    it('should eql', function() {
      var a1 = [[1,2], [1,2], [2,1]];
      var a2 = a1.removeDuplicates();
      a2.should.eql([[1,2]]);
    });
  });
});

