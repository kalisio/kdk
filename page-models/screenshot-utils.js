import * as fs from 'fs'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'

function refScreenshot (t, key) {
  const screenshotBase = t.testRun.opts.screenshots.path
  return `${screenshotBase}/reference/${key}.png`
}

function runScreenshot (t, key, absolute = false) {
  return absolute ? `${t.testRun.opts.screenshots.path}/${key}.png` : `${key}.png`
}

function diffScreenshots (t, key) {
  const ref = png.PNG.sync.read(fs.readFileSync(refScreenshot(t, key)))
  const run = png.PNG.sync.read(fs.readFileSync(runScreenshot(t, key, true)))
  const { width, height } = ref
  const diff = new png.PNG({ width, height })

  const opts = {
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0]
  }
  const numDiffs = pixelmatch(ref.data, run.data, diff.data, width, height, opts)
  const diffRatio = 100.0 * (numDiffs / (width * height))
  if (diffRatio > 1.0) {
    const output = runScreenshot(t, `diff-${key}`, true)
    fs.writeFileSync(output, png.PNG.sync.write(diff))
    throw new Error(`Diff ratio for '${key}' is too high: ${diffRatio.toPrecision(2)}%`)
  }
}

export async function checkScreenshot (t, key, diff = true) {
  await t.takeScreenshot({ path: runScreenshot(t, key) })

  if (diff) diffScreenshots(t, key)
}
