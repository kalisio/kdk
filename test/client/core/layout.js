import { click, isElementVisible } from './utils'

async function clickOpener (page, opener) {
  const selector = `#${opener}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await page.waitForTimeout(500)
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

export async function clickAction (page, action, wait = 250) {
  const selector = `#${action}`
  await click(page, selector, wait)
}

async function clickPaneAction (page, pane, action, wait) {
  const isPaneVisible = await isElementVisible(page, `#${pane}-panel`)
  if (!isPaneVisible) await clickOpener(page, pane)
  await clickAction(page, action, wait)
  if (!isPaneVisible) await clickOpener(page, pane)
}

export async function clickTopPaneAction (page, action, wait = 250) {
  await clickPaneAction(page, 'top', action, wait)
}

export async function clickRightPaneAction (page, action, wait = 250) {
  await clickPaneAction(page, 'right', action, wait)
}

export async function clickBottomPaneAction (page, action, wait = 250) {
  await clickPaneAction(page, 'bottom', action, wait)
}

export async function clickLeftPaneAction (page, action, wait = 250) {
  const isPaneVisible = await isLeftPaneVisible(page)
  if (!isPaneVisible) await clickLeftOpener(page)
  await clickAction(page, action, wait)
}

export async function clickFab (page) {
  return clickAction(page, 'fab')
}

export async function closeWelcomeDialog (page) {
  await click(page, '.q-dialog #close-button')
}

export async function isToastVisible (page) {
  return isElementVisible(page, '[role="alert"]')
}

export async function logout (page) {
  await clickLeftPaneAction(page, 'logout', 1000)
}
