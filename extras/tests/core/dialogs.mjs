import { click, isElementVisible } from './utils.mjs'

export async function closeWelcomeDialog (page) {
  await click(page, '.q-dialog #close-button')
}

export async function closeInstallDialog (page) {
  await click(page, '.q-dialog #ignore-button')
}

export async function isToastVisible (page) {
  return isElementVisible(page, '[role="alert"]')
}
