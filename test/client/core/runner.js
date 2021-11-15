import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import makeDebug from 'debug'
import puppeteer from 'puppeteer'
import { compareImages } from './utils'

const debug = makeDebug('kdk:core:test:runner')

function merger (objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export class Runner {
  constructor (suite, options = {}) {
    this.warnings = []
    this.errors = []
    // Compute helper default options
    const defaultPort = process.env.CLIENT_PORT || '8080'
    let domain = `http://localhost:${defaultPort}`
    if (process.env.NODE_APP_INSTANCE === 'dev' || process.env.NODE_APP_INSTANCE === 'test' || process.env.NODE_APP_INSTANCE === 'prod') {
      domain = `https://${options.appName}` + process.env.SUBDOMAIN
    } 
    const defaultBrowser = process.env.BROWSER || 'chrome'
    const defaultDataDir = path.join('.', 'test', 'data', suite)
    const defaultRunDir = path.join('.', 'test', 'run', defaultBrowser, suite)
    // Set the runner options using default and overrrident options
    this.options = _.mergeWith({
      baseUrl: domain,
      browser: {
        product: defaultBrowser,
        headless: process.env.HEADLESS ? !!process.env.HEADLESS : false,
        defaultViewport: {
          width: +process.env.VIEWPORT_WIDTH || 1024,
          height: +process.env.VIEWPORT_HEIGHT || 768
        },
        args: process.env.BROWSER_ARGS ? _.split(process.env.BROWSER_ARGS, ' ') : []
      },
      dataDir: defaultDataDir,
      runDir: defaultRunDir,
      screenrefsDir: path.join(defaultDataDir, 'screenrefs'),
      screenshotsDir: path.join(defaultRunDir, '/screenshots'),
      mode: 'run',
      writeDiffs: false,
      matchTreshold: 0.1
    }, options, merger)
    // Display the runner options
    console.log('Runner created with the following options:')
    console.log(this.options)
    // Create the run directory if needed
    if (!fs.existsSync(this.options.screenshotsDir)) {
      console.log('Creating runner directory structure')
      fs.mkdirSync(this.options.screenshotsDir, { recursive: true })
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
    // Handle geolocation if needed
    if (this.options.geolocation) {
      const context = this.browser.defaultBrowserContext()
      await context.overridePermissions(this.getUrl(path), ['geolocation'])
      this.page.setGeolocation(this.options.geolocation)
    }
    // Handle the local storage if needed
    if (this.options.localStorage) {
      await this.page.evaluateOnNewDocument(items => {
        for (const [key, value] of Object.entries(items)) localStorage.setItem(key, value)
      }, this.options.localStorage)
    }
    // Catch errors
    this.page.on('console', message => {
      if (message._type === 'error') {
        this.errors.push(message)
        debug('Console error:', message)
      }
      if (message._type === 'warning') {
        this.warnings.push(message)
        // debug('Console warning:', message)
      }
    })
    // Navigate the to given url
    await this.page.goto(this.getUrl(path))
    return this.page
  }

  async stop () {
    // Ensure it has been correctly initialized
    if (this.browser) await this.browser.close()
  }

  async capture (key, boundingBox) {
    // If run mode store in screenshots dir, otherwise in screenrefs dir
    const dir = (this.options.mode === 'run' ? this.options.screenshotsDir : this.options.screenrefsDir)
    const options = Object.assign(
      {
        path: path.join(dir, key + '.png'),
        type: 'png'
      }, boundingBox ? { clip: boundingBox } : { fullPage: true })
    await this.page.screenshot(options)
  }

  async captureAndMatch (key, diffTolerance = 1.0, boundingBox = null) {
    await this.capture(key, boundingBox)
    // If run mode compare, otherwise skip as we only want to record screenrefs
    if (this.options.mode === 'run') {
      const runDir = path.join(this.options.screenshotsDir, key + '.png')
      const refPath = path.join(this.options.screenrefsDir, key + '.png')
      const diffFilename = this.options.writeDiffs ? path.join(this.options.screenshotsDir, `diff.${key}.png`) : null
      const diff = compareImages(runDir, refPath, this.options.matchTreshold, diffFilename)
      return diff.diffRatio <= diffTolerance
    } else {
      return true
    }
  }

  compareCaptures (key1, key2, threshold) {
    const dir = this.options.screenshotsDir
    const img1 = path.join(dir, key1 + '.png')
    const img2 = path.join(dir, key2 + '.png')
    const imgDiff = this.options.writeDiffs ? path.join(dir, `diff.${key1}.${key2}.png`) : null
    const result = compareImages(img1, img2, threshold, imgDiff)
    return result.diffRatio
  }

  hasError () {
    return this.errors.length > 0
  }

  getErrors () {
    return this.errors
  }

  clearErrors () {
    this.errors = []
  }

  hasWarning () {
    return this.warnings.length > 0
  }

  getWarnings () {
    return this.warnings
  }

  clearWarnings () {
    this.warnings = []
  }
}
