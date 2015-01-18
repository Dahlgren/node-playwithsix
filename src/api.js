"use strict";
var request = require('request');

var constants = require('./constants');

function getData(url, cb) {
  request({url: url, json: true}, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      if (cb) {
        cb(null, body);
      }
    } else {
      if (cb) {
        cb(err, null);
      }
    }
  });
}

module.exports = {
  bundles: function(cb) {
    getData(constants.synq.rootUrl + '/' + constants.synq.arma3.mods + '/bundles.json', cb);
  },
  categories: function(cb) {
    getData(constants.api.rootUrl + '/categories.json', cb);
  },
  config: function(cb) {
    getData(constants.synq.rootUrl + '/' + constants.synq.arma3.mods + '/config.json', cb);
  },
  families: function(cb) {
    getData(constants.api.rootUrl + '/families.json', cb);
  },
  mirrors: function(cb) {
    getData(constants.api.rootUrl + '/mirrors.json', cb);
  },
  modSets: function(cb) {
    getData(constants.api.rootUrl + '/mod_sets.json', cb);
  },
  mods: function(cb) {
    getData(constants.api.rootUrl + '/mods.json', cb);
  },
  networks: function(cb) {
    getData(constants.api.rootUrl + '/networks.json', cb);
  },
  packages: function(cb) {
    getData(constants.synq.rootUrl + '/' + constants.synq.arma3.mods + '/packages.json', cb);
  },
  package: function(mod, version, cb) {
    getData(constants.synq.rootUrl + '/' + constants.synq.arma3.mods + '/packages/'+ mod + '-' + version + '.json', cb);
  },
};
