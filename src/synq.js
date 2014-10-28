var async = require('async');
var crypto = require('crypto');
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

    calculateFileHash(filePath, function(err, fileHash) {
      if (err || hash !== fileHash) {
        downloadFile(mirror, filePath, hash, callback)
      } else {
        callback(null, hash);
      }
    });
  }, cb);
}

function downloadFile(mirror, filePath, hash, cb) {
  var folderPath = path.dirname(filePath);

  fs.mkdirp(folderPath, function (err) {
    if (err) {
      cb(err, null);
    } else {
      var out = fs.createWriteStream(filePath);
      out.on('finish', function () {
        cb(null, hash);
      });

      request({url: mirror + '/objects/' + hashToPath(hash)})
        .pipe(zlib.createGunzip())
        .pipe(out);
    }
  });
}

function calculateFileHash(filePath, cb) {
  var hash = crypto.createHash('sha1');
  var stream = fs.createReadStream(filePath);

  stream.on('data', function (data) {
    hash.update(data, 'utf8')
  });

  stream.on('end', function () {
    cb(null, hash.digest('hex'));
  });

  stream.on('error', function (err) {
    cb(err, null);
  });
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
