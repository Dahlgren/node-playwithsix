var should = require('should');
var api = require('../src/api');

describe('api', function(){
  describe('categories', function(done){
    it('should return categories', function(){
      api.categories(function (err, categories) {
        if (err) return done(err);
        categories.should.not.be.empty;
        done();
      });
    });
  });

  describe('families', function(done){
    it('should return families', function(){
      api.families(function (err, families) {
        if (err) return done(err);
        families.should.not.be.empty;
        done();
      });
    });
  });

  describe('mirrors', function(done){
    it('should return mirrors', function(){
      api.families(function (err, mirrors) {
        if (err) return done(err);
        mirrors.should.not.be.empty;
        done();
      });
    });
  });

  describe('modSets', function(done){
    it('should return modSets', function(){
      api.families(function (err, modSets) {
        if (err) return done(err);
        modSets.should.not.be.empty;
        done();
      });
    });
  });

  describe('mods', function(done){
    it('should return mods', function(){
      api.families(function (err, mods) {
        if (err) return done(err);
        mods.should.not.be.empty;
        done();
      });
    });
  });

  describe('networks', function(done){
    it('should return networks', function(){
      api.families(function (err, networks) {
        if (err) return done(err);
        networks.should.not.be.empty;
        done();
      });
    });
  });
});
