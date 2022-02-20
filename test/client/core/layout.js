import makeDebug from 'debug'
import { click, isElementVisible } from './utils'

const debug = makeDebug('kdk:core:test:layout')

async function clickOpener (page, opener) {
  const selector = `#${opener}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await page.waitForTimeout(500)
  debug(`Clicked opener ${selector}`)
}

export async function clickTopOpener (page) {
  await clickOpener(page, 'top')
}

export async function isTopPaneVisible (page) {
  return isElementVisible(page, '#top-panel')
}

export async function openTopPane (page) {
  const isOpen = await isTopPaneVisible(page)
  if (!isOpen) await clickTopOpener(page)
}

export async function closeTopPane (page) {
  const isOpen = await isTopPaneVisible(page)
  if (isOpen) await clickTopOpener(page)
}

export async function clickRightOpener (page) {
  await clickOpener(page, 'right')
}

export async function isRightPaneVisible (page) {
  return isElementVisible(page, '#right-panel')
}

export async function openRightPane (page) {
  const isOpen = await isRightPaneVisible(page)
  if (!isOpen) await clickRightOpener(page)
}

export async function closeRightPane (page) {
  const isOpen = await isRightPaneVisible(page)
  if (isOpen) await clickRightOpener(page)
}

export async function clickBottomOpener (page) {
  await clickOpener(page, 'bottom')
}

export async function isBottomPaneVisible (page) {
  return isElementVisible(page, '#bottom-panel')
}

export async function openBottomPane (page) {
  const isOpen = await isBottomPaneVisible(page)
  if (!isOpen) await clickBottomOpener(page)
}

export async function closeBottomPane (page) {
  const isOpen = await isBottomPaneVisible(page)
  if (isOpen) await clickBottomOpener(page)
}

export async function clickLeftOpener (page) {
  await clickOpener(page, 'left')
}

export async function isLeftPaneVisible (page) {
  return isElementVisible(page, '#left-panel')
}

export async function openLeftPane (page) {
  const isOpen = await isLeftPaneVisible(page)
  if (!isOpen) await clickLeftOpener(page)
}

export async function closeLeftPane (page) {
  const isOpen = await isLeftPaneVisible(page)
  if (isOpen) await clickLeftOpener(page)
}

export async function clickAction (page, action, wait = 250) {
  const selector = `#${action}`
  await click(page, selector, wait)
  debug(`Clicked action ${selector}`)
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
