'use strict';
var async = require('async');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

function checkMod(mods, mod, modPath, cb) {
  var ymlFile = path.join(modPath, '.repository.yml');
  fs.readFile(ymlFile, 'utf8', function (err, content) {
    if (err) {
      cb(false);
    } else {
      var doc = yaml.safeLoad(content);
      if (doc && doc[':version']) {
        cb(doc[':version'] != mods[mod].version);
      } else {
        cb(false);
      }
    }
  });
}

function checkMods(directory, mods, cb) {
  fs.readdir(directory, function (err, files) {
    if (err) {
      cb(err, null);
    } else {
      var presetMods = files.filter(function (file) {
        return mods[file] !== undefined;
      });

      async.filter(presetMods, function(mod, callback) {
        var modPath = path.join(directory, mod);
        checkMod(mods, mod, modPath, callback);
      }, function(outdatedMods){
        if (cb) {
          cb(err, outdatedMods);
        }
      });
    }
  });
}

module.exports = checkMods;
