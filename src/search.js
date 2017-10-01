var mapModInfo = require('./utils/map_mod_info')

module.exports = function (phrase, mods, cb) {
  phrase = phrase.toLowerCase()
  var filteredMods = []
  mods.forEach(function (mod) {
    if (mod.PackageName.toLowerCase().indexOf(phrase) > -1 || mod.Name.toLowerCase().indexOf(phrase) > -1) {
      filteredMods.push(mapModInfo(mod))
    }
  })
  cb(null, filteredMods)
}
