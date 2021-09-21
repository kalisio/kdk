import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import { compareImages } from './utils'

export class Runner {
  constructor (suite, options = {}) {
    this.warnings = []
    this.errors = []
    // Compute helper default options
    const defaultPort = process.env.CLIENT_PORT || '8080'
    const defaultBrowser = process.env.BROWSER || 'chrome'
    const defaultDataDir = path.join('.', 'test', 'data', suite)
    const defaultRunDir = path.join('.', 'test', 'run', defaultBrowser, suite)
    // Set the runner options using default and overrrident options
    this.options = _.merge({
      baseUrl: process.env.APP_URL || `http://localhost:${defaultPort}`,
      browser: {
        product: defaultBrowser,
        headless: process.env.HEADER ? !!process.env.HEADLESS : false,
        defaultViewport: {
          width: +process.env.VIEWPORT_WIDTH || 1024,
          height: +process.env.VIEWPORT_HEIGHT || 768
        }
      },
      dataDir: defaultDataDir,
      runDir: defaultRunDir,
      screenrefsDir: path.join(defaultDataDir, 'screenrefs'),
      screenshotsDir: path.join(defaultRunDir, '/screenshots'),
      matchTeshold: 0.1
    }, options)
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
      if (message._type === 'error') this.errors.push(message)
      if (message._type === 'warning') this.warnings.push(message)
    })
    // Navigate the to given url
    await this.page.goto(this.getUrl(path))
    return this.page
  }

  async stop () {
    await this.browser.close()
  }

  async capture (key) {
    await this.page.screenshot({
      path: path.join(this.options.screenshotsDir, key + '.png'),
      fullPage: true,
      type: 'png'
    })
  }

  async captureAndMatch (key, diffTolerance = 1.0) {
    await this.capture(key)
    const runDir = path.join(this.options.screenshotsDir, key + '.png')
    const refPath = path.join(this.options.screenrefsDir, key + '.png')
    const diff = compareImages(runDir, refPath, this.options.matchTeshold)
    return diff.diffRatio <= diffTolerance
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
