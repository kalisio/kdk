import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { config } from '@vue/test-utils'

installQuasarPlugin()

config.global.mocks = {
  $tie: (str) => str,
  $t: (str) => str
}