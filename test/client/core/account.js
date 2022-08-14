import { click, clickAction, type, uploadFile } from './utils.js'
import { clickLeftPaneAction, clickTopPaneAction } from './layout.js'

export async function manageAccount (page, tab = 'profile') {
  const url = page.url()
  if (!url.includes('account')) await clickLeftPaneAction(page, 'manage-account')
  if (tab === 'profile') {
    if (!url.includes('profile')) await clickTopPaneAction(page, 'profile')
  } else if (tab === 'security') {
    if (!url.includes('security')) await clickTopPaneAction(page, 'security')
  } else {
    if (!url.includes('danger-zone')) await clickTopPaneAction(page, 'danger-zone')
  }
}

export async function updateAccountProfile (page, name, avatarPath, wait = 3000) {
  await manageAccount(page, 'profile')
  await type(page, '#name-field', name, false, true)
  if (avatarPath) await uploadFile(page, '.dz-hidden-input', avatarPath)
  await clickAction(page, 'apply-button', wait)
}

export async function updateAccountPassword (page, oldPassword, newPassword, wait = 1000) {
  await manageAccount(page, 'security')
  await click(page, '#password-block button', 1000)
  await type(page, '#oldPassword-field', oldPassword)
  await type(page, '#password-field', newPassword)
  await type(page, '#confirmPassword-field', newPassword)
  await click(page, 'button', 20000)
  await click(page, '.la-arrow-left', wait)
}

export async function updateAccountEmail (page, password, email, wait = 5000) {
  await manageAccount(page, 'security')
  await click(page, '#email-block button', 1000)
  await type(page, '#password-field', password)
  await type(page, '#email-field', email)
  await click(page, 'button', wait)
}

export async function deleteAccount (page, name, wait = 10000) {
  await manageAccount(page, 'danger-zone')
  await click(page, '#block-action')
  await type(page, '.q-dialog input', name)
  await click(page, '.q-dialog button:nth-child(2)')
  await page.waitForTimeout(wait)
}

export async function closeSignupAlert (page) {
  await page.waitForTimeout(1000)
  await click(page, '#close-signup-alert')
  await page.waitForTimeout(500)
}
