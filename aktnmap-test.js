module.exports = {
  kCore: {
    dependencies: []
  },
  kTeam: {
    dependencies: ['@kalisio/kdk-core']
  },
  kNotify: {
    dependencies: ['@kalisio/kdk-core']
  },
  kMap: {
    dependencies: ['@kalisio/kdk-core']
  },
  kBilling: {
    dependencies: ['@kalisio/kdk-core']
  },
  kEvent: {
    dependencies: [
      '@kalisio/kdk-core', 
	  '@kalisio/kdk-team', 
	  '@kalisio/kdk-notify', 
	  '@kalisio/kdk-map'
	]
  },
  aktnmap: {
    application: true,
    dependencies: [
      '@kalisio/kdk-core', 
	  '@kalisio/kdk-team', 
	  '@kalisio/kdk-notify', 
	  '@kalisio/kdk-map',
	  '@kalisio/kdk-billing',
	  '@kalisio/kdk-event'
	]
  }
}
