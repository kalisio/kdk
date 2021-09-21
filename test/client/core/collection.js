import { countElements } from './utils'

export async function countItems (page, component) {
  return countElements(page, `//div[contains(@component, "${component}")]`)
}

export async function itemExists (page, component, name) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]`
  const elements = await page.$x(xpath)
  return elements.length === 1
}

export async function clickItemAction (page, component, name, action, wait = 250) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]//button[@id="${action}"]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
  }
}

export async function isCardExpanded (page, component, name) {
  const xpath = `//div[contains(@component, "${component}") and contains(., "${name}")]//i[contains(@class, "la-angle-up")]`
  const elements = await page.$x(xpath)
  return elements.length > 0
}

export async function expandCard (page, component, name) {
  const isExpanded = await isCardExpanded(page, component, name)
  if (!isExpanded) {
    await clickItemAction(page, component, name, 'expand-action', 1000)
  }
}

export async function shrinkCard (page, component, name) {
  const isExpanded = await isCardExpanded(page, component, name)
  if (isExpanded) {
    await clickItemAction(page, component, name, 'expand-action', 1000)
  }
}
