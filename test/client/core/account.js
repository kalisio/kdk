import { click, type, upload } from './utils'
import { clickAction, clickLeftPaneAction, clickTopPaneAction } from './layout'

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
  if (avatarPath) await upload(page, '.dz-hidden-input', avatarPath)
  await clickAction(page, 'apply-button', wait)
}

export async function deleteAccount (page, name, wait = 3000) {
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
