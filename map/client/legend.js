import logger from 'loglevel'

// Export singleton
export const Legend = {
  components: {},
  register (type, component) {
    if (!type) {
      logger.error('The legend type you register must be defined')
      return
    }
    if (!component) {
      logger.error('The legend component you register must be defined')
      return
    }
    logger.debug(`Registering ${component} for legend of type of ${type}`)
    this.components[type] = component
  },
  get (type) {
    if (!type) {
      logger.error('The legend type you requested must be defined')
      return
    }
    return this.components[type]
  }
}
