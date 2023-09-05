import makeDebug from 'debug'

const debug = makeDebug('kdk:core:test:time')

export async function setCurrentTime (page, time) {
  debug(`Setting current time to ${time}`)
  await page.evaluate((time) => {
    window.$time.setCurrentTime(time)
  }, time)
}
