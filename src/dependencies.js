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
  if (!(modToResolve in mods)) {
    return [];
  }
  
  var dependencies = mods[modToResolve].dependencies;
  alreadyResolved = alreadyResolved.concat([modToResolve]);

  dependencies.forEach(function(mod) {
    if (alreadyResolved.indexOf(mod) === -1) {
      dependencies = dependencies.concat(resolveDependenciesForMod(mods, mod, alreadyResolved));
    }
  });

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
