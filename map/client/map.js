import * as commonMixins from './mixins/index.js'
import * as mapMixins from './mixins/map/index.js'
import * as utils from './utils.js'
import init from './init.js'

const mixins = Object.assign({}, commonMixins, { map: mapMixins })

export * from './geolocation.js'
export * from './legend.js'
export { utils }
export { mixins }
export * from '../common/index.js'

export default init
