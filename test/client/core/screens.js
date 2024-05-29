import makeDebug from 'debug'
import { click, clickAction, type } from './utils.js'

const debug = makeDebug('kdk:core:test:screens')

export async function goToLoginScreen (page) {
  await Promise.all([
    page.waitForNavigation(),
    clickAction(page, 'login-link')
  ])
  debug('Login screen ready')
}

export async function login (page, user, wait = 5000) {
  await type(page, '#email-field', user.email)
  await type(page, '#password-field', user.password)
  await clickAction(page, 'login-button', wait)
}

export async function loginWithKeycloak (page, user, wait = 5000) {
  await type(page, '#username', user.name)
  await type(page, '#password', user.password)
  await click(page, '#kc-login', wait)
}

export async function goToRegisterScreen (page) {
  await Promise.all([
    page.waitForNavigation(),
    clickAction(page, 'register-link')
  ])
  debug('Register screen ready')
}

export async function register (page, user, wait = 15000) {
  await type(page, '#name-field', user.name)
  await type(page, '#email-field', user.email)
  await type(page, '#password-field', user.password)
  await type(page, '#confirmPassword-field', user.password)
  await click(page, '.q-toggle')
  await clickAction(page, 'register-button', wait)
}
