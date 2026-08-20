import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { config } from '@vue/test-utils'
import { Schema } from '../../core/common/schema.js'
import { vSafeHtml } from '../../core/client/directives/index.js'

installQuasarPlugin()

// Initialize AJV schema validator used by KForm / useSchema
Schema.initialize()

config.global.mocks = {
  $tie: (str) => str,
  $t: (str) => str
}

// Registered by the consuming application in real usage (app.directive('safe-html', ...)).
// Without it, components using v-safe-html (KChip, KTextArea, ...) warn on every mount.
config.global.directives = {
  'safe-html': vSafeHtml
}
