var async = require('async');

module.exports = function (phrase, mods, cb) {
  phrase = phrase.toLowerCase();
  filteredMods = [];
  mods.forEach(function (mod) {
    if (mod.PackageName.toLowerCase().indexOf(phrase) > -1 || mod.Name.toLowerCase().indexOf(phrase) > -1) {
      filteredMods.push({
        dependencies: mod.Dependencies.map(function (dependency) {
          return dependency.toLowerCase();
        }),
        name: mod.PackageName.toLowerCase(),
        size: mod.SizeWd,
        title: mod.Name,
        type: mod.Type,
      });
    }
  });
  cb(null, filteredMods);
};
