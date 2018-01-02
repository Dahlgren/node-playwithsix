var url = require ('url')
var constants = require('../constants')

module.exports = function (mod) {
  var imageUrl = null
  if (mod.ImagePath) {
    imageUrl = url.resolve(constants.images.rootUrl, mod.ImagePath)
  }

  return {
    author: mod.Author,
    createdAt: mod.CreatedAt,
    dependencies: mod.Dependencies.map(function (dependency) {
      return dependency.toLowerCase()
    }),
    id: mod.Id,
    imageUrl: imageUrl,
    latestStableVersion: mod.LatestStableVersion,
    latestVersion: mod.Version,
    name: mod.PackageName.toLowerCase(),
    size: mod.SizeWd,
    tags: mod.Tags,
    title: mod.Name,
    type: mod.Type,
    updatedAt: mod.UpdatedAt
  }
}
