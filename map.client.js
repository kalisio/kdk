// Need this as export * only exports named exports but not the default export
import client from './map/client/index.js'
export default client

export * from './map/client/index.js'
