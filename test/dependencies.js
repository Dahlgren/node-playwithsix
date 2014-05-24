var should = require('should');
var dependencies = require('../src/dependencies');
describe('dependencies', function(){
  describe('resolveDependenciesForMods', function(){
    it('should return empty array for no mods', function(){
      dependencies.resolveDependenciesForMods({}, []).should.eql([]);
    });

    it('should handle circular dependencies', function(){
      dependencies.resolveDependenciesForMods({
        mod1: {
          dependencies: ["mod2"]
        },
        mod2: {
          dependencies: ["mod1"]
        },
      }, ["mod1"]).should.eql(["mod1", "mod2"]);
    });

    it('should handle more than one dependency depth', function(){
      dependencies.resolveDependenciesForMods({
        mod1: {
          dependencies: ["mod2"]
        },
        mod2: {
          dependencies: ["mod3"]
        },
        mod3: {
          dependencies: []
        },
      }, ["mod1"]).should.eql(["mod1", "mod2", "mod3"]);
    });

    it('should aggregate multiple mods correctly', function(){
      dependencies.resolveDependenciesForMods({
        mod1: {
          dependencies: ["mod2"]
        },
        mod2: {
          dependencies: []
        },
        mod3: {
          dependencies: ["mod4"]
        },
        mod4: {
          dependencies: []
        },
      }, ["mod1", "mod3"]).should.eql(["mod1", "mod2", "mod3", "mod4"]);
    });
  });
});
