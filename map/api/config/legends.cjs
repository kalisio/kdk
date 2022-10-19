const makeDebug = require('debug')
const debug = makeDebug('kdk:map:config:legends')

module.exports = function (legendFiles, context) {
  // Request legends definition files
  debug('Processing the following legend definition files to build catalog from', legendFiles)

  // Process them
  let legends = []
  legendFiles.forEach(legendFile => {
    let legendsFromFile
    try {
      legendsFromFile = require(legendFile)
    } catch (error) {
      console.error(error)
    }
    // Legends provided through a generation function ?
    if (typeof legendsFromFile === 'function') legendsFromFile = legendsFromFile(context)
    // Legends directly provided as array or object
    else if (!Array.isArray(legendsFromFile)) legendsFromFile = [legendsFromFile]
    legends = legends.concat(legendsFromFile)
  })
  debug(`Found ${legends.length} legend definitions to build catalog from`)

  // All legends by default
  let filter = legends.map(legend => legend.name.replace('Legends.', ''))
  // Now build filter according any env filter
  // Check for wildcard to get all legends
  if (process.env.LEGENDS_FILTER && (process.env.LEGENDS_FILTER !== '*')) {
    // Check for list with separator, whitespace or comma is supported
    if (process.env.LEGENDS_FILTER.includes(',')) filter = process.env.LEGENDS_FILTER.split(',')
    else filter = process.env.LEGENDS_FILTER.split(' ')
  }
  // Now filter legends
  // Manage translation keys starting with 'Legends.'
  debug('Applying legend filter', filter)
  return legends.filter(legend => {
    const isFiltered = !filter.includes(legend.name.replace('Legends.', ''))
    if (isFiltered) debug(`Filtering ${legend.name} from catalog`)
    return !isFiltered
  })
}
