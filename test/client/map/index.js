export async function clickLayerCategory (page, category) {
  const selector = `#KCatalogPanel\\.${category}`
  await page.waitForSelector(selector)
  await page.click(selector)
}

export async function clickBaseLayer (page, layer) {
  const selector = `#Layers\\.${layer}`
  await page.waitForSelector(selector)
  await page.click(selector)
}

export async function clickLayer (page, layer) {
  const selector = `#Layers\\.${layer} .q-item__label`
  await page.waitForSelector(selector)
  await page.click(selector)
}
