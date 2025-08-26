import makeDebug from 'debug'
import fs from 'fs'
import png from 'pngjs'
import pixelmatch from 'pixelmatch'
import path from 'path'
import mime from 'mime'

const debug = makeDebug('kdk:core:test:utils')

// Default accuracy
export const GeolocationAccuracy = 500

/* Helper function to check wether an element exists
 * see: https://github.com/puppeteer/puppeteer/issues/545
 */
export async function elementExists (page, selector) {
  const exists = !!(await page.$(selector))
  debug(`[KDK] Element ${selector} ` + (exists ? 'exists' : 'does not exist'))
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
    const visible = (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && !(style.height === '0px' && style.width === '0px'))
    return visible
  }, selector)
}

/* Count the elements that match the given XPath expresion
 */
export async function countElements (page, xpath) {
  const elements = await page.$$('xpath/.' + xpath)
  if (elements) return elements.length
  return 0
}

export async function countChildren (page, selector) {
  const count = await page.$eval(selector, element => { return element?.children.length || 0 })
  return count
}

/* Helper function to click on a given selector
 */
export async function click (page, selector, wait = 500) {
  try {
    await page.locator(selector).setTimeout(2000).click()
    await waitForTimeout(wait)
    debug(`[KDK] Clicked target ${selector}`)
  } catch (error) {
    console.error(`[KDK] Click ${selector} failed.`)
  }
}

/* Helper function to hover on a given selector
 */
export async function hover (page, selector, wait = 500) {
  try {
    await page.locator(selector).setTimeout(2000).hover()
    await waitForTimeout(wait)
    debug(`[KDK] Hovered target ${selector}`)
  } catch (error) {
    console.error(`[KDK] Hover ${selector} failed.`)
  }
}

/* Helper function to check whether an action is visible
 */
export async function isActionVisible (page, action) {
  const selector = `#${action}`
  return isElementVisible(page, selector)
}

export async function containsText (page, selector, text) {
  return await page.$eval(selector, (element, text) => {
    return element ? element.textContent.includes(text) : false
  }, text)
}

/* Helper function to click on an action selector
 */
export async function clickAction (page, action, wait = 500) {
  const selector = `#${action}`
  await click(page, selector, wait)
  debug(`[KDK] Clicked action ${selector}`)
}

/* Helper function to click on a menuUtem selector
 */
export async function clickMenuItem (page, wait = 500) {
  const xpath = '(//div[@class="q-item__label"])'
  try {
    await page.waitForSelector('xpath/.' + xpath)
    await waitForTimeout(wait)
  } catch (error) {
    console.error(`[KDK] Click ${xpath} failed.`)
  }
}

/* Helper function to click on a given xpath
 */
export async function clickXPath (page, xpath, wait = 500) {
  try {
    await page.waitForSelector('xpath/.' + xpath, { timeout: 2000 })
    const elements = await page.$$('xpath/.' + xpath)
    if (elements.length > 0) {
      elements[0].click()
      await waitForTimeout(wait)
      debug(`[KDK] Clicked target ${xpath}`)
    }
  } catch (error) {
    console.error(`[KDK] Click ${xpath} failed.`)
  }
}

/* Helper function to click on a given selector then select given entry
 */
export async function clickSelect (page, selector, entry, wait = 500) {
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
    await waitForTimeout(wait)
    debug(`[KDK) Clicked entry ${selector}`)
  } catch (error) {
    console.error(`[KDK) Select ${entry} in ${selector} failed.`)
  }
}

/* Helper function to clear input a text on a given selector
   ! Not yet working !
 */
export async function clear (page, selector, wait = 500) {
  try {
    await page.waitForSelector(selector, { timeout: 2000 })
    await page.$eval(selector, element => { element.value = '' })
    await waitForTimeout(wait)
  } catch (error) {
    console.error(`[KDK] Clear ${selector} failed.`)
  }
}

/* Helper function to input a text on a given selector
 * set enter to true to run the press 'Enter' key
 */
export async function type (page, selector, text, enter = false, replace = false, wait = 500) {
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
    await waitForTimeout(wait)
  } catch (error) {
    console.error(`[KDK] Type ${text} in ${selector} failed.`)
  }
}

/* Helper function to input a text on a given XPath
 * set enter to true to run the press 'Enter' key
   ! Not yet working !
 */
export async function typeXPath (page, selector, text, enter = false, replace = false, wait = 500) {
  try {
    await page.waitForSelector('xpath/.' + selector, { timeout: 2000 })
    if (replace) {
      await page.clickXPath(selector, { clickCount: 3 })
      await page.keyboard.press('Backspace')
    } else {
      await page.clickXPath(selector)
    }
    await page.type(selector, text)
    if (enter) await page.keyboard.press('Enter')
    await waitForTimeout(wait)
  } catch (error) {
    console.error(`[KDK] Type ${text} in ${selector} failed.`)
  }
}

/* Helper function to upload a file on a given selector
 */
export async function uploadFile (page, selector, filePath, wait = 2000) {
  try {
    const element = await page.$(selector, { timeout: 2000 })
    await element.uploadFile(filePath)
    await waitForTimeout(wait)
  } catch (error) {
    console.error(`[KDK] Upload ${filePath} in ${selector} failed.`)
  }
}

