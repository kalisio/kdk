import path from 'path'
import puppeteer  from 'puppeteer'
import { compareImages } from './utils'

const defaultPort =  process.env.CLIENT_PORT || (process.env.NODE_ENV === 'production' ? '8081' : '8082')

export class Runner {
  constructor (options = {}) {
    this.options = Object.assign({
      baseUrl: process.env.APP_URL || `http://localhost:${defaultPort}`,
      browser: {
        product: process.env.BROWSER || 'chrome',
        headless: process.env.HEADER ? !!process.env.HEADLESS : false,
        defaultViewport: {
          width: +process.env.VIEWPORT_WIDTH || 1024,
          height: +process.env.VIEWPORT_HEIGHT || 768
        }
      },
      capture: {
        screenshotsBasePath: './test/data/screenshots',
        screenrefsBasePath: './test/data/screenrefs',
        matchTeshold: 0.1
      }
    })
    console.log('Runner created with the following options:')
    console.log(this.options)
  }

  getUrl (path) {
    return path ? this.options.baseUrl + '/#/' + path : this.options.baseUrl
  }

  async start (path) {
    this.browser = await puppeteer.launch(this.options.browser)
    this.page = await this.browser.newPage()
    await this.page.goto(this.getUrl(path))
    return this.page
  }

  async stop () {
    await this.browser.close()
  }

  async capture (key) {
    await this.page.screenshot({
      path: path.join(this.options.capture.screenshotsBasePath, key + '.png'),
      fullPage: true,
      type: 'png'
    })
  }

  async captureAndMatch (key, diffTolerance = 1.0) {
    await this.capture(key)
    const runPath = path.join(this.options.capture.screenshotsBasePath, key + '.png')
    const refPath = path.join(this.options.capture.screenrefsBasePath, key + '.png')
    const diff = compareImages(runPath, refPath)
    return diff.diffRatio <= diffTolerance
  }
}