import { dirname, resolve } from 'node:path'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cesiumSource = '../node_modules/cesium/Build/Cesium'
// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumBaseUrl = 'Cesium'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    Components({
      // relative paths to the directory to search for components.
      dirs: ['../core/client/components', '../map/client/components'],

      // valid file extensions for components.
      extensions: ['vue'],

      // search for subdirectories
      deep: true
    }),
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }),
    vue({
      template: { transformAssetUrls }
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    /* FIXME: generate error on quasar import
    quasar({
      sassVariables: fileURLToPath(new URL('./quasar.variables.scss', import.meta.url))
    })
    */
  ],
  build: {
    outDir: './dist',
    minify: false,
    //emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, '../client.js'),
      name: 'KDK',
      // the proper extensions will be added
      fileName: 'kdk.client',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          process: false
        }
      }
    }
  },
  define: {
    'process.env': process.env,
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`)
  },
  resolve: {
    alias: {
      'config': fileURLToPath(new URL('./config.js', import.meta.url)), // Alias for client config
      // FIXME: It does not seem that alias can target multiple directories unlink with Webpack.
      // However we should also provide alias for files located in the map part
      '@components': fileURLToPath(new URL('../core/client/components', import.meta.url)),
      '@schemas': fileURLToPath(new URL('../core/client/schemas', import.meta.url)),
      '@i18n': fileURLToPath(new URL('../core/client/i18n', import.meta.url))
    }
  }/*,
  optimizeDeps: {
    include: ['leaflet'],
  }*/
})