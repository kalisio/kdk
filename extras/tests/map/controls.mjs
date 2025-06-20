import _ from 'lodash'
import makeDebug from 'debug'

import * as core from '../core/index.mjs'

const debug = makeDebug('kdk:map:test:controls')

export async function zoomToExtent (page, bbox, wait = 2000) {
  const currentUrl = page.url()
  const regexp = /\/-?[0-9.]*\/-?[0-9.]*\/-?[0-9.]*\/-?[0-9.]*/
  let newUrl = _.replace(currentUrl, regexp, '')
  newUrl += `/${bbox[0]}/${bbox[1]}/${bbox[2]}/${bbox[3]}`
  // see https://stackoverflow.com/questions/62343404/puppeteer-page-goto-not-working-for-query-parameters
  // and from the documentation: https://pptr.dev/#?product=Puppeteer&version=v10.2.0&show=api-pagegotourl-options
  // NOTE page.goto either throws an error or returns a main resource response. The only exceptions are navigation to
  // about:blank or navigation to the same URL with a different hash, which would succeed and return null.
  await page.goto(newUrl)
  await page.goto(newUrl)
  await page.waitForNetworkIdle()
  await core.waitForTimeout(wait)
}

// Accuracy is required to get some desired behaviours
export async function goToPosition (page, latitude, longitude, accuracy = core.GeolocationAccuracy) {
  const previousLocation = await core.getFromStore(page, 'geolocation.location')
  let location = { latitude, longitude, accuracy }
  debug(`Setting current geolocation to (${location.longitude}, ${location.latitude}) with accuracy ${location.accuracy}`)
  await page.setGeolocation(location)
  await core.clickPaneAction(page, 'top', 'locate-user')
  await page.waitForNetworkIdle()
  if (previousLocation) {
    location = {
      latitude: _.get(previousLocation, 'geometry.coordinates[1]'),
      longitude: _.get(previousLocation, 'geometry.coordinates[0]'),
      accuracy: _.get(previousLocation, 'properties.accuracy')
    }
    debug(`Restoring current geolocation to (${location.longitude}, ${location.latitude}) with accuracy ${location.accuracy}`)
    await page.setGeolocation(location)
  }
  await core.clickPaneAction(page, 'top', 'locate-user')
}
