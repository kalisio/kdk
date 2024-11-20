import * as composables from './composables/index.js'
import * as commonMixins from './mixins/index.js'
import * as mapMixins from './mixins/map/index.js'
import * as hooks from './hooks/index.js'
import * as utils from './utils.map.js'
import init from './init.js'

const mixins = Object.assign({}, commonMixins, { map: mapMixins })

export * from './geolocation.js'
export * from './planets.js'
export * from './navigator.js'
export { hooks }
export { utils }
export { composables }
export { mixins }
export * from '../common/index.js'
export * from './init.js'

export default init
