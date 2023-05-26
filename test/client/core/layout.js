import { click, clickAction, isElementVisible } from './utils.js'

export async function isHeaderVisible (page) {
  return isElementVisible(page, '#header-panel')
}

export async function isFooterVisible (page) {
  return isElementVisible(page, '#footer-panel')
}

export async function clickOpener (page, placement) {
  const selector = `#${placement}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await page.waitForTimeout(500)
}

export async function isPaneVisible (page, placement) {
  return isElementVisible(page, `#${placement}-panel`)
}

export async function openPane (page, placemeent) {
  const isOpen = await isPaneVisible(page, placemeent)
  if (!isOpen) await clickOpener(page, placemeent)
}

export async function closePane (page, placement) {
  const isOpen = await isPaneVisible(page, placement)
  if (isOpen) await clickOpener(page, placement)
}

export async function clickPaneAction (page, placement, action, wait) {
  const isPaneVisible = await isElementVisible(page, `#${placement}-panel`)
  if (!isPaneVisible) await clickOpener(page, placement)
  await clickAction(page, action, wait)
  if (!isPaneVisible && placement !== 'left') await clickOpener(page, placement)
}

export async function isWindowVisible (page, placement) {
  return isElementVisible(page, `#${placement}-window`)
}

export async function isWindowPinned (page, placement) {
  const canPin = await isElementVisible(page, `#pin-${placement}-window`)
  return !canPin
}

export async function isWindowFloating (page, placement) {
  const canMaximize = await isElementVisible(page, `#maximize-${placement}-window`)
  const canPin = await isElementVisible(page, `#pin-${placement}-window`)
  return canMaximize && canPin
}

export async function isWindowMaximized (page, placement) {
  return isElementVisible(page, `#restore-${placement}-window`)
}

export async function closeWindow (page, placement) {
  await clickAction(page, `close-${placement}-window`)
}

export async function maximizeWindow (page, placement) {
  await clickAction(page, `maximize-${placement}-window`)
}

export async function restoreWindow (page, placement) {
  await clickAction(page, `restore-${placement}-window`)
}

export async function pinWindow (page, placement) {
  await clickAction(page, `pin-${placement}-window`)
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
  await clickPaneAction(page, 'left', 'logout', 1000)
}
