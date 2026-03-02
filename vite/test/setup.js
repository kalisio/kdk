import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { config } from '@vue/test-utils'
import { Schema } from '../../core/common/schema.js'

installQuasarPlugin()

// Initialize AJV schema validator used by KForm / useSchema
Schema.initialize()

config.global.mocks = {
  $tie: (str) => str,
  $t: (str) => str
}