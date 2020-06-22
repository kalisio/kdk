import * as fs from 'fs'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'

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
  return absolute ? `${t.testRun.opts.screenshots.path}/run/${key}.png` : `run/${key}.png`
}

/* Given a reference screenshot key and a run screenshot key, this
 * will perform screenshot comparison and return the diffRatio as
 * a percentage of the number of mismatched pixels.
 */
function diffScreenshots (t, refKey, runKey) {
  const refPath = refScreenshot(t, refKey)
  const runPath = runScreenshot(t, runKey, true)
  const ref = png.PNG.sync.read(fs.readFileSync(refPath))
  const run = png.PNG.sync.read(fs.readFileSync(runPath))
  const { width, height } = ref
  const diff = new png.PNG({ width, height })

  const opts = {
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0]
  }
  const numDiffs = pixelmatch(ref.data, run.data, diff.data, width, height, opts)
  const diffRatio = 100.0 * (numDiffs / (width * height))
  return { diffRatio, diff }
}

export async function takeScreenshot (t, runKey) {
  await t.takeScreenshot({ path: runScreenshot(t, runKey) })
}

/* Make sure screenshot matches between run and ref screenshot keys.
 * If refKey is not provided, it will use runKey as refKey.
 */
export async function assertScreenshotMatches (t, runKey, refKey, maxDiffRatio = 1.0) {
  refKey = refKey || runKey
  await t.takeScreenshot({ path: runScreenshot(t, runKey) })
  const diff = diffScreenshots(t, refKey, runKey)
  if (diff.diffRatio > maxDiffRatio) {
    const output = runScreenshot(t, `diff-${runKey}`, true)
    fs.writeFileSync(output, png.PNG.sync.write(diff.diff))
    throw new Error(`Diff ratio for '${runKey}' is too high: ${diff.diffRatio.toPrecision(2)}%`)
  }
}

/* Make sure screenshot mismatches between run and ref screenshot keys.
 * If refKey is not provided, it will use runKey as refKey.
 */
export async function assertScreenshotMismatches (t, runKey, refKey, minDiffRatio = 1.0) {
  refKey = refKey || runKey
  await t.takeScreenshot({ path: runScreenshot(t, runKey) })
  const diff = diffScreenshots(t, refKey, runKey)
  if (diff.diffRatio < minDiffRatio) {
    const output = runScreenshot(t, `diff-${runKey}`, true)
    fs.writeFileSync(output, png.PNG.sync.write(diff.diff))
    throw new Error(`Diff ratio for '${runKey}' is too low: ${diff.diffRatio.toPrecision(2)}%`)
  }
}
