// import { defineConfig, mergeConfig } from 'vite'
// import viteConfig from './vite.config'
// import 'vitest/config'
//
// export default mergeConfig(
//   viteConfig,
//   defineConfig({
//     test: {
//       environment: 'jsdom',
//       disableConsoleIntercept: true
//     }
//   })
// )

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'

// Configuration Vitest pour les tests unitaires de composants KDK
// Quasar est configuré via installQuasarPlugin() dans test/setup.js.
export default defineConfig({
  // Both @thumbmarkjs/thumbmarkjs's and the built client/kdk.client.map.js's published sourcemaps
  // reference "sources" paths (original .ts files, a worker's .map) that aren't shipped in the
  // package/build output, even though sourcesContent is embedded. Vite warns about this at the
  // logger level regardless, so drop its own diagnostics to errors only - this doesn't affect
  // Vue's component warnings or actual test failures, which go through separate channels.
  logLevel: 'error',
  plugins: [
    // Mirrors vite.config.js: core/client/, map/client/ and client/ (the built lib) sit outside
    // vite/, so plain ancestor-walk resolution can't see vite/node_modules from their source
    // files. This resolves bare imports against it generically instead of aliasing each one.
    nodeResolve({
      rootDir: path.join(process.cwd(), '.'),
      modulePaths: [path.join(process.cwd(), 'node_modules')]
    }),
    // Mirrors vite.config.js: the real app never registers components explicitly (eg. <k-action>
    // in KForm.vue) - this plugin auto-resolves them by scanning the component directories.
    // Without it, any kebab-case tag referenced in a template (even one guarded by v-if/v-for
    // that never renders) warns on every mount, since Vue's compiler eagerly hoists all
    // resolveComponent() calls to the top of the render function.
    Components({
      dirs: ['../core/client/components', '../map/client/components'],
      extensions: ['vue'],
      deep: true
    }),
    vue()
  ],
  resolve: {
    alias: {
      'config': fileURLToPath(new URL('./config.js', import.meta.url)),
      'quasar': fileURLToPath(new URL('./node_modules/quasar/dist/quasar.esm.prod.js', import.meta.url)),
      // Resolves @components/ imports used by loadComponent() in KDK utils
      '@components': fileURLToPath(new URL('../core/client/components', import.meta.url)),
      // Packages installed in vite/node_modules but not resolvable from core/client/ source files.
      // Vite parses all imported files (including mocked ones) and must resolve their dependencies.
      '@kalisio/common-core/utilities': fileURLToPath(new URL('./node_modules/@kalisio/common-core/dist/utilities/index.mjs', import.meta.url)),
      '@kalisio/common-core/predicates': fileURLToPath(new URL('./node_modules/@kalisio/common-core/dist/predicates/index.mjs', import.meta.url)),
      '@kalisio/common-graphics': fileURLToPath(new URL('./node_modules/@kalisio/common-graphics/dist/index.mjs', import.meta.url)),
      'jwt-decode': fileURLToPath(new URL('./node_modules/jwt-decode/build/jwt-decode.cjs.js', import.meta.url)),
      'vue-i18n': fileURLToPath(new URL('./node_modules/vue-i18n/index.js', import.meta.url)),
      'moment-timezone/builds/moment-timezone-with-data-10-year-range.js':
        fileURLToPath(new URL('./node_modules/moment-timezone/builds/moment-timezone-with-data-10-year-range.js', import.meta.url)),
      'feathers-reactive': fileURLToPath(new URL('./node_modules/feathers-reactive/dist/index.cjs', import.meta.url)),
      '@kalisio/feathers-automerge': fileURLToPath(new URL('./node_modules/@kalisio/feathers-automerge/lib/index.js', import.meta.url)),
      'path-browserify': fileURLToPath(new URL('./node_modules/path-browserify/index.js', import.meta.url)),
      '@thumbmarkjs/thumbmarkjs': fileURLToPath(new URL('./node_modules/@thumbmarkjs/thumbmarkjs/dist/thumbmark.esm.js', import.meta.url)),
      'vue-router': fileURLToPath(new URL('./node_modules/vue-router/dist/vue-router.mjs', import.meta.url)),
      'ajv-i18n': fileURLToPath(new URL('./node_modules/ajv-i18n/localize/index.js', import.meta.url)),
      // This library does not seem to have a valid configuration in package.json (matches vite.config.js)
      jsts: fileURLToPath(new URL('./node_modules/jsts/dist/jsts.min.js', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'legacy' },
      sass: { api: 'legacy' }
    }
  },
  test: {
    environment: 'jsdom',
    disableConsoleIntercept: true,
    setupFiles: ['./test/setup.js'],
    css: false,
    exclude: ['**/node_modules/**', '**/*.browser.test.js']
  }
})
