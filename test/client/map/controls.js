import _ from 'lodash'
import { clickTopPaneAction, waitForImagesLoaded, getFromStore } from '../core'

export async function zoomTo (page, bbox) {
  const currentUrl = page.url()
  const regexp = /\/-?[0-9.]*\/-?[0-9.]*\/-?[0-9.]*\/-?[0-9.]*/
  let newUrl =  _.replace(currentUrl, regexp, '')
  newUrl += `/${bbox[0]}/${bbox[1]}/${bbox[2]}/${bbox[3]}`
  let response = await page.goto(newUrl)
  // see 
  // https://stackoverflow.com/questions/62343404/puppeteer-page-goto-not-working-for-query-parameters
  // 
  response = await page.goto(newUrl)
  response = await page.goto(newUrl)
}

export async function zoomToPosition (page, latitude, longitude) {
  const currentLocation = await getFromStore(page, 'geolocation.position')
  page.setGeolocation({ latitude, longitude })
  await clickTopPaneAction(page, 'locate-user')
  await waitForImagesLoaded(page)
  page.setGeolocation(currentLocation)
}
