module.exports = {
  'weacast-grib2json': {
    dependencies: []
  },
  'weacast-gtiff2json': {
    dependencies: []
  },
  'weacast-core': {
    dependencies: []
  },
  'weacast-probe': {
    dependencies: ['weacast-core']
  },
  'weacast-alert': {
    dependencies: ['weacast-core', 'weacast-probe']
  },
  'weacast-arpege': {
    dependencies: ['weacast-gtiff2json', 'weacast-core']
  },
  'weacast-arome': {
    dependencies: ['weacast-core', 'weacast-arpege']
  },
  'weacast-gfs': {
    dependencies: ['weacast-grib2json', 'weacast-core']
  },
  'weacast-api': {
    application: true,
    dependencies: ['weacast-core', 'weacast-probe', 'weacast-arpege', 'weacast-arome', 'weacast-alert', 'weacast-gfs']
  }
}
