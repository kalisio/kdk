
import { clickLeftOpener, clickAction } from './layout'

export * from './utils'
export * from './layout'


const baseUrl = process.env.APP_URL || (process.env.CLIENT_PORT ? 'http://localhost:' + process.env.CLIENT_PORT : (process.env.NODE_ENV === 'production' ? 'http://localhost:8081' : 'http://localhost:8082'))
export const getUrl = (path) => path ? baseUrl + '/#/' + path : baseUrl

console.log('APP_URL:', process.env.APP_URL)
console.log('CLIENT_PORT:', process.env.CLIENT_PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log(baseUrl)

export async function login (page, email, password) {
  await page.waitForSelector('#email-field')
  await page.type('#email-field', email)
  await page.waitForSelector('#password-field')
  await page.type('#password-field', password)
  await page.waitForSelector('button')
  await page.click('button')
  await page.waitForTimeout(2000)
}

export async function logout (page) {
  await clickLeftOpener(page)
  await clickAction(page, 'logout')
  await page.waitForTimeout(1000)
}

export async function capture (page, name) {
  await page.screenshot({
    path: `./test/data/screenshots/${name}.png`,
    fullPage: true,
    type: 'png'
  })
}
