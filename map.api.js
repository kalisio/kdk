// Need this as export * only exports named exports but not the default export
import api from './map/api/index.js'
export default api

export * from './map/api/index.js'
