import makeDebug from 'debug'
import { click, isElementVisible } from './utils.js'

const debug = makeDebug('kdk:core:test:dialogs')

export async function closeWelcomeDialog (page) {
  await click(page, '.q-dialog #close-button')
}

export async function closeInstallDialog (page) {
  await click(page, '.q-dialog #ignore-button')
}

export async function isToastVisible (page) {
  return isElementVisible(page, '[role="alert"]')
}