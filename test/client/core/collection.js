import { countElements } from './utils'


export async function countItems (page) {
  return countElements(page, `//div[contains(@class, "q-page")]//div[contains(@class, "q-item-type")]`)
}

export async function countCards (page) {
  return countElements(page, `//div[contains(@class, "q-page")]//div[contains(@class, "q-card")]`)
}

export async function itemExists (page, name) {
  const xpath = `//div[contains(@class, "q-page")]//div[contains(@class, "q-item-type") and contains(., "${name}")]`
  const elements = await page.$x(xpath)
  return elements.length === 1
}

export async function cardExists (page, name) {
  const xpath = `//div[contains(@class, "q-page")]//div[contains(@class, "q-card") and contains(., "${name}")]`
  const elements = await page.$x(xpath)
  return elements.length === 1
}

export async function clickItemAction (page, name, action, wait = 250) {
  const xpath = `//div[contains(@class, "q-page")]//div[contains(@class, "q-item-type") and contains(., "${name}")]//button[@id="${action}"]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
  }
}

export async function clickCardAction (page, name, action, wait = 250) {
  const xpath = `//div[contains(@class, "q-page")]//div[contains(@class, "q-card") and contains(., "${name}")]//button[@id="${action}"]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
  }
}

export async function isCardExpanded (page, name) {
  const xpath = `//div[contains(@class, "q-page")]//div[contains(@class, "q-card") and contains(., "${name}")]//i[contains(@class, "la-angle-up")]`
  const elements = await page.$x(xpath)
  return elements.length > 0
}

export async function expandCard (page, name) {
  let isExpanded = await isCardExpanded(page, name)
  if (!isExpanded) await clickCardAction(page, name, 'expand-action', 1000)
}

export async function shrinkCard (page, name) {
  let isExpanded = await isCardExpanded(page, name)
  if (isExpanded) await clickCardAction(page, name, 'expand-action', 1000)
}