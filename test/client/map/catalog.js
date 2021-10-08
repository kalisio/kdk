import _ from 'lodash'
import * as core from '../core'

export function getSystemLayerCategoryId (category) {
  return 'k-catalog-panel-' + _.kebabCase(category)
}

export function getSystemLayerId (layer) {
  return 'layers-' + _.kebabCase(layer)
}

export async function isLayerCategoryOpened (page, category) {
  const selector = `#${category} .q-expansion-item__content`
  return core.isElementVisible(page, selector)
}

export async function clickLayerCategory (page, category, wait = 500) {
  await core.clickRightPaneAction(page, category, wait)
}

export async function clickBaseLayer (page, layer, wait = 1000) {
  const baseLayersCategoryId = getSystemLayerCategoryId('BASE_LAYERS')
  const isCatalogOpened = await core.isRightPaneVisible(page)
  if (!isCatalogOpened) await core.clickRightOpener(page)
  const isCategoryOpened = await isLayerCategoryOpened(page, baseLayersCategoryId)
  if (!isCategoryOpened) await clickLayerCategory(page, baseLayersCategoryId)
  const selector = '#' + getSystemLayerId(layer)
  await core.click(page, selector)
  if (!isCategoryOpened) await clickLayerCategory(page, baseLayersCategoryId)
  if (!isCatalogOpened) await core.clickRightOpener(page)
  await core.waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function clickLayer (page, layer, category = null, wait = 1000) {
  const isCatalogOpened = await core.isRightPaneVisible(page)
  if (!isCatalogOpened) await core.clickRightOpener(page)
  let isCategoryOpened
  if (category) {
    isCategoryOpened = await isLayerCategoryOpened(page, category)
    if (!isCategoryOpened) await clickLayerCategory(page, category)
  }
  const selector = `#${layer} .q-toggle`
  await core.click(page, selector)
  if (category) {
    if (!isCategoryOpened) await clickLayerCategory(page, category)
  }
  if (!isCatalogOpened) await core.clickRightOpener(page)
  await core.waitForImagesLoaded(page)
  await page.waitForTimeout(wait)
}

export async function dropFile (page, filePath, wait = 2000) {
  const loaderSelector = '.leaflet-control-filelayer input[type="file"]'
  const loader = await page.$(loaderSelector)
  await loader.uploadFile(filePath)
  await page.waitForTimeout(wait)
}

export async function addLayer (page) {
  await core.clickFab(page)
  await core.clickAction(page, 'add-layer')
  await page.waitForTimeout(1000)
}

export async function importLayer (page, filePath, featureId, wait = 2000) {
  await addLayer(page)
  await core.uploadFile(page, '#file-field', filePath)
  await core.click(page, '#featureId-field', 500)
  await core.click(page, `#${featureId}`, 500)
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
