"use strict";
var request = require('request');

var rootUrl = 'http://api-cdn.withsix.com/api/v1';

function getData(path, cb) {
  request(rootUrl + path, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);

      if (cb) {
        cb(null, json);
      }
    } else {
      if (cb) {
        cb(err, null);
      }
    }
  });
}

module.exports = {
  categories: function(cb) {
    getData('/categories.json', cb);
  },
  families: function(cb) {
    getData('/families.json', cb);
  },
  mirrors: function(cb) {
    getData('/mirrors.json', cb);
  },
  modSets: function(cb) {
    getData('/mod_sets.json', cb);
  },
  mods: function(cb) {
    getData('/mods.json', cb);
  },
  networks: function(cb) {
    getData('/networks.json', cb);
  },
};
