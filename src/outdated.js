'use strict';
var async = require('async');
var fs = require('fs');
var path = require('path');

function checkSynqinfo(mod, modPath, latestVersion, cb) {
  var synqFile = path.join(modPath, '.synqinfo');
  fs.readFile(synqFile, 'utf8', function (err, content) {
    if (err) {
      cb(false, false);
    } else {
      cb(true, content != mod + "-" + latestVersion);
    }
  });
}

function checkSynqMetadata(mod, modPath, latestVersion, cb) {
  var synqFile = path.join(modPath, '.synq.json');
  fs.readFile(synqFile, 'utf8', function (err, content) {
    if (err) {
      cb(false, false);
    } else {
      var data = JSON.parse(content);
      if (data && data.version) {
        cb(true, data.version != latestVersion);
      } else {
        cb(false, false);
      }
    }
  });
}

function checkMod(mod, modPath, latestVersion, cb) {
  checkSynqinfo(mod, modPath, latestVersion, function (exists, outdated) {
    if (exists) {
      cb(outdated);
    } else {
      checkSynqMetadata(mod, modPath, latestVersion, function (exists, outdated) {
        cb(exists && outdated);
      });
    }
  })
}

function checkMods(directory, mods, packages, cb) {
  fs.readdir(directory, function (err, files) {
    if (err) {
      cb(err, null);
    } else {
      var presetMods = files.filter(function (file) {
        return mods[file] !== undefined;
      });

      async.filter(presetMods, function(mod, callback) {
        var modPath = path.join(directory, mod);

        var modVersions = packages[mod];

        if (modVersions) {
          var version = modVersions[modVersions.length - 1];
          checkMod(mod, modPath, version, callback);
        } else {
          callback(null, false);
        }
      }, function(outdatedMods){
        if (cb) {
          cb(err, outdatedMods);
        }
      });
    }
  });
}

module.exports = checkMods;
