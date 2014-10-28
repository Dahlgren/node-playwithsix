var async = require('async');
var fs = require('fs.extra');
var path = require('path');
var request = require('request');
var zlib = require('zlib');

var api = require('./api');

function hashToPath(hash) {
  return hash.substring(0, 2) + '/' + hash.substring(2);
}

function downloadFiles(mirror, destination, data, cb) {
  async.map(Object.keys(data.files), function (file, callback) {
    var hash = data.files[file];

    var filePath = path.join(destination, data.name, file);
    var folderPath = path.dirname(filePath);

    fs.mkdirp(folderPath, function (err) {
      if (err) {
        callback(err, null);
      } else {
        var out = fs.createWriteStream(filePath);
        out.on('finish', function () {
          callback(null, hash);
        });

        request({url: mirror + '/objects/' + hashToPath(hash)})
          .pipe(zlib.createGunzip())
          .pipe(out);
      }
    });
  }, cb);
}

function storePackageMetadata(destination, mod, data, cb) {
  var filePath = path.join(destination, mod, '.synq.json');
  var folderPath = path.dirname(filePath);

  fs.mkdirp(folderPath, function (err) {
    if (err) {
      cb(err, null);
    } else {
      fs.writeFile(filePath, JSON.stringify(data), cb);
    }
  });
}

function download(mirror, destination, mod, version, cb) {
  api.package(mod, version, function (err, data) {
    downloadFiles(mirror, destination, data, function (err, objects) {
      storePackageMetadata(destination, mod, data, cb);
    });
  });
}

module.exports = {
  download: download,
  hashToPath: hashToPath,
};
