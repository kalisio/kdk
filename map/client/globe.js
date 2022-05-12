import * as commonMixins from './mixins/index.js'
import * as globeMixins from './mixins/globe/index.js'
import * as utils from './utils.js'
import init from './init.js'

const mixins = Object.assign({}, commonMixins, { globe: globeMixins })

export * from './geolocation.js'
export { utils }
export { mixins }
export * from '../common/index.js'

export default init
