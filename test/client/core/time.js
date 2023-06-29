import makeDebug from 'debug'
import { setToStore } from './utils.js'

const debug = makeDebug('kdk:core:test:time')

export async function setCurrentTime(page, time) {
  await page.evaluate((time) => {
    window.$time.setCurrentTime(time)
  }, time)
}
