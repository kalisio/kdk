import _ from 'lodash'
import * as core from '../core/index.js'

export function getLayerId (layer) {
  return 'layers-' + _.kebabCase(layer)
}

export async function getLayerCategoryId (page, layerId) {
  const xpath = `//div[contains(@class, "q-expansion-item q-item-type") and .//div[@id="${layerId}"]]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) return (await elements[0].getProperty('id')).jsonValue()
  return undefined
}

export async function isLayerCategoryOpened (page, categoryId) {
  const selector = `#${categoryId} .q-expansion-item__content`
  return core.isElementVisible(page, selector)
}

export async function clickCatalogTab (page, tabId, wait) {
  const isCatalogOpened = await core.isPaneVisible(page, 'right')
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  await core.click(page, `#${tabId}`, wait)
  return isCatalogOpened
}

export async function clickLayerCategory (page, tabId, categoryId, wait = 500) {
  await clickCatalogTab(page, tabId)
  await core.clickPaneAction(page, 'right', categoryId, wait)
}

export async function layerExists (page, tabId, layer) {
  const isCatalogOpened = await clickCatalogTab(page, tabId)
  const layerId = getLayerId(layer)
  const exists = await core.elementExists(page, `#${layerId}`)
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  return exists
}

export async function clickLayer (page, tabId, layer, wait = 1000) {
  const isCatalogOpened = await clickCatalogTab(page, tabId)
  const layerId = getLayerId(layer)
  const categoryId = await getLayerCategoryId(page, layerId)
  let isCategoryOpened
  if (categoryId) {
    isCategoryOpened = await isLayerCategoryOpened(page, categoryId)
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 1000)
  }
  let selector = `#${layerId} .q-toggle`
  // some layers have a toggle (regular layers), some don't (base layers)
  if (!await core.elementExists(page, selector)) {
    selector = `#${layerId}`
  }
  await core.click(page, selector)
  if (categoryId) {
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 500)
  }
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  await page.waitForNetworkIdle()
  await page.waitForTimeout(wait)
}

export async function zoomToLayer (page, tabId, layer, wait = 1000) {
  const isCatalogOpened = await clickCatalogTab(page, tabId)
  const layerId = getLayerId(layer)
  const categoryId = await getLayerCategoryId(page, layerId)
  let isCategoryOpened
  if (categoryId) {
    isCategoryOpened = await isLayerCategoryOpened(page, categoryId)
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 1000)
  }
  await core.click(page, `#${layer}-actions`)
  await core.clickAction(page, 'zoom-to-layer')
  if (categoryId) {
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 500)
  }
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  await page.waitForTimeout(wait)
}

export async function saveLayer (page, tabId, layer, wait = 1000) {
  const isCatalogOpened = await clickCatalogTab(page, tabId)
  const layerId = getLayerId(layer)
  const categoryId = await getLayerCategoryId(page, layerId)
  let isCategoryOpened
  if (categoryId) {
    isCategoryOpened = await isLayerCategoryOpened(page, categoryId)
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 1000)
  }
  await core.click(page, `#${layer}-actions`)
  await core.clickAction(page, 'save-layer')
  if (categoryId) {
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 500)
  }
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  await page.waitForTimeout(wait)
}

export async function removeLayer (page, tabId, layer, wait = 1000) {
  const isCatalogOpened = await clickCatalogTab(page, tabId)
  const layerId = getLayerId(layer)
  const categoryId = await getLayerCategoryId(page, layerId)
  let isCategoryOpened
  if (categoryId) {
    isCategoryOpened = await isLayerCategoryOpened(page, categoryId)
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 1000)
  }
  await core.click(page, `#${layer}-actions`)
  await core.clickAction(page, 'remove-layer')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
  if (categoryId) {
    if (!isCategoryOpened) await core.clickPaneAction(page, 'right', categoryId, 500)
  }
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  await page.waitForTimeout(wait)
}

export async function dropFile (page, filePath, wait = 2000) {
  const loaderSelector = '#dropFileInput'
  const loader = await page.$(loaderSelector)
  await loader.uploadFile(filePath)
  await page.waitForNetworkIdle()
  await page.waitForTimeout(wait)
}

export async function addLayer (page) {
  await core.clickFab(page)
  await core.clickAction(page, 'add-layer')
  await page.waitForTimeout(1000)
}

export async function addView (page) {
  await core.clickFab(page)
  await core.clickAction(page, 'create-view')
  await page.waitForTimeout(1000)
}

export async function addProject (page) {
  await core.clickFab(page)
  await core.clickAction(page, 'create-project')
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
  await page.waitForNetworkIdle()
  await page.waitForTimeout(wait)
}

