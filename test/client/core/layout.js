import { isElementVisible } from './utils'

async function clickOpener (page, opener, wait = 500) {
  const selector = `#${opener}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await page.waitForTimeout(wait)
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

export async function clickFab (page) {
  return clickAction(page, 'fab')
}

export async function closeWelcomeDialog (page) {
  const selector = '.q-dialog .q-card button[type=button]'
  await page.waitForSelector(selector)
  await page.click(selector)
}

export async function clickAction (page, action) {
  const selector = `#${action}`
  await page.waitForSelector(selector)
  await page.click(selector)
}

export async function logout (page) {
  await clickLeftOpener(page)
  await clickAction(page, 'logout')
  await page.waitForTimeout(1000)
}
