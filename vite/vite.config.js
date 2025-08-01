import { dirname, resolve } from 'node:path'
import path from 'path'
import fs from 'fs-extra'
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

const plugins = [
  nodePolyfills({}),
  Components({
    // relative paths to the directory to search for components.
    dirs: ['../core/client/components', '../map/client/components'],
    // valid file extensions for components.
    extensions: ['vue'],
    // search for subdirectories
    deep: true
  }),
  vue({
    template: { transformAssetUrls }
  })
]

if (process.env.GLOBE) {
  plugins.push(viteStaticCopy({
    targets: [
      { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
      { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
      { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
      { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
    ],
  }))
  const html = fs.readFileSync('./index_with_globe.html', 'utf8')
  fs.writeFileSync('./index.html', html, { encoding: 'utf8' })
} else {
  const html = fs.readFileSync('./index_with_map.html', 'utf8')
  fs.writeFileSync('./index.html', html, { encoding: 'utf8' })
}

// @quasar/plugin-vite options list:
// https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
// FIXME: generate errors on quasar import in dev mode
if (process.env.BUILD_MODE) {
  plugins.push(quasar({
    sassVariables: fileURLToPath(new URL('./quasar.variables.scss', import.meta.url))
  }))
}

const build = {
  outDir: './dist',
  minify: !process.env.DEBUG,
  emptyOutDir: true,
  rollupOptions: {
    // Make sure to externalize deps that shouldn't be bundled into your library
    external: [],
    output: {
      // Provide global variables to use in the UMD build for externalized deps
      /*
      globals: {
        process: false
      }
      */
    }
  }
}

if (process.env.BUILD_MODE === 'lib') {
  build.lib = {
    entry: resolve(__dirname, '../client.js'),
    name: 'KDK',
    // the proper extensions will be added
    fileName: 'kdk.client',
  }
  // Do not package all dependencies, should be done by embedding app
  const packageInfo = fs.readJsonSync(path.join(__dirname, '../package.json'))
  build.rollupOptions.external = Object.keys(packageInfo.dependencies)
}

export default defineConfig({
  plugins,
  build,
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`)
  },
  resolve: {
    alias: {
      // Here are specific required KDK aliases
      'config': fileURLToPath(new URL('./config.js', import.meta.url)), // Alias for client config
      // FIXME: It does not seem that alias can target multiple directories unlink with Webpack.
      // However we should also provide alias for files located in the map part
      '@components': fileURLToPath(new URL('../core/client/components', import.meta.url)),
      '@schemas': fileURLToPath(new URL('../core/client/schemas', import.meta.url)),
      '@i18n': fileURLToPath(new URL('../core/client/i18n', import.meta.url)),
      'kdk/core.variables': fileURLToPath(new URL('../extras/css/core.variables.scss', import.meta.url)),
      'kdk/map.variables': fileURLToPath(new URL('../extras/css/map.variables.scss', import.meta.url))
    }
  },
  optimizeDeps: {
    include: [],
    exclude: []
  }
})
