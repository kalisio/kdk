import makeDebug from 'debug'
import { countElements } from './utils.mjs'

const debug = makeDebug('kdk:core:test:collection')

export async function countItems (page, component) {
  return countElements(page, `//div[contains(@component, "${component}")]`)
}

export async function itemExists (page, component, name) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]`
  const elements = await page.$x(xpath)
  return elements.length === 1
}

export async function itemActionExists (page, component, name, action) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]//button[@id="${action}"]`
  const elements = await page.$x(xpath)
  return elements.length === 1
}

export async function clickItem (page, component, name, wait = 500) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
    debug(`Clicked item ${name}`)
  } else {
    debug(`Item ${name} not found`)
  }
}

export async function clickItemAction (page, component, name, action, wait = 500) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]//button[@id="${action}"]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
    debug(`Clicked action ${action} on item ${name}`)
  } else {
    debug(`Action ${action} on item ${name} not found`)
  }
}

export async function isCardExpanded (page, component, name) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]//i[contains(@class, "la-angle-up")]`
  const elements = await page.$x(xpath)
  return elements.length > 0
}

export async function expandCard (page, component, name, wait = 1000) {
  const isExpanded = await isCardExpanded(page, component, name)
  if (!isExpanded) {
    await clickItemAction(page, component, name, 'expand-action', wait)
  }
}

export async function shrinkCard (page, component, name) {
  const isExpanded = await isCardExpanded(page, component, name)
  if (isExpanded) {
    await clickItemAction(page, component, name, 'expand-action', 1000)
  }
}
