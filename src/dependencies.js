'use strict';

function resolveDependenciesForMods(mods, modsToResolve, options) {
  var dependencies = [];
  var lite = options.lite === true;

  modsToResolve.forEach(function(mod) {
    dependencies = dependencies.concat([mod]);
    dependencies = dependencies.concat(resolveDependenciesForMod(mods, mod, []));
  });

  if (lite) {
    dependencies = dependencies.map(function (mod) {
      return findLiteVersion(mods, mod);
    });
  }

  return removeDuplicates(dependencies);
}

function findLiteVersion(mods, mod) {
  ["lite", "_lite"].forEach(function (lite) {
    if (mods[mod + lite]) {
      mod = mod + lite;
    }
  });

  return mod;
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
