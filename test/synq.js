var should = require('should');
var synq = require('../src/synq');

describe('synq', function(){
  describe('hashToPath', function(){
    it('should resolve hash to path', function(done){
      synq.hashToPath("abcde").should.eql('ab/cde')
      done();
    });
  });
});
