import makeDebug from 'debug'
import { click, type } from './utils'

const debug = makeDebug('kdk:core:test:screens')

export async function goToLoginScreen (page) {
  await Promise.all([
    click(page, '#login-link'),
    page.waitForNavigation()
  ])
  debug('Login screen ready')
}

export async function login (page, user, wait = 3000) {
  await type(page, '#email-field', user.email)
  await type(page, '#password-field', user.password)
  await click(page, 'button', wait)
  await page.waitForNavigation()
}

export async function goToRegisterScreen (page) {
  await Promise.all([
    click(page, '#register-link'),
    page.waitForNavigation()
  ])
  debug('Register screen ready')
}

export async function register (page, user, wait = 5000) {
  await type(page, '#name-field', user.name)
  await type(page, '#email-field', user.email)
  await type(page, '#password-field', user.password)
  await type(page, '#confirmPassword-field', user.password)
  await click(page, '.q-toggle')
  await click(page, 'button', wait)
  await page.waitForNavigation()
}
