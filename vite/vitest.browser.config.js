import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

// Configuration Vitest Browser Mode pour les tests de composants KDK
// Utilise Playwright (Chromium) comme provider, vitest-browser-vue pour le rendu.
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      'config': fileURLToPath(new URL('./config.js', import.meta.url)),
      'quasar': fileURLToPath(new URL('./node_modules/quasar/dist/quasar.esm.prod.js', import.meta.url)),
      '@components': fileURLToPath(new URL('../core/client/components', import.meta.url)),
      'jwt-decode': fileURLToPath(new URL('./node_modules/jwt-decode/build/jwt-decode.cjs.js', import.meta.url)),
      'vue-i18n': fileURLToPath(new URL('./node_modules/vue-i18n/index.js', import.meta.url)),
      'moment-timezone/builds/moment-timezone-with-data-10-year-range.js':
        fileURLToPath(new URL('./node_modules/moment-timezone/builds/moment-timezone-with-data-10-year-range.js', import.meta.url)),
      'feathers-reactive': fileURLToPath(new URL('./node_modules/feathers-reactive/dist/index.cjs', import.meta.url)),
      '@kalisio/feathers-automerge': fileURLToPath(new URL('./node_modules/@kalisio/feathers-automerge/index.js', import.meta.url)),
      'path-browserify': fileURLToPath(new URL('./node_modules/path-browserify/index.js', import.meta.url)),
      '@thumbmarkjs/thumbmarkjs': fileURLToPath(new URL('./node_modules/@thumbmarkjs/thumbmarkjs/dist/thumbmark.esm.js', import.meta.url)),
      'vue-router': fileURLToPath(new URL('./node_modules/vue-router/dist/vue-router.mjs', import.meta.url)),
      'ajv-i18n': fileURLToPath(new URL('./node_modules/ajv-i18n/localize/index.js', import.meta.url))
    }
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true
    },
    css: false,
    disableConsoleIntercept: true,
    setupFiles: ['./test/setup.js'],
    include: ['test/core/client/components/browser/**/*.browser.test.js']
  }
})
