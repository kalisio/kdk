import _ from 'lodash'
import * as core from '../core'

export function getLayerId (layer) {
  return 'layers-' + _.kebabCase(layer)
}

export async function getLayerCategoryId (page, layerId) {
  const xpath = `//div[contains(@class, "q-expansion-item q-item-type") and .//div[@id="${layerId}"]]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) return await (await elements[0].getProperty('id')).jsonValue()
  return undefined
}

export async function isLayerCategoryOpened (page, categoryId) {
  const selector = `#${categoryId} .q-expansion-item__content`
  return core.isElementVisible(page, selector)
}

export async function clickLayerCategory (page, categoryId, wait = 500) {
  const isCatalogOpened = await core.isRightPaneVisible(page)
  if (!isCatalogOpened) await core.clickRightOpener(page)
  await core.clickRightPaneAction(page, categoryId, wait)
}

export async function clickLayer (page, layer, wait = 1000) {
  const layerId = getLayerId(layer)
  console.log(layerId)
  const isCatalogOpened = await core.isRightPaneVisible(page)
  if (!isCatalogOpened) await core.clickRightOpener(page)
  const categoryId = await getLayerCategoryId(page, layerId)
  console.log(categoryId)
  let isCategoryOpened
  if (categoryId) {
    isCategoryOpened = await isLayerCategoryOpened(page, categoryId)
    if (!isCategoryOpened) await clickLayerCategory(page, categoryId)
  }
  let selector = `#${layerId}`
  if (categoryId !== 'k-catalog-panel-base-layers') selector += ' .q-toggle'
  await core.click(page, selector)
  if (categoryId) {
    if (!isCategoryOpened) await clickLayerCategory(page, categoryId)
  }
  if (!isCatalogOpened) await core.clickRightOpener(page)
  await core.waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function removeLayer (page, layer, wait = 1000) {
  const layerId = getLayerId(layer)
  const isCatalogOpened = await core.isRightPaneVisible(page)
  if (!isCatalogOpened) await core.clickRightOpener(page)
  const categoryId = await getLayerCategoryId(page, layerId)
  let isCategoryOpened
  if (categoryId) {
    isCategoryOpened = await isLayerCategoryOpened(page, categoryId)
    if (!isCategoryOpened) await clickLayerCategory(page, categoryId)
  }
  await core.click(page, `#${layer} .q-btn`)
  await core.clickAction(page, 'remove')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
  if (categoryId) {
    if (!isCategoryOpened) await clickLayerCategory(page, categoryId)
  }
}

export async function dropFile (page, filePath, wait = 2000) {
  const loaderSelector = '#dropFileInput'
  const loader = await page.$(loaderSelector)
  await loader.uploadFile(filePath)
  await page.waitForTimeout(wait)
}

export async function addLayer (page) {
  await core.clickFab(page)
  await core.clickAction(page, 'add-layer')
  await page.waitForTimeout(1000)
}

export async function importLayer (page, filePath, featureId = undefined, wait = 2000) {
  await addLayer(page)
  await core.uploadFile(page, '#file-field', filePath)
  if (featureId) {
    await core.click(page, '#featureId-field', 500)
    await core.click(page, `#${featureId}`, 500)
  }
  await core.clickAction(page, 'import-layer-action')
  await core.waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function connectLayer (page, service, layerId, wait = 2000) {
  await addLayer(page)
  await core.clickAction(page, 'connect-layer')
  await core.type(page, '#service-field', service, true, false, 5000)
  await core.click(page, '#layer-field', 500)
  await core.click(page, `#${layerId}`, 500)
  await core.clickAction(page, 'connect-layer-action', 2000)
  await core.waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function createLayer (page, layerName, schemaPath, featureId, wait = 2000) {
  await addLayer(page)
  await core.clickAction(page, 'create-layer')
  await core.type(page, '#name-field', layerName)
  await core.type(page, '#description-field', `${layerName} description`)
  await core.uploadFile(page, '#schema-field', schemaPath)
  await page.click(page, '#featureId-field', 500)
  await core.click(page, `#${featureId}`)
  await core.clickAction(page, 'create-layer-action', 1000)
  await page.waitForTimeout(wait)
}
