"use strict";
var api = require('./api');
var download = require('./download');
var outdated = require('./outdated');

function downloadPWSData(cb) {
  api.mirrors(function (mirrors, err) {
    if (err) {
      cb(null, null, err);
    } else {
      fetchMods(function (mods, err) {
        cb(mirrors, mods, err);
      });
    }
  });
}

function fetchMods(cb) {
  api.mods(function (result, err) {
    var mods = {};

    if (err) {
      cb(null, err);
    } else {
      result.forEach(function (mod) {
        mods[mod.name.toLowerCase()] = mod;
      });

      cb(mods, null);
    }
  });
}

function resolveDependencies(mods, mod) {
  var dependencies = mods[mod].dependencies;

  if (mods[mod].dependencies.length > 0) {
    mods[mod].dependencies.forEach(function(_mod) {
      dependencies = dependencies.concat(resolveDependencies(mods, _mod));
    });
  }

  return dependencies;
}

function selectMirror(mirrors) {
  var rsyncMirrors = mirrors.filter(function (mirror) {
    return mirror.url.toLowerCase().indexOf('rsync://') === 0;
  });

  return rsyncMirrors[Math.floor(Math.random()*rsyncMirrors.length)].url;
}

function checkOutdated(directory, cb) {
  fetchMods(function (mods, err) {
    if (mods === null || err) {
      cb(null, err);
    } else {
      outdated(directory, mods, cb);
    }
  });
}

function downloadMod(destination, mod, cb) {
  destination = destination + "/";

  downloadPWSData(function (mirrors, mods, err) {
    if (mirrors === null || mods === null || err) {
      cb(null, err);
    } else {
      if (mods[mod]) {
        var mirror = selectMirror(mirrors);

        var toDownload = [mod].concat(resolveDependencies(mods, mod));
        download(mirror, destination, toDownload, function (err) {
          cb(toDownload, err);
        });
      } else {
        cb(null, 'Mod not found on Six Updater');
      }
    }
  });
}

module.exports = {
  checkOutdated: checkOutdated,
  downloadMod: downloadMod,
  fetchMods: fetchMods,
};
