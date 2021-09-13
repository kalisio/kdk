import { click, type } from './utils'
import { clickLeftPaneAction, clickTopPaneAction } from './layout'

export async function manageAccount (page, tab = 'profile') {
  await clickLeftPaneAction(page, 'manage-account')
  if (tab === 'security') await clickTopPaneAction(page, 'profile')
  if (tab === 'danger-zone') await clickTopPaneAction(page, 'danger-zone')
}

export async function deleteAccount (page, name) {
  await manageAccount(page, 'danger-zone')
  await click(page, '#block-action')
  await type(page, '.q-dialog input', name)
  await Promise.all([
    page.waitForNavigation(),
    click(page, '.q-dialog button:nth-child(2)')
  ])
}