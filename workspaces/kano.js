var path = require('path')

module.exports = {
  'feathers-distributed': {
    dependencies: [],
    branch: 'master'
  },
  'weacast-core': {
    organization: 'weacast',
    path: path.join('..', 'weacast'),
    dependencies: [],
    branch: 'master'
  },
  'weacast-leaflet': {
    organization: 'weacast',
    path: path.join('..', 'weacast'),
    dependencies: ['weacast-core'],
    branch: 'master'
  },
  kCore: {
    dependencies: []
  },
  kMap: {
    dependencies: ['@kalisio/kdk-core']
  },
  kano: {
    application: true,
    dependencies: [
      '@kalisio/kdk-core', 
      '@kalisio/kdk-map', 
      'weacast-core', 
      'weacast-leaflet']
  }
}
