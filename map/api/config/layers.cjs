const makeDebug = require('debug')
const debug = makeDebug('kdk:map:config:layers')

module.exports = function (layerFiles, context) {
  // Request layer definition files
  debug('Processing the following layer definition files to build catalog from', layerFiles)

  // Process them
  let layers = []
  layerFiles.forEach(layerFile => {
    let layersFromFile
    try {
      layersFromFile = require(layerFile)
    } catch (error) {
      console.error(error)
    }
    // Layers provided through a generation function ?
    if (typeof layersFromFile === 'function') layersFromFile = layersFromFile(context)
    // Layers directly provided as array or object
    else if (!Array.isArray(layersFromFile)) layersFromFile = [layersFromFile]
    layers = layers.concat(layersFromFile)
  })
  debug(`Found ${layers.length} layer definitions to build catalog from`)

  // No layers by default
  let filter = []
  // Now build filter according any env filter
  if (process.env.LAYERS_FILTER) {
    // Check for wildcard to get all layers
    if (process.env.LAYERS_FILTER === '*') filter = layers.map(layer => layer.name.replace('Layers.', ''))
    // Check for list with separator, whitespace or comma is supported
    else if (process.env.LAYERS_FILTER.includes(',')) filter = process.env.LAYERS_FILTER.split(',')
    else filter = process.env.LAYERS_FILTER.split(' ')
  }
  // Now filter layers
  // Manage translation keys starting with 'Layers.'
  debug('Applying layer filter', filter)
  return layers.filter(layer => {
    const isFiltered = !filter.includes(layer.name.replace('Layers.', ''))
    if (isFiltered) debug(`Filtering ${layer.name} from catalog`)
    return !isFiltered
  })
}
