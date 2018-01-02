module.exports = function (mod) {
  return {
    author: mod.Author,
    createdAt: mod.CreatedAt,
    dependencies: mod.Dependencies.map(function (dependency) {
      return dependency.toLowerCase()
    }),
    id: mod.Id,
    latestStableVersion: mod.latestStableVersion,
    latestVersion: mod.Version,
    name: mod.PackageName.toLowerCase(),
    size: mod.SizeWd,
    tags: mod.Tags,
    title: mod.Name,
    type: mod.Type,
    updatedAt: mod.UpdatedAt
  }
}
