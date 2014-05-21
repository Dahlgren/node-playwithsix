'use strict';

function resolveDependenciesForMods(mods, modsToResolve) {
  var dependencies = [];

  modsToResolve.forEach(function(mod) {
    dependencies = dependencies.concat([mod]);
    dependencies = dependencies.concat(resolveDependenciesForMod(mods, mod));
  });

  return removeDuplicates(dependencies);
}

function resolveDependenciesForMod(mods, modToReslove) {
  var dependencies = mods[modToReslove].dependencies;

  if (mods[modToReslove].dependencies.length > 0) {
    mods[modToReslove].dependencies.forEach(function(mod) {
      dependencies = dependencies.concat(resolveDependenciesForMod(mods, mod));
    });
  }

  return removeDuplicates(dependencies);
}

function removeDuplicates(mods) {
  return mods.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);
}

module.exports = {
  resolveDependenciesForMods: resolveDependenciesForMods,
  resolveDependenciesForMod: resolveDependenciesForMod,
};
