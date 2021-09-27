import { click, type } from './utils'

export async function goToLoginScreen (page) {
  await Promise.all([
    page.waitForNavigation(),
    click(page, '#login-link')
  ])
}

export async function login (page, user, wait = 3000) {
  await type(page, '#email-field', user.email)
  await type(page, '#password-field', user.password)
  await click(page, 'button', wait)
}

export async function goToRegisterScreen (page) {
  await Promise.all([
    page.waitForNavigation(),
    click(page, '#register-link')
  ])
}

export async function register (page, user, wait = 5000) {
  await type(page, '#name-field', user.name)
  await type(page, '#email-field', user.email)
  await type(page, '#password-field', user.password)
  await type(page, '#confirmPassword-field', user.password)
  await click(page, '.q-toggle')
  await click(page, 'button', wait)
}
