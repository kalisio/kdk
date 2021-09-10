import { waitForImagesLoaded, isRightPaneVisible, clickRightOpener, click, isElementVisible } from '../core'

export function getSystemLayerCategoryId (category) {
  return 'KCatalogPanel\\.' + category
}

export function getSystemLayerId (layer) {
  return 'Layers\\.' + layer
}

export async function isLayerCategoryOpened (page, category) {
  const selector = `#${category} .q-expansion-item__content`
  return isElementVisible(page, selector)
}

export async function clickLayerCategory (page, category, wait = 500) {
  const selector = `#${category}`
  await click(page, selector)
  await page.waitForTimeout(wait)
}

export async function clickBaseLayer (page, layer, wait = 1000) {
  const baseLayersCategoryId = getSystemLayerCategoryId('BASE_LAYERS')
  const isCatalogOpened = await isRightPaneVisible(page)
  if (!isCatalogOpened) await clickRightOpener(page)
  const isCategoryOpened = await isLayerCategoryOpened(page, baseLayersCategoryId)
  if (!isCategoryOpened) await clickLayerCategory(page, baseLayersCategoryId)
  const selector = '#' + getSystemLayerId(layer)
  await click(page, selector)
  if (!isCategoryOpened) await clickLayerCategory(page, baseLayersCategoryId)
  if (!isCatalogOpened) await clickRightOpener(page)
  await waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function clickLayer (page, layer, category = null, wait = 1000) {
  const isCatalogOpened = await isRightPaneVisible(page)
  if (!isCatalogOpened) await clickRightOpener(page)
  let isCategoryOpened
  if (category) {
    isCategoryOpened = await isLayerCategoryOpened(page, category)
    if (!isCategoryOpened) await clickLayerCategory(page, category)
  }
  const selector = `#${layer} .q-item__label`
  await click(page, selector)
  if (category) {
    if (!isCategoryOpened) await clickLayerCategory(page, category)
  }
  if (!isCatalogOpened) await clickRightOpener(page)
  await waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}