/* Select an icon within the icon chooser
 */
export async function chooseIcon (page, name, color, wait = 1000) {
  const iconXpath = `//div[contains(@class, "q-dialog")]//i[contains(@class, "${name}")]`
  const icons = await page.$$('xpath/.' + iconXpath)
  if (icons.length > 0) {
    icons[0].click()
    await waitForTimeout(500)
  }
  const colorXpath = `//div[contains(@class, "q-dialog")]//button[contains(@class, "${color}")]`
  const colors = await page.$$('xpath/.' + colorXpath)
  if (colors.length > 0) {
    colors[0].click()
    await waitForTimeout(500)
  }
  await click(page, '.q-dialog #choose-button', wait)
}

/* Helper function that waits until all images are loaded
 */
export async function waitForImagesLoaded (page) {
  await page.evaluate(async () => {
    const imageSelectors = Array.from(document.querySelectorAll('img'))
    const imgPromises = []
    imageSelectors.forEach((img) => {
      if (img.complete) return
      imgPromises.push(new Promise((resolve, reject) => {
        img.addEventListener('load', resolve)
        img.addEventListener('error', reject)
      }))
    })
    await Promise.all(imgPromises)
  })
}

/* Helper function that waits for a set amount of time (in ms)
 */
export async function waitForTimeout (wait) {
  return await new Promise(resolve => {
    setTimeout(resolve, wait)
  })
}

/* Return the Store value corresponding to the given path
 */
export async function getFromStore (page, path) {
  const result = await page.evaluate((path) => {
    const value = window.$store.get(path)
    return value
  }, path)
  return result
}

/* Update the Store value corresponding to the given path
 */
export async function setToStore (page, path, value) {
  await page.evaluate((path, value) => {
    window.$store.patch(path, value)
  }, path, value)
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
export function compareImages (image1, image2, threshold) {
  const img1 = png.PNG.sync.read(fs.readFileSync(image1))
  const img2 = png.PNG.sync.read(fs.readFileSync(image2))
  const { width, height } = img1
  const diff = new png.PNG({ width, height })
  const options = {
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffColorAlt: [0, 255, 0],
    threshold
  }
  let numDiffs = width * height
  try {
    numDiffs = pixelmatch(img1.data, img2.data, diff.data, width, height, options)
  } catch (error) {
    console.error(`[KDK] Image comparison failed: ${error}`)
  }
  const ratio = 100.0 * (numDiffs / (width * height))
  return { ratio, data: diff }
}

/* Moves a slider in a chosen direction (right or left), for a specific times
 */
export async function moveSlider (page, action, direction, times, wait = 500) {
  const selector = `#${action} .q-slider__focus-ring`
  const key = (direction === 'left') ? 'ArrowLeft' : 'ArrowRight'
  await click(page, selector)
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key)
  }
  debug(`[KDK] Pressed ${key} ${times} times to move slider ${action}`)
  await waitForTimeout(wait)
}

/**
 * Move a range thumb (leftThumb or rightThumb) in a chosen direction (right or left), for a specific times
 */
export async function moveRange (page, action, target, direction, times, wait = 500) {
  target = ['leftThumb', 'rightThumb'].includes(target) ? target : 'leftThumb'
  const lastOfType = target === 'rightThumb' ? ':last-of-type' : ''
  const selector = `#${action} .q-slider__thumb${lastOfType} .q-slider__focus-ring`
  const key = (direction === 'left') ? 'ArrowLeft' : 'ArrowRight'

  await page.waitForSelector(selector, { timeout: 2000 })
  const element = await page.$(selector)
  const box = await element.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  await page.mouse.move(x, y)
  await page.mouse.down()

  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key)
  }

  await page.mouse.up()

  debug(`[KDK] Pressed ${key} ${times} times to move range ${action} (${target === 'rightThumb' ? 'right thumb' : 'left thumb'})`)
  await waitForTimeout(wait)
}

/**
 * Simulate drag & drop of files onto the target container
 * /!\ Target container needs 'dragenter' and 'drop' events
 */
export async function simulateFileDrop(page, target, dataPath, filePaths) {
  const fs = await import('fs')
  const fileData = []
  
  for (const filePath of filePaths) {
    const fullPath = path.join(dataPath, filePath)
    const content = fs.readFileSync(fullPath, 'utf8')
    const fileName = filePath.split('/').pop()
    const mimeType = mime.getType(fileName)
    fileData.push({ content, fileName, mimeType })
  }

  await page.evaluate(async (fileData, target) => {
    const DragOverlay = document.querySelector(target)
    if (!DragOverlay) throw new Error('DragOverlay component not found')
    
    const files = fileData.map(({ content, fileName, mimeType }) => {
      return new File([content], fileName, { type: mimeType })
    })

    const dataTransfer = new DataTransfer()
    files.forEach(file => dataTransfer.items.add(file))
    
    const dragEnterEvent = new DragEvent('dragenter', {
      bubbles: true,
      dataTransfer: dataTransfer
    })

    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      dataTransfer: dataTransfer
    })

    DragOverlay.dispatchEvent(dragEnterEvent)
    await setTimeout(() => {}, 500);
    DragOverlay.dispatchEvent(dropEvent)
  }, fileData, target)
}