export async function connectLayer (page, service, layerId, layerName, wait = 2000) {
  await addLayer(page)
  await core.clickAction(page, 'connect-layer')
  await core.type(page, '#service-field', service, true, false, 5000)
  await core.click(page, '#layer-field', 500)
  if (layerName) await core.type(page, '#layer-field', layerName)
  await core.click(page, `#${layerId}`, 500)
  await core.clickAction(page, 'connect-layer-action', 2000)
  await page.waitForNetworkIdle()
  await page.waitForTimeout(wait)
}

export async function createLayer (page, layerName, schemaPath, featureId, wait = 2000) {
  await addLayer(page)
  await core.clickAction(page, 'create-layer', 2000)
  await core.type(page, '#name-field', layerName)
  await core.type(page, '#description-field', `${layerName} description`)
  await core.uploadFile(page, '#schema-field', schemaPath)
  await core.click(page, '#featureId-field', 500)
  await core.click(page, `#${featureId}`, 500)
  await core.clickAction(page, 'create-layer-action', 1000)
  await page.waitForTimeout(wait)
}

export async function createView (page, name, saveLayers, wait = 2000) {
  await addView(page)
  await core.type(page, '#name-field', name)
  await core.type(page, '#description-field', `${name} description`)
  if (saveLayers) await core.click(page, '#layers-field .q-toggle')
  await core.clickAction(page, 'apply-button', 1000)
  await page.waitForTimeout(wait)
}

export async function viewExists (page, tabId, name) {
  const isCatalogOpened = await clickCatalogTab(page, tabId, 2000)
  const exists = await core.itemExists(page, 'catalog/KViewSelector', name)
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  return exists
}

export async function clickView (page, tabId, name) {
  const isCatalogOpened = await clickCatalogTab(page, tabId, 2000)
  await core.clickItem(page, 'catalog/KViewSelector', name)
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  await page.waitForNetworkIdle()
}

export async function removeView (page, tabId, name) {
  const isCatalogOpened = await clickCatalogTab(page, tabId, 2000)
  await core.clickItemAction(page, 'catalog/KViewSelector', name, 'view-overflowmenu', 1000)
  await core.clickAction(page, 'remove-view', 1000)
  await core.click(page, '.q-dialog button:nth-child(2)', 1000)
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
}

export async function createProject (page, name, options, wait = 2000) {
  const { categories, layers, views } = options
  await addProject(page)
  await core.type(page, '#name-field', name)
  await core.type(page, '#description-field', `${name} description`)
  // Open categories first
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    await core.clickXPath(page, `//div[contains(text(), "${category}")]`)
  }
  // Then select layers
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await core.clickXPath(page, `//div[contains(text(), "${layer}")]/../../preceding-sibling::div[contains(@class, "q-checkbox")]`)
  }
  if (views) {
    for (let i = 0; i < views.length; i++) {
      const view = views[i]
      await core.clickXPath(page, `//div[contains(text(), "${view}")]/../../preceding-sibling::div[contains(@class, "q-checkbox")]`)
    }
  }
  await core.clickAction(page, 'apply-button', 1000)
  await page.waitForTimeout(wait)
}

export async function projectExists (page, tabId, name) {
  const isCatalogOpened = await clickCatalogTab(page, tabId, 2000)
  const exists = await core.itemExists(page, 'catalog/KProjectSelector', name)
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
  return exists
}

export async function clickProject (page, tabId, name) {
  const isCatalogOpened = await clickCatalogTab(page, tabId, 2000)
  await core.clickItem(page, 'catalog/KProjectSelector', name)
  // Switching to project automatically closes the catalog tab
  if (isCatalogOpened) await core.clickOpener(page, 'right')
  await page.waitForNetworkIdle()
}

export async function switchProject (page, name, wait = 2000) {
  await core.click(page, '#project-menu', 2000)
  await core.clickXPath(page, `//div[contains(@component, "collection/KItem") and contains(., "${name}")]`, 1000)
  await page.waitForNetworkIdle()
  await page.waitForTimeout(wait)
}

export async function closeProject (page, wait = 2000) {
  await core.click(page, '#close-project')
  await page.waitForNetworkIdle()
  await page.waitForTimeout(wait)
}

export async function removeProject (page, tabId, name) {
  const isCatalogOpened = await clickCatalogTab(page, tabId, 2000)
  await core.clickItemAction(page, 'catalog/KProjectSelector', name, 'project-overflowmenu', 1000)
  await core.clickAction(page, 'remove-project', 1000)
  await core.click(page, '.q-dialog button:nth-child(2)', 1000)
  if (!isCatalogOpened) await core.clickOpener(page, 'right')
}
