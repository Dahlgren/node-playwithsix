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

function resolveDependencies(modsToResolve, cb) {
  downloadPWSData(function (err, mirrors, mods) {
    if (mods === null || err) {
      cb(err, null);
    } else {
      modsToResolve = modsToResolve.filter(function(mod) {
        return mod in mods;
      });

      cb(null, resolveDependenciesForMods(mods, modsToResolve));
    }
  });
}

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
      modsToDownload.forEach(function(mod) {
        if (!mods[mod]) {
          cb(new Error(mod + ' not found on Six Updater'), null);
          return;
        }
      });

      var mirror = selectMirror(mirrors);

      var toDownload = resolveDependenciesForMods(mods, modsToDownload);

      download(mirror, destination, toDownload, function (err) {
        cb(err, toDownload);
      });
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
