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

import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuration Vitest pour les tests unitaires de composants KDK
// Quasar est configuré via installQuasarPlugin() dans test/setup.js.
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      // Alias nécessaires pour les imports dans les composants KDK
      'config': fileURLToPath(new URL('./config.js', import.meta.url)),
      'quasar': fileURLToPath(new URL('./node_modules/quasar/dist/quasar.esm.prod.js', import.meta.url))
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
    css: false
  }
})
