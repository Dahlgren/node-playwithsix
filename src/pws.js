"use strict";
var api = require('./api');
var dependencies = require('./dependencies');
var download = require('./download');
var outdated = require('./outdated');

function downloadPWSData(cb) {
  api.mirrors(function (err, mirrors) {
    if (err) {
      cb(err, null, null);
    } else {
      fetchMods(function (err, mods) {
        cb(err, mirrors, mods);
      });
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
  downloadPWSData(function (err, mirrors, mods) {
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
  var rsyncMirrors = mirrors.filter(function (mirror) {
    return mirror.url.toLowerCase().indexOf('rsync://') === 0;
  });

  return rsyncMirrors[Math.floor(Math.random()*rsyncMirrors.length)].url;
}

function checkOutdated(directory, cb) {
  fetchMods(function (err, mods) {
    if (mods === null || err) {
      cb(err, null);
    } else {
      outdated(directory, mods, cb);
    }
  });
}

function downloadMod(destination, mod, cb) {
  downloadMods(destination, [mod], cb);
}

function downloadMods(destination, modsToDownload, cb) {
  destination = destination + "/";

  downloadPWSData(function (err, mirrors, mods) {
    if (mirrors === null || mods === null || err) {
      cb(err, null);
    } else {
      var modsNotFound = [];
      modsToDownload.forEach(function(mod) {
        if (!(mod in mods)) {
          modsNotFound.push(mod);
        }
      });

      if (modsNotFound.length > 0) {
        cb(new Error(modsNotFound.join(', ') + ' not found on Six Updater'), null);
      } else {
        var mirror = selectMirror(mirrors);

        var toDownload = dependencies.resolveDependenciesForMods(mods, modsToDownload);

        download(mirror, destination, toDownload, function (err) {
          cb(err, toDownload);
        });
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
