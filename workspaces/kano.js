module.exports = {
  kCore: {
    dependencies: []
  },
  kMap: {
    dependencies: ['@kalisio/kdk-core']
  },
  kano: {
    application: true,
    dependencies: ['@kalisio/kdk-core', '@kalisio/kdk-map']
  }
}
