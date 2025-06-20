import { click, clickAction, type, uploadFile, waitForTimeout } from './utils.mjs'
import { clickPaneAction } from './layout.mjs'

export async function updateAccountProfile (page, name, avatarPath, wait = 3000) {
  await clickPaneAction(page, 'left', 'edit-profile')
  await waitForTimeout(wait)
  await type(page, '#name-field', name, false, true)
  if (avatarPath) await uploadFile(page, '#avatar-field', avatarPath)
  await clickAction(page, 'ok-button', wait)
}

export async function updateAccountPassword (page, oldPassword, newPassword, wait = 1000) {
  await clickPaneAction(page, 'left', 'manage-account')
  await click(page, '#password-manager', 1000)
  await type(page, '#oldPassword-field', oldPassword)
  await type(page, '#password-field', newPassword)
  await type(page, '#confirmPassword-field', newPassword)
  await click(page, '#change-password', wait)
}

export async function updateAccountEmail (page, password, email, wait = 5000) {
  await clickPaneAction(page, 'left', 'manage-account')
  await click(page, '#email-manager', 1000)
  await type(page, '#password-field', password)
  await type(page, '#email-field', email)
  await click(page, '#modify-email', wait)
}

export async function deleteAccount (page, name, wait = 10000) {
  await clickPaneAction(page, 'left', 'manage-account')
  await click(page, '#delete-account-manager', 1000)
  await click(page, '#delete-account', 1000)
  await type(page, '.q-dialog-plugin input', name)
  await click(page, '.q-dialog-plugin button:nth-child(2)')
  await waitForTimeout(wait)
}
