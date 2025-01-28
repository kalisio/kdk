var path = require('path')
var fs = require('fs')
var winston = require('winston')
var containerized = require('containerized')()

var API_PREFIX = '/api'

module.exports = {
  port: process.env.PORT || 8081,
  apiPath: API_PREFIX,
  domain: 'https://kapp.kalisio.xyz',
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
    identityFields: ['email', 'profile.phone'],
    authStrategies: [
      'jwt',
      'local'
    ],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwtOptions: {
      header: {
        type: 'access'
      },
      audience: 'https://kalisio.com',
      issuer: 'feathers',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    oauth: {
      redirect: '/'
    },
    passwordPolicy: {
      minLength: 8,
      maxLength: 128,
      uppercase: true,
      lowercase: true,
      digits: true,
      symbols: true,
      prohibited: fs.readFileSync(path.join(__dirname, '..', 'data', '10k_most_common_passwords.txt')).toString().split('\n'),
      history: 5
    }
  },
  authorisation: {
    cache: {
      maxUsers: 1000
    }
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
  'import-export': {
    s3Options: {
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
      prefix: 'import-export'
    },
    workingDir: 'test/api/core/tmp'
  },
  organisations: {
    // nothing for now
  },
  mailer: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_MAIL_USER,
      // Not required anymore for OAuth2
      // pass: process.env.GOOGLE_MAIL_PASSWORD
      serviceClient: process.env.GOOGLE_MAIL_CLIENT_ID,
      // New lines in env var causes some problems and raises the following error
      // Uncaught Error: error:0909006C:PEM routines:get_name:no start line
      privateKey: process.env.GOOGLE_MAIL_PRIVATE_KEY
    },
    templateDir: path.join(__dirname, 'email-templates')
  },
  gmailApi: {
    user: process.env.GMAIL_API_USER,
    clientEmail: process.env.GMAIL_API_CLIENT_EMAIL,
    privateKey: process.env.GMAIL_API_PRIVATE_KEY
  },
  db: {
    adapter: 'mongodb',
    url: (containerized ? 'mongodb://mongodb:27017/kdk-test' : 'mongodb://127.0.0.1:27017/kdk-test')
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
  push: {
    vapidDetails: {
      subject: process.env.VAPID_SUBJECT,
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    }
  }
}
