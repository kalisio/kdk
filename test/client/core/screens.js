import { click, type } from './utils'

export async function login (page, email, password, wait = 2000) {
  await type(page, '#email-field', email)
  await type(page, '#password-field', password)
  await Promise.all([
    page.waitForNavigation(),
    click(page, 'button', wait)
  ])
}

export async function goToRegisterScreen (page) {
  await Promise.all([
    page.waitForNavigation(),
    click(page, '#register-link')
  ])
}

export async function register (page, name, email, password, wait = 5000) {
  await type(page, '#name-field', name)
  await type(page, '#email-field', email)
  await type(page, '#password-field', password)
  await type(page, '#confirmPassword-field', password)
  await click(page, '.q-toggle')
  await Promise.all([
    page.waitForNavigation(),
    click(page, 'button', wait)
  ])
}
