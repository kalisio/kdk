import makeDebug from 'debug'
import { clickAction, countElements, isActionVisible, isElementVisible, waitForTimeout } from './utils.mjs'

const debug = makeDebug('kdk:core:test:layout')

export async function isHeaderVisible (page) {
  return isElementVisible(page, '#header-panel')
}

export async function isFooterVisible (page) {
  return isElementVisible(page, '#footer-panel')
}

export async function clickOpener (page, placement) {
  const selector = `#${placement}-opener`
  await page.evaluate((selector) => document.querySelector(selector).click(), selector)
  await waitForTimeout(500)
}

export async function isPaneVisible (page, placement) {
  return isElementVisible(page, `#${placement}-panel`)
}

export async function openPane (page, placement) {
  const isOpen = await isPaneVisible(page, placement)
  if (!isOpen) {
    debug(`Opening ${placement} pane`)
    await clickOpener(page, placement)
  }
}

export async function closePane (page, placement) {
  const isOpen = await isPaneVisible(page, placement)
  if (isOpen) {
    debug(`Closing ${placement} pane`)
    await clickOpener(page, placement)
  }
}

// Click a serie of actions in a pane and close it if it was previously closed
// once all actions have been clicked (useful for overflow menus for instance).
export async function clickPaneActions (page, placement, actions, wait) {
  const isPaneVisible = await isElementVisible(page, `#${placement}-panel`)
  if (!isPaneVisible) {
    debug(`Opening ${placement} pane`)
    await clickOpener(page, placement)
  }
  for (let i = 0; i < actions.length; i++) {
    await clickAction(page, actions[i], wait)
  }
  // Left pane closes automatically on action click
  if (!isPaneVisible && placement !== 'left') {
    debug(`Closing ${placement} pane`)
    await clickOpener(page, placement)
  }
}

// Click a single action in a pane and close it if it was previously closed.
export async function clickPaneAction (page, placement, action, wait) {
  await clickPaneActions(page, placement, [action], wait)
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

async function clickWindowControl (page, placement, control) {
  const action = `${control}-${placement}-window`
  if (!await isActionVisible(page, action)) await clickAction(page, 'window-controls')
  await clickAction(page, action)
}

export async function closeWindow (page, placement) {
  await clickWindowControl(page, placement, 'close')
}

export async function maximizeWindow (page, placement) {
  await clickWindowControl(page, placement, 'maximize')
}

export async function restoreWindow (page, placement) {
  await clickWindowControl(page, placement, 'restore')
}

export async function pinWindow (page, placement) {
  await clickWindowControl(page, placement, 'pin')
}

export async function unpinWindow (page, placement) {
  await clickWindowControl(page, placement, 'unpin')
}

export async function clickFab (page) {
  return clickAction(page, 'fab')
}

export async function clickFabAction (page, action) {
  await clickAction(page, 'fab')
  return clickAction(page, action)
}

export async function countFabActions (page) {
  return countElements(page, '//a[contains(@class, "k-action-fab-action")]')
}

export async function logout (page) {
  await clickPaneAction(page, 'left', 'logout-action', 1000)
}
