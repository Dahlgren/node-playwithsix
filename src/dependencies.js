'use strict';

function resolveDependenciesForMods(mods, modsToResolve) {
  var dependencies = [];

  modsToResolve.forEach(function(mod) {
    dependencies = dependencies.concat([mod]);
    dependencies = dependencies.concat(resolveDependenciesForMod(mods, mod, []));
  });

  return removeDuplicates(dependencies);
}

function resolveDependenciesForMod(mods, modToResolve, alreadyResolved) {
  var dependencies = mods[modToResolve].dependencies;

  if (mods[modToResolve].dependencies.length > 0) {
    mods[modToResolve].dependencies.forEach(function(mod) {
      if (alreadyResolved.indexOf(mod) != -1) {
        dependencies = dependencies.concat(resolveDependenciesForMod(mods, mod, alreadyResolved.concat([mod])));
      }
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
