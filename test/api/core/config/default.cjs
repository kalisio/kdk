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
        typ: 'access'
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
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET
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
      privateKey: JSON.parse(`"${process.env.GOOGLE_MAIL_PRIVATE_KEY}"`)
    },
    templateDir: path.join(__dirname, 'email-templates')
  },
  pusher: {
    accessKeyId: process.env.SNS_ACCESS_KEY,
    secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY,
    region: 'eu-west-1',
    apiVersion: '2010-03-31',
    platforms: {
      ANDROID: process.env.SNS_ANDROID_ARN,
      SMS: (!!process.env.SNS_PHONE_NUMBER)
    },
    topicName: (object) => object._id.toString()
  },
  gmailApi: {
    user: process.env.GMAIL_API_USER,
    clientEmail: process.env.GMAIL_API_CLIENT_EMAIL,
    // The private key file is set as an environment variable containing \n
    // So we need to parse it such as if it came from a JSON file
    privateKey: JSON.parse('{ "key": "' + process.env.GMAIL_API_PRIVATE_KEY + '" }').key
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
  }
}
