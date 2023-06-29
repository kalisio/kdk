import makeDebug from 'debug'

const debug = makeDebug('kdk:core:test:time')

export async function setCurrentTime (page, time) {
  await page.evaluate((time) => {
    debug(`Setting current time to ${time}`)
    window.$time.setCurrentTime(time)
  }, time)
}
