import fs from 'fs'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'

/* Helper function to check wether an element exists
 * see: https://github.com/puppeteer/puppeteer/issues/545
 */
export async function elementExists (page, selector) {
  return !!(await page.$(selector))
}

/* Helper function to check wether an element is visible
 * see: https://github.com/puppeteer/puppeteer/issues/545
*/
export async function isElementVisible (page, selector) {
  return page.evaluate((selector) => {
    const element = document.querySelector(selector)
    if (!element) return false
    const style = window.getComputedStyle(element)
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  }, selector)
}

/* Helper function to click on a given selector
 */
export async function click (page, selector, wait = 250) {
  await page.waitForSelector(selector)
  await page.click(selector)
  await page.waitForTimeout(wait)
}

/* Helper function to input a test on a given selector
 */
export async function type (page, selector, text, wait = 250) {
  await page.waitForSelector(selector)
  await page.type(selector, text)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(wait)
}

/* Helper function to input a test on a given selector
 */
export async function upload (page, selector, filePath, wait = 2000) {
  const element = await page.$(selector)
  await element.uploadFile(filePath)
  await page.waitForTimeout(wait)
}

/* Helper function that wait until all images are loaded
 */
export async function waitForImagesLoaded (page) {
  await page.evaluate(async () => {
    const imageSelectors = Array.from(document.querySelectorAll('img'))
    await Promise.all(imageSelectors.map(img => {
      if (img.complete) return
      return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve)
        img.addEventListener('error', reject)
      })
    }))
  })
}

/* Return the Store value corresponding to the given path
 */
export async function getFromStore (page, path) {
  return page.evaluate((path) => window.$store.get(path), path)
}

/* Given a reference screenshot  key and a run screenshot key, this
 * will perform screenshot comparison and return the diffRatio as
 * a percentage of the number of mismatched pixels.
 * see: https://github.com/mapbox/pixelmatch
 */
export function compareImages (image1, image2, threshold) {
  const img1 = png.PNG.sync.read(fs.readFileSync(image1))
  const img2 = png.PNG.sync.read(fs.readFileSync(image2))
  const { width, height } = img1
  const diff = new png.PNG({ width, height })
  const options = {
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0],
    threshold: threshold
  }
  const numDiffs = pixelmatch(img1.data, img2.data, diff.data, width, height, options)
  const diffRatio = 100.0 * (numDiffs / (width * height))
  return { diffRatio, diff }
}
