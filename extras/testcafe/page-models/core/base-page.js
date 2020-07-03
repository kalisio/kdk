import * as fs from 'fs'
import _ from 'lodash'
import { Selector } from 'testcafe'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'

/* Given a screenshot key (a string) this will provide the full path
 * of the associated reference screenshot file.
 */
function refScreenshot (test, key) {
  const screenshotBase = test.testRun.opts.screenshots.path
  return `${screenshotBase}/ref/${key}.png`
}

/* Given a screenshot key (a string) this will provide the path
 * of the test run screenshot file. If 'absolute' is false this
 * will return the relative path from the screenshot run folder.
 */
function runScreenshot (test, key, absolute = false) {
  const screenshotBase = test.testRun.opts.screenshots.path
  return absolute ? `${screenshotBase}/run/${key}.png` : `run/${key}.png`
}

/* Given a reference screenshot key and a run screenshot key, this
 * will perform screenshot comparison and return the diffRatio as
 * a percentage of the number of mismatched pixels.
 */
function diffScreenshots (test, refKey, runKey, diffOpts = {}) {
  const refPath = refScreenshot(test, refKey)
  const runPath = runScreenshot(test, runKey, true)
  const ref = png.PNG.sync.read(fs.readFileSync(refPath))
  const run = png.PNG.sync.read(fs.readFileSync(runPath))
  const { width, height } = ref
  const diff = new png.PNG({ width, height })

  const defOpts = {
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0]
  }
  const opts = Object.assign(defOpts, diffOpts)

  const numDiffs = pixelmatch(ref.data, run.data, diff.data, width, height, opts)
  const diffRatio = 100.0 * (numDiffs / (width * height))
  return { diffRatio, diff }
}

export default class BasePage {
  constructor () {
    this.error = Selector('.q-notification')
  }

  // Error helper
  async isErrorVisible () {
    return this.error.visible
  }

  // Screenshot helpers

  /* Just takes a screenshot and write it on disk as PNG
   * in a standard location
   * */
  async takeScreenshot (test, runKey) {
    await test.takeScreenshot({ path: runScreenshot(test, runKey) })
  }

  /* Makes sure screenshot matches between run and ref screenshot keys.
   * If refKey is not provided, it will use runKey as refKey.
   * maxDiffRatio is the allowed maximum percentage of mismatched pixels, if computed
   * diff ratio is higher, test will fail.
   * Pixel comparison uses threshold value [0,1] to flag pixels as mismatching (see pixelmatch module)
   */
  async assertScreenshotMatches (test, runKey, { refKey = null, maxDiffRatio = 1.0, threshold = 0.1 } = {}) {
    const keyRef = refKey || runKey
    await test.takeScreenshot({ path: runScreenshot(test, runKey) })
    const diff = diffScreenshots(test, keyRef, runKey, { threshold })
    if (diff.diffRatio > maxDiffRatio) {
      const output = runScreenshot(test, `diff-${runKey}`, true)
      fs.writeFileSync(output, png.PNG.sync.write(diff.diff))
      throw new Error(`Diff ratio for '${runKey}' is too high: ${diff.diffRatio.toPrecision(2)}%`)
    }
  }

  /* Makes sure screenshot mismatches between run and ref screenshot keys.
   * If refKey is not provided, it will use runKey as refKey.
   * minDiffRatio is the allowed minimum percentage of mismatched pixels, if computed
   * diff ratio is lower, test will fail.
   * Pixel comparison uses threshold value [0,1] to flag pixels as mismatching (see pixelmatch module)
   */
  async assertScreenshotMismatches (test, runKey, { refKey = null, minDiffRatio = 50.0, threshold = 0.1 } = {}) {
    const keyRef = refKey || runKey
    await test.takeScreenshot({ path: runScreenshot(test, runKey) })
    const diff = diffScreenshots(test, keyRef, runKey, { threshold })
    if (diff.diffRatio < minDiffRatio) {
      const output = runScreenshot(test, `diff-${runKey}`, true)
      fs.writeFileSync(output, png.PNG.sync.write(diff.diff))
      throw new Error(`Diff ratio for '${runKey}' is too low: ${diff.diffRatio.toPrecision(2)}%`)
    }
  }
}
