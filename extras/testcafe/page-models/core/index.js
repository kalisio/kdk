import * as fs from 'fs'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'
import { ClientFunction } from 'testcafe'
import Screens from './screens'
import Layout from './layout'
import SideNav from './side-nav'
import Account from './account'
import OrganisationsPanel from './organisations-panel'
import OrganisationSettings from './organisation-settings'
import Members from './members'
import Tags from './tags'
import Groups from './groups'

export { Screens }
export { Layout }
export { SideNav }
export { Account }
export { OrganisationsPanel }
export { OrganisationSettings }
export { Members }
export { Tags }
export { Groups }

// Access store
export const getFromStore = ClientFunction((path) => window.$store.get(path))

// Access Feathers services
export const api = {
  logout: ClientFunction(() => window.$api.logout()),
  get: ClientFunction((service, id) => window.$api.getService(service).get(id)),
  find: ClientFunction((service, params) => window.$api.getService(service).find(params)),
  remove: ClientFunction((service, id) => window.$api.getService(service).remove(id))
}

// Acces window size
export const getWindowInnerWidth = ClientFunction(() => window.innerWidth)
export const getWindowInnerHeight = ClientFunction(() => window.innerHeight)

// Access routes
const baseUrl = process.env.APP_URL || (process.env.CLIENT_PORT ? 'http://localhost:' + process.env.CLIENT_PORT : (process.env.NODE_ENV === 'production' ? 'http://localhost:8081' : 'http://localhost:8082'))
export const getUrl = (path) => path ? baseUrl + '/#/' + path : baseUrl
export const goBack = ClientFunction(() => window.history.back())

// Access console errors
export const checkNoClientError = async (test) => {
  const { error } = await test.getBrowserConsoleMessages()
  await test.expect(error[0]).notOk()
}
export const checkClientError = async (test) => {
  const { error } = await test.getBrowserConsoleMessages()
  await test.expect(error[0]).ok()
}

// Screenshot helpers

/* Given a screenshot key (a string) this will provide the full path
 * of the associated reference screenshot file.
 */
function refScreenshot (t, key) {
  const screenshotBase = t.testRun.opts.screenshots.path
  return `${screenshotBase}/ref/${key}.png`
}

/* Given a screenshot key (a string) this will provide the path
 * of the test run screenshot file. If 'absolute' is false this
 * will return the relative path from the screenshot run folder.
 */
function runScreenshot (t, key, absolute = false) {
  const screenshotBase = t.testRun.opts.screenshots.path
  return absolute ? `${screenshotBase}/run/${key}.png` : `run/${key}.png`
}

/* Given a reference screenshot key and a run screenshot key, this
 * will perform screenshot comparison and return the diffRatio as
 * a percentage of the number of mismatched pixels.
 */
function diffScreenshots (t, refKey, runKey, diffOpts = {}) {
  const refPath = refScreenshot(t, refKey)
  const runPath = runScreenshot(t, runKey, true)
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

/* Just takes a screenshot and write it on disk as PNG
 * in a standard location
 */
export async function takeScreenshot (t, runKey) {
  await t.takeScreenshot({ path: runScreenshot(t, runKey) })
}

/* Makes sure screenshot matches between run and ref screenshot keys.
 * If refKey is not provided, it will use runKey as refKey.
 * maxDiffRatio is the allowed maximum percentage of mismatched pixels, if computed
 * diff ratio is higher, test will fail.
 * Pixel comparison uses threshold value [0,1] to flag pixels as mismatching (see pixelmatch module)
 */
export async function assertScreenshotMatches (t, runKey, { refKey = null, maxDiffRatio = 1.0, threshold = 0.1 } = {}) {
  const keyRef = refKey || runKey
  await t.takeScreenshot({ path: runScreenshot(t, runKey) })
  const diff = diffScreenshots(t, keyRef, runKey, { threshold })
  if (diff.diffRatio > maxDiffRatio) {
    const output = runScreenshot(t, `diff-${runKey}`, true)
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
export async function assertScreenshotMismatches (t, runKey, { refKey = null, minDiffRatio = 50.0, threshold = 0.1 } = {}) {
  const keyRef = refKey || runKey
  await t.takeScreenshot({ path: runScreenshot(t, runKey) })
  const diff = diffScreenshots(t, keyRef, runKey, { threshold })
  if (diff.diffRatio < minDiffRatio) {
    const output = runScreenshot(t, `diff-${runKey}`, true)
    fs.writeFileSync(output, png.PNG.sync.write(diff.diff))
    throw new Error(`Diff ratio for '${runKey}' is too low: ${diff.diffRatio.toPrecision(2)}%`)
  }
}
