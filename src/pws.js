var async = require('async')
var events = require('events')

var api = require('./api')
var dependencies = require('./dependencies')
var mapModInfo = require('./utils/map_mod_info')
var outdated = require('./outdated')
var search = require('./search')
var Synq = require('./synq')

function downloadPWSData (cb) {
  async.parallel({
    mirrors: api.mirrors,
    mods: fetchMods
  }, function (err, results) {
    if (err) {
      cb(err)
    } else if (results.mirrors && results.mods) {
      var mirror = api.selectMirror(results.mirrors)

      if (mirror) {
        var mods = results.mods
        api.packages(mirror, function (err, packages) {
          if (err) {
            cb(err)
          } else if (packages) {
            cb(null, mirror, mods, packages.packages)
          } else {
            cb(new Error('Unable to fetch metadata, please try again'))
          }
        })
      } else {
        cb(new Error('No working mirror could be found'))
      }
    } else {
      cb(new Error('Unable to fetch metadata, please try again'))
    }
  })
}

function fetchMods (cb) {
  api.mods(function (err, result) {
    var mods = {}

    if (err) {
      cb(err, null)
    } else {
      result.forEach(function (mod) {
        mods[mod.PackageName.toLowerCase()] = mapModInfo(mod)
      })

      cb(null, mods)
    }
  })
}

function resolveDependencies (modsToResolve, options, cb) {
  options = options || {}
  fetchMods(function (err, mods) {
    if (mods === null || err) {
      cb(err, null)
    } else {
      modsToResolve = modsToResolve.filter(function (mod) {
        return mod in mods
      })

      cb(null, dependencies.resolveDependenciesForMods(mods, modsToResolve, options))
    }
  })
}

function checkOutdated (directory, cb) {
  downloadPWSData(function (err, mirrors, mods, packages) {
    if (mods === null || packages === null || err) {
      cb(err, null)
    } else {
      outdated(directory, mods, packages, cb)
    }
  })
}

function downloadMod (destination, mod, options, cb) {
  return downloadMods(destination, [mod], options, cb)
}

function downloadMods (destination, modsToDownload, options, cb) {
  options = options || {}
  destination = destination + '/'
  var eventEmitter = new events.EventEmitter()

  downloadPWSData(function (err, mirror, mods, packages) {
    if (mirror === null || mods === null || packages === null || err) {
      cb(err, null)
    } else {
      var modsNotFound = []
      modsToDownload.forEach(function (mod) {
        if (!(mod in packages)) {
          modsNotFound.push(mod)
        }
      })

      if (modsNotFound.length > 0) {
        cb(new Error(modsNotFound.join(', ') + ' not found on Six Updater'), null)
      } else {
        if (!options.skipDependencies) {
          modsToDownload = dependencies.resolveDependenciesForMods(mods, modsToDownload, options)
        }

        async.mapLimit(modsToDownload, 1, function (mod, callback) {
          var modVersions = packages[mod]

          if (modVersions) {
            var version = modVersions[modVersions.length - 1]
            var synq = new Synq(mirror, destination, mod, version)
            synq.on('progress', function (progress) {
              eventEmitter.emit('progress', progress)
            })
            synq.download(function (err) {
              if (err) {
                callback(err, null)
              } else {
                callback(null, mod)
              }
            })
          } else {
            callback(new Error('Mod ' + mod + 'not found in packages', null))
          }
        }, cb)
      }
    }
  })

  return eventEmitter
}

function searchPWS (phrase, cb) {
  api.mods(function (err, mods) {
    if (err) {
      cb(err)
    } else {
      if (!mods || !Array.isArray(mods) || mods.length === 0) {
        cb(new Error('Unable to fetch metadata, please try again'))
      }

      search(phrase, mods, cb)
    }
  })
}

module.exports = {
  checkOutdated: checkOutdated,
  downloadMod: downloadMod,
  downloadMods: downloadMods,
  fetchMods: fetchMods,
  resolveDependencies: resolveDependencies,
  search: searchPWS
}
