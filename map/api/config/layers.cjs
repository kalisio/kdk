const minimatch = require('minimatch')
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

  let allow = [] // Patterns for allowed layers
  let skip = []  // Patterns for skipped layers
  // Extract patterns from LAYERS_FILTER env var, patterns starting with '-' are skip patterns
  if (process.env.LAYERS_FILTER) {
    const patterns = process.env.LAYERS_FILTER.includes(',')
          ? process.env.LAYERS_FILTER.split(',')
          : process.env.LAYERS_FILTER.split(' ')
    patterns.forEach((pattern) => {
      if (pattern[0] == '-') {
        skip.push(pattern.substring(1))
      } else {
        allow.push(pattern)
      }
    })
  }

  // Compile patterns
  const allowPattern = new minimatch.Minimatch(`+(${allow.join('|')})`) // Allowing if string matches one or more 'allow' patterns
  const skipPattern = new minimatch.Minimatch(`+(${skip.join('|')})`)   // Skipping if string matches one or more 'skip' patterns

  // Now filter layers
  debug('Allowing layers matching', allow)
  debug('Skipping layers matching', skip)
  return layers.filter(layer => {
    // Manage translation keys starting with 'Layers.'
    const name = layer.name.replace('Layers.', '')
    const allowed = allowPattern.match(name)
    const skipped = skipPattern.match(name)
    if (skipped) debug(`'${layer.name}' was explicitely skipped from catalog`)
    if (!allowed) debug(`'${layer.name}' was not explicitely allowed to be added to catalog`)
    return allowed && !skipped
  })
}
