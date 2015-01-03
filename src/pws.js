"use strict";
var async = require('async');

var api = require('./api');
var constants = require('./constants');
var dependencies = require('./dependencies');
var outdated = require('./outdated');
var synq = require('./synq');

function downloadPWSData(cb) {
  async.parallel({
    config: api.config,
    mods: fetchMods,
    packages: api.packages,
  }, function (err, results) {
    if (err) {
      cb(err);
    } else if (results.config && results.mods && results.packages) {
      cb(null, results.config.remotes[constants.synq.arma3.mods], results.mods, results.packages.packages);
    } else {
      cb(new Error("Unable to fetch metadata, please try again"));
    }
  });
}

function fetchMods(cb) {
  api.mods(function (err, result) {
    var mods = {};

    if (err) {
      cb(err, null);
    } else {
      result.forEach(function (mod) {
        mods[mod.name.toLowerCase()] = mod;
      });

      cb(null, mods);
    }
  });
}

function resolveDependencies(modsToResolve, cb) {
  downloadPWSData(function (err, mirrors, mods, packages) {
    if (mods === null || err) {
      cb(err, null);
    } else {
      modsToResolve = modsToResolve.filter(function(mod) {
        return mod in mods;
      });

      cb(null, dependencies.resolveDependenciesForMods(mods, modsToResolve));
    }
  });
}

function selectMirror(mirrors) {
  var mirror = mirrors[Math.floor(Math.random()*mirrors.length)];
  return mirror.replace('rsync://', 'http://').replace('zsync://', 'http://');
}

function checkOutdated(directory, cb) {
  downloadPWSData(function (err, mirrors, mods, packages) {
    if (mods === null || packages === null || err) {
      cb(err, null);
    } else {
      outdated(directory, mods, packages, cb);
    }
  });
}

function downloadMod(destination, mod, cb) {
  downloadMods(destination, [mod], cb);
}

function downloadMods(destination, modsToDownload, cb) {
  destination = destination + "/";

  downloadPWSData(function (err, mirrors, mods, packages) {
    if (mirrors === null || mods === null || packages === null || err) {
      cb(err, null);
    } else {
      var modsNotFound = [];
      modsToDownload.forEach(function(mod) {
        if (!(mod in packages)) {
          modsNotFound.push(mod);
        }
      });

      if (modsNotFound.length > 0) {
        cb(new Error(modsNotFound.join(', ') + ' not found on Six Updater'), null);
      } else {
        var mirror = selectMirror(mirrors);

        var toDownload = dependencies.resolveDependenciesForMods(mods, modsToDownload);

        async.map(toDownload, function (mod, callback) {
          var modVersions = packages[mod];

          if (modVersions) {
            var version = modVersions[modVersions.length - 1];
            synq.download(mirror, destination, mod, version, function(err) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, mod);
              }
            });
          } else {
            callback(new Error("Mod not found in packages", null));
          }
        }, cb);
      }
    }
  });
}

module.exports = {
  checkOutdated: checkOutdated,
  downloadMod: downloadMod,
  downloadMods: downloadMods,
  fetchMods: fetchMods,
  resolveDependencies: resolveDependencies,
};
