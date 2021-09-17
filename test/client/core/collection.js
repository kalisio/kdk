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
