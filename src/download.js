"use strict";
var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs.extra');
var Rsync = require('rsync');

var pwsDirectory = ".pws/";

function downloadMod(mirror, destination, mod, cb) {
  var rsyncSource = mirror + '/rel/' + mod.replace("@", "") + '/./.pack/';
  var rsyncDest = destination + pwsDirectory + mod;

  fs.mkdir(destination + pwsDirectory, function (err) {
    var rsync = Rsync.build({
      flags: 'az',
      source: rsyncSource,
      destination: rsyncDest,
    });

    rsync.execute(function(err) {
      if (err) {
        cb(err);
      } else {
        extractMod(rsyncDest, destination + mod, cb);
      }
    });
  });
}

function extractMod(source, destination, cb) {
  fs.rmrf(destination, function (err) {
    if (err) {
      cb(err);
    } else {
      fs.copyRecursive(source, destination, function (err) {
        if (err) {
          cb(err);
        } else {
          exec("find " + destination + " -iname '*.gz' -exec gunzip {} \\;", cb);
        }
      });
    }
  });
}

function downloadMods(mirror, destination, mods, cb) {
  async.each(mods, function(mod, callback) {
    downloadMod(mirror, destination, mod, callback);
  }, function(err){
    if (cb) {
      cb(err);
    }
  });
}

module.exports = downloadMods;
