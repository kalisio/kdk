import makeDebug from 'debug'
import fs from 'fs'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'

const debug = makeDebug('kdk:core:test:utils')

/* Helper function to check wether an element exists
 * see: https://github.com/puppeteer/puppeteer/issues/545
 */
export async function elementExists (page, selector) {
  const exists = !!(await page.$(selector))
  debug(`Element ${selector} ` + (exists ? 'exists' : 'does not exist'))
  return exists
}

/* Helper function to check wether an element is visible
 * see: https://github.com/puppeteer/puppeteer/issues/545
*/
export async function isElementVisible (page, selector) {
  debug(`Checking if element ${selector} is visible`)
  return page.evaluate((selector) => {
    const element = document.querySelector(selector)
    if (!element) return false
    const style = window.getComputedStyle(element)
    const visible = (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0')
    return visible
  }, selector)
}

/* Count the elements that match the given XPath expresion
 */
export async function countElements (page, xpath) {
  const elements = await page.$x(xpath)
  if (elements) return elements.length
  return 0
}

/* Helper function to click on a given selector
 */
export async function click (page, selector, wait = 250) {
  try {
    await page.waitForSelector(selector, { timeout: 2000 })
    await page.click(selector)
    await page.waitForTimeout(wait)
    debug(`Clicked target ${selector}`)
  } catch (error) {
    console.error(`click ${selector} failed.`)
  }
}

/* Helper function to click on a given xpath
 */
export async function clickXPath (page, xpath, wait = 250) {
  try {
    await page.waitForXPath(xpath, { timeout: 2000 })
    const elements = await page.$x(xpath)
    if (elements.length > 0) {
      elements[0].click()
      await page.waitForTimeout(wait)
      debug(`Clicked target ${xpath}`)
    }
  } catch (error) {
    console.error(`click ${xpath} failed.`)
  }
}

/* Helper function to click on a given selector then select given entry
 */
export async function clickSelect (page, selector, entry, wait = 250) {
  try {
    await page.waitForSelector(selector, { timeout: 2000 })
    await page.click(selector)
    debug(`Clicked target ${selector}`)
    // We handle single/multiple selection
    if (Array.isArray(entry)) {
      for (let i = 0; i < entry.length; i++) {
        await page.waitForSelector(entry[i])
        await page.click(entry[i])
      }
      // In this case we need to close the selector
      await page.click(selector)
    } else {
      await page.waitForSelector(entry)
      await page.click(entry)
    }
    await page.waitForTimeout(wait)
    debug(`Clicked entry ${selector}`)
  } catch (error) {
    console.error(`select ${entry} in ${selector} failed.`)
  }
}

/* Helper function to input a text on a given selector
 * set enter to true to run the press 'Enter' key
 */
export async function type (page, selector, text, enter = false, replace = false, wait = 250) {
  try {
    await page.waitForSelector(selector, { timeout: 2000 })
    if (replace) {
      await page.click(selector, { clickCount: 3 })
      await page.keyboard.press('Backspace')
    } else {
      await page.click(selector)
    }
    await page.type(selector, text)
    if (enter) await page.keyboard.press('Enter')
    await page.waitForTimeout(wait)
  } catch (error) {
    console.error(`type ${text} in ${selector} failed.`)
  }
}

/* Helper function to upload a file on a given selector
 */
export async function uploadFile (page, selector, filePath, wait = 2000) {
  try {
    const element = await page.$(selector, { timeout: 2000 })
    await element.uploadFile(filePath)
    await page.waitForTimeout(wait)
  } catch (error) {
    console.error(`upload ${filePath} in ${selector} failed.`)
  }
}

/* Select an icon within the icon chooser
 */
export async function chooseIcon (page, name, color, wait = 1000) {
  const iconXpath = `//div[contains(@class, "q-dialog")]//i[contains(@class, "${name}")]`
  const icons = await page.$x(iconXpath)
  if (icons.length > 0) {
    icons[0].click()
    await page.waitForTimeout(250)
  }
  const colorXpath = `//div[contains(@class, "q-dialog")]//button[contains(@class, "${color}")]`
  const colors = await page.$x(colorXpath)
  if (colors.length > 0) {
    colors[0].click()
    await page.waitForTimeout(250)
  }
  await click(page, '.q-dialog #choose-button', wait)
}

/* Helper function that wait until all images are loaded
 */
export async function waitForImagesLoaded (page) {
  await page.evaluate(() => {
    const imageSelectors = Array.from(document.querySelectorAll('img'))
    const imgPromises = []
    imageSelectors.forEach((img) => {
      if (img.complete) return
      imgPromises.push(new Promise((resolve, reject) => {
        img.addEventListener('load', resolve)
        img.addEventListener('error', reject)
      }))
    })
    return Promise.all(imgPromises)
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
 * threshold is a value [0, 1], smaller values make the comparison more
 * sensitive.
 * diffFilename is the filename where the diff of the images will be written,
 * if null, no diff will be written
 */
export function compareImages (image1, image2, threshold, diffFilename) {
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
  if (diffFilename) fs.writeFileSync(diffFilename, png.PNG.sync.write(diff))
  return { diffRatio, diff }
}

/* Moves a slider in a choosen direction (right or left), for a specific times
 */
export async function moveSlider (page, action, direction, times, wait = 250) {
  const selector = `#${action}`;
  const dir = (direction === 'left') ? 'ArrowLeft':'ArrowRight';
  await page.focus(selector)
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(dir)
  }
  await page.waitForTimeout(wait)
}
