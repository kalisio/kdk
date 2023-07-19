import makeDebug from 'debug'
import * as core from '../core/index.js'

const debug = makeDebug('kdk:map:test:time')

export async function openTimeline (page) {
  const isTimelineOpened = await core.isPaneVisible(page, 'bottom')
  if (!isTimelineOpened) await core.clickOpener(page, 'bottom')
  return isTimelineOpened
}

export async function clickTimelineHour (page, hour, wait = 1000) {
  const isTimelineOpened = await openTimeline(page)
  const xpath = `//div[contains(., "${hour}h") and contains(@class, "k-timeline-hour-frame")]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
    debug(`Clicked timeline hour ${hour}`)
  } else {
    debug(`Timeline hour ${hour} not found`)
  }
  if (!isTimelineOpened) await core.clickOpener(page, 'bottom')
}
