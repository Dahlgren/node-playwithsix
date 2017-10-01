var request = require('request')

var constants = require('./constants')

function getData (url, cb) {
  request({url: url, json: true, gzip: true}, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      if (cb) {
        cb(null, body)
      }
    } else {
      if (cb) {
        cb(err, null)
      }
    }
  })
}

module.exports = {
  bundles: function (mirror, cb) {
    getData(mirror + '/synq/' + constants.synq.arma3.mods + '/bundles.json', cb)
  },
  categories: function (cb) {
    getData(constants.api.rootUrl + '/categories.json.gz', cb)
  },
  config: function (mirror, cb) {
    getData(mirror + '/synq/' + constants.synq.arma3.mods + '/config.json', cb)
  },
  families: function (cb) {
    getData(constants.api.rootUrl + '/families.json.gz', cb)
  },
  mirrors: function (cb) {
    getData(constants.api.rootUrl + '/mirrors.json.gz', cb)
  },
  modSets: function (cb) {
    getData(constants.api.rootUrl + '/mod_sets.json.gz', cb)
  },
  mods: function (cb) {
    getData(constants.api.rootUrl + '/mods.json.gz', cb)
  },
  networks: function (cb) {
    getData(constants.api.rootUrl + '/networks.json.gz', cb)
  },
  packages: function (mirror, cb) {
    getData(mirror + '/synq/' + constants.synq.arma3.mods + '/packages.json', cb)
  },
  package: function (mirror, mod, version, cb) {
    getData(mirror + '/synq/' + constants.synq.arma3.mods + '/packages/' + mod + '-' + version + '.json', cb)
  },
  selectMirror: function (mirrors) {
    var validMirrorsRegExp = /http:\/\/[a-z|0-9]+-[a-z|0-9]+.sixmirror.com/g
    mirrors = mirrors.map(function (mirror) {
      return mirror.url
    }).filter(function (mirror) {
      return validMirrorsRegExp.test(mirror.toLowerCase())
    })

    if (mirrors.length > 0) {
      return mirrors[Math.floor(Math.random() * mirrors.length)]
    }

    return null
  }
}
