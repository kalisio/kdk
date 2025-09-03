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
const alias = {}

// Use the right index and embed Cesium resources if required
if (process.env.GLOBE) {
  if (process.env.BUILD_MODE !== 'lib') {
    plugins.push(viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }))
  }
  const html = fs.readFileSync('./index_with_globe.html', 'utf8')
  fs.writeFileSync('./index.html', html, { encoding: 'utf8' })
} else {
  const html = fs.readFileSync('./index_with_map.html', 'utf8')
  fs.writeFileSync('./index.html', html, { encoding: 'utf8' })
}

const build = {
  outDir: './dist',
  minify: !process.env.DEBUG,
  emptyOutDir: (process.env.BUILD_MODE === 'app'),
  rollupOptions: {
    // Make sure to externalize deps that shouldn't be bundled into your library
    external: [],
    output: {}
  }
}

if (process.env.BUILD_MODE) {
  // @quasar/plugin-vite options list:
  // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
  // FIXME: generate errors on quasar import
  plugins.push(quasar({
    sassVariables: fileURLToPath(new URL('./quasar.variables.scss', import.meta.url))
  }))
}

if (process.env.BUILD_MODE === 'lib') {
  const suffix = (process.env.DEBUG ? '' : '.min')
  build.lib = {
    entry: (process.env.GLOBE ? resolve(__dirname, '../client.js') : resolve(__dirname, '../client.map.js')),
    name: 'KDK',
    // the proper extensions will be added
    fileName: (process.env.GLOBE ? 'kdk.client' : 'kdk.client.map') + suffix,
  }
  // Generate kdk cliet distribution files
  build.outDir = '../client'
  // Do not package all dependencies, should be done by embedding app
  const packageInfo = fs.readJsonSync(path.join(__dirname, '../package.json'))
  let dependencies = Object.keys(packageInfo.dependencies)
  // We need to manually add some dependencies that are included in a "non-standard" way
  dependencies = dependencies.concat([
    'config',
    '@kalisio/feathers-s3/client.js',
    'moment-timezone/builds/moment-timezone-with-data-10-year-range.js',
    'jsdap/src/parser.js',
    'jsdap/src/xdr.js',
    'cesium/Source/Widgets/widgets.css',
    'leaflet/dist/leaflet.css',
    'leaflet-fullscreen/dist/leaflet.fullscreen.css',
    'leaflet.markercluster/dist/MarkerCluster.css',
    'leaflet.markercluster/dist/MarkerCluster.Default.css',
    '@kalisio/leaflet.donutcluster/src/Leaflet.DonutCluster.css',
    '@kalisio/leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css',
    'leaflet.locatecontrol/dist/L.Control.Locate.css',
    'leaflet-timedimension/dist/leaflet.timedimension.control.css',
    '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  ])
  build.rollupOptions.external = dependencies
  // Single file
  build.lib.formats = ['es']
  build.rollupOptions.output.manualChunks = (id) => 'kdk'
} else {
  Object.assign(alias, {
    // FIXME: How to include Quasar language packs ?
    //'quasar/lang': fileURLToPath(new URL('../node_modules/quasar/lang', import.meta.url)),
    // Here are specific required KDK aliases
    'config': fileURLToPath(new URL('./config.js', import.meta.url)), // Alias for client config
    // FIXME: It does not seem that alias can target multiple directories unlike with Webpack.
    // However we should also provide alias for files located in the map part
    // This requires to rewrite some code in loadComponent utility function
    '@components': fileURLToPath(new URL('../core/client/components', import.meta.url)),
    '@schemas': fileURLToPath(new URL('../extras/schemas', import.meta.url)),
    '@i18n': fileURLToPath(new URL('../extras/i18n', import.meta.url)),
    'kdk/core.variables': fileURLToPath(new URL('../extras/css/core.variables.scss', import.meta.url))
  })
}

// List of warnings to hide because we use newer Vite preprocessor with an old Quasar version
const silenceDeprecations = ['import', 'slash-div', 'global-builtin', 'mixed-decls', 'color-functions']

export default defineConfig({
  plugins,
  build,
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`)
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations,
        quietDeps: true
      },
      sass: {
        silenceDeprecations,
        quietDeps: true
      }
    },
  },
  resolve: {
    alias
  },
  optimizeDeps: {
    include: [],
    exclude: []
  }
})
