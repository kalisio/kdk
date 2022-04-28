// Need this as export * only exports named exports but not the default export
import api from './core/api/index.js'
export default api

export * from './core/api/index.js'
