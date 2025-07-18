import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import png from 'pngjs'
import makeDebug from 'debug'
import puppeteer from 'puppeteer'
import { compareImages, GeolocationAccuracy } from './utils.mjs'

const debug = makeDebug('kdk:core:test:runner')

function merger (objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export class Runner {
  constructor (suite, options = {}) {
    this.infos = []
    this.warnings = []
    this.errors = []
    // Compute helper default options
    const defaultPort = process.env.CLIENT_PORT || '8080'
    let domain = `http://localhost:${defaultPort}`
    if (process.env.NODE_APP_INSTANCE === 'dev' || process.env.NODE_APP_INSTANCE === 'test' || process.env.NODE_APP_INSTANCE === 'prod') {
      domain = `https://${options.appName}.` + process.env.SUBDOMAIN
    }
    const defaultBrowser = process.env.BROWSER || 'chrome'
    const defaultDataDir = path.join('.', 'test', 'data', suite)
    const defaultRunDir = path.join('.', 'test', 'run', defaultBrowser, suite)
    // Set the runner options using default and overriden options
    this.options = _.mergeWith({
      baseUrl: options?.path ? path.join(domain, options.path) : domain,
      browser: {
        browser: defaultBrowser,
        headless: (process.env.HEADLESS === 'true' || process.env.HEADLESS === '1') ? true : false,
        devtools: (process.env.NODE_ENV === 'development'),
        defaultViewport: {
          width: +process.env.VIEWPORT_WIDTH || 1024,
          height: +process.env.VIEWPORT_HEIGHT || 768
        },
        args: process.env.BROWSER_ARGS ? _.split(process.env.BROWSER_ARGS, ' ') : []
      },
      dataDir: defaultDataDir,
      runDir: defaultRunDir,
      screenshots: {
        dir: path.join(defaultRunDir, '/screenshots'),
        screenrefsDir: path.join(defaultDataDir, 'screenrefs'),
        matchThreshold: 0.1,
        diffTolerance: 0.1,
        writeDiffs: true
      },
      // Could be:
      // - 'preview' to only run tests without comparing to reference screenshots
      // - 'run' to run tests by comparing to reference screenshots
      // - 'record' to run tests and update reference screenshots
      mode: process.env.TEST_MODE || 'run',

      // Accuracy is required to get some desired behaviours
      geolocation: {
        accuracy: GeolocationAccuracy
      }
    }, options, merger)
    // Display the runner options
    console.log('Runner created with the following options:')
    console.log(this.options)
    // Create the run directory if needed
    if (!fs.existsSync(this.options.screenshots.dir)) {
      console.log('Creating runner directory structure')
      fs.mkdirSync(this.options.screenshots.dir, { recursive: true })
    } else {
      // Clear the directory
      const files = fs.readdirSync(this.options.screenshots.dir)
      for (const file of files) fs.unlinkSync(path.join(this.options.screenshots.dir, file))
    }
  }

  getUrl (path) {
    return path ? this.options.baseUrl + '/#/' + path : this.options.baseUrl
  }

  getDataPath (key) {
    return path.join(this.options.dataDir, key)
  }

  async start (path) {
    this.browser = await puppeteer.launch(this.options.browser)
    this.page = await this.browser.newPage()
    // Depending on options we need to activate override permissions
    const permissions = []
    const useGeolocation = _.has(this.options, 'geolocation.latitude') && _.has(this.options, 'geolocation.longitude')
    const useNotifications = _.get(this.options, 'notifications')
    // Handle required permissions
    if (useGeolocation) permissions.push('geolocation')
    if (useNotifications) permissions.push('notifications')
    if (!_.isEmpty(permissions)) {
      const context = this.browser.defaultBrowserContext()
      await context.overridePermissions(this.getUrl(path), permissions)
    }
    // Handle geolocation if needed
    if (useGeolocation) {
      const location = {
        latitude: _.get(this.options, 'geolocation.latitude'),
        longitude: _.get(this.options, 'geolocation.longitude'),
        accuracy: _.get(this.options, 'geolocation.accuracy')
      }
      debug(`Setting current geolocation to (${location.longitude}, ${location.latitude}) with accuracy ${location.accuracy}`)
      await this.page.setGeolocation(location)
    }

    // Handle the local storage if needed
    if (this.options.localStorage) {
      await this.page.evaluateOnNewDocument(items => {
        for (const [key, value] of Object.entries(items)) localStorage.setItem(key, value)
      }, this.options.localStorage)
    }
    // Catch errors
    this.page.on('console', message => {
      if (message.type() === 'error') {
        this.errors.push(message)
        debug('Console error:', message.text())
      } else if (message.type() === 'warning') {
        this.warnings.push(message)
        debug('Console warning:', message.text())
      } else if (message.type() === 'info') {
        this.infos.push(message)
        debug('Console info:', message.text())
      }
    })
    this.page.on('pageerror', message => {
      this.errors.push(message)
      debug('Page error:', message)
    })
    // Process the page language
    await this.page.evaluateOnNewDocument((options) => {
      Object.defineProperty(navigator, 'language', {
        get: function () {
          return _.get(options, 'lang', 'en-US')
        }
      })
    }, this.options)
    // Navigate the to given url
    await this.page.goto(this.getUrl(path))
    return this.page
  }

  async stop () {
    // Ensure it has been correctly initialized
    if (this.browser) await this.browser.close()
  }

  async capture (key, boundingBox) {
    // In run mode capture in new dir so that we can compare with ref
    // In record mode erase current ref, otherwise skip capture in preview mode
    if ((this.options.mode !== 'run') && (this.options.mode !== 'record')) return
    // If run mode store in screenshots dir, otherwise in screenrefs dir
    const dir = (this.options.mode === 'run' ? this.options.screenshots.dir : this.options.screenshots.screenrefsDir)
    const options = Object.assign(
      {
        path: path.join(dir, key + '.png'),
        type: 'png'
      }, boundingBox ? { clip: boundingBox } : { fullPage: true })
    await this.page.screenshot(options)
  }

  async captureAndMatch (key, boundingBox = null, tolerance = null) {
    await this.capture(key, boundingBox)
    // If not in run skip the image comparison
    if (this.options.mode !== 'run') return true
    // Compare the image
    const runImageKey = path.join(this.options.screenshots.dir, key + '.png')
    const refImageKey = path.join(this.options.screenshots.screenrefsDir, key + '.png')
    const diff = compareImages(runImageKey, refImageKey, this.options.screenshots.matchThreshold)
    if (!tolerance) tolerance = this.options.screenshots.diffTolerance
    if (diff.ratio <= tolerance) return true
    // Write the image diffs
    if (this.options.screenshots.writeDiffs) {
      const diffImageKey = path.join(this.options.screenshots.dir, `diff.${key}.png`)
      fs.writeFileSync(diffImageKey, png.PNG.sync.write(diff.data))
    }
    return false
  }

  compareCaptures (key1, key2, threshold) {
    const dir = this.options.screenshots.dir
    const img1 = path.join(dir, key1 + '.png')
    const img2 = path.join(dir, key2 + '.png')
    const imgDiff = this.options.screenshots.writeDiffs ? path.join(dir, `diff.${key1}.${key2}.png`) : null
    const result = compareImages(img1, img2, threshold, imgDiff)
    return result.diffRatio
  }

  hasMessage (pattern, messages) {
    let nbMatches = 0
    // In this case we just want to know if there is any error
    if (!pattern) {
      nbMatches = (messages.length > 0)
    } else if (pattern.test === 'function') { // RegExp, count matches
      messages.forEach(message => {
        if (pattern.test(message.text())) nbMatches++
      })
    } else {
      messages.forEach(message => { // String, count matches
        if (message.text() === pattern) nbMatches++
      })
    }
    return nbMatches
  }

  hasError (pattern) {
    return this.hasMessage(pattern, this.errors)
  }

  getErrors () {
    return this.errors
  }

  clearErrors () {
    this.errors = []
  }

  hasWarning (pattern) {
    return this.hasMessage(pattern, this.warnings)
  }

  getWarnings () {
    return this.warnings
  }

  clearWarnings () {
    this.warnings = []
  }

  hasInfo (pattern) {
    return this.hasMessage(pattern, this.infos)
  }

  getInfos () {
    return this.infos
  }

  clearInfos () {
    this.infos = []
  }
}
