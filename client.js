// Need this as export * only exports named exports but not the default export
import core from './core/client/index.js'
import map from './map/client/index.js'
const kdk = { core, map }

export default kdk
export * as kdkCore from './core/client/index.js'
export * as kdkMap from './map/client/index.js'
