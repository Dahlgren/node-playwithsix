var should = require('should');
var api = require('../src/api');

describe('api', function(){
  describe('categories', function(){
    it('should return categories', function(done){
      api.categories(function (err, categories) {
        if (err) return done(err);
        categories.should.not.be.empty;
        done();
      });
    });
  });

  describe('config', function(){
    it('should return config', function(done){
      api.config(function (err, config) {
        if (err) return done(err);
        config.should.not.be.empty;
        done();
      });
    });

    it('should return remotes', function(done){
      api.config(function (err, config) {
        if (err) return done(err);
        config.remotes.should.not.be.empty;
        done();
      });
    });
  });

  describe('families', function(){
    it('should return families', function(done){
      api.families(function (err, families) {
        if (err) return done(err);
        families.should.not.be.empty;
        done();
      });
    });
  });

  describe('mirrors', function(){
    it('should return mirrors', function(done){
      api.families(function (err, mirrors) {
        if (err) return done(err);
        mirrors.should.not.be.empty;
        done();
      });
    });
  });

  describe('modSets', function(){
    it('should return modSets', function(done){
      api.families(function (err, modSets) {
        if (err) return done(err);
        modSets.should.not.be.empty;
        done();
      });
    });
  });

  describe('mods', function(){
    it('should return mods', function(done){
      api.families(function (err, mods) {
        if (err) return done(err);
        mods.should.not.be.empty;
        done();
      });
    });
  });

  describe('networks', function(){
    it('should return networks', function(done){
      api.families(function (err, networks) {
        if (err) return done(err);
        networks.should.not.be.empty;
        done();
      });
    });
  });

  describe('packages', function(){
    it('should return packages', function(done){
      api.packages(function (err, packages) {
        if (err) return done(err);
        packages.should.be.an.Object;
        packages.packages.should.be.an.Object;
        packages.packages.should.not.be.empty;
        done();
      });
    });
  });
});
