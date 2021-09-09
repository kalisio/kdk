import { waitForImagesLoaded } from '../core'

export async function clickLayerCategory (page, category, wait = 500) {
  const selector = `#KCatalogPanel\\.${category}`
  await page.waitForSelector(selector)
  await page.click(selector)
  await page.waitForTimeout(wait)
}

export async function clickBaseLayer (page, layer, wait = 1000) {
  const selector = `#Layers\\.${layer}`
  await page.waitForSelector(selector)
  await page.click(selector)
  await waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function clickLayer (page, layer, wait = 1000) {
  const selector = `#Layers\\.${layer} .q-item__label`
  await page.waitForSelector(selector)
  await page.click(selector)
  await waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}
