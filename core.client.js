// Need this as export * only exports named exports but not the default export
import client from './core/client/index.js'
export default client

export * from './core/client/index.js'
