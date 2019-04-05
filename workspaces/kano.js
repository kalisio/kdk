var path = require('path')

module.exports = {
  'weacast-core': {
    organization: 'weacast',
    path: path.join('..', 'weacast'),
    dependencies: []
  },
  'weacast-leaflet': {
    organization: 'weacast',
    path: path.join('..', 'weacast'),
    dependencies: ['weacast-core']
  },
  kCore: {
    dependencies: []
  },
  kMap: {
    dependencies: ['@kalisio/kdk-core']
  },
  kano: {
    application: true,
    dependencies: ['@kalisio/kdk-core', '@kalisio/kdk-map', 'weacast-core', 'weacast-leaflet']
  }
}
