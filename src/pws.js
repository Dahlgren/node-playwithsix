"use strict";
var api = require('./api');
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

function resolveDependencies(mods, mod) {
  var dependencies = mods[mod].dependencies;

  if (mods[mod].dependencies.length > 0) {
    mods[mod].dependencies.forEach(function(_mod) {
      dependencies = dependencies.concat(resolveDependencies(mods, _mod));
    });
  }

  // Remove duplicates
  return dependencies.reduce(function(a,b){
    if (a.indexOf(b) < 0 ) a.push(b);
    return a;
  },[]);
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
  destination = destination + "/";

  downloadPWSData(function (err, mirrors, mods) {
    if (mirrors === null || mods === null || err) {
      cb(err, null);
    } else {
      if (mods[mod]) {
        var mirror = selectMirror(mirrors);

        var toDownload = [mod].concat(resolveDependencies(mods, mod));
        download(mirror, destination, toDownload, function (err) {
          cb(err, toDownload);
        });
      } else {
        cb(new Error('Mod not found on Six Updater'), null);
      }
    }
  });
}

module.exports = {
  checkOutdated: checkOutdated,
  downloadMod: downloadMod,
  fetchMods: fetchMods,
};
