import { click, type } from './utils'

export async function login (page, email, password, wait = 2000) {
  await type(page, '#email-field', email)
  await type(page, '#password-field', password)
  await click(page, 'button')
  await page.waitForTimeout(wait)
}
