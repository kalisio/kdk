import * as commonMixins from './mixins/index.js'
import * as globeMixins from './mixins/globe/index.js'
import * as hooks from './hooks/index.js'
import * as utils from './utils.globe.js'
import init from './init.js'

const mixins = Object.assign({}, commonMixins, { globe: globeMixins })

export * from './geolocation.js'
export * from './planets.js'
export * from './navigator.js'
export { hooks }
export { utils }
export { mixins }
export * from '../common/index.js'
export * from './init.js'

export default init
