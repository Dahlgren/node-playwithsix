var async = require('async');
var crypto = require('crypto');
var events = require('events');
var fs = require('fs.extra');
var path = require('path');
var os = require('os');
var recursiveReaddir = require('recursive-readdir');
var request = require('request');
var zlib = require('zlib');

var api = require('./api');

var Synq = function (mirror, destination, mod, version) {
  this.mirror = mirror;
  this.destination = destination;
  this.mod = mod;
  this.version = version;
  this.size = 0;
  this.completed = 0;
};

Synq.prototype.__proto__ = events.EventEmitter.prototype;

Synq.convertWindowsFilePath = function (filePath) {
  // Change Windows backslashes in path to match PWS format
  return filePath.replace(/\\/g, '/');
}

Synq.hashToPath = function (hash) {
  return hash.substring(0, 2) + '/' + hash.substring(2);
}

Synq.prototype.emitProgress = function () {
  this.emit('progress', {
    completed: this.completed,
    mod: this.mod,
    size: this.size,
  })
};

Synq.prototype.downloadFiles = function (cb) {
  var self = this;
  async.mapLimit(Object.keys(self.data.files), os.cpus().length, function (file, callback) {
    var hash = self.data.files[file];
    var filePath = path.join(self.destination, self.data.name, file);

    self.calculateFileHash(filePath, function(err, fileHash) {
      if (err || hash !== fileHash) {
        self.downloadFile(filePath, hash, callback);
      } else {
        fs.stat(filePath, function (err, stats) {
          self.completed += stats.size;
          self.emitProgress();
          callback(null, hash);
        });
      }
    });
  }, cb);
}

Synq.prototype.downloadFile = function (filePath, hash, cb) {
  var folderPath = path.dirname(filePath);
  var self = this;

  fs.mkdirp(folderPath, function (err) {
    if (err) {
      cb(err, null);
    } else {
      var out = fs.createWriteStream(filePath);
      out.on('finish', function () {
        self.emitProgress();
        cb(null, hash);
      });
      out.on('error', function (err) {
        cb(err, null);
      });

      var unzip = zlib.createGunzip();
      unzip.on('data', function(chunk) {
        self.completed += chunk.length;
        self.emitProgress();
      });

      request({url: self.mirror + '/objects/' + Synq.hashToPath(hash)})
        .on('error', function (err) {
          cb(err, null);
        })
        .pipe(unzip)
        .pipe(out);
    }
  });
}

Synq.prototype.calculateFileHash = function (filePath, cb) {
  var hash = crypto.createHash('sha1');
  var stream = fs.createReadStream(filePath);

  stream.on('data', function (data) {
    hash.update(data, 'utf8');
  });

  stream.on('end', function () {
    cb(null, hash.digest('hex'));
  });

  stream.on('error', function (err) {
    cb(err, null);
  });
}

Synq.prototype.cleanupFiles = function (cb) {
  var self = this;
  var modPath = path.join(this.destination, this.data.name);

  recursiveReaddir(modPath, function (err, files) {
    async.each(files, function (file, callback) {
      var filePath = file.replace(modPath + path.sep, '');

      if (process.platform === 'win32') {
        filePath = Synq.convertWindowsFilePath(filePath);
      }

      if (filePath in self.data.files) {
        callback(null);
      } else {
        fs.unlink(file, function (err) {
          callback(err);
        });
      }
    }, cb);
  });
}

Synq.prototype.storePackageMetadata = function (cb) {
  var modPath = path.join(this.destination, this.mod);
  var dataStr = JSON.stringify(this.data);
  var versionStr = this.mod + "-" + this.version;

  fs.mkdirp(modPath, function (err) {
    if (err) {
      cb(err, null);
    } else {
      fs.writeFile(path.join(modPath, '.synq.json'), dataStr, function (err) {
        if (err) {
          cb(err, null);
        } else {
          fs.writeFile(path.join(modPath, '.synqinfo'), versionStr, cb);
        }
      });
    }
  });
}

Synq.prototype.download = function (cb) {
  var self = this;
  api.package(self.mod, self.version, function (err, data) {
    if (err) {
      cb(err);
    } else if (data) {
      self.data = data;
      self.size = data.size;
      self.emitProgress();
      self.downloadFiles(function (err, objects) {
        if (err) {
          cb(err);
        } else {
          self.cleanupFiles(function (err) {
            if (err) {
              cb(err);
            } else {
              self.storePackageMetadata(cb);
            }
          });
        }
      });
    } else {
      cb(new Error('Unable to fetch metadata for ' + mod + ', please try again'));
    }
  });
}

module.exports = Synq;
