import _ from 'lodash'
import { clickTopPaneAction, waitForImagesLoaded, getFromStore } from '../core'

export async function zoomToExtent (page, bbox) {
  const currentUrl = page.url()
  const regexp = /\/-?[0-9.]*\/-?[0-9.]*\/-?[0-9.]*\/-?[0-9.]*/
  let newUrl =  _.replace(currentUrl, regexp, '')
  newUrl += `/${bbox[0]}/${bbox[1]}/${bbox[2]}/${bbox[3]}`
  // see https://stackoverflow.com/questions/62343404/puppeteer-page-goto-not-working-for-query-parameters
  // and from the documentation: https://pptr.dev/#?product=Puppeteer&version=v10.2.0&show=api-pagegotourl-options
  // NOTE page.goto either throws an error or returns a main resource response. The only exceptions are navigation to 
  // about:blank or navigation to the same URL with a different hash, which would succeed and return null.
  await page.goto(newUrl)
  await page.goto(newUrl)
}

export async function zoomToPosition (page, latitude, longitude) {
  const currentLocation = await getFromStore(page, 'geolocation.position')
  page.setGeolocation({ latitude, longitude })
  await clickTopPaneAction(page, 'locate-user')
  await waitForImagesLoaded(page)
  page.setGeolocation(currentLocation)
}
