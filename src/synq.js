var async = require('async');
var crypto = require('crypto');
var fs = require('fs.extra');
var path = require('path');
var os = require('os');
var recursiveReaddir = require('recursive-readdir');
var request = require('request');
var zlib = require('zlib');

var api = require('./api');

function hashToPath(hash) {
  return hash.substring(0, 2) + '/' + hash.substring(2);
}

function downloadFiles(mirror, destination, data, cb) {
  async.mapLimit(Object.keys(data.files), os.cpus().length, function (file, callback) {
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
      out.on('error', function (err) {
        cb(err, null)
      });

      request({url: mirror + '/objects/' + hashToPath(hash)})
        .on('error', function (err) {
          cb(err, null)
        })
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

function cleanupFiles(destination, data, cb) {
  modPath = path.join(destination, data.name);
  recursiveReaddir(modPath, function (err, files) {
    async.each(files, function (file, callback) {
      var filePath = file.replace(modPath + path.sep, '');

      if (filePath in data.files) {
        callback(null);
      } else {
        fs.unlink(file, function (err) {
          callback(err);
        });
      }
    }, cb)
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
      cleanupFiles(destination, data, function (err) {
        storePackageMetadata(destination, mod, data, cb);
      });
    });
  });
}

module.exports = {
  download: download,
  hashToPath: hashToPath,
};
