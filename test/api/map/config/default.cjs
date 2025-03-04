var path = require('path')
var winston = require('winston')
var containerized = require('containerized')()

var API_PREFIX = '/api'

module.exports = {
  port: process.env.PORT || 8081,

  apiPath: API_PREFIX,

  host: 'localhost',
  paginate: {
    default: 10,
    max: 50
  },
  authentication: {
    secret: 'b5KqXTye4fVxhGFpwMVZRO3R56wS5LNoJHifwgGOFkB5GfMWvIdrWyQxEJXswhAC',
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users',
    entity: 'user',
    authStrategies: [
      'jwt',
      'local'
    ],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    }
  },
  geocoder: {
    provider: 'opendatafrance'
  },
  logs: {
    Console: {
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: 'verbose'
    },
    DailyRotateFile: {
      format: winston.format.json(),
      filename: path.join(__dirname, '..', 'test-log-%DATE%.log'),
      datePattern: 'YYYY-MM-DD'
    }
  },
  db: {
    adapter: 'mongodb',
    url: (containerized ? 'mongodb://mongodb:27017/kdk-test' : 'mongodb://127.0.0.1:27017/kdk-test')
  },
  storage: {
    s3Client: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
      },
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      signatureVersion: 'v4'
    },
    bucket: process.env.S3_BUCKET,
    getObjectPath: '/storage-objects'
  },
  forecastPath: path.join(__dirname, '../forecast-data'),
  forecasts: [
    {
      name: 'gfs-world',
      label: 'GFS - 0.5°',
      description: 'World-wide',
      attribution: 'Forecast data from <a href="http://www.emc.ncep.noaa.gov/index.php?branch=GFS">NCEP</a>',
      model: 'gfs',
      baseUrl: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p50.pl',
      bounds: [0, -90, 360, 90],
      origin: [0, 90],
      size: [720, 361],
      resolution: [0.5, 0.5],
      tileResolution: [20, 20],
      runInterval: 6 * 3600, // Produced every 6h
      oldestRunInterval: 24 * 3600, // Don't go back in time older than 1 day
      interval: 3 * 3600, // Steps of 3h
      lowerLimit: 0, // From T0
      upperLimit: 3 * 3600, // Up to T0+3
      updateInterval: -1, // We will check for update manually for testing
      keepPastForecasts: true, // We will keep past forecast times so that the number of forecasts is predictable for tests
      elements: [
        {
          name: 'u-wind',
          variable: 'var_UGRD',
          levels: ['lev_10_m_above_ground']
        },
        {
          name: 'v-wind',
          variable: 'var_VGRD',
          levels: ['lev_10_m_above_ground']
        }
      ]
    }
  ],
  distribution: {
    app: {
      // We only consume services we don't produce any
      services: (service) => false,
      // Consume only probing
      remoteServices: (service) => service.path.endsWith('probes'),
      cote: { // Use cote defaults to speedup tests
        helloInterval: 2000,
        checkInterval: 4000,
        nodeTimeout: 5000,
        masterTimeout: 6000
      },
      publicationDelay: 5000
    },
    weacast: {
      // Distribute only probing
      services: (service) => service.path.endsWith('probes'),
      // We only produce services we don't consume any
      remoteServices: (service) => false,
      cote: { // Use cote defaults to speedup tests
        helloInterval: 2000,
        checkInterval: 4000,
        nodeTimeout: 5000,
        masterTimeout: 6000
      },
      publicationDelay: 5000
    }
  },
  styles: {}
}
