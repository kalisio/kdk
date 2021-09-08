import { isElementVisible } from './utils'

async function clickOpener (page, opener) {
  const selector = `#${opener}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await page.waitForTimeout(1000)
}

export async function clickTopOpener (page) {
  await clickOpener(page, 'top')
}

export async function clickRightOpener (page) {
  await clickOpener(page, 'right')
}

export async function clickBottomOpener (page) {
  await clickOpener(page, 'bottom')
}

export async function clickLeftOpener (page) {
  await clickOpener(page, 'left')
}

export async function isTopPaneVisible (page) {
  return isElementVisible(page, '#top-panel')
}

export async function isRightPaneVisible (page) {
  return isElementVisible(page, '#right-panel')
}

export async function isBottomPaneVisible (page) {
  return isElementVisible(page, '#bottom-panel')
}

export async function isLeftPaneVisible (page) {
  return isElementVisible(page, '#left-panel')
}

export async function clickAction (page, action) {
  const selector = `#${action}`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
}

export async function closeWelcomeDialog (page) {
  const selector = '.q-dialog .q-card button[type=button]'
  await page.waitForSelector(selector)
  await page.click(selector)
}
